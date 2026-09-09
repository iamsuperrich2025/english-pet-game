/* Continuous painted grass and dirt lanes, with no image textures and soft received shadows. */
(function(){
  'use strict';
  const F=window.Frontline,T=window.THREE;
  F.makeMeadow=function(){
    const color=hex=>new T.Color(hex).convertSRGBToLinear(),material=new T.MeshLambertMaterial({color:0xffffff});
    material.onBeforeCompile=shader=>{
      Object.assign(shader.uniforms,{grassA:{value:color(0x99d160)},grassB:{value:color(0xbde87b)},dirt:{value:color(0xffdda0)},
        arena:{value:new T.Vector2(F.C.halfX,F.C.halfZ)},waterA:{value:color(0x86cbd0)},waterB:{value:color(0xb1e4df)}});
      shader.vertexShader='varying vec2 field;\n'+shader.vertexShader.replace('#include <begin_vertex>',
        '#include <begin_vertex>\nfield=(modelMatrix*vec4(position,1.0)).xz;');
      shader.fragmentShader=`varying vec2 field;uniform vec3 grassA;uniform vec3 grassB;uniform vec3 dirt;
        uniform vec2 arena;uniform vec3 waterA;uniform vec3 waterB;
        float fieldHash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
        float fieldNoise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.0-2.0*f);
          return mix(mix(fieldHash(i),fieldHash(i+vec2(1,0)),f.x),mix(fieldHash(i+vec2(0,1)),fieldHash(i+vec2(1,1)),f.x),f.y);}
        `+shader.fragmentShader.replace('#include <color_fragment>',`
          float cloud=fieldNoise(field*.25)*.7+fieldNoise(field*.7)*.3;
          vec3 c=mix(grassA,grassB,cloud);
          vec2 cell=floor(field*1.3),dotp=fract(field*1.3)-.5;
          float spot=(1.0-smoothstep(.12,.26,length(dotp)))*step(.57,fieldHash(cell+17.0));
          c=mix(c,grassB,spot*.23);
          vec2 lanes=abs(mod(field+18.0,36.0)-18.0);
          float edge=min(lanes.x+.06*sin(field.y*7.0),lanes.y+.06*sin(field.x*7.0));
          float road=1.0-smoothstep(1.48,1.65,edge);
          vec3 pathColor=dirt*(.98+.045*fieldNoise(field*1.8));
          float pebble=(1.0-smoothstep(.13,.26,length(dotp*vec2(1.0,1.5))))*step(.70,fieldHash(cell));
          pathColor*=1.0-pebble*.10;
          vec3 ground=mix(c,pathColor,road);
          float inland=min(arena.x-abs(field.x),arena.y-abs(field.y));
          float shore=1.0-smoothstep(.1,1.05,inland),water=1.0-smoothstep(-.55,.12,inland);
          float ripple=smoothstep(.55,.92,sin(field.x*1.15+field.y*.8)*.5+.5);
          vec3 outside=mix(waterA,waterB,.3+cloud*.35+ripple*.2);
          ground=mix(ground,dirt,shore*.92);ground=mix(ground,outside,water);
          diffuseColor.rgb*=ground*.65;`);
    };
    const geometry=new T.PlaneGeometry(F.C.chunkSize,F.C.chunkSize);
    return{tile(){const mesh=new T.Mesh(geometry,material);mesh.rotation.x=-Math.PI/2;mesh.position.y=-.08;mesh.receiveShadow=true;return mesh;},
      dispose(){geometry.dispose();material.dispose();}};
  };
})();
