import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';
function Group(){this.children=[];this.position={x:0,y:0,z:0,set(x,y,z){this.x=x;this.y=y;this.z=z;}};this.add=child=>this.children.push(child);}
const context=vm.createContext({window:{},Math,THREE:{Group}});
vm.runInContext(readFileSync(new URL('./frontline-config.js',import.meta.url),'utf8'),context);
vm.runInContext(readFileSync(new URL('./frontline-bases.js',import.meta.url),'utf8'),context);
const F=context.window.Frontline;
F.makeMeadow=function(){const meadow={x:0,z:0,follows:[]};return{
  mount(){},follow(x,z){meadow.x=x;meadow.z=z;meadow.follows.push([x,z]);},dispose(){},inspect:meadow};};
F.makeFlora=function(){const fills=[];return{fill(slot,cx,cz){fills.push({slot,cx,cz});},dispose(){},inspect:fills};};
F.makeGarden=function(_,index){return{index,visible:true,scale:{setScalar(){}},position:{set(){}},rotation:{y:0}};};
F.makeBoundary=function(){return{dispose(){}};};
vm.runInContext(readFileSync(new URL('./frontline-map.js',import.meta.url),'utf8'),context);

test('the painted meadow tracks the camera every frame without waiting for a chunk boundary',()=>{
  const meadow={follows:[]};
  F.makeMeadow=function(){return{mount(){},follow(x,z){meadow.follows.push([x,z]);},dispose(){}};};
  const map=F.buildMap({add(){},remove(){}},{});
  meadow.follows.length=0;
  for(const x of [0,.4,.8,1.2,9,9.1])map.update(x,0);
  assert.deepEqual(meadow.follows.map(p=>p[0]),[0,.4,.8,1.2,9,9.1]);
  assert.ok(meadow.follows.every(p=>p[1]===0));
  map.dispose();
});

test('chunk streaming reuses the overlapping 12 tiles and only fills the three new cells',()=>{
  const fills=[];
  F.makeFlora=function(){return{fill(slot,cx,cz){fills.push({slot,cx,cz});},dispose(){}};};
  F.makeMeadow=function(){return{mount(){},follow(){},dispose(){}};};
  const map=F.buildMap({add(){},remove(){}},{});
  assert.equal(fills.length,15);
  const first=new Set(fills.map(f=>f.cx+','+f.cz));
  fills.length=0;
  assert.equal(map.update(0,1),false);
  assert.equal(fills.length,0);
  assert.equal(map.update(18,0),true);
  assert.equal(fills.length,3);
  const next=new Set(fills.map(f=>f.cx+','+f.cz));
  assert.ok([...next].every(key=>!first.has(key)));
  assert.equal(map.center.x,1);assert.equal(map.center.z,0);assert.equal(map.count,15);
  map.dispose();
});
