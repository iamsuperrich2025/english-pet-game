/* Session earnings are journaled locally; only settlement calls the shared Vocab World economy. */
(function(){
  'use strict';
  const F=window.Frontline,POINTER='vw.frontline-v1.coin-session',PREFIX=POINTER+'.pending.';
  let current=null;
  function read(id){const raw=id&&localStorage.getItem(PREFIX+id);return raw?JSON.parse(raw):null;}
  function persist(journal){localStorage.setItem(PREFIX+journal.id,JSON.stringify(journal));}
  function settle(journal){
    if(!journal||!journal.total)return 0;
    F.assertDev();
    if(typeof addCoins!=='function'||typeof saveState!=='function')throw Error('Main Vocab World economy is unavailable.');
    // Refresh the shared wallet before committing, so another local tab's saved balance is retained.
    if(typeof loadState==='function')state=loadState();
    const backup=structuredClone(state),receipts=state.frontlineV1DevSessionReceipts||{};
    const amount=Math.max(0,journal.total-(receipts[journal.id]||0));
    try{
      if(amount){addCoins(amount);state.frontlineV1DevSessionReceipts={...receipts,[journal.id]:journal.total};saveState();}
    }catch(error){state=backup;throw error;}
    // The receipt and wallet were saved together. Retrying after an interrupted cleanup cannot pay twice.
    localStorage.removeItem(PREFIX+journal.id);
    return amount;
  }
  F.recoverCoinSession=function(){
    const id=sessionStorage.getItem(POINTER),amount=settle(read(id));
    sessionStorage.removeItem(POINTER);current=null;return amount;
  };
  F.beginCoinSession=function(){
    F.recoverCoinSession();
    const id=Date.now().toString(36)+'-'+Math.random().toString(36).slice(2);
    sessionStorage.setItem(POINTER,id);current={id,total:0,claims:{}};
  };
  F.creditReward=function(run,cumulative,playerId){
    F.assertDev();
    if(!current||!playerId||!Number.isSafeInteger(cumulative)||cumulative<0||cumulative%F.C.reward)return 0;
    const key=run+':'+playerId,amount=Math.max(0,cumulative-(current.claims[key]||0));
    if(!amount)return 0;
    const next={...current,total:current.total+amount,claims:{...current.claims,[key]:cumulative}};
    persist(next);current=next;return amount;
  };
  F.settleCoinSession=function(){
    const amount=settle(current||read(sessionStorage.getItem(POINTER)));
    sessionStorage.removeItem(POINTER);current=null;return amount;
  };
  F.sessionCoins=()=>current?.total||0;
  F.balance=()=>state.coins;
})();
