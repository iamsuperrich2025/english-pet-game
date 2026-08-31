"use strict";
const fs=require('fs'),vm=require('vm'),assert=require('assert');
const code=fs.readFileSync('js/frontline1944.js','utf8');
const css=fs.readFileSync('css/frontline1944.css','utf8');
const html=fs.readFileSync('index_classic.html','utf8');
const f1=fs.readFileSync('js/data/f1_vocab.js','utf8');

// Access / shared-system regression guards.
assert(html.includes('id="btn-rail-frontline1944"')&&html.includes('hidden')&&html.includes('ADMIN PREVIEW'),'Frontline lobby entry stays hidden-by-default admin preview');
assert(html.includes("link.href='css/frontline1944.css?v=124'")&&html.includes("s.src='js/frontline1944.js?v=124'")&&html.includes("if(!allowed())return false"),'Frontline assets remain admin-gated, cache-busted and lazy-fetched only after approved access');
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

// Load only the exported foundation types. Browser rendering is not started in this VM.
// The window listener registry lets acceptance exercise the real mobile pointer delivery path.
const windowListeners=new Map();
function addWindowListener(type,fn){if(!windowListeners.has(type))windowListeners.set(type,[]);windowListeners.get(type).push(fn);}
function removeWindowListener(type,fn){const a=windowListeners.get(type)||[],i=a.indexOf(fn);if(i>=0)a.splice(i,1);}
const sb={console,window:null,document:{readyState:'loading',addEventListener(){},removeEventListener(){},elementFromPoint(){return null;}},addEventListener:addWindowListener,removeEventListener:removeWindowListener,PointerEvent:function PointerEvent(){},performance:{now:()=>1234},setInterval(){return 1;},clearInterval(){},setTimeout(){return 1;},clearTimeout(){},URLSearchParams,Math,Date};
sb.window=sb;vm.createContext(sb);vm.runInContext(code,sb);
const T=sb.Frontline1944&&sb.Frontline1944._t;
assert(T,'Frontline test surface must be exported');
const {CFG,LAYER,TERRAIN,SECTOR_TEMPLATES,WorldSpace,TerrainSystem,CollisionSystem,SectorStreamer,ObjectPool,TankRuntime,DesktopTankInputAdapter,MobileTankInputAdapter,UnifiedTankInputAdapter,GlobalMobileTouchRouter,visualIdFor,tankStateSnapshot,interpolateRemoteTank,forwardFromRotation,rightFromRotation,rotationFromForward,driveDelta,normalizeTankCommand,desktopCommandFromState,mobileCommandFromState,mergeTankCommands,stickVectorFromRect,resetStickState,pointInRect,eventTargetLabel,bindGlobalMobileTouchRouter,cannonWorldRay,runtimeIdentity,occlusionAcceptance,G}=T;

// World / sector streaming foundation.
assert.strictEqual(SECTOR_TEMPLATES.length,10,'exactly 10 reusable visual sector identities are defined');
assert(CFG.sectorWidth>CFG.viewW,'logical battlefield remains wider than the zoomed-out viewport');
assert(CFG.viewW>=150&&CFG.viewW/84>=1.7&&CFG.viewW/84<=2.0,'Phase 1.2 camera covers about 1.7–2x the earlier Phase 1 battlefield width');
assert(/^P1\.2\.4-/.test(CFG.runtimeVersion),'Phase 1.2.4 global-touch-router runtime version marker is explicit');
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
// Independent visual-direction oracle: Three.js Object3D.rotation.y applied to the arrow's local -Z axis.
// This deliberately does NOT call forwardFromRotation(), so a sign mismatch cannot self-validate again.
function visualLocalMinusZAfterYaw(h){return {x:-Math.sin(h),z:-Math.cos(h)};}
for(let deg=0;deg<360;deg++){
  const h=deg*Math.PI/180,f=forwardFromRotation(h),r=rightFromRotation(h),visual=visualLocalMinusZAfterYaw(h);assert(Math.abs(Math.hypot(f.x,f.z)-1)<1e-10,'forward vector is normalized at '+deg+'deg');assert(Math.abs(f.x*r.x+f.z*r.z)<1e-10,'forward/right axes remain orthogonal at '+deg+'deg');
  assert(Math.abs(f.x-visual.x)<1e-10&&Math.abs(f.z-visual.z)<1e-10,'authoritative forward exactly matches the visible hull arrow at '+deg+'deg');
  const forwardStep=driveDelta(h,7.5,.25),reverseStep=driveDelta(h,-7.5,.25);assert(forwardStep.x*visual.x+forwardStep.z*visual.z>0,'UP/forward follows the visible hull arrow at '+deg+'deg');assert(reverseStep.x*visual.x+reverseStep.z*visual.z<0,'DOWN/reverse is exactly opposite the visible hull arrow at '+deg+'deg');assert(Math.abs(forwardStep.x+reverseStep.x)<1e-10&&Math.abs(forwardStep.z+reverseStep.z)<1e-10,'forward/reverse are exact opposites at '+deg+'deg');
  const recovered=rotationFromForward(visual.x,visual.z),err=Math.atan2(Math.sin(recovered-h),Math.cos(recovered-h));assert(Math.abs(err)<1e-10,'world direction converts back to the same Three.js hull yaw at '+deg+'deg');
  const desktopAim=desktopCommandFromState(new Set(),{x:visual.x*10,z:visual.z*10},{x:0,z:0},false),mobileAim=mobileCommandFromState({active:false},{active:true},false,visual),desktopAimErr=Math.atan2(Math.sin(desktopAim.turretTargetHeading-h),Math.cos(desktopAim.turretTargetHeading-h)),mobileAimErr=Math.atan2(Math.sin(mobileAim.turretTargetHeading-h),Math.cos(mobileAim.turretTargetHeading-h));assert(Math.abs(desktopAimErr)<1e-10&&Math.abs(mobileAimErr)<1e-10,'desktop/mobile turret aim use the same visual yaw convention at '+deg+'deg');
}
assert.strictEqual(desktopCommandFromState(new Set(['ArrowUp']),null,{x:0,z:0},false).throttle,1,'ArrowUp is positive throttle');
assert.strictEqual(desktopCommandFromState(new Set(['ArrowDown']),null,{x:0,z:0},false).throttle,-1,'ArrowDown is negative throttle');
const desktopParity=desktopCommandFromState(new Set(['KeyW','KeyD']),null,{x:0,z:0},false),mobileParity=mobileCommandFromState({x:1,y:-1,active:true},{active:false},false,null);assert.strictEqual(desktopParity.throttle,mobileParity.throttle,'desktop/mobile throttle normalize identically');assert.strictEqual(desktopParity.steering,mobileParity.steering,'desktop/mobile steering normalize identically');const parityMerged=mergeTankCommands(desktopParity,mobileParity,true,false);assert.strictEqual(parityMerged.throttle,1);assert.strictEqual(parityMerged.steering,1);
// Phase 1.2.4 mobile input delivery: acquisition is GLOBAL and geometry-owned.
// The event target is deliberately the battlefield canvas, not the joystick DIV, proving initial DOM hit-target delivery is no longer required.
class FakeClassList{constructor(){this.s=new Set();}add(x){this.s.add(x);}remove(x){this.s.delete(x);}toggle(x,on){if(on)this.s.add(x);else this.s.delete(x);}contains(x){return this.s.has(x);}}
class FakeControlTarget{
  constructor(rect,id,tagName='DIV',className=''){this.rect=rect;this.style={};this.id=id||'';this.tagName=tagName;this.className=className;this.classList=new FakeClassList();this.parentElement=null;}
  getBoundingClientRect(){return this.rect;}
}
function pointerEvt(pointerId,clientX,clientY,target=canvasTarget){return {pointerId,clientX,clientY,pointerType:'touch',target,cancelable:true,preventDefault(){this.defaultPrevented=true;},stopPropagation(){this.propagationStopped=true;}};}
function emitWindow(type,event){for(const fn of [...(windowListeners.get(type)||[])])fn(event);}
const driveRect={left:0,top:0,width:100,height:100},aimRect={left:200,top:0,width:100,height:100},fireRect={left:400,top:20,width:60,height:60};
const sampleUp=stickVectorFromRect(driveRect,50,10),sampleDown=stickVectorFromRect(driveRect,50,90),sampleRight=stickVectorFromRect(driveRect,90,50);assert(sampleUp.y<-.99&&sampleDown.y>.99&&sampleRight.x>.99,'mobile stick geometry normalizes up/down/right correctly');
assert(pointInRect(driveRect,50,10)&&!pointInRect(driveRect,150,10),'control-zone geometric hit test distinguishes inside/outside independently from DOM event target');
const canvasTarget={tagName:'CANVAS',id:'fl44-battlefield',className:'',parentElement:null};assert.strictEqual(eventTargetLabel(canvasTarget),'canvas#fl44-battlefield','diagnostics label exposes the real DOM event target');
const driveEl=new FakeControlTarget(driveRect,'fl44-stick','DIV','fl44-stick'),driveKnob={style:{}},aimEl=new FakeControlTarget(aimRect,'fl44-aim-stick','DIV','fl44-aim-stick'),aimKnob={style:{}},fireEl=new FakeControlTarget(fireRect,'fl44-fire','BUTTON','fl44-fire'),diagEl={textContent:''};
const root={querySelector(sel){return ({'#fl44-stick':driveEl,'.fl44-knob':driveKnob,'#fl44-aim-stick':aimEl,'.fl44-aim-knob':aimKnob,'#fl44-fire':fireEl,'#fl44-input-diag':diagEl})[sel]||null;}};
driveEl.parentElement=root;aimEl.parentElement=root;fireEl.parentElement=root;canvasTarget.parentElement=root;G.root=root;G.joy={x:0,y:0,id:null,active:false,transport:'idle',lastTransport:'none',captured:false,moves:0,lastEventAt:0};G.aim={x:0,y:0,id:null,active:false,transport:'idle',lastTransport:'none',captured:false,moves:0,lastEventAt:0};G.firing=false;G.mobileRouter=bindGlobalMobileTouchRouter();assert(G.mobileRouter instanceof GlobalMobileTouchRouter,'one global mobile touch router owns DRIVE/AIM/FIRE');
function begin(id,x,y){emitWindow('pointerdown',pointerEvt(id,x,y));}
function movePointer(id,x,y){emitWindow('pointermove',pointerEvt(id,x,y));}
function endPointer(id,x,y){emitWindow('pointerup',pointerEvt(id,x,y));}
function mobileCmd(){return new MobileTankInputAdapter().sample();}
function fakeRuntimeTank(x=0,z=40,h=0){return {world:{x,z},speed:0,hullRotation:h,turretRotation:h,turretTargetRotation:h,footprint:{halfWidth:CFG.tankFootprintHalfWidth,halfLength:CFG.tankFootprintHalfLength},group:{position:{set(x,y,z){this.x=x;this.y=y;this.z=z;}},updateMatrixWorld(){}},hull:{rotation:{y:0}},turret:{rotation:{y:0}},damageStatistic:{match:0,lifetime:0},playerId:'p',displayName:'P',hp:100,maxHp:100,activeWeapon:'main',fireEvent:0,visualUpgradeTier:0,hullVisualTier:0,armorTier:0,engineTier:0,turretTier:0,mainWeaponId:'main',specialWeaponId:'',skinId:'default'};}
// 1. DRIVE upper zone -> normalized forward -> shared TankRuntime -> forward displacement.
begin(101,50,10);let cmd=mobileCmd();assert(cmd.throttle>.99&&Math.abs(cmd.steering)<1e-12&&G.joy.id===101,'global canvas-target pointerdown in DRIVE upper zone produces forward command');let rtTerrain=new TerrainSystem(),rt=new TankRuntime(fakeRuntimeTank(),new CollisionSystem(rtTerrain),rtTerrain),z0=rt.z;for(let i=0;i<60;i++)rt.step(cmd,1/60);assert(rt.z<z0-1,'mobile DRIVE upper-zone command reaches authoritative TankRuntime and moves forward');
// 6/7. Ownership survives leaving the joystick rectangle and any lost-pointer-capture event.
emitWindow('lostpointercapture',pointerEvt(101,50,10));movePointer(101,50,-80);assert(G.joy.active&&G.joy.id===101&&mobileCmd().throttle>.99,'DRIVE remains owned after pointer leaves DOM rectangle and lost pointer capture');endPointer(101,50,-80);assert(!G.joy.active&&G.joy.id===null&&mobileCmd().throttle===0,'matching pointerup releases only DRIVE and returns it to zero');
// 2. Lower zone -> reverse displacement.
begin(102,50,90);cmd=mobileCmd();assert(cmd.throttle<-.99,'DRIVE lower-zone touch produces reverse throttle');rtTerrain=new TerrainSystem();rt=new TankRuntime(fakeRuntimeTank(),new CollisionSystem(rtTerrain),rtTerrain);z0=rt.z;for(let i=0;i<60;i++)rt.step(cmd,1/60);assert(rt.z>z0+.5,'mobile DRIVE lower-zone command reaches TankRuntime and reverses');endPointer(102,50,90);
// 3. Left/right DRIVE change hull yaw.
begin(103,10,50);let leftCmd=mobileCmd(),leftRuntime=new TankRuntime(fakeRuntimeTank(),new CollisionSystem(new TerrainSystem()),new TerrainSystem());for(let i=0;i<30;i++)leftRuntime.step(leftCmd,1/60);assert(leftRuntime.heading>0.05,'left DRIVE produces correct positive hull yaw under the locked Three.js convention');endPointer(103,10,50);begin(104,90,50);let rightCmd=mobileCmd(),rightRuntime=new TankRuntime(fakeRuntimeTank(),new CollisionSystem(new TerrainSystem()),new TerrainSystem());for(let i=0;i<30;i++)rightRuntime.step(rightCmd,1/60);assert(rightRuntime.heading<-.05,'right DRIVE produces correct negative hull yaw under the locked Three.js convention');endPointer(104,90,50);
// 4/5. Diagonal DRIVE gives simultaneous throttle+steer with zero lateral/strafe runtime component.
begin(105,90,10);const diagCmd=mobileCmd();assert(diagCmd.throttle>.55&&diagCmd.steering>.55,'diagonal DRIVE emits simultaneous throttle and steering');const diagTerrain=new TerrainSystem(),diagRuntime=new TankRuntime(fakeRuntimeTank(),new CollisionSystem(diagTerrain),diagTerrain),diagHeading0=diagRuntime.heading,diagZ0=diagRuntime.z;for(let i=0;i<45;i++)diagRuntime.step(diagCmd,1/60);assert(diagRuntime.z<diagZ0-.2&&diagRuntime.heading<diagHeading0-.05,'diagonal DRIVE moves and turns simultaneously');assert(Math.abs(diagRuntime.lastMotion.lateralVelocity)<1e-8,'diagonal DRIVE still has zero lateral/strafe component');endPointer(105,90,10);
// 9-12. Three independent pointers can own DRIVE + AIM + FIRE; releasing one cannot reset the others.
begin(201,50,10);begin(202,250,10);begin(203,430,50);assert(G.mobileRouter.activeCount()===3&&G.joy.active&&G.aim.active&&G.firing,'DRIVE + AIM + FIRE coexist with separate pointer ownership');cmd=mobileCmd();assert(cmd.throttle>.99&&cmd.fire,'DRIVE + FIRE simultaneous multi-touch reaches the mobile adapter');assert(G.aim.id===202&&G.mobileRouter.rolePointers.aim===202,'DRIVE + AIM simultaneous multi-touch retains AIM ownership');endPointer(201,50,10);assert(!G.joy.active&&G.aim.active&&G.firing&&G.mobileRouter.activeCount()===2,'releasing DRIVE does not cancel AIM or FIRE');
// 13. AIM command reaches the same TankRuntime turret path. With no camera in VM, AIM up maps to +Z and therefore turns turret away from default -Z.
G.camera=null;const aimOnlyCmd=mobileCmd();assert(aimOnlyCmd.turretTargetHeading!=null,'AIM produces an absolute turret target heading');const aimTerrain=new TerrainSystem(),aimRuntime=new TankRuntime(fakeRuntimeTank(),new CollisionSystem(aimTerrain),aimTerrain),turret0=aimRuntime.turretHeading;for(let i=0;i<20;i++)aimRuntime.step(aimOnlyCmd,1/60);assert(Math.abs(aimRuntime.turretHeading-turret0)>.05,'AIM target reaches authoritative TankRuntime turret rotation');endPointer(202,250,10);assert(G.firing&&G.mobileRouter.activeCount()===1,'releasing AIM leaves FIRE active');endPointer(203,430,50);assert(!G.firing&&G.mobileRouter.activeCount()===0,'releasing FIRE clears only FIRE');
assert(diagEl.textContent.includes('EVENT TARGET: canvas#fl44-battlefield')&&diagEl.textContent.includes('POINTERS:'),'Admin Preview diagnostics update immediately with DOM target and active pointer count');
// 15/16. Desktop adapter remains unchanged and both adapters still converge into one UnifiedTankInputAdapter / TankRuntime.
const desktopLocked=desktopCommandFromState(new Set(['ArrowUp','ArrowRight']),null,{x:0,z:0},false);assert.strictEqual(desktopLocked.throttle,1);assert.strictEqual(desktopLocked.steering,1);assert.strictEqual(typeof UnifiedTankInputAdapter,'function','desktop/mobile remain adapters feeding the same TankRuntime');
G.listeners.splice(0).forEach(f=>{try{f();}catch(_){}});G.mobileRouter=null;G.root=null;G.firing=false;resetStickState(G.joy,driveKnob);resetStickState(G.aim,aimKnob);
const directionTerrain=new TerrainSystem(),directionCollision=new CollisionSystem(directionTerrain),upCommand=desktopCommandFromState(new Set(['ArrowUp']),null,{x:0,z:0},false),downCommand=desktopCommandFromState(new Set(['ArrowDown']),null,{x:0,z:0},false);
for(let deg=0;deg<360;deg++){const h=deg*Math.PI/180,visual=visualLocalMinusZAfterYaw(h),forwardTank=fakeRuntimeTank(0,40,h),forwardRuntime=new TankRuntime(forwardTank,directionCollision,directionTerrain),fx=forwardRuntime.x,fz=forwardRuntime.z;forwardRuntime.step(upCommand,.05);const fdx=forwardRuntime.x-fx,fdz=forwardRuntime.z-fz;assert(fdx*visual.x+fdz*visual.z>0,'TankRuntime ArrowUp displacement follows visible arrow at '+deg+'deg');assert(Math.abs(fdx*visual.z-fdz*visual.x)<1e-8,'TankRuntime ArrowUp has no lateral displacement at '+deg+'deg');const reverseTank=fakeRuntimeTank(0,40,h),reverseRuntime=new TankRuntime(reverseTank,directionCollision,directionTerrain),rx=reverseRuntime.x,rz=reverseRuntime.z;reverseRuntime.step(downCommand,.05);const rdx=reverseRuntime.x-rx,rdz=reverseRuntime.z-rz;assert(rdx*visual.x+rdz*visual.z<0,'TankRuntime ArrowDown displacement is opposite visible arrow at '+deg+'deg');assert(Math.abs(rdx*visual.z-rdz*visual.x)<1e-8,'TankRuntime ArrowDown has no lateral displacement at '+deg+'deg');}
const rightTurnTank=fakeRuntimeTank(0,40,0),rightTurnRuntime=new TankRuntime(rightTurnTank,new CollisionSystem(new TerrainSystem()),new TerrainSystem());for(let i=0;i<45;i++)rightTurnRuntime.step({throttle:0,steering:1},1/60);assert(forwardFromRotation(rightTurnRuntime.heading).x>0,'right steering turns the visible front arrow toward +world X from the default -Z heading');
const clearTerrain=new TerrainSystem(),clearCollision=new CollisionSystem(clearTerrain),runtimeTank=fakeRuntimeTank(0,40,0),runtime=new TankRuntime(runtimeTank,clearCollision,clearTerrain);for(let i=0;i<75;i++)runtime.step({throttle:0,steering:1},1/60);const turnedHeading=runtime.heading;assert(Math.abs(turnedHeading)>.2,'steering changes the authoritative hull heading even before translation');const forwardBefore={x:runtime.x,z:runtime.z},turnedForward=forwardFromRotation(runtime.heading);for(let i=0;i<60;i++)runtime.step({throttle:1,steering:0},1/60);let rdx=runtime.x-forwardBefore.x,rdz=runtime.z-forwardBefore.z;assert(rdx*turnedForward.x+rdz*turnedForward.z>1,'forward after a turn follows the new authoritative hull heading');assert(Math.abs(runtime.lastMotion.lateralVelocity)<1e-8,'canonical runtime reports zero lateral velocity');runtime.teleport(runtime.x,runtime.z,turnedHeading);const reverseBefore={x:runtime.x,z:runtime.z};for(let i=0;i<60;i++)runtime.step({throttle:-1,steering:0},1/60);rdx=runtime.x-reverseBefore.x;rdz=runtime.z-reverseBefore.z;assert(rdx*turnedForward.x+rdz*turnedForward.z<-1,'reverse after a turn follows the exact opposite authoritative hull heading');assert(Math.abs(runtime.lastMotion.lateralVelocity)<1e-8,'reverse also has zero lateral velocity');
G.player=runtimeTank;G.tankRuntime=runtime;const runtimeSnap=tankStateSnapshot(runtimeTank);assert.strictEqual(runtimeSnap.hullRotation,runtime.heading,'replicated hull yaw comes from authoritative runtime heading');assert.strictEqual(runtimeTank.hullRotation,runtime.heading,'physics/entity hull yaw equals authoritative heading');assert.strictEqual(runtimeTank.hull.rotation.y,runtime.heading,'visual hull yaw equals authoritative heading');
const sectorTank=fakeRuntimeTank(0,70,.35),sectorRuntime=new TankRuntime(sectorTank,clearCollision,clearTerrain),sectorHeading=sectorRuntime.heading,startSector=WorldSpace.sectorIndexAtZ(sectorRuntime.z);for(let i=0;i<600;i++)sectorRuntime.step({throttle:1,steering:0},1/60);assert.notStrictEqual(WorldSpace.sectorIndexAtZ(sectorRuntime.z),startSector,'deterministic drive crosses a logical sector boundary');assert(Math.abs(sectorRuntime.heading-sectorHeading)<1e-12,'sector transition does not mutate authoritative hull heading');
class TestVec3{constructor(){this.x=0;this.y=0;this.z=0;}}sb.THREE={Vector3:TestVec3};const muzzleTank={group:{updateMatrixWorld(){}},cannonTip:{getWorldPosition(v){v.x=8;v.y=3;v.z=-12;}},barrel:{getWorldPosition(v){v.x=5;v.y=3;v.z=-8;}},turretRotation:0,world:{x:0,z:0}},ray=cannonWorldRay(muzzleTank),rayLen=Math.hypot(3,-4);assert(Math.abs(ray.direction.x-3/rayLen)<1e-12&&Math.abs(ray.direction.z+4/rayLen)<1e-12,'projectile direction agrees with the actual barrel-to-muzzle world transform');assert.strictEqual(ray.origin.x,8);assert.strictEqual(ray.origin.y,3);assert.strictEqual(ray.origin.z,-12);
assert(code.includes('resolveTankSweep(from,to,fp.halfWidth,fp.halfLength')&&code.includes('d=driveDelta(nextHeading,this.speed,h)'),'TankRuntime translates only from its authoritative hull-forward vector and swept footprint');
assert(code.includes('x:-Math.sin(rotation),z:-Math.cos(rotation)')&&code.includes('this.heading-cmd.steering*CFG.tankTurnRate'),'runtime uses the Three.js local -Z visual convention and right-steer yaw sign');
assert(code.includes("frontArrow=sharedMesh('cone4',0xfff08a")&&code.includes("rearLeft=sharedMesh('sphere',0xff4f3e"),'Admin Preview has unmistakable front arrow and rear lamps');
assert(code.includes('function cannonWorldRay(t)')&&code.includes('t.group.updateMatrixWorld')&&code.includes('dir=ray.direction'),'shell spawn and direction use the actual muzzle/barrel world transform');
assert(code.includes("listen(window,'pointerdown',down,{passive:false,capture:true})")&&code.includes("listen(window,'pointermove',move,{passive:false,capture:true})")&&code.includes("listen(window,'touchstart',down,{passive:false,capture:true})")&&code.includes('class GlobalMobileTouchRouter')&&code.includes('getBoundingClientRect')&&!code.includes('function bindStickElement(')&&!code.includes('setPointerCapture('),'DRIVE/AIM/FIRE acquisition is global geometry-routed and does not depend on joystick DOM pointerdown or pointer capture');
assert(code.includes("kind:'tank',phase:'1.2.4'")&&code.includes('__VW_FRONTLINE1944_RUNTIME__'),'loaded Frontline runtime publishes the Phase 1.2.4 authoritative tank-runtime identity marker');
assert.strictEqual(runtimeIdentity().kind,'tank','runtime identity cannot describe the active Frontline controller as infantry');
assert(code.includes('runtimeOpen=!!G.root')&&code.includes("b.style.pointerEvents=hide?'none':''"),'admin launcher is hidden/disabled while Frontline runtime is open so it cannot cover mobile controls');

// Projectile / pooling / bounded-memory foundation.
const pool=new ObjectPool('unit',2,()=>({group:{visible:false},active:false}),o=>{o.group.visible=true;});const a=pool.acquire({}),b=pool.acquire({});assert(a&&b&&!pool.acquire({}),'object pool enforces hard cap');pool.release(a);assert(pool.acquire({}),'released pooled object is reusable');assert.strictEqual(pool.stats().created,2,'pool does not allocate beyond cap');
assert(CFG.projectileCap<=48&&CFG.enemyProjectileCap<=32&&CFG.fxCap<=72,'mobile projectile/FX caps remain bounded');
assert(code.includes('lifetime')&&code.includes('ownerId')&&code.includes('weaponId')&&code.includes('impactEvent')&&code.includes('collisionRadius'),'projectile contract includes owner, weapon, impact, lifetime and collision data');
assert(code.includes('if(!sectorActive)continue')&&code.includes('if(!active)return'),'inactive sectors do not run expensive enemy/fortress simulation');
assert(code.includes('pool.release(p)')&&code.includes('G.enemies=G.enemies.filter'),'expired projectiles and destroyed enemies are cleaned/reused');
assert(code.includes('renderer.setPixelRatio(Math.min(devicePixelRatio||1,CFG.dpr))'),'mobile DPR is capped');
assert(css.includes('.fl44-aim-stick')&&css.includes('.fl44-input-diag')&&css.includes('@media (max-height:460px)')&&css.includes('touch-action:none')&&css.includes('-webkit-user-select:none'),'mobile landscape controls and temporary Admin input diagnostics are hardened');

// Vocabulary source audit still uses the real current shared data.
const vb={console,state:{student:{grade:'ป.1'}}};vb.window=vb;vm.createContext(vb);vm.runInContext(f1,vb);
assert.strictEqual(typeof vb.f1VocabForStudent,'function','authoritative shooter vocabulary provider exists');
const grades=['ป.1','ป.2','ป.3','ป.4','ป.5','ป.6'],counts={};
for(const grade of grades){vb.state.student.grade=grade;const raw=vb.f1VocabForStudent()||[];const words=raw.map(x=>Array.isArray(x)?x[0]:x&&(x.en||x.word||x.eng||x.english)).filter(Boolean).map(x=>String(x).trim().toUpperCase());counts[grade]={count:words.length,unique:new Set(words).size};assert(words.length>0,grade+' vocabulary source must not be empty');assert.strictEqual(counts[grade].count,counts[grade].unique,grade+' vocabulary must not duplicate English targets in the shooter pool');}
console.log('Frontline vocabulary audit P.1-P.6:',JSON.stringify(counts));
console.log('PASS Frontline 1944 Phase 1.2.4: global geometric touch routing supports DRIVE/AIM/FIRE multi-touch even when DOM target is canvas; canonical desktop/tank direction and all Phase 1 foundation guards remain locked');
