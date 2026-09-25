"use strict";
/* Central heal-pad feel. Change numbers here, not in the mesh builder. */
(function(root){
  const VF = root.VocabForce = root.VocabForce || {};

  VF.HealPadTune = {
    X: 0,
    Z: 22,
    RADIUS: 5.4,
    HEAL_PER_SEC: 240,
    HEIGHT: 3.55,
    GLOW: 0x00cfcf,
    HUM_MS: 420,
    PLATFORM_R: 1.55,
    HEART_Y: 3.35,
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
})(typeof window !== 'undefined' ? window : globalThis);
