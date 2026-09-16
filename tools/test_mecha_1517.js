'use strict';
const fs=require('fs');
const path=require('path');
const a=fs.readFileSync('js/adventure3d.js','utf8');
const assert=(ok,m)=>{ if(!ok){ console.error('FAIL',m); process.exit(1); } console.log('ok',m); };

assert(fs.existsSync(path.join('sound/robot','bgm.mp3')),'bgm asset on disk');
assert(a.includes("file:'bgm.mp3'"),'bgm clip meta');
assert(a.includes("hash:'55c48aa88a519fcb'"),'content-hash for cache');
assert(a.includes('loadBgm')&&a.includes('startBgm')&&a.includes('stopBgm'),'bgm API');
assert(a.includes("caches.open('vw-assets-content-v1')"),'cache storage reuse');
assert(a.includes('MechaAudio.startBgm()'),'start on mecha enter');
assert(a.includes('MechaAudio.stopBgm'),'stop on exit');
assert(!/prepareFire[\s\S]{0,400}bgm\.mp3/.test(a),'bgm not in prepareFire preload list');
assert(a.includes("preload='none'")&&a.includes('createObjectURL'),'blob stream not PCM decode');
assert(a.includes('รอบ 1517')||a.includes('Round 1517'),'round mark');

console.log('mecha-1517 lazy cached BGM checks passed');
