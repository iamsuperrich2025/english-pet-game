/* 🏁 F1 Racing Mode Select — local graphics preference + environment profile contract (Phase 1)
   UI/preference live here; physics, gameplay, rewards and multiplayer remain owned by js/f1_3d.js.
   Both profiles mutate one shared F1 scene. A second renderer/scene is never created for mode switching. */
(function(root){
'use strict';

const STORAGE_KEY='vwF1GraphicsMode';
const DEFAULT_MODE='battery';
const CONTRACT='vw.f1.environment-profile/v1';

function freezeProfile(value){
  if(!value||typeof value!=='object'||Object.isFrozen(value)) return value;
  Object.keys(value).forEach(k=>freezeProfile(value[k]));
  return Object.freeze(value);
}

const PROFILES=freezeProfile({
  battery:{
    contract:CONTRACT, id:'battery', revision:1,
    ownership:{scene:'F1World',renderer:'F1World',instancePolicy:'single',switchPolicy:'mutate-shared-scene'},
    shared:{physics:'f1-shared-v1',gameplay:'f1-shared-v1',multiplayer:'netroom-f1-v1'},
    renderer:{antialias:true,pixelRatioCap:2,powerPreference:'default',toneMapping:'none',exposure:1},
    environment:{background:0x0d1430,fogColor:0x0d1430,fogNear:340,fogFar:1600,cameraFar:2100,
      hemisphere:0.72,keyLight:1.05,warmLight:0.35,assetSet:'f1-current'},
  },
  quality:{
    contract:CONTRACT, id:'quality', revision:1,
    ownership:{scene:'F1World',renderer:'F1World',instancePolicy:'single',switchPolicy:'mutate-shared-scene'},
    shared:{physics:'f1-shared-v1',gameplay:'f1-shared-v1',multiplayer:'netroom-f1-v1'},
    renderer:{antialias:true,pixelRatioCap:2.5,powerPreference:'high-performance',toneMapping:'aces',exposure:1.08},
    environment:{background:0x081226,fogColor:0x081226,fogNear:370,fogFar:1850,cameraFar:2350,
      hemisphere:0.82,keyLight:1.18,warmLight:0.42,assetSet:'f1-quality-phase1'},
  },
});

const MODES=freezeProfile({
  battery:{id:'battery',label:'Battery Saver',thai:'ประหยัดแบต',icon:'🔋',recommended:true,
    preview:'img/f1/mode_battery_saver.webp',summary:'ฉากแข่งเดิม · ลื่นและเสถียรบนทุกเครื่อง'},
  quality:{id:'quality',label:'High Graphics',thai:'ภาพสวย',icon:'✨',recommended:false,
    preview:'img/f1/mode_high_graphics.webp',summary:'แสงและระยะมองไกลขึ้น · ใช้พลังเครื่องมากกว่า'},
});

function normalize(mode){ return Object.prototype.hasOwnProperty.call(MODES,mode)?mode:DEFAULT_MODE; }
function readPreference(){
  try{ return normalize(root.localStorage&&root.localStorage.getItem(STORAGE_KEY)); }
  catch(e){ return DEFAULT_MODE; }
}
function writePreference(mode){
  mode=normalize(mode);
  try{ if(root.localStorage) root.localStorage.setItem(STORAGE_KEY,mode); }catch(e){}
  return mode;
}
function selection(mode){
  const id=normalize(mode==null?readPreference():mode);
  return {id,mode:MODES[id],environment:PROFILES[id]};
}

function removeSelector(){
  if(!root.document) return;
  const old=root.document.getElementById('f1-mode-select');
  if(old) old.remove();
}

function openSelector(options){
  options=options||{};
  if(!root.document){ if(typeof options.onContinue==='function') options.onContinue(selection()); return null; }
  removeSelector();
  let chosen=normalize(options.selected==null?readPreference():options.selected);
  const overlay=root.document.createElement('div');
  overlay.id='f1-mode-select';
  overlay.className='f1m-overlay';
  overlay.innerHTML=`<style>
    .f1m-overlay{position:fixed;inset:0;z-index:12020;background:rgba(4,8,18,.86);display:flex;align-items:center;justify-content:center;
      padding:10px;box-sizing:border-box;font-family:'Kanit','Segoe UI',sans-serif;color:#eef4ff}
    .f1m-box{width:min(680px,96vw);max-height:calc(100vh - 20px);overflow:hidden;box-sizing:border-box;background:#101a30;
      border:1px solid rgba(255,209,46,.45);border-radius:18px;padding:clamp(10px,2.4vh,16px);box-shadow:0 18px 55px rgba(0,0,0,.5)}
    .f1m-box h2{font-size:clamp(17px,4vh,23px);line-height:1.1;text-align:center;margin:0 0 3px;color:#ffd12e}
    .f1m-sub{text-align:center;font-size:clamp(10px,2.5vh,13px);color:#b9c8e5;margin:0 0 clamp(6px,1.8vh,10px)}
    .f1m-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}
    .f1m-card{appearance:none;text-align:left;color:inherit;background:#182542;border:2px solid transparent;border-radius:14px;padding:6px;
      min-width:0;font-family:inherit;cursor:pointer;position:relative}
    .f1m-card.sel{border-color:#ffd12e;background:#213354;box-shadow:0 0 0 2px rgba(255,209,46,.12)}
    .f1m-card img{display:block;width:100%;height:clamp(66px,20vh,126px);object-fit:cover;border-radius:9px;background:#070c16}
    .f1m-title{display:flex;align-items:center;gap:5px;font-size:clamp(12px,3vh,16px);font-weight:900;margin-top:4px;line-height:1.15}
    .f1m-title small{font-size:.72em;color:#aebddb;font-weight:700}
    .f1m-rec{margin-left:auto;background:#2ca85d;color:#fff;border-radius:99px;padding:2px 6px;font-size:clamp(8px,1.8vh,10px);white-space:nowrap}
    .f1m-desc{font-size:clamp(9px,2.1vh,11.5px);line-height:1.25;color:#c7d4ec;margin:3px 1px 1px}
    .f1m-actions{display:grid;grid-template-columns:1fr 1.8fr;gap:8px;margin-top:clamp(7px,2vh,11px)}
    .f1m-actions button{border:0;border-radius:11px;padding:clamp(7px,2vh,10px);font:800 clamp(12px,2.7vh,15px) inherit;cursor:pointer}
    .f1m-cancel{background:#33405a;color:#eef4ff}.f1m-go{background:#e10600;color:#fff}
    @media (max-width:540px){.f1m-overlay{padding:6px}.f1m-box{max-height:calc(100vh - 12px);padding:8px}.f1m-grid{gap:6px}.f1m-card{padding:4px}}
  </style>
  <div class="f1m-box" role="dialog" aria-modal="true" aria-labelledby="f1m-title">
    <h2 id="f1m-title">🏁 เลือกโหมดการแข่งขัน</h2>
    <p class="f1m-sub">เลือกกราฟิกก่อนดูค่าเข้า · เปลี่ยนใหม่ได้ทุกครั้ง</p>
    <div class="f1m-grid">${Object.keys(MODES).map(id=>{const m=MODES[id];return `<button type="button" class="f1m-card" data-mode="${id}" aria-pressed="false">
      <img src="${m.preview}" alt="ภาพตัวอย่าง ${m.label}" width="768" height="432" draggable="false">
      <span class="f1m-title">${m.icon} ${m.label} <small>${m.thai}</small>${m.recommended?'<span class="f1m-rec">แนะนำ</span>':''}</span>
      <span class="f1m-desc">${m.summary}</span></button>`;}).join('')}</div>
    <div class="f1m-actions"><button type="button" class="f1m-cancel">ยกเลิก</button><button type="button" class="f1m-go">ดูค่าเข้า →</button></div>
  </div>`;
  root.document.body.appendChild(overlay);
  const cards=Array.from(overlay.querySelectorAll('.f1m-card'));
  function render(){ cards.forEach(card=>{const on=card.dataset.mode===chosen;card.classList.toggle('sel',on);card.setAttribute('aria-pressed',on?'true':'false');}); }
  cards.forEach(card=>card.addEventListener('click',()=>{chosen=normalize(card.dataset.mode);render();}));
  overlay.querySelector('.f1m-cancel').addEventListener('click',removeSelector);
  overlay.querySelector('.f1m-go').addEventListener('click',()=>{
    const result=selection(writePreference(chosen));
    removeSelector();
    if(typeof options.onContinue==='function') options.onContinue(result);
  });
  overlay.addEventListener('click',e=>{if(e.target===overlay) removeSelector();});
  render();
  const current=cards.find(card=>card.dataset.mode===chosen); if(current) current.focus();
  return overlay;
}

root.F1Modes=Object.freeze({
  CONTRACT,STORAGE_KEY,DEFAULT_MODE,MODES,PROFILES,
  normalize,getSelectedMode:readPreference,setSelectedMode:writePreference,getSelection:selection,
  openSelector,closeSelector:removeSelector,
});
})(typeof window!=='undefined'?window:globalThis);
