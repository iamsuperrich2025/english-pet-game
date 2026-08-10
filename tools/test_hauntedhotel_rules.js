/* Haunted Hotel room-count lighting, room letters and PNG ghost rules regression. */
'use strict';
const fs=require('fs'),vm=require('vm'),assert=require('assert');

let now=0,nextTimer=1;
const timers=new Map();
function setTimer(fn,ms){const id=nextTimer++;timers.set(id,{fn,at:now+(Number(ms)||0),interval:0});return id;}
function setRepeat(fn,ms){const id=nextTimer++;timers.set(id,{fn,at:now+(Number(ms)||0),interval:Number(ms)||1});return id;}
function clearTimer(id){timers.delete(id);}
function advance(ms){
  const end=now+ms;
  while(true){
    let id=0,item=null;
    timers.forEach((value,key)=>{if(value.at<=end&&(!item||value.at<item.at)){id=key;item=value;}});
    if(!item)break;
    now=item.at;
    if(item.interval)item.at+=item.interval;else timers.delete(id);
    item.fn();
  }
  now=end;
}
const context={console,Math,Date,Promise,Set,Map,Array,Object,Number,String,Boolean,JSON,RegExp,
  performance:{now:()=>now},setTimeout:setTimer,clearTimeout:clearTimer,setInterval:setRepeat,clearInterval:clearTimer};
context.window=context;vm.createContext(context);
vm.runInContext(fs.readFileSync('js/hauntedhotel.js','utf8'),context,{filename:'hauntedhotel.js'});
vm.runInContext(fs.readFileSync('js/hauntedhotelghost.js','utf8'),context,{filename:'hauntedhotelghost.js'});
const HH=context.HauntedHotelRuntime,GH=context.HauntedHotelGhost;
const adventureSource=fs.readFileSync('js/adventure3d.js','utf8');
assert.ok(adventureSource.includes("thaiInstrument:'sound/ghost/thaiInstrumentGhost.mp3'"),'Thai ghost instrument file is not wired');
assert.ok(/queueThaiInstrument\(\)[\s\S]*?120000[\s\S]*?5000/.test(adventureSource),'Thai ghost music does not wait 5 seconds then run for 2 minutes');
assert.ok(/jumpScare\(\)[\s\S]*?onDone:[\s\S]*?queueThaiInstrument/.test(adventureSource),'Thai ghost music is not chained to jump-scare completion');
assert.ok(/stopGhostVoices\(\)[\s\S]*?clearThaiSequence\(true\)/.test(adventureSource),'lights-on cleanup does not cancel Thai ghost music');

function state(){return {runId:'hh-test-room-rules',seed:77,placementVersion:1,phase:'ACTIVE_WORD',wordIndex:0,ordinalMask:0,
  cabinetLetterSlot:0,roomVisits:'',completedAt:0,revision:1,wordSet:JSON.stringify([['ghost','ผี'],['room','ห้อง'],['dark','มืด'],['light','ไฟ']])};}
const pool=[];
for(let floor=1;floor<=4;floor++)for(let room=0;room<3;room++)for(let slot=1;slot<=2;slot++){
  const number=(floor+1)*100+room*2+1,key=`r${floor}n${room}`;
  pool.push({id:`F${floor+1}_ROOM_${number}_${String(slot).padStart(2,'0')}`,x:floor*20+room*3+slot,y:floor*4.25,z:-6,
    floor,room:key,zone:`ROOM_${number}`,label:`ห้อง ${number}`,roomNumber:number});
}
const letters=HH.deriveRoomLetters(pool,state());
assert.strictEqual(letters.length,12,'every floor 2+ guest room must receive exactly one letter');
assert.strictEqual(new Set(letters.map(x=>x.room)).size,12,'room letter placement duplicated a room');
assert.ok(letters.every(x=>x.floor>=1&&x.floor<=4),'room letter escaped floor 2+');
assert.deepStrictEqual(Array.from(new Set(letters.map(x=>x.ordinal))).sort(),[0,1,2,3,4],'active word ordinals are not all represented');
assert.strictEqual(HH.parseRoomVisits('F2_ROOM_201,F2_ROOM_201,F3_ROOM_301').length,2,'room visits did not de-duplicate');

(async function(){
  HH.init({floorOf:()=>0,createWordSet:()=>[['ghost','ผี'],['room','ห้อง'],['dark','มืด'],['light','ไฟ']].map(x=>({en:x[0],th:x[1]})),
    applyCanonicalState(){},applyLightingState(){},applyFlickerLevel(){}});
  HH.enter({footY:0,lighting:HH.LIGHTING.NORMAL});
  advance(1900);await Promise.resolve();advance(100);await Promise.resolve();
  assert.strictEqual(HH.snapshot().canonical.phase,HH.PHASE.ACTIVE_WORD,'local run did not become active');
  for(let i=1;i<=13;i++){
    const floor=1+Math.floor((i-1)/6),number=(floor+1)*100+((i-1)%6)*2+1;
    await HH.visitRoom(`F${floor+1}_ROOM_${number}`);advance(100);await Promise.resolve();
    const phase=HH.snapshot().canonical.phase;
    if(i===5)assert.strictEqual(phase,HH.PHASE.TEMP_BLACKOUT,'five rooms did not trigger blackout phase');
    if(i===10)assert.strictEqual(phase,HH.PHASE.RESTORE,'ten rooms did not restore hotel lights');
    if(i===13)assert.strictEqual(phase,HH.PHASE.PERMANENT_DARK,'thirteen rooms did not trigger second blackout');
  }
  HH.exit();

  const counter=GH._createTurnCounter();counter.setBlackout(true,0);
  for(let i=0;i<9;i++){assert.strictEqual(counter.update(Math.PI),false);counter.update(0);}
  assert.strictEqual(counter.update(Math.PI),true,'jump scare did not trigger on the tenth look-back');
  counter.setBlackout(false,0);assert.strictEqual(counter.update(Math.PI),false,'look-back triggered while lights were on');
  counter.setBlackout(true,0);assert.strictEqual(counter.snapshot().count,0,'new blackout did not reset look-back count');
  const target=GH._chooseTarget({x:0,y:0,z:0},[
    {id:'hidden',x:1,y:0,z:0,room:'F2_ROOM_201'},{id:'far',x:8,y:0,z:0,room:''},{id:'near',x:3,y:0,z:0,room:''}
  ]);
  assert.strictEqual(target.id,'near','ghost did not ignore hidden player or select nearest visible player');
  console.log('PASS Haunted Hotel replacement rules: room letters, 5/10/13 lighting, tenth look-back, hiding, nearest target and Thai music sequence');
})().catch(error=>{console.error(error);process.exitCode=1;});
