const fs = require('fs');

const deploy = fs.readFileSync('tools/deploy_firebase.sh', 'utf8');

function must(condition, message) {
  if (!condition) throw new Error(message);
}

must(
  deploy.includes('STAGED_BUILD_VERSION="$(python -c'),
  'deploy pipeline must read the staged Git HEAD build version'
);
must(
  deploy.includes('TESTED_BUILD_VERSION="$(python -c'),
  'deploy pipeline must read the prebuilt dist version'
);
must(
  deploy.includes('[[ "$TESTED_BUILD_VERSION" == "$STAGED_BUILD_VERSION" ]]'),
  'prebuilt dist must only deploy when its version matches staged Git HEAD'
);
must(
  deploy.includes('fallback build จาก HEAD'),
  'version mismatch must visibly fall back to a build from Git HEAD'
);

console.log('PASS safe deploy version gate: prebuilt dist must match staged HEAD');
