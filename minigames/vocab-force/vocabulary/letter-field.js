"use strict";
/* Exact word letters as world pickups, plus death-loot drops. One A–Z atlas, no extra downloads. */
(function(root){
  const VF = root.VocabForce = root.VocabForce || {};
  const COLS = 8, ROWS = 4, CELL = 64;

  function wordLetters(word){
    return String(word || '').toUpperCase().replace(/[^A-Z]/g, '').split('');
  }

  function hashSeed(word, seed){
    let h = (Number(seed) || 1) >>> 0;
    const s = String(word || '');
    for(let i = 0; i < s.length; i++) h = Math.imul(h, 31) + s.charCodeAt(i) | 0;
    return h >>> 0;
  }

  function rng(seed){
    let a = seed >>> 0;
    return function(){
      a = a + 0x6D2B79F5 | 0;
      let t = Math.imul(a ^ a >>> 15, 1 | a);
      t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
  }

  function dropRing(count, ox, oz, spread){
    const n = Math.max(0, count | 0);
    const out = [];
    const rad = Math.max(1.75, spread || 1.85);
    for(let i = 0; i < n; i++){
      const ang = (i / Math.max(1, n)) * Math.PI * 2 + 0.41;
      const r = rad + (n > 6 ? 0.55 : 0);
      out.push({x: (ox || 0) + Math.cos(ang) * r, z: (oz || 0) + Math.sin(ang) * r});
    }
    return out;
  }

  function scatterPoints(count, half, seed, minSpread, boxes){
    const rand = rng(hashSeed('scatter', seed));
    const inner = Math.max(12, (half || 28) - 8);
    const spread = minSpread || 8;
    const out = [];
    let guard = 0;
    while(out.length < count && guard++ < count * 40){
      const ang = rand() * Math.PI * 2;
      const rad = 14 + rand() * Math.max(8, inner - 14);
      const x = Math.cos(ang) * rad;
      const z = Math.sin(ang) * rad;
      if(Math.hypot(x, z) < 10) continue;
      let clash = out.some(function(p){ return Math.hypot(p.x - x, p.z - z) < spread; });
      if(!clash && boxes){
        clash = boxes.some(function(b){
          if(!b || b.broken || b.loose) return false;
          return x > b.minx - 1.2 && x < b.maxx + 1.2 && z > b.minz - 1.2 && z < b.maxz + 1.2;
        });
      }
      if(clash) continue;
      out.push({x: x, z: z});
    }
    while(out.length < count){
      const i = out.length;
      const a = (i / Math.max(1, count)) * Math.PI * 2;
      out.push({x: Math.cos(a) * (inner * 0.55), z: Math.sin(a) * (inner * 0.55)});
    }
    return out;
  }

  function makeAtlas(THREE){
    const canvas = document.createElement('canvas');
    canvas.width = COLS * CELL;
    canvas.height = ROWS * CELL;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = 'bold 44px Trebuchet MS, sans-serif';
    for(let i = 0; i < 26; i++){
      const cx = (i % COLS) * CELL + CELL / 2;
      const cy = Math.floor(i / COLS) * CELL + CELL / 2;
      const g = ctx.createRadialGradient(cx, cy, 6, cx, cy, 28);
      g.addColorStop(0, '#7cffcf');
      g.addColorStop(1, '#12382c');
      ctx.fillStyle = g;
      ctx.beginPath(); ctx.arc(cx, cy, 28, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = '#fff4b0';
      ctx.lineWidth = 3;
      ctx.stroke();
      ctx.fillStyle = '#081018';
      ctx.fillText(String.fromCharCode(65 + i), cx, cy + 2);
    }
    const tex = new THREE.CanvasTexture(canvas);
    tex.needsUpdate = true;
    return tex;
  }

  function LetterField(){
    this.list = [];
    this.scene = null;
    this.atlas = null;
    this.mats = {};
    this.word = '';
    this.seed = 0;
    this._seenDrops = {};
  }

  LetterField.prototype.attach = function(scene){
    this.scene = scene;
    return this;
  };

  LetterField.prototype._mat = function(THREE, ch){
    if(this.mats[ch]) return this.mats[ch];
    if(!this.atlas) this.atlas = makeAtlas(THREE);
    const i = ch.charCodeAt(0) - 65;
    const tex = this.atlas.clone();
    tex.repeat.set(1 / COLS, 1 / ROWS);
    tex.offset.set((i % COLS) / COLS, 1 - (Math.floor(i / COLS) + 1) / ROWS);
    tex.needsUpdate = true;
    this.mats[ch] = new THREE.SpriteMaterial({map: tex, transparent: true, depthWrite: false});
    return this.mats[ch];
  };

  LetterField.prototype.clear = function(){
    this.list.forEach(function(it){
      if(it.mesh && it.mesh.parent) it.mesh.parent.remove(it.mesh);
    });
    this.list = [];
    this._seenDrops = {};
  };

  LetterField.prototype._addItem = function(THREE, ch, x, z, y, extra){
    extra = extra || {};
    const height = extra.height != null ? extra.height : 1.55;
    let mesh = null;
    if(THREE && THREE.Sprite){
      mesh = new THREE.Sprite(this._mat(THREE, ch));
      mesh.scale.set(extra.loot ? 1.6 : 1.45, extra.loot ? 1.6 : 1.45, 1);
      mesh.position.set(extra.mx != null ? extra.mx : x, y + height + (extra.fall || 0), extra.mz != null ? extra.mz : z);
      mesh.name = extra.loot ? 'VFLootLetter' : 'VFLetter';
      if(this.scene) this.scene.add(mesh);
    }
    const it = {
      letter: ch, x: x, y: y, z: z,
      mx: extra.mx != null ? extra.mx : x,
      mz: extra.mz != null ? extra.mz : z,
      mesh: mesh, taken: false,
      bob: extra.bob || 0,
      height: height,
      loot: !!extra.loot,
      ownerId: extra.ownerId || '',
      ownerUntil: extra.ownerUntil || 0,
      dropId: extra.dropId || '',
      fall: extra.fall || 0
    };
    this.list.push(it);
    return it;
  };

  LetterField.prototype.spawn = function(THREE, word, arena, seed){
    this.clear();
    this.word = String(word || '').toUpperCase();
    this.seed = seed || 1;
    const letters = wordLetters(this.word);
    const half = arena && arena.half || VF.ARENA_HALF || 280;
    const spots = scatterPoints(letters.length, half, hashSeed(this.word, this.seed), 14, arena && arena.boxes);
    for(let i = 0; i < letters.length; i++){
      const pos = spots[i];
      const y = arena && arena.surfaceY ? arena.surfaceY(pos.x, pos.z) : 0;
      this._addItem(THREE, letters[i], pos.x, pos.z, y, {bob: i * 0.7});
    }
    return this.list;
  };

  LetterField.prototype.dropAround = function(THREE, letters, origin, arena, opts){
    opts = opts || {};
    const bag = (letters || []).map(function(ch){
      return String(ch || '').slice(0, 1).toUpperCase();
    }).filter(function(ch){ return /[A-Z]/.test(ch); });
    if(!bag.length) return [];
    const ox = Number(origin && origin.x) || 0;
    const oz = Number(origin && origin.z) || 0;
    const half = (arena && arena.half) || VF.ARENA_HALF || 280;
    const spots = dropRing(bag.length, ox, oz, opts.spread);
    const now = opts.now != null ? opts.now : 0;
    const ownerUntil = opts.ownerId ? now + (opts.ownerLockMs || 0) : 0;
    const spawned = [];
    for(let i = 0; i < bag.length; i++){
      let x = VF.clamp(spots[i].x, -half + 2, half - 2);
      let z = VF.clamp(spots[i].z, -half + 2, half - 2);
      const y = arena && arena.surfaceY ? arena.surfaceY(x, z) : ((origin && origin.y) || 0);
      spawned.push(this._addItem(THREE, bag[i], x, z, y, {
        loot: true,
        mx: ox, mz: oz,
        ownerId: opts.ownerId || '',
        ownerUntil: ownerUntil,
        dropId: opts.dropId || '',
        bob: i * 0.5,
        fall: 1.35
      }));
    }
    return spawned;
  };

  LetterField.prototype.applyPeerDrop = function(THREE, payload, arena){
    const id = String(payload && payload.id || '');
    if(!id || this._seenDrops[id]) return [];
    this._seenDrops[id] = true;
    const bag = payload.letters || String(payload.bag || '').split('');
    return this.dropAround(THREE, bag, payload, arena, {
      dropId: id,
      ownerId: payload.uid || payload.ownerId || '',
      ownerLockMs: 0,
      now: 0
    });
  };

  LetterField.prototype.tick = function(dt, now){
    const t = (now || VF.now()) / 1000;
    const step = Math.max(0, dt || 0);
    for(let i = 0; i < this.list.length; i++){
      const it = this.list[i];
      if(it.loot && !it.taken){
        if(it.fall > 0) it.fall = Math.max(0, it.fall - step * 3.4);
        it.mx += (it.x - it.mx) * Math.min(1, step * 7.2);
        it.mz += (it.z - it.mz) * Math.min(1, step * 7.2);
      }
      if(!it.mesh) continue;
      it.mesh.visible = !it.taken;
      if(it.taken) continue;
      const px = it.loot ? it.mx : it.x;
      const pz = it.loot ? it.mz : it.z;
      it.mesh.position.set(px, it.y + it.height + (it.fall || 0) + Math.sin(t * 2.4 + it.bob) * 0.14, pz);
    }
  };

  LetterField.prototype.tryCollect = function(player, opts){
    if(!player) return null;
    const now = opts && opts.now != null ? opts.now : VF.now();
    const uid = opts && opts.uid != null ? opts.uid : (player.uid || '');
    let best = null, bestD = 1.45;
    for(let i = 0; i < this.list.length; i++){
      const it = this.list[i];
      if(it.taken) continue;
      if(it.ownerId && uid && it.ownerId === uid && now < (it.ownerUntil || 0)) continue;
      const d = Math.hypot(it.x - player.x, it.z - player.z);
      if(d < bestD){ best = it; bestD = d; }
    }
    if(!best) return null;
    best.taken = true;
    if(best.mesh) best.mesh.visible = false;
    return best;
  };

  LetterField.prototype.restore = function(){
    for(let i = 0; i < this.list.length; i++){
      const it = this.list[i];
      it.taken = false;
      if(it.mesh) it.mesh.visible = true;
    }
    return this;
  };

  LetterField.prototype.nearest = function(ch, ox, oz){
    const want = String(ch || '').slice(0, 1).toUpperCase();
    if(!want) return null;
    let best = null, bestD = Infinity;
    for(let i = 0; i < this.list.length; i++){
      const it = this.list[i];
      if(!it || it.taken) continue;
      if(it.letter !== want) continue;
      const d = Math.hypot((it.x || 0) - (ox || 0), (it.z || 0) - (oz || 0));
      if(d < bestD){ best = it; bestD = d; }
    }
    return best;
  };

  VF.LetterField = LetterField;
  VF._t.wordLetters = wordLetters;
  VF._t.hashSeed = hashSeed;
  VF._t.scatterPoints = scatterPoints;
  VF._t.dropRing = dropRing;
})(typeof window !== 'undefined' ? window : globalThis);
