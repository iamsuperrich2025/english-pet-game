"use strict";

const assert = require("assert");
const crypto = require("crypto");
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const ROOT = path.resolve(__dirname, "..");
const read = rel => fs.readFileSync(path.join(ROOT, rel), "utf8");
const context = vm.createContext({console});
for(const rel of ["js/data/cakes2026.js", "js/data/collectibles.js", "js/data/gifts.js"]){
  vm.runInContext(read(rel), context, {filename:rel});
}
const snapshot = JSON.parse(vm.runInContext(
  "JSON.stringify({cakes:NEW_CAKES_2026, collectibles:COLLECTIBLES, gifts:GIFTS})",
  context
));

assert.equal(snapshot.cakes.length, 103, "new cake count");
assert.equal(new Set(snapshot.cakes.map(c=>c.id)).size, 103, "cake ids unique");
assert.equal(new Set(snapshot.cakes.map(c=>c.name)).size, 103, "cake names unique");

const byCollect = new Map(snapshot.collectibles.map(c=>[c.id, c]));
const byGift = new Map(snapshot.gifts.map(g=>[g.id, g]));
for(const [index, cake] of snapshot.cakes.entries()){
  const serial = String(index + 1).padStart(3, "0");
  assert.equal(cake.id, `cake2026_${serial}`);
  assert.equal(cake.image, `img/collectibles/cakes2026/cake_${serial}_256.webp`);
  assert.equal(cake.displayImage, `img/collectibles/cakes2026/cake_${serial}.webp`);
  assert.ok(cake.price >= 12000 && cake.price <= 40000, `${cake.id} factory price`);
  assert.ok(cake.giftPrice >= 3500 && cake.giftPrice <= 22000, `${cake.id} gift price`);
  const expectedTier = cake.price >= 25000 ? "epic" : "rare";
  assert.equal(cake.tier, expectedTier, `${cake.id} tier`);
  assert.equal(cake.words, Math.round(cake.price / (expectedTier === "epic" ? 80 : 50)), `${cake.id} words`);

  const collect = byCollect.get(cake.id);
  const gift = byGift.get(cake.id);
  assert.ok(collect && gift, `${cake.id} appears in factory and gifts`);
  assert.equal(collect.cat, "food");
  assert.equal(collect.price, cake.price);
  assert.equal(gift.cat, "cake");
  assert.equal(gift.price, cake.giftPrice);
  assert.equal(collect.image, gift.image);
  assert.equal(collect.displayImage, gift.displayImage);

  for(const rel of [cake.image, cake.displayImage]){
    const file = path.join(ROOT, rel);
    assert.ok(fs.existsSync(file), `${rel} exists`);
    const bytes = fs.readFileSync(file);
    const limit = rel.includes("_256.webp") ? 50000 : 120000;
    assert.ok(bytes.length <= limit, `${rel} <= ${limit} bytes`);
  }
}

const manifest = JSON.parse(read("img/collectibles/cakes2026/cake_assets_manifest.json"));
assert.equal(manifest.files.length, 103);
for(const item of manifest.files){
  for(const kind of ["display", "thumbnail"]){
    const data = fs.readFileSync(path.join(ROOT, "img/collectibles/cakes2026", item[kind]));
    assert.equal(crypto.createHash("sha256").update(data).digest("hex"), item[`${kind}_sha256`]);
  }
}

const ui = read("js/ui.js");
for(const token of ["loading=\"lazy\"", "data-lazy-src", "IntersectionObserver", "bindLazyAssets(body)", "collectImg(id, true)"]){
  assert.ok(ui.includes(token), `ui contains ${token}`);
}
const images = read("js/images.js");
assert.ok(images.includes("if(item.image)"), "explicit cake paths bypass startup probes");
const index = read("index_classic.html");
assert.ok(index.indexOf("js/data/cakes2026.js") < index.indexOf("js/data/collectibles.js"));

console.log("PASS cakes2026: 103 cakes, dual assets, prices, shared catalog, lazy UI");
