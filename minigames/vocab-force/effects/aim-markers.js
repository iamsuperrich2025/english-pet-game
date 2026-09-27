"use strict";
/* รอบ 1590: เครื่องหมาย + บนพื้นบอกทิศทางพลัง — สีฟ้า = ทิศเส้นเปลวเพลิง SLAM (ยาวตาม slamLineLength)
   สีส้ม = ทิศพลังปุ่ม ATTACK (ระยะหมัด)
   รอบ 1608: เปลี่ยนเป็น "reticle ล็อกเป้าหมาย" — แทนลูกศรเลื่อนบนพื้น ตอนนี้วางเครื่องหมาย
   เหนือหัว "เป้าที่ล็อก" (VF._t.lockView จาก combat/target-lock.js ผ่าน runtime) หันหน้าเข้ากล้อง
   หายใจเบา ๆ ซ่อนอัตโนมัติตอนตาย/ชมเพื่อน/ไม่มีเป้าล็อก */
(function(root){
  const VF = root.VocabForce = root.VocabForce || {};

  function AimMarkers(){
    this.group = null;
    this.slam = null;
    this.attack = null;
    this.lock = null;   /* รอบ 1609: reticle ล็อกเป้าหมายแบบชัดเจน (วงแหวน+กากบาท+หัวลูกศร) */
    this._t = 0;
  }

  AimMarkers.prototype._makeMarker = function(THREE, color, size){
    const g = new THREE.Group();
    const mat = new THREE.MeshBasicMaterial({
      color: color, transparent: true, opacity: 0.85,
      depthWrite: false, side: THREE.DoubleSide, fog: false
    });
    const barGeo = new THREE.PlaneGeometry(size, size * 0.22);
    const barA = new THREE.Mesh(barGeo, mat);
    const barB = new THREE.Mesh(barGeo, mat);
    barB.rotation.z = Math.PI / 2;
    g.add(barA, barB);
    g.rotation.x = -Math.PI / 2; /* วางราบบนพื้น */
    g.userData.mat = mat;
    g.userData.size = size;
    g.visible = false;
    return g;
  };

  /* รอบ 1609: สัญลักษณ์ "กำลังล็อกตัวนี้อยู่" แบบชัด ๆ — วงแหนวหมุน + กากบาทกลาง + หัวลูกศรชี้ลง
     สว่างเต็มที่ ทะลุสิ่งกีดขวาง (depthTest ปิด) มองเห็นแน่นอนแม้เป้าอยู่หลังกำแพง/ในอาคาร */
  AimMarkers.prototype._makeLockReticle = function(THREE){
    const g = new THREE.Group();
    const mat = new THREE.MeshBasicMaterial({
      color: 0x5fd7ff, transparent: true, opacity: 1,
      depthWrite: false, depthTest: false, side: THREE.DoubleSide, fog: false
    });
    const ring = new THREE.Mesh(new THREE.RingGeometry(0.52, 0.7, 28), mat);
    /* กากบาทกลางวง */
    const barGeo = new THREE.PlaneGeometry(0.62, 0.1);
    const barA = new THREE.Mesh(barGeo, mat);
    const barB = new THREE.Mesh(barGeo, mat);
    barB.rotation.z = Math.PI / 2;
    /* หัวลูกศรชี้ลงเหนือวง (สองแฉก) */
    const chevGeo = new THREE.PlaneGeometry(0.34, 0.09);
    const chevA = new THREE.Mesh(chevGeo, mat);
    chevA.position.set(-0.14, 0.98, 0);
    chevA.rotation.z = -0.72;
    const chevB = new THREE.Mesh(chevGeo, mat);
    chevB.position.set(0.14, 0.98, 0);
    chevB.rotation.z = 0.72;
    g.add(ring, barA, barB, chevA, chevB);
    g.userData.mat = mat;
    g.userData.ring = ring;
    g.renderOrder = 999;
    g.visible = false;
    return g;
  };

  AimMarkers.prototype.attach = function(scene){
    const THREE = root.THREE;
    this.group = new THREE.Group();
    this.group.name = 'VFAimMarkers';
    scene.add(this.group);
    this.slam = this._makeMarker(THREE, 0x4ec4ff, 1.15);
    this.attack = this._makeMarker(THREE, 0xff9040, 0.7);
    this.lock = this._makeLockReticle(THREE);
    this.group.add(this.slam);
    this.group.add(this.attack);
    this.group.add(this.lock);
    return this;
  };

  AimMarkers.prototype._place = function(marker, x, y, z, pulse){
    if(!marker) return;
    marker.visible = true;
    marker.position.set(x, y, z);
    const s = 1 + 0.1 * pulse;
    marker.scale.set(s, s, 1);
    if(marker.userData.mat) marker.userData.mat.opacity = 0.68 + 0.22 * pulse;
  };

  /* รอบ 1608/1609: วางสัญลักษณ์ล็อกเหนือหัวเป้า — หันหน้าเข้ากล้อง วงแหวนหมุน กะพริบชัด
     (ทิศยิงจริงคำนวณที่ combat/target-lock.js + runtime ไม่ใช่ตรงนี้) */
  AimMarkers.prototype.update = function(player, arena){
    if(!this.group) return;
    const lv = VF._t.lockView;
    if(!lv || !player || player.alive === false || player.isDashing && player.isDashing()){
      if(this.slam) this.slam.visible = false;
      if(this.attack) this.attack.visible = false;
      if(this.lock) this.lock.visible = false;
      return;
    }
    const pulse = 0.5 + 0.5 * Math.sin(this._t * 5.2);
    const m = this.lock;
    if(m){
      m.visible = true;
      m.position.set(lv.x, (lv.y || 0) + 2.3, lv.z);
      m.rotation.y = lv.camYaw || 0;
      if(m.userData.ring) m.userData.ring.rotation.z = this._t * 2.4;
      const s = 1.02 + 0.2 * pulse;
      m.scale.set(s, s, 1);
      if(m.userData.mat) m.userData.mat.opacity = 0.82 + 0.18 * pulse;
    }
    if(this.slam) this.slam.visible = false;
    if(this.attack) this.attack.visible = false;
  };

  AimMarkers.prototype.tick = function(dt){
    this._t += dt;
  };

  AimMarkers.prototype.setVisible = function(on){
    if(this.group) this.group.visible = !!on;
    if(!on){
      if(this.slam) this.slam.visible = false;
      if(this.attack) this.attack.visible = false;
      if(this.lock) this.lock.visible = false;
    }
  };

  AimMarkers.prototype.dispose = function(){
    if(this.slam && this.slam.userData.mat && this.slam.userData.mat.dispose) this.slam.userData.mat.dispose();
    if(this.attack && this.attack.userData.mat && this.attack.userData.mat.dispose) this.attack.userData.mat.dispose();
    if(this.lock){
      if(this.lock.userData.mat && this.lock.userData.mat.dispose) this.lock.userData.mat.dispose();
      this.lock.traverse ? this.lock.traverse(function(o){
        if(o.geometry && o.geometry.dispose) o.geometry.dispose();
      }) : null;
    }
    if(this.group && this.group.parent) this.group.parent.remove(this.group);
    this.group = null;
    this.slam = null;
    this.attack = null;
    this.lock = null;
  };

  VF.AimMarkers = AimMarkers;
})(typeof window !== 'undefined' ? window : globalThis);
