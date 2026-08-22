/* รอบ 1229 — structural regression for Vocab Sky Playground (no browser dependency). */
"use strict";
const fs=require('fs'),path=require('path'),root=path.resolve(__dirname,'..');
const sky=fs.readFileSync(path.join(root,'js/skyplay3d.js'),'utf8');
const ui=fs.readFileSync(path.join(root,'js/ui.js'),'utf8');
const net=fs.readFileSync(path.join(root,'js/netroom.js'),'utf8');
const rules=fs.readFileSync(path.join(root,'handoff/RULES.md'),'utf8');
const html=fs.readFileSync(path.join(root,'index_classic.html'),'utf8');
function ok(cond,msg){if(!cond)throw new Error(msg);console.log('PASS',msg);}
ok(/window\.SkyPlayground3D=\{start,stop,_t:/.test(sky),'engine exposes lifecycle and test hooks');
ok(/map:'sky',roomMax:ROOM_MAX/.test(sky)&&/const TAU=.*ROOM_MAX=6/.test(sky),'NetRoom instance is isolated and capped at 6');
ok(/activePet/.test(sky)&&/petStage/.test(sky)&&/currentPetImg/.test(sky),'pet reuses active Lobby pet and real stage image');
ok(/playerStyle='soft-cuboid-chibi-3d'/.test(sky),'visible players use Soft Cuboid Chibi 3D');
ok(/speakWord/.test(sky)&&/vocabForStudent/.test(sky)&&/questEvent\('word3d'/.test(sky),'vocabulary reuses data, pronunciation and shared quest event');
ok(/addCoins\(20\)/.test(sky)&&/first\?100:20/.test(sky),'stars and route completion use main coins');
ok(/kind:'bounce'/.test(sky)&&/rotators\.forEach\(r=>/.test(sky)&&/kind==='disappear'/.test(sky),'sample Obby includes bounce, rotating, moving and disappearing obstacles');
ok((sky.match(/authPushSave\(true\)/g)||[]).length>=2,'completion and exit request cloud sync');
ok(/mode:'sky'.*enter:enterSkyPlayground3D/.test(ui),'WORLD3D registry owns the entrance');
ok(/css\/skyplay3d\.css/.test(html),'classic shell loads isolated world CSS');
ok(/\['adv','sky','haunt'/.test(net),'friend-location scan includes sky map');
ok((rules.match(/\$map === 'sky'/g)||[]).length===3&&/newData\.val\(\) === 'sky'/.test(rules),'Rules allow sky only in world/wroom/winfo/tinv enums');
ok(!/Adventure3D\.|InvasionWorld\./.test(sky),'new engine does not mutate protected worlds');
console.log('Vocab Sky Playground structural regression passed');
