/* Native driving through rendered garden props and grass; real base/edge stops stay explicit. */
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {mkdir,writeFile} from 'node:fs/promises';
import path from 'node:path';
const require=createRequire(import.meta.url),{chromium}=require(process.env.FRONTLINE_PLAYWRIGHT||'playwright');
const BASE=process.env.FRONTLINE_BASE||'http://127.0.0.1:19444',OUT=path.resolve('work/frontline-movement');
await mkdir(OUT,{recursive:true});
const browser=await chromium.launch({channel:'chrome',headless:true,args:['--enable-unsafe-swiftshader','--disable-background-timer-throttling','--disable-renderer-backgrounding']});
const errors=[],checks=[],requests=[],pause=ms=>new Promise(r=>setTimeout(r,ms)),state=p=>p.evaluate(()=>Frontline.inspect());
let phone,peer,roomPath,owner;
const pass=(name,data=true)=>{checks.push({name,data});console.log('PASS '+name);};
async function until(fn,label,ms=15000){const end=Date.now()+ms;while(Date.now()<end){if(await fn())return;await pause(50);}throw Error('Timed out: '+label);}
async function admin(method,suffix='',body){const r=await fetch('http://127.0.0.1:19445/'+roomPath+suffix+'.json?ns=demo-vocab-frontline-v1-default-rtdb',{
  method,headers:{Authorization:'Bearer owner','Content-Type':'application/json'},body:body===undefined?undefined:JSON.stringify(body)});
  if(!r.ok)throw Error(await r.text());return r.json();}
async function stop(){const auto=(await state(phone)).input.auto;if(auto)await phone.locator('[data-auto="'+auto+'"]').tap();await pause(220);}
async function place(x,z,hull=0){
  await stop();await admin('PATCH','/players/'+owner,{hp:0,carried:'',respawnAt:Date.now()+120000});
  await until(async()=>(await state(phone)).local.hp===0,'fixture disabled tank');
  // Hold the fixture timestamp briefly so old in-flight movement cannot undo the respawn pose.
  await admin('PATCH','/players/'+owner,{hp:5000,x,z,hull,turret:hull,t:Date.now()+650,respawnAt:0});
  await until(async()=>{const p=(await state(phone)).local;return p.hp===5000&&Math.hypot(p.x-x,p.z-z)<.08;},'fixture respawn pose');
  await pause(750);
  const p=(await state(phone)).local;assert.ok(Math.hypot(p.x-x,p.z-z)<.12,'respawn position remains stable');
}
async function peerSees(p){await until(async()=>{const q=(await state(peer)).room.players[owner];return q&&Math.hypot(q.x-p.x,q.z-p.z)<.2;},'peer receives final drive position');}
async function across(mode,target,capture){
  await phone.evaluate(()=>{window.__movementAtCenter=false;});
  await phone.locator('[data-auto="'+mode+'"]').tap();
  const moving=phone.evaluate(({mode,target})=>new Promise((resolve,reject)=>{
    let previous=null,last=0,stalled=0,maxStall=0,travel=0,minimum=Infinity,frames=0;const begin=performance.now();
    function frame(now){
      const s=Frontline.inspect(),p=s.local;
      if(!p||s.input.auto!==mode)return reject(Error('Native AUTO interrupted'));
      if(previous){const distance=Math.hypot(p.x-previous.x,p.z-previous.z),dt=Math.min(.05,(now-last)/1000);travel+=distance;stalled=distance<.000001?stalled+dt:0;maxStall=Math.max(maxStall,stalled);}
      minimum=Math.min(minimum,Math.hypot(p.x-target.x,p.z-target.z));frames++;if(minimum<.3)window.__movementAtCenter=true;
      if(mode===1?p.z<target.z-3.4:p.z>target.z+3.4)return resolve({x:p.x,z:p.z,travel,minimum,maxStall,frames});
      if(now-begin>12000)return reject(Error('Tank stalled before crossing rendered decoration'));
      previous={x:p.x,z:p.z};last=now;requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }),{mode,target});
  if(capture){await until(()=>phone.evaluate(()=>window.__movementAtCenter),'tank crossing the decoration');await phone.screenshot({path:path.join(OUT,capture)});}
  const sample=await moving;
  await stop();assert.ok(sample.travel>6.4&&sample.minimum<.3&&sample.maxStall<.2,JSON.stringify(sample));await peerSees((await state(phone)).local);return sample;
}
async function target(kind){return phone.evaluate(kind=>{
  const probe=window.__movementProbe,F=Frontline,T=THREE,here=F.inspect().local,bases=Object.values(F.inspect().room.bases),points=[];
  if(kind==='grass'){
    const mesh=probe.grass,matrix=new T.Matrix4();mesh.updateWorldMatrix(true,false);
    for(let i=1;i<mesh.count;i+=3){mesh.getMatrixAt(i,matrix);const p=new T.Vector3().setFromMatrixPosition(matrix).applyMatrix4(mesh.matrixWorld);points.push({x:p.x,z:p.z});}
  }else for(const {group,index} of probe.gardens){if(index!==kind||!group.visible)continue;const p=group.getWorldPosition(new T.Vector3());points.push({x:p.x,z:p.z});}
  const safe=points.filter(p=>Math.abs(p.x)<65&&Math.abs(p.z)<65&&bases.every(b=>{const closest=Math.max(p.z-4,Math.min(p.z+4,b.z));return Math.hypot(p.x-b.x,closest-b.z)>5;}));
  safe.sort((a,b)=>Math.hypot(a.x-here.x,a.z-here.z)-Math.hypot(b.x-here.x,b.z-here.z));return safe[0]||null;
},kind);}
async function stillRendered(kind,point){return phone.evaluate(({kind,point})=>{
  const probe=window.__movementProbe,T=THREE;
  if(kind==='grass'){const mesh=probe.grass,m=new T.Matrix4();for(let i=1;i<mesh.count;i+=3){mesh.getMatrixAt(i,m);const p=new T.Vector3().setFromMatrixPosition(m).applyMatrix4(mesh.matrixWorld);if(Math.hypot(point.x-p.x,point.z-p.z)<.04)return true;}return false;}
  return probe.gardens.some(({group,index})=>{if(index!==kind||!group.visible)return false;const p=group.getWorldPosition(new T.Vector3());return Math.hypot(point.x-p.x,point.z-p.z)<.04;});
},{kind,point});}
try{
  phone=await browser.newPage({viewport:{width:1008,height:566},hasTouch:true,isMobile:true,
    userAgent:'Mozilla/5.0 (Linux; Android 14) AppleWebKit/537.36 Chrome/128 Mobile Safari/537.36'});
  peer=await browser.newPage({viewport:{width:812,height:375}});const code='R'+String(7200+Math.floor(Math.random()*700));
  for(const page of [phone,peer]){page.on('pageerror',e=>errors.push(e.message));page.on('request',r=>requests.push(r.url()));await page.goto(BASE+'/__dev/frontline?room='+code);}
  await phone.evaluate(()=>{
    const F=Frontline,probe=window.__movementProbe={gardens:[],grass:null,boundary:null};
    const garden=F.makeGarden;F.makeGarden=(shapes,index)=>{const group=garden(shapes,index);probe.gardens.push({group,index});return group;};
    const flora=F.makeFlora;F.makeFlora=root=>{const before=new Set(root.children),result=flora(root);probe.grass=root.children.find(mesh=>!before.has(mesh)&&mesh.isInstancedMesh);return result;};
    const boundary=F.makeBoundary;F.makeBoundary=(scene,shapes)=>{const result=boundary(scene,shapes);probe.boundary=scene.getObjectByName('frontline-arena-edge');return result;};
  });
  for(const page of [phone,peer]){await page.locator('#fl-join').click();await until(async()=>(await state(page)).metrics?.tankModelReady,'joined');}
  const s=await state(phone),config=await phone.evaluate(()=>FRONTLINE_DEV);owner=s.id;roomPath=config.namespace+'/'+config.token+'/rooms/'+code;
  // The peer observes movement only; disable its hull as well as bots so it cannot block the vault-crossing fixture.
  const frozen={};for(const [key,p] of Object.entries(s.room.players))if(key!==owner){frozen['players/'+key+'/hp']=0;frozen['players/'+key+'/respawnAt']=Date.now()+300000;}
  for(const key of Object.keys(s.room.guards)){frozen['guards/'+key+'/hp']=0;frozen['guards/'+key+'/respawnAt']=Date.now()+300000;}
  for(const key of Object.keys(s.room.letters)){frozen['letters/'+key+'/x']=75;frozen['letters/'+key+'/z']=75;}await admin('PATCH','',frozen);
  await phone.locator('#fl-speed').evaluate(el=>{el.value='1';el.dispatchEvent(new Event('input',{bubbles:true}));});
  for(const [kind,name] of [[0,'bush'],[1,'flower clump'],[2,'crate'],[3,'decorative fence'],[5,'tree'],['grass','instanced grass']]){
    const point=await target(kind);assert.ok(point,'visible '+name+' target');await place(point.x,point.z+3.5);
    assert.ok(await stillRendered(kind,point),'target survives nearby chunk reassignment');
    const capture=kind===0?'foliage-pass.png':kind===3?'fence-pass.png':kind==='grass'?'grass-pass.png':null;
    const forward=await across(1,point,capture),reverse=await across(-1,point);
    pass('AUTO FORWARD and AUTO REVERSE cross the actual '+name+' without stalling; peer sees both legs',{point,forward,reverse});
    if(kind===0||kind==='grass')await phone.screenshot({path:path.join(OUT,kind===0?'bush-drive.png':'grass-drive.png')});
  }
  const other=(await state(peer)).id,base=(await admin('GET','/bases/'+other));await place(base.x,base.z+6.5);
  await phone.locator('[data-auto="1"]').tap();await until(async()=>await phone.locator('#fl-drive').innerText()==='BASE LOCKED','intact rival base feedback');
  const blocked=(await state(phone)).local;await pause(500);const stopped=(await state(phone)).local;
  assert.ok(Math.hypot(stopped.x-base.x,stopped.z-base.z)>=4.2&&Math.hypot(stopped.x-blocked.x,stopped.z-blocked.z)<.08);
  await phone.screenshot({path:path.join(OUT,'base-locked.png')});pass('intact rival vault still blocks entry and explains BASE LOCKED');
  await admin('PATCH','/bases/'+other,{hp:0});await until(async()=>(await state(phone)).local.z<base.z-4.5,'opened rival base traversed');
  assert.equal(await phone.locator('#fl-drive').innerText(),'FORWARD');await stop();pass('the same native AUTO continues through the vault after it is opened');
  await place(86,0,Math.PI/2);await phone.locator('[data-auto="1"]').tap();await until(async()=>await phone.locator('#fl-drive').innerText()==='EDGE · TURN','arena edge feedback');
  const edge=(await state(phone)).local;assert.equal(edge.x,89);
  const boundary=await phone.evaluate(()=>{const group=__movementProbe.boundary,box=new THREE.Box3().setFromObject(group);return{visible:!!group.parent&&group.visible,minX:box.min.x,maxX:box.max.x,minZ:box.min.z,maxZ:box.max.z};});
  assert.ok(boundary.visible&&boundary.minX<=-90&&boundary.maxX>=90&&boundary.minZ<=-90&&boundary.maxZ>=90);
  await phone.screenshot({path:path.join(OUT,'arena-edge.png')});pass('the actual arena limit has a visible perimeter and EDGE · TURN feedback',{edge,boundary});
  await phone.keyboard.down('KeyA');await pause(1150);await phone.keyboard.up('KeyA');await until(async()=>(await state(phone)).local.x<88.4,'steer away while AUTO remains on');
  assert.equal((await state(phone)).input.auto,1);assert.equal(await phone.locator('#fl-drive').innerText(),'FORWARD');await stop();await peerSees((await state(phone)).local);
  pass('LEFT steers away from the edge while AUTO stays enabled and normal driving resumes');
  await place(87,87,Math.PI/4);await phone.screenshot({path:path.join(OUT,'arena-corner.png')});
  const final=await state(phone);assert.equal(final.coins,s.coins);assert.equal(final.sessionCoins,s.sessionCoins);assert.equal(final.metrics.chunks,15);
  assert.equal(errors.length,0,errors.join('\n'));assert.ok(requests.every(u=>u.startsWith(BASE)||u.startsWith('data:')));
  pass('movement keeps the recycled chunk count and economy unchanged with no page errors or production requests',final.metrics);
  await writeFile(path.join(OUT,'results.json'),JSON.stringify({passed:true,checks,errors,namespace:roomPath},null,2));
}catch(error){console.error(error);process.exitCode=1;const debug=phone?await state(phone).catch(()=>null):null;
  if(phone)await phone.screenshot({path:path.join(OUT,'failure.png')}).catch(()=>{});
  await writeFile(path.join(OUT,'results.json'),JSON.stringify({passed:false,checks,errors,error:error.stack,debug},null,2));}
finally{await browser.close();}
