import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';
const source=readFileSync(new URL('./frontline-economy.js',import.meta.url),'utf8');
function storage(){const data=new Map();return{getItem:k=>data.get(k)||null,setItem:(k,v)=>data.set(k,v),removeItem:k=>data.delete(k),data};}
function harness(){
  const localStorage=storage(),sessionStorage=storage(),saved={coins:10000,daily:{coins:0},lifetimeCoins:0};let failSave=false,credits=0;
  const c=vm.createContext({window:{Frontline:{C:{reward:1000},assertDev(){}}},state:structuredClone(saved),localStorage,sessionStorage,structuredClone,Date,Math});
  c.loadState=()=>structuredClone(saved);c.addCoins=n=>{credits++;c.state.coins+=n;c.state.daily.coins+=n;c.state.lifetimeCoins+=n;};
  c.saveState=()=>{if(failSave)throw Error('disk full');Object.assign(saved,structuredClone(c.state));};
  const load=()=>{vm.runInContext(source,c);return c.window.Frontline;};
  return{c,saved,load,F:load(),localStorage,sessionStorage,get credits(){return credits;},fail(value){failSave=value;}};
}
test('winner earnings accumulate in the session; central totals update only on settlement',()=>{
  const h=harness(),F=h.F;F.beginCoinSession();assert.equal(F.sessionCoins(),0);
  assert.equal(F.creditReward('run',1000,'p1'),1000);assert.equal(F.creditReward('run',2000,'p1'),1000);
  assert.equal(F.sessionCoins(),2000);assert.equal(h.c.state.coins,10000);assert.equal(h.credits,0);
  assert.equal(F.settleCoinSession(),2000);assert.equal(h.saved.coins,12000);assert.equal(h.saved.daily.coins,2000);assert.equal(h.saved.lifetimeCoins,2000);
  assert.equal(F.settleCoinSession(),0);assert.equal(h.credits,1);assert.equal(F.sessionCoins(),0);
});
test('repeated and out-of-order results do not duplicate earnings; re-admitted identity is separate',()=>{
  const {F}=harness();F.beginCoinSession();F.creditReward('r',2000,'p1');
  for(const total of [2000,1000,0,300,-1,Infinity])assert.equal(F.creditReward('r',total,'p1'),0);
  assert.equal(F.creditReward('r',1000,'p2'),1000);assert.equal(F.sessionCoins(),3000);
});
test('reload recovers an unbanked journal once and the next session starts from zero',()=>{
  const h=harness();h.F.beginCoinSession();h.F.creditReward('r',1000,'p');
  const F=h.load();assert.equal(F.recoverCoinSession(),1000);assert.equal(F.recoverCoinSession(),0);assert.equal(h.saved.coins,11000);
  F.beginCoinSession();assert.equal(F.sessionCoins(),0);F.settleCoinSession();assert.equal(h.saved.coins,11000);
});
test('failed central save keeps earnings retryable and rolls back daily/lifetime totals',()=>{
  const h=harness(),F=h.F;F.beginCoinSession();F.creditReward('r',1000,'p');h.fail(true);
  assert.throws(()=>F.settleCoinSession(),/disk full/);assert.equal(F.sessionCoins(),1000);assert.equal(h.c.state.coins,10000);assert.equal(h.c.state.daily.coins,0);
  h.fail(false);assert.equal(F.settleCoinSession(),1000);assert.equal(h.saved.coins,11000);
});
test('interrupted journal cleanup does not duplicate a successfully saved reward',()=>{
  const h=harness(),F=h.F;F.beginCoinSession();F.creditReward('r',1000,'p');
  const remove=h.localStorage.removeItem;h.localStorage.removeItem=()=>{throw Error('interrupted cleanup');};
  assert.throws(()=>F.settleCoinSession(),/interrupted/);assert.equal(h.saved.coins,11000);
  h.localStorage.removeItem=remove;assert.equal(h.load().recoverCoinSession(),0);assert.equal(h.saved.coins,11000);assert.equal(h.credits,1);
});
test('failed reward journal write can retry without losing or inflating the award',()=>{
  const h=harness(),F=h.F;F.beginCoinSession();const save=h.localStorage.setItem;h.localStorage.setItem=()=>{throw Error('storage full');};
  assert.throws(()=>F.creditReward('r',1000,'p'),/storage full/);assert.equal(F.sessionCoins(),0);
  h.localStorage.setItem=save;assert.equal(F.creditReward('r',1000,'p'),1000);assert.equal(F.sessionCoins(),1000);
});
test('settlement retains newer shared-wallet changes and a nonwinner receives no coins',()=>{
  const h=harness(),F=h.F;F.beginCoinSession();F.creditReward('r',0,'p');assert.equal(F.settleCoinSession(),0);assert.equal(h.credits,0);
  F.beginCoinSession();F.creditReward('r',1000,'p');h.saved.coins=12500;F.settleCoinSession();assert.equal(h.saved.coins,13500);
});
