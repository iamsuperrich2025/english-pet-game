(function () {
  'use strict';

  var meta = document.querySelector('meta[name="vw-build-version"]');
  var CURRENT_BUILD = meta ? meta.content : '__VW_BUILD_VERSION__';
  var VERSION_URL = '/version.json';
  var RELOAD_KEY = 'vw-update-reloaded';
  var checkTimer = null;
  var applying = false;

  function validBuild(value) {
    return /^\d{4}-\d{2}-\d{2}\.\d+$/.test(String(value || ''));
  }

  function buildLabel() {
    return validBuild(CURRENT_BUILD) ? CURRENT_BUILD : 'development';
  }

  function addBuildLabel() {
    var splash = document.getElementById('splash') || document.getElementById('app-splash');
    if (!splash || splash.querySelector('[data-vw-build]')) return;
    var label = document.createElement('small');
    label.setAttribute('data-vw-build', '');
    label.textContent = 'Game Build ' + buildLabel();
    label.style.cssText = 'position:relative;color:#7797ba;font:500 10px/1.2 system-ui,sans-serif;letter-spacing:.04em';
    splash.appendChild(label);
  }

  function injectStyles() {
    if (document.getElementById('vw-update-style')) return;
    var style = document.createElement('style');
    style.id = 'vw-update-style';
    style.textContent = ''
      + '#vw-update{position:fixed;inset:0;z-index:1000000;display:flex;align-items:center;justify-content:center;'
      + 'padding:16px;background:rgba(6,18,38,.94);color:#eef6ff;font-family:system-ui,"Segoe UI",sans-serif}'
      + '#vw-update[hidden]{display:none}#vw-update .vu-card{width:min(430px,92vw);text-align:center;padding:22px;'
      + 'border:1px solid rgba(126,190,255,.38);border-radius:22px;background:#102b50;box-shadow:0 18px 60px rgba(0,0,0,.45)}'
      + '#vw-update h2{margin:0 0 8px;color:#ffe39a;font-size:22px}#vw-update p{margin:6px 0 14px;color:#bdd2e9;line-height:1.5}'
      + '#vw-update .vu-bar{height:7px;overflow:hidden;border-radius:99px;background:#173d6d}#vw-update .vu-bar i{display:block;'
      + 'width:40%;height:100%;border-radius:inherit;background:#e8b64c;animation:vu-load 1.1s ease-in-out infinite}'
      + '#vw-update button{border:0;border-radius:999px;padding:10px 18px;background:#e8b64c;color:#10213b;font-weight:800;cursor:pointer}'
      + '#vw-update-offer{position:fixed;left:50%;bottom:calc(12px + env(safe-area-inset-bottom));z-index:99999;transform:translateX(-50%);'
      + 'display:flex;align-items:center;gap:9px;max-width:94vw;padding:8px 10px 8px 15px;border:1px solid #e8b64c;border-radius:999px;'
      + 'background:#123a6b;color:#fff;box-shadow:0 8px 24px rgba(0,0,0,.4);font:700 13px/1.2 system-ui,sans-serif;white-space:nowrap}'
      + '#vw-update-offer button{border:0;border-radius:999px;padding:7px 12px;background:#e8b64c;color:#10213b;font-weight:800;cursor:pointer}'
      + '@keyframes vu-load{from{margin-left:-40%}to{margin-left:100%}}';
    document.head.appendChild(style);
  }

  function updateScreen(title, message, retry) {
    injectStyles();
    var panel = document.getElementById('vw-update');
    if (!panel) {
      panel = document.createElement('section');
      panel.id = 'vw-update';
      panel.setAttribute('role', 'status');
      panel.setAttribute('aria-live', 'polite');
      document.body.appendChild(panel);
    }
    panel.hidden = false;
    panel.innerHTML = '<div class="vu-card"><h2></h2><p></p><div class="vu-bar"><i></i></div></div>';
    panel.querySelector('h2').textContent = title;
    panel.querySelector('p').textContent = message;
    if (retry) {
      panel.querySelector('.vu-bar').outerHTML = '<button type="button">ลองอีกครั้ง</button>';
      panel.querySelector('button').onclick = function () { location.reload(); };
    }
    return panel;
  }

  function hideUpdateScreen() {
    var panel = document.getElementById('vw-update');
    if (panel) panel.hidden = true;
  }

  function remoteVersion() {
    return fetch(VERSION_URL + '?t=' + Date.now(), { cache: 'no-store', credentials: 'same-origin' })
      .then(function (response) {
        if (!response.ok) throw new Error('version HTTP ' + response.status);
        return response.json();
      })
      .then(function (data) {
        var version = data && (data.version || data.v);
        return validBuild(version) ? String(version) : null;
      });
  }

  function waitForController(remoteBuild) {
    return new Promise(function (resolve, reject) {
      var done = false;
      var timer = setTimeout(function () {
        if (!done) { done = true; reject(new Error('service worker update timeout')); }
      }, 25000);
      navigator.serviceWorker.addEventListener('controllerchange', function () {
        if (done) return;
        done = true;
        clearTimeout(timer);
        try { sessionStorage.setItem(RELOAD_KEY, remoteBuild); } catch (error) {}
        resolve();
      }, { once: true });
    });
  }

  function applyUpdate(registration, remoteBuild) {
    if (applying) return;
    applying = true;
    updateScreen('กำลังอัปเดต Vocab World', 'กำลังเตรียมเกมรุ่น ' + remoteBuild + ' โดยจะเก็บข้อมูลผู้เล่นไว้ทั้งหมด');
    var controlled = !!navigator.serviceWorker.controller;
    var changed = controlled ? waitForController(remoteBuild) : Promise.resolve();
    registration.update()
      .then(function () { return changed; })
      .then(function () {
        if (controlled) location.reload();
        else hideUpdateScreen();
      })
      .catch(function () {
        applying = false;
        updateScreen('อัปเดตยังไม่สำเร็จ', 'เกมรุ่นเดิมยังใช้งานได้ ข้อมูลผู้เล่นไม่ได้รับผลกระทบ กรุณาตรวจเครือข่ายแล้วลองใหม่', true);
      });
  }

  function offerUpdate(registration, remoteBuild) {
    if (document.getElementById('vw-update-offer')) return;
    injectStyles();
    var offer = document.createElement('div');
    offer.id = 'vw-update-offer';
    offer.innerHTML = '<span>✨ มีเกมรุ่นใหม่</span><button type="button">อัปเดตเมื่อพร้อม</button>';
    offer.querySelector('button').onclick = function () {
      offer.remove();
      applyUpdate(registration, remoteBuild);
    };
    document.body.appendChild(offer);
  }

  function check(registration) {
    if (document.hidden || applying) return;
    remoteVersion().then(function (remoteBuild) {
      if (!remoteBuild || remoteBuild === CURRENT_BUILD) return;
      var reloaded = null;
      try { reloaded = sessionStorage.getItem(RELOAD_KEY); } catch (error) {}
      if (reloaded === remoteBuild) return;
      offerUpdate(registration, remoteBuild);
    }).catch(function () {
      // Offline is not an update failure. The active/cached game continues unchanged.
    });
  }

  function start() {
    addBuildLabel();
    if (!('serviceWorker' in navigator) || !location.protocol.startsWith('http')) return;
    navigator.serviceWorker.register('/sw.js', { scope: '/', updateViaCache: 'none' })
      .then(function (registration) {
        check(registration);
        checkTimer = setInterval(function () { check(registration); }, 15 * 1000);
        window.addEventListener('online', function () { check(registration); });
        document.addEventListener('visibilitychange', function () {
          if (!document.hidden) check(registration);
        });
      })
      .catch(function () {
        // The web game remains usable online even if service-worker registration is unavailable.
      });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once: true });
  else start();
  window.addEventListener('pagehide', function () { if (checkTimer) clearInterval(checkTimer); }, { once: true });
}());
