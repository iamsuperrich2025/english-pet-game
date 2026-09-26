"use strict";
/* VocabForceRuntime — move, fight, collect letters in order, reward, next word. */
(function(root){
  const VF = root.VocabForce = root.VocabForce || {};
  let opening = false, running = false, raf = 0, last = 0;
  let renderer = null, scene = null, camera = null, THREE = null;
  let player, camRig, input, combat, enemies, arena, fx, hud, round, flyers, trails, fireTrail, secondary, energy, letters, net, healPad, oilTanker, sedan, grab, spectator, worldMelee;
  let winLock = false, ackOpen = false, pendingWord = null;
  let collusionWatch = null, collusionPending = null;
  let tankerEventSeq = 0;
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
    /* รอบ 1570: lift/throw ต้องถูก ingest เสมอ (ท่ายกค้าง+ขว้างของระบบแบกยานพาหนะ) — เดิมอยู่นอก core จึงไม่เคยถูกโหลด */
    const states = ((def && def.core) || CORE).concat(['lift', 'throw']);
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
    if(net && net.resetRound) net.resetRound(round.seed);
    if(combat && combat.reset) combat.reset();
    if(energy && energy.cancel) energy.cancel();
    if(fireTrail && fireTrail.clear) fireTrail.clear();
    if(oilTanker && oilTanker.reset) oilTanker.reset(round.seed);
    if(sedan && sedan.reset) sedan.reset(round.seed);
    if(player) player.carrying = null;
    if(letters) letters.spawn(THREE, round.progress.word, arena, round.seed);
    if(hud){
      if(hud.hideWin) hud.hideWin();
      hud.paintRound(round);
      if(hud.setSpectator) hud.setSpectator(false);
    }
    if(spectator) spectator.exit();
    if(input && input.setSpectating) input.setSpectating(false);
    if(player){
      const ids = net && net.participantIds ? net.participantIds() : ['local'];
      const mine = net && net.myUid || 'local';
      const avoid = oilTanker && oilTanker.spawnAvoidance ? oilTanker.spawnAvoidance() : {x: (VF.TANKER_SPAWN || {}).x || 84, z: (VF.TANKER_SPAWN || {}).z || -18, radius: 18};
      const pos = VF._t.fairSpawn ? VF._t.fairSpawn(ids, mine, round.seed, arena, avoid) : {x: 0, y: arena.surfaceY(0, 0), z: 0, yaw: 0};
      if(player.resetForRound) player.resetForRound(pos);
      else{
        player.hp = player.maxHp || VF.PLAYER_HP || 1000;
        player.alive = true;
        player.setPose(pos.x, pos.y, pos.z, pos.yaw);
      }
      if(hud && hud.setHp) hud.setHp(player.hp, player.maxHp);
    }
    if(collusionWatch && collusionWatch.reset) collusionWatch.reset();
    if(enemies && enemies.resetHunterWave) enemies.resetHunterWave();
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
        const reward = round.creditIfComplete(net && net.humanCount ? net.humanCount() : 1);
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
      hud.toast('หมดแรง · ชมเพื่อนจนกว่าจะขึ้นคำใหม่');
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
    hud.toast(bag.length ? 'ตายแล้ว · ตัวอักษรตกที่พื้น · ชมเพื่อนจนจบรอบ' : 'หมดแรง · ชมเพื่อนจนจบรอบ');
  }

  function enterSpectator(){
    if(!player || player.alive !== false) return;
    if(combat && combat.reset) combat.reset();
    if(energy && energy.cancel) energy.cancel();
    if(fireTrail && fireTrail.clear) fireTrail.clear();
    if(spectator && !spectator.active) spectator.enter();
    if(input && input.setSpectating) input.setSpectating(true);
    if(hud && hud.quest) hud.quest.hide();
  }

  function consumePlayerDeath(){
    if(!player || !player.consumeDeath || !player.consumeDeath()) return false;
    loseLifeLetters();
    enterSpectator();
    return true;
  }

  function requestTankerHit(req){
    if(!req || !round || !net || !net.requestTankerHit) return;
    net.requestTankerHit(req, round.seed);
  }

  function tankerExplosion(eventId, pos){
    if(!player || player.alive === false || !eventId) return;
    const dmg = player.takeHit(VF.TANKER_DAMAGE || 500, false, {from: 'tanker', bypassInvuln: true});
    if(dmg > 0){
      if(hud && hud.setHp) hud.setHp(player.hp, player.maxHp);
      if(hud && hud.hurtFlash) hud.hurtFlash(dmg / (player.maxHp || 1000));
      if(camRig && camRig.impulse) camRig.impulse(1.6, 8, {low: true});
      consumePlayerDeath();
    }
  }

  function tickTanker(dt){
    if(!oilTanker || !oilTanker.ready) return;
    if(net && net.isHost && net.isHost() && net.consumeTankerRequests){
      const requests = net.consumeTankerRequests();
      for(let i = 0; i < requests.length; i++){
        /* รอบ 1572: คำขอทุ่มจากการแบก (grab) ต้องผ่านได้แม้ state='carried' —
           เดิมเช็ก idle อย่างเดียว → กด THROW ตอนแบกออนไลน์แล้วรถไม่ยอมทุ่ม (คำขอค้างถาวร) */
        const carryThrow = requests[i].grab && oilTanker.state === 'carried';
        if(oilTanker.state !== 'idle' && !carryThrow) break;
        const tag = String(round && round.seed || 0) + ':' + (++tankerEventSeq) + ':' + (VF._t.stableHash ? VF._t.stableHash(requests[i].id) : tankerEventSeq);
        const ev = oilTanker.acceptRequest(requests[i], tag, round && round.seed);
        if(ev && net.publishTankerEvent) net.publishTankerEvent(ev);
      }
    }
    if(net && net.consumeTankerEvents){
      net.consumeTankerEvents().forEach(function(ev){ oilTanker.applyEvent(ev); });
    }
    oilTanker.tick(dt);
  }

  function handleDefeat(en){
    if(!en || en._collected) return;
    en._collected = true;
    setTimeout(function(){
      if(enemies && enemies.remove) enemies.remove(en);
    }, 1400);
  }

  let zomReady = false, zomLoading = false;
  function huntersAllowed(){
    const here = net && net.humanCount ? net.humanCount() : 1;
    return VF._t.wantHunters ? VF._t.wantHunters(here) : here < 5;
  }
  function ensureZombies(){
    if(!huntersAllowed()) return Promise.resolve(false);
    if(zomReady || zomLoading) return Promise.resolve(zomReady);
    if(!VF.ZomAssets || !VF.ZomAssets.prepare) return Promise.resolve(false);
    zomLoading = true;
    return VF.ZomAssets.prepare().then(function(){
      zomLoading = false;
      if(!huntersAllowed()) return false;
      zomReady = true;
      syncHunters();
      return true;
    }).catch(function(err){
      zomLoading = false;
      console.warn('[VocabForce] zombie load skip', err);
      return false;
    });
  }

  function syncHunters(){
    if(!huntersAllowed()){
      if(enemies && enemies.dropHunters) enemies.dropHunters();
      return;
    }
    if(!zomReady){ ensureZombies(); return; }
    if(collusionPending && enemies && enemies.spawnCollusionHunters){
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
    if(ackOpen || winLock || !player || !huntersAllowed()) return;
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
      if(hud && hud.quest) hud.quest.hide();
      tickNet(dt);
      tickTanker(dt);
      const winnerView = spectator && spectator.active ? spectator.tick(poll, net, hud, arena) : player;
      if(camRig) camRig.tick(dt, winnerView || player);
      renderer.render(scene, camera);
      return;
    }
    let active = !!(player && player.alive !== false);
    if(active && (poll.lookX || poll.lookY)) camRig.look(poll.lookX, poll.lookY);
    const paused = combat.hitStop > 0;
    if(secondary && !paused) secondary.tickClock(dt);
    const scale = paused ? 0 : (secondary ? secondary.simScale(combat.hitStop) : 1);
    const step = paused ? 0 : dt * scale;
    if(active) combat.tick(dt, now, player, enemies, fx, camRig, VF.audio, secondary, peopleSnap(), worldMelee || oilTanker);
    if(active && !paused && poll.dash && !player.carrying) player.tryManualDash(poll, camRig, arena, fx, camRig, now);
    if(active && !paused && poll.punch && !player.carrying) combat.handleAttackPress('punch', player, now, enemies, camRig, arena, fx, energy, VF.audio, {hold: !!poll.punchHeld, people: peopleSnap(), world: worldMelee || oilTanker});
    if(active && !paused && poll.kick && !player.carrying){
      /* รอบ 1575: KICK เตะอย่างเดียว — การยก/ทุ่มย้ายไปอยู่ปุ่ม LIFT/THROW (หรือคีย์ G) หมดแล้ว
         รอบ 1579: ห้ามเตะตอนแบกรถ — ท่าเตะ/การเข้าใกล้เป้าจะดันตำแหน่งตัวละครทั้งที่ยืนแบกอยู่ */
      combat.tryAttackOrApproach(player.anim.has('kick') ? 'kick' : 'punch', player, now, enemies, camRig, arena, fx);
    }
    /* รอบ 1575: ปุ่ม LIFT/THROW (หรือคีย์ G) สองสถานะ — ยังไม่ได้ยก: กดเพื่อยก · ยกแล้ว: กดเพื่อทุ่ม */
    if(active && !paused && poll.throw && grab){
      if(player.carrying){
        grab.throw(player, camRig, fx, VF.audio, hud, requestTankerHit, !!(net && net.requestTankerHit));
      }else{
        grab.onLift(player, camRig, fx, VF.audio, hud);
      }
    }
    const freezeMove = active && energy && energy.hold && energy.hold.active && Math.hypot(poll.moveX || 0, poll.moveZ || 0) > ((VF.EnergyAttackTune && VF.EnergyAttackTune.aimStickDeadzone) || 0.12);
    const carryingSlow = active && !!player.carrying;
    let playerInput = active ? (freezeMove ? Object.assign({}, poll, {moveX: 0, moveZ: 0}) : poll) : {moveX: 0, moveZ: 0};
    if(carryingSlow) playerInput = Object.assign({}, playerInput, {moveX: (poll.moveX || 0) * 0.55, moveZ: (poll.moveZ || 0) * 0.55, sprint: false});
    player.tick(step, playerInput, camRig, arena);
    if(player.consumePowerJumpEvents){
      player.consumePowerJumpEvents().forEach(function(ev){ handlePowerJumpEvent(ev, true); });
    }
    if(player.consumeOverdriveEvents) player.consumeOverdriveEvents();
    const chained = player.consumeDashAttack && player.consumeDashAttack();
    if(chained) combat.tryAttack(chained, player, now);
    if(hud && hud.setDashCooldown) hud.setDashCooldown(player.dashCooldownFrac(now));
    if(enemies && enemies.setPrey) enemies.setPrey(peopleSnap());
    if(zomReady && huntersAllowed() && enemies && enemies.tickHuntSpawn && !ackOpen && !winLock) enemies.tickHuntSpawn(step, peopleSnap(), arena);
    const sim = enemies.tick(step, player, arena);
    (sim.dead || []).forEach(handleDefeat);
    (sim.bites || []).forEach(function(b){
      if(!player || !player.takeHit) return;
      const dmg = player.takeHit(b.damage, !!player.blocking, {from: 'zombie'});
      if(dmg > 0){
        camRig.impulse(0.28, 2.4);
        if(hud && hud.setHp) hud.setHp(player.hp, player.maxHp);
        if(hud && hud.hurtFlash) hud.hurtFlash(dmg / (player.maxHp || 1000));
        consumePlayerDeath();
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
    active = !!(player && player.alive !== false);
    if(active && healPad) healPad.tick(step, player, hud, VF.audio, camRig);
    /* รอบ 1581: กล้องโชว์ — ซูมใกล้ + โคจรรอบตัวละคร "เฉพาะตอนยืนในวงคืนพลัง"
       (พลังค่อยๆ ฟื้นเต็ม 1000) · ชาร์จพลังจากปุ่ม kick/attack ไม่มีกล้องโชว์แล้ว */
    if(camRig && camRig.setShowcaseCam){
      camRig.setShowcaseCam(!!(healPad && healPad.inside && player && player.alive !== false && player.hp < player.maxHp && !player.carrying));
    }
    if(active && energy) energy.tick(step, now, player, enemies, arena, fx, camRig, combat, VF.audio, {held: !!poll.punchHeld, released: !!poll.punchReleased, moveX: poll.moveX || 0, moveZ: poll.moveZ || 0, people: peopleSnap()});
    if(secondary) secondary.trails(step, enemies, fx, player);
    fx.tick(dt);
    if(trails) trails.tick(step);
    if(fireTrail) fireTrail.tick(dt, enemies, player);
    const needed = round && round.progress && !round.progress.complete ? round.progress.required() : null;
    if(player && player.alive !== false && hud && hud.quest){
      try{
        const target = needed && letters && letters.nearest ? letters.nearest(needed, player.x, player.z) : null;
        if(target && camera) hud.quest.update(camera, target, needed, THREE || root.THREE);
        else hud.quest.hide();
      }catch(_){
        hud.quest.hide();
      }
    }
    if(net) tickNet(dt);
    tickTanker(dt);
    if(grab) grab.tick(dt, player, {hud: hud});
    /* รอบ 1570/1571: สถานะปุ่ม THROW — เช็กทั้ง grab.carrying() และ player.carrying เผื่อเส้นทางใดเส้นทางหนึ่งค้าง */
    if(hud && hud.setCarrying) hud.setCarrying(!!((grab && grab.carrying()) || (player && player.carrying)));
    if(sedan && sedan.ready) sedan.tick(step, {player: player, people: peopleSnap(), enemies: enemies, fx: fx, audio: VF.audio, cam: camRig});
    if(player && player.alive === false){
      enterSpectator();
      const watched = spectator && spectator.tick ? spectator.tick(poll, net, hud, arena) : null;
      camRig.tick(dt, watched || player);
    }else{
      if(hud && hud.setSpectator) hud.setSpectator(false);
      camRig.tick(dt, player);
    }
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
        reward: VF._t.wordReward ? VF._t.wordReward(net.humanCount ? net.humanCount() : 1) : VF.LETTER_REWARD,
        local: false,
        uid: uid || '',
        av: av || ''
      });
    });
    if(hud && hud.setNet) hud.setNet(net.roomHud ? net.roomHud() : net.statusText());
    if(info && info.collusion) syncHunters();
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
    if(player && net.consumeStrikes){
      const mine = VF._t.uidTail ? VF._t.uidTail(net.myUid || 'local') : '';
      net.consumeStrikes().forEach(function(hit){
        if(!hit || hit.target !== mine) return;
        const from = hit.kind === 'G' ? 'gun' : 'player';
        player.takeHit(hit.dmg, !!player.blocking, {from: from, zone: hit.zone, headshot: hit.zone === 'head'});
        if(hud && hud.setHp) hud.setHp(player.hp, player.maxHp);
        if(hud && hud.hurtFlash) hud.hurtFlash((hit.dmg || 0) / (player.maxHp || 1000));
        consumePlayerDeath();
      });
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
      if(renderer && renderer.getContext && renderer.getContext().isContextLost && renderer.getContext().isContextLost()){
        /* 🐛 รอบ 1565: canvas ถูกถอดจาก DOM ตอนออก — มือถือบางเครื่องทิ้ง WebGL context → สร้าง renderer ใหม่ */
        try{ renderer.dispose(); }catch(_){}
        renderer = null;
      }
      if(!renderer){
        renderer = new THREE.WebGLRenderer({antialias: false, alpha: false, powerPreference: 'high-performance'});
        renderer.setPixelRatio(Math.min(VF.DPR_CAP, root.devicePixelRatio || 1));
        renderer.setClearColor(0x0a1228, 1);
        if(renderer.outputEncoding != null && THREE.sRGBEncoding != null) renderer.outputEncoding = THREE.sRGBEncoding;
        if(THREE.ACESFilmicToneMapping != null){
          renderer.toneMapping = THREE.ACESFilmicToneMapping;
          renderer.toneMappingExposure = 1.12;
        }
      }
      /* 🐛 รอบ 1565: mount() ใช้ root.innerHTML ล้าง stage เก่าแบบ subtree — canvas.parentNode ยังชี้ stage เก่าที่ถูกตัดออกจากเอกสาร
         เช็ก parentNode อย่างเดียวจึงข้ามการแนบใหม่ (ตัวละคร+สนามมองไม่เห็นทั้งหมด) → เทียบกับ stage ปัจจุบันแทน */
      if(renderer.domElement.parentNode !== hud.els.stage){
        hud.els.stage.appendChild(renderer.domElement);
      }
      hud.setLoad(0.10, 'กำลังสร้างสนาม', picked);
      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(52, 1, 0.12, VF.CAMERA_FAR || 980);
      arena = new VF.PrototypeArena().build(scene);
      oilTanker = new VF.OilTankerController();
      oilTanker.onHitRequest = requestTankerHit;
      oilTanker.onExplosion = tankerExplosion;
      const tankerLoad = oilTanker.attach(scene, arena).catch(function(err){
        console.warn('[VocabForce] oil tanker load skip', err);
        return null;
      });
      sedan = VF.SedanController ? new VF.SedanController() : null;
      const sedanLoad = sedan ? sedan.attach(scene, arena).catch(function(err){
        console.warn('[VocabForce] sedan load skip', err);
        return null;
      }) : Promise.resolve(null);
      grab = VF.VehicleGrabController ? new VF.VehicleGrabController({sedan: sedan, tanker: oilTanker, arena: arena}) : null;
      /* รอบ 1573: combat เคยคุยกับแค่รถน้ำมัน (world=oilTanker) → ต่อย/เตะรถยนต์ไม่มีผล
         proxy นี้ส่งต่อไปยังคันที่อยู่ในระยะ (รถยนต์ก่อน แล้วรถน้ำมัน) */
      worldMelee = {
        canMelee: function(player, reach){
          return !!((sedan && sedan.canMelee && sedan.canMelee(player, reach)) ||
                    (oilTanker && oilTanker.canMelee && oilTanker.canMelee(player, reach)));
        },
        meleeHit: function(origin, reach, info){
          const p = (info && info.player) || {x: origin.x, z: origin.z, alive: true};
          if(sedan && sedan.canMelee && sedan.canMelee(p, reach) && sedan.meleeHit) return sedan.meleeHit(origin, reach, info);
          if(oilTanker && oilTanker.meleeHit) return oilTanker.meleeHit(origin, reach, info);
          return false;
        }
      };
      healPad = VF.HealPad ? new VF.HealPad().attach(scene) : null;
      fx = new VF.ImpactFXManager().attach(scene);
      trails = new VF.MotionTrailManager().attach(scene);
      fireTrail = VF.OverdriveFireTrail ? new VF.OverdriveFireTrail().attach(scene) : null;
      secondary = new VF.SecondaryImpactController();
      energy = new VF.EnergyAttackController().attach(scene);
      enemies = new VF.EnemyManager().attach(scene);
      letters = new VF.LetterField().attach(scene);
      spectator = new VF.SpectatorController();
      camRig = new VF.ThirdPersonCamera().attach(camera);
      player = new VF.NexCharacterController();
      hud.setLoad(0.18, 'กำลังโหลดตัวละคร ' + picked.displayName, picked);
      await player.attach(scene, picked);
      if(trails) trails.bind(player);
      if(fireTrail && fireTrail.bind) fireTrail.bind(player);
      hud.setLoad(0.22, 'กำลังโหลดแอนิเมชัน', picked);
      await loadClips(picked);
      hud.setLoad(0.58, 'กำลังเตรียมรถบรรทุกน้ำมัน', picked);
      await tankerLoad;
      hud.setLoad(0.60, 'กำลังเตรียมรถยนต์', picked);
      await sedanLoad;
      hud.setLoad(0.62, 'กำลังเข้าสนาม', picked);
      round = new VF.VocabularyRoundController();
      combat = new VF.CombatController();
      input = new VF.VocabForceInput();
      input.bind(hud.root, hud.els);
      if(energy && energy.bindHud) energy.bindHud(hud.root.querySelector('.vf-punch'), hud);
      net = new VF.VocabForceNet();
      net.start(scene, player, function(pair){
        if(!running || !pair || !pair.w) return;
        if(round.progress && pair.w === round.progress.word && pair.seed === round.seed) return;
        if(ackOpen){ pendingWord = pair; return; }
        beginRound(pair);
      }, function(){
        if(hud && hud.setNet && net) hud.setNet(net.roomHud ? net.roomHud() : net.statusText());
        syncHunters();
      });
      beginRound();
      if(hud.setNet) hud.setNet(net.roomHud ? net.roomHud() : net.statusText());
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
    tankerEventSeq = 0;
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
    if(oilTanker && oilTanker.dispose) oilTanker.dispose();
    oilTanker = null;
    if(sedan && sedan.dispose) sedan.dispose();
    sedan = null;
    grab = null;
    if(player) player.carrying = null;
    spectator = null;
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
  VF._t.live = function(){ return {player: player, enemies: enemies, round: round, combat: combat, cam: camRig, secondary: secondary, fx: fx, tanker: oilTanker, sedan: sedan, grab: grab, spectator: spectator, arena: arena, scene: scene, net: net, hud: hud, input: input, resetRound: beginRound, character: player && player.def}; };
})(typeof window !== 'undefined' ? window : globalThis);
