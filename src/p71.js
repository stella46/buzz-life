
// ===== v3.0（10）：「人生」をまとめる（人生の選択はつながりの中へ／アルバム・記録・ランキングは「記録」1画面に） =====
let NO_SUBTABS=0;
function lifeSub(k){if(!S)return '';const sv=SUB.life;SUB.life=k;NO_SUBTABS=1;try{return panelLife()}catch(e){console.error(e);return ''}finally{NO_SUBTABS=0;SUB.life=sv}}
{const _pl71=panelLife;panelLife=function(){if(!S)return '';if(NO_SUBTABS)return _pl71.apply(this,arguments);const s=SUB.life;
 if(s==='choice'){SUB.life='ppl'}else if(s==='album'||s==='world'){SUB.life='rec'}
 let h=_pl71.apply(this,arguments);
 try{if(SUB.life==='ppl')h+=`<h2>人生の選択</h2>`+lifeSub('choice');
  if(SUB.life==='rec'){h+=`<details class="pmore"><summary>📷 アルバム</summary>${lifeSub('album')}</details><details class="pmore"><summary>🌍 世界・ランキング</summary>${lifeSub('world')}</details>`}}catch(e){console.error(e)}
 return h}}
{const _st71=subTabs;subTabs=function(tabk,items){if(NO_SUBTABS)return '';if(tabk==='life'){items=items.filter(x=>!['choice','album','world'].includes(x[0]))}return _st71.call(this,tabk,items)}}
document.addEventListener('click',e=>{const b=e.target.closest('[data-goto],[data-sub]');if(!b)return;const v=b.dataset.goto||b.dataset.sub;const m={'life:choice':'life:ppl','life:album':'life:rec','life:world':'life:rec','life:map':'life:ppl'}[v];if(m){if(b.dataset.goto)b.dataset.goto=m;else b.dataset.sub=m}},true);
{const _stp71=secTip;secTip=function(){const r=_stp71.apply(this,arguments);try{if(r&&r[1]){r[1]={'life:choice':'life:ppl','life:album':'life:rec','life:world':'life:rec','life:map':'life:ppl'}[r[1]]||r[1]}}catch(_){}return r}}
try{for(const f of FIND){const m={'life:choice':'life:ppl','life:album':'life:rec','life:world':'life:rec'}[f[2]];if(m){f[2]=m;f[1]=String(f[1]).replace(/人生 → [^／]*/,m==='life:ppl'?'人生 → 人':'人生 → 記録')}}}catch(_){}
