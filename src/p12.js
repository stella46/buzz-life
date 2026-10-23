var TAL_MAX=300;
// ===== v0.5：子ども時代の充実・子どもの借金をなくす =====
// ----- 子ども向けの行動 -----
ACT.homework={n:'宿題・自由研究',d:'知識と素質が伸びる',ok:()=>age()>=6&&age()<=15,f:k=>ACT.homework.opts[0].f(k),opts:[
  {k:'hw',n:'宿題をする',d:'知識が上がる',f:k=>{ad('know',1.6*k);ad('mental',-.2*k)}},
  {k:'research',n:'自由研究',d:'知識・企画・研究ポイント',f:k=>{ad('know',1*k);ad('plan',.6*k);ad('tal.study',1*k);S.rp+=.3*k}},
  {k:'diary',n:'絵日記を書く',d:'話す力とVlogの素質',f:k=>{ad('tal.talk',1*k);ad('tal.vlog',.8*k);ad('mental',.4*k)}}]};
ACT.kidvideo={n:'動画ごっこ',d:'家のパソコンやタブレットで動画づくりのまねをする',ok:()=>age()>=8&&age()<=12,f:k=>ACT.kidvideo.opts[0].f(k),opts:[
  {k:'shoot',n:'撮影ごっこ',d:'Vlogの素質と編集',f:k=>{ad('tal.vlog',1.5*k);ad('edit',.5*k);ad('happy',1*k)}},
  {k:'jikkyo',n:'実況ごっこ',d:'ゲーム実況の素質と話術',f:k=>{ad('tal.game',1.2*k);ad('talk',.5*k);ad('happy',1*k)}},
  {k:'cooking',n:'料理動画ごっこ',d:'料理の素質',f:k=>{ad('tal.cook',1.5*k);ad('happy',.8*k);relP(.5*k)}},
  {k:'kidch',n:'家族チャンネルの撮影に出る',d:'家族チャンネルが伸びる。プライバシーは減る',ok:()=>S.kc&&S.kc.on,f:k=>{S.kc.f+=(80+S.kc.f*.04)*k;ad('priv',-1*k);relKc(1*k);ad('tal.talk',.8*k)}}]};
ACT.chores={n:'お手伝い',d:'家族の役に立って、おこづかいをもらう',ok:()=>age()>=6&&age()<=17&&!S.indep,f:k=>ACT.chores.opts[0].f(k),opts:[
  {k:'house',n:'家の掃除',d:'おこづかいと家族の仲',f:k=>{inc('allow',Math.round(500*k*Math.max(.2,S.cty.inc)));relP(1.5*k)}},
  {k:'cook',n:'料理の手伝い',d:'料理の素質と家族の仲',f:k=>{inc('allow',Math.round(400*k*Math.max(.2,S.cty.inc)));ad('tal.cook',1*k);relP(1.2*k)}},
  {k:'sib',n:'きょうだいの面倒を見る',d:'人間関係とおこづかい',ok:()=>S.sibs.length>0,f:k=>{inc('allow',Math.round(400*k*Math.max(.2,S.cty.inc)));ad('social',1*k);for(const s of S.sibs)rel(s,1.5*k)}}]};
ACT.base={n:'秘密基地づくり',d:'友達と空き地や公園で秘密基地をつくる',ok:()=>age()>=7&&age()<=12,f:k=>{ad('social',1.4*k);ad('plan',.8*k);ad('happy',1.6*k);ad('tal.comedy',.4*k);for(const n of S.friends)rel(n,1*k)}};
function freeSlots(){const a=age();if(a<6)return 0;let n=({school:a<=12?3:2,univ:3,work:2,creator:4,free:4,retired:4})[S.st]||2;if(S.st==='school'&&S.flags.hs==='online'&&a>=15)n++;if(S.flags.care&&S.am<S.flags.care)n--;return Math.max(1,n)}
function autoPlan(){
  const n=freeSlots(),a=age(),p=[],can=id=>ACT[id]&&ACT[id].ok();
  if(n<=0){S.plan=[];return}
  if(S.p.health<40||S.p.mental<35)p.push('rest');
  if(a<13){const fill=['play','homework','friends','kidvideo','base','chores','lesson'];let i=RI(0,6),g=0;while(p.length<n&&g<30){const c=fill[i++%fill.length];g++;if(can(c)&&(!p.includes(c)||g>14))p.push(c)}S.plan=p.slice(0,n);return}
  if(S.money<0&&can('part'))p.push('part');
  if(can('part')&&S.st==='free'){p.push('part');if(n>=4)p.push('part')}
  if(can('post')){p.push('post');if(n>=3)p.push('post')}
  if(S.st==='school'&&S.p.know<55)p.push('study');
  if(lover()&&lover().rel<85)p.push('date');
  const fill=(S.st==='free'||(S.st==='creator'&&S.money<50000))?['part','practice','talkp','rest']:['practice','talkp','exercise','friends','rest'];
  let i=0;while(p.length<n&&i<30){const c=fill[i++%fill.length];if(can(c))p.push(c)}
  S.plan=p.slice(0,n);
}
function defaultAct(){const a=age();return a<13?pick(['play','homework','friends']):(ACT.post.ok()?'post':'study')}

// ----- 子どもはお金を借りない（足りないときは親が払う） -----
function ad(k,v,cat){if(k==='money'&&cat==='medical'&&v<0&&S.subs&&S.subs.insurance)v=Math.round(v*.3);
  if(!v)return;if(v>0&&k!=='money'&&k!=='f'&&S.body)v*=bodyMul(k)*perkMul(k)*(k.startsWith('tal.')?TALMUL:1);if(v<0&&k==='mental'&&sk('l2'))v*=.8;
  if(k in P_KEYS)S.p[k]=clamp(S.p[k]+v);
  else if(k in SK_KEYS)S.sk[k]=clamp(S.sk[k]+v);
  else if(k==='money'){if(!cat)v=Math.round(v*(S.cty?S.cty.inc:1));
    if(v<0&&age()<18&&S.money+v<0){const cover=-(S.money+v);v=-Math.max(0,S.money);if(cover>0)log(`足りない${yen(cover)}は家族が払ってくれた`,'life')}
    if(v>0)inc(cat==='loss'?'loss':(cat||'ev'),v);else if(v<0)outc(cat||'ev',-v)}
  else if(k==='f'){const key=S.open[S.main]?S.main:'milu';if(!S.open[key])return;S.f[key]=Math.max(0,S.f[key]+v)}
  else if(k.startsWith('tal.')){const t=talKey(k.slice(4)),c0=S.tal[t]||0;S.tal[t]=Math.max(0,Math.min(TAL_MAX,c0+(v>0&&c0>=100?v*.6:v)))}
  if(DL)DL[k]=(DL[k]||0)+v;
}
EV.poor.when=()=>age()>=18;
E('poor_kid',{t:'おこづかいが足りない',cat:'お金',w:0,text:()=>'おこづかいを使いすぎてしまった。',ch:[['家族に謝る',()=>{S.money=Math.max(0,S.money);relP(-2);ad('know',1);return '「次から気をつけなさい」と言われた。お金の大切さを学んだ。'}]]});

// ----- おこづかいの使い道 -----
const KIDGOODS=[
  {k:'dagashi',n:'駄菓子',p:150,d:'幸福+1',f:()=>{ad('happy',1)}},
  {k:'manga',n:'漫画',p:500,d:'お笑い・雑談の素質+1',f:()=>{ad('tal.comedy',1);ad('tal.talk',.6);ad('happy',1)}},
  {k:'book',n:'図鑑・本',p:1200,d:'知識+2',f:()=>{ad('know',2);ad('tal.study',.6)}},
  {k:'gacha',n:'ガチャガチャ',p:300,d:'何が出るかはお楽しみ',f:()=>{if(chance(.2)){ad('happy',4);log('ガチャで大当たりが出た！','good')}else ad('happy',.5)}},
  {k:'stationery',n:'かわいい文房具',p:400,d:'美容の素質+1',f:()=>{ad('tal.beauty',1);ad('happy',1)}},
  {k:'gamesoft',n:'ゲームソフト',p:5000,d:'ゲーム実況の素質+3',f:()=>{ad('tal.game',3);ad('happy',3)}},
  {k:'toy',n:'流行りのおもちゃ',p:3000,d:'友達との話題が増える',f:()=>{ad('social',2);ad('happy',2)}},
  {k:'gift',n:'家族へのプレゼント',p:800,d:'家族との仲+4',f:()=>{relP(4);ad('happy',1)}}
];
function kidMoneyPanel(){
  const a=age(),c=Math.max(.2,S.cty.inc),allow=Math.round(TIERS[S.tier].allow*(a>=13?2:1)*S.cty.inc);
  let h=`<h2>おこづかい</h2><div class="kv big2"><span>おこづかいの残り</span><span>${yen(S.money)}</span><span>毎月のおこづかい</span><span>${yen(allow)}</span></div><p class="hint">「お手伝い」の行動でおこづかいを増やせる。18歳になると、家計・住まい・投資などが使えるようになる。</p><h3>おこづかいで買う</h3><div>`;
  h+=goodsNote();for(const g of KIDGOODS){h+=goodRow(g,'kgood',Math.round(g.p*c))}
  h+='</div>';
  if(a>=13){h+=`<h3>配信の機材</h3><div>`;for(const [k,e] of Object.entries(EQ)){const lv=S.eq[k],cur=e.t[lv],nx=lv<eqMax()?e.t[lv+1]:null;h+=`<div class="shop"><div><div>${e.n}：${esc(cur[0])}</div>${nx?`<div class="muted small">次：${esc(nx[0])} ${yen(nx[1])}</div>`:''}</div>${nx?`<button class="b sm" type="button" data-buy="${k}" ${S.money<nx[1]?'disabled':''}>買う</button>`:''}</div>`}h+='</div>'}
  if(S.flags.noNet&&a>=13){const pr=Math.round(20000*Math.max(.25,S.cty.inc));h+=`<div class="shop"><div><div>スマホと通信契約</div><div class="muted small">SNSを始められるようになる ${yen(pr)}</div></div><button class="b sm pri" type="button" data-act="buyphone" ${S.money<pr?'disabled':''}>買う</button></div>`}
  const L=S.last;if(L&&(Object.keys(L.inc).length||Object.keys(L.out).length)){h+=`<h3>${esc(L.lbl)}のおこづかい帳</h3><div class="kv">${Object.entries(L.inc).map(([k,v])=>`<span>${INC_LBL[k]||k}</span><span>+${yen(v)}</span>`).join('')}${Object.entries(L.out).map(([k,v])=>`<span>${OUT_LBL[k]||k}</span><span>-${yen(v)}</span>`).join('')}</div>`}
  return h;
}
function panelMoney(){if(age()<18)return kidMoneyPanel();return panelMoneyAdult()}
OUT_LBL.kgoods='おこづかいの買い物';INC_LBL.allow='おこづかい・お手伝い';
document.addEventListener('click',e=>{const t=e.target.closest('button');if(!t||!S)return;if(t.dataset.kgood){const g=KIDGOODS.find(x=>x.k===t.dataset.kgood),p=Math.round(g.p*Math.max(.2,S.cty.inc));if(S.money>=p&&goodCanBuy(g,1)){outc('kgoods',p);goodApply(g,1,()=>g.f());log(`${g.n}を買った`,'good');snd('buy');save();render()}}});

// ----- 時間の進み方：3か月ずつ -----
function unitHtml(){return `<select data-set="unit" id="unitSel"><option value="month" ${S.unit==='month'?'selected':''}>1ターン＝1か月</option><option value="season" ${S.unit==='season'?'selected':''}>1ターン＝3か月（早く進める）</option><option value="week" ${S.unit==='week'?'selected':''}>1ターン＝1週間（細かく決めたいとき）</option></select>`}

// ----- 子ども時代の出来事は少し多めに -----
function rollEvent(k){
  if(age()<1)return null;
  const spaced=S.lastEv!=null&&S.am-S.lastEv<(age()<13?1:2);
  const rate=age()<13?.45:.3;
  const hits=[];
  for(const id in EV){const e=EV[id];if(!e.w)continue;if(e.once&&S.seen[id])continue;if(e.cd&&S.cd[id]!=null&&S.am-S.cd[id]<e.cd)continue;let ok=true;try{ok=!e.when||e.when()}catch(_){ok=false}if(!ok)continue;if(e.w<1&&spaced)continue;if(chance(Math.min(1,e.w*(e.w>=1?1:rate))*k))hits.push(e)}
  const ev=hits.length?pick(hits):null;if(ev&&ev.w<1)S.lastEv=S.am;return ev;
}

// ----- 子ども時代の出来事 -----
X('k2_errand','成長','はじめてのおつかい',ag(5,7),.15,'家族に頼まれて、ひとりでお店までおつかいに行くことになった。',[['がんばって行く',{happy:4,social:2,relP:3},'ちゃんと買えた！ほめられて誇らしい。'],['途中で泣いてしまう',{t_comedy:1,relP:2},'迎えに来てくれた家族と一緒に帰った。']],{once:1});
X('k2_bike','成長','自転車の練習',ag(5,8),.12,'補助輪なしの自転車に挑戦する。',[['何度転んでも練習',{health:2,happy:4,mental:2},'ついに乗れた！世界が広がった。'],['今日はやめておく',{},'']],{once:1});
X('k2_lost','成長','迷子',ag(3,7),.05,'人混みの中で家族とはぐれてしまった。',[['近くの大人に助けを求める',{social:2,know:1},'無事に家族と会えた。'],['泣いて待つ',{mental:-2,relP:2},'見つけてもらえて、ぎゅっと抱きしめられた。']],{once:1});
X('k2_ensoku','学校','遠足',and(ag(6,12),Mc(5,10)),.2,'今日は遠足。お弁当が楽しみだ。',[['友達とおかずを交換',{social:3,happy:3},''],['写真係になる',{t_vlog:2,happy:2},'']],{cd:11});
X('k2_summer','学校','夏休みの宿題',and(ag(6,15),Mc(8)),.4,'夏休みが終わるのに、宿題がまだ山積みだ。',[['徹夜で終わらせる',{know:2,health:-2},'なんとか間に合った。'],['自由研究に全力',{know:2,plan:2,rp:2},'先生にほめられた。'],['あきらめる',{know:-1,t_comedy:1},'先生に怒られた。']],{cd:11});
X('k2_secret','友達','秘密基地',and(ag(7,12),planC('base')),.06,'友達と作った秘密基地に、ついに屋根がついた。',[['お菓子を持ち寄る',{social:3,happy:4},'自分たちだけの場所だ。']],{once:1});
X('k2_basebreak','友達','秘密基地が見つかった',and(ag(7,12),planC('base')),.03,'秘密基地が大人に見つかって、片付けるように言われた。',[['素直に片付ける',{rep:1,mental:-1},''],['新しい場所を探す',{plan:2,t_comedy:1},'']],{once:1});
X('k2_quarrel','友達','友達とケンカ',and(ag(6,12),()=>S.friends.length>0),.04,()=>`${pn(pick(S.friends))}とケンカしてしまった。`,[['次の日に謝る',{friend:5,social:2},'前より仲良くなった。'],['口をきかない',{friend:-5,mental:-2},'']]);
X('k2_recital','成長','習い事の発表会',and(ag(6,15),()=>!!S.lesson),.06,()=>`${LESSONS[S.lesson].n}の発表会がある。`,[['練習の成果を出す',()=>{const l=LESSONS[S.lesson];return Object.assign({happy:4,mental:2},Object.fromEntries((l.tal||[]).map(t=>['t_'+t,3])))},'家族が拍手してくれた。'],['緊張でうまくいかない',{mental:-2,t_comedy:1},'でも、また挑戦したい。']],{cd:12});
X('k2_quitlesson','成長','習い事をやめたい',and(ag(8,15),()=>!!S.lesson),.02,()=>`${LESSONS[S.lesson].n}に行きたくない日が続いている。`,[['続ける',{mental:-2,know:1},'いつか役に立つ…はず。'],['やめる',()=>{S.lesson=null;return {happy:2}},'別のことに時間を使う。']],{once:1});
X('k2_gameban','家族','ゲーム禁止令',and(ag(7,14),planC('play','game')),.05,'「ゲームは1日1時間まで！」と家族に言われた。',[['ルールを守る',{relP:3,know:1},''],['こっそりやる',()=>chance(.5)?{t_game:2}:{relP:-5},'']]);
X('k2_birthday','家族','誕生日プレゼント',ag(4,12),.04,'誕生日に何がほしいか聞かれた。',[['ゲーム機',{t_game:3,happy:4},''],['本',{know:3,happy:2},''],['家族でお出かけ',{relP:4,happy:4},'']],{cd:12});
X('k2_parentbday','家族','親の誕生日',and(ag(6,12),anyParentAlive),.04,'もうすぐ親の誕生日だ。',[['手紙を書く',{relP:6,t_talk:1},'泣いて喜ばれた。'],['お手伝いをプレゼント',{relP:4,t_cook:1},'']],{cd:12});
X('k2_kodomokai','友達','子ども会',ag(6,12),.03,'地域の子ども会でバーベキューがある。',[['参加する',{social:3,happy:2},'近所の年上の子と仲良くなった。']],{cd:24});
X('k2_pool','成長','夏のプール',and(ag(5,12),Mc(7,8)),.2,'市民プールに行く。',[['泳ぎの練習',{health:3},'25メートル泳げるようになった！'],['ひたすら遊ぶ',{happy:4},'']],{cd:11});
X('k2_bug','成長','虫とり',and(ag(5,11),Mc(7,8)),.15,'近所の林で虫とりをする。',[['カブトムシを探す',{happy:3,t_vlog:1},'大きなカブトムシを見つけた！'],['観察日記をつける',{know:2,t_study:1},'']],{cd:11});
X('k2_snow','成長','雪合戦',and(ag(5,12),Mc(1,2)),.1,'雪が積もった！',[['雪合戦をする',{social:2,happy:3,health:1},'']],{cd:11});
X('k2_tablet','成長','学校のタブレット',ag(7,12),.05,'学校で一人1台のタブレットが配られた。',[['動画を作ってみる',{edit:2,t_vlog:2},'先生が授業で紹介してくれた。'],['調べ学習に使う',{know:2,t_study:1},'']],{once:1});
X('k2_ytban','家族','動画の見すぎ',and(ag(6,12),()=>S.p.know<30),.04,'動画ばかり見ていて、家族に心配された。',[['見る時間を決める',{know:1,relP:2},''],['動画で勉強する',{know:2,t_study:1},'勉強系の動画にハマった。']]);
X('k2_moneybox','お金','貯金箱',ag(6,12),.03,'貯金箱がいっぱいになってきた。',[['開けて数える',()=>({happy:3}),()=>`${yen(S.money)}も貯まっていた！`],['もっと貯める',{plan:1},'']],{once:1});
X('k2_tooth','成長','乳歯が抜けた',ag(5,8),.1,'ぐらぐらしていた歯が、ついに抜けた。',[['屋根に投げる',{happy:2},'']],{once:1});
X('k2_drawing','学校','写生大会',and(ag(6,12),Mc(5,6,10)),.06,'写生大会で、学校の外で絵を描く。',[['夢中で描く',{t_beauty:2,t_vlog:1,happy:2},'']],{cd:11});
X('k2_fortune','成長','将来の夢、ふたたび',ag(10,12),.05,'卒業文集に「将来の夢」を書くことになった。',[['配信者',{t_talk:2,plan:1},'13歳になったら始めると決めた。'],['お店を開く',{t_cook:1,plan:2},''],['まだ決められない',{know:1},'']],{once:1});
X('k2_kidch_fan','家族チャンネル','家族チャンネルのファン',and(()=>S.kc&&S.kc.on,ag(6,12),()=>S.kc.f>=3000),.04,'家族チャンネルのファンから手紙が届いた。',[['返事を書く',{happy:3,t_talk:1},''],['少しこわい',{mental:-1,priv:2},'']]);
X('k2_rival_kid','友達','クラスのライバル',ag(8,12),.04,'クラスに、何でもできるライバルがいる。',[['負けずにがんばる',{know:2,mental:-1,health:1},''],['仲良くなる',{social:3},'']],{once:1});
X('k2_grandparents','家族','おじいちゃんおばあちゃんの家',ag(4,12),.05,'夏休みに、おじいちゃんおばあちゃんの家に泊まりに行った。',[['昔の話を聞く',{know:2,happy:3},''],['田舎で遊び回る',{health:2,happy:3},'']],{cd:12});
X('k2_tv','成長','テレビで見た配信者',ag(8,12),.05,'テレビに出ていた配信者を見て、ドキドキした。',[['ノートに企画を書く',{plan:2,t_comedy:1},'13歳になったらやりたいことリストができた。']],{once:1});
X('k2_pocket','お金','おこづかいアップの交渉',ag(8,12),.04,'友達はもっとおこづかいをもらっているらしい。',[['お手伝いを条件に交渉',()=>chance(.5)?{talk:2,money:500}:{talk:1},''],['今のままでいい',{relP:1},'']],{once:1});
