
// ===== v2.2：予定の決め方を切りかえ式に（いつもの枠／いつもの予定＋今月だけ／割合／割合＋今月だけ） =====
const PMODES=[['classic','いつもの枠','これまでどおり、枠ごとに行動を選ぶ'],['routine','いつもの予定＋今月だけ','ふだんの予定は決めたまま。変えたい月だけ「今月だけ」を使う'],['ratio','割合で決める','「投稿50%・休み20%」のように、時間の使い方を割合で配分する'],['hybrid','割合＋今月だけ','ふだんは割合で、変えたい月だけ「今月だけ」を使う']];
function pmode(){return (S&&S.pmode)||'classic'}
function pmSwitch(){const md=pmode(),d=PMODES.find(x=>x[0]===md);return `<div class="pmsw"><div class="seg wrapseg">${PMODES.map(([k,n])=>`<button type="button" class="${md===k?'on':''}" data-pm="${k}" aria-pressed="${md===k}">${n}</button>`).join('')}</div><p class="hint">予定の決め方：${esc(d[2])}（いつでも切りかえられます）</p></div>`}
function actOk(){return Object.entries(ACT).filter(([,a])=>a.ok())}
function optsOf(a){const ac=ACT[a];if(!ac||!ac.opts)return [];return ac.opts.filter(o=>!o.ok||o.ok())}
function optSelect(attr,i,a,cur){const os=optsOf(a);if(!os.length)return '';const c=os.find(o=>o.k===cur)||os[0];return `<select ${attr}="${i}">${os.map(o=>`<option value="${o.k}" ${o===c?'selected':''}>${esc(o.n)}</option>`).join('')}</select>`}
function optDescOf(a,cur){const ac=ACT[a];if(!ac)return '';const os=optsOf(a);const c=os.find(o=>o.k===cur)||os[0];return c?c.d:ac.d}

// ----- いつもの予定（枠） -----
function routineHtml(){const n=freeSlots();let h=`<h3>いつもの予定</h3><p class="hint">自由に使える枠：${n}つ。ここで決めた予定が毎月くり返されます。</p><div class="grp">`;
 for(let i=0;i<n;i++)h+=`<div class="slotc"><span class="lb">枠${i+1}</span><div class="sel2"><select data-plan="${i}" id="plan${i}">${actOptions(i)}</select>${optSel(i)}</div><p class="ds">${esc(optDesc(i))}</p></div>`;
 return h+'</div>'}

// ----- 今月だけ -----
function onceOn(){return S.once&&S.once.am===S.am}
function onceHtml(){const n=freeSlots();if(!onceOn())return `<div class="oncebox"><button class="b" type="button" data-once="start">📅 今月だけ予定を変える</button><p class="hint">旅行や勉強の追いこみなど、今月だけちがうことをしたいときに。来月は自動でふだんの予定に戻ります。</p></div>`;
 const o=S.once;while(o.plan.length<n){o.plan.push(defaultAct());o.opt.push(null)}o.plan.length=n;o.opt.length=n;
 let h=`<div class="oncebox on"><h3>📅 今月だけの予定 <span class="chip">${S.m}月</span></h3><div class="grp">`;
 for(let i=0;i<n;i++){const a=o.plan[i];h+=`<div class="slotc"><span class="lb">枠${i+1}</span><div class="sel2"><select data-oplan="${i}">${actOk().map(([k,ac])=>`<option value="${k}" ${a===k?'selected':''}>${esc(ac.n)}</option>`).join('')}</select>${optSelect('data-oopt',i,a,o.opt[i])}</div><p class="ds">${esc(optDescOf(a,o.opt[i]))}</p></div>`}
 return h+`</div><div class="row"><button class="b sm" type="button" data-once="stop">今月だけの予定をやめる</button></div></div>`}

// ----- 割合 -----
function ratioRows(){if(!S.ratio||!Array.isArray(S.ratio.rows)){const m={};for(let i=0;i<(S.plan||[]).length;i++){const k=S.plan[i]+'|'+((S.planOpt||[])[i]||'');m[k]=(m[k]||0)+1}
  const rows=Object.entries(m).map(([k,c])=>{const [a,o]=k.split('|');return [a,o||null,c*10]});S.ratio={rows:rows.length?rows:[[defaultAct(),null,10]],carry:{}}}return S.ratio.rows}
function ratioSum(){return ratioRows().reduce((a,r)=>a+(ACT[r[0]]&&ACT[r[0]].ok()?r[2]:0),0)}
function ratioHtml(){const n=freeSlots(),rows=ratioRows(),sum=ratioSum();
 let h=`<h3>時間の使い方（割合）</h3><p class="hint">自由に使える時間（${n}枠分）を、割合で配分します。端数は月ごとに順番に回るので、長い目で見ると割合どおりになります。</p><div class="grp">`;
 rows.forEach((r,i)=>{const ok=ACT[r[0]]&&ACT[r[0]].ok();const pct=sum&&ok?Math.round(r[2]/sum*100):0;
  h+=`<div class="slotc rrow"><div class="sel2"><select data-ract="${i}">${actOk().map(([k,ac])=>`<option value="${k}" ${r[0]===k?'selected':''}>${esc(ac.n)}</option>`).join('')}${ok?'':`<option selected>（いまは選べない）</option>`}</select>${ok?optSelect('data-ropt',i,r[0],r[1]):''}${rows.length>1?`<button class="b sm ghost" type="button" data-rdel="${i}" aria-label="この行を消す">✕</button>`:''}</div>
  <div class="rsl"><input type="range" min="0" max="100" step="5" value="${r[2]}" data-rw="${i}" aria-label="割合"><b class="rpct" id="rpct${i}">${pct}%</b></div><p class="ds">${ok?esc(optDescOf(r[0],r[1]))+`（約${(n*pct/100).toFixed(1)}枠分）`:'条件を満たしていないので、いまは時間を使いません'}</p></div>`});
 h+='</div>';if(rows.length<6)h+=`<div class="row"><button class="b sm" type="button" data-radd="1">＋ 行動を追加</button></div>`;
 h+=`<div class="rbar">${rows.map((r,i)=>{const ok=ACT[r[0]]&&ACT[r[0]].ok();const p=sum&&ok?r[2]/sum*100:0;return p?`<i style="width:${p.toFixed(1)}%" class="c${i%6}" title="${esc(ACT[r[0]].n)}"></i>`:''}).join('')}</div>`;
 const pl=ratioPreview();if(pl.length)h+=`<p class="hint">来月の予定（目安）：${pl.map(a=>esc(ACT[a]?ACT[a].n:a)).join('・')}</p>`;
 return h}
function ratioCalc(commit){const n=freeSlots();if(n<=0)return null;const R0=ratioRows().filter(r=>ACT[r[0]]&&ACT[r[0]].ok()&&r[2]>0);if(!R0.length)return null;const sum=R0.reduce((a,r)=>a+r[2],0);const c=Object.assign({},S.ratio.carry||{});
 const q=R0.map(r=>{const key=r[0]+':'+(r[1]||'');return [r,key,n*r[2]/sum+(c[key]||0)]});
 const al=q.map(x=>Math.max(0,Math.floor(x[2])));let left=n-al.reduce((a,b)=>a+b,0);
 const ord=q.map((x,i)=>[x[2]-al[i],i]).sort((a,b)=>b[0]-a[0]);for(const [,i] of ord){if(left<=0)break;al[i]++;left--}
 while(left<0){let bi=-1,bf=9;q.forEach((x,i)=>{const f=x[2]-al[i];if(al[i]>0&&f<bf){bf=f;bi=i}});if(bi<0)break;al[bi]--;left++}
 const plan=[],opt=[];q.forEach((x,i)=>{c[x[1]]=clamp(x[2]-al[i],-1,1);for(let j=0;j<al[i];j++){plan.push(x[0][0]);opt.push(x[0][1]||null)}});
 for(const k of Object.keys(c))if(!q.some(x=>x[1]===k))delete c[k];if(commit)S.ratio.carry=c;return {plan:plan.slice(0,n),opt:opt.slice(0,n)}}
function ratioPreview(){const r=ratioCalc(false);return r?r.plan:[]}
function ratioApply(){const r=ratioCalc(true);if(!r)return;S.plan=r.plan;S.planOpt=r.opt}

// ----- ターンに反映 -----
const _turn46=turn;turn=function(){if(!S||!S.alive||modalOpen())return _turn46.apply(this,arguments);const md=pmode();if(md==='classic')return _turn46.apply(this,arguments);
 const am0=S.am,once=(md==='routine'||md==='hybrid')&&onceOn();let saved=null;const au=S.auto;S.auto=0;
 try{if((md==='ratio'||md==='hybrid')&&!once&&age()>=6)ratioApply();
  if(once){saved=[S.plan.slice(),(S.planOpt||[]).slice()];S.plan=S.once.plan.slice();S.planOpt=S.once.opt.slice()}
  return _turn46.apply(this,arguments)}
 finally{S.auto=au;if(saved){S.plan=saved[0];S.planOpt=saved[1]}if(S.once&&S.once.am<S.am)S.once=null;void am0}};

// ----- 画面 -----
const _pp46=panelPlan;panelPlan=function(){let h=_pp46.apply(this,arguments);if(!S||age()<6)return h;const md=pmode();
 const i0=h.indexOf('<p class="hint">自由に使える枠'),mk='ONにすると行動を自動で決める</span></div>',i1=h.indexOf(mk);if(i0<0||i1<0)return h;
 let mid=pmSwitch();if(md==='classic')mid+=h.slice(i0,i1+mk.length);else if(md==='routine')mid+=routineHtml()+onceHtml();else mid+=ratioHtml()+(md==='hybrid'?onceHtml():'');
 return h.slice(0,i0)+mid+h.slice(i1+mk.length)};
document.addEventListener('click',e=>{const b=e.target.closest('[data-pm],[data-once],[data-radd],[data-rdel]');if(!b||!S)return;const d=b.dataset;
 if(d.pm){S.pmode=d.pm;if(d.pm!=='classic')S.auto=0;if(d.pm==='ratio'||d.pm==='hybrid')ratioRows();if(d.pm==='classic'||d.pm==='ratio')S.once=null;toast('予定の決め方：'+PMODES.find(x=>x[0]===d.pm)[1])}
 else if(d.once==='start'){S.once={am:S.am,plan:(S.plan||[]).slice(),opt:(S.planOpt||[]).slice()}}
 else if(d.once==='stop')S.once=null;
 else if(d.radd){const rows=ratioRows();const used=new Set(rows.map(r=>r[0]));const nx=actOk().map(x=>x[0]).find(k=>!used.has(k))||defaultAct();rows.push([nx,null,10])}
 else if(d.rdel!=null){const rows=ratioRows();if(rows.length>1)rows.splice(+d.rdel,1)}
 save();renderPanel()});
document.addEventListener('change',e=>{const t=e.target;if(!S)return;const d=t.dataset;
 if(d.oplan!=null&&onceOn()){S.once.plan[+d.oplan]=t.value;S.once.opt[+d.oplan]=null}
 else if(d.oopt!=null&&onceOn())S.once.opt[+d.oopt]=t.value;
 else if(d.ract!=null){const r=ratioRows()[+d.ract];if(r&&ACT[t.value]){r[0]=t.value;r[1]=null}}
 else if(d.ropt!=null){const r=ratioRows()[+d.ropt];if(r)r[1]=t.value}
 else if(d.rw!=null){const r=ratioRows()[+d.rw];if(r)r[2]=+t.value}
 else return;save();renderPanel()});
document.addEventListener('input',e=>{const t=e.target;if(!S||t.dataset.rw==null)return;const rows=ratioRows(),r=rows[+t.dataset.rw];if(!r)return;r[2]=+t.value;const sum=ratioSum();rows.forEach((x,i)=>{const el=document.getElementById('rpct'+i);if(el)el.textContent=(sum&&ACT[x[0]]&&ACT[x[0]].ok()?Math.round(x[2]/sum*100):0)+'%'})});
