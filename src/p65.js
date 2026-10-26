
// ===== v3.0（1）：やめる・奥にしまう =====

// ----- やめる：時をさかのぼる -----
snapPut=function(){};try{snapClear()}catch(_){}
{const _die65=die;die=function(){const r=_die65.apply(this,arguments);try{const m=$('#mcard');if(m){m.querySelectorAll('[data-dch="back"],.dsub').forEach(x=>x.remove());m.querySelectorAll('.dchoice .hint').forEach(x=>{if(/さかのぼ/.test(x.textContent))x.remove()})}}catch(_){}return r}}

// ----- やめる：相関図・弟子 -----
{const _st65=subTabs;subTabs=function(tabk,items){if(tabk==='life'){items=items.filter(x=>x[0]!=='map');if(SUB.life==='map')SUB.life='ppl'}return _st65.call(this,tabk,items)}}
{const _pl65=panelLife;panelLife=function(){if(SUB.life==='map')SUB.life='ppl';return _pl65.apply(this,arguments)}}

// ----- やめる：ライバルとの勝負（ライバルは出来事・コラボ・ランキングで出る） -----
// ----- 奥にしまう：シリーズ・マンネリ（自動で計算するだけ）／やめる：流行の噂 -----
snsExtra=function(){if(!S.snsOpen)return '';const core=S.fanCore,anti=S.fanAnti,light=Math.max(0,1-core-anti),F=totalF();
 return `<h2>ファン</h2><div class="fanbar"><i style="width:${core*100}%" class="c"></i><i style="width:${light*100}%" class="l"></i><i style="width:${anti*100}%" class="a"></i></div><div class="kv"><span>ガチ勢</span><span>${num(F*core)}人（${Math.round(core*100)}%）</span><span>ライト層</span><span>${num(F*light)}人</span><span>アンチ</span><span>${num(F*anti)}人（${Math.round(anti*100)}%）</span></div><p class="hint">ガチ勢は同じジャンルを続けたりライブをしたりすると増え、ファンクラブの収入になります。アンチは攻めた投稿で増え、炎上しやすくなります。</p>`};
// 噂は出さない（流行だけ）
{const _mh65=monthHook11;monthHook11=function(){_mh65.apply(this,arguments);try{if(S&&S.rumor)S.rumor=null;
 // シリーズは自動：飽きられ始めたら、自然に新しいシリーズへ
 if(S&&S.series&&S.series.fat>12){S.series={g:S.genre,n:0,fat:0}}}catch(_){}}}
{const _ps65=panelSns;panelSns=function(){return _ps65.apply(this,arguments).replace('上の「コラボ」から申し込める。勝負は下の「ライバルとの勝負」から。','コラボは上の「コラボ」から申し込めます。')}}

// ----- 奥にしまう：推定プレイ時間（画面の上には出さない。「時間の進み方」の中だけ） -----
etaText=function(){return ''};

// ----- 奥にしまう：チャンネル名・SNSの名前・SNSの買収は「くわしく」の中へ -----
{const _cr65=chRenameHtml;chRenameHtml=function(){const h=_cr65.apply(this,arguments);if(!h)return h;return `<details class="pmore"><summary>くわしく：チャンネル名を変える</summary>${h}</details>`}}
{const _sb65=snsBuyHtml;const _co65=coHtml;coHtml=function(){const h=_co65.apply(this,arguments);try{const s=_sb65();const i=h.indexOf(s);if(i>=0)return h.slice(0,i)+`<details class="pmore"><summary>くわしく：SNSの運営会社（買収・名前の変更）</summary>${s.replace('<h3>SNSの運営会社</h3>','')}</details>`+h.slice(i+s.length)}catch(_){}return h}}

// 遊び方の説明から、なくなった機能を外す
(function(){for(const g of GUIDE){g[2]=g[2].replace(/・相関図と弟子/g,"").replace(/、相関図/g,"").replace(/／時をさかのぼって続ける/g,'').replace(/\n?・時をさかのぼる：[^\n]*/g,'').replace(/\n?・[^\n]*ライバルとの勝負[^\n]*/g,'').replace(/\n?・[^\n]*流行の噂[^\n]*/g,'').replace(/\n?・[^\n]*相関図[^\n]*/g,'')}})();
try{for(let i=FIND.length-1;i>=0;i--){if(/さかのぼ|相関図|弟子|ライバルとの勝負|噂/.test(FIND[i][0]+FIND[i][3]))FIND.splice(i,1)}}catch(_){}
