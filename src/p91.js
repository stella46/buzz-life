
// ===== v3.0.19：「通常」と「軽量」の2つのモード（はじめからで選ぶ） =====
// 軽量：SNSと人生が中心。事業（まち・お店・会社・芸能事務所・サービス会社・大計画）はなし。研究とスキルは自動で進む。
let LITE_PICK=0;
function isLite(){return !!(S&&S.lite)}
{const _ss91=showSlots;showSlots=function(mode){const r=_ss91.apply(this,arguments);try{if(mode!=='new')return r;const d=$('#verPick');if(!d)return r;
 d.innerHTML=`<div class="vp-t">遊ぶモード</div><div class="vp-row"><button class="b vp ${LITE_PICK?'':'on'}" type="button" data-vp2="full" aria-pressed="${!LITE_PICK}"><b>通常</b><span>SNS・人生・お金・事業（まち・会社・大計画）まで、すべて遊べます</span></button><button class="b vp ${LITE_PICK?'on':''}" type="button" data-vp2="lite" aria-pressed="${!!LITE_PICK}"><b>軽量</b><span>同じ遊びを、かんたんに。事業はシンプル、出来事は少なめ、大計画は10個。はじめての人や、気軽に遊びたいときに</span></button></div><p class="hint small">昔の版（v1.2.3・v2.9など）は、タイトルの「アップデート情報」→「昔の版で遊ぶ」から遊べます。</p>`}catch(e){console.error(e)}return r}}
document.addEventListener('click',e=>{const b=e.target.closest('[data-vp2]');if(!b)return;LITE_PICK=b.dataset.vp2==='lite'?1:0;document.querySelectorAll('[data-vp2]').forEach(x=>{const on=x.dataset.vp2===b.dataset.vp2;x.classList.toggle('on',on);x.setAttribute('aria-pressed',String(on))})});
{const _ng91=newGame;newGame=function(){const r=_ng91.apply(this,arguments);try{if(S){S.lite=LITE_PICK?1:0;if(S.lite){S.pmode='bal'}}}catch(_){}return r}}
// セーブスロット・人生の終わりの画面に、モードを表示
{const _sc91=slotCard;slotCard=function(i,s,mode){let h=_sc91.apply(this,arguments);try{const o=JSON.parse(localStorage.getItem(slotKey(i))||'null');if(o&&o.lite)h=h.replace('<p class="hint small">','<p class="hint small"><span class="chip">軽量</span> ')}catch(_){}return h}}
(function(){const g=GUIDE.find(x=>x[0]==='basic');if(g&&!/軽量/.test(g[2]))g[2]+='\n・「はじめから」で、モードを選べます。通常：すべての機能で遊べます。軽量：同じ遊びを、かんたんにしたモードです（事業はシンプル、出来事は少なめ、大計画は10個、賞は5つ、研究はまとめて解放、予定は「バランスよく全部」）。'})();
