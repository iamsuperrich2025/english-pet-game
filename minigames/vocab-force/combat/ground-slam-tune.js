"use strict";
/* Ground Slam feel — ปุ่ม SLAM: ท่ากระแทกพื้น + เส้นเปลวเพลิงสีฟ้าเป็นแนวยาวบนพื้น
   ยาวเท่าวิถี overdrive dash (dash 2 ครั้ง) · ผู้เล่นที่โดนแนวเส้นเสีย 300 HP ต่อครั้งที่โดน */
(function(root){
  const VF = root.VocabForce = root.VocabForce || {};
  VF._t = VF._t || {};

  VF.GroundSlamTune = {
    HIT_AT: 0.55,
    BUSY: 1.3,
    COOLDOWN: 6,
    LINE_LENGTH: 23,
    LINE_HALF_WIDTH: 1.3,
    LINE_LIFE: 2.6,
    SEGMENT_SPACING: 0.6,
    MAX_SEGMENTS: 64,
    PVP_DAMAGE: 300,
    ZOMBIE_DAMAGE: 20,
    ZOMBIE_BURN_INTERVAL: 0.45,
    ZOMBIE_FORCE: 30,
    ZOMBIE_LIFT: 4.2,
    CAMERA_SHAKE: 1.7,
    FOV_PUNCH: 9,
    NET_HOLD: 0.9,
    /* ระเบิดไฟจุดชน — ผู้เล่นโดน: ไฟลุก + คลื่นกระแทก + รอยแยกพื้น · ซอมบี้โดน: ไฟลุกรอบแรกของแต่ละ cast */
    EXPLOSION_R: 3.0,
    ZOMBIE_EXPLOSION_R: 2.2
  };

  VF._t.slamLineLength = function(){
    const T = VF.GroundSlamTune || {};
    if(T.LINE_LENGTH != null) return T.LINE_LENGTH;
    return VF._t.overdriveDistance ? VF._t.overdriveDistance() : 23;
  };
})(typeof window !== 'undefined' ? window : globalThis);
