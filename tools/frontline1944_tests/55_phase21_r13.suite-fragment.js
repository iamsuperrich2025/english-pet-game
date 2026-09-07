// R13 09cfa9 — 10-sector battlefield expansion / streaming-preservation regression.
(function testR13BattlefieldSectorExpansion(){
  const source=fs.readFileSync('js/frontline1944.js','utf8'),css=fs.readFileSync('css/frontline1944.css','utf8'),html=fs.readFileSync('index_classic.html','utf8');
  const ID='P2.1R15-cf4076';
  assert(source.includes("runtimeVersion:'"+ID+"'"),'R13 JS delivery identity');
  assert(css.includes('--fl44-css-runtime-id:"'+ID+'-CSS"'),'R13 CSS delivery identity');
  assert(html.includes("var FRONTLINE_RUNTIME_ID='"+ID+"';"),'R13 loader identity');
  assert(source.includes("sectorCount:10"),'R13 declares ten-sector campaign architecture');
  const ids=['rural_approach','forest_road','river_crossing','trench_line','ruined_village','open_battlefield','defensive_bunkers','industrial_ruins','fortress_approach','final_fortress'];
  for(const id of ids)assert(source.includes("id:'"+id+"'"),'R13 sector definition exists: '+id);
  assert.strictEqual(new Set(ids).size,10,'R13 sector IDs are unique');
  assert(source.includes("streamingPolicy:'CURRENT_PREVIOUS_CURRENT_NEXT'"),'R13 explicitly preserves CURRENT streaming policy');
  assert(source.includes('if(r13PopulateSector(rt))return;'),'R13 sector composition is a minimal populate hook');
  assert(source.includes('addBridgeCrossing(rt)'),'bridge sector uses authoritative traversable bridge helper');
  assert(source.includes("'r13-trench-sandbag'")&&source.includes('r13AddTrenchBand'),'trench sector has distinct defensive earthwork composition');
  assert(source.includes('r13AddChimney'),'industrial sector has strong chimney landmark');
  assert(source.includes("'r13-final-outer-defense'")&&source.includes('authoritative makeFortress remains mission-critical objective'),'final sector preserves authoritative fortress objective architecture');
  assert(source.includes('if(Math.abs(x)<15)x=x<0?x-14:x+14'),'tree placement protects center tank corridor');
  assert(source.includes('if(Math.abs(x)<17)x+=x<0?-18:18'),'crater placement protects center tank corridor');
  assert(source.includes('m.step<9')&&source.includes('m.step>=9')&&source.includes('r12SectorForStep(9)'),'mission progression now reaches sector 10 before fortress assault');
  assert(source.includes('m.step===1||m.step===3||m.step===5||m.step===8'),'R13 checkpoints remain sparse and deterministic across the longer route');
  assert(source.includes('class SectorStreamer')&&source.includes('this.active=new Map()')&&source.includes('this.preloaded=new Map()'),'CURRENT SectorStreamer remains present');
  assert(source.includes('disposeSectorRuntime(rt)')&&source.includes('G.collision.clearSector(rt.index,rt.ownerId)'),'sector disposal still clears collision state');
  assert(source.includes('r113DisposeEnvironmentPrefix(rt&&rt.ownerId)'),'sector disposal still clears destructible environment state');
  assert(source.includes("destructibleKinds:Object.freeze(['tree','house','ruin','tent','phase21_fence'])"),'accepted destructible allowlist remains unchanged');
  assert(source.includes("protectedKinds:Object.freeze(['fortress_wall','fortress_core','bunker','bridge_rail','r2-bridge-parapet'])"),'mission-critical protection allowlist remains unchanged');
  assert(source.includes("allowed=targetType==='ENEMY_TANK'||targetType==='ZOMBIE'"),'combat damage accounting remains enemy-only');
  assert(source.includes('targetSelectionFireTimeoutMs:5000'),'R12.2 five-second target timeout preserved');
  assert(source.includes('if(s.scopeMode)holdCurrentTurretOrientation();else s.forceHullForward=true'),'R12.2 SCOPE timeout exception preserved');
  assert(source.includes('1253,553'),'accepted responsive regression viewport remains in matrix');
  console.log('PASS R13 ten-sector battlefield expansion / streaming / mission / R12.2 preservation regression.');
})();

