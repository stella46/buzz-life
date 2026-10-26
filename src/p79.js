
// ===== v3.0.6：最近の投稿をもっと見られるように（たたんで表示・ベスト10・バズの記録） =====
// 投稿ごとに、再生数・ふえたフォロワー・広告収入も記録する
let PL_OPEN=0,PL_TAB='new';
{const _dp79=doPost;doPost=function(k){const key=S.main,f0=S.f[key]||0,m0=(S.mo.inc&&S.mo.inc.sns)||0,t0=(S.mo.inc&&S.mo.inc.tip)||0;const r=_dp79.apply(this,arguments);
 try{if(!SUBPOST){const last=(S.posts||[])[S.posts.length-1];if(last&&last.am===S.am&&!last._rec){last._rec=1;last.nf=Math.round((S.f[key]||0)-f0);last.inc=Math.round(((S.mo.inc.sns||0)-m0)+((S.mo.inc.tip||0)-t0));last.sns=key;last.y=S.y;last.mo=S.m;last.age=age();
  if(!S.plog)S.plog=[];S.plog.push(Object.assign({},last));if(S.plog.length>40)S.plog.shift();
  if(!S.pbest)S.pbest=[];S.pbest.push(Object.assign({},last));S.pbest.sort((a,b)=>b.v-a.v);S.pbest.length=Math.min(10,S.pbest.length)}}}catch(e){console.error(e)}return r}}
function plRow(p,i,list){return `<div class="prow${p.b?' buzz':''}"><canvas width="96" height="54" data-pt="${list}:${i}"></canvas><div class="pinfo"><b>${esc(p.t)}</b><span class="muted small">${p.y?`${p.y}年${p.mo}月・${p.age}歳`:''}${p.sns&&SNS[p.sns]?`・${esc(SNS[p.sns].n)}`:''}${p.b?' <span class="chip hot">🔥 バズ</span>':''}</span>
 <span class="pnum">▶ ${num(p.v)}回再生${p.nf!=null?`　👤 ${p.nf>=0?'+':''}${num(p.nf)}人`:''}${p.inc?`　💰 ${yen(p.inc)}`:''}</span></div></div>`}
function plHtml(){const lg=(S.plog||[]).slice().reverse(),bs=(S.pbest||[]);const n=lg.length;if(!n&&!(S.posts||[]).length)return '';
 const top=bs[0];
 let body='';if(PL_OPEN){const L=PL_TAB==='best'?bs:lg;
  body=`<div class="subtabs"><button class="stab" type="button" data-pltab="new" aria-pressed="${PL_TAB==='new'}">🕒 最近（${n}）</button><button class="stab" type="button" data-pltab="best" aria-pressed="${PL_TAB==='best'}">🏆 再生数ベスト10</button></div>
  ${L.length?`<div class="plist">${L.map((p,i)=>plRow(p,i,PL_TAB)).join('')}</div>`:'<p class="hint">まだ記録がありません。投稿すると、ここに残ります。</p>'}
  <div class="row"><button class="b sm" type="button" data-plopen="0">▲ 投稿の一覧をとじる</button></div>`}
 return `<div class="card plcard"><button class="b plbtn ${PL_OPEN?'on':''}" type="button" data-plopen="${PL_OPEN?0:1}">${PL_OPEN?'▲ 投稿の一覧をとじる':`📺 投稿の一覧を見る${n?`（${n}件）`:''}`}</button>${!PL_OPEN&&top?`<p class="hint small">いちばん再生された投稿：「${esc(top.t)}」${num(top.v)}回再生${top.b?'（バズ）':''}</p>`:''}${body}</div>`}
{const _ph79=postsHtml;postsHtml=function(){const h=_ph79.apply(this,arguments);try{return h+plHtml()}catch(e){console.error(e);return h}}}
document.addEventListener('click',e=>{const b=e.target.closest('[data-plopen],[data-pltab]');if(!b||!S)return;
 if(b.dataset.pltab){PL_TAB=b.dataset.pltab;renderPanel();return}
 PL_OPEN=+b.dataset.plopen;const st=window.scrollY;renderPanel();if(!PL_OPEN){const c=document.querySelector('.plcard');if(c)c.scrollIntoView({block:'nearest'})}});
// サムネイル：一覧の分も描く（元の描き方を、1枚ずつ使う）
{const _pt79=paintThumbs;paintThumbs=function(){const r=_pt79.apply(this,arguments);try{const mine=[...document.querySelectorAll('canvas[data-pt]')];if(!mine.length)return r;
 const orig=[...document.querySelectorAll('canvas[data-thumb]')];orig.forEach(c=>{c.dataset.thumbX=c.dataset.thumb;delete c.dataset.thumb});const sv=S.posts;
 try{for(const cv of mine){const [l,i]=cv.dataset.pt.split(':');const L=l==='best'?(S.pbest||[]):(S.plog||[]).slice().reverse();const p=L[+i];if(!p)continue;S.posts=[p];cv.dataset.thumb='0';try{_pt79()}catch(_){}delete cv.dataset.thumb}}
 finally{S.posts=sv;orig.forEach(c=>{c.dataset.thumb=c.dataset.thumbX;delete c.dataset.thumbX})}}catch(e){console.error(e)}return r}}
// バズったときのお知らせに、投稿のタイトルと再生数を
{const _pr79=postRecord;postRecord=function(buzzed,views){const r=_pr79.apply(this,arguments);try{if(buzzed&&!SUBPOST){const p=S.posts[S.posts.length-1];if(p&&p.am===S.am){S.lastBuzz={t:p.t,v:p.v};log(`🔥 バズった投稿「${p.t}」：${num(p.v)}回再生`,'good')}}}catch(_){}return r}}
