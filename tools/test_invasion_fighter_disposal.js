'use strict';
const fs=require('fs');
const path=require('path');
const vm=require('vm');

const root=path.resolve(__dirname,'..');
const source=fs.readFileSync(path.join(root,'js','invasion3d.js'),'utf8');
const start=source.indexOf("const FIGHTER_TEXTURE_KEYS=");
const end=source.indexOf('function drawFighterBar',start);
if(start<0||end<0) throw new Error('fighter disposal helper not found');

const calls=[];
const resource=name=>({name,dispose(){calls.push(name)}});
const ownedGeo=resource('owned geometry');
const detachedGeo=resource('detached owned geometry');
const sharedGeo=resource('shared GLB geometry');
const ownedTexture=resource('owned CanvasTexture');
const sharedTexture=resource('shared cached texture');
const ownedMaterial=resource('owned material');
const detachedMaterial=resource('detached owned material');
const sharedMaterial=resource('shared GLB material');
ownedMaterial.map=ownedTexture;
sharedMaterial.map=sharedTexture;

const nodes=[
  {geometry:ownedGeo,material:[ownedMaterial,sharedMaterial]},
  {geometry:sharedGeo,material:sharedMaterial},
];
const group={traverse(fn){nodes.forEach(fn)}};
const scene={remove(value){calls.push(value===group?'group removed':'wrong group')}};
const sandbox={scene,fighters:[]};
vm.runInNewContext(source.slice(start,end)+'\nthis.api={disposeFighter,clearFighters};',sandbox);

const fighter={grp:group,resourcesDisposed:false,owned:{
  geometries:new Set([ownedGeo,detachedGeo]),
  materials:new Set([ownedMaterial,detachedMaterial]),
  textures:new Set([ownedTexture]),
}};
const assert=(ok,label)=>{if(!ok)throw new Error(label)};
assert(sandbox.api.disposeFighter(fighter)===true,'first cleanup runs');
assert(sandbox.api.disposeFighter(fighter)===false,'second cleanup is idempotent');
for(const name of ['group removed','owned geometry','detached owned geometry','owned CanvasTexture','owned material','detached owned material'])
  assert(calls.filter(value=>value===name).length===1,`${name} disposed exactly once`);
for(const name of ['shared GLB geometry','shared cached texture','shared GLB material'])
  assert(!calls.includes(name),`${name} remains alive`);
assert(fighter.owned.geometries.size===0&&fighter.owned.materials.size===0&&fighter.owned.textures.size===0,'owned sets drain');

const a={grp:group,resourcesDisposed:false,owned:{geometries:new Set(),materials:new Set(),textures:new Set()}};
const b={grp:group,resourcesDisposed:false,owned:{geometries:new Set(),materials:new Set(),textures:new Set()}};
sandbox.fighters.push(a,b);
sandbox.api.clearFighters();
assert(sandbox.fighters.length===0&&a.resourcesDisposed&&b.resourcesDisposed,'wave/world cleanup disposes every fighter then clears array');
console.log('PASS fighter disposal: owned resources once; arrays/maps supported; shared GLB/cache preserved; cleanup idempotent');
