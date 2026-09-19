"use strict";
/* Pre-game character cards. PNGs only — no GLB load until START. */
(function(root){
  const VF = root.VocabForce = root.VocabForce || {};

  function CharacterSelect(){
    this.el = null;
    this.selected = null;
    this._resolve = null;
    this._onKey = this._onKey.bind(this);
  }

  CharacterSelect.prototype.mount = function(root){
    const wrap = document.createElement('div');
    wrap.className = 'vf-select';
    wrap.setAttribute('role', 'dialog');
    wrap.setAttribute('aria-label', 'เลือกตัวละคร');
    const roster = VF.PlayableRoster.all();
    wrap.innerHTML = '<div class="vf-select-inner">' +
      '<p class="vf-select-kicker">VOCAB FORCE</p>' +
      '<h2 class="vf-select-title">เลือกนักสู้</h2>' +
      '<p class="vf-select-sub">แตะการ์ด แล้วกด START</p>' +
      '<div class="vf-select-row"></div>' +
      '<button type="button" class="vf-select-start" disabled>START</button>' +
      '<button type="button" class="vf-select-exit">ออก</button>' +
      '</div>';
    const row = wrap.querySelector('.vf-select-row');
    roster.forEach(function(def){
      const card = document.createElement('button');
      card.type = 'button';
      card.className = 'vf-select-card';
      card.setAttribute('data-vf-char', def.id);
      card.innerHTML = '<span class="vf-select-art"><img alt=""></span>' +
        '<strong>' + def.displayName + '</strong>' +
        '<small>' + (def.subtitle || '') + '</small>' +
        '<em class="vf-select-picked">SELECTED</em>';
      const img = card.querySelector('img');
      img.alt = def.displayName;
      img.src = VF.PlayableRoster.previewUrl(def);
      row.appendChild(card);
    });
    root.appendChild(wrap);
    this.el = wrap;
    this.startBtn = wrap.querySelector('.vf-select-start');
    wrap.addEventListener('click', this._onClick.bind(this));
    wrap.addEventListener('pointerdown', function(){
      if(VF.audio && VF.audio.startBgm) VF.audio.startBgm();
    });
    if(VF.audio && VF.audio.startBgm) VF.audio.startBgm();
    const saved = VF.PlayableRoster.readSaved();
    if(saved) this.select(saved);
    return this;
  };

  CharacterSelect.prototype._onClick = function(ev){
    if(VF.audio && VF.audio.startBgm) VF.audio.startBgm();
    const exit = ev.target.closest('.vf-select-exit');
    if(exit){ this.finish(null); return; }
    const start = ev.target.closest('.vf-select-start');
    if(start){
      if(this.selected) this.finish(this.selected);
      return;
    }
    const card = ev.target.closest('.vf-select-card');
    if(card) this.select(card.getAttribute('data-vf-char'));
  };

  CharacterSelect.prototype._onKey = function(ev){
    if(!this.el || this.el.hidden) return;
    if(ev.code === 'Escape'){ this.finish(null); return; }
    if(ev.code === 'Enter' || ev.code === 'Space'){
      if(this.selected) this.finish(this.selected);
      return;
    }
    const all = VF.PlayableRoster.all();
    if(ev.code === 'Digit1' || ev.code === 'Numpad1') this.select(all[0] && all[0].id);
    if(ev.code === 'Digit2' || ev.code === 'Numpad2') this.select(all[1] && all[1].id);
    if(ev.code === 'ArrowLeft') this.select(all[0] && all[0].id);
    if(ev.code === 'ArrowRight') this.select(all[1] && all[1].id);
  };

  CharacterSelect.prototype.select = function(id){
    const def = VF.PlayableRoster.get(id);
    if(!def) return;
    this.selected = def;
    const cards = this.el.querySelectorAll('.vf-select-card');
    for(let i = 0; i < cards.length; i++){
      cards[i].classList.toggle('is-on', cards[i].getAttribute('data-vf-char') === def.id);
    }
    if(this.startBtn){
      this.startBtn.disabled = false;
      this.startBtn.textContent = 'START · ' + def.displayName;
    }
    if(VF.PlayableRoster && VF.PlayableRoster.loadingUrl){
      const img = new Image();
      img.src = VF.PlayableRoster.loadingUrl(def);
    }
  };

  CharacterSelect.prototype.wait = function(){
    const self = this;
    document.addEventListener('keydown', this._onKey);
    return new Promise(function(resolve){ self._resolve = resolve; });
  };

  CharacterSelect.prototype.finish = function(def){
    if(!this._resolve) return;
    document.removeEventListener('keydown', this._onKey);
    const done = this._resolve;
    this._resolve = null;
    if(def) VF.PlayableRoster.save(def.id);
    done(def);
  };

  CharacterSelect.prototype.hide = function(){
    if(this.el) this.el.hidden = true;
    document.removeEventListener('keydown', this._onKey);
  };

  VF.CharacterSelect = CharacterSelect;
})(typeof window !== 'undefined' ? window : globalThis);
