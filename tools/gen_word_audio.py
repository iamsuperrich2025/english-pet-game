# -*- coding: utf-8 -*-
"""
gen_word_audio.py — เจนไฟล์เสียงอ่านคำศัพท์อังกฤษ (MP3) จากเสียง Neural ของ Microsoft
(เอนจินเดียวกับ Read Aloud ใน Edge — ฟรี ผ่านไลบรารี edge-tts)

ทำไมต้องเจนล่วงหน้า: Web Speech API ให้เสียงไม่เท่ากันในแต่ละเบราว์เซอร์
(Edge เพราะสุด Chrome พอใช้ Firefox แข็งมาก) → เจนเป็นไฟล์ครั้งเดียว
ทุกเบราว์เซอร์/มือถือได้เสียงเดียวกันเป๊ะ เล่นทันทีไม่ต้องรอสังเคราะห์

วิธีใช้ (เครื่อง dev · ต้องมีเน็ต):
    pip install edge-tts
    python tools/gen_word_audio.py

- อ่านคำจาก js/data/vocab.js (VOCAB_BANDS ทุกระดับทุกหมวด) + js/data/band/*.js (คลังศัพท์ใหญ่)
- เขียน sound/words/<word>.mp3 (ชื่อไฟล์ = ตัวพิมพ์เล็ก, อักขระอื่นแทนด้วย _)
- ข้ามไฟล์ที่มีอยู่แล้ว → เพิ่มคำใหม่ใน vocab.js แล้วรันซ้ำได้เลย
"""
import asyncio, re, sys
from pathlib import Path

import edge_tts

# คอนโซล Windows ดีฟอลต์เป็น cp1252 — พิมพ์ข้อความไทยแล้ว UnicodeEncodeError ตายกลางคัน
for _s in (sys.stdout, sys.stderr):
    try:
        _s.reconfigure(encoding="utf-8")
    except Exception:
        pass

VOICE = "en-US-JennyNeural"   # เสียงผู้หญิงอเมริกัน ชัด เป็นมิตร เหมาะสอนเด็ก
RATE  = "-15%"                # ช้าลงนิดให้เด็กฟังทัน
ROOT  = Path(__file__).resolve().parent.parent
VOCAB = ROOT / "js" / "data" / "vocab.js"
BAND  = ROOT / "js" / "data" / "band"      # คลังศัพท์ใหญ่ (ไฟล์ย่อยแยกช่วงคำ *.js)
PICDICT = ROOT / "js" / "data" / "picdict_words.js"   # 📖 คำบนการ์ดในหนังสือ Picture Dictionary (รอบ 992+)
OUT   = ROOT / "sound" / "words"
OUT_LETTERS = ROOT / "sound" / "letters"   # ชื่อตัวอักษร A-Z (เก็บตัวอักษรในโลก 3D)
CONCURRENCY = 6

def word_key(word: str) -> str:
    """ต้องตรงกับ wordAudioFile() ใน js/util.js ทุกตัวอักษร"""
    return re.sub(r"^_+|_+$", "", re.sub(r"[^a-z0-9]+", "_", word.lower()))

# คู่คำรูปแบบ ['english','ไทย'] หรือ ["english","ไทย"] — เอาเฉพาะฝั่งแรกที่เป็นอักษรละติน
# ⚠️ ต้องรับทั้ง 2 แบบ: vocab.js ใช้ single quote · js/data/band/*.js ใช้ double quote
#    (เดิม regex จับแต่ single quote → อ่าน band ได้ 0 คำ แล้วขึ้นว่า "ไม่มีคำใหม่" เหมือนสำเร็จ)
PAIR_RE = re.compile(r"""\[\s*(['"])([A-Za-z][A-Za-z0-9 \-']*)\1\s*,""")

def words_in(src: str) -> list[str]:
    return [m.group(2) for m in PAIR_RE.finditer(src)]

def extract_words() -> list[str]:
    seen, out = set(), []
    def add(words):
        n = 0
        for w in words:
            k = word_key(w)
            if k and k not in seen:
                seen.add(k)
                out.append(w)
                n += 1
        return n

    n_vocab = add(words_in(VOCAB.read_text(encoding="utf-8")))
    # คลังศัพท์ band — อ่านเฉพาะไฟล์ย่อยที่แยกช่วงคำ (*.js) ไม่แตะไฟล์ก้อนรวม .json
    n_band, n_files = 0, 0
    for f in sorted(BAND.glob("*.js")):
        n_band += add(words_in(f.read_text(encoding="utf-8")))
        n_files += 1
    # 📖 คำบนการ์ดในหนังสือ Picture Dictionary — รูปแบบ ["English","ไทย"] ตรงกับ PAIR_RE อยู่แล้ว
    n_pd = add(words_in(PICDICT.read_text(encoding="utf-8"))) if PICDICT.exists() else 0
    print(f"คำจาก vocab.js: {n_vocab} · จาก band/ ({n_files} ไฟล์): {n_band} · จากหนังสือภาพ: {n_pd} · รวมไม่ซ้ำ {len(out)}")
    if n_files and not n_band:
        print("  ⚠️ อ่าน band/ ได้ 0 คำ — รูปแบบไฟล์เปลี่ยนไปแล้ว? ตรวจ PAIR_RE ก่อนเจน", file=sys.stderr)
        sys.exit(1)
    return out

async def gen_one(sem: asyncio.Semaphore, path: Path, text: str, label: str) -> str:
    if path.exists() and path.stat().st_size > 0:
        return "skip"
    async with sem:
        for attempt in range(3):
            try:
                tmp = path.with_suffix(".tmp")
                await edge_tts.Communicate(text, VOICE, rate=RATE).save(str(tmp))
                tmp.replace(path)
                return "ok"
            except Exception as e:
                if attempt == 2:
                    print(f"  FAIL {label}: {e}", file=sys.stderr)
                    return "fail"
                await asyncio.sleep(1.5 * (attempt + 1))

async def main():
    words = extract_words()
    OUT.mkdir(parents=True, exist_ok=True)
    OUT_LETTERS.mkdir(parents=True, exist_ok=True)
    sem = asyncio.Semaphore(CONCURRENCY)
    jobs = [gen_one(sem, OUT / f"{word_key(w)}.mp3", w, w) for w in words]
    # ชื่อตัวอักษร A-Z — จุด "." ท้ายให้ TTS อ่านเป็นชื่อตัวอักษร (เอ บี ซี) ไม่ใช่คำ
    letters = [chr(c) for c in range(ord("a"), ord("z") + 1)]
    jobs += [gen_one(sem, OUT_LETTERS / f"{ch}.mp3", f"{ch.upper()}.", f"letter {ch}") for ch in letters]
    print(f"คำทั้งหมด {len(words)} + ตัวอักษร {len(letters)} · voice {VOICE} rate {RATE}")
    results = await asyncio.gather(*jobs)
    ok, skip, fail = (results.count(x) for x in ("ok", "skip", "fail"))
    print(f"done: generated {ok} · skipped(existing) {skip} · failed {fail}")
    if fail:
        sys.exit(1)

if __name__ == "__main__":
    asyncio.run(main())
