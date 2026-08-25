"use strict";
/* ============================================================
   Vocab World Home V2 — Admin Preview (Phase 1)
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

  function icon(name, extra=''){
    const art = ICON_ART[name] || ICON_ART.sparkle;
    return `<svg class="vw2-icon ${htmlEscape(extra)}" viewBox="0 0 64 64" aria-hidden="true" focusable="false">${art}</svg>`;
  }

  function ensureVisualStyles(){
    if(document.getElementById(STYLE_ID)) return;
    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = `
#vw-home-v2-root{--vw2-ink:#4d4775;--vw2-sub:#746e9b;--vw2-pink:#ff9fc7;--vw2-purple:#a995ff;--vw2-blue:#8bd8ff;--vw2-mint:#8fe1c4;--vw2-peach:#ffc69e;--vw2-yellow:#ffd976;--vw2-panel:rgba(255,255,255,.78);--vw2-line:rgba(117,101,170,.14);font-family:"Noto Sans Thai","Trebuchet MS",system-ui,sans-serif;color:var(--vw2-ink)}
#vw-home-v2-root *{box-sizing:border-box}
#vw-home-v2-root .vw2-shell{position:relative;isolation:isolate;background:linear-gradient(145deg,#eef8ff 0%,#fff1f8 42%,#f4efff 73%,#edfff9 100%);border:1px solid rgba(255,255,255,.82);box-shadow:0 26px 80px rgba(102,88,159,.18),inset 0 1px 0 #fff;overflow:hidden}
#vw-home-v2-root .vw2-shell:before{content:"";position:absolute;inset:0;z-index:-2;background:radial-gradient(circle at 18% 14%,rgba(255,255,255,.95) 0 4%,transparent 15%),radial-gradient(circle at 82% 8%,rgba(255,223,241,.65),transparent 24%),radial-gradient(circle at 52% 90%,rgba(190,235,255,.5),transparent 26%)}
#vw-home-v2-root .vw2-sky{position:absolute;inset:0;pointer-events:none;overflow:hidden;z-index:0}
#vw-home-v2-root .vw2-sky i{position:absolute;width:10px;height:10px;background:#fff;border-radius:50%;box-shadow:0 0 18px rgba(255,255,255,.95)}
#vw-home-v2-root .vw2-sky i:nth-child(1){left:7%;top:13%}#vw-home-v2-root .vw2-sky i:nth-child(2){left:64%;top:10%;width:7px;height:7px}#vw-home-v2-root .vw2-sky i:nth-child(3){right:8%;top:31%;width:12px;height:12px}#vw-home-v2-root .vw2-sky i:nth-child(4){left:44%;bottom:9%;width:8px;height:8px}
#vw-home-v2-root .vw2-glass{background:linear-gradient(145deg,rgba(255,255,255,.92),rgba(255,255,255,.66));border:2px solid rgba(255,255,255,.9);box-shadow:0 12px 28px rgba(111,96,164,.12),inset 0 1px 0 #fff,inset 0 -1px 0 rgba(124,107,180,.08)}
#vw-home-v2-root button{font:inherit;color:inherit;-webkit-tap-highlight-color:transparent}
#vw-home-v2-root button[data-vw2-action]{position:relative;overflow:hidden;transition:transform .14s ease,filter .14s ease,box-shadow .14s ease}
#vw-home-v2-root button[data-vw2-action]:hover{transform:translateY(-2px);filter:saturate(1.05)}
#vw-home-v2-root button[data-vw2-action]:active{transform:translateY(1px) scale(.98);filter:saturate(1.12)}
#vw-home-v2-root .vw2-icon{display:block;width:1.55em;height:1.55em;overflow:visible;filter:drop-shadow(0 3px 3px rgba(80,61,128,.12))}
#vw-home-v2-root .vw2-icon .i-line{fill:none;stroke:#5e5688;stroke-width:3;stroke-linecap:round;stroke-linejoin:round}#vw-home-v2-root .vw2-icon .i-white-line{fill:none;stroke:rgba(255,255,255,.9);stroke-width:3;stroke-linecap:round;stroke-linejoin:round}#vw-home-v2-root .vw2-icon .i-mint-line{fill:none;stroke:#72cdb0;stroke-width:3;stroke-linecap:round}
#vw-home-v2-root .vw2-icon .i-pink{fill:#ff9fc7}.vw2-icon .i-purple{fill:#a995ff}.vw2-icon .i-blue{fill:#8bd8ff}.vw2-icon .i-mint{fill:#8fe1c4}.vw2-icon .i-peach{fill:#ffc69e}.vw2-icon .i-star{fill:#ffd976}.vw2-icon .i-coin{fill:#ffc94f}.vw2-icon .i-coin-hi{fill:#ffe994}.vw2-icon .i-roof{fill:none;stroke:#8a77d6;stroke-width:6;stroke-linecap:round;stroke-linejoin:round}.vw2-icon .i-white{fill:#fff}.vw2-icon .i-dot{fill:#655b8e}
#vw-home-v2-root .vw2-top{position:relative;z-index:2;gap:12px;align-items:stretch}
#vw-home-v2-root .vw2-profile{border-radius:26px;padding:10px 14px}
#vw-home-v2-root .vw2-avatar{border-radius:22px;background:linear-gradient(145deg,#fff,#e8ddff);border:3px solid #fff;box-shadow:0 7px 18px rgba(122,98,184,.2),0 0 0 3px rgba(173,151,255,.22)}
#vw-home-v2-root .vw2-avatar img,#vw-home-v2-root .vw2-player-mini img,#vw-home-v2-root .vw2-pet img{filter:drop-shadow(0 8px 10px rgba(80,61,128,.18))}
#vw-home-v2-root .vw2-name-row strong{font-weight:900;letter-spacing:.01em}.vw2-name-row .vw2-pencil{display:inline-flex;width:24px;height:24px;border-radius:10px;background:#fff0f6;align-items:center;justify-content:center;margin-left:5px}.vw2-name-row .vw2-pencil .vw2-icon{width:15px;height:15px}
#vw-home-v2-root .vw2-id{color:#9a90b5;font-weight:800}.vw2-rank{display:inline-flex;align-items:center;width:max-content;max-width:100%;background:linear-gradient(90deg,#fff4be,#ffe0aa);border:1px solid rgba(211,161,61,.18);border-radius:999px;padding:4px 10px;color:#7d6238;font-weight:800;box-shadow:inset 0 1px 0 #fff}
#vw-home-v2-root .vw2-wallet{gap:8px}.vw2-wallet-pill.coin{display:flex!important;align-items:center!important;justify-content:center!important;gap:6px!important}.vw2-wallet-pill{border-radius:22px!important;border:2px solid #fff!important;box-shadow:0 8px 18px rgba(102,88,159,.12),inset 0 1px 0 rgba(255,255,255,.9)!important}.vw2-wallet-pill.coin{background:linear-gradient(145deg,#fff5bc,#ffe08d)!important}.vw2-wallet-pill.today{background:linear-gradient(145deg,#e9fff6,#bff4df)!important}.vw2-wallet-pill.worth{background:linear-gradient(145deg,#f3eeff,#dfd1ff)!important}.vw2-wallet-pill .vw2-icon{width:28px;height:28px}.vw2-wallet-pill em{background:#fff;color:#8d72d9;border-radius:50%;font-style:normal;width:22px;height:22px;display:inline-grid;place-items:center;box-shadow:0 3px 8px rgba(88,70,140,.15)}
#vw-home-v2-root .vw2-top-actions{gap:7px}.vw2-top-actions>button:not(.vw2-classic){width:48px;height:48px;border:2px solid #fff!important;border-radius:17px!important;background:linear-gradient(145deg,#fff,#f3edff)!important;box-shadow:0 8px 18px rgba(92,77,143,.13),inset 0 1px 0 #fff!important;display:grid;place-items:center}.vw2-top-actions>button:nth-child(1){background:linear-gradient(145deg,#fff1f7,#ffdcec)!important}.vw2-top-actions>button:nth-child(2){background:linear-gradient(145deg,#f3eeff,#dfd2ff)!important}.vw2-top-actions>button:nth-child(3){background:linear-gradient(145deg,#ecf8ff,#cfedff)!important}.vw2-top-actions>button:nth-child(4){background:linear-gradient(145deg,#edfff8,#cff4e8)!important}.vw2-top-actions .vw2-icon{width:28px;height:28px}.vw2-classic{border:2px solid rgba(255,255,255,.9)!important;border-radius:17px!important;background:rgba(255,255,255,.62)!important;box-shadow:0 8px 18px rgba(92,77,143,.1)!important;color:#756d96!important;font-weight:900!important}.vw2-classic .vw2-icon{width:18px;height:18px;display:inline-block;vertical-align:middle;margin-right:5px}
#vw-home-v2-root .vw2-main-grid{position:relative;z-index:2;gap:14px}
#vw-home-v2-root .vw2-left{border-radius:28px;padding:10px;gap:9px}.vw2-left button{display:flex!important;align-items:center!important;gap:9px!important}.vw2-left button{border:2px solid #fff!important;border-radius:21px!important;background:linear-gradient(145deg,#fff,#f8f4ff)!important;box-shadow:0 8px 16px rgba(100,83,151,.1),inset 0 1px 0 #fff!important;min-height:66px!important}.vw2-left button:nth-child(1){background:linear-gradient(145deg,#f5efff,#e5d8ff)!important}.vw2-left button:nth-child(2){background:linear-gradient(145deg,#fff0f7,#ffdce9)!important}.vw2-left button:nth-child(3){background:linear-gradient(145deg,#fff5ed,#ffe0c7)!important}.vw2-left button:nth-child(4){background:linear-gradient(145deg,#ecfff9,#cff3e5)!important}.vw2-left button:nth-child(5){background:linear-gradient(145deg,#f1f9ff,#d9efff)!important}.vw2-left button span{width:45px;height:45px;border-radius:16px;background:rgba(255,255,255,.72);display:grid;place-items:center;box-shadow:inset 0 1px 0 #fff,0 4px 10px rgba(93,76,145,.08)}.vw2-left button .vw2-icon{width:34px;height:34px}.vw2-left button b{font-weight:900;color:#5f587f}
#vw-home-v2-root .vw2-feed,#vw-home-v2-root .vw2-feature,#vw-home-v2-root .vw2-mission,#vw-home-v2-root .vw2-online{border-radius:28px}
#vw-home-v2-root .vw2-section-head{gap:8px;display:flex;align-items:center}.vw2-section-head>.vw2-head-icon{display:grid;place-items:center;width:34px;height:34px;border-radius:13px;background:rgba(255,255,255,.78);box-shadow:0 5px 11px rgba(92,76,142,.08)}.vw2-section-head>.vw2-head-icon .vw2-icon{width:25px;height:25px}.vw2-section-head strong{font-weight:950;letter-spacing:.01em}.vw2-section-head>button{border:0;background:#f1edff;color:#7565b7;border-radius:999px;padding:6px 10px;font-weight:900}
#vw-home-v2-root .vw2-feed{background:linear-gradient(155deg,rgba(255,255,255,.9),rgba(255,242,249,.8))}.vw2-feed-card{border:2px solid #fff!important;border-radius:22px!important;background:linear-gradient(145deg,#fff,#fff6fa)!important;box-shadow:0 8px 18px rgba(120,89,142,.09)!important}.vw2-feed-avatar{width:46px!important;height:46px!important;border-radius:17px!important;background:linear-gradient(145deg,#fff4bc,#ffe69a)!important;border:2px solid #fff;display:grid!important;place-items:center!important}.vw2-feed-avatar .vw2-icon{width:30px;height:30px}.vw2-feed-stats span{background:rgba(255,255,255,.7);border-radius:999px;padding:5px 9px;font-weight:800;color:#7d7698}.vw2-feed-coin{border-radius:18px!important;background:linear-gradient(90deg,#fff8ce,#fff0b3)!important;border:2px solid #fff!important;box-shadow:0 7px 15px rgba(142,110,57,.09)!important}.vw2-feed-coin .vw2-icon{width:27px;height:27px}
#vw-home-v2-root .vw2-feature{position:relative;background:linear-gradient(160deg,rgba(255,255,255,.92),rgba(240,247,255,.82))}.vw2-feature:after{content:"";position:absolute;inset:10px;border-radius:22px;border:1px dashed rgba(157,139,210,.18);pointer-events:none}.vw2-word-ribbon{border:2px solid #fff!important;background:linear-gradient(90deg,#fff1ba,#ffd8ef,#ddd2ff)!important;border-radius:999px!important;box-shadow:0 7px 14px rgba(110,84,149,.11)!important;color:#685b93!important;font-weight:950!important}.vw2-feature-title{font-weight:950;color:#695b9f;text-shadow:0 2px 0 #fff}.vw2-feature-title .vw2-icon{width:23px;height:23px;display:inline-block;vertical-align:middle}
#vw-home-v2-root .vw2-feature-stage{position:relative;border-radius:28px!important;background:linear-gradient(180deg,#dff5ff 0%,#edf8ff 45%,#e9f8ee 46%,#c9f0d8 100%)!important;border:3px solid #fff!important;box-shadow:inset 0 3px 0 rgba(255,255,255,.85),0 12px 24px rgba(97,118,164,.13)!important;overflow:hidden}.vw2-feature-stage:before{content:"";position:absolute;left:-7%;right:-7%;bottom:-18%;height:48%;border-radius:50% 50% 0 0;background:linear-gradient(#d8f4ce,#b9e7c4);box-shadow:inset 0 10px 18px rgba(255,255,255,.35)}.vw2-feature-stage:after{content:"";position:absolute;left:12%;right:12%;bottom:7%;height:15%;border-radius:50%;background:rgba(92,135,108,.12);filter:blur(5px)}.vw2-stage-cloud{background:rgba(255,255,255,.9)!important;filter:drop-shadow(0 4px 4px rgba(106,129,171,.08))}.vw2-castle{z-index:1!important;filter:drop-shadow(0 8px 7px rgba(88,67,128,.18))}.vw2-castle .vw2-castle-art{width:94px;height:94px}.vw2-pet-halo{background:radial-gradient(circle,rgba(255,240,169,.75),rgba(255,218,237,.23) 50%,transparent 70%)!important}.vw2-pet,.vw2-player-mini{z-index:3!important}.vw2-stage-copy{z-index:4!important;background:rgba(255,255,255,.78)!important;border:2px solid #fff!important;border-radius:18px!important;padding:7px 12px!important;box-shadow:0 7px 14px rgba(74,72,119,.1)!important}.vw2-stage-copy b{font-weight:950;color:#5d518d}.vw2-stage-copy span{color:#787293;font-weight:700}
#vw-home-v2-root .vw2-feature-actions{gap:10px}.vw2-feature-actions button{display:flex!important;align-items:center!important;justify-content:center!important;gap:5px!important}.vw2-feature-actions button{border:3px solid #fff!important;border-radius:23px!important;font-weight:950!important;box-shadow:0 10px 0 rgba(99,78,145,.10),0 14px 24px rgba(80,65,125,.12),inset 0 2px 0 rgba(255,255,255,.65)!important;text-shadow:0 1px 0 rgba(255,255,255,.35)}.vw2-enter{background:linear-gradient(145deg,#b9a6ff,#8f7ce4)!important;color:#fff!important}.vw2-play{background:linear-gradient(145deg,#ffb4d2,#ff91bc)!important;color:#fff!important}.vw2-feature-actions .vw2-icon{display:inline-block;width:28px;height:28px;vertical-align:middle;margin-right:6px;filter:drop-shadow(0 2px 2px rgba(74,52,121,.16))}
#vw-home-v2-root .vw2-mission{background:linear-gradient(155deg,rgba(255,255,255,.92),rgba(255,248,225,.85))}.vw2-progress{height:12px!important;border:2px solid #fff!important;background:#eee9ff!important;border-radius:999px!important;box-shadow:inset 0 2px 4px rgba(94,78,145,.09)!important}.vw2-progress i{background:linear-gradient(90deg,#9ce2ca,#ffe07b,#ffaad0)!important;border-radius:999px!important;box-shadow:0 0 12px rgba(255,186,210,.35)!important}.vw2-quest-row{border:2px solid #fff!important;border-radius:19px!important;background:linear-gradient(145deg,#fff,#fff9ea)!important;box-shadow:0 6px 13px rgba(112,91,139,.08)!important}.vw2-quest-row.done{background:linear-gradient(145deg,#effff8,#d9f5e8)!important}.vw2-qemoji{display:grid!important;place-items:center!important;width:38px!important;height:38px!important;border-radius:14px!important;background:linear-gradient(145deg,#fff5bc,#ffe39c)!important}.vw2-qemoji .vw2-icon{width:27px;height:27px}.vw2-qbody b{font-weight:900!important}.vw2-qbody i{height:8px!important;background:#eee9f7!important}.vw2-qbody u{background:linear-gradient(90deg,#a491ef,#ff9fc7)!important}.vw2-qscore{background:#fff;border-radius:999px;padding:3px 7px;font-weight:900;color:#7d6bae;display:grid;place-items:center;min-width:34px}.vw2-qscore .vw2-icon{width:22px;height:22px}
#vw-home-v2-root .vw2-online{background:linear-gradient(155deg,rgba(255,255,255,.92),rgba(236,255,248,.84))}.vw2-friends-btn{display:flex!important;align-items:center!important;justify-content:center!important}.vw2-online-card{border:2px solid #fff!important;border-radius:20px!important;background:linear-gradient(145deg,#fff,#f0fff9)!important;box-shadow:0 7px 15px rgba(74,130,111,.08)!important}.vw2-online-dot{box-shadow:0 0 0 5px rgba(117,221,177,.17),0 0 12px rgba(82,200,151,.55)!important}.vw2-friends-btn{border:3px solid #fff!important;border-radius:19px!important;background:linear-gradient(145deg,#a9e9d3,#86d8bb)!important;color:#345f57!important;font-weight:950!important;box-shadow:0 8px 16px rgba(68,137,113,.14)!important}.vw2-friends-btn .vw2-icon{display:inline-block;width:24px;height:24px;vertical-align:middle;margin-right:5px}
#vw-home-v2-root .vw2-bottom{position:relative;z-index:2;gap:9px}.vw2-bottom button{display:flex!important;align-items:center!important;justify-content:center!important;gap:4px!important}.vw2-bottom button{border:3px solid #fff!important;border-radius:20px!important;background:linear-gradient(145deg,#fff,#f7f3ff)!important;box-shadow:0 8px 17px rgba(91,74,143,.11),inset 0 1px 0 #fff!important;font-weight:950!important;min-height:58px!important}.vw2-bottom button:nth-child(1){background:linear-gradient(145deg,#eaf5ff,#d4eaff)!important}.vw2-bottom button:nth-child(2){background:linear-gradient(145deg,#ecfff6,#cff1df)!important}.vw2-bottom button:nth-child(3){background:linear-gradient(145deg,#fff2e7,#ffdcbf)!important}.vw2-bottom button:nth-child(4){background:linear-gradient(145deg,#fff8cf,#ffe895)!important}.vw2-bottom button:nth-child(5){background:linear-gradient(145deg,#f0fff0,#d5f0d0)!important}.vw2-bottom button:nth-child(6){background:linear-gradient(145deg,#f5eeff,#dfd1ff)!important}.vw2-bottom button:nth-child(7){background:linear-gradient(145deg,#fff0fa,#ffd8ee)!important}.vw2-bottom button:nth-child(8){background:linear-gradient(145deg,#eee9ff,#d8ceff)!important}.vw2-bottom button .vw2-icon{width:31px;height:31px;display:inline-block;vertical-align:middle;margin-right:5px}.vw2-bottom button b{color:#5f587f}
#vw-home-v2-root .vw2-feed-coin{display:flex!important;align-items:center!important;gap:7px!important}#vw-home-v2-root .vw2-preview-mark{background:rgba(255,255,255,.52)!important;border:1px solid rgba(255,255,255,.8)!important;color:#8c82a8!important;border-radius:999px!important;padding:5px 11px!important;letter-spacing:.08em!important}
#vw2-preview-switch{border:2px solid #fff!important;background:linear-gradient(145deg,#f8edff,#ded0ff)!important;color:#65568f!important;box-shadow:0 9px 20px rgba(77,64,123,.18)!important;border-radius:999px!important;font-weight:950!important}
@media (max-width:1100px){#vw-home-v2-root .vw2-left button{min-height:58px!important}#vw-home-v2-root .vw2-top-actions>button:not(.vw2-classic){width:43px;height:43px}.vw2-bottom button{min-height:52px!important}}
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
    const b = document.getElementById('tab-addpet');
    if(b){ b.click(); return; }
    if(typeof renderPetShop === 'function' && typeof showScreen === 'function'){
      renderPetShop(); showScreen('screen-select');
    }
  }

  function action(name){
    switch(name){
      case 'classic': setPreviewWanted(false); break;
      case 'v2': setPreviewWanted(true); break;
      case 'city': clickExisting('#btn-rail-city'); break;
      case 'shop': openPetShop(); break;
      case 'home': openPanelViaExisting('panel-home'); break;
      case 'invest': openPanelViaExisting('panel-farm'); break;
      case 'factory': openPanelViaExisting('panel-factory'); break;
      case 'market': openPanelViaExisting('panel-market'); break;
      case 'friends': openPanelViaExisting('panel-friends'); break;
      case 'gifts': openPanelViaExisting('panel-gifts'); break;
      case 'rank': clickExisting('#btn-rail-rank', {classicFirst:true}); break;
      case 'chat': clickExisting('#btn-chat'); break;
      case 'music': clickExisting('#btn-music'); break;
      case 'night': clickExisting('#btn-night'); break;
      case 'settings': clickExisting('#btn-settings'); break;
      case 'logout': clickExisting('#btn-logout'); break;
      case 'wordsearch': clickExisting('#btn-rail-wordsearch'); break;
      case 'typing': clickExisting('#btn-rail-typing'); break;
      case 'bubble': clickExisting('#btn-rail-bubble'); break;
      case 'shoot': clickExisting('#btn-rail-shootword'); break;
      case 'cannon': clickExisting('#btn-rail-lettercannon'); break;
      case 'play': clickExisting('#btn-play'); break;
      case 'cats': clickExisting('#btn-cats'); break;
      case 'picmatch': clickExisting('#btn-picmatch'); break;
      case 'picdict': clickExisting('#btn-picdict'); break;
      case 'picquiz': clickExisting('#btn-picquiz'); break;
      case 'vocabbook': clickExisting('#btn-vocab-book'); break;
      case 'bandexam': clickExisting('#btn-band-exam'); break;
      case 'ielts': clickExisting('.lobby-bottom [data-xstd="ielts"]'); break;
      case 'toeic': clickExisting('.lobby-bottom [data-xstd="toeic"]'); break;
      case 'toefl': clickExisting('.lobby-bottom [data-xstd="toefl"]'); break;
      case 'onetp6': clickExisting('.lobby-bottom [data-xstd="onetp6"]'); break;
      case 'onetm3': clickExisting('.lobby-bottom [data-xstd="onetm3"]'); break;
      case 'onetm6': clickExisting('.lobby-bottom [data-xstd="onetm6"]'); break;
    }
  }

  function build(){
    const dash = dashboard();
    if(!dash || document.getElementById(ROOT_ID)) return;
    ensureVisualStyles();
    root = document.createElement('div');
    root.id = ROOT_ID;
    root.setAttribute('aria-label','Vocab World Home V2 Admin Preview');
    root.innerHTML = `
      <div class="vw2-sky" aria-hidden="true"><i></i><i></i><i></i><i></i></div>
      <div class="vw2-shell">
        <header class="vw2-top">
          <section class="vw2-profile vw2-glass">
            <div class="vw2-avatar" id="vw2-avatar">${icon('sparkle')}</div>
            <div class="vw2-profile-main">
              <div class="vw2-name-row"><strong id="vw2-name">ผู้เล่น</strong><span class="vw2-pencil">${icon('edit')}</span></div>
              <div class="vw2-id" id="vw2-id">ID —</div>
              <div class="vw2-minirow"><span id="vw2-clock">—</span></div>
              <div class="vw2-rank" id="vw2-rank">กำลังโหลดแรงค์…</div>
            </div>
          </section>

          <section class="vw2-wallet">
            <button class="vw2-wallet-pill coin" data-vw2-action="rank">${icon('coin')}<b id="vw2-coins">0</b><em>+</em></button>
            <div class="vw2-wallet-pill today"><small>วันนี้</small><b>+<span id="vw2-today">0</span></b></div>
            <div class="vw2-wallet-pill worth"><small>มูลค่ารวม</small><b id="vw2-worth">0</b></div>
          </section>

          <section class="vw2-top-actions">
            <button data-vw2-action="chat" title="ข้อความ">${icon('chat')}</button>
            <button data-vw2-action="music" title="เพลง">${icon('music')}</button>
            <button data-vw2-action="night" title="โหมดกลางคืน">${icon('moon')}</button>
            <button data-vw2-action="settings" title="ตั้งค่า">${icon('settings')}</button>
            <button data-vw2-action="classic" class="vw2-classic" title="กลับหน้าล็อบบี้เดิมชั่วคราว">${icon('back')} Classic</button>
          </section>
        </header>

        <div class="vw2-main-grid">
          <nav class="vw2-left vw2-glass" aria-label="เมนูหลัก">
            <button data-vw2-action="city"><span>${icon('city')}</span><b>เมือง 3D</b></button>
            <button data-vw2-action="shop"><span>${icon('potion')}</span><b>ร้านค้า</b></button>
            <button data-vw2-action="home"><span>${icon('home')}</span><b>บ้าน</b></button>
            <button data-vw2-action="invest"><span>${icon('invest')}</span><b>ลงทุน</b></button>
            <button data-vw2-action="gifts"><span>${icon('gift')}</span><b>ของขวัญ</b></button>
          </nav>

          <section class="vw2-feed vw2-glass">
            <div class="vw2-section-head"><span class="vw2-head-icon">${icon('globe')}</span><strong>Global Feed</strong><button data-vw2-action="classic" title="เปิดฟีดเดิม">ดูทั้งหมด</button></div>
            <div class="vw2-feed-card">
              <div class="vw2-feed-avatar">${icon('sparkle')}</div>
              <div><b>กิจกรรมล่าสุด</b><p id="vw2-feed-text">กำลังโหลดกิจกรรมของเพื่อน…</p></div>
            </div>
            <div class="vw2-feed-stats"><span>♡ <b id="vw2-feed-likes">—</b></span><span>ชวนเพื่อนมาเรียนด้วยกัน</span></div>
            <div class="vw2-feed-coin">${icon('coin')}<span>เรียน เล่น และเติบโตไปพร้อมกัน</span></div>
          </section>

          <main class="vw2-feature vw2-glass">
            <div class="vw2-word-ribbon" id="vw2-newword">คำศัพท์ใหม่รอหนูอยู่</div>
            <div class="vw2-feature-title"><span>${icon('sparkle')}</span><strong>Vocab World</strong><span>${icon('sparkle')}</span></div>
            <div class="vw2-feature-stage">
              <div class="vw2-stage-cloud c1"></div><div class="vw2-stage-cloud c2"></div>
              <div class="vw2-castle" aria-hidden="true">
                <svg class="vw2-castle-art" viewBox="0 0 100 100" focusable="false" aria-hidden="true">
                  <path d="M12 84V39h17V24h14v15h15V17h15v22h16v45z" fill="#b7a1ff"/>
                  <path d="M8 42l13-13 14 13 15-18 15 18 13-15 14 15" fill="none" stroke="#806ec7" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M42 84V62h16v22M20 53h9M70 53h9" fill="none" stroke="#5f5689" stroke-width="5" stroke-linecap="round"/>
                  <path d="M49 24l7-15 7 15" fill="#ffd976" stroke="#806ec7" stroke-width="3" stroke-linejoin="round"/>
                  <circle cx="50" cy="51" r="5" fill="#fff" opacity=".85"/>
                </svg>
              </div>
              <div class="vw2-pet-halo"></div>
              <div class="vw2-pet" id="vw2-pet">${icon('sparkle')}</div>
              <div class="vw2-player-mini" id="vw2-player-mini">${icon('star')}</div>
              <div class="vw2-stage-copy"><b id="vw2-pet-name">ออกผจญภัยกับน้อง</b><span>ฝึกคำศัพท์ · สะสมเหรียญ · พบเพื่อน</span></div>
            </div>
            <div class="vw2-feature-actions">
              <button class="vw2-enter" data-vw2-action="city">${icon('city')} เข้าโลก 3D</button>
              <button class="vw2-play" data-vw2-action="play">${icon('controller')} เกมจับคู่คำศัพท์</button>
            </div>
          </main>

          <aside class="vw2-right">
            <section class="vw2-mission vw2-glass">
              <div class="vw2-section-head"><span class="vw2-head-icon">${icon('quest')}</span><strong>ภารกิจวันนี้</strong><b id="vw2-quest-count">0/0</b></div>
              <div class="vw2-progress"><i id="vw2-quest-bar"></i></div>
              <div id="vw2-quests" class="vw2-quests"><div class="vw2-empty">กำลังโหลดภารกิจ…</div></div>
            </section>
            <section class="vw2-online vw2-glass">
              <div class="vw2-section-head"><span class="vw2-head-icon">${icon('friends')}</span><strong>เพื่อนออนไลน์</strong><b id="vw2-online-count">—</b></div>
              <div class="vw2-online-card"><span class="vw2-online-dot"></span><div><b id="vw2-online-name">กำลังเชื่อมต่อ…</b><small id="vw2-online-text">เล่นและเรียนไปพร้อมกัน</small></div></div>
              <button class="vw2-friends-btn" data-vw2-action="friends">${icon('friends')} ดูเพื่อนทั้งหมด</button>
            </section>
          </aside>
        </div>

        <footer class="vw2-bottom" aria-label="ทางลัดการเรียนและเกม">
          <button class="ielts" data-vw2-action="ielts">${icon('book')} <b>IELTS</b></button>
          <button class="toeic" data-vw2-action="toeic">${icon('book')} <b>TOEIC</b></button>
          <button class="toefl" data-vw2-action="toefl">${icon('book')} <b>TOEFL</b></button>
          <button class="onet" data-vw2-action="onetp6">${icon('star')} <b>O-NET ป.6</b></button>
          <button class="onet" data-vw2-action="onetm3">${icon('leaf')} <b>O-NET ม.3</b></button>
          <button class="onet" data-vw2-action="onetm6">${icon('crown')} <b>O-NET ม.6</b></button>
          <button class="vocab" data-vw2-action="cats">${icon('sparkle')} <b>หมวดคำศัพท์ &amp; แบบทดสอบ</b></button>
          <button class="games" data-vw2-action="picmatch">${icon('controller')} <b>เล่นเกมจับคู่คำ</b></button>
        </footer>
        <div class="vw2-preview-mark">ADMIN PREVIEW · HOME V2 VISUAL POLISH</div>
      </div>`;
    dash.appendChild(root);

    root.addEventListener('click', e=>{
      const b = e.target.closest('[data-vw2-action]');
      if(!b) return;
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

  function copyImage(srcSel, targetId, fallbackEmoji){
    const src = document.querySelector(srcSel);
    const box = document.getElementById(targetId);
    if(!box) return;
    const url = src && src.getAttribute('src');
    if(url){
      if(box.dataset.src === url) return;
      box.dataset.src = url;
      box.innerHTML = `<img src="${htmlEscape(url)}" alt="">`;
    }else if(!box.dataset.src){ box.innerHTML = fallbackEmoji; }
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
    setText('vw2-clock', textOf('#clock-chip','วันนี้'));
    setText('vw2-rank', textOf('#rank-tab','แรงค์กำลังอัปเดต'));
    setText('vw2-newword', textOf('#newword-banner','คำศัพท์ใหม่รอหนูอยู่').replace(/^[✨⭐🌟💫\s]+/,'') || 'คำศัพท์ใหม่รอหนูอยู่');

    copyImage('#pass-photo img','vw2-avatar',icon('sparkle'));
    copyImage('#pass-photo img','vw2-player-mini',icon('star'));
    copyImage('#pet-card .hero-scene .pet-img','vw2-pet',icon('sparkle'));

    try{
      if(typeof activePet === 'function'){
        const p=activePet();
        setText('vw2-pet-name', p && p.name ? p.name : 'ออกผจญภัยกับน้อง');
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
    setTimeout(tick, 250);
  }

  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, {once:true});
  else init();
})();
