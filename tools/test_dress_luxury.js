'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.resolve(__dirname, '..');
const read = rel => fs.readFileSync(path.join(root, rel), 'utf8');
const assert = (ok, message) => { if(!ok) throw new Error(message); };

const premiumIds = [
  'flower_beret','heart_glasses','aviator_goggles','pearl_collar','star_tiara',
  'moon_hat','rainbow_hoodie','explorer_vest','galaxy_pajamas','royal_cape',
];

const itemContext = {};
vm.createContext(itemContext);
vm.runInContext(read('js/data/items.js') + '\nthis.TEST_ITEMS = ITEMS;', itemContext);
const items = itemContext.TEST_ITEMS;
assert(items.length === 18, `expected 18 dress items, got ${items.length}`);
premiumIds.forEach(id=>{
  const item = items.find(x=>x.id === id);
  assert(item, `missing item ${id}`);
  assert(item.img && item.emoji && item.rarity, `${id} must have img, emoji and rarity`);
  assert(['head','face','neck','body'].includes(item.slot), `${id} has unsupported slot`);
  const file = path.join(root, item.img);
  assert(fs.existsSync(file), `missing image ${item.img}`);
  const png = fs.readFileSync(file);
  assert(png.length > 100000, `${item.img} looks unexpectedly small`);
  assert(png.subarray(1,4).toString() === 'PNG', `${item.img} is not PNG`);
  assert(png.readUInt32BE(16) === 768 && png.readUInt32BE(20) === 768, `${item.img} must be 768x768`);
  assert(png[25] === 6, `${item.img} must be RGBA PNG`);
});

const wearContext = {};
vm.createContext(wearContext);
vm.runInContext(read('js/data/wear.js') + '\n' + read('js/data/wear_extra.js') + '\nthis.TEST_WEAR = WEAR_PIECE;', wearContext);
const wear = wearContext.TEST_WEAR;
premiumIds.forEach(id=>{
  assert(wear['all_'+id], `missing future-pet fallback all_${id}`);
  ['dog','cat','dragon'].forEach(pet=>assert(wear[pet+'_'+id], `missing ${pet}_${id}`));
});

const ui = read('js/ui.js');
const images = read('js/images.js');
const css = read('css/lobby.css');
const index = read('index_classic.html');
const build = read('tools/build_web.mjs');
assert((ui.match(/p\.equipped = \{\};/g) || []).length === 2, 'equip toggle must clear all slots and keep one-item rule');
assert(!ui.includes('p.equipped = {head:null, face:null, neck:null}'), 'old hard-coded slots remain');
assert(images.includes("WEAR_PIECE[`all_${worn.id}`]"), 'future-pet wear fallback missing');
assert(css.includes('grid-template-columns:repeat(9') && css.includes('grid-template-columns:repeat(5'), 'responsive 9x2 / 5x4 grids missing');
assert(css.includes('.shop-item.rarity-legendary'), 'rarity styling missing');
assert(index.indexOf('js/data/wear.js') < index.indexOf('js/data/wear_extra.js') && index.indexOf('js/data/wear_extra.js') < index.indexOf('js/images.js'), 'wear script order is wrong');
assert(build.includes("'js/data/wear_extra.js'") && build.includes("'img/wear/premium'"), 'untracked premium assets are not protected by the production build allowlist');

console.log(`PASS dress luxury: ${items.length} items, ${premiumIds.length} premium RGBA assets, 3 pet profiles + future fallback`);
