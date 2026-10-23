
// ===== v1.2.3：セーブスロットの名前・プレイ時間のリセット・SNSの名前と運営会社の買収 =====

// ----- セーブスロットの名前 -----
const SLOT_LBL='nipporia-slotlabel';
function slotLabels(){try{return JSON.parse(localStorage.getItem(SLOT_LBL)||'{}')||{}}catch(_){return {}}}
function slotName(i){return slotLabels()[i]||`スロット${i+1}`}
function setSlotName(i,n){const l=slotLabels();if(n)l[i]=n;else delete l[i];try{localStorage.setItem(SLOT_LBL,JSON.stringify(l))}catch(_){}}
slotCard=function(i,s,mode){const cur=i===SLOT;
  const head=`<div class="hd"><span><b>${esc(slotName(i))}</b>${cur?' <span class="chip up">いまのスロット</span>':''}</span>${s&&s.at?`<span class="muted small">${fmtDate(s.at)}</span>`:''}</div>`;
  const tools=`<div class="row slottools"><button class="b sm ghost" type="button" data-slot="${i}" data-sm="name">✎ 名前を変える</button>${s?`<button class="b sm ghost" type="button" data-slot="${i}" data-sm="treset">⏱ プレイ時間を0に</button>`:''}</div>`;
  if(!s)return `<div class="card slotc2" id="slotc_${i}">${head}<p class="hint">空き</p><div class="row">${mode==='new'?`<button class="b sm pri" type="button" data-slot="${i}" data-sm="new">ここで始める</button>`:''}</div>${tools}</div>`;
  const body=`<p class="mtext">${esc(s.name||'')}　${s.age}歳・${esc(s.cty||'')}・${s.y}年${s.m}月${s.gen>1?`・${s.gen}代目`:''}</p><p class="hint small">フォロワー ${num(s.f)}人・プレイ時間 ${fmtDur(s.ms||0)}</p>`;
  let btns='';
  if(mode==='new')btns=`<button class="b sm" type="button" data-slot="${i}" data-sm="over">上書きして始める</button>`;
  else btns=`<button class="b sm pri" type="button" data-slot="${i}" data-sm="cont">この人生を続ける</button><button class="b sm ghost" type="button" data-slot="${i}" data-sm="del">🗑 消す</button>`;
  return `<div class="card slotc2" id="slotc_${i}">${head}${body}<div class="row">${btns}</div>${tools}</div>`};
document.addEventListener('click',e=>{const b=e.target.closest('[data-slot]');if(!b)return;const i=+b.dataset.slot,m=b.dataset.sm,c=$('#slotc_'+i);
  if(m==='name'&&c){const t=c.querySelector('.slottools');t.innerHTML=`<input id="slotNm_${i}" class="slotnm" maxlength="16" placeholder="スロット${i+1}" value="${esc(slotLabels()[i]||'')}"><button class="b sm pri" type="button" data-slot="${i}" data-sm="name2">決定</button><button class="b sm ghost" type="button" data-slot="${i}" data-sm="back">やめる</button>`;const inp=$('#slotNm_'+i);if(inp)inp.focus();return}
  if(m==='name2'){const inp=$('#slotNm_'+i);setSlotName(i,(inp&&inp.value||'').trim().slice(0,16));showSlots(SLOT_MODE);toast('スロットの名前を変えました');return}
  if(m==='treset'&&c){const t=c.querySelector('.slottools');t.innerHTML=`<p class="hint">このスロットのプレイ時間（セーブと人生）を0にする？</p><button class="b sm warnb" type="button" data-slot="${i}" data-sm="treset2">0にする</button><button class="b sm ghost" type="button" data-slot="${i}" data-sm="back">やめる</button>`;return}
  if(m==='treset2'){if(S&&i===SLOT&&!$('#scrGame').hidden){S.playMs=0;S.lifeMs=0;save(true)}else{try{const k=slotKey(i),o=JSON.parse(localStorage.getItem(k));if(o){o.playMs=0;o.lifeMs=0;localStorage.setItem(k,JSON.stringify(o))}}catch(_){}}showSlots(SLOT_MODE);toast('プレイ時間を0にしました');return}});
// スロットの名前を、ほかの表示にも
contInfo=function(){let el=$('#contInfo');const b=$('#btnCont');if(!b)return;if(!el){el=document.createElement('p');el.id='contInfo';el.className='hint continfo';b.after(el)}
  const used=slotsUsed().sort((a,b)=>(b[1].at||0)-(a[1].at||0));el.hidden=!used.length;if(!used.length)return;const [i,s]=used[0];
  el.textContent=`最後に遊んだ：${slotName(i)}・${s.name} ${s.age}歳${s.at?`（${fmtDate(s.at)}）`:''}`};
const _menuBody31=menuBody;menuBody=function(){return _menuBody31().replace(`「スロット${SLOT+1}」`,`「${esc(slotName(SLOT))}」`)};

// ----- プレイ時間：それぞれ自分でリセットできる -----
function playRow(label,ms,key){return `<span>${label}</span><span class="prow">${fmtDur(ms||0)} <button class="b sm ghost" type="button" data-preset="${key}">0にする</button></span>`}
playHtml=function(){const vm=(META.verMs)||{};
  let h=`<div class="kv">${playRow('サイト全体のプレイ時間',META.playMs,'site')}`;
  if(S&&!$('#scrGame').hidden)h+=playRow(`このセーブ（${esc(slotName(SLOT))}）`,S.playMs,'save')+playRow('この人生',S.lifeMs,'life');
  h+=`<span>最後にセーブした日時</span><span>${S&&S.savedAt?fmtDate(S.savedAt):'—'}</span></div>`;
  h+=`<h3>バージョンごとのプレイ時間</h3><div class="kv">${Object.entries(vm).sort((a,b)=>b[1]-a[1]).map(([v,ms])=>playRow(esc(v),ms,'v:'+v)).join('')||'<span>まだない</span><span></span>'}</div>`;
  h+=`<p class="hint">ほかのスロットのプレイ時間は、「セーブスロット」の画面から0にできる。</p><div id="presetBox"></div>`;return h};
document.addEventListener('click',e=>{const b=e.target.closest('[data-preset],[data-preset2]');if(!b)return;
  if(b.dataset.preset){const k=b.dataset.preset;const nm=k==='site'?'サイト全体':k==='save'?'このセーブ':k==='life'?'この人生':k.slice(2)+' の';$('#presetBox').innerHTML=`<div class="card warn confirm-inline"><p class="mtext">${esc(nm)}のプレイ時間を0にする？元に戻せない。</p><div class="row"><button class="b sm warnb" type="button" data-preset2="${esc(k)}">0にする</button><button class="b sm ghost" type="button" data-preset2="">やめる</button></div></div>`;return}
  const k=b.dataset.preset2;if(k){if(k==='site')META.playMs=0;else if(k==='save'&&S)S.playMs=0;else if(k==='life'&&S)S.lifeMs=0;else if(k.startsWith('v:')&&META.verMs)delete META.verMs[k.slice(2)];saveMeta();if(S&&!$('#scrGame').hidden)save(true);toast('0にしました')}
  showPlay()});
// 「続きのセーブデータを消す」は、セーブスロットの画面に移したので、設定からは外す
delHtml=function(){return `<p class="hint">一つずつの人生を消すときは「セーブスロット」から。ここでは、すべてのスロットと実績・図鑑をまとめて消せる。</p><div class="mch" id="delBox"><button class="b" type="button" data-act="slots">セーブスロットを開く</button><button class="b" type="button" data-act="delAsk" data-k="all">すべてのセーブと実績・図鑑を消す</button></div><h3>もしものとき</h3>${backupHtml()}`};

// ----- SNSの名前と、運営会社の買収 -----
const SNS_DEF={};for(const k in SNS)SNS_DEF[k]=SNS[k].n;
const SNS_CO={milu:{co:'ドウガ広場株式会社',p:8e10},patto:{co:'タテショート社',p:5e10},tsubu:{co:'ひとこと株式会社',p:3e10},holo:{co:'ホロステージ・テクノロジーズ',p:1.2e11}};
function applySnsNames(){for(const k in SNS)SNS[k].n=(S&&S.snsName&&S.snsName[k])||SNS_DEF[k]||SNS[k].n;snsObserve()}
let SNS_OBS=null;
function snsMap(){const r=[];if(!S||!S.snsName)return r;for(const k in S.snsName)if(S.snsName[k]&&SNS_DEF[k]&&S.snsName[k]!==SNS_DEF[k]&&!S.snsName[k].includes(SNS_DEF[k]))r.push([SNS_DEF[k],S.snsName[k]]);return r}
function snsFix(node){const mp=snsMap();if(!mp.length)return;const w=document.createTreeWalker(node,NodeFilter.SHOW_TEXT);let t;while((t=w.nextNode())){let v=t.nodeValue,c=false;for(const [a,b] of mp)if(v.includes(a)){v=v.split(a).join(b);c=true}if(c)t.nodeValue=v}}
function snsObserve(){const on=snsMap().length>0;if(on&&!SNS_OBS){SNS_OBS=new MutationObserver(ms=>{for(const m of ms){for(const n of m.addedNodes)snsFix(n.nodeType===3?n.parentNode||document.body:n);if(m.type==='characterData'&&m.target.parentNode)snsFix(m.target.parentNode)}SNS_OBS.takeRecords()});SNS_OBS.observe(document.body,{childList:true,subtree:true,characterData:true});snsFix(document.body)}else if(!on&&SNS_OBS){SNS_OBS.disconnect();SNS_OBS=null}}
const _render31=render;render=function(){applySnsNames();return _render31.apply(this,arguments)};
const _newGame31=newGame;newGame=function(){const r=_newGame31.apply(this,arguments);applySnsNames();return r};
const _log31=log;log=function(t,c){const mp=snsMap();if(mp.length&&typeof t==='string')for(const [a,b] of mp)t=t.split(a).join(b);return _log31(t,c)};
function snsOwn(k){return !!(S&&S.snsOwn&&S.snsOwn[k])}
function snsBuyHtml(){const c=ci2();let h=`<h3>SNSの運営会社</h3><p class="hint">SNSを運営している会社を買収すると、そのSNSの名前を自由に変えられる。会社の利益の一部が毎月入る。売ると9割で戻る。</p>`;
  if(age()<20)return h+'<p class="hint">20歳から買収できる。</p>';
  for(const k of Object.keys(SNS_CO)){const s=SNS[k];if(!s||(s.era&&S.y<s.era))continue;const co=SNS_CO[k],p=Math.round(co.p*c),own=snsOwn(k);
    h+=`<div class="card"><div class="hd"><span>${esc(own&&S.snsName&&S.snsName[k]?S.snsName[k]+'の運営会社':co.co)}</span><span class="muted small">「${esc(s.n)}」（${esc(s.d)}）</span></div>`;
    if(own)h+=`<p class="hint small">あなたの会社。毎月の利益 約${yen(p*.003)}</p><div class="row chren"><input id="snsNm_${k}" maxlength="12" placeholder="新しい名前（${esc(SNS_DEF[k])}）" value=""><button class="b sm" type="button" data-snsnm="${k}">名前を変える</button><button class="b sm ghost" type="button" data-snsnm="${k}" data-reset="1">元の名前に戻す</button></div><div class="row"><button class="b sm ghost" type="button" data-snssell="${k}">会社を売る（${yen(p*.9)}）</button></div>`;
    else h+=`<div class="row"><button class="b sm" type="button" data-snsbuy="${k}" ${S.money<p?'disabled':''}>買収する ${yen(p)}</button></div>`;
    h+='</div>'}
  return h}
const _coHtml31=coHtml;coHtml=function(){return _coHtml31()+snsBuyHtml()};
document.addEventListener('click',e=>{const b=e.target.closest('button');if(!b||!S)return;const d=b.dataset,c=ci2();
  if(d.snsbuy){const k=d.snsbuy,p=Math.round(SNS_CO[k].p*c);if(S.money<p)return;outc('co',p);if(!S.snsOwn)S.snsOwn={};S.snsOwn[k]=S.am;tl(`「${SNS[k].n}」の運営会社を買収した`);log(`「${SNS[k].n}」の運営会社を${yen(p)}で買収した。名前を変えられるようになった`,'good');ad('rep',5);snd('buy');save(true);render();return}
  if(d.snssell){const k=d.snssell,p=Math.round(SNS_CO[k].p*c*.9);delete S.snsOwn[k];inc('sell',p);tl(`「${SNS[k].n}」の運営会社を売却した`);log(`「${SNS[k].n}」の運営会社を${yen(p)}で売った`,'good');save(true);render();return}
  if(d.snsnm){const k=d.snsnm;if(!snsOwn(k))return;if(!S.snsName)S.snsName={};const old=SNS[k].n;
    if(d.reset){delete S.snsName[k]}else{const inp=$('#snsNm_'+k);const nm=(inp&&inp.value||'').trim().slice(0,12);if(!nm){toast('名前を入力してね');return}if(Object.keys(SNS).some(x=>x!==k&&SNS[x].n===nm)){toast('ほかのSNSと同じ名前は使えない');return}S.snsName[k]=nm}
    applySnsNames();const so=old.split('').join('\u2060');tl(`「${so}」の名前を「${SNS[k].n}」に変えた`);log(`SNS「${so}」の名前を「${SNS[k].n}」に変えた`,'sns');save(true);render();return}});
// 買収した会社の利益（毎月）
const _mh31=monthHook11;monthHook11=function(){_mh31();try{if(S.snsOwn){let v=0;for(const k in S.snsOwn){const co=SNS_CO[k];if(co)v+=co.p*ci2()*.003*R(.6,1.4)}if(v)inc('platform',Math.round(v))}}catch(e){console.error(e)}};
Object.assign(INC_LBL,{platform:'SNSの運営会社'});
const _sp31=showPlay;showPlay=function(){_sp31();$('#mcard').dataset.kind='play'};
