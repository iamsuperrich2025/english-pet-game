"use strict";
/* ============================================================
   Account deletion — protected, re-authenticated, multi-path cleanup
   Destructive writes begin only after typed confirmation + recent Google auth.
   ============================================================ */
(function(){
  const REDIRECT_KEY='vwDeleteReauthPending';
  const VERIFIED_KEY='vwDeleteReauthVerified';
  const FINALIZE_KEY='vwDeleteFinalizeOnly';
  const RECENT_MS=4*60*1000;
  const MAPS=['adv','haunt','heli','drone','drive','moto','invasion','soccer','mecha','f1'];
  const LEGACY_MAPS=['adv','haunt','heli','drone','drive','moto','invasion'];
  const RTC_MAPS=['adv','haunt','heli','drone','drive','chat'];
  const CLASS_MAPS=['adv','haunt','heli','drone','drive'];
  const AWARDS=['wsAward','tpAward','sgAward','pmAward','bbAward'];
  const els=(root,sel)=>root.querySelector(sel);
  const safe=s=>typeof escapeHTML==='function'?escapeHTML(String(s||'')):String(s||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const cleanUid=s=>/^[A-Za-z0-9:.-]{1,160}$/.test(String(s||''))?String(s):'';
  const put=(o,path)=>{ if(path)o[path]=null; };

  function currentUser(){ return typeof Auth!=='undefined'&&Auth.user?Auth.user:null; }
  function db(){ return typeof Online!=='undefined'&&Online.db?Online.db:(typeof firebase!=='undefined'?firebase.database():null); }
  function verified(uid){
    try{ const v=JSON.parse(sessionStorage.getItem(VERIFIED_KEY)||'null'); return !!(v&&v.uid===uid&&Date.now()-v.at<RECENT_MS); }catch(e){return false;}
  }
  function markVerified(uid){ try{sessionStorage.setItem(VERIFIED_KEY,JSON.stringify({uid,at:Date.now()}));}catch(e){} }
  function clearSession(){ try{sessionStorage.removeItem(REDIRECT_KEY);sessionStorage.removeItem(VERIFIED_KEY);sessionStorage.removeItem(FINALIZE_KEY);}catch(e){} }
  function accountError(err){
    const code=String(err&&err.code||'');
    if(code.includes('network')) return 'เชื่อมต่อไม่สำเร็จ กรุณาตรวจอินเทอร์เน็ตแล้วลองใหม่ · Network error. Please try again.';
    if(code.includes('popup-closed')) return 'ยกเลิกการยืนยันตัวตนแล้ว ยังไม่มีข้อมูลถูกลบ · Verification was cancelled; nothing was deleted.';
    if(code.includes('requires-recent-login')) return 'ต้องยืนยันบัญชี Google ใหม่ก่อน ระบบหยุดไว้โดยยังไม่เริ่มลบข้อมูล · Please re-authenticate before deletion.';
    return 'ดำเนินการไม่สำเร็จ กรุณาลองใหม่ หรือติดต่อ freddommun@gmail.com · Unable to complete. Please retry or contact support.';
  }
  function overlay(){
    let o=document.getElementById('account-delete-overlay');
    if(!o){ o=document.createElement('div');o.id='account-delete-overlay';o.className='account-delete-overlay';document.body.appendChild(o); }
    return o;
  }
  function close(){ const o=document.getElementById('account-delete-overlay');if(o)o.remove(); }
  function bindCancel(o){ o.querySelectorAll('[data-ad-cancel]').forEach(b=>b.addEventListener('click',close)); }

  function showWarning(){
    const user=currentUser(),o=overlay();
    o.innerHTML=`<div class="ad-box" role="dialog" aria-modal="true" aria-labelledby="ad-title">
      <div class="ad-head"><span>⚠️</span><div><h2 id="ad-title">ลบบัญชีและข้อมูล</h2><p>Delete account and data</p></div></div>
      <div class="ad-warning"><b>การลบบัญชีไม่สามารถย้อนกลับได้ และข้อมูลที่ถูกลบอาจไม่สามารถกู้คืนได้</b><br>
      Account deletion is permanent. Deleted data may not be recoverable.</div>
      <div class="ad-grid">
        <div><b>ข้อมูลที่จะลบ</b><br>ความคืบหน้า เหรียญ สัตว์ สิ่งของ ผลการเรียน/สอบ โปรไฟล์ รูปโปรไฟล์ เพื่อน ข้อความ/โพสต์/ความคิดเห็นของคุณ และข้อมูลออนไลน์ที่ผูกกับบัญชี</div>
        <div><b>Data to be deleted</b><br>Progress, coins, pets, items, learning/exam progress, profile/photo, friends, your messages/posts/comments, and account-linked online data.</div>
      </div>
      <p class="ad-shared">ข้อมูลร่วมบางรายการของผู้เล่นอื่นจะไม่ถูกลบทั้งก้อน; ระบบจะลบหรือแยกเฉพาะส่วนของบัญชีนี้ และอาจเก็บบันทึกทางเทคนิค/ความปลอดภัยเท่าที่จำเป็น<br>Shared records are cleaned only for this account; limited technical/security records may be retained when necessary.</p>
      ${user?`<p class="ad-account">บัญชี · Account: <b>${safe(user.email||user.uid)}</b></p>`:'<p class="ad-error">ต้องออนไลน์และเข้าสู่ระบบก่อน · Sign in and connect to the internet first.</p>'}
      <div class="ad-actions"><button class="ad-safe" data-ad-cancel>ยกเลิก · Cancel</button><button class="ad-danger-outline" id="ad-continue" ${user?'':'disabled'}>ดำเนินการต่อ · Continue</button></div>
    </div>`;
    bindCancel(o); const c=els(o,'#ad-continue');if(c)c.addEventListener('click',showTyped);
  }

  function showTyped(){
    const user=currentUser(),o=overlay(); if(!user){showWarning();return;}
    o.innerHTML=`<div class="ad-box ad-typed" role="dialog" aria-modal="true" aria-labelledby="ad-type-title">
      <div class="ad-head"><span>⌨️</span><div><h2 id="ad-type-title">พิมพ์ DELETE เพื่อดำเนินการต่อ</h2><p>Type DELETE exactly to continue</p></div></div>
      <p>อย่าพิมพ์คำนี้หากยังไม่ต้องการลบบัญชี ข้อมูลจะยังไม่ถูกลบในขั้นตอนนี้<br>Do not type it unless you intend to delete the account. Nothing is deleted at this step.</p>
      <label class="ad-type-label" for="ad-type-input">คำยืนยัน · Confirmation</label>
      <input id="ad-type-input" type="text" inputmode="latin" autocomplete="off" autocapitalize="characters" spellcheck="false" placeholder="DELETE" aria-describedby="ad-type-help">
      <small id="ad-type-help">ต้องตรงทุกตัวอักษร ไม่มีช่องว่าง · Exact match, no spaces</small>
      <div class="ad-actions"><button class="ad-safe" data-ad-cancel>ยกเลิก · Cancel</button><button class="ad-verify" id="ad-verify" disabled>${verified(user.uid)?'ดำเนินการสู่ขั้นสุดท้าย · Continue to final step':'ยืนยันบัญชี Google · Verify Google account'}</button></div>
    </div>`;
    bindCancel(o); const input=els(o,'#ad-type-input'),btn=els(o,'#ad-verify');
    input.addEventListener('input',()=>{btn.disabled=input.value!=='DELETE';});
    btn.addEventListener('click',()=>{ if(input.value!=='DELETE')return; verified(user.uid)?showFinal():reauthenticate(btn); });
    setTimeout(()=>input.focus(),0);
  }

  async function reauthenticate(btn){
    const user=currentUser();if(!user)return showWarning();
    btn.disabled=true;btn.textContent='กำลังเปิด Google… · Opening Google…';
    const provider=new firebase.auth.GoogleAuthProvider();
    try{
      if(typeof authIsAppMode==='function'&&authIsAppMode()){
        sessionStorage.setItem(REDIRECT_KEY,JSON.stringify({uid:user.uid,at:Date.now()}));
        await user.reauthenticateWithRedirect(provider); return;
      }
      await user.reauthenticateWithPopup(provider); markVerified(user.uid); showFinal();
    }catch(err){ btn.disabled=false;btn.textContent='ยืนยันบัญชี Google · Verify Google account';showInlineError(accountError(err)); }
  }

  function showInlineError(msg){ const o=overlay();let e=els(o,'.ad-inline-error');if(!e){e=document.createElement('p');e.className='ad-inline-error';els(o,'.ad-actions').before(e);}e.textContent=msg; }
  function showFinal(){
    const user=currentUser(),o=overlay(); if(!user||!verified(user.uid)){showTyped();return;}
    o.innerHTML=`<div class="ad-box ad-final" role="dialog" aria-modal="true" aria-labelledby="ad-final-title">
      <div class="ad-head"><span>🛑</span><div><h2 id="ad-final-title">ขั้นตอนสุดท้าย · Final step</h2><p>Google account verified</p></div></div>
      <p><b>ไม่มีการย้อนกลับหลังจากกดปุ่มสีแดงด้านล่าง</b><br>There is no undo after pressing the red button below.</p>
      <div class="ad-actions"><button class="ad-safe" data-ad-cancel>ยกเลิก · Cancel</button><button class="ad-danger" id="ad-final">ลบบัญชีและข้อมูลถาวร · Permanently delete account and data</button></div>
    </div>`;
    bindCancel(o);els(o,'#ad-final').addEventListener('click',beginDeletion);
  }

  async function snap(path,query){
    const ref=db().ref(path),q=query?query(ref):ref,s=await q.get();return s&&s.val?s.val():null;
  }
  function examIds(){
    const out=[];if(typeof EXAM_STD_MANIFEST!=='undefined')Object.values(EXAM_STD_MANIFEST).forEach(x=>(x.sets||[]).forEach(s=>out.push(s.id)));
    return out.length?out:['ielts_1','ielts_2','ielts_3','ielts_4','ielts_5','toeic_1','toeic_2','toeic_3','toeic_4','toeic_5','toefl_1','toefl_2','toefl_3','toefl_4','toefl_5'];
  }
  function bandIds(){ const out=[];if(typeof BAND_ADV_MANIFEST!=='undefined')Object.keys(BAND_ADV_MANIFEST).forEach(c=>['found','inter','expert'].forEach(l=>out.push(c+'_'+l)));return out; }
  function otherFromPair(pid,uid){ const a=String(pid||'').split('_');if(a.length!==2)return'';return a[0]===uid?a[1]:(a[1]===uid?a[0]:''); }
  function addKeys(set,obj){ if(obj&&typeof obj==='object')Object.keys(obj).forEach(k=>{k=cleanUid(k);if(k)set.add(k);}); }

  async function collect(uid){
    const base={};
    const jobs={friends:'friends/'+uid,requests:'friendReq/'+uid,gifts:'gifts/'+uid,tinv:'tinv/'+uid,calls:'calls/'+uid,
      followers:'follow/'+uid,notifs:'gnotif/'+uid+'/n',msold:'msold/'+uid,market:'market',ads:'ads',gfeed:'gfeed'};
    await Promise.all(Object.entries(jobs).map(([k,p])=>snap(p).then(value=>{base[k]=value;})));
    base.awards={};await Promise.all(AWARDS.map(async a=>{base.awards[a]=await snap(a);}));
    base.classes={};await Promise.all(CLASS_MAPS.map(async m=>{base.classes[m]=await snap('class/'+m);}));
    const contacts=new Set();
    [base.friends,base.requests,base.gifts,base.tinv,base.calls,base.followers].forEach(x=>addKeys(contacts,x));
    addKeys(contacts,state&&state.follows);addKeys(contacts,state&&state.tinvSent);
    if(state&&state.chatSeen)Object.keys(state.chatSeen).forEach(pid=>{const u=cleanUid(otherFromPair(pid,uid));if(u)contacts.add(u);});
    if(typeof Online!=='undefined'){
      (Online.myFriends||[]).forEach(x=>{const u=cleanUid(x.uid);if(u)contacts.add(u);});
      (Online.giftOut||[]).forEach(x=>{const u=cleanUid(x.to);if(u)contacts.add(u);});
    }
    Object.values(base.notifs||{}).forEach(x=>{const u=cleanUid(x&&x.u);if(u)contacts.add(u);});
    Object.values(base.gfeed||{}).forEach(p=>{ const u=cleanUid(p&&p.u);if(u)contacts.add(u);Object.values(p&&p.cm||{}).forEach(c=>{const cu=cleanUid(c&&c.u);if(cu)contacts.add(cu);}); });
    contacts.delete(uid);base.contacts=[...contacts];base.chats={};base.sentNotifs={};
    await Promise.all(base.contacts.map(async u=>{
      const pair=[uid,u].sort().join('_');
      base.chats[pair]=await snap('chats/'+pair);
      base.sentNotifs[u]=await snap('gnotif/'+u+'/n',r=>r.orderByChild('u').equalTo(uid));
    }));
    const pq=typeof PicQuizOnline!=='undefined'&&PicQuizOnline._t&&PicQuizOnline._t.P;
    if(pq&&/^[A-Z0-9]{6}$/.test(pq.code||'')){base.pquizCode=pq.code;base.pquiz=await snap('pquizRooms/'+pq.code);}
    return base;
  }

  function buildUpdates(uid,b){
    const u={};
    ['users/'+uid,'pphoto/'+uid,'presence/'+uid,'leaderboard/'+uid,'feed/'+uid,'f1Rank/'+uid].forEach(p=>put(u,p));
    if(typeof friendCode==='function')put(u,'friendCodes/'+friendCode(uid));
    examIds().forEach(id=>put(u,'examRank/'+id+'/'+uid));bandIds().forEach(id=>put(u,'bandRank/'+id+'/'+uid));
    LEGACY_MAPS.forEach(m=>put(u,'world/'+m+'/'+uid));
    MAPS.forEach(m=>{for(let i=0;i<36;i++){put(u,`wroom/${m}/r${i}/${uid}`);put(u,`winfo/${m}/r${i}/${uid}`);}});
    RTC_MAPS.forEach(m=>put(u,'rtc/'+m+'/'+uid));put(u,'calls/'+uid);put(u,'gnotif/'+uid+'/seen');
    Object.keys(b.friends||{}).forEach(x=>put(u,'friends/'+uid+'/'+x));
    Object.keys(b.requests||{}).forEach(x=>put(u,'friendReq/'+uid+'/'+x));
    Object.keys(b.gifts||{}).forEach(x=>put(u,'gifts/'+uid+'/'+x));
    Object.keys(b.tinv||{}).forEach(x=>put(u,'tinv/'+uid+'/'+x));
    Object.keys(b.followers||{}).forEach(x=>put(u,'follow/'+uid+'/'+x));
    Object.keys(b.notifs||{}).forEach(x=>put(u,'gnotif/'+uid+'/n/'+x));
    Object.keys(b.msold||{}).forEach(x=>put(u,'msold/'+uid+'/'+x));
    b.contacts.forEach(x=>{
      put(u,'friends/'+x+'/'+uid);put(u,'friendReq/'+x+'/'+uid);put(u,'gifts/'+x+'/'+uid);put(u,'tinv/'+x+'/'+uid);put(u,'calls/'+x+'/'+uid);put(u,'follow/'+x+'/'+uid);
      const pair=[uid,x].sort().join('_');put(u,'typing/'+pair);put(u,'chattheme/'+pair);
      Object.entries(b.chats[pair]||{}).forEach(([k,v])=>{if(v&&v.f===uid)put(u,'chats/'+pair+'/'+k);});
      Object.keys(b.sentNotifs[x]||{}).forEach(k=>put(u,'gnotif/'+x+'/n/'+k));
    });
    Object.entries(b.market||{}).forEach(([k,v])=>{if(v&&v.sid===uid)put(u,'market/'+k);});
    Object.entries(b.ads||{}).forEach(([k,v])=>{if(v&&v.uid===uid)put(u,'ads/'+k);});
    Object.entries(b.gfeed||{}).forEach(([pid,p])=>{
      if(!p)return;if(p.u===uid){put(u,'gfeed/'+pid);return;}put(u,`gfeed/${pid}/lk/${uid}`);
      Object.entries(p.cm||{}).forEach(([cid,c])=>{if(c&&c.u===uid)put(u,`gfeed/${pid}/cm/${cid}`);else put(u,`gfeed/${pid}/cm/${cid}/cl/${uid}`);});
    });
    Object.entries(b.awards||{}).forEach(([root,months])=>Object.keys(months||{}).forEach(m=>{if(months[m]&&months[m].w&&months[m].w[uid])put(u,`${root}/${m}/w/${uid}`);}));
    Object.entries(b.classes||{}).forEach(([map,c])=>Object.entries(c&&c.podium&&c.podium.top||{}).forEach(([i,row])=>{if(row&&row.u===uid)put(u,`class/${map}/podium/top/${i}`);}));
    if(b.pquizCode&&b.pquiz){
      const root='pquizRooms/'+b.pquizCode,p=b.pquiz;
      if(p.owner===uid)put(u,root);
      else{
        Object.entries(p.members||{}).forEach(([s,m])=>{if(m&&m.u===uid)put(u,`${root}/members/${s}`);});
        put(u,`${root}/scores/${uid}`);
        Object.keys(p.answers||{}).forEach(r=>put(u,`${root}/answers/${r}/${uid}`));
        Object.entries(p.chat||{}).forEach(([k,m])=>{if(m&&m.u===uid)put(u,`${root}/chat/${k}`);});
        Object.entries(p.voice&&p.voice.members||{}).forEach(([s,m])=>{if(m&&m.u===uid)put(u,`${root}/voice/members/${s}`);});
      }
      put(u,`pquizRtc/${b.pquizCode}/${uid}`);
    }
    return u;
  }

  async function assertRecent(user){
    if(!verified(user.uid))throw Object.assign(new Error('recent'),{code:'auth/requires-recent-login'});
    const token=await user.getIdTokenResult(true),at=Number(token&&token.claims&&token.claims.auth_time||0)*1000;
    if(!at||Date.now()-at>=RECENT_MS)throw Object.assign(new Error('recent'),{code:'auth/requires-recent-login'});
  }
  function showBusy(text){ const o=overlay();o.innerHTML=`<div class="ad-box ad-busy" role="status"><div class="ad-spinner"></div><h2>${text}</h2><p>กรุณาอย่าปิดแอป · Please keep the app open</p></div>`; }
  async function beginDeletion(){
    const user=currentUser();if(!user)return showWarning();showBusy('กำลังตรวจสอบก่อนลบ… · Preparing deletion…');
    let dataWritten=false;
    try{
      await assertRecent(user);
      const finalizeOnly=sessionStorage.getItem(FINALIZE_KEY)===user.uid;
      if(!finalizeOnly){
        const base=await collect(user.uid),updates=buildUpdates(user.uid,base);
        await assertRecent(user);showBusy('กำลังลบข้อมูลบัญชี… · Deleting account data…');
        await db().ref().update(updates);dataWritten=true;sessionStorage.setItem(FINALIZE_KEY,user.uid);
      }
      await user.delete();clearLocal();showSuccess();
    }catch(err){
      if(dataWritten||sessionStorage.getItem(FINALIZE_KEY)===user.uid) showFinalizeFailure(err);
      else{showTyped();showInlineError(accountError(err));}
    }
  }
  function clearLocal(){
    try{if(typeof STORAGE_KEY!=='undefined')localStorage.removeItem(STORAGE_KEY);else localStorage.removeItem('petVocabAdventure_v1');}catch(e){}
    try{localStorage.removeItem(typeof PHOTO_LS_KEY!=='undefined'?PHOTO_LS_KEY:'petVocabAdventure_photo');}catch(e){}
    try{if(typeof PhotoMine!=='undefined')PhotoMine='';}catch(e){} clearSession();
  }
  function showFinalizeFailure(err){
    const o=overlay();o.innerHTML=`<div class="ad-box" role="alert"><div class="ad-head"><span>⚠️</span><div><h2>ยังปิดบัญชีไม่สำเร็จ</h2><p>Account finalization is incomplete</p></div></div>
      <p>ข้อมูลบัญชีถูกทำความสะอาดแล้ว แต่การปิดบัญชี Authentication ยังไม่สำเร็จ <b>อย่าออกจากระบบ</b> กรุณายืนยัน Google แล้วลองปิดบัญชีอีกครั้ง<br>Account data was cleaned, but Authentication deletion did not finish. Stay signed in, re-verify, and retry.</p>
      <p class="ad-inline-error">${safe(accountError(err))}</p><div class="ad-actions"><button class="ad-safe" data-ad-cancel>ปิด · Close</button><button class="ad-verify" id="ad-retry-final">ยืนยันและลองอีกครั้ง · Verify & retry</button></div></div>`;
    bindCancel(o);els(o,'#ad-retry-final').addEventListener('click',()=>reauthenticate({disabled:false,textContent:''}));
  }
  function showSuccess(){
    const o=overlay();o.innerHTML=`<div class="ad-box ad-success" role="status"><div class="ad-success-icon">✓</div><h2>บัญชีและข้อมูลของคุณถูกลบแล้ว</h2><p>Your account and associated data have been deleted.</p><button id="ad-return">กลับสู่หน้าเข้าสู่ระบบ · Return to sign in</button></div>`;
    const go=()=>{try{firebase.auth().signOut().catch(()=>{});}catch(e){}location.reload();};els(o,'#ad-return').addEventListener('click',go);setTimeout(go,5000);
  }

  window.accountDeletionOpen=showWarning;
  window.accountDeletionHandleRedirectResult=function(result,error){
    let pending=null;try{pending=JSON.parse(sessionStorage.getItem(REDIRECT_KEY)||'null');}catch(e){}
    if(!pending)return;
    sessionStorage.removeItem(REDIRECT_KEY);
    if(!error&&result&&result.user&&result.user.uid===pending.uid){markVerified(pending.uid);setTimeout(showTyped,900);}
    else setTimeout(()=>{showTyped();showInlineError(accountError(error));},900);
  };
  window.AccountDeletion={open:showWarning,_test:{buildUpdates,otherFromPair}};
})();
