'use strict';

const assert = require('assert');
const fs = require('fs');

const ui = fs.readFileSync('js/ui.js', 'utf8');
const pets = fs.readFileSync('js/data/pets.js', 'utf8');
const lobby = fs.readFileSync('css/lobby.css', 'utf8');
const index = fs.readFileSync('index_classic.html', 'utf8');

const petKeys = [...pets.matchAll(/^  ([A-Za-z][A-Za-z0-9]*):\{/gm)].map(m=>m[1]);
assert.ok(petKeys.length >= 9, 'central PETS catalog unexpectedly incomplete');
assert.ok(ui.includes('function renderPetMarketShop(){'), 'Market pet renderer missing');
assert.ok(ui.includes('Object.keys(PETS).map(key=>{'), 'Market must render every central PETS entry');
assert.ok(/\$\{renderRobotShop\(\)\}\s+\$\{renderPetMarketShop\(\)\}/.test(ui), 'pet catalog must be immediately below robots');
assert.ok(ui.includes('id="mkt-pets"'), 'Market pet section anchor missing');
assert.ok(ui.includes('class="mkt-pet-list strip-x grid2x8"'), 'pet catalog must keep swipeable 2-row market layout');
assert.ok(ui.includes("IMG_FILES[startImgKey(key)]"), 'Market pet cards must reuse original starting images');
assert.ok(ui.includes("hasPetType(key)"), 'owned pet type guard missing');
assert.ok(ui.includes('function openPetPurchase(key){'), 'shared pet purchase authority missing');
assert.strictEqual((ui.match(/state\.coins -= conf\.price;/g)||[]).length, 1, 'pet charge logic must have one authority');
assert.strictEqual((ui.match(/state\.pets\.push\(newPet\(key, name\)\);/g)||[]).length, 1, 'pet creation logic must have one authority');
assert.ok(ui.includes("card.addEventListener('click', ()=>openPetPurchase(card.dataset.pet))"), 'original pet shop does not use shared purchase flow');
assert.ok(ui.includes("openPetPurchase(b.dataset.pet)"), 'Market pet cards do not use shared purchase flow');
assert.ok(ui.includes("sellInc('pet_'+key)"), 'pet sales counter missing from shared flow');
assert.ok(ui.includes("askNameDialog({"), 'mandatory pet naming dialog missing');
assert.ok(ui.includes("showScreen('screen-dashboard')"), 'post-purchase dashboard route missing');
assert.ok(lobby.includes('🐾 รอบ 1317') && lobby.includes('.mkt-pet-card'), 'Market pet presentation CSS missing');
assert.ok(lobby.includes('.mkt-pet-card.owned-pet') && lobby.includes('.mkt-pet-card.cant-afford'), 'owned/affordability states missing');
assert.ok(index.includes('css/lobby.css?v=1317') && index.includes('js/ui.js?v=1317'), 'Market pet cache-bust missing');

console.log(`PASS market pet catalog: all ${petKeys.length} PETS entries render below robots and share one guarded purchase flow`);
