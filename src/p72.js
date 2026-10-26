
// ===== v3.0（11）：設定を整理（見た目・音楽・文字の種類を3つずつ／表示のカスタマイズは設定の「見た目」へ） =====
(function(){
 const gm={classic:'pixel',phone:'hybrid'};delete GFX_OPT.classic;delete GFX_OPT.phone;GFX_OPT.pixel.n='A 高精細ドット';GFX_OPT.illust.n='B イラスト';GFX_OPT.hybrid.n='C スマホ＋ドット';
 if(gm[GFX]){try{setGfx(gm[GFX])}catch(_){GFX=gm[GFX]}}
 const mm={classic:'chip',scene:'both'};delete MUS_OPT.classic;delete MUS_OPT.scene;MUS_OPT.chip.n='1 チップチューン';MUS_OPT.era.n='2 時代で変わる';MUS_OPT.both.n='3 時代×場面で変わる';
 if(mm[MUS]){MUS=mm[MUS];try{localStorage.setItem('buzz-music',MUS)}catch(_){}}
 for(const k of ['dot','mplus','noto','klee'])delete FONT_OPT[k];
 if(!FONT_OPT[UFONT]){UFONT='theme';try{localStorage.setItem('buzz-font',UFONT)}catch(_){}try{applyFont()}catch(_){}}
})();
// 表示のカスタマイズ（v3.0 の画面に合わせた項目）
UI_ITEMS.length=0;UI_ITEMS.push(['画面の部品',[['sec','秘書のひとこと'],['todo','いまできること'],['omk','おまかせ設定（予定タブ）']]],
 ['「事業」タブ',[['s:biz:town','まちの地図'],['s:biz:shop','お店の経営'],['s:biz:co','会社'],['s:biz:office','芸能事務所'],['s:biz:svc','サービス会社'],['s:biz:aw','賞・イベント'],['s:biz:mega','大計画'],['s:biz:res','研究']]],
 ['「人生」タブ',[['s:life:goal','目標・性格'],['s:life:rec','記録']]]);
function uiCustomInner(){const h=uiHide();return `<p class="hint">使わない項目のチェックをはずすと、画面から隠せます（この端末だけの設定です）。</p>${UI_ITEMS.map(([g,L])=>`<h4>${g}</h4><div class="omkl">${L.map(([k,n])=>`<label class="omki"><input type="checkbox" data-uih="${k}" ${h[k]?'':'checked'}><span><b>${n}</b></span></label>`).join('')}</div>`).join('')}<div class="row"><button class="b sm ghost" type="button" data-uireset2="1">すべて表示に戻す</button></div>`}
{const _sh72=screenHtml;screenHtml=function(){return _sh72.apply(this,arguments)+`<h3>表示する項目</h3>${uiCustomInner()}`}}
try{const g=SET_GROUPS.find(x=>x[0]==='look');if(g&&!g[2].includes('表示する項目'))g[2].push('表示する項目')}catch(_){}
document.addEventListener('click',e=>{const b=e.target.closest('[data-uireset2]');if(!b)return;UIH=null;try{localStorage.removeItem(UI_KEY)}catch(_){}if(S)render();try{reopenSettings()}catch(_){}});
showUiCustom=function(){showSettings();setTimeout(()=>{try{SET_TAB='look';const b=document.querySelector('[data-settab="look"]');if(b)b.click()}catch(_){}},150)};
{const _rp72=renderPanel;renderPanel=function(){const r=_rp72.apply(this,arguments);try{document.querySelectorAll('#panel [data-uicust]').forEach(b=>b.remove())}catch(_){}return r}}
(function(){for(const x of GUIDE)x[2]=x[2].replace(/各タブの説明にある「⚙表示」/g,'「メニュー」→「設定・セーブ」の「見た目・文字」にある「表示する項目」').replace(/「⚙表示」/g,'設定の「表示する項目」')})();
try{for(const f of FIND){if(/表示のカスタマイズ/.test(f[0])){f[1]='メニュー → 設定 → 見た目・文字';f[2]=null}}}catch(_){}
