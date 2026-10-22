// ===== 設定・基本ヘルパー =====
// ゲーム名・国名はここだけで管理（開発者が変更する場所）
const CFG={country:'ニッポリア',title:'Buzz人生シミュレーター',titleBreak:'Buzz',save:'nipporia-save-v1',start:2026,ver:2};
const $=s=>document.querySelector(s);
const R=(a,b)=>a+Math.random()*(b-a);
const RI=(a,b)=>Math.floor(a+Math.random()*(b-a+1));
const pick=a=>a[Math.floor(Math.random()*a.length)];
const clamp=(v,a=0,b=100)=>Math.max(a,Math.min(b,v));
const chance=p=>Math.random()<p;
function wpick(arr){const t=arr.reduce((s,x)=>s+x.w,0);let r=Math.random()*t;for(const x of arr){if((r-=x.w)<0)return x}return arr[arr.length-1]}
function num(n){n=Math.round(n||0);const a=Math.abs(n);if(a>=1e8)return (n/1e8).toFixed(a>=1e9?0:1).replace(/\.0$/,'')+'億';if(a>=1e4)return (n/1e4).toFixed(a>=1e5?0:1).replace(/\.0$/,'')+'万';return n.toLocaleString('ja-JP')}
const yen=n=>num(n)+'円';
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));

// ===== データ =====
const SURN=['佐藤','鈴木','高橋','田中','伊藤','渡辺','山本','中村','小林','加藤','吉田','山田','松本','井上','木村','林','清水','山崎','森','池田','橋本','石川','前田','小川','岡田','長谷川','村上','近藤','坂本','遠藤'];
const NAME_M=['蓮','湊','陽翔','樹','大和','悠真','蒼','律','朝陽','颯太','陸','健太','翔','拓海','優斗','碧','奏太','結翔'];
const NAME_F=['陽葵','凛','芽依','結菜','葵','紬','澪','咲良','美月','莉子','杏','心春','彩花','結衣','千尋','楓','詩','ひなた'];
const ADULT_M=['誠','剛','浩二','健一','聡','隆','博之','直樹','和也','修','大輔','雅人'];
const ADULT_F=['恵子','由美','真由美','智子','裕子','直美','香織','美穂','明美','久美子','沙織','麻衣'];
const RIVALS=['ネオンうさぎ','ぽてとマン','ゆるふわミナ','夜ふかしタクミ','しろくまソラ','ひよこ先生','カラフルけんた','さばかんチャンネル'];
const TRAITS=['教育熱心','のんびり','目立ちたがり','心配性','放任主義','厳しい'];
const NPC_TRAITS=['やさしい','負けず嫌い','おおらか','気分屋','しっかり者','天然','皮肉屋','面倒見がいい'];

// 地域（架空）。生活費は家賃込みの月額の目安
const REGIONS=[
  {n:'アオバ市',type:'大都市',w:30,cost:150000,sal:1.12},
  {n:'ミナトガワ区',type:'大都市',w:20,cost:165000,sal:1.15},
  {n:'ツバキ市',type:'地方都市',w:25,cost:120000,sal:.95},
  {n:'シオサイ市',type:'地方都市',w:13,cost:115000,sal:.93},
  {n:'イナホ町',type:'町村',w:8,cost:100000,sal:.88},
  {n:'ヤマセ村',type:'町村',w:4,cost:95000,sal:.85}
];
// 世帯の暮らし向き（国民生活基礎調査の所得分布を参考に5段階へ丸めた値）
const TIERS=[
  {l:'苦しい',inc:200,allow:500},
  {l:'ややきびしい',inc:350,allow:1000},
  {l:'ふつう',inc:500,allow:2000},
  {l:'ややゆとり',inc:700,allow:3000},
  {l:'ゆとりがある',inc:1100,allow:5000}
];
// 年齢別の年間死亡確率（厚生労働省「簡易生命表」を参考に丸めた値）
const MORT_M=[[0,.0018],[1,.0003],[5,.0001],[15,.0002],[20,.0004],[30,.0005],[40,.0009],[50,.0023],[60,.006],[65,.0095],[70,.015],[75,.025],[80,.045],[85,.08],[90,.15],[95,.26],[100,.4],[110,.6]];
const MORT_F=[[0,.0017],[1,.0002],[5,.0001],[15,.0001],[20,.0002],[30,.0003],[40,.0006],[50,.0015],[60,.003],[65,.0045],[70,.007],[75,.012],[80,.023],[85,.046],[90,.1],[95,.2],[100,.33],[110,.55]];

const GENRES={
  game:{n:'ゲーム実況',w:{talk:.4,plan:.3,edit:.3}},
  cook:{n:'料理',w:{plan:.3,edit:.4,looks:.3}},
  beauty:{n:'美容・ファッション',w:{looks:.6,edit:.4}},
  talk:{n:'雑談',w:{talk:.8,looks:.2}},
  study:{n:'勉強・解説',w:{know:.5,plan:.3,edit:.2}},
  music:{n:'歌・音楽',w:{talk:.2,edit:.4,looks:.4}},
  comedy:{n:'お笑い・企画',w:{talk:.5,plan:.5}},
  vlog:{n:'Vlog',w:{looks:.3,edit:.5,plan:.2}}
};
// 架空のSNS
const SNS={
  milu:{n:'ミルミル',d:'長い動画',reach:1,disc:1,conv:1,rpm:.4,flame:1,mon:1000,cap:3e6},
  patto:{n:'パッと',d:'短い縦動画',reach:.8,disc:2.2,conv:.55,rpm:.05,flame:1.2,mon:10000,cap:2.5e6},
  tsubu:{n:'ツブヤ',d:'短文と画像',reach:.6,disc:.8,conv:.8,rpm:0,flame:2.2,mon:Infinity,cap:1.2e6}
};
const STYLES={safe:{n:'安全運転',disc:.85,fl:0},norm:{n:'ふつう',disc:1,fl:.002},edge:{n:'攻め',disc:1.35,fl:.012}};
const EQ={
  cam:{n:'カメラ',t:[['スマホのカメラ',0],['Webカメラ',8000],['ミラーレス一眼',90000],['シネマカメラ',400000]]},
  mic:{n:'マイク',t:[['スマホのマイク',0],['USBマイク',6000],['コンデンサーマイク',30000],['プロ用マイク一式',150000]]},
  light:{n:'照明',t:[['部屋の電気',0],['リングライト',3000],['ソフトボックス',20000],['スタジオ照明',120000]]},
  pc:{n:'パソコン',t:[['家族のパソコン',0],['中古ノートPC',40000],['ゲーミングPC',180000],['編集用ハイエンドPC',450000]]},
  room:{n:'部屋',t:[['ふつうの部屋',0],['背景布と小物',5000],['配信デスクと棚',40000],['防音スタジオ化',300000]]}
};
const LESSONS={
  piano:{n:'ピアノ',tal:['music'],cost:7000},
  dance:{n:'ダンス',tal:['music','beauty'],cost:7000},
  cooking:{n:'料理教室',tal:['cook'],cost:6000},
  theater:{n:'子ども劇団',tal:['comedy','talk'],cost:9000},
  prog:{n:'プログラミング教室',tal:['game','study'],cost:10000},
  juku:{n:'学習塾',tal:['study'],cost:20000,know:1},
  swim:{n:'スイミング',tal:[],cost:6000,health:1}
};
const DEALS=[
  {n:'新作スマホゲーム',risk:0,m:1},{n:'ワイヤレスイヤホン',risk:0,m:1.1},{n:'スキンケア用品',risk:1,m:1.2},
  {n:'「飲むだけでやせる」サプリ',risk:3,m:2.2},{n:'転職サービス',risk:1,m:1.3},{n:'地元の観光PR',risk:0,m:.8,good:1},
  {n:'「絶対もうかる」投資講座',risk:4,m:2.8}
];
// 初任給（厚生労働省「賃金構造基本統計調査」を参考：高卒 約18.7万円／大卒 約23.7万円）
const JOBS=[
  {n:'事務職',m:1,need:0},{n:'販売・接客',m:.97,need:0},{n:'工場・製造',m:1.05,need:0},
  {n:'営業職',m:1.08,need:0,soc:35},{n:'ITエンジニア',m:1.12,need:55},{n:'公務員',m:1.0,need:50},
  {n:'広告代理店',m:1.15,need:60,uni:1},{n:'介護・福祉',m:.98,need:0}
];

const P_KEYS={health:'健康',mental:'メンタル',happy:'幸福',know:'知識',social:'人間関係',rep:'評判',priv:'プライバシー'};
const SK_KEYS={talk:'話術',plan:'企画',edit:'編集',looks:'見た目'};

// ===== 状態ヘルパー =====
let S=null, DL=null;
const age=()=>Math.floor(S.am/12);
const pn=n=>n?(n.name.split(' ')[1]||n.name):'';
function totalF(){let t=0;for(const k in S.f)if(S.open[k])t+=S.f[k];return t}
function newMo(){return {inc:{},out:{},views:0,newF:0,posts:0,buzz:0,flame:0}}
function inc(cat,v){if(!v)return;S.money+=v;S.mo.inc[cat]=(S.mo.inc[cat]||0)+v;if(['sns','deal','tip'].includes(cat))S.yInc+=v}
function outc(cat,v){if(!v)return;S.money-=v;S.mo.out[cat]=(S.mo.out[cat]||0)+v}
function ad(k,v,cat){
  if(!v)return;
  if(k in P_KEYS)S.p[k]=clamp(S.p[k]+v);
  else if(k in SK_KEYS)S.sk[k]=clamp(S.sk[k]+v);
  else if(k==='money'){if(v>0)inc(cat||'ev',v);else outc(cat||'ev',-v)}
  else if(k==='f'){const key=S.open[S.main]?S.main:'milu';if(!S.open[key])return;S.f[key]=Math.max(0,S.f[key]+v)}
  else if(k.startsWith('tal.')){const t=k.slice(4);S.tal[t]=clamp(S.tal[t]+v)}
  if(DL)DL[k]=(DL[k]||0)+v;
}
function rel(n,v){if(!n)return;n.rel=clamp(n.rel+v);if(DL){const k='rel:'+pn(n);DL[k]=(DL[k]||0)+v}}
function parents(){return [S.fam.fa,S.fam.mo].filter(p=>p&&p.alive)}
function relP(v){for(const p of parents())rel(p,v)}
function parentName(){const p=parents();return p.length?pick(p).role:'家族'}
function anyParentAlive(){return parents().length>0}
function oldParent(){return pick(parents())}
function lover(){return S.spouse||S.partner}
function relKc(v){rel(S.kc.by==='父'?S.fam.fa:S.fam.mo,v)}
function tl(t){S.tl.push([age(),t])}
function log(t,kind){S.log.unshift([`${S.y}/${S.m}`,t,kind||'']);if(S.log.length>80)S.log.length=80}
function mkNpc(role){const g=chance(.5)?'男':'女';return {id:'n'+RI(1000,9999),name:pick(SURN)+' '+pick(g==='男'?NAME_M:NAME_F),role,trait:pick(NPC_TRAITS),rel:RI(35,55),g}}
function openSns(k){S.open[k]=1;S.snsOpen=1}
function topTal(){return Object.keys(S.tal).sort((a,b)=>S.tal[b]-S.tal[a])[0]}
function livingCost(){const base=S.region.cost*(S.priceIdx||1);return Math.round(base*(S.spouse?1.6:1))}
function kidChLikely(){return S.kc.likely}
function startKidCh(){const ps=parents();const by=ps.find(p=>p.trait==='目立ちたがり')||pick(ps);if(!by)return;S.kc.on=1;S.kc.f=RI(20,200);S.kc.by=by.role;S.kc.byName=by.role;tl('家族チャンネルが始まった')}
function lessonOptions(){const lim=[0,7000,12000,20000,30000][S.tier];return Object.keys(LESSONS).filter(k=>LESSONS[k].cost<=lim)}
function convertTalent(){const t=S.tal,k=S.sk;k.talk=clamp(k.talk+t.talk*.25+t.comedy*.12);k.plan=clamp(k.plan+t.comedy*.15+t.study*.12+t.game*.1);k.edit=clamp(k.edit+t.vlog*.2+t.game*.12+(S.flags.phone?5:0));k.looks=clamp(k.looks+t.beauty*.25+t.music*.08)}
function makeOffers(edu,mid){
  let base=edu==='大卒'?237000:187000;
  if(mid)base*=1+Math.min(.6,Math.max(0,age()-22)*.02);
  const ok=JOBS.filter(j=>S.p.know>=j.need&&(!j.uni||edu==='大卒')&&(!j.soc||S.p.social>=j.soc));
  const out=[];const pool=ok.slice();
  while(out.length<3&&pool.length){const j=pool.splice(RI(0,pool.length-1),1)[0];out.push({n:j.n,sal:Math.round(base*j.m*S.region.sal*R(.96,1.04)/1000)*1000})}
  return out;
}
function offersCh(edu){
  const o=S.offers||[];
  return o.map(j=>[`${j.n}（月給 ${num(j.sal)}円）`,()=>{S.st='work';S.job=j.n;S.salary=j.sal;S.edu=edu;S.offers=null;delete S.flags.ronin;tl(j.n+'として就職');ad('happy',3);return `${j.n}として働き始めた。毎月${num(j.sal)}円の給料が入る。仕事の時間は自動で使われる。`}]);
}
function wed(c,h){ad('money',-c);ad('happy',h);S.spouse=S.partner;S.spouse.role='配偶者';S.spouse.inc=RI(14,28)*10000;S.partner=null;S.indep=1;tl(S.spouse.name+'と結婚した');return 'ふたりの新しい生活が始まった。家計はふたりで支え合う。'}
function divorce(){tl(S.spouse.name+'と離婚した');S.spouse=null;ad('happy',-12);ad('mental',-8);ad('money',-Math.round(Math.max(0,S.money)*.3),'loss');return '離婚が成立した。財産の一部を分けた。'}

// ===== 出来事 =====
const EV={};
function E(id,o){o.id=id;EV[id]=o}

E('birth',{t:'誕生',cat:'人生',w:0,text:()=>{
  const t=TIERS[S.tier],ps=parents().map(p=>`${p.role}：${p.name}（${p.trait}）`).join('\n');
  const sib=S.sibs.length?`\nきょうだい：${S.sibs.map(s=>s.role+'の'+pn(s)).join('、')}`:'\nひとりっ子';
  return `${S.y}年${S.m}月、${ctry()}の${S.region.n}（${S.region.type}）で、${S.name}は生まれた。\n\n暮らし向き：${t.l}（世帯年収 およそ${t.inc}万円）\n${ps}${S.fam.single?'\nひとり親の家庭':''}${sib}\n\n生まれつき得意なこと：${GENRES[topTal()].n}\n\n※${ctry()}の世帯年収の中央値はおよそ400万円（国民生活基礎調査を参考）`;
},ch:[['人生をはじめる',()=>{tl('誕生');return '人生が始まった。6歳までは自動で進み、ときどき出来事が起こる。'}]]});

// --- 幼少期 ---
E('b_word',{t:'はじめての言葉',cat:'成長',w:.2,once:1,when:()=>age()>=1&&age()<=2,
  text:()=>`${S.first}が初めてしゃべった言葉は「${pick(['まんま','わんわん','いや','ぶーぶー','どうが'])}」だった。`,
  ch:[['にっこり笑う',()=>{ad('happy',3);ad('tal.talk',3);relP(2);return '家族みんなが笑顔になった。'}]]});
E('b_fever',{t:'夜中の発熱',cat:'健康',w:.04,cd:8,when:()=>age()<6,
  text:()=>`夜中に熱を出した。${parentName()}が朝まで付きっきりで看病してくれた。`,
  ch:[['ぐっすり眠る',()=>{ad('health',-4);relP(3);return '数日で元気になった。'}]]});
E('b_hosp',{t:'入院',cat:'健康',w:.006,once:1,when:()=>age()<5,
  text:()=>'肺炎で1週間入院することになった。小さな体には大きな試練だ。',
  ch:[['がんばる',()=>{ad('health',-12);ad('mental',-3);relP(4);return '無事に退院できた。家族はほっと胸をなでおろした。'}]]});
E('b_draw',{t:'お絵かき',cat:'成長',w:.08,once:1,when:()=>age()>=3&&age()<=5,
  text:()=>'保育園で描いた家族の絵を、先生がみんなの前でほめてくれた。',
  ch:[['胸をはる',()=>{ad('happy',4);ad('tal.vlog',3);ad('tal.beauty',2);return '絵を描くのが好きになった。'}]]});
E('b_song',{t:'お遊戯会',cat:'成長',w:.1,once:1,when:()=>age()>=4&&age()<=5,
  text:()=>'お遊戯会で歌うことになった。客席では保護者がずらりとスマホを構えている。',
  ch:[['大きな声で歌う',()=>{ad('tal.music',5);ad('happy',3);return '一番声が大きかったと評判になった。'}],['恥ずかしくて口パク',()=>{ad('mental',-2);ad('tal.comedy',2);return '口パクがバレて会場がなごんだ。'}]]});
E('b_toy',{t:'おもちゃの取り合い',cat:'友達',w:.06,once:1,when:()=>age()>=3&&age()<=5,
  text:()=>'友達とおもちゃの取り合いになった。',
  ch:[['ゆずる',()=>{ad('social',3);ad('happy',-1);return '友達が「ありがとう」と言ってくれた。'}],['取り返す',()=>{ad('happy',2);ad('social',-2);return 'おもちゃは取り返したが、友達は泣いてしまった。'}]]});
E('b_screen',{t:'動画に夢中',cat:'成長',w:.06,once:1,when:()=>age()>=2&&age()<=5,
  text:()=>'タブレットの動画に夢中。気づけば何時間も見ている。',
  ch:[['もっと見る',()=>{ad('tal.game',3);ad('tal.talk',2);ad('health',-2);return '動画の口ぐせをまねするようになった。'}],['外で遊ぶ',()=>{ad('health',3);ad('social',2);return '公園で泥だらけになって遊んだ。'}]]});
E('b_kidch',{t:'家族チャンネル開設',cat:'家族チャンネル',w:.08,once:1,when:()=>age()>=1&&age()<=8&&!S.kc.on&&kidChLikely()&&anyParentAlive(),
  text:()=>`${parentName()}が「成長の記録を動画にしよう！」と言い出した。家族チャンネル「${S.last}家のにぎやか日記」がミルミルで始まった。`,
  ch:[['カメラに手をふる',()=>{startKidCh();ad('priv',-5);ad('happy',2);return '家族チャンネルが始まった。登録者が増えると家計が潤うが、プライバシーは減っていく。'}]]});

// --- 小学生 ---
E('m6',{t:'小学校入学',cat:'人生',w:0,
  text:()=>`ランドセルを背負って小学校に入学した。同じクラスに${S.friends.map(pn).join('と')}がいる。\n\nここから「行動」タブで自由時間の使い方を決められる。`,
  ch:[['元気にあいさつ',()=>{ad('social',5);return 'すぐにクラスに友達ができた。'}],['まずは様子を見る',()=>{ad('know',2);ad('mental',1);return 'クラスの雰囲気を落ち着いて観察した。'}]]});
E('e_lesson',{t:'習い事の相談',cat:'家族',w:.15,once:1,when:()=>age()>=6&&age()<=10&&!S.lesson,
  text:()=>`${parentName()}「何か習い事してみる？」${lessonOptions().length?'':'\n…と言いかけて、口をつぐんだ。今の家計では月謝を払う余裕がない。'}`,
  ch:()=>lessonOptions().map(k=>[`${LESSONS[k].n}（月謝 ${num(LESSONS[k].cost)}円）`,()=>{S.lesson=k;ad('happy',2);return `${LESSONS[k].n}を習うことになった。行動に「習い事」を入れると素質がよく伸びる。`}]).concat([['今はやらない',()=>'放課後は自由に過ごすことにした。']])});
E('e_test',{t:'テストの結果',cat:'学校',w:.05,cd:8,when:()=>S.st==='school',
  text:()=>S.p.know>60?'テストで100点を取った！':S.p.know>35?'テストは平均点くらいだった。':'テストの点がかなり悪かった…',
  ch:()=>[[S.p.know>60?'家族に見せる':'次はがんばる',()=>{if(S.p.know>60){ad('happy',4);relP(2);return 'たくさんほめられた。'}ad('know',2);ad('mental',-1);return '少しだけ勉強するようになった。'}]]});
E('e_dog',{t:'犬を飼いたい',cat:'家族',w:.04,once:1,when:()=>age()>=6&&age()<=12,
  text:()=>'近所の家で子犬が生まれた。「うちでも飼いたい！」',
  ch:[['必死にねだる',()=>{if(S.tier>=2&&chance(.6)){S.pet=1;tl('犬のコロを飼い始めた');ad('happy',10);return '根負けした家族が許してくれた。名前は「コロ」に決まった。'}ad('happy',-3);return '「うちは無理」と言われてしまった。'}],['がまんする',()=>{relP(3);ad('mental',1);return '家族が「えらいね」と頭をなでてくれた。'}]]});
E('e_bully',{t:'教室の空気',cat:'学校',w:.012,once:1,when:()=>age()>=8&&age()<=14,
  text:()=>'クラスで一人の子が無視されているのに気づいた。',
  ch:[['声をかける',()=>{ad('social',3);ad('rep',5);ad('mental',-2);return 'その子と仲良くなった。自分も少し浮いたけれど、後悔はない。'}],['先生に相談する',()=>{ad('social',1);ad('know',1);return '先生がクラスで話し合いの時間をつくってくれた。'}],['見ないふりをする',()=>{ad('mental',-5);return 'ずっとモヤモヤが残った。'}]]});
E('e_sports',{t:'運動会',cat:'学校',w:.25,cd:10,when:()=>S.st==='school'&&age()<=12&&(S.m===5||S.m===10),
  text:()=>'運動会のリレーの選手に選ばれた。',
  ch:[['全力で走る',()=>{if(chance(S.p.health/120)){ad('happy',5);ad('social',3);return '1位でゴール！ヒーローになった。'}ad('happy',-2);ad('tal.comedy',2);return '派手に転んだが、笑いをとって立ち上がった。'}],['応援にまわる',()=>{ad('social',2);ad('tal.talk',2);return '大きな声でクラスを盛り上げた。'}]]});
E('e_dream',{t:'将来の夢',cat:'学校',w:.15,once:1,when:()=>age()>=8&&age()<=11,
  text:()=>'作文の宿題「将来の夢」。クラスの半分が「配信者」と書いているらしい。',
  ch:[['配信者になりたい',()=>{S.flags.dream='creator';ad('tal.talk',3);return '先生は少し困った顔をした。'}],['先生になりたい',()=>{S.flags.dream='teacher';ad('know',3);ad('tal.study',2);return '先生がうれしそうに花丸をつけた。'}],['社長になりたい',()=>{S.flags.dream='ceo';ad('tal.comedy',1);ad('tal.study',1);ad('happy',2);return '「大きく出たね」と笑われた。'}]]});
E('e_game',{t:'友達の家でゲーム',cat:'友達',w:.04,cd:10,when:()=>age()>=7&&age()<=14&&S.friends.length,
  text:()=>`${pn(pick(S.friends))}の家で新作ゲームをやらせてもらった。`,
  ch:[['夢中でやりこむ',()=>{ad('tal.game',4);ad('happy',3);ad('know',-1);return '気づけば外は真っ暗。最高に楽しかった。'}],['実況のまねをする',()=>{ad('tal.game',2);ad('tal.talk',3);return '友達が大笑い。「お前、配信やれよ」と言われた。'}]]});
E('e_cook',{t:'はじめての料理',cat:'家族',w:.05,once:1,when:()=>age()>=8&&age()<=12,
  text:()=>'家族が留守の日、自分で卵焼きを作ってみることにした。',
  ch:[['挑戦する',()=>{if(chance(.6)){ad('tal.cook',6);ad('happy',3);return 'ふわふわの卵焼きができた！'}ad('tal.cook',3);ad('tal.comedy',2);return '黒こげになった。写真を家族に見せたら大ウケ。'}]]});
E('e_phone',{t:'スマホがほしい',cat:'家族',w:.08,once:1,when:()=>age()>=10&&age()<=12&&!S.flags.phone,
  text:()=>'クラスのほとんどがスマホを持っている。自分も欲しい。',
  ch:[['ねだる',()=>{if(S.tier>=1&&chance(.4+S.tier*.12)){S.flags.phone=1;ad('happy',5);ad('tal.vlog',2);return 'ついに自分のスマホを手に入れた！'}ad('happy',-3);return '「中学生になってから」と言われた。'}],['中学まで待つ',()=>{relP(3);return '家族との約束を守ることにした。'}]]});
E('e_clown',{t:'クラスの人気者',cat:'学校',w:.03,once:1,when:()=>age()>=7&&age()<=12,
  text:()=>'帰りの会でやったモノマネがクラスで大ウケした。',
  ch:[['もう一回やる',()=>{ad('tal.comedy',5);ad('social',3);return '次の日から「モノマネの人」と呼ばれるようになった。'}],['照れてやめる',()=>{ad('tal.comedy',2);return '先生だけがまだ笑っていた。'}]]});
E('e_read',{t:'読書感想文',cat:'学校',w:.03,cd:24,when:()=>S.st==='school'&&age()<=15,
  text:()=>'夏休みの読書感想文が市のコンクールで入選した。',
  ch:[['賞状を飾る',()=>{ad('know',4);ad('tal.study',3);ad('happy',3);return '文章を書くのが少し好きになった。'}]]});
E('e_move',{t:'転校',cat:'家族',w:.004,once:1,when:()=>age()>=6&&age()<=14&&anyParentAlive(),
  text:()=>`${parentName()}の仕事の都合で引っ越すことになった。`,
  ch:[['新しい町へ',()=>{const r=wpick(S.regions.filter(x=>x.n!==S.region.n));S.region=r;ad('social',-8);ad('mental',-3);tl(r.n+'へ引っ越した');return `${r.n}（${r.type}）に引っ越した。前の友達とはしばらく会えない。`}]]});

// --- 家族チャンネル ---
E('k_class',{t:'「動画見たよ」',cat:'家族チャンネル',w:.08,once:1,when:()=>S.kc.on&&age()>=7&&age()<=12,
  text:()=>'クラスメイトに「家族チャンネルの子だよね？昨日の動画見たよ」と言われた。',
  ch:[['ちょっとうれしい',()=>{ad('happy',3);ad('priv',-5);ad('tal.talk',2);return 'みんなに囲まれて、少し有名人の気分。'}],['恥ずかしい…',()=>{ad('mental',-4);ad('priv',-5);return 'お風呂上がりの動画のことを言われて、顔が真っ赤になった。'}]]});
E('k_trip',{t:'動画で家族旅行',cat:'家族チャンネル',w:.03,cd:12,when:()=>S.kc.on&&S.kc.f>=5000,
  text:()=>'チャンネルの収益で家族旅行に行くことになった。ただし旅行中もずっと撮影だ。',
  ch:[['カメラの前で楽しむ',()=>{ad('happy',4);ad('priv',-3);S.kc.f+=RI(300,2000);return '旅行の動画はよく再生された。'}],['撮らないでほしいと言う',()=>{ad('happy',2);ad('priv',3);relKc(-3);return '少しだけ撮影を減らしてもらえた。'}]]});
E('k_refuse',{t:'撮りたくない日',cat:'家族チャンネル',w:.05,once:1,when:()=>S.kc.on&&age()>=8&&age()<=12,
  text:()=>`熱っぽくて元気が出ない日。${S.kc.byName}は「今日の分を撮らないと」とカメラを向けてくる。`,
  ch:[['「今日はやめて」と言う',()=>{relKc(-4);ad('priv',5);ad('mental',2);return '少し気まずくなったが、休むことができた。'}],['がまんして笑う',()=>{ad('mental',-5);S.kc.f+=RI(500,3000);return '「健気」とコメント欄が盛り上がった。'}]]});
E('k_money',{t:'子どもチャンネルのお金',cat:'ニュース',w:.04,once:1,when:()=>S.kc.on&&S.kc.f>=20000,
  text:()=>'ニュース：「人気の子どもチャンネル、収益は誰のもの？ 子ども本人に分けるべきとの声」。家族で話題になった。',
  ch:[['自分の分を貯めてほしい',()=>{if(chance(.5)){S.kc.share=1;ad('happy',3);return '収益の一部を自分のために貯めてもらえることになった。'}relKc(-2);return '「家族のためのお金だから」と言われた。'}],['よくわからない',()=>'まだお金のことはよくわからない。']]});

// --- 中高生 ---
E('m13',{t:'SNSデビュー',cat:'人生',w:0,
  text:()=>`13歳になり、自分のSNSアカウントを作れるようになった。これまでに貯めた素質がスキルに変わる。\n\nどこから始める？（あとで他のSNSも始められる）`,
  ch:()=>Object.entries(SNS).map(([k,s])=>[`${s.n}（${s.d}）`,()=>{openSns(k);S.main=k;convertTalent();S.genre=topTal();tl(s.n+'でSNSデビュー');return `${s.n}のアカウントを作った。ジャンルは「${GENRES[S.genre].n}」にした（SNSタブで変更できる）。\n同じ学年のライバル配信者「${S.rival.name}」の存在が気になる。`}])});
E('m13k',{t:'家族チャンネルのこれから',cat:'家族チャンネル',w:0,when:()=>S.kc.on,
  text:()=>`家族チャンネルの登録者は${num(S.kc.f)}人。${S.kc.byName}「これからは自分でやってみる？」`,
  ch:[['チャンネルを引き継ぐ',()=>{const g=Math.round(S.kc.f*.5);openSns('milu');S.f.milu+=g;S.kc.on=0;S.kc.was=1;ad('priv',-5);tl('家族チャンネルを引き継いだ');return `ミルミルに${num(g)}人のフォロワーを引き継いだ。昔の動画もそのまま残る。`}],
      ['もうやめてもらう',()=>{S.kc.on=0;S.kc.was=1;ad('priv',5);ad('happy',2);return '新しい動画はもう撮られない。昔の動画はネットに残ったままだ。'}],
      ['全部消してもらう',()=>{S.kc.on=0;S.kc.was=0;ad('priv',20);ad('happy',4);relKc(-6);return `${S.kc.byName}は残念そうだったが、動画はすべて消された。`}]]});
E('t_club',{t:'部活選び',cat:'学校',w:.3,once:1,when:()=>age()===13,
  text:()=>'中学校の部活を決める時期だ。',
  ch:[['運動部',()=>{ad('health',6);ad('social',4);ad('looks',2);return '毎日へとへとだけど、体力がついた。'}],['放送部',()=>{ad('talk',6);ad('tal.talk',4);return 'お昼の放送で話す楽しさを知った。'}],['美術・写真部',()=>{ad('edit',5);ad('tal.vlog',4);return '構図や色の感覚が身についた。'}],['帰宅部',()=>{ad('happy',2);ad('plan',3);return '放課後はひたすら動画の研究。'}]]});
E('m15',{t:'高校受験',cat:'人生',w:0,text:()=>`高校受験の季節。今の知識は${Math.round(S.p.know)}。`,
  ch:[['進学校をめざす',()=>{if(chance(clamp((S.p.know-20)/60,.05,.95))){S.flags.hs='top';ad('know',5);ad('happy',4);tl('進学校に合格');return '進学校に合格した！'}S.flags.hs='mid';ad('mental',-5);tl('第二志望の高校に進学');return '不合格…。第二志望の高校に進んだ。'}],
      ['地元の高校',()=>{S.flags.hs='mid';ad('social',3);return '仲のいい友達と同じ高校に進んだ。'}],
      ['通信制高校',()=>{S.flags.hs='online';ad('plan',2);return '自分のペースで学べる通信制を選んだ。自由な時間が1枠増える。'}]]});
E('t_crush',{t:'好きな人',cat:'恋愛',w:.025,once:1,when:()=>age()>=14&&age()<=18,
  text:()=>'同じクラスの子のことが気になって仕方ない。',
  ch:[['告白する',()=>{if(chance((S.sk.looks+S.p.social)/180+.15)){ad('happy',10);tl('初めての恋人ができた');return 'OKをもらえた！毎日がきらきらしている。'}ad('happy',-6);ad('mental',-4);return '「ごめんなさい」と言われた。しばらく立ち直れない。'}],['そっと見守る',()=>{ad('tal.music',2);return '気持ちは胸にしまって、ラブソングばかり聴いた。'}]]});
E('t_classviral',{t:'同級生がバズった',cat:'SNS',w:.03,once:1,when:()=>age()>=13&&age()<=18&&S.snsOpen,
  text:()=>'クラスの子が投稿したダンス動画が100万回再生を超えた。教室はその話題で持ちきりだ。',
  ch:[['くやしい…研究する',()=>{ad('plan',4);ad('mental',-3);return '伸びた理由をノートにまとめた。'}],['素直に祝う',()=>{ad('social',4);ad('happy',1);return '「今度一緒に撮ろう」と誘われた。'}]]});
E('t_scamdm',{t:'事務所からのDM',cat:'SNS',w:.03,once:1,when:()=>S.snsOpen&&totalF()>=100&&age()<25,
  text:()=>'「あなたには才能があります。弊社に所属しませんか？登録料として3万円が必要です」',
  ch:[['断る',()=>{ad('know',2);return '調べると、同じ文面のDMが大量に送られていた。'}],['払ってみる',()=>{ad('money',-30000);ad('happy',-6);ad('know',3);tl('事務所詐欺にあった');return '入金したとたん、相手と連絡がつかなくなった。高い授業料だった。'}]]});
E('t_school',{t:'学校にバレた',cat:'学校',w:.02,once:1,when:()=>S.st==='school'&&totalF()>=500,
  text:()=>'担任に呼び出された。「SNSで顔を出しているのは君だね？」',
  ch:[['正直に話す',()=>{ad('rep',3);ad('know',1);return '個人情報の守り方を一緒に考えてくれた。'}],['ごまかす',()=>{if(chance(.5)){ad('rep',-4);ad('mental',-3);return 'すぐにバレて、親まで呼ばれた。'}return 'なんとかごまかせた…たぶん。'}]]});
E('t_worry',{t:'親の心配',cat:'家族',w:.03,cd:12,when:()=>age()>=13&&age()<18&&anyParentAlive()&&S.plan.filter(x=>x==='post').length>=2,
  text:()=>`${parentName()}「動画もいいけど、勉強は大丈夫なの？」`,
  ch:[['勉強もがんばる',()=>{ad('know',3);ad('mental',-2);relP(2);return '少しだけ勉強時間を増やした。'}],['本気で配信をやりたい',()=>{relP(-4);ad('plan',2);ad('happy',1);return '「…好きにしなさい」と言われた。'}]]});
E('t_allnight',{t:'徹夜の編集',cat:'SNS',w:.03,cd:6,when:()=>S.snsOpen&&age()<45,
  text:()=>'気づけば夜中の3時。編集がまだ半分しか終わっていない。',
  ch:[['寝る',()=>{ad('health',2);return '投稿は1日遅れたが、体調は万全だ。'}],['最後までやる',()=>{ad('edit',4);ad('health',-5);ad('mental',-2);return '朝日とともに投稿完了。手応えはある。'}]]});
E('t_fest',{t:'文化祭',cat:'学校',w:.2,once:1,when:()=>age()>=15&&age()<=17&&S.m>=9&&S.m<=11,
  text:()=>'文化祭のステージに出られることになった。',
  ch:[['漫才をする',()=>{ad('tal.comedy',6);ad('talk',3);ad('social',4);return '体育館が笑いに包まれた。'}],['歌う',()=>{ad('tal.music',6);ad('looks',2);ad('social',3);return '終わったあと、知らない子から声をかけられた。'}],['裏方で演出する',()=>{ad('plan',6);ad('edit',2);return '照明と音響を完璧に仕切った。'}]]});
E('t_part',{t:'アルバイト解禁',cat:'お金',w:.3,once:1,when:()=>age()>=16&&S.st==='school',
  text:()=>'16歳になり、アルバイトができるようになった。行動に「アルバイト」が増えた。',
  ch:[['機材代を稼ぐぞ',()=>'お金を稼ぐ手段が増えた。']]});
E('t_anti',{t:'アンチコメント',cat:'SNS',w:.035,cd:6,when:()=>totalF()>=1000,
  text:()=>`「つまらない」「${pick(['声が無理','前のほうがよかった','オワコン','がんばってる感が寒い'])}」…しつこく書きこむアカウントがいる。`,
  ch:[['無視する',()=>{ad('mental',-2);return '気にしないふりをした。'}],['ブロックする',()=>{ad('mental',1);return 'すっきりした。'}],['言い返す',()=>{if(chance(.4)){ad('f',RI(50,500));ad('rep',-2);return '言い返し方がおもしろいと話題になった。'}S.q.push('flame');return 'やりとりが拡散されてしまった…'}]]});
E('m18',{t:'進路の決断',cat:'人生',w:0,
  text:()=>`高校卒業。${ctry()}ではおよそ6割が大学に進学する（学校基本調査を参考）。\n${S.tier>=3?'学費は家族が出してくれそうだ。':'大学に行くなら奨学金（あとで返すお金）が必要になる。'}\n今のフォロワーは${num(totalF())}人、知識は${Math.round(S.p.know)}。`,
  ch:[['大学に進学する',()=>{if(!chance(clamp((S.p.know+15)/90,.1,.97))){ad('mental',-6);S.q.push('m18b');return '不合格だった…'}S.st='univ';S.uniEnd=S.am+48;if(S.tier<3)S.debt+=2400000;tl('大学に進学');ad('happy',5);return S.tier<3?'大学生になった。卒業後は奨学金240万円を毎月少しずつ返していく。':'大学生になった！'}],
      ['就職する',()=>{S.offers=makeOffers('高卒');S.q.push('jobs_hs');return '就職活動を始めた。'}],
      ['専業クリエイターになる',()=>{S.st='creator';tl('高卒で専業クリエイターに');ad('happy',3);relP(-5);return '家族は心配そうだが、決めたことだ。収入はSNSだけ。家に月3万円を入れる。'}],
      ['フリーターになる',()=>{S.st='free';tl('フリーターになった');return 'アルバイトをしながら、やりたいことを探す。'}]]});
E('m18b',{t:'浪人か、就職か',cat:'人生',w:0,text:()=>'大学に落ちてしまった。これからどうする？',
  ch:[['もう1年がんばる（浪人）',()=>{S.st='free';S.flags.ronin=S.am+12;return '1年間、予備校に通う。'}],['就職する',()=>{S.offers=makeOffers('高卒');S.q.push('jobs_hs');return '気持ちを切り替えて就職活動を始めた。'}],['専業クリエイターになる',()=>{S.st='creator';tl('専業クリエイターに');return '配信一本で生きていくことにした。'}]]});
E('ronin2',{t:'再受験',cat:'人生',w:0,text:()=>'浪人生活の1年が終わり、もう一度受験の日がきた。',
  ch:[['受ける',()=>{delete S.flags.ronin;if(chance(clamp((S.p.know+30)/90,.2,.97))){S.st='univ';S.uniEnd=S.am+48;if(S.tier<3)S.debt+=2400000;tl('浪人して大学に進学');return '合格！春から大学生だ。'}S.offers=makeOffers('高卒');S.q.push('jobs_hs');return '今年もだめだった。就職することにした。'}]]});
E('jobs_hs',{t:'就職先を選ぶ',cat:'仕事',w:0,text:()=>'いくつかの会社から内定をもらえた。どこで働く？\n（初任給は賃金構造基本統計調査を参考）',ch:()=>offersCh('高卒')});
E('jobs_uni',{t:'就職先を選ぶ',cat:'仕事',w:0,text:()=>'いくつかの会社から内定をもらえた。どこで働く？\n（初任給は賃金構造基本統計調査を参考）',ch:()=>offersCh('大卒')});
E('m22',{t:'大学卒業',cat:'人生',w:0,text:()=>`大学を卒業する。フォロワーは${num(totalF())}人。`,
  ch:[['就職する',()=>{S.edu='大卒';S.offers=makeOffers('大卒');S.q.push('jobs_uni');return '就職活動を始めた。'}],['専業クリエイターになる',()=>{S.edu='大卒';S.st='creator';tl('大卒で専業クリエイターに');return '内定を断って、配信の道へ進む。'}]]});
E('jobhunt',{t:'就職活動',cat:'仕事',w:0,text:()=>age()>=50?'年齢的に厳しい戦いになりそうだが、求人に応募してみた。':'求人サイトに登録して、いくつか面接を受けた。',
  ch:()=>{if(!S.offers){S.offers=chance(clamp(.9-Math.max(0,age()-35)*.025,.2,.9))?makeOffers(S.edu||'高卒',true):[]}
    if(!S.offers.length)return [['あきらめる',()=>{S.offers=null;ad('mental',-4);return '内定はもらえなかった。'}]];
    return offersCh(S.edu||'高卒').concat([['やっぱりやめる',()=>{S.offers=null;return '今の生活を続けることにした。'}]])}});

// --- 仕事・大人 ---
E('w_over',{t:'残業続き',cat:'仕事',w:.04,cd:6,when:()=>S.st==='work',
  text:()=>'繁忙期で毎晩終電。上司「今月だけ頼む」',
  ch:[['引き受ける',()=>{ad('money',Math.round(S.salary*.25),'job');ad('health',-5);ad('mental',-5);return '残業代は入ったが、体はボロボロだ。'}],['定時で帰る',()=>{ad('mental',3);ad('rep',-1);return '少し冷たい視線を感じたが、心は守れた。'}]]});
E('w_promo',{t:'昇進の話',cat:'仕事',w:.02,cd:24,when:()=>S.st==='work'&&S.p.know>=45&&age()>=27,
  text:()=>'上司から昇進の打診があった。責任は重くなるが、給料も上がる。',
  ch:[['受ける',()=>{S.salary=Math.round(S.salary*1.12);ad('mental',-3);ad('happy',3);tl('昇進した');return `月給が${num(S.salary)}円になった。`}],['今のままでいい',()=>{ad('mental',2);return '自分の時間を大事にすることにした。'}]]});
E('w_side',{t:'副業がバレた',cat:'仕事',w:.03,once:1,when:()=>S.st==='work'&&totalF()>=3000,
  text:()=>'人事部「SNSで活動しているのは君かな？ うちは副業に届け出が必要だよ」',
  ch:[['届け出をする',()=>{if(chance(.7)){ad('rep',2);return '正式に許可が出た。堂々と続けられる。'}S.flags.noSide=1;ad('mental',-4);return '許可が下りなかった。配信は控えるように言われた。'}],['会社を辞めて専業に',()=>{S.st='creator';S.job=null;S.salary=0;tl('会社を辞めて専業クリエイターに');ad('happy',4);return '退職届を出した。もう後戻りはできない。'}]]});
E('w_fired',{t:'就業規則違反',cat:'仕事',w:0,text:()=>'禁止されていた配信を続けていたことが会社に知られた。',
  ch:[['処分を受け入れる',()=>{S.st='free';S.job=null;S.salary=0;delete S.flags.noSide;ad('rep',-6);ad('mental',-8);tl('会社をクビになった');return '会社を辞めることになった。'}]]});
E('w_layoff',{t:'リストラ',cat:'仕事',w:.004,cd:60,when:()=>S.st==='work'&&age()>=30&&age()<60,
  text:()=>'会社の業績が悪化し、希望退職の対象になってしまった。',
  ch:[['転職活動をする',()=>{ad('money',S.salary*3,'job');S.st='free';S.job=null;S.salary=0;ad('mental',-8);S.offers=null;S.q.push('jobhunt');tl('リストラされた');return '退職金が少し出た。'}],['これを機に専業クリエイター',()=>{ad('money',S.salary*3,'job');S.st='creator';S.job=null;S.salary=0;tl('リストラを機に専業クリエイターに');return '退職金を元手に、配信に本腰を入れる。'}]]});
E('tax',{t:'確定申告',cat:'お金',w:0,text:()=>`去年の配信・案件の収入は${yen(S.taxBase)}だった。一定以上の所得があると、自分で申告して税金を納める必要がある。`,
  ch:[['きちんと申告する',()=>{const t=Math.round(S.taxBase*.15);ad('money',-t,'tax');ad('know',2);S.flags.taxAuto=1;return `税金${yen(t)}を納めた。来年からは自動で申告する。`}],['申告しない',()=>{S.flags.evade=(S.flags.evade||0)+S.taxBase;return 'バレなければ大丈夫…だろうか。'}]]});
E('audit',{t:'税務調査',cat:'お金',w:.04,cd:24,when:()=>S.flags.evade>0,text:()=>'税務署から「お話をうかがいたい」と連絡がきた。',
  ch:[['素直に認める',()=>{const t=Math.round(S.flags.evade*.15*1.4);ad('money',-t,'tax');ad('rep',-5);S.flags.evade=0;tl('追徴課税を受けた');return `追徴課税として${yen(t)}を払った。ネットニュースにもなってしまった。`}]]});
E('a_move',{t:'一人暮らし',cat:'人生',w:.05,once:1,when:()=>age()>=18&&!S.indep&&['work','creator','free'].includes(S.st)&&S.money>=200000,
  text:()=>`貯金が${yen(S.money)}になった。家を出て一人暮らしをする？\n（${S.region.n}の家賃と生活費は月およそ${num(livingCost())}円）`,
  ch:[['家を出る',()=>{S.indep=1;ad('money',-150000,'living');ad('happy',6);ad('priv',5);tl('一人暮らしを始めた');return '初期費用を払って、自分だけの部屋を手に入れた。'}],['実家に残る',()=>{relP(2);return '家族との時間を大切にすることにした。'}]]});
E('a_reunion',{t:'同窓会',cat:'友達',w:.012,cd:60,when:()=>age()>=25&&age()<=60,
  text:()=>`同窓会の案内が届いた。${S.friends.length?pn(S.friends[0])+'も来るらしい。':''}`,
  ch:[['行く',()=>{ad('social',5);ad('happy',3);ad('money',-8000);return totalF()>=10000?'「動画見てるよ！」と囲まれた。':'昔話で盛り上がった。'}],['行かない',()=>{ad('mental',1);return '家で静かに過ごした。'}]]});
E('a_invest',{t:'積立投資',cat:'お金',w:.02,once:1,when:()=>age()>=20&&S.money>=500000,
  text:()=>'友人「貯金があるなら、少しずつ投資に回すのもアリだよ。もちろん元本割れのリスクはあるけど」',
  ch:[['半分を投資に回す',()=>{const v=Math.round(S.money*.5);S.money-=v;S.inv+=v;return `${yen(v)}を投資に回した。毎月値動きする（ステータスで確認できる）。`}],['現金のままにする',()=>'慎重にいくことにした。']]});
E('a_scam',{t:'絶対もうかる話',cat:'お金',w:.015,once:1,when:()=>S.money>=1000000,
  text:()=>'SNSで知り合った人から「新しいコインで資産が10倍になる」と誘われた。',
  ch:[['断る',()=>{ad('know',2);return '数か月後、そのコインは詐欺だったとニュースで報じられた。'}],['乗ってみる',()=>{const v=Math.round(S.money*.5);ad('money',-v,'loss');ad('happy',-10);ad('mental',-6);tl('投資詐欺で大損した');return `${yen(v)}が消えた。`}]]});
E('poor',{t:'お金が足りない',cat:'お金',w:0,text:()=>`残高が${yen(S.money)}。このままでは生活できない。`,
  ch:()=>{const a=[];if(age()>=16)a.push(['アルバイトを増やす',()=>{S.plan=S.plan.map((x,i)=>i<2?'part':x);S.auto=0;return '行動の2枠をアルバイトにした。'}]);
    if(anyParentAlive())a.push(['家族に頼る',()=>{ad('money',200000);relP(-5);ad('mental',-3);return '20万円を借りた。情けないけれど、ありがたい。'}]);
    a.push(['消費者金融で借りる',()=>{ad('money',300000);S.debt+=360000;ad('mental',-5);return '30万円を借りた。利息がついて、返すのは36万円になる。'}]);return a}});

// --- SNS ---
E('s100',{t:'フォロワー100人',cat:'SNS',w:1,once:1,when:()=>totalF()>=100,text:()=>'フォロワーが100人を超えた！ 知らない人が自分の投稿を見てくれている。',ch:[['やった！',()=>{ad('happy',5);return 'スクショを撮って保存した。'}]]});
E('s1k',{t:'収益化の条件をクリア',cat:'SNS',w:1,once:1,when:()=>S.f.milu>=1000,text:()=>'ミルミルのフォロワーが1000人を超え、広告の収益を受け取れるようになった。',ch:[['最初の収益を待つ',()=>{ad('happy',8);tl('ミルミルで収益化');return '…初月の収益は缶ジュース数本分だった。それでもうれしい。'}]]});
E('s10k',{t:'1万人突破',cat:'SNS',w:1,once:1,when:()=>totalF()>=10000,text:()=>'フォロワーが1万人を超えた。企業からPR案件の連絡が届くようになるかもしれない。',ch:[['お祝い配信をする',()=>{ad('happy',8);ad('f',RI(100,800));tl('フォロワー1万人');return 'コメント欄が「おめでとう」で埋まった。'}]]});
E('s100k',{t:'10万人突破',cat:'SNS',w:1,once:1,when:()=>totalF()>=100000,text:()=>'フォロワーが10万人を超えた！ 運営から記念の楯が届いた。',ch:[['楯を飾る',()=>{ad('happy',15);ad('rep',3);tl('フォロワー10万人');return '部屋で一番目立つ場所に飾った。'}]]});
E('s1m',{t:'100万人突破',cat:'SNS',w:1,once:1,when:()=>totalF()>=1000000,text:()=>`フォロワーが100万人を超えた。${ctry()}で知らない人はいない存在になった。`,ch:[['ここまで来た',()=>{ad('happy',20);tl('フォロワー100万人');return '街を歩くと声をかけられるようになった。'}]]});
E('s_deal',{t:'PR案件',cat:'SNS',w:.07,cd:4,when:()=>totalF()>=10000&&age()>=15,
  text:()=>{const d=Object.assign({},pick(DEALS));d.pay=Math.max(5000,Math.round(totalF()*R(1.2,2.5)*d.m*(S.p.rep/60)*Math.max(.2,S.cty.inc)*(has('brand')?1.3:1)*(1+stN('manager')*.2*staffMul())/1000)*1000);S.tmp=d;return `「${d.n}」のPR案件の依頼が届いた。報酬は${yen(d.pay)}。\n（PRであることは投稿にきちんと書く）`},
  ch:[['受ける',()=>{const d=S.tmp;ad('money',d.pay,'deal');S.stats.deals++;if(d.risk>=3){ad('rep',-8);if(chance(.35))S.q.push('flame');return '報酬は入ったが、「本当に効くの？」というコメントが目立つ。'}if(d.good){ad('rep',4);return '地元の人たちから感謝された。'}ad('rep',-d.risk*1.5);return '丁寧に紹介して、無事に案件を終えた。'}],['断る',()=>{ad('rep',1);return '本当にいいと思うものだけ紹介することにした。'}]]});
E('s_stema',{t:'「PRと書かないで」',cat:'SNS',w:.025,cd:24,when:()=>totalF()>=10000,
  text:()=>`ある企業から「広告だと書かずに、自然にすすめてほしい。報酬は2倍出す」と持ちかけられた。\n${ctry()}ではステルスマーケティング（隠れた広告）は法律で禁止されている。`,
  ch:[['きっぱり断る',()=>{ad('rep',4);S.flags.stemaNo=1;return '「法律違反になるのでお受けできません」と返した。'}],['受ける',()=>{ad('money',Math.round(totalF()*3),'deal');if(chance(.6))S.q.push('s_stema_out');return '大金が振り込まれた。胸の奥がざわつく。'}]]});
E('s_stema_out',{t:'ステマ発覚',cat:'SNS',w:0,text:()=>'ステマだったことが暴露された。ニュースでも取り上げられている。',
  ch:[['謝罪する',()=>{ad('rep',-20);ad('f',-Math.round(totalF()*.2));ad('mental',-10);S.stats.flames++;tl('ステマが発覚して大炎上');return 'フォロワーの2割が去っていった。'}]]});
E('s_collab',{t:'コラボの誘い',cat:'SNS',w:.03,cd:8,when:()=>S.rival&&S.snsOpen&&totalF()>=2000,
  text:()=>`ライバル配信者「${S.rival.name}」（フォロワー${num(S.rival.f)}人）からコラボの誘いがきた。`,
  ch:[['コラボする',()=>{const g=Math.round(Math.min(S.rival.f,totalF()*3)*R(.02,.08)*(has('collab')?1.5:1));ad('f',g);ad('social',3);rel(S.rival,10);S.rival.f+=Math.round(totalF()*.04);return `お互いのファンが行き来して、フォロワーが${num(g)}人増えた。`}],['断る',()=>{rel(S.rival,-5);return '「また今度ね」と返した。'}]]});
E('s_trend',{t:'流行の波',cat:'SNS',w:.035,cd:6,when:()=>S.snsOpen&&S.trend.g!==S.genre,
  text:()=>`今、SNSでは「${GENRES[S.trend.g].n}」が大流行している。`,
  ch:[['ジャンルを乗り換える',()=>{S.genre=S.trend.g;ad('rep',-1);return `「${GENRES[S.genre].n}」に挑戦する。素質が低いと投稿の質は下がるので注意。`}],['今のジャンルを貫く',()=>{ad('rep',2);ad('mental',1);return 'ブレない姿勢を評価する声もある。'}]]});
E('s_algo',{t:'おすすめの仕組みが変わった',cat:'SNS',w:.02,cd:18,when:()=>totalF()>=1000,
  text:()=>`${SNS[S.main].n}のおすすめの仕組みが変わったらしい。再生数が急に落ちた。`,
  ch:[['しばらく様子を見る',()=>{S.algo=3;ad('mental',-3);return '3か月ほど伸びにくい時期が続きそうだ。'}],['新しい傾向を研究する',()=>{S.algo=1;ad('plan',4);ad('mental',-2);return '傾向をつかんで、早めに立て直した。'}]]});
E('s_offkai',{t:'オフ会',cat:'SNS',w:.02,cd:12,when:()=>totalF()>=20000&&age()>=18,
  text:()=>'ファンから「オフ会を開いてほしい」という声が増えている。',
  ch:[['開く',()=>{ad('money',-100000);ad('happy',8);ad('social',5);ad('f',RI(200,1500));if(chance(.15)){ad('priv',-15);return '大成功！…ただ、帰り道をつけてくる人がいた気がする。'}return '直接「ありがとう」を伝えられて、胸が熱くなった。'}],['開かない',()=>'まだ顔を合わせるのは怖い。']]});
E('s_doxx',{t:'住所特定',cat:'SNS',w:.012,once:1,when:()=>totalF()>=50000&&S.p.priv<70,
  text:()=>'窓から見える景色から、家の場所を特定したという書きこみが出回った。',
  ch:[['引っ越す',()=>{ad('money',-400000);ad('priv',20);ad('mental',3);return '急いで引っ越した。背景に映るものには気をつけよう。'}],['警察に相談する',()=>{ad('mental',-4);ad('priv',8);return 'パトロールを増やしてもらえることになった。'}]]});
E('s_award',{t:'クリエイターアワード',cat:'SNS',w:.012,cd:24,when:()=>totalF()>=100000&&S.p.rep>=60,
  text:()=>`「${ctry()}クリエイターアワード」にノミネートされた。`,
  ch:[['授賞式に出る',()=>{if(chance(.35)){ad('happy',12);ad('rep',8);ad('f',Math.round(totalF()*.05));tl('クリエイターアワードを受賞');return '大賞を受賞した！'}ad('happy',3);return '受賞は逃したが、華やかな夜だった。'}]]});
E('s_copy',{t:'企画をパクられた',cat:'SNS',w:.02,cd:12,when:()=>totalF()>=5000,
  text:()=>'自分が考えた企画とそっくりの動画が、大物配信者のチャンネルで大ヒットしている。',
  ch:[['証拠を並べて指摘する',()=>{if(chance(.5)){ad('rep',5);ad('f',RI(300,3000));return '多くの人が味方してくれた。'}ad('rep',-4);S.q.push('flame');return '「言いがかりだ」と相手のファンが押し寄せてきた。'}],['気にしない',()=>{ad('mental',-2);ad('plan',2);return '次はもっとおもしろい企画を出してやる。'}]]});
E('s_oldpost',{t:'昔の投稿',cat:'SNS',w:.015,once:1,when:()=>totalF()>=20000&&age()>=20,
  text:()=>'10代のころの痛い投稿が掘り起こされ、スクショが拡散されている。',
  ch:[['素直に謝る',()=>{ad('rep',-2);ad('mental',-3);return '「若気の至り」で済んだ。'}],['ネタにして笑い飛ばす',()=>{if(S.sk.talk>=50){ad('f',RI(500,5000));ad('rep',3);return '自虐配信が大ウケした。'}S.q.push('flame');return 'すべってしまった…'}],['黙って消す',()=>{ad('rep',-4);return '「消して逃げた」と言われた。'}]]});
E('s_kcdig',{t:'子ども時代の動画',cat:'家族チャンネル',w:.03,once:1,when:()=>S.kc.was&&totalF()>=10000,
  text:()=>'家族チャンネル時代の、泣いている幼い自分の動画が切り抜かれて拡散されている。',
  ch:[['笑いに変える',()=>{ad('f',RI(300,3000));ad('mental',-3);ad('priv',-5);return '「強い」と好意的に受け止められた。'}],['削除を申請する',()=>{ad('priv',6);ad('mental',-2);return '一部は消せたが、すべては追いきれなかった。'}]]});
E('s_fan',{t:'ファンレター',cat:'SNS',w:.03,cd:6,when:()=>totalF()>=3000,
  text:()=>'「つらい時期に、あなたの動画に救われました」という長いメッセージが届いた。',
  ch:[['大切に読む',()=>{ad('happy',6);ad('mental',6);return '続けてきてよかった、と心から思った。'}]]});
E('s_short',{t:'短い動画のブーム',cat:'SNS',w:.03,once:1,when:()=>S.snsOpen&&!S.open.patto,
  text:()=>'短い縦動画のSNS「パッと」が爆発的に流行っている。',
  ch:[['パッとも始める',()=>{openSns('patto');return 'パッとのアカウントを作った。SNSタブでメインを切り替えられる。'}],['今のままでいく',()=>'流行に振り回されないことにした。']]});
E('s_down',{t:'SNSの大移動',cat:'ニュース',w:.01,cd:48,when:()=>S.open.tsubu,
  text:()=>'ツブヤの運営方針が急に変わり、ユーザーの大移動が起きている。',
  ch:[['他のSNSに力を入れる',()=>{const m=Math.round(S.f.tsubu*.25);S.f.tsubu-=m;const to=S.open.milu?'milu':'patto';openSns(to);S.f[to]+=Math.round(m*.5);return `ツブヤのフォロワーの一部が${SNS[to].n}についてきてくれた。`}],['様子を見る',()=>{S.f.tsubu=Math.round(S.f.tsubu*.88);return 'ツブヤのフォロワーが1割ほど減った。'}]]});
E('s_tip',{t:'投げ銭ライブ',cat:'SNS',w:.03,cd:4,when:()=>S.snsOpen&&totalF()>=5000&&age()>=18,
  text:()=>'ライブ配信で投げ銭がたくさん飛んできた。',
  ch:[['お礼を言う',()=>{const v=Math.round(totalF()*R(.3,1.2));ad('money',v,'tip');ad('happy',3);return `投げ銭で${yen(v)}の収入になった。`}]]});
E('flame',{t:'炎上',cat:'SNS',w:0,
  text:()=>`${pick(['投稿の一言が切り取られて','過去の発言が掘り返されて','企画の内容が不謹慎だと言われて','コラボ相手への態度が悪いと言われて'])}、${SNS[S.main].n}で炎上している。通知が鳴りやまない。`,
  ch:[['すぐに謝罪する',()=>{S.stats.flames++;ad('f',-Math.round(totalF()*.06*fdm()));ad('rep',-4);ad('mental',-8);return '謝罪の早さを評価する声もあり、数日で落ち着いた。'}],
      ['何も言わずに待つ',()=>{S.stats.flames++;ad('f',-Math.round(totalF()*.1*fdm()));ad('rep',-8);ad('mental',-5);return '1週間後、話題は別の炎上に移っていった。'}],
      ['反論する',()=>{S.stats.flames++;if(chance(.35)){ad('rep',6);ad('f',Math.round(totalF()*.08));return '筋の通った反論に「むしろファンになった」の声。'}ad('rep',-15);ad('f',-Math.round(totalF()*.22*fdm()));ad('mental',-12);tl('大炎上した');return '火に油を注いでしまった。大炎上だ。'}]]});

// --- 恋愛・家族 ---
E('l_meet',{t:'出会い',cat:'恋愛',w:.03,cd:12,when:()=>age()>=18&&age()<=50&&!S.partner&&!S.spouse,
  text:()=>{S.tmp=mkNpc('恋人');return `${pick(['友人の紹介で','職場で','SNSのDMがきっかけで','行きつけのカフェで'])}、${S.tmp.name}（${S.tmp.trait}）と知り合った。`},
  ch:[['連絡先を交換する',()=>{S.partner=S.tmp;S.partner.rel=45;S.tmp=null;ad('happy',5);tl(S.partner.name+'と付き合い始めた');return '何度か会ううちに付き合うことになった。行動に「デート」が増えた。'}],['今はひとりでいい',()=>{S.tmp=null;return '自分のことに集中することにした。'}]]});
E('l_fight',{t:'ケンカ',cat:'恋愛',w:.03,cd:8,when:()=>!!lover(),
  text:()=>`${pn(lover())}と${pick(['配信ばかりで会う時間がないこと','お金の使い方','家事の分担','SNSにふたりの写真を載せたこと'])}でケンカになった。`,
  ch:[['素直に謝る',()=>{rel(lover(),4);ad('mental',-1);return '仲直りできた。'}],['とことん話し合う',()=>{if(chance(.6)){rel(lover(),8);return 'お互いの気持ちがわかって、前より仲良くなった。'}rel(lover(),-6);return '話し合いは平行線だった。'}],['距離を置く',()=>{rel(lover(),-8);ad('mental',2);return 'しばらく連絡をとらなかった。'}]]});
E('l_propose',{t:'プロポーズ',cat:'恋愛',w:.08,cd:12,when:()=>S.partner&&S.partner.rel>=70&&age()>=22,
  text:()=>`${pn(S.partner)}と付き合って長い。そろそろ結婚を考える？`,
  ch:[['プロポーズする',()=>{if(chance(S.partner.rel/110)){S.q.push('l_wed');return '「はい」と返事をもらえた！'}rel(S.partner,-10);return '「まだ考えられない」と言われてしまった。'}],['まだ早い',()=>'今の関係を大事にすることにした。']]});
E('l_breakup',{t:'別れ話',cat:'恋愛',w:.08,cd:6,when:()=>S.partner&&S.partner.rel<15,
  text:()=>`${pn(S.partner)}「わたしたち、もう終わりにしよう」`,
  ch:[['引き止める',()=>{if(chance(.4)){rel(S.partner,15);return 'もう少しだけ続けてみることになった。'}tl(S.partner.name+'と別れた');S.partner=null;ad('happy',-8);return '気持ちは戻らなかった。'}],['受け入れる',()=>{tl(S.partner.name+'と別れた');S.partner=null;ad('happy',-6);ad('mental',-3);return 'ひとりの夜が長い。'}]]});
E('l_wed',{t:'結婚式',cat:'恋愛',w:0,text:()=>'結婚式をどうする？',
  ch:[['盛大に（300万円）',()=>wed(3000000,10)],['こぢんまりと（80万円）',()=>wed(800000,6)],['写真だけ（20万円）',()=>wed(200000,4)]]});
E('l_baby',{t:'新しい命',cat:'家族',w:.035,cd:18,when:()=>S.spouse&&age()>=22&&age()<=(S.g==='女'?44:50)&&S.kids.length<4,
  text:()=>'家族が増えることになった。',
  ch:[['名前を決める',()=>{const g=chance(.5)?'男':'女';const c={name:pick(g==='男'?NAME_M:NAME_F),g,born:S.am};S.kids.push(c);ad('happy',12);ad('mental',-2);tl(c.name+'が生まれた');if(totalF()>=5000&&!S.flags.kidAsk)S.q.push('l_kidcam');return `${c.name}が生まれた。子育てには毎月お金がかかる。`}]]});
E('l_kidcam',{t:'子どもを動画に出す？',cat:'家族',w:0,text:()=>'フォロワーから「赤ちゃん見たい！」というコメントが殺到している。',
  ch:[['動画に出す',()=>{S.flags.kidAsk='yes';ad('f',Math.round(totalF()*.08));ad('rep',2);return '再生数は大きく伸びた。いつか、この子はこの動画をどう思うだろう。'}],['顔は出さない',()=>{S.flags.kidAsk='no';ad('rep',4);return '「子どもの顔は出しません」と宣言した。理解を示すコメントが多く集まった。'}]]});
E('l_divorce',{t:'離婚の危機',cat:'家族',w:.06,cd:12,when:()=>S.spouse&&S.spouse.rel<20,
  text:()=>`${pn(S.spouse)}「もう一緒にいるのがつらい」`,
  ch:[['やり直したいと伝える',()=>{if(chance(.45)){rel(S.spouse,20);return 'もう一度向き合うことになった。'}return divorce()}],['離婚する',()=>divorce()]]});
E('l_care',{t:'親の介護',cat:'家族',w:.012,once:1,when:()=>age()>=40&&parents().some(p=>p.age0+age()>=72),
  text:()=>{S.tmp=parents().sort((a,b)=>b.age0-a.age0)[0];return `${S.tmp.role}が倒れ、介護が必要になった。`},
  ch:[['自分で介護する',()=>{rel(S.tmp,10);ad('mental',-10);ad('health',-4);S.flags.care=S.am+24;return '2年間、介護と生活を両立することになった。自由な枠が1つ減る。'}],['介護施設にお願いする',()=>{ad('money',-1200000);rel(S.tmp,-2);return '施設に入ってもらった。費用は重いが、プロに任せられる。'}]]});
E('l_pdeath',{t:'別れ',cat:'家族',w:0,text:()=>`${S.deadP.role}の${S.deadP.name}が亡くなった。享年${S.deadP.dage}歳。`,
  ch:[['見送る',()=>{ad('happy',-12);ad('mental',-8);let inh=0;if(age()>=18&&!anyParentAlive())inh=Math.round([0,300000,1500000,5000000,20000000][S.tier]*S.cty.inc);if(inh)ad('money',inh,'inherit');tl(S.deadP.role+'が亡くなった');return inh?`たくさんの思い出がよみがえる。遺産として${yen(inh)}を受け取った。`:'たくさんの思い出がよみがえる。'}]]});
E('l_petbye',{t:'コロとの別れ',cat:'家族',w:.05,once:1,when:()=>S.pet&&age()>=19,
  text:()=>'子どものころから一緒だったコロが、静かに息を引き取った。',
  ch:[['ありがとう',()=>{S.pet=0;ad('happy',-8);ad('mental',-4);tl('愛犬コロとお別れした');return 'たくさんの思い出をくれた。'}]]});
E('l_sibwed',{t:'きょうだいの結婚式',cat:'家族',w:.01,once:1,when:()=>S.sibs.length&&age()>=24,
  text:()=>`${S.sibs[0].role}の${pn(S.sibs[0])}が結婚することになった。`,
  ch:[['お祝いする',()=>{ad('money',-50000);ad('happy',4);rel(S.sibs[0],5);return '家族みんなで笑い合った。'}]]});
E('l_grand',{t:'孫の誕生',cat:'家族',w:.04,once:1,when:()=>S.kids.some(c=>(S.am-c.born)/12>=27),
  text:()=>'子どもに赤ちゃんが生まれた。おじいちゃん・おばあちゃんになった！',
  ch:[['抱っこする',()=>{ad('happy',10);tl('孫が生まれた');return '小さな手がぎゅっと指をにぎった。'}]]});

// --- 健康 ---
E('h_flu',{t:'インフルエンザ',cat:'健康',w:.025,cd:12,when:()=>age()>=6&&(S.m<=3||S.m===12),
  text:()=>'高い熱が出た。インフルエンザだ。',
  ch:[['しっかり休む',()=>{ad('health',-4);return '1週間で回復した。'}],['熱があっても投稿する',()=>{ad('health',-10);ad('mental',-3);if(S.snsOpen){ad('f',RI(10,200));return '「無理しないで」とコメントが集まったが、体はつらい。'}return '無理がたたって長引いた。'}]]});
E('h_injury',{t:'けが',cat:'健康',w:.006,cd:36,when:()=>age()>=6,
  text:()=>pick(['自転車で転んで骨折した。','階段で足をひねって大けがをした。','交通事故に巻きこまれてけがをした。']),
  ch:[['治療に専念する',()=>{ad('health',-14);if(age()>=18)ad('money',-80000);ad('mental',-3);return '数か月かかったが、元通り動けるようになった。'}]]});
E('h_check',{t:'健康診断',cat:'健康',w:.03,cd:12,when:()=>age()>=35&&S.p.health<70,
  text:()=>'健康診断の結果に「要再検査」の文字が並んでいた。',
  ch:[['生活を見直す',()=>{ad('health',4);ad('happy',-1);return '食事と睡眠を見直し、運動を始めた。'}],['気にしない',()=>{ad('health',-3);return '…来年こそは。'}]]});
E('h_cancer',{t:'がんの診断',cat:'健康',w:0,
  text:()=>'精密検査の結果、がんが見つかった。\n（日本では生涯でおよそ2人に1人ががんと診断されるといわれる）',
  ch:[['治療に専念する',()=>{S.flags.cancer='treat';S.flags.cancerEnd=S.am+RI(8,18);ad('money',-500000,'medical');ad('mental',-8);ad('health',-10);S.pause=Math.max(S.pause||0,3);tl('がんの治療を始めた');return '治療が始まった。しばらく投稿を休む。'}],
      ['公表して治療を続ける',()=>{S.flags.cancer='treat';S.flags.cancerEnd=S.am+RI(8,18);ad('money',-500000,'medical');ad('health',-10);ad('mental',-4);if(totalF()>=1000){ad('f',Math.round(totalF()*.05));ad('rep',8)}tl('がんを公表した');return '応援のメッセージがたくさん届いた。'}],
      ['治療を受けない',()=>{S.flags.cancer='untreated';ad('mental',-5);return '残された時間を自分らしく使うことにした。'}]]});
E('h_cured',{t:'治療の結果',cat:'健康',w:0,text:()=>'長い治療の結果を聞く日がきた。',
  ch:[['結果を聞く',()=>{if(chance(clamp(1.15-age()/100,.3,.92))){delete S.flags.cancer;ad('happy',10);ad('health',10);tl('がんを克服した');return '「経過は良好です」——涙が止まらなかった。'}S.flags.cancerEnd=S.am+12;ad('health',-8);ad('mental',-6);return '治療はもう少し続くことになった。'}]]});
E('h_mental',{t:'心の不調',cat:'健康',w:.05,cd:18,when:()=>age()>=13&&S.p.mental<35,
  text:()=>'何をしても楽しくない日が続いている。',
  ch:[['専門家に相談する',()=>{if(age()>=18)ad('money',-30000,'medical');ad('mental',15);return '話を聞いてもらって、少し心が軽くなった。'}],['身近な人に話す',()=>{ad('mental',8);ad('social',2);return '「話してくれてありがとう」と言われた。'}],['ひとりで抱える',()=>{ad('mental',-4);return '…もう少しだけ、がんばってみる。'}]]});
E('h_burnout',{t:'燃え尽き',cat:'SNS',w:.12,cd:24,when:()=>S.snsOpen&&S.p.mental<22,
  text:()=>'カメラの前に座っても、言葉が出てこない。',
  ch:[['活動休止を発表する',()=>{S.pause=3;ad('mental',25);ad('f',-Math.round(totalF()*.04));tl('活動を休止した');return '3か月の休止期間に入った。「待ってるよ」の声が届いた。'}],['無理して続ける',()=>{ad('health',-8);ad('mental',-5);return '笑顔がひきつっていると言われた。'}]]});
E('h_quake',{t:'大地震',cat:'ニュース',w:.003,cd:120,when:()=>age()>=3,
  text:()=>`${ctry()}で大きな地震が起きた。${S.region.n}も強く揺れた。`,
  ch:()=>{const a=[['家族の無事を確かめる',()=>{ad('happy',-4);ad('mental',-4);if(age()>=18)ad('money',-RI(50000,300000));return '家族は無事だったが、家の中はめちゃくちゃになった。'}]];if(totalF()>=10000)a.push(['配信で支援を呼びかける',()=>{ad('rep',8);ad('mental',-2);return '正確な情報と募金先を発信した。多くの人に届いた。'}]);return a}});
E('h_heat',{t:'猛暑',cat:'健康',w:.04,cd:12,when:()=>S.m>=7&&S.m<=8&&(age()>=65||S.plan.filter(x=>x==='post').length>=3),
  text:()=>'記録的な猛暑。部屋の中でも熱中症の危険がある。',
  ch:[['エアコンをつける',()=>{if(age()>=18)ad('money',-8000);return '電気代はかかったが、体は守れた。'}],['がまんする',()=>{ad('health',-8);return '頭がくらくらして倒れかけた。'}]]});

// --- ニュース（風刺） ---
E('n_ai',{t:'ニュース',cat:'ニュース',w:.01,once:1,when:()=>age()>=10,text:()=>'「AIが作った動画、ランキング上位の3割に」——人間の配信者の価値はどこにあるのか、議論になっている。',ch:[['うーん',()=>{ad('plan',2);return '自分にしか作れないものを考えた。'}]]});
E('n_kidrule',{t:'ニュース',cat:'ニュース',w:.01,once:1,when:()=>age()>=5,text:()=>`「${ctry()}政府、子どもの動画出演と収益の扱いについてルール作りを検討」`,ch:[['考えさせられる',()=>{ad('know',1);return S.kc.on||S.kc.was?'自分の子ども時代の動画のことを思い出した。':'ニュースを見ながら家族と話した。'}]]});
E('n_price',{t:'物価上昇',cat:'ニュース',w:.008,cd:36,when:()=>age()>=18,text:()=>'物価の上昇が止まらない。スーパーの値札がまた変わった。',ch:[['節約する',()=>{S.priceIdx=(S.priceIdx||1)*1.04;ad('happy',-1);return '生活費が少し上がった。'}]]});
E('n_rank',{t:'ニュース',cat:'ニュース',w:.008,once:1,when:()=>age()>=10,text:()=>'「小学生のなりたい職業ランキング、今年も1位は配信者」',ch:[['だよね',()=>{ad('happy',1);return '時代は変わった。'}]]});
E('n_newsns',{t:'新しい流行',cat:'ニュース',w:.01,cd:48,when:()=>age()>=13,text:()=>'若者の間で、また新しい楽しみ方が流行り始めたらしい。',ch:[['気にとめておく',()=>{newTrend();return `流行が「${GENRES[S.trend.g].n}」に移り始めた。`}]]});
E('n_hate',{t:'ニュース',cat:'ニュース',w:.008,once:1,when:()=>age()>=15,text:()=>'「ネットの誹謗中傷、書きこんだ人の特定がしやすく」——法律の改正が話題になっている。',ch:[['少しほっとする',()=>{ad('mental',2);return 'アンチへの向き合い方が変わるかもしれない。'}]]});

// --- 老後 ---
E('m65',{t:'定年',cat:'人生',w:0,text:()=>`65歳。長く勤めた会社を定年退職する。年金は月${num(S.pension)}円の見込み。`,
  ch:[['再雇用で働き続ける',()=>{S.salary=Math.round(S.salary*.6);S.flags.reemp=S.am+60;return '給料は下がるが、70歳まで働くことにした。'}],['のんびり引退する',()=>{S.flags.retiredWork=1;S.st='retired';S.salary=0;S.job=null;ad('happy',6);tl('定年退職した');return '自由な時間が一気に増えた。'}],['シニア配信者デビュー',()=>{S.flags.retiredWork=1;S.st='retired';S.salary=0;S.job=null;if(!S.snsOpen){openSns('milu');S.main='milu'}tl('シニア配信者として再出発');return '「人生の先輩」として配信を始めた。'}]]});
E('o_memory',{t:'思い出の動画',cat:'人生',w:.02,cd:36,when:()=>age()>=70&&S.snsOpen,text:()=>'昔の投稿を見返していたら、若いころの自分が必死に笑っていた。',ch:[['懐かしむ',()=>{ad('happy',4);return '悪くない人生だ。'}]]});
E('o_fans',{t:'シニア人気',cat:'SNS',w:.03,once:1,when:()=>age()>=65&&S.snsOpen,text:()=>'若い世代から「この人の話、沁みる」とじわじわ人気が出てきた。',ch:[['ありがたい',()=>{ad('f',RI(500,5000));ad('happy',6);return '孫くらいの年の子からファンレターが届いた。'}]]});
E('o_body',{t:'体の衰え',cat:'健康',w:.03,cd:24,when:()=>age()>=75,text:()=>'最近、階段がつらい。',ch:[['散歩を日課にする',()=>{ad('health',3);return '近所の人とあいさつするのが楽しみになった。'}],['無理はしない',()=>{ad('health',-2);ad('mental',1);return 'のんびり過ごすことにした。'}]]});
