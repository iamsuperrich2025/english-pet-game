'use strict';
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const read = rel => fs.readFileSync(path.join(root, rel), 'utf8');
const assert = (ok, message) => { if(!ok) throw new Error(message); };

const index = read('index_classic.html');
const state = read('js/state.js');
const ui = read('js/ui.js');
const main = read('js/main.js');
const auth = read('js/auth.js');
const game = read('js/game.js');
const build = read('tools/build_web.mjs');
const petData = read('js/data/petshopping.js');
const lobbyCss = read('css/lobby.css');

assert(index.indexOf('js/data/petshopping.js') > index.indexOf('js/data/pets.js'), 'pet-shopping data must load after foods');
assert(index.indexOf('js/data/petshopping.js') < index.indexOf('js/state.js'), 'pet-shopping data must load before state migration');
assert(index.indexOf('<script src="js/petpantry.js') < index.indexOf('<script src="js/main.js'), 'pantry API must be ready before boot notices');
assert(index.includes('css/petpantry.css') && index.includes('css/petshopping3d.css'), 'new responsive styles are not linked');

assert(state.includes('migratePetShoppingState(s)'), 'pantry/grant state migration is missing');
assert(state.includes('petShoppingGrantVer:0') && state.includes('petShoppingGrantNotice:null'), 'idempotent grant markers are missing');
assert(/oldVer\s*<\s*ver/.test(state) && /s\.coins\s*=.*\+\s*amount/.test(state), 'one-time grant version gate is missing');
assert(/if\(state\.petPantry && state\.petPantry\.shelfId\)/.test(state), 'shelf is not counted as an asset');
assert(!/stockValue\(/.test(state.slice(state.indexOf('function assetValue'), state.indexOf('function netWorth'))), 'food stock must not inflate net worth');

const feedStart = ui.indexOf('function feedWith');
const feedEnd = ui.indexOf('\nfunction ', feedStart + 20);
const feed = ui.slice(feedStart, feedEnd > feedStart ? feedEnd : feedStart + 5000);
assert(feed.includes('PetPantry.take'), 'feeding must atomically take one stocked item');
assert(!/state\.coins\s*[-+]=/.test(feed), 'feeding must not debit coins directly');
assert(ui.includes("enterPetShopping3D('food')") && ui.includes("enterPetShopping3D('fashion')"), 'both shopping-trip CTAs must be wired');
assert(!/state\.coins\s*-\s*=\s*item\.price/.test(ui), 'wardrobe still has a direct-purchase escape path');

assert(/const rental\s*=\s*!\(state\.cars/.test(ui), 'no-car rental decision is missing');
assert(/PET_SHOP_FOOD_TRIP_FEE\s*=\s*0/.test(petData), 'food-shopping car fee must be zero');
assert(ui.includes("carId:own ? own.id : 'car_01'") && ui.includes('if(rental && fee > 0)') && ui.includes('state.coins -= fee'), 'fashion rental transaction or free-food guard is missing');
assert(ui.indexOf('PetShopping3D.start') < ui.indexOf('state.coins -= fee', ui.indexOf('PetShopping3D.start')), 'rental fee must be charged only after world start');
assert(ui.includes('ยืมรถไปซื้ออาหารฟรี') && ui.includes('ไม่มีการหักค่ารถ'), 'free food-trip copy or failure guarantee is missing');

const shoppingEntry = ui.slice(ui.indexOf('async function enterPetShopping3D'), ui.indexOf('async function enterDrive3D'));
assert(!/\.sick|hungerSickLock/.test(shoppingEntry), 'sickness must never block food-shopping entry');
assert(ui.includes('pi-close-top') && ui.includes('pi-close-bottom') && ui.includes("querySelectorAll('.pi-close-control')"), 'pet info needs working top and bottom close controls');
assert(lobbyCss.includes('grid-template-rows:minmax(0,1fr) auto') && lobbyCss.includes('touch-action:pan-y') && lobbyCss.includes('.pi-close-bottom'), 'pet info hidden-scroll layout or bottom close style is missing');

assert(main.includes('showPetShoppingGrantNotice') && main.includes('data-pet-shopping-grant'), 'persistent grant notice is missing');
assert(main.includes('state.petShoppingGrantNotice = null') && main.includes("querySelector('.rankup-btn').addEventListener('click'"), 'grant notice must clear only on acknowledgement');
assert(!main.includes("petShoppingGrantNotice = null;\n  document.body.appendChild"), 'grant notice appears to clear before acknowledgement');

// Regression: sickness may suppress EXP/abilities, but must not gate ordinary coin earning or cloud sync.
const addCoins = state.slice(state.indexOf('function addCoins'), state.indexOf('\nfunction ', state.indexOf('function addCoins') + 20));
assert(!/sick/.test(addCoins), 'addCoins unexpectedly blocks earning while a pet is sick');
assert(!/sick/.test(auth.slice(auth.indexOf('function authPushSave'), auth.indexOf('\nfunction ', auth.indexOf('function authPushSave') + 20))), 'cloud save unexpectedly blocks while sick');
assert(game.includes('ยังได้เหรียญตามปกติ') || !/if\([^)]*sick[^)]*\)[^{]*\{[^}]*addCoins/.test(game), 'game coin reward appears sickness-gated');

['js/data/petshopping.js','js/petpantry.js','js/petshopping3d.js','css/petpantry.css','css/petshopping3d.css',
 'img/pet-shopping/food_window.webp','img/pet-shopping/fashion_window.webp','img/pet-shopping/pantry_grant.webp']
  .forEach(rel=>assert(build.includes(`'${rel}'`), `untracked delivery file missing from build allowlist: ${rel}`));

console.log('PASS pet-shopping integration: sick purchase, free food-trip car, readable hidden-scroll pet info, fashion rental, persistent grant');
