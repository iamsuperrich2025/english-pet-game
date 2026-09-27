"use strict";
/* Central heal-pad feel. Change numbers here, not in the mesh builder. */
(function(root){
  const VF = root.VocabForce = root.VocabForce || {};

  VF.HealPadTune = {
    X: 0,
    Z: 22,
    /* รอบ 1606: 4 จุดเติมเลือด (เดิมจุดเดียว 0,22) — กระจายรอบลาน เว้นอาคาร 1604 */
    SPOTS: [
      {x: 0, z: 22},
      {x: -150, z: -110},
      {x: 160, z: 60},
      {x: -60, z: 170}
    ],
    RADIUS: 5.4,
    HEAL_PER_SEC: 240,
    /* รอบ 1606: ความสูงโครงสร้างแท่นเพิ่ม 5 เท่า (3.55 → 17.75) ตามคำขอ */
    HEIGHT: 17.75,
    GLOW: 0x00cfcf,
    HUM_MS: 420,
    PLATFORM_R: 1.55,
    HEART_Y: 17.5,
    HEART_SIZE: 2.45,
    /* รอบ 1567: โหมดอลังการ — สว่างเต็มแผ่น */
    BRIGHTNESS: 0.8,
    GLOW_SCALE: 1.28,
    PREV: { BRIGHTNESS: 1, GLOW_SCALE: 1.22 }
  };

  VF._t = VF._t || {};
  VF._t.healPadContains = function(px, pz, x, z, radius){
    const T = VF.HealPadTune || {};
    const ox = x != null ? x : (T.X || 0);
    const oz = z != null ? z : (T.Z || 0);
    const r = radius != null ? radius : (T.RADIUS || 5.4);
    return Math.hypot((px || 0) - ox, (pz || 0) - oz) <= r;
  };
  VF._t.healPadAmount = function(dt){
    const rate = (VF.HealPadTune && VF.HealPadTune.HEAL_PER_SEC) || 240;
    return Math.max(0, rate * Math.max(0, dt || 0));
  };
  /* รอบ 1606: จุดฮีลทั้งหมด (SPOTS หรือ fallback X/Z เดิม) */
  VF._t.healPadSpots = function(){
    const T = VF.HealPadTune || {};
    return (T.SPOTS && T.SPOTS.length) ? T.SPOTS : [{x: T.X || 0, z: T.Z || 0}];
  };
  /* จุดฮีลที่ใกล้ (px,pz) ที่สุด — บอทใช้เลือกแท่นเติมเลือด */
  VF._t.healPadNearest = function(px, pz){
    const spots = VF._t.healPadSpots();
    let best = spots[0], bd = Infinity;
    for(let i = 0; i < spots.length; i++){
      const d = Math.hypot((px || 0) - spots[i].x, (pz || 0) - spots[i].z);
      if(d < bd){ bd = d; best = spots[i]; }
    }
    return best;
  };
  /* อยู่ในวงฮีลจุดไหนสักจุดไหม */
  VF._t.healPadContainsSpot = function(px, pz){
    const spots = VF._t.healPadSpots();
    for(let i = 0; i < spots.length; i++){
      if(VF._t.healPadContains(px, pz, spots[i].x, spots[i].z)) return true;
    }
    return false;
  };
})(typeof window !== 'undefined' ? window : globalThis);
