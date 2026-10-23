
// ===== v1.3：会社で作るもの（おまかせ／自分で決める）・まちの施設と会社の役割分け・実績の追加 =====

// ----- まちの「ゲーム会社」は「ゲームセンター」に（会社とかぶらないように） -----
Object.assign(BLD.gamedev,{n:'ゲームセンター',eff:'遊びに来るお客さんで稼ぐ。当たり外れが大きい'});
SHOP_UNIT.gamedev='客';
(function(){const r=RES.find(x=>x.id==='gamedev');if(r){r.n='ゲームセンター経営';r.d='まちにゲームセンターを建てられる'}})();
Object.assign(BLD.apparel,{eff:'服を売るお店。フォロワーが多いほど売れる'});
// 開発の出来事は「ゲーム開発会社」を持っているときに
const coHasK=k=>()=>S.cos&&S.cos.some(c=>c.k===k);
for(const id of ['x_sh_game','b_game_hit','b_game_flop'])if(EV[id])EV[id].when=coHasK('game');

// ----- 会社とまちの施設の「連携」：関係する会社を持っていると、お店の売上も会社の利益も上がる -----
const SYN={food:['stall','cafe','restaurant'],apparel:['apparel'],game:['gamedev'],media:['studio','library'],it:['studio'],estate:[],space:[]};
const SYN_N={food:'屋台・カフェ・食堂',apparel:'アパレルショップ',game:'ゲームセンター',media:'配信スタジオ・図書館',it:'配信スタジオ'};
function synTiles(k){const ts=SYN[k]||[];if(!ts.length||!S.town)return 0;let n=0;for(const T of allTowns())for(const t of T.tiles)if(ts.includes(t.t))n++;return n}
function synShopOn(type){return S.cos&&S.cos.some(c=>(SYN[c.k]||[]).includes(type))}
const _ssm32=shopSegMul;shopSegMul=function(i){let m=_ssm32(i);try{const t=S.town.tiles[i];if(t&&synShopOn(t.t))m*=1.15}catch(_){}return m};
function synCoMul(c){return Math.min(.3,.06*synTiles(c.k))}

// ----- 会社で作るもの -----
const PROD={
 game:{lbl:'ゲーム',verb:'開発',items:['アクション','RPG','パズル','育成シミュレーション','リズムゲーム','ホラー','スポーツ','恋愛アドベンチャー','オープンワールド','カードゲーム','レース','パーティーゲーム'],sk:()=>S.sk.plan*.5+(S.tal.game||0)*.3},
 it:{lbl:'アプリ',verb:'開発',items:['SNSアプリ','家計簿アプリ','学習アプリ','地図・乗りかえアプリ','写真加工アプリ','健康管理アプリ','フリマアプリ','予約サービス','業務システム','音楽アプリ','翻訳アプリ','AIアシスタント'],y:{'AIアシスタント':2030},sk:()=>S.p.know*.5+S.sk.plan*.3},
 food:{lbl:'新メニュー',verb:'開発',items:['ラーメン','カレー','ハンバーガー','スイーツ','定食','ヘルシー弁当','季節限定ドリンク','冷凍食品'],sk:()=>(S.tal.cook||0)*.6+S.sk.plan*.2},
 apparel:{lbl:'コレクション',verb:'制作',items:['ストリート','きれいめ','スポーツ','子ども服','古着風','高級ライン','季節限定','アーティストとのコラボ'],sk:()=>S.sk.looks*.5+(S.tal.beauty||0)*.3},
 media:{lbl:'企画',verb:'制作',items:['雑誌','写真集','小説','漫画','ドキュメンタリー','バラエティ番組','ニュースサイト','音声番組'],sk:()=>S.sk.talk*.4+S.p.know*.3},
 estate:{lbl:'物件',verb:'建設',items:['マンション','オフィスビル','商業施設','シェアハウス','高級住宅','物流倉庫'],sk:()=>S.sk.plan*.4+S.p.know*.3},
 space:{lbl:'ミッション',verb:'計画',items:['小型衛星','通信衛星','観光ロケット','月面探査','宇宙ホテル','火星調査'],sk:()=>S.p.know*.6}
};
const PSCALE={s:{n:'小さく',dur:3,cm:.05,mm:1},m:{n:'ふつう',dur:6,cm:.2,mm:1.05},l:{n:'大作',dur:12,cm:.6,mm:1.15}};
function prodItems(k){const P=PROD[k];return P.items.filter(it=>!(P.y&&P.y[it]&&S.y<P.y[it]))}
function prodTrend(k){if(!S.prodTr)S.prodTr={};let t=S.prodTr[k];const its=prodItems(k);if(!t||S.am>=t.until||!its.includes(t.it)){t=S.prodTr[k]={it:pick(its),until:S.am+RI(14,26)}}return t.it}
function prodCost(c,sc){return Math.round(COS[c.k].c*PSCALE[sc].cm*Math.max(1,c.lv*.6)*Math.max(.2,S.cty.inc))}
function prodStart(c,it,sc,auto){const cost=prodCost(c,sc);if(S.money<cost)return false;outc('co',cost);c.pr=c.pr||{};c.pr.act={it,sc,st:S.am,dur:PSCALE[sc].dur,cost,auto:!!auto};if(!auto)log(`「${c.name}」で${PROD[c.k].lbl}「${it}」の${PROD[c.k].verb}を始めた（${PSCALE[sc].n}・${yen(cost)}）`,'good');return true}
function prodRelease(c){const a=c.pr.act,P=PROD[c.k];const last=(c.pr.hist||[])[0];
  let rnd=R(-18,18);if(typeof prodCareful==='function'&&prodCareful(c)&&rnd<-10)rnd=-10;let q=35+c.lv*3+P.sk()*.25+(S.cfocus===c.id?8:0)+rnd-(last&&last.it===a.it?8:0)+(typeof prodExtra==='function'?prodExtra(c,a):0);q=Math.round(clamp(q,1,100));
  const tr=prodTrend(c.k)===a.it;const total=Math.round(a.cost*Math.pow(q/50,2)*(tr?1.6:1)*PSCALE[a.sc].mm*R(.7,1.3)*ecoMul());
  c.pr.sales=c.pr.sales||[];c.pr.sales.push({left:12,amt:total*.18,dec:.86});
  c.pr.hist=[{it:a.it,sc:a.sc,q,total,am:S.am,tr},...(c.pr.hist||[])].slice(0,5);c.pr.act=null;
  S.prodN=(S.prodN||0)+1;S.prodBest=Math.max(S.prodBest||0,q);S.prodWorst=Math.min(S.prodWorst==null?100:S.prodWorst,q);
  const msg=q>=90?'大ヒット！':q>=70?'好評':q>=45?'まずまず':q>=20?'いまひとつ':'酷評……';
  log(`「${c.name}」の${P.lbl}「${a.it}」が完成（評価 ${q}点・${msg}${tr?'・流行に乗った':''}）`,q>=70?'good':q<30?'bad':'life');
  if(q>=90){ad('rep',3);tl(`「${c.name}」の${P.lbl}「${a.it}」が大ヒット`);c.val=Math.round(c.val*1.08)}else if(q<20){ad('rep',-1)}}
function prodMonth(){for(const c of (S.cos||[])){const P=PROD[c.k];if(!P)continue;c.pr=c.pr||{};
  if(c.pr.act&&S.am>=c.pr.act.st+c.pr.act.dur)prodRelease(c);
  let v=0;for(const s of (c.pr.sales||[])){v+=s.amt;s.amt*=s.dec;s.left--}c.pr.sales=(c.pr.sales||[]).filter(s=>s.left>0);c.pr.rev=Math.round(v);if(v)inc('co',Math.round(v));
  const sy=synCoMul(c);c.syn=0;if(sy>0){const e=Math.round(Math.max(0,coProfit(c,false))*sy);c.syn=e;if(e)inc('co',e)}
  if(c.pmode!=='manual'&&!c.pr.act&&chance(.35)){const its=prodItems(c.k);const it=chance(.6)?prodTrend(c.k):pick(its);const sc=S.money>=prodCost(c,'l')*4&&chance(.3)?'l':S.money>=prodCost(c,'m')*3?'m':'s';if(S.money>=prodCost(c,sc)*2)prodStart(c,it,sc,true)}}}
const _mh32=monthHook11;monthHook11=function(){_mh32();try{prodMonth()}catch(e){console.error(e)}};
function prodHtml(c){const P=PROD[c.k];if(!P)return '';const pr=c.pr||{},man=c.pmode==='manual',tr=prodTrend(c.k);
  let h=`<div class="prodbox"><div class="hd"><span>${P.lbl}づくり</span><span class="seg"><button type="button" class="${man?'':'on'}" data-pmode="${c.id}" data-v="auto">おまかせ</button><button type="button" class="${man?'on':''}" data-pmode="${c.id}" data-v="manual">自分で決める</button></span></div>`;
  h+=`<p class="hint small">いまの流行り：<b>${esc(tr)}</b>${(SYN[c.k]||[]).length?`・まちの${esc(SYN_N[c.k]||'')}と連携${c.syn?`（先月 +${yen(c.syn)}）`:''}`:''}</p>`;
  if(pr.act){const a=pr.act,done=Math.min(1,(S.am-a.st)/a.dur);h+=`<p class="mtext small">${P.verb}中：「${esc(a.it)}」（${PSCALE[a.sc].n}）あと${Math.max(0,a.st+a.dur-S.am)}か月</p><div class="tbar"><i style="width:${(done*100).toFixed(0)}%"></i></div>`}
  else if(man){h+=`<div class="row"><select id="pit_${c.id}">${prodItems(c.k).map(it=>`<option ${it===tr?'selected':''}>${esc(it)}</option>`).join('')}</select><select id="psc_${c.id}">${Object.entries(PSCALE).map(([k,s])=>`<option value="${k}" ${k==='m'?'selected':''}>${s.n}（${s.dur}か月・${yen(prodCost(c,k))}）</option>`).join('')}</select><button class="b sm pri" type="button" data-pgo="${c.id}">${P.verb}を始める</button></div><p class="hint small">流行りに合わせる・あなたの能力が高い・「力を入れる」ほど評価が上がりやすい。同じものを続けると飽きられる。</p>`}
  else h+=`<p class="hint small">いまは次の${P.lbl}を考え中（おまかせ）。</p>`;
  if(pr.rev)h+=`<p class="hint small">先月の${P.lbl}の売上：+${yen(pr.rev)}</p>`;
  if((pr.hist||[]).length)h+=`<div class="phist">${pr.hist.slice(0,3).map(x=>`<span class="chip ${x.q>=70?'up':x.q<30?'dn':''}">${esc(x.it)} ${x.q}点</span>`).join('')}</div>`;
  return h+'</div>'}
const _coHtml32=coHtml;coHtml=function(){let h=_coHtml32();for(const c of (S.cos||[])){const re=new RegExp(`<div class="row"><button class="b sm[^"]*" type="button" data-cfocus="${c.id}"`);const m=h.match(re);if(m)h=h.replace(m[0],prodHtml(c)+m[0])}return h};
document.addEventListener('click',e=>{const b=e.target.closest('button');if(!b||!S)return;const d=b.dataset;
  if(d.pmode){const c=S.cos.find(x=>x.id===d.pmode);if(c){c.pmode=d.v;save();renderPanel()}return}
  if(d.pgo){const c=S.cos.find(x=>x.id===d.pgo);if(!c)return;const it=($('#pit_'+c.id)||{}).value,sc=($('#psc_'+c.id)||{}).value||'m';if(!it)return;if(!prodStart(c,it,sc,false)){toast('お金が足りない');return}snd('buy');save(true);renderPanel()}});
// 会社の説明に連携先を書く
for(const [k,v] of Object.entries(SYN_N))if(COS[k]&&!COS[k].d.includes('連携'))COS[k].d+=`。まちの${v}と連携`;

// ----- 実績を追加（むずかしい・めずらしいものは条件をひみつに） -----
const tfOf=()=>Math.max(...TALK.map(k=>S.tal[k]||0));
const sumSvc=()=>(S.svcs||[]).reduce((a,s)=>a+(s.users||0),0);
const allSnsF=n=>['milu','patto','tsubu','holo'].every(k=>S.open&&S.open[k]&&(S.f[k]||0)>=n);
[
 ['f10m','伝説のインフルエンサー','フォロワー1000万人',()=>S.stats.maxF>=1e7],
 ['buzz30','バズの申し子','1つの人生で30回バズる',()=>S.stats.buzz>=30],
 ['rich10','十億の夢','資産10億円',()=>S.stats.maxM>=1e9],
 ['rich100','大富豪','資産100億円',()=>S.stats.maxM>=1e10],
 ['sub3','チャンネル王','サブチャンネルを3つ持つ',()=>(S.subch||[]).length>=3],
 ['chname','名前をつけた日','チャンネルに名前をつける',()=>S.chn&&Object.values(S.chn).some(c=>c.name)],
 ['co5','グループ企業','会社を5社持つ',()=>(S.cos||[]).length>=5],
 ['copub','上場の鐘','会社を上場させる',()=>(S.cos||[]).some(c=>c.pub)],
 ['prod1','はじめての作品','会社で作品を完成させる',()=>(S.prodN||0)>=1],
 ['prod10','ヒットメーカー','会社で作品を10本完成させる',()=>(S.prodN||0)>=10],
 ['prod90','神ゲーの予感','評価90点以上の作品を作る',()=>(S.prodBest||0)>=90],
 ['svc1','サービス開始','自分のサブスク事業を始める',()=>(S.svcs||[]).length>0],
 ['svc10k','会員1万人','サブスク事業の会員が合計1万人',()=>sumSvc()>=1e4],
 ['snsbuy','プラットフォームの主','SNSの運営会社を買収する',()=>S.snsOwn&&Object.keys(S.snsOwn).length>0],
 ['oftype','新しい看板','事務所の種類を変える',()=>S.office&&S.office.typeAm!=null],
 ['talent6','大所帯','所属タレント6人',()=>S.office&&S.office.talents.length>=6],
 ['tal100','天才の目覚め','どれかの素質が100をこえる',()=>tfOf()>=100],
 ['tal200','達人の域','どれかの素質が200をこえる',()=>tfOf()>=200],
 ['subs10','サブスク好き','サブスクを10件契約する',()=>Object.values(S.subs||{}).filter(Boolean).length>=10],
 ['world','世界を見た','海外旅行に行く',()=>S.spent&&S.spent.trip_w>0],
 ['age90','卒寿','90歳まで生きる',k=>k==='d'&&age()>=90],
 ['life10','人生のベテラン','人生を10回終える',k=>k==='d'&&(META.lives||0)>=9],
 ['life30','人生の達人','人生を30回終える',k=>k==='d'&&(META.lives||0)>=29],
 ['slot5','5つの人生','セーブスロットを5つ全部使う',()=>typeof slotsUsed==='function'&&slotsUsed().length>=5],
 ['coll5','コレクター','コレクションを5つ持つ',()=>(S.coll||[]).length>=5],
 ['towns','まちの開発者','新しいまちを開発する',()=>(S.towns2||[]).length>=1],
 // ここから下は、条件をひみつにする
 ['age110','？','（ひみつ）',k=>k==='d'&&age()>=110,1,'超長寿','110歳まで生きる'],
 ['nosnsrich','？','（ひみつ）',k=>k==='d'&&!S.snsOpen&&S.stats.maxM>=1e9,1,'SNSなんていらない','SNSを始めずに資産10億円で一生を終える'],
 ['noflame','？','（ひみつ）',()=>S.stats.maxF>=1e6&&!(S.stats.flames>0),1,'清廉潔白','一度も炎上せずにフォロワー100万人'],
 ['teenstar','？','（ひみつ）',()=>age()<18&&totalF()>=1e5,1,'早咲きのスター','18歳になる前にフォロワー10万人'],
 ['latebloom','？','（ひみつ）',()=>S.snsAm!=null&&S.snsAm/12>=60&&S.stats.maxF>=1e5,1,'遅咲きの花','60歳をすぎてからSNSを始めてフォロワー10万人'],
 ['rocket','？','（ひみつ）',()=>S.subs&&S.subs.rocket,1,'ロケット・マンスリー','毎月ロケットを打ち上げる'],
 ['god','？','（ひみつ）',()=>tfOf()>=300,1,'神の領域','どれかの素質を300にする'],
 ['poormayor','？','（ひみつ）',()=>S.tier===0&&(S.role==='mayor'||S.role==='adviser'),1,'下町から市長へ','苦しい家庭に生まれて市長になる'],
 ['allsns','？','（ひみつ）',()=>allSnsF(1e5),1,'全SNS制覇','4つのSNSすべてでフォロワー10万人'],
 ['allbuy','？','（ひみつ）',()=>S.snsOwn&&['milu','patto','tsubu','holo'].every(k=>S.snsOwn[k]),1,'SNSの帝王','4つのSNSの運営会社をすべて買収する'],
 ['flop','？','（ひみつ）',()=>S.prodWorst!=null&&S.prodWorst<=10,1,'迷作の生みの親','評価10点以下の作品を作ってしまう'],
 ['gen5','？','（ひみつ）',()=>(S.gen||1)>=5,1,'五代つづく家','5代目として生きる'],
 ['single100','？','（ひみつ）',k=>k==='d'&&age()>=100&&!S.spouse&&!S.flags.everMarried,1,'自由な百年','一度も結婚せずに100歳'],
 ['broke','？','（ひみつ）',k=>k==='d'&&S.stats.maxM>=1e9&&S.money<0,1,'栄光と転落','資産10億円をこえたのに、借金をかかえて一生を終える'],
 ['zeroturn','？','（ひみつ）',()=>(S.prodN||0)>=1&&S.prodBest>=90&&(S.cos||[]).some(c=>c.pr&&c.pr.hist&&c.pr.hist.length===1&&c.pr.hist[0].q>=90),1,'デビュー作が名作','会社の最初の作品で評価90点以上'],
 ['space2','？','（ひみつ）',()=>S.spent&&S.spent.trip_s>0,1,'星の向こうへ','宇宙旅行に行く']
].forEach(a=>ACH.push(a));
// 結婚したことがあるか（ひみつの実績のため）
const _chk32=checkAch;checkAch=function(k){if(S&&S.spouse)S.flags.everMarried=1;return _chk32(k)};
// 実績の画面：ひみつの実績は、解除するまで名前も条件も見せない
showAch=function(){const seen=Object.keys(META.seen).length;const got=ACH.filter(a=>META.ach[a[0]]).length,hid=ACH.filter(a=>a[4]);
  const row=a=>{const [id,n,d,,h,hn,hd]=a,ok=META.ach[id];if(h)return `<div class="ach ${ok?'got':''} ${h?'secret':''}"><b>${ok?esc(hn):'？？？'}${ok?' <span class="chip up">ひみつ</span>':''}</b><span>${ok?esc(hd):'条件はひみつ'}</span></div>`;return `<div class="ach ${ok?'got':''}"><b>${ok?esc(n):'？？？'}</b><span>${esc(d)}</span></div>`};
  openModal(`<div class="mcat life">実績・図鑑</div><h2>実績 ${got} / ${ACH.length}</h2>
  <div class="kv"><span>これまでの人生</span><span>${META.lives||0}回</span><span>最高スコア</span><span>${(META.best||0).toLocaleString()}</span><span>最高フォロワー</span><span>${num(META.bestF||0)}人</span><span>出来事図鑑</span><span>${seen} / ${Object.keys(EV).length}</span></div>
  <h3>実績</h3><div class="achl">${ACH.filter(a=>!a[4]).map(row).join('')}</div>
  <h3>ひみつの実績（${hid.filter(a=>META.ach[a[0]]).length} / ${hid.length}）</h3><p class="hint">むずかしい・めずらしい実績。解除するまで、名前も条件もわからない。</p><div class="achl">${hid.map(row).join('')}</div>
  <h3>集めた称号</h3><p class="small">${Object.keys(META.titles).map(esc).join('・')||'まだない'}</p>
  <button class="b pri" type="button" data-act="close">閉じる</button>`)};
// ひみつの実績を解除したときは、本当の名前で知らせる
checkAch=(function(orig){return function(k){const before=new Set(Object.keys(META.ach));orig(k);for(const a of ACH)if(a[4]&&META.ach[a[0]]&&!before.has(a[0]))toast('ひみつの実績を解除：'+a[5])}})(checkAch);
OLD_VERS.unshift(['v1.2','versions/v1.2/','セーブスロット・かんたん引き継ぎ・SNSの買収が入ったころ（v1.2.3）']);
