/* Public release boundary: production route is required, emulator and test wallets are forbidden. */
import {promises as fs} from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
const root=path.resolve(process.argv[2]||'dist');
const html=await fs.readFile(path.join(root,'frontline/index.html'),'utf8');
assert.ok(html.includes('Frontline')&&html.includes('กลับ Lobby'));
assert.ok(!/dev-config|\/shared\/|LOCAL TEST|test wallet/.test(html));
const scripts=[...html.matchAll(/src="([^"]+\.js)"/g)].map(m=>m[1]).filter(x=>x.startsWith('/'));
for(const url of scripts){const code=await fs.readFile(path.join(root,url),'utf8');assert.ok(!/FRONTLINE_DEV|frontline_v1_dev|demo-vocab-frontline|vw\.frontline-v1\.test\.save|useEmulator/.test(code),url+' leaked test infrastructure');}
assert.ok((await fs.readFile(path.join(root,'js/ui.js'),'utf8')).includes("location.assign('/frontline/index.html')"));
assert.ok((await fs.readFile(path.join(root,'js/home-v2.js'),'utf8')).includes("['worldFrontline','tank','Frontline 1944','#btn-world-frontline']"));
for(const file of ['preview.mjs','database.rules.json','frontline-network.js','frontline-economy.js'])assert.equal(await fs.access(path.join(root,'frontline',file)).then(()=>true,()=>false),false);
console.log('PASS public route/Lobby; no emulator, mock identity, test wallet or development gateways in the public runtime.');
