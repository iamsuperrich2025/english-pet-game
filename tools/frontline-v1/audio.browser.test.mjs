/* Gesture-gated Frontline BGM: one hashed format, Cache Storage reuse, no original master. */
import assert from 'node:assert/strict';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import {createRequire} from 'node:module';
import {fileURLToPath} from 'node:url';
const require=createRequire(import.meta.url);
let chromium;
try{({chromium}=require(process.env.FRONTLINE_PLAYWRIGHT||'playwright'));}
catch(error){console.log('SKIP audio.browser.test.mjs: Playwright is not installed');process.exit(0);}
const dir=path.dirname(fileURLToPath(import.meta.url));
const root=path.resolve(dir,'../..');
const html=`<!doctype html><meta charset="utf-8"><button id="enter">join</button>
<script>window.Frontline={};window.media=[];const Base=window.Audio;window.Audio=function(...a){const el=new Base(...a);media.push(el);return el;};</script>
<script src="/frontline/frontline-synth.js"></script>
<script src="/frontline/frontline-score.js"></script>
<script src="/frontline/frontline-audio.js"></script>
<script>document.getElementById('enter').onclick=()=>{window.fl=Frontline.makeAudio();fl.start();};</script>`;
const mime={'.js':'text/javascript','.ogg':'audio/ogg','.mp3':'audio/mpeg'};
const server=http.createServer((req,res)=>{
  const p=new URL(req.url,'http://127.0.0.1').pathname;
  if(p==='/'||p==='/test'){
    res.writeHead(200,{'Content-Type':'text/html','Content-Security-Policy':"default-src 'self'; media-src 'self' blob:; script-src 'self' 'unsafe-inline'"});
    return res.end(html);
  }
  if(/Arcade_Adventure/.test(p)){res.writeHead(404);return res.end();}
  const file=p.startsWith('/frontline/')?path.join(dir,path.basename(p)):path.join(root,...p.slice(1).split('/'));
  if(!fs.existsSync(file)){res.writeHead(404);return res.end();}
  res.setHeader('Content-Type',mime[path.extname(file)]||'application/octet-stream');
  fs.createReadStream(file).pipe(res);
});
await new Promise(r=>server.listen(0,'127.0.0.1',r));
const origin='http://127.0.0.1:'+server.address().port;
const browser=await chromium.launch({channel:'msedge',headless:true}).catch(()=>chromium.launch({headless:true}));
try{
  const page=await browser.newPage();
  const urls=[];
  page.on('request',r=>{if(/sound\/Frontline\//.test(r.url()))urls.push(r.url());});
  await page.goto(origin+'/test');
  await page.waitForTimeout(300);
  assert.equal(urls.length,0);
  await page.click('#enter');
  await page.waitForFunction(()=>window.fl&&fl.inspect().musicPlaying&&media[0]&&media[0].currentTime>.05);
  assert.equal(urls.filter(u=>u.includes('Arcade_Adventure')).length,0);
  assert.equal(urls.filter(u=>u.endsWith('.ogg')).length,1);
  assert.equal(urls.filter(u=>u.endsWith('.mp3')).length,0);
  assert.equal(await page.evaluate(()=>media.length===1&&media[0].loop&&Math.abs(media[0].volume-.18)<.001),true);
  await page.evaluate(()=>{media[0].currentTime=media[0].duration-.25;});
  await page.waitForTimeout(900);
  assert.equal(urls.filter(u=>u.includes('bgmusic-')).length,1);
  assert.equal(await page.evaluate(()=>media[0].currentTime<3&&!media[0].paused),true);
  await page.evaluate(()=>fl.dispose());
  await page.click('#enter');
  await page.waitForFunction(()=>fl.inspect().musicPlaying);
  assert.equal(urls.filter(u=>u.includes('bgmusic-')).length,1);
  await page.route('**/*bgmusic-*',route=>route.abort());
  await page.reload();
  await page.click('#enter');
  await page.waitForFunction(()=>fl.inspect().musicPlaying&&fl.inspect().musicDownloads===0);
  await page.evaluate(()=>fl.dispose());
  await page.close();
  const fallback=await browser.newPage();
  await fallback.addInitScript(()=>{const native=HTMLMediaElement.prototype.canPlayType;HTMLMediaElement.prototype.canPlayType=function(type){return /ogg/.test(type)?'':native.call(this,type);};});
  const mp3=[];fallback.on('request',r=>{if(r.url().includes('bgmusic-'))mp3.push(r.url());});
  await fallback.goto(origin+'/test');
  await fallback.click('#enter');
  await fallback.waitForFunction(()=>fl.inspect().musicPlaying);
  assert.equal(mp3.length,1);
  assert.ok(mp3[0].endsWith('.mp3'));
  await fallback.evaluate(()=>fl.dispose());
  console.log('PASS Frontline BGM browser: one Opus download, loop/cache reuse, MP3 fallback');
}finally{
  await browser.close();
  server.close();
}
