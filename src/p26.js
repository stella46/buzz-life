
// ===== v1.1.6：サブスクで素質を伸ばす（買い物とのバランス調整つき） =====
// 素質の伸び方：素質が高いほど伸びにくい／同じ素質のサブスクを重ねると2つ目以降は半分
function talSubMul(t){const v=(S.tal&&S.tal[t])||0;return clamp(1.15-v/100,.15,1)}
let TALSUB_CNT={};
function talSub(t,v){const n=TALSUB_CNT[t]||0;TALSUB_CNT[t]=n+1;ad('tal.'+t,v*talSubMul(t)*(n?.5:1)*(age()<18?.5:1))}
SUBCAT='tal';
Object.assign(SUBS,{
 t_game1:{c:'tal',n:'対戦ゲームの練習会',p:5000,age:10,d:'ゲーム実況の素質 +0.25／月',f:()=>talSub('game',.25)},
 t_game2:{c:'tal',n:'プロゲーマーのコーチング',p:30000,age:13,d:'ゲーム実況の素質 +0.6／月',f:()=>talSub('game',.6)},
 t_cook1:{c:'tal',n:'料理家のオンラインレッスン',p:25000,age:13,d:'料理の素質 +0.6／月',f:()=>talSub('cook',.6)},
 t_beauty1:{c:'tal',n:'コスメのお試し定期便',p:4000,age:13,d:'美容の素質 +0.25／月',f:()=>talSub('beauty',.25)},
 t_beauty2:{c:'tal',n:'プロのメイクレッスン',p:20000,age:15,d:'美容の素質 +0.6／月・見た目 +0.2',f:()=>{talSub('beauty',.6);ad('looks',.2)}},
 t_talk1:{c:'tal',n:'ラジオ番組の聴き放題',p:800,age:8,d:'雑談の素質 +0.2／月',f:()=>talSub('talk',.2)},
 t_talk2:{c:'tal',n:'話し方教室',p:18000,age:12,d:'雑談の素質 +0.6／月・話術 +0.2',f:()=>{talSub('talk',.6);ad('talk',.2)}},
 t_study1:{c:'tal',n:'図鑑・百科事典アプリ',p:600,age:6,d:'勉強・解説の素質 +0.2／月',f:()=>talSub('study',.2)},
 t_study2:{c:'tal',n:'家庭教師',p:30000,age:6,d:'勉強・解説の素質 +0.6／月・知識 +0.3',f:()=>{talSub('study',.6);ad('know',.3)}},
 t_music1:{c:'tal',n:'音楽の個人レッスン',p:25000,age:6,d:'歌・音楽の素質 +0.6／月',f:()=>talSub('music',.6)},
 t_comedy1:{c:'tal',n:'演芸の動画見放題',p:1500,age:10,d:'お笑いの素質 +0.25／月',f:()=>talSub('comedy',.25)},
 t_comedy2:{c:'tal',n:'お笑いの養成講座',p:20000,age:15,d:'お笑いの素質 +0.6／月・企画 +0.2',f:()=>{talSub('comedy',.6);ad('plan',.2)}},
 t_vlog1:{c:'tal',n:'映像制作スクール',p:25000,age:13,d:'Vlogの素質 +0.6／月・編集 +0.2',f:()=>{talSub('vlog',.6);ad('edit',.2)}},
 t_pro:{c:'tal',n:'有名プロデューサーとの月1面談',p:300000,age:15,d:'いま発信しているジャンルの素質 +1／月（SNSを始めてから）',f:()=>{if(!S.snsOpen)return;const g=GENRES[S.genre];const t=TALK.includes(S.genre)?S.genre:(g&&g.tal)||'talk';talSub(t,1)}}
});
// もとからある、素質が上がるサブスクも同じルールに（「素質」の分類へ移す）
Object.assign(SUBS.voice,{c:'tal',d:'話術 +0.6・歌・音楽の素質 +0.5／月'});
Object.assign(SUBS.cookcl,{c:'tal',d:'料理の素質 +0.3／月',f:()=>talSub('cook',.3)});
Object.assign(SUBS.gamesub,{d:'ゲーム実況の素質 +0.2／月',f:()=>talSub('game',.2)});
Object.assign(SUBS.bgmlib,{d:'使っていい音楽が使い放題。歌・音楽の素質 +0.15／月',f:()=>talSub('music',.15)});
Object.assign(SUBS.dancecl,{d:'健康 +0.4・歌・音楽の素質 +0.2／月',f:()=>{ad('health',.4);talSub('music',.2)}});
Object.assign(SUBS.photo,{d:'編集 +0.4・Vlogの素質 +0.3／月',f:()=>{ad('edit',.4);talSub('vlog',.3)}});
Object.assign(SUBS.manga,{d:'幸福 +0.2・お笑いの素質 +0.1／月',f:()=>{ad('happy',.2);talSub('comedy',.1)}});
Object.assign(SUBS.shokuzai,{d:'料理の素質 +0.2・幸福 +0.2／月',f:()=>{talSub('cook',.2);ad('happy',.2)}});
Object.assign(SUBS.jet,{d:'好きなときに空の旅。幸福 +1.5・Vlogの素質 +0.4／月',f:()=>{ad('happy',1.5);talSub('vlog',.4)}});
Object.assign(SUBS.carshare,{d:'週末のおでかけ。幸福 +0.2・Vlogの素質 +0.1／月',f:()=>{ad('happy',.2);talSub('vlog',.1)}});
// ボイトレ（もとのしくみ）の素質分も同じルールに
const _subsTick16=subsTick;subsTick=function(){TALSUB_CNT={};const v=S.subs&&S.subs.voice;if(v)S.subs.voice=0;try{_subsTick16()}finally{if(v)S.subs.voice=v}if(v){ad('talk',.6);talSub('music',.5)}if(age()>=18&&S.kidSub&&Object.values(S.kidSub).some(Boolean)&&!S.flags.kidSubNote){S.flags.kidSubNote=1;log('大人になったので、続けている習いごとの月謝は自分で払うことになった','life')}};
// 子どもでも、家族が払ってくれる習いごととして「素質」のサブスクを契約できる（おこづかい画面）
function kidSubsHtml(){const a=age();const list=Object.entries(SUBS).filter(([k,s])=>s.c==='tal'&&a>=(s.age||0)&&(s.p<=30000));if(!list.length)return '';
  return `<h3>習いごと（家族が払う）</h3><p class="hint">家族にお願いして、習いごとをさせてもらえる。家の暮らし向きによって、続けられる数がちがう（いま${kidSubMax()}つまで）。子どものうちは伸び方がゆっくり。18歳からは自分で払う。</p><div>${list.map(([k,s])=>{const on=!!S.subs[k];const full=!on&&kidSubN()>=kidSubMax();return `<div class="shop"><div><div>${esc(s.n)}</div><div class="muted small">${esc(s.d)}</div></div><button class="b sm ${on?'on':''}" type="button" data-ksub="${k}" ${full?'disabled':''}>${on?'やめる':'お願いする'}</button></div>`}).join('')}</div>`}
function kidSubMax(){return [1,1,2,3,4][S.tier]||1}
function kidSubN(){return Object.keys(S.subs||{}).filter(k=>S.subs[k]&&SUBS[k]&&SUBS[k].c==='tal').length}
document.addEventListener('click',e=>{const b=e.target.closest('[data-ksub]');if(!b||!S)return;const k=b.dataset.ksub;if(!S.subs)S.subs={};if(!S.subs[k]&&kidSubN()>=kidSubMax())return;S.subs[k]=S.subs[k]?0:1;S.kidSub=S.kidSub||{};S.kidSub[k]=S.subs[k]?1:0;log(S.subs[k]?`「${SUBS[k].n}」を習わせてもらえることになった`:`「${SUBS[k].n}」をやめた`,'life');save();renderPanel()});
const _kmp16=kidMoneyPanel;kidMoneyPanel=function(){return _kmp16()+kidSubsHtml()};
const _slh16=subsListHtml;subsListHtml=function(){const h=_slh16();return SUBCAT==='tal'?h.replace('<div class="seg wrapseg">','<p class="hint">素質は高くなるほど伸びにくい。同じ素質のサブスクを2つ以上契約すると、2つ目からは効果が半分。</p><div class="seg wrapseg">'):h};
for(const id of ['rv_buzz','rv_scandal']){const e=EV[id];if(e){const w=e.when;e.when=()=>!!S.rival&&(!w||w())}}
