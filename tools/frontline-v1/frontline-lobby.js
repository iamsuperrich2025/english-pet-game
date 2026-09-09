/* Overflow rooms use the same atomic four-seat admission; no shared production lobby. */
(function(){
  'use strict';
  const F=window.Frontline;
  F.roomCode=value=>/^R?\d{4}$/.test(value)?'R'+value.replace(/^R/,''):'R1001';
  F.nextRoom=(requested,offset)=>'R'+String((Number(requested.slice(1))+offset)%10000).padStart(4,'0');
  F.connectAvailable=async function(requested,notify,onOverflow=()=>{}){
    for(let number=0;number<10000;number++){
      const candidate=F.nextRoom(F.roomCode(requested),number);
      try{return await F.connect(candidate,notify);}
      catch(error){
        if(error.code!=='FRONTLINE_ROOM_FULL')throw error;
        onOverflow(candidate);
      }
    }
    throw Error('All test rooms are full. Please try again shortly.');
  };
})();
