"use strict";
/* Hold-charge light storm around the player. Visual only; crates live on the arena. */
(function(root){
  const VF = root.VocabForce = root.VocabForce || {};

  function EnergyVortexManager(){
    this.group = null;
    this.rings = [];
    this.sparks = [];
    this.streaks = [];
    this.floor = null;
    this.on = false;
    this.ang = 0;
    this.frac = 0;
  }

  EnergyVortexManager.prototype.attach = function(scene){
    const THREE = root.THREE;
    const T = VF.EnergyAttackTune || {};
    this.group = new THREE.Group();
    this.group.name = 'VFEnergyVortex';
    this.group.visible = false;
    this.ringGeo = new THREE.TorusGeometry(1.08, 0.028, 5, 18);
    this.sparkGeo = new THREE.BoxGeometry(0.05, 0.05, 0.05);
    this.streakGeo = new THREE.BoxGeometry(0.035, 0.035, 0.58);
    this.floorGeo = new THREE.RingGeometry(0.35, 1.55, 22);
    const ringN = T.vortexRingCount || 3;
    for(let i = 0; i < ringN; i++){
      const mat = new THREE.MeshBasicMaterial({color: 0x9bfff0, transparent: true, opacity: 0.45, depthWrite: false});
      const mesh = new THREE.Mesh(this.ringGeo, mat);
      mesh.frustumCulled = false;
      this.group.add(mesh);
      this.rings.push(mesh);
    }
    this.floor = new THREE.Mesh(
      this.floorGeo,
      new THREE.MeshBasicMaterial({color: 0x7cffcf, transparent: true, opacity: 0.22, side: THREE.DoubleSide, depthWrite: false})
    );
    this.floor.rotation.x = -Math.PI / 2;
    this.floor.position.y = 0.05;
    this.floor.frustumCulled = false;
    this.group.add(this.floor);
    const sparkN = T.vortexSparkCount || 16;
    for(let i = 0; i < sparkN; i++){
      const mat = new THREE.MeshBasicMaterial({color: 0xffffff, transparent: true, opacity: 0.9, depthWrite: false});
      const mesh = new THREE.Mesh(this.sparkGeo, mat);
      mesh.frustumCulled = false;
      this.group.add(mesh);
      this.sparks.push({
        mesh: mesh,
        a: i / sparkN * Math.PI * 2,
        r: 0.7 + (i % 5) * 0.16,
        y: 0.35 + (i % 4) * 0.28,
        s: 0.7 + (i % 3) * 0.25
      });
    }
    const streakN = T.vortexStreakCount || 6;
    for(let i = 0; i < streakN; i++){
      const mat = new THREE.MeshBasicMaterial({color: 0xb8fff8, transparent: true, opacity: 0.55, depthWrite: false});
      const mesh = new THREE.Mesh(this.streakGeo, mat);
      mesh.frustumCulled = false;
      this.group.add(mesh);
      this.streaks.push({mesh: mesh, a: i / streakN * Math.PI * 2, r: 0.95 + (i % 3) * 0.18, y: 0.55 + (i % 2) * 0.5});
    }
    scene.add(this.group);
    return this;
  };

  EnergyVortexManager.prototype.set = function(on, player, pal, frac){
    this.frac = Math.max(0, Math.min(1, frac || 0));
    this.on = !!(on && this.frac > 0.04 && this.group);
    if(!this.group) return;
    this.group.visible = this.on;
    if(player) this.group.position.set(player.x || 0, player.y || 0, player.z || 0);
    if(!pal) return;
    for(let i = 0; i < this.rings.length; i++){
      this.rings[i].material.color.setHex(i === 1 ? pal.shell : pal.glow);
    }
    if(this.floor) this.floor.material.color.setHex(pal.trail);
    for(let i = 0; i < this.sparks.length; i++){
      const c = i % 3 === 0 ? pal.core : (i % 3 === 1 ? pal.glow : pal.trail);
      this.sparks[i].mesh.material.color.setHex(c);
    }
    for(let i = 0; i < this.streaks.length; i++){
      this.streaks[i].mesh.material.color.setHex(i % 2 ? pal.shell : pal.trail);
    }
  };

  EnergyVortexManager.prototype.tick = function(dt, player){
    if(!this.group) return;
    if(!this.on){
      this.group.visible = false;
      return;
    }
    if(player) this.group.position.set(player.x || 0, player.y || 0, player.z || 0);
    const f = this.frac;
    this.ang += dt * (2.4 + f * 6.8);
    const fade = 0.22 + 0.72 * f;
    for(let i = 0; i < this.rings.length; i++){
      const ring = this.rings[i];
      const dir = i % 2 ? -1 : 1;
      ring.rotation.y = this.ang * dir * (0.85 + i * 0.18);
      ring.rotation.x = 0.18 * Math.sin(this.ang * 0.7 + i) + i * 0.22;
      ring.rotation.z = 0.12 * Math.cos(this.ang * 0.55 + i);
      const sc = (0.72 + i * 0.22) * (0.82 + 0.45 * f);
      ring.scale.set(sc, sc, sc);
      ring.position.y = 0.42 + i * 0.48 + Math.sin(this.ang + i) * 0.06;
      ring.material.opacity = fade * (0.38 + 0.18 * i);
    }
    if(this.floor){
      this.floor.rotation.z = this.ang * 1.4;
      const fs = 0.85 + 0.55 * f;
      this.floor.scale.set(fs, fs, 1);
      this.floor.material.opacity = 0.12 + 0.28 * f;
    }
    for(let i = 0; i < this.sparks.length; i++){
      const s = this.sparks[i];
      const a = s.a + this.ang * (1.6 + (i % 3) * 0.35);
      const r = (s.r + 0.35 * f) * (1 + 0.08 * Math.sin(this.ang * 3 + i));
      const y = s.y * (0.7 + 0.9 * f) + 0.12 * Math.sin(this.ang * 4.2 + i);
      s.mesh.position.set(Math.cos(a) * r, y, Math.sin(a) * r);
      const tw = 0.55 + 0.7 * Math.abs(Math.sin(this.ang * 9 + i * 1.7));
      const sc = s.s * tw * (0.7 + 0.8 * f);
      s.mesh.scale.set(sc, sc, sc);
      s.mesh.material.opacity = 0.35 + 0.65 * tw * f;
      s.mesh.rotation.y = a;
    }
    for(let i = 0; i < this.streaks.length; i++){
      const s = this.streaks[i];
      const a = s.a - this.ang * 2.1;
      const r = s.r * (0.9 + 0.4 * f);
      s.mesh.position.set(Math.cos(a) * r, s.y * (0.8 + 0.5 * f), Math.sin(a) * r);
      s.mesh.rotation.set(0.2, -a, 0.9);
      s.mesh.material.opacity = 0.2 + 0.5 * f;
    }
  };

  EnergyVortexManager.prototype.dispose = function(){
    if(this.group && this.group.parent) this.group.parent.remove(this.group);
    this.group = null;
    this.rings = [];
    this.sparks = [];
    this.streaks = [];
    this.floor = null;
  };

  VF.EnergyVortexManager = EnergyVortexManager;
})(typeof window !== 'undefined' ? window : globalThis);
