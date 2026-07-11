# RULES.md — Firebase Security Rules

> อ่านไฟล์นี้เมื่อ: แตะ Firebase / เพิ่มโซนใหม่ / ต้องส่ง rules ให้ผู้ใช้ publish
> **⚠️ กติกาผู้ใช้: ส่ง rules ให้ผู้ใช้ต้องส่ง "เต็มทั้งหน้า" เสมอ ห้ามส่งเฉพาะโซน** (คัดลอกทั้งก้อนไปวางทับใน Firebase console → Realtime Database → Rules → Publish)

**Firebase:** โปรเจกต์ `english-pet-game` (Google account ผู้ใช้ · Spark ฟรี) · RTDB `https://english-pet-game-default-rtdb.asia-southeast1.firebasedatabase.app` · console: https://console.firebase.google.com/project/english-pet-game/database
Claude แก้ rules เองไม่ได้ — ต้องส่งให้ผู้ใช้วาง · ทดสอบ allow/deny ผ่าน REST `<dbURL>/<path>.json` ได้ (โซนที่มี auth ต้องทดสอบผ่านหน้าเกมจริง/Emulator เพราะ REST ธรรมดาไม่มี token)

## สถานะการ publish
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
        "g":   { ".validate": "newData.isString() && newData.val().length <= 8" },
        "act": { ".validate": "newData.isString() && newData.val().length <= 60" },
        "at":  { ".validate": "newData.isNumber()" },
        "$other": { ".validate": false }
      }
    },
    "leaderboard": {
      ".read": true,
      ".indexOn": "coins",
      "$uid": {
        ".write": "auth != null && auth.uid === $uid",
        ".validate": "newData.hasChildren(['n','g','coins','at'])",
        "n":     { ".validate": "newData.isString() && newData.val().length >= 1 && newData.val().length <= 40" },
        "g":     { ".validate": "newData.isString() && newData.val().length <= 8" },
        "coins": { ".validate": "newData.isNumber() && newData.val() >= 0" },
        "av":    { ".validate": "newData.isNumber() && newData.val() >= 0" },
        "ni":    { ".validate": "newData.isNumber() && newData.val() >= 0" },
        "at":    { ".validate": "newData.isNumber()" },
        "$other": { ".validate": false }
      }
    },
    "friendCodes": {
      "$code": {
        ".read": true,
        ".write": "auth != null && newData.val() === auth.uid",
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
          "g":  { ".validate": "newData.isString() && newData.val().length <= 8" },
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
          "g":  { ".validate": "newData.isString() && newData.val().length <= 8" },
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
    "gifts": {
      "$toUid": {
        ".read": "auth != null && auth.uid === $toUid",
        "$fromUid": {
          ".read":  "auth != null && auth.uid === $fromUid",
          ".write": "auth != null && (auth.uid === $fromUid || auth.uid === $toUid)",
          "$giftKey": {
            ".validate": "newData.hasChildren(['k','id','fn','ts','st'])",
            "k":  { ".validate": "newData.isString() && (newData.val() === 'shop' || newData.val() === 'collect')" },
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
          "name": { ".validate": "newData.isString() && newData.val().length >= 2 && newData.val().length <= 20" }
        }
      }
    },
    "world": {
      "$map": {
        ".read": "auth != null",
        ".validate": "$map === 'adv' || $map === 'haunt' || $map === 'heli' || $map === 'drone' || $map === 'drive'",
        "$uid": {
          ".write": "auth != null && auth.uid === $uid",
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
          "$other": { ".validate": false }
        }
      }
    },
    "tinv": {
      "$toUid": {
        ".read": "auth != null && auth.uid === $toUid",
        "$fromUid": {
          ".write": "auth != null && (auth.uid === $fromUid || auth.uid === $toUid)",
          ".validate": "newData.hasChildren(['map','n','ts'])",
          "map": { ".validate": "newData.isString() && (newData.val() === 'adv' || newData.val() === 'haunt' || newData.val() === 'heli' || newData.val() === 'drone' || newData.val() === 'drive')" },
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
            ".write": "auth != null && newData.child('f').val() === auth.uid",
            ".validate": "($map === 'adv' || $map === 'haunt' || $map === 'heli' || $map === 'drone' || $map === 'drive') && newData.hasChildren(['f','t','d','ts'])",
            "f":  { ".validate": "newData.isString() && newData.val().length <= 128" },
            "t":  { ".validate": "newData.isString() && (newData.val() === 'offer' || newData.val() === 'answer' || newData.val() === 'ice')" },
            "d":  { ".validate": "newData.isString() && newData.val().length <= 8000" },
            "ts": { ".validate": "newData.isNumber()" },
            "$other": { ".validate": false }
          }
        }
      }
    },
    "market": {
      ".read": "auth != null",
      "$key": {
        ".write": "auth != null && ((!data.exists() && newData.child('sid').val() === auth.uid) || (data.exists() && !newData.exists()))",
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
          ".write": "auth != null && ((!data.exists() && newData.exists()) || (auth.uid === $uid && !newData.exists()))",
          ".validate": "newData.hasChildren(['id','p','bn','ts'])",
          "id": { ".validate": "newData.isString() && newData.val().length <= 40" },
          "p":  { ".validate": "newData.isNumber() && newData.val() >= 1" },
          "bn": { ".validate": "newData.isString() && newData.val().length >= 1 && newData.val().length <= 40" },
          "ts": { ".validate": "newData.isNumber()" },
          "$other": { ".validate": false }
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
- `/world/<map>/<uid> = {n, av, x, z, yaw, ts, c?, ct?, m?, w?}` — ตำแหน่งผู้เล่นใน map ('adv'|'haunt') · เขียนเองอ่านได้ทุกคนที่ login · onDisconnect ลบตัวเอง · ส่งถี่สุด ~5.5Hz เฉพาะตอนขยับ · **c/ct = แชทลอยหัว (รอบ 42)**: ข้อความ ≤60 + Date.now ฝั่งส่ง (คงที่ต่อข้อความ — ฝั่งรับเห็น ct เปลี่ยน = ข้อความใหม่ โชว์ 5 วิ) แนบไปกับ set ระหว่างยังสด ผ่านตัวกรอง nameHasBadWord ก่อนส่ง · **m = สถานะไมค์ (รอบ 44 — โชว์ 🎤 เหนือหัว)** · **w = จำนวนคำที่ประกอบได้รอบนี้ (รอบ 46 — กระดานคะแนนสด 🏆 มุมซ้ายบน)**
- `/tinv/<toUid>/<fromUid> = {map, n, ts}` — คำเชิญเล่นโลก 3D ด้วยกัน · ผู้รับอ่านกล่องตัวเอง ผู้ส่ง/ผู้รับลบได้ · ฝั่งส่งจำใน state.tinvSent (เซฟ cloud) · เจอกันใน map จริงครั้งแรก → ต่างคนต่างรับเงินคืน TINV_CASHBACK (2,000) ฝั่ง client แล้วผู้รับลบคำเชิญ

## หมายเหตุโครง /class (ครูคุมห้อง — รอบ 44 + พิธีแชมป์รอบ 48)
- `/class/<map>/muteAll = {on:bool, by:ชื่อครู, ts}` — สถานะ "ครูปิดเสียงทั้งห้อง" ค้างใน DB (เด็กเข้าทีหลังก็โดนล็อก) · ทุก client ฟัง on('value') → ล็อกปุ่มไมค์+ตัดไมค์ที่เปิดค้าง
- `/class/<map>/podium = {id:Date.now ฝั่งครู, by, ts, top:[{u,n,w}×≤3]}` — ครูกด 🏁 จบรอบแข่ง → ทุกเครื่องเห็นโพเดียม 🥇🥈🥉 + แตร + คนติดอันดับรับโบนัส 100/50/25 (เช็ก uid ตัวเอง) + sessionWords รีเซ็ตเริ่มรอบใหม่ · **ครูลบ node เองใน 15 วิ** + client กันเล่นซ้ำด้วย id ในหน่วยความจำ และไม่เล่นพิธีที่ id เก่ากว่า 5 นาที (ไม่ persist ใน state — เลี่ยงชนกับ session คู่ขนาน)
- **บัญชีครู = อีเมลใน `TEACHER_EMAILS` (js/auth.js — เพิ่มอีเมลต่อท้าย array ได้)** เห็นปุ่ม 👩‍🏫 · ⚠️ rules ยอมให้ทุก auth เขียนได้ (UI ซ่อนปุ่มจากเด็ก) — ยอมรับระดับความเสี่ยงเดียวกับ coins ฝั่ง client · field `m` ใน /world = สถานะไมค์ (โชว์ 🎤 เหนือหัว)

## หมายเหตุโครง /rtc (voice chat — รอบ 43)
- `/rtc/<map>/<toUid>/<msgId> = {f:ผู้ส่ง, t:'offer'|'answer'|'ice', d:JSON(SDP/ICE ≤8000), ts}` — **signaling เท่านั้น เสียงจริงวิ่ง P2P (WebRTC) ไม่ผ่าน Firebase**
- ผู้รับอ่าน+ลบกล่องตัวเอง (ประมวลผลแล้วลบทันที + ล้างตอน join) · คนอื่น push ได้เฉพาะข้อความที่ `f` = uid ตัวเอง
- ฝั่งเกม: `Voice` ใน adventure3d.js — mesh ต่อสายเมื่อเจอกันใน map (uid น้อยกว่าเป็นผู้ offer) · STUN ของ Google ฟรี ไม่มี TURN (เน็ตมือถือบางเจ้าอาจต่อไม่ติด — ข้อจำกัดที่ยอมรับ) · ไมค์ default ปิดทุกครั้งที่เข้า

## หมายเหตุโครง /market + /msold (ตลาดออนไลน์จริง — รอบ 124 · item 2)
- `/market/<key> = {sid:uid คนขาย, sn:ชื่อคนขาย, id:collectible, p:ราคา, ts}` — ลงขาย: push node ตัวเอง (sid ต้อง = auth.uid) · **ซื้อ/ถอน = ลบ node** (transaction คนแรกได้ · ลบ node คนอื่นได้ = กลไกซื้อ) · แก้ไข node ไม่ได้ (อยากเปลี่ยนราคา = ถอนแล้วลงใหม่)
- `/msold/<sellerUid>/<key> = {id, p, bn:ชื่อผู้ซื้อ, ts}` — ใบเสร็จจากผู้ซื้อ · คนขายอ่าน-ลบกล่องตัวเอง · ใครก็เขียนได้ (สร้างใหม่เท่านั้น) → **ฝั่งคนขายกันใบเสร็จปลอม 2 ชั้น:** จ่ายเฉพาะที่ตรง `netKey` ใน state.listings ตัวเอง + เช็กว่า `/market/<key>` หายไปแล้วจริง
- ฝั่งเกม: `marketWatch/marketList/marketUnlist/marketBuy/marketSoldWatch` (online.js) · ประกาศจริงมี `netKey` ใน state.listings — `marketTick` จำลองจะไม่แตะ · rules ยังไม่ publish → `Online.marketOk=false` เกมใช้ตลาดจำลองเดิมอัตโนมัติ

## หมายเหตุโครง /gifts (ข้อ 0.5)
- `/gifts/<toUid>/<fromUid>/<giftKey> = {k:'shop'|'collect', id, fn:ชื่อผู้ส่ง, ts, st:'pending'|'accepted'|'declined'}`
- ผู้รับอ่านทั้งกล่อง `/gifts/<toUid>` (auth.uid===toUid) · ผู้ส่งอ่าน-เขียนเฉพาะซับทรีตัวเอง `/gifts/<toUid>/<fromUid>` (เฝ้าสถานะ+คืนของ)
- คลัง collectible เป็น state ในเครื่อง (ไม่ได้อยู่ใน DB) → "คืนของ" ตอนถูกปฏิเสธ/หมดอายุ ทำที่ฝั่งผู้ส่ง (giftOutWatch) เมื่อผู้ส่งออนไลน์
