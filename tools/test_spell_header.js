'use strict';

const fs = require('fs');
const path = require('path');
const root = path.resolve(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
const css = read('css/lobby.css');
const lobby3d = read('js/lobby3d.js');

function ok(value, message){
  if(!value) throw new Error(message);
  console.log(`PASS ${message}`);
}

ok(/row\.appendChild\(grade\)[\s\S]*row\.appendChild\(slot\)/.test(lobby3d), 'ช่องสะกดคำอยู่หลังระดับชั้น');
ok(/\.coin-subrow\{[^}]*display:flex[^}]*align-items:center/.test(css), 'ระดับชั้นและสะกดคำเรียงแนวนอน');
ok(!/\.spell-btn\{[^}]*position:absolute/.test(css), 'ปุ่มสะกดคำไม่วางแบบลอยทับเวที');
ok(/button\.id\s*=\s*'spell-btn'/.test(lobby3d) && /slot\.appendChild\(button\)/.test(lobby3d), 'ย้ายปุ่มเดิมพร้อม click handler เข้าแถบบน');
ok(/document\.getElementById\('spell-btn'\)/.test(lobby3d), 'ระบบเกมซ่อนและแสดงปุ่มในแถบบน');

console.log('PASS spell header regression');
