'use strict';
const fs=require('fs'),vm=require('vm'),assert=require('assert');
const ui=fs.readFileSync('js/ui.js','utf8'),auth=fs.readFileSync('js/auth.js','utf8');
const capability=auth.slice(auth.indexOf('function canAccessKartBeta(){'),auth.indexOf('function isAdmin(){'));
const entry=ui.slice(ui.indexOf('async function enterKart3D(){'),ui.indexOf('async function enterF1_3D(){'));
(async()=>{
 let checks=0;const ctx={Auth:{user:null},state:{kartTicket:true,adminAccess:false},advLoading:false,loads:[],starts:0,saves:0,toast(){},saveState(){ctx.saves++;},worldEntryStopped:reason=>({started:false,reason}),worldEntryStarted:()=>({started:true}),loadScriptOnce:async s=>ctx.loads.push(s),KartWorld:{start(){ctx.starts++;}}};ctx.window=ctx;vm.createContext(ctx);vm.runInContext(capability+entry,ctx);
 for(const user of [null,{email:'student@example.com',emailVerified:true},{email:'student@example.com',emailVerified:false},{email:'freddommun@gmail.com',emailVerified:true}]){ctx.Auth.user=user;ctx.loads=[];assert(ctx.canAccessKartBeta());assert.equal((await ctx.enterKart3D()).started,true);assert.deepEqual(ctx.loads,['js/vendor/three.min.js','js/data/f1_bahrain.js','js/f1_3d.js','js/kart3d.js']);assert.equal(ctx.advLoading,false);checks+=4;}
 assert.equal(ctx.state.kartPlayedV1,true);assert.equal(ctx.saves,4);checks+=2;
 for(const mode of ['hurt','busy','ticket']){ctx.loads=[];ctx.state.advHurt=mode==='hurt';ctx.advLoading=mode==='busy';ctx.state.kartTicket=mode!=='ticket';assert.equal((await ctx.enterKart3D()).started,false);assert.equal(ctx.loads.length,0);checks+=2;}
 const source=fs.readFileSync('js/f1_3d.js','utf8');assert(source.includes("map:IS_KART?'kart':'f1'"));assert(source.includes("IS_KART?'kartBest':'f1Best'"));assert(source.includes("IS_KART?'vwKartGhost':GHOST_KEY"));checks+=3;
 assert(!entry.includes('KartAccess'),'Public entry must not request an admin admission token');checks++;
 console.log('PASS',checks,'public Kart entry, offline solo, guards, and record isolation checks');
})().catch(e=>{console.error(e);process.exitCode=1;});
