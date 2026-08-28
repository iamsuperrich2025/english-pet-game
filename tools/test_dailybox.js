"use strict";
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.resolve(__dirname,'..'),jsPath=path.join(root,'js','dailybox.js');
const source=fs.readFileSync(jsPath,'utf8'),css=fs.readFileSync(path.join(root,'css','dailybox.css'),'utf8'),html=fs.readFileSync(path.join(root,'index_classic.html'),'utf8');
const build=fs.readFileSync(path.join(root,'tools','build_web.mjs'),'utf8');
const listeners={},sandbox={console,Math,Date,Uint32Array,setTimeout:()=>0,clearTimeout:()=>{},navigator:{},state:{},document:{readyState:'loading',visibilityState:'visible',addEventListener:(n,f)=>{listeners[n]=f;},getElementById:()=>null,querySelector:()=>null,querySelectorAll:()=>[]},crypto:require('node:crypto').webcrypto};
sandbox.window=sandbox; vm.runInNewContext(source,sandbox,{filename:jsPath});
const api=sandbox.DailyMysteryBox; assert.ok(api&&api._test,'exports test helpers');
assert.deepEqual(Array.from(api._test.PRIZES),[5000,4000,3000,2000,1000]);
let previous=null;
for(let day=0;day<200;day++){
  const order=Array.from(api._test.makeOrder(previous));
  assert.deepEqual(order.slice().sort((a,b)=>b-a),[5000,4000,3000,2000,1000],'every prize appears once');
  assert.notDeepEqual(order,[5000,4000,3000,2000,1000],'not simple descending');
  assert.notDeepEqual(order,[1000,2000,3000,4000,5000],'not simple ascending');
  if(previous) order.forEach((v,i)=>assert.notEqual(v,previous[i],`slot ${i} differs from prior day`));
  previous=order;
}
assert.match(source,/round\.claimed=true;[\s\S]*addCoins\(prize\); saveState\(\)/,'locks claim before paying and saves immediately');
assert.match(source,/const other=storedClaim\(\);[\s\S]*state=loadState\(\)/,'fresh local-save guard blocks a second tab');
assert.match(source,/round\.acknowledged=true; saveState\(\)/,'acknowledgement persists');
assert.match(css,/grid-template-columns:repeat\(5,minmax\(0,1fr\)\)/,'five boxes stay in one row');
assert.match(css,/@media \(max-height:430px\)/,'short landscape layout exists');
assert.match(html,/css\/dailybox\.css/); assert.match(html,/js\/dailybox\.js/);
assert.match(build,/'js\/dailybox\.js', 'css\/dailybox\.css'/,'pre-commit production build includes new entries');
console.log('PASS daily mystery box: 200-day shuffle, one-claim guard, persistent acknowledgement, short-screen CSS, HTML wiring');
