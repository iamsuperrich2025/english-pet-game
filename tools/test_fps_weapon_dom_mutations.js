'use strict';
const fs=require('fs');
const path=require('path');
const vm=require('vm');

const root=path.resolve(__dirname,'..');
const source=fs.readFileSync(path.join(root,'js','fpsweapon.js'),'utf8');
const sandbox={window:{}};
vm.runInNewContext(source,sandbox);
const API=sandbox.window.FpsWeaponRuntime;
const assert=(ok,label)=>{if(!ok)throw new Error(label)};
const equal=(actual,expected,label)=>assert(actual===expected,`${label}: expected ${expected}, got ${actual}`);

function fakeElement(){
  const writes={display:0,backgroundImage:0,state:0};
  let display='',backgroundImage='',state='';
  return {
    writes,
    style:{
      get display(){return display},set display(value){writes.display++;display=value},
      get backgroundImage(){return backgroundImage},set backgroundImage(value){writes.backgroundImage++;backgroundImage=value}
    },
    dataset:{get state(){return state},set state(value){writes.state++;state=value}}
  };
}
const snapshot=writes=>({...writes});
const delta=(writes,before)=>({
  display:writes.display-before.display,
  backgroundImage:writes.backgroundImage-before.backgroundImage,
  state:writes.state-before.state
});

const element=fakeElement();
const renderer=API.createRenderer(element);
renderer.reset();
let before=snapshot(element.writes);

renderer.render('idle.png','IDLE',true);
for(let i=0;i<1000;i++) renderer.render('idle.png','IDLE',true);
let change=delta(element.writes,before);
equal(change.display,1,'steady IDLE display writes');
equal(change.backgroundImage,1,'steady IDLE background writes');
equal(change.state,1,'steady IDLE state writes');

before=snapshot(element.writes);
for(let i=0;i<1000;i++) renderer.render('idle.png','IDLE',true);
change=delta(element.writes,before);
equal(change.display,0,'settled IDLE display writes');
equal(change.backgroundImage,0,'settled IDLE background writes');
equal(change.state,0,'settled IDLE state writes');

before=snapshot(element.writes);
renderer.render('walk-1.png','WALK',true);
for(let i=0;i<50;i++) renderer.render('walk-1.png','WALK',true);
renderer.render('walk-2.png','WALK',true);
change=delta(element.writes,before);
equal(change.display,0,'WALK visibility unchanged');
equal(change.backgroundImage,2,'WALK writes only visible frame transitions');
equal(change.state,1,'IDLE to WALK state write');

before=snapshot(element.writes);
renderer.render('ads.png','ADS',true);
for(let i=0;i<1000;i++) renderer.render('ads.png','ADS',true);
change=delta(element.writes,before);
equal(change.display,0,'steady ADS display writes');
equal(change.backgroundImage,1,'steady ADS background writes');
equal(change.state,1,'WALK to ADS state write');

before=snapshot(element.writes);
renderer.render('ads.png','ADS',false);
for(let i=0;i<1000;i++) renderer.render('ads.png','ADS',false);
change=delta(element.writes,before);
equal(change.display,1,'disabled hides once');
equal(change.backgroundImage,0,'disabled keeps reusable frame');
equal(change.state,0,'disabled steady state does not rewrite dataset');

before=snapshot(element.writes);
renderer.render('ads.png','ADS',true);
change=delta(element.writes,before);
equal(change.display,1,'re-enable shows once');
equal(change.backgroundImage,0,'re-enable same frame does not rewrite background');
equal(change.state,0,'re-enable same state does not rewrite dataset');

before=snapshot(element.writes);
renderer.reset();
renderer.render('idle.png','EQUIP',true);
change=delta(element.writes,before);
equal(change.display,2,'lifecycle reset hides then first render shows');
equal(change.backgroundImage,2,'lifecycle reset clears then restores frame');
equal(change.state,2,'lifecycle reset clears then restores state');

console.log('PASS FPS weapon DOM mutations: writes track visibility, frame and state changes; 1,000 settled ticks add zero writes');
