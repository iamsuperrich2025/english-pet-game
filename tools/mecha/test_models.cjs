'use strict';
// Actual NetRoom + Adventure3D in two same-origin browser windows, shared FakeDB.
// No production Firebase traffic. Run from any directory; --source tests a build.
const fs=require('fs'),path=require('path'),http=require('http'),assert=require('assert/strict');
const repo=path.resolve(__dirname,'../..'),arg=process.argv.indexOf('--source'),root=arg>=0?path.resolve(process.argv[arg+1]):repo;
const out=process.env.MECHA_TEST_OUTPUT||path.join(repo,'work/mecha-1399');fs.mkdirSync(out,{recursive:true});
const deps=path.join(require('os').homedir(),'.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules');
const {chromium}=require(path.join(deps,'playwright')),sharp=require(path.join(deps,'sharp'));
const checks=[],ok=(name,value)=>{assert.ok(value,name);checks.push(name);};
function validate(){
 for(let i=1;i<=10;i++){
  const id='robot_'+String(i).padStart(2,'0'),buf=fs.readFileSync(path.join(root,'img/models/mecha',id+'.glb'));
  ok(id+' binary header',buf.readUInt32LE(0)===0x46546c67&&buf.readUInt32LE(4)===2&&buf.readUInt32LE(8)===buf.length);
  const doc=JSON.parse(buf.subarray(20,20+buf.readUInt32LE(12)).toString()),bin=buf.subarray(28+buf.readUInt32LE(12));
  ok(id+' standard texture-free compact PBR',doc.asset.version==='2.0'&&!doc.images&&!doc.textures&&buf.length<230000&&doc.materials.length===2);
  ok(id+' articulated and animated',doc.nodes.slice(1).map(n=>n.name).join(',')==='Body,Leg_L,Leg_R,Arm_L,Arm_R'&&doc.animations.map(a=>a.name).join(',')==='Idle,Walk,Attack');
  for(const a of doc.accessors){
   const view=doc.bufferViews[a.bufferView],width={SCALAR:1,VEC3:3,VEC4:4}[a.type],bytes={5126:4,5123:2,5121:1,5122:2}[a.componentType];
   assert(view.byteOffset%4===0&&view.byteOffset+view.byteLength<=bin.length);assert(view.byteLength===a.count*(view.byteStride||width*bytes));
   if(a.min)assert(Array.isArray(a.min)&&a.min.length===width&&a.max.length===width);
   if(a.componentType===5126)for(let j=0;j<a.count*width;j++)assert(Number.isFinite(bin.readFloatLE(view.byteOffset+j*4)));
  }
  for(const m of doc.meshes)for(const p of m.primitives){const a=doc.accessors[p.indices],v=doc.bufferViews[a.bufferView],n=doc.accessors[p.attributes.POSITION].count;for(let j=0;j<a.count;j++)assert(bin.readUInt16LE(v.byteOffset+j*2)<n);}
  ok(id+' buffers and indices valid',true);ok(id+' <=10 draws',doc.meshes.reduce((n,m)=>n+m.primitives.length,0)<=10);
 }
}
const types={'.html':'text/html','.js':'application/javascript','.css':'text/css','.json':'application/json','.glb':'model/gltf-binary','.png':'image/png','.webp':'image/webp','.svg':'image/svg+xml'};
const server=http.createServer((req,res)=>{let rel=decodeURIComponent(new URL(req.url,'http://localhost').pathname);const base=rel.startsWith('/tools/')?repo:root;const file=path.resolve(base,'.'+rel);if(!file.startsWith(base+path.sep)){res.writeHead(403).end();return;}fs.readFile(file,(e,b)=>{if(e){res.writeHead(404).end();return;}res.setHeader('Content-Type',types[path.extname(file)]||'application/octet-stream');res.end(b);});});
let browser;
async function init(page,uid,robot,shared){
 await page.waitForFunction(()=>typeof loadAdv3d==='function');
 await page.evaluate(async({uid,robot,shared})=>{
  state.mechaTicket=true;state.mechaRobot=robot;state.robots=[robot];state.musicOff=true;state.soundOff=true;state.voiceSpk=false;
  window.onlineStart=()=>{};window.authWriteCloud=()=>Promise.resolve();window.authFetchCloud=()=>Promise.resolve(null);window.authWriteProfileName=()=>Promise.resolve();
  await loadScriptOnce('js/vendor/three.min.js');await loadAdv3d();
  await new Promise((resolve,reject)=>{const s=document.createElement('script');s.src='/tools/fakedb.js';s.onload=resolve;s.onerror=reject;document.head.appendChild(s);});
  await FakeDB.install();const sharedDB=shared?window.opener.FakeDB.db:FakeDB.db;
  const owned=[];
  function wrap(ref){return new Proxy(ref,{get(target,key){
    if(key==='on')return (evt,cb)=>{owned.push({ref:target,evt,cb});return target.on(evt,cb);};
    if(key==='off')return (evt,cb)=>{for(const entry of owned)if((!evt||evt===entry.evt)&&(!cb||cb===entry.cb))target.off(entry.evt,entry.cb);};
    if(['child','orderByKey','limitToFirst','limitToLast'].includes(key))return (...args)=>wrap(target[key](...args));
    const value=target[key];return typeof value==='function'?value.bind(target):value;
  }});}
  Online.db={ref:p=>wrap(sharedDB.ref(p))};
  Auth.user={uid};window.onlineKey=()=>uid;window.onlineDisplayName=()=>uid;NetRoom.CFG.VERIFY_MS=1;
  Adventure3D._t.Voice.join=()=>{};Adventure3D._t.Voice.onPeer=()=>{};
  Adventure3D.start('mecha');Adventure3D._t.running=false;
  for(const e of document.querySelectorAll('#adv-intro,#screen-login,#rotate-overlay,#consent-gate,#night-veil,#vw-landscape-gate'))e.style.display='none';
 },{uid,robot,shared});
}
async function snapshot(page){return page.evaluate(()=>({selected:Adventure3D._t.mechaModels.selected,peers:Object.fromEntries(Object.entries(Adventure3D._t.peers).map(([id,p])=>[id,{av:p.av,robot:p.spr.userData.robotId,status:p.spr.userData.mechaModelStatus,limbs:p.spr.userData.limbs.length}]))}));}
async function run(){
 validate();await new Promise(r=>server.listen(0,'127.0.0.1',r));const url='http://127.0.0.1:'+server.address().port;
 browser=await chromium.launch({headless:true,channel:'chrome'});const context=await browser.newContext({viewport:{width:1366,height:768}}),errors=[];
 await context.route('**/*',r=>new URL(r.request().url()).hostname==='127.0.0.1'?r.continue():r.abort());
 context.on('page',p=>p.on('pageerror',e=>errors.push(e.message)));
 const a=await context.newPage();await a.goto(url+'/index_classic.html');await init(a,'mecha-A','robot_03',false);
 const popup=context.waitForEvent('page');await a.evaluate(url=>window.open(url,'mecha-second-client'),url+'/index_classic.html');const b=await popup;await b.waitForLoadState();await init(b,'mecha-B','robot_08',true);
 await a.waitForFunction(()=>Adventure3D._t.peers['mecha-B']?.spr.userData.mechaModelStatus==='ready');await b.waitForFunction(()=>Adventure3D._t.peers['mecha-A']?.spr.userData.mechaModelStatus==='ready');
 let sa=await snapshot(a),sb=await snapshot(b);ok('two real NetRoom clients see each selected GLB',sa.peers['mecha-B'].robot==='robot_08'&&sb.peers['mecha-A'].robot==='robot_03');
 ok('wire avatar format remains m_NN',sa.peers['mecha-B'].av==='m_08'&&sb.peers['mecha-A'].av==='m_03');
 const firing=await a.evaluate(()=>{const t=Adventure3D._t,c=t.camera(),rotation=c.quaternion.clone(),coins=state.coins,now=performance.now();c.lookAt(c.position.x,c.position.y+100,c.position.z);t.mechaModels.fire(now);const stats=t.mechaModels.effects.stats();c.quaternion.copy(rotation);t.mechaModels.effects.tick(now+1000);return {stats,sameCoins:state.coins===coins,empty:t.mechaModels.effects.stats().active===0};});
 ok('real fire uses selected projectile with unchanged miss reward',firing.stats.styles[0]==='robot_03'&&firing.sameCoins&&firing.empty);

 for(let i=1;i<=10;i++){
  const id='robot_'+String(i).padStart(2,'0');
  // Simulates the already-supported cold avatar change through the real room.
  await b.evaluate(id=>Adventure3D._t.room.send({n:'mecha-B',av:MechaModels.avatar(id),x:4,z:26,yaw:Math.PI,m:0,w:0},true),id);
  await a.waitForFunction(id=>Adventure3D._t.peers['mecha-B']?.spr.userData.robotId===id&&Adventure3D._t.peers['mecha-B']?.spr.userData.mechaModelStatus==='ready',id);
  ok(id+' remote change traverses NetRoom to GLB',true);
 }
 const gait=await a.evaluate(()=>{const t=Adventure3D._t,p=t.peers['mecha-B'];t.onPeerData('mecha-B',{av:'m_10',x:p.cur.x+8,z:p.cur.z,yaw:1,n:'mecha-B'});t.peersTick(.1);return p.spr.userData.limbs.map(l=>l.rotation.x);});ok('distance-driven independent limb walking',Math.abs(gait[0])>.001&&gait[0]===-gait[1]&&gait[2]===-gait[3]);
 const clone=await a.evaluate(async()=>{const x=Adventure3D._t.mechaModels.makePeer('x','m_01','x',''),y=Adventure3D._t.mechaModels.makePeer('y','m_01','y','');await MechaModels.prepare('robot_01');await new Promise(r=>setTimeout(r,0));let xm,ym;x.traverse(o=>{if(o.isMesh)xm=o});y.traverse(o=>{if(o.isMesh)ym=o});const same=xm.geometry===ym.geometry&&xm.material===ym.material;const independent=x.userData.limbs[0]!==y.userData.limbs[0];Adventure3D._t.mechaModels.dispose(x);const still=y.userData.limbs[0].parent!==null;Adventure3D._t.mechaModels.dispose(y);return {same,independent,still};});ok('peers share GPU resources but not pivots',clone.same&&clone.independent&&clone.still);
 const selection=await a.evaluate(()=>[MechaModels.resolveSelection('bad',['unknown','robot_07']),MechaModels.resolveSelection(null,[]),MechaModels.fromAvatar('m_99'),MechaModels.fromAvatar('../../evil')]);ok('invalid and rental IDs resolve safely',selection.join(',')==='robot_07,robot_01,robot_01,robot_01');
 // Actual local entry must announce the same fallback robot as its weapon/HUD.
 await b.evaluate(()=>{Adventure3D._t.exitWorld();state.mechaRobot='bad';state.robots=['robot_07'];state.mechaTicket=true;Adventure3D.start('mecha');Adventure3D._t.running=false;});
 await a.waitForFunction(()=>Adventure3D._t.peers['mecha-B']?.spr.userData.robotId==='robot_07'&&Adventure3D._t.peers['mecha-B']?.spr.userData.mechaModelStatus==='ready');ok('entry fallback agrees with announced robot',await b.evaluate(()=>Adventure3D._t.mechaModels.selected==='robot_07'));
 await b.evaluate(()=>Adventure3D._t.exitWorld());await a.waitForFunction(()=>!Adventure3D._t.peers['mecha-B']);ok('leaving removes the peer',true);
 // Failure, retry, and stale-loader cancellation in a fresh module context.
 const c=await context.newPage();await c.goto(url+'/index_classic.html');await c.evaluate(async()=>{await loadScriptOnce('js/vendor/three.min.js');await loadScriptOnce('js/vendor/GLTFLoader.js');await loadScriptOnce('js/mecha-models.js');});await c.route('**/img/models/mecha/robot_10.glb',r=>r.abort());
 const failure=await c.evaluate(async()=>{window.host=new THREE.Group();window.fallback=new THREE.Group();host.add(fallback);return await MechaModels.attach(host,'robot_10',fallback)===false&&host.children.includes(fallback)&&host.userData.mechaModelStatus==='fallback';});ok('failed download keeps visible fallback',failure);
 await c.unroute('**/img/models/mecha/robot_10.glb');ok('failed downloads can retry',await c.evaluate(async()=>await MechaModels.attach(host,'robot_10',fallback)&&host.userData.mechaModelStatus==='ready'));
 await c.route('**/img/models/mecha/robot_04.glb',async r=>{await new Promise(resolve=>setTimeout(resolve,250));await r.continue();});
 ok('late load cannot resurrect a removed peer',await c.evaluate(async()=>{const host=new THREE.Group(),fallback=new THREE.Group();host.add(fallback);const p=MechaModels.attach(host,'robot_04',fallback);host.userData.mechaDisposed=true;await p;return host.children.length===1&&host.children[0]===fallback;}));
 // Gameplay captures on desktop and two mobile landscape sizes.
 await a.evaluate(()=>{const t=Adventure3D._t;t.onPeerData('visual',{n:'Chibi Mecha',av:'m_05',x:0,z:26,yaw:Math.PI});});await a.waitForFunction(()=>Adventure3D._t.peers.visual?.spr.userData.mechaModelStatus==='ready');
 await a.evaluate(()=>{const t=Adventure3D._t,g=t.peers.visual.spr,scene=g.parent,obstacles=[];scene.traverse(o=>{if(o.isMesh&&!g.getObjectById(o.id)){const b=new THREE.Box3().setFromObject(o),size=b.getSize(new THREE.Vector3());if(b.max.y>.2&&size.x<30&&size.z<30)obstacles.push(b);}});let spot;for(let x=-45;x<=45&&!spot;x+=5)for(let z=-45;z<=45&&!spot;z+=5){const box=new THREE.Box3(new THREE.Vector3(x-3,.15,z-3),new THREE.Vector3(x+3,6,z+10));if(!obstacles.some(b=>b.intersectsBox(box)))spot={x,z};}spot=spot||{x:0,z:26};g.position.set(spot.x,0,spot.z);t.camera().position.set(spot.x+4,6.3,spot.z+9);t.camera().lookAt(spot.x,2.5,spot.z);document.querySelector('#adv-banner').style.display='none';});
 for(const [w,h]of [[1366,768],[812,375],[667,320]]){await a.setViewportSize({width:w,height:h});await a.waitForTimeout(100);await a.evaluate(()=>Adventure3D._t.renderNow());await sharp(await a.screenshot()).webp({quality:92}).toFile(path.join(out,'game-'+w+'.webp'));const sizes=await a.evaluate(()=>{const r=document.querySelector('#adv-overlay').getBoundingClientRect();return [r.width,r.height,innerWidth,innerHeight];});ok('game viewport '+w+'x'+h,sizes[0]===w&&sizes[1]===h);}
 await a.evaluate(()=>Adventure3D._t.exitWorld());await c.close();ok('no unexpected browser exceptions',errors.length===0);
 fs.writeFileSync(path.join(out,'report.json'),JSON.stringify({source:root,checks:checks.length,passed:checks,errors},null,2));console.log(JSON.stringify({passed:checks.length,output:out}));
}
run().catch(e=>{console.error(e);process.exitCode=1;}).finally(async()=>{if(browser)await browser.close();server.close();});

