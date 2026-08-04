/* 🇹🇭 js/thaitime.js — "เวลาไทย" กลางของทั้งเกม (รอบ 988)
   ============================================================
   ปัญหาที่แก้: ทุกจุดในเกมอ่านเวลาจาก `new Date().getHours()` = **นาฬิกาของเครื่องผู้เล่น**
   เครื่องที่ตั้งไทม์โซนเป็นต่างประเทศ (หรือ tablet/PC ที่ตั้งเวลาไม่ตรง) จะได้ชั่วโมงผิด
   → ธีมกลางวัน/กลางคืน, เวลานอนน้อง, ฝน 19:00, มื้อเย็น 18:00 เพี้ยนตามกันหมด
   (ผู้ใช้เจอจริง: กลางวันบ้านเราแต่เกมขึ้นธีมกลางคืน)

   กติกา: **ทุกอย่างที่เป็น "เวลาบนหน้าปัด" ต้องคิดเป็นเวลาไทย (UTC+7) เสมอ ไม่ว่าเครื่องตั้งโซนไหน**
   ไทยไม่มี daylight saving → offset คงที่ +7 ตลอดปี คำนวณตรง ๆ ได้เลย

   วิธีใช้ (ไฟล์นี้ต้องโหลดเป็นสคริปต์แรกสุดของหน้า — ไม่มี dependency อะไรเลย):
     thHour()            → ชั่วโมงไทยตอนนี้ 0-23  (แทน new Date().getHours())
     thHourF(t)          → ชั่วโมงไทยแบบทศนิยม (รวมนาที/วินาที — ใช้กับดวงอาทิตย์/หมอก/ผ้าคลุมกลางคืน)
     thDate(t)           → Date "หน้าปัดไทย" — ใช้ **อ่าน** getHours/getDate/getDay/toDateString เท่านั้น
                           ⛔ ห้ามเอา .getTime() ของมันไปใช้เป็น timestamp (มันถูกเลื่อนไว้แล้ว)
     thDayKey(t)         → คีย์วันตามวันไทย (toDateString) — ใช้กับตัวนับรายวัน
     thDayStart(t)       → timestamp จริงของ "เที่ยงคืนไทย" ของวันนั้น
     thAtHour(t, hour)   → timestamp จริงของ "hour:00 น. เวลาไทย" ของวันนั้น (เช่น ฝน 19:00 / มื้อเย็น 18:00)
     thTs(y,mo,d,h,mi)   → timestamp จริงของวัน-เวลาไทยที่ระบุ (mo = 0-11 เหมือน Date) เช่น จุดตัดรางวัลรายเดือน
     TH_DAY_MS           → 1 วันไทย = 86,400,000 ms เป๊ะเสมอ (โซนคงที่ ไม่มี DST)
   ============================================================ */
const TH_TZ_MIN = 420;                 // Asia/Bangkok = UTC+7 (420 นาที)
const TH_DAY_MS = 86400000;

/* ระยะที่ต้องบวกเข้า timestamp เพื่อให้ getters ของ Date อ่านออกมาเป็นเวลาไทย
   (getTimezoneOffset ของเครื่อง = นาทีที่ต้องบวกให้กลายเป็น UTC · บวก 420 ต่อ = ไทย)
   คิดจาก ms ของเวลานั้น ๆ เพราะเครื่องที่มี DST offset ไม่เท่ากันทั้งปี */
function thShift(ms){ return (TH_TZ_MIN + new Date(ms).getTimezoneOffset()) * 60000; }

function thMs(t){ return t == null ? Date.now() : (t instanceof Date ? t.getTime() : +t); }
function thDate(t){ const ms = thMs(t); return new Date(ms + thShift(ms)); }
function thHour(t){ return thDate(t).getHours(); }
function thHourF(t){ const d = thDate(t); return d.getHours() + d.getMinutes()/60 + d.getSeconds()/3600; }
function thDayKey(t){ return thDate(t).toDateString(); }
function thDayStart(t){
  const ms = thMs(t), d = thDate(ms);
  return ms - (d.getHours()*3600000 + d.getMinutes()*60000 + d.getSeconds()*1000 + d.getMilliseconds());
}
function thAtHour(t, hour){ return thDayStart(t) + hour*3600000; }
function thTs(y, mo, d, h, mi, s){
  return Date.UTC(y, mo||0, d==null?1:d, h||0, mi||0, s||0) - TH_TZ_MIN*60000;
}

/* ตัวเลือกมาตรฐานสำหรับ toLocaleString/DateString/TimeString — ผูกโซนไทยให้ทุกที่ที่โชว์เวลา */
const TH_TZ_OPT = {timeZone:'Asia/Bangkok'};
function thLocaleOpt(opt){ return Object.assign({}, opt || {}, TH_TZ_OPT); }

try{
  window.thShift=thShift; window.thDate=thDate; window.thHour=thHour; window.thHourF=thHourF;
  window.thDayKey=thDayKey; window.thDayStart=thDayStart; window.thAtHour=thAtHour; window.thTs=thTs;
  window.thLocaleOpt=thLocaleOpt; window.TH_DAY_MS=TH_DAY_MS; window.TH_TZ_MIN=TH_TZ_MIN;
}catch(e){}
