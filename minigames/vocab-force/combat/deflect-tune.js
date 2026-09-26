"use strict";
/* รอบ 1593: ปุ่มปัดพลัง (DEFLECT) — ปัดลูกพลังที่ศัตรู/เพื่อนยิงมาให้หักเหไปตามทิศหน้าผู้เล่น
   + ค่าซอมบี้พ่นลูกพลัง (เคส A) และลูกพลังที่ปัดกลับไป (ดาเมจ/อายุ/ความเร็ว) */
(function(root){
  const VF = root.VocabForce = root.VocabForce || {};

  VF.DeflectTune = {
    COOLDOWN: 2.5,          // วินาทีระหว่างการปัด
    HIT_AT: 0.26,           // จังหวะที่ฝ่ามือปัดถึง (วินาทีหลังกด)
    BUSY: 0.75,             // ท่า Shield_Push_Left ล็อกสั้น ๆ
    RANGE: 3.8,             // รัศมีรับลูกพลังรอบตัว
    ARC_DOT: 0.1,           // ต้องอยู่ในแนวหน้าตัว (dot ของทิศลูกพลังกับทิศหน้า)
    REDIRECT_SPEED: 34,     // ความเร็วลูกพลังหลังถูกปัด
    DEFLECTED_LIFE: 2.4,    // อายุลูกพลังที่ถูกปัด (วินาที)
    DEFLECTED_ZOMBIE_DMG: 120,
    DEFLECTED_PVP_DMG: 300,
    PEER_NEAR: 2.4,          // รัศมี "ลูกพลังเพื่อนใกล้ตัว" ที่นับว่าเคลื่อนผ่านตัวเรา (เปิด guard ตอนกดปัด)
    /* ซอมบี้พ่นลูกพลัง (เคส A) */
    ZOMBIE_SPIT_INTERVAL: 3.2,
    ZOMBIE_SPIT_MIN: 6,
    ZOMBIE_SPIT_MAX: 30,
    ZOMBIE_SPIT_SPEED: 16,
    ZOMBIE_SPIT_DAMAGE: 120,
    /* รอบ 1596: หน้าต่างกันดาเมจลูกพลังเพื่อน — ปัดโดนภายในเวลานี้ ดาเมจ 'G' ที่แพ็กมาถึง
       ภายหลัง (หรือมาก่อนแค่จังหวะเดียว) จะถูกกลืน ผู้เล่นไม่เสีย HP จากการโจมตีครั้งนั้น */
    PEER_GUARD_MS: 1000,
    POOL: 12
  };
})(typeof window !== 'undefined' ? window : globalThis);
