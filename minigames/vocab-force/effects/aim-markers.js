"use strict";
/* รอบ 1590: เครื่องหมาย + บนพื้นบอกทิศทางพลัง — สีฟ้า = ทิศเส้นเปลวเพลิง SLAM (ยาวตาม slamLineLength)
   สีส้ม = ทิศพลังปุ่ม ATTACK (ระยะหมัด) · วางราบบนพื้น หายใจเบา ๆ ซ่อนอัตโนมัติตอนตาย/ชมเพื่อน */
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

  /* วางมาร์กเกอร์ตามทิศหน้าตัวละคร — ฟ้า: ปลายแนวเส้น SLAM · ส้ม: ระยะหมัด ATTACK */
  AimMarkers.prototype.update = function(player, arena){
    if(!this.group) return;
    if(!player || player.alive === false || player.isDashing && player.isDashing()){
      if(this.slam) this.slam.visible = false;
      if(this.attack) this.attack.visible = false;
      return;
    }
    const half = (VF.ARENA_HALF || 280) - 3;
    const clampV = function(v){ return VF.clamp(v, -half, half); };
    const yAt = function(x, z){
      return (arena && arena.surfaceY ? arena.surfaceY(x, z) : (player.y || 0)) + 0.07;
    };
    const f = player.forward();
    const slamLen = VF._t.slamLineLength ? VF._t.slamLineLength() : 23;
    const sx = clampV(player.x + f.x * slamLen), sz = clampV(player.z + f.z * slamLen);
    const atkTune = VF.CombatTune && VF.CombatTune.attack ? VF.CombatTune.attack('punch') : {range: 1.92};
    const atkLen = (atkTune.range || 1.92) + 0.9;
    const ox = clampV(player.x + f.x * atkLen), oz = clampV(player.z + f.z * atkLen);
    const pulse = 0.5 + 0.5 * Math.sin(this._t * 3.4);
    this._place(this.slam, sx, yAt(sx, sz), sz, pulse);
    this._place(this.attack, ox, yAt(ox, oz), oz, 1 - pulse);
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
