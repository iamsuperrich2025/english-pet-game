"use strict";
/* One round-owned oil tanker: cached GLB, deterministic launch, pooled blast rings. */
(function(root){
  const VF = root.VocabForce = root.VocabForce || {};

  function pointBoxDistance(x, z, box){
    if(!box) return Infinity;
    const px = VF.clamp(x, box.minx, box.maxx);
    const pz = VF.clamp(z, box.minz, box.maxz);
    return Math.hypot(x - px, z - pz);
  }

  function cachedAsset(){
    if(VF._oilTankerAsset) return VF._oilTankerAsset;
    VF._oilTankerAsset = VF.ensureGLTFLoader().then(function(THREE){
      return new Promise(function(resolve, reject){
        new THREE.GLTFLoader().load(VF.asset('assets/oiltank.glb'), function(gltf){
          resolve(gltf.scene);
        }, undefined, reject);
      });
    });
    return VF._oilTankerAsset;
  }

  function points(THREE, count, color, size){
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(new Float32Array(count * 3), 3));
    const mat = new THREE.PointsMaterial({
      color: color, size: size, transparent: true, opacity: 0,
      depthWrite: false, blending: THREE.AdditiveBlending, sizeAttenuation: true
    });
    const mesh = new THREE.Points(geo, mat);
    mesh.visible = false;
    mesh.userData.velocity = [];
    return mesh;
  }

  function OilTankerController(){
    const spawn = VF.TANKER_SPAWN || {x: 84, z: -18, yaw: Math.PI * 0.5};
    this.spawn = {x: spawn.x, z: spawn.z, yaw: spawn.yaw || 0};
    this.state = 'loading';
    this.ready = false;
    this.root = null;
    this.model = null;
    this.scene = null;
    this.arena = null;
    this.collider = null;
    this.halfLong = 6.8;
    this.halfShort = 2.15;
    this.longAxis = 'z';
    this.vx = 0; this.vy = 0; this.vz = 0;
    this.avx = 0; this.avy = 0; this.avz = 0;
    /* รอบ 1577: แคชอ็อบเจกต์สำหรับพลิกหมุนด้วย quaternion (ไม่ alloc ต่อเฟรม) */
    this._tAxis = null; this._tQ = null; this._tQY = null; this._tUp = null; this._tE = null;
    this._flipSpeed = 0; this._yawSpin = 0;
    this.elapsed = 0;
    this.fxAge = 0;
    this.event = null;
    this.eventId = '';
    this.damageEventId = '';
    this._pendingHit = false;
    this._pendingAt = 0;
    this._comboHold = false;
    this.carrier = null;
    this.onHitRequest = null;
    this.onExplosion = null;
    this.fx = null;
  }

  OilTankerController.prototype.attach = async function(scene, arena){
    const THREE = root.THREE;
    this.scene = scene;
    this.arena = arena;
    const source = await cachedAsset();
    const holder = new THREE.Group();
    holder.name = 'VFOilTanker';
    const model = source.clone(true);
    holder.add(model);
    scene.add(holder);
    let box = new THREE.Box3().setFromObject(model);
    const size = new THREE.Vector3();
    box.getSize(size);
    const longest = Math.max(size.x, size.z, 0.001);
    const byLength = 13.6 / longest;
    const byHeight = size.y > 0.001 ? 4.25 / size.y : byLength;
    const scale = Math.min(byLength, byHeight * 1.08);
    model.scale.setScalar(scale);
    box = new THREE.Box3().setFromObject(model);
    box.getSize(size);
    model.position.y -= box.min.y;
    this.longAxis = size.x >= size.z ? 'x' : 'z';
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
    this._buildFx();
    this.ready = true;
    this.reset();
    return this;
  };

  OilTankerController.prototype._buildFx = function(){
    if(this.fx || !this.scene) return;
    const THREE = root.THREE;
    const g = new THREE.Group();
    g.name = 'VFOilBlast';
    const flash = new THREE.Mesh(
      new THREE.SphereGeometry(1, 12, 8),
      new THREE.MeshBasicMaterial({color: 0xffd36a, transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending})
    );
    const shock = new THREE.Mesh(
      new THREE.RingGeometry(0.78, 1, 64),
      new THREE.MeshBasicMaterial({color: 0xffb13b, transparent: true, opacity: 0, side: THREE.DoubleSide, depthWrite: false, blending: THREE.AdditiveBlending})
    );
    shock.rotation.x = -Math.PI * 0.5;
    const fireA = new THREE.Mesh(
      new THREE.TorusGeometry(1, 0.11, 6, 72),
      new THREE.MeshBasicMaterial({color: 0xff5a18, transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending})
    );
    const fireB = new THREE.Mesh(
      new THREE.TorusGeometry(1, 0.045, 5, 72),
      new THREE.MeshBasicMaterial({color: 0xffd36a, transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending})
    );
    fireA.rotation.x = fireB.rotation.x = Math.PI * 0.5;
    const sparks = points(THREE, 32, 0xff7a26, 1.25);
    const smoke = points(THREE, 18, 0x667080, 2.6);
    [flash, shock, fireA, fireB, sparks, smoke].forEach(function(m){ m.visible = false; g.add(m); });
    this.scene.add(g);
    this.fx = {group: g, flash: flash, shock: shock, fireA: fireA, fireB: fireB, sparks: sparks, smoke: smoke};
  };

  OilTankerController.prototype._updateCollider = function(){
    if(!this.arena) return;
    if(!this.collider){
      this.collider = {minx: 0, maxx: 0, miny: 0, maxy: 4.6, minz: 0, maxz: 0, platform: false, vault: false, loose: false, broken: false, tanker: true};
      this.arena.boxes.push(this.collider);
    }
    const yaw = this.root ? this.root.rotation.y : this.spawn.yaw;
    const hx0 = this.longAxis === 'x' ? this.halfLong : this.halfShort;
    const hz0 = this.longAxis === 'z' ? this.halfLong : this.halfShort;
    const hx = Math.abs(Math.cos(yaw)) * hx0 + Math.abs(Math.sin(yaw)) * hz0;
    const hz = Math.abs(Math.sin(yaw)) * hx0 + Math.abs(Math.cos(yaw)) * hz0;
    const x = this.root ? this.root.position.x : this.spawn.x;
    const z = this.root ? this.root.position.z : this.spawn.z;
    this.collider.minx = x - hx; this.collider.maxx = x + hx;
    this.collider.minz = z - hz; this.collider.maxz = z + hz;
    this.collider.maxy = 4.8;
    this.collider.broken = this.state !== 'idle';
  };

  OilTankerController.prototype.spawnAvoidance = function(){
    return {x: this.spawn.x, z: this.spawn.z, radius: 18};
  };

  OilTankerController.prototype.reset = function(){
    this.state = this.ready ? 'idle' : 'loading';
    this.elapsed = 0;
    this.fxAge = 0;
    this.event = null;
    this.eventId = '';
    this.damageEventId = '';
    this._pendingHit = false;
    this._pendingAt = 0;
    this._comboHold = false;
    this.vx = this.vy = this.vz = 0;
    this.avx = this.avy = this.avz = 0;
    this.carrier = null;
    if(this.root){
      this.root.visible = true;
      this.root.position.set(this.spawn.x, 0, this.spawn.z);
      this.root.rotation.set(0, this.spawn.yaw, 0);
      this.root.scale.set(1, 1, 1);
    }
    if(this.fx){
      this.fx.group.visible = false;
      this.fx.group.children.forEach(function(m){
        m.visible = false;
        if(m.material) m.material.opacity = 0;
      });
    }
    this._updateCollider();
  };

  OilTankerController.prototype.canMelee = function(player, reach){
    if(!this.ready || this.state !== 'idle' || !player || player.alive === false) return false;
    if(this._pendingHit && Date.now() - this._pendingAt > 1200) this._pendingHit = false;
    return pointBoxDistance(player.x || 0, player.z || 0, this.collider) <= (reach || 2.4);
  };

  OilTankerController.prototype.canGrab = function(player){
    if(!this.ready || this.state !== 'idle' || !player || player.alive === false) return false;
    return pointBoxDistance(player.x || 0, player.z || 0, this.collider) <= 4.4;
  };

  OilTankerController.prototype.grab = function(player){
    if(!this.canGrab(player)) return false;
    this.state = 'carried';
    this.carrier = player;
    this._updateCollider();
    return true;
  };

  OilTankerController.prototype.carryTick = function(dt, player){
    if(this.state !== 'carried' || !this.root || !player) return;
    const fwd = player.forward ? player.forward() : {x: 0, z: 1};
    const t = (VF.now ? VF.now() : 0) / 1000;
    const bob = Math.sin(t * 5) * 0.08;
    this.root.position.set(
      (player.x || 0) + fwd.x * (this.halfLong + 2.4),
      (player.y || 0) + 2.5 + bob,
      (player.z || 0) + fwd.z * (this.halfLong + 2.4)
    );
    this.root.rotation.set(0.05 + bob * 0.2, Math.atan2(fwd.x, fwd.z), 0);
    this._updateCollider();
  };

  /* รอบ 1567: ทุ่มด้วยมือ — โยนต่อไปทิศที่หันหน้า ปะทะสิ่งใดระเบิดทันที (ดาเมจ 500 ทุกตัวผ่าน onExplosion เดิม) */
  OilTankerController.prototype.throwBy = function(player, dirX, dirZ){
    if(this.state !== 'carried' && this.state !== 'idle') return false;
    const n = Math.hypot(dirX, dirZ) || 1;
    const ev = {
      id: 'grab:' + String(Date.now()) + ':' + ((Math.random() * 1e6) | 0),
      round: 0,
      startAt: Date.now(),
      x: this.root ? this.root.position.x : this.spawn.x,
      z: this.root ? this.root.position.z : this.spawn.z,
      dx: +((dirX / n).toFixed(4)),
      dz: +((dirZ / n).toFixed(4)),
      grab: 1
    };
    this.carrier = null;
    this.state = 'idle';
    return this.applyEvent(ev);
  };

  OilTankerController.prototype.meleeHit = function(origin, reach, info){
    if(!this.ready || this.state !== 'idle') return false;
    if(this._pendingHit && Date.now() - this._pendingAt <= 1200) return false;
    if(pointBoxDistance(origin.x || 0, origin.z || 0, this.collider) > (reach || 2.8) + 1.1) return false;
    this._pendingHit = true;
    this._pendingAt = Date.now();
    /* รอบ 1580: เตะ/ต่อย = พังทันที — สั่ง launch โลคัลเลยตอนนี้ ไม่รอ host ตอบกลับ
       (ออฟไลน์เคยไม่ตอบสนองเลย ออนไลน์รอไป 1-2 วิตาม latency) · คำขอไปยัง host ยังส่งต่อ
       เพื่อให้คนอื่นเห็นด้วย — host จะปฏิเสธอีเวนต์ซ้ำเองเพราะ state เปลี่ยนเป็น launched แล้ว */
    const dx = (info && info.dir && info.dir.x) || 0;
    const dz = (info && info.dir && info.dir.z) || 1;
    const n = Math.hypot(dx, dz) || 1;
    this.applyEvent({
      id: 'melee:' + String(Date.now()) + ':' + ((Math.random() * 1e6) | 0),
      round: 0,
      startAt: Date.now(),
      x: this.root ? this.root.position.x : this.spawn.x,
      z: this.root ? this.root.position.z : this.spawn.z,
      dx: +((dx / n).toFixed(4)),
      dz: +((dz / n).toFixed(4)),
      grab: 0
    });
    if(this.onHitRequest) this.onHitRequest({
      kind: (info && info.kind) || 'punch',
      x: (info && info.player && info.player.x) || origin.x || 0,
      z: (info && info.player && info.player.z) || origin.z || 0,
      dx: dx / n,
      dz: dz / n
    });
    return true;
  };

  OilTankerController.prototype.acceptRequest = function(req, eventId, roundSeed){
    if(!this.ready || !req) return null;
    /* รอบ 1572: ทุ่มจากการแบกอนุญาตตอน state='carried' (เดิม idle เท่านั้น ทำ THROW ออนไลน์ไม่ทำงาน) */
    if(this.state !== 'idle' && !(req.grab && this.state === 'carried')) return null;
    /* รอบ 1567: คำขอทุ่มจากการแบก ผ่อนเช็กระยะ — ฝั่ง host อาจยังเห็นรถอยู่คนละตำแหน่งกับผู้ทุ่ม */
    if(!req.grab && pointBoxDistance(req.x || 0, req.z || 0, this.collider) > 4.4) return null;
    let dx, dz, sx, sz;
    if(req.grab){
      /* รอบ 1567: ทุ่มจากการแบก — เริ่มจากตำแหน่งปัจจุบัน ไปตามทิศที่ผู้เล่นหันหน้า */
      sx = this.root ? this.root.position.x : this.spawn.x;
      sz = this.root ? this.root.position.z : this.spawn.z;
      dx = Number(req.dx) || 0; dz = Number(req.dz) || 1;
      const n = Math.hypot(dx, dz) || 1; dx /= n; dz /= n;
    }else{
      sx = this.spawn.x; sz = this.spawn.z;
      dx = this.spawn.x - (req.x || 0), dz = this.spawn.z - (req.z || 0);
      const len = Math.hypot(dx, dz);
      if(len > 0.1){ dx /= len; dz /= len; }
      else{
        dx = Number(req.dx) || 0; dz = Number(req.dz) || 1;
        const n = Math.hypot(dx, dz) || 1; dx /= n; dz /= n;
      }
    }
    return {
      id: String(eventId || (roundSeed + ':1')),
      round: Number(roundSeed) || 0,
      startAt: Date.now(),
      x: sx, z: sz,
      dx: +dx.toFixed(4), dz: +dz.toFixed(4),
      grab: req.grab ? 1 : 0
    };
  };

  /* รอบ 1584: ค่าปล่อยตัวมาตรฐาน — ใช้ทั้งตอน launch จริงและคำนวณพิกัดตก (เครื่องหมาย + ตอนยก)
     grav ต้องตรงกับค่าใน _stepLaunch (19) เสมอ */
  OilTankerController.prototype.THROW_SPEC = {h: 54, up: 34, grav: 19, y0: 0.35, wallInset: 8};

  OilTankerController.prototype.applyEvent = function(ev){
    if(!ev || !ev.id || ev.id === this.eventId) return false;
    if(this.state !== 'idle' && this.state !== 'carried') return false;
    this.carrier = null;
    this.event = ev;
    this.eventId = String(ev.id);
    this.state = 'launched';
    this.elapsed = 0;
    this._pendingHit = false;
    this._pendingAt = 0;
    if(this.root){
      this.root.position.set(Number(ev.x) || this.spawn.x, 0.35, Number(ev.z) || this.spawn.z);
      this.root.rotation.set(0, this.spawn.yaw, 0);
    }
    const ndx = Number(ev.dx) || 0, ndz = Number(ev.dz) || 1;
    const nn = Math.hypot(ndx, ndz) || 1;
    const dxn = ndx / nn, dzn = ndz / nn;
    /* รอบ 1584: อ่านค่าจากสเปกร่วม ให้ตรงกับตัวชี้พิกัดตกเสมอ */
    const spec = this.THROW_SPEC || {h: 54, up: 34};
    this.vx = dxn * spec.h;
    this.vz = dzn * spec.h;
    this.vy = spec.up;
    /* รอบ 1577: พลิกตามทิศกระเด็น — คว่ำหน้าไปข้างหน้ารอบแกนตั้งฉากกับทิศ ผสมม้วนตามแนวยาวเล็กน้อย
       แทนการหมุน 3 แกนคงที่เดิม (ดูสุ่มไม่เป็นธรรมชาติ) + ลดแรงหมุนช้าๆ เหมือนแรงเสียดอากาศ */
    const THREE = root.THREE;
    if(THREE){
      if(!this._tAxis){
        this._tAxis = new THREE.Vector3();
        this._tQ = new THREE.Quaternion();
        this._tQY = new THREE.Quaternion();
        this._tUp = new THREE.Vector3(0, 1, 0);
      }
      this._tAxis.set(dzn + dxn * 0.24, 0.06, -dxn + dzn * 0.24).normalize();
      this._flipSpeed = 5.2;
      this._yawSpin = 1.1;
    }
    this._updateCollider();
    const lag = VF.clamp((Date.now() - (Number(ev.startAt) || Date.now())) / 1000, 0, 0.8);
    for(let t = 0; t < lag; t += 1 / 60) this._stepLaunch(Math.min(1 / 60, lag - t));
    return true;
  };

  /* รอบ 1587: คอมโบเตะระเบิด — เตะ #1 ปล่อยรถลอยวิถีโค้งสูง (กด THROW×2 แล้ว KICK ขณะแบก)
     ใช้เส้นทาง 'launched' เดิม แต่ _comboHold กันการระเบิดเองตอนถึงพื้น รอเตะ #2 กลางอากาศ
     (comboShatter) เป็นคนสั่งระเบิดแตกละเอียด · fail-safe: tick() elapsed>=4.5 ระเบิดเองเหมือนเดิม */
  OilTankerController.prototype.comboKickLaunch = function(dirX, dirZ, spec){
    if(!this.ready || !this.root) return false;
    if(this.state !== 'carried' && this.state !== 'idle') return false;
    const n = Math.hypot(dirX, dirZ) || 1;
    const dxn = dirX / n, dzn = dirZ / n;
    this._comboHold = true;
    this.eventId = 'combo:' + String(Date.now()) + ':' + ((Math.random() * 1e6) | 0);
    this.event = {id: this.eventId, round: 0, grab: 2};
    this.state = 'launched';
    this.elapsed = 0;
    this.carrier = null;
    this._pendingHit = false;
    this._pendingAt = 0;
    const sp = spec || {h: 40, up: 26};
    this.vx = dxn * sp.h;
    this.vz = dzn * sp.h;
    this.vy = sp.up;
    const THREE = root.THREE;
    if(THREE){
      if(!this._tAxis){
        this._tAxis = new THREE.Vector3();
        this._tQ = new THREE.Quaternion();
        this._tQY = new THREE.Quaternion();
        this._tUp = new THREE.Vector3(0, 1, 0);
      }
      this._tAxis.set(dzn + dxn * 0.24, 0.06, -dxn + dzn * 0.24).normalize();
      this._flipSpeed = 6.4;
      this._yawSpin = 1.4;
    }
    this._updateCollider();
    return true;
  };

  /* รอบ 1587: เตะ #2 โดนรถกลางอากาศ → ระเบิดแตกละเอียด (เส้นทาง _explode เดิม = ดาเมจ 500 ทุกตัว) */
  OilTankerController.prototype.comboShatter = function(){
    this._comboHold = false;
    if(this.state === 'launched') this._explode();
    return this.state === 'exploding' || this.state === 'destroyed';
  };

  OilTankerController.prototype._stepLaunch = function(dt){
    if(!this.root) return;
    this.elapsed += dt;
    this.vy -= 19 * dt;
    this.root.position.x += this.vx * dt;
    this.root.position.y += this.vy * dt;
    this.root.position.z += this.vz * dt;
    /* รอบ 1577: หมุนด้วย quaternion รอบแกนเดียวที่สมจริง แทน euler 3 แกนคงที่ */
    if(this._tQ && this.root.quaternion){
      if(this._flipSpeed){
        this._tQ.setFromAxisAngle(this._tAxis, this._flipSpeed * dt);
        this.root.quaternion.premultiply(this._tQ);
        this._flipSpeed *= (1 - 0.1 * dt);
      }
      if(this._yawSpin){
        this._tQY.setFromAxisAngle(this._tUp, this._yawSpin * dt);
        this.root.quaternion.premultiply(this._tQY);
      }
    }
    const half = this.arena ? this.arena.half - 8 : 270;
    if(Math.abs(this.root.position.x) > half || Math.abs(this.root.position.z) > half){
      /* รอบ 1567: ปะทะขอบสนาม = ระเบิดทันที · รอบ 1587: ช่วงคอมโบกันไว้ รอเตะ #2 สั่งระเบิด */
      this.root.position.x = VF.clamp(this.root.position.x, -half, half);
      this.root.position.z = VF.clamp(this.root.position.z, -half, half);
      if(this._comboHold){
        this.vx = this.vy = this.vz = 0;
      }else{
        this._explode();
      }
      return;
    }
    const floor = this.arena && this.arena.surfaceY ? this.arena.surfaceY(this.root.position.x, this.root.position.z) : 0;
    if(this.root.position.y < floor + 1.25 && this.vy < 0){
      /* รอบ 1567: ปะทะพื้น/สิ่งใดก็ตาม = ระเบิดทันที (ดาเมจ 500 ทุกตัวผ่าน onExplosion เดิม)
         รอบ 1587: ช่วงคอมโบให้ลอยค้างระดับเตะ รอเตะ #2 กลางอากาศเป็นคนสั่งระเบิด */
      this.root.position.y = floor + 1.25;
      if(this._comboHold){
        this.vx = this.vy = this.vz = 0;
      }else{
        this._explode();
      }
    }
  };

  /* รอบ 1585: ลูกพลังชาร์จโดนรถน้ำมัน = ระเบิดแตกสลายทันที — ใช้เส้นทาง _explode เดิมทั้งหมด
     (เอฟเฟกต์ระเบิด + ดาเมจ 500 ทุกตัวผ่าน onExplosion) · ถ้ามีคนกำลังแบกอยู่ ให้ปล่อยมือก่อน
     ปุ่ม LIFT/THROW บน HUD รีเซ็ตสถานะเองจากเฟรม runtime ไม่ต้องแตะ */
  OilTankerController.prototype.detonate = function(){
    if(!this.ready) return false;
    if(this.state !== 'idle' && this.state !== 'carried' && this.state !== 'launched') return false;
    if(this.carrier && this.carrier.carrying === this) this.carrier.carrying = null;
    this.carrier = null;
    /* eventId ใหม่ทุกครั้ง = damageEventId ต่างจากเดิม → onExplosion ยิงดาเมจเสมอ */
    this.eventId = 'proj:' + String(Date.now()) + ':' + ((Math.random() * 1e6) | 0);
    this.state = 'launched';
    this.elapsed = 0;
    this._explode();
    return this.state === 'exploding' || this.state === 'destroyed';
  };

  OilTankerController.prototype._seedParticles = function(mesh, smoke){
    const vel = mesh.userData.velocity;
    vel.length = 0;
    const attr = mesh.geometry.attributes.position;
    for(let i = 0; i < attr.count; i++){
      const a = i / attr.count * Math.PI * 2 + ((i * 17) % 9) * 0.13;
      const lift = smoke ? 3.5 + (i % 5) * 0.45 : 5 + (i % 7) * 1.1;
      const out = smoke ? 3 + (i % 4) : 10 + (i % 6) * 2.2;
      vel.push({x: Math.cos(a) * out, y: lift, z: Math.sin(a) * out});
      attr.setXYZ(i, 0, 0, 0);
    }
    attr.needsUpdate = true;
  };

  OilTankerController.prototype._explode = function(){
    if(this.state !== 'launched' || !this.root) return;
    /* รอบ 1583: fail-safe — ถ้า fx ใช้ไม่ได้ ก็ต้องทำลายทิ้งเหมือนกัน ห้ามลอยค้างในอากาศ */
    if(!this.fx){
      this.state = 'destroyed';
      this.root.visible = false;
      if(this.collider) this.collider.broken = true;
      return;
    }
    this.state = 'exploding';
    this.fxAge = 0;
    const p = this.root.position;
    this.fx.group.position.set(p.x, (this.arena && this.arena.surfaceY ? this.arena.surfaceY(p.x, p.z) : 0) + 0.12, p.z);
    this.fx.group.visible = true;
    this.fx.group.children.forEach(function(m){ m.visible = true; });
    this._seedParticles(this.fx.sparks, false);
    this._seedParticles(this.fx.smoke, true);
    this.root.visible = false;
    if(this.collider) this.collider.broken = true;
    if(this.damageEventId !== this.eventId){
      this.damageEventId = this.eventId;
      if(this.onExplosion) this.onExplosion(this.eventId, {x: p.x, y: p.y, z: p.z});
    }
  };

  OilTankerController.prototype._tickParticles = function(mesh, age, smoke){
    const attr = mesh.geometry.attributes.position;
    const vel = mesh.userData.velocity || [];
    for(let i = 0; i < attr.count; i++){
      const v = vel[i] || {x: 0, y: 0, z: 0};
      attr.setXYZ(i, v.x * age, v.y * age + (smoke ? age * age * 1.1 : -4.8 * age * age), v.z * age);
    }
    attr.needsUpdate = true;
  };

  OilTankerController.prototype._tickExplosion = function(dt){
    const f = this.fx;
    this.fxAge += dt;
    const age = this.fxAge;
    const flashT = VF.clamp(age / 0.75, 0, 1);
    f.flash.scale.setScalar(3 + flashT * 20);
    f.flash.material.opacity = (1 - flashT) * 0.92;
    const shockT = VF.clamp(age / 1.15, 0, 1);
    f.shock.scale.setScalar(4 + shockT * 72);
    f.shock.material.opacity = (1 - shockT) * 0.86;
    const maxR = this.arena ? Math.hypot(this.arena.half + Math.abs(f.group.position.x), this.arena.half + Math.abs(f.group.position.z)) + 18 : 430;
    const fireT = VF.clamp(age / 5.8, 0, 1);
    const radius = 2 + maxR * fireT;
    f.fireA.scale.setScalar(radius);
    f.fireB.scale.setScalar(radius * 0.985);
    const fade = fireT < 0.88 ? 1 : (1 - fireT) / 0.12;
    f.fireA.material.opacity = 0.72 * Math.max(0, fade);
    f.fireB.material.opacity = 0.88 * Math.max(0, fade);
    f.sparks.material.opacity = age < 2.1 ? (1 - age / 2.1) * 0.95 : 0;
    f.smoke.material.opacity = age < 3.8 ? Math.min(0.5, age * 0.32) * (1 - age / 3.8) : 0;
    if(age < 2.1) this._tickParticles(f.sparks, age, false);
    if(age < 3.8) this._tickParticles(f.smoke, age, true);
    if(age >= 6.1){
      this.state = 'destroyed';
      f.group.visible = false;
      f.group.children.forEach(function(m){ m.visible = false; });
    }
  };

  OilTankerController.prototype.tick = function(dt){
    if(this.state === 'carried'){
      this.carryTick(dt, this.carrier);
    }else if(this.state === 'launched'){
      this._stepLaunch(dt);
      if(this.state === 'launched' && this.elapsed >= 4.5) this._explode();
    }else if(this.state === 'exploding'){
      this._tickExplosion(dt);
    }
  };

  OilTankerController.prototype.dispose = function(){
    if(this.collider && this.arena && this.arena.boxes){
      const i = this.arena.boxes.indexOf(this.collider);
      if(i >= 0) this.arena.boxes.splice(i, 1);
    }
    [this.root, this.fx && this.fx.group].forEach(function(g){ if(g && g.parent) g.parent.remove(g); });
    if(this.fx){
      this.fx.group.traverse(function(obj){
        if(obj.geometry && obj.geometry.dispose) obj.geometry.dispose();
        if(obj.material && obj.material.dispose) obj.material.dispose();
      });
    }
    this.collider = null;
    this.root = null;
    this.fx = null;
    this.ready = false;
  };

  VF.OilTankerController = OilTankerController;
  VF._t.tankerPointDistance = pointBoxDistance;
})(typeof window !== 'undefined' ? window : globalThis);
