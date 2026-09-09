import http from 'node:http';import fs from 'node:fs/promises';import path from 'node:path';import assert from 'node:assert/strict';import {createRequire} from 'node:module';
const require=createRequire(import.meta.url),{chromium}=require('C:/Users/rober/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const root=path.resolve(process.env.KART_ROOT||process.cwd());const server=http.createServer(async(req,res)=>{try{const u=new URL(req.url,'http://local');const f=path.resolve(root,'.'+decodeURIComponent(u.pathname));if(!f.startsWith(root+path.sep))throw Error();const ext=path.extname(f),types={'.html':'text/html; charset=utf-8','.js':'text/javascript','.css':'text/css','.json':'application/json','.svg':'image/svg+xml','.webp':'image/webp','.avif':'image/avif','.woff2':'font/woff2'};res.setHeader('content-type',types[ext]||'application/octet-stream');res.end(await fs.readFile(f));}catch{res.statusCode=404;res.end('Not found');}});await new Promise(r=>server.listen(17476,'127.0.0.1',r));
const browser=await chromium.launch({channel:'chrome',headless:true,args:['--enable-unsafe-swiftshader']}),page=await browser.newPage({viewport:{width:812,height:375}}),errors=[],requests=[];page.on('request',r=>requests.push(r.url()));page.on('pageerror',e=>errors.push(e.message));
try{
 page.setDefaultTimeout(6000);
 await page.route('**/*',route=>route.request().url().startsWith('http://127.0.0.1:17476/')?route.continue():route.abort());
 await page.goto('http://127.0.0.1:17476/index_classic.html',{waitUntil:'domcontentloaded'});await page.waitForFunction(()=>typeof renderDashboard==='function'&&typeof Auth!=='undefined');
 await page.evaluate(()=>{
   authWriteCloud=()=>Promise.resolve();authFetchCloud=()=>Promise.resolve(null);authPushSaveAwait=()=>Promise.resolve();onlineStart=()=>{};Online.ready=false;Online.db=null;
   Auth.user={uid:'lobbyqa',email:'student@example.com',emailVerified:true};Auth.booted=true;
   state.student={name:'QA',grade:'ป.1',school:'QA',province:'กรุงเทพมหานคร'};state.playerName='QA';state.adminAccess=true;
   onetPromoMaybeShow=()=>{};document.getElementById('consent-gate')?.remove();showScreen('screen-dashboard');renderDashboard();
 });await page.waitForTimeout(500);
 async function roles(){return page.evaluate(()=>({classic:(()=>{const e=document.querySelector('#btn-world-kart');return e?{hidden:e.hidden,display:getComputedStyle(e).display}:null;})(),home:(()=>{const e=document.querySelector('[data-vw2-action="worldKart"]');return e?{hidden:e.hidden,display:getComputedStyle(e).display}:null;})()}));}
 let role=await roles();console.log('ordinary',role);assert(!role.classic.hidden&&!role.home.hidden);assert.equal((await page.evaluate(()=>enterKart3D())).started,false);
 await page.evaluate(()=>{Auth.user={uid:'lobbyqa',email:'freddommun@gmail.com',emailVerified:false};renderDashboard();});await page.waitForTimeout(150);role=await roles();assert(!role.classic.hidden&&!role.home.hidden);
 await page.evaluate(()=>{Auth.user={uid:'lobbyqa',email:'freddommun@gmail.com',emailVerified:true};renderDashboard();});await page.waitForTimeout(200);role=await roles();console.log('admin',role);assert(!role.classic.hidden&&!role.home.hidden);
 await page.evaluate(()=>document.querySelectorAll('#lc-announce,[data-daily-box],#consent-gate,.rankup-overlay,.levelup-overlay').forEach(el=>el.remove()));
 const icon=page.locator('[data-vw2-action="worldKart"] img[data-kart-icon]');await icon.scrollIntoViewIfNeeded();await icon.evaluate(e=>e.decode());assert.equal(await icon.evaluate(e=>e.naturalWidth),96);
 const imageSources=await page.locator('img[data-kart-icon]').evaluateAll(es=>es.map(e=>e.getAttribute('src')));assert.equal(imageSources.length,2);assert.equal(new Set(imageSources).size,1);assert.notEqual(await page.locator('[data-vw2-action="worldKart"]').getAttribute('data-vw2-admin-only-world'),'1');assert(requests.filter(u=>u.includes('kart-menu')).length<=1,'Shared public icon uses one request');
 if(process.env.KART_OUTPUT){const sharp=require('C:/Users/rober/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp');await sharp(await page.locator('[data-vw2-action="worldKart"]').screenshot()).webp({lossless:true}).toFile(path.join(process.env.KART_OUTPUT,'kart-lobby-button-1378.webp'));}
 await page.locator('[data-vw2-action="worldKart"]').click();const box=page.locator('.levelup-overlay .levelup-box').last();await box.waitFor({state:'visible'});assert((await box.innerText()).includes('Vocab World Kart'));
 const fit=await box.evaluate(e=>({r:e.getBoundingClientRect().toJSON(),s:e.scrollHeight,c:e.clientHeight}));assert(fit.r.top>=0&&fit.r.bottom<=375&&fit.s<=fit.c+1);
 await page.evaluate(()=>{window.__kartStarts=0;loadScriptOnce=async()=>{};window.KartAccess={authorize:async()=>{},valid:()=>true};window.KartWorld={start:()=>window.__kartStarts++};});
 await box.getByRole('button',{name:/เข้าเลย/}).click();await page.waitForTimeout(100);assert.equal(await page.evaluate(()=>window.__kartStarts),1);assert.equal(await page.evaluate(()=>state.kartTicket),true);
 console.log('PASS 13 public lobby/icon checks',root,'page errors',errors);assert.deepEqual(errors,[]);
}catch(e){console.error(e);console.log('page errors',errors);process.exitCode=1;}finally{await browser.close();server.close();}
