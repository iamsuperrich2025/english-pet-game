'use strict';
const fs=require('fs');
const a=fs.readFileSync('js/adventure3d.js','utf8');
const assert=(ok,m)=>{ if(!ok){ console.error('FAIL',m); process.exit(1); } console.log('ok',m); };

assert(a.includes("file:'fire.mp3'"),'uses fire.mp3');
assert(a.includes("dir:'/sound/robot/'"),'robot path');
assert(a.includes('hash:\'6cc1dcf3aaf465f9\''),'fire.mp3 content hash');
assert(a.includes('sliceMs:320'),'truncates long clip per shot');
assert(/sliceMs>0[\s\S]{0,220}el\.pause\(\)/.test(a),'stops after one-shot slice');
assert(!/file:'MissileLaunch\.mp3'/.test(a),'MissileLaunch no longer fire SFX');
assert(a.includes("playClip('launch')"),'FIRE still uses launch slot');
assert(fs.existsSync('sound/robot/fire.mp3'),'fire.mp3 on disk');
assert(/function mechaFire[\s\S]{0,280}MechaAudio\.fire/.test(a),'one MechaAudio.fire per mechaFire');

console.log('mecha-1487 fire.mp3 one-shot slice checks passed');
