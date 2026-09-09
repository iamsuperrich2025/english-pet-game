"""Build the lightweight, texture-free Frontline cute toy tank GLB."""
from pathlib import Path
import json, math, struct

OUT = Path(__file__).with_name('assets') / 'tank-cute.glb'
MATERIALS = [
    ('olive_body', '#89b842'), ('olive_light', '#b6d75d'), ('olive_dark', '#587b38'),
    ('tracks', '#526166'), ('wheel', '#899d58'), ('hub', '#dde5d6'),
    ('leather', '#9a6540'), ('leather_light', '#d09259'), ('face', '#29252d'),
    ('cheeks', '#ef8c86'), ('mouth', '#b94c54'), ('star', '#ffd765'), ('muzzle', '#24242a')
]
MAT = {name:i for i,(name,_) in enumerate(MATERIALS)}
groups = {i:{'p':[], 'n':[], 'i':[]} for i in range(len(MATERIALS))}

def norm(v):
    length=math.sqrt(sum(x*x for x in v)) or 1
    return tuple(x/length for x in v)

def cross(a,b):
    return (a[1]*b[2]-a[2]*b[1], a[2]*b[0]-a[0]*b[2], a[0]*b[1]-a[1]*b[0])

def sub(a,b): return tuple(x-y for x,y in zip(a,b))

def smooth_normals(pos, idx):
    out=[[0.0,0.0,0.0] for _ in pos]
    for k in range(0,len(idx),3):
        a,b,c=idx[k:k+3]; face=cross(sub(pos[b],pos[a]),sub(pos[c],pos[a]))
        for q in (a,b,c):
            out[q][0]+=face[0];out[q][1]+=face[1];out[q][2]+=face[2]
    return [norm(v) for v in out]

def add(material, pos, idx, normals=None):
    target=groups[MAT[material]]; base=len(target['p'])
    target['p'].extend(pos); target['n'].extend(normals or smooth_normals(pos,idx)); target['i'].extend(base+i for i in idx)

def sp(value, exponent):
    if abs(value)<1e-8:return 0.0
    return math.copysign(abs(value)**exponent,value)

def super_shape(material, center, half, exponent=.55, slices=16, stacks=8):
    cx,cy,cz=center; hx,hy,hz=half; pos=[]; idx=[]
    for j in range(stacks+1):
        lat=-math.pi/2+math.pi*j/stacks; ring=sp(math.cos(lat),exponent)
        for i in range(slices):
            lon=2*math.pi*i/slices
            pos.append((cx+hx*ring*sp(math.cos(lon),exponent),cy+hy*sp(math.sin(lat),exponent),cz+hz*ring*sp(math.sin(lon),exponent)))
    for j in range(stacks):
        for i in range(slices):
            a=j*slices+i;b=j*slices+(i+1)%slices;c=(j+1)*slices+i;d=(j+1)*slices+(i+1)%slices
            idx.extend((a,c,b,b,c,d))
    add(material,pos,idx)

def box(material, center, half):
    cx,cy,cz=center; hx,hy,hz=half; pos=[]; normals=[]; idx=[]
    faces=[((1,0,0),[(hx,-hy,-hz),(hx,hy,-hz),(hx,hy,hz),(hx,-hy,hz)]),
      ((-1,0,0),[(-hx,-hy,hz),(-hx,hy,hz),(-hx,hy,-hz),(-hx,-hy,-hz)]),
      ((0,1,0),[(-hx,hy,-hz),(-hx,hy,hz),(hx,hy,hz),(hx,hy,-hz)]),
      ((0,-1,0),[(-hx,-hy,hz),(-hx,-hy,-hz),(hx,-hy,-hz),(hx,-hy,hz)]),
      ((0,0,1),[(hx,-hy,hz),(hx,hy,hz),(-hx,hy,hz),(-hx,-hy,hz)]),
      ((0,0,-1),[(-hx,-hy,-hz),(-hx,hy,-hz),(hx,hy,-hz),(hx,-hy,-hz)])]
    for normal,verts in faces:
        base=len(pos);pos.extend((cx+x,cy+y,cz+z) for x,y,z in verts);normals.extend([normal]*4);idx.extend((base,base+1,base+2,base,base+2,base+3))
    add(material,pos,idx,normals)

def cylinder(material, center, radius, length, axis='z', sides=14):
    axes={'x':((1,0,0),(0,1,0),(0,0,1)),'y':((0,1,0),(1,0,0),(0,0,1)),'z':((0,0,1),(1,0,0),(0,1,0))}
    a,u,v=axes[axis];pos=[];normals=[];idx=[]
    def point(t,r,c,s):return tuple(center[k]+a[k]*t+u[k]*r*c+v[k]*r*s for k in range(3))
    for end in (-.5,.5):
        for i in range(sides):
            ang=2*math.pi*i/sides;c=math.cos(ang);s=math.sin(ang);pos.append(point(end*length,radius,c,s));normals.append(tuple(u[k]*c+v[k]*s for k in range(3)))
    for i in range(sides):
        n=(i+1)%sides;idx.extend((i,sides+i,n,n,sides+i,sides+n))
    for sign in (-1,1):
        center_i=len(pos);pos.append(point(sign*.5*length,0,0,0));normals.append(tuple(sign*x for x in a));ring=[]
        for i in range(sides):
            ang=2*math.pi*i/sides;ring.append(len(pos));pos.append(point(sign*.5*length,radius,math.cos(ang),math.sin(ang)));normals.append(tuple(sign*x for x in a))
        for i in range(sides):
            n=(i+1)%sides
            idx.extend((center_i,ring[n],ring[i]) if sign<0 else (center_i,ring[i],ring[n]))
    add(material,pos,idx,normals)

def star(material, center, outer=.25, inner=.11, height=.06):
    cx,cy,cz=center; ring=[]
    for i in range(10):
        angle=-math.pi/2+i*math.pi/5; radius=outer if i%2==0 else inner
        ring.append((cx+math.cos(angle)*radius,cz+math.sin(angle)*radius))
    pos=[];idx=[]
    for y in (cy-height/2,cy+height/2):pos.extend((x,y,z) for x,z in ring)
    bottom=len(pos);pos.append((cx,cy-height/2,cz));top=len(pos);pos.append((cx,cy+height/2,cz))
    for i in range(10):
        n=(i+1)%10;idx.extend((bottom,n,i,top,10+i,10+n,i,n,10+i,n,10+n,10+i))
    add(material,pos,idx)

# Soft tracks and tread plates.
for x in (-1.08,1.08):
    super_shape('tracks',(x,.46,0),(.42,.43,1.62),.42,16,8)
    outer=x+math.copysign(.43,x)
    for z in (-1.28,-.76,-.25,.26,.77,1.28):box('tracks',(outer,.48,z),(.07,.39,.20))
    for z in (-1.08,0,1.08):
        cylinder('wheel',(x+math.copysign(.43,x),.46,z),.34,.18,'x',14)
        cylinder('hub',(x+math.copysign(.54,x),.46,z),.15,.08,'x',12)

# Hull, fenders, turret, and cheerful face.
super_shape('olive_body',(0,.86,.02),(1.02,.48,1.34),.48,16,8)
super_shape('olive_light',(0,1.20,-.24),(.83,.29,.92),.48,16,8)
for x in (-1.04,1.04):super_shape('olive_dark',(x,1.02,-.05),(.22,.14,1.30),.48,12,6)
super_shape('olive_light',(0,1.66,-.03),(.77,.57,.70),.72,18,9)
super_shape('olive_dark',(0,2.12,.04),(.46,.24,.44),.82,16,7)
cylinder('olive_body',(0,1.76,-1.32),.16,1.78,'z',16)
cylinder('olive_dark',(0,1.76,-.61),.28,.34,'z',16)
cylinder('olive_dark',(0,1.76,-2.24),.26,.24,'z',16)
cylinder('muzzle',(0,1.76,-2.37),.17,.035,'z',16)
# Eyes, cheeks, smile and lamps on the forward face (-Z).
for x in (-.25,.25):super_shape('face',(x,1.78,-.70),(.075,.12,.045),1,12,6)
for x in (-.50,.50):super_shape('cheeks',(x,1.59,-.66),(.13,.075,.035),1,12,6)
super_shape('mouth',(0,1.56,-.705),(.17,.09,.035),1,12,6)
for x in (-.72,.72):super_shape('star',(x,1.11,-1.12),(.12,.12,.05),1,12,6)
# Rolled camping kit on the rear and a top star.
for y,z in ((1.03,1.30),(1.30,1.28),(1.17,1.52)):
    cylinder('leather',(0,y,z),.18,1.45,'x',12)
    for x in (-.76,.76):cylinder('leather_light',(x,y,z),.19,.06,'x',12)
# Top-facing expression stays readable from the gameplay camera.
for x in (-.23,.23):super_shape('face',(x,2.365,-.18),(.075,.035,.115),1,12,6)
for x in (-.47,.47):super_shape('cheeks',(x,2.355,-.02),(.12,.028,.075),1,12,6)
super_shape('mouth',(0,2.36,.10),(.15,.03,.065),1,12,6)
star('star',(.52,2.39,.29),.17,.075,.045)
star('star',(.53,1.50,-.90),.23,.10,.035)

# Build compact glTF 2.0 binary with one mesh and one primitive per material.
buffer=bytearray();views=[];accessors=[];primitives=[]
def align():
    while len(buffer)%4:buffer.append(0)
def add_view(data,target):
    align();offset=len(buffer);buffer.extend(data);views.append({'buffer':0,'byteOffset':offset,'byteLength':len(data),'target':target});return len(views)-1
def add_accessor(view,component,count,kind,minimum=None,maximum=None):
    item={'bufferView':view,'componentType':component,'count':count,'type':kind}
    if minimum is not None:item['min']=minimum;item['max']=maximum
    accessors.append(item);return len(accessors)-1
for material,group in groups.items():
    if not group['i']:continue
    flatp=[x for v in group['p'] for x in v];flatn=[x for v in group['n'] for x in v]
    pv=add_view(struct.pack('<%sf'%len(flatp),*flatp),34962);nv=add_view(struct.pack('<%sf'%len(flatn),*flatn),34962)
    iv=add_view(struct.pack('<%sH'%len(group['i']),*group['i']),34963)
    mins=[min(v[k] for v in group['p']) for k in range(3)];maxs=[max(v[k] for v in group['p']) for k in range(3)]
    pa=add_accessor(pv,5126,len(group['p']),'VEC3',mins,maxs);na=add_accessor(nv,5126,len(group['n']),'VEC3');ia=add_accessor(iv,5123,len(group['i']),'SCALAR')
    primitives.append({'attributes':{'POSITION':pa,'NORMAL':na},'indices':ia,'material':material,'mode':4})
def rgb(value):
    value=value.lstrip('#')
    # glTF material factors are linear RGB; authored palette colors are sRGB.
    def linear(channel):return channel/12.92 if channel<=.04045 else ((channel+.055)/1.055)**2.4
    return [linear(int(value[i:i+2],16)/255) for i in (0,2,4)]+[1]
gltf={'asset':{'version':'2.0','generator':'Vocab World Frontline procedural GLB builder'},'scene':0,
 'scenes':[{'nodes':[0]}],'nodes':[{'name':'Frontline_Cute_Toy_Tank','mesh':0}],
 'meshes':[{'name':'Cute_Toy_Tank','primitives':primitives}],
 'materials':[{'name':name,'pbrMetallicRoughness':{'baseColorFactor':rgb(color),'metallicFactor':0.0,'roughnessFactor':.72},'doubleSided':True} for name,color in MATERIALS],
 'buffers':[{'byteLength':len(buffer)}],'bufferViews':views,'accessors':accessors}
json_bytes=json.dumps(gltf,separators=(',',':')).encode()
while len(json_bytes)%4:json_bytes+=b' '
while len(buffer)%4:buffer.append(0)
total=12+8+len(json_bytes)+8+len(buffer)
glb=struct.pack('<4sII',b'glTF',2,total)+struct.pack('<I4s',len(json_bytes),b'JSON')+json_bytes+struct.pack('<I4s',len(buffer),b'BIN\0')+buffer
OUT.parent.mkdir(exist_ok=True);OUT.write_bytes(glb)
triangles=sum(len(g['i']) for g in groups.values())//3
vertices=sum(len(g['p']) for g in groups.values())
print(f'{OUT} {len(glb)} bytes, {vertices} vertices, {triangles} triangles, {len(primitives)} material primitives')
