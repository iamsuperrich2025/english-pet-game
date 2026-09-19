"use strict";
/* Round flow + central coin payout. Does not invent a second wallet. */
(function(root){
  const VF = root.VocabForce = root.VocabForce || {};

  function VocabularyRoundController(){
    this.progress = new VF.LetterProgressController('APPLE', 'แอปเปิล');
    this.wordsDone = 0;
    this.sessionCoins = 0;
    this.paid = 0;
    this.lastWord = '';
    this.seed = 1;
  }

  VocabularyRoundController.prototype.start = function(preferred){
    const pair = preferred || VF.WordList.next(this.lastWord);
    this.progress.reset(pair.w, pair.th);
    this.lastWord = pair.w;
    this.seed = preferred && preferred.seed != null ? preferred.seed : ((this.seed || 0) + 1 + ((Math.random() * 997) | 0));
    return this.progress;
  };

  VocabularyRoundController.prototype.onLetter = function(letter){
    return this.progress.collect(letter);
  };

  VocabularyRoundController.prototype.dropLife = function(){
    if(this.progress && this.progress.dropLife) this.progress.dropLife();
    return this.progress;
  };

  VocabularyRoundController.prototype.creditIfComplete = function(playerCount){
    if(!this.progress.complete) return 0;
    const reward = VF._t.wordReward ? VF._t.wordReward(playerCount) : VF.LETTER_REWARD;
    this.wordsDone += 1;
    this.sessionCoins += reward;
    if(typeof addCoins === 'function'){
      addCoins(reward);
      this.paid += reward;
      if(typeof questEvent === 'function') questEvent('word3d');
      if(typeof saveState === 'function') saveState();
      if(typeof authPushSave === 'function') authPushSave(false);
    }else{
      VF._previewCoins = (VF._previewCoins || 0) + reward;
      this.paid += reward;
    }
    return reward;
  };

  VocabularyRoundController.prototype.settle = function(){
    const amount = Math.max(0, this.sessionCoins - this.paid);
    if(amount && typeof addCoins === 'function'){
      addCoins(amount);
      this.paid += amount;
      if(typeof saveState === 'function') saveState();
      if(typeof authPushSave === 'function') authPushSave(false);
    }else if(amount){
      this.paid += amount;
      VF._previewCoins = (VF._previewCoins || 0) + amount;
    }
    return amount;
  };

  VocabularyRoundController.prototype.walletCoins = function(){
    if(typeof state !== 'undefined' && state) return Number(state.coins) || 0;
    return Number(VF._previewCoins) || 0;
  };

  VF.VocabularyRoundController = VocabularyRoundController;
})(typeof window !== 'undefined' ? window : globalThis);
