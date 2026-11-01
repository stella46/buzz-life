
// ===== v3.6.5：お金の桁を落ち着かせる（通常）。1000兆円をこえたら、ふえ方が少しずつゆるやかに（大計画はそろえられる） =====
const MONEY_SOFT=1e15,MONEY_P=.6;
{const _inc105=inc;inc=function(cat,v){try{if(S&&!isLite2()&&v>0&&S.money>MONEY_SOFT&&!['inherit','loan','debt','refund'].includes(cat))v=Math.round(v*Math.pow(MONEY_SOFT/S.money,MONEY_P))}catch(_){}return _inc105.call(this,cat,v)}}
