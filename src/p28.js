
// ===== v1.2：セーブスロット（5つ）と、かんたん引き継ぎ =====
const SLOT_N=5,SLOT_BASE=CFG.save,SLOT_IDX='nipporia-slot',SLOT_INFO='nipporia-slotinfo',META_K='nipporia-meta-v1';
function slotKey(i){return i?SLOT_BASE+'#'+(i+1):SLOT_BASE}
let SLOT=0,NOSAVE=false;try{SLOT=+(localStorage.getItem(SLOT_IDX)||0)||0}catch(_){}if(!(SLOT>=0&&SLOT<SLOT_N))SLOT=0;CFG.save=slotKey(SLOT);
function setSlot(i){SLOT=i;CFG.save=slotKey(i);try{localStorage.setItem(SLOT_IDX,String(i))}catch(_){}}
function slotInfoAll(){try{return JSON.parse(localStorage.getItem(SLOT_INFO)||'{}')||{}}catch(_){return {}}}
function slotSumm(o){let f=0;for(const k in (o.f||{}))if(o.open&&o.open[k])f+=o.f[k]||0;for(const c of (o.subch||[]))f+=c.f||0;
  return {name:o.name,age:Math.floor((o.am||0)/12),y:o.y,m:o.m,f:Math.round(f),cty:o.cty&&o.cty.n,at:o.savedAt||0,ms:o.playMs||0,gen:o.gen||1}}
function slotInfo(i){let raw=null;try{raw=localStorage.getItem(slotKey(i))}catch(_){}if(!raw)return null;const all=slotInfoAll();let inf=all[i];
  if(!inf||inf.len!==raw.length){try{const o=JSON.parse(raw);if(!o||!o.alive)return null;inf=slotSumm(o);inf.len=raw.length;all[i]=inf;localStorage.setItem(SLOT_INFO,JSON.stringify(all))}catch(_){return null}}return inf}
function slotsUsed(){const r=[];for(let i=0;i<SLOT_N;i++){const s=slotInfo(i);if(s)r.push([i,s])}return r}
function slotEmpty(){for(let i=0;i<SLOT_N;i++)if(!slotInfo(i))return i;return -1}
// 保存のたびに、スロットの一覧用の短いまとめも更新（重くならないよう小さなデータだけ）
const _save28=save;save=function(force){if(NOSAVE)return;const t0=S&&S.savedAt;_save28(force);if(S&&S.savedAt!==t0){try{const all=slotInfoAll();const inf=slotSumm(S);inf.len=-1;all[SLOT]=inf;localStorage.setItem(SLOT_INFO,JSON.stringify(all))}catch(_){}}};
function slotCard(i,s,mode){const cur=i===SLOT;const head=`<div class="hd"><span>スロット${i+1}${cur?' <span class="chip up">いまのスロット</span>':''}</span>${s?`<span class="muted small">${s.at?fmtDate(s.at):''}</span>`:''}</div>`;
  if(!s)return `<div class="card slotc2">${head}<p class="hint">空き</p>${mode==='new'?`<div class="row"><button class="b sm pri" type="button" data-slot="${i}" data-sm="new">ここで始める</button></div>`:''}</div>`;
  const body=`<p class="mtext"><b>${esc(s.name||'')}</b>　${s.age}歳・${esc(s.cty||'')}・${s.y}年${s.m}月${s.gen>1?`・${s.gen}代目`:''}</p><p class="hint small">フォロワー ${num(s.f)}人${s.ms?`・プレイ時間 ${fmtDur(s.ms)}`:''}</p>`;
  let btns='';if(mode==='cont')btns=`<button class="b sm pri" type="button" data-slot="${i}" data-sm="cont">この人生を続ける</button>`;
  else if(mode==='new')btns=`<button class="b sm" type="button" data-slot="${i}" data-sm="over">上書きして始める</button>`;
  else btns=`<button class="b sm" type="button" data-slot="${i}" data-sm="cont">続ける</button><button class="b sm ghost" type="button" data-slot="${i}" data-sm="del">消す</button>`;
  return `<div class="card slotc2" id="slotc_${i}">${head}${body}<div class="row">${btns}</div></div>`}
function showSlots(mode){const used=slotsUsed();let h=`<div class="mcat life">セーブスロット</div><h2>${mode==='new'?'どのスロットで始める？':mode==='cont'?'どの人生を続ける？':'セーブスロット'}</h2><p class="hint">${SLOT_N}つのスロットに、別々の人生を保存できる。月が進むたびに、遊んでいるスロットへ自動で保存される。実績・図鑑・引き継ぎスキルは全スロット共通。</p>`;
  let order=[...Array(SLOT_N).keys()];if(mode==='cont')order=used.sort((a,b)=>(b[1].at||0)-(a[1].at||0)).map(x=>x[0]);
  for(const i of order)h+=slotCard(i,slotInfo(i),mode);
  openModal(h+'<button class="b pri" type="button" data-act="close">閉じる</button>');$('#mcard').dataset.kind='slots'}
function contSlot(i){setSlot(i);const o=loadSaved();if(!o){toast('このスロットは読み込めませんでした');return}closeModal();S=o;showScreen('game');setTab('act');render()}
document.addEventListener('click',e=>{const b=e.target.closest('[data-slot]');if(!b)return;const i=+b.dataset.slot,m=b.dataset.sm;
  if(m==='cont'){if(S&&!$('#scrGame').hidden){save(true);setSpeed(0)}contSlot(i);return}
  if(m==='new'){setSlot(i);closeModal();showSetup();return}
  if(m==='over'){const c=$('#slotc_'+i);if(c)c.querySelector('.row').innerHTML=`<p class="hint">この人生は消えて、元に戻せない。</p><button class="b sm warnb" type="button" data-slot="${i}" data-sm="over2">上書きする</button><button class="b sm ghost" type="button" data-slot="${i}" data-sm="back">やめる</button>`;return}
  if(m==='over2'){try{localStorage.removeItem(slotKey(i))}catch(_){}setSlot(i);closeModal();showSetup();return}
  if(m==='del'){const c=$('#slotc_'+i);if(c)c.querySelector('.row').innerHTML=`<p class="hint">この人生を消す？元に戻せない。</p><button class="b sm warnb" type="button" data-slot="${i}" data-sm="del2">消す</button><button class="b sm ghost" type="button" data-slot="${i}" data-sm="back">やめる</button>`;return}
  if(m==='del2'){if(S&&i===SLOT&&!$('#scrGame').hidden){toast('いま遊んでいる人生は、タイトルに戻ってから消してね');return}try{localStorage.removeItem(slotKey(i))}catch(_){}initTitle();showSlots('manage');return}
  if(m==='back'){showSlots($('#mcard h2').textContent.includes('始める')?'new':'manage');return}});
// タイトルの「はじめから」「つづきから」をスロット対応に
document.addEventListener('click',e=>{const b=e.target.closest('#btnNew,#btnCont');if(!b)return;e.stopPropagation();e.preventDefault();snd('click');
  const used=slotsUsed();
  if(b.id==='btnNew'){if(!used.length){setSlot(0);showSetup();return}if(!slotInfo(SLOT)){showSetup();return}showSlots('new');return}
  if(!used.length)return;if(used.length===1){contSlot(used[0][0]);return}showSlots('cont')},true);
const _initTitle28=initTitle;initTitle=function(){_initTitle28();const used=slotsUsed(),b=$('#btnCont');if(b){b.disabled=!used.length;b.textContent=used.length>1?`つづきから（${used.length}つの人生）`:used.length?'つづきから':'つづきから（セーブなし）'}contInfo()};
contInfo=function(){let el=$('#contInfo');const b=$('#btnCont');if(!b)return;if(!el){el=document.createElement('p');el.id='contInfo';el.className='hint continfo';b.after(el)}
  const used=slotsUsed().sort((a,b)=>(b[1].at||0)-(a[1].at||0));el.hidden=!used.length;if(!used.length)return;const [i,s]=used[0];
  el.textContent=`最後に遊んだ：スロット${i+1}・${s.name} ${s.age}歳${s.at?`（${fmtDate(s.at)}）`:''}`};
// 全部消すときは、すべてのスロットも消す
const _doDelete28=doDelete;doDelete=function(k){if(k==='all'){for(let i=0;i<SLOT_N;i++){try{localStorage.removeItem(slotKey(i))}catch(_){}}try{localStorage.removeItem(SLOT_INFO)}catch(_){}}return _doDelete28(k)};
// チュートリアルは、空いているスロットで（なければ保存しない）
tutStart=function(){closeModal();try{localStorage.setItem(TUT_KEY,'done')}catch(_){}const e=slotInfo(SLOT)?slotEmpty():SLOT;NOSAVE=e<0;if(e>=0)setSlot(e);newGame({stage:'nipporia',era:'now'});setSpeed(0);TUT={i:0};tutShow();if(NOSAVE)toast('空きスロットがないので、このチュートリアルの人生は保存されません')};
const _showSetup28=showSetup;showSetup=function(){NOSAVE=false;return _showSetup28.apply(this,arguments)};

// ----- かんたん引き継ぎ（別の端末・ブラウザへ） -----
async function packAll(){const d={v:2,at:Date.now(),slot:SLOT,slots:{},meta:null};if(S&&S.alive&&!NOSAVE)save(true);
  for(let i=0;i<SLOT_N;i++){try{const r=localStorage.getItem(slotKey(i));if(r)d.slots[i]=r}catch(_){}}try{d.meta=localStorage.getItem(META_K)}catch(_){}
  const json=JSON.stringify(d);
  if(typeof CompressionStream!=='undefined'){try{const cs=new Blob([json]).stream().pipeThrough(new CompressionStream('gzip'));const buf=new Uint8Array(await new Response(cs).arrayBuffer());let bin='';for(let i=0;i<buf.length;i+=8192)bin+=String.fromCharCode.apply(null,buf.subarray(i,i+8192));return 'NIP2Z.'+btoa(bin)}catch(_){}}
  return 'NIP2.'+btoa(unescape(encodeURIComponent(json)))}
async function unpack(code){code=(code||'').replace(/\s+/g,'');
  if(code.startsWith('NIP1.')){const o=importStr(code);return o?{single:o}:null}
  try{if(code.startsWith('NIP2Z.')){const bin=atob(code.slice(6));const u=new Uint8Array(bin.length);for(let i=0;i<bin.length;i++)u[i]=bin.charCodeAt(i);const ds=new Blob([u]).stream().pipeThrough(new DecompressionStream('gzip'));return JSON.parse(await new Response(ds).text())}
    if(code.startsWith('NIP2.'))return JSON.parse(decodeURIComponent(escape(atob(code.slice(5)))))}catch(_){}return null}
function showTransfer(msg){const used=slotsUsed().length;openModal(`<div class="mcat life">引き継ぎ</div><h2>引き継ぎ（別の端末・ブラウザへ）</h2>
  <p class="hint">セーブ（${used}つの人生）と、実績・図鑑・引き継ぎスキルを、まとめて1つのコードかファイルにする。</p>
  <h3>① 今の端末で：渡す</h3><div class="mgrid">${menuTile('trCopy','📋','コードをコピー','LINEやメモに貼って送る')}${menuTile('trFile','💾','ファイルに保存','端末に保存される')}</div>
  <h3>② 新しい端末で：受け取る</h3><div class="mgrid">${menuTile('trPaste','📥','コードを貼りつけ','コピーしたコードを読み込む')}${menuTile('trOpen','📂','ファイルを開く','保存したファイルを選ぶ')}</div>
  <input type="file" id="trFileIn" accept=".txt,text/plain" hidden>
  <div id="trBox">${msg||''}</div>
  <button class="b pri" type="button" data-act="close">閉じる</button>`);$('#mcard').dataset.kind='transfer'}
function trShowCode(code){$('#trBox').innerHTML=`<p class="hint">自動でコピーできなかったので、下のコードを長押しして全部コピーしてね。</p><textarea id="trCode" readonly>${esc(code)}</textarea>`;const t=$('#trCode');t.focus();t.select()}
function trAskImport(code){$('#trBox').innerHTML=`<textarea id="trCode" placeholder="NIP2Z. から始まるコード">${esc(code||'')}</textarea><div class="row"><button class="b pri" type="button" data-act="trGo">読み込む</button></div><p class="hint" id="trMsg"></p>`}
async function trImport(code){const d=await unpack(code);const msg=t=>{const m=$('#trMsg');if(m)m.textContent=t;else toast(t)};
  if(!d){msg('読み込めませんでした。コードを最後まで貼りつけてね。');return}
  if(d.single){const e=slotEmpty();if(e<0){msg('空きスロットがありません。どれかのスロットを消してから読み込んでね。');return}try{localStorage.setItem(slotKey(e),JSON.stringify(d.single))}catch(_){msg('保存できませんでした');return}setSlot(e);
    closeModal();if(!$('#scrGame').hidden){setSpeed(0);S=null;showScreen('title')}initTitle();toast(`スロット${e+1}に読み込みました`);return}
  const n=Object.keys(d.slots||{}).length;
  $('#trBox').innerHTML=`<div class="card warn confirm-inline"><p class="mtext">このコードには、${n}つの人生と実績が入っている。この端末のセーブと実績を、コードの内容に<b>置きかえる</b>？（この端末の今のデータは消える）</p><div class="row"><button class="b sm warnb" type="button" data-act="trYes">置きかえる</button><button class="b sm ghost" type="button" data-act="trNo">やめる</button></div></div>`;TR_PENDING=d}
let TR_PENDING=null;
function trApply(d){for(let i=0;i<SLOT_N;i++){try{localStorage.removeItem(slotKey(i))}catch(_){}}try{localStorage.removeItem(SLOT_INFO)}catch(_){}
  for(const [i,r] of Object.entries(d.slots||{})){try{localStorage.setItem(slotKey(+i),r)}catch(_){}}if(d.meta){try{localStorage.setItem(META_K,d.meta);const nm=JSON.parse(d.meta)||{};const base={};for(const k in META){const v=META[k];base[k]=Array.isArray(v)?[]:(v&&typeof v==='object')?{}:typeof v==='number'?0:v}META=Object.assign(base,nm)}catch(_){}}
  setSlot(+d.slot||0);if(S&&!$('#scrGame').hidden){setSpeed(0)}S=null;showScreen('title');initTitle();closeModal();toast('引き継ぎました')}
document.addEventListener('click',async e=>{const b=e.target.closest('button');if(!b)return;const a=b.dataset.act;
  if(a==='trCopy'){const code=await packAll();try{await navigator.clipboard.writeText(code);$('#trBox').innerHTML=`<p class="hint">コピーしました（${num(code.length)}文字）。新しい端末で「コードを貼りつけ」を押してね。</p>`}catch(_){trShowCode(code)}return}
  if(a==='trFile'){const code=await packAll();const d=new Date();const nm=`buzz-save-${d.getFullYear()}${String(d.getMonth()+1).padStart(2,'0')}${String(d.getDate()).padStart(2,'0')}.txt`;const url=URL.createObjectURL(new Blob([code],{type:'text/plain'}));const l=document.createElement('a');l.href=url;l.download=nm;document.body.appendChild(l);l.click();l.remove();setTimeout(()=>URL.revokeObjectURL(url),3000);$('#trBox').innerHTML=`<p class="hint">「${nm}」を保存しました。新しい端末で「ファイルを開く」から選んでね。</p>`;return}
  if(a==='trPaste'){let t='';try{t=await navigator.clipboard.readText()}catch(_){}if(t&&/^NIP[12]/.test(t.trim())){trAskImport(t);trImport(t)}else trAskImport('');return}
  if(a==='trOpen'){$('#trFileIn').click();return}
  if(a==='trGo'){trImport(($('#trCode')||{}).value);return}
  if(a==='trYes'){if(TR_PENDING)trApply(TR_PENDING);TR_PENDING=null;return}
  if(a==='trNo'){TR_PENDING=null;$('#trBox').innerHTML='';return}
  if(a==='slots'){showSlots('manage');return}
  if(a==='transfer'){showTransfer();return}});
document.addEventListener('change',async e=>{if(e.target.id!=='trFileIn')return;const f=e.target.files&&e.target.files[0];if(!f)return;const t=await f.text();trAskImport('');trImport(t)});
// 昔の「書き出す」「読み込む」も、新しい引き継ぎ画面へ
showExport=function(){showTransfer()};showImport=function(){showTransfer()};
// メニューの「セーブ」タブ
const _menuBody28=menuBody;menuBody=function(){if(MENU_TAB!=='save')return _menuBody28();
  return `<h3>セーブ</h3><p class="hint">いま遊んでいるのは「スロット${SLOT+1}」。月が進むたびに自動で保存される。</p><div class="mgrid">${menuTile('msave','💾','いま保存する','念のため手動で保存')}${menuTile('slots','🗂','セーブスロット','ほかの人生に切りかえる・消す')}${menuTile('transfer','📲','引き継ぎ','別の端末・ブラウザへ')}</div><h3>セーブデータを消す</h3><p class="hint">消したデータは元に戻せない。残したいときは先に「引き継ぎ」でコードかファイルにしておく。</p>${delHtml()}`};
// タイトルの「実績・引き継ぎ」と「設定・セーブ」にも入口
document.addEventListener('click',e=>{const b=e.target.closest('[data-act="grpRec"],[data-act="settings"]');if(!b)return;setTimeout(()=>{const m=$('#mcard');if(!m)return;const x=m.querySelector('[data-act="importT"],[data-act="export"],[data-act="achv"]');const box=x&&x.closest('.mch');if(!box||m.querySelector('[data-act="transfer"]'))return;box.insertAdjacentHTML('afterbegin',`<button class="b" type="button" data-act="slots">セーブスロット<span class="small muted">（5つの人生を別々に保存）</span></button><button class="b" type="button" data-act="transfer">引き継ぎ<span class="small muted">（別の端末・ブラウザへ）</span></button>`)},0)});
initTitle();
OLD_VERS.unshift(['v1.1','versions/v1.1/','出来事1000種類・チュートリアル・サブスク・事務所の種類などが入ったころ（v1.1.8）']);
