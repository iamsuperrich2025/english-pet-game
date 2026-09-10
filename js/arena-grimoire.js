"use strict";
/* Round 1387: compact searchable spell cards; SVG symbols share one cached small shared file. */
(function(){
  const categories=[['all','ทั้งหมด'],['fire','ไฟ'],['wind','วายุ'],['ice','น้ำแข็ง'],['meteor','ดวงดาว'],['earth','ปฐพี'],['gravity','มิติ'],['water','วารี'],['light','แสง'],['arc','สายฟ้า'],['nova','จักรวาล']];
  const views=new WeakMap();
  function icon(def){return '<svg class="va-spell-icon" viewBox="0 0 64 64" aria-hidden="true"><use href="img/arena-icons/spells.svg#'+def.id+'"></use></svg>';}
  function render(root,api){
    const panel=root.querySelector('.va-spell-panel');let view=views.get(panel);
    if(!view){
      view={filter:'all',query:'',reset:true,api};views.set(panel,view);
      const toolbar=document.createElement('div');toolbar.className='va-grimoire-tools';
      toolbar.innerHTML='<label><span>หมวดธาตุ</span><select aria-label="หมวดธาตุ">'+categories.map(([id,n])=>'<option value="'+id+'">'+n+'</option>').join('')+'</select></label><label class="va-grimoire-search"><span>ค้นหาเวทมนตร์</span><input type="search" placeholder="ชื่อหรือความสามารถ…" aria-label="ค้นหาเวทมนตร์"></label><b>60 SPELLS</b>';
      panel.querySelector('#va-slot-tabs').after(toolbar);
      toolbar.querySelector('select').addEventListener('change',e=>{view.filter=e.target.value;view.reset=true;render(root,view.api);});
      toolbar.querySelector('input').addEventListener('input',e=>{view.query=e.target.value;view.reset=true;render(root,view.api);});
      const nav=document.createElement('div');nav.className='va-grimoire-nav';nav.innerHTML='<span></span><b class="va-swipe-hint">ปัดซ้ายขวาเพื่อดูเพิ่มเติม</b><small id="va-spell-load" role="status" aria-live="polite"></small>';
      panel.querySelector('#va-spell-grid').after(nav);
    }
    panel.querySelector('.va-panel-sub').textContent=typeof isAdmin==='function'&&isAdmin()?'ADMIN · ปลดล็อกครบ 60 ธาตุ · เลือกใช้ได้ 2 ช่อง':'เริ่มด้วย ยิง + แสงฟื้นฟู · ซื้อ 3,000–5,000 เหรียญ ใช้ถาวร · เลือกได้ 2 ช่อง';
    view.api=api;const {slots,editing,seconds}=api,q=view.query.trim().toLowerCase();
    const list=ArenaElements.skills.filter(d=>(view.filter==='all'||(d.family||d.id)===view.filter)&&(!q||(d.name+' '+d.desc+' '+d.id).toLowerCase().includes(q)));
    root.querySelector('#va-slot-tabs').innerHTML=slots.map((id,i)=>{const d=ArenaElements.byId[id];return '<button data-equip-slot="'+i+'" class="'+(editing===i?'selected':'')+'" aria-pressed="'+(editing===i)+'">'+(d?icon(d):'<span class="va-empty-slot">＋</span>')+'<span>'+ (i+1)+' · '+(d?d.name:'เลือกพลัง')+'</span></button>';}).join('');
    const visible=list,grid=root.querySelector('#va-spell-grid'),left=view.reset?0:grid.scrollLeft;
    ArenaStrip.bind(grid,'สมุดเวท');
    root.querySelector('#va-spell-grid').innerHTML=visible.length?visible.map(d=>{const slot=slots.indexOf(d.id),owned=ArenaElements.owned(d.id);return '<button class="va-spell-card'+(slot>=0?' equipped':'')+(!owned?' locked':'')+'" data-equip-spell="'+d.id+'" style="--element:'+d.color+'" aria-label="'+d.name+' '+d.desc+' '+(owned?'มีแล้ว':'ซื้อ '+d.price+' เหรียญ')+'"><span class="va-element-icon">'+icon(d)+'</span><b>'+d.name+'</b><small>'+d.desc+'</small><em>'+(slot>=0?'ช่อง '+(slot+1)+' · ':'')+(owned?Number(seconds(d.id).toFixed(1))+' วิ · '+(typeof isAdmin==='function'&&isAdmin()?'ADMIN':d.id==='light'?'เริ่มต้น':'มีแล้ว'):'ซื้อ ◈ '+Number(d.price).toLocaleString()+'<span class="va-spell-cd"> · '+Number(seconds(d.id).toFixed(1))+' วิ</span>')+'</em></button>';}).join(''):'<p class="va-spell-empty">ไม่พบเวทมนตร์ที่ค้นหา</p>';
    grid.scrollLeft=left;view.reset=false;
    const nav=panel.querySelector('.va-grimoire-nav');nav.querySelector('span').textContent=list.length+' แบบ';
  }
  function status(root,message){const el=root?.querySelector('#va-spell-load');if(el)el.textContent=message;}
  window.ArenaGrimoire={render,icon,status};
})();
