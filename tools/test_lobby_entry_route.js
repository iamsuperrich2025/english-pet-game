const fs = require('fs');

const main = fs.readFileSync('index.html', 'utf8');
const classic = fs.readFileSync('index_classic.html', 'utf8');

function must(condition, message) {
  if (!condition) throw new Error(message);
}

must(
  main.includes("if(params.get('lobby') === '3d') return;"),
  'index.html must reserve ?lobby=3d for the secondary 3D lobby'
);
must(
  main.includes("location.replace('index_classic.html' + location.search + location.hash);"),
  'the default entry route must replace into Lobby Classic'
);
must(
  classic.includes('id="btn-rail-city" href="index.html?lobby=3d"'),
  'the left vertical rail must link to the secondary 3D lobby route'
);
must(
  classic.includes('<span class="rail-ico">🏙️</span>Lobby 3D'),
  'the secondary lobby button must be clearly labelled Lobby 3D'
);

console.log('PASS lobby entry route: default=Classic, secondary rail button=3D');
