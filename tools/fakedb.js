/* ============================================================
   🧪 tools/fakedb.js — Firebase RTDB จำลองในหน่วยความจำ (สำหรับเทสต์ preview เท่านั้น)
   ทำไมต้องมี: ระบบหลายสนาม (js/netroom.js) ต้องพิสูจน์ที่ 200–500 คน ซึ่งเปิดบัญชีจริงทดสอบไม่ไหว
   รองรับเท่าที่ netroom/โลก 3D ใช้จริง: ref/child/set/update/remove/once/on/off/onDisconnect
                                        + orderByKey().limitToFirst()/limitToLast()
   วิธีใช้ (ใน console ของ preview):
     await FakeDB.install();            // แทน Online.db + firebase.database.ServerValue
     FakeDB.seed('winfo/adv/r0', {...}) // ยัดข้อมูลตั้งต้น
     FakeDB.stats()                     // {writes, reads, bytes} — ใช้วัดทราฟฟิกจริง
   ============================================================ */
(function(){
'use strict';

const TS = '__SERVER_TS__';
let tree = {};
let subs = [];                       // {path, evt, cb, q}
let stat = {writes:0, reads:0, bytesUp:0, bytesDown:0, msgs:0};

function parts(p){ return String(p).split('/').filter(Boolean); }
function getIn(path){
  let n=tree;
  for(const k of parts(path)){ if(n===null||typeof n!=='object') return undefined; n=n[k]; }
  return n;
}
function setIn(path, val){
  const ks=parts(path);
  if(!ks.length){ tree = val; return; }
  let n=tree;
  for(let i=0;i<ks.length-1;i++){
    if(n[ks[i]]===undefined || n[ks[i]]===null || typeof n[ks[i]]!=='object') n[ks[i]]={};
    n=n[ks[i]];
  }
  const last=ks[ks.length-1];
  if(val===undefined || val===null) delete n[last];
  else n[last]=val;
}
function resolveTs(v){
  if(v===TS) return Date.now();
  if(v && typeof v==='object'){
    const o=Array.isArray(v)?[]:{};
    for(const k in v) o[k]=resolveTs(v[k]);
    return o;
  }
  return v;
}
function clone(v){ return (v===undefined||v===null)?v:JSON.parse(JSON.stringify(v)); }
function bytes(v){ try{ return JSON.stringify(v||{}).length; }catch(e){ return 0; } }

function snapOf(key, val){
  return {
    key:key, val:function(){ return clone(val); },
    exists:function(){ return val!==undefined && val!==null; },
    forEach:function(f){ const v=val||{}; for(const k in v) f(snapOf(k, v[k])); },
  };
}

/* ตัวกรองของ query (orderByKey + limit) */
function keysOf(obj, q){
  let ks=Object.keys(obj||{}).sort();
  if(q && q.limitFirst) ks=ks.slice(0, q.limitFirst);
  if(q && q.limitLast)  ks=ks.slice(-q.limitLast);
  return ks;
}
function inWindow(parentPath, key, q){
  if(!q) return true;
  return keysOf(getIn(parentPath), q).indexOf(key)>=0;
}

/* แจ้ง listener ทุกตัวที่สนใจการเปลี่ยนแปลงที่ path นี้ */
function fire(path, before, after){
  const ks=parts(path);
  const parent=ks.slice(0,-1).join('/'), key=ks[ks.length-1];
  subs.forEach(function(s){
    if(s.evt==='value' && s.path===path){
      stat.msgs++; stat.bytesDown+=bytes(after); s.cb(snapOf(key, after));
    }
    if(s.path!==parent) return;
    if(!inWindow(parent, key, s.q)) return;
    const had = before!==undefined && before!==null;
    const has = after !==undefined && after !==null;
    if(!had && has && s.evt==='child_added'){ stat.msgs++; stat.bytesDown+=bytes(after); s.cb(snapOf(key, after)); }
    else if(had && has && s.evt==='child_changed' && JSON.stringify(before)!==JSON.stringify(after)){
      stat.msgs++; stat.bytesDown+=bytes(after); s.cb(snapOf(key, after));
    }
    else if(had && !has && s.evt==='child_removed'){ stat.msgs++; s.cb(snapOf(key, before)); }
  });
  /* value listener ของ "โหนดแม่" ก็ต้องได้ยินด้วย */
  subs.forEach(function(s){
    if(s.evt==='value' && s.path===parent){ stat.msgs++; s.cb(snapOf(parts(parent).pop()||'', getIn(parent))); }
  });
}

function makeRef(path, q){
  const R = {
    _path:path, key:parts(path).pop()||null,
    child:function(k){ return makeRef(path+'/'+k); },
    toString:function(){ return 'fake://'+path; },
    orderByKey:function(){ return makeRef(path, Object.assign({}, q||{}, {ordered:true})); },
    limitToFirst:function(n){ return makeRef(path, Object.assign({}, q||{}, {limitFirst:n})); },
    limitToLast:function(n){ return makeRef(path, Object.assign({}, q||{}, {limitLast:n})); },
    set:function(v){
      const before=clone(getIn(path));
      const nv=resolveTs(v);
      stat.writes++; stat.bytesUp+=bytes(nv);
      setIn(path, nv);
      fire(path, before, clone(getIn(path)));
      return Promise.resolve();
    },
    update:function(v){
      const before=clone(getIn(path));
      const cur=clone(getIn(path))||{};
      const nv=resolveTs(v);
      for(const k in nv) cur[k]=nv[k];
      stat.writes++; stat.bytesUp+=bytes(nv);
      setIn(path, cur);
      fire(path, before, clone(getIn(path)));
      return Promise.resolve();
    },
    remove:function(){
      const before=clone(getIn(path));
      if(before===undefined) return Promise.resolve();
      stat.writes++;
      setIn(path, undefined);
      fire(path, before, undefined);
      return Promise.resolve();
    },
    /* push() ของจริงคืน ref ที่ "then/catch ได้ด้วย" (thenable) — โค้ดเกมเรียก .push(v).catch(...) อยู่ */
    push:function(v){
      const id='-fk'+(Date.now().toString(36))+Math.random().toString(36).slice(2,8);
      const c=makeRef(path+'/'+id);
      const pr=(v!==undefined)?c.set(v):Promise.resolve();
      c.then=function(f,g){ return pr.then(f?()=>f(c):undefined,g); };
      c.catch=function(g){ return pr.catch(g); };
      return c;
    },
    once:function(evt){
      stat.reads++;
      const v=clone(getIn(path));
      stat.bytesDown+=bytes(v);
      return Promise.resolve(snapOf(R.key, v));
    },
    get:function(){ return R.once('value'); },
    on:function(evt, cb){
      subs.push({path:path, evt:evt, cb:cb, q:q});
      if(evt==='value'){ stat.reads++; cb(snapOf(R.key, clone(getIn(path)))); }
      else if(evt==='child_added'){
        const v=getIn(path)||{};
        stat.reads++;
        keysOf(v, q).forEach(function(k){ stat.bytesDown+=bytes(v[k]); cb(snapOf(k, clone(v[k]))); });
      }
      return cb;
    },
    off:function(evt, cb){
      subs=subs.filter(function(s){
        if(s.path!==path) return true;
        if(evt && s.evt!==evt) return true;
        if(cb && s.cb!==cb) return true;
        if(q && s.q!==q) return true;
        return false;
      });
    },
    onDisconnect:function(){
      return { remove:function(){ return Promise.resolve(); },
               cancel:function(){ return Promise.resolve(); },
               set:function(){ return Promise.resolve(); } };
    },
  };
  return R;
}

window.FakeDB = {
  TS:TS,
  db:{ ref:function(p){ return makeRef(String(p||'').replace(/^\/+/,'')); } },
  install:function(){
    if(typeof Online==='undefined') window.Online={};
    Online.db = window.FakeDB.db; Online.ready = true;
    if(typeof firebase==='undefined') window.firebase={};
    firebase.database = firebase.database || {};
    firebase.database.ServerValue = { TIMESTAMP: TS };
    return Promise.resolve(true);
  },
  reset:function(){ tree={}; subs=[]; window.FakeDB.zero(); },
  zero:function(){ stat={writes:0, reads:0, bytesUp:0, bytesDown:0, msgs:0}; },
  seed:function(path, val){ setIn(path, resolveTs(val)); },
  get:function(path){ return clone(getIn(path)); },
  tree:function(){ return clone(tree); },
  subs:function(){ return subs.length; },
  stats:function(){ return Object.assign({}, stat); },
};
})();
