"use strict";
/* Pooled high-speed energy orbs. Visuals stay original; hits reuse enemy.applyHit. */
(function(root){
  const VF = root.VocabForce = root.VocabForce || {};

  function EnergyProjectileManager(){
    this.group = null;
    this.pool = [];
    this.live = [];
  }

  EnergyProjectileManager.prototype.attach = function(scene){
    const THREE = root.THREE;
    const T = VF.EnergyAttackTune || {};
    this.group = new THREE.Group();
    this.group.name = 'VFEnergyFX';
    scene.add(this.group);
    this.coreGeo = new THREE.SphereGeometry(0.09, 10, 8);
    this.shellGeo = new THREE.SphereGeometry(0.16, 10, 8);
    this.streakGeo = new THREE.BoxGeometry(0.06, 0.06, 0.55);
    this.glowGeo = new THREE.SphereGeometry(0.12, 8, 6);
    const n = T.pool || 9;
    for(let i = 0; i < n; i++){
      const core = new THREE.Mesh(this.coreGeo, new THREE.MeshBasicMaterial({color: 0xb8fff8, transparent: true, opacity: 1, depthWrite: false}));
      const shell = new THREE.Mesh(this.shellGeo, new THREE.MeshBasicMaterial({color: 0x3ee0c8, transparent: true, opacity: 0.38, depthWrite: false}));
      const streak = new THREE.Mesh(this.streakGeo, new THREE.MeshBasicMaterial({color: 0x7cffcf, transparent: true, opacity: 0.7, depthWrite: false}));
      core.visible = false; shell.visible = false; streak.visible = false;
      this.group.add(core, shell, streak);
      this.pool.push({core: core, shell: shell, streak: streak, life: 0, dist: 0, last: 0});
    }
    this.charge = new THREE.Mesh(this.glowGeo, new THREE.MeshBasicMaterial({color: 0x9bfff0, transparent: true, opacity: 0, depthWrite: false}));
    this.charge.visible = false;
    this.group.add(this.charge);
    this.aimMat = new THREE.MeshBasicMaterial({color: 0x7cffcf, transparent: true, opacity: 0.95, depthWrite: false});
    this.aim = new THREE.Group();
    this.aim.name = 'VFEnergyAim';
    this.aim.add(new THREE.Mesh(new THREE.BoxGeometry(0.92, 0.1, 0.1), this.aimMat));
    this.aim.add(new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.92, 0.1), this.aimMat));
    this.aim.visible = false;
    this.group.add(this.aim);
    this._aimT = 0;
    return this;
  };

  EnergyProjectileManager.prototype._take = function(){
    const T = VF.EnergyAttackTune || {};
    if(this.live.length >= (T.maxLive || 6)){
      this._kill(this.live[0], true);
    }
    for(let i = 0; i < this.pool.length; i++){
      if(this.pool[i].life <= 0) return this.pool[i];
    }
    return this.pool[0];
  };

  EnergyProjectileManager.prototype._kill = function(shot, quiet){
    if(!shot) return;
    shot.life = 0;
    shot.scale = 1;
    shot.charged = 0;
    shot.chargeFrac = 0;
    shot.core.visible = false;
    shot.shell.visible = false;
    shot.streak.visible = false;
    shot.core.scale.set(1, 1, 1);
    shot.shell.scale.set(1, 1, 1);
    shot.streak.scale.set(1, 1, 1);
    const i = this.live.indexOf(shot);
    if(i >= 0) this.live.splice(i, 1);
  };

  EnergyProjectileManager.prototype.setCharge = function(on, player, pal, frac, hold){
    if(!this.charge) return;
    if(!on || frac <= 0){
      this.charge.visible = false;
      this.charge.material.opacity = 0;
      return;
    }
    const T = VF.EnergyAttackTune || {};
    const pos = VF._t.energyMuzzle ? VF._t.energyMuzzle(player, {hold: hold}) : null;
    this.charge.visible = true;
    if(pos) this.charge.position.set(pos.x, pos.y, pos.z);
    else{
      const fwd = player.forward ? player.forward() : {x: 0, z: 1};
      const sideX = fwd.z, sideZ = -fwd.x;
      this.charge.position.set(
        player.x + fwd.x * T.muzzleForward + sideX * T.muzzleSide,
        player.y + T.muzzleHeight,
        player.z + fwd.z * T.muzzleForward + sideZ * T.muzzleSide
      );
    }
    const pulse = 0.85 + Math.sin((1 - frac) * 18) * 0.18;
    const grow = (VF._t.energyChargeScale ? VF._t.energyChargeScale(frac) : (1 + 4 * frac));
    const s = hold ? pulse * grow * 0.72 : pulse;
    this.charge.scale.set(s, s, s);
    if(pal) this.charge.material.color.setHex(pal.glow || pal.core);
    this.charge.material.opacity = hold ? 0.28 + frac * 0.55 : 0.55 * frac;
  };

  EnergyProjectileManager.prototype.setAim = function(on, pos, pal){
    if(!this.aim) return;
    this.aim.visible = !!on;
    if(!on) return;
    if(pos) this.aim.position.set(pos.x, pos.y, pos.z);
    if(pal && this.aimMat) this.aimMat.color.setHex(pal.glow || pal.core || 0x7cffcf);
  };

  EnergyProjectileManager.prototype.fire = function(origin, dir, pal, extras){
    const T = VF.EnergyAttackTune || {};
    const shot = this._take();
    if(!shot) return null;
    extras = extras || {};
    shot.life = T.maxRange / Math.max(8, T.projectileSpeed);
    shot.dist = 0;
    shot.x = origin.x; shot.y = origin.y; shot.z = origin.z;
    const speed = T.projectileSpeed || 420;
    const nx = dir && dir.x || 0, ny = dir && dir.y || 0, nz = dir && dir.z || 1;
    const nlen = Math.hypot(nx, ny, nz) || 1;
    shot.vx = nx / nlen * speed;
    shot.vy = ny / nlen * speed;
    shot.vz = nz / nlen * speed;
    shot.last = extras.last ? 1 : 0;
    shot.index = extras.index || 0;
    shot.burst = extras.burst || 0;
    shot.pal = pal;
    shot.charged = extras.charged ? 1 : 0;
    shot.chargeFrac = extras.chargeFrac != null ? extras.chargeFrac : (shot.charged ? 1 : 0);
    shot.scale = extras.scale || (VF._t.energyChargeScale ? VF._t.energyChargeScale(shot.chargeFrac) : 1);
    shot.core.visible = true; shot.shell.visible = true; shot.streak.visible = true;
    const scale = shot.scale * (extras.last ? 1.18 : 1);
    shot.core.scale.set(scale, scale, scale);
    shot.shell.scale.set(scale * 1.15, scale * 1.15, scale * 1.15);
    shot.streak.scale.set(Math.max(0.6, scale * 0.42), Math.max(0.6, scale * 0.42), Math.max(1, scale * 0.95));
    if(pal){
      shot.core.material.color.setHex(pal.core);
      shot.shell.material.color.setHex(pal.shell);
      shot.streak.material.color.setHex(pal.trail);
    }
    shot.core.position.set(shot.x, shot.y, shot.z);
    shot.shell.position.set(shot.x, shot.y, shot.z);
    shot.streak.position.set(shot.x, shot.y, shot.z);
    if(this.live.indexOf(shot) < 0) this.live.push(shot);
    return shot;
  };

  EnergyProjectileManager.prototype._impactFx = function(fx, x, y, z, nx, ny, nz, pal, last, scale, chargeFrac){
    if(!fx) return;
    const T = VF.EnergyAttackTune || {};
    const f = chargeFrac != null ? chargeFrac : (scale > 1.02 ? (Math.max(1, scale || 1) - 1) / Math.max(1, (T.chargedScale || 5) - 1) : 0);
    const r = VF._t.energyBlastRadius ? VF._t.energyBlastRadius(f, last) : ((T.blastRadius || 2.4) * (last ? 1.15 : 1));
    if(fx.arenaFire) fx.arenaFire(x, y, z, {r: r});
    if(!fx._spawn) return;
    const gy = 0.06;
    const gold = pal && pal.glow ? pal.glow : 0xffc174;
    fx._spawn('ring', x, gy, z, 0.44 + 0.14 * f, {
      role: 'shock', rotX: -Math.PI / 2, startR: 0.48, endR: r, color: gold, opacity: 0.9, add: true
    });
    fx._spawn('ring', x, gy + 0.05, z, 0.34 + 0.1 * f, {
      role: 'shock', rotX: -Math.PI / 2, startR: 0.36, endR: r * 0.72, color: 0xfff1c8, opacity: 0.58, add: true
    });
    if(f > 0.45){
      fx._spawn('ring', x, gy + 0.03, z, 0.5 + 0.12 * f, {
        role: 'shock', rotX: -Math.PI / 2, startR: 0.7, endR: r * 1.18, color: 0xff812e, opacity: 0.4, add: true
      });
    }
  };

  /* รอบ 1585: ลูกพลังชาร์จโดนรถ = ระเบิดแตกสลายทันที — รถน้ำมันใช้เส้นทาง _explode เดิม (500 ทุกตัว)
     รถยนต์สลับซากชุดแตก + ไฟลุก + แรงสั่นกล้อง */
  EnergyProjectileManager.prototype.setVehicles = function(sedan, tanker){
    this._vehicles = {sedan: sedan || null, tanker: tanker || null};
  };

  EnergyProjectileManager.prototype._hitVehicle = function(shot, rad, fx, audio, cam){
    const v = this._vehicles;
    if(!v) return false;
    const tanker = v.tanker;
    if(tanker && tanker.ready && tanker.collider && !tanker.collider.broken){
      const c = tanker.collider;
      if(shot.x >= c.minx - rad && shot.x <= c.maxx + rad &&
         shot.z >= c.minz - rad && shot.z <= c.maxz + rad &&
         shot.y <= (c.maxy || 4.8) + rad && shot.y >= -rad){
        tanker.detonate();
        this._impactFx(fx, shot.x, shot.y, shot.z, shot.vx, 0, shot.vz, shot.pal, !!shot.last, shot.scale, shot.chargeFrac);
        if(audio && audio.arenaFire) audio.arenaFire();
        if(cam && cam.impulse) cam.impulse(0.5, 3.4);
        return true;
      }
    }
    const sedan = v.sedan;
    if(sedan && sedan.ready && sedan.collider && !sedan.collider.broken){
      const c = sedan.collider;
      if(shot.x >= c.minx - rad && shot.x <= c.maxx + rad &&
         shot.z >= c.minz - rad && shot.z <= c.maxz + rad &&
         shot.y <= (c.maxy || 1.7) + rad && shot.y >= -rad){
        sedan.detonate(fx, audio, cam);
        this._impactFx(fx, shot.x, shot.y, shot.z, shot.vx, 0, shot.vz, shot.pal, !!shot.last, shot.scale, shot.chargeFrac);
        return true;
      }
    }
    return false;
  };

  EnergyProjectileManager.prototype.tick = function(dt, enemies, arena, fx, cam, player, combat, audio, people){
    const T = VF.EnergyAttackTune || {};
    const baseRad = T.projectileRadius || 0.28;
    if(this.aim && this.aim.visible){
      this._aimT = (this._aimT || 0) + dt;
      const pulse = 1 + Math.sin(this._aimT * 9) * 0.1;
      this.aim.scale.set(pulse, pulse, pulse);
      this.aim.rotation.y += dt * 1.8;
    }
    for(let i = this.live.length - 1; i >= 0; i--){
      const shot = this.live[i];
      const rad = baseRad * (shot.scale || 1);
      const step = Math.min(dt, 0.05);
      const move = T.projectileSpeed * step;
      const slices = Math.max(1, Math.ceil(move / 0.32));
      const sx = shot.vx * step / slices, sy = shot.vy * step / slices, sz = shot.vz * step / slices;
      let hit = false;
      for(let s = 0; s < slices && !hit; s++){
        shot.x += sx; shot.y += sy; shot.z += sz;
        shot.dist += Math.hypot(sx, sy, sz);
        /* รอบ 1585: เช็กยานพาหนะก่อน arena.collide เสมอ — collider รถตอน idle ถูก arena ถือเป็นกล่อง
           สิ่งกีดขวางปกติ ถ้าปล่อยให้เช็กก่อน ลูกพลังจะกลายเป็นแค่การกระแทกกำแพงทั่วไป */
        if(this._hitVehicle(shot, rad, fx, audio, cam)){
          hit = true;
          break;
        }
        if(arena && arena.collide){
          const c = arena.collide(shot.x, shot.y, shot.z, rad);
          const corr = Math.hypot(c.x - shot.x, c.z - shot.z);
          if(c.wall || corr > 0.12){
            const nx = c.normal && c.normal.x || 0, nz = c.normal && c.normal.z || 0;
            const speed = Math.hypot(shot.vx, shot.vy, shot.vz);
            this._impactFx(fx, shot.x, shot.y, shot.z, nx, 0, nz, shot.pal, !!shot.last, shot.scale, shot.chargeFrac);
            if(c.hitBox && VF._t.canShatterWall && VF._t.canShatterWall(c.hitBox, speed * (T.wallBreakScale || 0.55))){
              const ev = {
                surface: 'wall', box: c.hitBox, speed: speed * (T.wallBreakScale || 0.55),
                x: c.contact && c.contact.x || shot.x, y: shot.y, z: c.contact && c.contact.z || shot.z,
                nx: nx, ny: 0, nz: nz, vx: shot.vx, vz: shot.vz
              };
              if(VF.BreakableWallController){
                const walls = this._walls || (this._walls = new VF.BreakableWallController());
                walls.tryShatter(ev, fx, cam, combat, audio, player);
              }
            }
            if(audio && audio.energyWallImpact) audio.energyWallImpact();
            hit = true;
            break;
          }
        }
        const folks = people || [];
        for(let p = 0; p < folks.length && !hit; p++){
          const peer = folks[p];
          if(!peer || peer.local || peer.alive === false) continue;
          const pr = (VF.GunTune && VF.GunTune.PLAYER_R) || 0.62;
          const d = Math.hypot((peer.x || 0) - shot.x, (peer.z || 0) - shot.z);
          if(d > rad + pr) continue;
          const zone = VF._t.hitZone ? VF._t.hitZone(shot.y, peer) : 'body';
          const dmg = VF._t.gunDamage ? VF._t.gunDamage(VF._t.playerGunId(player), zone, shot.chargeFrac) : (VF.PLAYER_HP || 1000);
          if(VF._t.notePvpHit) VF._t.notePvpHit(player, {kind: 'G', zone: zone, targetId: peer.id, dmg: dmg});
          this._impactFx(fx, shot.x, shot.y, shot.z, shot.vx, 0, shot.vz, shot.pal, !!shot.last, shot.scale, shot.chargeFrac);
          hit = true;
        }
        const list = enemies && enemies.list ? enemies.list : [];
        for(let e = 0; e < list.length && !hit; e++){
          const en = list[e];
          if(!en || en.burstFinisherTriggered || en.state === 'gone') continue;
          if(!en.alive && en.state !== 'dying') continue;
          const d = Math.hypot(en.x - shot.x, en.z - shot.z);
          if(d <= rad + (en.radius || 0.7) && Math.abs((en.y || 0) + 0.9 - shot.y) < 1.6){
            const last = !!shot.last;
            const mul = last ? (T.lastProjectileKnockbackMultiplier || 1.3) : 1;
            const f = shot.chargeFrac != null ? shot.chargeFrac : (shot.charged ? 1 : 0);
            const dmgMul = VF._t.energyChargeMul ? VF._t.energyChargeMul(f, T.chargedDamageMul) : (shot.charged ? (T.chargedDamageMul || 1) : 1);
            const kbMul = VF._t.energyChargeMul ? VF._t.energyChargeMul(f, T.chargedKnockbackMul) : (shot.charged ? (T.chargedKnockbackMul || 1) : 1);
            const liftMul = VF._t.energyChargeMul ? VF._t.energyChargeMul(f, T.chargedLiftMul) : (shot.charged ? (T.chargedLiftMul || 1) : 1);
            en.applyHit({
              damage: T.damagePerProjectile * dmgMul,
              force: T.knockbackPerProjectile * mul * kbMul,
              lift: (last ? T.lastProjectileLift : T.liftPerProjectile) * liftMul,
              dir: {x: shot.vx, z: shot.vz},
              origin: {x: shot.x, y: shot.y, z: shot.z},
              kind: 'energy',
              reaction: last || f >= 0.45 ? 'launch' : 'front',
              level: f >= 0.75 ? (last ? 'HEAVY' : 'MEDIUM') : (last ? 'MEDIUM' : 'LIGHT')
            });
            this._impactFx(fx, shot.x, shot.y, shot.z, shot.vx, 0, shot.vz, shot.pal, last, shot.scale, shot.chargeFrac);
            if(cam && cam.impulse && player){
              const dist = Math.hypot(player.x - shot.x, player.z - shot.z);
              if(dist < 14) cam.impulse(last ? T.finalShake : T.cameraShake, T.fovPunch * (last ? 1.25 : 1));
            }
            if(audio){
              if(last && audio.energyFinalHit) audio.energyFinalHit();
              else if(audio.energyHit) audio.energyHit();
            }
            hit = true;
            break;
          }
        }
      }
      if(hit){
        this._kill(shot);
        continue;
      }
      if(shot.dist >= T.maxRange || (shot.life -= step) <= 0){
        this._impactFx(fx, shot.x, shot.y, shot.z, shot.vx, 0, shot.vz, shot.pal, !!shot.last, shot.scale, shot.chargeFrac);
        this._kill(shot);
        continue;
      }
      shot.core.position.set(shot.x, shot.y, shot.z);
      shot.shell.position.set(shot.x, shot.y, shot.z);
      shot.streak.position.set(shot.x - shot.vx * 0.012, shot.y - shot.vy * 0.012, shot.z - shot.vz * 0.012);
      const yaw = Math.atan2(shot.vx, shot.vz);
      shot.streak.rotation.y = yaw;
      shot.shell.rotation.y += dt * 8;
    }
  };

  /* รอบ 1593: ลูกพลังถูกปัด (deflect-ack จากเพื่อนที่เป็นคนปัด) — ลบลูกจริงเงียบ ๆ กันดาเมจซ้ำ */
  EnergyProjectileManager.prototype.killQuietByBurst = function(burst, index){
    for(let i = this.live.length - 1; i >= 0; i--){
      const shot = this.live[i];
      if((shot.burst || 0) === (burst || 0) && (shot.index || 0) === (index || 0)){
        this._kill(shot, true);
        return true;
      }
    }
    return false;
  };

  EnergyProjectileManager.prototype.dispose = function(){
    this.live.slice().forEach(function(s){ s.life = 0; });
    this.live = [];
  };

  VF.EnergyProjectileManager = EnergyProjectileManager;
})(typeof window !== 'undefined' ? window : globalThis);
