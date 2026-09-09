"use strict";

const fs = require("fs");
const path = require("path");
const vm = require("vm");
const root = path.resolve(__dirname, "..");
const home = fs.readFileSync(path.join(root, "js", "home-v2.js"), "utf8");
const css = fs.readFileSync(path.join(root, "css", "home-v2.css"), "utf8");
const fail = [];
const must = (ok, message) => { if(!ok) fail.push(message); };

must(!home.includes("function mascotDragon()") && !home.includes("mascotDragon()"), "temporary mascot remains in Home V2 runtime");
must(home.includes('class="vw2-speech" style="display:none"><span id="vw2-pet-greeting"></span>'), "pet speech can flash before the active-pet state is known");
must(home.includes("if(speech) speech.style.display = p ? '' : 'none';"), "pet speech is not hidden when there is no active pet");
must(home.includes("p ? `${petName} ดีใจที่ได้เจอหนูอีกครั้ง!` : ''"), "no-pet greeting text is not cleared");
must(home.includes('class="vw2-stage-copy" style="display:none"><b id="vw2-pet-name"></b><span id="vw2-pet-state"></span>'), "pet caption can flash before the active-pet state is known");
must(home.includes("if(stageCopy) stageCopy.style.display = p ? '' : 'none';") && home.includes("setText('vw2-pet-name', p ? petName : '');") && home.includes("setText('vw2-pet-state', p ? petStatusText(p) : '');"), "no-pet caption text is not hidden and cleared");
must(home.includes('id="vw2-pet" data-vw2-pat') && home.includes('style="display:none"></button>'), "pet stage does not start empty while the real image loads");
must(home.includes("function alignPetToPlatform(img)") && home.includes("rgba[(y * width + x) * 4 + 3] < 32") && home.includes("alignPetToPlatform(img);"), "pet alpha-bound pedestal alignment is missing");
must(home.includes("box.dataset.petType = p?.type || '';") && home.includes("box.dataset.petStage = stage;"), "pet type/stage metadata is not synced to Home V2");
must(css.includes("R42 / รอบ 1372") && css.includes("#vw-home-v2-root .vw2-pet{bottom:25%!important}") && css.includes("--vw2-pet-align-y"), "pet pedestal surface baseline contract is missing");

const cleanStart = home.indexOf("function cleanText(");
const cleanEnd = home.indexOf("function completeText(", cleanStart);
const visualStart = home.indexOf("function petVisualUrl(");
const visualEnd = home.indexOf("function syncNewWordCard(", visualStart);
must(cleanStart >= 0 && cleanEnd > cleanStart && visualStart >= 0 && visualEnd > visualStart, "pet visual functions could not be isolated");

class TokenList {
  constructor(){ this.values = new Set(); }
  add(...values){ values.forEach(value=>this.values.add(value)); }
  remove(...values){ values.forEach(value=>this.values.delete(value)); }
  contains(value){ return this.values.has(value); }
}
function fakeImage(){
  return {
    className:'', alt:'', decoding:'', src:'', style:{}, complete:false, naturalWidth:0, listeners:{},
    addEventListener(type, fn){ this.listeners[type] = fn; }
  };
}
const box = {
  dataset:{}, style:{display:'none'}, classList:new TokenList(), children:[],
  replaceChildren(...nodes){ this.children = nodes; },
  contains(node){ return this.children.includes(node); },
  querySelector(selector){ return selector === 'img.vw2-owned-pet' ? (this.children.find(node=>node.className === 'vw2-owned-pet') || null) : null; }
};
let pet = null;
let imageCalls = 0;
const context = {
  activePet:()=>pet,
  currentPetImg:value=>{ imageCalls++; return value ? `/img/${value.type}.webp` : '/img/should-not-be-used.webp'; },
  document:{
    getElementById:id=>id === 'vw2-pet' ? box : null,
    querySelector:()=>null,
    createElement:tag=>tag === 'img' ? fakeImage() : null
  }
};
vm.createContext(context);
if(!fail.length){
  vm.runInContext(`${home.slice(cleanStart, cleanEnd)}\n${home.slice(visualStart, visualEnd)}`, context);

  context.syncPetVisual();
  must(imageCalls === 0, "no-pet state still asks the image resolver for a fallback");
  must(box.style.display === 'none' && box.children.length === 0, "no-pet state is not visually empty");

  for(const type of ['dog','cat','dragon']){
    pet = {type, name:type};
    context.syncPetVisual();
    const img = box.children[0];
    must(box.style.display === 'none', `${type} stage is visible before its real image loads`);
    must(img && img.src === `/img/${type}.webp`, `${type} real image was not requested`);
    must(img && img.style.visibility === 'hidden', `${type} image is not hidden during loading`);
    must(!box.classList.contains('has-owned-pet') && box.classList.contains('is-loading'), `${type} loading classes are incorrect`);
    img.listeners.load();
    must(box.style.display === '' && img.style.visibility === '', `${type} image was not revealed after load`);
    must(box.classList.contains('has-owned-pet') && !box.classList.contains('is-loading'), `${type} loaded classes are incorrect`);
  }

  pet = {type:'dog', name:'retry'};
  context.syncPetVisual();
  const failedImage = box.children[0];
  failedImage.listeners.error();
  must(box.style.display === 'none' && box.children.length === 0 && box.dataset.src === '', "failed pet image does not return to an empty stage");

  pet = null;
  context.syncPetVisual();
  must(box.style.display === 'none' && box.children.length === 0, "switching back to no-pet state leaves old art visible");
}

if(fail.length){
  console.error("Home V2 pet loading validation FAILED:\n- " + fail.join("\n- "));
  process.exit(1);
}
console.log("Home V2 pet loading validation PASS");
