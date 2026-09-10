"use strict";
/* ==== 🔥🌪 Round 1381 — elemental combat, independent of rendering and account rewards ==== */
(function(){
  const skills=[
    {id:'fire',name:'วงเพลิง',icon:'🔥',color:'#ff7136',cd:6,desc:'เผาพื้นที่ 3 วินาที',detail:'เผาศัตรูในวงต่อเนื่อง',tone:180},
    {id:'wind',name:'พายุหมุน',icon:'🌪️',color:'#76f5d9',cd:8,desc:'พายุเคลื่อนที่และดูดศัตรู',detail:'พายุหมุนเดินหน้า 4 วินาที',tone:330},
    {id:'ice',name:'ผนึกน้ำแข็ง',icon:'❄️',color:'#65cfff',cd:9,desc:'ลดความเร็วศัตรู 4 วินาที',detail:'ระเบิดเกล็ดน้ำแข็งรอบตัว',tone:1060},
    {id:'meteor',name:'ฝนดาวตก',icon:'☄️',color:'#ffb753',cd:14,desc:'ดาวตก 3 ลูก ระเบิดเป็นวง',detail:'วงเตือนก่อนดาวตกกระแทก',tone:105},
    {id:'earth',name:'แผ่นดินไหว',icon:'🪨',color:'#e3b978',cd:10,desc:'กระแทกและผลักศัตรูรอบตัว',detail:'เสาหินพุ่งขึ้นพร้อมคลื่นกระแทก',tone:85},
    {id:'gravity',name:'หลุมดำ',icon:'🌌',color:'#c785ff',cd:12,desc:'ดูดรวมแล้วระเบิดหลัง 3 วินาที',detail:'ดึงศัตรูเข้าจุดเดียวก่อนระเบิด',tone:145},
    {id:'water',name:'คลื่นยักษ์',icon:'🌊',color:'#3fb9ff',cd:7,desc:'คลื่นพุ่งผลักศัตรูด้านหน้า',detail:'คลื่นทะเลกวาดเป็นแนวกว้าง',tone:460},
    {id:'light',name:'แสงฟื้นฟู',icon:'✨',color:'#ffe487',cd:16,desc:'ฟื้น HP 30 และเสริมโล่ 20',detail:'ฟื้นพลังตนเองพร้อมแสงคุ้มครอง',tone:780},
    {id:'arc',name:'สายฟ้าลูกโซ่',icon:'⚡',color:'#80dfff',cd:4,desc:'สายฟ้าชิ่ง 3 เป้าหมาย'},
    {id:'nova',name:'โนวา',icon:'🌀',color:'#d37cff',cd:7,desc:'ระเบิดพลังเวทรอบตัว'}
  ];
  const byId=Object.fromEntries(skills.map(s=>[s.id,s]));
  function owned(id){return !!byId[id]&&((typeof isAdmin==='function'&&isAdmin())||id==='light'||!!(typeof state!=='undefined'&&state.arenaItems&&state.arenaItems['spell_'+id]===true));}
  function normalizeSlots(value){const a=Array.isArray(value)?value:[],first=byId[a[0]]&&owned(a[0])?a[0]:'light',second=byId[a[1]]&&owned(a[1])&&a[1]!==first?a[1]:null;return [first,second];}
  function create(api){
    const zones=[],MAX_ZONES=12;let elapsed=0,expanded=null;
    const distance=(a,b)=>Math.hypot(a.x-b.x,a.z-b.z);
    function enemies(pos,r,fn){for(const b of api.enemies().slice())if(!b.dead&&distance(pos,b.group.position)<=r)fn(b);}
    function push(b,pos,strength){if(b.vaultOwner)return;if(b.boss)strength*=.22;const p=b.group.position,dx=p.x-pos.x,dz=p.z-pos.z,d=Math.hypot(dx,dz)||1;p.x+=dx/d*strength;p.z+=dz/d*strength;const r=Math.hypot(p.x,p.z);if(r>30){p.x*=30/r;p.z*=30/r;}}
    function zone(kind,pos,dir,mult,life,r){const z={kind,pos:pos.clone(),dir:dir.clone(),mult,life,max:life,age:0,lastPulse:0,r,hit:new Set(),index:0,visual:null};if(zones.length>=MAX_ZONES)zones.shift();zones.push(z);return z;}
    function cast(kind,pos,dir,target,mult){
      if(!byId[kind]||kind==='arc'||kind==='nova')return false;
      if(byId[kind].pack){if(!ArenaElements.isReady(kind))return false;expanded=expanded||ArenaSpellEngine.create({...api,zone,enemies,push,allEnemies:api.enemies});return expanded.cast(byId[kind],pos,dir,target,mult);}
      const aim=target?target.group.position.clone():pos.clone().addScaledVector(dir,7),now=performance.now();aim.y=0;
      if(kind==='fire'){const z=zone(kind,aim,dir,mult,3.4,7.4);z.visual=api.fx.element(kind,z.pos,{life:3.4,r:z.r});}
      else if(kind==='wind'){const z=zone(kind,pos.clone().addScaledVector(dir,3),dir,mult,4.5,api.storm()?7.2:5.6);z.visual=api.fx.element(kind,z.pos,{life:4.5,r:z.r});}
      else if(kind==='ice'){api.fx.element(kind,pos,{r:9.5});enemies(pos,9.5,b=>{b.slow=Math.max(b.slow||0,now+4500);api.hit(b,42*mult);});}
      else if(kind==='meteor'){zone(kind,aim,dir,mult,2.1,4.2);}
      else if(kind==='earth'){api.fx.element(kind,pos,{r:9});enemies(pos,9,b=>{push(b,pos,5.5);b.slow=Math.max(b.slow||0,now+1800);api.hit(b,72*mult);});}
      else if(kind==='gravity'){const z=zone(kind,aim,dir,mult,3.6,7.2);z.visual=api.fx.element(kind,z.pos,{life:3.6,r:z.r});}
      else if(kind==='water'){const z=zone(kind,pos.clone().addScaledVector(dir,1.5),dir,mult,1.5,5.5);z.visual=api.fx.element(kind,z.pos,{life:1.5,r:5.5,yaw:Math.atan2(dir.x,dir.z)});}
      else if(kind==='light'){api.fx.element(kind,pos,{r:5});api.heal(30,20);}
      return true;
    }
    function castMega(kind,pos,dir,mult){
      if(!byId[kind]||kind==='arc'||kind==='nova')return false;
      const z=zone('mega',pos,dir,mult,2.8,18);z.element=kind;z.col=parseInt(byId[kind].color.slice(1),16);api.fx.mega(pos,kind,z.r);
      if(kind==='light')api.heal(30,20);
      return true;
    }
    function tick(dt){
      elapsed+=dt;
      for(let i=zones.length-1;i>=0;i--){const z=zones[i],previous=z.age;z.age+=dt;z.life-=dt;
        if(z.kind==='expanded')expanded.tick(z,dt);
        if(z.kind==='mega'){
          if(z.element==='gravity'||z.element==='wind')enemies(z.pos,z.r,b=>push(b,z.pos,-Math.min(distance(b.group.position,z.pos),dt*3.8)));
          for(const impact of [.35,1.05,1.75])if(previous<impact&&z.age>=impact){
            if(z.element==='fire'&&api.fx.firePulse)api.fx.firePulse(z.pos,z.r);else api.fx.ring(z.pos,z.col,z.r,.7);api.fx.burst(z.pos,z.col,32,14);
            enemies(z.pos,z.r,b=>{if(z.element==='ice')b.slow=Math.max(b.slow||0,performance.now()+4000);if(z.element==='earth'||z.element==='water')push(b,z.pos,1.2);api.hit(b,40*z.mult);});
          }
        }
        if(z.kind==='wind'||z.kind==='water'){z.pos.addScaledVector(z.dir,dt*(z.kind==='wind'?2.3:12));if(z.visual)z.visual.move(z.pos);}
        if(z.kind==='wind'||z.kind==='gravity')enemies(z.pos,z.r,b=>push(b,z.pos,-Math.min(distance(b.group.position,z.pos),dt*(b.boss?1.8:3.8))));
        if(z.kind==='fire'||z.kind==='wind'||z.kind==='gravity'){
          while(z.lastPulse+.5<=Math.min(z.age,z.max)+.00001){z.lastPulse+=.5;enemies(z.pos,z.r,b=>api.hit(b,(z.kind==='fire'?15:z.kind==='wind'?10:8)*z.mult));api.fx.burst(z.pos,z.kind==='fire'?0xff7e28:z.kind==='wind'?0x8effdd:0xc778ff,8,3);}
        }
        if(z.kind==='water')enemies(z.pos,z.r,b=>{if(z.hit.has(b))return;z.hit.add(b);const p=b.group.position;if(!b.vaultOwner)p.addScaledVector(z.dir,b.boss?.4:2.8);const r=Math.hypot(p.x,p.z);if(r>30)p.multiplyScalar(30/r);api.hit(b,48*z.mult);api.fx.burst(p,0xb6faff,10,4);});
        if(z.kind==='meteor'){
          for(let j=0;j<3;j++){const start=j*.5,impact=start+.65,a=j/3*Math.PI*2,p=z.pos.clone();p.x+=Math.cos(a)*2.6;p.z+=Math.sin(a)*2.6;
            if((previous<=start&&z.age>start)&&!(z.index&(1<<j))){z.index|=1<<j;api.fx.element('meteor',p,{life:.65,r:z.r});}
            if(previous<impact&&z.age>=impact){api.fx.element('impact',p,{r:z.r});enemies(p,z.r,b=>api.hit(b,48*z.mult));}
          }
        }
        if(z.life<=0){if(z.kind==='gravity'){api.fx.element('collapse',z.pos,{r:z.r});enemies(z.pos,z.r,b=>api.hit(b,62*z.mult));}zones.splice(i,1);}
      }
    }
    return {cast,castMega,tick,clear:()=>{zones.length=0;},stats:()=>({active:zones.length,cap:MAX_ZONES,time:elapsed,mega:zones.filter(z=>z.kind==='mega').map(z=>({element:z.element,radius:z.r}))})};
  }
  window.ArenaElements={skills,byId,owned,normalizeSlots,create};
})();
