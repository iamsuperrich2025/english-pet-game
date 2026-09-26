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
    VF._sedanAsset = VF.ensureGLTFLoader().then(function(THREE){
      return new Promise(function(resolve, reject){
        new THREE.GLTFLoader().load(VF.asset('assets/Golden_Vanguard_Sedan.glb'), function(gltf){
          resolve(gltf.scene);
        }, undefined, reject);
      });
    });
    return VF._sedanAsset;
  }

  /* รอบ 1573: โมเดลชุดแตก — โหลดขึ้นมาเมื่อรถถูกเตะ/ต่อยครั้งแรก (lazy, ไม่หน่วยโหลดตอนเข้าเกม) */
  function shatteredAsset(){
    if(VF._sedanShatteredAsset) return VF._sedanShatteredAsset;
    VF._sedanShatteredAsset = VF.ensureGLTFLoader().then(function(THREE){
      return new Promise(function(resolve, reject){
        new THREE.GLTFLoader().load(VF.asset('assets/Golden_Vanguard_Sedan_Shattered.glb'), function(gltf){
          resolve(gltf.scene);
        }, undefined, reject);
      });
    });
    return VF._sedanShatteredAsset;
  }

  /* รอบ 1594: สเปกวิถีปลิวขึ้นฟ้าหลังโดนเตะ #2 (จุดจบคอมโบใหม่ — ไม่ระเบิด หายวับไปบนฟ้า) */
  const SKY_SPEC = {h: 14, up: 46, grav: 7, vanishY: 70};

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
    /* รอบ 1577: แคชอ็อบเจกต์สำหรับพลิกหมุนด้วย quaternion (ไม่ alloc ต่อเฟรม) */
    this._tAxis = null; this._tQ = null; this._tQY = null; this._tUp = null; this._tE = null;
    this._flipSpeed = 0; this._yawSpin = 0;
    this.elapsed = 0;
    this.bounces = 0;
    this._hitIds = {};
    this.carrier = null;
    this._skyPunt = false;
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
    this._modelScale = scale;
    this.root = holder;
    this.model = null;
    this._applyModel(model);
    this._normalModel = model;
    this.ready = true;
    this.reset();
    /* รอบ 1580: โหลดโมเดลชุดแตกล่วงหน้าแบบเงียบๆ — เตะ/ต่อยครั้งแรกจะได้สลับชุดแตกทันที
       แทนที่จะรอโหลดไฟล์ 16MB ค้างไป 1-2 วินาทีตอนถูกตี */
    shatteredAsset().catch(function(err){
      console.warn('[VocabForce] sedan shattered preload skip', err);
    });
    return this;
  };

  /* รอบ 1573: ใส่โมเดลเข้า holder ชุดปัจจุบัน (ปกติ/ชุดแตก) — คำนวณสเกล ความสูงพื้น และขนาดครึ่งใหม่ทุกครั้ง */
  SedanController.prototype._applyModel = function(model){
    if(!this.root || !model) return false;
    const THREE = root.THREE;
    if(this.model && this.model.parent) this.root.remove(this.model);
    const scale = this._modelScale || 1;
    model.scale.setScalar(scale);
    let box = new THREE.Box3().setFromObject(model);
    const size = new THREE.Vector3();
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
    this.root.add(model);
    this.model = model;
    this._updateCollider();
    return true;
  };

  /* รอบ 1573: รถถูกเตะ/ต่อย → สลับเป็นโมเดลชุดแตก (โหลด lazy ครั้งแรก แล้วเก็บไว้ใช้ซ้ำ) */
  SedanController.prototype.swapShattered = function(){
    if(!this.ready || this._shatteredOn) return false;
    this._shatteredOn = true;
    const self = this;
    shatteredAsset().then(function(source){
      if(!self._shatteredModel) self._shatteredModel = source.clone(true);
      self._applyModel(self._shatteredModel);
    }).catch(function(err){
      console.warn('[VocabForce] sedan shattered load skip', err);
    });
    return true;
  };

  /* รอบ 1577: เริ่มพลิกตามฟิสิกส์ — แกนหมุนหลักตั้งฉากกับทิศทำให้คว่ำหน้าไปข้างหน้า (เหมือนรถถูกเตะจริง)
     ผสมการม้วนตามแนวยาวเล็กน้อย + หมุนควงสวิงตามแนวดิ่งจางๆ แทนการหมุน euler 3 แกนคงที่เดิม */
  SedanController.prototype._beginTumble = function(dirX, dirZ, hSpeed, upSpeed, flipSpeed, yawSpin){
    const THREE = root.THREE;
    if(!this.root || !THREE) return false;
    const n = Math.hypot(dirX, dirZ) || 1;
    const dx = dirX / n, dz = dirZ / n;
    this.vx = dx * hSpeed;
    this.vz = dz * hSpeed;
    this.vy = upSpeed;
    if(!this._tAxis){
      this._tAxis = new THREE.Vector3();
      this._tQ = new THREE.Quaternion();
      this._tQY = new THREE.Quaternion();
      this._tUp = new THREE.Vector3(0, 1, 0);
      this._tE = new THREE.Euler();
    }
    this._tAxis.set(dz + dx * 0.22, 0.05, -dx + dz * 0.22).normalize();
    this._flipSpeed = flipSpeed;
    this._yawSpin = yawSpin || 0;
    return true;
  };

  SedanController.prototype._tumbleStep = function(dt){
    if(!this.root || !this._tQ) return;
    if(this._flipSpeed){
      this._tQ.setFromAxisAngle(this._tAxis, this._flipSpeed * dt);
      this.root.quaternion.premultiply(this._tQ);
      /* รอบ 1588: หมุนช้าลงตามแรงเสียดอากาศในอากาศ (เหมือนรถน้ำมันรอบ 1577) — หมุนธรรมชาติ
         แทนการคงความเร็วหมุนคงที่แล้วหยุดพรุบเมื่อถึงพื้น */
      this._flipSpeed *= (1 - 0.1 * dt);
    }
    if(this._yawSpin){
      this._tQY.setFromAxisAngle(this._tUp, this._yawSpin * dt);
      this.root.quaternion.premultiply(this._tQY);
    }
  };

  /* รอบ 1573: ต่อย/เตะโดนรถยนต์ได้เหมือนรถน้ำมัน (combat เรียกผ่าน world proxy) */
  SedanController.prototype.canMelee = function(player, reach){
    if(!this.ready || this.state !== 'idle' || !player || player.alive === false) return false;
    return pointBoxDistance(player.x || 0, player.z || 0, this.collider) <= (reach || 2.4);
  };

  SedanController.prototype.meleeHit = function(origin, reach, info){
    if(!this.ready || this.state !== 'idle') return false;
    if(this._meleeAt && VF.now() - this._meleeAt < 900) return false;
    if(pointBoxDistance(origin.x || 0, origin.z || 0, this.collider) > (reach || 2.8) + 1.1) return false;
    this._meleeAt = VF.now();
    /* รอบ 1576: กระตุกตัวถังแรงตามแรงกระแทก (เดิมคงที่ 0.22) ให้สมกับเอฟเฟกต์หนักหน่วง */
    const jolt = 0.3 + Math.min(((info && info.force) || 18) * 0.012, 0.55);
    if(this.root){
      this.root.position.x += ((info && info.dir && info.dir.x) || 0) * jolt;
      this.root.position.z += ((info && info.dir && info.dir.z) || 0) * jolt;
    }
    this._updateCollider();
    this.swapShattered();
    /* รอบ 1577: ถูกเตะ/ต่อย = กระโดดเด้งพลิกตามแรงแล้วคว่ำกลับลงล้อ (cosmetic อย่างเดียว ไม่ทำดาเมจใคร)
       รอบ 1588: เตะ (kick/heavyKick) = กระเด็นไกลเท่ารถน้ำมันโดนเตะพอดี — รถน้ำมันใช้วิถี h54/up34/grav19
       (แขวน 3.58 วิ ไกล ~193 หน่วย) → รถยนต์ grav 22 ต้องใช้ up 39 จึงจะแขวนนานเท่ากัน (3.55 วิ ไกล ~191 หน่วย)
       ส่วนต่อยยังเด้งเบาเหมือนเดิม */
    if(this.state === 'idle'){
      const f = (info && info.force) || 18;
      const kickish = (info && info.kind) === 'kick' || (info && info.kind) === 'heavyKick';
      this.state = 'tumbling';
      this.elapsed = 0;
      this.bounces = 0;
      this._hitIds = {};
      if(kickish){
        this._beginTumble(
          (info && info.dir && info.dir.x) || 0,
          (info && info.dir && info.dir.z) || 1,
          54, 39,
          6.4 + Math.min(f * 0.02, 1.2),
          1.1 + (Math.random() - 0.5) * 0.4
        );
      }else{
        this._beginTumble(
          (info && info.dir && info.dir.x) || 0,
          (info && info.dir && info.dir.z) || 1,
          2.0 + f * 0.055,
          4.0 + f * 0.05,
          3.4 + f * 0.02,
          (Math.random() - 0.5) * 0.8
        );
      }
      this._updateCollider();
    }
    return true;
  };

  /* รอบ 1585: ลูกพลังชาร์จโดนรถยนต์ = ระเบิดแตกสลายทันที ค้างเป็นซากชุดแตก (สอดคล้องผลการเตะ/ต่อย รอบ 1582)
     หยุดความเร็ว/การพลิกทั้งหมด วางลงพื้นฐานสนาม แล้วสลับโมเดลชุดแตกที่โหลดล่วงหน้าไว้แล้ว */
  SedanController.prototype.detonate = function(fx, audio, cam){
    if(!this.ready) return false;
    if(this.carrier && this.carrier.carrying === this) this.carrier.carrying = null;
    this.carrier = null;
    this._comboHold = false;
    this.vx = this.vy = this.vz = 0;
    this._flipSpeed = 0;
    this._yawSpin = 0;
    if(this.root){
      if(this.root.quaternion) this.root.quaternion.identity();
      if(this.root.rotation) this.root.rotation.set(0, this.root.rotation.y || 0, 0);
      this.root.visible = true;
      const floor = this.arena && this.arena.groundY ? this.arena.groundY(this.root.position.x, this.root.position.z) : (this.arena && this.arena.surfaceY ? this.arena.surfaceY(this.root.position.x, this.root.position.z) : 0);
      this.root.position.y = floor;
    }
    if(this.state === 'thrown' || this.state === 'tumbling' || this.state === 'carried') this.state = 'idle';
    this.swapShattered();
    this._updateCollider();
    if(fx && fx.arenaFire){
      const p = this.root ? this.root.position : {x: this.spawn.x, y: 0, z: this.spawn.z};
      fx.arenaFire(p.x, (p.y || 0) + 0.6, p.z, {r: 3.2});
    }
    if(audio && audio.arenaFire) audio.arenaFire();
    if(cam && cam.impulse) cam.impulse(0.42, 3.2);
    return true;
  };

  /* รอบ 1587/1594: คอมโบเตะ — เตะ #1 ปล่อยรถยนต์ลอยวิถีโค้งสูง (_comboHold กันการตั้งล้อ/เด้งพื้น
     รอเตะ #2 กลางอากาศ · comboSkyPunt รอบ 1594 เป็นคนสั่งปลิวขึ้นฟ้า)
     รอบ 1594: รับ state 'thrown'/'tumbling' เพิ่ม — กด THROW ครั้งแรกทุ่มทันทีแล้วกดซ้ำตอนรถลอย
     จึงเรียกตัวนี้แปลงวิถีจากทุ่มปกติเป็นวิถีคอมโบได้เลย */
  SedanController.prototype.comboKickLaunch = function(dirX, dirZ, spec){
    if(!this.ready) return false;
    if(this.state !== 'carried' && this.state !== 'idle' && this.state !== 'thrown' && this.state !== 'tumbling') return false;
    this._comboHold = true;
    this.state = 'thrown';
    this.carrier = null;
    this.elapsed = 0;
    this.bounces = 0;
    this._hitIds = {};
    const sp = spec || {h: 30, up: 17};
    this._beginTumble(dirX, dirZ, sp.h, sp.up, 7.5, (Math.random() - 0.5) * 1.4);
    this._updateCollider();
    return true;
  };

  SedanController.prototype.comboShatter = function(ctx){
    if(!this.ready) return false;
    this._comboHold = false;
    this.vx = this.vy = this.vz = 0;
    this._flipSpeed = 0;
    this._yawSpin = 0;
    if(this.root){
      if(this.root.quaternion) this.root.quaternion.identity();
      if(this.root.rotation) this.root.rotation.set((Math.random() - 0.5) * 0.3, this.root.rotation.y || 0, (Math.random() - 0.5) * 0.24);
      const floor = this.arena && this.arena.groundY ? this.arena.groundY(this.root.position.x, this.root.position.z) : 0;
      this.root.position.y = floor;
    }
    this.state = 'idle';
    this.swapShattered();
    this._updateCollider();
    if(ctx && ctx.fx && ctx.fx.arenaFire && this.root){
      const p = this.root.position;
      ctx.fx.arenaFire(p.x, (p.y || 0) + 0.6, p.z, {r: 3.2});
    }
    if(ctx && ctx.audio && ctx.audio.arenaFire) ctx.audio.arenaFire();
    return true;
  };

  /* รอบ 1594: เตะ #2 (จุดจบคอมโบใหม่) — ไม่ระเบิดอีกต่อไป รถถูกเตะพุ่งขึ้นฟ้าสูงแล้วหายวับไป
     (ผู้ใช้สั่ง: ทั้งรถน้ำมันและรถเก๋ง กระเด็นปลิวลอยหายไปบนอากาศสูง ๆ — ไม่บังคับ state เตะได้ทุกสภาพ) */
  SedanController.prototype.comboSkyPunt = function(dirX, dirZ){
    if(!this.ready || !this.root) return false;
    this._comboHold = false;
    this._skyPunt = true;
    this.state = 'thrown';
    this.carrier = null;
    this.elapsed = 0;
    /* _beginTumble ตั้งความเร็ว + สร้างแกนหมุน lazy ให้เอง (รถนิ่ง ๆ ที่ยังไม่เคยถูกเตะก็หมุนได้) */
    this._beginTumble(dirX, dirZ, SKY_SPEC.h, SKY_SPEC.up, 9, 2.4);
    this._flipSpeed = Math.max(this._flipSpeed || 0, 9);
    this._yawSpin = Math.max(this._yawSpin || 0, 2.4);
    this._updateCollider();
    return true;
  };

  /* รถปลิวพ้นขอบฟ้า — หายวับไปเลย (state 'gone' ทำให้ guard ใน tick หยุดฟิสิกส์เอง ไม่มีระเบิด/ดาเมจ) */
  SedanController.prototype._vanishSky = function(){
    this._skyPunt = false;
    this.vx = this.vy = this.vz = 0;
    this._flipSpeed = 0;
    this._yawSpin = 0;
    if(this.root) this.root.visible = false;
    this.state = 'gone';
    this._updateCollider();
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
    this._flipSpeed = 0;
    this._yawSpin = 0;
    this._comboHold = false;
    this._skyPunt = false;
    this._hitIds = {};
    this.carrier = null;
    /* รอบ 1573: รอบใหม่ = รถกลับเป็นสภาพปกติ (ถอดโมเดลชุดแตก) */
    if(this._shatteredOn){
      this._shatteredOn = false;
      if(this._normalModel) this._applyModel(this._normalModel);
    }
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
    /* รอบ 1573: ยกขึ้นลอย "เหนือมือ" (ท่า cast ยกมือเหนือศีรษะ) — เดิม 1.05 ต่ำเกินเหมือนลากพื้น
       ใช้กับทั้ง NEX และ Lyravyn (carryTick ไม่ผูกกับตัวละคร) */
    this.root.position.set(
      (player.x || 0) + fwd.x * (this.halfLong + 0.9),
      (player.y || 0) + 1.95 + bob,
      (player.z || 0) + fwd.z * (this.halfLong + 0.9)
    );
    this.root.rotation.y = Math.atan2(fwd.x, fwd.z);
    this.root.rotation.x = 0.06 + bob * 0.4;
  };

  /* รอบ 1584: ค่าทุ่มมาตรฐาน — ใช้ทั้งตอนทุ่มจริงและคำนวณพิกัดตก (เครื่องหมาย + ตอนยก)
     grav ต้องตรงกับค่าใน tick/_stepLaunch เสมอ */
  SedanController.prototype.THROW_SPEC = {h: 26, up: 9.5, grav: 22, y0: 1.5, wallInset: 3};

  SedanController.prototype.throwBy = function(player, dirX, dirZ){
    if(this.state !== 'carried') return false;
    const n = Math.hypot(dirX, dirZ) || 1;
    this.state = 'thrown';
    this.carrier = null;
    this.elapsed = 0;
    this.bounces = 0;
    this._hitIds = {};
    /* รอบ 1577/1584: พลิกตามทิศทุ่มด้วยแกนสมจริง + ใช้ค่าสเปกร่วมกับตัวชี้พิกัดตก */
    const spec = this.THROW_SPEC;
    this._beginTumble(dirX, dirZ, spec.h, spec.up, 6.5, (Math.random() - 0.5) * 1.2);
    if(this.root){
      this.root.position.set(
        (player.x || 0) + dirX / n * 1.6,
        (player.y || 0) + spec.y0,
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
    if(this.state !== 'thrown' && this.state !== 'tumbling' || !this.root) return;
    this.elapsed += dt;
    if(this._skyPunt){
      /* รอบ 1594: วิถีปลิวขึ้นฟ้า — แรงโน้มถ่วงจาง ไม่เด้ง/ไม่ชนขอบ พ้นขอบฟ้าค่อยหายวับ */
      this.vy -= SKY_SPEC.grav * dt;
      this.root.position.x += this.vx * dt;
      this.root.position.y += this.vy * dt;
      this.root.position.z += this.vz * dt;
      this._tumbleStep(dt);
      if(this.root.position.y >= SKY_SPEC.vanishY || this.elapsed > 8) this._vanishSky();
      return;
    }
    ctx = ctx || {};
    const player = ctx.player;
    const isThrow = this.state === 'thrown';
    const grav = (this.THROW_SPEC && this.THROW_SPEC.grav) || 22;
    this.vy -= grav * dt;
    this.root.position.x += this.vx * dt;
    this.root.position.y += this.vy * dt;
    this.root.position.z += this.vz * dt;
    this._tumbleStep(dt);

    const half = this.arena ? this.arena.half - 3 : 270;
    const p = this.root.position;
    let wallHit = false;
    if(p.x < -half || p.x > half){ p.x = VF.clamp(p.x, -half, half); this.vx *= -0.42; wallHit = true; }
    if(p.z < -half || p.z > half){ p.z = VF.clamp(p.z, -half, half); this.vz *= -0.42; wallHit = true; }
    /* รอบ 1583: ซากรถที่กระเด็น (thrown/tumbling) ต้องตกลงพื้นฐานสนามเสมอ —
       ห้ามขึ้นไปค้างบนยอดแพลตฟอร์ม/prop (surfaceY) ซึ่งดูเหมือนลอยในอากาศ */
    const floor = this.arena && this.arena.groundY ? this.arena.groundY(p.x, p.z) : (this.arena && this.arena.surfaceY ? this.arena.surfaceY(p.x, p.z) : 0);
    let groundHit = false;
    if(p.y <= floor + 0.02 && this.vy < 0){
      p.y = floor;
      groundHit = true;
      if(this._comboHold){
        /* รอบ 1587: ช่วงคอมโบ — จอดนิ่งรอเตะ #2 กลางอากาศสั่งแตก ไม่เด้ง/ไม่ตั้งล้อ */
        this.vy = 0;
        this.vx = 0;
        this.vz = 0;
      }else{
        this.vy *= -0.38;
        this.vx *= 0.72; this.vz *= 0.72;
        this._flipSpeed *= 0.62; this._yawSpin *= 0.6;
        this.bounces++;
        this._impact(ctx.fx, ctx.audio, ctx.cam, player, p.x, p.y + 0.6, p.z);
      }
    }

    /* โดนคนปุ๊บหักพลัง -100 แล้วเด้งออก (เฉพาะสถานะ thrown — การเด้งจากการถูกเตะเป็นแค่เอฟเฟกต์) */
    const dmg = VF.SEDAN_DAMAGE || 100;
    const speed = Math.hypot(this.vx, this.vz) + Math.abs(this.vy);
    if(isThrow && speed > 4){
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
    if(!this._comboHold && ((groundHit && spd < 2.2 && Math.abs(this.vy) < 2.5) || this.bounces >= 3 || this.elapsed > 6)){
      this.state = 'idle';
      this.vx = this.vy = this.vz = 0;
      this._flipSpeed = 0;
      this._yawSpin = 0;
      /* รอบ 1582: ค้างท่าที่ตกจริง — ไม่สั่งคว่ำกลับล้ออัตโนมัติ (เดิม snap upright ทำรถที่พลิกค้างจมพื้น
         เด้งกลับตั้งตรงผิดธรรมชาติ) แล้วยกตัวถังให้พ้นพื้นตามทิศที่ค้าง เผื่อทับซ้อนพื้นครึ่งคัน */
      p.y = floor;
      const THREE = root.THREE;
      if(THREE && this.root){
        const box = new THREE.Box3().setFromObject(this.root);
        if(isFinite(box.min.y) && box.min.y < floor) p.y += floor - box.min.y;
      }
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
