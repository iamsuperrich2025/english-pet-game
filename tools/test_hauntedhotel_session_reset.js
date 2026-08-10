/* Haunted Hotel empty-instance reset and live-instance adoption regression. */
'use strict';
const fs=require('fs');
const vm=require('vm');
const assert=require('assert');

function run(id,updatedAt){
  return {runId:id,seed:7,phase:'ACTIVE_WORD',wordIndex:2,ordinalMask:3,
    cabinetLetterSlot:1,roomVisits:'F2_ROOM_201,F2_ROOM_202',completedAt:0,
    revision:8,wordSet:JSON.stringify([['ghost','ผี']]),startedAt:updatedAt,updatedAt};
}

function fakeDb(initial){
  const state={'hauntedHotel/r0/run':initial};
  const listeners={};
  let connectedListener=null,transactions=0;
  function snap(value){return {val:()=>value};}
  function notify(path){(listeners[path]||[]).slice().forEach(fn=>fn(snap(state[path])));}
  return {
    ref(path){
      return {
        on(event,fn){
          if(path==='.info/connected'){connectedListener=fn;queueMicrotask(()=>fn(snap(true)));return;}
          (listeners[path]||(listeners[path]=[])).push(fn);
          queueMicrotask(()=>fn(snap(state[path])));
        },
        off(event,fn){
          if(path==='.info/connected'){if(connectedListener===fn)connectedListener=null;return;}
          listeners[path]=(listeners[path]||[]).filter(item=>item!==fn);
        },
        transaction(update){
          transactions++;
          const next=update(state[path]);
          const committed=next!==undefined;
          if(committed){state[path]=next;queueMicrotask(()=>notify(path));}
          return Promise.resolve({committed,snapshot:snap(state[path])});
        }
      };
    },
    reconnect(){if(connectedListener){connectedListener(snap(false));connectedListener(snap(true));}},
    value(){return state['hauntedHotel/r0/run'];},
    get transactions(){return transactions;}
  };
}

function load(){
  const context={console,setTimeout,clearTimeout,queueMicrotask,Date,Math,Promise};
  context.window=context;
  context.firebase={database:function(){},};
  context.firebase.database.ServerValue={TIMESTAMP:Date.now()};
  vm.createContext(context);
  vm.runInContext(fs.readFileSync('js/hauntedhotelsession.js','utf8'),context,{filename:'hauntedhotelsession.js'});
  return context.HauntedHotelSession;
}
function settle(){return new Promise(resolve=>setTimeout(resolve,10));}

(async function(){
  const HH=load(),old=run('abandoned-run',Date.now()-1000),db=fakeDb(old),seen=[];
  let initialCalls=0;
  const session=HH.create({database:()=>db,sessionId:()=> 'r0',isSoleOccupant:()=>true,
    shouldStartFresh:()=>true,
    createInitial(){initialCalls++;return Object.assign(run('fresh-run',Date.now()),{phase:'ENTER',wordIndex:0,ordinalMask:0,roomVisits:'',revision:1});},
    onState(previous,next){seen.push(next.runId);}
  });
  session.start();await settle();
  assert.strictEqual(db.value().runId,'fresh-run','first player after an empty hotel reused an abandoned run');
  assert.deepStrictEqual(seen,['fresh-run'],'abandoned state leaked to the first entrant before reset');
  assert.strictEqual(initialCalls,1,'fresh seat initialized more than once');

  db.reconnect();await settle();
  assert.strictEqual(db.value().runId,'fresh-run','Firebase reconnect restarted the active run');
  assert.strictEqual(initialCalls,1,'fresh-start signal was not consumed after initialization');
  session.stop();

  const shared=run('live-shared-run',Date.now()),db2=fakeDb(shared),seen2=[];
  const joiner=HH.create({database:()=>db2,sessionId:()=> 'r0',isSoleOccupant:()=>false,
    shouldStartFresh:()=>false,createInitial(){throw new Error('joiner must not create a run');},
    onState(previous,next){seen2.push(next.runId);}
  });
  joiner.start();await settle();
  assert.strictEqual(db2.value().runId,'live-shared-run','joining player replaced a live shared run');
  assert.deepStrictEqual(seen2,['live-shared-run'],'joining player did not adopt the canonical live run');
  joiner.stop();

  console.log('PASS Haunted Hotel session: empty instance resets once; live instance is adopted');
})().catch(error=>{console.error(error);process.exitCode=1;});
