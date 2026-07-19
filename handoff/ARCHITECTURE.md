# ARCHITECTURE.md — ภาพรวมโปรเจกต์ + โครงสร้างไฟล์

> อ่านเมื่อ: หาไฟล์/ฟังก์ชัน/โครงสร้างโค้ด · ก่อนแก้โค้ดส่วนที่ยังไม่คุ้น

## ภาพรวม
**Pet Vocab Adventure** — เว็บเกมเลี้ยงสัตว์เพื่อเรียนคำศัพท์อังกฤษ สำหรับนักเรียน ป.1–ม.6
- โฟลเดอร์: `C:\Users\rober\english-pet-game\` เปิดได้ทั้ง file:// และ http:// — **ห้าม fetch ไฟล์ local** ใช้ `new Image()` probe (`probeImages()`)
- **🌐 ออนไลน์:** repo `iamsuperrich2025/english-pet-game` (branch `main`) + GitHub Pages → เล่นได้ที่ **https://iamsuperrich2025.github.io/english-pet-game/**
- **🔥 Firebase:** ดู `handoff/RULES.md` (โปรเจกต์ english-pet-game · RTDB asia-southeast1)
- เซฟใน LocalStorage key `petVocabAdventure_v1` ผ่าน `state` + `saveState()`/`loadState()` — `loadState()` มี migration เซฟรุ่นเก่า→ใหม่ (field ใหม่ทุกตัวต้องมี default)
- ทดสอบ: preview server `english-pet-game` (python http.server พอร์ต 8642) — เครื่องนี้ไม่มี Node มีแต่ Python 3.12
- **PWA:** `manifest.json` (`display:fullscreen`) + `sw.js` (network-first โค้ด/cache-first รูป/ข้าม Firebase · CACHE_VERSION='pet-vocab-v1') + `img/icons/` 4 ไฟล์ · ปุ่ม 📲 ติดตั้ง (`#btn-install`/`#btn-install-top`) · ระบบแจ้งเวอร์ชันใหม่ (`version.json` + `.update-banner`) · `.nojekyll` · **แก้ manifest (display/icon/ชื่อ) เท่านั้นที่ต้องติดตั้งใหม่** โค้ดปกติได้อัตโนมัติ (network-first)

## โครงสร้างไฟล์ (แยก data ออกจาก logic)

```
index.html            โครง HTML + โหลดสคริปต์ตามลำดับ (data → engine)
css/style.css         CSS หลัก (rank-card, rankup-overlay, heat-bar, online-card, clock-chip, farm-*, mkt-*/collect-*, install-btn, update-banner)
css/lobby.css         ธีม Lobby แนวนอน (โหลดทับ style.css) + chat-*/gift-*/gp-*/chat-emoji-cats ฯลฯ
js/data/pets.js       PETS (dog/cat 3,000 · dragon 10,000) + FOODS (100–500 · feast 1,000 อิ่ม 6 ชม.)
js/data/items.js      ITEMS (โบว์ 500 · ทั่วไป 1,200–5,000 · มงกุฎ 25,000) + มือถือ (PHONE_*) + คอม (COMP_*)
js/data/fruits.js     FRUITS 4 ชนิด + fruitInfo/fruitGrowMs/fruitMsLeft
js/data/collectibles.js  COLLECTIBLES 50 ชิ้น (5 หมวด×10 · tier common→mythic · field words=แต้มผลิต) + COLLECT_TIERS + COLLECT_CATS + collectInfo/collectTier + listingSellMs/listingStatus
js/data/gifts.js      GIFTS 50 ของขวัญ (id/emoji/name/price/cat cake·rose·card) + GIFT_CATS + giftInfo — ข้อ 0.5 (ภาพ img/gifts/gift_<id>.png)
js/data/vocab.js      VOCAB_BANDS 5 ระดับ × 8 หมวด × 10 คำ + gradeBand()/catsForStudent()/findCat()
js/data/ranks.js      RANKS 7 แรงค์ + rankInfo(worth) + rankFromKey — ขั้นย่อย III→II→I
js/data/homes.js      HOMES 3 ระดับ + AC + MAINT_RATE/ELEC_RATE/WATER_RATE/TRASH_RATE (0.5%/เดือน) + maint/elec/water/trashCost + WEATHERS + weatherNow/rainNow
js/data/players.js    ONLINE_NAMES + ONLINE_ACTIVITIES + onlineBaseCount(hour) — เพื่อนจำลอง fallback
js/data/badwords.js   ตัวกรองชื่อ+คำหยาบ (ข้อ 0.2 + ข้อ 7): NAME_ALLOWED_RE + BAD_PART/BAD_EXACT + nameNormalize + checkName(raw,min,max)→{ok,name|msg} + nameHasBadWord
js/data/firebase-config.js  FIREBASE_CONFIG (databaseURL asia-southeast1) — ลบ/ค่าไม่ครบ = เข้าโหมดออฟไลน์
js/online.js          เครื่องยนต์ออนไลน์ (Firebase SDK 10.14.1 compat dynamic): presence/leaderboard · ระบบเพื่อน (friendCode/Search/Request/Accept/Decline/friendsHeal) · แชท (chatPairId/chatRef/chatListen/chatSend/chatPrune/chatWatchSync/chatMarkSeen) · ของขวัญ (giftSend/giftAccept/giftDecline/giftInWatch/giftOutWatchSync/giftOutRebuild/giftReclaim · GIFT_EXPIRE_MS 7 วัน) · Online{ready,friends,board,myCode,reqs,myFriends,presenceMap,chatUnread,giftIn,giftOut} · onlineKey()=uid · onlineDisplayName()
js/auth.js            Google Login (ข้อ 0.1): Auth{user,booted,...} · authStart/authLoginClick/authSyncOnLogin/authPushSave/authLogout/authGateOffline · authAskProfileName/authApplyProfileName/authEditProfileName/authPushProfile (ข้อ 0.2) · จุด mock: stub authFetchCloud/Write/Delete+onlineStart แล้วเรียก authOnLogin({uid,email})
js/util.js            shuffle/fmtNum/escapeHTML/toast/floatFx/sfx/showScreen/askConfirm/seededRand + askNameDialog(opt) กล่องตั้งชื่อกลาง (validate checkName)
js/state.js           state/DEFAULT_STATE/loadState(migration)/saveState · careTick/dailyTick · addCoins/addRP/addExp/expNeed · currentSlotStart/nextSlotStart · heatProtected/rainProtected · assetValue/netWorth/assetCount/refreshRank · บิลรายเดือน ymStr/billOutstanding/homeDecayed/billTick + UTILITIES{elec,water} · compTick · marketTick · addCraft/newOrder/orderTick · giftBox:[] (ข้อ 0.5 · ไม่รวม assetValue/ขายต่อไม่ได้)
js/images.js          IMG_FILES + probeImages(keys,dir)/probeCollectImages/probeGiftImages/probeRankImages/probeHomeImages · currentPetImg/equippedItem/makeHappy
js/ui.js              renderDashboard + การ์ดทั้งหมด · UTILITY_UI/utilityBillUI/payUtility/buyUtilityFix ·
                      โรงงาน & ตลาด (แยกคนละแผง "รอบยี่สิบเก้า"): renderFactoryCard(#factory-card=renderFactory) · renderMarketCard(#market-card=soldUI+renderOrdersUI+renderCollectMine) · startProduce/cancelProduce→renderFactoryCard · deliverOrder/openListDialog/cancelListing→renderDashboard · renderOrderClock/showCollectReveal/collectImg · module var factoryCat/factoryPage
                      แชท (ข้อ 0.4): openChat + CHAT_EMOJI_CATS 7 หมวด (แผง emoji จัดกลุ่ม) + refreshFriendData ปุ่ม 💬
                      ของขวัญ (ข้อ 0.5): renderGiftPanel/openGiftPicker/confirmSendGift/doSendGift/acceptGift/declineGift/showGiftReveal/giftImg (#gift-card) + ปุ่ม 🎁 .fr-gift-btn
js/lobby.js           ระบบแผง Lobby: openPanel/closePanel + PANEL_TITLES (home/shop/farm/factory/market/friends/gifts/rank) · wrap showScreen ปิดแผงอัตโนมัติ
js/game.js            เกมจับคู่ + หมวด/แบบทดสอบ (renderCats/startQuiz/finishQuiz) + hook แต้มผลิต (addCraft) → showCollectReveal
js/main.js            ปุ่ม + init: #screen-login รอ auth → bootGame() · careTick interval guard ด้วย Auth.booted · renderClock ทุกวินาที · ปุ่มรีเซ็ตถูกถอดแล้ว
```


<!-- AUTO-FILES:BEGIN -->
### 🤖 ไฟล์ไหนทำอะไร — เจนอัตโนมัติจาก comment หัวไฟล์ (`tools/gen_code_map.py` · **ห้ามแก้มือในบล็อกนี้**) · อัปเดต 2026-07-20
- **js/adventure3d.js** (10,143 บรรทัด) — adventure3d.js — โลก 3D First-person 2 โหมด (คิว 7725691507 ข้อ 8 + ต่อยอด) · 🌍 adv   = โลกผจญภัยกลางวัน: เก็บตัวอักษรประกอบคำ 15🪙/คำ · monster ยิงสู้ได้ · 👻 haunt = โลกผีสิงกลางคืน: 25🪙/คำ · ผี 8 ตัว โผล่ 20 วิแล้วย้ายที่
- **js/auth.js** (389 บรรทัด) — ENGINE: Google Login + Sync เซฟขึ้น cloud (backlog ข้อ 0.1) · กติกา (ผู้ใช้เลือกแบบ ก. 5 ก.ค. 2026): บังคับ login ด้วย Google · เท่านั้นก่อนเข้าเกม — offline/SDK โหลดไม่ได้ → หน้าประตูให้ลองใหม่
- **js/dictband.js** (362 บรรทัด) — DICT BAND — คลังศัพท์ใหญ่ตามระดับ (band 1-5) จาก js/data/dict_band/ · manifest.js โหลดตอนบูต (เบา) → ชิ้นข้อมูล db<band>_*.js โหลดขี้เกียจ · ตอนผู้เล่นกดเล่น แล้วต่อเข้าเครื่องยนต์เดิมทั้งคู่:
- **js/game.js** (948 บรรทัด) — เกมจับคู่คำศัพท์ + หมวดคำศัพท์ & แบบทดสอบ · รางวัล: จับคู่ถูก +10🪙 +2RP +5EXP · เคลียร์รอบ +20🪙 +5RP · สอบผ่านครั้งแรก +รางวัลหมวด +100RP · ผ่านซ้ำ +20🪙 +30RP · ไม่ผ่าน +5RP
- **js/images.js** (101 บรรทัด) — ระบบตรวจหาภาพเจนอัตโนมัติ (ใช้ new Image() probe — ใช้ได้ทั้ง · file:// และ http:// ต่างจาก fetch ที่ถูกบล็อกใน file://) · โฟลเดอร์ภาพ:
- **js/lobby.js** (52 บรรทัด) — LOBBY แนวนอน — ระบบแผงรายละเอียดกลางจอ (อัพเดท 5725691826) · คลิกเมนูซ้าย → เปิดแผง (panel) ทับฉาก Lobby · เนื้อหา scroll ในแผง · การ์ดเดิมทั้งหมด (home/phone/computer/farm/collect/rank) ย้ายเข้าแผง
- **js/lobby3d.js** (780 บรรทัด) — lobby3d.js — โมเดล 3D ตัวละครในหน้า Lobby (รอบ 114) · โหลด GLB ผู้เลี้ยง + น้อง (img/models/*.glb) · idle เบาๆ (หายใจ/โยกตัว) + เล่น animation clip จากไฟล์ (Tripo ชื่อ NlaTrack → ใช้ clip แรก)
- **js/main.js** (158 บรรทัด) — ปุ่มหลัก + INIT
- **js/moto3d.js** (1,832 บรรทัด) — 🏍️ moto3d.js — โลกมอเตอร์ไซค์บ้านโพธิ์สวัสดิ์ (รอบ 293) · ขับมอเตอร์ไซค์ third-person บนถนนจริงรอบโรงเรียนบ้านโพธิ์สวัสดิ์ รัศมี 30 กม. (js/data/moto_phosawat.js · OSM) · เล่นบน "เครื่องเกมพกพา" เต็มจอ — จอเกมอยู่ตรงกลางเครื่อง · สไลเดอร์ส้มซ้าย=เลี้ยว · ปุ่มฟ้าขวา=เร่ง · ปุ่มแดงบน=ปิดเครื่อง
- **js/music.js** (157 บรรทัด) — music.js — ระบบเพลง (รอบ 181) · เพลงพื้นหลัง (instrument) เล่นวนทั้งเกม เริ่มหลัง gesture แรก (autoplay policy) · เข้าโลก 3D ใดๆ → พัก bg (โลกมี soundscape ของตัวเอง) · ออก → เล่นต่อ
- **js/online.js** (1,116 บรรทัด) — ENGINE: ระบบออนไลน์จริงผ่าน Firebase Realtime Database · - เพื่อนออนไลน์จริง (presence): เห็นผู้เล่นคนอื่นที่เปิดเกมอยู่จริง · - Leaderboard: อันดับผู้เล่นที่มีเหรียญมากที่สุด Top 50
- **js/state.js** (971 บรรทัด) — STATE + LocalStorage + กติกากลางของเกม · (แยกจากไฟล์ data — อัปเกรดคำศัพท์/สัตว์/ไอเทมได้โดยไม่กระทบเซฟ)
- **js/ui.js** (6,897 บรรทัด) — UI: Dashboard / ร้านค้า / ที่พัก / ร้านสัตว์เลี้ยง / แรงค์ / สถิติ
- **js/util.js** (727 บรรทัด) — UTIL: เสียง / เอฟเฟกต์ / เครื่องมือทั่วไป
- **js/vocabbook.js** (207 บรรทัด) — 📒 สมุดคำศัพท์ของฉัน + ข้อสอบทบทวนส่วนตัว (รอบ 288) · เก็บทุกคำที่เด็กเจอในเกมจับคู่/ข้อสอบทุกแบบ (รวม band) ลง state.vocabBook · ถาวรข้ามเซสชัน: {en: {th, c:ถูกกี่ครั้ง, w:ผิดกี่ครั้ง, t:เจอล่าสุด, lw:ครั้งล่าสุดผิด?}}
- **js/wordsearch.js** (236 บรรทัด) — 🔎 wordsearch.js — เกมค้นหาคำศัพท์ (Word Search) รอบ 194 · แผงฟ้าล้ำยุคเลื่อนออกจากซ้าย · สุ่มคำไม่ซ้ำในแต่ละเกม · 🔒 กฎเหล็ก: คำที่นำมาเล่น = คำตามระดับชั้นผู้เล่นเท่านั้น (vocabForStudent)
- **css/lobby.css** (2,533 บรรทัด) — THEME 2.0 "เมืองทันสมัยโทนฟ้า" — LOBBY แนวนอน + UI ยุคหลังทั้งหมด (โหลดทับ style.css · cascade ทีหลังชนะ · เปลี่ยนเฉพาะหน้าตา ไม่แตะ logic) · ครอบคลุม: แถบบน/ราง rail/แผง panel (ตลาด-โรงงาน-บ้าน-เพื่อน) · โชว์รูมหุ่น .rs-* รถ .cs-* · Word Search .ws-* · ข้อมูลน้อง .pi-* · แชท+ธีมแชท · กระดานอันดับ/เข็ม · สไปรต์น้อง .pet-anim/ฉาก .stage-hero · โทนสี: น้ำเงินเ…
- **css/style.css** (1,707 บรรทัด) — Pet Vocab Adventure — สไตล์พื้นฐานรุ่นแรกทั้งเกม (โดน lobby.css โหลดทับบางส่วน — แก้หน้าตาโซนล็อบบี้/UI ใหม่ให้ไปที่ lobby.css ก่อน) · ครอบคลุม: screens/login/dashboard · เกมจับคู่ .word-card + แบบทดสอบ .quiz-* · shop/ที่พัก/หมวดคำศัพท์ · หิว-ป่วย/สภาพอากาศ · ตั้งค่า/วิธีเล่น/level-up overlay · คลังของฉัน/กล่องขาย · เอฟเฟกต์ลอย/เหรียญ/rotate-overlay
- **sw.js** (98 บรรทัด) — Service Worker — Pet Vocab Adventure (PWA) · กลยุทธ์: · - โค้ดเกม (HTML/JS/CSS): network-first → ออนไลน์ได้โค้ดใหม่เสมอ (กันปัญหาโค้ดค้าง),
<!-- AUTO-FILES:END -->




































































































































































































































































## ไฟล์งานที่มอบ Sonnet / prompt ภาพ
```
TASK_VOCAB_SONNET.md       งานคำศัพท์ (backlog ข้อ 9) — แยก vocab/ + POS + ≥2,000 คำ (🔶 ค้างครึ่งทาง มีแค่ band1.js untracked · ⚠️ เคยทำ production พัง)
TASK_DICTIONARY_SONNET.md  Project Dictionary A–Z (backlog ข้อ 10) — ยังไม่เริ่ม
PROMPTS*.md                prompt ภาพสัตว์/แรงค์/ที่พัก/สินค้า/ของขวัญ/ธีม
img/                       สัตว์ · rank/ ✅7 · home/ ✅3 · collectibles/ ✅50 · gifts/ ✅50 · theme/ ✅6 · icons/ ✅4
```

## ⚠️ กับดักที่เคยเจอ
- **ห้ามแก้ index.html ชี้ `js/data/vocab/band1-5.js`** จนกว่างานคำศัพท์ Sonnet เสร็จครบทุกไฟล์และ commit พร้อมกัน — commit `9accb89` เคยทำเกมพังทั้งเว็บ (`gradeBand is not defined`) เพราะ script tag ชี้ไฟล์ untracked
- commit ต้องตรวจว่าไม่มี script tag ชี้ไฟล์ที่ยังไม่ถูก commit
- GitHub Pages build หน่วง ~2–5 นาทีหลัง push — อย่าเพิ่งทดสอบ/ติดตั้งมือถือทันที (เช็ก `curl` version.json/manifest.json บน Pages ว่าขึ้นค่าใหม่ยัง)
