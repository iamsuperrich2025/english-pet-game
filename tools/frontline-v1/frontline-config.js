/* Frontline 1944: local-only competitive word-run constants and access boundary. */
(function () {
  'use strict';
  const F = window.Frontline = window.Frontline || {};
  F.C = Object.freeze({
    project:'demo-vocab-frontline-v1', namespace:'frontline_v1_dev',
    saveKey:'vw.frontline-v1.test.save.v1', maxPlayers:4, maxHp:5000,
    halfX:90, halfZ:90, speeds:[3,5,7.5], reverseSpeeds:[2.1,3.5,5.25],
    speedNames:['SLOW','NORMAL','FAST'], turnSpeed:1.7, chunkSize:18,
    sendMs:150, worldMs:100, leaseMs:15000, hostLeaseMs:2500, fireMs:450,
    range:28, bulletSpeed:22, tankDamage:100, respawnMs:4000,
    baseHp:5000, baseDamage:250, baseRadius:3.25, baseBlockRadius:4.2,
    bombFuse:2000, bombCooldown:700, bombRadius:4.5, bombDamage:250, bombBaseDamage:500,
    pickupRadius:1.35, guardHp:5000, guardRespawnMs:5000, reward:1000, alphabet:'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    muzzle:2.28, muzzleY:1.69, step:1/60, poseBlend:.14, shadowMs:200
  });
  F.muzzlePoint=function(pose){
    const dx=Math.sin(pose.turret),dz=-Math.cos(pose.turret);
    return{dx,dz,x:pose.x+dx*F.C.muzzle,z:pose.z+dz*F.C.muzzle,y:F.C.muzzleY};
  };
  F.isPrivateHost = function (host) {
    if (/^(localhost|127\.0\.0\.1|\[::1\])$/.test(host)) return true;
    const parts=host.split('.');
    if(parts.length!==4||parts.some(p=>!/^\d{1,3}$/.test(p)||Number(p)>255))return false;
    const [a,b]=parts.map(Number);
    return a===10||(a===192&&b===168)||(a===172&&b>=16&&b<=31);
  };
  F.assertDev = function () {
    const c=window.FRONTLINE_DEV;
    if(!F.isPrivateHost(location.hostname)||!c||c.project!==F.C.project||c.namespace!==F.C.namespace||
      c.port!==19444||!c.token||location.port!=='19444')throw new Error('Frontline is available only in its local test preview.');
    return c;
  };
  F.usePageFullscreen=function(ua='',coarse=false){
    return !coarse&&!/Android|iPhone|iPad|iPod/i.test(ua);
  };
  F.randomId = function () {
    const bytes=new Uint8Array(16);crypto.getRandomValues(bytes);
    bytes[6]=(bytes[6]&15)|64;bytes[8]=(bytes[8]&63)|128;
    return Array.from(bytes,b=>b.toString(16).padStart(2,'0')).join('');
  };
  F.round=n=>Math.round(n*100)/100;
  F.wrap=n=>Math.atan2(Math.sin(n),Math.cos(n));
})();
