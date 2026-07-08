# HANDOFF.md — BOOT ไฟล์เดียวจบ (Pet Vocab Adventure)

> 📂 ราก `C:\Users\rober\english-pet-game\` · ⚠️ working dir = `C:\Users\rober` → **เปิดไฟล์ใช้ path เต็มเสมอ**
> 🚀 **session ใหม่: อ่านไฟล์นี้ไฟล์เดียวพอเริ่มงาน** (เดิมต้องอ่าน 3 ไฟล์ — ยุบมาไว้นี่หมดแล้ว) · ไฟล์อื่นเปิดเฉพาะตอนต้องใช้ (ดูตารางล่างสุด)

## 🏆 กฎทอง (ยึด 4 ข้อนี้ก่อนเสมอ)
1. **ภาพก่อนโค้ด** — บั๊กที่มองเห็นได้ (UI/layout) → **ขอ/ดู screenshot ก่อน ห้ามเปิดโค้ดเดา** (รอบที่ผ่านมาเดา z-index จากโค้ดเสียเวลาเปล่า พอเห็นภาพเจอต้นตอทันที)
2. **Grep ก่อน Read** — ไฟล์ใหญ่ (`ui.js` ~2,000 บรรทัด, `vocab.js`, `collectibles.js`) หาชื่อฟังก์ชันด้วย Grep แล้ว Read เฉพาะช่วง (offset+limit) · **ห้ามอ่านทั้งไฟล์**
3. **preview: resize landscape ก่อน · เชื่อ `getBoundingClientRect` ไม่เชื่อ screenshot/elementFromPoint** (ดู 🖥️ ล่าง)
4. **จบงาน: บัมพ์ `version.json` → commit เฉพาะไฟล์ที่แก้ (ห้าม `git add -A`) → อัปเดต `handoff/TASKS.md`**
5. **เลือก session ตามการประหยัด token:** งาน/ขั้นตอนไหน **ทำใน session เดิมถูกกว่า** (context โหลดแล้ว งานเล็ก) → **ทำเลย ไม่ต้องเสนอแยก session** · ไหน **New session ถูกกว่า** (session เดิมยาว/context บวม, งานใหม่ที่ไม่พึ่งของเดิม) → **เสนอให้เริ่ม New session ทุกครั้ง**
6. **อนุญาตล่วงหน้าทุกงานเกม (ผู้ใช้สั่ง 8 ก.ค. 2026):** งานเกมนี้+ไอเดียต่อยอดทุกกรณี → **ทำเลย จบงาน commit+push แล้วรายงาน ไม่ต้องถาม "สนใจไหม/ทำเลยไหม"** · **ยกเว้นต้องถามก่อน:** ทำให้ผู้ใช้เสียเงินเพิ่ม / เสี่ยงการเงิน / เสี่ยงความปลอดภัย (เช่น หย่อน rules) / งานใหญ่จนขัดกฎ token (ข้อ 5) · กฎนี้ไม่ยกเลิกการถามเมื่อ**งานกำกวม** (ไม่แน่ใจว่าหมายถึงงานไหน → ถามก่อน อย่าเดา)

## 📸 สถานะปัจจุบัน (8 ก.ค. 2026)
- ✅ **รอบ 62: ใบอนุญาตนักบิน 🎖️** — สตรีคประกอบคำไม่ชน (สะสมข้ามรอบ) ครบ 5/15/30 → เข็ม 🥉🥈🥇 ติดท้ายชื่อทุกโลก (ไม่มี field/rules ใหม่) · ชน=สตรีคขาด เข็มไม่หาย — version .39
- ✅ **รอบ 61: เกจห้องนักบินเข็มขยับจริง 🎛️** — SPD/ATT เส้นขอบฟ้าเทียม (ฟ้า-ดินเอียงตามก้มเงยจริง)/ALT/V-S/RPM วาดสดทุกเฟรม + ภาพ cockpit ผู้ใช้เข้า repo ใช้จริงแล้ว — version .39
- ✅ **รอบ 60: ตัด scrollbar ระดับเพจถาวร 📵** — `html,body{overflow:hidden}` + `min-height:100dvh` (lobby.css) — เพจพอดีจอเสมอ ทุก screen scroll ภายในตัวเอง — version .38
- ✅ **รอบ 59: ฉาก Rank Up พอดีจอทุกขนาด 🎖️** — fix ล้นจอแนวนอน (หัวข้อ/ปุ่มโดนตัด) ด้วย clamp+vmin ครอบ 3 ฉากที่ใช้ CSS ร่วม (อัปแรงค์/ของขวัญ/ของสะสม) — version .37
- ✅ **รอบ 58: ป้ายโฆษณาบนยอดตึก 📢** — 10 ป้ายพื้นหลังต่างกัน "ติดต่อโฆษณา โทร 064-357 6645" + เลขป้ายกำกับ · วาง `img/ads/ad_<n>.png` = โฆษณาลูกค้าขึ้นแทน · ผังเมือง seed คงที่ (ลูกค้าจองเลขป้ายได้ + multiplayer เห็นเมืองเดียวกัน) — version .36
- ✅ **รอบ 57: เตือนภัยใกล้ชนในห้องนักบิน ⚠️** — บี๊บถี่ขึ้น 3 ระดับตามระยะตึก + ไฟแดงกะพริบใต้หน้าปัด + PULL UP ตอนดิ่งเร็วใกล้พื้น (บินเหนือยอดตึก=ไม่เตือน) — version .35
- ✅ **รอบ 56: บัญชีผู้ทดสอบเกม 🧪** — `TESTER_EMAILS` (auth.js · ตอนนี้มี sumpajitshami@gmail.com) login แล้วเหรียญ<60,000 เติมเป็น 60,000 อัตโนมัติ (พอตั๋ว 3D ครบ 3 โลก) + toast แจ้ง — version .34
- ✅ **รอบ 55: โลก 3D อ่านออกเสียงคำที่ผสมสำเร็จ 🔊** — `completeWord` (adventure3d.js) เรียก `speakWord` หลังแตรฉลอง 0.7 วิ — ครอบทั้ง 3 โลกอัตโนมัติ (โค้ดร่วม) — version .33
- ✅ **รอบ 54: เสียงเครื่องยนต์เฮลิฯ สมจริง 🚁🔊** — ซีเควนซ์สตาร์ทเครื่อง (บินไม่ได้จนใบพัดเต็มรอบ ~3.6 วิ) + โมเดล RPM แรงเฉื่อยเร่ง-เบาเครื่อง + รองรับไฟล์ Suno 3 ไฟล์ (start/rotor/rotor_high crossfade — prompt ใน `PROMPTS_HELI.md` 2.1–2.3) — version .32
- ✅ **รอบ 53: เสียงคำศัพท์ระดับ Edge ทุกเบราว์เซอร์ 🎙️** — เจน MP3 เสียง Neural (en-US-JennyNeural) ครบ 400 คำด้วย `tools/gen_word_audio.py` (edge-tts ฟรี) → `sound/words/` 5.1MB · `speakWord` เล่นไฟล์ก่อน fallback Web Speech · เพิ่มคำใน vocab.js แล้วรันสคริปต์ซ้ำได้ — version .32 (เลขร่วมกับงาน 🚁 session คู่ขนาน)
- ✅ **รอบ 52: โลกเฮลิคอปเตอร์ Bell 🚁 (การ์ดที่ 3)** — ตั๋ว 15,000 · cockpit view + ฟิสิกส์บิน · ตัวอักษรบนยอดตึก ต้องลงจอดเก็บ · 30🪙/คำ · เสียงใบพัดสังเคราะห์ + `PROMPTS_HELI.md` (ภาพ cockpit+เสียง Suno) · multiplayer ครบ — version .30 · **⚠️ rules เพิ่ม map `heli`+field `y` รอ publish**
- ✅ **รอบ 51: เสียงอ่านคำศัพท์อังกฤษ 🔊** — แตะการ์ดอังกฤษในเกมจับคู่ / การ์ดโจทย์ตอนสอบ (มีไอคอน 🔊) → อ่านออกเสียง Web Speech API เลือกเสียง human สุดที่เครื่องมี (`speakWord` util.js) — version .29
- ✅ **รอบ 50: คู่มือครูในเกม 👩‍🏫** — ปุ่มในหน้าตั้งค่า (เห็นเฉพาะบัญชีครู) สรุปเครื่องมือคุมห้อง 7 หัวข้อ + สูตรจัดแข่งในคาบ · fix วิธีเล่นที่ยังเขียน "โลก 3D กำลังก่อสร้าง" — version .28
- ✅ **รอบ 49: พิธีประกาศแชมป์ใน map 🏁** — ครูกด "จบรอบแข่ง" → โพเดียม 🥇🥈🥉 ทุกเครื่อง + แตรฉลอง + โบนัส 100/50/25 + คะแนนรีเซ็ตเริ่มรอบใหม่ (`/class/<map>/podium` — rules publish แล้ว) — version .27
- ✅ **รอบ 48: toast "🎉 เหรียญพอรับน้อง...แล้ว!" เด้งทันทีที่เหรียญข้ามเส้นราคาน้องที่ยังไม่มี** (hook ใน `addCoins` state.js — ครอบทุกทางได้เหรียญ) — version .26
- ✅ **รอบ 47: การ์ดร้านสัตว์เลี้ยงโชว์เป้าหมาย "ขาดอีก 🪙X ≈ เล่นอีก Y คำ"** (เฉพาะการ์ดที่เหรียญไม่พอ · ฐาน 10🪙/คำ) — version .25
- ✅ **รอบ 46: กระดานคะแนนสดใน map 🏆** — มุมซ้ายบน จัดอันดับใครประกอบคำเยอะสุดรอบนี้ (me+เพื่อน · 👑 คนนำ · field `w` ใน `/world`) — version .24 · **rules ชุดเต็มรอ publish**
- ✅ **รอบ 45: หน้าร้านสัตว์เลี้ยงพอดีจอไม่มี scrollbar (fix margin collapse `#app{flow-root}` — ตัด scrollbar 8–12px ทั้งเว็บ) + ลิงก์ 🎮 เข้าเล่นเกมใต้เหรียญ** — version .23
- ✅ **รอบ 44: ไอคอน 🎤 เหนือหัวคนเปิดไมค์ + ปุ่มครูปิดเสียงทั้งห้อง 👩‍🏫** — บัญชีครู=`TEACHER_EMAILS` ใน auth.js · โซน `/class` ใหม่ + `/world` เพิ่ม `m` — version .22 · **rules ชุดเต็มรอ publish**
- ✅ **รอบ 43: Voice chat 🎤 + quick chat + bubble ธีมหลอน** — WebRTC P2P (signaling `/rtc`) · ปุ่ม 🎤(default ปิด)/🔊/🌐-👥(เฉพาะเพื่อน invite) · เสียงเบาตามระยะ · ชิปแตะเดียวส่ง 6 ข้อความ — version .21 · **rules ทั้งชุด (/world+/tinv+/rtc) รอผู้ใช้ publish + เสียงจริงต้องเทสต์ 2 เครื่อง**
- ✅ **รอบ 42: แชทลอยหัวใน map แบบ Roblox 💬** — ปุ่ม 💬/Enter พิมพ์ ≤60 ตัว กรองคำหยาบ โชว์เหนือหัวเพื่อน 5 วิ (field c/ct ใน `/world` เดิม — **rules /world ต้องเพิ่ม c/ct ด้วย ก้อนเต็มใน RULES.md**) — version .20
- ✅ **รอบ 41: โลกผีสิงกลางคืน 👻 + multiplayer 2 โลก + ชวนเพื่อนเงินคืน 2,000** — ตั๋วผี 10,000 (ต้องมีตั๋วแรกก่อน) 25🪙/คำ · ผี 8 ตัวโผล่ 20 วิย้ายที่ สู้ไม่ได้ต้องหนี โดนจับ=jump scare+game over · เสียงหลอนสังเคราะห์ (อัปเกรดได้ด้วยไฟล์ Suno — `PROMPTS_SOUND.md`) · ผู้เล่นอื่นโผล่ใน map (`/world`) · คำชวน (`/tinv`) เจอกันจริงรับคนละ 2,000 — version .19 · **⚠️ รอผู้ใช้ publish rules โซน /world+/tinv (`handoff/RULES.md`) + ทดสอบจริง**
- ✅ **รอบ 40: ข้อ 8 โลกผจญภัย 3D เสร็จ!** — Three.js ฝัง repo (`js/vendor/`) · first-person เก็บตัวอักษรประกอบคำ 15🪙/คำ · minimap เรดาร์ · monster ยิงสู้ได้ · KO→รักษา 1,000 · เข้าจากการ์ดตั๋ว — version .18 · **รอผู้ใช้ทดสอบจริงบน Pages (เดสก์ท็อป+มือถือ touch)**
- ✅ **รอบ 39: ภาพชุดตัวละคร/รูปร่างครบ 11/11** (dragon 3 ภาพสุดท้ายเข้า repo) — version .17
- ✅ **รอบ 38: ตัวละครผู้เลี้ยงโผล่ในฉากเกม (เด้งเชียร์ตอนตอบถูก) + หัวการ์ดสถิติ/สรุปส่งครู** — version .16
- ✅ **รอบ 37: เลือกตัวละครผู้เลี้ยง (ข้อ 4) + การ์ดตั๋วโลกผจญภัย (ข้อ 7) + 🐞 fix sw.js cache 404 รูป** (ภาพเจนใหม่ไม่โผล่ให้ผู้เล่นเก่า — CACHE_VERSION v2) — version .15
- ✅ **รอบ 36: ระบบรูปร่างตามคุณภาพการกิน (ข้อ 5.2 ระบบจริง)** — กินดี 3 มื้อติด=ล่ำ 💪 (+2 EXP/คำ) · ของโทษ 3 มื้อติด=อ้วน 🍩 · อดข้าว 2 มื้อ=ผอมโซ 🦴 · ภาพ 9 ร่างวางใน `img/` เกมโชว์เอง (**ผู้ใช้กำลังทยอยเจนภาพจาก `PROMPTS_CHARACTERS.md`**) — version .14
- ✅ **รอบ 35: prompt กลุ่ม C (ข้อ 4+5.2 → `PROMPTS_CHARACTERS.md` 11 ภาพ รอผู้ใช้เจน) + 🛡️ ควิซอาหารปลอดภัย** (ปุ่มเขียวแถบล่าง lobby · รางวัลวันละรอบ +10/ข้อ +25 ครบ 5) — version .13
- ✅ **รอบ 34: คิว 7725691507 ข้อ 5.1 แยกอาหารคน/สัตว์ + พิษสะสม เสร็จ** (version .12) — เมนู 2 ชุดตามชนิดสัตว์ · เตือนก่อนป้อนอาหารโทษ · บาร์พิษไม่ลดเอง เต็ม 100 ป่วยทันที · ขับพิษ 1,000 — **รอผู้ใช้ทดสอบจริงบน Pages ทั้ง 2 รอบ**
- ✅ บั๊ก "ของขวัญโดนบัง" แก้เสร็จ + ผู้ใช้ทดสอบจริงยืนยันแล้ว (รอบ 31, version .2) · **ไม่มีบั๊กค้าง**
- ✅ เกม feature-complete · item 0 สังคมออนไลน์เสร็จครบ 0.1–0.5 (login/ชื่อ/เพื่อน/แชท/ของขวัญ)
- ✅ **rules ชุดเต็ม publish แล้ว 8 ก.ค.** (ครบทุกโซนถึงรอบ 49 — ตรวจ REST แล้ว) · ⚠️ **ค้างฝั่งผู้ใช้:** ทดสอบจริง 2 บัญชี/2 เครื่อง (ของขวัญ + โลก 3D ทุกระบบ online — checklist ใน TASKS.md) + (ถ้าต้องการ) เจนเสียงผีจาก Suno (`PROMPTS_SOUND.md`)
- 🎯 งานถัดไป: เลือกจาก `handoff/TASKS.md` → backlog (item 8 รายได้ออนไลน์ · item 2 ตลาดออนไลน์ · item 3 daily quest)

## 🧪 testkit — mock login เทสต์ preview (copy วางใน 1 eval ได้เลย)
เกมบังคับ Google login (login จริงใน preview ไม่ได้) — ก้อนนี้จำลองครบ:
```js
window.authFetchCloud=()=>Promise.resolve(null);      // cloud ว่าง (หรือคืน {data,at} จำลองเซฟ)
window.authWriteCloud=()=>Promise.resolve();          // กันเขียน DB จริง
window.authDeleteCloud=()=>Promise.resolve();
window.authWriteProfileName=()=>Promise.resolve();    // กันเขียน /users/<uid>/profile/name
window.onlineStart=()=>{};                            // กัน presence/leaderboard เขียนจริง
authOnLogin({uid:'test1',email:'t@test.com'});        // → เข้าหน้าลงทะเบียน เล่นต่อได้
```
- **เพื่อน/แชท/ของขวัญ:** ตั้ง `Online.ready=true` + fake `Online.db={ref:path=>({...})}` (firebase SDK โหลดจริงบน localhost ได้ · ServerValue.TIMESTAMP ใช้ได้) — fake db ต้องรองรับ push/on/off/once/update/orderByKey/limitToLast/get/set/remove/child
- **จบงานล้างเสมอ:** `localStorage.removeItem('petVocabAdventure_v1')` + reload คืนหน้า login

## 🖥️ preview gotchas (เจอซ้ำทุกรอบ — อ่านก่อนเทสต์)
- server ชื่อ **`english-pet-game`** (python http.server, config ใน `.claude/launch.json`) · **ไม่มี Node มีแต่ Python 3.12**
- **จอ preview เป็นจัตุรัส → ถูกมองเป็น portrait → เกมเด้ง overlay "หมุนจอ" (`#rotate-overlay`) มาบัง** · แก้: `preview_resize` เป็น **landscape** (เช่น 1000×640 หรือ 1280×720) ก่อนเสมอ
- **screenshot/`elementFromPoint` มี scale mismatch เชื่อไม่ได้** (แอพ render เล็กมุมบนซ้าย) → วัดขนาด/ตำแหน่งด้วย **`getBoundingClientRect`** เท่านั้น
- **http.server cache เหนียวมาก** (แก้ js/css แล้ว reload ยังได้ของเก่า) → force ใหม่ด้วย eval:
  `await fetch('css/style.css',{cache:'reload'}); location.reload();`
- **Pages build หน่วง 2–5 นาที** หลัง push → เช็ก live ก่อนบอกผู้ใช้: `curl -s ".../version.json?t=$(date +%s)"`

## 💾 commit / deploy
- git identity = iamsuperrich2025 / freddommun@gmail.com · push HTTPS credential ในเครื่องใช้ได้ (ไม่มี gh CLI)
- **`git add` เฉพาะไฟล์ที่แก้ · ห้าม `git add -A`** (มี `js/data/vocab/` untracked ของงาน Sonnet ค้าง — ห้ามแตะ)
- **ทุก push บัมพ์ `version.json`** (ผู้ใช้ที่เปิดค้างถึงเห็นแถบ "มีเวอร์ชันใหม่") · commit message ลงท้าย `Co-Authored-By: Claude ...`

## 🗣️ ตอบผู้ใช้
- ไทย สุภาพ ลงท้าย "ครับ" · ใช้ตาราง/emoji ให้อ่านง่าย · กระชับ ไม่เล่าโค้ดยาว · **ท้ายคำตอบเสนอไอเดียต่อยอด** (ผู้ใช้เป็นครู/ผู้ปกครองไทย)

## 🗺️ เปิดไฟล์ไหนเมื่อไหร่ (path เต็ม — เปิดเฉพาะตอนต้องใช้)
| จะทำอะไร | เปิดไฟล์ |
|----------|----------|
| งานถัดไป / อาการบั๊ก(ยืนยัน) vs เดา(ยังไม่พิสูจน์) / backlog สรุป | `C:\Users\rober\english-pet-game\handoff\TASKS.md` |
| สภาพแวดล้อม + ข้อควรระวังหายาก (image probe, ห้ามหลายชุดแต่งตัว, ลิขสิทธิ์) | `C:\Users\rober\english-pet-game\handoff\NOTES.md` |
| แตะ Firebase / publish rules (ส่งเต็มทั้งหน้าเสมอ) | `C:\Users\rober\english-pet-game\handoff\RULES.md` |
| หาไฟล์/ฟังก์ชัน/โครงสร้างโค้ด | `C:\Users\rober\english-pet-game\handoff\ARCHITECTURE.md` |
| แก้ระบบเกม (สัตว์/บ้าน/บิล/แรงค์/โรงงาน/ตลาด/ออนไลน์/ของขวัญ) | `C:\Users\rober\english-pet-game\handoff\GAME_RULES.md` |
| ดูสเปก backlog เต็ม | `C:\Users\rober\english-pet-game\handoff\BACKLOG.md` |
| รอบเก่า 1–30 ทำอะไรไปแล้ว | `C:\Users\rober\english-pet-game\handoff\HISTORY.md` |

## 🔗 ลิงก์
- เกม: https://iamsuperrich2025.github.io/english-pet-game/ · repo: `iamsuperrich2025/english-pet-game` (branch `main`)
- งานมอบ Sonnet: `TASK_VOCAB_SONNET.md` (คำศัพท์) · `TASK_DICTIONARY_SONNET.md` (พจนานุกรม)
