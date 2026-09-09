/* Public Firebase auth and server API. No emulator, mock identity or test wallet. */
(function(){
  'use strict';
  const F=window.Frontline,app=firebase.apps.length?firebase.app():firebase.initializeApp(FIREBASE_CONFIG);
  F.live={user:null,earned:0,claimed:0,code:'',ready:false};
  F.api=async function(action,code,input){
    const user=app.auth().currentUser;if(!user)throw Error('กรุณาเข้าสู่ระบบ Vocab World ก่อน');
    const token=await user.getIdToken(),controller=new AbortController(),timer=setTimeout(()=>controller.abort(),15000);
    try{
      const response=await fetch('https://asia-southeast1-english-pet-game.cloudfunctions.net/frontlineV1',{
        method:'POST',headers:{'Content-Type':'application/json',Authorization:'Bearer '+token},
        body:JSON.stringify({data:{action,code,...(input?{input}:{})}}),signal:controller.signal});
      const body=await response.json();if(body.error){const e=Error(body.error.message);e.code=body.error.details?.code;throw e;}return body.result??body.data;
    }finally{clearTimeout(timer);}
  };
  F.productionReady=new Promise((resolve,reject)=>{
    const off=app.auth().onAuthStateChanged(async user=>{
      off();if(!user){document.getElementById('fl-launch-status').textContent='กรุณาเข้าสู่ระบบที่ Lobby ก่อน';document.getElementById('fl-join').disabled=true;resolve(false);return;}
      try{
        F.live.user=user;const save=(await app.database().ref('users/'+user.uid+'/save').get()).val();
        if(!save?.data)throw Error('กรุณาเปิด Lobby และสร้างผู้เล่นก่อน');
        state=JSON.parse(save.data);F.live.ready=true;resolve(true);
      }catch(error){reject(error);}
    });
  });
  F.assertDev=()=>{if(!F.live.ready)throw Error('กรุณาเข้าสู่ระบบผ่าน Lobby ก่อน');return F.live;};
})();
