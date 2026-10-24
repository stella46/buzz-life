
// ===== v2.8.1：データの移動で、渡すセーブスロットと受け取り先を選べるように =====
function trSlotLine(i,inf){return `${esc(slotName(i))}：${esc(inf.name||'')}（${inf.age}歳・${inf.y}年${inf.cty?'・'+esc(inf.cty):''}）`}
function trSelHtml(){const used=slotsUsed();return `<fieldset class="fbset trsel" id="trSel"><legend>渡すものを選ぶ</legend>
 ${used.length?used.map(([i,inf])=>`<label class="omki"><input type="checkbox" data-trs="${i}" checked><span><b>${trSlotLine(i,inf)}</b></span></label>`).join(''):'<p class="hint">セーブされている人生はありません。</p>'}
 <label class="omki"><input type="checkbox" id="trMeta" checked><span><b>実績・図鑑・引き継ぎスキル・プレイ時間の記録</b><small>どの人生でも共通のデータ</small></span></label></fieldset>`}
{const _sT56=showTransfer;showTransfer=function(){const r=_sT56.apply(this,arguments);try{const m=$('#mcard');const hs=[...m.querySelectorAll('h3')].find(h=>/渡す/.test(h.textContent));if(hs)hs.insertAdjacentHTML('afterend',trSelHtml())}catch(e){console.error(e)}return r}}
// 渡すとき：選んだものだけをコードにする
{const _pa56=packAll;packAll=async function(){const box=$('#trSel');if(!box)return _pa56.apply(this,arguments);const sel=[...box.querySelectorAll('[data-trs]:checked')].map(x=>+x.dataset.trs),meta=$('#trMeta').checked;
 const d={v:2,at:Date.now(),slot:sel.includes(SLOT)?SLOT:(sel[0]||0),slots:{},meta:null,part:1};if(S&&S.alive&&!NOSAVE)save(true);
 for(const i of sel){try{const r=localStorage.getItem(slotKey(i));if(r)d.slots[i]=r}catch(_){}}if(meta){try{d.meta=localStorage.getItem(META_K)}catch(_){}}
 const lb=slotLabels(),l2={};for(const i of sel)if(lb[i])l2[i]=lb[i];d.labels=JSON.stringify(l2);
 const json=JSON.stringify(d);if(typeof CompressionStream!=='undefined'){try{const cs=new Blob([json]).stream().pipeThrough(new CompressionStream('gzip'));const buf=new Uint8Array(await new Response(cs).arrayBuffer());let bin='';for(let i=0;i<buf.length;i+=8192)bin+=String.fromCharCode.apply(null,buf.subarray(i,i+8192));return 'NIP2Z.'+btoa(bin)}catch(_){}}
 return 'NIP2.'+btoa(unescape(encodeURIComponent(json)))}}
document.addEventListener('click',e=>{const b=e.target.closest('[data-act="trCopy"],[data-act="trFile"]');if(!b)return;const box=$('#trSel');if(!box)return;if(!box.querySelector('[data-trs]:checked')&&!$('#trMeta').checked){e.stopImmediatePropagation();toast('渡すものを1つ以上選んでください')}},true);

// 受け取るとき：人生ごとに入れる先を選ぶ
let TR_IN=null;
function inSumm(raw){try{const o=JSON.parse(raw);return o?slotSumm(o):null}catch(_){return null}}
function trRecvHtml(d){const lives=Object.entries(d.slots||{}).map(([i,raw])=>[+i,raw,inSumm(raw)]).filter(x=>x[2]);const lb=(()=>{try{return JSON.parse(d.labels||'{}')||{}}catch(_){return {}}})();
 const here=[];for(let j=0;j<SLOT_N;j++)here.push([j,slotInfo(j)]);const empties=here.filter(x=>!x[1]).map(x=>x[0]);
 let h=`<div class="card confirm-inline trrecv"><h3>受け取る内容</h3>`;
 if(lives.length){h+=`<p class="hint">人生ごとに、この端末のどのスロットに入れるかを選んでください。</p>`;lives.forEach(([i,raw,inf],n)=>{const def=empties[n]!=null?empties[n]:-1;
  h+=`<div class="trrow"><div><b>${esc(lb[i]||('スロット'+(i+1)))}</b>：${esc(inf.name||'')}（${inf.age}歳・${inf.y}年）</div><select data-trin="${i}"><option value="-1" ${def<0?'selected':''}>受け取らない</option>${here.map(([j,s])=>`<option value="${j}" ${def===j?'selected':''}>スロット${j+1}${s?`（${esc(s.name)}を上書き）`:'（空き）'}</option>`).join('')}</select></div>`})}
 else h+=`<p class="hint">このコードには、人生（セーブ）は入っていません。</p>`;
 if(d.meta)h+=`<h3>実績・図鑑・引き継ぎスキル</h3><div class="seg wrapseg" id="trMetaMode"><button type="button" class="on" data-trmm="merge">合わせる（両方の記録を残す）</button><button type="button" data-trmm="replace">置きかえる</button><button type="button" data-trmm="skip">受け取らない</button></div>`;
 return h+`<p class="hint" id="trInMsg"></p><div class="row"><button class="b sm warnb" type="button" data-act="trInGo">受け取る</button><button class="b sm" type="button" data-act="trNo">やめる</button></div></div>`}
{const _ti56=trImport;trImport=async function(code){const d=await unpack(code);if(!d||d.single)return _ti56.apply(this,arguments);TR_IN=d;const bx=$('#trBox');bx.innerHTML=trRecvHtml(d);try{bx.scrollIntoView({block:'start',behavior:'smooth'})}catch(_){}}}
function metaMerge(a,b){if(a==null)return b;if(b==null)return a;if(Array.isArray(a)&&Array.isArray(b))return [...new Set(a.concat(b))];if(typeof a==='object'&&typeof b==='object'){const o=Object.assign({},a);for(const k in b)o[k]=k in a?metaMerge(a[k],b[k]):b[k];return o}if(typeof a==='number'&&typeof b==='number')return Math.max(a,b);return a}
document.addEventListener('click',e=>{const b=e.target.closest('[data-trmm]');if(!b)return;document.querySelectorAll('[data-trmm]').forEach(x=>x.classList.toggle('on',x===b))});
document.addEventListener('click',e=>{const b=e.target.closest('[data-act="trInGo"]');if(!b||!TR_IN)return;const d=TR_IN;const msg=t=>{const m=$('#trInMsg');if(m)m.textContent=t};
 const plan=[...document.querySelectorAll('[data-trin]')].map(s=>[+s.dataset.trin,+s.value]).filter(x=>x[1]>=0);const dest=plan.map(x=>x[1]);if(new Set(dest).size!==dest.length){msg('同じスロットに2つの人生は入れられません。入れる先を分けてください。');return}
 const mm=(document.querySelector('[data-trmm].on')||{}).dataset;const mode=mm?mm.trmm:'skip';if(!plan.length&&(!d.meta||mode==='skip')){msg('受け取るものを選んでください。');return}
 const lb=(()=>{try{return JSON.parse(d.labels||'{}')||{}}catch(_){return {}}})();
 for(const [i,j] of plan){try{localStorage.setItem(slotKey(j),d.slots[i]);localStorage.removeItem(slotKey(j)+'-snap')}catch(_){msg('保存できませんでした（容量がいっぱいかもしれません）');return}setSlotName(j,lb[i]||'')}
 try{localStorage.removeItem(SLOT_INFO)}catch(_){}
 if(d.meta&&mode!=='skip'){try{const inc=JSON.parse(d.meta)||{};const cur=(()=>{try{return JSON.parse(localStorage.getItem(META_K)||'{}')||{}}catch(_){return {}}})();const nm=mode==='replace'?inc:metaMerge(cur,inc);localStorage.setItem(META_K,JSON.stringify(nm));
  const base={};for(const k in META){const v=META[k];base[k]=Array.isArray(v)?[]:(v&&typeof v==='object')?{}:typeof v==='number'?0:v}META=Object.assign(base,nm)}catch(err){console.error(err)}}
 TR_IN=null;if(plan.length)setSlot(plan[0][1]);if(S&&!$('#scrGame').hidden)setSpeed(0);S=null;showScreen('title');initTitle();closeModal();toast(`受け取りました（人生${plan.length}つ${d.meta&&mode!=='skip'?'・実績など':''}）`)},true);
document.addEventListener('click',e=>{if(e.target.closest('[data-act="trNo"]'))TR_IN=null});
