"use strict";
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const root = path.resolve(__dirname, '..');
const ui = fs.readFileSync(path.join(root, 'js/ui.js'), 'utf8');
const images = fs.readFileSync(path.join(root, 'js/images.js'), 'utf8');
const css = fs.readFileSync(path.join(root, 'css/lobby.css'), 'utf8');
const behavior = fs.readFileSync(path.join(root, 'js/petbehavior.js'), 'utf8');

function ok(cond, msg){ if(!cond) throw new Error(msg); console.log('PASS', msg); }

for(const pet of ['dog','cat','dragon']){
  const file = path.join(root, 'img/bond', `bond_${pet}.webp`);
  ok(fs.existsSync(file), `${pet} bond backplate exists`);
  ok(fs.statSync(file).size < 150000, `${pet} backplate stays lightweight`);
  ok(ui.includes(`img/bond/bond_${pet}.webp`), `${pet} backplate is wired to UI`);
}
ok(images.includes('Object.values(p.equipped || {})'), 'future outfit slots are data-driven');
{
  const source = images.match(/function equippedItem\(p\)\{[\s\S]*?\n\}/)[0];
  const ctx = {ITEMS:[{id:'future_coat',name:'เสื้อคลุม',slot:'body'}],activePet:()=>null};
  vm.runInNewContext(source, ctx);
  ok(ctx.equippedItem({equipped:{body:'future_coat'}}).id === 'future_coat', 'future body clothing slot resolves at runtime');
}
ok(ui.includes("bondCf.bg || cf.bg || ''"), 'future pet species support optional PETS[type].bond metadata');
ok(ui.includes("|| {lead:`${n}รักบ้านของเรา`"), 'future pet species have generic bonding copy');
ok(ui.includes('homeVisualHTML(h, \'bond-home-img\''), 'current home image/state is used in bond scene');
ok(ui.includes('กำลังใส่ <b>${escapeHTML(worn.name)}</b>'), 'current accessory or clothing name stays visible');
ok(ui.includes('function petOutfitMotionHTML(p, stage)'), 'outfits use anchored two-pose cartoon motion');
ok(ui.includes("petWearOverlay(p, poseB)"), 'happy pose receives the same current outfit');
ok(css.includes('PET BOND SCENE รอบ 1152'), '2.5D bond scene CSS zone exists');
ok(css.includes('@keyframes cartoonPoseB'), 'outfit pose crossfade animation exists');
ok(css.includes('@keyframes psSeqInbetween'), 'sprite fallback adds smooth in-between body motion');
ok(behavior.includes("'cuddle','care'"), 'pet behavior engine includes cuddle and care states');
ok(behavior.includes("cuddle:'🥺 กำลังอ้อนหนู'"), 'cuddle state has a visible label');
ok(behavior.includes("care:'💛 กำลังเป็นห่วงหนู'"), 'care state has a visible label');
ok(ui.includes('function petBondActionLine(p, stateName)'), 'species-specific cuddle and care copy exists');
ok(ui.includes('const PET_BOND_TALK_MS = 60 * 1000'), 'each pet message remains visible for one minute');
ok(ui.includes('const __petBondTalkSlots = new WeakMap()'), 'speech timing is isolated per rendered pet card');
ok(ui.includes("if(stateName === 'care') return 3"), 'health-care speech has highest queue priority');
ok(ui.includes("if(stateName === 'cuddle') return 2"), 'affection speech has priority over generic behavior');
ok(ui.includes("e=>queuePetBondTalk(card, p, e.detail.state)"), 'fast animation changes queue speech instead of replacing it immediately');
ok(ui.includes('if(!card.isConnected) return'), 'detached pet cards do not update after their timer fires');
ok(css.includes('.bond-owner{left:-1%;height:min(44%,102px)}'), 'compact caretaker stays clear of nearby status text');
ok(ui.includes("stateName === 'cuddle'"), 'bond bubble reacts to cuddle state');
ok(ui.includes("stateName === 'care'"), 'bond bubble reacts to care state');
{
  const tipBlock = ui.match(/const PET_HEALTH_TIPS = Object\.freeze\(\[[\s\S]*?\n\]\);/);
  ok(!!tipBlock, 'care state has a health-science tip library');
  ok((tipBlock[0].match(/\{lead:/g) || []).length >= 30, 'health-science library has at least 30 varied tips');
  for(const topic of ['น้ำ','เค็ม','น้ำตาล','ล้างมือ','นอน','สายตา','เคลื่อนไหว'])
    ok(tipBlock[0].includes(topic), `health-science library covers ${topic}`);
}
ok(ui.includes("localStorage.setItem('vwPetHealthTipCursor'"), 'health tips rotate across visits instead of repeating');
ok(ui.includes("stateName === 'care' ? '🔬"), 'care bubble identifies health-science content');
ok(css.includes('@keyframes pbCuddle'), 'cuddle body animation exists');
ok(css.includes('@keyframes pbCare'), 'care body animation exists');
ok(css.includes('html.no-anim .bond-owner'), 'no-animation setting stops bond motion');
console.log('Pet bond regression checks passed.');
