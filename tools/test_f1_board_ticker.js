'use strict';

const fs=require('fs');
const path=require('path');
const src=fs.readFileSync(path.join(__dirname,'..','js','f1_3d.js'),'utf8');
let failed=0;
function ok(name,pass){
  console.log((pass?'PASS':'FAIL')+'  '+name);
  if(!pass) failed++;
}

ok('แผงอันดับสูงคงที่บรรทัดเดียว',/#f1-board\{[^}]*height:38px[^}]*overflow:hidden/s.test(src));
ok('ช่อง ticker ห้ามตัดบรรทัด',/#f1-board \.m-bd-window\{[^}]*overflow:hidden[^}]*white-space:nowrap/s.test(src));
ok('ข้อความเคลื่อนขวาไปซ้าย',/@keyframes f1boardticker\{from\{transform:translateX\(0\)\}to\{transform:translateX\(-100%\)\}\}/.test(src));
ok('รายงานผู้เล่นทุกคน ไม่จำกัด 5 คน',/\.concat\(\[me\]\)\.sort\(\(a,b\)=>b\.w-a\.w\);/.test(src)&&!/sort\(\(a,b\)=>b\.w-a\.w\)\.slice\(0,5\)/.test(src));
ok('มีอันดับ ชื่อ ชั้น และคำที่เก็บ',/const playerHtml=rows\.map/.test(src)&&/gradeMark\(r\.g\)/.test(src)&&/\$\{r\.w\} คำ/.test(src));
ok('ปุ่มไปหาเพื่อนยังคงกดได้',/querySelector\('\.nr-go'\)/.test(src)&&/closest\('\.nr-go'\)/.test(src));
ok('จอมือถือลดสูงเหลือ 34px',/@media\(max-width:700px\)\{#f1-board\{height:34px/.test(src));
ok('รอบเวลาเลื่อนปรับตามความยาวรายงาน',/plain\.length\/7\),14,48/.test(src));
ok('ไฟสตาร์ทไม่ซ้อนทับ ticker',/function setStartLights\(on\)[\s\S]*boardEl\.style\.visibility=on\?'hidden':''/.test(src)&&
  (src.match(/setStartLights\(false\)/g)||[]).length>=3);

if(failed){
  console.error('\n'+failed+' scoreboard ticker contract(s) failed');
  process.exit(1);
}
console.log('\nF1 one-line scoreboard ticker contracts passed.');
