// ===== v0.7：時代・会社・新しいまち・遊び方 =====
Object.assign(INC_LBL,{co:'会社の利益',cosell:'会社の売却・上場'});Object.assign(OUT_LBL,{co:'会社の赤字・出資',dev:'まちの開発・管理費'});

// ----- 時代（生まれる年） -----
SNS.milu.era=2005;SNS.tsubu.era=2006;SNS.patto.era=2016;
const SNS_ERA=2005;
const snsEra=()=>S.y>=SNS_ERA;
function kidChLikely(){return S.kc.likely&&S.y>=2008}
const ERA_OPT={now:{n:'今（2026年）'},past:{n:'過去（1950〜2005年のどこか）'},future:{n:'未来（2030〜2080年のどこか）'},pick:{n:'自分で年を決める'}};
function eraYear(o){const k=o.era||'now';if(k==='past')return RI(1950,2005);if(k==='future')return RI(2030,2080);if(k==='pick'){const y=parseInt(o.yearIn,10);return y>=1940&&y<=2100?y:CFG.start}return CFG.start}
function eraName(y){return y<1989?'昭和':y<2019?'平成':y<=2026?'令和':'未来'}

// ----- 実際の出来事（過去〜今）と、未来の出来事（架空） -----
// eco：景気への影響（お店・会社・投資）。sns：SNSの伸びやすさ
const HIST=[
 {y:1955,s:'jp',t:'日本で高度経済成長が始まった。町に活気があふれている',eco:1.12,to:1973},
 {y:1957,s:'w',t:'世界で初めて人工衛星が打ち上げられた'},
 {y:1959,s:'jp',t:'テレビのある家が急に増えてきた'},
 {y:1964,s:'jp',t:'東京オリンピックが開かれ、東海道新幹線が開業した'},
 {y:1969,s:'w',t:'人類が初めて月に降り立った'},
 {y:1970,s:'jp',t:'大阪で万国博覧会が開かれた'},
 {y:1972,s:'jp',t:'沖縄が日本に復帰した'},
 {y:1973,s:'w',t:'オイルショック。物の値段が上がり、景気が冷え込んだ',eco:.85,to:1975},
 {y:1979,s:'w',t:'第二次オイルショックが起きた',eco:.93,to:1980},
 {y:1983,s:'jp',t:'家庭用ゲーム機が大ヒットしている'},
 {y:1986,s:'jp',t:'バブル景気。土地や株の値段がどんどん上がっている',eco:1.3,to:1991},
 {y:1989,s:'jp',t:'元号が「平成」に変わった。消費税（3%）が始まった'},
 {y:1989,s:'w',t:'ベルリンの壁が崩壊した'},
 {y:1991,s:'w',t:'ソビエト連邦が解体した'},
 {y:1992,s:'jp',t:'バブルが崩壊した。長い不景気が始まる',eco:.86,to:2002},
 {y:1995,s:'jp',t:'阪神・淡路大震災が起きた。多くの人が被災した',quake:1},
 {y:1995,s:'w',t:'家庭でもインターネットが使われ始めた'},
 {y:1997,s:'jp',t:'消費税が5%になった'},
 {y:1998,s:'jp',t:'長野で冬のオリンピックが開かれた'},
 {y:1999,s:'w',t:'携帯電話でメールやネットができるようになってきた'},
 {y:2002,s:'jp',t:'日本と韓国でサッカーのワールドカップが開かれた'},
 {y:2005,s:'w',t:'誰でも動画を投稿できるサイトが登場した'},
 {y:2007,s:'w',t:'スマートフォンが登場した'},
 {y:2008,s:'w',t:'リーマン・ショック。世界中で景気が悪くなった',eco:.8,to:2010},
 {y:2011,s:'jp',t:'東日本大震災が起きた。多くの人が被災した',quake:1},
 {y:2014,s:'jp',t:'消費税が8%になった'},
 {y:2016,s:'w',t:'短い動画のアプリが若者の間で流行り始めた'},
 {y:2019,s:'jp',t:'元号が「令和」に変わった。消費税が10%になった'},
 {y:2020,s:'w',t:'新しい感染症が世界中で流行。外出が減り、お店は苦しく、配信を見る人は増えた',eco:.72,to:2022,sns:1.25},
 {y:2021,s:'jp',t:'1年延期された東京オリンピックが開かれた'},
 {y:2022,s:'w',t:'会話ができるAIが話題になっている'},
 {y:2025,s:'jp',t:'大阪・関西万博が開かれた'},
 // ここから先は想像の未来
 {y:2032,s:'w',t:'【未来】自動運転のタクシーが当たり前になった'},
 {y:2038,s:'w',t:'【未来】世界的な好景気がやってきた',eco:1.15,to:2041},
 {y:2045,s:'w',t:'【未来】月への旅行ツアーが発売された'},
 {y:2052,s:'w',t:'【未来】空飛ぶ車が街の上を行き交っている'},
 {y:2058,s:'w',t:'【未来】世界的な不況。会社やお店に厳しい時代',eco:.82,to:2060},
 {y:2064,s:'w',t:'【未来】病気の治療が大きく進歩し、長生きする人が増えた'},
 {y:2070,s:'w',t:'【未来】火星に初めての町ができた'},
 {y:2080,s:'w',t:'【未来】家の中でどこへでも行ける没入型の旅が流行'},
 {y:2095,s:'w',t:'【未来】22世紀まであと少し。人々は新しい時代に胸をふくらませている'}
];
const histOk=h=>h.s==='w'||(h.s==='jp'&&S.ctyId==='japan');
function ecoMul(){let m=1;for(const h of HIST)if(h.eco&&histOk(h)&&S.y>=h.y&&S.y<h.to)m*=h.eco;return m}
function snsEraMul(){let m=1;for(const h of HIST)if(h.sns&&histOk(h)&&S.y>=h.y&&S.y<h.to)m*=h.sns;return m}
function histTick(){if(S.m!==1)return;for(const h of HIST){if(h.y!==S.y||!histOk(h))continue;const key='h'+h.y+h.s+HIST.indexOf(h);if(S.flags[key])continue;S.flags[key]=1;
  ticker(h.t);log(`${h.y}年：${h.t}`,'life');if(h.eco&&h.eco<1&&age()>=18&&(anyShop()||(S.cos&&S.cos.length)))S.q.push('hist_eco');if(h.quake&&age()>=10)S.q.push('hist_quake');if(h.eco>1&&age()>=18)S.q.push('hist_boom')}}
E('hist_eco',{t:'景気が悪くなった',cat:'時代',w:0,text:()=>`景気が冷え込んでいる。お店や会社の売上が落ちそうだ。（景気 ×${ecoMul().toFixed(2)}）`,ch:[['経費を見直して耐える',()=>{ad('plan',2);ad('mental',-2);return 'しばらくは我慢の時期だ。'}],['ピンチはチャンス。攻める',()=>{ad('rep',2);ad('mental',-4);persAdd('bold',2);return '安くなった今こそ、と前を向いた。'}]]});
E('hist_boom',{t:'好景気',cat:'時代',w:0,text:()=>`景気がいい。お店も会社も、売上が伸びやすい時代だ。（景気 ×${ecoMul().toFixed(2)}）`,ch:[['この波に乗る',()=>{ad('happy',3);return '新しいことを始めるなら今かもしれない。'}]]});
E('hist_quake',{t:'大きな地震',cat:'時代',w:0,text:()=>'大きな地震が起き、多くの人が被災したというニュースが流れている。',ch:[['寄付をする',()=>{if(S.money>0)ad('money',-Math.min(Math.max(0,S.money),age()<18?1000:30000));ad('rep',2);persAdd('kind',2);return '少しでも力になれたら。'}],['できることを考える',()=>{ad('know',1);ad('mental',-1);return '家族と、もしものときの備えを話し合った。'}]]});
E('era_sns',{t:'SNSの時代がやってきた',cat:'SNS',w:0,text:()=>`誰でも動画を投稿できるSNS「${SNS.milu.n}」が登場した。あなたは${age()}歳。今から始めてみる？`,
  ch:[['アカウントを作る',()=>{openSns('milu');S.main='milu';S.genre=topTal();tl('SNSを始めた');return '新しい時代の波に乗った。「発信」タブから投稿の方針を決めよう。'}],['今はやめておく',()=>'あとからでも「発信」タブで始められる。']]});

// 出来事の時代チェック（SNSより前の時代に、SNSやスマホの出来事が起きないように）
const MODERN_RE=/SNS|スマホ|動画|配信|ネット|アプリ|フォロワー|バズ|炎上|オンライン|サブスク|インフルエンサー|コメント欄|DM|AI|VR|通知|ドウガ広場|パット|ひとことSNS|案件|投稿|チャンネル|サーバー|アカウント/;
const _modern={};
function isModern(e){if(_modern[e.id]==null){let s=e.t+' ';try{s+=String(e.text)+String(typeof e.ch==='function'?'':e.ch.map(c=>c[0]).join(' '))}catch(_){}_modern[e.id]=MODERN_RE.test(s)}return _modern[e.id]}
function rollEvent(k){
  if(age()<1)return null;
  const spaced=S.lastEv!=null&&S.am-S.lastEv<(age()<13?1:2);
  const rate=age()<13?.45:.3,old=S.y<SNS_ERA&&!S.snsOpen;
  const hits=[];
  for(const id in EV){const e=EV[id];if(!e.w)continue;if(e.once&&S.seen[id])continue;if(e.cd&&S.cd[id]!=null&&S.am-S.cd[id]<e.cd)continue;if(old&&isModern(e))continue;let ok=true;try{ok=!e.when||e.when()}catch(_){ok=false}if(!ok)continue;if(e.w<1&&spaced)continue;if(chance(Math.min(1,e.w*(e.w>=1?1:rate))*k))hits.push(e)}
  const ev=hits.length?pick(hits):null;if(ev&&ev.w<1)S.lastEv=S.am;return ev;
}


// ----- 複数のまち（新しいまちの開発） -----
const DEVS=[
  {k:'newtown',n:'郊外のニュータウン',rt:'地方都市',cost:3e8,d:'家族連れが多い。住宅地の中にお店をつくる'},
  {k:'onsen',n:'山あいの温泉郷',rt:'町村',cost:2e8,d:'観光客が多い。温泉と旅館のまち',tour:2},
  {k:'resort',n:'海辺のリゾート',rt:'町村',cost:4e8,d:'観光客がとても多い',tour:3},
  {k:'bay',n:'湾岸の新都心',rt:'大都市',cost:8e8,d:'学生と大人が多い大都会'},
  {k:'future',n:'未来都市',rt:'大都市',cost:15e8,d:'2045年から。何でもそろう最先端のまち',year:2045,tour:1}
];
const TOWN_MAX=4;
// 開発したまちは、発展するほど人が住みつき、お客さんが増える
const popMul=()=>S.town&&S.town.kind?Math.min(1,.2+(S.town.dev||0)/100):1;
function allTowns(){return [S.town,...(S.towns2||[])]}
function homeTown(){return allTowns().find(t=>t.home)||S.town}
function withTown(T,fn){if(!T||T===S.town)return fn();const i=S.towns2.indexOf(T);if(i<0)return fn();const cur=S.town;S.towns2[i]=cur;S.town=T;try{return fn()}finally{S.towns2[i]=T;S.town=cur}}
function switchTown(T){const i=S.towns2.indexOf(T);if(i<0)return;S.towns2[i]=S.town;S.town=T}
const townName=T=>T.nm||S.region.n;
function devTown(k,nm){const tpk=($('#devTpl')||{}).value||'none';const d=DEVS.find(x=>x.k===k);const c=Math.round(d.cost*Math.max(.2,S.cty.inc)*devCostMul()*(TPL[tpk]||TPL.none).m);if(S.money<c||allTowns().length>TOWN_MAX)return;
  outc('dev',c);const T=newTown(d.rt);T.tiles.forEach(t=>{if(t.t==='house'&&chance(.55))t.t='empty'});T.nm=(nm||'').trim().slice(0,10)||d.n;T.rt=d.rt;T.kind=k;T.bonus=(T.bonus||0)+(d.tour||0)*4;T.support=50;T.reqs=[];T.sel=-1;
  if(d.tour)for(let j=0;j<d.tour;j++){const i=T.tiles.findIndex(t=>t.t==='empty');if(i>=0)T.tiles[i]={t:'tourism',lv:1}}
  S.towns2.push(T);switchTown(T);applyTpl(tpk);S.town.dev=calcDev();tl(`新しいまち「${T.nm}」の開発を始めた`);ticker(`${S.name}が新しいまち「${T.nm}」の開発に着手`);ad('rep',3);snd('buy');save();render()}
function otherTownsMonth(){const home=homeTown();let tot=0;
  for(const T of allTowns()){if(T===home)continue;withTown(T,()=>{let pr=0;S.town.tiles.forEach((t,i)=>{const b=BLD[t.t];if(!b)return;if(SHOP[t.t])pr+=shopCalc(i,true).profit;else pr+=Math.round(b.inc*t.lv*S.cty.inc*ecoMul()*popMul())});
    S.town.dev=calcDev();S.town.support=clamp((S.town.support||50)+(50-(S.town.support||50))*.02+S.town.dev/400);tot+=pr;const d=DEVS.find(x=>x.k===S.town.kind);if(d)bill('dev','まちの管理費（'+townName(S.town)+'）',d.cost*.0025*Math.max(.2,S.cty.inc)*(has('town_plan')?.7:1))})}
  if(tot>0)inc('biz',tot);else if(tot<0)outc('biz',-tot)}
function townSwitchHtml(){const ts=allTowns();let h='';
  if(ts.length>1)h+=`<div class="ctl"><span>まち</span><div class="seg">${[homeTown(),...ts.filter(t=>!t.home)].map(T=>`<button class="${T===S.town?'on':''}" type="button" data-town="${ts.indexOf(T)}">${esc(townName(T))}${T.home?'（ふるさと）':''}</button>`).join('')}</div></div>`;
  return h}
function devHtml(){const a=age();let h=`<h3>新しいまちを開発する</h3><p class="hint">空き地を買って、自分の手で新しいまちを育てる。持てるのはふるさとのほかに${TOWN_MAX}つまで。開発したまちのお店や施設の利益も毎月入る（そのかわり毎月の管理費がかかる）。</p>`;
  if(a<25)return h+'<p class="hint">25歳から開発できる。</p>';
  if(allTowns().length>TOWN_MAX)return h+'<p class="hint">これ以上は持てない。</p>';
  h+=`<div class="row"><input id="devName" maxlength="10" placeholder="まちの名前（空欄なら自動）"><select id="devTpl">${Object.entries(TPL).map(([k,t])=>`<option value="${k}">${t.n}${t.m>1?"（費用×1.3・最初から建物つき）":""}</option>`).join("")}</select></div>`;
  h+=DEVS.map(d=>{const c=Math.round(d.cost*Math.max(.2,S.cty.inc)*devCostMul());const lock=d.year&&S.y<d.year;return `<div class="shop"><div><div>${esc(d.n)} <span class="muted small">${yen(c)}</span></div><div class="muted small">${esc(d.d)}</div></div><button class="b sm" type="button" data-dev="${d.k}" ${lock||S.money<c?'disabled':''}>${lock?d.year+'年から':'開発する'}</button></div>`}).join('');
  return h}

// ----- 会社（代表として経営する） -----
const COS={
  food:{n:'飲食チェーン',c:3e7,r:.0075,v:.5,d:'安定して稼げる。景気の影響を受けやすい'},
  apparel:{n:'アパレルブランド',c:5e7,r:.007,v:.8,d:'フォロワーが多いほど売れる',fan:1},
  game:{n:'ゲーム開発会社',c:8e7,r:.009,v:1.6,d:'当たり外れが大きい',year:1978},
  it:{n:'IT・アプリ会社',c:1e8,r:.009,v:1.4,d:'大きく伸びることがある',year:1995},
  estate:{n:'不動産会社',c:2e8,r:.0055,v:.35,d:'ゆっくり確実。持っているまちが多いほど強い',town:1},
  media:{n:'メディア・出版社',c:6e7,r:.0075,v:.9,d:'評判が高いほど伸びる'},
  space:{n:'宇宙ベンチャー',c:5e8,r:.011,v:2.2,d:'2040年から。夢は大きく、リスクも大きい',year:2040}
};
const CO_MAX=30;
function coProfit(c,commit){const d=COS[c.k],ci=Math.max(.2,S.cty.inc);let m=d.r*(1+(c.lv-1)*.04)*(S.cfocus===c.id?1.2:1)*ecoMul()*coPerk();
  if(d.fan)m*=1+Math.min(.6,Math.log10(totalF()+1)/10);if(d.town)m*=1+.08*(allTowns().length-1);if(c.k==='media')m*=.7+S.p.rep/150;
  let p=c.cap*m*ci;if(commit)p*=1+R(-d.v,d.v)*.9;return Math.round(p)}
function cosMonth(){if(!S.cos||!S.cos.length)return;let tot=0;
  for(const c of S.cos){const p=coProfit(c,true);c.last=p;tot+=p;const ci=Math.max(.2,S.cty.inc),tgt=c.cap*Math.max(.3,.7+(coProfit(c,false)/ci/c.cap)*12*6)*(c.pub?1.3:1);c.val=Math.round(c.val+(tgt-c.val)*.08+c.val*R(-.015,.015));
    if(chance(.004*COS[c.k].v)&&!S.q.includes('co_ev'))S.coEv=c.id,S.q.push('co_ev')}
  if(tot>0)inc('co',tot);else if(tot<0)outc('co',-tot);
  if(S.cfocus)ad('mental',-.6)}
function coName(k){const ps=String(S.name).split(' ');const sur=S.cty&&S.cty.jp?ps[0]:ps[ps.length-1];return sur+pick({food:['フーズ','キッチン','食堂グループ'],apparel:['スタイル','ウェア','ブランズ'],game:['ゲームス','スタジオ','インタラクティブ'],it:['テック','ラボ','システムズ'],estate:['不動産','エステート','ホールディングス'],media:['メディア','出版','パブリッシング'],space:['スペース','宇宙開発','オービタル']}[k])}
function foundCo(k,nm){const d=COS[k],c=Math.round(d.c*Math.max(.2,S.cty.inc));if(S.money<c||S.cos.length>=CO_MAX)return;outc('co',c);
  const co={id:'c'+Date.now().toString(36)+RI(10,99),k,name:(nm||'').trim().slice(0,12)||coName(k),lv:1,cap:d.c,val:Math.round(d.c*.9),born:S.am,pub:0,last:0};S.cos.push(co);if(!S.cfocus)S.cfocus=co.id;
  tl(`会社「${co.name}」を設立して代表になった`);ticker(`${S.name}、${d.n}「${co.name}」を設立`);ad('rep',2);snd('buy');save();render()}
function coHtml(){const a=age();let h=`<p class="hint">あなたが代表（社長）を務める会社。出資するほど大きくなり、毎月の利益が入る。景気がいい時代は伸びやすく、悪い時代は赤字になることもある。</p>`;
  h+=`<div class="kv"><span>今の景気</span><span class="${ecoMul()>=1?'up':'dn'}">×${ecoMul().toFixed(2)}${ecoMul()>1.05?'（好景気）':ecoMul()<.95?'（不景気）':'（ふつう）'}</span></div>`;
  if(S.cos.length){let tl2=0,tv=0;for(const c of S.cos){tl2+=c.last||0;tv+=c.val}h+=`<div class="kv"><span>先月の利益（合計）</span><span class="${tl2>=0?'up':'dn'}">${tl2>=0?'+':''}${yen(tl2)}</span><span>会社の価値（合計）</span><span>${yen(tv)}</span></div>`}
  for(const c of S.cos){const d=COS[c.k],up=Math.round(d.c*c.lv*Math.max(.2,S.cty.inc)),est=coProfit(c,false);
    h+=`<div class="card"><div class="hd"><span>${esc(c.name)}</span><span class="muted small">${esc(d.n)}・Lv${c.lv}${c.pub?'・上場':''}</span></div><div class="kv"><span>先月の利益</span><span class="${(c.last||0)>=0?'up':'dn'}">${(c.last||0)>=0?'+':''}${yen(c.last||0)}</span><span>見込み（月）</span><span>${est>=0?'+':''}${yen(est)}</span><span>会社の価値</span><span>${yen(c.val)}</span></div>
    <div class="row"><button class="b sm ${S.cfocus===c.id?'on':''}" type="button" data-cfocus="${c.id}">${S.cfocus===c.id?'力を入れている':'代表として力を入れる'}</button><button class="b sm" type="button" data-cup="${c.id}" ${c.lv>=8||S.money<up?'disabled':''}>${c.lv>=8?'最大':'出資して大きくする '+yen(up)}</button>${!c.pub&&c.lv>=4?`<button class="b sm" type="button" data-cipo="${c.id}">上場する</button>`:''}<button class="b sm ghost" type="button" data-csell="${c.id}">売却</button></div></div>`}
  h+='<div id="coBox"></div>';
  if(a<20)return h+'<h3>会社を設立する</h3><p class="hint">20歳から設立できる。</p>';
  if(S.cos.length>=CO_MAX)return h+`<p class="hint">会社は${CO_MAX}社まで。</p>`;
  h+=`<h3>会社を設立する</h3><div class="row"><input id="coName" maxlength="12" placeholder="会社名（空欄なら自動）"></div>`;
  h+=Object.entries(COS).map(([k,d])=>{const c=Math.round(d.c*Math.max(.2,S.cty.inc)),lock=d.year&&S.y<d.year;return `<div class="shop"><div><div>${esc(d.n)} <span class="muted small">${yen(c)}</span></div><div class="muted small">${esc(d.d)}</div></div><button class="b sm" type="button" data-cfound="${k}" ${lock||S.money<c?'disabled':''}>${lock?d.year+'年から':'設立する'}</button></div>`}).join('');
  return h+'<p class="hint">「力を入れる」会社は利益と成長が上がるが、代表として忙しくなりメンタルが少し減る。</p>'}
E('co_ev',{t:'会社の出来事',cat:'仕事',w:0,text:()=>{const c=S.cos.find(x=>x.id===S.coEv);if(!c)return '会社で小さな出来事があった。';S.tmpCo=c;return pick([`「${c.name}」の新商品が大ヒットの兆し！`,`「${c.name}」で大きな取引の話が来ている。`,`「${c.name}」の社員から、新しい事業の提案があった。`])},
  ch:[['勝負に出る',()=>{const c=S.tmpCo;if(!c)return '';if(chance(.55)){const g=Math.round(c.cap*R(.1,.3)*Math.max(.2,S.cty.inc));inc('co',g);c.val=Math.round(c.val*1.15);ad('rep',2);return `うまくいった！ ${yen(g)}の利益。`}const l=Math.round(c.cap*R(.05,.15)*Math.max(.2,S.cty.inc));outc('co',l);c.val=Math.round(c.val*.92);ad('mental',-4);return `うまくいかなかった… ${yen(l)}の損失。`}],
     ['慎重に進める',()=>{const c=S.tmpCo;if(c){const g=Math.round(c.cap*.04*Math.max(.2,S.cty.inc));inc('co',g)}persAdd('careful',1);return '小さく確実に成果を出した。'}]]});
document.addEventListener('click',e=>{const b=e.target.closest('button');if(!b||!S)return;const d=b.dataset;
  if(d.cfound){foundCo(d.cfound,($('#coName')||{}).value);return}
  if(d.cfocus){S.cfocus=S.cfocus===d.cfocus?null:d.cfocus;save();renderPanel();return}
  if(d.cup){const c=S.cos.find(x=>x.id===d.cup),up=Math.round(COS[c.k].c*c.lv*Math.max(.2,S.cty.inc));if(c&&S.money>=up&&c.lv<8){outc('co',up);c.cap+=COS[c.k].c*c.lv;c.lv++;c.val+=Math.round(COS[c.k].c*(c.lv-1)*.9);log(`「${c.name}」に出資した（Lv${c.lv}）`,'good');save();render()}return}
  if(d.csell||d.cipo){const id=d.csell||d.cipo,c=S.cos.find(x=>x.id===id);if(!c)return;const sell=!!d.csell;const amt=sell?Math.round(c.val*Math.max(.2,S.cty.inc)):Math.round(c.val*.35*Math.max(.2,S.cty.inc));
    $('#coBox').innerHTML=`<div class="card warn"><p class="mtext">${sell?`「${esc(c.name)}」を売却する？ ${yen(amt)}が入るが、会社は手放すことになる。`:`「${esc(c.name)}」を上場する？ 株の一部を売って${yen(amt)}が入る。会社は持ったままで、そのあとの利益は少し減る。`}</p><div class="row"><button class="b sm danger" type="button" data-cyes="${sell?'sell':'ipo'}" data-id="${id}">決める</button><button class="b sm" type="button" data-act="coNo">やめておく</button></div></div>`;return}
  if(d.cyes){const c=S.cos.find(x=>x.id===d.id);if(!c)return;if(d.cyes==='sell'){inc('cosell',Math.round(c.val*Math.max(.2,S.cty.inc)));S.cos=S.cos.filter(x=>x!==c);if(S.cfocus===c.id)S.cfocus=null;tl(`会社「${c.name}」を売却した`)}else{inc('cosell',Math.round(c.val*.35*Math.max(.2,S.cty.inc)));c.pub=1;c.cap*=.75;c.val=Math.round(c.val*.65);tl(`会社「${c.name}」が上場した`);ticker(`「${c.name}」が上場`);ad('rep',5)}save();render();return}
  if(d.act==='coNo'){$('#coBox').innerHTML='';return}
  if(d.dev){devTown(d.dev,($('#devName')||{}).value);return}
  if(d.town!=null){const T=allTowns()[+d.town];if(T&&T!==S.town){switchTown(T);save();render()}return}
});

// ----- 毎月 -----
function monthHook7(){
  if(!S.towns2){S.towns2=[];S.town.home=1}
  if(!S.cos)S.cos=[];
  otherTownsMonth();cosMonth();histTick();
  if(S.flags.preNet&&snsEra()&&age()>=13&&!S.snsOpen){delete S.flags.preNet;S.q.push('era_sns')}
}
function ensureV7(){if(!S)return;if(!S.towns2){S.towns2=[];if(S.town)S.town.home=1}if(!S.cos)S.cos=[];if(S.fanCore>.35)S.fanCore=.25}

// ----- ファン層（調整） -----
function postHook(k,q,buzzed,nf){
  const sr=S.series;if(sr.g===S.genre){sr.n+=k;sr.fat+=k*(POPT==='big'?.3:1)}else{sr.g=S.genre;sr.n=k;sr.fat=0}
  const F=totalF(),prev=Math.max(1,F-Math.max(0,nf));
  // ガチ勢：シリーズとライブで育つ。上限に近づくほど増えにくい
  let g=(.0025*k*(sr.n>=3?1.6:1)+(POPT==='live'?.004*k:0)+(POPT==='collab'?.001*k:0))*(1-S.fanCore/.4);
  S.fanCore=clamp(S.fanCore+g,.02,.4);
  // 新しく来た人の多くはライト層
  if(nf>0)S.fanCore=(S.fanCore*prev+nf*.04)/(prev+nf);
  // アンチ：攻めた投稿とバズで増える
  S.fanAnti=clamp(S.fanAnti+(S.style==='edge'?.0025:S.style==='safe'?-.001:.0003)*k+(buzzed?.006:0),0,.3);
  S.fanCore=clamp(S.fanCore,.02,.4);
}

// ----- 遊び方 -----
const GUIDE=[
 ['basic','はじめに',`ランダムな国・家庭・時代に生まれ、一生を過ごすシミュレーション。
・上の「次へ」で1か月（設定で1週間・3か月）進む。▶で自動再生、「イベントまで」で次の出来事まで早送り。PCは P キーで停止。
・出来事が起きると止まるので、選択肢を選ぶ。選んだ道で能力・性格・人間関係が変わる。
・6歳までは自動で育つ。6歳から行動を選べる。13歳ごろからSNSを始められる（SNSがない時代は登場を待つ）。
・亡くなると人生の振り返りと称号が出る。エンドレスなら子どもに引き継いで続けられる。
・データは自動で保存される。`],
 ['act','予定（行動）',`毎月の自由な時間に何をするかを決める。
・行動を選んでから「何をするか」（勉強の種類・遊びの種類・投稿の企画など）を選べる。
・学校や仕事は自動で入る。小学生は自由な枠が3つ。
・「おまかせ」をONにすると自動で決めてくれる。
・子どもがいると「子育て」を選べる。子どもとの絆が深まる。
・時間の進み方（1か月・1週間・3か月）もここで変えられる。`],
 ['sns','発信（SNS）',`SNSでフォロワーを増やす。
・ジャンルとスタイルを選び、「予定」で「投稿する」を入れると投稿する。
・投稿の質はスキル・素質・機材・スタッフ・研究・体調で決まる。流行のジャンルとSNSに合わせると伸びやすい。
・ファン層：ガチ勢はシリーズものやライブで育ち、ファンクラブ収入になる。新しく来た人の多くはライト層。アンチは攻めた投稿やバズで増え、炎上しやすくなる。
・同じジャンルを続けるとシリーズになり固定ファンがつくが、続けすぎると飽きられる。
・流行の噂：先にジャンルを合わせておくと大きく伸びるかも（外れることもある）。
・ライバルと勝負して勝つとフォロワーを奪える。
・SNSは時代によって登場する（動画SNSは2005年ごろ、短い動画は2016年ごろ、立体映像は2040年）。`],
 ['money','お金',`・家計：毎月の請求書を払う。遅れると延滞金がかかり、信用スコアが下がる。自動支払いにもできる。
・買い物：機材・暮らしの買い物・住まい・サブスク・保険。
・部屋の飾り：買った飾りをドット絵の部屋に置ける。飾るほど幸福が少し上がる。
・投資・借入：投資は毎月値動きする。借金は信用スコアしだい（18歳未満は借りられない）。
・金額はすべて今の価値に換算して表示している（昔の時代でも同じ感覚で遊べる）。`],
 ['biz','事業（まち・お店・会社）',`・まちの地図：空き地に建物を建てる。となり合う組み合わせで売上が上がる。18歳から。
・住民の声に応えたり、まちのイベントを主催したりすると「まちの支持」が上がり、市長選挙で有利になる。
・新しいまちの開発：25歳から。ふるさとのほかに4つまで、新しいまちを持てる。地図の上の「まち」ボタンで切り替える。
・お店の経営：価格・営業時間・広告・店員の数、内装と看板メニューを決める。まちの客層と合うほどお客さんが来る。大手チェーンが進出してくることも。
・会社：20歳から、代表として会社を設立できる（飲食・アパレル・ゲーム・IT・不動産・メディア・宇宙）。出資で大きくし、上場や売却もできる。
・事務所：スタッフを雇い、タレントを育てる（研究「会社経営の基本」で解放）。
・研究：ポイントを使って新しい建物や機能を解放する。
・景気：時代の出来事で景気が変わり、お店・会社・投資に影響する。`],
 ['life','人生',`・能力：体力・心・知識などのパラメーターとスキル・素質。
・目標・性格：人生の目標（達成するとごほうび）、行動で育つ性格、体の特徴、心残り、家系の遺産、生まれの番号。
・人生の選択：恋人を探す・プロポーズ・別れる・離婚・子どもを考える・転職・退職・休職・大学に入り直す・引っ越し・海外移住。
・人物：家族・友達・恋人など。仲のよさは「予定」の行動で上がる。
・相関図・弟子：人間関係を図で見る。35歳・フォロワー1万人から弟子をとれる。
・アルバム：人生の大きな出来事が絵になって残る。
・記録：最高記録・家系・人生年表。`],
 ['era','時代と生まれ',`・「はじめから」で、生まれる時代を選べる：今（2026年）／過去（1950〜2005年）／未来（2030〜2080年）／自分で年を決める（1940〜2100年）。
・過去〜今は、実際にあった出来事がニュースとして流れ、景気にも影響する（日本の出来事は舞台「日本」のとき）。
・未来の出来事は想像のもの。2035年にVR配信、2040年に新しいSNS、2048年にAIとの共演が登場する。
・生まれの番号を友達と合わせると、同じ国・家庭・素質で生まれて競える。`],
 ['save','セーブと設定',`・自動で保存される。「メニュー」→「セーブデータを書き出す」で控えを取れる。
・新しい版が出たときは、前のセーブが自動で保管される（設定→更新前のセーブに戻す）。
・タイトルの「ほかのバージョンで遊ぶ」で昔の版も遊べる。
・音量・BGM・効果音は「設定」や「メニュー」で変えられる。`]
];
const TAB_GUIDE={act:'act',sns:'sns',money:'money',biz:'biz',life:'life'};
function showGuide(k){const cur=GUIDE.find(g=>g[0]===k)||GUIDE[0];
  openModal(`<div class="mcat life">遊び方</div><h2>遊び方：${esc(cur[1])}</h2><div class="subtabs">${GUIDE.map(g=>`<button class="stab" type="button" data-guide="${g[0]}" aria-pressed="${g[0]===cur[0]}">${esc(g[1])}</button>`).join('')}</div><p class="mtext guide">${esc(cur[2])}</p><button class="b pri" type="button" data-act="close">閉じる</button>`)}
function snsPreMsg(){if(S.y<SNS_ERA)return `まだSNSがない時代（${S.y}年）。${SNS_ERA}年ごろに動画を投稿できるSNSが登場する。それまでは勉強・仕事・お店・会社・まちづくりで人生を進めよう。`;
  if(S.flags.noNet)return 'ネットにつながる環境がない。「お金」→「買い物」でスマホを手に入れれば始められる。';
  if(age()>=13)return `SNSを始められる。<button class="b sm pri" type="button" data-opensns="milu">${esc(SNS.milu.n)}のアカウントを作る</button>`;
  return '自分のアカウントは13歳から作れる。それまでは遊びや習い事で素質を貯めよう。'}
function birthHook7(){const hs=HIST.filter(h=>h.y===S.y&&histOk(h));for(const h of hs){S.flags['h'+h.y+h.s+HIST.indexOf(h)]=1;ticker(h.t)}if(S.y<2000)S.kc.likely=0}
document.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;if(b.dataset.guide!=null){showGuide(b.dataset.guide||'basic');return}if(b.dataset.act==='guide')showGuide('basic')});
