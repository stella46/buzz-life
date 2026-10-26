
// ===== v3.0（6）：お金の「使い道」に、高額なアクション・イベントの主催をまとめる／部屋の飾りは「買い物」へ =====
let BIG_ALL=0;{const _bh68=bigHtml;bigHtml=function(a){return BIG_ALL?_bh68.apply(this,arguments):''}}
const BIG_AREA=[['sns','📱 SNS'],['money','💰 お金'],['town','🏙 まち'],['shop','🏪 お店'],['co','🏢 会社'],['office','🎤 事務所'],['svc','📦 サービス'],['life','👥 人']];
function hostHtml(){if(age()<18||!S.town)return '';const T=S.town;const cd=T.evAm!=null&&S.am-T.evAm<evCd();
 return `<h3>🎪 まちのイベントを主催する</h3><p class="hint">いまのまち（${esc(townName(T))}）で開きます。まちの発展度・支持・評判が上がります。</p>${cd?`<p class="hint">次に主催できるのは${evCd()-(S.am-T.evAm)}か月後。</p>`:''}`+TEVENTS.map(ev=>{const c=Math.round(ev.cost*Math.max(.2,S.cty.inc));return `<div class="shop"><div><div>${ev.n} <span class="muted small">${yen(c)}</span></div><div class="muted small">来場者の目安 ${num(ev.base*(1+T.dev/100))}人〜</div></div><button class="b sm" type="button" data-tev="${ev.k}" ${cd||S.money<c?'disabled':''}>主催する</button></div>`}).join('')}
function bigAllHtml(){if(age()<18)return '';BIG_ALL=1;let h='';try{for(const [a,n] of BIG_AREA){const x=bigHtml(a);if(x)h+=x.replace(/💎 とんでもなく高額なアクション/,'💎 '+n)}}finally{BIG_ALL=0}
 return h?`<h3>💎 とんでもなく高額なアクション</h3><p class="hint">お金がたくさんあるときの、大きな使い道です。</p>${h}`:''}
{const _sp68=spendHtml;spendHtml=function(){return _sp68.apply(this,arguments)+hostHtml()+bigAllHtml()}}
{const _te68=townExtra;townExtra=function(){const h=_te68.apply(this,arguments);const i=h.indexOf('<h3>まちのイベントを主催する</h3>');return i<0?h:h.slice(0,i)+'<p class="hint">まちのイベントの主催は「お金」→「使い道」からできます。</p>'}}
// 部屋の飾りは「買い物」の中へ
{const _st68=subTabs;subTabs=function(tabk,items){if(tabk==='money'){items=items.filter(x=>x[0]!=='room');if(SUB.money==='room')SUB.money='shop'}return _st68.call(this,tabk,items)}}
{const _pm68=panelMoney;panelMoney=function(){if(SUB.money==='room')SUB.money='shop';const h=_pm68.apply(this,arguments);try{if(age()>=18&&SUB.money==='shop')return h+'<h3>🖼 部屋の飾り</h3>'+decoPanel()}catch(e){console.error(e)}return h}}
(function(){for(const x of GUIDE)x[2]=x[2].replace(/「部屋の飾り」/g,'「買い物」の「部屋の飾り」')})();
(function(){for(const x of GUIDE)x[2]=x[2].replace('・使い道・買い物・部屋の飾り・投資・借入（借入は18歳から）があります。','・家計・使い道・買い物（部屋の飾りもここ）・投資・借入（借入は18歳から）があります。').replace('・お金に余裕ができたら、各画面の「💎とんでもなく高額なアクション」も使えます。','・お金に余裕ができたら、「使い道」の「💎とんでもなく高額なアクション」や、まちのイベントの主催も使えます。')})();
try{for(const f of FIND){if(/高額/.test(f[0])){f[1]='お金 → 使い道';f[2]='money:spend'}if(/主催/.test(f[0])){f[1]='お金 → 使い道';f[2]='money:spend'}if(/飾り/.test(f[0])){f[1]='お金 → 買い物';f[2]='money:shop'}}}catch(_){}

// ===== v3.0（7）：契約・サブスクの種類を減らす（契約中のものは、そのまま続けられる） =====
const SUBS_HIDE=new Set('sozai cloud bgmlib shodo acting photo sleep telemed massage manga kaden fukurent flower coffee magazine driver stylist moonland kakuu stone surprise fossil cloudorder kakeibo t_game2 t_cook1 t_beauty2 t_talk2 t_study2 t_music1 t_comedy2'.split(' '));
{const _sl68=subsListHtml;subsListHtml=function(){let h=_sl68.apply(this,arguments);try{for(const k of SUBS_HIDE){if(S.subs&&S.subs[k])continue;const at=h.indexOf(`data-sub2="${k}"`);if(at<0)continue;const st=h.lastIndexOf('<div class="shop">',at);const en=h.indexOf('</div>',h.indexOf('</button>',at));if(st>=0&&en>=0)h=h.slice(0,st)+h.slice(en+6)}}catch(e){console.error(e)}return h}}
