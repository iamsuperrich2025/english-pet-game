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
assert.ok(!/lightSpots|cfg\.lightStep|BoxGeometry\(4\.5,\.65,\.55\)|CylinderGeometry\(\.12,\.24,18,6\)/.test(zone),
  'decorative circuit light poles and luminous heads must be removed entirely');
assert.ok(!/CylinderGeometry\(0\.32,0\.5,22,6\)|BoxGeometry\(5\.4,1\.5,0\.7\)|glow\.scale\.set\(24,10,1\)/.test(f1),
  'legacy pole/head/additive-glow groups must also be gone, saving roughly 60 decorative draw calls');
for(const label of ['VOCAB WORLD','WORD BOOST','LEXICON','XP+','VOCAB GP','LEARN • RACE • WIN'])
  assert.ok(zone.includes(label),`missing fictional board: ${label}`);
assert.ok(!/Pirelli|Rolex|Aramco|\bAWS\b|\bFIA\b/i.test(zone),'real sponsor branding must not enter the realistic zone');
for(const feature of ['catch fencing','pit wall','marshal posts','skyline','racing groove'])
  assert.ok(zone.toLowerCase().includes(feature),`missing feature guard: ${feature}`);
assert.ok(/ribbonGeo\(HALF_W,0,\.052,4,null,4\)/.test(zone),
  'quality asphalt must tile in both directions every four metres instead of stretching across the road');
assert.ok(/colorMap:256,normalMap:128,roughnessMap:128,tileMeters:4,dynamicShadows:0/.test(zone)&&
  /normalScale:new THREE\.Vector2\(\.14,\.14\)/.test(zone),
  'asphalt must use subtle small shared color/normal/roughness maps without dynamic shadows');
assert.ok(/function realisticRunoffTex\([\s\S]*function realisticSandTex/.test(zone)&&
  /surfaceSeams[\s\S]*new THREE\.LineSegments\(surfaceSeamGeo/.test(zone),
  'runoff, sand and asphalt seams must gain lightweight surface detail');
assert.ok(/racingLineRibbonGeo\(1\.55,\.058,12\)/.test(zone)&&/const skid=\[\]/.test(zone),
  'rubber groove must follow the racing line while localized skid marks remain');
assert.ok(!/4096|displacementMap|tessell/i.test(zone),
  'surface upgrade must not introduce 4K maps, displacement or tessellation');
assert.ok(/F1_PLAYER_CONTACT_SHADOW/.test(f1)&&/new THREE\.CircleGeometry\(1\.52,12\)/.test(f1),
  'player car must use one low-poly contact shadow instead of dynamic shadow maps');
const skyAsset=path.join(root,'img/f1/sky_racing_1024.webp');
assert.ok(fs.existsSync(skyAsset)&&fs.statSync(skyAsset).size<64*1024,
  'racing sky must ship as a sub-64 KiB mobile WebP, not the 1.5 MiB source PNG');
assert.ok(/function useRacingSky\([\s\S]*generateMipmaps=false[\s\S]*activeGraphicsMode==='quality'/.test(f1),
  'quality sky must load lazily without mipmap memory and remain isolated from Battery Saver');
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
assert.ok(/const OFFTRACK_S\s*=\s*0/.test(f1)&&/if\(surf==='sand'\|\|surf==='runoff'\)\{sandT=OFFTRACK_S;beginPortalReturn\(\);\}/.test(f1),
  'portal recovery must open in the first off-road frame with no hidden 2-3 second timer');
assert.ok(/if\(portalActive\)\{portalTick\(dt\);return;\}/.test(f1),
  'portal recovery must lock physics during the jump');
assert.ok(/portalResumeSpeed=Math\.hypot\(vx,vz\)/.test(f1)&&
  /vx=LINE\.tx\[myIdx\]\*portalResumeSpeed;vz=LINE\.tz\[myIdx\]\*portalResumeSpeed;spd=portalResumeSpeed/.test(f1),
  'portal must restore the exact entry speed along the local track tangent after respawn');
assert.ok(/if\(portalJumped&&portalResumeSpeed>0\)[\s\S]*px\+=vx\*dt;pz\+=vz\*dt/.test(f1),
  'car must keep moving while the portal closes instead of visually pausing after the jump');
assert.ok(/#f1-portal[^]*@keyframes f1portalpulse/.test(f1),
  'portal must be an animated lightweight procedural overlay, not another full-screen raster asset');
const portalCss=f1.slice(f1.indexOf('#f1-portal{'),f1.indexOf('/* 🪽 ป้าย DRS'));
assert.ok(['#fff','#ff2bdf','#9f25ff'].every(c=>portalCss.includes(c)),
  'portal lighting must layer a white-hot core, electric pink and deep violet');
assert.ok(/\.core[^]*transparent 0 45%/.test(f1),
  'portal center must stay transparent so the destination track remains visible');
const portalHtml=f1.slice(f1.indexOf('id="f1-portal"'),f1.indexOf('id="f1-resp"'));
assert.strictEqual((portalHtml.match(/<i><\/i>/g)||[]).length,18,
  'portal must keep the dense 18-ray energy burst from the visual reference');
assert.ok(/class="nebula"/.test(portalHtml)&&/class="filaments"/.test(portalHtml)&&
  /repeating-conic-gradient/.test(f1)&&/f1portalnebula/.test(f1),
  'portal must include layered nebula, rotating plasma filaments and irregular energy streaks');
assert.ok(!/f1-portal[^}]*url\(/.test(f1),
  'portal must remain a lightweight procedural effect without another raster texture');

/* Round 1210 mobile thermal governor: keep simulation/network live while reducing continuous GPU work. */
assert.ok(/function isThermalMobile\(\)/.test(f1)&&/if\(isThermalMobile\(\)\) return 'low'/.test(f1),
  'coarse-pointer/mobile devices must start Realistic Circuit at the low geometry tier');
assert.ok(/fenceStep:24,boards:12,stands:1,city:12,pit:5/.test(f1),
  'mobile/low-tier scenery must cut nonessential crowds, skyline, boards and fence density');
assert.ok(/thermalMobile\?\(realistic\?1\.25:1\.35\):99/.test(f1)&&/function applyThermalPixelRatio/.test(f1),
  'mobile internal resolution must be capped and step down under sustained frame pressure');
assert.ok(/antialias:!thermalMobile/.test(f1)&&/envLights\.warm\.visible=!thermalMobile/.test(f1),
  'mobile must avoid continuous MSAA and the nonessential second directional light');
assert.ok(/thermalTargetFps=important\?45:\(active\?\(thermalLevel>=2\?30:\(thermalLevel===1\?36:45\)\):20\)/.test(f1),
  'mobile rendering must cap at 45 fps while active, 30 fps under pressure and 20 fps while idle');
const frameSrc=f1.slice(f1.indexOf('function frame(dt,now)'),f1.indexOf('function tick(now)'));
assert.ok(/physTick\(dt\)/.test(frameSrc)&&/netSend\(false\)/.test(frameSrc)&&/if\(visualDue\) renderer\.render/.test(frameSrc),
  'physics and multiplayer must tick continuously even when a GPU render frame is skipped');
assert.ok(/const cap=thermalMobile\?\(thermalLevel\?4:8\):26/.test(f1),
  'non-gameplay smoke particles must be capped aggressively on mobile');

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

/* Round 1209-1210 mobile thermal budget: a visibly coherent shape without extra render work. */
const peerModel=f1.slice(f1.indexOf('SEMI-REALISTIC LOW-POLY PEER F1'),f1.indexOf('function makeCar'));
assert.ok(/function buildPeerF1Car\(color\)/.test(peerModel)&&/peerF1MergedGeometry/.test(peerModel),
  'peer racers must use their dedicated semi-realistic merged low-poly builder');
assert.ok(/peerF1LoftGeometry/.test(peerModel)&&/const body=peerF1CombineGeometry\(\[bodyShell,cockpitCowl\]\)/.test(peerModel),
  'peer body and cockpit cowl must form one continuous faceted shell with the same body color');
assert.ok(/const aero=peerF1MergedGeometry\(aeroParts\)/.test(peerModel)&&/const arm=\(x1,z1,x2,z2,y\)/.test(peerModel),
  'peer aero and visible suspension arms must stay merged in one dark low-cost mesh');
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

/* Round 1210: long tangent-aligned wall boxes must not swing onto the racing surface. */
const circuit=f1.slice(f1.indexOf('function buildRealisticCircuit'),f1.indexOf('function buildLegacyArchitecture'));
assert.ok(/Math\.abs\(LINE\.curv\[i\]\)>\.0045\?1:cfg\.barStep/.test(circuit)&&/const barrierPose=/.test(circuit),
  'tight circuit bends must use short chord-aligned barrier modules');
assert.ok(/new THREE\.BoxGeometry\(\.72,1\.18,1\)/.test(circuit)&&/Math\.hypot\(bx-ax,bz-az\)\+\.18/.test(circuit),
  'barrier length must be supplied by each actual offset-line chord, not one long tangent box');
assert.ok(/Math\.abs\(PITL\.curv\?\.\[i\]\|\|0\)>\.0045\?1:3/.test(circuit)&&/new THREE\.BoxGeometry\(\.5,1\.05,1\)/.test(circuit),
  'pit wall bends must use the same short chord-aligned protection');
assert.ok(/const pitBayClearance=\(s,lat\)/.test(circuit)&&/s\.lat=ca>=cb\?a:b/.test(circuit)&&/Math\.max\(ca,cb\)>HALF_W\+KERB_W\+\.25/.test(circuit),
  'each full pit-garage footprint must choose the safer side and be culled at an overlapping entry or exit');
assert.ok(/F1_REALISTIC_PIT_GARAGES/.test(circuit)&&/F1_REALISTIC_PIT_ROOF_LIGHTS/.test(circuit),
  'pit buildings and their roof strips must share the same verified safe placement list');

/* Multiplayer cars must be solid oriented bodies, with bounce + rubbing resistance. */
for(const token of ['CAR_HIT_PARTS','CAR_HIT_RADIUS','CAR_RESTITUTION','CAR_SIDE_FRICTION','CAR_RUB_DRAG'])
  assert.ok(f1.includes(token),`missing peer collision tuning constant: ${token}`);
assert.ok(!/CAR_HALF_W|CAR_HALF_L/.test(f1)&&/function carPartContact\([\s\S]*axes=\[\[arx,arz\],\[afx,afz\],\[brx,brz\],\[bfx,bfz\]\]/.test(f1),
  'car collision must use compound model parts and both oriented axes, never one air-filled bounding box');
assert.ok(/function resolvePeerCars\([\s\S]*CAR_RESTITUTION[\s\S]*CAR_SIDE_FRICTION[\s\S]*CAR_RUB_DRAG/.test(f1),
  'peer collision must apply rebound impulse and side-rubbing resistance');
assert.ok(/px\+=vx\*dt; pz\+=vz\*dt;\s*resolvePeerCars\(dt\);\s*barrierBounce\(\)/.test(f1),
  'peer separation must run after movement and before the track barrier clamp');
assert.ok(/vx:Math\.round\(vx\*10\)\/10, vz:Math\.round\(vz\*10\)\/10/.test(f1),
  'network payload must provide relative velocity for physical impacts');
const hitPartsSrc=f1.match(/const CAR_HIT_PARTS=(\[[\s\S]*?\]);/)[1];
const hitRadius=Number(f1.match(/const CAR_HIT_RADIUS=([.\d]+)/)[1]);
const contactSrc=f1.slice(f1.indexOf('function carPartContact'),f1.indexOf('function resolvePeerCars'));
const carContact=Function(`const CAR_HIT_PARTS=${hitPartsSrc},CAR_HIT_RADIUS=${hitRadius};${contactSrc};return carContact;`)();
assert.strictEqual(Function(`return ${hitPartsSrc}`)().length,9,'Formula footprint must have five aero/body and four tyre contact parts');
assert.strictEqual(carContact(0,0,0,0,5.9,0),null,'cars must not collide before their visible front/rear parts touch');
const noseHit=carContact(0,0,0,0,5.8,0);
assert.ok(noseHit&&noseHit.depth>0&&noseHit.nz<0,'front-to-rear overlap must push the local car backward');
assert.strictEqual(carContact(0,0,0,2.0,1.0,0),null,
  'empty diagonal space between wings, tyres and chassis must not trigger an invisible collision');
assert.strictEqual(carContact(0,0,0,2.4,0,0),null,'side-by-side cars must stay free until their visible tyres touch');
const tyreHit=carContact(0,0,0,2.3,0,0);
assert.ok(tyreHit&&tyreHit.depth>0,'visible side tyres must become solid at actual contact');

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
assert.ok(/QUALITY_DASH_POSE=\{[\s\S]*left:[\s\S]*deg:-23[\s\S]*right:[\s\S]*deg:21\.8/.test(f1)&&
  /function positionQualityDash\([\s\S]*lerp\(center\.cx,edge\.cx,t\)[\s\S]*lerp\(0,edge\.deg,t\)/.test(f1),
  'live wheel dashboard must follow measured left/center/right screen poses instead of a guessed rotation');
assert.ok(/QUALITY_DASH_SCALE=\.82/.test(f1)&&/p\.w\*sx\*QUALITY_DASH_SCALE/.test(f1)&&/p\.h\*sy\*QUALITY_DASH_SCALE/.test(f1),
  'quality dashboard must shrink uniformly around its measured center so it stays inside the real LCD bezel');
assert.ok(/#f1-wrap\.fp #f1-hud\{display:none\}/.test(f1),
  'cockpit must hide the duplicate floating gear/speed HUD while leaving non-cockpit views unchanged');
assert.ok(/#f1-wrap\.realistic\.fp #f1-dash\{display:block!important\}/.test(f1)&&
  !/#f1-wrap\.realistic\.fp #f1-dash\{[^}]*left:44vw/.test(f1),
  'quality dashboard placement must come from measured image coordinates, never fixed viewport offsets');
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
