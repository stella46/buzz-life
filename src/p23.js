
// ===== v1.1.3：最近の投稿のバリエーション・買い物の「1回だけ／何度でも」と買いすぎ対策 =====

// ----- 投稿タイトル（すべてオリジナル。{n}=数字 {s}=季節 {f}=食べ物 {p}=場所 {o}=もの） -----
const PT2={
 game:['初見プレイ実況','ついにクリア！','縛りプレイに挑戦','{n}時間耐久プレイ','最速クリアを目指す','隠し要素を全部探す','視聴者と対戦','昔のゲームを{n}年ぶりに','下手でも楽しい実況','ボス戦{n}連続','全ルート攻略 その{n}','初心者講座：基本の動き','負けたら罰ゲーム','{s}の新作をいち早く','操作ミス集','最強装備を作るまで','難易度最高でやってみた','協力プレイで大混乱','エンディングで泣いた','ゲームの世界を散歩する'],
 cook:['10分ごはん','節約レシピ','はじめてのお菓子作り','{f}を{n}通り作る','冷蔵庫の残りで1品','{s}の旬レシピ','作り置き{n}品','100円でできるおかず','失敗しない{f}','お弁当を詰める朝','屋台の味を家で','世界の料理に挑戦','{f}の食べ比べ','包丁さばき練習','材料3つで作る{f}','夜食にぴったり','家族のリクエスト料理','レンジだけで{f}','パン作りに{n}回挑戦','{s}のおもてなし料理'],
 beauty:['季節のメイク','プチプラで垢抜け','髪型アレンジ','{s}のコーデ{n}選','5分で朝メイク','手持ちの服で1週間','スキンケアの順番','似合う色の見つけ方','ヘアアレンジ{n}通り','購入品紹介','メイク落としの比較','ネイルに挑戦','大人っぽく見せるコツ','雨の日のまとめ髪','学生のうちにやること','バッグの中身','{p}に行く日のコーデ','初心者のための道具選び','イメチェンしてみた','すっぴんからの変身'],
 talk:['のんびり雑談','質問コーナー','最近あったこと','{n}個の質問に答える','寝る前の雑談','{s}の思い出話','失敗談を聞いて','おすすめを語る','人生相談に答える','{p}で起きた話','好きなものを語る夜','視聴者のお悩み相談','昔の自分に言いたいこと','{n}年後の目標','朝の雑談','最近ハマっているもの','ちょっと聞いてほしい話','今年の振り返り','お便り紹介','ゆるい作業雑談'],
 study:['3分でわかる解説','テスト前の勉強法','ニュースのまとめ','{n}分でわかる歴史','暗記のコツ{n}選','{s}の自由研究のヒント','苦手を克服する方法','ノートのとり方','計算を速くするコツ','図で見るしくみ','知らないと損する豆知識','一緒に勉強{n}時間','英単語{n}個','理科の実験','読書のすすめ','お金のきほん','地図で旅する世界','時間の使い方','質問に答える授業','{p}のひみつ'],
 music:['弾いてみた','オリジナル曲','カラオケ配信','{s}の歌メドレー','{n}曲連続で歌う','新曲を作るまで','楽器を{n}日練習','アカペラに挑戦','弾き語り','作業用ピアノ','{p}で演奏してみた','ハモリに挑戦','リクエスト曲を歌う','鼻歌から作曲','練習の記録','声の出し方講座','ライブの裏側','即興で1曲','{n}年前の曲を歌う','聴いてほしい1曲'],
 comedy:['やってみた','ドッキリ企画','100回チャレンジ','{n}時間で{o}を作る','絶対に笑ってはいけない{p}','{o}だけで1日過ごす','罰ゲームをかけた勝負','{s}の大実験','本気のものまね','{n}人で大喜利','全力リアクション集','{o}を探す旅','即興コント','やってはいけない挑戦（安全に）','早口言葉{n}連発','逆の生活をしてみた','くじで決める1日','{p}で宝探し','{n}回すべったら終わり','友達と大げんか（演技）'],
 vlog:['休日のvlog','旅行の記録','モーニングルーティン','{p}への日帰り旅','{s}のある1日','買い物に行く日','部屋の模様替え','ナイトルーティン','{n}日間の記録','カフェめぐり','散歩しながら話す','引っ越しの記録','おうち時間','{p}で過ごす休日','{s}の景色','いつもの1週間','一人旅','家族と過ごす日','早起きできた日','{o}を買いに行く'],
 asmr:['作業用BGM','雨の音と勉強','ささやき雑談','{s}の夜の音','{n}時間ぐっすり眠れる音','焚き火の音','キーボードの音','波の音と読書','紙をめくる音','{o}の音を集めた','カフェの環境音','夜の街の音','鳥のさえずり','料理の音だけ','風鈴の音','{n}分集中タイマー','静かな図書館','雪の降る夜','時計の音','遠くの電車の音'],
 avatar:['アバターで雑談','新衣装おひろめ','歌枠','{s}の新衣装','{n}万人記念配信','初めての3D','視聴者とゲーム','お絵かき配信','{o}を作る配信','バーチャル{p}探検','声だけで当てて','朝の短い配信','歌って踊る','マシュマロに答える','{n}時間耐久','誕生日配信','雑談しながら作業','衣装デザイン会議','{s}の思い出','新しい表情'],
 vr:['VR世界を探検','VRでライブ','仮想空間ツアー','VR{p}を歩く','{n}人で仮想鬼ごっこ','仮想空間に家を建てる','VRで料理','空を飛ぶ体験','{s}の仮想イベント','VR美術館','無重力で遊ぶ','仮想の海に潜る','VRで旅行','視聴者と集合写真','{o}をVRで作る','VR運動会','宇宙ステーション体験','VRで授業','ホラー空間（こわくない版）','{n}時間仮想生活'],
 aico:['AIと即興コント','AIに相談','AIと勝負','AIと{n}問クイズ','AIが考えた{f}を作る','AIに曲を作ってもらった','AIと{s}の旅行計画','AIの答えを当てる','AIと大喜利','AIに人生相談','AIと絵しりとり','AIと作る物語','AIに{o}を説明する','AIと料理対決','AIに似顔絵を描いてもらう','AIと早押し','AIに台本を書いてもらった','AIと作戦会議','AIに{p}を案内してもらう','AIと1日入れ替わる']
};
const PT_F=['オムライス','カレー','パスタ','おにぎり','ハンバーグ','パンケーキ','スープ','からあげ','ドーナツ','グラタン','焼きそば','プリン'];
const PT_P=['海','山','商店街','図書館','公園','駅前','遊園地','温泉街','動物園','水族館','古い町並み','屋上'];
const PT_O=['段ボール','紙コップ','ペットボトル','風船','空き箱','ビー玉','折り紙','毛糸','ボタン','輪ゴム','新聞紙','トランプ'];
const PT_SEASON=['冬','冬','春','春','春','初夏','夏','夏','秋','秋','秋','冬'];
const PT_EV={1:['新年','お正月'],2:['バレンタイン'],3:['卒業','春休み'],4:['新生活'],7:['夏休み'],8:['夏休み','お盆'],10:['ハロウィン'],12:['クリスマス','年末']};
function pseed(a){let x=(a*2654435761)>>>0;return ()=>{x^=x<<13;x>>>=0;x^=x>>17;x^=x<<5;x>>>=0;return x/4294967296}}
function postTitle(seed){const r=pseed(seed),pk=a=>a[Math.floor(r()*a.length)];const g=S.genre;const base=PT2[g]||PT2.talk;
  const recent=(S.posts||[]).map(p=>p.base);let t=pk(base);for(let i=0;i<6&&recent.includes(t);i++)t=pk(base);const b0=t;
  const sea=(PT_EV[S.m]&&r()<.5&&!(S.m===10&&S.y<1995))?pk(PT_EV[S.m]):PT_SEASON[S.m-1];
  t=t.replace('{n}',String(pk([2,3,5,7,10,12,20,24,30,50,100]))).replace('{s}',sea).replace('{f}',pk(PT_F)).replace('{p}',pk(PT_P)).replace('{o}',pk(PT_O));
  let pre='',suf='';const pl=typeof POPT!=='undefined'?POPT:'normal';
  if(pl==='short')pre=pk(['【ショート】','【60秒】','【1分】']);else if(pl==='big')pre=pk(['【大型企画】','【総集編】','【完全版】']);else if(pl==='live')pre=pk(['【生配信】','【ライブ】']);
  else if(pl==='collab'){let nm='';try{const c=collabNow();nm=c&&c.name?c.name.split(/[ ・]/)[0]:''}catch(_){}pre=nm?`【${nm}さんとコラボ】`:'【コラボ】'}
  if(!pre&&S.style==='edge'&&r()<.5)pre='【ガチ】';else if(!pre&&S.style==='chill'&&r()<.4)pre='【まったり】';else if(!pre&&S.trend&&S.trend.g===g&&r()<.35)pre='【流行中】';
  if(S.series&&S.series.g===g&&S.series.n>=3&&r()<.6)suf=` #${Math.floor(S.series.n)}`;
  return {t:pre+t+suf,base:b0}}
postRecord=function(buzzed,views){if(!S.posts)S.posts=[];const last=S.posts[S.posts.length-1];if(last&&last.am===S.am)return;const seed=(S.am*131+(S.seed||0)*7+S.posts.length*17+Math.floor(views))%100000;const tt=postTitle(seed);
  S.posts.push({am:S.am,g:S.genre,t:tt.t,base:tt.base,v:Math.round(views),b:buzzed?1:0,st:S.style,s:seed,pl:typeof POPT!=='undefined'?POPT:'normal'});if(S.posts.length>6)S.posts.shift()};

// ----- サムネイル：背景・人物の位置・大きな文字・小物を投稿ごとに変える -----
const TH_CAP={short:['60秒','速報','一瞬'],big:['神回','完全版','総集編','超大作'],live:['LIVE','生配信','いま'],collab:['コラボ','2人で','共演'],normal:['初挑戦','検証','必見','衝撃','まさか','最強','保存版','本音','新作','ついに']};
function thIcon(g,v,cx,cy,c){
  if(g==='game'){if(v===0){G.R(cx-15,cy-7,30,14,'#222',{r:4});G.E(cx-7,cy,3,3,'#555');G.E(cx+7,cy-2,1.6,1.6,'#e03131');G.E(cx+10,cy+1,1.6,1.6,'#3fd6c9')}else if(v===1){G.R(cx-14,cy-10,28,18,'#1d1f3a',{r:2});G.R(cx-12,cy-8,24,14,'#4dabf7');G.R(cx-4,cy-2,4,4,'#ffd43b')}else{G.P(starPts(cx,cy,10),'#ffd43b');G.T('LV',cx,cy+3,'#7a4b00',7,'center')}}
  else if(g==='cook'){if(v===0){G.E(cx,cy+3,15,6,'#ffffff');G.E(cx,cy,10,5,'#e76f51')}else if(v===1){G.R(cx-10,cy-4,20,12,'#495057',{r:3});G.R(cx-13,cy-6,26,3,'#343a40');G.E(cx,cy-9,4,2,'#dee2e6')}else{G.E(cx,cy,11,11,'#ffe066');G.E(cx-3,cy-2,3,2,'#f08c00');G.E(cx+4,cy+3,2,1.6,'#f08c00')}}
  else if(g==='music'){if(v===0)G.T('♪♫',cx,cy+6,'#ffffff',18,'center');else if(v===1){G.R(cx-14,cy-3,28,10,'#212529',{r:2});for(let i=0;i<6;i++)G.R(cx-13+i*4.5,cy-2,3.5,8,'#ffffff')}else{G.R(cx-2,cy-12,4,18,'#adb5bd',{r:2});G.E(cx,cy-12,4,5,'#495057')}}
  else if(g==='study'){if(v===0){G.R(cx-15,cy-11,30,22,'#2f5d4a',{r:1});G.T('A＝B',cx,cy+3,'#ffffff',7,'center')}else if(v===1){G.R(cx-11,cy-9,22,18,'#ffffff',{r:1});G.L(cx-8,cy-4,cx+8,cy-4,'#adb5bd',.6);G.L(cx-8,cy,cx+8,cy,'#adb5bd',.6);G.L(cx-8,cy+4,cx+4,cy+4,'#adb5bd',.6)}else{G.E(cx,cy,11,11,'#74c0fc');G.E(cx-3,cy-2,4,3,'#69db7c');G.E(cx+4,cy+4,3,2,'#69db7c')}}
  else if(g==='beauty'){if(v===0)G.P(starPts(cx,cy,9),'#fff6a0');else if(v===1){G.R(cx-3,cy-10,6,16,'#e64980',{r:2});G.R(cx-3,cy+4,6,5,'#343a40',{r:1})}else{G.E(cx,cy,9,11,'#fcc2d7');G.E(cx,cy,6,8,'#ffffff')}}
  else if(g==='comedy'){if(v===0){G.R(cx-15,cy-9,30,18,'#ffffff',{r:6});G.T('！？',cx,cy+4,c,12,'center')}else if(v===1){G.E(cx,cy,11,11,'#ffd43b');G.A(cx,cy+1,6,.2,Math.PI-.2,'#7a4b00',1.2);G.E(cx-4,cy-3,1.3,1.3,'#7a4b00');G.E(cx+4,cy-3,1.3,1.3,'#7a4b00')}else{G.R(cx-12,cy-8,24,16,'#c92a2a',{r:2});G.T('?',cx,cy+4,'#ffffff',12,'center')}}
  else if(g==='vlog'){if(v===0){G.E(cx,cy-2,8,8,'#ffd43b');G.P([[cx-16,cy+10],[cx-5,cy-1],[cx+4,cy+10]],'#2f9e44');G.P([[cx-2,cy+10],[cx+8,cy+2],[cx+16,cy+10]],'#40c057')}else if(v===1){G.R(cx-12,cy-7,24,15,'#343a40',{r:2});G.E(cx,cy,5,5,'#868e96');G.E(cx,cy,3,3,'#212529')}else{G.R(cx-10,cy-6,20,14,'#ffffff',{r:1});G.R(cx-8,cy-4,16,9,'#74c0fc')}}
  else if(g==='asmr'){G.A(cx-6,cy,8,-.9,.9,'#ffffff',1.2);G.A(cx-6,cy,13,-.8,.8,'#ffffff',1);if(v>0)G.E(cx-8,cy,3,4,'#ffffff')}
  else if(g==='avatar'){G.E(cx,cy-1,10,10,v===1?'#ffd8f0':'#ff9de2');G.E(cx-3,cy-2,1.5,2,'#30304a');G.E(cx+3,cy-2,1.5,2,'#30304a');if(v===2)G.P(starPts(cx+9,cy-9,4),'#fff6a0')}
  else if(g==='vr'){G.R(cx-13,cy-5,26,11,'#212529',{r:4});G.R(cx-10,cy-3,8,6,'#38d9a9',{r:2});G.R(cx+2,cy-3,8,6,'#38d9a9',{r:2})}
  else if(g==='aico'){G.R(cx-10,cy-9,20,17,'#dee2e6',{r:3});G.E(cx-4,cy-2,2.2,2.2,'#4dd4ff');G.E(cx+4,cy-2,2.2,2.2,'#4dd4ff');G.R(cx-5,cy+3,10,2,'#868e96');G.L(cx,cy-9,cx,cy-13,'#868e96',.8)}
  else{G.R(cx-15,cy-9,30,18,'#ffffff',{r:6});G.T('！',cx,cy+5,c,12,'center')}}
paintThumbs=function(){const ps=(S.posts||[]).slice().reverse().slice(0,3);document.querySelectorAll('canvas[data-thumb]').forEach(cv=>{const p=ps[+cv.dataset.thumb];if(!p)return;try{
  const st=sceneStyle()==='classic'?'pixel':sceneStyle(),k=st==='illust'?3:2;cv.width=96*k;cv.height=54*k;cv.style.imageRendering=st==='illust'?'auto':'pixelated';G.use(cv.getContext('2d'),k,st);
  const r=pseed((p.s!=null?p.s:p.am*31)+7),c=G_COL[p.g]||'#7fc8f8',c2=lite(c,.35),lay=Math.floor(r()*4),right=r()<.6,v=Math.floor(r()*3);
  if(lay===0)G.fillG(0,0,96,54,G.grad(0,0,96,54,[[0,c],[1,dark(c,.35)]]));
  else if(lay===1){G.R(0,0,96,54,dark(c,.25));G.P([[0,0],[60,0],[36,54],[0,54]],c)}
  else if(lay===2){G.R(0,0,96,54,c);for(let i=-54;i<96;i+=12)G.P([[i,54],[i+6,54],[i+60,0],[i+54,0]],c2)}
  else{G.R(0,0,96,54,dark(c,.2));for(let i=0;i<14;i++)G.L(48,27,48+Math.cos(i*.45)*80,27+Math.sin(i*.45)*80,c2,4)}
  const me=mainModel({loc:'stream'});const px=right?70:24,ix=right?25:72;
  drawChar(px,58,me,['wave','stand','wave'][v],1);
  thIcon(p.g,v,ix,right?30:30,c);
  const pool=TH_CAP[p.pl]||TH_CAP.normal,cap=p.pl&&p.pl!=='normal'?pool[Math.floor(r()*pool.length)]:(r()<.7?pool[Math.floor(r()*pool.length)]:'');
  if(cap){const cx2=right?25:72,cy2=50;G.T(cap,cx2+.9,cy2+.9,'#1b1b2a',11,'center');G.T(cap,cx2,cy2,r()<.5?'#ffffff':'#ffe066',11,'center')}
  if(p.b){G.R(2,2,30,10,'#e03131',{r:2});G.T('バズ',17,10,'#ffffff',7,'center')}
  else if(p.pl==='live'){G.R(64,2,30,10,'#e03131',{r:2});G.T('● LIVE',79,10,'#ffffff',6,'center')}}catch(e){console.error(e)}})};

// ----- 買い物：1回だけ／何度でも と、買いすぎ対策 -----
const GDIM=[1,.7,.45,.25,.1];
let GMUL=1;
function gHistN(key){if(!S.gHist)S.gHist={};const h=(S.gHist[key]||[]).filter(a=>S.am-a<12);S.gHist[key]=h;return h.length}
function gMonthN(key){return (S.gHist&&S.gHist[key]||[]).filter(a=>a===S.am).length}
function gMonthAll(){if(!S.gHist)return 0;let n=0;for(const k in S.gHist)if(k[0]!=='s')n+=S.gHist[k].filter(a=>a===S.am).length;return n}
const G_CAP=2,G_CAPK=3,G_OVER=4;
function goodRow(g,attr,p){const kid=attr==='kgood',key=(kid?'k:':'g:')+g.k;
  if(g.once){const owned=S.goods&&S.goods[g.k];return `<div class="shop"><div><div>${esc(g.n)} <span class="muted small">${yen(p)}</span> <span class="chip">1回だけ</span></div><div class="muted small">${esc(g.d)}</div></div>${owned?'<span class="chip up">持っている</span>':`<button class="b sm" type="button" data-${attr}="${g.k}" ${S.money<p?'disabled':''}>買う</button>`}</div>`}
  const n=gHistN(key),mul=GDIM[Math.min(n,GDIM.length-1)],mn=gMonthN(key),cap=kid?G_CAPK:G_CAP,full=mn>=cap;
  const eff=n?`<span class="${mul<.5?'dn':''}">次の効果 ${Math.round(mul*100)}%</span>（この1年で${n}回。1年たつと元に戻る）`:'効果 100%';
  return `<div class="shop"><div><div>${esc(g.n)} <span class="muted small">${yen(p)}</span> <span class="chip">何度でも</span></div><div class="muted small">${esc(g.d)}</div><div class="muted small">${eff}${full?'・今月はもう十分（来月また買える）':''}</div></div><button class="b sm" type="button" data-${attr}="${g.k}" ${S.money<p||full?'disabled':''}>${full?'今月は十分':'買う'}</button></div>`}
function goodsNote(){const n=gMonthAll();return `<p class="hint">「何度でも」の物は、続けて買うほど効果が小さくなる（1年で元に戻る）。同じ物は月${G_CAP}回まで。今月の買い物：${n}回${n>=G_OVER?'（買いすぎ。これ以上は気持ちが下がる）':`（${G_OVER+1}回目からは買いすぎで気持ちが下がる）`}</p>`}
// 買う前に呼ぶ：買えるか（月の上限）
function goodCanBuy(g,kid){if(g.once)return true;const key=(kid?'k:':'g:')+g.k;return gMonthN(key)<(kid?G_CAPK:G_CAP)}
// 効果を、この1年で買った回数に応じて弱める
function goodApply(g,kid,fn){if(g.once){fn();return}const key=(kid?'k:':'g:')+g.k;const n=gHistN(key);GMUL=GDIM[Math.min(n,GDIM.length-1)];try{fn()}finally{GMUL=1}
  S.gHist[key].push(S.am);const all=gMonthAll();
  if(all>G_OVER){ad('happy',-1.5);ad('mental',-1);log(pick(['買い物しすぎて、部屋が物であふれてきた','また買ってしまった…と少し後ろめたい','財布を見てため息が出た']),'bad')}
  else if(n>=3)log(`${g.n}には、もう少し飽きてきた`,'life')}
const _ad113=ad;ad=function(k,v,cat){if(GMUL!==1&&v>0&&k!=='money'&&k!=='f')v*=GMUL;return _ad113(k,v,cat)};
const _rel113=rel;rel=function(n,v){if(GMUL!==1&&v>0)v*=GMUL;return _rel113(n,v)};
const _relP113=relP;relP=function(v){if(GMUL!==1&&v>0)v*=GMUL;const g0=GMUL;GMUL=1;try{return _relP113(v)}finally{GMUL=g0}};

// お金の使い道：種類のラベルと、くり返し使ったときの効き目
function spKind(it){if(it.m)return '毎月の契約';if(it.once)return '1回だけ';if(it.cd)return `何度でも（${it.cd}か月ごと）`;return '何度でも'}
const SP_DIMC=['self','life','family','health','social'];
function spDim(it){return !it.m&&!it.once&&SP_DIMC.includes(it.c)}
