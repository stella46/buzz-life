
// ===== v3.0（2）：🧭ナビ（道のり・さがす・移動を1つに） =====
const _road66=showRoad,_find66=showFind,_sc66=showShortcut;let NAV_TAB='road';
function navGrab(fn,arg){const om=openModal;let got='';openModal=function(h){got=h};try{fn(arg)}finally{openModal=om}
 return got.replace(/<div class="mcat[^"]*">[^<]*<\/div>/,'').replace(/<h2>[^<]*<\/h2>/,'').replace(/<button class="b pri" type="button" data-act="close">閉じる<\/button>/g,'')}
function showNav(t){t=t||NAV_TAB;NAV_TAB=t;const m=$('#mcard');
 const body=t==='road'?navGrab(_road66):t==='find'?navGrab(_find66,''):navGrab(_sc66);
 const tabs=[['road','🧭 道のり'],['find','🔎 さがす'],['go','⚡ 移動']].map(([k,n])=>`<button class="stab" type="button" data-nav="${k}" aria-pressed="${k===t}">${n}</button>`).join('');
 if(!$('#modal').hidden&&m.dataset.kind==='nav'){m.querySelectorAll('[data-nav]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.nav===t)));const f=m.querySelector('.fbody');f.innerHTML=body;f.scrollTop=0}
 else{openModal(`<span hidden data-act="close"></span><div class="mcat life">ナビ</div><h2>どこへ行く？ 何をする？</h2><div class="subtabs">${tabs}</div><div class="fbody">${body}</div>`);m.classList.add('fixedsize');m.dataset.kind='nav'}
 if(t==='find')setTimeout(()=>{const i=$('#findQ');if(i)i.focus()},50)}
document.addEventListener('click',e=>{const b=e.target.closest('[data-nav]');if(!b)return;showNav(b.dataset.nav)});
showRoad=function(){showNav('road')};showShortcut=function(){showNav('go')};
showFind=function(q){if($('#findList'))return _find66(q);showNav('find');if(q){const i=$('#findQ');if(i){i.value=q;_find66(q)}}};
// 画面の上のボタンは「🧭ナビ」1つに
(function(){const sc=$('#btnSc'),fd=$('#btnFind'),rd=$('#btnRoad');const c=$('#ctrl');if(!c)return;
 const b=document.createElement('button');b.className='b sm';b.type='button';b.id='btnNav';b.textContent='🧭ナビ';b.title='道のり・さがす・移動';
 b.addEventListener('click',e=>{e.stopPropagation();if(S)showNav()});(sc||fd||rd)?(sc||fd||rd).before(b):c.appendChild(b);[sc,fd,rd].forEach(x=>x&&x.remove())})();
// 遊び方・さがすの説明
(function(){const g=GUIDE.find(x=>x[0]==='auto');if(g)g[2]=g[2].replace(/・🧭道のり：[^\n]*\n・🔎さがす：[^\n]*\n・⚡移動：[^\n]*/,'・🧭ナビ：画面の上のボタン。「道のり」（遊びの順番と次の目標）、「さがす」（機能や用語の検索）、「移動」（どの画面へもすぐ行ける）の3つがあります。');
 for(const x of GUIDE)x[2]=x[2].replace(/画面の上の「🧭道のり」/g,'画面の上の「🧭ナビ」の「道のり」').replace(/「🧭道のり」と同じです/g,'「🧭ナビ」の「道のり」と同じです').replace('機能の場所がわからないときは「🔎さがす」、どの画面へもすぐ行きたいときは「⚡移動」が便利です。','機能の場所がわからないときや、どの画面へもすぐ行きたいときも「🧭ナビ」から。')})();
try{for(const f of FIND){f[1]=String(f[1]).replace('画面の上の「🧭道のり」','画面の上の「🧭ナビ」')}}catch(_){}
{const _stp66=secTip;secTip=function(){const r=_stp66.apply(this,arguments);try{if(r&&r[0])r[0]=r[0].replace('上の「🔎さがす」から','上の「🧭ナビ」の「さがす」から')}catch(_){}return r}}

// ===== v3.0（3）：🤖おまかせ設定（行動・分野・出来事のおまかせを1つに） =====
const _evsk66=evSkipHtml;
function evSkipInner(){return _evsk66().replace(/^<details[^>]*><summary>[\s\S]*?<\/summary>/,'').replace(/<\/details>$/,'')}
evSkipHtml=function(){return ''};
omkHtml=function(){const a=age();const n=OMK.filter(x=>omk(x[0])).length,ne=Object.values(S.evSkip||{}).filter(Boolean).length;const on=(S.auto?1:0)+n+(ne?1:0);
 return `<details class="omk"><summary>🤖 おまかせ設定 <span class="chip">${on?on+'つオン':'オフ'}</span></summary><p class="hint">まかせたものは、さわらなくても自動で進みます。いつでも戻せます。</p>
 <h4>毎月の行動</h4><div class="row"><button class="b sm ${S.auto?'on':''}" type="button" data-act="auto">行動のおまかせ：${S.auto?'ON':'OFF'}</button><span class="hint small">予定の枠を毎月自動で決めます</span></div>
 ${a>=10?`<h4>分野ごと</h4><div class="omkl">${OMK.map(([k,n2,d])=>`<label class="omki"><input type="checkbox" data-omk="${k}" ${omk(k)?'checked':''}><span><b>${n2}</b><small>${d}</small></span></label>`).join('')}</div><div class="row"><button class="b sm" type="button" data-omkall="1">すべてまかせる</button><button class="b sm ghost" type="button" data-omkall="0">すべて自分でやる</button></div>${a<18?'<p class="hint small">まち・お店・会社・大計画は18歳から動きます。</p>':''}`:''}
 <h4>出来事（種類ごと）</h4>${evSkipInner()}</details>`};
{const _pp66=panelPlan;panelPlan=function(){let h=_pp66.apply(this,arguments);try{const a=age();if(a>=6&&a<10&&!uiHidden('omk')&&h.indexOf('🤖 おまかせ設定')<0){const o=omkHtml();const j=h.indexOf('<div class="grp"><h3>時間の進み方');h=j<0?h+o:h.slice(0,j)+o+h.slice(j)}
 h=h.replace('<span class="hint">ONにすると行動を自動で決める</span>','<span class="hint">ONにすると行動を自動で決めます（ほかのおまかせは下の「🤖 おまかせ設定」）</span>')}catch(e){console.error(e)}return h}}
// おまかせ設定を開いたままにする
{let omkOpen=false;document.addEventListener('toggle',e=>{if(e.target&&e.target.matches&&e.target.matches('details.omk'))omkOpen=e.target.open},true);
 const _rp66=renderPanel;renderPanel=function(){const r=_rp66.apply(this,arguments);try{if(omkOpen){const d=document.querySelector('#panel details.omk');if(d)d.open=true}}catch(_){}return r}}
(function(){for(const x of GUIDE)x[2]=x[2].replace(/「?🤖まるごとおまかせ」?/g,'「🤖 おまかせ設定」').replace(/「?🤖 まるごとおまかせ」?/g,'「🤖 おまかせ設定」').replace(/出来事のおまかせ（種類ごと）/g,'「🤖 おまかせ設定」の「出来事」')})();
{const _stp66b=secTip;secTip=function(){const r=_stp66b.apply(this,arguments);try{if(r&&r[0])r[0]=r[0].replace(/「🤖まるごとおまかせ」/g,'「🤖 おまかせ設定」')}catch(_){}return r}}
try{for(const f of FIND){f[0]=String(f[0]).replace('まるごとおまかせ','おまかせ設定');f[1]=String(f[1]).replace(/時間の進み方/,'おまかせ設定')}}catch(_){}
document.addEventListener('click',e=>{const b=e.target.closest('[data-evsk1]');if(b)b.textContent=b.textContent.replace('予定タブの「時間の進み方」で戻せます','予定タブの「🤖 おまかせ設定」で戻せます')});
(function(){for(const x of GUIDE){x[2]=x[2].replace('「時間の進み方」では、1ターンの長さ、「🤖 おまかせ設定」の「出来事」（種類ごとに止めない）、推定プレイ時間を見られます。','「🤖 おまかせ設定」では、毎月の行動・分野ごと（研究・スキル・まち・お店・会社・大計画・つながり）・出来事の種類ごとに、まとめておまかせにできます。\n・「時間の進み方」では、1ターンの長さと推定プレイ時間を見られます。')
 .replace('・「🤖 おまかせ設定」で、研究・スキル・まち・お店・会社・大計画・つながりを、分野ごとにまかせられます。\n','')
 .replace(/・「🤖 おまかせ設定」：分野ごとに毎月の管理をまかせる。\n・「🤖 おまかせ設定」の「出来事」：[^\n]*/,'・🤖 おまかせ設定：毎月の行動・分野ごと・出来事の種類ごとのおまかせを、1つの画面でまとめて設定（出来事の画面からも設定できます）。')}})();
