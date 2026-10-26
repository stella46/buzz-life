
// ===== v3.0.8：バズの表示・再生数と登録者と広告収入のつり合い・メイン以外のアカウントの減り方 =====

// ----- 投稿の記録：再生数・ふえた登録者・広告収入をつり合わせる／「バズ」は本当に大きく伸びたときだけ -----
{const _dp81=doPost;doPost=function(k){const key=S.main,f0=S.f[key]||0,m0=(S.mo.inc&&S.mo.inc.sns)||0,v0=S.mo.views||0;const r=_dp81.apply(this,arguments);
 try{if(SUBPOST)return r;const last=(S.posts||[])[S.posts.length-1];if(!last||last.am!==S.am||last._bal)return r;last._bal=1;
  const nf=Math.max(0,(S.f[key]||0)-f0);const inc0=Math.max(0,((S.mo.inc&&S.mo.inc.sns)||0)-m0);const V=Math.max(1,last.v);
  // ふえた登録者に見合う再生数（登録してくれるのは、見た人の0.5〜2%くらい）
  const needV=Math.round(nf*R(50,200));
  if(needV>V){const ex=needV-V;last.v=needV;S.mo.views=(S.mo.views||0)+ex;S.stats.views=(S.stats.views||0)+ex;
   // 広告収入も、ふえた再生数の分だけ（収益化しているときだけ。1回あたりの単価はこれまでと同じ）
   if(inc0>0){const add=Math.round(inc0/V*ex);if(add>0){S.money+=add;S.mo.inc.sns=(S.mo.inc.sns||0)+add;S.yInc=(S.yInc||0)+add;last.inc=(last.inc||0)+add}}}
  last.nf=Math.round(nf);if(last.inc==null)last.inc=Math.round(inc0);
  // バズ：ふだんの再生数（最近のバズでない投稿）の3倍以上のときだけ
  const L=(S.plog||[]).filter(p=>!p.b&&p!==last).slice(-6).map(p=>p.v).sort((a,b)=>a-b);const base=L.length?L[L.length>>1]:Math.max(1000,f0*.3);
  last.b=last.v>=base*3?1:0;
  // 一覧の記録も合わせる
  for(const arr of [S.plog,S.pbest]){if(!arr)continue;const x=arr.find(p=>p.am===last.am&&p.t===last.t);if(x){x.v=last.v;x.b=last.b;x.nf=last.nf;x.inc=last.inc}}
  if(S.pbest){S.pbest.sort((a,b)=>b.v-a.v)}
  if(last.b)log(`🔥 バズった投稿「${last.t}」：${num(last.v)}回再生・登録者 +${num(last.nf)}人`,'good')}catch(e){console.error(e)}return r}}
// 「どかーん」で一気にふえたときは、その月の投稿の再生数も大きく
{const _pb81=popBig;popBig=function(a,b,c){try{if(S&&typeof a==='string'&&a.indexOf('どかーん')>=0){const last=(S.posts||[])[S.posts.length-1];
 if(last&&last.am===S.am){const m=String(c||'').match(/\+([\d,.]+)(万|億)?/);let n=0;if(m){n=parseFloat(m[1].replace(/,/g,''))*(m[2]==='億'?1e8:m[2]==='万'?1e4:1)}
  if(n>0){const ex=Math.round(n*R(60,150));const V=Math.max(1,last.v);const rate=last.inc&&V?last.inc/V:0;last.v+=ex;last.b=1;last.nf=(last.nf||0)+Math.round(n);S.mo.views=(S.mo.views||0)+ex;
   if(rate>0){const ai=Math.round(rate*ex);S.money+=ai;S.mo.inc.sns=(S.mo.inc.sns||0)+ai;last.inc=(last.inc||0)+ai}
   for(const arr of [S.plog,S.pbest]){if(!arr)continue;const x=arr.find(p=>p.am===last.am&&p.t===last.t);if(x){x.v=last.v;x.b=1;x.nf=last.nf;x.inc=last.inc}}
   if(S.pbest){if(!S.pbest.some(p=>p.am===last.am&&p.t===last.t))S.pbest.push(Object.assign({},last));S.pbest.sort((x,y)=>y.v-x.v);S.pbest.length=Math.min(10,S.pbest.length)}
   b=`${b}<br>「${esc(last.t)}」が ${num(last.v)}回再生`}}}}catch(e){console.error(e)}return _pb81.call(this,a,b,c)}}
// ----- メイン以外のアカウント：投稿していなくても、ほとんど減らない（10年で5%くらい）。メインで投稿しない月も、ゆるやかに -----
{const _t81=turn;turn=function(){let before=null;try{if(S&&S.alive&&!modalOpen())before=Object.assign({},S.f)}catch(_){}const r=_t81.apply(this,arguments);
 try{if(before&&S&&S.f){for(const k in before){const b=before[k],a=S.f[k];if(!(b>0)||!(a>0))continue;const q=a/b;
  if(q>.9885&&q<.9915)S.f[k]=b*(k===S.main?.999:.9995)}}}catch(e){console.error(e)}return r}}
