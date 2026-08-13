"use strict";
/* 🪙🏆 รางวัลรายเดือน Top 10 กระดานเหรียญคงเหลือ */
window.CoinAward = window.makeMonthAward({
  id:      'coins',
  path:    'coinAward',
  field:   'coins',
  scoreOf: ()=> (typeof state !== 'undefined' ? (state.coins || 0) : 0),
  seenK:   'coinAwardSeen',
  paidK:   'coinAwardPaid',
  logK:    'coinAwardLog',
  emoji:   '🪙',
  unit:    'เหรียญ',
  role:    'นักสะสมเหรียญ',
  game:    '🪙 เหรียญ',
  empty:   'ยังไม่มีใครมีเหรียญ — เล่นเกมและทำภารกิจเพื่อขึ้นอันดับเป็นคนแรกสิ!',
  rules: [
    'จัดอันดับจาก <b>ยอดเหรียญคงเหลือ</b> ที่แสดงในกระเป๋าหน้า Lobby',
    'ใช้ยอด ณ เวลาตัดรอบ · การซื้อของก่อนตัดรอบอาจทำให้อันดับเปลี่ยนได้',
    'ตัดสินอันดับ <b>วันที่ 1 เวลา 00:01 น.</b> · อันดับ 1–10 ได้ 10,000 ลดหลั่นถึง 1,000 เหรียญ',
  ],
});
