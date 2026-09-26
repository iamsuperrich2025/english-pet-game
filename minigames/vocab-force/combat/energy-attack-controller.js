"use strict";
/* Double-tap ATTACK outside melee, or hold 3s for a 5x charged burst. */
(function(root){
  const VF = root.VocabForce = root.VocabForce || {};

  function EnergyAttackController(){
    this.taps = [];
    this.chargeUntil = 0;
    this.queue = [];
    this.hold = null;
    this.guns = new VF.EnergyProjectileManager();
    this.vortex = VF.EnergyVortexManager ? new VF.EnergyVortexManager() : null;
    this._hudBtn = null;
    this._hud = null;
    this._wind = 0;
    this._gust = 0;
  }

  EnergyAttackController.prototype.attach = function(scene){
    this.guns.attach(scene);
    if(this.vortex && this.vortex.attach) this.vortex.attach(scene);
    return this;
  };

  EnergyAttackController.prototype.cancel = function(){
    this.taps = [];
    this.chargeUntil = 0;
    this.hold = null;
    this._wind = 0;
    this._gust = 0;
    if(this.vortex && this.vortex.set) this.vortex.set(false);
    if(this.guns && this.guns.setAim) this.guns.setAim(false);
    if(VF.audio && VF.audio.stopEnergyCharge) VF.audio.stopEnergyCharge();
    this._armHud(false);
    this._setChargeBar(0);
  };

  EnergyAttackController.prototype._armHud = function(on){
    const btn = this._hudBtn;
    if(!btn || !btn.classList) return;
    if(on) btn.classList.add('is-armed');
    else btn.classList.remove('is-armed');
  };

  EnergyAttackController.prototype._setChargeBar = function(frac){
    const f = Math.max(0, Math.min(1, frac || 0));
    if(this._hud && this._hud.setEnergyCharge) this._hud.setEnergyCharge(f);
    const btn = this._hudBtn;
    if(!btn || !btn.classList) return;
    btn.classList.toggle('is-charging', f > 0.02);
    btn.style.setProperty('--vf-chg', String(f));
  };

  EnergyAttackController.prototype.bindHud = function(btn, hud){
    this._hudBtn = btn || null;
    this._hud = hud || null;
  };

  EnergyAttackController.prototype.beginHold = function(now, player){
    if(!player) return null;
    if(player.isDashing && player.isDashing()) return null;
    if(this.hold && this.hold.active) return {holding: true};
    this.hold = {start: now, fired: false, active: true, chimed: false, aimed: false};
    return {holding: true};
  };

  EnergyAttackController.prototype.noteTap = function(now, player, camera, enemies, fx, audio){
    const T = VF.EnergyAttackTune;
    if(!player) return null;
    if(player.isDashing && player.isDashing()) return null;
    if(player.anim && player.anim.isBusy && player.anim.isBusy(now)) return null;
    const res = VF._t.energyTapResult(this.taps, now);
    this.taps = res.taps;
    if(res.bounce) return {bounce: true};
    if(res.fire){
      this.chargeUntil = 0;
      this._armHud(false);
      return this.beginBurst(now, player, camera, enemies, fx, audio, 0);
    }
    this.chargeUntil = now + T.doubleTapWindowMs;
    this._armHud(true);
    if(audio && audio.energyCharge) audio.energyCharge();
    return {armed: true};
  };

  EnergyAttackController.prototype.beginBurst = function(now, player, camera, enemies, fx, audio, chargeFrac, aimPoint){
    const T = VF.EnergyAttackTune;
    const pal = VF._t.energyPalette(player);
    const frac = Math.max(0, Math.min(1, chargeFrac || 0));
    const scale = VF._t.energyChargeScale ? VF._t.energyChargeScale(frac) : (1 + ((T.chargedScale || 5) - 1) * frac);
    const charged = frac > 0.02;
    if(player.playAction) player.playAction('punch');
    if(player.drive) player.drive(T.recoil * (1 + 0.8 * frac));
    if(player.trails && player.trails.start) player.trails.start('hand', 0.28 + 0.27 * frac);
    const origin = VF._t.energyMuzzle ? VF._t.energyMuzzle(player, {charged: charged}) : {
      x: player.x + (player.forward ? player.forward().x : 0) * T.muzzleForward,
      y: player.y + T.muzzleHeight,
      z: player.z + (player.forward ? player.forward().z : 1) * T.muzzleForward
    };
    const mark = aimPoint || (this.hold && this.hold.aimed ? this.hold : null);
    const aim = (mark && mark.x != null && VF._t.energyDirToPoint)
      ? VF._t.energyDirToPoint(origin, mark)
      : VF._t.energyAim(player, camera, enemies);
    /* รอบ 1593: ตั้งธง net ให้ packShots หยิบไปส่งเพื่อน (เพื่อนปล่อย visual ลูกพลังฝั่งผู้ชม)
       burst id ประทับลงทุก job เพื่อให้ deflect-ack กลับมาลบลูกถูกตัว */
    player._vfShotSeq = (player._vfShotSeq || 0) + 1;
    player._vfShots = {seq: player._vfShotSeq, count: T.projectileCount, charged: charged};
    player._vfDashForce = true;
    this.queue = [];
    for(let i = 0; i < T.projectileCount; i++){
      this.queue.push({
        at: now + i * T.projectileIntervalMs,
        origin: origin,
        dir: aim,
        pal: pal,
        last: i === T.projectileCount - 1,
        index: i,
        burst: player._vfShotSeq,
        scale: scale,
        charged: charged,
        chargeFrac: frac
      });
    }
    if(audio && audio.stopEnergyCharge) audio.stopEnergyCharge();
    if(audio && audio.energyFire) audio.energyFire();
    if(camera && camera.impulse) camera.impulse(0.18 + 0.28 * frac, 2.2 + 2.2 * frac);
    if(frac > 0.08) this._gust = Math.max(this._gust || 0, frac);
    this._wind = 0;
    this._armHud(false);
    this._setChargeBar(0);
    return {burst: true, count: T.projectileCount, aim: aim, charged: charged, scale: scale, chargeFrac: frac};
  };

  EnergyAttackController.prototype._setHoldAim = function(player, camera, input, dt){
    if(!(this.hold && this.hold.active) || !VF._t.energyAimSteer){
      if(this.guns && this.guns.setAim) this.guns.setAim(false);
      return;
    }
    VF._t.energyAimSteer(this.hold, player, camera, input && input.moveX, input && input.moveZ, dt);
    if(this.hold.aimed && this.guns && this.guns.setAim){
      this.guns.setAim(true, {x: this.hold.x, y: this.hold.y, z: this.hold.z}, VF._t.energyPalette ? VF._t.energyPalette(player) : null);
      if(player) player.yaw = Math.atan2(this.hold.x - (player.x || 0), this.hold.z - (player.z || 0));
    }else if(this.guns && this.guns.setAim){
      this.guns.setAim(false);
    }
  };

  EnergyAttackController.prototype._tickHold = function(now, player, camera, enemies, fx, audio, held, released, input, dt){
    const T = VF.EnergyAttackTune;
    if(this.hold && this.hold.active && VF._t.hasMeleeTarget(player, enemies, 'punch')){
      this.cancel();
      return;
    }
    if(this.hold && this.hold.active && held){
      this._setHoldAim(player, camera, input, dt);
      if(this.hold.fired){
        this._wind = 0;
        this._setChargeBar(0);
        if(this.guns && this.guns.setAim) this.guns.setAim(false);
        return;
      }
      const frac = VF._t.energyHoldFrac(this.hold.start, now);
      const show = (now - this.hold.start) >= T.holdBarShowMs;
      this._wind = show ? frac : 0;
      this._setChargeBar(show ? frac : 0);
      if(show) this._armHud(true);
      if(show && !this.hold.chimed){
        this.hold.chimed = true;
        if(audio && audio.startEnergyCharge) audio.startEnergyCharge();
        else if(audio && audio.energyCharge) audio.energyCharge();
      }
      if(this.guns && this.guns.setCharge){
        this.guns.setCharge(show, player, VF._t.energyPalette(player), Math.max(0.18, frac), true);
      }
      return;
    }
    if(this.hold && this.hold.active && (released || !held)){
      const aimed = this.hold.aimed ? {x: this.hold.x, y: this.hold.y, z: this.hold.z} : null;
      const res = VF._t.energyHoldRelease(this.hold.start, now, this.hold.fired);
      this.hold.active = false;
      this._wind = 0;
      this._setChargeBar(0);
      if(this.guns && this.guns.setAim) this.guns.setAim(false);
      if(audio && audio.stopEnergyCharge) audio.stopEnergyCharge();
      if(this.guns && this.guns.setCharge && !this.chargeUntil){
        this.guns.setCharge(false, player, VF._t.energyPalette(player), 0);
      }
      if(res.tap) this.noteTap(now, player, camera, enemies, fx, audio);
      else if(res.charged && !res.cancel){
        this.hold.fired = true;
        this.taps = [];
        this.chargeUntil = 0;
        this.beginBurst(now, player, camera, enemies, fx, audio, res.frac, aimed);
      }else if(!res.charged){
        this.taps = [];
        this.chargeUntil = 0;
        this._armHud(false);
      }
    }
  };

  EnergyAttackController.prototype.tick = function(dt, now, player, enemies, arena, fx, cam, combat, audio, input){
    const T = VF.EnergyAttackTune;
    const held = !!(input && input.held);
    const released = !!(input && input.released);
    this._tickHold(now, player, cam, enemies, fx, audio, held, released, input, dt);
    const pal = VF._t.energyPalette ? VF._t.energyPalette(player) : null;
    if(this.vortex && this.vortex.set){
      this.vortex.set(this._wind > 0.04, player, pal, this._wind);
      if(this.vortex.tick) this.vortex.tick(dt, player);
    }
    if(arena && arena.tickLoose){
      arena.tickLoose(dt, player, this._wind, this._gust);
      this._gust = 0;
    }
    if(this.chargeUntil && now >= this.chargeUntil){
      this.taps = VF._t.pruneEnergyTaps(this.taps, now);
      if(!this.taps.length){
        this.chargeUntil = 0;
        if(!(this.hold && this.hold.active)) this._armHud(false);
      }
    }
    const tapFrac = this.chargeUntil > now ? (this.chargeUntil - now) / T.doubleTapWindowMs : 0;
    const holding = this.hold && this.hold.active;
    if(this.guns && this.guns.setCharge && !holding){
      this.guns.setCharge(tapFrac > 0, player, VF._t.energyPalette(player), tapFrac);
    }
    for(let i = this.queue.length - 1; i >= 0; i--){
      const job = this.queue[i];
      if(now < job.at) continue;
      this.queue.splice(i, 1);
      this.guns.fire(job.origin, job.dir, job.pal, {
        last: job.last, index: job.index, burst: job.burst, scale: job.scale, charged: job.charged, chargeFrac: job.chargeFrac
      });
      if(audio && audio.energyProjectileTravel) audio.energyProjectileTravel();
    }
    if(this.guns) this.guns.tick(dt, enemies, arena, fx, cam, player, combat, audio, input && input.people);
  };

  VF.EnergyAttackController = EnergyAttackController;
})(typeof window !== 'undefined' ? window : globalThis);
