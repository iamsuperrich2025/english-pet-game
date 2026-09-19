"use strict";
/* Shatter a flagged wall once. Visuals stay in ImpactFX; collision lives on the arena box. */
(function(root){
  const VF = root.VocabForce = root.VocabForce || {};

  function BreakableWallController(){
    this._at = [];
  }

  BreakableWallController.prototype.tryShatter = function(ev, fx, cam, combat, audio, player){
    if(!ev || ev.surface !== 'wall') return null;
    const box = ev.box;
    if(!box || !box.breakable || box._shatterFx) return null;
    const speed = ev.speed || 0;
    const tier = VF._t.breakableTier && VF._t.breakableTier(speed);
    if(!tier) return null;
    if(!box.broken) VF._t.breakWall(box);
    if(!box.broken) return null;
    box._shatterFx = true;
    const T = VF.BreakableWallTune;
    const now = VF.now ? VF.now() : Date.now();
    this._at = this._at.filter(function(t){ return now - t < 1200; });
    this._at.push(now);
    const crowded = this._at.length > (T.maxLive || 3);
    if(fx && fx.wallShatter) fx.wallShatter(ev, tier, player, crowded);
    const spec = {
      shake: tier === 'EXTREME' ? T.extremeShake : T.cameraShake,
      fov: tier === 'EXTREME' ? T.extremeFov : T.fovPunch,
      lowShake: true
    };
    if(cam && cam.impulse){
      const dist = player ? Math.hypot(player.x - ev.x, player.z - ev.z) : 0;
      const fall = VF.SecondaryImpactTune && VF.SecondaryImpactTune.cameraFalloff
        ? VF.SecondaryImpactTune.cameraFalloff(dist) : 1;
      const shake = spec.shake * fall;
      if(shake >= 0.04) cam.impulse(shake, spec.fov * fall, {low: true});
    }
    if(combat){
      const stop = tier === 'EXTREME' ? T.extremeHitStop : T.hitStop;
      combat.hitStop = Math.max(combat.hitStop || 0, stop);
    }
    if(tier === 'EXTREME' && this.slowT != null){
      /* slow-mo is owned by SecondaryImpactController when passed as host */
    }
    if(audio){
      if(audio.breakableWallHit) audio.breakableWallHit();
      if(audio.breakableWallCrack) audio.breakableWallCrack();
      if(audio.breakableWallShatter) audio.breakableWallShatter();
      if(audio.breakableWallDebris) audio.breakableWallDebris();
      if(tier === 'EXTREME' && audio.breakableWallCollapse) audio.breakableWallCollapse();
    }
    ev.shattered = true;
    ev.breakTier = tier;
    return ev;
  };

  VF.BreakableWallController = BreakableWallController;
})(typeof window !== 'undefined' ? window : globalThis);
