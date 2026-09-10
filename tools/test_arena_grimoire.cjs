'use strict';
const fs=require('fs'),path=require('path'),http=require('http'),vm=require('vm'),assert=require('assert/strict');
const repo=path.resolve(__dirname,'..'),root=path.resolve(process.env.VW_ARENA_SOURCE||repo),out=process.env.VW_ARENA_OUTPUT||path.join(repo,'work/arena-grimoire');
fs.mkdirSync(out,{recursive:true});
const deps=path.join(require('os').homedir(),'.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules'),{chromium}=require(path.join(deps,'playwright')),sharp=require(path.join(deps,'sharp'));
const checks=[],ok=(n,v)=>{assert.ok(v,n);checks.push(n);};
function recipes(){
 const c={console,performance,THREE:require(path.join(repo,'js/vendor/three.min.js'))};c.window=c;
 for(const f of ['js/arena-elements.js','js/arena-spell-catalog.js','js/arena-spell-engine.js'])vm.runInNewContext(fs.readFileSync(path.join(root,f),'utf8'),c,{filename:f});
 for(const f of Object.values(c.ArenaElements.packPaths))vm.runInNewContext(fs.readFileSync(path.join(root,f),'utf8'),c,{filename:f});
 c.ArenaElements.isReady=()=>true;const extra=c.ArenaElements.skills.filter(s=>s.pack);
 ok('50 new IDs plus 10 originals',extra.length===50&&c.ArenaElements.skills.length===60&&new Set(c.ArenaElements.skills.map(s=>s.id)).size===60);
 const patterns=new Set(),profiles=new Set();
 for(const def of extra){
  const targets=[];for(let x=-28;x<=28;x+=4)for(let z=-28;z<=28;z+=4)if(Math.hypot(x,z)<=29)targets.push({group:{position:new c.THREE.Vector3(x,0,z)},dead:false,hits:0});
  const outside={group:{position:new c.THREE.Vector3(70,0,70)},dead:false,hits:0};targets.push(outside);
  let damage=0,healed=0,visuals=0;const fx={motif:()=>{visuals++;return {move(){}};},ring(){visuals++;},beam(){visuals++;},burst(){visuals++;},element:()=>({move(){}}),mega(){}};
  const engine=c.ArenaElements.create({fx,enemies:()=>targets,hit:(b,n)=>{assert.ok(Number.isFinite(n)&&n>0);damage+=n;b.hits++;},heal:(h,s)=>{healed+=h+s;},storm:()=>false});
  ok(def.id+' casts',engine.cast(def.id,new c.THREE.Vector3(),new c.THREE.Vector3(0,0,-1),{group:{position:new c.THREE.Vector3(0,0,-8)}},1));
  for(let i=0;i<400;i++)engine.tick(.02);
  ok(def.id+' produces gameplay and visuals',damage+healed>0&&visuals>0);
  ok(def.id+' cleans up and excludes distant enemy',engine.stats().active===0&&outside.hits===0);
  const recipe=c.ArenaSpellPacks[def.pack][def.id];patterns.add(recipe.pattern);profiles.add(JSON.stringify(recipe));
  if(recipe.slow)ok(def.id+' slows targets',targets.some(b=>b.slow>performance.now()));
  if(recipe.heal||recipe.shield)ok(def.id+' applies stated recovery',healed===(recipe.heal||0)+(recipe.shield||0));
  if(recipe.pattern==='chain')ok(def.id+' limits chain targets',targets.filter(b=>b.hits).length<=recipe.jumps&&targets.every(b=>b.hits<=1));
 }
 ok('creative gameplay has 13 trajectories and 50 distinct recipes',patterns.size===13&&profiles.size===50);
 const fx={motif:()=>({move(){}}),ring(){},beam(){},burst(){},element:()=>({move(){}}),mega(){}},mixed=c.ArenaElements.create({fx,enemies:()=>[],hit(){},heal(){},storm:()=>false});
 for(const s of extra)mixed.cast(s.id,new c.THREE.Vector3(),new c.THREE.Vector3(0,0,-1),null,1);
 mixed.cast('fire',new c.THREE.Vector3(),new c.THREE.Vector3(0,0,-1),null,1);
 ok('new and old spells share the same 12-zone limit',mixed.stats().active<=12);mixed.clear();ok('clear removes every pending spell',mixed.stats().active===0);
}
const harness='<!doctype html><html><head><meta name="viewport" content="width=device-width,initial-scale=1"><link rel="stylesheet" href="/css/arena3d.css"></head><body><script>window.state=JSON.parse(localStorage.getItem("arenaCommerceTest")||"null")||{profileName:"admin",coins:16338327,arenaIntro:true,arenaHomeIntro:true,arenaItems:{},arenaHero:"fire",arenaMap:"crystal",sound:false,haptic:false};window.adminEntitled=true;window.isAdmin=()=>adminEntitled;window.saveState=()=>localStorage.setItem("arenaCommerceTest",JSON.stringify(state));window.addCoins=n=>state.coins+=n;window.vocabForStudent=()=>[["purple","สีม่วง"]];window.activePet=()=>null;window.toast=()=>{};</script>'+['vendor/three.min','arena-field-visuals','arena-elements','arena-spell-catalog','arena-strip','arena-grimoire','arena-relics','arena-heroes','arena-maps','arena3d'].map(n=>'<script src="/js/'+n+'.js"></script>').join('')+'</body></html>';
const server=http.createServer((req,res)=>{const u=new URL(req.url,'http://localhost');if(u.pathname==='/test'){res.setHeader('Content-Type','text/html;charset=utf-8');return res.end(harness);}const f=path.resolve(root,'.'+decodeURIComponent(u.pathname));if(!f.startsWith(root+path.sep)||!fs.existsSync(f)){res.statusCode=404;return res.end();}res.setHeader('Content-Type',f.endsWith('.js')?'text/javascript':f.endsWith('.css')?'text/css':f.endsWith('.svg')?'image/svg+xml':f.endsWith('.avif')?'image/avif':f.endsWith('.webp')?'image/webp':'application/octet-stream');fs.createReadStream(f).pipe(res);});
(async()=>{recipes();await new Promise(r=>server.listen(0,'127.0.0.1',r));const browser=await chromium.launch({channel:'msedge',headless:true}),page=await browser.newPage({viewport:{width:1366,height:768}}),errors=[],requests=[];page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error'&&/Shader Error|VALIDATE_STATUS|WebGLProgram/.test(m.text()))errors.push(m.text());});page.on('request',r=>requests.push(new URL(r.url()).pathname));
 try{
  await page.goto('http://127.0.0.1:'+server.address().port+'/test');await page.evaluate(async()=>{await ArenaMaps.prepare('crystal');adminEntitled=true;VocabArena3D.start();adminEntitled=false;VocabArena3D._t.refreshRelics();VocabArena3D._t.spellbook(true);});
  ok('fresh account starts with only shooting and Radiance',await page.evaluate(()=>VocabArena3D._t.slots[0]==='light'&&VocabArena3D._t.slots[1]===null));
  ok('both permanent shops price every item between 3000 and 5000',await page.evaluate(()=>ArenaElements.skills.every(d=>d.price>=3000&&d.price<=5000)&&ArenaRelics.items.length===50&&ArenaRelics.items.every(d=>d.price>=3000&&d.price<=5000)));
  ok('opening 60-spell library downloads no extra combat packs',requests.every(p=>!p.includes('/arena-spells/')&&!p.endsWith('arena-spell-engine.js')));
  for(const [w,h] of [[1366,768],[812,375],[667,320]]){await page.setViewportSize({width:w,height:h});await page.evaluate(()=>{VocabArena3D._t.spellbook(false);VocabArena3D._t.spellbook(true);});await page.waitForTimeout(100);
   ok('compact grimoire fits '+w+'x'+h,await page.evaluate(()=>{const p=document.querySelector('.va-spell-panel').getBoundingClientRect();return p.left>=0&&p.top>=0&&p.right<=innerWidth+1&&p.bottom<=innerHeight+1&&[...document.querySelectorAll('.va-grimoire-nav button,.va-grimoire-tools input,.va-spell-card')].every(e=>{const r=e.getBoundingClientRect();return r.bottom<=p.bottom&&e.scrollHeight<=e.clientHeight+2;});}));
   await sharp(await page.screenshot()).webp({quality:90}).toFile(path.join(out,'grimoire-'+w+'.webp'));
  }
  await page.selectOption('[aria-label="หมวดธาตุ"]','fire');ok('filter exposes original plus five new fire spells',await page.locator('[data-equip-spell]').count()===6);
  await page.fill('[aria-label="ค้นหาเวทมนตร์"]','Dragon Breath');ok('search finds the requested ability',await page.locator('[data-equip-spell]').count()===1);
  const initialCoins=await page.evaluate(()=>state.coins);await page.click('[data-equip-spell="dragon_breath"]');await page.waitForFunction(()=>VocabArena3D._t.slots[1]==='dragon_breath');
  ok('first spell purchase deducts its price once and saves ownership',await page.evaluate(n=>n-state.coins===ArenaElements.byId.dragon_breath.price&&state.arenaItems.spell_dragon_breath===true,initialCoins));
  ok('equip loads only selected fire pack and runner',requests.filter(p=>p.includes('/arena-spells/')).join(',')==='/js/arena-spells/fire.js'&&requests.includes('/js/arena-spell-engine.js'));
  const before=await page.evaluate(()=>state.coins);await page.evaluate(()=>{VocabArena3D._t.spellbook(false);const t=VocabArena3D._t;t.player().pos.set(0,0,0);t.bots.forEach((b,i)=>{b.hp=b.maxHp=300;b.group.position.set((i%3-1)*4,0,-5-Math.floor(i/3)*4);});t.cast('dragon_breath');});await page.waitForTimeout(500);
  ok('equipped extension casts with cooldown and real zones',await page.evaluate(()=>VocabArena3D._t.cooldowns.dragon_breath>performance.now()&&VocabArena3D._t.elementStats().active>0));
  await page.setViewportSize({width:1366,height:768});
  ok('casting an already purchased spell does not spend more coins',await page.evaluate(n=>state.coins===n,before));
  await page.evaluate(()=>VocabArena3D._t.spellbook(true));await page.selectOption('[aria-label="หมวดธาตุ"]','ice');await page.fill('[aria-label="ค้นหาเวทมนตร์"]','');await page.route('**/js/arena-spells/ice.js',r=>r.abort());await page.click('[data-equip-spell="frost_lotus"]');await page.waitForFunction(()=>document.querySelector('#va-spell-load').textContent.includes('ไม่สำเร็จ'));
  ok('load failure preserves equipped spell and offers retry',await page.evaluate(()=>VocabArena3D._t.slots[1]==='dragon_breath'));await page.unroute('**/js/arena-spells/ice.js');await page.click('[data-equip-spell="frost_lotus"]');await page.waitForFunction(()=>VocabArena3D._t.slots[1]==='frost_lotus');
  ok('failed pack can retry successfully',await page.evaluate(()=>ArenaElements.isReady('frost_lotus')));
  await page.route('**/js/arena-spells/water.js',async r=>{await new Promise(s=>setTimeout(s,200));await r.continue();});await page.evaluate(()=>{VocabArena3D._t.buySpell(0,'tidal_dragon');VocabArena3D.stop();});await page.waitForTimeout(350);
  ok('late pack response cannot change selection after exit',await page.evaluate(()=>state.arenaLoadout[1]==='frost_lotus'));
  await page.evaluate(async()=>{await ArenaMaps.prepare('sky');adminEntitled=true;VocabArena3D.start();adminEntitled=false;VocabArena3D._t.refreshRelics();VocabArena3D._t.spellbook(true);});
  const all=await page.evaluate(()=>ArenaElements.skills.filter(d=>d.pack).map(d=>d.id));for(const id of all){await page.evaluate(async id=>{const t=VocabArena3D._t;await t.buySpell(0,id);t.spellbook(false);t.cast(id);t.frame(30);t.spellbook(true);},id);}
  const costs=await page.evaluate(()=>VocabArena3D._t.stats());ok('all 50 render within fixed GPU pools',costs.fx.meshes<=48&&costs.fx.particles<=640);
  await page.evaluate(()=>{VocabArena3D._t.spellbook(false);});await page.click('#va-shop-open');
  for(const [w,h] of [[1366,768],[812,375],[667,320]]){await page.setViewportSize({width:w,height:h});await page.click('#va-shop-close');await page.click('#va-shop-open');await page.waitForTimeout(100);
    ok('50-item relic shop fits '+w+'x'+h,await page.evaluate(()=>{const p=document.querySelector('.va-relic-panel').getBoundingClientRect();return p.top>=0&&p.bottom<=innerHeight+1&&[...document.querySelectorAll('.va-relic-panel button')].every(e=>{const r=e.getBoundingClientRect();return r.bottom<=p.bottom+1&&e.scrollHeight<=e.clientHeight+2;});}));
    ok('relic text stays beside its icon '+w,await page.evaluate(()=>[...document.querySelectorAll('.va-store-item')].every(e=>{const icon=e.querySelector('.va-store-ico').getBoundingClientRect(),name=e.querySelector('.va-store-name').getBoundingClientRect();return name.left>=icon.right&&name.width>70&&name.right<=e.getBoundingClientRect().right;})));
    await sharp(await page.screenshot()).webp({quality:90}).toFile(path.join(out,'relics-'+w+'.webp'));
  }
  const pausedFrame=await page.evaluate(()=>VocabArena3D._t.stats().frames);await page.waitForTimeout(200);ok('open inventory stops redundant scene rendering',await page.evaluate(f=>VocabArena3D._t.stats().frames===f,pausedFrame));
  const money=await page.evaluate(()=>state.coins);await page.evaluate(()=>{state.coins=0;VocabArena3D._t.buy('prism');});
  ok('insufficient funds cannot buy a permanent relic',await page.evaluate(()=>!state.arenaItems.prism&&state.coins===0));await page.evaluate(n=>{state.coins=n;},money);
  const relicCost=await page.evaluate(()=>ArenaRelics.items.reduce((n,i)=>n+i.price,0));await page.evaluate(()=>{for(const i of ArenaRelics.items)VocabArena3D._t.buy(i.id);});
  ok('all 50 relics charge the displayed exact prices',await page.evaluate(x=>Object.keys(state.arenaItems).filter(k=>!k.startsWith('spell_')).length===50&&Math.abs(x.money-state.coins-x.cost)<.001,{money,cost:relicCost}));
  const afterBuy=await page.evaluate(()=>state.coins);await page.evaluate(()=>{VocabArena3D._t.buy('prism');});
  ok('owned relic cannot charge twice',await page.evaluate(n=>state.coins===n,afterBuy));
  const stats=await page.evaluate(()=>VocabArena3D._t.relics());ok('relic bonuses affect health shield cargo and casting',stats.maxHp===145&&stats.maxShield===60&&stats.cargoMax===9&&Math.abs(stats.cooldown-.24)<.001&&Math.abs(stats.speed-.23)<.001);
  await page.evaluate(()=>{window.compilations=0;const original=ArenaRelics.compile;ArenaRelics.compile=(...a)=>{compilations++;return original(...a);};});await page.click('#va-shop-close');await page.waitForTimeout(180);
  ok('passive bonuses are not recalculated per frame',await page.evaluate(()=>compilations===0));
  await page.evaluate(()=>{const t=VocabArena3D._t;t.player().pos.set(0,0,0);t.spellbook(true);});const healthBefore=await page.evaluate(()=>VocabArena3D._t.health());await page.evaluate(()=>VocabArena3D._t.damage(100));
  ok('armor reduces actual incoming damage including shield',await page.evaluate(b=>{const a=VocabArena3D._t.health();return Math.abs(b.hp+b.shield-a.hp-a.shield-82)<.01;},healthBefore));
  await page.evaluate(()=>{VocabArena3D._t.peer('test-ally',{n:'ally',av:'AH:fire',x:4,z:3,yaw:0,hp:'A2:120:0:-:145'});VocabArena3D._t.frame(0);});
  ok('peer overhead HP understands upgraded maximum',await page.locator('.va-vital.peer b').innerText()==='120 / 145');
  const earnedBefore=await page.evaluate(()=>({coins:state.coins,earned:VocabArena3D._t.sessionCoins}));await page.evaluate(()=>VocabArena3D._t.complete());
  ok('session earnings show real word reward separately from wallet',await page.evaluate(b=>{const t=VocabArena3D._t;return t.sessionCoins>b.earned&&t.sessionCoins-b.earned===state.coins-b.coins&&document.querySelector('#va-session-coins').textContent.includes(String(t.sessionCoins));},earnedBefore));
  const savedCoins=await page.evaluate(()=>state.coins);await page.evaluate(()=>{saveState();VocabArena3D.stop();});await page.reload();await page.evaluate(async()=>{await ArenaMaps.prepare(state.arenaMap);adminEntitled=true;VocabArena3D.start();adminEntitled=false;VocabArena3D._t.refreshRelics();});
  ok('purchased spells and relics survive serialized reload',await page.evaluate(n=>state.coins===n&&state.arenaItems.spell_dragon_breath&&state.arenaItems.prism&&VocabArena3D._t.relics().maxHp===145,savedCoins));
  ok('new play session starts earned coins at zero',await page.evaluate(()=>VocabArena3D._t.sessionCoins===0&&document.querySelector('#va-session-coins').textContent==='รอบนี้ +0'));
  const adminCoins=await page.evaluate(()=>state.coins);await page.evaluate(async()=>{state.arenaItems={};adminEntitled=true;VocabArena3D._t.refreshRelics();for(const i of ArenaRelics.items)VocabArena3D._t.buy(i.id);await VocabArena3D._t.buySpell(0,'solar_fall');});
  ok('admin can use every spell and relic free without creating paid ownership',await page.evaluate(n=>state.coins===n&&ArenaElements.skills.every(d=>ArenaElements.owned(d.id))&&VocabArena3D._t.relics().maxHp===145&&Object.keys(state.arenaItems).length===0,adminCoins));
  await page.evaluate(()=>VocabArena3D._t.spellbook(true));await page.selectOption('[aria-label="หมวดธาตุ"]','all');await page.fill('[aria-label="ค้นหาเวทมนตร์"]','');await page.waitForTimeout(100);await sharp(await page.screenshot()).webp({quality:90}).toFile(path.join(out,'admin-spells.webp'));
  await page.evaluate(()=>VocabArena3D._t.spellbook(false));await page.click('#va-shop-open');await page.waitForTimeout(100);await sharp(await page.screenshot()).webp({quality:90}).toFile(path.join(out,'admin-relics.webp'));
  await page.click('#va-shop-close');await page.setViewportSize({width:1366,height:768});await page.evaluate(()=>{const t=VocabArena3D._t;t.player().pos.set(0,0,0);t.bots.forEach((b,i)=>{b.hp=b.maxHp=300;b.group.position.set(Math.cos(i*1.2)*8,0,Math.sin(i*1.2)*8);});t.cast('fire');});await page.waitForTimeout(150);await sharp(await page.screenshot()).webp({quality:90}).toFile(path.join(out,'dragon-fire.webp'));
  await page.evaluate(()=>VocabArena3D.stop());ok('cleanup removes library and canvas',await page.locator('#va-root').count()===0);ok('no JavaScript or shader compile errors',errors.length===0);
  console.log(JSON.stringify({passed:checks.length,costs,errors,out}));
 }finally{await browser.close();server.close();}
})().catch(e=>{console.error(e);server.close();process.exitCode=1;});
