import http from 'node:http';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
const {chromium}=require('C:/Users/rober/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const sharp=require('C:/Users/rober/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp');
const root=path.resolve(process.env.KART_ROOT||process.cwd()),work=path.resolve(process.env.KART_OUTPUT||'work/kart-qa');await fs.mkdir(work,{recursive:true});
const html=`<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><style>body{margin:0;background:#add9ee}button{cursor:pointer}</style>
<script>
window.state={playerName:'Kart QA',student:{grade:'ป.1'},coins:10000,f1Best:99,f1Done:['old'],f1Recent:['old']};
window.Auth={user:{uid:'kart-qa',email:'freddommun@gmail.com',emailVerified:true,getIdToken:async()=> 'local-test'}};
window.Online={ready:false};window.canAccessKartBeta=()=>!!Auth.user&&Auth.user.emailVerified&&Auth.user.email==='freddommun@gmail.com';window.KartAccess={valid:()=>canAccessKartBeta()};
window.saveState=()=>{};window.renderDashboard=()=>{};window.toast=()=>{};window.escapeHTML=s=>String(s).replace(/[<>&]/g,'');window.fmtNum=n=>String(n);window.onlineKey=()=>Auth.user&&Auth.user.uid;window.onlineDisplayName=()=> 'Kart QA';window.isTester=()=>false;window.rankUserExcluded=()=>false;window.sfx={coinGet(){},select(){},correct(){},levelup(){}};
window.addCoins=n=>state.coins+=n;window.f1VocabForStudent=()=>[['cat','แมว'],['dog','สุนัข']];window.F1_RECENT_LIMIT=10;window.f1ChooseVocabWord=(pool)=>({entry:pool[0]});
</script><script src="/js/vendor/three.min.js"></script><script src="/js/data/f1_bahrain.js"></script><script src="/js/f1_modes.js"></script><script src="/js/f1_3d.js"></script><script src="/js/kart3d.js"></script>`;
const server=http.createServer(async(req,res)=>{try{if(req.url.startsWith('/__kart')){res.setHeader('content-type','text/html; charset=utf-8');res.end(html);return;}const u=new URL(req.url,'http://localhost');const f=path.resolve(root,'.'+decodeURIComponent(u.pathname));if(!f.startsWith(path.resolve(root)+path.sep))throw Error();const data=await fs.readFile(f);res.setHeader('content-type',f.endsWith('.js')?'text/javascript':f.endsWith('.webp')?'image/webp':f.endsWith('.mp3')?'audio/mpeg':'application/octet-stream');res.end(data);}catch{res.statusCode=404;res.end('Not found');}});
await new Promise(r=>server.listen(17477,'127.0.0.1',r));
const browser=await chromium.launch({channel:'chrome',headless:true,args:['--enable-unsafe-swiftshader','--disable-background-timer-throttling']});
const page=await browser.newPage({viewport:{width:1280,height:720},hasTouch:true,isMobile:true,userAgent:'Mozilla/5.0 (Linux; Android 14) AppleWebKit/537.36 Chrome/126.0.0.0 Mobile Safari/537.36'}),errors=[],requests=[];
page.on('pageerror',e=>errors.push(e.stack));page.on('request',r=>requests.push(r.url()));
try{
 await page.goto('http://127.0.0.1:17477/__kart');
 console.log('loaded',await page.evaluate(()=>({kart:!!window.KartWorld,profile:!!window.KartProfile})));
 await page.evaluate(()=>KartWorld.start());await page.waitForTimeout(1200);
 async function shot(name){await sharp(await page.screenshot()).webp({lossless:true}).toFile(path.join(work,name+'.webp'));}
 await shot('kart-garage-first');console.log('garage',await page.evaluate(()=>({graphics:KartWorld._t.graphics.mode,car:KartWorld._t.carVisual,draws:KartWorld._t.renderer.info.render,rect:document.querySelector('#kart-garage .garage-card').getBoundingClientRect().toJSON(),scroll:document.querySelector('#kart-garage .garage-card').scrollHeight,client:document.querySelector('#kart-garage .garage-card').clientHeight})));
 await page.click('#kart-garage-confirm');await shot('kart-intro-first');await page.click('#kart-go');await page.waitForTimeout(300);await shot('kart-cockpit-first');
 await page.evaluate(()=>KartWorld._t.setCamMode('chase'));await page.waitForTimeout(150);await shot('kart-chase-first');
 await page.setViewportSize({width:812,height:375});await page.evaluate(()=>{KartWorld._t.exitWorld();KartWorld.start();});await page.waitForTimeout(300);await shot('kart-mobile-garage-first');
 console.log('mobile',await page.evaluate(()=>({r:document.querySelector('#kart-garage .garage-card').getBoundingClientRect().toJSON(),scroll:document.querySelector('#kart-garage .garage-card').scrollHeight,client:document.querySelector('#kart-garage .garage-card').clientHeight})));

 assert.equal(requests.filter(u=>u.includes('/img/f1/')).length,0,'Kart must not request F1 images');
 let assertions=5;
 for(const color of ['red','blue','green','yellow','orange']){
   await page.click('[data-car-color="'+color+'"]');
   assert.equal(await page.evaluate(()=>KartWorld._t.carStyle.key),color);assertions++;
 }
 await page.click('[data-car-color="blue"]');await shot('kart-mobile-blue-garage');
 await page.click('#kart-garage-confirm');
 const bounds=await page.locator('#kart-intro .box').evaluate(el=>({r:el.getBoundingClientRect().toJSON(),scroll:el.scrollHeight,client:el.clientHeight}));
 assert(bounds.r.top>=0&&bounds.r.bottom<=375&&bounds.scroll<=bounds.client+1,'mobile intro fits');assertions++;
 await page.click('#kart-go');
 await page.evaluate(()=>{KartWorld._t.setHold(.7);KartWorld._t.step(.05,180);});
 const pedal=await page.locator('#kart-throttle').boundingBox();const touch=await page.context().newCDPSession(page);
 await touch.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:pedal.x+pedal.width/2,y:pedal.y+pedal.height/2,id:1}]});
 await page.waitForTimeout(700);const touchSpeed=await page.evaluate(()=>KartWorld._t.pos.spd);
 await touch.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});assert(touchSpeed>1,'real Android touch accelerates');assertions++;
 const physics=await page.evaluate(()=>{
   const t=KartWorld._t,L=t.line,idx=(t.sfIdx+12)%L.n; t.setHold(.7);t.step(.05,180);
   const x=L.x[idx],z=L.z[idx],yaw=Math.atan2(L.tx[idx],L.tz[idx]);t.pos={x,z,yaw,spd:0};t.input={thr:1,steer:0,br:false};
   let max=0;for(let i=0;i<700;i++){const speed=t.pos.spd;t.pos={x,z,yaw,spd:speed};t.physTick(.05);max=Math.max(max,t.pos.spd*3.6);}
   const top=t.pos.spd*3.6;t.input={thr:0};for(let i=0;i<40;i++){const speed=t.pos.spd;t.pos={x,z,yaw,spd:speed};t.physTick(.05);}const coast=t.pos.spd*3.6;
   t.input={br:true};for(let i=0;i<80;i++){const speed=t.pos.spd;t.pos={x,z,yaw,spd:speed};t.physTick(.05);}const stop=t.pos.spd*3.6;t.input={br:false};
   const before=state.coins;for(const letter of t.letters.slice()){t.pos={x:letter.spr.position.x,z:letter.spr.position.z,spd:0};t.collectTick();}const earned=state.coins-before;
   return {max,top,coast,stop,earned,word:t.word,done:state.kartDone,f1Done:state.f1Done,f1Best:state.f1Best};
 });console.log('Physics/rewards',physics);
 assert(physics.top>105&&physics.top<=110.1,'appropriate Kart top speed');assert(physics.max<=110.1);assert(physics.coast<physics.top-10);assert(physics.stop<1);assert.equal(physics.earned,66);assert.deepEqual(physics.f1Done,['old']);assert.equal(physics.f1Best,99);assertions+=7;
 await page.evaluate(()=>{const t=KartWorld._t;t.respawnOnTrack();t.setCamMode('cockpit');});await page.waitForTimeout(100);await shot('kart-mobile-blue-cockpit');
 const collision=await page.evaluate(()=>{const t=KartWorld._t,p=t.pos;t.fakePeer('qa-peer',p.x,p.z,{cw:'F1C:green'});return {peers:Object.keys(t.peers).length,style:t.carStyle.key};});assert.equal(collision.peers,1);assert.equal(collision.style,'blue');assertions+=2;
 await page.evaluate(()=>{F1World.start({graphicsMode:'battery',environmentProfile:F1Modes.PROFILES.battery});});
 assert.equal(await page.evaluate(()=>KartWorld._t.running),false);assert.equal(await page.evaluate(()=>F1World._t.carVisual.kind),'vrx1-faceted-low-poly');assertions+=2;
 await page.click('#f1-garage-confirm');await page.click('#f1-go');await page.waitForTimeout(100);await shot('f1-preserved-smoke');
 await page.evaluate(()=>KartWorld.start());assert.equal(await page.evaluate(()=>F1World._t.running),false);assert.equal(await page.evaluate(()=>KartWorld._t.carStyle.key),'blue');assertions+=2;
 const ids=await page.evaluate(()=>{const ids=[...document.querySelectorAll('[id]')].map(e=>e.id);return ids.length-new Set(ids).size;});assert.equal(ids,0,'world DOM ids stay independent');assertions++;
 await page.evaluate(()=>{Auth.user={uid:'ordinary',email:'student@example.com',emailVerified:true};});await page.waitForTimeout(150);assert.equal(await page.evaluate(()=>KartWorld._t.running),true,'public Kart remains available to ordinary players');assertions++;
 const publicEntry=await page.evaluate(()=>{KartWorld._t.exitWorld();Auth.user=null;KartWorld.start();return KartWorld._t.running;});assert(publicEntry,'public solo mode is available offline like Racing');assertions++;
 assert.deepEqual(errors,[],'no browser runtime errors');assertions++;
 await fs.writeFile(path.join(work,'kart-browser-results.json'),JSON.stringify({assertions,physics,errors,requestCount:requests.length},null,2));console.log('PASS',assertions,'browser checks');
 
 console.log('errors',errors);
 await page.evaluate(()=>{KartWorld._t.exitWorld();if(F1World._t.running)F1World._t.exitWorld();});
} catch(e){console.error(e);console.error(errors);process.exitCode=1;}
finally{await browser.close();server.close();}
