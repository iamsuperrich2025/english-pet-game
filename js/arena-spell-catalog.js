"use strict";
/* Round 1387: metadata only. The selected family's recipes and runner load on demand. */
(function(){
  const paths={"fire":"js/arena-spells/fire.js","wind":"js/arena-spells/wind.js","ice":"js/arena-spells/ice.js","meteor":"js/arena-spells/meteor.js","earth":"js/arena-spells/earth.js","gravity":"js/arena-spells/gravity.js","water":"js/arena-spells/water.js","light":"js/arena-spells/light.js","arc":"js/arena-spells/arc.js","nova":"js/arena-spells/nova.js"},loaded=new Map(),pending=new Map(),ready=new Set();
  const rows=[
  [
    "fire",
    "dragon_breath",
    "Dragon Breath",
    "ลมหายใจมังกรกวาดเป็นพัด เผาต่อเนื่อง",
    8
  ],
  [
    "fire",
    "phoenix_return",
    "Phoenix Return",
    "ฟีนิกซ์พุ่งไปแล้ววกกลับ ฟื้น HP 18",
    12
  ],
  [
    "fire",
    "solar_fall",
    "Solar Fall",
    "ดวงอาทิตย์ตกกระแทก หลังวงเตือน 1 วินาที",
    14
  ],
  [
    "fire",
    "molten_fissure",
    "Molten Fissure",
    "รอยแยกลาวา 5 จุดปะทุต่อกัน",
    11
  ],
  [
    "fire",
    "ember_satellites",
    "Ember Satellites",
    "ลูกไฟ 3 ดวงโคจรรอบตัว 4 วินาที",
    10
  ],
  [
    "wind",
    "blade_cross",
    "Gale Cross",
    "คมลมตัดไขว้สี่ทิศ ผลักศัตรู",
    7
  ],
  [
    "wind",
    "tempest_eye",
    "Tempest Eye",
    "ตาพายุดูดศัตรูรอบตัวแล้วสะบัดออก",
    12
  ],
  [
    "wind",
    "zephyr_serpent",
    "Zephyr Serpent",
    "งูวายุเลื้อยเป็นคลื่นทะลุฝูงศัตรู",
    8
  ],
  [
    "wind",
    "feather_chain",
    "Feather Chain",
    "ขนนกเวทชิ่งหาเป้าหมายได้ 6 ตัว",
    9
  ],
  [
    "wind",
    "sky_razors",
    "Sky Razors",
    "ใบมีดวายุ 5 เส้นแผ่ออกเป็นพัด",
    10
  ],
  [
    "ice",
    "frost_lotus",
    "Frost Lotus",
    "ดอกบัวน้ำแข็งแผ่วง 3 ชั้น ชะลอศัตรู",
    10
  ],
  [
    "ice",
    "glacier_lance",
    "Glacier Lance",
    "หอกน้ำแข็งแทงทะลุเป็นแนวยาว",
    8
  ],
  [
    "ice",
    "winter_prison",
    "Winter Prison",
    "กรงเหมันต์ 4 เสาผนึกพื้นที่ก่อนแตก",
    13
  ],
  [
    "ice",
    "snow_orbit",
    "Snow Orbit",
    "เกล็ดหิมะ 4 ดวงโคจรและชะลอ",
    9
  ],
  [
    "ice",
    "mirror_frost",
    "Mirror Frost",
    "ผลึกคู่ระเบิดซ้ายขวาของเป้าหมาย",
    11
  ],
  [
    "meteor",
    "comet_shower",
    "Comet Shower",
    "ดาวหาง 6 ลูกโปรยลงรอบเป้าหมาย",
    14
  ],
  [
    "meteor",
    "star_hammer",
    "Star Hammer",
    "ค้อนดาวตกกระแทกพื้นที่วงใหญ่",
    15
  ],
  [
    "meteor",
    "meteor_train",
    "Meteor Train",
    "สะเก็ดอุกกาบาตพุ่งตามกัน 7 ลูก",
    11
  ],
  [
    "meteor",
    "cinder_wheel",
    "Cinder Wheel",
    "วงล้อดาวเพลิงแล่นออกแล้วกลับ",
    10
  ],
  [
    "meteor",
    "stardust_mines",
    "Stardust Mines",
    "วางดาว 5 จุด ระเบิดจากวงนอกเข้ากลาง",
    13
  ],
  [
    "earth",
    "fault_serpent",
    "Fault Serpent",
    "รอยเลื่อนคดเคี้ยวปะทุ 7 จุด",
    10
  ],
  [
    "earth",
    "obsidian_cross",
    "Obsidian Cross",
    "เสาออบซิเดียนกั้นไขว้ ชะลอศัตรู",
    11
  ],
  [
    "earth",
    "golem_footfall",
    "Golem Footfall",
    "รอยเท้าโกเลมกระแทกสามระลอก",
    12
  ],
  [
    "earth",
    "jade_aegis",
    "Jade Aegis",
    "โล่หยก 20 พร้อมผลึกผลักศัตรูรอบตัว",
    15
  ],
  [
    "earth",
    "sand_maelstrom",
    "Sand Maelstrom",
    "พายุทรายดูดรวมก่อนระเบิดหิน",
    12
  ],
  [
    "gravity",
    "singularity_seed",
    "Singularity Seed",
    "เมล็ดหลุมดำดูดแรง ก่อนยุบตัว",
    14
  ],
  [
    "gravity",
    "rift_lance",
    "Rift Lance",
    "หอกมิติแหวกเป็นเส้นทะลุศัตรู",
    9
  ],
  [
    "gravity",
    "astral_orbits",
    "Astral Orbits",
    "ดวงดาวมืดสองวงโคจรสวนกัน",
    10
  ],
  [
    "gravity",
    "chrono_field",
    "Chrono Field",
    "สนามเวลาชะลอ พร้อมพลัง 4 จังหวะ",
    13
  ],
  [
    "gravity",
    "void_echo",
    "Void Echo",
    "ระเบิดมิติคู่ซ้ายขวา ดึงเข้าศูนย์",
    11
  ],
  [
    "water",
    "tidal_dragon",
    "Tidal Dragon",
    "มังกรน้ำเลื้อยกวาด ผลักศัตรู",
    10
  ],
  [
    "water",
    "pearl_prison",
    "Pearl Prison",
    "ฟองไข่มุกกักและแตก 4 ระลอก",
    11
  ],
  [
    "water",
    "moonwell",
    "Moonwell",
    "บ่อน้ำจันทร์ฟื้น HP 24 และผลักศัตรู",
    15
  ],
  [
    "water",
    "monsoon_needles",
    "Monsoon Needles",
    "ฝนเวท 8 สายแทงรอบเป้าหมาย",
    12
  ],
  [
    "water",
    "riptide_return",
    "Riptide Return",
    "กระแสน้ำพุ่งไปแล้วดึงย้อนกลับ",
    9
  ],
  [
    "light",
    "seraph_wings",
    "Seraph Wings",
    "ปีกเซราฟกวาดด้านหน้า พร้อมฟื้น HP 18",
    13
  ],
  [
    "light",
    "dawn_spear",
    "Dawn Spear",
    "หอกแสงรุ่งอรุณแทงทะลุแนวยาว",
    8
  ],
  [
    "light",
    "sanctuary",
    "Sanctuary",
    "วิหารแสงฟื้น HP 30 เสริมโล่ 12",
    17
  ],
  [
    "light",
    "prismatic_cross",
    "Prismatic Cross",
    "แสงปริซึมระเบิดตัดกันสี่ทิศ",
    11
  ],
  [
    "light",
    "sun_judgment",
    "Sun Judgment",
    "ตราสุริยันเตือนก่อนลำแสงลงทัณฑ์",
    15
  ],
  [
    "arc",
    "thunder_chain",
    "Thunder Chain",
    "สายฟ้าชิ่งสูงสุด 8 ตัว แรงลดทีละน้อย",
    9
  ],
  [
    "arc",
    "thunder_road",
    "Thunder Road",
    "สายฟ้าวิ่ง 6 จุดเป็นแนวยาว",
    10
  ],
  [
    "arc",
    "storm_cage",
    "Storm Cage",
    "กรงสายฟ้าหมุนสามมุม ชะลอศัตรู",
    12
  ],
  [
    "arc",
    "twin_fulgur",
    "Twin Fulgur",
    "สายฟ้าคู่ฟาดสองข้างเป้าหมาย",
    8
  ],
  [
    "arc",
    "ion_ripple",
    "Ion Ripple",
    "คลื่นไอออนแผ่ออก 4 ชั้น",
    11
  ],
  [
    "nova",
    "lunar_eclipse",
    "Lunar Eclipse",
    "คราสจันทร์ดูดแล้วระเบิดวงนอก",
    13
  ],
  [
    "nova",
    "cosmic_heart",
    "Cosmic Heart",
    "หัวใจจักรวาลระเบิด 4 ชีพจร",
    12
  ],
  [
    "nova",
    "comet_spiral",
    "Comet Spiral",
    "ดาวหางสามแขนหมุนกวาดรอบตัว",
    11
  ],
  [
    "nova",
    "star_bloom",
    "Star Bloom",
    "ดอกดาวผลิบาน 7 กลีบจากจุดเล็ง",
    14
  ],
  [
    "nova",
    "aurora_ribbon",
    "Aurora Ribbon",
    "แพรแสงเหนือเลื้อยผ่านและชะลอศัตรู",
    9
  ]
];
  for(const [family,id,name,desc,cd] of rows){
    const base=ArenaElements.byId[family];
    const def={id,name,desc,detail:desc,cd,family,pack:family,color:base.color,icon:'✦',tone:base.tone||580};
    ArenaElements.skills.push(def);ArenaElements.byId[id]=def;
  }
  const prices={"fire":3400,"wind":3600,"ice":3500,"meteor":4400,"earth":3800,"gravity":4400,"water":3400,"light":3000,"arc":3200,"nova":3600,"dragon_breath":3600,"phoenix_return":3500,"solar_fall":4800,"molten_fissure":3400,"ember_satellites":3400,"blade_cross":3400,"tempest_eye":3900,"zephyr_serpent":3500,"feather_chain":3800,"sky_razors":3400,"frost_lotus":3700,"glacier_lance":3700,"winter_prison":3800,"snow_orbit":3600,"mirror_frost":3600,"comet_shower":3700,"star_hammer":5000,"meteor_train":3500,"cinder_wheel":3500,"stardust_mines":3700,"fault_serpent":3400,"obsidian_cross":3600,"golem_footfall":3600,"jade_aegis":3300,"sand_maelstrom":3800,"singularity_seed":4900,"rift_lance":3500,"astral_orbits":3700,"chrono_field":3800,"void_echo":3700,"tidal_dragon":3600,"pearl_prison":3800,"moonwell":3600,"monsoon_needles":3800,"riptide_return":3700,"seraph_wings":3700,"dawn_spear":3500,"sanctuary":3700,"prismatic_cross":3500,"sun_judgment":5000,"thunder_chain":3900,"thunder_road":3700,"storm_cage":3600,"twin_fulgur":3500,"ion_ripple":3600,"lunar_eclipse":4700,"cosmic_heart":3800,"comet_spiral":3500,"star_bloom":3700,"aurora_ribbon":3700};
  for(const def of ArenaElements.skills)def.price=prices[def.id];
  function script(url){
    if(loaded.has(url))return loaded.get(url);
    const p=typeof loadScriptOnce==='function'?loadScriptOnce(url):new Promise((resolve,reject)=>{const s=document.createElement('script');s.src=url;s.onload=resolve;s.onerror=()=>{s.remove();reject(new Error('โหลดเวทมนตร์ไม่สำเร็จ'));};document.head.append(s);});
    loaded.set(url,p);p.catch(()=>loaded.delete(url));return p;
  }
  function isReady(id){return !ArenaElements.byId[id]?.pack||ready.has(ArenaElements.byId[id].pack);}
  function prepare(id){
    const def=ArenaElements.byId[id];if(!def)return Promise.reject(new Error('ไม่พบธาตุ'));if(isReady(id))return Promise.resolve();
    const family=def.pack;if(pending.has(family))return pending.get(family);
    const p=Promise.all([script('js/arena-spell-engine.js'),script(paths[family])]).then(()=>{if(!window.ArenaSpellEngine||!window.ArenaSpellPacks?.[family])throw new Error('ข้อมูลธาตุไม่ครบ');ready.add(family);});
    pending.set(family,p);p.finally(()=>pending.delete(family)).catch(()=>{});return p;
  }
  Object.assign(ArenaElements,{prepare,isReady,packPaths:paths});
})();
