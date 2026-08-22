'use strict';
const assert=require('assert');
const fs=require('fs');
const src=fs.readFileSync('js/f1_3d.js','utf8');

assert.match(src,/<canvas class="destination" width="480" height="270"><\/canvas>/,
  'portal needs a lightweight destination canvas inside its ring');
assert.match(src,/function drawPortalDestination\(targetIdx\)[\s\S]*LINE\.tx\[idx\]/,
  'destination view must orient itself from the actual target tangent');
assert.match(src,/function drawPortalDestination\(targetIdx\)[\s\S]*LINE\.x\[j\]-LINE\.x\[idx\]/,
  'destination road must be projected from actual circuit samples');
assert.match(src,/portalTargetIdx=nearIdx\(px,pz,myIdx\);\s*drawPortalDestination\(portalTargetIdx\);/,
  'destination must refresh at the exact recovery point whenever the portal opens');
assert.match(src,/#f1-portal\.jump \.gate\{opacity:\.82;/,
  'energy ring must remain visible while the car crosses the portal');
assert.doesNotMatch(src,/#f1-portal\.jump\{[^}]*#fff 0/,
  'warp phase must never replace the scene with a flat white/pink fullscreen fill');
assert.match(src,/#f1-portal \.frame\{[\s\S]*clip-path:polygon/,
  'portal needs a lightweight sci-fi outer frame');
assert.match(src,/@media\(max-width:700px\)[\s\S]*\.sparks i:nth-child\(even\)\{display:none\}/,
  'mobile must render only half of the CSS streak particles');
assert.doesNotMatch(src,/WebGLRenderTarget|EffectComposer|UnrealBloomPass|ShaderPass/,
  'portal must not introduce render targets or post-processing');
assert.match(src,/portalT>=\.68/,'existing teleport timing must remain unchanged');
assert.match(src,/portalT>=1\.16/,'existing portal close timing must remain unchanged');

console.log('PASS F1 3D portal destination view, persistent energy ring and mobile budget');
