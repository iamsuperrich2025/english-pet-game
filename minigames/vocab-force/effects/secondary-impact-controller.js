"use strict";
/* Dispatch launched wall/ground crashes. Detection lives on the enemy; numbers live in SecondaryImpactTune. */
(function(root){
  const VF = root.VocabForce = root.VocabForce || {};

  function SecondaryImpactController(){
    this.slowT = 0;
    this.slowScale = 1;
    this.walls = VF.BreakableWallController ? new VF.BreakableWallController() : null;
  }

  SecondaryImpactController.prototype.tickClock = function(dt){
    if(this.slowT > 0) this.slowT = Math.max(0, this.slowT - dt);
    if(this.slowT <= 0) this.slowScale = 1;
  };

  SecondaryImpactController.prototype.simScale = function(hitStop){
    if(hitStop > 0) return 1;
    if(this.slowT > 0) return this.slowScale;
    return 1;
  };

  SecondaryImpactController.prototype._audio = function(audio, surface, level){
    if(!audio) return;
    const extreme = level === 'EXTREME';
    const heavy = level === 'HEAVY' || extreme;
    if(surface === 'wall'){
      if(extreme && audio.zombieWallImpactExtreme) audio.zombieWallImpactExtreme();
      else if(heavy && audio.zombieWallImpactHeavy) audio.zombieWallImpactHeavy();
      else if(audio.zombieWallImpactLight) audio.zombieWallImpactLight();
    }else{
      if(extreme && audio.zombieGroundImpactExtreme) audio.zombieGroundImpactExtreme();
      else if(heavy && audio.zombieGroundImpactHeavy) audio.zombieGroundImpactHeavy();
      else if(audio.zombieGroundImpactLight) audio.zombieGroundImpactLight();
    }
    if(heavy && audio.shockwaveImpact) audio.shockwaveImpact();
    if((level === 'MEDIUM' || heavy) && audio.debrisImpact) audio.debrisImpact();
  };

  SecondaryImpactController.prototype._camera = function(cam, player, ev, spec){
    if(!cam || !cam.impulse || !spec || spec.shake <= 0) return;
    const dist = player ? Math.hypot(player.x - ev.x, player.z - ev.z) : 0;
    const fall = VF.SecondaryImpactTune.cameraFalloff(dist);
    const shake = spec.shake * fall;
    if(shake < 0.04) return;
    cam.impulse(shake, spec.fov * fall, {low: !!spec.lowShake});
  };

  SecondaryImpactController.prototype.handle = function(ev, player, combat, cam, fx, audio){
    if(!ev) return null;
    const T = VF.SecondaryImpactTune;
    const speed = ev.speed || 0;
    const level = T.classify(speed);
    if(!level) return null;
    const spec = T.spec(level);
    const kind = T.kind(ev.surface, speed, ev.fall || 0);
    ev.level = level;
    ev.kind = kind;
    if(this.walls && ev.surface === 'wall'){
      const shattered = this.walls.tryShatter(ev, fx, cam, combat, audio, player);
      if(shattered){
        const WT = VF.BreakableWallTune;
        if(ev.breakTier === 'EXTREME' && WT){
          this.slowT = Math.max(this.slowT, WT.slowMo || 0);
          this.slowScale = WT.slowScale || 0.34;
        }
        return ev;
      }
    }
    if(fx){
      if(ev.surface === 'wall' && fx.wallImpact) fx.wallImpact(ev, spec, player);
      else if(ev.surface === 'ground' && fx.groundImpact) fx.groundImpact(ev, spec, player);
    }
    this._camera(cam, player, ev, spec);
    this._audio(audio, ev.surface, level);
    if(combat && spec.hitStop > 0){
      combat.hitStop = Math.max(combat.hitStop || 0, spec.hitStop);
    }
    if(level === 'EXTREME' && spec.slowMo > 0){
      this.slowT = Math.max(this.slowT, spec.slowMo);
      this.slowScale = spec.slowScale || 0.28;
    }
    if(level === 'EXTREME' && fx && fx.trailBurst && ev.enemy){
      fx.trailBurst(ev.x, ev.y, ev.z, ev.vx || 0, ev.vy || 0, ev.vz || 0);
    }
    return ev;
  };

  SecondaryImpactController.prototype.trails = function(dt, enemies, fx, player){
    if(dt <= 0) return;
    if(!fx || !fx.launchTrail || !enemies || !enemies.list) return;
    const T = VF.SecondaryImpactTune;
    const list = enemies.list;
    for(let i = 0; i < list.length; i++){
      const en = list[i];
      const spd = Math.hypot(en.vx || 0, en.vz || 0, en.vy || 0);
      const flying = !!(en.airborneHit || (en.launchLeft || 0) > 0 || ((en.recover || 0) > 0 && spd > T.TRAIL_STOP) || (!en.alive && (en.deathT || 0) < 0.9 && spd > T.TRAIL_STOP));
      if(flying && spd >= T.TRAIL_MIN){
        en._trailOn = true;
        const dist = player ? Math.hypot(player.x - en.x, player.z - en.z) : 0;
        fx.launchTrail(en.x, en.y + 0.95, en.z, en.vx, en.vy, en.vz, spd, dist);
      }else if(en._trailOn){
        en._trailOn = false;
      }
    }
  };

  VF.SecondaryImpactController = SecondaryImpactController;
})(typeof window !== 'undefined' ? window : globalThis);
