
// ===== v1.2.2：文字の種類を実際のフォントで見本表示／スマホでの画面の操作を軽く =====
Object.assign(FONT_OPT.theme,{d:'選んだ「見た目」に合わせて自動で決まる',s:''});
Object.assign(FONT_OPT.maru,{d:'角が丸くてやわらかい。やさしい雰囲気で読みやすい'});
Object.assign(FONT_OPT.dot,{d:'昔のゲーム機のようなドットの文字。レトロ感が強い'});
Object.assign(FONT_OPT.mplus,{d:'丸みがあって、すっきり細め。スマホでも読みやすい'});
Object.assign(FONT_OPT.noto,{d:'くせのない、いちばんふつうの文字。長い文も読みやすい'});
Object.assign(FONT_OPT.klee,{d:'鉛筆でノートに書いたような手書き風の文字'});
Object.assign(FONT_OPT.system,{d:'スマホやパソコンにもともと入っている文字。読み込みが速い'});
function loadFontLink(k){const o=FONT_OPT[k];if(!o||!o.g||document.getElementById('uf_'+k))return;const l=document.createElement('link');l.id='uf_'+k;l.rel='stylesheet';l.href=`https://fonts.googleapis.com/css2?family=${o.g}&display=swap`;document.head.appendChild(l)}
function fontPicker(){Object.keys(FONT_OPT).forEach(loadFontLink);
  return `<div class="optlist fontlist">${Object.entries(FONT_OPT).map(([k,o])=>{const ff=o.f?`${o.f},sans-serif`:'inherit';return `<button type="button" class="optc fontc ${UFONT===k?'on':''}" data-ufont="${k}" aria-pressed="${UFONT===k}" style="font-family:${ff.replace(/"/g,"'")} !important"><b style="font-family:inherit !important">${esc(o.n)}</b><span class="fsample" style="font-family:inherit !important">あいう アイウ 漢字 ABC 123</span><span class="fdesc">${esc(o.d)}</span></button>`}).join('')}</div>`}
screenHtml=function(){return _sh27()+`<h3>文字の種類</h3><p class="hint">それぞれのボタンは、その文字で表示している。</p>${fontPicker()}<h3>文字の大きさ</h3>${optSeg('data-ufsize',FSIZE_OPT,UFSIZE)}`};

// ----- 画面（モーダル）の操作を軽く：▲▼の対象さがしを、決まった場所だけに -----
scrollTarget=function(){if($('#modal').hidden)return null;const m=$('#mcard');let best=m,range=m.scrollHeight-m.clientHeight;
  for(const el of m.querySelectorAll('.fbody,#mbody,.news,.credit,textarea')){const r=el.scrollHeight-el.clientHeight;if(r>range+4){best=el;range=r}}return best};
// 画面を開いている間は、うしろのページが動かないように
const _om30=openModal;openModal=function(html){const r=_om30(html);document.documentElement.classList.add('mlock');return r};
const _cm30=closeModal;closeModal=function(){document.documentElement.classList.remove('mlock');return _cm30.apply(this,arguments)};
setInterval(()=>{if($('#modal').hidden)document.documentElement.classList.remove('mlock')},1000);
// アップデート情報：古い版はたたんでおき、画面を軽く
const _news30=showNews;showNews=function(t){const r=_news30(t);try{const box=document.querySelector('#mcard .news');if(box){const secs=[...box.querySelectorAll(':scope>section.nv')];if(secs.length>6){const d=document.createElement('details');d.className='oldnews';d.innerHTML=`<summary>それより前の版を見る（${secs.length-6}件）</summary>`;secs.slice(6).forEach(s=>d.appendChild(s));box.appendChild(d)}}}catch(_){}return r};
