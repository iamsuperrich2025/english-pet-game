/* End-to-end session earnings, exit settlement and reload recovery against the local emulator. */
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {mkdir,writeFile} from 'node:fs/promises';
import path from 'node:path';
const require=createRequire(import.meta.url),{chromium}=require(process.env.FRONTLINE_PLAYWRIGHT||'playwright');
const BASE=process.env.FRONTLINE_BASE||'http://127.0.0.1:19444',OUT=path.resolve('work/frontline-session');
await mkdir(OUT,{recursive:true});
const browser=await chromium.launch({channel:'chrome',headless:true,args:['--enable-unsafe-swiftshader','--disable-background-timer-throttling']});
const checks=[],errors=[],pause=ms=>new Promise(r=>setTimeout(r,ms));
const pass=name=>{checks.push(name);console.log('PASS '+name);};
async function until(fn,label){const end=Date.now()+12000;while(Date.now()<end){if(await fn())return;await pause(45);}throw Error('Timed out: '+label);}
let page,roomPath;
async function patch(suffix,body){const res=await fetch('http://127.0.0.1:19445/'+roomPath+suffix+'.json?ns=demo-vocab-frontline-v1-default-rtdb',{
  method:'PATCH',headers:{Authorization:'Bearer owner','Content-Type':'application/json'},body:JSON.stringify(body)});if(!res.ok)throw Error(await res.text());}
async function win(target,round){
  const s=await page.evaluate(()=>Frontline.inspect());
  for(const [key,p] of Object.entries(s.room.players))if(p.bot)await patch('/players/'+key,{hp:0,respawnAt:Date.now()+120000});
  for(const key of Object.keys(s.room.guards))await patch('/guards/'+key,{hp:0,respawnAt:Date.now()+120000});
  await patch('/word',{target,round,completedAt:0,winnerId:''});
  await patch('/bases/'+s.id,{stored:target.slice(0,-1),x:s.local.x,z:s.local.z});
  await patch('/players/'+s.id,{carried:target.slice(-1)});
  await until(()=>page.evaluate(n=>Frontline.inspect().sessionCoins===n,s.sessionCoins+1000),'letter bank winner reward');
}
try{
  page=await browser.newPage({viewport:{width:1008,height:566},hasTouch:true,isMobile:true});page.on('pageerror',e=>errors.push(e.message));
  await page.goto(BASE+'/__dev/frontline?room=R'+String(9200+Math.floor(Math.random()*100)));
  const baseline=await page.evaluate(()=>({coins:state.coins,daily:state.daily.coins,lifetime:state.lifetimeCoins}));
  await page.locator('#fl-join').tap();await until(()=>page.evaluate(()=>!!Frontline.inspect().local),'join');
  const config=await page.evaluate(()=>FRONTLINE_DEV);roomPath=config.namespace+'/'+config.token+'/rooms/'+await page.locator('#fl-room').innerText();
  assert.equal(await page.locator('#fl-coins').innerText(),'0');pass('a new gameplay session visibly starts at zero earned coins');
  await win('APPLE',30);await pause(350);
  assert.equal(await page.locator('#fl-coins').innerText(),'1,000');assert.equal(await page.evaluate(()=>state.coins),baseline.coins);
  assert.match(await page.locator('#fl-victory').innerText(),/1,000.*รอบนี้/);pass('winning APPLE displays +1000 session coins and a clear victory message without adding to total yet');
  await win('PLUM',31);await pause(350);assert.equal(await page.locator('#fl-coins').innerText(),'2,000');
  assert.equal(await page.evaluate(()=>state.coins),baseline.coins);pass('multiple words accumulate once each across repeated room snapshots');
  await page.screenshot({path:path.join(OUT,'session-2000.png')});
  await page.locator('#fl-leave').tap();await until(async()=>/2,000/.test(await page.locator('#fl-launch-status').innerText()),'exit settlement');
  const saved=await page.evaluate(()=>({coins:state.coins,daily:state.daily.coins,lifetime:state.lifetimeCoins}));
  assert.equal(saved.coins,baseline.coins+2000);assert.equal(saved.daily,baseline.daily+2000);assert.equal(saved.lifetime,baseline.lifetime+2000);
  assert.equal(await page.locator('#fl-wallet').innerText(),saved.coins.toLocaleString());pass('EXIT deposits the session into central total, daily, lifetime and the launcher wallet');
  await page.locator('#fl-join').tap();await until(()=>page.evaluate(()=>!!Frontline.inspect().local),'rejoin');
  assert.equal(await page.locator('#fl-coins').innerText(),'0');await win('BOX',32);assert.equal(await page.locator('#fl-coins').innerText(),'1,000');
  assert.equal(await page.evaluate(()=>state.coins),baseline.coins+2000);pass('rejoining resets session earnings and the new player identity can earn in the same room');
  await page.reload();await until(()=>page.locator('#fl-join').isVisible(),'reload launcher');
  assert.equal(await page.evaluate(()=>state.coins),baseline.coins+3000);await page.reload();
  assert.equal(await page.evaluate(()=>state.coins),baseline.coins+3000);pass('reload safely banks the pending session once; reloading again never duplicates the reward');
  assert.equal(await page.evaluate(()=>localStorage.getItem('petVocabAdventure_v1')),null);assert.deepEqual(errors,[]);
  pass('production save remains absent and browser has no errors');
  await writeFile(path.join(OUT,'results.json'),JSON.stringify({passed:true,checks,errors},null,2));
}catch(error){console.error(error);process.exitCode=1;if(page)await page.screenshot({path:path.join(OUT,'failure.png')});
  await writeFile(path.join(OUT,'results.json'),JSON.stringify({passed:false,checks,errors,error:error.stack},null,2));}
finally{await browser.close();}
