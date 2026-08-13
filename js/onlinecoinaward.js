"use strict";
/* 🌐🏆 รางวัลรายเดือน Top 10 กระดานเหรียญออนไลน์สะสมตลอดกาล */
window.OnlineCoinAward = window.makeMonthAward({
  id:      'online',
  path:    'onlineCoinAward',
  field:   'oe',
  boardOf: ()=> (typeof Online !== 'undefined' ? (Online.onlineCoinBoard || []) : []),
  scoreOf: ()=> (typeof state !== 'undefined' ? (state.onlineEarned || 0) : 0),
  seenK:   'onlineCoinAwardSeen',
  paidK:   'onlineCoinAwardPaid',
  logK:    'onlineCoinAwardLog',
  emoji:   '🌐',
  unit:    'เหรียญออนไลน์',
  role:    'ผู้สะสมเวลาออนไลน์',
  game:    '🌐 เหรียญออนไลน์',
  empty:   'ยังไม่มีใครได้รับเหรียญออนไลน์ — เปิดเกมออนไลน์สะสมเวลาเป็นคนแรกสิ!',
  rules: [
    'จัดอันดับจาก <b>เหรียญออนไลน์สะสมตลอดกาลตั้งแต่เริ่มมีระบบนี้</b> ที่แสดงในกระเป๋า 🌐 หน้า Lobby · <b>ไม่รีเซ็ตรายวัน</b>',
    'เปิดเกมและเชื่อมต่อออนไลน์ขณะแท็บมองเห็นอยู่ = <b>+0.01 เหรียญ/วินาที</b> · ปิดเว็บหรือซ่อนแท็บไม่นับ',
    'ตัดสินอันดับ <b>วันที่ 1 เวลา 00:01 น.</b> · อันดับ 1–10 ได้ 10,000 ลดหลั่นถึง 1,000 เหรียญ',
  ],
});
