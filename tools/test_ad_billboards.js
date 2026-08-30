/* Regression: empty ad billboards stay hidden in every Adventure3D world. */
'use strict';

const fs=require('fs');
const path=require('path');
const vm=require('vm');
const root=path.resolve(__dirname,'..');
const source=fs.readFileSync(path.join(root,'js','adv3d_tex.js'),'utf8');
const adventure=fs.readFileSync(path.join(root,'js','adventure3d.js'),'utf8');

function assert(pass,message){
  if(!pass) throw new Error(message);
  console.log('PASS '+message);
}

const textDraws=[];
const images=[];
const canvasContext={
  clearRect(){}, createLinearGradient(){return {addColorStop(){}};},
  fillRect(){}, beginPath(){}, arc(){}, fill(){}, drawImage(){},
  roundRect(){}, strokeRect(){}, stroke(){},
  measureText(s){return {width:String(s).length*20};},
  fillText(s){textDraws.push(String(s));},
  set globalAlpha(v){}, set fillStyle(v){}, set font(v){},
  set textAlign(v){}, set lineWidth(v){}, set strokeStyle(v){}
};
class CanvasTexture{constructor(image){this.image=image;this.needsUpdate=false;}}
class Group{
  constructor(){this.visible=true;this.children=[];this.position={set(){}};this.rotation={};}
  add(...children){this.children.push(...children);}
}
class Mesh{
  constructor(geometry,material){this.geometry=geometry;this.material=material;this.position={set(){}};}
}
class ImageMock{
  constructor(){images.push(this);}
  set src(v){this._src=v;}
}
const sandbox={
  window:{},
  document:{createElement(){return {width:0,height:0,getContext(){return canvasContext;}};}},
  Image:ImageMock,
  THREE:{
    CanvasTexture,Group,Mesh,
    PlaneGeometry:class{},CylinderGeometry:class{},
    MeshBasicMaterial:class{constructor(o){Object.assign(this,o);}},
    MeshLambertMaterial:class{constructor(o){Object.assign(this,o);}},
    DoubleSide:2
  }
};
vm.runInNewContext(source,sandbox,{filename:'adv3d_tex.js'});
const A=sandbox.window.Adv3dTex;
let renters={};
A.bind({adRenterActive:n=>renters[n]||null,adSeqBase:10});

const visible=[];
A.adBoardTexture(1,v=>visible.push(v));
assert(visible.at(-1)===false,'empty texture reports hidden');
assert(!textDraws.some(s=>/ติดต่อโฆษณา|064-357/.test(s)),'empty texture draws no contact message');

renters[1]={n:'ผู้เช่าทดสอบ'};
A.adTexDraws[1]();
assert(visible.at(-1)===true,'rented billboard becomes visible');
assert(textDraws.includes('ผู้เช่าทดสอบ'),'rented billboard keeps renter name');

renters={};
A.adTexDraws[1]();
assert(visible.at(-1)===false,'expired rental hides billboard again');

const scene={items:[],add(item){this.items.push(item);}};
A.addAdBillboard(scene,2,0,0,0,0);
assert(scene.items[0].visible===false,'empty ground billboard hides panel and poles');
renters[2]={n:'ผู้เช่าป้ายตั้งพื้น'};
A.adTexDraws[2]();
assert(scene.items[0].visible===true,'rented ground billboard shows the whole group');

const imageCallbacks=[];
A.adBoardTexture(3,v=>imageCallbacks.push(v));
images.at(-1).onload();
assert(imageCallbacks.at(-1)===true,'sponsor image makes billboard visible');

assert(!/fillText\(['"]ติดต่อโฆษณา/.test(source),'contact text is absent from texture runtime');
assert(!/adName\s*=\s*['"][^'"]*ลงโฆษณาที่นี่/.test(adventure),'city invitation label is absent from runtime');
assert(/panel\.visible=false;[\s\S]{0,160}adBoardTexture\(n,v=>\{panel\.visible=v;\}\)/.test(adventure),
  'helicopter building billboard starts hidden and follows real content');

console.log('PASS ad billboard regression complete');
