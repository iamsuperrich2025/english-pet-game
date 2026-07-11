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
  // รอบ 137: กลับมาใช้โดเมนกลางของโปรเจกต์ไปก่อน — รอบ 136 ลองใช้ vocabworld.web.app แล้วเจอ
  // redirect_uri_mismatch (โดเมนใหม่ต้องถูกเพิ่มใน OAuth client: Authorized redirect URIs ก่อน)
  // ⚠️ จะสลับเป็น vocabworld.web.app ได้เมื่อผู้ใช้เพิ่มใน Google Cloud Console → Clients แล้วเท่านั้น:
  //    JavaScript origins: https://vocabworld.web.app · Redirect URIs: https://vocabworld.web.app/__/auth/handler
  authDomain: "english-pet-game.firebaseapp.com",
  databaseURL: "https://english-pet-game-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "english-pet-game",
  storageBucket: "english-pet-game.firebasestorage.app",
  messagingSenderId: "735908908534",
  appId: "1:735908908534:web:d809d30f0a46a837ce8bd7"
};
