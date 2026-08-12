const fs = require('fs');
const vm = require('vm');

const source = fs.readFileSync('js/app-update.js', 'utf8');

function element(tag) {
  return {
    tag,
    children: {},
    style: {},
    textContent: '',
    setAttribute() {},
    appendChild() {},
    remove() { if (this.id) this._nodes.delete(this.id); },
    set innerHTML(value) {
      this._html = value;
      if (value.includes('<span')) this.children.span = element('span');
      if (value.includes('<button')) this.children.button = element('button');
    },
    get innerHTML() { return this._html || ''; },
    querySelector(selector) { return this.children[selector] || null; },
  };
}

async function boot({ current, remote, acknowledged }) {
  const nodes = new Map();
  const store = new Map(acknowledged ? [['vw-update-acknowledged', acknowledged]] : []);
  const listeners = {};
  let reloads = 0;
  let updateCalls = 0;
  let intervalMs = 0;
  let fetchCalls = 0;
  const body = element('body');
  const head = element('head');
  body.appendChild = (child) => { child._nodes = nodes; if (child.id) nodes.set(child.id, child); };
  const document = {
    hidden: false,
    readyState: 'complete',
    body,
    head,
    querySelector(selector) {
      return selector === 'meta[name="vw-build-version"]' ? { content: current } : null;
    },
    getElementById(id) { return nodes.get(id) || null; },
    createElement: element,
    addEventListener() {},
  };
  const registration = { update() { updateCalls += 1; return Promise.resolve(); } };
  const context = {
    document,
    navigator: { serviceWorker: { controller: {}, register() { return Promise.resolve(registration); }, addEventListener() {} } },
    location: { protocol: 'https:', reload() { reloads += 1; } },
    window: { addEventListener(name, fn) { (listeners[name] ||= []).push(fn); } },
    fetch() { fetchCalls += 1; return Promise.resolve({ ok: true, json: () => Promise.resolve({ version: remote }) }); },
    localStorage: { getItem: (key) => store.get(key) || null, setItem: (key, value) => store.set(key, value) },
    sessionStorage: { getItem() { return null; }, setItem() {} },
    setTimeout,
    clearTimeout,
    setInterval(fn, ms) { intervalMs = ms; return 1; },
    clearInterval() {},
    Promise,
    Date,
  };
  vm.runInNewContext(source, context);
  await new Promise((resolve) => setTimeout(resolve, 20));
  return {
    nodes, store, registration, listeners, intervalMs,
    get fetchCalls() { return fetchCalls; },
    get reloads() { return reloads; },
    get updateCalls() { return updateCalls; },
  };
}

(async () => {
  const loaded = await boot({ current: '2026-08-12.1024', remote: '2026-08-12.1024', acknowledged: '2026-08-12.1023' });
  const loadedOffer = loaded.nodes.get('vw-update-offer');
  if (!loadedOffer || !loadedOffer.querySelector('span').textContent.endsWith('2026-08-12.1024 พร้อมแล้ว')) {
    throw new Error('A network-first loaded build must still show an acknowledgement prompt');
  }
  if (loaded.updateCalls !== 0 || loaded.intervalMs !== 15000) throw new Error('Loaded-build prompt updated early or polling changed');
  loadedOffer.querySelector('button').onclick();
  if (loaded.store.get('vw-update-acknowledged') !== '2026-08-12.1024' || loaded.reloads !== 1) {
    throw new Error('Loaded-build acknowledgement did not persist and reload');
  }

  const acknowledged = await boot({ current: '2026-08-12.1024', remote: '2026-08-12.1024', acknowledged: '2026-08-12.1024' });
  if (acknowledged.nodes.has('vw-update-offer')) throw new Error('Acknowledged build prompted again');

  const available = await boot({ current: '2026-08-12.1023', remote: '2026-08-12.1024', acknowledged: '2026-08-12.1023' });
  const availableOffer = available.nodes.get('vw-update-offer');
  if (!availableOffer || !availableOffer.querySelector('span').textContent.endsWith('2026-08-12.1024')) {
    throw new Error('Remote build prompt is missing');
  }
  if (available.updateCalls !== 0) throw new Error('Remote build updated before the user clicked');

  const beforeRestore = available.fetchCalls;
  for (const fn of available.listeners.pagehide || []) fn({ persisted: true });
  for (const fn of available.listeners.pageshow || []) fn({ persisted: true });
  await new Promise((resolve) => setTimeout(resolve, 20));
  if (available.fetchCalls <= beforeRestore || available.intervalMs !== 15000) {
    throw new Error('A restored 3D Lobby did not resume update checks');
  }

  console.log('PASS: explicit update prompts for loaded, acknowledged, remote, and restored builds');
})().catch((error) => {
  console.error(error.stack || error.message);
  process.exitCode = 1;
});
