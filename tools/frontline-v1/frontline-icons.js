/* Tiny local vector illustrations for the toy HUD. No icon fonts or image requests. */
(function(){
  'use strict';
  const F=window.Frontline,NS='http://www.w3.org/2000/svg',cache=new Map();
  const art={
    steer:'<path d="M13 4c2-3 4-3 6 0l12 21c1 3-1 5-4 5H5c-3 0-5-2-4-5Z" fill="#0778b7" stroke="#075585" stroke-width="1.5" stroke-linejoin="round"/><path d="M14 4c1-2 3-2 4 0l10 19c1 2 0 3-2 3H6c-2 0-3-1-2-3Z" fill="#19b6ef"/><path d="m6 22 9-16c1-1 2-1 3 0" fill="none" stroke="#9ae5ff" stroke-width="2.4" stroke-linecap="round"/><path d="m16 8 11 17H7Z" fill="#1b9edd"/>',
    star:'<path fill="#ffdc51" stroke="#d6a233" stroke-width="1.5" d="m16 2 4.2 8.4 9.3 1.4-6.7 6.5 1.6 9.2-8.4-4.4-8.4 4.4 1.6-9.2-6.7-6.5 9.3-1.4Z"/><path d="m16 5 3 6-7 1" fill="none" stroke="#fff4a0" stroke-width="2" stroke-linecap="round"/>',
    heart:'<path d="M16 28C10 23 2 17 2 10 2 2 12 1 16 8 20 1 30 2 30 10c0 7-8 13-14 18Z" fill="#ff7772" stroke="#ce5058" stroke-width="1.6"/><path d="M6 11c0-4 4-6 7-3" stroke="#ffd0b3" stroke-width="3" fill="none" stroke-linecap="round"/>',
    coin:'<circle cx="16" cy="16" r="13" fill="#ffc947" stroke="#d89525" stroke-width="2"/><circle cx="16" cy="16" r="9" fill="none" stroke="#fff0a0" stroke-width="2"/><path d="M17 8v16m4-12c-8-5-12 5-5 4 7-1 5 8-5 4" stroke="#ce8e24" stroke-width="2" fill="none"/>',
    tank:'<g stroke="#285c5a" stroke-width="1.3" stroke-linejoin="round"><rect x="3" y="18" width="26" height="11" rx="5" fill="#607c82"/><path d="M7 17 10 8h14l4 15H5Z" fill="currentColor"/><rect x="11" y="7" width="12" height="10" rx="4" fill="currentColor"/><path d="m16 11-3-8h4l4 8" fill="currentColor"/><path d="M8 17h17" stroke="#def3b4"/><g fill="#eef3d7"><circle cx="8" cy="24" r="2.4"/><circle cx="16" cy="24" r="2.4"/><circle cx="24" cy="24" r="2.4"/></g></g>',
    pilot:'<circle cx="16" cy="17" r="14" fill="#dcecbc"/><path d="M5 32c0-11 22-11 22 0" fill="#5c9959"/><ellipse cx="16" cy="19" rx="10" ry="10" fill="#ffd4a2" stroke="#be8755"/><path d="M5 15C3 0 27-1 27 15Z" fill="#6dad63" stroke="#326f55" stroke-width="1.5"/><path d="M4 15h24" stroke="#366c50" stroke-width="3" stroke-linecap="round"/><path d="m16 3 1.4 3 3.3.5-2.4 2.3.6 3.2-2.9-1.5-2.9 1.5.6-3.2-2.4-2.3 3.3-.5Z" fill="#ffdc72"/><path d="M11 19v3m10-3v3M14 25q2 2 4 0" stroke="#3c4236" stroke-width="1.6" fill="none" stroke-linecap="round"/>',
    arrow:'<path d="M13 3c1.5-2 4.5-2 6 0l10 11c1 2 0 4-2 4h-6v10H11V18H5c-2 0-3-2-2-4Z" fill="currentColor" stroke="#286780" stroke-width="1.5" stroke-linejoin="round"/><path d="m8 14 8-9" fill="none" stroke="#fff9" stroke-width="2.5" stroke-linecap="round"/>',
    drop:'<g stroke="#286780" stroke-width="1.5" stroke-linejoin="round"><rect x="5" y="2" width="14" height="16" rx="3" fill="#fff8d1" transform="rotate(-14 12 10)"/><rect x="13" y="3" width="14" height="16" rx="3" fill="#d9f6ff" transform="rotate(12 20 11)"/><path d="M13 16h7v7h5l-8.5 8L8 23h5Z" fill="#80d9ef"/></g><path d="M9 5h5m3 2h5M15 18v6h-3" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round"/>',
    bomb:'<path d="M20 10q-1-8 6-6" stroke="#ffc76a" stroke-width="3" fill="none"/><circle cx="14" cy="20" r="11" fill="#66409f" stroke="#4d2887" stroke-width="1.5"/><ellipse cx="11" cy="16" rx="4" ry="3" fill="#b397e7" transform="rotate(-35 11 16)"/><path d="m26 0 1.4 4L32 5l-3.5 2.6L29 12l-3.5-2.5L22 12l.6-4.4L19 5l4.5-1Z" fill="#ffe173"/>',
    leaf:'<path d="M14 28C-1 24-1 9 3 8c11 1 14 11 11 20" fill="#a0d875"/><path d="M16 29C9 14 17 2 23 1c10 9 3 22-7 28" fill="#c9e679"/><path d="M19 29c1-9 8-15 12-14 1 10-5 16-12 14" fill="#77be69"/>',
    turtle:'<path d="M5 23 3 29m20-6 2 6M9 23l-1 6" stroke="#4b9550" stroke-width="4" stroke-linecap="round"/><ellipse cx="14" cy="20" rx="12" ry="8" fill="#76bd61" stroke="#41814b"/><path d="m8 14 6 6 7-7m-7 7v7" stroke="#c1df85" fill="none" stroke-width="2"/><circle cx="28" cy="17" r="4" fill="#79c364"/><circle cx="29" cy="16" r=".8" fill="#264c40"/>',
    rabbit:'<path d="M21 14C8-2 21-2 24 11 22-2 34-1 27 14" fill="#bfc6b2" stroke="#7a8d82"/><ellipse cx="14" cy="22" rx="12" ry="7" fill="#9daea0"/><circle cx="25" cy="17" r="6" fill="#bfc6b2"/><circle cx="27" cy="16" r="1" fill="#30534f"/><path d="M5 27h12m5-1 5 1" stroke="#7a8d82" stroke-width="3" stroke-linecap="round"/>',
    home:'<path d="M4 15 16 4l12 11v13H4Z" fill="#ffd36a" stroke="#d28a28" stroke-width="1.6" stroke-linejoin="round"/><path d="M7 15.5 16 7l9 8.5V28H7Z" fill="#ffe9a8"/><path d="M13 28v-9h6v9" fill="#f08a6a" stroke="#c45b48" stroke-width="1.4"/><circle cx="17.4" cy="23.2" r="1.1" fill="#fff3c2"/><path d="m16 2 3 3-3 2-3-2Z" fill="#ff8d9a" stroke="#d45d72" stroke-width="1.2" stroke-linejoin="round"/>'
  };
  F.icon=function(name){
    if(!cache.has(name)){const svg=document.createElementNS(NS,'svg');svg.setAttribute('viewBox','0 0 32 32');
      svg.setAttribute('aria-hidden','true');svg.setAttribute('focusable','false');svg.classList.add('fl-icon');svg.innerHTML=art[name]||art.star;cache.set(name,svg);}
    return cache.get(name).cloneNode(true);
  };
  document.querySelectorAll('[data-icon]').forEach(el=>el.replaceWith(F.icon(el.dataset.icon)));
})();
