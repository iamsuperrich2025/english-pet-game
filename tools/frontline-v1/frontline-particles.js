/* Shared texture-free shapes for the shell, smoke, golden stars and toy debris. */
(function(){
  'use strict';
  const F=window.Frontline,T=window.THREE;
  F.makeParticleShapes=function(){
    const resources=[],materials=[];
    const keep=g=>(resources.push(g),g),color=hex=>new T.Color(hex).convertSRGBToLinear();
    function mat(hex,opacity=1,glow=false,lit=false){
      const options={color:color(hex),transparent:true,opacity,depthWrite:false,
        blending:glow?T.AdditiveBlending:T.NormalBlending};
      const m=lit?new T.MeshLambertMaterial(options):new T.MeshBasicMaterial(options);materials.push(m);return m;
    }
    function star(points,inner){
      const s=new T.Shape();for(let i=0;i<points*2;i++){
        const a=i*Math.PI/points,r=i%2?inner:1,x=Math.cos(a)*r,y=Math.sin(a)*r;
        if(i)s.lineTo(x,y);else s.moveTo(x,y);
      }s.closePath();return keep(new T.ShapeGeometry(s).rotateX(-Math.PI/2));
    }
    // Merge a brass cartridge, dark body and orange nose into one colored draw call.
    const positions=[],normals=[],colors=[];
    function piece(g,hex,z=0){
      g.rotateX(-Math.PI/2);g.translate(0,0,z);const flat=g.toNonIndexed(),p=flat.attributes.position,n=flat.attributes.normal,c=color(hex);
      for(let i=0;i<p.count;i++){positions.push(p.getX(i),p.getY(i),p.getZ(i));normals.push(n.getX(i),n.getY(i),n.getZ(i));colors.push(c.r,c.g,c.b);}
      g.dispose();flat.dispose();
    }
    piece(new T.CylinderGeometry(.20,.20,.64,10),0x61574a);
    piece(new T.CylinderGeometry(.225,.225,.14,10),0xffcf69,.32);
    piece(new T.ConeGeometry(.20,.34,10),0xff9b45,-.48);
    const shell=keep(new T.BufferGeometry());shell.setAttribute('position',new T.Float32BufferAttribute(positions,3));
    shell.setAttribute('normal',new T.Float32BufferAttribute(normals,3));shell.setAttribute('color',new T.Float32BufferAttribute(colors,3));
    const shellMaterial=mat(0xffffff,1,false,true);shellMaterial.vertexColors=true;
    function glowMaterial(){const m=new T.ShaderMaterial({transparent:true,depthWrite:false,blending:T.AdditiveBlending,
      uniforms:{strength:{value:.3}},vertexShader:'varying vec2 v;void main(){v=uv-.5;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}',
      fragmentShader:'varying vec2 v;uniform float strength;void main(){float a=pow(max(0.0,1.0-length(v)*2.0),2.0)*strength;gl_FragColor=vec4(1.0,.55,.06,a);}'});materials.push(m);return m;}
    return{shell,shellMaterial,color,mat,glowMaterial,glow:keep(new T.PlaneGeometry(1,1).rotateX(-Math.PI/2)),ball:keep(new T.SphereGeometry(1,12,8)),star:star(8,.38),spark:star(4,.22),
      debris:keep(new T.BoxGeometry(1,1,1)),ring:keep(new T.RingGeometry(.96,1,40).rotateX(-Math.PI/2)),
      dispose(){resources.forEach(g=>g.dispose());materials.forEach(m=>m.dispose());}};
  };
})();
