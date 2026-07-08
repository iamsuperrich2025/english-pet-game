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

- อ่านคำจาก js/data/vocab.js (VOCAB_BANDS ทุกระดับทุกหมวด)
- เขียน sound/words/<word>.mp3 (ชื่อไฟล์ = ตัวพิมพ์เล็ก, อักขระอื่นแทนด้วย _)
- ข้ามไฟล์ที่มีอยู่แล้ว → เพิ่มคำใหม่ใน vocab.js แล้วรันซ้ำได้เลย
"""
import asyncio, re, sys
from pathlib import Path

import edge_tts

VOICE = "en-US-JennyNeural"   # เสียงผู้หญิงอเมริกัน ชัด เป็นมิตร เหมาะสอนเด็ก
RATE  = "-15%"                # ช้าลงนิดให้เด็กฟังทัน
ROOT  = Path(__file__).resolve().parent.parent
VOCAB = ROOT / "js" / "data" / "vocab.js"
OUT   = ROOT / "sound" / "words"
CONCURRENCY = 6

def word_key(word: str) -> str:
    """ต้องตรงกับ wordAudioFile() ใน js/util.js ทุกตัวอักษร"""
    return re.sub(r"^_+|_+$", "", re.sub(r"[^a-z0-9]+", "_", word.lower()))

def extract_words() -> list[str]:
    src = VOCAB.read_text(encoding="utf-8")
    # คู่คำรูปแบบ ['english','ไทย'] — เอาเฉพาะฝั่งแรกที่เป็นอักษรละติน
    pairs = re.findall(r"\['([A-Za-z][A-Za-z0-9 \-']*)'\s*,\s*'", src)
    seen, out = set(), []
    for w in pairs:
        k = word_key(w)
        if k and k not in seen:
            seen.add(k)
            out.append(w)
    return out

async def gen_one(sem: asyncio.Semaphore, word: str) -> str:
    path = OUT / f"{word_key(word)}.mp3"
    if path.exists() and path.stat().st_size > 0:
        return "skip"
    async with sem:
        for attempt in range(3):
            try:
                tmp = path.with_suffix(".tmp")
                await edge_tts.Communicate(word, VOICE, rate=RATE).save(str(tmp))
                tmp.replace(path)
                return "ok"
            except Exception as e:
                if attempt == 2:
                    print(f"  FAIL {word}: {e}", file=sys.stderr)
                    return "fail"
                await asyncio.sleep(1.5 * (attempt + 1))

async def main():
    words = extract_words()
    OUT.mkdir(parents=True, exist_ok=True)
    print(f"words in vocab.js: {len(words)} · voice {VOICE} rate {RATE}")
    sem = asyncio.Semaphore(CONCURRENCY)
    results = await asyncio.gather(*(gen_one(sem, w) for w in words))
    ok, skip, fail = (results.count(x) for x in ("ok", "skip", "fail"))
    print(f"done: generated {ok} · skipped(existing) {skip} · failed {fail}")
    if fail:
        sys.exit(1)

if __name__ == "__main__":
    asyncio.run(main())
