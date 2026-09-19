"use strict";
/* Breakable-wall shatter numbers. Only flagged panels break; outer arena stays solid. */
(function(root){
  const VF = root.VocabForce = root.VocabForce || {};

  const BREAK = {
    shatterSpeed: 16,
    extremeSpeed: 28,
    hitStop: 0.07,
    extremeHitStop: 0.1,
    slowMo: 0.09,
    slowScale: 0.34,
    cameraShake: 0.92,
    extremeShake: 1.2,
    fovPunch: 5.6,
    extremeFov: 7.4,
    shardCount: 12,
    extremeShardCount: 18,
    dust: 12,
    extremeDust: 16,
    chips: 8,
    extremeChips: 12,
    streaks: 6,
    plume: 2,
    shardLife: 0.72,
    chipLife: 0.48,
    maxLive: 3,
    mobileScale: 0.6,
    throughKeep: 0.52,
    POOL: {shard: 32}
  };

  function density(){
    try{
      if(typeof window !== 'undefined' && (window.innerHeight || 900) < 500) return BREAK.mobileScale;
    }catch(_){}
    return 1;
  }

  VF.BreakableWallTune = BREAK;
  VF._t = VF._t || {};
  VF._t.breakableTier = function(speed){
    const s = speed || 0;
    if(s < BREAK.shatterSpeed) return null;
    if(s >= BREAK.extremeSpeed) return 'EXTREME';
    return 'HEAVY';
  };
  VF._t.canShatterWall = function(box, speed){
    if(!box || !box.breakable || box.broken) return false;
    return !!VF._t.breakableTier(speed);
  };
  VF._t.breakWall = function(box){
    if(!box || box.broken) return false;
    box.broken = true;
    if(box.mesh) box.mesh.visible = false;
    return true;
  };
  VF._t.breakableDensity = density;
})(typeof window !== 'undefined' ? window : globalThis);
