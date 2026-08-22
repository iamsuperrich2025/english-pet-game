'use strict';

const fs = require('fs');
const path = require('path');
const root = path.resolve(__dirname, '..');
const css = fs.readFileSync(path.join(root, 'css', 'lobby.css'), 'utf8');
const classic = fs.readFileSync(path.join(root, 'index_classic.html'), 'utf8');

function ok(value, message){
  if(!value) throw new Error(message);
  console.log(`PASS ${message}`);
}

ok(/\.lobby-top\.coin-laned \.top-flex2\{display:none;\}/.test(css),
  'ตัด spacer ระหว่างช่องคอมกับกลุ่มปุ่มในโหมดจัดเลน');
ok(/<div class="coin-block">[\s\S]*?<div class="top-flex top-flex2"><\/div>[\s\S]*?<div class="topbar-icons">/.test(classic),
  'กลุ่มปุ่มยังอยู่ถัดจาก coin block ใน DOM');
ok(/id="btn-chat"[\s\S]*?id="btn-logout"/.test(classic),
  'ปุ่มแชทถึงปุ่มออกยังเรียงครบในกลุ่มเดียว');

console.log('PASS lobby topbar button regression');
