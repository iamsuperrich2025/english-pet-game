/* Atomic credit into the existing users/<uid>/save wallet; server receipt prevents duplicate claims. */
'use strict';
exports.credit=function(wrapper,key,total,now,serverPaid=0){
  if(!wrapper||typeof wrapper.data!=='string')throw Error('save_missing');
  const state=JSON.parse(wrapper.data),receipts=state.frontlineV1Receipts||{};
  if(!Number.isSafeInteger(total)||total<0||total%1000)throw Error('reward_invalid');
  const amount=Math.max(0,total-Math.max(receipts[key]||0,serverPaid));
  if(!amount)return wrapper;
  if(!Number.isFinite(state.coins)||state.coins<0)throw Error('save_invalid');
  const day=new Date(now+7*3600000).toISOString().slice(0,10);
  state.coins+=amount;state.lifetimeCoins=(Number(state.lifetimeCoins)||0)+amount;
  if(state.daily?.date!==day)state.daily={date:day,coins:0};
  state.daily.coins=(Number(state.daily.coins)||0)+amount;
  state.frontlineV1Receipts={...receipts,[key]:total};state.savedAt=now;
  return{...wrapper,data:JSON.stringify(state),at:now};
};
