import fs from 'node:fs/promises';import path from 'node:path';import http from 'node:http';import assert from 'node:assert/strict';import {createRequire} from 'node:module';
const require=createRequire(import.meta.url),{chromium}=require('C:/Users/rober/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const root=path.resolve(process.env.KART_ROOT||process.cwd()),out=path.resolve(process.env.KART_OUTPUT||'work/kart-qa');await fs.mkdir(out,{recursive:true});
const base=await fs.readFile('tools/kart/browser.mjs','utf8'),html=base.match(/const html=`([\s\S]*?)`;\s*const server=/)[1];
const server=http.createServer(async(req,res)=>{try{const url=new URL(req.url,'http://local');if(url.pathname==='/__walls'){res.setHeader('content-type','text/html; charset=utf-8');res.end(html);return;}const f=path.resolve(root,'.'+url.pathname);if(!f.startsWith(root+path.sep))throw Error();res.setHeader('content-type',f.endsWith('.js')?'text/javascript':'application/octet-stream');res.end(await fs.readFile(f));}catch{res.statusCode=404;res.end();}});await new Promise(r=>server.listen(17481,'127.0.0.1',r));
const browser=await chromium.launch({channel:'chrome',headless:true,args:['--enable-unsafe-swiftshader']}),page=await browser.newPage();
try{await page.goto('http://127.0.0.1:17481/__walls');await page.evaluate(()=>KartWorld.start());
 const report=await page.evaluate(()=>{
  const L=KartWorld._t.line,P=KartProfile,walls=P.boundaryWalls||[];const old=!walls.length;
  if(old)for(let i=0;i<L.n;i+=2)for(const side of [-1,1]){const x=L.x[i]+L.nx[i]*side*17.4,z=L.z[i]+L.nz[i]*side*17.4;walls.push({x:x-L.tx[i]*2.55,z:z-L.tz[i]*2.55,dx:L.tx[i]*5.1,dz:L.tz[i]*5.1,side,nx:L.nx[i]*side,nz:L.nz[i]*side});}
  let tests=0;const failures=[];const distance=(x,z,w)=>{const t=Math.max(0,Math.min(1,((x-w.x)*w.dx+(z-w.z)*w.dz)/(w.dx*w.dx+w.dz*w.dz)));return Math.hypot(x-w.x-t*w.dx,z-w.z-t*w.dz);};
  for(let n=0;n<walls.length;n++){const w=walls[n],len=Math.hypot(w.dx,w.dz),nx=w.nx??w.dz/len,nz=w.nz??-w.dx/len;
   for(const f of (old?[.5]:[.15,.5,.85]))for(const side of (old?[-1]:[-1,1])){
    const x=w.x+w.dx*f,z=w.z+w.dz*f,ax=x+nx*4*side,az=z+nz*4*side,bx=x-nx*5*side,bz=z-nz*5*side;
    if(!old&&walls.some(v=>distance(ax,az,v)<2.851))continue;
    const v=110/3.6,hit=P.collideBoundary(ax,az,bx,bz,-nx*side*v,-nz*side*v);tests++;
    if(!hit||(hit.x-x)*nx*side+(hit.z-z)*nz*side<2.79)failures.push({wall:n,f,side,x,z,hit});
   }
  }
  let oblique=0;
  if(!old)for(let n=0;n<walls.length;n++){
    const w=walls[n],len=Math.hypot(w.dx,w.dz),nx=w.dz/len,nz=-w.dx/len,tx=w.dx/len,tz=w.dz/len,x=w.x+w.dx*.5,z=w.z+w.dz*.5;
    if(len<1)continue;
    for(const side of [-1,1])for(const angle of [-1,1]){
      const ax=x+nx*10*side-tx*4*angle,az=z+nz*10*side-tz*4*angle,bx=x-nx*10*side+tx*4*angle,bz=z-nz*10*side+tz*4*angle;
      if(walls.some(v=>distance(ax,az,v)<2.851))continue;
      const d=Math.hypot(bx-ax,bz-az),vx=(bx-ax)/d*34,vz=(bz-az)/d*34,hit=P.collideBoundary(ax,az,bx,bz,vx,vz);tests++;oblique++;
      if(!hit||(hit.x-x)*nx*side+(hit.z-z)*nz*side<0||distance(hit.x,hit.z,w)<2.79||Math.hypot(hit.vx,hit.vz)>34.001)failures.push({wall:n,angle,side,x,z,hit});
    }
  }
  // Measure the physical model, excluding the engine contact-shadow / glow effects.
  const car=P.buildCar(0xff0000);car.updateWorldMatrix(true,true);const inverse=new THREE.Matrix4().copy(car.matrixWorld).invert(),v=new THREE.Vector3();let carRadius=0;
  car.traverse(o=>{const p=o.geometry?.attributes?.position;if(!p)return;for(let i=0;i<p.count;i++){v.fromBufferAttribute(p,i).applyMatrix4(o.matrixWorld).applyMatrix4(inverse);carRadius=Math.max(carRadius,Math.hypot(v.x,v.z));}});
  return {old,walls:walls.length,tests,oblique,failures,carRadius,collisionRadius:P.wallRadius};
 });console.log(JSON.stringify({...report,failures:report.failures.slice(0,5)}));await fs.writeFile(path.join(out,report.old?'kart-wall-bugs-before1379.json':'kart-walls-1379.json'),JSON.stringify(report,null,2));
 if(!report.old){assert(report.tests>2000);assert(report.carRadius+.55<=report.collisionRadius,'The whole rendered car fits inside the wall collision margin');assert.equal(report.failures.length,0,'Every rendered wall must stop the swept car from both sides');}
}finally{await browser.close();server.close();}
