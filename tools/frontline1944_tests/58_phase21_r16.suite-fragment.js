// Phase 2.1 R16 e5aff4 regression checks — appended to the CURRENT suite; do not shrink historical coverage.
(function testFrontlineR16TurretScatterAndMirroredControls(){
  const fs=require('fs'),assert=require('assert'),vm=require('vm');
  const source=fs.readFileSync('js/frontline1944.js','utf8'),css=fs.readFileSync('css/frontline1944.css','utf8');
  const REV='P2.1R16-e5aff4',DELIVERY='P2.1R15-cf4076';
  assert(source.includes("const R16_SYSTEM=Object.freeze({id:'"+REV+"'"),'R16 system identity must exist');
  assert(source.includes("taskId:'VW-20260907-145537-e5aff4'"),'R16 task identity must match this Task');
  assert(source.includes('FRONTLINE 1944 · R16'),'visible runtime brand must advance to R16');
  assert(!source.includes('FRONTLINE 1944 · R15'),'visible runtime brand must not remain R15');
  assert(source.includes("runtimeVersion:'"+DELIVERY+"'"),'immutable index delivery handshake remains R15 in CFG');
  assert(source.includes('REVISION:R16_SYSTEM.id'),'runtime export must expose R16 revision');
  assert(css.includes('--fl44-feature-revision:"'+REV+'"'),'CSS must declare R16 feature revision');
  assert(css.includes('[data-runtime-version="'+REV+'"]'),'CSS must support R16 runtime dataset');

  assert(source.includes('normalZombiePopulation:1000')&&source.includes('guardianPopulation:950')&&source.includes('letterCarrierPopulation:50'),'conceptual 1000 / 950 / 50 population must remain');
  assert(source.includes('normalZombieBudgetIncludesTitan:false'),'Titan must remain outside normal zombie budget');
  assert(!source.includes('ring=carrier?0:4.2'),'fixed four-ring crowd layout must be removed');
  assert(source.includes('minSpacing2=10.5')&&source.includes('offsetX=(r15Hash')&&source.includes('offsetZ=(r15Hash'),'scatter must use irregular independent lateral/depth offsets');

  const start=source.indexOf('function r15Hash'),end=source.indexOf('function r15CarrierMaterial');
  assert(start>=0&&end>start,'R15 crowd pure block must remain extractable');
  const crowdCode=source.slice(start,end)+'\nthis.__crowd=r15BuildLogicalCrowd;';
  const crowdSandbox={Math,Map,Set,CFG:{sectorWidth:220,sectorLength:140},R15_SYSTEM:{id:'r15',sectorWindowBehind:2,sectorWindowAhead:14,clusterCount:50,guardiansPerCluster:19},WorldSpace:{sectorCenterZ:i=>-i*140},G:{zombieCrowd:null,word:{en:'APPLE'},pos:0}};
  vm.createContext(crowdSandbox);vm.runInContext(crowdCode,crowdSandbox);
  const crowd=crowdSandbox.__crowd(0);
  assert.strictEqual(crowd.records.length,1000,'R16 scatter must preserve 1000 normal zombies');
  assert.strictEqual(crowd.guardians.length,950,'R16 scatter must preserve 950 Guardians');
  assert.strictEqual(crowd.carriers.length,50,'R16 scatter must preserve 50 Letter Carriers');
  const xs=new Set(crowd.records.map(r=>r.offsetX.toFixed(3))),zs=new Set(crowd.records.map(r=>r.offsetZ.toFixed(3))),radii=new Set(crowd.records.map(r=>Math.hypot(r.offsetX,r.offsetZ).toFixed(2)));
  assert(xs.size>850&&zs.size>850&&radii.size>500,'scatter must not collapse into rows/columns/repeated rings');
  assert(crowd.carriers.filter(r=>Math.hypot(r.offsetX,r.offsetZ)>3).length>=45,'Letter Carriers must be naturally mixed, not cluster-center formation');

  assert(source.includes('function r16ResolveTurretSweep'),'turret-sweep knockback resolver must exist');
  assert(source.includes('function r16TurretSweepEligible'),'per-zombie sweep eligibility must exist');
  assert(source.includes('r16SweepCooldownUntil'),'per-zombie anti-repeat cooldown must exist');
  assert(source.includes('turretSweepMaxHitsPerStep:1')&&source.includes('horizontalLaunch:30')&&source.includes('verticalLaunch:8.8'),'sweep must fling at most one zombie per step with strong visible horizontal/upward launch');
  assert(source.includes('function r16TickFlingActor')&&source.includes('function r16FinishFling'),'fling update and landing recovery must exist');
  assert(source.includes('paused.push([e,e.speed]);e.speed=0'),'normal pathing must pause while airborne/flung');
  assert(source.includes('if(r16FlingActive(e))return false;return _r16TankZombieOverlap'),'flung zombie must not be immediately consumed by normal tank-ram overlap');
  assert(source.includes('!e.isTitan'),'Titan must be explicitly excluded from ordinary turret sweep fling');
  assert(source.includes('for(const e of G.zombieCrowd.activeByRecord.values())'),'sweep must evaluate active zombies individually');

  const pureStart=source.indexOf('// R16 PURE TURRET SWEEP START'),pureEnd=source.indexOf('// R16 PURE TURRET SWEEP END');
  assert(pureStart>=0&&pureEnd>pureStart,'R16 pure sweep block must remain testable');
  const pure=source.slice(pureStart,pureEnd)+"\nthis.hit=r16SweepContainsPoint;this.eligible=r16TurretSweepEligible;";
  const sb={Math,R16_SYSTEM:{turretSweepReach:8.15,turretSweepInnerRadius:1.55,turretSweepHalfWidth:.78,turretSweepMinAngle:.0045,horizontalLaunch:30,verticalLaunch:8.8},clamp:(v,a,b)=>Math.max(a,Math.min(b,v)),wrapPi:a=>{while(a>Math.PI)a-=Math.PI*2;while(a<-Math.PI)a+=Math.PI*2;return a;},rotationFromForward:(x,z)=>Math.atan2(-x,-z)};
  vm.createContext(sb);vm.runInContext(pure,sb);
  assert.strictEqual(sb.eligible({isZombie:true,crowdManaged:true,dead:false,isTitan:false,world:{x:0,z:0}}),true,'normal crowd zombie is eligible');
  assert.strictEqual(sb.eligible({isZombie:true,crowdManaged:true,dead:false,isTitan:true,world:{x:0,z:0}}),false,'Titan is never eligible');
  const h0=0,h1=.35,mid=.175,x=-Math.sin(mid)*5,z=-Math.cos(mid)*5;
  assert.strictEqual(sb.hit(0,0,h0,h1,x,z,1),true,'zombie intersecting swept barrel sector must be struck');
  assert.strictEqual(sb.hit(0,0,h0,h1,30,30,1),false,'far zombie must not be affected by sweep');

  assert(source.includes("id='fl44-fire-left'")&&source.includes("id='fl44-mg-left'"),'LEFT FIRE and LEFT MG must exist');
  assert(source.includes("queueMobileFirePulse('left-fire')"),'LEFT FIRE must invoke shared authoritative FIRE pulse');
  assert(source.includes('fireMachineGun(inputNow())')&&source.includes('s.mgHeld'),'LEFT MG must invoke existing authoritative machine-gun action/rate logic');
  assert(source.includes('readFirePositionStore(storage)')&&source.includes('writeFirePositionStore(data,storage)')&&source.includes('normalizedFirePosition(rect,safe)'),'left controls must reuse CURRENT persistence architecture');
  assert(source.includes('fireRectWithinSafe(rect,safe)')&&source.includes('r16FindLeftControlRect'),'saved/dragged left controls must be clamped into safe viewport bounds');
  assert(source.includes("owners:{leftFire:null,leftMg:null}"),'left controls must have independent pointer ownership');
  assert(source.includes("$('#fl44-stick')")&&source.includes("$('#fl44-aim-stick')")&&source.includes("$('#fl44-fire')")&&source.includes("$('#fl44-mg')"),'new controls must avoid/preserve existing DRIVE/AIM/right FIRE/right MG controls');
  assert(css.includes('.fl44-left-control')&&css.includes('.fl44-left-fire')&&css.includes('.fl44-left-mg'),'left control CSS must exist');

  for(const required of ['R14_TITAN_SYSTEM','targetLockSameTarget','turretForwardReturnDue','scopeModeActive','R131_WATER','R13_SECTOR_SET','tankZombieOverlap','mainGameCoinGateway','openGarage','fl44-exit'])assert(source.includes(required),'R16 must preserve '+required);
  console.log('Frontline 1944 R16 turret/scatter/mirrored-controls regression passed');
})();
