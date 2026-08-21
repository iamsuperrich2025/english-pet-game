'use strict';
const assert=require('assert');
const fs=require('fs');
const path=require('path');
const root=process.argv[2]?path.resolve(process.argv[2]):path.resolve(__dirname,'..');
const src=fs.readFileSync(path.join(root,'js','f1_3d.js'),'utf8');

const zone=src.slice(src.indexOf('FANTASY OPTIONAL AIR ROUTES'),src.indexOf('/* ผิวใต้ล้อ:'));
assert.ok(zone.length>1000,'fantasy jump zone must exist');
assert.match(src,/const JUMP_FRACTIONS=\[\.16,\.47,\.76\]/,'exactly three well-spaced optional jump sectors are required');
assert.match(src,/const JUMP_GRAVITY\s*=\s*9\.81/,'vertical motion must use real Earth gravity');
assert.match(src,/const JUMP_LANE_LAT=\s*11\.25/,'jump lane must remain beside the 7.5 m half-width main track');
assert.match(src,/return lerp\(3\.95,3\.15,d\/j\.entryM\)/,'entry fan must touch the track before narrowing onto the ramp');
assert.match(src,/if\(d<=j\.landEndD\) return 3\.80/,'landing deck must be at least 7.6 m wide');
assert.match(src,/mainRacingLineRaised:false/,'main racing line must remain flat and unobstructed');
assert.match(src,/if\(a<=HALF_W\) s='track';\s*else if\(jump\) s='jump';/,
  'main track must win surface classification before the optional side route');

assert.ok((zone.match(/new THREE\.InstancedMesh/g)||[]).length>=3,'repeated fantasy parts must be instanced');
assert.match(zone,/new THREE\.LOD\(\)/,'launch beacon must use distance LOD');
assert.match(zone,/sharedRampGeometry:1[\s\S]*textures:0,pbr:0,reflections:0,dynamicLights:0,dynamicShadows:0,particles:0/,
  'fantasy visuals must stay textureless, non-PBR and free of dynamic lights/shadows/particles');
assert.doesNotMatch(zone,/MeshStandardMaterial|MeshPhysicalMaterial|TextureLoader|PointLight|SpotLight|castShadow|receiveShadow/,
  'jump zone must not introduce hot mobile rendering features');

assert.match(src,/vy-=JUMP_GRAVITY\*dt;\s*py\+=vy\*dt/,'airborne height must integrate gravity every simulation tick');
assert.match(src,/vy=Math\.max\(0,forwardSpeed\*Math\.sin\(j\.launchPitch\)\)/,
  'launch velocity must come from actual forward speed and ramp angle');
assert.match(src,/JUMP_MAX_PITCH=\.22[\s\S]*pitch=clamp/,'vehicle pitch must be capped so it cannot flip numerically');
assert.match(src,/landFromJump\([\s\S]*const keep=clamp\(1-impact\*\.006,\.90,1\)/,
  'landing must preserve most momentum while applying a bounded physical impact loss');
assert.match(src,/if\(missedJump\|\|\(!airborne&&\(surf==='sand'\|\|surf==='runoff'\)\)\)/,
  'failed jumps must use the existing portal without teleporting a valid airborne car');

const h=Number(src.match(/const JUMP_HEIGHT\s*=\s*([\d.]+)/)[1]);
const rise=Number(src.match(/const JUMP_RISE_M\s*=\s*([\d.]+)/)[1]);
const gap=Number(src.match(/const JUMP_GAP_M\s*=\s*([\d.]+)/)[1]);
const land=Number(src.match(/const JUMP_LAND_M\s*=\s*([\d.]+)/)[1]);
const exit=Number(src.match(/const JUMP_EXIT_M\s*=\s*([\d.]+)/)[1]);
const recover=Number(src.match(/const JUMP_RECOVER_M=([\d.]+)/)[1]);
const g=9.81,pitch=Math.atan(2*h/rise),safeRun=gap+land+exit+recover;
for(const speed of [24,50,92]){
  const up=speed*Math.sin(pitch),flight=(up+Math.sqrt(up*up+2*g*h))/g,range=speed*flight;
  assert.ok(range>=gap-1&&range<=safeRun+1,`ballistic range at ${speed} m/s must meet the broad landing/recovery corridor`);
}

const payload=src.slice(src.indexOf('function netSend'),src.indexOf('function sendChat'));
for(const token of ['y:Math.round(py*20)/20','p:Math.round(pitch*100)/100','a:airborne?1:0','vy:Math.round(vy*10)/10'])
  assert.ok(payload.includes(token),`multiplayer airborne payload missing ${token}`);
assert.match(src,/p\.yCur=lerp[\s\S]*p\.pitchCur=lerp[\s\S]*p\.grp\.position\.set\(p\.cur\.x,p\.yCur,p\.cur\.z\)/,
  'remote height and pitch must interpolate with X/Z/yaw');
assert.match(src,/Math\.abs\(py-\(p\.yCur\|\|0\)\)>JUMP_PEER_Y_SEP/,
  'cars at different heights must not create invisible 2D contacts');

assert.doesNotMatch(src,/กลับเข้าเส้นทางแล้ว/,'portal recovery must not show a road-blocking return banner');
assert.doesNotMatch(src,/⭐ BEST LAP!/,'Best Lap must remain in the HUD only, never as a center-screen banner');
assert.match(src,/thermalTargetFps=important\?45:\(active\?\(thermalLevel>=2\?30:\(thermalLevel===1\?36:45\)\):20\)/,
  'mobile thermal frame caps must remain intact');

console.log('PASS F1 fantasy jumps: optional ballistic routes, multiplayer air state, portal recovery and mobile GPU budget');
