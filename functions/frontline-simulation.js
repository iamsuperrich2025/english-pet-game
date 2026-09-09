/* Load the same small, pure Frontline reducers packaged from current source at predeploy. */
'use strict';
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
module.exports=function loadSimulation(){
  const context=vm.createContext({window:{},state:{student:null},Date,Math});
  const dir=path.join(__dirname,'frontline-runtime');
  vm.runInContext(fs.readFileSync(path.join(dir,'vocab.js'),'utf8'),context);
  for(const name of ['config','words','bases','tank','letters','drop','bots','guards','combat','bombs','commands','room']){
    vm.runInContext(fs.readFileSync(path.join(dir,'frontline-'+name+'.js'),'utf8'),context);
  }
  return context.window.Frontline;
};
