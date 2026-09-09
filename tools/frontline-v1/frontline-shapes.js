/* Shared cute toy-tank GLB plus lightweight procedural vault, pickup, bomb, and terrain geometry. */
(function () {
  'use strict';
  const F=window.Frontline,T=window.THREE;
  F.makeShapes=function(){
    const geometries=new Map(),materials=new Map(),tankRoots=new Set(),modelGeometries=new Set(),modelMaterials=new Set();
    let tankTemplate=null,disposed=false;
    function material(color){
      if(!materials.has(color))materials.set(color,new T.MeshLambertMaterial({color:new T.Color(color).convertSRGBToLinear()}));
      return materials.get(color);
    }
    function box(w,h,d,radius=.12){
      const key=[w,h,d,radius].join(':');if(geometries.has(key))return geometries.get(key);
      const g=new T.BoxGeometry(w,h,d,2,2,2),p=g.attributes.position;
      const q=new T.Vector3(),core=new T.Vector3(),delta=new T.Vector3();
      radius=Math.min(radius,w/3,h/3,d/3);
      for(let i=0;i<p.count;i++){
        q.fromBufferAttribute(p,i);
        core.set(Math.max(-w/2+radius,Math.min(w/2-radius,q.x)),
          Math.max(-h/2+radius,Math.min(h/2-radius,q.y)),
          Math.max(-d/2+radius,Math.min(d/2-radius,q.z)));
        delta.copy(q).sub(core).normalize().multiplyScalar(radius).add(core);
        p.setXYZ(i,delta.x,delta.y,delta.z);
      }
      g.computeVertexNormals();geometries.set(key,g);return g;
    }
    function part(parent,size,pos,color,radius){
      const mesh=new T.Mesh(box(...size,radius),material(color));mesh.position.set(...pos);parent.add(mesh);return mesh;
    }
    function ball(parent,size,pos,color){
      if(!geometries.has('soft-ball'))geometries.set('soft-ball',new T.SphereGeometry(1,10,7));
      const mesh=new T.Mesh(geometries.get('soft-ball'),material(color));mesh.scale.set(...size);mesh.position.set(...pos);parent.add(mesh);return mesh;
    }
    function shadow(parent,width,depth,y=.14){
      if(!geometries.has('shadow'))geometries.set('shadow',new T.PlaneGeometry(1,1));
      if(!materials.has('shadow'))materials.set('shadow',new T.ShaderMaterial({transparent:true,depthWrite:false,
        vertexShader:'varying vec2 v;void main(){v=uv-.5;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}',
        fragmentShader:'varying vec2 v;void main(){float a=(1.0-smoothstep(.12,.5,length(v)))*.24;gl_FragColor=vec4(.08,.19,.08,a);}'}));
      const mesh=new T.Mesh(geometries.get('shadow'),materials.get('shadow'));mesh.rotation.x=-Math.PI/2;
      mesh.scale.set(width,depth,1);mesh.position.set(.28,y,.24);parent.add(mesh);return mesh;
    }
    function petals(parent,pos,scale=1){
      if(!geometries.has('petals')){
        const sphere=new T.SphereGeometry(1,8,6),unit=sphere.toNonIndexed(),positions=[],normals=[];sphere.dispose();
        for(let i=0;i<5;i++){
          const angle=i*Math.PI*2/5,g=unit.clone().scale(.16,.09,.16).translate(Math.cos(angle)*.18,0,Math.sin(angle)*.18);
          positions.push(...g.attributes.position.array);normals.push(...g.attributes.normal.array);g.dispose();
        }
        unit.dispose();const g=new T.BufferGeometry();
        g.setAttribute('position',new T.Float32BufferAttribute(positions,3));g.setAttribute('normal',new T.Float32BufferAttribute(normals,3));
        g.computeBoundingSphere();geometries.set('petals',g);
      }
      const mesh=new T.Mesh(geometries.get('petals'),material(0xfffff0));mesh.position.set(...pos);mesh.scale.setScalar(scale);parent.add(mesh);return mesh;
    }
    function attachTankModel(root){
      if(!tankTemplate||root.userData.model||disposed)return;
      if(root.userData.placeholder){root.remove(root.userData.placeholder);root.userData.placeholder=null;}
      const model=tankTemplate.clone(true);model.scale.setScalar(.96);root.add(model);
      root.userData.model=model;root.userData.modelReady=true;
    }
    new T.GLTFLoader().load('/frontline/assets/tank-cute.glb',gltf=>{
      if(disposed)return;tankTemplate=gltf.scene;
      tankTemplate.traverse(node=>{if(node.isMesh){node.frustumCulled=true;node.castShadow=node.receiveShadow=true;if(node.geometry)modelGeometries.add(node.geometry);
        for(const m of Array.isArray(node.material)?node.material:[node.material])if(m)modelMaterials.add(m);}});
      tankRoots.forEach(attachTankModel);
    },undefined,()=>{tankRoots.forEach(root=>root.userData.modelError=true);});
    function tank(slot){
      const root=new T.Group(),placeholder=new T.Group(),colors=[0x55a86e,0x55a8d2,0xe5ad3e,0xdc78a1,0xd65f55];
      shadow(root,4.1,4.6);
      part(placeholder,[2.15,.7,2.7],[0,.7,0],0x87964d,.22);part(placeholder,[1.35,.7,1.25],[0,1.35,-.1],0xa9b965,.24);
      part(placeholder,[.3,.3,1.65],[0,1.48,-1.35],0x53602f,.1);root.add(placeholder);
      let ring=geometries.get('team-ring');if(!ring){ring=new T.RingGeometry(1.38,1.58,28);geometries.set('team-ring',ring);}
      const marker=new T.Mesh(ring,material(colors[slot]||colors[4]));marker.rotation.x=-Math.PI/2;marker.position.y=.155;root.add(marker);
      const turret=new T.Group();root.add(turret);root.userData={placeholder,turret,model:null,modelReady:false};tankRoots.add(root);attachTankModel(root);return root;
    }
    function letter(){
      const root=new T.Group();ball(root,[.64,.13,.64],[0,.12,0],0x73af87);
      part(root,[.88,.88,.45],[0,.66,0],0xffcb64,.2);return root;
    }
    function bomb(){
      const root=new T.Group(),body=new T.Group();root.add(body);
      shadow(root,2.6,2.6,.09);
      ball(body,[.66,.66,.66],[0,.72,0],0x50566b);
      ball(body,[.20,.04,.16],[-.20,1.31,-.08],0x8d96a1);
      ball(body,[.30,.04,.30],[0,1.28,.30],0xffe7b7);
      for(const x of [-.12,.12])ball(body,[.072,.046,.08],[x,1.33,.29],0x50566b);
      for(const x of [-.10,.10])part(body,[.09,.07,.13],[x,1.31,.58],0xffe7b7,.025);
      ball(body,[.24,.12,.24],[.10,1.36,-.22],0x747b86);
      const fuse=part(body,[.13,.48,.13],[.13,1.61,-.25],0xffd092,.045);fuse.rotation.z=-.18;
      ball(body,[.12,.14,.12],[.17,1.85,-.25],0xff8a40);ball(body,[.075,.12,.075],[.17,1.94,-.25],0xfff5bf);
      if(!geometries.has('warning-ring'))geometries.set('warning-ring',new T.RingGeometry(.96,1,40));
      if(!materials.has('warning'))materials.set('warning',new T.ShaderMaterial({transparent:true,depthWrite:false,
        vertexShader:'varying vec2 v;void main(){v=position.xy;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}',
        fragmentShader:'varying vec2 v;void main(){if(fract(atan(v.y,v.x)*3.1831)<.27)discard;gl_FragColor=vec4(1.0,1.0,.83,.85);}'}));
      const warning=new T.Mesh(geometries.get('warning-ring'),materials.get('warning'));warning.rotation.x=-Math.PI/2;warning.position.y=.035;
      warning.scale.setScalar(F.C.bombRadius);root.add(warning);root.userData={body,warning};return root;
    }
    function base(slot){
      const root=new T.Group(),colors=[0x66ad6f,0x64afd0,0xe2ad46,0xd97da1],color=colors[slot],damage=[];
      part(root,[7.2,.18,7.2],[0,.02,0],0xa4c18a,.08);part(root,[2.1,.65,2.1],[0,.4,0],color,.18);
      part(root,[1.6,.12,.22],[0,.79,0],0xffeac2,.05);
      for(const spec of [[[6.8,1,.5],[0,.55,-3.35]],[[6.8,1,.5],[0,.55,3.35]],
        [[.5,1,6.2],[-3.35,.55,0]],[[.5,1,6.2],[3.35,.55,0]]])damage.push(part(root,spec[0],spec[1],color,.16));
      for(const x of [-3.25,3.25])for(const z of [-3.25,3.25]){
        damage.push(part(root,[.9,1.55,.9],[x,.8,z],color,.25));
        damage.push(ball(root,[.58,.22,.58],[x,1.64,z],0xffe8b5));
      }
      damage.push(part(root,[.12,1.7,.12],[-3.25,2.4,-3.25],0xf5d99b,.04));
      damage.push(part(root,[.9,.48,.1],[-2.78,2.9,-3.25],color,.06));
      root.userData.damageParts=damage;return root;
    }
    return{part,ball,shadow,petals,tank,letter,bomb,base,get tankModelReady(){return !!tankTemplate;},dispose(){
      disposed=true;tankRoots.clear();geometries.forEach(g=>g.dispose());materials.forEach(m=>m.dispose());
      modelGeometries.forEach(g=>g.dispose());modelMaterials.forEach(m=>m.dispose());
    }};
  };
})();
