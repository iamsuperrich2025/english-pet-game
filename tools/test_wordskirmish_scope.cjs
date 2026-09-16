'use strict';
// Scope UI plus real camera/muzzle raycasts. Offline fixture: no login or Firebase.
const fs=require('fs'),path=require('path'),http=require('http'),assert=require('assert');
const repo=path.resolve(process.env.SKM_ROOT||path.join(__dirname,'..'));
const deps=path.join(require('os').homedir(),'.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules');
const {chromium}=require(path.join(deps,'playwright')),sharp=require(path.join(deps,'sharp'));
const out=process.env.SKM_OUT||path.join(require('os').tmpdir(),'wordskirmish-scope');fs.mkdirSync(out,{recursive:true});
const fixture='<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><link rel="stylesheet" href="/css/wordskirmish.css"><style>body{margin:0}</style><body><script>window.state={sound:false,coins:100,profileName:"Preview"};window.isAdmin=()=>true;window.vocabForStudent=()=>[["cat","แมว"]];window.addCoins=()=>{};window.saveState=()=>{};window.Music={suspendBg(){},resumeBg(){}};</script><script src="/js/vendor/three.min.js"></script><script src="/js/wordskirmish-br.js"></script><script src="/js/wordskirmish-field.js"></script><script src="/js/wordskirmish.js"></script><script>WordSkirmish.open()</script>';
const server=http.createServer((req,res)=>{
  const url=new URL(req.url,'http://local');
  if(url.pathname==='/favicon.ico'){res.writeHead(204).end();return;}
  if(url.pathname==='/preview'){res.writeHead(200,{'content-type':'text/html; charset=utf-8'}).end(fixture);return;}
  const file=path.resolve(repo,'.'+url.pathname);if(!file.startsWith(repo+path.sep))return res.writeHead(403).end();
  fs.readFile(file,(e,b)=>{res.writeHead(e?404:200,{'content-type':file.endsWith('.js')?'text/javascript':file.endsWith('.css')?'text/css':'application/octet-stream','cache-control':'no-store'});res.end(e?'missing':b)});
});
const checks=[];function ok(name,value){assert.ok(value,name);checks.push(name);console.log('PASS '+name)}
(async()=>{
  await new Promise(r=>server.listen(0,'127.0.0.1',r));
  const browser=await chromium.launch({channel:'msedge',headless:true});
  try{
    const page=await browser.newPage({viewport:{width:1367,height:617}}),errors=[];
    page.on('pageerror',e=>{errors.push(e.message);console.error(e.message)});
    await page.goto(`http://127.0.0.1:${server.address().port}/preview`);
    await page.waitForFunction(()=>window.WordSkirmish?._t.playerMesh);
    await page.locator('#skm-training').click();
    await page.evaluate(()=>WordSkirmish._t.setRunning(false));await page.waitForTimeout(70);
    await page.evaluate(()=>{const T=WordSkirmish._t;T.setRunning(true);T.setPlayer({x:0,z:0});T.setLook(0,.28);T.step(0)});
    await page.locator('#skm-scope').click();
    const zoom=await page.evaluate(()=>{
      const T=WordSkirmish._t;T.cameraTick();T.renderer.render(T.scene,T.camera);
      return {scoped:T.scoped,factor:Math.tan(T.FOV*Math.PI/360)/Math.tan(T.camera.fov*Math.PI/360),actor:T.playerMesh.visible,pressed:document.querySelector('#skm-scope').getAttribute('aria-pressed')};
    });
    ok('SCOPE tap gives true 2.5x optical FOV zoom and hides the local avatar',zoom.scoped&&Math.abs(zoom.factor-2.5)<1e-9&&!zoom.actor&&zoom.pressed==='true');
    await page.keyboard.down('v');await page.keyboard.down('v');await page.keyboard.up('v');
    ok('held V toggles scope only once and restores normal FOV/avatar',await page.evaluate(()=>!WordSkirmish._t.scoped&&WordSkirmish._t.camera.fov===WordSkirmish._t.FOV&&WordSkirmish._t.playerMesh.visible));
    const sensitivity=await page.evaluate(()=>{const T=WordSkirmish._t;T.setLook(0,.28);T.applyLook(10,10);const normal=T.setLook();T.setLook(0,.28);T.setScope(true);T.applyLook(10,10);const scope=T.setLook();return {normal,scope};});
    ok('zoom reduces drag sensitivity by the same magnification',Math.abs(sensitivity.normal.lookYaw/sensitivity.scope.lookYaw-2.5)<1e-9);
    const walkPose=await page.evaluate(()=>{const T=WordSkirmish._t;T.onKey({code:'KeyW'});T.step(.03);const before=T.playerMesh.userData.rig.hipL.rotation.x;T.resolveShot();const after=T.playerMesh.userData.rig.hipL.rotation.x;T.onKeyUp({code:'KeyW'});return {before,after,moving:T.player.moving}});
    ok('firing while moving preserves the walking pose',walkPose.moving&&Math.abs(walkPose.before-walkPose.after)<1e-9);
    // All projected points are derived from the actual camera and the actual muzzle joint.
    const aim=await page.evaluate(()=>{
      const T=WordSkirmish._t,failures=[],samples=[];
      T.bots.forEach(b=>{b.alive=false;b.respawnAt=Infinity;b.mesh.visible=false});
      const scenery=T.scene.children.filter(m=>m!==T.playerMesh&&(m.isMesh||m.userData.home));
      const originalY=scenery.map(m=>m.position.y);scenery.forEach(m=>m.position.y-=1000);
      const actor=new THREE.Group(),target=new THREE.Mesh(new THREE.SphereGeometry(.12,12,8),new THREE.MeshBasicMaterial({color:0xff0000}));
      actor.add(target);T.scene.add(actor);const bot={mesh:actor,alive:true,hp:100};actor.userData.skirmish=true;actor.userData.bot=bot;T.bots.push(bot);
      let maxPixels=0,maxMuzzleError=0,shots=0;const originalNow=performance.now.bind(performance);let now=originalNow()+1000;performance.now=()=>now;
      for(const pose of ['stand','crouch','prone'])for(const scoped of [false,true])for(const yaw of [0,.8,2.4,4.6])for(const pitch of [.1,.28,.55]){
        T.setPlayer({x:0,z:0,yaw,alive:true});T.setStance(pose);T.setLook(yaw,pitch);T.setScope(scoped);T.cameraTick();T.camera.updateMatrixWorld();
        const ray=new THREE.Raycaster();ray.setFromCamera(new THREE.Vector2(0,0),T.camera);
        actor.position.copy(ray.ray.at(12,new THREE.Vector3()));actor.visible=true;bot.alive=true;bot.hp=100;target.userData.hit='body';T.scene.updateMatrixWorld(true);
        const shot=T.resolveShot();
        const ndc=shot.point.clone().project(T.camera);maxPixels=Math.max(maxPixels,Math.hypot(ndc.x*innerWidth/2,ndc.y*innerHeight/2));
        const actualMuzzle=T.playerMesh.userData.rig.muzzle.getWorldPosition(new THREE.Vector3());maxMuzzleError=Math.max(maxMuzzleError,actualMuzzle.distanceTo(shot.muzzle));
        if(shot.hit?.object!==target)failures.push({pose,scoped,yaw,pitch,reason:'centre target missed'});
        now+=400;const fired=T.fire();shots++;
        if(!fired||bot.hp!==65)failures.push({pose,scoped,yaw,pitch,reason:'wrong damage',hp:bot.hp});
        const actual=T.lastShotTrace;if(!actual||actual.point.distanceTo(shot.point)>.0001)failures.push({reason:'fire differs from preview ray'});
      }
      target.userData.hit='head';bot.hp=100;bot.alive=true;actor.visible=true;now+=400;T.fire();const headshot=bot.hp===0&&!bot.alive;
      bot.hp=100;bot.alive=true;actor.visible=true;actor.position.x+=4;now+=400;T.fire();const miss=bot.hp===100&&T.lastShotTrace.hit===null;
      // A nearby blocker can hide only the muzzle path while the camera still sees the target.
      T.setPlayer({x:0,z:0,yaw:0});T.setStance('stand');T.setLook(0,.28);T.setScope(true);T.cameraTick();T.camera.updateMatrixWorld();
      const ray=new THREE.Raycaster();ray.setFromCamera(new THREE.Vector2(0,0),T.camera);actor.position.copy(ray.ray.at(18,new THREE.Vector3()));target.userData.hit='body';actor.visible=true;bot.alive=true;bot.hp=100;T.scene.updateMatrixWorld(true);
      const clear=T.resolveShot();const blocker=scenery.find(m=>m.isMesh&&m.geometry.type==='BoxGeometry');const savedPosition=blocker.position.clone(),savedScale=blocker.scale.clone();
      blocker.position.copy(clear.muzzle).lerp(clear.point,.12);blocker.scale.set(.35,.3,.35);T.scene.updateMatrixWorld(true);
      now+=400;T.fire();const blocked=bot.hp===100&&T.lastShotTrace.hit?.object===blocker&&T.lastShotTrace.point.distanceTo(T.lastShotTrace.target)>.5;
      blocker.position.copy(savedPosition);blocker.scale.copy(savedScale);
      // The visible bullet never passes its damage endpoint; all shots reuse four meshes.
      let trailError=0;for(let i=0;i<100;i++){T.step(.01);for(const t of T.shotTrails)if(t.mesh.visible){const head=t.mesh.position.clone().addScaledVector(t.direction,t.mesh.scale.z/2);trailError=Math.max(trailError,head.distanceTo(t.start.clone().addScaledVector(t.direction,t.travel)));}}
      const trailsDone=T.shotTrails.every(t=>!t.mesh.visible),poolSize=T.shotTrails.length;
      const benchStart=originalNow();for(let i=0;i<100;i++)T.resolveShot();const msPerShot=(originalNow()-benchStart)/100;
      performance.now=originalNow;T.bots.pop();T.scene.remove(actor);target.geometry.dispose();target.material.dispose();scenery.forEach((m,i)=>m.position.y=originalY[i]);
      return {shots,failures:failures.slice(0,8),maxPixels,maxMuzzleError,headshot,miss,blocked,trailError,trailsDone,poolSize,msPerShot};
    });
    console.log(JSON.stringify(aim));
    ok('72 shots hit the centred target in standing/crouch/prone, normal/scope, all tested yaws and pitches',aim.shots===72&&!aim.failures.length);
    ok('impact stays within one pixel of the reticle and starts at the real muzzle',aim.maxPixels<1&&aim.maxMuzzleError<1e-6);
    ok('headshots still KO and shots off target do no damage',aim.headshot&&aim.miss);
    ok('muzzle obstruction stops the bullet even when the camera sees past it',aim.blocked);
    ok('trails use the damage endpoint, expire, and reuse a four-mesh pool',aim.trailError<1e-6&&aim.trailsDone&&aim.poolSize===4);
    const liveRig=await page.evaluate(()=>{
      const T=WordSkirmish._t,oldNow=performance.now.bind(performance);let now=1e9;performance.now=()=>now;
      T.setPlayer({x:0,z:0,yaw:0,alive:true});T.setStance('stand');T.setScope(true);
      const bot=T.bots[0];const results=[];
      for(const pitch of [.28,.48]){
        bot.hp=100;bot.alive=true;bot.mesh.visible=true;bot.mesh.position.set(0,0,-10);bot.mesh.rotation.set(0,Math.PI,0);T.poseChibi(bot.mesh,{pose:'stand',alive:true});
        T.setLook(0,pitch);T.cameraTick();T.scene.updateMatrixWorld(true);now+=400;T.fire();
        results.push({hp:bot.hp,part:T.lastShotTrace.hit?.object.userData.hit});
      }
      performance.now=oldNow;return results;
    });
    ok('scope hits the real avatar head/body with the correct damage',liveRig[0].hp===0&&liveRig[0].part==='head'&&liveRig[1].hp===65&&liveRig[1].part==='body');
    const visuals=[];
    for(const size of [{width:1367,height:617},{width:812,height:375},{width:667,height:320}]){
      await page.setViewportSize(size);await page.waitForFunction(()=>Math.abs(WordSkirmish._t.camera.aspect-innerWidth/innerHeight)<1e-8);
      const geometry=await page.evaluate(()=>{
        const T=WordSkirmish._t;T.resetRun();T.setRunning(true);T.setPlayer({x:0,z:0,alive:true});T.setLook(0,.28);T.step(0);T.setScope(true);T.cameraTick();
        const bot=T.bots[0];bot.hp=100;bot.alive=true;bot.mesh.position.set(0,0,-10);bot.mesh.rotation.set(0,Math.PI,0);bot.mesh.visible=true;T.poseChibi(bot.mesh,{pose:'stand',alive:true});
        T.renderer.render(T.scene,T.camera);
        const rect=s=>document.querySelector(s).getBoundingClientRect(),a=rect('.skm-cross'),b=rect('canvas'),r=rect('.skm-scope-ring'),scope=rect('#skm-scope');
        const controls=[...document.querySelectorAll('#skm-game .skm-float,#skm-game .skm-joy')].map(e=>({id:e.id,r:e.getBoundingClientRect()}));
        const overlap=controls.filter(e=>e.id!=='skm-scope').some(({r})=>scope.left<r.right&&scope.right>r.left&&scope.top<r.bottom&&scope.bottom>r.top);
        return {crossError:Math.hypot(a.x+a.width/2-b.x-b.width/2,a.y+a.height/2-b.y-b.height/2),ringError:Math.hypot(r.x+r.width/2-b.x-b.width/2,r.y+r.height/2-b.y-b.height/2),inside:controls.every(({r})=>r.x>=0&&r.y>=0&&r.right<=innerWidth+.1&&r.bottom<=innerHeight+.1),overlap,draws:T.renderer.info.render.calls};
      });
      console.log(JSON.stringify({size,geometry}));
      ok(`reticle/ring centred and all controls usable at ${size.width}x${size.height}`,geometry.crossError<.1&&geometry.ringError<.1&&geometry.inside&&!geometry.overlap);
      const file=`scope-${size.width}.webp`;await sharp(await page.screenshot()).webp({quality:92}).toFile(path.join(out,file));visuals.push({size,geometry,file});
    }
    const resets=await page.evaluate(async()=>{const T=WordSkirmish._t;T.setScope(true);T.applyDamage('head');const death=!T.scoped&&T.camera.fov===T.FOV;T.resetRun();T.setScope(true);WordSkirmish.close();const close=!T.scoped&&T.shotTrails.every(t=>!t.mesh.visible);await WordSkirmish.open();const reopen=!T.scoped&&T.camera.fov===T.FOV;return {death,close,reopen}});
    ok('death, exit and reopening reset zoom and trails',resets.death&&resets.close&&resets.reopen);
    // Old saved layouts predate SCOPE and may put DROP in its default slot.
    await page.evaluate(()=>{WordSkirmish.close();localStorage.setItem('skmPad1',JSON.stringify({joy:{x:.45,y:.27},auto:{x:.14,y:.37},crouch:{x:.32,y:.56},prone:{x:.32,y:.4},dodge:{x:.32,y:.26},fire:{x:.76,y:.37},drop:{x:.72,y:.82}}))});
    await page.reload();await page.waitForFunction(()=>window.WordSkirmish?._t.playerMesh);
    const saved=await page.evaluate(()=>{const a=document.querySelector('#skm-scope').getBoundingClientRect();return [...document.querySelectorAll('#skm-fire,#skm-drop,#skm-joy')].every(e=>{const b=e.getBoundingClientRect();return a.right<=b.left||a.left>=b.right||a.bottom<=b.top||a.top>=b.bottom})});ok('new SCOPE avoids collisions with existing saved control positions',saved);
    ok('no browser errors',errors.length===0);await page.evaluate(()=>{WordSkirmish.close();localStorage.clear()});
    fs.writeFileSync(path.join(out,'scope-report.json'),JSON.stringify({checks,zoom,sensitivity,aim,liveRig,visuals,resets,errors},null,2));console.log(`wordskirmish scope ok ${checks.length}; outputs ${out}`);
  }finally{await browser.close();server.close();}
})().catch(e=>{console.error(e);process.exitCode=1;server.close()});
