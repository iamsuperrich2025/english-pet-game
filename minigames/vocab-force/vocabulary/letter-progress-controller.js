"use strict";
/* Personal letter bag. Any pickup counts; death drops the current life. */
(function(root){
  const VF = root.VocabForce = root.VocabForce || {};

  function LetterProgressController(word, thai){
    this.reset(word, thai);
  }

  LetterProgressController.prototype.reset = function(word, thai){
    this.word = String(word || 'APPLE').toUpperCase().replace(/[^A-Z]/g, '') || 'APPLE';
    this.thai = thai || '';
    this.bag = [];
    this.slots = this.word.split('').map(function(){ return false; });
    this.index = 0;
    this.complete = false;
    this._cover();
    return this;
  };

  LetterProgressController.prototype.dropLife = function(){
    this.bag = [];
    this.complete = false;
    this._cover();
    return this;
  };

  LetterProgressController.prototype._needCounts = function(){
    const need = {};
    this.word.split('').forEach(function(ch){ need[ch] = (need[ch] || 0) + 1; });
    return need;
  };

  LetterProgressController.prototype._cover = function(){
    const used = {};
    this.slots = this.word.split('').map(function(ch){
      used[ch] = (used[ch] || 0) + 1;
      let have = 0;
      for(let i = 0; i < this.bag.length; i++){
        if(this.bag[i] === ch) have++;
      }
      return have >= used[ch];
    }, this);
    this.index = this.slots.findIndex(function(on){ return !on; });
    if(this.index < 0) this.index = this.word.length;
    this.complete = this.word.length > 0 && this.slots.every(Boolean);
    return this.complete;
  };

  LetterProgressController.prototype.required = function(){
    if(this.complete) return null;
    return this.word.charAt(this.index) || null;
  };

  LetterProgressController.prototype.display = function(){
    return this.word.split('').map(function(ch, i){
      return this.slots[i] ? ch : '_';
    }, this).join(' ');
  };

  LetterProgressController.prototype.bagText = function(){
    return this.bag.join(' ');
  };

  LetterProgressController.prototype.collect = function(letter){
    const ch = String(letter || '').slice(0, 1).toUpperCase();
    if(!/[A-Z]/.test(ch)) return {ok: false, complete: this.complete, reason: 'empty'};
    if(this.complete){
      this.bag.push(ch);
      return {ok: true, complete: true, letter: ch, reason: 'extra', bag: this.bag.length};
    }
    this.bag.push(ch);
    this._cover();
    return {ok: true, complete: this.complete, letter: ch, bag: this.bag.length, index: this.index};
  };

  VF.LetterProgressController = LetterProgressController;
  VF._t.makeProgress = function(word, thai){ return new LetterProgressController(word, thai); };
})(typeof window !== 'undefined' ? window : globalThis);
