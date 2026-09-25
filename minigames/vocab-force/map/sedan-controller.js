"use strict";
/* รอบ 1567: รถยนต์ Golden Vanguard Sedan — จับยก-ทุ่มได้ (โดนทุ่มใส่ใคร คนนั้นพลัง -100) */
(function(root){
  const VF = root.VocabForce = root.VocabForce || {};

  function pointBoxDistance(x, z, box){
    if(!box) return Infinity;
    const px = VF.clamp(x, box.minx, box.maxx);
    const pz = VF.clamp(z, box.minz, box.maxz);
    return Math.hypot(x - px, z - pz);
  }

  function cachedAsset(){
    if(VF._sedanAsset) return VF._sedanAsset;
    VF._sedanAsset = new Promise(function(resolve, reject){
      const THREE = root.THREE;
      if(!THREE || !THREE.GLTFLoader){ reject(new Error('GLTFLoader missing')); return; }
      new THREE.GLTFLoader().load(VF.asset('assets/Golden_Vanguard_Sedan.glb'), function(gltf){
        resolve(gltf.scene);
      }, undefined, reject);
    });
    return VF._sedanAsset;
  }

  function SedanController(){
    const spawn = VF.SEDAN_SPAWN || {x: -60, z: 55, yaw: 2.2};
    this.spawn = {x: spawn.x, z: spawn.z, yaw: spawn.yaw || 0};
    this.state = 'loading';
    this.ready = false;
    this.root = null;
    this.model = null;
    this.scene = null;
    this.arena = null;
    this.collider = null;
    this.halfLong = 2.25;
    this.halfShort = 0.95;
    this.vx = 0; this.vy = 0; this.vz = 0;
    this.avx = 0; this.avy = 0; this.avz = 0;
    this.elapsed = 0;
    this.bounces = 0;
    this._hitIds = {};
    this.carrier = null;
  }

  SedanController.prototype.attach = async function(scene, arena){
    const THREE = root.THREE;
    this.scene = scene;
    this.arena = arena;
    const source = await cachedAsset();
    const holder = new THREE.Group();
    holder.name = 'VFSedan';
    const model = source.clone(true);
    holder.add(model);
    scene.add(holder);
    let box = new THREE.Box3().setFromObject(model);
    const size = new THREE.Vector3();
    box.getSize(size);
    const longest = Math.max(size.x, size.z, 0.001);
    const byLength = 4.5 / longest;
    const byHeight = size.y > 0.001 ? 1.5 / size.y : byLength;
    const scale = Math.min(byLength, byHeight * 1.15);
    model.scale.setScalar(scale);
    box = new THREE.Box3().setFromObject(model);
    box.getSize(size);
    model.position.y -= box.min.y;
    this.halfLong = Math.max(size.x, size.z) * 0.5;
    this.halfShort = Math.min(size.x, size.z) * 0.5;
    model.traverse(function(obj){
      if(!obj || !obj.isMesh) return;
      obj.castShadow = false;
      obj.receiveShadow = false;
      obj.frustumCulled = true;
    });
    this.root = holder;
    this.model = model;
    this.ready = true;
    this.reset();
    return this;
  };

  SedanController.prototype._updateCollider = function(){
    if(!this.arena) return;
    if(!this.collider){
      this.collider = {minx: 0, maxx: 0, miny: 0, maxy: 1.6, minz: 0, maxz: 0, platform: false, vault: false, loose: false, broken: false, tanker: false, sedan: true};
      this.arena.boxes.push(this.collider);
    }
    const yaw = this.root ? this.root.rotation.y : this.spawn.yaw;
    const c = Math.abs(Math.cos(yaw)), s = Math.abs(Math.sin(yaw));
    const hx = c * this.halfLong + s * this.halfShort;
    const hz = s * this.halfLong + c * this.halfShort;
    const x = this.root ? this.root.position.x : this.spawn.x;
    const z = this.root ? this.root.position.z : this.spawn.z;
    this.collider.minx = x - hx; this.collider.maxx = x + hx;
    this.collider.minz = z - hz; this.collider.maxz = z + hz;
    this.collider.maxy = 1.7;
    this.collider.broken = this.state !== 'idle';
  };

  SedanController.prototype.spawnAvoidance = function(){
    return {x: this.spawn.x, z: this.spawn.z, radius: 10};
  };

  SedanController.prototype.reset = function(){
    this.state = this.ready ? 'idle' : 'loading';
    this.elapsed = 0;
    this.bounces = 0;
    this.vx = this.vy = this.vz = 0;
    this.avx = this.avy = this.avz = 0;
    this._hitIds = {};
    this.carrier = null;
    if(this.root){
      this.root.visible = true;
      this.root.position.set(this.spawn.x, 0, this.spawn.z);
      this.root.rotation.set(0, this.spawn.yaw, 0);
    }
    this._updateCollider();
  };

  SedanController.prototype.canGrab = function(player){
    if(!this.ready || this.state !== 'idle' || !player || player.alive === false) return false;
    return pointBoxDistance(player.x || 0, player.z || 0, this.collider) <= 3.4;
  };

  SedanController.prototype.grab = function(player){
    if(!this.canGrab(player)) return false;
    this.state = 'carried';
    this.carrier = player;
    this._updateCollider();
    return true;
  };

  SedanController.prototype.drop = function(){
    if(this.state !== 'carried') return;
    this.state = 'idle';
    this.carrier = null;
    if(this.root){
      const floor = this.arena && this.arena.surfaceY ? this.arena.surfaceY(this.root.position.x, this.root.position.z) : 0;
      this.root.position.y = floor;
      this.root.rotation.x = 0;
      this.root.rotation.z = 0;
    }
    this._updateCollider();
  };

  SedanController.prototype.carryTick = function(dt, player){
    if(this.state !== 'carried' || !this.root) return;
    const fwd = player.forward ? player.forward() : {x: 0, z: 1};
    const t = (VF.now ? VF.now() : 0) / 1000;
    const bob = Math.sin(t * 5) * 0.05;
    this.root.position.set(
      (player.x || 0) + fwd.x * (this.halfLong + 0.9),
      (player.y || 0) + 1.05 + bob,
      (player.z || 0) + fwd.z * (this.halfLong + 0.9)
    );
    this.root.rotation.y = Math.atan2(fwd.x, fwd.z);
    this.root.rotation.x = 0.06 + bob * 0.4;
  };

  SedanController.prototype.throwBy = function(player, dirX, dirZ){
    if(this.state !== 'carried') return false;
    const n = Math.hypot(dirX, dirZ) || 1;
    this.state = 'thrown';
    this.carrier = null;
    this.elapsed = 0;
    this.bounces = 0;
    this._hitIds = {};
    const power = 26;
    this.vx = dirX / n * power;
    this.vz = dirZ / n * power;
    this.vy = 9.5;
    this.avx = 2.2;
    this.avy = (Math.random() - 0.5) * 3;
    this.avz = -3.4;
    if(this.root){
      this.root.position.set(
        (player.x || 0) + dirX / n * 1.6,
        (player.y || 0) + 1.5,
        (player.z || 0) + dirZ / n * 1.6
      );
    }
    this._updateCollider();
    return true;
  };

  SedanController.prototype._impact = function(fx, audio, cam, player, x, y, z){
    if(fx && fx.impact) fx.impact(x, y, z, {kind: 'heavyKick', level: 'HEAVY', dir: {x: 0, z: 0}, force: 30});
    if(audio && audio.heavyImpact) audio.heavyImpact();
    if(cam && cam.impulse) cam.impulse(0.5, 4);
  };

  SedanController.prototype.tick = function(dt, ctx){
    if(this.state === 'carried'){
      this.carryTick(dt, ctx && ctx.player);
      return;
    }
    if(this.state !== 'thrown' || !this.root) return;
    this.elapsed += dt;
    ctx = ctx || {};
    const player = ctx.player;
    const grav = 22;
    this.vy -= grav * dt;
    this.root.position.x += this.vx * dt;
    this.root.position.y += this.vy * dt;
    this.root.position.z += this.vz * dt;
    this.root.rotation.x += this.avx * dt;
    this.root.rotation.y += this.avy * dt;
    this.root.rotation.z += this.avz * dt;

    const half = this.arena ? this.arena.half - 3 : 270;
    const p = this.root.position;
    let wallHit = false;
    if(p.x < -half || p.x > half){ p.x = VF.clamp(p.x, -half, half); this.vx *= -0.42; wallHit = true; }
    if(p.z < -half || p.z > half){ p.z = VF.clamp(p.z, -half, half); this.vz *= -0.42; wallHit = true; }
    const floor = this.arena && this.arena.surfaceY ? this.arena.surfaceY(p.x, p.z) : 0;
    let groundHit = false;
    if(p.y <= floor + 0.02 && this.vy < 0){
      p.y = floor;
      groundHit = true;
      this.vy *= -0.38;
      this.vx *= 0.72; this.vz *= 0.72;
      this.avx *= 0.6; this.avy *= 0.6; this.avz *= 0.6;
      this.bounces++;
      this._impact(ctx.fx, ctx.audio, ctx.cam, player, p.x, p.y + 0.6, p.z);
    }

    /* โดนคนปุ๊บหักพลัง -100 แล้วเด้งออก */
    const dmg = VF.SEDAN_DAMAGE || 100;
    const speed = Math.hypot(this.vx, this.vz) + Math.abs(this.vy);
    if(speed > 4){
      const list = ctx.enemies && ctx.enemies.list ? ctx.enemies.list : [];
      for(let i = 0; i < list.length; i++){
        const en = list[i];
        if(!en || en.burstFinisherTriggered || en.state === 'gone') continue;
        if(!en.alive && en.state !== 'dying') continue;
        if(this._hitIds['e' + (en.id || i)]) continue;
        const d = Math.hypot(en.x - p.x, en.z - p.z);
        if(d <= this.halfShort + (en.radius || 0.7) + 0.5 && Math.abs((en.y || 0) + 0.9 - p.y) < 2.2){
          this._hitIds['e' + (en.id || i)] = true;
          en.applyHit({
            damage: dmg,
            force: 30,
            lift: 5.5,
            dir: {x: this.vx, z: this.vz},
            origin: {x: p.x, y: p.y, z: p.z},
            kind: 'vehicle',
            reaction: 'launch',
            level: 'HEAVY'
          });
          this._impact(ctx.fx, ctx.audio, ctx.cam, player, en.x, (en.y || 0) + 1.1, en.z);
          this.vx *= -0.22; this.vz *= -0.22; this.vy = Math.max(this.vy, 5);
        }
      }
      const folks = ctx.people || [];
      const pr = (VF.GunTune && VF.GunTune.PLAYER_R) || 0.62;
      for(let i = 0; i < folks.length; i++){
        const peer = folks[i];
        if(!peer || peer.local || peer.alive === false) continue;
        if(this._hitIds['p' + peer.id]) continue;
        if(Math.hypot((peer.x || 0) - p.x, (peer.z || 0) - p.z) > this.halfShort + pr + 0.5) continue;
        if(Math.abs((peer.y || 0) + 1.0 - p.y) > 2.2) continue;
        this._hitIds['p' + peer.id] = true;
        if(VF._t.notePvpHit) VF._t.notePvpHit(player, {kind: 'kick', zone: 'body', targetId: peer.id, dmg: dmg});
        if(ctx.fx && ctx.fx.impact) ctx.fx.impact(peer.x, (peer.y || 0) + 1.15, peer.z, {kind: 'heavyKick', level: 'HEAVY', dir: {x: this.vx, z: this.vz}, force: 30});
        if(ctx.audio && ctx.audio.heavyImpact) ctx.audio.heavyImpact();
        this.vx *= -0.22; this.vz *= -0.22; this.vy = Math.max(this.vy, 5);
      }
    }

    if(wallHit && Math.abs(this.vy) + Math.hypot(this.vx, this.vz) > 3){
      this._impact(ctx.fx, ctx.audio, ctx.cam, player, p.x, p.y + 0.6, p.z);
      this.bounces++;
    }

    const spd = Math.hypot(this.vx, this.vz);
    if((groundHit && spd < 2.2 && Math.abs(this.vy) < 2.5) || this.bounces >= 3 || this.elapsed > 6){
      this.state = 'idle';
      this.vx = this.vy = this.vz = 0;
      this.avx = this.avy = this.avz = 0;
      p.y = floor;
      this.root.rotation.x *= 0.5;
      this.root.rotation.z *= 0.5;
      this._updateCollider();
    }
  };

  SedanController.prototype.dispose = function(){
    if(this.collider && this.arena && this.arena.boxes){
      const i = this.arena.boxes.indexOf(this.collider);
      if(i >= 0) this.arena.boxes.splice(i, 1);
    }
    if(this.root && this.root.parent) this.root.parent.remove(this.root);
    this.collider = null;
    this.root = null;
    this.ready = false;
  };

  VF.SedanController = SedanController;
})(typeof window !== 'undefined' ? window : globalThis);
