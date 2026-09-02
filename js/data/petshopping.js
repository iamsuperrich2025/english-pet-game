"use strict";
/* 🗄️🐾 Pet Shopping — รอบ 1158
   ชั้นทุกใบเป็นชั้นเปล่า อาหารทุกชิ้นใช้พื้นที่ 1 ช่อง */
const PET_PANTRY_SHELVES = Object.freeze([
  Object.freeze({id:'small',  name:'ชั้นอุ่นใจ',   emoji:'🗄️', capacity:30,  price:1500,  color:'#79c7a4'}),
  Object.freeze({id:'medium', name:'ชั้นแสนสบาย', emoji:'🏠', capacity:75,  price:5000,  color:'#f0b45f'}),
  Object.freeze({id:'large',  name:'ชั้นเจ้าตัวเล็ก',emoji:'🏬',capacity:160, price:12000, color:'#9f8be7'}),
]);
const PET_SHOP_RENTAL_FEE = 500;
const PET_SHOPPING_GRANT_VERSION = 1;
const PET_SHOPPING_GRANT_AMOUNT = 10000;

/* Favorite food เป็น SKU จริงบนชั้น ไม่ใช่ alias "favorite" ที่ชนกันข้ามสายพันธุ์ */
const PET_SHOP_FAVORITES = Object.freeze(Object.keys(PETS).map(type=>Object.freeze({
  ...PETS[type].favFood, id:`fav_${type}`, stockId:`fav_${type}`, petType:type, favorite:true,
})));
const PET_SHOP_FOODS = Object.freeze([
  ...PET_SHOP_FAVORITES,
  ...FOODS.filter(foodSafeForPetMenu).map(food=>Object.freeze({...food, stockId:food.id})),
]);
