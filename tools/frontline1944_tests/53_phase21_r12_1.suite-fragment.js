// R12.1 0a2900 — direct target selection / automatic 5-second hull-forward turret return / visible-range MG.
(function testR121DirectTargetForwardReturnAndMgRange(){
  const source=fs.readFileSync('js/frontline1944.js','utf8'),css=fs.readFileSync('css/frontline1944.css','utf8'),html=fs.readFileSync('index_classic.html','utf8');
  assert(source.includes("runtimeVersion:'P2.1R15-cf4076'"),'R12.1 JS delivery identity');
  assert(css.includes('--fl44-css-runtime-id:"P2.1R15-cf4076-CSS"'),'R12.1 CSS delivery identity');
  assert(html.includes("var FRONTLINE_RUNTIME_ID='P2.1R15-cf4076';"),'R12.1 loader identity');
  assert(!source.includes('id="fl44-target-lock"'),'TARGET LOCK button DOM is removed');
  assert(!source.includes('TARGET<br>LOCK'),'obsolete TARGET LOCK button label is removed');
  assert(!source.includes('FORWARD LOCK')&&!source.includes('fl44-forward-lock'),'no FORWARD LOCK button/mode is introduced');
  assert(source.includes('turretForwardReturnDelayMs:5000'),'automatic hull-forward return delay is exactly five seconds');
  assert(source.includes('onGameplayTapStart:(x,y,target,silentMiss)=>selectTargetLockAtScreen'),'world tap/click selection is wired through existing pointer ownership router');
  assert(source.includes("if(selectTargetLockAtScreen(e.clientX,e.clientY,false,e.target))"),'desktop click attempts direct target selection');
  assert(source.includes("if(G.environmentDestructibles)for(const rec of G.environmentDestructibles.values())"),'destructible gameplay objects participate in direct selection registry');
  assert(source.includes('rangeWorld=machineGunVisibleRangeWorld()')&&source.includes('lifetime:rangeWorld/spec.mgSpeed'),'MG visual projectile lifetime and gameplay range share visible-range authority');

  class V3{constructor(x=0,y=0,z=0){this.x=x;this.y=y;this.z=z;}set(x,y,z){this.x=x;this.y=y;this.z=z;return this;}copy(v){return this.set(v.x,v.y,v.z);}clone(){return new V3(this.x,this.y,this.z);}setScalar(v){this.x=this.y=this.z=v;return this;}project(){return this;}}
  class Gr{constructor(){this.children=[];this.parent=null;this.visible=true;this.userData={};this.position=new V3();this.rotation={x:0,y:0,z:0};this.scale={x:1,y:1,z:1,set(x,y,z){this.x=x;this.y=y;this.z=z;},setScalar(v){this.x=this.y=this.z=v;}};}add(o){this.children.push(o);o.parent=this;return this;}remove(o){this.children=this.children.filter(x=>x!==o);o.parent=null;return this;}updateMatrixWorld(){}}
  const doc={readyState:'loading',addEventListener(){},querySelector(){return null;},getElementById(){return null;},elementFromPoint(){return null;},documentElement:{style:{getPropertyValue(){return '0';}},dataset:{}},body:{dataset:{},appendChild(){}}};
  const state={coins:1000,frontline1944:{claims:[]}};
  const sb={console,document:doc,navigator:{maxTouchPoints:0},location:{hostname:'vocabworld.web.app',search:'',origin:'https://vocabworld.web.app'},Math,Date,URLSearchParams,innerWidth:1253,innerHeight:553,performance:{now:()=>1000},isAdmin:()=>true,state,addCoins(n){state.coins+=(Number(n)||0);},saveState(){},authPushSave(){},setTimeout(){return 1;},clearTimeout(){},setInterval(){return 1;},clearInterval(){},requestAnimationFrame(){return 1;},cancelAnimationFrame(){},queueMicrotask(fn){fn();},localStorage:{getItem(){return null;},setItem(){}},addEventListener(){},removeEventListener(){},getComputedStyle(){return {position:'absolute',left:'0px',top:'0px',right:'auto',bottom:'auto',transform:'none',getPropertyValue(){return '0';}}}};
  sb.window=sb;sb.THREE={Vector3:V3,Group:Gr};vm.createContext(sb);vm.runInContext(source,sb);const T=sb.Frontline1944._t,G=T.G;

  G.aim.active=false;G.aim.lastEventAt=0;G.lastDesktopAimAt=1000;G.mobileAimLatch={valid:false,heading:null,pitch:null,lastUpdateAt:0};G.specialControls={autoMove:0,targetLockMode:false,lockedTarget:null,scopeMode:false};
  assert.strictEqual(T.turretForwardReturnDue(5999),false,'turret holds the last manual aim during the five-second grace period');
  assert.strictEqual(T.turretForwardReturnDue(6000),true,'turret returns hull-forward at five seconds of aim inactivity');
  const before=T.normalizeTankCommand({turretTargetHeading:1.2,barrelTargetPitch:.18,source:'manual-test'}),pose={x:0,z:0,heading:.42,turretHeading:1.2,barrelPitch:.18};
  let cmd=T.defaultForwardTurretCommand(before,pose,5999);assert(Math.abs(cmd.turretTargetHeading-1.2)<1e-9,'before five seconds, manual turret heading is preserved');
  cmd=T.defaultForwardTurretCommand(before,pose,6000);assert(Math.abs(cmd.turretTargetHeading-pose.heading)<1e-9,'after five seconds, turret target equals authoritative hull heading');assert.strictEqual(cmd.barrelTargetPitch,0,'default return also restores neutral cannon pitch');assert(String(cmd.source).includes('forward-default'));
  G.aim.active=true;assert.strictEqual(T.turretForwardReturnDue(9000),false,'active AIM always owns the turret');G.aim.active=false;

  const enemyGroup=new Gr(),enemy={id:'enemy:r121',dead:false,hp:100,isZombie:false,group:enemyGroup,world:{x:12,z:-24}};G.enemies=[enemy];G.sectorStreamer=null;G.specialControls.lockedTarget={kind:'enemy',id:enemy.id,ref:enemy};
  cmd=T.defaultForwardTurretCommand(before,pose,9000);assert(Math.abs(cmd.turretTargetHeading-1.2)<1e-9,'a valid directly-selected target suppresses default forward return until the target ends');
  assert(Number.isFinite(T.targetLockHeading()),'selected target produces a stable authoritative tracking heading');
  enemy.hp=0;assert.strictEqual(T.targetLockHeading(),null,'HP-zero selected target clears safely');assert.strictEqual(G.specialControls.lockedTarget,null,'destroyed target reference is removed');

  const envNode=new Gr(),rec={id:'env:r121',kind:'house',mode:'structure',sectorIndex:0,x:6,z:-18,node:envNode,nodes:[envNode],destroyed:false};G.environmentDestructibles.clear();G.environmentDestructibles.set(rec.id,rec);const envTarget={kind:'environment',id:rec.id,ref:rec};
  assert.strictEqual(T.targetLockTargetValid(envTarget),true,'valid destructible environment object is directly selectable');const envWorld=T.targetLockWorld(envTarget);assert.strictEqual(envWorld.x,6);assert.strictEqual(envWorld.z,-18);assert.strictEqual(T.targetLockLabel(envTarget),'HOUSE');assert(T.targetLockCandidates().some(t=>t.id===rec.id),'destructible object is present in filtered target registry');rec.destroyed=true;assert.strictEqual(T.targetLockTargetValid(envTarget),false,'destroyed environment target becomes invalid immediately');

  G.camera={far:T.R2_VIEW.far};G.scene={fog:{far:345}};const visibleWorld=T.machineGunVisibleRangeWorld(),visibleMeters=T.machineGunVisibleRangeMeters();assert(visibleWorld>=T.R2_VIEW.far,'MG authoritative range covers normal camera far plane');assert(visibleMeters>=T.R2_VIEW.far*T.R7_ARSENAL.metersPerWorldUnit,'MG range covers full visible combat distance in meters');
  const expectedDamage=[3,3,4,4,5,5,6,6,7,8],expectedInterval=[150,140,132,122,112,102,94,86,78,70],expectedSpeed=[92,94,96,98,100,102,105,108,110,112];
  for(let level=1;level<=10;level++){
    const spec=T.tankUpgradeSpec(level);assert.strictEqual(spec.mgDamage,expectedDamage[level-1],`MG L${level} damage unchanged`);assert.strictEqual(spec.mgIntervalMs,expectedInterval[level-1],`MG L${level} fire interval unchanged`);assert.strictEqual(spec.mgSpeed,expectedSpeed[level-1],`MG L${level} projectile speed unchanged`);assert(visibleMeters>=spec.mgRangeMeters,`MG L${level} effective range no longer clips visible targets`);const concurrent=Math.ceil((visibleWorld/spec.mgSpeed)/(spec.mgIntervalMs/1000))+2;assert(T.CFG.mgProjectileCap>=concurrent,`MG L${level} pool cap covers visible-range projectile lifetime without rate loss`);
  }
  assert.strictEqual(T.CFG.mgProjectileCap,96,'bounded MG pool expansion is deterministic');
  console.log('PASS R12.1 direct target / 5-second hull-forward return / all-10-level visible-range MG regression.');
})();

