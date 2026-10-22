// ===== v0.10：遊びやすさの見直し（流行・投稿の企画・コラボ・スタイル・自動進行・解放条件・やることリスト） =====

// ----- 新しいスタイル -----
Object.assign(STYLES,{
  chill:{n:'ゆるく癒し',disc:.9,fl:0,d:'炎上しにくく、ガチ勢が育ちやすい。伸びはゆっくり'},
  expert:{n:'ガチ解説',disc:.95,fl:.001,d:'知識が高いほど質が上がる。勉強・解説系に強い'},
  variety:{n:'バラエティ',disc:1.15,fl:.004,d:'見つかりやすく、そこそこ攻める'},
  story:{n:'エモい物語',disc:1.05,fl:.002,d:'ガチ勢がとても育ちやすい'},
  trend:{n:'流行に全乗り',disc:1,fl:.003,d:'流行のジャンルのときだけ大きく伸びる。ガチ勢は育ちにくい'}
});
STYLES.safe.d='炎上しにくいが、伸びはひかえめ';STYLES.norm.d='ふつう';STYLES.edge.d='伸びやすいが、炎上しやすくアンチも増える';
const styleQ=()=>S.style==='expert'?clamp((S.p.know-40)/4,-4,12):S.style==='chill'&&S.p.mental>60?2:0;

// ----- 投稿の企画（「発信」タブで決める） -----
const POSTPLAN=[
  {k:'normal',n:'ふつうの投稿',d:'いつもどおりの投稿'},
  {k:'short',n:'ショート動画',d:'見つかりやすいが質は下がる。広告収益は少なめ'},
  {k:'big',n:'大型企画',d:'毎月5万円かかるが、質が大きく上がりバズりやすい',ok:()=>S.money>=50000*ci()},
  {k:'live',n:'ライブ配信',d:'投げ銭が入る。ガチ勢が育つ',ok:()=>totalF()>=100},
  {k:'collab',n:'コラボ',d:'下の「コラボ」で相手が決まっているときだけ',ok:()=>!!collabNow()}];
function postPlanNow(){const p=POSTPLAN.find(x=>x.k===S.postPlan);return p&&(!p.ok||p.ok())?p.k:'normal'}
ACT.post.opts=null;ACT.post.d='SNSに投稿する。企画・ジャンル・スタイルは「発信」タブで決める';

// ----- コラボ相手 -----
const CO_NAMES=['ゆずポン','ハルカ・ノート','ミナト探検隊','こたつネコ','オムライス大佐','ソラミミ','トーマのラボ','ゆるっと姉妹','カゲロウ','ピクセル番長','まめしば日記','ナツメ堂','リリィ★','ドンちゃんねる','ぽこぺん','ウミネコ通信'];
function mkCreator(){const F=Math.max(300,totalF());return {id:'c'+Math.random().toString(36).slice(2,8),name:pick(CO_NAMES),role:'配信者',trait:pick(['人当たりがいい','職人気質','明るい','マイペース','努力家']),genre:pick(Object.keys(GENRES).filter(g=>genreOk(g))),f:Math.round(F*R(.3,2.5)+RI(200,3000)),rel:RI(25,55),cn:0}}
function collabNow(){if(!S.collabWith||!(S.collabUntil>S.am))return null;if(S.collabWith==='rival')return S.rival;return (S.collabs||[]).find(c=>c.id===S.collabWith)||null}
function acceptChance(p){const ratio=(totalF()+300)/(p.f+300);return clamp(.15+p.rel/120+Math.min(.35,ratio*.25)+(has('collab')?.1:0)+(sk&&sk('r2')?.05:0),.05,.95)}
function askCollab(id){const p=id==='rival'?S.rival:(S.collabs||[]).find(c=>c.id===id);if(!p||(S.cd['ask_'+id]!=null&&S.am-S.cd['ask_'+id]<2))return;S.cd['ask_'+id]=S.am;
  if(chance(acceptChance(p))){S.collabWith=id;S.collabUntil=S.am+3;S.postPlan='collab';rel(p,3);log(`${p.name}とのコラボが決まった（3か月）`,'sns');tl(`${p.name}とコラボした`);toast(`${p.name}がコラボを引き受けてくれた！`)}
  else{rel(p,1);log(`${p.name}にコラボを断られた。また今度`,'sns');toast(`${p.name}「今回はごめんね」`)}save();render()}
function collabGain(key,k){const p=collabNow();if(!p)return;const g=Math.round(Math.min(p.f,totalF()*3+2000)*.006*k*(has('collab')?1.5:1)/(1+(p.cn||0)*.15));S.f[key]+=g;S.mo.newF+=g;rel(p,1.5*k);p.f=Math.round(p.f+totalF()*.002*k);p.cn=(p.cn||0)+k*.34}

// ----- 投稿のつなぎこみ -----
function discMul(){const sr=S.series||{n:0,fat:0};let m=1.05;if(sr.n>=3)m*=1+Math.min(.3,sr.n*.025);if(sr.fat>10)m*=1-Math.min(.45,(sr.fat-10)*.035);if(persTop()==='bold')m*=1.1;
  if(sk('s3'))m*=1.1;m*=1+.02*rlv('sns');if(has('global'))m*=1.1;if(lg('g5'))m*=1.08;if(lg('g12'))m*=1.05;
  if(S.style==='trend')m*=S.trend.g===S.genre?1.35:.8;return m}
function eqBonus(){let t=0;for(const k in S.eq)t+=S.eq[k];return 16*(1-Math.exp(-t/7))}
function postQuality(){
  const g=GENRES[S.genre]||GENRES.talk;let mix=0;for(const s in g.w)mix+=(s==='know'?S.p.know:S.sk[s])*g.w[s];
  const cond=(S.p.health+S.p.mental)/2;
  const bonus=Math.min(20,stN('editor')*4*staffMul())+Math.min(10,countB('studio')*5)+(has('live')?2:0)+(has('analytics')?3:0);
  return clamp(mix*.62+(S.tal[talKey(S.genre)]||0)*.3+eqBonus()+bonus+(cond-50)*.15,1,100);
}
// 同じ年に同じ物をくり返し買っても、素質の伸びはだんだん小さくなる
let TALMUL=1;
for(const list of [GOODS,KIDGOODS])for(const g of list){if(g.once||!g.f)continue;const f0=g.f;g.f=function(){const key=g.k+'@'+S.y;if(!S.gN)S.gN={};const n=S.gN[key]||0;S.gN[key]=n+1;TALMUL=1/(1+n*.8);try{return f0.apply(this,arguments)}finally{TALMUL=1}}}

// ----- 流行（ジャンルだけ・長めに続く） -----
function newTrend(){const gs=Object.keys(GENRES).filter(g=>genreOk(g));const old=S.trend&&S.trend.g;
  let g=pick(gs);if(S.rumor&&S.am>=S.rumor.at&&chance(S.rumor.acc/100)&&GENRES[S.rumor.g])g=S.rumor.g;S.rumor=null;
  if(gs.length>1)while(g===old)g=pick(gs);
  S.trend={g,s:null,until:S.am+RI(14,26)};
  if(S.am>0&&S.snsOpen&&old!==g){const msg=`流行のジャンルが「${GENRES[g].n}」に変わった`;ticker(msg);log(msg,'sns');
    if(S.autoTrend&&genreOk(g)){S.genre=g;log(`ジャンルを自動で「${GENRES[g].n}」に合わせた`,'sns')}
    else if(S.trendStop!==0&&(speed>0||skipping)&&!S.q.includes('trend_chg'))S.q.push('trend_chg')}}

// ----- 倍速のとき、よくある出来事は自動で選ぶ -----
const AUTO_SKIP=/^(l_|r_|w_fired|tax|flame|deal|m\d|bill_force|gen_|goal_|era_|hist_|co_ev|x_chain|regret)/;
function autoEvOk(e){return S.autoEv!==0&&(speed>=2||skipping)&&e.w>0&&e.w<1&&!AUTO_SKIP.test(e.id)&&e.cat!=='恋愛'&&!/案件|PR/.test(e.t||'')}
function autoChoose(e){try{if(typeof e.text==='function')e.text()}catch(_){}S.seen[e.id]=1;S.cd[e.id]=S.am;if(typeof META!=='undefined')META.seen[e.id]=1;
  let chs;try{chs=(typeof e.ch==='function'?e.ch():e.ch)||[]}catch(_){chs=[]}if(!chs.length)return;
  const c=chs.find(x=>!/借り|消費者金融|ローン/.test(x[0]))||chs[0];
  DL={};let res='';try{res=c[1]()||''}catch(err){console.error(err)}DL=null;
  log(`${e.t}：「${c[0]}」${res?' → '+res:''}（自動）`,e.cat==='SNS'?'sns':'life');S.stats.autoEv=(S.stats.autoEv||0)+1}

// ----- 相手から言ってくる結婚・子ども -----
E('l_propose_r',{t:'プロポーズされた',cat:'恋愛',w:.05,cd:12,when:()=>S.partner&&S.partner.rel>=65&&age()>=22&&!S.spouse,
  text:()=>`${pn(S.partner)}「ずっと一緒にいたい。結婚してください」`,
  ch:[['はい、よろこんで',()=>{S.q.push('l_wed');ad('happy',8);return '涙がこぼれた。式の準備を始めよう。'}],['少し待ってほしい',()=>{rel(S.partner,-3);return '「わかった、待ってるね」と笑ってくれた。'}],['ごめんなさい',()=>{if(chance(.5)){tl(S.partner.name+'と別れた');S.partner=null;ad('happy',-6);return 'それきり、ふたりの関係は終わった。'}rel(S.partner,-15);return '気まずい空気が流れた。'}]]});
E('l_kidtalk',{t:'子どもの話',cat:'家族',w:.05,cd:18,when:()=>S.spouse&&S.kids.length<3&&age()>=22&&age()<=(S.g==='女'?43:50)&&!(S.flags.tryKid&&S.am<S.flags.tryKid),
  text:()=>`${pn(S.spouse)}「そろそろ、子どものことも考えない？」`,
  ch:[['そうしよう',()=>{S.flags.tryKid=S.am+12;rel(S.spouse,4);return 'ふたりで未来の話をした夜だった。'}],['もう少し先にしたい',()=>{rel(S.spouse,-1);return '「そっか、またゆっくり話そう」'}],['今は考えられない',()=>{rel(S.spouse,-4);ad('mental',-1);return '少しさみしそうだった。'}]]});
E('c_invite',{t:'コラボのお誘い',cat:'SNS',w:.05,cd:6,when:()=>S.snsOpen&&totalF()>=300&&!collabNow()&&(S.collabs||[]).length>0,
  text:()=>{const p=S.tmpC=pick(S.collabs);return `配信者「${p.name}」（${GENRES[p.genre].n}・フォロワー${num(p.f)}人）から「一緒にコラボしませんか？」と連絡がきた。`},
  ch:[['やろう！',()=>{const p=S.tmpC;if(!p)return '';S.collabWith=p.id;S.collabUntil=S.am+3;S.postPlan='collab';rel(p,5);tl(`${p.name}とコラボした`);return '3か月、一緒に企画をやることになった。'}],['今回は見送る',()=>'また機会があれば。']]});

// ----- 家族チャンネルを続ける -----
EV.m13k.ch.splice(1,0,['このまま家族で続けてもらう',()=>{S.kc.cont=1;tl('家族チャンネルを続けることにした');return '家族チャンネルはこれからも続く。自分のSNSは自分で始めることもできる。'}]);
function kidChannelTick(k){
  if(!S.kc.on||(age()>=13&&!S.kc.cont))return;
  S.kc.f+=(30+S.kc.f*.02)*R(.4,1.6)*k*(age()>=13?.8:1);
  if(chance(.02*k)){S.kc.f+=RI(1000,15000);log('家族チャンネルの動画がバズったらしい','sns')}
  if(age()>=6)inc('kc',Math.round(S.kc.f*.02*k*(S.kc.share?3:1)*Math.max(.15,S.cty.inc)));
  ad('priv',-.4*k*(age()>=13?.5:1));
}
function kcHtml(){if(!S.kc.on||!S.kc.cont)return '';return `<div class="card"><div class="hd"><span>家族チャンネル（${esc(S.kc.byName)}と運営）</span></div><div class="big">${num(S.kc.f)}人</div><p class="hint">家族で続けている。収入の一部が入る。</p><div class="row"><button class="b sm" type="button" data-act="kcTake">自分のアカウントに引き継ぐ</button><button class="b sm ghost" type="button" data-act="kcEnd">家族チャンネルを終わりにする</button></div></div>`}

// ----- 「発信」タブの投稿の方針 -----
function snsPlanHtml(){const st=STYLES[S.style]||STYLES.norm;const cp=collabNow();
  let h=chHtml()+postsHtml()+`<p class="hint">スタイル：${esc(st.d||'')}</p>`;
  h+=`<h3>投稿の企画</h3><div class="seg wrapseg">${POSTPLAN.map(p=>{const ok=!p.ok||p.ok();return `<button type="button" class="${postPlanNow()===p.k?'on':''}" data-pplan="${p.k}" ${ok?'':'disabled'}>${p.n}</button>`}).join('')}</div><p class="hint">${esc((POSTPLAN.find(p=>p.k===postPlanNow())||POSTPLAN[0]).d)}。「予定」で「投稿する」を入れた月に、この企画で投稿する。</p>`;
  h+=`<h3>流行</h3><p class="hint">いまの流行は「${esc(GENRES[S.trend.g].n)}」（あと約${Math.max(1,S.trend.until-S.am)}か月続く）。流行のジャンルで投稿すると伸びやすい。</p>
  <div class="row"><button class="b sm ${S.autoTrend?'on':''}" type="button" data-act="autoTrend">流行に自動で合わせる：${S.autoTrend?'ON':'OFF'}</button>${S.trend.g!==S.genre&&genreOk(S.trend.g)&&!S.autoTrend?'<button class="b sm pri" type="button" data-act="matchTrend">今すぐ流行に合わせる</button>':''}</div>`;
  if(!S.collabs)S.collabs=[];
  h+=`<h3>コラボ</h3>`;
  if(cp)h+=`<p class="hint">いま「${esc(cp.name)}」とコラボ中（あと${S.collabUntil-S.am}か月）。投稿の企画が「コラボ」のとき、相手のファンが来てくれる。</p>`;
  else h+=`<p class="hint">ほかの配信者にコラボを申し込める。引き受けてもらえると、3か月いっしょに投稿できる。フォロワーが近い相手や、仲がいい相手ほど引き受けてくれやすい。</p>`;
  const list=(S.rival?[Object.assign({},S.rival,{id:'rival',genre:S.genre,name:S.rival.name+'（ライバル）'})]:[]).concat(S.collabs);
  h+=list.map(p=>{const ch=acceptChance(p.id==='rival'?S.rival:p);const cd=S.cd['ask_'+p.id]!=null&&S.am-S.cd['ask_'+p.id]<2;return `<div class="shop"><div><div>${esc(p.name)} <span class="muted small">${esc((GENRES[p.genre]||GENRES.talk).n)}・${num(p.f)}人・仲${Math.round(p.rel)}</span></div><div class="muted small">引き受けてくれそう：${ch>=.6?'高い':ch>=.35?'ふつう':'低い'}</div></div><button class="b sm" type="button" data-askc="${p.id}" ${cp||cd?'disabled':''}>${cd?'返事待ち':'申し込む'}</button></div>`}).join('');
  return h+kcHtml()}

// ----- 速さの設定 -----
function speedOptsHtml(){return `<div class="row"><button class="b sm ${S.autoEv!==0?'on':''}" type="button" data-act="autoEvT">倍速のとき、よくある出来事は自動で選ぶ：${S.autoEv!==0?'ON':'OFF'}</button><button class="b sm ${S.trendStop!==0?'on':''}" type="button" data-act="trendStopT">流行が変わったらお知らせ：${S.trendStop!==0?'ON':'OFF'}</button></div><p class="hint">▶▶ と ▶▶▶ のとき、恋愛・結婚・仕事・炎上などの大事な出来事だけ止まり、ほかは自動で選んで記録に残す。出来事で止まっても、OKを押せば同じ速さで続きが進む。</p>`}
function etaText(){if(!S||!S.alive)return '';const per=S.unit==='season'?3:S.unit==='week'?.25:1;let secMonth,lbl;
  if(skipping){secMonth=.05;lbl='イベントまで'}else if(speed>0){secMonth=1.5/speed/per;lbl=['','▶','▶▶','','▶▶▶'][speed]||'▶'}else return '';
  const evy=(S.autoEv!==0&&(speed>=2||skipping))?1.8:EVY;const perYear=12*secMonth+evy*EVS;
  return `⏱ ${lbl}の推定：10年で約${Math.max(1,Math.round(perYear*10/60))}分 ／ この人生のこり約${Math.max(1,Math.round(perYear*lifeLeftYears()/60))}分`}

// ----- いまできること（予定タブの上） -----
function todoHtml(){if(age()<6)return '';const a=age(),t=[];const go=(tab,label,sub)=>t.push(`<button class="todo" type="button" data-goto="${tab}">${label}${sub?`<span>${sub}</span>`:''}</button>`);
  if(!S.snsOpen&&a>=13&&snsEra()&&!S.flags.noNet)go('sns','SNSを始める','「発信」でアカウントを作る');
  if(S.snsOpen){go('sns','投稿の方針を決める',`${GENRES[S.genre].n}・${(STYLES[S.style]||STYLES.norm).n}・${(POSTPLAN.find(p=>p.k===postPlanNow())||POSTPLAN[0]).n}`);
    if(S.trend.g!==S.genre&&genreOk(S.trend.g)&&!S.autoTrend)t.push(`<button class="todo hot" type="button" data-act="matchTrend">流行に合わせる<span>いまの流行：${esc(GENRES[S.trend.g].n)}</span></button>`);
    if(!collabNow()&&totalF()>=300)go('sns','コラボを申し込む','ほかの配信者といっしょに投稿');}
  const rr=researchReady();if(rr)go('biz:res','研究する',`${rr}つ研究できる`);
  if((S.sp||0)>0)go('life:skill','スキルを覚える',`ポイント${S.sp}`);
  if(a>=16&&!S.partner&&!S.spouse)go('life:choice','恋人を探す','人生の選択');
  if(a>=18&&!anyShop()&&S.money>=1e6*Math.max(.2,S.cty.inc))go('biz:town','お店を建てる','まちの空き地を選ぶ');
  if(a>=20&&!(S.cos||[]).length&&S.money>=3e7*Math.max(.2,S.cty.inc))go('biz:co','会社を設立する','代表になる');
  if(!t.length)return '';
  return `<div class="todos"><h3>いまできること</h3><div class="todogrid">${t.slice(0,6).join('')}</div></div>`}

// ----- 研究・建物の「いつできる？」 -----
function rpEta(c){const need=c-S.rp;if(need<=0)return 'いま';const r=Math.max(.05,S.rpRate||.5);const m=Math.ceil(need/r);return m>=24?`約${Math.round(m/12)}年`:`約${m}か月`}
function resHint(id){const r=RES.find(x=>x.id===id);if(!r)return '';return `（${r.c}pt・${S.rp>=r.c?'いま研究できる':'あと'+rpEta(r.c)}・「事業」→「研究」）`}

// ----- 解放のつながりを少なく -----
const RQ={brand:null,analytics:null,company:null,eq5:null,avatar:null,fashion:null,studio:null,scout:null,hr:null,gamedev:null};
for(const r of RES)if(r.id in RQ)r.req=RQ[r.id];
{const c=RES.find(r=>r.id==='company');if(c){c.base=40;c.d='スタッフの効果アップ・スカウト・スタジオなど、事務所でできることが増える'}}
for(const x of LEG)delete x.req;
try{applyResCost()}catch(_){}

// ----- 毎月 -----
function monthHook10(){
  if(!S.collabs)S.collabs=[];
  if(S.snsOpen&&S.collabs.length<3)S.collabs.push(mkCreator());
  if(S.snsOpen&&S.m===4&&S.collabs.length){S.collabs.sort((a,b)=>a.rel-b.rel);S.collabs[0]=mkCreator()}
  for(const c of S.collabs)c.f=Math.round(c.f*(1+R(-.01,.025)));
  if(S.collabWith&&!(S.collabUntil>S.am)){const p=S.collabWith==='rival'?S.rival:S.collabs.find(c=>c.id===S.collabWith);if(p)log(`${p.name}とのコラボ期間が終わった`,'sns');S.collabWith=null;if(S.postPlan==='collab')S.postPlan='normal'}
  const rp0=S.rpPrev==null?S.rp:S.rpPrev;S.rpRate=S.rpRate==null?Math.max(0,S.rp-rp0):S.rpRate*.7+Math.max(0,S.rp-rp0)*.3;S.rpPrev=S.rp;
}
function ensureV10(){if(!S)return;if(S.postPlan==null)S.postPlan='normal';if(S.autoEv==null)S.autoEv=1;if(S.trendStop==null)S.trendStop=1;if(!S.collabs)S.collabs=[];if(S.trend&&S.trend.s)S.trend.s=null}

document.addEventListener('click',e=>{const b=e.target.closest('button');if(!b||!S)return;const d=b.dataset;
  if(d.pplan){S.postPlan=d.pplan;save();renderPanel();return}
  if(d.askc){askCollab(d.askc);return}
  if(d.act==='autoTrend'){S.autoTrend=S.autoTrend?0:1;if(S.autoTrend&&genreOk(S.trend.g))S.genre=S.trend.g;save();renderPanel();return}
  if(d.act==='matchTrend'){if(genreOk(S.trend.g)){S.genre=S.trend.g;log(`ジャンルを流行の「${GENRES[S.genre].n}」にした`,'sns');save();render()}return}
  if(d.act==='autoEvT'){S.autoEv=S.autoEv!==0?0:1;save();renderPanel();renderCtrl();return}
  if(d.act==='trendStopT'){S.trendStop=S.trendStop!==0?0:1;save();renderPanel();return}
  if(d.act==='kcTake'){const g=Math.round(S.kc.f*.5);openSns('milu');S.f.milu+=g;S.kc.on=0;S.kc.cont=0;S.kc.was=1;tl('家族チャンネルを引き継いだ');log(`家族チャンネルから${num(g)}人を引き継いだ`,'sns');save();render();return}
  if(d.act==='kcEnd'){S.kc.on=0;S.kc.cont=0;S.kc.was=1;ad('priv',5);log('家族チャンネルを終わりにした','life');save();render();return}
});
GUIDE.forEach(g=>{
  if(g[0]==='sns')g[2]=`SNSでフォロワーを増やす。
・「発信」タブで、ジャンル・スタイル・投稿の企画（ふつう・ショート・大型企画・ライブ・コラボ）を決める。「予定」で「投稿する」を入れた月に、その方針で投稿する。
・流行のジャンルで投稿すると伸びやすい。流行は1〜2年ほど続く。「流行に自動で合わせる」をONにすると、ジャンルを自動で切りかえる。
・スタイル：安全運転・ふつう・攻め・ゆるく癒し・ガチ解説・バラエティ・エモい物語・流行に全乗り。それぞれ伸び方・炎上・ファンの育ち方が違う。
・コラボ：「発信」タブの「コラボ」から、ほかの配信者に申し込める。引き受けてもらえると3か月いっしょに投稿でき、相手のファンが来てくれる。相手から誘われることもある。
・ファン層：ガチ勢はシリーズものやライブで育ち、ファンクラブ収入になる。アンチは攻めた投稿やバズで増え、炎上しやすくなる。
・投稿の質はスキル・素質・機材・体調で決まる。機材は買い足すほど効果が小さくなる。`;
  if(g[0]==='act')g[2]=`毎月の自由な時間に何をするかを決める。
・いちばん上の「いまできること」に、今やれることが並ぶ。押すとその画面に移る。
・行動を選んでから「何をするか」（勉強の種類・遊びの種類など）を選べる。投稿の企画は「発信」タブで決める。
・学校や仕事は自動で入る。小学生は自由な枠が3つ。「おまかせ」をONにすると自動で決めてくれる。
・時間の進み方（1か月・1週間・3か月）と、倍速のときの自動進行もここで変えられる。`;
  if(g[0]==='skill')g[2]=`・研究：研究ポイントで新しい建物や機能を解放する。まだ研究できないものには、あと何ポイント・何か月くらいかかるかが出る。「事業」→「研究」。
・この人生のスキル：スキルポイントで覚える。どれからでも覚えられる（下のものほどポイントが多く必要）。ポイントは10歳から4年ごとと、人生の節目でもらえる。「人生」→「スキル」。
・引き継ぎスキル：人生を終えるともらえる「引き継ぎポイント」で覚える。これから生まれるすべての人生で有効。それぞれの解放条件を一度満たせば、どれからでも覚えられる。`;
});
OLD_VERS.unshift(['v0.9','versions/v0.9/','感想フォーム・推定プレイ時間・研究とスキルツリーが入ったころ']);
