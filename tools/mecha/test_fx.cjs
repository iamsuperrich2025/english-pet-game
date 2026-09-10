'use strict';
const fs=require('fs'),path=require('path'),assert=require('assert/strict');
const deps=path.join(require('os').homedir(),'.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules');
const {chromium}=require(path.join(deps,'playwright')),sharp=require(path.join(deps,'sharp'));
const base=process.env.MECHA_PREVIEW_URL||'http://127.0.0.1:19459',out=process.env.MECHA_TEST_OUTPUT||path.resolve('work/mecha-1399');fs.mkdirSync(out,{recursive:true});
(async()=>{const browser=await chromium.launch({headless:true,channel:'chrome'});try{const page=await browser.newPage({viewport:{width:1600,height:1050}}),errors=[];page.on('pageerror',e=>errors.push(e.message));const sourceArg=process.argv.indexOf('--source');if(sourceArg>=0){const source=path.resolve(process.argv[sourceArg+1]);await page.route('**/js/**',r=>{const file=path.join(source,new URL(r.request().url()).pathname);return r.fulfill({contentType:'application/javascript',body:fs.readFileSync(file)});});}await page.goto(base+'/tools/mecha/fx-preview.html');await page.waitForFunction(()=>views.length===10);await page.evaluate(()=>{window.fixedTime=78;for(const v of views){v.fx.fire(v.id,v.from,v.to,0,true);v.fx.tick(78)}});await page.waitForTimeout(100);await sharp(await page.screenshot()).webp({quality:94}).toFile(path.join(out,'arsenal.webp'));
 const report=await page.evaluate(()=>{
  const checks=[],ok=(name,v)=>{if(!v)throw Error(name);checks.push(name);};
  for(const view of views){const s=view.fx.stats();ok(view.id+' live styled projectile',s.instances>3&&s.batches<=6);view.fx.tick(230);ok(view.id+' impact stars',view.fx.stats().instances>3);view.fx.tick(1000);ok(view.id+' idle zero draws',view.fx.stats().batches===0);}
  const scene=new THREE.Scene(),fx=MechaCombatFX.create(scene),from=new THREE.Vector3(0,0,0),to=new THREE.Vector3(0,0,60);
  for(let i=0;i<500;i++)fx.fire(MechaCombatFX.styles[i%10].id,from,to,i,true);fx.tick(510);let peak=fx.stats();ok('500-shot stress stays bounded',peak.active===12&&peak.peak===12&&peak.batches<=6&&peak.instances<=6*256);
  fx.tick(2000);ok('all effect instances expire',fx.stats().active===0&&fx.stats().instances===0);fx.dispose();fx.dispose();ok('exit cleanup and repeat disposal',scene.children.length===0&&fx.stats().disposed);ok('no fire after exit',fx.fire('robot_01',from,to,2100,true)===false);
  return {checks,peak};
 });assert.equal(errors.length,0,errors.join('\n'));fs.writeFileSync(path.join(out,'fx-report.json'),JSON.stringify(report,null,2));console.log(JSON.stringify({passed:report.checks.length,peak:report.peak}));}finally{await browser.close()}})().catch(e=>{console.error(e);process.exitCode=1});
