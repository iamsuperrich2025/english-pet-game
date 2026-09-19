"use strict";
/* Vocabulary data lives here, not inside combat. */
(function(root){
  const VF = root.VocabForce = root.VocabForce || {};
  const SAMPLE = [
    {w: 'APPLE', th: 'แอปเปิล'},
    {w: 'BRAVE', th: 'กล้าหาญ'},
    {w: 'LIGHT', th: 'แสง'},
    {w: 'STORM', th: 'พายุ'},
    {w: 'HEART', th: 'หัวใจ'},
    {w: 'MUSIC', th: 'ดนตรี'},
    {w: 'DREAM', th: 'ความฝัน'},
    {w: 'PEACE', th: 'สันติภาพ'}
  ];
  const ALPHA = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

  function normalize(pair){
    const w = String(pair && (pair.w || pair[0]) || '').toUpperCase().replace(/[^A-Z]/g, '');
    const th = String(pair && (pair.th || pair[1]) || '');
    return {w: w, th: th};
  }

  function fromStudent(){
    if(typeof vocabForStudent !== 'function') return [];
    try{
      return vocabForStudent().map(normalize).filter(function(p){
        return p.w.length >= 3 && p.w.length <= 10;
      });
    }catch(_){ return []; }
  }

  function shuffle(arr){
    const a = arr.slice();
    for(let i = a.length - 1; i > 0; i--){
      const j = (Math.random() * (i + 1)) | 0;
      const t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  VF.WordList = {
    SAMPLE: SAMPLE,
    pool: function(){
      const seen = new Set();
      const out = [];
      const student = fromStudent();
      const src = student.length ? student : SAMPLE.map(normalize);
      src.forEach(function(p){
        if(!p.w || seen.has(p.w)) return;
        seen.add(p.w); out.push(p);
      });
      return out.length ? out : SAMPLE.slice();
    },
    next: function(except){
      const list = shuffle(this.pool());
      return list.find(function(p){ return p.w !== except; }) || list[0] || SAMPLE[0];
    },
    encounterLetters: function(word, extra){
      const need = String(word || 'APPLE').toUpperCase().replace(/[^A-Z]/g, '').split('');
      const distract = [];
      extra = extra == null ? 0 : extra;
      while(distract.length < extra){
        const ch = ALPHA[(Math.random() * 26) | 0];
        if(need.indexOf(ch) === 0 && distract.length === 0) continue;
        distract.push(ch);
      }
      return shuffle(need.concat(distract));
    }
  };
  VF._t.wordList = VF.WordList;
})(typeof window !== 'undefined' ? window : globalThis);
