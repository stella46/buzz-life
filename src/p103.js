
// ===== v3.6.3：サブチャンネル・ほかのSNSの投稿も、メインと同じように一覧で見られる（通常・軽量） =====
let CH_CTX=null,CH_CAP=null,CH_PEND=[],PL_CH='main';
{const _pr103=postRecord;postRecord=function(){const r=_pr103.apply(this,arguments);try{if(CH_CTX){const p=(S.posts||[])[S.posts.length-1];if(p&&p.am===S.am)CH_CAP=p}}catch(_){}return r}}
function chRun(key,nm,fn){const m0=(S.mo.inc&&S.mo.inc.sns)||0,t0=(S.mo.inc&&S.mo.inc.tip)||0;CH_CTX=key;CH_CAP=null;try{return fn()}finally{try{if(CH_CAP)CH_PEND.push(Object.assign({},CH_CAP,{ch:key,nm,sns:key,inc:Math.round(((S.mo.inc.sns||0)-m0)+((S.mo.inc.tip||0)-t0)),y:S.y,mo:S.m,age:age()}))}catch(_){}CH_CTX=null;CH_CAP=null}}
{const _sp103=subPost;subPost=function(c,k){const a=arguments,t=this;return chRun('sub:'+c.id,c.name,()=>_sp103.apply(t,a))}}
{const _xp103=xPost;xPost=function(key,k){const a=arguments,t=this;return chRun('sns:'+key,SNS[key]?SNS[key].n:key,()=>_xp103.apply(t,a))}}
function chF(key){if(key.startsWith('sub:')){const c=(S.subch||[]).find(z=>'sub:'+z.id===key);return c?(c.f||0):0}return S.f[key.slice(4)]||0}
{const _pa103=postAll;postAll=function(k){CH_PEND=[];const f0={};try{for(const c of (S.subch||[]))f0['sub:'+c.id]=c.f||0;for(const x in S.f)f0['sns:'+x]=S.f[x]||0}catch(_){}
 const r=_pa103.apply(this,arguments);
 try{S.plogX=S.plogX||{};S.pbestX=S.pbestX||{};for(const p of CH_PEND){p.nf=Math.round(chF(p.ch)-(f0[p.ch]||0));const L=S.plogX[p.ch]||(S.plogX[p.ch]=[]);L.push(p);if(L.length>30)L.shift();
  const B=S.pbestX[p.ch]||(S.pbestX[p.ch]=[]);B.push(Object.assign({},p));B.sort((a,b)=>b.v-a.v);B.length=Math.min(10,B.length)}}catch(e){console.error(e)}CH_PEND=[];return r}}
function chName(key){if(key==='main')return `メイン（${SNS[S.main]?SNS[S.main].n:''}）`;if(key.startsWith('sub:')){const c=(S.subch||[]).find(z=>'sub:'+z.id===key);const L=(S.plogX||{})[key]||[];return '📺 '+(c?c.name:(L[0]&&L[0].nm)||'サブチャンネル')}const k=key.slice(4);return '📡 '+(SNS[k]?SNS[k].n:k)}
function chList(){const ks=Object.keys(S.plogX||{}).filter(k=>(S.plogX[k]||[]).length);return ['main',...ks]}
function chSwap(fn){if(PL_CH==='main'||!S.plogX||!S.plogX[PL_CH])return fn();const a=S.plog,b=S.pbest;S.plog=S.plogX[PL_CH];S.pbest=(S.pbestX||{})[PL_CH]||[];try{return fn()}finally{S.plog=a;S.pbest=b}}
{const _pl103=plHtml;plHtml=function(){try{if(!chList().includes(PL_CH))PL_CH='main'}catch(_){PL_CH='main'}let h=chSwap(()=>_pl103.apply(this,arguments));
 try{const L=chList();if(PL_OPEN&&L.length>1){const sel=`<div class="seg wrapseg plch">${L.map(k=>`<button type="button" class="${PL_CH===k?'on':''}" data-plch="${esc(k)}">${esc(chName(k))}</button>`).join('')}</div>`;const i=h.indexOf('<div class="subtabs">');if(i>=0)h=h.slice(0,i)+sel+h.slice(i)}}catch(e){console.error(e)}return h}}
{const _pt103=paintThumbs;paintThumbs=function(){return chSwap(()=>_pt103.apply(this,arguments))}}
document.addEventListener('click',e=>{const b=e.target.closest('[data-plch]');if(!b||!S)return;PL_CH=b.dataset.plch;renderPanel()});
// 「ふえたフォロワー」は、その月にそのチャンネルで実際にふえた人数にする（メインからの流入や出来事もふくむ）
{const _t103=turn;turn=function(){let snap=null;try{if(S&&S.alive&&!modalOpen()){snap={am:S.am,mk:S.main,f:{}};snap.f.main=S.f[S.main]||0;for(const c of (S.subch||[]))snap.f['sub:'+c.id]=c.f||0;for(const x in S.f)snap.f['sns:'+x]=S.f[x]||0}}catch(_){}
 const r=_t103.apply(this,arguments);
 try{if(snap&&S){const set=(arr,key,now)=>{if(!arr)return;for(const p of arr)if(p.am===snap.am)p.nf=Math.round(now-(snap.f[key]||0))};
  if(S.main===snap.mk){const now=S.f[S.main]||0;set(S.plog,'main',now);set(S.pbest,'main',now);const lp=(S.posts||[]).find(p=>p.am===snap.am);if(lp)lp.nf=Math.round(now-snap.f.main)}
  for(const k in (S.plogX||{})){if(snap.f[k]==null)continue;const now=chF(k);set(S.plogX[k],k,now);set((S.pbestX||{})[k],k,now)}}}catch(e){console.error(e)}return r}}
