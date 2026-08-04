"use strict";
/* ============================================================
   📖 picdict_words.js — คำศัพท์รายช่องของแต่ละแผ่นใน Picture Dictionary (รอบ 992)
   คีย์ = ชื่อไฟล์ใน img/matching/ · cols/rows = ตารางการ์ดบนแผ่น
   words = ไล่ ซ้าย→ขวา บน→ล่าง ทีละแถว · 1 ช่อง = ["คำอังกฤษ","คำแปลไทย"]
   pad (ถ้ามี) = [บน,ขวา,ล่าง,ซ้าย] เป็น % ของภาพ — ระยะขอบก่อนถึงตารางการ์ด
   ⚙️ ไฟล์นี้เจนโดย Sonnet ทีละแผ่นตาม PROMPT_PICDICT_SONNET.md (แผ่นไหนยังไม่มี
      entry = หน้านั้นเปิดดูได้แต่ยังไม่มีเสียงอ่าน — เกมไม่พัง)
   ============================================================ */
window.PICDICT_WORDS = window.PICDICT_WORDS || {};

PICDICT_WORDS['Colors.png'] = {cols:8, rows:8, words:[
  ["Red","สีแดง"],["Orange","สีส้ม"],["Yellow","สีเหลือง"],["Green","สีเขียว"],["Blue","สีน้ำเงิน"],["Purple","สีม่วง"],["Pink","สีชมพู"],["Brown","สีน้ำตาล"],
  ["Black","สีดำ"],["White","สีขาว"],["Gray","สีเทา"],["Light Gray","สีเทาอ่อน"],["Dark Gray","สีเทาเข้ม"],["Beige","สีเบจ"],["Cream","สีครีม"],["Tan","สีน้ำตาลอ่อน"],
  ["Gold","สีทอง"],["Silver","สีเงิน"],["White","สีขาวนวล"],["Ivory","สีงาช้าง"],["Pearl","สีมุก"],["Beige Pink","สีชมพูเบจ"],["Coral","สีคอรัล"],["Peach","สีพีช"],
  ["Apricot","สีแอพริคอท"],["Salmon","สีแซลมอน"],["Magenta","สีบานเย็น"],["Hot Pink","สีชมพูสด"],["Rose","สีชมพูเข้ม"],["Burgundy","สีเบอร์กันดี"],["Maroon","สีน้ำตาลแดง"],["Lavender","สีลาเวนเดอร์"],
  ["Violet","สีไวโอเลต"],["Indigo","สีคราม"],["Navy","สีกรมท่า"],["Sky Blue","สีฟ้าอ่อน"],["Turquoise","สีเทอร์ควอยซ์"],["Teal","สีทีล"],["Cyan","สีไซแอน"],["Aqua","สีอควา"],
  ["Mint","สีมิ้นต์"],["Lime","สีไลม์"],["Olive","สีโอลีฟ"],["Khaki","สีกากี"],["Forest Green","สีเขียวป่า"],["Jade","สีหยก"],["Bottle Green","สีเขียวขวด"],["Mustard","สีมัสตาร์ด"],
  ["Amber","สีอำพัน"],["Rust","สีสนิม"],["Brick Red","สีอิฐ"],["Chocolate","สีช็อกโกแลต"],["Mocha","สีมอคค่า"],["Sandy","สีทราย"],["Taupe","สีเทาอมน้ำตาล"],["Charcoal","สีชาร์โคล"],
  ["Neon Yellow","สีเหลืองนีออน"],["Neon Green","สีเขียวนีออน"],["Neon Blue","สีน้ำเงินนีออน"],["Neon Pink","สีชมพูนีออน"],["Neon Orange","สีส้มนีออน"],["Neon Purple","สีม่วงนีออน"],["Pastel Blue","สีฟ้าพาสเทล"],["Pastel Pink","สีชมพูพาสเทล"],
]};

PICDICT_WORDS['Action Verbs.png'] = {cols:8, rows:7, words:[
  ["Run","วิ่ง"],["Walk","เดิน"],["Jump","กระโดด"],["Skip","กระโดดเชือก"],["Climb","ปีน"],["Slide","ไถล"],["Swim","ว่ายน้ำ"],["Kick","เตะ"],
  ["Throw","ขว้าง"],["Catch","จับ"],["Hit","ตี"],["Dribble","เลี้ยงลูก"],["Ride","ขี่"],["Skate","เล่นสเก็ต"],["Dance","เต้น"],["Sing","ร้องเพลง"],
  ["Play","เล่น"],["Listen","ฟัง"],["Read","อ่าน"],["Write","เขียน"],["Draw","วาด"],["Paint","ระบายสี"],["Cut","ตัด"],["Glue","ทากาว"],
  ["Open","เปิด"],["Close","ปิด"],["Push","ผลัก"],["Pull","ดึง"],["Lift","ยก"],["Carry","ถือ"],["Put","วาง"],["Take","หยิบ"],
  ["Point","ชี้"],["Look","มอง"],["Watch","ดู"],["Think","คิด"],["Remember","จำ"],["Forget","ลืม"],["Understand","เข้าใจ"],["Ask","ถาม"],
  ["Answer","ตอบ"],["Help","ช่วย"],["Share","แบ่งปัน"],["Give","ให้"],["Wait","รอ"],["Start","เริ่ม"],["Stop","หยุด"],["Finish","จบ"],
  ["Laugh","หัวเราะ"],["Cry","ร้องไห้"],["Smile","ยิ้ม"],["Shout","ตะโกน"],["Whisper","กระซิบ"],["Yawn","หาว"],["Sneeze","จาม"],["Clap","ปรบมือ"],
]};

PICDICT_WORDS['Adjectives.png'] = {cols:8, rows:8, words:[
  ["Happy","มีความสุข"],["Sad","เศร้า"],["Big","ใหญ่"],["Small","เล็ก"],["Strong","แข็งแรง"],["Weak","อ่อนแอ"],["Fast","เร็ว"],["Slow","ช้า"],
  ["Tall","สูง"],["Short","เตี้ย"],["Hot","ร้อน"],["Cold","หนาว"],["New","ใหม่"],["Old","เก่า"],["Clean","สะอาด"],["Dirty","สกปรก"],
  ["Full","เต็ม"],["Empty","ว่างเปล่า"],["Heavy","หนัก"],["Light","เบา"],["Thick","หนา"],["Thin","บาง"],["Long","ยาว"],["Short","สั้น"],
  ["Bright","สว่าง"],["Dark","มืด"],["Loud","ดัง"],["Quiet","เงียบ"],["Early","เช้า"],["Late","ดึก"],["Easy","ง่าย"],["Difficult","ยาก"],
  ["Beautiful","สวย"],["Handsome","หล่อ"],["Ugly","น่าเกลียด"],["Delicious","อร่อย"],["Tasteless","ไม่อร่อย"],["Soft","นุ่ม"],["Hard","แข็ง"],["Cozy","อบอุ่น"],
  ["Wet","เปียก"],["Dry","แห้ง"],["Safe","ปลอดภัย"],["Dangerous","อันตราย"],["Colorful","มีสีสัน"],["Plain","เรียบง่าย"],["Interesting","น่าสนใจ"],["Boring","น่าเบื่อ"],
  ["Kind","ใจดี"],["Mean","ใจร้าย"],["Honest","ซื่อสัตย์"],["Lazy","ขี้เกียจ"],["Hardworking","ขยัน"],["Brave","กล้าหาญ"],["Shy","ขี้อาย"],["Friendly","เป็นมิตร"],
  ["Smart","ฉลาด"],["Silly","ตลก"],["Generous","ใจกว้าง"],["Stingy","ขี้ตระหนี่"],["Patient","อดทน"],["Impatient","ใจร้อน"],["Successful","ประสบความสำเร็จ"],["Careful","รอบคอบ"],
]};

PICDICT_WORDS['Bathroom.png'] = {cols:8, rows:8, words:[
  ["Toilet","โถส้วม"],["Toilet Seat","ฝารองนั่ง"],["Flush","กดชักโครก"],["Sink","อ่างล้างหน้า"],["Faucet","ก็อกน้ำ"],["Mirror","กระจก"],["Shower","ฝักบัว"],["Bathtub","อ่างอาบน้ำ"],
  ["Shower Curtain","ม่านกั้นอาบน้ำ"],["Towel","ผ้าเช็ดตัว"],["Bath Towel","ผ้าเช็ดตัวผืนใหญ่"],["Hand Towel","ผ้าเช็ดมือ"],["Bath Mat","เสื่อห้องน้ำ"],["Soap","สบู่"],["Liquid Soap","สบู่เหลว"],["Shampoo","แชมพู"],
  ["Conditioner","ครีมนวดผม"],["Body Wash","เจลอาบน้ำ"],["Toothbrush","แปรงสีฟัน"],["Toothpaste","ยาสีฟัน"],["Mouthwash","น้ำยาบ้วนปาก"],["Dental Floss","ไหมขัดฟัน"],["Comb","หวี"],["Hair Brush","แปรงผม"],
  ["Razor","มีดโกน"],["Shaving Cream","ครีมโกนหนวด"],["Deodorant","โรลออน"],["Lotion","โลชั่นบำรุงผิว"],["Sunscreen","ครีมกันแดด"],["Cotton Swabs","ไม้พันสำลี"],["Cotton Pads","สำลีแผ่น"],["Tissue Box","กล่องทิชชู่"],
  ["Toilet Paper","กระดาษชำระ"],["Bidet Spray","สายฉีดชำระ"],["Plunger","ไม้ปั๊มยาง"],["Toilet Brush","แปรงขัดโถส้วม"],["Trash Can","ถังขยะ"],["Laundry Basket","ตะกร้าผ้า"],["Clothes Hamper","ตะกร้าใส่ผ้า"],["Scale","เครื่องชั่งน้ำหนัก"],
  ["Shelf","ชั้นวางของ"],["Cabinet","ตู้เก็บของ"],["Medicine Cabinet","ตู้ยากระจก"],["Storage Box","กล่องเก็บของ"],["Air Freshener","น้ำขอมปรับอากาศ"],["Diffuser","ก้านหอมปรับอากาศ"],["Vent Fan","พัดลมระบายอากาศ"],["Heater","เครื่องทำความร้อน"],
  ["Hair Dryer","ไดร์เป่าผม"],["Bathrobe","เสื้อคลุมอาบน้ำ"],["Straightener","เครื่องหนีบผม"],["Makeup Mirror","กระจกตั้งโต๊ะ"],["Stain Remover","น้ำยาซักคราบ"],["Fabric Softener","น้ำยาปรับผ้านุ่ม"],["Iron","เตารีด"],["Drying Rack","ราวตากผ้า"],
  ["Hair Dryer","ไดร์เป่าผม"],["Curling Iron","เครื่องม้วนผม"],["Straightener","เครื่องหนีบผม"],["Makeup Mirror","กระจกตั้งโต๊ะ"],["Waste Bin","ถังขยะเล็ก"],["Step Stool","เก้าอี้ขั้นเตี้ย"],["Grab Bar","ราวจับกันลื่น"],["Water Heater","เครื่องทำน้ำอุ่น"],
]};

PICDICT_WORDS['Bedroom.png'] = {cols:8, rows:8, words:[
  ["Bed","เตียง"],["Pillow","หมอน"],["Blanket","ผ้าห่ม"],["Mattress","ที่นอน"],["Bedsheet","ผ้าปูที่นอน"],["Comforter","ผ้านวม"],["Headboard","หัวเตียง"],["Footboard","ท้ายเตียง"],
  ["Nightstand","โต๊ะข้างเตียง"],["Dresser","โต๊ะเครื่องแป้ง"],["Wardrobe","ตู้เสื้อผ้า"],["Closet","ตู้เสื้อผ้า"],["Bookshelf","ชั้นหนังสือ"],["Desk","โต๊ะทำงาน"],["Study Chair","เก้าอี้นั่งทำงาน"],["Vanity Table","โต๊ะเครื่องแป้ง"],
  ["Alarm Clock","นาฬิกาปลุก"],["Table Lamp","โคมไฟตั้งโต๊ะ"],["Floor Lamp","โคมไฟตั้งพื้น"],["Ceiling Light","ไฟเพดาน"],["Fan","พัดลม"],["Air Conditioner","เครื่องปรับอากาศ"],["Heater","เครื่องทำความร้อน"],["Humidifier","เครื่องเพิ่มความชื้น"],
  ["Curtains","ผ้าม่าน"],["Blinds","มู่ลี่"],["Rug","พรม"],["Mirror","กระจก"],["Laundry Basket","ตะกร้าผ้า"],["Hanger","ไม้แขวนเสื้อ"],["Ironing Board","โต๊ะรีดผ้า"],["Iron","เตารีด"],
  ["Stuffed Toy","ตุ๊กตา"],["Toy Box","กล่องของเล่น"],["Photo Frame","กรอบรูป"],["Wall Shelf","ชั้นติดผนัง"],["Wall Clock","นาฬิกาแขวนผนัง"],["Trash Bin","ถังขยะ"],["Laundry Hamper","ตะกร้าใส่ผ้า"],["Storage Box","กล่องเก็บของ"],
  ["Window","หน้าต่าง"],["Door","ประตู"],["Floor","พื้น"],["Wall","ผนัง"],["Ceiling","เพดาน"],["Light Switch","สวิตช์ไฟ"],["Outlet","เต้าเสียบไฟ"],["Baseboard","บัวเชิงผนัง"],
  ["Closet Organizer","ชั้นจัดเก็บตู้เสื้อผ้า"],["Shoe Rack","ชั้นวางรองเท้า"],["Full-length Mirror","กระจกเต็มตัว"],["Jewelry Box","กล่องใส่เครื่องประดับ"],["Tissue Box","กล่องทิชชู่"],["Diffuser","ก้านหอม"],["Air Purifier","เครื่องฟอกอากาศ"],["Sound Machine","เครื่องกล่อมนอน"],
  ["Gaming Chair","เก้าอี้เกม"],["Computer","คอมพิวเตอร์"],["Laptop","แล็ปท็อป"],["Headphones","หูฟัง"],["Slippers","รองเท้าแตะ"],["Laundry Sorter","ตะกร้าแยกผ้า"],["Vacuum Cleaner","เครื่องดูดฝุ่น"],["Door Mat","พรมเช็ดเท้า"],
]};

PICDICT_WORDS['Birds.png'] = {cols:8, rows:7, words:[
  ["Eagle","นกอินทรี"],["Parrot","นกแก้ว"],["Sparrow","นกกระจอก"],["Pigeon","นกพิราบ"],["Crow","นกกา"],["Magpie","นกกางเขน"],["Kingfisher","นกกระเต็น"],["Owl","นกฮูก"],
  ["Peacock","นกยูง"],["Flamingo","นกฟลามิงโก"],["Swan","หงส์"],["Duck","เป็ด"],["Goose","ห่าน"],["Chicken","ไก่"],["Rooster","ไก่ตัวผู้"],["Turkey","ไก่งวง"],
  ["Penguin","เพนกวิน"],["Hummingbird","นกฮัมมิงเบิร์ด"],["Woodpecker","นกหัวขวาน"],["Toucan","ทูแคน"],["Hornbill","นกเงือก"],["Stork","นกกระสา"],["Heron","นกยาง"],["Crane","นกกระเรียน"],
  ["Seagull","นกนางนวล"],["Albatross","นกอัลบาทรอส"],["Pelican","นกกระทุง"],["Cuckoo","นกกาเหว่า"],["Cardinal","นกคาร์ดินัล"],["Blue Jay","นกเจย์สีน้ำเงิน"],["Robin","นกโรบิน"],["Wagtail","นกเต้าลม"],
  ["Wren","นกกระจิ๊ด"],["Bulbul","นกปรอด"],["Myna","นกเอี้ยง"],["Sunbird","นกกินปลี"],["Finch","นกฟินซ์"],["Canary","นกคานารี"],["Budgerigar","นกหงส์หยก"],["Lovebird","นกเลิฟเบิร์ด"],
  ["Plover","นกพลอเวอร์"],["Lapwing","นกเต้าลมใหญ่"],["Quail","นกกระทา"],["Pheasant","นกฟีแซนต์"],["Puffin","นกพัฟฟิน"],["Kiwi","นกกีวี"],["Emu","นกอีมู"],["Cassowary","นกแคสโซแวรี"],
  ["Vulture","นกแร้ง"],["Prairie Chicken","ไก่ทุ่ง"],["Bunting","นกจาบคา"],["Pipit","นกเด้าดิน"],["Bee-eater","นกจาบคาหัวเขียว"],["Swallow","นกนางแอ่น"],["Swift","นกแอ่นท้องดำ"],["Booby","นกบูบี"],
]};

PICDICT_WORDS['BodyParts.png'] = {cols:8, rows:8, words:[
  ["Head","ศีรษะ"],["Face","ใบหน้า"],["Hair","ผม"],["Forehead","หน้าผาก"],["Eye","ตา"],["Eyebrow","คิ้ว"],["Eyelash","ขนตา"],["Ear","หู"],
  ["Nose","จมูก"],["Cheek","แก้ม"],["Mouth","ปาก"],["Lips","ริมฝีปาก"],["Teeth","ฟัน"],["Tongue","ลิ้น"],["Chin","คาง"],["Neck","คอ"],
  ["Shoulder","ไหล่"],["Arm","แขน"],["Elbow","ศอก"],["Wrist","ข้อมือ"],["Hand","มือ"],["Palm","ฝ่ามือ"],["Thumb","นิ้วหัวแม่มือ"],["Finger","นิ้ว"],
  ["Nail","เล็บ"],["Chest","หน้าอก"],["Back","หลัง"],["Stomach","ท้อง"],["Waist","เอว"],["Hip","สะโพก"],["Bottom","ก้น"],["Leg","ขา"],
  ["Thigh","ต้นขา"],["Knee","เข่า"],["Calf","น่อง"],["Ankle","ข้อเท้า"],["Foot","เท้า"],["Heel","ส้นเท้า"],["Sole","ฝ่าเท้า"],["Toe","นิ้วเท้า"],
  ["Big Toe","นิ้วหัวแม่เท้า"],["Nostril","รูจมูก"],["Beard","หนวดเครา"],["Mustache","หนวด"],["Sideburn","ตะขาบ"],["Eyelid","เปลือกตา"],["Cheekbone","โหนกแก้ม"],["Dimple","ลักยิ้ม"],
  ["Heart","หัวใจ"],["Lung","ปอด"],["Brain","สมอง"],["Bone","กระดูก"],["Muscle","กล้ามเนื้อ"],["Skin","ผิวหนัง"],["Blood","เลือด"],["Kidney","ไต"],
  ["Liver","ตับ"],["Hand (back)","หลังมือ"],["Knuckle","ข้อนิ้วมือ"],["Armpit","รักแร้"],["Navel","สะดือ"],["Spine","กระดูกสันหลัง"],["Rib","ซี่โครง"],["Vein","เส้นเลือดดำ"],
]};

PICDICT_WORDS['Classroom Objects.png'] = {cols:8, rows:8, words:[
  ["Blackboard","กระดานดำ"],["Whiteboard","กระดานไวท์บอร์ด"],["Teacher's Desk","โต๊ะครู"],["Student Desk","โต๊ะนักเรียน"],["Chair","เก้าอี้"],["Bookshelf","ชั้นหนังสือ"],["Globe","ลูกโลก"],["Clock","นาฬิกา"],
  ["Door","ประตู"],["Window","หน้าต่าง"],["Trash Can","ถังขยะ"],["Recycling Bin","ถังรีไซเคิล"],["Light","ไฟ"],["Ceiling Fan","พัดลมเพดาน"],["Air Conditioner","เครื่องปรับอากาศ"],["Projector","โปรเจคเตอร์"],
  ["Screen","จอภาพ"],["Computer","คอมพิวเตอร์"],["Laptop","แล็ปท็อป"],["Printer","เครื่องพิมพ์"],["Scanner","สแกนเนอร์"],["Speakers","ลำโพง"],["Router","เราเตอร์"],["Document Camera","กล้องเอกสาร"],
  ["Marker","ปากกาไวท์บอร์ด"],["Chalk","ชอล์ก"],["Eraser","ยางลบ"],["Duster","แปรงลบกระดาน"],["Ruler","ไม้บรรทัด"],["Triangle","ไม้ฉาก"],["Protractor","โปรแทรกเตอร์"],["Compass","วงเวียน"],
  ["Scissors","กรรไกร"],["Glue","กาว"],["Glue Stick","กาวแท่ง"],["Tape","เทปใส"],["Stapler","เครื่องเย็บกระดาษ"],["Staples","ลวดเย็บกระดาษ"],["Hole Punch","เครื่องเจาะกระดาษ"],["Binder Clip","คลิปหนีบกระดาษ"],
  ["Paper Clip","ลวดเสียบกระดาษ"],["Push Pin","หมุดปัก"],["Sticky Notes","กระดาษโน้ต"],["Notepad","สมุดฉีก"],["Notebook","สมุดโน้ต"],["Folder","แฟ้มเอกสาร"],["File Box","กล่องเก็บเอกสาร"],["Index Cards","การ์ดบันทึก"],
  ["Textbook","หนังสือเรียน"],["Dictionary","พจนานุกรม"],["Workbook","แบบฝึกหัด"],["Story Book","หนังสือนิทาน"],["Hand Sanitizer","เจลล้างมือ"],["Tissue Box","กล่องทิชชู่"],["Water Bottle","ขวดน้ำ"],["Lunch Box","กล่องข้าว"],
  ["Name Tag","ป้ายชื่อ"],["Attendance Sheet","ใบเช็คชื่อ"],["Schedule","ตารางเรียน"],["Grade Book","สมุดบันทึกคะแนน"],["Bell","กระดิ่ง"],["Pencil Case","กล่องดินสอ"],["Paint Set","ชุดสีระบายน้ำ"],["Paint Brush","พู่กัน"],
]};

PICDICT_WORDS['Clothes.png'] = {cols:8, rows:8, words:[
  ["T-shirt","เสื้อยืด"],["Shirt","เสื้อเชิ้ต"],["Polo Shirt","เสื้อโปโล"],["Dress","ชุดเดรส"],["Hoodie","เสื้อฮู้ด"],["Sweater","เสื้อสเวตเตอร์"],["Jacket","เสื้อแจ็กเก็ต"],["Coat","เสื้อโค้ท"],
  ["Jeans","กางเกงยีนส์"],["Pants","กางเกงขายาว"],["Shorts","กางเกงขาสั้น"],["Skirt","กระโปรง"],["Overalls","เอี๊ยม"],["Pajamas","ชุดนอน"],["Underwear","ชุดชั้นใน"],["Socks","ถุงเท้า"],
  ["Sneakers","รองเท้าผ้าใบ"],["Shoes","รองเท้าหนัง"],["Sandals","รองเท้าแตะ"],["Boots","รองเท้าบูท"],["Slippers","รองแตะ"],["Belt","เข็มขัด"],["Bow Tie","โบว์ไท"],["Neck Tie","เนคไท"],
  ["Scarf","ผ้าพันคอ"],["Gloves","ถุงมือ"],["Hat","หมวก"],["Cap","หมวกแก็ป"],["Sun Hat","หมวกกันแดด"],["Beanie","หมวกไหมพรม"],["Earmuffs","ที่ปิดหู"],["Sunglasses","แว่นกันแดด"],
  ["Backpack","กระเป๋าเป้"],["Handbag","กระเป๋าถือ"],["Shoulder Bag","กระเป๋าสะพาย"],["Wallet","กระเป๋าสตางค์"],["Purse","กระเป๋าใส่เหรียญ"],["Raincoat","เสื้อกันฝน"],["Umbrella","ร่ม"],["Apron","ผ้ากันเปื้อน"],
  ["Swimsuit","ชุดว่ายน้ำ"],["Goggles","แว่นตาว่ายน้ำ"],["Swim Trunks","กางเกงว่ายน้ำ"],["Life Jacket","เสื้อชูชีพ"],["Leotard","ชุดยิมนาสติก"],["Ballet Shoes","รองเท้าบัลเลต์"],["Kimono","กิโมโน"],["Uniform","ชุดนักเรียน"],
  ["Thai Costume","ชุดไทย"],["Graduation Gown","ชุดครุย"],["Chef Outfit","ชุดเชฟ"],["Doctor Coat","เสื้อกาวน์"],["Nurse Uniform","ชุดพยาบาล"],["Firefighter Suit","ชุดนักผจญเพลิง"],["Astronaut Suit","ชุดนักบินอวกาศ"],["Police Uniform","ชุดตำรวจ"],
  ["Pirate Costume","ชุดโจรสลัด"],["Princess Dress","ชุดเจ้าหญิง"],["Superhero Costume","ชุดซูเปอร์ฮีโร่"],["Skeleton Costume","ชุดโครงกระดูก"],["Clown Costume","ชุดตัวตลก"],["Fairy Costume","ชุดนางฟ้า"],["Cowboy Outfit","ชุดคาวบอย"],["Native Costume","ชุดชนพื้นเมือง"],
]};

PICDICT_WORDS['DailyRoutines.png'] = {cols:8, rows:5, words:[
  ["wake up","ตื่นนอน"],["wash face","ล้างหน้า"],["brush teeth","แปรงฟัน"],["take a shower","อาบน้ำ"],["comb hair","หวีผม"],["get dressed","แต่งตัว"],["have breakfast","ทานอาหารเช้า"],["go to school","ไปโรงเรียน"],
  ["study","เรียนหนังสือ"],["attend class","เข้าเรียน"],["do homework","ทำการบ้าน"],["have lunch","ทานอาหารกลางวัน"],["read a book","อ่านหนังสือ"],["take a nap","งีบหลับ"],["play sports","เล่นกีฬา"],["play","เล่น"],
  ["practice an instrument","ฝึกเครื่องดนตรี"],["draw","วาดรูป"],["use the computer","ใช้คอมพิวเตอร์"],["help at home","ช่วยงานบ้าน"],["do laundry","ซักผ้า"],["water the plants","รดน้ำต้นไม้"],["go for a walk","เดินเล่น"],["have a snack","ทานของว่าง"],
  ["ride a bike","ขี่จักรยาน"],["watch TV","ดูทีวี"],["listen to music","ฟังเพลง"],["cook","ทำอาหาร"],["set the table","จัดโต๊ะอาหาร"],["wash dishes","ล้างจาน"],["take out the trash","ทิ้งขยะ"],["take care of pets","ดูแลสัตว์เลี้ยง"],
  ["talk with family","พูดคุยกับครอบครัว"],["pray","สวดมนต์"],["meditate","นั่งสมาธิ"],["plan the day","วางแผนวัน"],["pack my bag","เตรียมกระเป๋า"],["say good night","บอกราตรีสวัสดิ์"],["get ready for bed","เตรียมตัวนอน"],["go to bed","เข้านอน"],
]};

PICDICT_WORDS['Drinks.png'] = {cols:8, rows:7, words:[
  ["Water","น้ำเปล่า"],["Milk","นม"],["Orange Juice","น้ำส้ม"],["Apple Juice","น้ำแอปเปิ้ล"],["Grape Juice","น้ำองุ่น"],["Pineapple Juice","น้ำสับปะรด"],["Lemonade","น้ำมะนาว"],["Lime Juice","น้ำมะนาว"],
  ["Strawberry Smoothie","สมูทตี้สตรอว์เบอร์รี่"],["Banana Smoothie","สมูทตี้กล้วย"],["Mango Smoothie","สมูทตี้มะม่วง"],["Chocolate Milk","นมช็อกโกแลต"],["Soy Milk","นมถั่วเหลือง"],["Almond Milk","นมอัลมอนด์"],["Coconut Water","น้ำมะพร้าว"],["Iced Tea","ชาเย็น"],
  ["Tea","ชา"],["Green Tea","ชาเขียว"],["Black Tea","ชาดำ"],["Coffee","กาแฟ"],["Iced Coffee","กาแฟเย็น"],["Cappuccino","คาปูชิโน"],["Latte","ลาเต้"],["Mocha","มอคค่า"],
  ["Hot Chocolate","ช็อกโกแลตร้อน"],["Cocoa","โกโก้"],["Milkshake","มิลค์เชค"],["Soda","โซดา"],["Cola","โคล่า"],["Sprite","สไปรท์"],["Fanta","แฟนต้า"],["Root Beer","รูทเบียร์"],
  ["Energy Drink","เครื่องดื่มชูกำลัง"],["Sports Drink","เครื่องดื่มเกลือแร่"],["Yakult","ยาคูลท์"],["Berry Smoothie","สมูทตี้เบอร์รี่"],["Carrot Juice","น้ำแครอท"],["Beetroot Juice","น้ำบีทรูท"],["Celery Juice","น้ำขึ้นฉ่าย"],["Tomato Juice","น้ำมะเขือเทศ"],
  ["Bubble Tea","ชานมไข่มุก"],["Thai Milk Tea","ชาไทย"],["Matcha Latte","มัทฉะลาเต้"],["Taro Milk","นมเผือก"],["Honey Lemon Tea","ชาน้ำผึ้งมะนาว"],["Ginger Tea","ชาขิง"],["Chrysanthemum Tea","ชาดอกเก๊กฮวย"],["Peppermint Tea","ชามินต์"],
  ["Bael Fruit Drink","น้ำมะตูม"],["Roselle Drink","น้ำกระเจี๊ยบ"],["Longan Drink","น้ำลำไย"],["Sugarcane Juice","น้ำอ้อย"],["Coconut Milk","นมมะพร้าว"],["Rice Milk","น้ำนมข้าว"],["Ovaltine","โอวัลติน"],["Fresh Water","น้ำดื่ม"],
]};

PICDICT_WORDS['Family.png'] = {cols:8, rows:7, words:[
  ["Father","พ่อ"],["Mother","แม่"],["Son","ลูกชาย"],["Daughter","ลูกสาว"],["Grandfather","ปู่ / ตา"],["Grandmother","ย่า / ยาย"],["Brother","พี่ชาย / น้องชาย"],["Sister","พี่สาว / น้องสาว"],
  ["Baby","ทารก / เด็กเล็ก"],["Uncle","ลุง"],["Aunt","ป้า"],["Cousin","ลูกพี่ลูกน้อง"],["Nephew","หลานชาย"],["Niece","หลานสาว"],["Husband","สามี"],["Wife","ภรรยา"],
  ["Parents","พ่อแม่"],["Family","ครอบครัว"],["Twin","แฝด"],["Stepfather","พ่อเลี้ยง"],["Stepmother","แม่เลี้ยง"],["Half-brother","พี่/น้องชายต่างแม่"],["Half-sister","พี่/น้องสาวต่างแม่"],["Relative","ญาติ / เครือญาติ"],
  ["Grandson","หลานชาย"],["Granddaughter","หลานสาว"],["Father-in-law","พ่อสามี"],["Mother-in-law","แม่สามี"],["Son-in-law","ลูกเขย"],["Daughter-in-law","สะใภ้"],["Older brother","พี่ชาย"],["Older sister","พี่สาว"],
  ["Younger brother","น้องชาย"],["Younger sister","น้องสาว"],["Big family","ครอบครัวใหญ่"],["Nuclear family","ครอบครัวพ่อแม่ลูก"],["Adopted child","ลูกบุญธรรม"],["Foster child","ลูกอุปการะ"],["Guardian","ผู้ปกครอง"],["Pet","สัตว์เลี้ยง"],
  ["Father figure","เหมือนพ่อ"],["Mother figure","เหมือนแม่"],["Family member","สมาชิกในครอบครัว"],["Home","บ้าน"],["Love","ความรัก"],["Care","ความดูแล"],["Support","การสนับสนุน"],["Together","อยู่ด้วยกัน"],
  ["Ancestor","บรรพบุรุษ"],["Family tree","ต้นไม้ครอบครัว"],["Generation","รุ่น / ช่วงอายุคน"],["Bond","ความผูกพัน"],["Happiness","ความสุข"],["Relatives","ญาติพี่น้อง"],["Meeting","การพบกัน"],["Memories","ความทรงจำ"],
]};

PICDICT_WORDS['FarmAnimals.png'] = {cols:8, rows:8, words:[
  ["Cow","วัว"],["Bull","กระทิง"],["Calf","ลูกวัว"],["Buffalo","ควาย"],["Water Buffalo","ควายปลัก"],["Ox","วัวใช้แรงงาน"],["Goat","แพะ"],["Kid","ลูกแพะ"],
  ["Sheep","แกะ"],["Lamb","ลูกแกะ"],["Pig","หมู"],["Piglet","ลูกหมู"],["Horse","ม้า"],["Foal","ลูกม้า"],["Donkey","ลา"],["Mule","ลูกผสมม้าและลา"],
  ["Chicken","ไก่"],["Rooster","ไก่ตัวผู้"],["Hen","แม่ไก่"],["Chick","ลูกเจี๊ยบ"],["Duck","เป็ด"],["Drake","เป็ดตัวผู้"],["Goose","ห่าน"],["Gosling","ลูกห่าน"],
  ["Turkey","ไก่งวง"],["Tom","ไก่งวงตัวผู้"],["Hen Turkey","ไก่งวงตัวเมีย"],["Rabbit","กระต่าย"],["Bunny","ลูกกระต่าย"],["Guinea Pig","หนูตะเภา"],["Quail","นกกระทา"],["Pigeon","นกพิราบ"],
  ["Peacock","นกยูง"],["Peahen","นกยูงตัวเมีย"],["Pheasant","ไก่ฟ้า"],["Partridge","นกคุ่ม"],["Ostrich","นกกระจอกเทศ"],["Emu","อีมู"],["Cattle","โคเนื้อ"],["Dairy Cow","วัวนม"],
  ["Llama","ลามา"],["Alpaca","อัลปากา"],["Shetland Pony","โพนี่เชตแลนด์"],["Dog","สุนัขเฝ้าฟาร์ม"],["Cat","แมว"],["Barn Cat","แมวในฟาร์ม"],["Muscovy Duck","เป็ดเทศ"],["Geese","ฝูงห่าน"],
  ["Bee","ผึ้ง"],["Honeybee","ผึ้งน้ำผึ้ง"],["Earthworm","ไส้เดือน"],["Mole","ตัวตุ่น"],["Frog","กบ"],["Tortoise","เต่า"],["Snail","หอยทาก"],["Ladybug","เต่าทอง"],
  ["Farm Rat","หนูในฟาร์ม"],["Field Mouse","หนูทุ่ง"],["Hay","หญ้าแห้ง"],["Hay Bale","ก้อนหญ้าแห้ง"],["Egg","ไข่"],["Milk","นม"],["Wool","ขนแกะ"],["Feathers","ขนไก่"],
]};

PICDICT_WORDS['Feelings.png'] = {cols:8, rows:6, words:[
  ["Happy","มีความสุข"],["Excited","ตื่นเต้น"],["Proud","ภูมิใจ"],["Loved","ถูกรัก"],["Confident","มั่นใจ"],["Energetic","กระฉับกระเฉง"],["Cheerful","ร่าเริง"],["Grateful","ขอบคุณ"],
  ["Laughing","หัวเราะ"],["Shy","อาย"],["Curious","อยากรู้"],["Surprised","ประหลาดใจ"],["Scared","กลัว"],["Worried","กังวล"],["Nervous","ประหม่า"],["Afraid","หวาดกลัว"],
  ["Sad","เศร้า"],["Angry","โกรธ"],["Annoyed","หงุดหงิด"],["Disappointed","ผิดหวัง"],["Jealous","อิจฉา"],["Embarrassed","เขินอาย"],["Guilty","รู้สึกผิด"],["Lonely","เหงา"],
  ["Tired","เหนื่อย"],["Sleepy","ง่วงนอน"],["Relaxed","ผ่อนคลาย"],["Calm","สงบ"],["Focused","จดจ่อ"],["Inspired","มีแรงบันดาลใจ"],["Amazed","ทึ่ง"],["Blessed","รู้สึกโชคดี"],
  ["Hopeful","มีความหวัง"],["Satisfied","พอใจ"],["Determined","มุ่งมั่น"],["Brave","กล้าหาญ"],["Peaceful","สงบสุข"],["Friendly","เป็นมิตร"],["Playful","ขี้เล่น"],["Thoughtful","มีน้ำใจ"],
  ["Compassionate","มีเมตตา"],["Relieved","โล่งใจ"],["Interested","สนใจ"],["Bored","เบื่อ"],["Overwhelmed","รู้สึกกดดัน"],["Heartbroken","เสียใจมาก"],["Confused","สับสน"],["Content","พอใจในสิ่งที่เป็น"],
]};

PICDICT_WORDS['Flowers.png'] = {cols:8, rows:6, words:[
  ["Rose","กุหลาบ"],["Sunflower","ทานตะวัน"],["Lily","ลิลลี่"],["Tulip","ทิวลิป"],["Daffodil","แดฟโฟดิล"],["Daisy","เดซี่"],["Lotus","ดอกบัว"],["Lavender","ลาเวนเดอร์"],
  ["Carnation","คาร์เนชั่น"],["Hibiscus","ชบา"],["Marigold","ดาวเรือง"],["Peony","พีโอนี"],["Poinsettia","พอยน์เซ็ตเทีย"],["Orchid","กล้วยไม้"],["Jasmine","มะลิ"],["Plumeria","ลีลาวดี"],
  ["Water Lily","บัวสาย"],["Iris","ไอริส"],["Poppy","ป๊อปปี้"],["Baby's Breath","ยิปโซ"],["Hydrangea","ไฮเดรนเยีย"],["Cherry Blossom","ซากุระ"],["Magnolia","แมกโนเลีย"],["Morning Glory","ผักบุ้งฝรั่ง"],
  ["Gerbera","เยอบีร่า"],["Sweet Pea","สวีทพี"],["Cornflower","คอร์นฟลาวเวอร์"],["Violet","ไวโอเลต"],["Buttercup","บัตเตอร์คัพ"],["Bluebell","บลูเบลล์"],["Anthurium","หน้าวัว"],["Cockscomb","หงอนไก่"],
  ["Camellia","คามิเลีย"],["Calla Lily","คาล่าลิลลี่"],["Clematis","เคลมาติส"],["Freesia","ฟรีเซีย"],["Anemone","อนีโมนี"],["Cosmos","คอสมอส"],["Narcissus","นาร์ซิสซัส"],["Gazania","กาซาเนีย"],
  ["Foxglove","ฟอกซ์โกลฟ"],["Astilbe","แอสทิลบี"],["Tiger Lily","ลิลลี่เสือ"],["Tuberose","ซ่อนกลิ่น"],["Salvia","ซัลเวีย"],["Zinnia","ซินเนีย"],["Mimosa","มิโมซา"],["Forget-me-not","อย่าลืมฉัน"],
]};

PICDICT_WORDS['Furniture.png'] = {cols:8, rows:8, words:[
  ["Sofa","โซฟา"],["Armchair","เก้าอี้นวม"],["Chair","เก้าอี้"],["Stool","เก้าอี้สตูล"],["Table","โต๊ะ"],["Coffee Table","โต๊ะกาแฟ"],["TV Stand","ชั้นวางทีวี"],["Bookshelf","ชั้นหนังสือ"],
  ["Wardrobe","ตู้เสื้อผ้า"],["Dresser","โต๊ะเครื่องแป้ง"],["Chest of Drawers","ตู้ลิ้นชัก"],["Bedside Table","โต๊ะข้างเตียง"],["Bed","เตียง"],["Mattress","ที่นอน"],["Headboard","หัวเตียง"],["Footboard","ท้ายเตียง"],
  ["Dining Table","โต๊ะอาหาร"],["Dining Chair","เก้าอี้ทานอาหาร"],["Bar Stool","เก้าอี้บาร์"],["Side Table","โต๊ะข้าง"],["Console Table","โต๊ะคอนโซล"],["Desk","โต๊ะทำงาน"],["Office Chair","เก้าอี้สำนักงาน"],["Filing Cabinet","ตู้เก็บเอกสาร"],
  ["Vanity Table","โต๊ะเครื่องแป้ง"],["Dressing Stool","เก้าอี้แต่งหน้า"],["Mirror","กระจก"],["Shoe Rack","ชั้นวางรองเท้า"],["Coat Rack","ไม้แขวนเสื้อ"],["Hall Tree","ชั้นวางพร้อมที่แขวน"],["Storage Bench","ม้านั่งเก็บของ"],["Trunk","หีบ"],
  ["Rocking Chair","เก้าอี้โยก"],["Recliner","เก้าอี้ปรับเอน"],["Bean Bag","เบาะนั่งบีนแบ็ก"],["Chaise Lounge","เก้าอี้เลานจ์"],["Bench","ม้านั่ง"],["Ottoman","ออตโตมัน"],["Footstool","ที่วางเท้า"],["Pouf","พัฟ"],
  ["Cabinet","ตู้เก็บของ"],["Display Cabinet","ตู้โชว์"],["Cupboard","ตู้กับข้าว"],["Sideboard","ตู้เตี้ย"],["Hutch","ตู้ลอย"],["Media Console","ชั้นวางสื่อบันเทิง"],["Nightstand","โต๊ะหัวเตียง"],["Plant Stand","ชั้นวางต้นไม้"],
  ["Picnic Table","โต๊ะปิกนิก"],["Folding Chair","เก้าอี้พับ"],["Folding Table","โต๊ะพับ"],["Garden Bench","ม้านั่งสนาม"],["Hammock","เปลญวน"],["Patio Set","ชุดโต๊ะสนาม"],["Swing Chair","เก้าอี้แขวน"],["Storage Box","กล่องเก็บของ"],
  ["Crib","เตียงเด็กอ่อน"],["High Chair","เก้าอี้เด็ก"],["Changing Table","โต๊ะเปลี่ยนผ้าอ้อม"],["Bookcase","ชั้นหนังสือ"],["Wall Shelf","ชั้นติดผนัง"],["Floating Shelf","ชั้นลอยติดผนัง"],["Filing Shelf","ชั้นวางเอกสาร"],["Room Divider","ฉากกั้นห้อง"],
]};

PICDICT_WORDS['Hobbies.png'] = {cols:7, rows:4, words:[
  ["Reading","การอ่าน"],["Drawing","การวาดภาพ"],["Painting","การวาดภาพระบายสี"],["Cooking","การทำอาหาร"],["Baking","การอบขนม"],["Gardening","การทำสวน"],["Camping","การตั้งแคมป์"],
  ["Hiking","การเดินป่า"],["Photography","การถ่ายภาพ"],["Knitting","การถักไหมพรม"],["Sewing","การเย็บผ้า"],["Collecting Stamps","การสะสมแสตมป์"],["Collecting Coins","การสะสมเหรียญ"],["Playing Cards","การเล่นหมากรุก"],
  ["Watching Movies","การดูหนัง"],["Listening to Music","การฟังเพลง"],["Singing","การร้องเพลง"],["Dancing","การเต้น"],["Writing","การเขียน"],["Blogging","การเขียนบล็อก"],["Bird Watching","การดูนก"],
  ["Cycling","การปั่นจักรยาน"],["Running","การวิ่ง"],["Yoga","การเล่นโยคะ"],["Meditation","การทำสมาธิ"],["Puzzle Solving","การต่อจิ๊กซอว์"],["DIY Crafts","งานประดิษฐ์"],
]};

PICDICT_WORDS['Holidays.png'] = {cols:8, rows:5, words:[
  ["New Year's Day","วันปีใหม่"],["Valentine's Day","วันวาเลนไทน์"],["Easter","วันอีสเตอร์"],["Family Day","วันครอบครัว"],["Songkran Festival","เทศกาลสงกรานต์"],["Labour Day","วันแรงงาน"],["Mother's Day","วันแม่"],["Father's Day","วันพ่อ"],
  ["Independence Day","วันชาติอเมริกา"],["Buddha Day","วันวิสาขบูชา"],["Halloween","วันฮาโลวีน"],["Loy Krathong","วันลอยกระทง"],["Thanksgiving Day","วันขอบคุณพระเจ้า"],["Christmas Day","วันคริสต์มาส"],["Boxing Day","วันบ็อกซิ่งเดย์"],["New Year's Eve","วันสิ้นปี"],
  ["Chinese New Year","วันตรุษจีน"],["Mid-Autumn Festival","เทศกาลไหว้พระจันทร์"],["Holi Festival","เทศกาลโฮลี"],["Carnival","เทศกาลคาร์นิวัล"],["Diwali","เทศกาลดีวาลี"],["Ramadan","รอมฎอน"],["Eid al-Fitr","อีดิลฟิตรี"],["Eid al-Adha","อีดิลอัฎฮา"],
  ["Children's Day","วันเด็ก"],["Teacher's Day","วันครู"],["Nurses Day","วันพยาบาล"],["Earth Day","วันคุ้มครองโลก"],["Environment Day","วันสิ่งแวดล้อม"],["Peace Day","วันสันติภาพ"],["Human Rights Day","วันสิทธิมนุษยชน"],["Women's Day","วันสตรีสากล"],
  ["Palm Sunday","วันปาล์มซันเดย์"],["Good Friday","วันศุกร์ประเสริฐ"],["Easter Sunday","วันอีสเตอร์ซันเดย์"],["Hanukkah","ฮานุกกะห์"],["Kwanzaa","ควานซา"],["Bastille Day","วันบาสตีย์"],["Oktoberfest","เทศกาลเบียร์"],["St. Patrick's Day","วันเซนต์แพทริก"],
]};

PICDICT_WORDS['House.png'] = {cols:8, rows:8, words:[
  ["House","บ้าน"],["Living Room","ห้องนั่งเล่น"],["Kitchen","ห้องครัว"],["Bedroom","ห้องนอน"],["Bathroom","ห้องน้ำ"],["Dining Room","ห้องอาหาร"],["Garage","โรงรถ"],["Garden","สวน"],
  ["Door","ประตู"],["Window","หน้าต่าง"],["Roof","หลังคา"],["Wall","ผนัง"],["Floor","พื้น"],["Ceiling","เพดาน"],["Stairs","บันได"],["Balcony","ระเบียง"],
  ["Sofa","โซฟา"],["Armchair","เก้าอี้นวม"],["Table","โต๊ะ"],["Chair","เก้าอี้"],["Bed","เตียง"],["Wardrobe","ตู้เสื้อผ้า"],["Dresser","โต๊ะเครื่องแป้ง"],["Bookshelf","ชั้นหนังสือ"],
  ["Television","โทรทัศน์"],["Air Conditioner","เครื่องปรับอากาศ"],["Fan","พัดลม"],["Lamp","โคมไฟ"],["Clock","นาฬิกา"],["Picture","รูปภาพ"],["Mirror","กระจก"],["Rug","พรม"],
  ["Refrigerator","ตู้เย็น"],["Stove","เตา"],["Microwave","ไมโครเวฟ"],["Sink","อ่างล้างจาน"],["Cabinet","ตู้เก็บของ"],["Dishwasher","เครื่องล้างจาน"],["Kettle","กาต้มน้ำ"],["Toaster","เครื่องปิ้งขนมปัง"],
  ["Washing Machine","เครื่องซักผ้า"],["Vacuum Cleaner","เครื่องดูดฝุ่น"],["Iron","เตารีด"],["Hanger","ไม้แขวนเสื้อ"],["Laundry Basket","ตะกร้าผ้า"],["Trash Bin","ถังขยะ"],["Broom","ไม้กวาด"],["Dustpan","ที่ตักผง"],
  ["Toilet","โถส้วม"],["Sink","อ่างล้างหน้า"],["Shower","ฝักบัว"],["Bathtub","อ่างอาบน้ำ"],["Towel","ผ้าเช็ดตัว"],["Soap","สบู่"],["Toothbrush","แปรงสีฟัน"],["Toilet Paper","กระดาษชำระ"],
  ["Front Door","ประตูหน้า"],["Back Door","ประตูหลัง"],["Mailbox","ตู้จดหมาย"],["Doorbell","กริ่งประตู"],["Curtain","ผ้าม่าน"],["Doormat","พรมเช็ดเท้า"],["Key","กุญแจ"],["Lock","แม่กุญแจ"],
]};

PICDICT_WORDS['Insects.png'] = {cols:8, rows:8, words:[
  ["Ant","มด"],["Bee","ผึ้ง"],["Butterfly","ผีเสื้อ"],["Ladybug","เต่าทอง"],["Dragonfly","แมลงปอ"],["Grasshopper","ตั๊กแตน"],["Cricket","จิ้งหรีด"],["Mosquito","ยุง"],
  ["Fly","แมลงวัน"],["Cicada","จักจั่น"],["Beetle","ด้วง"],["Stag Beetle","ด้วงกว่าง"],["Firefly","หิ่งห้อย"],["Termite","ปลวก"],["Cockroach","แมลงสาบ"],["Moth","มอด"],
  ["Wasp","แตน"],["Hornet","ตัวต่อ"],["Aphid","เพลี้ย"],["Caterpillar","หนอนผีเสื้อ"],["Earthworm","ไส้เดือนดิน"],["Centipede","ตะขาบ"],["Millipede","กิ้งกือ"],["Snail","หอยทาก"],
  ["Slug","ทาก"],["Praying Mantis","ตั๊กแตนตำข้าว"],["Leaf Insect","แมลงใบไม้"],["Stick Insect","แมลงกิ่งไม้"],["Dung Beetle","ด้วงมูล"],["Bumblebee","ผึ้งกู่"],["Carpenter Ant","มดช่างไม้"],["Weevil","ด้วงงวง"],
  ["Pill Bug","ตัวตัดไม้"],["Silverfish","แมลงเงิน"],["Lacewing","แมลงช้างปีกใส"],["Leafhopper","เพลี้ยจักจั่น"],["Bedbug","ตัวเรือด"],["Flea","หมัด"],["Louse","เหา"],["Thrips","เพลี้ยไฟ"],
  ["Whitefly","แมลงหวี่ขาว"],["Scale Insect","เพลี้ยหอย"],["Mealybug","เพลี้ยแป้ง"],["Leaf Miner","หนอนชอนใบ"],["Sawfly","ตัวต่อเลื่อย"],["Soldier Beetle","ด้วงทหาร"],["Rove Beetle","ด้วงกันกระดก"],["Water Strider","แมงมุมขายาว"],
  ["Backswimmer","แมลงดำน้ำ"],["Giant Water Bug","แมลงดินน้ำ"],["Alderfly","แมลงคริสตัล"],["Dobsonfly","แมลงตะปู"],["Antlion","มดสิงโต"],["Sand Flea","หมัดทราย"],["False Scorpion","แมงป่องเทียม"],["Springtail","สัตว์หางกระโดด"],
  ["Stonefly","แมลงหิน"],["Mayfly","แมลงเม่า"],["Caddisfly","แมลงหวี่น้ำ"],["Blackfly","แมลงกันปล่อง"],["Midge","แมลงหวี"],["Gnat","แมลงหวี่"],["Sandfly","แมลงทราย"],["Tsetse Fly","แมลงวันเซ"],
]};

PICDICT_WORDS['Jobs.png'] = {cols:8, rows:6, words:[
  ["Teacher","ครู"],["Doctor","หมอ"],["Nurse","พยาบาล"],["Police Officer","ตำรวจ"],["Firefighter","นักดับเพลิง"],["Chef","เชฟ"],["Farmer","เกษตรกร"],["Driver","คนขับรถ"],
  ["Pilot","นักบิน"],["Flight Attendant","พนักงานต้อนรับบนเครื่องบิน"],["Scientist","นักวิทยาศาสตร์"],["Engineer","วิศวกร"],["Architect","สถาปนิก"],["Dentist","ทันตแพทย์"],["Vet","สัตวแพทย์"],["Pharmacist","เภสัชกร"],
  ["Lawyer","ทนายความ"],["Judge","ผู้พิพากษา"],["Accountant","นักบัญชี"],["Banker","พนักงานธนาคาร"],["Reporter","นักข่าว"],["Photographer","ช่างภาพ"],["Musician","นักดนตรี"],["Artist","จิตรกร"],
  ["Singer","นักร้อง"],["Dancer","นักเต้น"],["Teacher Assistant","ผู้ช่วยครู"],["Librarian","บรรณารักษ์"],["Postman","บุรุษไปรษณีย์"],["Delivery Driver","พนักงานส่งของ"],["Cleaner","พนักงานทำความสะอาด"],["Gardener","คนสวน"],
  ["Barber","ช่างตัดผม"],["Beautician","ช่างเสริมสวย"],["Tailor","ช่างตัดเสื้อ"],["Baker","คนทำขนมปัง"],["Butcher","พ่อค้าเนื้อ"],["Fishmonger","พ่อค้าปลา"],["Carpenter","ช่างไม้"],["Electrician","ช่างไฟ"],
  ["Plumber","ช่างประปา"],["Mechanic","ช่างยนต์"],["Security Guard","รปภ."],["Zoo Keeper","ผู้ดูแลสวนสัตว์"],["Astronaut","นักบินอวกาศ"],["Soldier","ทหาร"],["Lifeguard","เจ้าหน้าที่ช่วยชีวิต"],["Counselor","ที่ปรึกษา"],
]};

PICDICT_WORDS['Kitchen.png'] = {cols:8, rows:8, words:[
  ["Pot","หม้อ"],["Pan","กระทะ"],["Kettle","กาต้มน้ำ"],["Saucepan","หม้อด้าม"],["Rice Cooker","หม้อหุงข้าว"],["Pressure Cooker","หม้ออัดความดัน"],["Stove","เตา"],["Microwave","ไมโครเวฟ"],
  ["Refrigerator","ตู้เย็น"],["Toaster","เครื่องปิ้งขนมปัง"],["Blender","เครื่องปั่น"],["Food Processor","เครื่องเตรียมอาหาร"],["Dishwasher","เครื่องล้างจาน"],["Sink","อ่างล้างจาน"],["Faucet","ก๊อกน้ำ"],["Dish Rack","ชั้นวางจาน"],
  ["Plate","จาน"],["Bowl","ชาม"],["Soup Bowl","ชามซุป"],["Glass","แก้วน้ำ"],["Mug","แก้วมัค"],["Cup","ถ้วย"],["Water Bottle","ขวดน้ำ"],["Thermos","กระติกน้ำ"],
  ["Spoon","ช้อน"],["Fork","ส้อม"],["Knife","มีด"],["Cutting Board","เขียง"],["Chef's Knife","มีดเชฟ"],["Ladle","ทัพพี"],["Spatula","ตะหลิว"],["Tongs","ที่คีบอาหาร"],
  ["Whisk","ตะกร้อมือ"],["Grater","ที่ขูด"],["Colander","ตะแกรง"],["Strainer","กระชอน"],["Measuring Cup","ถ้วยตวง"],["Measuring Spoons","ช้อนตวง"],["Kitchen Scale","ตาชั่งดิจิทัล"],["Kitchen Timer","นาฬิกาจับเวลา"],
  ["Salt","เกลือ"],["Pepper","พริกไทย"],["Sugar","น้ำตาล"],["Cooking Oil","น้ำมันปรุงอาหาร"],["Soy Sauce","ซีอิ๊ว"],["Vinegar","น้ำส้มสายชู"],["Ketchup","ซอสมะเขือเทศ"],["Mayonnaise","มายองเนส"],
  ["Pot Holder","ผ้ารองหม้อ"],["Oven Mitt","ถุงมือกันร้อน"],["Apron","ผ้ากันเปื้อน"],["Kitchen Towel","ผ้าเช็ดมือ"],["Paper Towel","กระดาษทิชชู่"],["Trash Can","ถังขยะ"],["Recycling Bin","ถังรีไซเคิล"],["Garbage Bag","ถุงขยะ"],
  ["Lunch Box","กล่องอาหาร"],["Food Container","กล่องเก็บอาหาร"],["Cling Wrap","ฟิล์มถนอมอาหาร"],["Aluminum Foil","อลูมิเนียมฟอยล์"],["Baking Tray","ถาดอบ"],["Muffin Pan","พิมพ์คัพเค้ก"],["Cooling Rack","ตะแกรงพักขนม"],["Rolling Pin","ไม้คลึงแป้ง"],
]};

PICDICT_WORDS['MusicalInstruments.png'] = {cols:8, rows:5, words:[
  ["Piano","เปียโน"],["Violin","ไวโอลิน"],["Guitar","กีตาร์"],["Trumpet","ทรัมเป็ต"],["Saxophone","แซกโซโฟน"],["Clarinet","คลาริเน็ต"],["Flute","ขลุ่ย"],["Trombone","ทรอมโบน"],
  ["Drums","กลองชุด"],["Tambourine","แทมบูรีน"],["Triangle","สามเหลี่ยม"],["Maracas","มาราคัส"],["Xylophone","ไซโลโฟน"],["Glockenspiel","กล็อคเคนซปีล"],["Harp","ฮาร์ป"],["Accordion","แอคคอร์เดียน"],
  ["Ukulele","อูคูเลเล่"],["Banjo","แบนโจ"],["Mandolin","แมนโดลิน"],["Cello","เชลโล"],["Double Bass","ดับเบิลเบส"],["Recorder","รีคอร์เดอร์"],["Ocarina","โอคารินา"],["Harmonica","ฮาร์โมนิกา"],
  ["Bagpipes","ปี่สก็อต"],["French Horn","เฟรนช์ฮอร์น"],["Tuba","ทูบา"],["Euphonium","ยูโฟเนียม"],["Oboe","โอโบ"],["Bassoon","บาสซูน"],["Kalimba","คาลิมบา"],["Castanets","คาสทาเน็ตส์"],
  ["Cymbals","ฉาบ"],["Bongos","บองโก"],["Congas","คองกา"],["Djembe","เจมเบ้"],["Snare Drum","สแนร์ดรัม"],["Bass Drum","เบสดรัม"],["Timpani","ทิมพานี"],["Melodica","เมโลดิกา"],
]};

PICDICT_WORDS['Nature.png'] = {cols:8, rows:9, words:[
  ["Sun","ดวงอาทิตย์"],["Moon","ดวงจันทร์"],["Star","ดาว"],["Cloud","เมฆ"],["Rainbow","สายรุ้ง"],["Sky","ท้องฟ้า"],["Wind","ลม"],["Air","อากาศ"],
  ["Rain","ฝน"],["Snow","หิมะ"],["Lightning","ฟ้าผ่า"],["Thunder","ฟ้าร้อง"],["Storm","พายุ"],["Fog","หมอก"],["Dew","น้ำค้าง"],["Frost","น้ำค้างแข็ง"],
  ["Water","น้ำ"],["Ocean","มหาสมุทร"],["Sea","ทะเล"],["Lake","ทะเลสาบ"],["River","แม่น้ำ"],["Stream","ลำธาร"],["Pond","บึง"],["Waterfall","น้ำตก"],
  ["Mountain","ภูเขา"],["Hill","เนินเขา"],["Valley","หุบเขา"],["Volcano","ภูเขาไฟ"],["Cave","ถ้ำ"],["Cliff","หน้าผา"],["Desert","ทะเลทราย"],["Island","เกาะ"],
  ["Forest","ป่า"],["Jungle","ป่าดงดิบ"],["Tree","ต้นไม้"],["Flower","ดอกไม้"],["Grass","หญ้า"],["Leaf","ใบไม้"],["Plant","พืช"],["Mushroom","เห็ด"],
  ["Rose","กุหลาบ"],["Sunflower","ทานตะวัน"],["Tulip","ทิวลิป"],["Lotus","ดอกบัว"],["Cactus","กระบองเพชร"],["Bamboo","ไผ่"],["Pine Tree","ต้นสน"],["Palm Tree","ต้นปาล์ม"],
  ["Butterfly","ผีเสื้อ"],["Bee","ผึ้ง"],["Ant","มด"],["Ladybug","แมลงเต่าทอง"],["Dragonfly","แมลงปอ"],["Bird","นก"],["Fish","ปลา"],["Frog","กบ"],
  ["Rabbit","กระต่าย"],["Squirrel","กระรอก"],["Deer","กวาง"],["Bear","หมี"],["Elephant","ช้าง"],["Lion","สิงโต"],["Giraffe","ยีราฟ"],["Turtle","เต่า"],
  ["Rock","หิน"],["Soil","ดิน"],["Sand","ทราย"],["Spring","ฤดูใบไม้ผลิ"],["Summer","ฤดูร้อน"],["Autumn","ฤดูใบไม้ร่วง"],["Winter","ฤดูหนาว"],["Earth","โลก"],
]};

PICDICT_WORDS['Opposites.png'] = {cols:8, rows:8, words:[
  ["Happy","มีความสุข"],["Sad","เศร้า"],["Big","ใหญ่"],["Small","เล็ก"],["Strong","แข็งแรง"],["Weak","อ่อนแอ"],["Tall","สูง"],["Short","เตี้ย"],
  ["Hot","ร้อน"],["Cold","หนาว"],["Clean","สะอาด"],["Dirty","สกปรก"],["Open","เปิด"],["Close","ปิด"],["Full","เต็ม"],["Empty","ว่างเปล่า"],
  ["Bright","สว่าง"],["Dark","มืด"],["Loud","ดัง"],["Quiet","เงียบ"],["Early","เช้า"],["Late","ดึก"],["Easy","ง่าย"],["Difficult","ยาก"],
  ["Generous","ใจกว้าง"],["Selfish","เห็นแก่ตัว"],["Kind","ใจดี"],["Mean","ใจร้าย"],["Honest","ซื่อสัตย์"],["Dishonest","ไม่ซื่อสัตย์"],["Brave","กล้าหาญ"],["Scared","กลัว"],
  ["New","ใหม่"],["Old","เก่า"],["Expensive","แพง"],["Cheap","ถูก"],["Interesting","น่าสนใจ"],["Boring","น่าเบื่อ"],["Patient","อดทน"],["Impatient","ใจร้อน"],
  ["Fast","เร็ว"],["Slow","ช้า"],["Heavy","หนัก"],["Light","เบา"],["Healthy","แข็งแรง"],["Sick","ป่วย"],["Hard","แข็ง"],["Soft","นุ่ม"],
  ["Neat","เป็นระเบียบ"],["Messy","รก"],["Wet","เปียก"],["Dry","แห้ง"],["Safe","ปลอดภัย"],["Dangerous","อันตราย"],["Lucky","โชคดี"],["Unlucky","โชคร้าย"],
  ["On","เปิด"],["Off","ปิด"],["First","แรก"],["Last","สุดท้าย"],["Left","ซ้าย"],["Right","ขวา"],["Up","ขึ้น"],["Down","ลง"],
]};

PICDICT_WORDS['Places.png'] = {cols:8, rows:8, words:[
  ["School","โรงเรียน"],["Hospital","โรงพยาบาล"],["Bank","ธนาคาร"],["Post Office","ไปรษณีย์"],["Police Station","สถานีตำรวจ"],["Fire Station","สถานีดับเพลิง"],["Library","ห้องสมุด"],["Supermarket","ซูเปอร์มาร์เก็ต"],
  ["Park","สวนสาธารณะ"],["Playground","สนามเด็กเล่น"],["Zoo","สวนสัตว์"],["Museum","พิพิธภัณฑ์"],["Art Gallery","แกลเลอรีศิลปะ"],["Theater","โรงละคร"],["Cinema","โรงภาพยนตร์"],["Concert Hall","หอคอนเสิร์ต"],
  ["Restaurant","ร้านอาหาร"],["Cafe","คาเฟ่"],["Bakery","ร้านเบเกอรี่"],["Bookstore","ร้านหนังสือ"],["Toy Store","ร้านของเล่น"],["Flower Shop","ร้านดอกไม้"],["Clothing Store","ร้านเสื้อผ้า"],["Electronics Store","ร้านอิเล็กทรอนิกส์"],
  ["Airport","สนามบิน"],["Bus Station","สถานีขนส่ง"],["Train Station","สถานีรถไฟ"],["Subway Station","สถานีรถไฟใต้ดิน"],["Pier","ท่าเรือ"],["Harbor","ท่าเรือขนส่ง"],["Gas Station","ปั้มน้ำมัน"],["Parking Lot","ลานจอดรถ"],
  ["House","บ้าน"],["Apartment","อพาร์ตเมนต์"],["Condominium","คอนโดมิเนียม"],["Hotel","โรงแรม"],["Resort","รีสอร์ท"],["Villa","วิลล่า"],["Guesthouse","เกสต์เฮาส์"],["Campsite","ลานกางเต็นท์"],
  ["Beach","ชายหาด"],["Island","เกาะ"],["Mountain","ภูเขา"],["Waterfall","น้ำตก"],["Forest","ป่า"],["Lake","ทะเลสาบ"],["River","แม่น้ำ"],["Cave","ถ้ำ"],
  ["Farm","ฟาร์ม"],["Greenhouse","เรือนกระจก"],["Swimming Pool","สระว่ายน้ำ"],["Gym","ยิม"],["Stadium","สนามกีฬา"],["Golf Course","สนามกอล์ฟ"],["Tennis Court","สนามเทนนิส"],["Skate Park","สเกตพาร์ก"],
  ["Church","โบสถ์"],["Temple","วัด"],["Mosque","มัสยิด"],["Shrine","ศาลเจ้า"],["Cemetery","สุสาน"],["Lighthouse","ประภาคาร"],["Lookout Point","จุดชมวิว"],["Observatory","หอดูดาว"],
]};

PICDICT_WORDS['Prepositions.png'] = {cols:8, rows:5, words:[
  ["in","ใน"],["on","บน"],["under","ใต้"],["next to","ข้างๆ"],["between","ระหว่าง"],["in front of","หน้าของ"],["behind","ข้างหลัง"],["at","ที่"],
  ["above","เหนือ"],["below","ใต้"],["up","ขึ้น"],["down","ลง"],["inside","ข้างใน"],["outside","ข้างนอก"],["over","เหนือ"],["under","ใต้"],
  ["before","ก่อน"],["after","หลัง"],["for","สำหรับ"],["to","ถึง"],["of","ของ"],["with","กับ"],["without","โดยไม่มี"],["like","เหมือน"],
  ["into","เข้าไปใน"],["out of","ออกจาก"],["near","ใกล้"],["far","ไกล"],["close to","ใกล้กับ"],["far from","ไกลจาก"],["through","ผ่าน"],["throughout","ทั่วทั้ง"],
  ["on top of","บนสุดของ"],["underneath","ใต้สุดของ"],["against","ชิดกับ"],["beside","ข้างๆ"],["across","ข้าม"],["along","ตามแนว"],["around","รอบๆ"],["toward","ไปทาง"],
]};

PICDICT_WORDS['Safety Signs.png'] = {cols:8, rows:5, words:[
  ["No Smoking","ห้ามสูบบุหรี่"],["No Open Flame","ห้ามก่อไฟ"],["No Eating or Drinking","ห้ามกินหรือดื่ม"],["Do Not Enter","ห้ามเข้า"],["Do Not Touch","ห้ามจับ"],["Warning","คำเตือน"],["High Voltage","ไฟฟ้าแรงสูง"],["Slippery Floor","พื้นลื่น"],
  ["Falling Objects","ระวังวัตถุตก"],["Fire Hazard","อันตรายจากไฟ"],["Toxic Hazard","อันตรายสารพิษ"],["Corrosive Material","สารกัดกร่อน"],["Explosive Material","วัตถุระเบิด"],["Biohazard","อันตรายชีวภาพ"],["Radiation Hazard","อันตรายรังสี"],["Beware of Dog","ระวังสุนัข"],
  ["First Aid","ปฐมพยาบาล"],["Emergency Exit","ทางออกฉุกเฉิน"],["Exit","ทางออก"],["Assembly Point","จุดรวมพล"],["Emergency Shower","ฝักบัวฉุกเฉิน"],["Eye Wash","ล้างตาฉุกเฉิน"],["Wear Helmet","สวมหมวกนิรภัย"],["Wear Goggles","สวมแว่นตา"],
  ["Wear Ear Protection","สวมที่ปิดหู"],["Wear Mask","สวมหน้ากาก"],["Wear Gloves","สวมถุงมือ"],["Wear Safety Shoes","สวมรองเท้านิรภัย"],["Wear Vest","สวมเสื้อสะท้อนแสง"],["Wear Safety Harness","สวมเข็มขัดนิรภัย"],["Wash Hands","ล้างมือ"],["Fasten Seat Belt","คาดเข็มขัดนิรภัย"],
  ["Fire Extinguisher","ถังดับเพลิง"],["Fire Hose Reel","สายฉีดน้ำดับเพลิง"],["Fire Alarm","สัญญาณเตือนอัคคีภัย"],["Emergency Phone","โทรศัพท์ฉุกเฉิน"],["Fire Exit","ทางหนีไฟ"],["Fire Ladder","บันไดหนีไฟ"],["Push Bar to Open","ผลักเพื่อเปิด"],["Push Button in Emergency","กดปุ่มในกรณีฉุกเฉิน"],
]};

PICDICT_WORDS['School.png'] = {cols:8, rows:8, words:[
  ["Backpack","กระเป๋าเป้"],["Pencil","ดินสอ"],["Pen","ปากกา"],["Eraser","ยางลบ"],["Sharpener","กบเหลาดินสอ"],["Ruler","ไม้บรรทัด"],["Notebook","สมุดโน้ต"],["Book","หนังสือ"],
  ["Crayons","สีเทียน"],["Colored Pencils","ดินสอสี"],["Highlighter","ปากกาเน้นข้อความ"],["Scissors","กรรไกร"],["Glue Stick","กาวแท่ง"],["Glue","กาว"],["Tape","เทปใส"],["Calculator","เครื่องคิดเลข"],
  ["Folder","แฟ้มเอกสาร"],["Clipboard","แผ่นรองเขียน"],["Pencil Case","กล่องดินสอ"],["Lunch Box","กล่องข้าว"],["Water Bottle","ขวดน้ำ"],["Apple","แอปเปิล"],["Chalkboard","กระดานดำ"],["Whiteboard","กระดานไวท์บอร์ด"],
  ["Teacher","ครู"],["Student","นักเรียน"],["Desk","โต๊ะเรียน"],["Chair","เก้าอี้"],["School","โรงเรียน"],["Classroom","ห้องเรียน"],["Library","ห้องสมุด"],["Computer","คอมพิวเตอร์"],
  ["Globe","ลูกโลก"],["Microscope","กล้องจุลทรรศน์"],["Science","วิทยาศาสตร์"],["Ball","ลูกบอล"],["Paint","สี"],["Art","ศิลปะ"],["Music","ดนตรี"],["Magnifying Glass","แว่นขยาย"],
  ["Map","แผนที่"],["Compass","เข็มทิศ"],["Protractor","โปรแทรกเตอร์"],["Set Square","ฉากสามเหลี่ยม"],["Chart","แผนภูมิ"],["Sticky Notes","กระดาษโน้ต"],["Binder Clip","คลิปหนีบกระดาษ"],["Paper Clip","ลวดเสียบกระดาษ"],
  ["Push Pin","หมุด"],["Stapler","เครื่องเย็บกระดาษ"],["Stamp","ตราประทับ"],["Name Tag","ป้ายชื่อ"],["Attendance","การมาเรียน"],["Homework","การบ้าน"],["Test","แบบทดสอบ"],["Certificate","เกียรติบัตร"],
  ["Bell","กระดิ่ง"],["Clock","นาฬิกา"],["Agenda","สมุดวางแผน"],["Calendar","ปฏิทิน"],["Uniform","ชุดนักเรียน"],["Cafeteria","โรงอาหาร"],["School Bus","รถโรงเรียน"],["Playground","สนามเด็กเล่น"],
]};

PICDICT_WORDS['SeaAnimals.png'] = {cols:8, rows:7, words:[
  ["Whale","วาฬ"],["Dolphin","โลมา"],["Sea Turtle","เต่าทะเล"],["Shark","ฉลาม"],["Ray","กระเบน"],["Octopus","ปลาหมึกยักษ์"],["Squid","ปลาหมึก"],["Jellyfish","แมงกะพรุน"],
  ["Seahorse","ม้าน้ำ"],["Clownfish","ปลาการ์ตูน"],["Blue Tang","ปลาบลูแทง"],["Pufferfish","ปลาปักเป้า"],["Starfish","ปลาดาว"],["Sea Urchin","เม่นทะเล"],["Sand Dollar","เหรียญทะเล"],["Seashell","เปลือกหอย"],
  ["Crab","ปู"],["Lobster","กุ้งมังกร"],["Shrimp","กุ้ง"],["Prawn","กุ้งแชบ๊วย"],["Hermit Crab","ปูเสฉวน"],["Sea Snail","หอยทากทะเล"],["Conch","หอยสังข์"],["Mussel","หอยแมลงภู่"],
  ["Oyster","หอยนางรม"],["Scallop","หอยเชลล์"],["Clam","หอยตลับ"],["Abalone","หอยเป๋าฮื้อ"],["Nudibranch","ทากทะเล"],["Cuttlefish","หมึกกระดอง"],["Sea Anemone","ดอกไม้ทะเล"],["Coral","ปะการัง"],
  ["Lionfish","ปลาสิงโต"],["Angelfish","ปลาเทวดา"],["Butterflyfish","ปลาผีเสื้อ"],["Parrotfish","ปลานกแก้ว"],["Moray Eel","ปลาไหลมอเรย์"],["Tuna","ปลาทูน่า"],["Swordfish","ปลากระโทงร่ม"],["Sailfish","ปลากระโทงเกง"],
  ["Marlin","ปลามาร์ลิน"],["Mahi Mahi","ปลาหางนกยูง"],["Grouper","ปลากะพง"],["Snapper","ปลากะพงแดง"],["Barracuda","ปลากุเลา"],["Flying Fish","ปลาบิน"],["Seadragon","มังกรทะเล"],["Sea Cucumber","ปลิงทะเล"],
  ["Manta Ray","ปลากระเบนราหู"],["Whale Shark","ฉลามวาฬ"],["Dugong","พะยูน"],["Orca","วาฬเพชฌฆาต"],["Beluga","วาฬเบลูก้า"],["Harp Seal","แมวน้ำ"],["Sea Lion","สิงโตทะเล"],["Walrus","วอลรัส"],
]};
