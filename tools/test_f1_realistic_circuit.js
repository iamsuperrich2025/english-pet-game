/* Regression guard: all eight requested Realistic Circuit gameplay/visual contracts. */
'use strict';
const assert=require('assert');
const fs=require('fs');
const path=require('path');
const root=path.resolve(__dirname,'..');
const f1=fs.readFileSync(path.join(root,'js/f1_3d.js'),'utf8');
const modes=fs.readFileSync(path.join(root,'js/f1_modes.js'),'utf8');

const zone=f1.split('✨ F1 REALISTIC CIRCUIT')[1].split('function buildTrackScene')[0];
assert.ok(zone,'Realistic Circuit zone must exist');
assert.ok(/activeGraphicsMode==='quality'/.test(f1),'realistic visuals must be gated by quality mode');
assert.ok(/if\(realistic&&!realisticRoot\)/.test(f1),'realistic scene must be created lazily');
assert.ok(/realisticRoot\.visible=realistic/.test(f1),'mode switch must hide the realistic group in Battery Saver');
assert.ok((zone.match(/new THREE\.InstancedMesh/g)||[]).length>=1,'repeated trackside objects must use instancing');
assert.ok(!/PointLight|SpotLight/.test(zone),'realistic trackside must not create one dynamic light per pole');
for(const label of ['VOCAB WORLD','WORD BOOST','LEXICON','XP+','VOCAB GP','LEARN • RACE • WIN'])
  assert.ok(zone.includes(label),`missing fictional board: ${label}`);
assert.ok(!/Pirelli|Rolex|Aramco|\bAWS\b|\bFIA\b/i.test(zone),'real sponsor branding must not enter the realistic zone');
for(const feature of ['catch fencing','pit wall','marshal posts','skyline','racing groove'])
  assert.ok(zone.toLowerCase().includes(feature),`missing feature guard: ${feature}`);
for(const photo of ["crowd.jpg","pit.jpg","tower.jpg","tent.jpg"])
  assert.ok(!f1.includes(`texProbe('${photo}'`),`trackside architecture must not load billboard/photo texture: ${photo}`);
for(const token of ['PREMIUM MODULAR CIRCUIT ARCHITECTURE','grandstandRows:7','photoTextures:0','instancedParts','MeshStandardMaterial'])
  assert.ok(f1.includes(token),`missing premium 3D architecture contract: ${token}`);
assert.ok(!/matLit\(['"]crowd/.test(f1),'crowd must be low-poly geometry, never a lit billboard plane');
assert.ok(/RFP_EYE\s*=\s*1\.30/.test(f1)&&/camera\.near=realistic\?\.14:\.3/.test(f1),
  'quality cockpit eye level/near plane must stay separate from Battery Saver');
assert.ok(/activeGraphicsMode==='quality'[\s\S]{0,160}racingLineLat/.test(f1),
  'quality collectibles must follow the computed racing line');
assert.ok(/function footprintCrossesRoad\([\s\S]*pointInFootprint/.test(f1),
  'OSM buildings crossing the road must be culled before construction');
assert.ok(/legacyArchitectureRoot\.visible=!realistic/.test(f1),
  'Realistic Circuit must hide the entire legacy OSM architecture group to prevent stacked road boxes');
assert.ok(/function tracksideSpotClear\([\s\S]*surfAt/.test(f1)&&/culledRoadCity/.test(f1),
  'procedural skyline buildings must be culled against every track segment, not only their source segment');
assert.ok(/function barrierBounce\([\s\S]*BARRIER_BOUNCE/.test(f1)&&/px\+=vx\*dt; pz\+=vz\*dt;[\s\S]{0,80}barrierBounce\(\)/.test(f1),
  'trackside barrier must clamp and reflect vehicle velocity after movement');
assert.ok(/function beginPortalReturn\([\s\S]*portalTargetIdx=nearIdx/.test(f1)&&
  /function portalTick\([\s\S]*respawnOnTrack\(portalTargetIdx,false\)/.test(f1),
  'off-road recovery must open a portal and return to the nearest local track segment');
assert.ok(/surf==='sand'\|\|surf==='runoff'/.test(f1)&&/if\(portalActive\)\{portalTick\(dt\);return;\}/.test(f1),
  'portal recovery must detect sustained departure from the racing surface and lock physics during the jump');
assert.ok(/#f1-portal[^]*@keyframes f1portalpulse/.test(f1),
  'portal must be an animated lightweight procedural overlay, not another full-screen raster asset');
assert.ok(/#f1-portal \.gate[^]*#fff[^]*#ff2bdf[^]*#9f25ff/.test(f1),
  'portal lighting must layer a white-hot core, electric pink and deep violet');
assert.ok(/\.core[^]*transparent 0 43%/.test(f1),
  'portal center must stay transparent so the destination track remains visible');
const portalHtml=f1.slice(f1.indexOf('id="f1-portal"'),f1.indexOf('id="f1-resp"'));
assert.strictEqual((portalHtml.match(/<i><\/i>/g)||[]).length,18,
  'portal must keep the dense 18-ray energy burst from the visual reference');

const words=f1.slice(f1.indexOf('function spawnLetters'),f1.indexOf('เพื่อนร่วมสนาม'));
assert.ok(/const gap=TOTAL\/word\.en\.length/.test(words),'letter gap must equal lap distance divided by word length');
assert.ok(/\(i\+\.5\)\*gap/.test(words),'letters must occupy the center of evenly divided lap segments');
assert.ok(!/LETTER_COPIES/.test(f1),'one-lap word must not create duplicate letter copies');
assert.ok(!/setTimeout\(\(\)=>\{ if\(running\) pickWord\(\)/.test(words),'completed word must wait for the next lap');
assert.ok(/ครบรอบ![\s\S]{0,1500}pickWord\(\)/.test(f1),'a fresh word must be selected only when a lap completes');
const collect=f1.slice(f1.indexOf('function collectTick'),f1.indexOf('function completeWord'));
assert.ok(/const localX=px,localZ=pz/.test(collect)&&!/peers\[|for\s*\([^)]*peers/.test(collect),
  'online players must collect only their own local letters');
const payload=f1.slice(f1.indexOf('function netSend'),f1.indexOf('function sendChat'));
assert.ok(!/(?:got|letters|word)\s*:/.test(payload),'network payload must never publish letter ownership or collection state');
const receive=f1.slice(f1.indexOf('function onPeer'),f1.indexOf('function showPeerBubble'));
assert.ok(!/\b(?:word|letters)\s*=|scene\.remove\(.*spr/.test(receive),'peer updates must never remove local letters');

const peer=f1.slice(f1.indexOf('function buildPeer(uid,p)'),f1.indexOf('function onPeer'));
assert.ok(peer.includes('buildPeerF1Car(col)')&&peer.includes('peerCar3d'),
  'remote racers must use a ground-aligned 3D car that follows their real yaw');
assert.ok(!/THREE\.Sprite|camera-facing-rear-three-quarter|peerCar25d/.test(peer),
  'remote racers must never use a camera-facing flat sprite');
assert.ok(peer.includes('attachDrsGlow(car)')&&peer.includes('drsFlap'),
  'remote 3D cars must retain their DRS visual state');

/* Round 1209 mobile thermal budget: improve silhouette while reducing render work. */
const peerModel=f1.slice(f1.indexOf('SEMI-REALISTIC LOW-POLY PEER F1'),f1.indexOf('function makeCar'));
assert.ok(/function buildPeerF1Car\(color\)/.test(peerModel)&&/peerF1MergedGeometry/.test(peerModel),
  'peer racers must use their dedicated semi-realistic merged low-poly builder');
assert.ok((peerModel.match(/new THREE\.InstancedMesh/g)||[]).length===2,
  'four tyres and four rims must be batched into exactly two instanced draw calls');
assert.ok(/if\(peerF1Kit\) return peerF1Kit/.test(peerModel)&&/sharedGeometry:true/.test(peerModel),
  'all peer cars must share cached geometry instead of rebuilding GPU buffers per player');
const peerBuilder=f1.slice(f1.indexOf('function buildPeerF1Car'),f1.indexOf('function makeCar'));
assert.ok(!/new THREE\.(?:Box|Sphere|Torus|Cylinder|Circle)Geometry/.test(peerBuilder),
  'joining peers must never allocate fresh geometry on the GPU');
assert.ok(/drawCalls:8,textures:0,pbr:0,dynamicShadows:0/.test(peerModel),
  'peer car GPU contract must stay at 8 base draw calls with no textures/PBR/dynamic shadows');
assert.ok(/CylinderGeometry\(\.45,\.45,\.40,10/.test(peerModel)&&/CylinderGeometry\(\.255,\.255,\.415,8/.test(peerModel),
  'peer wheel radial segments must stay capped at 10/8');
assert.ok(!/MeshStandardMaterial|MeshPhysicalMaterial|TextureLoader|castShadow\s*=\s*true|receiveShadow\s*=\s*true/.test(peerModel),
  'peer cars must not introduce PBR, textures or dynamic shadows');
assert.ok(/function dropPeer[\s\S]*disposePeer[\s\S]*drsGlow[\s\S]*nameSprite\.material\.map\.dispose/.test(f1),
  'leaving peers must release their unique color, glow and name-tag GPU resources');
assert.ok(/f1_car_lite\.glb/.test(f1)&&/cockpit_turn_center\.webp/.test(f1),
  'player realistic car/cockpit assets must remain untouched');

/* Multiplayer cars must be solid oriented bodies, with bounce + rubbing resistance. */
for(const token of ['CAR_HALF_W','CAR_HALF_L','CAR_RESTITUTION','CAR_SIDE_FRICTION','CAR_RUB_DRAG'])
  assert.ok(f1.includes(token),`missing peer collision tuning constant: ${token}`);
assert.ok(/function carContact\([\s\S]*axes=\[\[arx,arz\],\[afx,afz\],\[brx,brz\],\[bfx,bfz\]\]/.test(f1),
  'car collision must use both oriented axes from both racers');
assert.ok(/function resolvePeerCars\([\s\S]*CAR_RESTITUTION[\s\S]*CAR_SIDE_FRICTION[\s\S]*CAR_RUB_DRAG/.test(f1),
  'peer collision must apply rebound impulse and side-rubbing resistance');
assert.ok(/px\+=vx\*dt; pz\+=vz\*dt;\s*resolvePeerCars\(dt\);\s*barrierBounce\(\)/.test(f1),
  'peer separation must run after movement and before the track barrier clamp');
assert.ok(/vx:Math\.round\(vx\*10\)\/10, vz:Math\.round\(vz\*10\)\/10/.test(f1),
  'network payload must provide relative velocity for physical impacts');
const num=name=>Number(f1.match(new RegExp(`const ${name}\\s*=\\s*([.\\d]+)`))[1]);
const contactSrc=f1.slice(f1.indexOf('function carContact'),f1.indexOf('function resolvePeerCars'));
const carContact=Function(`const CAR_HALF_W=${num('CAR_HALF_W')},CAR_HALF_L=${num('CAR_HALF_L')};${contactSrc};return carContact;`)();
assert.strictEqual(carContact(0,0,0,0,6,0),null,'cars farther than one body length must not collide');
const noseHit=carContact(0,0,0,0,5,0);
assert.ok(noseHit&&noseHit.depth>0&&noseHit.nz<0,'front-to-rear overlap must push the local car backward');
const sideHit=carContact(0,0,0,1.8,0,Math.PI/2);
assert.ok(sideHit&&sideHit.depth>0,'rotated cars must remain solid during a side squeeze');

/* Steering must move the driver's hands as well as the wheel, using lightweight alpha frames. */
for(const dir of ['center','left','right']){
  const rel=`img/f1/cockpit_turn_${dir}.webp`;
  const asset=path.join(root,rel);
  assert.ok(f1.includes(rel),`runtime must reference ${rel}`);
  assert.ok(fs.existsSync(asset),`${rel} must ship with the runtime`);
  assert.ok(fs.statSync(asset).size<=90*1024,`${rel} must stay under the 90 KiB mobile budget`);
}
assert.ok(/QUALITY_HAND_MAX_DEG=14/.test(f1),'live dashboard angle must match the measured ±14° hand frames');
assert.ok(/cockpitTurnEl\.style\.opacity/.test(f1)&&/cockpit_turn_left\.webp[^]*cockpit_turn_right\.webp/.test(f1),
  'left/right hand frames must blend from the center frame using the real steering value');
assert.ok(/if\(dashEl\) dashEl\.style\.transform=quality\?qr:tr/.test(f1),
  'live wheel dashboard must rotate with the same clamped angle as the hands');
assert.ok(/#f1-wrap\.realistic\.fp #f1-wheel[^\n]*#f1-quality-wheel\{display:none!important\}/.test(f1),
  'quality cockpit must not render a duplicate procedural wheel over the photographed hands');

/* Exact Phase-1 Battery Saver profile guard: this visual upgrade must not trade its quality away. */
for(const token of [
  "DEFAULT_MODE='battery'", "pixelRatioCap:2", "powerPreference:'default'", "toneMapping:'none'",
  'background:0x0d1430', 'fogNear:340', 'fogFar:1600', 'cameraFar:2100',
  'hemisphere:0.72', 'keyLight:1.05', 'warmLight:0.35', "assetSet:'f1-current'"
]) assert.ok(modes.includes(token),`Battery Saver contract changed: ${token}`);
assert.ok(modes.includes("assetSet:'f1-realistic-circuit-v2'"));
assert.ok(modes.includes("ENTRY_MODE='quality'")&&modes.includes('SELECTOR_ENABLED=false'),
  'entry must go straight to Realistic Circuit while preserving the hidden Battery Saver selector');
assert.ok(/F1Modes\.getSelection\(F1Modes\.ENTRY_MODE\|\|'quality'\)/.test(
  fs.readFileSync(path.join(root,'js/ui.js'),'utf8')),'world entry must explicitly request the Realistic profile');
assert.strictEqual((f1.match(/new THREE\.Scene\(/g)||[]).length,1,'must keep one shared scene');
assert.strictEqual((f1.match(/new THREE\.WebGLRenderer\(/g)||[]).length,1,'must keep one shared renderer');

console.log('PASS F1 Realistic Circuit: quality-only scene, cockpit, trackside density, instancing and Battery Saver isolation');
