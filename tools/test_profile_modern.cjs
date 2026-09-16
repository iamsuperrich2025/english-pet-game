"use strict";
const fs = require("fs");
const path = require("path");
const http = require("http");
const assert = require("assert");
const repo = path.resolve(__dirname, "..");
const deps = path.join(require("os").homedir(), ".cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules");
const {chromium} = require(path.join(deps, "playwright"));
const sharp = require(path.join(deps, "sharp"));
const out = process.env.VW_PROFILE_OUT || path.join(require("os").tmpdir(), "vocab-profile-modern");
fs.mkdirSync(out, {recursive:true});
const mime = {".html":"text/html; charset=utf-8",".js":"text/javascript; charset=utf-8",".css":"text/css; charset=utf-8",".json":"application/json",".webp":"image/webp",".png":"image/png",".jpg":"image/jpeg",".svg":"image/svg+xml",".woff2":"font/woff2"};
const server = http.createServer((req,res)=>{
  let rel = decodeURIComponent(new URL(req.url,"http://x").pathname).replace(/^\/+/,"") || "index_classic.html";
  const file = path.resolve(repo, rel);
  if(!file.startsWith(repo + path.sep)){ res.writeHead(403).end(); return; }
  fs.readFile(file,(err,data)=>{
    if(err){ res.writeHead(404,{"content-type":"text/plain"}).end("not found"); return; }
    res.writeHead(200,{"content-type":mime[path.extname(file).toLowerCase()]||"application/octet-stream","cache-control":"no-store"});res.end(data);
  });
});
const checks=[];
const ok=(name,value)=>{ assert.ok(value,name); checks.push(name); console.log("PASS " + name); };
async function openProfile(page){
  await page.route("https://**/*", route=>route.abort());
  await page.goto(`http://127.0.0.1:${server.address().port}/index_classic.html?profile-modern-test=1`,{waitUntil:"domcontentloaded",timeout:60000});
  await page.waitForFunction(()=>typeof showPlayerCard==="function" && typeof newPet==="function" && typeof localProfileAssetCounts==="function",null,{timeout:60000});
  return page.evaluate(()=>{
    Auth.user={uid:"profile-modern-test",email:"profile@test.local"};
    const consent=document.getElementById("consent-gate");
    if(consent) consent.style.display="none";
    state.student={name:"admin",grade:"ป.6"}; state.profileName="admin"; state.coins=16366240;
    state.profAv="blk1"; state.blockAv="blk1"; state.playerAvatar="male";
    state.pets=Object.keys(PETS).map((type,i)=>{ const p=newPet(type,"น้อง "+(i+1)); p.level=(i%3)+1; p.exp=i*12; return p; });
    state.home="medium"; state.ac=true; state.phone=true; state.computer=true;
    state.petPantry=Object.assign({},state.petPantry||{},{shelfId:"large"});
    state.owned=ITEMS.slice(0,Math.min(12,ITEMS.length)).map(x=>x.id);
    state.robots=ROBOTS.slice(0,7).map(x=>x.id);
    state.cars=CARS.slice(0,7).map(x=>({id:x.id,insured:true,loan:null}));
    state.farm=FRUITS.flatMap((x,i)=>Array.from({length:i+1},()=>({id:x.id,plantedAt:Date.now()})));
    state.collection=COLLECTIBLES.slice(0,46).map(x=>x.id);
    state.listings=COLLECTIBLES.slice(0,6).map((x,i)=>({id:x.id,price:x.price,at:Date.now()+i}));
    state.feedShare=Object.assign({},state.feedShare||{},{assets:false});
    const homeProfile=document.querySelector('[data-vw2-action="profile"]');
    if(homeProfile){
      homeProfile.dispatchEvent(new MouseEvent("click",{bubbles:true,cancelable:true,view:window}));
    }else{
      showPlayerCard(Auth.user.uid,"admin","ป.6");
    }
    return {pets:state.pets.length, assets:Object.values(localProfileAssetCounts()).reduce((a,b)=>a+b,0),
      homeRoute:!!homeProfile, renderedUid:document.querySelector('.pl-card.pl-wide') ? Auth.user.uid : ''};
  });
}
async function inspect(page, expected, width, height){
  await page.waitForSelector("link[data-profile-modern]",{state:"attached"});
  await page.waitForFunction(n=>document.querySelectorAll(".pl-pet").length===n,expected.pets);
  await page.waitForFunction(()=>document.querySelectorAll(".pl-asset").length>20);
  await page.waitForTimeout(350);
  const info=await page.evaluate(()=>{
    const rect=e=>{const r=e.getBoundingClientRect();return {x:r.x,y:r.y,width:r.width,height:r.height,right:r.right,bottom:r.bottom}};
    const card=document.querySelector(".pl-card.pl-wide"), body=document.querySelector(".pl-body"), panel=document.querySelector(".pl-collection-panel"), assets=document.querySelector(".pl-assets"), pets=document.querySelector(".pl-pets");
    return {
      card:rect(card),body:rect(body),panel:rect(panel),assets:rect(assets),pets:rect(pets),
      bodyOverflow:body.scrollHeight-body.clientHeight,panelOverflow:panel.scrollHeight-panel.clientHeight,
      petCards:document.querySelectorAll(".pl-pet").length,assetCards:document.querySelectorAll(".pl-asset").length,
      assetQty:document.querySelector("[data-pl-asset-count]").textContent,petQty:document.querySelector("[data-pl-pet-count]").textContent,
      categoryText:Array.from(document.querySelectorAll(".pl-asset-cat")).map(x=>x.textContent),
      assetScroll:assets.scrollWidth-assets.clientWidth,petScroll:pets.scrollWidth-pets.clientWidth,
      styleLoaded:getComputedStyle(card).getPropertyValue("--pl-gold").trim(),
      tabTotal:document.querySelector("[data-pl-total]").textContent
    };
  });
  ok(`${width}x${height} profile fills viewport`,Math.abs(info.card.width-width)<=1&&Math.abs(info.card.height-height)<=1&&info.card.x===0&&info.card.y===0);
  ok(`${width}x${height} profile shell has no vertical overflow`,info.bodyOverflow<=1&&info.panelOverflow<=1&&info.card.bottom<=height+1);
  ok(`${width}x${height} Home V2 opens the owner's complete profile`,expected.homeRoute&&expected.renderedUid==="profile-modern-test");
  ok(`${width}x${height} every owned pet is rendered`,info.petCards===expected.pets&&info.petQty.includes(String(expected.pets)));
  ok(`${width}x${height} complete local asset quantity is reported`,info.assetQty.replace(/\D/g,"")==String(expected.assets));
  ok(`${width}x${height} all durable asset categories are represented`,["บ้านและความสบาย","เทคโนโลยี","รถและหุ่นรบ","แฟชั่นน้อง","สวนผลไม้","ของสะสม"].every(x=>info.categoryText.includes(x)));
  ok(`${width}x${height} long collections stay reachable horizontally`,info.assetScroll>20&&info.petScroll>=0);
  ok(`${width}x${height} modern stylesheet is active`,info.styleLoaded==="#d9bd78"&&Number(info.tabTotal.replace(/,/g,""))===expected.assets+expected.pets);
  await page.click('[data-pl-tab="honors"]');
  ok(`${width}x${height} honors tab switches without moving shell`,await page.locator('[data-pl-panel="honors"]').evaluate(e=>e.classList.contains("active")&&e.getBoundingClientRect().bottom<=innerHeight+1));
  await page.click('[data-pl-tab="story"]');
  ok(`${width}x${height} story tab switches without moving shell`,await page.locator('[data-pl-panel="story"]').evaluate(e=>e.classList.contains("active")&&e.getBoundingClientRect().bottom<=innerHeight+1));
  await page.click('[data-pl-tab="collection"]');
  const png=await page.screenshot({animations:"disabled"});
  await sharp(png).webp({quality:92,smartSubsample:true}).toFile(path.join(out,`profile-${width}x${height}.webp`));
}
(async()=>{
  await new Promise(resolve=>server.listen(0,"127.0.0.1",resolve));
  const browser=await chromium.launch({channel:"msedge",headless:true,args:["--disable-background-timer-throttling","--disable-renderer-backgrounding"]});
  try{
    for(const [width,height] of [[1366,768],[1367,617],[812,375]]){
      const context=await browser.newContext({viewport:{width,height},hasTouch:true});
      const page=await context.newPage(), errors=[];
      page.on("pageerror",e=>errors.push(e.message));
      const expected=await openProfile(page);
      await inspect(page,expected,width,height);
      ok(`${width}x${height} has no runtime errors`,errors.length===0);
      await context.close();
    }
    fs.writeFileSync(path.join(out,"profile-test.json"),JSON.stringify({passed:checks.length,checks},null,2));
    console.log(JSON.stringify({passed:checks.length,out}));
  }finally{await browser.close();server.close();}
})().catch(err=>{console.error(err);process.exitCode=1;});
