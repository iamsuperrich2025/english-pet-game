"use strict";













/* ============================================================













   Vocab World Home V2 — Admin Preview (Pet Welcome & Complete Metrics Pass)













   ------------------------------------------------------------













   Additive UI shell only. It does NOT own economy, auth, quests,













   Firebase, purchases, or game routing. Existing Lobby DOM stays













   in place and existing buttons/functions remain authoritative.













   ============================================================ */













(function(){













  const ROOT_ID = 'vw-home-v2-root';













  const CLASS_ON = 'vw2-active';













  const SESSION_KEY = 'vwHomeV2PreviewClassic';













  const STYLE_ID = 'vw-home-v2-polish-style';













  let root = null;













  let classicToggle = null;













  let syncTimer = 0;













  let clockTimer = 0;













  let welcomeTimer = 0;













  let previewReportTimer = 0;













  let v2WasVisible = false;













  function adminAllowed(){













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






    install:`<rect x="13" y="7" width="38" height="50" rx="9" class="i-blue"/><rect x="18" y="12" width="28" height="35" rx="5" class="i-white"/><path d="M32 17v20M24 29l8 8 8-8" class="i-line"/><circle cx="32" cy="51" r="2.5" class="i-mint"/>`,













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













  function navButton(actionName, iconName, label, sourceSelector=''){













    return `<button class="vw2-rail-btn" data-vw2-action="${htmlEscape(actionName)}"${sourceAttrs(sourceSelector)}><span class="vw2-rail-art">${icon(iconName)}</span><b class="vw2-rail-label">${htmlEscape(label)}</b><i class="vw2-source-badge" hidden></i></button>`;













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













    if(document.getElementById(STYLE_ID)) return;













    const style = document.createElement('style');













    style.id = STYLE_ID;













    style.textContent = `













#vw-home-v2-root{--ink:#44365f;--deep:#6d55b5;--purple:#9a72ef;--pink:#ff90c9;--blue:#67c8ff;--mint:#72dfb4;--gold:#ffd45f;--cream:#fff8e7;font-family:"Noto Sans Thai","Kanit","Trebuchet MS",system-ui,sans-serif;color:var(--ink);background:linear-gradient(180deg,#45a9f7 0%,#79c9ff 34%,#b5c9ff 63%,#d6b9ff 100%);border:3px solid rgba(255,255,255,.95);box-shadow:inset 0 0 0 2px rgba(105,117,214,.25),0 14px 30px rgba(54,61,148,.28)}













#vw-home-v2-root *{box-sizing:border-box}#vw-home-v2-root button{font:inherit;-webkit-tap-highlight-color:transparent}#vw-home-v2-root button:focus-visible{outline:3px solid #ffe26d;outline-offset:2px}













#vw-home-v2-root .vw2-shell{position:relative;isolation:isolate;height:100%;display:grid;grid-template-rows:92px minmax(0,1fr) 68px;gap:9px;padding:9px 11px 8px;background:radial-gradient(circle at 70% -10%,rgba(255,255,255,.48),transparent 30%),linear-gradient(180deg,rgba(66,170,249,.34),rgba(244,171,225,.22));overflow:hidden}













#vw-home-v2-root .vw2-shell:before,#vw-home-v2-root .vw2-shell:after{content:"";position:absolute;pointer-events:none;z-index:-1}#vw-home-v2-root .vw2-shell:before{inset:0;background:radial-gradient(circle at 8% 9%,#fff 0 1px,transparent 2px),radial-gradient(circle at 20% 21%,#fff 0 2px,transparent 3px),radial-gradient(circle at 62% 8%,#ffe67c 0 2px,transparent 3px),radial-gradient(circle at 86% 20%,#fff 0 2px,transparent 3px),radial-gradient(circle at 94% 8%,#ffc7ec 0 3px,transparent 4px);background-size:170px 130px,230px 170px,260px 190px,310px 210px,370px 250px;opacity:.9}#vw-home-v2-root .vw2-shell:after{left:-8%;right:-8%;bottom:-88px;height:190px;border-radius:50%;background:linear-gradient(180deg,rgba(255,255,255,.4),rgba(164,115,229,.32));filter:blur(2px)}













#vw-home-v2-root .vw2-sky{position:absolute;inset:0;z-index:-1;pointer-events:none;overflow:hidden}#vw-home-v2-root .vw2-sky:before,#vw-home-v2-root .vw2-sky:after{content:"";position:absolute;border-radius:999px;background:rgba(255,255,255,.72);filter:blur(.4px);box-shadow:46px 6px 0 9px rgba(255,255,255,.58),85px -2px 0 3px rgba(255,255,255,.58)}#vw-home-v2-root .vw2-sky:before{width:74px;height:24px;left:27%;top:8%}#vw-home-v2-root .vw2-sky:after{width:88px;height:28px;right:10%;top:13%}#vw-home-v2-root .vw2-sky i{position:absolute;width:9px;height:9px;background:#fff;border-radius:50%;box-shadow:0 0 14px #fff}#vw-home-v2-root .vw2-sky i:nth-child(1){left:8%;top:23%}#vw-home-v2-root .vw2-sky i:nth-child(2){left:52%;top:13%;width:6px;height:6px}#vw-home-v2-root .vw2-sky i:nth-child(3){right:4%;top:36%;width:12px;height:12px;background:#ffe26f}#vw-home-v2-root .vw2-sky i:nth-child(4){left:41%;bottom:8%;width:7px;height:7px;background:#ffb8df}













#vw-home-v2-root .vw2-glass{background:linear-gradient(180deg,rgba(255,255,255,.97),rgba(237,247,255,.93));border:3px solid #fff;box-shadow:0 5px 0 rgba(85,94,191,.24),0 10px 21px rgba(48,73,163,.22),inset 0 0 0 2px rgba(123,143,224,.22),inset 0 2px 0 rgba(255,255,255,.9)}













#vw-home-v2-root [data-vw2-action]{cursor:pointer;transition:transform .12s ease,filter .12s ease,box-shadow .12s ease}#vw-home-v2-root [data-vw2-action]:hover{filter:saturate(1.08) brightness(1.02);transform:translateY(-1px)}#vw-home-v2-root [data-vw2-action]:active{transform:translateY(2px) scale(.985)}#vw-home-v2-root [data-vw2-action]:disabled{cursor:not-allowed;filter:grayscale(.45) opacity(.52);transform:none!important}













#vw-home-v2-root .vw2-icon{display:block;width:1.6em;height:1.6em;overflow:visible;filter:drop-shadow(0 3px 3px rgba(65,54,116,.18))}#vw-home-v2-root .vw2-icon .i-sticker{fill:rgba(255,255,255,.88);stroke:rgba(255,255,255,.98);stroke-width:3}#vw-home-v2-root .vw2-icon .i-gloss{fill:rgba(255,255,255,.38)}#vw-home-v2-root .vw2-icon .i-mini-star{fill:#fff0a3;stroke:#fff;stroke-width:1.4}#vw-home-v2-root .vw2-icon .i-line{fill:none;stroke:#5a4d83;stroke-width:3;stroke-linecap:round;stroke-linejoin:round}#vw-home-v2-root .vw2-icon .i-white-line{fill:none;stroke:#fff;stroke-width:3;stroke-linecap:round;stroke-linejoin:round}#vw-home-v2-root .vw2-icon .i-mint-line{fill:none;stroke:#60c6a4;stroke-width:3;stroke-linecap:round}.vw2-icon .i-pink{fill:#ff92c4}.vw2-icon .i-purple{fill:#9b82f1}.vw2-icon .i-blue{fill:#68c9f5}.vw2-icon .i-mint{fill:#75dbb5}.vw2-icon .i-peach{fill:#ffc58f}.vw2-icon .i-star{fill:#ffd95e}.vw2-icon .i-coin{fill:#ffc441}.vw2-icon .i-coin-hi{fill:#ffed98}.vw2-icon .i-roof{fill:none;stroke:#8065cb;stroke-width:6;stroke-linecap:round;stroke-linejoin:round}.vw2-icon .i-white{fill:#fff}.vw2-icon .i-dot{fill:#5e4e85}













#vw-home-v2-root .vw2-top{position:relative;z-index:2;display:grid;grid-template-columns:minmax(285px,350px) minmax(430px,1fr) auto;gap:10px;align-items:stretch;min-height:0}













#vw-home-v2-root .vw2-profile{position:relative;border-radius:27px;padding:7px 12px 7px 9px;display:flex;align-items:center;gap:10px;overflow:hidden;background:linear-gradient(155deg,#fff 0%,#edf8ff 54%,#f1e8ff 100%)}#vw-home-v2-root .vw2-profile:after{content:"";position:absolute;right:-16px;bottom:-26px;width:100px;height:100px;border-radius:50%;background:radial-gradient(circle,#ffe095 0 8%,transparent 9%),radial-gradient(circle at 65% 40%,rgba(154,123,237,.14),transparent 55%);pointer-events:none}













#vw-home-v2-root .vw2-avatar{width:74px;height:74px;flex:0 0 74px;border-radius:24px;overflow:hidden;display:grid;place-items:center;background:linear-gradient(180deg,#d6f4ff,#f8e5ff);border:4px solid #fff;box-shadow:0 0 0 3px #c7b3ff,0 6px 12px rgba(78,69,142,.24)}#vw-home-v2-root .vw2-avatar img{width:100%;height:100%;object-fit:contain;object-position:center bottom;filter:drop-shadow(0 5px 5px rgba(74,61,120,.18))}#vw-home-v2-root .vw2-avatar .vw2-icon{width:52px;height:52px}













#vw-home-v2-root .vw2-profile-main{min-width:0;flex:1;line-height:1.12}.vw2-name-row{display:flex;align-items:center;gap:5px}.vw2-name-row strong{font-size:18px;font-weight:950;color:#28365f;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.vw2-pencil .vw2-icon{width:21px;height:21px}.vw2-id{display:inline-flex;margin-top:2px;padding:2px 7px;border-radius:999px;background:#cfb8ff;color:#624e9a;font-size:9px;font-weight:900}.vw2-minirow{font-size:9.5px;margin-top:3px;color:#51658e}.vw2-rank{display:inline-block;margin-top:4px;padding:3px 8px;border-radius:999px;background:linear-gradient(90deg,#fff4c6,#ffe09c);font-size:9.5px;font-weight:950;color:#725421;border:1px solid rgba(219,172,59,.28)}













#vw-home-v2-root .vw2-wallet{display:flex;justify-content:center;align-items:center;gap:8px;min-width:0}.vw2-wallet-pill{height:45px;min-width:112px;border:3px solid #fff;border-radius:22px;background:linear-gradient(180deg,#fff,#eaf4ff);box-shadow:0 5px 0 rgba(82,96,184,.18),0 8px 15px rgba(61,75,153,.14),inset 0 2px 0 #fff;display:flex;align-items:center;justify-content:center;gap:6px;padding:3px 11px}.vw2-wallet-pill.coin{background:linear-gradient(180deg,#fff4b8,#ffd46d);color:#6b4b18}.vw2-wallet-pill.coin .vw2-icon{width:35px;height:35px}.vw2-wallet-pill.coin b{font-size:17px;font-weight:950}.vw2-wallet-pill.coin em{font-style:normal;width:20px;height:20px;border-radius:50%;background:#69c94b;color:#fff;display:grid;place-items:center;font-weight:950;border:2px solid #fff}.vw2-wallet-pill.today{background:linear-gradient(180deg,#dff7ff,#afe6ff)}.vw2-wallet-pill.worth{background:linear-gradient(180deg,#f3e9ff,#d7c4ff)}.vw2-wallet-pill.today,.vw2-wallet-pill.worth{flex-direction:column;gap:0;min-width:98px}.vw2-wallet-pill small{font-size:8px;font-weight:800;color:#59668b}.vw2-wallet-pill b{font-weight:950;color:#4b5b93}.vw2-wallet-pill.today b{color:#237bb7}.vw2-wallet-pill.worth b{color:#6d4db2}













#vw-home-v2-root .vw2-top-actions{display:flex;align-items:center;justify-content:flex-end;gap:7px}.vw2-top-actions button{width:46px;height:46px;padding:3px;border:3px solid #fff;border-radius:17px;background:linear-gradient(160deg,#fff,#dfeaff);box-shadow:0 5px 0 rgba(75,83,169,.2),0 8px 15px rgba(67,71,147,.13)}.vw2-top-actions button:nth-child(2){background:linear-gradient(160deg,#fff0fb,#ffcfe9)}.vw2-top-actions button:nth-child(3){background:linear-gradient(160deg,#ecf7ff,#bfe9ff)}.vw2-top-actions button:nth-child(4){background:linear-gradient(160deg,#ecfff7,#c4f0df)}.vw2-top-actions button:nth-child(5){background:linear-gradient(160deg,#fff0e9,#ffd4c4)}.vw2-top-actions .vw2-icon{width:34px;height:34px;margin:auto}.vw2-top-actions .vw2-classic{width:auto;min-width:78px;padding:0 9px;display:flex;align-items:center;gap:3px;font-size:9px;font-weight:950;color:#65528e;background:linear-gradient(180deg,#fff,#eee5ff)}.vw2-top-actions .vw2-classic .vw2-icon{width:24px;height:24px;margin:0}













#vw-home-v2-root .vw2-main-grid{position:relative;z-index:2;display:grid;grid-template-columns:184px 270px minmax(460px,1fr) 315px;gap:9px;min-height:0}













#vw-home-v2-root .vw2-left{border-radius:27px;padding:7px;display:grid;grid-template-columns:repeat(2,minmax(0,1fr));grid-auto-rows:minmax(44px,1fr);gap:5px;min-height:0;overflow:hidden;background:linear-gradient(180deg,rgba(255,255,255,.96),rgba(237,229,255,.93))}.vw2-left .vw2-rail-btn{min-width:0;min-height:0;border:2px solid #fff;border-radius:16px;padding:3px 3px 4px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:0;background:linear-gradient(155deg,#fff,#e8e2ff);box-shadow:0 3px 0 rgba(103,83,174,.22),0 5px 9px rgba(77,71,148,.11);color:#594a84}.vw2-left .vw2-rail-btn:nth-child(4n+2){background:linear-gradient(155deg,#fff,#ffdce9)}.vw2-left .vw2-rail-btn:nth-child(4n+3){background:linear-gradient(155deg,#fff,#d9f5ff)}.vw2-left .vw2-rail-btn:nth-child(4n+4){background:linear-gradient(155deg,#fff,#d9f4e7)}.vw2-left .vw2-rail-btn span{display:grid;place-items:center;height:28px}.vw2-left .vw2-rail-btn .vw2-icon{width:28px;height:28px}.vw2-left .vw2-rail-btn b{display:block;max-width:100%;font-size:8.4px;line-height:1.05;font-weight:950;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;text-align:center}.vw2-left .vw2-rail-btn[data-vw2-action="cannon"] b{font-size:7.7px}













#vw-home-v2-root .vw2-feed{border-radius:27px;padding:10px;display:flex;flex-direction:column;min-height:0;overflow:hidden;background:linear-gradient(180deg,#f6fbff,#eaf6ff 58%,#edf0ff)}.vw2-section-head{display:flex;align-items:center;gap:7px;min-height:31px}.vw2-section-head>.vw2-head-icon{width:35px;height:35px;display:grid;place-items:center;border-radius:14px;background:linear-gradient(180deg,#fff,#dff0ff);box-shadow:0 3px 0 rgba(97,112,192,.16)}.vw2-section-head>.vw2-head-icon .vw2-icon{width:29px;height:29px}.vw2-section-head strong{font-size:13px;font-weight:950;color:#324877;flex:1}.vw2-section-head>button{border:2px solid #fff;border-radius:13px;padding:5px 9px;background:linear-gradient(180deg,#82cfff,#5aaaf0);color:#fff;font-size:8.5px;font-weight:900;box-shadow:0 3px 0 #4d8bc8}.vw2-section-head>b{font-size:10px;background:#fff;border-radius:999px;padding:4px 8px;color:#4c5684}













#vw-home-v2-root .vw2-feed-card{position:relative;margin-top:8px;padding:10px 9px;border:2px solid #fff;border-radius:20px;background:linear-gradient(180deg,#fff,#f6fbff);display:grid;grid-template-columns:42px 1fr;gap:8px;box-shadow:0 5px 0 rgba(93,114,191,.13),0 8px 14px rgba(63,89,168,.1);overflow:hidden}.vw2-feed-card:after{content:"";position:absolute;right:-10px;bottom:-11px;width:84px;height:84px;border-radius:50%;background:radial-gradient(circle,#ffd862 0 29%,#f1b62d 30% 40%,#fff5b1 41% 47%,transparent 48%);opacity:.85}.vw2-feed-avatar{width:42px;height:42px;border-radius:15px;background:linear-gradient(180deg,#e7d8ff,#fff0f7);display:grid;place-items:center;border:2px solid #fff;box-shadow:0 3px 0 rgba(117,91,176,.12)}.vw2-feed-avatar .vw2-icon{width:34px;height:34px}.vw2-feed-card b{font-size:10.5px;font-weight:950;color:#3d4872}.vw2-feed-card p{position:relative;z-index:2;margin:3px 0 0;font-size:9.5px;line-height:1.48;color:#4b5678;display:-webkit-box;-webkit-line-clamp:8;-webkit-box-orient:vertical;overflow:hidden}.vw2-feed-stats{margin-top:auto;display:flex;gap:7px;justify-content:center;padding:7px 0}.vw2-feed-stats span{flex:1;text-align:center;border:2px solid #fff;border-radius:13px;background:linear-gradient(180deg,#fff,#eef5ff);padding:5px 4px;font-size:8.5px;font-weight:850;color:#5e6790;display:flex;align-items:center;justify-content:center;gap:3px}.vw2-feed-stats .vw2-icon{width:18px;height:18px}.vw2-feed-coin{border:2px solid #fff;border-radius:17px;background:linear-gradient(180deg,#fff7bf,#ffe47f);box-shadow:0 4px 0 rgba(196,147,38,.18);padding:7px;display:flex;align-items:center;justify-content:center;gap:6px;font-size:8.6px;font-weight:900;color:#765719}.vw2-feed-coin .vw2-icon{width:28px;height:28px}













#vw-home-v2-root .vw2-feature{position:relative;border-radius:29px;padding:64px 10px 51px;min-height:0;overflow:hidden;background:linear-gradient(180deg,#8878e9 0 42px,#f7fbff 43px 100%);border:3px solid #fff;box-shadow:0 5px 0 rgba(80,78,173,.25),0 11px 22px rgba(57,70,162,.22),inset 0 0 0 2px rgba(131,126,217,.26)}.vw2-feature:before{content:"";position:absolute;left:22%;right:22%;top:10px;height:38px;border-radius:18px 18px 15px 15px;background:linear-gradient(180deg,#b38cff,#8868db);border:3px solid #fff;box-shadow:0 4px 0 #6851b8,0 6px 12px rgba(87,61,156,.25);z-index:4}.vw2-feature:after{content:"";position:absolute;left:calc(22% - 24px);top:21px;width:28px;height:18px;background:#fff;border-radius:70% 15% 70% 15%;transform:rotate(-18deg);z-index:4}













#vw-home-v2-root .vw2-feature-title{position:absolute;top:13px;left:50%;transform:translateX(-50%);z-index:6;display:flex;align-items:center;gap:5px;color:#fff;font-size:18px;font-weight:950;text-shadow:0 2px 0 #6745bb,0 0 7px rgba(255,255,255,.45);white-space:nowrap}.vw2-feature-title .vw2-icon{width:22px;height:22px}.vw2-feature-title strong{color:#ffe276;letter-spacing:.03em}.vw2-word-ribbon{position:absolute;top:49px;left:18px;right:18px;height:35px;z-index:5;border:2px solid #fff;border-radius:17px;background:linear-gradient(180deg,#fffef7,#fff1d1);box-shadow:0 4px 0 rgba(130,104,181,.12);display:flex;align-items:center;justify-content:center;padding:0 80px 0 12px;font-size:10px;font-weight:900;color:#554379;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.vw2-word-ribbon:after{content:"+1";position:absolute;right:11px;top:5px;height:22px;min-width:44px;padding:0 7px;border-radius:999px;background:linear-gradient(180deg,#fff1a1,#ffc94d);border:2px solid #fff;color:#775117;display:grid;place-items:center;font-weight:950}













#vw-home-v2-root .vw2-feature-stage{position:absolute;left:10px;right:10px;top:91px;bottom:55px;border-radius:24px;overflow:hidden;border:3px solid #fff;background:linear-gradient(180deg,#839af8 0%,#e4a9ed 27%,#ffb9d9 45%,#b8d7ff 63%,#90cfbf 100%);box-shadow:inset 0 2px 0 rgba(255,255,255,.7),0 5px 0 rgba(95,86,181,.15)}.vw2-feature-stage:before{content:"";position:absolute;left:-5%;right:-5%;bottom:-16%;height:45%;border-radius:50% 50% 0 0;background:radial-gradient(ellipse at 48% 0%,#d8f2c8 0 32%,#9dd2aa 33% 60%,#72ad93 61% 100%);z-index:1}.vw2-feature-stage:after{content:"";position:absolute;left:15%;right:15%;bottom:7%;height:18%;border-radius:50%;background:rgba(65,79,117,.14);filter:blur(10px);z-index:1}.vw2-stage-cloud{position:absolute;z-index:1;width:110px;height:28px;border-radius:999px;background:rgba(255,255,255,.8);filter:drop-shadow(0 4px 3px rgba(84,94,159,.12))}.vw2-stage-cloud:before,.vw2-stage-cloud:after{content:"";position:absolute;border-radius:50%;background:inherit}.vw2-stage-cloud:before{width:44px;height:44px;left:18px;bottom:4px}.vw2-stage-cloud:after{width:52px;height:52px;right:13px;bottom:2px}.vw2-stage-cloud.c1{left:-20px;top:13%}.vw2-stage-cloud.c2{right:-23px;top:34%;transform:scale(.85)}













#vw-home-v2-root .vw2-rainbow{position:absolute;left:7%;top:22%;width:48%;height:28%;z-index:1;border-radius:50% 50% 0 0;border:12px solid rgba(255,175,211,.66);border-bottom:0;box-shadow:inset 0 8px 0 rgba(255,224,121,.7),inset 0 16px 0 rgba(142,224,200,.65);transform:rotate(-8deg);opacity:.8}.vw2-castle{position:absolute;right:1.5%;top:17%;width:43%;z-index:2;filter:drop-shadow(0 8px 8px rgba(81,64,136,.24))}.vw2-castle-art{display:block;width:100%;height:auto}.vw2-pet-halo{position:absolute;left:50%;top:57%;transform:translate(-50%,-50%);width:250px;height:250px;border-radius:50%;background:radial-gradient(circle,#fff 0 13%,rgba(255,240,155,.7) 32%,rgba(255,192,226,.28) 49%,transparent 69%);z-index:2}.vw2-pet{position:absolute;left:50%;top:58%;transform:translate(-50%,-50%);width:230px;height:230px;z-index:4;display:grid;place-items:center}.vw2-pet img{max-width:100%;max-height:100%;object-fit:contain;filter:drop-shadow(0 11px 7px rgba(57,72,114,.28))}.vw2-dragon-art{width:100%;height:100%;filter:drop-shadow(0 10px 6px rgba(48,76,89,.25))}.vw2-player-mini{position:absolute;left:7%;bottom:12%;width:78px;height:92px;z-index:5;display:grid;place-items:end center;border-radius:25px;background:linear-gradient(180deg,rgba(255,255,255,.9),rgba(203,227,255,.9));border:4px solid #fff;box-shadow:0 5px 0 rgba(87,93,181,.25),0 9px 14px rgba(67,77,149,.18);overflow:hidden}.vw2-player-mini img{max-width:100%;max-height:100%;object-fit:contain;object-position:center bottom}.vw2-knight-art{width:100%;height:100%}













#vw-home-v2-root .vw2-speech{position:absolute;left:5%;top:10%;z-index:5;width:205px;padding:9px 12px;border:3px solid #fff;border-radius:18px 18px 18px 5px;background:linear-gradient(180deg,#fff,#fff0f8);box-shadow:0 5px 0 rgba(110,87,168,.16),0 8px 14px rgba(74,65,133,.12);font-size:9.3px;font-weight:900;color:#5b3e73}.vw2-speech small{display:block;color:#e6539b;margin-top:2px;font-size:8px}.vw2-reward-card{position:absolute;right:5%;bottom:9%;z-index:5;width:142px;padding:7px;border:3px solid #fff;border-radius:17px;background:linear-gradient(180deg,#fff6cc,#ffd86d);box-shadow:0 5px 0 rgba(151,107,36,.22),0 8px 13px rgba(113,78,34,.12);display:grid;grid-template-columns:38px 1fr;align-items:center;gap:5px;color:#6d4b17}.vw2-reward-card .vw2-icon{width:38px;height:38px}.vw2-reward-card b{font-size:8.7px;line-height:1.15}.vw2-reward-card small{display:block;font-size:7.5px;margin-top:2px}.vw2-stage-copy{position:absolute;left:21%;right:27%;bottom:5%;z-index:5;border:2px solid #fff;border-radius:999px;background:rgba(255,244,252,.92);box-shadow:0 4px 0 rgba(105,87,158,.14);padding:6px 9px;text-align:center;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.vw2-stage-copy b{font-size:9px;color:#d24d91}.vw2-stage-copy span{font-size:8px;color:#69567b;margin-left:4px}













#vw-home-v2-root .vw2-feature-actions{position:absolute;left:12px;right:12px;bottom:8px;height:40px;display:grid;grid-template-columns:1fr 1fr;gap:10px}.vw2-feature-actions button{border:3px solid #fff;border-radius:19px;display:flex;align-items:center;justify-content:center;gap:5px;font-size:10.5px;font-weight:950;color:#fff;box-shadow:0 5px 0 rgba(81,67,159,.28),0 8px 14px rgba(73,67,144,.15),inset 0 2px 0 rgba(255,255,255,.38)}.vw2-feature-actions .vw2-icon{width:28px;height:28px}.vw2-enter{background:linear-gradient(180deg,#8c77ef,#6d56d0)}.vw2-play{background:linear-gradient(180deg,#ffa5d0,#f06fad)}













#vw-home-v2-root .vw2-right{display:grid;grid-template-rows:minmax(0,1fr) minmax(0,.78fr);gap:9px;min-height:0}.vw2-mission,.vw2-online{border-radius:27px;padding:9px;min-height:0;overflow:hidden}.vw2-mission{display:flex;flex-direction:column;background:linear-gradient(180deg,#fffaf0,#fff0e6)}.vw2-progress{height:10px;border-radius:999px;background:#e7dfd2;border:2px solid #fff;margin:5px 2px 7px;overflow:hidden;box-shadow:inset 0 2px 3px rgba(102,78,59,.13)}.vw2-progress i{display:block;height:100%;background:linear-gradient(90deg,#58d5a7,#a5e876,#ffd15e);border-radius:999px;transition:width .25s}.vw2-quests{display:flex;flex-direction:column;gap:6px;min-height:0;overflow:hidden}.vw2-quest-row{width:100%;display:grid;grid-template-columns:38px 1fr auto;align-items:center;gap:7px;border:2px solid #fff;border-radius:16px;padding:6px 7px;background:linear-gradient(180deg,#fff,#fff5d7);box-shadow:0 4px 0 rgba(168,120,62,.11);color:#54466c;text-align:left}.vw2-quest-row.done{background:linear-gradient(180deg,#effff7,#d8f7e6)}.vw2-qemoji{width:38px;height:38px;border-radius:14px;background:linear-gradient(180deg,#fff5b2,#ffda63);display:grid;place-items:center}.vw2-qemoji .vw2-icon{width:31px;height:31px}.vw2-qbody{min-width:0}.vw2-qbody b{display:block;font-size:9px;font-weight:950;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.vw2-qbody i{display:block;height:7px;border-radius:999px;background:#e7e0ef;margin-top:4px;overflow:hidden}.vw2-qbody u{display:block;height:100%;border-radius:999px;background:linear-gradient(90deg,#6acbff,#8274f0);text-decoration:none}.vw2-qscore{font-size:8px;font-weight:950;border-radius:999px;background:#fff;padding:3px 6px;color:#745fa3}.vw2-qscore .vw2-icon{width:20px;height:20px}.vw2-empty{font-size:9px;color:#7580a0;text-align:center;padding:14px 4px}













#vw-home-v2-root .vw2-online{display:flex;flex-direction:column;background:linear-gradient(180deg,#eefbff,#e6f6ff 48%,#f4ecff)}.vw2-online-card{margin-top:7px;display:grid;grid-template-columns:12px 1fr 40px;gap:7px;align-items:center;border:2px solid #fff;border-radius:16px;padding:8px;background:linear-gradient(180deg,#fff,#eafff8);box-shadow:0 4px 0 rgba(71,140,116,.12)}.vw2-online-card:after{content:"";width:36px;height:36px;border-radius:14px;background:radial-gradient(circle at 40% 42%,#333 0 3px,transparent 4px),radial-gradient(circle at 65% 42%,#333 0 3px,transparent 4px),radial-gradient(circle at 50% 67%,#ff9fbd 0 5px,transparent 6px),linear-gradient(180deg,#d7ffc5,#8fe2a2);border:2px solid #fff;box-shadow:0 2px 0 rgba(75,139,94,.15)}.vw2-online-dot{width:10px;height:10px;border-radius:50%;background:#49d67c;box-shadow:0 0 0 4px rgba(73,214,124,.16),0 0 10px rgba(73,214,124,.6)}.vw2-online-card b{display:block;font-size:9.4px;font-weight:950;color:#3d4d72;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.vw2-online-card small{display:block;font-size:8px;color:#7080a0;margin-top:2px}.vw2-friends-btn{margin-top:auto;height:36px;border:3px solid #fff;border-radius:17px;background:linear-gradient(180deg,#b78df8,#8f66dc);box-shadow:0 4px 0 #6e4cae;color:#fff;font-weight:950;font-size:9.5px;display:flex;align-items:center;justify-content:center;gap:5px}.vw2-friends-btn .vw2-icon{width:25px;height:25px}













#vw-home-v2-root .vw2-bottom{position:relative;z-index:2;display:grid;grid-template-columns:repeat(13,minmax(0,1fr));gap:6px;min-height:0;padding:0 2px}.vw2-bottom .vw2-mode{min-width:0;height:58px;border:3px solid #fff;border-radius:20px;padding:3px 4px;display:flex;align-items:center;justify-content:center;gap:3px;background:linear-gradient(180deg,#fff,#e5ebff);box-shadow:0 5px 0 rgba(73,87,174,.25),0 8px 13px rgba(61,75,155,.14);color:#4f467b}.vw2-bottom .vw2-mode span{flex:0 0 auto}.vw2-bottom .vw2-mode .vw2-icon{width:30px;height:30px}.vw2-bottom .vw2-mode b{min-width:0;font-size:8.5px;line-height:1.05;font-weight:950;text-align:center;white-space:normal}.vw2-bottom .blue{background:linear-gradient(180deg,#e8f7ff,#a9dcff)}.vw2-bottom .green{background:linear-gradient(180deg,#edfff6,#aee8c9)}.vw2-bottom .orange{background:linear-gradient(180deg,#fff3e4,#ffbf7d)}.vw2-bottom .gold{background:linear-gradient(180deg,#fff8cc,#ffd562)}.vw2-bottom .lime{background:linear-gradient(180deg,#efffe9,#bde7a6)}.vw2-bottom .violet{background:linear-gradient(180deg,#f5edff,#cbb1ff)}.vw2-bottom .pink{background:linear-gradient(180deg,#fff0fa,#ffb6dc)}.vw2-bottom .game{background:linear-gradient(180deg,#fff0c4,#ffc64f);color:#704816}.vw2-bottom .book{background:linear-gradient(180deg,#eaf5ff,#b9d8ff)}













#vw-home-v2-root .vw2-preview-mark{position:absolute;right:18px;bottom:71px;z-index:7;font-size:7px;letter-spacing:.08em;color:#6d5e98;background:rgba(255,255,255,.75);border:1px solid #fff;border-radius:999px;padding:3px 7px;pointer-events:none}













#vw2-preview-switch{position:fixed;right:max(12px,env(safe-area-inset-right,0px));bottom:max(12px,env(safe-area-inset-bottom,0px));z-index:8900;border:3px solid #fff;border-radius:18px;background:linear-gradient(180deg,#f6edff,#d7c5ff);color:#5e4b88;font:900 11px 'Kanit',sans-serif;padding:7px 12px;box-shadow:0 5px 0 rgba(91,67,157,.28),0 8px 16px rgba(51,45,117,.2);cursor:pointer}













html.night #vw-home-v2-root{filter:saturate(.9) brightness(.82)}html.no-anim #vw-home-v2-root *{scroll-behavior:auto!important;animation:none!important;transition:none!important}@media (prefers-reduced-motion:reduce){#vw-home-v2-root *{scroll-behavior:auto!important;animation:none!important;transition:none!important}}













@media (max-width:1450px){#vw-home-v2-root .vw2-main-grid{grid-template-columns:168px 235px minmax(400px,1fr) 280px}.vw2-left .vw2-rail-btn b{font-size:7.7px}.vw2-bottom .vw2-mode b{font-size:7.7px}.vw2-bottom .vw2-mode .vw2-icon{width:26px;height:26px}.vw2-pet{width:205px;height:205px}.vw2-speech{width:175px!important}.vw2-reward-card{width:125px!important}}













@media (max-width:1200px){#vw-home-v2-root .vw2-shell{grid-template-rows:82px minmax(0,1fr) 94px}.vw2-top{grid-template-columns:minmax(240px,300px) 1fr auto}.vw2-wallet-pill{min-width:92px}.vw2-wallet-pill.worth{display:none}.vw2-main-grid{grid-template-columns:154px 210px minmax(360px,1fr) 248px!important}.vw2-left{padding:5px!important;gap:3px!important}.vw2-left .vw2-rail-btn{border-radius:12px!important}.vw2-left .vw2-rail-btn .vw2-icon{width:24px;height:24px}.vw2-bottom{grid-template-columns:repeat(7,minmax(0,1fr))!important;grid-auto-rows:43px}.vw2-bottom .vw2-mode{height:43px!important;border-radius:15px!important}.vw2-bottom .vw2-mode b{font-size:7.7px}.vw2-bottom .vw2-mode .vw2-icon{width:23px;height:23px}.vw2-feature{padding-bottom:49px!important}.vw2-pet{width:180px!important;height:180px!important}.vw2-castle{width:40%!important}.vw2-player-mini{width:64px!important;height:77px!important}}













/* === Refinement pass: readable labels, complete economy metrics, premium pet welcome stage === */













#vw-home-v2-root .vw2-shell{grid-template-rows:104px minmax(0,1fr) 72px;gap:10px;padding:10px 12px 9px;background:radial-gradient(circle at 52% 4%,rgba(255,255,255,.38),transparent 24%),linear-gradient(180deg,#46b4fb 0%,#78cbff 28%,#b9c7ff 62%,#e1b9ff 100%)}













#vw-home-v2-root .vw2-top{grid-template-columns:minmax(310px,365px) minmax(560px,1fr) auto;gap:10px}













#vw-home-v2-root .vw2-profile{border-width:4px;box-shadow:0 6px 0 rgba(75,86,177,.25),0 12px 22px rgba(45,73,161,.2),inset 0 0 0 2px rgba(127,139,223,.2)}













#vw-home-v2-root .vw2-profile .vw2-minirow{display:flex;align-items:center;gap:3px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}













#vw-home-v2-root .vw2-wallet{display:grid;grid-template-columns:1.25fr repeat(4,minmax(92px,1fr));gap:7px;align-content:center;justify-content:stretch}













#vw-home-v2-root .vw2-wallet-pill{height:55px;min-width:0!important;border-width:4px;border-radius:25px;padding:4px 9px;position:relative;overflow:hidden;display:flex;flex-direction:column!important;gap:0;line-height:1.02}













#vw-home-v2-root .vw2-wallet-pill:before{content:"";position:absolute;left:10%;right:10%;top:3px;height:10px;border-radius:999px;background:linear-gradient(90deg,transparent,rgba(255,255,255,.76),transparent);pointer-events:none}













#vw-home-v2-root .vw2-wallet-pill.coin{display:grid!important;grid-template-columns:32px 1fr 18px;grid-template-rows:15px 28px;column-gap:4px;align-items:center;text-align:left}













#vw-home-v2-root .vw2-wallet-pill.coin small{grid-column:2;grid-row:1;align-self:end}.vw2-wallet-pill.coin .vw2-icon{grid-column:1;grid-row:1/3;width:32px!important;height:32px!important}.vw2-wallet-pill.coin b{grid-column:2;grid-row:2;font-size:15px!important}.vw2-wallet-pill.coin em{grid-column:3;grid-row:1/3;width:18px!important;height:18px!important;font-size:11px}













#vw-home-v2-root .vw2-wallet-pill small{font-size:7.7px;letter-spacing:.01em;font-weight:950}.vw2-wallet-pill b{font-size:12.5px;font-weight:950;white-space:nowrap}.vw2-wallet-pill span.vw2-pill-status{display:block;max-width:100%;font-size:6.5px;font-weight:800;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;opacity:.78;margin-top:1px}













#vw-home-v2-root .vw2-wallet-pill.online{background:linear-gradient(180deg,#e5fbff,#9de6ff);color:#26779b}.vw2-wallet-pill.online b{color:#197aa4}.vw2-wallet-pill.computer{background:linear-gradient(180deg,#eef2ff,#c6c9ff);color:#5e58a7}.vw2-wallet-pill.computer b{color:#5b50ac}.vw2-wallet-pill.worth{background:linear-gradient(180deg,#f5eaff,#d8c2ff)}













#vw-home-v2-root .vw2-top-actions{display:grid;grid-template-columns:repeat(6,52px);gap:6px;align-content:center;justify-content:end}.vw2-top-actions .vw2-tool-btn{width:52px;height:62px;padding:4px 2px 3px;border:4px solid #fff;border-radius:19px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:1px;background:linear-gradient(160deg,#fff,#e2ecff);box-shadow:0 5px 0 rgba(75,83,169,.2),0 8px 15px rgba(67,71,147,.13)}.vw2-top-actions .vw2-tool-btn:nth-child(2){background:linear-gradient(160deg,#fff0fb,#ffcfe9)}.vw2-top-actions .vw2-tool-btn:nth-child(3){background:linear-gradient(160deg,#ecf7ff,#bfe9ff)}.vw2-top-actions .vw2-tool-btn:nth-child(4){background:linear-gradient(160deg,#ecfff7,#c4f0df)}.vw2-top-actions .vw2-tool-btn:nth-child(5){background:linear-gradient(160deg,#fff0e9,#ffd4c4)}.vw2-top-actions .vw2-tool-btn:nth-child(6){background:linear-gradient(160deg,#f7f0ff,#d9c7ff)}.vw2-top-actions .vw2-tool-btn .vw2-icon{width:31px;height:31px;margin:0}.vw2-top-actions .vw2-tool-btn b{font-size:7px;line-height:1.05;font-weight:950;color:#5a4c84;white-space:nowrap}.vw2-top-actions .vw2-classic{width:52px!important;min-width:0!important;padding:4px 2px!important;font-size:inherit!important}.vw2-top-actions .vw2-classic .vw2-icon{width:29px!important;height:29px!important;margin:0!important}













#vw-home-v2-root .vw2-main-grid{grid-template-columns:205px 282px minmax(500px,1fr) 325px;gap:10px}













#vw-home-v2-root .vw2-left{padding:8px;gap:6px;border-width:4px}.vw2-left .vw2-rail-btn{border-width:3px;border-radius:18px;padding:4px;box-shadow:0 4px 0 rgba(103,83,174,.22),0 7px 12px rgba(77,71,148,.12),inset 0 1px 0 #fff}.vw2-left .vw2-rail-btn span{height:31px}.vw2-left .vw2-rail-btn .vw2-icon{width:31px;height:31px}.vw2-left .vw2-rail-btn b{font-size:9px;line-height:1.08;overflow:visible;text-overflow:clip;white-space:normal;min-height:10px}.vw2-left .vw2-rail-btn[data-vw2-action="cannon"] b{font-size:8.1px}













#vw-home-v2-root .vw2-feed,#vw-home-v2-root .vw2-mission,#vw-home-v2-root .vw2-online{border-width:4px;box-shadow:0 6px 0 rgba(83,91,181,.22),0 12px 22px rgba(48,73,163,.17),inset 0 0 0 2px rgba(123,143,224,.15)}













#vw-home-v2-root .vw2-feature{border:4px solid #fff;border-radius:32px;background:linear-gradient(180deg,rgba(155,118,237,.96) 0 52px,rgba(255,255,255,.95) 53px 100%);box-shadow:0 7px 0 rgba(80,65,164,.28),0 14px 26px rgba(45,61,145,.22),inset 0 0 0 2px rgba(120,109,210,.2);padding:56px 12px 54px;overflow:hidden}













#vw-home-v2-root .vw2-feature-title{top:5px;left:21%;right:21%;height:49px;border:4px solid #fff;border-radius:23px;background:linear-gradient(180deg,#b88cff,#885ee0);box-shadow:0 5px 0 rgba(86,57,154,.3),inset 0 3px 0 rgba(255,255,255,.38);font-size:18px;text-shadow:0 2px 0 #7e50cf,0 0 7px rgba(255,255,255,.8)}













#vw-home-v2-root .vw2-feature-title:before,#vw-home-v2-root .vw2-feature-title:after{content:"";position:absolute;top:9px;width:42px;height:27px;background:linear-gradient(180deg,#fff,#e8ddff);border:3px solid #fff;z-index:-1}.vw2-feature-title:before{left:-31px;border-radius:90% 15% 80% 25%;transform:rotate(-16deg)}.vw2-feature-title:after{right:-31px;border-radius:15% 90% 25% 80%;transform:rotate(16deg)}













#vw-home-v2-root .vw2-word-ribbon{border:3px solid #fff;border-radius:19px;background:linear-gradient(180deg,#fff8d8,#ffe99d);box-shadow:0 4px 0 rgba(151,121,61,.18),inset 0 2px 0 #fff;font-weight:900}













#vw-home-v2-root .vw2-feature-stage{perspective:820px;border:4px solid #fff;border-radius:27px;background:linear-gradient(180deg,#8ac9ff 0%,#bca8ff 24%,#ffc5df 49%,#d9e7ff 66%,#8fd8bf 100%);box-shadow:inset 0 3px 0 rgba(255,255,255,.75),0 6px 0 rgba(95,86,181,.17);overflow:hidden}













#vw-home-v2-root .vw2-feature-stage:before{height:47%;bottom:-18%;background:radial-gradient(ellipse at 50% 0%,#ecf7c9 0 26%,#bde0a3 27% 48%,#79bf9f 49% 68%,#55a28b 69% 100%)}













#vw-home-v2-root .vw2-feature-stage:after{left:25%;right:25%;bottom:11%;height:13%;background:rgba(59,61,106,.2);filter:blur(14px)}













#vw-home-v2-root .vw2-rainbow{left:4%;top:17%;width:55%;height:30%;border-width:13px;opacity:.9}.vw2-castle{right:0;top:13%;width:45%;filter:drop-shadow(0 12px 9px rgba(70,56,129,.28))}













#vw-home-v2-root .vw2-pet-platform{position:absolute;left:50%;bottom:7%;z-index:3;width:290px;height:92px;transform:translateX(-50%) rotateX(61deg);border-radius:50%;background:radial-gradient(ellipse at 50% 32%,#fff7c8 0 14%,#ffd968 15% 33%,#bb83ff 34% 57%,#6a54c4 58% 74%,#5845a5 75% 100%);border:7px solid rgba(255,255,255,.94);box-shadow:0 17px 19px rgba(61,53,116,.2),inset 0 0 0 5px rgba(255,255,255,.25)}













#vw-home-v2-root .vw2-pet-platform:before{content:"★";position:absolute;left:50%;top:42%;transform:translate(-50%,-50%) rotateX(-61deg);font-size:41px;line-height:1;color:#ffe475;text-shadow:0 3px 0 #a96dc7,0 0 8px #fff}













#vw-home-v2-root .vw2-pet-halo{top:55%;width:290px;height:290px;background:radial-gradient(circle,#fff 0 9%,rgba(255,244,170,.76) 24%,rgba(255,173,225,.35) 44%,rgba(149,128,255,.12) 60%,transparent 72%)}













#vw-home-v2-root .vw2-pet{top:55%;width:265px;height:265px;transform:translate(-50%,-50%);transform-style:preserve-3d}.vw2-pet img,.vw2-pet .vw2-dragon-art{max-width:100%;max-height:100%;object-fit:contain;filter:drop-shadow(0 16px 9px rgba(52,51,100,.28));transform-origin:50% 88%;animation:vw2PetJoy 5.4s cubic-bezier(.35,.05,.3,1) infinite;will-change:transform}.vw2-pet.has-owned-pet img{width:100%;height:100%;object-fit:contain}













#vw-home-v2-root .vw2-pet-sparkles{position:absolute;left:50%;top:52%;z-index:6;width:310px;height:270px;transform:translate(-50%,-50%);pointer-events:none}.vw2-pet-sparkles i{position:absolute;display:grid;place-items:center;width:31px;height:31px;border-radius:50%;background:rgba(255,255,255,.82);border:2px solid #fff;color:#ff8fc9;font-style:normal;font-size:18px;box-shadow:0 4px 8px rgba(94,61,142,.18);animation:vw2PetSpark 3.2s ease-in-out infinite}.vw2-pet-sparkles i:nth-child(1){left:6%;top:28%;animation-delay:.1s}.vw2-pet-sparkles i:nth-child(2){right:4%;top:18%;color:#ffd254;animation-delay:.7s}.vw2-pet-sparkles i:nth-child(3){right:11%;bottom:12%;color:#74d7b2;animation-delay:1.3s}.vw2-pet-sparkles i:nth-child(4){left:12%;bottom:8%;color:#9273ed;animation-delay:1.9s}













#vw-home-v2-root .vw2-speech{left:4%;top:8%;width:218px;border-width:4px;font-size:10px;padding:10px 13px;box-shadow:0 6px 0 rgba(110,87,168,.18),0 10px 18px rgba(74,65,133,.14)}.vw2-speech small{font-size:8.4px}.vw2-player-mini{left:5%;bottom:11%;width:82px;height:96px;border-width:4px}.vw2-reward-card{right:4%;bottom:10%;width:148px;border-width:4px}.vw2-stage-copy{left:23%;right:25%;bottom:4%;border-width:3px;padding:7px 10px}.vw2-stage-copy b{font-size:9.6px}.vw2-stage-copy span{font-size:8.2px}













#vw-home-v2-root .vw2-feature-actions{height:42px}.vw2-feature-actions button{border-width:4px;font-size:11px;box-shadow:0 6px 0 rgba(81,67,159,.3),0 10px 16px rgba(73,67,144,.16),inset 0 2px 0 rgba(255,255,255,.4)}













#vw-home-v2-root .vw2-bottom{gap:7px}.vw2-bottom .vw2-mode{height:61px;border-width:4px;border-radius:22px;box-shadow:0 6px 0 rgba(73,87,174,.25),0 10px 15px rgba(61,75,155,.15),inset 0 2px 0 rgba(255,255,255,.55)}.vw2-bottom .vw2-mode b{font-size:8.8px}.vw2-bottom .vw2-mode .vw2-icon{width:31px;height:31px}













#vw-home-v2-root .vw2-preview-mark{bottom:76px}













@keyframes vw2PetJoy{0%,72%,100%{transform:translateY(0) rotate(0deg) scale(1)}5%{transform:translateY(-15px) rotate(-4deg) scale(1.035)}10%{transform:translateY(-2px) rotate(4deg) scale(1.02)}16%{transform:translateY(-11px) rotate(-3deg) scale(1.035)}23%{transform:translateY(0) rotate(2deg) scale(1.015)}32%{transform:translateY(-5px) rotate(-2deg) scale(1.02)}42%{transform:translateY(0) rotate(0deg) scale(1)}}













@keyframes vw2PetSpark{0%,100%{transform:translateY(0) rotate(-8deg) scale(.8);opacity:.55}45%{transform:translateY(-12px) rotate(8deg) scale(1.12);opacity:1}}













@media (max-width:1550px){#vw-home-v2-root .vw2-top{grid-template-columns:minmax(280px,335px) minmax(480px,1fr) auto}.vw2-top-actions{grid-template-columns:repeat(6,46px)!important}.vw2-top-actions .vw2-tool-btn{width:46px;height:58px!important}.vw2-top-actions .vw2-tool-btn b{font-size:6.4px}.vw2-main-grid{grid-template-columns:190px 250px minmax(430px,1fr) 295px!important}.vw2-left .vw2-rail-btn b{font-size:8.1px}.vw2-wallet-pill small{font-size:7px}.vw2-wallet-pill b{font-size:11px}.vw2-pet{width:235px!important;height:235px!important}.vw2-pet-platform{width:255px!important;height:82px!important}.vw2-pet-sparkles{width:280px!important;height:245px!important}}













@media (max-width:1200px){#vw-home-v2-root .vw2-shell{grid-template-rows:104px minmax(0,1fr) 94px}.vw2-top{grid-template-columns:minmax(230px,260px) 1fr 160px!important}.vw2-wallet{grid-template-columns:repeat(2,minmax(86px,1fr))!important;grid-auto-rows:45px;gap:3px!important}.vw2-wallet-pill{height:45px!important;border-width:3px!important}.vw2-wallet-pill.worth{display:none!important}.vw2-wallet-pill.coin{grid-row:span 2;height:93px!important}.vw2-top-actions{grid-template-columns:repeat(3,48px)!important;grid-template-rows:repeat(2,45px);gap:3px!important}.vw2-top-actions .vw2-tool-btn{width:48px!important;height:45px!important;border-width:3px!important;display:grid!important;grid-template-columns:24px 1fr!important;gap:1px!important}.vw2-top-actions .vw2-tool-btn .vw2-icon{width:24px!important;height:24px!important}.vw2-top-actions .vw2-tool-btn b{font-size:6.3px!important;white-space:normal!important}.vw2-main-grid{grid-template-columns:160px 210px minmax(360px,1fr) 248px!important}.vw2-pet{width:185px!important;height:185px!important}.vw2-pet-platform{width:205px!important;height:68px!important}.vw2-pet-sparkles{width:220px!important;height:195px!important}.vw2-feature-title{font-size:14px!important}.vw2-speech{width:165px!important;font-size:8.2px!important}}




















/* === Home V2 Fidelity + Functional Parity Correction Pass === */






#vw-home-v2-root .vw2-feature:before,#vw-home-v2-root .vw2-feature:after{display:none!important}






#vw-home-v2-root .vw2-feature-title{left:22%!important;right:22%!important;transform:none!important;justify-content:center;min-width:0;padding:0 14px;overflow:visible}






#vw-home-v2-root .vw2-feature-title strong{min-width:0;overflow:hidden;text-overflow:ellipsis}






#vw-home-v2-root .vw2-feature-title:before{left:-27px!important}#vw-home-v2-root .vw2-feature-title:after{right:-27px!important}






#vw-home-v2-root .vw2-profile-chips{display:flex;align-items:center;gap:5px;min-width:0;margin-top:4px}.vw2-profile-chips .vw2-rank{margin-top:0;min-width:0;max-width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.vw2-sync-chip{min-width:0;max-width:135px;padding:3px 7px;border:2px solid #fff;border-radius:999px;background:linear-gradient(180deg,#fff1d9,#ffc989);color:#844f22;font-size:8px;font-weight:900;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;box-shadow:0 2px 0 rgba(132,83,37,.12)}






#vw-home-v2-root .vw2-wallet-pill small{font-size:9px!important;line-height:1.05}#vw-home-v2-root .vw2-wallet-pill b{font-size:16px!important;line-height:1.08}#vw-home-v2-root .vw2-wallet-pill.coin b{font-size:18px!important}#vw-home-v2-root .vw2-wallet-pill .vw2-pill-status{font-size:7.8px!important;line-height:1.08;margin-top:2px!important}






#vw-home-v2-root .vw2-top-actions{grid-template-columns:repeat(7,54px);gap:6px}.vw2-top-actions .vw2-tool-btn{width:54px;height:64px}.vw2-top-actions .vw2-tool-btn b{font-size:8.3px;line-height:1.08}.vw2-top-actions .vw2-classic{width:54px!important}.vw2-top-actions .vw2-install{background:linear-gradient(160deg,#fff8da,#ffe087)}






#vw-home-v2-root .vw2-left{grid-template-columns:repeat(2,minmax(0,1fr));grid-auto-rows:minmax(47px,1fr);overflow-x:hidden!important;overflow-y:auto!important;scrollbar-width:thin;scrollbar-color:rgba(122,91,194,.55) transparent;align-content:start}.vw2-left .vw2-rail-btn{position:relative;display:grid!important;grid-template-columns:31px minmax(0,1fr);align-items:center;justify-items:start;column-gap:5px;padding:5px 6px!important;min-height:47px!important;overflow:visible}.vw2-left .vw2-rail-btn>span{height:31px!important;width:31px}.vw2-left .vw2-rail-btn b{font-size:10.4px!important;line-height:1.16!important;white-space:normal!important;overflow:visible!important;text-overflow:clip!important;text-align:left!important;word-break:break-word}.vw2-left .vw2-rail-btn[data-vw2-action="cannon"] b{font-size:9.3px!important}






#vw-home-v2-root .vw2-source-badge{position:absolute;right:3px;top:3px;z-index:5;min-width:16px;height:16px;padding:0 4px;border:2px solid #fff;border-radius:999px;background:#ff648d;color:#fff;font-style:normal;font-size:8px;font-weight:950;line-height:12px;text-align:center;box-shadow:0 2px 5px rgba(132,45,82,.22)}






#vw-home-v2-root .vw2-feed,#vw-home-v2-root .vw2-mission,#vw-home-v2-root .vw2-online{contain:paint}.vw2-section-head{min-width:0}.vw2-section-head strong{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.vw2-section-head>button,.vw2-section-head>b{flex:0 0 auto}.vw2-feed-card{grid-template-columns:42px minmax(0,1fr)!important}.vw2-feed-card>div{min-width:0;position:relative;z-index:2}.vw2-feed-card p{overflow-wrap:anywhere;word-break:break-word;-webkit-line-clamp:7}.vw2-feed-stats{min-width:0;flex-wrap:wrap}.vw2-feed-stats span{min-width:0;overflow:hidden}.vw2-feed-coin{min-width:0}.vw2-feed-coin span{min-width:0;white-space:normal;text-align:center}






#vw-home-v2-root .vw2-online-card{grid-template-columns:12px minmax(0,1fr) 38px!important;overflow:hidden}.vw2-online-card>div{min-width:0}.vw2-online-card b{font-size:10px;max-width:100%}.vw2-online-card small{font-size:8.7px;line-height:1.25;white-space:normal;overflow-wrap:anywhere}.vw2-friends-btn{flex:0 0 auto;min-width:0;overflow:hidden}.vw2-friends-btn .vw2-icon{flex:0 0 25px}






#vw-home-v2-root .vw2-bottom{display:grid;grid-auto-flow:column;grid-auto-columns:minmax(108px,1fr);grid-template-columns:none!important;overflow-x:auto;overflow-y:hidden;padding:0 3px 6px;scrollbar-width:thin;scrollbar-color:rgba(104,83,182,.55) transparent}.vw2-bottom .vw2-mode{position:relative;min-width:108px;padding:4px 7px}.vw2-bottom .vw2-mode b{font-size:9.5px!important;line-height:1.12}.vw2-bottom .vw2-mode .vw2-icon{width:30px!important;height:30px!important}






#vw-home-v2-root .vw2-feature-stage{transform-style:preserve-3d;background:linear-gradient(180deg,#76c8ff 0%,#a99fff 23%,#ffc1e2 48%,#dce9ff 65%,#88d4b8 100%)}






#vw-home-v2-root .vw2-atmosphere{position:absolute;inset:0;z-index:2;pointer-events:none;overflow:hidden}.vw2-atmosphere i{position:absolute;width:8px;height:8px;border-radius:50%;background:#fff8c8;box-shadow:0 0 10px #fff,0 0 18px rgba(255,220,116,.75);opacity:.65;animation:vw2Atmosphere 7s ease-in-out infinite}.vw2-atmosphere i:nth-child(1){left:14%;top:22%;animation-delay:-1s}.vw2-atmosphere i:nth-child(2){left:36%;top:14%;width:5px;height:5px;animation-delay:-3s}.vw2-atmosphere i:nth-child(3){right:24%;top:29%;width:7px;height:7px;animation-delay:-5s}.vw2-atmosphere i:nth-child(4){right:9%;top:17%;width:5px;height:5px;animation-delay:-2s}.vw2-atmosphere i:nth-child(5){left:27%;bottom:27%;width:6px;height:6px;animation-delay:-4s}






#vw-home-v2-root .vw2-mid-hills{position:absolute;left:-4%;right:-4%;bottom:15%;height:31%;z-index:1;background:radial-gradient(ellipse at 12% 100%,rgba(104,177,160,.72) 0 31%,transparent 32%),radial-gradient(ellipse at 48% 100%,rgba(128,190,163,.72) 0 36%,transparent 37%),radial-gradient(ellipse at 88% 100%,rgba(100,169,155,.68) 0 34%,transparent 35%);filter:saturate(.95)}






#vw-home-v2-root .vw2-stage-foreground{position:absolute;left:-4%;right:-4%;bottom:-4%;height:27%;z-index:5;pointer-events:none;background:radial-gradient(ellipse at 10% 100%,#65ad7e 0 31%,transparent 32%),radial-gradient(ellipse at 90% 100%,#68b47f 0 33%,transparent 34%),linear-gradient(180deg,transparent 0 53%,rgba(65,139,95,.82) 54% 100%);filter:drop-shadow(0 -4px 7px rgba(61,99,86,.12));opacity:.88}






#vw-home-v2-root .vw2-stage-cloud.c1{animation:vw2CloudFloat 7s ease-in-out infinite}.vw2-stage-cloud.c2{animation:vw2CloudFloat2 8s ease-in-out infinite}.vw2-castle{animation:vw2CastleFloat 6.5s ease-in-out infinite}.vw2-rainbow{animation:vw2RainbowFloat 8s ease-in-out infinite}






#vw-home-v2-root .vw2-pet img,#vw-home-v2-root .vw2-pet .vw2-dragon-art{animation:vw2PetIdle 3.8s ease-in-out infinite!important;will-change:transform;transform-origin:50% 88%}.vw2-pet.vw2-welcome img,.vw2-pet.vw2-welcome .vw2-dragon-art{animation:vw2PetWelcome 1.15s cubic-bezier(.22,.74,.28,1) 1!important}.vw2-pet-sparkles i{animation:vw2PetSparkIdle 4.6s ease-in-out infinite!important}.vw2-pet-sparkles.vw2-welcome-burst i{animation:vw2PetSparkBurst .95s ease-out 1!important}.vw2-pet-sparkles.vw2-welcome-burst i:nth-child(2){animation-delay:.08s!important}.vw2-pet-sparkles.vw2-welcome-burst i:nth-child(3){animation-delay:.14s!important}.vw2-pet-sparkles.vw2-welcome-burst i:nth-child(4){animation-delay:.2s!important}






@keyframes vw2PetWelcome{0%{transform:translateY(0) rotate(0) scale(1)}18%{transform:translateY(-24px) rotate(-4deg) scale(1.06)}37%{transform:translateY(-3px) rotate(5deg) scale(1.035)}55%{transform:translateY(-13px) rotate(-2deg) scale(1.045)}76%{transform:translateY(0) rotate(2deg) scale(1.015)}100%{transform:translateY(0) rotate(0) scale(1)}}






@keyframes vw2PetIdle{0%,100%{transform:translateY(0) scale(1)}50%{transform:translateY(-4px) scale(1.012)}}






@keyframes vw2PetSparkBurst{0%{transform:translateY(8px) scale(.35) rotate(-18deg);opacity:0}45%{transform:translateY(-18px) scale(1.28) rotate(12deg);opacity:1}100%{transform:translateY(-4px) scale(.9) rotate(0);opacity:.45}}






@keyframes vw2PetSparkIdle{0%,100%{transform:translateY(0) scale(.88);opacity:.48}50%{transform:translateY(-5px) scale(1);opacity:.72}}






@keyframes vw2Atmosphere{0%,100%{transform:translate3d(0,0,0) scale(.8);opacity:.35}50%{transform:translate3d(0,-11px,0) scale(1.08);opacity:.82}}






@keyframes vw2CloudFloat{0%,100%{transform:translate3d(0,0,0)}50%{transform:translate3d(9px,-3px,0)}}@keyframes vw2CloudFloat2{0%,100%{transform:scale(.85) translate3d(0,0,0)}50%{transform:scale(.85) translate3d(-10px,4px,0)}}@keyframes vw2CastleFloat{0%,100%{transform:translate3d(0,0,0)}50%{transform:translate3d(0,-3px,0)}}@keyframes vw2RainbowFloat{0%,100%{transform:rotate(-8deg) translate3d(0,0,0)}50%{transform:rotate(-8deg) translate3d(3px,-2px,0)}}






@media (max-width:1550px){#vw-home-v2-root .vw2-top-actions{grid-template-columns:repeat(7,47px)!important}.vw2-top-actions .vw2-tool-btn{width:47px!important}.vw2-top-actions .vw2-tool-btn b{font-size:8.2px!important}.vw2-left .vw2-rail-btn b{font-size:9.7px!important}.vw2-wallet-pill small{font-size:8px!important}.vw2-wallet-pill b{font-size:14px!important}}






@media (max-width:1320px){#vw-home-v2-root .vw2-top-actions{grid-template-columns:repeat(4,46px)!important;grid-template-rows:repeat(2,48px)}.vw2-top-actions .vw2-tool-btn{width:46px!important;height:48px!important}.vw2-top-actions .vw2-tool-btn .vw2-icon{width:25px!important;height:25px!important}.vw2-top-actions .vw2-tool-btn b{font-size:8px!important}.vw2-main-grid{grid-template-columns:170px 215px minmax(380px,1fr) 255px!important}.vw2-left .vw2-rail-btn{grid-template-columns:27px minmax(0,1fr)!important;padding:4px!important}.vw2-left .vw2-rail-btn>span,.vw2-left .vw2-rail-btn .vw2-icon{width:27px!important;height:27px!important}.vw2-left .vw2-rail-btn b{font-size:9.2px!important}.vw2-feature-title{left:19%!important;right:19%!important}.vw2-stage-copy{left:20%!important;right:23%!important}}






@media (max-width:1200px){#vw-home-v2-root .vw2-top{grid-template-columns:minmax(230px,260px) 1fr 190px!important}.vw2-top-actions{grid-template-columns:repeat(4,44px)!important;grid-template-rows:repeat(2,45px)!important}.vw2-top-actions .vw2-tool-btn{width:44px!important;height:45px!important;display:flex!important;flex-direction:column!important;gap:0!important}.vw2-top-actions .vw2-tool-btn .vw2-icon{width:23px!important;height:23px!important}.vw2-top-actions .vw2-tool-btn b{font-size:7.8px!important;white-space:nowrap!important}.vw2-main-grid{grid-template-columns:170px 210px minmax(360px,1fr) 248px!important}.vw2-bottom{grid-template-columns:none!important;grid-auto-columns:108px!important;grid-auto-rows:auto!important}.vw2-bottom .vw2-mode{height:61px!important;border-radius:20px!important}.vw2-bottom .vw2-mode b{font-size:9px!important}.vw2-bottom .vw2-mode .vw2-icon{width:28px!important;height:28px!important}}













/* === 0.7.7 Home V2 Fidelity + Functional Parity Correction Pass ===






   Presentation-only overrides. Authoritative Classic Lobby actions remain untouched. */






#vw-home-v2-root{width:100%;max-width:100%;min-width:0}






#vw-home-v2-root .vw2-shell{min-width:0;max-width:100%;grid-template-rows:104px 22px minmax(0,1fr) 72px;gap:7px 10px}






#vw-home-v2-root .vw2-top{grid-row:1;min-width:0;max-width:100%}






#vw-home-v2-root .vw2-main-grid{grid-row:3;min-width:0;max-width:100%}






#vw-home-v2-root .vw2-main-grid>*{min-width:0}






#vw-home-v2-root .vw2-bottom{grid-row:4;min-width:0;max-width:100%}













/* 1. Left navigation: favor complete labels over cramped two-column tiles. */






#vw-home-v2-root .vw2-left{grid-template-columns:minmax(0,1fr)!important;grid-auto-rows:minmax(44px,auto)!important;align-content:start;overflow-x:visible!important;overflow-y:auto!important;padding:8px!important;gap:6px!important}






#vw-home-v2-root .vw2-left .vw2-rail-btn{grid-template-columns:34px minmax(0,1fr)!important;column-gap:9px!important;min-height:44px!important;padding:6px 9px!important;overflow:visible!important}






#vw-home-v2-root .vw2-left .vw2-rail-btn>span{width:34px!important;height:34px!important;flex:0 0 34px}






#vw-home-v2-root .vw2-left .vw2-rail-btn .vw2-icon{width:34px!important;height:34px!important}






#vw-home-v2-root .vw2-left .vw2-rail-btn b,#vw-home-v2-root .vw2-left .vw2-rail-btn[data-vw2-action="cannon"] b{min-width:0;max-width:none;font-size:11px!important;line-height:1.25!important;white-space:normal!important;word-break:keep-all!important;overflow-wrap:normal!important;overflow:visible!important;text-overflow:clip!important;text-align:left!important}













/* 2. Fit the shortcut rail to its real container instead of making a horizontal scroller. */






#vw-home-v2-root .vw2-bottom{display:grid!important;grid-template-columns:repeat(13,minmax(0,1fr))!important;grid-auto-flow:row!important;grid-auto-columns:auto!important;grid-auto-rows:auto!important;overflow:visible!important;padding:0 2px!important;gap:5px!important}






#vw-home-v2-root .vw2-bottom .vw2-mode{min-width:0!important;width:100%;padding:3px 4px!important}






#vw-home-v2-root .vw2-bottom .vw2-mode b{min-width:0;font-size:8.8px!important;line-height:1.08!important;overflow-wrap:normal;word-break:keep-all}






#vw-home-v2-root .vw2-bottom .vw2-mode .vw2-icon{width:28px!important;height:28px!important}













/* 3. Global Feed: keep post, interactions, and CTA as one compact card stack. */






#vw-home-v2-root .vw2-feed{justify-content:flex-start;align-content:start;align-self:start;height:auto}






#vw-home-v2-root .vw2-feed-card{margin-top:9px;padding:11px 10px;align-items:start}






#vw-home-v2-root .vw2-feed-card p{font-size:10px;line-height:1.48;-webkit-line-clamp:5;overflow-wrap:break-word;word-break:normal}






#vw-home-v2-root .vw2-feed-stats{margin-top:9px!important;padding:0;gap:6px;flex-wrap:nowrap}






#vw-home-v2-root .vw2-feed-stats span{padding:6px 5px;font-size:9px;overflow:visible}






#vw-home-v2-root .vw2-feed-coin{margin-top:7px;padding:7px 8px;font-size:9px;line-height:1.28}













/* 4. Pet information: readable hierarchy, centered beneath the pedestal. */






#vw-home-v2-root .vw2-stage-copy{left:50%!important;right:auto!important;bottom:3.2%!important;z-index:7;width:min(62%,360px);max-width:360px;transform:translateX(-50%);border-radius:18px;white-space:normal!important;overflow:visible!important;text-overflow:clip!important;padding:7px 12px 8px!important;line-height:1.22;background:rgba(255,248,253,.96)}






#vw-home-v2-root .vw2-stage-copy b{display:block;font-size:12px!important;line-height:1.2;color:#b9337c;font-weight:950}






#vw-home-v2-root .vw2-stage-copy span{display:block;margin:3px 0 0!important;font-size:9.4px!important;line-height:1.3;color:#554769;font-weight:800;white-space:normal}













/* 5. Friends Online: use the card width before truncating player text. */






#vw-home-v2-root .vw2-online-card{grid-template-columns:12px minmax(0,1fr) 34px!important;gap:6px;padding:8px 7px;align-items:center;overflow:visible}






#vw-home-v2-root .vw2-online-card:after{width:32px;height:32px;border-radius:12px}






#vw-home-v2-root .vw2-online-card>div{min-width:0}






#vw-home-v2-root .vw2-online-card b{font-size:10.6px!important;line-height:1.25;white-space:normal!important;overflow:visible!important;text-overflow:clip!important;overflow-wrap:break-word;word-break:normal}






#vw-home-v2-root .vw2-online-card small{font-size:9px!important;line-height:1.3;white-space:normal!important;overflow:visible!important;overflow-wrap:break-word;word-break:normal}













/* 6. Top statistics: stronger label/support contrast while keeping the soft palette. */






#vw-home-v2-root .vw2-wallet-pill small{color:#455679!important;opacity:1;font-weight:950}






#vw-home-v2-root .vw2-wallet-pill .vw2-pill-status{color:#59637f!important;opacity:.96!important;font-weight:850}






#vw-home-v2-root .vw2-wallet-pill.online small,#vw-home-v2-root .vw2-wallet-pill.online .vw2-pill-status{color:#266a89!important}






#vw-home-v2-root .vw2-wallet-pill.computer small,#vw-home-v2-root .vw2-wallet-pill.computer .vw2-pill-status{color:#55508d!important}






#vw-home-v2-root .vw2-wallet-pill.worth small,#vw-home-v2-root .vw2-wallet-pill.worth .vw2-pill-status{color:#65508e!important}













/* 7. Puppy welcome: readable type and natural wrapping without changing welcome timing. */






#vw-home-v2-root .vw2-speech{left:4%;top:7%;width:clamp(190px,38%,255px)!important;padding:11px 14px 12px!important;font-size:11.2px!important;line-height:1.35!important;word-break:normal;overflow-wrap:break-word;text-wrap:pretty}






#vw-home-v2-root .vw2-speech>span{display:block;line-height:1.35}






#vw-home-v2-root .vw2-speech small{margin-top:4px;font-size:9.2px!important;line-height:1.35;color:#c93d83;font-weight:800;text-wrap:pretty}













/* 8. Admin preview: dedicate a small grid row so the badge never floats over gameplay UI. */






#vw-home-v2-root .vw2-preview-mark{position:static!important;grid-row:2;justify-self:end;align-self:center;z-index:7;max-width:100%;margin:0 2px 0 0;padding:3px 9px;border:2px solid rgba(255,255,255,.95);border-radius:999px;background:linear-gradient(180deg,rgba(255,255,255,.94),rgba(238,230,255,.94));box-shadow:0 2px 0 rgba(96,73,157,.14);font-size:7.6px;line-height:1.2;letter-spacing:.055em;color:#685687;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;pointer-events:none}













@media (max-width:1320px){






  #vw-home-v2-root .vw2-left .vw2-rail-btn{grid-template-columns:31px minmax(0,1fr)!important;padding:5px 7px!important;column-gap:7px!important}






  #vw-home-v2-root .vw2-left .vw2-rail-btn>span,#vw-home-v2-root .vw2-left .vw2-rail-btn .vw2-icon{width:31px!important;height:31px!important}






  #vw-home-v2-root .vw2-left .vw2-rail-btn b,#vw-home-v2-root .vw2-left .vw2-rail-btn[data-vw2-action="cannon"] b{font-size:10.4px!important}






  #vw-home-v2-root .vw2-stage-copy{width:min(68%,330px)}






  #vw-home-v2-root .vw2-speech{width:clamp(188px,40%,235px)!important;font-size:10.7px!important}






}













@media (max-width:1280px){






  #vw-home-v2-root .vw2-shell{grid-template-rows:104px 22px minmax(0,1fr) 94px}






  #vw-home-v2-root .vw2-bottom{grid-template-columns:repeat(7,minmax(0,1fr))!important;grid-template-rows:repeat(2,43px)!important;gap:5px!important}






  #vw-home-v2-root .vw2-bottom .vw2-mode{height:43px!important;border-radius:15px!important;gap:2px}






  #vw-home-v2-root .vw2-bottom .vw2-mode .vw2-icon{width:23px!important;height:23px!important}






  #vw-home-v2-root .vw2-bottom .vw2-mode b{font-size:8px!important}






}













@media (max-width:1200px){






  #vw-home-v2-root .vw2-shell{grid-template-rows:104px 22px minmax(0,1fr) 94px}






  #vw-home-v2-root .vw2-bottom{grid-template-columns:repeat(7,minmax(0,1fr))!important;grid-template-rows:repeat(2,43px)!important;gap:5px!important}






  #vw-home-v2-root .vw2-bottom .vw2-mode{height:43px!important;border-radius:15px!important;gap:2px}






  #vw-home-v2-root .vw2-bottom .vw2-mode .vw2-icon{width:23px!important;height:23px!important}






  #vw-home-v2-root .vw2-bottom .vw2-mode b{font-size:8px!important}






  #vw-home-v2-root .vw2-speech{width:190px!important;font-size:10.3px!important;padding:10px 12px 11px!important}






  #vw-home-v2-root .vw2-speech small{font-size:8.8px!important}






  #vw-home-v2-root .vw2-stage-copy{width:min(72%,280px);padding:6px 9px 7px!important}






  #vw-home-v2-root .vw2-stage-copy b{font-size:10.8px!important}






  #vw-home-v2-root .vw2-stage-copy span{font-size:8.8px!important}






}












/* === Home V2 Locked Mobile Landscape Recovery R2 ===






   Corrective pass after real-device validation.






   Keep the original desktop lobby composition (left rail + Global Feed +






   feature stage + right panels) inside one locked landscape viewport.






   The page never becomes a long scroller; only existing rails/panel bodies






   may scroll internally. data-vw2-action/source wiring is untouched. */






@media (max-width:1100px) and (orientation:landscape) and (max-height:650px){






  #vw-home-v2-root{






    box-sizing:border-box!important;width:100%!important;max-width:100%!important;min-width:0!important;






    height:100%!important;max-height:100%!important;min-height:0!important;






    overflow:hidden!important;overscroll-behavior:none!important;






  }






  #vw-home-v2-root .vw2-shell{






    box-sizing:border-box!important;width:100%!important;min-width:0!important;max-width:100%!important;






    height:100%!important;min-height:0!important;max-height:100%!important;






    grid-template-rows:64px minmax(0,1fr) 50px!important;






    gap:5px!important;padding:5px 6px!important;overflow:hidden!important;






  }






  /* The desktop fidelity pass places main/bottom in rows 3/4. When mobile R1






     changed the shell to three rows without overriding those placements, CSS






     created an implicit row 4 and left the flexible row 2 as a large blank






     band. Pin all three real shell children to the three mobile rows. */






  #vw-home-v2-root .vw2-top{grid-row:1!important}






  #vw-home-v2-root .vw2-main-grid{grid-row:2!important}






  #vw-home-v2-root .vw2-bottom{grid-row:3!important}













  #vw-home-v2-root .vw2-top{






    display:grid!important;grid-template-columns:minmax(170px,23%) minmax(0,1fr) minmax(155px,22%)!important;






    grid-template-rows:64px!important;gap:5px!important;height:64px!important;min-height:0!important;






    width:100%!important;min-width:0!important;align-items:stretch!important;






  }






  #vw-home-v2-root .vw2-profile{






    min-width:0!important;height:64px!important;min-height:0!important;padding:5px 7px!important;






    gap:6px!important;border-radius:19px!important;overflow:hidden!important;






  }






  #vw-home-v2-root .vw2-avatar{width:50px!important;height:50px!important;flex:0 0 50px!important;border-width:3px!important;border-radius:16px!important}






  #vw-home-v2-root .vw2-avatar .vw2-icon{width:36px!important;height:36px!important}






  #vw-home-v2-root .vw2-name-row{gap:3px!important}






  #vw-home-v2-root .vw2-name-row strong{font-size:13px!important;line-height:1.05!important}






  #vw-home-v2-root .vw2-pencil .vw2-icon{width:16px!important;height:16px!important}






  #vw-home-v2-root .vw2-id{font-size:7px!important;padding:1px 5px!important;margin-top:1px!important}






  #vw-home-v2-root .vw2-minirow{font-size:7.6px!important;line-height:1.05!important;margin-top:1px!important;white-space:nowrap!important}






  #vw-home-v2-root .vw2-profile-chips{margin-top:2px!important;gap:3px!important;flex-wrap:nowrap!important}






  #vw-home-v2-root .vw2-rank{font-size:7.3px!important;padding:2px 5px!important;white-space:nowrap!important}






  #vw-home-v2-root .vw2-sync-chip{font-size:6.7px!important;padding:2px 4px!important;max-width:76px!important}













  #vw-home-v2-root .vw2-wallet{






    min-width:0!important;height:64px!important;display:flex!important;align-items:center!important;justify-content:flex-start!important;






    gap:4px!important;overflow-x:auto!important;overflow-y:hidden!important;padding:1px 1px 4px!important;






    scroll-snap-type:x proximity;scrollbar-width:none;-webkit-overflow-scrolling:touch;touch-action:pan-x;






  }






  #vw-home-v2-root .vw2-wallet::-webkit-scrollbar{display:none}






  #vw-home-v2-root .vw2-wallet-pill{






    flex:0 0 72px!important;width:72px!important;min-width:72px!important;height:56px!important;min-height:56px!important;






    padding:3px 4px!important;border-width:3px!important;border-radius:17px!important;scroll-snap-align:start;






    flex-direction:column!important;gap:0!important;text-align:center!important;






  }






  #vw-home-v2-root .vw2-wallet-pill.coin{






    flex:0 0 94px!important;width:94px!important;min-width:94px!important;display:grid!important;






    grid-template-columns:24px minmax(0,1fr) 14px!important;grid-template-rows:14px 28px!important;






    column-gap:2px!important;row-gap:1px!important;align-content:center!important;align-items:center!important;






  }






  #vw-home-v2-root .vw2-wallet-pill.worth{display:flex!important}






  #vw-home-v2-root .vw2-wallet-pill.coin small{grid-column:1/-1!important;grid-row:1!important}






  #vw-home-v2-root .vw2-wallet-pill.coin .vw2-icon{grid-column:1!important;grid-row:2!important;width:24px!important;height:24px!important}






  #vw-home-v2-root .vw2-wallet-pill.coin b{grid-column:2!important;grid-row:2!important;font-size:11.5px!important;overflow:hidden!important;text-overflow:ellipsis!important}






  #vw-home-v2-root .vw2-wallet-pill.coin em{grid-column:3!important;grid-row:2!important;width:14px!important;height:14px!important;font-size:7px!important;border-width:1px!important}






  #vw-home-v2-root .vw2-wallet-pill small{font-size:7px!important;line-height:1.05!important;white-space:nowrap!important}






  #vw-home-v2-root .vw2-wallet-pill b{font-size:10.5px!important;line-height:1.05!important;max-width:100%!important;overflow:hidden!important;text-overflow:ellipsis!important}






  #vw-home-v2-root .vw2-wallet-pill .vw2-pill-status{font-size:6px!important;line-height:1.05!important;white-space:nowrap!important;max-width:100%!important;overflow:hidden!important;text-overflow:ellipsis!important}













  #vw-home-v2-root .vw2-top-actions{






    min-width:0!important;height:64px!important;display:flex!important;align-items:center!important;justify-content:flex-start!important;






    gap:4px!important;overflow-x:auto!important;overflow-y:hidden!important;padding:1px 1px 4px!important;






    scroll-snap-type:x proximity;scrollbar-width:none;-webkit-overflow-scrolling:touch;touch-action:pan-x;






  }






  #vw-home-v2-root .vw2-top-actions::-webkit-scrollbar{display:none}






  #vw-home-v2-root .vw2-top-actions .vw2-tool-btn,#vw-home-v2-root .vw2-top-actions .vw2-classic{






    flex:0 0 49px!important;width:49px!important;min-width:49px!important;height:56px!important;min-height:56px!important;






    padding:3px!important;border-width:3px!important;border-radius:16px!important;scroll-snap-align:start;






    display:flex!important;flex-direction:column!important;align-items:center!important;justify-content:center!important;gap:1px!important;






  }






  #vw-home-v2-root .vw2-top-actions .vw2-classic{flex-basis:58px!important;width:58px!important;min-width:58px!important}






  #vw-home-v2-root .vw2-top-actions .vw2-tool-btn .vw2-icon,#vw-home-v2-root .vw2-top-actions .vw2-classic .vw2-icon{width:23px!important;height:23px!important;flex:0 0 23px!important;margin:0!important}






  #vw-home-v2-root .vw2-top-actions .vw2-tool-btn b,#vw-home-v2-root .vw2-top-actions .vw2-classic b{font-size:7.4px!important;line-height:1.05!important;white-space:nowrap!important;max-width:100%!important;overflow:hidden!important;text-overflow:ellipsis!important}













  #vw-home-v2-root .vw2-preview-mark{display:none!important}













  #vw-home-v2-root .vw2-main-grid{






    display:grid!important;






    grid-template-columns:clamp(68px,10vw,88px) clamp(96px,15vw,126px) minmax(0,1fr) clamp(136px,21vw,178px)!important;






    grid-template-rows:minmax(0,1fr)!important;gap:5px!important;height:100%!important;min-height:0!important;






    min-width:0!important;width:100%!important;overflow:hidden!important;align-items:stretch!important;






  }






  #vw-home-v2-root .vw2-main-grid>*{min-width:0!important;min-height:0!important;max-width:100%!important}













  #vw-home-v2-root .vw2-left{






    grid-column:1!important;grid-row:1!important;display:flex!important;flex-direction:column!important;justify-content:flex-start!important;






    gap:4px!important;padding:5px!important;border-radius:18px!important;overflow-x:hidden!important;overflow-y:auto!important;






    scroll-snap-type:y proximity;scrollbar-width:none;-webkit-overflow-scrolling:touch;touch-action:pan-y;






  }






  #vw-home-v2-root .vw2-left::-webkit-scrollbar{display:none}






  #vw-home-v2-root .vw2-left .vw2-rail-btn{






    flex:0 0 48px!important;width:100%!important;min-width:0!important;min-height:48px!important;height:48px!important;






    padding:3px 2px!important;border-radius:14px!important;display:flex!important;flex-direction:column!important;






    align-items:center!important;justify-content:center!important;gap:1px!important;scroll-snap-align:start;






  }






  #vw-home-v2-root .vw2-left .vw2-rail-btn>span{width:25px!important;height:25px!important;display:grid!important;place-items:center!important}






  #vw-home-v2-root .vw2-left .vw2-rail-btn .vw2-icon{width:25px!important;height:25px!important}






  #vw-home-v2-root .vw2-left .vw2-rail-btn b,#vw-home-v2-root .vw2-left .vw2-rail-btn[data-vw2-action="cannon"] b{font-size:7.6px!important;line-height:1!important;white-space:nowrap!important;max-width:100%!important;overflow:hidden!important;text-overflow:ellipsis!important;text-align:center!important}













  /* Keep Global Feed in the same structural position as desktop. */






  #vw-home-v2-root .vw2-feed{






    display:flex!important;grid-column:2!important;grid-row:1!important;height:100%!important;min-height:0!important;






    padding:5px!important;border-radius:18px!important;overflow:hidden!important;






  }






  #vw-home-v2-root .vw2-feed .vw2-section-head{min-height:23px!important;gap:3px!important}






  #vw-home-v2-root .vw2-feed .vw2-section-head>.vw2-head-icon{width:23px!important;height:23px!important;border-radius:8px!important}






  #vw-home-v2-root .vw2-feed .vw2-section-head>.vw2-head-icon .vw2-icon{width:18px!important;height:18px!important}






  #vw-home-v2-root .vw2-feed .vw2-section-head strong{font-size:7.8px!important}






  #vw-home-v2-root .vw2-feed .vw2-section-head>button{font-size:6.2px!important;padding:2px 3px!important;border-radius:7px!important}






  #vw-home-v2-root .vw2-feed-card{margin-top:3px!important;padding:4px 3px!important;grid-template-columns:22px minmax(0,1fr)!important;gap:3px!important;border-radius:10px!important;min-height:0!important;overflow:hidden!important}






  #vw-home-v2-root .vw2-feed-avatar{width:22px!important;height:22px!important;border-width:1px!important}






  #vw-home-v2-root .vw2-feed-card b{font-size:6.8px!important;line-height:1.1!important}






  #vw-home-v2-root .vw2-feed-card p{font-size:6.1px!important;line-height:1.22!important;margin-top:2px!important;-webkit-line-clamp:6!important;overflow-wrap:anywhere!important}






  #vw-home-v2-root .vw2-feed-stats{font-size:5.8px!important;gap:2px!important;padding:3px 1px 1px!important;flex-wrap:wrap!important}






  #vw-home-v2-root .vw2-feed-coin{margin-top:2px!important;padding:3px!important;min-height:25px!important;border-width:1px!important;border-radius:10px!important;font-size:6.1px!important;gap:2px!important}






  #vw-home-v2-root .vw2-feed-coin .vw2-icon{width:15px!important;height:15px!important}













  #vw-home-v2-root .vw2-feature{






    grid-column:3!important;grid-row:1!important;height:100%!important;min-height:0!important;padding:40px 6px 42px!important;






    border-radius:20px!important;overflow:hidden!important;






  }






  #vw-home-v2-root .vw2-feature:before{left:18%!important;right:18%!important;top:5px!important;height:29px!important;border-width:2px!important;border-radius:14px!important}






  #vw-home-v2-root .vw2-feature:after{display:none!important}






  #vw-home-v2-root .vw2-feature-title{top:7px!important;font-size:12.5px!important;gap:3px!important}






  #vw-home-v2-root .vw2-feature-title .vw2-icon{width:16px!important;height:16px!important}






  #vw-home-v2-root .vw2-word-ribbon{top:35px!important;left:7px!important;right:7px!important;height:25px!important;padding:0 42px 0 7px!important;border-width:2px!important;border-radius:12px!important;font-size:7.8px!important}






  #vw-home-v2-root .vw2-word-ribbon:after{right:5px!important;top:3px!important;height:17px!important;min-width:31px!important;font-size:7px!important}






  #vw-home-v2-root .vw2-feature-stage{top:63px!important;bottom:43px!important;left:6px!important;right:6px!important;border-width:2px!important;border-radius:16px!important;overflow:hidden!important}






  #vw-home-v2-root .vw2-speech{left:3%!important;top:4%!important;width:min(42%,150px)!important;padding:5px 7px 6px!important;border-width:2px!important;font-size:8.2px!important;line-height:1.18!important}






  #vw-home-v2-root .vw2-speech small{font-size:6.7px!important;line-height:1.18!important;margin-top:2px!important}






  #vw-home-v2-root .vw2-rainbow{left:0!important;top:13%!important;width:48%!important}






  #vw-home-v2-root .vw2-castle{right:-1%!important;top:10%!important;width:36%!important}






  #vw-home-v2-root .vw2-pet{width:118px!important;height:118px!important;top:52%!important}






  #vw-home-v2-root .vw2-pet-halo{width:136px!important;height:136px!important;top:52%!important}






  #vw-home-v2-root .vw2-pet-platform{width:138px!important;height:43px!important;bottom:28px!important;border-width:4px!important}






  #vw-home-v2-root .vw2-pet-sparkles{width:145px!important;height:120px!important;top:50%!important}






  #vw-home-v2-root .vw2-player-mini{left:3%!important;bottom:38px!important;width:41px!important;height:49px!important;border-width:2px!important;border-radius:13px!important}






  #vw-home-v2-root .vw2-reward-card{right:3%!important;bottom:38px!important;width:84px!important;padding:3px!important;border-width:2px!important;grid-template-columns:22px minmax(0,1fr)!important}






  #vw-home-v2-root .vw2-reward-card .vw2-icon{width:22px!important;height:22px!important}






  #vw-home-v2-root .vw2-reward-card b{font-size:6.6px!important}#vw-home-v2-root .vw2-reward-card small{font-size:5.7px!important}






  #vw-home-v2-root .vw2-stage-copy{bottom:3px!important;width:min(72%,260px)!important;max-width:260px!important;padding:4px 6px!important;border-width:2px!important}






  #vw-home-v2-root .vw2-stage-copy b{font-size:8px!important}#vw-home-v2-root .vw2-stage-copy span{font-size:6.4px!important;line-height:1.1!important}






  #vw-home-v2-root .vw2-feature-actions{left:6px!important;right:6px!important;bottom:4px!important;height:35px!important;gap:5px!important}






  #vw-home-v2-root .vw2-feature-actions button{height:35px!important;min-height:35px!important;padding:2px 4px!important;border-width:2px!important;border-radius:12px!important;font-size:8.3px!important;gap:2px!important}






  #vw-home-v2-root .vw2-feature-actions .vw2-icon{width:18px!important;height:18px!important}













  #vw-home-v2-root .vw2-right{






    grid-column:4!important;grid-row:1!important;height:100%!important;min-height:0!important;






    display:grid!important;grid-template-rows:minmax(0,1.12fr) minmax(0,.88fr)!important;gap:5px!important;overflow:hidden!important;






  }






  #vw-home-v2-root .vw2-mission,#vw-home-v2-root .vw2-online{min-height:0!important;height:auto!important;padding:5px!important;border-radius:18px!important;overflow:hidden!important}






  #vw-home-v2-root .vw2-section-head{min-height:24px!important;gap:3px!important}






  #vw-home-v2-root .vw2-section-head>.vw2-head-icon{width:24px!important;height:24px!important;border-radius:9px!important}






  #vw-home-v2-root .vw2-section-head>.vw2-head-icon .vw2-icon{width:19px!important;height:19px!important}






  #vw-home-v2-root .vw2-section-head strong{font-size:8.4px!important;white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important}






  #vw-home-v2-root .vw2-section-head>b{font-size:7px!important;padding:2px 4px!important}






  #vw-home-v2-root .vw2-progress{height:6px!important;margin:2px 1px 3px!important;border-width:1px!important}






  #vw-home-v2-root .vw2-quests{gap:3px!important;overflow-y:auto!important;overflow-x:hidden!important;scrollbar-width:none!important}






  #vw-home-v2-root .vw2-quests::-webkit-scrollbar{display:none}






  #vw-home-v2-root .vw2-quest-row{grid-template-columns:24px minmax(0,1fr) auto!important;gap:3px!important;min-height:33px!important;padding:3px!important;border-width:1px!important;border-radius:10px!important}






  #vw-home-v2-root .vw2-qemoji{width:24px!important;height:24px!important;border-radius:8px!important}






  #vw-home-v2-root .vw2-qemoji .vw2-icon{width:19px!important;height:19px!important}






  #vw-home-v2-root .vw2-qbody b{font-size:7px!important}.vw2-qscore{font-size:6.5px!important}






  #vw-home-v2-root .vw2-qbody i{height:4px!important;margin-top:2px!important}






  #vw-home-v2-root .vw2-online-card{grid-template-columns:7px minmax(0,1fr)!important;gap:4px!important;min-height:35px!important;margin-top:3px!important;padding:4px!important;border-radius:10px!important}






  #vw-home-v2-root .vw2-online-card b{font-size:7.4px!important;line-height:1.1!important}#vw-home-v2-root .vw2-online-card small{font-size:6.4px!important;line-height:1.1!important}






  #vw-home-v2-root .vw2-online-dot{width:7px!important;height:7px!important}






  #vw-home-v2-root .vw2-friends-btn{min-height:30px!important;margin-top:3px!important;padding:3px!important;border-radius:10px!important;font-size:7.2px!important}






  #vw-home-v2-root .vw2-friends-btn .vw2-icon{width:18px!important;height:18px!important}













  #vw-home-v2-root .vw2-bottom{






    display:flex!important;align-items:center!important;justify-content:flex-start!important;gap:4px!important;






    min-width:0!important;width:100%!important;height:50px!important;min-height:0!important;padding:0 1px 3px!important;






    overflow-x:auto!important;overflow-y:hidden!important;scroll-snap-type:x proximity;scrollbar-width:none;






    -webkit-overflow-scrolling:touch;touch-action:pan-x;






  }






  #vw-home-v2-root .vw2-bottom::-webkit-scrollbar{display:none}






  #vw-home-v2-root .vw2-bottom .vw2-mode{






    flex:0 0 104px!important;width:104px!important;min-width:104px!important;height:46px!important;min-height:46px!important;






    padding:3px 5px!important;border-width:2px!important;border-radius:14px!important;gap:3px!important;scroll-snap-align:start;






  }






  #vw-home-v2-root .vw2-bottom .vw2-mode .vw2-icon{width:22px!important;height:22px!important}






  #vw-home-v2-root .vw2-bottom .vw2-mode b{font-size:8px!important;line-height:1.05!important;white-space:normal!important;overflow:hidden!important;text-overflow:ellipsis!important}






}













@media (max-width:720px) and (orientation:landscape) and (max-height:650px){






  #vw-home-v2-root .vw2-top{grid-template-columns:minmax(160px,25%) minmax(0,1fr) minmax(145px,22%)!important}






  #vw-home-v2-root .vw2-main-grid{grid-template-columns:64px 92px minmax(0,1fr) 132px!important}






  #vw-home-v2-root .vw2-left{padding:4px!important}






  #vw-home-v2-root .vw2-left .vw2-rail-btn{flex-basis:46px!important;height:46px!important;min-height:46px!important}






  #vw-home-v2-root .vw2-feed{padding:4px!important}






  #vw-home-v2-root .vw2-feed .vw2-section-head strong{font-size:7px!important}






  #vw-home-v2-root .vw2-feed .vw2-section-head>button{font-size:5.7px!important;padding:2px!important}






  #vw-home-v2-root .vw2-feed-card p{font-size:5.7px!important;-webkit-line-clamp:5!important}






  #vw-home-v2-root .vw2-pet{width:108px!important;height:108px!important}






  #vw-home-v2-root .vw2-pet-halo{width:124px!important;height:124px!important}






  #vw-home-v2-root .vw2-pet-platform{width:126px!important}






  #vw-home-v2-root .vw2-speech{width:min(43%,132px)!important;font-size:7.8px!important}






  #vw-home-v2-root .vw2-speech small{font-size:6.2px!important}






  #vw-home-v2-root .vw2-reward-card{width:76px!important}






}













/* === Home V2 Premium Cute Lightweight Visual Fidelity Pass ===
   Presentation-only. Reuses the existing inline SVG icon system and CSS scenery;
   no new image requests, handlers, routing, ownership state, or access rules. */
#vw-home-v2-root{
  --vw2-pearl:#fffafd;--vw2-lavender:#b8a7ff;--vw2-sky:#8bd8ff;--vw2-rose:#ffb6d8;--vw2-soft-shadow:rgba(75,66,142,.18);
  background:linear-gradient(180deg,#68c5ff 0%,#91d9ff 31%,#c4c9ff 64%,#dfc0ff 100%);
  border-color:rgba(255,255,255,.82);
  box-shadow:inset 0 0 0 1px rgba(108,102,194,.22),0 12px 26px rgba(54,61,148,.22)
}
#vw-home-v2-root .vw2-shell{
  background:radial-gradient(circle at 18% 2%,rgba(255,255,255,.48),transparent 24%),radial-gradient(circle at 82% 11%,rgba(255,229,248,.34),transparent 27%),linear-gradient(180deg,rgba(84,186,251,.28),rgba(225,183,246,.25))
}
#vw-home-v2-root .vw2-glass{
  border-color:rgba(255,255,255,.78);
  background:radial-gradient(circle at 18% 0%,rgba(255,255,255,.96),transparent 30%),linear-gradient(145deg,rgba(255,252,255,.94),rgba(233,244,255,.9) 56%,rgba(241,232,255,.9));
  box-shadow:0 4px 0 rgba(94,84,174,.16),0 8px 17px rgba(64,72,151,.14),inset 0 1px 0 rgba(255,255,255,.96),inset 0 0 0 1px rgba(174,159,235,.19)
}
#vw-home-v2-root .vw2-profile{
  background:radial-gradient(circle at 4% 10%,rgba(255,255,255,.98),transparent 29%),linear-gradient(145deg,#fffafd 0%,#edf8ff 54%,#eee7ff 100%);
  border-color:rgba(255,255,255,.8)
}
#vw-home-v2-root .vw2-avatar{
  border-color:rgba(255,255,255,.9);box-shadow:0 0 0 2px rgba(186,166,255,.78),0 5px 11px rgba(78,69,142,.19);
  background:radial-gradient(circle at 32% 19%,#fff 0 8%,transparent 9%),linear-gradient(180deg,#daf6ff,#f8e7ff)
}
#vw-home-v2-root .vw2-rank{background:linear-gradient(180deg,#fff9dc,#ffe7a2);box-shadow:inset 0 1px 0 #fff,0 2px 0 rgba(197,151,52,.12)}
#vw-home-v2-root .vw2-sync-chip{background:linear-gradient(180deg,#fff8ec,#ffd8a7);border-color:rgba(255,255,255,.82)}
#vw-home-v2-root .vw2-wallet-pill{
  border-color:rgba(255,255,255,.78);box-shadow:0 4px 0 rgba(82,96,184,.14),0 7px 13px rgba(61,75,153,.11),inset 0 1px 0 #fff
}
#vw-home-v2-root .vw2-wallet-pill.coin{background:radial-gradient(circle at 30% 8%,rgba(255,255,255,.75),transparent 31%),linear-gradient(180deg,#fff6c8,#ffd770)}
#vw-home-v2-root .vw2-wallet-pill.online{background:linear-gradient(180deg,#e9fbff,#c6efff)}
#vw-home-v2-root .vw2-wallet-pill.computer{background:linear-gradient(180deg,#f6f0ff,#dfd2ff)}
#vw-home-v2-root .vw2-wallet-pill.worth{background:linear-gradient(180deg,#f8efff,#d9c6ff)}

/* One cohesive soft-toy icon treatment: same SVG artwork, no bitmap replacements. */
#vw-home-v2-root .vw2-icon{filter:drop-shadow(0 2px 2px rgba(65,54,116,.15))}
#vw-home-v2-root .vw2-icon .i-sticker{fill:rgba(255,255,255,.91);stroke:rgba(255,255,255,.94);stroke-width:2.2}
#vw-home-v2-root .vw2-icon .i-gloss{fill:rgba(255,255,255,.5)}
#vw-home-v2-root .vw2-left .vw2-rail-btn,
#vw-home-v2-root .vw2-top-actions .vw2-tool-btn,
#vw-home-v2-root .vw2-bottom .vw2-mode{
  border-color:rgba(255,255,255,.78);
  box-shadow:0 4px 0 rgba(92,79,169,.15),0 7px 12px rgba(68,66,139,.1),inset 0 1px 0 rgba(255,255,255,.94)
}
#vw-home-v2-root .vw2-left .vw2-rail-btn{background:radial-gradient(circle at 24% 10%,rgba(255,255,255,.95),transparent 27%),linear-gradient(155deg,#fffafd,#ece5ff)}
#vw-home-v2-root .vw2-left .vw2-rail-btn:nth-child(4n+2){background:radial-gradient(circle at 24% 10%,rgba(255,255,255,.95),transparent 27%),linear-gradient(155deg,#fffafd,#ffe0ef)}
#vw-home-v2-root .vw2-left .vw2-rail-btn:nth-child(4n+3){background:radial-gradient(circle at 24% 10%,rgba(255,255,255,.95),transparent 27%),linear-gradient(155deg,#fff,#dcf5ff)}
#vw-home-v2-root .vw2-left .vw2-rail-btn:nth-child(4n+4){background:radial-gradient(circle at 24% 10%,rgba(255,255,255,.95),transparent 27%),linear-gradient(155deg,#fff,#ddf4ea)}
#vw-home-v2-root .vw2-section-head>.vw2-head-icon{border:1px solid rgba(255,255,255,.76);background:radial-gradient(circle at 30% 17%,#fff 0 14%,transparent 15%),linear-gradient(180deg,#fffafd,#e0efff);box-shadow:0 3px 0 rgba(97,112,192,.12),inset 0 1px 0 #fff}
#vw-home-v2-root .vw2-section-head strong{color:#394879;text-shadow:0 1px 0 rgba(255,255,255,.85)}

/* Pearl/card skins: richer layering without extra DOM or image files. */
#vw-home-v2-root .vw2-left{background:linear-gradient(180deg,rgba(255,250,255,.96),rgba(238,231,255,.92))}
#vw-home-v2-root .vw2-feed{background:radial-gradient(circle at 88% 6%,rgba(217,244,255,.85),transparent 25%),linear-gradient(180deg,#fafdff,#edf7ff 58%,#f1eeff)}
#vw-home-v2-root .vw2-mission{background:radial-gradient(circle at 88% 8%,rgba(255,232,196,.52),transparent 27%),linear-gradient(180deg,#fffdf7,#fff2e7)}
#vw-home-v2-root .vw2-online{background:radial-gradient(circle at 88% 6%,rgba(226,211,255,.48),transparent 27%),linear-gradient(180deg,#f2fcff,#e9f8ff 50%,#f5efff)}
#vw-home-v2-root .vw2-feed-card,
#vw-home-v2-root .vw2-quest-row,
#vw-home-v2-root .vw2-online-card{border-color:rgba(255,255,255,.8);box-shadow:0 3px 0 rgba(105,100,172,.09),0 6px 11px rgba(73,83,150,.07),inset 0 1px 0 rgba(255,255,255,.96)}
#vw-home-v2-root .vw2-feed-card{background:linear-gradient(160deg,#fffafd,#f2faff)}
#vw-home-v2-root .vw2-feed-card:after{right:-24px;bottom:-29px;width:98px;height:98px;background:radial-gradient(circle,rgba(255,232,143,.72) 0 15%,rgba(255,184,219,.32) 16% 31%,rgba(178,211,255,.28) 32% 47%,transparent 48%);opacity:.76}
#vw-home-v2-root .vw2-feed-stats span{border-color:rgba(255,255,255,.76);background:linear-gradient(180deg,#fffafd,#eef5ff)}
#vw-home-v2-root .vw2-feed-coin{border-color:rgba(255,255,255,.8);background:linear-gradient(180deg,#fff9d8,#ffe68f);box-shadow:0 3px 0 rgba(196,147,38,.12)}
#vw-home-v2-root .vw2-progress{border-color:rgba(255,255,255,.82);background:#e9e4ed}
#vw-home-v2-root .vw2-quest-row{background:linear-gradient(160deg,#fffefd,#fff4dc)}
#vw-home-v2-root .vw2-quest-row.done{background:linear-gradient(160deg,#f4fff9,#dff8eb)}
#vw-home-v2-root .vw2-online-card{background:linear-gradient(160deg,#fffafd,#e9fff7)}

/* Center hero becomes one storybook scene; all decoration is CSS or existing inline SVG. */
#vw-home-v2-root .vw2-feature{
  border-color:rgba(255,255,255,.8);background:linear-gradient(180deg,#8978e8 0 42px,#f8fbff 43px 100%);
  box-shadow:0 4px 0 rgba(80,78,173,.18),0 9px 18px rgba(57,70,162,.16),inset 0 0 0 1px rgba(131,126,217,.2)
}
#vw-home-v2-root .vw2-feature-title{color:#fff;text-shadow:0 2px 0 #6650b2,0 0 5px rgba(255,255,255,.38)}
#vw-home-v2-root .vw2-feature-title strong{color:#ffe986;text-shadow:0 2px 0 #9b6a35,0 0 7px rgba(255,239,168,.45)}
#vw-home-v2-root .vw2-feature-title:before,#vw-home-v2-root .vw2-feature-title:after{border-color:rgba(255,255,255,.78);background:linear-gradient(180deg,#fffafd,#e9deff)}
#vw-home-v2-root .vw2-word-ribbon{border-color:rgba(255,255,255,.82);background:radial-gradient(circle at 14% 0%,#fff 0 10%,transparent 28%),linear-gradient(180deg,#fffefb,#fff0d8);box-shadow:0 3px 0 rgba(130,104,181,.09),inset 0 1px 0 #fff}
#vw-home-v2-root .vw2-feature-stage{
  border-color:rgba(255,255,255,.82);
  background:radial-gradient(circle at 52% 35%,rgba(255,250,224,.38) 0 10%,transparent 30%),radial-gradient(circle at 13% 12%,rgba(255,255,255,.36),transparent 20%),linear-gradient(180deg,#78caff 0%,#aaa4ff 24%,#ffc3e2 48%,#d8e9ff 66%,#87d2b6 100%);
  box-shadow:inset 0 1px 0 rgba(255,255,255,.78),0 4px 0 rgba(95,86,181,.11)
}
#vw-home-v2-root .vw2-feature-stage:after{left:18%;right:18%;bottom:8%;height:17%;background:radial-gradient(ellipse at center,rgba(62,72,110,.17) 0 28%,rgba(62,72,110,.08) 45%,transparent 70%);filter:none}
#vw-home-v2-root .vw2-mid-hills{filter:none;opacity:.92}
#vw-home-v2-root .vw2-stage-foreground{filter:none;opacity:.84}
#vw-home-v2-root .vw2-stage-cloud{background:rgba(255,255,255,.74);filter:none;box-shadow:0 4px 8px rgba(84,94,159,.08)}
#vw-home-v2-root .vw2-rainbow{opacity:.66}
#vw-home-v2-root .vw2-castle{filter:drop-shadow(0 6px 5px rgba(81,64,136,.18))}
#vw-home-v2-root .vw2-pet-halo{background:radial-gradient(circle,rgba(255,255,255,.96) 0 10%,rgba(255,244,177,.64) 26%,rgba(255,201,231,.22) 48%,transparent 69%);box-shadow:0 0 0 1px rgba(255,255,255,.12)}
#vw-home-v2-root .vw2-pet img,#vw-home-v2-root .vw2-dragon-art{filter:drop-shadow(0 9px 6px rgba(52,65,108,.23))}
#vw-home-v2-root .vw2-pet-platform{background:radial-gradient(ellipse at 50% 27%,#fffbdc 0 13%,#ffe27c 14% 31%,#c59aff 32% 55%,#755dcc 56% 74%,#5d49ab 75% 100%);border-color:rgba(255,255,255,.82);box-shadow:0 13px 16px rgba(61,53,116,.16),inset 0 0 0 4px rgba(255,255,255,.2)}
#vw-home-v2-root .vw2-pet-platform:before{color:#ffea91;text-shadow:0 3px 0 #9d70bd,0 0 5px rgba(255,255,255,.8)}
#vw-home-v2-root .vw2-player-mini{border-color:rgba(255,255,255,.84);background:linear-gradient(180deg,rgba(255,253,255,.92),rgba(211,232,255,.9));box-shadow:0 4px 0 rgba(87,93,181,.16),0 7px 12px rgba(67,77,149,.12)}
#vw-home-v2-root .vw2-speech{border-color:rgba(255,255,255,.84);background:linear-gradient(165deg,rgba(255,255,255,.97),rgba(255,238,249,.95));box-shadow:0 4px 0 rgba(110,87,168,.12),0 7px 12px rgba(74,65,133,.09)}
#vw-home-v2-root .vw2-reward-card{border-color:rgba(255,255,255,.84);background:radial-gradient(circle at 24% 7%,rgba(255,255,255,.72),transparent 27%),linear-gradient(180deg,#fff8d9,#ffdb72);box-shadow:0 4px 0 rgba(151,107,36,.15),0 7px 11px rgba(113,78,34,.09)}
#vw-home-v2-root .vw2-stage-copy{border-color:rgba(255,255,255,.8);background:linear-gradient(180deg,rgba(255,253,255,.94),rgba(255,239,250,.92));box-shadow:0 3px 0 rgba(105,87,158,.1),inset 0 1px 0 #fff}
#vw-home-v2-root .vw2-feature-actions button{border-color:rgba(255,255,255,.82);box-shadow:0 4px 0 rgba(81,67,159,.2),0 7px 12px rgba(73,67,144,.1),inset 0 1px 0 rgba(255,255,255,.38)}
#vw-home-v2-root .vw2-enter{background:linear-gradient(180deg,#9d89f5,#725bd4)}
#vw-home-v2-root .vw2-play{background:linear-gradient(180deg,#ffafd5,#ef75b1)}
#vw-home-v2-root .vw2-friends-btn{border-color:rgba(255,255,255,.82);background:linear-gradient(180deg,#bda0fb,#9270dd);box-shadow:0 4px 0 rgba(110,76,174,.75)}

/* Bottom rail stays identical structurally; tones become one candy/pearl family. */
#vw-home-v2-root .vw2-bottom .blue{background:linear-gradient(180deg,#f7fcff,#b8e4ff)}
#vw-home-v2-root .vw2-bottom .green{background:linear-gradient(180deg,#f8fff9,#bcebd2)}
#vw-home-v2-root .vw2-bottom .orange{background:linear-gradient(180deg,#fff9f3,#ffc994)}
#vw-home-v2-root .vw2-bottom .gold{background:linear-gradient(180deg,#fffbe1,#ffdd78)}
#vw-home-v2-root .vw2-bottom .lime{background:linear-gradient(180deg,#fbfff7,#c8ecb5)}
#vw-home-v2-root .vw2-bottom .violet{background:linear-gradient(180deg,#fcf8ff,#d6c1ff)}
#vw-home-v2-root .vw2-bottom .pink{background:linear-gradient(180deg,#fff8fc,#ffc2df)}
#vw-home-v2-root .vw2-bottom .book{background:linear-gradient(180deg,#f7fbff,#c6dcff)}
#vw-home-v2-root .vw2-bottom .game{background:radial-gradient(circle at 28% 7%,rgba(255,255,255,.82),transparent 27%),linear-gradient(180deg,#fff7cf,#ffcc58);box-shadow:0 4px 0 rgba(168,113,31,.2),0 7px 12px rgba(122,83,31,.11),inset 0 1px 0 #fff}

/* Performance: keep only the single mascot idle transform continuous.
   Background clouds/castle/rainbow/sparkles are static; welcome burst stays one-shot. */
#vw-home-v2-root .vw2-atmosphere i,
#vw-home-v2-root .vw2-stage-cloud,
#vw-home-v2-root .vw2-castle,
#vw-home-v2-root .vw2-rainbow,
#vw-home-v2-root .vw2-pet-sparkles i{animation:none!important;will-change:auto!important}
#vw-home-v2-root .vw2-pet img,#vw-home-v2-root .vw2-pet .vw2-dragon-art{will-change:auto!important}
#vw-home-v2-root .vw2-pet-sparkles.vw2-welcome-burst i{animation:vw2PetSparkBurst .95s ease-out 1!important}
#vw-home-v2-root .vw2-atmosphere i{box-shadow:0 0 6px rgba(255,255,255,.78),0 0 10px rgba(255,220,116,.42);opacity:.62}

@media (max-width:1100px) and (orientation:landscape) and (max-height:650px){
  #vw-home-v2-root .vw2-glass{box-shadow:0 3px 0 rgba(94,84,174,.13),0 5px 9px rgba(64,72,151,.09),inset 0 1px 0 rgba(255,255,255,.94)}
  #vw-home-v2-root .vw2-left .vw2-rail-btn,#vw-home-v2-root .vw2-top-actions .vw2-tool-btn,#vw-home-v2-root .vw2-bottom .vw2-mode{box-shadow:0 2px 0 rgba(92,79,169,.14),0 4px 7px rgba(68,66,139,.08),inset 0 1px 0 rgba(255,255,255,.9)}
  #vw-home-v2-root .vw2-atmosphere i:nth-child(n+4){display:none}
  #vw-home-v2-root .vw2-castle{filter:drop-shadow(0 3px 3px rgba(81,64,136,.14))}
  #vw-home-v2-root .vw2-pet img,#vw-home-v2-root .vw2-dragon-art{filter:drop-shadow(0 5px 4px rgba(52,65,108,.18))}
}



/* === Home V2 Premium Cute Lightweight Visual Fidelity Pass R2 ===
   Presentation-first refinement over the locked Mobile Recovery baseline.
   No new image URLs, no navigation-handler changes, and only one tiny transform animation
   for the left-rail scroll cue. */
#vw-home-v2-root{
  --vw2-r2-rim:rgba(255,255,255,.94);--vw2-r2-ink:#433d72;--vw2-r2-shadow:rgba(65,58,132,.18);
}
#vw-home-v2-root .vw2-profile{
  border-width:4px;border-color:var(--vw2-r2-rim);
  background:radial-gradient(circle at 7% 10%,rgba(255,255,255,.99),transparent 27%),radial-gradient(circle at 92% 18%,rgba(255,223,246,.7),transparent 32%),linear-gradient(145deg,#fffdfd 0%,#eaf8ff 52%,#eee5ff 100%);
  box-shadow:0 5px 0 rgba(92,78,171,.2),0 10px 18px rgba(61,66,145,.16),inset 0 2px 0 #fff,inset 0 0 0 1px rgba(154,132,225,.2)
}
#vw-home-v2-root .vw2-profile:before{content:"✦";position:absolute;right:10px;top:7px;z-index:2;color:#ffd95e;font-size:15px;line-height:1;text-shadow:0 1px 0 #fff,0 2px 4px rgba(110,76,151,.18);pointer-events:none}
#vw-home-v2-root .vw2-avatar{box-shadow:0 0 0 3px rgba(255,255,255,.96),0 0 0 5px rgba(174,144,245,.55),0 6px 12px rgba(72,66,143,.2);background:radial-gradient(circle at 28% 14%,#fff 0 8%,transparent 9%),linear-gradient(180deg,#c9f2ff,#f9ddff)}
#vw-home-v2-root .vw2-name-row strong{color:#2d3568;font-weight:950;text-shadow:0 1px 0 #fff}
#vw-home-v2-root .vw2-id{border:1px solid rgba(255,255,255,.92);background:linear-gradient(180deg,#decfff,#bda5ff);color:#53417f;box-shadow:inset 0 1px 0 #fff,0 2px 0 rgba(102,79,170,.1)}
#vw-home-v2-root .vw2-rank{border:2px solid rgba(255,255,255,.9);background:linear-gradient(180deg,#fff9c9,#ffd864);color:#6b4a15;box-shadow:0 2px 0 rgba(173,121,29,.14),inset 0 1px 0 #fff}
#vw-home-v2-root .vw2-minirow{color:#435784;font-weight:700}

/* Puffy cloud rail: same buttons/actions; CSS-only silhouette and highlights. */
#vw-home-v2-root .vw2-left{position:relative;scrollbar-width:none!important;-ms-overflow-style:none;scroll-padding-bottom:26px;background:radial-gradient(circle at 50% 0,rgba(255,255,255,.9),transparent 28%),linear-gradient(180deg,rgba(255,252,255,.98),rgba(232,226,255,.94))}
#vw-home-v2-root .vw2-left::-webkit-scrollbar{width:0!important;height:0!important;display:none!important}
#vw-home-v2-root .vw2-left .vw2-rail-btn{
  --vw2-cloud-top:#fff;--vw2-cloud-bottom:#ddd2ff;position:relative!important;isolation:isolate;overflow:visible!important;
  border:3px solid var(--vw2-r2-rim)!important;border-radius:48% 52% 43% 57% / 54% 56% 44% 46%!important;
  background:radial-gradient(circle at 28% 8%,rgba(255,255,255,.98),transparent 31%),linear-gradient(180deg,var(--vw2-cloud-top),var(--vw2-cloud-bottom))!important;
  color:#55457e;box-shadow:0 4px 0 rgba(94,75,166,.2),0 7px 10px rgba(64,60,132,.12),inset 0 2px 0 rgba(255,255,255,.98)!important;
  transition:transform .11s ease,filter .11s ease,box-shadow .11s ease
}
#vw-home-v2-root .vw2-left .vw2-rail-btn:before,#vw-home-v2-root .vw2-left .vw2-rail-btn:after{content:"";position:absolute;z-index:0;top:-5px;height:18px;border:3px solid var(--vw2-r2-rim);border-bottom:0;background:linear-gradient(180deg,var(--vw2-cloud-top),var(--vw2-cloud-bottom));pointer-events:none}
#vw-home-v2-root .vw2-left .vw2-rail-btn:before{left:11%;width:43%;border-radius:60% 56% 0 0 / 90% 90% 0 0;transform:rotate(-2deg)}
#vw-home-v2-root .vw2-left .vw2-rail-btn:after{right:8%;width:39%;border-radius:58% 62% 0 0 / 88% 90% 0 0;transform:rotate(2deg)}
#vw-home-v2-root .vw2-left .vw2-rail-btn>span,#vw-home-v2-root .vw2-left .vw2-rail-btn>b,#vw-home-v2-root .vw2-left .vw2-rail-btn>.vw2-source-badge{position:relative;z-index:2}
#vw-home-v2-root .vw2-left .vw2-rail-btn:nth-child(4n+1){--vw2-cloud-top:#ffffff;--vw2-cloud-bottom:#d9d0ff}
#vw-home-v2-root .vw2-left .vw2-rail-btn:nth-child(4n+2){--vw2-cloud-top:#fffafd;--vw2-cloud-bottom:#ffcae0}
#vw-home-v2-root .vw2-left .vw2-rail-btn:nth-child(4n+3){--vw2-cloud-top:#f9feff;--vw2-cloud-bottom:#bfeeff}
#vw-home-v2-root .vw2-left .vw2-rail-btn:nth-child(4n+4){--vw2-cloud-top:#fbfff9;--vw2-cloud-bottom:#c6efd5}
#vw-home-v2-root .vw2-left .vw2-rail-btn .vw2-icon{}
#vw-home-v2-root .vw2-left .vw2-rail-btn b{color:#514175;text-shadow:0 1px 0 rgba(255,255,255,.95);font-weight:950}
#vw-home-v2-root .vw2-left .vw2-rail-btn:is(:active,.active,[aria-current="page"],[aria-pressed="true"]){transform:translateY(2px) scale(.985);box-shadow:0 2px 0 rgba(94,75,166,.24),0 4px 7px rgba(64,60,132,.1),inset 0 2px 0 #fff!important}
#vw-home-v2-root .vw2-left-scroll-cue{position:sticky;bottom:2px;z-index:9;align-self:center;display:grid;place-items:center;flex:0 0 20px;width:34px;height:20px;margin:-18px auto 0;border:2px solid rgba(255,255,255,.96);border-radius:999px;background:linear-gradient(180deg,#fff,#d9c8ff);box-shadow:0 3px 0 rgba(91,70,158,.18),0 5px 8px rgba(66,56,126,.1);color:#684fa9;font-size:17px;font-weight:950;line-height:1;opacity:0;transform:translateY(4px) scale(.92);transition:opacity .16s ease,transform .16s ease;pointer-events:none}
#vw-home-v2-root .vw2-left-scroll-cue.is-visible{opacity:.96;transform:translateY(0) scale(1)}
#vw-home-v2-root .vw2-left-scroll-cue>span{display:block;transform:translateY(-1px)}
#vw-home-v2-root .vw2-left-scroll-cue.is-visible>span{animation:vw2R2CueBounce 1.55s ease-in-out infinite}
@keyframes vw2R2CueBounce{0%,100%{transform:translateY(-2px)}50%{transform:translateY(2px)}}

/* Richer candy material without bitmap assets or full-screen filters. */
#vw-home-v2-root .vw2-feed,#vw-home-v2-root .vw2-mission,#vw-home-v2-root .vw2-online{border-width:4px;border-color:rgba(255,255,255,.92);box-shadow:0 4px 0 rgba(91,81,166,.15),0 8px 14px rgba(60,67,142,.11),inset 0 2px 0 rgba(255,255,255,.95)}
#vw-home-v2-root .vw2-feed{background:radial-gradient(circle at 88% 7%,rgba(151,229,255,.5),transparent 27%),linear-gradient(180deg,#fff,#e8f7ff 56%,#eee9ff)}
#vw-home-v2-root .vw2-mission{position:relative;background:radial-gradient(circle at 88% 8%,rgba(255,200,111,.36),transparent 26%),linear-gradient(180deg,#fffdf8,#ffecd8)}
#vw-home-v2-root .vw2-online{position:relative;background:radial-gradient(circle at 90% 7%,rgba(203,171,255,.4),transparent 27%),linear-gradient(180deg,#fbfeff,#e4f7ff 56%,#f0e8ff)}
#vw-home-v2-root .vw2-mission:before,#vw-home-v2-root .vw2-online:before{content:"✦";position:absolute;right:10px;top:8px;color:#ffd45c;font-size:12px;text-shadow:0 1px 0 #fff;pointer-events:none}
#vw-home-v2-root .vw2-online:before{content:"♥";color:#ff7fb5}
#vw-home-v2-root .vw2-section-head strong{font-weight:950;color:#3d4779}
#vw-home-v2-root .vw2-progress{height:11px;border:2px solid rgba(255,255,255,.96);background:#dfd9e7;box-shadow:inset 0 2px 3px rgba(72,63,121,.16),0 2px 0 rgba(255,255,255,.75)}
#vw-home-v2-root .vw2-progress i{background:linear-gradient(90deg,#23c58c,#5ce4a3 56%,#a2f5c1);box-shadow:inset 0 2px 0 rgba(255,255,255,.42)}
#vw-home-v2-root .vw2-qbody i{height:6px;background:#ddd9ee;border:1px solid rgba(255,255,255,.8)}
#vw-home-v2-root .vw2-qbody u{background:linear-gradient(90deg,#29bfff,#5979f2 62%,#aa72f7);box-shadow:inset 0 1px 0 rgba(255,255,255,.48)}
#vw-home-v2-root .vw2-quest-row,#vw-home-v2-root .vw2-online-card{border:2px solid rgba(255,255,255,.9);box-shadow:0 3px 0 rgba(92,86,160,.1),0 5px 8px rgba(70,70,140,.07),inset 0 1px 0 #fff}
#vw-home-v2-root .vw2-friends-btn{border:3px solid #fff;background:linear-gradient(180deg,#c690ff,#7f59df);box-shadow:0 4px 0 #6545b0,0 7px 10px rgba(91,62,166,.15),inset 0 2px 0 rgba(255,255,255,.42)}

/* Hero refinement: stronger banner/reward/CTA, same stage and existing pet artwork. */
#vw-home-v2-root .vw2-feature{border-width:4px;border-color:rgba(255,255,255,.94);box-shadow:0 5px 0 rgba(74,68,160,.22),0 10px 18px rgba(52,62,142,.15),inset 0 2px 0 rgba(255,255,255,.58)}
#vw-home-v2-root .vw2-feature-title{background:radial-gradient(circle at 20% 0,rgba(255,255,255,.5),transparent 27%),linear-gradient(180deg,#c487ff,#8152dc);border-color:#fff;box-shadow:0 5px 0 rgba(92,55,160,.34),0 8px 13px rgba(84,58,152,.16),inset 0 2px 0 rgba(255,255,255,.5);text-shadow:0 2px 0 #6043a6,0 0 6px rgba(255,255,255,.3)}
#vw-home-v2-root .vw2-feature-title strong{color:#fff07e;text-shadow:0 2px 0 #9b6a28,0 0 7px rgba(255,239,137,.55)}
#vw-home-v2-root .vw2-word-ribbon{border:2px solid #fff;background:linear-gradient(180deg,#fffefb,#ffe8c5);box-shadow:0 3px 0 rgba(124,92,166,.12),inset 0 2px 0 #fff}
#vw-home-v2-root .vw2-speech{border-width:3px;background:radial-gradient(circle at 20% 0,rgba(255,255,255,.98),transparent 30%),linear-gradient(165deg,#fff,#ffdff0);box-shadow:0 4px 0 rgba(109,76,159,.16),0 7px 10px rgba(73,62,132,.1),inset 0 1px 0 #fff}
#vw-home-v2-root .vw2-reward-card{border-width:3px;background:radial-gradient(circle at 24% 5%,rgba(255,255,255,.9),transparent 28%),linear-gradient(180deg,#fff39b,#ffc941 62%,#f4aa27);box-shadow:0 4px 0 rgba(147,92,22,.22),0 7px 10px rgba(105,72,29,.11),inset 0 2px 0 rgba(255,255,255,.55)}
#vw-home-v2-root .vw2-feature-actions button{border-width:3px;font-weight:950;box-shadow:0 4px 0 rgba(75,57,145,.28),0 7px 10px rgba(63,57,128,.12),inset 0 2px 0 rgba(255,255,255,.42)}
#vw-home-v2-root .vw2-enter{background:linear-gradient(180deg,#7fd7ff,#4b78e9 58%,#495bd2)}
#vw-home-v2-root .vw2-play{background:linear-gradient(180deg,#ff83c2,#e5489d 58%,#c83589)}

/* Bottom rail: deliberately saturated personalities; GAME is the primary CTA. */
#vw-home-v2-root .vw2-bottom .vw2-mode{position:relative;isolation:isolate;overflow:hidden;border:3px solid rgba(255,255,255,.96)!important;color:#fff;text-shadow:0 1px 1px rgba(45,39,91,.34);box-shadow:0 5px 0 rgba(63,58,132,.28),0 8px 12px rgba(53,53,118,.14),inset 0 2px 0 rgba(255,255,255,.52)!important}
#vw-home-v2-root .vw2-bottom .vw2-mode:before{content:"";position:absolute;z-index:0;left:8%;right:8%;top:3px;height:28%;border-radius:999px;background:linear-gradient(180deg,rgba(255,255,255,.72),rgba(255,255,255,.08));pointer-events:none}
#vw-home-v2-root .vw2-bottom .vw2-mode>span,#vw-home-v2-root .vw2-bottom .vw2-mode>b,#vw-home-v2-root .vw2-bottom .vw2-mode>.vw2-source-badge{position:relative;z-index:2}
#vw-home-v2-root .vw2-bottom .vw2-mode .vw2-icon{}
#vw-home-v2-root .vw2-bottom .vw2-mode b{font-weight:950;color:inherit;text-shadow:inherit}
#vw-home-v2-root .vw2-bottom .blue{background:linear-gradient(180deg,#62dcff 0%,#2f9df2 54%,#2373d7 100%)!important}
#vw-home-v2-root .vw2-bottom .green{background:linear-gradient(180deg,#72efb0 0%,#2bc77e 55%,#149d5c 100%)!important}
#vw-home-v2-root .vw2-bottom .orange{background:linear-gradient(180deg,#ffc068 0%,#f5893e 55%,#df5e2c 100%)!important}
#vw-home-v2-root .vw2-bottom .gold{background:linear-gradient(180deg,#ffe77a 0%,#ffc637 56%,#e99a1c 100%)!important;color:#6b4311;text-shadow:0 1px 0 rgba(255,255,255,.58)}
#vw-home-v2-root .vw2-bottom .lime{background:linear-gradient(180deg,#b9f370 0%,#72ce4b 55%,#3ba63e 100%)!important}
#vw-home-v2-root .vw2-bottom .violet{background:linear-gradient(180deg,#c995ff 0%,#8b60ec 55%,#6540d1 100%)!important}
#vw-home-v2-root .vw2-bottom .pink{background:linear-gradient(180deg,#ff9aca 0%,#ef5aa7 55%,#c73c8a 100%)!important}
#vw-home-v2-root .vw2-bottom .book{background:linear-gradient(180deg,#80d9ff 0%,#5a9df5 54%,#5571dd 100%)!important}
#vw-home-v2-root .vw2-bottom .game{background:radial-gradient(circle at 22% 8%,rgba(255,255,255,.82),transparent 25%),linear-gradient(180deg,#ffe66f 0%,#ffaf31 48%,#f06b37 100%)!important;color:#6a3515;text-shadow:0 1px 0 rgba(255,255,255,.58);box-shadow:0 6px 0 #bd5a27,0 10px 14px rgba(112,58,28,.2),inset 0 2px 0 rgba(255,255,255,.72)!important;transform:translateY(-1px)}
#vw-home-v2-root .vw2-bottom .game:after{content:"★";position:absolute;right:4px;top:2px;z-index:1;color:#fff5a9;font-size:9px;text-shadow:0 1px 0 rgba(145,78,20,.35);pointer-events:none}
#vw-home-v2-root .vw2-bottom .vw2-mode:active{transform:translateY(2px) scale(.985)}
#vw-home-v2-root .vw2-bottom .game:active{transform:translateY(2px) scale(.985)}

@media (max-width:1100px) and (orientation:landscape) and (max-height:650px){
  /* Keep the locked 3-row mobile composition; only grant the identity card 8px more visual authority. */
  #vw-home-v2-root .vw2-shell{grid-template-rows:72px minmax(0,1fr) 50px!important}
  #vw-home-v2-root .vw2-top{grid-template-columns:minmax(176px,24%) minmax(0,1fr) minmax(155px,22%)!important;grid-template-rows:72px!important;height:72px!important}
  #vw-home-v2-root .vw2-profile{height:72px!important;padding:6px 8px!important;gap:7px!important;border-radius:20px!important}
  #vw-home-v2-root .vw2-avatar{width:56px!important;height:56px!important;flex:0 0 56px!important;border-radius:17px!important}
  #vw-home-v2-root .vw2-avatar .vw2-icon{width:40px!important;height:40px!important}
  #vw-home-v2-root .vw2-name-row strong{font-size:14.5px!important}
  #vw-home-v2-root .vw2-id{font-size:7.8px!important;padding:1px 6px!important}
  #vw-home-v2-root .vw2-minirow{font-size:8.1px!important;line-height:1.08!important;margin-top:2px!important}
  #vw-home-v2-root .vw2-profile-chips{margin-top:3px!important;gap:4px!important}
  #vw-home-v2-root .vw2-rank{font-size:7.8px!important;padding:2px 6px!important}
  #vw-home-v2-root .vw2-sync-chip{font-size:6.9px!important;max-width:82px!important}
  #vw-home-v2-root .vw2-wallet,#vw-home-v2-root .vw2-top-actions{height:72px!important}
  #vw-home-v2-root .vw2-wallet-pill,#vw-home-v2-root .vw2-top-actions .vw2-tool-btn,#vw-home-v2-root .vw2-top-actions .vw2-classic{height:60px!important;min-height:60px!important}

  #vw-home-v2-root .vw2-left{padding:7px 5px 25px!important;gap:5px!important}
  #vw-home-v2-root .vw2-left .vw2-rail-btn{flex-basis:50px!important;height:50px!important;min-height:50px!important;padding:4px 2px 3px!important;border-radius:48% 52% 42% 58% / 57% 57% 43% 43%!important}
  #vw-home-v2-root .vw2-left .vw2-rail-btn:before,#vw-home-v2-root .vw2-left .vw2-rail-btn:after{top:-4px;height:14px;border-width:2px}
  #vw-home-v2-root .vw2-left .vw2-rail-btn>span,#vw-home-v2-root .vw2-left .vw2-rail-btn .vw2-icon{width:27px!important;height:27px!important}
  #vw-home-v2-root .vw2-left .vw2-rail-btn b{font-size:8px!important;line-height:1.02!important;text-align:center!important;text-shadow:0 1px 0 #fff!important}
  #vw-home-v2-root .vw2-left-scroll-cue{width:30px;height:18px;bottom:2px;font-size:15px}

  #vw-home-v2-root .vw2-bottom .vw2-mode{border-width:3px!important;box-shadow:0 3px 0 rgba(56,51,120,.26),0 5px 8px rgba(51,50,111,.11),inset 0 2px 0 rgba(255,255,255,.46)!important}
  #vw-home-v2-root .vw2-bottom .vw2-mode .vw2-icon{width:24px!important;height:24px!important}
  #vw-home-v2-root .vw2-bottom .vw2-mode b{font-size:8.1px!important;line-height:1.03!important}
  #vw-home-v2-root .vw2-bottom .game{box-shadow:0 4px 0 #b65526,0 7px 9px rgba(99,55,26,.16),inset 0 2px 0 rgba(255,255,255,.64)!important}

  #vw-home-v2-root .vw2-feed,#vw-home-v2-root .vw2-mission,#vw-home-v2-root .vw2-online,#vw-home-v2-root .vw2-feature{box-shadow:0 3px 0 rgba(86,75,160,.13),0 5px 8px rgba(58,62,132,.09),inset 0 1px 0 rgba(255,255,255,.9)}
  #vw-home-v2-root .vw2-mission:before,#vw-home-v2-root .vw2-online:before{font-size:9px;right:6px;top:5px}
}
@media (max-width:1100px) and (orientation:landscape) and (max-height:370px){
  #vw-home-v2-root .vw2-shell{grid-template-rows:68px minmax(0,1fr) 50px!important}
  #vw-home-v2-root .vw2-top{grid-template-rows:68px!important;height:68px!important}
  #vw-home-v2-root .vw2-profile,#vw-home-v2-root .vw2-wallet,#vw-home-v2-root .vw2-top-actions{height:68px!important}
  #vw-home-v2-root .vw2-profile{padding:5px 7px!important}
  #vw-home-v2-root .vw2-avatar{width:53px!important;height:53px!important;flex-basis:53px!important}
  #vw-home-v2-root .vw2-name-row strong{font-size:14px!important}
  #vw-home-v2-root .vw2-wallet-pill,#vw-home-v2-root .vw2-top-actions .vw2-tool-btn,#vw-home-v2-root .vw2-top-actions .vw2-classic{height:58px!important;min-height:58px!important}
}
@media (prefers-reduced-motion:reduce){#vw-home-v2-root .vw2-left-scroll-cue>span{animation:none!important}}

@media (prefers-reduced-motion:reduce){#vw-home-v2-root .vw2-atmosphere i,#vw-home-v2-root .vw2-stage-cloud,#vw-home-v2-root .vw2-castle,#vw-home-v2-root .vw2-rainbow,#vw-home-v2-root .vw2-pet img,#vw-home-v2-root .vw2-pet .vw2-dragon-art,#vw-home-v2-root .vw2-pet-sparkles i{animation:none!important}}

/* === Home V2 Premium Cute Lightweight Visual Fidelity Pass R3 ===
   Visual-only R3: Premium Hero Identity Card + true puffy cloud rail +
   authoritative owned/current house backdrop + contextual top-stat artwork.
   Bottom horizontal rail is intentionally not restyled here. */

/* Premium Hero Identity Card */
#vw-home-v2-root .vw2-profile{
  position:relative;overflow:hidden;isolation:isolate;padding:10px 13px 9px 11px;
  gap:12px;border-radius:28px;
  background:
    radial-gradient(circle at 10% 8%,rgba(255,255,255,.98) 0 9%,transparent 24%),
    radial-gradient(circle at 88% 15%,rgba(255,196,230,.62),transparent 30%),
    linear-gradient(145deg,#fffefd 0%,#eaf8ff 48%,#ede1ff 100%);
  box-shadow:0 6px 0 rgba(91,73,169,.22),0 12px 22px rgba(61,66,145,.17),inset 0 2px 0 #fff,inset 0 0 0 2px rgba(166,143,235,.22)
}
#vw-home-v2-root .vw2-profile:after{content:"";position:absolute;z-index:-1;right:-24px;bottom:-43px;width:145px;height:145px;border-radius:50%;background:radial-gradient(circle at 38% 35%,rgba(255,240,133,.42) 0 8%,transparent 9%),radial-gradient(circle,rgba(166,132,244,.18),transparent 67%);pointer-events:none}
#vw-home-v2-root .vw2-profile-kicker{position:absolute;right:12px;top:7px;display:flex;align-items:center;gap:4px;font-size:7px;font-weight:950;letter-spacing:.09em;color:#8467ba;text-transform:uppercase}
#vw-home-v2-root .vw2-profile-kicker i{font-style:normal;color:#ffc83f;font-size:11px;text-shadow:0 1px 0 #fff}
#vw-home-v2-root .vw2-profile .vw2-avatar{width:82px;height:82px;flex:0 0 82px;border-radius:27px;border:4px solid #fff;box-shadow:0 0 0 3px #c7b0ff,0 7px 13px rgba(78,69,142,.22),inset 0 2px 0 #fff}
#vw-home-v2-root .vw2-profile-main{display:flex;flex-direction:column;justify-content:center;min-width:0}
#vw-home-v2-root .vw2-profile .vw2-name-row{padding-right:70px;gap:5px}
#vw-home-v2-root .vw2-profile .vw2-name-row strong{font-size:20px;line-height:1.08;font-weight:950;color:#263567;text-shadow:0 1px 0 #fff}
#vw-home-v2-root .vw2-profile-meta{display:grid;grid-template-columns:minmax(0,1.08fr) minmax(0,.95fr) minmax(0,.88fr) minmax(0,.72fr);gap:4px;margin-top:5px}
#vw-home-v2-root .vw2-profile-meta-chip{min-width:0;padding:3px 6px 4px;border:2px solid rgba(255,255,255,.94);border-radius:10px;background:linear-gradient(180deg,rgba(255,255,255,.96),rgba(229,239,255,.88));box-shadow:0 2px 0 rgba(102,88,173,.11),inset 0 1px 0 #fff;overflow:hidden}
#vw-home-v2-root .vw2-profile-meta-chip:nth-child(2){background:linear-gradient(180deg,#f7efff,#e2d3ff)}
#vw-home-v2-root .vw2-profile-meta-chip:nth-child(3){background:linear-gradient(180deg,#fff9dc,#ffe7a1)}
#vw-home-v2-root .vw2-profile-meta-chip:nth-child(4){background:linear-gradient(180deg,#edfbff,#ccefff)}
#vw-home-v2-root .vw2-profile-meta-chip small{display:block;font-size:6.4px;line-height:1;color:#756c9b;font-weight:950;letter-spacing:.025em;white-space:nowrap}
#vw-home-v2-root .vw2-profile-meta-chip b{display:block;margin-top:2px;font-size:8.4px;line-height:1.05;color:#394877;font-weight:950;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
#vw-home-v2-root .vw2-profile .vw2-id{display:block;margin:0;padding:0;border:0;border-radius:0;background:none;box-shadow:none;color:inherit;font-size:inherit}
#vw-home-v2-root .vw2-profile-chips{display:flex;align-items:center;gap:5px;margin-top:5px;min-width:0}
#vw-home-v2-root .vw2-profile .vw2-rank{margin:0;min-width:0;max-width:100%;padding:3px 8px;border-radius:999px;font-size:8.5px;line-height:1.1}
#vw-home-v2-root .vw2-profile .vw2-sync-chip{margin:0;max-width:110px}

/* Top statistics: contextual art, with the real project coin PNG for My Coins. */
#vw-home-v2-root .vw2-wallet-pill{display:grid!important;grid-template-columns:36px minmax(0,1fr);grid-template-rows:1fr;align-items:center!important;justify-content:stretch!important;column-gap:5px!important;text-align:left!important;padding:5px 8px!important}
#vw-home-v2-root .vw2-wallet-pill.coin{grid-template-columns:42px minmax(0,1fr) 18px!important}
#vw-home-v2-root .vw2-stat-art{width:34px;height:34px;display:grid;place-items:center;align-self:center;filter:drop-shadow(0 3px 3px rgba(72,64,130,.16))}
#vw-home-v2-root .vw2-stat-art .vw2-icon{width:34px!important;height:34px!important}
#vw-home-v2-root .vw2-stat-art-coin{width:40px;height:40px}
#vw-home-v2-root .vw2-stat-coin-img{display:block;width:40px;height:40px;object-fit:contain;filter:drop-shadow(0 4px 3px rgba(142,96,16,.25))}
#vw-home-v2-root .vw2-stat-copy{min-width:0;display:flex;flex-direction:column;justify-content:center;line-height:1.02}
#vw-home-v2-root .vw2-stat-copy small{display:block;font-size:8px!important;line-height:1.05}
#vw-home-v2-root .vw2-stat-copy b{display:block;font-size:13px!important;line-height:1.05;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
#vw-home-v2-root .vw2-stat-copy .vw2-pill-status{font-size:6.6px!important;line-height:1.05;margin-top:2px!important}
#vw-home-v2-root .vw2-wallet-pill.coin em{grid-column:3!important;grid-row:1!important;align-self:center;justify-self:end}

/* Left Vertical Rail R3: icon floats above a cloud pedestal; label sits inside cloud. */
#vw-home-v2-root .vw2-left{position:relative;display:flex!important;flex-direction:column!important;align-items:stretch!important;justify-content:flex-start!important;overflow-y:auto!important;overflow-x:hidden!important;padding:8px 6px 28px!important;gap:7px!important;scrollbar-width:none!important;-ms-overflow-style:none;scroll-padding-bottom:28px;-webkit-overflow-scrolling:touch;touch-action:pan-y;overscroll-behavior:contain}
#vw-home-v2-root .vw2-left::-webkit-scrollbar{display:none!important;width:0!important;height:0!important}
#vw-home-v2-root .vw2-left .vw2-rail-btn{
  --vw2-cloud-a:#f9f6ff;--vw2-cloud-b:#cdbdff;--vw2-cloud-ink:#56417e;
  position:relative!important;isolation:isolate;flex:0 0 78px!important;width:100%!important;height:78px!important;min-height:78px!important;
  display:block!important;padding:0!important;border:0!important;border-radius:0!important;background:transparent!important;
  box-shadow:none!important;overflow:visible!important;color:var(--vw2-cloud-ink)!important
}
#vw-home-v2-root .vw2-left .vw2-rail-btn:nth-child(4n+2){--vw2-cloud-a:#fff5fb;--vw2-cloud-b:#ffb8d7;--vw2-cloud-ink:#7b3f69}
#vw-home-v2-root .vw2-left .vw2-rail-btn:nth-child(4n+3){--vw2-cloud-a:#f4fdff;--vw2-cloud-b:#9fe4ff;--vw2-cloud-ink:#356783}
#vw-home-v2-root .vw2-left .vw2-rail-btn:nth-child(4n+4){--vw2-cloud-a:#f8fff5;--vw2-cloud-b:#aee7c5;--vw2-cloud-ink:#3d7358}
#vw-home-v2-root .vw2-left .vw2-rail-btn:before{
  content:"";position:absolute;z-index:1;left:3px;right:3px;bottom:3px;height:39px;
  border:3px solid rgba(255,255,255,.98);border-radius:21px 21px 18px 18px;
  background:radial-gradient(circle at 24% 10%,rgba(255,255,255,.98),transparent 27%),linear-gradient(180deg,var(--vw2-cloud-a),var(--vw2-cloud-b));
  box-shadow:0 5px 0 rgba(89,70,156,.2),0 9px 13px rgba(65,60,130,.13),inset 0 2px 0 #fff
}
#vw-home-v2-root .vw2-left .vw2-rail-btn:after{
  content:"";position:absolute;z-index:0;left:15px;bottom:29px;width:30px;height:22px;border:3px solid #fff;border-bottom:0;border-radius:50% 50% 0 0;
  background:linear-gradient(180deg,var(--vw2-cloud-a),var(--vw2-cloud-b));
  box-shadow:24px -5px 0 -2px var(--vw2-cloud-a),44px 2px 0 -5px var(--vw2-cloud-b);
  pointer-events:none
}
#vw-home-v2-root .vw2-left .vw2-rail-art{position:absolute!important;z-index:4!important;left:50%;top:0!important;transform:translateX(-50%);width:48px!important;height:48px!important;display:grid!important;place-items:center!important}
#vw-home-v2-root .vw2-left .vw2-rail-art:before{content:"";position:absolute;inset:4px;border-radius:50%;background:radial-gradient(circle at 30% 20%,#fff 0 12%,transparent 14%),linear-gradient(180deg,rgba(255,255,255,.96),rgba(243,236,255,.74));border:2px solid rgba(255,255,255,.94);box-shadow:0 4px 8px rgba(74,64,137,.14);z-index:-1}
#vw-home-v2-root .vw2-left .vw2-rail-art .vw2-icon{width:45px!important;height:45px!important;filter:drop-shadow(0 4px 3px rgba(62,52,116,.18))}
#vw-home-v2-root .vw2-left .vw2-rail-label{position:absolute!important;z-index:4!important;left:5px;right:5px;bottom:9px;margin:0!important;font-size:10px!important;line-height:1.08!important;font-weight:950!important;color:var(--vw2-cloud-ink)!important;text-align:center!important;white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important;text-shadow:0 1px 0 #fff!important}
#vw-home-v2-root .vw2-left .vw2-rail-btn.vw2-current:before,#vw-home-v2-root .vw2-left .vw2-rail-btn[aria-current="page"]:before{
  border-color:#fff8b0;box-shadow:0 5px 0 #cb8c31,0 0 0 3px rgba(255,224,89,.48),0 10px 15px rgba(118,73,35,.15),inset 0 2px 0 #fff;
  background:radial-gradient(circle at 28% 9%,#fff 0 12%,transparent 28%),linear-gradient(180deg,#fff6aa,#ffcf55)
}
#vw-home-v2-root .vw2-left .vw2-rail-btn.vw2-current .vw2-rail-art{transform:translateX(-50%) translateY(-2px) scale(1.06)}
#vw-home-v2-root .vw2-left .vw2-rail-btn:disabled{opacity:.72!important;filter:grayscale(.35) saturate(.72)!important}
#vw-home-v2-root .vw2-left .vw2-rail-btn:disabled .vw2-rail-label{color:#6e6a82!important}
#vw-home-v2-root .vw2-left-scroll-cue{z-index:10!important}

/* Center hero: actual selected/owned house from state.home, never decorative fake castle. */
#vw-home-v2-root .vw2-house-backdrop{position:absolute;z-index:2;left:4%;right:4%;top:9%;bottom:12%;display:flex;align-items:flex-end;justify-content:center;pointer-events:none;opacity:.96}
#vw-home-v2-root .vw2-house-backdrop img{display:block;width:100%;height:100%;object-fit:contain;object-position:center bottom;filter:drop-shadow(0 8px 8px rgba(27,33,74,.25))}
#vw-home-v2-root .vw2-house-backdrop[data-variant="dark"] img{filter:drop-shadow(0 8px 8px rgba(18,23,58,.3)) saturate(.96)}
#vw-home-v2-root .vw2-house-backdrop[data-variant="decayed"] img{filter:drop-shadow(0 8px 8px rgba(30,33,57,.26)) saturate(.9)}
#vw-home-v2-root .vw2-house-backdrop.is-empty{display:none}
#vw-home-v2-root .vw2-house-chip{position:absolute;z-index:6;right:4%;top:5%;max-width:36%;height:28px;padding:2px 8px 2px 4px;border:2px solid rgba(255,255,255,.94);border-radius:999px;background:linear-gradient(180deg,rgba(255,255,255,.96),rgba(232,222,255,.92));box-shadow:0 3px 0 rgba(91,72,155,.15);display:flex;align-items:center;gap:4px;color:#5c4b85;font-size:8px;font-weight:950;white-space:nowrap;overflow:hidden}
#vw-home-v2-root .vw2-house-chip .vw2-icon{width:22px!important;height:22px!important;flex:0 0 22px}
#vw-home-v2-root .vw2-house-chip span{overflow:hidden;text-overflow:ellipsis}
#vw-home-v2-root .vw2-feature-stage .vw2-rainbow{opacity:.34}
#vw-home-v2-root .vw2-feature-stage .vw2-mid-hills{opacity:.43}
#vw-home-v2-root .vw2-feature-stage .vw2-stage-foreground{opacity:.5}
#vw-home-v2-root .vw2-pet-halo{z-index:3}
#vw-home-v2-root .vw2-pet{z-index:5}
#vw-home-v2-root .vw2-player-mini,#vw-home-v2-root .vw2-speech,#vw-home-v2-root .vw2-reward-card,#vw-home-v2-root .vw2-stage-copy{z-index:7}

/* Primary mobile target 844x390, also covering 667x375 / 800x360 / 915x412. */
@media (max-width:1100px) and (orientation:landscape) and (max-height:650px){
  #vw-home-v2-root .vw2-shell{grid-template-rows:80px minmax(0,1fr) 50px!important}
  #vw-home-v2-root .vw2-top{grid-template-columns:minmax(190px,28%) minmax(0,1fr) minmax(145px,22%)!important;grid-template-rows:80px!important;height:80px!important}
  #vw-home-v2-root .vw2-profile{height:80px!important;padding:5px 7px!important;gap:7px!important;border-radius:21px!important}
  #vw-home-v2-root .vw2-profile-kicker{right:7px;top:4px;font-size:5.4px}
  #vw-home-v2-root .vw2-profile-kicker i{font-size:8px}
  #vw-home-v2-root .vw2-profile .vw2-avatar{width:64px!important;height:64px!important;flex:0 0 64px!important;border-radius:19px!important;border-width:3px!important}
  #vw-home-v2-root .vw2-profile .vw2-name-row{padding-right:48px!important}
  #vw-home-v2-root .vw2-profile .vw2-name-row strong{font-size:16.5px!important}
  #vw-home-v2-root .vw2-profile .vw2-pencil .vw2-icon{width:17px!important;height:17px!important}
  #vw-home-v2-root .vw2-profile-meta{grid-template-columns:1fr 1fr;gap:2px;margin-top:3px}
  #vw-home-v2-root .vw2-profile-meta-chip{padding:2px 4px 3px;border-width:1px;border-radius:7px}
  #vw-home-v2-root .vw2-profile-meta-chip small{font-size:4.9px}
  #vw-home-v2-root .vw2-profile-meta-chip b{font-size:6.8px;margin-top:1px}
  #vw-home-v2-root .vw2-profile-chips{margin-top:2px!important;gap:3px!important}
  #vw-home-v2-root .vw2-profile .vw2-rank{font-size:6.7px!important;padding:2px 5px!important}
  #vw-home-v2-root .vw2-profile .vw2-sync-chip{font-size:5.8px!important;padding:2px 4px!important;max-width:72px!important}

  #vw-home-v2-root .vw2-wallet,#vw-home-v2-root .vw2-top-actions{height:80px!important}
  #vw-home-v2-root .vw2-wallet-pill{flex:0 0 82px!important;width:82px!important;min-width:82px!important;height:62px!important;min-height:62px!important;grid-template-columns:27px minmax(0,1fr)!important;column-gap:3px!important;padding:3px 4px!important}
  #vw-home-v2-root .vw2-wallet-pill.coin{flex-basis:102px!important;width:102px!important;min-width:102px!important;grid-template-columns:31px minmax(0,1fr) 13px!important}
  #vw-home-v2-root .vw2-stat-art{width:26px;height:26px}.vw2-stat-art .vw2-icon{width:26px!important;height:26px!important}
  #vw-home-v2-root .vw2-stat-art-coin,#vw-home-v2-root .vw2-stat-coin-img{width:30px;height:30px}
  #vw-home-v2-root .vw2-stat-copy small{font-size:6.5px!important}
  #vw-home-v2-root .vw2-stat-copy b{font-size:10.3px!important}
  #vw-home-v2-root .vw2-stat-copy .vw2-pill-status{font-size:5.6px!important}
  #vw-home-v2-root .vw2-top-actions .vw2-tool-btn,#vw-home-v2-root .vw2-top-actions .vw2-classic{height:62px!important;min-height:62px!important}

  #vw-home-v2-root .vw2-main-grid{grid-template-columns:clamp(82px,13vw,104px) clamp(88px,14vw,112px) minmax(0,1fr) clamp(128px,20vw,166px)!important}
  #vw-home-v2-root .vw2-left{padding:5px 4px 23px!important;gap:5px!important}
  #vw-home-v2-root .vw2-left .vw2-rail-btn{flex-basis:68px!important;height:68px!important;min-height:68px!important}
  #vw-home-v2-root .vw2-left .vw2-rail-btn:before{left:2px;right:2px;bottom:2px;height:34px;border-width:2px;border-radius:18px}
  #vw-home-v2-root .vw2-left .vw2-rail-btn:after{left:12px;bottom:25px;width:26px;height:18px;border-width:2px;box-shadow:20px -4px 0 -2px var(--vw2-cloud-a),36px 1px 0 -5px var(--vw2-cloud-b)}
  #vw-home-v2-root .vw2-left .vw2-rail-art{width:43px!important;height:43px!important;top:0!important}
  #vw-home-v2-root .vw2-left .vw2-rail-art .vw2-icon{width:41px!important;height:41px!important}
  #vw-home-v2-root .vw2-left .vw2-rail-label{bottom:7px;font-size:9px!important}
  #vw-home-v2-root .vw2-left-scroll-cue{width:32px;height:18px;bottom:1px;font-size:15px}

  #vw-home-v2-root .vw2-feature-stage{top:61px!important;bottom:43px!important}
  #vw-home-v2-root .vw2-house-backdrop{left:2%;right:2%;top:8%;bottom:10%}
  #vw-home-v2-root .vw2-house-chip{right:2%;top:3%;height:20px;max-width:39%;padding:1px 5px 1px 2px;border-width:1px;font-size:6px}
  #vw-home-v2-root .vw2-house-chip .vw2-icon{width:16px!important;height:16px!important;flex-basis:16px}
  #vw-home-v2-root .vw2-rainbow{opacity:.2!important}
  #vw-home-v2-root .vw2-mid-hills{opacity:.28!important}
  #vw-home-v2-root .vw2-pet-halo{width:126px!important;height:126px!important}
  #vw-home-v2-root .vw2-pet{width:112px!important;height:112px!important}
}

/* Extra-short 800x360 class: keep enlarged identity card without stealing the hero. */
@media (max-width:1100px) and (orientation:landscape) and (max-height:370px){
  #vw-home-v2-root .vw2-shell{grid-template-rows:76px minmax(0,1fr) 50px!important}
  #vw-home-v2-root .vw2-top{grid-template-rows:76px!important;height:76px!important}
  #vw-home-v2-root .vw2-profile,#vw-home-v2-root .vw2-wallet,#vw-home-v2-root .vw2-top-actions{height:76px!important}
  #vw-home-v2-root .vw2-profile .vw2-avatar{width:60px!important;height:60px!important;flex-basis:60px!important}
  #vw-home-v2-root .vw2-profile .vw2-name-row strong{font-size:15.5px!important}
  #vw-home-v2-root .vw2-wallet-pill,#vw-home-v2-root .vw2-top-actions .vw2-tool-btn,#vw-home-v2-root .vw2-top-actions .vw2-classic{height:60px!important;min-height:60px!important}
  #vw-home-v2-root .vw2-left .vw2-rail-btn{flex-basis:64px!important;height:64px!important;min-height:64px!important}
  #vw-home-v2-root .vw2-left .vw2-rail-art{width:40px!important;height:40px!important}
  #vw-home-v2-root .vw2-left .vw2-rail-art .vw2-icon{width:38px!important;height:38px!important}
  #vw-home-v2-root .vw2-left .vw2-rail-label{font-size:8.6px!important}
}

@media (prefers-reduced-motion:reduce){
  #vw-home-v2-root .vw2-left .vw2-rail-btn,#vw-home-v2-root .vw2-left .vw2-rail-art{transition:none!important}
}














`;













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













    // Functional-parity rule: delegate to the lobby's existing pet-shop tab.













    // Never call render/show functions directly here because that would create






    // a second route that could drift from auth/lock checks in the real lobby.













    if(!clickExisting('#tab-addpet')) setPreviewWanted(false);













  }













  function action(name){













    const direct = {






      city:'#btn-rail-city', cure:'#btn-rail-cure', wordsearch:'#btn-rail-wordsearch',






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






    if(panels[name]){ openPanelViaExisting(panels[name]); return; }






    if(standards[name]){ clickExisting(`.lobby-bottom [data-xstd="${standards[name]}"]`); return; }






    if(direct[name]) clickExisting(direct[name], {classicFirst:name === 'rank'});













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

  function build(){













    const dash = dashboard();













    if(!dash || document.getElementById(ROOT_ID)) return;













    ensureVisualStyles();













    const railButtons = [






      ['city','city','เมือง 3D','#btn-rail-city'],






      ['shop','potion','ร้านสัตว์','#tab-addpet'],






      ['cure','heart','รักษา','#btn-rail-cure'],






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






      ['trophy','trophy','ตู้เข็ม','#btn-rail-trophy'],






    ].map(x=>navButton(x[0],x[1],x[2],x[3])).join('');













    const modeButtons = [






      ['vocabbook','bookgold','สมุดคำศัพท์','book','#btn-vocab-book'],






      ['ielts','book','IELTS','blue','.lobby-bottom [data-xstd="ielts"]'],






      ['toeic','book','TOEIC','green','.lobby-bottom [data-xstd="toeic"]'],






      ['toefl','book','TOEFL','orange','.lobby-bottom [data-xstd="toefl"]'],






      ['onetp6','star','O-NET ป.6','gold','.lobby-bottom [data-xstd="onetp6"]'],






      ['onetm3','leaf','O-NET ม.3','lime','.lobby-bottom [data-xstd="onetm3"]'],






      ['onetm6','crown','O-NET ม.6','violet','.lobby-bottom [data-xstd="onetm6"]'],






      ['cats','sparkle','หมวดคำศัพท์','pink','#btn-cats'],






      ['play','controller','จับคู่คำศัพท์','game','#btn-play'],






      ['picmatch','picture','จับคู่ภาพ','blue','#btn-picmatch'],






      ['picdict','bookgold','Picture Dictionary','green','#btn-picdict'],






      ['picquiz','headphones','ครูถามศัพท์','orange','#btn-picquiz'],






      ['bandexam','clipboard','สอบเลื่อนขั้น','violet','#btn-band-exam'],






    ].map(x=>bottomButton(x[0],x[1],x[2],x[3],x[4])).join('');













    root = document.createElement('div');













    root.id = ROOT_ID;













    root.setAttribute('aria-label','Vocab World Home V2 Admin Preview');













    root.innerHTML = `













      <div class="vw2-sky" aria-hidden="true"><i></i><i></i><i></i><i></i></div>













      <div class="vw2-shell">













        <header class="vw2-top">













          <section class="vw2-profile vw2-glass">













            <div class="vw2-profile-kicker"><span>MY PROFILE</span><i aria-hidden="true">✦</i></div>













            <div class="vw2-avatar" id="vw2-avatar">${knightFallback()}</div>













            <div class="vw2-profile-main">













              <div class="vw2-name-row"><strong id="vw2-name">ผู้เล่น</strong><span class="vw2-pencil">${icon('edit')}</span></div>













              <div class="vw2-profile-meta">













                <span class="vw2-profile-meta-chip class"><small>ระดับ / ชั้น</small><b id="vw2-grade">—</b></span>













                <span class="vw2-profile-meta-chip id"><small>PLAYER ID</small><b id="vw2-id">ID —</b></span>













                <span class="vw2-profile-meta-chip date"><small>DATE</small><b id="vw2-date">—</b></span>













                <span class="vw2-profile-meta-chip time"><small>TIME</small><b id="vw2-clock">—</b></span>













              </div>













              <div class="vw2-profile-chips"><div class="vw2-rank" id="vw2-rank">กำลังโหลดแรงค์…</div><div class="vw2-sync-chip" id="vw2-sync-state" hidden></div></div>













            </div>













          </section>













          <section class="vw2-wallet" aria-label="ข้อมูลรายได้และทรัพย์สิน">













            <button class="vw2-wallet-pill coin" data-vw2-action="rank" data-vw2-source="#btn-rail-rank" title="เหรียญที่มีอยู่">${walletArtwork('coin')}<span class="vw2-stat-copy"><small>เหรียญของฉัน</small><b id="vw2-coins">0</b><span class="vw2-pill-status">ยอดคงเหลือ</span></span><em>+</em></button>













            <div class="vw2-wallet-pill today" title="เหรียญที่หาได้วันนี้">${walletArtwork('today')}<span class="vw2-stat-copy"><small>รายได้วันนี้</small><b>+<span id="vw2-today">0</span></b><span class="vw2-pill-status">สะสมวันนี้</span></span></div>













            <div class="vw2-wallet-pill online" title="รายได้ที่ได้รับขณะออนไลน์">${walletArtwork('online')}<span class="vw2-stat-copy"><small>รายได้ออนไลน์</small><b>+<span id="vw2-online-earn">0</span></b><span class="vw2-pill-status" id="vw2-online-status">กำลังตรวจสอบ</span></span></div>













            <div class="vw2-wallet-pill computer" title="รายได้สะสมจากคอมพิวเตอร์">${walletArtwork('computer')}<span class="vw2-stat-copy"><small>รายได้จากคอม</small><b>+<span id="vw2-comp-earn">0</span></b><span class="vw2-pill-status" id="vw2-comp-status">กำลังตรวจสอบ</span></span></div>













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













            <div class="vw2-section-head"><span class="vw2-head-icon">${icon('globe')}</span><strong>Global Feed</strong><button data-vw2-action="classic" title="เปิดฟีดเดิม">ดูทั้งหมด</button></div>













            <div class="vw2-feed-card">













              <div class="vw2-feed-avatar">${icon('sparkle')}</div>













              <div><b>กิจกรรมล่าสุด</b><p id="vw2-feed-text">กำลังโหลดกิจกรรมของเพื่อน…</p></div>













            </div>













            <div class="vw2-feed-stats"><span>♡ ถูกใจ <b id="vw2-feed-likes">—</b></span><span>${icon('chat')} ความคิดเห็น</span></div>













            <div class="vw2-feed-coin">${icon('coin')}<span>เรียน เล่น และเติบโตไปพร้อมกัน</span></div>













          </section>













          <main class="vw2-feature">













            <div class="vw2-feature-title"><span>${icon('sparkle')}</span><strong>Vocab World</strong><span>${icon('sparkle')}</span></div>













            <div class="vw2-word-ribbon" id="vw2-newword">คำศัพท์ใหม่รอหนูอยู่</div>













            <div class="vw2-feature-stage">













              <div class="vw2-atmosphere" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i></div>













              <div class="vw2-stage-cloud c1"></div><div class="vw2-stage-cloud c2"></div>













              <div class="vw2-rainbow" aria-hidden="true"></div>













              <div class="vw2-house-backdrop is-empty" id="vw2-house-visual" aria-hidden="true"></div>













              <div class="vw2-house-chip" aria-hidden="true">${icon('home')}<span id="vw2-house-label">ยังไม่มีบ้าน</span></div>













              <div class="vw2-mid-hills" aria-hidden="true"></div>













              <div class="vw2-speech"><span id="vw2-pet-greeting">น้องดีใจที่ได้เจอหนูอีกครั้ง!</span><small>ยินดีต้อนรับกลับ Vocab World — ไปผจญภัยด้วยกันนะ</small></div>













              <div class="vw2-pet-halo"></div>













              <div class="vw2-pet-platform" aria-hidden="true"></div>













              <div class="vw2-pet" id="vw2-pet">${mascotDragon()}</div>













              <div class="vw2-pet-sparkles" aria-hidden="true"><i>♥</i><i>★</i><i>✦</i><i>♥</i></div>













              <div class="vw2-player-mini" id="vw2-player-mini">${knightFallback()}</div>













              <div class="vw2-reward-card">${icon('trophy')}<div><b>ปราสาทรางวัล</b><small>สะสมดาวแล้วปลดล็อก</small></div></div>













              <div class="vw2-stage-copy"><b id="vw2-pet-name">ออกผจญภัยกับน้อง</b><span>น้องกำลังต้อนรับหนู · ฝึกคำศัพท์ · สะสมเหรียญ</span></div>













              <div class="vw2-stage-foreground" aria-hidden="true"></div>













            </div>













            <div class="vw2-feature-actions">













              <button class="vw2-enter" data-vw2-action="city" data-vw2-source="#btn-rail-city">${icon('city')} เข้าโลก 3D</button>













              <button class="vw2-play" data-vw2-action="play" data-vw2-source="#btn-play">${icon('controller')} เกมจับคู่คำศัพท์</button>













            </div>













          </main>













          <aside class="vw2-right">













            <section class="vw2-mission vw2-glass">













              <div class="vw2-section-head"><span class="vw2-head-icon">${icon('target')}</span><strong>ภารกิจวันนี้</strong><b id="vw2-quest-count">0/0</b></div>













              <div class="vw2-progress"><i id="vw2-quest-bar"></i></div>













              <div id="vw2-quests" class="vw2-quests"><div class="vw2-empty">กำลังโหลดภารกิจ…</div></div>













            </section>













            <section class="vw2-online vw2-glass">













              <div class="vw2-section-head"><span class="vw2-head-icon">${icon('friends')}</span><strong>เพื่อนออนไลน์</strong><b id="vw2-online-count">—</b></div>













              <div class="vw2-online-card"><span class="vw2-online-dot"></span><div><b id="vw2-online-name">กำลังเชื่อมต่อ…</b><small id="vw2-online-text">เล่นและเรียนไปพร้อมกัน</small></div></div>













              <button class="vw2-friends-btn" data-vw2-action="friends" data-vw2-source=".lobby-rail [data-panel=&quot;panel-friends&quot;]">${icon('friends')} ดูเพื่อนทั้งหมด</button>













            </section>













          </aside>













        </div>













        <footer class="vw2-bottom" aria-label="ทางลัดการเรียนและเกมทั้งหมด">${modeButtons}</footer>













        <div class="vw2-preview-mark">ADMIN PREVIEW · PREMIUM CUTE LIGHTWEIGHT</div>













      </div>`;













    dash.appendChild(root);

    setupLeftRailCue();













    root.addEventListener('click', e=>{













      const b = e.target.closest('[data-vw2-action]');













      if(!b || b.disabled) return;













      e.preventDefault();













      if(typeof sfx !== 'undefined' && sfx && typeof sfx.select === 'function') sfx.select();













      action(b.dataset.vw2Action);













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






      }













      const badge = btn.querySelector('.vw2-source-badge');






      if(badge){






        const text = sourceBadge(source);






        badge.textContent = text;






        badge.hidden = !text;






      }













      if(btn.dataset.vw2MirrorVisibility === '1') btn.hidden = !sourceVisible(source);













    });













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













    setText('vw2-name', cleanText(name,28));













    setText('vw2-id', id || 'ID —');













    setText('vw2-coins', fmt(coins));













    setText('vw2-today', fmt(today));













    setText('vw2-worth', fmt(worth));













    const onlineEarn = liveEarnValue('online');













    const compEarn = liveEarnValue('computer');













    setText('vw2-online-earn', fmt(onlineEarn));













    setText('vw2-comp-earn', fmt(compEarn));













    setText('vw2-online-status', liveEarnStatus('online'));













    setText('vw2-comp-status', liveEarnStatus('computer'));













    const gradeText = textOf('#grade-line','');













    const grade = (typeof state !== 'undefined' && state && state.student && state.student.grade) ? state.student.grade : '';













    setText('vw2-grade', gradeText || (grade ? `ระดับชั้น ${cleanText(grade,20)}` : 'ระดับชั้น —'));













    setText('vw2-date', textOf('#clock-chip .ck-date','—'));













    setText('vw2-clock', textOf('#clock-chip .ck-time', textOf('#clock-chip','วันนี้')));













    const offlineSource = document.getElementById('offline-pill');






    const syncChip = document.getElementById('vw2-sync-state');






    if(syncChip){






      const offline = sourceVisible(offlineSource);






      syncChip.hidden = !offline;






      if(offline) syncChip.textContent = cleanText(offlineSource.textContent, 42) || 'ออฟไลน์ · ยังไม่ sync';






    }













    setText('vw2-rank', textOf('#rank-tab','แรงค์กำลังอัปเดต'));













    setText('vw2-newword', textOf('#newword-banner','คำศัพท์ใหม่รอหนูอยู่').replace(/^[✨⭐🌟💫\s]+/,'') || 'คำศัพท์ใหม่รอหนูอยู่');













    copyImage('#pass-photo img','vw2-avatar',knightFallback());













    copyImage('#pass-photo img','vw2-player-mini',knightFallback());













    syncPetVisual();













    syncHouseVisual();













    try{













      if(typeof activePet === 'function'){













        const p=activePet();













        const petName = p && p.name ? cleanText(p.name,24) : 'น้องของฉัน';













        setText('vw2-pet-name', petName);













        setText('vw2-pet-greeting', `${petName} ดีใจที่ได้เจอหนูอีกครั้ง!`);













      }













    }catch(_){ }













    const feed = textOf('#feed-list','ยังไม่มีกิจกรรมใหม่ — เริ่มเล่นเกมเพื่อสร้างเรื่องราวของวันนี้!');













    setText('vw2-feed-text', cleanText(feed,150));













    const likes = (typeof state !== 'undefined' && state && state.feedLikes != null) ? fmt(state.feedLikes) : 'เพื่อน';













    setText('vw2-feed-likes', likes);













    const q = questHTML();













    const qs = document.getElementById('vw2-quests');













    if(qs && qs.dataset.vw2Html !== q.html){ qs.innerHTML = q.html; qs.dataset.vw2Html = q.html; }













    setText('vw2-quest-count', `${Math.min(q.done,q.total)}/${q.total}`);













    const qb = document.getElementById('vw2-quest-bar');













    if(qb) qb.style.width = (q.total ? Math.min(100,(q.done/q.total)*100) : 0) + '%';













    let onlineCount = '';













    let onlineName = '';













    try{













      if(typeof Online !== 'undefined' && Online){













        const list = Array.isArray(Online.friends) ? Online.friends : [];













        onlineCount = String(list.length);













        const f = list[0];













        if(f) onlineName = f.n || f.name || '';













      }













    }catch(_){ }













    if(!onlineCount){













      const sub = textOf('#online-sub','');













      const m = sub.match(/\d+/); onlineCount = m ? m[0] : '—';













    }













    if(!onlineName){













      const raw = textOf('#online-card','กำลังเชื่อมต่อเพื่อนออนไลน์');













      onlineName = cleanText(raw,48);













    }













    setText('vw2-online-count', onlineCount);













    setText('vw2-online-name', onlineName || 'ยังไม่มีเพื่อนออนไลน์');













    setText('vw2-online-text', onlineName ? 'กำลังเรียนอยู่ตอนนี้' : 'ชวนเพื่อนมาเรียนด้วยกัน');













    syncSourceParity();













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






    const rootBox = r ? r.getBoundingClientRect() : null;






    window.parent.postMessage({






      type:'vw-mobile-device-preview-metrics',






      viewport:{width:window.innerWidth,height:window.innerHeight,dpr:window.devicePixelRatio || 1},






      homeV2:{






        present:!!r,visible:!!(r && !r.hidden && dashboardActive()),adminAllowed:adminAllowed(),






        rootWidth:rootBox ? Math.round(rootBox.width) : null,rootHeight:rootBox ? Math.round(rootBox.height) : null,






        horizontalOverflow:r ? r.scrollWidth > r.clientWidth + 1 : null,






        verticalOverflow:r ? r.scrollHeight > r.clientHeight + 1 : null,






        locked:!!(r && shell && rootStyle && shellStyle && !['auto','scroll'].includes(rootStyle.overflowY) && !['auto','scroll'].includes(shellStyle.overflowY) && shell.scrollHeight <= shell.clientHeight + 1),






        panelOverlaps:overlaps,






        actionSources:{total:sourceNodes.length,missing:missingSources}






      },






      rails:{






        leftScrollable:!!(left && leftStyle && ['auto','scroll'].includes(leftStyle.overflowY) && left.scrollHeight > left.clientHeight + 1),
        leftScrollbarHidden:!!(leftStyle && leftStyle.scrollbarWidth === 'none'),
        leftCueCorrect:!!(left && leftCue && ((left.scrollHeight <= left.clientHeight + 2 && !leftCue.classList.contains('is-visible')) || (left.scrollHeight > left.clientHeight + 2 && (leftCue.classList.contains('is-visible') === (left.scrollTop + left.clientHeight < left.scrollHeight - 2))))),
        bottomScrollable:!!(bottom && bottomStyle && ['auto','scroll'].includes(bottomStyle.overflowX) && bottom.scrollWidth > bottom.clientWidth + 1)






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













    if(root) root.hidden = !showV2;













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













