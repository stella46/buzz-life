
// ===== v2.3：人生の終わりのモードを、遊んでいる途中でも切りかえられるように =====
function endModeHtml(){const on=!!S.endless,kids=(S.kids||[]).length;
 return `<div class="card endmode"><div class="hd"><span>人生の終わり</span><span class="chip">${on?'エンドレス（子どもに引き継ぐ）':'亡くなったら終わり'}</span></div>
 <p class="hint">${on?`亡くなったとき、子どもとして人生を続けられます。お金・事務所・まち・研究も引き継がれます。50歳をすぎると「この子に託す」で、生きているうちに子どもの人生へ移ることもできます。${kids?'':'（いまは子どもがいないので、このまま亡くなると人生は終わります）'}`:'亡くなったら、この人生はそこで終わります。'}いつでも切りかえられます。</p>
 <div class="row"><button class="b sm ${on?'':'pri'}" type="button" data-endm="0" aria-pressed="${!on}">亡くなったら終わり</button><button class="b sm ${on?'pri':''}" type="button" data-endm="1" aria-pressed="${on}">エンドレス（子どもに引き継ぐ）</button></div></div>`}
const _pl47=panelLife;panelLife=function(){const h=_pl47.apply(this,arguments);try{if(SUB.life!=='stat'||!S)return h;const i=h.indexOf('<h3>進路</h3>');const c=endModeHtml();return i<0?h+c:h.slice(0,i)+c+h.slice(i)}catch(e){console.error(e);return h}};
// つながり画面でも、子どもがいれば案内
const _kh47=koryuHtml;koryuHtml=function(){let h=_kh47.apply(this,arguments);try{if((S.kids||[]).length&&!S.endless)h+=`<p class="hint">「この子に託す」で次の世代に引き継ぐには、「人生」→「自分」→「能力」で人生の終わりを「エンドレス」にしてください。</p>`;else if((S.kids||[]).length&&S.endless&&age()<50)h+=`<p class="hint">50歳をすぎると、子どもの欄の「この子に託す」で次の世代に引き継げます。</p>`}catch(_){}return h};
document.addEventListener('click',e=>{const b=e.target.closest('[data-endm]');if(!b||!S)return;const v=+b.dataset.endm;if(!!S.endless===!!v)return;S.endless=v?1:0;if(!S.lineage)S.lineage=[];if(!S.gen)S.gen=1;
 log(v?'人生の終わりを「エンドレス（子どもに引き継ぐ）」にした':'人生の終わりを「亡くなったら終わり」にした','life');toast(v?'エンドレスにしました':'亡くなったら終わりにしました');save();renderPanel()});
// 亡くなったあとでも、子どもがいれば引き継ぎを選べるように
const _se47=showEnding;showEnding=function(){const r=_se47.apply(this,arguments);try{if(S&&!S.endless&&(S.kids||[]).length){const el=$('#scrEnd'),hd=el&&el.querySelector('.head');if(hd&&!el.querySelector('.endheir')){const d=document.createElement('div');d.className='card endheir';d.innerHTML=`<h3>家系をつなぐ</h3><p class="hint">いまは「亡くなったら終わり」になっていますが、子どもとして人生を続けることもできます。お金・事務所・まち・研究も引き継がれます。</p><div class="row"><button class="b pri" type="button" data-endheir="1">エンドレスにして、子どもに引き継ぐ</button></div>`;hd.after(d)}}}catch(e){console.error(e)}return r};
document.addEventListener('click',e=>{const b=e.target.closest('[data-endheir]');if(!b||!S)return;S.endless=1;if(!S.lineage)S.lineage=[];showEnding()});
