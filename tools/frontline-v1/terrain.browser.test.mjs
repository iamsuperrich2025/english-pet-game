import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import path from 'node:path';
const require=createRequire(import.meta.url),{chromium}=require(process.env.FRONTLINE_PLAYWRIGHT||'playwright');
const root=path.resolve('C:/Users/rober/english-pet-game');
const browser=await chromium.launch({channel:'chrome',headless:true,args:['--enable-unsafe-swiftshader']});
try{
  const page=await browser.newPage({viewport:{width:1370,height:615}});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.setContent('<!doctype html><html><body style="margin:0"><div id="battle" style="width:1370px;height:615px"><canvas id="fl-canvas" style="width:100%;height:100%;display:block"></canvas><div id="fl-labels"></div></div></body></html>');
  for(const file of [
    'js/vendor/three.min.js','js/vendor/GLTFLoader.js',
    'tools/frontline-v1/frontline-config.js','tools/frontline-v1/frontline-particles.js','tools/frontline-v1/frontline-effects.js',
    'tools/frontline-v1/frontline-health.js','tools/frontline-v1/frontline-lighting.js','tools/frontline-v1/frontline-meadow.js',
    'tools/frontline-v1/frontline-garden.js','tools/frontline-v1/frontline-flora.js','tools/frontline-v1/frontline-boundary.js',
    'tools/frontline-v1/frontline-bases.js','tools/frontline-v1/frontline-shapes.js','tools/frontline-v1/frontline-map.js',
    'tools/frontline-v1/frontline-scene.js'
  ])await page.addScriptTag({path:path.join(root,file)});
  const result=await page.evaluate(async()=>{
    const follows=[];
    const make=Frontline.makeMeadow;
    Frontline.makeMeadow=function(){const m=make();const follow=m.follow.bind(m);m.follow=(x,z)=>{follows.push([x,z]);follow(x,z);};return m;};
    const canvas=document.getElementById('fl-canvas'),labels=document.getElementById('fl-labels');
    const scene=Frontline.makeScene(canvas,labels);
    const local={id:'s0',slot:0,x:0,z:5,hull:0,turret:0,hp:5000,bumpSeq:0};
    const room={players:{s0:local},letters:{},bases:{},bombs:{},guards:{},events:{}};
    const samples=[];
    for(let i=0;i<80;i++){
      local.z-=.35;
      scene.render(room,local,'s0',1/60,1000+i*16);
      const at=follows.at(-1);
      samples.push({lookZ:local.z-3,meadowZ:at[1],dx:Math.abs(at[0]-local.x),dz:Math.abs(at[1]-(local.z-3)),chunks:scene.metrics().chunkCenter});
    }
    const metrics=scene.metrics();
    scene.dispose();
    return {metrics,samples,maxError:Math.max(...samples.map(s=>Math.max(s.dx,s.dz))),centers:new Set(samples.map(s=>s.chunks.x+','+s.chunks.z)).size};
  });
  assert.equal(errors.length,0,errors.join('\n'));
  assert.equal(result.metrics.chunks,15);
  assert.ok(result.maxError<1e-9,JSON.stringify(result.maxError));
  assert.ok(result.centers>=2,'prop chunks still stream');
  assert.ok(result.metrics.calls<350,JSON.stringify(result.metrics));
  console.log(JSON.stringify({ok:true,calls:result.metrics.calls,triangles:result.metrics.triangles,centers:result.centers,maxError:result.maxError}));
}finally{await browser.close();}
