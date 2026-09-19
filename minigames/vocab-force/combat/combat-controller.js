"use strict";
/* Melee windows, knockback impulses, hit-stop. No gore. */
(function(root){
  const VF = root.VocabForce = root.VocabForce || {};

  function CombatController(){
    this.queue = [];
    this.hitStop = 0;
    this.last = {kind: '', at: 0};
  }

  CombatController.prototype.reset = function(){
    this.queue.length = 0;
    this.hitStop = 0;
    this.last = {kind: '', at: 0};
  };

  CombatController.prototype.tryAttack = function(kind, player, now){
    if(!player || player.alive === false || !player.anim) return null;
    if(player.isDashing && player.isDashing()) return null;
    if(player.anim.isBusy(now)) return null;
    const man = player.manifest || (player.anim && player.anim.manifest) || VF.NexManifest;
    const spec = man && man.spec ? man.spec(kind) : null;
    if(!spec) return null;
    const tune = VF.CombatTune.attack(kind);
    const lvl = VF.CombatTune.level(tune.level);
    if(!player.playAction(kind)) return null;
    if(player.drive) player.drive(tune.forwardImpulse);
    if(player.trails && player.trails.start) player.trails.start(tune.trail || 'hand', tune.busy);
    if(VF.audio){
      if(kind === 'kick' || kind === 'heavyKick'){ if(VF.audio.kickWhoosh) VF.audio.kickWhoosh(); }
      else if(VF.audio.punchWhoosh) VF.audio.punchWhoosh();
    }
    const atk = {
      kind: kind,
      at: now,
      hitAt: now + (tune.hitAt || spec.hitAt || 0.24) * 1000,
      done: false,
      damage: tune.damage,
      force: tune.force != null ? tune.force : lvl.knockback,
      range: tune.range,
      radius: tune.radius,
      tune: tune
    };
    this.queue.push(atk);
    this.last = {kind: kind, at: now};
    return atk;
  };

  CombatController.prototype.tryAttackOrApproach = function(kind, player, now, enemies, camera, arena, fx){
    if(!player || !player.anim) return null;
    if(player.isDashing && player.isDashing()) return null;
    if(player.anim.isBusy(now)) return null;
    const plan = VF._t.approachPlan && VF._t.approachPlan(player, enemies, kind, arena);
    if(plan && player.beginDash){
      const ok = player.beginDash({
        kind: 'approach',
        dirX: plan.dirX,
        dirZ: plan.dirZ,
        distance: plan.close,
        duration: VF.DashTune.attackApproachDuration,
        cooldown: VF.DashTune.attackApproachCooldown,
        pendingAttack: kind,
        fx: fx,
        camera: camera,
        arena: arena,
        now: now
      });
      if(ok) return {approach: true, kind: kind, close: plan.close};
    }
    return this.tryAttack(kind, player, now);
  };

  CombatController.prototype.handleAttackPress = function(kind, player, now, enemies, camera, arena, fx, energy, audio, flags){
    if(kind !== 'punch') return this.tryAttackOrApproach(kind, player, now, enemies, camera, arena, fx);
    const worldNear = flags && flags.world && flags.world.canMelee && flags.world.canMelee(player, 3.1);
    if(worldNear || VF._t.hasMeleeTarget(player, enemies, 'punch', flags && flags.people)){
      if(energy && energy.cancel) energy.cancel();
      return this.tryAttackOrApproach('punch', player, now, enemies, camera, arena, fx);
    }
    if(flags && flags.hold && energy && energy.beginHold) return energy.beginHold(now, player);
    if(energy && energy.noteTap) return energy.noteTap(now, player, camera, enemies, fx, audio);
    return this.tryAttackOrApproach('punch', player, now, enemies, camera, arena, fx);
  };

  CombatController.prototype.tick = function(dt, now, player, enemies, fx, camera, audio, secondary, people, world){
    if(this.hitStop > 0){
      this.hitStop = Math.max(0, this.hitStop - dt);
      return {paused: this.hitStop > 0, hits: []};
    }
    const hits = [];
    if(!player) return {paused: false, hits: hits};
    const fwd = player.forward();
    const self = this;
    for(let i = this.queue.length - 1; i >= 0; i--){
      const atk = this.queue[i];
      if(now < atk.hitAt) continue;
      if(!atk.done){
        atk.done = true;
        const tune = atk.tune || VF.CombatTune.attack(atk.kind);
        if(player.drive) player.drive(tune.impactDrive || 0);
        const origin = {
          x: player.x + fwd.x * 0.85,
          y: player.y + 1.0,
          z: player.z + fwd.z * 0.85
        };
        const struck = enemies && enemies.hurtInSphere ? enemies.hurtInSphere(origin, atk.radius + atk.range * 0.15, {
          damage: atk.damage,
          force: atk.force,
          lift: tune.lift,
          maxSpeed: tune.maxSpeed,
          maxDist: tune.maxDist,
          dir: fwd,
          kind: atk.kind,
          origin: origin,
          reaction: tune.reaction,
          level: tune.level
        }) : [];
        const worldStruck = !!(world && world.meleeHit && world.meleeHit(origin, atk.radius + atk.range * 0.15, {
          kind: atk.kind,
          force: atk.force,
          dir: fwd,
          player: player
        }));
        let burst = false;
        struck.forEach(function(en){
          hits.push(en);
          const ready = VF._t.noteRapidHit ? VF._t.noteRapidHit(en, now, atk.kind) : false;
          if(ready && (en.hp || 0) <= 0 && en.beginBurst && en.beginBurst()){
            burst = true;
            if(fx && fx.burstFinisher) fx.burstFinisher(en.x, en.y + 1.05, en.z, {kind: atk.kind, dir: fwd, player: player});
            if(audio){
              if(audio.rapidComboReady) audio.rapidComboReady();
              if(audio.zombieBurstFinisher) audio.zombieBurstFinisher();
              if(audio.zombieBurstImpact) audio.zombieBurstImpact();
              if(audio.zombieBurstFragments) audio.zombieBurstFragments();
            }
          }else{
            if(fx && fx.impact){
              fx.impact(en.x, en.y + 1.15, en.z, {
                kind: atk.kind,
                level: tune.level,
                dir: fwd,
                force: atk.force
              });
            }
            if(audio){
              if(audio.rapidComboHit) audio.rapidComboHit();
              if(atk.kind === 'heavyKick' && audio.heavyImpact) audio.heavyImpact();
              else if((atk.kind === 'kick' || atk.kind === 'heavyKick') && audio.kickImpact) audio.kickImpact();
              else if(audio.punchImpact) audio.punchImpact();
              if(audio.enemyLaunch) audio.enemyLaunch();
            }
          }
        });
        if(burst){
          const T = VF.RapidFinisher || {};
          self.hitStop = Math.max(self.hitStop || 0, (T.hitStopMs || 70) / 1000);
          if(camera && camera.impulse) camera.impulse(T.cameraShake || 1.15, T.fovPunch || 7.2, {low: true});
          if(secondary){
            secondary.slowT = Math.max(secondary.slowT || 0, (T.slowMotionMs || 110) / 1000);
            secondary.slowScale = T.slowScale || 0.32;
          }
        }else if(struck.length || worldStruck){
          const stop = VF.clamp(tune.hitStop || 0.06, 0.04, VF.CombatTune.HIT_STOP_MAX);
          this.hitStop = stop;
          if(camera && camera.impulse) camera.impulse(worldStruck ? Math.max(1.25, tune.cameraShake || 0) : tune.cameraShake, worldStruck ? 8 : tune.fovPunch, {low: worldStruck});
          if(worldStruck && audio && audio.heavyImpact) audio.heavyImpact();
        }
        const folks = people || [];
        const pr = (VF.GunTune && VF.GunTune.PLAYER_R) || 0.62;
        const reach = (atk.radius || 1.28) + (atk.range || 1.92) * 0.15;
        for(let p = 0; p < folks.length; p++){
          const peer = folks[p];
          if(!peer || peer.local || peer.alive === false) continue;
          if(Math.hypot((peer.x || 0) - origin.x, (peer.z || 0) - origin.z) > reach + pr) continue;
          const dmg = VF._t.meleePvpDamage ? VF._t.meleePvpDamage(atk.kind) : (atk.damage || 90);
          if(VF._t.notePvpHit) VF._t.notePvpHit(player, {kind: atk.kind, zone: 'body', targetId: peer.id, dmg: dmg});
          if(fx && fx.impact) fx.impact(peer.x, (peer.y || 0) + 1.15, peer.z, {kind: atk.kind, level: tune.level, dir: fwd, force: atk.force});
        }
      }
      if(now > atk.at + 1200) this.queue.splice(i, 1);
    }
    return {paused: false, hits: hits};
  };

  VF.CombatController = CombatController;
})(typeof window !== 'undefined' ? window : globalThis);
