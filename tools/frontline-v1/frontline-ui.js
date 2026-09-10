/* Compact landscape HUD showing every rival's carried letter, bank, base HP, and target progress. */
(function () {
  'use strict';
  const F=window.Frontline;
  F.makeUI=function(){
    const root=document.getElementById('battle'),q=id=>document.getElementById(id);
    function text(id,value){const el=q(id);if(el.textContent!==value)el.textContent=value;}
    let lastWord='',lastRoster='',lastMotion='',messageAt=0,victoryUntil=0;
    q('fl-victory').hidden=true;
    const message=text=>{q('fl-message').textContent=text;messageAt=performance.now();};
    function bankSummary(stored){
      if(!stored)return '—';const counts={};
      for(const ch of stored)counts[ch]=(counts[ch]||0)+1;
      return Object.keys(counts).sort().map(ch=>ch+(counts[ch]>1?'×'+counts[ch]:'')).join(' ');
    }
    return{root,message,celebrate(word,winner,mine,paid){
        const banner=q('fl-victory');banner.hidden=false;banner.dataset.won=String(mine);victoryUntil=performance.now()+3800;
        banner.querySelector('strong').textContent=mine?'★ คุณประกอบคำได้ก่อน!':'★ P'+(winner?winner.slot+1:'?')+' ประกอบคำได้ก่อน!';
        banner.querySelector('span').textContent=word.target+' · '+(word.translation||F.wordTranslation(word.target))+' · '+
          (mine&&paid===0?'กำลังตรวจรางวัล':'+'+F.C.reward.toLocaleString()+(mine?' เหรียญรอบนี้':' เหรียญให้ผู้ชนะ'));
      },connection(ok){q('fl-connection').textContent=ok?'ONLINE · 4 RIVALS + 2 GUARDS':'RECONNECTING · STOPPED';},
      update(room,id,input,attacks={},active=true,motion=''){
        const w=room.word,p=room.players&&room.players[id],own=room.bases&&room.bases[id];
        const carried=p&&p.carried||'',drop=root.querySelector('[data-hold=drop]');
        const marks=F.wordMarks(own&&own.stored||'',w.target);
        const unneeded=!!carried&&!w.target.split('').some((ch,i)=>ch===carried&&!marks[i]);
        const dropReady=active&&!!p&&p.hp>0&&!!carried&&!attacks.drop;
        const dropText=!active?'CONNECTING':!p||p.hp<=0?'REPAIRING':attacks.drop?'SENDING':carried?'CARRY '+carried:'EMPTY';
        drop.disabled=!dropReady;drop.dataset.ready=String(dropReady);
        drop.setAttribute('aria-label',carried?'Drop carried letter '+carried:'Drop carried letter, empty');
        if(drop.querySelector('small').textContent!==dropText)drop.querySelector('small').textContent=dropText;
        q('fl-drop-hint').hidden=!dropReady||!unneeded;
        if(performance.now()>victoryUntil)q('fl-victory').hidden=true;
        for(const action of ['fire','bomb']){
          const button=root.querySelector('[data-hold='+action+']'),last=p&&(action==='fire'?p.lastFire:p.lastBomb)||0;
          const interval=action==='fire'?F.C.fireMs:F.C.bombCooldown,left=Math.max(0,interval-((attacks.now||Date.now())-last));
          const text=!active?'CONNECTING':!p||p.hp<=0?'REPAIRING':attacks[action]?'SENDING':left>0?(left/1000).toFixed(1)+'s':'READY';
          const status=button.querySelector('small');if(status.textContent!==text)status.textContent=text;
          button.dataset.ready=String(text==='READY');button.style.setProperty('--cooldown',String(left/interval));
        }
        const signature=w.target+':'+w.round+':'+w.completedAt+':'+(own&&own.stored);
        if(signature!==lastWord){
          lastWord=signature;const marks=F.wordMarks(own&&own.stored||'',w.target);
          q('fl-translation').textContent=w.translation||F.wordTranslation(w.target);
          q('fl-word').replaceChildren(...w.target.split('').map((ch,i)=>{
            const el=document.createElement('span');el.textContent=ch;el.className=marks[i]?'done':'';return el;
          }));
          const winner=room.players&&room.players[w.winnerId];
          q('fl-next').textContent=w.completedAt?
            'P'+(winner?winner.slot+1:'?')+' COMPLETED · +1000':
            'BANK THE LETTERS BEFORE YOUR RIVALS';
        }
        const rosterSignature=Object.entries(room.players||{}).map(([key,player])=>{
          const base=room.bases[key];return[key,player.bot,player.carried,player.hp,base&&base.hp,base&&base.stored].join(':');
        }).join('|');
        if(rosterSignature!==lastRoster){
          lastRoster=rosterSignature;
          q('fl-roster').replaceChildren(...Object.entries(room.players||{}).map(([key,player])=>{
            const base=room.bases[key],row=document.createElement('div');
            row.className='slot-'+player.slot+(key===id?' you':'');
            const name=document.createElement('b');name.textContent='P'+(player.slot+1)+(player.bot?' BOT':'')+(key===id?' YOU':'');
            const carry=document.createElement('span');carry.textContent='CARRY '+(player.carried||'—');
            const bank=document.createElement('span');bank.textContent='BANK '+bankSummary(base&&base.stored);
            const hp=document.createElement('small');hp.textContent=base&&(base.hp>0?'BASE '+base.hp:'BASE OPEN');
            const icon=F.icon('tank');icon.classList.add('fl-rival-icon');row.append(icon,name,carry,bank,hp);return row;
          }));
        }
        text('fl-hp',p&&p.hp>0?'HP '+Math.ceil(p.hp):'REPAIRING…');
        text('fl-party',Object.keys(room.players||{}).length+'/4');
        text('fl-coins',F.sessionCoins().toLocaleString());
        text('fl-drive',motion==='tank'?'BUMP · PUSH':motion==='edge'?'EDGE · TURN':motion==='base'?'BASE LOCKED':input.auto===1?'FORWARD':input.auto===-1?'REVERSE':'STOPPED');
        if(motion!==lastMotion){
          lastMotion=motion;
          if(motion==='edge')message('ถึงขอบสนามแล้ว · เลี้ยวหรือถอยกลับ');
          if(motion==='base')message('ป้อมคู่แข่งยังปิดอยู่ · อ้อมหรือยิงทำลายก่อน');
        }
        text('fl-speed-name',F.C.speedNames[input.speedLevel]);
        if(!motion&&performance.now()-messageAt>3200)text('fl-message',carried?
          (unneeded?'Not needed? Tap DROP to leave '+carried+'.':'Carry '+carried+' home. A hit will make you drop it!'):'Ram a letter to carry it back to your base.');
      }
    };
  };
})();
