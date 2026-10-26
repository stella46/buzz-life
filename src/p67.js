
// ===== v3.0（4）：予定の決め方を「枠」「割合」の2つに（どちらも「今月だけ」が使える） =====
PMODES.length=0;PMODES.push(['classic','枠で決める','枠ごとに行動を選びます。変えたい月だけ「今月だけ」も使えます'],['hybrid','割合で決める','「投稿50%・休み20%」のように割合で配分します。変えたい月だけ「今月だけ」も使えます']);
pmode=function(){if(!S)return 'classic';if(S.pmode==='routine')S.pmode='classic';else if(S.pmode==='ratio')S.pmode='hybrid';return S.pmode||'classic'};
{const _t67=turn;turn=function(){if(!S||!S.alive||modalOpen()||pmode()!=='classic'||!onceOn())return _t67.apply(this,arguments);
 const sv=[S.plan.slice(),(S.planOpt||[]).slice()],au=S.auto;S.auto=0;S.plan=S.once.plan.slice();S.planOpt=S.once.opt.slice();
 try{return _t67.apply(this,arguments)}finally{S.auto=au;S.plan=sv[0];S.planOpt=sv[1];if(S.once&&S.once.am<S.am)S.once=null}}}
{const _pp67=panelPlan;panelPlan=function(){let h=_pp67.apply(this,arguments);try{if(S&&age()>=6&&pmode()==='classic'){const mk='</span></div>';const k=h.indexOf('data-act="auto"');if(k>=0){const j=h.indexOf(mk,k);if(j>=0)h=h.slice(0,j+mk.length)+onceHtml()+h.slice(j+mk.length)}}}catch(e){console.error(e)}return h}}
(function(){for(const x of GUIDE)x[2]=x[2].replace(/・予定の決め方は4種類から選べます。\n　いつもの枠[^\n]*\n　いつもの予定[^\n]*\n　割合で決める[^\n]*\n　割合＋今月だけ[^\n]*/,'・予定の決め方は2つ：「枠で決める」と「割合で決める」。どちらも、変えたい月だけ「📅 今月だけ」で予定を変えられます。')})();

// ===== v3.0（5）：投稿のスタイルを4つに =====
{const MAP={safe:'chill',story:'chill',variety:'norm',trend:'norm'};for(const k of Object.keys(MAP))delete STYLES[k];
 STYLES.chill.n='ゆるく癒し';STYLES.chill.d='炎上しにくく、ガチ勢が育ちやすい。伸びはゆっくり';STYLES.norm.n='ふつう';STYLES.norm.d='バランスよく伸びる';STYLES.edge.n='攻め';STYLES.expert.n='ガチ解説';
 const fix=()=>{try{if(S&&MAP[S.style])S.style=MAP[S.style];if(S&&S.subch)for(const c of S.subch)if(MAP[c.style])c.style=MAP[c.style]}catch(_){}};
 const _mh67=monthHook11;monthHook11=function(){fix();return _mh67.apply(this,arguments)};const _ps67=panelSns;panelSns=function(){fix();return _ps67.apply(this,arguments)}}
