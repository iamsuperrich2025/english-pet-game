"use strict";
/* One AnimationMixer on the visible NEX body. States swap clips, not models. */
(function(root){
  const VF = root.VocabForce = root.VocabForce || {};

  function NexAnimationController(bodyRoot, manifest){
    const THREE = root.THREE;
    this.root = bodyRoot;
    this.manifest = manifest || VF.NexManifest;
    this.mixer = new THREE.AnimationMixer(bodyRoot);
    this.clips = {};
    this.actions = {};
    this.current = '';
    this.busyUntil = 0;
    this.ready = {};
    this._onFinished = this._onFinished.bind(this);
    this.mixer.addEventListener('finished', this._onFinished);
  }

  NexAnimationController.prototype._onFinished = function(ev){
    if(!ev || !ev.action) return;
    const state = ev.action.getClip() && this._stateOf(ev.action);
    if(state && this.current === state) this.current = '';
  };

  NexAnimationController.prototype._stateOf = function(action){
    const keys = Object.keys(this.actions);
    for(let i = 0; i < keys.length; i++){
      if(this.actions[keys[i]] === action) return keys[i];
    }
    return '';
  };

  NexAnimationController.prototype.addClip = function(state, clip){
    if(!clip) return false;
    this.clips[state] = clip;
    this.actions[state] = this.mixer.clipAction(clip);
    this.ready[state] = true;
    return true;
  };

  NexAnimationController.prototype.has = function(state){ return !!this.actions[state]; };

  NexAnimationController.prototype.isBusy = function(now){
    return (now || VF.now()) < this.busyUntil;
  };

  NexAnimationController.prototype.play = function(state, opts){
    opts = opts || {};
    const spec = (this.manifest && this.manifest.spec ? this.manifest.spec(state) : VF.NexManifest.spec(state)) || {};
    const action = this.actions[state];
    if(!action) return false;
    const now = VF.now();
    if(!opts.force && this.current === state && action.isRunning()) return true;
    if(!opts.force && this.isBusy(now) && spec.loop) return false;
    const fade = opts.fade != null ? opts.fade : (spec.fade || 0.12);
    const loop = opts.loop != null ? opts.loop : !!spec.loop;
    const THREE = root.THREE;
    action.reset();
    action.setLoop(loop ? THREE.LoopRepeat : THREE.LoopOnce, Infinity);
    action.clampWhenFinished = !loop;
    action.timeScale = opts.timeScale != null ? opts.timeScale : (spec.timeScale || 1);
    action.enabled = true;
    const prev = this.current && this.actions[this.current];
    if(prev && prev !== action && prev.isRunning()){
      action.crossFadeFrom(prev, fade, true);
    }else{
      action.fadeIn(Math.min(0.08, fade));
    }
    action.play();
    this.current = state;
    if(!loop && spec.busy) this.busyUntil = now + spec.busy * 1000;
    return true;
  };

  NexAnimationController.prototype.stop = function(state, fade){
    const action = this.actions[state];
    if(!action) return;
    action.fadeOut(fade || 0.12);
    if(this.current === state) this.current = '';
  };

  NexAnimationController.prototype.tick = function(dt){
    if(this.mixer) this.mixer.update(dt);
  };

  NexAnimationController.prototype.dispose = function(){
    if(this.mixer) this.mixer.stopAllAction();
  };

  VF.NexAnimationController = NexAnimationController;
})(typeof window !== 'undefined' ? window : globalThis);
