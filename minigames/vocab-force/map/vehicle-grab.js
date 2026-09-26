"use strict";
/* รอบ 1567/1575: ผู้ประสานงานจับยก-ทุ่มยานพาหนะ — ปุ่ม LIFT/THROW (หรือคีย์ G): กดเพื่อยกเมื่อยังไม่ได้ยก กดเพื่อทุ่มเมื่อยกแล้ว
   ปุ่ม KICK เตะอย่างเดียวตั้งแต่รอบ 1575 ไม่เกี่ยวข้องกับการยกแล้ว
   รถยนต์: โดนทุ่มใส่ใคร คนนั้นพลัง -100 (VF.SEDAN_DAMAGE) · รถน้ำมัน: ปะทะสิ่งใดระเบิด ทุกตัว -500 (VF.TANKER_DAMAGE) */
(function(root){
  const VF = root.VocabForce = root.VocabForce || {};

  function VehicleGrabController(opts){
    opts = opts || {};
    this.sedan = opts.sedan || null;
    this.tanker = opts.tanker || null;
    this.arena = opts.arena || null;
    this._markerScene = opts.scene || null;
    this._marker = null;
    this._toastAt = 0;
    this._promptShown = false;
  }

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
    const held = this.carrying();
    if(held){
      if(!player || player.alive === false){
        /* ตายระหว่างแบก — วางของลง */
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
