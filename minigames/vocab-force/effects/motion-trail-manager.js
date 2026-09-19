"use strict";
/* Short-lived punch/kick/body motion trails. Cleared when the attack ends. */
(function(root){
  const VF = root.VocabForce = root.VocabForce || {};
  const N = 10;

  function makeLine(THREE, color){
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(N * 3), 3));
    geo.setDrawRange(0, 0);
    const mat = new THREE.LineBasicMaterial({
      color: color,
      transparent: true,
      opacity: 0.9,
      depthWrite: false
    });
    const line = new THREE.Line(geo, mat);
    line.frustumCulled = false;
    line.visible = false;
    line.userData.pts = [];
    return line;
  }

  function findBone(root, names){
    let found = null;
    if(!root || !root.traverse) return null;
    root.traverse(function(n){
      if(found || !n.name) return;
      for(let i = 0; i < names.length; i++){
        if(n.name === names[i] || n.name.indexOf(names[i]) >= 0){ found = n; return; }
      }
    });
    return found;
  }

  function MotionTrailManager(){
    this.group = null;
    this.player = null;
    this.hand = null;
    this.foot = null;
    this.handLine = null;
    this.footLine = null;
    this.bodyLine = null;
    this.active = '';
    this.until = 0;
    this._tmp = null;
  }

  MotionTrailManager.prototype.attach = function(scene){
    const THREE = root.THREE;
    this.group = new THREE.Group();
    this.group.name = 'VFMotionTrails';
    this.handLine = makeLine(THREE, 0xb8fff4);
    this.footLine = makeLine(THREE, 0xffe08a);
    this.bodyLine = makeLine(THREE, 0x9ad4ff);
    this.group.add(this.handLine, this.footLine, this.bodyLine);
    scene.add(this.group);
    this._tmp = new THREE.Vector3();
    return this;
  };

  MotionTrailManager.prototype.bind = function(player){
    this.player = player;
    const root = player && (player.model || player.pivot);
    this.hand = findBone(root, ['mixamorig:RightHand', 'mixamorigRightHand', 'RightHand']);
    this.foot = findBone(root, ['mixamorig:RightFoot', 'mixamorigRightFoot', 'RightFoot']);
    if(player) player.trails = this;
    return this;
  };

  MotionTrailManager.prototype.start = function(kind, seconds){
    this.active = kind || 'hand';
    this.until = VF.now() + Math.max(0.12, seconds || 0.4) * 1000;
    [this.handLine, this.footLine, this.bodyLine].forEach(function(line){
      line.userData.pts = [];
      line.visible = false;
      line.geometry.setDrawRange(0, 0);
    });
  };

  MotionTrailManager.prototype.stop = function(){
    this.active = '';
    this.until = 0;
    [this.handLine, this.footLine, this.bodyLine].forEach(function(line){
      if(!line) return;
      line.visible = false;
      line.userData.pts = [];
      line.geometry.setDrawRange(0, 0);
      if(line.material) line.material.opacity = 0;
    });
  };

  MotionTrailManager.prototype._push = function(line, x, y, z){
    if(!line) return;
    const pts = line.userData.pts;
    pts.push(x, y, z);
    while(pts.length > N * 3) pts.splice(0, 3);
    const arr = line.geometry.attributes.position.array;
    for(let i = 0; i < arr.length; i++) arr[i] = pts[i] != null ? pts[i] : 0;
    line.geometry.attributes.position.needsUpdate = true;
    line.geometry.setDrawRange(0, Math.floor(pts.length / 3));
    line.visible = pts.length >= 6;
    if(line.material) line.material.opacity = 0.88;
  };

  MotionTrailManager.prototype.tick = function(dt){
    if(!this.active) return;
    if(VF.now() > this.until){ this.stop(); return; }
    if(dt <= 0) return;
    const THREE = root.THREE;
    const tmp = this._tmp || (this._tmp = new THREE.Vector3());
    if((this.active === 'hand' || this.active === 'drive') && this.hand && this.hand.getWorldPosition){
      this.hand.getWorldPosition(tmp);
      this._push(this.handLine, tmp.x, tmp.y, tmp.z);
    }
    if((this.active === 'foot' || this.active === 'drive') && this.foot && this.foot.getWorldPosition){
      this.foot.getWorldPosition(tmp);
      this._push(this.footLine, tmp.x, tmp.y, tmp.z);
    }
    if(this.player && (this.active === 'drive' || this.active === 'hand' || this.active === 'foot')){
      this._push(this.bodyLine, this.player.x, this.player.y + 0.95, this.player.z);
    }
    [this.handLine, this.footLine, this.bodyLine].forEach(function(line){
      if(line && line.visible && line.material) line.material.opacity = Math.max(0.25, line.material.opacity - dt * 0.8);
    });
  };

  MotionTrailManager.prototype.dispose = function(){
    this.stop();
    [this.handLine, this.footLine, this.bodyLine].forEach(function(line){
      if(!line) return;
      if(line.geometry) line.geometry.dispose();
      if(line.material) line.material.dispose();
    });
  };

  VF.MotionTrailManager = MotionTrailManager;
})(typeof window !== 'undefined' ? window : globalThis);
