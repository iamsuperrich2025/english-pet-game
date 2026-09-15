'use strict';
const assert=require('assert');
const fs=require('fs');
const http=require('http');
const path=require('path');
const deps='C:/Users/rober/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules';
const {chromium}=require(path.join(deps,'playwright'));
const sharp=require(path.join(deps,'sharp'));
const ROOT=path.resolve(process.env.VW_GUIDE_ROOT || path.join(__dirname,'..'));
const OUT=process.env.VW_GUIDE_OUTPUT || path.join(require('os').tmpdir(),'vw-guide-1489');
const types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json','.svg':'image/svg+xml','.webp':'image/webp','.avif':'image/avif','.woff2':'font/woff2','.mp3':'audio/mpeg'};
const server=http.createServer((req,res)=>{
  const pathname=decodeURIComponent(new URL(req.url,'http://127.0.0.1').pathname);
  const file=path.resolve(ROOT,'.'+pathname);
  if(!file.toLowerCase().startsWith(ROOT.toLowerCase()+path.sep)){res.writeHead(403);res.end();return;}
  fs.stat(file,(err,stat)=>{
    if(err||!stat.isFile()){res.writeHead(404);res.end();return;}
    res.writeHead(200,{'content-type':types[path.extname(file).toLowerCase()]||'application/octet-stream','cache-control':'no-store'});
    fs.createReadStream(file).pipe(res);
  });
});
const rect=o=>({left:o.left,top:o.top,right:o.right,bottom:o.bottom,width:o.width,height:o.height});
(async()=>{
  await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
  fs.mkdirSync(OUT,{recursive:true});
  const browser=await chromium.launch({channel:'msedge',headless:true});
  try{
    const page=await browser.newPage({viewport:{width:812,height:375},hasTouch:true});
    page.setDefaultTimeout(5000);
    await page.route('**/*',route=>{
      const url=new URL(route.request().url());
      if(url.hostname==='127.0.0.1') return route.continue();
      return route.abort();
    });
    await page.goto(`http://127.0.0.1:${server.address().port}/index_classic.html`,{waitUntil:'domcontentloaded'});
    await page.waitForFunction(()=>typeof openHelp==='function'&&document.querySelector('[data-vw2-action="help"]'));
    await page.evaluate(()=>{
      document.querySelectorAll('.screen').forEach(el=>el.classList.remove('active'));
      const dash=document.getElementById('screen-dashboard');
      const home=document.getElementById('vw-home-v2-root');
      dash.classList.add('active','vw2-active');
      home.hidden=false;
      document.body.classList.add('vw2-home-active');
      const consent=document.getElementById('consent-gate');
      if(consent){consent.hidden=true;consent.style.display='none';}
    });
    await page.waitForTimeout(120);
    const button=await page.locator('[data-vw2-action="help"]').evaluate(el=>{
      const label=el.querySelector('b'),r=el.getBoundingClientRect(),lr=label.getBoundingClientRect();
      return {text:label.textContent.trim(),r:{left:r.left,top:r.top,right:r.right,bottom:r.bottom,width:r.width,height:r.height},label:{width:lr.width,height:lr.height,scrollWidth:label.scrollWidth,scrollHeight:label.scrollHeight,clientWidth:label.clientWidth,clientHeight:label.clientHeight}};
    });
    assert.equal(button.text,'คู่มือการเล่น');
    assert(button.r.left>=0&&button.r.top>=0&&button.r.right<=812&&button.r.bottom<=375,JSON.stringify(button));
    assert(button.label.scrollWidth<=button.label.clientWidth+1&&button.label.scrollHeight<=button.label.clientHeight+1,'guide button label clips '+JSON.stringify(button.label));
    await sharp(await page.screenshot()).webp({quality:92}).toFile(path.join(OUT,'lobby-help-button-812x375.webp'));
    await page.evaluate(()=>openHelp());
    await page.waitForSelector('.help-guide-box');
    await page.waitForTimeout(650);
    const all=[];
    for(const size of [{width:812,height:375},{width:1366,height:768},{width:390,height:844}]){
      await page.setViewportSize(size);
      await page.waitForTimeout(80);
      for(let i=0;i<10;i++){
        await page.evaluate(i=>document.querySelector(`[data-help-page="${i}"]`).click(),i);
        const fit=await page.evaluate(({width,height,i})=>{
          const box=document.querySelector('.help-guide-box'),body=box.querySelector('.help-body');
          const elems=[box,box.querySelector('.help-guide-tabs'),box.querySelector('.help-guide-page'),body,box.querySelector('.help-guide-foot'),...box.querySelectorAll('.help-item')];
          const info=elems.map(el=>{const r=el.getBoundingClientRect();return {className:el.className,left:r.left,top:r.top,right:r.right,bottom:r.bottom,scrollWidth:el.scrollWidth,clientWidth:el.clientWidth,scrollHeight:el.scrollHeight,clientHeight:el.clientHeight};});
          return {width,height,page:i+1,title:box.querySelector('h3').textContent.trim(),info,document:{scrollWidth:document.documentElement.scrollWidth,clientWidth:document.documentElement.clientWidth,scrollHeight:document.documentElement.scrollHeight,clientHeight:document.documentElement.clientHeight}};
        },{...size,i});
        const offenders=fit.info.filter(x=>x.left<-.5||x.top<-.5||x.right>size.width+.5||x.bottom>size.height+.5||x.scrollWidth>x.clientWidth+1||x.scrollHeight>x.clientHeight+1);
        assert.equal(offenders.length,0,JSON.stringify({...fit,offenders}));
        assert(fit.document.scrollWidth<=fit.document.clientWidth+1&&fit.document.scrollHeight<=fit.document.clientHeight+1,'document scrolls '+JSON.stringify(fit));
        all.push({size:`${size.width}x${size.height}`,page:i+1,title:fit.title});
      }
      if(size.width===812||size.width===390){
        await page.evaluate(()=>document.querySelector('[data-help-page="3"]').click());
        await sharp(await page.screenshot()).webp({quality:92}).toFile(path.join(OUT,`guide-shelter-${size.width}x${size.height}.webp`));
      }
    }
    assert.equal(await page.locator('.help-guide-tab').count(),10);
    assert.equal(await page.locator('.help-item').count(),2);
    console.log(JSON.stringify({button,pagesChecked:all.length,sizes:[...new Set(all.map(x=>x.size))],screenshots:OUT},null,2));
  }finally{
    await browser.close();
    server.close();
  }
})().catch(error=>{console.error(error);process.exitCode=1;});
