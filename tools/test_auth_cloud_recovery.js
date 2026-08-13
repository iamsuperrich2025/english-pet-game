const fs = require('fs');
const assert = (ok, msg) => { if (!ok) throw new Error(msg); };
const auth = fs.readFileSync('js/auth.js', 'utf8');
const html = fs.readFileSync('index_classic.html', 'utf8');

assert(auth.includes('AUTH_CLOUD_SLOW_MS  = 6*1000'), 'slow connection prompt threshold');
assert(auth.includes('AUTH_CLOUD_TIMEOUT_MS = 12*1000'), 'cloud read timeout');
assert(auth.includes("err.code = 'cloud/timeout'"), 'timeout has diagnosable error code');
assert(auth.includes("mode === 'cloud-wait'") && auth.includes("mode === 'cloud-error'"), 'retry button appears for slow/error states');
assert(auth.includes('state.ownerUid === uid'), 'local fallback is restricted to the same account');
assert(auth.includes("console.warn('[auth-cloud] load failed:', code)"), 'real cloud error is retained for diagnosis');
assert(!/authFetchCloud\(user\.uid\)[\s\S]{0,1000}\.catch\(\(\)=>[\s\S]{0,300}authEnterGame\(\)/.test(auth), 'cloud failure cannot silently enter with an unverified save');
assert(html.includes('id="btn-login-retry"') && html.includes('รีเฟรชเกมแล้วลองใหม่'), 'visible refresh action exists on login screen');

console.log('PASS auth cloud recovery: slow prompt, timeout, diagnostics, safe local fallback, refresh action');
