"use strict";
/* ============================================================
   🗄️ PET PANTRY — รอบ 1158
   ศูนย์กลาง mutation ของชั้น/stock/การซื้อหน้าร้าน 3D
   ============================================================ */
const PetPantry = (()=>{
  const page = {pantry:0, food:0, fashion:0};
  const cleanInt = n=>Math.max(0,Math.floor(Number(n)||0));
  function ensureState(target=state){
    if(!target.petPantry || typeof target.petPantry!=='object' || Array.isArray(target.petPantry))
      target.petPantry={shelfId:null,stock:{}};
    if(!target.petPantry.stock || typeof target.petPantry.stock!=='object' || Array.isArray(target.petPantry.stock))
      target.petPantry.stock={};
    return target.petPantry;
  }
  function shelf(target=state){ const p=ensureState(target); return PET_PANTRY_SHELVES.find(x=>x.id===p.shelfId)||null; }
  function capacity(target=state){ const s=shelf(target); return s?s.capacity:0; }
  function total(target=state){ return Object.values(ensureState(target).stock).reduce((a,n)=>a+cleanInt(n),0); }
  function stockId(foodOrId,type){
    const id=typeof foodOrId==='object'&&foodOrId?foodOrId.id:String(foodOrId||'');
    if(id==='favorite') return `fav_${type||((activePet&&activePet())?activePet().type:'dog')}`;
    return (typeof foodOrId==='object'&&foodOrId&&foodOrId.stockId)||id;
  }
  function qty(foodOrId,type,target=state){ return cleanInt(ensureState(target).stock[stockId(foodOrId,type)]); }
  function foodCatalog(){ return Array.from(PET_SHOP_FOODS); }
  function favoriteFor(type){ return PET_SHOP_FAVORITES.find(f=>f.petType===type)||null; }
  function foodById(id,type){ const sid=stockId(id,type); return PET_SHOP_FOODS.find(f=>f.stockId===sid)||null; }
  function catalogForPet(type){ const fav=favoriteFor(type); return [fav,...FOODS].filter(Boolean); }
  function shelfValue(target=state){ const s=shelf(target); return s?s.price:0; }
  function stockValue(target=state){ return foodCatalog().reduce((sum,f)=>sum+qty(f,null,target)*cleanInt(f.price),0); }
  function done(){ saveState(); if(typeof syncHeader==='function')syncHeader(); if(typeof renderDashboard==='function')renderDashboard(); }
  function buyShelf(id,target=state){
    const next=PET_PANTRY_SHELVES.find(x=>x.id===id), cur=shelf(target);
    if(!next)return {ok:false,code:'invalid-shelf'};
    if(cur&&next.capacity<cur.capacity)return {ok:false,code:'downgrade'};
    if(cur&&next.id===cur.id)return {ok:false,code:'owned'};
    const cost=Math.max(0,next.price-(cur?cur.price:0));
    if(cleanInt(target.coins)<cost)return {ok:false,code:'coins',cost};
    target.coins-=cost; ensureState(target).shelfId=next.id;
    if(target===state){ if(typeof sfx!=='undefined'&&sfx.buy)sfx.buy(); done(); }
    return {ok:true,code:'purchased',cost,shelf:next};
  }
  function buyFood(id,amount=1,type,target=state){
    amount=cleanInt(amount); const f=foodById(id,type), p=ensureState(target);
    if(!shelf(target))return {ok:false,code:'no-shelf'};
    if(!f)return {ok:false,code:'invalid-food'};
    if(amount<1)return {ok:false,code:'amount'};
    if(total(target)+amount>capacity(target))return {ok:false,code:'capacity',room:capacity(target)-total(target)};
    const cost=cleanInt(f.price)*amount;
    if(cleanInt(target.coins)<cost)return {ok:false,code:'coins',cost};
    target.coins-=cost; p.stock[f.stockId]=qty(f,null,target)+amount;
    if(target===state){ if(typeof sfx!=='undefined'&&sfx.buy)sfx.buy(); done(); }
    return {ok:true,code:'purchased',cost,food:f,amount};
  }
  function take(id,amount=1,type,target=state){
    amount=cleanInt(amount); const sid=stockId(id,type),p=ensureState(target),have=qty(sid,null,target);
    if(amount<1||have<amount)return false;
    const left=have-amount; if(left)p.stock[sid]=left; else delete p.stock[sid];
    if(target===state)saveState(); return true;
  }
  function overlay(kind,title,body,onClose){
    const old=document.querySelector('.petpantry-overlay'); if(old)old.remove();
    const ov=document.createElement('div'); ov.className=`petpantry-overlay pp-${kind}`;
    ov.innerHTML=`<section class="petpantry-box qbp"><header><div><small>PAWS &amp; PANTRY</small><h2>${title}</h2></div><div class="pp-wallet">🪙 ${fmtNum(state.coins)}</div><button class="pp-close" aria-label="ปิด">×</button></header><main>${body}</main></section>`;
    const close=()=>{ov.remove();if(typeof onClose==='function')onClose();};
    ov.querySelector('.pp-close').addEventListener('click',close); ov.addEventListener('click',e=>{if(e.target===ov)close();});
    document.body.appendChild(ov); if(typeof fitQbp==='function')fitQbp(ov.querySelector('.qbp')); return ov;
  }
  function openPantry(options={}){
    const cur=shelf(), used=total(), cap=capacity();
    const shelves=PET_PANTRY_SHELVES.map(s=>{const owned=cur&&cur.id===s.id,locked=cur&&s.capacity<cur.capacity,cost=Math.max(0,s.price-(cur?cur.price:0));return `<article class="pp-shelf ${owned?'owned':''} ${locked?'locked':''}" data-shelf="${s.id}"><b>${s.emoji} ${s.name}</b><span>${s.capacity} ช่อง</span><small>${owned?'กำลังใช้':locked?'เล็กกว่าชั้นปัจจุบัน':`🪙${fmtNum(cost)}${cur?' (จ่ายส่วนต่าง)':''}`}</small></article>`}).join('');
    const rows=foodCatalog().filter(f=>qty(f)>0).map(f=>`<div class="pp-stock"><span>${f.emoji} ${escapeHTML(f.name)}</span><b>×${qty(f)}</b></div>`).join('')||'<div class="pp-empty">ชั้นยังว่างอยู่ — ขับรถไปเลือกอาหารมาตุนกันนะ 🚗</div>';
    const ov=overlay('pantry','🗄️ ชั้นเก็บอาหาร',`<div class="pp-meter"><b>${cur?escapeHTML(cur.name):'ยังไม่มีชั้น'}</b><span>${used}/${cap||0} ช่อง</span><i><em style="width:${cap?used/cap*100:0}%"></em></i></div><div class="pp-shelves">${shelves}</div><div class="pp-stock-grid">${rows}</div><button class="pp-trip">🚗 ออกไปซื้ออาหารตุนไว้ให้น้อง</button>`,options.onClose);
    ov.querySelectorAll('[data-shelf]').forEach(el=>el.addEventListener('click',()=>{const r=buyShelf(el.dataset.shelf);if(r.ok){toast(`🗄️ ได้${r.shelf.name}แล้ว — ชั้นใหม่ยังว่างนะ`);openPantry(options);}else if(r.code==='coins')toast(`🪙 ต้องมี ${fmtNum(r.cost)} เหรียญ`);else if(r.code==='downgrade')toast('ชั้นนี้เล็กกว่าชั้นที่ใช้อยู่ จึงเปลี่ยนไม่ได้');}));
    ov.querySelector('.pp-trip').addEventListener('click',()=>{ov.remove();enterPetShopping3D('food');});
  }
  function openStore(kind,options={}){
    kind=kind==='fashion'?'fashion':'food'; const isFood=kind==='food';
    const list=isFood?catalogForPet((activePet&&activePet())?activePet().type:'dog'):ITEMS;
    page[kind]=Math.min(page[kind],Math.max(0,Math.ceil(list.length/4)-1)); const pages=Math.max(1,Math.ceil(list.length/4)), slice=list.slice(page[kind]*4,page[kind]*4+4);
    const cards=slice.map(x=>{const owned=!isFood&&state.owned.includes(x.id);const amount=isFood?qty(x):0;return `<article class="pp-product ${owned?'owned':''}" data-id="${x.id}">${x.img?`<img src="${x.img}" alt="">`:`<span class="pp-prod-emoji">${x.emoji}</span>`}<b>${escapeHTML(x.name)}</b><small>${owned?'ซื้อแล้ว':`🪙${fmtNum(x.price)}`}${isFood?` · บนชั้น ×${amount}`:''}</small>${owned?'<button disabled>อยู่ในตู้แล้ว</button>':isFood?'<div><button data-n="1">+1</button><button data-n="5">+5</button></div>':'<button data-buy="1">ซื้อเข้าตู้</button>'}</article>`}).join('');
    const ov=overlay(kind,isFood?'🥫 Paws & Pantry Market':'🎀 Maison de Paws',`<div class="pp-store-scene" style="background-image:url('${isFood?'img/pet-shopping/food_window.webp':'img/pet-shopping/fashion_window.webp'}')"><span>${isFood?'อาหารสดใหม่สำหรับเพื่อนตัวน้อย':'แฟชั่นน่ารักที่ลองใส่ได้หลังกลับบ้าน'}</span></div><div class="pp-products">${cards}</div><nav><button class="pp-prev">‹</button><b>${page[kind]+1}/${pages}</b><button class="pp-next">›</button></nav>`,options.onClose);
    ov.querySelectorAll('.pp-product button:not([disabled])').forEach(btn=>btn.addEventListener('click',()=>{const id=btn.closest('.pp-product').dataset.id;let r;if(isFood)r=buyFood(id,btn.dataset.n);else{const item=ITEMS.find(i=>i.id===id);if(!item)r={ok:false,code:'invalid'};else if(state.coins<item.price)r={ok:false,code:'coins',cost:item.price};else{state.coins-=item.price;state.owned.push(item.id);if(typeof sellInc==='function')sellInc('item_'+item.id);if(typeof sfx!=='undefined'&&sfx.buy)sfx.buy();done();r={ok:true,item};}}if(r.ok){toast(isFood?`🥫 เติมอาหาร ${r.amount} ชิ้นแล้ว`:`🎀 ซื้อ${r.item.name}เข้าตู้แล้ว`);openStore(kind,options);}else if(r.code==='capacity')toast(`🗄️ ชั้นเหลือเพียง ${r.room} ช่อง`);else if(r.code==='coins')toast(`🪙 เหรียญไม่พอ ต้องมี ${fmtNum(r.cost)} เหรียญ`);else toast('ซื้อไม่ได้ในตอนนี้');}));
    ov.querySelector('.pp-prev').addEventListener('click',()=>{page[kind]=(page[kind]-1+pages)%pages;openStore(kind,options);}); ov.querySelector('.pp-next').addEventListener('click',()=>{page[kind]=(page[kind]+1)%pages;openStore(kind,options);});
  }
  return {ensureState,capacity,total,qty,shelfValue,stockValue,buyShelf,buyFood,take,foodById,foodCatalog,favoriteFor,stockId,catalogForPet,openPantry,openStore};
})();
window.PetPantry=PetPantry;
