/* ============================================================
   hauntedhoteldirector.js — Haunted Hotel Horror Director (Phase 3)
   Lightweight local pacing + compact, transaction-claimed shared scare intent.
   Mission authority, movement, rewards and scene rendering stay outside this module.
   ============================================================ */
(function(){
  'use strict';

  const CONFIG=Object.freeze({
    DECISION_MS:400,                 // 2.5 low-frequency decisions/sec; update() may still be called per frame
    ENTRY_GRACE_MS:11000,
    SHARED_EVENT_LIFETIME_MS:12000,
    RECOVERY_MS:8000,
    RECENT_LIMIT:5,
    HANDLED_LIMIT:12,
    ISOLATED_DISTANCE:17,
    FLOOR_DISTANCE_BONUS:18,
    AMBIENT_THRESHOLD:.28,
    VISUAL_THRESHOLD:.53,
    MAJOR_THRESHOLD:.82,
    AMBIENT_COOLDOWN_MS:[11000,19000],
    VISUAL_COOLDOWN_MS:[21000,34000],
    MAJOR_COOLDOWN_MS:55000,
    AUDIO_MAJOR_LOCK_MS:6500,
    TENSION_DROP:Object.freeze({ambient:.08,visual:.17,major:.53}),
    PHASE:Object.freeze({
      ENTER:{base:.05,rise:.0025}, ACTIVE_WORD:{base:.14,rise:.0080},
      TEMP_BLACKOUT:{base:.76,rise:0,suppress:true}, RESTORE:{base:.13,rise:-.025,recovery:true},
      PERMANENT_DARK:{base:.43,rise:.0125}, FINAL_CABINET:{base:.57,rise:.0105},
      COMPLETE:{base:.08,rise:-.035,suppress:true}, RETURN:{base:0,rise:-.08,suppress:true}
    })
  });

  const LOCAL_TYPES=Object.freeze({
    ambient:['distantFootsteps','whisper','knock','doorCreak','faintWail'],
    visual:['portraitShift','corridorShadow'],
    environmental:['lightPulse','nearbyCreak'],
    major:['majorCorridor','groupKnock','finalPresence']
  });

  function clamp(value,min,max){return Math.max(min,Math.min(max,value));}
  function hash32(value){
    let x=Number(value)>>>0;
    x^=x>>>16; x=Math.imul(x,0x7feb352d); x^=x>>>15; x=Math.imul(x,0x846ca68b); x^=x>>>16;
    return x>>>0;
  }
  function eventId(seed,now,uid){
    return 'hh3-'+Math.floor(now).toString(36)+'-'+hash32((seed||1)^Math.floor(now)^hashString(uid)).toString(36);
  }
  function hashString(value){
    const s=String(value||''); let h=2166136261;
    for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619);}
    return h>>>0;
  }
  function validPlayer(player){
    return !!(player&&player.id&&Number.isFinite(Number(player.x))&&Number.isFinite(Number(player.z)));
  }
  function normalizePlayers(list){
    const seen={},out=[];
    (list||[]).forEach(function(player){
      if(!validPlayer(player)||seen[player.id])return;
      seen[player.id]=true;
      out.push({id:String(player.id),x:Number(player.x),z:Number(player.z),y:Number(player.y)||0,
        floor:Number.isFinite(Number(player.floor))?Number(player.floor):0,room:player.room||''});
    });
    return out;
  }
  function create(options){
    const opt=options||{};
    const random=typeof opt.random==='function'?opt.random:Math.random;
    const wallClock=typeof opt.wallClock==='function'?opt.wallClock:Date.now;
    let active=false,phase='ENTER',canonical=null,tension=CONFIG.PHASE.ENTER.base;
    let startedAt=0,startedWall=0,lastAt=0,decisionAcc=0,lastAnyAt=0,recoveryUntil=0,audioLockUntil=0;
    let cooldown={ambient:0,visual:0,major:0},recent=[],handled=[],targetCount={},lastTarget='',claimBusy=false;
    let latestPlayers=[],lastDecision=null,runSeed=1;
    let searchEventAt={};

    function nowMs(fallback){
      if(Number.isFinite(Number(fallback)))return Number(fallback);
      if(typeof opt.clock==='function')return Number(opt.clock())||0;
      return typeof performance!=='undefined'?performance.now():wallClock();
    }
    function range(pair){return pair[0]+random()*(pair[1]-pair[0]);}
    function phaseConfig(){return CONFIG.PHASE[phase]||CONFIG.PHASE.ACTIVE_WORD;}
    function localId(){return String(typeof opt.userId==='function'?opt.userId()||'':'');}
    function contextPlayers(context){
      const ctx=context||(typeof opt.context==='function'?opt.context():null)||{};
      latestPlayers=normalizePlayers(ctx.players||[]);
      const live={};latestPlayers.forEach(function(player){live[player.id]=true;});
      Object.keys(targetCount).forEach(function(uid){if(!live[uid])delete targetCount[uid];});
      return latestPlayers;
    }
    function nearestDistance(player,players){
      let best=Infinity;
      players.forEach(function(other){
        if(other.id===player.id)return;
        const floorGap=Math.abs((other.floor||0)-(player.floor||0));
        const d=Math.hypot(other.x-player.x,other.z-player.z)+floorGap*CONFIG.FLOOR_DISTANCE_BONUS;
        if(d<best)best=d;
      });
      return best;
    }
    function isolationOf(player,players){
      if(!player||players.length<2)return players.length===1?.34:0;
      const d=nearestDistance(player,players);
      return clamp((d-CONFIG.ISOLATED_DISTANCE*.55)/(CONFIG.ISOLATED_DISTANCE*1.15),0,1);
    }
    function localIsolation(players){
      const uid=localId(),player=players.find(function(item){return item.id===uid;})||players[0];
      return isolationOf(player,players);
    }
    function pushBounded(list,value,max){
      if(list.indexOf(value)<0)list.push(value);
      while(list.length>max)list.shift();
    }
    function chooseType(category){
      let pool=(LOCAL_TYPES[category]||[]).slice();
      if(category==='major'&&phase==='FINAL_CABINET')pool=['finalPresence','groupKnock'];
      if(category==='visual'&&phase==='PERMANENT_DARK')pool.push('corridorShadow');
      const weighted=[];
      pool.forEach(function(type){
        const at=recent.lastIndexOf(type),distance=at<0?0:(recent.length-at);
        const copies=at<0?5:Math.min(4,distance); // just-used=1 copy; older entries gradually recover weight
        for(let i=0;i<copies;i++)weighted.push(type);
      });
      return weighted[Math.floor(random()*weighted.length)]||pool[0];
    }
    function fairnessScore(player,players){
      const hits=targetCount[player.id]||0;
      return hits*3+(player.id===lastTarget?6:0)-isolationOf(player,players)*2.5+random()*.8;
    }
    function fairOne(players){
      if(!players.length)return '';
      return players.slice().sort(function(a,b){return fairnessScore(a,players)-fairnessScore(b,players);})[0].id;
    }
    function subgroup(players){
      const byFloor={};
      players.forEach(function(player){(byFloor[player.floor]||(byFloor[player.floor]=[])).push(player);});
      const floorGroups=Object.keys(byFloor).map(function(key){return byFloor[key];})
        .filter(function(group){return group.length>=2&&group.length<players.length;});
      if(floorGroups.length){
        floorGroups.sort(function(a,b){
          const ah=a.reduce(function(n,p){return n+(targetCount[p.id]||0);},0)/a.length;
          const bh=b.reduce(function(n,p){return n+(targetCount[p.id]||0);},0)/b.length;
          return ah-bh;
        });
        return floorGroups[0].slice(0,4).map(function(player){return player.id;}).join(',');
      }
      const anchorId=fairOne(players),anchor=players.find(function(player){return player.id===anchorId;})||players[0];
      return players.slice().sort(function(a,b){
        return Math.hypot(a.x-anchor.x,a.z-anchor.z)-Math.hypot(b.x-anchor.x,b.z-anchor.z);
      }).slice(0,Math.min(3,Math.max(2,Math.floor(players.length/2)))).map(function(player){return player.id;}).join(',');
    }
    function chooseTarget(players){
      if(players.length<=1)return players[0]?players[0].id:localId();
      if(players.length===2)return random()<.35?'all':fairOne(players);
      if(players.length<=4){
        if(random()<.18)return 'all';
        if(random()<.40)return subgroup(players);
        return fairOne(players);
      }
      if(random()<.10)return 'all';
      if(random()<.58)return subgroup(players);
      return fairOne(players);
    }
    function rememberTargets(target){
      if(!target||target==='all')return;
      target.split(',').forEach(function(uid){if(uid){targetCount[uid]=(targetCount[uid]||0)+1;lastTarget=uid;}});
    }
    function appliesTo(target,uid){return target==='all'||String(target||'').split(',').indexOf(uid)>=0;}
    function markScare(type,category,at,target){
      recent.push(type); while(recent.length>CONFIG.RECENT_LIMIT)recent.shift();
      rememberTargets(target);
      lastAnyAt=at;
      tension=clamp(tension-CONFIG.TENSION_DROP[category],0,1);
      if(category==='major'){
        cooldown.major=at+CONFIG.MAJOR_COOLDOWN_MS;
        recoveryUntil=at+CONFIG.RECOVERY_MS;
        audioLockUntil=at+CONFIG.AUDIO_MAJOR_LOCK_MS;
      }else if(category==='visual')cooldown.visual=at+range(CONFIG.VISUAL_COOLDOWN_MS);
      else cooldown.ambient=at+range(CONFIG.AMBIENT_COOLDOWN_MS);
    }
    function requestLocal(type,category,at,detail){
      if(category==='ambient'&&at<audioLockUntil)return false;
      const event=Object.assign({type:type,category:category,shared:false,phase:phase,
        seed:hash32(runSeed^Math.floor(at)^hashString(type)),tension:tension},detail||{});
      if(typeof opt.requestLocalScare==='function')opt.requestLocalScare(event);
      markScare(type,category,at,localId());
      lastDecision=event;
      return true;
    }
    function sharedCandidate(type,target){
      const wall=wallClock(),seed=hash32(runSeed^Math.floor(wall)^hashString(type+target))||1;
      return {eventId:eventId(seed,wall,localId()),type:type,target:target||'all',eventSeed:seed,createdAt:wall};
    }
    function requestMajor(at,players){
      if(claimBusy||at<cooldown.major)return false;
      const type=chooseType('major'),target=chooseTarget(players),candidate=sharedCandidate(type,target);
      cooldown.major=at+CONFIG.MAJOR_COOLDOWN_MS; // local claim throttle; the transaction is the cross-client authority
      claimBusy=true;
      if(typeof opt.claimSharedScare!=='function'){
        claimBusy=false;
        if(appliesTo(target,localId()))requestLocal(type,'major',at,{target:target,eventId:candidate.eventId});
        return true;
      }
      Promise.resolve(opt.claimSharedScare(candidate,CONFIG.MAJOR_COOLDOWN_MS)).then(function(result){
        claimBusy=false;
        if(result&&result.offline&&appliesTo(target,localId()))requestLocal(type,'major',at,{target:target,eventId:candidate.eventId});
        if(typeof opt.diagnostic==='function')opt.diagnostic(result&&result.committed?'shared-claim-won':'shared-claim-adopted',candidate);
      },function(){claimBusy=false;});
      lastDecision={type:type,category:'major',shared:true,target:target,eventId:candidate.eventId};
      return true;
    }
    function decide(at,players){
      const pc=phaseConfig();
      if(pc.suppress||at<startedAt+CONFIG.ENTRY_GRACE_MS||at<recoveryUntil)return false;
      if((phase==='ACTIVE_WORD'||phase==='PERMANENT_DARK'||phase==='FINAL_CABINET')&&
          tension>=CONFIG.MAJOR_THRESHOLD&&at>=cooldown.major&&random()<.13)return requestMajor(at,players);
      if(phase!=='ENTER'&&phase!=='RESTORE'&&tension>=CONFIG.VISUAL_THRESHOLD&&at>=cooldown.visual&&random()<.16){
        const environmental=phase==='FINAL_CABINET'||random()<.42;
        return requestLocal(chooseType(environmental?'environmental':'visual'),'visual',at,{isolated:localIsolation(players)>.55});
      }
      if(tension>=CONFIG.AMBIENT_THRESHOLD&&at>=cooldown.ambient&&random()<.22){
        return requestLocal(chooseType('ambient'),'ambient',at,{isolated:localIsolation(players)>.55});
      }
      return false;
    }
    function update(dt,at,context){
      if(!active)return;
      const now=nowMs(at),elapsed=clamp(Number(dt)||((lastAt&&now-lastAt)/1000)||0,0,.5),players=contextPlayers(context);
      lastAt=now;
      const pc=phaseConfig(),isolation=localIsolation(players),groupScale=1+Math.min(.12,Math.max(0,players.length-1)*.025);
      if(now<recoveryUntil||pc.recovery)tension+=(pc.base-tension)*Math.min(1,elapsed*.8);
      else tension+=pc.rise*elapsed*groupScale*(1+isolation*.38);
      if(pc.rise>=0&&tension<pc.base)tension+=(pc.base-tension)*Math.min(1,elapsed*.45);
      tension=clamp(tension,0,1);
      decisionAcc+=elapsed*1000;
      if(decisionAcc<CONFIG.DECISION_MS)return;
      decisionAcc%=CONFIG.DECISION_MS;
      decide(now,players);
    }
    function onCanonicalState(state,meta){
      if(!state)return;
      canonical=state; runSeed=Number(state.seed)||runSeed;
      const next=String(state.phase||phase),changed=next!==phase;
      phase=next;
      const at=nowMs();
      if(changed){
        const pc=phaseConfig();
        tension=Math.max(tension,pc.base);
        if(pc.recovery)recoveryUntil=Math.max(recoveryUntil,at+CONFIG.RECOVERY_MS);
      }
      if(phase==='RETURN')stop();
      if(typeof opt.diagnostic==='function'&&changed)opt.diagnostic('phase',{phase:phase,tension:tension,reconnect:!!(meta&&meta.reconnect)});
    }
    /* Phase 4 search events feed the existing pacing budget; they never bypass
       cooldowns and never force a major scare on collection. */
    function onSearchEvent(kind,detail){
      if(!active)return false;
      const at=nowMs(),last=searchEventAt[kind]||0;
      if(at-last<1400)return false;
      searchEventAt[kind]=at;
      if(kind==='collected'){
        tension=clamp(tension-.12,0,1);
        recoveryUntil=Math.max(recoveryUntil,at+2200);
        return true;
      }
      if(kind==='approach'){
        tension=clamp(tension+.035,0,1);
        if(detail&&detail.band==='very-near'&&at>=cooldown.ambient)return requestLocal('whisper','ambient',at,{searchEvent:kind});
        return true;
      }
      if(kind==='stuck'){
        const level=Math.max(1,Math.min(4,Number(detail&&detail.level)||1));
        tension=clamp(tension+.018*level,0,1);
        if(level>=2&&at>=cooldown.ambient)return requestLocal(level>=4?'nearbyCreak':'distantFootsteps','ambient',at,{searchEvent:kind,hintLevel:level});
        return true;
      }
      return false;
    }
    function onSharedScare(event,meta){
      if(!active||!event||!event.eventId)return false;
      if(handled.indexOf(event.eventId)>=0)return false;
      const wall=wallClock(),created=Number(event.createdAt)||0;
      if(!created||created<startedWall||wall-created>CONFIG.SHARED_EVENT_LIFETIME_MS)return false;
      pushBounded(handled,event.eventId,CONFIG.HANDLED_LIMIT);
      if(phase==='TEMP_BLACKOUT'||phase==='COMPLETE'||phase==='RETURN')return false;
      rememberTargets(event.target); // every client learns the same tiny fairness history, even when not targeted
      const uid=localId();
      if(!appliesTo(event.target,uid))return false;
      // If a stale target vanished, non-target clients simply ignore it; mission state is untouched.
      const at=nowMs();
      const request={type:event.type,category:'major',shared:true,target:event.target,eventId:event.eventId,
        seed:Number(event.eventSeed)||runSeed,phase:phase,tension:tension,reconnect:!!(meta&&meta.reconnect)};
      if(typeof opt.requestLocalScare==='function')opt.requestLocalScare(request);
      markScare(event.type,'major',at,null);
      lastDecision=request;
      return true;
    }
    function start(context){
      stop();
      active=true; phase='ENTER'; canonical=null; tension=CONFIG.PHASE.ENTER.base;
      startedAt=nowMs(context&&context.now); startedWall=wallClock(); lastAt=startedAt; lastAnyAt=startedAt; decisionAcc=0;
      recoveryUntil=0; audioLockUntil=0; cooldown={ambient:startedAt+CONFIG.ENTRY_GRACE_MS,visual:startedAt+CONFIG.ENTRY_GRACE_MS,major:startedAt+CONFIG.ENTRY_GRACE_MS};
      recent=[]; handled=[]; targetCount={}; lastTarget=''; claimBusy=false; latestPlayers=[]; lastDecision=null; searchEventAt={};
      if(context&&context.canonical)onCanonicalState(context.canonical,{firstSnapshot:true});
    }
    function stop(){active=false;claimBusy=false;decisionAcc=0;latestPlayers=[];}
    function dispose(){stop();canonical=null;recent=[];handled=[];targetCount={};}
    function snapshot(){
      return {active:active,phase:phase,tension:tension,players:latestPlayers.length,recent:recent.slice(),
        handled:handled.slice(),cooldowns:Object.assign({},cooldown),recoveryUntil:recoveryUntil,audioLockUntil:audioLockUntil,
        lastTarget:lastTarget,lastDecision:lastDecision,claimBusy:claimBusy};
    }
    return {start:start,update:update,onCanonicalState:onCanonicalState,onSharedScare:onSharedScare,stop:stop,dispose:dispose,
      snapshot:snapshot,onSearchEvent:onSearchEvent,_decide:function(at,players){return decide(nowMs(at),normalizePlayers(players||latestPlayers));},
      _setTension:function(value){tension=clamp(Number(value)||0,0,1);},_chooseTarget:function(players){return chooseTarget(normalizePlayers(players));}};
  }

  window.HauntedHotelHorrorDirector={CONFIG:CONFIG,LOCAL_TYPES:LOCAL_TYPES,create:create};
})();
