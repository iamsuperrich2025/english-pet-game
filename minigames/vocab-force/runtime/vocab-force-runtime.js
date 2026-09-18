"use strict";
/* VocabForceRuntime — move, fight, collect letters in order, reward, next word. */
(function(root){
  const VF = root.VocabForce = root.VocabForce || {};
  let opening = false, running = false, raf = 0, last = 0;
  let renderer = null, scene = null, camera = null, THREE = null;
  let player, camRig, input, combat, enemies, arena, fx, hud, round, flyers, trails, fireTrail, secondary, energy, letters, net, healPad;
  let winLock = false, ackOpen = false, pendingWord = null;
  let collusionWatch = null, collusionPending = null;
  const CORE = ['run', 'punch', 'kick', 'block', 'jump', 'vault'];

  function loadThree(){
    if(root.THREE) return Promise.resolve();
    const src = (VF.vendorPath || 'js/vendor/') + 'three.min.js';
    if(typeof loadScriptOnce === 'function') return loadScriptOnce(src);
    return new Promise(function(resolve, reject){
      const s = document.createElement('script');
      s.src = src;
      s.onload = resolve;
      s.onerror = function(){ reject(new Error('THREE missing')); };
      document.head.appendChild(s);
    });
  }

  function projectToHud(x, y, z){
    const v = new THREE.Vector3(x, y, z).project(camera);
    const w = hud.root.clientWidth, h = hud.root.clientHeight;
    return {x: (v.x * 0.5 + 0.5) * w, y: (-v.y * 0.5 + 0.5) * h};
  }

  async function loadClips(def){
    const states = (def && def.core) || CORE;
    const extra = (def && def.optional) || ['victory', 'heavyKick'];
    const total = states.length;
    const label = (def && def.displayName) || 'NEX';
    for(let i = 0; i < total; i++){
      try{ await player.ingestClip(states[i]); }
      catch(err){ console.warn('[VocabForce] clip skip', states[i], err); }
      hud.setLoad((i + 1) / total * 0.4 + 0.22, 'กำลังโหลดท่า ' + label);
    }
    extra.forEach(function(state){
      player.ingestClip(state).catch(function(){});
    });
  }

  function playerName(){
    try{
      if(typeof state !== 'undefined' && state && state.profileName) return String(state.profileName).slice(0, 40);
    }catch(_){}
    return 'ผู้เล่น';
  }

  function beginRound(preferred){
    winLock = false;
    ackOpen = false;
    pendingWord = null;
    round.start(preferred);
    if(letters) letters.spawn(THREE, round.progress.word, arena, round.seed);
    if(hud){
      if(hud.hideWin) hud.hideWin();
      hud.paintRound(round);
    }
    if(player && player.alive !== false) player.setPose(player.x || 0, arena.surfaceY(player.x || 0, player.z || 0), player.z || 0, player.yaw);
    if(collusionWatch && collusionWatch.reset) collusionWatch.reset();
    syncHunters();
  }

  function announceWin(info){
    if(!running || winLock || !hud) return;
    winLock = true;
    ackOpen = true;
    info = info || {};
    const payload = {
      name: info.name || playerName(),
      word: info.word || (round && round.progress && round.progress.word) || '',
      thai: info.thai || (round && round.progress && round.progress.thai) || '',
      reward: info.reward != null ? info.reward : VF.LETTER_REWARD,
      local: !!info.local,
      uid: info.uid || '',
      av: info.av || '',
      def: info.def || null
    };
    hud.paintRound(round);
    hud.showWin(payload);
    VF.audio.complete();
    if(payload.local){
      VF.audio.coin();
      if(hud.flyCoins){
        requestAnimationFrame(function(){ if(hud && hud.flyCoins) hud.flyCoins(payload.reward); });
      }
      if(player && player.playAction) player.playAction('victory');
      if(camRig && camRig.impulse) camRig.impulse(0.9);
    }
    if(fx && fx.celebrate && player) fx.celebrate(player.x, player.y + 1, player.z);
  }

  function acknowledgeWin(){
    if(!ackOpen) return;
    ackOpen = false;
    if(hud && hud.hideWin) hud.hideWin();
    if(!running) return;
    if(!net || (net.isHost && net.isHost())){
      beginRound();
      return;
    }
    if(pendingWord){
      const next = pendingWord;
      pendingWord = null;
      beginRound(next);
    }
  }

  function handlePickup(item){
    if(!item || !round || ackOpen || winLock) return;
    const result = round.onLetter(item.letter);
    const pos = projectToHud(item.x, (item.y || 0) + 1.8, item.z);
    hud.flyLetter(item.letter, pos.x, pos.y);
    if(result.ok){
      VF.audio.letter();
      hud.paintRound(round);
      if(result.complete && result.reason !== 'extra'){
        const reward = round.creditIfComplete();
        announceWin({
          name: playerName(),
          word: round.progress.word,
          thai: round.progress.thai,
          reward: reward,
          local: true,
          uid: (typeof onlineKey === 'function' && onlineKey()) || '',
          def: player && player.def,
          av: player && player.def && player.def.id
        });
      }
    }
  }

  function loseLifeLetters(){
    if(!round) return;
    if(round.progress && round.progress.complete){
      hud.toast('หมดแรง · เกิดใหม่ที่กลางลาน');
      return;
    }
    const bag = (round.progress && round.progress.bag || []).slice();
    round.dropLife();
    if(bag.length && letters && letters.dropAround){
      letters.dropAround(THREE, bag, player, arena, {
        ownerId: (net && net.myUid) || 'local',
        ownerLockMs: 0,
        now: VF.now()
      });
      if(player){
        player._vfDropSeq = (player._vfDropSeq || 0) + 1;
        player._vfDrop = {letters: bag.join(''), seq: player._vfDropSeq};
      }
    }
    hud.showComplete('', false);
    hud.paintRound(round);
    hud.toast(bag.length ? 'ตายแล้ว · ตัวอักษรตกที่พื้น ให้เพื่อนเก็บได้' : 'หมดแรง · เกิดใหม่ที่กลางลาน');
  }

  function handleDefeat(en){
    if(!en || en._collected) return;
    en._collected = true;
    setTimeout(function(){
      if(enemies && enemies.remove) enemies.remove(en);
      syncHunters();
    }, 1400);
  }

  let zomReady = false, zomLoading = false;
  function ensureZombies(){
    if(zomReady || zomLoading) return Promise.resolve(zomReady);
    if(!VF.ZomAssets || !VF.ZomAssets.prepare) return Promise.resolve(false);
    zomLoading = true;
    return VF.ZomAssets.prepare().then(function(){
      zomReady = true;
      zomLoading = false;
      syncHunters();
      return true;
    }).catch(function(err){
      zomLoading = false;
      console.warn('[VocabForce] zombie load skip', err);
      return false;
    });
  }

  function syncHunters(){
    const humans = net && net.humanCount ? net.humanCount() : 1;
    const want = Math.max(0, (VF.HUNTER_FILL || 6) - humans);
    if((want > 0 || collusionPending) && !zomReady){ ensureZombies(); return; }
    if(enemies && enemies.spawnHunters) enemies.spawnHunters(want, arena);
    if(collusionPending && zomReady && enemies && enemies.spawnCollusionHunters){
      enemies.spawnCollusionHunters(collusionPending.extra, arena, collusionPending.around);
      collusionPending = null;
    }
  }

  function peopleSnap(){
    if(net && net.bodies) return net.bodies(player);
    if(!player) return [];
    return [{
      id: (net && net.myUid) || 'local',
      x: player.x || 0,
      z: player.z || 0,
      alive: player.alive !== false,
      local: true
    }];
  }

  function tickCollusion(dt){
    if(ackOpen || winLock || !player) return;
    if(!collusionWatch && VF._t.makeCollusionWatch) collusionWatch = VF._t.makeCollusionWatch();
    if(!collusionWatch) return;
    const people = peopleSnap();
    if(enemies && enemies.setPrey) enemies.setPrey(people);
    const field = letters && letters.list ? letters.list : [];
    const verdict = collusionWatch.sample({people: people, letters: field}, dt);
    if(!verdict || !verdict.justArmed) return;
    const around = people.filter(function(p){
      return p.alive !== false && verdict.ids.indexOf(p.id) >= 0;
    });
    collusionPending = {extra: verdict.extra || VF.COLLUSION_HUNTERS || 4, around: around};
    if(hud && hud.toast) hud.toast('ซอมบี้โผล่ · อย่าเปิดทางให้คนเดียวเก็บ');
    syncHunters();
  }

  function handlePowerJumpEvent(ev, local){
    if(!ev) return;
    const T = VF.PowerJumpTune || {};
    if(ev.type === 'launch' || ev.phase === 'launch'){
      if(fx && fx.powerJumpLaunch) fx.powerJumpLaunch(ev.x, ev.y, ev.z, ev.dirX, ev.dirZ);
      if(local && VF.audio && VF.audio.powerJumpLaunch) VF.audio.powerJumpLaunch();
      return;
    }
    const hit = VF._t.powerJumpGroundHit ? VF._t.powerJumpGroundHit(arena, ev.x, ev.y, ev.z) : {x: ev.x, y: ev.y, z: ev.z, nx: 0, ny: 1, nz: 0};
    if(fx && fx.powerJumpImpact) fx.powerJumpImpact(hit, ev.strength, {dirX: ev.dirX, dirZ: ev.dirZ, local: !!local, player: player});
    if(local){
      if(camRig && camRig.impulse){
        camRig.impulse((T.CAMERA_SHAKE_STRENGTH || 0.85) * (ev.strength || 1), T.CAMERA_SHAKE_FOV || 3.2, {low: true});
      }
      if(VF.audio && VF.audio.powerJumpLand) VF.audio.powerJumpLand();
    }
    if(VF._t.powerJumpBlast) VF._t.powerJumpBlast(ev, enemies, player);
  }

  function handleOverdriveEvent(ev, local){
    if(!ev || !fireTrail) return;
    if(local) return;
    if(ev.phase === 'start' || ev.type === 'start'){
      if(fireTrail.markPeer) fireTrail.markPeer(ev.uid, ev.x, ev.y, ev.z);
      return;
    }
    if(fireTrail.endPeer) fireTrail.endPeer(ev.uid, ev.x, ev.y, ev.z);
  }

  function loop(t){
    if(!running) return;
    raf = requestAnimationFrame(loop);
    const now = t || VF.now();
    let dt = last ? (now - last) / 1000 : 0.016;
    last = now;
    dt = VF.clamp(dt, 0, 0.05);
    const poll = input.poll();
    if(poll.exit){ close(); return; }
    if(ackOpen){
      if(player && player.anim) player.anim.tick(dt);
      if(player && player._sync) player._sync();
      if(fx) fx.tick(dt);
      if(camRig) camRig.tick(dt, player);
      if(hud && hud.quest) hud.quest.hide();
      tickNet(dt);
      renderer.render(scene, camera);
      return;
    }
    if(poll.lookX || poll.lookY) camRig.look(poll.lookX, poll.lookY);
    const paused = combat.hitStop > 0;
    if(secondary && !paused) secondary.tickClock(dt);
    const scale = paused ? 0 : (secondary ? secondary.simScale(combat.hitStop) : 1);
    const step = paused ? 0 : dt * scale;
    combat.tick(dt, now, player, enemies, fx, camRig, VF.audio, secondary);
    if(!paused && poll.dash) player.tryManualDash(poll, camRig, arena, fx, camRig, now);
    if(!paused && poll.punch) combat.handleAttackPress('punch', player, now, enemies, camRig, arena, fx, energy, VF.audio, {hold: !!poll.punchHeld});
    if(!paused && poll.kick) combat.tryAttackOrApproach(player.anim.has('kick') ? 'kick' : 'punch', player, now, enemies, camRig, arena, fx);
    const freezeMove = energy && energy.hold && energy.hold.active && Math.hypot(poll.moveX || 0, poll.moveZ || 0) > ((VF.EnergyAttackTune && VF.EnergyAttackTune.aimStickDeadzone) || 0.12);
    player.tick(step, freezeMove ? Object.assign({}, poll, {moveX: 0, moveZ: 0}) : poll, camRig, arena);
    if(player.consumePowerJumpEvents){
      player.consumePowerJumpEvents().forEach(function(ev){ handlePowerJumpEvent(ev, true); });
    }
    if(player.consumeOverdriveEvents) player.consumeOverdriveEvents();
    const chained = player.consumeDashAttack && player.consumeDashAttack();
    if(chained) combat.tryAttack(chained, player, now);
    if(hud && hud.setDashCooldown) hud.setDashCooldown(player.dashCooldownFrac(now));
    if(enemies && enemies.setPrey) enemies.setPrey(peopleSnap());
    const sim = enemies.tick(step, player, arena);
    (sim.dead || []).forEach(handleDefeat);
    (sim.bites || []).forEach(function(b){
      if(!player || !player.takeHit) return;
      const dmg = player.takeHit(b.damage, !!player.blocking);
      if(dmg > 0){
        camRig.impulse(0.28, 2.4);
        if(hud && hud.setHp) hud.setHp(player.hp, player.maxHp);
        if(hud && hud.hurtFlash) hud.hurtFlash(dmg / (player.maxHp || 100));
        if(player.consumeDeath && player.consumeDeath()) loseLifeLetters();
      }
    });
    if(letters){
      letters.tick(dt, now);
      if(player && player.alive !== false && round && round.progress && !round.progress.complete && !winLock){
        const got = letters.tryCollect(player, {uid: net && net.myUid, now: now});
        if(got) handlePickup(got);
      }
    }
    if(player && player.tickVitals){
      player.tickVitals(dt, arena, camera);
      if(hud && hud.setHp) hud.setHp(player.hp, player.maxHp);
      if(player.alive && player._vfDrop) player._vfDrop = null;
    }
    if(enemies && enemies.billboard) enemies.billboard(camera);
    if(fx && sim.fires){
      sim.fires.forEach(function(f){
        if(fx.arenaFire) fx.arenaFire(f.x, f.y, f.z);
        if(VF.audio && VF.audio.arenaFire) VF.audio.arenaFire();
        if(camRig && camRig.impulse) camRig.impulse(0.42, 3.2);
      });
    }
    if(secondary && sim.impacts){
      sim.impacts.forEach(function(ev){
        secondary.handle(ev, player, combat, camRig, fx, VF.audio);
      });
    }
    (sim.lands || []).forEach(function(land){
      if(land.secondary) return;
      if(fx && fx.land) fx.land(land.x, land.y, land.z, land.speed);
      if(VF.audio && VF.audio.enemyLand) VF.audio.enemyLand();
      if(camRig && land.heavy && Math.hypot(player.x - land.x, player.z - land.z) < VF.CombatTune.LAND_SHAKE_NEAR){
        camRig.impulse(0.22, 3);
      }
    });
    if(healPad) healPad.tick(step, player, hud, VF.audio, camRig);
    if(energy) energy.tick(step, now, player, enemies, arena, fx, camRig, combat, VF.audio, {held: !!poll.punchHeld, released: !!poll.punchReleased, moveX: poll.moveX || 0, moveZ: poll.moveZ || 0});
    if(secondary) secondary.trails(step, enemies, fx, player);
    fx.tick(dt);
    if(trails) trails.tick(step);
    if(fireTrail) fireTrail.tick(dt, enemies, player);
    camRig.tick(dt, player);
    const needed = round && round.progress && !round.progress.complete ? round.progress.required() : null;
    if(hud && hud.quest){
      try{
        const target = needed && letters && letters.nearest ? letters.nearest(needed, player.x, player.z) : null;
        if(target && camera) hud.quest.update(camera, target, needed, THREE || root.THREE);
        else hud.quest.hide();
      }catch(_){
        hud.quest.hide();
      }
    }
    if(net) tickNet(dt);
    tickCollusion(dt);
    renderer.render(scene, camera);
  }

  function tickNet(dt){
    if(!net) return;
    const info = net.tick(dt, player, round, camera, function(name, word, thai, uid, av){
      announceWin({
        name: name || 'เพื่อน',
        word: word,
        thai: thai || '',
        reward: VF.LETTER_REWARD,
        local: false,
        uid: uid || '',
        av: av || ''
      });
    });
    if(hud && hud.setNet) hud.setNet(net.statusText());
    if(info && info.hunters != null) syncHunters();
    if(letters && letters.applyPeerDrop && net.consumeDrops){
      net.consumeDrops().forEach(function(drop){
        letters.applyPeerDrop(THREE, drop, arena);
      });
    }
    if(fx && net.consumeJumps){
      net.consumeJumps().forEach(function(ev){ handlePowerJumpEvent(ev, false); });
    }
    if(fireTrail && net.consumeOverdrive){
      net.consumeOverdrive().forEach(function(ev){ handleOverdriveEvent(ev, false); });
    }
  }

  function resize(){
    if(!renderer || !hud || !hud.root) return;
    const w = hud.root.clientWidth || window.innerWidth;
    const h = hud.root.clientHeight || window.innerHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / Math.max(1, h);
    camera.updateProjectionMatrix();
  }

  async function open(){
    if(!VF.adminAllowed()){
      if(typeof toast === 'function') toast(VF.LOCK_MSG);
      return;
    }
    if(opening || running) return;
    opening = true;
    try{
      hud = new VF.VocabForceHUD();
      hud.mount();
      hud.onAck = acknowledgeWin;
      hud.root.classList.add('is-selecting');
      if(typeof Music !== 'undefined' && Music.suspendBg) Music.suspendBg();
      if(VF.audio && VF.audio.startBgm) VF.audio.startBgm();
      const picker = new VF.CharacterSelect().mount(hud.root);
      const picked = await picker.wait();
      if(!picked){
        if(VF.audio && VF.audio.stopBgm) VF.audio.stopBgm(400);
        if(typeof Music !== 'undefined' && Music.resumeBg) Music.resumeBg();
        if(hud) hud.hide();
        opening = false;
        return;
      }
      picker.hide();
      hud.root.classList.remove('is-selecting');
      hud.root.classList.add('is-booting');
      hud.setLoad(0.04, 'กำลังเตรียมโลก', picked);
      await loadThree();
      THREE = root.THREE;
      if(!renderer){
        renderer = new THREE.WebGLRenderer({antialias: false, alpha: false, powerPreference: 'high-performance'});
        renderer.setPixelRatio(Math.min(VF.DPR_CAP, root.devicePixelRatio || 1));
        renderer.setClearColor(0x0a1228, 1);
        if(renderer.outputEncoding != null && THREE.sRGBEncoding != null) renderer.outputEncoding = THREE.sRGBEncoding;
        if(THREE.ACESFilmicToneMapping != null){
          renderer.toneMapping = THREE.ACESFilmicToneMapping;
          renderer.toneMappingExposure = 1.12;
        }
        hud.els.stage.appendChild(renderer.domElement);
      }else if(!renderer.domElement.parentNode){
        hud.els.stage.appendChild(renderer.domElement);
      }
      hud.setLoad(0.10, 'กำลังสร้างสนาม', picked);
      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(52, 1, 0.12, VF.CAMERA_FAR || 980);
      arena = new VF.PrototypeArena().build(scene);
      healPad = VF.HealPad ? new VF.HealPad().attach(scene) : null;
      fx = new VF.ImpactFXManager().attach(scene);
      trails = new VF.MotionTrailManager().attach(scene);
      fireTrail = VF.OverdriveFireTrail ? new VF.OverdriveFireTrail().attach(scene) : null;
      secondary = new VF.SecondaryImpactController();
      energy = new VF.EnergyAttackController().attach(scene);
      enemies = new VF.EnemyManager().attach(scene);
      letters = new VF.LetterField().attach(scene);
      camRig = new VF.ThirdPersonCamera().attach(camera);
      player = new VF.NexCharacterController();
      hud.setLoad(0.18, 'กำลังโหลดตัวละคร ' + picked.displayName, picked);
      await player.attach(scene, picked);
      if(trails) trails.bind(player);
      if(fireTrail && fireTrail.bind) fireTrail.bind(player);
      hud.setLoad(0.22, 'กำลังโหลดแอนิเมชัน', picked);
      await loadClips(picked);
      hud.setLoad(0.62, 'กำลังเข้าสนาม', picked);
      round = new VF.VocabularyRoundController();
      combat = new VF.CombatController();
      input = new VF.VocabForceInput();
      input.bind(hud.root, hud.els);
      if(energy && energy.bindHud) energy.bindHud(hud.root.querySelector('.vf-punch'), hud);
      beginRound();
      net = new VF.VocabForceNet();
      net.start(scene, player, function(pair){
        if(!running || !pair || !pair.w) return;
        if(round.progress && pair.w === round.progress.word && pair.seed === round.seed) return;
        if(ackOpen){ pendingWord = pair; return; }
        beginRound(pair);
      }, function(){
        if(hud && hud.setNet && net) hud.setNet(net.statusText());
        syncHunters();
      });
      if(hud.setNet) hud.setNet(net.statusText());
      ensureZombies();
      hud.setLoad(1, 'พร้อม');
      hud.root.classList.remove('is-booting');
      hud.root.classList.add('is-playing');
      window.addEventListener('resize', resize);
      resize();
      VF.audio.resume();
      if(VF.audio.startBgm) VF.audio.startBgm();
      running = true; last = 0;
      requestAnimationFrame(loop);
    }catch(err){
      console.error('VocabForce open fail', err);
      if(net){ try{ net.stop(); }catch(_){} net = null; }
      if(VF.audio && VF.audio.stopBgm) VF.audio.stopBgm(400);
      if(typeof Music !== 'undefined' && Music.resumeBg) Music.resumeBg();
      if(hud) hud.toast('เปิด Vocab Force ไม่สำเร็จ');
      if(typeof toast === 'function') toast('⚠️ เปิด Vocab Force ไม่สำเร็จ');
    }
    opening = false;
  }

  function close(){
    running = false;
    winLock = false;
    ackOpen = false;
    pendingWord = null;
    collusionWatch = null;
    collusionPending = null;
    if(raf) cancelAnimationFrame(raf);
    raf = 0;
    if(input) input.unbind();
    if(round) round.settle();
    if(VF.audio && VF.audio.stopBgm) VF.audio.stopBgm();
    if(typeof Music !== 'undefined' && Music.resumeBg) Music.resumeBg();
    if(typeof saveState === 'function') saveState();
    if(typeof renderDashboard === 'function') renderDashboard();
    window.removeEventListener('resize', resize);
    if(hud && hud.root){
      hud.root.classList.remove('is-selecting', 'is-booting', 'is-playing', 'is-winning');
    }
    if(net){ net.stop(); net = null; }
    if(letters) letters.clear();
    if(hud) hud.hide();
    if(enemies) enemies.clear();
    if(healPad && healPad.dispose) healPad.dispose();
    healPad = null;
    if(fx) fx.dispose();
    if(trails) trails.dispose();
    if(fireTrail && fireTrail.dispose) fireTrail.dispose();
    fireTrail = null;
    secondary = null;
    if(player && player.anim) player.anim.dispose();
  }

  VF.open = open;
  VF.close = close;
  VF._t.live = function(){ return {player: player, enemies: enemies, round: round, combat: combat, cam: camRig, secondary: secondary, fx: fx, character: player && player.def}; };
})(typeof window !== 'undefined' ? window : globalThis);
