/* 🔒 Kart private preview admission. A fresh server read is required on every entry. */
(function(root){
'use strict';
let admittedUser=null,serial=0;
function valid(){return !!admittedUser&&typeof Auth!=='undefined'&&Auth.user===admittedUser&&typeof canAccessKartBeta==='function'&&canAccessKartBeta();}
async function authorize(){
  admittedUser=null;const attempt=++serial;
  if(typeof canAccessKartBeta!=='function'||!canAccessKartBeta())throw new Error('เกมนี้เปิดให้แอดมินเท่านั้น');
  const user=Auth.user,token=await user.getIdToken();
  const base=firebase.app().options.databaseURL;
  if(!base)throw new Error('ยังเชื่อมต่อบัญชีไม่ได้');
  const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),12000);
  try{
    const response=await fetch(base.replace(/\/$/,'')+'/kartAccess.json?auth='+encodeURIComponent(token),{cache:'no-store',signal:controller.signal});
    if(!response.ok)throw new Error('ยังไม่ได้รับสิทธิ์ทดสอบ Kart จากเซิร์ฟเวอร์');
    await response.json();
    if(attempt!==serial||Auth.user!==user||!canAccessKartBeta())throw new Error('บัญชีเปลี่ยน กรุณาเข้าเกมอีกครั้ง');
    admittedUser=user;
  }finally{clearTimeout(timer);}
}
root.KartAccess=Object.freeze({authorize,valid,revoke(){serial++;admittedUser=null;}});
})(window);
