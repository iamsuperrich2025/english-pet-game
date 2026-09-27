"use strict";
/* รอบ 1608: ระบบล็อกเป้าหมายกลางสำหรับ SLAM + ATTACK — แทนการเลื่อนลูกศรบนพื้นหาเป้าเอง
   - ล็อก "เป้าที่กล้องหันหน้าไปทางนั้น" อัตโนมัติ: ทั้งการกดปุ่ม และการหมุนกล้องซีกขวาของจอ
   - เป้าที่ล็อกได้ = ซอมบี้ + ผู้เล่นออนไลน์ + บอท (ยกเว้นตัวเอง)
   - ล็อกเดียวใช้ร่วมกันทั้งสองปุ่ม — runtime อ่าน targetLock.current ไปหันหน้าตัวละคร
     (เส้นไฟ SLAM ยิงตามทิศหน้าตัวละคร) และส่งพิกัดเป็น aim override ให้ลูกพลัง ATTACK
   - ตัววาด reticle เหนือหัวเป้าอยู่ที่ effects/aim-markers.js (อ่าน VF._t.lockView) */
(function(root){
  const VF = root.VocabForce = root.VocabForce || {};

  VF.TargetLockT = {
    MAX_DIST: 42,        /* ไกลสุดที่ล็อกได้ */
    ACQUIRE_DOT: 0.55,   /* กรวยตอนหาเป้าใหม่ (~56°) */
    KEEP_DOT: 0.2,       /* กรวยกว้างกว่าตอน "คงล็อก" (~78°) กันล็อกหลุดง่าย */
    RETARGET_MS: 220,    /* ถ้าไม่มีเป้า ลองหาใหม่ทุกช่วงนี้ */
    MIN_DIST: 2.0        /* ใกล้กว่านี้ = อยู่ในระยะหมัดอยู่แล้ว ไม่ต้องล็อก */
  };

  function TargetLock(){
    this.id = null;      /* id ของเป้าที่ล็อกอยู่ (จาก enemies/people) */
    this.kind = '';      /* 'zombie' | 'person' */
    this.current = null; /* ref สดของเป้า (อัปเดตทุกเฟรม) หรือ null */
    this._at = 0;
  }

  /* หาเป้าใหม่ในกรวยทิศกล้อง — เลือก dot สูงสุด (ตรงแนวสุด) */
  TargetLock.prototype._scan = function(player, camYaw, deps){
    const T = VF.TargetLockT;
    const fx = Math.sin(camYaw || 0), fz = Math.cos(camYaw || 0);
    const px = player.x || 0, pz = player.z || 0;
    let best = null, bestDot = T.ACQUIRE_DOT;
    const consider = function(c, kind){
      const dx = (c.x || 0) - px, dz = (c.z || 0) - pz;
      const dist = Math.hypot(dx, dz);
      if(dist < T.MIN_DIST || dist > T.MAX_DIST) return;
      const dot = (fx * dx + fz * dz) / dist;
      if(dot > bestDot){ bestDot = dot; best = {id: c.id, kind: kind}; }
    };
    const ens = deps.enemies && deps.enemies.list ? deps.enemies.list : [];
    for(let i = 0; i < ens.length; i++){
      const en = ens[i];
      if(!en || en.alive === false || en.state === 'gone') continue;
      consider(en, 'zombie');
    }
    const ppl = deps.people || [];
    for(let i = 0; i < ppl.length; i++){
      const p = ppl[i];
      if(!p || p.alive === false) continue;
      if(p.local && !p.bot) continue; /* ตัวเองไม่ล็อก */
      consider(p, 'person');
    }
    return best;
  };

  /* ไล่หา ref สดของ id ที่ล็อกไว้จากลิสต์ปัจจุบัน */
  TargetLock.prototype._find = function(deps){
    if(!this.id) return null;
    if(this.kind === 'zombie'){
      const ens = deps.enemies && deps.enemies.list ? deps.enemies.list : [];
      for(let i = 0; i < ens.length; i++){
        if(ens[i] && ens[i].id === this.id) return ens[i];
      }
      return null;
    }
    const ppl = deps.people || [];
    for(let i = 0; i < ppl.length; i++){
      if(ppl[i] && ppl[i].id === this.id) return ppl[i];
    }
    return null;
  };

  /* อัปเดตทุกเฟรม — force=true เมื่อผู้เล่นหมุนกล้อง (อยากล็อกทันทีตามมุมใหม่) */
  TargetLock.prototype.update = function(dt, player, camYaw, deps, now, force){
    this.current = null;
    if(!player || player.alive === false){ this.id = null; return; }
    deps = deps || {};
    now = now != null ? now : (VF.now ? VF.now() : 0);
    const T = VF.TargetLockT;
    const fx = Math.sin(camYaw || 0), fz = Math.cos(camYaw || 0);
    let cur = this._find(deps);
    if(cur && (cur.alive === false || cur.state === 'gone')) cur = null;
    if(cur){
      /* คงล็อกได้ในกรวยที่กว้างกว่า — แต่ห้ามไกลเกิน/อยู่ข้างหลัง */
      const dx = (cur.x || 0) - (player.x || 0), dz = (cur.z || 0) - (player.z || 0);
      const dist = Math.hypot(dx, dz);
      const dot = dist > 0.001 ? (fx * dx + fz * dz) / dist : 1;
      if(dist > T.MAX_DIST * 1.15 || dot < T.KEEP_DOT) cur = null;
    }
    if(!cur && (force || now >= this._at)){
      const got = this._scan(player, camYaw, deps);
      if(got){ this.id = got.id; this.kind = got.kind; cur = this._find(deps); }
      else this.id = null;
      this._at = now + T.RETARGET_MS;
    }else if(!cur){
      this.id = null;
    }
    this.current = cur;
  };

  /* คืน yaw ที่ต้องหันหน้าไปหาเป้าที่ล็อกอยู่ (หรือ null) */
  TargetLock.prototype.yawTo = function(player){
    const cur = this.current;
    if(!cur || !player) return null;
    return Math.atan2((cur.x || 0) - (player.x || 0), (cur.z || 0) - (player.z || 0));
  };

  VF.TargetLock = TargetLock;
})(typeof window !== 'undefined' ? window : globalThis);
