"use strict";
/* 🏆 รางวัลรายเดือน Top 10 ของเกม 🫧 ฟอง — คะแนนสะสมตลอดกาล */
window.BbAward=window.makeMonthAward({
  id:'bb',path:'bbAward',field:'bb',scoreOf:()=>typeof state!=='undefined'?(state.bbScore||0):0,
  boardOf:()=>typeof Online!=='undefined'?(Online.bbBoard||[]):[],
  unit:'คะแนน',role:'นักแตะฟอง',seenK:'bbAwardSeen',paidK:'bbAwardPaid',logK:'bbAwardLog',
  emoji:'🫧',game:'🫧 ฟอง',empty:'ยังไม่มีใครเก็บคะแนนฟองเลย — เป็นคนแรกสิ!',
  rules:[
    '<b>อันดับตัดสินที่คะแนนสะสมตลอดกาล</b> — แตะฟองถูกตัวละ 2 คะแนน และไม่แตะผิดเลยทั้งคำ +5 คะแนน',
    'แตะฟองเรียงตามคำ · ตัวอักษรซ้ำมีฟองซ้ำครบ · ไม่มีไฟใบ้ฟองคำตอบ',
    'ตัดสินอันดับ <b>วันที่ 1 เวลา 00:01 น.</b> · เงินรางวัลเข้าอัตโนมัติตอนเปิดเกม',
    'อันดับ 1–10 ได้ 10,000 ลดหลั่นถึง 1,000 เหรียญ · คะแนนไม่รีเซ็ตเมื่อจบเดือน'
  ]
});
