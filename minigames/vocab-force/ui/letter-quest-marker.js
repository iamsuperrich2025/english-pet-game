"use strict";
/* Screen arrow toward the next required letter. No extra 3D meshes. */
(function(root){
  const VF = root.VocabForce = root.VocabForce || {};

  VF._t.questAnchor = function(ndcX, ndcY, behind, w, h, pad){
    pad = pad == null ? 52 : pad;
    let nx = ndcX, ny = ndcY;
    if(behind){ nx = -nx; ny = -ny; }
    const on = !behind && nx > -0.86 && nx < 0.86 && ny > -0.66 && ny < 0.78;
    const sx = (nx * 0.5 + 0.5) * w;
    const sy = (-ny * 0.5 + 0.5) * h;
    const minx = pad, maxx = Math.max(pad + 8, w - pad);
    const miny = pad + 30, maxy = Math.max(miny + 8, h - pad - 18);
    if(on) return {x: sx, y: sy - 26, on: true, rot: 0};
    let px = VF.clamp(sx, minx, maxx);
    let py = VF.clamp(sy, miny, maxy);
    let dx = sx - px, dy = sy - py;
    if(Math.abs(dx) < 0.5 && Math.abs(dy) < 0.5){
      dx = sx - w * 0.5;
      dy = sy - h * 0.5;
    }
    return {x: px, y: py, on: false, rot: -Math.atan2(dx, dy)};
  };

  function LetterQuestMarker(){
    this.el = null;
    this.letterEl = null;
    this.arrowEl = null;
    this._v = null;
    this._fwd = null;
    this._to = null;
  }

  LetterQuestMarker.prototype.mount = function(root){
    const el = document.createElement('div');
    el.className = 'vf-quest';
    el.hidden = true;
    el.setAttribute('aria-hidden', 'true');
    el.innerHTML = '<b class="vf-quest-letter">A</b><i class="vf-quest-arrow"></i>';
    root.appendChild(el);
    this.el = el;
    this.letterEl = el.querySelector('.vf-quest-letter');
    this.arrowEl = el.querySelector('.vf-quest-arrow');
    return this;
  };

  LetterQuestMarker.prototype.hide = function(){
    if(this.el) this.el.hidden = true;
  };

  LetterQuestMarker.prototype.update = function(camera, enemy, letter, lib){
    const THREE = lib || root.THREE;
    if(!this.el || !camera || !enemy || !THREE || !THREE.Vector3){
      this.hide();
      return;
    }
    try{
      if(!this._v) this._v = new THREE.Vector3();
      const y = (enemy.y || 0) + (enemy.height || 1.8) + 0.85;
      if(camera.updateMatrixWorld) camera.updateMatrixWorld();
      this._v.set(enemy.x, y, enemy.z);
      if(camera.matrixWorldInverse) this._v.applyMatrix4(camera.matrixWorldInverse);
      const behind = this._v.z > 0;
      this._v.set(enemy.x, y, enemy.z).project(camera);
      const rootEl = this.el.closest('#vf-game') || this.el.parentNode;
      const w = (rootEl && rootEl.clientWidth) || window.innerWidth;
      const h = (rootEl && rootEl.clientHeight) || window.innerHeight;
      const a = VF._t.questAnchor(this._v.x, this._v.y, behind, w, h, 56);
      this.el.hidden = false;
      this.el.style.left = Math.round(a.x) + 'px';
      this.el.style.top = Math.round(a.y) + 'px';
      this.el.classList.toggle('is-on', a.on);
      this.el.classList.toggle('is-off', !a.on);
      this.el.style.transform = a.on ? 'translate(-50%,-100%)' : 'translate(-50%,-50%)';
      if(this.arrowEl) this.arrowEl.style.transform = a.on ? '' : ('rotate(' + (a.rot * 180 / Math.PI) + 'deg)');
      if(this.letterEl) this.letterEl.textContent = letter || '?';
    }catch(_){
      this.hide();
    }
  };

  VF.LetterQuestMarker = LetterQuestMarker;
})(typeof window !== 'undefined' ? window : globalThis);
