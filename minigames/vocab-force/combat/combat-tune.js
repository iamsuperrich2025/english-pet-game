"use strict";
/* Central melee feel. Change numbers here, not in combat/enemy/camera code. */
(function(root){
  const VF = root.VocabForce = root.VocabForce || {};

  const LEVELS = {
    LIGHT:    { knockback: 16, lift: 1.6, maxSpeed: 24, maxDist: 6.0, slide: 2.8, spin: 0.55 },
    MEDIUM:   { knockback: 26, lift: 3.4, maxSpeed: 34, maxDist: 8.5, slide: 4.2, spin: 1.05 },
    HEAVY:    { knockback: 36, lift: 6.2, maxSpeed: 46, maxDist: 13.5, slide: 6.5, spin: 1.7 },
    EXTREME:  { knockback: 46, lift: 7.4, maxSpeed: 54, maxDist: 16.0, slide: 8.0, spin: 2.3 }
  };

  const ATTACKS = {
    punch: {
      damage: 12,
      pvpDamage: 90,
      level: 'MEDIUM',
      reaction: 'front',
      forwardImpulse: 3.6,
      impactDrive: 1.8,
      hitAt: 0.24,
      busy: 0.46,
      hitStop: 0.075,
      cameraShake: 0.38,
      fovPunch: 4,
      range: 1.92,
      radius: 1.28,
      trail: 'hand'
    },
    kick: {
      damage: 20,
      pvpDamage: 160,
      level: 'HEAVY',
      reaction: 'launch',
      force: 46,
      lift: 7.6,
      maxSpeed: 52,
      maxDist: 15.4,
      forwardImpulse: 8.8,
      impactDrive: 5.0,
      hitAt: 0.34,
      busy: 0.62,
      hitStop: 0.148,
      cameraShake: 1.12,
      fovPunch: 7.8,
      range: 2.48,
      radius: 1.58,
      trail: 'foot'
    },
    heavyKick: {
      damage: 22,
      pvpDamage: 180,
      level: 'EXTREME',
      reaction: 'sweep',
      forwardImpulse: 7.2,
      impactDrive: 3.4,
      hitAt: 0.40,
      busy: 0.78,
      hitStop: 0.155,
      cameraShake: 1.05,
      fovPunch: 7.5,
      range: 2.55,
      radius: 1.72,
      trail: 'foot'
    }
  };

  VF.CombatTune = {
    HIT_STOP_MAX: 0.18,
    VELOCITY_CAP: 56,
    AIR_DAMP: 1.15,
    SLIDE_DAMP: 2.4,
    GROUND_DAMP: 5.2,
    GRAVITY: 22,
    PLAYER_DRIVE_CAP: 16,
    LAND_SHAKE_NEAR: 6.5,
    LEVELS: LEVELS,
    ATTACKS: ATTACKS,
    level: function(name){
      return LEVELS[name] || LEVELS.MEDIUM;
    },
    attack: function(kind){
      return ATTACKS[kind] || ATTACKS.punch;
    }
  };

  VF._t.combatImpulse = function(force, dir, cap){
    const f = Math.max(0, force || 0);
    const lim = cap != null ? cap : (VF.CombatTune.VELOCITY_CAP || 56);
    const mag = Math.min(lim, f);
    const len = Math.hypot(dir.x || 0, dir.z || 0) || 1;
    return {x: (dir.x || 0) / len * mag, z: (dir.z || 0) / len * mag};
  };

  VF._t.resolveHitDir = function(dir, origin, enemy, reaction){
    let x = dir && dir.x || 0, z = dir && dir.z || 0;
    const len = Math.hypot(x, z) || 1;
    x /= len; z /= len;
    const ox = enemy.x - (origin && origin.x != null ? origin.x : enemy.x);
    const oz = enemy.z - (origin && origin.z != null ? origin.z : enemy.z);
    const ol = Math.hypot(ox, oz) || 1;
    const nx = ox / ol, nz = oz / ol;
    const side = x * nz - z * nx;
    const along = x * nx + z * nz;
    let rx = x, rz = z;
    if(reaction === 'sweep'){
      rx = x * 0.5 + (side >= 0 ? z : -z) * 0.9;
      rz = z * 0.5 + (side >= 0 ? -x : x) * 0.9;
    }else if(Math.abs(side) > 0.28 && along < 0.82){
      const k = 0.64;
      rx = x * (1 - k) + (side > 0 ? z : -z) * k;
      rz = z * (1 - k) + (side > 0 ? -x : x) * k;
    }
    const rl = Math.hypot(rx, rz) || 1;
    return {x: rx / rl, z: rz / rl, side: side, along: along};
  };

  VF._t.estimateLaunch = function(levelKey){
    const L = VF.CombatTune.level(levelKey);
    const tAir = Math.max(0.14, 2 * L.lift / VF.CombatTune.GRAVITY);
    const k = VF.CombatTune.AIR_DAMP;
    const airDist = L.knockback / k * (1 - Math.exp(-k * tAir));
    return Math.min(L.maxDist, airDist + L.slide * 0.35);
  };
})(typeof window !== 'undefined' ? window : globalThis);
