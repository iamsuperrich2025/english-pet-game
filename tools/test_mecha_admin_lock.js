'use strict';
const assert=require('assert');
const fs=require('fs');

const ui=fs.readFileSync('js/ui.js','utf8');
const home=fs.readFileSync('js/home-v2.js','utf8');
const city=fs.readFileSync('js/city3d.js','utf8');

assert.match(ui,/function mechaAdminAllowed\(\)\{\s*return true;\s*\}/,
  'mechaAdminAllowed must always allow public play');
assert.doesNotMatch(ui,/w\.mode === ['"]mecha['"] && !mechaAdminAllowed\(\)/,
  'Rail click must not block mecha for non-admins');
assert.doesNotMatch(ui,/async function enterMecha3D\(\)\{[\s\S]{0,220}!mechaAdminAllowed\(\)/,
  'enterMecha3D must not refuse non-admins');
assert.doesNotMatch(ui,/โลกหุ่นรบกำลังทดสอบ/,
  'Mecha admin-only toast must be gone');

const adminSet=(home.match(/const ADMIN_ONLY_WORLD_ACTIONS = new Set\(\[([\s\S]*?)\]\)/)||[])[1]||'';
assert.ok(!/['"]worldMecha['"]/.test(adminSet),'Home V2 must open worldMecha to everyone');
assert.ok(/['"]wordship['"]/.test(adminSet),'Other admin worlds stay locked');

assert.doesNotMatch(city,/b\.go==='w3d_mecha'[\s\S]{0,80}!cityAdminAccess\(\)/,
  'City travel must allow public mecha');
assert.match(city,/\(b\.go==='wordship'\|\|b\.go==='skirmish'\) && !cityAdminAccess\(\)/,
  'City still locks wordship/skirmish for non-admins');

console.log('PASS mecha is public across Classic, Home V2, and City');
