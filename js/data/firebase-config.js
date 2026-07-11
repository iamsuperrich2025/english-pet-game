"use strict";
/* ============================================================
   DATA: ค่าเชื่อมต่อ Firebase (ระบบออนไลน์ — เพื่อนจริง + Leaderboard)
   ------------------------------------------------------------
   ⚠️ ค่าชุดนี้เป็น "config สาธารณะ" ออกแบบมาให้ฝังในเว็บ client ได้
   ไม่ใช่รหัสผ่าน — ความปลอดภัยจริงคุมด้วย Security Rules ฝั่ง Firebase
   (โปรเจกต์: english-pet-game · Realtime DB: asia-southeast1)
   ถ้าลบไฟล์นี้/ค่าไม่ครบ → เกมเข้าโหมดออฟไลน์เอง (เพื่อนจำลอง) ไม่พัง */

const FIREBASE_CONFIG = {
  apiKey: "AIzaSyDqLbog7HOCZI25y8D4lYC8M8t9Y9zviFk",
  // รอบ 138: login จบในโดเมนเดียว — ผู้ใช้เพิ่ม vocabworld.web.app ใน OAuth client แล้ว (12 ก.ค. 2026:
  // Authorized JS origins + redirect URI /__/auth/handler) · Firebase Hosting เสิร์ฟ /__/auth/* ให้ทุก site อยู่แล้ว
  // ⚠️ ถ้าย้ายโดเมนอีกในอนาคต: ต้องเพิ่มโดเมนใหม่ทั้งใน Auth Authorized domains และ OAuth client ก่อนสลับค่านี้
  authDomain: "vocabworld.web.app",
  databaseURL: "https://english-pet-game-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "english-pet-game",
  storageBucket: "english-pet-game.firebasestorage.app",
  messagingSenderId: "735908908534",
  appId: "1:735908908534:web:d809d30f0a46a837ce8bd7"
};
