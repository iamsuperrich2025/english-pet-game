/* petbehavior.js — 🐾 ระบบพฤติกรรมน้องหน้า Lobby (รอบ 1030 · ป้าย/จังหวะชัดขึ้นรอบ 1031)
   แบ่งคลิป 8 วินาทีเดิมเป็นท่าสั้น ๆ แล้วเลือกต่อกันแบบมีน้ำหนัก
   เครื่องที่เล่นคลิปไม่ได้ยังใช้ state เดียวกันกับภาพ/sprite fallback */
(function(){
  'use strict';

  const STATE_NAMES = ['idle','walk','look','sit','play','sleep'];
  const STATE_LABELS = {
    idle:'🌿 พักหายใจ', walk:'🐾 เดินเล่น', look:'👀 มองรอบตัว',
    sit:'🪑 นั่งพัก', play:'🎾 เล่นสนุก', sleep:'💤 กำลังหลับ',
  };
  const SEGMENTS = {
    sit:  { from:0.05, to:0.80, rate:[0.86,1.00], hold:[500,1200] },
    idle: { from:0.75, to:1.75, rate:[0.90,1.05], hold:[350,900] },
    look: { from:1.70, to:3.25, rate:[0.92,1.08], hold:[250,600] },
    play: { from:3.20, to:5.25, rate:[0.98,1.12], hold:[150,350] },
    walk: { from:5.20, to:7.78, rate:[0.94,1.10], hold:[150,350] },
  };
  const FALLBACK_TIME = {
    idle:[2800,5000], look:[1600,2800], sit:[3500,6500],
    play:[1800,3000], walk:[3000,5200], sleep:[12000,18000],
  };
  const TRANSITIONS = {
    idle:['look','sit','walk','play'],
    look:['idle','walk','sit','play'],
    sit:['idle','look','play'],
    walk:['idle','look','sit'],
    play:['idle','look','sit'],
    sleep:['idle'],
  };
  const WEIGHTS = {
    cat:    { idle:30, look:26, sit:22, walk:14, play:8 },
    dog:    { idle:20, look:15, sit:11, walk:25, play:29 },
    dragon: { idle:32, look:24, sit:16, walk:9,  play:19 },
  };
  const ACTIVE = new WeakMap();

  function range(pair){ return pair[0] + Math.random() * (pair[1] - pair[0]); }
  function scaleMs(ms, ctrl){ return Math.max(16, ms * (ctrl.speed || 1)); }
  function weightsFor(ctrl){
    const base = Object.assign({}, WEIGHTS[ctrl.type] || WEIGHTS.cat);
    if(ctrl.stage === 'baby'){ base.play += 12; base.walk += 5; base.sit = Math.max(4, base.sit - 7); }
    return base;
  }
  function chooseNext(ctrl){
    const allowed = TRANSITIONS[ctrl.state] || TRANSITIONS.idle;
    const weights = weightsFor(ctrl);
    let total = 0;
    for(const name of allowed) total += weights[name] || 1;
    let hit = Math.random() * total;
    for(const name of allowed){
      hit -= weights[name] || 1;
      if(hit <= 0) return name;
    }
    return allowed[0];
  }
  function setState(ctrl, name){
    const root = ctrl.root;
    for(const state of STATE_NAMES) root.classList.remove(`pb-${state}`);
    root.classList.add(`pb-${name}`);
    root.dataset.pbState = name;
    const label = root.querySelector('.ps-behavior-state');
    if(label) label.textContent = STATE_LABELS[name] || STATE_LABELS.idle;
    ctrl.state = name;
    root.dispatchEvent(new CustomEvent('petbehaviorchange',{detail:{state:name}}));
  }
  function clearTimer(ctrl){
    if(ctrl.timer){ clearTimeout(ctrl.timer); ctrl.timer = 0; }
  }
  function schedule(ctrl, ms){
    clearTimer(ctrl);
    ctrl.timer = setTimeout(()=>{
      if(ctrl.stopped || !ctrl.root.isConnected) return stop(ctrl.root);
      run(ctrl, ctrl.forced || chooseNext(ctrl));
    }, scaleMs(ms, ctrl));
  }
  function runFallback(ctrl, name){
    if(ctrl.video && name === 'sleep') ctrl.video.pause();
    setState(ctrl, name);
    if(ctrl.forced) return;
    schedule(ctrl, range(FALLBACK_TIME[name] || FALLBACK_TIME.idle));
  }
  function endSegment(ctrl){
    if(ctrl.holding || ctrl.stopped) return;
    ctrl.holding = true;
    if(ctrl.video) ctrl.video.pause();
    ctrl.root.classList.add('pb-hold');
    const segment = SEGMENTS[ctrl.state] || SEGMENTS.idle;
    schedule(ctrl, range(segment.hold));
  }
  function playSegment(ctrl, name){
    const video = ctrl.video;
    const segment = SEGMENTS[name] || SEGMENTS.idle;
    const duration = Number.isFinite(video.duration) && video.duration > 0 ? video.duration : 8;
    const unit = duration / 8;
    ctrl.endAt = Math.min(duration - 0.04, segment.to * unit);
    ctrl.holding = false;
    ctrl.root.classList.remove('pb-hold');
    ctrl.root.classList.add('pb-changing');
    video.pause();
    clearTimer(ctrl);
    ctrl.timer = setTimeout(()=>{
      if(ctrl.stopped || !ctrl.root.isConnected) return stop(ctrl.root);
      setState(ctrl, name);
      video.playbackRate = range(segment.rate);
      video.currentTime = Math.min(duration - 0.08, segment.from * unit);
      ctrl.root.classList.remove('pb-changing');
      const promise = video.play();
      if(promise && promise.catch) promise.catch(()=>ctrl.root.closest('.stage-hero')?.classList.add('ps-clip-blocked'));
    }, scaleMs(180, ctrl));
  }
  function run(ctrl, name){
    if(ctrl.stopped) return;
    if(!STATE_NAMES.includes(name)) name = 'idle';
    if(!ctrl.video || name === 'sleep') return runFallback(ctrl, name);
    playSegment(ctrl, name);
  }
  function start(root, options){
    if(!root) return null;
    stop(root);
    const opts = options || {};
    const ctrl = {
      root, video:opts.video || null, type:opts.type || 'cat', stage:opts.stage || 'adult',
      forced:opts.forced || '', speed:opts.speed || 1, state:'idle', timer:0,
      endAt:Infinity, holding:false, stopped:false,
    };
    ctrl.onTime = ()=>{
      if(!ctrl.holding && ctrl.video && ctrl.video.currentTime >= ctrl.endAt) endSegment(ctrl);
    };
    ctrl.onEnded = ()=>endSegment(ctrl);
    ctrl.onError = ()=>{
      if(ctrl.stopped) return;
      if(ctrl.video){
        ctrl.video.removeEventListener('timeupdate', ctrl.onTime);
        ctrl.video.removeEventListener('ended', ctrl.onEnded);
      }
      ctrl.video = null;
      runFallback(ctrl, ctrl.forced || 'idle');
    };
    ACTIVE.set(root, ctrl);
    if(ctrl.video){
      ctrl.video.loop = false;
      ctrl.video.addEventListener('timeupdate', ctrl.onTime);
      ctrl.video.addEventListener('ended', ctrl.onEnded);
      ctrl.video.addEventListener('error', ctrl.onError, {once:true});
      const first = {cat:'look',dog:'play',dragon:'play'}[ctrl.type] || 'look';
      const begin = ()=>run(ctrl, ctrl.forced || first);
      if(ctrl.video.readyState >= 1) begin();
      else ctrl.video.addEventListener('loadedmetadata', begin, {once:true});
    }else{
      runFallback(ctrl, ctrl.forced || ({cat:'look',dog:'play',dragon:'play'}[ctrl.type] || 'look'));
    }
    return ctrl;
  }
  function stop(root){
    const ctrl = ACTIVE.get(root);
    if(!ctrl) return;
    ctrl.stopped = true;
    clearTimer(ctrl);
    if(ctrl.video){
      ctrl.video.removeEventListener('timeupdate', ctrl.onTime);
      ctrl.video.removeEventListener('ended', ctrl.onEnded);
    }
    ACTIVE.delete(root);
  }
  function force(root, state){
    const ctrl = ACTIVE.get(root);
    if(!ctrl || !STATE_NAMES.includes(state)) return false;
    ctrl.forced = state;
    run(ctrl, state);
    return true;
  }
  function release(root){
    const ctrl = ACTIVE.get(root);
    if(!ctrl) return false;
    ctrl.forced = '';
    run(ctrl, chooseNext(ctrl));
    return true;
  }

  window.PetBehavior = Object.freeze({start,stop,force,release,states:STATE_NAMES.slice()});
})();
