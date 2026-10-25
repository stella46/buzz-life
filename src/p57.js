
// ===== v2.9：バランス調整 =====
// 子どものうちは、まちの自動開発をしない
{const _adt57=autoDevTown;autoDevTown=function(){if(age()<18)return;return _adt57.apply(this,arguments)}}
// お店のもうけを現実に近く（SNSの収入とのつり合いを取る）
const SHOP_MUL=.25;
{const _sc57=shopCalc;shopCalc=function(i,commit){const r=_sc57.apply(this,arguments);if(r){r.sales=Math.round(r.sales*SHOP_MUL);r.cost=Math.round(r.cost*SHOP_MUL);r.profit=r.sales-r.cost}return r}}
// 長いあいだ生活が苦しいときの支援（借金で動けなくならないように）
function safetyCheck(){if(age()<18||!S.alive)return;if(S.money<0){S.flags.negM=(S.flags.negM||0)+1}else S.flags.negM=0;
 if(S.flags.negM>=12&&(S.cd.safety==null||S.am-S.cd.safety>=120)&&!S.q.includes('safety')){S.q.push('safety')}}
E('safety',{t:'生活の立て直し',cat:'暮らし',w:0,text:()=>`お金が足りない状態が1年以上続いている（いま ${yen(S.money)}）。\n役所の窓口で相談したところ、生活を立て直すための公的な支援制度があると教えてもらった。`,
 ch:()=>[['支援制度を利用する',()=>{const d=-Math.min(0,S.money);S.money=Math.max(0,S.money);S.debt=Math.round((S.debt||0)*.3);S.flags.negM=0;ad('mental',8);ad('rep',-2);tl('公的な支援で生活を立て直した');return `マイナスだった${yen(d)}が整理され、借入も大きく減った。ここから立て直そう。`}],
  ['自分の力でがんばる',()=>{ad('mental',-3);persAdd&&persAdd('bold',1);S.flags.negM=6;return 'もう少し、自分の力でやってみることにした。'}]]});
{const _mh57=monthHook11;monthHook11=function(){_mh57();try{safetyCheck()}catch(e){console.error(e)}}}
// v3.0 以降：「はじめから」で v2.9 も選べるように（v2.9 のあいだは表示しない）
{const _ss57=showSlots;showSlots=function(mode){const r=_ss57.apply(this,arguments);try{if(mode==='new'&&CUR_VER!=='v2.9'&&!/^v2\.9/.test(CUR_VER)){const row=document.querySelector('#verPick .vp-row');if(row&&!row.querySelector('[href="versions/v2.9/"]'))row.insertAdjacentHTML('beforeend',`<a class="b vp" href="versions/v2.9/" data-vp="v29"><b>v2.9</b><span>v3.0で整理される前の、機能がいちばん多い版です。別の画面で開き、セーブも別になります</span></a>`)}}catch(_){}return r}}
if(!/^v2\.9/.test(CUR_VER)&&!OLD_VERS.some(v=>v[0]==='v2.9'))OLD_VERS.unshift(['v2.9','versions/v2.9/','v3.0で整理される前の、機能がいちばん多い版（v2.9）']);
