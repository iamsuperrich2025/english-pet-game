const fs = require('fs');
const assert = require('assert');
const read = p=>fs.readFileSync(p,'utf8');
const html = read('index_classic.html');
const js = read('js/onetpromo.js');
const css = read('css/onetpromo.css');
const util = read('js/util.js');
const auth = read('js/auth.js');

assert(html.includes('css/onetpromo.css') && html.includes('js/onetpromo.js'), 'promo assets missing from classic lobby');
assert(js.includes('onet-promo-close') && js.includes('ไว้ทีหลัง'), 'explicit close controls missing');
assert(js.includes("window.openOnetBoard()"), 'O-NET CTA is not wired');
assert(read('js/examstd.js').includes('window.openOnetBoard = openOnetBoard;'), 'O-NET board opener is not exported');
assert(js.includes('sessionStorage.setItem') && js.includes('vwOnetPromoClosed:'), 'session close guard missing');
assert(util.includes("if(typeof onetPromoMaybeShow === 'function') onetPromoMaybeShow();"), 'dashboard hook missing');
assert(auth.includes("if(typeof onetPromoReset === 'function') onetPromoReset();"), 'logout reset missing');
assert(css.includes('@media(max-height:430px)') && css.includes('max-height:calc(100dvh - 12px)'), 'short landscape fit rules missing');
console.log('PASS O-NET login promo wiring, close guard, CTA, and short-screen CSS');
