
// ===== v3.0.14：大計画の期間を最長5年に（つながった計画が長すぎて、1回の人生で終わらなかったため） =====
for(const m of Object.values(MEGA))m.dur=Math.min(60,m.dur);
{const _mh86=monthHook11;monthHook11=function(){try{if(S&&S.mega)for(const x of S.mega)if(!x.done&&x.dur>60)x.dur=60}catch(_){}return _mh86.apply(this,arguments)}}
