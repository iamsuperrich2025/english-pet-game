#!/usr/bin/env node
"use strict";

const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.resolve(__dirname, '..');
const badwords = fs.readFileSync(path.join(root, 'js/data/badwords.js'), 'utf8');
const auth = fs.readFileSync(path.join(root, 'js/auth.js'), 'utf8');
const authPrefix = auth.slice(0, auth.indexOf('function testerBoost'));
assert(authPrefix.length < auth.length, 'หาแนวตัด auth.js สำหรับ unit test ไม่เจอ');

const sandbox = {};
vm.runInNewContext(badwords + '\n' + authPrefix + `
  globalThis.__adminNameProbe = {
    check(raw, email){ Auth.user = email ? {email} : null; return checkProfileName(raw, 2, 20); },
    reserved(raw){ return isReservedAdminName(raw); }
  };
`, sandbox);
const probe = sandbox.__adminNameProbe;

const allowed = [
  'freddommun@gmail.com',
  'sumpajitshami@gmail.com',
  'parkerhulk2020@gmail.com',
];
for(const email of allowed){
  for(const name of ['Admin', 'admin', 'ADMIN', 'aDmIn', 'แอดมิน']){
    assert.strictEqual(probe.check(name, email).ok, true, `${email} ต้องใช้ชื่อ ${name} ได้`);
  }
}

for(const name of ['Admin', 'admin', 'ADMIN', 'A d m i n', 'A\u200Bdmin', ' แอดมิน ']){
  assert.strictEqual(probe.reserved(name), true, `${JSON.stringify(name)} ต้องเป็นชื่อสงวน`);
  const denied = probe.check(name, 'player@example.com');
  assert.strictEqual(denied.ok, false, `ผู้เล่นทั่วไปต้องใช้ ${JSON.stringify(name)} ไม่ได้`);
  assert.match(denied.msg, /สงวนไว้สำหรับบัญชีผู้ดูแลระบบ/);
}
assert.strictEqual(probe.check('AdminHero', 'player@example.com').ok, true, 'ชื่อที่ไม่ตรงชื่อสงวนต้องใช้ได้');
assert.strictEqual(probe.check('น้องบีม', null).ok, true, 'ชื่อทั่วไปต้องใช้ได้แม้ไม่มีอีเมล');

const main = fs.readFileSync(path.join(root, 'js/main.js'), 'utf8');
const util = fs.readFileSync(path.join(root, 'js/util.js'), 'utf8');
assert.match(main, /const nick = checkProfileName\(/, 'หน้าสมัครต้องใช้ตัวตรวจชื่อผู้เล่น');
assert.match(main, /if\(authEnsureProfileName\(\)\)/, 'ผู้เล่นเดิมต้องถูกตรวจชื่อเมื่อเข้าเกม');
assert.match(util, /typeof opt\.validate === 'function'/, 'กล่องตั้งชื่อต้องรองรับ validator เฉพาะประเภท');
assert.match(auth, /if\(!Auth\.user \|\| !state\.profileName \|\| !checkProfileName\(state\.profileName\)\.ok\) return;/,
  'ด่านส่งชื่อขึ้น profile ต้องตรวจชื่อซ้ำ');

const rulesDoc = fs.readFileSync(path.join(root, 'handoff/RULES.md'), 'utf8');
const jsonBlock = rulesDoc.match(/## ก้อนเต็ม[\s\S]*?```json\r?\n([\s\S]*?)```/);
assert(jsonBlock, 'ไม่พบ Firebase Rules ก้อนเต็ม');
const rules = JSON.parse(jsonBlock[1]);
const profileRule = rules.rules.users.$uid.profile.name['.validate'];
for(const email of allowed) assert(profileRule.includes(email), `Rules ต้องอนุญาต ${email}`);
assert(profileRule.includes('[Aa][Dd][Mm][Ii][Nn]'), 'Rules ต้องล็อก Admin ทุกตัวพิมพ์');
assert(profileRule.includes('แอดมิน'), 'Rules ต้องล็อกชื่อ แอดมิน');

console.log('PASS admin reserved names: 3 allowed emails, spoof variants blocked, entry points protected');
