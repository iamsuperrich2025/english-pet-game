/* Native launcher/return flow and real asset delivery on landscape and portrait phones. */
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {mkdir,writeFile} from 'node:fs/promises';
import path from 'node:path';
const require=createRequire(import.meta.url),{chromium}=require(process.env.FRONTLINE_PLAYWRIGHT||'playwright');
const BASE=process.env.FRONTLINE_BASE||'http://127.0.0.1:19444',OUT=path.resolve('work/frontline-launcher');
await mkdir(OUT,{recursive:true});
const browser=await chromium.launch({channel:'chrome',headless:true,args:['--enable-unsafe-swiftshader','--disable-background-timer-throttling']});
const checks=[],errors=[],requests=[],assets=[],pause=ms=>new Promise(r=>setTimeout(r,ms));let page,roomPath;
async function until(fn,label,ms=12000){const end=Date.now()+ms;while(Date.now()<end){if(await fn())return;await pause(50);}throw Error('Timed out: '+label);}
const state=()=>page.evaluate(()=>Frontline.inspect()),pass=(name,data=true)=>{checks.push({name,data});console.log('PASS '+name);};
async function admin(method,suffix='',body){const response=await fetch('http://127.0.0.1:19445/'+roomPath+suffix+'.json?ns=demo-vocab-frontline-v1-default-rtdb',{
  method,headers:{Authorization:'Bearer owner','Content-Type':'application/json'},body:body===undefined?undefined:JSON.stringify(body)});
  if(!response.ok)throw Error(await response.text());return response.json();}
async function geometry(){return page.evaluate(()=>{
  const selectors=['#fl-launch-title','.fl-launch-subtitle','.fl-wallet','label[for="fl-code"]','#fl-code','#fl-join','.fl-launch-help','.fl-launch-tip','.fl-launch-note','.fl-dev'];
  const boxes=selectors.map(selector=>{const r=document.querySelector(selector).getBoundingClientRect();return{selector,x:r.x,y:r.y,right:r.right,bottom:r.bottom,width:r.width,height:r.height};});
  const overlaps=[];for(let i=0;i<boxes.length;i++)for(let j=i+1;j<boxes.length;j++){
    const a=boxes[i],b=boxes[j];if(a.x<b.right&&a.right>b.x&&a.y<b.bottom&&a.bottom>b.y)overlaps.push([a.selector,b.selector]);}
  const launcher=document.querySelector('#launcher'),join=document.querySelector('#fl-join').getBoundingClientRect(),field=document.querySelector('#fl-code').getBoundingClientRect(),badge=document.querySelector('.fl-dev').getBoundingClientRect();
  return{width:innerWidth,height:innerHeight,boxes,overlaps,inside:boxes.every(r=>r.x>=0&&r.right<=innerWidth),
    hit44:join.height>=44&&field.height>=44,joinInitiallyVisible:join.bottom<=innerHeight,badgeVisible:badge.y>=0&&badge.bottom<=innerHeight,
    internallyScrollable:launcher.scrollHeight>launcher.clientHeight,bodyScroll:document.documentElement.scrollHeight>innerHeight,
    inputMode:document.querySelector('#fl-code').inputMode,heading:document.querySelector('#launcher h1').textContent};
});}
try{
  page=await browser.newPage({viewport:{width:1008,height:566},hasTouch:true,isMobile:true,
    userAgent:'Mozilla/5.0 (Linux; Android 14) AppleWebKit/537.36 Chrome/128 Mobile Safari/537.36'});
  page.on('pageerror',e=>errors.push(e.message));page.on('request',r=>requests.push(r.url()));
  page.on('response',r=>{if(r.url().includes('launcher-garden')||r.url().endsWith('/frontline-launcher.css'))assets.push({url:r.url(),status:r.status(),type:r.headers()['content-type']});});
  const code='R'+String(9200+Math.floor(Math.random()*600));await page.goto(BASE+'/__dev/frontline?room='+code);
  await until(()=>Promise.resolve(assets.some(a=>a.url.endsWith('.avif')&&a.status===200)),'AVIF backdrop loaded');
  assert.ok(assets.some(a=>a.url.endsWith('.css')&&a.status===200&&a.type.includes('text/css')));
  assert.ok(assets.some(a=>a.url.endsWith('.avif')&&a.type.includes('image/avif')));assert.ok(!assets.some(a=>a.url.endsWith('.webp')),'one chosen backdrop codec');
  const fallback=await page.request.get(BASE+'/frontline/assets/launcher-garden.webp');assert.equal(fallback.status(),200);assert.match(fallback.headers()['content-type'],/image\/webp/);
  pass('actual local routes deliver launcher CSS, browser-selected AVIF and the WebP fallback with correct MIME types',assets);
  for(const size of [{width:1672,height:941},{width:1008,height:566},{width:812,height:375},{width:667,height:320},{width:375,height:812}]){
    await page.setViewportSize(size);await page.locator('#launcher').evaluate(el=>el.scrollTop=0);await pause(130);const layout=await geometry();
    assert.ok(layout.inside&&layout.hit44&&layout.badgeVisible&&!layout.bodyScroll&&!layout.overlaps.length,JSON.stringify(layout));
    assert.equal(layout.inputMode,'numeric');assert.match(layout.heading,/Frontline 1944/);
    if(size.width>size.height)assert.ok(layout.joinInitiallyVisible,'join CTA visible before scrolling');
    await page.screenshot({path:path.join(OUT,'launcher-'+size.width+'.png')});
    await page.locator('#fl-launch-status').scrollIntoViewIfNeeded();const status=await page.locator('#fl-launch-status').boundingBox();assert.ok(status.y>=0&&status.y+status.height<=size.height);
    pass(size.width+'x'+size.height+' readable form, visible local badge, usable controls and reachable status without page overflow',layout);
  }
  await page.setViewportSize({width:1008,height:566});await page.locator('#launcher').evaluate(el=>el.scrollTop=0);
  await page.locator('#fl-code').fill('123');await page.locator('#fl-join').tap();
  await until(async()=>await page.locator('#fl-launch-status').innerText()==='ใส่หมายเลขห้อง 4 หลัก','invalid code feedback');
  assert.ok(await page.locator('#launcher').isVisible());pass('native join validates four-digit room input and leaves the launcher usable');
  await page.locator('#fl-code').fill(code.slice(1));await page.locator('#fl-join').tap();
  await until(async()=>(await state()).metrics?.tankModelReady,'native join enters battlefield');
  const s=await state(),config=await page.evaluate(()=>FRONTLINE_DEV);roomPath=config.namespace+'/'+config.token+'/rooms/'+code;
  assert.equal(await page.locator('#fl-room').innerText(),code);assert.ok(await page.locator('#launcher').isHidden());
  const freeze={};for(const [key,p] of Object.entries(s.room.players))if(p.bot){freeze['players/'+key+'/hp']=0;freeze['players/'+key+'/respawnAt']=Date.now()+120000;}
  for(const key of Object.keys(s.room.guards)){freeze['guards/'+key+'/hp']=0;freeze['guards/'+key+'/respawnAt']=Date.now()+120000;}
  await admin('PATCH','',freeze);const home=s.room.bases[s.id];await page.locator('[data-auto="1"]').tap();
  await until(async()=>{const p=(await state()).local;return Math.hypot(p.x-home.x,p.z-home.z)>8;},'native auto forward');await page.locator('[data-auto="1"]').tap();
  const p=await admin('GET','/players/'+s.id);await admin('PATCH','/players/'+s.id,{carried:'N',carriedRevision:(p.carriedRevision||0)+1});
  await until(()=>page.locator('[data-hold=drop]').isEnabled(),'DROP enabled');await page.locator('[data-hold=drop]').tap();
  await until(async()=>(await admin('GET','/players/'+s.id)).dropSeq===(p.dropSeq||0)+1,'native DROP acknowledged');
  const shots=(await state()).metrics.shotsShown;await page.locator('[data-hold=fire]').tap();await until(async()=>(await state()).metrics.shotsShown>shots,'native FIRE shell');
  await page.locator('[data-hold=bomb]').tap();await until(()=>page.locator('.fl-bomb-timer:visible').count(),'native BOMB timer');
  pass('new launcher enters a real isolated room; native AUTO, DROP, FIRE and BOMB still work');
  await page.screenshot({path:path.join(OUT,'battle-smoke.png')});
  await page.locator('#fl-leave').tap();await until(async()=>await page.locator('#launcher').isVisible()&&await page.locator('#fl-join').isEnabled(),'EXIT returns launcher');
  assert.ok(await page.locator('#battle').isHidden());assert.equal(await page.locator('#fl-code').inputValue(),code.slice(1));
  assert.equal((await state()).coins,s.coins);await page.screenshot({path:path.join(OUT,'launcher-return.png')});
  pass('EXIT returns to the new live form with room number and wallet preserved');
  assert.equal(errors.length,0,errors.join('\n'));assert.ok(requests.every(u=>u.startsWith(BASE)||u.startsWith('data:')));
  pass('no JavaScript errors or production requests');
  await writeFile(path.join(OUT,'results.json'),JSON.stringify({passed:true,checks,errors,namespace:roomPath},null,2));
}catch(error){console.error(error);process.exitCode=1;if(page)await page.screenshot({path:path.join(OUT,'failure.png')}).catch(()=>{});
  await writeFile(path.join(OUT,'results.json'),JSON.stringify({passed:false,checks,errors,error:error.stack},null,2));}
finally{await browser.close();}
