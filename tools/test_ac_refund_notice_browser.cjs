'use strict';

const assert = require('node:assert/strict');
const path = require('node:path');
const {chromium} = require(path.join(require('node:os').homedir(), '.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright'));

(async()=>{
  const browser = await chromium.launch({headless:true, executablePath:'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'});
  const page = await browser.newPage({viewport:{width:812, height:375}});
  const errors = [];
  page.on('pageerror', error=>errors.push(String(error.message || error)));
  await page.goto('http://127.0.0.1:4177/index_classic.html', {waitUntil:'domcontentloaded', timeout:30000});
  await page.waitForFunction(()=>typeof showAcDuplicateRefundNotice === 'function', null, {timeout:30000});
  await page.evaluate(()=>{
    const consent = document.getElementById('consent-gate');
    if(consent) consent.style.display = 'none';
    state.acDuplicateRefundNotice = {total:175000, count:7};
    window.__acNoticeSaveCount = 0;
    window.__acNoticeOldSave = saveState;
    saveState = ()=>{ window.__acNoticeSaveCount++; };
    showAcDuplicateRefundNotice();
  });
  const box = page.locator('[data-ac-duplicate-refund]');
  await box.waitFor({state:'visible'});
  const geometry = await box.evaluate(el=>{
    const r = el.getBoundingClientRect();
    return {left:r.left, top:r.top, right:r.right, bottom:r.bottom, scrollHeight:el.scrollHeight, clientHeight:el.clientHeight};
  });
  assert.ok(geometry.left >= 0 && geometry.top >= 0 && geometry.right <= 812 && geometry.bottom <= 375, `notice must fit 812x375: ${JSON.stringify(geometry)}`);
  assert.ok(geometry.scrollHeight <= geometry.clientHeight + 1, `notice must not scroll: ${JSON.stringify(geometry)}`);

  await page.keyboard.press('Escape');
  await page.waitForTimeout(250);
  assert.equal(await box.count(), 1, 'Escape must not dismiss the refund notice');
  await page.mouse.click(2, 2);
  await page.waitForTimeout(250);
  assert.equal(await box.count(), 1, 'backdrop click must not dismiss the refund notice');
  await page.waitForTimeout(900);
  assert.equal(await box.count(), 1, 'refund notice must not auto-dismiss');
  assert.equal(await page.evaluate(()=>window.__acNoticeSaveCount), 0, 'notice must remain persisted before acknowledgement');

  await box.locator('.rankup-btn').click();
  assert.equal(await box.count(), 0, 'acknowledge button must dismiss the notice');
  assert.equal(await page.evaluate(()=>state.acDuplicateRefundNotice), null);
  assert.equal(await page.evaluate(()=>window.__acNoticeSaveCount), 1, 'acknowledgement must persist notice removal exactly once');
  await page.evaluate(()=>{ saveState = window.__acNoticeOldSave; });
  await browser.close();
  const relevantErrors = errors.filter(message=>!/firebase|network|ERR_/i.test(message));
  assert.deepEqual(relevantErrors, []);
  console.log(`PASS AC refund notice browser 812x375: fits without scroll; Escape/backdrop/timer stay open; acknowledgement closes once`);
})().catch(error=>{ console.error(error); process.exit(1); });
