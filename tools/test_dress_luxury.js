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
const warriorIds = [
  'armor_ancient_guardian','armor_aqua_mage','armor_arcane_royal','armor_desert_guardian',
  'armor_fire_emperor','armor_forest_guardian','armor_frost_knight','armor_royal_paladin',
  'armor_shadow_knight','armor_solar_paladin',
];

const itemContext = {};
vm.createContext(itemContext);
vm.runInContext(read('js/data/items.js') + '\nthis.TEST_ITEMS = ITEMS;', itemContext);
const items = itemContext.TEST_ITEMS;
assert(items.length === 28, `expected 28 dress items, got ${items.length}`);
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
warriorIds.forEach(id=>{
  const item = items.find(x=>x.id === id);
  assert(item && item.knownWear === true, `${id} must use on-demand knownWear loading`);
  assert(item.slot === 'body' && item.rarity === 'legendary', `${id} must be a legendary body outfit`);
  assert(item.img.endsWith(`/catalog/${id}.webp`), `${id} catalog path mismatch`);
  const webp = fs.readFileSync(path.join(root, item.img));
  assert(webp.subarray(0,4).toString() === 'RIFF' && webp.subarray(8,12).toString() === 'WEBP', `${item.img} is not WebP`);
  const width = webp[24] + (webp[25]<<8) + (webp[26]<<16) + 1;
  const height = webp[27] + (webp[28]<<8) + (webp[29]<<16) + 1;
  assert(width === 768 && height === 768, `${item.img} must be 768x768`);
});

const wearContext = {};
vm.createContext(wearContext);
vm.runInContext(read('js/data/wear.js') + '\n' + read('js/data/wear_extra.js') + '\nthis.TEST_WEAR = WEAR_PIECE;', wearContext);
const wear = wearContext.TEST_WEAR;
premiumIds.forEach(id=>{
  assert(wear['all_'+id], `missing future-pet fallback all_${id}`);
  ['dog','cat','dragon'].forEach(pet=>assert(wear[pet+'_'+id], `missing ${pet}_${id}`));
});
['cat','dog','dragon'].forEach(pet=>{
  const cape = wear[pet+'_royal_cape'];
  assert(cape.size === 1.75 && cape.y === -0.08,
    `${pet} royal cape must stay fitted to the torso instead of flaring over limbs`);
});

const ui = read('js/ui.js');
const images = read('js/images.js');
const css = read('css/lobby.css');
const index = read('index_classic.html');
const build = read('tools/build_web.mjs');
assert((ui.match(/p\.equipped = \{\};/g) || []).length === 1, 'wardrobe equip toggle must clear all slots and keep one-item rule');
assert(!/state\.coins\s*-=\s*item\.price/.test(ui), 'wardrobe must not sell clothing directly');
assert(ui.includes("enterPetShopping3D('fashion')"), 'unowned clothing must route to the 3D fashion store');
assert(ui.includes("PetPantry.openStore('fashion',{closet:true})"), 'Lobby wardrobe must open the large shared fashion catalog');
assert(!ui.includes('p.equipped = {head:null, face:null, neck:null}'), 'old hard-coded slots remain');
assert(images.includes("WEAR_PIECE[`all_${worn.id}`]"), 'future-pet wear fallback missing');
assert(css.includes('grid-template-columns:repeat(9') && css.includes('grid-template-columns:repeat(5'), 'responsive 9x2 / 5x4 grids missing');
assert(css.includes('.shop-item.rarity-legendary'), 'rarity styling missing');
assert(index.indexOf('js/data/wear.js') < index.indexOf('js/data/wear_extra.js') && index.indexOf('js/data/wear_extra.js') < index.indexOf('js/images.js'), 'wear script order is wrong');
assert(build.includes("'js/data/wear_extra.js'") && build.includes("'img/wear/premium'"), 'untracked premium assets are not protected by the production build allowlist');

console.log(`PASS dress luxury: ${items.length} items, ${premiumIds.length} premium + ${warriorIds.length} warrior outfits`);
