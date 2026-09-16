"use strict";
// Offline browser regression for admin-only dark boards, dialogs, messages, and controls.
const fs=require('fs'),path=require('path'),http=require('http'),assert=require('assert');
const repo=path.resolve(process.env.VW_THEME_ROOT||'C:/Users/rober/english-pet-game');
const deps=path.join(require('os').homedir(),'.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules');
const {chromium}=require(path.join(deps,'playwright')),sharp=require(path.join(deps,'sharp'));
const out=process.env.VW_THEME_OUT||path.join(require('os').tmpdir(),'vocab-home-dark-surfaces');
fs.mkdirSync(out,{recursive:true});
const surfaces=['panel-box','levelup-box','settings-box','alert-box','attn-box','help-box','bill-box','fq-box','lbf-box','wsa-box','gift-pick-box','fcm-box','fnt-box','fdb-box','pi-box','ib-box','chat-box','dict-card','dmap-box','car-buy-box','photo-box','ph-crop-box','report-box','summary-box','food-box','home-shop-box','wl-box','mkt-buy-box','list-dialog','craft-box','db-card','rg-box','ad-box','onet-promo-card','racing-promo-card','kart-promo-card','vw2-online-modal-panel','vw2-pet-modal-panel'];
const html=`<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><link rel="stylesheet" href="/css/home-v2.css"><link rel="stylesheet" href="/css/home-dark-surfaces.css"><style>html,body{margin:0;width:100%;height:100%;overflow:hidden;font-family:Arial,sans-serif}.panel-overlay{display:grid!important;place-items:center!important;position:fixed!important;inset:0!important}.panel-box{width:min(720px,calc(100vw - 24px))!important;max-height:calc(100vh - 18px)!important;overflow:auto!important}.panel-head{padding:14px 16px}.panel-head h2{margin:0 0 3px}.panel-body{display:grid;grid-template-columns:1fr 1fr;gap:10px;padding:12px 16px 16px}.dmap-card,.chat-msgs{padding:12px;border:1px solid;border-radius:12px}.dmap-card p{margin:5px 0 0}.chat-mine{padding:9px 11px;border:1px solid;border-radius:10px}input,button{min-height:42px;border:1px solid;border-radius:10px;padding:8px 12px}.actions{display:flex;gap:8px}.probes{position:fixed;left:-20000px;top:0;visibility:hidden}@media(max-width:620px){.panel-body{grid-template-columns:1fr}}</style></head><body><div class="panel-overlay"><section class="panel-box"><header class="panel-head"><h2>ศูนย์ข้อความ</h2><small class="muted">ทุกกระดานใช้โทนดำเทาที่สบายตา</small></header><div class="panel-body"><article class="dmap-card"><strong>ข่าวสารวันนี้</strong><p class="desc">พื้นผิวเข้ม อ่านง่าย และลดแสงสะท้อน</p></article><div class="chat-msgs"><div class="chat-mine">ข้อความตัวอย่าง</div></div><input aria-label="ข้อความ" placeholder="พิมพ์ข้อความ"><div class="actions"><button>ปุ่มปกติ</button><button class="active">กำลังเปิด</button></div></div></section></div><div class="probes">${surfaces.map(x=>`<div class="${x}" data-probe="${x}"></div>`).join('')}</div></body></html>`;
const mime={'.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.webp':'image/webp','.svg':'image/svg+xml'};
const server=http.createServer((req,res)=>{
  const pathname=decodeURIComponent(new URL(req.url,'http://local').pathname);
  if(pathname==='/__dark_fixture.html'){res.writeHead(200,{'content-type':'text/html; charset=utf-8'}).end(html);return;}
  const file=path.resolve(repo,'.'+pathname);
  if(!file.startsWith(repo+path.sep)){res.writeHead(403).end();return;}
  fs.readFile(file,(err,data)=>{res.writeHead(err?404:200,{'content-type':mime[path.extname(file)]||'application/octet-stream','cache-control':'no-store'});res.end(err?'missing':data)});
});
const checks=[];
function ok(name,value){assert.ok(value,name);checks.push(name);console.log('PASS '+name)}
function sourceChecks(){
  const index=fs.readFileSync(path.join(repo,'index_classic.html'),'utf8');
  const css=fs.readFileSync(path.join(repo,'css/home-dark-surfaces.css'),'utf8');
  const daily=index.search(/css\/dailybox(?:\.[a-f0-9]+)?\.css/),dark=index.search(/css\/home-dark-surfaces(?:\.[a-f0-9]+)?\.css/); ok('dark surface stylesheet loads after daily box styles',daily>=0&&dark>daily);
  ok('dark surface rules stay admin theme scoped',!css.includes(':root')&&(css.match(/html\.theme-noir/g)||[]).length>=12);
  ok('dark surface layer includes every registered board class',surfaces.every(name=>css.includes('.'+name)));
}
(async()=>{
  sourceChecks();await new Promise(r=>server.listen(0,'127.0.0.1',r));
  const browser=await chromium.launch({channel:'msedge',headless:true});
  try{
    const page=await browser.newPage({viewport:{width:812,height:375}}),errors=[];page.on('pageerror',e=>errors.push(e.message));
    await page.goto(`http://127.0.0.1:${server.address().port}/__dark_fixture.html`,{waitUntil:'networkidle'});
    const unscoped=await page.locator('.panel-overlay > .panel-box').evaluate(e=>getComputedStyle(e).backgroundImage);
    ok('public theme does not receive dark surface styling',unscoped==='none');
    await page.evaluate(()=>document.documentElement.classList.add('theme-noir'));
    const audit=await page.evaluate(()=>{
      const lum=c=>{const rgb=(c.match(/[\d.]+/g)||[]).slice(0,3).map(Number);if(rgb.length<3)return null;return rgb.map(v=>v/255).map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4).reduce((s,v,i)=>s+v*[.2126,.7152,.0722][i],0)};
      const colors=css=>[css.backgroundColor,...[...css.backgroundImage.matchAll(/rgba?\(([^)]+)\)/g)].map(m=>'rgb('+m[1]+')')].map(lum).filter(v=>v!==null);
      const contrast=(a,b)=>(Math.max(a,b)+.05)/(Math.min(a,b)+.05);
      const surfaceResults=[...document.querySelectorAll('[data-probe]')].map(e=>{const css=getComputedStyle(e),sample=colors(css);return {name:e.dataset.probe,dark:sample.slice(-2).every(v=>v<.09)}});
      const inactive=getComputedStyle(document.querySelector('button:not(.active)')),active=getComputedStyle(document.querySelector('button.active')),input=getComputedStyle(document.querySelector('input')),message=getComputedStyle(document.querySelector('.chat-mine'));
      const activeText=lum(active.color),activeStops=colors(active).slice(-3);
      return {surfaceResults,inactiveDark:colors(inactive).slice(-2).every(v=>v<.1),activeGold:active.backgroundImage.includes('linear-gradient')&&activeStops.length>=2&&activeStops.every(bg=>contrast(activeText,bg)>=4.5),inputDark:colors(input).some(v=>v<.02),messageDark:colors(message).some(v=>v<.06),noOverflow:document.documentElement.scrollWidth<=innerWidth+1&&document.documentElement.scrollHeight<=innerHeight+1};
    });
    ok('all registered boards and dialog surfaces are dark',audit.surfaceResults.every(x=>x.dark));
    ok('ordinary dialog buttons remain graphite',audit.inactiveDark);
    ok('only selected dialog controls use readable muted gold',audit.activeGold);
    ok('message bubbles and fields use dark neutral surfaces',audit.inputDark&&audit.messageDark);
    ok('dark board layout fits 812x375',audit.noOverflow);
    ok('no browser runtime errors',errors.length===0);
    const raw=await page.screenshot({animations:'disabled'});await sharp(raw).webp({quality:90,effort:6}).toFile(path.join(out,'admin-dark-surfaces-812x375.webp'));
    fs.writeFileSync(path.join(out,'dark-surface-checks.json'),JSON.stringify({passed:checks.length,checks,errors},null,2));
    console.log(JSON.stringify({passed:checks.length,out}));
  }finally{await browser.close();server.close()}
})().catch(e=>{console.error(e);process.exitCode=1});
