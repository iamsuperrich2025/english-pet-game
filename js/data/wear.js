"use strict";
/* ============================================================
   wear.js — ตำแหน่งวาง "ชุดที่ใส่" ทับภาพน้องท่าอื่น (รอบ 666)
   ⛔ ไฟล์นี้เจนอัตโนมัติด้วย `python tools/wearlab.py cut` ห้ามแก้มือ (โดนทับ)
   ทุกค่าเป็น "สัดส่วนของด้านภาพ" (ภาพน้องเป็นจัตุรัส 768x768 ทุกใบ)
     WEAR_PIECE  ชิ้นชุดที่ตัดเป็น PNG โปร่ง · w/h/dx/dy = หน่วยระยะห่างตา
                 s=head วางยึดยอดหัว (sk=จมลงในหัวกี่ % ของความสูงชิ้น) · s=eye ยึดเส้นตา
     WEAR_ANCHOR หมุดของภาพเป้าหมาย: ex,ey=กึ่งกลางตา · ed=ระยะห่างตา · ht=ยอดหัว
   ============================================================ */
const WEAR_PIECE = {
  cat_bell:{f:'img/wear/cat_bell.png',w:1.391,h:0.7642,dx:-0.6976,dy:0.669,s:'eye',sk:0,k:1,ox:0,oy:0},
  cat_bow:{f:'img/wear/cat_bow.png',w:1.6068,h:1.0888,dx:-0.8124,dy:0.4551,s:'eye',sk:0,k:1,ox:0,oy:0},
  cat_cap:{f:'img/wear/cat_cap.png',w:1.952,h:1.0293,dx:-0.9656,dy:-1.2443,s:'head',sk:0.52,k:1,ox:0,oy:0},
  cat_crown:{f:'img/wear/cat_crown.png',w:1.3232,h:0.7489,dx:-0.5743,dy:-1.5873,s:'head',sk:0.3,k:1.12,ox:0,oy:0},
  cat_glasses:{f:'img/wear/cat_glasses.png',w:1.6698,h:0.5629,dx:-0.8728,dy:-0.2748,s:'eye',sk:0,k:1,ox:0,oy:0},
  cat_scarf:{f:'img/wear/cat_scarf.png',w:1.8824,h:1.6975,dx:-0.8731,dy:0.4118,s:'eye',sk:0,k:1,ox:0,oy:0},
  cat_sunglasses:{f:'img/wear/cat_sunglasses.png',w:1.7752,h:0.4954,dx:-0.8073,dy:-0.2642,s:'eye',sk:0,k:1,ox:0,oy:0},
  cat_tophat:{f:'img/wear/cat_tophat.png',w:1.965,h:1.1123,dx:-0.9153,dy:-1.5199,s:'head',sk:0.4,k:1,ox:0,oy:0},
  dog_bell:{f:'img/wear/dog_bell.png',w:1.391,h:0.7642,dx:-0.6976,dy:0.669,s:'eye',sk:0,k:1,ox:0,oy:0},
  dog_bow:{f:'img/wear/dog_bow.png',w:1.7517,h:1.1594,dx:-0.8976,dy:0.534,s:'eye',sk:0,k:1,ox:0,oy:0},
  dog_cap:{f:'img/wear/dog_cap.png',w:1.952,h:1.0293,dx:-0.9656,dy:-1.2443,s:'head',sk:0.52,k:1,ox:0,oy:0},
  dog_crown:{f:'img/wear/dog_crown.png',w:1.7903,h:0.9463,dx:-0.9047,dy:-1.8673,s:'head',sk:0.3,k:1.12,ox:0,oy:0},
  dog_glasses:{f:'img/wear/dog_glasses.png',w:1.6698,h:0.5629,dx:-0.8728,dy:-0.2748,s:'eye',sk:0,k:1,ox:0,oy:0},
  dog_scarf:{f:'img/wear/dog_scarf.png',w:2.132,h:1.3642,dx:-1.052,dy:0.526,s:'eye',sk:0,k:1,ox:0,oy:0},
  dog_sunglasses:{f:'img/wear/dog_sunglasses.png',w:2.0257,h:0.6487,dx:-1.0067,dy:-0.2931,s:'eye',sk:0,k:1,ox:0,oy:0},
  dog_tophat:{f:'img/wear/dog_tophat.png',w:2.6618,h:1.4338,dx:-1.2765,dy:-1.8423,s:'head',sk:0.4,k:1,ox:0,oy:0},
  dragon_bell:{f:'img/wear/dragon_bell.png',w:1.391,h:0.7642,dx:-0.6976,dy:0.669,s:'eye',sk:0,k:1,ox:0,oy:0},
  dragon_bow:{f:'img/wear/dragon_bow.png',w:1.6172,h:1.055,dx:-0.8209,dy:0.4845,s:'eye',sk:0,k:1,ox:0,oy:0},
  dragon_cap:{f:'img/wear/dragon_cap.png',w:1.7844,h:1.198,dx:-1.0858,dy:-1.3313,s:'head',sk:0.52,k:1,ox:0,oy:0},
  dragon_crown:{f:'img/wear/dragon_crown.png',w:1.2729,h:0.6335,dx:-0.6196,dy:-1.4517,s:'head',sk:0.3,k:1.12,ox:0,oy:0},
  dragon_glasses:{f:'img/wear/dragon_glasses.png',w:2.0313,h:0.7354,dx:-1.019,dy:-0.3731,s:'eye',sk:0,k:1,ox:0,oy:0},
  dragon_scarf:{f:'img/wear/dragon_scarf.png',w:1.7668,h:1.3338,dx:-0.8045,dy:0.4899,s:'eye',sk:0,k:1,ox:0,oy:0},
  dragon_sunglasses:{f:'img/wear/dragon_sunglasses.png',w:2.019,h:0.6076,dx:-1.0127,dy:-0.2823,s:'eye',sk:0,k:1,ox:0,oy:0},
  dragon_tophat:{f:'img/wear/dragon_tophat.png',w:2.1968,h:1.1456,dx:-1.0222,dy:-1.6695,s:'head',sk:0.4,k:1,ox:0,oy:0},
};
const WEAR_ANCHOR = {
  cat_adult_fat:{ex:0.4697,ey:0.3654,ed:0.3366,ht:0.1211},
  cat_adult_happy:{ex:0.4349,ey:0.3822,ed:0.1953,ht:0.1276},
  cat_adult_hungry:{ex:0.4696,ey:0.3692,ed:0.3022,ht:0.1172},
  cat_adult_sick:{ex:0.447,ey:0.3876,ed:0.3039,ht:0.0638},
  cat_adult_strong:{ex:0.4571,ey:0.3067,ed:0.2082,ht:0.1146},
  cat_adult_thin:{ex:0.4137,ey:0.3822,ed:0.2082,ht:0.1237},
  cat_baby_happy:{ex:0.4535,ey:0.4408,ed:0.2723,ht:0.1146},
  cat_baby_hungry:{ex:0.4583,ey:0.4085,ed:0.2177,ht:0.1419},
  cat_baby_sick:{ex:0.4746,ey:0.4878,ed:0.2781,ht:0.0664},
  dog_adult_fat:{ex:0.4921,ey:0.3566,ed:0.2277,ht:0.1224},
  dog_adult_happy:{ex:0.4822,ey:0.3451,ed:0.2233,ht:0.0495},
  dog_adult_hungry:{ex:0.4709,ey:0.3947,ed:0.2348,ht:0.056},
  dog_adult_sick:{ex:0.4713,ey:0.4126,ed:0.2033,ht:0.0755},
  dog_adult_strong:{ex:0.4747,ey:0.2931,ed:0.2105,ht:0.1042},
  dog_adult_thin:{ex:0.4572,ey:0.3744,ed:0.2307,ht:0.082},
  dog_baby_happy:{ex:0.4955,ey:0.3893,ed:0.2355,ht:0.1224},
  dog_baby_hungry:{ex:0.4812,ey:0.4012,ed:0.2022,ht:0.1276},
  dog_baby_sick:{ex:0.488,ey:0.4533,ed:0.1983,ht:0.1146},
  dragon_adult_fat:{ex:0.443,ey:0.3599,ed:0.2194,ht:0.0833},
  dragon_adult_happy:{ex:0.4144,ey:0.268,ed:0.1871,ht:0.0755},
  dragon_adult_hungry:{ex:0.4579,ey:0.3482,ed:0.2026,ht:0.099},
  dragon_adult_sick:{ex:0.4749,ey:0.3988,ed:0.2085,ht:0.0729},
  dragon_adult_strong:{ex:0.4271,ey:0.2673,ed:0.1858,ht:0.0638},
  dragon_adult_thin:{ex:0.3901,ey:0.3559,ed:0.1875,ht:0.0977},
  dragon_baby_happy:{ex:0.4511,ey:0.3357,ed:0.2173,ht:0.1107},
  dragon_baby_hungry:{ex:0.4619,ey:0.395,ed:0.2402,ht:0.1185},
  dragon_baby_sick:{ex:0.4883,ey:0.4344,ed:0.2509,ht:0.0573},
};
