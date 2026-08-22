/* Vocab Sky Playground Private Beta access regression. */
"use strict";
const fs=require('fs'),path=require('path'),vm=require('vm');
const root=path.resolve(__dirname,'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
function ok(cond,msg){if(!cond)throw new Error(msg);console.log('PASS',msg);}

const auth=read('js/auth.js');
const authCtx={console,setTimeout:()=>0,clearTimeout:()=>{},setInterval:()=>0,clearInterval:()=>{}};
authCtx.window=authCtx;authCtx.addEventListener=()=>{};authCtx.document={getElementById:()=>null,addEventListener:()=>{}};
vm.createContext(authCtx);vm.runInContext(auth,authCtx,{filename:'js/auth.js'});
const betaEmails=['freddommun@gmail.com','sumpajitshami@gmail.com','parkerhulk2020@gmail.com'];
for(const email of betaEmails){
  const got=vm.runInContext(`Auth.user={email:${JSON.stringify(email.toUpperCase())}};canAccessSkyBeta()`,authCtx);
  ok(got,`${email} gets Sky beta access after lowercase normalization`);
}
ok(!vm.runInContext("Auth.user={email:'student@example.com'};canAccessSkyBeta()",authCtx),'ordinary account is denied Sky beta access');
ok(vm.runInContext('SKY_BETA_OPEN',authCtx)===false,'public release switch defaults to false');
ok(JSON.stringify(vm.runInContext('[...SKY_BETA_EMAILS].sort()',authCtx))===JSON.stringify(betaEmails.slice().sort()),'Sky beta allowlist is exactly the three requested emails');
ok(JSON.stringify(vm.runInContext('TESTER_EMAILS.slice().sort()',authCtx))===JSON.stringify(['freddommun@gmail.com','sumpajitshami@gmail.com']),'tester allowlist is unchanged and separate');
ok(JSON.stringify(vm.runInContext('TEACHER_EMAILS.slice()',authCtx))===JSON.stringify(['freddommun@gmail.com']),'teacher allowlist is unchanged');

const ui=read('js/ui.js'),online=read('js/online.js'),sky=read('js/skyplay3d.js'),net=read('js/netroom.js');
ok(/PRIVATE BETA/.test(ui)&&/b\.hidden = !betaVisible/.test(ui),'Lobby card is beta-only and carries the PRIVATE BETA badge');
ok(/enterSkyPlayground3D\(\)\{\s*if\(!ensureSkyBetaAccess\(\)\)/.test(ui),'direct Sky entry checks beta access before ticket/loading');
ok(/startWorldEntry\(w, info, unlocked, overlay, button\)\{\s*if\(w && w\.mode === 'sky'/.test(ui),'paid entry path rechecks before charging');
ok(/railWorldClick\(w\)\{\s*if\(w && w\.mode === 'sky'/.test(ui),'Lobby entry path rechecks beta access');
ok(/openTinvPicker\(map\)\{\s*if\(map === 'sky'/.test(ui)&&/function tinvSend[\s\S]*map === 'sky'/.test(online),'invitation UI and direct sender recheck beta access');
ok(/v\.map !== 'sky'[\s\S]*canAccessSkyBeta/.test(online),'ordinary accounts do not surface Sky invitations');
ok(/function start\(\)\{if\(!\(typeof canAccessSkyBeta/.test(sky)&&sky.indexOf('canAccessSkyBeta')<sky.indexOf('restoreHostLesson()&&!restoreActiveRun()'),'Sky start blocks reconnect/resume before restoring state');
ok(/function join\(\)\{\s*if\(!skyMapAllowed\(map\)\)/.test(net)&&/function joinNow\(first, from\)\{\s*if\(!skyMapAllowed\(map\)/.test(net),'NetRoom join and reconnect retry both enforce beta access');
ok(/MAPS3D\.filter\(skyMapAllowed\)/.test(net),'ordinary friend-location scans skip denied Sky without affecting other maps');

const netCtx={console,performance:{now:()=>0},setTimeout,clearTimeout,document:{getElementById:()=>null},canAccessSkyBeta:()=>false};
netCtx.window=netCtx;vm.createContext(netCtx);vm.runInContext(net,netCtx,{filename:'js/netroom.js'});
let deniedMessage='';
const denied=netCtx.NetRoom.create({map:'sky',toast:m=>{deniedMessage=m;}}).join();
ok(denied===false&&/Private Beta/.test(deniedMessage),'NetRoom rejects a direct unauthorized Sky join with a polite visible reason');

const md=read('handoff/RULES.md'),match=md.match(/```json\s*([\s\S]*?)\s*```/);
ok(match,'Rules source contains one full JSON block');
const rules=JSON.parse(match[1]).rules,emails=betaEmails;
const guarded=[rules.world.$map['.read'],rules.world.$map.$uid['.write'],rules.wroom.$map['.read'],rules.wroom.$map.$room.$uid['.write'],rules.winfo.$map['.read'],rules.winfo.$map.$room.$uid['.write'],rules.tinv.$toUid.$fromUid['.write'],rules.tinv.$toUid.$fromUid['.validate']];
ok(guarded.every(expr=>emails.every(email=>expr.includes(email))),'Firebase Sky world, NetRoom and invitation guards contain all three lowercase emails');
ok(guarded.slice(0,6).every(expr=>expr.includes("$map !== 'sky'")),'Firebase map guards leave every non-Sky world unchanged');
ok(rules.world.$map['.validate'].includes("$map === 'sky'")&&rules.wroom.$map['.validate'].includes("$map === 'sky'")&&rules.winfo.$map['.validate'].includes("$map === 'sky'"),'Sky remains in the existing map enums');
console.log('Vocab Sky Playground Private Beta regression passed');
