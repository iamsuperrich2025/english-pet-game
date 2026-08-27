const fs = require('fs');

const html = fs.readFileSync('index_classic.html', 'utf8');
const css = fs.readFileSync('css/lobby.css', 'utf8');
const util = fs.readFileSync('js/util.js', 'utf8');
const pwa = JSON.parse(fs.readFileSync('manifest.webmanifest', 'utf8'));
const twa = JSON.parse(fs.readFileSync('android-twa/twa-manifest.json', 'utf8'));

function must(condition, message) {
  if (!condition) throw new Error(message);
}

must(!html.includes('id="rotate-overlay"'), 'first entry must not render a rotate-phone overlay');
must(!css.includes('#rotate-overlay'), 'portrait CSS must not restore the removed rotate-phone overlay');
must(pwa.orientation === 'landscape', 'installed PWA must request landscape at launch');
must(twa.orientation === 'landscape', 'Android TWA must request landscape at launch');
must(util.includes("screen.orientation.lock('landscape')"), 'runtime must request the Screen Orientation API lock');
must(util.includes('root.requestFullscreen()'), 'portrait browser fallback must enter fullscreen after a gesture');
must(util.includes("window.addEventListener('pointerdown'"), 'fullscreen fallback must be armed by a user gesture');
must(util.includes("window.addEventListener('pageshow'"), 'orientation lock must be restored after app resume');

console.log('PASS landscape entry: no rotate overlay; PWA/TWA/runtime locks are present');
