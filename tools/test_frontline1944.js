"use strict";
const fs=require('fs'),vm=require('vm'),assert=require('assert');
const code=fs.readFileSync('js/frontline1944.js','utf8');
const css=fs.readFileSync('css/frontline1944.css','utf8');
const html=fs.readFileSync('index_classic.html','utf8');
const f1=fs.readFileSync('js/data/f1_vocab.js','utf8');

// Access / shared-system regression guards.
assert(html.includes('id="btn-rail-frontline1944"')&&html.includes('hidden')&&html.includes('ADMIN PREVIEW'),'Frontline lobby entry stays hidden-by-default admin preview');
assert(html.includes("link.href='css/frontline1944.css'")&&html.includes("s.src='js/frontline1944.js'")&&html.includes("if(!allowed())return false"),'Frontline assets remain admin-gated and lazy-fetched only after approved access');
assert(!html.includes('<link rel="stylesheet" href="css/frontline1944.css"')&&!html.includes('<script src="js/frontline1944.js"'),'public lobby still does not statically fetch Frontline-only assets');
assert(code.includes("typeof isAdmin==='function'&&isAdmin()===true")&&code.includes('return false; // fail closed'),'Frontline runtime continues to use authoritative admin interfaces and fail closed');
assert(!/email\s*[=!]=|@gmail|ADMIN_EMAIL/i.test(code),'Frontline does not create a parallel email allowlist');
const routeCapture=html.indexOf('window.__VW_FRONTLINE1944_ROUTE__=true'),legacyMain=html.indexOf('<script src="js/main.js');
assert(routeCapture>=0&&legacyMain>=0&&routeCapture<legacyMain,'Frontline direct route is captured before legacy main.js routing');
assert(code.includes('window.__VW_FRONTLINE1944_ROUTE__===true'),'Frontline runtime accepts the pre-main captured route flag');
assert(code.includes("typeof f1VocabForStudent==='function'")&&code.includes("typeof vocabForStudent==='function'"),'shared vocabulary adapters are reused');
assert(!code.includes('APPLE')&&!code.includes('BANANA'),'no sample vocabulary is hard-coded into the game');
assert(/letterCoins\s*:\s*1/.test(code)&&/wordBonus\s*:\s*50/.test(code),'Phase 1 preserves current reward values while leaving future reward rules for later phases');
assert(code.includes("typeof addCoins==='function'")&&code.includes("typeof saveState==='function'")&&code.includes("typeof authPushSave==='function'"),'existing economy/save/cloud path is reused');

// Load only the exported foundation types. Browser work is not started in this VM.
const sb={console,window:null,document:{readyState:'loading',addEventListener(){}},setInterval(){return 1;},clearInterval(){},setTimeout(){return 1;},clearTimeout(){},URLSearchParams,Math,Date};
sb.window=sb;vm.createContext(sb);vm.runInContext(code,sb);
const T=sb.Frontline1944&&sb.Frontline1944._t;
assert(T,'Frontline test surface must be exported');
const {CFG,LAYER,TERRAIN,SECTOR_TEMPLATES,WorldSpace,TerrainSystem,CollisionSystem,SectorStreamer,ObjectPool,visualIdFor,tankStateSnapshot,interpolateRemoteTank,forwardFromRotation,driveDelta,occlusionAcceptance,G}=T;

// World / sector streaming foundation.
assert.strictEqual(SECTOR_TEMPLATES.length,10,'exactly 10 reusable visual sector identities are defined');
assert(CFG.sectorWidth>CFG.viewW,'logical battlefield remains wider than the zoomed-out viewport');
assert(CFG.viewW>=126,'Phase 1.1 camera is zoomed materially farther out');
assert.strictEqual(sb.Frontline1944.VERSION,CFG.runtimeVersion,'runtime exposes an explicit Phase 1.1 version marker for desktop/mobile parity checks');
assert.strictEqual(WorldSpace.sectorCenterZ(0),0,'sector 0 world center');
assert.strictEqual(WorldSpace.sectorCenterZ(1),-CFG.sectorLength,'logical sector numbers increase in the default tank-forward direction');
assert.strictEqual(WorldSpace.sectorIndexAtZ(-CFG.sectorLength),1,'world position resolves to logical sector independent of pixels');
const ws=WorldSpace.localToWorld(3,12,-7),back=WorldSpace.worldToSector(ws.x,ws.z);
assert.strictEqual(back.logicalIndex,3,'local/world sector transform round-trips logical index');
assert.strictEqual(back.x,12,'local/world sector transform round-trips X');
assert.strictEqual(back.z,-7,'local/world sector transform round-trips local Z');
const visualIds=new Set();for(let i=-50;i<=50;i++){const v=visualIdFor(i);assert(v>=0&&v<10,'visual sector id stays in reusable range');visualIds.add(v);}assert(visualIds.size>=8,'logical sectors reuse a diverse subset of the 10 visual identities');
assert(code.includes('new Set([current-1,current,current+1])'),'streamer keeps only Previous / Current / Next fully active');
assert(code.includes('this.preload(current+CFG.preloadAhead)')&&code.includes('this.preload(current-CFG.preloadAhead)'),'near-future sector descriptors are preloaded');
const streamer=new SectorStreamer();for(let i=0;i<20;i++)streamer.preload(i);assert(streamer.stats().preloadedCount<=CFG.descriptorCacheCap,'descriptor preload cache is bounded');

// Terrain and collision acceptance logic, including deep water / bridge override.
const terrain=new TerrainSystem();
terrain.registerRect(0,0,0,100,20,'DEEP_WATER',70,'test-river');
terrain.registerRect(0,0,0,12,24,'ROAD',100,'test-bridge');
terrain.registerRect(0,-30,0,12,20,'SHALLOW_WATER',95,'test-ford');
terrain.registerRect(0,30,35,24,16,'MUD',60,'test-mud');
assert.strictEqual(terrain.sample(25,0).id,TERRAIN.DEEP_WATER.id,'deep river samples as blocked water');
assert.strictEqual(terrain.sample(0,0).id,TERRAIN.ROAD.id,'bridge road overrides deep-water blocking');
assert.strictEqual(terrain.sample(-30,0).id,TERRAIN.SHALLOW_WATER.id,'explicit ford overrides deep water with shallow-water behavior');
assert(terrain.sample(30,35).speed<1,'mud reduces movement speed');
const collision=new CollisionSystem(terrain);
collision.registerCircle(0,45,40,2,{ownerId:'tree:test',kind:'tree_trunk'});
collision.registerAABB(0,-45,40,7,6,{ownerId:'house:test',kind:'house'});
collision.registerAABB(0,25,45,7,6,{ownerId:'bunker:test',kind:'bunker'});
collision.registerAABB(0,0,45,3,14,{ownerId:'fort:test',kind:'fortress_wall'});
assert(collision.hitSolid(45,40,1.5).blocked,'Tank -> tree trunk is blocked');
assert(collision.hitSolid(-45,40,1.5).blocked,'Tank -> house is blocked');
assert(collision.hitSolid(25,45,1.5).blocked,'Tank -> bunker is blocked');
assert(collision.hitSolid(0,45,1.5).blocked,'Tank -> fortress wall is blocked');
assert(collision.hitSolid(25,0,1.5).blocked,'Tank -> deep river is blocked');
assert(!collision.hitSolid(0,0,1.5).blocked,'Tank -> bridge crossing is allowed');
const moved=collision.resolveCircleMove({x:-8,z:45},{x:8,z:45},1.5);assert(moved.blocked&&moved.x<0,'swept circle movement does not tunnel through a fortress wall');
const vehicleMoved=collision.resolveVehicleMove({x:-8,z:45},{x:8,z:45},1.5);assert(vehicleMoved.blocked&&vehicleMoved.x<0,'strict tank resolver stops at collision instead of axis-sliding through/along the obstacle');
terrain.registerRect(0,55,0,10,20,'DEEP_WATER',70,'footprint-water');assert(collision.hitSolid(49.8,0,2.45).blocked,'tank footprint blocks at deep-water edge before its center enters');

// 2.5D layer/depth foundation.
for(const k of ['BACKGROUND','TERRAIN','ROADS_WATER','GROUND_DECOR','GAMEPLAY_PROPS','ACTORS','FOREGROUND_OCCLUDERS','COMBAT_FX','ATMOSPHERE'])assert(Number.isInteger(LAYER[k]),k+' layer exists');
G.player={group:{renderOrder:5000},world:{x:0,z:0}};G.occluders=[{parent:{},renderOrder:6010,userData:{occluder:true,depthAnchor:{worldZ:0,priority:10,foreground:true}}}];
assert(occlusionAcceptance().pass,'foreground canopy has explicit depth ownership above the tank when overlapping');

// Tank / multiplayer-ready state contract.
const fakeTank={playerId:'p1',displayName:'Tank One',world:{x:4,z:-12},hullRotation:.3,turretRotation:-.7,hp:300,maxHp:380,activeWeapon:'main_cannon',fireEvent:9,visualUpgradeTier:2,damageStatistic:{match:123,lifetime:456},hullVisualTier:1,armorTier:2,engineTier:3,turretTier:4,mainWeaponId:'m1',specialWeaponId:'s1',skinId:'skin'};
const snap=tankStateSnapshot(fakeTank);assert.strictEqual(snap.hullRotation,.3);assert.strictEqual(snap.turretRotation,-.7);assert.notStrictEqual(snap.hullRotation,snap.turretRotation,'hull and turret rotations are independent');
for(const key of ['playerId','displayName','position','hp','maxHp','activeWeapon','fireEvent','visualUpgradeTier','damageStatistic','hullVisualTier','armorTier','engineTier','turretTier','mainWeaponId','specialWeaponId','skinId'])assert(Object.prototype.hasOwnProperty.call(snap,key),'multiplayer/upgrade snapshot contains '+key);
const remote={world:{x:0,z:0},hullRotation:0,turretRotation:0,group:{position:{set(x,y,z){this.x=x;this.y=y;this.z=z;}}},hull:{rotation:{y:0}},turret:{rotation:{y:0}}};
interpolateRemoteTank(remote,{position:{x:10,z:-20},hullRotation:1,turretRotation:-1},.1);assert(remote.world.x>0&&remote.world.x<10&&remote.world.z<0&&remote.world.z>-20,'remote tank interpolation moves toward replicated state without snapping');
assert(code.includes('nameAnchor')&&code.includes('hpAnchor')&&code.includes('damageAnchor'),'future player-name / HP / floating-damage anchors are present');


// Phase 1.1 tracked-vehicle control contract: no strafe; translation is hull-forward only.
let fwd=forwardFromRotation(0);assert(Math.abs(fwd.x)<1e-9&&Math.abs(fwd.z+1)<1e-9,'hull rotation 0 faces world -Z');
fwd=forwardFromRotation(Math.PI/2);assert(Math.abs(fwd.x-1)<1e-9&&Math.abs(fwd.z)<1e-9,'hull rotation +90deg faces world +X');
let dd=driveDelta(Math.PI/2,10,1);assert(Math.abs(dd.x-10)<1e-8&&Math.abs(dd.z)<1e-8,'forward movement follows the hull forward axis');
dd=driveDelta(Math.PI/2,-10,1);assert(Math.abs(dd.x+10)<1e-8&&Math.abs(dd.z)<1e-8,'reverse movement follows the exact opposite hull axis');
assert(code.includes('resolveVehicleMove(from,to,t.radius)')&&code.includes('const d=driveDelta(t.hullRotation,t.speed,dt)'),'tank tick uses the strict hull-forward vehicle resolver');
assert(code.includes("frontMarker=sharedMesh('box',0xffd84f")&&code.includes("rearMarker=sharedMesh('box',0xc94b3c"),'admin diagnostic front/rear hull markers are present');
assert(code.includes('function cannonWorldDirection(t)')&&code.includes('t.barrel.getWorldPosition(base)')&&code.includes('dir=cannonWorldDirection(t)'),'shell direction is derived from the rendered barrel/muzzle transform');
assert(code.includes("if('PointerEvent' in window)")&&code.includes("'touchstart'")&&code.includes("'touchmove'")&&code.includes("'touchend'"),'mobile controls have pointer events plus touch fallback');
assert(code.includes('runtimeOpen=!!G.root')&&code.includes("b.style.pointerEvents=hide?'none':''"),'admin launcher is hidden/disabled while Frontline runtime is open so it cannot cover mobile controls');

// Projectile / pooling / bounded-memory foundation.
const pool=new ObjectPool('unit',2,()=>({group:{visible:false},active:false}),o=>{o.group.visible=true;});const a=pool.acquire({}),b=pool.acquire({});assert(a&&b&&!pool.acquire({}),'object pool enforces hard cap');pool.release(a);assert(pool.acquire({}),'released pooled object is reusable');assert.strictEqual(pool.stats().created,2,'pool does not allocate beyond cap');
assert(CFG.projectileCap<=48&&CFG.enemyProjectileCap<=32&&CFG.fxCap<=72,'mobile projectile/FX caps remain bounded');
assert(code.includes('lifetime')&&code.includes('ownerId')&&code.includes('weaponId')&&code.includes('impactEvent')&&code.includes('collisionRadius'),'projectile contract includes owner, weapon, impact, lifetime and collision data');
assert(code.includes('if(!sectorActive)continue')&&code.includes('if(!active)return'),'inactive sectors do not run expensive enemy/fortress simulation');
assert(code.includes('pool.release(p)')&&code.includes('G.enemies=G.enemies.filter'),'expired projectiles and destroyed enemies are cleaned/reused');
assert(code.includes('renderer.setPixelRatio(Math.min(devicePixelRatio||1,CFG.dpr))'),'mobile DPR is capped');
assert(css.includes('.fl44-aim-stick')&&css.includes('@media (max-height:460px)')&&css.includes('touch-action:none'),'mobile landscape drive/aim/fire controls are present');

// Vocabulary source audit still uses the real current shared data.
const vb={console,state:{student:{grade:'ป.1'}}};vb.window=vb;vm.createContext(vb);vm.runInContext(f1,vb);
assert.strictEqual(typeof vb.f1VocabForStudent,'function','authoritative shooter vocabulary provider exists');
const grades=['ป.1','ป.2','ป.3','ป.4','ป.5','ป.6'],counts={};
for(const grade of grades){vb.state.student.grade=grade;const raw=vb.f1VocabForStudent()||[];const words=raw.map(x=>Array.isArray(x)?x[0]:x&&(x.en||x.word||x.eng||x.english)).filter(Boolean).map(x=>String(x).trim().toUpperCase());counts[grade]={count:words.length,unique:new Set(words).size};assert(words.length>0,grade+' vocabulary source must not be empty');assert.strictEqual(counts[grade].count,counts[grade].unique,grade+' vocabulary must not duplicate English targets in the shooter pool');}
console.log('Frontline vocabulary audit P.1-P.6:',JSON.stringify(counts));
console.log('PASS Frontline 1944 Phase 1.1: mobile/desktop runtime controls, hull-forward tracked movement, muzzle-aligned shells, strict collision, zoomed camera, sector foundation, pooling, and shared-system guards');
