"use strict";
/* ============================================================
   Vocab World Home V2 — Admin Preview (R11.4 Visual Master Fidelity Reconstruction + Premium Depth / Composition Recovery)
   R12 / รอบ 1279 — Ultimate Visual Master scenic + composition rebuild
   R13 / รอบ 1280 — HUD, Bottom Rail and Left Navigation readability rebalance
   R18 / รอบ 1286 — Learning readability + safe New Word HUD lane
   R19 / รอบ 1287 — Exact six-world admin access matrix
   R20 / รอบ 1288 — Scrollable pet actions + mobile layout profiles
   R21 / รอบ 1289 — One-tap heal-all action in owned-pet sheet
   R22 / รอบ 1290 — Admin-only fantasy adventure dock
   R23 / รอบ 1291 — Bright child-friendly fantasy play dock + readable flyouts
   R24 / รอบ 1293 — Cute single-row learning rail; no pet-obscuring flyout
   R25 / รอบ 1294 — Bottom-button geometry reset + honest scroll cues
   R26 / รอบ 1295 — Full-card responsive paging; no clipped trailing button
   R27 / รอบ 1296 — Expanded player identity + full Thai date + restored pet pat gestures
   R28 / รอบ 1300 — Browser-verified HUD clearance + premium vivid learning rail
   R29 / รอบ 1305 — Clean visual hierarchy + true-aspect Global Feed frame
   ------------------------------------------------------------
   Additive UI shell only. It does NOT own economy, auth, quests,
   Firebase, purchases, or game routing. Existing Lobby DOM stays
   in place and existing buttons/functions remain authoritative.
   ============================================================ */
(function(){
  const ROOT_ID = 'vw-home-v2-root';
  const CLASS_ON = 'vw2-active';
  const SESSION_KEY = 'vwHomeV2PreviewClassic';
  const STYLE_ID = 'vw-home-v2-r114-runtime-style';
  let root = null;
  let classicToggle = null;
  let syncTimer = 0;
  let clockTimer = 0;
  let welcomeTimer = 0;
  let previewReportTimer = 0;
  let v2WasVisible = false;
  let latestOnlineUsers = [];
  let latestOnlineConnected = false;
  function adminAllowed(){
    try{ return typeof isAdmin === 'function' && isAdmin() === true; }
    catch(_){ return false; }
  }
  function adminWorldAllowed(){
    try{ return typeof isAdmin === 'function' && isAdmin() === true; }
    catch(_){ return false; }
  }
  function dashboard(){ return document.getElementById('screen-dashboard'); }
  function dashboardActive(){
    const el = dashboard();
    return !!(el && el.classList.contains('active'));
  }
  function previewWanted(){ return sessionStorage.getItem(SESSION_KEY) !== '1'; }
  function setPreviewWanted(on){
    if(on) sessionStorage.removeItem(SESSION_KEY);
    else sessionStorage.setItem(SESSION_KEY, '1');
    syncVisibility();
  }
  function cleanText(text, max){
    const out = String(text || '').replace(/\s+/g,' ').trim();
    return out.length > max ? out.slice(0, max - 1).trimEnd() + '…' : out;
  }
  function completeText(text, fallback=''){
    return String(text == null ? '' : text).replace(/\s+/g,' ').trim() || fallback;
  }
  function textOf(sel, fallback='—'){
    const el = document.querySelector(sel);
    const t = el ? cleanText(el.textContent, 180) : '';
    return t || fallback;
  }
  function htmlEscape(v){
    return String(v == null ? '' : v).replace(/[&<>"]/g, c=>({
      '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'
    })[c]);
  }
  function fmt(v){
    try{ return typeof fmtNum === 'function' ? fmtNum(v) : Number(v || 0).toLocaleString('th-TH'); }
    catch(_){ return String(v || 0); }
  }
  function fmtTopValue(v){
    const n = Number(v);
    if(!Number.isFinite(n)) return fmt(v);
    const a = Math.abs(n);
    /* R11.4 fidelity/readability rule: wide landscape HUDs have enough room for
       grouped values such as 10,000,005. Compact K/M/B/T is reserved for the
       tighter phone width or truly enormous values; important values never use
       ellipsis. */
    const wideLandscape = Math.max(window.innerWidth || 0, document.documentElement.clientWidth || 0) >= 820;
    if(wideLandscape && a < 1e11) return fmt(n);
    if(a < 100000) return fmt(n);
    const compact = (base, suffix)=>{
      const scaled = n / base;
      const absScaled = Math.abs(scaled);
      const digits = absScaled < 10 ? 2 : absScaled < 100 ? 1 : 0;
      return `${scaled.toFixed(digits)}${suffix}`;
    };
    if(a >= 1e12) return compact(1e12, 'T');
    if(a >= 1e9) return compact(1e9, 'B');
    if(a >= 1e6) return compact(1e6, 'M');
    return compact(1e3, 'K');
  }
  const ICON_ART = {
    coin:`<circle cx="32" cy="34" r="22" class="i-coin"/><ellipse cx="32" cy="28" rx="19" ry="15" class="i-coin-hi"/><path d="M24 34c3 5 13 5 16 0M30 24h4v20h-4z" class="i-line"/><path d="M23 28c4-5 14-6 19-1" class="i-line"/>`,
    chat:`<path d="M11 15c0-6 5-10 11-10h20c7 0 12 5 12 12v15c0 7-5 12-12 12H29L18 54l2-10c-5-1-9-5-9-11z" class="i-pink"/><circle cx="25" cy="26" r="3" class="i-dot"/><circle cx="38" cy="26" r="3" class="i-dot"/><path d="M25 34c4 3 10 3 14 0" class="i-line"/>`,
    music:`<path d="M22 15v28c0 5-4 9-10 9-5 0-8-3-8-7 0-5 4-8 10-8 2 0 4 0 5 1V20l30-7v24c0 6-5 10-10 10s-9-3-9-8 4-9 10-9c2 0 4 1 6 2V8z" class="i-purple"/><path d="M22 24l27-6" class="i-line"/>`,
    moon:`<path d="M45 48c-17 5-32-8-29-25 2-9 8-15 16-18-4 8-2 18 5 24 6 6 15 8 23 4-2 7-7 12-15 15z" class="i-blue"/><path d="M47 9l2 5 5 2-5 2-2 5-2-5-5-2 5-2zM13 40l1 3 3 1-3 1-1 3-1-3-3-1 3-1z" class="i-star"/>`,
    settings:`<path d="M26 8h12l2 7 7 3 6-3 6 10-5 5v8l5 5-6 10-7-3-6 3-2 7H26l-2-7-7-3-6 3-6-10 5-5v-8l-5-5 6-10 6 3 7-3z" class="i-mint"/><circle cx="32" cy="34" r="9" class="i-white"/><path d="M32 29v10M27 34h10" class="i-line"/>`,
    city:`<path d="M11 52V24h8v-9h9v9h8V12h9v12h8v28z" class="i-purple"/><path d="M7 27l12-12 13 12 13-15 12 15" class="i-roof"/><path d="M26 52V38h12v14M16 33h6M43 33h6" class="i-line"/><path d="M28 18l4-9 4 9" class="i-star"/>`,
    potion:`<path d="M25 6h14v8l-3 5v4c9 3 15 11 15 21 0 8-6 14-14 14H27c-8 0-14-6-14-14 0-10 6-18 15-21v-4l-3-5z" class="i-pink"/><path d="M20 37c8-4 18 4 28-1v10c0 6-4 9-10 9H27c-7 0-11-4-11-10 0-3 1-6 4-8z" class="i-blue"/><circle cx="27" cy="42" r="3" class="i-white"/><circle cx="38" cy="47" r="2" class="i-white"/><path d="M24 14h16" class="i-line"/>`,
    home:`<path d="M8 30L32 9l24 21v24H39V39H25v15H8z" class="i-peach"/><path d="M5 31L32 7l27 24" class="i-roof"/><path d="M25 54V39h14v15" class="i-line"/><path d="M43 19v-7h7v13" class="i-purple"/>`,
    invest:`<circle cx="19" cy="43" r="11" class="i-coin"/><circle cx="42" cy="47" r="9" class="i-coin"/><path d="M31 47V27c0-8 5-14 14-16-1 10-6 16-14 16-8 0-13-5-15-12 9 0 15 4 15 12" class="i-mint"/><path d="M31 26v21" class="i-line"/>`,
    gift:`<path d="M10 28h44v28H10z" class="i-pink"/><path d="M7 20h50v12H7z" class="i-purple"/><path d="M28 20c-9 0-14-4-14-9 0-4 3-7 7-7 6 0 10 8 11 16M36 20c9 0 14-4 14-9 0-4-3-7-7-7-6 0-10 8-11 16" class="i-mint"/><path d="M28 20h8v36h-8z" class="i-white"/>`,
    globe:`<circle cx="32" cy="32" r="25" class="i-blue"/><path d="M8 30h48M12 42h40M32 7c-8 8-11 17-11 25s3 18 11 25c8-7 11-17 11-25S40 15 32 7z" class="i-white-line"/><path d="M16 17c4 4 9 5 14 2M44 45c-5-3-10-2-14 1" class="i-mint-line"/>`,
    sparkle:`<path d="M31 4l5 15 15 5-15 5-5 15-5-15-15-5 15-5z" class="i-star"/><path d="M49 38l3 8 8 3-8 3-3 8-3-8-8-3 8-3zM13 39l2 5 5 2-5 2-2 5-2-5-5-2 5-2z" class="i-pink"/>`,
    quest:`<path d="M32 5l7 14 16 2-12 11 3 16-14-8-14 8 3-16L9 21l16-2z" class="i-star"/><circle cx="32" cy="30" r="8" class="i-white"/><path d="M29 30l3 3 6-7" class="i-line"/>`,
    friends:`<circle cx="24" cy="24" r="11" class="i-peach"/><circle cx="43" cy="27" r="9" class="i-blue"/><path d="M5 54c2-12 9-18 19-18 11 0 18 6 20 18z" class="i-pink"/><path d="M36 54c1-8 5-13 12-13 6 0 10 4 11 13z" class="i-purple"/><path d="M21 25c2 2 5 2 7 0M40 28c2 1 4 1 6 0" class="i-line"/>`,
    controller:`<path d="M17 24c5-5 25-5 30 0 7 7 11 27 2 31-5 2-10-6-13-10h-8c-4 4-9 12-14 10-9-4-5-24 3-31z" class="i-purple"/><path d="M20 34h12M26 28v12" class="i-line"/><circle cx="42" cy="31" r="3" class="i-pink"/><circle cx="48" cy="37" r="3" class="i-mint"/>`,
    book:`<path d="M9 11c9-3 17 0 23 6v38c-7-6-15-8-23-5z" class="i-blue"/><path d="M55 11c-9-3-17 0-23 6v38c7-6 15-8 23-5z" class="i-pink"/><path d="M32 17v38" class="i-line"/><path d="M15 22h10M15 29h10M39 22h10M39 29h10" class="i-white-line"/>`,
    crown:`<path d="M8 20l12 11 12-20 12 20 12-11-5 32H13z" class="i-coin"/><path d="M14 44h36M20 36h24" class="i-line"/><circle cx="20" cy="21" r="4" class="i-pink"/><circle cx="44" cy="21" r="4" class="i-blue"/>`,
    leaf:`<path d="M51 9C30 9 16 20 16 37c0 10 6 17 15 17 17 0 24-18 20-45z" class="i-mint"/><path d="M14 56c8-14 19-25 33-35M25 38c4 0 9 2 12 5" class="i-line"/>`,
    star:`<path d="M32 5l8 17 19 2-14 13 4 19-17-9-17 9 4-19L5 24l19-2z" class="i-star"/><path d="M25 31c4 4 10 4 14 0" class="i-line"/>`,
    edit:`<path d="M13 47l4-13L42 9c3-3 7-3 10 0l3 3c3 3 3 7 0 10L30 47l-13 4z" class="i-pink"/><path d="M39 12l13 13M17 34l13 13" class="i-white-line"/>`,
    back:`<path d="M28 14L10 32l18 18v-10h24V24H28z" class="i-blue"/><path d="M15 32h35" class="i-line"/>`,
    check:`<circle cx="32" cy="32" r="25" class="i-mint"/><path d="M19 32l9 9 18-20" class="i-white-line"/>`,
  };
  Object.assign(ICON_ART, {
    heart:`<path d="M32 54S8 41 8 23c0-9 6-15 14-15 5 0 8 2 10 6 3-4 6-6 11-6 8 0 14 6 14 15 0 18-25 31-25 31z" class="i-pink"/><path d="M18 31h8l4-9 5 18 4-9h8" class="i-white-line"/>`,
    factory:`<path d="M8 54V28l15 8V25l15 9V20l18 9v25z" class="i-blue"/><path d="M43 8h9l2 21H42z" class="i-purple"/><path d="M15 44h8M29 44h8M43 44h7" class="i-white-line"/><circle cx="49" cy="13" r="4" class="i-pink"/>`,
    search:`<circle cx="27" cy="27" r="16" class="i-blue"/><path d="M39 39l16 16" class="i-line"/><path d="M18 27c2-7 8-11 15-10" class="i-white-line"/><path d="M44 9l2 5 5 2-5 2-2 5-2-5-5-2 5-2z" class="i-star"/>`,
    typing:`<rect x="7" y="16" width="50" height="34" rx="9" class="i-purple"/><path d="M14 25h5M23 25h5M32 25h5M41 25h5M18 34h5M27 34h5M36 34h5M45 34h4M18 43h28" class="i-white-line"/><path d="M50 9l2 5 5 2-5 2-2 5-2-5-5-2 5-2z" class="i-star"/>`,
    bubble:`<circle cx="22" cy="38" r="15" class="i-blue"/><circle cx="39" cy="23" r="12" class="i-pink"/><circle cx="48" cy="42" r="8" class="i-mint"/><path d="M15 34c3-5 8-7 13-5M34 20c3-3 7-3 10-1" class="i-white-line"/>`,
    target:`<circle cx="30" cy="32" r="24" class="i-peach"/><circle cx="30" cy="32" r="16" class="i-white"/><circle cx="30" cy="32" r="8" class="i-pink"/><path d="M40 21l15-13-2 9 8 1-16 12z" class="i-purple"/><path d="M30 32l15-11" class="i-line"/>`,
    cannon:`<path d="M10 35h32l8 10H20z" class="i-purple"/><circle cx="22" cy="49" r="7" class="i-coin"/><circle cx="44" cy="49" r="7" class="i-coin"/><path d="M14 33l6-18 29 10-5 16z" class="i-blue"/><path d="M49 18l4-8 3 8 7 2-7 4-2 8-4-7-7-3z" class="i-star"/>`,
    exam:`<path d="M15 8h34v48H15z" class="i-blue"/><path d="M23 19h18M23 28h18M23 37h10" class="i-white-line"/><path d="M37 42l5 5 10-12" class="i-line"/><path d="M22 6h20v8H22z" class="i-peach"/>`,
    flag:`<path d="M16 8v48" class="i-line"/><path d="M18 11c10-6 20 7 31 0v24c-11 7-21-6-31 0z" class="i-peach"/><path d="M18 19h31M18 27h31" class="i-white-line"/><circle cx="33" cy="23" r="5" class="i-blue"/>`,
    market:`<path d="M10 25h44v31H10z" class="i-mint"/><path d="M7 23l6-14h38l6 14c-4 8-12 8-16 1-5 8-13 8-18 0-4 7-12 7-16-1z" class="i-pink"/><path d="M20 56V38h12v18M39 37h9v10h-9z" class="i-white"/><path d="M20 38h12" class="i-line"/>`,
    stats:`<path d="M10 53h44" class="i-line"/><rect x="14" y="32" width="9" height="19" rx="3" class="i-blue"/><rect x="28" y="22" width="9" height="29" rx="3" class="i-mint"/><rect x="42" y="13" width="9" height="38" rx="3" class="i-pink"/><path d="M14 25l11-8 10 3 15-13" class="i-roof"/>`,
    trophy:`<path d="M20 8h24v12c0 13-5 22-12 22s-12-9-12-22z" class="i-coin"/><path d="M18 13H8c0 14 6 20 16 19M46 13h10c0 14-6 20-16 19" class="i-roof"/><path d="M32 42v8M22 56h20M25 50h14" class="i-line"/><path d="M32 15l3 6 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1z" class="i-white"/>`,
    picture:`<rect x="7" y="11" width="50" height="42" rx="8" class="i-blue"/><circle cx="42" cy="23" r="6" class="i-star"/><path d="M12 47l14-16 8 8 7-9 12 17z" class="i-mint"/><path d="M15 18h10" class="i-white-line"/>`,
    headphones:`<path d="M11 34c0-15 9-25 21-25s21 10 21 25" class="i-roof"/><rect x="8" y="31" width="12" height="21" rx="6" class="i-pink"/><rect x="44" y="31" width="12" height="21" rx="6" class="i-blue"/><path d="M50 50c-2 5-7 7-14 7" class="i-line"/><circle cx="33" cy="57" r="4" class="i-mint"/>`,
    clipboard:`<path d="M14 12h36v45H14z" class="i-peach"/><path d="M24 7h16v10H24z" class="i-purple"/><path d="M22 27h20M22 36h20M22 45h13" class="i-white-line"/><circle cx="46" cy="45" r="8" class="i-mint"/><path d="M42 45l3 3 5-6" class="i-line"/>`,
    logout:`<path d="M12 10h27v44H12z" class="i-blue"/><path d="M31 32h28M48 21l11 11-11 11" class="i-roof"/><circle cx="20" cy="32" r="3" class="i-white"/>`,
    bell:`<path d="M17 43h30l-5-7V24c0-7-4-12-10-12s-10 5-10 12v12z" class="i-star"/><path d="M27 48c1 5 9 5 10 0" class="i-line"/><path d="M46 15l3-6 3 6 6 2-6 3-3 6-3-6-6-3z" class="i-pink"/>`,
    bookgold:`<path d="M8 12c9-4 18-1 24 6v37c-7-6-15-8-24-5z" class="i-coin"/><path d="M56 12c-9-4-18-1-24 6v37c7-6 15-8 24-5z" class="i-peach"/><path d="M32 18v37M15 25h11M38 25h11" class="i-white-line"/>`,
    computer:`<rect x="8" y="11" width="48" height="34" rx="7" class="i-blue"/><rect x="14" y="17" width="36" height="22" rx="4" class="i-white"/><path d="M25 51h14M30 44v7M34 44v7" class="i-line"/><circle cx="45" cy="21" r="8" class="i-coin"/><path d="M42 21h6M45 18v6" class="i-line"/>`,
    camera:`<path d="M12 22h9l4-7h14l4 7h9c4 0 7 3 7 7v20c0 4-3 7-7 7H12c-4 0-7-3-7-7V29c0-4 3-7 7-7z" class="i-purple"/><circle cx="32" cy="39" r="12" class="i-white"/><circle cx="32" cy="39" r="7" class="i-blue"/><path d="M15 29h8M49 29h4" class="i-white-line"/><path d="M49 11l2 5 5 2-5 2-2 5-2-5-5-2 5-2z" class="i-star"/>`,
    racecar:`<path d="M9 38l7-16h28l9 16 5 4v9H6v-9z" class="i-blue"/><path d="M20 24h20l5 11H15z" class="i-white"/><path d="M17 30h12v7H14zM35 30h9l4 7H35z" class="i-purple"/><circle cx="17" cy="50" r="7" class="i-coin"/><circle cx="47" cy="50" r="7" class="i-coin"/><circle cx="17" cy="50" r="3" class="i-line"/><circle cx="47" cy="50" r="3" class="i-line"/><path d="M8 18h10M4 12h16M49 15h10" class="i-roof"/><path d="M50 8h10v12H50zM50 8h5v6h-5M55 14h5v6h-5" class="i-white-line"/>`,
    install:`<rect x="13" y="7" width="38" height="50" rx="9" class="i-blue"/><rect x="18" y="12" width="28" height="35" rx="5" class="i-white"/><path d="M32 17v20M24 29l8 8 8-8" class="i-line"/><circle cx="32" cy="51" r="2.5" class="i-mint"/>`,
  });
  Object.assign(ICON_ART, {
    adventure:`<path d="M9 55V29h10V18h8v11h9V14h9v15h10v26z" class="i-purple"/><path d="M14 29l9-9 9 9 9-13 10 13" class="i-roof"/><path d="M27 55V42h11v13M14 38h7M44 38h7" class="i-white-line"/><path d="M22 55c3-8 8-13 16-16 5-2 10-2 16-1" class="i-coin"/>`,
    skyplay:`<path d="M13 39c-6 0-10-4-10-9 0-6 5-10 11-10 2-8 8-13 16-13 9 0 16 6 17 15 7 0 12 4 12 10 0 5-4 8-10 8z" class="i-blue"/><path d="M24 34v17M43 34v17M24 37h19" class="i-line"/><path d="M28 50h11l-2 6h-7z" class="i-pink"/><path d="M12 26c5-4 10-5 15-3" class="i-white-line"/>`,
    ghost:`<path d="M16 54V30C16 17 23 8 32 8s16 9 16 22v24l-8-6-8 7-8-7z" class="i-purple"/><circle cx="26" cy="29" r="4" class="i-white"/><circle cx="39" cy="29" r="4" class="i-white"/><circle cx="27" cy="29" r="2" class="i-line"/><circle cx="40" cy="29" r="2" class="i-line"/><path d="M27 40c3-3 7-3 10 0" class="i-white-line"/>`,
    helicopter:`<path d="M17 28h24c8 0 14 5 14 12H25c-8 0-13-4-13-9 0-2 2-3 5-3z" class="i-blue"/><path d="M43 31l12-12h5L53 38M12 32H5M24 42l-4 8M45 42l4 8M17 50h8M44 50h9" class="i-line"/><path d="M29 18v10M12 17h36" class="i-roof"/><rect x="26" y="31" width="12" height="7" rx="3" class="i-white"/>`,
    drone:`<circle cx="13" cy="20" r="8" class="i-blue"/><circle cx="51" cy="20" r="8" class="i-blue"/><circle cx="13" cy="46" r="8" class="i-pink"/><circle cx="51" cy="46" r="8" class="i-pink"/><path d="M19 24l9 6M45 24l-9 6M19 42l9-6M45 42l-9-6" class="i-line"/><rect x="25" y="26" width="14" height="14" rx="5" class="i-purple"/><circle cx="32" cy="34" r="4" class="i-white"/>`,
    soccer:`<circle cx="32" cy="32" r="25" class="i-white"/><path d="M32 19l8 6-3 10H27l-3-10z" class="i-purple"/><path d="M32 7v12M11 20l13 5M53 20l-13 5M16 49l11-14M48 49L37 35M18 55l-2-6M46 55l2-6" class="i-line"/><path d="M13 18l5-8 10-2M51 18l-5-8-10-2" class="i-blue"/>`,
    motorcycle:`<circle cx="16" cy="47" r="10" class="i-blue"/><circle cx="49" cy="47" r="10" class="i-blue"/><circle cx="16" cy="47" r="4" class="i-white"/><circle cx="49" cy="47" r="4" class="i-white"/><path d="M16 47l11-16h12l10 16M26 31l8 16M25 40h17" class="i-line"/><path d="M27 24h13l6 7H27z" class="i-pink"/><path d="M41 22h9M47 22l4 7" class="i-roof"/>`,
    mothership:`<path d="M9 35c5-12 14-18 23-18s18 6 23 18c-5 8-14 12-23 12S14 43 9 35z" class="i-purple"/><path d="M22 20c2-8 6-12 10-12s8 4 10 12z" class="i-blue"/><ellipse cx="32" cy="35" rx="25" ry="8" class="i-peach"/><circle cx="19" cy="36" r="3" class="i-white"/><circle cx="32" cy="38" r="3" class="i-white"/><circle cx="45" cy="36" r="3" class="i-white"/><path d="M25 47l-5 10M32 48v11M39 47l5 10" class="i-mint-line"/>`,
    mecha:`<rect x="17" y="10" width="30" height="25" rx="8" class="i-blue"/><rect x="20" y="37" width="24" height="18" rx="5" class="i-purple"/><path d="M17 41H8v11M47 41h9v11M25 55v6M39 55v6M32 10V5" class="i-line"/><circle cx="25" cy="22" r="4" class="i-white"/><circle cx="39" cy="22" r="4" class="i-white"/><path d="M25 30h14" class="i-white-line"/><path d="M27 42l5 5 5-5" class="i-star"/>`,
    pinboard:`<rect x="10" y="8" width="44" height="48" rx="7" class="i-peach"/><rect x="15" y="13" width="34" height="38" rx="4" class="i-white"/><circle cx="23" cy="27" r="7" class="i-pink"/><circle cx="41" cy="27" r="7" class="i-blue"/><circle cx="32" cy="43" r="7" class="i-coin"/><path d="M20 34l-2 10 5-3 5 3-2-10M38 34l-2 10 5-3 5 3-2-10M29 50l-2 7 5-3 5 3-2-7" class="i-line"/>`,
  });
  function icon(name, extra=''){
    const art = ICON_ART[name] || ICON_ART.sparkle;
    return `<svg class="vw2-icon ${htmlEscape(extra)}" viewBox="0 0 64 64" aria-hidden="true" focusable="false">
      <circle cx="32" cy="32" r="29" class="i-sticker"/>
      <ellipse cx="27" cy="20" rx="17" ry="10" class="i-gloss"/>
      ${art}
      <path d="M53 8l2 5 5 2-5 2-2 5-2-5-5-2 5-2z" class="i-mini-star"/>
    </svg>`;
  }
  function gradeIdentityKind(raw){
    const grade = cleanText(raw, 48).toLowerCase();
    if(!grade) return 'neutral';
    if(/สูงกว่า\s*ปริญญาตรี|ปริญญาโท|ปริญญาเอก/.test(grade)) return 'neutral';
    if(/ปริญญาตรี|ป\.\s*ตรี|bachelor/.test(grade)) return 'bachelor';
    if(/มัธยม|ม\.\s*[1-6](?:\D|$)|secondary/.test(grade)) return 'secondary';
    if(/ต่ำกว่า\s*ประถม/.test(grade)) return 'neutral';
    if(/ประถม|ป\.\s*[1-6](?:\D|$)|primary/.test(grade)) return 'primary';
    return 'neutral';
  }
  function gradeIdentityHTML(rawGrade, legacyText){
    const actual = cleanText(rawGrade, 28) || cleanText(legacyText, 34) || 'ระดับชั้น —';
    const kind = gradeIdentityKind(rawGrade || legacyText);
    const safe = htmlEscape(actual);
    if(kind === 'primary'){
      return `<span class="vw2-grade-identity primary"><span class="vw2-grade-symbol" aria-hidden="true"><svg viewBox="0 0 64 64"><path d="M32 5l8 17 19 2-14 13 4 19-17-9-17 9 4-19L5 24l19-2z"/></svg></span><span class="vw2-grade-copy"><strong>${safe}</strong><small>ดาวเงิน · ประถม</small></span></span>`;
    }
    if(kind === 'secondary'){
      return `<span class="vw2-grade-identity secondary"><span class="vw2-grade-symbol" aria-hidden="true"><svg viewBox="0 0 64 64"><path d="M32 5l8 17 19 2-14 13 4 19-17-9-17 9 4-19L5 24l19-2z"/></svg></span><span class="vw2-grade-copy"><strong>${safe}</strong><small>ดาวทอง · มัธยม</small></span></span>`;
    }
    if(kind === 'bachelor'){
      return `<span class="vw2-grade-identity bachelor"><span class="vw2-grade-symbol" aria-hidden="true"><svg viewBox="0 0 64 64"><path d="M17 11h30l11 15-26 31L6 26z"/><path d="M17 11l15 46 15-46M6 26h52L32 11z" class="vw2-grade-gem-line"/></svg></span><span class="vw2-grade-copy"><strong>${safe}</strong><small>เพชร 1 ดวง · ปริญญาตรี</small></span></span>`;
    }
    return `<span class="vw2-grade-identity neutral"><span class="vw2-grade-copy"><strong>${safe}</strong></span></span>`;
  }
  function mascotDragon(){
    return `<svg class="vw2-dragon-art" viewBox="0 0 220 220" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id="vw2dg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#aaf3dc"/><stop offset="1" stop-color="#59caa8"/></linearGradient>
        <linearGradient id="vw2wing" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#d8c8ff"/><stop offset="1" stop-color="#9e82ed"/></linearGradient>
      </defs>
      <ellipse cx="110" cy="198" rx="61" ry="14" fill="#7761b5" opacity=".18"/>
      <path d="M58 95C31 77 26 111 45 129c10 9 24 7 37-2z" fill="url(#vw2wing)" stroke="#fff" stroke-width="6"/>
      <path d="M162 95c27-18 32 16 13 34-10 9-24 7-37-2z" fill="url(#vw2wing)" stroke="#fff" stroke-width="6"/>
      <path d="M85 62l-16-26 26 13M135 62l16-26-26 13" fill="#ffd7a7" stroke="#fff" stroke-width="6" stroke-linejoin="round"/>
      <path d="M78 126c-18 26-14 62 8 75 17 10 55 10 72-5 19-18 16-50-5-72z" fill="url(#vw2dg)" stroke="#fff" stroke-width="7"/>
      <ellipse cx="113" cy="158" rx="31" ry="37" fill="#fff3c9" opacity=".95"/>
      <path d="M79 139c-18 7-25 22-18 30 6 7 19 1 28-10M148 139c18 7 25 22 18 30-6 7-19 1-28-10" fill="none" stroke="#57b99d" stroke-width="13" stroke-linecap="round"/>
      <ellipse cx="110" cy="95" rx="66" ry="56" fill="url(#vw2dg)" stroke="#fff" stroke-width="8"/>
      <path d="M87 55l8-18 10 19M116 53l10-18 9 20" fill="#8fe2c6" stroke="#fff" stroke-width="5" stroke-linejoin="round"/>
      <ellipse cx="84" cy="96" rx="17" ry="21" fill="#283653"/><ellipse cx="137" cy="96" rx="17" ry="21" fill="#283653"/>
      <circle cx="79" cy="89" r="7" fill="#fff"/><circle cx="132" cy="89" r="7" fill="#fff"/><circle cx="89" cy="104" r="3" fill="#fff" opacity=".8"/><circle cx="142" cy="104" r="3" fill="#fff" opacity=".8"/>
      <ellipse cx="65" cy="119" rx="13" ry="7" fill="#ff9fbd" opacity=".7"/><ellipse cx="155" cy="119" rx="13" ry="7" fill="#ff9fbd" opacity=".7"/>
      <path d="M101 116c5 5 13 5 18 0M104 126c5 6 14 6 20 0" fill="none" stroke="#4b6b69" stroke-width="4" stroke-linecap="round"/>
      <path d="M107 150h11M106 161h13M106 173h13" stroke="#e7c887" stroke-width="4" stroke-linecap="round" opacity=".75"/>
      <path d="M82 193c-5 14 16 15 27 4M139 193c5 14-16 15-27 4" fill="#8fe2c6" stroke="#fff" stroke-width="5"/>
      <path d="M50 68l4 11 11 4-11 4-4 11-4-11-11-4 11-4zM169 54l3 8 8 3-8 3-3 8-3-8-8-3 8-3z" fill="#ffe47c" stroke="#fff" stroke-width="2"/>
    </svg>`;
  }
  function knightFallback(){
    return `<svg class="vw2-knight-art" viewBox="0 0 100 120" aria-hidden="true" focusable="false">
      <path d="M25 45V30c0-19 50-19 50 0v15" fill="#dfe9f3" stroke="#fff" stroke-width="6"/>
      <path d="M21 40h58v20H21z" fill="#becce0" stroke="#fff" stroke-width="5"/>
      <path d="M31 55c0-14 38-14 38 0v17c0 17-38 17-38 0z" fill="#ffd7bd" stroke="#fff" stroke-width="5"/>
      <circle cx="43" cy="62" r="4" fill="#2b344b"/><circle cx="58" cy="62" r="4" fill="#2b344b"/><path d="M44 70c4 3 9 3 13 0" fill="none" stroke="#ae6273" stroke-width="3" stroke-linecap="round"/>
      <path d="M31 82h38l10 33H21z" fill="#6a8be8" stroke="#fff" stroke-width="5"/>
      <path d="M50 86l8 12-8 9-8-9z" fill="#ffd75f"/><path d="M34 30l6-13 6 13M54 29l7-14 5 15" fill="#c5d4e8" stroke="#fff" stroke-width="4"/>
    </svg>`;
  }
  function castleArtwork(){
    return `<svg class="vw2-castle-art" viewBox="0 0 320 250" aria-hidden="true" focusable="false">
      <defs><linearGradient id="vw2cg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff5ff"/><stop offset="1" stop-color="#bba2ff"/></linearGradient></defs>
      <ellipse cx="165" cy="227" rx="132" ry="18" fill="#7d6db7" opacity=".13"/>
      <path d="M45 218v-92h45v-38h39v38h50V65h44v61h49v92z" fill="url(#vw2cg)" stroke="#fff" stroke-width="8" stroke-linejoin="round"/>
      <path d="M39 128l28-35 28 35M92 90l17-34 18 34M160 67l21-43 22 43M213 128l31-39 30 39" fill="#ffb9dc" stroke="#fff" stroke-width="7" stroke-linejoin="round"/>
      <path d="M164 218v-58h34v58M65 151h16v20H65zM107 145h17v21h-17zM225 151h17v20h-17z" fill="#8fdcf7" stroke="#fff" stroke-width="5"/>
      <path d="M180 26v-17l24 8-24 8" fill="#ffd858" stroke="#fff" stroke-width="4"/>
      <circle cx="54" cy="188" r="30" fill="#ff9fce" opacity=".8"/><circle cx="35" cy="203" r="22" fill="#f7b3dc"/><circle cx="279" cy="190" r="34" fill="#ffabd4"/><circle cx="298" cy="207" r="23" fill="#f8c0e2"/>
      <path d="M52 178v48M279 176v50" stroke="#9b7f6d" stroke-width="7" stroke-linecap="round"/>
      <path d="M14 92l3 8 8 3-8 3-3 8-3-8-8-3 8-3zM292 83l4 10 10 4-10 4-4 10-4-10-10-4 10-4z" fill="#ffe56f" stroke="#fff" stroke-width="2"/>
    </svg>`;
  }
  function sourceAttrs(sourceSelector, mirrorVisibility=false){
    if(!sourceSelector) return '';
    return ` data-vw2-source="${htmlEscape(sourceSelector)}"${mirrorVisibility ? ' data-vw2-mirror-visibility="1"' : ''}`;
  }
  const ADMIN_ONLY_WORLD_ACTIONS = new Set([
    'worldAdv','worldSky','worldDrive','worldMoto','worldInvasion','worldMecha'
  ]);
  function navButton(actionName, iconName, label, sourceSelector=''){
    const adminOnly = ADMIN_ONLY_WORLD_ACTIONS.has(actionName);
    return `<button class="vw2-rail-btn vw2-rail-${htmlEscape(actionName)}" data-vw2-action="${htmlEscape(actionName)}"${adminOnly ? ' data-vw2-admin-only-world="1"' : ''}${sourceAttrs(sourceSelector)}><span class="vw2-rail-art"><span class="vw2-rail-scene" aria-hidden="true"><i></i></span>${icon(iconName)}<span class="vw2-rail-scene-mark" aria-hidden="true"></span></span><b class="vw2-rail-label">${htmlEscape(label)}</b><i class="vw2-source-badge" hidden></i></button>`;
  }
  function bottomButton(actionName, iconName, label, tone='violet', sourceSelector=''){
    return `<button class="vw2-mode ${htmlEscape(tone)}" data-vw2-action="${htmlEscape(actionName)}"${sourceAttrs(sourceSelector)}><span>${icon(iconName)}</span><b>${htmlEscape(label)}</b><i class="vw2-source-badge" hidden></i></button>`;
  }
  function toolButton(actionName, iconName, label, extra='', sourceSelector='', mirrorVisibility=false){
    return `<button class="vw2-tool-btn ${htmlEscape(extra)}" data-vw2-action="${htmlEscape(actionName)}"${sourceAttrs(sourceSelector, mirrorVisibility)} title="${htmlEscape(label)}"><span>${icon(iconName)}</span><b>${htmlEscape(label)}</b><i class="vw2-source-badge" hidden></i></button>`;
  }
  function walletArtwork(kind){
    if(kind === 'coin'){
      return `<span class="vw2-stat-art vw2-stat-art-coin"><img class="vw2-stat-coin-img" src="img/coins/coin_gold.png" alt="" decoding="async"></span>`;
    }
    const iconName = kind === 'today' ? 'star'
      : kind === 'online' ? 'globe'
      : kind === 'computer' ? 'computer'
      : kind === 'worth' ? 'stats'
      : 'sparkle';
    return `<span class="vw2-stat-art">${icon(iconName)}</span>`;
  }
  function currentHouseVisual(){
    try{
      if(typeof state === 'undefined' || !state || !state.home || typeof homeInfo !== 'function'){
        return {id:'', name:'ยังไม่มีที่พัก', variant:'none', url:''};
      }
      const h = homeInfo(state.home);
      if(!h) return {id:'', name:'ยังไม่มีที่พัก', variant:'none', url:''};
      /* Mirror the authoritative Classic renderer for the variants that exist
         in the current repository: power cut -> _dark, then maintenance decay
         -> _decayed, otherwise normal. img/home was dependency-verified by the
         R3 task exporter before this patch was authored. */
      let variant = 'normal';
      if(state.powerCut) variant = 'dark';
      else if(typeof homeDecayed === 'function' && homeDecayed()) variant = 'decayed';
      const suffix = variant === 'normal' ? '' : `_${variant}`;
      const key = `home_${h.id}${suffix}`;
      let url = `img/home/${key}.png`;
      try{
        if(typeof IMG_FILES !== 'undefined' && IMG_FILES && IMG_FILES[key]) url = IMG_FILES[key];
      }catch(_){ }
      return {id:h.id, name:h.name || h.id, variant, url};
    }catch(_){
      return {id:'', name:'ยังไม่มีที่พัก', variant:'none', url:''};
    }
  }
  function syncHouseVisual(){
    const box = document.getElementById('vw2-house-visual');
    if(!box) return;
    const h = currentHouseVisual();
    box.dataset.home = h.id || '';
    box.dataset.variant = h.variant || 'none';
    box.classList.toggle('is-empty', !h.url);
    const label = document.getElementById('vw2-house-label');
    if(label) label.textContent = h.url ? h.name : 'ยังไม่มีบ้าน';
    if(!h.url){
      if(box.dataset.src){
        box.dataset.src = '';
        box.replaceChildren();
      }
      return;
    }
    if(box.dataset.src === h.url) return;
    box.dataset.src = h.url;
    box.innerHTML = `<img src="${htmlEscape(h.url)}" alt="" decoding="async">`;
  }
  function petVisualUrl(){
    try{
      const p = (typeof activePet === 'function') ? activePet() : null;
      const fns = [
        (typeof currentPetImg === 'function') ? currentPetImg : null,
        (typeof petStateImg === 'function') ? petStateImg : null
      ];
      for(const fn of fns){
        if(!fn) continue;
        try{
          const url = fn(p);
          if(typeof url === 'string' && url.trim()) return url.trim();
        }catch(_){ }
      }
      if(p){
        for(const key of ['img','image','src']){
          const url = p[key];
          if(typeof url === 'string' && url.trim()) return url.trim();
        }
      }
    }catch(_){ }
    const src = document.querySelector('#pet-card .pet-wrap img.pet-img, #pet-card img.pet-img, .stage-hero .pet-wrap img.pet-img, .stage-hero img.pet-img');
    return src ? (src.currentSrc || src.getAttribute('src') || '') : '';
  }
  function syncPetVisual(){
    const box = document.getElementById('vw2-pet');
    if(!box) return;
    const url = petVisualUrl();
    if(url){
      if(box.dataset.src !== url){
        box.dataset.src = url;
        box.innerHTML = `<img class="vw2-owned-pet" src="${htmlEscape(url)}" alt="สัตว์เลี้ยงของผู้เล่น">`;
      }
      box.classList.add('has-owned-pet');
    }else{
      if(!box.dataset.src){ box.innerHTML = mascotDragon(); }
      box.classList.remove('has-owned-pet');
    }
  }
  function syncNewWordCard(){
    const card = document.getElementById('vw2-newword');
    const source = document.getElementById('newword-banner');
    if(!card) return;
    let word = cleanText(source?.querySelector('.nw-word')?.textContent || '', 32);
    const hint = cleanText(source?.querySelector('.nw-hint')?.textContent || '', 72);
    const reward = cleanText(source?.querySelector('.nw-coin')?.textContent || '', 18);
    try{ if(!word && typeof newWordPick !== 'undefined' && Array.isArray(newWordPick)) word = cleanText(newWordPick[0] || '', 32); }catch(_){ }
    const set=(idName,value)=>{ const el=document.getElementById(idName); if(el && el.textContent !== value) el.textContent=value; };
    set('vw2-newword-word', word || 'คำใหม่กำลังมา');
    set('vw2-newword-hint', hint || 'แตะเพื่อฟังเสียงและดูความหมาย');
    set('vw2-newword-reward', reward || '🪙 +1');
    card.disabled = !word;
    card.setAttribute('aria-disabled', word ? 'false' : 'true');
    card.title = word ? `เปิดคำศัพท์ใหม่ ${word}` : 'กำลังเตรียมคำศัพท์ใหม่';
  }
  function syncMusicState(){
    const btn = root ? root.querySelector('[data-vw2-action="music"]') : null;
    if(!btn) return;
    let on = true;
    try{
      if(typeof Music !== 'undefined' && Music && typeof Music.isMusicOn === 'function') on = !!Music.isMusicOn();
      else{
        const source=document.getElementById('btn-music');
        on = !(source && source.classList.contains('off'));
      }
    }catch(_){ }
    btn.classList.toggle('is-music-on', on);
    btn.classList.toggle('is-music-off', !on);
    btn.setAttribute('aria-pressed', on ? 'true' : 'false');
    btn.title = on ? 'เพลงกำลังเปิด — แตะเพื่อปิด' : 'เพลงปิดอยู่ — แตะเพื่อเปิด';
    const label=btn.querySelector('b');
    if(label) label.textContent = on ? 'เพลงเปิด' : 'เพลงปิด';
  }
  function liveEarnValue(kind){
    try{
      if(kind === 'online' && typeof onlineLiveTotal === 'function') return onlineLiveTotal();
      if(kind === 'computer' && typeof compLiveTotal === 'function') return compLiveTotal();
    }catch(_){ }
    const sel = kind === 'online' ? '#net-pill' : '#comp-pill';
    const raw = textOf(sel, '0');
    const m = raw.replace(/,/g,'').match(/[+-]?\d+(?:\.\d+)?/);
    return m ? Number(m[0]) : 0;
  }
  function liveEarnStatus(kind){
    try{
      if(kind === 'online' && typeof onlineEarnActive === 'function') return onlineEarnActive() ? 'กำลังรับรายได้' : 'หยุดพัก';
      if(kind === 'computer'){
        if(typeof state !== 'undefined' && state){
          if(!state.computer) return 'ยังไม่ได้ซื้อคอม';
          if(state.dataCut) return 'บริการถูกระงับ';
          return 'คอมกำลังทำงาน';
        }
      }
    }catch(_){ }
    return kind === 'online' ? 'รายได้ขณะออนไลน์' : 'รายได้จากคอมพิวเตอร์';
  }
  function ensureVisualStyles(){
    /* R10 presentation is consolidated in css/home-v2.css. Keep only a tiny runtime marker
       instead of injecting a second full stylesheet from JavaScript. */
    if(document.getElementById(STYLE_ID)) return;
    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = '#vw-home-v2-root{--vw2-r111-runtime-ready:1;--vw2-r112-runtime-ready:1;--vw2-r113-runtime-ready:1;--vw2-r114-runtime-ready:1;--vw2-r1279-runtime-ready:1;--vw2-r1280-runtime-ready:1;--vw2-r1281-runtime-ready:1;--vw2-r1282-runtime-ready:1;--vw2-r1283-runtime-ready:1;--vw2-r1284-runtime-ready:1;--vw2-r1286-runtime-ready:1;--vw2-r1287-runtime-ready:1;--vw2-r1288-runtime-ready:1;--vw2-r1289-runtime-ready:1;--vw2-r1290-runtime-ready:1;--vw2-r1291-runtime-ready:1;--vw2-r1293-runtime-ready:1;--vw2-r1294-runtime-ready:1;--vw2-r1295-runtime-ready:1;--vw2-r1296-runtime-ready:1;--vw2-r1300-runtime-ready:1;--vw2-r1305-runtime-ready:1}';
    document.head.appendChild(style);
  }
  function clickExisting(selector, opts){
    opts = opts || {};
    const el = document.querySelector(selector);
    if(!el || el.disabled) return false;
    if(opts.classicFirst) setPreviewWanted(false);
    el.click();
    return true;
  }
  function openPanelViaExisting(panelId){
    return clickExisting(`.lobby-rail [data-panel="${panelId}"]`, {classicFirst:true});
  }
  function openPetShop(){
    // Same public route as Classic. The + tab is absent for players with no pet.
    try{
      if(typeof renderPetShop === 'function' && typeof showScreen === 'function'){
        renderPetShop(); showScreen('screen-select'); return true;
      }
    }catch(_){ }
    if(clickExisting('#tab-addpet')) return true;
    try{ if(typeof showToast === 'function') showToast('ไม่พบร้านสัตว์เลี้ยงเดิม'); }catch(_){ }
    return false;
  }
  function authoritativeRacingReady(){
    return typeof enterF1_3D === 'function';
  }
  function openRacing(){
    if(!authoritativeRacingReady()){
      try{ if(typeof showToast === 'function') showToast('Vocab World Racing ยังไม่พร้อมใน build นี้'); }catch(_){ }
      return false;
    }
    try{ enterF1_3D(); return true; }
    catch(_){
      try{ if(typeof showToast === 'function') showToast('ไม่สามารถเปิด Vocab World Racing ได้'); }catch(__){ }
      return false;
    }
  }
  function openAvatarEditor(){
    // R11 functional-completion rule: photo.js remains the single authoritative upload/persistence owner.
    // Use its public menu when available; otherwise click the Classic camera trigger that already delegates to it.
    try{
      if(typeof openPhotoMenu === 'function'){
        openPhotoMenu();
        return true;
      }
    }catch(_){ }
    const camera = document.querySelector('#pass-photo .pp-cam');
    if(camera && !camera.disabled){
      try{ camera.click(); return true; }catch(_){ }
    }
    try{ if(typeof showToast === 'function') showToast('ไม่พบตัวแก้ไขรูปโปรไฟล์เดิม'); }catch(_){ }
    return false;
  }
  function openActivePetProfile(){
    // Keep the Classic pet profile as the only owner of pet data and care actions.
    try{
      if(typeof activePet === 'function' && !activePet()){
        openPetShop();
        return false;
      }
      if(typeof openPetInfoOverlay === 'function'){
        openPetInfoOverlay();
        return true;
      }
    }catch(_){ }
    if(clickExisting('#btn-pet-info')) return true;
    try{ if(typeof showToast === 'function') showToast('ไม่พบหน้าโปรไฟล์สัตว์เดิม'); }catch(_){ }
    return false;
  }
  function renameActivePet(){
    let pet = null;
    try{ pet = typeof activePet === 'function' ? activePet() : null; }catch(_){ }
    if(!pet){ openPetShop(); return false; }
    try{
      if(typeof renamePet === 'function'){
        renamePet(pet);
        return true;
      }
    }catch(_){ }
    if(clickExisting('#btn-pet-rename')) return true;
    try{ if(typeof showToast === 'function') showToast('ไม่พบตัวเปลี่ยนชื่อสัตว์เดิม'); }catch(_){ }
    return false;
  }
  function ownedPets(){
    try{ return typeof state !== 'undefined' && state && Array.isArray(state.pets) ? state.pets : []; }
    catch(_){ return []; }
  }
  function ownedPetThumb(p){
    let url = '';
    try{ if(typeof currentPetImg === 'function') url = currentPetImg(p) || ''; }catch(_){ }
    if(url) return `<img src="${htmlEscape(url)}" alt="" decoding="async">`;
    let face = '🐾';
    try{
      const conf = typeof PETS !== 'undefined' && PETS ? PETS[p.type] : null;
      const stage = typeof petStage === 'function' ? petStage(p) : 'adult';
      face = stage === 'egg' ? (conf?.startKey === 'egg' ? '🥚' : '🧺') : (conf?.[stage] || conf?.adult || face);
    }catch(_){ }
    return `<span aria-hidden="true">${htmlEscape(face)}</span>`;
  }
  function ownedPetsHTML(){
    const pets = ownedPets();
    if(!pets.length) return '<div class="vw2-pet-modal-empty">ยังไม่มีสัตว์เลี้ยง — ไปเลือกรับน้องตัวแรกที่ร้านสัตว์กันเถอะ</div>';
    let active = 0;
    try{ active = Math.max(0, Number(state.active) || 0); }catch(_){ }
    return pets.map((p,index)=>{
      const name = completeText(p?.name, (typeof PETS !== 'undefined' && PETS?.[p?.type]?.name) || 'น้อง');
      const status = petStatusText(p);
      const sick = !!p?.sick;
      return `<button type="button" class="vw2-owned-pet-card${index === active ? ' is-active' : ''}${sick ? ' is-sick' : ''}" data-vw2-pet-index="${index}" aria-label="เลือก ${htmlEscape(name)}">
        <span class="vw2-owned-pet-thumb">${ownedPetThumb(p)}${sick ? '<i>ป่วย</i>' : ''}</span>
        <span class="vw2-owned-pet-copy"><b>${htmlEscape(name)}</b><small>${htmlEscape(status)}</small></span>
        <em>${index === active ? 'กำลังเล่นอยู่' : 'เลือกน้อง'}</em>
      </button>`;
    }).join('');
  }
  function syncOwnedPetsModal(){
    const list = document.getElementById('vw2-pet-modal-list');
    const count = document.getElementById('vw2-pet-modal-count');
    const healAll = document.getElementById('vw2-heal-all');
    const healSummary = document.getElementById('vw2-heal-all-summary');
    const healLabel = document.getElementById('vw2-heal-all-label');
    const pets = ownedPets();
    const sickCount = pets.filter(p=>p && p.sick).length;
    const unitCost = (typeof CURE_COST === 'number' && CURE_COST > 0) ? CURE_COST : 0;
    const totalCost = sickCount * unitCost;
    const coins = (typeof state !== 'undefined' && state) ? Number(state.coins || 0) : 0;
    const coinShort = Math.max(0, totalCost - coins);
    if(count) count.textContent = `${pets.length} ตัว`;
    if(healAll){
      healAll.disabled = sickCount === 0;
      healAll.classList.toggle('is-ready', sickCount > 0);
      healAll.classList.toggle('is-short-coins', sickCount > 0 && coins < totalCost);
      healAll.setAttribute('aria-label', sickCount
        ? `รักษาสัตว์ป่วยทั้งหมด ${sickCount} ตัว ค่ารักษารวม ${totalCost} เหรียญ${coinShort ? ` เหรียญไม่พอ ขาด ${coinShort}` : ''}`
        : 'สัตว์ทุกตัวแข็งแรงดีแล้ว');
      healAll.title = sickCount ? 'แตะครั้งเดียวเพื่อรักษาสัตว์ป่วยทุกตัว' : 'สัตว์ทุกตัวแข็งแรงดีแล้ว';
    }
    if(healSummary) healSummary.textContent = sickCount
      ? `ป่วย ${fmt(sickCount)} ตัว · ค่ารักษารวม 🪙${fmt(totalCost)}${coinShort ? ` · ขาด 🪙${fmt(coinShort)}` : ''}`
      : 'สัตว์ทุกตัวแข็งแรงดีแล้ว ไม่เสียเหรียญ';
    if(healLabel) healLabel.textContent = sickCount ? (coinShort ? `ขาด 🪙${fmt(coinShort)}` : `รักษา ${fmt(sickCount)} ตัว`) : 'แข็งแรงดี';
    if(list){
      const html = ownedPetsHTML();
      if(list.dataset.vw2Html !== html){
        list.innerHTML = html;
        list.dataset.vw2Html = html;
      }
    }
  }
  function healAllOwnedPets(){
    try{
      if(typeof cureAllPets !== 'function') return false;
      const result = cureAllPets();
      syncOwnedPetsModal();
      setTimeout(()=>{ sync(); syncOwnedPetsModal(); }, 0);
      return !!(result && result.healed);
    }catch(_){ return false; }
  }
  function openOwnedPetsModal(){
    const pets = ownedPets();
    if(!pets.length){ openPetShop(); return false; }
    const modal = document.getElementById('vw2-pet-modal');
    if(!modal) return false;
    syncOwnedPetsModal();
    modal.hidden = false;
    modal.setAttribute('aria-hidden','false');
    document.body.classList.add('vw2-pet-modal-open');
    setTimeout(()=>modal.querySelector('.vw2-owned-pet-card.is-active,.vw2-owned-pet-card')?.focus(), 0);
    return true;
  }
  function closeOwnedPetsModal(){
    const modal = document.getElementById('vw2-pet-modal');
    if(!modal) return;
    modal.hidden = true;
    modal.setAttribute('aria-hidden','true');
    document.body.classList.remove('vw2-pet-modal-open');
  }
  function chooseOwnedPet(index){
    const pets = ownedPets();
    if(!Number.isInteger(index) || index < 0 || index >= pets.length) return false;
    try{
      state.active = index;
      if(typeof saveState === 'function') saveState();
      if(typeof sfx !== 'undefined' && sfx && typeof sfx.select === 'function') sfx.select();
      if(typeof renderDashboard === 'function') renderDashboard();
      closeOwnedPetsModal();
      setTimeout(()=>{ sync(); playPetWelcome(); }, 0);
      return true;
    }catch(_){ return false; }
  }
  /* R27: the large visible pet must keep the Classic lobby interaction contract.
     A short pat reacts and then opens the profile; an 800 ms hold gives the
     once-per-day long-pat EXP. The separate profile action remains available. */
  function bindVisiblePetPat(){
    const tap = document.getElementById('vw2-pet');
    if(!tap || tap.dataset.vw2PatBound === '1') return;
    tap.dataset.vw2PatBound = '1';
    let timer = null;
    let longDone = false;
    let activePointer = null;
    const cancel = ()=>{
      if(timer){ clearTimeout(timer); timer = null; }
      tap.classList.remove('is-patting');
    };
    const petNow = ()=>{
      try{ return (typeof activePet === 'function') ? activePet() : null; }
      catch(_){ return null; }
    };
    const visual = ()=>tap.firstElementChild || tap;
    const runShort = ()=>{
      const pet = petNow();
      if(pet && typeof shortPatPet === 'function'){ shortPatPet(pet, visual()); return true; }
      openActivePetProfile();
      return false;
    };
    const runLong = ()=>{
      const pet = petNow();
      if(pet && typeof longPatPet === 'function'){ longPatPet(pet, visual()); return true; }
      return false;
    };
    tap.addEventListener('pointerdown', e=>{
      if(e.pointerType === 'mouse' && e.button !== 0) return;
      longDone = false;
      activePointer = e.pointerId;
      cancel();
      tap.classList.add('is-patting');
      const holdMs = (typeof PAT_HOLD_MS === 'number') ? PAT_HOLD_MS : 800;
      timer = setTimeout(()=>{
        timer = null;
        longDone = runLong();
        tap.classList.remove('is-patting');
      }, holdMs);
    });
    tap.addEventListener('pointerup', e=>{
      if(activePointer !== null && e.pointerId !== activePointer) return;
      const wasLong = longDone;
      activePointer = null;
      longDone = false;
      cancel();
      if(!wasLong) runShort();
    });
    tap.addEventListener('pointercancel', ()=>{ activePointer = null; longDone = false; cancel(); });
    tap.addEventListener('pointerleave', ()=>{ activePointer = null; longDone = false; cancel(); });
    tap.addEventListener('contextmenu', e=>e.preventDefault());
    tap.addEventListener('click', e=>{
      // Pointer input is handled above. Keyboard activation produces detail=0.
      e.preventDefault();
      e.stopPropagation();
      if(e.detail === 0) runShort();
    });
  }
  function openUserProfile(){
    // Delegate to the existing player-card/profile system instead of inventing a Home-V2-specific route.
    const uid = (typeof onlineKey === 'function') ? onlineKey() : '';
    const name = (typeof state !== 'undefined' && state && state.profileName) ? state.profileName : textOf('#student-chip','ผู้เล่น');
    const grade = (typeof state !== 'undefined' && state && state.student) ? (state.student.grade || '') : '';
    let publicName = name;
    try{ if(typeof badgeSuffix === 'function') publicName += badgeSuffix(); }catch(_){ }
    try{
      if(typeof showPlayerCard === 'function'){
        showPlayerCard(uid, publicName, grade);
        return true;
      }
    }catch(_){ }
    const source = document.querySelector('#student-chip .pl-click, #pass-photo.pl-click');
    if(source){
      try{ source.dispatchEvent(new MouseEvent('click',{bubbles:true,cancelable:true,view:window})); return true; }catch(_){ }
    }
    try{ if(typeof showToast === 'function') showToast('ไม่พบ User Profile เดิม'); }catch(_){ }
    return false;
  }
  function syncRuntimeActionParity(){
    if(!root) return;
    const racing = root.querySelector('[data-vw2-action="racing"]');
    if(racing){
      const ready = authoritativeRacingReady();
      racing.disabled = !ready;
      racing.setAttribute('aria-disabled', ready ? 'false' : 'true');
      racing.title = ready ? 'Vocab World Racing' : 'Vocab World Racing ยังไม่พร้อมใน build นี้';
    }
  }
  function action(name){
    const direct = {
      city:'#btn-rail-city', cure:'#btn-rail-cure', wordsearch:'#btn-rail-wordsearch',
      worldAdv:'#btn-world-adv', worldSky:'#btn-world-sky', worldHaunt:'#btn-world-haunt',
      worldHeli:'#btn-world-heli', worldDrone:'#btn-world-drone', worldDrive:'#btn-world-drive',
      worldSoccer:'#btn-world-soccer', worldMoto:'#btn-world-moto',
      worldInvasion:'#btn-world-invasion', worldMecha:'#btn-world-mecha',
      typing:'#btn-rail-typing', bubble:'#btn-rail-bubble', shoot:'#btn-rail-shootword',
      cannon:'#btn-rail-lettercannon', examstd:'#btn-rail-examstd', onet:'#btn-rail-onet',
      rank:'#btn-rail-rank', stats:'#btn-stats', trophy:'#btn-rail-trophy', chat:'#btn-chat',
      music:'#btn-music', night:'#btn-night', settings:'#btn-settings', install:'#btn-install-top',
      logout:'#btn-logout', play:'#btn-play', cats:'#btn-cats', picmatch:'#btn-picmatch',
      picdict:'#btn-picdict', picquiz:'#btn-picquiz', vocabbook:'#btn-vocab-book',
      bandexam:'#btn-band-exam'
    };
    const panels = {
      home:'panel-home', invest:'panel-farm', factory:'panel-factory',
      market:'panel-market', friends:'panel-friends', gifts:'panel-gifts'
    };
    const standards = {ielts:'ielts',toeic:'toeic',toefl:'toefl',onetp6:'onetp6',onetm3:'onetm3',onetm6:'onetm6'};
    if(name === 'classic'){ setPreviewWanted(false); return; }
    if(name === 'v2'){ setPreviewWanted(true); return; }
    if(name === 'shop'){ openPetShop(); return; }
    if(name === 'petProfile'){ openActivePetProfile(); return; }
    if(name === 'petRename'){ renameActivePet(); return; }
    if(name === 'ownedPets'){ openOwnedPetsModal(); return; }
    if(name === 'profile'){ openUserProfile(); return; }
    if(name === 'avatarEdit'){ openAvatarEditor(); return; }
    if(name === 'newWord'){ clickExisting('#newword-banner'); return; }
    if(name === 'onlinePlayers'){ openOnlinePlayersModal(); return; }
    if(name === 'racing'){ openRacing(); return; }
    if(panels[name]){ openPanelViaExisting(panels[name]); return; }
    if(standards[name]){ clickExisting(`.lobby-bottom [data-xstd="${standards[name]}"]`); return; }
    if(direct[name]){
      clickExisting(direct[name], {classicFirst:name === 'rank'});
      if(name === 'music') setTimeout(syncMusicState, 0);
    }
  }
  function updateLeftRailCue(){
    if(!root) return;
    const rail = root.querySelector('.vw2-left');
    const cue = rail ? rail.querySelector('.vw2-left-scroll-cue') : null;
    if(!rail || !cue) return;
    const canScroll = rail.scrollHeight > rail.clientHeight + 2;
    const hasMore = canScroll && (rail.scrollTop + rail.clientHeight < rail.scrollHeight - 2);
    cue.classList.toggle('is-visible', hasMore);
    rail.dataset.vw2ScrollMore = hasMore ? '1' : '0';
  }
  function setupLeftRailCue(){
    if(!root) return;
    const rail = root.querySelector('.vw2-left');
    if(!rail || rail.dataset.vw2CueReady === '1') return;
    rail.dataset.vw2CueReady = '1';
    rail.addEventListener('scroll', ()=>{
      updateLeftRailCue();
      scheduleLocalPreviewReport();
    }, {passive:true});
    window.addEventListener('resize', updateLeftRailCue, {passive:true});
    setTimeout(updateLeftRailCue, 0);
  }
  function updateBottomRailScrollState(){
    if(!root) return;
    const rail = root.querySelector('.vw2-bottom-scroll');
    if(!rail) return;
    const max = Math.max(0, rail.scrollWidth - rail.clientWidth);
    const scrollable = max > 2;
    rail.classList.toggle('is-scrollable', scrollable);
    rail.classList.toggle('is-at-start', rail.scrollLeft <= 2);
    rail.classList.toggle('is-at-end', rail.scrollLeft >= max - 2);
    rail.dataset.vw2ScrollMax = String(Math.round(max));
    rail.dataset.vw2ScrollLeft = String(Math.round(rail.scrollLeft));
    const frame = rail.closest('.vw2-bottom');
    frame?.classList.toggle('can-scroll-left', scrollable && rail.scrollLeft > 2);
    frame?.classList.toggle('can-scroll-right', scrollable && rail.scrollLeft < max - 2);
  }
  function setupBottomRailScroll(){
    if(!root) return;
    const rail = root.querySelector('.vw2-bottom-scroll');
    if(!rail || rail.dataset.vw2ScrollReady === '1') return;
    rail.dataset.vw2ScrollReady = '1';
    if(!rail.hasAttribute('tabindex')) rail.tabIndex = 0;
    rail.title = 'เลื่อนซ้าย–ขวาเพื่อดูทางลัดทั้งหมด';
    rail.addEventListener('scroll', ()=>{
      updateBottomRailScrollState();
      scheduleLocalPreviewReport();
    }, {passive:true});
    rail.addEventListener('wheel', e=>{
      if(rail.scrollWidth <= rail.clientWidth + 2) return;
      if(Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return;
      const before = rail.scrollLeft;
      const max = Math.max(0, rail.scrollWidth - rail.clientWidth);
      const next = Math.max(0, Math.min(max, before + e.deltaY));
      if(Math.abs(next - before) <= .5) return;
      e.preventDefault();
      const priorBehavior = rail.style.scrollBehavior;
      rail.style.scrollBehavior = 'auto';
      rail.scrollLeft = next;
      requestAnimationFrame(()=>{ rail.style.scrollBehavior = priorBehavior; });
    }, {passive:false});
    rail.addEventListener('keydown', e=>{
      if(e.target !== rail) return;
      const page = Math.max(90, rail.clientWidth * .72);
      if(e.key === 'ArrowRight'){ e.preventDefault(); rail.scrollBy({left:page,behavior:'smooth'}); }
      else if(e.key === 'ArrowLeft'){ e.preventDefault(); rail.scrollBy({left:-page,behavior:'smooth'}); }
      else if(e.key === 'Home'){ e.preventDefault(); rail.scrollTo({left:0,behavior:'smooth'}); }
      else if(e.key === 'End'){ e.preventDefault(); rail.scrollTo({left:rail.scrollWidth,behavior:'smooth'}); }
    });
    window.addEventListener('resize', updateBottomRailScrollState, {passive:true});
    setTimeout(updateBottomRailScrollState, 0);
  }
  function updateFeatureActionScrollState(){
    if(!root) return;
    const rail = root.querySelector('.vw2-feature-action-scroll');
    if(!rail) return;
    const max = Math.max(0, rail.scrollWidth - rail.clientWidth);
    rail.classList.toggle('is-scrollable', max > 2);
    rail.classList.toggle('is-at-start', rail.scrollLeft <= 2);
    rail.classList.toggle('is-at-end', rail.scrollLeft >= max - 2);
    rail.dataset.vw2ScrollMax = String(Math.round(max));
    rail.dataset.vw2ScrollLeft = String(Math.round(rail.scrollLeft));
  }
  function setupFeatureActionScroll(){
    if(!root) return;
    const rail = root.querySelector('.vw2-feature-action-scroll');
    if(!rail || rail.dataset.vw2ScrollReady === '1') return;
    rail.dataset.vw2ScrollReady = '1';
    rail.title = 'เลื่อนซ้าย–ขวาเพื่อดูเมนูสัตว์เลี้ยงทั้งหมด';
    rail.addEventListener('scroll', ()=>{
      updateFeatureActionScrollState();
      scheduleLocalPreviewReport();
    }, {passive:true});
    rail.addEventListener('wheel', e=>{
      if(rail.scrollWidth <= rail.clientWidth + 2 || Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return;
      const max = Math.max(0, rail.scrollWidth - rail.clientWidth);
      const next = Math.max(0, Math.min(max, rail.scrollLeft + e.deltaY));
      if(Math.abs(next - rail.scrollLeft) <= .5) return;
      e.preventDefault();
      rail.scrollLeft = next;
    }, {passive:false});
    rail.addEventListener('keydown', e=>{
      if(e.target !== rail) return;
      const page = Math.max(92, rail.clientWidth * .72);
      if(e.key === 'ArrowRight'){ e.preventDefault(); rail.scrollBy({left:page,behavior:'smooth'}); }
      else if(e.key === 'ArrowLeft'){ e.preventDefault(); rail.scrollBy({left:-page,behavior:'smooth'}); }
      else if(e.key === 'Home'){ e.preventDefault(); rail.scrollTo({left:0,behavior:'smooth'}); }
      else if(e.key === 'End'){ e.preventDefault(); rail.scrollTo({left:rail.scrollWidth,behavior:'smooth'}); }
    });
    window.addEventListener('resize', updateFeatureActionScrollState, {passive:true});
    setTimeout(updateFeatureActionScrollState, 0);
  }
  function syncLayoutProfile(){
    if(!root) return;
    const width = Math.max(window.innerWidth || 0, document.documentElement.clientWidth || 0);
    const height = Math.max(window.innerHeight || 0, document.documentElement.clientHeight || 0);
    let profile = 'desktop';
    if(width <= 700 || height <= 390) profile = 'phone-compact';
    else if(width <= 850 || height <= 430) profile = 'phone-standard';
    else if(width <= 960 || height <= 500) profile = 'phone-wide';
    else if(width <= 1180 || height <= 600) profile = 'tablet-landscape';
    root.dataset.vw2LayoutProfile = profile;
    root.style.setProperty('--vw2-screen-ratio', (width / Math.max(1,height)).toFixed(3));
    updateFeatureActionScrollState();
  }
  function build(){
    const dash = dashboard();
    if(!dash || document.getElementById(ROOT_ID)) return;
    ensureVisualStyles();
    const railButtons = [
      ['cure','heart','รักษา','#btn-rail-cure'],
      ['city','city','เมือง 3D','#btn-rail-city'],
      ['worldAdv','adventure','โลกผจญภัย','#btn-world-adv'],
      ['worldSky','skyplay','Sky Playground','#btn-world-sky'],
      ['worldHaunt','ghost','โลกผีสิง','#btn-world-haunt'],
      ['worldHeli','helicopter','โลกเฮลิคอปเตอร์','#btn-world-heli'],
      ['worldDrone','drone','โลกโดรน FPV','#btn-world-drone'],
      ['worldDrive','racecar','โลกขับรถ','#btn-world-drive'],
      ['worldSoccer','soccer','โลกฟุตบอล','#btn-world-soccer'],
      ['worldMoto','motorcycle','โลกมอเตอร์ไซค์','#btn-world-moto'],
      ['worldInvasion','mothership','โลกยานแม่','#btn-world-invasion'],
      ['worldMecha','mecha','โลกหุ่นรบ','#btn-world-mecha'],
      ['home','home','บ้าน','.lobby-rail [data-panel="panel-home"]'],
      ['invest','invest','ลงทุน','.lobby-rail [data-panel="panel-farm"]'],
      ['factory','factory','โรงงาน','.lobby-rail [data-panel="panel-factory"]'],
      ['wordsearch','search','ค้นหาคำ','#btn-rail-wordsearch'],
      ['typing','typing','พิมพ์คำ','#btn-rail-typing'],
      ['bubble','bubble','เกมฟอง','#btn-rail-bubble'],
      ['shoot','target','ยิงเป้าคำ','#btn-rail-shootword'],
      ['cannon','cannon','Letter Cannon','#btn-rail-lettercannon'],
      ['examstd','exam','ข้อสอบจริง','#btn-rail-examstd'],
      ['onet','flag','O-NET','#btn-rail-onet'],
      ['rank','crown','อันดับ','#btn-rail-rank'],
      ['market','market','ตลาด','.lobby-rail [data-panel="panel-market"]'],
      ['friends','friends','เพื่อน','.lobby-rail [data-panel="panel-friends"]'],
      ['gifts','gift','ของขวัญ','.lobby-rail [data-panel="panel-gifts"]'],
      ['stats','stats','สถิติ','#btn-stats'],
      ['trophy','pinboard','ตู้เข็ม','#btn-rail-trophy'],
      ['racing','racecar','Vocab World Racing',''],
    ].map(x=>navButton(x[0],x[1],x[2],x[3])).join('');
    const learningModes = [
      ['vocabbook','bookgold','สมุดคำศัพท์','book','#btn-vocab-book','journal'],
      ['ielts','book','IELTS','blue','.lobby-bottom [data-xstd="ielts"]','challenge'],
      ['toeic','book','TOEIC','green','.lobby-bottom [data-xstd="toeic"]','challenge'],
      ['toefl','book','TOEFL','orange','.lobby-bottom [data-xstd="toefl"]','challenge'],
      ['onetp6','star','O-NET ป.6','gold','.lobby-bottom [data-xstd="onetp6"]','challenge'],
      ['onetm3','leaf','O-NET ม.3','lime','.lobby-bottom [data-xstd="onetm3"]','challenge'],
      ['onetm6','crown','O-NET ม.6','violet','.lobby-bottom [data-xstd="onetm6"]','challenge'],
      ['cats','sparkle','หมวดคำศัพท์','pink','#btn-cats','training'],
      ['play','controller','จับคู่คำศัพท์','game','#btn-play','training'],
      ['picmatch','picture','จับคู่ภาพ','blue','#btn-picmatch','training'],
      ['picdict','bookgold','Picture Dictionary','green','#btn-picdict','training'],
      ['picquiz','headphones','ครูถามศัพท์','orange','#btn-picquiz','training'],
      ['bandexam','clipboard','สอบเลื่อนขั้น','violet','#btn-band-exam','challenge'],
    ];
    const learningModeButtons = learningModes.map(x=>bottomButton(x[0],x[1],x[2],x[3],x[4])).join('');
    root = document.createElement('div');
    root.id = ROOT_ID;
    root.setAttribute('aria-label','Vocab World Home V2 Admin Preview');
    root.innerHTML = `
      <div class="vw2-sky" aria-hidden="true"><i></i><i></i><i></i><i></i></div>
      <div class="vw2-shell">
        <header class="vw2-top">
          <section class="vw2-profile vw2-glass vw2-profile-link" data-vw2-action="profile" role="button" tabindex="0" aria-label="เปิด User Profile" title="เปิด User Profile">
            <span class="vw2-kanok-corner" aria-hidden="true"></span>
            <span class="vw2-profile-crown" aria-hidden="true">${icon('crown')}</span>
            <div class="vw2-profile-kicker"><span>PLAYER IDENTITY</span><i aria-hidden="true">✦</i></div>
            <div class="vw2-avatar-frame"><div class="vw2-avatar" id="vw2-avatar">${knightFallback()}</div><button type="button" class="vw2-avatar-edit" data-vw2-action="avatarEdit" data-vw2-source="#pass-photo" aria-label="เปลี่ยนรูปโปรไฟล์" title="เปลี่ยนรูปโปรไฟล์">${icon('camera')}</button></div>
            <div class="vw2-profile-main">
              <div class="vw2-name-row"><strong id="vw2-name">ผู้เล่น</strong><span class="vw2-pencil">${icon('edit')}</span></div>
              <div class="vw2-profile-meta">
                <span class="vw2-profile-meta-chip class"><small>LEVEL / CLASS</small><b id="vw2-grade">—</b></span>
                <span class="vw2-profile-meta-chip id"><small>PLAYER ID</small><b id="vw2-id">ID —</b></span>
                <span class="vw2-profile-meta-chip date"><small>DATE</small><b id="vw2-date">—</b></span>
                <span class="vw2-profile-meta-chip time"><small>TIME</small><b id="vw2-clock">—</b></span>
              </div>
              <div class="vw2-profile-chips"><span class="vw2-achievement-mark" aria-hidden="true">${icon('trophy')}</span><div class="vw2-rank" id="vw2-rank">กำลังโหลดแรงค์…</div><div class="vw2-sync-chip" id="vw2-sync-state" hidden></div></div>
            </div>
          </section>
          <section class="vw2-wallet" aria-label="ข้อมูลรายได้และทรัพย์สิน">
            <button class="vw2-wallet-pill coin" data-vw2-action="rank" data-vw2-source="#btn-rail-rank" title="เหรียญที่มีอยู่">${walletArtwork('coin')}<span class="vw2-stat-copy"><small>เหรียญคงเหลือ</small><b id="vw2-coins">0</b><span class="vw2-pill-status">ยอดพร้อมใช้</span></span><em>+</em></button>
            <div class="vw2-wallet-pill today" title="เหรียญที่หาได้วันนี้">${walletArtwork('today')}<span class="vw2-stat-copy"><small>วันนี้</small><b>+<span id="vw2-today">0</span></b><span class="vw2-pill-status">สะสมวันนี้</span></span></div>
            <div class="vw2-wallet-pill online" title="รายได้ที่ได้รับขณะออนไลน์">${walletArtwork('online')}<span class="vw2-stat-copy"><small>ออนไลน์</small><b>+<span id="vw2-online-earn">0</span></b><span class="vw2-pill-status" id="vw2-online-status">กำลังตรวจสอบ</span></span></div>
            <div class="vw2-wallet-pill computer" title="รายได้สะสมจากคอมพิวเตอร์">${walletArtwork('computer')}<span class="vw2-stat-copy"><small>จากคอม</small><b>+<span id="vw2-comp-earn">0</span></b><span class="vw2-pill-status" id="vw2-comp-status">กำลังตรวจสอบ</span></span></div>
            <div class="vw2-wallet-pill worth">${walletArtwork('worth')}<span class="vw2-stat-copy"><small>มูลค่ารวม</small><b id="vw2-worth">0</b><span class="vw2-pill-status">ทรัพย์สินทั้งหมด</span></span></div>
          </section>
          <section class="vw2-top-actions" aria-label="เครื่องมือ — ทุกปุ่มมีข้อความกำกับ">
            ${toolButton('chat','chat','ข้อความ','', '#btn-chat')}
            ${toolButton('music','music','เพลง','', '#btn-music')}
            ${toolButton('night','moon','กลางคืน','', '#btn-night')}
            ${toolButton('settings','settings','ตั้งค่า','', '#btn-settings')}
            ${toolButton('install','install','ติดตั้ง','vw2-install', '#btn-install-top', true)}
            ${toolButton('logout','logout','ออกระบบ','', '#btn-logout')}
            ${toolButton('classic','back','Classic','vw2-classic')}
          </section>
        </header>
        <div class="vw2-main-grid">
          <nav class="vw2-left vw2-glass" aria-label="เมนูหลักทั้งหมด">${railButtons}<span class="vw2-left-scroll-cue" aria-hidden="true"><span>&#8964;</span></span></nav>
          <section class="vw2-feed vw2-glass">
            <div class="vw2-section-head"><span class="vw2-head-icon">${icon('globe')}</span><strong>Global Feed</strong><button class="vw2-feed-all" data-vw2-action="classic" title="ดู Global Feed ทั้งหมด" aria-label="ดู Global Feed ทั้งหมด">↗</button></div>
            <div id="vw2-feed-items" class="vw2-feed-items">
              <div class="vw2-feed-card vw2-feed-card-empty">
                <div class="vw2-feed-avatar">${icon('sparkle')}</div>
                <div class="vw2-feed-copy"><div class="vw2-feed-card-head"><b>กิจกรรมและตลาดรวม</b><small>ตอนนี้</small></div><p id="vw2-feed-text">กำลังโหลดกิจกรรมและสินค้าจากผู้เล่นทุกคน…</p></div>
              </div>
            </div>
            <span id="vw2-feed-likes" class="vw2-feed-legacy-binding" aria-hidden="true">—</span>
            <button type="button" class="vw2-feed-coin" data-vw2-action="market" title="เปิดตลาด" aria-label="เปิดตลาด"><span aria-hidden="true">${icon('market')}</span></button>
          </section>
          <main class="vw2-feature">
            <div class="vw2-feature-title" aria-hidden="true"><span>${icon('sparkle')}</span><strong></strong><span>${icon('sparkle')}</span></div>
            <button type="button" class="vw2-word-ribbon" id="vw2-newword" data-vw2-action="newWord" data-vw2-source="#newword-banner" aria-label="เปิดคำศัพท์ใหม่">
              <span class="vw2-word-kicker">NEW WORD</span>
              <span class="vw2-word-copy"><strong id="vw2-newword-word">คำใหม่กำลังมา</strong><small id="vw2-newword-hint">แตะเพื่อฟังเสียงและดูความหมาย</small></span>
              <span class="vw2-word-reward" id="vw2-newword-reward">🪙 +1</span>
            </button>
            <div class="vw2-feature-stage">
              <img class="vw2-world-scene" src="img/home-v2/r1279_fantasy_world.webp" alt="" aria-hidden="true" decoding="async" fetchpriority="high">
              <div class="vw2-stage-depth" aria-hidden="true"><div class="vw2-stage-castle">${castleArtwork()}</div></div>
              <div class="vw2-atmosphere" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i></div>
              <div class="vw2-speech"><span id="vw2-pet-greeting">น้องดีใจที่ได้เจอหนูอีกครั้ง!</span><small>ยินดีต้อนรับกลับ Vocab World — ไปผจญภัยด้วยกันนะ</small></div>
              <button type="button" class="vw2-reward-card" data-vw2-action="trophy" data-vw2-source="#btn-rail-trophy">${icon('trophy')}<div><b id="vw2-reward-title">ตู้เข็ม</b><small id="vw2-reward-info" hidden></small></div></button>
              <div class="vw2-pet-halo" aria-hidden="true"></div>
              <div class="vw2-pedestal-aura" aria-hidden="true"></div>
              <div class="vw2-pet-platform" aria-hidden="true"></div>
              <button type="button" class="vw2-pet" id="vw2-pet" data-vw2-pat aria-label="แตะเพื่อลูบสัตว์เลี้ยง กดค้างเพื่อลูบยาว" title="แตะสั้น: เล่นกับน้องและเปิดโปรไฟล์ · กดค้าง: ลูบยาวรับ EXP">${mascotDragon()}</button>
              <div class="vw2-pet-sparkles" aria-hidden="true"><i>♥</i><i>★</i><i>✦</i><i>♥</i></div>
              <button type="button" class="vw2-house-preview" data-vw2-action="home" data-vw2-source=".lobby-rail [data-panel=&quot;panel-home&quot;]" aria-label="เปิดบ้านที่เลือกอยู่">
                <div class="vw2-house-preview-head">${icon('home')}<span id="vw2-house-label">ยังไม่มีบ้าน</span></div>
                <div class="vw2-house-backdrop is-empty" id="vw2-house-visual" aria-hidden="true"></div>
              </button>
              <div class="vw2-stage-copy"><b id="vw2-pet-name">ออกผจญภัยกับน้อง</b><span id="vw2-pet-state">ฝึกคำศัพท์ · สะสมเหรียญ · เติบโตไปด้วยกัน</span></div>
              <div class="vw2-stage-foreground" aria-hidden="true"></div>
            </div>
            <div class="vw2-feature-actions">
              <div class="vw2-feature-action-scroll" tabindex="0" role="region" aria-label="เลื่อนเมนูสัตว์เลี้ยงซ้ายขวา">
                <div class="vw2-feature-action-track">
                  <button class="vw2-enter" data-vw2-action="petProfile" aria-label="เปิดโปรไฟล์สัตว์เลี้ยง">${icon('heart')}<span>โปรไฟล์สัตว์เลี้ยง</span></button>
                  <button class="vw2-pet-name-action vw2-play" data-vw2-action="petRename" aria-label="เปลี่ยนชื่อสัตว์เลี้ยง">${icon('edit')}<span><small>เปลี่ยนชื่อ</small><b id="vw2-action-pet-name">น้องของฉัน</b></span></button>
                  <button class="vw2-owned-pets-action vw2-enter" data-vw2-action="ownedPets" aria-label="ดูสัตว์เลี้ยงที่ซื้อไว้ทั้งหมด">${icon('friends')}<span><small>สัตว์ที่ซื้อไว้</small><b id="vw2-owned-pet-count">สัตว์ของฉัน</b></span></button>
                  <button class="vw2-shop-link" data-vw2-action="shop" data-vw2-source="#screen-select">${icon('potion')}<span>ร้านสัตว์</span></button>
                </div>
              </div>
            </div>
          </main>
          <aside class="vw2-right">
            <section class="vw2-mission vw2-glass">
              <div class="vw2-section-head"><span class="vw2-head-icon">${icon('target')}</span><strong>ภารกิจวันนี้</strong><b id="vw2-quest-count">0/0</b></div>
              <div class="vw2-progress"><i id="vw2-quest-bar"></i></div>
              <div id="vw2-quests" class="vw2-quests"><div class="vw2-empty">กำลังโหลดภารกิจ…</div></div>
            </section>
            <section class="vw2-online vw2-glass">
              <div class="vw2-section-head"><span class="vw2-head-icon">${icon('friends')}</span><strong>ผู้เล่นออนไลน์</strong><b id="vw2-online-count">—</b></div>
              <div class="vw2-online-list" id="vw2-online-list" aria-live="polite"><div class="vw2-online-note">กำลังเชื่อมต่อรายชื่อออนไลน์จริง…</div></div>
              <span class="vw2-online-legacy" aria-hidden="true"><b id="vw2-online-name">กำลังเชื่อมต่อ…</b><small id="vw2-online-text">เล่นและเรียนไปพร้อมกัน</small></span>
              <button class="vw2-friends-btn" data-vw2-action="onlinePlayers">${icon('friends')} ดูผู้เล่นออนไลน์ทั้งหมด</button>
            </section>
          </aside>
        </div>
        <footer class="vw2-bottom" aria-label="กิจกรรมภาษาอังกฤษ"><div class="vw2-bottom-scroll" role="region" aria-label="เลื่อนกิจกรรมภาษาอังกฤษซ้ายขวา"><div class="vw2-bottom-track">${learningModeButtons}</div></div></footer>
        <div class="vw2-preview-mark">ADMIN PREVIEW · R29 MOBILE QA · PREMIUM RAIL</div>
      </div>
      <div class="vw2-online-modal" id="vw2-online-modal" role="dialog" aria-modal="true" aria-labelledby="vw2-online-modal-title" aria-hidden="true" hidden>
        <section class="vw2-online-modal-panel">
          <header class="vw2-online-modal-head">
            <span class="vw2-online-modal-emblem" aria-hidden="true">${icon('friends')}</span>
            <span class="vw2-online-modal-heading"><strong id="vw2-online-modal-title">ผู้เล่นออนไลน์ทั้งหมด</strong><small>สถานะสดจาก Vocab World</small></span>
            <b id="vw2-online-modal-count">—</b>
            <button type="button" class="vw2-online-modal-close top" data-vw2-online-close aria-label="ปิดหน้าผู้เล่นออนไลน์">ปิด ✕</button>
          </header>
          <div class="vw2-online-modal-list" id="vw2-online-modal-list" tabindex="0"><div class="vw2-online-note">กำลังเชื่อมต่อรายชื่อออนไลน์จริง…</div></div>
          <footer class="vw2-online-modal-foot"><button type="button" class="vw2-online-modal-close bottom" data-vw2-online-close>ปิดหน้าผู้เล่นออนไลน์</button></footer>
        </section>
      </div>
      <div class="vw2-pet-modal" id="vw2-pet-modal" role="dialog" aria-modal="true" aria-labelledby="vw2-pet-modal-title" aria-hidden="true" hidden>
        <section class="vw2-pet-modal-panel">
          <header class="vw2-pet-modal-head">
            <span class="vw2-pet-modal-emblem" aria-hidden="true">${icon('heart')}</span>
            <span><strong id="vw2-pet-modal-title">สัตว์ของฉัน</strong><small>เลือกน้องที่ซื้อไว้แล้วเพื่อพาออกมาเล่น</small></span>
            <b id="vw2-pet-modal-count">0 ตัว</b>
            <button type="button" class="vw2-pet-modal-close top" data-vw2-pet-close aria-label="ปิดหน้าสัตว์ของฉัน">ปิด ✕</button>
          </header>
          <div class="vw2-pet-modal-healbar">
            <button type="button" class="vw2-heal-all" id="vw2-heal-all" data-vw2-heal-all disabled>
              <span class="vw2-heal-all-icon" aria-hidden="true">🩺</span>
              <span class="vw2-heal-all-copy"><b>รักษาสัตว์ป่วยทั้งหมด</b><small id="vw2-heal-all-summary">กำลังตรวจสุขภาพสัตว์ทุกตัว…</small></span>
              <em id="vw2-heal-all-label">แข็งแรงดี</em>
            </button>
          </div>
          <div class="vw2-pet-modal-list" id="vw2-pet-modal-list" tabindex="0"></div>
          <footer class="vw2-pet-modal-foot"><button type="button" class="vw2-pet-modal-close bottom" data-vw2-pet-close>ปิดหน้าสัตว์ของฉัน</button></footer>
        </section>
      </div>`;
    // Mount at body level so the fixed admin preview is not clipped by the
    // Classic dashboard's translated/scaled screen container.
    document.body.appendChild(root);
    bindVisiblePetPat();
    setupLeftRailCue();
    setupBottomRailScroll();
    setupFeatureActionScroll();
    syncLayoutProfile();
    window.addEventListener('resize', syncLayoutProfile, {passive:true});
    root.addEventListener('click', e=>{
      const healAllPetsButton = e.target.closest && e.target.closest('[data-vw2-heal-all]');
      if(healAllPetsButton){
        e.preventDefault();
        if(!healAllPetsButton.disabled) healAllOwnedPets();
        return;
      }
      const closePets = e.target.closest && e.target.closest('[data-vw2-pet-close]');
      if(closePets || (e.target && e.target.id === 'vw2-pet-modal')){
        e.preventDefault();
        closeOwnedPetsModal();
        return;
      }
      const petChoice = e.target.closest && e.target.closest('[data-vw2-pet-index]');
      if(petChoice){
        e.preventDefault();
        chooseOwnedPet(Number(petChoice.dataset.vw2PetIndex));
        return;
      }
      const closeOnline = e.target.closest && e.target.closest('[data-vw2-online-close]');
      if(closeOnline || (e.target && e.target.id === 'vw2-online-modal')){
        e.preventDefault();
        closeOnlinePlayersModal();
        return;
      }
      const onlineRow = e.target.closest && e.target.closest('[data-vw2-online-fid]');
      if(onlineRow){
        e.preventDefault();
        const fid = onlineRow.dataset.vw2OnlineFid || '';
        const fname = onlineRow.dataset.vw2OnlineName || 'ผู้เล่น';
        const fgrade = onlineRow.dataset.vw2OnlineGrade || '';
        try{
          if(onlineRow.dataset.vw2OnlineSelf !== '1' && typeof openFriendQuickMenu === 'function'){
            openFriendQuickMenu(fid, fname, fgrade);
            return;
          }
          if(typeof showPlayerCard === 'function'){ showPlayerCard(fid, fname, fgrade); return; }
        }catch(_){ }
      }
      const marketCard = e.target.closest && e.target.closest('[data-vw2-market-key]');
      if(marketCard){
        e.preventDefault();
        const key = marketCard.dataset.vw2MarketKey || '';
        try{ if(typeof sfx !== 'undefined' && sfx && typeof sfx.select === 'function') sfx.select(); }catch(_){ }
        if(key && typeof openMarketBuyDialog === 'function'){
          openMarketBuyDialog(key);
          return;
        }
        action('market');
        return;
      }
      const b = e.target.closest('[data-vw2-action]');
      if(!b || b.disabled) return;
      e.preventDefault();
      if(typeof sfx !== 'undefined' && sfx && typeof sfx.select === 'function') sfx.select();
      action(b.dataset.vw2Action);
    });
    root.addEventListener('keydown', e=>{
      if(e.key === 'Escape' && document.getElementById('vw2-pet-modal')?.hidden === false){
        e.preventDefault(); closeOwnedPetsModal(); return;
      }
      if(e.key === 'Escape' && document.getElementById('vw2-online-modal')?.hidden === false){
        e.preventDefault(); closeOnlinePlayersModal(); return;
      }
      if(e.key !== 'Enter' && e.key !== ' ') return;
      const profile = e.target.closest && e.target.closest('.vw2-profile-link');
      if(!profile || e.target.closest('button')) return;
      e.preventDefault();
      action('profile');
    });
  }
  function ensureClassicToggle(){
    if(classicToggle) return;
    classicToggle = document.createElement('button');
    classicToggle.id = 'vw2-preview-switch';
    classicToggle.type = 'button';
    classicToggle.textContent = 'Home V2';
    classicToggle.title = 'กลับไปดู Home V2 (Admin Preview)';
    classicToggle.addEventListener('click', ()=>setPreviewWanted(true));
    document.body.appendChild(classicToggle);
  }
  function copyImage(srcSel, targetId, fallbackHTML){
    const src = document.querySelector(srcSel);
    const box = document.getElementById(targetId);
    if(!box) return;
    const url = src && src.getAttribute('src');
    if(url){
      if(box.dataset.src === url) return;
      box.dataset.src = url;
      box.innerHTML = `<img src="${htmlEscape(url)}" alt="">`;
    }else if(!box.dataset.src && fallbackHTML){
      box.innerHTML = fallbackHTML;
    }
  }
  function sourceVisible(el){
    if(!el) return false;
    const cs = window.getComputedStyle ? window.getComputedStyle(el) : null;
    return !el.hidden && (!cs || (cs.display !== 'none' && cs.visibility !== 'hidden'));
  }
  function sourceBadge(el){
    if(!el) return '';
    const badge = el.querySelector && el.querySelector('.rail-badge,.rail-rank-num');
    if(!badge || !sourceVisible(badge)) return '';
    return cleanText(badge.textContent, 6) || '•';
  }
  function syncSourceParity(){
    if(!root) return;
    root.querySelectorAll('[data-vw2-source]').forEach(btn=>{
      const selector = btn.dataset.vw2Source || '';
      const source = selector ? document.querySelector(selector) : null;
      const disabled = !!(source && source.disabled);
      btn.disabled = disabled;
      btn.setAttribute('aria-disabled', disabled ? 'true' : 'false');
      if(btn.classList.contains('vw2-rail-btn')){
        const current = !!(source && (source.classList.contains('active') || source.classList.contains('on') || source.getAttribute('aria-current') === 'page' || source.getAttribute('aria-selected') === 'true' || source.getAttribute('aria-pressed') === 'true'));
        btn.classList.toggle('vw2-current', current);
        if((btn.dataset.vw2Action || '').startsWith('world')){
          const adminOnly = btn.dataset.vw2AdminOnlyWorld === '1';
          const locked = !!(source && (source.classList.contains('locked') || source.classList.contains('soon-locked')));
          btn.classList.toggle('vw2-world-locked', locked);
          btn.hidden = adminOnly && !adminWorldAllowed();
          btn.title = locked ? (source.title || 'โลกนี้ยังล็อกอยู่')
            : btn.textContent.trim() + (adminOnly ? ' · เฉพาะแอดมิน' : ' · ผู้เล่นทุกคนเข้าได้');
        }
      }
      const badge = btn.querySelector('.vw2-source-badge');
      if(badge){
        const text = sourceBadge(source);
        badge.textContent = text;
        badge.hidden = !text;
      }
      if(btn.dataset.vw2MirrorVisibility === '1') btn.hidden = !sourceVisible(source);
      if(btn.dataset.vw2Action === 'cure'){
        let sick = !!(source && source.classList.contains('cure-alert'));
        try{ sick = sick || !!(typeof state !== 'undefined' && state && Array.isArray(state.pets) && state.pets.some(p=>p && p.sick)); }catch(_){ }
        btn.classList.toggle('is-pet-sick', sick);
        btn.setAttribute('aria-label', sick ? 'รักษาสัตว์เลี้ยงที่กำลังป่วย' : 'รักษาสัตว์เลี้ยง');
        btn.title = sick ? 'มีสัตว์เลี้ยงป่วย — แตะเพื่อรักษาทันที' : 'ยังไม่มีสัตว์เลี้ยงที่ต้องรักษา';
      }
    });
    syncRuntimeActionParity();
  }
  function playPetWelcome(){
    if(!root) return;
    const pet = document.getElementById('vw2-pet');
    const sparkles = root.querySelector('.vw2-pet-sparkles');
    if(!pet) return;
    clearTimeout(welcomeTimer);
    pet.classList.remove('vw2-welcome');
    if(sparkles) sparkles.classList.remove('vw2-welcome-burst');
    void pet.offsetWidth;
    pet.classList.add('vw2-welcome');
    if(sparkles) sparkles.classList.add('vw2-welcome-burst');
    welcomeTimer = setTimeout(()=>{
      pet.classList.remove('vw2-welcome');
      if(sparkles) sparkles.classList.remove('vw2-welcome-burst');
    }, 1350);
  }
  function questHTML(){
    if(typeof state === 'undefined' || !state) return {html:'<div class="vw2-empty">ยังไม่มีข้อมูลภารกิจ</div>',done:0,total:0};
    try{
      const qs = typeof questsToday === 'function' ? questsToday() : [];
      const qstate = state.quests || {prog:{},done:[]};
      const doneIds = Array.isArray(qstate.done) ? qstate.done : [];
      const cards = qs.slice(0,3).map(q=>{
        const done = doneIds.includes(q.id);
        const current = Math.min(Number(q.target)||0, Number((qstate.prog||{})[q.id])||0);
        const target = Number(q.target)||1;
        const pct = done ? 100 : Math.max(0,Math.min(100,Math.round(current/target*100)));
        return `<button class="vw2-quest-row${done?' done':''}" data-vw2-action="classic" title="เปิดหน้าล็อบบี้เดิมเพื่อทำภารกิจ">
          <span class="vw2-qemoji">${icon('quest')}</span>
          <span class="vw2-qbody"><b>${htmlEscape(q.name || 'ภารกิจ')}</b><i><u style="width:${pct}%"></u></i></span>
          <span class="vw2-qscore">${done?icon('check'):`${current}/${target}`}</span>
        </button>`;
      }).join('');
      return {html:cards || '<div class="vw2-empty">วันนี้ยังไม่มีภารกิจ</div>',done:doneIds.length,total:qs.length};
    }catch(_){
      return {html:`<div class="vw2-empty">${htmlEscape(textOf('#quest-card','กำลังโหลดภารกิจ…'))}</div>`,done:0,total:0};
    }
  }
  function marketFeedCardsHTML(){
    const ready = typeof Online !== 'undefined' && Online && Online.marketOk === true;
    const items = ready && Array.isArray(Online.market) ? Online.market : [];
    const count = items.length;
    let html = `<div class="vw2-feed-market-divider"><b>🏪 สินค้าใหม่ในตลาด</b><span>${ready ? `${count} ชิ้น` : 'กำลังเชื่อมต่อ…'}</span></div>`;
    if(!ready){
      return html + `<div class="vw2-feed-market-note">กำลังโหลดประกาศขายจากผู้เล่นทุกคน…</div>`;
    }
    if(!count){
      return html + `<button type="button" class="vw2-feed-market-note" data-vw2-action="market">ยังไม่มีสินค้าลงขาย · แตะเพื่อเปิดตลาด</button>`;
    }
    const me = (typeof onlineKey === 'function') ? onlineKey() : '';
    for(const item of items){
      try{
        const c = typeof collectInfo === 'function' ? collectInfo(item.id) : null;
        if(!c) continue;
        const img = typeof collectImg === 'function' ? collectImg(item.id) : '';
        const own = item.sid === me;
        const name = cleanText(c.name || item.id || 'สินค้า',34);
        const seller = cleanText(item.sn || 'ผู้เล่น',32);
        const price = typeof fmtNum === 'function' ? fmtNum(Number(item.p)||0) : fmt(Number(item.p)||0);
        const art = img
          ? `<img src="${htmlEscape(img)}" alt="" loading="lazy" decoding="async">`
          : `<span>${htmlEscape(c.emoji || '🎁')}</span>`;
        html += `<button type="button" class="vw2-feed-card vw2-market-feed-card${own?' is-own':''}" data-vw2-action="market" data-vw2-market-key="${htmlEscape(item.key || '')}" aria-label="${own?'ดูประกาศของฉัน':'ซื้อ'} ${htmlEscape(name)} ราคา ${htmlEscape(price)} เหรียญ">
          <span class="vw2-feed-product">${art}</span>
          <span class="vw2-feed-copy"><span class="vw2-feed-card-head"><b>${htmlEscape(name)}</b><small>🪙 ${htmlEscape(price)}</small></span><span class="vw2-market-seller">${own?'ร้านของฉัน':`ร้านของ ${htmlEscape(seller)}`}</span><span class="vw2-feed-reaction">${own?'ประกาศขายของฉัน':'แตะเพื่อซื้อ · กรอกรหัส 6 หลัก'}</span></span>
        </button>`;
      }catch(_){ }
    }
    return html;
  }
  function feedCardsFromAuthoritativeSource(){
    const host = document.getElementById('vw2-feed-items');
    if(!host) return;
    try{
      const seen = new Set();
      const posts = Array.from(document.querySelectorAll('#feed-list .fpost:not(.fp-clone)')).filter(p=>{
        const k = p.dataset && p.dataset.key ? p.dataset.key : (p.textContent || '');
        if(seen.has(k)) return false;
        seen.add(k); return true;
      }).slice(0,5);
      const marketHtml = marketFeedCardsHTML();
      let html = '';
      for(const post of posts){
        const name = cleanText((post.querySelector('.fp-name')||{}).textContent || post.dataset.n || 'เพื่อน',28);
        const when = cleanText((post.querySelector('.fp-when')||{}).textContent || '',20);
        const tx = cleanText((post.querySelector('.fp-text')||{}).textContent || '',94);
        const sum = cleanText((post.querySelector('.fp-sum')||{}).textContent || '',42);
        const fid = post.dataset && post.dataset.fid ? post.dataset.fid : '';
        let ava = icon('sparkle');
        try{ if(fid && typeof photoMiniHTML === 'function') ava = photoMiniHTML(fid,'vw2-feed-source-avatar') || ava; }catch(_){ }
        html += `<article class="vw2-feed-card"><div class="vw2-feed-avatar">${ava}</div><div class="vw2-feed-copy"><div class="vw2-feed-card-head"><b>${htmlEscape(name)}</b><small>${htmlEscape(when)}</small></div><p>${htmlEscape(tx || 'กิจกรรมใหม่ใน Vocab World')}</p>${sum ? `<span class="vw2-feed-reaction">${htmlEscape(sum)}</span>` : ''}</div></article>`;
      }
      if(!html){
        const fallback = cleanText(textOf('#feed-list','ยังไม่มีกิจกรรมใหม่ — เริ่มเล่นเกมเพื่อสร้างเรื่องราวของวันนี้!'),105);
        html = `<div class="vw2-feed-card vw2-feed-card-empty"><div class="vw2-feed-avatar">${icon('sparkle')}</div><div class="vw2-feed-copy"><div class="vw2-feed-card-head"><b>กิจกรรมล่าสุด</b><small>ตอนนี้</small></div><p>${htmlEscape(fallback)}</p><span class="vw2-feed-reaction">♡ เพื่อน · 💬 ความคิดเห็น</span></div></div>`;
      }
      html = marketHtml + html;
      if(host.dataset.vw2Html !== html){ host.innerHTML = html; host.dataset.vw2Html = html; }
    }catch(_){ }
  }
  function petStatusText(p){
    if(!p) return 'ฝึกคำศัพท์ · สะสมเหรียญ · เติบโตไปด้วยกัน';
    if(p.sick) return 'น้องกำลังพักรักษาตัว · ดูแลให้น้องหายดีนะ';
    if(p.sleeping) return 'น้องกำลังหลับปุ๋ย · พักผ่อนเพื่อผจญภัยต่อ';
    const parts = [];
    try{
      if(typeof petStage === 'function'){
        const stage = petStage(p);
        if(stage === 'egg') parts.push('กำลังฟักไข่');
        else if(stage === 'baby') parts.push('กำลังเติบโต');
        else if(stage === 'adult') parts.push('พร้อมผจญภัย');
      }
    }catch(_){ }
    if(typeof p.hunger === 'number') parts.push(`ความอิ่ม ${Math.max(0,Math.min(100,Math.round(p.hunger)))}%`);
    parts.push('ฝึกคำศัพท์ · สะสมเหรียญ');
    return parts.join(' · ');
  }
  function onlineAvatarHTML(uid){
    try{
      if(uid && typeof photoMiniHTML === 'function'){
        const out = photoMiniHTML(uid,'vw2-online-avatar');
        if(out) return out;
      }
    }catch(_){ }
    return icon('friends');
  }
  function onlineGradeHTML(uid, grade){
    try{
      if(typeof gradeMark === 'function'){
        const resolved = (typeof gradeOf === 'function') ? gradeOf(uid, grade) : grade;
        return gradeMark(resolved, 'vw2-online-grade') || '';
      }
    }catch(_){ }
    return '';
  }
  function onlineNameParts(raw){
    try{
      if(typeof splitNameBadges === 'function'){
        const out = splitNameBadges(raw || '');
        return {name:completeText(out.name || raw, 'ผู้เล่น'), badges:completeText(out.badges || '')};
      }
    }catch(_){ }
    return {name:completeText(raw, 'ผู้เล่น'), badges:''};
  }
  function onlineRowHTML(user, isSelf){
    const uid = String(user.id || '');
    const rawName = user.n || user.name || 'ผู้เล่น';
    const np = onlineNameParts(rawName);
    const grade = user.g || '';
    const act = completeText(user.act, isSelf ? 'กำลังเล่นอยู่ตอนนี้' : 'กำลังเล่น Vocab World');
    const badge = np.badges ? `<span class="vw2-online-badges">${htmlEscape(np.badges)}</span>` : '';
    return `<button type="button" class="vw2-online-row${isSelf?' is-self':''}" data-vw2-online-fid="${htmlEscape(uid)}" data-vw2-online-name="${htmlEscape(rawName)}" data-vw2-online-grade="${htmlEscape(grade)}"${isSelf?' data-vw2-online-self="1"':''}>
      <span class="vw2-online-avatar-wrap">${onlineAvatarHTML(uid)}<i class="vw2-online-dot" aria-hidden="true"></i></span>
      <span class="vw2-online-copy"><span class="vw2-online-name-line"><b>${htmlEscape(np.name)}</b>${badge}${onlineGradeHTML(uid,grade)}</span><small>${htmlEscape(act)}</small></span>
    </button>`;
  }
  function renderOnlinePlayersModal(users, connected){
    const host = document.getElementById('vw2-online-modal-list');
    const count = document.getElementById('vw2-online-modal-count');
    if(count) count.textContent = connected ? `${users.length} คน` : '—';
    if(!host) return;
    const signature = connected ? users.map(u=>[u.id,u.n,u.g,u.act,u.self?'1':'0']).join('|') : 'offline';
    if(host.dataset.vw2Signature === signature) return;
    host.dataset.vw2Signature = signature;
    host.innerHTML = connected
      ? (users.map(u=>onlineRowHTML(u,!!u.self)).join('') || '<div class="vw2-online-note">ยังไม่มีผู้เล่นออนไลน์</div>')
      : '<div class="vw2-online-note"><b>กำลังเชื่อมต่อออนไลน์จริง…</b><span>รายชื่อจะปรากฏเมื่อ Firebase presence พร้อมใช้งาน</span></div>';
  }
  function openOnlinePlayersModal(){
    syncOnlineUsers();
    const modal = document.getElementById('vw2-online-modal');
    if(!modal) return false;
    renderOnlinePlayersModal(latestOnlineUsers, latestOnlineConnected);
    modal.hidden = false;
    modal.setAttribute('aria-hidden','false');
    document.body.classList.add('vw2-online-modal-open');
    setTimeout(()=>modal.querySelector('.vw2-online-modal-close.top')?.focus(),0);
    return true;
  }
  function closeOnlinePlayersModal(){
    const modal = document.getElementById('vw2-online-modal');
    if(!modal) return false;
    modal.hidden = true;
    modal.setAttribute('aria-hidden','true');
    document.body.classList.remove('vw2-online-modal-open');
    root?.querySelector('[data-vw2-action="onlinePlayers"]')?.focus();
    return true;
  }
  function syncOnlineUsers(){
    const host = document.getElementById('vw2-online-list');
    if(!host) return {count:'—', firstName:'', firstText:''};
    let connected = false;
    let users = [];
    try{
      connected = !!(typeof Online !== 'undefined' && Online && Online.ready);
      if(connected){
        const meUid = (typeof onlineKey === 'function') ? onlineKey() : '';
        const meName = (typeof state !== 'undefined' && state && state.profileName) ? state.profileName : 'ผู้เล่น';
        const meGrade = (typeof state !== 'undefined' && state && state.student) ? (state.student.grade || '') : '';
        let meBadges = '';
        try{ if(typeof badgeSuffix === 'function') meBadges = badgeSuffix() || ''; }catch(_){ }
        let meAct = 'กำลังเล่นอยู่ตอนนี้';
        try{ if(typeof onlineActivity === 'function') meAct = onlineActivity() || meAct; }catch(_){ }
        users.push({id:meUid,n:meName + meBadges,g:meGrade,act:meAct,self:true});
        const friends = Array.isArray(Online.friends) ? Online.friends : [];
        for(const f of friends) users.push({id:f.id,n:f.n || f.name || 'ผู้เล่น',g:f.g || '',act:f.act || 'กำลังเล่น Vocab World',self:false});
      }
    }catch(_){ connected = false; users = []; }
    latestOnlineUsers = users.slice();
    latestOnlineConnected = connected;
    renderOnlinePlayersModal(users, connected);
    const signature = connected ? users.map(u=>[u.id,u.n,u.g,u.act]).join('|') : 'offline';
    if(host.dataset.vw2Signature !== signature){
      host.dataset.vw2Signature = signature;
      if(connected){
        host.innerHTML = users.map(u=>onlineRowHTML(u, !!u.self)).join('') || '<div class="vw2-online-note">ยังไม่มีผู้เล่นออนไลน์</div>';
        try{
          if(typeof initSideScroll === 'function') setTimeout(()=>{ try{ initSideScroll(host); }catch(_){ } },0);
        }catch(_){ }
      }else{
        host.innerHTML = '<div class="vw2-online-note"><b>กำลังเชื่อมต่อออนไลน์จริง…</b><span>รายชื่อจะปรากฏเมื่อ Firebase presence พร้อมใช้งาน</span></div>';
      }
    }
    const first = users.find(u=>!u.self) || users[0] || null;
    const firstParts = first ? onlineNameParts(first.n) : {name:'',badges:''};
    return {count:connected ? String(users.length) : '—', firstName:firstParts.name, firstText:first ? first.act : ''};
  }
  function syncRewardPlaque(){
    const card = root ? root.querySelector('.vw2-reward-card') : null;
    if(!card) return;
    const titleEl = card.querySelector('#vw2-reward-title');
    const infoEl = card.querySelector('#vw2-reward-info');
    const source = document.querySelector('#btn-rail-trophy');
    const sourceTitle = cleanText(source ? source.textContent : '', 24) || 'ตู้เข็ม';
    const rankText = cleanText(textOf('#rank-tab',''), 48);
    if(titleEl) titleEl.textContent = sourceTitle;
    if(infoEl){
      infoEl.textContent = rankText;
      infoEl.hidden = !rankText;
    }
    card.classList.toggle('is-compact', !rankText);
    card.dataset.vw2AuthoritativeInfo = rankText ? 'rank-tab' : 'collapsed';
  }
  function sync(){
    if(!root || !adminAllowed()) return;
    const name = (typeof state !== 'undefined' && state && state.profileName) ? state.profileName : textOf('#student-chip','ผู้เล่น');
    const uid = (typeof onlineKey === 'function') ? onlineKey() : '';
    const id = (typeof idTag === 'function') ? idTag(uid) : '';
    const coins = (typeof state !== 'undefined' && state) ? state.coins : textOf('#coin-count','0');
    const today = (typeof state !== 'undefined' && state && state.daily) ? state.daily.coins : textOf('#coin-today','0');
    let worth = coins;
    try{ if(typeof netWorth === 'function') worth = netWorth(); }catch(_){ }
    const setText=(idName,value)=>{ const el=document.getElementById(idName); if(el){ const next=String(value == null ? '' : value); if(el.textContent !== next) el.textContent=next; } };
    const setTopNumber=(idName,value)=>{
      const el=document.getElementById(idName);
      if(!el) return;
      const full=fmt(value);
      const shown=fmtTopValue(value);
      if(el.textContent !== shown) el.textContent=shown;
      el.title=full;
      el.dataset.vw2FullValue=full;
    el.dataset.vw2Compact = shown === full ? '0' : '1';
    };
    setText('vw2-name', cleanText(name,28));
    setText('vw2-id', id || 'ID —');
    setTopNumber('vw2-coins', coins);
    setTopNumber('vw2-today', today);
    setTopNumber('vw2-worth', worth);
    const onlineEarn = liveEarnValue('online');
    const compEarn = liveEarnValue('computer');
    setTopNumber('vw2-online-earn', onlineEarn);
    setTopNumber('vw2-comp-earn', compEarn);
    setText('vw2-online-status', liveEarnStatus('online'));
    setText('vw2-comp-status', liveEarnStatus('computer'));
    const gradeText = textOf('#grade-line','');
    const grade = (typeof state !== 'undefined' && state && state.student && state.student.grade) ? state.student.grade : '';
    const gradeHost = document.getElementById('vw2-grade');
    if(gradeHost){
      const nextGrade = gradeIdentityHTML(grade, gradeText);
      if(gradeHost.dataset.vw2GradeHtml !== nextGrade){
        gradeHost.innerHTML = nextGrade;
        gradeHost.dataset.vw2GradeHtml = nextGrade;
      }
    }
    let fullDate = textOf('#clock-chip .ck-date','—');
    try{
      const dateOptions = {weekday:'short',day:'numeric',month:'long',year:'numeric'};
      fullDate = new Date(Date.now()).toLocaleDateString('th-TH', typeof thLocaleOpt === 'function' ? thLocaleOpt(dateOptions) : dateOptions);
    }catch(_){ }
    setText('vw2-date', fullDate);
    setText('vw2-clock', textOf('#clock-chip .ck-time', textOf('#clock-chip','วันนี้')));
    const offlineSource = document.getElementById('offline-pill');
    const syncChip = document.getElementById('vw2-sync-state');
    if(syncChip){
      const offline = sourceVisible(offlineSource);
      syncChip.hidden = !offline;
      if(offline) syncChip.textContent = cleanText(offlineSource.textContent, 42) || 'ออฟไลน์ · ยังไม่ sync';
    }
    setText('vw2-rank', textOf('#rank-tab','แรงค์กำลังอัปเดต'));
    syncRewardPlaque();
    syncNewWordCard();
    syncMusicState();
    copyImage('#pass-photo img','vw2-avatar',knightFallback());
    syncPetVisual();
    syncHouseVisual();
    try{
      if(typeof activePet === 'function'){
        const p=activePet();
        const petName = p && p.name ? cleanText(p.name,24) : 'น้องของฉัน';
        setText('vw2-pet-name', petName);
        setText('vw2-pet-greeting', `${petName} ดีใจที่ได้เจอหนูอีกครั้ง!`);
        setText('vw2-pet-state', petStatusText(p));
        setText('vw2-action-pet-name', p ? petName : 'ยังไม่มีสัตว์');
        const renameButton = root?.querySelector('[data-vw2-action="petRename"]');
        if(renameButton){
          renameButton.title = p ? `เปลี่ยนชื่อ ${petName}` : 'ไปเลือกรับสัตว์เลี้ยงตัวแรก';
          renameButton.setAttribute('aria-label', renameButton.title);
        }
      }
    }catch(_){ }
    const petCount = ownedPets().length;
    setText('vw2-owned-pet-count', petCount ? `สัตว์ของฉัน ${petCount} ตัว` : 'ยังไม่มีสัตว์');
    const ownedButton = root?.querySelector('[data-vw2-action="ownedPets"]');
    if(ownedButton){
      ownedButton.title = petCount ? `ดูสัตว์เลี้ยงที่ซื้อไว้ ${petCount} ตัว` : 'ไปเลือกรับสัตว์เลี้ยงตัวแรก';
      ownedButton.setAttribute('aria-label', ownedButton.title);
    }
    if(document.getElementById('vw2-pet-modal')?.hidden === false) syncOwnedPetsModal();
    feedCardsFromAuthoritativeSource();
    const likes = (typeof state !== 'undefined' && state && state.feedLikes != null) ? fmt(state.feedLikes) : 'เพื่อน';
    setText('vw2-feed-likes', likes);
    const q = questHTML();
    const qs = document.getElementById('vw2-quests');
    if(qs && qs.dataset.vw2Html !== q.html){ qs.innerHTML = q.html; qs.dataset.vw2Html = q.html; }
    setText('vw2-quest-count', `${Math.min(q.done,q.total)}/${q.total}`);
    const qb = document.getElementById('vw2-quest-bar');
    if(qb) qb.style.width = (q.total ? Math.min(100,(q.done/q.total)*100) : 0) + '%';
    const onlineView = syncOnlineUsers();
    setText('vw2-online-count', onlineView.count === '—' ? '—' : `${onlineView.count} คน`);
    setText('vw2-online-name', onlineView.firstName || 'กำลังเชื่อมต่อ…');
    setText('vw2-online-text', onlineView.firstText || 'เล่นและเรียนไปพร้อมกัน');
    syncSourceParity();
    syncLayoutProfile();
  }
  function localPreviewFrameActive(){
    if(window.parent === window) return false;
    const host = String(location.hostname || '').toLowerCase();
    return host === '127.0.0.1' || host === 'localhost' || host === '::1';
  }
  function visibleRect(el){
    if(!el) return null;
    const cs = getComputedStyle(el);
    if(cs.display === 'none' || cs.visibility === 'hidden') return null;
    const r = el.getBoundingClientRect();
    if(r.width < 1 || r.height < 1) return null;
    return {left:r.left,top:r.top,right:r.right,bottom:r.bottom,width:r.width,height:r.height};
  }
  function rectsOverlap(a,b){
    return !!(a && b && Math.min(a.right,b.right)-Math.max(a.left,b.left) > 1 && Math.min(a.bottom,b.bottom)-Math.max(a.top,b.top) > 1);
  }
  function reportLocalPreviewMetrics(){
    if(!localPreviewFrameActive()) return;
    const r = document.getElementById(ROOT_ID);
    const shell = r ? r.querySelector('.vw2-shell') : null;
    const left = r ? r.querySelector('.vw2-left') : null;
    const bottom = r ? r.querySelector('.vw2-bottom') : null;
    const bottomScroll = r ? r.querySelector('.vw2-bottom-scroll') : null;
    const bottomTrack = r ? r.querySelector('.vw2-bottom-track') : null;
    const featureActionScroll = r ? r.querySelector('.vw2-feature-action-scroll') : null;
    const featureActionTrack = r ? r.querySelector('.vw2-feature-action-track') : null;
    const leftCue = left ? left.querySelector('.vw2-left-scroll-cue') : null;
    const areas = r ? [
      ['left',r.querySelector('.vw2-left')],['feed',r.querySelector('.vw2-feed')],
      ['feature',r.querySelector('.vw2-feature')],['right',r.querySelector('.vw2-right')]
    ] : [];
    const overlaps = [];
    for(let i=0;i<areas.length;i++) for(let j=i+1;j<areas.length;j++){
      if(rectsOverlap(visibleRect(areas[i][1]), visibleRect(areas[j][1]))) overlaps.push(`${areas[i][0]}:${areas[j][0]}`);
    }
    const sourceNodes = r ? Array.from(r.querySelectorAll('[data-vw2-source]')) : [];
    const missingSources = sourceNodes.filter(el=>{
      try{ return !el.dataset.vw2Source || !document.querySelector(el.dataset.vw2Source); }
      catch(_){ return true; }
    }).map(el=>el.dataset.vw2Action || '?');
    const rootStyle = r ? getComputedStyle(r) : null;
    const shellStyle = shell ? getComputedStyle(shell) : null;
    const leftStyle = left ? getComputedStyle(left) : null;
    const bottomStyle = bottom ? getComputedStyle(bottom) : null;
    const bottomScrollStyle = bottomScroll ? getComputedStyle(bottomScroll) : null;
    const featureActionScrollStyle = featureActionScroll ? getComputedStyle(featureActionScroll) : null;
    const bottomModes = bottomTrack ? Array.from(bottomTrack.querySelectorAll('.vw2-mode')) : [];
    const learningActions = ['vocabbook','ielts','toeic','toefl','onetp6','onetm3','onetm6','cats','play','picmatch','picdict','picquiz','bandexam'];
    const allLearningRoutesPresent = bottomModes.length === learningActions.length && learningActions.every(actionName=>bottomTrack?.querySelector(`[data-vw2-action="${actionName}"]`));
    const bottomModeHeights = bottomModes.map(el=>el.getBoundingClientRect().height);
    const bottomButtonGeometryStable = bottomModeHeights.length === 13 && Math.max(...bottomModeHeights) - Math.min(...bottomModeHeights) <= 1;
    const bottomIconCenterErrors = bottomModes.map(el=>{
      const iconNode = el.querySelector(':scope>span');
      if(!iconNode) return Infinity;
      const buttonBox = el.getBoundingClientRect();
      const iconBox = iconNode.getBoundingClientRect();
      return Math.abs((iconBox.top + iconBox.bottom - buttonBox.top - buttonBox.bottom) / 2);
    });
    const bottomLabelCenterErrors = bottomModes.map(el=>{
      const labelNode = el.querySelector(':scope>b');
      if(!labelNode) return Infinity;
      const buttonBox = el.getBoundingClientRect();
      const labelBox = labelNode.getBoundingClientRect();
      return Math.abs((labelBox.top + labelBox.bottom - buttonBox.top - buttonBox.bottom) / 2);
    });
    const bottomViewportBox = bottomScroll ? bottomScroll.getBoundingClientRect() : null;
    const bottomPartiallyVisibleActions = bottomViewportBox ? bottomModes.filter(el=>{
      const box = el.getBoundingClientRect();
      const visibleWidth = Math.min(box.right,bottomViewportBox.right)-Math.max(box.left,bottomViewportBox.left);
      return visibleWidth > 1 && (box.left < bottomViewportBox.left-1 || box.right > bottomViewportBox.right+1);
    }).map(el=>el.dataset.vw2Action || '?') : [];
    const bottomFullyVisibleActionCount = bottomViewportBox ? bottomModes.filter(el=>{ const box=el.getBoundingClientRect(); return box.left >= bottomViewportBox.left-1 && box.right <= bottomViewportBox.right+1; }).length : 0;
    const rootBox = r ? r.getBoundingClientRect() : null;
    const readableNodes = r ? Array.from(r.querySelectorAll('.vw2-tool-btn b,.vw2-section-head strong,.vw2-feed-copy p,.vw2-qbody b,.vw2-online-name-line>b,.vw2-mode')) : [];
    const readableSizes = readableNodes.map(el=>parseFloat(getComputedStyle(el).fontSize) || 0).filter(Boolean);
    const minReadableFontPx = readableSizes.length ? Math.min(...readableSizes) : null;
    const importantValueNodes = r ? Array.from(r.querySelectorAll('.vw2-stat-copy b')) : [];
    const importantValueClipped = importantValueNodes.filter(el=>{
      const cs = getComputedStyle(el);
      return cs.textOverflow === 'ellipsis' || (cs.overflowX !== 'visible' && el.scrollWidth > el.clientWidth + 1);
    }).map(el=>el.id || el.closest('.vw2-wallet-pill')?.className || '?');
    const identityTextClipped = ['vw2-id','vw2-date','vw2-clock'].filter(id=>{
      const el = document.getElementById(id);
      return !!(el && el.scrollWidth > el.clientWidth + 1);
    });
    const visiblePet = document.getElementById('vw2-pet');
    const evidenceToken = el => {
      if(!el) return '?';
      const action = el.dataset && el.dataset.vw2Action ? `[action=${el.dataset.vw2Action}]` : '';
      const id = el.id ? `#${el.id}` : '';
      const cls = typeof el.className === 'string' ? '.' + el.className.trim().split(/\s+/).slice(0,3).join('.') : '';
      const text = cleanText(el.textContent || '', 48);
      return `${id}${cls}${action}${text ? ` :: ${text}` : ''}` || el.tagName.toLowerCase();
    };
    const clipCandidates = r ? Array.from(r.querySelectorAll('[data-vw2-action],.vw2-mode,.vw2-rail-btn,.vw2-friends-btn,.vw2-reward-card,.vw2-section-head strong,.vw2-stat-copy small,.vw2-stat-copy b,.vw2-tool-btn b,.vw2-online-row,.vw2-feed-card,.vw2-quest-row')) : [];
    const clippingOffenders = clipCandidates.map(el=>{
      const rect = el.getBoundingClientRect();
      const cs = getComputedStyle(el);
      const outside = Math.max(0,-rect.left,-rect.top,rect.right-window.innerWidth,rect.bottom-window.innerHeight);
      const innerX = ['hidden','clip','auto'].includes(cs.overflowX) ? Math.max(0,el.scrollWidth-el.clientWidth) : 0;
      const innerY = ['hidden','clip','auto'].includes(cs.overflowY) ? Math.max(0,el.scrollHeight-el.clientHeight) : 0;
      const amount = Math.max(outside,innerX,innerY);
      return amount > 2 ? {token:evidenceToken(el),amountPx:Math.round(amount*10)/10,outsidePx:Math.round(outside*10)/10,internalXPx:innerX,internalYPx:innerY} : null;
    }).filter(Boolean).sort((a,b)=>b.amountPx-a.amountPx);
    const bottomClipOffenders = bottomModes.map(el=>{
      const dy = Math.max(0,el.scrollHeight-el.clientHeight);
      const dx = Math.max(0,el.scrollWidth-el.clientWidth);
      return Math.max(dx,dy) > 2 ? {action:el.dataset.vw2Action || '?',internalXPx:dx,internalYPx:dy,heightPx:Math.round(el.getBoundingClientRect().height*10)/10} : null;
    }).filter(Boolean);
    const textNodes = r ? Array.from(r.querySelectorAll('.vw2-top small,.vw2-top b,.vw2-top strong,.vw2-top .vw2-tool-btn b,.vw2-section-head strong,.vw2-friends-btn')) : [];
    const importantTextBelow14 = textNodes.filter(el=>{
      const cs=getComputedStyle(el);
      const rect=el.getBoundingClientRect();
      return cs.display !== 'none' && cs.visibility !== 'hidden' && rect.width > 1 && rect.height > 1 && (parseFloat(cs.fontSize)||0) < 14;
    }).map(el=>({token:evidenceToken(el),fontPx:Math.round((parseFloat(getComputedStyle(el).fontSize)||0)*10)/10})).sort((a,b)=>a.fontPx-b.fontPx);
    const interactiveAspectOffenders = r ? Array.from(r.querySelectorAll('button,[role="button"],a')).map(el=>{
      const rect=el.getBoundingClientRect();
      if(rect.width < 12 || rect.height < 12) return null;
      const ratio=Math.max(rect.width/rect.height,rect.height/rect.width);
      return ratio > 7.5 ? {token:evidenceToken(el),ratio:Math.round(ratio*100)/100,widthPx:Math.round(rect.width),heightPx:Math.round(rect.height)} : null;
    }).filter(Boolean).sort((a,b)=>b.ratio-a.ratio) : [];
    const lastRailAction = left ? Array.from(left.querySelectorAll('.vw2-rail-btn')).at(-1) : null;
    const leftRect = visibleRect(left);
    const bottomRect = visibleRect(bottom);
    const lastBottomClearance = lastRailAction && left ? Math.max(0,left.scrollHeight-(lastRailAction.offsetTop+lastRailAction.offsetHeight)) : null;
    const onlinePanel = r ? r.querySelector('.vw2-online') : null;
    const friendsButton = r ? r.querySelector('.vw2-friends-btn') : null;
    const onlineRect = visibleRect(onlinePanel);
    const friendsRect = visibleRect(friendsButton);
    const onlineFooterContained = !!(onlineRect && friendsRect && friendsRect.left >= onlineRect.left-1 && friendsRect.right <= onlineRect.right+1 && friendsRect.top >= onlineRect.top-1 && friendsRect.bottom <= onlineRect.bottom+1);
    const feedPanel = r ? r.querySelector('.vw2-feed') : null;
    const feedHead = feedPanel ? feedPanel.querySelector('.vw2-section-head') : null;
    const feedItems = feedPanel ? feedPanel.querySelector('.vw2-feed-items') : null;
    const feedCoin = feedPanel ? feedPanel.querySelector('.vw2-feed-coin') : null;
    const feedRect = visibleRect(feedPanel);
    const feedHeadRect = visibleRect(feedHead);
    const feedItemsRect = visibleRect(feedItems);
    const feedCoinRect = visibleRect(feedCoin);
    const insideFeed = box=>!!(feedRect && box && box.left >= feedRect.left-1 && box.right <= feedRect.right+1 && box.top >= feedRect.top-1 && box.bottom <= feedRect.bottom+1);
    const feedFrameStyle = feedPanel ? getComputedStyle(feedPanel,'::after') : null;
    const rewardCard = r ? r.querySelector('.vw2-reward-card') : null;
    const rewardInfo = r ? r.querySelector('#vw2-reward-info') : null;
    window.parent.postMessage({
      type:'vw-mobile-device-preview-metrics',
      viewport:{width:window.innerWidth,height:window.innerHeight,dpr:window.devicePixelRatio || 1},
      homeV2:{
        present:!!r,visible:!!(r && !r.hidden && dashboardActive()),adminAllowed:adminAllowed(),
        layoutProfile:r ? r.dataset.vw2LayoutProfile || '' : '',
        rootWidth:rootBox ? Math.round(rootBox.width) : null,rootHeight:rootBox ? Math.round(rootBox.height) : null,
        horizontalOverflow:r ? r.scrollWidth > r.clientWidth + 1 : null,
        verticalOverflow:r ? r.scrollHeight > r.clientHeight + 1 : null,
        pageOverflow:(document.documentElement.scrollWidth > window.innerWidth + 1) || (document.documentElement.scrollHeight > window.innerHeight + 1),
        pageHorizontalOverflow:document.documentElement.scrollWidth > window.innerWidth + 1,
        locked:!!(r && shell && rootStyle && shellStyle && !['auto','scroll'].includes(rootStyle.overflowY) && !['auto','scroll'].includes(shellStyle.overflowY) && shell.scrollHeight <= shell.clientHeight + 1),
        panelOverlaps:overlaps,
        actionSources:{total:sourceNodes.length,missing:missingSources},
        minReadableFontPx:minReadableFontPx == null ? null : Math.round(minReadableFontPx * 10) / 10,
        importantValueClipped,
        identityTextClipped,
        fullPlayerIdVisible:!identityTextClipped.includes('vw2-id'),
        fullDateVisible:!identityTextClipped.includes('vw2-date'),
        petPatBound:!!(visiblePet && visiblePet.dataset.vw2PatBound === '1'),
        clippingOffenders:clippingOffenders.slice(0,18),
        importantTextBelow14:importantTextBelow14.slice(0,18),
        extremeInteractiveAspectElements:interactiveAspectOffenders.slice(0,18),
        onlineFooterContained,
        feedFrameContained:insideFeed(feedHeadRect) && insideFeed(feedItemsRect) && insideFeed(feedCoinRect),
        feedFrameNineSlice:!!(feedFrameStyle && feedFrameStyle.borderImageSource.includes('r115_frame_feed.webp') && feedFrameStyle.borderImageSlice !== '100%'),
        rewardPlaque:{
          authoritativeSource:rewardCard ? (rewardCard.dataset.vw2AuthoritativeInfo || 'pending') : 'missing',
          secondaryHidden:!!(rewardInfo && rewardInfo.hidden),
          sourceAction:rewardCard ? rewardCard.dataset.vw2Source || '' : ''
        }
      },
      rails:{
        leftScrollable:!!(left && leftStyle && ['auto','scroll'].includes(leftStyle.overflowY) && left.scrollHeight > left.clientHeight + 1),
        leftScrollbarHidden:!!(leftStyle && leftStyle.scrollbarWidth === 'none'),
        leftCueCorrect:!!(left && leftCue && ((left.scrollHeight <= left.clientHeight + 2 && !leftCue.classList.contains('is-visible')) || (left.scrollHeight > left.clientHeight + 2 && (leftCue.classList.contains('is-visible') === (left.scrollTop + left.clientHeight < left.scrollHeight - 2))))),
        bottomScrollable:!!(bottomScroll && bottomScrollStyle && ['auto','scroll'].includes(bottomScrollStyle.overflowX) && bottomScroll.scrollWidth > bottomScroll.clientWidth + 1),
        bottomContained:!!(bottom && bottomStyle && !['auto','scroll'].includes(bottomStyle.overflowX) && bottom.scrollWidth <= bottom.clientWidth + 1 && bottom.scrollHeight <= bottom.clientHeight + 1),
        outerBottomRailContained:!!(bottom && bottomStyle && !['auto','scroll'].includes(bottomStyle.overflowX) && bottom.scrollWidth <= bottom.clientWidth + 1 && bottom.scrollHeight <= bottom.clientHeight + 1),
        bottomScrollWrapperScrollable:!!(bottomScroll && bottomScrollStyle && ['auto','scroll'].includes(bottomScrollStyle.overflowX) && bottomScroll.scrollWidth > bottomScroll.clientWidth + 1),
        bottomScrollWrapperVerticalOverflow:!!(bottomScroll && bottomScroll.scrollHeight > bottomScroll.clientHeight + 1),
        singleRowLearningModesPresent:bottomModes.length === 13,
        all13BottomActionsPresent:allLearningRoutesPresent,
        adventureFlyoutPresent:!!(r && r.querySelector('#vw2-adventure-menu')),
        bottomButtonGeometryStable,
        bottomMinButtonHeightPx:bottomModeHeights.length ? Math.round(Math.min(...bottomModeHeights)*10)/10 : null,
        bottomIconMaxCenterErrorPx:bottomIconCenterErrors.length ? Math.round(Math.max(...bottomIconCenterErrors)*10)/10 : null,
        bottomLabelMaxCenterErrorPx:bottomLabelCenterErrors.length ? Math.round(Math.max(...bottomLabelCenterErrors)*10)/10 : null,
        bottomWholeCardPageAligned:bottomPartiallyVisibleActions.length === 0,
        bottomPartiallyVisibleActions,
        bottomFullyVisibleActionCount,
        bottomScrollCueCorrect:!!(bottom && bottomScroll && (bottom.classList.contains('can-scroll-right') === (bottomScroll.scrollLeft < bottomScroll.scrollWidth-bottomScroll.clientWidth-2))),
        bottomClipOffenders,
        leftBottomCollision:rectsOverlap(leftRect,bottomRect),
        leftLastAction:{
          action:lastRailAction ? lastRailAction.dataset.vw2Action || '?' : 'missing',
          bottomClearancePx:lastBottomClearance == null ? null : Math.round(lastBottomClearance*10)/10,
          reachable:!!(lastRailAction && left && (lastRailAction.offsetTop+lastRailAction.offsetHeight <= left.scrollHeight+1))
        },
        bottomCanScrollLeft:!!(bottomScroll && bottomScroll.scrollLeft > 2),
        bottomCanScrollRight:!!(bottomScroll && bottomScroll.scrollLeft + bottomScroll.clientWidth < bottomScroll.scrollWidth - 2),
        featureActionCount:featureActionTrack ? featureActionTrack.querySelectorAll('[data-vw2-action]').length : 0,
        featureActionScrollable:!!(featureActionScroll && featureActionScrollStyle && ['auto','scroll'].includes(featureActionScrollStyle.overflowX) && featureActionScroll.scrollWidth > featureActionScroll.clientWidth + 1),
        featureActionVerticalOverflow:!!(featureActionScroll && featureActionScroll.scrollHeight > featureActionScroll.clientHeight + 1),
        featureActionCanScrollRight:!!(featureActionScroll && featureActionScroll.scrollLeft + featureActionScroll.clientWidth < featureActionScroll.scrollWidth - 2)
      }
    }, '*');
  }
  function scheduleLocalPreviewReport(){
    if(!localPreviewFrameActive()) return;
    clearTimeout(previewReportTimer);
    previewReportTimer = setTimeout(reportLocalPreviewMetrics, 90);
  }
  function scheduleSync(){
    clearTimeout(syncTimer);
    syncTimer = setTimeout(()=>{
      if(adminAllowed() && dashboardActive() && previewWanted()) sync();
    }, 120);
  }
  function syncVisibility(){
    const dash = dashboard();
    if(!dash) return;
    const allowed = adminAllowed();
    const active = dashboardActive();
    if(!allowed){
      dash.classList.remove(CLASS_ON);
      document.body.classList.remove('vw2-home-active');
      closeOwnedPetsModal();
      if(root) root.hidden = true;
      if(classicToggle) classicToggle.hidden = true;
      return;
    }
    ensureClassicToggle();
    const showV2 = active && previewWanted();
    // Runtime-safety: build Home V2 lazily only after the real dashboard is
    // active and admin authorization is already known. This keeps all Home
    // V2 work off the startup/loading path.
    if(showV2 && !root) build();
    dash.classList.toggle(CLASS_ON, showV2);
    // Scope presentation-only safety rules (including transient toasts) to Home V2.
    document.body.classList.toggle('vw2-home-active', showV2);
    if(root) root.hidden = !showV2;
    if(!showV2) closeOwnedPetsModal();
    if(classicToggle) classicToggle.hidden = !active || showV2;
    if(showV2 && !v2WasVisible){
      scheduleSync();
      setTimeout(playPetWelcome, 40);
    }
    v2WasVisible = showV2;
    scheduleLocalPreviewReport();
  }
  function tick(){
    syncVisibility();
    if(root && adminAllowed() && dashboardActive() && previewWanted()) sync();
  }
  function init(){
    // No MutationObserver on the classic Lobby. The existing Lobby has
    // animated/ticker DOM that changes frequently; observing its subtree can
    // create a feedback-heavy main-thread workload. A slow, bounded poll is
    // sufficient for this admin-only preview.
    clearInterval(clockTimer);
    clockTimer = setInterval(tick, 2000);
    window.addEventListener('focus', tick);
    window.addEventListener('resize', scheduleLocalPreviewReport);
    setTimeout(tick, 250);
  }
  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, {once:true});
  else init();
})();
