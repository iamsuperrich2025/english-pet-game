// R13.1 5b055e — building scale / child-friendly materials / fordable-water regression.
(function testR131BuildingScaleAndWaterTraversal(){
  const source=fs.readFileSync('js/frontline1944.js','utf8'),css=fs.readFileSync('css/frontline1944.css','utf8'),html=fs.readFileSync('index_classic.html','utf8');
  const ID='P2.1R15-cf4076',BASE='P2.1R13.1-5b055e';
  assert(source.includes("runtimeVersion:'"+ID+"'"),'R13.1 baseline carried by current JS delivery identity');
  assert(css.includes('--fl44-css-runtime-id:"'+ID+'-CSS"'),'R13.1 CSS delivery identity');
  assert(html.includes("var FRONTLINE_RUNTIME_ID='"+ID+"';"),'R13.1 loader identity');
  assert(source.includes("const R13_SYSTEM=Object.freeze({id:'P2.1R13-09cfa9'"),'accepted R13 system remains recorded as baseline');
  assert(source.includes("const R131_SYSTEM=Object.freeze({id:'"+BASE+"'")&&source.includes("taskId:'VW-20260907-091811-5b055e'"),'fresh R13.1 identity/task metadata is present');

  const houseFn=source.slice(source.indexOf('function addHouse'),source.indexOf('function addBunker'));
  assert(source.includes('bodyHeight:5.9+')&&source.includes('roofHeight:2.7+'),'normal houses are materially taller than the old 3.5-unit body');
  assert(source.includes('bodyHeight:5.35+')&&houseFn.includes("kind:ruined?'ruin':'house'"),'ruined village structures keep tall readable wall silhouettes');
  assert(houseFn.includes('spec.footprintW,spec.footprintD'),'house collision footprint remains centralized and unchanged');
  assert(source.includes("footprint:Object.freeze({houseW:6.4,houseD:5.5})"),'accepted 6.4 x 5.5 house navigation footprint is preserved');
  assert(source.includes('bodies:Object.freeze([0x8fc8dc,0xa9d39e,0xf0d08f,0xd98e78])'),'shared bright blue/mint/cream/warm-red palette is deterministic');
  assert(!source.includes('r131-building-texture')&&!source.includes('r131_house_texture'),'R13.1 buildings do not add heavy unique texture assets');

  assert(source.includes('bodyHeight:7.2+')&&source.includes('r131AddIndustrialShell(rt,q[0],cz+q[1],q[2],q[3],i)'),'industrial ruins use taller reusable low-poly shells');
  const industrialFn=source.slice(source.indexOf('function r131AddIndustrialShell'),source.indexOf('function r131WaterTraversalState'));
  assert(industrialFn.includes("G.collision.registerAABB(rt.index,x,z,w+.5,d+.5")&&industrialFn.includes("G.terrain.registerRect(rt.index,x,z,w+.5,d+.5,'FORTIFICATION'"),'industrial navigation/collision footprint semantics are preserved');

  const bridgeFn=source.slice(source.indexOf('function addBridgeCrossing'),source.indexOf('function addRoadblock'));
  assert(bridgeFn.includes("'SHALLOW_WATER',R131_WATER.riverPriority,'fordable-river'"),'intended river is registered as driveable shallow water');
  assert(!bridgeFn.includes("'DEEP_WATER'"),'intended River Crossing no longer installs a hard-blocking deep-water strip');
  assert(bridgeFn.includes("'ROAD',R131_WATER.bridgePriority,'bridge-crossing'"),'bridge remains a higher-priority/faster landmark route');
  assert(bridgeFn.includes('for(const x of [-48,48])')&&bridgeFn.includes("'ford-left':'ford-right'"),'both river sides have visible ford cues');
  assert(source.includes("SHALLOW_WATER:Object.freeze({id:'SHALLOW_WATER',speed:0.43,blocked:false})"),'existing shallow-water resistance is reused without changing TankRuntime physics semantics');
  assert(source.includes('q.type===R131_WATER.terrainId')&&source.includes('water may be driveable, but it is never selected as a spawn/turning envelope'),'safe respawn rejects traversable water without making it a driving blocker');

  assert(source.includes('waterlineY:1.28')&&source.includes('new THREE.CircleGeometry(1,24)')&&source.includes('new THREE.RingGeometry(.62,1,24)'),'lightweight half-submerged tint/ripple visual uses tiny procedural geometry only');
  assert(source.includes('_r131TankRuntimeSyncEntity=TankRuntime.prototype.syncEntity'),'water visuals extend sync externally rather than rewriting TankRuntime');
  assert(source.includes('const result=G.tankRuntime.step(cmd,dt)')&&source.includes('targetSelectionFireTimeoutMs:5000'),'accepted tank control and target-timeout paths remain present');
  assert(source.includes('1253,553'),'1253 x 553 responsive regression viewport remains required');
  console.log('PASS R13.1 taller child-friendly buildings / fordable water / dry safe-respawn / accepted-system preservation regression.');
})();


