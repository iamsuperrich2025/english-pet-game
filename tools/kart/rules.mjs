import fs from 'node:fs/promises';import path from 'node:path';import {spawn} from 'node:child_process';import assert from 'node:assert/strict';
const root=path.resolve(process.env.KART_ROOT||process.cwd()),work=path.resolve(process.env.KART_OUTPUT||'work/kart-qa');await fs.mkdir(work,{recursive:true});
const deps=path.join(root,'work/frontline-v1-deps');const dirs=await fs.readdir(path.join(deps,'java'));
const java=path.join(deps,'java',dirs[0],'bin/java.exe');const child=spawn(java,['-jar',path.join(deps,'database.jar'),'--host','127.0.0.1','--port','17479','--single_project_mode','Error'],{cwd:work,windowsHide:true,stdio:['ignore','pipe','pipe']});
let log='';for(const stream of [child.stdout,child.stderr])stream.on('data',x=>log=(log+x).slice(-8000));
const ns='demo-vocab-kart-default-rtdb',base='http://127.0.0.1:17479';const doc=await fs.readFile(path.join(root,'handoff/RULES.md'),'utf8');const blocks=[...doc.matchAll(/```json\s*\n([\s\S]*?)\n```/g)];const all=JSON.parse(blocks.sort((a,b)=>b[1].length-a[1].length)[0][1]);const rules=JSON.stringify({rules:Object.fromEntries(Object.entries(all.rules).filter(([k])=>k.startsWith('.')||['wroom','winfo','world','f1Rank','kartRank','kartAccess'].includes(k)))});
function token(email,verified=true,uid='qa-user'){const obj={iat:Math.floor(Date.now()/1000)-1,exp:Math.floor(Date.now()/1000)+3600,aud:'demo-vocab-kart',iss:'https://securetoken.google.com/demo-vocab-kart',sub:uid,user_id:uid,email,email_verified:verified,firebase:{sign_in_provider:'google.com'}};return Buffer.from(JSON.stringify({alg:'none',typ:'JWT'})).toString('base64url')+'.'+Buffer.from(JSON.stringify(obj)).toString('base64url')+'.';}
async function request(p,t,method='GET',body){return fetch(base+'/'+p+'.json?ns='+ns+(t?'&auth='+encodeURIComponent(t):''),{method,headers:{'content-type':'application/json'},body:body===undefined?undefined:JSON.stringify(body)});}
let checks=0;
try{
 let ready=false;for(let i=0;i<100;i++){try{const r=await fetch(base+'/.settings/rules.json?ns='+ns,{method:'PUT',headers:{Authorization:'Bearer owner','Content-Type':'application/json'},body:rules});if(r.ok){ready=true;break;}throw Error(await r.text());}catch(e){if(i===99)throw e;}await new Promise(r=>setTimeout(r,100));}
 assert(ready,log);console.log('Real Firebase emulator compiled the exact affected zones (unrelated live regex rules excluded due to emulator serialization bug)');
 for(const who of [{name:'logged out',t:null,allow:false},{name:'ordinary user',t:token('student@example.com'),allow:true},{name:'unverified admin',t:token('freddommun@gmail.com',false),allow:true},...['freddommun@gmail.com','sumpajitshami@gmail.com','parkerhulk2020@gmail.com'].map(email=>({name:email,t:token(email),allow:true}))]){
  for(const p of ['kartAccess','wroom/kart/r0','winfo/kart/r0','kartRank']){const r=await request(p,who.t);assert.equal(r.ok,who.allow,who.name+' '+p+' '+r.status+' '+await r.text());checks++;}
  const hot=await request('wroom/kart/r0/qa-user',who.t,'PUT',{x:1,z:2,r:0,a:'F1R:0',m:0,l:0});assert.equal(hot.ok,who.allow,who.name+' hot write: '+await hot.text());checks++;
  const cold=await request('winfo/kart/r0/qa-user',who.t,'PUT',{t:Date.now(),n:'QA',w:0,q:'F1C:red'});assert.equal(cold.ok,who.allow,who.name+' cold write: '+await cold.text());checks++;
  console.log('PASS',who.name);
 }
 const admin=token('freddommun@gmail.com');assert.equal((await request('wroom/kart/r0/someone-else',admin,'PUT',{x:1,z:2})).ok,false);checks++;
 assert.equal((await request('kartAccess',admin,'PUT',true)).ok,false);checks++;
 assert.equal((await request('world/kart',admin)).ok,false);checks++;
 const ordinary=token('student@example.com');for(const p of ['wroom/f1/r0','winfo/f1/r0','f1Rank']){assert((await request(p,ordinary)).ok,p+' public F1 regression');checks++;}
 const row={sec:100,n:'QA',g:'P1',ts:Date.now()};assert((await request('kartRank/qa-user',ordinary,'PUT',row)).ok);checks++;
 assert.equal((await request('kartRank/qa-user',ordinary,'PUT',{...row,sec:120})).ok,false);checks++;
 assert((await request('kartRank/qa-user',ordinary,'PUT',{...row,sec:90})).ok);checks++;
 console.log('PASS',checks,'real rules checks; no production reads/writes');
 if(process.env.KART_PEERS==='1')await import('./peers.mjs');
 await fs.writeFile(path.join(work,'kart-rules-test.json'),JSON.stringify({checks,passed:true},null,2));
}catch(e){console.error(e);console.error(log);process.exitCode=1;}finally{child.kill();}
