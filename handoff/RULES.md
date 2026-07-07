# RULES.md — Firebase Security Rules

> อ่านไฟล์นี้เมื่อ: แตะ Firebase / เพิ่มโซนใหม่ / ต้องส่ง rules ให้ผู้ใช้ publish
> **⚠️ กติกาผู้ใช้: ส่ง rules ให้ผู้ใช้ต้องส่ง "เต็มทั้งหน้า" เสมอ ห้ามส่งเฉพาะโซน** (คัดลอกทั้งก้อนไปวางทับใน Firebase console → Realtime Database → Rules → Publish)

**Firebase:** โปรเจกต์ `english-pet-game` (Google account ผู้ใช้ · Spark ฟรี) · RTDB `https://english-pet-game-default-rtdb.asia-southeast1.firebasedatabase.app` · console: https://console.firebase.google.com/project/english-pet-game/database
Claude แก้ rules เองไม่ได้ — ต้องส่งให้ผู้ใช้วาง · ทดสอบ allow/deny ผ่าน REST `<dbURL>/<path>.json` ได้ (โซนที่มี auth ต้องทดสอบผ่านหน้าเกมจริง/Emulator เพราะ REST ธรรมดาไม่มี token)

## สถานะการ publish
- ✅ `/presence` + `/leaderboard` (+ av/ni) + `/users` + `/friendCodes` + `/friendReq` + `/friends` + `/chats` — publish แล้ว
- ⚠️ **`/gifts` (ข้อ 0.5) — เพิ่มใน "รอบยี่สิบแปด" ยังไม่ publish** → ถ้าไม่ publish การส่งของขวัญจะถูก reject
- ⚠️ **`/world` + `/tinv` (โลก 3D multiplayer + คำเชิญ — รอบ 41) + c/ct แชทลอยหัว (รอบ 42) + `/rtc` (voice chat — รอบ 43) ยังไม่ publish** → ไม่ publish = ไม่เห็นผู้เล่นอื่น/คำชวน/แชทลอยหัว/เสียงพูดถูก reject ทั้งหมด
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
        ".validate": "$map === 'adv' || $map === 'haunt'",
        "$uid": {
          ".write": "auth != null && auth.uid === $uid",
          ".validate": "newData.hasChildren(['n','x','z','yaw','ts'])",
          "n":   { ".validate": "newData.isString() && newData.val().length >= 1 && newData.val().length <= 40" },
          "av":  { ".validate": "newData.isString() && newData.val().length <= 8" },
          "x":   { ".validate": "newData.isNumber()" },
          "z":   { ".validate": "newData.isNumber()" },
          "yaw": { ".validate": "newData.isNumber()" },
          "ts":  { ".validate": "newData.isNumber()" },
          "c":   { ".validate": "newData.isString() && newData.val().length >= 1 && newData.val().length <= 60" },
          "ct":  { ".validate": "newData.isNumber()" },
          "m":   { ".validate": "newData.isNumber()" },
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
          "map": { ".validate": "newData.isString() && (newData.val() === 'adv' || newData.val() === 'haunt')" },
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
            ".validate": "($map === 'adv' || $map === 'haunt') && newData.hasChildren(['f','t','d','ts'])",
            "f":  { ".validate": "newData.isString() && newData.val().length <= 128" },
            "t":  { ".validate": "newData.isString() && (newData.val() === 'offer' || newData.val() === 'answer' || newData.val() === 'ice')" },
            "d":  { ".validate": "newData.isString() && newData.val().length <= 8000" },
            "ts": { ".validate": "newData.isNumber()" },
            "$other": { ".validate": false }
          }
        }
      }
    },
    "class": {
      "$map": {
        ".read": "auth != null",
        ".validate": "$map === 'adv' || $map === 'haunt'",
        "muteAll": {
          ".write": "auth != null",
          ".validate": "newData.hasChildren(['on','by','ts'])",
          "on": { ".validate": "newData.isBoolean()" },
          "by": { ".validate": "newData.isString() && newData.val().length <= 40" },
          "ts": { ".validate": "newData.isNumber()" },
          "$other": { ".validate": false }
        },
        "$other": { ".validate": false }
      }
    }
  }
}
```

## หมายเหตุโครง /world + /tinv (โลก 3D multiplayer — รอบสี่สิบ)
- `/world/<map>/<uid> = {n, av, x, z, yaw, ts, c?, ct?}` — ตำแหน่งผู้เล่นใน map ('adv'|'haunt') · เขียนเองอ่านได้ทุกคนที่ login · onDisconnect ลบตัวเอง · ส่งถี่สุด ~5.5Hz เฉพาะตอนขยับ · **c/ct = แชทลอยหัว (รอบ 42)**: ข้อความ ≤60 + Date.now ฝั่งส่ง (คงที่ต่อข้อความ — ฝั่งรับเห็น ct เปลี่ยน = ข้อความใหม่ โชว์ 5 วิ) แนบไปกับ set ระหว่างยังสด ผ่านตัวกรอง nameHasBadWord ก่อนส่ง
- `/tinv/<toUid>/<fromUid> = {map, n, ts}` — คำเชิญเล่นโลก 3D ด้วยกัน · ผู้รับอ่านกล่องตัวเอง ผู้ส่ง/ผู้รับลบได้ · ฝั่งส่งจำใน state.tinvSent (เซฟ cloud) · เจอกันใน map จริงครั้งแรก → ต่างคนต่างรับเงินคืน TINV_CASHBACK (2,000) ฝั่ง client แล้วผู้รับลบคำเชิญ

## หมายเหตุโครง /class (ครูคุมห้อง — รอบ 44)
- `/class/<map>/muteAll = {on:bool, by:ชื่อครู, ts}` — สถานะ "ครูปิดเสียงทั้งห้อง" ค้างใน DB (เด็กเข้าทีหลังก็โดนล็อก) · ทุก client ฟัง on('value') → ล็อกปุ่มไมค์+ตัดไมค์ที่เปิดค้าง
- **บัญชีครู = อีเมลใน `TEACHER_EMAILS` (js/auth.js — เพิ่มอีเมลต่อท้าย array ได้)** เห็นปุ่ม 👩‍🏫 · ⚠️ rules ยอมให้ทุก auth เขียนได้ (UI ซ่อนปุ่มจากเด็ก) — ยอมรับระดับความเสี่ยงเดียวกับ coins ฝั่ง client · field `m` ใน /world = สถานะไมค์ (โชว์ 🎤 เหนือหัว)

## หมายเหตุโครง /rtc (voice chat — รอบ 43)
- `/rtc/<map>/<toUid>/<msgId> = {f:ผู้ส่ง, t:'offer'|'answer'|'ice', d:JSON(SDP/ICE ≤8000), ts}` — **signaling เท่านั้น เสียงจริงวิ่ง P2P (WebRTC) ไม่ผ่าน Firebase**
- ผู้รับอ่าน+ลบกล่องตัวเอง (ประมวลผลแล้วลบทันที + ล้างตอน join) · คนอื่น push ได้เฉพาะข้อความที่ `f` = uid ตัวเอง
- ฝั่งเกม: `Voice` ใน adventure3d.js — mesh ต่อสายเมื่อเจอกันใน map (uid น้อยกว่าเป็นผู้ offer) · STUN ของ Google ฟรี ไม่มี TURN (เน็ตมือถือบางเจ้าอาจต่อไม่ติด — ข้อจำกัดที่ยอมรับ) · ไมค์ default ปิดทุกครั้งที่เข้า

## หมายเหตุโครง /gifts (ข้อ 0.5)
- `/gifts/<toUid>/<fromUid>/<giftKey> = {k:'shop'|'collect', id, fn:ชื่อผู้ส่ง, ts, st:'pending'|'accepted'|'declined'}`
- ผู้รับอ่านทั้งกล่อง `/gifts/<toUid>` (auth.uid===toUid) · ผู้ส่งอ่าน-เขียนเฉพาะซับทรีตัวเอง `/gifts/<toUid>/<fromUid>` (เฝ้าสถานะ+คืนของ)
- คลัง collectible เป็น state ในเครื่อง (ไม่ได้อยู่ใน DB) → "คืนของ" ตอนถูกปฏิเสธ/หมดอายุ ทำที่ฝั่งผู้ส่ง (giftOutWatch) เมื่อผู้ส่งออนไลน์
