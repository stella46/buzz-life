// ===== v0.6：遊びの拡張 =====
function ensureV6(){if(!S)return;ensureV7();
  if(S.fanCore==null){S.fanCore=.05;S.fanAnti=.02}
  if(!S.series)S.series={g:null,n:0,fat:0};
  if(!S.pers)S.pers={careful:0,bold:0,kind:0,compet:0};
  if(!S.regrets)S.regrets=[];
  if(!S.body)S.body=[];
  if(!S.rivalRec)S.rivalRec={w:0,l:0};
  if(!S.disc)S.disc=[];
  if(!S.album)S.album=[];
  if(!S.deco)S.deco={};
  if(!S.decoOwn)S.decoOwn={};
  if(!S.legacy)S.legacy=[];
  if(!S.ticker)S.ticker=[];
  if(S.town){if(S.town.support==null)S.town.support=50;if(!S.town.reqs)S.town.reqs=[]}
  if(S.f&&S.f.holo==null){S.f.holo=0;S.open.holo=0}
  for(const c of S.kids||[]){if(c.bond==null){c.bond=50;c.know=10}}
}


Object.assign(INC_LBL,{fanclub:'ファンクラブ',fest:'まちのイベント',disc:'弟子からの謝礼'});Object.assign(OUT_LBL,{move:'引っ越し・移住',goods:'買い物'});
// ----- 乱数（生まれの番号） -----
function mulberry32(a){return function(){a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
const seedCode=s=>'B-'+String(s).padStart(6,'0');
function parseSeed(v){const m=String(v||'').replace(/[^0-9]/g,'');return m?(+m%1000000):null}

// ----- 体の特徴 -----
const BODY=[
  {k:'tall',n:'背が高い',sk:{looks:1.2}},{k:'voice',n:'声がいい',tal:{music:1.3,talk:1.2},sk:{talk:1.1}},
  {k:'hands',n:'手先が器用',sk:{edit:1.25},tal:{cook:1.2}},{k:'strong',n:'体が丈夫',p:{health:1.2}},
  {k:'memory',n:'記憶力がいい',p:{know:1.25}},{k:'funny',n:'ユーモアがある',tal:{comedy:1.3}},
  {k:'shy',n:'人見知り',p:{social:.8,know:1.1}},{k:'charm',n:'人なつっこい',p:{social:1.25}},
  {k:'stamina',n:'疲れにくい',p:{mental:1.15}},{k:'eye',n:'センスがいい',tal:{beauty:1.2,vlog:1.2}}
];
function bodyMul(k){if(!S||!S.body||!S.body.length)return 1;let m=1;for(const id of S.body){const b=BODY.find(x=>x.k===id);if(!b)continue;if(k.startsWith('tal.')){const t=k.slice(4);if(b.tal&&b.tal[t])m*=b.tal[t]}else if(b.sk&&b.sk[k])m*=b.sk[k];else if(b.p&&b.p[k])m*=b.p[k]}
  const top=persTop();if(top==='compet'&&(k in SK_KEYS))m*=1.1;return m}

// ----- 性格 -----
const PERS={careful:'慎重',bold:'大胆',kind:'やさしい',compet:'負けず嫌い'};
function persTop(){if(!S||!S.pers)return null;let best=null,v=15;for(const k in S.pers)if(S.pers[k]>v){v=S.pers[k];best=k}return best}
function persAdd(k,v){if(S.pers)S.pers[k]=Math.min(100,(S.pers[k]||0)+v)}
function actHook(a,o){const k=o&&o.k;
  if(a==='rest'||(a==='exercise'&&k==='yoga')||(a==='study'&&k==='read'))persAdd('careful',.25);
  if(a==='post'&&(k==='big'||k==='live'||S.style==='edge'))persAdd('bold',.12);
  if(['family','friends','chores','date','parenting'].includes(a))persAdd('kind',.25);
  if(['practice','talkp','study'].includes(a))persAdd('compet',.2);
}
function rel(n,v){if(!n)return;if(v>0&&persTop()==='kind')v*=1.2;n.rel=clamp(n.rel+v);if(DL){const k='rel:'+pn(n);DL[k]=(DL[k]||0)+v}}

// ----- 心残り -----
function chooseHook(e,i,chs){
  if(!S||!e||!['人生','恋愛','仕事','家族'].includes(e.cat)||chs.length<2)return;
  for(let j=0;j<chs.length;j++)if(j!==i&&!/やめ|今は|まだ|OK|見送/.test(chs[j][0]))S.regrets.push({age:age(),t:e.t,c:chs[j][0]});
  if(S.regrets.length>8)S.regrets.splice(0,S.regrets.length-8);
  const lab=chs[i][0];if(/謝|ゆず|助け|寄り添/.test(lab))persAdd('kind',1.5);if(/挑戦|反論|攻め|立候補|告白|プロポーズ/.test(lab))persAdd('bold',1.5);if(/様子|慎重|確認|相談/.test(lab))persAdd('careful',1.5);if(/くやし|負け|研究/.test(lab))persAdd('compet',1.5);
}
E('regret_recall',{t:'心残り',cat:'人生',w:.04,cd:60,when:()=>age()>=55&&S.regrets&&S.regrets.length>0,
  text:()=>{const r=S.tmpReg=pick(S.regrets);return `ふと、${r.age}歳のときの「${r.t}」を思い出した。\nあのとき「${r.c}」を選んでいたら、どうなっていただろう。`},
  ch:[['今からでもやってみる',()=>{const r=S.tmpReg;S.regrets=S.regrets.filter(x=>x!==r);ad('happy',6);ad('plan',2);tl(`心残りだった「${r.c}」に、今になって挑戦した`);return '遅すぎることなんてない。小さく一歩を踏み出した。'}],['これでよかったと思う',()=>{const r=S.tmpReg;S.regrets=S.regrets.filter(x=>x!==r);ad('mental',6);return '選んだ道を、胸を張って歩いてきた。'}]]});

// ----- 人生の目標 -----
const GOALS={
  free:{n:'目標なし（自由に生きる）',d:'',chk:()=>false},
  f1m:{n:'フォロワー100万人',d:'国民的な配信者になる',chk:()=>S.stats.maxF>=1e6,prog:()=>S.stats.maxF/1e6},
  rich:{n:'資産1億円',d:'お金持ちになる',chk:()=>S.stats.maxM>=1e8,prog:()=>Math.max(0,S.stats.maxM)/1e8},
  mayor:{n:'市長になる',d:'まちのトップに立つ',chk:()=>S.role==='mayor'||S.role==='adviser',prog:()=>({null:0,face:.33,amb:.66,mayor:1,adviser:1})[S.role]||0},
  family:{n:'結婚して子ども2人',d:'あたたかい家庭をつくる',chk:()=>!!S.spouse&&S.kids.length>=2,prog:()=>((S.spouse?1:0)+Math.min(2,S.kids.length))/3},
  shops:{n:'評価★4のお店を3軒',d:'人気店のオーナーになる',chk:()=>S.town.tiles.filter(t=>SHOP[t.t]&&t.stars>=4).length>=3,prog:()=>S.town.tiles.filter(t=>SHOP[t.t]&&t.stars>=4).length/3},
  town:{n:'まちの発展度100',d:'ふるさとを日本一のまちに',chk:()=>S.town.dev>=100,prog:()=>S.town.dev/100},
  long:{n:'90歳まで生きる',d:'健康に長生きする',chk:()=>age()>=90,prog:()=>age()/90},
  company:{n:'自社ビルを建てる',d:'会社を大きくする',chk:()=>S.office.lv>=3,prog:()=>S.office.lv/3}
};
E('goal_done',{t:'目標達成！',cat:'人生',w:0,text:()=>`人生の目標「${GOALS[S.goal].n}」を達成した！`,ch:[['やりきった',()=>{ad('happy',15);ad('mental',10);ad('rep',5);tl(`人生の目標「${GOALS[S.goal].n}」を達成`);META.titles['目標達成：'+GOALS[S.goal].n]=1;saveMeta();return '次は何を目指そう。「人生」→「目標」から新しい目標を選べる。'}]]});

// ----- 時代の変化 -----
GENRES.vr={n:'VR配信',w:{plan:.4,edit:.4,talk:.2},tal:'game',req:'era_vr'};
GENRES.aico={n:'AIと共演',w:{plan:.5,talk:.3,edit:.2},tal:'comedy',req:'era_ai'};
SNS.holo={n:'ホロミ',d:'立体映像の配信',reach:.9,disc:1.6,conv:.9,rpm:.6,flame:1,mon:5000,cap:2e6,era:2040};
const ERAS=[[2035,'era_vr','VR配信が当たり前の時代に。新ジャンル「VR配信」が選べるようになった'],[2040,'era_holo','立体映像のSNS「ホロミ」が登場した'],[2048,'era_ai','AIと人間の共演が新しいエンタメに。新ジャンル「AIと共演」が選べるようになった']];
function newTrend(){const gs=Object.keys(GENRES).filter(g=>genreOk(g)),ss=Object.keys(SNS).filter(x=>(!SNS[x].era||S.y>=SNS[x].era)&&(x!=='tsubu'||chance(.5)));if(!ss.length)ss.push('milu');
  if(S.rumor&&S.am>=S.rumor.at&&chance(S.rumor.acc/100)){S.trend={g:S.rumor.g,s:S.rumor.s,until:S.am+RI(4,9)};ticker(`噂どおり「${GENRES[S.rumor.g].n}」が流行し始めた`);S.rumor=null;return}
  S.rumor=null;S.trend={g:pick(gs),s:pick(ss),until:S.am+RI(4,9)}}

// ----- ニュースの帯 -----
const WORLD_NEWS=['物価がじわじわ上がっている','新しいスマホが発売された','人気ドラマの最終回が話題に','今年の流行語が発表された','大型連休の旅行者が過去最多','動画アプリの利用時間が過去最長に','AIの新サービスが続々登場','地方移住がブームに','配信者の年収ランキングが話題に','健康ブームでランニング人口が増加'];
function ticker(t){if(!S)return;if(!S.ticker)S.ticker=[];S.ticker.unshift(t);if(S.ticker.length>6)S.ticker.length=6}
function renderTicker(){const el=$('#ticker');if(!el)return;if(!S||$('#scrGame').hidden){el.hidden=true;return}el.hidden=false;const items=(S.ticker&&S.ticker.length?S.ticker:['ようこそ。'+ctry()+'の人生が始まった']).slice(0,6);const txt=items.map(x=>'◆ '+x).join('　　');const inner=el.querySelector('span');if(inner.textContent!==txt)inner.textContent=txt}

// ----- 毎月のフック -----
function monthHook(){
  ensureV6();const a=age();
  // ファン層
  if(S.snsOpen){S.fanAnti=clamp(S.fanAnti*.97,0,.4);S.fanCore=clamp(S.fanCore*(S.mo.posts<=0?.98:.993),.02,.5);
    if(S.fanCore>.08&&totalF()>=5000&&a>=13)inc('fanclub',Math.round(Math.min(totalF(),2e6)*S.fanCore*.5*Math.max(.15,S.cty.inc)))}
  // 噂
  if(S.snsOpen&&!S.rumor&&chance(.12)){const gs=Object.keys(GENRES).filter(g=>genreOk(g));S.rumor={g:pick(gs),s:pick(Object.keys(SNS).filter(x=>!SNS[x].era||S.y>=SNS[x].era)),acc:RI(35,85),at:S.am+RI(1,3)};ticker(`噂：そのうち「${GENRES[S.rumor.g].n}」が来るらしい（確度${S.rumor.acc}%）`)}
  // 時代
  for(const [y,id,msg] of ERAS)if(S.y>=y&&!S.res[id]){S.res[id]=1;ticker(msg);log(msg,'life');if(id==='era_holo')S.f.holo=S.f.holo||0}
  // 弟子
  for(const d of S.disc){const sk=(S.sk.talk+S.sk.plan+S.sk.edit)/3;const before=d.f;d.f=Math.round(clamp(d.f*(1+sk/2500+R(-.01,.03))+R(5,40),0,1e6));if(before<10000&&d.f>=10000){log(`弟子の${d.name}がフォロワー1万人を突破した！`,'good');ad('happy',3);ad('rep',2)}if(before<100000&&d.f>=100000){log(`弟子の${d.name}が10万人の人気者に！`,'good');tl(`弟子の${d.name}が10万人を達成`);ad('rep',4)}if(d.f>=1000)inc('disc',Math.round(d.f*.03*Math.max(.15,S.cty.inc)))}
  if(S.disc.length)ad('rep',.1*S.disc.length);
  // 知り合いの近況
  for(const n of [...S.friends,S.rival,...S.sibs].filter(Boolean)){if(chance(.006)){const lst=a<18?['部活の大会で優勝した','引っ越していった','新しい趣味を始めた','テストで1位をとった']:a<40?['結婚した','転職した','起業した','子どもが生まれた','大きな賞をとった','海外に引っ越した','夢をあきらめて地元に戻った','病気で入院した']:['昇進した','家を建てた','孫が生まれた','会社を辞めて旅に出た','病気から回復した','店を開いた'];n.news=pick(lst);log(`${pn(n)}が${n.news}らしい`,'life')}}
  // 子育て
  for(const c of S.kids){const ca=(S.am-c.born)/12;if(ca<18)c.bond=clamp(c.bond-.3,0,100)}
  // 子どもを考える
  if(S.flags.tryKid&&S.am<S.flags.tryKid&&S.spouse&&chance(.08)&&!S.q.includes('l_baby')){S.q.push('l_baby');delete S.flags.tryKid}
  // 休職
  if(S.flags.gap&&S.am<=S.flags.gap){ad('mental',3);ad('health',1);if(S.st==='work'){S.money-=S.salary;S.mo.inc.job=(S.mo.inc.job||0)-S.salary}}
  // 住民の声
  const T=S.town;T.support=clamp(T.support+(50-T.support)*.02);
  if(a>=18&&T.reqs.length<2&&chance(.06)){const pool=[['park','子どもが遊べる公園がほしい'],['library','静かに勉強できる図書館がほしい'],['kids','子ども食堂を作ってほしい'],['cafe','おしゃれなカフェがほしい'],['gym','運動できる場所がほしい'],['tourism','観光客向けの案内所がほしい'],['restaurant','家族で行ける食堂がほしい'],['event','まちでお祭りをしてほしい']].filter(r=>!T.reqs.some(x=>x.k===r[0]));if(pool.length){const r=pick(pool);T.reqs.push({k:r[0],text:r[1],at:S.am,base:r[0]==='event'?0:countB(r[0])});ticker(`住民の声：「${r[1]}」`)}}
  for(const r of T.reqs.slice()){const done=r.k==='event'?(T.evAm&&T.evAm>=r.at):countB(r.k)>r.base;if(done){T.support=clamp(T.support+8);ad('rep',2);log(`住民の声「${r.text}」に応えた。まちの支持が上がった`,'good');T.reqs.splice(T.reqs.indexOf(r),1)}else if(S.am-r.at>24){T.support=clamp(T.support-5);T.reqs.splice(T.reqs.indexOf(r),1)}}
  // ライバル企業
  if(!T.chain&&anyShop()&&chance(.004)){const types=[...new Set(T.tiles.filter(t=>SHOP[t.t]&&!['studio','gamedev'].includes(t.t)).map(t=>t.t))];if(types.length){T.chain={type:pick(types),until:S.am+RI(12,30)};S.q.push('x_chain')}}
  if(T.chain&&S.am>=T.chain.until){log(`${BLD[T.chain.type].n}の大手チェーンが撤退していった`,'good');ticker('大手チェーン店がまちから撤退');T.chain=null}
  // 部屋の飾り
  const nd=Object.values(S.deco).filter(Boolean).length;if(nd)ad('happy',.15*nd);
  // 目標
  if(S.goal&&S.goal!=='free'&&!S.goalDone&&GOALS[S.goal].chk()){S.goalDone=1;S.q.push('goal_done')}
  // ニュース
  if(chance(.25))ticker(pick(WORLD_NEWS));
}
function postHook(k,q,buzzed,nf){
  const sr=S.series;if(sr.g===S.genre){sr.n+=k;sr.fat+=k*(POPT==='big'?.3:1)}else{sr.g=S.genre;sr.n=k;sr.fat=0}
  S.fanCore=clamp(S.fanCore+(.002*k*(sr.n>=3?1.6:1)+(POPT==='live'?.004*k:0))*(1-S.fanCore),.02,.6);
  S.fanAnti=clamp(S.fanAnti+(S.style==='edge'?.003:S.style==='safe'?0:.0006)*k+(buzzed?.004:0),0,.4);
  if(buzzed)S.fanCore=clamp(S.fanCore-.01,.02,.6);
}
function discMul(){const sr=S.series||{n:0,fat:0};let m=1;if(sr.n>=3)m*=1+Math.min(.3,sr.n*.025);if(sr.fat>10)m*=1-Math.min(.45,(sr.fat-10)*.035);if(persTop()==='bold')m*=1.1;return m}
function flameMul(){return (1+(S.fanAnti||0)*2.5)*(persTop()==='careful'?.8:persTop()==='bold'?1.2:1)}
EV.flame.ch=(base=>()=>{const a=base.slice();if(persTop()==='careful')a.push(['事実だけを冷静に説明する（慎重）',()=>{S.stats.flames++;ad('f',-Math.round(totalF()*.03*fdm()));ad('rep',-1);ad('mental',-3);return '落ち着いた説明が伝わり、すぐに収まった。'}]);if(persTop()==='kind')a.push(['傷ついた人に寄り添って謝る（やさしい）',()=>{S.stats.flames++;ad('f',-Math.round(totalF()*.02*fdm()));ad('rep',2);ad('mental',-4);return '誠実な言葉に、批判していた人も矛を収めた。'}]);return a})(EV.flame.ch);
EV.l_fight.ch=(base=>()=>{const a=base.slice();if(persTop()==='kind')a.push(['相手の話を最後まで聞く（やさしい）',()=>{rel(lover(),10);return '気持ちを受け止めてもらえて、相手は泣きながら笑った。'}]);return a})(EV.l_fight.ch);

// ----- ライバル企業の出来事 -----
E('x_chain',{t:'大手チェーンの進出',cat:'まち',w:0,text:()=>`まちに大手チェーンの${BLD[(homeTown().chain||{type:'cafe'}).type].n}が出店してきた。安さと知名度で、あなたの店のお客さんを取りにきている。`,
  ch:[['値下げで対抗する',()=>{for(const t of homeTown().tiles)if(t.t===(homeTown().chain||{type:'cafe'}).type){initShop(t);t.price=1}return '価格を「安い」にして迎え撃つ。'}],['品質と雰囲気で勝負',()=>{for(const t of homeTown().tiles)if(t.t===(homeTown().chain||{type:'cafe'}).type){initShop(t);t.stars=clamp(t.stars+.5,1,5)}ad('plan',2);return '常連さんを大事にする道を選んだ。'}],['正面からは戦わない',()=>'しばらくは客足が落ちそうだ。']]});
const chainMul=t=>S.town&&S.town.chain&&S.town.chain.type===t.t&&S.am<S.town.chain.until?.72:1;

// ----- お店の内装と看板メニュー -----
const SEGN={s:'学生',f:'家族',t:'観光客',a:'大人'};
const SSTYLE=[{n:'ナチュラル',aff:{f:1,a:.6,s:.5,t:.6}},{n:'ポップ',aff:{s:1,t:.7,f:.6,a:.3}},{n:'高級感',aff:{a:1,t:.8,f:.3,s:.1}},{n:'レトロ',aff:{t:1,a:.7,s:.5,f:.4}}];
const SMENU=[{n:'定番',aff:{f:.8,a:.8,s:.6,t:.5}},{n:'ボリューム',aff:{s:1,f:.6,a:.3,t:.3}},{n:'映える限定品',aff:{s:.8,t:1,a:.4,f:.4}},{n:'地元の名物',aff:{t:1,f:.6,a:.6,s:.3}}];
function segWeights(){const base={'大都市':{s:.3,f:.2,t:.2,a:.3},'地方都市':{s:.25,f:.35,t:.1,a:.3},'町村':{s:.15,f:.45,t:.15,a:.25}}[S.town.rt||S.region.type]||{s:.25,f:.3,t:.15,a:.3};const w=Object.assign({},base);w.t+=Math.min(.3,countB('tourism')*.08);const sum=w.s+w.f+w.t+w.a;for(const k in w)w[k]/=sum;return w}
function shopSegMul(i){const t=S.town.tiles[i];if(t.style==null)return 1;const w=segWeights(),st=SSTYLE[t.style].aff,mn=SMENU[t.menuT||0].aff;let s=0;for(const k in w)s+=w[k]*(st[k]+mn[k])/2;return .7+.6*s}
function shopExtra(i){const t=S.town.tiles[i];if(t.style==null){t.style=0;t.menuT=0}const w=segWeights();const mul=shopSegMul(i);
  const seg=(key,list,cur)=>`<div class="seg">${list.map((x,j)=>`<button class="${cur===j?'on':''}" type="button" data-shop="${i}" data-k="${key}" data-v="${j}">${x.n}</button>`).join('')}</div>`;
  return `<div class="ctl"><span>内装</span>${seg('style',SSTYLE,t.style)}</div><div class="ctl"><span>メニュー</span>${seg('menuT',SMENU,t.menuT||0)}</div><p class="hint">このまちの客層：${Object.entries(w).map(([k,v])=>SEGN[k]+Math.round(v*100)+'%').join('・')} ／ 客層との相性 ${mul>=1.1?'◎':mul>=.95?'○':'△'}（×${mul.toFixed(2)}）${chainMul(t)<1?' ／ ⚠ 大手チェーンと競合中':''}</p>`}
document.addEventListener('click',e=>{const b=e.target.closest('button');if(!b||!S||b.dataset.shop==null)return;const k=b.dataset.k;if(k==='style'||k==='menuT'){S.town.tiles[+b.dataset.shop][k]=+b.dataset.v;save();renderPanel()}},true);

// ----- まちのイベント・住民の声 -----
const TEVENTS=[{k:'matsuri',n:'夏祭り',cost:500000,base:2000},{k:'food',n:'フードフェス',cost:1000000,base:5000},{k:'esports',n:'eスポーツ大会',cost:1500000,base:4000},{k:'music',n:'音楽フェス',cost:2000000,base:8000}];
function townExtra(){const T=S.town,a=age();let h=`<h3>まちの支持 ${Math.round(T.support)}</h3>${bar(T.support,'h')}<p class="hint">住民の声に応えたり、イベントを開いたりすると上がる。市長選挙に影響する。</p>`;
  h+='<h3>住民の声</h3>'+(T.reqs.length?T.reqs.map(r=>`<div class="note">「${esc(r.text)}」 <span class="muted small">${r.k==='event'?'まちのイベントを開くと応えられる':BLD[r.k]?BLD[r.k].n+'を建てると応えられる'+(BLD[r.k].req&&!has(BLD[r.k].req)?'（研究「'+esc(BLD_REQN(BLD[r.k].req))+'」が必要）':''):''}</span></div>`).join(''):'<p class="hint">今のところ届いていない。</p>');
  if(T.chain)h+=`<div class="note bad">大手チェーンの${esc(BLD[T.chain.type].n)}が進出中（あと${T.chain.until-S.am}か月ほど）</div>`;
  h+='<h3>まちのイベントを主催する</h3>';
  if(a<18)return h+'<p class="hint">18歳から主催できる。</p>';
  const cd=T.evAm!=null&&S.am-T.evAm<6;
  h+=cd?`<p class="hint">次に主催できるのは${6-(S.am-T.evAm)}か月後。</p>`:'';
  h+=TEVENTS.map(ev=>{const c=Math.round(ev.cost*Math.max(.2,S.cty.inc));return `<div class="shop"><div><div>${ev.n} <span class="muted small">${yen(c)}</span></div><div class="muted small">来場者の目安 ${num(ev.base*(1+T.dev/100))}人〜</div></div><button class="b sm" type="button" data-tev="${ev.k}" ${cd||S.money<c?'disabled':''}>主催する</button></div>`}).join('');
  return h}
function hostEvent(k){const ev=TEVENTS.find(x=>x.k===k),T=S.town,c=Math.round(ev.cost*Math.max(.2,S.cty.inc));if(S.money<c)return;outc('build',c);
  const vis=Math.round(ev.base*(1+T.dev/100)*(1+Math.sqrt(totalF())/300)*(T.support/60)*R(.7,1.3));const rev=Math.round(vis*R(150,450)*Math.max(.2,S.cty.inc));inc('fest',rev);
  T.evAm=S.am;T.bonus+=c/500000;T.support=clamp(T.support+5);ad('rep',2);ad('happy',3);ad('social',2);if(S.snsOpen)ad('f',Math.round(vis*.05));tl(`まちで${ev.n}を主催した（${num(vis)}人）`);ticker(`${S.region.n}の${ev.n}に${num(vis)}人が来場`);
  openModal(`<div class="mcat">まち</div><h2>${ev.n}の結果</h2><div class="kv"><span>来場者</span><span>${num(vis)}人</span><span>費用</span><span>-${yen(c)}</span><span>売上・協賛</span><span>+${yen(rev)}</span><span>差し引き</span><span class="${rev-c>=0?'up':'dn'}">${rev-c>=0?'+':''}${yen(rev-c)}</span></div><p class="mtext">まちの発展度と支持、あなたの評判が上がった。</p><button class="b pri" type="button" data-act="close">閉じる</button>`);save();render()}
EV.r_elect.ch=[['立候補する',()=>{ad('money',-1000000);const p=clamp(.15+S.p.rep/250+S.town.dev/300+Math.log10(totalF()+1)/30+(S.town.support-50)/150,.08,.9);if(chance(p)){S.role='mayor';tl('市長に当選した');ad('happy',10);return '当選！ まちの未来を託された。'}ad('mental',-8);return '落選…。住民の声にもっと応えていこう。'}],['今は出ない',()=>'時期を待つ。']];

// ----- ライバルとの名勝負 -----
function battle(){const r=S.rival;if(!r)return;S.cd.battle=S.am;
  const me=postQuality()+Math.sqrt(totalF())/18+R(0,35)+(persTop()==='compet'?5:0),you=42+Math.sqrt(r.f)/18+R(0,35);const win=me>=you;
  if(win){S.rivalRec.w++;const g=Math.round(Math.min(r.f,totalF()+1000)*R(.02,.06));ad('f',g);ad('happy',4);persAdd('compet',3);rel(r,r.rel>50?3:-3)}else{S.rivalRec.l++;r.f=Math.round(r.f*1.03);ad('mental',-3);ad('plan',2);persAdd('compet',4);rel(r,2)}
  tl(`ライバル「${r.name}」と勝負して${win?'勝った':'負けた'}`);
  openModal(`<div class="mcat">SNS</div><h2>名勝負：${win?'勝利！':'惜敗…'}</h2><p class="mtext">同じお題で動画を出し、どちらが伸びるか勝負した。\nあなた ${Math.round(me)} 対 ${esc(r.name)} ${Math.round(you)}\n通算 ${S.rivalRec.w}勝${S.rivalRec.l}敗</p><button class="b pri" type="button" data-act="close">閉じる</button>`);save();render()}
function snsExtra(){if(!S.snsOpen)return '';const sr=S.series,core=S.fanCore,anti=S.fanAnti,light=Math.max(0,1-core-anti),F=totalF();
  let h=`<h2>ファン</h2><div class="fanbar"><i style="width:${core*100}%" class="c"></i><i style="width:${light*100}%" class="l"></i><i style="width:${anti*100}%" class="a"></i></div><div class="kv"><span>ガチ勢</span><span>${num(F*core)}人（${Math.round(core*100)}%）</span><span>ライト層</span><span>${num(F*light)}人</span><span>アンチ</span><span>${num(F*anti)}人（${Math.round(anti*100)}%）</span></div><p class="hint">ガチ勢はシリーズものやライブで増え、ファンクラブの収入になる。アンチは攻めた投稿で増え、炎上しやすくなる。</p>`;
  h+=`<h3>シリーズ</h3>`+(sr.g?`<p class="hint">「${esc(GENRES[sr.g].n)}」シリーズ ${Math.floor(sr.n)}回目・マンネリ度 ${Math.min(100,Math.round(sr.fat*5))}%${sr.fat>10?'（飽きられ始めている）':sr.n>=3?'（固定ファンがついている）':''}</p><div class="row"><button class="b sm" type="button" data-act="newSeries">シリーズを終えて新しく始める</button></div>`:'<p class="hint">同じジャンルで投稿を続けるとシリーズになる。</p>');
  if(S.rumor)h+=`<h3>流行の噂</h3><p class="hint">そのうち「${esc(GENRES[S.rumor.g].n)}」が${esc(SNS[S.rumor.s].n)}で来るらしい（確度${S.rumor.acc}%）。先にジャンルを合わせておくと大きく伸びるかも。</p>`;
  if(S.rival){const cd=S.cd.battle!=null&&S.am-S.cd.battle<3;h+=`<h3>ライバルとの勝負</h3><p class="hint">通算 ${S.rivalRec.w}勝${S.rivalRec.l}敗。勝つとフォロワーを奪える。</p><button class="b sm" type="button" data-act="battle" ${cd?'disabled':''}>${cd?'次の勝負は'+(3-(S.am-S.cd.battle))+'か月後':`「${esc(S.rival.name)}」に勝負を挑む`}</button>`}
  return h}

// ----- 部屋の模様替え -----
const DECOS={poster:{n:'ポスター',p:3000,slot:'wall'},neon:{n:'ネオンサイン',p:20000,slot:'wall'},clock:{n:'壁かけ時計',p:6000,slot:'wall'},plant:{n:'観葉植物',p:5000,slot:'floor'},plush:{n:'大きなぬいぐるみ',p:4000,slot:'floor'},shelf:{n:'本棚',p:15000,slot:'floor'},rug:{n:'ラグ',p:8000,slot:'rug'},shield:{n:'記念の楯',p:0,slot:'wall',need:()=>S.stats.maxF>=1e5}};
const DSLOTS={wall:'壁',floor:'床',rug:'じゅうたん'};
function decoPanel(){let h=`<p class="hint">部屋の飾りを買って、ドット絵の部屋に置ける。飾るほど毎月の幸福が少し上がる。</p>`;
  for(const [sl,sn] of Object.entries(DSLOTS)){const own=Object.entries(DECOS).filter(([k,d])=>d.slot===sl&&S.decoOwn[k]);h+=`<div class="ctl"><span>${sn}</span><div class="seg"><button class="${!S.deco[sl]?'on':''}" type="button" data-deco="${sl}" data-v="">なし</button>${own.map(([k,d])=>`<button class="${S.deco[sl]===k?'on':''}" type="button" data-deco="${sl}" data-v="${k}">${d.n}</button>`).join('')}</div></div>`}
  h+='<h3>飾りを買う</h3><div>'+Object.entries(DECOS).map(([k,d])=>{const p=Math.round(d.p*Math.max(.2,S.cty.inc));const ok=!d.need||d.need();return `<div class="shop"><div><div>${d.n} <span class="muted small">${d.p?yen(p):'無料'}・${DSLOTS[d.slot]}</span></div>${!ok?'<div class="muted small">フォロワー10万人で手に入る</div>':''}</div>${S.decoOwn[k]?'<span class="chip up">持っている</span>':`<button class="b sm" type="button" data-dbuy="${k}" ${!ok||S.money<p?'disabled':''}>買う</button>`}</div>`}).join('')+'</div>';return h}
function drawDeco(c){if(!S||!S.deco)return;const w=S.deco.wall,f=S.deco.floor,r=S.deco.rug;
  if(r==='rug'){px(c,30,84,56,8,'#c45a7a');for(let x=32;x<84;x+=6)px(c,x,86,3,4,'#e08aa0')}
  if(w==='poster'){px(c,56,22,14,18,'#f4f1ff');px(c,58,24,10,8,'#3fd6c9');px(c,58,34,10,2,'#ff5c8a')}
  if(w==='neon'){const on=(fr>>3)%2;px(c,52,26,30,10,'#1a1a2a');px(c,54,28,26,2,on?'#ff5c8a':'#a03a5a');px(c,54,32,18,2,on?'#3fd6c9':'#2a8a80')}
  if(w==='clock'){px(c,60,24,12,12,'#f4f1ff');px(c,65,26,2,5,'#222');px(c,65,30,4,2,'#222')}
  if(w==='shield'){px(c,58,22,16,20,'#d8d8e8');px(c,61,25,10,10,'#b0b0c8');px(c,63,37,6,3,'#888')}
  if(f==='plant'){px(c,6,66,8,8,'#a0714f');px(c,4,54,12,12,'#2e7d32');px(c,7,50,6,6,'#43a047')}
  if(f==='plush'){px(c,6,62,12,12,'#f2c39d');px(c,6,60,4,4,'#f2c39d');px(c,14,60,4,4,'#f2c39d');px(c,9,66,2,2,'#222');px(c,13,66,2,2,'#222')}
  if(f==='shelf'){px(c,4,46,16,28,'#7a5238');for(let y=50;y<72;y+=7)px(c,5,y,14,1,'#5a3a22');px(c,6,51,3,5,'#ff5c8a');px(c,10,51,2,5,'#3fd6c9');px(c,6,58,4,5,'#ffcf3f')}}
document.addEventListener('click',e=>{const b=e.target.closest('button');if(!b||!S)return;
  if(b.dataset.deco!=null){S.deco[b.dataset.deco]=b.dataset.v||null;save();renderPanel();return}
  if(b.dataset.dbuy){const k=b.dataset.dbuy,d=DECOS[k],p=Math.round(d.p*Math.max(.2,S.cty.inc));if(S.money>=p&&(!d.need||d.need())){if(p)outc('goods',p);S.decoOwn[k]=1;S.deco[d.slot]=k;log(`${d.n}を部屋に飾った`,'good');snd('buy');save();render()}return}
  if(b.dataset.tev){hostEvent(b.dataset.tev);return}
  const a=b.dataset.act;
  if(a==='battle'){battle();return}
  if(a==='newSeries'){S.series={g:S.genre,n:0,fat:0};log('新しいシリーズを始めた','sns');save();renderPanel();return}
});

// ----- 思い出アルバム -----
const ALB=[[/誕生$/,'birth'],[/SNSデビュー/,'debut'],[/初めてバズ/,'buzz'],[/フォロワー1万/,'f10k'],[/フォロワー10万/,'f100k'],[/フォロワー100万/,'f1m'],[/と結婚した/,'wed'],[/が生まれた$/,'baby'],[/として就職/,'job'],[/大学に進学/,'univ'],[/住み始めた|一人暮らし/,'home'],[/市長/,'mayor'],[/を建てた/,'shop'],[/を構えた/,'office'],[/受賞|大賞|優勝/,'award'],[/大炎上/,'flame'],[/孫が生まれた/,'grand'],[/主催/,'fest'],[/目標/,'goal'],[/永眠|隠居/,'end'],[/引き継いだ/,'heir']];
function tl(t){S.tl.push([age(),t]);if(!S.album)S.album=[];for(const [re,k] of ALB)if(re.test(t)){S.album.push({age:age(),k,t,y:S.y});if(S.album.length>40)S.album.shift();break}}
function drawAlbum(cv,k){const c=cv.getContext('2d');const bg={birth:'#ffd6e0',debut:'#3fd6c9',buzz:'#ff5c8a',f10k:'#ffcf3f',f100k:'#d8d8e8',f1m:'#ffcf3f',wed:'#fff0f5',baby:'#ffe8cc',job:'#90caf9',univ:'#c5e1a5',home:'#bcaaa4',mayor:'#7986cb',shop:'#ffcc80',office:'#9fa8da',award:'#ffd54f',flame:'#ff8a65',grand:'#f8bbd0',fest:'#4db6ac',goal:'#aed581',end:'#5c6bc0',heir:'#b39ddb'}[k]||'#888';
  px(c,0,0,64,48,bg);px(c,0,40,64,8,'#00000022');
  const P=(x,y,h)=>{px(c,x-3,y-h,6,6,'#f2c39d');px(c,x-3,y-h,6,2,'#2a1d16');px(c,x-3,y-h+6,6,h-8,'#ff5c8a');px(c,x-3,y-2,2,2,'#2e3360');px(c,x+1,y-2,2,2,'#2e3360')};
  if(k==='birth'||k==='baby'||k==='grand'){px(c,22,28,20,10,'#fff');px(c,28,22,8,8,'#f2c39d');P(14,40,16);if(k!=='birth')P(50,40,16)}
  else if(k==='wed'){P(26,40,18);P(38,40,18);px(c,22,6,20,8,'#fff');px(c,30,4,4,4,'#ff5c8a')}
  else if(['debut','buzz','f10k','f100k','f1m'].includes(k)){px(c,20,10,24,18,'#222');px(c,22,12,20,14,'#9ff');P(32,44,14);for(let i=0;i<(k==='f1m'?6:3);i++)px(c,6+i*9,4,4,4,'#fff')}
  else if(k==='award'||k==='goal'){px(c,26,8,12,14,'#ffcf3f');px(c,30,22,4,6,'#c9a227');px(c,24,28,16,4,'#8d6e63');P(14,44,16)}
  else if(k==='mayor'){px(c,16,10,32,22,'#e8eaf6');px(c,28,4,8,6,'#e8eaf6');for(let x=18;x<46;x+=6)px(c,x,14,3,12,'#9fa8da');P(32,46,14)}
  else if(k==='shop'||k==='office'||k==='home'){px(c,14,14,36,26,'#efe6d8');px(c,12,10,40,6,k==='shop'?'#ff6150':k==='office'?'#5c6bc0':'#8d6e63');px(c,28,26,8,14,'#6d4c41');px(c,18,20,6,6,'#9ff');px(c,40,20,6,6,'#9ff')}
  else if(k==='fest'){for(let i=0;i<5;i++){px(c,6+i*12,6,8,8,['#ff5c8a','#ffcf3f','#3fd6c9','#b49cff','#7bdc6b'][i]);px(c,9+i*12,14,2,4,'#333')}P(20,44,14);P(34,44,14);P(48,44,14)}
  else if(k==='flame'){px(c,24,14,16,24,'#ff6150');px(c,28,8,8,10,'#ffcf3f');P(48,44,14)}
  else if(k==='job'||k==='univ'){px(c,10,8,44,24,'#ffffffaa');P(32,44,16);px(c,29,26,6,6,k==='job'?'#3b3b55':'#2e7d32')}
  else {P(32,42,16);px(c,10,6,6,6,'#ffffff')}
}
function albumHtml(list){if(!list||!list.length)return '<p class="hint">まだ思い出がない。人生の大きな出来事があると、ここに1枚ずつ残っていく。</p>';return `<div class="album">${list.map((a,i)=>`<figure><canvas width="64" height="48" data-alb="${i}" data-k="${a.k}"></canvas><figcaption><b>${a.age}歳</b> ${esc(a.t)}</figcaption></figure>`).join('')}</div>`}
function paintAlbums(){document.querySelectorAll('canvas[data-alb]').forEach(cv=>drawAlbum(cv,cv.dataset.k))}

// ----- 相関図 -----
function drawMap(){const cv=$('#relMap');if(!cv)return;const c=cv.getContext('2d'),W=cv.width,H=cv.height,cx=W/2,cy=H/2;c.fillStyle='#20234a';c.fillRect(0,0,W,H);
  const list=[...parents(),...S.sibs,...S.friends,S.rival,S.partner,S.spouse].filter(Boolean).concat(S.kids.map(k=>({name:k.name,role:'子ども',rel:k.bond})),S.disc.map(d=>({name:d.name,role:'弟子',rel:70})));
  const n=list.length,R2=Math.min(W,H)/2-42;c.font='12px DotGothic16, sans-serif';c.textAlign='center';
  list.forEach((p,i)=>{const ang=-Math.PI/2+i/n*Math.PI*2,x=cx+Math.cos(ang)*R2,y=cy+Math.sin(ang)*R2;const col=p.rel>=65?'#7bdc6b':p.rel>=35?'#aca9d6':'#ff6150';c.strokeStyle=col;c.lineWidth=1+p.rel/30;c.beginPath();c.moveTo(cx,cy);c.lineTo(x,y);c.stroke();c.fillStyle='#272b58';c.fillRect(x-34,y-14,68,28);c.strokeStyle=col;c.lineWidth=2;c.strokeRect(x-34,y-14,68,28);c.fillStyle='#f4f1ff';c.fillText((pn(p)||p.name).slice(0,6),x,y-1);c.fillStyle='#aca9d6';c.fillText(String(p.role).slice(0,5),x,y+11)});
  c.fillStyle='#ff5c8a';c.fillRect(cx-30,cy-14,60,28);c.fillStyle='#2b0915';c.fillText('あなた',cx,cy+4);c.textAlign='left'}

// ----- 弟子 -----
function takeDisciple(){if(S.disc.length>=3)return;const d={name:pick(TAL_NAMES),genre:pick(TALK),f:RI(100,1500)};S.disc.push(d);tl(`${d.name}を弟子にとった`);log(`${d.name}を弟子にとった`,'good');save();render()}

// ----- 子育て -----
ACT.parenting={n:'子育て',d:'子どもと向き合う。子どもとの絆が深まる',ok:()=>S.kids.some(c=>(S.am-c.born)/12<18),f:k=>ACT.parenting.opts[0].f(k),opts:[
  {k:'play',n:'一緒に遊ぶ',d:'絆と幸福が上がる',f:k=>{for(const c of kidsU18()){c.bond=clamp(c.bond+4*k,0,100)}ad('happy',2*k);ad('mental',1*k);if(S.spouse)rel(S.spouse,1*k)}},
  {k:'study',n:'勉強を見る',d:'子どもの知識と絆',f:k=>{for(const c of kidsU18()){c.bond=clamp(c.bond+2*k,0,100);c.know=clamp((c.know||10)+3*k,0,100)}ad('know',.3*k);ad('mental',-.3*k)}},
  {k:'lesson',n:'習い事に連れていく',d:'子どもの才能が伸びる。お金がかかる',f:k=>{for(const c of kidsU18()){c.bond=clamp(c.bond+2*k,0,100);c.talent=(c.talent||0)+2*k}outc('kids',Math.round(10000*k*Math.max(.2,S.cty.inc)))}},
  {k:'talk',n:'じっくり話を聞く',d:'絆が大きく深まる',f:k=>{for(const c of kidsU18())c.bond=clamp(c.bond+5*k,0,100);ad('mental',.5*k)}}]};
const kidsU18=()=>S.kids.filter(c=>(S.am-c.born)/12<18);

// ----- 家系の遺産 -----
function legacyHook(P,N){const ts=titlesOf().slice(0,2);N.legacy=(P.legacy||[]).concat(ts).slice(-6);N.rivalRec={w:0,l:0};N.towns2=P.towns2||[];N.cos=P.cos||[];N.cfocus=P.cfocus;N.album=[];
  const c=P.kids.find(k=>k.name===N.first);if(c){for(const k of TALK)N.tal[k]=clamp(N.tal[k]+(c.talent||0)*.3+(c.bond||50)/20);N.p.mental=clamp(N.p.mental+(c.bond||50)/10);N.p.know=clamp(N.p.know+(c.know||0)*.3)}
  for(const t of ts){if(/インフルエンサー|クリエイター|配信者|人気者/.test(t)){N.sk.talk=clamp(N.sk.talk+5);N.p.rep=clamp(N.p.rep+5)}else if(/社長/.test(t))N.rp+=15;else if(/市長|国/.test(t)){N.p.rep=clamp(N.p.rep+10);if(N.town)N.town.support=clamp((N.town.support||50)+10)}else if(/億り人/.test(t))N.p.happy=clamp(N.p.happy+5);else if(/しあわせ|大往生/.test(t)){N.p.happy=clamp(N.p.happy+10);N.p.health=clamp(N.p.health+5)}else{const k=pick(TALK);N.tal[k]=clamp(N.tal[k]+5)}}
  N.seed=P.seed;N.goal=P.goal&&!P.goalDone?P.goal:'free';N.goalDone=0;N.body=pickBody();N.pers={careful:0,bold:0,kind:0,compet:0};}
function pickBody(){const a=BODY.slice();const out=[];for(let i=0;i<2;i++)out.push(a.splice(RI(0,a.length-1),1)[0].k);return out}

// ----- 生まれた直後の設定 -----
function birthHook(o){ensureV6();S.seed=o.seed;{const _r=Math.random;Math.random=mulberry32(o.seed+7);try{S.body=pickBody()}finally{Math.random=_r}}S.goal=o.goal&&GOALS[o.goal]?o.goal:pick(Object.keys(GOALS).filter(k=>k!=='free'));S.goalDone=0;ticker(`${S.region.n}で${S.name}が生まれた（${S.y}年）`);birthHook7()}
EV.birth.text=(base=>()=>base()+`\n\n生まれの番号：${seedCode(S.seed)}（同じ番号で友達も同じ生まれになれる）\n体の特徴：${S.body.map(k=>BODY.find(b=>b.k===k).n).join('・')}\n人生の目標：${GOALS[S.goal].n}`)(EV.birth.text);

// ----- 人生の選択 -----
const REGION_MOVE=300000;
function choicePanel(){const a=age();let h='<p class="hint">人生を大きく変える選択。どれも取り消せないので、よく考えて。</p><div id="confirmBox"></div>';
  const btn=(act,label,dis,extra)=>`<button class="b sm" type="button" data-act="${act}" ${extra||''} ${dis?'disabled':''}>${label}</button>`;
  h+='<h3>恋愛・家族</h3><div class="row">';
  if(!S.partner&&!S.spouse){if(a>=16){const cd=S.cd.seek!=null&&S.am-S.cd.seek<3;h+=btn('seek','恋人を探す（友達の紹介）',cd,'data-m="intro"')+btn('seek','恋人を探す（趣味のサークル）',cd,'data-m="circle"')+(a>=18?btn('seek','恋人を探す（マッチングアプリ）',cd,'data-m="app"'):'')+(cd?'<span class="hint">次に探せるのは少し先</span>':'')}else h+='<span class="hint">16歳から恋人を探せる。</span>'}
  if(S.partner){h+=btn('cAsk','プロポーズする',a<18||S.partner.rel<50,'data-c="propose"')+btn('cAsk','別れる',false,'data-c="breakup"')}
  if(S.spouse){h+=btn('cAsk','子どもを考える',S.kids.length>=4||a>(S.g==='女'?44:52)||(S.flags.tryKid&&S.am<S.flags.tryKid),'data-c="trykid"')+btn('cAsk','離婚する',false,'data-c="divorce"')}
  h+='</div><h3>仕事・学び</h3><div class="row">';
  if(S.st==='work')h+=btn('cAsk','転職活動をする',false,'data-c="change"')+btn('cAsk','会社を辞めて専業クリエイターに',false,'data-c="quit"')+btn('cAsk','休職する（6か月）',S.flags.gap&&S.am<=S.flags.gap,'data-c="gap"');
  if((S.st==='creator'||S.st==='free')&&a>=18&&a<65)h+=btn('cAsk','就職活動をする',!!S.flags.ronin,'data-c="hunt"');
  if(a>=20&&a<60&&S.st!=='univ')h+=btn('cAsk','大学に入り直す',false,'data-c="univ"');
  if(a>=18&&!has('company'))h+='<span class="hint">起業（事務所）は研究「会社経営の基本」で解放。</span>';
  h+='</div><h3>住む場所</h3><div class="row">';
  if(a>=18){h+=`<select id="mvReg">${S.regions.map((r,i)=>r.n===S.region.n?'':`<option value="${i}">${esc(r.n)}（${esc(r.type)}）</option>`).join('')}</select>`+btn('cAsk',`別の地域へ引っ越す（${yen(REGION_MOVE*Math.max(.2,S.cty.inc))}）`,S.money<REGION_MOVE*Math.max(.2,S.cty.inc),'data-c="move"')}
  if(a>=20){h+=`<select id="mvCty">${Object.keys(COUNTRIES).filter(k=>k!==S.ctyId).map(k=>`<option value="${k}">${esc(COUNTRIES[k].n)}</option>`).join('')}</select>`+btn('cAsk','海外へ移住する（100万円）',S.money<1000000,'data-c="abroad"')}
  if(a<18)h+='<span class="hint">18歳から選べる。</span>';
  return h+'</div><p class="hint">ほかの国へ移住すると、その国の物価や収入で暮らすことになる。ふるさとのまちや会社はそのまま残る。</p>'}
function seekLover(m){if(S.cd.seek!=null&&S.am-S.cd.seek<3)return;S.cd.seek=S.am;const base={intro:.35,circle:.3,app:.4}[m]+(S.sk.looks+S.p.social)/250+(persTop()==='bold'?.08:0)-(S.body.includes('shy')?.1:0);
  if(m==='app'){ad('priv',-2);outc('date',Math.round(3000*Math.max(.2,S.cty.inc)))}
  if(chance(clamp(base,.1,.85))){S.partner=mkNpc('恋人');S.partner.rel=45;tl(S.partner.name+'と付き合い始めた');ad('happy',6);openModal(`<div class="mcat">恋愛</div><h2>出会い</h2><p class="mtext">${{intro:'友達の紹介で',circle:'趣味のサークルで',app:'マッチングアプリで'}[m]}${esc(S.partner.name)}（${esc(S.partner.trait)}）と出会い、付き合うことになった！\n「予定」で「デート」を選ぶと仲が深まる。</p><button class="b pri" type="button" data-act="close">閉じる</button>`)}
  else{ad('mental',-2);openModal(`<div class="mcat">恋愛</div><h2>今回はご縁がなかった</h2><p class="mtext">何人かと会ってみたが、ピンとくる人はいなかった。\n見た目や人間関係を磨くと、出会いやすくなる。</p><button class="b pri" type="button" data-act="close">閉じる</button>`)}save();render()}
const CHOICE_TXT={propose:'プロポーズする？',breakup:'恋人と別れる？',divorce:'離婚する？ 財産の一部を分けることになる。',trykid:'子どもを授かることを考える？（この先1年ほど、子どもが生まれやすくなる）',change:'転職活動をする？',quit:'会社を辞めて専業クリエイターになる？ 給料がなくなる。',gap:'6か月休職する？ その間は給料が出ないが、心と体が回復する。',hunt:'就職活動をする？',univ:'大学に入り直す？ 4年間は大学生になる（仕事は辞める）。学費は奨学金になる。',move:'別の地域へ引っ越す？',abroad:'海外へ移住する？ 物価や収入がその国のものに変わる。'};
function doChoice(c){const ci2=Math.max(.2,S.cty.inc);
  if(c==='propose'){S.q.push('l_propose');const e=EV[S.q.shift()];closeModal();showEvent(e);return}
  if(c==='breakup'){tl(S.partner.name+'と別れた');S.partner=null;ad('happy',-6);ad('mental',-3);persAdd('bold',2)}
  if(c==='divorce'){divorce()}
  if(c==='trykid'){S.flags.tryKid=S.am+12;log('子どもを授かることを考え始めた','life')}
  if(c==='change'||c==='hunt'){S.offers=null;showEvent(EV.jobhunt);return}
  if(c==='quit'){S.st='creator';S.job=null;S.salary=0;tl('会社を辞めて専業クリエイターに')}
  if(c==='gap'){S.flags.gap=S.am+6;tl('6か月休職した')}
  if(c==='univ'){S.st='univ';S.uniEnd=S.am+48;S.job=null;S.salary=0;S.debt+=Math.round(2400000*ci2);S.flags.hadDebt=1;tl('大学に入り直した')}
  if(c==='move'){const i=+($('#mvReg')||{}).value;const r=S.regions[i];if(!r)return;outc('move',Math.round(REGION_MOVE*ci2));S.region=r;ad('social',-5);tl(r.n+'へ引っ越した')}
  if(c==='abroad'){const id=($('#mvCty')||{}).value;if(!COUNTRIES[id])return;outc('move',1000000);const old=S.cty.n;S.cty=Object.assign({},COUNTRIES[id]);S.ctyId=id;S.regions=regionsFor(id);S.region=wpick(S.regions);ad('social',-10);ad('know',5);S.indep=1;if(!S.home)S.home=1;tl(`${old}から${S.cty.n}へ移住した`);ticker(`${S.name}、${S.cty.n}へ移住`)}
  closeModal();save();render()}
document.addEventListener('click',e=>{const b=e.target.closest('button');if(!b||!S)return;const a=b.dataset.act;
  if(a==='seek'){seekLover(b.dataset.m);return}
  if(a==='cAsk'){const c=b.dataset.c;const box=$('#confirmBox');if(!box)return;box.innerHTML=`<div class="card warn"><p class="mtext">${CHOICE_TXT[c]}</p><div class="row"><button class="b sm danger" type="button" data-act="cYes" data-c="${c}">決める</button><button class="b sm" type="button" data-act="cancel">やめておく</button></div></div>`;box.scrollIntoView({block:'nearest'});return}
  if(a==='cYes'){doChoice(b.dataset.c);return}
  if(a==='takeDisc'){takeDisciple();return}
  if(a==='goalSet'){const v=$('#goalSel').value;if(GOALS[v]&&(!S.goalSetAm||S.am-S.goalSetAm>=120||S.goalDone)){S.goal=v;S.goalDone=0;S.goalSetAm=S.am;log(`人生の目標を「${GOALS[v].n}」にした`,'life');save();renderPanel()}return}
});

// ----- 人生タブの追加画面 -----
function lifeExtra(sub){
  if(sub==='choice')return choicePanel();
  if(sub==='goal'){const g=GOALS[S.goal||'free'];const p=g.prog?clamp(g.prog()*100):0;const can=!S.goalSetAm||S.am-S.goalSetAm>=120||S.goalDone;
    let h=`<h2>人生の目標</h2><div class="card"><div class="hd"><span>${esc(g.n)}</span>${S.goalDone?'<span class="chip up">達成！</span>':''}</div>${g.d?`<p class="hint">${esc(g.d)}</p>`:''}${g.prog?`${bar(p,'g')}<p class="hint">達成度 ${Math.round(p)}%</p>`:''}</div>`;
    h+=`<h3>目標を変える</h3><p class="hint">${can?'今なら変えられる（変えると10年間は変えられない）。':'次に変えられるのは'+Math.ceil((120-(S.am-S.goalSetAm))/12)+'年後。'}</p><div class="row"><select id="goalSel">${Object.entries(GOALS).map(([k,x])=>`<option value="${k}" ${S.goal===k?'selected':''}>${esc(x.n)}</option>`).join('')}</select><button class="b sm" type="button" data-act="goalSet" ${can?'':'disabled'}>この目標にする</button></div>`;
    h+=`<h2>性格</h2><div class="bars">${Object.entries(PERS).map(([k,n])=>`<span>${n}</span>${bar(S.pers[k],'m')}<span class="v">${Math.round(S.pers[k])}</span>`).join('')}</div><p class="hint">選んできた行動や選択で育つ。いちばん強い性格（${persTop()?PERS[persTop()]:'まだ決まっていない'}）によって、出来事で選べる道が増えたり、得意なことが変わる。</p>`;
    h+=`<h2>体の特徴</h2><p>${S.body.map(k=>{const b=BODY.find(x=>x.k===k);return `<span class="chip">${esc(b.n)}</span>`}).join(' ')}</p>`;
    if(S.legacy&&S.legacy.length)h+=`<h2>家系の遺産</h2><p>${S.legacy.map(t=>`<span class="chip">${esc(t)}</span>`).join(' ')}</p><p class="hint">先祖の称号が、生まれつきの力として受け継がれている。</p>`;
    if(S.regrets.length)h+=`<h2>心残り</h2><ul class="small">${S.regrets.map(r=>`<li>${r.age}歳「${esc(r.t)}」で「${esc(r.c)}」を選ばなかった</li>`).join('')}</ul><p class="hint">年をとってから、回収するチャンスが来ることがある。</p>`;
    h+=`<h2>生まれの番号</h2><p class="big">${seedCode(S.seed||0)}</p><p class="hint">友達にこの番号を教えると、同じ国・家庭・素質で生まれられる。どちらがうまく生きられるか競ってみよう。</p>`;
    return h}
  if(sub==='map'){let h=`<canvas id="relMap" width="360" height="360"></canvas><p class="hint">線の色：緑＝仲がいい・灰＝ふつう・赤＝仲が悪い。太いほど仲がいい。</p>`;
    const known=[...S.friends,S.rival,...S.sibs].filter(n=>n&&n.news);if(known.length)h+=`<h3>知り合いの近況</h3><ul class="small">${known.map(n=>`<li>${esc(pn(n))}：${esc(n.news)}</li>`).join('')}</ul>`;
    h+='<h3>弟子</h3>';if(S.disc.length)h+=S.disc.map(d=>`<div class="shop"><div><div>${esc(d.name)}</div><div class="muted small">${esc(GENRES[d.genre].n)}・フォロワー${num(d.f)}人</div></div></div>`).join('');
    const ok=age()>=35&&totalF()>=10000&&S.disc.length<3;h+=`<div class="row"><button class="b sm" type="button" data-act="takeDisc" ${ok?'':'disabled'}>弟子をとる</button><span class="hint">${S.disc.length>=3?'弟子は3人まで':'35歳以上・フォロワー1万人以上でとれる。あなたの話術・企画・編集が高いほど弟子が育つ'}</span></div>`;
    if(S.kids.length)h+=`<h3>子どもとの絆</h3><div class="bars">${S.kids.map(c=>`<span>${esc(c.name)}</span>${bar(c.bond,'p')}<span class="v">${Math.round(c.bond)}</span>`).join('')}</div><p class="hint">「予定」で「子育て」を選ぶと深まる。エンドレスでは、絆が強い子ほど力を受け継ぐ。</p>`;
    return h}
  if(sub==='album')return `<h2>思い出アルバム</h2>${albumHtml(S.album)}`;
  return '';
}
