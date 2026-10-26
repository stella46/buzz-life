
// ===== v3.4.3：軽量の予定の決め方は「枠で決める」と「バランスよく全部」（はじめは枠で決める） =====
pmode=(function(_pm){return function(){if(isLite()){if(S.pmode!=='bal'&&S.pmode!=='classic')S.pmode='classic';return S.pmode}return _pm.apply(this,arguments)}})(pmode);
{const _ps96=pmSwitch;pmSwitch=function(){if(!isLite())return _ps96.apply(this,arguments);const keep=PMODES.slice();const L=PMODES.filter(x=>x[0]!=='hybrid');PMODES.length=0;PMODES.push(...L);try{return _ps96.apply(this,arguments)}finally{PMODES.length=0;PMODES.push(...keep)}}}
// 軽量でも切りかえを表示（割合は除く）
{const _pp96=panelPlan;panelPlan=function(){if(!isLite())return _pp96.apply(this,arguments);const keep=S.lite;let h;S.lite=0;const sp=S.pmode;try{h=_pp96.apply(this,arguments)}finally{S.lite=keep;S.pmode=sp}
 return h.replace(/<div class="pmsw">[\s\S]*?<p class="hint">予定の決め方：[^<]*<\/p><\/div>/,pmSwitch())}}
document.addEventListener('click',e=>{const b=e.target.closest('[data-pm="hybrid"]');if(b&&isLite()){e.stopImmediatePropagation();e.preventDefault()}},true);
{const _ng96=newGame;newGame=function(){const r=_ng96.apply(this,arguments);try{if(S&&S.lite)S.pmode='classic'}catch(_){}return r}}
(function(){for(const x of GUIDE)x[2]=x[2].replace('・予定の決め方は「バランスよく全部」だけです。','・予定の決め方は「枠で決める」（はじめはこれ）と「バランスよく全部」の2つです。').replace('・決め方は3つです（軽量は「バランスよく全部」だけ）。','・決め方は3つです（軽量は「枠で決める」と「バランスよく全部」の2つ）。').replace('予定は「バランスよく全部」','予定は「枠」か「バランスよく全部」')})();
