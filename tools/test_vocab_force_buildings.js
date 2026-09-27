'use strict';
/* รอบ 1604: เทสต์พฤติกรรมอาคารหลบในสนาม Vocab Force — ผนัง/ประตู/ใต้แผ่นชั้นสอง/บันได/ซ่อน shell */
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const root = path.resolve(__dirname, '..');
const read = p => fs.readFileSync(path.join(root, p), 'utf8');
let n = 0;
const assert = (ok, msg) => { if(!ok){ console.error('FAIL', msg); process.exitCode = 1; } else n++; };

/* ---- wiring สถาปัตยกรรม ---- */
const ns = read('minigames/vocab-force/vocab-force-namespace.js');
const arenaSrc = read('minigames/vocab-force/map/prototype-arena.js');
const bldSrc = read('minigames/vocab-force/map/buildings.js');
const ctlSrc = read('minigames/vocab-force/character/nex-character-controller.js');
const runtimeSrc = read('minigames/vocab-force/runtime/vocab-force-runtime.js');
const html = read('minigames/vocab-force/index.html');
const build = read('tools/build_web.mjs');
assert(ns.includes("'map/buildings.js'"),'namespace loads buildings.js');
assert(html.includes('map/buildings.js'),'preview html loads buildings.js');
assert(build.includes('minigames/vocab-force/map/buildings.js'),'build_web copies buildings.js');
assert(arenaSrc.includes('new VF.Buildings().build(this, g)'),'arena builds the buildings');
assert(arenaSrc.includes('b.ceiling && y + 1.55 < b.miny'),'collide lets ground floor walk under slabs');
assert(arenaSrc.includes('PrototypeArena.prototype.floorY'),'arena exposes floorY for upper storeys');
assert(ctlSrc.includes('arena.floorY') && ctlSrc.includes('world.floorY'),'player + dash honour building floors');
assert(runtimeSrc.includes('arena.buildings.update'),'runtime hides the building shell around the camera target');

/* ---- behavioral sandbox (mock THREE เฉพาะที่ Buildings ใช้) ---- */
function MockGroup(){ this.children = []; this.visible = true; this.name = ''; }
MockGroup.prototype.add = function(c){ this.children.push(c); return this; };
function MockMesh(g, m){ this.geometry = g; this.material = m; this.position = {set: function(){}}; this.rotation = {y: 0}; this.name = ''; }
const THREE = {
  Group: MockGroup, Mesh: MockMesh,
  BoxGeometry: function(){}, PlaneGeometry: function(){},
  MeshLambertMaterial: function(o){ Object.assign(this, o); },
  MeshBasicMaterial: function(o){ Object.assign(this, o); }
};
const sandbox = { window: { THREE: THREE }, console: { warn: function(){}, log: function(){} } };
vm.createContext(sandbox);
vm.runInContext(ns, sandbox);
vm.runInContext(arenaSrc, sandbox);
vm.runInContext(bldSrc, sandbox);
const VF = sandbox.window.VocabForce;

const arena = new VF.PrototypeArena();
new VF.Buildings().build(arena, new MockGroup());

assert(arena.buildings && arena.buildings.list.length === 6,'six hideable buildings stand in the lot');
assert((arena.walkSlabs || []).length === 2,'two-storey buildings register one walk slab each');
const walls = arena.boxes.filter(b => !b.platform && !b.ceiling);
assert(walls.length >= 4 * 6,'every building has four colliding ground walls');

/* อาคารตัวอย่างชั้น 1: spec[0] (175,140) 10×8 ประตูฝั่ง w — ทิศหาประตูตามแนวแกนไกลกว่า */
const c1 = arena.collide(172, 0, 140, 0.5);   /* เดินผ่านช่องประตู */
assert(Math.abs(c1.x - 172) < 1e-9 && Math.abs(c1.z - 140) < 1e-9 && !c1.wall,'ground floor walks in through the door');
const w1 = arena.collide(170.3, 0, 137.4, 0.5); /* อีกฝั่งผนัง (เว้นระยะจากเส้นประตู) */
assert(w1.wall && w1.x >= 170.6,'solid wall pushes the player out');
const r1 = arena.collide(175, 0, 140, 0.5);   /* ยืนใต้หลังคาอาคาร 1 ชั้น */
assert(!r1.wall && Math.abs(r1.x - 175) < 1e-9,'1-storey roof leaves the interior walkable');
const j1 = arena.collide(-30, 1.7, 215, 0.5); /* หัวสูงกว่าใต้แผ่นหลังคา → ชนแผ่น */
assert(Math.abs(j1.x + 30) > 0.01,'mid-air body at slab level is pushed out');

/* อาคาร 2 ชั้น: spec[4] (-30,215) 12×9 ประตูฝั่ง n · บันไดเต็มแนวฝั่ง s */
const u0 = arena.collide(-30, 0, 215, 0.5);   /* ชั้นล่างใต้แผ่นพื้นชั้นสอง */
assert(!u0.wall && Math.abs(u0.x + 30) < 1e-9,'ground floor walks under the upper slab');
assert(arena.floorY(-30, 215, 0) === 0,'slab does not lift a ground-floor player');
assert(arena.floorY(-30, 215, 3.5) === 3.5,'upper-floor player keeps standing on the slab');
const up = arena.collide(-30, 3.5, 215, 0.5); /* ยืนบนแผ่น → ไม่โดนผลัก */
assert(!up.wall && Math.abs(up.x + 30) < 1e-9,'player standing on the slab is not pushed');
const stairTop = arena.surfaceY(-30, 216.4);  /* ขั้นบันไดขั้นสุดท้าย */
assert(Math.abs(stairTop - 3.5) < 1e-9,'staircase top meets the upper slab height');
assert(arena.surfaceY(-30, 218.8) > 0.8 && arena.surfaceY(-30, 218.8) < 0.95,'first stair step is a low platform');

/* ซ่อน shell เมื่ออยู่ในอาคาร */
const b1 = arena.buildings.list[0];
b1.shell.visible = true;
arena.buildings.update({x: 175, y: 0, z: 140});
assert(b1.shell.visible === false,'shell hides while the player is inside');
arena.buildings.update({x: 0, y: 0, z: 0});
assert(b1.shell.visible === true,'shell returns once the player leaves');
const b5 = arena.buildings.list[4];
b5.shell.visible = true;
arena.buildings.update({x: -30, y: 3.5, z: 213});
assert(b5.shell.visible === false,'upstairs player also sees through the shell');
arena.buildings.update({x: -30, y: 6.9, z: 215});
assert(b5.shell.visible === true,'roof level keeps the shell visible');

if(process.exitCode) { console.error('building tests failed after ' + n + ' passes'); process.exit(1); }
console.log('PASS · ' + n + ' asserts · round 1604 buildings');
