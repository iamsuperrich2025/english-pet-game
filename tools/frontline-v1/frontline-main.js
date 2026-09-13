/* Launcher, landscape presentation, competitive session lifecycle, and central coin claims. */
(function () {
  'use strict';
  const F=window.Frontline,launcher=document.getElementById('launcher'),battle=document.getElementById('battle');
  const join=document.getElementById('fl-join'),code=document.getElementById('fl-code'),status=document.getElementById('fl-launch-status');
  let network=null,scene=null,input=null,ui=null,local=null,room=null,raf=0,lastTime=0,lastShot=0,lastBomb=0;
  let exiting=false,connected=false,ownEvent=0,audio=null,celebration='',acc=0;
  function wallet(){document.getElementById('fl-wallet').textContent=F.balance().toLocaleString();}
  async function enterLandscape(){
    document.body.classList.add('fl-game-active');
    try{
      if(F.usePageFullscreen(navigator.userAgent,matchMedia('(pointer:coarse)').matches)&&document.fullscreenEnabled&&!document.fullscreenElement)
        await document.documentElement.requestFullscreen({navigationUI:'hide'});
    }catch(_){}
    try{if(screen.orientation&&screen.orientation.lock)await screen.orientation.lock('landscape');}catch(_){}
  }
  async function leaveLandscape(){
    document.body.classList.remove('fl-game-active');
    try{if(screen.orientation&&screen.orientation.unlock)screen.orientation.unlock();}catch(_){}
    try{if(document.fullscreenElement)await document.exitFullscreen();}catch(_){}
  }
  function receive(change){
    if(exiting)return;
    if(typeof change.connected==='boolean'){
      if(connected!==change.connected&&audio)audio.cue(change.connected?'join':'disconnect');
      connected=change.connected;if(ui)ui.connection(connected);
      if(!connected){if(input)input.reset();local=null;}
    }
    if(change.error){if(audio)audio.cue('error');if(ui)ui.message(change.error);status.textContent=change.error;if(input)input.reset();}
    if(change.missing){local=null;if(input)input.reset();if(ui)ui.message('กำลังกลับเข้าห้อง…');}
    if(!change.room)return;
    const priorRoom=room;room=structuredClone(change.room);
    if(!connected||change.missing)return;
    const p=room.players&&room.players[change.id];
    if(!p||p.bot){local=null;if(input)input.reset();return;}
    const priorHp=local&&local.hp,priorCarried=local&&local.carried,priorDrop=local?.dropSeq||0;
    if(audio&&local){
      if(priorHp>p.hp)audio.cue(p.hp<=0?'down':'hit');
      else if(priorHp<=0&&p.hp>0)audio.cue('respawn');
      if(!priorCarried&&p.carried)audio.cue('pickup');
      if(priorCarried&&!p.carried&&priorHp===p.hp)audio.cue((p.dropSeq||0)>priorDrop?'drop':'bank');
      if(priorRoom?.word?.round!==room.word.round)audio.cue('round');
      for(const [key,base] of Object.entries(room.bases||{}))if(base.hp<=0&&priorRoom?.bases?.[key]?.hp>0)audio.spatial('baseDown',base.x,base.z,p);
    }
    if(!local||local.id!==p.id||local.slot!==p.slot||(local.hp<=0&&p.hp>0)){local={...p};if(input)input.reset();}
    local.hp=p.hp;local.carried=p.carried;local.carriedRevision=p.carriedRevision||0;local.dropSeq=p.dropSeq||0;
    if((local.bumpSeq||0)!==(p.bumpSeq||0))Object.assign(local,{x:p.x,z:p.z});
    local.bumpSeq=p.bumpSeq||0;
    if(F.live)F.blendToward(local,p);
    if(priorHp>p.hp&&ui)ui.message('TANK HIT · -'+Math.ceil(priorHp-p.hp)+' HP'+(priorCarried?' · '+priorCarried+' DROPPED':''));
    else if(!priorCarried&&p.carried&&ui){
      const needed=F.carryHelps(room.bases&&room.bases[change.id]&&room.bases[change.id].stored,room.word&&room.word.target,p.carried);
      ui.message(needed?'เย้ ได้ '+p.carried+' แล้ว · รีบพากลับบ้านนะ':'อุ๊ย หยิบ '+p.carried+' ผิดแล้ว · กด DROP วางลงนะ');
    }
    else if(priorCarried&&!p.carried&&p.hp>0&&ui&&priorDrop===(p.dropSeq||0))ui.message(priorCarried+' STORED IN YOUR BASE');
    if(ui&&(p.dropSeq||0)>priorDrop){
      const messages={EMPTY:'ไม่มีการ์ดที่ถืออยู่',CHANGED:'การ์ดเปลี่ยนแล้ว · กด DROP อีกครั้ง',FULL:'การ์ดบนพื้นเต็ม · เก็บการ์ดที่วางไว้ก่อน',BLOCKED:'ขับออกจากป้อมแล้วกด DROP อีกครั้ง'};
      ui.message(messages[p.dropResult]||('DROPPED '+p.dropResult+' · วางการ์ดแล้ว'));
    }
    if(p.hp<=0&&input)input.reset();
    const amount=room.rewards&&room.rewards[change.id]||0;
    let paid=0;
    try{paid=F.creditReward(room.run,amount,p.id);if(paid&&ui)ui.message('คำสำเร็จ! +'+paid.toLocaleString()+' เหรียญรอบนี้');}
    catch(error){if(input)input.reset();if(ui)ui.message('Coin save failed: '+error.message);}
    const win=room.word,stamp=room.run+':'+win.round;
    if(win.completedAt&&celebration!==stamp){
      celebration=stamp;const winner=room.players[win.winnerId],mine=win.winnerId===change.id;
      if(ui)ui.celebrate(win,winner,mine,paid);
      if(audio)audio.reward(mine);
    }
    const event=room.events&&room.events[change.id];
    if(event&&event.id!==ownEvent){
      ownEvent=event.id;
      if(event.kind==='tank-hit'&&ui)ui.message('RIVAL HIT · -'+F.C.tankDamage+' HP'+(event.dropped?' · '+event.dropped+' DROPPED':''));
      else if(event.kind==='tank-down'&&ui)ui.message('RIVAL TANK DISABLED');
      else if(event.kind==='base-hit'&&ui)ui.message('BASE HIT · -'+F.C.baseDamage+' HP');
      else if(event.kind==='base-down'&&ui)ui.message('BASE DESTROYED · VAULT OPEN');
    }
  }
  function loop(now){
    const raw=Math.min(.1,(now-lastTime)/1000||0);lastTime=now;acc+=raw;
    if(network)network.maintain();
    if(local&&room&&network){
      const active=connected&&room.players?.[network.id]?.id===local.id&&!room.players[network.id].bot;
      const step=F.C.step||1/60;let used=0,motion='';
      if(active){
        while(acc>=step&&used<3){const hit=F.drive(local,input.value,step,room,network.id);if(hit==='tank')motion='tank';else if(hit&&!motion)motion=hit;acc-=step;used++;}
        if(acc>step)acc=step;
      }else acc=0;
      if(motion==='tank'&&audio)audio.cue('bump');
      const fire=active&&local.hp>0&&now-lastShot>=F.C.fireMs+20&&input.take('fire');
      const bomb=active&&local.hp>0&&now-lastBomb>=F.C.bombCooldown&&input.take('bomb');
      const dropTap=input.take('drop'),drop=dropTap&&active&&local.hp>0&&local.carried?{letter:local.carried,revision:local.carriedRevision||0}:null;
      if(fire){lastShot=now;scene.feedback(local,now);}if(bomb)lastBomb=now;if(active)network.update(local,fire,bomb,drop,input.value);
      if(audio)audio.update(room,local,network.id,input.value,active);
      const attacks=network.attackState();
      scene.render(room,local,network.id,raw||step,now,attacks.now);ui.update(room,network.id,input.value,attacks,active,motion);
    }
    raf=requestAnimationFrame(loop);
  }
  async function stop(){
    if(exiting)return;
    if(input)input.reset();
    if(F.live&&network)await network.close();
    let deposited=0;try{deposited=await F.settleCoinSession();}catch(error){if(input)input.reset();if(ui)ui.message('บันทึกเหรียญไม่สำเร็จ กรุณากด EXIT เพื่อลองอีกครั้ง');return;}
    exiting=true;cancelAnimationFrame(raf);if(input)input.dispose();if(scene)scene.dispose();if(audio)audio.dispose();audio=null;
    battle.hidden=true;launcher.hidden=false;join.disabled=true;status.textContent='Leaving room…';
    try{if(network)await network.close();}catch(error){status.textContent=error.message;}
    network=scene=input=ui=local=room=null;connected=false;await leaveLandscape();wallet();join.disabled=false;
    status.textContent=deposited?'เก็บ '+deposited.toLocaleString()+' เหรียญจากรอบนี้เข้ายอดรวมแล้ว':'Ready. Bots fill empty seats up to four.';exiting=false;
  }
  async function start(){
    if(join.disabled)return;join.disabled=true;status.textContent='Opening landscape battlefield…';ownEvent=0;celebration='';
    audio=F.makeAudio();audio.start();document.getElementById('fl-sound').textContent=audio.inspect().muted?'♪ OFF':'♪ ON';await enterLandscape();
    try{
      if(F.productionReady)await F.productionReady;
      F.assertDev();await F.beginCoinSession();ui=F.makeUI();
      if(!/^\d{4}$/.test(code.value.trim()))throw Error('ใส่หมายเลขห้อง 4 หลัก');
      const requested=F.roomCode(code.value.trim());
      network=await F.connectAvailable(requested,receive,full=>{status.textContent='ROOM '+full+' FULL · FINDING THE NEXT ROOM…';});
      battle.hidden=false;launcher.hidden=true;
      // A disposed WebGL canvas remains lost. Re-entry needs a fresh canvas/context.
      const prior=document.getElementById('fl-canvas'),canvas=prior.cloneNode(false);prior.replaceWith(canvas);
      scene=F.makeScene(canvas,document.getElementById('fl-labels'),(name,x,z)=>audio?.spatial(name,x,z,local));
      input=F.bindInput(battle);ui.connection(connected);document.getElementById('fl-room').textContent=network.code;
      if(network.code!==requested)ui.message('ห้องก่อนหน้าเต็ม · เข้าห้อง '+network.code.slice(1)+' แล้ว');code.value=network.code.slice(1);
      history.replaceState(null,'',(F.live?'/frontline/index.html':'/__dev/frontline')+'?room='+network.code);
      lastShot=lastBomb=0;lastTime=performance.now();raf=requestAnimationFrame(loop);
    }catch(error){
      if(network)await network.close();network=null;if(scene)scene.dispose();scene=null;if(audio)audio.dispose();audio=null;
      battle.hidden=true;launcher.hidden=false;status.textContent=error.message;join.disabled=false;await leaveLandscape();
    }
  }
  join.addEventListener('click',start);document.getElementById('fl-leave').addEventListener('click',stop);
  document.getElementById('fl-rotate-exit').addEventListener('click',stop);
  document.getElementById('fl-lobby').href=F.live||location.port!=='19444'?'/index_classic.html':'https://vocabworld.web.app/index_classic.html';
  document.getElementById('fl-sound').addEventListener('click',e=>{if(audio)e.currentTarget.textContent=audio.toggle()?'♪ ON':'♪ OFF';});
  code.addEventListener('keydown',e=>{if(e.key==='Enter')start();});
  window.addEventListener('pagehide',event=>{
    if(event.persisted){if(input)input.reset();return;}
    if(audio)audio.dispose();
    try{Promise.resolve(F.settleCoinSession()).catch(()=>{});}catch(_){/* The saved journal is recovered on reload. */}
    if(input)input.dispose();if(network)network.close();
    try{if(screen.orientation&&screen.orientation.unlock)screen.orientation.unlock();}catch(_){}
  });
  code.value=F.roomCode(new URLSearchParams(location.search).get('room')||'R1001').slice(1);
  (async()=>{try{join.disabled=true;if(F.productionReady&&!await F.productionReady)return;F.assertDev();const recovered=await F.recoverCoinSession();wallet();join.disabled=false;if(recovered)status.textContent='เก็บ '+recovered.toLocaleString()+' เหรียญจากรอบก่อนเข้ายอดรวมแล้ว';}catch(error){status.textContent='กรุณาลองเข้าใหม่เพื่อบันทึกเหรียญ: '+error.message;join.disabled=false;}})();
  F.inspect=()=>({local:local&&{...local},room:room&&structuredClone(room),input:input&&{...input.value},
    id:network&&network.id,connected,landscape:matchMedia('(orientation: landscape)').matches,
    fullscreen:!!document.fullscreenElement,metrics:scene&&scene.metrics(),attacks:network&&network.attackState(),audio:audio&&audio.inspect(),coins:F.balance(),sessionCoins:F.sessionCoins()});
})();
