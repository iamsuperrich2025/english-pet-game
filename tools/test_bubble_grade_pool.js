"use strict";
/* Regression: Bubble ต้องมีคำเหมาะตามช่วงชั้นอย่างน้อย 500 คำแยกทุกชั้น ป.1–ม.6 */
const fs=require('fs'),path=require('path'),vm=require('vm');
const root=path.resolve(__dirname,'..');
const ctx={console,setTimeout,clearTimeout,Promise,state:{student:{grade:'ป.1'}},document:{readyState:'loading',addEventListener(){}},window:null};
ctx.window=ctx; vm.createContext(ctx);
const run=f=>vm.runInContext(fs.readFileSync(path.join(root,f),'utf8'),ctx,{filename:f});
run('js/data/dict_band/manifest.js');
for(const f of fs.readdirSync(path.join(root,'js/data/dict_band')).filter(f=>/^db[1-5]_.*\.js$/.test(f)).sort())run('js/data/dict_band/'+f);
run('js/dictband.js');
vm.runInContext('bandLoad=()=>Promise.resolve()',ctx);
run('js/bubble.js');

(async()=>{
  const grades=['ป.1','ป.2','ป.3','ป.4','ป.5','ป.6','ม.1','ม.2','ม.3','ม.4','ม.5','ม.6'];
  const report=[];
  for(const grade of grades){
    ctx.state.student.grade=grade;
    const words=await ctx.BubbleGame._t.prepareGradePool(grade);
    const uniq=new Set(words.map(x=>x.w));
    if(words.length<500)throw new Error(`${grade}: มีเพียง ${words.length} คำ`);
    if(uniq.size!==words.length)throw new Error(`${grade}: มีคำซ้ำ ${words.length-uniq.size} คำ`);
    if(words.some(x=>!/^[A-Z]{2,14}$/.test(x.w)||!x.th))throw new Error(`${grade}: พบคำผิดรูปแบบ/ไม่มีคำแปล`);
    report.push(`${grade}=${words.length}`);
  }
  ctx.state.student.grade='ป.1'; ctx.BubbleGame._t.markUsed('CAT');
  ctx.state.student.grade='ป.2';
  if(ctx.BubbleGame._t.usedSet().has('CAT'))throw new Error('ประวัติคำที่ใช้แล้วรั่วข้ามระดับชั้น');
  console.log('PASS bubble grade pools:',report.join(' · '));
})().catch(err=>{console.error('FAIL',err);process.exitCode=1;});
