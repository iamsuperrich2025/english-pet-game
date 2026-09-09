import {createRequire} from 'node:module';import fs from 'node:fs/promises';import path from 'node:path';import http from 'node:http';import assert from 'node:assert/strict';
const require=createRequire(import.meta.url),deps='C:/Users/rober/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/';
const {chromium}=require(deps+'playwright'),sharp=require(deps+'sharp');
const source=process.cwd(),root=path.resolve(process.env.KART_ROOT||source),out=path.resolve(process.env.KART_OUTPUT||'work/kart-qa');await fs.mkdir(out,{recursive:true});
const browserTest=await fs.readFile(path.join(source,'tools/kart/browser.mjs'),'utf8');
let html=browserTest.match(/const html=`([\s\S]*?)`;\s*const server=/)[1];
html=html.replace('<script>','<link rel="stylesheet" href="/css/style.css"><script>');
const util=await fs.readFile(path.join(root,'js/util.js'),'utf8'),restack=util.slice(util.indexOf('function restackToasts(){'),util.indexOf('/* 🧹 รอบ 941:'));
html+='<script>'+restack+'</script>';
const before=process.env.KART_BEFORE;
const server=http.createServer(async(req,res)=>{try{const url=new URL(req.url,'http://localhost');if(url.pathname==='/__clearance'){res.setHeader('content-type','text/html; charset=utf-8');res.end(html);return;}const file=before&&url.pathname==='/js/kart3d.js'?before:path.resolve(root,'.'+url.pathname);if(!file.startsWith(root+path.sep)&&file!==before)throw Error('scope');const data=await fs.readFile(file);res.setHeader('content-type',file.endsWith('.js')?'text/javascript':file.endsWith('.css')?'text/css':'application/octet-stream');res.end(data);}catch{res.statusCode=404;res.end();}});
await new Promise(r=>server.listen(17480,'127.0.0.1',r));
const browser=await chromium.launch({channel:'chrome',headless:true,args:['--enable-unsafe-swiftshader']}),page=await browser.newPage({viewport:{width:1318,height:615},hasTouch:true,isMobile:true});const errors=[];page.on('pageerror',e=>errors.push(e.message));
try{
 await page.goto('http://127.0.0.1:17480/__clearance');
 await page.evaluate(()=>{for(const c of ['toast-warn','toast-warn','toast-financial']){const t=document.createElement('div');t.className='toast '+c;t.textContent=c;document.body.appendChild(t);}restackToasts();KartWorld.start();});
 if(process.env.KART_ICON_OUTPUT){
  const data=await page.locator('.kart-preview').evaluate(cv=>cv.toDataURL('image/png'));
  const raw=await sharp(Buffer.from(data.split(',')[1],'base64')).trim({background:'#00000000',threshold:1}).resize(96,96,{fit:'contain',background:'#00000000'}).ensureAlpha().raw().toBuffer({resolveWithObject:true});
  for(let i=0;i<raw.data.length;i+=4)if(raw.data[i+3]===0)raw.data.fill(0,i,i+3);
  const encoded=await sharp(raw.data,{raw:{width:96,height:96,channels:4}}).webp({lossless:true,effort:6}).toBuffer();
  const alternate=await sharp(raw.data,{raw:{width:96,height:96,channels:4}}).avif({lossless:true,chromaSubsampling:'4:4:4',effort:7}).toBuffer();
  const decoded=await sharp(encoded).ensureAlpha().raw().toBuffer();for(let i=0;i<decoded.length;i+=4)if(decoded[i+3]===0)decoded.fill(0,i,i+3);assert(decoded.equals(raw.data),'Visible RGB and every alpha value must remain exact');
  await fs.writeFile(process.env.KART_ICON_OUTPUT,encoded);console.log('icon',JSON.stringify({webp:encoded.length,avif:alternate.length,width:96,height:96,alpha:true,pixelsExact:true}));
 }
 await page.evaluate(()=>{document.querySelector('#kart-garage-confirm').click();document.querySelector('#kart-go').click();});
 const result=await page.evaluate(()=>{
  const t=KartWorld._t,L=t.line,meshes=t.scene.children.filter(m=>m.isMesh&&m.material.vertexColors),ray=new THREE.Raycaster(),origin=new THREE.Vector3(),direction=new THREE.Vector3();t.scene.updateMatrixWorld(true);
  let sampled=0;const hits=[];
  for(let i=0;i<L.n;i++){const j=(i+1)%L.n;for(const lat of [-6,0,6]){
   origin.set(L.x[i]+L.nx[i]*lat,1.5,L.z[i]+L.nz[i]*lat);direction.set(L.x[j]+L.nx[j]*lat-origin.x,0,L.z[j]+L.nz[j]*lat-origin.z);const length=direction.length();if(length<1e-6)continue;direction.normalize();ray.set(origin,direction);ray.near=0;ray.far=length;
   const found=ray.intersectObjects(meshes,false);sampled++;if(found.length)hits.push({i,lat,x:found[0].point.x,z:found[0].point.z});
  }}
  // Independent dense point-vs-OBB check of every declared complete scenery footprint.
  const footprints=t.scene.userData.kartSceneryBounds||[];let footprintHits=0;
  for(const b of footprints){const c=Math.cos(b.yaw),s=Math.sin(b.yaw);for(let i=0;i<L.n;i++){const j=(i+1)%L.n;for(const f of [0,.25,.5,.75]){const dx=L.x[i]+(L.x[j]-L.x[i])*f-b.x,dz=L.z[i]+(L.z[j]-L.z[i])*f-b.z;const x=c*dx-s*dz,z=s*dx+c*dz;const gap=Math.hypot(Math.max(0,Math.abs(x)-b.w/2),Math.max(0,Math.abs(z)-b.d/2));if(gap<17.49)footprintHits++;}}}
  return {sampled,hits,footprintHits,scenery:footprints.length,landmark:footprints.filter(b=>b.kind==='lighthouse-island').length,closeAll:getComputedStyle(document.querySelector('#toast-clear-all')).display};
 });
 console.log(JSON.stringify({...result,hits:result.hits.slice(0,10)}));
 if(before){await fs.writeFile(path.join(out,'kart-clearance-before.json'),JSON.stringify(result,null,2));}
 else{
  assert.equal(result.hits.length,0,'No physical scenery intersects the entire main driving corridor at car height');assert.equal(result.footprintHits,0,'Full scenery footprints clear main road and runoff');assert(result.scenery>20);assert.equal(result.landmark,1);assert.equal(result.closeAll,'none');
  for(const [width,height]of [[1318,615],[812,375]]){await page.setViewportSize({width,height});assert.equal(await page.locator('#toast-clear-all').evaluate(e=>getComputedStyle(e).display),'none');}
  const collision=await page.evaluate(()=>{
    const t=KartWorld._t,L=t.line;let hits=0;const sides=new Set();
    for(let i=0;i<L.n;i+=9)for(const side of [-1,1]){
      const nx=L.nx[i]*side,nz=L.nz[i]*side,x=L.x[i],z=L.z[i],v=110/3.6;
      const hit=KartProfile.collideBoundary(x,z,x+nx*45,z+nz*45,nx*v,nz*v);
      if(!hit)continue;
      if(!Number.isFinite(hit.x+hit.z+hit.vx+hit.vz))throw Error('Non-finite collision');
      if(Math.hypot(hit.vx,hit.vz)>v+.001)throw Error('Collision added energy');
      if(KartProfile.collideBoundary(hit.x,hit.z,hit.x,hit.z,hit.vx,hit.vz))throw Error('Collision left car outside boundary '+JSON.stringify({i,side,hit,again:KartProfile.collideBoundary(hit.x,hit.z,hit.x,hit.z,hit.vx,hit.vz)}));
      hits++;sides.add(side);
    }
    // A representative straight: real physics must bounce instead of starting a portal.
    const i=(t.sfIdx+40)%L.n,nx=L.nx[i],nz=L.nz[i];t.setHold(.7);t.step(.05,180);
    t.pos={x:L.x[i]+nx*14.8,z:L.z[i]+nz*14.8,yaw:Math.atan2(nx,nz),spd:110/3.6};t.input={thr:1,steer:0,br:false};t.physTick(.05);
    const p=t.pos,bounced=p.vx*nx+p.vz*nz<0;
    t.pos={x:L.x[i]+nx*50,z:L.z[i]+nz*50,spd:0};t.physTick(.016);
    return {hits,sides:[...sides],bounced,portal:t.portal.active};
  });
  assert(collision.hits>100);assert.equal(collision.sides.length,2);assert(collision.bounced,'Real Kart physics reflects outward velocity');assert.equal(collision.portal,false,'Kart never opens off-track portal');console.log('boundary',collision);
  // Inspect the former obstruction region and keep a real gameplay image.
  await page.evaluate(()=>{const t=KartWorld._t,L=t.line,i=83;t.pos={x:L.x[i],z:L.z[i],yaw:Math.atan2(L.tx[i],L.tz[i]),spd:0};t.setCamMode('cockpit');});await page.waitForTimeout(250);
  await sharp(await page.screenshot()).webp({lossless:true}).toFile(path.join(out,'kart-clear-road-1378.webp'));
  await page.evaluate(()=>KartWorld._t.exitWorld());assert.notEqual(await page.locator('#toast-clear-all').evaluate(e=>getComputedStyle(e).display),'none');assert.equal(await page.locator('.toast-warn').count(),2);assert.equal(await page.locator('.toast-financial').count(),1);
  await page.evaluate(()=>{KartWorld.start();restackToasts();});assert.equal(await page.locator('#toast-clear-all').evaluate(e=>getComputedStyle(e).display),'none');assert.equal(await page.locator('#toast-clear-all').count(),1);assert.deepEqual(errors,[]);
  await page.evaluate(()=>{F1World.start();document.querySelector('#f1-garage-confirm').click();document.querySelector('#f1-go').click();const t=F1World._t,L=t.line,i=(t.sfIdx+40)%L.n;t.setHold(.7);t.step(.05,180);t.pos={x:L.x[i]+L.nx[i]*50,z:L.z[i]+L.nz[i]*50,spd:5};t.physTick(.016);});
  assert.equal(await page.evaluate(()=>F1World._t.portal.active),true,'Racing keeps original portal');
  await fs.writeFile(path.join(out,'kart-clearance-1378.json'),JSON.stringify({...result,collision,errors,notificationChecks:7},null,2));console.log('PASS complete course clearance and notification lifecycle');
 }
}finally{await browser.close();server.close();}
