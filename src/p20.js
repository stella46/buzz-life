// ===== v1.0：見た目・音の切りかえ画面、テーマの反映、投稿のサムネイル =====
function applyGfx(){const b=document.body;Object.keys(GFX_OPT).forEach(k=>b.classList.remove('th-'+k));b.classList.add('th-'+GFX);
  try{sizeCanvases()}catch(_){}try{drawLogo()}catch(_){}if(S&&!$('#scrGame').hidden){try{render()}catch(_){}}
  const meta=document.querySelector('meta[name="theme-color"]');if(meta)meta.content={classic:'#20234a',pixel:'#1b1d40',illust:'#fff6f0',phone:'#fff6f0',hybrid:'#111318'}[GFX]}
function setGfx(v){if(!GFX_OPT[v])return;GFX=v;try{localStorage.setItem('buzz-gfx',v)}catch(_){}applyGfx()}
function setMus(v){if(!MUS_OPT[v])return;MUS=v;try{localStorage.setItem('buzz-music',v)}catch(_){}bgmUser=true;bgmStop();bgmUpdate()}
function optSeg(attr,opts,cur){return `<div class="optlist">${Object.entries(opts).map(([k,o])=>`<button type="button" class="optc ${cur===k?'on':''}" ${attr}="${k}" aria-pressed="${cur===k}"><b>${esc(o.n)}</b><span>${esc(o.d)}</span></button>`).join('')}</div>`}
function soundBtns(){return `<div class="mch"><button class="b" type="button" data-act="bgm">BGM：${bgmOn?'ON':'OFF'}</button><button class="b" type="button" data-act="sound">効果音：${sndOn?'ON':'OFF'}</button></div>
  <h3>見た目</h3>${optSeg('data-gfx',GFX_OPT,GFX)}
  <h3>音楽</h3>${optSeg('data-mus',MUS_OPT,MUS)}
  <h3>効果音・環境音</h3><div class="mch"><button class="b" type="button" data-act="sek">効果音の種類：${SEK==='classic'?'クラシック':'新しい'}</button><button class="b" type="button" data-act="amb">環境音（雨・街・外の音）：${AMB?'ON':'OFF'}</button></div>`}
function reopenSettings(){if(S&&!$('#scrGame').hidden)showMenu();else showSettings()}
document.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;const d=b.dataset;
  if(d.gfx){setGfx(d.gfx);reopenSettings();return}
  if(d.mus){setMus(d.mus);reopenSettings();return}
  if(d.act==='sek'){SEK=SEK==='classic'?'new':'classic';try{localStorage.setItem('buzz-se',SEK)}catch(_){}snd('coin');reopenSettings();return}
  if(d.act==='amb'){AMB=AMB?0:1;try{localStorage.setItem('buzz-amb',String(AMB))}catch(_){}bgmUser=true;ambUpdate();reopenSettings();return}
});

// ----- タブのアイコン（新しい見た目のとき） -----
const TAB_ICON={act:'<rect x="4" y="5" width="16" height="15" rx="3"/><path d="M4 10h16M9 3v4M15 3v4"/>',sns:'<path d="M12 20s-7-4.3-7-9.5A4 4 0 0 1 12 8a4 4 0 0 1 7 2.5C19 15.7 12 20 12 20z"/>',money:'<rect x="3" y="7" width="18" height="12" rx="3"/><path d="M16 13h2M3 10h18"/>',biz:'<path d="M4 20V9l5-3v14M9 20V4l10 4v12M3 20h18M13 11h2M13 15h2"/>',life:'<path d="M6 4h10a2 2 0 0 1 2 2v14H8a2 2 0 0 1-2-2z"/><path d="M6 18a2 2 0 0 1 2-2h10"/>'};
document.querySelectorAll('.tab[data-tab]').forEach(b=>{if(b.querySelector('.tabicon'))return;const s=document.createElementNS('http://www.w3.org/2000/svg','svg');s.setAttribute('viewBox','0 0 24 24');s.setAttribute('class','tabicon');s.setAttribute('aria-hidden','true');s.innerHTML=TAB_ICON[b.dataset.tab]||'';b.prepend(s)});

// ----- 最近の投稿（サムネイル） -----
const POST_T={game:['初見プレイ実況','ついにクリア！','縛りプレイに挑戦'],cook:['10分ごはん','節約レシピ','はじめてのお菓子作り'],beauty:['季節のメイク','プチプラで垢抜け','髪型アレンジ'],talk:['のんびり雑談','質問コーナー','最近あったこと'],study:['3分でわかる解説','テスト前の勉強法','ニュースのまとめ'],music:['弾いてみた','オリジナル曲','カラオケ配信'],comedy:['やってみた','ドッキリ企画','100回チャレンジ'],vlog:['休日のvlog','旅行の記録','モーニングルーティン'],asmr:['作業用BGM','雨の音と勉強','ささやき雑談'],avatar:['アバターで雑談','新衣装おひろめ','歌枠'],vr:['VR世界を探検','VRでライブ','仮想空間ツアー'],aico:['AIと即興コント','AIに相談','AIと勝負']};
function postRecord(buzzed,views){if(!S.posts)S.posts=[];const last=S.posts[S.posts.length-1];if(last&&last.am===S.am)return;const ts=POST_T[S.genre]||POST_T.talk;S.posts.push({am:S.am,g:S.genre,t:ts[(S.am+S.y)%ts.length],v:Math.round(views),b:buzzed?1:0,st:S.style});if(S.posts.length>6)S.posts.shift()}
function postsHtml(){const ps=(S.posts||[]).slice().reverse().slice(0,3);if(!ps.length)return '';return `<h3>最近の投稿</h3><div class="thumbs">${ps.map((p,i)=>`<figure class="thumb"><canvas width="96" height="54" data-thumb="${i}"></canvas><figcaption>${esc(p.t)}<span>${num(p.v)}回再生${p.b?' ・バズ':''}</span></figcaption></figure>`).join('')}</div>`}
const G_COL={game:'#3a3f8f',cook:'#f4a261',beauty:'#ff8fa3',talk:'#7fc8f8',study:'#95d5b2',music:'#c3a6ff',comedy:'#ffd166',vlog:'#64b5f6',asmr:'#9a8fc8',avatar:'#ff9de2',vr:'#38d9a9',aico:'#4dd4ff'};
function paintThumbs(){const ps=(S.posts||[]).slice().reverse().slice(0,3);document.querySelectorAll('canvas[data-thumb]').forEach(cv=>{const p=ps[+cv.dataset.thumb];if(!p)return;const st=sceneStyle()==='classic'?'pixel':sceneStyle(),k=st==='illust'?3:2;cv.width=96*k;cv.height=54*k;cv.style.imageRendering=st==='illust'?'auto':'pixelated';G.use(cv.getContext('2d'),k,st);
  const c=G_COL[p.g]||'#7fc8f8';G.fillG(0,0,96,54,G.grad(0,0,96,54,[[0,c],[1,dark(c,.35)]]));const me=mainModel({loc:'stream'});drawChar(70,58,me,'wave',1);
  if(p.g==='game'){G.R(10,26,30,14,'#222',{r:4});G.E(18,33,3,3,'#555');G.E(32,31,1.6,1.6,'#e03131');G.E(35,34,1.6,1.6,'#3fd6c9')}
  else if(p.g==='cook'){G.E(25,36,15,6,'#ffffff');G.E(25,33,10,5,'#e76f51')}else if(p.g==='music'){G.T('♪♫',25,40,'#ffffff',18,'center')}
  else if(p.g==='study'){G.R(10,18,30,22,'#2f5d4a',{r:1});G.T('A＝B',25,32,'#ffffff',7,'center')}else if(p.g==='beauty'){G.P(starPts(25,30,9),'#fff6a0')}
  else{G.R(8,20,34,18,'#ffffff',{r:6});G.T('！',25,34,c,12,'center')}
  if(p.b){G.R(2,2,30,10,'#e03131',{r:2});G.T('バズ',17,10,'#ffffff',7,'center')}})}

// ----- 自由に生まれるモード：見た目を選ぶ -----
const HS_N={男:['短め','ツンツン','長めの前髪','ボウズ・すっきり'],女:['ロング','ボブ','ポニーテール','ツインテール／おだんご']};
function lookFieldsHtml(){return `<label class="fld"><span>髪型</span><select id="frHs"><option value="">ランダム</option>${[0,1,2,3].map(i=>`<option value="${i}">${HS_N.男[i]}（男）／${HS_N.女[i]}（女）</option>`).join('')}</select></label>
  <label class="fld"><span>髪の色</span><select id="frHairc"><option value="">ランダム</option>${['黒茶','こげ茶','黒','栗色','明るい茶','金色'].map((n,i)=>`<option value="${i}">${n}</option>`).join('')}</select></label>
  <label class="fld"><span>肌の色</span><select id="frSkin"><option value="">ランダム</option>${['明るめ','ふつう','小麦色','濃いめ'].map((n,i)=>`<option value="${i}">${n}</option>`).join('')}</select></label>`}

// ----- はじめに -----
applyGfx();
// 最初の1回だけ、見た目と音が変わったことを知らせる
try{if(!localStorage.getItem('buzz-v1-notice')){localStorage.setItem('buzz-v1-notice','1');setTimeout(()=>{if(!S)openModal(`<div class="mcat life">v1.0</div><h2>見た目と音が新しくなりました</h2><p class="mtext">いまは「D スマホ＋ドット」と「2＋3 時代×場面」の音楽になっています。\n「設定」から、見た目（5種類）・音楽（5種類）・効果音・環境音を自由に切りかえられます。今までの見た目と音は「クラシック」で選べます。</p><div class="mch"><button class="b pri" type="button" data-act="settings">設定を開く</button><button class="b" type="button" data-act="close">このまま遊ぶ</button></div>`)},600)}}catch(_){}
