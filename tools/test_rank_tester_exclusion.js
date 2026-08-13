'use strict';
const assert = require('assert');
const fs = require('fs');

const auth = fs.readFileSync('js/auth.js', 'utf8');
const online = fs.readFileSync('js/online.js', 'utf8');
const band = fs.readFileSync('js/bandadv.js', 'utf8');
const exam = fs.readFileSync('js/examstd.js', 'utf8');
const f1 = fs.readFileSync('js/f1_3d.js', 'utf8');
const award = fs.readFileSync('js/award.js', 'utf8');

for(const email of ['sumpajitshami@gmail.com','freddommun@gmail.com'])
  assert.ok(auth.includes(email), `tester email missing: ${email}`);
for(const name of ['ครูรุต','sumpajit','สัมปจิตฉามิ'])
  assert.ok(auth.toLocaleLowerCase('th-TH').includes(name), `excluded tester name missing: ${name}`);

assert.ok(/function rankUserExcluded\(uid, name\)/.test(auth), 'central tester exclusion helper missing');
assert.ok(/isTester\(\)[\s\S]{0,180}leaderboard\/'/.test(online), 'tester leaderboard row must be removed instead of published');
assert.ok((online.match(/rankUserExcluded/g)||[]).length >= 4, 'main, bubble, and online-coin boards must filter tester rows');
assert.ok(band.includes('rankUserExcluded(r.uid, r.name)') && band.includes("isTester === 'function' && isTester()"), 'band ranks must exclude tester rows and self');
assert.ok(exam.includes('rankUserExcluded(r.uid, r.name)') && exam.includes("isTester === 'function' && isTester()"), 'exam ranks must exclude tester rows and self');
assert.ok(f1.includes('rankUserExcluded(r.uid,r.name)') && f1.includes("typeof isTester==='function'&&isTester()"), 'F1 ranks must exclude tester rows and self');
assert.ok(f1.includes("Online.db.ref('f1Rank/'+uid).remove()"), 'tester F1 row must be removed instead of published');
assert.ok(award.includes('const board = cfg.boardOf ? cfg.boardOf() : Online.board;'), 'monthly awards must use already-filtered public boards');

console.log('PASS tester accounts excluded from every leaderboard and monthly award source');
