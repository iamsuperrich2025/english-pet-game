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

  AimMarkers.prototype.attach = function(scene){
    const THREE = root.THREE;
    this.group = new THREE.Group();
    this.group.name = 'VFAimMarkers';
    scene.add(this.group);
    this.slam = this._makeMarker(THREE, 0x4ec4ff, 1.15);
    this.attack = this._makeMarker(THREE, 0xff9040, 0.7);
    this.group.add(this.slam);
    this.group.add(this.attack);
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

  /* รอบ 1608: วาง reticle เหนือหัวเป้าที่ล็อก — หันหน้าเข้ากล้อง หายใจเบา ๆ
     (ทิศยิงจริงคำนวณที่ combat/target-lock.js + runtime ไม่ใช่ตรงนี้) */
  AimMarkers.prototype.update = function(player, arena){
    if(!this.group) return;
    const lv = VF._t.lockView;
    if(!lv || !player || player.alive === false || player.isDashing && player.isDashing()){
      if(this.slam) this.slam.visible = false;
      if(this.attack) this.attack.visible = false;
      return;
    }
    const pulse = 0.5 + 0.5 * Math.sin(this._t * 4.2);
    const m = this.slam;
    if(m){
      m.visible = true;
      m.position.set(lv.x, (lv.y || 0) + 2.15, lv.z);
      /* ตั้งตั้งฉาก (ไม่ราบ) แล้วหมุนเข้าหากล้องตาม yaw */
      if(m.rotation.x !== 0){ m.rotation.set(0, 0, 0); }
      m.rotation.y = lv.camYaw || 0;
      const s = 0.9 + 0.14 * pulse;
      m.scale.set(s, s, 1);
      if(m.userData.mat) m.userData.mat.opacity = 0.66 + 0.3 * pulse;
    }
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
    }
  };

  AimMarkers.prototype.dispose = function(){
    if(this.slam && this.slam.userData.mat && this.slam.userData.mat.dispose) this.slam.userData.mat.dispose();
    if(this.attack && this.attack.userData.mat && this.attack.userData.mat.dispose) this.attack.userData.mat.dispose();
    if(this.group && this.group.parent) this.group.parent.remove(this.group);
    this.group = null;
    this.slam = null;
    this.attack = null;
  };

  VF.AimMarkers = AimMarkers;
})(typeof window !== 'undefined' ? window : globalThis);
