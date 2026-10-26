
// ===== v3.0.19：「通常」と「軽量」の2つのモード（はじめからで選ぶ） =====
// 軽量：SNSと人生が中心。事業（まち・お店・会社・芸能事務所・サービス会社・大計画）はなし。研究とスキルは自動で進む。
let LITE_PICK=0;
function isLite(){return !!(S&&S.lite)}
{const _ss91=showSlots;showSlots=function(mode){const r=_ss91.apply(this,arguments);try{if(mode!=='new')return r;const d=$('#verPick');if(!d)return r;
 d.innerHTML=`<div class="vp-t">遊ぶモード</div><div class="vp-row"><button class="b vp ${LITE_PICK?'':'on'}" type="button" data-vp2="full" aria-pressed="${!LITE_PICK}"><b>通常</b><span>SNS・人生・お金・事業（まち・会社・大計画）まで、すべて遊べます</span></button><button class="b vp ${LITE_PICK?'on':''}" type="button" data-vp2="lite" aria-pressed="${!!LITE_PICK}"><b>軽量</b><span>SNSと人生が中心。事業はなく、研究とスキルは自動で進みます。気軽に遊びたいときに</span></button></div><p class="hint small">昔の版（v1.2.3・v2.9など）は、タイトルの「アップデート情報」→「昔の版で遊ぶ」から遊べます。</p>`}catch(e){console.error(e)}return r}}
document.addEventListener('click',e=>{const b=e.target.closest('[data-vp2]');if(!b)return;LITE_PICK=b.dataset.vp2==='lite'?1:0;document.querySelectorAll('[data-vp2]').forEach(x=>{const on=x.dataset.vp2===b.dataset.vp2;x.classList.toggle('on',on);x.setAttribute('aria-pressed',String(on))})});
{const _ng91=newGame;newGame=function(){const r=_ng91.apply(this,arguments);try{if(S){S.lite=LITE_PICK?1:0;if(S.lite){S.omk=Object.assign(S.omk||{},{res:1,skill:1})}}}catch(_){}return r}}
// 軽量：事業のタブを出さない
{const _rd91=render;render=function(){const r=_rd91.apply(this,arguments);try{const t=document.querySelector('.tab[data-tab="biz"]');if(t)t.hidden=isLite();if(isLite()&&typeof tab!=='undefined'&&tab==='biz')setTab('act')}catch(_){}return r}}
{const _st91=setTab;setTab=function(t){if(isLite()&&t==='biz')t='act';return _st91.call(this,t)}}
// 軽量：事業の出来事は起きない
const LITE_NG=new Set(['会社','まち','大計画']);
{const _re91=rollEvent;rollEvent=function(k){if(!isLite())return _re91.apply(this,arguments);for(let i=0;i<6;i++){const e=_re91.apply(this,arguments);if(!e||!LITE_NG.has(e.cat))return e}return null}}
// 軽量：おまかせ・秘書・道のり・お金の使い道から、事業のものを外す
{const BIZK=new Set(['town','shop','co','mega','office','svc','big']);const _oh91=omkHtml;omkHtml=function(){let h=_oh91.apply(this,arguments);if(!isLite())return h;for(const k of BIZK)h=h.replace(new RegExp(`<label class="omki"><input type="checkbox" data-omk="${k}"[^>]*><span><b>[^<]*</b><small>[^<]*</small></span></label>`),'');return h.replace('<p class="hint small">まち・お店・会社・大計画は18歳から動きます。</p>','')}}
{const _stp91=secTip;secTip=function(){const r=_stp91.apply(this,arguments);try{if(isLite()&&r&&r[1]&&/^biz:/.test(r[1]))return ['今月も順調です。気になることがあれば、上の「🧭ナビ」から探せます',null]}catch(_){}return r}}
{const _rs91=roadState;roadState=function(){const r=_rs91.apply(this,arguments);try{if(isLite()){const NG=['お店とまち','会社の社長','世界を動かす','銀河へ'];const st=r.st.filter(s=>!NG.includes(s.n));let cur=st.findIndex(s=>s.done<s.g.length);if(cur<0)cur=st.length-1;return {st,cur}}}catch(_){}return r}}
{const _sp91=spendHtml;spendHtml=function(){if(!isLite())return _sp91.apply(this,arguments);const sv=[hostHtml,bigAllHtml];hostHtml=()=>'';bigAllHtml=()=>'';try{return _sp91.apply(this,arguments)}finally{hostHtml=sv[0];bigAllHtml=sv[1]}}}
// 軽量：研究とスキルは毎月おまかせで進む
{const _mh91=monthHook11;monthHook11=function(){try{if(isLite()&&S.omk){S.omk.res=1;S.omk.skill=1;for(const k of ['town','shop','co','mega','office','svc','big'])S.omk[k]=0}}catch(_){}return _mh91.apply(this,arguments)}}
// 軽量：「人生」→「自分」に、研究とスキルの進み具合を表示
{const _pl91=panelLife;panelLife=function(){let h=_pl91.apply(this,arguments);try{if(isLite()&&SUB.life==='stat')h+=`<div class="card"><div class="hd"><span>🔬 研究とスキル（自動）</span><b>研究 ${resDoneAll()}個</b></div><p class="hint">軽量モードでは、研究ポイントとスキルポイントは、おすすめの順に自動で使われます。</p></div>`}catch(_){}return h}}
// セーブスロット・人生の終わりの画面に、モードを表示
{const _sc91=slotCard;slotCard=function(i,s,mode){let h=_sc91.apply(this,arguments);try{const o=JSON.parse(localStorage.getItem(slotKey(i))||'null');if(o&&o.lite)h=h.replace('<p class="hint small">','<p class="hint small"><span class="chip">軽量</span> ')}catch(_){}return h}}
(function(){const g=GUIDE.find(x=>x[0]==='basic');if(g&&!/軽量/.test(g[2]))g[2]+='\n・「はじめから」で、モードを選べます。通常：すべての機能で遊べます。軽量：SNSと人生が中心で、事業（まち・会社・大計画）はありません。研究とスキルは自動で進みます。'})();
