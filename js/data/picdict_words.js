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
