/* Regression contract for O-NET exam sets and anti-memorisation (round 1183). */
'use strict';
const fs=require('fs'), path=require('path'), vm=require('vm'), assert=require('assert');
const root=path.resolve(__dirname,'..'), dir=path.join(root,'js','data','exam');
const specs={
  onetp6:{sets:5,total:32,choices:4,sequence:0,time:60,first:2500,again:180},
  onetm3:{sets:5,total:32,choices:4,sequence:1,time:90,first:3500,again:250},
  onetm6:{sets:5,total:60,choices:5,sequence:7,time:90,first:5000,again:400},
};
for(const [exam,s] of Object.entries(specs)){
  for(let n=1;n<=s.sets;n++){
    const file=path.join(dir,`${exam}_${n}.json`), d=JSON.parse(fs.readFileSync(file,'utf8'));
    const items=d.sections.flatMap((sec,si)=>sec.items.map((it,ii)=>({...it,secI:si,srcI:`${si}:${ii}`})));
    assert.equal(d.exam,exam); assert.equal(d.total,s.total); assert.equal(items.length,s.total);
    assert.equal(items.filter(x=>x.tag==='Sequencing').length,s.sequence,`${exam}_${n} sequencing`);
    items.forEach((it,i)=>{
      assert.equal(it.c.length,s.choices,`${exam}_${n} #${i+1} choices`);
      assert.equal(new Set(it.c).size,s.choices,`${exam}_${n} #${i+1} unique choices`);
      assert(it.a>=0&&it.a<s.choices); assert(it.ex.length>=30);
    });
  }
}
const src=fs.readFileSync(path.join(root,'js','examstd.js'),'utf8');
for(const [exam,s] of Object.entries(specs)){
  assert(src.includes(`${exam}:{first:${s.first}, again:${s.again}}`),`${exam} reward`);
  assert(src.includes(`${exam}:${s.time}`),`${exam} time`);
}
assert(src.includes("['A','B','C','D','E']"),'five answer labels');
assert(src.includes("'12345'"),'keyboard 1-5');
assert(src.includes('xsRandomizedPack(pack)'),'start randomises every attempt');
const html=fs.readFileSync(path.join(root,'index_classic.html'),'utf8');
for(const exam of Object.keys(specs)) assert(html.includes(`data-xstd="${exam}"`),`Lobby button ${exam}`);
assert(html.includes('id="btn-rail-onet"'),'Lobby rail O-NET button');
const city=fs.readFileSync(path.join(root,'js','city3d.js'),'utf8');
assert(city.includes("bld('onet'"),'Lobby 3D O-NET building');
const main=fs.readFileSync(path.join(root,'js','main.js'),'utf8');
assert(main.includes("onet:'#btn-rail-onet'"),'Lobby 3D route opens O-NET rail action');

// Execute the real shuffle helpers in isolation and prove order/answer integrity across two attempts.
const helper=src.slice(src.indexOf('const __xsLastOrder = {}'),src.indexOf('function xsTimerStop'));
const ctx={Math:Object.create(Math)}; let seed=1;
ctx.Math.random=()=>{ seed=(seed*48271)%2147483647; return seed/2147483647; };
vm.createContext(ctx); vm.runInContext(helper.replace(/^const __xsLastOrder/m,'var __xsLastOrder'),ctx);
const base={id:'demo',items:Array.from({length:12},(_,i)=>({srcI:i,secI:i%3,q:`q${i}`,c:['right','w1','w2','w3'],a:0}))};
const a=vm.runInContext('xsRandomizedPack',ctx)(base), b=vm.runInContext('xsRandomizedPack',ctx)(base);
assert.notDeepEqual(a.items.map(x=>x.srcI),base.items.map(x=>x.srcI),'first run shuffled');
assert.notDeepEqual(b.items.map(x=>x.srcI),a.items.map(x=>x.srcI),'next mode/attempt cannot repeat order');
[a,b].forEach(pack=>pack.items.forEach(it=>assert.equal(it.c[it.a],'right','answer remapped after choice shuffle')));
console.log('✅ O-NET: 15 sets / 620 questions, blueprint counts, rewards, times, 4/5 choices, sequencing, and shuffle contract pass');
