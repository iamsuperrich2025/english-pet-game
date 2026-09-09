/* Reusable little bushes, daisies, crates and fences. Decorations do not affect collision. */
(function(){
  'use strict';
  const F=window.Frontline,T=window.THREE;
  F.makeGarden=function(shapes,index){
    const root=new T.Group(),{part,ball,shadow}=shapes;
    function flower(x,y,z,scale=1){
      shapes.petals(root,[x,y,z],scale);
      ball(root,[.12*scale,.10*scale,.12*scale],[x,y+.06*scale,z],0xffd35b);
    }
    function leaves(x,z){for(let i=0;i<3;i++){
      const leaf=ball(root,[.1,.33,.085],[x+(i-1)*.13,.22,z],i===1?0x81b84d:0x9dce5e);leaf.rotation.z=(i-1)*-.5;
    }}
    if(index===0||index===4){
      shadow(root,2.7,2.1,-.055);
      for(const [x,y,z,r,c] of [[0,.58,0,.8,0x78b953],[-.56,.33,.25,.55,0x94cd5b],[.57,.4,.15,.61,0x85c24c],[.22,.86,-.07,.44,0xacdb69]])
        ball(root,[r,r*.82,r],[x,y,z],c);
      flower(-.25,1.13,.35,.85);if(index===4)flower(.65,.83,.22,.65);
    }else if(index===1){
      leaves(-.35,.15);leaves(.35,-.3);flower(0,.17,0,1);flower(.65,.16,.65,.7);
    }else if(index===2){
      shadow(root,1.65,1.5,-.055);
      part(root,[1.05,.96,1.05],[0,.44,0],0xd89b57,.09);
      for(const x of [-.4,.4])part(root,[.12,.88,.09],[x,.44,.57],0xf2bd78,.03);
      for(const y of [.08,.79])part(root,[.95,.12,.09],[0,y,.57],0xf3c17e,.03);
      const brace=part(root,[.12,1,.10],[0,.44,.59],0xf2bd78,.02);brace.rotation.z=-.73;
      for(const x of [-.32,0,.32])part(root,[.025,.03,1],[x,.94,0],0xbe8247,.008);
    }else if(index===3){
      shadow(root,2.9,1.1,-.055);
      for(const x of [-1,0,1])part(root,[.24,.95,.25],[x,.43,0],0xc58c51,.08);
      for(const y of [.28,.67])part(root,[2.25,.15,.15],[0,y,.06],0xe0ac65,.04);
      leaves(.65,.4);flower(-.8,.15,.48,.7);
    }else{
      shadow(root,2.8,2,-.055);
      part(root,[.27,.85,.27],[0,.3,0],0xc3904b,.07);
      part(root,[1.15,1.15,1.1],[0,1.14,0],0x80c653,.25);
      part(root,[.82,.84,.85],[1,.37,.56],0xffd57f,.15);leaves(-.72,.55);
    }
    root.traverse(mesh=>{if(mesh.isMesh&&!mesh.material.transparent)mesh.castShadow=mesh.receiveShadow=true;});
    return root;
  };
})();
