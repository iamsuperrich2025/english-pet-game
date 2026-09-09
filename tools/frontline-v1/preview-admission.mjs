/* Local demo admission runs close to the emulator so slow phones do not race every host tick. */
import {readFile} from 'node:fs/promises';
import vm from 'node:vm';
import {randomBytes} from 'node:crypto';
import path from 'node:path';
export async function makeAdmission(dir,token,namespace,port){
  const context=vm.createContext({window:{},state:{student:null},Date,Math});
  vm.runInContext(await readFile(path.join(dir,'../../js/data/vocab.js'),'utf8'),context);
  for(const name of ['config','words','bases','collision','tank','letters','bots','guards','combat','bombs','room']){
    vm.runInContext(await readFile(path.join(dir,'frontline-'+name+'.js'),'utf8'),context);
  }
  const F=context.window.Frontline;
  return async function admit(req,res){
    const reply=(status,body)=>{res.writeHead(status,{'Content-Type':'application/json','Cache-Control':'no-store'});res.end(JSON.stringify(body));};
    if(req.method!=='POST'||req.headers['x-frontline-token']!==token)return reply(403,{error:'Local test admission only.'});
    try{
      let body='';for await(const chunk of req){body+=chunk;if(body.length>512)return reply(400,{error:'Invalid admission.'});}
      const {code,uid}=JSON.parse(body);
      if(!/^R\d{4}$/.test(code)||!/^p[0-9a-f]{32}$/.test(uid))return reply(400,{error:'Use a four-digit room number.'});
      const url=`http://127.0.0.1:${port}/frontline_v1_dev/${token}/rooms/${code}.json?ns=${namespace}`;
      const headers={Authorization:'Bearer owner'};
      for(let attempt=0;attempt<12;attempt++){
        const response=await fetch(url,{headers:{...headers,'X-Firebase-ETag':'true'}});
        if(!response.ok)throw Error('Test database unavailable.');
        const room=F.admit(await response.json(),uid,Date.now(),randomBytes(16).toString('hex'));
        if(!room)return reply(409,{code:'FRONTLINE_ROOM_FULL',error:'Room full.'});
        const save=await fetch(url,{method:'PUT',headers:{...headers,'Content-Type':'application/json','if-match':response.headers.get('etag')},body:JSON.stringify(room)});
        if(save.status===412)continue;
        if(!save.ok)throw Error('Test admission failed.');
        const id=Object.keys(room.players).find(key=>room.players[key].id===uid);return reply(200,{id});
      }
      reply(503,{error:'Room is busy. Please tap enter again.'});
    }catch(error){reply(503,{error:error.message});}
  };
}
