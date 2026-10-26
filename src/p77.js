
// ===== v3.0.3：サブチャンネルはメインの登録者に応じて伸びる／人生ごとにちがう伸び方 =====

// ----- サブチャンネル：作ったときに、メインのファンの一部がついてくる。その後もメインから少しずつ流れてくる -----
const SCH_T0=Date.now();
function schMainF(){try{return S.f[S.main]||0}catch(_){return 0}}
document.addEventListener('click',e=>{const b=e.target.closest('[data-act="schNew"]');if(!b||!S)return;setTimeout(()=>{try{for(const c of (S.subch||[])){if(c.boot)continue;const t=parseInt(String(c.id).slice(1),36);if(!(t>=SCH_T0))continue;c.boot=1;
 const m=schMainF(),same=c.genre===S.genre?1.6:1;const add=Math.round(m*R(.04,.15)*same);if(add>c.f){c.f=add;log(`サブチャンネル「${c.name}」に、メインのファンが ${num(add)}人 ついてきた`,'good');try{popBig('📺 サブチャンネル開設',`メインのファンが ${num(add)}人 登録してくれました`,esc(c.name))}catch(_){}}save();renderPanel()}}catch(err){console.error(err)}},0)});
{const _mh77=monthHook11;monthHook11=function(){_mh77.apply(this,arguments);try{if(!S||!S.subch||!S.snsOpen)return;const m=schMainF();for(const c of S.subch){const top=m*(c.genre===S.genre?.7:.45);if(c.f>=top)continue;const g=m*.003*R(.4,1.6)*(1-c.f/top);if(g>0)c.f=Math.round(c.f+g)}}catch(e){console.error(e)}}}
try{const _ch77=chHtml;chHtml=function(){return _ch77.apply(this,arguments).replace('サブチャンネルを3つまで作れる。','サブチャンネルを3つまで作れる。作ると、メインのファンの一部が登録してくれて、その後もメインから少しずつ流れてくる（同じジャンルほど多い）。')}}catch(_){}

