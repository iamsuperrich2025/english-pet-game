"use strict";
const fs=require('fs'),vm=require('vm'),path=require('path');
const root=path.resolve(__dirname,'..');
const store={};
const ctx={window:{},console,Date,JSON,Object,Array,Set,String,Number,Promise,
  sessionStorage:{getItem:k=>store[k]||null,setItem:(k,v)=>store[k]=String(v),removeItem:k=>delete store[k]},
  friendCode:()=> 'ABC234',
  EXAM_STD_MANIFEST:{ielts:{sets:[{id:'ielts_1'}]}},
  BAND_ADV_MANIFEST:{academic:{}},
};
vm.createContext(ctx);
vm.runInContext(fs.readFileSync(path.join(root,'js/account-deletion.js'),'utf8'),ctx,{filename:'account-deletion.js'});
const uid='userA',friend='userB';
const base={
  friends:{userB:{n:'B'}},requests:{userC:{}},gifts:{userD:{}},tinv:{},calls:{},followers:{userE:{}},notifs:{n1:{u:'userB'}},msold:{sale1:{}},
  contacts:[friend],chats:{userA_userB:{m1:{f:uid,t:'mine'},m2:{f:friend,t:'theirs'}}},sentNotifs:{userB:{n2:{u:uid}}},
  market:{a:{sid:uid},b:{sid:friend}},ads:{1:{uid},2:{uid:friend}},
  gfeed:{
    mine:{u:uid,cm:{c1:{u:friend}}},
    other:{u:friend,lk:{[uid]:'like'},cm:{c2:{u:uid},c3:{u:friend,cl:{[uid]:true}}}},
    stranger:{u:'userZ',cm:{c4:{u:'userZ'}}},
    formerFriend:{u:'userZ',lk:{[uid]:'like'},cm:{c5:{u:'userZ',cl:{[uid]:true}}}}
  },
  awards:{wsAward:{'2026-08':{w:{[uid]:{n:'A'},[friend]:{n:'B'}}}}},classes:{adv:{podium:{top:{0:{u:uid},1:{u:friend}}}}},
  pquizCode:'ABC123',pquiz:{owner:friend,members:{0:{u:friend},1:{u:uid}},scores:{[uid]:{}},answers:{0:{[uid]:{}}},chat:{x:{u:uid},y:{u:friend}},voice:{members:{0:{u:uid}}}}
};
const updates=ctx.window.AccountDeletion._test.buildUpdates(uid,base);
const yes=p=>{if(!(p in updates))throw new Error('missing deletion: '+p);};
const no=p=>{if(p in updates)throw new Error('unsafe deletion: '+p);};
yes('users/userA');yes('pphoto/userA');yes('friendCodes/ABC234');yes('friends/userB/userA');
yes('chats/userA_userB/m1');no('chats/userA_userB/m2');yes('chattheme/userA_userB');
yes('gfeed/mine');yes('gfeed/other/cm/c2');yes('gfeed/other/cm/c3/cl/userA');
no('gfeed/stranger/lk/userA');no('gfeed/stranger/cm/c4/cl/userA');
yes('gfeed/formerFriend/lk/userA');yes('gfeed/formerFriend/cm/c5/cl/userA');
yes('market/a');no('market/b');yes('ads/1');no('ads/2');yes('wsAward/2026-08/w/userA');no('wsAward/2026-08/w/userB');
yes('pquizRooms/ABC123/members/1');yes('pquizRooms/ABC123/chat/x');no('pquizRooms/ABC123/chat/y');
yes('wroom/adv/r0/userA');yes('winfo/f1/r35/userA');yes('examRank/ielts_1/userA');yes('bandRank/academic_expert/userA');
no('sales');no('hauntedHotel');
const rulesText=fs.readFileSync(path.join(root,'handoff/RULES.md'),'utf8');
const rulesBlock=rulesText.match(/```json\s*([\s\S]*?)\s*```/);
if(!rulesBlock)throw new Error('missing full rules JSON block');
const rules=JSON.parse(rulesBlock[1]).rules;
const likeWrite=rules.gfeed.$postId.lk.$uid['.write'];
const commentLikeWrite=rules.gfeed.$postId.cm.$cid.cl.$uid['.write'];
[likeWrite,commentLikeWrite].forEach((expr,i)=>{
  if(!expr.includes('auth.uid === $uid')||!expr.includes('!newData.exists()')||!expr.includes("root.child('friends')"))
    throw new Error('unsafe or incomplete reaction-delete rule '+i);
});
console.log('PASS: account deletion plan removes only the departing user portions ('+Object.keys(updates).length+' paths)');
