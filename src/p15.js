// ===== v0.8：研究の追加・スキルツリー（この人生／引き継ぎ）・感想フォーム・舞台の説明 =====

// ----- 研究を追加（分野つき） -----
const RES_CAT={sns:'SNS・配信',biz:'お店・会社',town:'まち',life:'暮らし・家族'};
const RES_CAT_OF={live:'sns',mind:'life',shorts:'sns',collab:'sns',analytics:'sns',asmr:'sns',cafe:'biz',fitness:'biz',town:'town',brand:'sns',company:'biz',fashion:'biz',hr:'biz',eq5:'sns',scout:'biz',avatar:'sns',studio:'biz',politics:'town',gamedev:'biz',nation:'town'};
for(const r of RES)r.cat=RES_CAT_OF[r.id]||'sns';
RES.push(
  {id:'battle_k',cat:'sns',n:'勝負の心得',c:60,d:'ライバルとの勝負に強くなる',req:'collab'},
  {id:'series_k',cat:'sns',n:'シリーズ企画術',c:70,d:'シリーズものが飽きられにくくなる',req:'analytics'},
  {id:'anti_care',cat:'sns',n:'アンチ対策',c:80,d:'アンチが増えにくくなる',req:'mind'},
  {id:'fan_comm',cat:'sns',n:'ファンコミュニティ',c:90,d:'ガチ勢が育ちやすく、ファンクラブ収入+30%',req:'live'},
  {id:'trend_k',cat:'sns',n:'トレンド予測',c:90,d:'流行の噂が当たりやすくなる',req:'analytics'},
  {id:'ai_edit',cat:'sns',n:'AI編集',c:140,d:'投稿の質+4（2023年から）',req:'eq5',year:2023},
  {id:'global',cat:'sns',n:'海外展開',c:220,d:'SNSの伸び+10%、会社の利益+10%',req:'brand'},
  {id:'shop_serv',cat:'biz',n:'接客術',c:50,d:'お店の評価が上がりやすくなる',req:'cafe'},
  {id:'shop_menu',cat:'biz',n:'看板メニュー研究',c:80,d:'お店のお客さん+8%',req:'shop_serv'},
  {id:'invest_k',cat:'biz',n:'資産運用',c:80,d:'投資が少し増えやすくなる'},
  {id:'co_mgmt',cat:'biz',n:'経営学',c:100,d:'会社の利益+12%',req:'company'},
  {id:'tax_k',cat:'biz',n:'節税の知識',c:110,d:'確定申告の税金-15%',req:'invest_k'},
  {id:'eco_read',cat:'biz',n:'景気の読み方',c:130,d:'不景気の悪い影響が4割小さくなる',req:'invest_k'},
  {id:'co_strat',cat:'biz',n:'経営戦略',c:200,d:'会社の利益がさらに+15%',req:'co_mgmt'},
  {id:'fest_k',cat:'town',n:'イベント運営',c:70,d:'まちのイベントの売上+30%、4か月ごとに主催できる',req:'town'},
  {id:'deco_k',cat:'town',n:'インテリア',c:40,d:'部屋の飾りの効果が2倍'},
  {id:'town_plan',cat:'town',n:'都市計画',c:160,d:'新しいまちの開発費-20%、管理費-30%',req:'town'},
  {id:'tour_k',cat:'town',n:'観光戦略',c:110,d:'観光客が増える（お店の客層に観光客が増える）',req:'town_plan'},
  {id:'health_k',cat:'life',n:'健康管理',c:50,d:'毎月少しずつ健康が回復する'},
  {id:'mind2',cat:'life',n:'マインドフルネス',c:70,d:'毎月少しずつメンタルが回復する',req:'mind'},
  {id:'parent_k',cat:'life',n:'子育て学',c:60,d:'子どもとの絆が深まりやすくなる'},
  {id:'mentor_k',cat:'life',n:'指導法',c:120,d:'弟子を5人までとれ、よく育つ',req:'brand'},
  {id:'long_k',cat:'life',n:'長寿の研究',c:260,d:'病気や寿命のリスクが15%下がる',req:'health_k'}
);
for(const r of RES)if(r.base==null)r.base=r.c;
function applyResCost(){const m=lg('g10')?.85:1;for(const r of RES)r.c=Math.round(r.base*m)}
const RLV=[['sns','発信の研究','SNSの伸び+2%（1段ごと）'],['biz','経営の研究','お店のお客さん・会社の利益+2%（1段ごと）'],['life','暮らしの研究','毎月の健康とメンタルの回復+0.05（1段ごと）']];
const rlv=k=>(S&&S.resLv&&S.resLv[k])||0;
const rlvCost=k=>Math.round(120*Math.pow(1.35,rlv(k))*(lg('g10')?.85:1));
function rlvBuy(k){if(!S.resLv)S.resLv={};const c=rlvCost(k);if(S.rp<c||rlv(k)>=20)return;S.rp-=c;S.resLv[k]=rlv(k)+1;log(`${RLV.find(x=>x[0]===k)[1]}が${S.resLv[k]}段になった`,'good');snd('buy');save();render()}
function researchPanel(){applyResCost();const done=RES.filter(r=>has(r.id)).length;
  let h=`<h3>研究ポイント ${Math.floor(S.rp)}</h3><p class="hint">知識・企画・企画作家・図書館・「資格の勉強」「流行の研究」でたまる（10歳から）。完了 ${done} / ${RES.length}。線でつながったものは、上の研究を終えると進める。</p>`;
  for(const [ck,cn] of Object.entries(RES_CAT)){const list=RES.filter(r=>r.cat===ck);
    const roots=list.filter(r=>!r.req||!list.some(x=>x.id===r.req));
    const row=(r,dep)=>{const ok=!r.req||has(r.req),yr=r.year&&S.y<r.year,dn=has(r.id);
      let s=`<div class="rnode ${dn?'done':ok&&!yr?'ready':'lock'}" style="margin-left:${dep*14}px">${dep?'<span class="rl">└</span>':''}<div class="rb"><div>${dn?'✓ ':''}${esc(r.n)} <span class="muted small">${r.c}pt</span></div><div class="muted small">${esc(r.d)}${!ok?`（先に「${esc(RES.find(x=>x.id===r.req).n)}」）`:''}${yr?`（${r.year}年から）`:''}</div></div>${dn?'<span class="chip up">完了</span>':ok&&!yr?`<button class="b sm" type="button" data-res="${r.id}" ${S.rp<r.c?'disabled':''}>研究する</button>`:''}</div>`;
      for(const ch of list.filter(x=>x.req===r.id))s+=row(ch,dep+1);return s};
    h+=`<h3>${cn}</h3><div class="rtree">${roots.map(r=>row(r,0)).join('')}</div>`}
  h+=`<h3>ずっと続けられる研究</h3><p class="hint">研究ポイントが余ったら。何段でも重ねられる（20段まで）。段が上がるほど必要なポイントが増える。</p><div class="rtree">${RLV.map(([k,n,d])=>`<div class="rnode ready"><div class="rb"><div>${n} <b>${rlv(k)}段</b> <span class="muted small">${rlvCost(k)}pt</span></div><div class="muted small">${d}</div></div><button class="b sm" type="button" data-rlv="${k}" ${S.rp<rlvCost(k)||rlv(k)>=20?'disabled':''}>研究する</button></div>`).join('')}</div>`;
  return h}

// ----- この人生のスキルツリー -----
const SKT=[
 ['s','発信',[['s1','話し上手','話術・企画・編集が伸びやすい（+15%）'],['s2','カメラ映え','見た目が伸びやすい（+20%）'],['s3','カリスマ','SNSの伸び+10%'],['s4','ファン思い','ガチ勢が育ちやすい（+30%）'],['s5','バズの申し子','バズる確率+40%']]],
 ['b','ビジネス',[['b1','商売の勘','お店のお客さん+5%'],['b2','おもてなし','お店の評価が上がりやすい'],['b3','経営者の器','会社の利益+10%'],['b4','目利き','投資が増えやすい'],['b5','財界の顔','毎月評判が上がり、選挙に強くなる']]],
 ['l','暮らし',[['l1','早寝早起き','毎月少し健康が回復'],['l2','ストレスに強い','メンタルが減りにくい（-20%）'],['l3','節約上手','家賃と生活費-10%'],['l4','学び上手','知識が伸びやすく、研究ポイント+15%'],['l5','長寿の秘訣','病気や寿命のリスク-15%']]],
 ['r','人間関係',[['r1','聞き上手','仲のよさが上がりやすい（+20%）'],['r2','社交家','人間関係の力が伸びやすい（+20%）'],['r3','恋愛上手','恋人が見つかりやすい'],['r4','家族思い','子どもや家族との絆が深まりやすい'],['r5','人望','弟子が育ち、まちの支持が上がりやすい']]]
];
const SK_COST=[1,2,4,6,8];
const sk=id=>!!(S&&S.skt&&S.skt[id]);
function skNode(id){for(const [bk,bn,ns] of SKT){const i=ns.findIndex(n=>n[0]===id);if(i>=0)return {bk,bn,i,n:ns[i],cost:SK_COST[i],prev:i?ns[i-1][0]:null}}return null}
function skBuy(id){const x=skNode(id);if(!x||sk(id)||(x.prev&&!sk(x.prev))||S.sp<x.cost)return;S.sp-=x.cost;S.skt[id]=1;log(`スキル「${x.n[1]}」を覚えた`,'good');snd('buy');
  if(id==='s2')ad('looks',3);
  if(SKT.some(([bk,bn,ns])=>ns.every(n=>sk(n[0])))){recSet('branch',1)}save();render()}
const SP_MILE=[['buzz',2,'初めてバズった',()=>S.stats.buzz>0],['f1',1,'フォロワー1万人',()=>S.stats.maxF>=1e4],['f2',2,'フォロワー10万人',()=>S.stats.maxF>=1e5],['f3',3,'フォロワー100万人',()=>S.stats.maxF>=1e6],
  ['job',1,'初めての就職',()=>S.st==='work'||S.salSum>0],['wed',2,'結婚',()=>!!S.spouse],['kid',2,'子どもが生まれた',()=>S.kids.length>0],['shop',1,'初めてのお店',()=>anyShop()],['co',2,'会社を設立',()=>(S.cos||[]).length>0],
  ['town2',2,'新しいまちの開発',()=>(S.towns2||[]).length>0],['mayor',3,'市長になった',()=>S.role==='mayor'||S.role==='adviser'],['goal',3,'人生の目標を達成',()=>!!S.goalDone],['res10',2,'研究を10個完了',()=>RES.filter(r=>has(r.id)).length>=10],['m1',2,'資産1億円',()=>S.stats.maxM>=1e8]];
function spTick(){if(S.sp==null){S.sp=0;S.skt={};S.spGot={};S.spAge=0}const a=age();
  if(a>=10&&(a-10)%4===0&&S.spAge!==a){S.spAge=a;S.sp++}
  for(const [k,v,n,f] of SP_MILE){if(S.spGot[k])continue;let ok=false;try{ok=f()}catch(_){}if(ok){S.spGot[k]=1;S.sp+=v;log(`スキルポイント+${v}（${n}）`,'good')}}}
function sktHtml(){let h=`<h2>この人生のスキル</h2><p class="hint">スキルポイント <b>${S.sp||0}</b>。10歳から4年ごとに1ポイント、人生の節目（初めてのバズ・結婚・会社設立など）でもらえる。上から順に覚える。この人生の間だけ有効。</p><div class="sktree">`;
  for(const [bk,bn,ns] of SKT){h+=`<div class="skb"><h3>${bn}</h3>`;ns.forEach((n,i)=>{const own=sk(n[0]),can=!own&&(!i||sk(ns[i-1][0]));h+=`${i?'<div class="skl">│</div>':''}<button class="sknode ${own?'own':can?'can':'lock'}" type="button" data-skt="${n[0]}" ${own||!can||(S.sp||0)<SK_COST[i]?'disabled':''}><b>${esc(n[1])}</b><span>${esc(n[2])}</span><em>${own?'習得済み':SK_COST[i]+'pt'}</em></button>`});h+='</div>'}
  return h+'</div>'}

// ----- 引き継ぎスキルツリー（すべての人生で有効） -----
const LEG=[
 {id:'g1',n:'生まれつきの才能',d:'生まれたときの素質がすべて+4',c:6,cond:'人生を1回終える',ok:r=>(META.lives||0)>=1},
 {id:'g2',n:'ご先祖の知恵',d:'10歳のとき研究ポイント+40',c:12,req:'g1',cond:'1つの人生で研究を15個完了',ok:r=>r.res15},
 {id:'g3',n:'魂の記憶',d:'スキルポイント+4を持って生まれる',c:15,req:'g1',cond:'スキルの枝を1本すべて覚える',ok:r=>r.branch},
 {id:'g4',n:'丈夫な家系',d:'病気や寿命のリスク-8%',c:18,req:'g1',cond:'90歳まで生きる',ok:r=>r.age90},
 {id:'g5',n:'配信者の血',d:'SNSの伸び+8%',c:25,req:'g3',cond:'フォロワー100万人を達成',ok:r=>r.f1m},
 {id:'g6',n:'実業家の血',d:'お店のお客さんと会社の利益+8%',c:25,req:'g2',cond:'資産10億円を達成',ok:r=>r.m1b},
 {id:'g7',n:'まちの守り人',d:'まちの支持+15、発展度+5で始まる',c:25,req:'g2',cond:'市長になる',ok:r=>r.mayor},
 {id:'g8',n:'名家',d:'少し裕福な家庭に生まれやすい',c:30,req:'g4',cond:'3代続ける（エンドレス）',ok:r=>r.gen3},
 {id:'g9',n:'大家族',d:'子どもとの絆が深まりやすく、子どもを授かりやすい',c:20,req:'g4',cond:'子どもを3人育てる',ok:r=>r.kids3},
 {id:'g10',n:'先見の明',d:'研究に必要なポイント-15%',c:30,req:'g2',cond:'1つの人生で研究を40個完了',ok:r=>r.res40},
 {id:'g11',n:'時代を超える者',d:'18歳のとき、家から500万円を受け取る',c:35,req:'g6',cond:'人生の目標を3回達成',ok:r=>(r.goals||0)>=3},
 {id:'g12',n:'伝説の一族',d:'スキルポイント+4、SNSの伸びと会社の利益+5%',c:60,req:'g5',cond:'実績を25個解除',ok:r=>Object.keys(META.ach||{}).length>=25}
];
function legState(){if(!META.leg)META.leg={lp:0,nodes:{}};if(!META.rec)META.rec={};return META.leg}
const lg=id=>{try{return !!(META.leg&&META.leg.nodes[id])}catch(_){return false}};
function recSet(k,v){legState();META.rec[k]=v;saveMeta()}
function recUpdate(){if(!S)return;legState();const R2=META.rec;const n=RES.filter(r=>has(r.id)).length;let ch=false;const set=(k,c)=>{if(c&&!R2[k]){R2[k]=1;ch=true}};
  set('res15',n>=15);set('res40',n>=40);set('age90',age()>=90);set('f1m',S.stats.maxF>=1e6);set('m1b',S.stats.maxM>=1e9);set('mayor',S.role==='mayor'||S.role==='adviser');set('gen3',(S.gen||1)>=3);set('kids3',S.kids.length>=3);
  if(ch)saveMeta()}
function lpOfLife(){const st=S.stats,a=age();let p=1+Math.floor(a/25);if(st.maxF>=1e4)p++;if(st.maxF>=1e5)p+=2;if(st.maxF>=1e6)p+=3;if(st.maxM>=1e8)p+=2;if(st.maxM>=1e9)p+=2;if(S.goalDone)p+=3;if(S.role==='mayor'||S.role==='adviser')p+=2;p+=Math.floor(RES.filter(r=>has(r.id)).length/10);return p}
function lifeEndLegacy(){legState();recUpdate();const p=lpOfLife();META.leg.lp+=p;S.lpGain=p}
function legBuy(id){const L=legState(),x=LEG.find(n=>n.id===id);if(!x||L.nodes[id]||(x.req&&!L.nodes[x.req])||!x.ok(META.rec)||L.lp<x.c)return;L.lp-=x.c;L.nodes[id]=1;saveMeta();applyResCost();snd('buy');if(S&&!$('#scrGame').hidden&&!modalOpen())render();else showLegacy()}
function legHtml(){const L=legState();let h=`<p class="hint">引き継ぎポイント <b>${L.lp}</b>。人生を終えるたびに、その人生の成果に応じてもらえる。覚えたスキルは、これから生まれるすべての人生で有効。覚えるには「解放条件」を満たしたうえでポイントが必要。</p><div class="legtree">`;
  const row=(x,dep)=>{const own=L.nodes[x.id],reqOk=!x.req||L.nodes[x.req],cond=x.ok(META.rec),can=!own&&reqOk&&cond&&L.lp>=x.c;
    let s=`<div class="legnode ${own?'own':reqOk&&cond?'can':'lock'}" style="margin-left:${dep*14}px"><div><b>${dep?'└ ':''}${esc(x.n)}</b> <span class="muted small">${x.c}pt</span><div class="small">${esc(x.d)}</div><div class="muted small">解放条件：${esc(x.cond)} ${cond?'✓':'（未達成）'}${!reqOk?` ／ 先に「${esc(LEG.find(n=>n.id===x.req).n)}」`:''}</div></div>${own?'<span class="chip up">習得済み</span>':`<button class="b sm" type="button" data-leg="${x.id}" ${can?'':'disabled'}>覚える</button>`}</div>`;
    for(const c of LEG.filter(n=>n.req===x.id))s+=row(c,dep+1);return s};
  h+=LEG.filter(x=>!x.req).map(x=>row(x,0)).join('');return h+'</div>'}
function showLegacy(){openModal(`<div class="mcat life">引き継ぎスキル</div><h2>引き継ぎスキル</h2>${legHtml()}<button class="b pri" type="button" data-act="close">閉じる</button>`)}
function applyLegacy(T,isNew){if(lg('g1'))for(const k in T.tal)T.tal[k]=clamp(T.tal[k]+4);
  T.sp=(lg('g3')?4:0)+(lg('g12')?4:0);T.skt={};T.spGot={};T.spAge=0;
  if(lg('g11'))T.trust=(T.trust||0)+Math.round(5e6*Math.max(.2,T.cty.inc));
  if(isNew&&lg('g8')&&T.tier<4&&chance(.6))T.tier++;
  if(isNew&&lg('g7')&&T.town){T.town.support=clamp((T.town.support||50)+15);T.town.bonus=(T.town.bonus||0)+5}}

// ----- 効果のつなぎこみ -----
function perkMul(k){let m=1;if(!S)return m;
  if(sk('s1')&&(k==='talk'||k==='plan'||k==='edit'))m*=1.15;if(sk('s2')&&k==='looks')m*=1.2;if(sk('l4')&&k==='know')m*=1.2;if(sk('r2')&&k==='social')m*=1.2;return m}
function discMul(){const sr=S.series||{n:0,fat:0};let m=1;if(sr.n>=3)m*=1+Math.min(.3,sr.n*.025);if(sr.fat>10)m*=1-Math.min(.45,(sr.fat-10)*.035);if(persTop()==='bold')m*=1.1;
  if(sk('s3'))m*=1.1;m*=1+.02*rlv('sns');if(has('global'))m*=1.1;if(lg('g5'))m*=1.08;if(lg('g12'))m*=1.05;return m}
const buzzPerk=()=>sk('s5')?1.4:1;
const shopPerk=()=>(1+.02*rlv('biz'))*(sk('b1')?1.05:1)*(has('shop_menu')?1.08:1)*(lg('g6')?1.08:1);
const starPerk=()=>(sk('b2')?.25:0)+(has('shop_serv')?.3:0);
const coPerk=()=>(1+.02*rlv('biz'))*(sk('b3')?1.1:1)*(has('co_mgmt')?1.12:1)*(has('co_strat')?1.15:1)*(has('global')?1.1:1)*(lg('g6')?1.08:1)*(lg('g12')?1.05:1);
const invPerk=()=>(sk('b4')?.003:0)+(has('invest_k')?.004:0);
const livMul=()=>sk('l3')?.9:1;
const mortMul=()=>(sk('l5')?.85:1)*(has('long_k')?.85:1)*(lg('g4')?.92:1);
const devCostMul=()=>has('town_plan')?.8:1;
const evCd=()=>has('fest_k')?4:6;
const discMax=()=>has('mentor_k')?5:3;
function ecoMul(){let m=1;for(const h of HIST)if(h.eco&&histOk(h)&&S.y>=h.y&&S.y<h.to)m*=h.eco;if(m<1&&has('eco_read'))m=1-(1-m)*.6;return m}
function postHook(k,q,buzzed,nf){
  const sr=S.series;const fat=(has('series_k')?.6:1);if(sr.g===S.genre){sr.n+=k;sr.fat+=k*(POPT==='big'?.3:1)*fat}else{sr.g=S.genre;sr.n=k;sr.fat=0}
  const F=totalF(),prev=Math.max(1,F-Math.max(0,nf));
  let g=(.0025*k*(sr.n>=3?1.6:1)+(POPT==='live'?.004*k:0)+(POPT==='collab'?.001*k:0))*(1-S.fanCore/.4)*(sk('s4')?1.3:1)*(has('fan_comm')?1.3:1);
  S.fanCore=clamp(S.fanCore+g,.02,.4);
  if(nf>0)S.fanCore=(S.fanCore*prev+nf*.04)/(prev+nf);
  S.fanAnti=clamp(S.fanAnti+((S.style==='edge'?.0025:S.style==='safe'?-.001:.0003)*k+(buzzed?.006:0))*(has('anti_care')&&(S.style!=='safe')?.5:1),0,.3);
  S.fanCore=clamp(S.fanCore,.02,.4);
}
function monthHook8(){
  spTick();
  if(sk('l1')||has('health_k'))ad('health',(sk('l1')?.2:0)+(has('health_k')?.25:0));
  if(has('mind2'))ad('mental',.3);if(rlv('life')){ad('health',.05*rlv('life'));ad('mental',.05*rlv('life'))}
  if(sk('b5'))ad('rep',.2);
  if(sk('l4')&&age()>=10)S.rp+=.15;
  const kb=(sk('r4')?.4:0)+(has('parent_k')?.3:0)+(lg('g9')?.2:0);if(kb)for(const c of S.kids)if((S.am-c.born)/12<18)c.bond=clamp((c.bond||50)+kb,0,100);
  if(sk('r4')&&S.spouse)rel(S.spouse,.2);
  if(sk('r5')){for(const d of S.disc||[])d.f=Math.round(d.f*1.004);if(S.town)S.town.support=clamp((S.town.support||50)+.1)}
  if(lg('g9')&&S.spouse&&S.kids.length<4&&age()<45&&chance(.004)&&!S.q.includes('l_baby'))S.q.push('l_baby');
  if(lg('g2')&&age()>=10&&!S.flags.g2){S.flags.g2=1;S.rp+=40;log('ご先祖の知恵：研究ポイント+40','good')}
  if(S.m===1)recUpdate();
}

// ----- 舞台・時代の説明（はじめから） -----
const STAGE_D={
  nipporia:'日本によく似た架空の国。日本の暮らしに近く、いちばん遊びやすい標準の舞台。実在の出来事は世界のものだけが流れる。',
  japan:'現実の日本。物価や寿命は日本の統計が目安。「過去」を選ぶと、東京オリンピックやバブル、平成・令和への改元など、日本で実際にあった出来事が流れる。',
  world:'現実の国のどこか（生まれる人数が多い国ほど選ばれやすい）。国によって収入・寿命・ネットの普及が大きく違い、きびしい人生になることも。',
  fantasy:'架空の大陸の国々。極端な国（とても裕福・とても貧しい・ネットが少ないなど）があり、腕だめし向き。'
};
function ctyDesc(id){const c=COUNTRIES[id];if(!c)return '';const lv=v=>v>=1.2?'とても高い':v>=.8?'ふつう':v>=.4?'低め':'とても低い';return `${c.n}：${c.flavor?c.flavor+'。':''}収入 ${lv(c.inc)}・ネットの普及 ${Math.round((c.net||0)*100)}%・寿命 ${c.life<=1?'長め':c.life<=1.4?'ふつう':'短め'}`}
function setupNotes(){const st=$('#suStage'),box=$('#suStageDesc');if(st&&box){const cs=$('#suCty');box.textContent=STAGE_D[st.value]+(cs&&cs.value?'\n'+ctyDesc(cs.value):'')}
  const er=$('#suEra'),nb=$('#suEraNote');if(!er||!nb)return;let y=null;if(er.value==='pick')y=parseInt(($('#suYear')||{}).value,10);
  let t='';
  if(er.value==='past')t=`⚠ 過去の時代はSNSがまだない。SNSが登場するのは${SNS_ERA}年ごろ。生まれた年によっては、SNSを始められるのは大人になってから（1950年生まれなら55歳ごろ）。それまでは勉強・仕事・お店・会社・まちづくりで人生を進める。`;
  else if(er.value==='pick'&&y>=1940&&y<=2100){const sa=SNS_ERA-y;t=y+13<SNS_ERA?`⚠ ${y}年生まれだと、SNSが登場する${SNS_ERA}年ごろには${sa}歳。それまではSNSで発信できない。勉強・仕事・お店・会社・まちづくりで人生を進めよう。`:y>2026?'未来の時代。出来事は想像のもので、VR配信や新しいSNSなど、未来の仕組みが登場する。':'SNSがある時代。13歳から始められる。'}
  else if(er.value==='pick')t='1940〜2100の数字を入れてね。';
  else if(er.value==='future')t='未来の時代。出来事は想像のもので、VR配信（2035年）・新しいSNS（2040年）・AIとの共演（2048年）が登場する。';
  nb.textContent=t;nb.hidden=!t;nb.className='hint'+(t.startsWith('⚠')?' warnnote':'')}
document.addEventListener('change',e=>{if(['suStage','suCty','suEra'].includes(e.target.id))setTimeout(setupNotes,0)});
document.addEventListener('input',e=>{if(e.target.id==='suYear')setupNotes()});

// ----- プレイ時間の目安 -----
// ▶ は1か月1.5秒、▶▶は0.75秒、▶▶▶は0.38秒。出来事は1年に約5〜6回、1回あたり読んで選ぶのに約8秒として計算
const EVY=5.5,EVS=8;
function playMin(years,spd){const turn=1.5/spd;return Math.round(years*(12*turn+EVY*EVS)/60)}
function timeHtml(){return `<table class="ttable"><tr><th>進め方</th><th>10年ごと</th><th>一生（80年）</th></tr>
<tr><td>▶ ふつう</td><td>約${playMin(10,1)}分</td><td>約${playMin(80,1)}分</td></tr>
<tr><td>▶▶ 2倍</td><td>約${playMin(10,2)}分</td><td>約${playMin(80,2)}分</td></tr>
<tr><td>▶▶▶ 4倍</td><td>約${playMin(10,4)}分</td><td>約${playMin(80,4)}分</td></tr>
<tr><td>3か月ずつ＋▶▶▶</td><td>約${Math.round(playMin(10,12))}分</td><td>約${playMin(80,12)}分</td></tr></table>
<p class="hint">出来事を読んで選ぶ時間（1回約8秒）を含めた目安。お店や会社をじっくり操作すると、そのぶん長くなる。エンドレスは子ども1人ぶんごとに同じくらいかかる。セーブは自動なので、途中でやめても続きから遊べる。</p>`}
GUIDE.splice(1,0,['time','プレイ時間の目安','']);
GUIDE.push(['stage','舞台の特徴',Object.entries(STAGES).map(([k,s])=>`■ ${s.n}\n${STAGE_D[k]||''}`).join('\n\n')+'\n\n※「世界のどこか」は1回人生を終えると、「架空の大陸」はフォロワー1万人を達成すると選べるようになる。']);
GUIDE.push(['skill','研究とスキルツリー',`・研究：研究ポイントで新しい建物や機能を解放する。分野ごとに、つながった順に進める（全${RES.length}個）。「事業」→「研究」。
・この人生のスキル：スキルポイントで覚える、4つの枝（発信・ビジネス・暮らし・人間関係）のスキル。ポイントは10歳から4年ごとと、人生の節目でもらえる。その人生の間だけ有効。「人生」→「スキル」。
・引き継ぎスキル：人生を終えるともらえる「引き継ぎポイント」で覚える。これから生まれるすべての人生で有効。覚えるには、それぞれの「解放条件」（90歳まで生きる・フォロワー100万人など）を一度満たす必要がある。タイトルの「引き継ぎスキル」か「人生」→「スキル」。`]);
GUIDE.push(['fb','感想・不具合を送る',`タイトルやメニューの「感想・不具合を送る」から、ゲームの感想やバグを送れる。送ったあとで直したくなったら、同じ画面の「送ったもの」から直して送り直せる（訂正版として届く）。`]);
function showGuide(k){const cur=GUIDE.find(g=>g[0]===k)||GUIDE[0];
  openModal(`<div class="mcat life">遊び方</div><h2>遊び方：${esc(cur[1])}</h2><div class="subtabs">${GUIDE.map(g=>`<button class="stab" type="button" data-guide="${g[0]}" aria-pressed="${g[0]===cur[0]}">${esc(g[1])}</button>`).join('')}</div>${cur[0]==='time'?timeHtml():`<p class="mtext guide">${esc(cur[2])}</p>`}${cur[0]==='fb'?'<div class="row"><button class="b" type="button" data-act="fb">感想・不具合を送る</button></div>':''}<button class="b pri" type="button" data-act="close">閉じる</button>`)}

// ----- 感想・不具合フォーム -----
// 送り先：Googleフォームを用意したら FB_FORM に設定すると、1つの表に自動で集まる。未設定のときは LINE などの共有で送る
const FB_FORM=null; // 例 {url:'https://docs.google.com/forms/d/e/xxxx/formResponse',e:{id:'entry.1',name:'entry.2',body:'entry.3'}}
const FB_KEY='buzz-feedback';
const FB_Q=[['good','よかったところ・楽しかったところ'],['bad','わかりにくい・つまらない・不満なところ'],['bug','バグ・おかしな動き（どの画面で、何をしたら）'],['want','ほしい機能・アイデア'],['other','そのほか']];
function fbList(){try{return JSON.parse(localStorage.getItem(FB_KEY)||'[]')}catch(_){return []}}
function fbSaveList(a){try{localStorage.setItem(FB_KEY,JSON.stringify(a.slice(-20)))}catch(_){}}
let FB_EDIT=null,FB_STAR=0;
function fbForm(item){FB_EDIT=item?item.id:null;FB_STAR=item?item.star:0;const v=item||{};let nm='';try{nm=localStorage.getItem(FB_KEY+'-name')||''}catch(_){}
  const list=fbList();
  openModal(`<div class="mcat life">感想・不具合</div><h2>${item?'送ったものを直す':'感想・不具合を送る'}</h2>
  <p class="hint">${item?`#${esc(item.id)} を直して送り直す。訂正版として届く。`:'書けるところだけでOK。'}${FB_FORM?'':'「送る」を押すと LINE などで送る画面が開く（PCではコピーされる）。'}</p>
  <div class="form"><label class="fld"><span>名前（任意）</span><input id="fbName" maxlength="20" value="${esc(v.name!=null?v.name:nm)}"></label>
  <div class="fld"><span>楽しさ</span><div class="seg" id="fbStars">${[1,2,3,4,5].map(i=>`<button type="button" data-fbstar="${i}" class="${FB_STAR===i?'on':''}">${'★'.repeat(i)}</button>`).join('')}</div></div>
  ${FB_Q.map(([k,q])=>`<label class="fld fbq"><span>${q}</span><textarea id="fb_${k}" rows="3" maxlength="1000">${esc((v.f||{})[k]||'')}</textarea></label>`).join('')}
  <label class="fld chk"><input type="checkbox" id="fbInfo" ${v.info===false?'':'checked'}> <span>遊んでいる版と、今の人生の年齢・年を一緒に送る（不具合を直すのに役立つ）</span></label></div>
  <div class="mch"><button class="b pri" type="button" data-act="fbSend">${item?'直して送り直す':'送る'}</button>${list.length&&!item?`<button class="b" type="button" data-act="fbMine">送ったもの（${list.length}件）・直す</button>`:''}<button class="b ghost" type="button" data-act="close">やめる</button></div>`)}
function fbText(it){const lines=[`【Buzz人生シミュレーター 感想${it.rev?`・訂正${it.rev}回目`:''}】#${it.id}`];if(it.name)lines.push('名前：'+it.name);if(it.star)lines.push('楽しさ：'+'★'.repeat(it.star)+'☆'.repeat(5-it.star));
  for(const [k,q] of FB_Q)if(it.f[k])lines.push(`■${q}\n${it.f[k]}`);if(it.info&&it.env)lines.push('（'+it.env+'）');return lines.join('\n')}
async function fbSend(){const f={};for(const [k] of FB_Q)f[k]=($('#fb_'+k).value||'').trim();const name=($('#fbName').value||'').trim();
  if(!FB_STAR&&!Object.values(f).some(Boolean)){toast('どこか1つ書いてね');return}
  try{localStorage.setItem(FB_KEY+'-name',name)}catch(_){}
  const list=fbList();let it=FB_EDIT&&list.find(x=>x.id===FB_EDIT);
  const env=`${CUR_VER}・${/iPhone|iPad|Android/i.test(navigator.userAgent)?'スマホ':'PC'}${S?`・${S.y}年・${age()}歳・${ctry()}`:''}`;
  if(it){Object.assign(it,{f,name,star:FB_STAR,info:$('#fbInfo').checked,env,rev:(it.rev||0)+1,at:Date.now()})}
  else{it={id:Date.now().toString(36).slice(-6).toUpperCase(),f,name,star:FB_STAR,info:$('#fbInfo').checked,env,rev:0,at:Date.now()};list.push(it)}
  fbSaveList(list);const text=fbText(it);let how='';
  if(FB_FORM){try{const fd=new URLSearchParams();fd.append(FB_FORM.e.id,it.id+(it.rev?`（訂正${it.rev}）`:''));fd.append(FB_FORM.e.name,name);fd.append(FB_FORM.e.body,text);await fetch(FB_FORM.url,{method:'POST',mode:'no-cors',body:fd});how='送信しました。ありがとう！'}catch(_){how='送信できなかった。電波のよいところでもう一度試してね。'}}
  else if(navigator.share){try{await navigator.share({text});how='ありがとう！'}catch(_){how='送るのをやめた。下の文章をコピーして送ることもできる。'}}
  else{try{await navigator.clipboard.writeText(text);how='コピーしました。LINE やメールに貼りつけて送ってね。'}catch(_){how='下の文章をコピーして、LINE やメールで送ってね。'}}
  openModal(`<div class="mcat life">感想・不具合</div><h2>ありがとう！</h2><p class="mtext">${esc(how)}\nあとで直したくなったら「感想・不具合を送る」→「送ったもの・直す」から送り直せる。</p><textarea class="fbout" rows="8" readonly>${esc(text)}</textarea><div class="mch"><button class="b" type="button" data-act="fbCopy">文章をコピー</button><button class="b pri" type="button" data-act="close">閉じる</button></div>`)}
function fbMine(){const list=fbList().slice().reverse();openModal(`<div class="mcat life">感想・不具合</div><h2>送ったもの</h2><p class="hint">このブラウザから送ったもの。「直す」で書き直して、訂正版として送り直せる。</p>${list.map(it=>{const d=new Date(it.at);return `<div class="shop"><div><div>#${esc(it.id)} ${it.star?'★'.repeat(it.star):''}${it.rev?` <span class="chip">訂正${it.rev}</span>`:''}</div><div class="muted small">${d.getMonth()+1}/${d.getDate()} ${esc(((Object.values(it.f).find(Boolean))||'').slice(0,40))}</div></div><button class="b sm" type="button" data-fbedit="${esc(it.id)}">直す</button></div>`}).join('')||'<p class="hint">まだない。</p>'}<div class="mch"><button class="b" type="button" data-act="fb">新しく書く</button><button class="b pri" type="button" data-act="close">閉じる</button></div>`)}
document.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;const d=b.dataset;
  if(d.act==='fb'){fbForm(null);return}if(d.act==='fbMine'){fbMine();return}if(d.act==='fbSend'){fbSend();return}
  if(d.act==='fbCopy'){const t=document.querySelector('.fbout');if(t){try{navigator.clipboard.writeText(t.value).then(()=>toast('コピーしました'),()=>{t.select()})}catch(_){t.select()}}return}
  if(d.fbstar){FB_STAR=+d.fbstar;document.querySelectorAll('[data-fbstar]').forEach(x=>x.classList.toggle('on',+x.dataset.fbstar===FB_STAR));return}
  if(d.fbedit){const it=fbList().find(x=>x.id===d.fbedit);if(it)fbForm(it);return}
  if(d.leg){legBuy(d.leg);return}
  if(d.act==='legacy'){showLegacy();return}
  if(d.skt&&S){skBuy(d.skt);return}
  if(d.rlv&&S){rlvBuy(d.rlv);return}
});

// ----- 人生タブ「スキル」 -----
function lifeSkillHtml(){return sktHtml()+`<h2>引き継ぎスキル</h2>${legHtml()}`}
function ensureV8(){if(S&&S.sp==null){S.sp=0;S.skt={};S.spGot={};S.spAge=Math.max(0,age())}}
try{applyResCost()}catch(_){}
EV.birth.text=(base=>()=>base()+(S.y+13<SNS_ERA?`\n\n⚠ この時代はまだSNSがない。SNSが登場するのは${SNS_ERA}年ごろ（あなたが${SNS_ERA-S.y}歳のころ）。それまでは勉強・仕事・お店・会社・まちづくりで人生を進めよう。`:''))(EV.birth.text);
