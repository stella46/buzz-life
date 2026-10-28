
// ===== v3.5.1：メンタルを保ちやすく =====
// 1) 毎月の小さな疲れ（投稿・勉強・仕事・練習など）を少しやわらげる
{const _ad98=ad;ad=function(k,v,cat){if(k==='mental'&&v<0&&v>-1)v*=.65;return _ad98.call(this,k,v,cat)}}
// 2) 自然に回復：下がっているほど、毎月少しずつ戻る（55まで）／支えてくれる人がいると、少し回復
{const _mh98=monthHook11;monthHook11=function(){const r=_mh98.apply(this,arguments);try{if(S&&S.alive&&age()>=6&&S.p){const m=S.p.mental;
 let g=0;if(m<55)g+=(55-m)*.05;
 const L=lover();if(L&&L.rel>=60)g+=.4;const fr=(S.friends||[]).filter(n=>n.rel>=60).length;g+=Math.min(.6,fr*.15);if(parents().some(p=>p.rel>=70))g+=.2;if((S.pet||0))g+=.3;
 if(g>0)S.p.mental=clamp(m+g)}}catch(e){console.error(e)}return r}}
(function(){const g=GUIDE.find(x=>x[0]==='act');if(g&&!/メンタルは/.test(g[2]))g[2]+='\n・メンタルは、休む・趣味・交流で回復します。下がっているときは毎月少しずつ自然に戻り、仲のよい人がいると回復しやすくなります。'})();
