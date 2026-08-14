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

const narrow = css.match(/@media \(max-width:640px\) and \(max-height:520px\)\{([\s\S]*?)\n\}/);
ok(narrow, 'มี breakpoint สำหรับมือถือ landscape viewport แคบ');
ok(/\.lobby-top\{position:relative;min-height:104px;\}/.test(narrow[1]), 'หัวล็อบบี้เป็นกรอบอ้างอิงและสูงพอรับปุ่มขวา');
ok(/\.topbar-icons\{[\s\S]*?position:absolute;top:66px;right:0;/.test(narrow[1]), 'ก้อนปุ่มยึดขอบขวาจริงใต้แถวเหรียญ');
ok(/width:calc\(var\(--top-h\) \* 5 \+ 32px\)/.test(narrow[1]), 'ก้อนปุ่มสำรองความกว้างครบทั้ง 5 ปุ่ม');
ok(/\.topbar-icons-row\{[\s\S]*?display:flex;justify-content:flex-end;gap:8px;width:100%;/.test(narrow[1]), 'ปุ่ม 5 ตัวอยู่แถวเดียวและชิดขวา');
ok(/\.topbar-icons \.rank-move-box\{display:none;\}/.test(narrow[1]), 'จอแคบซ่อนฟีดอันดับเพื่อให้ปุ่มระบบครบ');
ok(/css\/lobby\.css\?v=1169b/.test(classic), 'หน้า Classic บังคับโหลด CSS responsive รุ่นใหม่');

console.log('PASS lobby settings responsive regression');
