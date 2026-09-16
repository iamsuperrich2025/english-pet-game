/* Word Skirmish Battle Royale: deterministic rules and compact NetRoom protocol. */
(function(root){
  'use strict';
  const WEAPONS=[
    {id:0,name:'RANGER',label:'ไรเฟิล',damage:20,head:60,mag:24,reserve:96,interval:.14,reload:1.65,color:0xe3b864},
    {id:1,name:'SWIFT',label:'SMG',damage:14,head:42,mag:30,reserve:120,interval:.085,reload:1.3,color:0x6bc9c1},
    {id:2,name:'SCOUT',label:'สไนเปอร์',damage:60,head:180,mag:5,reserve:25,interval:.75,reload:2.25,color:0xbcadf1}
  ];
  const RADIUS=52,WARMUP=10000,INTERMISSION=8000;
  function token(uid){let h=2166136261;for(const c of String(uid)){h=Math.imul(h^c.charCodeAt(0),16777619);}return ((h>>>0)%60466176).toString(36).padStart(5,'0');}
  function inventory(){return {weapon:0,ammo:WEAPONS.map(w=>w.mag),reserve:WEAPONS.map(w=>w.reserve),owned:[true,false,false],armor:50,medkits:2,action:null};}
  function damage(hp,armor,amount){const absorbed=Math.min(armor,amount*.6);return {hp:Math.max(0,hp-(amount-absorbed)),armor:Math.max(0,armor-absorbed)};}
  function zone(seconds){const t=Math.max(0,seconds);return {x:Math.min(9,t/20),z:-Math.min(6,t/30),radius:t<40?52:Math.max(0,52-(t-40)*.36),damage:t>185?18:t>135?9:4,closing:t>=40,remaining:Math.max(0,Math.ceil((t<40?40:185)-t))};}
  function outside(x,z,c){return Math.hypot(x-c.x,z-c.z)>c.radius;}
  function encode(r){return 'B'+r.phase+(r.winner||'-----')+(r.mask||0).toString(36).padStart(2,'0')+r.roster.join('.');}
  function decode(c,ct){if(typeof c!=='string'||c.length>60||!/^B[WAF]/.test(c))return null;const roster=c.slice(9).split('.');if(roster.length>8||roster.some(t=>!/^\w{5}$/.test(t))||new Set(roster).size!==roster.length)return null;const start=Number(ct)||0;if(!Number.isFinite(start)||start<0)return null;return {phase:c[1],winner:c.slice(2,7)==='-----'?'':c.slice(2,7),mask:parseInt(c.slice(7,9),36)||0,roster,start};}
  function reload(inv,now){const w=WEAPONS[inv.weapon];if(inv.action||inv.ammo[w.id]>=w.mag||!inv.reserve[w.id])return false;inv.action={kind:'reload',end:now+w.reload,weapon:w.id};return true;}
  function heal(inv,hp,now){if(inv.action||hp>=100||!inv.medkits)return false;inv.action={kind:'heal',end:now+3};return true;}
  function finishAction(inv,hp,now){const a=inv.action;if(!a||now<a.end)return hp;inv.action=null;if(a.kind==='heal'){inv.medkits--;return Math.min(100,hp+65);}const w=WEAPONS[a.weapon],n=Math.min(w.mag-inv.ammo[w.id],inv.reserve[w.id]);inv.ammo[w.id]+=n;inv.reserve[w.id]-=n;return hp;}
  function controller(uid){
    const me=token(uid);let round={phase:'W',winner:'',mask:127,roster:[me],start:0},requested=0,finishedAt=0;
    const rank={W:0,A:1,F:2};
    function sync(now,peers,alive,mask){
      const records=Object.entries(peers||{}).map(([id,p])=>({id:token(id),p,r:decode(p.c,p.ct)})).filter(p=>p.r);
      // A hash collision is extraordinarily unlikely; never admit ambiguous identities.
      const present=[me,...records.map(p=>p.id)].filter((v,i,a)=>a.indexOf(v)===i).sort();
      const connected=round.roster.filter(t=>present.includes(t)).sort();let authority=connected[0]||me;
      const candidates=records.filter(p=>p.r.start>0);
      let incoming=null;
      if(!round.start){incoming=candidates.sort((a,b)=>a.r.start-b.r.start||a.id.localeCompare(b.id))[0];}
      else incoming=candidates.filter(p=>p.id===authority&&p.r.start>=round.start).sort((a,b)=>b.r.start-a.r.start)[0];
      // Converge simultaneous warm-up proposals to the earliest shared round.
      if(round.phase==='W'&&now<round.start){const earlier=candidates.filter(p=>p.r.start<round.start).sort((a,b)=>a.r.start-b.r.start)[0];if(earlier)incoming=earlier;}
      if(incoming&&(incoming.r.start!==round.start||rank[incoming.r.phase]>=rank[round.phase]))round={...incoming.r,roster:[...incoming.r.roster]};
      authority=round.roster.filter(t=>present.includes(t)).sort()[0]||me;
      if(!round.start&&requested&&now-requested>=1500&&present[0]===me)round={phase:'W',winner:'',mask:present.length===1?127:0,roster:present.slice(0,8),start:now+WARMUP};
      if(round.start&&round.phase==='W'){
        if(authority===me){round.roster=present.slice(0,8);round.mask=round.roster.length===1?127:0;}
        if(now>=round.start)round.phase='A';
      }
      if(round.phase==='A'&&authority===me){
        if(round.roster.length===1)round.mask=mask;
        const survivors=round.roster.filter(t=>t===me?alive:records.some(p=>p.id===t&&p.r.start===round.start&&Number(String(p.p.hp||'').split('|')[1])>0));
        for(let i=0;i<7;i++)if(round.mask&(1<<i))survivors.push('bot0'+i);
        if(survivors.length<=1&&now-round.start>1500){round.phase='F';round.winner=survivors[0]||'';}
      }
      if(round.phase==='F'){
        if(!finishedAt)finishedAt=now;
        if(authority===me&&now-finishedAt>=INTERMISSION)round={phase:'W',winner:'',mask:present.length===1?127:0,roster:present.slice(0,8),start:now+WARMUP};
      }else finishedAt=0;
      return {...round,roster:[...round.roster],authority,admitted:round.roster.includes(me),me};
    }
    return {request(now){requested=now||1;},sync,get round(){return round;},packet(){return {c:encode(round),ct:round.start};}};
  }
  const api={WEAPONS,RADIUS,WARMUP,INTERMISSION,token,inventory,damage,zone,outside,encode,decode,reload,heal,finishAction,controller};
  if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.WordSkirmishBR=api;
})(typeof window!=='undefined'?window:globalThis);
