/* Service Worker — Pet Vocab Adventure (PWA)
   กลยุทธ์:
   - โค้ดเกม (HTML/JS/CSS): network-first → ออนไลน์ได้โค้ดใหม่เสมอ (กันปัญหาโค้ดค้าง),
     ออฟไลน์ค่อย fallback แคช
   - รูปภาพ/ฟอนต์: cache-first → โหลดไว ประหยัดเน็ต (รูปแทบไม่เปลี่ยน)
   - คำขอข้ามโดเมน (Firebase/Google login/gstatic): ปล่อยผ่าน ไม่ยุ่ง
   อัปเดตเวอร์ชัน: เปลี่ยน CACHE_VERSION แล้ว SW เก่าจะถูกล้างตอน activate
*/
const CACHE_VERSION = 'pet-vocab-v276';  // v276: รอบ 1082 (9 ส.ค. · ตู้เข็มโปรไฟล์ 5×3 แนวตั้ง):

/* app shell — โครงหลักที่ต้องมีเพื่อเปิดเกมได้แม้ออฟไลน์
   รอบ 863: index.html = ล็อบบี้เมือง 3D (city3d.js) · index_classic.html = ล็อบบี้เดิม (เกมทั้งหมด)
   ต้องแคชทั้งคู่ ไม่งั้นออฟไลน์กดสลับหน้าแล้วตาย */
const SHELL = [
  './',
  './index.html',
  './index_classic.html',
  './js/thaitime.js',        // 🇹🇭 รอบ 988: เวลาไทยกลางของเกม (สคริปต์แรกสุดของทั้ง 2 หน้า)
  './js/city3d.js',
  './manifest.json',
  './css/style.css',
  './css/lobby.css',
  './css/exam.css',
  './css/arena3d.css',       // 🌀 รอบ 1045: HUD โลกผจญภัย Vocab Arena
  './css/bubble.css',        // 🫧 เกมฟองคำศัพท์
  './js/data/pets.js',
  './js/data/items.js',
  './js/data/calendar.js',
  './js/data/vocab.js',
  './js/data/ranks.js',
  './js/data/homes.js',
  './js/data/fruits.js',
  './js/data/collectibles.js',
  './js/data/players.js',
  './js/data/badwords.js',
  './js/data/firebase-config.js',
  './js/data/dict_band/manifest.js',
  './js/data/exam/manifest.js',
  './js/examstd.js',
  './js/dictband.js',
  './js/vocabbook.js',
  './js/util.js',
  './js/state.js',
  './js/images.js',
  './js/petbehavior.js',
  './js/ui.js',
  './js/lobby.js',
  './js/game.js',
  './js/cert.js',
  './js/auth.js',
  './js/online.js',
  './js/wsaward.js',
  './js/bbaward.js',
  './js/bubble.js',
  './js/main.js',
  './js/vendor/three.min.js',
  './js/adv3d_css.js',
  './js/adv3d_intro.js',
  './js/adv3d_tex.js',
  './js/adventure3d.js',
  './js/arena3d.js',         // 🌀 รอบ 1045: ต่อสู้ PvE→เก็บอักษร→ประกอบคำ→ร้านพลัง
  './img/icons/icon-192-flat.png',   // รอบ 859: ไอคอนพื้นเรียบสีเดียวกับ background_color (แก้ splash APK เห็นกรอบ)
  './img/icons/icon-512-flat.png',
  './img/icons/splash_logo.png',   // รอบ 757: โลโก้ splash — ต้องมีในแคชไม่งั้นเปิดออฟไลน์แล้วจอโหลดว่างเปล่า
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
  // 🎬 รอบ 605: คลิปน้อง (clip/*.mp4) — ปล่อยเบราว์เซอร์จัดการเอง
  // (วิดีโอโหลดเป็นช่วง Range 206 · ถ้า SW เก็บ/คืนสำเนาบางส่วน เล่นพังหรือค้าง + กินที่แคชเป็น MB)
  if(/\.(mp4|webm|mov|m4v)$/i.test(url.pathname)) return;

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
