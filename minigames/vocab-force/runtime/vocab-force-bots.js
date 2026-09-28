"use strict";
/* รอบ 1596: บอทผู้เล่น — อุดผู้เล่นจริงให้ครบ 10 ในหน้ารอโหลด + ลงเล่นจริงในลานด้วย
   character controller + GLB animations ของเกม (NEX / Lyravyn) ความยากปานกลาง
   - สมองบอท: วิ่งหาตัวอักษรตามคำปัจจุบัน / สู้ซอมบี้ใกล้ตัว / หนีไปเติมเลือดวงฮีล
   - ห้ามพฤติกรรมโง่ ๆ: มีช่วงคิด/ชะงักแบบคน, หลบการชนกันเอง, ไม่ล็อกสั่น, เดินสลับวิ่ง
   รอบ 1602: PvP เต็มรูปแบบ — โดนคนเตะ/ต่อย/ปล่อยพลังแล้วเจ็บจริง (applyHit) + แค้นโจมตีกลับ
   (brawl) + ตายแล้วตัวอักษรหลุดเป็นของรางวัลกลาง + เกิดใหม่เองในไม่กี่วิ + ลูกศรคำศัพท์
   ไล่ชี้ตัวบอทที่ถือตัวอักษรที่เราต้องการอยู่ (findCarrier)
   รอบ 1606: บอทหลบอาคารอัตโนมัติ (เลี้ยงรอบมุมเมื่อเส้นทางชน) + ติดขัดแล้วเบี่ยง
   + หลบซ่อนในอาคารเมื่อเลือดน้อย (2 ชั้นขึ้นชั้นบน ซอมบี้ตามไม่ถึง) + ไล่ "แย่ง"
   ตัวอักษรจากผู้ถือ (ตีบอท/คนจนตัวอักษรหลุด) + ฮีลที่แท่นใกล้สุดจาก 4 จุด */
(function(root){
  const VF = root.VocabForce = root.VocabForce || {};

  /* ---------------- ชื่อบอท (fake, สุ่ม, ห้ามซ้ำ, สอดคล้องเพศตัวละคร) ---------------- */
  const MALE_NAMES = [
    'Arthit', 'Boss', 'Chai', 'Daniel', 'Erik', 'Ford', 'Gus', 'Hugo', 'Ice', 'Jake',
    'Ken', 'Leo', 'Mark', 'Nick', 'Oscar', 'Pete', 'Q', 'Ryan', 'Sam', 'Ton',
    'Ukrit', 'Victor', 'Win', 'Xavier', 'Yacht', 'Zain', 'Krit', 'Tan', 'Non', 'Putter',
    'Singto', 'Joe', 'Jay', 'Max', 'Tul', 'Off'
  ];
  const FEMALE_NAMES = [
    'Alice', 'Belle', 'Cindy', 'Daisy', 'Emma', 'Fah', 'Gina', 'Honey', 'Ink', 'June',
    'Kaew', 'Lisa', 'Mild', 'Nana', 'Oil', 'Ploy', 'Praew', 'Rose', 'Sai', 'Toon',
    'Vivi', 'Waan', 'Xena', 'Ying', 'Zara', 'Noon', 'Fern', 'Gift', 'Gypso', 'Kwan',
    'Jane', 'Jean', 'Mook', 'Pang', 'Rin', 'Bow'
  ];
  const GENDER_BY_CHAR = { nex: 'male', lyravyn: 'female' };

  VF.BotNames = {
    GENDER_BY_CHAR: GENDER_BY_CHAR,
    male: MALE_NAMES.slice(),
    female: FEMALE_NAMES.slice(),
    genderFor: function(charId){ return GENDER_BY_CHAR[String(charId || '').toLowerCase()] || 'male'; },
    pick: function(gender, taken){
      const pool = (gender === 'female' ? FEMALE_NAMES : MALE_NAMES).slice();
      const used = {};
      (taken || []).forEach(function(nm){ used[String(nm).toLowerCase()] = true; });
      const free = pool.filter(function(nm){ return !used[nm.toLowerCase()]; });
      if(!free.length) return null;
      return free[(Math.random() * free.length) | 0];
    }
  };

  /* รอบ 1610: ผู้ใช้สั่งเหลือบอทสูงสุด 3 ตัว (เดิมเติมให้ครบ 10 คน) */
  VF._t.botFill = function(humans){
    return VF.clamp(Math.min(3, 10 - Math.max(1, Math.floor(Number(humans) || 1))), 0, 3);
  };

  /* รายชื่อผู้เล่นบนหน้ารอโหลด — ตัวจริงก่อน (รู้ชื่อจาก net rec) แล้วค่อยเติมบอท */
  VF._t.lobbySlots = function(opts){
    opts = opts || {};
    const slots = [];
    const picked = opts.picked || null;
    slots.push({name: String(opts.selfName || 'คุณ').slice(0, 18), def: picked, self: true});
    const net = opts.net;
    const recs = (net && net._rec) || {};
    for(const uid in recs){
      if(slots.length >= 10) break;
      const rec = recs[uid] || {};
      const def = VF.PlayableRoster && VF.PlayableRoster.get ? VF.PlayableRoster.get(rec.av) : null;
      slots.push({name: String(rec.n || 'ผู้เล่น').slice(0, 18), def: def});
    }
    const humans = net && net.humanCount ? net.humanCount() : 1;
    while(slots.length < Math.min(10, Math.max(1, humans))) slots.push({name: 'ผู้เล่น', def: null});
    const bots = opts.bots || [];
    for(let i = 0; i < bots.length && slots.length < 10; i++){
      slots.push({name: bots[i].name, def: bots[i].def, bot: true});
    }
    return slots;
  };

  /* ---------------- ตัวแปลงทิศ: สติกสู่โลก (camYaw = 0 → wish = (-mx, mz)) ---------------- */
  const BOT_CAM = {yaw: 0};
  const ZERO_INPUT = {moveX: 0, moveZ: 0};
  const HEAL_POS = {x: 0, z: 22};

  /* ---------------- รอบ 1606: เส้นทางหลบอาคาร (VF._t.buildingSpecs จาก map/buildings.js) ---------------- */
  /* เส้นตรง (x1,z1)→(x2,z2) ตัดกล่อง 2D หรือไม่ (slab method, t∈[0,1]) */
  function _segHitsBox(x1, z1, x2, z2, minx, minz, maxx, maxz){
    let tmin = 0, tmax = 1;
    const dx = x2 - x1, dz = z2 - z1;
    if(Math.abs(dx) < 1e-9){
      if(x1 < minx || x1 > maxx) return false;
    }else{
      let a = (minx - x1) / dx, b = (maxx - x1) / dx;
      if(a > b){ const t = a; a = b; b = t; }
      if(a > tmin) tmin = a;
      if(b < tmax) tmax = b;
      if(tmin > tmax) return false;
    }
    if(Math.abs(dz) < 1e-9){
      if(z1 < minz || z1 > maxz) return false;
    }else{
      let a = (minz - z1) / dz, b = (maxz - z1) / dz;
      if(a > b){ const t = a; a = b; b = t; }
      if(a > tmin) tmin = a;
      if(b < tmax) tmax = b;
      if(tmin > tmax) return false;
    }
    return true;
  }

  /* ประตูอาคาร — ด้านที่หันเข้าหากลางลาน (สูตรเดียวกับ doorSide ใน buildings.js) */
  function _doorOf(s){
    const dx = -s.x, dz = -s.z;
    if(Math.abs(dx) > Math.abs(dz)) return dx > 0 ? {x: s.x + s.w / 2, z: s.z} : {x: s.x - s.w / 2, z: s.z};
    return dz > 0 ? {x: s.x, z: s.z + s.d / 2} : {x: s.x, z: s.z - s.d / 2};
  }

  /* จุดกลางแผ่นพื้นชั้นสองของอาคาร 2 ชั้น (สูตรเดียวกับ buildings.js — บันไดอยู่ผนังฝั่งตรงข้ามประตู) */
  function _upperSpot(s){
    const TH = 0.3, SD = 3.2;
    const dx = -s.x, dz = -s.z;
    const door = Math.abs(dx) > Math.abs(dz) ? (dx > 0 ? 'e' : 'w') : (dz > 0 ? 's' : 'n');
    const stair = {n: 's', s: 'n', e: 'w', w: 'e'}[door];
    const iw = s.w - 2 * TH, id = s.d - 2 * TH;
    const stairHoriz = stair === 'n' || stair === 's';
    let sx0, sz0;
    if(stairHoriz){
      const sd2 = id - SD;
      sx0 = s.x;
      sz0 = stair === 'n' ? s.z - s.d / 2 + TH + SD + sd2 / 2 : s.z + s.d / 2 - TH - SD - sd2 / 2;
    }else{
      const sw = iw - SD;
      sx0 = stair === 'w' ? s.x - s.w / 2 + TH + SD + sw / 2 : s.x + s.w / 2 - TH - SD - sw / 2;
      sz0 = s.z;
    }
    return {x: sx0, z: sz0};
  }

  /* tune ความยากปานกลาง */
  const BOT = {
    REACT_MIN: 0.35, REACT_MAX: 0.8,   /* ช่วงคิดแผน */
    START_DELAY_MIN: 0.5, START_DELAY_MAX: 2.2, /* อ่านคำก่อนเริ่มเหมือนคน */
    FIGHT_R: 6.5, STRIKE_R: 2.3, BITE_R: 1.6, BITE_SEC: 1.15,
    HEAL_FRAC: 0.35, FLEE_FRAC: 0.22,
    SEPAR_R: 2.3,
    AGGRESSIVE: 0.6,                     /* โอกาสจะสู้แทนหนีเมื่อซอมบี้ใกล้ */
    WALK_CHANCE: 0.22, PAUSE_CHANCE: 0.05,
    RUN_SCALE_MIN: 0.78, RUN_SCALE_MAX: 0.92,
    /* รอบ 1602: PvP — บอทตีคนกลับเมื่อโดนตี (แค้น) หรือคนเดินมาแนบตัวแล้วดุ */
    BRAWL_R: 2.8, BRAWL_AGGRO_R: 7, REVENGE_MS: 8000,
    RESPAWN_MIN: 6000, RESPAWN_MAX: 10000, DROP_LOCK_MS: 2500
  };
  VF.BotTune = BOT;

  function BotManager(opts){
    opts = opts || {};
    this.scene = opts.scene || null;
    this.arena = opts.arena || null;
    this.bots = [];
    this.onWin = null;
    this._word = '';
    this._thai = '';
    this._deps = null;   /* deps ล่าสุดจาก tick — ใช้ตอนบอทตายหลุดตัวอักษร */
  }

  BotManager.prototype.count = function(){ return this.bots.length; };
  BotManager.prototype.ids = function(){ return this.bots.map(function(b){ return b.id; }); };

  BotManager.prototype._makeBot = function(i, count){
    /* สัดส่วน nex:lyravyn สุ่ม แต่โรสเตอร์ ≥2 ตัวให้มีครบทั้งสองเพศ */
    let charId = Math.random() < 0.5 ? 'nex' : 'lyravyn';
    if(count >= 2){
      const haveM = this.bots.some(function(b){ return VF.BotNames.genderFor(b.def && b.def.id) === 'male'; });
      const haveF = this.bots.some(function(b){ return VF.BotNames.genderFor(b.def && b.def.id) === 'female'; });
      if(i === count - 1 && !haveM) charId = 'nex';
      if(i === count - 1 && !haveF) charId = 'lyravyn';
    }
    const def = VF.PlayableRoster && VF.PlayableRoster.get ? VF.PlayableRoster.get(charId) : null;
    const taken = this.bots.map(function(b){ return b.name; });
    const name = VF.BotNames.pick(VF.BotNames.genderFor(charId), taken) || ('Bot' + (i + 1));
    const ctl = new VF.NexCharacterController();
    /* แฮนดิแคประดับปานกลาง + ความเร็วเฉพาะตัวเล็กน้อย ไม่เท่ากันเป๊ะ */
    const k = VF.rand(BOT.RUN_SCALE_MIN, BOT.RUN_SCALE_MAX);
    ctl.runSpeed = (ctl.runSpeed || 8.6) * k;
    ctl.walkSpeed = (ctl.walkSpeed || 5.4) * VF.rand(0.88, 1.0);
    ctl.sprintSpeed = (ctl.sprintSpeed || 12.4) * k;
    return {
      id: 'vfb' + i + '_' + ((Math.random() * 0xffff) | 0).toString(36),
      name: name, def: def, ctl: ctl,
      prog: null,
      think: 0, startDelay: 0, pauseT: 0,
      target: null, kind: 'idle',
      strikeAt: 0, strikeKind: '', biteCd: 0,
      walky: Math.random() < BOT.WALK_CHANCE,
      aggressive: Math.random() < BOT.AGGRESSIVE,
      wanderX: 0, wanderZ: 0, wanderT: 0,
      _deadPlayed: false,
      /* รอบ 1602: PvP state */
      _revenge: null, _foe: null, _strikeFoe: null,
      _respawnAt: 0, _spawnPos: null
    };
  };

  BotManager.prototype.start = async function(count, onProgress){
    count = Math.max(0, Math.min(9, count | 0));
    const clips = ['run', 'punch', 'kick', 'jump', 'block', 'victory'];
    for(let i = 0; i < count; i++){
      const bot = this._makeBot(i, count);
      this.bots.push(bot);
      try{
        await bot.ctl.attach(this.scene, bot.def);
        for(let c = 0; c < clips.length; c++){
          try{ await bot.ctl.ingestClip(clips[c]); }catch(_){}
        }
        bot.ctl.pivot.visible = false;
        /* รอบ 1603: ป้ายชื่อ + แถบ HP เหนือหัวบอท เหมือนผู้เล่นจริง */
        bot.tag = VF.NameTag ? new VF.NameTag(bot.name, {y: 2.58}) : null;
        if(bot.tag && bot.ctl.pivot) bot.ctl.pivot.add(bot.tag.sprite);
        bot.bar = VF.HealthBar ? new VF.HealthBar({y: 2.2, max: VF.PLAYER_HP || 1000}) : null;
        if(bot.bar){
          bot.bar.attach(this.scene);
          bot.bar.group.visible = false;
        }
      }catch(err){
        console.warn('[VocabForce] bot load skip', bot.name, err);
      }
      if(onProgress) onProgress((i + 1) / count);
    }
    return this.bots;
  };

  BotManager.prototype.beginRound = function(word, thai, spawnFor){
    this._word = String(word || '').toUpperCase();
    this._thai = thai || '';
    const self = this;
    this.bots.forEach(function(bot, i){
      bot.prog = new VF.LetterProgressController(self._word, self._thai);
      bot.think = 0;
      bot.startDelay = VF.rand(BOT.START_DELAY_MIN, BOT.START_DELAY_MAX);
      bot.pauseT = 0; bot.target = null; bot.kind = 'idle';
      bot.strikeAt = 0; bot.strikeKind = ''; bot.biteCd = 0;
      bot.wanderT = 0; bot._deadPlayed = false;
      bot._strikeIn = 0; bot._strikeTarget = null; bot._threat = null;
      /* รอบ 1602: เคลียร์สถานะ PvP + จำจุดเกิดสำหรับ respawn */
      bot._revenge = null; bot._foe = null; bot._strikeFoe = null;
      bot._respawnAt = 0;
      /* รอบ 1606: เคลียร์เส้นทางหลบอาคาร/จังหวะเบี่ยง */
      bot._wps = null; bot._detour = null; bot._stuckT = 0;
      bot._lx = null; bot._lz = null;
      const pos = spawnFor ? spawnFor(bot.id, i) : null;
      bot._spawnPos = pos || null;
      if(bot.ctl.resetForRound){
        bot.ctl.resetForRound(pos || {x: 0, y: 0, z: 0, yaw: 0});
      }
      if(bot.ctl.pivot) bot.ctl.pivot.visible = true;
    });
  };

  BotManager.prototype.people = function(){
    return this.bots.map(function(b){
      return {id: b.id, x: b.ctl.x, z: b.ctl.z, y: b.ctl.y, alive: b.ctl.alive !== false, local: true, bot: true};
    });
  };

  /* รอบ 1602: ลูกศรคำศัพท์ — ตัวอักษรที่ต้องการถูกบอทเก็บไปแล้ว → ชี้ตามตัวบอท */
  BotManager.prototype.findCarrier = function(ch){
    const want = String(ch || '').slice(0, 1).toUpperCase();
    if(!/[A-Z]/.test(want)) return null;
    for(let i = 0; i < this.bots.length; i++){
      const bot = this.bots[i];
      if(!bot || !bot.ctl || bot.ctl.alive === false) continue;
      const prog = bot.prog;
      if(!prog || prog.complete) continue;
      if(prog.bag && prog.bag.indexOf(want) >= 0){
        return {x: bot.ctl.x, y: bot.ctl.y || 0, z: bot.ctl.z, height: 1.8, bot: true, name: bot.name};
      }
    }
    return null;
  };

  BotManager.prototype._byId = function(id){
    for(let i = 0; i < this.bots.length; i++){
      if(this.bots[i].id === id) return this.bots[i];
    }
    return null;
  };

  /* รอบ 1602: ผู้เล่นต่อย/เตะ/ปล่อยพลังโดนบอท — ดาเมจจริงผ่าน controller ของบอท
     (ระบบ strike บน hp string ส่งถึงแค่คนออนไลน์ บอทอยู่ในเครื่องเดียวกันจึงยิงตรง)
     โดนแล้วบอทจำหน้าแค้น (revenge) · ตายแล้วตัวอักษรหลุด + นัดเวลาเกิดใหม่ */
  BotManager.prototype.applyHit = function(id, dmg, info){
    const bot = this._byId(id);
    if(!bot || !bot.ctl || bot.ctl.alive === false) return 0;
    info = info || {};
    const from = info.kind === 'M' ? 'slam' : (info.kind === 'G' ? 'gun' : 'player');
    const dealt = bot.ctl.takeHit ? bot.ctl.takeHit(dmg, !!bot.ctl.blocking, {from: from}) : 0;
    if(dealt > 0){
      const now = VF.now();
      if(info.fromId) bot._revenge = {id: info.fromId, until: now + (BOT.REVENGE_MS || 8000)};
      if(bot.ctl.alive === false && !bot._respawnAt){
        bot._respawnAt = now + VF.rand(BOT.RESPAWN_MIN || 6000, BOT.RESPAWN_MAX || 10000);
        this._dropLetters(bot, now);
      }
    }
    return dealt;
  };

  /* บอทตาย → ตัวอักษรในถุงหลุดเป็นของรางวัลกลางรอบตัว (เหมือนคนตาย) + เคลียร์ถุง */
  BotManager.prototype._dropLetters = function(bot, now){
    const bag = bot.prog && bot.prog.bag ? bot.prog.bag.slice() : [];
    if(!bag.length) return;
    if(bot.prog.dropLife) bot.prog.dropLife();
    const deps = this._deps || {};
    if(deps.letters && deps.letters.dropAround){
      deps.letters.dropAround(root.THREE, bag, {x: bot.ctl.x, y: bot.ctl.y || 0, z: bot.ctl.z}, this.arena, {
        ownerId: bot.id, ownerLockMs: BOT.DROP_LOCK_MS || 2500, now: now
      });
    }
  };

  BotManager.prototype._nearestThreat = function(bot, enemies){
    if(!enemies || !enemies.list) return null;
    let best = null, bestD = BOT.FIGHT_R;
    const list = enemies.list;
    for(let i = 0; i < list.length; i++){
      const en = list[i];
      if(!en || !en.alive || en.state === 'gone' || en.burstFinisherTriggered) continue;
      /* รอบ 1606: คนละระดับสูง (เช่น หลบอยู่ชั้นสอง) ไม่นับเป็นภัยใกล้ตัว */
      if(Math.abs((en.y || 0) - (bot.ctl.y || 0)) > 1.7) continue;
      const d = Math.hypot((en.x || 0) - bot.ctl.x, (en.z || 0) - bot.ctl.z);
      if(d < bestD){ bestD = d; best = en; }
    }
    return best ? {en: best, d: bestD} : null;
  };

  /* รอบ 1602: คู่ต่อสู้ที่ใกล้ที่สุดในหมู่ "คน" (ตัวเรา + เพื่อนออนไลน์ ไม่นับบอทด้วยกันเอง)
     ถ้าโดนตีแล้วแค้นอยู่ จะไล่ตามคนนั้นแบบไม่จำกัดระยะจนหมดเวลาแค้น */
  BotManager.prototype._nearestFoe = function(bot, deps, now){
    const ctl = bot.ctl;
    const cands = [];
    if(deps.player && deps.player.alive !== false){
      cands.push({id: deps.player.uid || 'local', x: deps.player.x, z: deps.player.z, local: true, ref: null});
    }
    const folks = deps.people || [];
    for(let i = 0; i < folks.length; i++){
      const p = folks[i];
      if(!p || p.bot || p.local || p.alive === false) continue;
      cands.push({id: p.id, x: p.x, z: p.z, local: false, ref: p});
    }
    const revengeOn = bot._revenge && bot._revenge.until > now;
    let best = null, bestD = Infinity;
    for(let i = 0; i < cands.length; i++){
      const c = cands[i];
      const d = Math.hypot((c.x || 0) - ctl.x, (c.z || 0) - ctl.z);
      if(revengeOn && c.id === bot._revenge.id) return {id: c.id, x: c.x, z: c.z, d: d, local: c.local, ref: c.ref};
      if(d < (BOT.BRAWL_AGGRO_R || 7) && d < bestD){ bestD = d; best = {id: c.id, x: c.x, z: c.z, d: d, local: c.local, ref: c.ref}; }
    }
    return best;
  };

  /* รอบ 1606: เส้นทางสู่เป้าชนอาคารหรือไม่ — ถ้าชน คืนจุดเลี้ยงรอบมุมที่ผ่านแล้วสั้นที่สุด
     (อาคารมีประตูด้านเดียว จึงเลี้ยง "รอบ" ไม่เดินทะลุ — ยกเว้นโหมด hide ที่ตั้งใจเข้าประตู) */
  BotManager.prototype._route = function(ctl, tx, tz){
    const specs = VF._t.buildingSpecs;
    if(!specs || !specs.length) return null;
    const y = ctl.y || 0;
    for(let i = 0; i < specs.length; i++){
      const s = specs[i];
      const m = 0.9;
      const minx = s.x - s.w / 2 - m, maxx = s.x + s.w / 2 + m;
      const minz = s.z - s.d / 2 - m, maxz = s.z + s.d / 2 + m;
      const inX = ctl.x > minx && ctl.x < maxx, inZ = ctl.z > minz && ctl.z < maxz;
      if(inX && inZ){
        if(y > 1.2) return null;             /* อยู่ชั้นสอง — เดินบนแผ่นพื้นอิสระ */
        if(tx > minx && tx < maxx && tz > minz && tz < maxz) return null; /* เป้าอยู่ในอาคารเดียวกัน */
        return _doorOf(s);                   /* อยู่ในอาคารแต่เป้าอยู่นอก → ออกทางประตู */
      }
      if(y > 1.2) continue;                  /* ชั้นสองไม่ต้องหลบกล่องพื้นล่าง */
      if(!_segHitsBox(ctl.x, ctl.z, tx, tz, minx, minz, maxx, maxz)) continue;
      const corners = [
        {x: minx, z: minz}, {x: maxx, z: minz},
        {x: minx, z: maxz}, {x: maxx, z: maxz}
      ];
      let best = null, bestC = Infinity;
      for(let c = 0; c < 4; c++){
        const cn = corners[c];
        const cost = Math.hypot(cn.x - ctl.x, cn.z - ctl.z) + Math.hypot(tx - cn.x, tz - cn.z);
        if(cost < bestC){ bestC = cost; best = cn; }
      }
      return best;
    }
    return null;
  };

  /* รอบ 1606: จุดหลบซ่อนใกล้สุด — อาคาร 2 ชั้นขึ้นไปหลบชั้นบน (ซอมบี้ขึ้นบันไดไม่ได้)
     คืนคิว waypoint: [ประตู] หรือ [ประตู, กลางแผ่นชั้นสอง] */
  BotManager.prototype._hideSpot = function(ctl){
    const specs = VF._t.buildingSpecs;
    if(!specs || !specs.length) return null;
    let best = null, bestD = 120;
    for(let i = 0; i < specs.length; i++){
      const s = specs[i];
      const d = Math.hypot(s.x - ctl.x, s.z - ctl.z);
      if(d < bestD){ bestD = d; best = s; }
    }
    if(!best) return null;
    const wps = [_doorOf(best)];
    if(best.two) wps.push(_upperSpot(best));
    return {wps: wps};
  };

  /* รอบ 1606: ใครถือตัวอักษรที่เราต้องการอยู่ — บอทตัวอื่น หรือผู้เล่นคน (deps.playerBag) */
  BotManager.prototype._carrierOf = function(need, bot, deps){
    for(let i = 0; i < this.bots.length; i++){
      const o = this.bots[i];
      if(o === bot || !o.ctl || o.ctl.alive === false || !o.prog || o.prog.complete) continue;
      if(o.prog.bag && o.prog.bag.indexOf(need) >= 0){
        return {id: o.id, x: o.ctl.x, z: o.ctl.z, local: false, bot: true, ref: null};
      }
    }
    if(deps.player && deps.player.alive !== false && deps.playerBag && deps.playerBag.indexOf(need) >= 0){
      return {id: deps.player.uid || 'local', x: deps.player.x, z: deps.player.z, local: true, ref: null};
    }
    return null;
  };

  /* ตัดสินใจแผนใหม่ — เรียกเฉพาะตอน think หมด */
  BotManager.prototype._plan = function(bot, deps, now){
    const ctl = bot.ctl;
    const letters = deps.letters;
    const maxHp = ctl.maxHp || VF.PLAYER_HP || 1000;
    const hpFrac = (ctl.hp != null ? ctl.hp : maxHp) / maxHp;
    bot.target = null;
    bot.kind = 'idle';
    bot._foe = null;
    bot._wps = null;
    const threat = this._nearestThreat(bot, deps.enemies);
    if(threat && threat.d < BOT.BITE_R * 2.2 && hpFrac < BOT.FLEE_FRAC){
      /* รอบ 1606: เลือดจะหมด + ซอมบี้แนบตัว → วิ่งหลบเข้าอาคาร (2 ชั้นขึ้นชั้นบน) */
      const hide = this._hideSpot(ctl);
      if(hide){
        bot.kind = 'hide';
        bot._wps = hide.wps;
        bot.target = {x: hide.wps[0].x, z: hide.wps[0].z};
        return;
      }
      bot.kind = 'flee';
      bot.target = {x: ctl.x * 2 - threat.en.x, z: ctl.z * 2 - threat.en.z};
      return;
    }
    if(threat && threat.d < BOT.FIGHT_R && hpFrac < BOT.HEAL_FRAC && !bot.aggressive && Math.random() < 0.45){
      /* รอบ 1606: บอทใจเสาะเลือดน้อย + ซอมบี้ใกล้ → บางทีเลือกหลบซ่อนแทนสู้ */
      const hide = this._hideSpot(ctl);
      if(hide){
        bot.kind = 'hide';
        bot._wps = hide.wps;
        bot.target = {x: hide.wps[0].x, z: hide.wps[0].z};
        return;
      }
    }
    if(threat && (threat.d < 3.2 || (threat.d < BOT.FIGHT_R && bot.aggressive))){
      bot.kind = 'fight';
      bot.target = {x: threat.en.x, z: threat.en.z};
      bot._threat = threat.en;
      return;
    }
    /* รอบ 1602: PvP — โดนคนตีแล้วแค้นต้องสู้กลับเสมอ · คนเดินมาแนบตัวแล้วบอทดุ (สุ่มตามนิสัย) */
    const foe = this._nearestFoe(bot, deps, now);
    const revengeOn = bot._revenge && bot._revenge.until > now;
    if(foe && ((revengeOn && foe.id === bot._revenge.id) || (foe.d < (BOT.BRAWL_R || 2.8) && bot.aggressive && Math.random() < 0.6))){
      bot.kind = 'brawl';
      bot.target = {x: foe.x, z: foe.z};
      bot._foe = foe;
      return;
    }
    if(hpFrac < BOT.HEAL_FRAC){
      /* รอบ 1606: ไปแท่นฮีล "จุดที่ใกล้สุด" (มี 4 จุดรอบลาน) */
      const sp = VF._t.healPadNearest ? VF._t.healPadNearest(ctl.x, ctl.z) : HEAL_POS;
      bot.kind = 'heal';
      bot.target = {x: sp.x, z: sp.z};
      return;
    }
    const need = bot.prog && !bot.prog.complete ? bot.prog.required() : null;
    if(need && letters && letters.nearest){
      const item = letters.nearest(need, ctl.x, ctl.z);
      if(item){
        bot.kind = 'hunt';
        /* จุดหมายหยาบ ๆ แบบคน — ไม่ล็อกเป๊ะทุกตัว */
        bot.target = {
          x: item.x + VF.rand(-1.2, 1.2),
          z: item.z + VF.rand(-1.2, 1.2),
          item: item
        };
        return;
      }
      /* รอบ 1606: ตัวอักษรที่ต้องการถูก "ใคร" ถืออยู่ → ไล่ตามตีจนหลุด (แย่งคำศัพท์) */
      const carrier = this._carrierOf(need, bot, deps);
      if(carrier){
        bot.kind = 'steal';
        bot.target = {x: carrier.x, z: carrier.z};
        bot._foe = carrier;
        return;
      }
    }
    /* ไม่มีอะไรให้ทำจริง ๆ — เดินเล่นแถวกลางลาน (โซนที่ตัวอักษรเกิด) แทนสุ่มทั่วสนาม */
    bot.kind = 'wander';
    if(!bot.wanderT || Math.hypot(bot.wanderX - ctl.x, bot.wanderZ - ctl.z) < 3){
      const half = Math.min((this.arena && this.arena.half || 280) - 8, 70);
      bot.wanderX = VF.rand(-half, half);
      bot.wanderZ = VF.rand(-half, half);
      bot.wanderT = VF.rand(3, 6);
    }
    bot.target = {x: bot.wanderX, z: bot.wanderZ};
    /* คนไม่ได้วิ่งรัว ๆ ตลอด — มีจังหวะหยุดพัก */
    if(Math.random() < BOT.PAUSE_CHANCE) bot.pauseT = VF.rand(0.5, 1.5);
  };

  /* หนึ่งเฟรมของบอทตัวหนึ่ง */
  BotManager.prototype._tickBot = function(bot, dt, now, deps){
    const ctl = bot.ctl;
    if(!ctl.ready) return;
    if(ctl.alive === false){
      /* รอบ 1602: บอทเกิดใหม่เองหลังโดนจัดหนักสักพัก (คนไม่เกิดใหม่ในรอบ แต่ลานต้องไม่เงียว
         ลูกศร/หน้ารอโหลดสัญญาครบ 10 ตลอดเกม) */
      if(bot._respawnAt && now >= bot._respawnAt && !deps.frozen){
        bot._respawnAt = 0;
        bot._revenge = null;
        if(ctl.resetForRound) ctl.resetForRound(bot._spawnPos || {x: 0, y: 0, z: 0, yaw: 0});
        bot._deadPlayed = false;
      }
      ctl.tick(dt, ZERO_INPUT, BOT_CAM, this.arena);
      /* ตาย: เล่นท่าล้มครั้งเดียวแล้วนอนรอเกิดใหม่/รอบใหม่ */
      if(ctl.alive === false && !bot._deadPlayed){
        bot._deadPlayed = true;
        if(!(ctl.playAction && ctl.playAction('knockDown')) && ctl.playAction) ctl.playAction('fall');
      }
      return;
    }
    if(ctl.tickVitals) ctl.tickVitals(dt, this.arena, null);

    const frozen = !!deps.frozen;
    bot.startDelay = Math.max(0, bot.startDelay - dt);
    bot.biteCd = Math.max(0, bot.biteCd - dt);

    /* สมอง: คิดเป็นจังหวะ ไม่ตัดสินใจทุกเฟรม */
    bot.think -= dt;
    if(bot.think <= 0 && !frozen && bot.startDelay <= 0){
      this._plan(bot, deps, now);
      bot.think = VF.rand(BOT.REACT_MIN, BOT.REACT_MAX);
    }

    /* รอบ 1602/1606: อัปเดตตำแหน่งคู่ต่อสู้สดทุกเฟรม (คน/เพื่อน/บอทผู้ถือตัวอักษร เคลื่อนเร็ว
       กว่าจังหวะคิดของบอท) · steal ยกเลิกเองถ้าเป้าหมายไม่ได้ถือตัวอักษรที่ต้องการแล้ว */
    if((bot.kind === 'brawl' || bot.kind === 'steal') && bot._foe){
      const foe = bot._foe;
      if(bot.kind === 'steal'){
        const need = bot.prog && !bot.prog.complete ? bot.prog.required() : null;
        let ok = false;
        if(need){
          if(foe.bot){
            const ob = this._byId(foe.id);
            if(ob && ob.ctl && ob.ctl.alive !== false && ob.prog && ob.prog.bag && ob.prog.bag.indexOf(need) >= 0){
              foe.x = ob.ctl.x; foe.z = ob.ctl.z; ok = true;
            }
          }else if(foe.local){
            if(deps.player && deps.player.alive !== false && deps.playerBag && deps.playerBag.indexOf(need) >= 0){
              foe.x = deps.player.x; foe.z = deps.player.z; ok = true;
            }
          }
        }
        if(!ok){ bot.kind = 'wander'; bot._foe = null; bot.target = null; }
      }else if(foe.local){
        if(!deps.player || deps.player.alive === false){ bot.kind = 'wander'; bot._foe = null; }
        else{ foe.x = deps.player.x; foe.z = deps.player.z; }
      }else if(foe.ref){
        if(foe.ref.alive === false){ bot.kind = 'wander'; bot._foe = null; }
        else{ foe.x = foe.ref.x; foe.z = foe.ref.z; }
      }else{
        bot.kind = 'wander'; bot._foe = null;
      }
      if(bot._foe && bot.target){ bot.target.x = bot._foe.x; bot.target.z = bot._foe.z; }
    }

    let input = ZERO_INPUT;
    if(!frozen && bot.startDelay <= 0 && bot.pauseT <= 0 && (bot.target || (bot._wps && bot._wps.length))){
      /* รอบ 1606: จุดหมาย = คิว waypoint หลบซ่อน (ถ้ามี) ไม่ก็ target ปกติที่ผ่านการเลี้ยงอาคาร */
      let gx = bot.target ? bot.target.x : ctl.x, gz = bot.target ? bot.target.z : ctl.z;
      if(bot._wps && bot._wps.length){
        gx = bot._wps[0].x; gz = bot._wps[0].z;
        if(Math.hypot(gx - ctl.x, gz - ctl.z) < 1.8){
          bot._wps.shift();
          if(!bot._wps.length && bot.kind === 'hide'){
            /* ถึงจุดหลับซ่อนแล้ว (ชั้นสองของอาคาร 2 ชั้น = ซอมบี้ตามไม่ถึง) — หยุดพักหายใจ */
            bot.kind = 'hideWait';
            bot.target = null;
            bot.pauseT = VF.rand(1.2, 2.6);
          }
        }
      }else if(bot.target && bot.kind !== 'hide'){
        const detour = this._route(ctl, gx, gz);
        if(detour){ gx = detour.x; gz = detour.z; }
      }
      if(bot._detour){
        /* จังหวะเบี่ยงตอนติดขัด — มีผลเหนือทุกอย่างชั่วคราว */
        bot._detour.t -= dt;
        if(bot._detour.t <= 0) bot._detour = null;
        else{ gx = bot._detour.x; gz = bot._detour.z; }
      }
      let dx = gx - ctl.x, dz = gz - ctl.z;
      const dist = Math.hypot(dx, dz);
      const arrive = (bot.kind === 'fight' || bot.kind === 'brawl' || bot.kind === 'steal') ? 1.4 : 1.0;
      if(dist > arrive){
        dx /= dist; dz /= dist;
        /* แยกตัวกันจากบอท/คนใกล้ตัว กันกลุ่มตัวแน่นโง่ ๆ */
        let sx = 0, sz = 0;
        const others = this.bots;
        for(let i = 0; i < others.length; i++){
          const o = others[i];
          if(o === bot || !o.ctl || o.ctl.alive === false) continue;
          const ox = ctl.x - o.ctl.x, oz = ctl.z - o.ctl.z;
          const od = Math.hypot(ox, oz);
          if(od > 0.001 && od < BOT.SEPAR_R){ sx += ox / od * (BOT.SEPAR_R - od); sz += oz / od * (BOT.SEPAR_R - od); }
        }
        if(deps.player && deps.player.alive !== false){
          const px = ctl.x - deps.player.x, pz = ctl.z - deps.player.z;
          const pd = Math.hypot(px, pz);
          if(pd > 0.001 && pd < BOT.SEPAR_R){ sx += px / pd * (BOT.SEPAR_R - pd) * 0.7; sz += pz / pd * (BOT.SEPAR_R - pd) * 0.7; }
        }
        dx += sx * 0.6; dz += sz * 0.6;
        const nl = Math.hypot(dx, dz) || 1;
        dx /= nl; dz /= nl;
        const mag = bot.walky && bot.kind === 'wander' ? 0.6 : (dist > 9 ? 1 : 0.85);
        input = {moveX: -dx * mag, moveZ: dz * mag, sprint: false, jump: false, block: false};
        /* รอบ 1606: ตรวจ "ติดขัด" — อยากเดินแต่แทบไม่ไปไหน → เดินเบี่ยงตั้งฉากชั่วคราว */
        if(bot._lx != null){
          const spd = Math.hypot(ctl.x - bot._lx, ctl.z - bot._lz) / Math.max(dt, 1e-4);
          if(spd < 0.5) bot._stuckT = (bot._stuckT || 0) + dt;
          else bot._stuckT = Math.max(0, (bot._stuckT || 0) - dt * 2);
          if(bot._stuckT > 1.1 && !bot._detour){
            const side = Math.random() < 0.5 ? 1 : -1;
            bot._detour = {x: ctl.x - dz * side * 5, z: ctl.z + dx * side * 5, t: 0.8};
            bot._stuckT = 0;
          }
        }
        bot._lx = ctl.x; bot._lz = ctl.z;
        /* กระโดดสลับเป็นจังหวะตอนวิ่งยาว (แบบคน) — นาน ๆ ครั้ง */
        if(bot.kind === 'hunt' && dist > 6 && ctl.grounded && Math.random() < dt * 0.25) input.jump = true;
      }else if(bot.kind === 'fight' || bot.kind === 'brawl' || bot.kind === 'steal'){
        input = {moveX: 0, moveZ: 0, block: false};
      }
      /* ซ่อนรออยู่ในอาคาร — ไม่ต้องทำอะไรจนกว่าจะคิดแผนใหม่ */
      /* สู้: หันหน้าหาซอมบี้ + ต่อย/เตะเป็นจังหวะ */
      if(bot.kind === 'fight' && bot._threat){
        const t = bot._threat;
        if(t.alive !== false && t.state !== 'gone'){
          ctl.yaw = Math.atan2((t.x || 0) - ctl.x, (t.z || 0) - ctl.z);
          const d = Math.hypot((t.x || 0) - ctl.x, (t.z || 0) - ctl.z);
          if(d < BOT.STRIKE_R && now >= bot.strikeAt && !(ctl.anim && ctl.anim.isBusy(now))){
            bot.strikeKind = ctl.anim && ctl.anim.has && ctl.anim.has('kick') && Math.random() < 0.4 ? 'kick' : 'punch';
            if(ctl.playAction(bot.strikeKind) || ctl.playAction('punch')){
              bot.strikeAt = now + VF.rand(850, 1400);
              bot._strikeIn = now + 230;
              bot._strikeTarget = t;
            }
          }else if(d < BOT.STRIKE_R && now < bot.strikeAt){
            input = {moveX: 0, moveZ: 0, block: (ctl.hp || 0) < (ctl.maxHp || 1000) * 0.5};
          }
        }else{
          bot.kind = 'wander';
          bot._threat = null;
        }
      }
      /* รอบ 1602/1606: ชกต่อยกับคน/บอทผู้ถือตัวอักษร — หันหน้าหาคู่ต่อสู้แล้วออกหมัด/เตะ */
      if((bot.kind === 'brawl' || bot.kind === 'steal') && bot._foe){
        const foe = bot._foe;
        ctl.yaw = Math.atan2((foe.x || 0) - ctl.x, (foe.z || 0) - ctl.z);
        const d = Math.hypot((foe.x || 0) - ctl.x, (foe.z || 0) - ctl.z);
        if(d < BOT.STRIKE_R && now >= bot.strikeAt && !(ctl.anim && ctl.anim.isBusy(now))){
          bot.strikeKind = ctl.anim && ctl.anim.has && ctl.anim.has('kick') && Math.random() < 0.4 ? 'kick' : 'punch';
          if(ctl.playAction(bot.strikeKind) || ctl.playAction('punch')){
            bot.strikeAt = now + VF.rand(850, 1400);
            bot._strikeIn = now + 230;
            bot._strikeFoe = foe;
            bot._strikeTarget = null;
          }
        }else if(d < BOT.STRIKE_R && now < bot.strikeAt){
          input = {moveX: 0, moveZ: 0, block: (ctl.hp || 0) < (ctl.maxHp || 1000) * 0.5};
        }
      }
    }

    if(bot.pauseT > 0) bot.pauseT = Math.max(0, bot.pauseT - dt);
    ctl.tick(dt, input, BOT_CAM, this.arena);
    /* กันอีเวนต์ค้างใน controller ที่ไม่มีใครมากิน */
    if(ctl.consumePowerJumpEvents) ctl.consumePowerJumpEvents();
    if(ctl.consumeDashAttack) ctl.consumeDashAttack();
    if(ctl.consumeOverdriveEvents) ctl.consumeOverdriveEvents();
    /* รอบ 1603: ป้ายชื่อ + แถบ HP เหนือหัวบอท — ซ่อนตาม pivot/เลือดหมด */
    if(bot.bar){
      const bMax = ctl.maxHp || VF.PLAYER_HP || 1000;
      const bHp = VF.clamp(ctl.hp != null ? ctl.hp : bMax, 0, bMax);
      bot.bar.set(bHp, bMax);
      if(deps.camera) bot.bar.follow(ctl.x, ctl.y || 0, ctl.z, deps.camera);
      bot.bar.group.visible = bot.ctl.pivot.visible !== false && bHp > 0;
    }

    if(frozen) return;

    /* ผลต่อยลงจริง */
    if(bot._strikeIn && now >= bot._strikeIn){
      bot._strikeIn = 0;
      const foeHit = bot._strikeFoe; bot._strikeFoe = null;
      if(foeHit){
        /* รอบ 1602: ต่อย/เตะโดนคน — ตัวเรา takeHit ตรง ๆ · เพื่อนออนไลน์แพ็ก strike ส่งไปเครื่องเขา */
        const pvpDmg = VF._t.meleePvpDamage ? VF._t.meleePvpDamage(bot.strikeKind) : 90;
        const dFoe = Math.hypot((foeHit.x || 0) - ctl.x, (foeHit.z || 0) - ctl.z);
        let hitSomeone = false;
        if(dFoe < (BOT.STRIKE_R || 2.3) + 0.6 && ctl.alive !== false){
          if(foeHit.bot){
            /* รอบ 1606: ต่อยบอทผู้ถือตัวอักษร — ดาเมจจริงผ่าน applyHit ตายแล้วตัวอักษรหลุด */
            const dealt = this.applyHit(foeHit.id, pvpDmg, {kind: bot.strikeKind || 'punch', fromId: bot.id});
            hitSomeone = dealt > 0;
          }else if(foeHit.local){
            if(deps.player && deps.player.alive !== false && deps.player.takeHit){
              const dealt = deps.player.takeHit(pvpDmg, !!deps.player.blocking, {from: 'player'});
              if(dealt > 0 && deps.onPlayerHurt) deps.onPlayerHurt(dealt);
              hitSomeone = dealt > 0;
            }
          }else if(foeHit.ref && foeHit.ref.alive !== false && deps.player && VF._t.notePvpHit){
            VF._t.notePvpHit(deps.player, {kind: bot.strikeKind || 'punch', zone: 'body', targetId: foeHit.id, dmg: pvpDmg});
            hitSomeone = true;
          }
        }
        if(hitSomeone && deps.fx && deps.fx.impact){
          const fwd2 = ctl.forward ? ctl.forward() : {x: 0, z: 1};
          deps.fx.impact(foeHit.x || ctl.x, (ctl.y || 0) + 1.15, foeHit.z || ctl.z, {kind: bot.strikeKind || 'punch', level: 'MEDIUM', dir: fwd2, force: 16});
        }
        if(hitSomeone && deps.audio && deps.audio.punchImpact && deps.player && Math.hypot(ctl.x - deps.player.x, ctl.z - deps.player.z) < 42) deps.audio.punchImpact();
      }else{
        const t = bot._strikeTarget; bot._strikeTarget = null;
        if(t && t.alive !== false && deps.enemies && deps.enemies.hurtInSphere && ctl.alive !== false){
          const fwd = ctl.forward ? ctl.forward() : {x: 0, z: 1};
          const tune = VF.CombatTune && VF.CombatTune.attack ? VF.CombatTune.attack(bot.strikeKind || 'punch') : {damage: 90, force: 16, lift: 2.5, level: 'LIGHT'};
          const origin = {x: ctl.x + fwd.x * 0.85, y: ctl.y + 1.0, z: ctl.z + fwd.z * 0.85};
          deps.enemies.hurtInSphere(origin, 1.5, {
            damage: tune.damage, force: tune.force, lift: tune.lift,
            dir: fwd, kind: bot.strikeKind || 'punch', origin: origin,
            reaction: tune.reaction, level: tune.level
          });
          if(deps.fx && deps.fx.impact) deps.fx.impact(t.x || origin.x, (t.y || 0) + 1.15, t.z || origin.z, {kind: bot.strikeKind || 'punch', level: tune.level, dir: fwd, force: tune.force});
          if(deps.audio && deps.audio.punchImpact && deps.player && Math.hypot(ctl.x - deps.player.x, ctl.z - deps.player.z) < 42) deps.audio.punchImpact();
        }
      }
    }

    /* ซอมบี้กัดบอท */
    if(bot.biteCd <= 0){
      const near = this._nearestThreat(bot, {list: (function(en){
        if(!en || !en.list) return [];
        return en.list.filter(function(e){ return e && e.alive && e.state !== 'gone'; });
      })(deps.enemies)});
      if(near && near.d < BOT.BITE_R){
        const blocked = !!ctl.blocking;
        const dmg = ctl.takeHit ? ctl.takeHit((VF.ZOMBIE_BITE || 80), blocked, {from: 'zombie'}) : 0;
        bot.biteCd = BOT.BITE_SEC;
        if(dmg > 0 && deps.audio && deps.audio.zombieBite && deps.player && Math.hypot(ctl.x - deps.player.x, ctl.z - deps.player.z) < 42) deps.audio.zombieBite();
      }
    }

    /* วงฮีลเติมเลือด — รอบ 1606: ครบทุกแท่น (4 จุดรอบลาน) */
    if(ctl.heal && VF._t.healPadContainsSpot && VF._t.healPadContainsSpot(ctl.x, ctl.z)) ctl.heal(24 * dt);

    /* เก็บตัวอักษร */
    if(deps.letters && deps.letters.tryCollect && bot.prog && !bot.prog.complete){
      const got = deps.letters.tryCollect(ctl, {uid: bot.id, now: now});
      if(got){
        const res = bot.prog.collect(got.letter);
        if(deps.audio && deps.audio.letter && deps.player && Math.hypot(ctl.x - deps.player.x, ctl.z - deps.player.z) < 50) deps.audio.letter();
        if(res && res.complete && res.reason !== 'extra'){
          if(this.onWin) this.onWin(bot);
        }
      }
    }
  };

  BotManager.prototype.tick = function(dt, now, deps){
    deps = deps || {};
    this._deps = deps;
    for(let i = 0; i < this.bots.length; i++){
      try{ this._tickBot(this.bots[i], dt, now, deps); }
      catch(err){ /* บอทตัวเดียวพังห้ามพาล้มทั้งเกม */ }
    }
  };

  BotManager.prototype.dispose = function(){
    this.bots.forEach(function(bot){
      if(bot.bar){ try{ bot.bar.dispose(); }catch(_){} bot.bar = null; }
      if(bot.tag){ try{ bot.tag.dispose(); }catch(_){} bot.tag = null; }
      if(bot.ctl){
        if(bot.ctl.anim && bot.ctl.anim.dispose) bot.ctl.anim.dispose();
        if(bot.ctl.pivot && bot.ctl.pivot.parent) bot.ctl.pivot.parent.remove(bot.ctl.pivot);
      }
    });
    this.bots = [];
  };

  VF.BotManager = BotManager;
})(typeof window !== 'undefined' ? window : globalThis);
