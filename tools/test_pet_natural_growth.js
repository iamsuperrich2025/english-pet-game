"use strict";

const fs = require("fs");
const path = require("path");
const vm = require("vm");
const root = path.resolve(__dirname, "..");
const read = (...parts)=>fs.readFileSync(path.join(root, ...parts), "utf8");
const fail = [];
const must = (ok, message)=>{ if(!ok) fail.push(message); };

const petsSource = read("js", "data", "pets.js");
const stateSource = read("js", "state.js");
const authSource = read("js", "auth.js");
const uiSource = read("js", "ui.js");
const petContext = {};
vm.createContext(petContext);
vm.runInContext(`${petsSource}\nthis.PETS = PETS;`, petContext);

const expected = ['dog','cat','dragon','elephant','meerkat','tyrannosaurusRex','toucan','buffalo','sikaDeer'];
must(JSON.stringify(Object.keys(petContext.PETS)) === JSON.stringify(expected), "pet catalog changed without updating the lifecycle audit");
for(const type of expected){
  const conf = petContext.PETS[type];
  const start = `${type}_${conf.startKey}.webp`;
  for(const file of [start, `${type}_baby_normal.webp`, `${type}_adult_normal.webp`]){
    must(fs.existsSync(path.join(root, "img", "animal", file)), `${type} lifecycle asset missing: ${file}`);
  }
  must(conf.startKey === (type === 'dragon' ? 'egg' : 'newborn'), `${type} has an incorrect purchase stage`);
}

const newPetStart = stateSource.indexOf("function newPet(");
const newPetEnd = stateSource.indexOf("function loadState(", newPetStart);
const helperStart = stateSource.indexOf("function activePet(");
const helperEnd = stateSource.indexOf("function hasPetType(", helperStart);
must(newPetStart >= 0 && newPetEnd > newPetStart && helperStart >= 0 && helperEnd > helperStart, "pet lifecycle functions could not be isolated");
if(!fail.length){
  const lifecycleContext = {PETS:petContext.PETS, state:{pets:[],active:0}};
  vm.createContext(lifecycleContext);
  vm.runInContext(`${stateSource.slice(newPetStart,newPetEnd)}\n${stateSource.slice(helperStart,helperEnd)}`, lifecycleContext);
  for(const type of expected){
    const p = lifecycleContext.newPet(type, type);
    lifecycleContext.state.pets = [p];
    must(p.level === 1 && p.exp === 0, `${type} does not start at level 1 / EXP 0`);
    must(lifecycleContext.petStage(p) === 'egg', `${type} purchase does not render its start image`);
    p.level = 2;
    must(lifecycleContext.petStage(p) === 'baby', `${type} level 2 does not render baby art`);
    p.level = 3;
    must(lifecycleContext.petStage(p) === 'adult', `${type} level 3 does not render adult art`);
  }
}

const boostStart = authSource.indexOf("function testerBoost(");
const boostEnd = authSource.indexOf("function authSetStatus(", boostStart);
const boostSource = authSource.slice(boostStart, boostEnd);
must(boostStart >= 0 && boostEnd > boostStart, "testerBoost could not be isolated");
must(!/\bp\.level\s*=\s*3\b/.test(boostSource), "testerBoost still forces pets to adult level");
must(boostSource.includes("testerPetGrowthFixVersion") && boostSource.includes("p.level = 1;"), "one-time rollback for legacy auto-grown pets is missing");
if(!fail.length){
  let saves = 0;
  const boostContext = {
    Auth:{user:{email:'sumpajitshami@gmail.com'}}, PETS:petContext.PETS,
    state:{
      coins:10000000, testerAccess:true,
      pets:[
        {type:'sikaDeer',name:'legacy-auto-grown',level:3,exp:0},
        {type:'dog',name:'earned-adult',level:3,exp:5},
        {type:'cat',name:'natural-newborn',level:1,exp:0},
      ]
    },
    thDayKey:()=>"2569-09-09", fmtNum:String,
    addCoins(value){ this.state.coins += value; },
    saveState(){ saves++; }, renderDashboard(){}, onlinePushScore(){}, authPushSave(){}, toast(){},
    setTimeout(fn){ fn(); }
  };
  vm.createContext(boostContext);
  const boostConstantsStart = authSource.indexOf("const TESTER_EMAILS");
  vm.runInContext(authSource.slice(boostConstantsStart, boostEnd), boostContext);
  boostContext.testerBoost();
  must(boostContext.state.pets[0].level === 1, "legacy Lv.3/EXP 0 pet was not restored to its purchase stage");
  must(boostContext.state.pets[1].level === 3 && boostContext.state.pets[1].exp === 5, "naturally earned adult pet was incorrectly rolled back");
  must(boostContext.state.pets[2].level === 1, "natural newborn was incorrectly changed by testerBoost");
  must(boostContext.state.testerPetGrowthFixVersion === 1 && saves === 1, "growth rollback marker was not persisted exactly once");
  boostContext.testerBoost();
  must(saves === 1, "growth rollback ran more than once");
}

const purchaseStart = uiSource.indexOf("function openPetPurchase(");
const purchaseEnd = uiSource.indexOf("function renderPetShop(", purchaseStart);
const purchaseSource = uiSource.slice(purchaseStart, purchaseEnd);
must(purchaseStart >= 0 && purchaseEnd > purchaseStart, "pet purchase function could not be isolated");
must(purchaseSource.includes("state.pets.push(newPet(key, name))"), "pet purchase no longer uses the canonical level-1 constructor");
must(!purchaseSource.includes("testerBoost"), "pet purchase still invokes the legacy instant-growth booster");

if(fail.length){
  console.error("Natural pet growth validation FAILED:\n- " + fail.join("\n- "));
  process.exit(1);
}
console.log(`Natural pet growth validation PASS (${expected.length} species, 3 stages each)`);
