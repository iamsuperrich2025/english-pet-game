/* Regression: taps shorter than one animation frame must survive pointer release. */
import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';
const source=readFileSync(process.env.FRONTLINE_INPUT_SOURCE||new URL('./frontline-input.js',import.meta.url),'utf8');
function harness(){
  class Element extends EventTarget{
    constructor(action){super();this.dataset={hold:action};this.tagName='BUTTON';}
    setPointerCapture(){throw Error('Touch already released');}
    setAttribute(){}
    closest(){return this;}
  }
  const root=new Element(),win=new EventTarget(),doc=new EventTarget(),buttons=['fire','bomb','left','right','drop'].map(x=>new Element(x));
  root.querySelector=()=>null;root.querySelectorAll=s=>s==='[data-hold]'?buttons:[];
  win.Frontline={C:{speedNames:['SLOW','NORMAL','FAST']}};
  vm.runInNewContext(source,{window:win,document:doc,matchMedia:()=>({matches:false})});
  const input=win.Frontline.bindInput(root);
  function event(target,type,props={}){const e=new Event(type,{cancelable:true});Object.assign(e,props);target.dispatchEvent(e);}
  return{input,event,root,win,doc,buttons};
}
test('quick FIRE and BOMB taps survive release and failed capture until consumed exactly once',()=>{
  const h=harness();for(const [i,action] of ['fire','bomb'].entries()){
    h.event(h.buttons[i],'pointerdown',{pointerId:i});h.event(h.buttons[i],'pointerup',{pointerId:i});
    assert.equal(h.input.value[action],false);assert.equal(h.input.take(action),true);assert.equal(h.input.take(action),false);
  }h.input.dispose();
});
test('held attacks repeat; releasing outside stops holding; blur removes unconsumed taps',()=>{
  const h=harness();h.event(h.buttons[0],'pointerdown',{pointerId:7});
  assert.equal(h.input.take('fire'),true);assert.equal(h.input.take('fire'),true);
  h.event(h.win,'pointerup',{pointerId:7});assert.equal(h.input.take('fire'),false);
  h.event(h.buttons[1],'pointerdown',{pointerId:8});h.event(h.win,'blur');
  assert.equal(h.input.take('bomb'),false);h.input.dispose();
});
test('assistive click and short keyboard press each trigger one attack',()=>{
  const h=harness();const e=new Event('click');Object.defineProperty(e,'target',{value:h.buttons[0]});e.detail=0;h.root.dispatchEvent(e);
  assert.equal(h.input.take('fire'),true);assert.equal(h.input.take('fire'),false);
  h.event(h.win,'keydown',{code:'KeyB',repeat:false});h.event(h.win,'keyup',{code:'KeyB'});
  assert.equal(h.input.take('bomb'),true);assert.equal(h.input.take('bomb'),false);h.input.dispose();
});

// DROP is deliberate: holding it must never discard subsequent pickups.
test('DROP survives a short tap and fires once per physical press, including Q',()=>{
 const h=harness(),b=h.buttons[4];h.event(b,'pointerdown',{pointerId:5});
 assert.equal(h.input.take('drop'),true);assert.equal(h.input.take('drop'),false);
 h.event(b,'pointerup',{pointerId:5});assert.equal(h.input.take('drop'),false);
 h.event(h.win,'keydown',{code:'KeyQ',repeat:false});assert.equal(h.input.take('drop'),true);
 h.event(h.win,'keydown',{code:'KeyQ',repeat:true});assert.equal(h.input.take('drop'),false);
 h.event(h.win,'keyup',{code:'KeyQ'});h.event(b,'pointerdown',{pointerId:6});h.event(b,'pointerup',{pointerId:6});
 assert.equal(h.input.take('drop'),true);assert.equal(h.input.take('drop'),false);h.input.dispose();
});
test('disabled DROP ignores pointer and assistive click; blur clears queued DROP',()=>{
 const h=harness(),b=h.buttons[4];b.disabled=true;h.event(b,'pointerdown',{pointerId:4});
 const e=new Event('click');Object.defineProperty(e,'target',{value:b});e.detail=0;h.root.dispatchEvent(e);
 assert.equal(h.input.take('drop'),false);b.disabled=false;
 h.event(b,'pointerdown',{pointerId:5});h.event(h.win,'blur');assert.equal(h.input.take('drop'),false);h.input.dispose();
});
