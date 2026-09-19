"use strict";
(function(root){
  const VF = root.VocabForce = root.VocabForce || {};

  function VocabForceHUD(){
    this.root = null;
    this.els = {};
  }

  VocabForceHUD.prototype.mount = function(){
    let root = document.getElementById('vf-game');
    if(!root){
      root = document.createElement('div');
      root.id = 'vf-game';
      document.body.appendChild(root);
    }
    root.innerHTML = `
      <div class="vf-stage"></div>
      <div class="vf-hurt" aria-hidden="true"></div>
      <div class="vf-hud">
        <div class="vf-glass vf-word" aria-live="polite">
          <small>TARGET WORD</small>
          <strong class="vf-target">APPLE</strong>
          <em class="vf-progress">_ _ _ _ _</em>
          <span class="vf-bag"></span>
          <span class="vf-thai"></span>
        </div>
        <div class="vf-glass vf-stats">
          <small class="vf-net" aria-live="polite">ลานฝึก · 1 คน</small>
          <span>คำสำเร็จ <b class="vf-done">0</b></span>
          <span>เหรียญรอบนี้ <b class="vf-coins">0</b></span>
        </div>
        <div class="vf-hp" aria-live="polite">
          <b class="vf-hp-ico" aria-hidden="true">+</b>
          <div class="vf-hp-track"><i class="vf-hp-fill"></i></div>
          <span class="vf-hp-num">1000 / 1000</span>
        </div>
        <div class="vf-spectator" hidden aria-live="polite">
          <small>SPECTATING</small>
          <strong class="vf-spectator-name"></strong>
          <span class="vf-spectator-help">Swipe ← → to change player</span>
        </div>
        <button class="vf-exit" type="button" data-vf-act="exit">ออก</button>
        <div class="vf-energy-charge" hidden>
          <small>ENERGY CHARGE</small>
          <div class="vf-energy-charge-track"><i class="vf-energy-charge-fill"></i></div>
        </div>
        <div class="vf-toast" hidden></div>
        <div class="vf-load">กำลังเรียก NEX… <span class="vf-load-pct">0%</span></div>
        <p class="vf-hint">เก็บตัวอักษรได้ไม่จำกัด · ตายแล้วชมเพื่อนจนจบรอบ · คำละ 1,000–10,000 เหรียญ</p>
      </div>
      <div class="vf-boot" hidden>
        <img class="vf-boot-art" alt="">
        <div class="vf-boot-fx" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i><i></i></div>
        <div class="vf-boot-shine" aria-hidden="true"></div>
        <div class="vf-boot-cover" aria-hidden="true"></div>
        <div class="vf-boot-meter">
          <span class="vf-boot-label">Loading...</span>
          <div class="vf-boot-row">
            <div class="vf-boot-track" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0">
              <i class="vf-boot-fill"></i>
            </div>
            <span class="vf-boot-pct">0%</span>
          </div>
          <small class="vf-boot-msg">กำลังเตรียมโลก</small>
        </div>
      </div>
      <div class="vf-touch" aria-hidden="false">
        <div class="vf-joy" data-vf-act="joy">
          <span class="vf-joy-chev vf-joy-n" aria-hidden="true"></span>
          <span class="vf-joy-chev vf-joy-e" aria-hidden="true"></span>
          <span class="vf-joy-chev vf-joy-s" aria-hidden="true"></span>
          <span class="vf-joy-chev vf-joy-w" aria-hidden="true"></span>
          <i class="vf-joy-knob"></i>
        </div>
        <button type="button" class="vf-act vf-punch" data-vf-act="punch" aria-label="ATTACK">
          <span class="vf-act-ico" aria-hidden="true">
            <svg viewBox="0 0 24 24"><path d="M8 20 L16 4 M10 4 H16 V10"/></svg>
          </span>
          <span class="vf-act-lab">ATTACK</span>
        </button>
        <button type="button" class="vf-act vf-kick" data-vf-act="kick" aria-label="KICK">
          <span class="vf-act-ico" aria-hidden="true">
            <svg viewBox="0 0 24 24"><path d="M7 8 v7 h7 l3-1.2 2.5 3.2 H9 L6 15.2 V8 z"/><path d="M10 8 V5"/></svg>
          </span>
          <span class="vf-act-lab">KICK</span>
        </button>
        <button type="button" class="vf-act vf-jump" data-vf-act="jump" aria-label="JUMP">
          <span class="vf-act-ico" aria-hidden="true">
            <svg viewBox="0 0 24 24"><circle cx="13" cy="5" r="2"/><path d="M13 8 l-2 4-4 1 M11 12 l3 3 4 4 M15 11 l5-2 M8 4 l2 3 M5 7 l3 2"/></svg>
          </span>
          <span class="vf-act-lab">JUMP</span>
        </button>
        <button type="button" class="vf-act vf-block" data-vf-act="block" aria-label="BLOCK">
          <span class="vf-act-ico" aria-hidden="true">
            <svg viewBox="0 0 24 24"><path d="M12 3 l8 4 v6 c0 5-3.4 8.2-8 10 C7.4 21.2 4 18 4 13 V7 z"/></svg>
          </span>
          <span class="vf-act-lab">BLOCK</span>
        </button>
        <button type="button" class="vf-act vf-dash" data-vf-act="dash" aria-label="DASH">
          <span class="vf-act-ico" aria-hidden="true">
            <svg viewBox="0 0 24 24"><path d="M3 8 h8 M3 12 h10 M3 16 h8 M13 6 l8 6-8 6"/></svg>
          </span>
          <span class="vf-act-lab">DASH</span>
        </button>
      </div>
      <button type="button" class="vf-sound" role="switch" aria-checked="true" aria-label="เสียง">
        <span class="vf-sound-track"><i class="vf-sound-knob"></i></span>
      </button>
      <div class="vf-win" hidden>
        <div class="vf-win-card">
          <p class="vf-win-kicker">ผู้ชนะรอบนี้</p>
          <div class="vf-win-photo-wrap">
            <img class="vf-win-photo" alt="">
            <b class="vf-win-photo-fall" hidden>?</b>
          </div>
          <strong class="vf-win-name">ผู้เล่น</strong>
          <b class="vf-win-word">APPLE</b>
          <em class="vf-win-thai"></em>
          <div class="vf-win-coin">
            <img class="vf-win-coin-ic" alt="">
            <span class="vf-win-reward">+1,000</span>
          </div>
          <button type="button" class="vf-win-ok">รับทราบ <span class="vf-win-count">8</span></button>
        </div>
      </div>
    `;
    this.root = root;
    this.els = {
      stage: root.querySelector('.vf-stage'),
      hurt: root.querySelector('.vf-hurt'),
      target: root.querySelector('.vf-target'),
      progress: root.querySelector('.vf-progress'),
      bag: root.querySelector('.vf-bag'),
      thai: root.querySelector('.vf-thai'),
      done: root.querySelector('.vf-done'),
      coins: root.querySelector('.vf-coins'),
      net: root.querySelector('.vf-net'),
      hp: root.querySelector('.vf-hp'),
      hpFill: root.querySelector('.vf-hp-fill'),
      hpNum: root.querySelector('.vf-hp-num'),
      spectator: root.querySelector('.vf-spectator'),
      spectatorName: root.querySelector('.vf-spectator-name'),
      spectatorHelp: root.querySelector('.vf-spectator-help'),
      toast: root.querySelector('.vf-toast'),
      win: root.querySelector('.vf-win'),
      winKicker: root.querySelector('.vf-win-kicker'),
      winPhoto: root.querySelector('.vf-win-photo'),
      winPhotoFall: root.querySelector('.vf-win-photo-fall'),
      winName: root.querySelector('.vf-win-name'),
      winWord: root.querySelector('.vf-win-word'),
      winThai: root.querySelector('.vf-win-thai'),
      winReward: root.querySelector('.vf-win-reward'),
      winCoinIc: root.querySelector('.vf-win-coin-ic'),
      winOk: root.querySelector('.vf-win-ok'),
      winCount: root.querySelector('.vf-win-count'),
      load: root.querySelector('.vf-load'),
      loadPct: root.querySelector('.vf-load-pct'),
      boot: root.querySelector('.vf-boot'),
      bootArt: root.querySelector('.vf-boot-art'),
      bootFill: root.querySelector('.vf-boot-fill'),
      bootPct: root.querySelector('.vf-boot-pct'),
      bootMsg: root.querySelector('.vf-boot-msg'),
      bootTrack: root.querySelector('.vf-boot-track'),
      joy: root.querySelector('.vf-joy'),
      joyKnob: root.querySelector('.vf-joy-knob'),
      dash: root.querySelector('.vf-dash'),
      sound: root.querySelector('.vf-sound'),
      energyCharge: root.querySelector('.vf-energy-charge'),
      energyChargeFill: root.querySelector('.vf-energy-charge-fill')
    };
    const self = this;
    this.paintSound();
    if(this.els.sound){
      this.els.sound.addEventListener('pointerdown', function(ev){ ev.stopPropagation(); });
      this.els.sound.addEventListener('click', function(ev){
        ev.preventDefault();
        ev.stopPropagation();
        if(VF.audio && VF.audio.toggleMuted) VF.audio.toggleMuted();
        self.paintSound();
      });
    }
    if(this.els.winOk){
      this.els.winOk.addEventListener('pointerdown', function(ev){ ev.stopPropagation(); });
      this.els.winOk.addEventListener('click', function(ev){
        ev.preventDefault();
        ev.stopPropagation();
        if(self.onAck) self.onAck();
      });
    }
    this.quest = new VF.LetterQuestMarker().mount(root);
    root.style.display = 'block';
    return this;
  };

  VocabForceHUD.prototype.setBootArt = function(def){
    const img = this.els.bootArt;
    if(!img) return;
    const url = VF.PlayableRoster && VF.PlayableRoster.loadingUrl ? VF.PlayableRoster.loadingUrl(def) : '';
    img.alt = (def && def.displayName) ? ('กำลังโหลด ' + def.displayName) : 'Loading';
    if(url && img.src.indexOf(url) < 0) img.src = url;
  };

  VocabForceHUD.prototype.setLoad = function(p, msg, def){
    const f = VF.clamp(p == null ? 0 : p, 0, 1);
    const pct = Math.round(f * 100);
    if(def) this.setBootArt(def);
    if(this.els.boot){
      this.els.boot.hidden = f >= 1;
      if(this.els.bootFill) this.els.bootFill.style.transform = 'scaleX(' + f + ')';
      if(this.els.bootPct) this.els.bootPct.textContent = pct + '%';
      if(this.els.bootTrack) this.els.bootTrack.setAttribute('aria-valuenow', String(pct));
      if(msg && this.els.bootMsg) this.els.bootMsg.textContent = msg;
    }
    if(this.els.load){
      this.els.load.hidden = true;
      if(this.els.loadPct) this.els.loadPct.textContent = pct + '%';
    }
  };

  VocabForceHUD.prototype.paintRound = function(round){
    if(!round || !round.progress) return;
    const p = round.progress;
    this.els.target.textContent = p.word;
    if(!p.complete){
      this.els.target.innerHTML = p.word.split('').map(function(ch, i){
        return i === p.index ? '<span class="vf-need">' + ch + '</span>' : ch;
      }).join('');
    }
    this.els.progress.textContent = p.display();
    if(this.els.bag) this.els.bag.textContent = p.bagText ? (p.bagText() || '') : '';
    this.els.thai.textContent = p.thai || '';
    this.els.done.textContent = String(round.wordsDone || 0);
    this.els.coins.textContent = String(round.sessionCoins || 0);
  };

  VocabForceHUD.prototype.setNet = function(text){
    if(this.els.net) this.els.net.textContent = String(text || '').replace(/<[^>]+>/g, ' ').trim();
  };

  VocabForceHUD.prototype.setHp = function(hp, max){
    const el = this.els.hp;
    if(!el) return;
    const m = Math.max(1, max || VF.PLAYER_HP || 1000);
    const v = VF.clamp(hp == null ? m : hp, 0, m);
    const frac = v / m;
    const band = VF._t.hpBand ? VF._t.hpBand(frac) : (frac > 0.6 ? 'green' : frac > 0.3 ? 'yellow' : 'red');
    el.classList.remove('is-green', 'is-yellow', 'is-red');
    el.classList.add('is-' + band);
    if(this.els.hpFill) this.els.hpFill.style.transform = 'scaleX(' + frac + ')';
    if(this.els.hpNum) this.els.hpNum.textContent = Math.round(v) + ' / ' + Math.round(m);
  };

  VocabForceHUD.prototype.setSpectator = function(on, name, count){
    const el = this.els.spectator;
    if(!el) return;
    const active = !!on;
    el.hidden = !active;
    if(this.root) this.root.classList.toggle('is-spectating', active);
    if(!active) return;
    if(this.els.spectatorName) this.els.spectatorName.textContent = name || 'กำลังรอผลรอบ';
    if(this.els.spectatorHelp) this.els.spectatorHelp.textContent = count > 1 ? 'Swipe ← → to change player' : (count === 1 ? 'ผู้เล่นที่ยังอยู่ในรอบ' : 'รอรอบถัดไป');
  };

  VocabForceHUD.prototype.hurtFlash = function(frac){
    const el = this.els.hurt;
    if(!el || !el.classList) return;
    const k = VF.clamp(frac != null ? frac : 0.4, 0.22, 1);
    el.style.setProperty('--vf-hurt', String(0.58 + 0.42 * k));
    el.classList.remove('is-on');
    void el.offsetWidth;
    el.classList.add('is-on');
  };

  VocabForceHUD.prototype.toast = function(msg){
    const el = this.els.toast;
    if(!el) return;
    el.hidden = false;
    el.textContent = msg;
    clearTimeout(this._toastT);
    this._toastT = setTimeout(function(){ el.hidden = true; }, 1400);
  };

  VocabForceHUD.prototype.showComplete = function(word, on){
    if(!on){
      this.hideWin();
      return;
    }
    this.showWin({name: '', word: word, reward: VF.LETTER_REWARD, local: true});
  };

  VocabForceHUD.prototype.showWin = function(info){
    const el = this.els.win;
    if(!el) return;
    info = info || {};
    const reward = info.reward != null ? info.reward : VF.LETTER_REWARD;
    this._winTok = (this._winTok || 0) + 1;
    const tok = this._winTok;
    if(this.els.winKicker) this.els.winKicker.textContent = info.local ? 'ยินดีด้วย!' : 'ผู้ชนะรอบนี้';
    if(this.els.winName) this.els.winName.textContent = info.name || 'ผู้เล่น';
    if(this.els.winWord) this.els.winWord.textContent = info.word || '';
    if(this.els.winThai) this.els.winThai.textContent = info.thai || '';
    if(this.els.winReward) this.els.winReward.textContent = '+' + Number(reward).toLocaleString('en-US');
    if(this.els.winCoinIc){
      this.els.winCoinIc.src = VF._t.coinSrc ? VF._t.coinSrc() : 'img/coins/coin_gold.webp';
      this.els.winCoinIc.onerror = function(){ this.onerror = null; this.replaceWith(document.createTextNode('🪙')); };
    }
    this._paintWinPhoto(info, tok);
    this._startWinCount(info.countSec != null ? info.countSec : (VF.WIN_ACK_SEC || 8));
    el.hidden = false;
    el.classList.toggle('is-local', !!info.local);
    if(this.root) this.root.classList.add('is-winning');
  };

  VocabForceHUD.prototype._paintWinPhoto = function(info, tok){
    const img = this.els.winPhoto;
    const fall = this.els.winPhotoFall;
    const src = (VF._t.winnerPhoto && VF._t.winnerPhoto(info)) || info.photo || '';
    const letter = String(info.name || '?').replace(/^\s+/, '').slice(0, 1) || '?';
    if(img){
      img.onerror = function(){
        if(tok !== this._winTok) return;
        img.hidden = true;
        if(fall){ fall.hidden = false; fall.textContent = letter; }
      }.bind(this);
      if(src){
        img.hidden = false;
        img.alt = info.name || 'ผู้ชนะ';
        img.src = src;
        if(fall) fall.hidden = true;
      }else{
        img.hidden = true;
        img.removeAttribute('src');
        if(fall){ fall.hidden = false; fall.textContent = letter; }
      }
    }else if(fall){
      fall.hidden = false;
      fall.textContent = letter;
    }
    if(info.uid && typeof photoFetch === 'function'){
      const self = this;
      photoFetch(info.uid).then(function(url){
        if(!url || tok !== self._winTok || !self.els.winPhoto) return;
        self.els.winPhoto.hidden = false;
        self.els.winPhoto.src = url;
        if(self.els.winPhotoFall) self.els.winPhotoFall.hidden = true;
      });
    }
  };

  VocabForceHUD.prototype._startWinCount = function(sec){
    const self = this;
    this._clearWinCount();
    let left = Math.max(1, Math.round(sec || 8));
    const paint = function(){
      if(self.els.winCount) self.els.winCount.textContent = String(left);
      if(self.els.winOk) self.els.winOk.setAttribute('aria-label', 'รับทราบ เหลือ ' + left + ' วินาที');
    };
    paint();
    this._winCountT = setInterval(function(){
      left -= 1;
      if(left <= 0){
        self._clearWinCount();
        if(self.els.winCount) self.els.winCount.textContent = '0';
        if(self.onAck) self.onAck();
        return;
      }
      paint();
    }, 1000);
  };

  VocabForceHUD.prototype._clearWinCount = function(){
    if(this._winCountT){
      clearInterval(this._winCountT);
      this._winCountT = 0;
    }
  };

  VocabForceHUD.prototype.hideWin = function(){
    this._clearWinCount();
    this._winTok = (this._winTok || 0) + 1;
    if(this.els.win) this.els.win.hidden = true;
    if(this.root) this.root.classList.remove('is-winning');
  };

  VocabForceHUD.prototype.flyCoins = function(amount){
    if(!this.root) return;
    const src = this.els.winCoinIc || this.els.winReward || this.els.win;
    const dest = this.els.coins;
    if(!src || !dest) return;
    const a = src.getBoundingClientRect();
    const b = dest.getBoundingClientRect();
    const rootR = this.root.getBoundingClientRect();
    const url = VF._t.coinSrc ? VF._t.coinSrc() : 'img/coins/coin_gold.webp';
    const n = 6;
    for(let i = 0; i < n; i++){
      const c = document.createElement('div');
      c.className = 'vf-fly-coin';
      const img = document.createElement('img');
      img.src = url;
      img.alt = '';
      img.onerror = function(){ this.onerror = null; c.textContent = '🪙'; };
      c.appendChild(img);
      c.style.left = (a.left - rootR.left + a.width / 2 + (Math.random() - 0.5) * 36) + 'px';
      c.style.top = (a.top - rootR.top + a.height / 2) + 'px';
      c.style.setProperty('--dx', ((b.left + b.width / 2) - (a.left + a.width / 2)) + 'px');
      c.style.setProperty('--dy', ((b.top + b.height / 2) - (a.top + a.height / 2)) + 'px');
      c.style.animationDelay = (i * 70) + 'ms';
      this.root.appendChild(c);
      setTimeout(function(){ if(c.parentNode) c.parentNode.removeChild(c); }, 1000 + i * 70);
    }
    const tag = document.createElement('div');
    tag.className = 'vf-coin-plus';
    tag.textContent = '+🪙' + Number(amount || VF.LETTER_REWARD).toLocaleString('en-US');
    tag.style.left = (a.left - rootR.left + a.width / 2) + 'px';
    tag.style.top = (a.top - rootR.top - 8) + 'px';
    this.root.appendChild(tag);
    setTimeout(function(){ if(tag.parentNode) tag.parentNode.removeChild(tag); }, 1200);
    if(dest){
      dest.classList.remove('is-pop');
      void dest.offsetWidth;
      dest.classList.add('is-pop');
    }
  };

  VocabForceHUD.prototype.flyLetter = function(letter, sx, sy){
    const chip = document.createElement('div');
    chip.className = 'vf-fly-letter';
    chip.textContent = letter;
    chip.style.left = sx + 'px';
    chip.style.top = sy + 'px';
    this.root.appendChild(chip);
    const dest = this.els.progress.getBoundingClientRect();
    requestAnimationFrame(function(){
      chip.style.left = (dest.left + dest.width * 0.5) + 'px';
      chip.style.top = (dest.top + dest.height * 0.5) + 'px';
      chip.style.transform = 'translate(-50%,-50%) scale(0.4)';
      chip.style.opacity = '0.15';
    });
    setTimeout(function(){ if(chip.parentNode) chip.parentNode.removeChild(chip); }, 620);
  };

  VocabForceHUD.prototype.paintSound = function(){
    const btn = this.els.sound;
    if(!btn) return;
    const on = !(VF.audio && VF.audio.isMuted && VF.audio.isMuted());
    btn.classList.toggle('is-off', !on);
    btn.setAttribute('aria-checked', on ? 'true' : 'false');
    btn.setAttribute('aria-label', on ? 'ปิดเสียง' : 'เปิดเสียง');
  };

  VocabForceHUD.prototype.setDashCooldown = function(frac){
    const btn = this.els.dash;
    if(!btn) return;
    const ready = frac >= 0.995;
    btn.classList.toggle('is-cool', !ready);
    btn.style.setProperty('--vf-cd', String(VF.clamp(1 - frac, 0, 1)));
    btn.setAttribute('aria-disabled', ready ? 'false' : 'true');
  };

  VocabForceHUD.prototype.setEnergyCharge = function(frac){
    const el = this.els.energyCharge;
    if(!el) return;
    const f = VF.clamp(frac || 0, 0, 1);
    const on = f > 0.001;
    el.hidden = !on;
    el.classList.toggle('is-full', f >= 0.995);
    el.style.setProperty('--vf-chg', String(f));
    if(this.els.energyChargeFill) this.els.energyChargeFill.style.transform = 'scaleX(' + f + ')';
  };

  VocabForceHUD.prototype.hide = function(){
    if(this.quest) this.quest.hide();
    this.hideWin();
    this.setSpectator(false);
    if(this.root){
      this.root.classList.remove('is-winning');
      this.root.style.display = 'none';
    }
  };

  VF.VocabForceHUD = VocabForceHUD;
})(typeof window !== 'undefined' ? window : globalThis);
