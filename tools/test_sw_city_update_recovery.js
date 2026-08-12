const fs = require('fs');
const vm = require('vm');

const handlers = {};
const navigated = [];
let marker = null;
let markerWrites = 0;

function client(pathname) {
  return {
    url: `https://vocabworld.web.app${pathname}`,
    navigate(url) { navigated.push(new URL(url).pathname); return Promise.resolve(this); },
  };
}

const clients = [client('/'), client('/index_classic.html'), client('/adventure.html')];
const cache = {
  match() { return Promise.resolve(marker); },
  put(key, value) { marker = value; markerWrites += 1; return Promise.resolve(); },
  keys() { return Promise.resolve([]); },
};
const context = {
  __VW_PRECACHE__: [],
  self: {
    location: { origin: 'https://vocabworld.web.app' },
    addEventListener(name, fn) { handlers[name] = fn; },
    clients: {
      claim() { return Promise.resolve(); },
      matchAll() { return Promise.resolve(clients); },
    },
    skipWaiting() { return Promise.resolve(); },
  },
  caches: {
    keys() { return Promise.resolve(['vw-shell-old', 'vw-shell-__VW_BUILD_VERSION__']); },
    open() { return Promise.resolve(cache); },
    delete() { return Promise.resolve(true); },
    match() { return Promise.resolve(null); },
  },
  fetch() { return Promise.reject(new Error('not used')); },
  URL,
  Request,
  Response,
  Promise,
  console,
};

vm.runInNewContext(fs.readFileSync('sw.js', 'utf8'), context);

async function activate() {
  let promise;
  handlers.activate({ waitUntil(value) { promise = value; } });
  await promise;
}

(async () => {
  await activate();
  if (JSON.stringify(navigated) !== JSON.stringify(['/'])) {
    throw new Error(`Recovery must reload only the 3D Lobby, got ${JSON.stringify(navigated)}`);
  }
  if (markerWrites !== 1) throw new Error('Recovery marker was not written exactly once');
  await activate();
  if (navigated.length !== 1 || markerWrites !== 1) throw new Error('Recovery ran more than once');
  console.log('PASS: one-time service-worker recovery reloads only the 3D Lobby');
})().catch((error) => {
  console.error(error.stack || error.message);
  process.exitCode = 1;
});
