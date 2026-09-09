/* Multi-touch controls, latched drive, live speed selection, and selection-safe buttons. */
(function () {
  'use strict';
  const F = window.Frontline;
  F.bindInput = function (root) {
    const value = { auto: 0, turn: 0, fire: false, bomb: false, speedLevel: 1 };
    const held = new Map(), keys = new Set(), taps = new Set(), cleanups = [];
    const attack = action => action === 'fire' || action === 'bomb' || action === 'drop';
    const speed = root.querySelector('#fl-speed'), speedName = root.querySelector('#fl-speed-name');
    function on(target, name, fn, opts) {
      target.addEventListener(name, fn, opts); cleanups.push(() => target.removeEventListener(name, fn, opts));
    }
    function refresh() {
      const actions = [...held.values(), ...keys];
      value.turn = Number(actions.includes('right')) - Number(actions.includes('left'));
      value.fire = actions.includes('fire');
      value.bomb = actions.includes('bomb');
      root.querySelectorAll('[data-auto]').forEach(b =>
        b.setAttribute('aria-pressed', String(value.auto === Number(b.dataset.auto))));
      if (speedName) speedName.textContent = F.C.speedNames[value.speedLevel];
      if (speed) { speed.value=String(value.speedLevel);speed.style?.setProperty('--fill',value.speedLevel*50+'%'); }
    }
    function reset() {
      held.clear(); keys.clear(); taps.clear(); value.auto = 0; value.turn = 0; value.fire = false; value.bomb = false; refresh();
    }
    root.querySelectorAll('[data-auto]').forEach(b => {
      on(b, 'click', e => {
        e.preventDefault();
        value.auto = value.auto === Number(b.dataset.auto) ? 0 : Number(b.dataset.auto);
        refresh();
      });
    });
    root.querySelectorAll('[data-hold]').forEach(b => {
      on(b, 'pointerdown', e => {
        e.preventDefault();
        if (b.disabled) return;
        if (attack(b.dataset.hold)) taps.add(b.dataset.hold);
        try { b.setPointerCapture(e.pointerId); } catch (_) { /* Preserve taps even if capture fails. */ }
        held.set(e.pointerId, b.dataset.hold); refresh();
      });
      for (const event of ['pointerup', 'pointercancel', 'lostpointercapture']) {
        on(b, event, e => { held.delete(e.pointerId); refresh(); });
      }
    });
    if (speed) on(speed, 'input', () => {
      value.speedLevel = Math.max(0, Math.min(2, Number(speed.value) || 0)); refresh();
    });
    const map = { ArrowLeft: 'left', KeyA: 'left', ArrowRight: 'right', KeyD: 'right', Space: 'fire', KeyB: 'bomb', KeyQ: 'drop' };
    on(window, 'keydown', e => {
      if (/INPUT|TEXTAREA/.test(e.target.tagName)) return;
      if (map[e.code]) { e.preventDefault(); keys.add(map[e.code]); if (!e.repeat && attack(map[e.code])) taps.add(map[e.code]); }
      if (!e.repeat && (e.code === 'KeyW' || e.code === 'KeyS')) {
        const dir = e.code === 'KeyW' ? 1 : -1;
        value.auto = value.auto === dir ? 0 : dir;
      }
      refresh();
    });
    on(window, 'keyup', e => { if (map[e.code]) keys.delete(map[e.code]); refresh(); });
    on(root, 'selectstart', e => e.preventDefault());
    on(root, 'click', e => {
      const button=e.target.closest('[data-hold]'),action=button?.dataset.hold;
      if (e.detail === 0 && !button?.disabled && attack(action)) taps.add(action);
    });
    on(window, 'pointerup', e => { held.delete(e.pointerId); refresh(); });
    on(window, 'pointercancel', e => { held.delete(e.pointerId); refresh(); });
    on(root, 'contextmenu', e => { if (e.target.closest('button')) e.preventDefault(); });
    on(root, 'dragstart', e => e.preventDefault());
    on(window, 'blur', reset);
    on(document, 'visibilitychange', () => { if (document.hidden) reset(); });
    on(window, 'orientationchange', () => {
      if (matchMedia('(orientation: portrait)').matches) reset();
    });
    refresh();
    return { value, reset, take(action) {
      const requested=taps.has(action)||!!value[action]; taps.delete(action); return requested;
    }, dispose() { reset(); cleanups.forEach(fn => fn()); } };
  };
})();
