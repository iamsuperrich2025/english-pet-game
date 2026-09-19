"use strict";
/* Shared world-space HP bars. Green/yellow/red by remaining HP. No image downloads. */
(function(root){
  const VF = root.VocabForce = root.VocabForce || {};
  const W = 1.18, H = 0.13, FILL_W = 1.06, FILL_H = 0.07;
  let trackGeo = null, fillGeo = null, shineGeo = null;
  let trackMat = null, shineMat = null;
  const fillMats = {};

  function band(frac){
    const f = VF.clamp(frac == null ? 1 : frac, 0, 1);
    if(f > 0.6) return 'green';
    if(f > 0.3) return 'yellow';
    return 'red';
  }

  function bandColor(name){
    if(name === 'green') return 0x3ee07a;
    if(name === 'yellow') return 0xffd24a;
    return 0xff4d5a;
  }

  function ensure(THREE){
    if(trackGeo) return;
    trackGeo = new THREE.PlaneGeometry(W, H);
    fillGeo = new THREE.PlaneGeometry(FILL_W, FILL_H);
    shineGeo = new THREE.PlaneGeometry(FILL_W * 0.72, FILL_H * 0.28);
    trackMat = new THREE.MeshBasicMaterial({
      color: 0x070b14, transparent: true, opacity: 0.82,
      depthWrite: false, side: THREE.DoubleSide
    });
    shineMat = new THREE.MeshBasicMaterial({
      color: 0xffffff, transparent: true, opacity: 0.28,
      depthWrite: false, side: THREE.DoubleSide
    });
    ['green', 'yellow', 'red'].forEach(function(name){
      fillMats[name] = new THREE.MeshBasicMaterial({
        color: bandColor(name), transparent: true, opacity: 0.96,
        depthWrite: false, side: THREE.DoubleSide
      });
    });
  }

  function HealthBar(opts){
    opts = opts || {};
    const THREE = root.THREE;
    ensure(THREE);
    this.max = opts.max || 100;
    this.value = opts.value != null ? opts.value : this.max;
    this.offsetY = opts.y != null ? opts.y : 2.15;
    this.group = new THREE.Group();
    this.group.name = 'VFHealthBar';
    this.track = new THREE.Mesh(trackGeo, trackMat);
    this.fill = new THREE.Mesh(fillGeo, fillMats.green);
    this.shine = new THREE.Mesh(shineGeo, shineMat);
    this.rim = new THREE.Mesh(trackGeo, new THREE.MeshBasicMaterial({
      color: 0xd4b56a, transparent: true, opacity: 0.55,
      depthWrite: false, side: THREE.DoubleSide
    }));
    this.rim.scale.set(1.08, 1.55, 1);
    this.rim.position.z = -0.004;
    this.track.position.z = 0;
    this.fill.position.z = 0.004;
    this.shine.position.set(0, 0.018, 0.006);
    this.group.add(this.rim, this.track, this.fill, this.shine);
    this.group.position.y = this.offsetY;
    this._band = 'green';
    this.set(this.value, this.max);
  }

  HealthBar.prototype.set = function(value, max){
    this.max = Math.max(1, max || this.max || 100);
    this.value = VF.clamp(value == null ? this.max : value, 0, this.max);
    const frac = this.value / this.max;
    const name = band(frac);
    if(name !== this._band){
      this._band = name;
      this.fill.material = fillMats[name];
    }
    this.fill.scale.x = Math.max(0.001, frac);
    this.fill.position.x = (frac - 1) * FILL_W * 0.5;
    this.shine.scale.x = Math.max(0.001, frac * 0.86);
    this.shine.position.x = (frac - 1) * FILL_W * 0.42;
    this.group.visible = this.value > 0;
    return name;
  };

  HealthBar.prototype.billboard = function(camera){
    if(!this.group || !camera || !camera.quaternion) return;
    this.group.quaternion.copy(camera.quaternion);
  };

  HealthBar.prototype.follow = function(x, y, z, camera){
    if(!this.group) return;
    this.group.position.set(x || 0, (y || 0) + this.offsetY, z || 0);
    this.billboard(camera);
  };

  HealthBar.prototype.attach = function(parent){
    if(parent && this.group) parent.add(this.group);
    return this;
  };

  HealthBar.prototype.dispose = function(){
    if(this.group && this.group.parent) this.group.parent.remove(this.group);
  };

  VF.HealthBar = HealthBar;
  VF._t.hpBand = band;
  VF._t.hpColor = bandColor;
})(typeof window !== 'undefined' ? window : globalThis);
