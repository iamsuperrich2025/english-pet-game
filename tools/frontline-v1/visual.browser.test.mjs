/* Reference-style visual acceptance on real landscape viewports; local emulator only. */
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {mkdir,writeFile} from 'node:fs/promises';
import path from 'node:path';
const require=createRequire(import.meta.url),{chromium}=require(process.env.FRONTLINE_PLAYWRIGHT||'playwright');
const BASE=process.env.FRONTLINE_BASE||'http://127.0.0.1:19444',OUT=path.resolve('work/frontline-visual');
await mkdir(OUT,{recursive:true});
const browser=await chromium.launch({channel:'chrome',headless:true,args:['--enable-unsafe-swiftshader','--disable-background-timer-throttling']});
const checks=[],errors=[],pause=ms=>new Promise(r=>setTimeout(r,ms));
const pass=(name,data=true)=>{checks.push({name,data});console.log('PASS '+name);};
async function until(fn,label){const end=Date.now()+10000;while(Date.now()<end){if(await fn())return;await pause(40);}throw Error('Timed out: '+label);}
let page,roomPath;
async function patch(suffix,body){
  const res=await fetch('http://127.0.0.1:19445/'+roomPath+suffix+'.json?ns=demo-vocab-frontline-v1-default-rtdb',{
    method:'PATCH',headers:{Authorization:'Bearer owner','Content-Type':'application/json'},body:JSON.stringify(body)});
  if(!res.ok)throw Error(await res.text());
}
try{
  page=await browser.newPage({viewport:{width:1008,height:566},hasTouch:true,isMobile:true,
    userAgent:'Mozilla/5.0 (Linux; Android 14) AppleWebKit/537.36 Chrome/128 Mobile Safari/537.36'});
  page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
  await page.goto(BASE+'/__dev/frontline?room=R'+String(9900+Math.floor(Math.random()*100)));
  await page.locator('#fl-join').click();await until(()=>page.evaluate(()=>Frontline.inspect().metrics?.tankModelReady),'model ready');
  const s=await page.evaluate(()=>Frontline.inspect()),config=await page.evaluate(()=>FRONTLINE_DEV);
  roomPath=config.namespace+'/'+config.token+'/rooms/'+await page.locator('#fl-room').innerText();
  for(let i=0;i<12;i++){
    const angle=await page.evaluate(()=>Frontline.inspect().local.hull),delta=Math.atan2(Math.sin(-Math.PI/4-angle),Math.cos(-Math.PI/4-angle));
    if(Math.abs(delta)<.04)break;
    const key=delta>0?'KeyD':'KeyA';await page.keyboard.down(key);await pause(Math.min(380,Math.abs(delta)/1.7*1000));await page.keyboard.up(key);
  }
  await page.locator('#fl-speed').evaluate(el=>{el.value='2';el.dispatchEvent(new Event('input',{bubbles:true}));});
  await page.locator('[data-auto="1"]').tap();await pause(1700);await page.locator('[data-auto="1"]').tap();
  await patch('/players/'+s.id,{carried:'I'});await pause(220);
  await page.locator('#fl-speed').evaluate(el=>{el.value='1';el.dispatchEvent(new Event('input',{bubbles:true}));});
  for(const size of [{width:1672,height:941},{width:1008,height:566},{width:812,height:375},{width:667,height:320}]){
    await page.setViewportSize(size);await pause(160);
    const layout=await page.evaluate(()=>{
      const selectors=['.fl-brand','.fl-stats','.fl-coach','.fl-target','#fl-roster','#fl-leave','#fl-sound',
        '[data-auto="1"]','[data-auto="-1"]','[data-hold="left"]','[data-hold="right"]','.fl-speed-control','[data-hold="drop"]','[data-hold="bomb"]','[data-hold="fire"]'];
      const boxes=selectors.map(selector=>{const r=document.querySelector(selector).getBoundingClientRect();return{selector,x:r.x,y:r.y,right:r.right,bottom:r.bottom,height:r.height};});
      const overlaps=[];for(let i=0;i<boxes.length;i++)for(let j=i+1;j<boxes.length;j++){
        const a=boxes[i],b=boxes[j];if(a.x<b.right&&a.right>b.x&&a.y<b.bottom&&a.bottom>b.y)overlaps.push([a.selector,b.selector]);}
      const auto=document.querySelector('.fl-auto').getBoundingClientRect(),steer=document.querySelector('.fl-steer').getBoundingClientRect();
      return{width:innerWidth,height:innerHeight,boxes,overlaps,gap:steer.top-auto.bottom,
        inside:boxes.every(r=>r.x>=0&&r.y>=0&&r.right<=innerWidth&&r.bottom<=innerHeight),
        buttons44:boxes.filter(r=>r.selector.includes('data-')||r.selector==='#fl-leave'||r.selector==='#fl-sound').every(r=>r.height>=44)};
    });
    assert.ok(layout.inside&&layout.buttons44&&layout.gap>=40&&!layout.overlaps.length,JSON.stringify(layout));
    pass(size.width+'x'+size.height+' HUD and controls fit without overlap; AUTO gap is at least 40px',layout);
    await page.screenshot({path:path.join(OUT,'garden-'+size.width+'.png')});
  }
  await patch('/word',{target:'ELEPHANT',translation:'ช้าง'});await pause(180);
  const longWord=await page.evaluate(()=>{
    const target=document.querySelector('.fl-target').getBoundingClientRect(),left=document.querySelector('.fl-brand').getBoundingClientRect(),right=document.querySelector('#fl-roster').getBoundingClientRect();
    return{fits:target.left>left.right&&target.right<right.left,letters:document.querySelectorAll('#fl-word span').length,thai:document.querySelector('#fl-translation').textContent};
  });
  assert.ok(longWord.fits&&longWord.letters===8&&longWord.thai==='ช้าง',JSON.stringify(longWord));pass('eight-letter targets and Thai meaning remain clear on a small phone',longWord);
  const budget=await page.evaluate(()=>Frontline.inspect().metrics);
  assert.equal(budget.textures,1);assert.equal(budget.chunks,15);assert.equal(budget.effectPool,44);
  assert.ok(budget.calls<350&&budget.triangles<65000,JSON.stringify(budget));pass('richer garden uses one 512px shadow target, no image textures, 15 chunks and a fixed effects pool',budget);
  await page.setViewportSize({width:1008,height:566});await pause(180);
  const staged=await page.evaluate(()=>Frontline.inspect());
  for(const [key,p] of Object.entries(staged.room.players))if(p.bot)await patch('/players/'+key,{hp:0,respawnAt:Date.now()+120000});
  for(const key of Object.keys(staged.room.guards))await patch('/guards/'+key,{hp:0,respawnAt:Date.now()+120000});
  await patch('/word',{target:'APPLE',translation:'แอปเปิ้ล',completedAt:0});
  await until(()=>page.evaluate(()=>Frontline.inspect().metrics.bullets===0),'old shots finish');
  const shotCount=await page.evaluate(()=>Frontline.inspect().metrics.shotsShown);
  await page.locator('[data-hold="fire"]').tap();
  await until(()=>page.evaluate(n=>Frontline.inspect().metrics.shotsShown>n,shotCount),'native FIRE projectile');
  await page.screenshot({path:path.join(OUT,'reference-fire.png')});
  await until(()=>page.evaluate(()=>Frontline.inspect().metrics.bullets===0&&Frontline.inspect().metrics.explosions===0),'shot impacts expire');
  const blastCount=await page.evaluate(()=>Frontline.inspect().metrics.blastsShown);
  await page.locator('[data-hold="bomb"]').tap();await until(()=>page.locator('.fl-bomb-timer:visible').count(),'native BOMB countdown');
  await page.screenshot({path:path.join(OUT,'reference-bomb.png')});
  await until(()=>page.evaluate(n=>Frontline.inspect().metrics.blastsShown>n,blastCount),'native BOMB explosion');await pause(280);
  await page.screenshot({path:path.join(OUT,'reference-explosion.png')});
  const peak=await page.evaluate(()=>Frontline.inspect().metrics);
  assert.ok(peak.explosions>0&&peak.calls<350&&peak.triangles<65000,JSON.stringify(peak));
  pass('native FIRE, bomb fuse and gold/smoke explosion captured from the actual game within the draw budget',peak);
  assert.equal(errors.length,0,errors.join('\n'));pass('no JavaScript or shader errors');
  await writeFile(path.join(OUT,'results.json'),JSON.stringify({passed:true,checks,errors},null,2));
}catch(error){console.error(error);process.exitCode=1;if(page)await page.screenshot({path:path.join(OUT,'failure.png')});
  await writeFile(path.join(OUT,'results.json'),JSON.stringify({passed:false,checks,errors,error:error.stack},null,2));}
finally{await browser.close();}
