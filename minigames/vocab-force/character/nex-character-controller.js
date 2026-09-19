"use strict";
/* Single NEX actor: locomotion, jump, facing. AnimationMixer stays on this body. */
(function(root){
  const VF = root.VocabForce = root.VocabForce || {};

  /* Camera looks along (sin(yaw), cos(yaw)). Three.js lookAt makes view-right = (-cos, sin). */
  function cameraWish(camYaw, moveX, moveZ){
    const s = Math.sin(camYaw), c = Math.cos(camYaw);
    return {
      x: -moveX * c + moveZ * s,
      z: moveX * s + moveZ * c
    };
  }

  function NexCharacterController(){
    this.x = 0; this.y = 0; this.z = 0;
    this.yaw = 0;
    this.vx = 0; this.vz = 0; this.vy = 0;
    this.grounded = true;
    this.radius = 0.55;
    this.height = 1.8;
    this.speed = 0;
    this.mode = 'idle';
    this.blocking = false;
    this.pivot = null;
    this.model = null;
    this.anim = null;
    this.ready = false;
    this.walkSpeed = 5.4;
    this.runSpeed = 8.6;
    this.sprintSpeed = 12.4;
    this.jumpSpeed = 8.2;
    this.gravity = 24;
    this._driveT = 0;
    this._dash = {active: false, kind: '', leftT: 0, dirX: 0, dirZ: 0, speed: 0, pendingAttack: null, coolUntil: 0, ghostT: 0, blocked: false, overdrive: false, traveled: 0, lastManualAt: null, lastManualOk: false, seq: 0, events: []};
    this._vfDash = null;
    this._vfDashUntil = 0;
    this._vfDashForce = false;
    this._dashAttack = '';
    this._jump = {
      power: false, convertUntil: 0, lastMoveAt: 0, lastIx: 0, lastIz: 0,
      dirX: 0, dirZ: 0, lockVx: 0, lockVz: 0, landRecover: 0, compress: 0,
      prepLand: false, seq: 0, events: [], dashT: 0
    };
    this._vfJump = null;
    this._vfJumpUntil = 0;
    this.maxHp = VF.PLAYER_HP || 1000;
    this.hp = this.maxHp;
    this.alive = true;
    this.invuln = 0;
    this.respawnT = 0;
    this.bar = null;
    this._deathEvent = false;
  }

  NexCharacterController.prototype.attach = async function(scene, def){
    const THREE = root.THREE;
    this.def = def || (VF.PlayableRoster && VF.PlayableRoster.get('nex')) || null;
    this.manifest = (this.def && this.def.getManifest && this.def.getManifest()) || VF.NexManifest;
    this.pivot = new THREE.Group();
    this.pivot.name = (this.def && this.def.id === 'lyravyn') ? 'LyraPlayer' : 'NexPlayer';
    scene.add(this.pivot);
    const body = await VF.NexAssets.loadBody(this.manifest);
    this.model = body.scene;
    this.height = VF.NexAssets.groundAlign(this.model) || 1.8;
    this.model.traverse(function(n){
      if(n.isMesh){
        n.castShadow = false;
        n.receiveShadow = false;
        n.frustumCulled = true;
      }
    });
    this.pivot.add(this.model);
    this.anim = new VF.NexAnimationController(this.model, this.manifest);
    const bodySpec = this.manifest.spec(this.manifest.bodyState);
    const bodyClip = VF.NexAssets.clipByName(body, bodySpec.clip);
    this.anim.addClip(this.manifest.bodyState, bodyClip);
    if(this.manifest.bodyState === 'run'){
      if(!this.anim.has('walk')) this.anim.addClip('walk', bodyClip);
      this.anim.addClip('sprint', bodyClip);
      this.anim.addClip('dash', bodyClip);
    }
    const idleName = (this.def && this.def.idleClip) || (this.manifest.spec('idle') && this.manifest.spec('idle').clip);
    const idleClip = VF.NexAssets.clipByName(body, idleName) || bodyClip;
    if(idleClip) this.anim.addClip('idle', idleClip);
    this.bar = null;
    this.ready = true;
    return this;
  };

  NexCharacterController.prototype.ingestClip = async function(state){
    if(!this.anim || this.anim.has(state)) return this.anim && this.anim.has(state);
    const man = this.manifest || VF.NexManifest;
    const packed = await VF.NexAssets.loadState(state, man);
    if(!packed || !packed.clip) return false;
    this.anim.addClip(state, packed.clip);
    if(state === 'run'){
      if(!this.anim.has('sprint')) this.anim.addClip('sprint', packed.clip);
      if(!this.anim.has('dash')) this.anim.addClip('dash', packed.clip);
    }
    const keepUrl = VF.asset(man.spec(man.bodyState).url);
    if(packed.rec.url !== keepUrl){
      VF.NexAssets.disposeScene(packed.rec.scene);
      packed.rec.scene = null;
      packed.rec.gltf = null;
    }
    return true;
  };

  NexCharacterController.prototype.setPose = function(x, y, z, yaw){
    this.x = x; this.y = y; this.z = z;
    if(yaw != null) this.yaw = yaw;
    this._sync();
  };

  NexCharacterController.prototype._sync = function(){
    if(!this.pivot) return;
    this.pivot.position.set(this.x, this.y, this.z);
    this.pivot.rotation.y = this.yaw;
    const T = VF.PowerJumpTune;
    const rec = this._jump && this._jump.compress || 0;
    const max = T && T.POWER_JUMP_RECOVERY || 0.32;
    const k = max > 0 ? VF.clamp(rec / max, 0, 1) : 0;
    const dip = T && T.LAND_COMPRESS || 0.18;
    if(this.pivot.scale) this.pivot.scale.set(1 + dip * k * 0.22, 1 - dip * k, 1 + dip * k * 0.22);
  };

  NexCharacterController.prototype.takeHit = function(amount, blocked, info){
    info = info || {};
    if(!this.alive) return 0;
    if(!info.bypassInvuln && this.isDashing && this.isDashing()) return 0;
    const head = !!(info.headshot || info.zone === 'head');
    if(!head && !info.bypassInvuln && this.invuln > 0) return 0;
    let dmg = Math.max(0, amount || 0);
    if(head) dmg = this.maxHp || VF.PLAYER_HP || 1000;
    else if(blocked || this.blocking){
      const fromPlayer = info.from === 'player' || info.from === 'gun';
      dmg *= fromPlayer ? (VF.BLOCK_PVP || 0.38) : (VF.BLOCK_PVE || 0.22);
    }
    if(dmg < 0.5) return 0;
    this.hp = Math.max(0, this.hp - dmg);
    this.invuln = head ? 0.2 : 0.5;
    if(this.bar) this.bar.set(this.hp, this.maxHp);
    if(this.hp <= 0){
      this.alive = false;
      this.respawnT = Infinity;
      this.vx = 0; this.vz = 0;
      this._deathEvent = true;
    }
    return dmg;
  };

  NexCharacterController.prototype.heal = function(amount){
    if(!this.alive) return 0;
    const max = this.maxHp || VF.PLAYER_HP || 1000;
    const before = this.hp || 0;
    this.hp = Math.min(max, before + Math.max(0, amount || 0));
    if(this.bar) this.bar.set(this.hp, max);
    return this.hp - before;
  };

  NexCharacterController.prototype.consumeDeath = function(){
    if(!this._deathEvent) return false;
    this._deathEvent = false;
    return true;
  };

  NexCharacterController.prototype.resetForRound = function(pos){
    pos = pos || {};
    this.hp = this.maxHp || VF.PLAYER_HP || 1000;
    this.alive = true;
    this.invuln = 1.2;
    this.respawnT = 0;
    this._deathEvent = false;
    this.vx = 0; this.vy = 0; this.vz = 0;
    this.speed = 0;
    this.blocking = false;
    this.grounded = true;
    this._driveT = 0;
    this._dash.active = false;
    this._dash.leftT = 0;
    this._dash.speed = 0;
    this._dash.ghostT = 0;
    this._dash.blocked = false;
    this._dash.traveled = 0;
    this._dash.lastManualAt = null;
    this._dash.lastManualOk = false;
    this._dash.pendingAttack = null;
    this._dash.coolUntil = 0;
    this._dash.overdrive = false;
    this._dash.events = [];
    this._dashAttack = '';
    this._vfDash = null;
    this._vfJump = null;
    this._vfDrop = null;
    this._jump.power = false;
    this._jump.convertUntil = 0;
    this._jump.lastMoveAt = 0;
    this._jump.lastIx = 0;
    this._jump.lastIz = 0;
    this._jump.dirX = 0;
    this._jump.dirZ = 0;
    this._jump.lockVx = 0;
    this._jump.lockVz = 0;
    this._jump.landRecover = 0;
    this._jump.compress = 0;
    this._jump.prepLand = false;
    this._jump.dashT = 0;
    this._jump.events = [];
    this.setPose(Number(pos.x) || 0, Number(pos.y) || 0, Number(pos.z) || 0, Number(pos.yaw) || 0);
    if(this.anim) this.anim.play('idle', {loop: true, force: true});
    if(this.bar){
      this.bar.set(this.hp, this.maxHp);
      if(this.bar.group) this.bar.group.visible = true;
    }
    return this;
  };

  NexCharacterController.prototype.tickVitals = function(dt, arena, camera){
    this.invuln = Math.max(0, this.invuln - dt);
    if(this.bar){
      this.bar.set(this.hp, this.maxHp);
      this.bar.billboard(camera);
      if(this.bar.group) this.bar.group.visible = this.hp > 0;
    }
  };

  NexCharacterController.prototype.tick = function(dt, input, camera, arena){
    if(!this.ready) return;
    if(!this.alive){
      if(this.anim) this.anim.tick(dt);
      this._sync();
      return;
    }
    if(this._dash.active){
      this._tickDash(dt, arena);
      this.anim.tick(dt);
      this._sync();
      return;
    }
    const now = VF.now();
    this._rememberMove(input, now);
    this._tickJumpRecover(dt, now);
    const ix = input.moveX || 0;
    const iz = input.moveZ || 0;
    const len = Math.hypot(ix, iz);
    const camYaw = camera ? camera.yaw : this.yaw;
    const powerAir = !!(this._jump.power && !this.grounded);
    const jumpDash = this._jump.dashT > 0 && !this.grounded;
    if(jumpDash){
      this._steerJumpDash(dt);
    }else if(powerAir){
      this._steerPowerJump(dt, input, camera);
    }else{
      let wishX = 0, wishZ = 0;
      if(len > 0.08){
        const nx = ix / len, nz = iz / len;
        const wish = cameraWish(camYaw, nx, nz);
        wishX = wish.x; wishZ = wish.z;
        this.yaw = Math.atan2(wishX, wishZ);
      }
      const recoverSlow = this._jump.landRecover > 0 ? 0.55 : 1;
      const target = (input.sprint ? this.sprintSpeed : (len > 0.72 ? this.runSpeed : this.walkSpeed)) * recoverSlow;
      const moving = len > 0.08 && !this.blocking;
      const busy = this.anim && this.anim.isBusy();
      const accel = moving ? 38 : 22;
      if(this._driveT > 0) this._driveT = Math.max(0, this._driveT - dt);
      if(moving){
        this.vx = VF.lerp(this.vx, wishX * target, VF.clamp(dt * accel, 0, 1));
        this.vz = VF.lerp(this.vz, wishZ * target, VF.clamp(dt * accel, 0, 1));
      }else if(this._driveT > 0 || busy){
        const damp = Math.exp(-dt * 2.2);
        this.vx *= damp; this.vz *= damp;
      }else{
        const damp = Math.exp(-dt * 10);
        this.vx *= damp; this.vz *= damp;
        if(Math.abs(this.vx) < 0.05) this.vx = 0;
        if(Math.abs(this.vz) < 0.05) this.vz = 0;
      }
      const cap = (VF.CombatTune && VF.CombatTune.PLAYER_DRIVE_CAP) || 16;
      const spd = Math.hypot(this.vx, this.vz);
      if(spd > cap){ this.vx *= cap / spd; this.vz *= cap / spd; }
    }
    this._tryJump(input, camera, now);
    this._tryConvertJumpDash(input, camera, now);
    this._tryConvertPowerJump(input, camera, now);
    this._moveHorizontal(dt, arena);
    const wasGrounded = this.grounded;
    const prevVy = this.vy;
    this.vy -= this.gravity * dt;
    this.y += this.vy * dt;
    const floor = (arena && arena.surfaceY) ? arena.surfaceY(this.x, this.z) : 0;
    if(this.y <= floor){
      if(!wasGrounded && this._jump.power) this._powerJumpLand(prevVy, floor, now);
      else if(!wasGrounded && prevVy < -2) this.anim.play('land') || this.anim.play('idle');
      this.y = floor; this.vy = 0; this.grounded = true;
      this._jump.power = false;
      this._jump.prepLand = false;
      this._jump.dashT = 0;
    }else{
      this.grounded = false;
      this._preparePowerJumpLand(floor);
    }
    this.speed = Math.hypot(this.vx, this.vz);
    this.blocking = !!input.block;
    this._chooseLoco(input);
    this.anim.tick(dt);
    this._sync();
  };

  NexCharacterController.prototype._rememberMove = function(input, now){
    const ix = input && input.moveX || 0;
    const iz = input && input.moveZ || 0;
    const T = VF.PowerJumpTune;
    const thresh = T && T.POWER_JUMP_MOVE_THRESHOLD || 0.08;
    if(Math.hypot(ix, iz) > thresh){
      this._jump.lastMoveAt = now;
      this._jump.lastIx = ix;
      this._jump.lastIz = iz;
    }
  };

  NexCharacterController.prototype._tickJumpRecover = function(dt, now){
    if(this._jump.landRecover > 0) this._jump.landRecover = Math.max(0, this._jump.landRecover - dt);
    if(this._jump.compress > 0) this._jump.compress = Math.max(0, this._jump.compress - dt);
    if(this._vfJump && this._vfJumpUntil && now > this._vfJumpUntil) this._vfJump = null;
    if(this._vfDash && this._vfDashUntil && now > this._vfDashUntil) this._vfDash = null;
  };

  NexCharacterController.prototype._steerJumpDash = function(dt){
    const D = VF.DashTune || {};
    const speed = VF._t.dashSpeed ? VF._t.dashSpeed() : ((D.dashDistance || 4.6) / Math.max(0.08, D.dashDuration || 0.16));
    const was = this._jump.dashT || 0;
    this._jump.dashT = Math.max(0, was - dt);
    const dirX = this._jump.dirX, dirZ = this._jump.dirZ;
    if(this._jump.dashT > 0){
      this.vx = dirX * speed;
      this.vz = dirZ * speed;
      return;
    }
    const keep = this.runSpeed || 8.6;
    this.vx = dirX * keep;
    this.vz = dirZ * keep;
  };

  NexCharacterController.prototype._applyJumpDash = function(dir){
    const D = VF.DashTune || {};
    if(D.jumpDash === false || !dir) return false;
    const speed = VF._t.dashSpeed ? VF._t.dashSpeed() : ((D.dashDistance || 4.6) / Math.max(0.08, D.dashDuration || 0.16));
    this._jump.dashT = D.dashDuration || 0.16;
    this._jump.convertUntil = 0;
    this._jump.dirX = dir.x;
    this._jump.dirZ = dir.z;
    this._jump.lockVx = dir.x * speed;
    this._jump.lockVz = dir.z * speed;
    this.vx = this._jump.lockVx;
    this.vz = this._jump.lockVz;
    this.yaw = Math.atan2(dir.x, dir.z);
    if(this.trails && this.trails.start) this.trails.start('drive', D.dashTrailDuration || 0.22);
    return true;
  };

  NexCharacterController.prototype._steerPowerJump = function(dt, input, camera){
    const T = VF.PowerJumpTune || {};
    const air = T.POWER_JUMP_AIR_CONTROL != null ? T.POWER_JUMP_AIR_CONTROL : 0.15;
    const speed = T.POWER_JUMP_HORIZONTAL_SPEED || 18;
    const dir = VF._t.powerJumpDir ? VF._t.powerJumpDir(input, camera, this._jump, VF.now()) : null;
    const sx = dir ? dir.x * speed * air : 0;
    const sz = dir ? dir.z * speed * air : 0;
    this.vx = this._jump.lockVx * (1 - air) + sx;
    this.vz = this._jump.lockVz * (1 - air) + sz;
  };

  NexCharacterController.prototype._tryJump = function(input, camera, now){
    if(!input || !input.jump || !this.grounded || this.blocking) return;
    if(this._jump.landRecover > 0) return;
    const T = VF.PowerJumpTune || {};
    const dir = VF._t.powerJumpDir ? VF._t.powerJumpDir(input, camera, this._jump, now) : null;
    if(T.ENABLED){
      if(dir) this._beginPowerJump(dir, now, false);
      else this._beginNormalJump(now);
      return;
    }
    this._beginNormalJump(now);
    if(dir) this._applyJumpDash(dir);
  };

  NexCharacterController.prototype._tryConvertJumpDash = function(input, camera, now){
    const D = VF.DashTune || {};
    if((VF.PowerJumpTune && VF.PowerJumpTune.ENABLED) || D.jumpDash === false) return;
    if(this._jump.dashT > 0 || this.grounded || this._jump.power) return;
    if(!this._jump.convertUntil || now > this._jump.convertUntil) return;
    const dir = VF._t.powerJumpDir ? VF._t.powerJumpDir(input, camera, this._jump, now) : null;
    if(dir) this._applyJumpDash(dir);
  };

  NexCharacterController.prototype._tryConvertPowerJump = function(input, camera, now){
    const T = VF.PowerJumpTune || {};
    if(!T.ENABLED) return;
    if(this._jump.power || this.grounded) return;
    if(!this._jump.convertUntil || now > this._jump.convertUntil) return;
    const dir = VF._t.powerJumpDir ? VF._t.powerJumpDir(input, camera, this._jump, now) : null;
    if(dir) this._beginPowerJump(dir, now, true);
  };

  NexCharacterController.prototype._beginNormalJump = function(now){
    const T = VF.PowerJumpTune;
    this.vy = this.jumpSpeed;
    this.grounded = false;
    this._jump.power = false;
    this._jump.prepLand = false;
    this._jump.convertUntil = now + ((T && T.POWER_JUMP_INPUT_WINDOW) || 150);
    this.mode = 'jump';
    this.anim.play('jump', {force: true}) || this.anim.play('vault', {force: true});
  };

  NexCharacterController.prototype._beginPowerJump = function(dir, now, converted){
    const T = VF.PowerJumpTune || {};
    const speed = T.POWER_JUMP_HORIZONTAL_SPEED || 18;
    const lift = T.POWER_JUMP_VERTICAL_SPEED || 11;
    const dirX = dir.x, dirZ = dir.z;
    this._jump.power = true;
    this._jump.convertUntil = 0;
    this._jump.prepLand = false;
    this._jump.dirX = dirX;
    this._jump.dirZ = dirZ;
    this._jump.lockVx = dirX * speed;
    this._jump.lockVz = dirZ * speed;
    this.vx = this._jump.lockVx;
    this.vz = this._jump.lockVz;
    this.vy = converted ? Math.max(this.vy, lift) : lift;
    this.grounded = false;
    this.yaw = Math.atan2(dirX, dirZ);
    this.mode = 'powerJumpLaunch';
    this._jump.seq = (this._jump.seq % 99) + 1;
    this._vfJump = {seq: this._jump.seq, phase: 'launch'};
    this._vfJumpUntil = now + ((T.NET_HOLD || 0.55) * 1000);
    this._jump.events.push({
      type: 'launch', seq: this._jump.seq, x: this.x, y: this.y, z: this.z,
      dirX: dirX, dirZ: dirZ, strength: 0
    });
    this.anim.play('jump', {force: true}) || this.anim.play('vault', {force: true});
  };

  NexCharacterController.prototype._moveHorizontal = function(dt, arena){
    const powerAir = !!(this._jump.power && !this.grounded) || (this._jump.dashT > 0 && !this.grounded);
    const T = VF.PowerJumpTune;
    if(powerAir){
      const step = (T && T.POWER_JUMP_SUBSTEP) || 0.3;
      const move = Math.hypot(this.vx * dt, this.vz * dt);
      const n = Math.max(1, Math.ceil(move / step));
      for(let i = 0; i < n; i++){
        const nx = this.x + this.vx * dt / n;
        const nz = this.z + this.vz * dt / n;
        const hit = arena && arena.collide ? arena.collide(nx, this.y, nz, this.radius) : {x: nx, z: nz};
        if(Math.hypot(hit.x - nx, hit.z - nz) > 0.14){
          this.x = hit.x; this.z = hit.z;
          const into = (this.vx * (nx - hit.x) + this.vz * (nz - hit.z));
          if(into > 0){
            this.vx *= 0.2; this.vz *= 0.2;
            this._jump.lockVx = this.vx;
            this._jump.lockVz = this.vz;
          }
          break;
        }
        this.x = hit.x; this.z = hit.z;
      }
      return;
    }
    const nx = this.x + this.vx * dt;
    const nz = this.z + this.vz * dt;
    const hit = arena && arena.collide ? arena.collide(nx, this.y, nz, this.radius) : {x: nx, y: this.y, z: nz, grounded: this.y <= 0.05};
    this.x = hit.x; this.z = hit.z;
  };

  NexCharacterController.prototype._preparePowerJumpLand = function(floor){
    if(!this._jump.power || this._jump.prepLand) return;
    if(this.vy >= -0.4) return;
    if(this.y - floor > 1.8) return;
    this._jump.prepLand = true;
    this.mode = 'powerJumpAir';
    this.anim.play('land') || this.anim.play('vault') || this.anim.play('jump');
  };

  NexCharacterController.prototype._powerJumpLand = function(prevVy, floor, now){
    const T = VF.PowerJumpTune || {};
    const strength = VF._t.powerJumpStrength ? VF._t.powerJumpStrength(prevVy) : VF.clamp(Math.abs(prevVy || 0) / 12, 0, 1);
    this.mode = 'powerJumpLand';
    this._jump.landRecover = T.POWER_JUMP_RECOVERY || 0.32;
    this._jump.compress = T.POWER_JUMP_RECOVERY || 0.32;
    this._vfJump = {seq: this._jump.seq, phase: 'impact'};
    this._vfJumpUntil = now + ((T.NET_HOLD || 0.55) * 1000);
    this._jump.events.push({
      type: 'impact', seq: this._jump.seq, x: this.x, y: floor, z: this.z,
      dirX: this._jump.dirX, dirZ: this._jump.dirZ, strength: strength
    });
    if(this.anim){
      this.anim.play('land', {force: true}) || this.anim.play('vault', {force: true}) || this.anim.play('idle');
      this.anim.busyUntil = now + Math.min(0.22, this._jump.landRecover) * 1000;
    }
    this.vx *= 0.35; this.vz *= 0.35;
  };

  NexCharacterController.prototype.consumePowerJumpEvents = function(){
    const ev = this._jump.events;
    this._jump.events = [];
    return ev;
  };

  NexCharacterController.prototype.isPowerJumping = function(){
    return !!(this._jump && (this._jump.power || this._jump.landRecover > 0));
  };

  NexCharacterController.prototype.isDashing = function(){
    return !!(this._dash && this._dash.active);
  };

  NexCharacterController.prototype.isOverdriveDash = function(){
    return !!(this._dash && this._dash.active && this._dash.overdrive);
  };

  NexCharacterController.prototype.dashState = function(){
    if(this._dash && this._dash.active) return this._dash.overdrive ? 'OVERDRIVE_DASH' : 'NORMAL_DASH';
    if(this.mode === 'dashRecovery') return 'RECOVERY';
    return 'IDLE';
  };

  NexCharacterController.prototype.consumeOverdriveEvents = function(){
    const ev = this._dash.events;
    this._dash.events = [];
    return ev;
  };

  NexCharacterController.prototype._dashDir = function(input, camera){
    const camYaw = camera ? camera.yaw : this.yaw;
    const ix = input && input.moveX || 0;
    const iz = input && input.moveZ || 0;
    if(Math.hypot(ix, iz) > 0.08){
      const wish = cameraWish(camYaw, ix, iz);
      const len = Math.hypot(wish.x, wish.z) || 1;
      return {x: wish.x / len, z: wish.z / len};
    }
    const f = this.forward();
    return {x: f.x, z: f.z};
  };

  NexCharacterController.prototype._canOverdrive = function(now){
    if(this._dash && this._dash.overdrive && this._dash.active) return false;
    if(!this._dash.lastManualOk || this._dash.lastManualAt == null) return false;
    return !!(VF._t.overdriveWindowOpen && VF._t.overdriveWindowOpen(this._dash.lastManualAt, now));
  };

  NexCharacterController.prototype.dashCooldownFrac = function(now){
    const t = now != null ? now : VF.now();
    const left = (this._dash.coolUntil || 0) - t;
    if(left <= 0) return 1;
    return VF.clamp(1 - left / (VF.DashTune.dashCooldown * 1000), 0, 1);
  };

  NexCharacterController.prototype.tryManualDash = function(input, camera, arena, fx, camRig, now){
    if(!this.ready || !this.alive || this.blocking) return false;
    if(this.isPowerJumping && this.isPowerJumping()) return false;
    const t = now != null ? now : VF.now();
    if(this._canOverdrive(t)){
      if(!this._dash.active && this.anim && this.anim.isBusy(t)) return false;
      const dir = this._dashDir(input, camera);
      return this._beginOverdrive({
        dirX: dir.x, dirZ: dir.z, fx: fx, camera: camRig, arena: arena, now: t
      });
    }
    if(this._dash.active) return false;
    if(t < (this._dash.coolUntil || 0)) return false;
    if(this.anim && this.anim.isBusy(t)) return false;
    const D = VF.DashTune;
    const dir = this._dashDir(input, camera);
    if(!VF._t.dashPathClear(arena, this.x, this.y, this.z, dir.x, dir.z, Math.min(1.2, D.dashDistance * 0.35), this.radius)) return false;
    const ok = this.beginDash({
      kind: 'manual',
      dirX: dir.x,
      dirZ: dir.z,
      distance: D.dashDistance,
      duration: D.dashDuration,
      cooldown: D.dashCooldown,
      fx: fx,
      camera: camRig,
      arena: arena,
      now: t
    });
    if(ok){
      this._dash.lastManualAt = t;
      this._dash.lastManualOk = true;
    }
    return ok;
  };

  NexCharacterController.prototype._beginOverdrive = function(opts){
    opts = opts || {};
    if(!this.ready) return false;
    if(this._dash.active && this._dash.overdrive) return false;
    const D = VF.DashTune;
    const T = VF.OverdriveDashTune || {};
    const dirLen = Math.hypot(opts.dirX || 0, opts.dirZ || 0) || 1;
    const dirX = (opts.dirX || 0) / dirLen;
    const dirZ = (opts.dirZ || 0) / dirLen;
    const dist = VF._t.overdriveDistance ? VF._t.overdriveDistance() : D.dashDistance * 5;
    const dur = VF._t.overdriveDuration ? VF._t.overdriveDuration() : D.dashDuration;
    const speed = VF._t.overdriveSpeed ? VF._t.overdriveSpeed() : (dist / dur);
    const now = opts.now != null ? opts.now : VF.now();
    this.yaw = Math.atan2(dirX, dirZ);
    this._dash.active = true;
    this._dash.overdrive = true;
    this._dash.kind = 'overdrive';
    this._dash.leftT = dur;
    this._dash.dirX = dirX;
    this._dash.dirZ = dirZ;
    this._dash.speed = speed;
    this._dash.pendingAttack = null;
    this._dash.blocked = false;
    this._dash.ghostT = 0;
    this._dash.traveled = 0;
    this._dash.fx = opts.fx || this._dash.fx || null;
    this._dash.cam = opts.camera || this._dash.cam || null;
    this._dash.arena = opts.arena || this._dash.arena || null;
    this._dash.coolUntil = now + D.dashCooldown * 1000;
    this._dash.lastManualAt = null;
    this._dash.lastManualOk = false;
    this._dash.seq = (this._dash.seq % 99) + 1;
    this.mode = 'overdriveDash';
    this.vx = dirX * speed;
    this.vz = dirZ * speed;
    this.playAction('dash') || (this.anim && (this.anim.play('sprint', {force: true, timeScale: 2.2}) || this.anim.play('run', {force: true, timeScale: 2.0})));
    if(this.anim) this.anim.busyUntil = now + dur * 1000;
    if(this.overdriveTrail && this.overdriveTrail.start) this.overdriveTrail.start(this.x, this.y, this.z);
    if(this._dash.cam && this._dash.cam.impulse) this._dash.cam.impulse(T.OVERDRIVE_SHAKE || 0.28, T.OVERDRIVE_FOV_BONUS || 6);
    if(VF.audio && VF.audio.overdriveStart) VF.audio.overdriveStart();
    this._vfDash = {seq: this._dash.seq, phase: 'start'};
    this._vfDashUntil = now + ((T.NET_HOLD || 0.55) * 1000);
    this._vfDashForce = true;
    this._dash.events.push({type: 'start', seq: this._dash.seq, x: this.x, y: this.y, z: this.z, dirX: dirX, dirZ: dirZ});
    this._sync();
    return true;
  };

  NexCharacterController.prototype.beginDash = function(opts){
    opts = opts || {};
    if(!this.ready || this._dash.active) return false;
    if(this.isPowerJumping && this.isPowerJumping()) return false;
    if(opts.overdrive) return this._beginOverdrive(opts);
    const D = VF.DashTune;
    const cap = opts.maxDistance != null ? opts.maxDistance : D.dashDistance;
    const dist = VF.clamp(opts.distance != null ? opts.distance : D.dashDistance, 1.2, cap);
    const dur = Math.max(0.1, opts.duration != null ? opts.duration : D.dashDuration);
    const dirLen = Math.hypot(opts.dirX || 0, opts.dirZ || 0) || 1;
    const dirX = (opts.dirX || 0) / dirLen;
    const dirZ = (opts.dirZ || 0) / dirLen;
    this.yaw = Math.atan2(dirX, dirZ);
    this._dash.active = true;
    this._dash.overdrive = false;
    this._dash.kind = opts.kind || 'manual';
    this._dash.leftT = dur;
    this._dash.dirX = dirX;
    this._dash.dirZ = dirZ;
    this._dash.speed = dist / dur;
    this._dash.pendingAttack = opts.pendingAttack || null;
    this._dash.blocked = false;
    this._dash.ghostT = 0;
    this._dash.traveled = 0;
    this._dash.fx = opts.fx || null;
    this._dash.cam = opts.camera || null;
    this._dash.arena = opts.arena || null;
    const now = opts.now != null ? opts.now : VF.now();
    const cd = opts.cooldown != null ? opts.cooldown : D.dashCooldown;
    this._dash.coolUntil = now + cd * 1000;
    this.mode = this._dash.kind === 'approach' ? 'dashAttackApproach' : 'dash';
    this.vx = dirX * this._dash.speed;
    this.vz = dirZ * this._dash.speed;
    this.playAction('dash') || this.anim.play('sprint', {force: true, timeScale: 1.9}) || this.anim.play('run', {force: true, timeScale: 1.7});
    if(this.anim) this.anim.busyUntil = now + dur * 1000;
    if(this.trails && this.trails.start) this.trails.start('drive', D.dashTrailDuration);
    if(this._dash.fx && this._dash.fx.dashStart) this._dash.fx.dashStart(this.x, this.y, this.z, dirX, dirZ, D.dashStartBurstStrength);
    if(this._dash.cam && this._dash.cam.impulse) this._dash.cam.impulse(D.dashShake, D.dashFovBoost);
    if(VF.audio && VF.audio.dashWhoosh) VF.audio.dashWhoosh();
    this._sync();
    return true;
  };

  NexCharacterController.prototype._tickDash = function(dt, arena){
    const D = this._dash;
    const world = arena || D.arena;
    const T = VF.OverdriveDashTune || {};
    const step = Math.min(dt, D.leftT);
    const move = D.speed * step;
    const subSize = D.overdrive ? (T.OVERDRIVE_SUBSTEP || 0.18) : 0.3;
    const sub = Math.max(1, Math.ceil(move / subSize));
    const ox = this.x, oz = this.z;
    for(let i = 0; i < sub; i++){
      const s = move / sub;
      const nx = this.x + D.dirX * s;
      const nz = this.z + D.dirZ * s;
      const hit = world && world.collide ? world.collide(nx, this.y, nz, this.radius) : {x: nx, z: nz};
      if(Math.hypot(hit.x - nx, hit.z - nz) > 0.14){
        this.x = hit.x; this.z = hit.z;
        D.blocked = true;
        break;
      }
      this.x = hit.x; this.z = hit.z;
    }
    D.traveled = (D.traveled || 0) + Math.hypot(this.x - ox, this.z - oz);
    const floor = world && world.surfaceY ? world.surfaceY(this.x, this.z) : this.y;
    this.y = floor;
    this.grounded = true;
    D.leftT -= step;
    D.ghostT += dt;
    if(D.overdrive){
      if(this.overdriveTrail && this.overdriveTrail.sample) this.overdriveTrail.sample(this.x, this.y, this.z);
    }else if(D.fx && D.fx.dashGhost && D.ghostT >= 0.028){
      D.ghostT = 0;
      D.fx.dashGhost(this.x, this.y, this.z, this.yaw);
    }
    this.speed = D.speed;
    this.vx = D.dirX * D.speed;
    this.vz = D.dirZ * D.speed;
    if(D.leftT <= 0 || D.blocked) this._finishDash();
  };

  NexCharacterController.prototype._finishDash = function(){
    const D = this._dash;
    const pending = D.pendingAttack;
    const over = !!D.overdrive;
    if(over){
      if(this.overdriveTrail && this.overdriveTrail.end) this.overdriveTrail.end(this.x, this.y, this.z);
      if(VF.audio && VF.audio.overdriveEnd) VF.audio.overdriveEnd();
      this._vfDash = {seq: D.seq, phase: 'end'};
      this._vfDashUntil = VF.now() + (((VF.OverdriveDashTune && VF.OverdriveDashTune.NET_HOLD) || 0.55) * 1000);
      this._vfDashForce = true;
      D.events.push({type: 'end', seq: D.seq, x: this.x, y: this.y, z: this.z, dirX: D.dirX, dirZ: D.dirZ, traveled: D.traveled || 0});
    }else{
      if(D.fx && D.fx.dashEnd) D.fx.dashEnd(this.x, this.y, this.z, D.dirX, D.dirZ, VF.DashTune.dashArrivalBurstStrength);
      if(D.cam && D.cam.impulse) D.cam.impulse(0.1, 3);
      if(VF.audio && VF.audio.dashArrive) VF.audio.dashArrive();
    }
    D.active = false;
    D.overdrive = false;
    D.pendingAttack = null;
    D.fx = null; D.cam = null; D.arena = null;
    this.vx *= 0.12; this.vz *= 0.12;
    this._driveT = 0.08;
    this.mode = pending ? pending : 'dashRecovery';
    if(this.anim) this.anim.busyUntil = 0;
    if(pending) this._dashAttack = pending;
  };

  NexCharacterController.prototype.consumeDashAttack = function(){
    const kind = this._dashAttack;
    this._dashAttack = '';
    return kind || '';
  };

  NexCharacterController.prototype._chooseLoco = function(input){
    if(this.anim.isBusy()) return;
    if(this._dash && this._dash.active) return;
    if(this._jump && this._jump.landRecover > 0){
      this.mode = 'powerJumpLand';
      return;
    }
    if(this._jump && this._jump.power && !this.grounded){
      this.mode = this.vy >= 0 ? 'powerJumpLaunch' : 'powerJumpAir';
      return;
    }
    if(this.blocking && this.anim.has('block')){
      this.mode = 'block';
      this.anim.play('block');
      return;
    }
    if(!this.grounded){
      this.mode = 'jump';
      return;
    }
    if(this.speed < 0.45){
      this.mode = 'idle';
      this.anim.play('idle') || this.anim.play('walk', {timeScale: 0.0001, loop: true});
      return;
    }
    if(input.sprint && this.anim.has('sprint')){
      this.mode = 'sprint';
      this.anim.play('sprint', {timeScale: 1.35});
      return;
    }
    if(this.speed > this.walkSpeed + 0.8 && this.anim.has('run')){
      this.mode = 'run';
      this.anim.play('run');
      return;
    }
    this.mode = 'walk';
    this.anim.play('walk', {timeScale: VF.clamp(this.speed / this.walkSpeed, 0.75, 1.35)});
  };

  NexCharacterController.prototype.playAction = function(state){
    if(!this.anim) return false;
    return this.anim.play(state, {force: true});
  };

  NexCharacterController.prototype.drive = function(amount){
    const n = amount || 0;
    if(!n) return;
    const f = this.forward();
    this.vx += f.x * n;
    this.vz += f.z * n;
    this._driveT = Math.max(this._driveT, 0.22);
  };

  NexCharacterController.prototype.forward = function(){
    return {x: Math.sin(this.yaw), z: Math.cos(this.yaw)};
  };

  VF.cameraWish = cameraWish;
  VF.NexCharacterController = NexCharacterController;
})(typeof window !== 'undefined' ? window : globalThis);
