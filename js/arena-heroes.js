"use strict";
/* Round 1381 — admin-only hero selection, eight generated full-body portraits, preload before entry. */
(function(){
 const rows=[
  ['fire','Zevrakin','อัศวินเปลวไฟ','ชาย','🔥','#ff8852',0xee6541,0x864821,['fire','meteor'],'เผาพื้นที่ต่อเนื่อง แล้วปิดท้ายด้วยฝนดาวตก'],
  ['wind','Kirevon','นักธนูสายลม','ชาย','🌪️','#7ee8c9',0x47ad94,0x488c87,['wind','arc'],'ดูดศัตรูรวมด้วยพายุ แล้วชิ่งสายฟ้าเป็นกลุ่ม'],
  ['ice','Vaelkorin','จอมเวทน้ำแข็ง','ชาย','❄️','#99d8ff',0x668cd0,0xc9e5ff,['ice','water'],'แช่แข็งให้ศัตรูเดินช้า แล้วผลักออกด้วยคลื่น'],
  ['light','Oryndel','ผู้พิทักษ์แสง','ชาย','✨','#ffe296',0xeac65e,0xefc764,['light','earth'],'ฟื้น HP และเสริมโล่ พร้อมกระแทกศัตรูให้ถอย'],
  ['earth','Elyzavia','ผู้พิทักษ์พสุธา','หญิง','🪨','#c6d08c',0x8d9b57,0x754528,['earth','nova'],'แผ่นดินไหวผลักศัตรู แล้วระเบิดโนวารอบตัว'],
  ['meteor','Lyravyn','นักเดินทางดาวตก','หญิง','☄️','#ffb194',0xdd8b8b,0xef9696,['meteor','fire'],'ดาวตกสามลูกโจมตีวงกว้าง พร้อมวงเพลิงเผาต่อเนื่อง'],
  ['gravity','Nirelya','จอมเวทแรงโน้มถ่วง','หญิง','🌌','#d4adff',0xa77bd8,0xbca5dd,['gravity','nova'],'หลุมดำดูดรวมก่อนระเบิด แล้วต่อด้วยโนวา'],
  ['water','Zirelia','นักดาบสายน้ำ','หญิง','🌊','#8cdeff',0x559ec5,0x528fa4,['water','wind'],'คลื่นยักษ์ผลักศัตรู และพายุควบคุมทางเดิน']
 ];
 const motions={
 fire:[[.52,.13,.31,.13],[.84,.48,.15,.16],[.12,.48,.02,.03],[.54,.27,.20,.095],[.16,.72,.14,.16]],
 wind:[[.48,.15,.30,.15],[.81,.39,.18,.13],[.21,.39,.08,.10],[.49,.29,.21,.10],[.80,.60,.12,.18]],
 ice:[[.51,.25,.29,.12],[.17,.55,.17,.14],[.84,.57,.14,.15],[.52,.32,.20,.10],[.87,.22,.09,.10]],
 light:[[.51,.14,.32,.14],[.18,.53,.17,.17],[.82,.54,.13,.12],[.51,.28,.21,.10],[.15,.30,.10,.09]],
 earth:[[.51,.17,.29,.16],[.23,.77,.12,.13],[.81,.77,.14,.13],[.53,.25,.21,.10],[.17,.61,.13,.13]],
 meteor:[[.52,.18,.31,.18],[.23,.63,.12,.16],[.82,.65,.14,.16],[.52,.28,.22,.10],[.14,.25,.08,.08]],
 gravity:[[.52,.17,.32,.17],[.18,.63,.14,.17],[.84,.67,.14,.15],[.50,.25,.21,.095],[.20,.265,.14,.09]],
 water:[[.35,.23,.23,.22],[.23,.52,.13,.12],[.87,.61,.13,.15],[.55,.24,.20,.095],[.18,.73,.14,.14]]
 };
 const roster=rows.map(([id,name,title,gender,icon,color,tint,hair,slots,desc])=>({id,name,title,gender,icon,color,tint,hair,slots,desc,image:'img/arena-heroes/'+id+'.webp',thumb:'img/arena-heroes/'+id+'-thumb.webp',motion:Object.fromEntries(['hair','capeA','capeB','face','magic'].map((key,i)=>[key,motions[id][i]]))}));
 const get=id=>roster.find(h=>h.id===id)||roster[0];let current=null;
 function choose(preload){
  if(typeof isAdmin!=='function'||!isAdmin())return Promise.resolve(null);
  if(current)return current.promise;
  let resolve;const promise=new Promise(r=>resolve=r),previous=document.activeElement;let selected=get(state.arenaHero),loaded=false,failed=false,done=false;
  const root=document.createElement('section');root.id='ah-picker';root.setAttribute('role','dialog');root.setAttribute('aria-modal','true');root.setAttribute('aria-labelledby','ah-heading');
  root.innerHTML=`<header class="ah-header"><button id="ah-back" aria-label="กลับไปหน้าหลัก">← กลับ</button><div><small>VOCAB ARENA · ADMIN</small><h1 id="ah-heading">เลือกเพื่อนร่วมผจญภัย</h1></div><button id="ah-motion" aria-pressed="true">✦ ภาพเคลื่อนไหว</button></header><div class="ah-layout"><div class="ah-stage"><div class="ah-orbit"></div><div class="ah-portrait"></div><div class="ah-stage-label"><span id="ah-tag"></span><strong id="ah-name"></strong></div></div><div class="ah-info"><div class="ah-roster" role="group" aria-label="ตัวละคร ชาย 4 หญิง 4">${roster.map(h=>`<button class="ah-card" data-hero="${h.id}" aria-pressed="false" aria-label="${h.name} ${h.title} ${h.gender}"><img src="${h.thumb}" alt="" width="160" height="240"><span>${h.name}</span><small>${h.gender}</small></button>`).join('')}</div><div class="ah-details" aria-live="polite"><div class="ah-detail-head"><h2 id="ah-title"></h2><span>HP พื้นฐาน 100</span></div><p id="ah-desc"></p><small class="ah-power-note">พลังประจำตัว · ADMIN ปลดล็อกทุกธาตุแล้ว</small><div id="ah-powers"></div><p class="ah-talent" id="ah-talent"></p></div><footer class="ah-footer"><div><span id="ah-ready" role="status">กำลังเตรียมสนาม…</span><small>ADMIN · เลือกใช้พลังทั้งหมดได้ฟรีในสนาม</small></div><button id="ah-play" disabled>เตรียมสนาม…</button></footer></div></div>`;
  document.body.append(root);const $=s=>root.querySelector(s);$('#ah-motion').remove();const portrait=ArenaPortrait.create($('.ah-portrait'));
  function paint(){root.style.setProperty('--hero-color',selected.color);$('#ah-tag').textContent=selected.gender+' · '+selected.title;$('#ah-name').textContent=selected.name;$('#ah-title').textContent=selected.icon+' '+selected.title;$('#ah-desc').textContent=selected.desc;$('#ah-talent').textContent='พรธาตุ: '+ArenaElements.byId[selected.id].name+' คูลดาวน์สั้นลง 20%';$('#ah-powers').innerHTML=selected.slots.map(id=>{const p=ArenaElements.byId[id],cd=p.cd*(id===selected.id ? .8 : 1);return `<div class="ah-power"><b>${p.icon}</b><div><strong>${p.name} <em>${Number(cd.toFixed(1))} วิ</em></strong><span>${p.desc}</span></div></div>`;}).join('');root.querySelectorAll('[data-hero]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.hero===selected.id)));portrait.load(selected);}
  portrait.setEnabled(true);paint();
  function finish(value){if(done)return;done=true;portrait.dispose();document.removeEventListener('keydown',key);root.remove();current=null;if(previous?.isConnected)previous.focus();resolve(value);}
  function prepare(){loaded=false;failed=false;$('#ah-ready').textContent='กำลังเตรียมสนาม…';$('#ah-play').textContent='เตรียมสนาม…';$('#ah-play').disabled=true;Promise.resolve().then(preload).then(()=>{if(done)return;loaded=true;$('#ah-ready').textContent='✓ สนามพร้อมแล้ว';$('#ah-play').disabled=false;$('#ah-play').textContent='เข้าสู่การผจญภัย →';},()=>{if(done)return;failed=true;$('#ah-ready').textContent='โหลดสนามไม่สำเร็จ กดเพื่อลองอีกครั้ง';$('#ah-play').disabled=false;$('#ah-play').textContent='ลองโหลดอีกครั้ง';});}
  root.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;if(b.dataset.hero){selected=get(b.dataset.hero);paint();}else if(b.id==='ah-back')finish(null);else if(b.id==='ah-play'){if(failed){prepare();return;}if(!loaded||typeof isAdmin!=='function'||!isAdmin())return;state.arenaLoadout=ArenaElements.normalizeSlots(state.arenaLoadout);state.arenaHero=selected.id;saveState();finish(selected.id);}});
  function key(e){if(e.key==='Escape'){e.preventDefault();finish(null);}else if(e.key==='Tab'){const bs=[...root.querySelectorAll('button:not(:disabled)')],first=bs[0],last=bs[bs.length-1];if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}}else if(e.target.dataset?.hero&&['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(e.key)){e.preventDefault();let i=roster.indexOf(selected);i=(i+({ArrowLeft:-1,ArrowRight:1,ArrowUp:-4,ArrowDown:4}[e.key])+8)%8;selected=roster[i];paint();root.querySelector('[data-hero="'+selected.id+'"]').focus();}}
  document.addEventListener('keydown',key);current={promise,portrait,cancel:()=>finish(null)};root.querySelector('[data-hero="'+selected.id+'"]').focus();prepare();return promise;
 }
 window.ArenaHeroes={roster,get,choose,cancel:()=>current?.cancel(),_t:{stats:()=>current?.portrait.stats()||null}};
})();
