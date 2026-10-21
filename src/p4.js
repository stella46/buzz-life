// ===== v0.2：国・舞台 =====
// 実在の国の数値は世界銀行の公開データ（CC BY 4.0）などを参考に大きく丸めたゲーム用の値
const COUNTRIES={
  nipporia:{n:'ニッポリア',fict:1,jp:1,life:1,child:1,inc:1,uni:.6,net:.95,births:0,flavor:'日本によく似た架空の国'},
  japan:{n:'日本',jp:1,life:1,child:1,inc:1,uni:.6,net:.95,births:.77},
  usa:{n:'アメリカ',life:1.9,child:3,inc:1.8,uni:.6,net:.92,births:3.6},
  korea:{n:'韓国',life:1.1,child:1.3,inc:.85,uni:.7,net:.97,births:.25},
  germany:{n:'ドイツ',life:1.4,child:1.5,inc:1.2,uni:.5,net:.92,births:.74},
  brazil:{n:'ブラジル',life:2.4,child:7,inc:.2,uni:.5,net:.81,births:2.6},
  india:{n:'インド',life:3.2,child:15,inc:.06,uni:.3,net:.46,births:23},
  philippines:{n:'フィリピン',life:3,child:12,inc:.09,uni:.35,net:.73,births:1.6},
  nigeria:{n:'ナイジェリア',life:5.5,child:40,inc:.05,uni:.12,net:.55,births:7.5},
  lumina:{n:'ルミナ連邦',fict:1,life:.85,child:.8,inc:1.4,uni:.8,net:.98,flavor:'豊かで福祉が手厚い国'},
  sorano:{n:'ソラノ王国',fict:1,life:1.6,child:4,inc:.45,uni:.35,net:.7,flavor:'伝統と新しさがせめぎあう古い王国'},
  grand:{n:'グラン砂漠国',fict:1,life:3.5,child:20,inc:.08,uni:.15,net:.4,flavor:'砂漠の国。暮らしは厳しい'},
  midori:{n:'ミドリ諸島',fict:1,life:1.2,child:2,inc:.35,uni:.3,net:.6,flavor:'のんびりした南の島々'},
  hexa:{n:'テクノ・ヘキサ',fict:1,life:.95,child:1,inc:1.1,uni:.7,net:1,flame:1.6,disc:1.3,flavor:'超ネット社会。バズも炎上も激しい'}
};
const STAGES={nipporia:{n:'ニッポリア（日本がモデルの架空の国）'},japan:{n:'日本'},world:{n:'世界のどこか（現実の国）',need:'life1'},fantasy:{n:'架空の大陸',need:'f10k'}};
const REG_JP=[{n:'首都圏の都市',type:'大都市',w:30,cost:150000,sal:1.12},{n:'関西の都市',type:'大都市',w:18,cost:135000,sal:1.05},{n:'地方の県庁所在地',type:'地方都市',w:27,cost:118000,sal:.95},{n:'海沿いの小さな市',type:'地方都市',w:12,cost:110000,sal:.92},{n:'田園の町',type:'町村',w:9,cost:100000,sal:.88},{n:'山あいの村',type:'町村',w:4,cost:95000,sal:.85}];
const REG_W=[{n:'首都',type:'大都市',w:30,m:1.15,sal:1.2},{n:'大きな都市',type:'大都市',w:25,m:1,sal:1.05},{n:'地方の町',type:'地方都市',w:25,m:.85,sal:.9},{n:'農村',type:'町村',w:20,m:.7,sal:.75}];
function regionsFor(id){const c=COUNTRIES[id];if(id==='nipporia')return REGIONS.map(r=>Object.assign({},r));if(id==='japan')return REG_JP.map(r=>Object.assign({},r));return REG_W.map(r=>({n:r.n,type:r.type,w:r.w,sal:r.sal,cost:Math.round(130000*r.m*c.inc)}))}
const ctry=()=>S&&S.cty?S.cty.n:CFG.country;
function pickCountry(stage){if(stage==='nipporia'||stage==='japan')return stage;const ids=Object.keys(COUNTRIES).filter(k=>stage==='world'?!COUNTRIES[k].fict:(COUNTRIES[k].fict&&k!=='nipporia'));if(stage==='world')return wpick(ids.map(k=>({k,w:COUNTRIES[k].births}))).k;return pick(ids)}

// ===== 難易度 =====
const DIFFS={easy:{n:'やさしい',d:'お金が入りやすく、炎上しにくい',money:1.4,flame:.6,disc:1.25,mort:.8},normal:{n:'ふつう',d:'標準のバランス',money:1,flame:1,disc:1,mort:1},hard:{n:'むずかしい',d:'稼ぎにくく、燃えやすい',money:.75,flame:1.5,disc:.8,mort:1.1,need:'life1'},real:{n:'リアル',d:'伸びにくく、現実はきびしい',money:.6,flame:1.8,disc:.6,mort:1.15,need:'f100k'}};
const DF=()=>DIFFS[S.diff]||DIFFS.normal;

// ===== 研究 =====
const RES=[
  {id:'live',n:'ライブ配信',c:20,d:'投げ銭が入りやすくなり、投稿の質+2'},
  {id:'mind',n:'メンタルケア',c:24,d:'投稿の疲れ-30%、炎上のダメージ軽減'},
  {id:'shorts',n:'切り抜き戦略',c:30,d:'パッとでの伸び+25%'},
  {id:'collab',n:'コラボ術',c:30,d:'コラボの効果が1.5倍'},
  {id:'analytics',n:'分析ツール',c:40,d:'投稿の質+3、仕組み変更の影響が小さくなる',req:'live'},
  {id:'asmr',n:'ASMR・作業用',c:40,d:'新ジャンル「ASMR・作業用」'},
  {id:'cafe',n:'飲食ビジネス',c:40,d:'カフェ・食堂を建てられる'},
  {id:'fitness',n:'健康ビジネス',c:40,d:'ジムを建てられる。年をとっても健康が減りにくい'},
  {id:'town',n:'まちづくり',c:50,d:'公園・図書館・観光案内所・子ども食堂を建てられる'},
  {id:'brand',n:'セルフブランディング',c:50,d:'PR案件の報酬+30%',req:'analytics'},
  {id:'company',n:'会社経営の基本',c:60,d:'事務所を作ってスタッフを雇える',req:'brand'},
  {id:'fashion',n:'アパレル',c:60,d:'アパレルショップを建てられる',req:'brand'},
  {id:'hr',n:'人材育成',c:60,d:'スタッフの効果が1.5倍',req:'company'},
  {id:'eq5',n:'プロ機材の知識',c:70,d:'機材に最上級ランクが追加される',req:'analytics'},
  {id:'scout',n:'スカウト網',c:70,d:'所属タレントを探せる',req:'company'},
  {id:'avatar',n:'アバター配信',c:80,d:'新ジャンル「アバター配信」',req:'analytics'},
  {id:'studio',n:'スタジオ運営',c:80,d:'配信スタジオを建てられる',req:'company'},
  {id:'politics',n:'地域のリーダーシップ',c:100,d:'市長選挙に出られるようになる',req:'town'},
  {id:'gamedev',n:'ゲーム開発',c:120,d:'ゲーム会社を建てられる',req:'company'},
  {id:'nation',n:'国づくりの視点',c:160,d:'国の発展に関われるようになる',req:'politics'}
];
const has=id=>!!(S&&S.res&&S.res[id]);
GENRES.asmr={n:'ASMR・作業用',w:{edit:.5,plan:.2,looks:.3},tal:'music',req:'asmr'};
GENRES.avatar={n:'アバター配信',w:{talk:.5,plan:.3,edit:.2},tal:'talk',req:'avatar'};
const TALK=['game','cook','beauty','talk','study','music','comedy','vlog'];
const talKey=g=>GENRES[g].tal||g;
const genreOk=g=>!GENRES[g].req||has(GENRES[g].req);
EQ.cam.t.push(['映画撮影用カメラ',1200000]);EQ.mic.t.push(['レコーディング設備',600000]);EQ.light.t.push(['映画用照明一式',500000]);EQ.pc.t.push(['レンダリングサーバー',1500000]);EQ.room.t.push(['自宅スタジオ棟',3000000]);
const eqMax=()=>has('eq5')?4:3;

// ===== 事務所 =====
const OFFICE=[null,{n:'小さな事務所',cost:3000000,rent:150000,staff:2,tal:1},{n:'中規模オフィス',cost:15000000,rent:500000,staff:5,tal:3},{n:'自社ビル',cost:80000000,rent:900000,staff:10,tal:6}];
const STAFF={editor:{n:'編集者',sal:250000,d:'投稿の質+4（1人あたり）'},manager:{n:'マネージャー',sal:300000,d:'PR案件の報酬+20%（1人あたり）・メンタルを守る'},writer:{n:'企画作家',sal:280000,d:'バズりやすさ+15%・研究ポイント+0.6'},pr:{n:'広報',sal:260000,d:'炎上のダメージ-30%・評判が回復しやすい'}};
const staffMul=()=>has('hr')?1.5:1;
const stN=k=>(S.office&&S.office.staff[k])||0;
const staffTotal=()=>Object.keys(STAFF).reduce((s,k)=>s+stN(k),0);
const fdm=()=>(has('mind')?.85:1)*(stN('pr')?.7:1);
const TAL_NAMES=['きらりん','モチ太郎','ナナホシ','ルカ・ミント','もぐもぐ姉さん','ジェット星野','うたたね','ハチミツくん','アオイロ','ポン酢ボーイ','月見だんご','ヨルノ'];

// ===== まち =====
const BLD={
  stall:{n:'屋台',cost:500000,inc:40000,dev:1,col:'#ffcf3f'},
  cafe:{n:'カフェ',cost:3000000,inc:150000,dev:3,req:'cafe',adj:{park:.3,library:.2},col:'#c08a4a',eff:'幸福が少しずつ上がる'},
  restaurant:{n:'食堂',cost:4000000,inc:200000,dev:3,req:'cafe',adj:{tourism:.3,park:.1},col:'#ff6150'},
  gym:{n:'ジム',cost:4000000,inc:120000,dev:2,req:'fitness',adj:{park:.2},col:'#7bdc6b',eff:'健康が少しずつ上がる'},
  apparel:{n:'アパレルショップ',cost:6000000,fan:1,dev:4,req:'fashion',adj:{studio:.3,cafe:.1},col:'#ff93b2',eff:'フォロワーが多いほど売れる'},
  studio:{n:'配信スタジオ',cost:5000000,inc:100000,dev:4,req:'studio',adj:{cafe:.2},col:'#b49cff',eff:'投稿の質+5'},
  gamedev:{n:'ゲーム会社',cost:20000000,inc:600000,dev:8,req:'gamedev',adj:{studio:.2,library:.2},vol:1,col:'#3fd6c9',eff:'当たり外れが大きい'},
  park:{n:'公園',cost:1000000,inc:-20000,dev:5,req:'town',pub:1,col:'#4caf50',eff:'メンタルが回復しやすい'},
  library:{n:'図書館',cost:2000000,inc:-40000,dev:6,req:'town',pub:1,col:'#8d6e63',eff:'知識と研究ポイントが増える'},
  tourism:{n:'観光案内所',cost:2000000,inc:-10000,dev:5,req:'town',pub:1,col:'#29b6f6',eff:'となりの店の売上アップ'},
  kids:{n:'子ども食堂',cost:1500000,inc:-50000,dev:6,req:'town',pub:1,col:'#ffb74d',eff:'評判が少しずつ上がる'}
};
const BLD_REQN=id=>{const r=RES.find(x=>x.id===id);return r?r.n:''};
function newTown(type){const dens={'大都市':.42,'地方都市':.28,'町村':.14}[type]||.28;const t=[];for(let i=0;i<48;i++){const r=Math.floor(i/8);let k='empty';if(r===2||(i%8===5&&r>2))k='road';else if(Math.random()<dens)k='house';else if(Math.random()<.12)k='tree';t.push({t:k,lv:0})}return {tiles:t,dev:0,bonus:0,sel:-1}}
const nbr=i=>{const x=i%8,y=Math.floor(i/8),o=[];if(x>0)o.push(i-1);if(x<7)o.push(i+1);if(y>0)o.push(i-8);if(y<5)o.push(i+8);return o};
function adjBonus(i){const b=BLD[S.town.tiles[i].t];if(!b||!b.adj)return 0;let s=0;for(const j of nbr(i)){const k=S.town.tiles[j].t;if(b.adj[k])s+=b.adj[k];if(k==='tourism'&&!b.pub)s+=.15}return s}
const countB=k=>S.town?S.town.tiles.filter(t=>t.t===k).reduce((s,t)=>s+t.lv,0):0;
function calcDev(){let d=S.town.bonus;for(const t of S.town.tiles){const b=BLD[t.t];if(b)d+=b.dev*t.lv}d+=S.town.tiles.filter(t=>t.t==='house').length*.3;return Math.round(Math.min(150,d))}
function bldProfit(i){const t=S.town.tiles[i],b=BLD[t.t];if(!b)return 0;const reg={'大都市':1.15,'地方都市':1,'町村':.85}[S.region.type]||1;let v=b.fan?Math.min(3000000,totalF()*.25)*t.lv:b.inc*t.lv;if(v>0){v*=(1+adjBonus(i))*reg*(1+S.town.dev/200);if(!b.fan)v*=S.cty.inc}else v*=S.cty.inc;if(b.vol)v*=R(-.6,2.2);return Math.round(v)}
const ROLES={face:'商店街の顔',amb:'観光大使',mayor:'市長',adviser:'国の文化アドバイザー'};

// ===== 実績・図鑑（人生をまたいで残る） =====
let META={ach:{},seen:{},titles:{},lives:0,best:0,bestF:0};
function loadMeta(){try{const o=JSON.parse(localStorage.getItem('nipporia-meta-v1')||'null');if(o)META=Object.assign(META,o)}catch(e){}}
function saveMeta(){try{localStorage.setItem('nipporia-meta-v1',JSON.stringify(META))}catch(e){}}
const unlocked=k=>!k||!!META.ach[k];
const ACH=[
  ['life1','はじめての一生','人生を1回終える',k=>k==='d'],
  ['age100','百寿','100歳まで生きる',k=>k==='d'&&age()>=100],
  ['f100','はじめの一歩','フォロワー100人',()=>S.stats.maxF>=100],
  ['f10k','1万人の壁','フォロワー1万人',()=>S.stats.maxF>=1e4],
  ['f100k','人気クリエイター','フォロワー10万人',()=>S.stats.maxF>=1e5],
  ['f1m','国民的スター','フォロワー100万人',()=>S.stats.maxF>=1e6],
  ['buzz10','バズ職人','1つの人生で10回バズる',()=>S.stats.buzz>=10],
  ['flame5','燃えても立ち上がる','1つの人生で5回炎上する',()=>S.stats.flames>=5],
  ['rich','億り人','資産1億円',()=>S.stats.maxM>=1e8],
  ['rags','どん底からの逆転','苦しい家庭に生まれて資産1億円',()=>S.tier===0&&S.stats.maxM>=1e8],
  ['married','人生のパートナー','結婚する',()=>!!S.spouse],
  ['kids3','にぎやかな家','子どもが3人',()=>S.kids.length>=3],
  ['office1','社長デビュー','事務所を作る',()=>S.office.lv>=1],
  ['office3','自社ビル','自社ビルを建てる',()=>S.office.lv>=3],
  ['talent3','プロデューサー','所属タレント3人',()=>S.office.talents.length>=3],
  ['town30','まちの立役者','まちの発展度30',()=>S.town.dev>=30],
  ['town80','まちの顔','まちの発展度80',()=>S.town.dev>=80],
  ['mayor','市長','市長になる',()=>S.role==='mayor'||S.role==='adviser'],
  ['nation','国を動かす','国の文化アドバイザーになる',()=>S.role==='adviser'],
  ['resall','研究の鬼','すべての研究を終える',()=>RES.every(r=>has(r.id))],
  ['kidch','元・家族チャンネルの子','家族チャンネルで育つ',()=>!!(S.kc.was||S.kc.on)&&age()>=13],
  ['gen3','三代目','3代目として生きる',()=>(S.gen||1)>=3],
  ['world','世界のどこかで','現実の別の国で一生を終える',k=>k==='d'&&!S.cty.fict&&S.ctyId!=='japan'],
  ['fantasy','異国の住人','架空の大陸で一生を終える',k=>k==='d'&&S.cty.fict&&S.ctyId!=='nipporia'],
  ['nosns','SNSのない人生','SNSを始めずに60歳以上で一生を終える',k=>k==='d'&&!S.snsOpen&&age()>=60],
  ['worker','勤め上げた','会社員として定年を迎える',()=>!!S.flags.retiredWork],
  ['creator70','生涯クリエイター','専業クリエイターのまま70歳以上で一生を終える',k=>k==='d'&&S.st==='creator'&&age()>=70],
  ['honest','正直者','ステマの誘いを断る',()=>!!S.flags.stemaNo],
  ['ev100','見聞を広げる','出来事を100種類見る',()=>Object.keys(META.seen).length>=100],
  ['ev200','人生の達人','出来事を200種類見る',()=>Object.keys(META.seen).length>=200],
  ['ev300','すべてを知る者','出来事を300種類見る',()=>Object.keys(META.seen).length>=300],
  ['hardlife','いばらの道','むずかしい以上で一生を終える',k=>k==='d'&&(S.diff==='hard'||S.diff==='real')],
  ['realstar','現実でも輝く','リアル難易度でフォロワー10万人',()=>S.diff==='real'&&S.stats.maxF>=1e5]
];
function checkAch(kind){if(!S)return;for(const [id,n,,f] of ACH){if(META.ach[id])continue;let ok=false;try{ok=f(kind)}catch(e){}if(ok){META.ach[id]=1;saveMeta();toast('実績解除：'+n);snd('buy')}}}

// ===== 出来事の簡易記法 =====
function applyEff(e){if(!e)return;for(const [k,v0] of Object.entries(e)){const v=Array.isArray(v0)?RI(v0[0],v0[1]):v0;
  switch(k){
    case 'money':ad('money',v);break;
    case 'f':ad('f',Math.abs(v)<1?Math.round(totalF()*v):v);break;
    case 'relP':relP(v);break;
    case 'lover':rel(lover(),v);break;
    case 'friend':if(S.friends.length)rel(pick(S.friends),v);break;
    case 'rival':rel(S.rival,v);break;
    case 'tl':tl(v0);break;
    case 'flame':if(!S.q.includes('flame'))S.q.push('flame');break;
    case 'q':S.q.push(v0);break;
    case 'flag':Object.assign(S.flags,v0);break;
    case 'rp':S.rp+=v;if(DL)DL.rp=(DL.rp||0)+v;break;
    case 'dev':S.town.bonus+=v;if(DL)DL.dev=(DL.dev||0)+v;break;
    default:if(k.startsWith('t_'))ad('tal.'+k.slice(2),v);else ad(k,v);
  }}}
function X(id,cat,t,when,w,text,chs,opt){E(id,Object.assign({t,cat,w,when,cd:24,text:typeof text==='function'?text:()=>text,ch:()=>chs.filter(c=>!c[3]||c[3]()).map(([lab,eff,res])=>[lab,()=>{applyEff(typeof eff==='function'?eff():eff);return typeof res==='function'?res():res}])},opt||{}))}
const ag=(a,b)=>()=>S.am>=a*12&&age()<=(b==null?200:b);
const and=(...fs)=>()=>fs.every(f=>f());
const snsC=()=>!!S.snsOpen;
const Fc=n=>()=>totalF()>=n;
const STc=(...s)=>()=>s.includes(S.st);
const Mc=(...ms)=>()=>ms.includes(S.m);
const Hc=id=>()=>has(id);
const lovC=()=>!!lover();
const kidAge=(a,b)=>()=>S.kids.some(c=>{const y=(S.am-c.born)/12;return y>=a&&y<=b});
const ofc=n=>()=>S.office&&S.office.lv>=n;
const bldC=k=>()=>S.town&&S.town.tiles.some(t=>t.t===k);
const poorC=()=>S.cty.inc<.3;
const genreC=g=>()=>S.snsOpen&&S.genre===g;
const notJP=()=>!S.cty.jp;
const jpC=()=>!!S.cty.jp;
const talC=()=>S.office&&S.office.talents.length>0;
const roleC=r=>()=>S.role===r;
const genC=()=>(S.gen||1)>=2;

// ===== BGM（すべてオリジナルの旋律をプログラムで演奏） =====
const BGM_TR={
  title:{bpm:132,ch:'C G Am F C G F G',w:'square',dr:1,mel:'E5.2 G5.2 C6.2 G5.2 E5.2 G5.2 A5.4 G5.2 F5.2 E5.2 D5.2 B4.4 D5.4 C5.2 E5.2 A5.4 A5.2 G5.2 E5.4 F5.2 A5.2 C6.4 A5.2 G5.2 F5.4 E5.2 G5.2 C6.2 E6.2 D6.4 C6.4 B5.2 G5.2 D5.2 G5.2 B5.4 -.4 A5.2 C6.2 F5.2 A5.2 G5.4 F5.4 E5.4 D5.4 G4.4 -.4'},
  baby:{bpm:96,ch:'F C Dm Bb F C Bb C',w:'triangle',dr:0,mel:'C6.4 A5.4 F5.4 A5.4 G5.4 E5.4 C5.8 D5.4 F5.4 A5.4 D6.4 C6.8 Bb5.8 A5.4 C6.4 F6.4 C6.4 E5.4 G5.4 C6.8 D6.4 Bb5.4 G5.4 Bb5.4 A5.8 G5.8'},
  school:{bpm:120,ch:'G Em C D G Em C D',w:'square',dr:1,mel:'B4.2 D5.2 G5.2 D5.2 B5.4 A5.4 G5.2 E5.2 B4.2 E5.2 G5.6 -.2 E5.2 G5.2 C6.2 G5.2 E5.4 C5.4 D5.2 F#5.2 A5.2 D6.2 C6.4 A5.4 B5.2 A5.2 G5.2 D5.2 B4.4 G5.4 E5.2 G5.2 B5.2 A5.2 G5.4 E5.4 C5.2 E5.2 G5.2 C6.2 B5.2 A5.2 G5.4 A5.4 F#5.4 D5.8'},
  adult:{bpm:108,ch:'Am F C G Am F G E',w:'square',dr:1,mel:'A4.3 C5.1 E5.2 A5.2 G5.2 E5.2 D5.4 C5.3 A4.1 F5.4 E5.2 C5.2 A4.4 G4.2 C5.2 E5.2 G5.2 A5.3 G5.1 E5.4 D5.2 B4.2 G4.4 -.4 B4.4 A4.3 C5.1 E5.2 A5.2 C6.2 B5.2 A5.4 F5.2 A5.2 C6.4 A5.2 F5.2 C5.4 D5.2 G5.2 B5.2 D6.2 C6.4 B5.4 G#5.4 E5.4 B4.4 E5.4'},
  elder:{bpm:84,ch:'D Bm G A D Bm G A',w:'triangle',dr:0,mel:'F#5.6 E5.2 D5.8 B4.4 D5.4 F#5.8 G5.6 F#5.2 E5.4 D5.4 E5.12 -.4 A5.6 F#5.2 D5.8 D5.4 F#5.4 B5.8 B5.4 A5.4 G5.4 E5.4 D5.12 -.4'},
  ending:{bpm:72,ch:'C Am F G C Am F C',w:'triangle',dr:0,mel:'G5.8 E5.8 C6.8 A5.8 A5.4 G5.4 F5.8 D5.8 G5.8 E5.8 C5.8 E5.4 A5.4 C6.8 C6.4 B5.4 A5.4 F5.4 C5.16'}
};
const NOTE_I={C:0,'C#':1,Db:1,D:2,'D#':3,Eb:3,E:4,F:5,'F#':6,Gb:6,G:7,'G#':8,Ab:8,A:9,'A#':10,Bb:10,B:11};
const CH_ROOT={C:'C',Am:'A',F:'F',G:'G',Em:'E',D:'D',Dm:'D',Bb:'Bb',Bm:'B',A:'A',E:'E'};
function nf(n){const m=n.match(/^([A-G][#b]?)(\d)$/);return 440*Math.pow(2,(NOTE_I[m[1]]+(+m[2]+1)*12-69)/12)}
let bgmOn=true,bgmCur=null,BG={},noiseBuf=null;
let VOL={bgm:.6,se:.8};try{Object.assign(VOL,JSON.parse(localStorage.getItem('nipporia-vol')||'{}'))}catch(e){}
try{bgmOn=localStorage.getItem('nipporia-bgm')!=='0'}catch(e){}
function bgmStop(){if(BG.timer)clearInterval(BG.timer);if(BG.master&&AC){const m=BG.master;try{m.gain.setTargetAtTime(0,AC.currentTime,.08)}catch(e){}setTimeout(()=>{try{m.disconnect()}catch(e){}},500)}BG={};bgmCur=null}
function bgmPlay(name){
  if(!bgmOn){bgmStop();return}
  if(bgmCur===name)return;
  try{AC=AC||new (window.AudioContext||window.webkitAudioContext)()}catch(e){return}
  if(AC.state==='suspended'){AC.resume().catch(()=>{})}
  bgmStop();const tr=BGM_TR[name];if(!tr)return;bgmCur=name;
  if(!noiseBuf){noiseBuf=AC.createBuffer(1,AC.sampleRate*.05,AC.sampleRate);const d=noiseBuf.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=Math.random()*2-1}
  const sd=60/tr.bpm/4,evs=[];let st=0;
  for(const tok of tr.mel.split(/\s+/)){const [n,l]=tok.split('.');if(n!=='-')evs.push({s:st,f:nf(n),l:+l,k:'m'});st+=+l}
  const total=Math.ceil(st/16)*16,chs=tr.ch.split(' ');
  for(let b=0;b<total/16;b++){const r=CH_ROOT[chs[b%chs.length]];const f2=nf(r+'2'),f3=nf(r+'3');for(let s=0;s<16;s+=4)evs.push({s:b*16+s,f:s%8?f3:f2,l:3,k:'b'});if(tr.dr){for(let s=2;s<16;s+=4)evs.push({s:b*16+s,k:'h'});evs.push({s:b*16,k:'k'});evs.push({s:b*16+8,k:'k'})}}
  evs.sort((a,b)=>a.s-b.s);
  const master=AC.createGain();master.gain.value=.05*VOL.bgm;master.connect(AC.destination);
  let t0=AC.currentTime+.08,idx=0;
  BG={master,timer:setInterval(()=>{
    if(!AC)return;const now=AC.currentTime;
    if(t0+total*sd<now-1){t0=now+.05;idx=0}
    for(let g=0;g<400;g++){if(idx>=evs.length){idx=0;t0+=total*sd}const e=evs[idx],t=t0+e.s*sd;if(t>now+.25)break;if(t>=now-.02)note(e,t,sd,master,tr.w);idx++}
  },50)};
}
function note(e,t,sd,out,w){
  const g=AC.createGain();g.connect(out);
  if(e.k==='h'){const s=AC.createBufferSource();s.buffer=noiseBuf;const hp=AC.createBiquadFilter();hp.type='highpass';hp.frequency.value=7000;s.connect(hp);hp.connect(g);g.gain.setValueAtTime(.18,t);g.gain.exponentialRampToValueAtTime(.001,t+.04);s.start(t);s.stop(t+.05);return}
  const o=AC.createOscillator();o.connect(g);
  if(e.k==='k'){o.type='sine';o.frequency.setValueAtTime(140,t);o.frequency.exponentialRampToValueAtTime(45,t+.12);g.gain.setValueAtTime(.7,t);g.gain.exponentialRampToValueAtTime(.001,t+.15);o.start(t);o.stop(t+.16);return}
  const d=e.l*sd;o.type=e.k==='b'?'triangle':w;o.frequency.value=e.f;const v=e.k==='b'?.55:(w==='square'?.22:.5);
  g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(v,t+.01);g.gain.setValueAtTime(v*.8,t+Math.max(.02,d*.6));g.gain.exponentialRampToValueAtTime(.001,t+d*.95);o.start(t);o.stop(t+d)}
function bgmWanted(){if(!$('#scrTitle').hidden)return 'title';if(!$('#scrEnd').hidden)return 'ending';if(!S)return 'title';const a=age();return a<6?'baby':a<18?'school':a<65?'adult':'elder'}
function bgmUpdate(){if(!bgmOn){bgmStop();return}if(!AC&&!bgmUser)return;bgmPlay(bgmWanted())}
let bgmUser=false;
document.addEventListener('pointerdown',()=>{if(!bgmUser){bgmUser=true;setTimeout(bgmUpdate,30)}},{capture:true});
document.addEventListener('keydown',()=>{if(!bgmUser){bgmUser=true;setTimeout(bgmUpdate,30)}},{capture:true});
