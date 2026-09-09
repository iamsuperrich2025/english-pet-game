/* Server-confirmed session coins, settled atomically into the existing central cloud save. */
(function(){
  'use strict';const F=window.Frontline;let shown=0;
  F.balance=()=>Number(state.coins)||0;
  F.sessionCoins=()=>Math.max(0,F.live.earned-F.live.claimed);
  F.creditReward=()=>{const next=F.sessionCoins(),delta=Math.max(0,next-shown);shown=next;return delta;};
  F.settleCoinSession=async function(){
    if(!F.live.code)return 0;
    const result=await F.api('settle',F.live.code),next=JSON.parse(result.save.data),amount=result.amount||0;
    state=next;saveState();F.live.claimed=result.total;shown=0;return amount;
  };
  F.recoverCoinSession=async function(){
    if(!await F.productionReady)return 0;
    const code=localStorage.getItem('vw.frontline.live.room.'+F.live.user.uid);
    if(!/^R\d{4}$/.test(code||''))return 0;
    F.live.code=code;const amount=await F.settleCoinSession();F.live.code='';F.live.earned=0;F.live.claimed=0;return amount;
  };
  F.beginCoinSession=async()=>{await F.recoverCoinSession();shown=0;};
})();
