/* Server-owned Arena word race. No client can select letters, targets, winners or rewards. */
'use strict';
const {randomBytes,createHash}=require('node:crypto'),wallet=require('./frontline-wallet');
const ROOT='arena_v1_live/v1',HOMES=[[-12,13],[12,13],[-12,-13],[12,-13]],AZ='ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const near=(a,b,r)=>Math.hypot(a.x-b.x,a.z-b.z)<=r;
function field(){return Object.fromEntries([...AZ].map((ch,i)=>{const a=i/26*Math.PI*2+.25,r=i%2?23:27;return ['a'+i,{ch,x:+(Math.sin(a)*r).toFixed(2),z:+(Math.cos(a)*r).toFixed(2),rev:0}];}));}
function advance(s,now,newWord){if(s.word.completedAt&&now-s.word.completedAt>=2500)s.word=newWord(s.word.round+1);}
function finish(s,uid,p,now){
 if(s.word.completedAt)return false;let rest=p.bank;
 for(const ch of s.word.target){const i=rest.indexOf(ch);if(i<0)return false;rest=rest.slice(0,i)+rest.slice(i+1);}
 p.bank=rest;p.baseRevision++;s.word.completedAt=now;s.word.winnerId=uid;s.word.winnerName=p.name;p.earned+=1000;return true;
}
function reduce(s,uid,data,position,now,newWord,run){
 if(!s)s={run,version:0,word:newWord(0),players:{},items:field()};
 advance(s,now,newWord);
 let p=s.players[uid];
 const occupied=Object.entries(s.players).filter(([id,v])=>id!==uid&&now-v.at<90000).map(([,v])=>v.slot);
 if(!p||occupied.includes(p.slot)){const slot=[0,1,2,3].find(i=>!occupied.includes(i));if(slot===undefined)throw Error('room_full');p=s.players[uid]={bank:p?.bank||'',carried:p?.carried||'',revision:p?.revision||0,earned:p?.earned||0,hp:p?.hp??5000,hitAt:0,baseRevision:p?.baseRevision||0,slot};}
 p.at=now;p.name=position.name;
 const home={x:HOMES[p.slot][0],z:HOMES[p.slot][1]},alive=!position.down;
 if(data.action==='pickup'&&alive&&!p.carried){
  const item=s.items[data.item];
  if(item&&item.rev===data.revision&&(!item.blockedUntil||item.blockedId!==uid||now>=item.blockedUntil)&&near(position,item,2.8)){
   p.carried=item.ch;p.revision++;p.fresh=!item.dropped;
   if(data.item[0]==='a'){
    // Keep pickup circles disjoint: standing on a wanted letter must not collect its neighbour.
    const index=Number(data.item.slice(1));
    for(let pass=0;pass<160;pass++){const a=(item.rev+1)*2.399963+index+pass*2.399963,r=5+(pass*17+index*7+item.rev*11)%23,candidate={x:+(Math.sin(a)*r).toFixed(2),z:+(Math.cos(a)*r).toFixed(2)};
     if(HOMES.some(([x,z])=>near(candidate,{x,z},7))||Object.entries(s.items).some(([id,v])=>id!==data.item&&near(candidate,v,5.8)))continue;
     item.x=candidate.x;item.z=candidate.z;break;
    }
    item.rev++;
   }
   else delete s.items[data.item];
  }
 }
 if(data.action==='bank'&&alive&&data.revision===p.revision&&data.round===s.word.round&&near(position,home,3.3)){
  if(p.carried&&p.bank.length<999){p.bank+=p.carried;p.carried='';p.revision++;p.baseRevision++;}
  finish(s,uid,p,now);
 }
 if((data.action==='drop'||position.down)&&p.carried&&(position.down||data.revision===p.revision)){
  s.items['d'+p.slot]={ch:p.carried,x:position.x,z:position.z,rev:now,dropped:true,blockedId:uid,blockedUntil:now+1250};p.carried='';p.revision++;
 }
 
 const enemy=s.players[data.owner],enemyHome=enemy&&{x:HOMES[enemy.slot][0],z:HOMES[enemy.slot][1]};
 if(alive&&enemy&&data.owner!==uid&&data.revision===enemy.baseRevision){
  if(data.action==='hit'&&enemy.hp>0&&near(position,enemyHome,15)&&now-(p.hitAt||0)>=700){enemy.hp=Math.max(0,enemy.hp-250);enemy.baseRevision++;p.hitAt=now;}
  if(data.action==='raid'&&enemy.hp===0&&!p.carried&&enemy.bank&&near(position,enemyHome,3.3)){
   const ch=[...s.word.target].find(c=>enemy.bank.includes(c))||enemy.bank[0];enemy.bank=enemy.bank.replace(ch,'');enemy.baseRevision++;p.carried=ch;p.revision++;p.fresh=false;
  }
 }
 s.version++;return s;
}
exports.ROOT=ROOT;exports.HOMES=HOMES;exports.reduce=reduce;exports.field=field;
exports.createService=function(db,F){
 async function tx(ref,fn){const seed=(await ref.get()).val();let first=true;return ref.transaction(v=>{if(first&&v===null)v=seed;first=false;return fn(v);},undefined,false);}
 return async function(data,uid){
  if(!uid)throw Error('unauthenticated');
  if(!data||!/^r(?:2[1-9]|3[0-5])$/.test(data.code)||!['sync','pickup','bank','drop','hit','raid','settle'].includes(data.action))throw Error('invalid_request');
  const now=Date.now(),ref=db.ref(ROOT+'/rooms/'+data.code);
  if(data.action==='settle'){
   const s=(await ref.get()).val(),total=s?.players?.[uid]?.earned||0;
   if(!s)return {total:0,amount:0};
   const key=createHash('sha256').update('arena:'+data.code+':'+s.run).digest('hex').slice(0,24),save=db.ref('users/'+uid+'/save'),ledger=db.ref(ROOT+'/claims/'+uid+'/'+key),lease=randomBytes(12).toString('hex');
   const lock=await tx(ledger,v=>v?.lease&&now-v.at<30000?undefined:{paid:v?.paid||0,lease,at:now});
   if(!lock.committed)throw Error('claim_busy');
   try{
    const paid=lock.snapshot.val().paid;
    const result=total>paid?await tx(save,v=>wallet.credit(v,key,total,now,paid,'arenaRaceReceipts')):{committed:true,snapshot:await save.get()};
    if(!result.committed)throw Error('save_failed');
    await ledger.set({paid:Math.max(paid,total),at:now});return {key,total,amount:Math.max(0,total-paid),save:result.snapshot.val()};
   }finally{await tx(ledger,v=>v?.lease===lease?{paid:v.paid||0,at:Date.now()}:undefined);}
  }
  const [hot,cold]=await Promise.all([db.ref('wroom/adv/'+data.code+'/'+uid).get(),db.ref('winfo/adv/'+data.code+'/'+uid).get()]);
  const h=hot.val(),c=cold.val();
  if(!h||!c||!String(c.h||'').startsWith('A3:')||now-c.t>90000||!Number.isFinite(h.x)||!Number.isFinite(h.z)||Math.hypot(h.x,h.z)>35)throw Error('seat_expired');
  const position={x:h.x,z:h.z,down:!!h.m||String(c.h).split(':')[2]==='1',name:String(c.n||'ผู้เล่น').slice(0,40)};
  const run=randomBytes(12).toString('hex');
  const result=await tx(ref,s=>reduce(s,uid,data,position,now,F.newWord,run));
  const s=result.snapshot.val(),p=s.players[uid];
  return {version:s.version,run:s.run,word:s.word,items:s.items,self:p,bases:Object.fromEntries(Object.entries(s.players).filter(([,v])=>now-v.at<90000).map(([id,v])=>[id,{slot:v.slot,hp:v.hp,revision:v.baseRevision,count:v.bank.length,name:v.name}])),seats:Object.fromEntries(Object.entries(s.players).filter(([,v])=>now-v.at<90000).map(([id,v])=>[id,v.slot]))};
 };
};
