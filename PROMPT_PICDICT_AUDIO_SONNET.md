# PROMPT_PICDICT_AUDIO_SONNET.md — เจนไฟล์เสียงคำในหนังสือ Picture Dictionary (งานมอบ Sonnet 5)

> **ผู้ทำ: Sonnet 5 ใน session แยก** (รันสคริปต์ + รอ + commit — ไม่ต้องใช้โมเดลแพง)
> เริ่มงาน: อ่านไฟล์นี้ **ไฟล์เดียว** — ห้ามบูตตาม skill vocab-world / ห้ามอ่าน HANDOFF (เปลือง token)
> ✅ ผู้ใช้อนุมัติให้เพิ่มไฟล์ใน `sound/words/` แล้ว (4 ส.ค. 2026)

## เป้าหมาย

หนังสือ Picture Dictionary ในเกม แตะการ์ดคำไหนก็อ่านออกเสียงได้ — แต่ตอนนี้คำที่ **ยังไม่มีไฟล์ mp3**
จะถอยไปใช้เสียงสังเคราะห์ของเบราว์เซอร์ (Web Speech API) ซึ่ง **เสียงไม่เหมือนกันในแต่ละเครื่อง**
(Edge เพราะสุด · Chrome พอใช้ · Firefox แข็งมาก) และบางเครื่องอ่านผิด

งานนี้: **เจน mp3 ล่วงหน้าด้วย `tools/gen_word_audio.py`** (ใช้เสียง Neural ของ Microsoft ผ่าน `edge-tts` — ฟรี)
ให้ครอบคลุมคำในหนังสือ → ทุกเครื่อง/ทุกมือถือได้เสียงเดียวกันเป๊ะ เล่นทันทีไม่ต้องรอสังเคราะห์

ตัวเลขปัจจุบัน (4 ส.ค. 2026): คำในหนังสือ **1,306 คำ** · มี mp3 แล้ว 281 · **ยังขาด 1,025 คำ**
(ตัวเลขนี้จะโตขึ้นเรื่อย ๆ ตามที่อีก session ถอดคำเพิ่มใน `js/data/picdict_words.js` — รันซ้ำได้ ไม่เสียหาย)

## ขั้นที่ 1 — ต่อคลังคำของสคริปต์ให้รวมคำในหนังสือ (แก้ครั้งเดียว)

ตอนนี้ `tools/gen_word_audio.py` อ่านคำจาก `js/data/vocab.js` + `js/data/band/*.js` เท่านั้น
ยังไม่รู้จักคำในหนังสือ → ต้องเติม `js/data/picdict_words.js` เข้าไปด้วย

**แก้ 2 จุดใน `tools/gen_word_audio.py`:**

จุดที่ 1 — ใต้บรรทัด `BAND  = ROOT / "js" / "data" / "band"` เพิ่ม:
```python
PICDICT = ROOT / "js" / "data" / "picdict_words.js"   # 📖 คำบนการ์ดในหนังสือ Picture Dictionary (รอบ 992+)
```

จุดที่ 2 — ในฟังก์ชัน `extract_words()` **หลัง** ลูป `for f in sorted(BAND.glob("*.js")):` จบ
(ก่อนบรรทัด `print(f"คำจาก vocab.js: ...")`) เพิ่ม:
```python
    # 📖 คำบนการ์ดในหนังสือ Picture Dictionary — รูปแบบ ["English","ไทย"] ตรงกับ PAIR_RE อยู่แล้ว
    n_pd = add(words_in(PICDICT.read_text(encoding="utf-8"))) if PICDICT.exists() else 0
```
แล้วแก้บรรทัด `print` ให้โชว์เลขนี้ด้วย เช่น
```python
    print(f"คำจาก vocab.js: {n_vocab} · จาก band/ ({n_files} ไฟล์): {n_band} · จากหนังสือภาพ: {n_pd} · รวมไม่ซ้ำ {len(out)}")
```

## ขั้นที่ 2 — รันเจนเสียง

```
cd C:\Users\rober\english-pet-game
pip install edge-tts          # ถ้ายังไม่มี (ลงแล้วข้ามได้)
python tools/gen_word_audio.py
```
- ต้องต่อเน็ต · ใช้เวลาพอสมควร (ราว 1,000 คำ = หลายนาที) — **รอจนจบ อย่ากด Ctrl+C**
- สคริปต์ **ข้ามไฟล์ที่มีอยู่แล้วเสมอ** → รันซ้ำได้ปลอดภัย ไม่ทับของเก่า
- ถ้ามี `failed` ค้าง ให้รันซ้ำอีกรอบ (เน็ตสะดุดเป็นครั้งคราว) · ยังเหลือ fail อยู่ให้จดไว้ในตารางท้ายไฟล์นี้
- ไฟล์ที่ได้ ≈ 15KB/คำ (1,000 คำ ≈ 15MB)

## ขั้นที่ 3 — ตรวจก่อน commit

```
python - <<'EOF'
import re,os,sys
sys.stdout.reconfigure(encoding='utf-8')
src=open('js/data/picdict_words.js',encoding='utf-8').read()
words=set(m.group(1) for m in re.finditer(r'\["([A-Za-z][^"]*)","',src))
key=lambda w: re.sub(r'^_+|_+$','',re.sub(r'[^a-z0-9]+','_',w.lower()))
have=set(os.path.splitext(f)[0] for f in os.listdir('sound/words'))
miss=sorted(w for w in words if key(w) not in have)
print('คำในหนังสือ',len(words),'· ยังขาดเสียง',len(miss)); print(miss[:20])
EOF
```
ต้องเหลือขาด **0 คำ** (หรือเหลือเฉพาะคำที่จดไว้ว่า fail จริง ๆ)

เปิดฟังสุ่ม 2-3 ไฟล์ด้วยว่าอ่านถูกจริง เช่น `sound/words/air_conditioner.mp3`

## ขั้นที่ 4 — commit

```
cd C:\Users\rober\english-pet-game
git add sound/words tools/gen_word_audio.py PROMPT_PICDICT_AUDIO_SONNET.md
git commit -m "picdict audio: เจนเสียงคำในหนังสือ <จำนวน> คำ" -- sound/words tools/gen_word_audio.py PROMPT_PICDICT_AUDIO_SONNET.md
git push
```
(commit แบบ pin pathspec ตามนี้เป๊ะ ๆ — มี session อื่นทำงานคู่ขนานเสมอ · **ห้าม `git add -A`**)
⚠️ **ไม่ต้อง deploy** — รอบถัดไปของ session หลัก deploy ให้เอง (deploy ดึงไฟล์จาก git HEAD)

## ⛔ กฎเหล็ก

1. แตะได้ 3 อย่างเท่านั้น: **เพิ่มไฟล์ใหม่**ใน `sound/words/` · แก้ `tools/gen_word_audio.py` 2 จุดข้างบน · ตารางท้ายไฟล์นี้
   **ห้ามลบ/ห้ามเขียนทับ mp3 เดิม** (5,385 ไฟล์ของเดิมเป็นของผู้ใช้) · ห้ามแตะไฟล์เกมอื่นทุกกรณี
2. ห้ามเปลี่ยน `VOICE` / `RATE` ในสคริปต์ — เสียงต้องเป็นชุดเดียวกับคำศัพท์เดิมทั้งเกม
3. งานนี้ **รันซ้ำได้เรื่อย ๆ**: อีก session กำลังถอดคำเพิ่มลง `js/data/picdict_words.js` → ทำครบแล้วรอบหน้ามารันซ้ำ เก็บคำใหม่ได้เลย
4. เจอ mp3 ที่อ่านผิด (เช่นคำพ้องรูป) → **ห้ามลบเอง** จดไว้ในตารางท้ายไฟล์ แล้วบอกผู้ใช้

## 📊 ตารางความคืบหน้า (อัปเดตทุกครั้งก่อน commit)

| ครั้งที่ | วันที่ | เจนเพิ่ม (คำ) | คงเหลือขาด | fail / คำที่อ่านผิด |
|---|---|---|---|---|
| — | — | ยังไม่เริ่ม | 1,025 | — |
