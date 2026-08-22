'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const ROOT = path.resolve(__dirname, '..');
const read = rel => fs.readFileSync(path.join(ROOT, rel), 'utf8');
const exists = rel => fs.existsSync(path.join(ROOT, rel));
const walk = dir => fs.readdirSync(dir, {withFileTypes:true}).flatMap(entry => {
  const full = path.join(dir, entry.name);
  return entry.isDirectory() ? walk(full) : [full];
});

async function main(){
  const sources = [];
  const sandbox = {
    console,
    Image: class FakeImage {
      set src(value){ this._src=value; sources.push(value); if(this.onload) this.onload(); }
      get src(){ return this._src; }
    },
  };
  vm.createContext(sandbox);
  vm.runInContext(read('js/data/pets.js'), sandbox, {filename:'pets.js'});
  vm.runInContext(read('js/data/items.js'), sandbox, {filename:'items.js'});
  vm.runInContext(read('js/images.js'), sandbox, {filename:'images.js'});
  const pets = JSON.parse(vm.runInContext('JSON.stringify(PETS)', sandbox));
  const items = JSON.parse(vm.runInContext('JSON.stringify(ITEMS.map(i=>i.id))', sandbox));

  const prices = {
    elephant:2000000, meerkat:70000, tyrannosaurusRex:80000,
    toucan:480000, buffalo:100000, sikaDeer:70000,
  };
  for(const [pet, price] of Object.entries(prices)) assert.equal(pets[pet].price, price, `${pet} price`);
  assert.equal(Object.keys(pets).length, 9, 'catalog should contain 9 pet species');

  assert.equal(vm.runInContext("petAssetPath('elephant_baby_hungry')", sandbox),
    'img/animal/elephant_baby_hungry.webp');
  assert.equal(vm.runInContext("petAssetPath('toucan_adult_rainbow_hoodie')", sandbox),
    'img/AnimalWearItems/toucan_adult_rainbow_hoodie.webp');
  await vm.runInContext("probeImages(['sikaDeer_newborn','buffalo_adult_crown'])", sandbox);
  assert.equal(sources[0], 'img/animal/sikaDeer_newborn.webp?v=20260822-a');
  assert.equal(sources[1], 'img/AnimalWearItems/buffalo_adult_crown.webp?v=20260822-a');

  const animalDir = path.join(ROOT, 'img/animal');
  const wearDir = path.join(ROOT, 'img/AnimalWearItems');
  const animalFiles = walk(animalDir);
  const wearFiles = walk(wearDir);
  assert.equal(animalFiles.filter(file=>file.endsWith('.webp')).length, 153, '9 species × 17 animal states');
  assert.equal(wearFiles.filter(file=>file.endsWith('.webp')).length, 533, '504 full outfits + 28 catalog + 1 alternate reference');
  assert.equal(animalFiles.filter(file=>file.endsWith('.png')).length, 0, 'animal source PNGs must not ship');
  assert.equal(wearFiles.filter(file=>file.endsWith('.png')).length, 0, 'wear source PNGs must not ship');

  const starts = {dragon:'egg'};
  const adultStates = ['fat','happy','hungry','normal','normal_sleep','sick','strong','thin'];
  const babyStates = ['fat','happy','hungry','normal','normal_sleep','sick','strong','thin'];
  for(const pet of Object.keys(pets)){
    const start = starts[pet] || 'newborn';
    assert.ok(exists(`img/animal/${pet}_${start}.webp`), `${pet} ${start}`);
    for(const state of adultStates) assert.ok(exists(`img/animal/${pet}_adult_${state}.webp`), `${pet} adult ${state}`);
    for(const state of babyStates) assert.ok(exists(`img/animal/${pet}_baby_${state}.webp`), `${pet} baby ${state}`);
    for(const stage of ['adult','baby']){
      for(const item of items) assert.ok(exists(`img/AnimalWearItems/${pet}_${stage}_${item}.webp`), `${pet} ${stage} ${item}`);
    }
  }

  const warrior = [
    'armor_ancient_guardian','armor_aqua_mage','armor_arcane_royal','armor_desert_guardian',
    'armor_fire_emperor','armor_forest_guardian','armor_frost_knight','armor_royal_paladin',
    'armor_shadow_knight','armor_solar_paladin',
  ];
  for(const pet of Object.keys(pets)) for(const stage of ['adult','baby']) for(const item of warrior){
    assert.ok(exists(`img/AnimalWearItems/${pet}_${stage}_${item}.webp`), `${pet} ${stage} ${item}`);
  }
  console.log('PASS pet asset catalog: 9 species, 153 states, 504 outfits, exact attached prices');
}

main().catch(error=>{ console.error(error); process.exitCode=1; });
