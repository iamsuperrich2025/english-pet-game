'use strict';
const fs=require('fs'),path=require('path'),http=require('http'),assert=require('assert/strict');
const deps=process.env.VW_NODE_DEPS||path.join(require('os').homedir(),'.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules');
const {chromium}=require(path.join(deps,'playwright')),sharp=require(path.join(deps,'sharp'));
const root=path.resolve(process.env.VW_ARENA_SOURCE||path.join(__dirname,'..')),out=process.env.VW_ARENA_OUTPUT||path.join(root,'work/arena-field');fs.mkdirSync(out,{recursive:true});
const harness=`<!doctype html><html><head><meta name="viewport" content="width=device-width,initial-scale=1"><link rel="stylesheet" href="/css/arena3d.css"></head><body><script>
window.state=JSON.parse(localStorage.getItem('arenaFieldTest')||'null')||{profileName:'admin',coins:1000,arenaIntro:true,arenaHomeIntro:true,arenaItems:{},sound:false,haptic:false};
window.adminAllowed=true;window.isAdmin=()=>adminAllowed;window.saveState=()=>localStorage.setItem('arenaFieldTest',JSON.stringify(state));window.addCoins=n=>state.coins+=n;window.vocabForStudent=()=>[['cat','แมว']];window.activePet=()=>null;window.toast=()=>{};
</script><script src="/js/vendor/three.min.js"></script><script src="/js/arena-field-visuals.js"></script><script src="/js/arena3d.js"></script></body></html>`;
const server=http.createServer((req,res)=>{const url=new URL(req.url,'http://localhost');if(url.pathname==='/test'){res.setHeader('Content-Type','text/html;charset=utf-8');return res.end(harness);}const file=path.resolve(root,'.'+decodeURIComponent(url.pathname));if(!file.startsWith(root+path.sep)||!fs.existsSync(file)){res.statusCode=404;return res.end();}res.setHeader('Content-Type',file.endsWith('.js')?'text/javascript':file.endsWith('.css')?'text/css':'application/octet-stream');fs.createReadStream(file).pipe(res);});
(async()=>{await new Promise(r=>server.listen(0,'127.0.0.1',r));const browser=await chromium.launch({headless:true,channel:'msedge',args:['--disable-background-timer-throttling','--disable-renderer-backgrounding']});const page=await browser.newPage({viewport:{width:812,height:375},hasTouch:true}),errors=[],checks=[];page.on('pageerror',e=>errors.push(e.message));const url=`http://127.0.0.1:${server.address().port}/test`;
const check=(name,result)=>{assert.ok(result,name);checks.push(name);};
try{
 await page.goto(url);await page.evaluate(()=>{adminAllowed=false;VocabArena3D.start();});check('non-admin engine entry denied',await page.locator('#va-root').count()===0);
 await page.evaluate(()=>{adminAllowed=true;VocabArena3D.start();});await page.waitForTimeout(600);
 check('small articulated hero replaces profile billboard',await page.evaluate(()=>!!VocabArena3D._t.player().spr.userData.rig));
 const initial=await page.evaluate(()=>VocabArena3D._t.stats());
 const pick=async letters=>page.evaluate(letters=>{const t=VocabArena3D._t;for(const ch of letters){t.bots[0].ch=ch;t.kill(0);t.collect(t.drops.length-1);}},letters);
 await pick(['C','A','T','T','Z','X']);
 check('pickups carried without remote completion',await page.evaluate(()=>VocabArena3D._t.cargo.length===6&&state.coins===1000&&Object.keys(VocabArena3D._t.bag).length===0));
 await pick(['Q']);check('full cargo preserves seventh ground drop',await page.evaluate(()=>VocabArena3D._t.cargo.length===6&&VocabArena3D._t.drops.some(d=>d.ch==='Q')));
 check('deposit rejected away from own house',await page.evaluate(()=>VocabArena3D._t.bank()===false));
 await page.evaluate(()=>{const t=VocabArena3D._t;t.player().pos.copy(t.home().position);t.bank();});
 check('bank consumes repeated letters exactly and awards once',await page.evaluate(()=>VocabArena3D._t.cargo.length===0&&VocabArena3D._t.bag.T===1&&VocabArena3D._t.bag.Z===1&&state.arenaStats.words===1&&state.coins>1000));
 check('empty bank cannot repeat rewards',await page.evaluate(()=>{const n=state.coins;VocabArena3D._t.bank();return n===state.coins;}));
 await page.evaluate(()=>VocabArena3D.stop());await page.reload();await page.evaluate(()=>VocabArena3D.start());
 check('warehouse survives page reload',await page.evaluate(()=>VocabArena3D._t.bag.T===1&&VocabArena3D._t.bag.Z===1));
 await page.evaluate(()=>VocabArena3D._t.player().pos.set(0,0,0));await pick(['A']);await page.evaluate(()=>VocabArena3D._t.down());
 check('downing drops carried letters and preserves bank',await page.evaluate(()=>VocabArena3D._t.cargo.length===0&&VocabArena3D._t.drops.some(d=>d.ch==='A')&&VocabArena3D._t.bag.Z===1));
 await page.evaluate(()=>VocabArena3D._t.recover());
 const x=await page.evaluate(()=>VocabArena3D._t.player().pos.x);await page.keyboard.down('KeyD');await page.waitForTimeout(300);await page.keyboard.up('KeyD');check('keyboard movement',await page.evaluate(x=>VocabArena3D._t.player().pos.x>x+.4,x));
 await page.keyboard.down('KeyD');await page.evaluate(()=>window.dispatchEvent(new Event('blur')));await page.keyboard.up('KeyD');await page.waitForTimeout(450);check('blur clears movement input',await page.evaluate(()=>VocabArena3D._t.player().vel.length()<.1));
 await page.evaluate(()=>{const t=VocabArena3D._t;for(let i=0;i<t.bots.length;i++)t.bots[i].group.position.set((i%3-1)*3,0,-4-Math.floor(i/3)*2);t.player().pos.set(0,0,0);});
 await page.waitForTimeout(400);await page.locator('[data-skill="basic"]').tap();
 check('attack rig responds to touch skill',await page.evaluate(()=>VocabArena3D._t.player().spr.userData.rig.attackUntil>performance.now()));
 await page.evaluate(()=>{const b=VocabArena3D._t.bots[0];b.hp=b.maxHp=10000;});
 const attackButton=await page.locator('[data-skill="basic"]').boundingBox();await page.mouse.move(attackButton.x+attackButton.width/2,attackButton.y+attackButton.height/2);await page.mouse.down();const attackAt=await page.evaluate(()=>VocabArena3D._t.player().spr.userData.rig.attackAt);await page.waitForTimeout(760);await page.mouse.up();check('hold attack repeats on cooldown',await page.evaluate(at=>VocabArena3D._t.player().spr.userData.rig.attackAt>at+250,attackAt));
 await page.evaluate(()=>{const b=VocabArena3D._t.bots[0];b.hp=80;});
 await pick(['B','D','F','G','H']);await page.evaluate(()=>VocabArena3D._t.cast('ult'));await page.waitForTimeout(160);
 const peak=await page.evaluate(()=>VocabArena3D._t.stats());await sharp(await page.screenshot()).webp({quality:92}).toFile(path.join(out,'arena-spell-mobile.webp'));
 check('bounded effects pool',peak.fx.active<=peak.fx.particles&&peak.fx.meshes<=48);
 for(const [width,height] of [[812,375],[667,320],[1366,768]]){
  await page.setViewportSize({width,height});await page.waitForTimeout(120);const fit=await page.evaluate(()=>{const selectors=['.va-top','.va-word-card','.va-player-card','.va-coins','.va-shop-btn','.va-energy','.va-bag','.va-party','.va-home-nav','.va-stick','.va-skills'];return selectors.map(s=>{const e=document.querySelector(s),r=e.getBoundingClientRect();return {s,fit:r.left>=0&&r.top>=0&&r.right<=innerWidth+.5&&r.bottom<=innerHeight+.5}});});check('HUD bounds '+width+'x'+height,fit.every(x=>x.fit));
  await page.locator('#va-shop-open').click();check('shop no-scroll '+width+'x'+height,await page.evaluate(()=>{const e=document.querySelector('#va-shop .va-panel');return e.scrollHeight<=e.clientHeight&&e.getBoundingClientRect().bottom<=innerHeight;}));await page.locator('#va-shop-close').click();
 }
 await page.setViewportSize({width:1366,height:768});await page.evaluate(()=>{const t=VocabArena3D._t;t.player().pos.set(-7,0,8);});await page.waitForTimeout(600);await sharp(await page.screenshot()).webp({quality:92}).toFile(path.join(out,'arena-field-desktop.webp'));
 await page.evaluate(()=>{VocabArena3D.stop();state.arenaHomeIntro=false;VocabArena3D.start();});await page.setViewportSize({width:812,height:375});check('intro fits short landscape',await page.evaluate(()=>{const e=document.querySelector('#va-intro .va-panel'),r=e.getBoundingClientRect();return e.scrollHeight<=e.clientHeight&&r.top>=0&&r.bottom<=innerHeight;}));await page.locator('#va-start').click();
 await page.evaluate(()=>{const t=VocabArena3D._t;t.triggerBoss();});check('co-op boss remains active',await page.evaluate(()=>VocabArena3D._t.boss().phase==='boss'));
 await page.evaluate(()=>{const t=VocabArena3D._t;t.peer('z-friend',{n:'เพื่อน',av:'blk1',x:4,z:4,yaw:1,hp:'A2:100:0:-'});});
 check('co-op peer and separate house join',await page.evaluate(()=>VocabArena3D._t.party().members.length===2));
 await page.evaluate(()=>VocabArena3D._t.gone('z-friend'));
 await page.evaluate(()=>{VocabArena3D.stop();VocabArena3D.start();});await page.waitForTimeout(1500);check('stop/reentry clears old callbacks',await page.evaluate(()=>VocabArena3D._t.boss().phase==='wave'&&document.querySelectorAll('#va-root').length===1));
 await page.evaluate(()=>{VocabArena3D.stop();state.noAnim=true;VocabArena3D.start();});check('low-power pool stays bounded',await page.evaluate(()=>{const f=VocabArena3D._t.stats().fx;return f.particles===256&&f.meshes===28;}));
 await page.evaluate(()=>{VocabArena3D.stop();localStorage.removeItem('arenaFieldTest');});check('no page errors',errors.length===0);
 fs.writeFileSync(path.join(out,'report.json'),JSON.stringify({checks,initial,peak,errors},null,2));console.log(JSON.stringify({passed:checks.length,initial,peak,errors,out},null,2));
}catch(e){console.error(e);console.error(errors);await sharp(await page.screenshot()).webp({quality:92}).toFile(path.join(out,'failure.webp'));process.exitCode=1;}finally{await browser.close();server.close();}
})();
