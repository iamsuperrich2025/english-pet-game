# บรีฟ Codex — ภาพและเสียงในเกม Vocab World

อ่านให้จบก่อนแตะไฟล์ใน `img/` `sound/` `clip/` ทุกครั้ง

## 0) บริบทโปรเจกต์
- โฟลเดอร์งาน: C:\Users\rober\english-pet-game — เว็บ vanilla JS/HTML/CSS ไม่มี build step (แก้ไฟล์แล้วรีเฟรชเห็นเลย)
- เว็บจริงที่เด็กเล่น: https://vocabworld.web.app (Firebase Hosting) + เป็น PWA มี service worker
- โฟลเดอร์ asset: img/ (ภาพ 2D + เทกซ์เจอร์ + img/models/*.glb), sound/ (เสียง), clip/ (วิดีโอสั้น .mp4)
- ผู้ใช้เป็นครู เจนภาพ/เสียง/โมเดลเองด้วย AI แล้ววางไฟล์ลงโฟลเดอร์เอง ไม่ใช่ไฟล์ที่ generate จากโค้ด
- ผู้ใช้สื่อสารภาษาไทย ให้ตอบไทย

## 1) กฎเหล็ก: ห้ามเขียนทับหรือลบไฟล์ asset ของผู้ใช้
- ไฟล์จำนวนมากใน img/ และ sound/ ไม่ได้ track ใน git (เฉพาะ img/ ตอนนี้ untracked ราว 100 ไฟล์) → ลบหรือเขียนทับแล้ว กู้จาก git ไม่ได้เลย
- ก่อนเขียน/ลบไฟล์ในโฟลเดอร์ asset ต้อง ls ดูก่อนเสมอว่ามีไฟล์จริงอยู่ไหม ถ้ามี ให้ถามผู้ใช้ก่อน ห้ามทับเงียบ ๆ
- ไฟล์ทดสอบหรือไฟล์ชั่วคราว ให้วางในโฟลเดอร์ temp/scratch แยก ห้ามวางทับ path จริงของเกม
- เก็บกวาดให้ลบเจาะจงเฉพาะไฟล์ที่ตัวเองสร้าง ห้าม rm -rf ทั้งโฟลเดอร์ที่อาจมีของผู้ใช้ปนอยู่
- ถือว่า img/ sound/ clip/ เป็น "ของครู" ส่วนโค้ดใน js/ เป็น "ของเรา"

## 2) ไฟล์จะขึ้นเว็บก็ต่อเมื่อ commit แล้วเท่านั้น (สาเหตุบั๊กยอดฮิต)
- tools/deploy_firebase.sh ดึงไฟล์ด้วย `git archive HEAD` เท่านั้น → ไฟล์ untracked/ยังไม่ commit จะไม่ขึ้นเว็บ
- อาการคลาสสิก: เปิด preview ในเครื่องเห็นภาพ แต่มือถือ/เว็บจริงขึ้น 404 หรือกลายเป็นอีโมจิ
- ผู้ใช้บอกว่า "วางภาพแล้วแต่ไม่ขึ้น" → อย่าเดา ให้ตรวจ 2 อย่างก่อน:
    ```
    git ls-files img/<path>            (ว่าง = ยังไม่ track)
    curl -I https://vocabworld.web.app/img/<path>
    ```
- แก้โดย git add เจาะจงไฟล์จริง (เลี่ยงโฟลเดอร์สำรอง เช่น img/ghosts_recovered/ และเลี่ยง git add -A)
- ผู้ใช้รันหลาย session พร้อมกัน → commit ต้อง pin pathspec เสมอ: `git commit -m "..." -- <path> [<path>...]` และตรวจ `git show --stat HEAD` ก่อน push
- deploy มีด่านกันลืม: tools/check_missing_assets.py ตรวจว่าไฟล์ที่ .html อ้างถึงมีอยู่ในชุดที่จะขึ้นเว็บจริงไหม ถ้าไม่มีจะ exit 2 หยุด deploy ทันที

## 3) แคช: เปลี่ยนภาพ/เสียง "ชื่อไฟล์เดิม" ต้องบัมพ์เวอร์ชันด้วย
- Firebase Hosting ตั้งค่า Cache-Control ไว้ว่า png/jpg/jpeg/webp/glb/mp3/ico = public, max-age=604800 (7 วัน) ส่วน js/css/html/json = no-cache
- แปลว่า ถ้าแทนที่ไฟล์ที่ path เดิม ผู้เล่นเก่าจะยังเห็น/ได้ยินของเดิมได้นานถึง 7 วัน
- ทางแก้ 2 ทาง เลือกอย่างใดอย่างหนึ่ง:
    - (ก) ตั้งชื่อไฟล์ใหม่ไปเลย (ปลอดภัยสุด)
    - (ข) เติม/บัมพ์ query string `?v=` ในโค้ดที่อ้างถึงไฟล์นั้น — ดูตัวอย่างตัวแปร `COLLECTIBLES_IMG_V` และ `GIFTS_IMG_V` ใน js/images.js
- service worker sw.js เป็นแบบ cache-first และมี `const CACHE_VERSION = 'pet-vocab-vNNN'` → ถ้าแตะไฟล์ที่ถูก precache (เช่น img/icons/*) ต้องบัมพ์เลขนี้ ไม่งั้นเครื่องที่เคยเปิดเกมจะไม่เห็นของใหม่
- เวลาจบรอบมีสคริปต์บัมพ์ให้: ใส่ออปชัน `--sw "โน้ต"` ตอนเรียก tools/finish_round.sh

## 4) ระบบภาพ: วางไฟล์ชื่อถูก = เกมเจอเอง ไม่ต้องแก้โค้ด
- js/images.js ตรวจภาพด้วย `new Image()` แบบ probe: โหลดได้ → เก็บ path, โหลดไม่ได้ → เก็บ null แล้วเกม fallback ไปใช้อีโมจิ/การ์ตูน CSS
- หลักการนี้ห้ามพัง: โค้ดใหม่ที่ใช้ภาพต้องทนกับกรณี "ไม่มีไฟล์" ได้เสมอ ห้าม throw หรือปล่อยจอว่าง
- กติกาไฟล์: PNG พื้นหลังโปร่งใส ภาพจัตุรัส (เช่น 1024x1024) ชื่อไฟล์ตัวพิมพ์เล็กทั้งหมด
- ชื่อไฟล์ที่ระบบรู้จัก:
    ```
    img/<pet>_<baby|adult>_<normal|happy|hungry|sick>.png     อารมณ์
    img/<pet>_<baby|adult>_<itemId>.png                        ใส่ไอเทม (หมวก แว่น ผ้าพันคอ ...)
    img/<pet>_<baby|adult>_normal_sleep.png                    ท่านอน
    img/<pet>_adult_<fat|thin|strong>.png                      รูปร่างตามการกิน
    img/rank/rank_<id>.png                                     เหรียญตราแรงค์
    img/home/home_<id>.png  (+ _decayed _ruined _dark _nowater) ที่พักตามสภาพ
    img/collectibles/collect_<id>.png                          ของสะสม (ใช้ ?v=)
    img/gifts/gift_<id>.png                                    ของขวัญ (ใช้ ?v=)
    ```
- ต้นฉบับความละเอียดเต็มให้เก็บในโฟลเดอร์ originals/ ข้างไฟล์จริง — .gitignore มี `**/originals/` อยู่แล้ว (ตั้งใจไม่ให้ขึ้นเว็บ)

## 5) ภาพหนัก โมเดล 3D และสไปรต์: ต้องย่อก่อนเข้าเกม
- เด็กเล่นบนมือถือ ห้ามส่งไฟล์ดิบขนาดหลาย MB ขึ้นเว็บ ให้ใช้เครื่องมือที่มีอยู่แล้ว อย่าเขียนสูตรใหม่เอง:
    ```
    python tools/pack_tex.py        PNG ก้อนใหญ่ → JPEG q85 (และย่อเป็น power-of-two ให้ เพราะ texture ที่ตั้ง RepeatWrapping บน WebGL1 ต้องเป็น POT ไม่งั้นภาพไม่ซ้ำ)
    python tools/shrink_matching.py ย่อแผ่นคำศัพท์ Picture Dictionary ให้ขึ้นเว็บได้
    python tools/slice_matching.py  ตัดแผ่นภาพสัตว์เป็นการ์ดเดี่ยว img/matching/cards/ + เขียนดัชนี js/data/matchpics.js
    python tools/pack_anim.py       ตัดขอบ + บีบแผ่นสไปรต์ที่อบมาเป็น .webp (ใช้ union bbox ห้ามตัดทีละเฟรม ไม่งั้นตัวละครเด้ง)
    bash  tools/lighten_glb.sh in.glb out_lite.glb [ratio] [error] [texSize]   ลดโพลี/ย่อเทกซ์เจอร์โมเดล
    ```
- โมเดล 3D จาก Tripo มักหนัก 10-60 MB → ห้ามเอาเข้าเกมตรง ๆ ให้ทำเป็น *_lite.glb แล้วใส่ต้นฉบับไว้ใน .gitignore (มีตัวอย่างในไฟล์ .gitignore แล้ว เช่น house_01.glb, ghost.glb, heli_ca.glb)
- แผ่นสไปรต์แอนิเมชันอบด้วย tools/bake_sprite.html แล้วเล่นบนเว็บด้วย CSS steps() — เบากว่าโหลดโมเดล 3D มาก

## 6) ระบบเสียง

### เสียงอ่านคำศัพท์ (ตัวหลักของเกม)
- ไฟล์อยู่ที่ `sound/words/<key>.mp3` ประมาณ 7,000 ไฟล์ เจนล่วงหน้าด้วย: `python tools/gen_word_audio.py` (ใช้ edge-tts เสียง en-US-JennyNeural, rate -15%)
- กติกาชื่อไฟล์ต้องตรงกับ `wordAudioFile()` ใน js/util.js เป๊ะ: word.toLowerCase() → แทน [^a-z0-9]+ ด้วย _ → ตัด _ หัวท้าย
- เพิ่มคำศัพท์ใหม่ (js/data/vocab.js, js/data/band/*.js, js/data/picdict_words.js) แล้วต้องรัน gen_word_audio.py ซ้ำเสมอ (สคริปต์ข้ามไฟล์ที่มีอยู่แล้ว) ไม่งั้นคำนั้นตกไปใช้ Web Speech API ซึ่งเสียงต่างกันทุกเบราว์เซอร์
- ระบบเสียงมี 2 ชั้น: ชั้น 1 ไฟล์ MP3 · ชั้น 2 Web Speech API เมื่อไม่มีไฟล์ — ห้ามลบชั้น 2 ทิ้ง
- กับดักสำคัญ: AbortError (เสียงใหม่ตัดเสียงเก่า) และ NotAllowedError (ยังไม่มี user gesture) ไม่ใช่ "ไฟล์หาย" ห้ามหมายหัวคำนั้นเป็น miss ดูฟังก์ชัน `speakCutOff()` ใน js/util.js

### เสียงอื่น
- ตัวอักษร A-Z: `sound/letters/<a-z>.mp3` (เจนจากสคริปต์เดียวกัน)
- เอฟเฟกต์/บรรยากาศ: `sound/cashier.mp3`, `sound/spark.mp3`, `sound/ghost/*`, `sound/helicopter/*`, `sound/moto/*` — ส่วนใหญ่ออกแบบ 2 ชั้นเหมือนกัน คือมีไฟล์ใช้ไฟล์ ไม่มีไฟล์ใช้เสียงสังเคราะห์ Web Audio ในโค้ด (ปลอดลิขสิทธิ์) ห้ามตัด fallback ออก
- เพลงพื้นหลัง js/music.js เริ่มเล่นได้หลัง user gesture แรกเท่านั้นตาม autoplay policy → โค้ดใหม่ที่เล่นเสียงต้องผูกกับการแตะ/คลิก และเคารพสวิตช์ปิดเสียง state.sound
- เทสต์เสียงเสร็จแล้วให้ปิด/รีโหลดหน้าให้เรียบร้อย อย่าปล่อยเสียงค้าง

## 7) คลิปวิดีโอน้อง
- ไฟล์: `clip/<pet>_<newborn|baby_normal|adult_normal>.mp4` · ตัวเล็กที่บีบแล้วอยู่ใน `clip/sm/`
- บีบด้วย `bash tools/compress_clips.sh` (สคริปต์เจนตาราง "ไฟล์เล็กสุดก่อน" ให้เกมเอง — ห้ามแก้ตารางด้วยมือ ให้รันสคริปต์ทับ)
- ไม่มีไฟล์ = ไม่ error เกมใช้การ์ตูน CSS แทน (ตรวจแบบลองเล่นก่อน ไม่ยิง HEAD)

## 8) คลัง prompt เจน asset
- ไฟล์ PROMPTS_*.md ที่รากโปรเจกต์ (~40 ไฟล์) คือคลัง prompt สำหรับเจนภาพ/เสียง/เพลง/โมเดลแยกตามหมวด เช่น PROMPTS.md (ภาพสัตว์), PROMPTS_GHOSTS.md, PROMPTS_SOUND.md, PROMPTS_MUSIC_SUNO.md, PROMPTS_MODELS_3D.md
- เพิ่ม asset หมวดไหน ให้ไปอ่าน/อัปเดต prompt ของหมวดนั้นด้วย เพื่อให้ครูเจนภาพชุดต่อไปได้สไตล์เดียวกัน
- กติกาในคลัง prompt: ชื่อไฟล์ต้องตรงเป๊ะ · PNG พื้นโปร่ง · เสียงจาก Suno ต้องติ๊ก Instrumental ห้ามมีเนื้อร้อง
- ไฟล์ .md, tools/, handoff/, store/ ถูกตัดออกจากชุดที่ deploy อยู่แล้ว ไม่ใช่ของผู้เล่น

## 9) จบงานอย่างไรให้ขึ้นเว็บจริง
- git push อย่างเดียว "เว็บไม่อัปเดต" เพราะเว็บอยู่บน Firebase Hosting ไม่ใช่ GitHub Pages
- จบรอบด้วยคำสั่งเดียว (อัปเดต HANDOFF.md ให้เสร็จก่อน):
    ```
    bash tools/finish_round.sh "รอบ NNN: สรุปสั้น ๆ" <ไฟล์ที่แก้ 1> <ไฟล์ที่แก้ 2> ...
    ```
  สคริปต์จะบัมพ์ version.json → commit แบบ pin pathspec → deploy → curl ยืนยันเลขเวอร์ชันบนเว็บจริง → commit handoff → push ให้ครบ
- ออปชัน: `--sw "โน้ต"` (บัมพ์ CACHE_VERSION ของ service worker) · `--no-deploy` (งานเอกสารล้วน) · `--dry` (ดูแผนเฉย ๆ)
- ห้ามให้ไฟล์รันได้ (.bat .cmd .exe .com .ps1 .dll) หลุดขึ้น Hosting — แผน Spark ห้าม ถ้ามีจะ deploy พังทั้งรอบ (สคริปต์ลบให้ชั้นหนึ่งแล้ว แต่อย่าเพิ่มใหม่เข้าไป)
- เพิ่ม asset ใหม่ทุกครั้ง ต้อง add ไฟล์นั้นเข้ารายการไฟล์ของ finish_round.sh ด้วย ไม่งั้นจะซ้ำรอยข้อ 2

## 10) ความปลอดภัยเด็ก และของต้องห้ามขึ้น repo
- เกมนี้เด็กประถมเล่น ภาพ/เสียง/คลิปต้องเหมาะกับเด็ก ไม่มีความรุนแรงสมจริง ไม่มีเนื้อร้องเพลงที่ไม่ได้ตรวจ
- ห้ามใส่ชื่อจริงหรือข้อมูลส่วนตัวของเด็กลงในภาพ ชื่อไฟล์ หรือ metadata ของ asset
- ห้ามขึ้น repo สาธารณะเด็ดขาด (อยู่ใน .gitignore แล้ว): `backups/` = ข้อมูลผู้เล่นเด็ก · `store/android/` = keystore สำหรับเซ็นแอป Play Store
- ถ้าเจอ asset ที่หนักผิดปกติหรือซ้ำซ้อนจนเปลืองพื้นที่/แบนด์วิดท์ ให้รายงานพร้อมตัวเลข อย่าลบเอง
