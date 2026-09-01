"use strict";



const fs=require('fs'),vm=require('vm'),assert=require('assert');



const code=fs.readFileSync('js/frontline1944.js','utf8');



const css=fs.readFileSync('css/frontline1944.css','utf8');



const html=fs.readFileSync('index_classic.html','utf8');



const f1Path='js/data/f1_vocab.js',f1=fs.existsSync(f1Path)?fs.readFileSync(f1Path,'utf8'):null;







// Access / shared-system regression guards.



assert(html.includes('id="btn-rail-frontline1944"')&&html.includes('hidden')&&html.includes('ADMIN PREVIEW'),'Frontline lobby entry stays hidden-by-default admin preview');



assert(html.includes("link.href='css/frontline1944.css?v=125'")&&html.includes("s.src='js/frontline1944.js?v=125'")&&html.includes("if(!allowed())return false"),'Frontline assets remain admin-gated, cache-busted and lazy-fetched only after approved access');



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



const sb={console,window:null,document:{readyState:'loading',addEventListener(){},removeEventListener(){},elementFromPoint(){return null;}},navigator:{maxTouchPoints:1},location:{search:''},matchMedia(){return {matches:true};},isAdmin(){return true;},addEventListener:addWindowListener,removeEventListener:removeWindowListener,PointerEvent:function PointerEvent(){},performance:{now:()=>1234},setInterval(){return 1;},clearInterval(){},setTimeout(){return 1;},clearTimeout(){},URLSearchParams,Math,Date};



sb.window=sb;vm.createContext(sb);vm.runInContext(code,sb);



const T=sb.Frontline1944&&sb.Frontline1944._t;



assert(T,'Frontline test surface must be exported');



const {CFG,LAYER,TERRAIN,SECTOR_TEMPLATES,WorldSpace,TerrainSystem,CollisionSystem,SectorStreamer,ObjectPool,TankRuntime,DesktopTankInputAdapter,MobileTankInputAdapter,UnifiedTankInputAdapter,GlobalMobileTouchRouter,visualIdFor,tankStateSnapshot,interpolateRemoteTank,forwardFromRotation,rightFromRotation,rotationFromForward,driveDelta,normalizeTankCommand,desktopCommandFromState,mobileCommandFromState,mergeTankCommands,stickVectorFromRect,resetStickState,pointInRect,mobileControlRegions,eventTargetLabel,bindGlobalMobileTouchRouter,markTouchLikeInput,clearMobileAimLatch,mobileAimLatchedHeading,shouldAcceptDesktopAimEvent,inputDiagnosticsEnabled,cannonWorldRay,runtimeIdentity,occlusionAcceptance,updateInputDiagnostics,G}=T;







// World / sector streaming foundation.



assert.strictEqual(SECTOR_TEMPLATES.length,10,'exactly 10 reusable visual sector identities are defined');



assert(CFG.sectorWidth>CFG.viewW,'logical battlefield remains wider than the zoomed-out viewport');



assert(CFG.viewW>=150&&CFG.viewW/84>=1.7&&CFG.viewW/84<=2.0,'Phase 1.2 camera covers about 1.7–2x the earlier Phase 1 battlefield width');



assert(/^P1\.2\.5-/.test(CFG.runtimeVersion),'Phase 1.2.5 aim-latch/floating-controls runtime version marker is explicit');



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



// Phase 1.2.5 mobile acceptance: floating acquisition + persistent AIM authority.
// Initial acquisition is intentionally made against the battlefield canvas; the controls themselves need not be the DOM hit target.
class FakeClassList{constructor(){this.s=new Set();}add(x){this.s.add(x);}remove(x){this.s.delete(x);}toggle(x,on){if(on)this.s.add(x);else this.s.delete(x);}contains(x){return this.s.has(x);}}
class FakeControlTarget{
  constructor(rect,id,tagName='DIV',className=''){this.rect={...rect};this.style={};this.dataset={};this.attrs={};this.hidden=false;this.id=id||'';this.tagName=tagName;this.className=className;this.classList=new FakeClassList();this.parentElement=null;}
  getBoundingClientRect(){const w=this.rect.width,h=this.rect.height,left=Number.isFinite(parseFloat(this.style.left))?parseFloat(this.style.left):this.rect.left,top=Number.isFinite(parseFloat(this.style.top))?parseFloat(this.style.top):this.rect.top;return {left,top,width:w,height:h,right:left+w,bottom:top+h};}
  setAttribute(k,v){this.attrs[k]=String(v);}getAttribute(k){return Object.prototype.hasOwnProperty.call(this.attrs,k)?this.attrs[k]:null;}
}
function pointerEvt(pointerId,clientX,clientY,target=canvasTarget,pointerType='touch'){return {pointerId,clientX,clientY,pointerType,target,button:0,cancelable:true,preventDefault(){this.defaultPrevented=true;},stopPropagation(){this.propagationStopped=true;}};}
function emitWindow(type,event){for(const fn of [...(windowListeners.get(type)||[])])fn(event);}
function center(r){return {x:r.left+r.width/2,y:r.top+r.height/2};}
function closeHeading(a,b){return Math.abs(Math.atan2(Math.sin(a-b),Math.cos(a-b)))<1e-9;}
const phase125Passed=new Set();function accept(n,condition,message){assert(condition,'Phase 1.2.5 acceptance '+n+': '+message);phase125Passed.add(n);}

const canvasTarget={tagName:'CANVAS',id:'fl44-battlefield',className:'',parentElement:null};
const rootRect={left:0,top:0,width:900,height:420};
const driveEl=new FakeControlTarget({left:14,top:312,width:96,height:96},'fl44-stick','DIV','fl44-stick'),driveKnob={style:{}},aimEl=new FakeControlTarget({left:700,top:326,width:82,height:82},'fl44-aim-stick','DIV','fl44-aim-stick'),aimKnob={style:{}},fireEl=new FakeControlTarget({left:818,top:330,width:68,height:68},'fl44-fire','BUTTON','fl44-fire'),diagEl=new FakeControlTarget({left:230,top:61,width:430,height:106},'fl44-input-diag','PRE','fl44-input-diag');diagEl.textContent='';
const topEl=new FakeControlTarget({left:7,top:5,width:886,height:54},'','DIV','fl44-top'),objectiveEl=new FakeControlTarget({left:715,top:63,width:178,height:82},'fl44-objective','DIV','fl44-objective'),bossEl=new FakeControlTarget({left:250,top:61,width:400,height:44},'fl44-boss','DIV','fl44-boss');bossEl.hidden=true;const stateEl=new FakeControlTarget({left:350,top:390,width:200,height:26},'fl44-state','DIV','fl44-state'),exitEl=new FakeControlTarget({left:824,top:375,width:69,height:40},'fl44-exit','BUTTON','fl44-exit');
const root={getBoundingClientRect(){return {...rootRect,right:rootRect.left+rootRect.width,bottom:rootRect.top+rootRect.height};},querySelector(sel){return ({'#fl44-stick':driveEl,'.fl44-knob':driveKnob,'#fl44-aim-stick':aimEl,'.fl44-aim-knob':aimKnob,'#fl44-fire':fireEl,'#fl44-input-diag':diagEl,'.fl44-top':topEl,'.fl44-objective':objectiveEl,'.fl44-boss':bossEl,'.fl44-state':stateEl,'#fl44-exit':exitEl})[sel]||null;}};
for(const el of [driveEl,aimEl,fireEl,diagEl,topEl,objectiveEl,bossEl,stateEl,exitEl,canvasTarget])el.parentElement=root;
G.root=root;G.joy={x:0,y:0,id:null,active:false,transport:'idle',lastTransport:'none',captured:false,moves:0,lastEventAt:0};G.aim={x:0,y:0,id:null,active:false,transport:'idle',lastTransport:'none',captured:false,moves:0,lastEventAt:0};G.firing=false;G.pointerAim=null;G.lastTouchLikeInputAt=0;clearMobileAimLatch();
sb.navigator.maxTouchPoints=1;sb.matchMedia=()=>({matches:true});G.mobileRouter=bindGlobalMobileTouchRouter();assert(G.mobileRouter instanceof GlobalMobileTouchRouter,'one global mobile touch router owns DRIVE/AIM/FIRE');
function regions(){return mobileControlRegions(root,driveEl,aimEl,fireEl);}function begin(id,x,y,type='touch'){emitWindow('pointerdown',pointerEvt(id,x,y,canvasTarget,type));}function movePointer(id,x,y,type='touch'){emitWindow('pointermove',pointerEvt(id,x,y,canvasTarget,type));}function endPointer(id,x,y,type='touch'){emitWindow('pointerup',pointerEvt(id,x,y,canvasTarget,type));}function mobileCmd(){return new MobileTankInputAdapter().sample();}
function fakeRuntimeTank(x=0,z=40,h=0){return {world:{x,z},speed:0,hullRotation:h,turretRotation:h,turretTargetRotation:h,footprint:{halfWidth:CFG.tankFootprintHalfWidth,halfLength:CFG.tankFootprintHalfLength},group:{position:{set(x,y,z){this.x=x;this.y=y;this.z=z;}},updateMatrixWorld(){}},hull:{rotation:{y:0}},turret:{rotation:{y:0}},damageStatistic:{match:0,lifetime:0},playerId:'p',displayName:'P',hp:100,maxHp:100,activeWeapon:'main',fireEvent:0,visualUpgradeTier:0,hullVisualTier:0,armorTier:0,engineTier:0,turretTier:0,mainWeaponId:'main',specialWeaponId:'',skinId:'default'};}

// 1-7: the proven DRIVE routing remains intact; only its gesture origin floats.
let R=regions(),d=center(R.drive);begin(101,d.x,d.y);movePointer(101,d.x,d.y-70);let cmd=mobileCmd();accept(1,cmd.throttle>.9&&Math.abs(cmd.steering)<.08,'mobile DRIVE forward still passes');let rtTerrain=new TerrainSystem(),rt=new TankRuntime(fakeRuntimeTank(),new CollisionSystem(rtTerrain),rtTerrain),z0=rt.z;for(let i=0;i<60;i++)rt.step(cmd,1/60);assert(rt.z<z0-1,'forward command reaches TankRuntime');emitWindow('lostpointercapture',pointerEvt(101,d.x,d.y-70));movePointer(101,d.x,d.y-180);accept(6,G.joy.active&&G.joy.id===101&&mobileCmd().throttle>.9,'DRIVE pointer ownership continues outside visual joystick');endPointer(101,d.x,d.y-180);accept(7,!G.joy.active&&G.joy.id===null&&mobileCmd().throttle===0,'DRIVE release stops throttle');
R=regions();d={x:R.drive.left+R.drive.width*.38,y:R.drive.top+R.drive.height*.55};begin(102,d.x,d.y);movePointer(102,d.x,d.y+70);cmd=mobileCmd();accept(2,cmd.throttle<-.9,'mobile DRIVE reverse still passes');endPointer(102,d.x,d.y+70);
R=regions();d=center(R.drive);begin(103,d.x,d.y);movePointer(103,d.x-70,d.y);let leftCmd=mobileCmd();endPointer(103,d.x-70,d.y);R=regions();d=center(R.drive);begin(104,d.x,d.y);movePointer(104,d.x+70,d.y);let rightCmd=mobileCmd();endPointer(104,d.x+70,d.y);accept(3,leftCmd.steering<-.9&&rightCmd.steering>.9,'mobile DRIVE left/right steering still passes');
R=regions();d=center(R.drive);begin(105,d.x,d.y);movePointer(105,d.x+60,d.y-60);const diagCmd=mobileCmd();const diagTerrain=new TerrainSystem(),diagRuntime=new TankRuntime(fakeRuntimeTank(),new CollisionSystem(diagTerrain),diagTerrain);for(let i=0;i<45;i++)diagRuntime.step(diagCmd,1/60);accept(4,diagCmd.throttle>.6&&diagCmd.steering>.6&&Math.abs(diagRuntime.heading)>.05,'diagonal DRIVE still passes');accept(5,Math.abs(diagRuntime.lastMotion.lateralVelocity)<1e-8,'zero strafe still passes');endPointer(105,d.x+60,d.y-60);

// 8-14: AIM gets a persistent world-heading latch that survives pointer release and blocks stale desktop takeover.
G.camera=null;R=regions();let aimPt=center(R.aim);begin(201,aimPt.x,aimPt.y);accept(8,G.aim.active&&G.aim.id===201,'AIM pointer acquisition works');movePointer(201,aimPt.x-65,aimPt.y+18);let activeAim=mobileCmd(),firstLatched=mobileAimLatchedHeading();accept(9,activeAim.turretTargetHeading!=null&&firstLatched!=null,'AIM drag updates turret target heading');endPointer(201,aimPt.x-65,aimPt.y+18);const releasedHeading=mobileAimLatchedHeading(),releasedMobile=mobileCmd();accept(10,!G.aim.active&&releasedHeading!=null&&closeHeading(releasedMobile.turretTargetHeading,releasedHeading),'AIM release preserves final turret heading');const upRightHeading=rotationFromForward(1,1);accept(11,!closeHeading(releasedHeading,upRightHeading),'AIM release does not return to Up-Right');
const staleDesktopHeading=desktopCommandFromState(new Set(),{x:100,z:100},{x:0,z:0},false).turretTargetHeading,unifiedAfterRelease=mergeTankCommands({turretTargetHeading:staleDesktopHeading,source:'desktop'},releasedMobile,false,true);accept(12,closeHeading(unifiedAfterRelease.turretTargetHeading,releasedHeading)&&!closeHeading(unifiedAfterRelease.turretTargetHeading,staleDesktopHeading),'stale desktop pointer aim cannot replace latched mobile heading');markTouchLikeInput();accept(13,shouldAcceptDesktopAimEvent({pointerType:'mouse'})===false,'touch-generated compatibility mouse events cannot steal AIM authority');
R=regions();aimPt={x:R.aim.left+R.aim.width*.68,y:R.aim.top+R.aim.height*.58};begin(202,aimPt.x,aimPt.y);movePointer(202,aimPt.x+58,aimPt.y-28);const secondLatched=mobileAimLatchedHeading();endPointer(202,aimPt.x+58,aimPt.y-28);accept(14,secondLatched!=null&&!closeHeading(firstLatched,secondLatched),'new AIM gesture updates previously latched heading');

// 15-18: each control can reacquire at a comfortable thumb position but never over critical UI.
R=regions();const d1={x:R.drive.left+R.drive.width*.28,y:R.drive.top+R.drive.height*.64};begin(301,d1.x,d1.y);const driveLeft1=parseFloat(driveEl.style.left);endPointer(301,d1.x,d1.y);R=regions();const d2={x:R.drive.left+R.drive.width*.70,y:R.drive.top+R.drive.height*.72};begin(302,d2.x,d2.y);const driveLeft2=parseFloat(driveEl.style.left);endPointer(302,d2.x,d2.y);accept(15,Number.isFinite(driveLeft1)&&Number.isFinite(driveLeft2)&&Math.abs(driveLeft2-driveLeft1)>20,'floating DRIVE center can be acquired at a new valid position');
R=regions();const a1={x:R.aim.left+R.aim.width*.30,y:R.aim.top+R.aim.height*.64};begin(303,a1.x,a1.y);const aimLeft1=parseFloat(aimEl.style.left);endPointer(303,a1.x,a1.y);R=regions();const a2={x:R.aim.left+R.aim.width*.68,y:R.aim.top+R.aim.height*.72};begin(304,a2.x,a2.y);const aimLeft2=parseFloat(aimEl.style.left);endPointer(304,a2.x,a2.y);accept(16,Number.isFinite(aimLeft1)&&Number.isFinite(aimLeft2)&&Math.abs(aimLeft2-aimLeft1)>20,'floating AIM center can be acquired at a new valid position');
R=regions();let firePt=center(R.fire);begin(305,firePt.x,firePt.y);accept(17,G.firing&&G.mobileRouter.rolePointers.fire===305&&Number.isFinite(parseFloat(fireEl.style.left)),'FIRE activates from its permitted dynamic region and recenters');endPointer(305,firePt.x,firePt.y);
accept(18,G.mobileRouter.roleAt(850,395)===null&&G.mobileRouter.roleAt(450,30)===null&&G.mobileRouter.roleAt(790,100)===null,'floating controls do not capture Exit / HUD-Target Word / Objective touches');

// 19-23: separate pointer IDs remain truly independent for simultaneous actions.
R=regions();d=center(R.drive);firePt=center(R.fire);begin(401,d.x,d.y);movePointer(401,d.x,d.y-60);begin(402,firePt.x,firePt.y);accept(19,G.joy.active&&G.firing&&G.mobileRouter.activeCount()===2,'DRIVE + FIRE multi-touch');endPointer(401,d.x,d.y-60);endPointer(402,firePt.x,firePt.y);
R=regions();d=center(R.drive);aimPt=center(R.aim);begin(403,d.x,d.y);movePointer(403,d.x,d.y-55);begin(404,aimPt.x,aimPt.y);movePointer(404,aimPt.x-50,aimPt.y);accept(20,G.joy.active&&G.aim.active&&G.mobileRouter.activeCount()===2,'DRIVE + AIM multi-touch');endPointer(403,d.x,d.y-55);endPointer(404,aimPt.x-50,aimPt.y);
R=regions();aimPt=center(R.aim);firePt=center(R.fire);begin(405,aimPt.x,aimPt.y);movePointer(405,aimPt.x+45,aimPt.y);begin(406,firePt.x,firePt.y);accept(21,G.aim.active&&G.firing&&G.mobileRouter.activeCount()===2,'AIM + FIRE multi-touch');endPointer(405,aimPt.x+45,aimPt.y);endPointer(406,firePt.x,firePt.y);
R=regions();d=center(R.drive);aimPt=center(R.aim);firePt=center(R.fire);begin(407,d.x,d.y);movePointer(407,d.x,d.y-55);begin(408,aimPt.x,aimPt.y);movePointer(408,aimPt.x-45,aimPt.y);begin(409,firePt.x,firePt.y);accept(22,G.joy.active&&G.aim.active&&G.firing&&G.mobileRouter.activeCount()===3,'DRIVE + AIM + FIRE multi-touch');const allAimLatch=mobileAimLatchedHeading();endPointer(408,aimPt.x-45,aimPt.y);accept(23,G.joy.active&&G.firing&&!G.aim.active&&G.mobileRouter.activeCount()===2&&closeHeading(mobileAimLatchedHeading(),allAimLatch),'releasing one pointer does not reset the other controls or AIM latch');endPointer(407,d.x,d.y-55);endPointer(409,firePt.x,firePt.y);

// 24-30: desktop/tank/projectile/collision/sector locks remain identical.
const desktopLocked=desktopCommandFromState(new Set(['ArrowUp','ArrowRight']),null,{x:0,z:0},false);accept(24,desktopLocked.throttle===1&&desktopLocked.steering===1,'desktop keyboard movement unchanged');G.lastTouchLikeInputAt=0;accept(25,shouldAcceptDesktopAimEvent({pointerType:'mouse'})===true&&desktopCommandFromState(new Set(),{x:0,z:-20},{x:0,z:0},false).turretTargetHeading!=null,'desktop mouse aim unchanged');accept(26,typeof UnifiedTankInputAdapter==='function'&&typeof TankRuntime==='function'&&code.includes('this.desktop.sample(runtime),m=this.mobile.sample(runtime)'),'desktop/mobile still feed the SAME TankRuntime');
class TestVec3Phase125{constructor(){this.x=0;this.y=0;this.z=0;}}sb.THREE={Vector3:TestVec3Phase125};const muzzleTank125={group:{updateMatrixWorld(){}},cannonTip:{getWorldPosition(v){v.x=8;v.y=3;v.z=-12;}},barrel:{getWorldPosition(v){v.x=5;v.y=3;v.z=-8;}},turretRotation:0,world:{x:0,z:0}},ray125=cannonWorldRay(muzzleTank125),rayLen125=Math.hypot(3,-4);accept(27,Math.abs(ray125.direction.x-3/rayLen125)<1e-12&&Math.abs(ray125.direction.z+4/rayLen125)<1e-12,'projectile remains barrel/muzzle aligned');
let canonical360=true;for(let deg=0;deg<360;deg++){const h=deg*Math.PI/180,fwd=forwardFromRotation(h),visual=visualLocalMinusZAfterYaw(h),rev=driveDelta(h,-1,1);if(Math.abs(fwd.x-visual.x)>1e-10||Math.abs(fwd.z-visual.z)>1e-10||rev.x*visual.x+rev.z*visual.z>=0){canonical360=false;break;}}accept(28,canonical360,'canonical 360-degree forward/reverse tests remain PASS');accept(29,collision.hitSolid(45,40,1.5).blocked&&!collision.hitSolid(0,0,1.5).blocked,'collision tests remain PASS');
const sectorTerrain125=new TerrainSystem(),sectorRuntime125=new TankRuntime(fakeRuntimeTank(0,70,.35),new CollisionSystem(sectorTerrain125),sectorTerrain125),sectorHeading125=sectorRuntime125.heading,startSector125=WorldSpace.sectorIndexAtZ(sectorRuntime125.z);for(let i=0;i<600;i++)sectorRuntime125.step({throttle:1,steering:0},1/60);accept(30,WorldSpace.sectorIndexAtZ(sectorRuntime125.z)!==startSector125&&Math.abs(sectorRuntime125.heading-sectorHeading125)<1e-12,'sector-transition heading stability remains PASS');

// 31-32: diagnostics are hidden on ordinary desktop but retained for coarse/mobile Admin Preview.
sb.navigator.maxTouchPoints=0;sb.matchMedia=()=>({matches:false});updateInputDiagnostics();accept(31,diagEl.hidden===true&&diagEl.textContent===''&&diagEl.getAttribute('aria-hidden')==='true','normal desktop mode does NOT display diagnostic overlay');sb.navigator.maxTouchPoints=1;sb.matchMedia=()=>({matches:true});updateInputDiagnostics(G.mobileRouter.snapshot());accept(32,diagEl.hidden===false&&diagEl.textContent.includes('INPUT:')&&diagEl.getAttribute('aria-hidden')==='false','mobile/admin diagnostic mode can still display diagnostics');
assert.strictEqual(phase125Passed.size,32,'all 32 deterministic Phase 1.2.5 acceptance checks ran');

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



assert(code.includes("kind:'tank',phase:'1.2.5'")&&code.includes('__VW_FRONTLINE1944_RUNTIME__'),'loaded Frontline runtime publishes the Phase 1.2.5 authoritative tank-runtime identity marker');



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







// Vocabulary source audit still uses the real current shared data when that dependency exists in the full project.
if(f1){
  const vb={console,state:{student:{grade:'ป.1'}}};vb.window=vb;vm.createContext(vb);vm.runInContext(f1,vb);
  assert.strictEqual(typeof vb.f1VocabForStudent,'function','authoritative shooter vocabulary provider exists');
  const grades=['ป.1','ป.2','ป.3','ป.4','ป.5','ป.6'],counts={};
  for(const grade of grades){vb.state.student.grade=grade;const raw=vb.f1VocabForStudent()||[];const words=raw.map(x=>Array.isArray(x)?x[0]:x&&(x.en||x.word||x.eng||x.english)).filter(Boolean).map(x=>String(x).trim().toUpperCase());counts[grade]={count:words.length,unique:new Set(words).size};assert(words.length>0,grade+' vocabulary source must not be empty');assert.strictEqual(counts[grade].count,counts[grade].unique,grade+' vocabulary must not duplicate English targets in the shooter pool');}
  console.log('Frontline vocabulary audit P.1-P.6:',JSON.stringify(counts));
}else console.log('SKIP vocabulary audit in isolated Task ZIP: '+f1Path+' was not supplied; full-project run must execute it.');
console.log('PASS Frontline 1944 Phase 1.2.5: all 32 deterministic acceptance checks pass; AIM release is latched, controls float within safe zones, diagnostics are gated, and the canonical desktop/tank runtime remains locked');
