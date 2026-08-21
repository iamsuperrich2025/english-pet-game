/* Phase 1 regression: selector preference/contract + single-scene integration guards. */
'use strict';
const assert=require('assert');
const fs=require('fs');
const path=require('path');
const vm=require('vm');
const root=path.resolve(__dirname,'..');
const store=new Map();
const context={localStorage:{getItem:k=>store.has(k)?store.get(k):null,setItem:(k,v)=>store.set(k,String(v))}};
context.window=context; context.globalThis=context;
vm.createContext(context);
vm.runInContext(fs.readFileSync(path.join(root,'js/f1_modes.js'),'utf8'),context,{filename:'f1_modes.js'});
const M=context.F1Modes;

assert.strictEqual(M.getSelectedMode(),'battery','default must preserve current Battery Saver scene');
assert.strictEqual(M.ENTRY_MODE,'quality','public entry must force Realistic Circuit');
assert.strictEqual(M.SELECTOR_ENABLED,false,'mode selector must remain temporarily hidden');
assert.strictEqual(M.setSelectedMode('quality'),'quality');
assert.strictEqual(M.getSelectedMode(),'quality','preference must persist locally');
assert.strictEqual(M.setSelectedMode('bad-value'),'battery','unknown preference must fail safe');
assert.strictEqual(M.getSelection('quality').environment.contract,M.CONTRACT);
assert.strictEqual(M.PROFILES.battery.environment.assetSet,'f1-current');
for(const id of ['battery','quality']){
  const p=M.PROFILES[id];
  assert.strictEqual(p.ownership.instancePolicy,'single');
  assert.strictEqual(p.ownership.switchPolicy,'mutate-shared-scene');
  assert.strictEqual(p.shared.physics,'f1-shared-v1');
  assert.strictEqual(p.shared.gameplay,'f1-shared-v1');
  assert.strictEqual(p.shared.multiplayer,'netroom-f1-v1');
  assert.ok(fs.existsSync(path.join(root,M.MODES[id].preview)),`missing preview: ${M.MODES[id].preview}`);
}

const ui=fs.readFileSync(path.join(root,'js/ui.js'),'utf8');
const f1=fs.readFileSync(path.join(root,'js/f1_3d.js'),'utf8');
const mode=fs.readFileSync(path.join(root,'js/f1_modes.js'),'utf8');
assert.ok(!/F1Modes\.openSelector\(\{onContinue:/.test(ui),'public F1 click must not show the graphics selector');
assert.ok(/F1Modes\.setSelectedMode\(F1Modes\.ENTRY_MODE\|\|'quality'\)/.test(ui),
  'public F1 click must select Realistic Circuit before the entry-fee dialog');
assert.ok(/F1Modes\.getSelection\(F1Modes\.ENTRY_MODE\|\|'quality'\)/.test(ui),
  'runtime start must keep Realistic Circuit even if an older Battery preference exists');
assert.ok(/F1World\.start\(graphics\?\{graphicsMode:graphics\.id,environmentProfile:graphics\.environment\}/.test(ui),
  'selected environment profile must cross the UI/runtime boundary');
assert.strictEqual((f1.match(/new THREE\.Scene\(/g)||[]).length,1,'F1 runtime must own exactly one scene');
assert.strictEqual((f1.match(/new THREE\.WebGLRenderer\(/g)||[]).length,1,'F1 runtime must own exactly one renderer');
assert.ok(/if\(running\) return;/.test(f1),'repeat start must not create a second animation loop');
assert.ok(!/(firebase|\.ref\(|authWrite|database\()/i.test(mode),'mode module must not write Firebase');
assert.ok(!/(physTick|netJoin|netSend|REWARD|LETTER_COIN)\s*=/.test(mode),'mode module must not duplicate gameplay/network state');
console.log('PASS f1_modes Phase 1: preference, contracts, entry order, single scene/renderer, no Firebase/gameplay duplication');
