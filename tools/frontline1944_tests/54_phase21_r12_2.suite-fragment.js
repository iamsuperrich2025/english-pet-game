// R12.2 54385a — EXIT top-right / same-target deselect / selected-target must-fire timer / SCOPE idle exception.
(function testR122ExitTargetTimerAndScopeException(){
  const source=fs.readFileSync('js/frontline1944.js','utf8'),css=fs.readFileSync('css/frontline1944.css','utf8'),html=fs.readFileSync('index_classic.html','utf8');
  const ID='P2.1R15-cf4076';
  assert(source.includes("runtimeVersion:'"+ID+"'"),'R12.2 JS delivery identity');
  assert(css.includes('--fl44-css-runtime-id:"'+ID+'-CSS"'),'R12.2 CSS delivery identity');
  assert(html.includes("var FRONTLINE_RUNTIME_ID='"+ID+"';"),'R12.2 loader identity');
  assert(source.includes('targetSelectionFireTimeoutMs:5000'),'selected-target must-fire timeout is exactly five seconds');
  assert(source.includes("if(targetLockSameTarget(s.lockedTarget,target))")&&source.includes("rememberTargetTapAction('deselect',x,y,now)"),'same selected target is a one-tap deselect');
  assert(source.includes("!targetLockLastTapWas('deselect',x,y)"),'same-target deselect is excluded from the existing double-tap FIRE bridge');
  assert(source.includes('if(s.scopeMode)holdCurrentTurretOrientation();else s.forceHullForward=true'),'target clear freezes SCOPE orientation but requests hull-forward outside SCOPE');
  assert(source.includes('if(!pose||s.scopeMode||(G.aim&&G.aim.active)'),'SCOPE suppresses automatic default hull-forward reorientation');
  assert(source.includes('G.fireEventSerial++;t.fireEvent=G.fireEventSerial;noteTargetLockCannonFire(now);'),'authoritative accepted main-cannon shot resets selected-target timer');
  const mgFn=source.slice(source.indexOf('function fireMachineGun'),source.indexOf('function tickMachineGun'));
  assert(!mgFn.includes('noteTargetLockCannonFire'),'MG does not satisfy the selected-target main-cannon timer');
  assert(css.includes('data-runtime-version="'+ID+'"] .fl44-exit')&&css.includes('bottom:auto!important'),'EXIT has authoritative top HUD fallback and no bottom-right reservation');

  class V3{constructor(x=0,y=0,z=0){this.x=x;this.y=y;this.z=z;}set(x,y,z){this.x=x;this.y=y;this.z=z;return this;}copy(v){return this.set(v.x,v.y,v.z);}clone(){return new V3(this.x,this.y,this.z);}setScalar(v){this.x=this.y=this.z=v;return this;}project(){return this;}}
  class Gr{constructor(){this.children=[];this.parent=null;this.visible=true;this.userData={};this.position=new V3();this.rotation={x:0,y:0,z:0};this.scale={x:1,y:1,z:1,set(x,y,z){this.x=x;this.y=y;this.z=z;},setScalar(v){this.x=this.y=this.z=v;}};}add(o){this.children.push(o);o.parent=this;return this;}remove(o){this.children=this.children.filter(x=>x!==o);o.parent=null;return this;}updateMatrixWorld(){}}
  const doc={readyState:'loading',addEventListener(){},querySelector(){return null;},getElementById(){return null;},elementFromPoint(){return null;},documentElement:{style:{getPropertyValue(){return '0';}},dataset:{}},body:{dataset:{},appendChild(){}}};
  let clock=1000;const state={coins:1000,frontline1944:{claims:[]}};
  const sb={console,document:doc,navigator:{maxTouchPoints:0},location:{hostname:'vocabworld.web.app',search:'',origin:'https://vocabworld.web.app'},Math,Date,URLSearchParams,innerWidth:1253,innerHeight:553,performance:{now:()=>clock},isAdmin:()=>true,state,addCoins(n){state.coins+=(Number(n)||0);},saveState(){},authPushSave(){},setTimeout(){return 1;},clearTimeout(){},setInterval(){return 1;},clearInterval(){},requestAnimationFrame(){return 1;},cancelAnimationFrame(){},queueMicrotask(fn){fn();},localStorage:{getItem(){return null;},setItem(){}},addEventListener(){},removeEventListener(){},getComputedStyle(){return {position:'absolute',left:'0px',top:'0px',right:'auto',bottom:'auto',transform:'none',getPropertyValue(){return '0';}}}};
  sb.window=sb;sb.THREE={Vector3:V3,Group:Gr};vm.createContext(sb);vm.runInContext(source,sb);const T=sb.Frontline1944._t,G=T.G;

  for(const [w,h] of T.R111_VIEWPORTS){const model=T.frontlineResponsiveLayoutModel(w,h);assert(model.report.pass,`R12.2 layout ${w}x${h}`);assert(model.rects.exit.top===model.rects.coins.top,`EXIT top-row aligned ${w}x${h}`);assert(model.rects.exit.right<=model.rects.coins.left-.5,`EXIT does not overlap MAIN COINS ${w}x${h}`);assert(model.rects.exit.bottom<model.safe.bottom-model.metrics.exitH,`EXIT is no longer bottom-right ${w}x${h}`);}
  const phone=T.frontlineResponsiveLayoutModel(1253,553);assert(phone.report.pass,'1253x553 R12.2 responsive HUD passes');assert(phone.rects.aim.right>phone.rects.exit.right,'bottom-right AIM space is no longer reserved by EXIT');

  const group=new Gr(),enemy={id:'enemy:r122',dead:false,hp:100,isZombie:false,group,world:{x:12,z:-24}};G.enemies=[enemy];G.sectorStreamer=null;G.aim.active=false;G.aim.lastEventAt=0;G.lastDesktopAimAt=0;G.mobileAimLatch={valid:false,heading:null,pitch:null,lastUpdateAt:0};
  const selected={kind:'enemy',id:enemy.id,ref:enemy};assert(T.targetLockSameTarget(selected,{kind:'enemy',id:enemy.id,ref:enemy}),'same target identity is stable');assert(!T.targetLockSameTarget(selected,{kind:'enemy',id:'enemy:other',ref:{}}),'different target is not treated as same');

  G.specialControls={autoMove:0,targetLockMode:false,lockedTarget:selected,scopeMode:false,targetSelectedAt:0,targetFireDeadlineAt:0,forceHullForward:false,lastTargetTapAction:null};
  assert.strictEqual(T.armTargetLockFireDeadline(1000),6000);assert.strictEqual(T.updateTargetLockIdleTimeout(5999),false);assert.strictEqual(G.specialControls.lockedTarget,selected,'target persists before 5 seconds');
  assert.strictEqual(T.updateTargetLockIdleTimeout(6000),true);assert.strictEqual(G.specialControls.lockedTarget,null,'target clears at five seconds without cannon fire');assert.strictEqual(G.specialControls.forceHullForward,true,'timeout requests hull-forward when SCOPE is off');
  let cmd=T.defaultForwardTurretCommand(T.normalizeTankCommand({turretTargetHeading:1.2,barrelTargetPitch:.15,source:'r122'}),{heading:.4,turretHeading:1.2,barrelPitch:.15},6000);assert(Math.abs(cmd.turretTargetHeading-.4)<1e-9,'timeout clear drives turret toward hull-forward outside SCOPE');

  G.specialControls.lockedTarget=selected;G.specialControls.forceHullForward=false;T.armTargetLockFireDeadline(1000);assert(T.noteTargetLockCannonFire(4000));assert.strictEqual(G.specialControls.targetFireDeadlineAt,9000,'accepted cannon fire resets five-second timer');assert.strictEqual(T.updateTargetLockIdleTimeout(6001),false);assert.strictEqual(G.specialControls.lockedTarget,selected,'selection persists after valid cannon fire');

  G.tankRuntime={turretTargetHeading:2,turretAngularVelocity:.7,barrelTargetPitch:.2,barrelPitchVelocity:.4,pose(){return {heading:.2,turretHeading:.85,barrelPitch:-.08};}};G.specialControls.scopeMode=true;G.specialControls.lockedTarget=selected;G.specialControls.forceHullForward=false;T.armTargetLockFireDeadline(1000);assert.strictEqual(T.updateTargetLockIdleTimeout(6000),true);assert.strictEqual(G.specialControls.lockedTarget,null,'SCOPE timeout still clears stale selected target');assert(Math.abs(G.tankRuntime.turretTargetHeading-.85)<1e-9&&G.tankRuntime.turretAngularVelocity===0,'SCOPE timeout freezes turret at current orientation');assert(Math.abs(G.tankRuntime.barrelTargetPitch+.08)<1e-9&&G.tankRuntime.barrelPitchVelocity===0,'SCOPE timeout freezes cannon pitch');assert.strictEqual(G.specialControls.forceHullForward,false,'SCOPE timeout never queues hull-forward');
  const before=T.normalizeTankCommand({turretTargetHeading:1.5,barrelTargetPitch:.18,source:'scope-test'});cmd=T.defaultForwardTurretCommand(before,{heading:.2,turretHeading:.85,barrelPitch:-.08},20000);assert(Math.abs(cmd.turretTargetHeading-1.5)<1e-9,'SCOPE suppresses idle automatic reorientation');

  T.rememberTargetTapAction('deselect',321,222,7000);assert(T.targetLockLastTapWas('deselect',321,222,7050),'same-target deselect gesture is recognizable by touch bridge');assert(!T.targetLockLastTapWas('deselect',325,222,7050),'unrelated tap is not suppressed');
  console.log('PASS R12.2 EXIT top-right / same-target deselect / 5-second selected-target timer / SCOPE idle exception.');
})();


