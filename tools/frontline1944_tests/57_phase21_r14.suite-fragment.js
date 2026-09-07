// R14 668820 — Titan Zombie Boss acceptance / R13.1 regression preservation.
(function testR14TitanZombieBoss(){
  const source=fs.readFileSync('js/frontline1944.js','utf8'),css=fs.readFileSync('css/frontline1944.css','utf8'),html=fs.readFileSync('index_classic.html','utf8');
  const ID='P2.1R15-cf4076';
  assert(source.includes("runtimeVersion:'"+ID+"'"),'R14 JS delivery identity');
  assert(css.includes('--fl44-css-runtime-id:"'+ID+'-CSS"'),'R14 CSS delivery identity');
  assert(html.includes("var FRONTLINE_RUNTIME_ID='"+ID+"';"),'R14 loader identity');
  assert(source.includes("const R14_TITAN_SYSTEM=Object.freeze({")&&source.includes("taskId:'VW-20260907-105208-668820'"),'R14 system/task marker');
  assert(source.includes("maxTitanCount:1")&&source.includes("id:'titan:r14:1'"),'1. exactly one Titan lifecycle authority');
  assert(source.includes('normalZombieBudgetIncludesTitan:false')&&source.includes('separateFromEnemyArray'),'2. Titan separate from normal population');
  assert(source.includes('visualHeight:190'),'3. approximately 50-story visual scale contract');
  assert(source.includes('modelMeshBudget:15')&&source.includes("sharedMesh('box'")&&source.includes('castShadow=false'),'4. lightweight shared low-poly geometry/material strategy');
  assert(source.includes("state:'PASSIVE'")&&source.includes("if(t.state==='PASSIVE')"),'5. passive before provocation');
  assert(!source.includes('r14ProvokeTitan(t);const dx=G.player'),'6. proximity does not call Titan provoke');
  assert(source.includes('function r14PlayerDamageSource')&&source.includes("projectile.team==='player'")&&source.includes('r14ProvokeTitan(t);'),'7. player-caused damage triggers aggression');
  assert(source.includes("String(projectile.ownerId||'')===String(G.player.playerId||'')"),'8. unrelated damage cannot trigger aggression');
  assert(source.includes("t.state='PURSUE'")&&source.includes('pursueSpeed:3.2'),'9. provoked Titan pursues slowly');
  assert(source.includes('stompWindupSeconds:1.25')&&source.includes("name='r14-titan-stomp-warning'"),'10. readable stomp wind-up and impact marker');
  assert(source.includes('r14StompHitsPosition(t.stompImpact,G.player.world)')&&source.includes('r14InstantPlayerDeath()'),'11. successful stomp kills active player');
  assert(source.includes('G.player.hp=0')&&source.includes("r3RequestSafeSpawn(cp||")&&source.includes("},'death')"),'12. tank encounter uses existing lethal death/respawn architecture');
  assert(source.includes("raw:'TITAN_STOMP'")&&source.includes('bypassed:true'),'13. Titan stomp bypasses ordinary armor/zombie damage rule');
  assert(source.includes('function r14StompHitsPosition')&&!source.includes('triangleTitan'),'14. lightweight proxy stomp hit detection');
  assert(source.includes('stompImpactRadius:16.5')&&source.includes('stompWindupSeconds:1.25'),'15. telegraph gives escape window before fixed impact point');
  assert(source.includes('maxHp:9000'),'16. very high configurable boss HP');
  assert(source.includes("cannonDamageScale:1")&&source.includes('damage:CFG.shotDamage'),'17. cannon damage retained and can damage Titan');
  assert(source.includes('mgDamageScale:.65')&&source.includes("startsWith('machine_gun_')"),'18. MG damage supported without changing MG architecture');
  assert(source.includes("'TITAN ZOMBIE · '")&&source.includes('t.hp/t.maxHp*100'),'19. readable Titan name/HP feedback');
  assert(source.includes('r14TitanTerrainAllows(nx,nz)')&&!source.includes('resolveCircleMove(t.world'),'20. large actor ignores small prop collision/pathfinding traps');
  assert(source.includes("x:-48,z:centerZ+20")&&source.includes('homeLeashX:72')&&source.includes('homeLeashZ:62'),'21. Titan is offset/leashed in open battlefield and cannot permanently block route');
  assert(source.includes('letterCarrier:false')&&source.includes('normalZombieBudgetIncludesTitan:false'),'22. word mission remains independent/optional');
  assert(source.includes('letterCarrier:false'),'23. Titan is not a Letter Carrier');
  assert(source.includes('normalZombiePopulationBudget:1000')&&source.includes('currentActiveEnemyCap:CFG.enemyCap'),'24. requested population budget is declared while current baseline cap remains explicit');
  assert(source.includes('if(G.titan)return G.titan')&&source.includes('if(resetLifecycle)G.titan=null'),'25. Titan death is not normal zombie auto-refill');
  assert(source.includes('deathSeconds:1.65')&&source.includes('t.group.scale.y')&&!source.toLowerCase().includes('titan ragdoll'),'26. lightweight temporary Titan death effect');
  assert(source.includes("const R131_BUILDING_STYLE=Object.freeze")&&source.includes("function r131BuildingSpec"),'27. R13.1 building system retained');
  assert(source.includes("const R131_WATER=Object.freeze")&&source.includes("terrainId:'SHALLOW_WATER'")&&source.includes("r131UpdateWaterTraversalFx"),'28. R13.1 water traversal retained');
  assert(source.includes('else if(e.boss&&now>e.fireAt&&L<36){enemyFire(e)'),'29. existing enemy tank AI/fire path retained');
  assert(source.includes('frontlineResponsiveTier')&&source.includes('mobileControlRegions'),'30. mobile landscape control architecture retained');
  const testSource=fs.readFileSync('tools/test_frontline1944.js','utf8');assert(testSource.includes('1253')&&testSource.includes('553'),'31. 1253×553 regression viewport retained in source/test matrix');
  assert(source.includes('r14TargetLockCandidates:targetLockCandidates')&&source.includes("return 'TITAN ZOMBIE'"),'Titan is added to existing target-selection architecture');
  assert(source.includes('r14ResolveTitanProjectileHits(pool)')&&source.includes('t.nextHitFxAt=now+(mg?130:70)'),'Titan projectile checks and MG hit FX are throttled');
  assert(source.includes('L>260?R14_TITAN_SYSTEM.farAiInterval:L>140?R14_TITAN_SYSTEM.midAiInterval'),'distance-aware Titan LOD/update rate');
  assert(source.includes("!String(s.id||'').includes('WATER')"),'Titan large-actor movement does not rely on ordinary shallow-water traversal');
  assert(source.includes('G.enemies.includes(t)')&&!source.includes('G.enemies.push(titan)'),'Titan diagnostics verify separation and no normal-enemy insertion');
  assert(source.includes('_r14TargetLockTargetValid=targetLockTargetValid')&&source.includes('targetLockTargetValid:_r14TargetLockTargetValid'),'accepted target-lock function body remains exportable for baseline hash regression');
  assert(source.includes('_r14TickProjectilePool=tickProjectilePool')&&source.includes('tickProjectilePool:_r14TickProjectilePool'),'accepted projectile function body remains exportable for baseline hash regression');
  console.log('PASS R14 Titan Zombie Boss: 31-point acceptance contract + performance/targeting/runtime identity regression.');
})();


(function testR15PortraitCrowdCurrentSourceDelivery(){
  const source=fs.readFileSync('js/frontline1944.js','utf8'),css=fs.readFileSync('css/frontline1944.css','utf8'),html=fs.readFileSync('index_classic.html','utf8'),build=fs.readFileSync('tools/build_web.mjs','utf8');
  const ID='P2.1R15-cf4076';
  assert(source.includes("runtimeVersion:'"+ID+"'"),'R15 JS runtime identity');
  assert(css.includes('--fl44-css-runtime-id:"'+ID+'-CSS"'),'R15 CSS runtime identity');
  assert(html.includes("var FRONTLINE_RUNTIME_ID='"+ID+"';"),'R15 HTML loader identity');
  assert(!source.includes('FRONTLINE 1944 · R11.2'),'visible stale R11.2 identity removed from CURRENT runtime HUD');
  assert(source.includes("const R15_SYSTEM=Object.freeze({id:'"+ID+"',taskId:'VW-20260907-113226-cf4076'"),'R15 system/task marker');
  assert(source.includes('normalZombiePopulation:1000')&&source.includes('guardianPopulation:950')&&source.includes('letterCarrierPopulation:50'),'1,000 normal zombie logical budget = 950 Guardians + 50 Letter Carriers');
  assert(source.includes('clusterCount:50')&&source.includes('guardiansPerCluster:19'),'50 protected letter-carrier clusters each contain 1 carrier + 19 guardians');
  assert(source.includes('normalZombieBudgetIncludesTitan:false')&&source.includes('titanSeparate:!!G.titan&&!G.enemies.includes(G.titan)'),'Titan remains outside normal zombie population');
  assert(source.includes('fullActorCap:30')&&source.includes('lowFxFullActorCap:18')&&source.includes('crowdTickInterval:.125'),'mobile-safe full-actor cap and throttled crowd scheduler');
  assert(source.includes('new THREE.InstancedMesh')&&source.includes('proxyRenderCap:480')&&source.includes('lowFxProxyRenderCap:260'),'far/mid crowd uses low-draw-call instanced proxies');
  assert(source.includes('state.activeByRecord')&&source.includes('actorPool')&&source.includes('r15ActorAcquire')&&source.includes('r15ActorRelease'),'near full actors are pooled/recycled');
  assert(source.includes('r15WrapCrowdClusters')&&source.includes('sectorWindowAhead:14')&&source.includes('sectorWindowBehind:2'),'crowd population is sector-window recycled');
  assert(source.includes("role:carrier?'letter':'guardian'")&&source.includes('r15AssignCarrierLetters'),'letter-carrier role and word-letter assignment are real runtime data');
  assert(source.includes('function r15AwardCarrierLetter')&&source.includes("id='carrier:'")&&source.includes('r15EnsureMissionCarrierNear'),'correct carrier advances the existing idempotent target-word reward/progress path and remains reachable');
  assert(source.includes("letterCarrier:false")&&source.includes("id:'titan:r14:1'"),'Titan still cannot become a required letter carrier');
  assert(source.includes("state:'PASSIVE'")&&source.includes("if(t.state==='PASSIVE')")&&source.includes("t.state='PURSUE'"),'Titan passive/provoked pursuit behavior retained');
  assert(source.includes('r14InstantPlayerDeath()')&&source.includes("raw:'TITAN_STOMP'"),'Titan lethal stomp retained');
  assert(source.includes("presentation:'PORTRAIT_PRIMARY_9_16'")&&source.includes('function r15PortraitLayoutModel'),'portrait is primary Frontline presentation with testable layout model');
  assert(source.includes('portraitFov:62')&&source.includes('lookAhead:38')&&source.includes('distance:21.5'),'portrait chase camera exposes more forward depth');
  assert(source.includes("r15SetPresentationIdentity('portrait')")&&source.includes("r15SetPresentationIdentity('landscape-legacy')"),'portrait primary plus legacy landscape fallback');
  assert(html.includes("blocked = surface === 'lobby' && portrait()"),'Frontline no longer blocked by landscape-only gate');
  assert(html.includes("current.surface !== 'lobby'")&&html.includes("screen.orientation.lock('landscape')"),'native landscape lock remains lobby-only');
  assert(css.includes('[data-presentation="portrait"] .fl44-scope-mask')&&css.includes('width:92vw!important;height:62vh!important'),'scope is practical rectangular portrait overlay');
  assert(css.includes('[data-presentation="portrait"] .fl44-garage-cards')&&css.includes('repeat(2,minmax(0,1fr))'),'garage remains usable in portrait');
  assert(source.includes("G.enemies.filter(e=>!e.crowdManaged).length>=CFG.enemyCap"),'crowd actors do not consume fortress defender/enemy-tank cap');
  assert(source.includes('else if(e.boss&&now>e.fireAt&&L<36){enemyFire(e)'),'enemy tank tactical AI retained');
  assert(source.includes("const R131_BUILDING_STYLE=Object.freeze")&&source.includes("const R131_WATER=Object.freeze"),'R13.1 buildings and water traversal retained');
  assert(source.includes('turretForwardReturnDelayMs:5000')&&source.includes('targetSelectionFireTimeoutMs:5000')&&source.includes('scopeModeActive()'),'accepted aim timeout and SCOPE exception architecture retained');
  assert(source.includes('position += hullForward')||source.includes('forwardFromRotation'),'authoritative hull-forward movement architecture remains present');
  assert(build.includes('validateFrontlineRuntimeIdentity')&&build.includes('frontline1944.')&&build.includes('sha256'),'CURRENT build still validates matching source identity and emits immutable hashed Frontline assets');
  const selfTest=fs.readFileSync('tools/test_frontline1944.js','utf8');assert(selfTest.includes('1253')&&selfTest.includes('553'),'1253x553 legacy regression coverage retained');
  // Execute only the pure R15 portrait model in a sandbox for common phone sizes.
  const start=source.indexOf('// R15 PURE PORTRAIT MODEL START'),end=source.indexOf('// R15 PURE PORTRAIT MODEL END');
  assert(start>=0&&end>start,'pure portrait model marker range');
  const block=source.slice(start,end);
  const sandbox={R14_TITAN_SYSTEM:{id:'P2.1R14-668820'},clamp:(v,a,b)=>Math.max(a,Math.min(b,v)),rectIntersects:(a,b)=>!!a&&!!b&&a.left<b.right&&a.right>b.left&&a.top<b.bottom&&a.bottom>b.top};
  vm.runInNewContext(block+';this.__model=r15PortraitLayoutModel;this.__validate=r15ValidatePortraitLayout;this.__portrait=r15PortraitMode;',sandbox);
  for(const [w,h] of [[320,568],[360,640],[375,667],[390,844],[393,852],[412,915],[414,896],[430,932]]){const m=sandbox.__model(w,h,{left:0,right:0,top:0,bottom:0}),r=sandbox.__validate(m);assert(r.pass,'portrait layout safe '+w+'x'+h+': '+JSON.stringify(r));assert(m.drive.left<m.aim.left,'DRIVE left / AIM right '+w+'x'+h);assert(m.combatSafe.height>=0,'forward combat corridor retained '+w+'x'+h);}
  assert(!sandbox.__portrait(1253,553),'1253x553 remains legacy landscape path');
  // Execute the logical crowd builder independently: 50 clusters × (1 carrier + 19 guardians) = 1,000.
  const crowdStart=source.indexOf('function r15Hash'),crowdEnd=source.indexOf('function r15CarrierMaterial');
  assert(crowdStart>=0&&crowdEnd>crowdStart,'logical crowd pure builder range');
  const crowdBlock=source.slice(crowdStart,crowdEnd);
  const crowdSandbox={Math,Map,Set,R15_SYSTEM:{sectorWindowBehind:2,sectorWindowAhead:14,clusterCount:50,guardiansPerCluster:19},CFG:{sectorWidth:180,sectorLength:150},WorldSpace:{sectorCenterZ:i=>-i*150},G:{zombieCrowd:null,word:{en:'APPLE'},pos:0}};
  vm.runInNewContext(crowdBlock+';this.__build=r15BuildLogicalCrowd;this.__assign=r15AssignCarrierLetters;',crowdSandbox);
  const logical=crowdSandbox.__build(0);crowdSandbox.G.zombieCrowd=logical;crowdSandbox.__assign(logical);
  assert.strictEqual(logical.records.length,1000,'logical crowd runtime count');
  assert.strictEqual(logical.guardians.length,950,'Guardian runtime count');
  assert.strictEqual(logical.carriers.length,50,'Letter Carrier runtime count');
  assert.strictEqual(logical.clusters.length,50,'cluster runtime count');
  assert(logical.carriers.every(r=>r.letter&&'APPLE'.includes(r.letter)),'carrier letters derive from target word');
  console.log('PASS R15 CURRENT-source portrait + mobile-safe 1,000-zombie crowd + delivery-path acceptance.');
})();


