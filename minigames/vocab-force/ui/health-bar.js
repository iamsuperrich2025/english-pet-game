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

  /* รอบ 1603: ป้ายชื่อผู้เล่นเหนือหัว — sprite ตัวหนังสือขาวพื้นหลังโปร่ง
     (THREE.Sprite หันหน้าเข้ากล้องเองในเวิลด์สเปซ แนบใต้ pivot ที่หมุนตาม yaw ได้เลย) */
  const TAG_H = 0.5;
  const TAG_FONT = '700 34px Kanit, "Segoe UI", sans-serif';
  function rr(ctx, x, y, w, h, r){
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.arcTo(x + w, y, x + w, y + r, r);
    ctx.lineTo(x + w, y + h - r);
    ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
    ctx.lineTo(x + r, y + h);
    ctx.arcTo(x, y + h, x, y + h - r, r);
    ctx.lineTo(x, y + r);
    ctx.arcTo(x, y, x + r, y, r);
    ctx.closePath();
  }
  function NameTag(name, opts){
    opts = opts || {};
    const THREE = root.THREE;
    this.offsetY = opts.y != null ? opts.y : 2.58;
    this.sprite = new THREE.Sprite(new THREE.SpriteMaterial({ transparent: true, depthWrite: false }));
    this.sprite.name = 'VFNameTag';
    this.sprite.position.y = this.offsetY;
    this._text = null;
    this.setText(name || 'ผู้เล่น');
  }
  NameTag.prototype.setText = function(name){
    name = String(name == null ? '' : name).slice(0, 18) || 'ผู้เล่น';
    if(name === this._text) return;
    this._text = name;
    const doc = root.document;
    if(!doc) return;
    const canvas = doc.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if(!ctx) return;
    const ch = 56, padX = 26;
    ctx.font = TAG_FONT;
    const tw = Math.ceil(ctx.measureText(name).width);
    canvas.width = Math.max(96, Math.min(460, tw + padX * 2));
    canvas.height = ch;
    ctx.font = TAG_FONT;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    rr(ctx, 1.5, 1.5, canvas.width - 3, ch - 3, 15);
    ctx.fillStyle = 'rgba(8,12,26,0.66)';
    ctx.fill();
    ctx.lineWidth = 2.5;
    ctx.strokeStyle = 'rgba(255,255,255,0.30)';
    ctx.stroke();
    ctx.lineJoin = 'round';
    ctx.lineWidth = 6;
    ctx.strokeStyle = 'rgba(4,8,18,0.92)';
    ctx.strokeText(name, canvas.width / 2, ch / 2 + 1);
    ctx.fillStyle = '#ffffff';
    ctx.fillText(name, canvas.width / 2, ch / 2 + 1);
    const THREE = root.THREE;
    if(this.sprite.material.map) this.sprite.material.map.dispose();
    const tex = new THREE.CanvasTexture(canvas);
    if(THREE.sRGBEncoding != null) tex.encoding = THREE.sRGBEncoding;
    this.sprite.material.map = tex;
    this.sprite.material.needsUpdate = true;
    this.sprite.scale.set((canvas.width / ch) * TAG_H, TAG_H, 1);
  };
  NameTag.prototype.dispose = function(){
    if(this.sprite.material.map) this.sprite.material.map.dispose();
    this.sprite.material.dispose();
    if(this.sprite.parent) this.sprite.parent.remove(this.sprite);
  };

  VF.HealthBar = HealthBar;
  VF.NameTag = NameTag;
  VF._t.hpBand = band;
  VF._t.hpColor = bandColor;
})(typeof window !== 'undefined' ? window : globalThis);
