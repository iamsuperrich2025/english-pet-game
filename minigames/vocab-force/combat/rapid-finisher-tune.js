"use strict";
/* Rapid 3-hit burst finisher. Numbers live here, not in combat/enemy/fx files. */
(function(root){
  const VF = root.VocabForce = root.VocabForce || {};

  const RAPID_FINISHER = {
    requiredHits: 3,
    windowSeconds: 1.0,
    hitStopMs: 70,
    slowMotionMs: 110,
    slowScale: 0.32,
    fragmentCount: 10,
    ichorCount: 14,
    burstForce: 14,
    verticalForce: 8,
    cameraShake: 1.15,
    fovPunch: 7.2,
    flashScale: 2.4,
    rings: 4,
    streaks: 8,
    dust: 10,
    maxLive: 2,
    fragmentLife: 0.55,
    ichorLife: 0.42,
    mobileScale: 0.65,
    kickForceMul: 1.28,
    kickCone: 0.78,
    punchCone: 0.48,
    POOL: {ichor: 28, chunk: 20}
  };

  function pruneHits(en, nowMs){
    const w = RAPID_FINISHER.windowSeconds * 1000;
    const src = Array.isArray(en.rapidHitTimestamps) ? en.rapidHitTimestamps : [];
    const kept = [];
    for(let i = 0; i < src.length; i++){
      if(nowMs - src[i] <= w) kept.push(src[i]);
    }
    en.rapidHitTimestamps = kept;
    en.rapidHitCount = kept.length;
    return kept;
  }

  VF.RapidFinisher = RAPID_FINISHER;
  VF._t = VF._t || {};
  VF._t.noteRapidHit = function(en, nowMs, kind){
    if(!en || en.burstFinisherTriggered) return false;
    const now = nowMs || 0;
    const kept = pruneHits(en, now);
    kept.push(now);
    en.rapidHitTimestamps = kept;
    en.rapidHitCount = kept.length;
    en.lastRapidHitTime = now;
    en.lastRapidKind = kind || '';
    return kept.length >= RAPID_FINISHER.requiredHits;
  };
  VF._t.rapidWindowHits = function(en, nowMs){
    if(!en) return 0;
    return pruneHits(en, nowMs || 0).length;
  };
  VF._t.rapidDensity = function(){
    try{
      if(typeof window !== 'undefined' && (window.innerHeight || 900) < 500) return RAPID_FINISHER.mobileScale;
    }catch(_){}
    return 1;
  };
})(typeof window !== 'undefined' ? window : globalThis);
