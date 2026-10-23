
// ===== v1.1.7：画面の戻る・フォント・文字サイズ・スクロール・ショートカット・素質の上限解放 =====

// ----- 画面（モーダル）の「戻る」「はじめへ」 -----
let MSTACK=[],MNAV_BUSY=0;
function navBar(){const m=$('#mcard');m.querySelectorAll('.mnav').forEach(x=>{const c=x.querySelector('.xclose');if(c){c.classList.remove('inbar');m.insertBefore(c,m.firstChild)}x.remove()});if(!m.querySelector('.xclose'))return;
  const n=MSTACK.length;if(!n)return;const bar=document.createElement('div');bar.className='mnav';
  bar.innerHTML=`<button class="b sm" type="button" data-mnav="back">← 戻る</button>${n>=2?'<button class="b sm" type="button" data-mnav="top">⌂ はじめへ</button>':''}`;const x=m.querySelector('.xclose');m.insertBefore(bar,m.firstChild);if(x){bar.appendChild(x);x.classList.add('inbar')}}
const _om27=openModal;openModal=function(html){const m=$('#mcard');const was=!$('#modal').hidden&&!!m.querySelector('.xclose')&&!curEv;
  m.querySelectorAll('.mnav').forEach(x=>{const c=x.querySelector('.xclose');if(c){c.classList.remove('inbar');m.insertBefore(c,m.firstChild)}x.remove()});const snap=was?{html:m.innerHTML,cls:m.className,kind:m.dataset.kind||'',st:m.scrollTop}:null;
  _om27(html);if(!was)MSTACK=[];
  queueMicrotask(()=>{if(MNAV_BUSY)return;const closable=!!m.querySelector('.xclose');if(!closable){MSTACK=[];return}
    if(snap&&!(snap.kind&&snap.kind===(m.dataset.kind||''))){MSTACK.push(snap);if(MSTACK.length>12)MSTACK.shift()}navBar()})};
const _cm27=closeModal;closeModal=function(){MSTACK=[];return _cm27.apply(this,arguments)};
function navRestore(s){const m=$('#mcard');MNAV_BUSY=1;m.innerHTML=s.html;m.className=s.cls;m.dataset.kind=s.kind;$('#modal').hidden=false;m.scrollTop=s.st||0;MNAV_BUSY=0;navBar();try{updScrollBtns()}catch(_){}}
document.addEventListener('click',e=>{const b=e.target.closest('[data-mnav]');if(!b)return;e.stopPropagation();
  if(b.dataset.mnav==='back'){const s=MSTACK.pop();if(s)navRestore(s)}else{const s=MSTACK[0];MSTACK=[];if(s)navRestore(s)}},true);

// ----- フォントと文字の大きさ -----
const FONT_OPT={theme:{n:'見た目のまま',d:'選んだ見た目に合わせる',f:''},maru:{n:'まるゴシック',d:'やわらかい丸い文字',f:'"Zen Maru Gothic"',g:'Zen+Maru+Gothic:wght@400;700'},dot:{n:'ドット文字',d:'レトロなゲームの文字',f:'"DotGothic16"',g:'DotGothic16'},mplus:{n:'Mプラス丸',d:'すっきり読みやすい丸文字',f:'"M PLUS Rounded 1c"',g:'M+PLUS+Rounded+1c:wght@400;700'},noto:{n:'ゴシック',d:'くせのない、ふつうの文字',f:'"Noto Sans JP"',g:'Noto+Sans+JP:wght@400;700'},klee:{n:'手書き風',d:'ノートに書いたような文字',f:'"Klee One"',g:'Klee+One:wght@400;600'},system:{n:'端末の標準',d:'スマホやパソコンの文字（読み込みなし）',f:'system-ui,-apple-system,"Hiragino Sans",sans-serif'}};
const FSIZE_OPT={s:{n:'小さめ',d:'90%',z:.9},m:{n:'ふつう',d:'100%',z:1},l:{n:'大きめ',d:'115%',z:1.15},xl:{n:'とても大きい',d:'130%',z:1.3}};
let UFONT='theme',UFSIZE='m';try{UFONT=localStorage.getItem('buzz-font')||'theme';UFSIZE=localStorage.getItem('buzz-fsize')||'m'}catch(_){}
if(!FONT_OPT[UFONT])UFONT='theme';if(!FSIZE_OPT[UFSIZE])UFSIZE='m';
function applyFont(){const o=FONT_OPT[UFONT];if(o.g&&!document.getElementById('uf_'+UFONT)){const l=document.createElement('link');l.id='uf_'+UFONT;l.rel='stylesheet';l.href=`https://fonts.googleapis.com/css2?family=${o.g}&display=swap`;document.head.appendChild(l)}
  document.documentElement.style.setProperty('--ufont',o.f?o.f+',sans-serif':'');document.body.classList.toggle('ufont',!!o.f);
  document.body.style.zoom=FSIZE_OPT[UFSIZE].z===1?'':String(FSIZE_OPT[UFSIZE].z)}
const _sh27=screenHtml;screenHtml=function(){return _sh27()+`<h3>文字の種類</h3>${optSeg('data-ufont',FONT_OPT,UFONT)}<h3>文字の大きさ</h3>${optSeg('data-ufsize',FSIZE_OPT,UFSIZE)}`};
document.addEventListener('click',e=>{const b=e.target.closest('[data-ufont],[data-ufsize]');if(!b)return;if(b.dataset.ufont){UFONT=b.dataset.ufont;try{localStorage.setItem('buzz-font',UFONT)}catch(_){}}else{UFSIZE=b.dataset.ufsize;try{localStorage.setItem('buzz-fsize',UFSIZE)}catch(_){}}applyFont();reopenSettings()});
applyFont();

// ----- ショートカット（いろいろなタブの画面へすぐ行ける） -----
const SC_LIST=[
 ['予定','act:', '📅','予定を決める'],
 ['発信','sns:','📣','投稿の方針・チャンネル'],
 ['お金','money:bills','🧾','家計・請求書'],['お金','money:spend','💰','お金の使い道'],['お金','money:shop','🛍','買い物・サブスク'],['お金','money:room','🛋','部屋の飾り'],['お金','money:bank','🏦','投資・借入'],
 ['事業','biz:town','🗺','まちの地図'],['事業','biz:shop','🏪','お店の経営'],['事業','biz:co','🏢','会社'],['事業','biz:office','🎤','事務所・タレント'],['事業','biz:svc','📦','サブスク事業'],['事業','biz:res','🔬','研究'],
 ['人生','life:stat','📊','能力・素質'],['人生','life:goal','🎯','目標・性格'],['人生','life:choice','🔀','人生の選択'],['人生','life:ppl','👥','人物'],['人生','life:map','🕸','相関図・弟子'],['人生','life:album','📷','アルバム'],['人生','life:skill','🌳','スキル'],['人生','life:rec','📜','記録']];
function scRecent(){try{return JSON.parse(localStorage.getItem('buzz-sc')||'{}')}catch(_){return {}}}
function scCount(k){const r=scRecent();r[k]=(r[k]||0)+1;try{localStorage.setItem('buzz-sc',JSON.stringify(r))}catch(_){}}
function scBtn(x){return `<button class="b mtile" type="button" data-goto="${x[1]}" data-sc="1"><span class="mi">${x[2]}</span><span class="mt">${esc(x[3])}</span><span class="md">${esc(x[0])}</span></button>`}
function showShortcut(){const r=scRecent();const top=SC_LIST.filter(x=>r[x[1]]).sort((a,b)=>r[b[1]]-r[a[1]]).slice(0,6);let h=`<div class="mcat life">ショートカット</div><h2>どこへ行く？</h2>`;
  if(top.length)h+=`<h3>よく使う</h3><div class="mgrid">${top.map(scBtn).join('')}</div>`;
  for(const g of ['予定','発信','お金','事業','人生'])h+=`<h3>${g}</h3><div class="mgrid">${SC_LIST.filter(x=>x[0]===g).map(scBtn).join('')}</div>`;
  openModal(h+'<button class="b pri" type="button" data-act="close">閉じる</button>');$('#mcard').dataset.kind='sc'}
(function(){const c=document.getElementById('ctrl');if(!c)return;const b=document.createElement('button');b.className='b sm';b.type='button';b.id='btnSc';b.textContent='⚡移動';b.title='ショートカット：どの画面へもすぐ行ける';b.setAttribute('aria-label','ショートカット');c.appendChild(b)})();
document.addEventListener('click',e=>{const b=e.target.closest('button');if(!b||!S)return;
  if(b.id==='btnSc'){showShortcut();return}
  if(b.dataset.goto){const g=b.dataset.goto;if(g.endsWith(':')){const tk=g.slice(0,-1);setTab(tk);renderBadges()}scCount(g);if(b.dataset.sc)closeModal();setTimeout(panelToTop,0);return}
  if(b.dataset.tab){const tk=b.dataset.tab;scCount(tk+':'+((SUB&&SUB[tk])||''));setTimeout(panelToTop,0)}});

// ----- スマホ：タブを切りかえたら、中身の先頭が見えるように／部屋の絵をたためる -----
function panelToTop(){if(innerWidth>=760)return;const p=$('#panel'),hd=document.querySelector('#scrGame .top');if(!p)return;const y=p.getBoundingClientRect().top+scrollY-((hd&&getComputedStyle(hd).position==='sticky')?hd.offsetHeight:0)-6;if(Math.abs(scrollY-y)>20)window.scrollTo({top:Math.max(0,y),behavior:'auto'})}
let ROOMMIN=false;try{ROOMMIN=localStorage.getItem('buzz-roommin')==='1'}catch(_){}
(function(){const w=document.querySelector('.roomwrap');if(!w)return;const b=document.createElement('button');b.type='button';b.className='roomtog';b.id='roomTog';w.appendChild(b);applyRoomMin()})();
function applyRoomMin(){document.body.classList.toggle('roommin',ROOMMIN);const b=$('#roomTog');if(b)b.textContent=ROOMMIN?'▼ 部屋の絵を出す':'▲ たたむ'}
document.addEventListener('click',e=>{if(e.target.closest('#roomTog')){ROOMMIN=!ROOMMIN;try{localStorage.setItem('buzz-roommin',ROOMMIN?'1':'0')}catch(_){}applyRoomMin()}});

// ----- 素質の上限を解放（最大300）と、素質の効果をわかりやすく -----
function talRank(v){return v<20?'入門':v<40?'そこそこ':v<60?'得意':v<80?'プロ級':v<100?'一流':v<150?'天才':v<200?'達人':v<250?'伝説':'神の領域'}
function talQ(v){return v<=100?v*.3:30+(v-100)*.06}
function talDisc(v){return 1+Math.max(0,v-100)/400}
// 投稿の質：素質100をこえた分も少し効く
const _pq27=postQuality;postQuality=function(){const v=(S.tal&&S.tal[talKey(S.genre)])||0;let q=_pq27();if(v>100)q=Math.min(100,q+(talQ(v)-30));return q};
// 見つかりやすさ：素質100をこえると、上がっていく
const _dm27=discMul;discMul=function(){const v=(S.tal&&S.tal[talKey(S.genre)])||0;return _dm27.apply(this,arguments)*talDisc(v)};
// サブスクの伸び：100をこえても少しずつ伸びる
talSubMul=function(t){const v=(S.tal&&S.tal[t])||0;return v<100?clamp(1.15-v/100,.3,1):.3};
topTalHtml=function(){const cur=S.snsOpen?talKey(S.genre):null;return `<h3>素質（最大${TAL_MAX}）</h3><p class="hint">素質は、そのジャンルで投稿したときの「投稿の質」に効く。100をこえると「見つかりやすさ」も上がる。高いほど伸びにくい。</p><div class="talrows">${TALK.map(k=>{const v=S.tal[k]||0;return `<div class="talrow ${cur===k?'cur':''}"><div class="tl"><b>${esc(GENRES[k].n)}</b><span class="chip">${talRank(v)}</span>${cur===k?'<span class="chip up">いまのジャンル</span>':''}</div><div class="tbar"><i style="width:${Math.min(100,v/TAL_MAX*100).toFixed(1)}%"></i><em style="left:${(100/TAL_MAX*100).toFixed(1)}%"></em></div><div class="tv"><b>${Math.floor(v)}</b><span class="muted small">投稿の質+${talQ(v).toFixed(0)}${v>100?`・見つかりやすさ×${talDisc(v).toFixed(2)}`:''}</span></div></div>`}).join('')}</div>`};

// ----- 素質のサブスクを追加（上級は素質80から） -----
const TAL_UP=[['game','ゲーム大会の合宿','世界大会の選手と特訓'],['cook','有名店のまかない修行','世界の三つ星シェフに師事'],['beauty','美容学校の夜間コース','トップモデルの専属コーチ'],['talk','落語・話芸の教室','人気司会者のマンツーマン'],['study','専門家のゼミ','ノーベル賞学者の特別講義'],['music','音楽大学の公開講座','世界的な歌手のレッスン'],['comedy','劇場の若手ライブ出演','伝説の芸人の弟子入り'],['vlog','旅カメラマンの同行','映画監督のワークショップ']];
TAL_UP.forEach(([t,mid,top])=>{const gn=GENRES[t].n;
  SUBS['t2_'+t]={c:'tal',n:mid,p:40000,age:15,d:`${gn}の素質 +0.8／月`,f:()=>talSub(t,.8)};
  SUBS['t3_'+t]={c:'tal',n:top,p:500000,age:18,need:t,d:`${gn}の素質 +1.6／月（素質80から）`,f:()=>{if((S.tal[t]||0)>=80)talSub(t,1.6)}}});
Object.assign(SUBS,{
 t_all1:{c:'tal',n:'なんでも体験教室',p:15000,age:6,d:'いちばん低い素質 +0.4／月',f:()=>{const t=TALK.slice().sort((a,b)=>(S.tal[a]||0)-(S.tal[b]||0))[0];talSub(t,.4)}},
 t_all2:{c:'tal',n:'才能発見コーチ',p:120000,age:10,d:'いちばん高い素質 +0.8／月',f:()=>{const t=TALK.slice().sort((a,b)=>(S.tal[b]||0)-(S.tal[a]||0))[0];talSub(t,.8)}},
 t_ai:{c:'tal',n:'AI専属トレーナー',p:60000,age:10,yr:2035,d:'いまのジャンルの素質 +0.9／月（2035年から）',f:()=>{const t=S.snsOpen?talKey(S.genre):topTal();talSub(t,.9)}},
 t_brain:{c:'tal',n:'脳とつながる学習機',p:3e6,age:18,yr:2060,d:'すべての素質 +0.3／月（2060年から）',f:()=>{for(const t of TALK)talSub(t,.3)}}
});
const _slh27=subsListHtml;subsListHtml=function(){let h=_slh27();if(SUBCAT==='tal'){for(const [t] of TAL_UP){const k='t3_'+t;if((S.tal[t]||0)<80&&!(S.subs&&S.subs[k]))h=h.replace(`data-sub2="${k}"`,`data-sub2="${k}" disabled`)}}return h};

// ----- 出典・クレジット（v1.1.7 時点の内容に更新） -----
function showCredit(){openModal(`<div class="mcat life">クレジット</div><h2>出典・クレジット</h2><div class="credit">
<p class="hint">いま遊んでいる版：${esc(CUR_VER)}</p>
<h3>統計データ</h3>
<p>以下のデータを参考に、ゲーム用に大きく丸めて加工しています。数値は実際の統計そのものではありません。</p>
<ul>
<li>出典：厚生労働省「簡易生命表」を加工して作成（年齢別の死亡確率）</li>
<li>出典：厚生労働省「国民生活基礎調査」を加工して作成（世帯所得の分布）</li>
<li>出典：厚生労働省「賃金構造基本統計調査」を加工して作成（初任給）</li>
<li>出典：文部科学省「学校基本調査」を加工して作成（大学進学率）</li>
<li>がんの生涯リスク「およそ2人に1人」は、国立がん研究センターが公表している統計に基づく一般的な目安です</li>
<li>日本の政府統計は、政府標準利用規約（第2.0版）に基づいて利用しています</li>
<li>実在の国の暮らし向き・物価・ネットの普及率などの目安：世界銀行 World Development Indicators（CC BY 4.0）を加工して作成</li>
</ul>
<h3>実際の出来事</h3>
<p>舞台「日本」や「過去」の時代で起きる実際の出来事（オリンピック、改元、景気の変化など）は、広く知られている歴史上の事実をもとに、このゲームのために書いたオリジナルの文章で紹介しています。</p>
<h3>フォント</h3>
<p>次のフォントは、どれも SIL Open Font License 1.1 で公開されているもので、Google Fonts から読み込んでいます（「見た目」で選んだものだけ）。</p>
<ul>
<li>DotGothic16（Fontworks）</li>
<li>Zen Maru Gothic（Yoshimichi Ohira）</li>
<li>M PLUS Rounded 1c（M+ FONTS PROJECT）</li>
<li>Noto Sans JP（Google）</li>
<li>Klee One（Fontworks）</li>
</ul>
<h3>絵・音楽・効果音</h3>
<p>主人公・部屋・まち・さし絵・投稿のサムネイルなどの絵、BGM（チップチューン・時代・場面の曲）、効果音、環境音は、すべてこのゲームのためにプログラムで描いた・作曲して鳴らしたオリジナルです。外部の画像・音源・既存の曲は使っていません。</p>
<h3>文章</h3>
<p>出来事（1000種類以上）・投稿のタイトル・アイテム・サブスク・事務所の名前などの文章は、すべてこのゲームのためのオリジナルです。</p>
<h3>使っているサービス</h3>
<ul>
<li>公開：GitHub Pages</li>
<li>文字の表示：Google Fonts</li>
<li>感想・不具合の送信：Google フォーム（送ったときだけ、書いた内容が開発者に届きます）</li>
</ul>
<p>セーブデータや設定は、このブラウザの中にだけ保存されます。</p>
<h3>おことわり</h3>
<p>このゲームはフィクションです。登場する国・地名・人物・SNS・企業・サービス・商品は架空のもので、実在のものとは関係ありません（舞台「日本」や「世界のどこか」の国名・実際の出来事を除く）。ゲーム内のお金・健康・法律などの内容は遊びのためのもので、実際の助言ではありません。</p></div>
<button class="b pri" type="button" data-act="close">閉じる</button>`)}
