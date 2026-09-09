"use strict";
/* Round 1381 — one live portrait: local hair/cape displacement, anchored face/feet, elemental particles. */
(function(){
 function create(host){
  const photo=document.createElement('img'),canvas=document.createElement('canvas'),sparks=document.createElement('canvas');photo.alt='';photo.className='ah-portrait-still';canvas.className='ah-portrait-motion';sparks.className='ah-portrait-sparks';host.append(photo,canvas,sparks);
  let gl,program,texture,buffer,raf=0,last=0,frames=0,disposed=false,ready=false,enabled=true,hero=null,serial=0;
  const reduce=matchMedia('(prefers-reduced-motion: reduce)'),ctx=sparks.getContext('2d'),locations={};
  try{
   gl=canvas.getContext('webgl',{alpha:true,antialias:false,premultipliedAlpha:false,preserveDrawingBuffer:true});if(!gl)throw Error('no WebGL');
   function shader(type,src){const s=gl.createShader(type);gl.shaderSource(s,src);gl.compileShader(s);if(!gl.getShaderParameter(s,gl.COMPILE_STATUS))throw Error(gl.getShaderInfoLog(s));return s;}
   const vs=shader(gl.VERTEX_SHADER,'attribute vec2 p;varying vec2 uv;void main(){uv=vec2((p.x+1.)*.5,(1.-p.y)*.5);gl_Position=vec4(p,0.,1.);}');
   const fs=shader(gl.FRAGMENT_SHADER,`precision mediump float;varying vec2 uv;uniform sampler2D pic;uniform float t;uniform vec4 hair,capeA,capeB,face,magic;uniform float flame;
    float mask(vec4 r){return 1.-smoothstep(.45,1.,length((uv-r.xy)/r.zw));}
    void main(){float fixedFace=smoothstep(.85,1.2,length((uv-face.xy)/face.zw));float h=mask(hair)*fixedFace;float c=max(mask(capeA),mask(capeB))*fixedFace;float m=mask(magic)*fixedFace;vec2 d=vec2(h*.0035*sin(t*1.8+uv.y*17.)+c*.006*sin(t*1.5+uv.y*14.),c*.0018*sin(t*1.8+uv.x*12.));d+=m*vec2(.003*sin(t*3.+uv.y*45.),.0025*sin(t*2.3+uv.x*21.));vec4 col=texture2D(pic,clamp(uv+d,0.,1.));col.rgb*=1.+m*flame*.09*sin(t*7.+uv.y*28.);gl_FragColor=col;}`);
   program=gl.createProgram();gl.attachShader(program,vs);gl.attachShader(program,fs);gl.linkProgram(program);gl.deleteShader(vs);gl.deleteShader(fs);if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw Error('portrait program');gl.useProgram(program);
   buffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]),gl.STATIC_DRAW);const a=gl.getAttribLocation(program,'p');gl.enableVertexAttribArray(a);gl.vertexAttribPointer(a,2,gl.FLOAT,false,0,0);
   for(const n of ['t','hair','capeA','capeB','face','magic','flame'])locations[n]=gl.getUniformLocation(program,n);
   texture=gl.createTexture();gl.bindTexture(gl.TEXTURE_2D,texture);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);
  }catch(e){canvas.hidden=true;}
  function active(){return !disposed&&ready&&enabled&&!reduce.matches&&!document.hidden;}
  function resize(){const r=host.getBoundingClientRect(),d=Math.min(devicePixelRatio||1,1.5),w=Math.max(2,Math.min(768,Math.round(r.width*d))),h=Math.round(w*1.5);canvas.width=sparks.width=w;canvas.height=sparks.height=h;if(gl)gl.viewport(0,0,w,h);}
  function particles(t){ctx.clearRect(0,0,sparks.width,sparks.height);const [mx,my,rx,ry]=hero.motion.magic,w=sparks.width,h=sparks.height;ctx.fillStyle=hero.color;ctx.strokeStyle=hero.color;
   for(let i=0;i<18;i++){const q=(t*.24+i/18)%1,a=i*2.4+t*.7,orbit=hero.id==='gravity'||hero.id==='water'||hero.id==='wind';const x=(mx+(orbit?Math.cos(a)*rx*.85:Math.sin(i*12.4+q*2)*rx*.8))*w,y=(my+(orbit?Math.sin(a)*ry*.4:-q*ry*1.7+ry*.65))*h;ctx.globalAlpha=Math.sin(q*Math.PI)*.7;ctx.beginPath();if(hero.id==='ice'||hero.id==='earth'){const r=2+q*2;ctx.moveTo(x,y-r);ctx.lineTo(x+r*.6,y);ctx.lineTo(x,y+r);ctx.lineTo(x-r*.6,y);ctx.closePath();}else ctx.arc(x,y,(hero.id==='fire'?2.2:1.4)+q*1.6,0,Math.PI*2);ctx.fill();}ctx.globalAlpha=1;
  }
  function draw(time){raf=0;if(!active())return;if(time-last>=32){last=time;const t=time/1000;if(gl&&!canvas.hidden){gl.useProgram(program);gl.uniform1f(locations.t,t);gl.drawArrays(gl.TRIANGLES,0,6);}particles(t);frames++;}raf=requestAnimationFrame(draw);}
  function sync(){cancelAnimationFrame(raf);raf=0;const on=active();canvas.style.visibility=on&&!canvas.hidden?'visible':'hidden';sparks.style.visibility=on?'visible':'hidden';if(on)raf=requestAnimationFrame(draw);}
  function load(def){hero=def;ready=false;serial++;const ticket=serial;sync();photo.src=def.image;photo.alt=def.name+' '+def.title+' ภาพเต็มตัว';photo.onload=()=>{if(disposed||ticket!==serial)return;resize();if(gl&&!canvas.hidden){try{gl.bindTexture(gl.TEXTURE_2D,texture);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,photo);for(const key of ['hair','capeA','capeB','face','magic'])gl.uniform4fv(locations[key],def.motion[key]);gl.uniform1f(locations.flame,def.id==='fire'||def.id==='meteor'?1:0);}catch(e){canvas.hidden=true;}}ready=true;sync();};photo.onerror=()=>{ready=false;sync();};if(photo.complete&&photo.naturalWidth)photo.onload();}
  const observer=new ResizeObserver(resize);observer.observe(host);document.addEventListener('visibilitychange',sync);reduce.addEventListener('change',sync);
  return {load,setEnabled(v){enabled=v;sync();},stats:()=>({frames,running:!!raf,ready,webgl:!!gl&&!canvas.hidden}),dispose(){disposed=true;serial++;cancelAnimationFrame(raf);observer.disconnect();document.removeEventListener('visibilitychange',sync);reduce.removeEventListener('change',sync);photo.onload=photo.onerror=null;if(gl){gl.deleteTexture(texture);gl.deleteBuffer(buffer);gl.deleteProgram(program);const ext=gl.getExtension('WEBGL_lose_context');if(ext)ext.loseContext();}host.replaceChildren();}};
 }
 window.ArenaPortrait={create};
})();
