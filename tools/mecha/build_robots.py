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
  self.colors={'armor':self.color,'light':mix(self.color,.36),'dark':'#192333','joint':'#344558','metal':'#98a8b8','white':'#e5eff7','gold':'#ffc659','glow':self.glow,'missile':'#ff434a','scope':'#b5a0ff'}
  self.parts={'Body':(0,0,0),'Leg_L':(-.51,1.79,0),'Leg_R':(.51,1.79,0),'Arm_L':(-1.02,3.25,0),'Arm_R':(1.02,3.25,0)}
  self.groups={}; self.part='Body'
 def poly(self,points,color,center=(0,0,0),rotation=(0,0,0),smooth=None):
  points=rot(points,rotation)+np.array(center); hull=ConvexHull(points)
  target=self.groups.setdefault((self.part,color in ('glow','eye','core','energyWhite','missile','scope')),{'p':[],'n':[],'c':[],'i':[]})
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
 def ellipsoid(self,c,size,color='armor',e=.75,r=(0,0,0),slices=16,stacks=10):
  half=np.array(size)/2;pts=[]
  for j in range(stacks+1):
   lat=-math.pi/2+math.pi*j/stacks
   for i in range(slices):
    lon=i*math.pi*2/slices;v=np.array([math.cos(lat)*math.cos(lon),math.sin(lat),math.cos(lat)*math.sin(lon)])
    pts.append(half*np.sign(v)*np.abs(v)**e)
  pts=np.unique(np.round(pts,8),axis=0);matrix=rot(np.eye(3),r);power=2/e
  def normal(v):
   v=(v@matrix.T)/half;n=np.sign(v)*np.abs(v)**(power-1)/half;return n/(np.linalg.norm(n) or 1)
  self.poly(pts,color,c,r,smooth=normal)
 def tube(self,c,radius,length,color='joint',axis='z',sides=20):
  # Rounded cylinder shoulders keep the toy finish readable at close range.
  lip=min(radius*.14,length*.18);points=[]
  for z,rad in [(-length/2,radius-lip),(-length/2+lip,radius),(length/2-lip,radius),(length/2,radius-lip)]:
   for i in range(sides):
    a=i*2*math.pi/sides;p=(math.cos(a)*rad,math.sin(a)*rad,z)
    if axis=='x':p=(p[2],p[0],p[1])
    if axis=='y':p=(p[0],p[2],p[1])
    points.append(p)
  def normal(v):
   q=np.array(v)
   if axis=='x':q=q[[1,2,0]]
   if axis=='y':q=q[[0,2,1]]
   radial=np.linalg.norm(q[:2]);n=np.array([q[0],q[1],0.]);n/=np.linalg.norm(n) or 1
   if abs(q[2])>length/2-lip*.5:n=np.array([0.,0.,np.sign(q[2])])
   elif abs(q[2])>length/2-lip*1.1:n=(n+np.array([0,0,np.sign(q[2])]))/math.sqrt(2)
   if axis=='x':n=n[[2,0,1]]
   if axis=='y':n=n[[0,2,1]]
   return n
  self.poly(points,color,c,smooth=normal)
 def snowflake(self,c,radius=.19,color='energyWhite'):
  for j in range(3):
   a=j*math.pi/3;self.box(c,(.026,radius*2,.028),color,b=.007,r=(0,0,a))
   for sign in (-1,1):
    x=c[0]+math.sin(-a)*radius*.7*sign;y=c[1]+math.cos(a)*radius*.7*sign
    for branch in (-1,1):self.box((x,y,c[2]),(.02,radius*.31,.025),color,b=.005,r=(0,0,a+branch*.8))
 def build(self):
  self.parts={'Body':(0,0,0),'Leg_L':(-.43,1.42,0),'Leg_R':(.43,1.42,0),'Arm_L':(-.91,2.59,0),'Arm_R':(.91,2.59,0)}
  self.colors.update(eye=['#42e8ff','#48e6ff','#70ffc6','#ffe25b','#e397ff','#ffdc56','#ff5f68','#ffe365','#48e3ff','#6dedff'][self.index-1],core=['#ffe56b','#77e9ff','#adffe4','#ffed7c','#f4b4ff','#ffe869','#ff727d','#aef3ff','#76eaff','#bdf8ff'][self.index-1],energyWhite='#eaffff',ink='#05131f')
  two_handed=self.index in (4,8,9)
  # Compact wide boots, soft shin shells, recessed knee joints.
  for sign,part in [(-1,'Leg_L'),(1,'Leg_R')]:
   self.part=part;x=sign*.43
   self.ellipsoid((x,1.31,0),(.46,.39,.49),'joint',e=1,slices=12,stacks=8)
   self.box((x,1.18,-.015),(.63,.54,.61),'armor',b=.12,r=(0,0,sign*.06))
   self.box((x,1.19,-.281),(.27,.20,.065),'light',b=.04)
   self.tube((x,.94,.0),.155,.55,'joint','x',16)
   self.box((x,.91,-.26),(.49,.32,.26),'metal',b=.075)
   self.box((x,.61,-.015),(.65,.64,.68),'armor',b=.13)
   self.box((x,.69,-.302),(.20,.17,.035),'core',b=.027)
   self.box((x,.18,-.13),(.80,.34,1.00),'joint',b=.10)
   self.box((x,.28,-.17),(.76,.49,.93),'armor',b=.13)
   self.box((x,.30,-.49),(.64,.24,.28),'light',b=.07)
   self.box((x,.195,-.624),(.42,.085,.065),'white',b=.025)
   for dx in (-.225,.225):self.box((x+dx,.18,-.593),(.085,.13,.10),'metal',b=.025)
  self.part='Body'
  self.ellipsoid((0,1.54,0),(1.03,.48,.70),'joint',e=.62,slices=16,stacks=8)
  self.box((0,1.6,-.39),(.42,.26,.14),'metal',b=.06)
  self.box((0,1.6,-.477),(.23,.13,.035),'core',b=.023)
  for sign in (-1,1):
   self.box((sign*.40,1.46,-.33),(.33,.35,.19),'armor',b=.07,r=(0,0,-sign*.12))
   self.box((sign*.54,1.51,.06),(.23,.30,.51),'light',b=.07,r=(0,0,-sign*.18))
  self.ellipsoid((0,1.90,0),(.88,.46,.66),'joint',e=.7,slices=16,stacks=8)
  for y in (1.79,1.94):self.box((0,y,-.375),(.56,.08,.08),'metal',b=.025)
  self.ellipsoid((0,2.28,0),(1.28,.79,.86),'dark',e=.7,slices=20,stacks=12)
  self.ellipsoid((0,2.32,-.15),(1.31,.67,.80),'armor',e=.64,slices=20,stacks=12)
  for sign in (-1,1):
   self.box((sign*.44,2.48,-.35),(.40,.22,.20),'light',b=.065,r=(0,-sign*.14,-sign*.13))
   self.box((sign*.43,2.11,-.37),(.33,.16,.17),'metal',b=.045,r=(0,0,sign*.12))
   self.box((sign*.44,2.44,-.479),(.12,.065,.025),'white',b=.014)
  self.cyl((0,2.28,-.566),.235,.12,'metal',sides=6)
  self.cyl((0,2.28,-.642),.177,.046,'core',sides=6)
  self.cyl((0,2.28,-.674),.115,.018,'energyWhite',sides=6)
  self.ellipsoid((0,2.72,0),(.54,.25,.48),'joint',e=.75,slices=16,stacks=8)
  # Oversized smooth helmet. Wide glossy visor and friendly upright oval eyes.
  self.ellipsoid((0,3.51,.06),(2.10,1.78,1.68),'armor',e=.78,slices=28,stacks=16)
  self.ellipsoid((0,3.22,-.60),(1.97,1.14,.54),'armor',e=.63,slices=24,stacks=12)
  self.ellipsoid((0,3.22,-.805),(1.72,.88,.22),'ink',e=.65,slices=24,stacks=12)
  self.ellipsoid((0,2.867,-.694),(1.30,.23,.36),'white',e=.64,slices=20,stacks=10)
  for sign in (-1,1):
   self.ellipsoid((sign*.43,3.215,-.925),(.25,.40,.063),'eye',e=.9,r=(0,0,-sign*.10),slices=16,stacks=10)
   self.ellipsoid((sign*.425,3.24,-.96),(.095,.24,.020),'energyWhite',e=1,slices=10,stacks=8)
   self.tube((sign*.96,3.49,.075),.34,.24,'metal','x',20)
   self.tube((sign*1.09,3.49,.075),.257,.058,'armor','x',20)
   self.tube((sign*1.128,3.49,.075),.176,.023,'joint','x',20)
   if self.index in (4,6):self.tube((sign*1.15,3.49,.075),.125,.023,'eye','x',20)
   self.ellipsoid((sign*.75,2.99,-.48),(.34,.30,.37),'armor',e=.76,slices=16,stacks=10)
   self.box((sign*.81,3.61,-.45),(.13,.35,.19),'light',b=.045,r=(0,0,-sign*.20))
  # Brow cap follows the dome; recessed central status jewel.
  self.poly([(x,y,z) for z in (-.74,-.89) for x,y in [(-.31,4.04),(.31,4.04),(.18,3.60),(-.18,3.60)]],'dark')
  self.box((0,4.18,-.44),(.70,.40,.67),'armor',b=.09,r=(-.40,0,0))
  for sign in (-1,1):
   self.box((sign*.59,3.89,-.64),(.42,.43,.15),'armor',b=.065,r=(-.35,-sign*.22,-sign*.23))
   self.box((sign*.78,3.79,-.637),(.028,.19,.018),'dark',b=.006,r=(0,0,sign*.22))
   self.cyl((sign*.75,3.57,-.786),.035,.025,'metal',sides=8)
  self.box((0,3.83,-.923),(.23,.22,.038),'core',b=.035,r=(-.12,0,0))
  if self.index==1:
   for sign in (-1,1):
    self.box((sign*.36,3.67,-.83),(.82,.23,.18),'gold',b=.04,r=(0,0,sign*.65))
    self.box((sign*.49,3.84,-.73),(.48,.13,.14),'white',b=.03,r=(0,0,sign*.43))
    self.blade((sign*.99,4.23,-.24),(.32,1.02,.28),'gold',r=(0,0,-sign*.42))
  elif self.index==2:
   self.box((0,4.38,.29),(.64,.26,.52),'metal',b=.09)
  else:
   for sign in (-1,1):
    height=1.04 if self.index==4 else .89
    self.blade((sign*.94,4.35,.08),(.36 if self.index!=4 else .19,height,.34),'white' if self.index==7 else 'light',r=(0,0,-sign*.32))
  # Compact backpack; enough authored back detail for orbit and multiplayer.
  self.box((0,2.33,.63),(.81,.72,.39),'joint',b=.10)
  self.box((0,2.40,.83),(.64,.42,.13),'armor',b=.06)
  for sign in (-1,1):
   self.tube((sign*.26,2.19,.92),.14,.10,'metal')
   self.cyl((sign*.26,2.19,.982),.09,.015,'core',sides=12)
  for sign,part in [(-1,'Arm_L'),(1,'Arm_R')]:
   self.part=part
   self.ellipsoid((sign*.84,2.55,0),(.39,.42,.46),'joint',e=1,slices=12,stacks=8)
   self.ellipsoid((sign*.90,2.63,-.01),(.73,.52,.78),'armor',e=.61,r=(0,0,-sign*.18),slices=16,stacks=10)
   self.box((sign*.94,2.64,-.37),(.22,.085,.055),'light',b=.022,r=(0,0,-sign*.15))
   self.box((sign*1.05,2.54,-.33),(.07,.07,.025),'white',b=.014)
   self.ellipsoid((sign*.99,2.30,.015),(.34,.43,.37),'joint',e=.9,slices=12,stacks=8)
   self.tube((sign*1.04,2.18,.005),.13,.36,'metal','x',16)
   if two_handed:
    self.ellipsoid((sign*.89,2.02,-.29),(.48,.53,.49),'armor',e=.65,r=(.30,0,-sign*.39),slices=16,stacks=10)
    self.ellipsoid((sign*.64,1.91,-.59),(.35,.31,.38),'joint',e=.65,slices=16,stacks=10)
    for dx in (-.085,.085):self.box((sign*.64+dx,1.91,-.785),(.07,.18,.05),'metal',b=.02)
   else:
    self.ellipsoid((sign*1.05,1.965,-.04),(.63,.60,.65),'armor',e=.61,r=(0,0,sign*.07),slices=16,stacks=10)
    self.box((sign*1.05,2.00,-.333),(.30,.20,.06),'light',b=.048)
    self.ellipsoid((sign*1.06,1.67,-.09),(.45,.39,.47),'joint',e=.65,slices=16,stacks=10)
    for dx in (-.105,0,.105):self.box((sign*1.06+dx,1.67,-.303),(.082,.17,.06),'metal',b=.023)
  self.gear()
  for (part,_),g in self.groups.items():
   origin=np.array(self.parts[part]);p=np.array(g['p'])+origin
   p[:,0]*=1.06
   p[:,1]=np.where(p[:,1]<1.8,p[:,1]*.80,p[:,1]-.36)
   target=origin.copy();target[0]*=1.06;target[1]=target[1]*.80 if target[1]<1.8 else target[1]-.36
   g['p']=(p-target).tolist()
   n=np.array(g['n']);n[:,0]/=1.06;n[:,1]/=np.where((np.array(g['p'])+target)[:,1]<1.44,.80,1);n/=np.linalg.norm(n,axis=1)[:,None];g['n']=n.tolist()
  self.parts={k:(v[0]*1.06,v[1]*.80 if v[1]<1.8 else v[1]-.36,v[2]) for k,v in self.parts.items()}
  return self
 def gear(self):
  self.part='Arm_R';w=self.weapon
  if w=='lance':
   self.tube((1.08,1.32,-.60),.067,.68,'joint','y',16)
   self.tube((1.08,1.69,-.60),.16,.12,'gold','y',16)
   self.blade((1.34,2.28,-.60),(.30,1.48,.16),'core',r=(0,0,-.36))
   self.blade((1.34,2.30,-.685),(.10,1.36,.045),'energyWhite',r=(0,0,-.36))
   self.tube((1.08,1.26,-.60),.09,.085,'metal','y',16)
  elif w=='cannons':
   self.part='Body'
   for sign in (-1,1):
    self.tube((sign*1.035,3.98,.0),.29,1.18,'armor',sides=20)
    self.tube((sign*1.035,3.98,-.53),.325,.17,'metal',sides=20)
    self.tube((sign*1.035,3.98,-.63),.27,.055,'eye',sides=20)
    self.tube((sign*1.035,3.98,-.66),.22,.055,'ink',sides=20)
    self.tube((sign*1.035,3.98,-.69),.12,.025,'joint',sides=20)
   for sign,part in [(-1,'Arm_L'),(1,'Arm_R')]:
    self.part=part
    self.tube((sign*1.065,1.91,-.31),.325,.72,'armor',sides=20)
    self.tube((sign*1.065,1.91,-.63),.35,.15,'metal',sides=20)
    self.tube((sign*1.065,1.91,-.72),.26,.052,'eye',sides=20)
    self.tube((sign*1.065,1.91,-.755),.205,.042,'ink',sides=20)
    self.cyl((sign*1.065,1.91,-.78),.048,.018,'energyWhite',sides=12)
  elif w=='missiles':
   self.part='Body'
   for sign in (-1,1):
    self.box((sign*1.29,3.27,-.06),(.47,.79,.51),'joint',b=.08)
    self.box((sign*1.29,3.27,-.335),(.40,.69,.075),'ink',b=.065)
    for dx in (-.105,.105):
     for dy in (-.23,0,.23):
      self.tube((sign*1.29+dx,3.27+dy,-.391),.087,.065,'metal',sides=12)
      self.ellipsoid((sign*1.29+dx,3.27+dy,-.446),(.136,.136,.12),'missile',e=1,slices=12,stacks=8)
  elif w in ('sniper','gatling','rifle'):
   self.part='Body'
   if w=='sniper':
    self.box((.03,1.985,-.733),(1.48,.38,.35),'armor',b=.08)
    self.box((.04,2.13,-.78),(1.2,.11,.4),'gold',b=.03)
    self.box((.28,1.80,-.73),(.20,.32,.26),'joint',b=.04,r=(0,0,-.15))
    self.box((.27,1.99,-.934),(.36,.13,.035),'joint',b=.02)
    self.tube((-.97,2.005,-.74),.095,.57,'joint','x')
    self.tube((-1.27,2.005,-.74),.153,.19,'armor','x')
    self.tube((-1.381,2.005,-.74),.085,.025,'eye','x')
    self.box((.08,2.35,-.69),(.35,.21,.19),'joint',b=.04)
    self.tube((-.12,2.49,-.69),.174,.82,'armor','x')
    self.tube((-.54,2.49,-.69),.228,.16,'joint','x')
    self.tube((-.634,2.49,-.69),.163,.034,'scope','x')
    self.tube((.31,2.49,-.69),.196,.08,'metal','x')
   elif w=='gatling':
    self.ellipsoid((.1,1.97,-.70),(1.17,.54,.60),'armor',e=.64,slices=16,stacks=10)
    self.tube((-.36,1.99,-.70),.31,.84,'joint','x')
    for x in (-.01,-.30,-.60):self.tube((x,1.99,-.70),.338,.095,'armor','x')
    self.tube((-.83,1.99,-.70),.357,.17,'metal','x')
    self.tube((-.93,1.99,-.70),.295,.07,'ink','x')
    for j in range(6):
     a=j*math.pi/3;y=1.99+math.sin(a)*.185;z=-.70+math.cos(a)*.185
     self.tube((-.99,y,z),.078,.055,'joint','x',12)
     self.cyl((-1.024,y,z),.046,.012,'ink','x',12)
    self.box((.42,2.30,-.67),(.49,.12,.21),'joint',b=.04)
   else:
    self.box((-.03,1.99,-.70),(1.62,.34,.38),'armor',b=.075,r=(0,0,.08))
    self.box((.04,2.135,-.77),(1.06,.10,.32),'joint',b=.025)
    for x in (-.57,-.21,.15):self.box((x,2.045,-.902),(.21,.075,.037),'eye',b=.017,r=(0,0,.08))
    self.tube((-.99,1.91,-.70),.103,.34,'metal','x')
    self.tube((-1.19,1.91,-.70),.16,.13,'armor','x')
    self.tube((-1.269,1.91,-.70),.09,.026,'eye','x')
    self.box((.30,1.78,-.70),(.22,.33,.24),'joint',b=.03,r=(0,0,-.2))
  elif w=='fists':
   for sign,part in [(-1,'Arm_L'),(1,'Arm_R')]:
    self.part=part
    self.ellipsoid((sign*1.00,2.02,-.42),(.97,.87,.94),'armor',e=.65,r=(.06,0,sign*.16),slices=20,stacks=12)
    self.ellipsoid((sign*.98,2.015,-.83),(.64,.59,.32),'joint',e=.6,slices=16,stacks=10)
    for dx in (-.17,0,.17):self.box((sign*.98+dx,2.035,-.993),(.13,.28,.09),'metal',b=.04)
    self.box((sign*1.37,2.04,-.61),(.075,.33,.25),'eye',b=.035,r=(0,0,sign*.15))
  elif w=='flame':
   self.tube((1.065,1.96,-.45),.31,.82,'armor',sides=20)
   for z in (-.25,-.52,-.77):self.tube((1.065,1.96,z),.33,.09,'joint',sides=20)
   self.tube((1.065,1.96,-.91),.245,.20,'gold',sides=20)
   self.tube((1.065,1.96,-1.024),.165,.04,'core',sides=20)
   self.ellipsoid((1.065,1.96,-1.19),(.19,.22,.37),'core',e=1,slices=16,stacks=10)
   self.blade((1.065,2.00,-1.4),(.09,.40,.1),'energyWhite',r=(-math.pi/2,0,0))
   self.part='Body'
   for sign in (-1,1):self.tube((sign*.30,2.34,.83),.175,.65,'armor','y',16)
  elif w=='saw':
   self.part='Arm_L';x=-1.13;y=1.99;z=-.58
   self.tube((x,y,z),.59,.16,'metal',sides=24)
   for j in range(12):
    a=j*math.pi/6;self.box((x+math.cos(a)*.57,y+math.sin(a)*.57,z),(.15,.24,.16),'white',b=.035,r=(0,0,a-math.pi/2))
   self.tube((x,y,z-.109),.445,.062,'joint',sides=24)
   self.tube((x,y,z-.155),.25,.038,'eye',sides=20)
   self.cyl((x,y,z-.181),.12,.018,'core',sides=20)
  elif w=='ice':
   self.part='Body'
   self.cyl((0,2.28,-.698),.193,.025,'armor',sides=6);self.snowflake((0,2.28,-.718))
   self.blade((0,4.43,.22),(.46,.96,.39),'eye',r=(0,0,-.16))
   for sign in (-1,1):
    self.blade((sign*.80,4.11,.15),(.32,.65,.27),'eye',r=(0,0,-sign*.5))
   for sign,part in [(-1,'Arm_L'),(1,'Arm_R')]:
    self.part=part
    self.blade((sign*1.12,2.88,-.04),(.45,.63,.44),'light',r=(0,0,-sign*.7))
    for j in range(3):self.blade((sign*(1.10+j*.13),1.99+j*.02,-.48),(.30,.51,.28),'eye',r=(-.2,0,-sign*(.4+j*.25)))

 def save(self):
  doc={'asset':{'version':'2.0','generator':'Vocab World original Soft Cuboid Chibi builder'},'extensionsUsed':['KHR_mesh_quantization','KHR_materials_unlit'],'extensionsRequired':['KHR_mesh_quantization'],'scene':0,'scenes':[{'nodes':[0]}], 'nodes':[{'name':f'robot_{self.index:02d}','children':[1,2,3,4,5],'extras':{'robotId':f'robot_{self.index:02d}','playerStyle':'soft-cuboid-chibi-3d','forward':'-Z'}}], 'meshes':[], 'accessors':[], 'bufferViews':[], 'materials':[{'name':'Painted alloy','pbrMetallicRoughness':{'baseColorFactor':[1,1,1,1],'metallicFactor':.28,'roughnessFactor':.23}}, {'name':'Energy','pbrMetallicRoughness':{'baseColorFactor':[1,1,1,1],'metallicFactor':.15,'roughnessFactor':.28},'extensions':{'KHR_materials_unlit':{}}}]}
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
   if bounds:
    bounded=a[:,:3] if kind=='VEC3' and stride else a
    entry.update(min=np.atleast_1d(bounded.min(axis=0)).tolist(),max=np.atleast_1d(bounded.max(axis=0)).tolist())
   if normalized:entry['normalized']=True
   doc['accessors'].append(entry);return len(doc['accessors'])-1
  for part,origin in self.parts.items():
   primitives=[]
   for (pn,glow),g in self.groups.items():
    if pn!=part:continue
    assert len(g['p'])<65536
    assert np.max(np.abs(np.rint(np.array(g['p'])*4096)))<=32767, 'Position quantization overflow'
    primitives.append({'attributes':{'POSITION':acc(np.c_[np.rint(np.array(g['p'])*4096),np.zeros(len(g['p']))],'<i2','VEC3',34962,True,stride=8),'NORMAL':acc(np.c_[np.rint(np.array(g['n'])*32767),np.zeros(len(g['n']))],'<i2','VEC3',34962,normalized=True,stride=8),'COLOR_0':acc(g['c'],'u1','VEC4',34962,normalized=True)},'indices':acc(g['i'],'<u2','SCALAR',34963),'material':int(glow)})
    triangles+=len(g['i'])//3
   doc['meshes'].append({'name':part,'primitives':primitives});doc['nodes'].append({'name':part,'mesh':len(doc['meshes'])-1,'translation':list(origin),'scale':[1/4096]*3})
  # Portable clips for external GLB viewers; game animates the same four pivots.
  doc['animations']=[]
  for name,duration,amplitude in [('Idle',2.4,.025),('Walk',.85,.38),('Attack',.6,.65)]:
   samplers=[];channels=[];times=np.linspace(0,duration,9).tolist(); tacc=acc(times,'<f4','SCALAR',bounds=True)
   for node in range(2,6):
    vals=[]
    for t in times:
     angle=math.sin(t/duration*math.pi*2)*amplitude*(1 if node in (2,5) else -1)
     if self.index in (4,8,9) and node>=4:angle=math.sin(t/duration*math.pi*2)*.035
     if name=='Attack':angle=(-math.sin(t/duration*math.pi)*(.05 if self.index in (4,8,9) else amplitude) if node>=4 else 0)
     vals.append([math.sin(angle/2),0,0,math.cos(angle/2)])
    samplers.append({'input':tacc,'output':acc(vals,'<f4','VEC4'),'interpolation':'LINEAR'});channels.append({'sampler':len(samplers)-1,'target':{'node':node,'path':'rotation'}})
   doc['animations'].append({'name':name,'samplers':samplers,'channels':channels})
  binary.extend(b'\0'*((-len(binary))%4));doc['buffers']=[{'byteLength':len(binary)}]
  js=json.dumps(doc,separators=(',',':')).encode();js+=b' '*((-len(js))%4)
  data=struct.pack('<III',0x46546c67,2,28+len(js)+len(binary))+struct.pack('<I4s',len(js),b'JSON')+js+struct.pack('<I4s',len(binary),b'BIN\0')+binary
  OUT.mkdir(parents=True,exist_ok=True);path=OUT/f'robot_{self.index:02d}.glb';path.write_bytes(data)
  return {'id':path.stem,'name':self.name,'weapon':self.weapon,'bytes':len(data),'triangles':triangles,'draws':sum(len(m['primitives']) for m in doc['meshes']),'textures':0,'heightMeters':round(max(p[1]+self.parts[part][1] for (part,_),g in self.groups.items() for p in g['p']),4)}

if __name__=='__main__':
 report=[Robot(i).build().save() for i in range(1,11)]
 (OUT/'manifest.json').write_text(json.dumps({'style':'soft-cuboid-chibi-3d','forward':'-Z','heightRangeMeters':[min(r['heightMeters'] for r in report),max(r['heightMeters'] for r in report)],'robots':report},indent=2)+'\n')
 print(json.dumps(report,indent=2))
