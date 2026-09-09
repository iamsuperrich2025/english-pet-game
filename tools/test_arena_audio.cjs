'use strict';
const fs=require('fs'),path=require('path'),http=require('http'),assert=require('assert/strict');
const repo=path.resolve(__dirname,'..'),root=path.resolve(process.env.VW_ARENA_SOURCE||repo);
const deps=path.join(require('os').homedir(),'.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules');
const {chromium}=require(path.join(deps,'playwright'));
const checks=[],ok=(name,value)=>{assert.ok(value,name);checks.push(name);};
const harness=`<!doctype html><meta name="viewport" content="width=device-width,initial-scale=1"><link rel="stylesheet" href="/css/arena3d.css"><script>
window.state={profileName:'audio-test',coins:1000,arenaIntro:true,arenaHomeIntro:true,arenaItems:{},arenaHero:'fire',arenaMap:'crystal',sound:true,haptic:false};window.isAdmin=()=>true;window.saveState=()=>{};window.addCoins=n=>state.coins+=n;window.vocabForStudent=()=>[['cat','แมว']];window.activePet=()=>null;window.toast=()=>{};
</script>`+['vendor/three.min','arena-audio','arena-field-visuals','arena-elements','arena-spell-catalog','arena-grimoire','arena-relics','arena-heroes','arena-maps','arena3d'].map(n=>`<script src="/js/${n}.js"></script>`).join('');
const server=http.createServer((req,res)=>{
 const url=new URL(req.url,'http://localhost');if(url.pathname==='/test'){res.setHeader('Content-Type','text/html;charset=utf-8');return res.end(harness);}
 const file=path.resolve(root,'.'+decodeURIComponent(url.pathname));if(!file.startsWith(root+path.sep)||!fs.existsSync(file)){res.statusCode=404;return res.end();}
 res.setHeader('Content-Type',file.endsWith('.js')?'text/javascript':file.endsWith('.css')?'text/css':file.endsWith('.mp3')?'audio/mpeg':'application/octet-stream');fs.createReadStream(file).pipe(res);
});
async function settle(page){await page.waitForTimeout(260);}
const stats=page=>page.evaluate(()=>ArenaAudio.stats());
const count=(s,k)=>s.played[k]||0;
async function start(page){await page.goto(`http://127.0.0.1:${server.address().port}/test`);await page.evaluate(()=>{VocabArena3D.start();const t=VocabArena3D._t;t.player().pos.set(0,0,0);t.bots.forEach((b,i)=>{b.attackAt=performance.now()+600000;b.hp=b.maxHp=10000;b.group.position.set(5+i*.5,0,0);});});}
(async()=>{
 await new Promise(r=>server.listen(0,'127.0.0.1',r));const browser=await chromium.launch({channel:'msedge',headless:true});
 try{
  for(const mobile of [false,true]){
   const page=await browser.newPage({viewport:mobile?{width:812,height:375}:{width:1366,height:768},isMobile:mobile,hasTouch:mobile});
   const errors=[],requests=[];page.on('pageerror',e=>errors.push(e.message));page.on('request',r=>{if(r.url().includes('/sound/arena/'))requests.push(r.url());});
   await start(page);await settle(page);
   ok(`${mobile?'mobile':'desktop'} only four essential files preload`,requests.length===4&&(await stats(page)).state==='closed');
   await page.evaluate(()=>ArenaAudio.play('magicShot'));ok('no sound before trusted input',count(await stats(page),'magicShot')===0);
   if(mobile)await page.locator('#va-home-nav').tap();else await page.keyboard.press('Shift');
   await page.waitForFunction(()=>ArenaAudio.stats().state==='running');await settle(page);
   ok('first gesture unlocks Web Audio',(await stats(page)).unlocked);
   await page.evaluate(()=>{const t=VocabArena3D._t;t.player().pos.set(0,0,0);});
   const before=await stats(page);
   if(mobile)await page.locator('[data-skill="basic"]').tap();else await page.keyboard.press('Space');
   await page.waitForTimeout(550);const shot=await stats(page);
   ok('one shot cue and two real impacts for admin echo',count(shot,'magicShot')-count(before,'magicShot')===1&&count(shot,'hitLetter')-count(before,'hitLetter')===2);
   await page.evaluate(()=>VocabArena3D._t.kill(0));await settle(page);
   ok('enemy defeat plays once',count(await stats(page),'enemyDefeat')===1);
   await page.evaluate(()=>VocabArena3D._t.cast('ult'));await settle(page);ok('unavailable MEGA produces one soft wrong cue',count(await stats(page),'wrong')===1);
   for(let i=0;i<5;i++){await page.evaluate(i=>{const t=VocabArena3D._t;t.collect(t.drops.indexOf(t.crystalNodes[i].drop));},i);await settle(page);}
   ok('five crystal removals and single MEGA ready',count(await stats(page),'letterBreak')===5&&count(await stats(page),'megaReady')===1);
   await page.keyboard.press('Digit3');await settle(page);
   ok('MEGA fire distinct and once',count(await stats(page),'megaFire')===1&&await page.evaluate(()=>VocabArena3D._t.megaUses===4));
   await page.evaluate(()=>VocabArena3D._t.cast('light'));await settle(page);
   ok('shield callback plays activation cue',count(await stats(page),'shield')===1);
   const reward=await page.evaluate(()=>state.coins);await page.evaluate(()=>{VocabArena3D._t.complete();VocabArena3D._t.complete();});await settle(page);
   ok('coin once only after actual award',count(await stats(page),'coin')===1&&await page.evaluate(n=>state.coins>n,reward));
   ok('correct progress has audible cue',count(await stats(page),'correct')>0);
   await page.evaluate(()=>{state.sound=false;ArenaAudio.play('coin');});await settle(page);
   ok('shared mute prevents playback',count(await stats(page),'coin')===1);
   await page.evaluate(()=>state.sound=true);
   await page.evaluate(()=>{const t=VocabArena3D._t;t.player().pos.set(0,0,0);for(let i=0;i<500;i++)ArenaAudio.play('uiClick');});await settle(page);
   ok('UI spam bounded',count(await stats(page),'uiClick')<=3&&(await stats(page)).dropped>400);
   const beforeFetch=(await stats(page)).fetches;
   await page.evaluate(async()=>{for(let i=0;i<25;i++){ArenaAudio.play('magicShot');ArenaAudio.play('hitLetter');await new Promise(r=>setTimeout(r,105));}});await settle(page);
   ok('rapid firing reuses decoded clips with bounded voices',(await stats(page)).fetches===beforeFetch&&(await stats(page)).peak<=8&&(await stats(page)).voices===0);
   await page.evaluate(()=>{Object.defineProperty(document,'hidden',{configurable:true,value:true});document.dispatchEvent(new Event('visibilitychange'));});await settle(page);
   ok('background suspends and silences',(await stats(page)).state==='suspended'&&(await stats(page)).voices===0);
   await page.evaluate(()=>{Object.defineProperty(document,'hidden',{configurable:true,value:false});document.dispatchEvent(new Event('visibilitychange'));});
   await page.keyboard.press('Shift');await page.waitForFunction(()=>ArenaAudio.stats().state==='running');
   await page.locator('#va-shop-open').click();await settle(page);const closeBefore=count(await stats(page),'uiBack');await page.keyboard.press('Escape');await settle(page);ok('keyboard menu close plays back once',count(await stats(page),'uiBack')===closeBefore+1);
   const exitBefore=count(await stats(page),'uiBack');await page.locator('#va-exit').click();await settle(page);
   ok('exit plays back cue and releases context',count(await stats(page),'uiBack')===exitBefore+1&&(await stats(page)).state==='closed');
   ok('game loads and runs without JS errors',errors.length===0);
   await page.close();
  }
  const page=await browser.newPage({viewport:{width:812,height:375}}),errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.route('**/sound/arena/shield.mp3',r=>r.fulfill({status:404,body:''}));
  await page.route('**/sound/arena/wrong.mp3',r=>r.fulfill({status:200,body:'invalid mp3'}));
  await start(page);await page.keyboard.press('Shift');await settle(page);
  await page.evaluate(()=>{VocabArena3D._t.cast('light');VocabArena3D._t.cast('ult');});await settle(page);
  const bad=await stats(page);await page.evaluate(()=>{for(let i=0;i<100;i++){ArenaAudio.play('wrong');ArenaAudio.play('shield');}});await settle(page);
  ok('404 and decode failures do not crash game or retry storm',errors.length===0&&(await stats(page)).fetches===bad.fetches&&await page.evaluate(()=>VocabArena3D._t.running));
  await page.evaluate(()=>{const t=VocabArena3D._t;t.player().pos.set(0,0,0);t.peer('peer2',{n:'Peer',x:2,z:0,av:'AH:wind',hp:'A2:100:0:-',w:0,c:'-'});t.down();t.peer('peer2',{n:'Peer',x:2,z:0,av:'AH:wind',hp:'A2:100:0:-',w:0,c:'R|local|1'});});await settle(page);
  ok('peer join and revive remain functional',await page.evaluate(()=>{const t=VocabArena3D._t;return t.party().members.includes('peer2')&&t.health().hp>0;}));
  await page.evaluate(()=>{VocabArena3D._t.gone('peer2');VocabArena3D.stop();});await settle(page);await page.close();
  // Decode every final runtime file in the actual browser; verify non-silent PCM and short mono buffers.
  const audioPage=await browser.newPage();await audioPage.goto(`http://127.0.0.1:${server.address().port}/test`);
  const files=fs.readdirSync(path.join(root,'sound/arena')).filter(n=>n.endsWith('.mp3'));
  const pcm=await audioPage.evaluate(async files=>{const a=new AudioContext(),rows=[];for(const file of files){const b=await a.decodeAudioData(await (await fetch('/sound/arena/'+file)).arrayBuffer());let peak=0,energy=0;for(const x of b.getChannelData(0)){peak=Math.max(peak,Math.abs(x));energy+=x*x;}rows.push({file,channels:b.numberOfChannels,duration:b.duration,peak,rms:Math.sqrt(energy/b.length)});}await a.close();return rows;},files);
  ok('all 11 final MP3s decode to non-silent short mono audio',pcm.length===11&&pcm.every(r=>r.channels===1&&r.duration<.65&&r.peak>.01&&r.peak<1));
  await audioPage.close();
  const report={checks:checks.length,passed:checks,pcm};
  const out=process.env.VW_ARENA_OUTPUT||path.join(repo,'work/arena-audio');fs.mkdirSync(out,{recursive:true});fs.writeFileSync(path.join(out,'results.json'),JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));
 }finally{await browser.close();server.close();}
})().catch(e=>{console.error(e);server.close();process.exitCode=1;});
