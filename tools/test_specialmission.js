/* Special solo Haunted Hotel mission regression (round 1354). */
'use strict';
const fs=require('fs'),vm=require('vm'),assert=require('assert');

function loadMission(){
  const state={coins:0,hauntSpecialMissionDone:false,hauntSpecialMissionNotice:null,hauntSpecialPromoViews:0};
  let saves=0,pushes=0;
  const context={console,Math,Date,Promise,Set,Map,Array,Object,Number,String,Boolean,JSON,RegExp,
    state,addCoins:n=>{state.coins+=Number(n)||0;},saveState:()=>{saves++;},authPushSave:()=>{pushes++;return Promise.resolve();},
    setTimeout,clearTimeout};
  context.window=context;vm.createContext(context);
  vm.runInContext(fs.readFileSync('js/specialmission.js','utf8'),context,{filename:'specialmission.js'});
  return {mission:context.SpecialMission,state,counts:()=>({saves,pushes})};
}

const first=loadMission(),mission=first.mission;
assert.strictEqual(mission.GOAL,5,'special mission goal is not five words');
assert.strictEqual(mission.REWARD,10000,'special mission reward is not 10,000 coins');
mission.beginHauntedRun('solo-run-1');
let result=mission.hauntedClaimCommitted({runId:'solo-run-1',wordIndex:0,en:'ghost',th:'ผี',ordinal:4,ch:'x',completesWord:true});
assert.strictEqual(result.credited,false,'mismatched letter was counted as a completed word');
assert.strictEqual(result.reason,'letter-word-mismatch','mismatched letter was not rejected by alignment guard');
result=mission.hauntedClaimCommitted({runId:'solo-run-1',wordIndex:0,en:'ghost',th:'ผี',ordinal:4,ch:'t',completesWord:false});
assert.strictEqual(result.credited,false,'non-final personal letter counted as a completed word');

const words=[['ghost','ผี'],['room','ห้อง'],['dark','มืด'],['light','ไฟ'],['door','ประตู']];
for(let i=0;i<words.length;i++){
  const [en,th]=words[i],ordinal=en.length-1;
  result=mission.hauntedClaimCommitted({runId:'solo-run-1',wordIndex:i,en,th,ordinal,ch:en.charAt(ordinal),completesWord:true});
  assert.strictEqual(result.credited,true,`personal word ${i+1} was not counted`);
  if(i<4)assert.strictEqual(result.awarded,false,`reward paid before five personal words (${i+1})`);
}
assert.strictEqual(result.awarded,true,'fifth personal word did not pay the reward immediately');
assert.strictEqual(first.state.coins,10000,'10,000 coins were not credited exactly once');
assert.strictEqual(first.state.hauntSpecialMissionDone,true,'one-time completion flag was not saved');
assert.strictEqual(first.state.hauntSpecialMissionNotice.amount,10000,'persistent reward notice was not saved');
assert.ok(first.counts().saves>0&&first.counts().pushes>0,'reward did not persist locally and to cloud save');
mission.hauntedClaimCommitted({runId:'solo-run-1',wordIndex:4,en:'door',th:'ประตู',ordinal:3,ch:'r',completesWord:true});
assert.strictEqual(first.state.coins,10000,'duplicate completion paid the reward twice');

const second=loadMission();second.mission.beginHauntedRun('solo-run-2');
for(let i=0;i<4;i++){
  const [en,th]=words[i],ordinal=en.length-1;
  second.mission.hauntedClaimCommitted({runId:'solo-run-2',wordIndex:i,en,th,ordinal,ch:en.charAt(ordinal),completesWord:true});
}
assert.strictEqual(second.mission.snapshot().count,4,'setup did not count four personal words');
second.mission.failHauntedRun();
assert.strictEqual(second.mission.snapshot().count,0,'GAME OVER did not reset personal mission progress');
assert.strictEqual(second.mission.snapshot().dead,true,'GAME OVER did not lock the failed run');
result=second.mission.hauntedClaimCommitted({runId:'solo-run-2',wordIndex:4,en:'door',th:'ประตู',ordinal:3,ch:'r',completesWord:true});
assert.strictEqual(result.credited,false,'failed run accepted a word after GAME OVER');
assert.strictEqual(second.state.coins,0,'failed run paid coins');

const adventure=fs.readFileSync('js/adventure3d.js','utf8');
const special=fs.readFileSync('js/specialmission.js','utf8');
const stateSource=fs.readFileSync('js/state.js','utf8');
const mainSource=fs.readFileSync('js/main.js','utf8');
const html=fs.readFileSync('index_classic.html','utf8');
const buildSource=fs.readFileSync('tools/build_web.mjs','utf8');
assert.ok(adventure.includes('HOTEL_QUEST_WORDS=5'),'3D Haunted Hotel does not request five words');
assert.ok(adventure.includes('.then(committed=>')&&adventure.includes('if(!committed||!window.SpecialMission)return'),'personal mission is not gated by the winning canonical transaction');
assert.ok(adventure.includes('completesWord:!!(word&&hQuest.got.size===chars.length-1'),'personal completion is not tied to collecting the last missing letter');
assert.ok(adventure.includes('window.SpecialMission.failHauntedRun()'),'GAME OVER is not connected to the solo mission reset');
assert.ok(adventure.includes('window.SpecialMission.leaveHauntedRun()'),'leaving the hotel does not clear the in-memory solo run');
assert.ok(special.includes('const PROMO_LOGIN_LIMIT = 2'),'promo is not limited to two login events');
assert.ok(special.includes('z-index:13050'),'reward dialog does not sit above the 3D world');
const rewardBlock=special.slice(special.indexOf('function showRewardNotice()'),special.indexOf('function award()'));
assert.ok(rewardBlock.includes("[data-hhsm-ack]"),'reward dialog has no explicit acknowledgement button');
assert.ok(!rewardBlock.includes("ov.addEventListener('click'"),'reward dialog can be dismissed by clicking its backdrop');
assert.ok(!rewardBlock.includes('setTimeout(()=>ov.remove'),'reward dialog auto-dismisses');
assert.ok(stateSource.includes('hauntSpecialMissionDone:false')&&stateSource.includes('hauntSpecialPromoViews:0'),'special mission save defaults are missing');
assert.strictEqual((mainSource.match(/SpecialMission\.onLogin\(\);\},1800\)/g)||[]).length,2,'login promo is not delayed behind existing persistent notices for both new and returning players');
assert.ok(html.indexOf('js/specialmission.js?v=1354')>=0&&html.indexOf('js/specialmission.js?v=1354')<html.indexOf('js/main.js?v=1126'),'special mission module is not loaded before login boot');
assert.ok(buildSource.includes("'js/specialmission.js'"),'production build does not include the new mission module before its first commit');
console.log('PASS Special Mission: personal five-word ownership, alignment guard, GAME OVER reset, immediate one-time 10,000 reward, persistent acknowledgement and two-login promo wiring');
