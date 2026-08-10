/* Haunted Hotel Phase 4 deterministic placement + non-modal search assistance regression. */
'use strict';
const fs=require('fs');
const vm=require('vm');
const assert=require('assert');

let clockNow=1000;
const shown=[],hidden=[],proximity=[],searchEvents=[];
let objective={key:'run:0:0',wordIndex:0,ordinal:0,x:0,y:0,z:0,floor:0,floorLabel:'ชั้น 1',zoneLabel:'ห้อง 101'};
let player={id:'u1',x:80,y:0,z:80};
let sessionState=null;
const context={
  console,setTimeout,clearTimeout,setInterval,clearInterval,
  performance:{now:()=>clockNow},Date,Math,Set,Map,Promise,
  crypto:{getRandomValues:a=>{a[0]=123456789;return a;}},
  firebase:undefined
};
context.window=context;
context.HauntedHotelSession={create(opt){
  return {
    sessionId:'r0',
    start(){sessionState=opt.createInitial();sessionState.startedAt=sessionState.updatedAt=Date.now();opt.onState(null,sessionState,{firstSnapshot:true});},
    stop(){},reconcile(){},
    mutate(expected,mutation){
      const previous=sessionState,next=mutation(Object.assign({},sessionState));
      if(!next)return Promise.resolve({committed:false,state:sessionState});
      next.updatedAt=Date.now();next.revision=(Number(next.revision)||0)+1;sessionState=next;
      opt.onState(previous,next,{});return Promise.resolve({committed:true,state:next});
    },
    claimScare(){return Promise.resolve({committed:false,offline:true});}
  };
}};
vm.createContext(context);
vm.runInContext(fs.readFileSync('js/hotel3d.js','utf8'),context,{filename:'hotel3d.js'});
vm.runInContext(fs.readFileSync('js/hauntedhotel.js','utf8'),context,{filename:'hauntedhotel.js'});
const HH=context.HauntedHotelRuntime;

const fakeHotel={rooms:[{key:'1_n_0',f:1,i:0,side:'n'}],spots:[
  {x:8,y:3.4,z:-6,room:'1_n_0'},{x:2,y:0,z:0,room:'lobby'},{x:4,y:3.4,z:-7,room:'1_n_0'}
]};
const stablePool=context.HOTEL3D.letterPlacementPool(fakeHotel);
assert.strictEqual(context.HOTEL3D.validateLetterPlacementPool(fakeHotel).ok,true,'scene placement pool failed validation');
assert.deepStrictEqual(Array.from(stablePool,s=>s.id),['F1_LOBBY_01','F2_ROOM_201_01','F2_ROOM_201_02']);

function makePool(){
  const out=[];
  for(let f=0;f<5;f++)for(let room=0;room<8;room++){
    out.push({id:`F${f+1}_ROOM_${f+1}${String(room+1).padStart(2,'0')}_01`,floor:f,room:`${f}_${room}`,zone:'ROOM',
      label:`ห้อง ${f+1}${String(room+1).padStart(2,'0')}`,x:room*9+f,y:f*4,z:(room%2?8:-8)});
  }
  return out;
}
function runState(seed,runId){
  const words=[['shadow','เงา'],['coffin','โลง'],['whisper','กระซิบ'],['ghost','ผี']];
  return {runId,seed,placementVersion:1,phase:'ACTIVE_WORD',wordIndex:0,ordinalMask:0,cabinetLetterSlot:2,
    completedAt:0,revision:0,wordSet:JSON.stringify(words)};
}
function ids(route){return route.map(word=>word.map(slot=>slot.id));}

const pool=makePool(),a=HH.derivePlacements(pool,runState(77,'same-run')),
      b=HH.derivePlacements(pool.slice().reverse(),runState(77,'same-run')),
      c=HH.derivePlacements(pool,runState(78,'other-run'));
assert.deepStrictEqual(ids(a),ids(b),'stable pool order must not affect placement');
assert.notDeepStrictEqual(ids(a),ids(c),'different canonical seed/run should change placement');
a.forEach((word,wi)=>{
  assert.strictEqual(new Set(word.map(slot=>slot.id)).size,word.length,`word ${wi} repeats a slot`);
  assert.strictEqual(new Set(word.map(slot=>slot.room)).size,word.length,`word ${wi} clusters in a room`);
  assert.ok(new Set(word.map(slot=>slot.floor)).size>=Math.min(4,word.length),`word ${wi} does not span floors`);
});

HH.init({
  floorOf:y=>Math.round(y/4),database:()=>null,userId:()=>player.id,sessionId:()=>'',isSoleOccupant:()=>true,
  createWordSet:()=>[['shadow','เงา'],['coffin','โลง'],['whisper','กระซิบ'],['ghost','ผี']].map(w=>({en:w[0],th:w[1]})),
  applyCanonicalState(){},currentSearchObjective:()=>objective,searchContext:()=>({player,players:[player]}),
  showCriticalHint:item=>shown.push(item),hideCriticalHint:item=>hidden.push(item),applyObjectiveProximity:d=>proximity.push(d),
  onSearchEvent:(kind,detail)=>searchEvents.push({kind,detail})
});
HH.enter({footY:0});

for(let i=0;i<7;i++)HH.importantHint({id:'manual-'+i,html:'hint '+i});
let snap=HH.snapshot();
assert.strictEqual(snap.search.currentHint,'manual-0','visible hint was overwritten');
assert.strictEqual(snap.search.queuedHints.length,4,'hint queue is not bounded');
HH.dismissHint();
assert.strictEqual(HH.snapshot().search.currentHint,'manual-3','bounded queue should retain the newest pending hints');
while(HH.snapshot().search.currentHint)HH.dismissHint();
assert.ok(HH.reopenHint(),'latest important hint should reopen');
HH.dismissHint();
let acknowledged=0;
HH.importantHint({id:'ack-only',html:'mission complete',onDismiss:()=>acknowledged++});
assert.strictEqual(acknowledged,0,'important hint acknowledged itself without a player action');
HH.dismissHint();
assert.strictEqual(acknowledged,1,'explicit dismissal did not acknowledge the important hint');

const shownBeforeSearch=shown.length;
clockNow+=600; HH._setSearchElapsed(50000); HH.update(.5,clockNow,0);
snap=HH.snapshot();
assert.strictEqual(snap.search.hintLevel,1,'stuck timer did not escalate to level 1');
assert.strictEqual(snap.search.currentHint,'','search timer should not open a blocking hint panel');
assert.strictEqual(shown.length,shownBeforeSearch,'search timer displayed a removed hint panel');
assert.ok(searchEvents.some(e=>e.kind==='stuck'&&e.detail.level===1),'level 1 stuck event was not emitted');

clockNow+=600; HH._setSearchElapsed(200000); HH.update(.5,clockNow,0);
snap=HH.snapshot();
assert.strictEqual(snap.search.hintLevel,4,'stuck timer did not reach strong assistance');
assert.strictEqual(shown.length,shownBeforeSearch,'high-level search assistance displayed a removed hint panel');
assert.ok(searchEvents.some(e=>e.kind==='stuck'&&e.detail.level===4),'level 4 stuck event was not emitted');

player={id:'u1',x:2,y:0,z:2}; clockNow+=600; HH.update(.5,clockNow,0);
assert.ok(proximity.at(-1).strength>=.82,'level 4 did not strengthen local discoverability');
objective={key:'run:0:1',wordIndex:0,ordinal:1,x:30,y:4,z:0,floor:1,floorLabel:'ชั้น 2',zoneLabel:'ห้อง 204'};
HH._adoptSearchObjective(sessionState,sessionState);
snap=HH.snapshot();
assert.strictEqual(snap.search.key,'run:0:1','objective progress did not reset search target');
assert.strictEqual(snap.search.hintLevel,0,'objective progress did not reset hint escalation');
assert.strictEqual(snap.search.queuedHints.length,0,'obsolete objective hints survived progression');

HH.exit();
console.log('PASS Haunted Hotel Phase 4: deterministic spread, bounded manual hints, non-modal escalation, proximity, reset');
