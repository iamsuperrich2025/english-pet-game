"use strict";
/* Central secondary crash feel. Change numbers here, not in enemy/fx/camera code. */
(function(root){
  const VF = root.VocabForce = root.VocabForce || {};

  const SPEED = {
    none: 7.5,
    medium: 14,
    heavy: 24,
    extreme: 36
  };

  const LEVELS = {
    LIGHT: {
      shake: 0,
      fov: 0,
      hitStop: 0,
      slowMo: 0,
      slowScale: 1,
      bounce: 0,
      slideKeep: 0.72,
      rings: 1,
      debris: 3,
      dust: 4,
      sparks: 0,
      streaks: 2,
      plume: 0,
      flash: 0.7,
      grow: 0.9,
      decal: false
    },
    MEDIUM: {
      shake: 0.32,
      fov: 2.4,
      hitStop: 0,
      slowMo: 0,
      slowScale: 1,
      bounce: 0.85,
      slideKeep: 0.64,
      rings: 2,
      debris: 6,
      dust: 8,
      sparks: 4,
      streaks: 4,
      plume: 1,
      flash: 1.15,
      grow: 1.35,
      decal: true
    },
    HEAVY: {
      shake: 0.78,
      fov: 5.0,
      hitStop: 0.055,
      slowMo: 0,
      slowScale: 1,
      bounce: 2.35,
      slideKeep: 0.52,
      rings: 3,
      debris: 10,
      dust: 12,
      sparks: 7,
      streaks: 6,
      plume: 2,
      flash: 1.7,
      grow: 2.05,
      decal: true,
      lowShake: true
    },
    EXTREME: {
      shake: 1.22,
      fov: 7.2,
      hitStop: 0.08,
      slowMo: 0.07,
      slowScale: 0.28,
      bounce: 3.25,
      slideKeep: 0.42,
      rings: 4,
      debris: 14,
      dust: 16,
      sparks: 10,
      streaks: 8,
      plume: 3,
      flash: 2.35,
      grow: 2.85,
      decal: true,
      lowShake: true
    }
  };

  VF.SecondaryImpactTune = {
    SPEED: SPEED,
    LEVELS: LEVELS,
    WALL_COOL: 0.48,
    GROUND_COOL: 0.32,
    TRAIL_MIN: 12,
    TRAIL_STOP: 8,
    SHAKE_MAX_DIST: 16,
    FAR_DIST: 18,
    MAX_LIVE: 72,
    DECAL_MAX: 6,
    DECAL_LIFE: 1.55,
    POOL: {
      ring: 16,
      spark: 42,
      flash: 10,
      streak: 16,
      line: 16,
      dust: 40,
      ghost: 14,
      rock: 22,
      plume: 10,
      decal: 6
    },
    classify: function(speed){
      const s = speed || 0;
      if(s < SPEED.none) return null;
      if(s < SPEED.medium) return 'LIGHT';
      if(s < SPEED.heavy) return 'MEDIUM';
      if(s < SPEED.extreme) return 'HEAVY';
      return 'EXTREME';
    },
    spec: function(level){
      return LEVELS[level] || null;
    },
    kind: function(surface, speed, fallSpeed){
      const lv = this.classify(speed);
      if(!lv) return null;
      const fall = fallSpeed || 0;
      if(lv === 'EXTREME') return 'EXTREME_IMPACT';
      if(surface === 'wall') return 'WALL_IMPACT';
      if(fall >= SPEED.heavy && (speed || 0) >= SPEED.heavy) return 'HEAVY_GROUND_SLAM';
      return 'GROUND_IMPACT';
    },
    cameraFalloff: function(dist){
      const t = VF.clamp(1 - (dist || 0) / this.SHAKE_MAX_DIST, 0, 1);
      return t * t * 0.3 + t * 0.7;
    }
  };

  VF._t.secondaryClassify = function(speed){
    return VF.SecondaryImpactTune.classify(speed);
  };

  VF._t.wallImpactArmed = function(en, intoSpeed, touching){
    const T = VF.SecondaryImpactTune;
    if(!en) return false;
    if(!touching){
      en._wallTouch = false;
      return false;
    }
    if(en._wallTouch) return false;
    en._wallTouch = true;
    if((en._wallCool || 0) > 0) return false;
    if((intoSpeed || 0) < T.SPEED.none) return false;
    const launched = !!(en.airborneHit || (en.launchLeft || 0) > 0 || (en.recover || 0) > 0 || !en.alive);
    if(!launched) return false;
    return true;
  };

  VF._t.groundImpactArmed = function(en, speed, fallSpeed){
    const T = VF.SecondaryImpactTune;
    if(!en) return false;
    if((en._groundCool || 0) > 0) return false;
    const launched = !!(en.airborneHit || (en.launchLeft || 0) > 0 || (en.recover || 0) > 0 || !en.alive || (fallSpeed || 0) > 4);
    if(!launched) return false;
    return (speed || 0) >= T.SPEED.none;
  };
})(typeof window !== 'undefined' ? window : globalThis);
