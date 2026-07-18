/* Service Worker — Pet Vocab Adventure (PWA)
   กลยุทธ์:
   - โค้ดเกม (HTML/JS/CSS): network-first → ออนไลน์ได้โค้ดใหม่เสมอ (กันปัญหาโค้ดค้าง),
     ออฟไลน์ค่อย fallback แคช
   - รูปภาพ/ฟอนต์: cache-first → โหลดไว ประหยัดเน็ต (รูปแทบไม่เปลี่ยน)
   - คำขอข้ามโดเมน (Firebase/Google login/gstatic): ปล่อยผ่าน ไม่ยุ่ง
   อัปเดตเวอร์ชัน: เปลี่ยน CACHE_VERSION แล้ว SW เก่าจะถูกล้างตอน activate
*/
const CACHE_VERSION = 'pet-vocab-v71';   // v71: 🏍️ โลกมอเตอร์ไซค์บ้านโพธิ์สวัสดิ์ รอบ 293

/* app shell — โครงหลักที่ต้องมีเพื่อเปิดเกมได้แม้ออฟไลน์ */
const SHELL = [
  './',
  './index.html',
  './manifest.json',
  './css/style.css',
  './css/lobby.css',
  './js/data/pets.js',
  './js/data/items.js',
  './js/data/vocab.js',
  './js/data/ranks.js',
  './js/data/homes.js',
  './js/data/fruits.js',
  './js/data/collectibles.js',
  './js/data/players.js',
  './js/data/badwords.js',
  './js/data/firebase-config.js',
  './js/data/dict_band/manifest.js',
  './js/dictband.js',
  './js/vocabbook.js',
  './js/util.js',
  './js/state.js',
  './js/images.js',
  './js/ui.js',
  './js/lobby.js',
  './js/game.js',
  './js/auth.js',
  './js/online.js',
  './js/main.js',
  './js/vendor/three.min.js',
  './js/adventure3d.js',
  './img/icons/icon-192.png',
  './img/icons/icon-512.png',
];

self.addEventListener('install', (e)=>{
  e.waitUntil(
    caches.open(CACHE_VERSION)
      .then(c=>c.addAll(SHELL))
      .then(()=>self.skipWaiting())          // ให้ SW ใหม่ทำงานทันที
      .catch(()=>{})                          // ไฟล์ใดโหลดไม่ได้ ไม่ให้ install ล้มทั้งชุด
  );
});

self.addEventListener('activate', (e)=>{
  e.waitUntil(
    caches.keys()
      .then(keys=>Promise.all(keys.filter(k=>k!==CACHE_VERSION).map(k=>caches.delete(k))))
      .then(()=>self.clients.claim())
  );
});

self.addEventListener('fetch', (e)=>{
  const req = e.request;
  if(req.method !== 'GET') return;                        // เขียนข้อมูล → ปล่อยผ่าน
  const url = new URL(req.url);
  if(url.origin !== self.location.origin) return;         // Firebase/Google/ฟอนต์ → ปล่อยผ่าน

  const isImg = /\.(png|jpg|jpeg|gif|webp|svg|ico|mp3|wav|ogg)$/i.test(url.pathname)
    || url.pathname.includes('/js/vendor/');   // vendor (three.min.js ~600KB) + เสียง แทบไม่เปลี่ยน → cache-first ประหยัดเน็ต

  if(isImg){
    // cache-first สำหรับรูป/เสียง/vendor — cache เฉพาะโหลดสำเร็จ (res.ok) เท่านั้น
    // ห้าม cache 404: ภาพที่ยังไม่ได้เจน พอเจนเสร็จวางไฟล์แล้วต้องโผล่ได้เลย
    e.respondWith(
      caches.match(req).then(hit=> hit || fetch(req).then(res=>{
        if(res.ok){
          const copy = res.clone();
          caches.open(CACHE_VERSION).then(c=>c.put(req, copy)).catch(()=>{});
        }
        return res;
      }).catch(()=>hit))
    );
    return;
  }

  // network-first สำหรับโค้ด/หน้าเว็บ (ออนไลน์ได้ของใหม่ ออฟไลน์ใช้แคช)
  // cache เฉพาะ res.ok — กัน error ทับสำเนาดีที่เคยมี
  e.respondWith(
    fetch(req).then(res=>{
      if(res.ok){
        const copy = res.clone();
        caches.open(CACHE_VERSION).then(c=>c.put(req, copy)).catch(()=>{});
      }
      return res;
    }).catch(()=> caches.match(req).then(hit=> hit || caches.match('./index.html')))
  );
});
