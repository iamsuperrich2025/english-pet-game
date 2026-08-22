# RULES.md — Firebase Security Rules

> ⏳ **รอบ 1236 — รอผู้ใช้ Publish:** ล็อก map `sky` แบบ Private Beta ที่ `/world`, `/wroom`, `/winfo` และการสร้างคำเชิญ `/tinv` ให้เฉพาะอีเมลตัวพิมพ์เล็ก `freddommun@gmail.com`, `sumpajitshami@gmail.com`, `parkerhulk2020@gmail.com`; เงื่อนไขใช้ `$map !== 'sky' || ...` จึงไม่เปลี่ยนสิทธิ์ของโลกอื่น
>
> ⏳ **รอบ 1229 — รอผู้ใช้ Publish:** เพิ่ม map key `sky` ใน allowlist เดิมของ `/world`, `/wroom`, `/winfo` และคำเชิญ `/tinv` เท่านั้น เพื่อเปิด multiplayer ของ Vocab Sky Playground สูงสุด 6 คนต่อ instance; ไม่เปลี่ยนสิทธิ์อ่าน/เขียนหรือ field validation อื่น
>
> ✅ **รอบ 1142 — ผู้ใช้ยืนยันว่า Publish แล้ว 13 ส.ค. 2026:** ล็อก `/users/<uid>/profile/name` ชื่อ `Admin` ทุกตัวพิมพ์และ `แอดมิน` ให้เขียนได้เฉพาะ `freddommun@gmail.com`, `sumpajitshami@gmail.com`, `parkerhulk2020@gmail.com`; ฝั่งเกมตรวจเข้มกว่านี้โดยตัดช่องว่างและอักขระซ่อนด้วย · ยังไม่ได้เทียบ Rules สดทั้งก้อน เพราะ sandbox อ่าน Firebase CLI token ใน `.config` ไม่ได้
>
> ✅ **รอบ 1096 — Publish/ตรวจสดแล้ว 10 ส.ค. 2026:** แก้ account deletion ให้เจ้าของ UID ลบ reaction ของตัวเอง (`gfeed/lk` และ `gfeed/cm/cl`) ได้แม้ความเป็นเพื่อนสิ้นสุดแล้ว โดยสิทธิ์สร้าง/แก้ reaction ยังคงต้องเป็นเจ้าของโพสต์หรือเพื่อนเหมือนเดิม; Firebase CLI เทียบสดตรง source ครบ 37 โซน / 475 leaf keys (`missing=0`, `extra=0`, `changed=0`)

> อ่านไฟล์นี้เมื่อ: แตะ Firebase / เพิ่มโซนใหม่ / ต้องส่ง rules ให้ผู้ใช้ publish
> **⚠️ กติกาผู้ใช้: ส่ง rules ให้ผู้ใช้ต้องส่ง "เต็มทั้งหน้า" เสมอ ห้ามส่งเฉพาะโซน** (คัดลอกทั้งก้อนไปวางทับใน Firebase console → Realtime Database → Rules → Publish)
> **📋 กฎถาวรเรื่องการคัดลอก (10 ส.ค. 2026):** ทุกครั้งที่ต้องให้ผู้ใช้อัปเดต Rules ต้องรัน `python tools/gen_rules_artifact.py <output.html> --round N --zone <zone>` และส่งหน้า HTML ที่มีปุ่ม **คัดลอกทั้งก้อน** เป็นทางหลัก ห้ามให้ลากเลือกจาก `.txt`/คัดลอก JSON ยาวด้วยมือ; ก่อนส่งต้องให้ `json.loads` ผ่านและยืนยันว่า payload ของปุ่ม Copy ตรงกับก้อนเต็มในไฟล์นี้ทุกตัวอักษร (แนบ `.json` เป็นสำรองได้) เพื่อป้องกัน comma/บรรทัดตกหล่น

**Firebase:** โปรเจกต์ `english-pet-game` (Google account ผู้ใช้ · เปิด Billing สำหรับ Cloud Functions แล้ว) · RTDB `https://english-pet-game-default-rtdb.asia-southeast1.firebasedatabase.app` · console: https://console.firebase.google.com/project/english-pet-game/database
Claude แก้ rules เองไม่ได้ — ต้องส่งให้ผู้ใช้วาง · ทดสอบ allow/deny ผ่าน REST `<dbURL>/<path>.json` ได้ (โซนที่มี auth ต้องทดสอบผ่านหน้าเกมจริง/Emulator เพราะ REST ธรรมดาไม่มี token)

## สถานะการ publish
> ✅ **รอบ 1178 — ผู้ใช้ Publish/ตรวจสดแล้ว 20 ส.ค. 2026:** ตลาดแบบ server-authoritative เพิ่ม private `/marketLedger`; ผู้เล่นสร้างได้เฉพาะประกาศของตัวเองและถอนเฉพาะประกาศของตัวเองที่ยังไม่ถูกล็อกซื้อ ส่วน `/msold` ผู้เล่นอ่าน/ลบใบเสร็จของตัวเองได้ แต่สร้างเองไม่ได้อีกต่อไป; Firebase CLI เทียบสดตรง source ครบ 41 โซน (`differences=0`) · 833 บรรทัด/50,292 ตัวอักษร · SHA-256 `83BFC1910F9CCD1608E4F2D98C5EFB814968D380D72B2A0EA5B127710E92BEC7`
> ✅ **Account deletion + `gnotif` syntax fix รอบ 1094 — ตรวจสดแล้ว 10 ส.ค. 2026:** 37 โซน / 475 leaf keys ตรง source ทั้งหมด (`missing=0`, `extra=0`, `changed=0`) หลังผู้ใช้ Publish ก้อนเต็มจาก artifact รอบ 1094
> ✅ **Haunted Hotel Phase 2+3 — ผู้ใช้ยืนยันว่า Publish แล้ว 10 ส.ค. 2026:** ก้อนเต็ม 37 โซน / 755 บรรทัด มี `/hauntedHotel/<r0..r35>/run` + compact current `/scare` และ `placementVersion`; payload ที่ส่งผ่านปุ่ม Copy ตรง source ทุกตัวอักษร (45,250 ตัว · SHA-256 `22141EE741639B5C0F3C3B3AD8053964566E18255534AE3207397D86AC5DB8F8`) · **ยังไม่ได้เทียบ rules สดทั้งก้อนจาก Codex** เพราะบัญชี Firebase ใน in-app browser ไม่มีสิทธิ์และ session เกมไม่ได้ล็อกอิน จึงบันทึกหลักฐานตามคำยืนยันผู้ใช้โดยไม่อ้างว่าตรวจสดแล้ว
> ✅ **เผยแพร่โซน `bbAward` + field/index `bb` ของเกม 🫧 ฟองแล้ว (7 ส.ค. 2026 · รอบ 1069)** — อ่านกฎสดด้วย Firebase CLI แล้วตรงกับก้อนเต็มด้านล่างทั้งไฟล์ (SHA-256 `63AEDC295B98CC0D1A7A28D375D3920871ED4DA09229E483F37EBE193A2BF085`): 36 โซน มี index/field `bb` และ `bbAward` ครบ
> 🎉 **ผู้ใช้ publish ก้อนเต็ม 33 โซน / 555 บรรทัดแล้ว (3 ส.ค. 2026 · รอบ 983)** — ตรวจสดด้วย `firebase database:get "/.settings/rules" --project english-pet-game` แล้วเทียบทีละคีย์กับก้อนใน RULES.md: **331 คีย์ ตรงกันทั้งหมด ไม่มีคีย์หาย ไม่มีค่าเพี้ยน** → ของที่ค้างมาก่อนหน้า (`gnotif` รอบ 976 · `cl` รอบ 966 · `sgAward` รอบ 917 · `f1Rank` รอบ 903 · `f1` ใน wroom รอบ 896 · `pmAward`+`pm` รอบ 979) **ขึ้นครบพร้อมกันหมดแล้ว**
- ✅ **รอบ 983 (3 ส.ค. 2026): ขยายโซน `gnotif` ให้เก็บ "ของขวัญ 🎁 · ทักทายน้อง 🐾 · คำขอเป็นเพื่อน 👋" ย้อนหลังด้วย (รวมทุกเรื่องไว้ในกล่อง 🔔 ใบเดียว) — ผู้ใช้ publish แล้ว 3 ส.ค. 2026 · ตรวจสดยืนยัน (ดูหมายเหตุบนสุด) (ก้อนเดียวกับรอบ 976 ด้านล่าง publish ครั้งเดียวได้ทั้งหมด):** เพิ่ม `t` อีก 3 ชนิด `gf`|`gr`|`fr` · **`pid` เปลี่ยนเป็น "ไม่บังคับ"** (ใบพวกนี้ไม่ได้มาจากโพสต์) — `.validate` บังคับ `['t','u','n','ts']` แล้วต้อง *มี `pid`* หรือ *เป็นชนิดใหม่* อย่างใดอย่างหนึ่ง (ยัดใบไม่มี pid เป็นชนิดไลก์/คอมเมนต์ไม่ได้) · **ทางเขียนใหม่ 2 เส้น เช็กของจริงในฐานข้อมูลก่อนเสมอ:** `gf`/`gr` ต้องมี `/gifts/<ผู้รับ>/<คนกด>` อยู่จริง (= ส่งของขวัญ/คำทักไปแล้วจริง) · `fr` ต้องมี `/friendReq/<ผู้รับ>/<คนกด>` อยู่จริง (= ส่งคำขอไปแล้วจริง) → **ไม่เปิดช่องใหม่ให้คนแปลกหน้าเลย** สิทธิ์เท่ากับการส่งของขวัญ/คำขอที่ทำได้อยู่แล้วเป๊ะ · ฟิลด์เดิมใช้ซ้ำทั้งหมด ไม่มีฟิลด์ใหม่ (`r`=shop/collect · `cm`=id ของขวัญ/รหัสคำทัก · `cid`=รหัสใบในกล่องของขวัญ กันนับซ้ำ)
  - **ทำไมต้องมี:** ของขวัญ/คำทักหายจากกล่อง 🎁 ทันทีที่กดรับ/ไม่รับ · คำขอเป็นเพื่อนถูกลบตอนกดรับ/ปฏิเสธ → เดิม**ไม่มีที่ไหนย้อนดูได้เลย**ว่าใครส่งอะไรมาเมื่อไหร่
  - **Artifact ปุ่มคัดลอกก้อนเต็ม — 🆕 ใช้ใบนี้ (รอบ 983 · 33 โซน 555 บรรทัด · ไฮไลต์เหลือง 26 บรรทัด = โซน `gnotif`):** https://claude.ai/code/artifact/83189dd7-0cf5-4b97-85a5-73a59d901284 · ยืนยัน: ข้อความในปุ่มคัดลอกตรงกับก้อนใน RULES.md **ทุกตัวอักษร (29,768 ตัว)** · `json.loads` ผ่าน 33 โซน · ก้อนนี้รวม `pmAward`+`pm` ของ session คู่ขนาน (รอบ 979) ไว้ด้วย = **publish ครั้งเดียวจบทุกอย่างที่ค้าง**
  - **ยังไม่ publish = เกมไม่พัง:** ส่งของขวัญ/คำทัก/คำขอเป็นเพื่อน **สำเร็จปกติทุกอย่าง** (ใบแจ้งเตือนเขียนแยกคนละก้อน โดน deny ก็ไม่กระทบการส่ง) — แค่ 3 ชนิดใหม่ยังไม่มาโผล่ในกล่อง 🔔 (ไม่มี diff สำรองเหมือนไลก์/คอมเมนต์) → **ป้ายเหลืองในกล่อง 🔔 บอกตรง ๆ** ว่าต้องไปดูที่กล่องของมันเองก่อน (กฎทองข้อ 1)
- ✅ **รอบ 976 (3 ส.ค. 2026): โซนใหม่ `gnotif` (🔔 เก็บแจ้งเตือนไลก์/คอมเมนต์ย้อนหลัง — ปิดเกมแล้วกลับมายังเห็น + เลขค้างบนกระดิ่ง) — ผู้ใช้ publish แล้ว 3 ส.ค. 2026 · ตรวจสดยืนยัน (ดูหมายเหตุบนสุด):** `/gnotif/<ผู้รับ>/n/<nid>` = `{t,pid,cid,u,n,r,cm,tx,ts}` (`t` = `rx`|`cm`|`rp`|`cl`) · `/gnotif/<ผู้รับ>/seen` = nid ล่าสุดที่กดอ่านแล้ว (string ≤40) · **อ่านได้เฉพาะเจ้าของกล่อง** (`auth.uid === $uid` — แจ้งเตือนเป็นเรื่องส่วนตัว ไม่ใช่ของสาธารณะแบบ /gfeed) · **เขียนได้ 2 ทาง:** ① เจ้าของกล่องเอง (ไว้ตั้ง `seen` + กวาดใบเก่าทิ้งเมื่อเกิน 40) ② **คนที่กด** สร้างใบใหม่ได้เท่านั้น (`!data.exists()`) และต้อง `u === auth.uid` (ปลอมชื่อคนกดไม่ได้) **บวกเงื่อนไขว่าต้องมีสิทธิ์ยุ่งกับโพสต์ `pid` นั้นจริง** = เป็นเจ้าของโพสต์หรือเพื่อนของเจ้าของโพสต์ (สูตรเดียวกับสิทธิ์ไลก์/คอมเมนต์ของ `/gfeed` เป๊ะ) → คนแปลกหน้ายัดแจ้งเตือนใส่กล่องเด็กไม่ได้ · แก้/ลบใบที่มีอยู่แล้วได้เฉพาะเจ้าของกล่อง
  - **ยังไม่ publish = เกมไม่พัง:** เขียน/อ่านโดน deny → ระบบถอยกลับไปทำงานแบบรอบ 701 เป๊ะ (แจ้งเตือนคิดเองจาก diff ของ `/gfeed` เห็นเฉพาะช่วงที่เปิดเกมค้างอยู่) + ตั้งธง `Online.gnotifOk=false` → **กล่อง 🔔 ขึ้นป้ายเหลืองบอกตรง ๆ** ว่ายังเก็บย้อนหลังไม่ได้เพราะกฎโซน `/gnotif` (กฎทองข้อ 1 ห้ามปิดฟีเจอร์เงียบ) · ไลก์/คอมเมนต์/ตอบกลับ/ถูกใจคอมเมนต์ ไม่กระทบเลย
  - **publish ก้อนนี้ได้ `cl` ของรอบ 966 ที่ยังค้างไปพร้อมกันด้วย** (อยู่ในก้อนเต็มเดียวกัน)
  - **Artifact ปุ่มคัดลอกก้อนเต็ม — 🆕 ใช้ใบนี้ (รอบ 976 · 32 โซน 534 บรรทัด · ไฮไลต์เหลือง 26 บรรทัด = โซน `gnotif`):** https://claude.ai/code/artifact/b655958d-c995-4100-96ed-71b191dc43ed
  - 🛠️ **เจนด้วย `python tools/gen_rules_artifact.py <out.html> --round N --zone <ชื่อโซน>` (เครื่องมือใหม่รอบ 976)** — อ่านก้อนจาก RULES.md ตรง ๆ + `json.loads` ก่อนเขียนเสมอ ไม่ก๊อปมือ (เดิมทุกรอบเขียนสคริปต์ชั่วคราวใหม่ = เปลือง token) · ยืนยันแล้ว: `textContent` ของ `<pre>` (= ข้อความที่ปุ่มคัดลอกส่งเข้าคลิปบอร์ด) ตรงกับก้อนใน RULES.md **ทุกตัวอักษร 28,218 ตัว** · parse ผ่าน 32 โซน · `<mark>` ไม่ปนเข้าข้อความที่คัดลอก
- ✅ **รอบ 966 (3 ส.ค. 2026): โซนใหม่ `cl` ใต้ `/gfeed/$postId/cm/$cid` (💙 ถูกใจรายคอมเมนต์) — ผู้ใช้ publish แล้ว 3 ส.ค. 2026 · ตรวจสดยืนยัน (ดูหมายเหตุบนสุด) (ก้อนเดียวกับรอบ 964 ด้านล่าง — publish ครั้งเดียวได้ทั้งคู่):** `cl/<uid> = true` · **`.write` ชุดเดียวกับไลก์โพสต์เป๊ะ** (`auth.uid === $uid` และต้องเป็นเจ้าของโพสต์หรือเพื่อนของเจ้าของโพสต์ เช็กจาก `/friends` จริงฝั่ง rules) · `.validate` รับเฉพาะ `true` (boolean) — ยัดข้อความ/ตัวเลขไม่ได้ · **ต้องประกาศเป็นโซนชื่อจริง** เพราะ `"$other": {".validate": false}` ใต้ `cm/$cid` จะ deny ลูกที่ไม่มีชื่อในกฎ · ไม่แตะสิทธิ์เดิมของคอมเมนต์/ไลก์โพสต์เลย
  - **ยังไม่ publish = เกมไม่พัง:** `gfeedToggleCommentLike()` เขียนโดน deny → คืน `false` + ตั้งธง `Online.cmLikeRulesOld` → แผ่นคอมเมนต์ขึ้นป้ายเหลืองบอกตรง ๆ ว่ายังกดถูกใจรายคอมเมนต์ไม่ได้ (กฎทองข้อ 1 ห้ามปิดฟีเจอร์เงียบ) · ถูกใจ "ทั้งโพสต์"/คอมเมนต์/ตอบกลับ ไม่กระทบ
  - **Artifact ปุ่มคัดลอกก้อนเต็ม — 🆕 ใช้ใบนี้ (รอบ 968 · 31 โซน 508 บรรทัด · ไฮไลต์เหลืองบรรทัด 325–330 = โซน `cl`):** https://claude.ai/code/artifact/b0837383-ac74-4259-bf9a-2a8d657cc425 · (ใบเก่ารอบ 966 เนื้อหาเหมือนกัน: https://claude.ai/code/artifact/250a1f4e-5979-4877-9a6b-750636826af8)
  - **🔍 รอบ 968 ตรวจสดแล้ว (`firebase database:get "/.settings/rules"` + deep flatten เทียบทีละคีย์):** live 300 คีย์ vs ก้อนใน RULES.md 302 คีย์ → **ต่างกันแค่ `cl/$uid/.write` + `cl/$uid/.validate` เท่านั้น ไม่มีคีย์ไหนหาย ไม่มีค่าไหนเพี้ยน** = publish ก้อนนี้ทับได้ปลอดภัย 100% · ⚠️ อ่านกฎสดใน git-bash ต้องใส่ `MSYS_NO_PATHCONV=1` ไม่งั้น path `/.settings/rules` ถูกแปลงเป็น `C:\...` แล้ว CLI ตอบ "Path must begin with /"
- ✅ **รอบ 964 (3 ส.ค. 2026): field ใหม่ `p` ใต้ `/gfeed/$postId/cm/$cid` (💬 ตอบกลับใต้คอมเมนต์แบบ Facebook/TikTok) — ผู้ใช้ publish แล้ว (ยืนยันสดรอบ 968: `cm/$cid` บน live มีลูก `['$other','.validate','.write','n','p','ts','tx','u']` = มี `p` ครบ) → ปุ่ม ↩ ตอบกลับ + ยุบ/ขยายสายตอบกลับใช้งานได้เต็มระบบแล้ว:** `p` = รหัสคอมเมนต์แม่ (string ≤40) และ **validate บังคับว่าคอมเมนต์แม่ต้องมีอยู่จริงในโพสต์เดียวกัน** (`root.child('gfeed').child($postId).child('cm').child(newData.val()).exists()`) — กันยัดรหัสมั่ว/ข้ามโพสต์ · ไม่มีโซนใหม่ ไม่แตะสิทธิ์เขียนเดิม (ยังเป็นเพื่อนของเจ้าของโพสต์เท่านั้น) · **ต้องเพิ่มเพราะ `"$other": {".validate": false}` ใต้ `cm/$cid` ทำให้ field แปลกหน้าโดน deny ทั้งก้อน**
  - **ยังไม่ publish = เกมไม่พัง:** `gfeedAddComment()` เขียนก้อนที่มี `p` โดน deny → **ถอยเป็นคอมเมนต์ธรรมดาที่ขึ้นต้น "↪ @ชื่อ" ให้อัตโนมัติ** (ข้อความไม่หาย) + ตั้งธง `Online.cmReplyRulesOld` → แผ่นคอมเมนต์ขึ้นป้ายเหลืองบอกตรง ๆ ว่ายังซ้อนใต้คอมเมนต์ไม่ได้จนกว่าจะอัปเดตกฎ (กฎทองข้อ 1 ห้ามปิดฟีเจอร์เงียบ) · ไลก์/รีแอ็กชัน/คอมเมนต์ปกติ ไม่กระทบ
  - **Artifact ปุ่มคัดลอกก้อนเต็ม (ใช้ใบนี้ · 31 โซน 502 บรรทัด · ไฮไลต์บรรทัดที่เพิ่ม):** https://claude.ai/code/artifact/753590e0-05ef-4f36-8306-4261325ee4fe
- ✅ **รอบ 917 (2 ส.ค. 2026): โซนใหม่ `sgAward` + field `sg` ใน /leaderboard (เกมใหม่ 🎯 ยิงเป้าคำศัพท์ — แต้มสะสม + รางวัลรายเดือน Top 10) — ผู้ใช้ publish แล้ว 3 ส.ค. 2026 · ตรวจสดยืนยัน (ดูหมายเหตุบนสุด):** สูตรเดียวกับ `wsAward`/field `ws` เป๊ะ (`/sgAward/<YYYY-MM>` = snapshot ตัดรอบเขียนได้ครั้งเดียว · `sg` = แต้มสะสมตลอดกาล validate ตัวเลข ≥0) · **ยังไม่ publish = เกมไม่พัง:** เล่นได้ปกติ เก็บแต้ม/เหรียญในเครื่องครบ — onlinePushScore ถอย fallback ทีละขั้น (ก้อนที่มี `sg` โดน deny → ส่งก้อน tp+tw แทน) กระดานเห็นแต้มตัวเองสดจาก state · กระดานประกาศรางวัลยังตัดรอบไม่ได้จนกว่าจะ publish · ก้อนเต็มด้านล่างอัปเดตแล้ว · **Artifact ปุ่มคัดลอกก้อนเต็ม (31 โซน):** https://claude.ai/code/artifact/3bad17e9-4017-496a-af8e-2a55da92d1c9
- ✅ **รอบ 903 (2 ส.ค. 2026): โซนใหม่ `f1Rank` = กระดานอันดับ Best Lap ออนไลน์ของโลก F1 — ผู้ใช้ publish แล้ว 3 ส.ค. 2026 · ตรวจสดยืนยัน (ดูหมายเหตุบนสุด):** `/f1Rank/<uid> = {sec, n, g, ts}` (1 แถวต่อคน สนามเดียว) เก็บเวลาต่อรอบที่ดีที่สุด · **ยังไม่ publish = เกมไม่พัง:** โลก F1 เล่นได้ปกติ กระดานหน้า intro เห็นแค่สถิติตัวเอง ขึ้นป้ายบอกตรง ๆ ว่ากระดานกลางยังไม่เปิด · ก้อนเต็มด้านล่างอัปเดตแล้ว · **Artifact ปุ่มคัดลอกก้อนเต็ม:** https://claude.ai/code/artifact/ba9890de-eb86-4255-bed6-b322f0e4e688
- ✅ **รอบ 896 (2 ส.ค. 2026): โลกแข่งรถ F1 สนามซาเคียร์ — เพิ่ม `$map === 'f1'` ใน enum ของ `wroom` + `winfo` (2 จุด) — ผู้ใช้ publish แล้ว 3 ส.ค. 2026 · ตรวจสดยืนยัน (ดูหมายเหตุบนสุด):** แบบเดียวกับตอนเพิ่ม `soccer`/`mecha` เป๊ะ ไม่มีโซนใหม่ ไม่มี field ใหม่ · **ยังไม่ publish = เกมไม่พัง:** โลก F1 เล่นคนเดียวได้ปกติ แค่ยังไม่เห็นเพื่อนในสนาม (NetRoom เขียนโดน deny → ปิดการส่งเงียบ ๆ) · ก้อนเต็มด้านล่างอัปเดตแล้ว
- ✅ **รอบ 827 (30 ก.ค. 2026): โซนใหม่ `bandRank` = กระดานอันดับ "สอบใหญ่คลังศัพท์ขั้นสูง" ตลอดกาล — ผู้ใช้ publish แล้ว 30 ก.ค. 2026 · ตรวจสดผ่าน CLI+REST แล้ว:** เทียบ `/.settings/rules` สด (`firebase database:get`) กับก้อนใน RULES.md = **identical ทั้งไฟล์** (deep JSON compare) · REST: GET `/bandRank.json` + PUT ไม่ล็อกอิน = 401 Permission denied ถูกต้องทั้งคู่ → **กระดานใช้งานได้เต็มระบบ** — `/bandRank/<catId>_<lvKey>/<uid> = {sc, tt, sec, n≤40, g≤20, ts}` (`catId` เช่น `academic`/`ielts` · `lvKey` = `found`|`inter`|`expert`) · **อ่านได้ทุกคนที่ login** (เหมือน `/examRank`) · **เขียนได้เฉพาะแถวของ uid ตัวเอง** และ `$setId` ต้องตรงรูปแบบ `^[a-z]+_(found|inter|expert)$` · **validate บังคับว่าต้อง "สอบผ่านจริง"**: `sc <= tt` และ `sc*10 >= tt*8` (เกณฑ์ผ่าน 80% ของสอบใหญ่ต่างจาก `/examRank` ที่ 70%) · `sec` ≤ 86400 · `ts` ห้ามอนาคตเกิน 1 นาที · `.indexOn:"sc"` ให้ client ดึงแค่ `orderByChild('sc').limitToLast(50)` ไม่ต้องโหลดทั้งตาราง — สูตรเดียวกับ `/examRank` (รอบ 825) เป๊ะ ต่างแค่คนละโซน/คนละเกณฑ์ผ่าน
  - **ทำไมต้องมีโซนนี้:** เดิม (รอบ 786) กระดานอ่านจากฟีดรวม `Online.gfeed` (120 โพสต์ล่าสุดทั้งเกม) → คนที่สอบผ่านนานแล้วโพสต์หลุดออก = หายจากกระดานของคนอื่น เป็นแค่ "อันดับจากกิจกรรมล่าสุด" · โซนนี้เก็บ **1 แถวต่อคนต่อ (หมวด,ระดับ)** จึงเป็นอันดับตลอดกาลจริง
  - **ยังไม่ publish = เกมไม่พัง:** เขียน/อ่านโดน deny → `Online.bxrOk=false` → กระดานยังเห็น **สถิติของตัวเอง** (จากใบประกาศผ่าน `bandAdvExamBest`) และขึ้นป้ายบอกตรง ๆ ว่า "กระดานกลางยังไม่เปิด (ต้องอัปเดตกฎความปลอดภัยโซน /bandRank ก่อน)" — `bxRankNote()` ใน `js/bandadv.js` (กฎทองข้อ 1 ห้ามปิดฟีเจอร์เงียบ) · ระบบสอบ/รางวัล/ใบประกาศ ทำงานปกติทุกอย่าง
  - **Artifact ปุ่มคัดลอกก้อนเต็ม (ใช้ใบนี้):** https://claude.ai/code/artifact/854df926-f052-4fd5-bafc-a1fc491fed47
- ✅ **รอบ 825 (30 ก.ค. 2026): โซนใหม่ `examRank` = กระดานอันดับข้อสอบมาตรฐาน "ตลอดกาล" — ผู้ใช้ publish แล้ว 30 ก.ค. 2026 (พร้อมกับรอบ 827) · ตรวจสดผ่าน CLI+REST แล้ว:** เทียบ `/.settings/rules` สดกับก้อนใน RULES.md = **identical ทั้งไฟล์** · REST: GET `/examRank.json` ไม่ล็อกอิน = 401 Permission denied ถูกต้อง → **กระดานใช้งานได้เต็มระบบ** — `/examRank/<setId>/<uid> = {sc, tt, sec, n≤40, g≤20, ts}` (setId เช่น `ielts_1`, `toeic_3`) · **อ่านได้ทุกคนที่ login** (`auth != null` เหมือน `/gfeed`) · **เขียนได้เฉพาะแถวของ uid ตัวเอง** (`auth.uid === $uid`) และ `$setId` ต้องตรงรูปแบบ `^[a-z]+_[0-9]{1,2}$` · **validate บังคับว่าต้อง "สอบผ่านจริง"**: `sc <= tt` และ `sc*10 >= tt*7` (= เกณฑ์ผ่าน 70% ตาม `XS_PASS_PCT`) · `sec` ≤ 86400 · `ts` ห้ามอนาคตเกิน 1 นาที · `.indexOn:"sc"` ให้ client ดึงแค่ `orderByChild('sc').limitToLast(50)` ไม่ต้องโหลดทั้งตาราง
  - **ทำไมต้องมีโซนนี้:** เดิม (รอบ 817) กระดานอ่านจากฟีดรวม `Online.gfeed` (120 โพสต์ล่าสุดทั้งเกม) → คนที่สอบผ่านนานแล้วโพสต์หลุดออก = หายจากกระดานของคนอื่น เป็นแค่ "อันดับจากกิจกรรมล่าสุด" · โซนนี้เก็บ **1 แถวต่อคนต่อชุด** (ฝั่งเขียนเทียบก่อนว่าดีกว่าเดิมไหม) จึงเป็นอันดับตลอดกาลจริง และขนาดตารางโตตามจำนวนผู้เล่น × ชุด ไม่โตตามจำนวนครั้งที่สอบ
  - **ยังไม่ publish = เกมไม่พัง:** เขียน/อ่านโดน deny → `Online.xrkOk=false` → กระดานยังเห็น **สถิติของตัวเอง** (จากใบประกาศ `state.certs`) และขึ้นป้ายบอกตรง ๆ ว่า "กระดานกลางยังไม่เปิด (ต้องอัปเดตกฎความปลอดภัยโซน /examRank ก่อน)" — `xrkNote()` ใน `js/examstd.js` (กฎทองข้อ 1 ห้ามปิดฟีเจอร์เงียบ) · ระบบสอบ/รางวัล/ใบประกาศ/ฟีด ทำงานปกติทุกอย่าง
  - **Artifact ปุ่มคัดลอกก้อนเต็ม (ใช้ใบนี้ · 28 โซน 450 บรรทัด):** https://claude.ai/code/artifact/79fa6a20-7c7f-4cfc-af4a-c3ab1c69e73b
- ✅ **โซน `pphoto` — ผู้ใช้ publish แล้ว 30 ก.ค. 2026 (ยืนยันสดรอบ 763 ว่าเป็นโซนเดียวที่ยังไม่ขึ้น, ตอนนี้ตรวจสดผ่าน CLI+REST ว่าขึ้นแล้ว):** เทียบ `/.settings/rules` สดกับก้อนใน RULES.md = **identical ทั้งไฟล์** · REST: GET `/pphoto.json` ไม่ล็อกอิน = 401 Permission denied ถูกต้อง → **อัปโหลดรูปโปรไฟล์เพื่อนเห็นกันได้เต็มระบบแล้ว** — เทียบ `/.settings/rules` สดกับก้อนใน RULES.md แบบ deep flatten: ต่างกันแค่ 3 คีย์ (`/pphoto/$uid/.read|.write|.validate`) นอกนั้น identical ทั้งไฟล์ (แปลว่า `wsAward`/`tpAward`/รีแอ็กชัน `gfeed` ที่เขียนว่ารอ publish อยู่ **ขึ้น live ไปแล้ว**) · **อาการที่ผู้ใช้เจอ:** อัปโหลดรูปแล้วเพื่อนยังเห็นตัวการ์ตูน (เขียน `/pphoto` โดน deny) · **Artifact ปุ่มคัดลอกก้อนเต็มล่าสุด (ใช้ใบนี้):** https://claude.ai/code/artifact/fa6c6ee8-ca13-4004-8041-231b65ac11ba · (ใบเก่ารอบ 709: https://claude.ai/code/artifact/9056ef14-1220-4e31-aaa7-0fcee53e7f73) — `/pphoto/<uid>` = สตริง data URL ของรูป JPEG จัตุรัสก้อนเล็ก (ครอป+ย่อในเครื่องแล้ว) · **อ่านได้ทุกคนที่ login** (เพื่อนเห็นรูปในการ์ดโปรไฟล์) · **เขียน/ลบได้เฉพาะเจ้าของ** (`auth.uid === $uid`) · validate บังคับ 2 ชั้น: ต้องขึ้นต้น `data:image/jpeg;base64,` และ **ยาว ≤30000 ตัวอักษร** (client บีบให้ ≤28000 อยู่แล้ว — กันคนดัดแปลง client ยัดไฟล์ใหญ่ถล่มโควตา)
  - **ยังไม่ publish = เกมไม่พัง:** เขียนโดน deny → รูปยังใช้ได้เต็มที่ในเครื่องตัวเอง (เก็บ localStorage) แต่เพื่อนยังไม่เห็น → **เกมเด้ง toast บอกตรง ๆ ว่าติดกฎ /pphoto** (กฎทอง #1 ห้ามปิดเงียบ) · ทุกระบบอื่นไม่กระทบ
  - 🔎 **รอบ 763 เพิ่มป้ายถาวรในกล่องรูปโปรไฟล์** (`photoVerify()` ใน `js/photo.js`): อ่านกลับจาก `/pphoto/<uid>` ทุกครั้งที่เปิดกล่อง → "✅ เพื่อนเห็นรูปนี้แล้ว" / "⚠️ รูปนี้ยังอยู่แค่ในเครื่องนี้…" (toast เด้งครั้งเดียวตอนอัปโหลดแล้วหาย ผู้ใช้พลาดได้) · **DB ไม่ตรงกับเครื่อง = ส่งซ้ำให้เอง** → หลัง publish rules ผู้ใช้แค่เปิดกล่องอีกครั้ง ไม่ต้องอัปโหลดรูปใหม่
  - 🛡️ **ความปลอดภัยเด็ก:** รูปเป็นของสาธารณะระดับเดียวกับชื่อเล่น/leaderboard → กล่องอัปโหลดในเกมเตือน "ให้ผู้ปกครองช่วยเลือก · เลี่ยงรูปที่บอกชื่อจริง/โรงเรียน/ที่อยู่" และลบออกได้ตลอด (ลบ = หายทั้งเครื่องและ DB)
- ✅ **รีแอ็กชันฟีดแบบ Facebook (รอบ 701) — ผู้ใช้ publish แล้ว 30 ก.ค. 2026 · ตรวจสดผ่าน CLI แล้ว:** `/gfeed/$postId/lk/$uid` validate สดตรงกับ RULES.md เป๊ะ — รับ `true` หรือ string รหัสรีแอ็กชัน ≤8 ตัว (`like`/`love`/`haha`/`wow`/`star`/`care`) → **กดรีแอ็กชันแบบ Facebook ใช้งานได้เต็มระบบแล้ว**
- ✅ **โซนใหม่ `tpAward` + field `tp`/`tw` ใน /leaderboard (รอบ 649+654 · ยอดสะสม + รางวัลรายเดือน Top 10 แท็บ ⌨️ พิมพ์คำ) — ผู้ใช้ publish แล้ว 30 ก.ค. 2026 · ตรวจสดผ่าน CLI+REST แล้ว:** เทียบ `/.settings/rules` สดกับก้อนใน RULES.md = **identical ทั้งไฟล์** · REST: GET `/tpAward.json` = 200 (อ่านสาธารณะถูกต้อง) → **แท็บ ⌨️ พิมพ์คำใช้งานได้เต็มระบบแล้ว** (`/tpAward/<YYYY-MM>` = `{at, w:{<uid>:{r:1-10, p:0-10000, n≤40, g≤20, s=จำนวนคำ, s2=เหรียญสะสม}}}`)
  - 🔢 **รอบ 654 (ผู้ใช้สั่งแก้กติกา):** อันดับตัดสินที่ **`tw` = จำนวนคำที่พิมพ์** (ไม่ใช่ `tp`) · `tp` = เหรียญสะสม โชว์คู่กันและใช้ตัดสินตอนคำเท่ากัน → snapshot จึงมี `s2` เพิ่ม
  - ⚠️ **publish ก้อนนี้ได้ทั้ง `wsAward` ที่ค้างมาตั้งแต่รอบ 592 ไปพร้อมกันด้วย** (อยู่ในก้อนเต็มเดียวกัน — ดูสถานะ ✅ ด้านล่าง)
- ✅ **รอบ 640 (โซนใหม่ `wroom` + `winfo` · 🏟️ ระบบหลายสนาม room sharding ทุกโลก 3D) — ผู้ใช้ publish แล้ว 28 ก.ค. 2026 · ตรวจสดผ่าน CLI แล้ว (`firebase database:get /.settings/rules`):** เทียบทั้งไฟล์กับก้อนใน RULES.md = **identical ครบ 25 โซน** (deep JSON compare) · REST: GET `/wroom.json` ไม่ล็อกอิน = 401 Permission denied ถูกต้อง → **ระบบหลายสนามใช้งานได้เต็มระบบ** · เดิม: `/wroom/<map>/<room>/<uid>` = ตำแหน่งสด (ข้อมูลร้อน ส่งถี่) · `/winfo/<map>/<room>/<uid>` = ชื่อเล่น/คะแนน/แชท (ข้อมูลเย็น เขียนเฉพาะตอนเปลี่ยน + เต้นหัวใจ 20 วิ) — แยกสองชั้นเพื่อให้ “นับหัวก่อนเข้าสนาม” อ่านแค่ ~1KB ต่อสนาม และ payload เบาลง 42% · `$room` จำกัด `r0`–`r35` (36 สนาม × 14 คน = 504 คน) · enum `$map` เพิ่ม `soccer`/`mecha` ที่ของเดิมตกหล่น · ⚠️ โซน `/world` เดิมยังอยู่ครบ (สะพานให้เครื่องเก่า) · **Artifact ปุ่มคัดลอกก้อนเต็ม:** https://claude.ai/code/artifact/935970e1-029a-49db-8902-ffe64616ca8c
- ✅ **รอบ 639 (โซนใหม่ `gfeed` · 🌍 หน้า Feed ทุกคน + ไลก์/คอมเมนต์) — ผู้ใช้ publish แล้ว 28 ก.ค. 2026 · ตรวจสดผ่าน CLI แล้ว (`firebase database:get /.settings/rules`):** เทียบทั้งไฟล์กับก้อนใน RULES.md = **identical ครบ 25 โซน** (deep JSON compare รวมกับ `wroom`/`winfo` ของรอบ 640 ที่ publish มาด้วยกัน) · REST: GET `/gfeed.json` ไม่ล็อกอิน = 401 Permission denied ถูกต้อง (ต้อง login ถึงอ่านได้ตามที่ตั้งใจ) → **หน้า Feed ทุกคน + ไลก์/คอมเมนต์ใช้งานได้เต็มระบบ** · เดิม: `/gfeed/<postId>` = โพสต์กิจกรรมรวมทุกคน (ไม่ใช่แค่คนที่ follow) พร้อม `lk/<uid>` (ไลก์) และ `cm/<cid>` (คอมเมนต์) ซ้อนอยู่ใต้โพสต์เดียวกัน · **ไลก์/คอมเมนต์เขียนได้เฉพาะเจ้าของโพสต์เอง หรือคนที่เป็นเพื่อนกับเจ้าของโพสต์** (เช็กจาก `/friends` จริงฝั่ง rules ไม่ใช่แค่ client) — คนแปลกหน้าอ่านโพสต์ได้ปกติแต่กดไลก์/คอมเมนต์ไม่ได้ (ตามที่ผู้ใช้เลือก 28 ก.ค. 2026 เพื่อความปลอดภัยเด็ก) · `.indexOn:"u"` ไว้ให้ client กวาดโพสต์เก่าของตัวเองทิ้งเมื่อเกิน `GFEED_KEEP_ME`(10 โพสต์/คน) · **Artifact ปุ่มคัดลอกก้อนเต็ม:** https://claude.ai/code/artifact/c0269b97-69dd-4677-9889-9c5d524383af
- ✅ **รอบ 631 (👥 โทรกลุ่ม 3 คน: `/calls` เพิ่ม `r`/`g` + `k` รับ `nofr`/`full` · 🔒 ลบวิดีโอคอลทั้งระบบ) — ผู้ใช้ publish แล้ว 28 ก.ค. 2026 · ตรวจสดผ่าน CLI แล้ว:** อ่าน `/.settings/rules` สด → **เทียบทั้งไฟล์กับก้อนใน RULES.md = identical ครบ 22 โซน** · `r` ≤128 · `g` ≤400 · `k` enum มี `nofr`/`full` จริง → **ระบบโทรกลุ่มใช้งานได้เต็มระบบ** · **Artifact ปุ่มคัดลอกก้อนเต็ม:** https://claude.ai/code/artifact/e018942d-52ae-4908-88c8-b8da6d604b22
- ✅ **รอบ 625 (โซนใหม่ `calls` + `'chat'` ใน enum `/rtc` · 📞 โทรหาเพื่อน voice/video) — ผู้ใช้ publish แล้ว 27 ก.ค. 2026 · ตรวจสดผ่าน CLI แล้ว:** อ่าน `/.settings/rules` สด → **เทียบทั้งไฟล์กับก้อนใน RULES.md = identical ครบ 22 โซน** · มี `/calls` จริง · `$map === 'chat'` เข้า enum จริง · `d` ≤ 20000 จริง → **ระบบโทรใช้งานได้เต็มระบบแล้ว** (เหลือทดสอบจริง 2 บัญชี/2 เครื่อง) · เดิม: `/calls/<toUid>/<fromUid>` = `{k, n, m, ts}` (k = `ring`/`ok`/`no`/`busy`/`end` · m = `voice`/`video` · n = ชื่อผู้โทร ≤40) · **อ่านได้เฉพาะเจ้าของกล่อง** (`auth.uid === $toUid`) · เขียนได้เฉพาะผู้โทร (node ชื่อ uid ตัวเอง) หรือเจ้าของกล่อง (ไว้ล้างกริ่งที่จัดการแล้ว) · **`/rtc`: เพิ่ม `$map === 'chat'`** (ท่อ SDP/ICE ของสาย ใช้โครงเดิมของ voice chat ในโลก 3D) + ขยาย `d` จาก 8000 → **20000 ตัวอักษร** (SDP ของวิดีโอยาวกว่าเสียงล้วน)
  - **ยังไม่ publish = เกมไม่พัง:** กดปุ่ม 📞/📹 แล้วเขียนโดน deny → จอสายขึ้น **ป้ายเหลืองบอกตรง ๆ** ว่า "ระบบโทรยังไม่เปิดใช้งาน — ต้องอัปเดตกฎความปลอดภัยโซน /calls ก่อน" แล้ววางสายเองใน 3 วิ · แชท/ของขวัญ/ทุกระบบอื่นทำงานปกติ
  - 🔒 **ความปลอดภัยเด็ก:** client รับสายเฉพาะ uid ที่อยู่ใน `/friends` ของตัวเอง (คนแปลกหน้าโทรเข้า = ลบกริ่งทิ้งเงียบ ๆ) · เสียง/ภาพวิ่ง P2P ไม่ผ่านเซิร์ฟเวอร์ · ไม่มีการอัดเก็บ
- ✅ **โซนใหม่ `wsAward` (รอบ 592 · รางวัลรายเดือน Top 10 แท็บ 🔎 ค้นหาคำ) — ผู้ใช้ publish แล้ว 30 ก.ค. 2026 · ตรวจสดผ่าน CLI+REST แล้ว:** เทียบ `/.settings/rules` สดกับก้อนใน RULES.md = **identical ทั้งไฟล์** · REST: GET `/wsAward.json` = 200 (อ่านสาธารณะถูกต้อง) → **แท็บ 🔎 ค้นหาคำใช้งานได้เต็มระบบแล้ว** (`/wsAward/<YYYY-MM>` = `{at, w:{<uid>:{r:1-10, p:0-10000, n≤40, g≤20, s=จำนวนคำ, s2=เหรียญสะสม}}}` · เขียนได้ครั้งเดียวเท่านั้น `auth != null && !data.exists()` = เครื่องแรกที่เปิดเกมหลัง 00:01 ของวันที่ 1 เป็นคน "ตัดรอบ" แล้วใครก็เขียนทับไม่ได้)
  - **ความเสี่ยงที่ยอมรับ (ระดับเดียวกับ coins/`sales` ฝั่ง client):** client ที่ดัดแปลงเองอาจชิงเขียน snapshot ที่ยกอันดับตัวเอง — เหรียญเป็นฝั่ง client อยู่แล้ว และ snapshot เขียนได้ครั้งเดียวต่อเดือนจึงจำกัดผลกระทบ
- ✅ **รอบ 590 (field `ws` ใน /leaderboard = แต้มสะสมเกมค้นหาคำ Word Search) — ผู้ใช้ publish แล้ว 26 ก.ค. 2026 · ตรวจ rules สดผ่านครบ:** อ่าน `/.settings/rules` สดด้วย token ของ firebase CLI → **เทียบทั้งไฟล์กับก้อนใน RULES.md = identical ครบ 20 โซน** และมี `ws: {".validate":"newData.isNumber() && newData.val() >= 0"}` จริง · REST: GET /leaderboard = 200 (อ่านสาธารณะ) · PUT ไม่ล็อกอิน = 401 denied · **ผู้เล่นจริงเขียน `ws` ขึ้น DB ได้แล้ว** (พบ `ws:38` ใน /leaderboard) → แท็บ 🔎 ค้นหาคำ เห็นแต้มของเพื่อนได้เต็มระบบ · **Artifact ปุ่มคัดลอกก้อนเต็ม:** https://claude.ai/code/artifact/529eb9e8-b60b-4bc0-89e7-0e5699423745
- ✅ **รอบ 362 (โซนใหม่ `ads` = เช่าป้ายโฆษณาเมืองเฮลิฯ) — ผู้ใช้ publish แล้ว 19 ก.ค. 2026 · ตรวจสดผ่านครบ:** REST GET /ads = 200 (อ่านสาธารณะ) · PUT ไม่ล็อกอิน = Permission denied · เทียบ rules สดทั้งไฟล์ (CLI `/.settings/rules`) กับก้อนใน RULES.md = **identical ครบ 20 โซน** + เงื่อนไข expiry/ts clamp/uid เข้าจริง · **โบนัส: ของที่ค้าง publish มาก่อน (รอบ 186 g≤20 · 187 typing · 241 chattheme · 255-256 ba+hs) ติดมากับก้อนนี้ครบแล้ว — ปิดค้างทั้งหมด** · เดิม: `/ads/<n 1-10>` = `{uid, n:ชื่อผู้เช่า ≤40, ts}` · อ่านสาธารณะ (ชื่อโชว์บนป้ายอยู่แล้ว — ระดับเดียวกับ leaderboard) · เขียนได้เมื่อ **ว่าง / หมดอายุ (ts เกิน 7 วัน = 604800000 ms) / ป้ายของตัวเอง** · `uid` ต้อง = auth.uid · `ts` ห้ามอนาคตเกิน 1 นาที (กันจองแช่ถาวร) · **ยังไม่ publish = เกมไม่พัง:** ปุ่ม 🪧 เช่าป้ายกดแล้วเขียนโดน deny → toast บอก "ระบบยังไม่เปิด" **ไม่หักเหรียญ** (หักหลังเขียนสำเร็จเท่านั้น) ป้ายโชว์ข้อความติดต่อโฆษณาเดิม · ก้อนเต็มด้านล่างอัปเดตแล้ว · **Artifact ปุ่มคัดลอก:** https://claude.ai/code/artifact/b22a7f09-1429-4645-86df-14a637750a15
- ✅ **รอบ 325 (🐾 ทักทายน้องของเพื่อน) — ผู้ใช้ publish แล้ว 18 ก.ค. 2026 · ตรวจ rules สดผ่าน CLI token แล้ว:** `k` ของ `/gifts` รับ `'shop' | 'collect' | 'greet'` จริงบน server · **เทียบทั้งไฟล์กับก้อนใน RULES.md = ตรงกันเป๊ะทุกโซน (19 โซน identical)** ไม่มีโซนไหนหาย · ของที่เคยค้างมาก่อนติดมาครบด้วย (leaderboard `ba`+`hs` รอบ 255-256 · `chattheme` รอบ 241 · `typing` รอบ 187 · world enum `moto`) → **ปิดค้างทั้งหมด** · เดิม: แก้ **จุดเดียว** ใน `/gifts/$toUid/$fromUid/$giftKey/k` → เพิ่มค่า `'greet'` เข้า enum เดิม (เดิมรับแค่ `'shop'`/`'collect'`) · ไม่มีโซนใหม่ ไม่มี field ใหม่ (ใช้ `id` เก็บรหัสคำทัก เช่น `hi`/`hug`/`treat` ≤40 ตัวอักษรตาม validate เดิม) · **ยังไม่ publish = เกมไม่พัง:** ปุ่ม 🐾 ทักทายน้อง กดแล้วโดน deny → เด้ง toast บอกว่ายังอัปเดตกติกาไม่เสร็จ ส่วนของขวัญปกติ/แชท/ทุกอย่างอื่นทำงานเหมือนเดิมทั้งหมด · ก้อนเต็มด้านล่างอัปเดตแล้ว · **Artifact ปุ่มคัดลอก:** https://claude.ai/code/artifact/b7b0dfb7-9e21-48bf-917f-0cdc6cce5136
- ✅ **รอบ 255-256 (field `ba` ตัวละคร blk + `hs` หนีผีรอดนานสุด) — เข้า live แล้ว 19 ก.ค. 2026 (ติดมากับ publish รอบ 362 · ตรวจสดแล้ว):** เดิม: เพิ่มใน `/leaderboard/$uid`: `ba` (string ≤8 เช่น "blk3" — การ์ดโชว์ blk เต็มตัว) + `hs` (number ≥0 วินาที — สถิติหนีผีรอดนานสุด) · **ยังไม่ publish = เกมไม่พัง:** เขียนโดน deny → client ถอยไปเขียนก้อนเดิมอัตโนมัติ (แค่การ์ดคนอื่นไม่มีรูป/สถิติผี) · ก้อนเต็มด้านล่างอัปเดตแล้ว · **Artifact ปุ่มคัดลอก (รวม ba+hs publish ทีเดียวจบ):** https://claude.ai/code/artifact/107ef295-bb7f-4bb1-a381-82b24ab80184
- ✅ **รอบ 241 (โซนใหม่ `chattheme` = ธีมแชทร่วมกันทั้งคู่) — เข้า live แล้ว 19 ก.ค. 2026 (ติดมากับ publish รอบ 362 · ตรวจสดแล้ว):** เดิม: `/chattheme/$pairId` = themeId (string ≤16) · read/write เฉพาะคู่สนทนา (`$pairId.contains(auth.uid)`) · ใครเปลี่ยนธีมแชท อีกฝ่ายเห็นเปลี่ยนตามทันที (เดิมจำแยกในเครื่องใครเครื่องมัน) · **ยังไม่ publish = แชทปกติไม่กระทบ แค่ธีมยังไม่ sync ข้ามเครื่อง** (client เขียนโดน deny เงียบๆ → ตกไปใช้ธีมในเครื่องเดิม) · ก้อนเต็มด้านล่างอัปเดตแล้ว · **Artifact ปุ่มคัดลอก:** https://claude.ai/code/artifact/5d652aa8-0a38-4b9c-b98d-dbd4d585b657
- ✅ **รอบ 208 (โซนใหม่ `sales` = ยอดขายสินค้ารวมทั้งเซิร์ฟเวอร์) — ผู้ใช้ publish แล้ว 14 ก.ค. 2026 · ตรวจ REST ผ่าน:** GET /sales = 200 (null · อ่านสาธารณะได้) · PUT /sales ไม่ล็อกอิน = 401 Permission denied (เขียนต้อง auth · กันปั่นยอด) → ยอดขายนับจริงข้ามเครื่องแล้ว · เดิม:** `/sales/$id` = number · `.read:true` (ทุกคนเห็นยอดขาย) · `.write` เฉพาะ auth + **เพิ่มได้ทีละ 1 เท่านั้น** (`newData === data+1` หรือสร้างใหม่ = 1) กันปั่นยอด · client `sellInc(id)` = transaction +1 ตอนซื้อ (robots/cars/tickets/pets/home/phone/computer/ac/items) · **ยังไม่ publish = เกมไม่พัง:** เขียน/อ่าน /sales โดน deny เงียบ → `Online.salesOk=false` · ป้ายโชว์ "ขายไปแล้ว 0 ชิ้น" (+นับ local ของตัวเองในเซสชัน) จนกว่าจะ publish · Artifact ปุ่มคัดลอกก้อนเต็ม (ก้อนเต็มด้านล่างอัปเดตแล้ว)
- ✅ **รอบ 187 (โซนใหม่ `typing` = "กำลังพิมพ์…") — เข้า live แล้ว 19 ก.ค. 2026 (ติดมากับ publish รอบ 362 · ตรวจสดแล้ว):** เดิม: `/typing/$pairId/$uid` = timestamp (number) · read/write เฉพาะคู่สนทนา (`$pairId.contains(auth.uid)` + เขียนได้เฉพาะ node ตัวเอง) · **ยังไม่ publish = แชทปกติไม่กระทบ แค่ไม่เห็นสถานะพิมพ์** (client เขียนโดน deny เงียบๆ) · Artifact เดียวกับรอบ 186 (อัปเดตแล้ว): https://claude.ai/code/artifact/fdfc973b-559a-4a05-b181-f21416cd8cd6
- ✅ **รอบ 186 (แก้บั๊ก "รับเพื่อนไม่ได้" — `g` ≤20 ทั้ง 4 โซน) — เข้า live แล้ว 19 ก.ค. 2026 (ติดมากับ publish รอบ 362 · ตรวจสดแล้ว → บัญชีชั้นเรียนยาวรับเพื่อน/ขึ้นออนไลน์ได้แล้ว):** เดิม: ต้นตอ = ทุกโซนที่มี field `g` (ชั้นเรียน) validate ไว้ `length <= 8` แต่ตัวเลือกชั้นเรียนมี "ปริญญาตรี" (9) · "สูงกว่าปริญญาตรี" (15) · "ต่ำกว่าประถมศึกษา" (17) → บัญชีที่เลือกชั้นยาว เขียน `friends`/`presence`/`leaderboard`/`friendReq` **ไม่ผ่าน validate** = รับเพื่อน/ขึ้นออนไลน์/กระดานไม่ได้เงียบๆ · **แก้: `g` ทั้ง 4 โซน (presence/leaderboard/friendReq/friends) `<= 8` → `<= 20`** (av คงเดิม ≤8) · **ยังไม่ publish = บัญชีชั้นยาวยังรับเพื่อนไม่ได้** · Artifact ปุ่มคัดลอกก้อนเต็ม: https://claude.ai/code/artifact/fdfc973b-559a-4a05-b181-f21416cd8cd6
- ✅ **รอบ 155 (Follow + Feed กิจกรรม) — ผู้ใช้ publish แล้ว 12 ก.ค. 2026:** โซนใหม่ `/feed` (โพสต์กิจกรรมที่เจ้าของเปิดเผย + คลังทรัพย์สิน) + `/follow` (ใคร follow ใคร แบบ TikTok) เข้าแล้ว · **ตรวจ REST จากภายนอกแล้ว:** /presence อ่านได้ 200 (ก้อนรวมไม่พัง) · /feed + /follow อ่าน/เขียนโดยไม่ login โดน 401 Permission denied ถูกต้องครบ 4 เคส · เหลือทดสอบจริง 2 เครื่อง (เปิดเผยกิจกรรม → เพื่อนเห็น + follow + ฟีดขึ้น)
- ✅ **รอบ 317 (โลกมอเตอร์ไซค์เล่นรวมกัน) — ผู้ใช้ publish แล้ว 18 ก.ค. 2026 · ตรวจ rules สดผ่าน CLI แล้ว (`$map === 'moto'` เข้า enum จริง + ก้อนทั้งไฟล์ตรงกับ RULES.md ทุกโซน):** เพิ่ม `$map === 'moto'` ใน enum ของ `/world` (จุดเดียว บรรทัด `.validate` ของ `/world/$map`) — ก้อนเต็มด้านล่างอัปเดตแล้ว · **ยังไม่ publish = ไม่พังอะไร:** โลกมอไซค์เล่นคนเดียวได้ปกติ แค่ยังไม่เห็นเพื่อน (client เขียนโดน deny → ปิดการส่งเงียบๆ `netOk=false` ใน moto3d.js) · ไม่มี field ใหม่ — ยานพาหนะที่เพื่อนขับ ('moto'/'car') ส่งผ่าน field `av` เดิมที่ rules รับอยู่แล้ว
- ✅ **รอบ 132 (ไฟเลี้ยวโลกขับรถ) — publish รวมมากับก้อนรอบ 155 แล้ว 12 ก.ค. 2026** (field `tl` อยู่ในก้อนเดียวกัน) · เดิม: เพิ่ม field `tl` (ไฟเลี้ยว 0=ปิด 1=ซ้าย 2=ขวา · number 0-2) ใน `/world/$map/$uid` — ก้อนเต็มด้านล่างอัปเดตแล้ว + Artifact ปุ่มคัดลอก: https://claude.ai/code/artifact/59c3da79-b3cc-4053-b5f3-5283b4729b7a · **ยังไม่ publish = เกมไม่พัง:** client ส่ง tl เฉพาะตอนเปิดไฟ ถ้าเขียนโดน deny จะตัด tl ส่งซ้ำทันที (`netTlOk` ใน sendPos adventure3d.js) — multiplayer เดินต่อปกติ แค่เพื่อนไม่เห็นไฟเลี้ยวจนกว่าจะ publish
- ✅ **รอบ 124 (ตลาดออนไลน์จริง — item 2) ผู้ใช้ publish แล้ว 11 ก.ค. 2026:** โซนใหม่ `/market` + `/msold` เข้าแล้ว · **ตรวจ REST จากภายนอกแล้ว:** /presence อ่านได้ 200 (rules ทั้งก้อนไม่พัง) · /market อ่านโดยไม่ login โดน 401 Permission denied ถูกต้อง · เหลือทดสอบซื้อ-ขายจริง 2 บัญชี/2 เครื่อง · ความเสี่ยงที่ยอมรับ: ซื้อ=ลบ node ของคนอื่นได้ (จำเป็นต่อกลไกซื้อ) + ใบเสร็จเขียนได้ทุก auth แต่ฝั่งคนขายจ่ายเฉพาะใบเสร็จที่ (1) ตรง netKey ของประกาศตัวเอง (2) ของหลุดจากตลาดแล้วจริง — ระดับเดียวกับ coins ฝั่ง client
- ✅ **รอบ 113 (โลกขับรถ drive + โดรน drone) — ผู้ใช้ publish แล้ว 10 ก.ค. 2026** (ผู้ใช้ยืนยันเองหลังได้ Artifact ปุ่มคัดลอก): map `drive`+`drone` เข้า enum ครบ 4 จุด (/world $map · /tinv map · /rtc · /class $map) → multiplayer/voice/ครูคุมห้องใช้ได้ทั้งโลกขับรถและโดรน · เหลือทดสอบจริง 2 เครื่อง
- ~~⏳ รอบ 85 (โลกโดรน FPV) — publish รวมไปกับรอบ 113 แล้ว~~ **รอบ 85 (โลกโดรน FPV) — เดิมค้าง publish:** เพิ่ม map `drone` ใน enum 4 จุด (/world $map · /tinv map · /rtc · /class $map) — ก้อนเต็มด้านล่างอัปเดตแล้ว · **ยังไม่ publish = โดรนเล่นคนเดียวได้ปกติ แต่ multiplayer/voice/ครูคุมห้องของโลกโดรนจะยังไม่ทำงาน** (เขียน /world/drone โดน deny เงียบๆ ไม่พังเกม) · โครงเหมือนโลกเฮลิฯเป๊ะ ไม่หย่อน security
- ✅ **รอบ 82 (คำเดียวกันในปาร์ตี้) publish แล้ว 9 ก.ค. 2026:** field `cw` (คำเป้าหมาย string "en|th" ≤60) ใน `/world/$map/$uid` เข้าแล้ว · ยืนยัน logic ฝั่ง client ด้วยการจำลอง peer 8 เคสผ่านหมด (leader election / ลูกทีมตามคำหัวหน้า / guard `lastSharedDone` / คนทั่วไปไม่ส่ง cw ไม่ผูก rules / คำมีอยู่แล้วดันขึ้นหน้าไม่ซ้ำ)
- ✅ **รอบ 52 (โลกเฮลิคอปเตอร์) publish แล้วพร้อมกัน 9 ก.ค. 2026:** map `heli` ในทุก enum (/world /rtc /class /tinv) + field `y` (ความสูงบิน) ใน /world เข้าแล้ว (มาในก้อนเต็มเดียวกัน)
- ⏳ เหลือ**ทดสอบจริง 2 บัญชี/2 เครื่องบน Pages** (เห็นคำเดียวกันตอน invite กันเข้าโลกเฮลิฯ + online เฮลิฯ ทั้งหมด)
- ✅ ชุดก่อนหน้า publish แล้ว 8 ก.ค. 2026 (ครบถึงรอบ 49): `/presence` `/leaderboard` `/users` `/friendCodes` `/friendReq` `/friends` `/chats` `/gifts` `/world` (รวม c/ct/m/w) `/tinv` `/rtc` `/class` (muteAll+podium)
- ✅ ตรวจจากภายนอกแล้ว (curl REST): /presence อ่านได้ 200 · /world และ /class อ่าน/เขียนโดยไม่ login โดน 401 Permission denied ถูกต้อง
- ⏳ เหลือ**ทดสอบจริง 2 บัญชี/2 เครื่องบน Pages** (ดู checklist ใน TASKS.md)
- 🔑 ทุกครั้งที่เพิ่มโซนใหม่ → ส่งก้อนเต็มด้านล่างให้ผู้ใช้ publish ใหม่
- ✅ **field `hp` ใน /world (รอบ 376) — publish แล้ว 30 ก.ค. 2026 (ตรวจสดยืนยัน มีใน `/world/$map/$uid/hp` จริง):** ตำแหน่งลำแดงที่จอดทิ้งไว้ "x,z,y,yaw" ≤28 ตัว → เพื่อนเห็นลำจอดในเมืองเฮลิฯได้แล้ว

## ก้อนเต็ม (ครอบ 0.1+0.2+0.3+0.4+0.5 + โลก 3D)

```json
{
  "rules": {
    "presence": {
      ".read": true,
      "$uid": {
        ".write": "auth != null && auth.uid === $uid",
        ".validate": "newData.hasChildren(['n','g','act','at'])",
        "n":   { ".validate": "newData.isString() && newData.val().length >= 1 && newData.val().length <= 40" },
        "g":   { ".validate": "newData.isString() && newData.val().length <= 20" },
        "act": { ".validate": "newData.isString() && newData.val().length <= 60" },
        "at":  { ".validate": "newData.isNumber()" },
        "$other": { ".validate": false }
      }
    },
    "leaderboard": {
      ".read": true,
      ".indexOn": ["coins", "bb", "oe"],
      "$uid": {
        ".write": "auth != null && auth.uid === $uid",
        ".validate": "newData.hasChildren(['n','g','coins','at'])",
        "n":     { ".validate": "newData.isString() && newData.val().length >= 1 && newData.val().length <= 40" },
        "g":     { ".validate": "newData.isString() && newData.val().length <= 20" },
        "coins": { ".validate": "newData.isNumber() && newData.val() >= 0" },
        "av":    { ".validate": "newData.isNumber() && newData.val() >= 0" },
        "ni":    { ".validate": "newData.isNumber() && newData.val() >= 0" },
        "bk":    { ".validate": "newData.isNumber() && newData.val() >= 0" },
        "ba":    { ".validate": "newData.isString() && newData.val().length <= 8" },
        "hs":    { ".validate": "newData.isNumber() && newData.val() >= 0" },
        "ws":    { ".validate": "newData.isNumber() && newData.val() >= 0" },
        "tp":    { ".validate": "newData.isNumber() && newData.val() >= 0" },
        "tw":    { ".validate": "newData.isNumber() && newData.val() >= 0" },
        "sg":    { ".validate": "newData.isNumber() && newData.val() >= 0" },
        "pm":    { ".validate": "newData.isNumber() && newData.val() >= 0" },
        "bb":    { ".validate": "newData.isNumber() && newData.val() >= 0" },
        "oe":    { ".validate": "newData.isNumber() && newData.val() >= 0" },
        "at":    { ".validate": "newData.isNumber()" },
        "$other": { ".validate": false }
      }
    },
    "friendCodes": {
      "$code": {
        ".read": true,
        ".write": "auth != null && (newData.val() === auth.uid || (!newData.exists() && data.val() === auth.uid))",
        ".validate": "newData.isString()"
      }
    },
    "friendReq": {
      "$toUid": {
        ".read": "auth != null && auth.uid === $toUid",
        "$fromUid": {
          ".write": "auth != null && (auth.uid === $fromUid || auth.uid === $toUid)",
          ".validate": "newData.hasChildren(['n','g','ts'])",
          "n":  { ".validate": "newData.isString() && newData.val().length <= 40" },
          "g":  { ".validate": "newData.isString() && newData.val().length <= 20" },
          "ts": { ".validate": "newData.isNumber()" },
          "$other": { ".validate": false }
        }
      }
    },
    "friends": {
      "$uid": {
        ".read": "auth != null && auth.uid === $uid",
        "$friendUid": {
          ".write": "auth != null && (auth.uid === $uid || auth.uid === $friendUid)",
          ".validate": "newData.hasChildren(['n','g','ts'])",
          "n":  { ".validate": "newData.isString() && newData.val().length <= 40" },
          "g":  { ".validate": "newData.isString() && newData.val().length <= 20" },
          "ts": { ".validate": "newData.isNumber()" },
          "$other": { ".validate": false }
        }
      }
    },
    "chats": {
      "$pairId": {
        ".read":  "auth != null && $pairId.contains(auth.uid)",
        ".write": "auth != null && $pairId.contains(auth.uid)",
        "$msgId": {
          ".validate": "newData.hasChildren(['f','t','ts'])",
          "f":  { ".validate": "newData.isString() && newData.val() === auth.uid" },
          "t":  { ".validate": "newData.isString() && newData.val().length >= 1 && newData.val().length <= 200" },
          "ts": { ".validate": "newData.isNumber()" },
          "$other": { ".validate": false }
        }
      }
    },
    "typing": {
      "$pairId": {
        ".read": "auth != null && $pairId.contains(auth.uid)",
        ".write": "auth != null && $pairId.contains(auth.uid) && !newData.exists()",
        "$uid": {
          ".write": "auth != null && auth.uid === $uid && $pairId.contains(auth.uid)",
          ".validate": "newData.isNumber()"
        }
      }
    },
    "chattheme": {
      "$pairId": {
        ".read":  "auth != null && $pairId.contains(auth.uid)",
        ".write": "auth != null && $pairId.contains(auth.uid)",
        ".validate": "newData.isString() && newData.val().length <= 16"
      }
    },
    "gifts": {
      "$toUid": {
        ".read": "auth != null && auth.uid === $toUid",
        "$fromUid": {
          ".read":  "auth != null && auth.uid === $fromUid",
          ".write": "auth != null && (auth.uid === $fromUid || auth.uid === $toUid)",
          "$giftKey": {
            ".validate": "newData.hasChildren(['k','id','fn','ts','st'])",
            "k":  { ".validate": "newData.isString() && (newData.val() === 'shop' || newData.val() === 'collect' || newData.val() === 'greet')" },
            "id": { ".validate": "newData.isString() && newData.val().length <= 40" },
            "fn": { ".validate": "newData.isString() && newData.val().length >= 1 && newData.val().length <= 40" },
            "ts": { ".validate": "newData.isNumber()" },
            "st": { ".validate": "newData.isString() && (newData.val() === 'pending' || newData.val() === 'accepted' || newData.val() === 'declined')" },
            "$other": { ".validate": false }
          }
        }
      }
    },
    "users": {
      "$uid": {
        ".read": "auth != null && auth.uid === $uid",
        ".write": "auth != null && auth.uid === $uid",
        "save": {
          "data": { ".validate": "newData.isString()" },
          "at":   { ".validate": "newData.isNumber()" }
        },
        "profile": {
          "name": { ".validate": "newData.isString() && newData.val().length >= 2 && newData.val().length <= 20 && ((!newData.val().matches(/^\\s*[Aa][Dd][Mm][Ii][Nn]\\s*$/) && !newData.val().matches(/^\\s*แอดมิน\\s*$/)) || auth.token.email === 'freddommun@gmail.com' || auth.token.email === 'sumpajitshami@gmail.com' || auth.token.email === 'parkerhulk2020@gmail.com')" }
        }
      }
    },
    "pphoto": {
      "$uid": {
        ".read": "auth != null",
        ".write": "auth != null && auth.uid === $uid",
        ".validate": "newData.isString() && newData.val().length <= 30000 && newData.val().beginsWith('data:image/jpeg;base64,')"
      }
    },
    "world": {
      "$map": {
        ".read": "auth != null && ($map !== 'sky' || auth.token.email === 'freddommun@gmail.com' || auth.token.email === 'sumpajitshami@gmail.com' || auth.token.email === 'parkerhulk2020@gmail.com')",
        ".validate": "$map === 'adv' || $map === 'sky' || $map === 'haunt' || $map === 'heli' || $map === 'drone' || $map === 'drive' || $map === 'moto' || $map === 'invasion' || $map === 'lettercannon'",
        "$uid": {
          ".write": "auth != null && auth.uid === $uid && ($map !== 'sky' || auth.token.email === 'freddommun@gmail.com' || auth.token.email === 'sumpajitshami@gmail.com' || auth.token.email === 'parkerhulk2020@gmail.com')",
          ".validate": "newData.hasChildren(['n','x','z','yaw','ts'])",
          "n":   { ".validate": "newData.isString() && newData.val().length >= 1 && newData.val().length <= 40" },
          "av":  { ".validate": "newData.isString() && newData.val().length <= 8" },
          "x":   { ".validate": "newData.isNumber()" },
          "z":   { ".validate": "newData.isNumber()" },
          "y":   { ".validate": "newData.isNumber()" },
          "yaw": { ".validate": "newData.isNumber()" },
          "ts":  { ".validate": "newData.isNumber()" },
          "c":   { ".validate": "newData.isString() && newData.val().length >= 1 && newData.val().length <= 60" },
          "ct":  { ".validate": "newData.isNumber()" },
          "m":   { ".validate": "newData.isNumber()" },
          "w":   { ".validate": "newData.isNumber() && newData.val() >= 0" },
          "cw":  { ".validate": "newData.isString() && newData.val().length <= 60" },
          "tl":  { ".validate": "newData.isNumber() && newData.val() >= 0 && newData.val() <= 2" },
          "hp":  { ".validate": "newData.isString() && newData.val().length <= 28" },
          "$other": { ".validate": false }
        }
      }
    },
    "wroom": {
      "$map": {
        ".read": "auth != null && ($map !== 'sky' || auth.token.email === 'freddommun@gmail.com' || auth.token.email === 'sumpajitshami@gmail.com' || auth.token.email === 'parkerhulk2020@gmail.com')",
        ".validate": "$map === 'adv' || $map === 'sky' || $map === 'haunt' || $map === 'heli' || $map === 'drone' || $map === 'drive' || $map === 'moto' || $map === 'invasion' || $map === 'soccer' || $map === 'mecha' || $map === 'f1' || $map === 'lettercannon'",
        "$room": {
          ".validate": "$room.matches(/^r([0-9]|[1-2][0-9]|3[0-5])$/)",
          "$uid": {
            ".write": "auth != null && auth.uid === $uid && ($map !== 'sky' || auth.token.email === 'freddommun@gmail.com' || auth.token.email === 'sumpajitshami@gmail.com' || auth.token.email === 'parkerhulk2020@gmail.com')",
            ".validate": "newData.hasChildren(['x','z'])",
            "x":  { ".validate": "newData.isNumber()" },
            "z":  { ".validate": "newData.isNumber()" },
            "y":  { ".validate": "newData.isNumber()" },
            "r":  { ".validate": "newData.isNumber()" },
            "a":  { ".validate": "newData.isString() && newData.val().length <= 12" },
            "m":  { ".validate": "newData.isNumber() && newData.val() >= 0 && newData.val() <= 1" },
            "l":  { ".validate": "newData.isNumber() && newData.val() >= 0 && newData.val() <= 2" },
            "ts": { ".validate": "newData.isNumber()" },
            "$other": { ".validate": false }
          }
        }
      }
    },
    "winfo": {
      "$map": {
        ".read": "auth != null && ($map !== 'sky' || auth.token.email === 'freddommun@gmail.com' || auth.token.email === 'sumpajitshami@gmail.com' || auth.token.email === 'parkerhulk2020@gmail.com')",
        ".validate": "$map === 'adv' || $map === 'sky' || $map === 'haunt' || $map === 'heli' || $map === 'drone' || $map === 'drive' || $map === 'moto' || $map === 'invasion' || $map === 'soccer' || $map === 'mecha' || $map === 'f1' || $map === 'lettercannon'",
        "$room": {
          ".validate": "$room.matches(/^r([0-9]|[1-2][0-9]|3[0-5])$/)",
          "$uid": {
            ".write": "auth != null && auth.uid === $uid && ($map !== 'sky' || auth.token.email === 'freddommun@gmail.com' || auth.token.email === 'sumpajitshami@gmail.com' || auth.token.email === 'parkerhulk2020@gmail.com')",
            ".validate": "newData.hasChildren(['t'])",
            "n":  { ".validate": "newData.isString() && newData.val().length >= 1 && newData.val().length <= 40" },
            "w":  { ".validate": "newData.isNumber() && newData.val() >= 0" },
            "c":  { ".validate": "newData.isString() && newData.val().length >= 1 && newData.val().length <= 60" },
            "k":  { ".validate": "newData.isNumber()" },
            "q":  { ".validate": "newData.isString() && newData.val().length <= 60" },
            "h":  { ".validate": "newData.isString() && newData.val().length <= 28" },
            "j":  { ".validate": "newData.isNumber()" },
            "t":  { ".validate": "newData.isNumber()" },
            "$other": { ".validate": false }
          }
        }
      }
    },
    "hauntedHotel": {
      "$room": {
        ".read": "auth != null",
        ".write": "auth != null",
        ".validate": "$room.matches(/^r([0-9]|[1-2][0-9]|3[0-5])$/)",
        "run": {
          ".validate": "newData.hasChildren(['runId','seed','placementVersion','phase','wordIndex','ordinalMask','cabinetLetterSlot','roomVisits','completedAt','revision','wordSet','startedAt','updatedAt'])",
          "runId": { ".validate": "newData.isString() && newData.val().length >= 8 && newData.val().length <= 64" },
          "seed": { ".validate": "newData.isNumber() && newData.val() >= 1 && newData.val() <= 4294967295" },
          "placementVersion": { ".validate": "newData.isNumber() && newData.val() >= 1 && newData.val() <= 16" },
          "phase": { ".validate": "newData.isString() && (newData.val() === 'ENTER' || newData.val() === 'ACTIVE_WORD' || newData.val() === 'TEMP_BLACKOUT' || newData.val() === 'RESTORE' || newData.val() === 'PERMANENT_DARK' || newData.val() === 'COMPLETE' || newData.val() === 'RETURN')" },
          "wordIndex": { ".validate": "newData.isNumber() && newData.val() >= 0 && newData.val() <= 4" },
          "ordinalMask": { ".validate": "newData.isNumber() && newData.val() >= 0 && newData.val() <= 511" },
          "cabinetLetterSlot": { ".validate": "newData.isNumber() && newData.val() >= 0 && newData.val() <= 4" },
          "roomVisits": { ".validate": "newData.isString() && newData.val().length <= 511 && (newData.val() === '' || newData.val().matches(/^F[1-5]_ROOM_[0-9]{3}(,F[1-5]_ROOM_[0-9]{3}){0,31}$/))" },
          "completedAt": { ".validate": "newData.isNumber() && newData.val() >= 0" },
          "revision": { ".validate": "newData.isNumber() && newData.val() >= 0" },
          "wordSet": { ".validate": "newData.isString() && newData.val().length >= 20 && newData.val().length <= 400" },
          "startedAt": { ".validate": "newData.isNumber() && newData.val() <= now + 60000" },
          "updatedAt": { ".validate": "newData.isNumber() && newData.val() <= now + 60000" },
          "$other": { ".validate": false }
        },
        "scare": {
          ".validate": "newData.hasChildren(['eventId','type','target','eventSeed','createdAt'])",
          "eventId": { ".validate": "newData.isString() && newData.val().length >= 8 && newData.val().length <= 64" },
          "type": { ".validate": "newData.isString() && (newData.val() === 'majorCorridor' || newData.val() === 'groupKnock' || newData.val() === 'finalPresence')" },
          "target": { ".validate": "newData.isString() && newData.val().length >= 1 && newData.val().length <= 800" },
          "eventSeed": { ".validate": "newData.isNumber() && newData.val() >= 1 && newData.val() <= 4294967295" },
          "createdAt": { ".validate": "newData.isNumber() && newData.val() <= now + 60000" },
          "$other": { ".validate": false }
        },
        "$other": { ".validate": false }
      }
    },
    "tinv": {
      "$toUid": {
        ".read": "auth != null && auth.uid === $toUid",
        "$fromUid": {
          ".write": "auth != null && (auth.uid === $fromUid || auth.uid === $toUid) && (!newData.exists() || ((data.child('map').val() !== 'sky' && newData.child('map').val() !== 'sky') || auth.token.email === 'freddommun@gmail.com' || auth.token.email === 'sumpajitshami@gmail.com' || auth.token.email === 'parkerhulk2020@gmail.com'))",
          ".validate": "newData.hasChildren(['map','n','ts']) && (newData.child('map').val() !== 'sky' || auth.token.email === 'freddommun@gmail.com' || auth.token.email === 'sumpajitshami@gmail.com' || auth.token.email === 'parkerhulk2020@gmail.com')",
          "map": { ".validate": "newData.isString() && (newData.val() === 'adv' || newData.val() === 'sky' || newData.val() === 'haunt' || newData.val() === 'heli' || newData.val() === 'drone' || newData.val() === 'drive')" },
          "n":   { ".validate": "newData.isString() && newData.val().length >= 1 && newData.val().length <= 40" },
          "ts":  { ".validate": "newData.isNumber()" },
          "$other": { ".validate": false }
        }
      }
    },
    "rtc": {
      "$map": {
        "$toUid": {
          ".read": "auth != null && auth.uid === $toUid",
          ".write": "auth != null && auth.uid === $toUid",
          "$msgId": {
            ".write": "auth != null && (newData.child('f').val() === auth.uid || (!newData.exists() && data.child('f').val() === auth.uid))",
            ".validate": "($map === 'adv' || $map === 'haunt' || $map === 'heli' || $map === 'drone' || $map === 'drive' || $map === 'chat') && newData.hasChildren(['f','t','d','ts'])",
            "f":  { ".validate": "newData.isString() && newData.val().length <= 128" },
            "t":  { ".validate": "newData.isString() && (newData.val() === 'offer' || newData.val() === 'answer' || newData.val() === 'ice')" },
            "d":  { ".validate": "newData.isString() && newData.val().length <= 20000" },
            "ts": { ".validate": "newData.isNumber()" },
            "$other": { ".validate": false }
          }
        }
      }
    },
    "calls": {
      "$toUid": {
        ".read": "auth != null && auth.uid === $toUid",
        ".write": "auth != null && auth.uid === $toUid",
        "$fromUid": {
          ".write": "auth != null && (auth.uid === $fromUid || auth.uid === $toUid)",
          ".validate": "newData.hasChildren(['k','ts'])",
          "k":  { ".validate": "newData.isString() && (newData.val() === 'ring' || newData.val() === 'ok' || newData.val() === 'no' || newData.val() === 'busy' || newData.val() === 'end' || newData.val() === 'nofr' || newData.val() === 'full')" },
          "n":  { ".validate": "newData.isString() && newData.val().length >= 1 && newData.val().length <= 40" },
          "m":  { ".validate": "newData.isString() && (newData.val() === 'voice' || newData.val() === 'video')" },
          "r":  { ".validate": "newData.isString() && newData.val().length <= 128" },
          "g":  { ".validate": "newData.isString() && newData.val().length <= 400" },
          "ts": { ".validate": "newData.isNumber()" },
          "$other": { ".validate": false }
        }
      }
    },
    "market": {
      ".read": "auth != null",
      "$key": {
        ".write": "auth != null && ((!data.exists() && newData.child('sid').val() === auth.uid) || (data.exists() && data.child('sid').val() === auth.uid && data.child('st').val() !== 'processing' && !newData.exists()))",
        ".validate": "newData.hasChildren(['sid','sn','id','p','ts'])",
        "sid": { ".validate": "newData.isString() && newData.val().length <= 128" },
        "sn":  { ".validate": "newData.isString() && newData.val().length >= 1 && newData.val().length <= 40" },
        "id":  { ".validate": "newData.isString() && newData.val().length <= 40" },
        "p":   { ".validate": "newData.isNumber() && newData.val() >= 1 && newData.val() <= 1000000" },
        "ts":  { ".validate": "newData.isNumber()" },
        "$other": { ".validate": false }
      }
    },
    "msold": {
      "$uid": {
        ".read": "auth != null && auth.uid === $uid",
        "$key": {
          ".write": "auth != null && auth.uid === $uid && data.exists() && !newData.exists()",
          ".validate": "newData.hasChildren(['id','p','bn','ts'])",
          "id": { ".validate": "newData.isString() && newData.val().length <= 40" },
          "p":  { ".validate": "newData.isNumber() && newData.val() >= 1" },
          "bn": { ".validate": "newData.isString() && newData.val().length >= 1 && newData.val().length <= 40" },
          "ts": { ".validate": "newData.isNumber()" },
          "$other": { ".validate": false }
        }
      }
    },
    "marketLedger": {
      ".read": false,
      ".write": false
    },
    "feed": {
      "$uid": {
        ".read": "auth != null",
        ".write": "auth != null && auth.uid === $uid",
        "p": {
          "$postId": {
            ".validate": "newData.hasChildren(['c','tx','ts'])",
            "c":  { ".validate": "newData.isString() && newData.val().length >= 1 && newData.val().length <= 12" },
            "tx": { ".validate": "newData.isString() && newData.val().length >= 1 && newData.val().length <= 120" },
            "ts": { ".validate": "newData.isNumber()" },
            "$other": { ".validate": false }
          }
        },
        "a": { ".validate": "newData.isString() && newData.val().length <= 4000" },
        "pt": { ".validate": "newData.isString() && newData.val().length <= 2000" },
        "$other": { ".validate": false }
      }
    },
    "gfeed": {
      ".read": "auth != null",
      ".indexOn": "u",
      "$postId": {
        ".write": "auth != null && ((!data.exists() && newData.child('u').val() === auth.uid) || (data.exists() && !newData.exists() && data.child('u').val() === auth.uid))",
        ".validate": "newData.hasChildren(['u','n','c','tx','ts'])",
        "u":  { ".validate": "newData.isString() && newData.val().length <= 128" },
        "n":  { ".validate": "newData.isString() && newData.val().length >= 1 && newData.val().length <= 40" },
        "g":  { ".validate": "newData.isString() && newData.val().length <= 20" },
        "c":  { ".validate": "newData.isString() && newData.val().length >= 1 && newData.val().length <= 12" },
        "tx": { ".validate": "newData.isString() && newData.val().length >= 1 && newData.val().length <= 120" },
        "ts": { ".validate": "newData.isNumber()" },
        "lk": {
          "$uid": {
            ".write": "auth != null && auth.uid === $uid && (!newData.exists() || root.child('gfeed').child($postId).child('u').val() === auth.uid || root.child('friends').child(root.child('gfeed').child($postId).child('u').val()).child(auth.uid).exists())",
            ".validate": "(newData.isBoolean() && newData.val() === true) || (newData.isString() && newData.val().length >= 1 && newData.val().length <= 8)"
          }
        },
        "cm": {
          "$cid": {
            ".write": "auth != null && ((!data.exists() && newData.child('u').val() === auth.uid && (root.child('gfeed').child($postId).child('u').val() === auth.uid || root.child('friends').child(root.child('gfeed').child($postId).child('u').val()).child(auth.uid).exists())) || (data.exists() && !newData.exists() && data.child('u').val() === auth.uid))",
            ".validate": "newData.hasChildren(['u','n','tx','ts'])",
            "u":  { ".validate": "newData.isString() && newData.val().length <= 128" },
            "n":  { ".validate": "newData.isString() && newData.val().length >= 1 && newData.val().length <= 40" },
            "tx": { ".validate": "newData.isString() && newData.val().length >= 1 && newData.val().length <= 120" },
            "ts": { ".validate": "newData.isNumber()" },
            "p":  { ".validate": "newData.isString() && newData.val().length >= 1 && newData.val().length <= 40 && root.child('gfeed').child($postId).child('cm').child(newData.val()).exists()" },
            "cl": {
              "$uid": {
                ".write": "auth != null && auth.uid === $uid && (!newData.exists() || root.child('gfeed').child($postId).child('u').val() === auth.uid || root.child('friends').child(root.child('gfeed').child($postId).child('u').val()).child(auth.uid).exists())",
                ".validate": "newData.isBoolean() && newData.val() === true"
              }
            },
            "$other": { ".validate": false }
          }
        },
        "$other": { ".validate": false }
      }
    },
    "gnotif": {
      "$uid": {
        ".read": "auth != null && auth.uid === $uid",
        "seen": {
          ".write": "auth != null && auth.uid === $uid",
          ".validate": "newData.isString() && newData.val().length <= 40"
        },
        "n": {
          ".read": "auth != null && (auth.uid === $uid || (query.orderByChild === 'u' && query.equalTo === auth.uid))",
          ".indexOn": "u",
          "$nid": {
            ".write": "auth != null && (auth.uid === $uid || (data.exists() && !newData.exists() && data.child('u').val() === auth.uid) || (!data.exists() && newData.child('u').val() === auth.uid && ((newData.hasChild('pid') && (root.child('gfeed').child(newData.child('pid').val()).child('u').val() === auth.uid || root.child('friends').child(root.child('gfeed').child(newData.child('pid').val()).child('u').val()).child(auth.uid).exists())) || ((newData.child('t').val() === 'gf' || newData.child('t').val() === 'gr') && root.child('gifts').child($uid).child(auth.uid).exists()) || (newData.child('t').val() === 'fr' && root.child('friendReq').child($uid).child(auth.uid).exists()))))",
            ".validate": "newData.hasChildren(['t','u','n','ts']) && (newData.hasChild('pid') || newData.child('t').val() === 'gf' || newData.child('t').val() === 'gr' || newData.child('t').val() === 'fr')",
            "t":   { ".validate": "newData.isString() && (newData.val() === 'rx' || newData.val() === 'cm' || newData.val() === 'rp' || newData.val() === 'cl' || newData.val() === 'gf' || newData.val() === 'gr' || newData.val() === 'fr')" },
            "pid": { ".validate": "newData.isString() && newData.val().length >= 1 && newData.val().length <= 40" },
            "cid": { ".validate": "newData.isString() && newData.val().length >= 1 && newData.val().length <= 40" },
            "u":   { ".validate": "newData.isString() && newData.val().length <= 128" },
            "n":   { ".validate": "newData.isString() && newData.val().length >= 1 && newData.val().length <= 40" },
            "r":   { ".validate": "newData.isString() && newData.val().length <= 8" },
            "cm":  { ".validate": "newData.isString() && newData.val().length <= 120" },
            "tx":  { ".validate": "newData.isString() && newData.val().length <= 120" },
            "ts":  { ".validate": "newData.isNumber()" },
            "$other": { ".validate": false }
          }
        },
        "$other": { ".validate": false }
      }
    },
    "follow": {
      "$uid": {
        ".read": "auth != null",
        "$followerUid": {
          ".write": "auth != null && auth.uid === $followerUid",
          ".validate": "newData.hasChildren(['n','ts'])",
          "n":  { ".validate": "newData.isString() && newData.val().length >= 1 && newData.val().length <= 40" },
          "ts": { ".validate": "newData.isNumber()" },
          "$other": { ".validate": false }
        }
      }
    },
    "sales": {
      ".read": true,
      "$id": {
        ".write": "auth != null && newData.isNumber() && ((!data.exists() && newData.val() === 1) || (data.exists() && newData.val() === data.val() + 1))",
        ".validate": "newData.isNumber() && newData.val() >= 0"
      }
    },
    "ads": {
      ".read": true,
      "$n": {
        ".write": "auth != null && ($n === '1' || $n === '2' || $n === '3' || $n === '4' || $n === '5' || $n === '6' || $n === '7' || $n === '8' || $n === '9' || $n === '10') && (!data.exists() || data.child('ts').val() < now - 604800000 || data.child('uid').val() === auth.uid)",
        ".validate": "newData.hasChildren(['uid','n','ts'])",
        "uid": { ".validate": "newData.isString() && newData.val() === auth.uid" },
        "n":   { ".validate": "newData.isString() && newData.val().length >= 1 && newData.val().length <= 40" },
        "ts":  { ".validate": "newData.isNumber() && newData.val() <= now + 60000" },
        "$other": { ".validate": false }
      }
    },
    "wsAward": {
      ".read": true,
      "$m": {
        ".write": "auth != null && !data.exists()",
        ".validate": "$m.matches(/^[0-9]{4}-[0-9]{2}$/) && newData.hasChildren(['at','w'])",
        "at": { ".validate": "newData.isNumber() && newData.val() <= now + 60000" },
        "w": {
          "$uid": {
            ".write": "auth != null && auth.uid === $uid && !newData.exists()",
            ".validate": "newData.hasChildren(['r','p','n'])",
            "r": { ".validate": "newData.isNumber() && newData.val() >= 1 && newData.val() <= 10" },
            "p": { ".validate": "newData.isNumber() && newData.val() >= 0 && newData.val() <= 10000" },
            "n": { ".validate": "newData.isString() && newData.val().length >= 1 && newData.val().length <= 40" },
            "g": { ".validate": "newData.isString() && newData.val().length <= 20" },
            "s": { ".validate": "newData.isNumber() && newData.val() >= 0" },
            "$other": { ".validate": false }
          }
        },
        "$other": { ".validate": false }
      }
    },
    "tpAward": {
      ".read": true,
      "$m": {
        ".write": "auth != null && !data.exists()",
        ".validate": "$m.matches(/^[0-9]{4}-[0-9]{2}$/) && newData.hasChildren(['at','w'])",
        "at": { ".validate": "newData.isNumber() && newData.val() <= now + 60000" },
        "w": {
          "$uid": {
            ".write": "auth != null && auth.uid === $uid && !newData.exists()",
            ".validate": "newData.hasChildren(['r','p','n'])",
            "r": { ".validate": "newData.isNumber() && newData.val() >= 1 && newData.val() <= 10" },
            "p": { ".validate": "newData.isNumber() && newData.val() >= 0 && newData.val() <= 10000" },
            "n": { ".validate": "newData.isString() && newData.val().length >= 1 && newData.val().length <= 40" },
            "g": { ".validate": "newData.isString() && newData.val().length <= 20" },
            "s": { ".validate": "newData.isNumber() && newData.val() >= 0" },
            "s2": { ".validate": "newData.isNumber() && newData.val() >= 0" },
            "$other": { ".validate": false }
          }
        },
        "$other": { ".validate": false }
      }
    },
    "sgAward": {
      ".read": true,
      "$m": {
        ".write": "auth != null && !data.exists()",
        ".validate": "$m.matches(/^[0-9]{4}-[0-9]{2}$/) && newData.hasChildren(['at','w'])",
        "at": { ".validate": "newData.isNumber() && newData.val() <= now + 60000" },
        "w": {
          "$uid": {
            ".write": "auth != null && auth.uid === $uid && !newData.exists()",
            ".validate": "newData.hasChildren(['r','p','n'])",
            "r": { ".validate": "newData.isNumber() && newData.val() >= 1 && newData.val() <= 10" },
            "p": { ".validate": "newData.isNumber() && newData.val() >= 0 && newData.val() <= 10000" },
            "n": { ".validate": "newData.isString() && newData.val().length >= 1 && newData.val().length <= 40" },
            "g": { ".validate": "newData.isString() && newData.val().length <= 20" },
            "s": { ".validate": "newData.isNumber() && newData.val() >= 0" },
            "$other": { ".validate": false }
          }
        },
        "$other": { ".validate": false }
      }
    },
    "pmAward": {
      ".read": true,
      "$m": {
        ".write": "auth != null && !data.exists()",
        ".validate": "$m.matches(/^[0-9]{4}-[0-9]{2}$/) && newData.hasChildren(['at','w'])",
        "at": { ".validate": "newData.isNumber() && newData.val() <= now + 60000" },
        "w": {
          "$uid": {
            ".write": "auth != null && auth.uid === $uid && !newData.exists()",
            ".validate": "newData.hasChildren(['r','p','n'])",
            "r": { ".validate": "newData.isNumber() && newData.val() >= 1 && newData.val() <= 10" },
            "p": { ".validate": "newData.isNumber() && newData.val() >= 0 && newData.val() <= 10000" },
            "n": { ".validate": "newData.isString() && newData.val().length >= 1 && newData.val().length <= 40" },
            "g": { ".validate": "newData.isString() && newData.val().length <= 20" },
            "s": { ".validate": "newData.isNumber() && newData.val() >= 0" },
            "$other": { ".validate": false }
          }
        },
        "$other": { ".validate": false }
      }
    },
    "bbAward": {
      ".read": true,
      "$m": {
        ".write": "auth != null && !data.exists()",
        ".validate": "$m.matches(/^[0-9]{4}-[0-9]{2}$/) && newData.hasChildren(['at','w'])",
        "at": { ".validate": "newData.isNumber() && newData.val() <= now + 60000" },
        "w": {
          "$uid": {
            ".write": "auth != null && auth.uid === $uid && !newData.exists()",
            ".validate": "newData.hasChildren(['r','p','n'])",
            "r": { ".validate": "newData.isNumber() && newData.val() >= 1 && newData.val() <= 10" },
            "p": { ".validate": "newData.isNumber() && newData.val() >= 0 && newData.val() <= 10000" },
            "n": { ".validate": "newData.isString() && newData.val().length >= 1 && newData.val().length <= 40" },
            "g": { ".validate": "newData.isString() && newData.val().length <= 20" },
            "s": { ".validate": "newData.isNumber() && newData.val() >= 0" },
            "$other": { ".validate": false }
          }
        },
        "$other": { ".validate": false }
      }
    },
    "coinAward": {
      ".read": true,
      "$m": {
        ".write": "auth != null && !data.exists()",
        ".validate": "$m.matches(/^[0-9]{4}-[0-9]{2}$/) && newData.hasChildren(['at','w'])",
        "at": { ".validate": "newData.isNumber() && newData.val() <= now + 60000" },
        "w": {
          "$uid": {
            ".write": "auth != null && auth.uid === $uid && !newData.exists()",
            ".validate": "newData.hasChildren(['r','p','n','g','s'])",
            "r": { ".validate": "newData.isNumber() && newData.val() >= 1 && newData.val() <= 10" },
            "p": { ".validate": "newData.isNumber() && newData.val() >= 0 && newData.val() <= 10000" },
            "n": { ".validate": "newData.isString() && newData.val().length >= 1 && newData.val().length <= 40" },
            "g": { ".validate": "newData.isString() && newData.val().length <= 20" },
            "s": { ".validate": "newData.isNumber() && newData.val() >= 0" },
            "$other": { ".validate": false }
          }
        },
        "$other": { ".validate": false }
      }
    },
    "assetAward": {
      ".read": true,
      "$m": {
        ".write": "auth != null && !data.exists()",
        ".validate": "$m.matches(/^[0-9]{4}-[0-9]{2}$/) && newData.hasChildren(['at','w'])",
        "at": { ".validate": "newData.isNumber() && newData.val() <= now + 60000" },
        "w": {
          "$uid": {
            ".write": "auth != null && auth.uid === $uid && !newData.exists()",
            ".validate": "newData.hasChildren(['r','p','n','g','s'])",
            "r": { ".validate": "newData.isNumber() && newData.val() >= 1 && newData.val() <= 10" },
            "p": { ".validate": "newData.isNumber() && newData.val() >= 0 && newData.val() <= 10000" },
            "n": { ".validate": "newData.isString() && newData.val().length >= 1 && newData.val().length <= 40" },
            "g": { ".validate": "newData.isString() && newData.val().length <= 20" },
            "s": { ".validate": "newData.isNumber() && newData.val() >= 0" },
            "$other": { ".validate": false }
          }
        },
        "$other": { ".validate": false }
      }
    },
    "onlineCoinAward": {
      ".read": true,
      "$m": {
        ".write": "auth != null && !data.exists()",
        ".validate": "$m.matches(/^[0-9]{4}-[0-9]{2}$/) && newData.hasChildren(['at','w'])",
        "at": { ".validate": "newData.isNumber() && newData.val() <= now + 60000" },
        "w": {
          "$uid": {
            ".write": "auth != null && auth.uid === $uid && !newData.exists()",
            ".validate": "newData.hasChildren(['r','p','n','g','s'])",
            "r": { ".validate": "newData.isNumber() && newData.val() >= 1 && newData.val() <= 10" },
            "p": { ".validate": "newData.isNumber() && newData.val() >= 0 && newData.val() <= 10000" },
            "n": { ".validate": "newData.isString() && newData.val().length >= 1 && newData.val().length <= 40" },
            "g": { ".validate": "newData.isString() && newData.val().length <= 20" },
            "s": { ".validate": "newData.isNumber() && newData.val() >= 0" },
            "$other": { ".validate": false }
          }
        },
        "$other": { ".validate": false }
      }
    },
    "examRank": {
      "$setId": {
        ".read": "auth != null",
        ".indexOn": "sc",
        "$uid": {
          ".write": "auth != null && auth.uid === $uid && $setId.matches(/^[a-z]+_[0-9]{1,2}$/)",
          ".validate": "newData.hasChildren(['sc','tt','sec','n','ts']) && newData.child('sc').val() <= newData.child('tt').val() && newData.child('sc').val() * 10 >= newData.child('tt').val() * 7",
          "sc":  { ".validate": "newData.isNumber() && newData.val() >= 0 && newData.val() <= 200" },
          "tt":  { ".validate": "newData.isNumber() && newData.val() >= 1 && newData.val() <= 200" },
          "sec": { ".validate": "newData.isNumber() && newData.val() >= 0 && newData.val() <= 86400" },
          "n":   { ".validate": "newData.isString() && newData.val().length >= 1 && newData.val().length <= 40" },
          "g":   { ".validate": "newData.isString() && newData.val().length <= 20" },
          "ts":  { ".validate": "newData.isNumber() && newData.val() <= now + 60000" },
          "$other": { ".validate": false }
        }
      }
    },
    "bandRank": {
      "$setId": {
        ".read": "auth != null",
        ".indexOn": "sc",
        "$uid": {
          ".write": "auth != null && auth.uid === $uid && $setId.matches(/^[a-z]+_(found|inter|expert)$/)",
          ".validate": "newData.hasChildren(['sc','tt','sec','n','ts']) && newData.child('sc').val() <= newData.child('tt').val() && newData.child('sc').val() * 10 >= newData.child('tt').val() * 8",
          "sc":  { ".validate": "newData.isNumber() && newData.val() >= 0 && newData.val() <= 50" },
          "tt":  { ".validate": "newData.isNumber() && newData.val() >= 1 && newData.val() <= 50" },
          "sec": { ".validate": "newData.isNumber() && newData.val() >= 0 && newData.val() <= 86400" },
          "n":   { ".validate": "newData.isString() && newData.val().length >= 1 && newData.val().length <= 40" },
          "g":   { ".validate": "newData.isString() && newData.val().length <= 20" },
          "ts":  { ".validate": "newData.isNumber() && newData.val() <= now + 60000" },
          "$other": { ".validate": false }
        }
      }
    },
    "f1Rank": {
      ".read": "auth != null",
      ".indexOn": "sec",
      "$uid": {
        ".write": "auth != null && auth.uid === $uid",
        ".validate": "newData.hasChildren(['sec','n','ts']) && (!data.exists() || newData.child('sec').val() < data.child('sec').val())",
        "sec": { ".validate": "newData.isNumber() && newData.val() > 0 && newData.val() <= 3600" },
        "n":   { ".validate": "newData.isString() && newData.val().length >= 1 && newData.val().length <= 40" },
        "g":   { ".validate": "newData.isString() && newData.val().length <= 20" },
        "ts":  { ".validate": "newData.isNumber() && newData.val() <= now + 60000" },
        "$other": { ".validate": false }
      }
    },
    "pquizRooms": {
      "$roomId": {
        ".read": "auth != null",
        ".write": "auth != null && ((!data.exists() && newData.child('owner').val() === auth.uid && newData.child('members').child('0').child('u').val() === auth.uid) || (data.exists() && !newData.exists() && data.child('owner').val() === auth.uid))",
        ".validate": "$roomId.matches(/^[A-Z0-9]{6}$/) && newData.hasChildren(['owner','title','status','created','members'])",
        "owner": { ".validate": "newData.isString() && newData.val().length >= 1 && newData.val().length <= 128 && (!data.exists() || newData.val() === data.val())" },
        "title": { ".validate": "newData.isString() && newData.val().length >= 3 && newData.val().length <= 30" },
        "status": {
          ".write": "auth != null && auth.uid === root.child('pquizRooms').child($roomId).child('owner').val()",
          ".validate": "newData.isString() && (newData.val() === 'waiting' || newData.val() === 'playing' || newData.val() === 'finished')"
        },
        "created": { ".validate": "newData.isNumber() && (!data.exists() || newData.val() === data.val())" },
        "members": {
          "$slot": {
            ".write": "auth != null && $slot.matches(/^([0-9]|[1-4][0-9])$/) && ((!data.exists() && newData.child('u').val() === auth.uid && root.child('pquizRooms').child($roomId).child('status').val() !== 'playing') || (data.exists() && data.child('u').val() === auth.uid && (!newData.exists() || newData.child('u').val() === auth.uid)) || (auth.uid === root.child('pquizRooms').child($roomId).child('owner').val() && !newData.exists()))",
            ".validate": "$slot.matches(/^([0-9]|[1-4][0-9])$/) && newData.hasChildren(['u','n','g','at'])",
            "u": { ".validate": "newData.isString() && newData.val().length >= 1 && newData.val().length <= 128 && (!data.exists() || newData.val() === data.val())" },
            "n": { ".validate": "newData.isString() && newData.val().length >= 1 && newData.val().length <= 40" },
            "g": { ".validate": "newData.isString() && newData.val().length <= 20" },
            "at": { ".validate": "newData.isNumber() && newData.val() <= now + 60000" },
            "$other": { ".validate": false }
          }
        },
        "scores": {
          ".write": "auth != null && auth.uid === root.child('pquizRooms').child($roomId).child('owner').val()",
          "$uid": {
            ".write": "auth != null && auth.uid === $uid && !newData.exists()",
            ".validate": "newData.hasChildren(['n','score','ok','wrong'])",
            "n": { ".validate": "newData.isString() && newData.val().length >= 1 && newData.val().length <= 40" },
            "score": { ".validate": "newData.isNumber() && newData.val() >= 0 && newData.val() <= 100000" },
            "ok": { ".validate": "newData.isNumber() && newData.val() >= 0 && newData.val() <= 10" },
            "wrong": { ".validate": "newData.isNumber() && newData.val() >= 0 && newData.val() <= 10" },
            "$other": { ".validate": false }
          }
        },
        "game": {
          ".write": "auth != null && auth.uid === root.child('pquizRooms').child($roomId).child('owner').val()",
          ".validate": "newData.hasChildren(['id','phase','round','total'])",
          "id": { ".validate": "newData.isString() && newData.val().length >= 1 && newData.val().length <= 60" },
          "phase": { ".validate": "newData.isString() && (newData.val() === 'countdown' || newData.val() === 'question' || newData.val() === 'result' || newData.val() === 'finished')" },
          "round": { ".validate": "newData.isNumber() && newData.val() >= 0 && newData.val() <= 10" },
          "total": { ".validate": "newData.isNumber() && newData.val() === 10" },
          "startAt": { ".validate": "newData.isNumber() && newData.val() <= now + 10000" },
          "deadline": { ".validate": "newData.isNumber() && newData.val() <= now + 30000" },
          "endedAt": { ".validate": "newData.isNumber() && newData.val() <= now + 60000" },
          "q": {
            ".validate": "newData.hasChildren(['id','en','th','spread'])",
            "id": { ".validate": "newData.isString() && newData.val().length >= 1 && newData.val().length <= 80" },
            "en": { ".validate": "newData.isString() && newData.val().length >= 1 && newData.val().length <= 40" },
            "th": { ".validate": "newData.isString() && newData.val().length <= 80" },
            "spread": { ".validate": "newData.isNumber() && newData.val() >= 0 && newData.val() <= 60" },
            "$other": { ".validate": false }
          },
          "result": {
            "correct": { ".validate": "newData.isNumber() && newData.val() >= 0 && newData.val() <= 50" },
            "nextAt": { ".validate": "newData.isNumber() && newData.val() <= now + 10000" },
            "fast": {
              ".validate": "newData.hasChildren(['uid','n','pts','ms'])",
              "uid": { ".validate": "newData.isString() && newData.val().length <= 128" },
              "n": { ".validate": "newData.isString() && newData.val().length >= 1 && newData.val().length <= 40" },
              "pts": { ".validate": "newData.isNumber() && newData.val() >= 100 && newData.val() <= 1000" },
              "ms": { ".validate": "newData.isNumber() && newData.val() >= 0 && newData.val() <= 12000" },
              "$other": { ".validate": false }
            },
            "$other": { ".validate": false }
          },
          "top": {
            "$i": {
              ".validate": "newData.hasChildren(['u','n','s'])",
              "u": { ".validate": "newData.isString() && newData.val().length <= 128" },
              "n": { ".validate": "newData.isString() && newData.val().length >= 1 && newData.val().length <= 40" },
              "s": { ".validate": "newData.isNumber() && newData.val() >= 0 && newData.val() <= 100000" },
              "$other": { ".validate": false }
            }
          },
          "$other": { ".validate": false }
        },
        "answers": {
          ".write": "auth != null && auth.uid === root.child('pquizRooms').child($roomId).child('owner').val()",
          "$round": {
            "$uid": {
              ".write": "auth != null && auth.uid === $uid && ((!data.exists() && root.child('pquizRooms').child($roomId).child('members').child(newData.child('s').val()).child('u').val() === auth.uid && root.child('pquizRooms').child($roomId).child('game').child('phase').val() === 'question') || (data.exists() && !newData.exists()))",
              ".validate": "newData.hasChildren(['qid','pick','s','ts']) && newData.child('qid').val() === root.child('pquizRooms').child($roomId).child('game').child('q').child('id').val()",
              "qid": { ".validate": "newData.isString() && newData.val().length >= 1 && newData.val().length <= 80" },
              "pick": { ".validate": "newData.isString() && newData.val().length >= 1 && newData.val().length <= 40" },
              "s": { ".validate": "newData.isString() && newData.val().matches(/^([0-9]|[1-4][0-9])$/)" },
              "ts": { ".validate": "newData.isNumber() && newData.val() <= now + 60000" },
              "$other": { ".validate": false }
            }
          }
        },
        "chat": {
          "$msgId": {
            ".write": "auth != null && ((!data.exists() && newData.child('u').val() === auth.uid && root.child('pquizRooms').child($roomId).child('members').child(newData.child('s').val()).child('u').val() === auth.uid) || (!newData.exists() && (data.child('u').val() === auth.uid || root.child('pquizRooms').child($roomId).child('owner').val() === auth.uid)))",
            ".validate": "newData.hasChildren(['u','s','n','t','ts'])",
            "u": { ".validate": "newData.isString() && newData.val() === auth.uid" },
            "s": { ".validate": "newData.isString() && newData.val().matches(/^([0-9]|[1-4][0-9])$/)" },
            "n": { ".validate": "newData.isString() && newData.val().length >= 1 && newData.val().length <= 40" },
            "t": { ".validate": "newData.isString() && newData.val().length >= 1 && newData.val().length <= 160" },
            "ts": { ".validate": "newData.isNumber() && newData.val() <= now + 60000" },
            "$other": { ".validate": false }
          }
        },
        "voice": {
          ".write": "auth != null && auth.uid === root.child('pquizRooms').child($roomId).child('owner').val()",
          ".validate": "newData.hasChildren(['state','by','n','at'])",
          "state": { ".validate": "newData.isString() && (newData.val() === 'ring' || newData.val() === 'live')" },
          "by": { ".validate": "newData.isString() && newData.val() === root.child('pquizRooms').child($roomId).child('owner').val()" },
          "n": { ".validate": "newData.isString() && newData.val().length >= 1 && newData.val().length <= 40" },
          "at": { ".validate": "newData.isNumber() && newData.val() <= now + 60000" },
          "members": {
            "$slot": {
              ".write": "auth != null && $slot.matches(/^[0-7]$/) && ((!data.exists() && newData.child('u').val() === auth.uid && root.child('pquizRooms').child($roomId).child('members').child(newData.child('rs').val()).child('u').val() === auth.uid) || (data.exists() && data.child('u').val() === auth.uid && (!newData.exists() || newData.child('u').val() === auth.uid)) || (auth.uid === root.child('pquizRooms').child($roomId).child('owner').val() && !newData.exists()))",
              ".validate": "$slot.matches(/^[0-7]$/) && newData.hasChildren(['u','rs','n','at','mic'])",
              "u": { ".validate": "newData.isString() && newData.val() === auth.uid && (!data.exists() || newData.val() === data.val())" },
              "rs": { ".validate": "newData.isString() && newData.val().matches(/^([0-9]|[1-4][0-9])$/)" },
              "n": { ".validate": "newData.isString() && newData.val().length >= 1 && newData.val().length <= 40" },
              "at": { ".validate": "newData.isNumber() && newData.val() <= now + 60000" },
              "mic": { ".validate": "newData.isBoolean()" },
              "$other": { ".validate": false }
            }
          },
          "$other": { ".validate": false }
        },
        "$other": { ".validate": false }
      }
    },
    "pquizRtc": {
      "$roomId": {
        ".validate": "$roomId.matches(/^[A-Z0-9]{6}$/)",
        "$toUid": {
          ".read": "auth != null && auth.uid === $toUid",
          ".write": "auth != null && auth.uid === $toUid && !newData.exists()",
          "$msgId": {
            ".write": "auth != null && $msgId.matches(/^([0-9]|[1-9][0-9]|1[0-9][0-9])$/) && ((!data.exists() && newData.child('f').val() === auth.uid && root.child('pquizRooms').child($roomId).child('members').child(newData.child('s').val()).child('u').val() === auth.uid && root.child('pquizRooms').child($roomId).child('members').child(newData.child('r').val()).child('u').val() === $toUid) || (!newData.exists() && auth.uid === $toUid))",
            ".validate": "newData.hasChildren(['f','s','r','t','d','ts'])",
            "f": { ".validate": "newData.isString() && newData.val() === auth.uid" },
            "s": { ".validate": "newData.isString() && newData.val().matches(/^([0-9]|[1-4][0-9])$/)" },
            "r": { ".validate": "newData.isString() && newData.val().matches(/^([0-9]|[1-4][0-9])$/)" },
            "t": { ".validate": "newData.isString() && (newData.val() === 'offer' || newData.val() === 'answer' || newData.val() === 'ice')" },
            "d": { ".validate": "newData.isString() && newData.val().length <= 20000" },
            "ts": { ".validate": "newData.isNumber() && newData.val() <= now + 60000" },
            "$other": { ".validate": false }
          }
        }
      }
    },
    "class": {
      "$map": {
        ".read": "auth != null",
        ".validate": "$map === 'adv' || $map === 'haunt' || $map === 'heli' || $map === 'drone' || $map === 'drive'",
        "muteAll": {
          ".write": "auth != null",
          ".validate": "newData.hasChildren(['on','by','ts'])",
          "on": { ".validate": "newData.isBoolean()" },
          "by": { ".validate": "newData.isString() && newData.val().length <= 40" },
          "ts": { ".validate": "newData.isNumber()" },
          "$other": { ".validate": false }
        },
        "podium": {
          ".write": "auth != null",
          ".validate": "newData.hasChildren(['id','by','ts'])",
          "id": { ".validate": "newData.isNumber()" },
          "by": { ".validate": "newData.isString() && newData.val().length <= 40" },
          "ts": { ".validate": "newData.isNumber()" },
          "top": {
            "$i": {
              ".validate": "newData.hasChildren(['u','n','w'])",
              "u": { ".validate": "newData.isString() && newData.val().length <= 128" },
              "n": { ".validate": "newData.isString() && newData.val().length <= 40" },
              "w": { ".validate": "newData.isNumber() && newData.val() >= 0" },
              "$other": { ".validate": false }
            }
          },
          "$other": { ".validate": false }
        },
        "$other": { ".validate": false }
      }
    }
  }
}
```

## หมายเหตุโครง /world + /tinv (โลก 3D multiplayer — รอบสี่สิบ)
- `/world/<map>/<uid> = {n, av, x, z, yaw, ts, c?, ct?, m?, w?, tl?, hp?}` — **hp = ลำแดงจอดทิ้งไว้ (รอบ 376)**: สตริง "x,z,y,yaw" ≤28 ส่งเฉพาะโลกเฮลิฯ ตอนไม่ได้ขับ+ลำพ้นลานกลาง >4m · ฝั่งรับ heliMeshBuild วาดลำแดงตรงนั้น · deny = client ตัด hp ส่งซ้ำเอง — ตำแหน่งผู้เล่นใน map ('adv'|'haunt') · เขียนเองอ่านได้ทุกคนที่ login · onDisconnect ลบตัวเอง · ส่งถี่สุด ~5.5Hz เฉพาะตอนขยับ · **c/ct = แชทลอยหัว (รอบ 42)**: ข้อความ ≤60 + Date.now ฝั่งส่ง (คงที่ต่อข้อความ — ฝั่งรับเห็น ct เปลี่ยน = ข้อความใหม่ โชว์ 5 วิ) แนบไปกับ set ระหว่างยังสด ผ่านตัวกรอง nameHasBadWord ก่อนส่ง · **m = สถานะไมค์ (รอบ 44 — โชว์ 🎤 เหนือหัว)** · **w = จำนวนคำที่ประกอบได้รอบนี้ (รอบ 46 — กระดานคะแนนสด 🏆 มุมซ้ายบน)** · **tl = ไฟเลี้ยวโหมดขับรถ (รอบ 132 — 1=ซ้าย 2=ขวา · ปิดไม่ส่ง field · ฝั่งรับวาดไฟกะพริบบนรถบล็อกเพื่อน · เขียนโดน deny = client ตัด tl ส่งซ้ำเอง ไม่พังเกม)**
- `/tinv/<toUid>/<fromUid> = {map, n, ts}` — คำเชิญเล่นโลก 3D ด้วยกัน · ผู้รับอ่านกล่องตัวเอง ผู้ส่ง/ผู้รับลบได้ · ฝั่งส่งจำใน state.tinvSent (เซฟ cloud) · เจอกันใน map จริงครั้งแรก → ต่างคนต่างรับเงินคืน TINV_CASHBACK (2,000) ฝั่ง client แล้วผู้รับลบคำเชิญ

## หมายเหตุโครง /class (ครูคุมห้อง — รอบ 44 + พิธีแชมป์รอบ 48)
- `/class/<map>/muteAll = {on:bool, by:ชื่อครู, ts}` — สถานะ "ครูปิดเสียงทั้งห้อง" ค้างใน DB (เด็กเข้าทีหลังก็โดนล็อก) · ทุก client ฟัง on('value') → ล็อกปุ่มไมค์+ตัดไมค์ที่เปิดค้าง
- `/class/<map>/podium = {id:Date.now ฝั่งครู, by, ts, top:[{u,n,w}×≤3]}` — ครูกด 🏁 จบรอบแข่ง → ทุกเครื่องเห็นโพเดียม 🥇🥈🥉 + แตร + คนติดอันดับรับโบนัส 100/50/25 (เช็ก uid ตัวเอง) + sessionWords รีเซ็ตเริ่มรอบใหม่ · **ครูลบ node เองใน 15 วิ** + client กันเล่นซ้ำด้วย id ในหน่วยความจำ และไม่เล่นพิธีที่ id เก่ากว่า 5 นาที (ไม่ persist ใน state — เลี่ยงชนกับ session คู่ขนาน)
- **บัญชีครู = อีเมลใน `TEACHER_EMAILS` (js/auth.js — เพิ่มอีเมลต่อท้าย array ได้)** เห็นปุ่ม 👩‍🏫 · ⚠️ rules ยอมให้ทุก auth เขียนได้ (UI ซ่อนปุ่มจากเด็ก) — ยอมรับระดับความเสี่ยงเดียวกับ coins ฝั่ง client · field `m` ใน /world = สถานะไมค์ (โชว์ 🎤 เหนือหัว)

## หมายเหตุโครง /rtc (voice chat — รอบ 43)
- `/rtc/<map>/<toUid>/<msgId> = {f:ผู้ส่ง, t:'offer'|'answer'|'ice', d:JSON(SDP/ICE ≤8000), ts}` — **signaling เท่านั้น เสียงจริงวิ่ง P2P (WebRTC) ไม่ผ่าน Firebase**
- ผู้รับอ่าน+ลบกล่องตัวเอง (ประมวลผลแล้วลบทันที + ล้างตอน join) · คนอื่น push ได้เฉพาะข้อความที่ `f` = uid ตัวเอง
- **`$map === 'chat'` (รอบ 625) = ท่อ signaling ของ "สายโทรหาเพื่อน" (voice/video call)** — ไม่ใช่แผนที่จริง ใช้ path เดียวกันเพื่อไม่ต้องเพิ่มโครงใหม่ · ฝั่งเกม = `Call` ใน `js/online.js`

## หมายเหตุโครง /calls (📞 โทรหาเพื่อน — รอบ 625 · กลุ่ม 3 คน รอบ 631)
- `/calls/<toUid>/<fromUid> = {k, n, m, ts, r, g}` — **กริ่ง + สถานะสายเท่านั้น** (เสียงวิ่ง P2P ผ่าน WebRTC ไม่ผ่าน Firebase ไม่มีการอัดเก็บ)
- 👥 **รอบ 631 (คุยกลุ่ม 3 คน):** `r` = รหัสห้อง (uid คนเปิดสาย) · `g` = uid คนที่อยู่ในห้องแล้ว คั่นด้วย `,` (ผู้ถูกชวนต่อ mesh ให้ครบทุกคน) · `k` เพิ่ม `'nofr'` (ยังไม่ได้เป็นเพื่อนกันครบ) และ `'full'` (ห้องเต็ม)
- 🔒 **รอบ 631 ลบวิดีโอคอลออกทั้งระบบ (ผู้ใช้สั่ง — ป้องกันมิจฉาชีพ):** เหลือสายเสียงล้วน · `m` ยังปล่อยผ่านใน rules เผื่อเครื่องที่เปิดค้างเวอร์ชันเก่ายังส่งมา (ฝั่งรับไม่สนใจค่านี้แล้ว)
- 🔒 **เข้ากลุ่มได้เมื่อเป็นเพื่อนกันครบทุกคน** — อ่าน `/friends` ของคนอื่นไม่ได้ตาม rules → ผู้ถูกชวนเป็นคนตรวจเองว่าทุก uid ใน `g` อยู่ใน `/friends` ของตัวเอง ไม่ครบ = ตอบ `nofr` ไม่ต่อสาย (และไม่เปิดไมค์)
- ผู้โทรตั้ง `onDisconnect().remove()` บน node ของตัวเอง → ปิดแท็บ/เน็ตหลุดกลางกริ่ง สายฝั่งโน้นดับเอง · วางสายแล้วทั้งสองฝ่ายลบ node ของตัวเองในกล่องอีกฝ่าย
- client กรอง "เฉพาะเพื่อนใน `/friends`" ก่อนเด้งกริ่ง (rules เปิดให้ auth ใดก็เขียนกล่องได้ เหมือน `/gifts`/`/friendReq` — กันสแปมที่ชั้น client + ไม่มีข้อมูลส่วนตัวใน node)

- ฝั่งเกม: `Voice` ใน adventure3d.js — mesh ต่อสายเมื่อเจอกันใน map (uid น้อยกว่าเป็นผู้ offer) · STUN ของ Google ฟรี ไม่มี TURN (เน็ตมือถือบางเจ้าอาจต่อไม่ติด — ข้อจำกัดที่ยอมรับ) · ไมค์ default ปิดทุกครั้งที่เข้า

## หมายเหตุโครง /market + /msold (ตลาดออนไลน์จริง — รอบ 124 · item 2)
- `/market/<key> = {sid:uid คนขาย, sn:ชื่อคนขาย, id:collectible, p:ราคา, ts}` — ลงขาย: push node ตัวเอง (sid ต้อง = auth.uid) · **ซื้อ/ถอน = ลบ node** (transaction คนแรกได้ · ลบ node คนอื่นได้ = กลไกซื้อ) · แก้ไข node ไม่ได้ (อยากเปลี่ยนราคา = ถอนแล้วลงใหม่)
- `/msold/<sellerUid>/<key> = {id, p, bn:ชื่อผู้ซื้อ, ts}` — ใบเสร็จจากผู้ซื้อ · คนขายอ่าน-ลบกล่องตัวเอง · ใครก็เขียนได้ (สร้างใหม่เท่านั้น) → **ฝั่งคนขายกันใบเสร็จปลอม 2 ชั้น:** จ่ายเฉพาะที่ตรง `netKey` ใน state.listings ตัวเอง + เช็กว่า `/market/<key>` หายไปแล้วจริง
- ฝั่งเกม: `marketWatch/marketList/marketUnlist/marketBuy/marketSoldWatch` (online.js) · ประกาศจริงมี `netKey` ใน state.listings — `marketTick` จำลองจะไม่แตะ · rules ยังไม่ publish → `Online.marketOk=false` เกมใช้ตลาดจำลองเดิมอัตโนมัติ

## หมายเหตุโครง /feed + /follow (Follow + Feed กิจกรรม — รอบ 155)
- `/feed/<uid>/p/<pushKey> = {c:หมวด ≤12, tx:ข้อความไทย ≤120, ts}` — โพสต์กิจกรรมที่**เจ้าของเขียนเองเท่านั้น** (เขียนเฉพาะหมวดที่เปิดใน `state.feedShare` — default ปิดทุกหมวด) · เก็บ 30 ล่าสุด (client prune เองหลัง push) · login แล้วอ่านได้ทุกคน (เปิดหน้า profile ใครก็เห็น — ผู้ใช้เคาะ 12 ก.ค.)
- `/feed/<uid>/a = JSON string {collectId:จำนวน} ≤4000` — คลังทรัพย์สินที่เปิดเผย (สวิตช์ "เปิดเผยทรัพย์สิน") · ปิดสวิตช์ = client ลบทิ้ง · หมวด c ที่ใช้ตอนนี้: coin/quiz/goods/other (ดู FEED_CATS ใน state.js — เผื่อ ≤12 ไว้ให้หมวดใหม่)
- `/follow/<targetUid>/<followerUid> = {n:ชื่อผู้ติดตาม ≤40, ts}` — follow ทางเดียวแบบ TikTok ไม่ต้องอนุมัติ · ผู้ติดตามเขียน/ลบ node ตัวเองเท่านั้น · อ่านได้ทุกคนที่ login (ไว้นับยอดผู้ติดตามในหน้า profile)
- ฝั่งเกม: `feedEvent/feedPrune/feedPurgeCat/feedPushAssets/followSet/followUnset/feedWatchSync/fetchPlayerFeed/fetchPlayerAssets/fetchFollowers` (online.js) · รายชื่อที่เรา follow เก็บใน `state.follows` (เซฟ cloud — DB ฝั่ง /follow ไว้โชว์ยอด/ให้เป้าหมายรู้) · ปิดหมวดในตั้งค่า = `feedPurgeCat` ลบโพสต์เก่าหมวดนั้นออกจาก DB ด้วย

## หมายเหตุโครง /gfeed (🌍 หน้า Feed ทุกคน + ไลก์/คอมเมนต์ — รอบ 639)
- `/gfeed/<postId> = {u:uid ผู้โพสต์, n:ชื่อ ≤40, g:ชั้น ≤20, c:หมวด ≤12, tx:ข้อความ ≤120, ts, lk?, cm?}` — โพสต์กิจกรรมของ**ทุกคน** (ต่างจาก `/feed/<uid>/p` เดิมที่เห็นเฉพาะคนที่ follow) · เขียนจาก `gfeedPush()` ทุกครั้งที่ `feedEvent()` ยิง (หมวดเดียวกับที่เปิดใน `state.feedShare`) · อ่านได้ทุกคนที่ login เดียว (หน้า Feed ดึงแค่ `limitToLast(GFEED_READ)` ~120 รายการล่าสุด ไม่ใช่ทั้งตาราง)
- `lk/<uid> = true` (ไลก์) และ `cm/<pushKey> = {u,n,tx,ts}` (คอมเมนต์) **ซ้อนอยู่ใต้โพสต์เดียวกัน** — จอ Feed เปิดอยู่ฟังก์เดียว `.on('value')` ที่ `/gfeed` ก็ได้ครบทั้งโพสต์+ไลก์+คอมเมนต์ ไม่ต้องเปิด listener แยกรายโพสต์ (ประหยัด connection) · **watcher เปิดเฉพาะตอนหน้า Feed เปิดอยู่เท่านั้น** (`gfeedWatchStart`/`gfeedWatchStop`) ไม่ใช่ตลอดเวลาเหมือน presence/leaderboard — กันกิน bandwidth ตอนไม่ได้ดู
- 🔒 **ไลก์/คอมเมนต์เขียนได้เฉพาะเจ้าของโพสต์เอง หรือคนที่เป็นเพื่อนกับเจ้าของโพสต์** (rules เช็กจริงผ่าน `root.child('friends').child(<uid เจ้าของโพสต์>).child(auth.uid).exists()` ไม่ใช่แค่ซ่อนปุ่มฝั่ง client) — คนแปลกหน้าเห็นโพสต์ปกติแต่กดไลก์/คอมเมนต์ไม่ได้ (ผู้ใช้เลือกไว้ 28 ก.ค. 2026 เพื่อความปลอดภัยเด็ก คล้ายกฎ `/calls` เดิม)
- **กวาดโพสต์เก่าของตัวเองทิ้ง:** `gfeedPrune()` query `orderByChild('u').equalTo(onlineKey())` (ต้องมี `.indexOn:"u"`) เก็บไว้แค่ `GFEED_KEEP_ME` โพสต์ล่าสุดต่อคน (ลบเก่ากว่านั้น) — คุมขนาดตารางรวมไม่ให้บวมตามจำนวนผู้เล่น
- ฝั่งเกม: `gfeedPush/gfeedPrune/gfeedWatchStart/gfeedWatchStop/gfeedRebuild/gfeedToggleLike/gfeedAddComment` (online.js) · เรียงแสดงผล **เพื่อนก่อนเสมอ แล้วค่อยคนอื่น** (ทำฝั่ง client ใน `gfeedRebuild` ไม่ใช่ rules) · หน้าจอเปิดจากปุ่ม "🌏 ดูทั้งหมด" ในกล่องฟีดเพื่อนเดิม → `openFeedBoard()` (ui.js) ยังโชว์ "ใครออนไลน์ทำอะไรอยู่ตอนนี้" จาก `/presence` เดิม (ไม่ต้องมีโซนใหม่) จัดเรียงเพื่อนก่อนแบบเดียวกัน
- **ยังไม่ publish = เกมไม่พัง:** เขียนโพสต์/ไลก์/คอมเมนต์โดน deny เงียบๆ → หน้า Feed เปิดได้ปกติเห็นแค่ presence สด ส่วนโพสต์กิจกรรม/ไลก์/คอมเมนต์ว่างจนกว่าจะ publish

## หมายเหตุโครง /gnotif (🔔 กล่องแจ้งเตือนย้อนหลัง — รอบ 976 · ขยายรอบ 983)
- `/gnotif/<ผู้รับ>/n/<nid> = {t, pid?, cid?, u, n, r?, cm?, tx?, ts}` — 1 ใบต่อเหตุการณ์ · `t` = `rx`(กดใจโพสต์) `cm`(คอมเมนต์โพสต์เรา) `rp`(ตอบกลับคอมเมนต์เรา) `cl`(ถูกใจคอมเมนต์เรา) · `pid`/`cid` = ต้นเรื่อง (ใช้กับปุ่ม 🔗 ไปดูต้นเรื่องของรอบ 974) · `u`/`n` = uid+ชื่อคนกด · `r` = รหัสรีแอ็กชัน · `cm` = ข้อความคอมเมนต์ · `tx` = ข้อความต้นเรื่อง
- 🆕 **รอบ 983 — 3 ชนิดที่ไม่ได้มาจากโพสต์ (ไม่มี `pid`)** ใช้ฟิลด์เดิมทั้งหมด ไม่มีฟิลด์ใหม่: `gf` ของขวัญ (`r`=`shop`|`collect` · `cm`=id ของขวัญ · `cid`=รหัสใบในกล่อง 🎁) · `gr` ทักทายน้อง (`cm`=รหัสคำทัก · `cid`=รหัสใบ) · `fr` คำขอเป็นเพื่อน (ไม่มีฟิลด์เสริม) — ผู้รับแปลง id เป็นชื่อไทยเองด้วย `giftItemName()` จึงไม่ต้องฝากข้อความยาวมากับใบ · ปุ่มท้ายแถวพาไป **ห้องของขวัญ 🎁 / แผงเพื่อน 👥** แทน "ไปดูต้นเรื่อง" (`FNT_JUMP` ใน ui.js)
- ⚠️ **3 ชนิดใหม่ "ไม่มี diff สำรอง"** (ต่างจากไลก์/คอมเมนต์) → rules ยังไม่ publish = ไม่โผล่ในกล่อง 🔔 เลย · ป้ายเหลืองในกล่องบอกผู้ใช้ตรง ๆ ให้ไปดูที่กล่องของมันเองก่อน · การส่งของขวัญ/คำทัก/คำขอ **ไม่กระทบ** (เขียนคนละก้อน)
- 🔁 **กันนับซ้ำ:** `gnotifKeyOf` = `t|pid|cid|u|r` · ชนิด `fr` ต่อรหัสใบเข้าไปด้วย เพราะคนเดิมส่งคำขอใหม่หลังถูกปฏิเสธได้จริง (ของขวัญ/คำทักมี `cid` ต่างกันอยู่แล้ว) · `gf`/`gr` เข้ากล่อง+นับเลขกระดิ่งแต่ **ไม่เด้งแถบซ้ำ** (`GNOTIF_QUIET`) เพราะกล่อง 🎁 เด้งให้แล้ว
- `/gnotif/<ผู้รับ>/seen = "<nid ล่าสุดที่กดอ่านแล้ว>"` — เทียบด้วยรหัส push key (เรียงตามเวลาในตัว) **ไม่ใช่ timestamp** เพราะนาฬิกาเครื่องคนกดเชื่อไม่ได้ → เลขค้างบนกระดิ่งถูกต้องข้ามเครื่อง
- 🔄 **"คนที่กด" เป็นฝ่ายเขียน** (ผู้รับอาจไม่ได้เปิดเกมอยู่) — เดิมรอบ 701 ผู้รับคิดเองจาก diff ของ `/gfeed` จึงเห็นเฉพาะตอนเปิดเกมค้าง · diff เดิมยังอยู่เป็นตัวสำรอง (คนกดใช้เกมเวอร์ชันเก่า) กันซ้ำด้วย `Online.notifKeys` (`t|pid|cid|u|r`)
- 🔒 **คนแปลกหน้ายัดใส่กล่องเด็กไม่ได้:** rules บังคับ `u === auth.uid` + ต้องมีสิทธิ์ยุ่งกับโพสต์ `pid` นั้นจริง (เจ้าของโพสต์/เพื่อนของเจ้าของโพสต์ — สูตรเดียวกับสิทธิ์ไลก์-คอมเมนต์ `/gfeed`) + สร้างได้อย่างเดียว แก้/ลบเฉพาะเจ้าของกล่อง · อ่านได้เฉพาะเจ้าของกล่อง · **รอบ 983:** ชนิดใหม่เช็ก "ของจริง" แทน `pid` — `gf`/`gr` ต้องมี `/gifts/<ผู้รับ>/<คนกด>` จริง · `fr` ต้องมี `/friendReq/<ผู้รับ>/<คนกด>` จริง = สิทธิ์เท่าการส่งของขวัญ/คำขอที่ทำได้อยู่แล้ว ไม่เปิดช่องใหม่
- **คุมขนาด:** เก็บ `GNOTIF_KEEP`(40) ใบล่าสุด — เจ้าของกล่องกวาดของเก่าทิ้งเองหลังโหลดครบ (`gnotifPrune`)
- ฝั่งเกม: `gnotifSend/gnotifAdd/gnotifRecount/gnotifMarkSeen/gnotifWatchStart/gnotifListen/gnotifWatchStop/gnotifPrune/gnotifTellComment` + จุดส่งชนิดใหม่ใน `giftSend`/`greetSend`/`friendRequest` (online.js) · `openFeedNotif`/`renderFeedBell`/`feedNotifText`/`feedNotifGo`/`FNT_JUMP` (ui.js) · ป้าย "ใหม่" + ป้ายเหลืองตอน rules ยังไม่ publish อยู่ใน `css/lobby.css` โซน `.fnt-*`

## หมายเหตุโครง /pphoto (📷 รูปโปรไฟล์อัปโหลดเอง — รอบ 709)
- `/pphoto/<uid> = "data:image/jpeg;base64,..."` — รูปเดียวต่อคน · **แยก node ออกจาก `/leaderboard` โดยตั้งใจ**: รูป ~5–25KB ถ้าไปอยู่ใน leaderboard จะถูกดาวน์โหลดมาทั้งก้อนทุกครั้งที่โหลดกระดาน (limitToLast 20 คน = +500KB/ครั้ง) — แยกไว้แล้วอ่านเฉพาะตอนเปิดการ์ดโปรไฟล์คนนั้นจริง ๆ (มี cache ต่อ uid ใน memory)
- **ไม่เก็บใน `state`** (จึงไม่ขึ้นไปกับเซฟ cloud `/users/<uid>/save`) — เก็บ localStorage แยกคีย์ `petVocabAdventure_photo` + DB · เข้าเกมเครื่องใหม่ `photoPullMine()` ดึงลงมาให้เอง · มีในเครื่องแต่ DB ว่าง = ส่งขึ้นให้เอง (self-heal)
- ฝั่งเกม: `js/photo.js` (`photoGet/photoOf/photoFetch/photoSaveUrl/photoRemove/photoPullMine/openPhotoMenu/openPhotoCrop`) · ครอป/ย่อ/บีบด้วย canvas ในเครื่องก่อนเสมอ (256px จัตุรัส · ไล่ลดคุณภาพ 0.82→0.5 แล้วไล่ลดขนาด 256→160 จนกว่าจะ ≤28000 ตัวอักษร) — วัดจริงด้วยภาพ noise ล้วน (บีบยากสุด) ได้ 19,347 ตัวอักษร
- จุดที่โชว์: รูป passport บนแถบล็อบบี้ (+ปุ่ม 📷 มุมขวาล่าง) · `playerAvatarHTML()` ทุกที่ (หน้าเกม/สถิติ/ใบรายงาน) · การ์ดโปรไฟล์ผู้เล่น (ของเราทันที · ของเพื่อนโหลดตามทีหลัง) · ไม่มีรูป = ตัวการ์ตูนบล็อกเหมือนเดิมทุกจุด

## หมายเหตุโครง /examRank (🏁 อันดับข้อสอบมาตรฐานตลอดกาล — รอบ 825)
- `/examRank/<setId>/<uid> = {sc, tt, sec, n, g, ts}` — **1 แถวต่อคนต่อชุดข้อสอบ** (setId = `ielts_1`…`toefl_5`) · เขียนจาก `xrkSubmit()` ใน `xsFinish()` (`js/examstd.js`) เฉพาะตอน**สอบผ่าน** และเฉพาะเมื่อ**ดีกว่าแถวเดิม** (คะแนนก่อน แล้วเวลาตัดสิน) — อ่านแถวเดิม 1 ครั้งแล้ว `set()` ทับ ตรรกะ "เก็บที่ดีที่สุด" อยู่ **ฝั่งเขียน** ไม่ใช่ฝั่งอ่าน
- อ่านด้วย `orderByChild('sc').limitToLast(50)` (ต้องมี `.indexOn:"sc"`) แล้ว **เรียงคะแนน→เวลาเองฝั่ง client** (RTDB เรียงได้ทีละคีย์เดียว) · cache ต่อชุดใน `__xrkCache` กดชิปสลับชุดไปมาไม่ยิงซ้ำ · สอบผ่านใหม่ = ล้าง cache ชุดนั้น
- แถวของตัวเองมาจาก **2 ทางรวมกัน**: แถวใน DB + ใบประกาศ `state.certs` (เอาอันที่ดีกว่า) → ออฟไลน์/rules ยังไม่ publish ก็ยังเห็นสถิติตัวเองเสมอ
- ฝั่งเกม: `xrkSubmit/xrkFetch/xrkMerge/xrkBodyHTML/xrkMount/xrkNote/xrkNoteRefresh/openExamStdRank` (`js/examstd.js`) · หน้าตาแถวใช้ `bxrRowHTML`/`BXR_TOP` ของ `js/bandadv.js` ร่วมกัน (ไม่เขียนซ้ำ ไม่เพิ่ม CSS) · ⚠️ **ข้อความบอกแหล่งข้อมูลห้ามใช้ `bxRankNote()` ร่วมกัน** — กระดานสอบใหญ่ (รอบ 786) ยังเป็นแบบ "จากกิจกรรมล่าสุด" อยู่ กระดานนี้ใช้ `xrkNote()` ของตัวเอง

## หมายเหตุโครง /bandRank (🏁 อันดับสอบใหญ่คลังศัพท์ขั้นสูงตลอดกาล — รอบ 827)
- `/bandRank/<catId>_<lvKey>/<uid> = {sc, tt, sec, n, g, ts}` — **1 แถวต่อคนต่อ (หมวด,ระดับ)** (`catId` เช่น `academic`/`ielts` · `lvKey` = `found`|`inter`|`expert`) · เขียนจาก `bxrSubmit()` ใน `onPass()` ของ `bandAdvExamCat` (`js/bandadv.js`) เฉพาะตอน**สอบผ่าน**และเฉพาะเมื่อ**ดีกว่าแถวเดิม** (คะแนนก่อน แล้วเวลาตัดสิน — ตรงกับตรรกะที่ `bandAdvExamBest`/ใบประกาศใช้อยู่แล้ว) — อ่านแถวเดิม 1 ครั้งแล้ว `set()` ทับ ตรรกะ "เก็บที่ดีที่สุด" อยู่**ฝั่งเขียน**
- อ่านด้วย `orderByChild('sc').limitToLast(50)` (ต้องมี `.indexOn:"sc"`) แล้ว **เรียงคะแนน→เวลาเองฝั่ง client** · cache ต่อ (หมวด,ระดับ) ใน `__bxrCache` กดชิปสลับไปมาไม่ยิงซ้ำ · สอบผ่านใหม่ = ล้าง cache ชุดนั้น
- แถวของตัวเองมาจาก **2 ทางรวมกัน**: แถวใน DB + `bandAdvExamBest()` (อ่านจากใบประกาศ/quizLog) เอาอันที่ดีกว่า → ออฟไลน์/rules ยังไม่ publish ก็ยังเห็นสถิติตัวเองเสมอ
- **ทำไมต้องมีโซนนี้:** เดิม (รอบ 786) กระดานอ่านจากฟีดรวม `Online.gfeed` (120 โพสต์ล่าสุดทั้งเกม) → คนที่สอบผ่านนานแล้วโพสต์หลุดออก = หายจากกระดานของคนอื่น เป็นแค่ "อันดับจากกิจกรรมล่าสุด" · โซนนี้เก็บ 1 แถวต่อคนต่อ (หมวด,ระดับ) จึงเป็นอันดับตลอดกาลจริง
- **ยังไม่ publish = เกมไม่พัง:** เขียน/อ่านโดน deny → `Online.bxrOk=false` → กระดานยังเห็นสถิติของตัวเอง (จากใบประกาศ) และขึ้นป้ายบอกตรง ๆ "กระดานกลางยังไม่เปิด (ต้องอัปเดตกฎความปลอดภัยโซน /bandRank ก่อน)" — `bxRankNote()` ใน `js/bandadv.js` (กฎทองข้อ 1) · ระบบสอบ/รางวัล/ใบประกาศ ทำงานปกติทุกอย่าง
- ฝั่งเกม: `bxrSubmit/bxrFetch/bxrMerge/bxRankBodyHTML/bxRankMount/bxRankNote/bxRankNoteRefresh/openBigExamRank` (`js/bandadv.js`) · `bxrRowHTML`/`BXR_TOP` ใช้ร่วมกับ `/examRank` (`js/examstd.js`) ⚠️ **ป้ายบอกแหล่งข้อมูลห้ามใช้ `xrkNote()` ร่วมกัน** — คนละโซน DB (`/bandRank` vs `/examRank`) อาจติด deny คนละสถานะกัน
- **Artifact ปุ่มคัดลอกก้อนเต็ม (ใช้ใบนี้):** ดูลิงก์ในหัวข้อ "สถานะการ publish" ด้านบน

## หมายเหตุโครง /f1Rank (🏆 อันดับ Best Lap โลก F1 ตลอดกาล — รอบ 903)
- `/f1Rank/<uid> = {sec, n, g, ts}` — **1 แถวต่อคน** (สนามเดียว ไม่แยก setId แบบ examRank/bandRank เพราะ F1 มีสนามเดียว) · เขียนจาก `frSubmit()` ใน `progressTick()` (`js/f1_3d.js`) เฉพาะตอนทำ **Best Lap ใหม่ของตัวเอง** (`state.f1Best` ดีขึ้น) — validate ฝั่ง rules บังคับว่า `sec` ใหม่ต้อง**น้อยกว่า**แถวเดิมเสมอ (ตรงข้ามกับ examRank ที่คะแนนมากกว่าคือดีกว่า) จึง `set()` ทับได้เลยไม่ต้องอ่านแถวเดิมก่อนเหมือน examRank
- อ่านด้วย `orderByChild('sec').limitToFirst(50)` (ต้องมี `.indexOn:"sec"`) — **`limitToFirst` ไม่ใช่ `limitToLast`** เพราะเวลาน้อยสุดคือดีที่สุด แล้วเรียงเองฝั่ง client อีกชั้น (`sort((a,b)=>a.sec-b.sec)`) กันกรณีข้อมูลเท่ากัน · cache ใน `__frCache` ล้างเมื่อ submit สำเร็จ
- แถวของตัวเองมาจาก **2 ทางรวมกัน**: แถวใน DB + `state.f1Best` (เอาอันที่ดีกว่า) → ออฟไลน์/rules ยังไม่ publish ก็ยังเห็นสถิติตัวเองเสมอ
- โชว์ **ท็อป 10** ในกล่อง `#f1-rankbox` ของหน้า intro โลก F1 (เรียก `frMount()` ใน `start()`) — ไม่ใช่ป็อปอัปแยกแบบ examRank/bandRank
- **ยังไม่ publish = เกมไม่พัง:** เขียน/อ่านโดน deny → `Online.frOk=false` → กระดานยังเห็นสถิติของตัวเอง (จาก `state.f1Best`) และขึ้นป้ายบอกตรง ๆ "กระดานกลางยังไม่เปิด (รออัปเดตกฎ /f1Rank)" — `frNote()` (กฎทองข้อ 1 ห้ามปิดฟีเจอร์เงียบ) · ระบบแข่ง/คำศัพท์/เหรียญทำงานปกติทุกอย่าง
- ฝั่งเกม: `frSubmit/frMerge/frFetch/frRowHTML/frBodyHTML/frNote/frMount` (`js/f1_3d.js`) · แถว HTML ใช้ `gradeMark`/`gradeOf`/`splitNameBadges`/`escapeHTML` ร่วมกับระบบอื่น (ชื่อเล่น+สัญลักษณ์ระดับชั้นเสมอ — กฎคุ้มครองเด็ก)
- **Artifact ปุ่มคัดลอกก้อนเต็ม (ใช้ใบนี้):** https://claude.ai/code/artifact/ba9890de-eb86-4255-bed6-b322f0e4e688

## หมายเหตุโครง /gifts (ข้อ 0.5)
- `/gifts/<toUid>/<fromUid>/<giftKey> = {k:'shop'|'collect', id, fn:ชื่อผู้ส่ง, ts, st:'pending'|'accepted'|'declined'}`
- ผู้รับอ่านทั้งกล่อง `/gifts/<toUid>` (auth.uid===toUid) · ผู้ส่งอ่าน-เขียนเฉพาะซับทรีตัวเอง `/gifts/<toUid>/<fromUid>` (เฝ้าสถานะ+คืนของ)
- คลัง collectible เป็น state ในเครื่อง (ไม่ได้อยู่ใน DB) → "คืนของ" ตอนถูกปฏิเสธ/หมดอายุ ทำที่ฝั่งผู้ส่ง (giftOutWatch) เมื่อผู้ส่งออนไลน์
