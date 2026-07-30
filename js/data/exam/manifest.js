/* เจนอัตโนมัติโดย tools/gen_exam_std_manifest.py — ห้ามแก้มือ (แก้ไฟล์ json แล้วรันสคริปต์ใหม่)
   สารบัญชุดข้อสอบจริงแบบมาตรฐาน (รอบ 812) — ตัวข้อสอบโหลดขี้เกียจผ่าน fetch ใน js/examstd.js */
const EXAM_STD_MANIFEST = {
  ielts:{emoji:"📘", label:"IELTS Academic", sub:"ไวยากรณ์ + การอ่านเชิงวิชาการ", sets:[
    {id:"ielts_1", f:"ielts_1.json", label:"IELTS Academic · ชุดที่ 1", q:30, passages:2, secs:[{n:"Part 1 · Grammar & Structure", q:12, p:0}, {n:"Part 2 · Reading Passage 1", q:9, p:1}, {n:"Part 3 · Reading Passage 2", q:9, p:1}]},
    {id:"ielts_2", f:"ielts_2.json", label:"IELTS Academic · ชุดที่ 2", q:30, passages:2, secs:[{n:"Part 1 · Grammar & Structure", q:12, p:0}, {n:"Part 2 · Reading Passage 1", q:9, p:1}, {n:"Part 3 · Reading Passage 2", q:9, p:1}]},
  ]},
  toeic:{emoji:"📗", label:"TOEIC Reading", sub:"ไวยากรณ์ + เอกสารธุรกิจ", sets:[
    {id:"toeic_1", f:"toeic_1.json", label:"TOEIC Reading · ชุดที่ 1", q:30, passages:4, secs:[{n:"Part 5 · Incomplete Sentences", q:12, p:0}, {n:"Part 6 · Text Completion", q:4, p:1}, {n:"Part 7 · Single Passage — Notice", q:4, p:1}, {n:"Part 7 · Single Passage — Advertisement", q:5, p:1}, {n:"Part 7 · Double Passage — Email + Schedule", q:5, p:1}]},
    {id:"toeic_2", f:"toeic_2.json", label:"TOEIC Reading · ชุดที่ 2", q:30, passages:3, secs:[{n:"Part 5 · Incomplete Sentences", q:12, p:0}, {n:"Part 6 · Text Completion", q:4, p:1}, {n:"Part 7 · Single Passage — Job Advertisement", q:5, p:1}, {n:"Part 7 · Double Passage — Invoice + E-mail", q:9, p:1}]},
  ]},
  toefl:{emoji:"📙", label:"TOEFL Structure & Reading", sub:"โครงสร้างประโยค + บทอ่านวิชาการ", sets:[
    {id:"toefl_1", f:"toefl_1.json", label:"TOEFL Structure & Reading · ชุดที่ 1", q:30, passages:2, secs:[{n:"Section 1 · Structure", q:6, p:0}, {n:"Section 2 · Written Expression", q:6, p:0}, {n:"Section 3 · Reading Passage 1", q:9, p:1}, {n:"Section 4 · Reading Passage 2", q:9, p:1}]},
    {id:"toefl_2", f:"toefl_2.json", label:"TOEFL Structure & Reading · ชุดที่ 2", q:30, passages:2, secs:[{n:"Section 1 · Structure", q:6, p:0}, {n:"Section 2 · Written Expression", q:6, p:0}, {n:"Section 3 · Reading Passage 1", q:9, p:1}, {n:"Section 4 · Reading Passage 2", q:9, p:1}]},
  ]},
};
