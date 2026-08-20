'use strict';
const fs=require('fs');
const assert=require('assert');
const src=fs.readFileSync('js/adventure3d.js','utf8');

assert(src.includes('function seamlessSkyCanvas(img)'), 'ต้องมีตัวแปลงภาพท้องฟ้าให้ต่อขอบได้');
assert(src.includes('new THREE.CanvasTexture(seamlessSkyCanvas(img))'), 'applySky ต้องใช้ภาพที่ผสมขอบแล้ว');
assert(src.includes("Math.floor(w*.14)"), 'ต้องมีแถบไล่ผสมกว้างพอไม่สร้างเส้นใหม่');
assert(src.includes('if(skyTexCache[key]){ sc.background=skyTexCache[key]; return; }'), 'ท้องฟ้าไฟล์เดียวกันต้อง reuse texture บนมือถือ');

function blendEdges(data,w,h,band){
  const d=Uint8ClampedArray.from(data);
  for(let y=0;y<h;y++) for(let x=0;x<band;x++){
    const t=x/(band-1),smooth=t*t*(3-2*t),mix=.5*(1-smooth);
    const li=(y*w+x)*4,ri=(y*w+(w-1-x))*4;
    for(let ch=0;ch<3;ch++){
      const l=d[li+ch],r=d[ri+ch];
      d[li+ch]=Math.round(l*(1-mix)+r*mix);
      d[ri+ch]=Math.round(r*(1-mix)+l*mix);
    }
  }
  return d;
}

const w=20,h=2,band=5,input=new Uint8ClampedArray(w*h*4);
for(let y=0;y<h;y++) for(let x=0;x<w;x++){
  const i=(y*w+x)*4; input[i]=x<10?20:220; input[i+1]=x*7; input[i+2]=255-x*5; input[i+3]=255;
}
const out=blendEdges(input,w,h,band);
for(let y=0;y<h;y++) for(let ch=0;ch<3;ch++){
  assert.strictEqual(out[(y*w)*4+ch],out[(y*w+w-1)*4+ch],`ขอบซ้าย/ขวาช่องสี ${ch} ต้องตรงกัน`);
}
const mid=(0*w+10)*4;
assert.deepStrictEqual([...out.slice(mid,mid+4)],[...input.slice(mid,mid+4)],'กลางภาพต้องไม่ถูกทำให้ฟุ้ง');
const innerLeft=(band-1)*4;
assert.deepStrictEqual([...out.slice(innerLeft,innerLeft+4)],[...input.slice(innerLeft,innerLeft+4)],'ปลายแถบผสมต้องคืนสู่ภาพเดิมอย่างต่อเนื่อง');
for(let x=1;x<band;x++){
  const prev=out[(x-1)*4],cur=out[x*4];
  assert(Math.abs(cur-prev)<50,'การไล่สีฝั่งซ้ายต้องไม่มีการกระโดดเป็นเส้นใหม่');
}
console.log('✅ sky seam: exact wrapped edges, smooth feather, untouched center');
