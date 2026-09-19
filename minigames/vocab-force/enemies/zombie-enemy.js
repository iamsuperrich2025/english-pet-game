"use strict";
/* Letter-carrying zombie. One cloned Mixamo body per instance. No gore. */
(function(root){
  const VF = root.VocabForce = root.VocabForce || {};

  function makeLetterSprite(THREE, letter, height){
    const canvas = document.createElement('canvas');
    canvas.width = 128; canvas.height = 128;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#081018';
    ctx.beginPath(); ctx.arc(64, 64, 58, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#7cffcf';
    ctx.font = 'bold 78px Trebuchet MS, sans-serif';
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText(letter, 64, 70);
    const tex = new THREE.CanvasTexture(canvas);
    const spr = new THREE.Sprite(new THREE.SpriteMaterial({map: tex, transparent: true, depthWrite: false}));
    spr.scale.set(1.15, 1.15, 1);
    spr.position.y = (height || 1.8) + 0.55;
    return {spr: spr, tex: tex};
  }

  function ZombieEnemy(opts){
    opts = opts || {};
    const THREE = root.THREE;
    this.letter = opts.letter ? String(opts.letter).slice(0, 1).toUpperCase() : '';
    this.hp = opts.hp != null ? opts.hp : (VF.ZOMBIE_HP || 36);
    this.maxHp = this.hp;
    this.hunter = !this.letter || !!opts.hunter;
    this.collusion = !!opts.collusion;
    this.preyId = opts.preyId || '';
    this.biteDamage = opts.bite != null ? opts.bite : (VF.ZOMBIE_BITE || 12);
    this.biteCool = 0;
    this.pendingBite = 0;
    this.x = opts.x || 0; this.y = opts.y || 0; this.z = opts.z || 0;
    this.vx = 0; this.vz = 0; this.vy = 0;
    this.yaw = 0;
    this.state = 'idle';
    this.alive = true;
    this.radius = 0.7;
    this.detect = opts.detect != null ? opts.detect : (this.collusion ? 48 : (this.hunter ? (VF.HUNTER_DETECT || 36) : 9));
    this.attackR = opts.attackR != null ? opts.attackR : 1.55;
    this.walkSpeed = opts.walkSpeed != null ? opts.walkSpeed : (this.collusion ? 2.9 : 1.75);
    this.recover = 0;
    this.recoil = 0;
    this.spin = 0;
    this.launchLeft = 0;
    this.airborneHit = false;
    this.justLanded = null;
    this.pendingImpacts = [];
    this.rewardAt = {x: this.x, y: this.y, z: this.z};
    this.rollT = 0;
    this._wallTouch = false;
    this._wallCool = 0;
    this._groundCool = 0;
    this._trailOn = false;
    this.screamT = 0;
    this.screamCool = 0;
    this.deathT = 0;
    this.deathReady = false;
    this.deathBlast = false;
    this.pendingDeathFire = null;
    this._screamed = false;
    this.rapidHitCount = 0;
    this.rapidHitTimestamps = [];
    this.lastRapidHitTime = 0;
    this.burstFinisherTriggered = false;
    const inst = VF.ZomAssets.spawn();
    this.mesh = inst.pivot;
    this.model = inst.model;
    this.anim = inst.anim;
    this.height = inst.height || 1.8;
    if(this.letter){
      const badge = makeLetterSprite(THREE, this.letter, this.height);
      this.mesh.add(badge.spr);
      this.mesh.userData.letterSprite = badge.spr;
      this.mesh.userData.letterTex = badge.tex;
    }
    this.bar = new VF.HealthBar({y: this.height + 0.48, max: this.maxHp});
    this.mesh.position.set(this.x, this.y, this.z);
    this._playIdle();
  }

  ZombieEnemy.prototype._playIdle = function(){
    if(!this.anim) return;
    if(this.anim.has('idle')) this.anim.play('idle');
    else this.anim.play('walk', {timeScale: 0.0001, loop: true});
  };

  ZombieEnemy.prototype._chooseAnim = function(){
    if(!this.anim) return;
    if(!this.alive){
      this.anim.play('fall', {force: this.state === 'dying'});
      return;
    }
    if(this.screamT > 0){
      this.anim.play('scream');
      return;
    }
    if(this.recover > 0) return;
    if(this.state === 'chase' || this.state === 'attack'){
      this.anim.play('walk');
      return;
    }
    this._playIdle();
  };

  ZombieEnemy.prototype.setLetter = function(ch){
    this.letter = String(ch || '?').slice(0, 1).toUpperCase();
  };

  ZombieEnemy.prototype.applyHit = function(info){
    if(this.burstFinisherTriggered || this.state === 'gone') return false;
    if(!this.alive){
      this.rewardAt = {x: this.x, y: this.y, z: this.z};
      return true;
    }
    info = info || {};
    const tune = VF.CombatTune.attack(info.kind === 'energy' ? 'punch' : (info.kind || 'punch'));
    const level = VF.CombatTune.level(info.level || tune.level);
    this.hp -= info.damage != null ? info.damage : tune.damage;
    if(this.bar) this.bar.set(this.hp, this.maxHp);
    const dir = VF._t.resolveHitDir(info.dir || {x: 0, z: 1}, info.origin || {x: this.x, z: this.z}, this, info.reaction || tune.reaction);
    const kb = info.force != null ? info.force : level.knockback;
    const imp = VF._t.combatImpulse(kb, dir, info.maxSpeed != null ? info.maxSpeed : level.maxSpeed);
    this.vx = imp.x;
    this.vz = imp.z;
    const lift = info.lift != null ? info.lift : level.lift;
    this.vy = Math.min(lift, 8.2);
    this.launchLeft = info.maxDist != null ? info.maxDist : level.maxDist;
    this.spin = ((info.reaction || tune.reaction) === 'sweep' ? 1.6 : (dir.side >= 0 ? 1 : -1)) * level.spin * (info.kind === 'kick' || info.kind === 'heavyKick' ? 1.28 : 1);
    this.recoil = info.kind === 'kick' || info.kind === 'heavyKick' ? 1.35 : 1;
    this.airborneHit = true;
    this.rollT = info.kind === 'kick' || info.kind === 'heavyKick' ? 0.28 : 0.18;
    this.screamT = 0;
    this.state = 'hurt';
    this.recover = 0.58 + (level.lift > 5 ? 0.22 : 0) + (info.kind === 'kick' || info.kind === 'heavyKick' ? 0.12 : 0);
    if(this.hp <= 0){
      this.alive = false;
      this.state = 'dying';
      this.deathT = 0;
      if(this.anim) this.anim.play('fall', {force: true});
      if(VF.audio && VF.audio.loadClip) VF.audio.loadClip('boom');
    }
    return true;
  };

  ZombieEnemy.prototype.tick = function(dt, player, arena){
    if(!this.alive && this.state === 'gone') return;
    const T = VF.CombatTune;
    const floor0 = arena && arena.surfaceY ? arena.surfaceY(this.x, this.z) : 0;
    const air = this.y > floor0 + 0.1 || this.vy > 0.35;
    const dampK = air ? T.AIR_DAMP : (this.launchLeft > 0 ? T.SLIDE_DAMP : T.GROUND_DAMP);
    this.vx *= Math.exp(-dt * dampK);
    this.vz *= Math.exp(-dt * dampK);
    const spd = Math.hypot(this.vx, this.vz);
    const cap = T.VELOCITY_CAP;
    if(spd > cap){
      const s = cap / spd;
      this.vx *= s; this.vz *= s;
    }
    this.vy -= T.GRAVITY * dt;
    const px = this.x, pz = this.z;
    const inVx = this.vx, inVy = this.vy, inVz = this.vz;
    this.x += this.vx * dt;
    this.z += this.vz * dt;
    this.y += this.vy * dt;
    if(this.launchLeft > 0){
      this.launchLeft -= Math.hypot(this.x - px, this.z - pz);
      if(this.launchLeft <= 0){
        this.launchLeft = 0;
        if(!air){ this.vx *= 0.35; this.vz *= 0.35; }
      }
    }
    this.pendingImpacts = [];
    this._wallCool = Math.max(0, this._wallCool - dt);
    this._groundCool = Math.max(0, this._groundCool - dt);
    this.rollT = Math.max(0, this.rollT - dt);
    const ST = VF.SecondaryImpactTune;
    if(arena && arena.collide){
      const c = arena.collide(this.x, this.y, this.z, this.radius);
      const corrX = c.x - this.x, corrZ = c.z - this.z;
      const corr = Math.hypot(corrX, corrZ);
      const touching = !!(c.wall || corr > 0.002);
      let nx = c.normal && c.normal.x || 0;
      let nz = c.normal && c.normal.z || 0;
      if(corr > 0.002 && Math.hypot(nx, nz) < 0.2){
        nx = corrX / corr; nz = corrZ / corr;
      }
      const nlen = Math.hypot(nx, nz) || 1;
      nx /= nlen; nz /= nlen;
      const into = touching ? Math.max(0, -(inVx * nx + inVz * nz)) : 0;
      if(VF._t.wallImpactArmed(this, into, touching)){
        const contact = c.contact || {};
        const ix = contact.x != null ? contact.x : (c.x - nx * this.radius);
        const iz = contact.z != null ? contact.z : (c.z - nz * this.radius);
        const iy = contact.y != null ? contact.y : (this.y + this.height * 0.55);
        const crash = Math.max(into, Math.hypot(inVx, inVz, inVy * 0.35));
        const hitBox = c.hitBox || null;
        const willShatter = !!(VF._t.canShatterWall && VF._t.canShatterWall(hitBox, crash));
        this.pendingImpacts.push({
          surface: 'wall',
          x: ix, y: iy, z: iz,
          nx: nx, ny: 0, nz: nz,
          speed: crash,
          into: into,
          fall: Math.max(0, -inVy),
          vx: inVx, vy: inVy, vz: inVz,
          enemy: this,
          box: hitBox,
          shatter: willShatter
        });
        this._wallCool = ST ? ST.WALL_COOL : 0.48;
        if(willShatter){
          VF._t.breakWall(hitBox);
          const keep = (VF.BreakableWallTune && VF.BreakableWallTune.throughKeep) || 0.52;
          this.vx = inVx * keep;
          this.vz = inVz * keep;
          this.vy = Math.min(this.vy, 2.2);
          this.spin += (nx > 0 ? 1 : -1) * 1.2;
          this.rollT = Math.max(this.rollT, 0.42);
        }else{
          const lv = ST && ST.classify(crash);
          const spec = lv && ST.spec(lv);
          const bounce = spec && spec.bounce || 0;
          const vn = inVx * nx + inVz * nz;
          if(vn < 0){
            const rest = bounce > 1.5 ? 0.55 : 0.22;
            this.vx = inVx - (1 + rest) * vn * nx;
            this.vz = inVz - (1 + rest) * vn * nz;
          }
          if(bounce > 1.2) this.vy = Math.min(this.vy, -1.6);
          this.spin += (nx > 0 ? 1 : -1) * (0.8 + bounce * 0.2);
          this.rollT = Math.max(this.rollT, 0.28 + bounce * 0.08);
        }
      }else if(!touching){
        this.rewardAt = {x: this.x, y: this.y, z: this.z};
      }
      this.x = c.x; this.z = c.z;
    }
    const floor = arena && arena.surfaceY ? arena.surfaceY(this.x, this.z) : 0;
    if(this.y < floor){
      const fall = Math.max(0, -inVy);
      const landSpd = Math.hypot(inVx, inVz, fall);
      const heavyLand = this.airborneHit || inVy < -3.5;
      this.y = floor;
      if(!this.alive){
        this.vy = 0;
        this.vx *= 0.45;
        this.vz *= 0.45;
        this.airborneHit = false;
      }else if(VF._t.groundImpactArmed(this, landSpd, fall)){
        const lv = ST && ST.classify(landSpd);
        const spec = lv && ST.spec(lv);
        this.pendingImpacts.push({
          surface: 'ground',
          x: this.x, y: floor, z: this.z,
          nx: 0, ny: 1, nz: 0,
          speed: landSpd,
          fall: fall,
          vx: inVx, vy: inVy, vz: inVz,
          enemy: this
        });
        this._groundCool = ST ? ST.GROUND_COOL : 0.32;
        const horiz = Math.hypot(inVx, inVz);
        if(spec && spec.bounce > 0.2){
          if(horiz > fall * 0.85){
            this.vy = spec.bounce * (0.28 + Math.random() * 0.22);
            this.vx = inVx * spec.slideKeep;
            this.vz = inVz * spec.slideKeep;
            this.rollT = Math.max(this.rollT, 0.42 + Math.random() * 0.2);
          }else{
            this.vy = spec.bounce * (0.75 + Math.random() * 0.4);
            this.vx = inVx * (spec.slideKeep * 0.85);
            this.vz = inVz * (spec.slideKeep * 0.85);
            this.rollT = Math.max(this.rollT, 0.22 + Math.random() * 0.18);
          }
          this.spin += (Math.random() * 2 - 1) * (0.6 + spec.bounce * 0.15);
        }else{
          this.vy = 0;
        }
        this.justLanded = {x: this.x, y: this.y, z: this.z, speed: landSpd, heavy: landSpd > 10, secondary: true};
        if((spec && spec.bounce || 0) < 1.2) this.airborneHit = false;
      }else{
        this.vy = 0;
        if(heavyLand){
          this.justLanded = {x: this.x, y: this.y, z: this.z, speed: Math.hypot(inVx, inVz), heavy: false, secondary: false};
          this.airborneHit = false;
        }
      }
    }
    this.recoil = Math.max(0, this.recoil - dt * 3.6);
    this.screamCool = Math.max(0, this.screamCool - dt);
    if(!this.alive){
      this.deathT += dt;
      this.mesh.position.set(this.x, this.y, this.z);
      this.mesh.rotation.y = this.yaw;
      this.mesh.rotation.x = 0;
      this.mesh.rotation.z = 0;
      if(this.anim) this.anim.tick(dt);
      const spr = this.mesh.userData && this.mesh.userData.letterSprite;
      if(spr) spr.visible = false;
      const bodyH = this._pinBackToFloor(floor);
      if(!this.burstFinisherTriggered && !this.deathBlast && this.y <= floor + 0.08 && this.deathT >= 0.42 && (bodyH <= 1.22 || this.deathT >= 0.85)){
        this.deathBlast = true;
        this.pendingDeathFire = {x: this.x, y: floor, z: this.z};
        if(VF.audio && VF.audio.loadClip) VF.audio.loadClip('boom');
      }
      if(this.deathT >= 1.35) this.deathReady = true;
      return;
    }
    this.recover = Math.max(0, this.recover - dt);
    this.screamT = Math.max(0, this.screamT - dt);
    const dx = player.x - this.x, dz = player.z - this.z;
    const dist = Math.hypot(dx, dz);
    const prev = this.state;
    if(this.recover > 0) this.state = 'hurt';
    else if(this.screamT > 0) this.state = 'scream';
    else if(dist < this.attackR) this.state = 'attack';
    else if(dist < this.detect) this.state = 'chase';
    else this.state = 'idle';
    if(this.state === 'chase' && prev === 'idle' && this.screamCool <= 0 && this.anim && this.anim.has('scream')){
      this.state = 'scream';
      this.screamT = 1.35;
      this.screamCool = 7.5;
      this.anim.play('scream', {force: true});
    }
    if(this.state === 'chase' && this.screamT <= 0){
      this.x += (dx / dist) * this.walkSpeed * dt;
      this.z += (dz / dist) * this.walkSpeed * dt;
    }
    if(this.state === 'attack' && player && player.alive !== false && typeof player.takeHit === 'function'){
      this.biteCool -= dt;
      if(this.biteCool <= 0){
        this.pendingBite = this.biteDamage;
        this.biteCool = this.collusion ? 0.86 : 1.12;
      }
    }else{
      this.biteCool = Math.max(0, this.biteCool - dt);
    }
    if(dist > 0.01 && this.recover <= 0) this.yaw = Math.atan2(dx, dz);
    this._chooseAnim();
    if(this.anim) this.anim.tick(dt);
    this.mesh.position.set(this.x, this.y, this.z);
    this.mesh.rotation.y = this.yaw + this.spin * 0.18 * this.recoil;
    let wantX = this.recoil > 0.05 ? 0.22 * this.recoil : 0;
    let wantZ = this.spin * 0.1 * this.recoil;
    if(this.rollT > 0){
      wantX += this.spin * 0.16 * this.rollT;
      wantZ += this.spin * 0.28 * this.rollT;
    }
    this.mesh.rotation.x = VF.lerp(this.mesh.rotation.x, wantX, VF.clamp(dt * 10, 0, 1));
    this.mesh.rotation.z = VF.lerp(this.mesh.rotation.z, wantZ, VF.clamp(dt * 8, 0, 1));
  };

  ZombieEnemy.prototype._pinBackToFloor = function(floor){
    const THREE = root.THREE;
    if(!this.mesh || this.mesh.visible === false || !THREE || !THREE.Box3) return this.height || 1.8;
    if(!this._bbox) this._bbox = new THREE.Box3();
    this.mesh.updateMatrixWorld(true);
    this._bbox.setFromObject(this.mesh);
    const minY = this._bbox.min.y;
    const maxY = this._bbox.max.y;
    if(!isFinite(minY) || !isFinite(maxY)) return this.height || 1.8;
    const dy = (floor || 0) - minY;
    if(dy > 0.012 || dy < -0.012) this.mesh.position.y += dy;
    return Math.max(0.08, maxY - minY);
  };

  ZombieEnemy.prototype.beginBurst = function(){
    if(this.burstFinisherTriggered) return false;
    this.burstFinisherTriggered = true;
    this.rapidHitTimestamps = [];
    this.rapidHitCount = 0;
    this.alive = false;
    this.state = 'dying';
    this.deathT = 1;
    this.deathReady = true;
    this.hp = 0;
    if(this.bar) this.bar.set(0, this.maxHp);
    this.rewardAt = {x: this.x, y: this.y, z: this.z};
    this.vx = 0; this.vy = 0; this.vz = 0;
    if(this.mesh) this.mesh.visible = false;
    return true;
  };

  VF.ZombieEnemy = ZombieEnemy;
})(typeof window !== 'undefined' ? window : globalThis);
