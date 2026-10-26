
// ===== v3.0（13）：予定の決め方「バランスよく全部」（できる行動を、毎月少しずつ全部やる） =====
PMODES.push(['bal','バランスよく全部','できる行動を、毎月少しずつ順番に全部やります。やりたくない行動だけ外せます。変えたい月だけ「今月だけ」も使えます']);
function balOff(){if(!S.balOff)S.balOff={};return S.balOff}
function balRows(){const off=balOff();const rows=[];for(const [k] of actOk()){if(off[k])continue;let w=10;if(k==='post'&&age()>=13)w=20;if(k==='rest'){w=S.p.health<45||S.p.mental<40?40:6}rows.push([k,null,w])}return rows}
function balApply(){if(!S.bal)S.bal={rows:[],carry:{}};S.bal.rows=balRows();if(!S.bal.rows.length)return;const sv=S.ratio;S.ratio=S.bal;try{ratioApply()}finally{S.bal=S.ratio;S.ratio=sv}}
function balPreview(){if(!S.bal)S.bal={rows:[],carry:{}};S.bal.rows=balRows();const sv=S.ratio;S.ratio=S.bal;try{return ratioPreview()}finally{S.ratio=sv}}
{const _t74=turn;turn=function(){if(!S||!S.alive||modalOpen()||pmode()!=='bal'||age()<6)return _t74.apply(this,arguments);
 const au=S.auto;S.auto=0;let sv=null;try{if(onceOn()){sv=[S.plan.slice(),(S.planOpt||[]).slice()];S.plan=S.once.plan.slice();S.planOpt=S.once.opt.slice()}else balApply();return _t74.apply(this,arguments)}
 finally{S.auto=au;if(sv){S.plan=sv[0];S.planOpt=sv[1]}if(S.once&&S.once.am<S.am)S.once=null}}}
function balHtml(){const off=balOff();const L=actOk();const pv=balPreview();
 return `<h3>バランスよく全部</h3><p class="hint">できる行動を、毎月少しずつ順番に全部やります（投稿は多め・疲れているときは休みを多め）。外したい行動は、押してオフにできます。</p><div class="chips">${L.map(([k,a])=>`<button class="b sm ${off[k]?'':'on'}" type="button" data-baloff="${k}" aria-pressed="${!off[k]}">${esc(a.n)}</button>`).join('')}</div>${pv.length?`<p class="hint">来月の予定（目安）：${pv.map(a=>esc(ACT[a]?ACT[a].n:a)).join('・')}</p>`:'<p class="hint">行動がすべてオフになっています。</p>'}`}
{const _pp74=panelPlan;panelPlan=function(){let h=_pp74.apply(this,arguments);try{if(S&&age()>=6&&pmode()==='bal'){const r=ratioHtml();const k=h.indexOf(r);if(k>=0)h=h.slice(0,k)+balHtml()+onceHtml()+h.slice(k+r.length)}}catch(e){console.error(e)}return h}}
document.addEventListener('click',e=>{const b=e.target.closest('[data-baloff]');if(!b||!S)return;const off=balOff(),k=b.dataset.baloff;if(off[k])delete off[k];else off[k]=1;save();renderPanel()});
