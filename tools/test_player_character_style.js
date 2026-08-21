'use strict';
const fs=require('fs');
const assert=require('assert');
const src=fs.readFileSync('js/adventure3d.js','utf8');
const preview=fs.readFileSync('tools/player_character_style_preview.html','utf8');
const standard=fs.readFileSync('docs/PLAYER_CHARACTER_STYLE.md','utf8');

assert(src.includes("playerStyle='soft-cuboid-chibi-3d'"),'standard figures must identify the canonical style');
assert(src.includes("playerStyle='legacy-adventure'"),'Adventure must keep an explicit legacy identity');
assert(src.includes('function softCuboidGeo(w,h,d,r)'),'rounded cuboid geometry helper must exist');
assert(src.includes('new THREE.BoxGeometry(w,h,d,2,2,2)'),'soft geometry must keep low subdivision for mobile');
assert(src.includes('g.userData.softCuboid=true'),'soft geometry must be inspectable in runtime QA');
assert(src.includes('function softFaceAtlasGeo(w,h,d,r)'),'standard heads must share a one-material face atlas geometry');
assert(src.includes('g.userData.faceAtlas=true'),'face atlas geometry must be inspectable in runtime QA');
assert(src.includes('grantQaTickets:()=>{ state.driveTicket=true; state.hauntTicket=true; state.soccerTicket=true; }'),'visual QA may grant only the three P0 tickets in memory');

const legacy=src.slice(src.indexOf('function makeLegacyAdventureFigure'),src.indexOf('function makeSoftCuboidChibiFigure'));
assert(legacy.includes('blkGeo('),'legacy Adventure must retain the original hard-box builder');
assert(!legacy.includes('softCuboidGeo('),'legacy Adventure must not inherit the new standard geometry');

const peerRoute=src.slice(src.indexOf('function onPeerData'),src.indexOf('function disposeHeliMesh'));
assert(peerRoute.includes("const legacyWalk=(mode==='adv')"),'Adventure peer route must be explicit');
assert(peerRoute.includes("const softWalk=(mode==='haunt'||mode==='soccer')"),'Hotel and Soccer peers must use the standard route');
assert(peerRoute.includes('makeLegacyAdventureWalkPeer'),'Adventure peers must call the legacy builder');
assert(peerRoute.includes('makeSoftChibiWalkPeer'),'Hotel/Soccer peers must call the standard builder');

const payload=src.slice(src.indexOf('function sendPos'),src.indexOf('function netHonk'));
assert(payload.includes("((M.drive||mode==='adv'||mode==='haunt')&&state.blockAv)"),'multiplayer avatar payload contract must remain unchanged');
assert(!payload.includes('playerStyle'),'visual metadata must never enter the multiplayer payload');

const soccer=src.slice(src.indexOf('function makeSoccerPlayer'),src.indexOf('function soccerNewSpot'));
assert(soccer.includes('softCuboidGeo('),'local Soccer player must use the standard geometry');
assert(soccer.includes("softFaceAtlasMat('blk1')"),'Soccer player must keep the friendly face in one draw slot');
assert(!soccer.includes("[skin,skin,skin,skin,skin,blkFaceMat('blk1')]"),'Soccer head must not regress to six material groups');
assert(preview.includes('data-mode="drive"')&&preview.includes('data-mode="haunt"')&&preview.includes('data-mode="soccer"'),'visual QA must cover every P0 mode');
assert(preview.includes('viewport:[w.innerWidth,w.innerHeight]'),'visual QA must report the exact game viewport');
assert(preview.includes('standard draw '),'visual QA must compare standard and legacy draw budgets');
assert(preview.includes("report.local.drawSlots+'/19'")&&preview.includes('report.local.drawSlots===19'),'visual QA must enforce the pre-P0 Soccer draw budget');
assert(standard.includes('| P0 ✅ | Drive, Haunted Hotel, and Soccer'),'migration register must record P0 completion');
assert(standard.includes('makeLegacyAdventureFigure()'),'migration register must retain the Adventure exception path');

console.log('✅ player character style: P0 routes, legacy isolation, payload, mobile geometry budget');
