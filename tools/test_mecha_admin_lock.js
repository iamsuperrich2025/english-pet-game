'use strict';
const assert=require('assert');
const fs=require('fs');

const ui=fs.readFileSync('js/ui.js','utf8');
const home=fs.readFileSync('js/home-v2.js','utf8');
const city=fs.readFileSync('js/city3d.js','utf8');
const auth=fs.readFileSync('js/auth.js','utf8');

assert.match(ui,/function mechaAdminAllowed\(\)/,'Classic must expose mechaAdminAllowed');
assert.match(ui,/function refreshMechaLock\(\)/,'Classic must refresh mecha lock after auth');
assert.match(ui,/w\.mode === ['"]mecha['"] && !mechaAdminAllowed\(\)/,'Rail click must block non-admins');
assert.match(ui,/async function enterMecha3D\(\)\{[\s\S]{0,220}!mechaAdminAllowed\(\)/,
  'enterMecha3D must refuse non-admins before loading');
assert.match(ui,/const WORLD3D_COMING_SOON\s*=\s*new Set\(\[[^\]]*['"]drive['"][^\]]*\]\)/,
  'Coming-soon set must still exist');
assert.doesNotMatch(ui,/const WORLD3D_COMING_SOON\s*=\s*new Set\(\[[^\]]*['"]mecha['"]/,
  'Mecha must not use tester coming-soon gate anymore');

const comingSoon=/const WORLD3D_COMING_SOON\s*=\s*new Set\(\[([^\]]+)]\)/.exec(ui);
assert.ok(comingSoon,'WORLD3D coming-soon registry must exist');
const lockedModes=[...comingSoon[1].matchAll(/['"]([^'"]+)['"]/g)].map(m=>m[1]);
assert.ok(!lockedModes.includes('mecha'),'Mecha must leave WORLD3D_COMING_SOON');
assert.ok(lockedModes.includes('moto'),'Motorbike must remain coming-soon for non-testers');

assert.match(home,/ADMIN_ONLY_WORLD_ACTIONS\s*=\s*new Set\(\[[^\]]*['"]worldMecha['"]/,
  'Home V2 must keep worldMecha admin-only');
assert.match(auth,/refreshMechaLock/,
  'syncAdminAccess must refresh mecha lock');

const citySoon=/const CITY_WORLD_COMING_SOON\s*=\s*new Set\(\[([^\]]+)]\)/.exec(city);
assert.ok(citySoon,'City coming-soon registry must exist');
const cityModes=[...citySoon[1].matchAll(/['"]([^'"]+)['"]/g)].map(m=>m[1]);
assert.ok(!cityModes.includes('w3d_mecha'),'City mecha must leave tester coming-soon');
assert.match(city,/b\.go==='w3d_mecha'[\s\S]{0,80}!cityAdminAccess\(\)/,
  'City travel must block non-admin mecha');

console.log('PASS mecha is admin-only across Classic, Home V2, and City');
