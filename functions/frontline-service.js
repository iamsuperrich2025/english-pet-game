/* Authenticated production rooms. Only this server computes movement, hits, words and earnings. */
'use strict';
const {randomBytes,createHash}=require('node:crypto');
const wallet=require('./frontline-wallet');
const ROOT='frontline_v1_live/v1';
function control(value={}){
  const out={};
  for(const [key,min,max] of [['auto',-1,1],['turn',-1,1],['speedLevel',0,2],['fireSeq',0,1e9],['bombSeq',0,1e9],['dropSeq',0,1e9],['dropRevision',0,1e9]]){
    if(!Number.isInteger(value[key])||value[key]<min||value[key]>max)throw Error('invalid_input');out[key]=value[key];
  }
  out.dropLetter=/^[A-Z]?$/.test(value.dropLetter)?value.dropLetter:'';return out;
}
function advance(F,room,now){
  const last=room.tickAt||now,end=Math.min(now,last+500),commands=room.controls||{};
  for(let at=last+50;at<=end;at+=50){
    for(const [key,p] of Object.entries(room.players||{})){
      const c=commands[key];if(p.bot||!c||c.uid!==p.id||now-c.t>1200)continue;
      F.drive(p,c,.05,room,key);
      F.commitDrop(room,key,c.dropSeq,c.dropLetter,c.dropRevision,at);
      F.commitFire(room,key,c.fireSeq,at);F.placeBomb(room,key,c.bombSeq,at);
      p.t=c.t;
    }
    // Existing reducers advance bots, wardens, bombs and letters at 100 ms.
    const leader=F.leader(room,now);if(leader)F.stepRoom(room,leader,at);
  }
  room.earnings=room.earnings||{};room.rewardSeen=room.rewardSeen||{};
  for(const [key,p] of Object.entries(room.players||{})){
    if(p.bot)continue;
    const total=room.rewards?.[key]||0,prior=room.rewardSeen[key];
    const delta=Math.max(0,total-(prior?.uid===p.id?prior.total:0));
    if(delta)room.earnings[p.id]=(room.earnings[p.id]||0)+delta;
    room.rewardSeen[key]={uid:p.id,total};
  }
  if(end<now-500)room.tickAt=now;
  return room;
}
exports.control=control;exports.advance=advance;
exports.createService=function(db,F){
  async function transaction(ref,update){
    const seed=(await ref.get()).val();let first=true;
    return ref.transaction(value=>{if(first&&value===null)value=seed;first=false;return update(value);},undefined,false);
  }
  return async function(data,uid){
    if(!uid)throw Error('unauthenticated');
    const {action,code}=data||{};
    if(!/^R\d{4}$/.test(code)||!['join','tick','leave','settle'].includes(action))throw Error('invalid_request');
    const ref=db.ref(ROOT+'/rooms/'+code),now=Date.now();
    if(action==='settle'){
      const room=(await ref.get()).val(),total=room?.earnings?.[uid]||0;
      const key=createHash('sha256').update(code+':'+(room?.run||'')).digest('hex').slice(0,24);
      const save=db.ref('users/'+uid+'/save');
      const ledger=db.ref(ROOT+'/claims/'+uid+'/'+key),lease=randomBytes(12).toString('hex');
      const lock=await transaction(ledger,current=>{
        if(current?.lease&&now-current.at<30000)return;
        return{paid:current?.paid||0,lease,at:now};
      });
      if(!lock.committed)throw Error('claim_busy');
      try{
        const paid=lock.snapshot.val().paid;
        if(total<=paid)return{save:(await save.get()).val(),total,key,amount:0};
        const result=await transaction(save,value=>wallet.credit(value,key,total,now,paid));
        if(!result.committed)throw Error('save_failed');
        await ledger.set({paid:total,at:Date.now()});
        return{save:result.snapshot.val(),total,key,amount:total-paid};
      }finally{await transaction(ledger,current=>current?.lease===lease?{paid:current.paid||0,at:Date.now()}:undefined);}
    }
    const input=action==='tick'?control(data.input):null;
    const result=await transaction(ref,value=>{
      let room=value;
      if(action==='join'){
        if(room)advance(F,room,now);
        room=F.admit(room,uid,now,randomBytes(16).toString('hex'));if(!room)return;
        const key=Object.keys(room.players).find(k=>room.players[k].id===uid);
        room.controls=room.controls||{};room.controls[key]={uid,t:now,auto:0,turn:0,speedLevel:1,fireSeq:0,bombSeq:0,dropSeq:0,dropLetter:'',dropRevision:0};
      }else{
        const key=Object.keys(room?.players||{}).find(k=>room.players[k].id===uid&&!room.players[k].bot);
        if(!key)return;
        if(action==='leave'){
          advance(F,room,now);
          F.dropCarried(room,key,room.players[key].x,room.players[key].z,now);
          delete room.players[key];delete room.controls?.[key];F.fillBots(room,now);
        }else{
          room.controls=room.controls||{};room.controls[key]={...input,uid,t:now};room.players[key].t=now;
          advance(F,room,now);
        }
      }
      return room;
    });
    if(!result.committed){const error=Error(action==='join'?'Room full':'Seat expired');error.code=action==='join'?'FRONTLINE_ROOM_FULL':'SEAT_EXPIRED';throw error;}
    const room=result.snapshot.val(),id=Object.keys(room.players).find(k=>room.players[k].id===uid&&!room.players[k].bot);
    const earned=room.earnings?.[uid]||0;
    // Private earnings/commands stay server-side. Each client receives only its own reward total.
    delete room.controls;delete room.earnings;delete room.rewardSeen;
    let claimed;
    if(action==='join'){
      const key=createHash('sha256').update(code+':'+room.run).digest('hex').slice(0,24);
      claimed=(await db.ref(ROOT+'/claims/'+uid+'/'+key).get()).val()?.paid||0;
    }
    return{room,id:id||null,earned,now,...(claimed!==undefined?{claimed}:{})};
  };
};
