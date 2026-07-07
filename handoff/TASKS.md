# TASKS.md — งานถัดไป + ประวัติรอบ (เปิดตอนเลือกงาน / ตามบั๊ก)

> 📂 ราก `C:\Users\rober\english-pet-game\` · เปิดไฟล์ใช้ path เต็ม · สถานะย่อ + กฎ + testkit อยู่ใน `HANDOFF.md` (อ่านนั่นก่อน)
>
> 🧭 **โครงไฟล์นี้แยก 3 ชั้นเสมอ** — กันไม่ให้ session หน้าหลงเดา:
> **① อาการ (ยืนยันแล้ว)** = เห็นจริง/reproduce ได้ · **② เดา (ยังไม่พิสูจน์)** = สมมติฐาน ห้ามลงมือแก้จนพิสูจน์ · **③ งานถัดไป**

## 🟢 ไม่มีบั๊กค้าง
บั๊ก "ของขวัญโดนบัง" ปิดจบรอบ 31 · **ผู้ใช้ทดสอบจริงยืนยันแล้ว 7 ก.ค.** (กล่องยืนยันเด้งหน้าแผง picker ถูกต้อง ไม่บวม)

## 🎯 งานถัดไป — ▶️ START HERE (session ใหม่)

**โลก 3D ครบ 2 โลกแล้ว (รอบ 40 กลางวัน + รอบ 41 ผีสิง/multiplayer/ชวนเพื่อน) — งานถัดไปรอผู้ใช้เคาะ** จาก backlog ด้านล่าง หรือแก้ feedback หลังผู้ใช้ทดสอบจริง
- ⚠️ **ค้างฝั่งผู้ใช้ (รอบ 41–43): publish Firebase rules ชุดเต็ม (โซน `/world`+c/ct + `/tinv` + `/rtc` — ก้อนเต็ม `handoff/RULES.md`)** ไม่งั้น multiplayer/แชทลอยหัว/คำชวน/voice ถูก reject ทั้งหมด · และถ้าจะอัปเกรดเสียงผี → เจนจาก Suno ตาม `PROMPTS_SOUND.md` วาง `sound/haunt_*.mp3` (ไม่วางก็เล่นได้ เสียงสังเคราะห์ทำงานอยู่แล้ว)
- ⏳ **รอผู้ใช้ทดสอบจริงบน Pages:** โลก 3D ทั้ง 2 โลก เดสก์ท็อป (เมาส์+WASD) และมือถือ landscape (จอยซ้าย+ลากมองขวา+ปุ่มยิง 🔥 เฉพาะโลกกลางวัน) — ยังไม่ได้เทสต์ touch จริงบนอุปกรณ์ + multiplayer 2 เครื่องจริง + งานค้าง .12–.17 เดิม
- 🧪 **testkit โลก 3D:** `Adventure3D._t` มี getter camera()/letters/monsters(=ผีในโหมด haunt)/words/inv/peers/hp/mode/running + `damagePlayer(n)/caught()/give(ch,n)(ยัดตัวอักษร→ประกอบคำอัตโนมัติ)/onPeerData(fakeSnap)(จำลองเพื่อนโผล่)/tinvCheck(uid)/exitWorld()` · เข้าเกม: `Adventure3D.start('adv'|'haunt')` ผ่านปุ่มการ์ดตั๋ว · ระวัง: careTick เด้ง alertBox คนป่วยซ้อนหลายชั้นตอน fake state — ตั้ง `playerFedDay=playerSickDay=mealDayKey(Date.now())` ก่อน

### backlog อื่นที่เหลือ (อ่านสเปกเต็มใน `handoff/BACKLOG.md`)
- 💰 **item 8** รายได้ออนไลน์ +0.01/วิ
- 🏪 **item 2** ตลาดออนไลน์จริง (ซื้อขายข้ามผู้เล่น)
- 🎯 **item 3** daily quest
- 📇 **item 4** การ์ดสรุปส่งครู
- 🆕 **คิว 7725691507 (10 ข้อ · 7 ก.ค.)** — ✅จูนอาหาร/นอน (ข้อ 1,2,3,6 รอบ 33) · ✅อาหารคน-สัตว์+พิษสะสม (5.1 รอบ 34) · ✅prompt ผู้เลี้ยง/รูปร่างสัตว์ (4,5.2 รอบ 35) · ✅การ์ดตั๋ว (7 รอบ 37) · ✅โลกผจญภัย 3D (8 รอบ 40) · เหลือ: โครงโฆษณา/Play Store (9,10) → สเปกเต็มท้าย `handoff/BACKLOG.md`

## ⏳ ค้างฝั่งผู้ใช้ (ทำเองบน Firebase console — ไม่เกี่ยว session ใหม่ นอกจากผู้ใช้ถาม)
- publish Security Rules โซน `/gifts` (ก้อนเต็ม `handoff/RULES.md`) · ทดสอบ flow ส่ง-รับของขวัญเต็ม 2 บัญชี (บัญชีเทสต์มี 0 เหรียญ ยังไม่ได้ส่งจริงครบวง)

## ⚠️ ค้างฝั่งผู้ใช้ (ต้องทำเองบน console/มือถือ)
1. **publish Security Rules ใหม่** (เพิ่มโซน `/gifts` + `/world` + `/tinv` — ก้อนเต็มใน `handoff/RULES.md`) ไม่งั้นส่งของขวัญ/multiplayer/คำชวนถูก reject · ก้อนนี้ครอบ av/ni ใน /leaderboard ด้วย
2. **ทดสอบจริง 2 บัญชี:** ส่ง-รับของขวัญ + แชท + self-heal เพื่อน + กล่องยืนยันของขวัญไม่บวม (fix รอบ 31) + **โลก 3D เจอกันใน map + คำชวน+เงินคืน 2,000 (รอบ 41)**
3. (ถ้าต้องการ) เจนเสียงหลอนจาก Suno ตาม `PROMPTS_SOUND.md` → วาง `sound/haunt_ambient.mp3 / haunt_chase.mp3 / haunt_scare.mp3`

## 📌 ประวัติรอบล่าสุด (เก่ากว่านี้อยู่ `handoff/HISTORY.md`)

**✅ รอบ 46 (8 ก.ค. · Fable): กระดานคะแนนสดใน map 🏆 — version→.24**
- **`/world` เพิ่ม field `w`** = จำนวนคำที่ประกอบได้รอบนี้ (sessionWords — แนบใน sendPos · completeWord → sendPos(true) ประกาศทันที) · rules /world เพิ่ม validator w (≥0) — **รอ publish รวมชุดเดิม**
- **`#adv-board` มุมซ้ายบน (ดันแผงคำลง top:132px):** จัดอันดับ me+เพื่อนใน map ตาม w มาก→น้อย · ที่ 1 ได้ 👑 (เฉพาะ w>0) · แถวตัวเองไฮไลต์เขียว `.me` · โชว์ top 4 — เราหลุดอันดับ → แถว `⋯` + แถวตัวเองพร้อมอันดับจริงต่อท้าย · วาดใหม่เมื่อ: เข้าโลก/ประกอบคำ/เพื่อน w เปลี่ยน (onPeerData)/เพื่อนออก (removePeer)
- 📝 commit `4c38737` รอบนี้เก็บงานรอบ 45 ของ session คู่ขนานที่ค้างไม่ได้ commit ให้ด้วย (โค้ด lobby.css/index.html/main.js — docs ติดไปกับ 24bd972 แล้ว)
- ✅ ทดสอบ preview (โลกกลางวัน · mock login): เริ่มเกมกระดานโชว์ตัวเอง 0 · เพื่อน fake 2 คน → เรียงถูก 👑 ที่คนนำ + me ไฮไลต์ · เราประกอบคำ → คะแนนขยับขึ้นกระดาน · เพื่อนอัปเดตแซง (child_changed) → มงกุฎย้ายทันที · เพื่อน 5 คนเราหลุด top 4 → "⋯ 6. Tester" · rect: กระดานจบ 131px แผงคำเริ่ม 132px ไม่ทับ · ไม่มี console error · ⚠️ screenshot tool ค้างอีก ใช้ rect ยืนยัน (กฎทอง 3)

**✅ รอบ 45 (8 ก.ค. · Fable): หน้าร้านสัตว์เลี้ยงพอดีจอไม่มี scrollbar + ลิงก์เข้าเล่นเกมใต้เหรียญ — version→.23**
- **บีบหน้าร้าน (`#screen-select`) พอดีจอเดียว:** ชุด CSS ใหม่ใน lobby.css — h1/subtitle/egg-name/egg-desc ใช้ `clamp(..dvh..)` · `egg-img` สูง `clamp(56px,18dvh,104px)` · margin/padding แผง+การ์ดลดลง → จอเตี้ยสุด 360px ก็ไม่มี scrollbar ในแผง
- **🐞 root cause "ทั้งหน้า scroll ได้ 8–12px" (เป็นทุกหน้า ไม่ใช่แค่ร้าน):** margin ของ `.screen.active` collapse ทะลุ `#app`+`body` ขึ้นไปดัน `<html>` สูงเกิน viewport → แก้จุดเดียว `#app{display:flow-root}` (lobby.css) ตัด scrollbar ทั้งเว็บ
- **ลิงก์ใต้เหรียญ:** index.html ห่อ coin-pill ด้วย `.petshop-topright` + ปุ่ม `#btn-petshop-play` "🎮 เข้าเล่นเกมสะสมเหรียญ" (สไตล์ลิงก์ขีดเส้นใต้) → main.js ผูก `startGame(null)` (เกมจับคู่คละระดับ เหมือนปุ่มเล่นใน lobby)
- ✅ ทดสอบ preview (mock login · 868×390 และ 740×360): แผง scrollHeight=clientHeight + page scroll ไม่ได้ (scrollY ค้าง 0) · ลิงก์อยู่ใต้เหรียญชิดขวา · คลิกลิงก์เข้า screen-game จริง · dashboard ที่วัดได้สูงเกิน 10px = แอนิเมชัน fadeIn ค้างเฟรมแรกเพราะแท็บ preview ถูกซ่อน (document.hidden — เครื่องจริงไม่เป็น) · ไม่มี console error · ⚠️ screenshot tool ค้างอีกรอบ ใช้ getBoundingClientRect ยืนยันแทน (กฎทอง 3)

**✅ รอบ 44 (7 ก.ค. · Fable): ไอคอน 🎤 เหนือหัว + ครูปิดเสียงทั้งห้อง 👩‍🏫 — version→.22**
- **🎤 เหนือหัว:** `/world` เพิ่ม field `m` (0/1 สถานะไมค์ — แนบใน sendPos · setMic → sendPos(true) ทันที) → เพื่อนเห็น sprite 🎤 ลอยดุ๊กดิ๊กเหนือหัว (y=2.72 · ใต้ bubble) สร้าง/ลบใน onPeerData ตาม m · texture 🎤 มาจาก cache — dispose เฉพาะ material
- **👩‍🏫 ครูคุมห้อง:** บัญชีครู = อีเมลใน **`TEACHER_EMAILS` (js/auth.js — user คือ freddommun@gmail.com เพิ่มแล้ว)** + helper `isTeacher()` · ปุ่มแดง `#adv-tmute` (เห็นเฉพาะครู · updateVoiceBtns คุม) → เขียน `/class/<map>/muteAll={on,by,ts}` (โซนใหม่) · ทุก client ฟัง on('value'): on=true → ตัดไมค์เด็กที่เปิดค้าง + ล็อกปุ่ม ("🎤 ครูปิด" ส้ม `.v-lock`) + banner แจ้ง · เด็กเข้าทีหลังก็โดน (สถานะค้างใน DB) · ครูเองไม่ติดล็อก · off → banner "เปิดเสียงห้องแล้ว" เด็กเปิดไมค์เองได้
- ⚠️ **rules /class ยอมให้ทุก auth เขียน** (UI ซ่อนปุ่มจากเด็ก — ยอมรับระดับเดียวกับ coins ฝั่ง client) · RULES.md อัปเดตแล้ว (/world +m · /class ใหม่)
- ✅ ทดสอบ preview: เด็ก (t@test.com) ปุ่มครูซ่อน · roomMuted → ปุ่มไมค์ "ครูปิด"+setMic(true) โดนบล็อก · ปลดล็อกคืนปกติ · เพื่อน m=1 → 🎤 โผล่+ลอยตาม, m=0 → หาย · push อีเมลเข้า TEACHER_EMAILS → เข้าใหม่เห็นปุ่ม "👩‍🏫 ปิดเสียงห้อง" กดตอนออฟไลน์ toast ไม่ crash · ครูไม่ติด guard · ไม่มี console error · **ของจริง (ครูกด→ไมค์เด็กดับทั้งห้อง) ต้องเทสต์ 2 เครื่องบน Pages หลัง publish rules**

**✅ รอบ 43 (7 ก.ค. · Fable): Voice chat ใน map 🎤 + quick chat + bubble ธีมหลอน — version→.21**
- **Voice chat (WebRTC P2P mesh):** เสียงพูดวิ่งตรงระหว่างเครื่อง (ไม่ผ่าน Firebase — ฟรีเหมือนเดิม) · signaling ผ่านโซนใหม่ `/rtc/<map>/<toUid>/<msgId>={f,t:'offer'|'answer'|'ice',d,ts}` ผู้รับอ่าน+ลบกล่องตัวเอง · uid น้อยกว่าเป็นผู้ offer (กัน glare) · `addTransceiver('audio')` ตั้งแต่ต่อสาย → เปิด/ปิดไมค์ใช้ `replaceTrack` ไม่ต้อง renegotiate · STUN Google ฟรี ไม่มี TURN (NAT บางเจ้าต่อไม่ติด — ยอมรับ)
- **ปุ่ม HUD ขวา 3 ปุ่ม (`.adv-vbtn`):** 🎤 เปิด/ปิดไมค์ (**default ปิดทุกครั้งที่เข้า — ความปลอดภัยเด็ก ไม่จำ**) · 🔊/🔇 ลำโพง (ปิด = mute audio ทุกสาย) · 🌐 ทุกคน/👥 เพื่อน (เฉพาะที่ invite กันใน map นี้ — `tinvLinked()` เช็ก tinvSent+Online.tinv · สลับโหมดตัดสาย/ต่อสายทันที + ไม่รับ offer คนนอก) · spk+mode จำใน `state.voiceSpk/voiceMode`+migration · เสียงเบาตามระยะ (volume=1.15-d/45 ใน tickPeers) · exitWorld → ปิด pc ทุกสาย + `track.stop()` คืนไมค์ให้เครื่อง
- **Quick chat (ไอเดียต่อยอด 1):** แถวชิป 6 ข้อความใน `#adv-chat-box` (สวัสดี/มาทางนี้/ไปเก็บคำกัน/ช่วยด้วย/เก่งมาก/หนีเร็ว!!) แตะเดียวส่งเลย — เด็กเล็กพิมพ์ช้า+ปลอดภัย
- **Bubble ธีมหลอน (ไอเดียต่อยอด 2):** โหมด haunt — bubble/echo/ชิป เป็นกรอบดำ ตัวเขียวเรืองแสง (#7cffb0 + shadowBlur)
- **RULES.md เพิ่มโซน `/rtc`** (รวม /world c/ct + /tinv — **ผู้ใช้ยังไม่ publish ทั้งชุด**)
- ✅ ทดสอบ preview (โลกผี): ปุ่ม 3 ปุ่มโผล่+สถานะเริ่มถูก (ไมค์ปิด/ลำโพงเปิด/ทุกคน) · สลับลำโพง/โหมดจำใน state · `allowed()` โหมดเพื่อน: invited=true คนแปลกหน้า=falsy · ชิป quick chat ส่ง echo+ปิดกล่อง · bubble ธีมหลอนสร้างได้ · pc ensure/drop สะอาด · setMic ใน preview ไม่มีสิทธิ์ → toast ไม่ crash · ไม่มี console error · **เสียงจริง 2 เครื่องต้องเทสต์บน Pages (ผู้ใช้)**

**✅ รอบ 42 (7 ก.ค. · Fable): แชทลอยหัวใน map แบบ Roblox 💬 — version→.20**
- **ส่ง:** ปุ่ม 💬 ใต้ปุ่มออก (หรือกด Enter บนเดสก์ท็อป) → กล่องพิมพ์ ≤60 ตัว → ผ่าน `nameHasBadWord` ก่อนส่ง → echo ของตัวเองโผล่ล่างจอ 5 วิ · แนบไปกับ `/world` เดิมเป็น field `c`(ข้อความ)+`ct`(Date.now ฝั่งส่ง คงที่ต่อข้อความ) ระหว่างยังสด ≤6 วิ — **ไม่มีโซน DB ใหม่ แต่ rules /world ต้องเพิ่ม validator c/ct (รอผู้ใช้ publish รอบเดียวกับ /world+/tinv)**
- **รับ:** `onPeerData` เห็น ct เปลี่ยน = ข้อความใหม่ → `bubbleSprite` (canvas ตัดคำ ≤2 บรรทัด กรอบขาวมน) ลอยเหนือหัวเพื่อน y=3.1 ตามตัวเดิน 5 วิแล้วหาย (จัดการใน tickPeers) · ct เดิมส่งซ้ำกับ position ไม่เด้งซ้ำ
- **กันชนกับเกม:** พิมพ์ในช่อง = WASD ไม่ขยับตัว (stopPropagation + guard INPUT ใน keydown) · Enter ส่ง/Esc ปิด · touchstart ข้ามปุ่ม/กล่องแชท (ไม่แย่งจอย) · เปิดกล่องปลด pointer lock อัตโนมัติ · exitWorld ปิดกล่อง+ล้าง myChat
- **🐞 fix ระหว่างทาง:** toggleChatBox เช็ก `style.display` inline (ว่างตอนแรก) → เปิดครั้งแรกไม่ขึ้น — แก้เป็น getComputedStyle · **เพิ่ม `_t.step(dt)` กลับมา** (รอบ 41 ทำหาย) เดินเกมเองตอน rAF ไม่ fire ใน preview
- ✅ ทดสอบ preview (โลกผี · mock login): ปุ่ม/Enter เปิด · Esc ปิด · ส่งแล้ว echo+ปิดกล่อง · คำหยาบโดนกัน · เพื่อน (fake onPeerData) bubble โผล่เหนือหัว ct=111 · ct ซ้ำไม่เด้งซ้ำ · ct ใหม่เด้งใหม่ · หมดอายุ 5 วิหายผ่าน step() · พิมพ์ w ตัวไม่เดิน · ไม่มี console error · ⚠️ screenshot tool ค้าง ใช้ DOM ยืนยันแทน (กฎทอง 3)

**✅ รอบ 41 (7 ก.ค. · Fable): โลกผีสิงกลางคืน 👻 + multiplayer 2 โลก (สไตล์ Roblox) + ชวนเพื่อนเงินคืน 2,000 — version→.19**
- **ผู้ใช้เคาะสเปก (AskUserQuestion):** ตั๋วผีสิง 10,000 · ต้องมีตั๋วโลกผจญภัยก่อน · รางวัล 25🪙/คำ · jump scare เต็มที่ (มีเด็กประถมแต่ผู้ใช้เลือกเต็ม)
- **โลกผีสิง (adventure3d.js รีแฟคเป็น MODES adv/haunt — ฉาก static แยก cache ต่อโหมด):** กลางคืนหมอกดำ+พระจันทร์+ต้นไม้ตาย+หลุมศพ+ฟักทอง+วิญญาณเขียว · **ผี 8 ตัว (👻💀🧟) โผล่ตัวละ 20 วิแล้วสุ่มย้ายที่** (fade in/out 0.6 วิ) · เกิดใกล้ (<18m)/เดินเข้าใกล้ (<11m) → ไล่ 5.0 m/s (ผู้เล่น 6 หนีทัน) + วูบเสียง whoosh+สั่น · **สู้ไม่ได้** (ซ่อนปุ่มยิง/crosshair/HP bar) ต้องหนีจนผีครบ 20 วิหายเอง — HUD นับถอยหลัง "หนี! อีก X วิ" + ขอบจอแดง pulse + เสียงหัวใจเต้นเร่งตามระยะ · **โดนแตะ = game over ทันที**: jump scare 👻 เต็มจอ+จอสั่น+เสียงกรีด+สั่น 400ms → advHurt=true รักษา 1,000 (ใช้ร่วมกับโลกกลางวัน) · คำแยกคลัง `state.hauntDone`
- **เสียงหลอน `HSound` (Web Audio สังเคราะห์ ปลอดลิขสิทธิ์):** ambient ลมหอน noise+lowpass LFO + drone 55Hz คู่เพี้ยน + โน้ตหลอนสุ่ม · heartbeat ตุบ-ตับเร่งตามระยะผี · wail ผีหวีดตอนไล่ · whoosh ตอนโผล่ · scream ตอนโดนจับ · **probe `sound/haunt_ambient/chase/scare.mp3` ด้วย Audio element — มีไฟล์ (เจนจาก Suno ตาม `PROMPTS_SOUND.md` ใหม่) สลับใช้อัตโนมัติ** · เคารพ state.sound ทุกจุด
- **Multiplayer 2 โลก:** `/world/<map>/<uid>={n,av,x,z,yaw,ts}` เขียน ~5.5Hz เฉพาะตอนขยับ + onDisconnect ลบ · เพื่อนโผล่เป็น sprite ป้ายชื่อ+ภาพ player_male/female (fallback อีโมจิ) เดิน lerp นุ่ม + จุดเขียวใน minimap + banner "X อยู่ในโลกนี้ด้วย!" · letters/ผี/monster ไม่ sync (ของใครของมัน — เห็นตัวกันอย่างเดียวสไตล์ presence)
- **ชวนเพื่อน+เงินคืน:** ปุ่ม 📨 บนการ์ดตั๋วทั้ง 2 ใบ → picker รายชื่อเพื่อน (จุดเขียวออนไลน์) → เขียน `/tinv/<toUid>/<fromUid>={map,n,ts}` + จำฝั่งส่งใน `state.tinvSent` · ผู้รับเห็น toast+ป้ายเหลืองบนการ์ด (`tinvNoticeHTML`) · **เจอกันใน map จริงครั้งแรก → ต่างคนต่างรับ +2,000 (`TINV_CASHBACK` ครั้งเดียว/map ใน `state.tinvClaimed`)** แล้วผู้รับลบคำเชิญ · online.js เพิ่ม `tinvSend/tinvClear/tinvWatch` (watch ตั้งใน onlineStart)
- **จุดแก้อื่น:** items.js `HAUNT_PRICE/TINV_CASHBACK` · state.js `hauntTicket/hauntDone/tinvClaimed/tinvSent`+migration+assetValue รวมตั๋วผี · index.html `#haunt-card` · ui.js `renderHauntCard` (4 สถานะ)+`buyHauntTicket/enterHaunted3D/openTinvPicker/tinvNoticeHTML`+ล้างข้อความ 🚧 เก่า · style.css `.tinv-note` · sw.js cache-first เพิ่ม mp3/wav/ogg · **RULES.md เพิ่มโซน `/world`+`/tinv` (รอผู้ใช้ publish!)**
- ✅ ทดสอบ preview (mock login ป.3): การ์ดผีล็อกจนมีตั๋วแรก → ซื้อ 2 ตั๋ว 45000→35000 + assetValue รวม · โลกกลางวันเดิมปกติ (10 คำ/ประกอบ button +15/ยิงได้) · จำลองเพื่อนโผล่ → sprite+เช็กคำชวน → +2,000 ครั้งเดียว · โลกผี: ผี 8/ซ่อน HP+ยิง/ผีไล่จริง+นับถอยหลัง+ขอบแดง/ครบ 20 วิย้ายที่ไกล/`caught()` → scare เต็มจอ+สั่น+KO "โดนผีจับ!" → advHurt · รักษา 1,000 จากการ์ดผีได้ · ไม่มี console error · ⚠️ ระวัง alertBox คนป่วยเด้งซ้อนตอน fake state (ดู testkit)

**✅ รอบ 40 (7 ก.ค. · Fable): ข้อ 8 โลกผจญภัย 3D (First-person เก็บตัวอักษรประกอบคำ) — version→.18**
- **ผู้ใช้เคาะสเปก (AskUserQuestion):** Three.js ฝังไฟล์ใน repo · monster สู้กลับได้ (ยิง) · รางวัล 15🪙/คำ
- **ไฟล์ใหม่:** `js/vendor/three.min.js` (r149 UMD 594KB — global THREE) + `js/adventure3d.js` (โมดูลทั้งโลก self-contained ฝัง CSS เอง ไม่แตะ index.html) — **โหลด dynamic ตอนกดเข้าเท่านั้น** (`loadScriptOnce` ใน ui.js) หน้าหลักไม่หนักขึ้น
- **โลก 3D:** แผนที่ 120×120 รั้ว/ต้นไม้/หิน (มี collision) · ตัวอักษร ~65 sprite ลอย เดินชนเก็บ (spawn จากตัวอักษรของ 10 คำ guideline + `ensureCoverage()` เติมที่ขาด) · ครบเวลา 75 วิ ตัวอักษรที่ไม่ถูกเก็บสุ่มย้ายที่ (8.2) · **ประกอบคำอัตโนมัติ**เมื่อมีตัวอักษรครบ (นับซ้ำ เช่น swimming ต้องมี m×2) → +15🪙 + banner คำ+คำแปล + เติมคำใหม่ครบ 10 (8.4) · คำจาก `vocabForStudent()` กรอง `/^[a-z]{2,9}$/` ไม่ซ้ำ `state.advDone` — ครบทุกคำของระดับชั้นแล้วล้างเริ่มรอบใหม่ (8.6)
- **minimap เรดาร์** (canvas กลม ขวาบน): จุดทอง=ตัวอักษร แดง=monster สามเหลี่ยมขาว=ผู้เล่นหันตามทิศ (8.3)
- **monster** (sprite อีโมจิ 👾🕷️🦇👻 สูงสุด 4 ตัว เกิดทุก 16 วิ): เดินสุ่ม เห็นผู้เล่นระยะ 15 → ไล่ (ช้ากว่าผู้เล่น 3.4 vs 6) ชนแล้ว -10 HP/1.2วิ + เด้งถอย · **ยิงสู้ได้** (คลิก/ปุ่ม 🔥) 2 นัดแตก +2🪙 · HP หมด → `state.advHurt=true` กลับ Lobby การ์ดตั๋วเปลี่ยนเป็นปุ่ม "💊 รักษาตัว 1,000" (8.5)
- **ควบคุม:** เดสก์ท็อป pointer lock+WASD+คลิกยิง (Esc ปลดเมาส์ค่อยกดออก) · มือถือ จอยสติ๊กซ้าย+ลากมองครึ่งขวา+ปุ่มยิง · ปุ่ม 🚪 ออก → askConfirm (พักเกมระหว่างถาม ยกเลิกเล่นต่อ) (8.6)
- **จุดแก้อื่น:** state.js `advDone/advHurt`+migration · ui.js การ์ดตั๋ว 3 สถานะ (เข้าโลก/บาดเจ็บ/ล็อก)+`enterAdventure3D`+`advHealClick` · style.css `.big-btn.green/.red` · sw.js CACHE_VERSION v3 + `js/vendor/` เป็น cache-first + SHELL เพิ่ม 2 ไฟล์ใหม่
- ✅ ทดสอบ preview (mock login ป.5): เข้าโลก/คำ 10 คำระดับถูก/เก็บตัวอักษร/ประกอบ "swimming" +15/advDone กันซ้ำ/ย้ายที่ 5/5/ยิง monster 2 นัด +2/KO→การ์ดรักษา→จ่าย 1,000 หาย/dialog ออกพัก-เล่นต่อ/กลับ lobby toast สรุป · ไม่มี console error · **ยังไม่ได้เทสต์ touch บนอุปกรณ์จริง**

**✅ รอบ 39 (7 ก.ค. · Fable): ภาพชุด PROMPTS_CHARACTERS ครบ 11/11 + เตรียม handoff ข้อ 8 — version→.17**
- ผู้ใช้เจนภาพครบ: dragon_adult_fat/thin/strong เข้า repo (รวม player 2 + รูปร่าง 9) — ระบบรูปร่าง/ตัวละครมีภาพจริงครบทุกชนิดทุกร่างแล้ว
- อัปเดต ▶️ START HERE: งานถัดไป = **ข้อ 8 โลกผจญภัย 3D** (New session ตามที่ผู้ใช้เคาะ) พร้อมสรุปสเปก+จุดเชื่อม advTicket+ทางเลือก engine ที่ต้องเคาะ

**✅ รอบ 38 (7 ก.ค. · Fable): ตัวละครผู้เลี้ยงโผล่ในฉากเกม + การ์ดสรุปส่งครู — version→.16**
- **ฉากเกมจับคู่:** `#game-avatar` ใน game-top (index.html) — game.js startGame ใส่ `playerAvatarHTML('')` (ยังไม่เลือกตัวละคร = ซ่อน) · ตอบถูก → เด้งเชียร์ class `.cheer` (keyframe `avatarCheer` เคารพ no-anim อัตโนมัติ)
- **การ์ดสถิติ/สรุปส่งครู (renderStats):** หัวการ์ดเปลี่ยน 👧 → avatar จริง + ต่อท้ายชื่อในเกม `(profileName)` + escapeHTML ชื่อจริงที่เดิมไม่ได้ escape
- `playerAvatarHTML(fallback)` รับ fallback ต่อจุด (chip '📛' · เกม '' · สถิติ '👧')
- **ภาพจากผู้ใช้เพิ่ม 2:** cat_adult_thin/strong (รวม 8/11 — เหลือ dragon fat/thin/strong)
- ✅ ทดสอบ preview (mock login): เกมโชว์ภาพ player_female + เด้ง cheer ตอนจับคู่ถูก · สถิติโชว์ภาพ+ชื่อเล่น "(Tester)" · ไม่เลือกตัวละคร → เกมซ่อน/สถิติ fallback 👧 · ไม่มี console error

**✅ รอบ 37 (7 ก.ค. · Fable): เลือกตัวละครผู้เลี้ยง (ข้อ 4 ระบบจริง) + การ์ดตั๋วโลกผจญภัย (ข้อ 7) + fix sw.js cache 404 — version→.15**
- **ข้อ 4:** บังคับเลือกตัวละคร ชาย/หญิง ตอนลงทะเบียน (`#reg-avatar`) · เปลี่ยนได้ในตั้งค่า · โชว์ในแถบโปรไฟล์ (ภาพ `player_male/female.png` ที่ผู้ใช้เจน — มีแล้วทั้ง 2 ไฟล์ · ไม่มีภาพใช้อีโมจิ) · เฉพาะในเครื่อง ไม่ sync cloud
- **ข้อ 7:** การ์ด `#ticket-card` ในร้านค้า ตั๋ว 🎫 5,000 — ล็อกจนมีสัตว์ Lv.3 · ตั๋วเฉพาะตัวขายต่อ/ส่งต่อไม่ได้ · นับ assetValue · โลก 3D ยังไม่เปิด โชว์ 🚧 กำลังก่อสร้าง (ข้อ 8 ค่อยผูกตั๋วเข้าใช้จริง)
- **🐞 fix sw.js สำคัญ:** เดิม cache รูป 404 ถาวร → **ภาพที่เจนเพิ่มทีหลังไม่มีวันโผล่ให้ผู้เล่นเก่า** (เจอตอนเทสต์: dog_adult_fat.png วางแล้วแต่ SW ตอบ 404 เก่า) · แก้ cache เฉพาะ res.ok ทั้งรูป+โค้ด + บัมพ์ CACHE_VERSION v1→v2 ล้างของเสีย
- **ภาพจากผู้ใช้เข้าแล้ว 3 ไฟล์:** player_male/female.png + dog_adult_fat.png (คอมมิตพร้อมรอบนี้) — เหลืออีก 8 ภาพร่างกำลังทยอยเจน วางแล้วเข้าเกมเอง
- ✅ ทดสอบ preview (mock login): ไม่เลือกตัวละคร→สมัครไม่ผ่าน · เลือกแล้วไฮไลต์+สมัครผ่าน+chip โชว์ภาพจริง · สลับตัวละครในตั้งค่าเปลี่ยน chip ทันที · ตั๋ว: ไม่มีสัตว์/ยังเด็ก=ล็อก · โตแล้วซื้อได้ -5,000 + assetValue +5,000 + การ์ด "มีตั๋วแล้ว" · ร่าง fat โชว์ภาพ dog_adult_fat จริงบน hero · strong (ยังไม่มีภาพ) fallback ภาพปกติ · ไม่มี console error · ⚠️ screenshot tool ค้างเฟรมเก่า ใช้ getBoundingClientRect ยืนยันแทน (ตามกฎทอง)

**✅ รอบ 36 (7 ก.ค. · Fable): ระบบรูปร่างตามคุณภาพการกิน (ผูกภาพข้อ 5.2 เข้าเกมจริง) — version→.14**
- **กติกา (โปร่งใสสำหรับเด็ก):** กินสะอาดเต็มหลอด 3 มื้อติด = **ล่ำกำยำ 💪** (EXP แถม +2/คำใน checkMatch) · มื้อที่มีอาหารโทษปน 3 มื้อติด = **อ้วนกลม 🍩** · ป่วยเพราะอดข้าว 2 มื้อ = **ผอมโซ 🦴** · ลำดับ thin>fat>strong · กลับมากินดีก็ฟื้นได้เสมอ
- **state.js:** `p.shape/junkMeals/cleanMeals/missedMeals/mealJunk/shapeSlot` + migration · `petShapeOf/updatePetShape/shapeMealDone` (นับครั้งเดียว/slot — feast ตุนพรุ่งนี้ไม่นับมื้อพรุ่งนี้) · hook careTick: hunger sick → missedMeals++ · ขึ้นมื้อใหม่รีเซ็ต mealJunk
- **ui.js:** feedWith จด mealJunk + นับมื้อเมื่อเต็มหลอด → showFeedResult แจ้งเปลี่ยนร่าง (ล่ำ/อ้วน/กลับมาปกติ) · การ์ดสัตว์โชว์สถานะร่าง (`SHAPE_UI` + `.shape-text`) + แถบคืบหน้า "กินดีต่อเนื่อง x/3"
- **images.js:** probe `<pet>_adult_fat/thin/strong` (9 คีย์) · currentPetImg ลำดับใหม่ ป่วย>หิว>ดีใจ>ร่าง>ชุด>ปกติ (ไม่มีภาพ→fallback ปกติ ระหว่างผู้ใช้ทยอยเจนภาพ)
- **game.js:** ร่าง strong ไม่ป่วย → exp 5+2 + note "💪 ล่ำกำยำ" · **util.js:** วิธีเล่นเพิ่มหัวข้อรูปร่าง · PROMPTS_CHARACTERS.md อัปเดตหมายเหตุ (9 ภาพร่างผูกแล้ว เหลือ player_male/female เป็นภาพอนาคต)
- ✅ ทดสอบ preview (mock login + fake time ข้ามวัน + บ้านปราสาทกันร้อน): feast×3 มื้อ → strong + แจ้งถูก · นม+feast×3 → มื้อแรก strong→normal (สตรีคขาด) → fat ที่มื้อ 3 (toxin 60 ไม่ทันป่วย) · อดข้าว 2 มื้อ (ป่วย-รักษา-ป่วย) → thin · จับคู่ถูกตอน strong ได้ exp 7 (5+2) จริง · ภาพ fallback ทำงาน (ยังไม่มีภาพร่าง) · ไม่มี console error
- 📝 **ภาพ 9 ร่างผู้ใช้กำลังทยอยเจน** — วางใน `img/` แล้วเกมโชว์เองทันที ไม่ต้องแก้โค้ด

**✅ รอบ 35 (7 ก.ค. · Fable): ไอเดียต่อยอด — prompt กลุ่ม C (ข้อ 4+5.2) + มินิเกมควิซอาหารปลอดภัย — version→.13**
- **ข้อ 4+5.2 (prompt):** ไฟล์ใหม่ `PROMPTS_CHARACTERS.md` 11 ภาพ — ผู้เลี้ยงชาย/หญิง modern fantasy (`player_male/female.png`) + รูปร่างสัตว์ 3 ชนิด×3 ร่าง (`<pet>_adult_fat/thin/strong.png`) สไตล์/หน้าตาตรงชุดเดิมใน PROMPTS.md · ⚠️ เกมยังไม่ดึงภาพชุดนี้ (ระบบอนาคต) เจนเก็บไว้ก่อนได้
- **🛡️ ควิซอาหารปลอดภัย:** ปุ่มเขียวใหม่ `#btn-foodquiz` แถบล่าง lobby (index.html + `.lobby-foodquiz-btn` lobby.css) → `openFoodQuiz()` (ui.js) สุ่ม 5 ข้อจาก (สัตว์ 3 × FOODS 9) ถาม "ให้กินได้ไหม?" เฉลยพร้อมเหตุผลจริง · รางวัลรอบแรกของวัน +10/ข้อ +25 ถูกครบ (`FOODQUIZ_*` state.js · `state.foodQuizDay`+migration) เล่นซ้ำ=รอบฝึกซ้อมไม่ได้เหรียญ (กันฟาร์ม)
- **fix เหตุผลมังกร:** เพิ่ม `whyDragon` (choco/milk ใน pets.js) + helper `foodWhy(food,type)` — ใช้ทั้งป๊อปอัพเตือนก่อนป้อน + เฉลยควิซ (ก่อนแก้ มังกร+นมเฉลยว่า "หมาแมวย่อยนมไม่ได้" ไม่ตรงบริบท)
- วิธีเล่น (openHelp) เพิ่มบรรทัดควิซ · ไฟล์แก้: pets.js/state.js/ui.js/util.js/main.js/index.html/style.css/lobby.css + PROMPTS_CHARACTERS.md ใหม่
- ✅ ทดสอบ preview (mock login): ปุ่มโผล่+กดได้ · เล่นเต็มรอบตอบถูก 5/5 → +75 ตรง (50+โบนัส 25) `foodQuizDay` ตั้ง · โหลดเซฟเดิมเล่นซ้ำ → ขึ้น "รอบฝึกซ้อม" ได้ 0 เหรียญ · `foodWhy` มังกร/หมาแยกถูก · ไม่มี console error

**✅ รอบ 34 (7 ก.ค. · Fable): คิว 7725691507 กลุ่ม B (ข้อ 5.1) แยกอาหารคน/สัตว์ + พิษสะสม — version→.12**
- **ผู้ใช้เคาะสเปก (AskUserQuestion):** พิษเต็ม 100 = ป่วยทันที ขับพิษ/รักษา 1,000 · พิษไม่ลดเอง · เพิ่มเมนูสอนของจริง 🍫🍇🥛 · มังกรกินเผ็ด/เนื้อได้ ขนมหวาน+นมเป็นโทษ
- **pets.js:** FOODS แยก 2 ชุด — ชุดอาหารสัตว์ (แอปเปิ้ล/ไก่/feast + fav) กับชุดอาหารคน 6 อย่าง (`human:true`) · อาหารโทษมี `badFor` ต่อชนิด + `toxin` ต่อชิ้น (คุกกี้25 ก๋วยเตี๋ยว20 เค้ก30 ช็อกโกแลต40 องุ่น35 นม20) + `why` เหตุผลจริงสอนเด็ก · helper `foodBadFor()` · มังกรกินก๋วยเตี๋ยว/องุ่นได้
- **state.js:** `TOXIN_FULL`=100 `DETOX_COST`=1000 · `p.toxin` ใน newPet + migration เซฟเก่า=0
- **ui.js:** เมนูอาหารแบ่ง 2 หัวข้อ (`.food-sec`) + badge ⚠️/✅/☠️ ต่อชิ้น · อาหารโทษ → askConfirm เตือน (เหตุผล+พิษ 0→N/100) กดรับทราบถึงกิน · feedWith สะสม toxin ครบ 100 → ป่วยทันที cause `'toxin'` (กล่องผลลัพธ์โชว์พิษ+ป่วย ปุ่ม "พาไปหาหมอ") · บาร์พิษม่วง `.toxin-fill` โชว์เมื่อ toxin>0 + ปุ่ม `#btn-detox` ขับพิษ 1,000 (`detoxPet` ซ่อนตอนป่วย) · `curePet` ล้าง toxin เฉพาะ cause toxin · sick-banner เพิ่มข้อความ toxin
- **util.js:** วิธีเล่นเพิ่มหัวข้อ "☠️ อาหารคน vs อาหารสัตว์" · **style.css:** .toxin-*/.detox-btn/.food-sec/.food-bad/.bad-tag/.fd-toxin/.fd-safe
- ✅ ทดสอบ preview (mock login + fake 18:30): เมนูหมาโชว์อาหารคน 6 อย่างเป็นโทษ / มังกรกินก๋วยเตี๋ยว+องุ่นได้ · เตือนก่อนกิน ยกเลิกได้ · choco×3 → 40/80/ป่วยที่ 100 + กล่องแจ้งถูก · รักษา 1,000 ล้างพิษ · นมมังกร +20 → บาร์+ปุ่มขับพิษโผล่ → ขับพิษ -1,000 บาร์หาย · วิธีเล่นหัวข้อใหม่มา · ไม่มี console error
- 📝 ข้อ 5.2 (prompt รูปร่างสัตว์ อ้วน/ผอมโซ/ล่ำ) ยังไม่ทำ — เป็นงาน prompt กลุ่ม C

**✅ รอบ 33 (7 ก.ค. · Opus): คิว 7725691507 กลุ่ม A (ข้อ 1,2,3,6) มื้อเย็น 18:00 + ความอิ่มสะสม + การนอน + ข้าวเย็นคน — version→.11**
- **ผู้ใช้เคาะสเปก (AskUserQuestion):** กินไม่ทัน 2 ชม. (20:00)=ป่วย · นอนได้ 20:00 ตื่น 06:00 · คนไม่กิน=ป่วยรักษา 1,000 · ข้าวเย็นคน 200
- **ข้อ 2:** `currentSlotStart` เปลี่ยนจาก slot 3 ชม. → มื้อเย็นรายวัน 18:00 (`SLOT_MS`=24 ชม. `MEAL_HOUR`=18) · เพิ่ม `mealDayKey`/`nightKeyOf` (state.js)
- **ข้อ 3:** FOODS เพิ่ม `fill` (คุกกี้20 แอปเปิ้ล25 ไก่40 ก๋วยเตี๋ยว50 เค้ก65 เมนูโปรด45 feast100+ตุนพรุ่งนี้) · pet เพิ่ม `fullness/mealSlot` ครบ 100 → `fedUpTo=slot` · หลอดหิวโชว์ความอิ่ม · กล่องกินเสร็จมีปุ่ม "กินต่อ" จนเต็ม
- **ข้อ 1:** pet เพิ่ม `sleeping/sleepSickDay` · ปุ่ม 🌙 `sleepAllPets()` นอนทุกตัว/⏰ ปลุก (ui.js) · careTick: ตื่นเอง 06:00 · 23:00–ตี 6 ไม่นอน → ป่วย cause `sleep` ครั้งเดียว/คืน (`nightKeyOf` กันซ้ำ) · หลับ = feed disabled + badge 💤 + `.pet-asleep` หรี่แสง
- **ข้อ 6:** state เพิ่ม `playerFedDay/playerSick/playerSickDay/playerSickPending` · ปุ่ม 🍚 `#btn-dinner` header (index.html, อัปเดตใน renderClock) กิน 200 ผ่าน `dinnerClick()` · เกิน 20:00 ไม่กิน → ป่วย 🤒 เด้ง alertBox ครั้งเดียว (pending consume ใน renderDashboard) รักษา 1,000 · นับใน `updateSettingsBadge`+แถวใน `openAttentionSummary` (data-act='dinner')
- **Migration กันป่วยย้อนหลัง:** เซฟเก่า (ไม่มี `fullness`) → ถือว่าอิ่มมื้อล่าสุด + `sleepSickDay`=คืนนี้ + `playerFedDay`=มื้อล่าสุด · ผู้เล่นใหม่ตั้ง `playerFedDay` ตอนลงทะเบียน (main.js) · careTick คนป่วยเฉพาะ `state.student` มีแล้ว
- อัปเดตวิธีเล่น (util.js openHelp) ตามกติกาใหม่ · ไฟล์แก้: pets.js/state.js/ui.js/util.js/main.js/index.html/style.css
- ✅ ทดสอบ preview (mock login + fake `Date.now`): หิว 18:30 รีเซ็ต 0 → คุกกี้×2=40 ยังหิว → เค้ก=100 อิ่ม · "กินต่อ" เปิดเมนูซ้ำ · 20:30 ไม่เต็ม→ป่วย hunger · นอน/ปลุก/หลับ badge ครบ · 23:30 ไม่นอน→ป่วย sleep + คนป่วย+alertBox ครั้งเดียว ไม่ป่วยซ้ำ · 06:30 ตื่นเอง · กิน/รักษาคนหักเหรียญถูก · badge ⚙️ นับ +1 + แถวเมนูสรุปกดได้ · migration เซฟเก่า 21:00 ไม่ป่วยย้อนหลัง · ไม่มี console error

**✅ รอบ 32h (7 ก.ค. · Opus): เมนูสรุปโชว์ยอดบิลรวม + badge ย่อยเด้งพร้อมกัน — commit `661e290` · version→.10**
- **badge ย่อยเด้งพร้อมกัน:** รีแฟคเป็น helper `setBadge(el,n)` (js/ui.js) ตั้งเลข+เด้ง `badge-pop` ตอนเลขเพิ่ม เก็บ `_badgeLast[id]` ต่อ badge · ใช้กับ friend/gift/settings badge → เด้งภาพพร้อมกันทั้งเกม · **สั่นครั้งเดียวที่ badge รวมเท่านั้น** (setBadge คืน increased, updateSettingsBadge สั่ง vibrate) กันสั่นซ้ำกับ badge ย่อย · home/shop-bill-badge ยังเป็น '!' คงเดิม (ไม่ใช่เลข)
- **ยอดบิลรวมในเมนูสรุป:** `openAttentionSummary` คำนวณ `billOutstanding` sum ต่อกลุ่ม → sub แต่ละแถวโชว์ "รวม 🪙X" + บรรทัด `.attn-total` ยอดรวมทั้งหมด
- ✅ ทดสอบ preview (mock login): gift+settings เด้งพร้อมกัน สั่น 1 ครั้ง · ยอดบิล บ้าน150+ร้าน300=รวม450 ถูก · ไม่มี console error

**✅ รอบ 32g (7 ก.ค. · Opus): badge ปุ่มตั้งค่า เด้ง+สั่นตอนเลขเพิ่ม + แตะเปิดเมนูสรุป — commit `64f9a1d` · version→.9**
- **เด้ง+สั่น:** `updateSettingsBadge` เก็บ `_lastSettingsN` · เลข "เพิ่ม" (มีของใหม่) → `.badge-pop` (keyframe `badgePop` .45s) + `navigator.vibrate(30)` ครั้งเดียว · ไม่เด้งตอนโหลดแรก/เลขเท่าเดิม/ลด · เคารพ `html.no-anim` (animName→none) + `state.haptic`
- **เมนูสรุป:** แตะ `#settings-badge` → `openAttentionSummary()` (js/ui.js) กล่อง `.attn-box` รายการที่ค้าง (บิลบ้าน→panel-home · บิลร้านค้า net/data→panel-shop · เพื่อน/แชท→panel-friends · ของขวัญ→panel-gifts) แต่ละแถวกด→`openPanel()` ไปหน้านั้น · wire ใน main.js `e.stopPropagation()` กันเปิดหน้าตั้งค่า
- ✅ ทดสอบ preview (mock login): เด้ง/สั่นถูกทุกเคส (เพิ่ม/เท่าเดิม/ลด/haptic ปิด) · เมนู 4 แถวถูก กด→เปิด panel ถูก · แตะ badge เปิดสรุปไม่เปิดตั้งค่า · keyframe computed = badgePop, no-anim = none · ไม่มี console error

**✅ รอบ 32f (7 ก.ค. · Opus): จุดแดงเลขรวมบนปุ่ม ⚙️ ตั้งค่า — commit `2065b8e` · version→.8**
- badge `#settings-badge` บนปุ่ม `#btn-settings` (index.html) แสดง **เลขรวม attention** = บิลค้าง(6 ชนิด, นับจำนวนบิล) + คำขอเพื่อน/แชทใหม่ + ของขวัญที่ยังไม่เปิด (ผู้ใช้เคาะ: รวมของขวัญ + เลขรวม)
- `updateSettingsBadge()` (js/ui.js) ผูกท้าย `updateBillBadges`/`updateFriendBadge`/`updateGiftBadge` → อัปเดตสดทุกจุดที่ badge ย่อยอัปเดต (+ renderDashboard ผ่าน updateBillBadges)
- CSS: `.icon-btn` เพิ่ม `position:relative` · `#settings-badge{top:-7px;right:-7px}` มุมขวาบนปุ่มกลม
- ✅ ทดสอบ preview (mock login + getBoundingClientRect): รวม 6=2บิล+1คำขอ+1แชท+2ของขวัญ ถูก · badge อยู่มุมขวาบนปุ่มจริง เลข "3" · ว่าง→ซ่อน · ไม่มี console error (screenshot tool ค้างทั้ง session ใช้ rect ยืนยันแทน)

**✅ รอบ 32e (7 ก.ค. · Opus): ตั้งค่าเพิ่ม (ปิดแอนิเมชัน+วิธีเล่น) + จุดแดงแจ้งบิลค้าง — commit `35b4762` · version→.7**
- **ปิดแอนิเมชัน:** สวิตช์ "✨ เอฟเฟกต์เคลื่อนไหว" ในตั้งค่า · `state.noAnim` (default false, มี migration) → `html.no-anim` (CSS `animation:none!important;transition:none!important`) · `applyNoAnim()` เรียกใน renderDashboard + ตอนสลับ
- **วิธีเล่น:** ปุ่ม `#set-help` ในตั้งค่า → `openHelp()` กล่องสรุป 7 หัวข้อ (เกมจับคู่/เลี้ยงน้อง/บ้าน+บิล/หาเงิน/แบบทดสอบ/เพื่อน+ของขวัญ/ตั้งค่า)
- **จุดแดงแจ้งบิลค้าง (ผู้ใช้เลือก = จุดแดง ไม่เด้งป๊อปอัพ):** `updateBillBadges()` ใน renderDashboard · badge `#home-bill-badge` (บ้าน: maint/elec/water/trash) · `#shop-bill-badge` (ร้านค้า: net/data) ใช้ `.rail-badge` เดิม แสดง "!"
- **ธีมมืด: ผู้ใช้เลือกข้ามไว้ก่อน** (สไตล์ชีตฝังสีขาว/สีสดเยอะ ทำเต็มเป็นงานใหญ่ + screenshot tool ค้าง verify ยาก) — ถ้าจะทำรอบหน้าต้องแมป hardcoded colors → CSS var ก่อน
- ✅ ทดสอบ preview (DOM/computed): badge บ้าน/ร้านค้าโผล่-หายตามบิลถูก · no-anim ตัด transition .15s→0s จริง · settings anim toggle+state+class ครบ · openHelp 7 หัวข้อ · ไม่มี console error

**✅ รอบ 32d (7 ก.ค. · Opus): หน้าตั้งค่า + กล่องเตือนบริการถูกตัด — commit `c4a1444` · version→.6**
- **หน้าตั้งค่า:** ปุ่ม ⚙️ `#btn-settings` ใน header (index.html) เปิด `openSettings()` (util.js) โมดัลรวมสวิตช์ เสียง/สั่น (`.set-row`/`.set-switch` on/off) แทนปุ่มไอคอน 🔊/📳 2 อันเดิม (ถอดออกจาก header + ลบ handler เดิม main.js + ลบ sound-toggle sync ui.js) · แถวสั่นโผล่เฉพาะ `'vibrate' in navigator`
- **กล่องเตือนบริการถูกตัด:** เดิม `billTick` ตัดบริการเงียบๆ ไม่แจ้งเลย · เพิ่ม `state.pendingCut` (default [], มี migration) push id ตอนตัด (state.js) → `renderDashboard` เรียก `showCutNotice()` (ui.js) เด้ง alertBox รายชื่อบริการที่ถูกตัด+ผลกระทบ (ใช้ UTILITY_UI cutIcon/cutName/cutMsg ครอบ ไฟ/น้ำ/เน็ต/ข้อมูล) · ปุ่ม "ไปจ่ายบิล"
- **บ้านพัง:** `showHomeRuined` เป็นกล่องกลางจอ+รูปบ้านพังอยู่แล้ว ไม่แตะ
- ✅ ทดสอบ preview: settings สลับ+สะท้อน state+ปิดถูก · showCutNotice แสดง 2 บริการ+เคลียร์ pendingCut · integration `billTick` บิลค้าง→powerCut+reset หม้อแปลง+push pendingCut ครบ · ไม่มี console error (screenshot tool ค้างกับ overlay เต็มจอ ใช้ DOM/getBoundingClientRect ยืนยันแทน)

**✅ รอบ 32c (7 ก.ค. · Opus): สวิตช์สั่นแยกจากเสียง + กล่องเตือนสำคัญกลางจอ — commit `044242c` · version→.5**
- **`state.haptic`** (default true, เพิ่มใน DEFAULT_STATE) แยกจาก `state.sound` · ปุ่ม `#haptic-toggle` ใน header (index.html) สลับ 📳/📴 · โผล่เฉพาะเครื่องที่ `'vibrate' in navigator` (main.js `initHapticToggle`) · toast/alert สั่นตาม `state.haptic !== false` ไม่ผูกเสียงแล้ว
- **`alertBox(html, okText)`** (util.js) กล่องเตือนกลางจอ reuse `.levelup-overlay` (z100) + `.alert-box` ขอบแดง + `.alert-ok` ปุ่มแดง · แตะพื้นหลัง/ปุ่ม = ปิด · แตะในกล่องไม่ปิด · เล่น sfx.wrong + สั่น
- ใช้ alertBox กับ "น้องป่วย" 2 จุด: `feedPet()` ui.js:1093 · `startGame` game.js:27 (เดิมเป็น toast)
- ✅ ทดสอบ preview (geometry+interaction — screenshot tool ค้างกับ full-screen overlay ใช้ getBoundingClientRect แทน): ปุ่ม haptic สลับไอคอน+state ถูก · สั่นตาม haptic ไม่ตามเสียง · กล่องกึ่งกลางจอไม่บวม (136×115 scaled) · ปิด 3 ทางถูกหมด
- 💡 ต่อยอด: ยังมีคำเตือนสำคัญอื่นที่อาจย้ายมา alertBox ได้ (บ้านพัง/ถูกตัดไฟ) — ยังไม่ทำ รอผู้ใช้เคาะ

**✅ รอบ 32b (7 ก.ค. · Opus): คำเตือน toast เพิ่มเสียง+สั่น + ปุ่ม "ปิดทั้งหมด" — commit `c36c4c4` · version→.4**
- ต่อยอดจากรอบ 32: คำเตือนเด้ง → เล่น `sfx.wrong()` + `navigator.vibrate(50)`
- กันเสียงซ้ำ: `sfx.wrong` บันทึก `lastWrongAt` · toast จะไม่บีปถ้าเพิ่งเล่นภายใน 200ms (call site ~20 จุดเรียก sfx.wrong ก่อน toast อยู่แล้ว + คำเตือนรัวๆ นับเป็น burst เดียว) · สั่นเฉพาะเมื่อ `state.sound`
- ปุ่ม `#toast-clear-all` ("✕ ปิดทั้งหมด") โผล่เมื่อ `.toast-warn` ≥2 อัน วางเหนือกอง กดแล้วล้างหมด (จัดการใน `restackToasts`)
- ✅ ทดสอบ preview: เสียงเล่นครั้งเดียวเมื่อ call site นำหน้า · คำเตือนลอยเดี่ยว(เว้น>200ms)มีเสียง · success ไม่มีเสียง · ปุ่มปิดทั้งหมดล้างครบ

**✅ รอบ 32 (7 ก.ค. · Opus): คำเตือน toast ค้างจนผู้ใช้กดปิด ✕ (ไม่หายเอง) — commit `6979a14` · version→.3**
- ผู้ใช้: คำเตือน "เพิ่มเพื่อนไม่สำเร็จ" หายไวเกิน ขอให้ทุกคำเตือนค้างจนกดปิด
- แก้ที่ `js/util.js` `toast()` จุดเดียว: ถ้าข้อความเข้า `TOAST_WARN_RE` (ไม่สำเร็จ/ไม่พอ/ยังไม่/หมดเวลา/ป่วย/⚠️/💔/⏰ ฯลฯ) → ไม่ตั้ง setTimeout + เพิ่มปุ่ม ✕ กดปิดเอง · ข้อความแจ้งสำเร็จ (ซื้อสำเร็จ/ได้เหรียญ) ยังหายเอง 1.8 วิเหมือนเดิม (ไม่งั้นค้างเต็มจอ)
- หลายคำเตือนพร้อมกันวางซ้อนไม่ทับ (`restackToasts` ดันขึ้นทีละ +height, ปิดอันไหนก็ restack)
- CSS `.toast-warn`: แคปซูลสีแดง `pointer-events:auto` ตัดคำได้ + ปุ่ม `.toast-x`
- ✅ ทดสอบ preview: คำเตือนค้างเกิน 2.2 วิ · success หายเอง · กด ✕ ปิด+restack ถูกต้อง
- 📝 ยังไม่ให้ผู้ใช้ทดสอบจริงบน Pages (Pages build หน่วง 2–5 นาที)

**✅ รอบ 31 (7 ก.ค. · Opus): แก้บั๊ก "ของขวัญโดนบัง" 2 จุด + ปรับระบบ handoff ใหม่ให้ลีน**
- **บั๊ก 1 (รูปบวม):** กล่องยืนยันส่งของขวัญ (`confirmSendGift`→`askConfirm`→`.levelup-box`) reuse markup `.ld-pic` แต่ CSS คุมขนาดรูป scope เฉพาะ `.list-dialog` → รูป PNG 1024² render เต็มขนาด ดันกล่องบวมเป็นแท่งขาวสูงบังจอ · แก้ `css/style.css` เปลี่ยน scope 4 บรรทัด `.list-dialog`→`.levelup-box` · ยืนยัน preview รูป 410px→84px · commit `0d2793c` · version→.1
- **บั๊ก 2 (กล่องยืนยันอยู่หลัง picker):** `askConfirm`/`.levelup-overlay` z-index **70** < `.gift-pick-overlay` **85** → กล่องยืนยันเด้งหลังแผง picker ที่ยังเปิดอยู่ ต้องปิด picker ก่อนถึงเห็น · แก้ `.levelup-overlay` z-index **70→100** (เหนือ picker 85 / card 90 / chat 80) · commit `54b1a98` · version→2026-07-07.2
- **✅ ผู้ใช้ทดสอบจริงบน Pages ยืนยันทั้ง 2 จุดเรียบร้อย (7 ก.ค.)** — บั๊กของขวัญปิดสมบูรณ์
- **📚 บทเรียน:** บั๊ก UI จับได้ไวมากเพราะผู้ใช้ส่ง screenshot ทันที (กฎ "ภาพก่อนโค้ด") — ก่อนหน้าเดา z-index/toast จากโค้ดเสียหลายรอบ ทั้งที่ต้นตอเป็นรูปบวม+z-index กล่องยืนยัน เห็นได้จากภาพในวินาทีเดียว
- **handoff ใหม่:** ยุบ 3 ไฟล์เริ่มงาน (HANDOFF+STATUS+CONVENTIONS) → อ่าน `HANDOFF.md` ไฟล์เดียว · เพิ่มไฟล์นี้ (TASKS) + `NOTES.md` · ลบ STATUS.md/CONVENTIONS.md · เพิ่มกฎทอง "ภาพก่อนโค้ด" + preview gotchas + testkit

**✅ รอบ 29 (6 ก.ค.): แยกปุ่ม "โรงงาน"/"ตลาด" เป็นคนละแผง (commit `8294428`)**
- `panel-factory` (🏭 งานผลิต+แคตตาล็อก) · `panel-market` (🏪 ออเดอร์+คลัง+ตั้งราคา+กล่องขายสำเร็จ) · ui.js `renderFactoryCard()`+`renderMarketCard()`
- **⚠️ ของขวัญที่รับมา (giftBox) ส่งต่อ/ขายต่อไม่ได้** — picker ดึงจาก state.collection เท่านั้น

**✅ รอบ 28 (6 ก.ค.): ข้อ 0.5 ส่งของขวัญ + แผง emoji แชท 7 หมวด (commit `5cf5394`)**
- ปฏิเสธ collectible→คืนคลังผู้ส่ง · ค้าง >7 วัน→หมดอายุคืนของ · กด "ส่ง"→escrow ตัดทันที · ของร้านถูกปฏิเสธ/หมดอายุ→คืนเหรียญ
- ไฟล์ใหม่ `js/data/gifts.js` (GIFTS 50) · DB `/gifts/<toUid>/<fromUid>/<giftKey>={k,id,fn,ts,st}` · online.js giftSend/Accept/Decline/giftInWatch/giftReclaim · ui.js renderGiftPanel/openGiftPicker/confirmSendGift/doSendGift/showGiftReveal · state.giftBox+migration

**✅ รอบ 27 (6 ก.ค.): fullscreen + ปุ่มติดตั้งแอพ + แจ้งเวอร์ชันใหม่ (commit `65612b5`,`8cf2031`)**
- manifest display→fullscreen · ปุ่ม 📲 ติดตั้ง (`#btn-install`) · `.update-banner` (z120) เช็ก version.json · **แอพที่ติดตั้งแล้วต้องถอน+ติดตั้งใหม่ 1 ครั้ง**

**✅ รอบ 24–26 (6 ก.ค.):** self-heal เพื่อนสองฝ่าย (`9748206`) · การ์ดข้อมูลผู้เล่นคลิกชื่อ +av/ni (`0daa179`) · PWA ติดตั้งเป็นแอพ sw.js (`31d16d8`)

> รอบ 1–23 อยู่ `handoff/HISTORY.md`
