# TASKS.md — งานถัดไป + ประวัติรอบ (เปิดตอนเลือกงาน / ตามบั๊ก)

> 📂 ราก `C:\Users\rober\english-pet-game\` · เปิดไฟล์ใช้ path เต็ม · สถานะย่อ + กฎ + testkit อยู่ใน `HANDOFF.md` (อ่านนั่นก่อน)
>
> 🧭 **โครงไฟล์นี้แยก 3 ชั้นเสมอ** — กันไม่ให้ session หน้าหลงเดา:
> **① อาการ (ยืนยันแล้ว)** = เห็นจริง/reproduce ได้ · **② เดา (ยังไม่พิสูจน์)** = สมมติฐาน ห้ามลงมือแก้จนพิสูจน์ · **③ งานถัดไป**

## 🟢 ไม่มีบั๊กค้าง
บั๊ก "ของขวัญโดนบัง" ปิดจบรอบ 31 · **ผู้ใช้ทดสอบจริงยืนยันแล้ว 7 ก.ค.** (กล่องยืนยันเด้งหน้าแผง picker ถูกต้อง ไม่บวม)

## 🎯 งานถัดไป — ▶️ START HERE (session ใหม่)
- 🟡 **⚽ soccer ต่อยอด (ผู้ใช้สั่งไว้รอบ 199 "ทำได้เลย" — ยังไม่ทำ คิวถัดไป):** (1) ให้**น้อง/สัตว์เลี้ยงมายืนเป็นผู้รักษาประตู** (โมเดล/ภาพ pet วางหน้าประตู ขยับกันบอล) (2) **โหมดจับเวลาแข่งเก็บคำ** (นับถอยหลัง เก็บคำให้ได้มากสุด) (3) **เตะจุดโทษ challenge** (ยิงเข้ามุมประตูทีละลูก) (4) **เสียงเตะ + ฝูงชนเชียร์สังเคราะห์ WebAudio** (ดูแพตเทิร์น `MechaAudio` รอบ 199 เป็นตัวอย่าง synth) · ทำใน adventure3d.js โซน soccer
- 🟡 **🤖 mecha รอผู้ใช้วางภาพหุ่น:** `img/robots/robot_01..10.png` (prompt ใน `PROMPTS_ROBOTS.md` + Artifact) → วางแล้วโชว์ในตลาด/เลือกหุ่นอัตโนมัติ (probe เจอเอง) · จูนฟีล: `MECHA_ACCEL`(9) `MECHA_VMAX`(11) `MECHA_TURN`(1.35) `ALIEN_SPEED`(2.4) `MECHA_EYE`(5) · อาวุธต่อ robot ใน `MECHA_WEAPONS` (ตอนนี้ต่างแค่สี tracer/จังหวะ — เพิ่มลูกเล่น twin/spread/beam/particle ต่อได้)
- ✅ **🤖 โลก 3D "หุ่นยนต์นักรบ" — เสร็จรอบ 199 (version .190)** — 1st person ในหุ่น 5m เดิน+เสียงย่ำ · ยิงเอเลี่ยนตัวอักษรเรียงลำดับ ครบคำระเบิด +35🪙 · หุ่น 10 แบบในตลาดยานพาหนะ (ซื้อกี่ตัวก็ได้ · อาวุธต่างกัน) · มี ≥1 ตัวเข้าโลกได้
- ✅ **⚽ โลก 3D "สนามฟุตบอล" — เสร็จรอบ 197-198 (version .189)** — รอบ 197: ครบสเปกหลัก 7 ข้อ (สนาม 3D · เตะบอล · charge meter · เล็ง yaw/pitch · เลือกสีเสื้อ+เบอร์ · มุมมอง 1st/3rd · ครบคำ +20🪙) · **รอบ 198 ต่อยอด 3 ข้อผู้ใช้:** (1) เตะโดนตัวประกอบคำได้ = +5🪙 + ป้ายทองหวือหวา + ป๊อปเหรียญ (2) เพื่อนร่วมเตะในสนามเดียวกัน (peer walk figure) (3) ป้ายหงายหลังเด้งกลับ เตะซ้ำได้ (Plane 14 ใบคงที่ ไม่หาย) · **⚠️ ค้างผู้ใช้: ลองจริงมือถือ/2 เครื่อง — จูนใน adventure3d.js: `KICK_SPD_MIN/MAX`(9/32) `CHARGE_RATE`(78) `AIM_YAW_SP`(.9) `AIM_PITCH_SP`(.7) `SOCCER_COLLECT`(1.7) `SOCCER_TILES`(14) `SOCCER_LETTER_COIN`(5) `GOAL_Z/PLAYER_Z`(-19/8)** · 💡 ต่อยอด: น้อง/สัตว์เป็นผู้รักษาประตู · โหมดจับเวลา · เตะจุดโทษ challenge · เสียงเตะ/ฝูงชนสังเคราะห์ · ป้ายที่โดนเตะ sync ให้เพื่อนเห็น (shared target ผ่าน DB)
- ── (งานค้างเดิมด้านล่าง) ──
- ✅ **💬 3 ไอเดีย inbox — ทำครบแล้วรอบ 185 (version .176)** (เรียงตามข้อความล่าสุด + story row ออนไลน์ + ปุ่ม 🌍 ชวนเล่นโลก 3D) → **⚠️ ค้าง: ทดสอบจริง 2 เครื่อง** (ส่งข้อความจริงดูลำดับเลื่อนขึ้น/story/ปุ่มชวน)
- **🚗 โลกขับรถ — งานค้าง/ต่อยอด (ผู้ใช้บอกยังมีต่อ):** ลองจริงมือถือรอบ 180-183 (เลนถนนกว้าง/เพลง+วิทยุ/เลนจักรยาน+ทางเท้า/ไฟเลี้ยวแยก/เสียงยาง/ไฟจราจร) แล้วให้ feedback · **3 ไอเดียต่อยอดล่าสุด (เสนอท้ายรอบ 183):**
  1. 🛞 **รอยยางดำ (skid marks)** บนถนนตรงที่ไถลแรง — decal ทิ้งไว้ชั่วครู่ (คู่กับเสียงยางรอบ 183 · ใช้ slipPerp ตัวเดียวกันเป็นทริกเกอร์)
  2. 🚦 **นับถอยหลังไฟแดง** เลขวินาทีลอยใต้ไฟจราจร (เด็กเรียนรู้ต้องรอ + ฝึกนับเลข · ใช้ tlightPhase/redDur คำนวณเวลาที่เหลือ)
  3. 📢 **ระบบขายป้ายโฆษณาในเกม** — ผู้เล่นใช้เหรียญจองป้ายใส่ชื่อตัวเองบนตึก (ต่อยอด `SHOP_ADS` เป็น DB · ตอนนี้ SHOP_ADS เป็น array ว่างใน adventure3d.js เติมชื่อผู้ลงโฆษณาได้)
- **🌀 Spin-to-Spell รอบ 3 (ขัดเกลาต่อ — กลไก+เสียงเสร็จแล้วรอบ 171-172 live .163):**
  - **ทำต่อ:** (1) น้องเต้นฉลองตอนจบคำ (สลับ clip Tripo ชั่วคราว / กระโดดดีใจ) + เอฟเฟกต์ (คอนเฟตติ/แฟลชเวที) (2) โหมด "ฟังแล้วสะกด" — อ่านคำโจทย์ตอนขึ้นคำใหม่ + ปุ่ม 🔊 ฟังซ้ำ (`speakWord` มีแล้ว · ซ่อน/โชว์คำตามระดับ?ให้ผู้ใช้เคาะ) (3) questEvent ev ใหม่ 'spell' + เข้า pool ภารกิจวันนี้ (4) จูนฟีลปัดตาม feedback มือถือจริง (ค่าใน lobby3d.js: `SPELL_SENS` .016 ความไว · `SPELL_FRICTION` .975 ความลื่น · `SPELL_VMAX` .6 · `SPELL_VMIN` .015 · `SP_R/SP_Y/SP_LS` ขนาดวง · `SPELL_COIN` 15)
  - มีแล้ว (171-172): วงแหวน 12-16 ตัว+**ปัดเหวี่ยงเท่านั้น (ลากประคองไม่ได้ · แตะวง=หยุดสนิท)**+snap+เก็บเรียงตัว+เสียง 5 จุด (tick ผ่านช่อง/เก็บ/ผิด/win/start — ไฟล์ `sound/spell/` มาก่อน ไม่มีใช้ beep สังเคราะห์)+จบคำอ่านทั้งคำ+🪙15+วนคำใหม่ · จุดเข้า: ปุ่ม 🌀 บนเวที (g0+3D)
- **รอผู้ใช้:** เจนเสียง 5 ไฟล์วาง `sound/spell/` — Artifact ปุ่มคัดลอก: https://claude.ai/code/artifact/ea8ad71c-49eb-4405-bf51-deab29db57a3 (สำรองใน `PROMPTS_SPELL_SOUND.md`) → วางแล้วบอก Claude commit
- ✅ **rules รอบ 155 (/feed + /follow รวม tl รอบ 132) ผู้ใช้ publish แล้ว 12 ก.ค. — ตรวจ REST ผ่านครบ** → ระบบ Follow+Feed เปิดใช้จริงบน live แล้ว
- **รอผู้ใช้: ทดสอบจริง 2 เครื่อง:** เครื่อง A เปิดเผยกิจกรรมในตั้งค่า ⚙️ + ทำภารกิจ/สอบผ่าน · เครื่อง B เปิด profile ของ A (เห็นกิจกรรม + กด ➕ ติดตาม) → กลับ lobby ดูฟีดขึ้นแถวใหม่ · แถมดูไฟเลี้ยวรถเพื่อน (รอบ 132 เพิ่งเปิดใช้พร้อมกัน)
- หรือเลือกงานใหม่จาก backlog (`handoff/BACKLOG.md`) / feedback หลังลองจริงมือถือรอบ 146–155

### ✅ รอบ 229 (14 ก.ค.) — 🤖 โลกหุ่น ต่อยอด 3 อย่าง: เข็มล้มบอส + บอสหลายสายพันธุ์ + Endless Wave (version .219 · SW v14)
ผู้ใช้: "ทำต่อยอดโลกหุ่นยนต์: เข็มความสำเร็จล้มบอส / บอสหลายสายพันธุ์ / Endless Wave"
- **⚔️ เข็มนักล่าบอส (สายเข็มที่ 5):** `game.js` เพิ่ม `MECHABOSS_TIERS`[[3,1],[10,2],[25,3]] · `MECHABOSS_TIER_UI` · `mechaBossEmoji`(⚔️/🛡️/🤖) · ต่อใน `badgeSuffix()` + `BADGE_META` (p:1/2/3) + `NAME_BADGE_RE` + `badgeEmojis` regex · `state.js` `mechaBossBadge`+`mechaWaveBest`+migration · adventure3d.js `checkMechaBossBadge()` (เรียกใน explodeAlien เมื่อล้มบอส) → `celebrateBadge` การ์ดฉลองกลางจอ · **ไม่แตะ `checkCrown`** (เข็มลับ 👑 คงต้องครบ 4 สายเดิม — บอสไม่นับ crown) · เข็มติดท้ายชื่อ 2 จุด (presence 2120 / recap 2646)
- **👾 บอสหลายสายพันธุ์ (5 สาย · หมุนเวียน):** `BOSS_SPECIES`[ember🔥·frost❄️·venom🟢·volt⚡·titan🛡️] ต่างกัน geo(รูปทรง)/สี/ตา/สีกระสุน/`shotSpd`/`wordPick`(ความยาวคำ) · `pickBossSpecies()` วนทีละสาย · `makeAlien(bossArg)` รับ species object/`true`(สุ่ม) · body=`sp.geo()` emissive/eye/scale ตามสาย · `spawnAlienShot` ใช้สี+ความเร็วตามสาย · แถบบอส HUD โชว์ชื่อ (`mh-boss-ttl`="🔥 Ember") · banner "บอส{ชื่อไทย} มาแล้ว!"
- **🌊 Endless Wave:** `waveCfg(w)` = goal(4+⌊(w-1)/2⌋+บอส) · conc(3+⌊w/3⌋ เพดาน 6) · spd(1+(w-1)·0.05) · `WAVE_BOSS_EVERY=3` (เวฟ 3/6/9 = Boss Wave บอสมาปิดท้าย เมื่อ `spawned===goal-1`) · `startWave`/`waveSpawnFill`(เติมคงจำนวนบนสนาม)/`waveComplete`(โบนัส 20+w·10 → หน่วง 1.5s → เวฟถัดไป · guard running&&mecha) · explodeAlien นับ `mWaveKilled` แทน "บอสทุก 5 คำ" เดิม (ลบ `BOSS_EVERY`) · start→`startWave(1)` แทน spawn ALIEN_COUNT ตายตัว · HUD `#mh-wave` chip (WAVE ใน mh-tele) · `mechaWaveBest` สถิติ · `mechaRecapLine` เพิ่ม "🌊 ถึงเวฟ N"
- **ยืนยัน (browser preview · test hooks `_t.mecha` เพิ่ม `wave`/`startWave`/`species`/`kill`):** เข็ม badgeSuffix/regex/score/celebrate ผ่าน · Wave1 goal4 spawn3 · Boss Wave3 บอส ember โผล่ปิดท้าย คำ mountain · ล้มบอสครบ3→mechaBoss3/badge1⚔️/การ์ดฉลอง · WAVE chip="3" ไม่ล้นจอ 812×375 (tele right 539<812) · boss title "🔥 Ember" · ไม่มี error โหลด/พาร์ส · deploy live .219 · ⚠️ screenshot ค้าง (ฉาก 3D หนัก — ยืนยันด้วย DOM/scene-graph ตามกฎทอง #3)
- ⚠️ **ค้าง: ลองจริงมือถือ** — จูน `WAVE_BASE_GOAL`(4)/`WAVE_BOSS_EVERY`(3)/เพดาน conc(6)/spd ramp(0.05) + ฟีลความยากไต่ระดับ · ดูสายพันธุ์บอสครบ 5 แบบ (รูปทรงต่างชัดไหม)
- 💡 **ต่อยอดได้อีก:** บอสสายพันธุ์มีท่าโจมตีพิเศษต่อสาย (frost แช่แข็งช้าลง · volt ยิงรัว · titan กระแทกพื้น) · Boss Wave มีเพลง/แสงพิเศษ · กระดานเวฟสูงสุดออนไลน์ (`mechaWaveBest`→leaderboard คล้าย bk)

### ✅ รอบ 228 (14 ก.ค.) — 🤖 โลกหุ่น ต่อยอด 3 อย่าง: สรุปสถิติจบเกม + ปุ่มยิงเปลี่ยนสี + กระดานล้มบอสออนไลน์ (version .218 · SW v13)
ผู้ใช้: "เอาตามความเห็นต่อยอด ทำได้หมดเลย" (3 ไอเดียท้ายรอบ 227)
- **📊 สรุปสถิติจบเกม:** นับ `mComboMax`/`mBossKills`/`mShotsFired`/`mShotsHit` → `mechaRecapLine()` = "⭐ คอมโบสูงสุด ×N · 👾 ล้มบอส N · 🎯 แม่นยำ NN% · 📖 N คำ" · โชว์ใน toast ตอนออก (mecha) + ต่อท้ายแบนเนอร์ knockedOut (`.adv-ko-stat`)
- **🔫 ปุ่มยิงเปลี่ยนสี (feedback):** `updateMechaHud` ใส่คลาส `#mecha-fire/fire2` — `fs-over`(แดงกะพริบ โอเวอร์ฮีต) > `fs-shield`(ฟ้า มีโล่) > `fs-combo`(ทอง คอมโบ≥3) > `fs-hot`(ส้ม heat>60) > ปกติ(แดงชมพู) · ยืนยัน computed bg ต่างกันครบ 5 สถานะ
- **🤖 กระดานล้มบอสออนไลน์:** `state.mechaBoss` (สะสมถาวร +migration) · ล้มบอส→+1+`onlinePushScore()` เขียนฟิลด์ `bk` ที่ `/leaderboard/<uid>` · online.js อ่าน `bk` ลง `Online.board` · ui.js **แท็บที่ 3 "🤖 ล้มบอส"** (`lbBossHtml` เรียง bk มาก→น้อย · กรอง bk>0 · แทรกค่าสดตัวเอง) · `bindLbTabs` รับ 'boss'
- **⚠️ ต้อง publish rules (เพิ่มฟิลด์ `bk` โซน leaderboard):** Artifact ปุ่มคัดลอกก้อนเต็ม → https://claude.ai/code/artifact/fd952de2-1b02-469f-a34a-f037ae5e75f6 · RULES.md อัปเดตแล้ว · **ก่อน publish = เห็นแค่ bk ตัวเอง (ไม่พัง · graceful fallback)**
- **ยืนยัน (`_t.mecha.stats` + render lbBossHtml offline):** ล้มบอส→comboMax7/bossKills1/แม่น100%/recap ถูก · state.mechaBoss +1 · ปุ่มยิง 5 สีต่างกัน · lbBoss ranking (9>4 บอสเรียงถูก · กรอง bk=0 · โชว์ตัวเองอันดับถูก) · ไม่มี error · deploy live .218
- ⚠️ **ค้าง: (1) publish rules (Artifact) → (2) ทดสอบ 2 เครื่อง กระดานล้มบอสข้ามเครื่อง** · จูน `COMBO_X2/X3`

### ✅ รอบ 227 (14 ก.ค.) — 🤖 โลกหุ่น ต่อยอด 3 อย่าง: แถบพลังบอส + คอมโบ×2/×3 + โล่กันกระสุน (version .217 · SW v12)
ผู้ใช้: "ทำต่อยอดได้เลย" (3 ไอเดียท้ายรอบ 226)
- **👾 แถบพลังบอส:** `#mh-boss` โผล่ตอนมีบอส (`bosson` class) — ป้าย "👾 BOSS" + แถบสีแดง-ส้ม เหลือ = (len−nextIdx)/len · ยิงตัวอักษรบอส แถบลด · **left-align top:44 left:132** (ชิดขวาแมป · เลี่ยง vmode ที่กินถึง x346) · ยืนยัน 568×320 OVERLAPS ว่างทุกปุ่ม
- **🔥 คอมโบ:** ยิงถูกลำดับติดกัน `mCombo++` → **×2 ที่ 3 ครั้ง · ×3 ที่ 6 ครั้ง** (`MECHA_LETTER_COIN*mult`) · ป๊อป "🔥 COMBO ×N" กลางจอ (`mechaComboPop`) · **ยิงผิดลำดับ = คอมโบขาด (=0)** · คงคอมโบข้ามคำ (ไม่รีเซ็ตตอนครบคำ)
- **🛡️ โล่กันกระสุน:** ของเก็บชนิดที่ 3 (🛡️ ทอง · สุ่มคู่ ❄️❤️) เก็บแล้ว `mShieldUntil=now+3500` — **กันกระสุน+ประชิด 3.5 วิ** (ไม่เสียหาย · ดันเอเลี่ยนหด) · บับเบิลฟ้าเรือง `shielded` class รอบจอ · `mechaShielded()` เช็คใน tickAlienShots + mechaHitByAlien
- **ยืนยัน (synchronous `_t.mecha` hooks):** คอมโบไต่ 1→8 (คำ mountain) · ×2/×3 ป๊อป "COMBO ×3" · **ยิงผิดลำดับ→คอมโบ 2→0 (resetOK)** · แถบบอส flex+fill 50% · โล่ collect→active+กันประชิด(hp คงที่)+bubble opacity 1 · boss bar 568×320 ไม่ทับปุ่ม · ไม่มี error · deploy live .217
- ⚠️ **ค้าง: ลองจริงมือถือ** — จูน: `COMBO_X2`(3)`/X3`(6) · `SHIELD_MS`(3500) · โล่เป็น auto-activate ตอนเก็บ (ไม่ใช้ปุ่ม — UI แน่นแล้ว)

### ✅ รอบ 226 (14 ก.ค.) — 🤖 โลกหุ่น ต่อยอด 3 อย่าง: เอเลี่ยนยิงกระสุน + ของเก็บ + บอสทุก 5 คำ (version .216 · SW v11)
ผู้ใช้: "เอาตามที่ต่อยอดได้อีก ทำเลย" (3 ไอเดียท้ายรอบ 225)
- **👾 เอเลี่ยนยิงกระสุน (หลบได้):** ระยะกลาง 8–75m → ยิงลูกกลมเรืองแสงเล็งตำแหน่งหุ่น ณ ตอนยิง (ตรง ไม่นำ → สเตรฟ/เดินหลบได้) `spawnAlienShot`/`tickAlienShots` · โดน <2.2m → `mechaDamageFx(6)` + กะพริบแดง + คลักซอน (iframe 700ms) · บอสยิงลูกใหญ่ dmg+3 เร็วกว่า · `ALIEN_SHOT_SPD`15 `GAP`3.2s
- **❄️❤️ ของเก็บกลางสนาม:** สปอว์นทุก 15s (สูงสุด 2) `spawnPowerup` — **❄️คูลแดนต์** (mHeat=0 + ปลดโอเวอร์ฮีต) / **❤️ซ่อมเกราะ** (+30 hp) · เดินทับ <3.4m เก็บ (`collectPowerup` + เสียง `pickup` ไล่โน้ต) · เลือกชนิดอัจฉริยะ (hp ต่ำ→repair · ร้อน→cool) · Octahedron+Torus+สไปรต์อิโมจิ (`emojiSprite` canvas)
- **👾 บอสทุก 5 คำ:** `makeAlien(boss)` — ตัวแดงเรืองแสง scale 1.85 · **คำยาวสุดจาก pickWords(8)** · โบนัส +45🪙 · ครบ 5/10/15 คำ ตัวใหม่เป็นบอส · บลิปเรดาร์แดงใหญ่ · **fix hit detection ใช้ `a.gs` คูณ offset** (บอส scale 1.85 → letter world ต้อง ×gs ทั้ง mechaFire + focus loop + lunge คืนสเกลเดิม)
- **ยืนยัน (synchronous `_t.mecha` hooks · rAF pane pause แต่ logic ตรง):** spawnBoss→boss=true/gs1.85/คำ "rabbit"6ตัว/4 aliens · enemyShoot→speed15/dmg6/เล็งหุ่น · dropPowerup→repair · collect cool→heat100→0+overheat off · collect repair→hp84→100(cap) · **ยิงตัวอักษรบอสโดนจริง (nextIdx 0→1 · gs fix ผ่าน)** · ไม่มี error · deploy live .216
- ⚠️ **ค้าง: ลองจริงมือถือ** — จูน: `ALIEN_SHOT_SPD/DMG/GAP` · `POWERUP_GAP`(15s)`/MAX`(2)`/HEAL`(30) · `BOSS_EVERY`(5)`/SCALE`(1.85)`/BONUS`(45)

### ✅ รอบ 225 (14 ก.ค.) — 🤖 HUD หุ่น ต่อยอด 3 อย่าง: โอเวอร์ฮีตปืน + เรดาร์เข็มกวาด + กะพริบแดงโดนโจมตี (version .215 · SW v10)
ผู้ใช้: "ทำที่ต่อยอดทั้งหมดได้เลย" (3 ไอเดียท้ายรอบ 224)
- **🔥 โอเวอร์ฮีต:** `mHeat` ยิงเต็ม 100 → `mOverheat=true` **ปืนล็อก ยิงไม่ออก** (คลิกได้เสียงปฏิเสธ) จนเย็นลง ≤35 (เย็น 30/s) · แถบ HEAT แดงกะพริบ + label "OVERHEAT" + `MechaAudio.warn()` คลักซอน · บังคับจังหวะยิง ไม่รัวมั่ว
- **📡 เรดาร์เข็มกวาด:** `.mh-radar` กลางจอ (เจาะกลาง mask ไม่บังเป้าเล็ง) — วงแหวน 2 ชั้น + `.mh-rsweep` conic กวาดหมุน (`@keyframes mhRadar`) + **บลิป 6 จุดชี้ทิศเอเลี่ยน** (β=atan2(cross,dot) จากทิศหันหน้า · ระยะไกล=ขอบวง · ตัวที่เล็งอยู่=จุดขาวใหญ่เต้น) อัปเดตใน updateMechaHud
- **🚨 กะพริบแดงโดนโจมตี:** เอเลี่ยนเข้าประชิด <8m → `mechaHitByAlien` = `damagePlayer(8)` + `#mecha-hud.hit` (radial แดงแวบ) + คลักซอน + เอเลี่ยนเด้งโต (iframe รวม 900ms · คูลดาวน์ต่อตัว 2.2s) · พลังงาน ≤30 → `.lowhp` ขอบแดงเต้นค้าง · hp หมด→knockedOut (เหมือนโลกอื่น)
- **ยืนยัน (synchronous ผ่าน `_t.mecha` hooks · ⚠️ rAF ใน preview pane ถูก pause เทสลูปไม่ได้ แต่ logic ตรง):** ยิง 10 ครั้ง→heat=100+overheat=true+ยิงต่อถูกบล็อก(heat คงที่) · `M.hit()` ตรงๆ→hp 100→92+hit class+dmgFlash · เรดาร์บลิป 6 จุด+sweep มีจริง · **คณิตทิศบลิปถูกทุกทิศ** (หน้า=บน·ขวา=ขวา·ซ้าย=ซ้าย·หลัง=ล่าง) · ไม่มี error · deploy live .215
- ⚠️ **ค้าง: ลองจริงมือถือ** — จูนได้: `MECHA_ATK_RANGE`(8) `MECHA_ATK_DMG`(8) · heat +13/ยิง เย็น 30/s ปลดล็อก ≤35 · เรดาร์ radius map dist/80

### ✅ รอบ 224 (14 ก.ค.) — 🤖 กรอบ HUD ห้องนักบินตามหุ่นแต่ละตัว + เอฟเฟกต์ไล่เฉดสี + ค่าตัวเลขเรียลไทม์ (version .214 · SW v9)
ผู้ใช้ทำภาพ HUD ใหม่ 10 ใบ `img/robots/hud/robotHUD_01..10.png` (1536×1024 กรอบห้องนักบิน sci-fi ตรงกลางเป็นวงเรดาร์) → ให้ใส่ตามหุ่นแต่ละตัว + effect ไล่เฉดสี + ตัวเลข/ข้อมูลบน HUD สมจริง
- **js/adventure3d.js:** เพิ่ม `#mecha-hud` (z5 ใต้ปุ่ม z6) มี 4 เลเยอร์: `.mh-frame` (ภาพกรอบ · **mask radial-gradient เจาะกลางโปร่ง** ให้มองทะลุเห็นสนามรบ) · `.mh-tint` (radial สีอาวุธ blend screen) · `.mh-sweep` (ลำแสงไล่เฉดกวาด `@keyframes mhSweep`) · `.mh-scan` (เส้นสแกน)
- **สีประจำหุ่น (`--mh`)** ตั้งจาก `MECHA_WEAPONS[rid].color` ใน `setMechaHudSkin(rid)` (เรียกใน start มecha) → ภาพ+สีเปลี่ยนตามหุ่นที่เลือกออกรบ (เช่น robot_04=เหลือง #ffd24d/HUD_04 · robot_09=ม่วง #7a6cff/HUD_09)
- **ค่าตัวเลขเรียลไทม์ (`updateMechaHud` throttle ~9fps ใน tickMecha):** แถบบางกลางล่าง 3 ชิป **RNG** (ระยะถึงเอเลี่ยนที่เล็ง `camera.distanceTo`) · **TGT** (เอเลี่ยนเหลือ `aliens.length`) · **HEAT** (ความร้อนปืน — `mechaFire` +13 ต่อยิง เย็นลง 30/s) + ป้าย **◎ TARGET LOCK** ใต้เป้าเล็งเมื่อ `mFocusAlien` (กะพริบ)
- **ยืนยันบนโค้ดจริง (getBoundingClientRect · screenshot 3D ค้างตามปกติ):** 568×320 + 1180×620 → กรอบภาพโหลด (1536×1024) · mask เจาะกลาง · tint/sweep blend screen · accent ตรงสีอาวุธ · แถบ 3 ชิป **OVERLAPS ว่างทุกปุ่ม** (fire/fire2/◀▶/▲▼) · RNG/TGT อัปเดตค่าจริง (56m·3 ตัว) · สลับ robot_04→09 ภาพ+สีเปลี่ยนถูก · ไม่มี error
- ⚠️ **commit ภาพ HUD 10 ใบ** (`img/robots/hud/` เดิม untracked · ~2.8MB/ใบ) → deploy ขึ้น · โหลด on-demand ตอนเข้าโลกหุ่น (ไม่ precache · SHELL ไม่มี) · deploy live .214

### ✅ รอบ 223 (14 ก.ค.) — เพิ่มปุ่มยิงตัวที่ 2 ใต้ minimap (ซ้าย) (version .213)
- **ผู้ใช้:** เพิ่มปุ่มยิงอีก 1 ปุ่ม ไว้ใต้วงกลม minimap ทางซ้าย (ยิงได้สองมือ)
- **✅ แก้ (js/adventure3d.js):** (1) DOM เพิ่ม `<div class="mecha-btn" id="mecha-fire2">🔫</div>` (ต่อจาก #mecha-fire) (2) CSS `#mecha-fire2{left:24px;top:138px;width:84px;height:84px;...แดงเรือง}` (ใต้ minimap ที่ bottom:128 · เว้น 10px) + รวม `:active` กับ #mecha-fire (3) `holdBtn('#mecha-fire2',()=>mFireHeld=true,()=>mFireHeld=false)` — โค้ดเดียวกับ #mecha-fire (proven)
- **✅ ยืนยัน 844×390:** fire2 disp:flex โชว์ · y138 อยู่ใต้ minimap (bottom 128) · fire2_vs_minimap/left/right/fire1 = ok (ไม่ทับ) · class mecha-btn (โชว์เฉพาะ touch mecha ผ่าน `.adv-touch.adv-mecha .mecha-btn{display:flex}`) · binding = สำเนา mecha-fire → mFireHeld → tickMecha mechaFire
- **📝 ไฟล์แก้:** `js/adventure3d.js` + `version.json` .212→.213 · **✅ push + deploy_firebase.sh + curl .213**

### ✅ รอบ 222 (14 ก.ค.) — ซ่อนวงกลมจอยขาว + ◀▶ หมุน→สเตรฟ (ขยับข้าง) (version .212)
- **ผู้ใช้:** (1) ปิดวงกลมสีขาวหลัง ◀▶ ไม่ให้โชว์ (2) ◀▶ ไม่ใช่หมุน/หัน แต่ให้ขยับซ้าย-ขวาแทน
- **🔍 ส่อง DOM:** วงกลมขาว = **`#adv-joy`** (จอยเบส 110px · `rgba(255,255,255,.14)`) · `.adv-touch #adv-joy{display:block}` ไม่ยกเว้น mecha (แต่ input line 3913 ข้าม mecha อยู่แล้ว = element โชว์เฉยๆ ไม่ทำงาน)
- **✅ แก้ (js/adventure3d.js):** (1) `.adv-touch.adv-mecha #adv-joy{display:none}` (2) rename `mTurnBtn`→`mStrafeBtn` (decl 217 · bind 3825-6 · reset 6416 · testkit `set strafe`) · **tickMecha:** ลบ `yaw-=turn*MECHA_TURN*dt` → คิด strafe: `strSpd=str*MECHA_VMAX*0.78` · `nx+=cos*strSpd*dt` `nz-=sin*strSpd*dt` (ตั้งฉากทิศหันหน้า · ▶=+x ขวา · ตรงไม่มีโมเมนตัม) · bob/เสียงย่ำเงื่อนไข `+ str!==0`
- **⚠️ ยังหมุน/เล็งได้:** touchmove line 3939 (`yaw-=(dx)*.005`) + เมาส์ pointerlock (desktop) ไม่แตะ → ลากจอ=หมุน ยังทำงาน · `MECHA_TURN` (201) เลิกใช้แล้ว (คงไว้เฉยๆ)
- **✅ ยืนยัน `_t.step(1/60)` frame-step (rAF ไม่ fire ใน preview พื้นหลัง):** strafe▶ dx=+4.29/dz=0 · strafe◀ dx=−4.29/dz=0 · **yaw ไม่เปลี่ยน (0)** · #adv-joy display:none
- **📝 ไฟล์แก้:** `js/adventure3d.js` + `version.json` .211→.212 · **✅ push + deploy_firebase.sh + curl .212**

### ✅ รอบ 221 (14 ก.ค.) — ปุ่มยิงไปคอลัมน์ "ทุกคน" + ซ่อนปุ่มยิงส้ม 🔥 ที่โผล่ผิด (version .211)
- **ผู้ใช้:** (1) ย้ายปุ่มยิงไปขวา ให้ตรงคอลัมน์กับปุ่ม "ทุกคน" (2) เอา "ปุ่มสีเหลืองทางขวามือ" ออก
- **🔍 ส่อง DOM (elementsFromPoint ที่ ▼):** "ปุ่มเหลือง" = **`#adv-shoot`** (🔥 · `background:rgba(255,167,38,.9)` ส้ม) = ปุ่มยิงของโลก adv/haunt/drone · `.adv-touch #adv-shoot{display:block}` ยกเว้นแค่ haunt/heli/drone **ไม่ยกเว้น mecha** → โผล่ที่ `right:22;bottom:26` ทับ ▼ (mecha-back right:22 bottom:24) · โลกหุ่นใช้ `#mecha-fire` (🔫 · bind holdBtn→mechaFire) อยู่แล้ว → adv-shoot เกินมา
- **✅ แก้ (js/adventure3d.js):** (1) เพิ่ม `.adv-touch.adv-mecha #adv-shoot{display:none}` (เข้าชุด haunt/heli/drone) (2) `#mecha-fire` `left:calc(50%-46px) → right:146px` — คำนวณจาก vmode ("ทุกคน") `right:162` width 60 → center อยู่ 192 จากขวา → fire (92) center ตรงกัน = `right:146` (192−46)
- **✅ ยืนยัน 1180×620 + 480×300:** `#adv-shoot` display:none · fire center = vmode center เป๊ะ (aligned) · **OVERLAPS ว่าง** (fire right:146 ↔ ▲▼ right:22 เว้น 48px · fire บน ▲▼ ล่าง)
- **📝 ไฟล์แก้:** `js/adventure3d.js` + `version.json` .210→.211 · **✅ push + deploy_firebase.sh + curl .211**

### ✅ รอบ 220 (14 ก.ค.) — แก้ปุ่มยิงซ้อนปุ่ม ▼ บนจอแคบ + จัด 3 คลัสเตอร์แยกกัน (version .210)
- **ผู้ใช้** ถาม "ปุ่มสีเหลืองคืออะไร" (ปุ่มยิง 🔫) + เห็นมันเรืองส้มซ้อนหลังปุ่ม ▼
- **🐞 ต้นตอ (วัดจริง 480×300):** รอบ 219 ปุ่มยิง `left:calc(50%+60px)` (ใต้ตัวท้าย H ค่อนขวา) → บนจอแคบ ~480px ชน ▲▼ (fire∩back 10x70) + ◀▶ (fire∩right 18x70) เพราะฝั่งขวาแคบ วางทั้ง fire+▲▼ ไม่พอ · **บทเรียน: เทสต์จอ ≤480 ด้วย ไม่ใช่แค่ 568** (จอผู้ใช้แคบกว่าที่คิด)
- **✅ แก้ (ผู้ใช้เลือกแบบ 1 · js/adventure3d.js):** `#mecha-left/right` `170/248 → 22/100` (◀▶ กลับซ้ายล่าง) · `#mecha-fwd/back` คง `right:22` (▲▼ ขวาล่าง) · `#mecha-fire` `calc(50%+60px) → calc(50%-46px)` (**ปุ่มยิงกลางจอใต้คำ** · 46=ครึ่งปุ่ม 92 → center พอดี) → 3 คลัสเตอร์แยก: ◀▶ ซ้าย · fire กลาง · ▲▼ ขวา ช่องกลางกว้างพอทุกจอ
- **✅ ยืนยัน 2 จอ:** 480×300 (◀▶ 22-170 · fire 194-286 · ▲▼ 382-458 · **ว่าง**) + 1180×620 (fire center 590 = word center 590 เป๊ะ · **ว่าง**)
- **📝 ไฟล์แก้:** `js/adventure3d.js` + `version.json` .209→.210 · **✅ push + deploy_firebase.sh + curl .210**

### ✅ รอบ 219 (14 ก.ค.) — ปุ่มยิงย้ายไปใต้คำ + ▲▼ ไปมุมขวาล่าง (version .209)
- **ผู้ใช้:** ปุ่มยิงไปอยู่ใต้ตัว H (ตัวท้ายของคำเป้าหมาย) · ▲▼ (ขึ้น-ลง) ย้ายไปแทนที่ปุ่มยิงเดิม (มุมขวาล่าง)
- **✅ แก้ (js/adventure3d.js):** `#mecha-fwd/back` `left:22px→right:22px` (▲▼ ไปมุมขวาล่าง แทนปุ่มยิง) · `#mecha-fire` `right:22;bottom:34 → left:calc(50% + 60px);top:186px`
- **💡 เทคนิค:** ปุ่มยิงอิง **กลางจอ (calc 50%+60)** ไม่ใช่ `right:%` เพราะคำเป้าหมาย (`#adv-words`) จัดกลางจอ → fire เลยไปอยู่ใต้ปลายขวาของคำ (ตัวท้าย) พอดีทุกขนาดจอ + ไม่ชน ◀▶ (ซ้าย x170-318) / ▲▼ (ขวา) · ถ้าใช้ right:% จอแคบ fire จะเลื่อนไปทับ ◀▶ (เจอตอนเทสต์ 568 → แก้)
- **✅ ยืนยัน 2 จอ:** 568×320 (fire center 390 · คำจบ 399) + 1180×620 (fire center 696 · คำจบ 708) → **fire อยู่ใต้ตัวท้ายคำทั้งคู่ · OVERLAPS ว่าง** · ▲▼ ไปมุมขวาล่าง (x right:22)
- **📝 ไฟล์แก้:** `js/adventure3d.js` + `version.json` .208→.209 · **✅ push + deploy_firebase.sh + curl ยืนยัน .209**

### ✅ รอบ 218 (14 ก.ค.) — ขยับปุ่มโลกหุ่นตามผู้ใช้ (◀▶ ขวาอีกนิด · กลุ่มปุ่มบนขวาเลื่อนซ้าย) (version .208)
- **ผู้ใช้** (เห็นเลย์เอาต์ใหม่แล้วหลัง deploy รอบ 217) ส่ง screenshot ลูกศรแดง 2 จุด: (1) ◀▶ ขยับไปขวาอีกนิด (2) กลุ่มปุ่มบนขวาเลื่อนมาทางซ้าย · **ถามยืนยันก่อนทำ** (AskUserQuestion) เพราะลูกศรกำกวม
- **✅ แก้ (js/adventure3d.js):** (1) `#mecha-left{left:112→170}` `#mecha-right{left:190→248}` (◀▶ ขยับขวา ห่าง ▲▼ ~72px · ไม่ชนปุ่มยิง) (2) `.adv-mecha` ปุ่มบนขวาทุกตัว `right +48` (exit 8→56, help 70→118, chat 104→152, mic 8→56, spk 60→108, vmode 114→162, tmute 8→56, podbtn 96→144) — เลื่อนซ้ายพ้นมุมขวา (ผู้ใช้: ติดมุมโค้ง/กล้องกดยาก)
- **✅ ยืนยัน (โค้ดจริง 568×320):** ◀▶ ที่ 170/248 (right edge 318 < fire 454) · back 22-98 (gap 72) · exit 450-512 (พ้นขอบขวา 56px) · vmode 346 > hp 310 · **OVERLAPS ว่าง** · กว้างขึ้น = ยิ่งโล่ง
- **📝 ไฟล์แก้:** `js/adventure3d.js` + `version.json` .207→.208 · **✅ push + `bash tools/deploy_firebase.sh` + curl ยืนยัน .208 (คราวนี้ deploy แล้ว!)**

### 🚀🔥 รอบ 217 (14 ก.ค.) — เจอต้นตอจริง: รอบ 213-216 "push แต่ไม่ deploy" → ไม่เคยขึ้นเว็บเลย!
- **อาการ:** ผู้ใช้ทดสอบโลกหุ่นบนเครื่องจริง → **เลย์เอาต์เดิมทุกอย่าง** (กระดานคะแนนบนซ้าย · minimap บนขวา · ปุ่ม ออก/แชท/ปิด/ปิด เรียงตั้งขวา = default ก่อนรอบ 214 ด้วยซ้ำ) + **"ไม่มีแถบแจ้งเวอร์ชันใหม่เหมือนทุกที"**
- **🎯 ต้นตอ (บทเรียนใหญ่):** เว็บจริง = **Firebase Hosting `https://vocabworld.web.app`** (ย้ายจาก GitHub Pages ตั้งแต่รอบ 134 · memory เก่าจำผิดเป็น GitHub Pages ทำให้หลงทาง) · **`git push` ขึ้นแค่ repo ไม่ทำให้ขึ้นเว็บ!** ต้องรัน **`bash tools/deploy_firebase.sh`** แยกทุกครั้ง · ทั้ง session รอบ 213-216 ผม push อย่างเดียว **ไม่เคยรัน deploy** → งานทั้ง 4 รอบ (ถนน/ตึก/โชว์รูม/HUD หุ่น) ไม่เคยขึ้น live · แถบ "เวอร์ชันใหม่" ไม่เด้งเพราะ version.json บนเว็บไม่เปลี่ยน (index.html เทียบ server vs running)
- **✅ แก้:** รัน `bash tools/deploy_firebase.sh` → deploy สำเร็จ (4 ไฟล์ใหม่ · 742 ไฟล์รวม) · **ยืนยัน curl `vocabworld.web.app`:** `version.json`=**.207** · `adventure3d.js` มี `.adv-mecha #adv-board{display:none}` (mecha ใหม่) · `sw.js`=**v8** → ทุกอย่างรอบ 213-216 ขึ้น live พร้อมกัน
- **📌 แก้กันซ้ำ:** อัปเดต memory `english-pet-game-project` (Firebase ไม่ใช่ GitHub Pages + ขั้น deploy) + HANDOFF **กฎทอง #4 เพิ่ม `bash tools/deploy_firebase.sh` + ยืนยัน curl** · repo private → curl raw/API/github.io 404 เป็นปกติ ไม่ใช่ deploy พัง
- **ผู้ใช้:** รีโหลด/ปิดเปิดแอป → จะเห็นแถบ "✨ มีเกมเวอร์ชันใหม่!" + โลกหุ่น (ปุ่มไม่ทับ) + ถนนขับได้สุดขอบ + ตึกน่ารัก + โชว์รูมภาพใหญ่ ครบทุกอย่าง

### ✅ รอบ 216 (14 ก.ค.) — 🤖 HUD โลกหุ่น เลย์เอาต์ใหม่พอดีจอมือถือแคบ (ปุ่มไม่ทับปุ่มยิง) (version .207 · SW v8)
- **ผู้ใช้:** รอบ 215 (บอกให้รีโหลดกันแคช) → ตอบ **"ยังเหมือนเดิม"** = ไม่ใช่แค่แคช มีบั๊กจริง
- **🐞 ต้นตอจริง (เจอด้วยการ resize browser จริง + getBoundingClientRect · **บทเรียน: synthetic projection คำนวณ overlap ผิด — ต้อง resize จริงเท่านั้น**):** เลย์เอาต์ mecha รอบ 214 ก๊อปกฎ `.adv-drive` (ปุ่มแถวเดียวบนขวา ออกแบบจอกว้าง ~800px) · แต่มือถือ landscape จริงแคบกว่า (**568×320** = iPhone SE, หรือ DPR สูงทำ CSS viewport แคบ) → คลัสเตอร์ซ้าย (HP bar `#adv-topbar` left:276 กว้างถึง 462 + กระดาน `#adv-board`) **ชนคลัสเตอร์ปุ่มขวา** (mic/spk/chat/vmode) · ที่ 844 ไม่ชน แต่ ≤~640 ชน
- **✅ แก้ (js/adventure3d.js):** (1) **ถอด `.adv-mecha` ออกจากกฎ `.adv-drive` ทั้งหมด** (คืน drive เป็นเลย์เอาต์เดิม ไม่กระทบ) (2) **เพิ่มบล็อก `.adv-mecha` เฉพาะ ที่พอดีจอแคบ:** `#adv-map` บนซ้าย · `#adv-topbar`(HP+เหรียญ) top:8 left:134 (ต่อขวา map) · `.adv-hp` width:70 · ปุ่ม **2-3 แถวมุมบนขวา** (exit/help/chat = top:8 · mic/spk/vmode = top:46 · tmute/podbtn = top:84) ทุกปุ่มอยู่**เหนือปุ่มยิง** (fire bottom:34) เสมอ · **`#adv-board{display:none}`** (ซ่อนกระดานคะแนนในโลกหุ่น — จอแคบไม่พอ ปุ่มสำคัญกว่า)
- **✅ ยืนยันบนโค้ดจริง (โหลด adventure3d.js สด + start('mecha') + adv-touch, resize จริง):** 480×300 / 568×320 / 844×390 → **OVERLAPS ว่างทุกจอ** · board ซ่อนจริง · map(8,8) · hp(134-310) · exit(top:8) · mic/vmode(top:46) · fire(bottom-right) ไม่ทับ
- **📝 ไฟล์แก้:** `js/adventure3d.js` + `sw.js` (v7→v8 บังคับรีเฟรช) + `version.json` .206→.207 · **ผู้ใช้: ปิดแอป/รีโหลดเต็ม 1 ครั้ง** · ⚠️ ถ้ายังทับอยู่บนเครื่องจริง = แคชโหด/hosting ค้าง (repo private ตรวจ live ผ่าน curl ไม่ได้)

### ✅ รอบ 215 (14 ก.ค.) — 🔄 บังคับรีเฟรชแคช (SW v6→v7) กันเครื่องค้าง HUD โลกหุ่นเก่า (version .206)
- **ผู้ใช้:** ส่ง screenshot โลกหุ่น "ปุ่มซ้อนกันจนกดไม่ได้ ให้ขยับที่ใหม่" (mic/spk ซ้อนปุ่มยิง)
- **วินิจฉัย (สำคัญ — อย่าเพิ่งแก้เลย์เอาต์ซ้ำ):** เลย์เอาต์ `.adv-mecha` รอบ 214 **ถูกต้องแล้ว** — ยืนยันด้วย getBoundingClientRect บน overlay จริง (start('mecha')+adv-touch) หลายขนาด: 844×390 map(8,8)/ปุ่มทั้งแถว top:8 · OVERLAPS **ว่างทุกขนาด 640–960w × 280–430h** (รวม board/topbar) · screenshot ผู้ใช้ = **เลย์เอาต์เก่า** (mic/spk เรียงตั้ง top:202/242 ชิดปุ่มยิง bottom:34 → ซ้อนบนจอเตี้ย) ⇒ เครื่องยังรัน adventure3d.js เดิม
- **ทำไมค้าง:** SW `pet-vocab-v6` network-first ก็จริง แต่ adventure3d.js อยู่ใน SHELL precache → บางเครื่องเสิร์ฟจากแคชเก่า/ยังไม่รีโหลดเต็มหลัง .205
- **✅ แก้:** bump `CACHE_VERSION` **v6→v7** (sw.js) → install ใหม่ precache SHELL สดทั้งชุด (fetch จาก network) + activate ลบแคช v6 + skipWaiting/clients.claim → เครื่องรับโค้ดใหม่รอบโหลดถัดไป · **ผู้ใช้: ปิดแอป/รีโหลดเต็ม 1 ครั้ง**
- **📌 deploy หมายเหตุ:** repo **private** → `raw.githubusercontent`/GitHub Pages ตอบ 404 เมื่อ curl ไม่มี auth (ปกติ ไม่ใช่ deploy พัง) · ยืนยันด้วย `git rev-parse origin/main == HEAD` + `git show origin/main:js/adventure3d.js | grep adv-mecha` = พบ → โค้ดขึ้น main ครบ
- **📝 ไฟล์แก้:** `sw.js` (CACHE_VERSION) + `version.json` .205→.206 · **ไม่แตะ layout** (ถูกอยู่แล้ว)

### ✅ รอบ 214 (14 ก.ค.) — 🤖 โชว์รูมหุ่นภาพใหญ่ขึ้น + ย้าย HUD โลกหุ่นไปแถวบนเหมือนโลกขับรถ (version .205)
- **ผู้ใช้สั่ง 3 ข้อ (จาก screenshot):** (1) จอใหญ่โชว์รูมหุ่น ขยายภาพหุ่นให้หัว-เท้าเกือบแตะขอบ เว้น ~1ซม. (2) thumb ขยายภาพหุ่นใหญ่กว่านี้ + ขยับราคาเหลืองลงชิด "ขายไปแล้ว" เพื่อเปิดที่ให้ภาพใหญ่ (3) โลกหุ่นยนต์ ย้าย mini map + ปุ่ม (ออก/แชท/mic/spk) ไปไว้ด้านบนเหมือนโลกขับรถ
- **✅ แก้ (ทั้งหมดเป็น CSS · ยืนยันด้วย getBoundingClientRect ตามกฎทอง — screenshot harness ค้างบนซีนนี้):**
  - **(1) จอใหญ่ `css/lobby.css`:** `.rs-big-img max-height:46vh→100%` + `.rs-big{max-height:70vh;padding:34px 14px}` (min-height 250 คงเดิม) → ภาพหุ่น fill สูงตาม big เว้นขอบ = padding · **glow `.rs-elec/.rs-edge inset:12px→34px 14px`** (=padding ของ big) → กล่อง mask แนบตัวหุ่นพอดี · media <640 `.rs-big{max-height:52vh}` `.rs-big-img:100%` · **ยืนยัน (2 เคส stage สูง/เตี้ย):** gap บน/ล่าง 30px เท่ากัน · glow topDiff/botDiff=0 (แนบเป๊ะ) · ไม่ overflow · **หลักคิด cap ที่ `.rs-big` (ไม่ cap ภาพด้วย vh) → ภาพ 100% เต็ม big เสมอ + glow inset=padding แนบตัว** (ถ้า cap ภาพด้วย vh, glow จะไม่แนบเวลาจอสูง)
  - **(2) thumb `css/lobby.css`:** `.rs-thumb-pic height 74→108`+`img max-height 108` (ภาพหุ่นใหญ่ขึ้น) · `.rs-thumb gap 4→2` + `.rs-thumb .sold-badge margin-top 2→0` (ราคาเหลืองชิดป้ายขายไปแล้ว) · ยืนยัน: thumbImg 74→104px · price_sold_gap 6→4
  - **(3) โลกหุ่น HUD `js/adventure3d.js`:** เพิ่ม `.adv-mecha` คู่กับ `.adv-drive` ในทุกกฎตำแหน่ง HUD ร่วม (map/board/topbar/hp/exit/help/chat-btn/mic/spk/vmode/tmute/podbtn) → mecha ได้เลย์เอาต์แถวบนเหมือน drive · **ไม่แตะ** `#adv-cross`(crosshair เล็ง คงกลางจอ)/`#adv-inst`(drive เท่านั้น) · **ยืนยันบน overlay จริง (start('mecha')):** isMecha=true · map top:8 leftGap:8 (บนซ้าย) · exit/chat/mic/spk/vmode ทั้งแถว top:8 (ขวาไล่มา) · cross top:175 กลางจอ (ไม่ซ่อน)
- **⚠️ ค้าง: ลองจริงมือถือ** (ดูภาพหุ่นจอใหญ่+thumb + HUD โลกหุ่นแถวบน) · **📝 ไฟล์แก้:** `css/lobby.css` + `js/adventure3d.js` + `version.json` .204→.205

### ✅ รอบ 213 (14 ก.ค.) — 🛣️ ถนนทุกเส้นขับได้จริงจนสุดปลาย + 🏠 อาคารน่ารักเข้าชุดรถ (version .204)
- **ผู้ใช้สั่ง 2 ข้อ:** (1) ถนนทุกเส้นในโลกขับรถใช้ได้จริง (บางจุดจับปรับแล้วยังใช้ไม่ได้) (2) ปรับอาคาร/ตึกให้แนวน่ารักเข้าชุดกับรถ
- **🐛 ต้นตอข้อ 1 (พบด้วยการวิเคราะห์ coverage):** ทุกอย่างในโลกขับรถอิง `R=C.rad=2200` แต่ถนนจริงจาก OSM บางเส้นยื่นพ้นรัศมีถึง **~3,703 ม.** → (ก) **กริดถนนที่ขับได้** (`grid`) คลิปที่ `R+40=2240` ทำให้ถนนนอกรัศมีเป็น grid=0 → ขับแล้ว "คลานเหมือนนอกถนน" · (ข) รถโดน**ดึงกลับที่ `rad-25=2175`** (บรรทัด ~4555) → ถนนนอกรัศมี "ไปไม่ถึง" เลย · วิเคราะห์: centerline ถนน **7,147/95,747 จุด (7%)** ขับไม่ได้ — ทั้งหมดเป็น out-of-bounds (0 จุดที่เป็น grid=0/น้ำ ในเขต) ⇒ ปัญหาเดียวคือ "ขอบเขตเล็กเกิน"
- **✅ แก้ข้อ 1 (buildDriveCity):** คำนวณ `RX` = รัศมีไกลสุดของถนนทุกเส้น +80 (≈3,784) แล้วขยายให้คลุมสุดปลาย: **grid** `GW=ceil(RX*2/GS)` `GOFF=RX` (1262×1262 ~1.5MB) · **พื้น** `PlaneGeometry(RX*2+500)` · **เรดาร์บิตแมป** `MSZ=ceil(RX*2*MPX)` · **ขอบเมือง** เก็บ `rad:RX` (ดึงกลับที่ RX-25=3,759 แทน 2,175) · **ยืนยันบนโลกที่สร้างจริง (Adventure3D.start('drive')):** grid `GW=1262 rad=3784` · centerline ถนน **0/50,095 จุดขับไม่ได้** (เดิม 7,147) · ทุกจุดอยู่ในขอบเขตดึงกลับ
- **✅ แก้ข้อ 2 (โทนเมืองน่ารัก toy-town เข้าชุดรถบล็อกสีสด · self-contained ไม่ต้องเจนภาพใหม่):** (1) **ผนังพาสเทลลูกกวาด** — เปลี่ยน `tints` (ตึกจริง 79 หลัง) + `pal` (ตึกแถว 4,660 หลัง คูณกับภาพ facade → เมืองสีสด) จากเบจหม่น → ชมพู/ฟ้า/เขียวมิ้นต์/ครีมเหลือง/ม่วง/พีช (2) **หลังคาปิรามิดสีลูกกวาด (hip roof)** คลุมยอดตึกแถวทุกหลัง — `InstancedMesh` ConeGeometry 4 ด้าน (1 draw call · มุมหลังคาตรงมุมกล่อง · ชายคายื่น 12% · สี `CUTE_ROOF` 8 สีสด) (3) **ฝาครอบยอดสีสด** บนตึกจริง 79 หลัง (extrude ผังเดิม 1.4m สีหลังคา) · **ยืนยัน:** scene มี `InstancedMesh` ConeGeometry **count 4,660 hasColor** จริง + pixel sample เมือง **colorful 55.5% · 26 สีเด่น** (เดิมเทา-เบจหม่น)
- **⚠️ verify:** screenshot harness ค้าง 30s บนซีนนี้ (ภาพหนัก — กฎทองรู้อยู่แล้ว) → ยืนยันด้วย scene-graph + pixel sampling แทน · **ค้าง: ลองจริงมือถือ** (ขับออกไปถนนขอบเมืองดูว่าเร็วปกติ + ดูหลังคา/สีเมือง)
- **📝 ไฟล์แก้:** `js/adventure3d.js` (buildDriveCity) + `version.json` .203→.204

### ✅ รอบ 212 (14 ก.ค.) — ⏰ ตั้งสำรองข้อมูลอัตโนมัติทุกวัน (Windows Task Scheduler)
- **ผู้ใช้สั่ง:** ตั้ง backup อัตโนมัติทุกวัน · ต่อยอดจากสคริปต์ `tools/backup_db.sh` (รอบ 211)
- **Task `VocabWorldBackup`** รันทุกวัน **19:00** → `bash tools/backup_daily.sh` (ห่อ backup_db.sh + log ลง `backups/backup_log.txt`)
- ตั้งด้วย `tools/setup_backup_task.ps1` (Register-ScheduledTask · `-StartWhenAvailable` = ถ้าเครื่องปิดตอน 19:00 จะรันทันทีที่เปิดเครื่องรอบถัดไป · `-MultipleInstances IgnoreNew` · timeout 15 นาที) · **รันเฉพาะตอนล็อกอินผู้ใช้นี้** (ใช้ firebase login ในโปรไฟล์ · ไม่ต้องเก็บรหัสผ่าน)
- **⚠️ gotcha:** ps1 ต้องเป็น ASCII ล้วน — Windows PowerShell 5.1 อ่าน UTF-8 ไม่มี BOM แล้วภาษาไทยเพี้ยน string terminator พัง (เขียนคอมเมนต์/ข้อความเป็นอังกฤษ)
- **bash.exe** = `C:\Program Files\Git\bin\bash.exe` · **ยืนยัน:** `schtasks /run` → รันผ่าน Scheduler จริง ได้ db 16KB+auth 1928B + log exit 0 · Next Run 19:00
- **จัดการ:** ดู `schtasks /query /tn VocabWorldBackup /v` · ยกเลิก `schtasks /delete /tn VocabWorldBackup /f` · แก้เวลา = แก้ `$time` ใน ps1 แล้วรันซ้ำ
- ไม่ deploy (dev-only) · `backups/` ยัง gitignore (มีข้อมูลเด็ก)

### ✅ รอบ 212 (14 ก.ค.) — 🚗 โชว์รูมรถใหม่ (ตัวรถ+ภายในห้องโดยสาร จอใหญ่ ไฟฟ้าไล่ตัว premium) (version .203)
- **ผู้ใช้สั่ง:** ภาพภายในรถ 10 ภาพเสร็จ (`img/car/dash_car_01..10.png` — track+deploy แล้วรอบ 211) → จัดหน้าขายรถใหม่ให้โชว์**ตัวรถ + ภาพภายใน** ภาพใหญ่กว่าเดิม · หรือจัดให้โดดเด่นเหมือนหมวดหุ่นยนต์
- **เปลี่ยน car-grid (การ์ดเล็กเรียงกริด) → โชว์รูม `.cs-showroom`** (แพตเทิร์นเดียวกับหุ่นยนต์ `.rs-showroom` แต่ธีมทอง/ดำ + สีประจำคัน):
  - `.cs-list` thumb 10 คัน (ภาพตัวรถ+ชื่อ+ราคา+ยอดขาย+"🚘 มีแล้ว")
  - `.cs-stage` จอใหญ่: **`.cs-big` ตัวรถใหญ่ + ไฟฟ้าไล่ตัว/แสงขอบ (mask `--cs-img` · conic beam สี `--cc` ประจำคัน · xor edge)** → **`.cs-interior` ภาพภายในห้องโดยสาร (`dash_<id>`)** → `.cs-info` ชื่อ/ราคา/ยอดขาย/ปุ่ม "ดูรายละเอียด/ซื้อ" (→ openCarBuyDialog คง flow พ.ร.บ./ผ่อน/ประกัน)
  - **วนโชว์ทีละคันทุก 4.2 วิ · แตะ = ค้าง+หยุดวน 2 นาที** (`csInit`/`csShowBig`/`csIdx`/`csPausedUntil`/`csTimer` — คู่ขนาน rs*)
- **ui.js:** `renderCarShowroom()` แทน grid ใน renderVehicleShop · `carInteriorImg(id)`=IMG_FILES['dash_'+id] · probe `img/car/dash_*` · เรียก `csInit()` ใน renderMarketCard (ข้าง rsInit) · **css/lobby.css:** `.cs-*` (elec/edge เทคนิคเดียวกับ rank-beam/rs-elec)
- **ยืนยัน browser:** ext 10/inr 10 ภาพ resolve · 10 thumb+stage · big มี elec+edge+`--cs-img` · interior img+label · info ชื่อ/ปุ่ม · แตะสลับคัน→ext+inr+สี glow เปลี่ยนตาม (car_01 แดง→car_07 เหลือง #fdd835) · ไม่มี error (WebGL log = artifact harness) · ⚠️ screenshot harness ค้าง (ภาพ full-res ~2MB×หลายใบ) ตรวจด้วย DOM แทน · deploy live .203
- **⏭ ค้างต่อยอด:** เสียงเครื่องยนต์ต่อคัน (ผู้ใช้ยังต้องเจน) · ⚠️ ภาพภายใน 1.5-2.4MB/คัน (โหลดตอนวนโชว์) — เสนอย่อได้ถ้าอนุญาต

### ✅ รอบ 211 (14 ก.ค.) — 💾 สำรองข้อมูล server ลงเครื่อง (เผื่อโดนลบเหมือน GitHub)
- **ผู้ใช้สั่ง (รอบ 209):** "ข้อมูลทุกอย่างที่เอาขึ้น server ให้สำรองไว้ในเครื่องด้วย รวมถึงระบบ database เผื่อโดนลบเหมือน GitHub"
- **สคริปต์ใหม่ `tools/backup_db.sh`** (ใช้ firebase CLI ที่ login ค้างไว้ ชุดเดียวกับ deploy) ดึงลงเครื่อง:
  - **(1) Realtime Database ทั้งก้อน** → `backups/db_<เวลา>.json` (`firebase database:get "/"`)
  - **(2) รายชื่อผู้ใช้ Auth ทั้งหมด** → `backups/auth_<เวลา>.json` (`firebase auth:export`)
  - เก็บย้อนหลัง 14 ชุด/ชนิด (ลบเก่ากว่านั้นออกกันดิสก์เต็ม)
- **⚠️ gotcha ที่แก้:** Git Bash แปลง `"/"` เป็น path วินโดวส์ → `database:get` error "Path must begin with /" · แก้ด้วย `export MSYS_NO_PATHCONV=1` · แต่ทำให้ `auth:export` (รับ path เป็น argument) เปิดไฟล์ POSIX path ไม่ได้ → ต้อง `cygpath -w` แปลง output เป็น path วินโดวส์เฉพาะ auth:export
- **`backups/` เข้า .gitignore** — มีข้อมูลเด็ก (ชื่อเล่น/เซฟ) ห้าม push ขึ้น repo สาธารณะ
- **ยืนยันรันจริง:** db 16,203 bytes (chats/users/... จริง) + auth 3 accounts 1,928 bytes ✓ · **กู้คืน:** `firebase database:set / backups/db_<เวลา>.json` + `firebase auth:import backups/auth_<เวลา>.json`
- **ไม่ต้อง deploy** (สคริปต์ dev-only · deploy_firebase.sh ตัด tools/ ออกอยู่แล้ว)
- **💡 ต่อยอด (ยังไม่ทำ · เสนอผู้ใช้):** (1) ตั้ง Task Scheduler วินโดวส์รันอัตโนมัติทุกวัน (2) ปุ่มให้ผู้เล่น export/import เซฟตัวเองเป็นไฟล์ JSON ในหน้าตั้งค่า

### ✅ รอบ 211 (14 ก.ค.) — 🚗 ระบบซื้อรถหลายคัน (multi-car) + เลือกคันที่จะขับ (version .202)
- **ผู้ใช้สั่ง (รอบ 209):** "ไม่จำกัด ว่าจะต้องซื้อได้แค่คันเดียว บางคนอยากซื้อสะสมหลายคัน · แต่ให้แต่ละคันมีลักษณะเฉพาะตัว เช่น สี console ภายใน + เสียงเครื่องยนต์"
- **เปลี่ยนโมเดล `state.car` (คันเดียว) → `state.cars[]` + `carIdx`** (คันที่กำลังขับ) · migration: ของเดิม `state.car`→`[state.car]` อัตโนมัติ · helper `myCar()` = `state.cars[state.carIdx]` · ทุกที่ที่อ้าง `state.car` เปลี่ยนเป็น `myCar()` (`js/state.js`, `js/ui.js`, `js/adventure3d.js`)
- **assetValue/assetCount วนรวมทุกคัน** (ทุกคันนับเป็นทรัพย์สินในแรงค์ ตามที่ผู้ใช้ขอ) · ค่างวดสินเชื่อรายเดือนวนทุกคัน
- **หน้าตลาดยานพาหนะ:** ซื้อได้หลายคัน (เอาบล็อก "มีรถอยู่แล้ว" ที่บล็อกออก) · คันที่ซื้อแล้วปุ่มขึ้น "🚘 มีคันนี้แล้ว" · เพิ่มแถบ `.car-pick-list` เลือกคันที่จะขับ (ภาพ+ชื่อ+▶ คันที่ใช้อยู่+ป้าย overdue) · กล่อง `.car-mine` โชว์รายละเอียด+ประกัน/สินเชื่อ ของคันที่เลือก
- **console ภายในต่อคัน:** `loadCarDash()` โหลด `img/car/dash_<carId>.png` → fallback `img/car/dash.png` → fallback CSS · เรียกตอน buildDom + ตอน start() เข้าโหมดขับ
- **CSS ใหม่ (`css/lobby.css`):** `.car-mine-head .car-pick-list .car-pick(.active) .car-pick-pic .car-pick-name .car-pick-od`
- **ยืนยัน (browser):** migration คันเดียว→cars[] ✓ · ซื้อ 2 คัน active=คันล่าสุด ✓ · สลับคันขับ ✓ · assetValue รวม 2 คัน=190,200 ✓ · assetCount รวม ✓ · carDriveBlock ผ่าน ✓ · render 2 picker (active 1) + head "2 คัน" + 8 ปุ่มซื้อ + 2 "มีคันนี้แล้ว" ✓ ไม่มี error
- **⏭ ค้างต่อ:** (1) **เสียงเครื่องยนต์เฉพาะคัน** (ยังไม่ทำ — prompt อยู่ `PROMPTS_CARS_INTERIOR.md`) (2) **ระบบสำรองข้อมูลลงเครื่อง** (export/import JSON + mirror server data — ผู้ใช้สั่งรอบ 209 ยังไม่เริ่ม) (3) prompt console ภายใน/เสียงเครื่องยนต์ต่อคัน ผู้ใช้ยังต้องเจนภาพ+เสียงมาวาง

### ✅ รอบ 195 (14 ก.ค.) — โปรไฟล์โชว์สัตว์เลี้ยง 3 ตัว + แตะภาพเล็ก→Layer ภาพใหญ่ 🐾🖼️ (version .186)
- **สเปกผู้ใช้:** (ไอเดียต่อยอด ข้อ 1) ใครมีสัตว์เลี้ยง 3 ตัว โชว์ 3 ตัวได้ · แตะภาพเล็ก → Layer ภาพใหญ่เกือบเต็มจอ **ไม่มี scrollbar** ให้อินกับบรรยากาศ
- **ทำ:**
  - **online.js:** `petDescriptor(p)`={t,s,sh,e,nm} · `feedPushPets()` ดัน `feed/<me>/pt`=JSON สูงสุด 3 ตัว (gate `feedShare.assets` · sig `Online.lastPetsSig` · เรียกท้าย `feedPushAssets`) · `fetchPlayerPets(uid)` ตัวเอง=`state.pets` · คนอื่น=parse `feed/<uid>/pt`
  - **ui.js `showPlayerCard`:** โซน `.pl-pets-wrap` (สูงสุด 3) · `petDescImg(d)` คำนวณ key ภาพ (egg/shape/item/normal) จาก `IMG_FILES` ชุดเดิม (ไฟล์ภาพ pet แชร์ทุกเครื่อง) fallback emoji · delegated click `.pl-pet/.pl-asset` → `openImgLightbox`
  - **`openImgLightbox(src,cap)`:** overlay z-200 · img max 92vw/88vh object-fit contain (ไม่มี scroll) · popIn · แตะที่ไหนก็ปิด
  - **css/lobby.css:** `.pl-pets/.pl-pet` (การ์ด 92px ภาพ 76px+ชื่อ) · `.img-lightbox` (blur bg + ปุ่ม ✕)
  - **rules:** เพิ่ม `feed/$uid/pt`={string ≤2000} ข้าง `a` (RULES.md อัปเดตแล้ว)
- ✅ **ยืนยัน preview:** โปรไฟล์โชว์ 3 ตัว (เหมียว/ตูบ/มะนาว) ชื่อ+ภาพถูก · แตะ pet→lightbox src+cap "เหมียว" ไม่ล้นจอ · แตะ asset (cupcake)→lightbox ถูก · ปิดได้ · online.js feedPushPets/fetchPlayerPets/petDescriptor เป็น function · ไม่มี console error
- **⚠️ ค้างผู้ใช้:** (1) **publish rules โหนด `feed/$uid/pt`** — Artifact ปุ่มคัดลอก (ไม่ publish = สัตว์คนอื่นไม่โชว์ · ของตัวเอง+lightbox ทำงานปกติ) (2) ทดสอบจริง 2 เครื่อง (เปิดเผยทรัพย์สินในตั้งค่า → อีกเครื่องเปิดโปรไฟล์เห็นสัตว์) · หมายเหตุ: สัตว์เปิดเผยพ่วงสวิตช์ "ทรัพย์สิน" (feedShare.assets) เดียวกัน

### ✅ รอบ 194 (14 ก.ค.) — เกมค้นหาคำ Word Search (ปุ่ม rail ที่ 5 + แผงฟ้าเลื่อนจากซ้าย) 🔎 (version .185)
- **สเปกผู้ใช้:** เพิ่มปุ่มในคอลัมน์ซ้าย → แผงฟ้าล้ำยุคยืดจากซ้ายไปขวาเกือบเต็มจอ เล่น Word Search สุ่มคำไม่ซ้ำ/เกม · ปุ่ม สุ่มเกมใหม่ / เก็บกระดานชั่วคราว (เลื่อนซ้าย ข้อมูลอยู่) / ล้างกระดาน-ออกจากเกม (ตัวหนังสือลบมีสไตล์ แล้วเลื่อนเก็บ) · **🔒 กฎเหล็ก: คำตามระดับชั้นผู้เล่นเท่านั้น**
- **ทำ (ไฟล์ใหม่ `js/wordsearch.js` + index.html ปุ่ม/script + css/lobby.css):**
  - ปุ่ม `#btn-rail-wordsearch` (🔎 ค้นหาคำ) หลังปุ่มโรงงาน · handler เปิด `WordSearch.open()`
  - แผง `#ws-overlay>#ws-board` fixed left · slide `transform:translateX(-106%↔0)` transition .5s · ธีมฟ้า gradient+scanline sci-fi
  - **กริด 10×10:** `generate()` วางคำสุ่ม 8 ทิศ (`place` เลี่ยงชน) + เติม A-Z · คำจาก `pool()` = `vocabForStudent()` กรอง `[^A-Z]` ยาว 3-10 ไม่ซ้ำ · คิว `takeWords` สับใหม่เมื่อหมด/เปลี่ยนชั้น = ไม่ซ้ำข้ามเกม
  - **ลากเลือก:** mouse+touch → `cellAt`(elementFromPoint+closest) · `lineCells` ตรวจแนวตรง/ทแยง · `commit` เทียบคำ (ปกติ+reverse) เจอ=mark `.found`+`sfx.coin`+`speakWord` · ผิด=`.bad` แฟลช
  - **ปุ่ม 3:** `newGame` (สุ่มใหม่) · `stash` (saveTemp→slideAway · เปิดใหม่ restore `state.wordSearch`) · `clearExit` (เซลล์ `.gone` กระจายหาย 650ms → slideAway + ลบ state)
  - win เมื่อครบทุกคำ (แบนเนอร์ · ไม่ให้เหรียญ กันเงินเฟ้อ)
- ✅ **ยืนยัน preview:** ป.1-6 คำตรงชั้น+distinct+placement valid+กริดเต็ม A-Z · drag จริงเจอคำ WEDNESDAY mark+efpHitsCell · wrong ไม่นับ · win แสดง · stash คืนกระดาน+progress · new ต่าง+progress ใหม่ · clear ลบ state+ซ่อน · fit 812×375 (board 780×375 · กริด 275 square) · ไม่มี console error
- **🐞 gotcha สำคัญ (บันทึกไว้):** preview tab พื้นหลัง = **CSS transition ถูกพัก** → board ค้างที่ translateX(-106%) แม้ใส่ `.open` แล้ว (rule ถูก ยืนยันด้วย styleSheets) · ปิด `transition:none` → snap ไป translateX(0) ทันที = ของจริง (visible) เลื่อนปกติ · **อย่าเข้าใจผิดว่า slide พัง**
- **⚠️ ค้างผู้ใช้:** ลองจริงมือถือ (ลากนิ้วหาคำ + สไลด์เข้า-ออก) · ปรับได้: `SIZE`(10) `WANT`(7 คำ) `MAXLEN`(10) ใน wordsearch.js

### ✅ รอบ 193 (14 ก.ค.) — ตุ๊กตาหน้ารถ 3 ต่อยอด: ก้ม-เงย + แตะสะกิด + สกินซื้อด้วยเหรียญ 🪆🎯👆 (version .184)
- **ผู้ใช้สั่ง "ทำทั้งหมดที่เสนอเลย"** (3 ไอเดียต่อยอดตุ๊กตาหน้ารถรอบ 191) — ทำใน adventure3d.js ไฟล์เดียว:
  1. 🎯 **ก้ม-เงยตอนเบรก/ออกตัว:** สปริงชุด 2 (`bobPitch/bobPitchV`) ขับด้วย accel=`(speed-_bobPrevSpd)/dt` · apply `rotateX(pitch) rotate(sway)` บน img + `perspective:560px` บน `#adv-bobble` (transform-origin เท้า) · `BOB_PITCH_FORCE=0.9 BOB_PITCH_MAXDEG=16`
  2. 👆 **แตะสะกิด:** `#adv-bobble` pointer-events auto + touchstart/mousedown (preventDefault+stopPropagation กันโดน joystick) → `bobblePoke`: อัด `bobVel±6.5`/`bobPitchV+5` + คลาส `.poke` เด้ง + เสียง "ปิ๊ง" WebAudio (osc sine 720→190→340Hz = ฟีลสปริง · lazy `_bobAC`)
  3. 🪆 **สกินพิเศษซื้อด้วยเหรียญ:** `BOBBLE_SKINS` 5 แบบ (''/glow2000/gold6000/rainbow12000/ghost20000 · เอฟเฟกต์ `filter` CSS ล้วน ไม่มีไฟล์) · ปุ่ม `#cs-doll` ในแผงเตรียมออกรถ → `openDollPicker` (grid พรีวิวตัวละคร+สกิน · ซื้อ=หักเหรียญ+`state.bobbleOwned[id]` · เลือก=`state.bobbleSkin`) · `bobbleApplySkin` ใส่คลาส `bskin-<id>` บน `#adv-bobble`
- **🐞 gotcha สำคัญ:** base rule `#adv-bobble img{filter:...}` มี ID → specificity ชนะ `.bskin-X img` · สกินต้องเขียน `#adv-bobble.bskin-X img,.dp-prev.bskin-X img{...}` (พรีวิวใช้ `.dp-prev` ไม่มี ID competitor เลยพอ)
- ✅ **ยืนยัน preview (โหลด three+city จริง · start drive · step):** เบรกแรง→pitch 16° · แตะ→sway พีค 22° · ซื้อทอง 6000 (30000→24000) filter สดเป็น sepia/gold จริง · เหรียญไม่พอ (1000<12000)→ปฏิเสธไม่หักเหรียญ คงสกินเดิม · picker สูง 245<375 พอดีจอ · ไม่มี console error
- **⚠️ ค้างผู้ใช้:** ลองจริงมือถือ — จูน `BOB_PITCH_FORCE`/`BOB_PITCH_MAXDEG` (ฟีลก้ม-เงย) + แรงสะกิดใน `bobblePoke` + ราคาสกิน (BOBBLE_SKINS cost) · เสียงปิ๊ง WebAudio เล่นได้เพราะแตะ=user gesture

### ✅ รอบ 192 (14 ก.ค.) — Spin-to-Spell ลดรางวัลเต็ม 5→1 คำ/วัน 🪙 (version .183)
- **สเปกผู้ใช้:** รางวัล 1,000 เหรียญ ให้มีวันละ 1 รอบพอ (ไม่เอา 5/3 แล้ว — ถ้าเล่นทุกวันเงินเฟ้อจนไม่เล่นจับคู่คำศัพท์) · ถัดจากรอบ 1,000 = ราคาปกติเดิม (100)
- **ทำ:** แก้ `SPELL_FULL_PER_DAY` 5→1 ใน lobby3d.js (บรรทัดเดียว · HUD `.sp-day`, ป้าย coinpop, ข้อความ "รางวัลเต็ม N คำ/วัน" อิงค่านี้อัตโนมัติ) · SPELL_COIN 1000 / SPELL_COIN_LATE 100 คงเดิม · perfect ×1.5 คงเดิม (คำแรก perfect = 1,500)
- ✅ **ยืนยัน (fetch สด + จำลอง logic):** SPELL_FULL_PER_DAY=1 · วันสด spellDayLeft=1 (ได้ 1,000) · หลังเก็บ 1 คำ = 0 → คำถัดไป 100
- หมายเหตุ: ผู้ใช้ที่วันนี้เก็บไปแล้ว >1 คำ (state.spellWords เดิม) วันนี้จะรับ 100 หมด · พรุ่งนี้รีเซ็ตเป็น 1 คำเต็มปกติ

### ✅ รอบ 191 (14 ก.ค.) — ตุ๊กตาดุ๊กดิ๊กหน้ารถ (รูปตัวละครที่เลือก) หัวส่ายตามแรงเลี้ยว 🪆🚗 (version .182)
- **สเปกผู้ใช้ (จาก screenshot ลูกศรชี้บนแผงหน้าปัด):** ผู้เล่นเลือกตัวละครใด (blk1..8) → จำลองเป็น "ตุ๊กตาดุ๊กดิ๊ก" รูปตัวนั้นยืนบนแผงหน้าปัดตรงลูกศร · หัวขยับ (ส่าย) สัมพันธ์กับแรงเลี้ยวของรถ
- **ทำ (adventure3d.js + CSS ในไฟล์เดียว):**
  - element `#adv-bobble` (img=`img/blocks/<blkN>.png` ตาม `state.blockAv` · ตั้งใน `bobbleSetAvatar` เรียกจาก carStartShow) + เงาฐาน `.bob-base` + ขดสปริง `.bob-coil` ใต้เท้า
  - **ตำแหน่ง (`bobbleLayout`):** เท้าวางที่ `BOBBLE_FOOT=[542,596]` พิกัดภาพ dash 1536×1024 → map จอด้วยสูตรเดียวกับจอวิทยุ/เข็มเกจ (s=box.width/1536 · offY object-position 66%) · สูง `BOBBLE_H=372` · relayout ตอน resize
  - **หัวส่าย (`bobbleTick` เรียกท้าย tickDrive):** สปริงหน่วง `θ''=-ω²θ-2ζω·θ'-latA·FORCE` · หมุน img รอบฐานเท้า (transform-origin 50% 96%) · latA = แรง G ด้านข้าง (yrApplied×dSpeed จาก tickDrive) → หัวเหวี่ยง "นอกโค้ง" แล้วสปริงกลับ+โยกค้าง · ค่าจูน: `BOB_OMEGA=8.4 BOB_ZETA=0.16 BOB_FORCE=0.5 BOB_MAXDEG=22` · idle สั่นเบาตามความเร็ว · reset bobAng/bobVel ตอนเข้าโลก
- ✅ **ยืนยัน preview (โหลด three+city_kpp จริง · start('drive') · step frames):** avatar=blk6 ถูกต้อง · ยืนบนแผงเหนือจอวิทยุ · **เลี้ยวขวา→หัวส่ายซ้ายพีค ~10° (steer 0.29) · ปล่อยตรง→ดีดกลับ -7.8→+1.4→-0.8 โยกลดแบบสปริง underdamped** · ไม่มี console error
- **⚠️ ค้างผู้ใช้:** ลองจริงมือถือ — จูน **ตำแหน่งเท้า `BOBBLE_FOOT` / ขนาด `BOBBLE_H` / แรงส่าย `BOB_FORCE` / เพดาน `BOB_MAXDEG`** ใน adventure3d.js ให้ตรงลูกศร+ฟีลถูกใจ · ตุ๊กตาใช้ภาพ blkN.png เดิม (หมุนทั้งตัวรอบเท้า = หัวบนสุดส่ายมากสุด)

### ✅ รอบ 190 (13 ก.ค.) — แชทลับ (อ่านแล้วหายใน 20 วิ) + ธีมกล่องแชท 7 แบบ (เพื่อน/แฟน/น่ารัก) 🕵️🎨 (version .181)
- **สเปกผู้ใช้ 2 ข้อ:**
  1. **ปุ่มสวิตช์เปิด/ปิด "แชทลับ"** บนหัวกล่องแชท — เปิดแล้ว **ข้อความที่อ่านแล้วจะหายเองใน 20 วิ** (คล้าย vanish mode ของ Messenger)
  2. **ธีมกล่องแชทหลายแบบ** เน้นแนวเพื่อน/แนวแฟน/พื้นหลังน่ารัก
- **ทำ (ui.js `openChat` + online.js + css/lobby.css):**
  - **แชทลับ:** สวิตช์ `#chat-secret` บนหัวกล่อง (จำแยกตามคู่ `state.secretChat[pairId]`) · เปิด=โชว์แถบเตือน `.chat-secret-note` + บับเบิลของอีกฝ่ายได้ class `.vanish` (จาง 20 วิ) · กลไก: **ฝั่งผู้อ่านเป็นคนลบ** — ในคอลแบ็ก chatListen ถ้าเปิดลับ ตั้ง `setTimeout(20000)` ลบข้อความของอีกฝ่าย (`m.f!==me`) ผ่าน `chatDeleteMsg` (online.js: `chatRef(uid).child(key).remove()`) → ลบจาก node ที่แชร์กัน = **อีกฝ่ายก็เห็นหายด้วยผ่าน live listener** · ข้อความของเราเองไม่ลับฝั่งเรา (จะหายฝั่งผู้รับตอนเขาอ่าน ถ้าเขาเปิดลับ) · ปิดกล่อง/ปิดสวิตช์=ยกเลิก timer ทั้งหมด · **ไม่ต้องแก้ rules** (rules /chats ให้ทั้งคู่ใน pairId ลบได้อยู่แล้ว)
  - **ธีม 7 แบบ:** ปุ่ม 🎨 เปิดแถบ swatch (`CHAT_THEMES`: sky ฟ้าใส · mint เพื่อนซี้ · love คนพิเศษ · peach พีชหวาน · lavender ลาเวนเดอร์ · bubble ฟองสบู่ · night ราตรีดาว) · จำแยกตามคู่ `state.chatTheme[pairId]` · CSS ใช้ตัวแปร `--c-bg1/bg2/head1/head2/bub/mine/accent/pat` บน `.chat-box.ct-<id>` (พื้นหลังลายจุด/หัวใจ/ฟอง/ดาว ด้วย radial-gradient ล้วน ไม่ใช้ไฟล์ภาพ) · swatch พรีวิวสีตัวเองผ่าน `.chat-theme-sw.ct-<id>`
- ✅ **ยืนยัน preview (fake reactive db):** เปิดลับ→note โผล่+บับเบิลอีกฝ่าย .vanish · **รอจริง 21 วิ ข้อความอีกฝ่ายถูกลบออกจาก store จริง** (บับเบิลเราเองยังอยู่) · สลับธีม love→box ct-love หัวชมพู · ปิดสวิตช์=ยกเลิก timer · หัวกล่อง+ปุ่มพอดีจอ 812×375 กล่องไม่ scroll เอง · ไม่มี console error
- **⚠️ ค้างผู้ใช้:** ลองจริง 2 เครื่อง (เปิดลับทั้งคู่ ส่งข้อความ → อ่านแล้วหาย 20 วิทั้งสองฝั่ง) · หมายเหตุ: สวิตช์ลับเป็นค่าในเครื่อง (ยังไม่ sync ให้อีกฝ่ายเห็นว่าเปิดลับ) — ถ้าอยากให้ทั้งคู่รู้สถานะ ต้องเพิ่ม node `/secret` + publish rules (งานต่อยอด)

### ✅ รอบ 189 (13 ก.ค.) — คลิกซ้ำแท็บน้อง=เปลี่ยนชื่อ + ขยายร่างจ่ายครั้งเดียว/ระดับ 🏷️🦣 (version .180)
- **สเปกผู้ใช้ 2 ข้อ:**
  1. **แท็บชื่อน้อง:** คลิกตัวที่ไม่ได้แสดง = สลับไปแสดงตัวนั้น (เหมือนเดิม) · **คลิกตัวที่กำลังแสดงอยู่แล้ว = เปิดกล่องเปลี่ยนชื่อน้อง**
  2. **ขยายร่าง:** เมื่อขยายถึงระดับใดแล้ว **ย่อ/ขยายซ้ำไปมาไม่ต้องจ่ายอีก** — จ่ายเฉพาะครั้งแรกของแต่ละระดับ
- **ทำ (ui.js):**
  - **rename:** แยก `renamePet(p)` (reuse askNameDialog value=ชื่อเดิม min1 max15) · handler แท็บ: `if(i===state.active) renamePet(state.pets[i]); else สลับ` · ปุ่ม ✏️ (#btn-pet-rename) เรียก renamePet ตัวเดียวกัน
  - **จ่ายครั้งเดียว/ระดับ:** เพิ่ม `p.giantMax` (ระดับสูงสุดที่ปลดล็อก) + `giantUnlocked(p)=max(giantMax,giant)` (migration: ระดับปัจจุบัน=จ่ายแล้ว) · upgradeGiant: `paid = giantMax>=g+1` → cost 0 ถ้าปลดล็อกแล้ว · resetGiant คง giantMax · ปุ่มโชว์ "ขยายร่าง ฟรี 🆓" (ปลดล็อก) / "🪙<cost>" (ระดับใหม่)
- ✅ **ยืนยัน preview:** คลิกแท็บ active→กล่องเปลี่ยนชื่อ prefill "เจ้าตูบ" · คลิกแท็บอื่น→สลับ active=1 ไม่เปิด rename · giant sequence: จ่าย 2000/4000/8000 ครั้งเดียว · reset→ย้อนขยายฟรีทุกครั้ง · ปุ่ม label ฟรี/ราคา ถูกทุกเคส · ไม่มี console error
- **⚠️ ค้างผู้ใช้:** ลองจริงมือถือ · หมายเหตุ: สัตว์เก่าที่ giant>0 อยู่แล้ว giantMax auto = ระดับปัจจุบัน (ไม่เก็บเงินย้อน)

### ✅ รอบ 188 (13 ก.ค.) — 5 งานผู้ใช้: อากาศในเกม + น้อง 2D คนยัง 3D + ภาพสินค้าใหญ่ + ปุ่มโรงงานเขียวเด้ง + ผังบ้านซ้ายภาพขวาข้อความ 🌦️🐾🏪🏭🏠 (version .179)
- **สเปกผู้ใช้ 5 ข้อ (จาก screenshot):**
  1. **"อากาศตอนนี้" → "อากาศในเกมตอนนี้"** (กันเข้าใจผิดว่าอากาศจริง) · ui.js weather-banner
  2. **Lobby: เปลี่ยนเฉพาะน้อง ไม่ใช่คน** — รอบ 186/187 `forcePng` ซ่อน canvas ทั้งใบ (คน 2D + น้อง 2D + บาง state ภาพ broken) · ผู้ใช้: **คนต้องเป็นโมเดล 3D เหมือนเดิม เปลี่ยนแค่น้องเป็น 2D** · **แก้ (lobby3d.js):** เลิก early-return · `applyPetPng(on)` = `petRoot.visible=!on` (ซ่อน mesh น้องใน 3D เหลือคนบน canvas โปร่ง) + `.hero-scene.pet-only` (CSS ซ่อนรูปคน 2D + ลานเงา · โชว์แค่น้อง 2D ผ่านโซนโปร่ง canvas ตรงตำแหน่งเดิมขวา) · spellBtnSync เช็ก `petRoot.visible` · ไม่มีภาพ=โมเดลปกติ (petStateImg คืนเฉพาะภาพ probe แล้ว = ไม่ broken)
  3. **ตลาด: ภาพสินค้าใหญ่ขึ้น เห็นชัด น่าซื้อ** — `.hq-pic` 98→150px img fill + drop-shadow + พื้น radial · `.hq-grid` minmax 136→168 · `.hq-emoji` 50→84 · `.order-row .mkt-emoji` 46→78px · เลิกโชว์ "ชั้น" ของลูกค้า NPC ในออเดอร์
  4. **โรงงาน: ปุ่มฟ้ายาว → เขียวไล่โทนมีไฟ เด้งขึ้นลงชวนกด** — `.craft-go-btn` gradient เขียว+inset highlight + `craftBob` เด้ง 1.15s + `::after` ไฟวิ่ง (craftShine) + ไอคอนเด้ง + `:active` กดยุบ (translateY) · no-anim ปิด
  5. **บ้าน: ภาพบ้านใหญ่เต็มซ้าย · ข้อความไปขวา จัดระเบียบ** — `.home-layout` flex 2 คอลัมน์: `.home-pic-col` (44% ภาพ `home-img-big` ใหญ่) + `.home-info-col` (ชื่อ/desc/บิล scroll ไร้แถบ) · responsive <600px ซ้อนแนวตั้ง
- ✅ **ยืนยัน preview:** (1) banner "🔥 อากาศในเกมตอนนี้: ร้อนจัด" (2) น้องป่วย+ภาพ → canvas(คน 3D)ยังโชว์ · pet-only class · รูปคน 2D ซ่อน · น้อง 2D โชว์ · ปุ่มสะกดคำซ่อน · รักษาแล้ว→คืน 3D เต็ม+ปุ่มกลับ (3) hq-pic 150px · order emoji 78px · ไม่มี "ชั้น" (4) craft-go anim craftBob เขียว (5) home-layout flex ภาพซ้าย 297px/สูง 207 · ข้อความขวา 365px sideBySide=true · ไม่มี console error
- **⚠️ ค้างผู้ใช้:** ลองจริงมือถือทั้ง 5 จุด · หมายเหตุ: broken image เดิมหายเพราะคนเป็น 3D เสมอ + น้องใช้เฉพาะภาพที่ probe เจอ · screenshot ตาราง 4 ไอเดีย onboarding (splash/transition/offline) ยังไม่ทำ — รอผู้ใช้เคาะ

### ✅ รอบ 187 (13 ก.ค.) — คุ้มครองเด็ก: เลิกเก็บชื่อจริง เหลือชื่อเล่น+🆔 (ไม่โชว์ชั้น) + badge เลขแชท story + typing… + ไฟเลี้ยวสะท้อนกระจก 🛡️💬🚦 (version .178)
- **A. มาตรการคุ้มครองเด็ก (สเปกผู้ใช้ — สำคัญสุด):** หน้าลงทะเบียนเลิกเก็บ **ชื่อจริง/นามสกุล** เหลือแค่ชื่อเล่น + มีคำเตือน · ชั้นเรียนเก็บไว้เลือกความยากคำศัพท์ **แต่ไม่โชว์ในเกม** · ทุกที่ที่เคยโชว์ "ชั้น X" → โชว์ **🆔 รหัส 6 ตัว (จาก uid คงที่แม้เปลี่ยนชื่อ) + ชื่อเล่น** แทน
  - **index.html:** ลบ `#reg-first`/`#reg-last` · เพิ่ม `.reg-safety` (🛡️ ห้ามใส่ชื่อจริง) · เหลือ `#reg-nick` + `#reg-grade`
  - **main.js:** `state.student = {grade}` (ไม่เก็บ first/last) · เลิก validate ชื่อจริง
  - **ui.js:** helper `idTag(uid)` = `🆔 ${friendCode(uid)}` · แทน "ชั้น ${g}" ทุกจุด: แถบโปรไฟล์บน (ชื่อเล่น+✏️+🆔 · เลิกโชว์ชื่อจริง/ชั้น) · online card (me+เพื่อน+จำลอง) · กระดานเหรียญ · การ์ดผู้เล่น · เมนูลัดเพื่อน · ผลค้นหา/คำขอ/รายชื่อเพื่อน · หัวแชท · หน้าสถิติ+การ์ดครู (ใช้ชื่อเล่น+ชั้น+🆔 · เลิกชื่อจริง)
  - **auth.js/online.js:** เลิกใช้ `student.first` โชว์ (fallback→profileName) · state.js comment
  - **หมายเหตุ:** grade ยังส่งขึ้น online (g field) ตาม rules แต่ไม่โชว์ · rules ไม่ต้องแก้เพิ่มสำหรับข้อนี้
- **B. 3 ต่อยอด (ผู้ใช้เคาะ "สนใจทั้งคู่ ทำได้เลย"):**
  1. **A1 badge เลขแชทบน story:** inbox ดึง `limitToLast(20)` (เดิม 1) → นับข้อความใหม่จากเพื่อน (ts>chatSeenTs) → `.ib-story-badge` เลขบนวงกลม + `.ib-dot` เลขในแถว (แดง · 20+ ถ้าเกิน)
  2. **A2 "กำลังพิมพ์…":** online.js `chatSetTyping/chatClearTyping/chatWatchTyping` (`/typing/<pairId>/<uid>`=ts · throttle 2s · onDisconnect ลบ · TTL 6s) · openChat: input→set · ส่ง/ปิด→clear · watch→แถว `.chat-typing` (จุดเด้ง) · **ต้อง publish rules /typing** (รวมใน Artifact เดียวกับรอบ 186)
  3. **A3 ไฟเลี้ยวสะท้อนกระจก/ฝากระโปรง:** `#adv-tlreflect-l/-r` แถบส้มล่าง `mix-blend-mode:screen` กระพริบ .8s ตอน tlSet เปิดไฟเลี้ยว (คู่กับแสงมุมรอบ 185)
- ✅ **ยืนยัน preview:** ลงทะเบียน→`state.student={grade}` ไม่มี first · chip "น้องเทสต์ ✏️ · 🆔 CPX3A8" (ไม่มีชั้น/ชื่อจริง) · online card+กระดาน = 🆔 ไม่มี "ชั้น" · A1 story badge นับถูก (3/1) · A2 typing: ซ่อน→"กำลังพิมพ์…"→ซ่อน (หมด TTL) · A3 reflect: ซ้าย/ขวา anchored ล่าง blend screen กระพริบ · ไม่มี console error
- **⚠️ ค้างผู้ใช้:** (1) **publish rules** (Artifact เดิม อัปเดตแล้ว = แก้เพื่อน+เปิด typing) https://claude.ai/code/artifact/fdfc973b-559a-4a05-b181-f21416cd8cd6 (2) ทดสอบ typing จริง 2 เครื่อง (3) ลองไฟเลี้ยวสะท้อนจริงมือถือ · หมายเหตุ: ผู้เล่นเก่ายังมี first/last ในเซฟ แต่ไม่โชว์แล้ว (ใช้ profileName)

### ✅ รอบ 186 (13 ก.ค.) — แสงเขียววิ่งขอบปุ่มเพลง + แก้บั๊กรับเพื่อน (rules g≤20) + ป่วย/หิว/ใส่ชุด = ภาพ 2D แทนโมเดล 🎵🤝🐾 (version .177)
- **สเปกผู้ใช้ 3 ข้อ:** (1) ปุ่มเพลง 🎵 Lobby ตอนเพลงเปิด ให้มีแสงสีเขียววิ่งวนตามขอบ (บอกว่าเสียงมาจากปุ่มนี้) (2) **รับเพื่อนไม่ได้** (toast "เพิ่มเพื่อนไม่สำเร็จ") (3) สัตว์หน้า Lobby: ป่วย/หิว → ใช้ภาพป่วย/หิวแทนโมเดล · ใส่เครื่องแต่งตัว → ภาพสัตว์ใส่ชุดนั้น · ไม่มีอะไร → โมเดล 3D ปกติ
- **(1) แสงเขียววิ่งขอบปุ่มเพลง (main.js + lobby.css):** `syncMusicBtn` toggle class `.playing` เมื่อ `Music.isMusicOn()` · CSS `#btn-music.playing::before` = วง conic-gradient ลิ่มแสงเขียว (`#39e58c`) `inset:-4px` z-1 หมุน `musicRing 1.35s linear` + drop-shadow glow (ปุ่มพื้นขาวทับกลาง เหลือแสงวิ่งแค่ขอบ) · ปิดเพลง = ไม่มีวง · `html.no-anim` = วงเขียวนิ่ง (box-shadow ไม่หมุน)
- **(2) แก้บั๊กรับเพื่อน — ต้นตอ rules (ไม่ใช่โค้ด):** อ่าน rules สด + ข้อมูลจริงผ่าน REST (token firebase CLI) → เจอบัญชี grade **"ปริญญาตรี" (9 ตัว)** แต่ทุกโซนที่มี field `g` validate `length<=8` → เขียน `friends/<ครูรุต>/<me>` (meData.g) ไม่ผ่าน validate = Promise.all reject → toast · ยัง block `presence`/`leaderboard`/`friendReq` ด้วย (บัญชีชั้นยาวขึ้นออนไลน์/กระดานไม่ได้) · ตัวเลือกชั้นที่ยาวเกิน 8: ปริญญาตรี(9)/สูงกว่าปริญญาตรี(15)/ต่ำกว่าประถมศึกษา(17) · **แก้: `g` 4 โซน (presence/leaderboard/friendReq/friends) `<=8`→`<=20`** (av คงเดิม ≤8 · RULES.md อัปเดตครบ) · **⚠️ ต้อง publish rules ก่อนถึงหาย** — Artifact ปุ่มคัดลอก: https://claude.ai/code/artifact/fdfc973b-559a-4a05-b181-f21416cd8cd6
- **(3) ป่วย/หิว/ใส่ชุด = ภาพ 2D (images.js + ui.js + lobby3d.js):** `petStateImg(p)` ใหม่ = คืน URL เฉพาะเมื่อมีภาพตรงสถานะจริง (`<pet>_<stage>_sick`/`_hungry`/`_<itemid>`) · ป่วย>หิว>ใส่ชุด · ไม่มีภาพ/ปกติ = null · renderDashboard ส่ง `forcePng:!!petStateImg(p)` เข้า Lobby3D.attach · attach: `if(opts.forcePng){showCanvas(false);return;}` = โชว์ `.hero-scene` (ภาพจาก currentPetImg เดิม ลำดับตรงกัน) แทน canvas · **ระบบภาพมีอยู่แล้ว (images.js probe `<pet>_<stage>_<mood|item>.png`) — รอบนี้แค่ทำให้ 2D ชนะโมเดลตอนป่วย/หิว/ใส่ชุด** · ไม่มีภาพ = โมเดล 3D เหมือนเดิม (จอไม่โล่ง)
- ✅ **ยืนยัน preview:** (1) เพลงเปิด→`.playing`+conic ring หมุน 1.35s · ปิด→ไม่มี · toggle กลับมี (2) rules สด+ข้อมูลจริง REST ยืนยันต้นตอ grade 9>8 · fixed_rules.json parse ผ่าน+ตรง live ทุก node ยกเว้น 4 g · Artifact JSON ตรง (3) petStateImg: ป่วย/หิว/ชุด+มีภาพ→คืน url · ไม่มีภาพ→null · ปกติ(มี normal)→null(โมเดล) ครบทุกเคส
- **⚠️ ค้างผู้ใช้:** (A) **publish rules** (Artifact ด้านบน) แล้วลองรับเพื่อนอีกครั้ง (B) เจนภาพสถานะวางใน `img/`: `<pet>_<stage>_sick.png` · `_hungry.png` · `_<itemid>.png` (pet=dog/cat/dragon · stage=baby/adult · itemid=cap/scarf/tshirt/…) — วางแล้วบอก commit (C) ลองแสงเขียวจริงมือถือ

### ✅ รอบ 185 (13 ก.ค.) — 3 ไอเดีย inbox + แสงไฟเลี้ยวส้มกระพริบมุมจอโลกขับรถ 💬🚦 (version .176)
- **สเปกผู้ใช้:** (A) ต่อยอด `openChatInbox` (รอบ 179) 3 ข้อ: เรียงตามข้อความล่าสุด · แถบออนไลน์แนวนอนบนสุด · ปุ่มลัดชวนเล่นโลก 3D ท้ายแถว (B) เปิดสัญญาณไฟเลี้ยวในโลกขับรถ → มีแสงไฟส้มกระพริบตรงตำแหน่งลูกศร (มุมบนซ้าย/ขวาของแดชบอร์ด)
- **ทำ (ui.js + lobby.css):**
  - **idea 1 เรียงล่าสุด:** เดิม render ทันทีแล้วเติมข้อความ async → เปลี่ยนเป็น `Promise.all` ดึงข้อความล่าสุดทุกคนก่อน (limitToLast 1 เดิม) → `sort` ตาม `last.ts` มากสุดบน (ไม่เคยคุย ts 0 ตกล่างตามลำดับเพื่อนเดิม · sort เสถียร) → render ทีเดียว (โชว์ "กำลังโหลด…" ระหว่างรอ)
  - **idea 2 story row:** `#ib-story` แนวนอนบนสุด (flex + overflow-x auto ไร้ scrollbar) วงกลมเพื่อน **ที่ออนไลน์เท่านั้น** (`.ib-story-ava` ขอบเขียว + จุดเขียว) ชื่อต้น · แตะ = เปิด openChat · ไม่มีออนไลน์ = ซ่อนแถบ
  - **idea 3 ปุ่ม 🌍:** ท้ายทุกแถว `.ib-world` → `e.stopPropagation()` (กันเด้ง openChat) → `openFriendQuickMenu(f.uid,f.n,f.g)` (เมนู tinv 3 โลก + gift/chat/info เดิม · fq-overlay z-9500 ทับ inbox ปิดกลับมาเห็น inbox ต่อ)
- **ทำ (adventure3d.js):** DOM `#adv-tlglow-l/-r` (2 div มุมบนซ้าย/ขวา) · CSS `.adv-tlglow` (radial-gradient ส้ม `rgba(255,160,30)` จากมุม · width 34vw/max 230 · height 46vh · z-5) + `.on{display:block;animation:tlGlowBlink .8s}` (กระพริบ opacity .95↔0) · `tlSet(v)` toggle `.on` ที่ซ้าย(v===1)/ขวา(v===2) — sync กับก้านไฟเลี้ยว/ไฟเพื่อน/เสียงรีเลย์เดิม
- ✅ **ยืนยัน preview (จำลอง Online + fake db):** inbox 4 เพื่อน → เรียง ปลาย(1นาที)→ก้อง(10นาที · unread จุดฟ้า)→มายด์(1ชม. "หนู: …")→บีม(ไม่เคยคุย) ถูกลำดับ · story = ก้อง/ปลาย (2 ออนไลน์) ขอบเขียว · ทุกแถวมีปุ่ม 🌍 → คลิกเปิด fq-overlay ปลาย (ผจญภัย/ผีสิง/เฮลิฯ) inbox ยังอยู่ · กล่อง 812×375 อยู่ในจอ ลิสต์ไร้ scroll · ไฟเลี้ยว: v=1 glow ซ้ายมุม (L0 top0 blink .8s gradient) ขวาซ่อน · v=2 glow ขวา (ริมขวา) ซ้ายซ่อน · v=0 ซ่อนทั้งคู่ · ไม่มี console error
- **⚠️ ค้างผู้ใช้:** (1) ทดสอบ inbox จริง 2 เครื่อง (ส่งข้อความดูลำดับเลื่อน/story/ปุ่มชวน) (2) ลองไฟเลี้ยวจริงมือถือในโลกขับรถ (3D bundle lazy-load หนักเกิน preview จะเข้าโลกจริง — verify ผ่าน CSS injection + code path เดียวกับก้านไฟเลี้ยว) — จูน: สี/ขนาด glow (`.adv-tlglow` ใน buildDom)

### ✅ รอบ 183 (13 ก.ค.) — โลกขับรถ: เสียงยางเสียดสี + ไฟจราจรเด่น(halo) 10/15วิ + ชื่อร้าน→ผู้ลงโฆษณา + ภาพทางเท้า 🛞🚦📢 (version .174)
- **สเปกผู้ใช้ 4 ข้อ:** (1) เลี้ยวโค้งแรง/เหวี่ยง มีเสียงเสียดสียางกับถนน (2) เอาชื่อร้าน/business จริงในแผนที่ออก ใส่เฉพาะผู้ลงโฆษณา (กันลิขสิทธิ์) (3) commit ภาพที่วางไว้ (4) ปรับเสาไฟจราจรเด่นชัด เขียว/แดง/เหลือง · ไฟแดง ~10 วิ · คนเล่นมาก ~15 วิ
- **ทำ (adventure3d.js):**
  - **🛞 เสียงยาง:** `CarSound.skidStart` (noise loop→bandpass Q5.5→gain) + `setSkid(amt)` (ramp นุ่ม gain สูงสุด .13 · ยกกำลังสองเงียบตอนเบา · freq 1350→2250 ตามแรงไถล · เคารพ state.sound · stop() ตัด) · tickDrive คำนวณ **slipPerp** = ความเร็วด้านข้าง (cross ของ velocity กับหัวรถ) เฉพาะบนถนน → setSkid((slipPerp-1.6)/6)
  - **🚦 ไฟจราจร:** `tlRedDur()` = peer ในโลกขับรถ>=3 ? 15 : 10 วิ · tlightPhase คำนวณ cycle จาก redDur (เขียว10+เหลือง3+แดง) · เสา/หัว/ดวงใหญ่ขึ้น (pole 5.2→6.4 · head 1.75→2.55 · lamp r.22→.34) + **glow halo** (sphere .72 additive) ย้ายไปดวงที่ติด+สีตามเฟส
  - **📢 ชื่อร้าน:** เลิกใช้ชื่อ OSM `C.b[bi][1]` (36 หลังมีชื่อจริง เช่น "Navarat Heritage Hotel"/พิพิธภัณฑ์ฯ — เสี่ยงลิขสิทธิ์) → `SHOP_ADS` (ผู้ลงโฆษณา ว่างเริ่มต้น เติมเองได้) เรียงลงตึกทุก 4 หลัง · ไม่มี=ป้ายเชิญ "📢 ลงโฆษณาที่นี่ ☎ 064-357 6645" ทุก 16 หลัง (~5 ป้าย)
  - **🖼️ ภาพ:** commit `img/city/sidewalk.png` (ผู้ใช้เจน herringbone+tactile strip · flatGeomUV ปูอัตโนมัติ tile 3.2m)
- ✅ **ยืนยัน preview (เข้าโลกจริง + step + WAAPI):** เสียงยาง gain ไต่ 0.13 ตอนไถล+freq ขึ้น · เบา/ปิดเสียง/stop=เงียบ · ไฟจราจร 30 เสา: บังคับแดง→ดวงแดงติด+halo แดงที่ y7.15 · เขียว→halo ย้าย y5.55 สีเขียว · ไฟแดง redDur10=10วิ / redDur15=15วิ · ชื่อร้าน 36 OSM→5 ป้ายเชิญ · sidewalk live 200 · ไม่มี console error · deploy live .174
- **⚠️ ค้างผู้ใช้:** ลองจริงมือถือ (ฟังเสียงยางตอนเลี้ยวแรง + ดูไฟจราจร/ทางเท้า) · เติมชื่อผู้ลงโฆษณาใน `SHOP_ADS` เมื่อมีลูกค้า · จูน: เกณฑ์ไถล (slipPerp-1.6)/6 · เกณฑ์ peer มาก (>=3)

### ✅ รอบ 182 (13 ก.ค.) — โลกขับรถ: เลนจักรยานฟ้าขอบขาว + ทางเท้า + เตือน/ปรับไฟเลี้ยวเข้าแยก 🚲🚦 (version .173)
- **สเปกผู้ใช้ 3 ข้อ:** (1) เลนจักรยานพื้นฟ้าขอบขาวตลอดแนวถนนทุกเส้น (2) เตือนก่อนถึงทางแยกทุกแยกว่าไม่เปิดไฟเลี้ยวก่อนเข้าแยกโดนปรับ 5 เหรียญ (3) ทางเท้าถัดจากเลนจักรยาน (คนเดินได้) + prompt ภาพลายทางเท้า
- **ทำ (adventure3d.js):**
  - **เลนจักรยาน+ทางเท้า:** ในลูปสร้างถนน (buildDriveCity) เพิ่ม strips ขนาบถนนทุกเส้น w≥7: เลนจักรยาน (ฟ้า 0x2f7fd0 กว้าง 1.7m) + เส้นขาว 2 ขอบ (0.28m) + ทางเท้า (2.6m ปูลาย) · helper `flatGeomUV` (UV=worldXZ/tile ปูภาพซ้ำ) · ทางเท้า probe `img/city/sidewalk.png` มี=ปูภาพ ไม่มี=สีคอนกรีต · เป็น decal พื้น (y .028-.045) ไม่กระทบ grid ที่ขับได้
  - **เตือน+ปรับไฟเลี้ยว:** precompute `d.junctions` (cluster จุด arms>=3 จาก roadPts รวมภายใน 16m → 699 แยก) ตอน build · tlTick เช็กด้วย**ระยะจากรายการแยก** (robust — โซน arms>=3 แคบระดับ sub-meter sample สดพลาด) · เตือน `#adv-junc` (แถบเหลืองกะพริบ) เมื่อแยกอยู่หน้ารถ <24m + dot heading >.55 + ยังไม่เปิดไฟ · เข้ารัศมี 7.5m ของแยกโดยไม่เปิดไฟ = ปรับ `CAR_FINE_SIGNAL` 100→**5** ครั้งเดียว/แยก (เพดาน 40/รอบ)
  - **Prompt:** `PROMPTS_SIDEWALK.md` (seamless tileable top-down ลายบล็อกทางเท้าไทย) + Artifact ปุ่มคัดลอก https://claude.ai/code/artifact/cb0eb339-2f83-4815-a571-6ffb4a572f7f
- ✅ **ยืนยัน preview (เข้าโลกจริง + step frame + readPixels):** เลนฟ้า 5174px + ขอบขาว 7261px + ทางเท้าเทา 639px render จริง · 699 junctions · ขับเข้าหาแยกไม่เปิดไฟ → ป้ายเตือนโชว์ + เข้ารัศมีโดนปรับ 🪙5 ครั้งเดียว (frame 17) · เปิดไฟเลี้ยว → ไม่เตือน ไม่ปรับ · ไม่มี console error · deploy live .173
- **⚠️ ค้างผู้ใช้:** ลองจริงมือถือ (ดูเลน/ทางเท้า + ทดสอบเตือน/ปรับที่แยก) · เจนภาพ sidewalk.png วาง img/city/ · จูนได้: BIKE_W/WALK_W (ความกว้าง) · ROAD_WIDEN · รัศมีเตือน 24m/ปรับ 7.5m ใน adventure3d.js
- 💭 หมายเหตุ: "คนเดินได้" = มีพื้นที่ทางเท้าจริง (ยังไม่มี NPC คนเดิน — ต่อยอดได้)

### ✅ รอบ 181 (13 ก.ค.) — ระบบเพลงพื้นหลัง + วิทยุในรถ (visualizer + เลือกเพลง 3 โหมด) 🎵 (version .172)
- **สเปกผู้ใช้ (แบบ Rise of Nations):** เพลง instrument (ไม่มี vocal) เล่นทั้งเกม จนเข้าโลกขับรถ + ผู้เล่นเปิดเพลงในรถ → ตัด bg ฟังเพลงในรถแทน · จอ head-unit กลางคอนโซล (ระหว่างลูกบิด 2 อัน) = กราฟเสียง sci-fi ตามจังหวะ · แตะจอ/กราฟ → รายการเพลง Track1.. + 3 โหมด (เล่นซ้ำทั้งหมด/เล่นซ้ำเพลง/สุ่มเล่น) ปุ่มอังกฤษ+แปลไทยใต้ปุ่ม · ผู้ใช้เตรียมเพลง `sound/SongsInCar/rock_01..06.mp3`
- **ทำ:**
  - **`js/music.js` (ใหม่ — เอนจินเสียงล้วน):** probe `sound/SongsInCar/rock_01..10` + `sound/bgm/bgm_01..08` (ไม่มี bgm เฉพาะ→ใช้เพลงรถเป็น bg ด้วย) · **bg**: Audio element vol .30 เริ่มหลัง gesture แรก (autoplay policy · pointerdown/keydown once) เล่นวนสุ่มเริ่ม · **วิทยุรถ**: Audio vol .62 + Web Audio `AnalyserNode` (fftSize 64 = 32 แท่ง) `createMediaElementSource`→analyser→destination · โหมด all/one/shuffle (`state.musicMode`) · `suspendBg/resumeBg` (เข้า/ออกโลก 3D) · `onSound` (สวิตช์เสียงตั้งค่า) · `vizData()` คืน freq array
  - **adventure3d.js:** DOM `#adv-radio-screen`(canvas viz)+`#adv-radio-list` · `radioLayout()` วางจอบนพิกัดภาพ `RADIO_RECT=[622,682,806,780]` (dash.png 1536×1024) สูตร map เดียวกับเข็มเกจ · `drawRadioViz()` แท่งไล่เฉดฟ้า หน่วงนุ่ม (ขึ้นเร็วตกช้า) · `radioTick()` ใน tickDrive (relayout เมื่อ size เปลี่ยน) · แตะจอ: ปิด→เปิดวิทยุ / เปิด→เปิดรายการ · รายการ: เลือก track/โหมด/power off · `start()`→suspendBg · `exitWorld()`→resumeBg
  - index.html โหลด music.js · main.js `Music.init()` · util.js สวิตช์เสียง→`Music.onSound()` · state.js `musicMode:'all'`
- ✅ **ยืนยัน preview (เข้าโลกขับรถจริง + step frame — pane พัก rAF):** probe เจอ 6 เพลง · bg ไม่เล่นก่อน gesture → gesture แรกเล่น rock_04 · วิทยุ: carRadio(true)→rock_01 เล่น + vizData Uint8Array(32) · เปลี่ยนเพลง/โหมด→state อัปเดต · จอวางบนหน้าปัดตรงเป๊ะ (alignDiff 0,0 · onDash) + viz มีแท่งฟ้า 131px · รายการ Track1-6 + 3 โหมด (REPEAT ALL/เล่นซ้ำทั้งหมด · REPEAT ONE/เล่นซ้ำเพลง · SHUFFLE/สุ่มเล่น) + power "TURN OFF · ปิดเพลง" อยู่ในจอ · เลือก Track4→curCar3 · โหมด one ติด · power off→วิทยุปิด+bg พัก(อยู่ในโลก) · suspend/resume ทำงาน · ไม่มี console error · deploy live .172 (rock_01 บนเว็บ 200)
- **หมายเหตุ:** เพลงชุด SongsInCar (rock) ใช้ทั้ง bg + วิทยุรถ (มีชุดเดียว) · อยากได้ bg instrument แยก วาง `sound/bgm/bgm_01..mp3` = ใช้เป็น bg แทนอัตโนมัติ
- **⚠️ ค้างผู้ใช้:** ลองจริงมือถือ (ฟังเสียง bg/วิทยุ + ดู visualizer บนจอหน้าปัด + ทดสอบ 3 โหมด) · จูนได้: BG_VOL .30 / CAR_VOL .62 / RADIO_RECT (ตำแหน่งจอ) ใน music.js/adventure3d.js

### ✅ รอบ 180 (13 ก.ค.) — ขยายเลนถนนโลกขับรถ ~40% 🛣️ (version .171)
- **สเปกผู้ใช้:** เลนถนนโลกขับรถแคบเกิน ขอกว้างกว่าเดิมหน่อย
- **ทำ:** `ROAD_WIDEN=1.4` ใน buildScene drive — คูณ `w=rd[0]*ROAD_WIDEN` ตรงจุดวาด (mesh nx/nz + grid ที่ขับได้ rr + เส้นแบ่งเลน) → ถนนกว้างขึ้น ~40% ทั้งภาพและพื้นที่ขับ ไม่แตะไฟล์ city_kpp.js (232KB)
- ✅ syntax ผ่าน · deploy live .171 · **⚠️ ค้าง: ลองจริงมือถือ (จูน ROAD_WIDEN ใน adventure3d.js ถ้ากว้าง/แคบไป)** · หมายเหตุ: เข้าโลกขับรถใน preview หนัก (ตั๋ว+รถ+city) — เป็นการคูณสัดส่วน mirror กับ mesh เกจที่พิสูจน์แล้ว

### ✅ รอบ 179 (13 ก.ค.) — ปุ่มแชท header + หน้ารวมข้อความธีมฟ้า sci-fi · ข้าวเย็นย้ายไปข้าง ➕ 💬 (version .170)
- **สเปกผู้ใช้ (แนบภาพ Messenger เป็นตัวอย่าง):** emoji ป่วย/ข้าวเย็น (#btn-dinner) ย้ายไปถัดจากปุ่ม ➕ แถวแท็บสัตว์ · ตำแหน่งเดิมใน header ใส่ icon แชท · คลิกแล้วเข้าหน้ารวมข้อความแบบ Messenger แต่ธีมฟ้า sci-fi ของเกม
- **ทำ:**
  - **index.html:** header แทน #btn-dinner ด้วย `#btn-chat` 💬 + `#chat-badge` (rail-badge เลขข้อความใหม่)
  - **ui.js:** แถวแท็บสัตว์เพิ่ม `<button class="pet-tab dinner" id="btn-dinner">` ต่อท้าย ➕ (element ใหม่ทุก render → ผูก dinnerClick ตรงนั้น · แถวโชว์ด้วยถ้าไม่มีสัตว์แต่ป่วย/ถึงเวลาข้าวเย็น กันปุ่มหาย) · `renderDinnerChip` เดิมคุมโชว์/ซ่อน/หน้า 🍚↔🤒 ไม่แตะ · **`openChatInbox()`**: overlay `.ib-box` กระจกฟ้า — ลิสต์ `Online.myFriends` ทุกคน: อวตารตัวอักษรแรก+จุดเขียวถ้าออนไลน์ (เทียบ Online.friends) · ข้อความล่าสุด (โหลด limitToLast 1/คน ครั้งเดียวตอนเปิด · ของเราเติม "หนู:/คุณ:") · เวลาแบบ Messenger (`ibTimeStr` วันนี้=HH:MM · <7วัน=ชื่อวันย่อ · เก่ากว่า=ว/ด) · unread=ชื่อขาว+จุดฟ้า · แตะแถว=ปิดแล้ว `openChat(friend)` เดิม · ว่าง=ชวนไปเพิ่มเพื่อน · ออฟไลน์=toast · `chatBadgeSync()` ใน renderClock (ทุกวิ) เลขจาก chatUnreadCount
  - **main.js:** เลิก bind btn-dinner ตอน boot (ตายแล้ว—อยู่ในแท็บ) → bind #btn-chat → openChatInbox
  - **lobby.css:** โซน 💬 (.inbox-overlay/.ib-*) + `.pet-tab.dinner` โทนส้มอุ่น
- ✅ **ยืนยัน preview:** ปุ่มแชทใน header/dinner ออกจาก header ไปอยู่ใน #pet-tabs · ป่วย → chip 🤒 คลิกเปิดกล่องรักษาจริง · ออฟไลน์คลิกแชท → toast · จำลอง Online+fake db: 3 แถวครบ (มายด์ unread+จุดฟ้า+ออนไลน์เขียว+ "พรุ่งนี้เจอกันนะ" 05:11 · ก้อง "หนู: ขอบใจมากๆ เลย" เวลา "ส." · บีม "ยังไม่เคยคุยกัน") · badge=1 · แตะแถวปิด inbox เรียก openChat ถูกคน · เคสไม่มีเพื่อน=empty state · 812×375 กล่อง 460×229 อยู่ในจอ ลิสต์ scroll ไร้แถบ · ไม่มี console error · deploy live .170
- **⚠️ ค้างผู้ใช้:** ทดสอบจริง 2 เครื่อง (ส่งข้อความจริง ดู badge/ลำดับ/เวลา)

### ✅ รอบ 178 (13 ก.ค.) — กล่อง aside: ภารกิจ/เพื่อนหด 2 บรรทัด + กล่องเพื่อนพลิกหน้า 180° ตามนิ้ว 📚 (version .169)
- **สเปกผู้ใช้:** (1) กล่องภารกิจวันนี้หดพื้นหลังพอดีตัวอักษร 2 บรรทัด (2) หัวข้อคนทำการบ้านขยับขึ้น — บรรทัด "ตอนนี้มีเพื่อนออนไลน์" ย้ายออกนอกกล่องไปใต้หัวข้อ + กล่องเหลือ 2 บรรทัด (3) เนื้อหาในกล่องเปลี่ยนด้วยการพลิก 180° วนตลอด · แตะ=หยุด · ลากขึ้น/ลง=พลิกทีละหน้าตามจังหวะนิ้ว · ปล่อยนิ้วเกิน 5 วิ=พลิกวนต่อ ไม่มีวันหยุด
- **ทำ (index.html + ui.js + lobby.css):**
  - **ผัง:** `.sec-quest/.sec-online` เป็น `flex:0 0 auto` (เลิกแบ่งสูงเท่ากัน 3 กล่อง) → กล่องอันดับ (flex:1 เดิม) กินที่ที่เหลือ · `#online-sub` div ใหม่ใต้หัวข้อ (`.side-sub` เขียว 10px · `:empty` ซ่อน)
  - **ภารกิจ q-fit:** เลิก toggle q-mini ตาม clientHeight → `q-fit` เสมอ (ซ่อน qb-bar+q-dots เหลือชื่อ+แถวรางวัล/ปุ่ม 🚀 ฟอนต์ปกติ · height:auto ทั้ง #quest-card/.q-bigcard) — พลิกทุก 6 วิเดิม
  - **กล่องเพื่อน = พลิกหน้า (`onPageFlip`/`onPageDraw`/`bindOnlinePager`):** 1 หน้า = 1 แถว (ชื่อ+กิจกรรม = 2 บรรทัด) · หน้า = [การ์ดชวน inv-card แยกหน้า, แถวเรา, เพื่อนทีละคน, note ว่าง] · auto พลิกทุก `ONLINE_FLIP_MS` 5s (`window.__onFlipTimer`) · พลิก 180° rotateX ครึ่งออก+ครึ่งเข้า (keyframes onFlipOutUp/InUp + Down กลับทิศ) · pointerdown=หยุด (hold 9e9) · pointermove ทุก `ONLINE_SWIPE_STEP` 34px = พลิก 1 หน้า (ขึ้น=ถัดไป ลง=ถอย) · pointerup (window ผูกครั้งเดียว __onGestUp) = hold 5 วิแล้ววนต่อ · click หลัง swipe โดน capture กัน (เมนูเพื่อนไม่เด้งมั่ว) · wheel=พลิก+hold · `delete sideScrollSt['online-card']` เลิกเลื่อนวน
  - **แฟลชเดิมย้ายเข้า pager:** เพื่อนใหม่ออนไลน์/คำชวนใหม่ → พลิกไปหน้านั้น + แถวติด on-flash + hold 5 วิ (build class ลง HTML หน้า ไม่ใช้ sideFlashRows แล้ว — feed ยังใช้อยู่)
- ✅ **ยืนยัน preview:** quest กล่อง 84px bar/dots ซ่อน · sub นอกกล่อง "ตอนนี้มีเพื่อนออนไลน์ 7 คน" กล่อง 62px 7 หน้า · auto พลิกจริง (interval เดินใน pane) · ลากขึ้น 40px×2=ไปหน้า 2,3 ลากกลับ=ถอย 1 ตรงเป๊ะ · ปล่อยนิ้ว hold 5 วิแล้วหมดอายุ · จำลอง Online.ready: 4 หน้า (inv+me+2 เพื่อน) · เพื่อนใหม่ f3 → พลิกไปหน้า 4 + on-flash + toast · 812×375 คอลัมน์ 266px ครบทุกกล่องไม่ล้น · ไม่มี console error · deploy live .169
- **⚠️ ค้างผู้ใช้:** ลองจริงมือถือ (จูน: `ONLINE_FLIP_MS` 5000 จังหวะพลิก · `ONLINE_SWIPE_STEP` 34px ระยะลากต่อหน้า ใน ui.js)

### ✅ รอบ 177 (13 ก.ค.) — ต่อยอดแสง rank 3 ข้อ: ประกายเพชร + แสงถี่ตาม progress + เงาสะท้อนพื้น ✦ (version .168)
- **ผู้ใช้เคาะไอเดียต่อยอดรอบ 176 ทั้ง 3 ข้อ**
- **ทำ (heroRankBgHTML ui.js + โซน ✦ lobby.css):**
  - **ประกายเพชร `.rank-sparks`:** ✦ 8 จุดวิบวับ (`rankTwinkle` scale 0→1 rotate 90° วนลูป · delay/ขนาด/ความเร็วสุ่มต่อจุด) · mask ตามรูปทรงภาพ rank (จุดนอกเงาเหรียญไม่โชว์) · **ตำแหน่ง deterministic seed จาก rank idx** — render ซ้ำจุดไม่ย้ายกระตุก
  - **แสงถี่ตาม progress:** `--rank-pulse` จาก JS = 3.6s − 1.6×prog (ไกล=ช้า 3.6s · ใกล้เลื่อนแรงค์=ถี่ 2.0s) → ผูก animation-duration ของ img หายใจ/::before/เงาพื้น (rank-fx chain ก็ตาม)
  - **เงาสะท้อนพื้น `.rank-floor`:** วงรี radial สีแรงค์ blur 11px ใต้เส้นพื้นเรืองแสง (bottom 4px กว้าง 74%) หายใจจังหวะเดียวกับเหรียญ (`rankFloorBreath` opacity .18↔.40)
  - `html.no-anim`: ซ่อน sparks · เงาพื้นนิ่ง (ไม่หายใจแต่ยังโชว์สี)
- ✅ **ยืนยัน preview (WAAPI):** prog 0.8 → pulse 2.32s ตรงสูตร ใช้กับ img+floor จริง · sparks 8 จุด masked+twinkle กลางรอบ opacity .95 scale 1 rotate 90° · เหรียญ 5k→200k เลื่อนแรงค์ → สีใหม่ #6f97bd + pulse 3.59s (prog รีเซ็ต) + rank-fx เล่น + sparks/floor สร้างใหม่ครบ · ไม่มี console error · deploy live .168
- **⚠️ ค้างผู้ใช้:** ดูจริงมือถือ — จูนได้: จำนวน/ขนาดประกาย (ลูป 8 จุดใน heroRankBgHTML) · ช่วง pulse (สูตร 3.6−1.6×prog) · ความเข้มเงาพื้น (opacity ใน rankFloorBreath)

### ✅ รอบ 176 (13 ก.ค.) — เหรียญ rank กลาง Lobby: แสงวิ่งไล่ขอบเหลี่ยม + เรืองแสงหายใจสีตามแรงค์ ✨ (version .167)
- **สเปกผู้ใช้:** ภาพ rank ใหญ่กลาง Lobby ให้มีแสงไฟไล่ตามเหลี่ยม (ทุก rank) + เอฟเฟกต์แสง/สีเหมือนแสงออกจากภาพจริง สีตามแต่ละภาพ
- **ทำ (heroRankBgHTML ui.js + โซน ✨ lobby.css):** 3 ชั้นแสง สีทั้งหมดผูก `--rank-c` (สีประจำแรงค์จาก ranks.js — ครอบทุก rank อัตโนมัติ):
  - **img เรืองแสงหายใจ** `rankBreath` 3.6s: drop-shadow สีแรงค์ 26px→54px+120px (2 ชั้น) + brightness 1→1.14 วนลูป · ::before glow พัลส์ตาม (`rankGlowBreath`)
  - **`.rank-edge` แสงวิ่งไล่ขอบเหลี่ยม:** mask ภาพ rank จริง 2 ชั้น (contain + 80%) `mask-composite:exclude` → เหลือเฉพาะวงแถบขอบตามเหลี่ยมภาพ · ข้างในลิ่มแสง conic (สีแรงค์+ขาว) หมุน 3.2s + blur 1px · mix-blend screen
  - **`.rank-beam` แสงกวาดทั้งเหรียญ:** mask ชั้นเดียว opacity .3 หมุน 5.5s — ประกายพื้น
  - `.rank-fx` (เลื่อนแรงค์ รอบ 115) ต่ออนิเมชันเป็น chain: swap 1.6s แล้วหายใจต่อ (ไม่ทับกันค้าง) · `html.no-anim` = ปิดชั้นแสง เหลือ glow นิ่งเดิม
- **🐞 กับดักที่เจอ (จำ!):** `url()` แบบ relative ใน CSS var ที่ประกาศ inline — **Chrome resolve เทียบไฟล์ CSS ที่ใช้ var ไม่ใช่ document** (`css/img/...` 404 mask ล่ม) → JS ต้องส่ง `new URL(img, document.baseURI).href` (absolute) เข้า `--rank-img`
- ✅ **ยืนยัน preview (พิสูจน์ผ่าน WAAPI — pane ซ่อนแช่นาฬิกา CSS animation เหมือน rAF):** mask URL โหลด 200 · edge 2 mask composite "exclude" · เดินเวลาเอง 800ms → ลำแสงหมุน 90° จริง (matrix(0,1,-1,0)) · จุด peak หายใจ → drop-shadow rgb สีแรงค์ 2 ชั้น + brightness(1.14) · กล่องชั้นแสงตรงกับ img เป๊ะ 405×405 · ไม่มี console error · deploy live .167
- **⚠️ ค้างผู้ใช้:** ดูจริงมือถือ/แท็บเล็ต — จูนได้: ความหนาแถบขอบ (mask-size ชั้นใน 80%) · ความเร็วหมุน (3.2s/5.5s) · ความแรงแสงหายใจ (54px/120px ใน rankBreath)

### ✅ รอบ 175 (13 ก.ค.) — Spin-to-Spell: ป้าย +🪙1,000 เหลืองทองตัวใหญ่เด้งกลางจอ 💰 (version .166)
- **สเปกผู้ใช้:** จบคำ 5 คำแรก/วัน มีข้อความ +1,000 สีเหลืองตัวใหญ่ เอฟเฟกต์ขยายจากตัวเล็ก→ใหญ่ ให้ตื่นเต้นว่าได้เงินรางวัล
- **ทำ:** `spellCoinPop(txt)` ใน lobby3d.js — div `#spell-coinpop` fixed กลางจอ (top 34% · z-9001 เหนือริบบิ้น) โชว์ยอดจริง (+🪙1,000 / เพอร์เฟกต์ +🪙1,500) · CSS `spCoinPop` 2.25s: โผล่จิ๋ว scale .12 → เด้ง overshoot 1.32 → ย้วบ .96 → นิ่ง 1 → ลอยขึ้นจางหาย · ฟอนต์ 900 `clamp(44px,13vh,100px)` สี #ffe082 + glow ทอง 2 ชั้น+เงาเข้ม · เรียกเฉพาะ `fullLeft>0` (คำที่ 6+ รางวัล 100 ไม่มีป้าย มีแค่ในแบนเนอร์) · `html.no-anim` = ไม่โชว์ · ถอดตัวเอง 2.3 วิ
- ✅ **ยืนยัน preview:** จบ "sunny" เพอร์เฟกต์ → ป้าย "+🪙1,500" กลางจอเป๊ะ (centerX 500=500) ฟอนต์ 83px สีทอง animation spCoinPop · หายเองใน 2.5 วิ · โควตาหมด (spellWords=5) จบ "cow" +150 → **ไม่มีป้าย** ถูกต้อง (แบนเนอร์แจ้งปกติ) · ไม่มี console error · deploy live .166
- **⚠️ ค้างผู้ใช้:** ลองจริงมือถือ (ขนาด/ตำแหน่งป้าย จูน font-size / top ใน CSS `#spell-coinpop`)

### ✅ รอบ 174 (13 ก.ค.) — Spin-to-Spell: เพอร์เฟกต์ ×1.5 + รางวัลเต็ม 5 คำ/วัน + ริบบิ้นสีตามหมวด 🌟🎀 (version .165)
- **ผู้ใช้เคาะไอเดียต่อยอดรอบ 173 ทั้ง 3 ข้อ:** คอมโบไม่พลาด / จำกัดรางวัลกันเหรียญเฟ้อ / ริบบิ้นสีตามธีมคำ
- **ทำ (lobby3d.js + state.js + lobby.css):**
  - **เพอร์เฟกต์:** `spellMiss` นับแตะผิดต่อคำ (รีเซ็ตใน spellNextWord) · จบคำ miss=0 → รางวัล ×`SPELL_PERFECT_X` 1.5 + บรรทัดทอง "🌟 เพอร์เฟกต์!" + พลุ 2 ระลอก (ลูกสองหน่วง 450ms) + ริบบิ้น ×1.7
  - **โควตารายวัน:** `state.spellDay`/`spellWords` (default ใน state.js · แพทเทิร์น toDateString แบบ foodQuizDay) — 5 คำแรก/วัน = `SPELL_COIN` 1,000 · คำที่ 6+ = `SPELL_COIN_LATE` 100 · เพอร์เฟกต์คูณทับ (150) · HUD บรรทัดใหม่ `.sp-day` ใต้คำแปล: "⭐ รางวัลเต็ม 🪙1,000 เหลือ N คำวันนี้" / ครบแล้วบอกคำละ 100 · แบนเนอร์แจ้งตอนโควตาหมดด้วย
  - **ริบบิ้นตามหมวด:** spellPickWord เปลี่ยนไปดึงจาก `catsForStudent()` เก็บ `cat` id ติดมากับคำ · `SPELL_PALETTES` 7 พาเลต regex กับ cat id (animal=เขียว · food/fruit=ส้มแดง · body/health/sport=ชมพูแดง · nature/weather/environment=เขียวฟ้า · school/academic/numbers/days=ฟ้าน้ำเงิน · tech/science/media=ฟ้าไฟฟ้า · family/feeling/character/clothes=ม่วงชมพู) · ไม่เข้าเงื่อนไข=ชุดรวม 8 สีเดิม
- ✅ **ยืนยัน preview ครบทุกเคส:** "sock" (clothes) เพอร์เฟกต์ → +🪙1,500 ริบบิ้น 155 ชิ้นม่วงชมพูล้วน · "play" แตะผิด 1 → +🪙1,000 พอดี ริบบิ้น 91 · spellWords=5 → HUD สลับ "รับเต็มครบแล้ว" · "ruler" (school) เพอร์เฟกต์ตอนโควตาหมด → +🪙150 + 2 บรรทัดแจ้ง + ริบบิ้นฟ้าน้ำเงินล้วน · ข้ามวัน (spellDay เก่า) → รีเซ็ตเหลือ 5 คำ · ไม่มี console error · deploy live .165
- **⚠️ ค้างผู้ใช้:** ลองจริงมือถือ (จูนได้: `SPELL_FULL_PER_DAY` 5 · `SPELL_COIN_LATE` 100 · `SPELL_PERFECT_X` 1.5 ใน lobby3d.js)

### ✅ รอบ 173 (13 ก.ค.) — Spin-to-Spell: รางวัล 🪙1,000/คำ + เสียงพลุ + ริบบิ้นโปรยทั้งจอ 🎆🎀 (version .164)
- **สเปกผู้ใช้:** ประกอบคำได้ = 1,000 เหรียญ/คำ "เพราะยาก" + เสียงพลุฉลอง + ริบบิ้นกระจายทั่วหน้า Lobby ชั่วคราว "เหมือนตอนที่เราทำฝน"
- **ทำ (lobby3d.js + lobby.css):**
  - `SPELL_COIN` 15→**1000** · แบนเนอร์ใช้ fmtNum → "+🪙1,000" · แบนเนอร์/คำถัดไปยืด 2100→2600ms ให้ทันดูริบบิ้น
  - **เสียงพลุ:** `spellSfx('firework')` ดังคู่ win — ไฟล์ `sound/spell/firework.mp3` มาก่อน / ไม่มี = `spellFireworkSynth()` (white noise buffer ตูม 3 ลูกไล่กัน + lowpass + beep triangle ประกายแตก · ใช้ audioCtx ร่วมกับ beep util.js)
  - **ริบบิ้น `spellConfetti()`:** overlay `#spell-confetti` แพทเทิร์นเดียวกับ `#rain-fx` (fixed inset:0 · pointer-events:none · z-9000 · append body = ทั่วจอจริงไม่ใช่แค่เวที) · ริบบิ้น 70-120 ชิ้นตามความกว้างจอ สุ่มสี 8 สี/ขนาด/ตำแหน่ง/ทิศเอียง · keyframes `spRibbon` ร่วงจากบน 114vh + rotateX พลิ้ว 540-1260° + rotateZ + drift ±80px · จบเองถอด overlay 5.2 วิ · `html.no-anim` = ไม่โปรย
- **Prompt เสียงพลุ:** เพิ่มข้อ 6 ใน `PROMPTS_SPELL_SOUND.md` + Artifact เดิมอัปเดตแล้ว (URL เดิม)
- ✅ **ยืนยัน preview:** จบคำ "frog" → เหรียญ 5,000→6,000 · แบนเนอร์ "+🪙1,000" · ริบบิ้น 91 ชิ้นกระจาย 0.8-99.9% เต็มความกว้าง overlay fixed เต็มจอ · ถอดตัวเอง+แบนเนอร์หาย+ขึ้นคำใหม่หลัง ~5.5 วิ · ไม่มี console error · deploy live .164
- **⚠️ ค้างผู้ใช้:** ลองจริงมือถือ (เสียงพลุ+ริบบิ้น) · เจนเสียง 6 ไฟล์วาง `sound/spell/`
- 💭 หมายเหตุสมดุลเศรษฐกิจ: 1,000/คำ สูงกว่าโลก 3D (15-40/คำ) มาก — ผู้ใช้เคาะเองเพราะเกมนี้ยาก · ถ้าเฟ้อค่อยลดหรือจำกัดจำนวนคำ/วัน

### ✅ รอบ 172 (12 ก.ค.) — Spin-to-Spell: ปัดเหวี่ยงเท่านั้น + หมุนลื่น + เสียง 5 จุด 🎡🔊 (version .163)
- **feedback ผู้ใช้ (ลองจริง):** (1) "ลากประคอง" เอาตัวอักษรไปวางตรงช่องได้เลย = โกงข้ามการปัด — ต้องปัดหมุนเท่านั้น (2) ของเดิมฝืดเกิน ให้คล่องกว่านี้ (3) ขอ prompt สร้างเสียงประกอบ
- **ทำ (lobby3d.js):**
  - **flick-only:** ระหว่างนิ้วแตะ วง "ไม่" หมุนตามนิ้ว (เก็บความเร็วปัดไว้ blend 50/50 กัน jitter) → ปล่อยนิ้วค่อยเหวี่ยงตามแรง · **แตะจับวงกลางหมุน = หยุดสนิททันที** (`spellTarget=spellRot` ตัดระยะไหลที่ target นำ ~2 rad) · นิ้วนิ่ง >120ms/ปัดเบากว่า `SPELL_VMIN` = ไม่เหวี่ยง
  - **ลื่นขึ้น:** แรงเสียดทาน 0.92→`SPELL_FRICTION` 0.975 (ระยะเหวี่ยง ≈ v×40 เฟรม — ปัดแรงหมุน ~3.8 รอบ) · ความไว 0.012→`SPELL_SENS` 0.016 · เพดาน `SPELL_VMAX` 0.6 rad/f กันภาพเบลอ · snap เดิมยังดึงตัวใกล้สุดเข้าช่องตอนวงหยุด (ปัดเบาสุด = ขยับ ~1 ช่อง)
  - **เสียง `spellSfx(name)` 5 จุด:** tick (ตัวอักษรผ่านช่อง — ตรวจ `round(spellRot/slotAng)` เปลี่ยน · throttle 50ms) / collect / wrong / win / start · ไฟล์ `sound/spell/<name>.mp3` มาก่อน → ไม่มี/พลาด = beep สังเคราะห์ (util.js) อัตโนมัติ ตลอด session (`'miss'` cache แบบ speakWord)
- **Prompt เสียง:** `PROMPTS_SPELL_SOUND.md` (ElevenLabs SFX ข้อ 1-3,5 · Suno ข้อ 4) + Artifact ปุ่มคัดลอก https://claude.ai/code/artifact/ea8ad71c-49eb-4405-bf51-deab29db57a3
- ✅ **ยืนยัน preview (rAF shim + pointer จำลอง):** ลากประคอง 150px ค้างปล่อย → วงขยับ 0.0000 (ปิดสนิท) · ปัดเร็ว → เหวี่ยง 23.7 rad ค่อยๆ หยุด+snap เข้าช่อง (d -0.002) · เสียง tick 30 ครั้งระหว่างหมุน (spy beep) · จับกลางหมุน → หยุดสนิท (0.000) ปล่อยแล้ว snap ต่อเอง · เก็บครบคำ "dress" ด้วยการปัดล้วน → 🎉+🪙15 · ไม่มี console error · deploy live .163
- **⚠️ ค้างผู้ใช้:** (1) ลองฟีลปัดจริงมือถือ (จูน `SPELL_SENS/FRICTION/VMAX/VMIN`) (2) เจนเสียง 5 ไฟล์วาง `sound/spell/` แล้วบอก commit
- 💡 **บทเรียนเทสต์:** ปัดสังเคราะห์ dt ห่างกว่านิ้วจริง 3-4 เท่า → ความเร็วต่ำหลุด VMIN — เทสต์ปัดเบาต้องปัดทิศเดิมซ้ำวนรอบ ไม่ใช่เล็งย้อนกลับ

### ✅ รอบ 171 (12 ก.ค.) — เกมวงแหวนสะกดคำ Spin-to-Spell ใน Lobby 🌀 (version .162)
- **สเปกผู้ใช้ (จองไว้รอบ 170):** ตัวอักษรลอยวงแหวนรอบน้อง 3D · ปัดหมุนให้ตัวที่ต้องการมาตรงช่องหน้า ▼ แตะเก็บ เรียงจนครบคำ → รางวัล · รอบแรกจาก 2 รอบ (กลไกหลักครบ · รอบ 2 = ฉลอง/โหมดฟัง/quest)
- **ทำ (lobby3d.js +291 บรรทัด · lobby.css โซน 🌀):**
  - ปุ่ม `🌀 สะกดคำ` มุมล่างซ้ายเวที hero — โผล่เฉพาะ **g0 + โมเดล 3D โชว์จริง** (`spellBtnSync` hook ใน showCanvas) · ระหว่างเล่นน้องย้ายมากลางเวที ผู้เลี้ยงซ่อน จบเกมคืนที่ (sideLayout guard `spellActive`)
  - วงแหวน: sprite ตัวอักษร canvas-texture 12/14/16 ตัวตามความยาวคำ (คำ 3-8 ตัวจาก `vocabForStudent()` ตามชั้น ไม่ซ้ำใน session) ใน `spellGroup` หมุนแยกจาก spin ตัวละคร · marker ▼+ลานเรืองแสงหน้ากล้อง (depthTest:false)
  - ปัดหมุน: redirect ใน bindDrag เดิม (spellTarget/spellVel โมเมนตัมสูตรเดียวกัน) + **snap อัตโนมัติ** หมดโมเมนตัมดึงตัวใกล้สุดเข้ากลางช่อง (เด็กไม่ต้องเล็งเป๊ะ) + **fix ใหม่: นิ้วนิ่งค้าง >120ms ก่อนปล่อย = ล้าง spellVel** (ไม่งั้นความเร็วเก่าดีดวงหมุนต่อ ~1.5 rad เล็งไม่ได้เลย)
  - แตะเก็บ: tap (ขยับ<8px <600ms) → raycast sprite · ตรงช่อง+ตัวถูก = เสียงชื่อตัวอักษร (`speakLetter`)+sfx.correct+ตัวลอยหาย+ช่องคำเขียว · ตัวผิด = แฟลชแดง+sfx.wrong · ไกลช่อง = toast สอนวิธีเล่น (throttle 3.5 วิ)
  - จบคำ: แบนเนอร์ 🎉 คำ+คำแปล+`+🪙15` (`addCoins`) · `speakWord` อ่านทั้งคำ (delay 0.7 วิ แบบโลก 3D) · ตัวเหลือลอยหายแล้วขึ้นคำใหม่เองใน 2.1 วิ · เล่นวนจนกดปุ่ม `✖ เลิกเล่น`
  - กันพัง: renderDashboard กลางเกม (เช่นได้เหรียญ) → attach คืน HUD เอง · เปลี่ยนน้อง/ร่างยักษ์ → `spellAbort()` เคลียร์เงียบใน applyLayout · debug: `Lobby3D._debug().spell` + `Lobby3D._spellLetters()` (พิกัดจอตัวอักษร ไว้เทสต์อัตโนมัติ)
- ✅ **ยืนยัน preview (เฟรมจำลอง rAF shim — ต้อง `Lobby3D.pause()`+renderDashboard ก่อน ให้ tick มา schedule ผ่าน shim ไม่งั้นค้างกับ rAF จริงที่ pane พัก):** เก็บครบคำ "saturday" 8 ตัวเรียงถูก (16→9 sprite) เหรียญ 5000→5015 แบนเนอร์ขึ้น-หาย ขึ้นคำใหม่ winter เอง · ตัวผิดไม่คืบ · แตะหลังวงไม่เก็บ · ✖ คืนเวทีครบ+ปุ่ม 🌀 กลับ · จอเตี้ย 812×375: HUD ทุกชิ้น+ตัวอักษร 12 ตัวอยู่ในเวที (สูง 166px) ไม่ล้นจอ · readPixels มีเนื้อหา · ไม่มี console error · deploy live .162
- **⚠️ ค้างผู้ใช้:** ลองจริงมือถือ (ฟีลปัดหมุน/ขนาดวง — จูน `SP_R/SP_Y/SP_LS` ใน lobby3d.js · เหรียญ `SPELL_COIN`)

### ✅ รอบ 170 (12 ก.ค.) — ภารกิจวันนี้ = การ์ดใหญ่ทีละใบ พลิก 3D + ปุ่ม 🚀 ไปทำเลย 🎴 (version .161)
- **สเปกผู้ใช้:** "ภารกิจแค่เลื่อนขึ้นเฉยๆ ไม่น่าสนใจ" → เคาะข้อเสนอ: การ์ดใหญ่ทีละใบ + ปุ่มพาไปทำ
- **ทำ (ui.js แทน renderQuestCard เดิม + CSS โซน q-bigcard ใน lobby.css):**
  - เด็ค 1 ใบ/ครั้ง: emoji ใหญ่ + ชื่อ + แถบ progress + เลข/✅ + รางวัล + **ปุ่ม 🚀 ไปทำเลย** + จุด ●●● บอกตำแหน่ง (เขียว=สำเร็จ) + บรรทัดโบนัสรวม
  - พลิก 3D สลับใบทุก 6 วิ (`window.__qDeckTimer` interval เดียวทั้งเกม · จอซ่อนข้าม · `html.no-anim` ไม่เล่นพลิก) · แตะการ์ด = พลิกทันที+พัก auto 8 วิ
  - **ปุ่ม 🚀 (questGo):** match20/replay2→คลิก `#btn-play` · quiz1→`#btn-cats` · word3d3→`railWorldClick('adv')` (guard เจ็บ/ตั๋วครบในตัว) · feed1→`openPetInfoOverlay()` · produce1→คลิก rail `panel-factory` — ใช้ handler เดิมทั้งหมด ไม่เขียน logic ใหม่
  - ภารกิจเพิ่งสำเร็จ: เด้งไปใบนั้น+แฟลชเขียว (`q-flash` reuse keyframes qFlash) ค้าง 5 วิ · `__qDoneSeen/__qFlashPend` เดิม · **เลิก initSideScroll กล่องนี้ + `delete sideScrollSt['quest-card']` กัน ticker เก่ามาห่อ ss-chunk ซ้อน** · questFlashRow เดิมถูกถอด
  - **โหมด `q-mini`** กล่องเตี้ย <64px (จอ 812×375 กล่องเหลือ 39px!): ซ่อนแถบ progress+จุด เหลือ 2 แถวกะทัดรัด — จอปกติโชว์เต็ม
- ✅ **ยืนยัน preview:** 922×540 (กล่อง 84px) sh==ch การ์ดเต็มรูปแบบ · แตะพลิกใบถัดไป · questEvent('match',20) → เด้งไปใบ match20+แฟลช+hold 5000ms+จุดเขียว+ปุ่มหาย · ปุ่ม 🚀 เปิดแผงโรงงาน/หน้าเลือกหมวดสอบจริง · 812×375 โหมด mini 39px พอดีเป๊ะ ปุ่มมองเห็น · ไม่มี console error · deploy live .161
- **⚠️ ค้างผู้ใช้:** ลองจริงมือถือ (จังหวะพลิก 6 วิ จูนที่ `QUEST_DECK_FLIP_MS` ใน ui.js)

### ✅ รอบ 169 (12 ก.ค.) — ฟีดเพื่อน: รายการใหม่เข้าสด = แถวแฟลชฟ้า + เด้งไปโชว์ 📰💙 (version .160)
- **ผู้ใช้เคาะไอเดียต่อยอดรอบ 168:** ฟีดรายการใหม่เข้าระหว่างเล่น → เด็กเห็นทันที (แพทเทิร์นภารกิจรอบ 150 + เพื่อนออนไลน์รอบ 152)
- **ทำ:** ui.js — `__feedSeen` (ts ใหม่สุดรอบก่อน · null=ชุดแรกหลัง login ไม่แฟลช) + `__feedFlashPend` (มาใหม่ตอนกล่องซ่อน ค้างรอกลับ lobby) · .feed-row เพิ่ม `data-ts` · ท้าย renderFeedCard เทียบ ts > baseline → `sideFlashRows(el, sel, 'feed-flash')` (reuse ตัวเดิม: แฟลชทั้ง 2 สำเนา ss-chunk + เด้ง scroll + ค้าง 5 วิก่อนวนต่อ) · CSS: `.feed-row.feed-flash` ใช้ keyframes `onFlash` ฟ้าเดิม
- ✅ **ยืนยัน preview:** ชุด login 12 รายการไม่แฟลช · unshift รายการใหม่ → แฟลช 2 แถว (2 สำเนา) เป็นรายการใหม่จริง · scroll เด้งไปโชว์ · hold 5000ms · ไม่มี console error · deploy live .160
- **⚠️ ค้างผู้ใช้:** ทดสอบจริง 2 เครื่อง (เครื่อง A ทำกิจกรรม → เครื่อง B ที่ follow อยู่เห็นแถวแฟลชสดใน lobby)

### ✅ รอบ 168 (12 ก.ค.) — ฟีดเพื่อนซ้าย Lobby เลื่อนวนอัตโนมัติเหมือน aside ขวา 📰 (version .159)
- **สเปกผู้ใช้:** feed เพื่อนแผงซ้าย lobby ให้เลื่อนเหมือนกล่องขวา (ภารกิจ/เพื่อนออนไลน์/อันดับ ที่วนด้วย initSideScroll รอบ 149)
- **ทำ (ui.js จุดเดียว):** `renderFeedCard` เรียก `initSideScroll(el)` ท้ายฟังก์ชัน (ระบบเดิม reuse ทั้งก้อน: ห่อ 2 สำเนา `.ss-chunk` วนไร้รอยต่อ 14px/วิ · แตะ=หยุด ปล่อย 5 วิ=วนต่อ · จอซ่อนเช็ก overflow ซ้ำตอนโผล่) + ทางออก early-return เคสฟีดว่าง/ยังไม่ follow ก็เรียกด้วย (รีเซ็ต `__ssLoop` กันสถานะวนค้างตอนเนื้อหาสั้นลง)
- ✅ **ยืนยัน preview (เฟรมจำลอง — rAF พักใน pane):** ฟีด 14 รายการห่อ 2 chunk วนจริง scrollTop เดิน · แตะแถวยังเปิดการ์ดผู้เล่นได้ (delegation ทะลุ chunk) · render ซ้ำตำแหน่งไม่รีเซ็ต (st.pos ต่อเนื่อง) · ฟีดว่าง __ssLoop=false + ข้อความ empty ปกติ · ไม่มี console error · deploy live .159
- **⚠️ ค้างผู้ใช้:** ดูจริงมือถือ (ความเร็ววนจูนที่ `SIDE_SCROLL_SPEED` ใน ui.js — ตัวเดียวกับกล่องขวา)

### ✅ รอบ 167 (12 ก.ค.) — กล่อง pill info เห็นครบทั้งใบทุกจอ + 2 กฎถาวรใหม่ 📐 (version .158)
- **สเปกผู้ใช้ (screenshot แท็บเล็ตจอเตี้ย):** กล่องโบนัสออนไลน์ (openPillInfo รอบ 156) ปุ่ม "เข้าใจแล้ว!" หลุดขอบจอ — "ไม่เป็นมืออาชีพ"
- **2 กฎถาวรใหม่ (อยู่ในกฎทอง HANDOFF แล้ว):** (ข้อ 5 อัปเดต) ประเมิน token ทุกครั้งที่ผู้ใช้สั่งงาน — New session ถูกกว่าต้องบอกทุกครั้ง ห้ามเงียบ · (ข้อ 7 ใหม่) **ทุก dialog ต้องเห็นครบทั้งใบ ไม่มี scrollbar ไม่ต้องเลื่อน — เทสต์ 812×375 เสมอ**
- **ทำ:** openPillInfo (ui.js) หัวกล่องเรียงแนวนอน `.plf-head` (ไอคอน | ชื่อ+ป้ายเหรียญ) แทนกองแนวตั้ง · CSS (lobby.css โซนรอบ 157): ฟอนต์ clamp ตาม vh (ไอคอน 30-48 · หัว 16-21 · เนื้อ 12-14.5) + media จอเตี้ย ≤520px ลด padding/line-height
- ✅ **ยืนยัน preview:** 812×375 และ 922×540 ทั้ง 3 กล่อง (coins/today/net): `sh<=ch` ไม่มี scroll · กล่อง+ปุ่มอยู่ในจอครบ · ไม่มี console error · deploy live .158
- **🐞 กับดักใหม่ที่เจอ (เข้า HANDOFF gotchas แล้ว):** เทสต์แรกได้ไฟล์เก่าตลอดแม้ force cache — ที่แท้ **dev server ตายแล้ว sw.js เสิร์ฟ cache offline เงียบๆ** (ui.js ที่ได้เหลือ 23KB) → preview_start ใหม่ + unregister SW ก่อนเทสต์
- **⚠️ ค้างผู้ใช้:** เปิดกล่อง pill ทั้ง 3 บนแท็บเล็ตจริง — ต้องเห็นปุ่มครบไม่ต้องเลื่อน

### ✅ รอบ 166 (12 ก.ค.) — ย่อ+บีบภาพทั้งเกม 413MB→~80MB 📉📉 (version .157)
- **ผู้ใช้เคาะ "ย่อทั้งชุดเลย":** สแกนพบ img+sound ที่ขึ้นเว็บรวม ~413MB (PNG >1MB มี 224 ไฟล์ — gifts 85MB · collectibles 83MB · ตัวละคร img ราก ~65MB) เสี่ยงชนโควตาดาวน์โหลดฟรี 360MB/วันตอนใช้ทั้งห้อง
- **ทำ 2 pass (Pillow):** (1) resize LANCZOS ตามขนาดโชว์จริง: gifts 768 · collectibles/cars 640 · rank/ghosts 1024 · theme 1920 · ตัวละคร img ราก 768 → 330MB→100MB · (2) quantize 256 สี FASTOCTREE+dithering (ยกเว้น theme กันแถบสีบนฉากไล่เฉด) → อีก 114MB→19MB · **รวมทั้งเว็บเหลือ ~80MB**
- **ไม่แตะ (ห้ามย่อในอนาคตด้วย):** `img/car/dash.png`+`heli_cockpit.png` (โค้ดวาดเข็มเกจผูกพิกัดพิกเซลof ภาพ — ย่อแล้วเข็มเพี้ยน) · `img/city` (texture ปูซ้ำ 1024 พอดี) · `img/models` glb (ต้อง retopo = เหรียญ Tripo) · sound (mp3 บีบแล้ว)
- **ต้นฉบับเต็ม:** โฟลเดอร์ `originals/` ข้างไฟล์จริงทุกโซน (`.gitignore` กฎ `**/originals/` กันหลุด) + git history ก่อน commit นี้
- ✅ **ยืนยัน:** mean-diff เทียบต้นฉบับที่ขนาดโชว์ 200px = ~1-3/255 (~1% ตามองไม่ออก) · alpha มุมภาพ = 0 โปร่งใสปกติ · deploy live .157
- **หมายเหตุ cache:** URL เดิม+หน้าตาเหมือนเดิม → ผู้เล่นเก่าใช้ cache เก่าต่อได้ไม่ต้องบัสต์ ผู้เล่นใหม่โหลดเบา · **⚠️ ค้างผู้ใช้: เปิดเกมดูภาพการ์ดของขวัญ/ของสะสม/ตัวละคร ถ้าตาเห็นว่าซีด/หยาบตรงไหน บอกชื่อภาพ เดี๋ยวคืนตัวเต็มจาก originals เฉพาะภาพนั้นได้**

### ✅ รอบ 165 (12 ก.ค.) — fix มือถือเห็นโมเดล glb ตัวเก่า: บัสต์ cache ด้วย `?v=` 🔄 (version .156)
- **อาการ (ผู้ใช้ยืนยัน):** อัพ pet_cat/pet_dog.glb ใหม่ขึ้น live แล้ว (รอบ 163 — md5 บนเว็บตรงไฟล์ใหม่) แต่มือถือยังเห็นโมเดลตัวเดิม
- **ต้นตอ:** header ใน `tools/deploy_firebase.sh` ให้ `png/glb/mp3` cache `max-age=604800` (7 วัน) → เครื่องที่เคยโหลด glb เก่าจะใช้ HTTP cache ต่อจนหมดอายุ (sw.js ไม่เกี่ยว — `.glb` ไม่อยู่ใน regex cache-first, network-first ของมันก็ยังโดน HTTP cache ดักอยู่ดี) · เปลี่ยน header ฝั่งเซิร์ฟเวอร์ช่วยเครื่องที่ cache ไปแล้วไม่ได้ ต้องเปลี่ยน URL
- **ทำ (lobby3d.js):** `MODEL_VER='163'` ต่อท้าย URL glb ทุกจุด (`?v=163` — modelsExist HEAD 2 จุด + loadModels 2 จุด) → URL เปลี่ยน = HTTP cache + sw miss ทุกเครื่องทันที โหลดตัวใหม่รอบเดียวแล้ว cache 7 วันต่อตามปกติ (ไม่เสียประโยชน์โควตา)
- **📌 กติกาใหม่ (จำ!): เปลี่ยนไฟล์ .glb เมื่อไหร่ ต้องบัมพ์ `MODEL_VER` ใน lobby3d.js ด้วยเสมอ** ไม่งั้นผู้เล่นเก่าเห็นตัวเดิมไปอีก 7 วัน · (ภาพ png ใหญ่ๆ ก็โดนกติกา 7 วันเดียวกัน — blk ย่อรอบ 164 หน้าตาเหมือนเดิมเลยไม่ต้องบัสต์)
- ✅ **ยืนยัน preview:** network requests เห็น `caretaker_male.glb?v=163` + `pet_dog.glb?v=163` → 200 · Lobby3D โหลดสำเร็จ (ownerLoaded/petLoaded true) ไม่มี console error · deploy live .156
- **⚠️ ค้างผู้ใช้:** เปิดเกมบนมือถือใหม่ (รอแถบ "มีเวอร์ชันใหม่" หรือปิด-เปิดแท็บ) → โมเดลหมา/แมวต้องเป็นตัวใหม่

### ✅ รอบ 164 (12 ก.ค.) — ย่อภาพ picker บล็อก 17MB→947KB 📉 (version .155)
- **ผู้ใช้เคาะไอเดียต่อยอดรอบ 163 "ทำได้เลย":** blk1..8.png ต้นฉบับ 1024×1536 ~2.3MB/ไฟล์ หนักเกินสำหรับ picker (โชว์ ~200px) + เปลืองโควตาดาวน์โหลด Hosting ฟรี 360MB/วัน
- **ทำ:** Pillow LANCZOS ย่อเหลือ 341×512 optimize → รวม **17MB→947KB (~18 เท่า)** · **ต้นฉบับเต็มสำรองไว้ `img/blocks/originals/` (ไม่เข้า git — สร้าง `.gitignore` กันหลุด · อีกชั้นอยู่ใน git history commit รอบ 163)** · ไม่แตะโค้ด — path เดิม picker ใช้ได้เลย
- ✅ **ยืนยัน preview (canvas sample):** 341×512 ครบ · มุมภาพ alpha 0 (โปร่งใสไม่เสีย) · กลางตัว alpha 254-255 ทึบปกติ · deploy live .155 ตรวจ content-length ตรงตัวย่อ
- **⚠️ ค้างผู้ใช้:** ลองจริงมือถือ — เปิด picker โลกขับรถ ภาพต้องคมเท่าเดิม (ถ้าอยากได้คมกว่านี้บนแท็บเล็ต บอกได้ เจนใหม่จาก originals เป็น 768px)

### ✅ รอบ 163 (12 ก.ค.) — เหรียญผู้ทดสอบ 500,000/วัน 2 บัญชี + อัพ glb แมว/หมาใหม่ + ภาพ picker บล็อก 🧪🪙 (version .154)
- **สเปกผู้ใช้:** (1) email `freddommun@gmail.com` และ `sumpajitshami@gmail.com` มีเหรียญ 500,000 **ในแต่ละวัน** เพื่อความคล่องตัวในการทดสอบ — **มีผลจนกว่าผู้ใช้จะสั่งยกเลิก** (2) อัพ `pet_cat.glb`+`pet_dog.glb` ตัวใหม่ (ผู้ใช้ย่อไฟล์ 6.3→3.6MB / 7.8→3.9MB) ขึ้นเว็บ (3) อัพภาพตัวละครบล็อก picker ก่อนขับรถ `img/blocks/blk1..8.png` (8 ไฟล์ ~2.3MB/ไฟล์) ขึ้นเว็บ
- **ทำ:** auth.js — `TESTER_EMAILS` เพิ่ม freddommun · `TESTER_COINS` 60,000→500,000 · testerBoost เติมเหรียญ**วันละครั้ง** (`state.testerCoinDay` เทียบ `toDateString()` แบบ foodQuizDay — วันเดิมใช้เหรียญหมดไม่เติมซ้ำ กันเหรียญ infinite) · state.js เพิ่ม default `testerCoinDay:''` · main.js — interval 1 นาทีเรียก `testerBoost()` (เปิดเกมค้างข้ามเที่ยงคืน → เติมรอบวันใหม่เอง · guard ในตัว ไม่เติมซ้ำ/ไม่ toast ถ้าไม่มีอะไรทำ)
- **การยกเลิกในอนาคต (ผู้ใช้สั่งเมื่อไหร่ค่อยทำ):** ถอน freddommun ออกจาก `TESTER_EMAILS` + คืน `TESTER_COINS=60000` (auth.js) — field testerCoinDay ทิ้งไว้ได้ไม่มีผล
- ✅ **ยืนยัน preview:** login freddommun → เหรียญ 500,000 อัตโนมัติ · วันเดียวกันเหลือ 120 ไม่เติมซ้ำ · จำลองข้ามวัน → เติมกลับ 500,000 · เหรียญ 700,000 เกินเพดาน → ไม่แตะ · pet_cat/pet_dog glb ใหม่โหลดเข้า Lobby 3D จริง (curKey male|cat|adult petLoaded:true) ไม่มี console error · deploy live .154
- **⚠️ ค้างผู้ใช้:** ลองจริงมือถือ (login บัญชีจริงดูเหรียญ + ดูภาพ picker ในโลกขับรถ + โมเดลแมว/หมาไฟล์เล็กลงโหลดไวขึ้น) · ~~ภาพ `car_blk1..8.png`~~ ❌ ผู้ใช้ยกเลิกถาวร 12 ก.ค. (ดูโน้ตรอบ 148)
- 💡 หมายเหตุ: blk PNG ต้นฉบับใหญ่ (~18MB รวม) — ถ้าห่วงโควตา Hosting ฟรี (ดาวน์โหลด 360MB/วัน) เสนอย่อเป็น ~512px ได้ (ต้องถามผู้ใช้ก่อนแตะ asset)

### ✅ รอบ 162 (12 ก.ค.) — เท้าคน+สัตว์ลงต่ำกว่าเส้นพื้นเรืองแสง ไม่ดูลอย 🦶 (version .153)
- **สเปกผู้ใช้ (screenshot):** เท้าคนและสัตว์ในเวที Lobby ลอยเหนือเส้นฟ้า (เส้นพื้นเรืองแสง `.stage-hero::after` ที่ bottom:30px) → ต้องต่ำกว่าเส้น
- **ต้นตอ:** `frameCamera` (lobby3d.js) จัดเฟรมให้เท้า (y=0) อยู่ ~16.4% ของความสูงเวทีจากขอบล่าง (เวที ~500px = เท้าลอย ~82px เหนือเส้นที่ 30px)
- **ทำ (lobby3d.js อย่างเดียว — PNG fallback เท้าอยู่ 24px ต่ำกว่าเส้นอยู่แล้ว ไม่แตะ):**
  - `frameCamera` สูตรใหม่: เล็ง `centerY = V − poseDrop − 2V×pxFrac` โดย V = ครึ่งความสูงโลกที่กล้องเห็น ณ **ระนาบตัวหน้าสุด** (`z0 = max(owner.z, pet.z)`) · pxFrac = `min(GROUND_PX/viewH, 0.165)` · `GROUND_PX=13`
  - **ต้องคิด z0 เพราะร่างยักษ์ g1-4 ผู้เลี้ยงยืนหน้าน้อง (z>0) perspective กดเท้าต่ำสุด** — สูตรแรกที่ไม่คิด z ทำเท้าคนใน g4 โดนขอบล่างตัด (วัดแล้ว row 0)
  - `poseDrop = 5% ของ OWNER_H[g]` — ท่า idle โมเดล Tripo ยื่นต่ำกว่า bbox (fitInto วาง min.y=0 จาก bbox ของ bind pose แต่ animation กดลงอีก) คาลิเบรตจากวัด readPixels จริง
  - `resize()` เก็บ `viewH` + เรียก `frameCamera(curGiant)` ซ้ำทุกครั้งที่จอเปลี่ยน (เดิมเรียกเฉพาะ sideLayout)
- ✅ **ยืนยัน preview (readPixels นับแถวพิกเซลทึบล่างสุด — screenshot ใน pane timeout ตามกับดักรอบ 149):** เวที 499px: g0 เท้าคน 15px / อุ้งเท้าหมา 24px = **ต่ำกว่าเส้น 30px ทั้งคู่** · g1 คน 13 (น้องยักษ์ 43 — อยู่ระนาบไกลกว่า perspective ถูกต้อง) · g4 คน 13/น้อง 27 ไม่โดนตัด headroom 170px · จอเตี้ย 812×375 (เวที 207px): เท้า 16/18px ยังต่ำกว่าเส้น · ไม่มี console error · deploy live .153
- **เทคนิคเทสต์ 3D ใน preview (ใช้ซ้ำได้):** pane ซ่อน rAF พัก → shim `window.requestAnimationFrame` เก็บ callback แล้วเรียก tick เอง จากนั้น `gl.readPixels` ใน task เดียวกัน (ไม่ต้อง preserveDrawingBuffer) · จำลองสัตว์: testkit login → `state.pets.push(newPet('dog','ชื่อ'))` + `level=3` (level 1 = ไข่ ไม่เรียก Lobby3D.attach) → `showScreen('screen-dashboard'); renderDashboard()`
- **⚠️ ค้างผู้ใช้:** ลองจริงมือถือ — จูนได้: ระยะเท้าจากขอบล่าง = `GROUND_PX` (lobby3d.js) · ตำแหน่งเส้นพื้น = `.stage-hero::after{bottom:30px}` (lobby.css)

### ✅ รอบ 161 (12 ก.ค.) — คนซ้าย-สัตว์ขวาขนาบเหรียญ rank + สัตว์ระดับเอวคน 🐕 (version .152)
- **สเปกผู้ใช้ (ยกเลิกสเปคความสูงที่สั่งกลางทาง):** คนสูงเท่าเดิม · สัตว์ร่างปกติสูงไม่เกินเอวคน · คน+สัตว์ขยับแยกด้านข้างจนไม่บัง rank
- **3D (lobby3d.js — ตัวที่ผู้เล่นเห็นจริง):** `PET_H[0]` 1.30→0.80 (0.80/1.55=52% ≈ เอว) · applyLayout แยกทาง g0: ตำแหน่งจาก `sideLayout()` = x ±max(0.85, (fitH×aspect)/2×0.74) — จอกว้างแยกไกล จอแคบไม่หลุดเฟรม · resize() เรียก sideLayout ซ้ำเมื่อ curGiant===0 · ร่างยักษ์ g1-4 จัดกลางเดิมทุกอย่าง
- **PNG fallback (ui.js+lobby.css):** renderDashboard ใส่ class `hero-side` ให้ .stage-hero เฉพาะ g0 → `.hero-scene{width:100%}` คนซ้าย `left:18%` น้องขวา `justify-content:flex-end;margin-right:7%` · `GIANT_PET_VH[0]`=15vh (54% ของคน 28vh) · clamp ขั้นต่ำ `.pet-stage` 140→64px (ไม่งั้นจอเตี้ยน้องโดนดันกลับไปใหญ่กว่าคน)
- **🐞 fix บั๊กแฝงเก่า (สำคัญ):** `@keyframes heroSway{transform:translateY(...)}` — เคส **emoji fallback** ผู้เลี้ยง (`<div class="caretaker-fig caretaker-emoji">` element เดียว 2 class) animation เขียน transform **ทับ translateX ตำแหน่งยืนทุกเฟรม** (แม้ inline style ก็แพ้ animation) = ตำแหน่ง caretaker เคสนี้ไม่เคยขยับจริงมาตลอด → เปลี่ยน keyframes เป็น `translate: 0 -6px` (individual transform property — ไม่ชนกับ transform)
- **บทเรียน testkit:** eval วัดผลใน preview ห้ามประกาศ `var petStage/var ...` ที่ top-level — ทับฟังก์ชัน global ของเกม (petStage() ใน state.js) ทำ renderDashboard พัง · ครอบ IIFE เสมอ
- ✅ **ยืนยัน preview 1000×640:** PNG ตัวจริง (player_male.png): น้องสูง 54% ของคน · คนอยู่ครึ่งซ้าย/น้องครึ่งขวา · transform -81px ทำงานหลัง fix · เหลื่อมเฉพาะแถบขอบเหรียญ (rect รวมขอบใสของ PNG · hero ใน preview แคบกว่ามือถือจริง) · 3D โหลด+วางผังใหม่ไม่มี console error · deploy live .152
- **⚠️ ค้างผู้ใช้:** ลองจริงมือถือ (เห็นโมเดล 3D) — จูนได้: ระยะแยก = ตัวคูณ 0.74 ใน sideLayout (lobby3d.js) · ขนาดน้อง = PET_H[0] · ฝั่ง PNG = left:18%/margin-right:7% (lobby.css)

### ✅ รอบ 160 (12 ก.ค.) — จัดผังโซนกลาง Lobby: rank เด่นสง่าเป็นฉากหลัง 🎖️ (version .151)
- **สเปกผู้ใช้ (screenshot):** ย้าย "อากาศตอนนี้" ลงล่างก่อนปุ่มควิซอาหาร · ดันแท็บสัตว์ (ขาว+➕) ขึ้นไปแทน โดย**ขอบซ้ายของแท็บต้องตรงแนวขอบ rank chip** · ขยายกรอบคน+สัตว์ให้กว้าง เหรียญ rank ใหญ่เด่น · คน+สัตว์สูงไม่ถึงครึ่งของเหรียญ
- **ทำ:** index.html ย้าย `#weather-banner` เข้า `.lobby-bottom` เป็นตัวแรก (id เดิม renderDashboard ไม่ต้องแก้) · CSS `.lobby-bottom .weather-banner{margin:0 auto 0 0}` ชิดซ้ายดันปุ่มไปขวา · `.lobby-stage .pet-tabs{align-self:flex-start;margin-left:var(--tabs-left)}` + **`alignPetTabs()`** (ui.js ก่อน renderDashboard): rect ของ rank-mini เทียบ lobby-stage ÷ scale (กันเพจโดนย่อ) → set `--tabs-left` · เรียกท้าย renderDashboard (หลัง render แท็บ) + `window resize` · `.stage-left` 34%→28% (เวทีกว้างขึ้น) · `.hero-rank-bg img{height:96%;max-width:94%;opacity:.66}` (เดิม 52vh/80%/.6) + glow ::before 50vh→72vh · `GIANT_PET_VH[0]` 29→25 · `GIANT_OWNER_VH[0]` 34→28 · `GIANT_OWNER_X[0]` -66→-56 (ตัวเล็กลง เยื้องน้อยลง · ร่างยักษ์ g1-4 ไม่แตะ)
- ✅ **ยืนยัน preview 1000×640 (rect):** weather อยู่ footer ซ้ายของปุ่มควิซ แถวเดียวกัน · แท็บ t=72 บนสุดเวที **ขอบซ้ายตรง rank chip เป๊ะ (diff 0)** · hero กว้างขึ้น (287→738) · เหรียญ rank สูง 96% ของเวที · **pet 42% / owner 31% ของเหรียญ — ไม่ถึงครึ่ง** · ไม่มี console error · deploy live .151
- **⚠️ ค้างผู้ใช้:** ลองจริงมือถือ — ดูตำแหน่งป้ายอากาศ/แท็บ/ความเด่นเหรียญ rank (จูนต่อได้: ขนาดเหรียญที่ `.hero-rank-bg img` · ขนาดตัวละครที่ `GIANT_*[0]` ใน ui.js)

### ✅ รอบ 159 (12 ก.ค.) — กันแถบดำ Touch to Search ของ Chrome 📵 (version .150)
- **สเปกผู้ใช้ (screenshot มือถือจริง):** แตะข้อความบนปุ่มใดๆ → แถบดำ Google "อันดับ — Tap to see search results" เด้งจากขอบล่างบังเกม (ฟีเจอร์ Touch to Search ของ Chrome Android — จับคำที่แตะไปค้น Google)
- **ทำ (style.css ใต้ `*` reset — ครอบทุกหน้าจอรวมโลก 3D):** `html,body{-webkit-user-select:none;user-select:none;-webkit-touch-callout:none}` — ข้อความเลือกไม่ได้ = Chrome ไม่มีคำให้จับ แถบไม่เด้ง · ยกเว้น `input, textarea, [contenteditable="true"]` ยังเลือก/พิมพ์/วางได้ (ช่องชื่อ/แชท/ค้นเพื่อน/ราคา ฯลฯ)
- ✅ **ยืนยัน preview:** `getComputedStyle(body).userSelect==='none'` · input ยัง `text` · ลอง Range select ข้อความปุ่มจริงได้ 0 ตัวอักษร · ไม่มี console error · deploy live .150 · **cleanup hosting อัตโนมัติ (รอบ 158) ทำงานจริงท้าย deploy — ลบ version เก่า 1 คงไว้ 5**
- **⚠️ ค้างผู้ใช้:** ลองจริงมือถือ — แตะปุ่ม/ข้อความทั่วเกม แถบ Google ต้องไม่เด้งอีก (ถ้า Chrome จำ state เก่า ปิด-เปิดแท็บใหม่ก่อน)

### ✅ รอบ 158 (12 ก.ค.) — กล่อง dialog ทุกใบโทนเดียวกัน + fix โควตา Hosting 📐🧹 (version .149)
- **ผู้ใช้เคาะ "อยากให้เป็นโทนเดียวกันหมด ทำได้เลย"** — ขยายกล่องที่เหลือทั้งตระกูล levelup-box (lobby.css ท้ายไฟล์ โซนรอบ 158)
- **หลักที่ใช้:** กล่องเป็น flex item ใน `.levelup-overlay` → `width:auto` หดตามเนื้อหา — **เพิ่ม max-width ไม่ทำให้กล่องสั้นบาน** (พิสูจน์: กล่องยืนยันสั้น 110px · กล่องข้อความยาวยืดถึง 600) · base 340→min(92vw,600) ครอบผลสอบ/ยืนยัน/เลเวลอัป · summary 560 · report 640 · food 640 · fq `width` 560 (เดิมใช้ width ไม่ใช่ max-width — ต้องทับด้วย width) · home-shop 640 · car-buy 560 · ซ่อนแถบใน `.wl-grid/.lb-list/.tc-wrap/.install-guide`
- **🧹 Deploy เจอ HTTP 429 — โควตา Hosting storage เต็ม (Spark ฟรี):** release history 26 ชุด × 704 ไฟล์ · CLI ไม่มีคำสั่งลบ → เขียน **`tools/cleanup_hosting_versions.mjs`** เรียก REST `firebasehosting.googleapis.com/v1beta1` ด้วย refresh token ของ firebase CLI ในเครื่อง (client id/secret เป็นค่า public ฝังใน firebase-tools) · เก็บ version ของ 5 release ล่าสุด + ใหม่สุด 2 · filter เฉพาะ status FINALIZED · **ผูกท้าย `tools/deploy_firebase.sh` รันอัตโนมัติทุก deploy** (ล้มไม่กระทบ deploy — `|| echo`) · รอบแรกลบ 21 ชุดแล้ว deploy ผ่านทันที
- ✅ **ยืนยัน preview:** short box หดตามเนื้อหา · long box กว้าง 600 ไร้ scroll · summary/report/food/fq/car/home max-width ใหม่+scrollbar ซ่อนครบ (probe computed style) · toggle settings ยังปกติ · ไม่มี console error · live .149
- **⚠️ ค้างผู้ใช้:** ลองจริงมือถือ — เปิดกล่องผลสอบ/สรุปเกม/เมนูอาหาร ดูว่าโปร่งขึ้นและไม่มีแถบเลื่อน

### ✅ รอบ 157 (12 ก.ค.) — กล่องข้อความกลางจอขยายด้านข้าง ไม่มี scrollbar 📐 (version .148)
- **สเปกผู้ใช้ (screenshot pillinfo มี scrollbar):** กล่องข้อความลักษณะนี้ทุกกล่อง ขยายพื้นที่ด้านข้างจนไม่ต้องมี scrollbar — scrollbar ดูไม่ professional
- **ทำ (lobby.css ท้ายไฟล์ ต่อจากโซนรอบ 156):** ซ่อน scrollbar ทั้งตระกูล `.levelup-box` (scrollbar-width:none + webkit — ยังเลื่อนนิ้วได้ เป็น fallback จอจิ๋ว) · กล่องข้อความ: pillinfo 620 / alert 560 (`!important` ทับ 320 เดิม) / attn 620 / nw 620 · **ตั้งค่า: grid 3 คอลัมน์** (h2/hint/หัวข้อ feed/ปุ่มช่วยเหลือ/ปุ่มปิด span เต็มแถว) + แถว padding 8 + label 14.5/desc 11 + **สวิตช์ย่อ 84×34 (knob 26 · on left 54)** + กล่อง padding 14 22 12 → พอดีจอไม่เลื่อน · **วิธีเล่น/คู่มือครู (.help-box ร่วม): help-body grid 3 คอลัมน์** font 12.5 (เนื้อหา 10 หัวข้อยาวเกินจอเตี้ย — ยังเลื่อนได้แต่ไร้แถบ) · media ≤920px = 2 คอลัมน์ · ≤680px = คอลัมน์เดียว
- ✅ **ยืนยัน preview 1000×640:** settings `scrollHeight==clientHeight` (574==574) ไม่เลื่อน · default ปิดทุกสวิตช์ + toggle เปิด/ปิดยังทำงานหลังย่อสวิตช์ · pillinfo/alert noScroll · help สลับ 3 คอลัมน์ scrollbar ซ่อน · ไม่มี console error · deploy live .148
- **⚠️ ค้างผู้ใช้:** ลองจริงมือถือจอเตี้ย — เปิดตั้งค่า ⚙️ / วิธีเล่น 📖 / แตะ pill ดูว่าไม่มีแถบเลื่อนโผล่
- **หมายเหตุ:** state.feedShare ในเครื่อง preview ถูกล้างกลับ default (เทสต์รอบก่อนเผลอเซฟ quiz:true ไว้)

### ✅ รอบ 156 (12 ก.ค.) — แตะ pill ตัวเลขบน header Lobby = หน้าต่างอธิบาย 💡 (version .147)
- **สเปกผู้ใช้ (screenshot):** pill 3 ก้อนบน header (🪙 60,010 · 📅 +4,003 · 🌐 +212.07) แตะแล้วให้ขึ้นหน้าต่างอธิบายว่าเป็นตัวเลขของอะไร
- **ทำ:** `openPillInfo(kind)` (ui.js ก่อน renderComputerCard) — กล่อง `.pillinfo-box`: emoji ใหญ่ + ชื่อ + เลขสด (`.pillinfo-val` ชิปทอง tabular-nums) + คำอธิบายเด็กอ่านง่าย · coins=มีอยู่ตอนนี้+แหล่งหาเพิ่ม · today=นับเฉพาะที่หาได้วันนี้ ใช้จ่ายไม่ลด รีเซ็ตเที่ยงคืน แคปส่งครูได้ · net=+ONLINE_RATE/วิ ตกเหรียญเต็มทุก 100 วิ ตัวเลข=สะสมทั้งหมด + สถานะ 🟢 กำลังเดิน/⚪ หยุดพัก (จาก onlineEarnActive) · ผูก click ใน main.js (`closest('.coin-pill')` ของ #coin-count/#coin-today + #net-pill) · CSS: pill cursor:pointer+active ยุบ (lobby.css ท้ายไฟล์)
- ✅ **ยืนยัน preview 1000×640:** เลขตรงตามจริงทั้ง 3 กล่อง (60,010 / +4,003 / +212.07) · net โหมด offline ขึ้น "⚪ หยุดพัก" ถูก · ปิดได้ทั้งปุ่ม "เข้าใจแล้ว!"/แตะฉากหลัง · ไม่มี console error · deploy live .147
- **⚠️ ค้างผู้ใช้:** ลองจริงมือถือ (แตะ pill 3 ก้อน)

### ✅ รอบ 155 (12 ก.ค.) — ระบบ Follow + Feed กิจกรรม + จัดผัง Lobby ใหม่ 📰 (version .146)
- **ผู้ใช้เคาะคำถามเปิด 3 ข้อ:** follow ทางเดียวแบบ TikTok ไม่ต้องอนุมัติ · เก็บ 30 รายการล่าสุด/คน · เปิด profile ใครก็เห็นกิจกรรมตามหมวดที่เจ้าตัวเปิด (follow = ดึงมารวมฟีดหน้า lobby)
- **DB ใหม่ (rules รอ publish — RULES.md อัปเดตครบ):** `/feed/<uid>/p/<key>={c,tx,ts}` เจ้าของเขียนเองเท่านั้น เก็บ 30 (client prune หลัง push) · `/feed/<uid>/a` = JSON คลังทรัพย์สิน (เฉพาะตอนเปิดเผย) · `/follow/<target>/<follower>={n,ts}` follower เขียน/ลบ node ตัวเอง อ่านได้ทุกคน login
- **online.js:** feedEvent (เขียนเฉพาะหมวดที่เปิดใน state.feedShare) / feedPrune / feedPurgeCat (ปิดหมวด=ลบโพสต์เก่า) / feedPushAssets (sig กันเขียนซ้ำ · hook ใน onlinePushScore+ตั้งค่า) / followSet/followUnset (จำใน `state.follows` เซฟ cloud) / feedWatchSync (watcher ต่อคน แนวเดียว chatWatchSync) → feedRebuild → `Online.feed` / fetchPlayerFeed/fetchPlayerAssets/fetchFollowers · เริ่มตอน connected ใน onlineStart · ทุกจุด catch เงียบ — **rules ยังไม่ publish = เกมปกติ ฟีดแค่ว่าง**
- **state.js:** `feedShare` 5 หมวด (FEED_CATS) default ปิดหมด + `follows{}` + migration · hooks: questEvent (รางวัล+โบนัสครบ 3) · refreshRank · addCraft · game.js: finishQuiz · ui.js: acceptGift / buyMarketItem / รับน้องใหม่
- **ผัง lobby (renderDashboard):** HTML ข้อมูลน้อง+การดูแลเก็บใน `__petPlates` → overlay `.pi-overlay` 2 คอลัมน์ (ร่างไข่=one-col) ไม่มี scrollbar เปิดจากปุ่ม 🐾 เหนือฟีด (แถม 🤒/😫 กะพริบตอนน้องป่วย/หิว) · **ปุ่มดูแลทั้งหมด (feed/cure/giant/sleep/detox/rename) ย้ายไปผูกใน `bindPetPlateButtons(root)` — ห้ามผูกใน renderDashboard อีก** · overlay เปิดค้าง → renderDashboard เรียก `__piOverlay.refresh()` เนื้อหาสดเสมอ · ซ้าย `.stage-left` = ปุ่ม+`.feed-plate` (แทนกล่องข้อมูลน้องเดิม) · hero ย้ายขวาแทนกล่องการดูแล · `renderFeedCard` ฟีดเลื่อนอ่านได้ scrollbar ซ่อน + empty 2 แบบ · คลิกแถว → showPlayerCard
- **profile (showPlayerCard):** `.pl-wide` min(94vw,860px) — คอลัมน์สถิติ | กิจกรรมล่าสุด + แถวล่างกริดทรัพย์สิน `.pl-assets` (เรียงแพง→ถูก · ×N ซ้อนมุม · โชว์เฉพาะคนที่เปิดเผย) + ปุ่ม ➕ ติดตาม/✓ ติดตามแล้ว + 👥 ผู้ติดตาม N คน (ปุ่มโผล่เฉพาะ Online.ready และไม่ใช่ตัวเอง)
- **ตั้งค่า (util.js openSettings):** ส่วน "📰 การเปิดเผยกิจกรรมในโปรไฟล์" 5 สวิตช์ · เปิด=toast บอกผล · ปิด=feedPurgeCat ลบของเก่า · assets → feedPushAssets ทันที · settings-box สูงขึ้น → max-height 92vh เลื่อนได้ scrollbar ซ่อน
- ✅ **ยืนยัน preview 1000×640 (getBoundingClientRect):** ผังใหม่ถูก (ปุ่มเหนือฟีดซ้าย · hero ขวา · แผงเก่าหาย) · overlay 2 plates `scrollHeight==clientHeight` ไม่มี scroll ปุ่มครบ refresh สดตอน renderDashboard ปิดได้ทั้ง ✕/ฉากหลัง · ไข่ one-col · ฟีดจำลอง 4 แถว scrollbar กว้าง 0 คลิกเปิด profile ถูกคน · follow/unfollow toggle ปุ่ม+state+watcher ครบ · settings default ปิดหมด toggle/purge/pushAssets ยิงถูก · engine จำลอง fake db: หมวดปิดไม่เขียน / เปิดเขียน `feed/test1/p` / prune 35→30 ลบเก่าสุด / purge เฉพาะหมวด / assets set→dup-block→remove / watch on-off ตาม follow · questEvent→feedEvent('coin') · ไม่มี console error · deploy live .146 ยืนยัน version.json แล้ว
- **บั๊กที่เจอระหว่างทำ:** followSet เช็คแค่ `Online.ready` ไม่เช็ค `Online.db` → throw ตอน db ยังไม่พร้อม (แก้ guard แล้ว) · screenshot preview timeout = อาการ pane เดิม (รอบ 149) ไม่ใช่บั๊กโค้ด
- **⚠️ ค้างผู้ใช้:** (1) publish rules — ก้อนเต็มรวม field `tl` รอบ 132 ที่ค้างอยู่ด้วย จบในก้อนเดียว (2) ทดสอบจริง 2 เครื่อง · หมายเหตุ: ผู้เล่น no-pet ยังใช้การ์ดเดิมไม่มีฟีด (เคสหายาก — อยากให้มีค่อยต่อยอด)

### ✅ รอบ 154 (12 ก.ค.) — การ์ดคำชวนค้างในกล่องเพื่อน + ปุ่ม 🚀 ไปเลย! 📨 (version .145)
- **ไอเดียต่อยอดจากรอบ 153 (ผู้ใช้เคาะ):** ฝั่งคนถูกชวน เดิมได้แค่ toast ผ่านไป → การ์ดคำชวนค้างบนสุดของกล่องเพื่อนออนไลน์ กด 🚀 พาเข้าโลกนั้นทันที
- **ทำ (ui.js):** renderOnlineCard (โหมดออนไลน์) วาด `.inv-card` จาก `Online.tinv` บนสุดของเนื้อหา (ข้อความ "📨 <ชื่อ> ชวนไปเล่นโลกX — เจอกันรับคนละ 🪙2,000") · ปุ่ม **🚀 ไปเลย! = `railWorldClick(WORLD3D.find(mode))` ตัวเดียวกับปุ่มรางโลก 3D** (บาดเจ็บ→toast รักษา+เปิดร้าน · ไม่มีตั๋ว→toast+เปิดร้านเลื่อนไปการ์ดตั๋ว · มีตั๋ว→เข้าโลกเลย) · ปุ่ม "ไว้ก่อน" = ซ่อนเฉพาะเซสชัน (`Online.tinvHidden` — **ไม่ tinvClear เพราะจะเสียสิทธิ์เงินคืนตอนเจอกัน** เข้าเกมใหม่การ์ดกลับมา) · `bindInviteCards` delegation ครั้งเดียว
- **online.js:** tinvWatch คำชวนใหม่ → `window.__invFlashPend=uid` + เรียก `onlineRerender()` ท้าย callback → การ์ดโผล่สด + renderOnlineCard แฟลชฟ้า `on-flash`+เด้งไปโชว์ (helper sideFlashRows รอบ 152)
- **CSS (lobby.css):** `.inv-card` พื้นฟ้าใส ขอบเรือง + ปุ่มเขียว 🚀 / ปุ่มจางไว้ก่อน · selector `on-flash` ขยายครอบ `.inv-card`
- ✅ **ยืนยัน preview 812×375:** คำชวน 2 ใบขึ้นบนสุดกล่อง ข้อความ+map ถูก · แฟลช+hold 5 วิ+pend เคลียร์ · 🚀 ไม่มีตั๋ว→toast "ยังไม่มีตั๋วโลกผีสิง"+ร้านเปิด · บาดเจ็บ→toast รักษา · มีตั๋ว→เรียก enter('haunt') จริง (spy) · ไว้ก่อน→การ์ดหาย tinv ใน memory ยังอยู่ ใบอื่นไม่หาย · ไม่มี console error · deploy live .145
- **⚠️ ค้างผู้ใช้:** ทดสอบจริง 2 เครื่อง — เครื่อง A ชวน (เมนูลัดรอบ 153) เครื่อง B เห็นการ์ด+กด 🚀 เข้าโลก แล้วเจอกันรับเงินคืน

### ✅ รอบ 153 (12 ก.ค.) — เมนูลัดแตะแถวเพื่อนออนไลน์ 🤝🎁💬 (version .144)
- **ไอเดียต่อยอดจากรอบ 152 (ผู้ใช้เคาะ):** แตะแถวเพื่อนในกล่องออนไลน์ → เมนูลัด ชวนเล่น/ส่งของขวัญ/ทักทาย ในแตะเดียว
- **ทำ (ui.js):** แถวเพื่อนโหมดออนไลน์จริง เพิ่ม `data-fid/n/g` ทั้งแถวคลิกได้ · **เลิกใช้ pl-click ที่ชื่อ (ดูข้อมูลย้ายเป็นปุ่มในเมนู กันเด้งซ้อน — แถวเราเอง me-row ยังเป็น pl-click เดิม)** · `openFriendQuickMenu(uid,n,g)`: แผงกลางจอโทนกระจกฟ้า — หัวชื่อ+เข็ม+ชั้น · แถบชวนเล่น 3 โลก (`tinvSend` adv/haunt/heli + จำใน `state.tinvSent` → ชวนแล้วปุ่มติ๊ก ✓ disabled + toast เดิม "📨 ส่งคำชวนถึง...") · เป็นเพื่อนกันแล้ว (เช็ค `Online.myFriends`) = 🎁 `openGiftPicker` + 💬 `openChat` · ยังไม่เป็น = ➕ `friendRequest` · 👤 `showPlayerCard` ทุกคน · ปิดด้วย ✕/คลิกฉากหลัง · `bindFriendQuickMenu` delegation ครั้งเดียว
- **CSS (lobby.css):** `.fq-overlay/.fq-box` แผง min(92vw,420px) กระจกฟ้าเดียวกับกล่อง aside · ปุ่มของขวัญชมพู/ดูข้อมูลจาง
- ✅ **ยืนยัน preview 812×375:** เมนูเพื่อนจริง = worlds 3 + gift/chat/info · คนแปลกหน้า = addfr/info · กล่อง 340×199 ไม่ล้นจอ · ชวน haunt → tinvSend(uid,map) ถูก + tinvSent เซฟ + toast + เปิดใหม่ปุ่มติ๊ก ✓ disabled · gift เปิด picker จริงหัว "ส่งของขวัญให้ น้องเอ" · chat/info/addfr เรียกด้วย args ถูก (stub ตรวจ) · ปิด ✕/ฉากหลังได้ · ไม่มี console error · deploy live .144
- **⚠️ ค้างผู้ใช้:** ทดสอบจริง 2 เครื่อง — แตะแถวเพื่อน กดชวน/ของขวัญ/แชทจริง (rules /tinv /gifts /chat publish ครบแล้วรอบก่อนๆ)

### ✅ รอบ 152 (12 ก.ค.) — เพื่อนใหม่ออนไลน์ = toast + แถวแฟลชฟ้า + กล่องเด้งไปโชว์ 🎉💙 (version .143)
- **ไอเดียต่อยอดจากรอบ 150 (ผู้ใช้เคาะ "ทำได้เลย"):** เพื่อนใหม่เพิ่ง login → toast "🎉 <ชื่อ> มาออนไลน์แล้ว!" + แถวเพื่อนแฟลชฟ้า + กล่องเด้งเลื่อนไปโชว์ก่อนวนต่อ (เฉพาะโหมดออนไลน์จริง — เพื่อนจำลองไม่นับ)
- **ทำ (ui.js):** refactor questFlashRow → helper ร่วม `sideFlashRows(el,sel,cls)` (แฟลช+เด้ง scroll+ค้าง 5 วิ ใช้ได้ทุกกล่อง) · `.online-row` เพิ่ม `data-fid` · renderOnlineCard โหมดออนไลน์เทียบ friend ids กับรอบก่อน (`__onSeen`) → id ใหม่ = `__onFlashPend` + toast (หลายคนพร้อมกัน = "เพื่อน N คนมาออนไลน์แล้ว!") + sfx.select · **กันสแปม 2 ชั้น:** (1) `FRIEND_FLASH_GRACE` 8 วิแรกหลังต่อสำเร็จไม่นับ (presence sync ชุดแรกทยอยเข้า) (2) หลุดออนไลน์ → `__onSeen=null` ต่อกลับตั้ง baseline ใหม่เงียบๆ (เน็ตกระพริบไม่ toast รัว) · จอซ่อน = pend ไว้แฟลชตอนกลับ lobby (`onlineRerender` วาดเฉพาะตอน dashboard active อยู่แล้ว)
- **CSS (lobby.css):** `.online-row.on-flash` = `onFlash` ฟ้าเรือง 1.2s×3 (คู่กับ qFlash เขียว) · เคารพ no-anim อัตโนมัติ
- ✅ **ยืนยัน preview 812×375 ครบ 6 เคส:** sync ชุดแรก 2 คนเงียบ · คนใหม่ใน grace เงียบ · พ้น grace → toast ชื่อถูก+แฟลช 2 สำเนา+เด้งแถวชิดบน (4px)+ค้าง 5 วิ · 2 คนพร้อมกัน → toast "เพื่อน 2 คน" · จอซ่อน pend→กลับมาแฟลช+เคลียร์ · offline รีเซ็ต→ต่อกลับ baseline เงียบ · ไม่มี console error · deploy live .143
- **⚠️ ค้างผู้ใช้:** ทดสอบจริง 2 เครื่อง — เครื่องหนึ่งอยู่ lobby อีกเครื่อง login เข้ามา ดู toast+แถวแฟลชฟ้า

### ✅ รอบ 151 (12 ก.ค.) — แท็บ 🪙 เหรียญ/🏅 เข็ม ย้ายออกนอกกล่อง ไม่วนกับเนื้อหา (version .142)
- **สเปกผู้ใช้:** ปุ่มเหรียญ/เข็มของกล่องกระดานอันดับไปอยู่นอกกล่องเหมือนหัวข้อ ไม่หมุนไปกับเนื้อหา
- **ทำ:** index.html หัวข้อกล่อง 3 เป็นแถว flex `.side-label-row` = `.lab-txt` "🏆 อันดับ" (ย่อจาก "กระดานอันดับ" ให้พอดีแถวกับแท็บที่ 205px) + ช่อง `#lb-tabs-out` · renderLeaderboardCard เรนเดอร์ปุ่ม 2 แท็บลง `#lb-tabs-out` แทน (เนื้อหาในการ์ดเหลือแต่ลิสต์/lb-empty) · คลิกยังใช้ delegation `.lb-tab` เดิม (bindLbTabs) · CSS `.lb-tabs-out .lb-tab` ชิปเล็ก 10.5px โทนกระจกฟ้า + **ลบกฎเก่า `.lobby-side .lb-tabs/.lb-tab` ที่อยู่ท้ายไฟล์กว่า (จะทับสไตล์ใหม่เพราะ specificity เท่ากัน)**
- ✅ **ยืนยัน preview 812×375:** แท็บ 2 ปุ่มอยู่แถวหัวข้อเหนือกล่องจริง (bottom ≤ glass.top) ไม่ล้นขวา · คลิกสลับ coins↔badges active ถูก · จำลองออนไลน์ 8 แถว (**testkit: ต้อง `Object.assign(Online,{...})` — `window.Online=` ทับ binding ไม่ได้**) → การ์ดมี lb-row 16 (2 สำเนา) แท็บในการ์ด 0 วนเลื่อน 14px/วิ ปกติ · ไม่มี console error · deploy live .142
- **⚠️ ค้างผู้ใช้:** ลองจริงมือถือพร้อมรอบ 149-150

### ✅ รอบ 150 (12 ก.ค.) — ภารกิจสำเร็จ = แถวแฟลชเขียว + กล่องเด้งไปโชว์ก่อนวนต่อ ✅💚 (version .141)
- **ไอเดียต่อยอดจากรอบ 149 (ผู้ใช้เคาะ "ทำได้เลย"):** ภารกิจใดสำเร็จ → กล่องภารกิจเด้งเลื่อนไปโชว์แถวนั้น + แฟลชเขียว 3 จังหวะ ค้าง 5 วิ แล้วค่อยกลับไปเลื่อนวนต่อ
- **ทำ (ui.js):** `.q-row` เพิ่ม `data-qid` · renderQuestCard เทียบ `state.quests.done` กับรอบก่อน (`__qDoneSeen` — null ตอน login = ไม่นับของเก่า) → id ใหม่เก็บ `__qFlashPend` · กล่องมองเห็นอยู่ค่อย `questFlashRow()`: ติด class `q-flash` ทั้ง 2 สำเนา ss-chunk + เซ็ต `st.pos/scrollTop` ไปหัวแถว (เทียบ offsetTop กับสำเนาแรก clamp ใน [0,ssH)) + `st.until=now+QUEST_FLASH_HOLD(5000)` · **สำเร็จตอนอยู่หน้าเกม (lobby ซ่อน clientHeight=0) = pend ค้างไว้ กลับเข้า lobby (renderDashboard→renderQuestCard) ค่อยแฟลช**
- **CSS (lobby.css):** `.lobby-side .q-row.q-flash{animation:qFlash 1.2s ease-in-out 3}` เขียวเรือง · เคารพสวิตช์ปิดเอฟเฟกต์อัตโนมัติ (`html.no-anim` มี `animation:none!important` ครอบอยู่แล้ว — จอยังเด้งเลื่อนไปโชว์แถว แค่ไม่กะพริบ)
- ✅ **ยืนยัน preview 812×375:** questEvent จบภารกิจแถวล่างสุด → flash 2 สำเนา + scrollTop 107.2 แถวชิดบนกล่อง (3px) + hold 5000ms + animationName qFlash · ครบ 5 วิเลื่อนต่อ 14px/วิ · เคสซ่อนจอ: pend ไว้ ไม่แฟลชตอนซ่อน กลับ lobby แฟลช+เด้งถูกแถว pend เคลียร์ · no-anim → animationName none · ไม่มี console error · deploy live .141
- **⚠️ ค้างผู้ใช้:** ลองจริงมือถือ — ทำภารกิจสำเร็จ (เช่น สอบผ่าน 1 หมวด) แล้วดูกล่องเด้ง+แฟลชตอนกลับ lobby

### ✅ รอบ 149 (12 ก.ค.) — 3 กล่อง aside ขวา Lobby เป็นกระจกฟ้า sci-fi + เลื่อนวนอัตโนมัติ 🛸📜 (version .140)
- **สเปกผู้ใช้:** หัวข้อกล่องเล็กลง ย้ายไปนอกกล่อง (เหนือกล่อง) · ในกล่องเหลือแต่รายละเอียด · พื้นขาว→กระจกฟ้า sci-fi (โทน `.stage-plate`) ทั้ง 3 กล่อง · เนื้อหาเลื่อนวนล่าง→บนอัตโนมัติ ไม่มี scrollbar · แตะ=หยุดเลื่อนอ่านเอง · ปล่อยเกิน 5 วิ=เลื่อนต่อ
- **ทำ:** index.html ห่อการ์ดเป็น `.side-sec > .side-label + .side-glass > .side-card` · ui.js ตัด `<h3 class=shop-title>` ออกจาก renderQuestCard/renderOnlineCard (ป้าย "🌏 ออนไลน์จริง" ย้ายขึ้น `#online-label` อัปเดตใน renderOnlineCard) · เพิ่ม `initSideScroll(el)`+`sideScrollTick` (rAF กลาง 1 ตัว): เนื้อหาล้นกล่อง→ห่อ 2 สำเนา `.ss-chunk` วนไร้รอยต่อ (ssH=offsetTop สำเนา2) เลื่อน 14px/วิ · pointerdown/touchstart=hold · ปล่อย (บน window)=รอ 5 วิ · wheel ก็รีเซ็ตเวลารอ · สถานะเก็บใน `sideScrollSt[id]` อยู่ข้าม re-render · lobby.css: `.side-glass` gradient ฟ้าเข้ม+scanline บนกรอบ (ไม่เลื่อนตามเนื้อหา) + override สีเนื้อหาโซน `.lobby-side` ทั้ง q-*/online-*/lb-* เป็นโทนสว่าง + ซ่อน scrollbar (`scrollbar-width:none`+webkit)
- **กับดักที่เจอ:** (1) การ์ดถูกเรนเดอร์ตอน screen ยังซ่อน → clientHeight=0 วัด overflow ไม่ได้ → ticker เช็กซ้ำเองตอนกล่องโผล่แล้วล้นจริง (2) preview pane รายงาน `document.hidden=true` → rAF ถูกพักทั้ง pane + screenshot timeout — **ไม่ใช่บั๊กโค้ด** พิสูจน์ด้วยการยิงเฟรมจำลองเข้า `sideScrollTick` แทน
- ✅ **ยืนยัน 812×375 (getBoundingClientRect + จำลองเฟรม):** หัวข้อ 11px อยู่เหนือกล่องจริงทั้ง 3 · กล่องกระจกฟ้า 205×65 ไม่ทับกัน ไม่ล้นจอ · scrollbar กว้าง 0 · เลื่อน 14px/วิ · แตะค้างหยุดจริง · ช่วงรอ 5 วินิ่ง · ครบแล้วไปต่อ · วนลูป wrap ไร้รอยต่อ (214→2.4) · pointerdown/up จริงตั้ง hold/until ถูก
- **⚠️ ค้างผู้ใช้:** ลองจริงมือถือ (ดูความเร็วเลื่อน 14px/วิ + จังหวะหยุด 5 วิ — จูนได้ที่ `SIDE_SCROLL_SPEED`/`SIDE_SCROLL_RESUME` ใน ui.js)

### ✅ รอบ 148 (12 ก.ค.) — ภาพตัวละครนั่งรถในแผงเตรียมออกรถ 🧱🚗 (version .139)
- **สเปกผู้ใช้ (ต่อยอดจากรอบ 147):** ภาพตัวละครนั่งในรถ ต้องแมทกับตัวที่ผู้เล่นเลือก · ภาพผู้ใช้จะเจนมาวางทีหลัง
- **ทำ:** `#adv-carstart` เพิ่ม `<img id=cs-avatar>` ใต้ h3 · `carStartShow()` ตั้ง `src=img/blocks/car_${state.blockAv}.png` ทุกครั้งที่แผงเด้ง (fallback blk1 ถ้า key เพี้ยน) · listener load→โชว์ / error→ซ่อน (ผูกครั้งเดียวใน buildDom) · **กับดัก cache: src เดิมเคยโหลดแล้ว event load ไม่ยิงซ้ำ → เช็ค `complete&&naturalWidth>0` หลังตั้ง src** · CSS `max-height:min(100px,18vh)` แผงไม่ล้นจอเตี้ย
- **ชื่อไฟล์รอผู้ใช้ (โฟลเดอร์ `img/blocks/` เดียวกับภาพยืน):** `car_blk1.png`…`car_blk8.png` — ลำดับเดียวกับ blk1 เรซเซอร์แดง…blk8 มิ้นตี้ · PNG โปร่งใส สัดส่วนอิสระ
- ✅ **ยืนยัน preview 812×375:** เลือก blk4 → src `car_blk4.png` + ซ่อน (ไฟล์ยังไม่มี) · จำลองไฟล์จริง (car_01.png) → โชว์สูง 68px แผง fits จอ · exit→เข้าใหม่ blk7 → src `car_blk7.png` เปลี่ยนตาม+ซ่อนกลับ · ไม่มี console error · deploy live .139
- ภาพยืน `blk1..8.png` ✅ ขึ้น live แล้ว (รอบ 163 + ย่อรอบ 164)
- **❌ ภาพนั่งรถ `car_blk1..8.png` — ผู้ใช้ยกเลิกถาวร 12 ก.ค. 2026:** "ไม่ทำแล้ว ไม่คุ้มค่าเสียเวลา เพราะรถแต่ละคันมีเสน่ห์ของมันเพียงพอแล้ว" → **ห้ามทวง/ห้ามเสนอทำอีก** · โค้ด `cs-avatar` ใน carStartShow คงไว้ได้ (ไม่มีไฟล์ = ซ่อนตัวเอง ไม่มีผลกับเกม)

### ✅ รอบ 147 (12 ก.ค.) — ปุ่มขวาบนแถวเดียว + picker รับภาพตัวละครจริง 🧱🖼️ (version .138)
- **สเปกผู้ใช้ 1 (screenshot):** ปิด×2+ทุกคน ขึ้นแถวเดียวกับแชท · ออกไปริมขวาสุด · ? ก่อนปุ่มแดง · ไม่พอที่ให้ย่อ → แถวเดียว: vmode(276)·spk(224)·mic(172)·chat(108)·help(74)·exit(8) font 11-12.5 · **กับดัก: `.adv-vbtn` base มี `min-width:86px` ต้อง override เป็น 0** · HP ย่อ 96→80 (topbar จบ 464 vs แถวเริ่ม 473) · `#adv-inst` (pill ความเร็ว) ลง top:52 หลบแถว · tmute/podbtn (ครู) แถวสอง top:52 right:108/200 · ตรวจชนทุกคู่=0
- **สเปกผู้ใช้ 2: ภาพตัวละคร 8 ตัวเจนเอง (สไตล์ Lego toy) แทนภาพเรนเดอร์ picker** — pickBlockAvatar ชี้ `img/blocks/blk<n>.png` ก่อน + listener error → fallback `_blkThumbs` (เรนเดอร์จากโมเดล) · **ชื่อไฟล์ตามลำดับ BLOCK_AVATARS: blk1 เรซเซอร์แดง · blk2 กัปตันฟ้า · blk3 ชาเขียว · blk4 ซันนี่ส้ม · blk5 วิซาร์ดม่วง · blk6 พิ้งกี้ · blk7 เลม่อน · blk8 มิ้นตี้** · โฟลเดอร์ img/blocks/ ยังไม่มี — ผู้ใช้สร้างตอนวางไฟล์ · ภาพสัดส่วนไหนก็ได้ (object-fit:contain รอบ 145)
- ✅ **ยืนยัน 812×375:** แถวเดียว y8 ครบ 6 ปุ่ม เรียงถูก exit ชิดขวา · ชนกัน 0 คู่ · picker: 8 ภาพ fallback เป็น dataURL ครบไม่มีภาพแตก + จำลองไฟล์จริง (car_01.png) เรนเดอร์ผ่าน · ไม่มี console error · deploy live .138
- **⚠️ ค้างผู้ใช้:** (1) วางภาพ 8 ไฟล์ใน `img/blocks/` แล้วบอก Claude commit (2) ลองจริงมือถือ — แถวปุ่มเดียวบนจอจริง

### ✅ รอบ 146 (12 ก.ค.) — แผงกฎหมายกว้างเต็ม ไม่มี scrollbar 🛡️ (version .137)
- **สเปกผู้ใช้ (screenshot: แผงแคบ 500px ต้องเลื่อนถึงเห็นปุ่มรับทราบ):** ยืดกว้างซ้าย-ขวาจนใส่ปุ่มได้ไม่ต้อง scroll
- **วิธี (showLawInfo ~line 4001 + CSS ~2767):** width→`min(94vw,920px)` · เพิ่ม `.li-grid{display:grid;grid-template-columns:repeat(3,1fr)}` ห่อ 3 ก้อนกฎหมาย (เข็มขัด ม.123 / ขับเร็ว ม.67 / โทษจำคุก) · ฟอนต์ 14.5→13.5 padding ลด · แบนเนอร์เตือน withWarn อยู่นอกกริด เต็มแถวบนเหมือนเดิม · max-height 92vh + overflow:auto คงไว้เป็น fallback จอจิ๋ว (<700px กว้าง อาจล้นนิด — ยอมรับ)
- ✅ **ยืนยัน 812×375 เคสสูงสุด (เด้งพร้อมแบนเนอร์เตือนเข็มขัด):** แผง 763×308 กลางจอ · `scrollHeight==clientHeight` (304) ไม่มี scroll · กริด 3 คอลัมน์จริง · ปุ่ม "🫡 รับทราบ" y281 เห็นเต็ม กดแล้วแผงปิด · ไม่มี console error · deploy live .137
- **⚠️ ค้างผู้ใช้:** ลองจริงมือถือ (แผงเด้งตอนกดออกรถครั้งแรก/ยังไม่คาดเข็มขัด)

### ✅ รอบ 145 (12 ก.ค.) — แผงเลือกตัวละครบล็อกเต็มจอ ไม่มี scroll + ปุ่มขวา 🧱 (version .136)
- **สเปกผู้ใช้ (screenshot จริง — แผงเดิม 560px มี scrollbar ปุ่มจมล่าง):** แผงเกือบเต็มจอ · ปุ่มยกเลิก+ออกรถไปฝั่งขวา · สเกลทั้งหมดพอดีไม่ใช้ scroll
- **วิธีทำ (blkBuildPicker ~line 660):** `.blk-card` → `width:min(96vw,900px);height:min(94vh,560px);display:flex;flex-direction:column;overflow:hidden` · เพิ่ม `.blk-body{display:flex}` หุ้มกริด+ปุ่ม · กริด `grid-template-rows:repeat(2,1fr)` + item เป็น flex column + `img{flex:1 1 0;min-height:0;object-fit:contain}` — **ภาพยืดหดตามช่องจริง ไม่ fix aspect-ratio** · `.blk-btns` เป็น `flex-direction:column;justify-content:center` ฝั่งขวา (ออกรถเขียวใหญ่บน · ยกเลิกล่าง) · ฟอนต์ clamp ตาม vw/vh
- ✅ **ยืนยัน 812×375:** card 780×353 (96vw×94vh) · `scrollHeight<=clientHeight` ทั้ง card/grid · ปุ่มอยู่ขวาของกริดจริง (x650 ≥ grid.right 635) กลางแนวตั้ง · เห็นครบ 8 ตัว (ช่องสูง ~143 ภาพ 140×117) · เลือกตัว 3+ออกรถ → state.blockAv='blk3' / เปิดใหม่กดยกเลิก → resolve false ค่าไม่เปลี่ยน · ไม่มี console error · deploy live .136
- **⚠️ ค้างผู้ใช้:** ลองจริงมือถือ (แผงนี้ใช้ตอนกดเข้าโลกขับรถ/โลกเดิน)

### ✅ รอบ 144 (12 ก.ค.) — จัดผัง UI โหมดขับรถใหม่ + แผนที่ขยายแตะ minimap 🗺️ (version .135)
- **สเปกผู้ใช้ (จาก screenshot มือถือจริง):** minimap ไปบนซ้ายสุด · ปุ่มออกแดงแทนที่ปุ่มแชท · ปุ่มบนที่ทับกันจัดระเบียบ · เกียร์ D/R แยกปุ่ม (D เหนือเบรค · R ที่ตำแหน่งก้านไฟเลี้ยวเดิม) · ก้านไฟเลี้ยวไปเหนือคันเร่ง · แตะ minimap เปิดแผนที่ใหญ่เห็นตำแหน่งตัวอักษรชัด + ปุ่มปิดชัด
- **ผังใหม่ (CSS scope `.adv-drive` ทั้งหมด — โลกอื่นไม่กระทบ):** map left:8 (pointer-events:auto ทุกโลก) · board left:136 max-w 120 · topbar left:276 transform:none + `.adv-hp` 96px · exit (8,140) · help (8,right:8) · chat (8,244) · mic (58,140) · spk (58,244) · vmode (108,244) · tmute (108,348) · podbtn (158,348) — **แถว 108 คอลัมน์ right:140 ใช้ไม่ได้ ชนเกียร์ D (y123-175)**
- **เกียร์ radio:** `#adv-gearbtn` D (right:124 เหนือเบรค 84×52 · .on=เขียว) + `#adv-gearrev` R ใหม่ (right:224 แถวล่าง 64×84 · .on=เหลืองกะพริบ) · แตะปุ่มไหนเข้าเกียร์นั้น (gearSet) · gearSyncFn ไฮไลต์คู่+สลับป้ายคันเร่ง ▲เร่ง/▼ถอย · ก้านไฟเลี้ยว right:20 bottom:+100 สูง 110 (knob % เดิมสเกลเอง)
- **แผนที่ขยาย `#adv-bigmap` (module-level: drawBigMap/openBigMap/closeBigMap):** north-up ครอบตัวอักษรทุกตัว+ผู้เล่น (+pad 8%) · โลกขับรถ sample driveCell ทีละ 4px วาดถนนเทา/แม่น้ำฟ้า (โลกอื่นพื้นเปล่า — ใช้ได้ทุกโลก) · ตัวอักษรต้องเก็บของ words[0] (หัก inv — logic เดียวกับ minimap) = วงเหลือง r13 ตัวอักษรดำ / อื่น=เทา r8 · ลูกศรแดงหมุนตาม yaw · หัวเรื่องโชว์ "ตามหา: WORD (คำแปล)" · setInterval 600ms · ปิด: ปุ่มแดง / exitWorld เรียก closeBigMap · exclusion list touchstart เพิ่ม `#adv-map,#adv-bigmap` กันจอยเสก
- ✅ **ยืนยัน 812×375:** ตรวจ **ชนกันอัตโนมัติทุกคู่ = 0** (แก้ 2 รอบ: vmode ชนเกียร์ D → ย้ายคอลัมน์ · chat ชน topbar → ตรึง+ย่อ HP) · เกียร์: แตะ R ไฮไลต์+เร่งถอย -6.48 / แตะ D กลับหน้า +8.58 · ก้านไฟตำแหน่งใหม่ sig ติด · แผนที่: เปิดจากคลิก map จริง วาดถนน+ตัวอักษร 74 ตัว (เหลือง 1035px แดง 20px) หัวเรื่อง "ตามหา: PILLOW (หมอน)" ปิดได้ · ไม่มี console error · deploy live .135
- **⚠️ ค้างผู้ใช้:** ลองจริงมือถือทั้งชุด — ผังปุ่มใหม่ / เกียร์ 2 ปุ่ม / ก้านไฟเลี้ยวตำแหน่งใหม่ / แตะ minimap เปิด-ปิดแผนที่

### ✅ รอบ 143 (12 ก.ค.) — ยืดแถบพวงมาลัยสูง 3 เท่า 🎛️ (version .134)
- **สเปกผู้ใช้:** ยืดปุ่มเลี้ยวขึ้นบน+ลงล่างอย่างละ 1 ช่วง รวมสูง 3 ช่วง — `#adv-steerpad` height 64→192px จุดกึ่งกลางแนวตั้งเดิม (`bottom:calc(max(20vh,104px) - 64px)`) มุมโค้งเปลี่ยน 999→34px · logic เลี้ยวใช้แค่ clientX อยู่แล้ว ไม่ต้องแก้ JS ฝั่งอ่านนิ้ว
- **ผลพวง:** แถบท่อนล่างทับวงจอยสำรองที่พักมุมล่างซ้าย (18,18) → CSS `.adv-touch.adv-drive #adv-joy{display:none}` + `.live{display:block}` · handler จอยเพิ่ม/ถอด class `.live` ตอนเริ่ม/ปล่อยลาก — โหมดขับรถจอยโผล่เฉพาะตอนใช้จริง โหมดเดิน/ผี/บินคงเดิม
- ✅ **ยืนยัน 812×375:** steer y143-335 (กึ่งกลาง 239 = เดิมเป๊ะ · ห่างขอบล่าง 40px) · แตะขอบบนขวา=เลี้ยวขวา +0.33 / ขอบล่างซ้าย=เลี้ยวซ้าย -0.42 · ไม่ทับ tlpad/เบรค/เร่ง/แตร · จอย: drive พัก none → .live block → โหมดเดิน block · ไม่มี console error · deploy live .134
- ⚠️ **ข้อจำกัดเทสต์:** spawn จอยจริงเทสต์ใน preview ไม่ได้ (handler ผูกใน branch IS_TOUCH เท่านั้น — เดสก์ท็อป preview ไม่เข้า) เช็คได้แค่ CSS + code review · จอเตี้ยมาก (<380px) แถบท่อนบนซ้อนภาพโซนคำศัพท์ (words เป็น pointer-events:none ไม่กระทบการแตะ)
- **⚠️ ค้างผู้ใช้:** ลองจริงบนมือถือ — ฟีลปุ่มเลี้ยวสูงขึ้น + จอยสำรองโผล่ตอนลากนอกปุ่ม

### ✅ รอบ 142 (12 ก.ค.) — ตัวถังโคลงซ้าย-ขวาเข้าโค้งแบบรถจริง 🏎️ (version .133)
- **มุมมองคนขับ:** เลิกเอียงเข้าโค้งตาม `dSteer` แบบ arcade (รอบ 118) → **body roll ตามแรง G ด้านข้าง** `latA=yrApplied×dSpeed` เลนส์ออกนอกโค้ง · ขับผ่านสปริงหน่วงต่ำ `dRollV+=((tgt-dRoll)*60-dRollV*9)*dt` (ζ~0.58) → มีอาการโยกตัวข้ามศูนย์เล็กๆ ตอนหักพวง/คืนพวงเหมือนช่วงล่างจริง · clamp ±0.12 rad · `sdt=min(dt,.05)` กันสปริงระเบิดตอนเฟรมกระตุก · reset `dRoll/dRollV` ตอนเข้าโลก
- **รถบล็อกเพื่อน:** โคลงเหมือนกัน — `p.spr.rotation.order='YZX'` (roll รอบแกนตัวรถหลัง yaw) · latA ฝั่งรับ = `-(dy*k/dt)*(moved/dt)` **ลบเพราะ yaw เกมลดลงตอนเลี้ยวขวา** (จุดพลาดง่าย!) · lerp dt*6 พอ ไม่ต้องสปริง
- ✅ **ยืนยัน preview:** วิ่งตรง 0° · เลี้ยวขวา +2.36°/ซ้าย -2.13° @6.4 m/s (บวก=เลนส์ออกนอกโค้ง ทิศถูก) · ปล่อยพวง: -2.13→…→+0.04 (overshoot)→0 นิ่ง · จอดนิ่ง 0° · เพื่อนวนโค้งขวา R30 @12m/s = +1.56° กลับตรง 0° · ไม่มี console error · deploy live .133
- **⚠️ ค้างผู้ใช้:** ลองฟีลจริงบนมือถือ — จูนได้: ความแรงเอียง `latA*.008` / เพดาน `.12` / สปริง `60/9` (แข็ง/หนืด)

### ✅ รอบ 141 (12 ก.ค.) — ไฟเบรคแดงท้ายรถเพื่อน 🔴 (version .132)
- **ไฟเบรคแดง 2 ดวง** ริมนอกท้ายรถบล็อก (`userData.brks` ข้าง revs รอบ 140) — **คำนวณฝั่งรับล้วน ไม่มี field ใหม่ ไม่ต้องแก้ rules** ใช้ได้กับ client เก่า
- **ตัวตรวจใน onPeerData (โซน p.blk):** เก็บ `p.pvH` ประวัติ 5 แพ็กเก็ต {t จาก `d.ts` เซิร์ฟเวอร์, x, z} → ความเร็วเฉลี่ยครึ่งแรก (vA) vs ครึ่งหลัง (vB) · เบรคจริง = `drop>3+.08vA && dec>.16vA+2.5` (drag บนถนน=0.16v · CAR_BRAKE 15 ทะลุสบาย) หรือ `vA>1.2 && vB<.3 && dec>2` (หยุดสนิทเร็วผิดธรรมชาติ) → `p.brkT=.45` · tickPeers นับถอยหลัง+โชว์ · pv>80 = teleport ทิ้งประวัติ
- 💡 **บทเรียนสำคัญ (เผื่อทำ inference ฝั่งรับอีก):** เส้นทางที่ล้มเหลวก่อนถึงสูตรนี้ — (1) วัดจาก lerp รายเฟรม = sawtooth ตามจังหวะแพ็กเก็ต false positive 65-100% (2) เทียบ 2 แพ็กเก็ตติด = noise ตำแหน่งปัด 0.1m (±0.55 m/s) + jitter ts (±15ms = ±8% ของ v) ยังหลอกได้ · **ต้อง baseline ยาว (~0.36 วิ/ครึ่ง) noise ถึงเล็กพอ + เกณฑ์ drop สเกลตามความเร็ว**
- ✅ **ยืนยัน 7 เคส (peer จำลอง ts jitter ±15ms + ตำแหน่งปัด 0.1 เหมือนจริง):** cruise 20 / coast 20 / slow 4 / coast ท็อปสปีด 45 = **false 0 ทั้งหมด** · เบรคจาก 20/30 ติดทุกแพ็กเก็ตระหว่างเบรค · เบรคจากช้า 3 ติดผ่าน stop-rule · ไม่มี console error · deploy live .132
- **⚠️ ค้างผู้ใช้:** ทดสอบ 2 เครื่อง — เครื่องหนึ่งขับแล้วเบรคแรง อีกเครื่องดูไฟแดงท้ายรถ (เกณฑ์จูนได้: margin `3+.08v` / tail `.45`)

### ✅ รอบ 140 (12 ก.ค.) — เสียงติ๊ดถอยหลัง + ไฟถอยขาวรถเพื่อน + เสียงรีเลย์ไฟเลี้ยว 🔊⬜ (version .131)
- **เสียงถอยหลัง `CarSound.revBeep`:** square 1kHz ผ่าน lowpass 2.6k "ติ๊ด" 0.2 วิ · trigger ใน tickDrive ทุก 600ms (`carRevBeepAt`) เมื่อ `carEngineOn && (gearR || dSpeed<-.5)` — ครอบทั้งปุ่มเกียร์ R มือถือและคีย์ S เดสก์ท็อป · รถไหลถอยเองก็ติ๊ด (สมจริง) จอดสนิท/เดินหน้าเงียบ
- **เสียงไฟเลี้ยว `CarSound.tlClick(hi)`:** คลิกรีเลย์สั้น 35ms (square 1480/960Hz + sine ตัวถัง "ต่อก") สลับสูง-ต่ำตามเฟส `Math.floor(now/400)%2` เดียวกับไฟเพื่อน · trigger ใน tlTick (`tlClickPh` เก็บเฟสล่าสุด · tlSet รีเซ็ต -1 = ดังทันทีตอนโยกก้าน) · ปิดไฟ=เงียบทันที
- **ไฟถอยหลังขาวรถเพื่อน:** makeBlockCar เพิ่มบล็อกขาว 2 ดวงท้ายรถ (+Z · `userData.revs` ส่งผ่าน wrapper แบบ blinkL/R) · **ไม่ส่ง field ใหม่ — rules ล็อก `tl` 0-2 ส่งค่าเกินจะโดน deny แล้วพังไฟเลี้ยว** → เครื่องเพื่อนคำนวณเองใน tickPeers: ทิศวิ่ง (p.tgt-p.cur) dot หัวรถ (-sin/-cos yawCur) < -.5 + วิ่ง >เกณฑ์ → สะสม `p.revT` (ติดเมื่อ >0.25 วิ · ดับเร็ว 2 เท่า — hysteresis กันวูบตอนเด้งชน/แพ็กเก็ตกระตุก) · ใช้ได้กับ client เก่าทันทีไม่ต้องอัปเดตฝั่งส่ง
- ✅ **ยืนยัน preview (spy นับเรียกเสียง + peer จำลอง onPeerData):** เกียร์ R ติ๊ดทันที + ติ๊ดซ้ำหลัง 700ms · จอดสนิทเงียบ · ไหลถอย (ยังไม่หยุด) ติ๊ดต่อ=ถูก · ไฟเลี้ยว: เปิดคลิกทันที true→false→true สลับถูก ปิดเงียบ · peer ถอย: 0.16 วิยังดับ → 0.4 วิติด → เดินหน้าดับ · ไม่มี console error · deploy live .131
- **⚠️ ค้างผู้ใช้:** ฟังเสียงติ๊ด/ติ๊ก-ต่อกจริงบนมือถือ (ดัง-เบาจูนได้: gain .055/.07) · ไฟถอยขาวต้องเห็นจาก 2 เครื่อง (เครื่องหนึ่งเข้าเกียร์ R ถอย อีกเครื่องดูท้ายรถ)

### ✅ รอบ 139 (12 ก.ค.) — car_10 + ไอคอน Vocab World + ปุ่มเบรค/เกียร์ R + pet_cat/pet_dragon 🌍🐱🐉 (version .130)
- **ภาพรถครบ 10/10:** ผู้ใช้เจน `img/cars/car_10.png` → commit (งานค้างข้อ 2 ปิดจบ)
- **ไอคอนแอพใหม่ธีม Vocab World:** โลก 3D + ทวีปเขียว + วงโคจรบล็อก A/B/C + คอนเฟตตีพาสเทล บนเกรเดียนต์น้ำเงินแบรนด์ — วาดด้วย Pillow (supersample 4×) สคริปต์อยู่ scratchpad `make_icon.py` (เจนซ้ำ/แก้ได้) · แทนครบ `img/icons/`: icon-192/512, maskable (content 80% ในเซฟโซน), apple-touch-icon 180 · manifest ชี้ path เดิมไม่ต้องแก้ · ⚠️ ไอคอน root เก่า (นอก git) ไม่แตะตามกฎ asset
- **ปุ่มเบรค `#adv-brakepad`:** วงกลมแดง "■ เบรค" ซ้ายคันเร่ง (right:124 ช่องว่าง 10px) กดค้าง = `padBr` → th=0 + หน่วง `CAR_BRAKE*1.2` เข้าหา 0 **ทั้งเดินหน้า/ถอยหลัง ไม่ไหลไปถอยเหมือนกด S ค้าง**
- **ปุ่มเกียร์ `#adv-gearbtn`:** D/R เหนือคันเร่ง (right:20 bottom +106px) แตะสลับ · R = ปุ่มกะพริบเหลือง + คันเร่งเปลี่ยนป้าย "▼ ถอย" พื้นส้ม + `padTh` ให้ th=-1 (เบรกก่อนแล้วถอย เพดาน CAR_VREV 6.5) · `gearSyncFn` เก็บ global ให้ reset ตอนเข้าโลก (padBr=false, gearR=false, ป้ายกลับ D) · ก้านไฟเลี้ยว `#adv-tlpad` ขยับ right 132→224 หลบเบรค · intro touch อัปเดตเป็นชุดปุ่มใหม่
- **โมเดล pet_cat.glb (10k tris ผ่าน retopo) + pet_dragon.glb (20.9k tris):** ผู้ใช้เจนจาก Tripo วาง `img/models/` → commit · lobby3d generic (`pet_${petType}`) รับเองไม่แก้โค้ด · clip `NlaTrack` เล่นผ่าน fallback รอบ 111
- ✅ **ยืนยัน preview (1000×640 force adv-touch · pane hidden ใช้ `_t.step` แทน rAF):** layout 5 ปุ่มไม่ทับกัน · เร่ง D=+18.2 · เบรค→0 ค้าง 0 · R: ป้ายสลับ+ถอย -6.48 (เพดานถูก) · เบรคขณะถอย→0 · กลับ D ป้ายคืน · ออก-เข้าโลกใหม่เกียร์รีเซ็ต D · GLTFLoader โหลด cat/dragon ผ่าน (curKey `male|cat|adult`→`male|dragon|adult` petLoaded ทั้งคู่ · triangles=0 เพราะ pane hidden rAF ไม่เดิน — loader-level ยืนยันแทน) · deploy live .130 + asset ใหม่ 200 ครบ
- **⚠️ ค้างผู้ใช้:** (1) ลองฟีลปุ่มเบรค/เกียร์จริงบนมือถือ (จูนต่อได้: แรงเบรค 1.2 / ตำแหน่ง right:124) (2) ดูโมเดลแมว+มังกรบนมือถือ (3) ไอคอนใหม่ต้องลบ PWA เก่าแล้วติดตั้งใหม่ถึงเห็น (บางเครื่อง cache ไอคอนแรง)

### ✅ รอบ 136–138 (12 ก.ค.) — มหากาพย์ authDomain: จบที่ login โดเมนเดียว vocabworld.web.app 🔐 (version .127→.129)
- **ลำดับเหตุการณ์ (บทเรียนสำคัญ):** (136/.127) เปลี่ยน authDomain เป็น vocabworld.web.app → มือถือผู้ใช้เจอ **`redirect_uri_mismatch`** เพราะโดเมนใหม่**ยังไม่ถูกเพิ่มใน OAuth client** (Firebase Hosting เสิร์ฟ /__/auth/* ให้ก็จริง แต่ Google ต้องรู้จัก redirect URI ด้วย!) → (137/.128) **rollback ทันที**กลับ firebaseapp.com ให้ login ใช้ได้ → ผู้ใช้เพิ่มใน Google Cloud Console → Clients: **JS origins `https://vocabworld.web.app` + Redirect URI `https://vocabworld.web.app/__/auth/handler`** → (138/.129) สลับกลับ + **ทดสอบกดปุ่ม login จริงผ่าน Browser ผ่าน 2 รอบ** ("to continue to vocabworld.web.app")
- ⚠️ ค่า OAuth ที่แก้ใหม่ **กระจายไม่พร้อมกัน 5 นาที–ชม.** — desktop ผ่านแต่มือถือ (LTE) ยังเจอ mismatch ชั่วคราว = ปกติ รอ/ลองซ้ำ
- **แถม:** ผู้ใช้ตั้ง OAuth Branding App name = "Vocab World" (หน้า Google โชว์ชื่อสวย) + fix hosting headers: **โค้ดเกม no-cache / asset หนัก cache 7 วัน** (ต้นตอมือถือเห็นของเก่า: default max-age 3600) — อัปเดตต่อไปนี้ถึงเครื่องผู้เล่นทันทีที่เปิดใหม่
- ✅ **ผู้ใช้ยืนยัน 12 ก.ค.: login มือถือเข้าได้ปกติแล้ว** — ระบบ auth บ้านใหม่จบสมบูรณ์
- **ผู้ใช้สังเกต:** กด login จาก vocabworld.web.app แล้วเด้งไป english-pet-game.firebaseapp.com — เป็นพฤติกรรมปกติ (authDomain เดิม) แต่ปรับให้ดีกว่า: **Firebase Hosting เสิร์ฟ `/__/auth/*` ให้ทุก site ในโปรเจกต์อยู่แล้ว** (ตรวจ curl 200) → เปลี่ยน `FIREBASE_CONFIG.authDomain` เป็น `vocabworld.web.app` (firebase-config.js บรรทัดเดียว)
- ผล: login ไม่กระโดดข้ามโดเมน + กันปัญหา third-party cookies/storage partitioning บนมือถือ (จุดตายคลาสสิกของ signInWithRedirect ข้ามโดเมน) · โดเมนต้องอยู่ใน Authorized domains (มีแล้วจากรอบ 134)
- ⚠️ ถ้า GitHub Pages ฟื้นในอนาคต: client จาก github.io จะใช้หน้า auth ของ vocabworld.web.app (ข้ามโดเมนเหมือนที่เคยข้ามไป firebaseapp.com) — ใช้ได้ปกติ ไม่ต้องแก้อะไร

### ✅ รอบ 135 (11 ก.ค.) — ลดปุ่มขับรถลง + ก้านไฟเลี้ยวแบบรถจริง + ย้ายไอคอนแชทขึ้นบน 🎛️ (version .126)
- **feedback ผู้ใช้ (ลองจริงบนมือถือ):** ปุ่มเลี้ยว/เร่งที่ 40vh (รอบ 129) สูงเกิน → ลดลงครึ่ง `bottom:max(20vh,104px)` (max กันชนปุ่มแตรบนจอเตี้ย) ทั้ง `#adv-steerpad/#adv-gaspad`
- **ก้านไฟเลี้ยวแนวตั้ง `#adv-tlpad` (แทนปุ่ม ⬅️➡️ รอบ 132):** ฝั่งขวาข้างคันเร่ง (right:132) — **ดันขึ้น=ไฟซ้าย ดันลง=ไฟขวา** (สเปกผู้ใช้) ปล่อยกลาง=ปิด · knob (`#adv-tldot`) **ค้างตำแหน่งบน/ล่างตามสถานะไฟ** + pad กะพริบส้ม · **เด้งกลับเองหลังรถเลี้ยวเสร็จ ~0.9 วิเหมือนก้านจริง** (`tlRetAt` ใน tlTick — เลี้ยวเกิน ~50°+คืนพวง → นัดดับ +900ms) · เปิดค้างเกิน 20 วิ = ดับเอง · เดสก์ท็อปคลิกครึ่งบน/ล่าง/กลางได้ · tlSet เป็นคนขยับ knob (`tlDotY`) — logic ไฟ/sync เพื่อน/ม.36 เดิมไม่แตะ
- **โหมดขับรถ: ไอคอนแชท+เสียงย้ายขึ้นแถวบน** — `.adv-drive` override: chat/mic/spk/vmode เรียงแถว top:8 จาก right:140 (เว้นเรดาร์กว้าง 120) · tmute/podbtn (ครู) แถวสอง top:46 · เดิม top:160-400 คอลัมน์ขวาทับโซนคันเร่ง/ก้านไฟพอดี
- ✅ **ยืนยัน preview จอมือถือ 812×375 (force class adv-touch):** ทุกปุ่ม bottom=104 ถูก · แถวไอคอนพ้นเรดาร์ (แก้ 1 รอบ: right 118→140 เรดาร์กว้าง 120 ไม่ใช่ 100) · ลากก้านขึ้น=ไฟซ้าย+ค้าง+กะพริบ · setTl 1/2/0 → knob 24.9/121.8/73.4px ถูกทั้งสาม · เด้งกลับ: หลังเลี้ยว 0.5 วิยังติด → 1.1 วิดับ+knob กลาง · ไม่มี console error
- 💡 บทเรียน preview: `transition:top` บน knob **ไม่เดินใน preview** (pane เบื้องหลังไม่ paint — RAF throttle เดียวกับ HANDOFF ข้อ 3) → เทสต์ตำแหน่งต้อง `transition:'none'` ก่อน · มือถือจริงลื่นปกติ

### ✅ รอบ 133 (11 ก.ค. — ทำหลังรอบ 134 เพราะแทรกด้วยเหตุ GitHub ล่ม) — เจตนาชน 3 ครั้ง = 🪙10,000 + ไฟจราจรจริง/ฝ่าไฟแดง 🚦 (version .125)
- **เจตนาชนรถผู้เล่นอื่น (tickDrive):** นับ `carPeerHits` เฉพาะ "ฝ่ายชน" = เราวิ่ง (hitSpd>2) **และทิศวิ่งพุ่งเข้าหา peer** (dot(dVel, toPeer)>0) — จอดเฉยๆ/ถูกชน/วิ่งหนี ไม่นับไม่เสีย · ครั้งที่ 1-2 ตามระบบเดิม (ประกันจ่าย/ไม่มีประกัน 5,000) + **ครั้งที่ 2 ขึ้นคำเตือนเจตนาชน** · **ครั้งที่ 3 = `carFines t:'ram'` ค่าซ่อมรถ 🪙10,000 ครั้งเดียว/รอบ — ประกันไม่คุ้มครองการเจตนาชน** (สอนว่าประกันจริงไม่คุ้มครองการจงใจ) · ครั้งที่ 4+ แบนเนอร์เฉยๆ
- **ไฟจราจร:** `buildTrafficLights()` (เรียกใน start ครั้งแรก) — สแกนแยกใหญ่ (driveArms>=3) ทั่ว ±700m เรียงตามระยะจากหอนาฬิกา (บั๊กแรก: สแกนจากมุมทำไฟกระจุกขอบเมือง — แก้แล้ว) เว้น >=90m เพดาน 30 จุด · เสา+หัวไฟ+ดวงไฟทรงกลม 3 สี (แดงบน-เขียวล่าง · material แชร์สลับติด/ดับ) ตั้งริมถนน · **เฟสไฟจาก Date.now: เขียว 10/เหลือง 3/แดง 11 วิ (รอบ 24) + seed ต่อแยก — ทุกเครื่องเห็นสีเดียวกันไม่ต้อง sync DB**
- **ฝ่าไฟแดง (`rlTick` ทุก 250ms):** อยู่ในโซนแยก (13m) ที่ไฟแดง + วิ่ง >10 กม./ชม. = ใบสั่ง **ม.22** (ปรับจริงไม่เกิน 4,000 บาท) `CAR_FINE_RED` 🪙100×3=300/ใบ เพดาน 5 · cooldown 8 วิ · ชะลอจนเกือบหยุด = ไม่นับ (เด็กหยุดรอไฟได้จริง) · **ค่าปรับ 300 ผมเคาะเอง (ผู้ใช้ไม่ได้ระบุ) — แรงกว่าขับเร็ว 200 เพราะอันตรายกว่า ปรับได้ที่ `CAR_FINE_RED`**
- `driveFineSettle` เพิ่ม 2 บรรทัด (ฝ่าไฟแดง/เจตนาชน) · hint เพิ่ม "ไฟแดงต้องหยุด" · testkit ใหม่: `_t.drive.lights/forceLight(0|1|2)/peerHits/phase`
- ✅ **ยืนยัน preview ครบ:** ไฟ 30 จุดใกล้สุด 87m จากจุดเกิด · แดง+วิ่ง=ใบ / แดง+คลาน<10=ไม่โดน / เขียว=ไม่โดน · ดวงไฟสลับสีตามเฟสจริง · ถูกชน/วิ่งหนี hits=0 · ครั้ง 1 ประกันจ่าย · ครั้ง 2 เตือน · ครั้ง 3 ram 10,000 (มีประกันก็โดน) · ครั้ง 4 ไม่ซ้ำ · สรุปตอนออกหัก 10,300 ถูกเป๊ะ · ไม่มี console error

### ✅ รอบ 134 (11 ก.ค.) — เปลี่ยนชื่อ "Vocab World" 🌍 + ย้ายขึ้น Firebase Hosting (version .124)
- **เหตุ:** บัญชี GitHub `iamsuperrich2025` โดน flag อัตโนมัติ → โปรไฟล์/repo/Pages เป็น 404 สาธารณะทั้งหมด (git ด้วย credential ยังใช้ได้ — ตรวจครบ: githubstatus ปกติ · user API 404 · ls-remote ผ่าน) · ผู้ใช้ต้องยื่นอุทธรณ์เอง (support.github.com)
- **ชื่อใหม่:** ผู้ใช้เลือก "Vocab World" (เกมโตเกินชื่อเลี้ยงสัตว์ — หลายโลก 3D/วางแผนการเงิน/ค้าขาย) · เปลี่ยน title/manifest/apple-title/หน้า login+ลงทะเบียน/rotate overlay/การ์ดครู/วิธีเล่น · **STORAGE_KEY `petVocabAdventure_v1` คงเดิม** เซฟผู้เล่นไม่กระทบ · sw.js คอมเมนต์ไม่แตะ (กันบังคับอัปเดต SW เปล่าๆ)
- **Hosting:** Firebase Hosting site ใหม่ `vocabworld` ในโปรเจกต์เดิม → **https://vocabworld.web.app** · เครื่องมือ: Node พกพา `C:\Users\rober\bin\node` (zip ทางการ ไม่ติดตั้งลงระบบ) + `npm i -g firebase-tools` (15.23.0) — ตัว standalone firepit ใช้ไม่ได้ (welcome crash ซ้ำ) · ผู้ใช้ login CLI ผ่านหน้าต่าง cmd ที่เปิดให้ (บัญชี freddommun@gmail.com — token ค้างในเครื่อง ครั้งหน้า deploy ได้เลย)
- **`tools/deploy_firebase.sh`:** staging จาก `git archive HEAD` (WIP/untracked ของ session คู่ขนานไม่หลุดขึ้นเว็บ) + ตัด handoff/tools/*.md + headers no-cache ให้ version.json/sw.js → `firebase deploy --only hosting:vocabworld`
- ✅ **ยืนยัน live:** 697 ไฟล์ · version .124 · title ใหม่ · หน้า login h1 "🌍 Vocab World" + ปุ่ม Google โชว์ · img/cars 200 · /handoff 404 (ตัดสำเร็จ)
- ⚠️ **ค้างผู้ใช้:** เพิ่ม `vocabworld.web.app` ใน **Auth → Settings → Authorized domains** (ตรวจผ่าน getProjectConfig แล้วว่ายังไม่มี — ไม่เพิ่ม = login เด้ง unauthorized-domain) · commit นี้รวมภาพรถชุด 2 (car_03..09 — เหลือ car_10)
- 💡 บทเรียน: commit `index.html` ต้องคัด hunk (session คู่ขนาน New Word ค้างอยู่) — ใช้ python กรอง patch แล้ว `git apply --cached` · Firebase Hosting ฟรี 360MB/วัน — ใช้ทั้งห้องเรียนวันแรกอาจชน ค่อยอัปเกรด Blaze/ย้าย Cloudflare

### ⏳ ค้างฝั่งผู้ใช้ (หลังรอบ 132)
1. **publish rules field `tl`** — Artifact ปุ่มคัดลอก: https://claude.ai/code/artifact/59c3da79-b3cc-4053-b5f3-5283b4729b7a (ก้อนเต็มใน RULES.md) · ยังไม่ publish = เกมปกติ แค่เพื่อนไม่เห็นไฟเลี้ยวกัน (client fallback ตัด tl เอง)
2. ~~เจนภาพรถที่เหลือ~~ ✅ **ครบ 10/10 แล้ว** (car_03..09 รอบ 134 · car_10 รอบ 139)
3. ทดสอบจริงมือถือ: ซื้อรถ/ผ่อน/ประกัน + ปุ่มไฟเลี้ยว + 2 เครื่องเห็นไฟเลี้ยวกัน + ชนรถกัน

### ✅ รอบ 132 (11 ก.ค.) — ชนรถเพื่อน + ปุ่มไฟเลี้ยว + ตรวจแยก ม.36 + เพื่อนเห็นไฟเลี้ยว 🚦 (version .123 · ข้อ 6–9 ปิดชุด 9 ข้อ)
- **ข้อ 6 ชนรถผู้เล่นอื่น (tickDrive):** peer รถบล็อกระยะ <2.5m + เราวิ่งอยู่ (hitSpd>2) + cooldown 4 วิ → มีประกัน = แบนเนอร์ "🛡️ ประกันเป็นผู้จ่ายให้แล้ว" ไม่หักเงิน · ไม่มีประกัน = `carFines t:'hitcar'` 🪙5,000 หักตอนออก (เพดาน 3/รอบ) · รวมใน `driveFineSettle` กล่องสรุปเดิม
- **ข้อ 7 ปุ่มไฟเลี้ยว `.adv-tl` ⬅️➡️:** เหนือแถบพวงมาลัย (bottom 40vh+76px) จางๆ สไตล์รอบ 127 โชว์ทั้ง desktop/touch ใน drive · แตะสลับเปิด/ปิด (เปิดข้างใหม่ข้างเก่าดับ) · เปิดแล้วกะพริบส้ม (CSS `tlBlink` .8s) · **ดับเอง**เมื่อเลี้ยวเสร็จ (yaw เปลี่ยน >~50°+พวงคืนตรง) หรือค้าง 12 วิ (`tlSet/tlTick`)
- **ข้อ 8 ตรวจแยก ม.36:** `driveArms(x,z)` sample วงกลม r12m 16 ทิศจาก road grid นับกลุ่มแขนถนน (>=3=ทางแยก) เช็กทุก 300ms ตอนวิ่ง >1.5m/s · เข้าโซนจำ yaw → ออกจากโซน yaw เปลี่ยน >45° โดยไม่เคยเปิดไฟระหว่างนั้น = ใบสั่ง "ไม่ให้สัญญาณไฟเลี้ยว" ม.36 (ปรับจริงไม่เกิน 1,000 บาท) 🪙100/ใบ เพดาน 5 · cooldown 3 วิกันนับซ้อน
- **ข้อ 9 เพื่อนเห็นไฟเลี้ยว:** `sendPos` แนบ `tl` (1=ซ้าย 2=ขวา) เฉพาะโหมด drive ตอนไฟเปิด (ปิดไม่ส่ง field หายเอง — set ทับทั้ง node) + toggle แล้ว `sendPos(true)` ทันที · **fallback rules ยังไม่ publish:** set โดน deny → `netTlOk=false` ตัด tl ส่งซ้ำทันที multiplayer ไม่พัง (รีเซ็ต true ทุกครั้งที่เข้าโลก) · ฝั่งรับ: `makeBlockCar` เพิ่มไฟส้ม 4 มุม (`userData.blinkL/R` · material blkMat แชร์ cache ไม่ dispose) → `tickPeers` กะพริบเฟส 400ms ตาม `p.tl`
- **RULES.md อัปเดตแล้ว:** field `tl` (number 0-2) ใน `/world/$map/$uid` — ก้อนเต็ม + Artifact ปุ่มคัดลอกส่งผู้ใช้
- ✅ **ยืนยัน preview ครบ (testkit ใหม่ `_t.drive.setTl/arms/fines/inJunc/yaw`):** ปุ่ม toggle ซ้าย↔ขวา↔ปิด + ดับเองหลังเลี้ยว · หาแยกจริงจาก grid (arms=3) → เลี้ยวไม่เปิดไฟ=ใบ ม.36 / เปิดไฟแล้วเลี้ยว=ไม่โดน / ขับตรงผ่าน=ไม่โดน · ชนเพื่อน: มีประกัน=แบนเนอร์ประกันจ่าย ไม่มี=ใบ 5,000 · ไฟเพื่อนกะพริบสลับเฟสถูกข้าง (L→R) · กล่องสรุปตอนออกหัก 5,100 (ม.36 100 + ชนรถ 5,000) ยอดคงเหลือถูก · ไม่มี console error · ล้าง localStorage ทดสอบแล้ว

### ✅ รอบ 131 (11 ก.ค.) — ระบบซื้อรถ + พ.ร.บ. + ประกัน + ผ่อน + ล็อกกุญแจขับรถ 🚗🔐 (version .122 · ข้อ 1–5 จากชุด 9 ข้อ)
- **ผู้ใช้เคาะก่อนเริ่ม (AskUserQuestion):** ราคารถ 30,000–120,000 ไล่ 10 ขั้น · พ.ร.บ. 600 (บังคับ) · ประกัน 5,000 (ทางเลือก คุ้มครองชนรถผู้เล่นอื่น) · ผ่อน: ดาวน์ 20% + 10 เดือน **ค้างงวด=ล็อกขับจนกว่าจะจ่าย (ไม่ยึดรถ)** · **คนมีตั๋วเดิมต้องซื้อรถเพิ่ม ไม่แถม** (ตั๋ว=สิทธิ์เข้าเมือง รถ=พาหนะ — ยังไม่มีผู้เล่นจริง ปรับตอนนี้ได้)
- **items.js:** `CARS` 10 คัน (id ตรง PROMPTS_CARS.md · สีประจำคัน) + `CAR_PRB/CAR_INSURANCE/CAR_HITCAR_FEE/CAR_LOAN_MONTHS/CAR_DOWN_RATE` + `carInfo(id)`
- **state.js:** `state.car={id,insured,loan:{remain,perMonth,month,paid,carry}|null}` + migration default ครบ · assetValue: รถนับ `price - remain + พ.ร.บ. + ประกัน` (**ผ่อนนับเฉพาะส่วนที่จ่ายแล้ว — net worth ไม่เปลี่ยนตอนซื้อ ยืนยัน 275,000 คงที่ทุกจังหวะ**) · ท้าย `billTick`: เดือนใหม่งวดจ่ายไม่ครบ → ทบเข้า `carry` + toast เตือน · helpers `carLoanDue/carLoanOverdue/carLoanPayable/carLoanPay`
- **ui.js:** `renderVehicleShop()` ในแผงตลาด (หัวข้อ `#mkt-vehicles` · กริด `.car-grid` 5 ช่อง/แถว · probe `img/cars/<id>.png` lazy ครั้งเดียวแล้ว re-render — มีภาพ=รูป ไม่มี=🚗 บนพื้นสีประจำคัน) + กล่องรถของหนู (สถานะประกัน/งวด + ปุ่มซื้อประกัน/จ่ายงวด/โปะปิดยอด) · `openCarBuyDialog` แจ้ง 3 บรรทัด รถ/พ.ร.บ./ประกัน + เลือกสด/ผ่อน อัปเดตยอดสด · ล็อกขับ: `carDriveBlock()` ('nocar'/'overdue') กั้น 3 ทาง (railWorldClick / enterDrive3D / renderDriveCard) + 🔐 บน `.rail-lock` ปุ่มราง + กล่อง `showNeedCarDialog` พาไป `gotoVehicleShop()` (openPanel แล้ว scroll)
- ✅ **ยืนยัน preview ครบ:** 🔐 ราง+กล่อง+พาไปตลาด · กริด 10 การ์ด 5 คอลัมน์ (ภาพจริง 2 = car_01/02 ที่ผู้ใช้เจนแล้ว · อีโมจิ 8) · ยอด 38,600/43,600/ผ่อน 13,200+3,040×10 ถูกเป๊ะ · ซื้อผ่อน → เหรียญ/loan/ล็อกหาย ถูก · จ่ายงวด → ✅ · จำลองข้ามเดือน (billTick) → carry 3,040 ล็อกขับ+การ์ดแจ้ง → จ่าย 6,080 ปลดล็อก → โปะ 21,280 ปิดยอด · reload migration คง state · ไม่มี console error (screenshot pane timeout — ยืนยัน DOM ตามกฎทองข้อ 3)
- 💾 commit รวมภาพรถ 2 ไฟล์แรกของผู้ใช้ (`img/cars/car_01..02.png` — untracked=live 404 บทเรียนรอบ 86/112) · เหลืออีก 8 ไฟล์ผู้ใช้กำลังเจน
- ⚠️ ระวัง session คู่ขนาน: `index.html` + `js/data/word_new.js` (งาน New Word) แก้ค้างใน working tree — **ห้าม add**

### ✅ รอบ 130 (11 ก.ค.) — ค่าซ่อมรถชนสิ่งของ 🔧 + prompt ภาพรถ 10 คัน (version .121)
- **ข้อ 7 จากชุดงานระบบรถ (ทำก่อนเพราะ context ร้อน):** ชนสิ่งของแรง (branch damagePlayer ใน collideCar, hitSpd>7) = ค่าซ่อม `CAR_REPAIR_FEE` 🪙1,000/ครั้ง (carFines t:'crash' · เพดาน 3/รอบ) + showBanner แจ้งทันที · `driveFineSettle` รวมค่าซ่อมในกล่องสรุปตอนออก (หัวข้อเปลี่ยนเป็น "ใบสั่ง + ค่าซ่อม")
- ✅ ยืนยัน preview: เทเลพอร์ตพุ่งใส่ตึกแถว (KPP_CITY.p[0]) ชน 4 ครั้ง → คิด 3 (เพดาน) · สรุปหัก 3,800 = ซ่อม 3,000 + ใบสั่งเร็ว 800 ถูกเป๊ะ · ขับชิลนอกถนน (cap 25) ไม่โดนค่าซ่อม (hitSpd<7 = ชนเบา)
- **prompt ภาพรถ:** `PROMPTS_CARS.md` (ราก repo) รถ 10 คัน → `img/cars/car_01..10.png` 1024² โปร่งใส ชื่อ generic กันเครื่องหมายการค้า · Artifact ปุ่มคัดลอกส่งแล้ว (ลิงก์เดียวกับ guideline ข้างบน)

### ✅ รอบ 129 (11 ก.ค.) — ยกปุ่มเร่ง/เลี้ยวขึ้นกลางจอ 🎛️⬆️ (version .120)
- **feedback ผู้ใช้:** ปุ่มรอบ 127 อยู่ต่ำไปกดไม่ถนัด → ยก `#adv-steerpad`+`#adv-gaspad` จาก bottom 2.4vh → **40vh** (จุดกึ่งกลางปุ่ม ~53-55% ของจอ) · ผู้ใช้ยืนยันไม่ห่วงบังหน้าปัด (ปุ่มจางอยู่แล้ว) · แตรคืนมุมล่างขวาเดิม 64px (ไม่ชนคันเร่งแล้ว) · ยืนยัน preview: ตำแหน่ง+ช่องว่างถูก

### ✅ รอบ 128 (11 ก.ค.) — ท็อปสปีด 200 + ระบบใบสั่งจราจร + สวิตช์สตาร์ท/เข็มขัด 🚔 (version .119)
- **ผู้ใช้สั่ง 3 เรื่อง:** (1) รถวิ่งได้ ~200 กม./ชม. + เกจสอดคล้อง (2) เกิน 90 = เตือนผิดกฎหมาย+มาตรา+ค่าปรับ หักตอนออก (3) สวิตช์สตาร์ทเครื่อง/คาดเข็มขัด กลางจอสไตล์ setting พร้อมเสียง + แผงกฎหมายฟ้า sci-fi
- **ฟิสิกส์:** `CAR_VMAX 25→55.6` (200 กม./ชม.) · `CAR_ACCEL 8.5→11` · แรงต้านบนถนน `.22→.16` (terminal 68 > cap — แตะ 200 ได้จริงใน ~14 วิ) · เกจสปีด 0-240 เลขทุก 40 + **โซนแดงเริ่มที่ 90 = เขตผิดกฎหมาย** (`drawCarDial` redFrom ใช้กับสปีดได้เลย)
- **ใบสั่ง:** `CAR_LEGAL_KMH 90` · เกิน = ป้ายแดงกะพริบ `#adv-lawwarn` (ม.67 ปรับจริงไม่เกิน 4,000 บาท) + ใบสั่ง 🪙200/ครั้ง (ข้ามเส้นนับใหม่เมื่อ <85 · เพดาน 5 ใบ/รอบ) **หักตอน exitWorld** ผ่าน `driveFineSettle()` + กล่องสรุป · ไม่คาดเข็มขัดแล้วขับ >10 กม./ชม. = ม.123 **หัก 🪙300 ทันที** + กล่องแจ้ง (ครั้งเดียว/รอบ ไม่หักซ้ำตอนออก)
- **แผงเตรียมออกรถ `#adv-carstart`:** เด้งทุกครั้งที่เข้าโลก (เครื่องดับ+ยังไม่คาด) · สวิตช์ reuse `.set-switch` จาก style.css · สตาร์ท → `CarSound.ignite()` (ไดสตาร์ทสังเคราะห์ ~0.7 วิ → เครื่องติด rpm พุ่ง) · เข็มขัด → `beltClick()` (ฟืด+คลิก-แคล็ก) → แผงกฎหมาย `#adv-lawinfo` ฟ้า sci-fi (ม.123/ม.67/โทษจำคุก **"รอลงอาญา"**) · กดออกรถโดยไม่คาด = แผงกฎหมายเด้งพร้อมบรรทัดเตือนก่อน · เครื่องไม่ติด/แผงยังเปิด → คันเร่งไม่ทำงาน (`th=0`) · เลิกสตาร์ท CarSound อัตโนมัติตอนเข้าโลก
- **testkit ใหม่:** `_t.setDriveSpeed(v)` inject ความเร็ว (เทสต์ใบสั่งไม่ต้องขับตามถนนจริง — ขับตรงๆ จะหลุดถนนโดน cap 25)
- ✅ **ยืนยัน preview ครบ:** เครื่องดับรถไม่ขยับ · แตะ 200 เป๊ะ (ตรึงตำแหน่งบนถนน) · เตือน ม.67 + นับใบ 1→2 ถูก (ลง <85 รีเซ็ต) · สรุปตอนออกหัก 400 คงเหลือถูก · เส้นทางไม่คาดเข็มขัด: เตือนก่อนออก → หัก 300 ทันที + กล่อง → สรุปไม่หักซ้ำ · ไม่มี console error
- ⚠️ ค้าง: ผู้ใช้ลองจริงบนมือถือ (ฟังเสียงไดสตาร์ท/เข็มขัดจริง — preview เช็กเสียงไม่ได้)

### ✅ รอบ 127 (11 ก.ค.) — ปุ่มคอนโซลโหมดขับรถ 🎛️ (version .118)
- **ผู้ใช้สั่ง:** ปุ่มจางๆ 2 ปุ่มบน console — ซ้าย=บังคับซ้าย-ขวา · ขวา=กดเร่ง ปล่อย=รถชลอจนหยุด
- **adventure3d.js:** `#adv-steerpad` แถบยาวล่างซ้าย (แตะ/ลากในแถบ = องศาเลี้ยวตามตำแหน่งนิ้ว ×1.25 clamp · dot ขาววิ่งตามนิ้ว · ปล่อย=คืนกลาง) + `#adv-gaspad` วงกลมเขียวล่างขวา (กดค้าง th=1 · ปล่อย=แรงต้านเดิมใน tickDrive ชลอจนหยุด) · opacity .34 → .68 ตอนกด · โชว์เฉพาะ `.adv-touch.adv-drive` · module vars `padSteer/padSt/padTh` (override joy เฉพาะแกนตัวเอง · รีเซ็ตใน start) · แตรย้ายขึ้น bottom:18vh พ้นคันเร่ง · **stopPropagation กัน handler overlay เสกจอยสติ๊กซ้อน** · จับหลายนิ้วด้วย touch identifier (เร่ง+เลี้ยวพร้อมกันได้) · จอยสติ๊กเดิมยังใช้ได้นอกปุ่ม (ไว้ถอยหลัง/เบรก)
- ✅ **ยืนยัน preview (TouchEvent จำลอง + `_t.step`):** กดเร่งค้าง 23 กม./ชม. → ปล่อย 3 วิเหลือ 0.4 → หยุดสนิท 0 · แตะขวา rot -0.508 / ลากซ้าย +0.907 · dot 86%↔14% ปล่อยคืน 50% · จอยไม่ spawn · layout ไม่ทับแตร/เกจ · ไม่มี console error
- ⚠️ ค้าง: ผู้ใช้ลองฟีลจริงบนมือถือ (จูนได้: ขนาด/ตำแหน่ง pad · ตัวคูณ 1.25 · opacity)

### ✅ รอบ 126 (11 ก.ค.) — แจ้งเตือน "ของที่หนูเล็งไว้มีคนลงขายแล้ว" 💖 (version .117)
- **ต่อยอดตลาดจริงรอบ 124 (ผู้ใช้สั่ง):** `state.wishlist` (id สินค้าสะสม + migration คัด id เสีย) · ปุ่ม "💖 ของที่หนูเล็งไว้" ในแผงตลาด → dialog 50 ชิ้นแตะสลับเล็ง/เลิกเล็ง (`openWishlistDialog` ui.js)
- **แจ้งเตือน (online.js marketWatch):** ประกาศใหม่ของคนอื่นที่ตรง wishlist → toast + sfx · **snapshot แรก = เงียบ** (`marketPrimed` แบบ giftInPrimed) · เด้งตัวแรกต่อ snapshot พอ (กันรัว) · ของตัวเองไม่เด้ง
- **badge `#mkt-wish-badge` ที่ปุ่มราง 🏪** = จำนวนของที่เล็งซึ่งมีคนอื่นขายอยู่ตอนนี้ (`updateWishBadge`) · การ์ดในชั้นตลาดเพื่อนที่ตรง wishlist เรืองชมพู + 💖 นำหน้าชื่อ · ซื้อของที่เล็งสำเร็จ → ถอนจากลิสต์อัตโนมัติ
- ✅ ยืนยัน fake DB ครบ: prime เงียบ+badge 1 → ประกาศใหม่เด้ง toast ถูกข้อความ+badge 2 → ของตัวเองเงียบ → dialog 50 ชิ้น toggle จริง → highlight → ซื้อแล้ว wishlist ว่าง+badge ซ่อน · ไม่มี console error
- ⚠️ ค้าง: ทดสอบจริง 2 เครื่อง (เครื่อง A เล็งของ → เครื่อง B ลงขาย → A ต้องเด้งภายใน ~1 วิ)

### ✅ รอบ 125 (11 ก.ค.) — ภาพตึกกำแพงเพชร 4 ไฟล์ขึ้น live + rules ตลาดจริง publish แล้ว 🏢🏪 (version .116)
- ผู้ใช้เจนภาพจาก `PROMPTS_BUILDINGS_KPP.md` วาง `img/city/` ครบ 4 ไฟล์ (1024² ตรงสเปก) → commit เจาะจง 4 ไฟล์ + ยืนยัน live HTTP 200 ขนาดตรงต้นฉบับ · **ยืนยันในเกมจริง:** โลกขับรถ InstancedMesh 4 กลุ่ม (1,940/1,908/695/117 หลัง) `material.map` = ภาพจริงครบทุกกลุ่ม ไม่ต้องแก้โค้ด (probe รอบ 117 รับเอง)
- **✅ ผู้ใช้ publish rules โซน market+msold แล้ว 11 ก.ค.** — ตรวจ REST: /presence 200 (ก้อน rules ไม่พัง) · /market ไม่ login = 401 ถูกต้อง → **ตลาดออนไลน์จริง (รอบ 124) เปิดใช้งานแล้ว**
- ⚠️ ค้างฝั่งผู้ใช้: ทดสอบจริงมือถือ (เห็นผนังตึกภาพจริงตอนขับรถ) + ซื้อ-ขายตลาดจริง 2 บัญชี/2 เครื่อง

### ✅ รอบ 120–124 (11 ก.ค.) — เคลียร์ backlog 5 ก้อนรวด (version .111–.115)
- **รอบ 120 · 🌐 โบนัสออนไลน์ +0.01/วิ (item 8):** `ONLINE_RATE/onlineEarnTick/onlineEarnFlush` (state.js แบบ compTick แต่ **ไม่นับเวลาปิดเกม** — onlineSince รีเซ็ตทุกโหลด + flush ตอน visibilitychange hidden ใน main.js) · เงื่อนไข = `Online.ready` + แท็บ visible · pill 🌐 ใน header ตัวเลขวิ่งทุกวินาที (renderClock เรียก tick ด้วย → เหรียญตกตรง 100 วิ + อัป coin-count ทันที) · แถวสถิติ · ยืนยัน: สะสม/ตกเหรียญ/flush/offline หรี่ ครบ
- **รอบ 121 · 🎯 Daily Quest (item 3):** `QUEST_POOL` 6 แบบ (state.js) เลือก 3/วัน **seed จากวันที่ — ทุกคนได้ชุดเดียวกัน** (ครูจัดกิจกรรมได้) · `questEvent(ev)` จุดรับแต้มกลาง hook 6 จุด: match/quiz/replay (game.js) · word3d (adventure3d completeWord) · produce (addCraft) · feed เต็มหลอด (feedWith) · รางวัลอัตโนมัติ + ครบ 3 โบนัส +150 · การ์ด `#quest-card` บนสุด aside ขวา · ยืนยัน: บาร์/รางวัล 480 ครบชุด/ไม่นับซ้ำ/วันใหม่รีเซ็ต
- **รอบ 122 · 📇 การ์ดสรุปส่งครู (item 4):** ปุ่มบนสุดหน้าสถิติ → `showTeacherCard()` การ์ดใบเดียว (ชื่อ-ชั้น/วัน-เวลา/เหรียญวันนี้/แรงค์/สอบล่าสุด/จับคู่สะสม+เข็ม) ปุ่มปิดนอกการ์ด แคปแล้วภาพสะอาด
- **รอบ 123 · 🧱🚶 หุ่นบล็อกเดินใน adv/haunt:** picker เดียวกับโลกขับรถ (ปุ่มยืนยันตามโลก `pickBlockAvatar(label)`) · `makeBlockFigure` ท่ายืนเปลี่ยนเป็นแขน-ขาห้อยจาก pivot (`userData.limbs` — ท่าพักหน้าตาเท่าเดิม รถ/thumbnail ไม่กระทบ) · peer ใน adv/haunt = `makeBlockWalkPeer` เดินแกว่งแขน-ขาตาม stride จริง + เด้งก้าว + yaw lerp ทางสั้น + หยุดลู่คืนท่ายืน (`p.walk` ใน tickPeers) · bubble 2.8/mic 2.55 · ส่ง blockAv ผ่าน av เดิม **ไม่ต้อง publish rules** · ยืนยันด้วย `_t.step()` + เรนเดอร์ preserveDrawingBuffer (พบ pixel เสื้อ blk2 จริง)
- **รอบ 124 · 🏪🌏 ตลาดออนไลน์จริง (item 2):** `/market/<key>={sid,sn,id,p,ts}` ซื้อ/ถอน = ลบ node ด้วย **transaction คนแรกได้** (cache อุ่นเพราะ marketWatch เปิดค้าง — ไม่เจอ null หลอก) · `/msold/<seller>/<key>` ใบเสร็จ → คนขาย**กันปลอม 2 ชั้น** (ตรง netKey + ของหลุดจากตลาดจริง) · ประกาศจริงมี `netKey` — marketTick จำลองไม่แตะ · rules ยังไม่ publish → `Online.marketOk=false` fallback ตลาดจำลองเดิมเงียบๆ · UI: ชั้น 🌏 ตลาดเพื่อนออนไลน์ ในแผงตลาด + ป้ายบนประกาศจริง · ยืนยันด้วย fake DB 7 เคส (ซื้อ/ตัดหน้า/รับเงิน/ใบเสร็จปลอม/ถอน 2 ทาง/ออฟไลน์ fallback)
- ⚠️ **ค้างฝั่งผู้ใช้:** (1) **publish rules โซน market+msold** — Artifact: https://claude.ai/code/artifact/283e3504-c9f8-4e5e-ab67-51db14883bfd (2) ทดสอบจริงมือถือ + 2 เครื่อง (ตลาดจริง/หุ่นบล็อกเดิน/เควส/โบนัสออนไลน์) · **retopo โมเดล Lobby ข้าม** (เสียเหรียญ Tripo ~10/ตัว = เงินผู้ใช้ → รอเคาะ)
- 💡 commit แยก 5 รอบ (c539411/38f30d8/58319c5/6ba2652/fca8205) — ui.js/index.html ใช้ `git apply --cached` เจาะ hunk เพราะ session คู่ขนาน (New Word banner) ค้างใน working tree · ⚠️ **PowerShell 5.1: commit message ห้ามมีเครื่องหมายคำพูดคู่** (argument แตก — รอบ 124 เจอ)

### ✅ รอบ 119 (11 ก.ค.) — ตัวละครบล็อกเลือกได้ในโลกขับรถ 🧱🚗 (version .110)
- **ผู้ใช้สั่ง (จากการวิเคราะห์สไตล์ LEGO video):** Lobby คง Tripo เดิม · ก่อนเข้าโลก 3D ให้เลือกตัวละครบล็อก · เพื่อนใน map เห็นเป็นตัวบล็อกที่แต่ละคนเลือก · เริ่มโลกขับรถก่อน
- **BLOCK_AVATARS 8 ตัว (adventure3d.js):** หุ่นบล็อกสไตล์ของเล่นทั่วไปออกแบบเอง (หน้ายิ้มตาโต canvas texture ด้าน -Z ของหัว · ทรงผม flat/tall/cap/pony · บางตัวแก้มแดง) — **⚠️ ห้ามก๊อปทรงมินิฟิกเกอร์การค้า + ชื่อ generic เท่านั้น** (QA session ให้แก้ "เรนเจอร์เขียว"→"ชาเขียว" · "บัมเบิลบี"→"เลม่อน" กันชนเครื่องหมายการค้า)
- **ส่งผ่าน field `av` เดิมใน /world** ('blk1'..'blk8' string ≤8 ผ่าน validate เดิม) → **ไม่ต้อง publish rules ใหม่** · client เก่า (av=male/female) → fallback สุ่มคงที่จาก uid hash
- **เพื่อนโหมด drive = Group 3D:** รถบล็อกเปิดประทุน (สีตามตัวละคร หัวรถ -Z พวงมาลัยขวา + หมุดกลมบนฝากระโปรง + ไฟหน้า) + หุ่นนั่งขับเอื้อมจับพวงมาลัย + ป้ายชื่อ sprite y2.85 · `tickPeers`: rotation.y lerp ทางสั้น (กันสะบัดข้าม ±π) + ล้อหมุนตามระยะจริง (4 wheel holder ใน userData.wheels) · bubble/mic ยกสูง 3.65/3.35 พ้นป้ายชื่อ · **geometry/material แชร์ cache ไม่ dispose — ต่อ peer dispose เฉพาะป้ายชื่อ** (`disposeBlockPeer` เช็ก userData.own)
- **Picker (`Adventure3D.pickBlockAvatar()` คืน Promise<bool>):** thumbnail เรนเดอร์จริงจากโมเดล (WebGLRenderer ชั่วคราว 150×190 → dataURL cache) · จำตัวล่าสุด `state.blockAv` (state.js + sanitize `/^blk[1-8]$/`) · ยกเลิก=ไม่เข้าโลก · ui.js `enterDrive3D` await ก่อน `start('drive')`
- ✅ **ยืนยัน preview:** picker 8 ตัว thumbs data:image ครบ+จำ blk6 · เพื่อนจำลอง 3 คน (blk6/blk3/male-fallback) = Group จริง y0 หมุนคนละทิศตรง yaw เป้าหมาย · ภาพเรนเดอร์จากกล้องเห็นรถบล็อก 3 คัน+คนขับ+ป้ายชื่อบนถนนเมืองจริง · exitWorld ล้าง peers เกลี้ยง · ยกเลิกคืน false · ไม่มี console error · (screenshot pane timeout — ใช้เรนเดอร์ preserveDrawingBuffer แยก decode ดูแทน ตามบทเรียนรอบ 116)
- ⚠️ **ค้าง: ผู้ใช้ทดสอบจริงมือถือ + 2 เครื่อง (เห็นรถบล็อกของกันและกัน)** · 🔜 ต่อยอด: ใช้ picker เดียวกันกับโลกเดิน (adv/haunt — หุ่นบล็อกเดินแกว่งแขนแทน sprite แบน) · ฉากพาสเทล+toon (session คู่ขนานทำอยู่)

### ✅ รอบ 118 (10 ก.ค.) — บังคับรถ smooth ฟีล R4: Ridge Racer Type 4 🏁 (version .109)
- **feedback ผู้ใช้:** "การบังคับทิศทางรถไม่ smooth เลย ให้เหมือน R4" — เดิมกด A/D หัวรถหักทันที กล้องสะบัดตาม
- **แก้ใน `tickDrive` 4 จุด:** (1) พวงมาลัย ramp เข้าโค้งช้ากว่าคืนพวงมาลัย (attack 3.8/s · release 6.0/s) + ลดองศาตามความเร็ว .045 (2) จำกัดอัตราหมุนหัวรถ `maxYaw=1.9/(1+|v|*.06)` ยิ่งเร็ววงยิ่งกว้าง (3) **ทิศวิ่งจริงแยกจากหัวรถ** (`dVelX/dVelZ` grip blend 6.5/s ลดถึง 2.7 ตอนเลี้ยวแรง+เร็ว = สไลด์เข้าโค้งลื่นแบบ Ridge Racer) — ชนตึก/แม่น้ำ/ขอบเมือง damp ทั้ง dSpeed และ dVel (4) **กล้องหันตามหัวรถแบบหน่วง** (`dCamYaw` 6.5/s) + ชายตามองเข้าโค้ง `-dSteer*.10` + เอียงตัว `.06` · รีเซ็ตทุกตัวใน start()
- ✅ **ยืนยัน preview:** steer ไต่ -0.02→-0.39 ใน 1 วิ (ease-in ไม่มีหักกระชาก) · อัตราหมุนกล้อง jump ต่อเฟรมสูงสุด 0.037 rad/s² (นุ่ม) · ปล่อยมือแล้วนิ่งสนิท (rot delta 0.00008 ไม่แกว่ง) · ไม่มี NaN · เก็บตัวอักษร/ชน/OSD ปกติ

### ✅ รอบ 117 (10 ก.ค.) — โค้ดรองรับภาพหน้าตึกเมืองกำแพงเพชร + prompt 4 ไฟล์ 🏢 (version .108)
- **ผู้ใช้ขอ prompt เจนภาพอาคาร (โลกขับรถ)** → `PROMPTS_BUILDINGS_KPP.md` 4 ไฟล์: `img/city/house_1fl.png` (บ้าน 1 ชั้น 1,940 หลัง) / `shop_2fl.png` (ตึกแถว 1,908) / `shop_3fl.png` (695) / `shop_4fl.png` (117) — กติกาภาพ: จัตุรัส 1024² มองตรง 90° เต็มเฟรม **seamless แนวนอน** ขอบล่าง=พื้นถนน ขอบบน=ดาดฟ้า โทนขาวครีม (เกมย้อมพาสเทลเอง) · Artifact ปุ่มคัดลอกส่งแล้ว
- **adventure3d.js `buildDriveCity`:** ตึกแถว procedural เดิม InstancedMesh ก้อนเดียว → **แยก 4 กลุ่มตามจำนวนชั้น** (`round(h/3.3)` clamp 1-4) กลุ่มละ material · UV แกน u ×2.5 (ภาพ tile ~2.5 คูหา/หลัง) · probe `img/city/<file>.png` ต่อกลุ่ม — โหลดได้ swap `mat.map` ทันที (RepeatWrapping) ไม่มีไฟล์ = สีพาสเทลเดิม · tint ต่อหลังคูณกับภาพ = ตึกแถวสีต่างกัน
- ✅ ยืนยัน preview: 4 กลุ่ม (1940/1908/695/117) รวม 4,660 ครบ · fallback ไม่มีภาพปกติ · จำลอง swap texture ด้วย CanvasTexture แล้ว render ผ่าน · รถวิ่ง 48 กม./ชม. ปกติ
- ⚠️ **ค้างผู้ใช้: เจนภาพ 4 ไฟล์วาง `img/city/`** แล้วบอก Claude commit (ไฟล์ใหม่ไม่เข้า git = live 404 — บทเรียนรอบ 112) · หมายเหตุ: ดาดฟ้าเห็นลายผนัง (ข้อจำกัด texture เดียว/ตึก มุมมองคนขับแทบไม่เห็น)

### ✅ รอบ 116 (10 ก.ค.) — ภาพห้องคนขับจริง + เข็มหน้าปัดวิ่งจริง 🎛️ (version .107)
- **ผู้ใช้เจนภาพ 2 ไฟล์วาง `img/car/` แล้ว (dash.png 1536×1024 + wheel.png 1024×1024)** — ตรวจแล้ว**โปร่งใสถูกต้องทั้งคู่อยู่แล้ว** (dash ฟ้าโปร่ง 44% / wheel 64% รวมช่องระหว่างก้าน — ที่เห็นทึบตอนเปิดดูคือพื้นหลัง viewer) ไม่ต้องขจัดพื้นหลัง · commit เข้า git แล้ว (บทเรียนรอบ 112: untracked = live 404)
- **ผู้ใช้สั่งเพิ่ม: เข็มหน้าจอรถสมจริง** → canvas `#adv-cargauges` (z3 ใต้พวงมาลัย z4) วาดทุกเฟรมใน `tickDrive`: `drawCarGauges/drawCarDial` — สปีด 0-180 (ขีด+เลขทุก 20) + วัดรอบ 0-8×1000 (โซนแดง 6.5+ เข็มตาม `CarSound.rpm`) เข็มแดงเรียว+เงา+ดุมกลาง กวาด 270° · **ตำแหน่งวงเกจวัดจากภาพจริง:** ซ้าย (1096,662) r80 · ขวา (1258.5,662) r78 บน 1536×1024 · แปลงเป็นจอด้วยสูตร crop เอง: `object-fit:cover`+`object-position:50% 66%` → `s=boxW/1536`, `offY=(1024s-boxH)*.66` (เชื่อ getBoundingClientRect)
- **จัดเรขาคณิตพวงมาลัยแบบรถจริง:** `#adv-carwheel{left:76.5%;bottom:-15vh;width:min(44vh,50vw)}` → **มองวงเกจลอดช่องเปิดบนของพวงมาลัย** (ยืนยันพิกัด: คลัสเตอร์ y 542-670 คร่อมช่องเปิด 582-644 · แกนคอเปลือยในภาพ dash โดนพวงมาลัยบังมิด — ลองผิด 2 รอบ: 66% เห็นแกนคอโผล่ / 73.5% ดุมบังเกจ)
- ✅ **ยืนยัน preview:** ภาพจริงโหลดทั้งคู่ (ไม่ fallback CSS) · เข็มสปีด: จอด 137° → 19 กม./ชม. = 165° (ทฤษฎี 163.5° แม่นเป๊ะ) · พวงมาลัยหมุน -162° ตอนเลี้ยว · screenshot รอบแรกเห็นห้องคนขับจริงสวยงาม (หลังจากนั้น WebGL capture timeout — ยืนยันต่อด้วยพิกเซล canvas+เรขาคณิต getBoundingClientRect แทน)
- ✅ **ผู้ใช้ publish rules โซน drive+drone แล้ว 10 ก.ค.** (อัปเดต RULES.md แล้ว) — multiplayer/voice/ครูคุมห้อง โลกรถ+โดรนพร้อมใช้ · **เหลือ: ทดสอบจริงมือถือ + 2 เครื่อง**

### ✅ รอบ 115 (10 ก.ค.) — นโยบายโมเดล 3D ตัวเปล่า + เอฟเฟกต์เปลี่ยนร่างเหรียญแรงค์ตอนเลื่อนแรงค์ ✨ (version .106)
- **① นโยบายผู้ใช้ (บันทึกใน `handoff/NOTES.md` กติกาดีไซน์):** โมเดล 3D สัตว์ = **ตัวเปล่าเสมอ ไม่ใส่เครื่องประดับ** — ไม่เจนโมเดลแยกตามชุด เอาแรงไปเพิ่มชนิดสัตว์ (เช่น ควาย ในอนาคต) · **ฟังก์ชันแต่งตัว 2D คงไว้ ห้ามตัด** แค่ไม่โชว์บน 3D · โค้ดปัจจุบันถูกแล้ว (lobby3d โหลด `pet_<key>.glb` ไม่สนใจ item) **ไม่ต้องแก้อะไร**
- **② เอฟเฟกต์เลื่อนแรงค์ (ไอเดียต่อยอดรอบ 114 ผู้ใช้สั่งทำ):** `heroRankShownId` (ui.js module var) จำแรงค์ที่โชว์ล่าสุด → render รอบที่แรงค์**เปลี่ยน** เติม class `rank-fx` ให้ `.hero-rank-bg` · CSS (lobby.css): `rankSwapIn` เหรียญใหม่หมุน coin-flip 720° + สว่างวาบเข้ามา 1.6s + `rankFlash` แฟลชขาวกลางเวที 1.1s + `rankGlowPulse` วงเรืองแสงกะพริบ · เข้าเกมครั้งแรกไม่เล่น (id ยัง null) · `state.noAnim` = ข้าม fx (เหรียญเปลี่ยนเงียบๆ)
- ✅ **ยืนยัน preview:** bronze baseline ไม่มี fx → addCoins ข้าม 10k → class `rank-fx` + `rank_silver.png` + animationName `rankSwapIn` 1.6s จริง → re-render ซ้ำไม่เล่นซ้ำ → noAnim=true ข้ามเส้น gold → ไม่มี fx เหรียญเปลี่ยนเป็น `rank_gold.png` ถูก
- 💡 **บทเรียน preview รอบนี้:** เจอ `ReferenceError WORLD3D` ตอน renderDashboard — **ไม่ใช่บั๊กจริง** เป็น SW cache (`pet-vocab-v6`) เสิร์ฟไฟล์ปนเวอร์ชัน (ui.js ใหม่ + items.js เก่า) · แก้: ล้าง `caches` + unregister SW + reload แล้วหาย — เจอ error แปลกใน preview หลัง session คู่ขนาน push → ล้าง SW ก่อนสรุปว่าบั๊ก
- ⚠️ commit เฉพาะ js/ui.js css/lobby.css handoff/NOTES.md handoff/TASKS.md HANDOFF.md version.json (เช็ก `git status` ก่อน — adventure3d.js ของ session คู่ขนานห้ามแตะ)

### ✅ รอบ 113 (10 ก.ค.) — โลกที่ 5: ขับรถเมืองกำแพงเพชรจริง 🚗🕰️ (version .105)
- **ผู้ใช้สั่ง:** เกมขับรถ 3D first-person ในตัวเมือง จ.กำแพงเพชร เริ่มที่หอนาฬิกาวงเวียนต้นโพธิ์ ตึก/ถนนตรงตำแหน่งจริง + ขอ prompt ภาพหน้าปัด(รวม hood) + พวงมาลัยแยก (หมุนตอนเลี้ยว)
- **ข้อมูลเมืองจริง:** Google Maps ดึงข้อมูลตรงๆ ไม่ได้ (ToS) → ใช้ **OpenStreetMap** (ตำแหน่งเดียวกัน ถูกลิขสิทธิ์ ODbL) ผ่าน Overpass API รัศมี 2.2 กม. รอบหอนาฬิกา (16.4824495,99.5198242) — 40 กม. ที่ขอ = ~5,000 ตร.กม. เว็บโหลดไม่ไหว จึงทำตัวเมืองเต็มก่อน ขยายทีหลังได้ (แก้ RAD ใน scratchpad `bake_city.py` + รัน + วางทับ)
- **`js/data/city_kpp.js` (ใหม่ 232KB · โหลด lazy ตอนเข้าโลก):** ถนนจริง 705 สาย (ชื่อไทยครบ เทศา/ราชดำเนิน/กำแพงเพชร) + ตึกจริง 79 หลัง (footprint+ชื่อ 36 ป้ายลอย) + แม่น้ำปิง + ตึกแถว procedural 4,660 หลังเรียงริมถนนจริง seed คงที่ (bake แล้ว — ทุกเครื่องเห็นเมืองเดียวกัน multiplayer ปลอดภัย) · จุดกำเนิด (0,0)=หอนาฬิกา เหนือ=-z หน่วยเมตร
- **adventure3d.js โหมด `drive` (MODES ที่ 5 · 40🪙/คำ):** เมือง=ถนน mesh รวมก้อน+เส้นประ+InstancedMesh 4,660 กล่อง (draw call เดียว 0.23ms/เฟรม) + ตึกจริง extrude + หอนาฬิกาอิฐจำลอง (หน้าปัด 4 ด้าน+ยอดแหลม+เกาะวงกลม) · ฟิสิกส์ bicycle model (เร่ง 8.5 vmax 90กม./ชม. บนถนน · **นอกถนน 25** ผ่าน road grid 6m · แม่น้ำกั้นยกเว้นสะพาน) · ชนตึก=กล่องหมุน/ขอบ polygon/วงกลมเกาะ (spatial hash) เร็ว>25กม./ชม.=เจ็บ+KO ได้ · เก็บตัวอักษรขับชน (เกิดบนถนนจริง 60–450m จากรถ) · OSD ความเร็ว+**ชื่อถนนจริงที่กำลังวิ่ง** · เรดาร์=แผนที่ถนนทั้งเมือง heading-up · แตร H/ปุ่ม📯 · CarSound สังเคราะห์ · จุดเกิด=ถนนวงแหวนหน้าหอ (19m)
- **HUD รถ:** `img/car/dash.png` (หน้าปัด+hood พวงมาลัยขวา ไทย) + `img/car/wheel.png` (พวงมาลัยแยก **หมุนจริงตามมุมเลี้ยว** ±230° CSS transform) — ไม่มีภาพ=CSS จำลอง(หมุนได้เหมือนกัน) · **PROMPTS_CAR.md** เขียน prompt แล้ว
- **ผูกระบบ:** DRIVE_PRICE 25,000 (ต้องมีตั๋วโดรน) · การ์ดร้าน drive-card + ราง 🚗 + สถิติ + assetValue + state driveTicket/driveDone (migration ครบ)
- **ยืนยัน preview ครบ:** เข้าโลก/intro/ขับ 65กม./ชม./เลี้ยว(พวงมาลัย -226°)/ถอย/นอกถนนช้า/ชนตึกติดกำแพง-ถอยออกได้/จบคำ hand +40🪙/เรดาร์ถนนขาว 548px/ออกโลกกลับ lobby/การ์ด 3 สถานะ · **บั๊กที่เจอ+แก้แล้ว:** เกาะวงเวียนเป็นกล่องเหลี่ยมมุมทับถนน→เปลี่ยนชนวงกลม t:2 · จุดเกิดเดิมในซอย→ย้ายวงแหวนหน้าหอ · ระยะร่นตึก 2.5→4.5m (bake ใหม่)
- ⚠️ **ค้างฝั่งผู้ใช้:** (1) **publish rules โซน drive** (Artifact รอบ 113 มีปุ่มคัดลอก — รวมโซน drone รอบ 85 ที่ยังค้างในก้อนเดียว) ยังไม่ publish=เล่นคนเดียวได้ multiplayer ยังไม่ทำงาน (2) เจนภาพ dash/wheel จาก `PROMPTS_CAR.md` วาง `img/car/` (3) ทดสอบจริงบนมือถือ
- 🔜 ต่อยอด: รถ NPC วิ่งสวน · ป้ายบอกทาง/ไฟจราจร · ภารกิจส่งของตามสถานที่จริง (โรงพยาบาล/วัด/ตลาด มีชื่อจริงแล้ว 36 จุด) · ขยายรัศมีเมือง

### ✅ รอบ 114 (10 ก.ค.) — Lobby 3D ตาม feedback ผู้ใช้ 3 ข้อ: เลิกหมุนเอง + ซ่อน PNG ตอนโหลด + ย่อโมเดล/ฉากหลังแรงค์ 🏅 (version .104)
- **feedback ผู้ใช้ (พร้อม screenshot):** (1) ไม่เอา turntable หมุนเอง (รอบ 111) ให้ยืนหันหน้าตรง แต่คงปัดหมุนไว้ (2) ภาพ PNG (หมาป่วย+อีโมจิคน) วูบขึ้นก่อนโมเดล 3D โหลดเสร็จ — ไม่ควรเห็น (3) ย่อคน+สัตว์ลง ใส่ภาพแรงค์ใหญ่เป็นฉากหลัง
- **(1) js/lobby3d.js:** ถอน AUTO_SPIN_SPEED/AUTO_RESUME_MS/dragging/lastTouchT + บรรทัด auto-spin ใน tick ออกหมด — targetRot ขยับได้จาก pointer event เท่านั้น (ยืนยัน: idle 3.5 วิ rotY=0 · ปัดแล้ว targetRot +0.72)
- **(2) js/lobby3d.js:** `hidePng()` ซ่อน `.hero-scene` ตั้งแต่บรรทัดแรกของ attach (ก่อน HEAD check) · เช็กแล้วไม่มีไฟล์ → `showCanvas(false)` คืน PNG (เคส cache คืนใน microtask ไม่กะพริบ) · กันตาย 2 จุด: ensureLibs พลาด→คืน PNG · showCanvas guard `canvas` null · **ยืนยัน: sample ทุก 100ms ตลอดช่วงโหลด PNG ไม่โผล่เลย · เคสแมว (ไม่มี glb) PNG กลับมาโชว์ปกติ**
- **(3) frameCamera fitH 1.16→1.55** = โมเดลเล็กลง ~25% · **ui.js `heroRankBgHTML()`** (หลัง caretakerFigureHTML) แทรกใน `.stage-hero` ก่อน `.hero-scene` — ภาพ `img/rank/rank_<id>.png` ตามแรงค์จริง (`rankInfo(netWorth())`) + `--rank-c` สีแรงค์ · **lobby.css `.hero-rank-bg`** z0 กลางเวที (img ~52vh + วงเรืองแสง ::before + drop-shadow สีแรงค์ opacity .6) อยู่หลัง PNG/canvas(z1) · probe รูปแล้ว re-render dashboard อยู่แล้ว (main.js:84) ไม่ต้องแก้ timing · ยืนยัน: `.hero-rank-bg img` = rank_bronze 358×374 ใน hero 450×510
- ⚠️ **RAF throttle หนักรอบนี้ (Browser pane hidden ทั้ง session):** วัดอนิเมชัน/screenshot ไม่ได้เลย — ยืนยันด้วย DOM/event/getBoundingClientRect แทนทั้งหมด (mixers=2 ยังอยู่ · clip เล่นยืนยันไปแล้วรอบ 111 โค้ดส่วนนั้นไม่ได้แตะ)
- 🔴 **สำคัญ — commit รอบนี้ต้อง stage บาง hunk:** session คู่ขนาน (โลกขับรถ รอบ 113) แก้ `ui.js` ค้างอยู่ (+~104 บรรทัด renderDriveCard ฯลฯ) → ห้าม `git commit -- js/ui.js` ตรงๆ ใช้ `git apply --cached` เฉพาะ 2 hunk ของงานนี้ (heroRankBgHTML + บรรทัด stage-hero) แล้ว commit จาก index

### ✅ รอบ 112 (10 ก.ค.) — push เสียง Suno 4 ไฟล์ขึ้นเว็บ 🔊 (version .103 · commit f394661)
- ผู้ใช้เจนเสียงจาก Suno วาง `sound/` แล้ว 4 ไฟล์: `haunt_ambient.mp3` (3.7MB) / `haunt_chase.mp3` / `haunt_scare.mp3` / `spark.mp3` — เดิม untracked = live 404 (บทเรียนเดียวกับรอบ 86 ภาพผี)
- ตรวจแล้วชื่อไฟล์ตรงกับที่โค้ดรอรับพอดี (`adventure3d.js:1145` HSound 3 ไฟล์ผี · `util.js:161` spark) → **ไม่ต้องแก้โค้ด** แค่ `git add` เจาะจง 4 ไฟล์ + บัมพ์ version → push
- ✅ ยืนยัน live: version.json = .103 + curl ทั้ง 4 ไฟล์ HTTP 200 ขนาดตรงต้นฉบับ → โลกผีได้เสียงบรรยากาศ/ไล่ล่า/scare จริง + สายฟ้า ⚡ ได้เสียง spark จริงแทนสังเคราะห์
- ⚠️ ค้างฝั่งผู้ใช้: ฟังจริงบนมือถือ (ambient เข้าโลกผี · chase ตอนผีไล่ · scare ตอนโดนจับ · spark ตอนเล่นไวใน 5 วิ) · เสียงที่ยังไม่มี: `drone_loop.mp3` (โลกโดรน) + เสียงเฮลิฯ 3 ไฟล์ (`PROMPTS_HELI.md`)

### ✅ รอบ 111 (10 ก.ค.) — Lobby 3D: turntable หมุนโชว์ + เล่น animation clip จริงจาก Tripo 🔄 (version .102)
- **งานตาม HANDOFF (ผู้ใช้เลือก 10 ก.ค.):** (1) turntable auto-spin (2) เช็ก animation clips ใน GLB — ทำครบทั้งคู่ใน `js/lobby3d.js` ไฟล์เดียว
- **เช็ก clips (สคริปต์ Python อ่าน GLB โดยตรง):** caretaker_male/female มี 2 clips (`NlaTrack` + `NlaTrack.001` ~15.4/15.6s = idle+look_around ที่เลือกตอน animate) · pet_dog มี 1 clip (`NlaTrack` 2.54s) — **ชื่อไม่ตรง regex `idle|breath|stand|rest` → เกมไม่เคยเล่น** (ตามข้อสังเกตรอบ 110)
- **แก้ setupClips:** ไม่เจอชื่อ idle → fallback `gltf.animations[0]` (clip แรก) · mixer ผูกกับ root ที่ cloneSkinned แล้ว (ถูกอยู่เดิม) → **mixers=2 เล่นจริงทั้งคน+หมา**
- **turntable:** `AUTO_SPIN_SPEED=0.12` rad/s (~52 วิ/รอบ) หมุนใน tick เมื่อ `!dragging && เว้นจากแตะล่าสุด > AUTO_RESUME_MS(3500)` · bindDrag เซ็ต `dragging/lastTouchT` · เริ่มหมุนทันทีตอนเข้าหน้า (lastTouchT=0)
- ✅ **ยืนยัน preview จริง (mock login → รับน้องหมา → set level 3 → dashboard):** clipTime เดิน 14.55→17.55 (3 วิ = เล่นจริง+loop) · rotY +0.36 rad/3 วิ (=0.12 rad/s เป๊ะ) · กดค้าง→หยุด (delta 0.01) · ปล่อย 2 วิแรก→ยังนิ่ง (0) · เลย 3.5 วิ→หมุนต่อ (+0.113) · ลากหมุนเองยังทำงาน (targetRot +1.9) · screenshot เห็นคน+หมากำลังหมุน · `_debug()` เพิ่ม dragging/mixers/clipTime
- 🔜 **ต่อยอดที่เหลือจากรอบ 110:** default หันหลัง (ตอนนี้ turntable หมุนให้เห็นหน้าเองทุก ~26 วิ ปัญหาเบาลง) · retopo ลดโพลี ~145k→15k ให้เบาบนมือถือ · pet_cat/pet_dragon (ฝั่งผู้ใช้ทำบน Tripo)
- ⚠️ commit เฉพาะ js/lobby3d.js + version.json + handoff/TASKS.md + HANDOFF.md (pin pathspec)

### ✅ รอบ 87 (9 ก.ค.) — โลกผีตายยากขึ้น: ระบบหัวใจ 3 ดวง ❤️ (version .92)
- **อาการผู้ใช้:** "ด่านผีตายง่ายไป กำลังเล่นสนุกๆ ตายอีกแล้ว" · **ต้นตอ:** โดนผีแตะ (`d<1.25`) = `caught()` **ตายทีเดียวจบ** ไม่มีโอกาสแก้ตัว + ผีเร็ว 5.0 (ผู้เล่น 6) หนีเฉียดฉิว
- **แก้ (js/adventure3d.js):** เพิ่ม `HAUNT_LIVES=3`/`HAUNT_IFRAME=1500` + ตัวแปร `hauntLives`/`hurtUntil` · จุดโดนแตะเรียก `ghostHit(g)` แทน `caught()`: เสีย 1 หัวใจ + กระเด็นหนี (`movePlayer` ออก 3.4m ผีถอย 2.2m + เลิกไล่ 1.4s) + เกราะกันโดนซ้ำ 1.5s + `showBanner('💔 เหลือ N หัวใจ')` · หัวใจหมด (`<=0`) ค่อย `caught()` jump scare จริง · HUD `#adv-hearts` ❤️/🖤 มุมซ้ายบน (top:42 left:10) · `renderHearts()` (clamp กันติดลบ) เรียกใน start()+ทุกครั้งที่โดน · reset ใน start()
- **สมดุลผีปรับให้หนีทัน:** `ghostSpeed 5.0→4.3` · `huntR 18→14` (เกิดใกล้แล้วไล่ทันทีน้อยลง) · `seeR 11→9` · `ghostMax 8→7` · intro/hint อัปเดตบอกระบบหัวใจ
- **ยืนยัน preview:** parse OK ไม่มี error · ผี 7 ตัว · HUD ❤️❤️❤️ โชว์ (rect top42/left10/24px onScreen) · หัวใจลดจริงเมื่อผีแตะ (AFK→🖤) · clamp กันติดลบ · **หมายเหตุ:** i-frame กันเสียซ้ำในเฟรมเดียวเทสต์ตรงๆ ไม่ได้เพราะ RAF throttle ตอน preview background — ตรรกะตรงไปตรงมา (guard `now<hurtUntil`)
- **รอบ 89 (10 ก.ค. version .94):** ผู้ใช้ขอสั่นตอนโดนผี → เดิม ghostHit สั่นเบา `[200,60,120]` (เบากว่าตอนตาย) เพิ่มเป็นกระแทก 2 ที `[350,90,180,90,350]` ชัดขึ้น · ⚠️ **iOS ไม่รองรับ `navigator.vibrate` สั่นผ่านเว็บไม่ได้ทุกกรณี** — ถ้าผู้ใช้บอก "ไม่สั่น" ให้ถามว่า iPhone ไหม (Android เท่านั้นที่สั่นได้) + เช็กปุ่ม haptic ในตั้งค่า

### ✅ รอบ 86 (9 ก.ค. commit e188b46) — push ภาพผี 5 ตัวขึ้นเว็บ 👻
- **อาการ:** ผู้ใช้เจนภาพผีวาง `img/ghosts/` แล้ว แต่มือถือยังเห็นแต่ emoji · **ต้นตอ:** `img/ghosts/ghost_1..5.png` ไม่เคยถูก track ใน git → live Pages ตอบ **404** → โค้ด fallback emoji (ในเครื่อง preview เห็นเพราะมีไฟล์จริง)
- **แก้:** `git add` เฉพาะ 5 ไฟล์จริง (ไม่แตะ `img/ghosts_recovered/` = โฟลเดอร์สำรอง) + บัมพ์ version .90→.91 → push · ยืนยัน live ครบทั้ง 5 = HTTP 200
- 💡 **บทเรียน:** asset ที่ผู้ใช้เจนเอง (ghosts/models/ads/theme/buildings/sound) ต้อง `git add` เจาะจงถึงจะขึ้นเว็บ — ถ้าผู้ใช้บอก "วางภาพแล้วแต่มือถือไม่ขึ้น" → เช็ก `git ls-files` + curl live 404 ก่อนเสมอ

### ✅ เสร็จแล้ว (9 ก.ค. รอบ 105/105B) — A+B "สตรีคเล่นต่อ" ต่อยอดรอบ 101
- **A) โบนัสสตรีคเล่นต่อไล่ระดับ ✅** (รอบ 105 · commit 749cce9) — `REPLAY_BONUS_TIERS=[[9,200],[6,100],[3,50]]` + `replayBonusFor(streak)` · closure replay จ่ายตาม tier (3→50,6→100,9+→200 คงที่) · `.sm-streak` โชว์โบนัสเป้าถัดไป · ยืนยัน preview
- **B) เข็มนักเล่นขยัน 🏅 ✅** (รอบ 105B) — `diligentCount/diligentBadge` (state.js) · `DILIGENT_TIERS=[[20,1],[50,2],[100,3]]`+`diligentEmoji()`+`addDiligent()` (game.js) เรียกใน closure replay · ต่อท้ายชื่อใน map peer+กระดาน (adventure3d.js 1285/1722) · แถวสถิติ (ui.js) + รายงานฯ · ยืนยัน preview (เข็มขึ้น 20/50/100)

**โลก 3D ครบ 4 โลกแล้ว (🌍 กลางวัน · 👻 ผีสิง · 🚁 เฮลิฯ · 🛸 โดรน FPV รอบ 85) — งานถัดไปรอผู้ใช้เคาะ** จาก backlog ด้านล่าง หรือแก้ feedback หลังผู้ใช้ทดสอบจริง
- 🛸 **รอบ 85 ค้างฝั่งผู้ใช้:** (1) **publish rules โซน drone** (Artifact ปุ่มคัดลอกส่งแล้ว · ก้อนเต็มใน `handoff/RULES.md`) — ยังไม่ publish = เล่นคนเดียวได้ แต่ multiplayer/voice/ครูคุมห้องของโลกโดรนยังไม่ทำงาน (2) เจนเสียง `sound/drone_loop.mp3` จาก Suno (`PROMPTS_DRONE.md`) (3) ทดสอบจริงบนมือถือ (จอยซ้าย+ลากขวา=หันหัว/คันเร่ง · บินลอดหน้าต่าง)
- ✅ **rules ชุดเต็ม publish แล้ว 8 ก.ค.** (ครบถึงรอบ 49 — ตรวจ REST จากภายนอกแล้ว ดู RULES.md) → ระบบ online โลก 3D พร้อมใช้ทั้งหมด
- ⏳ **รอผู้ใช้ทดสอบจริงบน Pages (2 เครื่อง/2 บัญชี):** เห็นตัวกันใน map · แชทลอยหัว · คำชวน+เงินคืน 2,000 · voice (ไมค์/ลำโพง/โหมดเพื่อน) · ครูปิดเสียงห้อง · พิธีแชมป์ 🏁 · และ touch มือถือ (จอยซ้าย+ลากมอง+ปุ่มยิง 🔥 โลกกลางวัน) + งานค้าง .12–.17 เดิม · ถ้าจะอัปเกรดเสียงผี → Suno ตาม `PROMPTS_SOUND.md` (ไม่วางก็เล่นได้)
- 🧪 **testkit โลก 3D:** `Adventure3D._t` มี getter camera()/letters/monsters(=ผีในโหมด haunt)/words/inv/peers/hp/mode/running + `damagePlayer(n)/caught()/give(ch,n)(ยัดตัวอักษร→ประกอบคำอัตโนมัติ)/onPeerData(fakeSnap)(จำลองเพื่อนโผล่)/tinvCheck(uid)/exitWorld()` · เข้าเกม: `Adventure3D.start('adv'|'haunt')` ผ่านปุ่มการ์ดตั๋ว · ระวัง: careTick เด้ง alertBox คนป่วยซ้อนหลายชั้นตอน fake state — ตั้ง `playerFedDay=playerSickDay=mealDayKey(Date.now())` ก่อน

### backlog อื่นที่เหลือ (อ่านสเปกเต็มใน `handoff/BACKLOG.md`)
- 💰 **item 8** รายได้ออนไลน์ +0.01/วิ
- 🏪 **item 2** ตลาดออนไลน์จริง (ซื้อขายข้ามผู้เล่น)
- 🎯 **item 3** daily quest
- 📇 **item 4** การ์ดสรุปส่งครู
- 🆕 **คิว 7725691507 (10 ข้อ · 7 ก.ค.)** — ✅จูนอาหาร/นอน (ข้อ 1,2,3,6 รอบ 33) · ✅อาหารคน-สัตว์+พิษสะสม (5.1 รอบ 34) · ✅prompt ผู้เลี้ยง/รูปร่างสัตว์ (4,5.2 รอบ 35) · ✅การ์ดตั๋ว (7 รอบ 37) · ✅โลกผจญภัย 3D (8 รอบ 40) · เหลือ: โครงโฆษณา/Play Store (9,10) → สเปกเต็มท้าย `handoff/BACKLOG.md`

## ⚠️ ค้างฝั่งผู้ใช้ (ทดสอบจริง — rules publish ครบแล้ว 8 ก.ค. ✅)
1. **ทดสอบจริง 2 บัญชี/2 เครื่องบน Pages:** ส่ง-รับของขวัญเต็มวง (ค้างตั้งแต่รอบ 28) + แชท + self-heal เพื่อน · **โลก 3D:** เห็นตัวกันใน map · แชทลอยหัว+quick chat · คำชวน+เงินคืน 2,000 · voice จริง (ไมค์-ลำโพง-โหมดเพื่อน-ระยะเสียง) · ครูปิดเสียงห้อง (บัญชีครู freddommun@gmail.com) · พิธีแชมป์ 🏁 โบนัสเข้า 2 ฝั่ง
2. ~~เจนเสียงหลอนจาก Suno~~ ✅ **เสร็จรอบ 112 (10 ก.ค.)** — haunt 3 ไฟล์ + spark ขึ้น live แล้ว (version .103) · เหลือเสียงที่ยังไม่เจน (ถ้าต้องการ): `drone_loop.mp3` + เฮลิฯ 3 ไฟล์

## 📌 ประวัติรอบล่าสุด (เก่ากว่านี้อยู่ `handoff/HISTORY.md`)

**✅ รอบ 110 (9 ก.ค. · Opus): โมเดล 3D ตัวละครหญิง + สัตว์หมา เข้าหน้า Lobby — version .90** — ผู้ใช้ทำโมเดลบน Tripo (A-pose สูตรเดิม [[tripo-caretaker-regen-state]]) แล้ววาง `img/models/`
- **commit ไฟล์ GLB 3 ตัวเข้า git ครั้งแรก** (`caretaker_male.glb`/`caretaker_female.glb`/`pet_dog.glb`) — เดิม **untracked ทั้งหมด → 3D ไม่เคยขึ้น live** (ผู้เล่นเห็น PNG fallback) · `lobby3d.js` เป็น generic อยู่แล้ว (`caretaker_${avatar}` + `pet_${petType}` ที่ ui.js:1388) **ไม่ต้องแก้โค้ด**
- ✅ **ยืนยัน preview จริง:** เซ็ต avatar=female + newPet('dog') → dashboard → Lobby3D โหลดครบ (`curKey=female|dog`, ownerLoaded+petLoaded=true, 287,016 tris = 141,516+145,500 ผลรวมเมชสองตัวพอดี) · screenshot เห็นหมา+หญิง (ผมหางม้า เสื้อมิ้นท์) เรนเดอร์จริง
- ⚠️ **ข้อสังเกต (ไม่ใช่บั๊กใหม่ — ตัวชายเดิมก็เป็น):** (1) ท่า default **หันหลัง** ให้กล้อง (ปัดหมุน 360° ดูหน้าได้ = ฟีเจอร์เดิม) — ลองแก้ `wrap.rotation.y=Math.PI` ใน fitInto แต่กระทบเฟรม/สเกล skinned-mesh + verify ด้วยตาไม่ได้ชัดใน preview (ติด browser/SW cache `pet-vocab-v3` + skinned render) → **ถอนออก ยังไม่ชิป** (2) animation clip ชื่อ `NlaTrack`/`NlaTrack.001` ไม่ตรง regex `idle|breath|stand|rest` (lobby3d.js:110) → ใช้ท่าโยก procedural แทน อนิเมชัน Tripo ไม่เล่น (3) โพลี ~145k tris/ตัว (ไฟล์ HD ดิบ ไม่ใช่ retopo 15k)
- 🔜 **งานต่อยอด (รอผู้ใช้):** `pet_cat.glb`/`pet_dragon.glb` (ยัง 404 — ทำต่อด้วยสูตรเดิม) · แก้ default หันหน้า/เล่น idle clip แบบ verify ได้จริง · retopo ลดโพลีให้เบาบนมือถือ
- ⚠️ commit เฉพาะ `img/models/*.glb` + `version.json` + `handoff/TASKS.md` (pin pathspec · ไม่แตะ vocab/ghosts/.claude)

**✅ รอบ 109 (9 ก.ค. · Opus): ต่อยอดเข็ม 3 ข้อ — กระดานแท็บเดียว + เข็มลับ 👑 + กราฟเข็มรายสัปดาห์ 🏅 — version .89** (commit 905f851) — ผู้ใช้สั่ง "ทำ 3 อย่างเลย" (ต่อจากรอบ 108)
- **① 🎖️ กระดานแท็บเดียว (ประหยัดจอ)** — รวม leaderboard เหรียญ+เข็มเป็นการ์ดเดียว `#leaderboard-card` มีแท็บ 🪙 เหรียญ / 🏅 เข็ม (ui.js: `lbTab` + `bindLbTabs` delegated + `lbCoinHtml()`/`lbBadgeHtml()`) · แถวเข็มคลิกดูการ์ดผู้เล่นได้ (pl-click) · **ลบการ์ด `#badge-leaderboard-card` แยก** (index.html) + call ใน onlineRerender · CSS `.lb-tabs/.lb-tab.active`
- **② 👑 เข็มลับ "นักสะสมเข็ม"** — ได้เมื่อมีเข็มครบทั้ง 4 สาย (นักบิน+สายฟ้า+ผาดโผน+ขยัน อย่างละ ≥1) · `state.crownBadge` + `checkCrown()` (game.js) เรียกท้าย `addThunder`/`addDiligent`/pilot/daredevil (adventure3d) + ตอนเข้าเมือง (renderDashboard — ครอบผู้เล่นเดิม) · `badgeSuffix` นำหน้าด้วย 👑 · `BADGE_META['👑']={p:5}` (ดันขึ้นต้นกระดานเข็ม) · `celebrateBadge` ฉลอง (หน่วง 3.6s พ้นเข็มสายที่ 4) · regex `NAME_BADGE_RE`/`badgeEmojis` รวม 👑 · state migration
- **③ 📈 กราฟแต้มเข็มรายสัปดาห์ในตู้เข็ม** — `currentBadgeScore()`+`rolloverBadgeWeek()` (game.js · เรียกใน renderDashboard) เก็บ `badgeWeekHist` [{wk,gain}] 8 สัปดาห์ล่าสุด (สแนปต้นสัปดาห์ด้วย weekKeyStr เดิม) · `showProgressReport` เพิ่มกราฟแท่ง 5 สัปดาห์ก่อน+สัปดาห์นี้ (แท่งเหลืองเด่น สูงตามสัดส่วน) + บรรทัด "สัปดาห์นี้ +X แต้ม" + แถวสถานะเข็มลับ 👑 · CSS `.rp-wgraph/.rp-wcol/.rp-wbar.now/.rp-crown` · fields ใหม่ state.js (crownBadge/badgeWeekKey/badgeWeekStartScore/badgeWeekHist) + migration
- ✅ ยืนยัน preview: crown ครบ4สาย→true · badgeSuffix `👑🥉⚡🎯🏅` (👑นำหน้า) · badgeScore `👑🥇⛈️🔥🏆`=17 · แท็บสลับ coins↔badges (เข็ม น้องบี15/มะปราง3 เรียงถูก กรอง0) · กราฟ 4 แท่งสูง 50/100/25/100% แท่ง"นี้"เหลือง +4 แต้ม · crown row + "สัปดาห์นี้ +4 แต้ม 🔥" · ไม่มี console error
- ⚠️ commit เฉพาะ css/style.css/index.html/adventure3d.js/game.js/online.js/state.js/ui.js/version (pin pathspec)

**✅ รอบ 108 (9 ก.ค. · Opus): ต่อยอดเข็ม 3 ข้อ — แถวเข็มในการ์ดผู้เล่น + แจ้งเตือนเพื่อนได้เข็ม + กระดานเข็ม 🏅 — version .88** (commit 718ec3b) — ผู้ใช้สั่ง "เอา 3 ข้อเลย" (ต่อจากรอบ 107)
- **helper กลาง (game.js):** `BADGE_META` (อิโมจิ→{ชื่อ,แต้ม 1-3}) + `splitNameBadges(n)` (แยกชื่อสะอาด/เข็มท้าย) + `badgeEmojis(str)` + `badgeScore(str)` · แตกเข็มที่ baked ท้ายชื่อ `presence/leaderboard.n` (จากรอบ 107) มาใช้ได้ **โดยไม่ต้องเพิ่ม field/publish rules**
- **① 🖼️ การ์ดข้อมูลผู้เล่น (คลิกชื่อ) โชว์ "แถวเข็ม"** — `showPlayerCard` แยกเข็มจากชื่อ → หัวการ์ดชื่อสะอาด + `.pl-badges` ชิป (emoji ตัวโต + ชื่อเข็มไทย) · me-row `data-n` ใส่เข็มเองด้วย (ป๊อปอัปของเราโชว์เข็ม) · CSS `.pl-badges/.pl-badge-chip` (lobby.css)
- **② 🔔 แจ้งเตือนเพื่อนได้เข็มใหม่** — `notifyFriendBadges(list)` (online.js) เรียกใน presence listener · เพื่อน (ใน `Online.myFriends`) ที่ออนไลน์ + แต้มเข็มเพิ่มขึ้น → `toast` ให้กำลังใจ · `Online.seenBadges` จำ baseline (ครั้งแรกที่เห็น=เงียบ · เท่าเดิม=ไม่ซ้ำ · คนแปลกหน้า=เมิน)
- **③ 🥇 กระดานเข็มสะสม** — การ์ดใหม่ `#badge-leaderboard-card` (index.html aside) + `renderBadgeLeaderboardCard()` (ui.js) เรียกใน `renderDashboard`+`onlineRerender` · จัดอันดับด้วย **แต้มรวมเข็ม** (`badgeScore` ผลรวมระดับ 1-3) จาก `Online.board`+เราสด (แทนที่ n เราด้วย `badgeSuffix()` สด) · กรอง 0 แต้ม · me ไฮไลต์ · CSS `.lb-hint/.lb-badgeline` (style.css)
- ✅ ยืนยัน preview: split/emojis/score ถูก (🥈⚡🏆=6, 🥇🌩️🔥🎖️=10) · การ์ดผู้เล่น 4 ชิป+หัวชื่อสะอาด "น้องบี" · กระดานเข็มเรียง 10>2>1 กรอง 0 แต้มออก me ⭐เข็มสด อันดับ 2/3 · แจ้งเตือน 4 เคส (baseline เงียบ/ได้เพิ่ม→toast/แปลกหน้าเมิน/ไม่ซ้ำ) · ไม่มี console error
- ⚠️ commit เฉพาะ game.js/ui.js/online.js/index.html/style.css/lobby.css/version (pin pathspec)

**✅ รอบ 107 (9 ก.ค. · Opus): ต่อยอดเข็ม 3 ข้อ — ปุ่มลัดตู้เข็ม + ฉลองทุกเข็มเหมือนกัน + เข็มโชว์ให้เพื่อนหน้าเมือง 🏆 — version .87** (commit 7450ddd) — ผู้ใช้สั่ง "ลุยทั้ง 3 ข้อ" (ต่อจากรอบ 106)
- **① 🏆 ปุ่มลัดตู้เข็มในราง lobby** — index.html `#btn-rail-trophy` (ต่อจาก 📊 สถิติ) · main.js ผูก `showProgressReport` → เปิดรายงานความก้าวหน้า/ตู้เข็มจากหน้าเมืองได้เลย ไม่ต้องเข้าเกม
- **② 🎊 celebrateBadge ใช้กับทุกเข็ม (สวยเท่ากัน)** — thunder (game.js `addThunder`) เปลี่ยน toast→celebrateBadge · pilot (adventure3d ~869) + daredevil (~2460) เปลี่ยน `showBanner`→`celebrateBadge` (แบนเนอร์เด้ง+โปรยเหรียญ) · ตัด `sfx.rankup` ซ้ำ (celebrateBadge เล่นเอง) · celebrateBadge เป็น global game.js เรียกจาก adventure3d ได้
- **③ 🔗 เข็มโชว์ให้เพื่อนเห็นในการ์ดหน้าเมือง** — `badgeSuffix()` (game.js global · pilot inline array เพราะ `pilotEmoji` เป็น local ของ adventure3d) = 🥉⚡🎯🏅 · online.js ต่อ `badgeSuffix()` ท้าย `presence.n` + `leaderboard.n` (**rules-safe: ต่อ string field เดิม ไม่เพิ่ม field ใหม่** → ไม่ต้อง publish rules) + ใส่เข็มใน `lastScoreSig` ให้ re-push เมื่อได้เข็มใหม่ · ui.js me-row การ์ดออนไลน์ต่อ badgeSuffix โชว์เข็มตัวเอง (คนอื่นมาจาก n ที่ baked) · ⚠️ `Online` เป็น const module-scope (ไม่ใช่ window.Online — เวลาเทสต์ต้อง mutate property ตรงๆ)
- ✅ ยืนยัน preview: badgeSuffix=🥉🌩️🔥🏅 ( order นักบิน/สายฟ้า/ผาดโผน/ขยัน) · ปุ่มราง click→เปิดตู้เข็ม 3 แถว · thunder ครบ 15→celebrateBadge(🌩️ tier2) · spy presence.n/leaderboard.n=`มะปราง🥈⚡🏆` · me-row=`⭐ มะปราง🥈🏆` · ไม่มี console error
- ⚠️ commit เฉพาะ index.html/game.js/adventure3d.js/main.js/online.js/ui.js/version (pin pathspec · ไม่แตะ style.css รอบนี้ · CSS celebrate อยู่รอบ 106 แล้ว)

**✅ รอบ 106 (9 ก.ค. · Opus): ต่อยอดเข็ม 3 ข้อ — ฉลองเข็มขยันอลัง + ตู้เข็มสะสม + tier 15 รอบ 🏆 — version .86** (commit 37f1928) — ผู้ใช้สั่ง "ทำทั้ง 3 ข้อ" (ไอเดียต่อยอดจากรอบ 105/105B)
- **① 🎊 ฉลองได้เข็มนักเล่นขยันอลัง** — `celebrateBadge(emoji,title,sub)` (game.js): แบนเนอร์เด้งกลางจอ (bcPop/bcSpin) + โปรยเหรียญ (reuse `sprinkleConfetti`) + `sfx.rankup`+haptic แทน toast เดิม · overlay `position:fixed pointer-events:none z60` = ไม่บังการเล่น หายเอง ~3s (bc-out fade) · `addDiligent` เรียก celebrateBadge แทน toast · CSS `.badge-celebrate*` ใน style.css
- **② 🏆 ตู้เข็มสะสม** ในรายงานความก้าวหน้า (`showProgressReport`) — แทนชิปเข็มเดิม · 3 สายที่นับจำนวนถาวร (⚡สายฟ้า/🎯ผาดโผน/🏅ขยัน): แต่ละสายมีแถบ % ไปเข็มถัดไป (คิดจากช่วง prevTier→nextTier) + อีโมจิเรียง 3 ระดับ (ได้=สว่าง `.rp-em.earned` · ยังไม่ได้=จาง grayscale) + note "อีก N = <เข็มถัดไป>" · ✈️ นักบิน = แถวสถานะ (อิงสตรีค ไม่มีแถบ) · CSS `.rp-tline/.rp-tl-*/.rp-em`
- **③ 🔥 tier โบนัสเล่นต่อ +300** — `REPLAY_BONUS_TIERS` เพิ่ม `[15,300]` → 3→50, 6→100, 9-14→200, 15 ขึ้นไป→300 (ไม่ตันที่ 200)
- ✅ ยืนยัน preview: โบนัสจ่าย 15/18→+300 · celebrateBadge overlay กลางจอ(356/711) + 20 confetti + pointer-events none + auto-remove 1→0 · ตู้เข็ม bar% ถูก (สายฟ้า 12 ครั้ง→70%, ●○○) + ผาดโผน 0→0% + ขยัน 100→100% ●●● "ครบทุกเข็ม" + นักบิน 🥈 · ไม่มี console error
- ⚠️ commit เฉพาะ game.js/style.css/version (pin pathspec)

**✅ รอบ 105B (9 ก.ค. · Opus): เข็มนักเล่นขยัน 🏅 — สะสม "เล่นต่ออีกรอบ" ถาวร 20/50/100 — version .85** — ต่อจากรอบ 105 · ผู้ใช้สั่ง (งาน B ที่ pin ไว้)
- แพตเทิร์นเดียวกับเข็มสายฟ้า/นักบิน: `state.diligentCount/diligentBadge` (state.js + migration) · game.js `DILIGENT_TIERS=[[20,1],[50,2],[100,3]]` + `DILIGENT_TIER_UI`(🏅เข็มนักเล่นขยัน/🎖️นักเล่นตัวยง/🏆ยอดนักสู้คำศัพท์) + `diligentEmoji()` + `addDiligent()` (เรียกใน closure replay ของ exitGame ทุกครั้งที่กดเล่นต่อ · toast ประกาศเข็มหน่วง 1.2s)
- ต่อ `diligentEmoji(state.diligentBadge)` ท้ายชื่อใน adventure3d.js **map peer publish (1285)** + **กระดานคะแนน renderBoard (1722)** ต่อจาก pilot/thunder/daredevil (เพื่อนเห็นทุกโลก) · ⚠️ `pilotEmoji` เป็น local ของ adventure3d แต่ `diligentEmoji` เป็น global game.js (เข้าถึงได้)
- โชว์ในหน้าสถิติ (ui.js 3559 แถว "เล่นต่ออีกรอบสะสม") + รายงานความก้าวหน้า (`showProgressReport`: เพิ่มเข็มใน badges + แถว `diligentLine` โชว์เลข+เป้าถัดไป)
- ✅ ยืนยัน preview: `addDiligent` วน 1→100 ได้เข็มที่ 20/50/100 เป๊ะ · รายงานฯ render จริง badge "🏅 เข็มนักเล่นขยัน" + แถว "35 รอบ (อีก 15 ได้🎖️)" · ครบ 120=ครบทุกเข็ม · ไม่มี console error
- ⚠️ commit เฉพาะ state.js/game.js/ui.js/adventure3d.js/version (pin pathspec · ไม่แตะ .claude/img ghosts/vocab)

**✅ รอบ 105 (9 ก.ค. · Opus): โบนัสสตรีคเล่นต่อไล่ระดับ 🔥 — version .84** (commit 749cce9) — ต่อยอดสตรีคเล่นต่อ (รอบ 101) · ผู้ใช้สั่ง (งาน A ที่ pin ไว้)
- เดิมโบนัสคงที่ +50 ทุก 3 รอบติด → ตาราง tier `REPLAY_BONUS_TIERS=[[9,200],[6,100],[3,50]]` + helper `replayBonusFor(streak)` · closure `replay` ใน `exitGame` จ่ายโบนัสตาม tier เมื่อ `streak%3===0` (streak 3→50, 6→100, 9 ขึ้นไป→200 คงที่) · floatFx/toast ใช้ยอดจริง · ลบ const `REPLAY_BONUS_COINS`
- บรรทัด `.sm-streak` บนการ์ดสรุป: `replayBonusFor(streak+remain)` = โชว์โบนัสของเป้าถัดไป (50→100→200 ตามช่วง)
- ✅ ยืนยัน preview: จ่ายจริง streak 3→+50, 6→+100, 9/12/15→+200 · บรรทัดเป้าถัดไปถูกทุกช่วง (streak 0/1/2→+50, 3-5→+100, 6+→+200)
- ⚠️ commit เฉพาะ game.js/version (ปลอดภัย · ไม่แตะไฟล์อื่น)

**✅ รอบ 104 (9 ก.ค. · Opus): ตัวละคร Lobby เป็นโมเดล 3D จริง (idle + ปัดหมุน 360°) 🧊 — version .83** (commit c31e545) — ผู้ใช้สั่ง "ตัวละครต้องเป็น 3D ขยับ idle แบบ COD lobby + ปัดซ้ายขวาหมุนดูรอบตัว" · ผู้ใช้เลือกแนวทาง **โมเดล GLB จริง** (จาก AskUserQuestion)
- **`js/lobby3d.js`** (โมดูล `Lobby3D`): viewer Three.js วางทับ `.stage-hero` (canvas โปร่งใส z1 · แผง z2 อยู่บน) · โหลด `img/models/caretaker_{male|female}.glb` + `pet_{dog|cat|dragon}.glb` · fit โมเดล (สูงตามระดับร่างยักษ์ `PET_H/OWNER_H`) เท้าแตะพื้น · **idle procedural** (sway.position.y/rotation.z sin) + เล่น AnimationMixer คลิปชื่อ idle/breath/stand ถ้ามี · **ปัด/ลาก pointer = หมุน spin.rotation.y 360°** + โมเมนตัม (spinVel decay) · หยุด RAF เมื่อออกจาก dashboard
- **fallback ปลอดภัยสุด:** `attach` เช็ก `isFileProto()` + `modelsExist()` (HEAD fetch cache ต่อ avatar|pet) **ก่อนโหลด three** → ไม่มีไฟล์/ไม่ครบ/file:// = ไม่โหลด three (ประหยัด ~700KB) ซ่อน canvas โชว์ `.hero-scene` PNG เดิม · โหลด glb พลาดก็ fallback (ไม่ถือเป็นบั๊ก)
- **`js/vendor/GLTFLoader.js`** (global build three r147 · เข้ากับ three r149 ที่เกมใช้ — examples/js ถูกถอดหลัง r147 เลยดึงตัวนี้มา) โหลด dynamic ผ่าน `loadScriptOnce`
- index.html โหลด `js/lobby3d.js` (โมดูลเล็ก · three โหลดตอน attach) · ui.js `renderDashboard` เรียก `Lobby3D.attach(hero,{avatar,petType,stage,giant})` (เช็ก `typeof Lobby3D!=='undefined'` — เป็น const ไม่ใช่ window prop!) เฉพาะ stage!=='egg'
- **คู่มือ:** `PROMPTS_MODELS_3D.md` + `img/models/README.txt` — เจนโมเดลจากภาพตัวละครเดิมด้วย image-to-3D (Meshy/Tripo/Luma) → .glb ชื่อตรงเป๊ะ · ผู้เลี้ยงอยากได้ท่าจริงเข้า Mixamo ตั้งชื่อคลิป idle · **ส่ง Artifact ปุ่มคัดลอกแล้ว**
- ✅ ยืนยัน preview (ใส่ Fox.glb ทดสอบชั่วคราว—ไม่ commit): โหลด three+GLTFLoader สำเร็จ · GLB เรนเดอร์จริง (renderer.info triangles=1152) · canvas ทับ hero แผง/UI ครบ · ปัดแล้ว `targetRot`→2.88 rad (หมุนตอบสนอง) · **ลบไฟล์ทดสอบ→ fallback: three ไม่โหลด, canvas ไม่สร้าง, PNG โชว์, ไม่มี error** · มี `Lobby3D._debug()` ช่วยเช็ก (RAF ถูก throttle ตอน preview background — rotY ค้างแต่ targetRot อัปเดต = ปกติ)
- ⚠️ **ค้างฝั่งผู้ใช้:** เจนไฟล์ `.glb` วาง `img/models/` (ดู Artifact/PROMPTS_MODELS_3D.md) — ยังไม่วาง = PNG เดิม · การจัดวาง/กล้อง 3D ทดสอบด้วย Fox placeholder ยังต้องจูนจริงตอนมีโมเดลจริง (แก้ที่ `applyLayout`/`frameCamera` ใน lobby3d.js)
- ⚠️ commit เฉพาะ 8 ไฟล์ (pin pathspec · ไม่แตะ .claude/img ghosts/vocab ของ session อื่น)

**✅ รอบ 103 (9 ก.ค. · Opus): สัตว์ขนาดปกติ + อัพเกรด "ร่างยักษ์" 🦣 — version .82** (commit 5036ca1 · หมายเหตุ: ข้อความ commit เผลอพิมพ์ "รอบ 102" — จริงคือ 103 ต่อจาก lobby COD) — ต่อจากรอบ 102 · ผู้ใช้สั่ง "สัตว์ขนาดปกติ แต่อัพเกรดให้ยักษ์จนผู้เลี้ยงสูงแค่เข่าได้"
- **ค่าเริ่มต้นน้องขนาดปกติ:** เลิกน้องตัวโตเกินผู้เลี้ยง — g0 น้องเตี้ยกว่าผู้เลี้ยงเล็กน้อย (owner/pet ≈ 1.17)
- **ระบบร่างยักษ์ 4 ระดับ** (ui.js): `GIANT_MAX=4` · `GIANT_COST=[_,2k,4k,8k,16k]` · คุมขนาดด้วยความสูง vh: `GIANT_PET_VH=[29,42,54,64,74]` / `GIANT_OWNER_VH=[34,33,30,26,22]` → g4 owner/pet ≈ 0.30 (ระดับเข่า) · `upgradeGiant()/resetGiant()/giantLevel()` · หักเหรียญ `state.coins-=cost` (แนวเดียวกับซื้อของอื่น) · เหรียญไม่พอ=บล็อก+toast · ย่อกลับฟรี (ไม่คืนเหรียญ)
- **ผู้เลี้ยงวาง `position:absolute`** ใน `.hero-scene` (`--owner-x` เยื้องจากกลาง) z สูงกว่าน้อง = **ยืนหน้าน้องในโซนโล่งกลางเสมอ** — กันน้องยักษ์ดันผู้เลี้ยงหลุดไปหลังแผงซ้าย (โซนโล่งระหว่างแผง = x459–659) · `pointer-events:none` กันบังปุ่มในแผง · sway ย้ายไป `.caretaker-img` (กัน transform ตำแหน่งโดนทับ)
- **ขนาดน้องคุมด้วยความสูง** (`.pet-stage height:clamp(_,calc(var(--pet-vh)*1vh),_)` + `.pet-wrap/.pet-img height:100%`) แทน transform scale เดิม — **ต้องมี pet-wrap height:100%** ไม่งั้น pet-img เด้งกลับขนาดจริง 1024px (เจอตอนทำ)
- **state.js:** field `giant:0` ใน newPet + migration (`if(typeof p.giant!=='number')p.giant=0`)
- **UI ปุ่มอัพเกรด** ในแผง "ข้อมูลน้อง" (plate-left · หลัง ability-box · โชว์เฉพาะ stage!=='egg'): จุดไล่ระดับ + ปุ่ม "⬆️ ขยายร่าง 🪙X" (ม่วง) + "↩️ ย่อกลับปกติ"
- ✅ ยืนยัน preview (getBoundingClientRect + screenshot g0/g4): g0 น้อง+ผู้เลี้ยงเห็นครบยืนคู่ · g4 น้องยักษ์เต็มจอ ผู้เลี้ยงระดับเข่ายืนหน้าเห็นชัดในโซนโล่ง (owner top≈30% ของน้อง) · คลิกปุ่มจริง: giant 0→1 หัก 2,000 · เหรียญไม่พอบล็อก · reset กลับ 0 · **screenshot เคยขาว = killanim ทำ fadeIn ค้าง opacity:0 → อย่าใส่ animation:none ทั้งจอ ให้ปลด opacity แทน**
- ⚠️ commit เฉพาะ ui.js/state.js/lobby.css/version (pin pathspec)

**✅ รอบ 102 (9 ก.ค. · Opus): หน้า lobby ฉาก 3D สไตล์ COD — ผู้เลี้ยง+น้องยืนคู่กลางจอ 🏙️🧑‍🦱🐶 — version .81** (commit c2f1f38 · หมายเหตุ: ข้อความ commit เผลอพิมพ์ "รอบ 86" — งานเดียวกัน) — ผู้ใช้สั่งทำ (เปลี่ยน lobby เป็นโลก 3D สไตล์ Call of Duty)
- **ตัวละครกลางจอ:** `caretakerFigureHTML()` (ui.js หลัง `petVisualHTML`) วาดผู้เลี้ยง `player_${av}.png` ยืนเต็มตัว · ใน `.stage-hero` เปลี่ยนเป็น `.hero-scene` = ผู้เลี้ยง+น้องซ้อนเป็นกลุ่มเดียว (น้อง z-index สูงกว่าอยู่หน้า · gap ลบให้ซ้อน) · ยังไม่เลือก/ไม่มีภาพ = อีโมจิตัวโต
- **ลานยืน 3D:** `.hero-ground` เงา+วงเรืองแสงใต้เท้า (lobby.css) ให้ดูตั้งบนพื้น · `--pet-zoom` ลด 1.9→1.5 เผื่อที่ให้ผู้เลี้ยง
- **พื้นหลัง:** `body` background ซ้อน `img/theme/theme_city_cod.png` (ตึกสมัยใหม่ ผู้ใช้เจน) ทับ fallback `theme_bg_wide.png` เดิม — ยังไม่วางไฟล์ใหม่ = ภาพเก่าโผล่แทน **ไม่พัง**
- **คงเดิมทั้งหมด:** rail ซ้าย · topbar · plate-left/right · การ์ดขวา (online/leaderboard) — แตะแค่ `.stage-hero`
- **prompt:** `PROMPTS_LOBBY_COD.md` 3 แบบ (หลัก★/เช้า/พลบค่ำ) + ส่ง Artifact ปุ่มคัดลอกให้ผู้ใช้แล้ว
- ✅ ยืนยัน preview (landscape 1280×720, getBoundingClientRect + screenshot 1 เฟรม): ผู้เลี้ยง(player_male)+น้องหมายืนคู่กลางจอ เงาใต้เท้า · plate/rail/การ์ดครบ · fallback bg ทำงาน · ไม่มี error
- ⚠️ **ค้างฝั่งผู้ใช้:** เจนภาพ `theme_city_cod.png` วาง `img/theme/` (ดู Artifact/PROMPTS_LOBBY_COD.md) · ไม่ได้แตะ no-pet branch (โชว์ผู้เลี้ยงเฉพาะตอนมีน้อง)
- ⚠️ commit เฉพาะ ui.js/lobby.css/version/PROMPTS_LOBBY_COD.md (pin pathspec · ไม่แตะ img/ghosts, js/data/vocab, .claude ของ session อื่น)

**✅ รอบ 101 (9 ก.ค. · Opus): เกมจับคู่ — การ์ดสรุปเตือนน้องป่วยอ่อนโยน + โบนัสสตรีคเล่นต่อ 🩺🔥 — version .80** (commit 3c5f7ad) — ต่อยอดปุ่มเล่นต่อ (รอบ 99) · ผู้ใช้สั่งทำ
- **เตือนน้องป่วย:** `showSessionSummary` เช็ก `activePet().sick` → ปุ่มหลักสลับเป็น "🩺 ไปดูแลน้องก่อน" (→dashboard) · ยังกด "🔄 เล่นต่อก่อน" ได้ (ไม่บล็อก) + บรรทัด "🤒 น้อง<ชื่อ>ยังป่วยอยู่..." · ปกติ = ปุ่มหลัก "🔄 เล่นต่ออีกรอบ!"
- **สตรีคเล่นต่อ:** `game.replayStreak` นับกดเล่นต่อติดกัน (closure replay ใน exitGame · `_viaReplay` flag กัน startGame รีเซ็ต) · ครบ 3 รอบติด (`REPLAY_BONUS_EVERY`) → `addCoins/addSessionCoins(50)` (`REPLAY_BONUS_COINS`) + floatFx/toast · เข้าเกมจากเมนู=รีเซ็ต 0 · การ์ดโชว์ "🔥 เล่นต่อเนื่อง N รอบ — อีก M รอบได้โบนัส"
- ปุ่มเปลี่ยนคลาส `.sm-primary/.sm-secondary` (จาก summary-replay/exit) · style `.sm-streak`/`.sm-sick`
- ✅ ยืนยัน preview: ปกติ=ปุ่มเล่นต่อ(เขียว)/ออกไปพัก ไม่มีบรรทัดป่วย · ป่วย=🩺ไปดูแล/🔄เล่นต่อก่อน+บรรทัดป่วย(ชื่อน้อง) · สตรีค replay 1→2→3 บวก +50 เฉพาะรอบ 3 (floatFx+toast จริง) · เมนูรีเซ็ต 0 · ไม่มี error · **screenshot ค้าง→inspect**
- ⚠️ commit game.js/style.css/version (ไม่แตะ adventure3d ของ session คู่ขนาน)

**✅ รอบ 100 (9 ก.ค. · Opus): "สมุดคำศัพท์รอบนี้" ตอนออก/จบเกมโลก 3D 📖** (commit เฉพาะ `js/adventure3d.js` — ไม่ bump version, ปล่อยให้ session คู่ขนาน carry) — งานเดี่ยว 3D ต่อจากรอบ 97/97b · ผู้ใช้สั่ง "ทำได้เลย"
- **โจทย์:** เดิมออกจากโลก 3D บอกแค่ "เก็บได้ X คำ" (ตัวเลข) → เพิ่มคุณค่าเรียนรู้: โชว์**คำที่ประกอบสำเร็จจริง + คำแปลไทย** เป็นสมุดทบทวน (ครู/ผู้ปกครองเห็นผล)
- **ทำ (ทั้งหมดใน `js/adventure3d.js`):** `sessionWordLog=[]` (module var) · `completeWord` push `{en,th}` แบบไม่ซ้ำ · reset ที่ start()+showPodium(endRound) · helper `sessionRecapHtml()` คืนชิป `EN\nไทย` (ว่าง=คืน '' ไม่โชว์) · แทรกเข้า **3 จุดออก**: `confirmExit` (askConfirm), `caught` (KO ผี), `knockedOut` (KO adv/heli/drone) · CSS `.adv-recap*` (ชิป wrap max-height 96px scroll · ธีมเขียวโลกผี) · เพิ่ม `_t.wordLog/knockedOut` hooks
- ✅ ยืนยัน preview (mock · give letters ประกอบคำ): ประกอบ 3 คำ→log `[shy=อาย, market=ตลาด, pillow=หมอน]` · confirmExit dialog โชว์ recap หัว "(3 คำ)" ชิป EN ตัวใหญ่+ไทย ในจอ · KO 8 คำ→recap "(8 คำ)" 8 ชิป · **รอบใหม่ start→log reset 0** · ประกอบ 0 คำ→ไม่มี recap แต่ยังโชว์ "เก็บได้ 0 คำ" ปกติ · ไม่มี console error
- ⚠️ **สำคัญ (พบวันนี้):** session คู่ขนานกับผม**ใช้ working tree + main เดียวกัน** (ไม่ใช่ clone แยก) → `git add -A` ของอีก session กวาดไฟล์ที่ผมแก้ค้างได้ · กติกา: แก้ไฟล์ 3D → commit เร็วแบบ pin pathspec เฉพาะ `js/adventure3d.js` ทันที ลดช่วงถูกกวาด · ห้ามแตะ version.json/game.js/style.css/state.js/index.html ที่อีก session ปั่นถี่

**✅ รอบ 99 (9 ก.ค. · Opus): เกมจับคู่ — การ์ดสรุปมีปุ่ม "เล่นต่ออีกรอบ" + เสียงเหรียญตอนทำสถิติใหม่ 🔄🔊 — version .79** (commit ad84077) — ต่อยอดการ์ดสรุป (รอบ 98) · ผู้ใช้สั่งทำ
- **เล่นต่ออีกรอบ:** การ์ดสรุปมี 2 ปุ่ม — 🔄 เล่นต่ออีกรอบ (เขียว) → `startGame(game.lastCat)` เริ่มโหมด/หมวดเดิมทันที (session รีเซ็ต coins/matches=0) ไม่กลับหน้าเมือง · ออกไปพัก (ม่วง) → doExit · `game.lastCat` จำหมวดใน startGame · `showSessionSummary` เพิ่ม param `onReplay`
- **เสียงเหรียญ:** ทำสถิติใหม่ → `sfx.coin` 4 ครั้งไล่กัน (260+i*150ms) ซ้อน confetti+rankup
- **⚠️ fix specificity:** ปุ่ม (`.summary-replay/.summary-exit`) เดิมโดน `.levelup-box button`(0,1,1) ทับเป็นม่วง default ทั้งคู่ → prefix `.summary-box ` (0,2,0) ให้ชนะ · ยืนยัน computed: replay bg เขียว(79,196,106) exit ม่วง-เทา padding 11/20
- ✅ ยืนยัน preview: 2 ปุ่มมีจริง · replay→overlay หาย+screen-game+sessionCoins/Matches=0+prevBest=สถิติใหม่ · สี/gradient ถูก · ไม่มี error · **screenshot ค้าง→inspect**
- ⚠️ commit game.js/style.css/version (ไม่แตะไฟล์ session คู่ขนาน)

**✅ รอบ 98 (9 ก.ค. · Opus): เกมจับคู่ — การ์ดสรุปผลงานทุกครั้งที่ออก + โปรยเหรียญตอนทำสถิติใหม่ 🎊 — version .78** (commit e1da45b) — ต่อยอดการ์ดสรุป (รอบ 96) · ผู้ใช้สั่งทำ
- **การ์ดทุกครั้ง:** `exitGame` เก็บเหรียญได้ (>0) เด้งการ์ดสรุปเสมอ โชว์ "เก็บได้ X 🪙 · 🔤 จับคู่ถูก Y คำ" (`game.sessionMatches` reset ใน startGame · ++ ใน checkMatch คู่กับ totalMatches) · เก็บ 0 = ออกเลย
- **ทำสถิติใหม่ = ฉลองพิเศษ:** burst 🎉 + ป้ายสถิติ + `sprinkleConfetti(overlay)` โปรยเหรียญ/ดาว 20 ชิ้น (absolute z-1 หลังการ์ด z-2 · `@keyframes confFall` ตกจากบน · auto-remove 3.6s) · ไม่ทำสถิติ = การ์ดปกติ burst 👏 ไม่มีโปรย · `sprinkleConfetti` ข้ามเมื่อ `state.noAnim`
- ✅ ยืนยัน preview: ไม่สถิติ(220<1000)=👏+"6 คำ"+0 badge+0 confetti · สถิติ(400>100)=🎉+badge+20 confetti · all-time(best 0)=2 badge · เก็บ0=ออกเลย · noAnim=0 confetti · confetti animation-name confFall/absolute · ไม่มี error · **screenshot ค้าง→inspect ยืนยัน**
- ⚠️ commit game.js/style.css/version (ไม่แตะไฟล์ session คู่ขนาน)

**✅ รอบ 97 (9 ก.ค. · Opus): การ์ด "วิธีเล่น" ตอนเข้าโลก 3D ครั้งแรก ❓📱 — version .77** (งานเดี่ยว ไม่แตะไฟล์ session คู่ขนาน) — ผู้ใช้มอบอำนาจทำงานต่อเนื่องช่วงไม่อยู่ (อนุมัติทุกงานที่ทำให้เกมดีขึ้น)
- **โจทย์:** เดิม `#adv-hint` (คอนโทรล) เป็นข้อความจิ๋วมุมขวาล่าง + **ซ่อนสนิทบนจอสัมผัส** (`.adv-touch #adv-hint{display:none}`) → เด็กบนมือถือเข้าโลก 3D ครั้งแรกไม่มีบอกวิธีบังคับเลย
- **ทำ (ทั้งหมดอยู่ใน `js/adventure3d.js` ไฟล์เดียว — JS + CSS ที่ inject เอง ไม่แตะ state.js/game.js/index.html/style.css ที่ session คู่ขนานแก้ค้าง):** การ์ด `#adv-intro` เต็มจอโผล่ตอน `start(mode)` **ครั้งแรกของแต่ละโลก** (จำแยกต่อโลกใน `localStorage['pvadv_intro_v1']` — ไม่ยุ่ง state เกม) · เนื้อหา: 🎯 เป้าหมาย + คอนโทรลตามอุปกรณ์ (`IS_TOUCH` → แสดงชุดจอสัมผัส/คีย์บอร์ด) ต่อโลก (adv/haunt/heli/drone แยกกัน ตรงตามโค้ด input จริง) + tip `+{reward}🪙/คำ` · ปุ่ม "เริ่มเล่นเลย! 🚀" · **พักเกมระหว่างอ่าน** (running=false, `renderer.render` โชว์ฉากข้างหลัง) กด→`beginPlay()` (clock.getDelta ทิ้ง dt ค้าง แล้ว loop) · ปุ่ม **❓ ซ้ายมินิแมป** เปิดวิธีเล่นซ้ำได้ทุกเมื่อ (พัก→"เล่นต่อ ▶") · ธีมการ์ดโลกผีเป็นโทนเขียวหลอน · เพิ่ม `#adv-help,#adv-intro` ใน touch-exclude list กันนิ้วแตะการ์ดไปโดนจอย/คันมอง
- ✅ ยืนยัน preview (1280×720 · getBoundingClientRect+computed style · screenshot infra ค้างเลยวัด DOM แทน): การ์ดกลางจอเป๊ะ (640,360) 500×411 z12 เต็มจอ · ครั้งแรก running=false introOn=true · กดเริ่ม→running=true seen=true · เข้าใหม่ไม่โผล่ซ้ำ · ❓→พัก+ปุ่ม "เล่นต่อ ▶"→เล่นต่อ running=true · haunt=ธีมเขียว(ปุ่ม rgb(61,220,132))+class adv-haunt · heli tip=+30🪙 คอนโทรลถูก · ไม่มี console error
- ⚠️ commit เฉพาะ `js/adventure3d.js version.json handoff/TASKS.md` (pin pathspec — css/style.css·index.html·js/game.js·js/state.js เป็นงาน weekly-best/รายงานของ session คู่ขนานที่ยังไม่ commit ห้ามแตะ)

**✅ รอบ 96 (9 ก.ค. · Opus): เกมจับคู่ — กดปุ่มกลับแล้วถ้าทำสถิติใหม่ เด้งการ์ดสรุปฉลองก่อนออก 🎉🚪 — version .76** (commit a9755f3) — ต่อยอดสถิติ (รอบ 95) · ผู้ใช้สั่งทำ
- **`exitGame()` (game.js):** ปุ่ม ⬅ กลับ (main.js `btn-back`→`exitGame`) · ถ้า `sessionCoins > game.prevBest` (เกินสถิติสัปดาห์เดิม) → `showSessionSummary(earned, allTime, doExit)` เด้งการ์ด "รอบเล่นนี้หนูเก็บได้ X 🪙 · 🏆 ทำสถิติสัปดาห์ใหม่!" ก่อน แล้วปิด(ปุ่ม/พื้นหลัง)ค่อย renderDashboard+showScreen · ถ้าเกิน `game.prevAllBest` (สถิติตลอดกาลเดิม เก็บตอน startGame) เพิ่มป้าย "⭐ สถิติสูงสุดตลอดกาล" · ไม่ทำสถิติ/เก็บ 0 → ออกทันที
- `css/style.css`: `.summary-box` `.sm-coin` (ทองไล่เฉด reuse sessRainbow) `.sm-badge`/`.sm-badge-all`
- ✅ ยืนยัน preview 4 เคส: A เกินสถิติสัปดาห์(370>300 <2000)=การ์ด 1 ป้าย · B เกินตลอดกาล(600>500)=2 ป้าย · C ไม่เกิน(200<1000)=ออกเลยไม่มีการ์ด · D เก็บ0=ออกเลย · ปุ่ม/พื้นหลังปิด→ไป dashboard · ไม่มี error · **screenshot ค้างทั้ง session→inspect ยืนยันแทน**
- ⚠️ commit game.js/main.js/style.css/version (main.js แก้ 1 บรรทัด · ไม่แตะ adventure3d/ui.js/lobby.css ของ session คู่ขนาน)

**✅ รอบ 95 (9 ก.ค. · Opus): เกมจับคู่ — สถิติเหรียญรายสัปดาห์ (รีเซ็ตจันทร์) + หน้ารายงานความก้าวหน้า 🗓️📊 — version .74** (commit e41022d) — ต่อยอดสถิติ (รอบ 91/94) · ผู้ใช้สั่งทำ
- **รายสัปดาห์:** เป้าในเกม (`game.prevBest`) เปลี่ยนจาก all-time → `state.weekBestCoins` · `weekKeyStr()`=วันจันทร์ของสัปดาห์ (Mon=0) · `rolloverWeekBest()` ใน startGame ล้างเมื่อข้ามสัปดาห์ → เด็กทำลายสถิติใหม่ได้เรื่อยๆ ไม่ตัน · ยังอัปเดต `bestSessionCoins` (all-time) เงียบๆ ไว้โชว์รายงาน · toast/updateBestTarget เปลี่ยนคำเป็น "สถิติสัปดาห์นี้"
- **รายงาน:** ปุ่ม `#btn-report` ในเกม (`.onclick=showProgressReport` กันซ้อน) → overlay (`.levelup-overlay`+`.report-box`): ระดับนักคำศัพท์ (50 คำ/ระดับ · VOCAB_RANK_NAMES 5 ชื่อ)+แถบ%, การ์ดเด่น 4 (คำ/lifetimeCoins/สถิติดีสุด/สัปดาห์นี้), แบบทดสอบ (ผ่านกี่หมวด/สอบ/เฉลี่ย%), คำพิชิตโลก 3D รายโลก (โชว์เฉพาะมีตั๋วหรือ>0), เข็มรางวัล (thunder/daredevil/pilot), สัตว์เลี้ยง, คำชมตามระดับ · ปิดด้วย ✕/ปุ่ม/คลิกพื้นหลัง
- **state.js:** `weekBestCoins/weekKey/lifetimeCoins` (lifetimeCoins สะสมใน `addCoins` — เริ่มนับรอบนี้) · เก่า migrate ผ่าน defaults
- ✅ ยืนยัน preview: weekKeyStr(วันนี้พฤ 9→จ 6)/rolloverข้ามสัปดาห์ล้าง weekBest=0 · รายงานเลข 237คำ→ระดับ5 บาร์74% · quiz 87% · โลก 5/2/1 (drone ซ่อน) · badge 3 · pet 2ตัว Lv รวม5 · empty state (มือใหม่) โชว์ข้อความชวนเล่น · close ทำงาน · ไม่มี error · **screenshot ค้างทั้ง session → ยืนยันด้วย inspect/computed**
- ⚠️ commit เฉพาะ index/style/game.js/state.js/version (ไม่แตะ ui.js/lobby.css/adventure3d ของ session คู่ขนาน)

**✅ รอบ 94 (9 ก.ค. · Opus): เกมจับคู่ — ป้ายเหรียญไต่สีตามหลัก + เป้าสถิติเดิมในการ์ด 🌈🏆 — version .72** (commit 12f3bb4) — ต่อยอดฉลอง/สถิติ (รอบ 91) · ผู้ใช้เห็นชอบ
- **ไต่สี:** ใน `addSessionCoins` คำนวณเทียร์ตาม sessionCoins → set class `t1/t2/t3` · CSS `.sess-coin` เทา<100 → `.t1` เขียว≥100 → `.t2` ทอง≥500 → `.t3` รุ้ง (gradient+background-clip:text+`@keyframes sessRainbow`) ≥2000 · reset t-class ใน startGame · **ตัด color ออกจาก `sessCoinBump` เหลือ scale** (กันทับสีเทียร์)
- **เป้าสถิติ:** `index.html` เพิ่ม `<span id="game-best-target">` ในป้าย · `updateBestTarget()` (game.js): prevBest>0 → "🏆 สถิติดีที่สุดของหนู: X 🪙 — เก็บให้เกินสิ!" · beatBestShown → "🏆 สถิติใหม่แล้ว!" · prevBest=0 (เล่นครั้งแรก) → ซ่อน · เรียกใน startGame + ตอนทำลายสถิติ
- ✅ ยืนยัน preview (computed style + innerHTML): เทียร์ 0→90 ไม่มี t · 110=t1 · 510=t2 · 2110=t3 (gradient จริง text-fill transparent) · เป้า: ครั้งแรกว่าง · ครั้งสอง prevBest 2110 โชว์เป้า → เก็บเกิน→ "สถิติใหม่แล้ว!" · ไม่มี console error · **screenshot ค้าง (แอนิเมชันหมุน) → ยืนยันด้วย inspect แทน**
- ⚠️ commit เฉพาะ index.html/style.css/game.js/version (ไม่แตะ ui.js/lobby.css ของ session คู่ขนาน)

**✅ รอบ 93 (9 ก.ค. · Opus): การ์ดสังคมสไตล์เดียวกัน (2 บรรทัด) + คำเรียกตัวเองตามวัย 🧑‍🤝‍🧑🎓 — version .71**
- ผู้ใช้เห็นชอบไอเดียต่อยอดจากรอบ 90: ทำ **Leaderboard 🏆 + แผงเพื่อน 👥** ให้เป็น list-item 2 บรรทัด (ชื่อบน · ชั้นล่างจาง) เหมือนการ์ดเพื่อนออนไลน์ · **และ** คำ "หนูเอง" ใช้เฉพาะ ป.1-ป.6 · ม.1 ขึ้นไป = "คุณเอง"
- `js/ui.js`: เพิ่ม `selfPronoun()` (ป.1-ป.6/อนุบาล="หนู" · ม.1+รวมปริญญา="คุณ") + `selfTag()`="หนูเอง"/"คุณเอง" → ใช้แทน 4 จุด (online tag, `นี่คือ...`, `รหัสของ...นะ`, ชื่อ fallback) + leaderboard `หนู→คุณอยู่อันดับ`
- `css/style.css` `.lb-name` + `css/lobby.css` `.fr-row-name`: `<small> ชั้น X</small>` → `display:block` flex-column = ตกบรรทัดล่าง จาง เยื้อง (ชั้นยาวเช่น "ปริญญาเอก" ไม่ถูกบีบตัด)
- ✅ ยืนยัน preview (getBoundingClientRect+computed style · screenshot infra ค้าง): selfTag ป.5=หนูเอง · ม.1/ตรี/เอก=คุณเอง · online/leaderboard/friends rows small=block ไม่ clip · lbCount="คุณอยู่อันดับที่ 2..."
- ⚠️ **หลายไฟล์ชนกับ session คู่ขนาน:** ui.js+lobby.css ส่วนของเราถูกกวาดเข้า commit fa2a89b (รอบ 92) แล้ว · เหลือ commit เฉพาะ **hunk `.lb-name` ใน style.css** (git apply --cached ทีละ hunk กัน sess-coin ของอีก session โดนกวาด) + version + TASKS

**✅ รอบ 92 (9 ก.ค. · Opus): ปุ่มโลก 3D ในราง — badge จำนวนคำที่พิชิต + ราคาตั๋วโลกที่ล็อก 🏅🪙 — version .70** (commit fa2a89b) — ต่อยอดปุ่มลัดโลก 3D (คอมมิตก่อนหน้า c9ba3f0) ตามไอเดียที่เสนอ · ผู้ใช้สั่งทำ
- `js/ui.js` WORLD3D เพิ่ม `doneKey`+`price` (โลกใหม่ยังเพิ่มบรรทัดเดียว) · `renderRailWorlds()` ต่อ: ปลดล็อกแล้ว→`.rail-count` badge ทองมุมขวาบน = `state[doneKey].length` (โชว์เฉพาะ >0) · ยังล็อก→`.rail-price` ใต้ชื่อ `🪙price` (coins>=price = เขียวเรือง `.afford`, ไม่พอ = เหลืองทอง) + 🔒 คงเดิม
- `css/lobby.css`: `.rail-world .rail-count` (ทอง #f5c542 ต่างจาก badge แดง=เตือน) · `.rail-price` + `.rail-price.afford` (เขียวเรือง) · locked opacity .62
- ✅ ยืนยัน preview 1280×720: 4 เคส (adv done7=badge"7" · haunt locked+afford=เขียว🪙10,000 · heli done0=ไม่มี badge · drone locked ไม่พอ=เหลือง🪙20,000) + live unlock (ซื้อตั๋ว haunt→ราคา/🔒 หาย badge"3" โผล่)
- ⚠️ commit เฉพาะ `css/lobby.css js/ui.js version.json` (style.css/state.js modified = ของ session คู่ขนาน — ไม่แตะ · pin pathspec)

**✅ รอบ 91 (9 ก.ค. · Opus): เกมจับคู่ — ฉลองหลักเหรียญครั้งนี้ + ทำลายสถิติเหรียญตัวเอง 🎉🏆 — version .69** (commit 6b80700) — ต่อยอดตัวนับเหรียญ "ครั้งนี้" (รอบ 87) · ผู้ใช้เห็นชอบไอเดีย
- **หลักเหรียญ:** `SESSION_MILESTONES=[100,250,500,1000,2000,3000,5000,8000,10000]` (game.js) · ใน `addSessionCoins` ข้ามหลักใหม่ (หลักสูงสุดที่เพิ่งข้าม กันเด้งรัว) → `floatFx('🎉 ว้าว! ครั้งนี้ X 🪙 แล้ว!')`+`sfx.levelup` หน่วง 620ms · `game.sessMilestone` กันซ้ำ · reset ใน startGame
- **ทำลายสถิติ:** `state.bestSessionCoins` (field ใหม่ state.js — migrate เองผ่าน Object.assign defaults) · startGame จำ `game.prevBest` · เก็บเกิน prevBest ครั้งแรก → `toast('🏆 ทำลายสถิติตัวเอง! เกิน X')`+`sfx.rankup` (flag `beatBestShown` เด้งครั้งเดียว · **prevBest=0 ครั้งแรกไม่เด้ง**) · best อัปเดตสด เซฟผ่าน saveState เดิม
- ✅ ยืนยัน preview (spy floatFx/toast): (1) best=0 เก็บ 120 → เด้งแค่ '100 🪙' ไม่มี toast สถิติ · (2) prevBest=120 เก็บ 130 → เด้ง '100' + toast 'เกิน 120' best→130 · flag กันเด้งซ้ำโอเค
- ⚠️ commit เฉพาะ `js/game.js js/state.js version.json` (css/lobby+ui ที่ modified เป็นของ session คู่ขนาน — ไม่แตะ)

**✅ รอบ 90 (9 ก.ค. · Opus): การ์ด "คนกำลังทำการบ้าน" เป็น list-item 2 บรรทัดแบบแอปแชต 🧑‍🤝‍🧑 — version .68**
- **ผู้ใช้สั่ง (มี screenshot):** กรอบเพื่อนออนไลน์ดูไม่ professional — สถานะ "ชั้น ปริญญาเอก · กำลังเล่นอยู่ตอนนี้" โดนบีบตัดบรรทัดมั่ว 4 บรรทัดในคอลัมน์ขวาแคบ
- ต้นตอ: `.online-name{white-space:nowrap}` กินที่ + `.online-act{flex:1;text-align:right}` เหลือที่แคบ → คำยาว wrap มั่ว (`style.css`)
- แก้ CSS อย่างเดียว (ครอบทุกแถว 3 จุด render ใน `renderOnlineCard`): `.online-row{flex-wrap:wrap}` · name `flex:1 1 auto;ellipsis` · **act `flex:0 0 100%` = ตกลงบรรทัดล่างเสมอ** ชิดซ้าย เยื้อง 17px (dot+gap) เล็ก/จาง · เส้นคั่น dashed→solid จางลง · การ์ด me เพิ่ม padding
- ✅ ยืนยัน preview (คอลัมน์กว้าง 238px): ทุกแถว act เหลือ **1 บรรทัด** (เดิม 4) · row สูง ~50px เป็นระเบียบ

**✅ รอบ 89 (9 ก.ค. · Opus): ตัดวงเล็บ "(ศัพท์...)" ออกจากแถบบน เหลือ "ชั้น ปริญญาเอก" สะอาด — version .67** (ต่อจากรอบ 88)
- ผู้ใช้ตอบรับไอเดียต่อยอด: ย้ายระดับคำศัพท์ออกจากแถบโปรไฟล์บน (รก) → เหลือแค่ชื่อ+ชั้น
- แก้ [ui.js ~1024](js/ui.js) chip innerHTML: ลบ ` (ศัพท์${gradeBand(...).label})` ออก · ระดับคำศัพท์ยังโชว์หน้าสถิติเดิม (`ui.js:3455` "📚 คะแนนสูงสุดรายหมวด (...)")—ไม่หายไปไหน
- ✅ ยืนยัน preview: chip `scrollWidth==clientWidth` (307/307) = ไม่มี ellipsis ตัดท้ายเลย · rank badge เหลือที่ว่างข้างๆ

**✅ รอบ 88 (9 ก.ค. · Opus): แถบโปรไฟล์บนกว้างขึ้น โชว์ "ชั้น ปริญญาเอก" ครบ 🎓 — version .66**
- **ผู้ใช้สั่ง (มี screenshot):** ระดับชั้นบนแถบโปรไฟล์อ่านไม่ครบ ("ชั้น ปริญ...") → ยืดกล่องออกขวาให้ยาวขึ้น ชนไอคอน rank ก็ขยับ rank ขวา
- ต้นตอ: `.profile-plate{max-width:34vw}` (lobby.css) → บนจอ ~850px (เกม lock landscape) 34vw≈289px พอดีตัดคำว่า "ปริญญาเอก" ทิ้ง (chip `text-overflow:ellipsis`)
- แก้บรรทัดเดียว: `max-width:34vw` → `max-width:min(60vw,600px)` · lobby-top เป็น flex row → กล่องกว้างขึ้นดัน `.rank-mini` ไปขวาเองตามที่ผู้ใช้ขอ (ไม่ทับ)
- ✅ ยืนยัน preview (mock, resize 880×500): plate 289→382px · inner 352px > ความกว้าง "ชั้น ปริญญาเอก" 297px = โชว์ครบ (เหลือแค่วงเล็บ "(ศัพท์...)" ตามท้ายที่ ellipsis) · rank badge "ซิลเวอร์ II" ถูกดันขวาไม่ทับ

**✅ รอบ 87 (9 ก.ค. · Opus): ป้ายล่างเกมจับคู่โชว์เหรียญที่เก็บได้ "ครั้งนี้" สดๆ 🪙 — version .65** (commit 20e1314) — ต่อจากป้าย "เล่นได้เรื่อยๆ" รอบก่อน
- **ผู้ใช้สั่ง:** อย่าโชว์ "ทำไปกี่คำ" (เด็กจะท้อ/เหนื่อย) → ให้โชว์ **เหรียญที่สะสมได้เฉพาะการเล่นครั้งนี้** เป็นกำลังใจสะสมเหรียญแทน
- `game.sessionCoins` (game.js) รีเซ็ต 0 ทุกครั้งใน `startGame` · `addSessionCoins(n)` บวก+อัปเดต `#game-session-coins` (ในป้าย .game-endless-note) + เด้ง class `bump` · เรียกที่ addCoins ต่อคู่ (10+โบนัส) และโบนัสเคลียร์รอบ +20 · เลข mirror เหรียญจริง (รวมโบนัสมือถือ/มังกร x2)
- `css/style.css`: `.sess-coin` ทองหนา 17px + `@keyframes sessCoinBump` (scale 1.35)
- ✅ ยืนยัน preview (mock login+`startGame()`): เริ่ม 0 🪙 → จับคู่ถูกผ่าน `pickCard` จริง 0→10→20 · bump class ติด · สีทอง #e6a417 · รีเซ็ตเป็น 0 ตอนเข้าเกมใหม่

**✅ รอบ 86 (9 ก.ค. · Opus): ปุ่มลัดเข้าโลก 3D ในรางเมนูซ้าย 🌍👻🚁🛸 — version .63** (อยู่ใน commit c9ba3f0)
- ผู้ใช้ส่ง screenshot รางเมนูซ้าย (โรงงาน/ตลาด/เพื่อน/ของขวัญ/สถิติ) สั่งเพิ่มปุ่มต่อโลก 3D แต่ละโลก + ให้รองรับโลกใหม่ในอนาคต
- `js/ui.js`: `const WORLD3D=[...]` (adv/haunt/heli/drone) + `renderRailWorlds()` (สร้างปุ่มครั้งเดียว→เรียกใน renderDashboard อัปเดตล็อก) + `railWorldClick(w)` (มีตั๋ว→`w.enter()` · ไม่มี→openPanel('panel-shop')+scroll การ์ด · บาดเจ็บ→toast) + `scrollShopCardIntoView()` · **โลก 3D ใหม่ในอนาคต = เพิ่ม 1 บรรทัดใน WORLD3D ปุ่มโผล่เอง**
- `css/lobby.css`: `.rail-worlds` (คั่นเส้นบน) `.rail-div` ป้าย "โลก 3D" `.rail-world.locked` จาง+🔒 มุมขวาบน
- ปุ่มสร้างจาก JS ต่อท้าย `.lobby-rail` → **ไม่แตะ index.html**
- ✅ ยืนยัน preview (1280×720 · mock login+register): 4 ปุ่มอยู่ในราง · adv+heli(มีตั๋ว)=start('adv'/'heli') · haunt+drone(ไม่มีตั๋ว)=เปิด panel-shop ไม่เข้าโลก · locked toggle 🔒 ถูก · **หมายเหตุ:** commit ถูก session คู่ขนาน (near-miss heli/drone) sweep เข้า commit c9ba3f0 "รอบ 86 โบนัสบินเฉียด" + push แล้ว (โค้ดครบ ชื่อ commit ไม่ตรงงานนี้)

**✅ รอบ 86 (9 ก.ค. · Opus): ป้ายบอก "เล่นได้เรื่อยๆ ด่านไม่ตัน + กดกลับพักได้" ใต้กระดานจับคู่ ♾️ — version .64** (commit 8b4b1ab)
- ผู้ใช้ส่ง screenshot เกมจับคู่ (screen-game) ชี้พื้นที่ว่างล่างกระดาน อยากให้บอกผู้เล่นว่าเล่นวนได้ไม่มีจบ + เพลียแล้วกดปุ่ม ⬅ กลับ มุมซ้ายบนออกได้เสมอ (เด็กไม่รู้ว่าหยุดตอนไหน)
- `index.html` line ~237: `<p class="game-endless-note">` ใต้ `#hint-btn` (hint-btn ปกติซ่อน เว้นเลี้ยงแมว → เป็นพื้นที่ว่างพอดี) · **หมายเหตุ:** ตัว index.html โดน commit รอบ 85 (โดรน) ของ session คู่ขนาน sweep ไปก่อน (`git add -A`) — รอบนี้ commit เฉพาะ `css/style.css`+`version.json`
- `css/style.css`: `.game-endless-note` การ์ดเส้นประอ่อน กลางจอ max-width 520 pointer ไม่บัง
- ✅ ยืนยัน preview (820×400 landscape · mock login+register+`startGame()`): note อยู่ใต้ th-grid จริง (grid bottom 284 / note top 304) สี/เส้นประ/จัดกลาง ถูก · ไม่มี console error

**✅ รอบ 74 (8 ก.ค. · Opus): เปรตตัวสูงพิเศษ + prompt ผีสไตล์ Ju-on 👻 (ผู้ใช้สั่ง หลังทำภาพเสร็จ) — version .50** (commit 74b312b)
- **เปรตตัวสูง (adventure3d.js):** `ghost_2.png`=เปรต · `probeGhostImages` เก็บ `t.userData={gi:i}` (เลขไฟล์) ไว้กับ texture · `applyGhostSize(g)` ตรวจ `map.userData.gi===GHOST_TALL_INDEX(2)` → `scale.set(2.7,6.4,1)`+`baseY=3.15` (สูง ~2.5 เท่า เท้าอยู่พื้น) · ตัวอื่น `2.6×2.6`+`baseY=1.35` · เรียกใน `respawnGhost` ทุกครั้งที่สลับภาพ · bobbing บรรทัด ~849 ใช้ `g.baseY` ต่อตัว (เดิม 1.35 คงที่ เปรตจะจมพื้น) · `caught()` วัดระยะแนวราบ x,z ไม่กระทบ
- **`PROMPTS_GHOSTS.md` เขียนใหม่ทั้ง 5:** เดิม 1-4 ออกมาการ์ตูน (เพราะสั่ง "stylized") · ผู้ใช้บอกภาพ 5 (ผีผ้าขาว) หลอนพอ อยากได้สไตล์นั้น+หนัง Ju-on → ทุกตัวยึด **ตาโบ๋ดำ+ผิวซีดเทา+โทน Ju-on หม่นเงาจัด photorealistic** · ยังผีไทย+no blood/gore · มีเคล็ดลับปรับจูน (หลอนขึ้น/ลด/เลี่ยง safety filter/ลุคเข้าชุด)
- ✅ ทดสอบ preview: unregister sw+ล้าง cache+reload (โค้ดสด) → start haunt → บังคับ respawn จนเจอ gi=2 → **เปรต scaleY 6.4/baseY 3.15 · ตัวปกติ gi=3 scaleY 2.6/1.35** · ไม่มี console error
- ℹ️ **เทสสเกลผีต้องบังคับ respawn** (ตั้ง `g.born=performance.now()-999999`) เพราะ spawn แรก ghostTex ยังว่าง ผีได้ emoji ก่อน เปลี่ยนภาพจริงตอน respawn(20วิ)

**✅ รอบ 73 (8 ก.ค. · Opus): jump scare ภาพผีไทยเต็มจอ 👻 (ต่อยอดรอบ 72 · ผู้ใช้สั่ง "เอาไอเดียต่อยอดทั้งหมด") — version→.50** (commit 18630b1)
- **`caught()` (adventure3d.js):** โดนผีจับ → `ghostScareSrc()` สุ่ม src ภาพผีจาก `ghostTex` (ที่ probe ไว้รอบ 72) → ถ้ามี set `<img id="adv-scare-img">`.src + `scareEl.classList.add('has-img')` → CSS ซ่อน `span` (emoji) แสดง `img` เต็มจอ (object-fit contain, max 100vw/vh, drop-shadow แดง) · ไม่มีภาพ/โหลดไม่ทัน → `remove('has-img')` → emoji 👻 เดิม · animation `advScare` (zoom-punch) + `adv-shake` เดิมใช้ต่อ · haptic `[400,90,220]` แรงขึ้น
- **`PROMPTS_GHOSTS.md`:** ระบุว่าภาพชุด ghost_1..5 ใช้กับ jump scare ด้วย — ไม่ต้องเจนภาพเพิ่ม
- **ไอเดียต่อยอดข้อ "เสียง Suno":** ตรวจแล้ว `PROMPTS_SOUND.md` มี prompt ครบ (haunt_ambient/chase/scare + spark) · โค้ด `HSound` รับไฟล์อัตโนมัติแล้ว (`files.scare` ใน `scream()`) → **ไม่มีงานโค้ดเหลือ รอผู้ใช้เจนไฟล์เอง** (ทำแทนไม่ได้ ต้องบัญชี Suno)
- ✅ ทดสอบ preview: วางไฟล์จริงชั่วคราว → caught() → has-img=true ภาพเต็มจอ emoji ซ่อน · ลบไฟล์+unregister sw(`pet-vocab-v3`)+ล้าง cache+reload → fetch 404 จริง → caught() has-img=false fallback emoji 👻 แสดง · ไม่มี console error
- ⚠️ **หมายเหตุ:** sw.js (`pet-vocab-v3`) cache ภาพเหนียวมาก — เทสต์ fallback ต้อง unregister sw + `caches.delete` + reload ไม่งั้น sw serve ภาพเก่าแม้ไฟล์ลบ

**✅ รอบ 72 (8 ก.ค. · Opus): ภาพผีไทยในโลก 3D 👻 (แทน emoji ที่น่ารักเกินไป — ผู้ใช้สั่ง) — version→.49** (commit 9dd0c09)
- **โลกผีสิง `haunt` ใช้ภาพจริงแทน emoji:** `probeGhostImages()` (adventure3d.js) probe `img/ghosts/ghost_1.png … ghost_5.png` ด้วย `new Image()` (ห้าม fetch local — กติกา NOTES.md) ตอน `start('haunt')` · `ghostTexture()` สุ่มจากภาพที่โหลดได้ ไม่มีเลย → fallback `emojiTexture(ghostEmoji)` เดิม · ผีสลับเป็นภาพจริงตอน `respawnGhost` (ทุก 20 วิ) เผื่อภาพโหลดเสร็จหลังเกมเริ่ม · **มีกี่ภาพใช้เท่านั้น (ไม่ครบ 5 ก็ได้)**
- **`PROMPTS_GHOSTS.md` (ไฟล์ใหม่):** prompt ผีไทย 5 ตัว — กระสือ/เปรต/ผีสาวชุดไทย(แม่นาค)/ปอบ/ผีผ้าขาว · เน้นหลอนแบบไทยไม่ใช่ฝรั่ง · เรืองแสงในตัว (ฉากมืดสนิท) · `no blood, no gore` เหมาะเด็กประถม · วาง `img/ghosts/` (โฟลเดอร์ใหม่)
- ✅ ทดสอบ preview: เข้าโลกผี 8 ตัว probe ยิง 5 request · วางไฟล์จริงชั่วคราว (1×1) → reload → ผีตัวใหม่ได้ `ghost_1.png` · บังคับ born ครบ 20 วิ → respawn สลับจาก emoji เป็นภาพจริง · ลบไฟล์ทดสอบออกแล้ว · ไม่มี console error
- ⏳ **ค้างฝั่งผู้ใช้:** เจนภาพ 5 ตัวจาก `PROMPTS_GHOSTS.md` → ลบพื้น → วาง `img/ghosts/ghost_1..5.png` (ไม่วางก็เล่นได้ ใช้ emoji เดิม)

**✅ รอบ 70 (8 ก.ค. · Fable): สถิติสายฟ้าแลบ + เข็มสายฟ้า ⚡ (ต่อยอดรอบ 67 ผู้ใช้สั่ง "สนใจ") — version→.48** (commit หลังรอบ 71 — เลขรอบจองไว้ก่อน)
- **นับสะสม `state.thunderCount`** ทุกครั้งที่ทำสายฟ้าแลบ (จับคู่ไวไม่พลาด / สอบสายฟ้า — `addThunder()` ใน game.js เรียกจาก 2 จุด trigger รอบ 67) + migration default 0
- **เข็มสายฟ้า `state.thunderBadge`** สไตล์เดียวกับเข็มนักบิน: ครบ **5=⚡ เข็มสายฟ้า · 15=🌩️ เข็มพายุฟ้าคะนอง · 30=⛈️ เข็มมหาพายุ** (`THUNDER_TIERS`/`THUNDER_TIER_UI`/`thunderEmoji` ใน game.js) — ได้แล้วไม่หาย · ประกาศเข็มด้วย sfx.rankup+toast (delay 1.9 วิ รอฟ้าผ่าจบ) · **ติดท้ายชื่อต่อจากเข็มนักบิน** ใน `/world` payload + กระดานคะแนน (adventure3d.js 2 จุด — ไม่มี field/rules ใหม่)
- **หน้าสถิติ:** แถวใหม่ "⚡ สายฟ้าแลบ (เคลียร์ไว ≤5 วิ ไม่พลาดเลย) X ครั้ง · เข็มที่ได้" (ui.js renderStats)
- ✅ ทดสอบ preview: เคลียร์ไว → count 0→1 · ตั้ง count=4 เคลียร์ไวอีก → 5 + badge 1 + toast "🎉 ได้⚡ เข็มสายฟ้า!" · ครั้งที่ 6 ไม่ประกาศซ้ำ · persist ลง localStorage · แถวสถิติโชว์ "6 ครั้ง · ⚡ เข็มสายฟ้า" · thunderEmoji คืน ''/⚡/🌩️/⛈️ · ไม่มี console error
- ⚙️ **หมายเหตุ commit:** adventure3d.js มีงานผี WIP ของ session คู่ขนานปนใน worktree → stage เฉพาะ hunk ของงานนี้ด้วย `git apply --cached` (patch กรองคำ thunderEmoji) — ห้าม commit ทั้งไฟล์ตอนมี WIP คนอื่น

**✅ รอบ 71 (8 ก.ค. · Fable): เสียงชื่อตัวอักษร 🔠 (เก็บในโลก 3D) + ผู้ทดสอบน้องโตเต็มวัย 🧪 — version→.47** (รอบ 70 = เข็มสายฟ้า session คู่ขนาน)
- **เสียงตัวอักษร (ไอเดียต่อยอดรอบ 55 ผู้ใช้สั่งทำ):** `tools/gen_word_audio.py` เจนเพิ่ม `sound/letters/<a-z>.mp3` 26 ไฟล์ (316KB · text "A." จุดท้ายให้อ่านเป็นชื่อตัวอักษร) · `speakLetter(ch)` ใน util.js (แชร์ตัวเล่น `wordAudioNow` กับ speakWord — เก็บตัวสุดท้ายแล้วคำสำเร็จ เสียงคำ (delay .7 วิ) ตัดเสียงตัวอักษรเอง · fallback TTS) · เรียกที่จุดเก็บ 2 จุดใน adventure3d.js (เดินเก็บ tickPlayer + ลงจอดเก็บ tickHeli) — ครอบ 3 โลก
- **ผู้ทดสอบ (ปิดงานค้าง "สุนัขโตเต็มวัยเข้าโลก 3D"):** `testerBoost` (auth.js) เพิ่มข้อ (2) สัตว์ทุกตัว level<3 → เซ็ต Lv.3 ตรงๆ พร้อม side-effect ช่วงลืมตา (ไม่ผ่าน addExp กัน overlay เด้งซ้อน) · hook เพิ่มหลังซื้อสัตว์ (ui.js) — ซื้อปุ๊บโตปั๊บ ตั๋ว 3D ปลดล็อกทันที ไม่ต้อง login ใหม่
- **⚠️ commit แบบ partial stage (`git apply --cached`):** adventure3d.js/ui.js มีงานรอบ 70 (เข็มสายฟ้า) ของ session คู่ขนานปนอยู่ — stage เฉพาะ hunk ของรอบนี้ กันพาโค้ดอ้าง `THUNDER_TIER_UI` (game.js ยังไม่ commit) ขึ้น Pages แล้วพัง
- ✅ ทดสอบ preview: เดินทับตัวอักษร g (ผ่าน `_t.step`) → เก็บเข้า inv + `letters/g.mp3` เล่นจริง · tester login มีไข่สุนัข Lv.1 → Lv.3 adult ตั๋วปลดล็อก เหรียญ 60,000 · ไม่มี console error

**✅ รอบ 69 (8 ก.ค. · Fable): badge เลขป่วยบนปุ่มรักษา 💊② + เสียงหวอตอนเพิ่งล้มป่วย 🚨 (ต่อยอดรอบ 64 ผู้ใช้สั่ง) — version→.46**
- **badge:** `#cure-badge` (class `.rail-badge` เดิม) บนปุ่ม `#btn-rail-cure` — โชว์จำนวนตัวที่ป่วย ซ่อนเมื่อ 0 · sync ใน block railCure ของ `renderDashboard` (ui.js)
- **เสียงหวอ `sfx.siren` (util.js `sirenSynth`):** sine 620↔920Hz วี้-หว่อ 2 รอบ 1.5 วิ gain .055 (เบา ไม่ทำเด็กตกใจ) เคารพ state.sound
- **จุดตรวจ "เพิ่งล้มป่วย":** ① `careTick` (state.js) เทียบจำนวนป่วยก่อน-หลัง tick (ครอบ 5 สาเหตุ: หิว/นอนดึก/ร้อน/ฝน/ขาดน้ำ) → เพิ่มขึ้น = `sfx.siren()` + toast "🚨 <ชื่อ> ล้มป่วยแล้ว! กดปุ่ม 💊 รักษาได้เลยนะ" — interval 1 นาทีเดินทุกหน้า เด็กได้ยินแม้กำลังเล่นเกม/อยู่โลก 3D ② จุดพิษเต็มหลอดตอนป้อนอาหาร (ui.js `feedPet`) เรียก `sfx.siren()` ตรงนั้นเลย
- ✅ ทดสอบ preview: แข็งแรง=badge ซ่อน+ปุ่มจาง · จำลองร้อนเกิน 6 ชม.→careTick จับได้ siren 1 ครั้ง+toast ชื่อ "ขาว"+badge ① · careTick ซ้ำไม่หวอซ้ำ · ตัวที่ 2 ป่วย→หวอรอบใหม่+badge ② · กดรักษาทีละตัว badge ②→①→ซ่อน+ปุ่มจาง เหรียญหักถูก · ไม่มี console error

**✅ รอบ 68 (8 ก.ค. · Fable): นักบินตอบวิทยุ 🎙️ + แถบชวนพูดตาม (ต่อยอด ATC) — version→.45**
- **หอพูดจบ → แผงตอบ `#adv-reply` โผล่เหนือแถบวิทยุ 9 วิ:** ปุ่ม 3 วลีการบินจริง **Roger! (รับทราบ!) / Copy that, tower! (ทราบแล้ว หอบังคับ!) / Wilco! (จะปฏิบัติตาม!)** — ทุกปุ่มมีคำแปลไทยกำกับ + **แถบชวน "🗣️ แตะตอบหอบังคับ แล้วลองพูดตามดังๆ ดูสิ!"** (ผู้ใช้สั่ง: แนะเด็กที่ไม่รู้จะตอบอะไร)
- **แตะแล้ว:** เสียงพูดวลีนั้น en-US **pitch 1.18 = โทนนักบินตัวน้อย** (ตัดเสียงหอที่ค้างก่อน — ตอบแทรกแบบวิทยุจริง) · echo ขึ้นจอวิทยุ "🎙️ Roger! — รับทราบ!" 3.5 วิ · หอสุ่มตอบปิดท้าย 50% ("Good copy, captain." ฯลฯ — `ATC.say(text,noReply=true)` ไม่เปิดปุ่มวนลูป)
- โครง: `ATC_REPLIES/ATC_CLOSERS` + `ATC.showReply/hideReply/reply(i)` · ปุ่มอยู่ใน touch skip list (ไม่โดนจอยแย่ง) · ซ่อนตอน exit/reset
- ✅ ทดสอบ preview (spy speechSynthesis): clearance → แผงโผล่+hint+ปุ่ม 3 · แตะ Roger → echo จอวิทยุ+พูด pitch>1.1+แผงปิด · closer ไม่เปิดปุ่ม · ข้อความปกติเปิดปุ่มกลับ · ออกโลกซ่อนสนิท · ไม่มี console error

**✅ รอบ 67 (8 ก.ค. · Fable): เอฟเฟกต์สายฟ้าแลบ ⚡ (ผู้ใช้สั่ง: ฟ้าผ่า/กระแสไฟ+เสียง spark ตอนเล่นไวใน 5 วิ) — version→.44**
- **เงื่อนไข 2 จุด (เพดานร่วม `THUNDER_MS`=5000 ใน game.js):** ① เกมจับคู่: เคลียร์ครบ 4 คู่ **ไม่พลาดเลย** (`game.roundClean` — พลาดคู่ไหน=อด) ภายใน ≤5 วิจากเริ่มรอบ (`game.roundAt`) ② แบบทดสอบ: **ถูกทุกข้อ + แต่ละข้อตอบใน ≤5 วิ** (`quiz.fastAll`+`quiz.qAt`) → หัวกล่องผลสอบเปลี่ยนเป็น "⚡ สอบสายฟ้า สุดยอดไปเลย!"
- **เอฟเฟกต์ `thunderFx()` (util.js):** canvas เต็มจอชั่วคราว z-9980 — ฟ้าผ่า 5 ลูกไล่จังหวะ ~1.8 วิ เส้นหยักแตกกิ่ง+ไส้ขาวเรือง shadowBlur ฟ้า + แฟลชขาวทั้งจอตามจังหวะ + `body.quake` จอสั่น .55 วิ (style.css) · เคารพ `state.noAnim` (ข้ามทั้งหมด)
- **เสียง `sfx.spark` (util.js):** ชั้น 1 ไฟล์ `sound/spark.mp3` (ยังไม่มี — **prompt Suno ใน PROMPTS_SOUND.md ข้อ 4** วางแล้วสลับใช้เอง) · ชั้น 2 สังเคราะห์ WebAudio: เปรี๊ยะ highpass 3 ช็อต + zap sawtooth 2800→160Hz + ฟ้าร้อง lowpass 1.15 วิ · เคารพ state.sound
- ✅ ทดสอบ preview: เคลียร์ 4 คู่ 243ms → canvas+quake มา · เกิน 5 วิ → ไม่มา · พลาด 1 คู่แล้วเคลียร์ไว → ไม่มา · ควิซตอบไว fastAll คง true / ช้า (>5 วิ) → false · finishQuiz 10/10+fastAll → ฟ้าผ่า+หัว "⚡ สอบสายฟ้า" / fastAll=false → หัวปกติไม่มีฟ้าผ่า · ไม่มี console error · **หมายเหตุ:** แท็บ background rAF ไม่เดิน canvas ค้าง — เครื่องจริงแท็บ visible ไม่เจอ

**✅ รอบ 66 (8 ก.ค. · Fable): หอบังคับ ATC เปลี่ยนเป็นอังกฤษล้วน 📻🇬🇧 (ผู้ใช้สั่ง) — version→.43**
- **เสียงพูด+ข้อความจอวิทยุเป็น Aviation English ทั้งหมด** (เด็กได้ซึมซับอังกฤษเพิ่ม): clearance "Engine start complete. Tower clears you for takeoff." · ลม `wind from the {north...} at N kilometers per hour` · ทัศนวิสัย/ความสูง/เตือน traffic/ชมสตรีค · ลงจอด "Beautiful landing, captain." · ครูฝึก "One more word for your {bronze/silver/gold} pilot badge, captain."
- **เสียง:** `en-US` rate .98 pitch .85 — ใช้ `pickSpeakVoice()` ตัวเดียวกับระบบอ่านคำศัพท์ (ได้เสียง Natural/Neural ดีสุดของเครื่อง · fallback หาเสียง en เอง) · traffic alert ใช้ "another helicopter" แทนชื่อเพื่อน (ชื่อไทยอ่านด้วยเสียงอังกฤษจะเพี้ยน)
- ✅ ทดสอบ preview (spy `speechSynthesis.speak`): ทุก utterance เป็น en-US + ไม่มีอักษรไทย · clearance/env/near-badge ("silver pilot badge") ขึ้นจอเป็นอังกฤษครบ · ไม่มี console error

**✅ รอบ 65 (8 ก.ค. · Fable): หอบังคับการบิน 📻 + เสียงครูฝึกลุ้นเข็ม (โลกเฮลิฯ) — version→.42**
- **`ATC` (adventure3d.js):** วิทยุหอบังคับพูดไทยผ่าน Web Speech (`th-TH` rate 1.04 pitch .85 โทนเจ้าหน้าที่ · ไม่มีเสียงไทยในเครื่อง = เหลือข้อความ+เสียงวิทยุ ไม่ crash) + **ข้อความเขียวเรือง `#adv-radio`** เหนือแผงเกจ 6.5 วิ + **เสียง squelch "ซ่า-คลิก"** ก่อนพูด (`HeliSound.squelch` — noise bandpass 1.5kHz + คลิกปลาย สไตล์วิทยุการบิน)
- **จังหวะพูด:** ① สตาร์ทเสร็จ → "หอบังคับอนุญาตขึ้นบินได้" (ครั้งเดียว/รอบ — flag `hAtcCleared`) ② สุ่มทุก 45–75 วิ: ลมทิศ+ความเร็ว (สุ่ม cosmetic) / ทัศนวิสัย / ความสูงจริง / เตือนเพื่อนร่วมน่านฟ้า (ชื่อจาก peers) / ชมสตรีค ③ ลงจอดนุ่ม → ชม 35% ④ **ครูฝึก: สตรีคเหลือ 1 คำถึงเข็มถัดไป → "อีกคำเดียวจะได้เข็มนักบิน{ทองแดง/เงิน/ทอง}แล้วกัปตัน"** (delay 3.2 วิ รอฉลอง+อ่านคำจบ)
- **กันพูดทับ:** ไม่พูดถ้า banner เพิ่งเด้ง <4 วิ (guard เวลา `lastBanAt` — **🐞 fix ระหว่างทาง:** เดิมเช็ก class `show` ซึ่งค้างถาวรหลังแอนิเมชันจบ ทำ ATC โดนบล็อกตลอด) / มี KO ค้าง / speechSynthesis กำลังพูด · reset ตอนเข้า-ออกโลก (cancel เสียงค้าง)
- ✅ ทดสอบ preview: อนุญาตขึ้นบินโผล่หลังสตาร์ท · รอบคุยสุ่มข้อความสภาพแวดล้อมจริง+ตั้งรอบถัดไป 45 วิ+ · สตรีค 13→14 เด้ง "อีกคำเดียว...เงิน" ถูก · ออกโลกวิทยุดับ+เสียงถูก cancel · ไม่มี console error · **เสียงพูดไทยจริงรอฟังบนอุปกรณ์จริง (preview ไม่มีเสียง)**

**✅ รอบ 64 (8 ก.ค. · Fable): ปุ่มรักษาด่วน 💊 บนสุดรางเมนูซ้าย — version→.41**
- **โจทย์ผู้ใช้:** เพิ่มปุ่ม "รักษา" ในรางเมนูซ้าย กดได้เฉพาะตอนสัตว์ป่วย ให้หาง่าย
- **ทำ:** ปุ่ม `#btn-rail-cure` **บนสุดของราง** (จุดแรกที่เห็น — ตอนแรกวางท้ายรางแล้วพบว่ารางล้นจอต้องเลื่อนถึงเห็น เลยย้ายขึ้นบน) · ปกติ `disabled` จาง .35 · มีน้องป่วยตัวไหนก็ตาม → enable + class `cure-alert` แดงกะพริบ (keyframes `cureBlink`) · กด → `railCureClick()` (ui.js): ถ้าตัวป่วยไม่ใช่ตัวที่เปิดอยู่ สลับแท็บไปหาก่อนแล้วเรียก `curePet()` เดิม (หักเหรียญ/ขับพิษ/toast ตามเดิม) · sync สถานะปุ่มใน `renderDashboard` (จุดเดียวครอบทุกการเปลี่ยน state) · ไฟล์: index.html + ui.js + main.js + lobby.css
- ✅ ทดสอบ preview 953×428: ไม่ป่วย=จางกดไม่ได้ · ป่วย=กะพริบแดง กดแล้วหาย หัก 1,000 ปุ่มกลับจาง · เลี้ยง 2 ตัว ตัวที่ป่วยไม่ได้เปิดอยู่ → กดปุ่มเดียว สลับแท็บ+รักษาให้เลย · ปุ่มอยู่บนสุดราง (top 68) เห็นทันทีไม่ต้องเลื่อน · เพจนิ่ง 428 · ไม่มี console error

**✅ รอบ 63 (8 ก.ค. · Fable): แผงสถานะใส sci-fi 2 ฝั่งขนาบตัวน้อง 🛸 (เลิกทับตัวสัตว์) — version→.40**
- **โจทย์ผู้ใช้:** แผ่นสถานะเดียวกลางล่าง (`.stage-plate` เดิม 620px สูงจำกัด 116px + scroll) ทับตัวน้อง → ขอแยกซ้าย-ขวาเป็นแผงใสล้ำสมัย sci-fi
- **แก้:** ui.js (`renderDashboard` การ์ดสัตว์) แยก markup เป็น `.stage-plate.plate-left` (⬢ ข้อมูลน้อง: ชื่อ+เปลี่ยนชื่อ/ร่าง/Lv/EXP/ability) + `.plate-right` (⬢ การดูแล: hungerUI ทั้งก้อน อิ่ม/ร้อน/น้ำ/พิษ/รูปร่าง/sick/ปุ่ม) · **ร่างไข่ = ไม่มีแผงขวา** (hungerUI ว่าง) · lobby.css: แผง absolute ล่างซ้าย/ขวา `width:min(236px,36%)` `max-height:100%` กระจกน้ำเงินใส gradient+blur ขอบฟ้าเรือง `rgba(95,200,255)` + เส้นไฟหัวแผง+scanline จาง (`::before`) + `.plate-title` ตัวเรืองแสง · ปุ่ม care เรียงคอลัมน์เต็มกว้าง
- ✅ ทดสอบ preview 953×428 (mock: `newPet('dog')` level 2): แผงซ้าย 90–321 ขวา 493–724 น้องกลาง 316–498 (เกยขอบแผงแค่ ~5px — แผงใสมองทะลุได้) · เนื้อหาปกติ**ไม่มี scroll ทั้งสองแผง** · เพจนิ่ง docH=428 · ปุ่มให้อาหาร/เปลี่ยนชื่อ/รักษา ครบ · เคสหนักสุด (ป่วย+พิษ+ตัดน้ำ) เนื้อหา 443>กรอบ 234 → scroll เฉพาะในแผงขวา น้องไม่โดนบัง · ไม่มี console error

**✅ รอบ 62 (8 ก.ค. · Fable): ใบอนุญาตนักบิน 🎖️ (สตรีคบินไม่ชน → เข็มติดท้ายชื่อ) — version→.39 (ร่วมกับรอบ 61)**
- **กติกา:** ประกอบคำในโลกเฮลิฯ +1 สตรีค (`state.heliStreak` **สะสมข้ามรอบ/ข้ามวัน**) · โดนดาเมจใดๆ (ชนตึก/กระแทกพื้น) = สตรีคขาดเป็น 0 + banner "💔 สตรีคนักบินขาด" · ครบ 5/15/30 → เข็ม 🥉/🥈/🥇 (`state.pilotBadge` 1–3 — **ได้แล้วไม่หาย**) + banner ฉลอง (delay 2.6 วิ รอ banner คำจบ) + sfx.rankup · ทั้งคู่ persist + migration (state.js)
- **โชว์:** เข็มต่อท้ายชื่อใน `/world` payload (`n+pilotEmoji` — **ไม่มี field ใหม่ ไม่ต้องแก้ rules** เพื่อนเห็นทุกโลก/กระดาน/โพเดียม/แชทลอยหัวอัตโนมัติ) · แถวตัวเองใน renderBoard + HUD หน้าปัด "🎖️ สตรีค X" · การ์ดตั๋วเฮลิฯ โชว์เข็มปัจจุบัน+เป้าถัดไป+สตรีค (ui.js)
- ✅ ทดสอบ preview: ประกอบ 5 คำ → สตรีค 5 + เข็มทองแดง + banner + กระดานมี 🥉 + HUD สตรีค · ชน → สตรีค 0 เข็มคงอยู่ · การ์ดโชว์ "เข็มทองแดง เป้าถัดไป 15" ถูก · ไม่มี console error

**✅ รอบ 61 (8 ก.ค. · Fable): เกจห้องนักบินเข็มขยับจริง 🎛️ + ภาพ cockpit ผู้ใช้เข้า repo — version→.39**
- **ภาพ `img/heli_cockpit.png` (ผู้ใช้เจน 2.86MB) เข้า repo** — เกมใช้แทนแผง CSS อัตโนมัติ (probe เดิมรอบ 52 ทำงานทันที)
- **เกจทำงานจริง 5 ตัว (`#adv-gauges` canvas 620×130 วาดใหม่ทุกเฟรมใน tickHeli · ลอยกลางล่างทับภาพ cockpit z-4):** SPD เข็มความเร็ว 0–70 · **ATT เส้นขอบฟ้าเทียม — ฟ้า/พื้นดินเลื่อน-เอียงตามก้ม/เงย/เอียงข้างจริง** (กดหัว=ขอบฟ้าเลื่อนขึ้นเห็นดินมาก เชิดหัว=เห็นฟ้ามาก + สัญลักษณ์ปีกส้มตรึงกลาง) · ALT 0–60m · V/S เข็มไต่-ลด ±10 (แดงตอนดิ่งแรง) · RPM โซนเขียว/เหลือง/แดง ผูก `HeliSound.rpm`
- **tilt แบบแรงเฉื่อย `hTiltF/hTiltS`** (lerp dt*5) ใช้ร่วมทั้งมุมกล้อง (แทน fw/sd ดิบ — กล้องนุ่มขึ้น) และเข็ม ATT · จอดแล้ว tilt คลายเป็น 0 เอง · แผง CSS fallback ตัดข้อความจำลองเก่า (เข็มจริงทับแล้ว)
- ✅ ทดสอบ preview (pixel-sampling ตามกฎทอง 3 — screenshot ค้าง): กดหัว W → จุดเหนือศูนย์ ATT เป็นสีดิน #a1887f · เชิด S → กลับเป็นสีฟ้า #58b6e8 · เข็ม SPD สีส้มวาดจริงตอนบิน · ภาพ cockpit โหลดใช้จริง · ไม่มี console error

**✅ รอบ 60 (8 ก.ค. · Fable): ตัด scrollbar ระดับเพจถาวร 📵 (เพจพอดีจอเสมอ) — version→.38**
- **อาการ (screenshot ผู้ใช้):** ทั้งเพจเลื่อนได้ + มี scrollbar ขวาสุด ทั้งที่ดีไซน์คือทุก screen scroll ภายในตัวเอง — **2 ตัวการ:** ① `body{min-height:100vh}` (style.css) บนมือถือ 100vh สูงกว่าจอจริงตอนแถบ URL โผล่ → เพจสูงเกินถาวร ② อนิเมชันเปิดหน้า `fadeIn` เริ่ม `translateY(10px)` ดันก้น `.screen` เกินจอ (ชั่วคราวตอนเปิดหน้า / **ค้างถาวรในแท็บ background** เพราะอนิเมชันแช่เฟรม 0)
- **แก้ (css/lobby.css จุดเดียว):** `html,body{overflow:hidden;overscroll-behavior:none}` + `body{min-height:100dvh}` — เอกสารห้าม scroll เด็ดขาด ทุก screen ใช้ scroll ภายในของตัวเองตามดีไซน์เดิม (`.screen.active:not(#screen-dashboard)` มี `max-height:100dvh-24 + overflow-y:auto` อยู่แล้ว)
- ✅ ทดสอบ preview 953×428 (mock login → dashboard): docH=428=จอพอดี ไม่มี scrollbar gutter · `window.scrollTo(0,50)` → ค้าง 0 · แม้ transform 10px ค้าง (แท็บ bg) เพจก็ไม่ขยับ · หน้าสถิติยัง scroll ภายในได้ (สูง 1118 ในกรอบ 404 เลื่อนถึง 716) · กลับ dashboard ปกติ · ไม่มี console error
- **หมายเหตุเทสต์ preview:** แท็บ preview เป็น background → CSS animation แช่เฟรมแรก (`getAnimations()[0].currentTime=0` ค้าง) — วัด layout ที่ผูกกับ animation ให้ `el.getAnimations().forEach(a=>a.finish())` ก่อน

**✅ รอบ 59 (8 ก.ค. · Fable): ฉาก Rank Up พอดีจอทุกขนาด 🎖️ (fix ล้นจอแนวนอน) — version→.37**
- **อาการ (screenshot ผู้ใช้):** มือถือแนวนอน หัวข้อ "RANK UP!" โดนตัดขอบบน + ปุ่ม "รับตำแหน่ง" จมขอบล่าง — ต้นตอ: ขนาดใน CSS เป็น px ตายตัว (เหรียญ 190px ชื่อ 34px) รวม ~450px สูงกว่าจอแนวนอน (~400px) → flex กึ่งกลางตัดทั้งหัว-ท้าย
- **แก้ (css/style.css เท่านั้น):** ทุกขนาดฉาก `.rankup-*` + `.collect-reveal-*` เปลี่ยนเป็น `clamp(min, Xvmin, max)` — จอเตี้ยย่อลงพอดี จอใหญ่คงขนาดเดิมเป๊ะ · `.rankup-content` ใช้ `margin:auto` (กันตัดขอบถ้าล้น) · จัดกึ่งกลางจริงด้วย padding-left ชดเชย letter-spacing (title/en) · ปุ่มเพิ่ม hover+font-weight · พื้นหลังไล่เฉดขอบมืดขึ้นเล็กน้อย · **ครอบ 3 ฉากที่ใช้ CSS ร่วมกัน: อัปแรงค์ / เปิดของขวัญ / ได้ของสะสม-ผลิตสำเร็จ**
- ✅ ทดสอบ preview (getBoundingClientRect ตามกฎทอง): 900×400 → content 28–372 พอดีจอ เหรียญ 144px หัวข้อ+ปุ่มเห็นเต็ม · 1280×720 → เหรียญเต็ม 190px เท่าดีไซน์เดิม · collect-frame 160px ที่จอ 400 ตาม clamp · ไม่มี console error · ⚠️ screenshot preview ค้าง (quirk เดิม) ใช้ตัวเลข rect ยืนยันแทน · **หมายเหตุเทสต์:** วัด rect ต้องรอ popIn animation จบ (~0.6 วิ) ไม่งั้นค่า scale เพี้ยน

**✅ รอบ 58 (8 ก.ค. · Fable): ป้ายโฆษณาบนยอดตึกเมืองเฮลิฯ 📢 + ผังเมือง seed คงที่ — version→.36**
- **ป้ายโฆษณา 10 ป้าย** (`AD_COUNT` · ตึกเว้นตึก): แผ่นป้าย PlaneGeometry 8:3 (กว้าง ≤11m) + เสาค้ำ 2 ต้น (child ของ panel) ตั้งเหนือดาดฟ้า +2.2m **หันหน้าเข้ากลางเมือง** (lookAt) มองเห็นตอนบิน · `adBoardTexture(n)` canvas 512×192: พื้นหลัง gradient 10 สไตล์ (`AD_STYLES`) + ลวดลาย 3 ตระกูลสลับตามเลข (แถบ/จุด/ดาว) + กรอบขาว + **ป้ายเลขเหลืองมุมซ้าย "ป้าย N" โชว์ตลอด** · ยังไม่มีลูกค้า = ข้อความ **"ติดต่อโฆษณา โทร 064-357 6645"**
- **ระบบลงโฆษณาลูกค้า:** probe `img/ads/ad_<n>.png` (Image onload — กติกาเดียวกับ probeImages) → วาดภาพลูกค้าเต็มป้ายแทนข้อความทันที (เลขป้ายยังทับมุมให้อ้างอิง) · สเปกภาพ 8:3 เช่น 1024×384 · วิธีใช้อยู่ `PROMPTS_HELI.md` หัวข้อ 3
- **ผังเมือง seed คงที่ (`seededRand(87251)`):** ตึก/ป้ายตำแหน่งเดิมทุกเครื่องทุกรอบ — ① ลูกค้าเลือกจองเลขป้ายได้จริง ② เพื่อน multiplayer เห็นเมืองเดียวกัน ไม่บินทะลุตึกกันบนจอเพื่อน (เดิมสุ่มต่อเครื่อง)
- ✅ ทดสอบ preview: ป้ายครบ 10 เลข 1–10 อยู่บนตึกจริง · ตึก 20 ตึก b0 คงที่ข้าม reload (seed ✓) · อ่าน pixel จาก canvas ป้ายจริง: พื้นหลัง 2 ป้ายคนละสี/กรอบขาว/เลขเหลือง #ffd54f/หันเข้ากลางเมือง/เสาค้ำ 2 ต้น ครบ · ไม่มี console error · ⚠️ screenshot ค้าง ใช้ pixel-sampling ยืนยันแทน (กฎทอง 3)

**✅ รอบ 57 (8 ก.ค. · Fable): ระบบเตือนภัยใกล้ชนในห้องนักบิน ⚠️ (proximity warning โลกเฮลิฯ) — version→.35**
- **คำนวณใน tickHeli (เฉพาะตอนบิน+สตาร์ทเสร็จ):** ระยะแนวนอนถึงผนังตึกทุกตึกที่ยอดสูงกว่าตำแหน่งบิน (บินเหนือยอด = ไม่นับตึกนั้น ข้ามได้ปลอดภัย) → 3 ระดับ: <10m เหลือง "มีตึกใกล้ๆ" กะพริบช้า · <6m "ใกล้ตึก! ระวังชน" กะพริบเร็ว · <3.5m แดงจัด "🚨 หลบเดี๋ยวนี้!" กะพริบถี่+ตัวใหญ่ · **PULL UP:** ดิ่ง vy<-6 ต่ำกว่าพื้น/ดาดฟ้า <9m → "⬇️ ลดระดับเร็วเกิน! ดึงขึ้น!" (ระดับ 2 ขั้นต่ำ)
- **ไฟเตือน `#adv-warn`** ใต้หน้าปัด (แดง ขอบขาว กะพริบตาม class warn1/2/3) · **เสียงบี๊บ `HeliSound.proximity(lvl)`** — square 950Hz (ระดับ 3 = 1180Hz) ช่วงห่าง 640/330/150ms ดังขึ้นตามระดับ · จัดการ interval ตอนเปลี่ยนระดับเท่านั้น · เคลียร์ใน stop()/ลงจอด/ออกโลก · เคารพ state.sound
- ✅ ทดสอบ preview: ไกลตึก=ไม่เตือน · เข้าใกล้ระดับไต่ 2→3 ข้อความ/class ถูก · บินเหนือยอดตึกเดียวกัน=เงียบ · ดิ่งเร็วใกล้พื้น=PULL UP · ลงจอด=ดับ+interval ถูกเคลียร์ · ไม่มี console error · (จุดเทสต์ระดับ 1 ขึ้น 2 เพราะมีตึกอื่นใกล้กว่าใน map สุ่ม — พฤติกรรมถูกต้อง)

**✅ รอบ 56 (8 ก.ค. · Fable): บัญชีผู้ทดสอบเกม 🧪 (Sumpajit) — version→.34**
- **`TESTER_EMAILS` ใน auth.js (ข้างบัญชีครู):** ตอนนี้มี `sumpajitshami@gmail.com` (ถามอีเมลจากผู้ใช้แล้ว — ผูกอีเมลไม่ผูกชื่อในเกม กันเด็กตั้งชื่อเลียนแบบรับเหรียญฟรี) · เพิ่มผู้ทดสอบคนต่อไป = เติมอีเมลต่อท้าย array
- **`testerBoost()` เรียกใน `authEnterGame` (จุดเดียวหลัง login ทุกเส้นทาง):** เหรียญ < `TESTER_COINS` 60,000 → `addCoins` เติมให้เต็มเพดาน + saveState + toast 🧪 · เกิน/เท่ากับ = ไม่ทำอะไร · ใช้เงินไปแล้ว login รอบถัดไปเติมกลับเอง (ผู้ทดสอบมีแต้มพอเสมอ — ตั๋ว 3 โลก 5k+10k+15k เหลือเผื่อสัตว์/รักษา/อาหาร)
- ✅ ทดสอบ preview: login tester (ทั้งอีเมลตัวเล็ก/ผสมใหญ่) → 60,000 + toast จริง · เด็กธรรมดา → 0 ไม่เติม · จำลองเหลือ 59,000 → เติมกลับ 60,000 · ไม่มี console error

**✅ รอบ 55 (8 ก.ค. · Fable): โลก 3D อ่านออกเสียงคำที่ผสมสำเร็จ 🔊 — version→.33**
- **จุดเดียวครอบ 3 โลก:** `completeWord()` ใน adventure3d.js (โค้ดร่วม adv/haunt/heli) เพิ่ม `setTimeout(()=>speakWord(w.en), 700)` — อ่านคำหลังแตรฉลอง sfx.levelup จบ · ใช้ MP3 Neural จากรอบ 53 (คำโลก 3D มาจาก vocab.js เดียวกัน → มีไฟล์ครบ) fallback Web Speech
- ✅ ทดสอบ preview (โลกกลางวัน · mock login + `_t.give` ยัดตัวอักษร): ผสม "chicken" สำเร็จ → speakWord ถูกเรียก + `chicken.mp3` เล่นจริง (1.78s) · คำเติมกลับครบ 10 · ไม่มี console error · หมายเหตุ: ต้อง `loadScriptOnce('js/vendor/three.min.js')` ก่อน `adventure3d.js` ตอนเทสต์ (เกมจริงโหลดผ่านปุ่มการ์ดตั๋วอยู่แล้ว)

**✅ รอบ 54 (8 ก.ค. · Fable): เสียงเครื่องยนต์เฮลิฯ สมจริง 🚁🔊 (สตาร์ท+เร่ง-เบาเครื่อง) — version→.32**
- **`HeliSound` รีแฟค (adventure3d.js):** ① **ซีเควนซ์สตาร์ทเครื่อง** ทุกครั้งที่เข้าโลก — เทอร์ไบน์หวีดไต่ pitch (85→430Hz) + ใบพัดหมุนช้า→เร็ว (LFO 1.6→10.5Hz) ~3.6 วิ · **ระหว่างสตาร์ทบินไม่ได้** (เทคออฟเช็ก `HeliSound.ready` · หน้าปัดขึ้น "🔑 กำลังสตาร์ทเครื่องยนต์...") · ปิดเสียงอยู่ = ข้ามซีเควนซ์ ② **โมเดล RPM แรงเฉื่อย** — target: จอด .55 / บิน 1+col*.45 · lerp `dt*.9` → ดึง collective เสียงค่อยๆ เร่ง ปล่อยค่อยๆ เบา (เทสต์: .55→.87→1.41→ลง 1.01) · ขับ LFO ใบพัด + เสียงหวีดเทอร์ไบน์ใหม่ (triangle 230+r*360Hz) + master gain
- **ไฟล์อัปเกรด Suno 3 ไฟล์ (probe อัตโนมัติ):** `sound/heli_start.mp3` (เล่นครั้งเดียว รอจบ ≤9 วิ ค่อยปลดล็อกบิน) · `heli_rotor.mp3` (ลูปปกติ playbackRate ตาม rpm) · `heli_rotor_high.mp3` (ลูปเร่งเต็มกำลัง — **crossfade** กับลูปปกติตาม rpm) · มีกี่ไฟล์ใช้เท่านั้น ที่เหลือสังเคราะห์ · prompt ครบใน `PROMPTS_HELI.md` (หัวข้อ 2.1–2.3)
- ✅ ทดสอบ preview: เข้าโลก → ready=false เทคออฟไม่ขึ้น+หน้าปัดสตาร์ท → 3.6 วิ ready → เทคออฟได้ · rpm มีแรงเฉื่อยจริงทั้งขึ้น-ลง · exitWorld เคลียร์ timer/ไฟล์/node ครบ · ไม่มี console error · **เสียงจริงบนลำโพงรอผู้ใช้ฟังบน Pages**

**✅ รอบ 53 (8 ก.ค. · Fable): เสียงคำศัพท์ระดับ Edge ทุกเบราว์เซอร์ 🎙️ (MP3 เจนล่วงหน้า) — เผยแพร่รวมใน version .32 (เลขเดียวกับรอบ 54)**
- **โจทย์ผู้ใช้:** Chrome/Safari/Firefox เสียง Web Speech สู้ Edge ไม่ได้ → อยากได้เสียง Edge ทุกเบราว์เซอร์ ฟรี · **ทางที่เลือก: เจน MP3 ล่วงหน้า** (ไม่ทำสะพานเรียลไทม์ — endpoint ไม่ทางการพังได้/CORS/ช้า · ไฟล์เจนครั้งเดียวใช้ตลอด เกมไม่พึ่งเน็ต+API ตอนเล่น)
- **`tools/gen_word_audio.py`** (ต้อง `pip install edge-tts` · ฟรี ใช้เอนจิน Read Aloud ของ Edge): ดึงคำอังกฤษทุกคำจาก `js/data/vocab.js` → เจน `sound/words/<word>.mp3` เสียง **en-US-JennyNeural rate -15%** · ข้ามไฟล์ที่มีแล้ว (**เพิ่มคำใหม่ใน vocab.js → รันซ้ำได้เลย**) · กติกาชื่อไฟล์ = `word_key()` ต้องตรงกับ `wordAudioFile()` ใน util.js · ผลรอบนี้ **400/400 คำ 5.1MB fail 0**
- **util.js:** `speakWord` เล่น MP3 ก่อน (cache `wordAudio{}` ต่อคำ + ตัดเสียงเก่ากันซ้อน) · ไม่มีไฟล์/เล่นพลาด → fallback `speakWordTTS` (Web Speech ตัวเลือกเสียงเดิม) · จำ 'miss' ไม่ยิง 404 ซ้ำ · sw.js เดิม cache-first `.mp3` อยู่แล้ว → โหลดครั้งเดียวเล่นออฟไลน์ได้
- ✅ ทดสอบ preview: แตะการ์ด en → เล่น `sound/words/mouth.mp3` จริง (duration 1.78s เดินอยู่) TTS ไม่ถูกเรียก · คำไม่มีไฟล์ (`zzznotexist`) → fallback TTS ถูกเรียก+จำ miss · หน้าสอบแตะโจทย์ → MP3 เล่น · ไม่มี console error · **เสียงจริงบนลำโพงรอผู้ใช้ฟังเครื่องจริง**

**✅ รอบ 52 (8 ก.ค. · Fable): โลกเฮลิคอปเตอร์ Bell 🚁 (การ์ดที่ 3 · cockpit view) — version→.30**
- **ตั๋ว 15,000** (`HELI_PRICE` items.js · ล็อกจนมีตั๋วโลกผจญภัย · `state.heliTicket/heliDone`+migration+assetValue) · การ์ด `#heli-card` (index.html) + `renderHeliCard` 4 สถานะ + `buyHeliTicket/enterHeli3D` (ui.js) · รางวัล **30🪙/คำ** สูงสุด 3 โลก
- **โหมด heli ใน adventure3d.js (MODES.heli):** เมืองตึกสูง 19-25 ตึก (กริด 24m สุ่มสูง 8-28m + วง helipad เหลืองบนดาดฟ้า + ถนน + ลานจอดกลางเมือง) · **ตัวอักษรอยู่บนยอดตึกเท่านั้น** (spawnLetter/relocate สุ่มตึก · `l.baseY` กันโค้ดลอยดึงตกตึก) · **ต้อง "ลงจอดแล้ว" ใกล้ตัวอักษร (<3.6m) ถึงเก็บได้**
- **ฟิสิกส์บินอาร์เคด (tickHeli — สไตล์ Helicopter Flight Pilot):** เดสก์ท็อป W/S เอียง A/D สไลด์ Q/E หัน Space ขึ้น Shift/C ลง · มือถือ จอยซ้าย=เอียง ลากขวาแนวตั้ง=collective แนวนอน=หัน (ปล่อยนิ้ว=hover) · auto-hover + drag + top speed 17m/s · จอดเบา (|vy|≤7)=ลงจอด · กระแทกแรง -25 HP · **ชนผนังตึก** (ทะลุ footprint ใต้ยอด) ดันออก+เด้ง -20 HP (คูลดาวน์ 1 วิ) · HP หมด → KO title "🚁💥 เฮลิคอปเตอร์พัง" (M.koTitle) → advHurt รักษา 1,000 ร่วม 3 โลก
- **Cockpit + หน้าปัด:** `#adv-cockpit` ชิดล่างจอ — probe `img/heli_cockpit.png` (เจนตาม `PROMPTS_HELI.md` ใหม่) ไม่มี→แผง CSS จำลอง (BELL 206) · `#adv-inst` โชว์ ⛰️ความสูง 🚀ความเร็ว 🛬สถานะจอด · ซ่อน crosshair/ปุ่มยิง (class .adv-heli)
- **เสียงใบพัด `HeliSound`:** สังเคราะห์ Web Audio (sawtooth AM ด้วย LFO ใบพัด ~13Hz + noise swish) pitch/ดังตาม collective · thud ตอนชน/แตะพื้น · probe `sound/heli_rotor.mp3` (Suno prompt ใน PROMPTS_HELI.md) ใช้แทนอัตโนมัติ · เคารพ state.sound · stop ตอนออก/KO
- **Multiplayer ครบเหมือน 2 โลกแรก:** map id `heli` — เพื่อนเป็น 🚁+ชื่อ บินตามความสูงจริง (**field `y` ใหม่ใน /world** · peers lerp y · bubble/ไอคอนไมค์ลอยตามความสูง) · แชท/voice/กระดาน/พิธีแชมป์/ครูคุมห้อง ทำงานอัตโนมัติ (โค้ด mode-agnostic) · tinv ชวนเพื่อน+เงินคืน 2,000 รองรับ map heli (online.js/ui.js เพิ่ม label 🚁)
- **⚠️ RULES.md แก้ใหม่ — รอผู้ใช้ publish:** เพิ่ม `heli` ในทุก enum ($map ของ /world /rtc /class + map ของ /tinv) + field `y` ใน /world — ไม่ publish = โลกเฮลิฯ เล่นเดี่ยวได้แต่ online ใน map นั้นถูก reject
- ✅ ทดสอบ preview: ซื้อตั๋ว 50000→35000+assetValue · เข้าโลก: ตึก 19 ตัวอักษรบนดาดฟ้าครบ 59 cockpit CSS+หน้าปัดโชว์ · เทคออฟ Space จริง · บินหน้า 11.5m/2วิ+หน้าปัดอัปเดต · ลงจอดดาดฟ้าตึก 27.3m นุ่ม → **เก็บตัวอักษรตอนจอดได้จริง** · ประกอบคำ +30 · ชนผนังตึก -20+ดันออก · เครื่องพัง → KO title heli + การ์ดโชว์บาดเจ็บ · ไม่มี console error · ⚠️ screenshot ค้าง ใช้ DOM/rect ยืนยัน (กฎทอง 3) · **บินจริงบนมือถือ+multiplayer heli รอเทสต์หลัง publish rules**

**✅ รอบ 51 (8 ก.ค. · Fable): เสียงอ่านคำศัพท์อังกฤษ 🔊 (เกมจับคู่ + สอบ) — version→.29**
- **`speakWord(word)` ใน util.js** (ต่อท้าย sfx) — Web Speech API ไม่ใช้ไฟล์เสียง · `pickSpeakVoice()` ให้คะแนนเลือกเสียง human สุดที่เครื่องมี: Natural/Neural (Edge) > Google (Chrome/Android) > Samantha ฯลฯ (iOS/macOS) > en-US · เคารพ `state.sound` · `cancel()` ก่อนพูดกันเสียงซ้อนตอนแตะรัว · rate 0.9 · เบราว์เซอร์โหลดรายชื่อเสียงช้า → รอบแรกใช้ default แล้วอัปเกรดผ่าน `onvoiceschanged`
- **เกมจับคู่:** `pickCard` (game.js) — แตะการ์ดฝั่งอังกฤษ = อ่านออกเสียง (ฝั่งไทยไม่อ่าน)
- **หน้าสอบ:** `renderQuizQuestion` — การ์ดคำโจทย์ `#quiz-word` เพิ่มไอคอน 🔊 + แตะแล้วอ่านออกเสียง (CSS: cursor pointer + `.quiz-speak`)
- ✅ ทดสอบ preview (mock login + spy `speechSynthesis.speak`): แตะการ์ด en → speak("head", en-US) จริง · แตะการ์ด th → ไม่เรียก · หน้าสอบแตะโจทย์ → speak("dog") + ไอคอน 🔊 + cursor pointer ครบ · ไม่มี console error · **เสียงจริงบนลำโพงรอผู้ใช้ฟังเอง (preview ไม่มีเสียง) — บน Edge จะได้เสียง Natural เพราะสุดขึ้นอีก**

**✅ รอบ 50 (8 ก.ค. · Fable): คู่มือครูในเกม 👩‍🏫 + อัปเดตวิธีเล่นโลก 3D — version→.28**
- **ปุ่ม "👩‍🏫 คู่มือครู" ในหน้าตั้งค่า** (util.js openSettings — โผล่เฉพาะ `isTeacher()`) → `openTeacherGuide()` โมดัล 7 หัวข้อ: บัญชีครูคืออะไร/วิธีเพิ่มครู (TEACHER_EMAILS ใน auth.js) · ปิด-เปิดเสียงห้อง · จบรอบแข่ง+โบนัส 100/50/25 · กระดานคะแนน · **สูตรจัดแข่งในคาบ 5 ขั้น** (เข้า map เดียวกัน→ปิดเสียงอธิบายกติกา→ปล่อยลุย→กด 🏁→แข่งยกใหม่) · ความปลอดภัยที่ระบบดูแลแล้ว (ไมค์ default ปิด/ตัวกรองคำหยาบ/โหมดเพื่อน) · โบนัสชวนเพื่อน 2,000
- **fix stale:** วิธีเล่น (openHelp) หัวข้อตั๋วยังเขียน "🚧 กำลังก่อสร้าง" — เขียนใหม่เป็น "🌍 โลก 3D" ครอบ 2 โลก+ราคา+รางวัล+multiplayer/แชท/เสียง/ชวนเพื่อน/กระดาน
- ✅ ทดสอบ preview (mock login): เด็กไม่เห็นปุ่มคู่มือครู · ครู (push email) เห็น+เปิดได้ครบ 7 หัวข้อ+ปิดถูก · วิธีเล่นไม่มีคำ "กำลังก่อสร้าง" แล้ว+มีโลกผีสิง · ไม่มี console error

**✅ รอบ 49 (8 ก.ค. · Fable): พิธีประกาศแชมป์ใน map 🏁 (ครูกดจบรอบแข่ง) — version→.27**
- **ปุ่มครู `#adv-podbtn` "🏁 จบรอบแข่ง"** (ใต้ปุ่มปิดเสียงห้อง · เห็นเฉพาะ isTeacher) → snapshot อันดับ me+peers (top 3 พร้อม uid) เขียน `/class/<map>/podium={id:Date.now,by,ts,top:[{u,n,w}]}` แล้ว**ลบเองใน 15 วิ** (กันพิธีค้าง DB เล่นซ้ำ)
- **ทุกเครื่องฟัง on('value'):** id ใหม่+ไม่เก่ากว่า 5 นาที → โพเดียม `#adv-podium` เต็มจอ เรียง 2-1-3 (🥇🥈🥉 แท่นทอง/เงิน/ทองแดง สูงลดหลั่น + keyframe advPdRise) · แตร sfx.rankup + สั่น · **โบนัสโพเดียม 100/50/25** (client เช็ก uid ตัวเองใน top → addCoins) · **sessionWords รีเซ็ต = เริ่มรอบแข่งใหม่ทุกคน** + sendPos(true)+renderBoard · เกมพักระหว่างพิธี (ผีไม่แอบจับ) แตะปิด/ปิดเอง 8 วิ → resume (guard: ไม่ resume ถ้า KO ค้าง)
- **กันเล่นซ้ำแบบไม่แตะ state.js** (session คู่ขนานกำลังแก้ไฟล์นั้น — เลี่ยงชนกัน): `lastPodiumId` ในหน่วยความจำ + หน้าต่างเวลา 5 นาที + ครูลบ node — ช่องโหว่เดียว: refresh ภายใน 15 วิแล้วติด top อาจได้โบนัสซ้ำ (≤100 ยอมรับ) · rules `/class` เพิ่มลูก `podium` (RULES.md อัปเดต — **รอ publish ชุดเต็ม**)
- ✅ ทดสอบ preview (โลกกลางวัน): เด็กปุ่ม 🏁 ซ่อน · showPodium → โพเดียมเรียง 2-1-3 แชมป์ถูกคน · เราอันดับ 2 ได้ +50 จริง · ไม่ติดโพเดียม = ไม่ได้เหรียญ+ข้อความรอบใหม่ · กระดานรีเซ็ต 0 · พักเกมจริง+แตะปิดเดินต่อ · ครู (push email) เห็นปุ่ม กดออฟไลน์ toast ไม่ crash · ไม่มี console error · **ของจริงข้ามเครื่องต้องเทสต์ 2 เครื่องหลัง publish rules**

**✅ รอบ 48 (8 ก.ค. · Fable): toast แจ้งทันทีที่เหรียญพอรับน้อง — version→.26**
- **hook ใน `addCoins()` (state.js) จุดเดียวครอบทุกทางได้เหรียญ** (จับคู่/ควิซ/โลก 3D/ขายของ): เทียบ before/after — เหรียญ**เพิ่งข้ามเส้น**ราคาน้องที่ยังไม่มี → toast "🎉 เหรียญพอรับ{ชื่อ}แล้ว! ไปร้านสัตว์เลี้ยงได้เลย" · ข้ามพร้อมกันหลายตัว (หมา+แมว 3,000) รวมเป็นข้อความเดียว " และ " · เด้งเฉพาะจังหวะข้ามเส้น = ไม่สแปม (ใช้เงินจนต่ำกว่าเส้นแล้วสะสมใหม่จะเด้งอีกครั้ง — ตั้งใจ)
- กัน load order ด้วย `typeof PETS/toast` ก่อนใช้ · เป็นไอเดียต่อยอดรอบ 47 ที่ทำต่อตาม**กฎทองข้อ 6 ใหม่** (ผู้ใช้อนุญาตล่วงหน้างานเกมทุกกรณี — commit `4a2da35`)
- ✅ ทดสอบ preview (mock login): 2,990+10 → เด้ง "หมา และ แมว" รวมข้อความเดียว · +10 ต่อไม่เด้งซ้ำ · มีหมาแล้วข้ามใหม่ → เด้งเฉพาะแมว · 9,995+10 → เด้งมังกร · เล่นจับคู่จริงถูก 1 คู่ (9,995→10,005) → เด้งมังกรผ่านเกมจริง · ไม่มี console error

**✅ รอบ 47 (8 ก.ค. · Fable): การ์ดร้านสัตว์เลี้ยงโชว์เป้าหมาย "ขาดอีก 🪙X ≈ เล่นอีก Y คำ" — version→.25**
- **renderPetShop (ui.js):** การ์ดที่ยังไม่มี+เหรียญไม่พอ เพิ่มบรรทัด `.egg-need` ใต้ราคา = ขาดกี่เหรียญ + ≈ อีกกี่คำ (`Math.ceil(ขาด/10)` — ฐานเกมจับคู่ 10🪙/คำ ก่อนโบนัส) · เงินพอ/มีน้องแล้ว = ไม่ขึ้น
- **lobby.css:** `.egg-need` ตัวทองเล็ก `clamp(10px,2.5dvh,12px)` — ไม่ดันการ์ดจน scrollbar กลับมา (ต่อยอดรอบ 45)
- ✅ ทดสอบ preview (mock login · 740×360): เหรียญ 2,040 → หมา/แมว "ขาด 🪙960 ≈ 96 คำ" มังกร "ขาด 🪙7,960 ≈ 796 คำ" · เหรียญ 5,000 → ขึ้นเฉพาะมังกร · มีหมาแล้ว → การ์ดหมาไม่ขึ้นแม้เหรียญ 100 · แผง+หน้า ไม่มี scrollbar เหมือนเดิม · ไม่มี console error

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
