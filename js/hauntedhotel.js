/* ============================================================
   hauntedhotel.js — Haunted Hotel mission runtime (Phase 2+3+4)
   Owns lifecycle, explicit mission phases, canonical run reconciliation,
   deterministic mission configuration and cancellable local effects.
   ============================================================ */
(function(){
  'use strict';

  const PHASE=Object.freeze({
    ENTER:'ENTER', ACTIVE_WORD:'ACTIVE_WORD', TEMP_BLACKOUT:'TEMP_BLACKOUT', RESTORE:'RESTORE',
    PERMANENT_DARK:'PERMANENT_DARK', COMPLETE:'COMPLETE', RETURN:'RETURN'
  });
  const PHASES=Object.freeze(Object.keys(PHASE).map(function(key){return PHASE[key];}));
  const LEGAL=Object.freeze({
    ENTER:[PHASE.ACTIVE_WORD],
    ACTIVE_WORD:[PHASE.TEMP_BLACKOUT],
    TEMP_BLACKOUT:[PHASE.RESTORE],
    RESTORE:[PHASE.PERMANENT_DARK],
    PERMANENT_DARK:[],
    COMPLETE:[PHASE.RETURN],
    RETURN:[]
  });
  const LIGHTING=Object.freeze({
    NORMAL:'normal', FLICKER:'flicker', TEMP_BLACKOUT:'temp_blackout',
    RESTORED:'restored', PERMANENT_DARK:'permanent_dark'
  });
  // HOTEL3D has five physical levels (0..4). Story copy currently uses 0..3.
  const FLOOR=Object.freeze({GROUND:0,SECOND:1,THIRD:2,FOURTH:3,EXTRA:4});
  const HOTEL_WORDS=4;
  const MAX_PLAYERS=6; // Phase 3: the single Haunted Hotel-specific instance capacity
  const PLACEMENT_VERSION=1;
  const ROOM_THRESHOLDS=Object.freeze({FIRST_DARK:5,RESTORE:10,SECOND_DARK:13});
  const SEARCH=Object.freeze({
    CHECK_MS:500, MEDIUM_R:30, NEAR_R:13, VERY_NEAR_R:5.2,
    HINT_AT:Object.freeze([0,45000,85000,135000,190000]), QUEUE_MAX:4
  });

  let adapter=null;
  let session=null;
  let director=null;
  let active=false;
  let currentFloor=FLOOR.GROUND;
  let lighting=LIGHTING.NORMAL;
  let canonical=null;
  let localOnly=false;
  let localFallbackTimer=0;
  let flickerTimer=0;
  let flickerToken=0;
  let driveTimer=0;
  let errorShown=false;
  const pendingClaims=new Set();
  const timers=new Set();
  const intervals=new Set();
  const listeners=[];
  const audios=new Set();
  const objects=[];
  let searchObjective=null;
  let searchKey='';
  let searchStartedAt=0;
  let searchElapsedMs=0;
  let searchHintLevel=0;
  let searchCheckAt=0;
  let proximityBand='far';
  let criticalCurrent=null;
  let criticalQueue=[];
  let lastCritical=null;

  function later(fn,ms){
    const id=setTimeout(function(){timers.delete(id);fn();},ms);
    timers.add(id);
    return id;
  }
  function every(fn,ms){
    const id=setInterval(fn,ms);
    intervals.add(id);
    return id;
  }
  function cancelTimer(id){
    if(!id)return;
    clearTimeout(id); clearInterval(id);
    timers.delete(id); intervals.delete(id);
  }
  function listen(target,type,fn,options){
    if(!target||!target.addEventListener)return function(){};
    target.addEventListener(type,fn,options);
    const item={target:type?target:null,type:type,fn:fn,options:options};
    listeners.push(item);
    return function(){
      const at=listeners.indexOf(item);
      if(at>=0)listeners.splice(at,1);
      target.removeEventListener(type,fn,options);
    };
  }
  function trackAudio(audio){if(audio)audios.add(audio);return audio;}
  function trackObject(object,parent,cleanup){
    if(object)objects.push({object:object,parent:parent||object.parent,cleanup:cleanup});
    return object;
  }
  function cancelFlicker(restore){
    flickerToken++;
    cancelTimer(flickerTimer);
    flickerTimer=0;
    if(restore&&adapter&&adapter.applyFlickerLevel)adapter.applyFlickerLevel(1);
  }
  function clearTransient(removeObjects){
    cancelFlicker(false);
    cancelTimer(localFallbackTimer); localFallbackTimer=0;
    cancelTimer(driveTimer); driveTimer=0;
    timers.forEach(function(id){clearTimeout(id);}); timers.clear();
    intervals.forEach(function(id){clearInterval(id);}); intervals.clear();
    while(listeners.length){
      const item=listeners.pop();
      item.target.removeEventListener(item.type,item.fn,item.options);
    }
    audios.forEach(function(audio){try{audio.pause();audio.currentTime=0;}catch(e){}}); audios.clear();
    if(removeObjects!==false){
      while(objects.length){
        const item=objects.pop();
        if(item.parent&&item.parent.remove)item.parent.remove(item.object);
        if(typeof item.cleanup==='function')item.cleanup(item.object);
      }
    }
  }
  function floorIndex(y){ return adapter&&adapter.floorOf?adapter.floorOf(y):FLOOR.GROUND; }

  function setLighting(state,options){
    const opts=options||{};
    if(state!==LIGHTING.FLICKER)cancelFlicker(false);
    lighting=state;
    if(adapter&&adapter.applyLightingState)adapter.applyLightingState(state,opts);
  }
  function startFlicker(options){
    const opts=options||{};
    const duration=Math.max(250,opts.duration||1800);
    const finishState=opts.permanent?LIGHTING.PERMANENT_DARK:LIGHTING.TEMP_BLACKOUT;
    cancelFlicker(false);
    lighting=LIGHTING.FLICKER;
    const token=++flickerToken;
    const started=performance.now();
    let step=0;
    const levels=[.22,1,.06,.84,.38,1,.12,.72];
    if(adapter&&adapter.onFlickerStart)adapter.onFlickerStart(opts);
    function pulse(){
      if(!active||token!==flickerToken)return;
      const elapsed=performance.now()-started;
      if(elapsed>=duration){flickerTimer=0;setLighting(finishState,{quiet:!!opts.quiet,fromFlicker:true});return;}
      if(adapter&&adapter.applyFlickerLevel){
        const base=levels[step++%levels.length];
        adapter.applyFlickerLevel(Math.max(0,Math.min(1,base+(Math.random()-.5)*.12)));
      }
      flickerTimer=later(pulse,Math.min(duration-elapsed,65+Math.random()*155+(step%3===0?115:0)));
    }
    pulse();
  }

  function hash32(value){
    let x=Number(value)>>>0;
    x^=x>>>16; x=Math.imul(x,0x7feb352d); x^=x>>>15; x=Math.imul(x,0x846ca68b); x^=x>>>16;
    return x>>>0;
  }
  function hashString(value){
    const s=String(value||''); let h=2166136261;
    for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619);}
    return h>>>0;
  }
  function seededRandom(seed){
    let x=(Number(seed)>>>0)||0x6d2b79f5;
    return function(){
      x=(x+0x6d2b79f5)>>>0;
      let t=x; t=Math.imul(t^(t>>>15),t|1); t^=t+Math.imul(t^(t>>>7),t|61);
      return ((t^(t>>>14))>>>0)/4294967296;
    };
  }
  function seededShuffle(list,seed){
    const out=(list||[]).slice();
    const random=seededRandom(seed);
    for(let i=out.length-1;i>0;i--){const j=Math.floor(random()*(i+1));const tmp=out[i];out[i]=out[j];out[j]=tmp;}
    return out;
  }
  /* Phase 4 placement is a pure function of canonical run identity + stable
     pool IDs. It deliberately balances floors and rooms before distance, so a
     run creates a search route instead of a random cluster. */
  function derivePlacements(pool,state){
    const view=publicState(state),source=(pool||[]).filter(function(slot){
      return slot&&slot.id&&Number.isFinite(Number(slot.x))&&Number.isFinite(Number(slot.z))&&Number.isInteger(Number(slot.floor));
    }).slice().sort(function(a,b){return String(a.id).localeCompare(String(b.id));});
    if(!view||!source.length)return [];
    const version=Number(view.placementVersion)||PLACEMENT_VERSION;
    const baseSeed=hash32((Number(view.seed)||1)^hashString(view.runId)^hash32(version*0x504c4143));
    const floors=Array.from(new Set(source.map(function(slot){return Number(slot.floor);}))).sort(function(a,b){return a-b;});
    const placements=[],usedIds=new Set(),globalRooms={};
    view.words.forEach(function(word,wordIndex){
      const count=Math.max(0,word.en.length-1),wordRooms={},chosen=[];
      const floorOrder=seededShuffle(floors,hash32(baseSeed^hash32((wordIndex+1)*0x574f5244)));
      for(let ordinal=0;ordinal<count;ordinal++){
        const targetFloor=floorOrder[(ordinal+wordIndex)%floorOrder.length];
        let candidates=source.filter(function(slot){return Number(slot.floor)===targetFloor&&!usedIds.has(slot.id);});
        if(!candidates.length)candidates=source.filter(function(slot){return !usedIds.has(slot.id);});
        if(!candidates.length)candidates=source.slice();
        const shuffled=seededShuffle(candidates,hash32(baseSeed^hash32((wordIndex+1)*4099+ordinal*131)));
        let best=shuffled[0],bestScore=-Infinity;
        shuffled.forEach(function(slot,index){
          const room=String(slot.room||slot.zone||slot.id);
          let minDistance=80;
          chosen.forEach(function(other){
            const floorGap=Math.abs(Number(other.floor)-Number(slot.floor));
            const d=Math.hypot(Number(other.x)-Number(slot.x),Number(other.z)-Number(slot.z))+floorGap*24;
            minDistance=Math.min(minDistance,d);
          });
          const score=minDistance-(wordRooms[room]||0)*120-(globalRooms[room]||0)*18-index*.00001;
          if(score>bestScore){bestScore=score;best=slot;}
        });
        if(best){
          const room=String(best.room||best.zone||best.id);
          usedIds.add(best.id); wordRooms[room]=(wordRooms[room]||0)+1; globalRooms[room]=(globalRooms[room]||0)+1;
          chosen.push(best);
        }
      }
      placements[wordIndex]=chosen;
    });
    return placements;
  }
  function parseRoomVisits(value){
    if(typeof value!=='string'||!value)return [];
    return Array.from(new Set(value.split(',').filter(function(id){return /^F[1-5]_ROOM_[0-9]{3}$/.test(id);}))).slice(0,32).sort();
  }
  function roomVisitCount(state){return parseRoomVisits(state&&state.roomVisits).length;}
  /* One collectible in every guest room from floor 2 upward. Each room is a
     stable semantic slot, while repeated copies map to the same canonical
     ordinal so multiplayer still awards/solves every letter exactly once. */
  function deriveRoomLetters(pool,state){
    const view=publicState(state),word=view&&view.words[view.wordIndex];
    if(!view||!word)return [];
    const byRoom={};
    (pool||[]).forEach(function(slot){
      if(!slot||Number(slot.floor)<1||!/^F[2-5]_ROOM_[0-9]{3}_[0-9]{2}$/.test(String(slot.id||'')))return;
      (byRoom[slot.room]||(byRoom[slot.room]=[])).push(slot);
    });
    const seed=hash32((Number(view.seed)||1)^hashString(view.runId)^hash32((view.wordIndex+1)*0x524f4f4d));
    const rooms=seededShuffle(Object.keys(byRoom).sort(),seed);
    return rooms.map(function(room,index){
      const slots=byRoom[room].slice().sort(function(a,b){return String(a.id).localeCompare(String(b.id));});
      const pick=slots[hash32(seed^hashString(room))%slots.length],ordinal=index%word.en.length;
      return Object.assign({},pick,{ordinal:ordinal,ch:word.en.charAt(ordinal)});
    });
  }
  function randomSeed(){
    try{const a=new Uint32Array(1);crypto.getRandomValues(a);return a[0]||1;}catch(e){return hash32(Date.now()^Math.floor(Math.random()*0xffffffff))||1;}
  }
  function makeRunId(){
    const uid=adapter&&adapter.userId?String(adapter.userId()||'player').slice(-12):'player';
    return 'hh2-'+Date.now().toString(36)+'-'+randomSeed().toString(36)+'-'+uid;
  }
  function parseWords(value){
    try{
      const list=JSON.parse(String(value||'[]'));
      if(!Array.isArray(list))return [];
      return list.slice(0,HOTEL_WORDS).map(function(item){
        return {en:String(item&&item[0]||'').toLowerCase(),th:String(item&&item[1]||'')};
      }).filter(function(item){return /^[a-z]{2,9}$/.test(item.en);});
    }catch(e){return [];}
  }
  function initialRun(){
    const seed=randomSeed();
    const words=adapter&&adapter.createWordSet?adapter.createWordSet(seed):[];
    return {
      runId:makeRunId(), seed:seed, phase:PHASE.ENTER, wordIndex:0, ordinalMask:0,
      placementVersion:PLACEMENT_VERSION,
      roomVisits:'',
      cabinetLetterSlot:Math.floor(seededRandom(hash32(seed^0x484f5445))()*5),
      completedAt:0, revision:0, wordSet:JSON.stringify((words||[]).slice(0,HOTEL_WORDS).map(function(w){return [w.en,w.th||''];}))
    };
  }
  function validCanonical(value){
    return !!(value && PHASES.indexOf(value.phase)>=0 && typeof value.runId==='string' &&
      Number.isInteger(value.wordIndex) && value.wordIndex>=0 && value.wordIndex<=HOTEL_WORDS &&
      Number.isInteger(value.ordinalMask) && value.ordinalMask>=0 &&
      Number.isInteger(value.cabinetLetterSlot) && value.cabinetLetterSlot>=0 && value.cabinetLetterSlot<5 &&
      parseWords(value.wordSet).length===HOTEL_WORDS);
  }
  function publicState(value){
    if(!validCanonical(value))return null;
    const out=Object.assign({},value);
    out.placementVersion=Number(value.placementVersion)||PLACEMENT_VERSION;
    out.roomVisits=parseRoomVisits(value.roomVisits).join(',');
    out.words=parseWords(value.wordSet);
    return out;
  }
  function fullMask(state){
    const view=publicState(state);
    const word=view&&view.words[view.wordIndex];
    return word?Math.pow(2,word.en.length)-1:0;
  }
  function bitCount(value){let n=Number(value)||0,c=0;while(n>0){c+=n%2;n=Math.floor(n/2);}return c;}
  function stamp(next){
    if(!next.placementVersion)next.placementVersion=PLACEMENT_VERSION;
    next.roomVisits=parseRoomVisits(next.roomVisits).join(',');
    next.updatedAt=Date.now();next.revision=(Number(next.revision)||0)+1;return next;
  }

  /* ============================================================
     Phase 4 persistent important-hint queue + local search timer.
     UI visibility is deliberately local; canonical mission state is not.
     ============================================================ */
  function presentCritical(item){
    criticalCurrent=item;
    lastCritical=item;
    if(adapter&&adapter.showCriticalHint)adapter.showCriticalHint(item);
  }
  function importantHint(detail){
    const item=Object.assign({id:'hint-'+Date.now(),title:'คำใบ้ภารกิจ',html:'',scope:'mission',objectiveKey:''},detail||{});
    if(!item.html)return false;
    if(!item.objectiveKey&&item.scope==='objective')item.objectiveKey=searchKey;
    const duplicate=function(h){return h&&h.id===item.id;};
    if(duplicate(criticalCurrent)||criticalQueue.some(duplicate))return false;
    if(item.scope==='objective'&&item.level){
      criticalQueue=criticalQueue.filter(function(h){
        return !(h.scope==='objective'&&h.objectiveKey===item.objectiveKey&&(Number(h.level)||0)<Number(item.level));
      });
    }
    if(!criticalCurrent)presentCritical(item);
    else{
      criticalQueue.push(item);
      while(criticalQueue.length>SEARCH.QUEUE_MAX)criticalQueue.shift();
    }
    return true;
  }
  function dismissHint(){
    const dismissed=criticalCurrent;
    if(adapter&&adapter.hideCriticalHint)adapter.hideCriticalHint(dismissed);
    criticalCurrent=null;
    if(dismissed&&typeof dismissed.onDismiss==='function')dismissed.onDismiss(dismissed);
    if(!criticalCurrent&&criticalQueue.length)presentCritical(criticalQueue.shift());
  }
  function reopenHint(){
    if(criticalCurrent||!lastCritical)return false;
    presentCritical(Object.assign({},lastCritical,{reopened:true}));
    return true;
  }
  function clearScopedHints(scope,keepKey,clearHistory){
    const remove=function(item){return !!item&&(!scope||item.scope===scope)&&(!keepKey||item.objectiveKey!==keepKey);};
    criticalQueue=criticalQueue.filter(function(item){return !remove(item);});
    if(remove(criticalCurrent)){
      if(adapter&&adapter.hideCriticalHint)adapter.hideCriticalHint(criticalCurrent);
      criticalCurrent=null;
      if(criticalQueue.length)presentCritical(criticalQueue.shift());
    }
    if(clearHistory&&remove(lastCritical))lastCritical=null;
  }
  function clearObjectiveHints(keepKey){
    clearScopedHints('objective',keepKey,false);
  }
  function objectiveKeyOf(objective){
    return objective&&objective.key?String(objective.key):'';
  }
  function emitSearchEvent(kind,detail){
    if(director&&director.onSearchEvent)director.onSearchEvent(kind,detail||{});
    if(adapter&&adapter.onSearchEvent)adapter.onSearchEvent(kind,detail||{});
  }
  function adoptSearchObjective(next,previous){
    const objective=adapter&&adapter.currentSearchObjective?adapter.currentSearchObjective(next):null;
    const key=objectiveKeyOf(objective);
    if(key===searchKey){searchObjective=objective||searchObjective;return;}
    if(searchKey)emitSearchEvent('collected',{previous:searchObjective,next:objective});
    searchObjective=objective; searchKey=key; searchStartedAt=performance.now(); searchElapsedMs=0; searchHintLevel=0;
    searchCheckAt=0; proximityBand='far'; clearObjectiveHints(key);
    if(adapter&&adapter.onSearchObjectiveChanged)adapter.onSearchObjectiveChanged(objective,previous||null);
  }
  function searchDistance(context,objective){
    const player=context&&context.player;
    if(!player||!objective)return Infinity;
    const dy=(Number(player.y)||0)-(Number(objective.y)||0);
    return Math.hypot((Number(player.x)||0)-Number(objective.x),(Number(player.z)||0)-Number(objective.z),dy*1.8);
  }
  function updateSearch(now,dt){
    if(!canonical||!searchObjective)return;
    searchElapsedMs+=Math.max(0,Math.min(500,(Number(dt)||0)*1000));
    if(now<searchCheckAt)return;
    searchCheckAt=now+SEARCH.CHECK_MS;
    const context=adapter&&adapter.searchContext?adapter.searchContext(searchObjective):null;
    const distance=searchDistance(context,searchObjective);
    const nextBand=distance<=SEARCH.VERY_NEAR_R?'very-near':distance<=SEARCH.NEAR_R?'near':distance<=SEARCH.MEDIUM_R?'medium':'far';
    if(nextBand!==proximityBand){
      const previous=proximityBand; proximityBand=nextBand;
      if(adapter&&adapter.onProximityCue)adapter.onProximityCue(nextBand,previous,searchObjective,distance);
      if(nextBand==='near'||nextBand==='very-near')emitSearchEvent('approach',{objective:searchObjective,distance:distance,band:nextBand});
    }
    const strength=nextBand==='very-near'?1:nextBand==='near'?.48:nextBand==='medium'?.14:0;
    if(adapter&&adapter.applyObjectiveProximity)adapter.applyObjectiveProximity({objective:searchObjective,distance:distance,band:nextBand,
      strength:Math.max(strength,searchHintLevel>=4?.82:0),hintLevel:searchHintLevel});
    const elapsed=searchElapsedMs;
    let wanted=0;
    for(let level=1;level<SEARCH.HINT_AT.length;level++)if(elapsed>=SEARCH.HINT_AT[level])wanted=level;
    if(wanted>searchHintLevel){
      searchHintLevel=wanted;
      emitSearchEvent('stuck',{objective:searchObjective,level:wanted,elapsed:elapsed});
    }
  }
  function resetSearch(clearHistory){
    searchObjective=null; searchKey=''; searchStartedAt=0; searchElapsedMs=0; searchHintLevel=0; searchCheckAt=0; proximityBand='far';
    criticalQueue=[];
    if(adapter&&adapter.hideCriticalHint)adapter.hideCriticalHint(criticalCurrent);
    criticalCurrent=null;
    if(clearHistory)lastCritical=null;
    if(adapter&&adapter.applyObjectiveProximity)adapter.applyObjectiveProximity({objective:null,strength:0,band:'far',hintLevel:0});
  }

  function applyState(previous,next,meta){
    if(!active||!validCanonical(next))return;
    const first=!previous || !canonical || canonical.runId!==next.runId || !!(meta&&meta.reconnect);
    const prevPublic=publicState(first?null:previous);
    const nextPublic=publicState(next);
    canonical=next;
    localOnly=!!(meta&&meta.localOnly);
    if(meta&&meta.reconnect)resetSearch(true);
    if(prevPublic&&nextPublic.wordIndex!==prevPublic.wordIndex)clearScopedHints('word',nextPublic.runId+':'+nextPublic.wordIndex,false);
    if(nextPublic.phase===PHASE.COMPLETE||nextPublic.phase===PHASE.RETURN)clearScopedHints(null,'',true);
    if(adapter&&adapter.applyCanonicalState)adapter.applyCanonicalState(prevPublic,nextPublic,{firstSnapshot:first,live:!first,reconnect:!!(meta&&meta.reconnect)});
    if(director)director.onCanonicalState(nextPublic,{firstSnapshot:first,reconnect:!!(meta&&meta.reconnect)});
    adoptSearchObjective(nextPublic,prevPublic);
    scheduleDrive();
  }
  function localMutate(expected,mutation){
    if(!canonical)return Promise.resolve({committed:false,state:null});
    const keys=Object.keys(expected||{});
    if(keys.some(function(key){return expected[key]!==undefined&&canonical[key]!==expected[key];}))return Promise.resolve({committed:false,state:canonical});
    const previous=canonical;
    const next=mutation(Object.assign({},canonical));
    if(!next)return Promise.resolve({committed:false,state:canonical});
    stamp(next);
    applyState(previous,next,{localOnly:true});
    return Promise.resolve({committed:true,state:next});
  }
  function mutate(expected,mutation,label){
    if(localOnly||!session)return localMutate(expected,mutation);
    return session.mutate(expected,mutation,label);
  }
  function expected(){
    return canonical?{runId:canonical.runId,revision:canonical.revision,phase:canonical.phase,wordIndex:canonical.wordIndex,ordinalMask:canonical.ordinalMask}:{};
  }
  function transitionTo(nextPhase,reason,extraMutation){
    if(!canonical || !(LEGAL[canonical.phase]||[]).includes(nextPhase))return Promise.resolve({committed:false,state:canonical});
    const before=expected();
    return mutate(before,function(next){
      next.phase=nextPhase;
      if(typeof extraMutation==='function')extraMutation(next);
      return next;
    },'phase '+canonical.phase+' -> '+nextPhase+' ('+(reason||'')+')');
  }
  function advanceWord(){
    if(!canonical || canonical.ordinalMask!==fullMask(canonical))return Promise.resolve({committed:false,state:canonical});
    const before=expected();
    const wi=canonical.wordIndex;
    return mutate(before,function(next){
      if(wi>=HOTEL_WORDS-1){
        next.wordIndex=HOTEL_WORDS;
        next.ordinalMask=0;
        next.phase=PHASE.COMPLETE;
        if(!next.completedAt)next.completedAt=typeof firebase!=='undefined'&&firebase.database?firebase.database.ServerValue.TIMESTAMP:Date.now();
      }else{
        next.wordIndex=wi+1;
        next.ordinalMask=0;
      }
      return next;
    },'advance word '+wi);
  }
  function scheduleDrive(){
    if(driveTimer||!active)return;
    driveTimer=later(function(){driveTimer=0;driveStateMachine();},80);
  }
  function driveStateMachine(){
    if(!canonical||!active)return;
    const maskFull=canonical.ordinalMask===fullMask(canonical) && fullMask(canonical)>0;
    const visits=roomVisitCount(canonical);
    if(canonical.phase===PHASE.ENTER){transitionTo(PHASE.ACTIVE_WORD,'run ready');return;}
    if(canonical.phase===PHASE.ACTIVE_WORD&&visits>=ROOM_THRESHOLDS.FIRST_DARK){transitionTo(PHASE.TEMP_BLACKOUT,'five unique rooms visited');return;}
    if(canonical.phase===PHASE.TEMP_BLACKOUT&&visits>=ROOM_THRESHOLDS.RESTORE){transitionTo(PHASE.RESTORE,'ten unique rooms visited');return;}
    if(canonical.phase===PHASE.RESTORE&&visits>=ROOM_THRESHOLDS.SECOND_DARK){transitionTo(PHASE.PERMANENT_DARK,'thirteen unique rooms visited');return;}
    if(maskFull&&canonical.wordIndex<HOTEL_WORDS)advanceWord();
  }

  function onSessionState(previous,next,meta){applyState(previous,next,meta||{});}
  function onSessionError(error,operation){
    if(errorShown)return;
    errorShown=true;
    if(adapter&&adapter.onSessionError)adapter.onSessionError(error,operation);
  }
  function startSession(){
    if(typeof HauntedHotelSession==='undefined')return;
    session=HauntedHotelSession.create({
      database:function(){return adapter&&adapter.database?adapter.database():null;},
      sessionId:function(){return adapter&&adapter.sessionId?adapter.sessionId():'';},
      isSoleOccupant:function(){return !adapter||!adapter.isSoleOccupant||adapter.isSoleOccupant();},
      shouldStartFresh:function(){return !!(adapter&&adapter.shouldStartFresh&&adapter.shouldStartFresh());},
      createInitial:initialRun,
      onState:onSessionState,
      onScare:function(event,meta){if(director)director.onSharedScare(event,meta||{});},
      onError:onSessionError,
      onDiagnostic:function(kind,detail){if(adapter&&adapter.onSessionDiagnostic)adapter.onSessionDiagnostic(kind,detail);}
    });
    session.start();
  }
  function startDirector(context){
    if(typeof HauntedHotelHorrorDirector==='undefined')return;
    if(!director){
      director=HauntedHotelHorrorDirector.create({
        userId:function(){return adapter&&adapter.userId?adapter.userId():'';},
        context:function(){return adapter&&adapter.directorContext?adapter.directorContext():{};},
        requestLocalScare:function(request){if(adapter&&adapter.requestScare)adapter.requestScare(request);},
        claimSharedScare:function(candidate,cooldownMs){
          return session&&session.claimScare?session.claimScare(candidate,cooldownMs):Promise.resolve({committed:false,offline:true});
        },
        diagnostic:function(kind,detail){if(adapter&&adapter.onDirectorDiagnostic)adapter.onDirectorDiagnostic(kind,detail||{});}
      });
    }
    director.start(context||{});
  }
  function startLocalFallback(){
    if(canonical||!active)return;
    localOnly=true;
    const run=initialRun();
    run.startedAt=run.updatedAt=Date.now();
    applyState(null,run,{localOnly:true});
    if(adapter&&adapter.onLocalFallback)adapter.onLocalFallback();
  }

  function init(nextAdapter){adapter=nextAdapter||null;return api;}
  function enter(context){
    clearTransient(true);
    resetSearch(true);
    if(session)session.stop();
    session=null; canonical=null; localOnly=false; pendingClaims.clear(); errorShown=false;
    active=true;
    currentFloor=floorIndex(context&&context.footY);
    lighting=context&&context.lighting||LIGHTING.NORMAL;
    if(adapter&&adapter.onEnter)adapter.onEnter(context||{});
    startDirector(context||{});
    startSession();
    // Offline play keeps the Phase 1 solo behavior. A later Firebase snapshot wins.
    localFallbackTimer=later(startLocalFallback,1800);
  }
  function reconcileSession(){if(session)session.reconcile();}
  function update(dt,now,footY){
    if(!active)return;
    if(session)session.reconcile();
    if(director)director.update(dt,now,adapter&&adapter.directorContext?adapter.directorContext():{});
    updateSearch(Number.isFinite(Number(now))?Number(now):performance.now(),dt);
    const next=floorIndex(footY);
    if(next!==currentFloor){
      const previous=currentFloor; currentFloor=next;
      if(adapter&&adapter.onFloorChanged)adapter.onFloorChanged(next,previous,{dt:dt,now:now});
    }
  }
  function claimOrdinal(info){
    const detail=info||{};
    if(!canonical||canonical.wordIndex!==detail.wordIndex)return Promise.resolve(false);
    const ordinal=Number(detail.ordinal);
    const view=publicState(canonical),word=view&&view.words[canonical.wordIndex];
    if(!Number.isInteger(ordinal)||!word||ordinal<0||ordinal>=word.en.length)return Promise.resolve(false);
    const bit=Math.pow(2,ordinal),key=canonical.runId+':'+canonical.wordIndex+':'+ordinal;
    if(canonical.ordinalMask% (bit*2)>=bit || pendingClaims.has(key))return Promise.resolve(false);
    pendingClaims.add(key);
    const before=expected();
    return mutate(before,function(next){
      if(next.ordinalMask%(bit*2)>=bit)return;
      next.ordinalMask+=bit;
      return next;
    },'claim ordinal '+ordinal).then(function(result){pendingClaims.delete(key);return !!(result&&result.committed);},function(){pendingClaims.delete(key);return false;});
  }
  function visitRoom(roomId){
    const id=String(roomId||'');
    if(!canonical||!/^F[1-5]_ROOM_[0-9]{3}$/.test(id))return Promise.resolve(false);
    const visits=parseRoomVisits(canonical.roomVisits);
    if(visits.indexOf(id)>=0)return Promise.resolve(false);
    const before=expected();
    return mutate(before,function(next){
      const nextVisits=parseRoomVisits(next.roomVisits);
      if(nextVisits.indexOf(id)>=0)return;
      nextVisits.push(id); next.roomVisits=nextVisits.sort().join(',');
      return next;
    },'visit room '+id).then(function(result){return !!(result&&result.committed);});
  }
  function returnToLobby(){
    if(!canonical||canonical.phase!==PHASE.COMPLETE)return Promise.resolve(false);
    return transitionTo(PHASE.RETURN,'return to lobby').then(function(result){return !!(result&&result.committed);});
  }
  function exit(){
    if(!active){clearTransient(true);resetSearch(true);if(session)session.stop();session=null;if(director)director.stop();return;}
    clearTransient(true);
    resetSearch(true);
    if(director)director.stop();
    if(session)session.stop();
    session=null; active=false; canonical=null; localOnly=false; pendingClaims.clear();
    currentFloor=FLOOR.GROUND; lighting=LIGHTING.NORMAL;
    if(adapter&&adapter.onExit)adapter.onExit();
  }
  function dispose(){exit();if(director)director.dispose();director=null;adapter=null;}
  function snapshot(){
    return {active:active,currentFloor:currentFloor,lighting:lighting,canonical:publicState(canonical),localOnly:localOnly,
      sessionId:session&&session.sessionId||'',timers:timers.size,intervals:intervals.size,listeners:listeners.length,audios:audios.size,objects:objects.length,
      search:{key:searchKey,startedAt:searchStartedAt,elapsedMs:searchElapsedMs,hintLevel:searchHintLevel,band:proximityBand,objective:searchObjective,
        currentHint:criticalCurrent&&criticalCurrent.id||'',queuedHints:criticalQueue.map(function(item){return item.id;}),lastHint:lastCritical&&lastCritical.id||''},
      director:director?director.snapshot():null};
  }

  const api={
    PHASE:PHASE,PHASES:PHASES,LEGAL:LEGAL,LIGHTING:LIGHTING,FLOOR:FLOOR,HOTEL_WORDS:HOTEL_WORDS,MAX_PLAYERS:MAX_PLAYERS,
    PLACEMENT_VERSION:PLACEMENT_VERSION,SEARCH:SEARCH,ROOM_THRESHOLDS:ROOM_THRESHOLDS,
    init:init,enter:enter,update:update,exit:exit,dispose:dispose,reconcileSession:reconcileSession,
    floorIndex:floorIndex,setLighting:setLighting,startFlicker:startFlicker,cancelFlicker:cancelFlicker,
    claimOrdinal:claimOrdinal,visitRoom:visitRoom,returnToLobby:returnToLobby,
    seededRandom:seededRandom,seededShuffle:seededShuffle,hash32:hash32,hashString:hashString,parseWords:parseWords,
    parseRoomVisits:parseRoomVisits,roomVisitCount:roomVisitCount,derivePlacements:derivePlacements,deriveRoomLetters:deriveRoomLetters,
    importantHint:importantHint,dismissHint:dismissHint,reopenHint:reopenHint,clearScopedHints:clearScopedHints,
    later:later,every:every,cancelTimer:cancelTimer,listen:listen,trackAudio:trackAudio,trackObject:trackObject,snapshot:snapshot,
    _validCanonical:validCanonical,_fullMask:fullMask,_bitCount:bitCount,_transitionTo:transitionTo,
    _updateSearch:updateSearch,_adoptSearchObjective:adoptSearchObjective,
    _setSearchElapsed:function(ms){searchElapsedMs=Math.max(0,Number(ms)||0);searchStartedAt=performance.now()-searchElapsedMs;searchCheckAt=0;}
  };
  window.HauntedHotelRuntime=api;
})();
