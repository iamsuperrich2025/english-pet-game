'use strict';
const assert=require('node:assert/strict'),{createService,control}=require('./frontline-service'),F=require('./frontline-simulation')();
function memoryDatabase(){
  const values=new Map(),snap=value=>({val:()=>structuredClone(value??null)});
  return{values,ref(path){return{get:async()=>snap(values.get(path)),set:async value=>values.set(path,structuredClone(value)),
    transaction:async update=>{const result=update(structuredClone(values.get(path)??null));if(result===undefined)return{committed:false,snapshot:snap(values.get(path))};values.set(path,structuredClone(result));return{committed:true,snapshot:snap(result)};}};}};
}
exports.memoryDatabase=memoryDatabase;
async function test(){
 const db=memoryDatabase(),run=createService(db,F),path='frontline_v1_live/v1/rooms/R1374';let now=1900000000000;
 const realNow=Date.now;Date.now=()=>now;
 const input={auto:1,turn:0,speedLevel:1,fireSeq:0,bombSeq:0,dropSeq:0,dropLetter:'',dropRevision:0};
 try{
  await assert.rejects(()=>run({action:'join',code:'R1374'},null),/unauthenticated/);
  assert.throws(()=>control({...input,speedLevel:500}),/invalid_input/);
  await Promise.all(['p0','p1','p2','p3'].map(uid=>run({action:'join',code:'R1374'},uid)));
  await assert.rejects(()=>run({action:'join',code:'R1374'},'p4'),e=>e.code==='FRONTLINE_ROOM_FULL');
  assert.equal(Object.keys(db.values.get(path).players).length,4);
  const first=structuredClone(db.values.get(path).players.s0);
  now+=300;let result=await run({action:'tick',code:'R1374',input:{...input,x:9999,hp:999999}},'p0');
  assert.ok(result.room.players.s0.z>first.z);assert.ok(result.room.players.s0.z-first.z<=1.51);assert.equal(result.room.players.s0.hp,5000);
  assert.equal(result.room.players.s0.x,first.x);assert.ok(!result.room.controls&&!result.room.earnings);
  now+=600;result=await run({action:'tick',code:'R1374',input:{...input,fireSeq:1,bombSeq:1}},'p0');
  assert.equal(result.room.players.s0.fireSeq,1);assert.equal(result.room.players.s0.bombSeq,1);assert.ok(result.room.events.s0);assert.ok(result.room.bombs.s0_1);
  const room=db.values.get(path);room.bases.s0.stored=room.word.target;room.bases.s1.stored=room.word.target;
  room.players.s0.carried='';room.players.s1.carried='';now+=300;
  result=await run({action:'tick',code:'R1374',input:{...input,auto:0,fireSeq:1,bombSeq:1}},'p0');
  assert.equal(result.room.word.winnerId,'s0');assert.equal(result.earned,1000);assert.equal(db.values.get(path).earnings.p1||0,0);
  const save='users/p0/save';db.values.set(save,{data:JSON.stringify({coins:10000,lifetimeCoins:0,daily:{date:'',coins:0},pets:[{id:'keep'}]})});
  const paid=await run({action:'settle',code:'R1374'},'p0');assert.equal(paid.amount,1000);
  let state=JSON.parse(paid.save.data);assert.equal(state.coins,11000);assert.equal(state.daily.coins,1000);assert.deepEqual(state.pets,[{id:'keep'}]);
  const again=await run({action:'settle',code:'R1374'},'p0');assert.equal(again.amount,0);assert.equal(JSON.parse(again.save.data).coins,11000);
  delete state.frontlineV1Receipts;db.values.set(save,{data:JSON.stringify(state)});
  const stale=await run({action:'settle',code:'R1374'},'p0');assert.equal(stale.amount,0);assert.equal(JSON.parse(stale.save.data).coins,11000,'private ledger survives stale client receipts');
  db.values.get(path).earnings.p0=2000;
  const next=await run({action:'settle',code:'R1374'},'p0');assert.equal(next.amount,1000);assert.equal(JSON.parse(next.save.data).coins,12000,'new win only credits unpaid delta after a stale receipt');
  await run({action:'leave',code:'R1374'},'p0');await run({action:'join',code:'R1374'},'p4');
  assert.equal(Object.keys(db.values.get(path).players).length,4);
  console.log('PASS production server: auth, input validation, 4 seats/overflow, server movement, FIRE/BOMB, winner-only 1000, atomic central wallet, duplicate/stale receipt protection, leave/rejoin.');
 }finally{Date.now=realNow;}
}
if(require.main===module)test().catch(e=>{console.error(e);process.exitCode=1;});
