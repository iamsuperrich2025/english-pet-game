const fs=require('fs'), path=require('path'), root=path.join(__dirname,'..');
const js=fs.readFileSync(path.join(root,'js','rankgraph.js'),'utf8');
const css=fs.readFileSync(path.join(root,'css','rankgraph.css'),'utf8');
const lobby=fs.readFileSync(path.join(root,'js','lobby3d.js'),'utf8');
const html=fs.readFileSync(path.join(root,'index_classic.html'),'utf8');
function ok(v,msg){if(!v) throw new Error(msg); console.log('PASS',msg)}
ok((js.match(/color:'#[0-9a-f]{6}'/g)||[]).length===10,'มีสีครบ 10 หมวด');
const colors=[...js.matchAll(/color:'(#[0-9a-f]{6})'/g)].map(m=>m[1]);
ok(new Set(colors).size===10,'สีแต่ละหมวดไม่ซ้ำกัน');
ok(/const TOP = 30/.test(js)&&/slice\(0,TOP\)/.test(js),'จำกัดกราฟ Top 30');
ok(/class=\\?"rg-name/.test(js)&&/r\.name/.test(js),'ทุกจุดมีชื่อผู้เล่น');
ok(/ref\('leaderboard'\)\.get\(\)/.test(js),'โหลดข้อมูลจริงเมื่อเปิดกราฟ');
ok(/rgdemo/.test(js),'มีโหมดเดโมสำหรับตรวจหน้าจอโดยไม่แตะ Firebase');
ok(/rank-graph-btn/.test(lobby)&&/กราฟอันดับ/.test(lobby),'มีปุ่มกราฟอันดับถัดจากปุ่มสะกดคำ');
ok(/✕ ปิด/.test(js)&&/\.rg-close/.test(css),'มีปุ่มปิดที่ชัดเจน');
ok(html.includes('css/rankgraph.css')&&html.includes('js/rankgraph.js'),'หน้าเกมโหลดไฟล์กราฟครบ');
ok(/max-height:460px/.test(css)&&/height:98dvh/.test(css),'รองรับจอเตี้ย 812×375');
