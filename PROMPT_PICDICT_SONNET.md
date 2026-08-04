# PROMPT_PICDICT_SONNET.md — ถอดคำศัพท์แผ่น Picture Dictionary (งานมอบ Sonnet 5)

> **ผู้ทำ: Sonnet 5 ใน session แยก** (งานดูภาพ+พิมพ์ข้อมูลซ้ำ ๆ ไม่ต้องใช้โมเดลแพง)
> เริ่มงาน: อ่านไฟล์นี้ **ไฟล์เดียว** — ห้ามบูตตาม skill vocab-world / ห้ามอ่าน HANDOFF (เปลือง token)

## เป้าหมาย

เกมมีหนังสือ "Picture Dictionary" (js/picdict.js — ทำเสร็จแล้ว ห้ามแตะ) เปิดอ่านแผ่นโปสเตอร์คำศัพท์
ใน `C:\Users\rober\english-pet-game\img\matching\*.png` — แผ่นละ 1 หน้าหนังสือ
ต้องการ **ตารางคำศัพท์ของทุกแผ่น** เพื่อให้เด็กแตะการ์ดแล้วเกมอ่านออกเสียง+โชว์คำแปล

หน้าที่ของคุณ: **เปิดดูภาพทีละแผ่น แล้วถอดคำลงไฟล์ `js/data/picdict_words.js`** (ไฟล์เดียวเท่านั้นที่แก้ได้ นอกจากตารางความคืบหน้าในไฟล์นี้)

## รูปแบบข้อมูล (บังคับเป๊ะ — เกมอ่านตามนี้)

ต่อท้ายไฟล์ `js/data/picdict_words.js` ทีละ entry:

```js
PICDICT_WORDS['<ชื่อไฟล์.png>'] = {cols:<จำนวนคอลัมน์>, rows:<จำนวนแถว>, words:[
  ["<คำอังกฤษ>","<คำแปลไทย>"], ...   // ไล่ ซ้าย→ขวา บน→ล่าง ทีละแถว
]};
```

- **cols/rows** = ตารางการ์ดบนแผ่น (นับจากภาพจริง — แต่ละแผ่นไม่เท่ากัน)
- **words** ต้องเรียง ซ้าย→ขวา บน→ล่าง · แถวสุดท้ายไม่เต็มแถวได้ (จำนวน words < cols×rows ได้)
- คำอังกฤษ/ไทย = **พิมพ์ตามที่เขียนบนการ์ดเป๊ะ ๆ** (ตัวใหญ่เล็กตามภาพ) — เกมใช้คำอังกฤษไปเปิดเสียง
- ถ้าแผ่นมีขอบ/หัวเรื่องก่อนถึงตารางการ์ด ใส่ field เสริม `pad:[บน,ขวา,ล่าง,ซ้าย]` เป็น % ของภาพ
  (แผ่นปกติการ์ดชิดขอบ ไม่ต้องใส่)
- แผ่นไหน **ไม่ใช่ตารางสม่ำเสมอ** (การ์ดคนละขนาด/ผังอิสระ) → **ข้าม ไม่ต้องใส่ entry** แล้วจดชื่อไว้ในตารางความคืบหน้า (หน้านั้นเกมยังเปิดดูได้ แค่ไม่มีเสียง — ไม่พัง)

## ขั้นตอนต่อแผ่น

1. `Read C:\Users\rober\english-pet-game\img\matching\<ไฟล์>.png` (ดูภาพ)
2. นับคอลัมน์×แถว + ถอดคำอังกฤษ/ไทยทุกการ์ดตามลำดับ
3. Edit ต่อท้าย `js/data/picdict_words.js`
4. ทำแผ่นถัดไป — **ห้ามเปิดภาพเดิมซ้ำ ห้ามอ่านไฟล์ words ย้อนทั้งไฟล์** (ต่อท้ายอย่างเดียว)

## ⛔ กฎเหล็ก

1. แก้ได้ 2 ไฟล์เท่านั้น: `js/data/picdict_words.js` + ตารางความคืบหน้าในไฟล์นี้ · **ห้ามแตะไฟล์อื่นทุกกรณี**
2. ทำครบทุก ~10 แผ่น หรือก่อนจบ session ให้ commit ทันที (กันงานหาย):
   ```
   cd C:\Users\rober\english-pet-game
   "C:\Users\rober\bin\node\node.exe" --check js/data/picdict_words.js   # ต้องผ่านก่อน commit
   git add js/data/picdict_words.js PROMPT_PICDICT_SONNET.md
   git commit -m "picdict words: <ช่วงแผ่นที่ทำ>" -- js/data/picdict_words.js PROMPT_PICDICT_SONNET.md
   git push
   ```
   (commit แบบ pin pathspec ตามตัวอย่างเป๊ะ ๆ — มี session อื่นทำงานคู่ขนานเสมอ · **ห้าม `git add -A`**)
   ⚠️ ไม่ต้อง deploy — session หลักจะ deploy รวมทีเดียวตอนครบ
3. อัปเดตตารางความคืบหน้าด้านล่าง **ทุกครั้งก่อน commit**
4. session ใหม่: อ่านไฟล์นี้ → ทำต่อจากแผ่นถัดไปในตาราง

## 📊 ตารางความคืบหน้า (อัปเดตทุก session)

| สถานะ | แผ่น |
|---|---|
| ✅ เสร็จแล้ว (รอบ 993 · Sonnet) | Colors.png (ตรวจซ้ำแล้ว ถูกต้องตรงภาพ ไม่ต้องแก้) · Action Verbs.png · Adjectives.png · Bathroom.png · Bedroom.png · Birds.png · BodyParts.png · Classroom Objects.png · Clothes.png · DailyRoutines.png · Drinks.png · Family.png · FarmAnimals.png · Feelings.png · Flowers.png · Furniture.png · Hobbies.png · Holidays.png · House.png |
| ⬜ คิวถัดไป (เรียงตามนี้) | Insects.png · Jobs.png · Kitchen.png · MusicalInstruments.png · Nature.png · Opposites.png · Places.png · Prepositions.png · Safety Signs.png · School.png · SeaAnimals.png · Seasons.png · Shapes.png · Space.png · Sports.png · Time.png · Tools.png · Toys.png · Transportation.png · Trees.png · Vegetables.png · Weather.png · WildAnimals.png · animal1.png · animal2.png · food.png · fruit.png |
| 🚫 ข้าม (ผังไม่สม่ำเสมอ) | — |
| 📝 หมายเหตุ | Bathroom.png แถว7 คอลัมน์1 ("Hair Dryer") ตัวหนังสือบนภาพต้นฉบับเพี้ยน/อ่านไม่ออก (ภาพชี้ไดร์เป่าผมชัดเจน) — ใส่เป็น Hair Dryer/ไดร์เป่าผม ซ้ำกับแถว8 ตามภาพที่ตั้งใจสื่อ |
