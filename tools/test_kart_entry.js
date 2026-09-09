'use strict';
const fs=require('fs'),vm=require('vm'),assert=require('assert');
const ui=fs.readFileSync('js/ui.js','utf8'),auth=fs.readFileSync('js/auth.js','utf8');
const accessFn=auth.slice(auth.indexOf('function canAccessKartBeta(){'),auth.indexOf('function isAdmin(){'));
const entry=ui.slice(ui.indexOf('async function enterKart3D(){'),ui.indexOf('async function enterF1_3D(){'));
let checks=0;
async function run(){
 const ctx={Auth:{user:null},state:{kartTicket:true,adminAccess:true},isAdmin:()=>ctx.Auth.user?.email==='freddommun@gmail.com',advLoading:false,
  toast(){},worldEntryStopped:reason=>({started:false,reason}),worldEntryStarted:()=>({started:true}),loadScriptOnce:async s=>ctx.loads.push(s),loads:[],
  KartAccess:{authorize:async()=>{if(ctx.deny)throw Error('server denied');},valid:()=>true},KartWorld:{start(){ctx.starts++;}},starts:0};ctx.window=ctx;vm.createContext(ctx);vm.runInContext(accessFn+entry,ctx);
 for(const user of [null,{email:'student@example.com',emailVerified:true},{email:'freddommun@gmail.com',emailVerified:false}]){ctx.Auth.user=user;assert.equal((await ctx.enterKart3D()).started,false);assert.equal(ctx.loads.length,0);checks+=2;}
 ctx.Auth.user={email:'freddommun@gmail.com',emailVerified:true};ctx.deny=true;assert.equal((await ctx.enterKart3D()).started,false);assert.deepEqual(ctx.loads,['js/kart-access.js']);assert.equal(ctx.advLoading,false);checks+=3;
 ctx.loads=[];ctx.deny=false;assert.equal((await ctx.enterKart3D()).started,true);assert.equal(ctx.starts,1);assert.equal(ctx.loads.filter(x=>x==='js/f1_3d.js').length,1);assert.equal(ctx.loads.at(-1),'js/kart3d.js');checks+=4;
 const source=fs.readFileSync('js/f1_3d.js','utf8');assert(source.includes("map:IS_KART?'kart':'f1'"));assert(source.includes("IS_KART?'kartBest':'f1Best'"));assert(source.includes("IS_KART?'vwKartGhost':GHOST_KEY"));checks+=3;
 const n=fs.readFileSync('js/netroom.js','utf8');assert(n.includes("if(legacy || map==='kart') return;"));checks++;
 console.log('PASS',checks,'Kart permission/entry/isolation checks, including forged saved adminAccess and server-denied admission');
}
run().catch(error=>{console.error(error);process.exitCode=1;});
