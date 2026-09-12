/* Explicit runtime packaging from the new implementation; dev gateways/tests are never public. */
import {promises as fs} from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const DIR=path.dirname(fileURLToPath(import.meta.url)),ROOT=path.resolve(DIR,'../..');
const reducers=['config','words','bases','collision','tank','letters','drop','bots','guards','combat','bombs','commands','room'];
export async function packageServer(){
  const out=path.join(ROOT,'functions/frontline-runtime');await fs.mkdir(out,{recursive:true});
  for(const name of reducers)await fs.copyFile(path.join(DIR,'frontline-'+name+'.js'),path.join(out,'frontline-'+name+'.js'));
  await fs.copyFile(path.join(ROOT,'js/data/vocab.js'),path.join(out,'vocab.js'));
}
export async function packageFrontline(out){
  const target=path.join(out,'frontline');await fs.mkdir(path.join(target,'assets'),{recursive:true});
  let html=await fs.readFile(path.join(DIR,'index.html'),'utf8');
  const scripts=[...html.matchAll(/src="\/frontline\/(frontline-[a-z]+\.js)"/g)].map(m=>m[1]);
  for(const file of scripts){
    if(file==='frontline-network.js'||file==='frontline-economy.js')continue;
    let source=await fs.readFile(path.join(DIR,file),'utf8');
    if(file==='frontline-config.js'){
      const start=source.indexOf('  F.isPrivateHost ='),end=source.indexOf('  F.randomId =');
      if(start<0||end<start)throw Error('Frontline access contract changed');
      source=source.slice(0,start)+source.slice(end);
      source=source.replace("project:'demo-vocab-frontline-v1', namespace:'frontline_v1_dev'","project:'english-pet-game', namespace:'frontline_v1_live/v1'")
        .replace("saveKey:'vw.frontline-v1.test.save.v1'","saveKey:'petVocabAdventure_v1'");
    }
    await fs.writeFile(path.join(target,file),source);
  }
  for(const file of ['frontline-live.js','frontline-live-network.js','frontline-live-economy.js','frontline.css','frontline-launcher.css'])await fs.copyFile(path.join(DIR,file),path.join(target,file));
  for(const file of ['tank-cute.glb','launcher-garden.avif','launcher-garden.webp'])await fs.copyFile(path.join(DIR,'assets',file),path.join(target,'assets',file));
  html=html.replace('<script src="/dev-config.js"></script>','')
    .replace('frontline-network.js','frontline-live-network.js').replace('frontline-economy.js','frontline-live-economy.js')
    .replace('<script src="/frontline/frontline-main.js"></script>','<script src="/frontline/frontline-live.js"></script><script src="/frontline/frontline-main.js"></script>')
    .replaceAll('/sdk/','https://www.gstatic.com/firebasejs/10.14.1/')
    .replace('<script src="https://www.gstatic.com/firebasejs/10.14.1/firebase-database-compat.js"></script>',
      '<script src="https://www.gstatic.com/firebasejs/10.14.1/firebase-database-compat.js"></script><script src="https://www.gstatic.com/firebasejs/10.14.1/firebase-auth-compat.js"></script><script src="/js/data/firebase-config.js"></script>');
  const shared={thaitime:'js/thaitime.js',items:'js/data/items.js',homes:'js/data/homes.js',ranks:'js/data/ranks.js',state:'js/state.js',vocab:'js/data/vocab.js','three.min':'js/vendor/three.min.js',gltfloader:'js/vendor/GLTFLoader.js'};
  for(const [name,file] of Object.entries(shared))html=html.replaceAll('/shared/'+name+'.js','/'+file);
  html=html.replaceAll(' · Local test','').replaceAll('local test launcher','launcher').replaceAll('LOCAL TEST ONLY','ONLINE · FREE TO PLAY')
    .replaceAll('Vocab World test wallet','Vocab World wallet').replaceAll(' · TEST','')
    .replace('Local test save · Your production progress stays untouched.','เหรียญเข้าบัญชี Vocab World ของคุณ');
  await fs.writeFile(path.join(target,'index.html'),html);
}
if(process.argv.includes('--server'))await packageServer();
