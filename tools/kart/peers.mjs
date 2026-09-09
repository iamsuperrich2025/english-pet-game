import http from 'node:http';import fs from 'node:fs/promises';import path from 'node:path';import assert from 'node:assert/strict';import {createRequire} from 'node:module';
const require=createRequire(import.meta.url),{chromium}=require('C:/Users/rober/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const work=path.resolve(process.env.KART_OUTPUT||'work/kart-qa'),root=path.resolve(process.env.KART_ROOT||process.cwd());
const test=await fs.readFile(path.join(root,'tools/kart/browser.mjs'),'utf8');let html=test.match(/const html=`([\s\S]*?)`;/)[1];
const setup=`<script src="/work/frontline-v1-deps/firebase-app-compat.js"></script><script src="/work/frontline-v1-deps/firebase-database-compat.js"></script><script>
const qaUid=new URLSearchParams(location.search).get('uid')||'kart-peer-1';const email=qaUid==='kart-peer-1'?'student-one@example.com':'student-two@example.com';
const mock={sub:qaUid,email,email_verified:true};firebase.initializeApp({databaseURL:'https://demo-vocab-kart-default-rtdb.firebaseio.com',projectId:'demo-vocab-kart',apiKey:'demo-kart-key'});
const db=firebase.database();db.useEmulator('127.0.0.1',17479,{mockUserToken:mock});Online.db=db;Online.ready=true;
const enc=x=>btoa(JSON.stringify(x)).replace(/=/g,'').replace(/\\+/g,'-').replace(/\\//g,'_');
Auth.user={uid:qaUid,email,emailVerified:true,getIdToken:async()=>enc({alg:'none',typ:'JWT'})+'.'+enc({...mock,iat:Math.floor(Date.now()/1000)-1,exp:Math.floor(Date.now()/1000)+3600,aud:'demo-vocab-kart',iss:'https://securetoken.google.com/demo-vocab-kart',user_id:qaUid,firebase:{sign_in_provider:'google.com'}})+'.'};
canAccessKartBeta=()=>!!Auth.user&&Auth.user.emailVerified&&['freddommun@gmail.com','sumpajitshami@gmail.com'].includes(Auth.user.email);
</script><script src="/js/netroom.js"></script>`;
html=html.replace('<script src="/js/f1_modes.js">',setup+'<script src="/js/f1_modes.js">');
const server=http.createServer(async(req,res)=>{try{const url=new URL(req.url,'http://localhost');if(url.pathname==='/__kart'){res.setHeader('content-type','text/html; charset=utf-8');res.end(html);return;}const f=path.resolve(root,'.'+url.pathname);if(!f.startsWith(path.resolve(root)+path.sep))throw Error();res.setHeader('content-type',f.endsWith('.js')?'text/javascript':f.endsWith('.mp3')?'audio/mpeg':'application/octet-stream');res.end(await fs.readFile(f));}catch{res.statusCode=404;res.end('Not found');}});await new Promise(r=>server.listen(17478,'127.0.0.1',r));
await fetch('http://127.0.0.1:17479/.json?ns=demo-vocab-kart-default-rtdb',{method:'PUT',headers:{Authorization:'Bearer owner','content-type':'application/json'},body:'{}'});
const browser=await chromium.launch({channel:'chrome',headless:true,args:['--enable-unsafe-swiftshader','--disable-background-timer-throttling']}),errors=[];
async function until(fn,label){for(let i=0;i<120;i++){if(await fn())return;await new Promise(r=>setTimeout(r,100));}throw Error('Timeout '+label);}
try{
 const p1=await browser.newPage({viewport:{width:812,height:375}}),p2=await browser.newPage({viewport:{width:812,height:375}});
 for(const [i,p] of [p1,p2].entries()){
  p.on('pageerror',e=>errors.push(e.message));
  await p.route('https://demo-vocab-kart-default-rtdb.firebaseio.com/kartAccess.json**',async route=>{const u=new URL(route.request().url());const r=await fetch('http://127.0.0.1:17479/kartAccess.json?ns=demo-vocab-kart-default-rtdb&auth='+encodeURIComponent(u.searchParams.get('auth')));await route.fulfill({status:r.status,contentType:'application/json',body:await r.text()});});
  await p.goto('http://127.0.0.1:17478/__kart?uid=kart-peer-'+(i+1));await p.evaluate(async()=>{KartWorld.start();});
 }
 await until(()=>p1.evaluate(()=>!!KartWorld._t.peers['kart-peer-2']),'peer 2 visible');await until(()=>p2.evaluate(()=>!!KartWorld._t.peers['kart-peer-1']),'peer 1 visible');
 const slots=await Promise.all([p1,p2].map(p=>p.evaluate(()=>KartWorld._t.startGrid.slot)));assert.notEqual(slots[0],slots[1]);
 await p1.click('[data-car-color="blue"]');await until(()=>p2.evaluate(()=>KartWorld._t.peers['kart-peer-1'].colorIdx===1),'blue peer synchronized');
 const cold=await fetch('http://127.0.0.1:17479/winfo/kart.json?ns=demo-vocab-kart-default-rtdb',{headers:{Authorization:'Bearer owner'}}).then(r=>r.json());assert.equal(Object.keys(cold.r0).length,2);
 const f1=await fetch('http://127.0.0.1:17479/winfo/f1.json?ns=demo-vocab-kart-default-rtdb',{headers:{Authorization:'Bearer owner'}}).then(r=>r.json());assert.equal(f1,null);
 console.log('PEERS',{slots,coldMembers:Object.keys(cold.r0),errors});
 await p1.evaluate(()=>KartWorld._t.exitWorld());await until(()=>p2.evaluate(()=>!KartWorld._t.peers['kart-peer-1']),'peer removed on exit');
 await p2.evaluate(()=>KartWorld._t.exitWorld());assert.deepEqual(errors,[]);
 console.log('PASS 7 two-browser multiplayer checks; ordinary player access + NetRoom + isolated namespace + colour + exit');await fs.writeFile(path.join(work,'kart-peer-results.json'),JSON.stringify({checks:7,passed:true,slots,errors},null,2));
}finally{await browser.close();server.close();}
