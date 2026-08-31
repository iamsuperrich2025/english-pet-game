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
const {CFG,LAYER,TERRAIN,SECTOR_TEMPLATES,WorldSpace,TerrainSystem,CollisionSystem,SectorStreamer,ObjectPool,TankRuntime,DesktopTankInputAdapter,MobileTankInputAdapter,UnifiedTankInputAdapter,visualIdFor,tankStateSnapshot,interpolateRemoteTank,forwardFromRotation,rightFromRotation,driveDelta,normalizeTankCommand,desktopCommandFromState,mobileCommandFromState,mergeTankCommands,cannonWorldRay,runtimeIdentity,occlusionAcceptance,G}=T;

// World / sector streaming foundation.
assert.strictEqual(SECTOR_TEMPLATES.length,10,'exactly 10 reusable visual sector identities are defined');
assert(CFG.sectorWidth>CFG.viewW,'logical battlefield remains wider than the zoomed-out viewport');
assert(CFG.viewW>=150&&CFG.viewW/84>=1.7&&CFG.viewW/84<=2.0,'Phase 1.2 camera covers about 1.7–2x the earlier Phase 1 battlefield width');
assert(/^P1\.2-/.test(CFG.runtimeVersion),'Phase 1.2 runtime version marker is explicit');
assert.strictEqual(sb.Frontline1944.VERSION,CFG.runtimeVersion,'desktop/mobile parity marker is exported from the one Frontline runtime');
assert(Math.abs(WorldSpace.sectorCenterZ(0))<1e-12,'sector 0 world center');
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
assert(!collision.hitTankFootprint(0,0,0,CFG.tankFootprintHalfWidth,CFG.tankFootprintHalfLength).blocked,'oriented tank footprint remains legal on the bridge override');
assert(collision.hitTankFootprint(25,0,0,CFG.tankFootprintHalfWidth,CFG.tankFootprintHalfLength).blocked,'oriented tank footprint blocks on deep water');
collision.registerAABB(0,0,58,.5,18,{ownerId:'thin-wall:test',kind:'wall'});const tankSweep=collision.resolveTankSweep({x:-15,z:58,heading:Math.PI/2},{x:15,z:58,heading:Math.PI/2});assert(tankSweep.blocked&&tankSweep.x<0,'oriented swept tank footprint cannot tunnel through a thin wall at high travel distance');

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


// Phase 1.2 canonical tracked-vehicle + unified-runtime acceptance contract.
assert.strictEqual(typeof TankRuntime,'function','one authoritative TankRuntime class is exported');
assert.strictEqual(typeof UnifiedTankInputAdapter,'function','desktop/mobile commands converge through one shared input adapter');
for(let deg=0;deg<360;deg++){
  const h=deg*Math.PI/180,f=forwardFromRotation(h),r=rightFromRotation(h);assert(Math.abs(Math.hypot(f.x,f.z)-1)<1e-10,'forward vector is normalized at '+deg+'deg');assert(Math.abs(f.x*r.x+f.z*r.z)<1e-10,'forward/right axes remain orthogonal at '+deg+'deg');
  const forwardStep=driveDelta(h,7.5,.25),reverseStep=driveDelta(h,-7.5,.25);assert(forwardStep.x*f.x+forwardStep.z*f.z>0,'forward follows hull heading at '+deg+'deg');assert(reverseStep.x*f.x+reverseStep.z*f.z<0,'reverse follows opposite hull heading at '+deg+'deg');assert(Math.abs(forwardStep.x+reverseStep.x)<1e-10&&Math.abs(forwardStep.z+reverseStep.z)<1e-10,'forward/reverse are exact opposites at '+deg+'deg');
}
const desktopParity=desktopCommandFromState(new Set(['KeyW','KeyD']),null,{x:0,z:0},false),mobileParity=mobileCommandFromState({x:1,y:-1,active:true},{active:false},false,null);assert.strictEqual(desktopParity.throttle,mobileParity.throttle,'desktop/mobile throttle normalize identically');assert.strictEqual(desktopParity.steering,mobileParity.steering,'desktop/mobile steering normalize identically');const parityMerged=mergeTankCommands(desktopParity,mobileParity,true,false);assert.strictEqual(parityMerged.throttle,1);assert.strictEqual(parityMerged.steering,1);
function fakeRuntimeTank(x=0,z=40,h=0){return {world:{x,z},speed:0,hullRotation:h,turretRotation:h,turretTargetRotation:h,footprint:{halfWidth:CFG.tankFootprintHalfWidth,halfLength:CFG.tankFootprintHalfLength},group:{position:{set(x,y,z){this.x=x;this.y=y;this.z=z;}},updateMatrixWorld(){}},hull:{rotation:{y:0}},turret:{rotation:{y:0}},damageStatistic:{match:0,lifetime:0},playerId:'p',displayName:'P',hp:100,maxHp:100,activeWeapon:'main',fireEvent:0,visualUpgradeTier:0,hullVisualTier:0,armorTier:0,engineTier:0,turretTier:0,mainWeaponId:'main',specialWeaponId:'',skinId:'default'};}
const clearTerrain=new TerrainSystem(),clearCollision=new CollisionSystem(clearTerrain),runtimeTank=fakeRuntimeTank(0,40,0),runtime=new TankRuntime(runtimeTank,clearCollision,clearTerrain);for(let i=0;i<75;i++)runtime.step({throttle:0,steering:1},1/60);const turnedHeading=runtime.heading;assert(Math.abs(turnedHeading)>.2,'steering changes the authoritative hull heading even before translation');const forwardBefore={x:runtime.x,z:runtime.z},turnedForward=forwardFromRotation(runtime.heading);for(let i=0;i<60;i++)runtime.step({throttle:1,steering:0},1/60);let rdx=runtime.x-forwardBefore.x,rdz=runtime.z-forwardBefore.z;assert(rdx*turnedForward.x+rdz*turnedForward.z>1,'forward after a turn follows the new authoritative hull heading');assert(Math.abs(runtime.lastMotion.lateralVelocity)<1e-8,'canonical runtime reports zero lateral velocity');runtime.teleport(runtime.x,runtime.z,turnedHeading);const reverseBefore={x:runtime.x,z:runtime.z};for(let i=0;i<60;i++)runtime.step({throttle:-1,steering:0},1/60);rdx=runtime.x-reverseBefore.x;rdz=runtime.z-reverseBefore.z;assert(rdx*turnedForward.x+rdz*turnedForward.z<-1,'reverse after a turn follows the exact opposite authoritative hull heading');assert(Math.abs(runtime.lastMotion.lateralVelocity)<1e-8,'reverse also has zero lateral velocity');
G.player=runtimeTank;G.tankRuntime=runtime;const runtimeSnap=tankStateSnapshot(runtimeTank);assert.strictEqual(runtimeSnap.hullRotation,runtime.heading,'replicated hull yaw comes from authoritative runtime heading');assert.strictEqual(runtimeTank.hullRotation,runtime.heading,'physics/entity hull yaw equals authoritative heading');assert.strictEqual(runtimeTank.hull.rotation.y,runtime.heading,'visual hull yaw equals authoritative heading');
const sectorTank=fakeRuntimeTank(0,70,.35),sectorRuntime=new TankRuntime(sectorTank,clearCollision,clearTerrain),sectorHeading=sectorRuntime.heading,startSector=WorldSpace.sectorIndexAtZ(sectorRuntime.z);for(let i=0;i<600;i++)sectorRuntime.step({throttle:1,steering:0},1/60);assert.notStrictEqual(WorldSpace.sectorIndexAtZ(sectorRuntime.z),startSector,'deterministic drive crosses a logical sector boundary');assert(Math.abs(sectorRuntime.heading-sectorHeading)<1e-12,'sector transition does not mutate authoritative hull heading');
class TestVec3{constructor(){this.x=0;this.y=0;this.z=0;}}sb.THREE={Vector3:TestVec3};const muzzleTank={group:{updateMatrixWorld(){}},cannonTip:{getWorldPosition(v){v.x=8;v.y=3;v.z=-12;}},barrel:{getWorldPosition(v){v.x=5;v.y=3;v.z=-8;}},turretRotation:0,world:{x:0,z:0}},ray=cannonWorldRay(muzzleTank),rayLen=Math.hypot(3,-4);assert(Math.abs(ray.direction.x-3/rayLen)<1e-12&&Math.abs(ray.direction.z+4/rayLen)<1e-12,'projectile direction agrees with the actual barrel-to-muzzle world transform');assert.strictEqual(ray.origin.x,8);assert.strictEqual(ray.origin.y,3);assert.strictEqual(ray.origin.z,-12);
assert(code.includes('resolveTankSweep(from,to,fp.halfWidth,fp.halfLength')&&code.includes('d=driveDelta(nextHeading,this.speed,h)'),'TankRuntime translates only from its authoritative hull-forward vector and swept footprint');
assert(code.includes("frontArrow=sharedMesh('cone4',0xfff08a")&&code.includes("rearLeft=sharedMesh('sphere',0xff4f3e"),'Admin Preview has unmistakable front arrow and rear lamps');
assert(code.includes('function cannonWorldRay(t)')&&code.includes('t.group.updateMatrixWorld')&&code.includes('dir=ray.direction'),'shell spawn and direction use the actual muzzle/barrel world transform');
assert(code.includes("if('PointerEvent' in window)")&&code.includes('setPointerCapture')&&code.includes("stick.style.touchAction='none'")&&code.includes("el.style.touchAction='none'"),'drive/aim/fire use pointer capture with explicit touch-action:none');
assert(code.includes("kind:'tank',phase:'1.2'")&&code.includes('__VW_FRONTLINE1944_RUNTIME__'),'loaded Frontline runtime publishes an authoritative tank-runtime identity marker');
assert.strictEqual(runtimeIdentity().kind,'tank','runtime identity cannot describe the active Frontline controller as infantry');
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
console.log('PASS Frontline 1944 Phase 1.2: canonical non-holonomic TankRuntime, unified desktop/mobile adapters, authoritative heading, muzzle-world-transform fire, swept oriented footprint collision, sector stability, camera coverage, pooling, and shared-system guards');
