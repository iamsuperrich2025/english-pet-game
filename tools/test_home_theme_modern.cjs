"use strict";
// Offline browser regression for the admin-only graphite/yellow Home skin.
const fs=require('fs'),path=require('path'),http=require('http'),assert=require('assert');
const repo=path.resolve(process.env.VW_THEME_ROOT||path.join(__dirname,'..'));
const deps=path.join(require('os').homedir(),'.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules');
const {chromium}=require(path.join(deps,'playwright')),sharp=require(path.join(deps,'sharp'));
const out=process.env.VW_THEME_OUT||path.join(require('os').tmpdir(),'vocab-home-theme-modern');
fs.mkdirSync(out,{recursive:true});
const mime={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json','.webp':'image/webp','.svg':'image/svg+xml','.png':'image/png'};
const server=http.createServer((req,res)=>{
  const file=path.resolve(repo,'.'+decodeURIComponent(new URL(req.url,'http://local').pathname));
  if(!file.startsWith(repo+path.sep)){res.writeHead(403).end();return;}
  fs.readFile(file,(err,data)=>{res.writeHead(err?404:200,{'content-type':mime[path.extname(file)]||'application/octet-stream','cache-control':'no-store'});res.end(err?'missing':data)});
});
const checks=[];
function ok(name,value){assert.ok(value,name);checks.push(name);console.log('PASS '+name);}
async function fixture(page){
  await page.route('https://**/*',r=>r.abort());
  await page.goto(`http://127.0.0.1:${server.address().port}/index_classic.html`,{waitUntil:'domcontentloaded'});
  await page.waitForFunction(()=>typeof HomeTheme!=='undefined'&&typeof renderDashboard==='function');
  await page.waitForTimeout(1800);
  await page.evaluate(async()=>{
    window.authFetchCloud=()=>Promise.resolve(null);window.authWriteCloud=()=>Promise.resolve();window.authWriteProfileName=()=>Promise.resolve();window.onlineStart=()=>{};
    window.authShowLogin=()=>{};window.authGateOffline=()=>{};
    window.kartPromoMaybeShow=()=>{};window.onetPromoMaybeShow=()=>{};window.racingPromoMaybeShow=()=>{};
    Auth.user={uid:'theme-test',email:'freddommun@gmail.com'};Auth.booted=true;Auth.gated=true;
    state.student={name:'admin',grade:'ป.1'};state.profileName='admin';state.coins=16366726;state.profAv='blk1';
    state.pets=[newPet('dragon','มังกรเล่นไฟ')];Object.assign(state.pets[0],{level:3,fedUpTo:Date.now()+86400000,fullness:100,sick:false});
    state.home='medium';state.musicOff=true;state.soundOff=true;
    document.querySelectorAll('#consent-gate,#auth-gate').forEach(e=>e.remove());
    await probeImages(['dragon_adult_normal','dragon_adult_happy','dragon_adult_hungry']);
    renderDashboard();showScreen('screen-dashboard');HomeTheme.set('noir');
  });
  await page.waitForSelector('#vw2-pet.has-owned-pet');
  await page.waitForTimeout(2200);
  await dismissAnnouncements(page);
}
async function dismissAnnouncements(page){
  await page.evaluate(()=>document.querySelectorAll('#lc-announce,.db-overlay,.rankup-overlay,.toast,.onet-promo-overlay,.racing-promo-overlay,.kart-promo-overlay').forEach(e=>e.remove()));
}
async function capture(page,name){
  const raw=await page.screenshot({animations:'disabled'});
  await sharp(raw).webp({quality:90,effort:6}).toFile(path.join(out,name+'.webp'));
}
async function inspect(page,width,height){
  await page.setViewportSize({width,height});await page.waitForTimeout(400);await dismissAnnouncements(page);
  const m=await page.evaluate(()=>{
    const root=document.getElementById('vw-home-v2-root'),get=s=>root.querySelector(s),style=s=>getComputedStyle(get(s));
    const inside=(el,parent)=>{const a=el.getBoundingClientRect(),b=parent.getBoundingClientRect();return a.left>=b.left-1&&a.right<=b.right+1&&a.top>=b.top-1&&a.bottom<=b.bottom+1};
    const bounds=['.vw2-top','.vw2-left','.vw2-feed','.vw2-feature-stage','.vw2-right','.vw2-bottom'].every(s=>inside(get(s),root));
    const lum=c=>{const rgb=c.match(/[\d.]+/g).slice(0,3).map(v=>+v/255).map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4);return rgb[0]*.2126+rgb[1]*.7152+rgb[2]*.0722};
    const contrast=(a,b)=>{const x=lum(a),y=lum(b);return (Math.max(x,y)+.05)/(Math.min(x,y)+.05)};
    return {bounds,noPageOverflow:document.documentElement.scrollWidth<=innerWidth+1&&document.documentElement.scrollHeight<=innerHeight+1,
      headers:['.vw2-feed','.vw2-mission','.vw2-online'].every(s=>inside(get(s+' .vw2-section-head'),get(s))),
      contrast:contrast(style('.vw2-section-head strong').color,style('.vw2-feed').backgroundColor),
      primaryContrast:contrast(style('.vw2-feature-action-track>button').color,style('.vw2-feature-action-track>button').backgroundColor),
      flat:style('.vw2-mode').backgroundImage==='none'&&getComputedStyle(get('.vw2-mode'),'::before').display==='none'&&getComputedStyle(get('.vw2-feature-action-track>button'),'::before').display==='none',
      yellow:style('.vw2-feature-action-track>button').backgroundColor==='rgb(245, 207, 66)',
      pet:get('#vw2-pet img').complete&&get('#vw2-pet img').naturalWidth>0&&style('#vw2-pet img').filter==='none',
      row:get('.vw2-feature-action-scroll').scrollHeight<=get('.vw2-feature-action-scroll').clientHeight+1,
      scene:style('.vw2-world-scene').display,frame:getComputedStyle(root,'::before').display};
  });
  const prefix=`${width}x${height}`;
  ok(prefix+' panels stay in the viewport',m.bounds&&m.noPageOverflow);
  ok(prefix+' headers fit their panels',m.headers);
  ok(prefix+' labels and primary action have AA contrast',m.contrast>=4.5&&m.primaryContrast>=4.5);
  ok(prefix+' buttons use flat graphite/yellow skin',m.flat&&m.yellow);
  ok(prefix+' loaded pet stays in full color',m.pet);
  ok(prefix+' pet action row has no vertical clipping',m.row);
  ok(prefix+' ornamental frame and scenery are removed',m.frame==='none'&&m.scene==='none');
  await capture(page,`admin-theme-${prefix}`);
}
async function openSettingsUI(page){
  await page.locator('[data-vw2-action="settings"]').click();
  if(await page.locator('.attn-overlay').count()){
    await page.locator('.attn-overlay .set-close').click();
    await page.locator('[data-vw2-action="settings"]').click();
  }
}
(async()=>{
  await new Promise(r=>server.listen(0,'127.0.0.1',r));
  const browser=await chromium.launch({channel:'msedge',headless:true});
  try{
    const page=await browser.newPage({viewport:{width:1367,height:617}}),errors=[];
    page.on('pageerror',e=>errors.push(e.message));await fixture(page);
    for(const [w,h] of [[1367,617],[1366,768],[812,375]])await inspect(page,w,h);
    await openSettingsUI(page);
    await page.locator('.settings-box').waitFor({state:'visible'});
    ok('admin sees the theme picker',await page.locator('#set-theme [data-theme="noir"]').isVisible());
    await page.locator('#set-theme [data-theme="pastel"]').click();
    ok('admin can switch back to pastel',await page.evaluate(()=>!document.documentElement.classList.contains('theme-noir')));
    await page.locator('#set-theme [data-theme="noir"]').click();
    ok('picker applies noir and marks selection',await page.locator('#set-theme [data-theme="noir"]').getAttribute('aria-checked')==='true');
    ok('compact settings fit the viewport',await page.locator('.settings-box').evaluate(e=>{const r=e.getBoundingClientRect();return r.top>=-1&&r.bottom<=innerHeight+1&&e.scrollHeight<=e.clientHeight+1}));
    await page.locator('.set-close').click();
    await page.evaluate(()=>{Auth.user={uid:'ordinary-player',email:'ordinary@test.local'};state.adminAccess=true;HomeTheme.paint();});
    ok('stored admin skin cannot leak to an ordinary account',await page.evaluate(()=>HomeTheme.get()==='pastel'&&HomeTheme.list().length===1&&![document.documentElement,document.body,document.getElementById('vw-home-v2-root')].some(e=>e.classList.contains('theme-noir'))));
    ok('direct paint/set cannot bypass the real admin check',await page.evaluate(()=>HomeTheme.paint('noir')==='pastel'&&HomeTheme.set('noir')==='pastel'));
    await openSettingsUI(page);
    ok('ordinary account has no theme picker',await page.locator('#set-theme').count()===0);
    await page.locator('.set-close').click();
    ok('public buttons and scenic art restore automatically',await page.evaluate(()=>{const r=document.getElementById('vw-home-v2-root');return getComputedStyle(r.querySelector('.vw2-mode')).backgroundImage.includes('gradient')&&getComputedStyle(r.querySelector('.vw2-world-scene')).display!=='none'}));
    await capture(page,'public-theme-812x375');
    await page.evaluate(()=>{Auth.user={uid:'theme-test',email:'freddommun@gmail.com'};HomeTheme.set('noir');Auth.user=null;HomeTheme.paint();});
    ok('logout clears admin skin',await page.evaluate(()=>!document.documentElement.classList.contains('theme-noir')));
    ok('no browser runtime errors',errors.length===0);
    await page.evaluate(()=>{localStorage.removeItem('petVocabAdventure_v1');localStorage.removeItem('vwHomeTheme')});
    fs.writeFileSync(path.join(out,'theme-checks.json'),JSON.stringify({passed:checks.length,checks,errors},null,2));
    console.log(JSON.stringify({passed:checks.length,out}));
  }finally{await browser.close();server.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
