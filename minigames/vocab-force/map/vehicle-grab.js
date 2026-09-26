"use strict";
/* รอบ 1567/1575: ผู้ประสานงานจับยก-ทุ่มยานพาหนะ — ปุ่ม LIFT/THROW (หรือคีย์ G): กดเพื่อยกเมื่อยังไม่ได้ยก กดเพื่อทุ่มเมื่อยกแล้ว
   ปุ่ม KICK เตะอย่างเดียวตั้งแต่รอบ 1575 ไม่เกี่ยวข้องกับการยกแล้ว
   รถยนต์: โดนทุ่มใส่ใคร คนนั้นพลัง -100 (VF.SEDAN_DAMAGE) · รถน้ำมัน: ปะทะสิ่งใดระเบิด ทุกตัว -500 (VF.TANKER_DAMAGE) */
(function(root){
  const VF = root.VocabForce = root.VocabForce || {};

  /* รอบ 1587/1594: คอมโบเตะพาเที่ยว — กด THROW 2 ครั้งต่อเนื่องแล้วตามด้วย KICK
     รอบ 1594: กด THROW ครั้งแรก = ทุ่มทันทีตามปกติ (ไม่อมคำสั่งรอ) · กด THROW ครั้งที่ 2
     ตอนรถยังลอย = แปลงวิถีคอมโบสูง · ตามด้วย KICK = ตัวละครว้าบไปเตะ #2 กลางอากาศ
     จนจบด้วยรถพุ่งขึ้นฟ้าสูงแล้วหายวับ (ไม่ระเบิด) — ใช้ได้ทุกตัวละคร ไม่ผูกกับ manifest ใดตัวหนึ่ง */
  const COMBO_PRESS_MS = 1100;  /* หน้าต่างกด THROW ครั้งที่ 2 */
  const COMBO_KICK_MS = 1400;   /* หน้าต่างกด KICK หลัง THROW ครั้งที่ 2 */
  const COMBO_SPEC_TANKER = {h: 40, up: 26, grav: 19};
  const COMBO_SPEC_SEDAN = {h: 30, up: 17, grav: 22};
  const DEBRIS_COUNT = 16, SPARK_COUNT = 42, DEBRIS_DUR = 1.35;

  function VehicleGrabController(opts){
    opts = opts || {};
    this.sedan = opts.sedan || null;
    this.tanker = opts.tanker || null;
    this.arena = opts.arena || null;
    this._markerScene = opts.scene || null;
    this._marker = null;
    this._toastAt = 0;
    this._promptShown = false;
    this._combo = null;    /* {stage, at, player, cam, fx, audio, hud, requestTankerHit, hasNet} */
    this._flight = null;   /* {veh, t, dur, x, z, dx, dz, player, fx, audio, cam, hud} */
    this._debris = null;
  }

  VehicleGrabController.prototype.reset = function(){
    this._combo = null;
    this._flight = null;
    this._hideMarker();
    this._promptShown = false;
    if(this.sedan) this.sedan._comboHold = false;
    if(this.tanker) this.tanker._comboHold = false;
  };

  /* รับกด THROW — รอบ 1594: ครั้งแรกทุ่มทันทีตามปกติ (ไม่อมคำสั่งรอหน้าต่างอีกต่อไป)
     ถ้ากด THROW ซ้ำภายใน COMBO_PRESS_MS ตอนรถยังลอยอยู่ → แปลงวิถีเป็นคอมโบสูง (stage 2 รอ KICK)
     คืน true ถ้ากลืนเป็นคอมโบ/ทุ่มแล้ว คืน false ถ้าไม่เข้าเงื่อนไข */
  VehicleGrabController.prototype.comboThrow = function(player, cam, fx, audio, hud, requestTankerHit, hasNet){
    if(!player || player.alive === false) return false;
    const now = VF.now();
    const c = this._combo;
    if(c && c.stage === 1 && now - c.at <= COMBO_PRESS_MS){
      /* THROW ครั้งที่ 2 ภายในหน้าต่าง — รถต้องยังลอย/นิ่งอยู่ในสนามจึงจะแปลงวิถีคอมโบได้ */
      const held = c.veh;
      const ok = held && held.root &&
        (held.state === 'thrown' || held.state === 'launched' || held.state === 'tumbling' || held.state === 'carried');
      if(!ok){
        this._combo = null;
        return false;
      }
      const fwd = player.forward ? player.forward() : {x: 0, z: 1};
      const spec = held === this.tanker ? COMBO_SPEC_TANKER : COMBO_SPEC_SEDAN;
      if(!held.comboKickLaunch || !held.comboKickLaunch(fwd.x, fwd.z, spec)){
        this._combo = null;
        return false;
      }
      c.stage = 2;
      c.at = now;
      if(player.playAction) player.playAction('throw');
      if(audio && audio.punchWhoosh) audio.punchWhoosh();
      if(hud && hud.toast) hud.toast('🔥 พร้อมเตะ! กด KICK');
      return true;
    }
    /* ครั้งแรก (หรือไม่มีคอมโบค้าง) — ทุ่มทันทีเหมือนกดปุ่ม THROW ปกติ แล้วจำรถไว้เผื่อกดซ้ำเป็นคอมโบ */
    const held = this.carrying();
    if(!held) return false;
    if(!this.throw(player, cam, fx, audio, hud, requestTankerHit, hasNet)) return false;
    this._combo = {stage: 1, at: now, veh: held, player: player, cam: cam, fx: fx, audio: audio, hud: hud};
    return true;
  };

  /* รับกด KICK — ถ้าคอมโบ armed (THROW×2 แล้ว) ให้ว้าบไปเตะ #2 กลางอากาศจนจบคอมโบ */
  VehicleGrabController.prototype.tryComboKick = function(player, cam, fx, audio, hud, arena){
    const c = this._combo;
    if(!c || c.stage !== 2 || VF.now() - c.at > COMBO_KICK_MS) return false;
    const held = c.veh;
    if(!held || !held.root || !player || player.alive === false) return false;
    const fwd = player.forward ? player.forward() : {x: 0, z: 1};
    const dx = fwd.x, dz = fwd.z;
    const kickAnim = player.anim && player.anim.has && player.anim.has('kick') ? 'kick' : 'punch';
    if(player.playAction) player.playAction(kickAnim);
    if(audio && audio.kickWhoosh) audio.kickWhoosh();
    this._combo = null;
    this._hideMarker();
    /* เตะ #1 แปลงวิถีไปแล้วตอนกด THROW ครั้งที่ 2 — คำนวณจุด/เวลาจากตำแหน่งรถตอนนี้
       (สเปกเดียวกับวิถีคอมโบ) แล้วว้าบตามไปเตะ #2 ที่จุดนั้น */
    const spec = held === this.tanker ? COMBO_SPEC_TANKER : COMBO_SPEC_SEDAN;
    const p = held.root.position;
    const half = (arena ? arena.half : 280) - 8;
    const floorY = arena && arena.groundY ? arena.groundY(p.x, p.z) : 0;
    const y0 = Math.max(0.2, (p.y || 0) - floorY);
    const tHit = (spec.up + Math.sqrt(spec.up * spec.up + 2 * spec.grav * y0)) / spec.grav;
    const lx = VF.clamp(p.x + dx * spec.h * tHit, -half, half);
    const lz = VF.clamp(p.z + dz * spec.h * tHit, -half, half);
    /* ตัวละครว้าบไปรอจุดตก — dash ควบคุมระยะ/เวลาเอง ไม่ผูกกับตัวละครใดตัวหนึ่ง */
    const distP = Math.hypot(lx - (player.x || 0), lz - (player.z || 0));
    if(player.beginDash && distP > 1.4){
      player.beginDash({
        kind: 'combo', dirX: lx - (player.x || 0), dirZ: lz - (player.z || 0),
        distance: Math.max(1.2, distP - 1.3), duration: Math.max(0.12, tHit * 0.9),
        cooldown: 0.4, maxDistance: 80, fx: fx, camera: cam, arena: arena, now: VF.now()
      });
    }
    this._flight = {veh: held, t: 0, dur: Math.max(0.18, tHit), x: lx, z: lz, dx: dx, dz: dz, player: player, fx: fx, audio: audio, cam: cam, hud: hud};
    if(hud && hud.toast) hud.toast('🌀 ว้าบไปเตะรถกลางอากาศ!');
    return true;
  };

  VehicleGrabController.prototype._finishComboFlight = function(f){
    const v = f.veh, pl = f.player;
    /* วางตัวละครหน้ารถจุดตก หันหน้าเข้าหารถ แล้วเตะ #2 */
    if(pl && pl.alive !== false){
      pl.x = f.x - f.dx * 1.4;
      pl.z = f.z - f.dz * 1.4;
      if(pl.yaw != null) pl.yaw = Math.atan2(f.dx, f.dz);
      if(pl.vx != null){ pl.vx = 0; pl.vz = 0; }
      if(pl._sync) pl._sync();
      const kickAnim = pl.anim && pl.anim.has && pl.anim.has('kick') ? 'kick' : 'punch';
      if(pl.playAction) pl.playAction(kickAnim);
    }
    /* รอบ 1594: เตะ #2 (จุดจบคอมโบใหม่) — รถถูกเตะพุ่งขึ้นฟ้าสูงแล้วหายวับไป ไม่ระเบิด/ไม่มีดาเมจ */
    if(v && v.comboSkyPunt) v.comboSkyPunt(f.dx, f.dz);
    const p = v && v.root ? v.root.position : {x: f.x, y: 1, z: f.z};
    if(f.fx){
      if(f.fx.arenaFire) f.fx.arenaFire(p.x, (p.y || 0) + 0.6, p.z, {r: 2.6});
      if(f.fx._spawn) f.fx._spawn('ring', p.x, 0.1, p.z, 0.4, {role: 'shock', rotX: -Math.PI / 2, startR: 0.5, endR: 3.4, color: 0x9bfff0, opacity: 0.9, add: true});
    }
    if(f.audio){
      if(f.audio.energyFire) f.audio.energyFire();
      if(f.audio.shockwaveImpact) f.audio.shockwaveImpact();
    }
    if(f.cam && f.cam.impulse) f.cam.impulse(1.6, 9, {low: true});
    if(f.hud && f.hud.toast) f.hud.toast('🚀 เตะรถปลิวขึ้นฟ้า!');
  };

  VehicleGrabController.prototype._tickCombo = function(dt){
    const c = this._combo;
    if(c){
      const v = c.veh;
      const airborne = v && (v.state === 'thrown' || v.state === 'launched' || v.state === 'tumbling' || v.state === 'carried');
      if(!airborne){
        /* รถตกพื้น/ระเบิด/หายไปแล้ว — คอมโบจบ (รถถูกทุ่มไปตั้งแต่กดครั้งแรกอยู่แล้ว) */
        this._combo = null;
      }else if(c.stage === 1 && VF.now() - c.at > COMBO_PRESS_MS){
        /* ไม่กด THROW ซ้ำ — เป็นทุ่มครั้งเดียวตามปกติ ไม่ต้องทำอะไรเพิ่ม */
        this._combo = null;
      }else if(c.stage === 2 && VF.now() - c.at > COMBO_KICK_MS){
        /* กด THROW×2 แล้วแต่ไม่ตามด้วย KICK — ปล่อย _comboHold ให้รถตก/ระเบิดตามฟิสิกส์ปกติ */
        this._combo = null;
        if(v) v._comboHold = false;
      }
    }
    const f = this._flight;
    if(f){
      f.t += dt;
      if(!f.veh || f.veh.state === 'destroyed' || !f.veh.root){
        this._flight = null;
      }else if(f.t >= Math.max(0.05, f.dur - 0.06)){
        this._flight = null;
        this._finishComboFlight(f);
      }
    }
    this._tickDebris(dt);
  };

  /* ชิ้นส่วนรถแตกละเอียด — สร้างครั้งเดียว ใช้ซ้ำ (ไม่ alloc ต่อครั้งที่เตะ) */
  VehicleGrabController.prototype._ensureDebris = function(){
    if(this._debris || !this._markerScene || !root.THREE) return;
    const THREE = root.THREE;
    const group = new THREE.Group();
    group.name = 'VFComboDebris';
    group.visible = false;
    const matMetal = new THREE.MeshBasicMaterial({color: 0x3a3f46});
    const matHot = new THREE.MeshBasicMaterial({color: 0xff7a26});
    const chunks = [];
    for(let i = 0; i < DEBRIS_COUNT; i++){
      const s = 0.14 + (i % 5) * 0.07;
      const m = new THREE.Mesh(new THREE.BoxGeometry(s, s * 0.7, s * 1.4), i % 3 === 0 ? matHot : matMetal);
      m.visible = false;
      group.add(m);
      chunks.push({m: m, vx: 0, vy: 0, vz: 0, spin: 4 + (i % 7) * 1.6});
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(new Float32Array(SPARK_COUNT * 3), 3));
    const sparks = new THREE.Points(geo, new THREE.PointsMaterial({
      color: 0xffc23b, size: 0.55, transparent: true, opacity: 0,
      depthWrite: false, blending: THREE.AdditiveBlending
    }));
    sparks.visible = false;
    group.add(sparks);
    this._markerScene.add(group);
    this._debris = {group: group, chunks: chunks, sparks: sparks, svel: [], age: 999, dur: DEBRIS_DUR};
  };

  VehicleGrabController.prototype._burstDebris = function(y, at){
    this._ensureDebris();
    const d = this._debris;
    if(!d) return;
    d.age = 0;
    d.group.visible = true;
    const x = at && at.x || 0, z = at && at.z || 0;
    d.chunks.forEach(function(c, i){
      const a = (i / DEBRIS_COUNT) * Math.PI * 2 + (i % 3) * 0.4;
      const spd = 7 + (i % 6) * 2.4;
      c.m.position.set(x, y + (i % 4) * 0.22, z);
      c.vx = Math.cos(a) * spd;
      c.vz = Math.sin(a) * spd;
      c.vy = 6.5 + (i % 5) * 1.8;
      c.m.rotation.set((i % 3) * 0.7, a, (i % 4) * 0.5);
      c.m.scale.setScalar(1);
      c.m.visible = true;
    });
    const attr = d.sparks.geometry.attributes.position;
    d.svel.length = 0;
    for(let i = 0; i < SPARK_COUNT; i++){
      const a = Math.random() * Math.PI * 2;
      const el = (Math.random() - 0.35) * Math.PI * 0.5;
      const spd = 9 + Math.random() * 14;
      d.svel.push({x: Math.cos(a) * Math.cos(el) * spd, y: Math.abs(Math.sin(el)) * spd + 4, z: Math.sin(a) * Math.cos(el) * spd});
      attr.setXYZ(i, x, y, z);
    }
    attr.needsUpdate = true;
    d.sparks.material.opacity = 0.95;
    d.sparks.visible = true;
  };

  VehicleGrabController.prototype._tickDebris = function(dt){
    const d = this._debris;
    if(!d || d.age > d.dur) return;
    d.age += dt;
    const t = d.age, k = VF.clamp(t / d.dur, 0, 1);
    d.chunks.forEach(function(c){
      if(!c.m.visible) return;
      c.vy -= 22 * dt;
      c.m.position.x += c.vx * dt;
      c.m.position.y += c.vy * dt;
      c.m.position.z += c.vz * dt;
      c.m.rotation.x += c.spin * dt;
      c.m.rotation.y += c.spin * 0.7 * dt;
      c.m.scale.setScalar(Math.max(0.01, 1 - k));
      if(t >= d.dur) c.m.visible = false;
    });
    const attr = d.sparks.geometry.attributes.position;
    for(let i = 0; i < attr.count; i++){
      const v = d.svel[i] || {x: 0, y: 0, z: 0};
      attr.setXYZ(i, attr.getX(i) + v.x * dt, attr.getY(i) + v.y * dt, attr.getZ(i) + v.z * dt);
      v.y -= 26 * dt;
      d.svel[i] = v;
    }
    attr.needsUpdate = true;
    d.sparks.material.opacity = t < 0.9 ? (1 - t / 0.9) * 0.95 : 0;
    if(t >= d.dur){
      d.sparks.visible = false;
      d.group.visible = false;
    }
  };


  /* รอบ 1584: เครื่องหมาย + บนพื้น (สร้างครั้งเดียวตอนแรกที่ใช้ — ไม่ alloc ต่อเฟรม) */
  VehicleGrabController.prototype._ensureMarker = function(){
    if(this._marker || !this._markerScene || !root.THREE) return this._marker;
    const THREE = root.THREE;
    const mat = new THREE.MeshBasicMaterial({
      color: 0xffa040, transparent: true, opacity: 0.9,
      blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide
    });
    const barA = new THREE.Mesh(new THREE.PlaneGeometry(1.7, 0.24), mat);
    barA.rotation.x = -Math.PI / 2;
    const barB = new THREE.Mesh(new THREE.PlaneGeometry(0.24, 1.7), mat);
    barB.rotation.x = -Math.PI / 2;
    barB.position.y = 0.02;
    const grp = new THREE.Group();
    grp.add(barA); grp.add(barB);
    grp.visible = false;
    grp.renderOrder = 5;
    this._markerScene.add(grp);
    this._marker = grp;
    return grp;
  };

  /* รอบ 1584: คำนวณพิกัดตกจากวิถีโปรเจกไทล์จริง (ค่าสเปกเดียวกับตอนทุ่ม) แล้ววางเครื่องหมาย + ไว้ตรงนั้น */
  VehicleGrabController.prototype._updateMarker = function(held, player){
    const marker = this._ensureMarker();
    if(!marker) return;
    const spec = held && held.THROW_SPEC;
    if(!held || !player || !spec){
      marker.visible = false;
      return;
    }
    const fwd = player.forward ? player.forward() : {x: 0, z: 1};
    const sx = held.root ? held.root.position.x : (player.x || 0);
    const sz = held.root ? held.root.position.z : (player.z || 0);
    const y0 = Math.max(0.2, spec.y0 || 1.5);
    const tHit = (spec.up + Math.sqrt(spec.up * spec.up + 2 * spec.grav * y0)) / spec.grav;
    const half = (this.arena ? this.arena.half : 280) - (spec.wallInset != null ? spec.wallInset : 3);
    const lx = VF.clamp(sx + fwd.x * spec.h * tHit, -half, half);
    const lz = VF.clamp(sz + fwd.z * spec.h * tHit, -half, half);
    const gy = this.arena && this.arena.groundY ? this.arena.groundY(lx, lz) : 0;
    const pulse = 1 + Math.sin(((VF.now ? VF.now() : 0) / 1000) * 6) * 0.14;
    marker.scale.setScalar(pulse);
    marker.position.set(lx, gy + 0.07, lz);
    marker.visible = true;
  };

  VehicleGrabController.prototype._hideMarker = function(){
    if(this._marker) this._marker.visible = false;
  };

  VehicleGrabController.prototype.vehicles = function(){
    const out = [];
    if(this.sedan && this.sedan.ready) out.push(this.sedan);
    if(this.tanker && this.tanker.ready) out.push(this.tanker);
    return out;
  };

  VehicleGrabController.prototype.carrying = function(){
    const list = this.vehicles();
    for(let i = 0; i < list.length; i++){
      if(list[i].state === 'carried') return list[i];
    }
    return null;
  };

  VehicleGrabController.prototype.nearest = function(player){
    if(!player || player.alive === false) return null;
    const list = this.vehicles();
    let best = null;
    for(let i = 0; i < list.length; i++){
      const v = list[i];
      if(!v.canGrab || !v.canGrab(player)) continue;
      const d = VF._t.tankerPointDistance ? VF._t.tankerPointDistance(player.x || 0, player.z || 0, v.collider) : 0;
      if(!best || d < best.d) best = {veh: v, d: d};
    }
    return best;
  };

  /* รอบ 1570: ทุ่มของที่แบกอยู่ — เรียกจากปุ่ม THROW (ตอนแบกอยู่) หรือคีย์ G */
  VehicleGrabController.prototype.throw = function(player, cam, fx, audio, hud, requestTankerHit, hasNet){
    const held = this.carrying();
    if(!held || !player || player.alive === false) return false;
    const fwd = player.forward ? player.forward() : {x: 0, z: 1};
    if(player.playAction) player.playAction('throw');
    if(audio && audio.punchWhoosh) audio.punchWhoosh();
    player.carrying = null;
    this._hideMarker();
    if(held === this.tanker){
      if(hasNet && requestTankerHit){
        /* ส่งให้ host ตัดสินแล้วประกาศ event — applyEvent เคลียร์สถานะ carried ให้เอง */
        requestTankerHit({kind: 'throw', x: player.x || 0, z: player.z || 0, dx: fwd.x, dz: fwd.z, grab: 1});
      }else if(held.throwBy){
        held.throwBy(player, fwd.x, fwd.z);
      }
    }else if(held.throwBy){
      held.throwBy(player, fwd.x, fwd.z);
    }
    if(hud && hud.toast) hud.toast('🚀 THROW! ทุ่มแล้ว!');
    /* รอบ 1571: ซ่อนปุ่มทันทีที่ทุ่ม — ไม่พึ่งบรรทัดประจำเฟรมอย่างเดียว */
    if(hud && hud.setCarrying) hud.setCarrying(false);
    return true;
  };

  /* รอบ 1575: กด LIFT (ปุ่ม throw ตอนยังไม่ได้แบก หรือคีย์ G) — ยกเท่านั้น คืน true ถ้ายกสำเร็จ */
  VehicleGrabController.prototype.onLift = function(player, cam, fx, audio, hud){
    if(!player || player.alive === false) return false;
    if(this.carrying()) return false;
    const near = this.nearest(player);
    if(!near) return false;
    if(near.veh.grab && near.veh.grab(player)){
      player.carrying = near.veh;
      if(player.playAction) player.playAction('lift');
      if(audio && audio.punchWhoosh) audio.punchWhoosh();
      if(hud && hud.toast) hud.toast('🖐 ยกแล้ว! กด THROW เพื่อขว้าง');
      /* โชว์ปุ่ม THROW ทันทีที่ยกสำเร็จ — ไม่พึ่งบรรทัดประจำเฟรมอย่างเดียว */
      if(hud && hud.setCarrying) hud.setCarrying(true);
      return true;
    }
    return false;
  };

  VehicleGrabController.prototype.tick = function(dt, player, ctx){
    ctx = ctx || {};
    this._tickCombo(dt);
    const held = this.carrying();
    if(held){
      if(!player || player.alive === false){
        /* ตายระหว่างแบก — วางของลง + เคลียร์คอมโบ */
        this._combo = null;
        if(player) player.carrying = null;
        if(ctx.hud && ctx.hud.setCarrying) ctx.hud.setCarrying(false);
        this._hideMarker();
        if(held.drop) held.drop();
        else{
          held.state = 'idle';
          held.carrier = null;
          if(held._updateCollider) held._updateCollider();
        }
        return;
      }
      /* รอบ 1573: กันสถานะค้าง — ถ้าผู้เล่นถืออยู่แต่รถหลุดจาก carried (เคยเจอรถจมพื้นทั้งที่ปุ่ม THROW โชว์)
         ให้ยืนยันสถานะใหม่แล้วเรียก carryTick ที่นี่โดยตรง รับประกันรถลอยเหนือมือทั้งสองคัน */
      if(player.carrying === held && held.state !== 'carried'){
        held.state = 'carried';
        held.carrier = player;
      }
      if(held.carryTick) held.carryTick(dt, player);
      /* รอบ 1584: โชว์เครื่องหมาย + พิกัดตกตลอดที่ยกค้าง */
      this._updateMarker(held, player);
      return;
    }
    this._hideMarker();
    /* ป้ายเตือนเมื่อเดินเข้าใกล้ยานพาหนะ */
    if(player && player.alive !== false && ctx.hud && ctx.hud.toast){
      const near = this.nearest(player);
      if(near && !this._promptShown){
        this._promptShown = true;
        ctx.hud.toast('🖐 กด LIFT เพื่อยก ' + (near.veh === this.tanker ? 'รถน้ำมัน' : 'รถยนต์'));
      }else if(!near){
        this._promptShown = false;
      }
    }
  };

  VF.VehicleGrabController = VehicleGrabController;
})(typeof window !== 'undefined' ? window : globalThis);
