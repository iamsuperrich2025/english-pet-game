"use strict";
/* Round 1387: permanent relic metadata + bonuses compiled only on entry/purchase. */
(function(){
  const rows=[
  [
    "prism",
    "Prism Heart",
    5000,
    "พลังโจมตีทุกสกิล +25%",
    "power",
    "nova",
    {}
  ],
  [
    "storm",
    "Gale Crest",
    3600,
    "วง Nova กว้าง +35% และขยายพายุ",
    "power",
    "wind",
    {}
  ],
  [
    "echo",
    "Echo Orb",
    4800,
    "ยิงพื้นฐานแยกไปหาอีก 1 เป้าหมาย",
    "power",
    "gravity",
    {}
  ],
  [
    "wing",
    "Guardian Wings",
    4200,
    "โล่ 30 และฟื้นโล่เมื่อพ้นการโจมตี",
    "guard",
    "light",
    {}
  ],
  [
    "rune_blade",
    "Runebound Blade",
    3800,
    "พลังโจมตีเพิ่มอีก 10%",
    "power",
    "fire",
    {
      "damage": 0.1
    }
  ],
  [
    "war_crown",
    "Warlord Crown",
    4100,
    "พลังโจมตีเพิ่มอีก 12%",
    "power",
    "earth",
    {
      "damage": 0.12
    }
  ],
  [
    "duelist_eye",
    "Duelist Eye",
    3300,
    "โอกาสคริติคอล +6%",
    "power",
    "arc",
    {
      "crit": 0.06
    }
  ],
  [
    "fate_dice",
    "Fate Dice",
    3700,
    "โอกาสคริติคอล +8%",
    "power",
    "nova",
    {
      "crit": 0.08
    }
  ],
  [
    "lion_fang",
    "Lion Fang",
    3500,
    "ตัวคูณดาเมจคริติคอล +0.35",
    "power",
    "fire",
    {
      "critDamage": 0.35
    }
  ],
  [
    "double_star",
    "Twin Star",
    3400,
    "กระสุนแยกของ Echo Orb แรงขึ้น 25%",
    "power",
    "nova",
    {
      "echoDamage": 0.25
    }
  ],
  [
    "ember_sigil",
    "Ember Sigil",
    3500,
    "ดาเมจเวทไฟ +15%",
    "element",
    "fire",
    {
      "element": "fire",
      "value": 0.15
    }
  ],
  [
    "gale_sigil",
    "Gale Sigil",
    3500,
    "ดาเมจเวทวายุ +15%",
    "element",
    "wind",
    {
      "element": "wind",
      "value": 0.15
    }
  ],
  [
    "frost_sigil",
    "Frost Sigil",
    3500,
    "ดาเมจเวทน้ำแข็ง +15%",
    "element",
    "ice",
    {
      "element": "ice",
      "value": 0.15
    }
  ],
  [
    "comet_sigil",
    "Comet Sigil",
    3500,
    "ดาเมจเวทดาวตก +15%",
    "element",
    "meteor",
    {
      "element": "meteor",
      "value": 0.15
    }
  ],
  [
    "terra_sigil",
    "Terra Sigil",
    3500,
    "ดาเมจเวทปฐพี +15%",
    "element",
    "earth",
    {
      "element": "earth",
      "value": 0.15
    }
  ],
  [
    "void_sigil",
    "Void Sigil",
    3500,
    "ดาเมจเวทมิติ +15%",
    "element",
    "gravity",
    {
      "element": "gravity",
      "value": 0.15
    }
  ],
  [
    "tide_sigil",
    "Tide Sigil",
    3500,
    "ดาเมจเวทวารี +15%",
    "element",
    "water",
    {
      "element": "water",
      "value": 0.15
    }
  ],
  [
    "dawn_sigil",
    "Dawn Sigil",
    3500,
    "ดาเมจเวทแสง +15%",
    "element",
    "light",
    {
      "element": "light",
      "value": 0.15
    }
  ],
  [
    "volt_sigil",
    "Volt Sigil",
    3500,
    "ดาเมจเวทสายฟ้า +15%",
    "element",
    "arc",
    {
      "element": "arc",
      "value": 0.15
    }
  ],
  [
    "cosmic_sigil",
    "Cosmic Sigil",
    3500,
    "ดาเมจเวทจักรวาล +15%",
    "element",
    "nova",
    {
      "element": "nova",
      "value": 0.15
    }
  ],
  [
    "amber_hourglass",
    "Amber Hourglass",
    3500,
    "คูลดาวน์ธาตุที่เลือกสั้นลง 6%",
    "magic",
    "meteor",
    {
      "cooldown": 0.06
    }
  ],
  [
    "astral_clock",
    "Astral Clock",
    3900,
    "คูลดาวน์ธาตุที่เลือกสั้นลง 8%",
    "magic",
    "gravity",
    {
      "cooldown": 0.08
    }
  ],
  [
    "crescent_chime",
    "Crescent Chime",
    4400,
    "คูลดาวน์ธาตุที่เลือกสั้นลง 10%",
    "magic",
    "nova",
    {
      "cooldown": 0.1
    }
  ],
  [
    "phoenix_heart",
    "Phoenix Heart",
    4500,
    "คูลดาวน์ MEGA สั้นลง 15%",
    "magic",
    "fire",
    {
      "megaCooldown": 0.15
    }
  ],
  [
    "healing_tome",
    "Healing Tome",
    3600,
    "พลังฟื้น HP จากเวทเพิ่ม 15%",
    "magic",
    "light",
    {
      "heal": 0.15
    }
  ],
  [
    "vital_seed",
    "Vital Seed",
    3200,
    "HP สูงสุดเพิ่ม 10",
    "guard",
    "water",
    {
      "hp": 10
    }
  ],
  [
    "ruby_amulet",
    "Ruby Amulet",
    3700,
    "HP สูงสุดเพิ่ม 15",
    "guard",
    "fire",
    {
      "hp": 15
    }
  ],
  [
    "elder_heart",
    "Elder Heart",
    4300,
    "HP สูงสุดเพิ่ม 20",
    "guard",
    "earth",
    {
      "hp": 20
    }
  ],
  [
    "silk_ward",
    "Silk Ward",
    3100,
    "ลดดาเมจที่ได้รับ 4%",
    "guard",
    "wind",
    {
      "armor": 0.04
    }
  ],
  [
    "obsidian_mail",
    "Obsidian Mail",
    3500,
    "ลดดาเมจที่ได้รับอีก 6%",
    "guard",
    "gravity",
    {
      "armor": 0.06
    }
  ],
  [
    "titan_seal",
    "Titan Seal",
    4000,
    "ลดดาเมจที่ได้รับอีก 8%",
    "guard",
    "earth",
    {
      "armor": 0.08
    }
  ],
  [
    "dew_pendant",
    "Dew Pendant",
    3300,
    "พ้นการโจมตี 4 วิ ฟื้น HP 0.4 ต่อวิ",
    "guard",
    "water",
    {
      "regen": 0.4
    }
  ],
  [
    "lotus_pendant",
    "Lotus Pendant",
    3900,
    "พ้นการโจมตี 4 วิ ฟื้น HP 0.6 ต่อวิ",
    "guard",
    "light",
    {
      "regen": 0.6
    }
  ],
  [
    "moon_barrier",
    "Moon Barrier",
    3400,
    "เพิ่มโล่สูงสุด 10 พร้อมฟื้นโล่",
    "guard",
    "ice",
    {
      "shield": 10
    }
  ],
  [
    "aegis_core",
    "Aegis Core",
    4100,
    "เพิ่มโล่สูงสุด 20 พร้อมฟื้นโล่",
    "guard",
    "arc",
    {
      "shield": 20
    }
  ],
  [
    "zephyr_boots",
    "Zephyr Boots",
    3000,
    "ความเร็วเคลื่อนที่ +5%",
    "journey",
    "wind",
    {
      "speed": 0.05
    }
  ],
  [
    "winged_sandals",
    "Winged Sandals",
    3500,
    "ความเร็วเคลื่อนที่เพิ่มอีก 8%",
    "journey",
    "light",
    {
      "speed": 0.08
    }
  ],
  [
    "comet_stride",
    "Comet Stride",
    4000,
    "ความเร็วเคลื่อนที่เพิ่มอีก 10%",
    "journey",
    "meteor",
    {
      "speed": 0.1
    }
  ],
  [
    "crystal_compass",
    "Crystal Compass",
    3100,
    "ระยะเก็บตัวอักษร +25%",
    "journey",
    "ice",
    {
      "pickup": 0.25
    }
  ],
  [
    "lodestone_ring",
    "Lodestone Ring",
    3600,
    "ระยะเก็บตัวอักษรเพิ่มอีก 40%",
    "journey",
    "gravity",
    {
      "pickup": 0.4
    }
  ],
  [
    "rune_satchel",
    "Rune Satchel",
    3500,
    "กระเป๋าเก็บตัวอักษรเพิ่ม 1 ช่อง",
    "harvest",
    "earth",
    {
      "cargo": 1
    }
  ],
  [
    "starlight_satchel",
    "Starlight Satchel",
    4300,
    "กระเป๋าเก็บตัวอักษรเพิ่ม 2 ช่อง",
    "harvest",
    "nova",
    {
      "cargo": 2
    }
  ],
  [
    "amber_preserver",
    "Amber Preserver",
    3000,
    "ตัวอักษรที่ตกอยู่ได้นานเพิ่ม 15 วิ",
    "harvest",
    "meteor",
    {
      "dropLife": 15
    }
  ],
  [
    "eternal_leaf",
    "Eternal Leaf",
    3400,
    "ตัวอักษรที่ตกอยู่ได้นานเพิ่ม 25 วิ",
    "harvest",
    "wind",
    {
      "dropLife": 25
    }
  ],
  [
    "lexicon_charm",
    "Lexicon Charm",
    5000,
    "เหรียญจากประกอบคำทั่วไป +10%",
    "harvest",
    "light",
    {
      "wordReward": 0.1
    }
  ],
  [
    "beast_fang",
    "Beast Fang",
    3400,
    "ดาเมจโจมตีของสัตว์เลี้ยง +15%",
    "companion",
    "earth",
    {
      "petDamage": 0.15
    }
  ],
  [
    "dragon_bond",
    "Dragon Bond",
    4000,
    "ดาเมจสัตว์เลี้ยงเพิ่มอีก 25%",
    "companion",
    "fire",
    {
      "petDamage": 0.25
    }
  ],
  [
    "swift_whistle",
    "Swift Whistle",
    3700,
    "สัตว์เลี้ยงช่วยโจมตีเร็วขึ้น 15%",
    "companion",
    "wind",
    {
      "petCooldown": 0.15
    }
  ],
  [
    "spirit_bell",
    "Spirit Bell",
    4300,
    "ช่วงรอสัตว์เลี้ยงโจมตีลดอีก 20%",
    "companion",
    "water",
    {
      "petCooldown": 0.2
    }
  ],
  [
    "mercy_thread",
    "Mercy Thread",
    4000,
    "เวลาที่เรากดช่วยชุบเพื่อนลด 25%",
    "companion",
    "light",
    {
      "revive": 0.25
    }
  ]
];
  const items=rows.map(([id,name,price,desc,category,family,effect])=>({id,name,price,desc,category,family,effect,ico:'✦'}));
  const byId=Object.fromEntries(items.map(i=>[i.id,i]));
  function compile(owned={},admin=false){
    const m={damage:0,crit:0,critDamage:0,echoDamage:0,cooldown:0,megaCooldown:0,heal:0,hp:0,armor:0,regen:0,shield:0,speed:0,pickup:0,cargo:0,dropLife:0,wordReward:0,petDamage:0,petCooldown:0,revive:0,elements:{}};
    for(const i of items)if(admin||owned[i.id]){const e=i.effect;if(e.element)m.elements[e.element]=(m.elements[e.element]||0)+e.value;else for(const [k,v] of Object.entries(e))m[k]+=v;}
    const limits={damage:.5,crit:.25,critDamage:1,cooldown:.3,megaCooldown:.3,heal:.5,hp:80,armor:.35,regen:3,shield:60,speed:.3,pickup:1,cargo:3,dropLife:60,wordReward:.25,petDamage:.75,petCooldown:.4,revive:.4};
    for(const [k,v] of Object.entries(limits))m[k]=Math.min(v,m[k]);return m;
  }
  const views=new WeakMap(),categories=[['all','ทั้งหมด'],['power','โจมตี'],['element','ธาตุ'],['magic','เวทมนตร์'],['guard','ป้องกัน'],['journey','เดินทาง'],['harvest','เก็บอักษร'],['companion','สัตว์เลี้ยง / ทีม']];
  function icon(i){return '<svg class="va-spell-icon" viewBox="0 0 64 64" aria-hidden="true"><use href="img/arena-icons/relics.svg#relic-'+i.id+'"></use></svg>';}
  function render(root,api){
    const panel=root.querySelector('#va-shop .va-panel');panel.classList.add('va-relic-panel');let v=views.get(panel);
    if(!v){v={category:'all',query:'',reset:true,api};views.set(panel,v);const tools=document.createElement('div');tools.className='va-grimoire-tools';tools.innerHTML='<label><select aria-label="หมวดพลังอักษร">'+categories.map(([id,n])=>'<option value="'+id+'">'+n+'</option>').join('')+'</select></label><label class="va-grimoire-search"><input type="search" aria-label="ค้นหาพลังอักษร" placeholder="ค้นหาชื่อหรือประโยชน์…"></label><b>50 RELICS</b>';panel.querySelector('.va-panel-head').after(tools);
      tools.querySelector('select').addEventListener('change',e=>{v.category=e.target.value;v.reset=true;render(root,v.api);});tools.querySelector('input').addEventListener('input',e=>{v.query=e.target.value;v.reset=true;render(root,v.api);});
      const nav=document.createElement('div');nav.className='va-grimoire-nav';nav.innerHTML='<span></span><b class="va-swipe-hint">ปัดซ้ายขวาเพื่อดูเพิ่มเติม</b><small>ซื้อครั้งเดียว · ใช้ถาวร · โบนัสมีขีดจำกัด</small>';panel.append(nav);
    }
    const admin=typeof isAdmin==='function'&&isAdmin();panel.querySelector('.va-panel-sub').textContent=admin?'ADMIN · ปลดล็อกครบ 50 ชิ้น ใช้งานฟรี':'ใช้เหรียญรวมที่มีอยู่ ซื้อครั้งเดียว ใช้ได้ถาวร';panel.querySelector('.va-grimoire-nav small').textContent=admin?'ADMIN · ใช้ฟรีทุกชิ้น':'ซื้อครั้งเดียว · ใช้ถาวร · โบนัสมีขีดจำกัด';
    v.api=api;const q=v.query.trim().toLowerCase(),list=items.filter(i=>(v.category==='all'||i.category===v.category)&&(!q||(i.name+' '+i.desc).toLowerCase().includes(q)));
    const grid=root.querySelector('#va-store-grid'),left=v.reset?0:grid.scrollLeft;ArenaStrip.bind(grid,'คลังพลังอักษร');
    grid.innerHTML=list.map(i=>'<button class="va-store-item'+(api.own(i.id)?' owned':'')+'" data-buy="'+i.id+'" aria-label="'+i.name+' '+i.desc+' '+(api.own(i.id)?'มีแล้ว':i.price+' เหรียญ')+'" '+(api.own(i.id)?'aria-disabled="true" tabindex="-1"':'')+'><span class="va-store-ico">'+icon(i)+'</span><div class="va-store-name">'+i.name+'</div><div class="va-store-desc">'+i.desc+'</div><div class="va-store-price">'+(api.own(i.id)?(typeof isAdmin==='function'&&isAdmin()?'✦ ADMIN · ใช้ได้':'✓ มีแล้ว'):'◈ '+api.fmt(i.price))+'</div></button>').join('')||'<p class="va-spell-empty">ไม่พบพลังอักษรที่ค้นหา</p>';
    grid.scrollLeft=left;v.reset=false;panel.querySelector('.va-grimoire-nav span').textContent=list.length+' ชิ้น';
  }
  window.ArenaRelics={items,byId,compile,render,icon};
})();
