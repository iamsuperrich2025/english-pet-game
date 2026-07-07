# TASKS.md — งานถัดไป + ประวัติรอบ (เปิดตอนเลือกงาน / ตามบั๊ก)

> 📂 ราก `C:\Users\rober\english-pet-game\` · เปิดไฟล์ใช้ path เต็ม · สถานะย่อ + กฎ + testkit อยู่ใน `HANDOFF.md` (อ่านนั่นก่อน)
>
> 🧭 **โครงไฟล์นี้แยก 3 ชั้นเสมอ** — กันไม่ให้ session หน้าหลงเดา:
> **① อาการ (ยืนยันแล้ว)** = เห็นจริง/reproduce ได้ · **② เดา (ยังไม่พิสูจน์)** = สมมติฐาน ห้ามลงมือแก้จนพิสูจน์ · **③ งานถัดไป**

## 🟢 ไม่มีบั๊กค้าง
บั๊ก "ของขวัญโดนบัง" ปิดจบรอบ 31 · **ผู้ใช้ทดสอบจริงยืนยันแล้ว 7 ก.ค.** (กล่องยืนยันเด้งหน้าแผง picker ถูกต้อง ไม่บวม)

## 🎯 งานถัดไป — ▶️ START HERE (session ใหม่)

เกม feature-complete + ระบบตั้งค่า/แจ้งเตือนครบแล้ว · **ขั้นตอน: เสนอ backlog ให้ผู้ใช้เลือก → รอเคาะ → ทำทีละข้อ**

### backlog (เสนอผู้ใช้เลือก → รอเคาะ อ่านสเปกเต็มใน `handoff/BACKLOG.md`)
- 💰 **item 8** รายได้ออนไลน์ +0.01/วิ
- 🏪 **item 2** ตลาดออนไลน์จริง (ซื้อขายข้ามผู้เล่น)
- 🎯 **item 3** daily quest
- 📇 **item 4** การ์ดสรุปส่งครู
- 🆕 **คิว 7725691507 (10 ข้อ · 7 ก.ค.)** — ✅จูนอาหาร/นอน (ข้อ 1,2,3,6 รอบ 33) · ✅อาหารคน-สัตว์+พิษสะสม (5.1 รอบ 34) · ✅prompt ผู้เลี้ยง/รูปร่างสัตว์ (4,5.2 รอบ 35 — รอผู้ใช้เจนภาพจาก `PROMPTS_CHARACTERS.md`) · เหลือ: การ์ดตั๋ว+โลกผจญภัย 3D (7,8) · โครงโฆษณา/Play Store (9,10) → สเปกเต็มท้าย `handoff/BACKLOG.md`

## ⏳ ค้างฝั่งผู้ใช้ (ทำเองบน Firebase console — ไม่เกี่ยว session ใหม่ นอกจากผู้ใช้ถาม)
- publish Security Rules โซน `/gifts` (ก้อนเต็ม `handoff/RULES.md`) · ทดสอบ flow ส่ง-รับของขวัญเต็ม 2 บัญชี (บัญชีเทสต์มี 0 เหรียญ ยังไม่ได้ส่งจริงครบวง)

## ⚠️ ค้างฝั่งผู้ใช้ (ต้องทำเองบน console/มือถือ)
1. **publish Security Rules ใหม่** (เพิ่มโซน `/gifts` — ก้อนเต็มใน `handoff/RULES.md`) ไม่งั้นส่งของขวัญถูก reject · ก้อนนี้ครอบ av/ni ใน /leaderboard ด้วย
2. **ทดสอบจริง 2 บัญชี:** ส่ง-รับของขวัญ + แชท + self-heal เพื่อน + กล่องยืนยันของขวัญไม่บวม (fix รอบ 31)

## 📌 ประวัติรอบล่าสุด (เก่ากว่านี้อยู่ `handoff/HISTORY.md`)

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
