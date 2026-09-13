'use strict';
const fs=require('fs'),vm=require('vm'),assert=require('assert');
const ui=fs.readFileSync('js/ui.js','utf8');
const entry=ui.slice(ui.indexOf('async function enterPickup3D(){'),ui.indexOf('async function enterF1_3D(){'));
(async()=>{
 let checks=0;
 const ctx={Auth:{user:null},state:{pickupTicket:true,adminAccess:false},advLoading:false,loads:[],starts:0,saves:0,toast(){},saveState(){ctx.saves++;},worldEntryStopped:reason=>({started:false,reason}),worldEntryStarted:()=>({started:true}),loadScriptOnce:async s=>ctx.loads.push(s),PickupWorld:{start(){ctx.starts++;}}};
 ctx.window=ctx;vm.createContext(ctx);vm.runInContext(entry,ctx);
 for(const user of [null,{email:'student@example.com',emailVerified:true}]){
  ctx.Auth.user=user;ctx.loads=[];assert.equal((await ctx.enterPickup3D()).started,true);
  assert.deepEqual(ctx.loads,['js/vendor/three.min.js','js/data/f1_bahrain.js','js/f1_3d.js','js/pickup3d.js']);
  assert.equal(ctx.advLoading,false);checks+=3;
 }
 assert.equal(ctx.state.pickupPlayedV1,true);assert.equal(ctx.saves,2);checks+=2;
 for(const mode of ['hurt','busy','ticket']){
  ctx.loads=[];ctx.state.advHurt=mode==='hurt';ctx.advLoading=mode==='busy';ctx.state.pickupTicket=mode!=='ticket';
  assert.equal((await ctx.enterPickup3D()).started,false);assert.equal(ctx.loads.length,0);checks+=2;
 }
 const pickup=fs.readFileSync('js/pickup3d.js','utf8'),kart=fs.readFileSync('js/kart3d.js','utf8'),engine=fs.readFileSync('js/f1_3d.js','utf8');
 assert(pickup.includes("id:'pickup'"));assert(pickup.includes('PickupWorld'));assert(pickup.includes('island-star-pickup'));
 assert(pickup.includes('top:170/3.6'));assert(kart.includes('top:110/3.6'));
 assert(pickup.includes("map:'pickup'"));assert(!pickup.includes("map:'kart'"));
 const kartTop=110,pickupTop=170,racingRef=85*3.6;
 assert(pickupTop>kartTop);assert(pickupTop<racingRef);checks+=8;
 assert(engine.includes("window.PickupWorld"));assert(engine.includes("P.keys&&P.keys.map||NS"));checks+=2;
 assert(ui.includes("mode:'pickup'"));assert(ui.includes('Vocab World Pick-Up Truck'));checks+=2;
 const rules=fs.readFileSync('handoff/RULES.md','utf8');
 assert(rules.includes("$map === 'pickup'"));assert(rules.includes('"pickupRank"'));assert(rules.includes("$map !== 'pickup'"));checks+=3;
 const home=fs.readFileSync('js/home-v2.js','utf8');
 assert(home.includes("worldPickup:'#btn-world-pickup'"));assert(home.includes('Vocab World Pick-Up Truck'));checks+=2;
 console.log('PASS',checks,'public Pick-Up entry, speed band, and record isolation checks');
})().catch(e=>{console.error(e);process.exitCode=1;});
