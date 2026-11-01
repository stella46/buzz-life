
// ===== v3.7：完成版 =====
// ----- 軽量：寿命を現実に近く（40歳から、健康なときの長生きボーナスを弱める） -----
{const _dc106=deathCheck;deathCheck=function(){const r=_dc106.apply(this,arguments);if(r)return r;try{if(isLite2()){const a=S.am/12;if(a>=40){const cm=S.cty.life||1;return chance(Math.min(.9,qx(a,S.g)*cm*.5)/12)}}}catch(_){}return false}}
// ----- 軽量：収入がふえたぶん、暮らしにも使う（若いうちに貯まりすぎないように） -----
L2SPEND=.72;
// ----- 感想・不具合の送信はおしまい（ボタンを出さない） -----
(function(){try{const st=document.createElement('style');st.textContent='[data-act="fb"],[data-act="grpEtc"],[data-act="fbHub"],[data-guide="fb"],.fbtitle{display:none!important}';document.head.appendChild(st)}catch(_){}
 try{const i=GUIDE.findIndex(x=>x[0]==='fb');if(i>=0)GUIDE.splice(i,1)}catch(_){}
 try{if(typeof FIND!=='undefined')for(let i=FIND.length-1;i>=0;i--)if(/感想・不具合/.test(FIND[i][0]))FIND.splice(i,1)}catch(_){}})();
document.addEventListener('click',e=>{const b=e.target.closest('[data-act="fb"],[data-act="grpEtc"],[data-act="fbHub"]');if(b){e.stopImmediatePropagation();e.preventDefault()}},true);
try{if(!OLD_VERS.some(v=>v[1]==='versions/v3.6/'))OLD_VERS.unshift(['v3.6','versions/v3.6/','新しい軽量モードが入った版'])}catch(_){}
