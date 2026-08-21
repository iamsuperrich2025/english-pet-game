'use strict';
const assert=require('assert');
const fs=require('fs');
const vm=require('vm');

const f1=fs.readFileSync('js/f1_3d.js','utf8');
const netroom=fs.readFileSync('js/netroom.js','utf8');
const fakedb=fs.readFileSync('tools/fakedb.js','utf8');
const rules=fs.readFileSync('handoff/RULES.md','utf8');
const colors=['red','blue','green','yellow','orange'];

assert.match(f1,/const F1_COLOR_WIRE=['"]f1c:['"]/,
  'F1 must use a stable multiplayer color marker');
assert.match(f1,/cw:F1_COLOR_WIRE\+playerCarStyle\.key/,
  'F1 must send the NetRoom-safe color marker');
const livePayload=f1.slice(f1.indexOf('function netSend'),f1.indexOf('function sendChat'));
assert.doesNotMatch(livePayload,/\bcl:/,
  'F1 must not send cl because both sharded NetRoom and legacy Firebase rules reject it');
const legacyRules=rules.slice(rules.indexOf('"world"'),rules.indexOf('"wroom"'));
const shardedInfoRules=rules.slice(rules.indexOf('"winfo"'),rules.indexOf('"hauntedHotel"'));
assert.match(legacyRules,/"cw"\s*:\s*\{\s*"\.validate"\s*:\s*"newData\.isString\(\)/,
  'legacy /world rules must accept the cw color marker');
assert.doesNotMatch(legacyRules,/"cl"\s*:/,
  'legacy /world rules must keep rejecting unsupported cl so this regression remains visible');
assert.match(shardedInfoRules,/"q"\s*:\s*\{\s*"\.validate"\s*:\s*"newData\.isString\(\)/,
  'sharded /winfo rules must accept cw after NetRoom packs it as q');
assert.match(f1,/function packetCarColorIndex\(uid,d\)[\s\S]*wire\.startsWith\(F1_COLOR_WIRE\)[\s\S]*CAR_STYLES\.findIndex/,
  'Remote cars must decode the NetRoom-safe color marker');
assert.match(f1,/colorIdx:packetCarColorIndex\(uid,d\)/,
  'A newly seen remote car must use the decoded selected color');
assert.match(f1,/const colorIdx=packetCarColorIndex\(uid,d\)/,
  'An existing remote car must repaint when its selected color changes');

/* Exercise the real NetRoom packet splitter/merger. The original regression
   happened here: cl was silently discarded before reaching the other client. */
const ctx={console,performance:{now:()=>Date.now()},setTimeout,clearTimeout,
  document:{getElementById:()=>null}};
ctx.window=ctx;
vm.runInNewContext(fakedb,ctx,{filename:'tools/fakedb.js'});
vm.runInNewContext(netroom,ctx,{filename:'js/netroom.js'});

for(let i=0;i<colors.length;i++){
  const marker='f1c:'+colors[i];
  const packet={n:'driver',x:10,z:20,yaw:0,w:0,cl:i,cw:marker};
  const split=ctx.NetRoom._split(packet);
  assert.strictEqual(split.cold.q,marker,`${colors[i]} marker must enter the cold NetRoom packet`);
  assert.ok(!Object.prototype.hasOwnProperty.call(split.hot,'cl') &&
            !Object.prototype.hasOwnProperty.call(split.cold,'cl'),
    'The test must reproduce that raw cl is not a supported NetRoom wire field');
  const received=ctx.NetRoom._merge(split.hot,split.cold);
  assert.strictEqual(received.cw,marker,`${colors[i]} marker must survive a full NetRoom round trip`);
  assert.strictEqual(colors.indexOf(received.cw.slice('f1c:'.length)),i,
    `${colors[i]} must decode to the same shared CAR_STYLES index`);
}

/* Two simulated players now exchange the same packets through real
   NetRoom.create/send listeners and FakeDB, not just the pure helpers. */
const wait=ms=>new Promise(resolve=>setTimeout(resolve,ms));
function packet(index){
  return {n:'driver',x:10,z:20,yaw:0,w:0,cw:'f1c:'+colors[index]};
}
function player(uid,index){
  ctx.onlineKey=()=>uid;
  const seen={};
  const room=ctx.NetRoom.create({
    map:'f1',sendMs:160,roomMax:10,
    push(){room.send(packet(room._color),true);},
    onPeer(peer,data){seen[peer]=data;},
    onPeerGone(peer){delete seen[peer];},
    onStatus(){},toast(){},
  });
  room._color=index;room._seen=seen;room.join();
  return room;
}

(async function(){
  await ctx.FakeDB.install();
  ctx.NetRoom.CFG.VERIFY_MS=25;
  const sender=player('colorSender',0);
  await wait(35);
  const receiver=player('colorReceiver',4);
  await wait(50);
  for(let i=0;i<colors.length;i++){
    sender._color=i;
    sender.send(packet(i),true);
    await wait(5);
    const got=receiver._seen.colorSender;
    assert.ok(got,`receiver must see sender for ${colors[i]}`);
    assert.strictEqual(got.cw,'f1c:'+colors[i],`${colors[i]} must survive real two-player NetRoom delivery`);
    assert.strictEqual(got.cl,undefined,'unsupported raw cl must not be mistaken for delivered data');
  }
  sender.leave();receiver.leave();
  console.log('PASS F1 multiplayer selected-color NetRoom round trip (5/5 colors, two clients)');
})().catch(error=>{console.error(error);process.exitCode=1;});
