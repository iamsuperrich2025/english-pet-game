'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const {createService,ROOT,HOMES,reduce}=require('./arena-race'),{memoryDatabase}=require('./test_frontline');
const F={newWord:round=>({round,target:round%2?'BOOK':'APPLE',translation:round%2?'หนังสือ':'แอปเปิล',completedAt:0,winnerId:''})};
(async()=>{
 const db=memoryDatabase(),api=createService(db,F),room=ROOT+'/rooms/r21';let now=1900000000000,checks=0;const realNow=Date.now;Date.now=()=>now;
 const ok=(name,value)=>{assert.ok(value,name);checks++;console.log('PASS '+name);};
 function move(uid,x,z,down=false){db.values.set('wroom/adv/r21/'+uid,{x,z,m:down?1:0});db.values.set('winfo/adv/r21/'+uid,{h:'A3:100:'+Number(down)+':-',n:uid,t:now});}
 const call=(uid,action,extra={})=>api({action,code:'r21',...extra},uid);
 try{
 await assert.rejects(()=>api({action:'sync',code:'r21'},null),/unauthenticated/);checks++;
 await assert.rejects(()=>api({action:'sync',code:'r0'},'p0'),/invalid/);checks++;
 await assert.rejects(()=>call('p0','sync'),/seat_expired/);checks++;
 for(let i=0;i<4;i++){move('p'+i,0,0);await call('p'+i,'sync');}
 let a=await call('p0','sync'),b=await call('p1','sync');ok('all players see APPLE and same 26 field letters',a.word.target===b.word.target&&Object.keys(a.items).length===26);ok('house HP 5000 and private banks',a.self.hp===5000&&!a.players&&!a.bases.p1.bank);
 move('p4',0,0);await assert.rejects(()=>call('p4','sync'),/room_full/);checks++;
 const letter=a.items.a0;move('p0',letter.x,letter.z);move('p1',letter.x,letter.z);
 const picks=await Promise.all(['p0','p1'].map(id=>call(id,'pickup',{item:'a0',revision:0})));ok('simultaneous pickup has one owner',picks.filter(r=>r.self.carried==='A').length===1);
 a=await call('p0','sync');ok('relocated letters have disjoint pickup circles',Object.values(a.items).every((x,i,all)=>all.every((y,j)=>i===j||Math.hypot(x.x-y.x,x.z-y.z)>5.8)));const before=a.self.revision;await call('p0','pickup',{item:'a0',revision:0});a=await call('p0','sync');ok('repeated pickup cannot duplicate cargo',a.self.carried==='A'&&a.self.revision===before);
 const other=a.items.a1;move('p0',other.x,other.z);a=await call('p0','pickup',{item:'a1',revision:other.rev});ok('carry capacity is one',a.self.carried==='A'&&a.items.a1.rev===other.rev);
 a=await call('p0','bank',{revision:a.self.revision,round:0});ok('remote bank rejected',a.self.bank==='');
 move('p0',...HOMES[a.self.slot]);a=await call('p0','bank',{revision:a.self.revision,round:0});ok('own home banks cargo',a.self.bank==='A'&&!a.self.carried);
 const s=db.values.get(room);s.players.p0.bank='APPLZ';s.players.p0.carried='E';s.players.p1.bank='APPLQ';s.players.p1.carried='E';
 for(const id of ['p0','p1'])move(id,...HOMES[s.players[id].slot]);
 await Promise.all(['p0','p1'].map(id=>call(id,'bank',{revision:s.players[id].revision,round:0})));
 a=await call('p0','sync');b=await call('p1','sync');ok('simultaneous word completion awards only first player',a.word.winnerId==='p0'&&a.self.earned===1000&&b.self.earned===0);ok('repeated P consumed twice; loser retains bank',a.self.bank==='Z'&&b.self.bank==='APPLQE');
 await call('p0','bank',{revision:a.self.revision,round:0});ok('duplicate deposit cannot pay again',db.values.get(room).players.p0.earned===1000);
 now+=2600;for(const id of ['p0','p1'])move(id,...HOMES[db.values.get(room).players[id].slot]);a=await call('p0','sync');b=await call('p1','sync');ok('next shared word changes for everyone',a.word.target==='BOOK'&&b.word.round===1);
 const victim=db.values.get(room).players.p1;victim.bank='XYZ';move('p0',...HOMES[victim.slot]);a=await call('p0','raid',{owner:'p1',revision:victim.baseRevision});ok('intact house prevents theft',!a.self.carried);
 for(let i=0;i<20;i++){now+=701;move('p0',HOMES[victim.slot][0]-7,HOMES[victim.slot][1]);a=await call('p0','hit',{owner:'p1',revision:db.values.get(room).players.p1.baseRevision});}
 ok('20 server-validated hits destroy 5000 HP house',a.bases.p1.hp===0);
 move('p0',...HOMES[victim.slot]);move('p2',...HOMES[victim.slot]);const rev=db.values.get(room).players.p1.baseRevision;
 const raids=await Promise.all(['p0','p2'].map(id=>call(id,'raid',{owner:'p1',revision:rev})));ok('ruined house letter can be taken exactly once',raids.filter(r=>r.self.carried==='X').length===1&&db.values.get(room).players.p1.bank==='YZ');
 a=await call('p0','sync');await call('p0','drop',{revision:a.self.revision});a=await call('p0','sync');const drop=Object.entries(a.items).find(([,x])=>x.dropped);ok('DROP releases carried letter',!!drop&&!a.self.carried);
 a=await call('p0','pickup',{item:drop[0],revision:drop[1].rev});ok('owner cannot immediately farm dropped letters',!a.self.carried);
 move('p3',drop[1].x,drop[1].z);let d=await call('p3','pickup',{item:drop[0],revision:drop[1].rev});ok('other player takes dropped letter without MEGA charge',d.self.carried==='X'&&!d.self.fresh);
 move('p3',0,0,true);d=await call('p3','sync');ok('downing releases carried letter and keeps bank',!d.self.carried&&Object.values(d.items).some(x=>x.ch==='X'&&x.dropped));
 const saved='users/p0/save';db.values.set(saved,{data:JSON.stringify({coins:100,lifetimeCoins:0,pets:['keep']})});const payment=await call('p0','settle');ok('winner gets central wallet 1000',JSON.parse(payment.save.data).coins===1100);const twice=await call('p0','settle');ok('settlement retry does not pay twice',twice.amount===0&&JSON.parse(twice.save.data).coins===1100);
 const stale=JSON.parse(twice.save.data);delete stale.arenaRaceReceipts;db.values.set(saved,{data:JSON.stringify(stale)});const paidAgain=await call('p0','settle');ok('private ledger prevents repayment after stale receipt',paidAgain.amount===0);
 const client={window:{},state:{coins:100},addCoins(n){this.state.coins+=n},saveState(){}};client.addCoins=n=>client.state.coins+=n;vm.runInNewContext(fs.readFileSync(path.join(__dirname,'../js/arena-race.js'),'utf8'),client);client.window.ArenaRace.mergeCredit(payment);client.window.ArenaRace.mergeCredit(payment);ok('client receipt recovery is idempotent',client.state.coins===1100);
 const auth=fs.readFileSync(path.join(__dirname,'../js/auth.js'),'utf8'),start=auth.indexOf('let authCloudWriteQueue'),end=auth.indexOf('function authDeleteCloud',start),ctx={authSaveRef:uid=>db.ref('users/'+uid+'/save'),Date};
 db.values.set(saved,payment.save);vm.runInNewContext(auth.slice(start,end)+'\nthis.write=authWriteCloud;',ctx);await Promise.all([ctx.write('p0',{data:JSON.stringify({coins:80,pets:['new purchase']})}),ctx.write('p0',{data:JSON.stringify({coins:70,pets:['newer purchase']})})]);const merged=JSON.parse(db.values.get(saved).data);ok('queued stale saves preserve credited coins and current purchases',merged.coins===1070&&merged.pets[0]==='newer purchase'&&merged.arenaRaceReceipts[payment.key]===1000);
 db.values.set(saved,{data:'broken JSON'});await ctx.write('p0',{data:JSON.stringify({coins:5})});ok('damaged cloud JSON can still be replaced with a valid save',JSON.parse(db.values.get(saved).data).coins===5);
 now+=91000;move('p4',0,0);const fresh=await call('p4','sync');ok('expired active seats can be replaced without inheriting another bank',fresh.self.bank===''&&fresh.self.earned===0&&fresh.self.hp===5000);
 console.log(JSON.stringify({passed:checks}));
 }finally{Date.now=realNow;}
})().catch(e=>{console.error(e);process.exitCode=1;});
