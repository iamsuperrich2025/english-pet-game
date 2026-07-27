"use strict";
/* ============================================================
   LOBBY แนวนอน — ระบบแผงรายละเอียดกลางจอ (อัพเดท 5725691826)
   คลิกเมนูซ้าย → เปิดแผง (panel) ทับฉาก Lobby · เนื้อหา scroll ในแผง
   การ์ดเดิมทั้งหมด (home/phone/computer/farm/collect/rank) ย้ายเข้าแผง
   โดยคง id เดิม — ฟังก์ชัน render ใน ui.js ทำงานต่อได้โดยไม่แก้ logic
   ============================================================ */

const PANEL_TITLES = {
  'panel-home'   : '🏠 บ้าน & ที่พัก',
  'panel-farm'   : '📈 ลงทุน',
  'panel-factory': '🏭 โรงงานผลิตสินค้า',
  'panel-market' : '🏪 ตลาด',
  'panel-friends': '👥 เพื่อนของหนู',
  'panel-gifts'  : '🎁 ของขวัญ',
  'panel-rank'   : '🎖️ แรงค์ของหนู',
};

function openPanel(id){
  document.querySelectorAll('.panel-page').forEach(p=>p.classList.toggle('on', p.id === id));
  document.getElementById('panel-title').textContent = PANEL_TITLES[id] || '';
  const ov = document.getElementById('panel-overlay');
  ov.dataset.page = id;              /* รอบ 614: CSS ใช้เลือกโหมดเต็มจอรายแผง (โรงงาน) */
  ov.classList.add('open');
  document.querySelectorAll('.rail-btn[data-panel]').forEach(b=>b.classList.toggle('on', b.dataset.panel === id));
  sfx.select();
}

function closePanel(){
  document.getElementById('panel-overlay').classList.remove('open');
  document.querySelectorAll('.rail-btn[data-panel]').forEach(b=>b.classList.remove('on'));
}

/* เมนูซ้าย (ปุ่มที่มี data-panel — ปุ่มสถิติใช้ id btn-stats ผูกใน main.js เดิม) */
document.querySelectorAll('.rail-btn[data-panel]').forEach(b=>{
  b.addEventListener('click', ()=>openPanel(b.dataset.panel));
});
document.getElementById('panel-close').addEventListener('click', ()=>{ sfx.select(); closePanel(); });
document.getElementById('panel-overlay').addEventListener('click', (e)=>{
  if(e.target.id === 'panel-overlay') closePanel();      // แตะฉากหลังมืด = ปิดแผง
});
document.addEventListener('keydown', (e)=>{ if(e.key === 'Escape') closePanel(); });

/* รอบ 254: ถอดป้ายแรงค์เล็กบนแถบบนออก — เปิดแผงแรงค์เต็มด้วยการคลิกเหรียญแรงค์ใหญ่กลางเวทีแทน
   (ผูกไว้ที่ .stage-hero ใน renderDashboard เพราะ element สร้างใหม่ทุก render) */

/* เปลี่ยนหน้าจอเมื่อไหร่ ปิดแผงค้างไว้เสมอ (เช่น กด "🎮 ไปเล่นเกม" จากในแผงโรงงาน) */
const _lobbyShowScreen = showScreen;
showScreen = function(id){
  closePanel();
  _lobbyShowScreen(id);
};
