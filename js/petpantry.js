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
  /* หักหลาย SKU แบบ atomic: เช็กยอดรวมครบก่อน จึงไม่มีกรณีสัตว์ชุดแรกได้กินแต่ชุดท้ายอดเพราะ stock หมดกลางทาง */
  function takeMany(entries,target=state){
    const need={};
    for(const entry of Array.isArray(entries)?entries:[]){
      const item=entry&&entry.food!==undefined?entry.food:entry;
      const amount=cleanInt(entry&&entry.amount!==undefined?entry.amount:1);
      const sid=stockId(item,entry&&entry.type);
      if(!sid||amount<1)return false;
      need[sid]=(need[sid]||0)+amount;
    }
    const ids=Object.keys(need); if(!ids.length)return false;
    if(ids.some(sid=>qty(sid,null,target)<need[sid]))return false;
    const p=ensureState(target);
    ids.forEach(sid=>{const left=qty(sid,null,target)-need[sid];if(left)p.stock[sid]=left;else delete p.stock[sid];});
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
ov.querySelectorAll('[data-shelf]').forEach(el=>el.addEventListener('click',()=>{const r=buyShelf(el.dataset.shelf);if(r.ok){toast(`🗄️ ได้${r.shelf.name}แล้ว — ชั้นใหม่ยังว่างนะ`,0);openPantry(options);}else if(r.code==='coins')toast(`🪙 ต้องมี ${fmtNum(r.cost)} เหรียญ`);else if(r.code==='downgrade')toast('ชั้นนี้เล็กกว่าชั้นที่ใช้อยู่ จึงเปลี่ยนไม่ได้');}));
    ov.querySelector('.pp-trip').addEventListener('click',()=>{ov.remove();enterPetShopping3D('food');});
  }
  /* ============================================================
     ⚔️🎀 ร้านแฟชั่นแบบลองใส่ — รอบ 1292
     ภาพชุดนักรบ knownWear โหลดเฉพาะใบที่เห็น/ลอง ไม่ probe 180 ใบตอนบูต
     ============================================================ */
  function fashionPetImage(item){
    const p=(typeof activePet==='function')?activePet():null;
    if(!p||!item||petStage(p)==='egg')return null;
    if(typeof petWearImage==='function')return petWearImage(p,item);
    return IMG_FILES[`${p.type}_${petStage(p)}_${item.id}`]||null;
  }
  function wearFashionItem(item){
    const p=(typeof activePet==='function')?activePet():null;
    if(!p||!item||petStage(p)==='egg')return false;
    p.equipped={};p.equipped[item.slot]=item.id;state.psDress=true;
    saveState();if(typeof renderDashboard==='function')renderDashboard();return true;
  }
  function buyFashionItem(item){
    if(!item)return {ok:false,code:'invalid'};
    if(state.owned.includes(item.id))return {ok:false,code:'owned'};
    if(cleanInt(state.coins)<item.price)return {ok:false,code:'coins',cost:item.price};
    state.coins-=item.price;state.owned.push(item.id);
    const p=(typeof activePet==='function')?activePet():null;
    const equipped=!!(p&&petStage(p)!=='egg');
    if(equipped){p.equipped={};p.equipped[item.slot]=item.id;state.psDress=true;}
    if(typeof sellInc==='function')sellInc('item_'+item.id);
    if(typeof sfx!=='undefined'&&sfx.buy)sfx.buy();done();
    return {ok:true,item,equipped};
  }
  function bindFashionStrip(strip){
    if(!strip||strip.dataset.dragBound)return;strip.dataset.dragBound='1';
    let down=false,startX=0,startLeft=0,moved=false,suppress=false;
    strip.addEventListener('pointerdown',e=>{
      if(e.button!==undefined&&e.button!==0)return;
      if(e.target.closest('button'))return;
      down=true;moved=false;startX=e.clientX;startLeft=strip.scrollLeft;
      strip.classList.add('dragging');try{strip.setPointerCapture(e.pointerId);}catch(err){}
    });
    strip.addEventListener('pointermove',e=>{
      if(!down)return;const dx=e.clientX-startX;if(Math.abs(dx)>5)moved=true;
      if(moved){e.preventDefault();strip.scrollLeft=startLeft-dx;}
    });
    const end=()=>{if(!down)return;down=false;strip.classList.remove('dragging');if(moved){suppress=true;setTimeout(()=>{suppress=false;},0);}};
    strip.addEventListener('pointerup',end);strip.addEventListener('pointercancel',end);
    strip.addEventListener('click',e=>{if(suppress){e.preventDefault();e.stopPropagation();}},true);
  }
  function fashionPinDialog(item,options={}){
    const p=(typeof activePet==='function')?activePet():null;
    const src=fashionPetImage(item)||item.img||'';
    const code=Math.floor(Math.random()*1000000).toString().padStart(6,'0');
    const ov=document.createElement('div');ov.className='levelup-overlay mkt-buy-overlay pp-fashion-pin-overlay';
    let input='',processing=false;
    ov.innerHTML=`<div class="levelup-box mkt-buy-box">
      <div class="pp-pin-info"><h2>ยืนยันการซื้อ</h2><div class="mkt-buy-item">
        <div class="mkt-buy-pic">${src?`<img class="mkt-buy-pic-img" src="${src}" alt="${escapeHTML(item.name)}">`:`<span class="mkt-buy-pic-emoji">${item.emoji}</span>`}</div>
        <div class="mkt-buy-meta"><div class="mkt-buy-name">${escapeHTML(item.name)}</div><div class="mkt-buy-seller">ลองใส่กับ ${escapeHTML(p&&p.name||'น้อง')}</div><div class="mkt-buy-price">ราคา: 🪙${fmtNum(item.price)}</div><div class="mkt-buy-balance">เหรียญปัจจุบัน: 🪙${fmtNum(state.coins)}</div></div>
      </div></div><div class="pp-pin-entry">
        <div class="mkt-confirm-code-title">รหัสยืนยัน:</div><div class="mkt-code-target">${code}</div>
        <div class="mkt-pin-note">กรุณากดตัวเลขด้านล่างให้ตรงกับรหัสด้านบน</div>
        <div class="mkt-code-input"></div><div class="mkt-code-error"></div>
        <div class="mkt-pin-grid">
          <button class="mkt-pin-btn" data-d="1">1</button><button class="mkt-pin-btn" data-d="2">2</button><button class="mkt-pin-btn" data-d="3">3</button>
          <button class="mkt-pin-btn" data-d="4">4</button><button class="mkt-pin-btn" data-d="5">5</button><button class="mkt-pin-btn" data-d="6">6</button>
          <button class="mkt-pin-btn" data-d="7">7</button><button class="mkt-pin-btn" data-d="8">8</button><button class="mkt-pin-btn" data-d="9">9</button>
          <button class="mkt-pin-btn" data-d="0">0</button><button class="mkt-pin-btn mkt-pin-del" data-act="del">⌫ ลบ</button><button class="mkt-pin-btn mkt-pin-clear" data-act="clear">ล้าง</button>
        </div><div class="mkt-buy-actions"><button class="cf-no mkt-buy-cancel">ยกเลิก</button><button class="cf-ok mkt-buy-confirm" disabled>ยืนยันการซื้อ</button></div>
      </div></div>`;
    const inputEl=ov.querySelector('.mkt-code-input'),errEl=ov.querySelector('.mkt-code-error'),confirm=ov.querySelector('.mkt-buy-confirm');
    const refresh=()=>{
      const full=input.length===6;confirm.disabled=!full||input!==code;
      errEl.textContent=full&&input!==code?'รหัสไม่ถูกต้อง กรุณาลองใหม่':'';
      inputEl.textContent=(input+'_'.repeat(Math.max(0,6-input.length))).split('').join(' ');
    };
    ov.querySelectorAll('.mkt-pin-btn').forEach(btn=>btn.addEventListener('click',()=>{
      if(processing)return;
      if(btn.dataset.d&&input.length<6)input+=btn.dataset.d;
      else if(btn.dataset.act==='del')input=input.slice(0,-1);
      else if(btn.dataset.act==='clear')input='';
      if(typeof sfx!=='undefined'&&sfx.select)sfx.select();refresh();
    }));
    ov.querySelector('.mkt-buy-cancel').addEventListener('click',()=>ov.remove());
    confirm.addEventListener('click',()=>{
      if(processing||input!==code)return;processing=true;confirm.disabled=true;
      const r=buyFashionItem(item);
      if(!r.ok){processing=false;errEl.textContent=r.code==='coins'?`เหรียญไม่พอ ต้องมี ${fmtNum(r.cost)} เหรียญ`:'ซื้อไม่ได้ในตอนนี้';return;}
      ov.remove();toast(r.equipped?`⚔️ ซื้อ${item.name}สำเร็จ — ใส่ให้น้องแล้ว!`:`⚔️ ซื้อ${item.name}เข้าตู้แล้ว — น้องโตเมื่อไรค่อยใส่นะ`,2600);
      if(typeof options.onSuccess==='function')options.onSuccess();
    });
    document.body.appendChild(ov);refresh();
  }
  function openFashionTry(item,options={}){
    const old=document.querySelector('.pp-try-overlay');if(old)old.remove();
    const p=(typeof activePet==='function')?activePet():null,stage=p?petStage(p):'egg';
    const src=fashionPetImage(item),owned=state.owned.includes(item.id);
    const ov=document.createElement('div');ov.className='pp-try-overlay';
    ov.innerHTML=`<section class="pp-try-card">
      <div class="pp-try-visual">${src?`<img src="${src}" alt="${escapeHTML(p.name)} ลองใส่ ${escapeHTML(item.name)}">`:(item.img?`<img src="${item.img}" alt="${escapeHTML(item.name)}">`:`<span>${item.emoji}</span>`)}</div>
      <div class="pp-try-copy"><small>ลองใส่ก่อนซื้อ</small><h2>${item.emoji} ${escapeHTML(item.name)}</h2>
        <p>${stage==='egg'?'น้องยังเป็นไข่ จึงแสดงภาพชุดตัวอย่างไว้ก่อน โตแล้วจะใส่ได้ทันที':`ตัวอย่าง ${escapeHTML(p.name)} ใส่ชุดนี้จริง`}</p>
        <div class="pp-try-price">🪙 ${fmtNum(item.price)} ${owned?'· มีในตู้แล้ว':''}</div>
        <div class="pp-try-actions"><button class="pp-try-back">กลับไปเลือก</button>${owned?`<button class="pp-try-confirm" ${stage==='egg'?'disabled':''}>✓ ใส่ชุดนี้</button>`:`<button class="pp-try-confirm">ยืนยันการซื้อ</button>`}</div>
      </div></section>`;
    ov.querySelector('.pp-try-back').addEventListener('click',()=>ov.remove());
    const go=ov.querySelector('.pp-try-confirm');if(go)go.addEventListener('click',()=>{
      if(owned){if(wearFashionItem(item)){ov.remove();toast(`✨ ใส่${item.name}ให้น้องแล้ว`);}return;}
      fashionPinDialog(item,{onSuccess:()=>{ov.remove();openFashionStore(options);}});
    });
    document.body.appendChild(ov);
  }
  function openFashionStore(options={}){
    const warriors=ITEMS.filter(x=>x.knownWear),others=ITEMS.filter(x=>!x.knownWear),list=warriors.concat(others);
    const p=(typeof activePet==='function')?activePet():null;
    const cards=list.map(x=>{
      const owned=state.owned.includes(x.id),equipped=p&&Object.values(p.equipped||{}).includes(x.id);
      const art=x.img?`<img src="${x.img}" alt="${escapeHTML(x.name)}" loading="lazy" decoding="async">`:`<span>${x.emoji}</span>`;
      return `<article class="pp-fashion-card ${owned?'owned':''} ${equipped?'equipped':''}" data-id="${x.id}">
        <div class="pp-fashion-top"><span>${x.knownWear?'⚔️ ชุดนักรบ':'🎀 แฟชั่น'}</span><em>${equipped?'ใส่อยู่':owned?'มีแล้ว':'ใหม่'}</em></div>
        <div class="pp-fashion-art">${art}</div><b>${escapeHTML(x.name)}</b><small>🪙${fmtNum(x.price)}</small>
        <button data-try="1">ลองใส่</button></article>`;
    }).join('');
    const title=options.closet?'🎀 ตู้เสื้อผ้าของน้อง':'🎀 Maison de Paws';
    const ov=overlay('fashion',title,`<div class="pp-fashion-note"><b>⚔️ ชุดนักรบใหม่ 10 แบบ</b><span>ลากสินค้าไปทางซ้าย–ขวาเพื่อดูทั้งหมด</span></div>
      <div class="pp-fashion-rail"><button class="pp-fashion-arrow pp-fa-prev" aria-label="เลื่อนซ้าย">❮</button><div class="pp-fashion-strip">${cards}</div><button class="pp-fashion-arrow pp-fa-next" aria-label="เลื่อนขวา">❯</button></div>`,options.onClose);
    ov.classList.add('pp-fashion-overlay');const strip=ov.querySelector('.pp-fashion-strip');bindFashionStrip(strip);
    ov.querySelector('.pp-fa-prev').addEventListener('click',()=>strip.scrollBy({left:-strip.clientWidth*.78,behavior:'smooth'}));
    ov.querySelector('.pp-fa-next').addEventListener('click',()=>strip.scrollBy({left:strip.clientWidth*.78,behavior:'smooth'}));
    ov.querySelectorAll('[data-try]').forEach(btn=>btn.addEventListener('click',()=>openFashionTry(ITEMS.find(x=>x.id===btn.closest('[data-id]').dataset.id),options)));
  }
  function openStore(kind,options={}){
    kind=kind==='fashion'?'fashion':'food'; const isFood=kind==='food';
    if(!isFood)return openFashionStore(options);
    const list=catalogForPet((activePet&&activePet())?activePet().type:'dog');
    page[kind]=Math.min(page[kind],Math.max(0,Math.ceil(list.length/4)-1)); const pages=Math.max(1,Math.ceil(list.length/4)), slice=list.slice(page[kind]*4,page[kind]*4+4);
    const cards=slice.map(x=>{const owned=!isFood&&state.owned.includes(x.id),amount=isFood?qty(x):0;const art=isFood&&typeof foodSpriteHTML==='function'?foodSpriteHTML(x,'pp-prod-art'):(x.img?`<img src="${x.img}" alt="">`:`<span class="pp-prod-emoji">${x.emoji}</span>`);return `<article class="pp-product ${owned?'owned':''}" data-id="${x.id}">${art}<b>${escapeHTML(x.name)}</b><small>${owned?'ซื้อแล้ว':`🪙${fmtNum(x.price)}`}${isFood?` · บนชั้น ×${amount}`:''}</small>${owned?'<button disabled>อยู่ในตู้แล้ว</button>':isFood?'<div><button data-n="1">+1</button><button data-n="5">+5</button></div>':'<button data-buy="1">ซื้อเข้าตู้</button>'}</article>`}).join('');
    const ov=overlay(kind,isFood?'🥫 Paws & Pantry Market':'🎀 Maison de Paws',`<div class="pp-store-scene" style="background-image:url('${isFood?'img/pet-shopping/food_window.webp':'img/pet-shopping/fashion_window.webp'}')"><span>${isFood?'อาหารสดใหม่สำหรับเพื่อนตัวน้อย':'แฟชั่นน่ารักที่ลองใส่ได้หลังกลับบ้าน'}</span></div><div class="pp-products">${cards}</div><nav><button class="pp-prev">‹</button><b>${page[kind]+1}/${pages}</b><button class="pp-next">›</button></nav>`,options.onClose);
    ov.querySelectorAll('.pp-product button:not([disabled])').forEach(btn=>btn.addEventListener('click',()=>{const id=btn.closest('.pp-product').dataset.id;let r;if(isFood)r=buyFood(id,btn.dataset.n);else{const item=ITEMS.find(i=>i.id===id);if(!item)r={ok:false,code:'invalid'};else if(state.coins<item.price)r={ok:false,code:'coins',cost:item.price};else{state.coins-=item.price;state.owned.push(item.id);if(typeof sellInc==='function')sellInc('item_'+item.id);if(typeof sfx!=='undefined'&&sfx.buy)sfx.buy();done();r={ok:true,item};}}if(r.ok){toast(isFood?`🥫 เติมอาหาร ${r.amount} ชิ้นแล้ว`:`🎀 ซื้อ${r.item.name}เข้าตู้แล้ว`);openStore(kind,options);}else if(r.code==='capacity')toast(`🗄️ ชั้นเหลือเพียง ${r.room} ช่อง`);else if(r.code==='coins')toast(`🪙 เหรียญไม่พอ ต้องมี ${fmtNum(r.cost)} เหรียญ`);else toast('ซื้อไม่ได้ในตอนนี้');}));
    ov.querySelector('.pp-prev').addEventListener('click',()=>{page[kind]=(page[kind]-1+pages)%pages;openStore(kind,options);}); ov.querySelector('.pp-next').addEventListener('click',()=>{page[kind]=(page[kind]+1)%pages;openStore(kind,options);});
  }
  return {ensureState,capacity,total,qty,shelfValue,stockValue,buyShelf,buyFood,take,takeMany,foodById,foodCatalog,favoriteFor,stockId,catalogForPet,openPantry,openStore};
})();
window.PetPantry=PetPantry;
