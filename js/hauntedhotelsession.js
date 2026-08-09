/* ============================================================
   hauntedhotelsession.js — Haunted Hotel canonical run adapter
   One low-frequency Firebase record per NetRoom hotel instance.
   This module intentionally does not know about rendering, movement or rewards.
   ============================================================ */
(function(){
  'use strict';

  const ROOT='hauntedHotel';
  // A normal reconnect must always resume. Only reclaim a non-terminal run after
  // a long absence; ordinary leave/re-enter and temporary outages stay canonical.
  const ABANDONED_MS=2*60*60*1000;

  function isRun(value){
    return !!(value && typeof value==='object' && typeof value.runId==='string' && value.runId &&
      typeof value.seed==='number' && typeof value.phase==='string' &&
      typeof value.wordIndex==='number' && typeof value.ordinalMask==='number' &&
      typeof value.cabinetLetterSlot==='number' && typeof value.wordSet==='string');
  }

  function create(options){
    const opt=options||{};
    let active=false;
    let connected=false;
    let reconnecting=false;
    let sessionId='';
    let runRef=null;
    let scareRef=null;
    let connectedRef=null;
    let current=null;
    let candidate=null;
    let initBusy=false;
    let retryAt=0;
    let generation=0;
    let currentScareId='';

    function database(){ return typeof opt.database==='function'?opt.database():opt.database; }
    function serverNow(){
      return typeof firebase!=='undefined' && firebase.database && firebase.database.ServerValue
        ? firebase.database.ServerValue.TIMESTAMP : Date.now();
    }
    function report(kind,detail){ if(typeof opt.onDiagnostic==='function') opt.onDiagnostic(kind,detail||{}); }
    function emit(next,meta){
      if(!isRun(next)) return;
      if(current && current.runId===next.runId && current.revision===next.revision && !(meta&&meta.reconnect)) return;
      const previous=current;
      current=next;
      if(typeof opt.onState==='function') opt.onState(previous,next,meta||{});
    }
    function detachRun(){
      generation++;
      if(runRef) runRef.off('value',onValue);
      if(scareRef) scareRef.off('value',onScareValue);
      runRef=null;
      scareRef=null;
      sessionId='';
      current=null;
      candidate=null;
      initBusy=false;
      retryAt=0;
      currentScareId='';
    }
    function onValue(snapshot){
      if(!active) return;
      const value=snapshot.val();
      if(isRun(value)){
        const wasReconnect=reconnecting;
        reconnecting=false;
        emit(value,{reconnect:wasReconnect,source:'firebase'});
      }else if(connected){
        initialize();
      }
    }
    function isScare(value){
      return !!(value&&typeof value==='object'&&typeof value.eventId==='string'&&value.eventId&&
        typeof value.type==='string'&&typeof value.target==='string'&&typeof value.eventSeed==='number'&&
        typeof value.createdAt==='number');
    }
    function onScareValue(snapshot){
      if(!active)return;
      const value=snapshot.val();
      if(!isScare(value))return;
      const duplicate=currentScareId===value.eventId;
      currentScareId=value.eventId;
      if(!duplicate&&typeof opt.onScare==='function')opt.onScare(value,{source:'firebase',reconnect:reconnecting});
    }
    function shouldReplace(run){
      if(!isRun(run) || typeof opt.isSoleOccupant!=='function' || !opt.isSoleOccupant()) return false;
      if(run.phase==='RETURN') return true;
      const touched=Number(run.updatedAt)||Number(run.startedAt)||0;
      return touched>0 && Date.now()-touched>ABANDONED_MS;
    }
    function initialCandidate(){
      if(!candidate){
        candidate=opt.createInitial();
        candidate.startedAt=serverNow();
        candidate.updatedAt=serverNow();
      }
      return candidate;
    }
    function initialize(){
      if(!active || !connected || !runRef || initBusy || Date.now()<retryAt) return Promise.resolve(null);
      initBusy=true;
      const myGeneration=generation;
      return runRef.transaction(function(value){
        if(isRun(value) && !shouldReplace(value)) return;
        return initialCandidate();
      },undefined,false).then(function(result){
        if(myGeneration!==generation) return null;
        initBusy=false;
        retryAt=0;
        const value=result && result.snapshot && result.snapshot.val();
        if(result && result.committed){
          report('initialized',{sessionId:sessionId,runId:value&&value.runId});
        }else if(isRun(value)){
          report('adopted',{sessionId:sessionId,runId:value.runId});
          emit(value,{source:'initialize'});
        }
        return value||null;
      }).catch(function(error){
        if(myGeneration===generation) initBusy=false;
        if(myGeneration===generation) retryAt=Date.now()+10000;
        report('error',{operation:'initialize',error:error});
        if(typeof opt.onError==='function') opt.onError(error,'initialize');
        return null;
      });
    }
    function bind(nextId){
      const db=database();
      if(!active || !db || !nextId || nextId===sessionId) return;
      detachRun();
      sessionId=nextId;
      runRef=db.ref(ROOT+'/'+nextId+'/run');
      scareRef=db.ref(ROOT+'/'+nextId+'/scare');
      runRef.on('value',onValue,function(error){
        report('error',{operation:'subscribe',error:error});
        if(typeof opt.onError==='function') opt.onError(error,'subscribe');
      });
      scareRef.on('value',onScareValue,function(error){
        report('error',{operation:'subscribe scare',error:error});
        if(typeof opt.onError==='function') opt.onError(error,'subscribe scare');
      });
      initialize();
    }
    function reconcile(){
      if(!active) return;
      const nextId=typeof opt.sessionId==='function'?opt.sessionId():'';
      if(nextId && nextId!==sessionId) bind(nextId);
      else if(nextId && runRef && connected && !current) initialize();
    }
    function onConnection(snapshot){
      const next=snapshot.val()===true;
      if(next && !connected) reconnecting=true;
      connected=next;
      if(connected){retryAt=0;reconcile();initialize();}
    }
    function start(){
      if(active) return;
      active=true;
      const db=database();
      if(!db) return;
      connectedRef=db.ref('.info/connected');
      connectedRef.on('value',onConnection);
      reconcile();
    }
    function stop(){
      active=false;
      detachRun();
      if(connectedRef) connectedRef.off('value',onConnection);
      connectedRef=null;
      connected=false;
      reconnecting=false;
    }

    function matches(value,expected){
      if(!isRun(value)) return false;
      const check=expected||{};
      return Object.keys(check).every(function(key){ return check[key]===undefined || value[key]===check[key]; });
    }
    function mutate(expected,mutation,label){
      reconcile();
      if(!runRef || !connected) return Promise.resolve({committed:false,state:current,offline:true});
      const myGeneration=generation;
      return runRef.transaction(function(value){
        if(!matches(value,expected)) return;
        const next=mutation(Object.assign({},value));
        if(!next) return;
        next.revision=(Number(value.revision)||0)+1;
        next.updatedAt=serverNow();
        return next;
      },undefined,false).then(function(result){
        if(myGeneration!==generation) return {committed:false,state:null,detached:true};
        const value=result && result.snapshot && result.snapshot.val();
        if(!result || !result.committed){
          report('lost-race',{operation:label||'mutation',sessionId:sessionId});
          if(isRun(value)) emit(value,{source:'lost-race'});
        }
        return {committed:!!(result&&result.committed),state:isRun(value)?value:null};
      }).catch(function(error){
        report('error',{operation:label||'mutation',error:error});
        if(typeof opt.onError==='function') opt.onError(error,label||'mutation');
        return {committed:false,state:current,error:error};
      });
    }

    /* One compact current event per hotel. A transaction makes simultaneous
       director requests converge on one winner without a fragile host. */
    function claimScare(candidate,cooldownMs){
      reconcile();
      if(!scareRef||!connected||!isScare(candidate))return Promise.resolve({committed:false,event:null,offline:true});
      const myGeneration=generation,now=Date.now(),cooldown=Math.max(10000,Number(cooldownMs)||0);
      return scareRef.transaction(function(value){
        const created=value&&Number(value.createdAt)||0;
        if(isScare(value)&&created&&now-created<cooldown)return;
        return candidate;
      },undefined,false).then(function(result){
        if(myGeneration!==generation)return {committed:false,event:null,detached:true};
        const value=result&&result.snapshot&&result.snapshot.val();
        report(result&&result.committed?'scare-claimed':'scare-adopted',{sessionId:sessionId,eventId:value&&value.eventId});
        return {committed:!!(result&&result.committed),event:isScare(value)?value:null};
      }).catch(function(error){
        report('error',{operation:'claim scare',error:error});
        if(typeof opt.onError==='function')opt.onError(error,'claim scare');
        return {committed:false,event:null,error:error};
      });
    }

    return {
      start:start,
      stop:stop,
      reconcile:reconcile,
      mutate:mutate,
      claimScare:claimScare,
      get state(){ return current; },
      get sessionId(){ return sessionId; },
      get connected(){ return connected; },
      _isRun:isRun,
      _isScare:isScare,
      _shouldReplace:shouldReplace
    };
  }

  window.HauntedHotelSession={ROOT:ROOT,create:create,isRun:isRun};
})();
