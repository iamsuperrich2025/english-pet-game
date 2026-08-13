"use strict";
const fs=require('fs'),vm=require('vm'),assert=require('assert');
const root=require('path').join(__dirname,'..');
const picdict=fs.readFileSync(require('path').join(root,'js','picdict.js'),'utf8');
const online=fs.readFileSync(require('path').join(root,'js','picquiz_online.js'),'utf8');

const dataCtx={};dataCtx.window=dataCtx;vm.createContext(dataCtx);
vm.runInContext(fs.readFileSync(require('path').join(root,'js','data','picdict.js'),'utf8'),dataCtx);
vm.runInContext(fs.readFileSync(require('path').join(root,'js','data','picdict_words.js'),'utf8'),dataCtx);
const limits=vm.runInContext(`({sheets:PICDICT_BOOK.reduce((n,g)=>n+g.sheets.length,0),maxWords:Math.max(...Object.values(PICDICT_WORDS).map(x=>x.words.length))})`,dataCtx);
assert(limits.sheets<60&&limits.maxWords<999,'packed book location must stay inside Firebase spread 0..60');

const document={readyState:'loading',addEventListener(){},getElementById(){return null;}};
const ctx={document,console,setTimeout(){},clearTimeout(){},setInterval(){},clearInterval(){},
  PICDICT_BOOK:[{icon:'A',sheets:[['Animals.png','Animals','สัตว์']]}],
  PICDICT_WORDS:{'Animals.png':{words:[['cat','แมว'],['dog','หมา']]}}};
ctx.window=ctx;ctx.window.addEventListener=()=>{};
vm.createContext(ctx);vm.runInContext(picdict,ctx);vm.runInContext(online,ctx);

const pool=ctx.PicQuizOnline._t.makePool();
assert.deepStrictEqual(JSON.parse(JSON.stringify(pool)),[
  {en:'cat',th:'แมว',sheet:0,word:0,spread:.001},{en:'dog',th:'หมา',sheet:0,word:1,spread:.002}
]);
assert.strictEqual(typeof ctx.PicDict._t.goToWord,'function');
assert(!online.includes('buildPages('),'online quiz must not call removed buildPages API');
assert(!online.includes('.openBook('),'online quiz must not call removed openBook API');
assert(!online.includes('.renderSpread('),'online quiz must not call removed renderSpread API');
assert(!online.includes('._t.goTo('),'online quiz must not call removed goTo API');

(async()=>{
  let written=null;
  ctx.onlineKey=()=> 'teacher-uid';
  const P=ctx.PicQuizOnline._t.P;
  P.owner='teacher-uid';P.status='waiting';P.members={'teacher-uid':{n:'ครู'}};
  P.roomRef={update(payload){written=payload;return Promise.resolve();}};
  await ctx.PicQuizOnline._t.startGame();
  assert(written&&written.status==='playing','start button must write playing status');
  assert.strictEqual(written.game.phase,'countdown');
  console.log('PASS picquiz online start uses the current Picture Dictionary API');
})().catch(err=>{console.error(err);process.exitCode=1;});
