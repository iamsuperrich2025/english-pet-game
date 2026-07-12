// ============================================================
// ล้าง Firebase Hosting versions เก่าของ site vocabworld (รอบ 158)
// ทำไม: แผน Spark ฟรีจำกัดพื้นที่เก็บ release ประวัติ — เว็บมี 700+ ไฟล์
//        deploy บ่อยๆ ไม่กี่สิบรอบก็ชนโควตา (HTTP 429 deploy ไม่ได้)
// ทำอะไร: เก็บ version ของ 5 release ล่าสุด + version ใหม่สุด 2 ตัว — ที่เหลือลบ
// ใช้:  node tools/cleanup_hosting_versions.mjs
//        (ใช้ token ของ firebase CLI ที่ login ค้างในเครื่อง — client id/secret
//         เป็นค่า public ที่ฝังใน firebase-tools ทุกเครื่องอยู่แล้ว ไม่ใช่ความลับ)
// เรียกอัตโนมัติท้าย tools/deploy_firebase.sh — พลาดก็ไม่ทำให้ deploy ล้ม
// ============================================================
import { readFileSync } from 'fs';
import { homedir } from 'os';

const SITE = 'vocabworld';
const cfg = JSON.parse(readFileSync(homedir() + '/.config/configstore/firebase-tools.json', 'utf8'));
const refresh = cfg.tokens && cfg.tokens.refresh_token;
if(!refresh){ console.error('cleanup: ไม่พบ refresh token ของ firebase CLI'); process.exit(1); }

const tokRes = await fetch('https://oauth2.googleapis.com/token', {
  method: 'POST',
  headers: {'Content-Type': 'application/x-www-form-urlencoded'},
  body: new URLSearchParams({
    client_id: '563584335869-fgrhgmd47bqnekij5i8b5pr03ho849e6.apps.googleusercontent.com',
    client_secret: 'j9iVZfS8kkCEFUPaAeJV0sAi',
    refresh_token: refresh,
    grant_type: 'refresh_token',
  }),
});
const tok = await tokRes.json();
if(!tok.access_token){ console.error('cleanup: ขอ access token ไม่ผ่าน', tok.error || ''); process.exit(1); }
const H = {Authorization: 'Bearer ' + tok.access_token};
const API = 'https://firebasehosting.googleapis.com/v1beta1';

// version ที่ผูกกับ 5 release ล่าสุด (รวมตัว live) — ห้ามลบ
const rel = await (await fetch(`${API}/sites/${SITE}/releases?pageSize=5`, {headers: H})).json();
const keep = new Set((rel.releases || []).map(r => r.version && r.version.name).filter(Boolean));

let versions = [], pageToken = '';
do {
  const q = new URLSearchParams({pageSize: '100'});
  if(pageToken) q.set('pageToken', pageToken);
  const d = await (await fetch(`${API}/sites/${SITE}/versions?${q}`, {headers: H})).json();
  versions = versions.concat(d.versions || []);
  pageToken = d.nextPageToken || '';
} while(pageToken);

versions = versions.filter(v => v.status === 'FINALIZED');   // ตัวที่ลบแล้ว (DELETED) ไม่ต้องนับซ้ำ
versions.sort((a, b) => (b.createTime || '').localeCompare(a.createTime || ''));
versions.slice(0, 2).forEach(v => keep.add(v.name));   // กันเหนียว: ใหม่สุด 2 ตัวไม่แตะ
let del = 0, fail = 0;
for(const v of versions){
  if(keep.has(v.name)) continue;
  const r = await fetch(`${API}/${v.name}`, {method: 'DELETE', headers: H});
  if(r.ok) del++; else fail++;
}
console.log(`🧹 cleanup hosting versions: ลบ ${del} · พลาด ${fail} · คงไว้ ${keep.size} (จาก ${versions.length})`);
