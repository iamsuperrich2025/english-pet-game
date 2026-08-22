'use strict';
const assert=require('assert');
const fs=require('fs');
const vm=require('vm');

const data=fs.readFileSync('js/data/f1_vocab.js','utf8');
const f1=fs.readFileSync('js/f1_3d.js','utf8');
const html=fs.readFileSync('index_classic.html','utf8');
const build=fs.readFileSync('tools/build_web.mjs','utf8');
const ctx={Math,state:{student:{grade:'ป.1'}}};
vm.createContext(ctx);
vm.runInContext(`${data}\n;this.__F1={bands:F1_VOCAB_BANDS,limit:F1_RECENT_LIMIT,band:f1VocabBand,forStudent:f1VocabForStudent,choose:f1ChooseVocabWord};`,ctx,{filename:'js/data/f1_vocab.js'});

const api=ctx.__F1;
assert.strictEqual(api.bands.length,5,'F1 vocabulary must expose exactly five school bands');
assert.strictEqual(api.limit,16,'anti-repeat history must cover the previous 16 words');
const expectedGrades=[
  ['ต่ำกว่าประถมศึกษา','ป.1','ป.2'],
  ['ป.3','ป.4'],
  ['ป.5','ป.6'],
  ['ม.1','ม.2','ม.3'],
  ['ม.4','ม.5','ม.6','ปริญญาตรี','สูงกว่าปริญญาตรี'],
];
const globalWords=new Set();
const forbidden=new Set(['alcohol','beer','bomb','cigarette','drunk','mistress','murder','nude','rifle','sex','suicide','vodka','weapon','whiskey','wine']);
const redundant=new Set(['flowers','gloves','memories','relatives','seasons','shoes','speakers','stars']);
const lowerBandWrong=new Set(['guilty','judge','lawyer','court','dead','death','die','military','political']);

for(let i=0;i<api.bands.length;i++){
  const band=api.bands[i];
  assert.strictEqual(band.band,i+1,`band index ${i} must map to band ${i+1}`);
  assert.deepStrictEqual(Array.from(band.grades),expectedGrades[i],`band ${band.band} grade mapping changed`);
  assert.strictEqual(band.words.length,500,`band ${band.band} must contain 500 F1-eligible words`);
  const local=new Set();
  for(const entry of band.words){
    assert.ok(Array.isArray(entry)&&entry.length===2,`band ${band.band} entry must preserve [en, th] schema`);
    const [en,th]=entry;
    assert.strictEqual(en,en.trim().toLowerCase(),`band ${band.band} English key must be normalized: ${en}`);
    assert.match(en,/^[a-z]{2,9}$/,`band ${band.band} has a word F1 cannot render: ${en}`);
    assert.ok(typeof th==='string'&&th===th.trim()&&/[\u0E00-\u0E7F]/.test(th),`band ${band.band} needs a clear Thai meaning: ${en}`);
    assert.doesNotMatch(th,/[,;/]/,`band ${band.band} Thai meaning must use one clear sense: ${en}=${th}`);
    assert.ok(!local.has(en),`band ${band.band} duplicates ${en}`);
    assert.ok(!globalWords.has(en),`English word ${en} appears in more than one F1 band`);
    assert.ok(!forbidden.has(en),`child-inappropriate F1 word leaked into band ${band.band}: ${en}`);
    assert.ok(!redundant.has(en),`redundant inflected duplicate leaked into band ${band.band}: ${en}`);
    if(band.band<=2) assert.ok(!lowerBandWrong.has(en),`word outside the primary-level F1 scope leaked into band ${band.band}: ${en}`);
    local.add(en);globalWords.add(en);
  }
  for(const grade of expectedGrades[i]) assert.strictEqual(api.band(grade).band,band.band,`${grade} must use F1 band ${band.band}`);
}
assert.strictEqual(globalWords.size,2500,'F1 vocabulary must contain 2,500 globally unique English words');
assert.strictEqual(api.band('ไม่ทราบชั้น').band,1,'unknown grades must fall back safely to the beginner band');

let seed=0x5f3759df;
function random(){seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/0x100000000;}
for(const band of api.bands){
  let done=[],recent=[],resets=0;
  const firstCycle=[];
  for(let step=0;step<1100;step++){
    const result=api.choose(band.words,done,recent,random);
    assert.ok(result.entry,`band ${band.band} picker returned no word at step ${step}`);
    if(result.resetDone){done=[];resets++;}
    const word=result.entry[0];
    assert.ok(!recent.includes(word),`band ${band.band} repeated ${word} inside the ${api.limit}-word cooldown`);
    if(firstCycle.length<500) firstCycle.push(word);
    done.push(word);
    recent.push(word);
    recent=recent.slice(-api.limit);
  }
  assert.strictEqual(new Set(firstCycle).size,500,`band ${band.band} must exhaust all 500 words before recycling`);
  assert.ok(resets>=2,`band ${band.band} simulation must exercise at least two safe pool resets`);
}

const pickStart=f1.indexOf('function pickWord(){');
const pickEnd=f1.indexOf('\nfunction spawnLetters()',pickStart);
const pick=f1.slice(pickStart,pickEnd);
assert.ok(pickStart>=0&&pickEnd>pickStart,'F1 pickWord function must exist');
assert.match(pick,/f1VocabForStudent\(\)/,'F1 must use the dedicated graded vocabulary');
assert.match(pick,/f1ChooseVocabWord\(/,'F1 must use the cooldown-aware picker');
assert.match(pick,/state\[RECENT_KEY\]/,'F1 must persist recent words across races');
assert.doesNotMatch(pick,/vocabForStudent\(\)/,'F1 must not fall back to the 80-word general pool');

const coreAt=html.indexOf('<script src="js/data/vocab.js"></script>');
const f1At=html.indexOf('<script src="js/data/f1_vocab.js"></script>');
assert.ok(coreAt>=0&&f1At>coreAt,'F1 vocabulary must load after the shared grade vocabulary');
assert.match(build,/'js\/data\/f1_vocab\.js'/,'pre-commit builds must include the new F1 vocabulary file');

console.log('PASS F1 vocab: 5 bands x 500, 2,500 global unique, schema/Thai/grade checks, 16-word cooldown and safe resets');
