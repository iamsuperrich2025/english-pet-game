"""Original Soft Cuboid Chibi mecha, based on img/robots/robot_01..10.
Deterministic texture-free glTF 2.0; five articulated parts, <=10 draws.
Run: python tools/mecha/build_robots.py (requires numpy + scipy).
"""
from pathlib import Path
import json, math, struct
import numpy as np
from scipy.spatial import ConvexHull
ROOT=Path(__file__).resolve().parents[2]
OUT=ROOT/'img/models/mecha'
PALETTES=[
 ('Crimson Lancer','#ed303e','#ff8a12','lance'),
 ('Azure Artillery','#2786ce','#36dcff','cannons'),
 ('Jade Bastion','#749249','#63ffc0','missiles'),
 ('Golden Longshot','#edb52e','#65dfff','sniper'),
 ('Violet Dynamo','#7641cd','#32cfff','fists'),
 ('Ember Forge','#ec731e','#ffad29','flame'),
 ('Silver Sentinel','#d4dfe8','#ff464e','saw'),
 ('Amber Gatling','#ecaa25','#6dd4ff','gatling'),
 ('Cobalt Ranger','#3b4999','#35e9ff','rifle'),
 ('Frost Warden','#8cd5f3','#80f5ff','ice')]

def linear(h):
 v=[int(h[i:i+2],16)/255 for i in (1,3,5)]
 return [x/12.92 if x<=.04045 else ((x+.055)/1.055)**2.4 for x in v]
def mix(h,amount):
 v=[int(h[i:i+2],16) for i in (1,3,5)]
 return '#'+''.join('%02x'%round(x+(255-x)*amount) for x in v)
def rot(v,r):
 x,y,z=r
 Rx=np.array([[1,0,0],[0,math.cos(x),-math.sin(x)],[0,math.sin(x),math.cos(x)]])
 Ry=np.array([[math.cos(y),0,math.sin(y)],[0,1,0],[-math.sin(y),0,math.cos(y)]])
 Rz=np.array([[math.cos(z),-math.sin(z),0],[math.sin(z),math.cos(z),0],[0,0,1]])
 return np.asarray(v)@(Rz@Ry@Rx).T

class Robot:
 def __init__(self,index):
  self.index=index; self.name,self.color,self.glow,self.weapon=PALETTES[index-1]
  self.colors={'armor':self.color,'light':mix(self.color,.36),'dark':'#192333','joint':'#344558','metal':'#98a8b8','white':'#e5eff7','gold':'#ffc659','glow':self.glow}
  self.parts={'Body':(0,0,0),'Leg_L':(-.51,1.79,0),'Leg_R':(.51,1.79,0),'Arm_L':(-1.02,3.25,0),'Arm_R':(1.02,3.25,0)}
  self.groups={}; self.part='Body'
 def poly(self,points,color,center=(0,0,0),rotation=(0,0,0),smooth=None):
  points=rot(points,rotation)+np.array(center); hull=ConvexHull(points)
  target=self.groups.setdefault((self.part,color=='glow'),{'p':[],'n':[],'c':[],'i':[]})
  rgb=[round(x*255) for x in linear(self.colors.get(color,color))]+[255]
  # Weld coplanar face vertices; keep bevel normals sharp and readable.
  lookup={}
  origin=np.array(self.parts[self.part])
  for tri,equation in zip(hull.simplices,hull.equations):
   p=points[tri]; n=equation[:3]
   if np.dot(np.cross(p[1]-p[0],p[2]-p[0]),n)<0: p=p[[0,2,1]]
   for vertex in p:
    normal=rot([smooth(vertex-np.array(center))],rotation)[0] if smooth else n
    vertex=vertex-origin; key=tuple(np.round(np.r_[vertex,normal],6))
    if key not in lookup:
     lookup[key]=len(target['p']); target['p'].append(vertex.tolist()); target['n'].append(normal.tolist()); target['c'].append(rgb)
    target['i'].append(lookup[key])
 def box(self,c,size,color='armor',b=.07,r=(0,0,0)):
  half=np.array(size)/2; b=min(b*1.5,min(half)*.78); inner=half-b; pts=[]
  for sx in (-1,1):
   for sy in (-1,1):
    for sz in (-1,1):
     for j in range(3):
      lat=j*math.pi/4
      for i in range(3):
       lon=i*math.pi/4
       n=np.array([math.cos(lat)*math.cos(lon),math.sin(lat),math.cos(lat)*math.sin(lon)])
       pts.append((inner+b*n)*np.array([sx,sy,sz]))
  pts=np.unique(np.round(pts,8),axis=0)
  # Inverse rotation before projecting onto the unrounded core.
  matrix=rot(np.eye(3),r)
  def normal(v):
   q=v@matrix.T; n=q-np.clip(q,-inner,inner); return n/(np.linalg.norm(n) or 1)
  self.poly(pts,color,c,r,smooth=normal)
 def cyl(self,c,radius,length,color='joint',axis='z',sides=10):
  pts=[]
  for z in (-length/2,length/2):
   for i in range(sides):
    a=i*2*math.pi/sides; p=(math.cos(a)*radius,math.sin(a)*radius,z)
    if axis=='x':p=(p[2],p[0],p[1])
    if axis=='y':p=(p[0],p[2],p[1])
    pts.append(p)
  self.poly(pts,color,c)
 def blade(self,c,size,color='glow',r=(0,0,0)):
  x,y,z=np.array(size)/2
  self.poly([(-x,-y,0),(x,-y,0),(0,y,0),(0,-y,z),(0,-y,-z)],color,c,r)
 def build(self):
  # Short broad legs, layered knee/shin armor and three toe plates.
  for sign,part in [(-1,'Leg_L'),(1,'Leg_R')]:
   self.part=part; x=sign*.51
   self.cyl((x,1.68,0),.25,.42,'joint','x')
   self.box((x,1.43,0),(.54,.57,.57),'dark')
   self.box((x,1.45,-.28),(.52,.44,.18),'armor')
   self.cyl((x,1.09,0),.22,.61,'metal','x')
   self.box((x,1.04,-.29),(.58,.4,.25),'light',r=(0,0,sign*.1))
   self.box((x,.68,0),(.61,.68,.63),'dark')
   self.box((x,.69,-.31),(.57,.55,.24),'armor',b=.09)
   self.box((x,.74,-.446),(.13,.27,.04),'glow',b=.012)
   self.box((x,.22,-.14),(.79,.44,1.02),'dark',b=.09)
   self.box((x,.34,-.43),(.68,.28,.51),'armor',b=.08)
   for dx in (-.21,0,.21): self.box((x+dx,.15,-.63),(.19,.19,.2),'metal',b=.035)
  self.part='Body'
  self.box((0,1.87,0),(1.22,.43,.72),'dark')
  self.box((0,1.96,-.41),(.46,.37,.21),'metal')
  self.box((0,1.99,-.54),(.26,.16,.055),'glow',b=.02)
  for sign in (-1,1):
   self.box((sign*.53,1.85,-.42),(.43,.43,.2),'armor',r=(0,sign*.16,sign*.12))
  self.box((0,2.25,0),(.83,.55,.63),'joint')
  for y in (2.16,2.34):self.box((0,y,-.36),(.66,.09,.09),'metal',b=.02)
  self.box((0,2.83,0),(1.48,1.04,.87),'dark',b=.16)
  for sign in (-1,1):
   self.box((sign*.46,3.07,-.35),(.76,.43,.38),'armor',b=.09,r=(0,-sign*.1,-sign*.18))
   self.box((sign*.49,3.18,-.56),(.42,.065,.045),'light',b=.015,r=(0,0,-sign*.18))
   self.box((sign*.56,2.67,-.36),(.43,.29,.28),'armor',r=(0,0,sign*.25))
  self.cyl((0,2.91,-.51),.305,.17,'metal',sides=6)
  self.cyl((0,2.91,-.61),.235,.09,'glow',sides=6)
  self.cyl((0,2.91,-.66),.135,.03,'white',sides=6)
  self.box((0,3.44,0),(.5,.25,.46),'joint')
  head_start={k:len(g['p']) for k,g in self.groups.items()}
  # Big chamfered helmet, recessed face, angular friendly luminous eyes.
  self.box((0,3.99,.015),(1.18,1.0,.93),'dark',b=.16)
  self.box((0,4.36,.06),(1.09,.34,.86),'armor',b=.11)
  for sign in (-1,1):
   self.box((sign*.48,4.04,-.09),(.29,.72,.8),'armor',b=.08,r=(0,0,sign*.06))
   self.box((sign*.43,3.76,-.44),(.25,.38,.19),'light',b=.06,r=(0,0,-sign*.2))
   # Convex triangular eyes, with large dark face around them.
   self.poly([(sign*.08,4.075,-.514),(sign*.39,4.16,-.5),(sign*.35,3.99,-.535),(sign*.08,4.075,-.55)],'glow')
   self.box((sign*.56,4.05,0),(.18,.33,.37),'metal',b=.04)
  self.blade((0,4.22,-.48),(.22,.49,.2),'armor',r=(0,0,math.pi))
  self.box((0,3.75,-.47),(.31,.24,.14),'metal',b=.04)
  self.box((0,3.77,-.554),(.14,.035,.025),'dark',b=.005)
  # Distinct antenna profiles, softened tips.
  for s in (-1,1):
   horn_color='white' if self.index in (2,9,10) else 'armor'
   self.blade((s*.57,4.47,.01),(.25,.69,.22),horn_color,r=(0,0,-s*.37))
  self.box((0,4.47,.03),(.15,.21,.45),'light',b=.035)
  for k,g in self.groups.items():
   for i in range(head_start.get(k,0),len(g['p'])):
    x,y,z=g['p'][i];g['p'][i]=[x*1.22,3.47+(y-3.47)*1.12,z*1.10]
    n=np.array(g['n'][i])/np.array([1.22,1.12,1.10]);g['n'][i]=(n/np.linalg.norm(n)).tolist()
  # Backpack + visible turbine vents.
  self.box((0,2.94,.57),(.92,.84,.44),'joint')
  for s in (-1,1):
   self.cyl((s*.3,2.88,.87),.21,.24,'dark')
   self.cyl((s*.3,2.88,1.0),.13,.04,'glow')
  for s,part in [(-1,'Arm_L'),(1,'Arm_R')]:
   self.part=part; x=s*1.06
   self.cyl((x,3.22,0),.27,.36,'joint','x')
   self.box((s*1.12,3.3,0),(.73,.62,.79),'dark',b=.1,r=(0,0,-s*.15))
   self.box((s*1.13,3.48,-.02),(.76,.39,.8),'armor',b=.1,r=(0,0,-s*.15))
   self.box((s*1.18,3.43,-.44),(.39,.11,.055),'light',b=.02,r=(0,0,-s*.15))
   self.box((s*1.37,3.31,-.415),(.10,.19,.06),'metal',b=.025)
   self.box((s*1.13,3.54,.12),(.47,.08,.33),'light',b=.025,r=(0,0,-s*.15))
   self.box((s*1.21,2.91,0),(.44,.48,.49),'joint')
   self.cyl((s*1.27,2.69,0),.19,.5,'metal','x')
   self.box((s*1.3,2.43,0),(.59,.59,.67),'dark',b=.08)
   self.box((s*1.3,2.5,-.32),(.57,.43,.18),'armor',b=.065)
   self.box((s*1.31,2.59,-.423),(.32,.06,.025),'light',b=.014)
   self.cyl((s*1.34,2.48,-.432),.072,.025,'glow',sides=6)
   self.box((s*1.31,2.09,-.02),(.49,.35,.49),'joint',b=.065)
   for dx in (-.14,0,.14):self.box((s*1.31+dx,2.1,-.28),(.115,.18,.12),'metal',b=.025)
  self.gear()
  # Compress the lower body into chibi proportions, feet stay at y=0.
  for (part,_),g in self.groups.items():
   for i,p in enumerate(g['p']):
    x,y,z=np.array(p)+np.array(self.parts[part])
    y=y*.81 if y<1.79 else y-.3401
    g['p'][i]=[x,y,z]
   if part.startswith('Leg'):
    for i,n in enumerate(g['n']):
     n=np.array(n)/[1,.81,1];g['n'][i]=(n/np.linalg.norm(n)).tolist()
  for part,origin in list(self.parts.items()):
   self.parts[part]=(origin[0],origin[1]*.81 if origin[1]<1.79 else origin[1]-.3401,origin[2])
  for (part,_),g in self.groups.items():
   g['p']=(np.array(g['p'])-np.array(self.parts[part])).tolist()
  return self
 def gear(self):
  w=self.weapon
  self.part='Arm_R'
  if w=='lance':
   self.cyl((1.31,1.74,-.32),.085,1.23,'dark','y')
   self.box((1.31,1.35,-.32),(.49,.13,.24),'gold',b=.035)
   self.blade((1.31,.8,-.32),(.29,.94,.16),'glow',r=(0,0,math.pi))
   self.blade((1.31,.84,-.42),(.1,.77,.035),'white',r=(0,0,math.pi))
  elif w in ('cannons','missiles'):
   self.part='Body'
   for s in (-1,1):
    self.box((s*.85,3.68,.38),(.4,.39,.39),'joint')
    if w=='cannons':
     self.cyl((s*.91,3.88,-.05),.245,1.35,'armor')
     for z in (-.57,-.28,.29):self.cyl((s*.91,3.88,z),.275,.095,'metal')
     self.cyl((s*.91,3.88,-.74),.21,.08,'dark')
     self.cyl((s*.91,3.88,-.79),.14,.035,'glow')
    else:
     self.box((s*.92,3.96,.22),(.62,.6,.57),'dark',b=.06)
     for dx in (-.16,0,.16):
      for dy in (-.16,0,.16):self.cyl((s*.92+dx,3.96+dy,-.075),.057,.08,'#ec4c48',sides=6)
  elif w=='sniper':
   self.box((1.35,2.14,-.64),(.28,.34,1.03),'dark')
   self.box((1.35,2.31,-.84),(.3,.13,.95),'gold',b=.025)
   self.cyl((1.35,2.16,-1.49),.09,.92,'metal')
   for z in (-1.13,-1.36,-1.59):self.cyl((1.35,2.16,z),.115,.055,'gold')
   self.cyl((1.35,2.16,-1.95),.115,.19,'armor')
   self.cyl((1.35,2.16,-2.06),.065,.03,'glow')
   self.cyl((1.35,2.49,-.73),.09,.42,'dark')
   self.cyl((1.35,2.49,-.96),.06,.025,'glow')
  elif w in ('fists','saw'):
   for s,part in [(-1,'Arm_L'),(1,'Arm_R')]:
    self.part=part
    self.box((s*1.32,2.19,-.16),(.78,.69,.87),'armor' if w=='fists' else 'metal',b=.12)
    self.cyl((s*1.32,2.21,-.64),.28,.11,'dark')
    self.cyl((s*1.32,2.21,-.71),.19,.04,'glow')
    if w=='saw':
     for j in range(8):
      a=j*math.pi/4; self.blade((s*1.32+math.cos(a)*.31,2.21+math.sin(a)*.31,-.66),(.14,.22,.10),'white',r=(0,0,a-math.pi/2))
    for dx in (-.24,0,.24):self.box((s*1.32+dx,2.43,-.63),(.14,.13,.09),'glow',b=.025)
  elif w=='flame':
   self.cyl((1.3,2.16,-.51),.21,.93,'dark')
   self.cyl((1.3,2.16,-.94),.25,.25,'metal')
   for z in (-.49,-.64,-.79):self.cyl((1.3,2.16,z),.23,.065,'armor')
   self.cyl((1.3,2.16,-1.08),.16,.03,'glow')
   self.part='Body'
   for s in (-1,1):
    self.cyl((s*.41,3.02,.89),.22,.91,'armor','y')
    self.cyl((s*.41,3.45,.89),.24,.12,'metal','y')
  elif w=='gatling':
   self.box((1.27,2.16,-.53),(.69,.58,.81),'dark',b=.09)
   self.cyl((1.27,2.16,-.94),.35,.2,'metal')
   for i in range(6):
    a=i*math.pi/3; x=1.27+.22*math.cos(a); y=2.16+.22*math.sin(a)
    self.cyl((x,y,-1.23),.07,.65,'joint',sides=8)
    self.cyl((x,y,-1.57),.046,.025,'glow',sides=8)
   self.cyl((1.27,2.16,-1.38),.34,.11,'armor')
  elif w=='rifle':
   self.box((1.31,2.22,-.64),(.33,.39,.86),'metal')
   self.box((1.31,2.25,-1.17),(.2,.24,.67),'armor')
   for z in (-.98,-1.17,-1.36):self.box((1.31,2.25,z),(.26,.29,.075),'white',b=.023)
   self.box((1.31,2.3,-1.18),(.09,.085,.63),'glow',b=.02)
   self.blade((1.31,2.2,-1.79),(.12,.46,.12),'glow',r=(math.pi/2,0,0))
  elif w=='ice':
   self.cyl((1.31,2.23,-.56),.23,.81,'white',sides=6)
   self.cyl((1.31,2.23,-.99),.17,.05,'glow',sides=6)
   for j in range(4):
    a=j*math.pi/2;self.blade((1.31+math.cos(a)*.2,2.23+math.sin(a)*.2,-.59),(.13,.35,.14),'light',r=(math.pi/2,0,a))
   self.part='Body'
   for s in (-1,1):
    for j in range(3):self.blade((s*(.84+j*.23),3.7-j*.11,.21),(.22,.5,.24),'light',r=(0,0,-s*(.28+j*.22)))
 def save(self):
  doc={'asset':{'version':'2.0','generator':'Vocab World original Soft Cuboid Chibi builder'},'extensionsUsed':['KHR_mesh_quantization'],'extensionsRequired':['KHR_mesh_quantization'],'scene':0,'scenes':[{'nodes':[0]}], 'nodes':[{'name':f'robot_{self.index:02d}','children':[1,2,3,4,5],'extras':{'robotId':f'robot_{self.index:02d}','playerStyle':'soft-cuboid-chibi-3d','forward':'-Z'}}], 'meshes':[], 'accessors':[], 'bufferViews':[], 'materials':[{'name':'Painted alloy','pbrMetallicRoughness':{'baseColorFactor':[1,1,1,1],'metallicFactor':.48,'roughnessFactor':.32}}, {'name':'Energy','pbrMetallicRoughness':{'baseColorFactor':[1,1,1,1],'metallicFactor':.15,'roughnessFactor':.28},'emissiveFactor':linear(self.glow)}]}
  binary=bytearray(); triangles=0
  def acc(data,dtype,kind,target=None,bounds=False,normalized=False,stride=None):
   nonlocal binary
   a=np.asarray(data,dtype=dtype); binary.extend(b'\0'*((-len(binary))%4)); offset=len(binary); binary.extend(a.tobytes())
   view={'buffer':0,'byteOffset':offset,'byteLength':a.nbytes}
   if target:view['target']=target
   if stride:view['byteStride']=stride
   doc['bufferViews'].append(view)
   component={'<f4':5126,'<u2':5123,'|u1':5121,'<i2':5122}[np.dtype(dtype).str]
   entry={'bufferView':len(doc['bufferViews'])-1,'componentType':component,'count':len(a),'type':kind}
   if bounds:entry.update(min=np.atleast_1d(a.min(axis=0)).tolist(),max=np.atleast_1d(a.max(axis=0)).tolist())
   if normalized:entry['normalized']=True
   doc['accessors'].append(entry);return len(doc['accessors'])-1
  for part,origin in self.parts.items():
   primitives=[]
   for (pn,glow),g in self.groups.items():
    if pn!=part:continue
    assert len(g['p'])<65536
    primitives.append({'attributes':{'POSITION':acc(g['p'],'<f4','VEC3',34962,True),'NORMAL':acc(np.c_[np.rint(np.array(g['n'])*32767),np.zeros(len(g['n']))],'<i2','VEC3',34962,normalized=True,stride=8),'COLOR_0':acc(g['c'],'u1','VEC4',34962,normalized=True)},'indices':acc(g['i'],'<u2','SCALAR',34963),'material':int(glow)})
    triangles+=len(g['i'])//3
   doc['meshes'].append({'name':part,'primitives':primitives});doc['nodes'].append({'name':part,'mesh':len(doc['meshes'])-1,'translation':list(origin)})
  # Portable clips for external GLB viewers; game animates the same four pivots.
  doc['animations']=[]
  for name,duration,amplitude in [('Idle',2.4,.025),('Walk',.85,.38),('Attack',.6,.65)]:
   samplers=[];channels=[];times=np.linspace(0,duration,9).tolist(); tacc=acc(times,'<f4','SCALAR',bounds=True)
   for node in range(2,6):
    vals=[]
    for t in times:
     angle=math.sin(t/duration*math.pi*2)*amplitude*(1 if node in (2,5) else -1)
     if name=='Attack':angle=(-math.sin(t/duration*math.pi)*amplitude if node==5 else 0)
     vals.append([math.sin(angle/2),0,0,math.cos(angle/2)])
    samplers.append({'input':tacc,'output':acc(vals,'<f4','VEC4'),'interpolation':'LINEAR'});channels.append({'sampler':len(samplers)-1,'target':{'node':node,'path':'rotation'}})
   doc['animations'].append({'name':name,'samplers':samplers,'channels':channels})
  binary.extend(b'\0'*((-len(binary))%4));doc['buffers']=[{'byteLength':len(binary)}]
  js=json.dumps(doc,separators=(',',':')).encode();js+=b' '*((-len(js))%4)
  data=struct.pack('<III',0x46546c67,2,28+len(js)+len(binary))+struct.pack('<I4s',len(js),b'JSON')+js+struct.pack('<I4s',len(binary),b'BIN\0')+binary
  OUT.mkdir(parents=True,exist_ok=True);path=OUT/f'robot_{self.index:02d}.glb';path.write_bytes(data)
  return {'id':path.stem,'name':self.name,'weapon':self.weapon,'bytes':len(data),'triangles':triangles,'draws':sum(len(m['primitives']) for m in doc['meshes']),'textures':0}

if __name__=='__main__':
 report=[Robot(i).build().save() for i in range(1,11)]
 (OUT/'manifest.json').write_text(json.dumps({'style':'soft-cuboid-chibi-3d','forward':'-Z','heightMeters':4.61,'robots':report},indent=2)+'\n')
 print(json.dumps(report,indent=2))
