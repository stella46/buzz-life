
// ===== v3.0（9）：研究をまとめる（研究ラインとひとつずつの研究を1つの一覧に・ずっと続く研究とスキルも研究の画面へ） =====
{const _rp70=researchPanel;researchPanel=function(){if(RESCAT==='skill'){let h=_rp70.apply(this,(RESCAT='rec',arguments));RESCAT='skill';
  const i=h.indexOf('<p class="hint">いまの遊び方に合わせて');h=(i<0?h:h.slice(0,i))+`<p class="hint">スキルポイント（人生の節目でもらえる）で覚える、この人生のスキルです。</p>`+sktHtml();return navRes(h)}
 if(RESCAT==='lv')RESCAT='rec';let h=_rp70.apply(this,arguments);
 if(RESCAT==='rec'){h+=`<details class="pmore"><summary>ポイントが余ったら：何段でも重ねられる研究</summary><div class="rtree">${RLV.map(([k,n,d])=>`<div class="rnode ready"><div class="rb"><div>${n} <b>${rlv(k)}段</b> <span class="muted small">${rlvCost(k)}pt</span></div><div class="muted small">${d}</div></div><button class="b sm" type="button" data-rlv="${k}" ${S.rp<rlvCost(k)||rlv(k)>=20?'disabled':''}>研究する</button></div>`).join('')}</div></details>`}
 else{h=h.replace('<h3>研究ライン</h3>','<h3>研究</h3>').replace(/<h3>ひとつずつの研究 <span class="muted small">[^<]*<\/span><\/h3>/,'')}
 return navRes(h)}}
function navRes(h){return h.replace(/<button type="button" class="[^"]*" data-rescat="lv">[^<]*<\/button>/,'').replace(/(<div class="seg wrapseg restabs">[\s\S]*?)(<\/div>)/,`$1<button type="button" class="${RESCAT==='skill'?'on':''}" data-rescat="skill">🌱 スキル${(S.sp||0)>0?`<span class="badge">${S.sp}</span>`:''}</button>$2`)}
// 「人生」の「スキル」は研究の画面へ（引き継ぎスキルは「人生」→「自分」に）
document.addEventListener('click',e=>{const b=e.target.closest('[data-goto="life:skill"],[data-sub="life:skill"]');if(!b)return;if(b.dataset.goto)b.dataset.goto='biz:res';if(b.dataset.sub)b.dataset.sub='biz:res';RESCAT='skill';if(b.dataset.sub){e.stopImmediatePropagation();e.preventDefault();SUB.biz='res';setTab('biz');try{renderBadges()}catch(_){}}},true);
{const _st70=subTabs;subTabs=function(tabk,items){if(tabk==='life'){items=items.filter(x=>x[0]!=='skill');if(SUB.life==='skill')SUB.life='stat'}return _st70.call(this,tabk,items)}}
{const _pl70=panelLife;panelLife=function(){if(SUB.life==='skill')SUB.life='stat';let h=_pl70.apply(this,arguments);try{if(SUB.life==='stat'){const L=legState();const can=LEG.filter(x=>!L.nodes[x.id]&&(!x.req||L.nodes[x.req])&&x.ok(META.rec)&&L.lp>=x.c).length;
 h+=`<div class="card legcard"><div class="hd"><span>🌱 引き継ぎスキル</span><b>${L.lp} ポイント</b></div><p class="hint">すべての人生で有効なスキルです。人生の節目や実績の解除で、途中でもポイントがもらえます。${can?`<b>いま ${can}つ覚えられます。</b>`:''}</p><div class="row"><button class="b sm ${can?'pri':''}" type="button" data-act="legacy">引き継ぎスキルを見る</button>${(S.sp||0)>0?`<button class="b sm" type="button" data-goto="life:skill">この人生のスキル（${S.sp}ポイント）</button>`:''}</div></div>`}}catch(e){console.error(e)}return h}}
{const _stp70=secTip;secTip=function(){const r=_stp70.apply(this,arguments);try{if(r&&r[1]==='life:skill')r[1]='biz:res';if(r&&r[1]==='biz:res'&&/スキル/.test(r[0]))RESCAT='skill'}catch(_){}return r}}
try{for(const f of FIND){if(f[2]==='life:skill'){f[2]='biz:res';f[1]=String(f[1]).replace('人生 → スキル','事業 → 研究 → スキル')}}}catch(_){}
(function(){for(const x of GUIDE)x[2]=x[2].replace(/「人生」→「スキル」/g,'「事業」→「研究」の「🌱 スキル」').replace(/「ずっと続く」/g,'「何段でも重ねられる研究」')})();
