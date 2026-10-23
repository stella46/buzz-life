
// ===== v2.4：大計画をさらに追加（インフラ・人口・銀河。京・垓の計画も） =====
(function(){const L=[];const add=(...r)=>L.push(r);
 // インフラ（8分野×5段階）
 const INF=[['en','エネルギー',['まちぐるみの太陽光','国じゅうの風力発電','海の波力発電所','核融合発電所','宇宙太陽光発電'],{income:1}],
  ['wt','水',['雨水をためるまち','巨大な浄水場','海水を真水にする大工場','大陸をつなぐ水道','空気から水をつくる塔'],{soc:1}],
  ['fd','食料',['植物工場','海の牧場','砂漠の農場','培養肉の大工場','宇宙農園'],{soc:1}],
  ['hs','住まい',['10万戸の住宅','空中住宅','海上住宅','地下住宅','百億人の住まい'],{happy:5}],
  ['tr','交通',['自動運転バス網','リニアの全国網','大陸横断鉄道','空飛ぶタクシー網','真空チューブ列車'],{dev:20}],
  ['cm','通信',['光回線の全国網','次世代の基地局','海底ケーブル網','衛星通信網','量子通信網'],{f:.03}],
  ['md','医療',['地域の総合病院','遠隔医療の網','ロボット手術センター','再生医療センター','病気のない世界計画'],{med:1}],
  ['ed','教育',['オンライン学校','世界の大学連合','AI家庭教師','百億人の教室','宇宙学校'],{rp:20}]];
 const IC=[3e11,2e12,1.5e13,1e14,1e15],ID=[36,60,84,108,144],IY=[1990,2005,2025,2045,2065],IR=[8,12,18,25,35];
 for(const [k,cn,names,f0] of INF)names.forEach((n,i)=>{const fx={rep:IR[i]};for(const [a,b] of Object.entries(f0))fx[a]=a==='income'?Math.round(IC[i]/400):a==='dev'?b*(i+1):a==='rp'?b*(i+1):a==='f'?b:a==='happy'?b+i*2:b;
  add(`inf_${k}${i+1}`,n,'インフラ',IC[i],ID[i],IY[i],`${cn}の整備（${i+1}段階目）。人口をふやす計画の土台になる`+(f0.income?'。毎月の収入':''),fx,i?`inf_${k}${i}`:undefined)});
 // 人口（インフラがそろうと、人類をふやせる）
 add('pop1','子育て応援の国づくり','人口',5e11,48,1980,'出産と子育てを国ぐるみで支える。人口が5000万人ふえる',{rep:10,pop:5e7,happy:5},'inf_hs1');
 add('pop2','世界の子育て支援','人口',3e12,72,1995,'世界中の家族を支える。人口が3億人ふえる',{rep:18,pop:3e8,soc:1},'inf_md2');
 add('pop3','十億人ふえる世界','人口',2e13,96,2020,'食料と住まいを用意して、人口が10億人ふえる',{rep:25,pop:1e9},'inf_fd3');
 add('pop4','海と地下の新しい国々','人口',1e14,120,2040,'海の上と地下に国をつくり、人口が30億人ふえる',{rep:35,pop:3e9},'inf_hs4');
 add('pop5','百億人の地球','人口',5e14,144,2055,'水も電気も足りる地球に。人口が50億人ふえ、そのあとも毎月少しずつふえる',{rep:45,pop:5e9,popM:2e6},'inf_wt5');
 add('pop6','二百億人の地球','人口',3e15,180,2070,'空中都市と緑の摩天楼で、人口が100億人ふえる',{rep:55,pop:1e10,popM:5e6},'pop5');
 add('pop7','月の百万人都市','人口',8e14,120,2065,'月に人が移り住む。人口が100万人ふえ、月にもファンができる',{rep:30,pop:1e6,popM:2e4},'mooncity');
 add('pop8','火星の十億人','人口',2e16,240,2090,'火星に十億人のまちをつくる',{rep:70,pop:1e9,popM:1e6,title:'火星の父'},'marscity');
 // 銀河（京・垓の計画）
 add('mercury','水星の鉱山','銀河',3e15,120,2080,'水星の豊かな金属を掘る。毎月ばく大な収入',{rep:30,income:3e13},'asteroid');
 add('colony1','宇宙コロニー第1号','銀河',2e14,120,2060,'1000万人が住める回転する宇宙都市',{rep:30,pop:1e7,popM:1e4},'station');
 add('colony100','宇宙コロニー百基','銀河',5e15,180,2080,'百基のコロニーに10億人が暮らす',{rep:50,pop:1e9,popM:1e6},'colony1');
 add('gasgiant','木星のガス採掘','銀河',3e16,180,2090,'巨大なガス惑星から燃料をくみ上げる。毎月の収入',{rep:40,income:3e14},'mercury');
 add('terraform','火星を緑の星に','銀河',1e17,360,2100,'火星を人が住める星に変える。人口が50億人ふえる',{rep:90,pop:5e9,popM:5e6,title:'星をつくった人'},'pop8');
 add('venusc','金星の空中都市','銀河',3e16,240,2095,'金星の雲の上に浮かぶまち。人口が20億人ふえる',{rep:60,pop:2e9},'venus');
 add('titan','タイタンの開拓','銀河',5e16,240,2100,'土星の衛星に基地と海の研究所をつくる',{rep:50,rp:600,pop:1e8},'jupiter');
 add('starship','恒星間移民船','銀河',2e17,300,2110,'何世代もかけて隣の星へ向かう巨大な船',{rep:80,pop:1e7,title:'星の旅人'},'solarsail');
 add('alpha','隣の星系への移住','銀河',5e17,360,2140,'隣の星系に新しい世界をつくる。人口が100億人ふえる',{rep:100,pop:1e10,popM:1e7},'starship');
 add('starlift','恒星の資源の採取','銀河',5e17,300,2130,'恒星から直接資源を取り出す。毎月とてつもない収入',{rep:60,income:5e15},'gasgiant');
 add('ringworld','リングワールド','銀河',1e18,480,2150,'恒星をぐるりと囲む輪の大地。人口が1兆人ふえる',{rep:150,pop:1e12,popM:1e9,title:'輪の世界の主'},'alpha');
 add('galnet','銀河ネットワーク','銀河',3e18,360,2150,'銀河のどこにでも一瞬で届く通信網。フォロワーが大きくふえる',{rep:80,f:.5,rp:1000},'ringworld');
 add('blackhole','ブラックホール発電','銀河',2e19,480,2160,'ブラックホールからエネルギーを取り出す。毎月想像をこえる収入',{rep:120,income:2e17},'starlift');
 add('dysonsph','ダイソン球','銀河',1e19,600,2170,'恒星をまるごと包んで、すべての光を使う',{rep:150,income:1e17,pop:1e11,title:'恒星を包んだ者'},'dyson');
 add('galfed','銀河連邦の設立','銀河',5e19,600,2200,'星々の人々と一つの連邦をつくる',{rep:200,pop:1e12,title:'銀河連邦の初代代表'},'galnet');
 add('universe','宇宙の果てを見る','銀河',1e20,720,2200,'1垓円をかけて、宇宙の果てまで観測する',{rep:250,rp:5000,title:'宇宙の果てを見た者'},'galfed');
 add('bigbang','宇宙のはじまりの再現','銀河',5e20,720,2250,'小さな宇宙のはじまりを、実験室で再現する',{rep:300,rp:10000,title:'創世の研究者'},'universe');
 // 社会・夢・ぜいたく・エンタメ・ふしぎ（大きな規模）
 add('basicinc','みんなに生活費','社会',5e13,60,2030,'国じゅうの人に毎月の生活費を配る',{rep:60,soc:1,happy:15});
 add('nopoverty','世界から貧困をなくす','社会',5e14,180,2040,'世界中の人が安心して暮らせるように',{rep:100,soc:1,happy:10},'basicinc');
 add('worldpeace','戦争のない世界','社会',1e15,240,2050,'争いをなくすための仕組みを世界中に',{rep:120,soc:1,title:'平和の人'},'peace');
 add('freemed','世界の医療を無料に','社会',3e14,120,2040,'だれでも無料で治療を受けられる世界',{rep:80,soc:1,med:1},'inf_md3');
 add('freeedu','世界の教育を無料に','社会',2e14,120,2035,'だれでも無料で学べる世界',{rep:70,soc:1,rp:100},'inf_ed2');
 add('climate','気候を元に戻す','地球',3e15,240,2050,'温暖化を止め、昔の気候を取りもどす',{rep:120,soc:1,happy:10},'renew');
 add('icefix','北極の氷の復活','地球',5e14,180,2045,'とけた氷を取りもどす',{rep:50,soc:1},'glacier');
 add('oceanclean','すべての海をきれいに','地球',8e14,180,2040,'海のごみをすべて回収する',{rep:70,soc:1},'coral');
 add('newcont','新しい大陸','地球',5e15,300,2070,'海の上に大陸をつくる。新しいまちとして持てる。人口が10億人ふえる',{rep:80,pop:1e9,town:'新大陸アトラ'},'inf_hs4');
 add('mindup','心で話す装置','夢',5e15,240,2080,'言葉を使わずに気持ちを伝える',{rep:60,f:.1,rp:500});
 add('immortal','不老不死の研究','夢',5e16,360,2090,'人の寿命の限界をこえる研究',{rep:100,life:1,title:'永遠を目指した人'},'ageless');
 add('weatherw','世界の天気を整える','夢',2e16,240,2080,'災害が起きないように天気を整える',{rep:90,soc:1},'weather');
 add('timetrip','時間旅行の実験','ふしぎ',1e18,480,2150,'過去や未来へ行けるかを本気で試す',{rep:150,rp:3000,title:'時をかけた人'},'timelab');
 add('pworld','並行世界への扉','ふしぎ',3e18,480,2160,'もうひとつの世界への扉をひらく',{rep:180,rp:4000,title:'扉をひらいた人'},'parallel');
 add('aliencity','宇宙人との交流都市','ふしぎ',5e17,360,2140,'星の外の人たちと暮らすまち',{rep:150,f:.3,pop:1e9},'hello');
 add('myplanet','自分の惑星','ぜいたく',5e16,240,2100,'宇宙のどこかに、自分だけの惑星を持つ',{rep:20,happy:30,title:'惑星の持ち主'},'starship');
 add('moonface','月に記念の絵を描く','ぜいたく',3e15,120,2080,'月の表面に、地球から見える大きな絵を描く',{rep:10,f:.1,happy:15},'moonbase');
 add('ringhouse','土星の輪の別荘','ぜいたく',2e16,180,2100,'土星の輪が見える別荘',{rep:10,happy:25},'titan');
 add('galexpo','銀河万博','エンタメ',1e17,240,2120,'銀河中から人が集まる博覧会',{rep:100,f:.3},'colony100');
 add('spaceolym','宇宙オリンピック','エンタメ',5e16,180,2100,'無重力の競技が行われる大会',{rep:80,f:.2},'colony1');
 add('galmovie','銀河映画祭','エンタメ',1e16,120,2090,'星々の作品が集まる映画祭',{rep:50,f:.15},'spacelive');
 add('univfes','全宇宙音楽フェス','エンタメ',5e17,240,2150,'星々のアーティストが集まる',{rep:120,f:.4},'galexpo');

 add('lunarrail','月面鉄道','宇宙',2e15,96,2070,'月のまちとまちを結ぶ鉄道',{rep:20,dev:30},'mooncity');
 add('marsrail','火星の大陸鉄道','宇宙',5e15,120,2090,'火星の都市を結ぶ鉄道',{rep:25,dev:40},'marscity');
 add('spacehosp','宇宙病院','宇宙',5e14,72,2050,'無重力を生かした治療ができる病院',{rep:20,med:1},'station');
 add('orbitring','地球を囲む軌道リング','宇宙',5e16,240,2090,'地球のまわりをぐるりと囲む巨大な輪',{rep:60,income:5e13},'elevator');
 add('moonfarm','月の農場','宇宙',1e15,84,2060,'月で野菜と穀物を育てる',{rep:15,soc:1},'moonbase');
 add('astercity','小惑星をくりぬいた都市','宇宙',3e16,180,2090,'小惑星の中に5億人が住めるまちをつくる',{rep:45,pop:5e8},'asteroid');
 add('comet','彗星に乗る探査','宇宙',2e15,120,2060,'彗星に着陸して、太陽系の旅に出る',{rep:25,rp:200});
 add('sunshield','太陽の日よけ','宇宙',1e16,180,2080,'宇宙に巨大な日よけを置いて、地球を冷やす',{rep:60,soc:1},'climate');
 add('desertriver','砂漠に川をつくる','地球',2e15,120,2060,'砂漠に大きな川を流して、緑の大地に',{rep:50,soc:1,pop:2e8},'inf_wt4');
 add('seawall','海面上昇を防ぐ大堤防','地球',1e15,120,2040,'世界の海岸のまちを守る',{rep:45,soc:1});
 add('jungle','熱帯雨林の再生','地球',5e14,120,2030,'失われた森をよみがえらせる',{rep:35,soc:1,happy:5});
 add('skybridge','大陸を結ぶ空中橋','地球',8e15,180,2080,'海の上空をわたる超巨大な橋',{rep:40,dev:60},'inf_tr4');
 add('robotcity','ロボットだけで動く都市','夢',3e15,120,2060,'働くのはロボット。人はやりたいことだけをするまち',{rep:30,happy:15,income:1e12},'robot');
 add('dreamnet','夢でつながるネット','夢',1e16,180,2090,'眠っている間に、夢の中で人と会える',{rep:40,f:.2},'dreamcam');
 add('animalgov','動物と人の会議','夢',5e15,120,2070,'動物の声も聞いて、地球のことを決める',{rep:40,soc:1},'animal');
 add('seedbank','すべての生き物の種の保存','夢',3e14,60,2020,'地球の生き物の種をすべて未来に残す',{rep:30,soc:1});
 add('spacelib','人類の知の図書館','社会',1e16,180,2080,'人類のすべての知識を、宇宙にも残す図書館',{rep:60,rp:800},'library');
 add('ai4all','だれでも使える賢いAI','社会',5e15,120,2060,'世界中の人に、自分専用のAIを',{rep:60,soc:1,rp:300},'mind');
 add('nodisaster','災害ゼロの世界','社会',5e15,180,2070,'地震も台風も、被害が出ない世界に',{rep:80,soc:1},'rescue');
 add('goldmoon','月に黄金の像','ぜいたく',1e16,120,2080,'月面に、地球から見える黄金の像を',{rep:5,happy:20,f:.05},'moonbase');
 add('spaceyacht','宇宙ヨット','ぜいたく',5e15,60,2060,'星のあいだを旅する、自分だけのヨット',{rep:8,happy:20},'station');
 add('privstation','自分専用の宇宙ステーション','ぜいたく',8e15,96,2060,'宇宙に自分の家を',{rep:10,happy:25},'station');
 add('moonstadium','月面スタジアム','エンタメ',5e15,96,2075,'低い重力で、地球ではできない試合を',{rep:40,f:.15,income:5e12},'mooncity');
 add('planetpark','惑星まるごとテーマパーク','エンタメ',3e16,180,2110,'ひとつの惑星が、まるごと遊園地',{rep:60,f:.25,income:1e14},'myplanet');
 add('ghostship','幽霊船の謎を追う','ふしぎ',5e13,36,2000,'世界中の海で目撃される幽霊船を追う',{rep:5,f:.03});
 add('legendbeast','伝説の生き物を探す','ふしぎ',3e13,48,1990,'山奥にいるという伝説の生き物を探す',{rep:5,f:.03});
 for(const r of L){if(MEGA[r[0]])continue;MEGA_RAW.push(r);const [k,n,cat,c,dur,yr,d,fx,req]=r;MEGA[k]={k,n,cat,c,dur,yr,d,fx,req}}
 for(const c of ['インフラ','人口','銀河'])if(!MEGA_CATS.includes(c))MEGA_CATS.push(c)})();

// ----- 人口 -----
function worldPop(){return WORLD_POP+((S&&S.popAdd)||0)}
const _mcp49=megaComplete;megaComplete=function(m){const r=_mcp49.apply(this,arguments);try{const fx=m.fx||{};if(fx.pop){const v=Math.round(fx.pop*(1+.05*rt('pop')));S.popAdd=(S.popAdd||0)+v;log(`世界の人口が${num(v)}人ふえた（いま約${num(worldPop())}人）`,'good');if(typeof hlAdd==='function')hlAdd(`👶 人口 +${num(v)}人`)}}catch(e){console.error(e)}return r};
const _mh49=monthHook11;monthHook11=function(){_mh49();try{for(const x of (S.mega||[])){if(!x.done)continue;const m=MEGA[x.k];if(m&&m.fx&&m.fx.popM)S.popAdd=(S.popAdd||0)+m.fx.popM*(1+.05*rt('pop'))}}catch(e){console.error(e)}};
// 全世界に届くようになったら、人口がふえるほど届く人数もふえる
const _wm49=worldMul;worldMul=function(){const m=_wm49.apply(this,arguments);try{if(S&&S.world&&S.world.r.includes('global')&&S.popAdd)return m*worldPop()/WORLD_POP}catch(_){}return m};

// ----- 大計画の画面（始められるもの・建設中を上に、まだ先のものはたたむ） -----
megaHtml=function(){const all=Object.values(MEGA),done=all.filter(m=>megaDone(m.k)).length;
 let h=`<h3>大計画 <span class="chip">${done} / ${all.length}</span></h3><p class="hint">持っているお金：<b>${yen(S.money)}</b>${S.popAdd?`／世界の人口 約${num(worldPop())}人`:''}</p><div class="seg wrapseg">${MEGA_CATS.map(c=>`<button type="button" class="${MEGACAT===c?'on':''}" data-megacat="${c}">${c}<small> ${all.filter(m=>m.cat===c&&megaDone(m.k)).length}/${all.filter(m=>m.cat===c).length}</small></button>`).join('')}</div>`;
 const run=(S.mega||[]).filter(x=>!x.done);if(run.length)h+=`<p class="small">建設中：${run.map(x=>esc((MEGA[x.k]||{}).n||'')+`（あと${Math.max(0,x.st+x.dur-S.am)}か月）`).join('、')}</p>`;
 const list=all.filter(x=>x.cat===MEGACAT).sort((a,b)=>a.c-b.c);
 const row=m=>{const x=megaOf(m.k),lockY=S.y<m.yr,lockR=m.req&&!megaDone(m.req);let st='';if(x&&x.done)st='<span class="chip up">完成</span>';else if(x)st=`<span class="chip">建設中 あと${Math.max(0,x.st+x.dur-S.am)}か月</span>`;
  return `<div class="shop"><div><div>${esc(m.n)} ${st}</div><div class="muted small">${esc(m.d)}<br><b>${yen(megaCost(m))}</b>・約${Math.round(m.dur/12*10)/10}年${lockY?`（${m.yr}年から）`:''}${lockR?`（先に「${esc((MEGA[m.req]||{}).n||'')}」）`:''}</div>${x&&!x.done?`<div class="tbar"><i style="width:${Math.min(100,(S.am-x.st)/x.dur*100).toFixed(0)}%"></i></div>`:''}</div>${x?'':`<button class="b sm" type="button" data-mega="${m.k}" ${lockY||lockR||S.money<megaCost(m)||age()<20?'disabled':''}>始める</button>`}</div>`};
 const now=list.filter(m=>{const x=megaOf(m.k);return (x&&!x.done)||(!x&&S.y>=m.yr&&!(m.req&&!megaDone(m.req)))}),fin=list.filter(m=>megaDone(m.k)),later=list.filter(m=>!now.includes(m)&&!fin.includes(m));
 h+=now.length?now.map(row).join(''):'<p class="hint">この分類で、いま始められる計画はありません。</p>';
 if(later.length)h+=`<details class="mfold"><summary>まだ先の計画（${later.length}件）</summary>${later.map(row).join('')}</details>`;
 if(fin.length)h+=`<details class="mfold"><summary>完成した計画（${fin.length}件）</summary>${fin.map(row).join('')}</details>`;
 return h};
(function(){const A=(id,n,d,f)=>{ACH.push([id,n,d,f]);if(typeof ACH_CAT!=='undefined')ACH_CAT[id]='大計画'};
 A('pop_1e9','十億の命','大計画で世界の人口を10億人ふやす',()=>(S.popAdd||0)>=1e9);A('pop_1e11','千億の星の民','世界の人口を1000億人ふやす',()=>(S.popAdd||0)>=1e11);
 A('mega_kei','京の計画','1京円以上の大計画を完成させる',()=>(S.mega||[]).some(x=>x.done&&MEGA[x.k]&&MEGA[x.k].c>=1e16));
 ACH.push(['x_mega_gai','？','（ひみつ）',()=>megaDoneAny('universe'),1,'垓の果て','1垓円の大計画を完成させる','大計画']);if(typeof ACH_CAT!=='undefined')ACH_CAT.x_mega_gai='大計画'})();
