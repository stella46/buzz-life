// ===== v0.3：行動の中身・お金・支払い・経営・画面整理 =====
CFG.ver3=1;
function ensureV3(){if(!S)return;ensureV6();if(!S.planOpt)S.planOpt=[];if(!S.bills)S.bills=[];if(S.autopay==null)S.autopay=0;if(S.credit==null)S.credit=70;if(S.home==null)S.home=S.indep?2:0;if(!S.subs)S.subs={};if(!S.goods)S.goods={};if(S.debtRate==null)S.debtRate=0;if(S.indep&&!S.home)S.home=1;if(S.town)for(const t of S.town.tiles)initShop(t)}

// ----- 行動の中身 -----
const ci=()=>Math.max(.2,S.cty.inc);
ACT.study.opts=[
  {k:'school',n:'教科の勉強',d:'知識が上がる。少し疲れる',f:k=>{ad('know',2.2*k);ad('mental',-.6*k)}},
  {k:'license',n:'資格の勉強',d:'知識と研究ポイントが増える',ok:()=>age()>=15,f:k=>{ad('know',1.6*k);S.rp+=.6*k;ad('mental',-.6*k)}},
  {k:'lang',n:'語学',d:'知識が上がり、海外のファンが増えやすくなる',ok:()=>age()>=10,f:k=>{ad('know',1.3*k);S.flags.lang=(S.flags.lang||0)+k;ad('mental',-.4*k)}},
  {k:'read',n:'読書',d:'知識とメンタルが少し上がる',f:k=>{ad('know',1.5*k);ad('mental',.4*k)}}];
ACT.play.opts=[
  {k:'out',n:'外で遊ぶ',d:'健康と人間関係',f:k=>{ad('happy',2*k);ad('health',1*k);ad('social',.6*k);ad('tal.vlog',.8*k)}},
  {k:'game',n:'ゲームで遊ぶ',d:'ゲーム実況の素質',f:k=>{ad('happy',2.2*k);ad('tal.game',2*k);ad('health',-.3*k)}},
  {k:'art',n:'絵や工作',d:'Vlog・美容の素質',f:k=>{ad('happy',1.6*k);ad('tal.vlog',1.4*k);ad('tal.beauty',1*k)}},
  {k:'music',n:'歌や楽器',d:'音楽の素質',f:k=>{ad('happy',1.8*k);ad('tal.music',2*k)}},
  {k:'help',n:'家のお手伝い',d:'料理の素質と家族との仲',f:k=>{ad('happy',1*k);ad('tal.cook',1.8*k);relP(1.5*k)}},
  {k:'joke',n:'友達を笑わせる',d:'お笑い・雑談の素質',f:k=>{ad('happy',1.8*k);ad('tal.comedy',1.6*k);ad('tal.talk',.8*k);ad('social',.4*k)}}];
ACT.exercise.opts=[
  {k:'run',n:'ランニング',d:'健康が大きく上がる',f:k=>{ad('health',2.6*k);ad('mental',.4*k)}},
  {k:'muscle',n:'筋トレ',d:'健康と見た目',f:k=>{ad('health',1.6*k);ad('looks',1*k)}},
  {k:'yoga',n:'ヨガ・ストレッチ',d:'健康とメンタル',f:k=>{ad('health',1.2*k);ad('mental',2*k)}},
  {k:'sports',n:'みんなでスポーツ',d:'健康と人間関係',f:k=>{ad('health',2*k);ad('social',1*k)}}];
ACT.friends.opts=[
  {k:'out',n:'遊びに出かける',d:'人間関係と幸福。お金がかかる',f:k=>{ad('social',2.4*k);ad('happy',1.6*k);for(const n of S.friends)rel(n,1.2*k);if(age()>=13)outc('date',Math.round(3000*k*ci()))}},
  {k:'home',n:'家でゆっくり語る',d:'人間関係とメンタル',f:k=>{ad('social',1.6*k);ad('mental',1*k);for(const n of S.friends)rel(n,1*k)}},
  {k:'video',n:'一緒に動画を撮る',d:'仲が深まり、フォロワーも少し増える',ok:()=>S.snsOpen,f:k=>{ad('social',1.4*k);for(const n of S.friends)rel(n,1*k);ad('f',Math.round((10+Math.sqrt(totalF())*2)*k))}}];
ACT.rest.opts=[
  {k:'sleep',n:'たっぷり寝る',d:'健康が大きく回復',f:k=>{ad('health',3.2*k);ad('mental',2*k)}},
  {k:'hobby',n:'趣味の時間',d:'メンタルと幸福が回復',f:k=>{ad('mental',3.5*k);ad('happy',1*k);ad('health',1*k)}},
  {k:'nothing',n:'何もしない',d:'少しずつ回復',f:k=>{ad('health',2*k);ad('mental',2.5*k)}}];
ACT.practice.opts=[
  {k:'edit',n:'編集の練習',d:'編集が大きく上がる',f:k=>{ad('edit',2.6*k);ad('mental',-.3*k)}},
  {k:'plan',n:'企画会議',d:'企画が大きく上がる',f:k=>{ad('plan',2.6*k);ad('mental',-.3*k)}},
  {k:'script',n:'台本づくり',d:'企画と話術',f:k=>{ad('plan',1.6*k);ad('talk',1*k);ad('mental',-.3*k)}},
  {k:'trend',n:'流行の研究',d:'企画と研究ポイント',f:k=>{ad('plan',1.2*k);S.rp+=.5*k}}];
ACT.talkp.opts=[
  {k:'talk',n:'話し方の練習',d:'話術が大きく上がる',f:k=>{ad('talk',2.6*k);ad('mental',-.3*k)}},
  {k:'fashion',n:'ファッション研究',d:'見た目が上がる。少しお金がかかる',f:k=>{ad('looks',2.2*k);outc('shop',Math.round(5000*k*ci()))}},
  {k:'acting',n:'演技のレッスン',d:'話術とお笑いの素質',f:k=>{ad('talk',1.6*k);ad('tal.comedy',1*k);ad('looks',.4*k)}}];
ACT.part.opts=[
  {k:'conv',n:'コンビニ',d:'ふつうの時給。人と話す機会が多い',f:k=>{inc('part',Math.round(45000*k*S.region.sal*S.cty.inc));ad('health',-.7*k);ad('social',.6*k)}},
  {k:'food',n:'飲食店',d:'少し高い時給。料理の素質も伸びる',f:k=>{inc('part',Math.round(47000*k*S.region.sal*S.cty.inc));ad('health',-.9*k);ad('tal.cook',.8*k)}},
  {k:'deliv',n:'配達',d:'高い時給。体力を使う',f:k=>{inc('part',Math.round(56000*k*S.region.sal*S.cty.inc));ad('health',-1.6*k)}},
  {k:'tutor',n:'家庭教師',d:'とても高い時給（知識50以上）',ok:()=>S.p.know>=50,f:k=>{inc('part',Math.round(62000*k*S.region.sal*S.cty.inc));ad('know',.4*k);ad('talk',.3*k);ad('mental',-.5*k)}},
  {k:'event',n:'イベントスタッフ',d:'少し高い時給。人脈が広がる',f:k=>{inc('part',Math.round(50000*k*S.region.sal*S.cty.inc));ad('social',1*k);ad('health',-1*k)}}];
ACT.date.opts=[
  {k:'meal',n:'食事に行く',d:'仲が深まる',f:k=>{rel(lover(),4*k);ad('happy',2*k);outc('date',Math.round(8000*k*ci()))}},
  {k:'movie',n:'映画を見る',d:'手ごろに楽しめる',f:k=>{rel(lover(),3*k);ad('happy',1.6*k);outc('date',Math.round(4000*k*ci()))}},
  {k:'trip',n:'小旅行',d:'仲が大きく深まる。お金がかかる',f:k=>{rel(lover(),8*k);ad('happy',4*k);ad('mental',2*k);outc('date',Math.round(40000*k*ci()))}}];
ACT.family.opts=[
  {k:'meal',n:'家族で食事',d:'家族との仲と幸福',f:k=>{relP(2*k);for(const s of S.sibs)rel(s,1*k);if(S.spouse)rel(S.spouse,2*k);ad('happy',1.5*k)}},
  {k:'chores',n:'家事をする',d:'家族との仲と料理の素質',f:k=>{relP(2.5*k);if(S.spouse)rel(S.spouse,3*k);ad('tal.cook',.8*k)}},
  {k:'kids',n:'子どもと遊ぶ',d:'幸福が大きく上がる',ok:()=>S.kids.length>0,f:k=>{ad('happy',3*k);ad('mental',1.5*k);if(S.spouse)rel(S.spouse,1*k)}}];
ACT.post.opts=[
  {k:'normal',n:'ふつうの投稿',d:'いつもどおりの投稿'},
  {k:'short',n:'ショート動画',d:'見つかりやすいが質は下がる。広告収益は少なめ'},
  {k:'big',n:'大型企画',d:'費用5万円で質が大きく上がり、バズりやすい',ok:()=>S.money>=50000*ci()},
  {k:'live',n:'ライブ配信',d:'投げ銭が入る。ファンとの距離が縮まる',ok:()=>totalF()>=100},
  {k:'collab',n:'コラボ',d:'ライバルや所属タレントと一緒に。新しいファンが来る',ok:()=>(S.rival&&S.rival.rel>=40)||(S.office&&S.office.talents.length>0)}];
ACT.side={n:'副業',d:'スキルを生かして稼ぐ',ok:()=>age()>=18&&S.st!=='retired',f:k=>ACT.side.opts[1].f(k),opts:[
  {k:'edit',n:'動画編集の受注',d:'編集スキルが高いほど稼げる（編集25以上）',ok:()=>S.sk.edit>=25,f:k=>{inc('part',Math.round(S.sk.edit*1500*k*ci()));ad('edit',.5*k);ad('mental',-.5*k)}},
  {k:'write',n:'ライター',d:'知識が高いほど稼げる',f:k=>{inc('part',Math.round(S.p.know*1100*k*ci()));ad('know',.4*k);ad('mental',-.4*k)}},
  {k:'craft',n:'ハンドメイド販売',d:'フォロワーが多いほど売れる',f:k=>{inc('part',Math.round((5000+Math.sqrt(totalF())*300)*k*ci()));ad('happy',.5*k)}}]};
ACT.shophelp={n:'お店に立つ',d:'自分のお店を手伝う。評価と客数が上がる',ok:()=>age()>=18&&S.town&&S.town.tiles.some(t=>SHOP[t.t]),f:k=>{const sh=S.town.tiles.filter(t=>SHOP[t.t]);for(const t of sh){initShop(t);t.help=(t.help||0)+k/sh.length}ad('social',.6*k);ad('mental',-.3*k)}};

function turn(){
  if(!S||!S.alive||modalOpen())return;
  ensureV3();
  const k=S.unit==='week'?.25:1;
  const f0=totalF(),m0=S.money;
  const reps=S.unit==='season'?3:1;
  for(let rp=0;rp<reps;rp++){
  if(S.auto)autoPlan();
  ensurePlan();
  if(age()<6){ad('happy',1*k);ad('tal.'+pick(TALK),.9*k);ad('social',.3*k)}
  else S.plan.forEach((a,i)=>{const ac=ACT[a];if(!ac||!ac.ok())return;const os=ac.opts?ac.opts.filter(o=>!o.ok||o.ok()):null;const o=os&&os.length?(os.find(x=>x.k===S.planOpt[i])||os[0]):null;
    try{actHook(a,o)}catch(_){}if(a==='post'){postAll(k)}else if(o&&o.f)o.f(k);else ac.f(k)});
  if(S.st==='school'){ad('know',1.1*k);ad('social',.4*k)}
  else if(S.st==='univ'){ad('know',1.3*k);ad('social',.4*k)}
  else if(S.st==='work'){ad('know',.3*k);ad('mental',-.5*k)}
  kidChannelTick(k);
  let monthEnd=true;
  if(S.unit==='week'){S.wk=(S.wk||0)+1;if(S.wk<4)monthEnd=false;else S.wk=0}
  if(monthEnd)endMonth();
  if(!S.alive)return;
  if(S.q.length)break;
  }
  const df=totalF()-f0,dm=S.money-m0;
  if(Math.abs(df)>=1)pop((df>0?'+':'')+num(df)+'人',df>0?'f':'bad');
  if(dm>=1000)setTimeout(()=>pop('+'+yen(dm)),250);
  let ev=null;
  while(S.q.length&&!ev){const e=EV[S.q.shift()];if(e&&(!e.when||e.when()))ev=e}
  let rolled=false;if(!ev){ev=rollEvent(S.unit==='season'?3:k);rolled=!!ev}
  if(ev&&rolled&&autoEvOk(ev)){autoChoose(ev);ev=null}
  save();if(ev||(speed<2&&!skipping))render();else renderSoon();
  if(ev)showEvent(ev);
}

// ----- 投稿（企画の種類つき） -----
let POPT='normal';
function doPost(k){
  const key=S.main,sn=SNS[key],f=S.f[key],st=STYLES[S.style]||STYLES.norm,D=DF();
  const m={q:0,disc:1,posts:1,rpm:1,buzz:1,conv:1,tired:1};
  if(POPT==='short'){m.q=-8;m.disc=1.4*(key==='patto'?1.2:1);m.posts=1.5;m.rpm=.4}
  if(POPT==='big'){const c=Math.round(50000*k*ci()*(svcOn('studio')?0:1));if(S.money>=c){if(c)outc('shop',c);m.q=12;m.posts=.5;m.buzz=2.2;m.tired=1.3}}
  if(POPT==='live'){m.posts=.5;m.conv=.8;m.tired=1.2;const tip=Math.round(totalF()*R(.02,.08)*(has('live')?2:1)*ci()*k);if(tip>0)inc('tip',tip);ad('social',.6*k);for(const n of S.friends)rel(n,.2*k)}
  if(POPT==='collab'){m.disc=1.3;m.conv=1.2;collabGain(key,k)}
  const q=clamp(postQuality()+m.q+(S.subs&&S.subs.editsoft?2:0)+(has('ai_edit')?4:0)+styleQ(),1,100);
  const tg=S.trend.g===S.genre?1.8:1,ts=1;
  const posts=8*k*m.posts;
  const base=f*(.06+q/500)*sn.reach;
  let disc=(q*q/100)*18*sn.disc*tg*ts*st.disc*R(.5,1.5)*(S.algo>0?(has('analytics')?.75:.5):1)*(1+Math.min(Math.sqrt(f),700)/120)*D.disc*(S.cty.disc||1)*(key==='patto'&&has('shorts')?1.25:1)*m.disc*discMul()*snsEraMul()*(1+Math.min(.3,(S.flags.lang||0)/100));
  let views=(base+disc)*posts,discV=disc*posts,buzzed=false;
  if(chance((.006+q/5000)*(tg>1?1.5:1)*(1+stN('writer')*.15*staffMul())*m.buzz*buzzPerk()*Math.min(1,k*2))){const mm=R(4,16);views+=discV*mm;discV*=mm+1;buzzed=true}
  let nf=(discV*(.005+q/15000)*sn.conv+base*posts*.0008)*m.conv;
  nf*=Math.max(0,1-f/sn.cap);
  if(q<20)nf-=f*.003*k;
  S.f[key]=Math.max(0,S.f[key]+nf);
  postHook(k,q,buzzed,nf);try{postRecord(buzzed,views)}catch(_){}
  const money=f>=sn.mon?Math.round(views*sn.rpm*m.rpm*Math.max(.15,S.cty.inc)):0;
  if(money)inc('sns',money);
  S.mo.views+=views;S.mo.newF+=nf;S.mo.posts+=k;S.stats.views+=views;
  const tired=(has('mind')?.7:1)*(stN('manager')?.85:1)*m.tired;
  ad('mental',-.45*k*tired);ad('health',-.15*k*tired);ad('tal.'+S.genre,.4*k);ad('edit',.35*k);
  for(const s in (GENRES[S.genre]||GENRES.talk).w)if(s!=='know')ad(s,.25*k);
  if(buzzed){S.mo.buzz++;S.stats.buzz++;log(`投稿がバズった！ ${num(views)}回再生`,'sns');pop('バズった！','f');snd('buzz');if(S.stats.buzz===1)tl('初めてバズった')}
  const fp=(.0005+st.fl+Math.max(0,60-S.p.rep)/8000)*sn.flame*k*(f>300?1:.2)*D.flame*(S.cty.flame||1)*(POPT==='live'?1.4:1)*flameMul();
  if(chance(fp)&&!SUBPOST&&!S.q.includes('flame')&&!(S.cd.flame!=null&&S.am-S.cd.flame<6)){S.q.push('flame');S.mo.flame++}
  if(S.flags.noSide&&S.st==='work'&&chance(.03*k)&&!S.q.includes('w_fired'))S.q.push('w_fired');
}

// ----- 住まい・買い物・契約 -----
const HOMES=[{n:'実家',m:0,h:0},{n:'ワンルーム',m:.75,h:0},{n:'1LDK',m:1,h:.3},{n:'ファミリー向けマンション',m:1.5,h:.6},{n:'タワーマンション',m:2.8,h:1,priv:1},{n:'一軒家（持ち家）',m:.3,h:.8,buy:30000000}];
function livingCost(){const h=HOMES[S.home||1]||HOMES[1];return Math.round((S.region.cost*.5*h.m*(S.priceIdx||1)+S.region.cost*.5*(S.priceIdx||1)*(S.spouse?1.6:1))*livMul())}
const GOODS=[
  {k:'clothes',n:'おしゃれな服',p:20000,d:'見た目+3・幸福+2',f:()=>{ad('looks',3);ad('happy',2)}},
  {k:'books',n:'本をまとめ買い',p:10000,d:'知識+3',f:()=>{ad('know',3)}},
  {k:'cosme',n:'コスメ',p:15000,d:'見た目+2・美容の素質+2',f:()=>{ad('looks',2);ad('tal.beauty',2)}},
  {k:'spa',n:'温泉でリフレッシュ',p:30000,d:'健康+5・メンタル+5',f:()=>{ad('health',5);ad('mental',5)}},
  {k:'trip',n:'旅行',p:100000,d:'幸福+8・メンタル+6・Vlogの素質+3',f:()=>{ad('happy',8);ad('mental',6);ad('tal.vlog',3)}},
  {k:'gift',n:'家族へのプレゼント',p:20000,d:'家族・恋人との仲+6',f:()=>{relP(6);rel(lover(),6)}},
  {k:'console',n:'ゲーム機',p:50000,once:1,d:'ゲーム実況の素質+5・幸福+3',f:()=>{ad('tal.game',5);ad('happy',3)}},
  {k:'instrument',n:'楽器',p:80000,once:1,d:'音楽の素質+6',f:()=>{ad('tal.music',6)}},
  {k:'kitchen',n:'調理器具セット',p:40000,once:1,d:'料理の素質+6',f:()=>{ad('tal.cook',6)}},
  {k:'furniture',n:'いい家具',p:80000,once:1,d:'幸福+4・メンタル+2（引っ越すとまた買える）',f:()=>{ad('happy',4);ad('mental',2)}},
  {k:'pet',n:'ペットを迎える',p:150000,once:1,age:18,d:'幸福が上がる（毎月世話代がかかる）',ok:()=>!S.pet,f:()=>{S.pet=1;ad('happy',8);tl('ペットを迎えた')}},
  {k:'car',n:'車',p:1800000,once:1,age:18,d:'幸福+5・Vlogの素質+3（毎月維持費がかかる）',f:()=>{S.flags.car=1;ad('happy',5);ad('tal.vlog',3);tl('車を買った')}}
];
const SUBS={
  editsoft:{n:'動画編集ソフト',p:3000,d:'投稿の質+2・編集が少しずつ上がる',age:13},
  gymsub:{n:'ジムの会員',p:8000,d:'健康が少しずつ上がる',age:15},
  eikaiwa:{n:'英会話教室',p:15000,d:'知識が上がり、海外のファンが増えやすい',age:13},
  voice:{n:'ボイストレーニング',p:12000,d:'話術と音楽の素質が少しずつ上がる',age:13},
  music:{n:'音楽のサブスク',p:1000,d:'幸福が少し上がる',age:13},
  insurance:{n:'医療保険',p:5000,d:'病気やけがの医療費が3割になる',age:18}
};
function subsTick(){const s=S.subs;if(s.editsoft)ad('edit',.4);if(s.gymsub)ad('health',1);if(s.eikaiwa){ad('know',.8);S.flags.lang=(S.flags.lang||0)+.5}if(s.voice){ad('talk',.6);ad('tal.music',.5)}if(s.music)ad('happy',.3);const h=HOMES[S.home]||HOMES[0];if(S.indep&&h.h)ad('happy',h.h)}
function ad(k,v,cat){if(k==='money'&&cat==='medical'&&v<0&&S.subs&&S.subs.insurance)v=Math.round(v*.3);
  if(!v)return;
  if(k in P_KEYS)S.p[k]=clamp(S.p[k]+v);
  else if(k in SK_KEYS)S.sk[k]=clamp(S.sk[k]+v);
  else if(k==='money'){if(!cat)v=Math.round(v*(S.cty?S.cty.inc:1));if(v>0)inc(cat==='loss'?'loss':(cat||'ev'),v);else outc(cat||'ev',-v)}
  else if(k==='f'){const key=S.open[S.main]?S.main:'milu';if(!S.open[key])return;S.f[key]=Math.max(0,S.f[key]+v)}
  else if(k.startsWith('tal.')){const t=talKey(k.slice(4));S.tal[t]=clamp((S.tal[t]||0)+v)}
  if(DL)DL[k]=(DL[k]||0)+v;
}

// ----- 請求書 -----
function bill(cat,n,amt){amt=Math.round(amt);if(amt<=0)return;if(S.autopay){outc(cat,amt);if(cat==='debt')S.debt=Math.max(0,S.debt-amt);return}S.bills.push({id:'b'+((S.bid=(S.bid||0)+1)),cat,n,amt,base:amt,due:S.am,late:0})}
function payBill(id){const i=S.bills.findIndex(b=>b.id===id);if(i<0)return false;const b=S.bills[i];if(S.money<b.amt){toast('お金が足りない（あと'+yen(b.amt-S.money)+'）');return false}outc(b.cat,b.amt);if(b.cat==='debt')S.debt=Math.max(0,S.debt-b.base);if(b.late)outcLabel('late',0);S.bills.splice(i,1);return true}
function outcLabel(){}
function payAll(){let n=0;for(const b of S.bills.slice().sort((a,b)=>b.late-a.late)){if(payBill(b.id))n++;else break}return n}
function billTotal(){return S.bills.reduce((s,b)=>s+b.amt,0)}
function lateBills(){
  let newLate=false,forced=false;
  for(const b of S.bills.slice()){if(S.am<=b.due)continue;b.late++;const fee=Math.max(1,Math.round(b.base*.05));b.amt+=fee;S.credit=clamp(S.credit-2);if(b.late===1)newLate=true;
    if(b.cat==='staff'&&b.late===2){const k=Object.keys(STAFF).find(x=>stN(x)>0);if(k){S.office.staff[k]--;log(`給料の未払いで${STAFF[k].n}が辞めてしまった`,'bad')}}
    if(b.late>=3){outc(b.cat,b.amt);if(b.cat==='debt')S.debt=Math.max(0,S.debt-b.base);S.bills.splice(S.bills.indexOf(b),1);S.credit=clamp(S.credit-8);ad('rep',-2);forced=true;S.lastForced=b.n}}
  if(!S.bills.some(b=>b.late))S.credit=clamp(S.credit+.4);
  if(forced){log(`「${S.lastForced}」が強制的に引き落とされた`,'bad');if(!S.q.includes('bill_force')&&(S.cd.billForce==null||S.am-S.cd.billForce>=6)){S.cd.billForce=S.am;S.q.push('bill_force')}}
  else if(newLate&&(S.cd.billLate==null||S.am-S.cd.billLate>=6)){S.cd.billLate=S.am;S.q.push('bill_late')}
}
E('bill_late',{t:'支払いの遅れ',cat:'お金',w:0,text:()=>`期限を過ぎた請求書が${S.bills.filter(b=>b.late).length}件ある（合計${yen(billTotal())}）。\n遅れると毎月延滞金がつき、信用スコアが下がる。3か月遅れると強制的に取り立てられる。`,
  ch:()=>[[`今すぐ全部払う（所持金${yen(S.money)}）`,()=>{const n=payAll();return n?`${n}件を支払った。`:'お金が足りなくて払えなかった。'}],['あとで払う',()=>'「お金」→「家計」からいつでも払える。']]});
E('bill_force',{t:'強制的な取り立て',cat:'お金',w:0,text:()=>`「${S.lastForced}」の支払いが3か月遅れ、延滞金ごと強制的に引き落とされた。信用スコアも大きく下がった。`,ch:[['気をつける',()=>{ad('mental',-4);return '自動支払いをオンにすると払い忘れを防げる（「お金」→「家計」）。'}]]});

// ----- お店の経営 -----
const SHOP={stall:{base:300,unit:700,cr:.45,fix:10000,per:500,wage:.4},cafe:{base:1200,unit:800,cr:.35,fix:60000,per:600},restaurant:{base:1000,unit:1100,cr:.4,fix:80000,per:450},gym:{base:150,unit:5500,cr:.15,fix:100000,per:120,mem:1},apparel:{base:60,unit:4000,cr:.5,fix:80000,per:150,fan:1},studio:{base:20,unit:15000,cr:.1,fix:50000,per:30,wage:.8},gamedev:{base:1500,unit:3000,cr:.3,fix:500000,per:300,vol:1}};
const PRICE=[null,{n:'安い',dem:1.3,pm:.8,st:.4},{n:'ふつう',dem:1,pm:1,st:0},{n:'高い',dem:.72,pm:1.4,st:-.3}];
const HOURS=[null,{n:'短め',c:.75,w:.8,st:-.2},{n:'ふつう',c:1,w:1,st:0},{n:'長め',c:1.25,w:1.3,st:.2}];
const ADV=[{n:'なし',c:1,p:0},{n:'少し',c:1.15,p:50000},{n:'たくさん',c:1.35,p:150000}];
const WAGE=120000;
const SHOP_UNIT={stall:'客',cafe:'客',restaurant:'客',gym:'会員',apparel:'客',studio:'件',gamedev:'本'};
function initShop(t){if(SHOP[t.t]&&t.price==null){t.price=2;t.hours=2;t.adv=0;t.staff=1;t.stars=3;t.boost=0;t.boostEnd=0;t.r=null;t.help=0}}
function shopCalc(i,commit){
  const t=S.town.tiles[i],s=SHOP[t.t];initShop(t);const reg={'大都市':1.15,'地方都市':1,'町村':.85}[S.town.rt||S.region.type]||1,c=Math.max(.15,S.cty.inc);
  const base=s.fan?s.base+Math.sqrt(Math.min(totalF(),3e6))*3:s.base;
  let cust=base*t.lv*(1+adjBonus(i))*reg*(1+S.town.dev/200)*PRICE[t.price].dem*HOURS[t.hours].c*ADV[t.adv].c*(t.stars/3)*(1+(t.boost||0)*.25)*(t.promo===S.am?1+Math.min(1,Math.sqrt(totalF())/800):1)*(1+.12*(t.help||0))*shopSegMul(i)*chainMul(t)*ecoMul()*popMul()*shopPerk();
  const need=Math.max(1,Math.ceil(cust/s.per));
  if(t.staff<need)cust*=t.staff/need;
  if(commit)cust*=R(.88,1.12);
  cust=Math.round(cust);
  let sales=cust*s.unit*PRICE[t.price].pm*c;if(s.vol&&commit)sales*=R(.2,2.6);
  const cost=s.fix*t.lv*c+t.staff*WAGE*(s.wage||1)*HOURS[t.hours].w*c+ADV[t.adv].p*c+sales*s.cr;
  const r={cust,sales:Math.round(sales),cost:Math.round(cost),profit:Math.round(sales-cost),need};
  if(commit){const tgt=3+PRICE[t.price].st+(t.staff>=need?.4:-1.2)+HOURS[t.hours].st+(t.boost?.6:0)+(t.help?.3:0)+(t.staff>need+1?-.2:0);t.stars=clamp(t.stars+(tgt+starPerk()-t.stars)*.25,1,5);t.r=r;t.help=0;if(t.boostEnd&&S.am>=t.boostEnd){t.boost=0;t.boostEnd=0}}
  return r;
}
function bldProfit(i){const t=S.town.tiles[i],b=BLD[t.t];if(!b)return 0;if(SHOP[t.t])return shopCalc(i,false).profit;return Math.round(b.inc*t.lv*S.cty.inc)}
const stars=v=>'★'.repeat(Math.round(v))+'☆'.repeat(5-Math.round(v));

// ----- タレントの方針 -----
const TPOL={bal:{n:'バランスよく',g:0,r:1},push:{n:'どんどん露出',g:.012,r:.9},deal:{n:'案件を多めに',g:-.008,r:1.6}};

// ----- 毎月 -----
function monthSys(){
  const a=age();
  if(a>=10)S.rp+=.3+S.p.know*.012+S.sk.plan*.012+stN('writer')*.6*staffMul()+countB('library')*.5;
  if(S.office.lv){const o=OFFICE[S.office.lv];bill('office','事務所の家賃',o.rent*S.cty.inc);let sal=0;for(const k in STAFF)sal+=STAFF[k].sal*S.cty.inc*stN(k);if(sal)bill('staff','スタッフの給料',sal);
    let te=0;for(const t of S.office.talents){const p=TPOL[t.pol||'bal'];t.f=clamp(Math.round(t.f*(1+(R(-.02,.035)+p.g+stN('manager')*.003*staffMul())*(1-t.f/2e6))),100,2e6);te+=t.f*.6*p.r*Math.max(.15,S.cty.inc)}if(te)inc('talent',Math.round(te))}
  let pr=0;S.town.tiles.forEach((t,i)=>{const b=BLD[t.t];if(!b)return;if(SHOP[t.t])pr+=shopCalc(i,true).profit;else pr+=Math.round(b.inc*t.lv*S.cty.inc*ecoMul())});
  if(pr>0)inc('biz',pr);else if(pr<0)outc('biz',-pr);
  ad('happy',Math.min(1.5,countB('cafe')*.25+countB('park')*.15));ad('health',Math.min(1.5,countB('gym')*.3));ad('mental',Math.min(1.5,countB('park')*.25));ad('know',Math.min(1,countB('library')*.2));ad('rep',Math.min(1,countB('kids')*.3+stN('pr')*.2));
  S.town.dev=calcDev();
  if(S.role==='mayor'||S.role==='adviser'){inc('mayor',Math.round(800000*S.cty.inc));S.town.bonus+=.05}
  if(S.role==='adviser')S.nation=Math.min(100,(S.nation||0)+S.town.dev/600);
  const d=S.town.dev;
  if(!S.role&&d>=15&&a>=18&&!S.seen.r_face&&!S.q.includes('r_face'))S.q.push('r_face');
  if(S.role==='face'&&d>=35&&totalF()>=50000&&!S.seen.r_amb&&!S.q.includes('r_amb'))S.q.push('r_amb');
  if((S.role==='face'||S.role==='amb')&&has('politics')&&d>=55&&S.p.rep>=55&&a>=25&&a<80&&(S.cd.r_elect==null||S.am-S.cd.r_elect>=48)&&!S.q.includes('r_elect'))S.q.push('r_elect');
  if(S.role==='mayor'&&has('nation')&&d>=85&&!S.seen.r_nation&&!S.q.includes('r_nation'))S.q.push('r_nation');
  subsTick();
}
function endMonth(){
  ensureV3();
  const a0=age(),lbl=`${S.y}年${S.m}月`;
  S.am++;S.m++;if(S.m>12){S.m=1;S.y++}
  const a=age(),c=S.cty.inc;
  if(a>=6&&a<18&&S.st==='school')inc('allow',Math.round(TIERS[S.tier].allow*(a>=13?2:1)*c));
  if(S.st==='work'){inc('job',S.salary);S.salSum+=S.salary}
  if(S.spouse&&S.spouse.inc)inc('family',Math.round(S.spouse.inc*c));
  if(a>=65&&S.pension)inc('pension',S.pension);
  lateBills();
  if(a>=18){
    if(S.indep){const h=HOMES[S.home]||HOMES[1];if(h.m)bill('rent','家賃（'+h.n+'）',S.region.cost*.5*h.m*(S.priceIdx||1)*livMul());bill('util','食費・光熱費',S.region.cost*.5*(S.priceIdx||1)*(S.spouse?1.6:1)*livMul())}
    else if(!['univ','school'].includes(S.st))bill('home','実家に入れるお金',30000*c);
    if(S.snsOpen||S.flags.phone)bill('phone','スマホ代',6000*Math.max(.3,c));
    for(const k in S.subs)if(S.subs[k]&&SUBS[k])bill('subs',SUBS[k].n,SUBS[k].p*Math.max(.3,c));
    if(S.pet)bill('subs','ペットの世話代',10000*Math.max(.3,c));
    if(S.flags.car)bill('subs','車の維持費',20000*Math.max(.3,c));
  }
  const kidsN=S.kids.filter(k=>S.am-k.born<22*12).length;if(kidsN)bill('kids','子育て費（'+kidsN+'人）',kidsN*35000*c);
  if(S.debt>0)S.flags.hadDebt=1;
  if(S.debt>0&&S.st!=='univ'&&a>=19){if(S.debtRate)S.debt=Math.round(S.debt*(1+S.debtRate/12));const owed=S.bills.filter(b=>b.cat==='debt').reduce((s,b)=>s+b.base,0);const p=Math.min(S.debt-owed,Math.max(Math.round(15000*c),Math.round(S.debt*.02)));if(p>0)bill('debt','借金・奨学金の返済',p)}else if(S.debt<=0)S.debtRate=0;
  if(S.inv>0)S.inv=Math.max(0,S.inv*(1+R(-.035,.045)+(ecoMul()-1)*.04+invPerk()));
  if(S.m===4&&S.st==='work')S.salary=Math.round(S.salary*1.02);
  if(S.m===1){S.taxBase=S.yInc;S.yInc=0}
  if(S.m===3&&age()>=18&&S.taxBase>=(S.st==='work'?200000:480000)*c){if(S.flags.taxAuto){bill('tax','所得税（確定申告）',S.taxBase*.15*(has('tax_k')?.85:1));log('確定申告をした。税金の請求書が届いた','life')}else S.q.push('tax')}
  withTown(homeTown(),()=>{monthSys();monthHook();monthHook7();monthHook8();monthHook10();monthHook11()});
  if(a<18&&S.money<0){S.money=0;log('足りない分は家族が払ってくれた','life')}
  drift();
  for(const key in S.f){if(!S.open[key])continue;const posted=S.mo.posts>0&&key===S.main;S.f[key]*=posted?.996:.99}
  rivalTick();
  for(const key in S.f)S.f[key]=Math.min(S.f[key],SNS[key].cap);
  if(S.am>=S.trend.until)newTrend();
  if(S.algo>0)S.algo--;
  if(S.pause>0)S.pause--;
  if(S.st==='univ'&&S.uniEnd&&S.am>=S.uniEnd){S.uniEnd=0;S.q.push('m22')}
  if(S.flags.ronin&&S.am>=S.flags.ronin)S.q.push('ronin2');
  if(S.flags.reemp&&S.am>=S.flags.reemp){delete S.flags.reemp;S.st='retired';S.salary=0;S.job=null;S.flags.retiredWork=1;tl('完全に引退した')}
  if(S.flags.cancer==='treat'&&S.flags.cancerEnd&&S.am>=S.flags.cancerEnd){S.flags.cancerEnd=0;S.q.push('h_cured')}
  if(a>=35&&!S.flags.cancer&&chance(clamp(.0006*Math.exp((a-35)*.085),0,.04)/12))S.q.push('h_cancer');
  if(S.money<0&&(S.cd.poorQ==null||S.am-S.cd.poorQ>=24)){S.cd.poorQ=S.am;S.q.push('poor')}
  for(const p of parents()){const pa=p.age0+S.am/12;if(chance(Math.min(.9,qx(pa,p.role==='母'?'女':'男')*S.cty.life)/12)){p.alive=false;p.dage=Math.floor(pa);S.deadP=p;S.q.push('l_pdeath')}}
  const tf=totalF();
  S.stats.maxF=Math.max(S.stats.maxF,tf);S.stats.maxM=Math.max(S.stats.maxM,S.money+S.inv-S.debt);
  S.hsum+=S.p.happy;S.hn++;
  if(S.am%3===0)S.hist.push([S.am,Math.round(tf),Math.round(S.money+S.inv-S.debt),Math.round(S.p.happy),Math.round(S.p.health)]);
  const ti=Object.values(S.mo.inc).reduce((s,x)=>s+x,0),to=Object.values(S.mo.out).reduce((s,x)=>s+x,0);
  S.last=Object.assign({},S.mo,{lbl,ti,to,f:tf,bills:billTotal()});
  S.mo=newMo();
  checkAch('m');
  if(S.am%12===0)saveMeta();
  if(a!==a0)birthday(a);
  if(deathCheck())die();
}
Object.assign(INC_LBL,{loan:'借り入れ',invout:'投資の引き出し',part:'アルバイト・副業'});
Object.assign(OUT_LBL,{rent:'家賃',util:'食費・光熱費',home:'実家に入れるお金',phone:'スマホ代',subs:'契約・サブスク',kids:'子育て費',debt:'返済',office:'事務所の家賃',staff:'スタッフの給料',tax:'税金',invest:'投資',donate:'寄付',send:'仕送り',move:'引っ越し',goods:'暮らしの買い物',dev:'新メニュー開発'});

// ----- 音量 -----
function sndClassic(type){if(!sndOn||VOL.se<=0)return;try{AC=AC||new (window.AudioContext||window.webkitAudioContext)()}catch(e){return}
  const seq={click:[[660,.035]],coin:[[988,.06],[1319,.12]],buzz:[[523,.07],[659,.07],[784,.07],[1047,.2]],flame:[[220,.14],[165,.26]],ev:[[784,.06],[988,.1]],bad:[[330,.12],[247,.2]],end:[[523,.22],[392,.22],[330,.3],[262,.6]],buy:[[784,.05],[1175,.1]]}[type]||[];
  let t=AC.currentTime+.01;for(const [fq,d] of seq){const o=AC.createOscillator(),g=AC.createGain();o.type='square';o.frequency.value=fq;g.gain.setValueAtTime(.07*VOL.se,t);g.gain.exponentialRampToValueAtTime(.0005,t+d);o.connect(g);g.connect(AC.destination);o.start(t);o.stop(t+d+.02);t+=d*.92}}
function saveVol(){try{localStorage.setItem('nipporia-vol',JSON.stringify(VOL))}catch(e){}}
function volHtml(){return `<div class="vol"><label class="fld"><span>BGM ${Math.round(VOL.bgm*100)}</span><input type="range" min="0" max="100" value="${Math.round(VOL.bgm*100)}" data-vol="bgm" id="volBgm"></label><label class="fld"><span>効果音 ${Math.round(VOL.se*100)}</span><input type="range" min="0" max="100" value="${Math.round(VOL.se*100)}" data-vol="se" id="volSe"></label></div>`}
function showMenu(){
  openModal(`<div class="mcat life">メニュー</div><h2>メニュー</h2><h3>音量</h3>${volHtml()}<div class="mch">
  <button class="b" type="button" data-act="bgm">BGM：${bgmOn?'ON':'OFF'}</button>
  <button class="b" type="button" data-act="sound">効果音：${sndOn?'ON':'OFF'}</button>
  ${S?`<button class="b" type="button" data-act="autopayT">支払い：${S.autopay?'自動で払う':'自分で払う'}</button>`:''}
  <button class="b" type="button" data-act="achv">実績・図鑑</button>
  <button class="b" type="button" data-act="export">セーブデータを書き出す</button>
  <button class="b" type="button" data-act="credit">出典・クレジット</button>
  <button class="b" type="button" data-act="totitle">タイトルへ戻る（自動保存されています）</button>
  <button class="b pri" type="button" data-act="close">閉じる</button></div>`);
}

// ----- 画面（5つのタブ＋小さな切り替え） -----
const SUB={money:'bills',biz:'town',life:'stat'};
const TAB_HINT={act:'今月の時間の使い方を決める。「次へ」で時間が進む。',sns:'SNSのアカウント・ジャンル・投稿のスタイルを決める。',money:'請求書の支払い、買い物、投資や借り入れをする。',biz:'まちに建物を建て、お店や会社を経営し、研究を進める。',life:'能力、人物との関係、これまでの記録を見る。'};
function subTabs(tabk,items){const cur=SUB[tabk];return `<div class="subtabs" role="tablist">${items.map(([k,n,b])=>`<button class="stab" type="button" data-sub="${tabk}:${k}" aria-pressed="${cur===k}">${n}${b?`<span class="badge">${b}</span>`:''}</button>`).join('')}</div>`}
function render(){if(!S)return;ensureV3();renderTop();renderWho();renderPanel();renderLog();renderReport();renderCtrl();renderBadges();renderTicker()}
function researchReady(){return RES.filter(r=>!has(r.id)&&(!r.req||has(r.req))&&S.rp>=r.c).length}
function renderBadges(){const m={money:S.bills.length?S.bills.length:'',biz:researchReady()?'!':''};document.querySelectorAll('.tab').forEach(b=>{let s=b.querySelector('.badge');const v=m[b.dataset.tab];if(v){if(!s){s=document.createElement('span');s.className='badge';b.appendChild(s)}s.textContent=v}else if(s)s.remove()})}
function optSel(i){const ac=ACT[S.plan[i]];if(!ac||!ac.opts)return '';const os=ac.opts.filter(o=>!o.ok||o.ok());if(!os.length)return '';const cur=os.find(o=>o.k===S.planOpt[i])||os[0];return `<select data-popt="${i}" id="popt${i}" ${S.auto?'disabled':''}>${os.map(o=>`<option value="${o.k}" ${o===cur?'selected':''}>${esc(o.n)}</option>`).join('')}</select>`}
function optDesc(i){const ac=ACT[S.plan[i]];if(!ac)return '';if(!ac.opts)return ac.d;const os=ac.opts.filter(o=>!o.ok||o.ok());const cur=os.find(o=>o.k===S.planOpt[i])||os[0];return cur?cur.d:ac.d}
function noticesHtml(){
  const n=[];
  if(S.bills.length){const late=S.bills.filter(b=>b.late).length;n.push(`<button class="note ${late?'bad':''}" type="button" data-goto="money:bills">未払いの請求書 ${S.bills.length}件（${yen(billTotal())}）${late?`・うち${late}件が遅れている`:''}</button>`)}
  const rr=researchReady();if(rr)n.push(`<button class="note" type="button" data-goto="biz:res">研究できる項目が${rr}つある</button>`);
  const sh=S.town.tiles.filter(t=>SHOP[t.t]&&t.r&&t.r.profit<0).length;if(sh)n.push(`<button class="note bad" type="button" data-goto="biz:shop">赤字のお店が${sh}軒ある</button>`);
  if(S.pause>0)n.push(`<div class="note">活動休止中：あと${S.pause}か月は投稿できない</div>`);
  return n.length?`<div class="notes">${n.join('')}</div>`:'';
}
function renderPanel(){
  if(!S)return;ensureV3();const P=$('#panel');let h=`<p class="tabhint">${TAB_HINT[tab]||''}<button class="b sm ghost hbtn" type="button" data-guide="${TAB_GUIDE[tab]||'basic'}">？遊び方</button></p>`;
  if(tab==='act')h+=panelPlan();
  else if(tab==='sns')h+=panelSns();
  else if(tab==='money')h+=panelMoney();
  else if(tab==='biz')h+=panelBiz();
  else if(tab==='life')h+=panelLife();
  P.innerHTML=h;
  if(tab==='biz'&&SUB.biz==='town')drawTown();
  if(tab==='life'&&SUB.life==='map')drawMap();
  if(tab==='life'&&SUB.life==='album')paintAlbums();
  if(tab==='sns')try{paintThumbs()}catch(_){}
}
function panelPlan(){
  const a=age(),n=freeSlots();ensurePlan();let h=noticesHtml()+todoHtml()+`<h2>${S.unit==='week'?'今週':'今月'}の行動</h2>`;
  if(a<6)return h+`<p class="hint">6歳までは自動で育っていく。気になる出来事が起きると止まる。</p><button class="b pri" type="button" data-act="grow">小学生になるまで見守る</button>`;
  const fixed={school:'学校（自動）',univ:'大学（自動）',work:`仕事：${S.job}（自動）`}[S.st];
  if(fixed)h+=`<div class="fixed">${esc(fixed)}</div>`;
  if(S.flags.care&&S.am<S.flags.care)h+=`<div class="fixed">親の介護（あと${S.flags.care-S.am}か月）</div>`;
  h+=`<p class="hint">自由に使える枠：${n}つ。行動を選んでから「何をするか」も選べる。</p><div class="grp">`;
  for(let i=0;i<n;i++)h+=`<div class="slotc"><span class="lb">枠${i+1}</span><div class="sel2"><select data-plan="${i}" id="plan${i}" ${S.auto?'disabled':''}>${actOptions(i)}</select>${optSel(i)}</div><p class="ds">${esc(optDesc(i))}</p></div>`;
  h+=`</div><div class="row"><button class="b ${S.auto?'on':''}" type="button" data-act="auto">おまかせ：${S.auto?'ON':'OFF'}</button><span class="hint">ONにすると行動を自動で決める</span></div>`;
  if(a<18&&a>=6){const opts=lessonOptions();h+=`<div class="grp"><h3>習い事</h3>${opts.length?`<select data-set="lesson" id="lessonSel"><option value="">なし</option>${opts.map(k=>`<option value="${k}" ${S.lesson===k?'selected':''}>${LESSONS[k].n}（月謝 ${num(LESSONS[k].cost*S.cty.inc)}円・家族が払う）</option>`).join('')}</select><p class="hint">行動に「習い事」を入れると素質がよく伸びる。</p>`:'<p class="hint">今の家計では月謝を払う余裕がない。</p>'}</div>`}
  h+=`<div class="grp"><h3>時間の進み方</h3>${unitHtml()}${speedOptsHtml()}<p class="hint">上の「次へ」で1ターン、▶で自動再生、「イベントまで」で次の出来事まで早送り。PCは P キーで停止／再開。</p></div>`;
  return h;
}
function panelSns(){
  let h='';
  if(!S.snsOpen){
    h+=`<h2>SNS</h2><p class="hint">${snsPreMsg()}</p>`;
    if(S.kc.on)h+=`<div class="card"><div class="hd"><span>家族チャンネル（${esc(S.kc.byName)}が運営）</span></div><div class="big">${num(S.kc.f)}人</div><p class="hint">登録者が増えるほど家計が潤い、おこづかいも増える。そのぶんプライバシーは減っていく。</p></div>`;
    return h+topTalHtml();
  }
  const q=postQuality();
  h+=`<h2>アカウント</h2><div class="grp">`;
  for(const [k,s] of Object.entries(SNS)){if(s.era&&S.y<s.era)continue;const open=S.open[k],mon=S.f[k]>=s.mon;h+=`<div class="card ${S.main===k?'main':''}"><div class="hd"><span>${s.n}<span class="muted small">（${s.d}）</span></span>${S.trend.s===k?'<span class="chip hot">流行中</span>':''}</div>`+
    (open?`<div class="big">${num(S.f[k])}人</div><div class="row small"><span class="muted">${s.mon===Infinity?'広告収益なし（案件向き）':mon?'収益化済み':`収益化まであと${num(s.mon-S.f[k])}人`}</span>${S.main===k?'<span class="chip">メイン</span>':`<button class="b sm" type="button" data-main="${k}">メインにする</button>`}</div>`:`<button class="b sm" type="button" data-opensns="${k}">アカウントを作る</button>`)+`</div>`}
  h+=`</div><h2>投稿の方針</h2><div class="grp">
    <label class="slot"><span class="lb">ジャンル</span><select data-set="genre" id="genreSel">${Object.entries(GENRES).filter(([k])=>genreOk(k)).map(([k,g])=>`<option value="${k}" ${S.genre===k?'selected':''}>${g.n}（素質${Math.round(S.tal[talKey(k)]||0)}）${S.trend.g===k?' ★流行':''}</option>`).join('')}</select></label>
    <label class="slot"><span class="lb">スタイル</span><select data-set="style" id="styleSel">${Object.entries(STYLES).map(([k,s])=>`<option value="${k}" ${S.style===k?'selected':''}>${s.n}</option>`).join('')}</select></label>
    ${snsPlanHtml()}</div>
    <div class="grp"><h3>投稿の質 ${Math.round(q)}</h3>${bar(q,'p')}<p class="hint">スキル・素質・機材・スタッフ・研究・体調で決まる。今の流行：「${GENRES[S.trend.g].n}」</p></div>`;
  if(S.last&&S.last.posts)h+=`<div class="card"><div class="hd"><span>先月の結果</span></div><div class="kv"><span>再生数</span><span>${num(S.last.views)}回</span><span>フォロワー増減</span><span>${S.last.newF>=0?'+':''}${num(S.last.newF)}人</span><span>広告・投げ銭</span><span>${yen((S.last.inc.sns||0)+(S.last.inc.tip||0))}</span></div></div>`;
  if(S.rival)h+=`<div class="card"><div class="hd"><span>ライバル：${esc(S.rival.name)}</span><span class="muted small">${esc(S.rival.trait)}・仲${Math.round(S.rival.rel)}</span></div><div class="kv"><span>相手のフォロワー</span><span>${num(S.rival.f)}人</span><span>自分のフォロワー</span><span>${num(totalF())}人</span></div><p class="hint">上の「コラボ」から申し込める。勝負は下の「ライバルとの勝負」から。</p></div>`;
  return h+snsExtra();
}
function panelMoneyAdult(){
  const sub=SUB.money;let h=subTabs('money',[['bills','家計',S.bills.length||''],['spend','使い道'],['shop','買い物'],['room','部屋の飾り'],['bank','投資・借入']]);
  const c=Math.max(.2,S.cty.inc);
  if(sub==='bills'){
    h+=`<div class="kv big2"><span>所持金</span><span>${yen(S.money)}</span><span>未払いの請求</span><span>${yen(billTotal())}</span></div>`;
    h+=`<div class="row"><button class="b ${S.autopay?'on':''}" type="button" data-act="autopayT">支払い：${S.autopay?'自動で払う':'自分で払う'}</button><span class="hint">${S.autopay?'請求書は届いた時点で自動で払われる。':'毎月届く請求書を自分で払う。遅れると延滞金。'}</span></div>`;
    h+=`<h3>請求書</h3>`;
    if(!S.bills.length)h+=`<p class="hint">${age()<18?'18歳までは家族が払ってくれる。':'未払いの請求書はない。毎月の終わりに届く。'}</p>`;
    else{h+=`<div>${S.bills.map(b=>`<div class="shop"><div><div>${esc(b.n)} <span class="${b.late?'chip dn':'chip'}">${b.late?b.late+'か月遅れ':'今月中に'}</span></div><div class="muted small">${yen(b.amt)}${b.late?`（延滞金込み）`:''}</div></div><button class="b sm ${b.late?'pri':''}" type="button" data-pay="${b.id}" ${S.money<b.amt?'disabled':''}>払う</button></div>`).join('')}</div><div class="row"><button class="b pri" type="button" data-act="payall" ${S.money<S.bills[0].amt?'disabled':''}>まとめて払う（${yen(billTotal())}）</button></div>`}
    h+=`<h3>信用スコア ${Math.round(S.credit)}</h3>${bar(S.credit,'h')}<p class="hint">支払いが遅れると下がり、きちんと払うと少しずつ戻る。お金を借りるときに影響する。</p>`;
    const L=S.last;if(L){h+=`<h3>${esc(L.lbl)}の家計簿</h3><div class="kv">${Object.entries(L.inc).map(([k,v])=>`<span>${INC_LBL[k]||k}</span><span>+${yen(v)}</span>`).join('')}${Object.entries(L.out).map(([k,v])=>`<span>${OUT_LBL[k]||k}</span><span>-${yen(v)}</span>`).join('')}<span>差し引き</span><span>${L.ti-L.to>=0?'+':''}${yen(L.ti-L.to)}</span></div>`}
  }
  else if(sub==='shop'){
    h+=`<p class="hint">所持金：${yen(S.money)}</p>`;
    if(S.flags.noNet&&age()>=13){const pr=Math.round(20000*Math.max(.25,S.cty.inc));h+=`<div class="shop"><div><div>スマホと通信契約</div><div class="muted small">SNSを始められるようになる ${yen(pr)}</div></div><button class="b sm pri" type="button" data-act="buyphone" ${S.money<pr?'disabled':''}>買う</button></div>`}
    h+=`<h3>配信の機材</h3><div>`;
    for(const [k,e] of Object.entries(EQ)){const lv=S.eq[k],cur=e.t[lv],nx=lv<eqMax()?e.t[lv+1]:null;h+=`<div class="shop"><div><div>${e.n}：${esc(cur[0])}</div>${nx?`<div class="muted small">次：${esc(nx[0])} ${yen(nx[1])}</div>`:`<div class="muted small">${lv<4&&!has('eq5')?'さらに上は研究「プロ機材の知識」で解放':'最高レベル'}</div>`}</div>${nx?`<button class="b sm" type="button" data-buy="${k}" ${S.money<nx[1]?'disabled':''}>買う</button>`:''}</div>`}
    h+=`</div><p class="hint">機材ボーナス：投稿の質+${Math.round(eqBonus())}</p><h3>暮らしの買い物</h3><div>`;
    h+=goodsNote();for(const g of GOODS){if(g.age&&age()<g.age)continue;if(g.ok&&!g.ok())continue;h+=goodRow(g,'good',Math.round(g.p*c))}
    h+='</div>';
    if(age()>=18){h+=`<h3>住まい</h3><p class="hint">今の住まい：${esc((HOMES[S.home]||HOMES[0]).n)}${S.indep?`（家賃と生活費 月${yen(livingCost())}）`:''}</p><div>`;
      HOMES.forEach((hm,i)=>{if(i===0||i===S.home)return;const rent=Math.round(S.region.cost*.5*hm.m*(S.priceIdx||1));const cost=hm.buy?Math.round(hm.buy*S.cty.inc):rent*2;h+=`<div class="shop"><div><div>${esc(hm.n)}</div><div class="muted small">${hm.buy?`購入 ${yen(cost)}・毎月の維持費 ${yen(rent)}`:`家賃 月${yen(rent)}・引っ越し代 ${yen(cost)}`}${hm.h?'・幸福が毎月上がる':''}</div></div><button class="b sm" type="button" data-home="${i}" ${S.money<cost?'disabled':''}>${hm.buy?'買う':'引っ越す'}</button></div>`});h+='</div>'}
    h+=`<h3>契約・サブスク</h3><p class="hint">毎月の請求書に加わる。いつでも解約できる。</p><div>`;
    for(const [k,s] of Object.entries(SUBS)){if(age()<s.age)continue;const on=!!S.subs[k];h+=`<div class="shop"><div><div>${esc(s.n)} <span class="muted small">月${yen(s.p*Math.max(.3,S.cty.inc))}</span></div><div class="muted small">${esc(s.d)}</div></div><button class="b sm ${on?'on':''}" type="button" data-sub2="${k}">${on?'契約中（解約）':'契約する'}</button></div>`}
    h+='</div>';
  }
  else if(sub==='room')h+=decoPanel();
  else if(sub==='spend')h+=spendHtml();
  else if(sub==='bank'){
    const a=age();
    h+=`<h3>投資</h3><div class="kv"><span>投資の残高</span><span>${yen(S.inv)}</span></div><p class="hint">毎月値動きする。長く持つほど増えやすいが、減ることもある。</p><div class="row"><button class="b sm" type="button" data-inv="100000" ${S.money<100000*c||a<18?'disabled':''}>${yen(100000*c)} 入れる</button><button class="b sm" type="button" data-inv="1000000" ${S.money<1000000*c||a<18?'disabled':''}>${yen(1000000*c)} 入れる</button><button class="b sm" type="button" data-inv="-1" ${S.inv<=0?'disabled':''}>全部引き出す</button></div>`;
    h+=`<h3>借金</h3><div class="kv"><span>残り</span><span>${yen(S.debt)}</span><span>金利（年）</span><span>${Math.round((S.debtRate||0)*100)}%</span></div><div class="row"><button class="b sm" type="button" data-repay="100000" ${S.debt<=0||S.money<Math.min(S.debt,100000*c)?'disabled':''}>${yen(100000*c)} 返す</button><button class="b sm" type="button" data-repay="-1" ${S.debt<=0||S.money<S.debt?'disabled':''}>全額返す</button></div>`;
    h+=`<h3>お金を借りる</h3><p class="hint">信用スコア ${Math.round(S.credit)}。借りたお金は毎月の請求書で返していく。</p><div>`;
    const loans=[['bank1','銀行ローン',500000,.03,60],['bank2','銀行ローン',2000000,.03,70],['cons','消費者金融',100000,.15,30],['cons2','消費者金融',500000,.15,40]];
    for(const [k,n,amt,r,need] of loans){const ok=a>=20&&S.credit>=need&&(S.st==='work'||S.st==='creator'||S.st==='free'||S.st==='retired');h+=`<div class="shop"><div><div>${n} ${yen(amt*c)}</div><div class="muted small">金利 年${Math.round(r*100)}%・信用${need}以上</div></div><button class="b sm" type="button" data-loan="${k}" ${ok?'':'disabled'}>借りる</button></div>`}
    h+=`</div><h3>ほかの使い道</h3><div class="row"><button class="b sm" type="button" data-donate="10000" ${S.money<10000*c||a<13?'disabled':''}>${yen(10000*c)} 寄付する</button><button class="b sm" type="button" data-donate="100000" ${S.money<100000*c||a<18?'disabled':''}>${yen(100000*c)} 寄付する</button><button class="b sm" type="button" data-send="30000" ${S.money<30000*c||a<18||!anyParentAlive()?'disabled':''}>親に${yen(30000*c)} 仕送り</button></div><p class="hint">寄付は評判と幸福が、仕送りは親との仲が上がる。</p>`;
  }
  return h;
}
function panelBiz(){
  const shops=S.town.tiles.filter(t=>SHOP[t.t]).length;
  let h=subTabs('biz',[['town','まちの地図'],['shop','お店の経営',shops||''],['co','会社',(S.cos||[]).length||''],['office','事務所'],['res','研究',researchReady()?'!':'']]);
  const sub=SUB.biz;
  if(sub==='town'){h+=townPanel();const t=S.town.tiles[S.town.sel];if(t&&SHOP[t.t])h+=`<div class="row"><button class="b sm pri" type="button" data-goto="biz:shop">このお店を経営する</button></div>`;h+=townAutoHtml()+townExtra()+devHtml()}
  else if(sub==='shop')h+=shopsPanel();
  else if(sub==='co')h+=coHtml();
  else if(sub==='office')h+=officePanel();
  else h+=researchPanel();
  return h;
}
function shopsPanel(){
  const idx=S.town.tiles.map((t,i)=>SHOP[t.t]?i:-1).filter(i=>i>=0);
  if(!idx.length)return '<p class="hint">まだお店を持っていない。「まちの地図」で空き地を選んで建てよう（18歳から）。</p>';
  let tot=0;for(const i of idx){const t=S.town.tiles[i];if(t.r)tot+=t.r.profit}
  let h=`<p class="hint">価格・営業時間・広告・店員の数で、客数と評価と利益が変わる。月末に結果が出る。${idx.some(i=>S.town.tiles[i].r)?`先月の合計利益：${tot>=0?'+':''}${yen(tot)}`:''}</p>`;
  const seg=(i,key,list,cur)=>`<div class="seg">${list.map((x,j)=>x?`<button class="${cur===j?'on':''}" type="button" data-shop="${i}" data-k="${key}" data-v="${j}">${x.n}</button>`:'').join('')}</div>`;
  for(const i of idx){const t=S.town.tiles[i],b=BLD[t.t],s=SHOP[t.t],est=shopCalc(i,false),r=t.r,u=SHOP_UNIT[t.t];const c=Math.max(.15,S.cty.inc);
    h+=`<div class="card shopc"><div class="hd"><span>${esc(b.n)} Lv${t.lv}</span><span class="stars" title="評価">${stars(t.stars)}</span></div>
    ${r?`<div class="kv"><span>先月の${u==='会員'?'会員数':u==='本'?'販売本数':u==='件'?'利用件数':'客数'}</span><span>${num(r.cust)}${u}</span><span>売上</span><span>${yen(r.sales)}</span><span>経費</span><span>-${yen(r.cost)}</span><span>利益</span><span class="${r.profit>=0?'up':'dn'}">${r.profit>=0?'+':''}${yen(r.profit)}</span></div>`:'<p class="hint">まだ営業結果が出ていない（月末に出る）。</p>'}
    <div class="ctl"><span>価格</span>${seg(i,'price',PRICE,t.price)}</div>
    <div class="ctl"><span>営業時間</span>${seg(i,'hours',HOURS,t.hours)}</div>
    <div class="ctl"><span>広告</span>${seg(i,'adv',ADV,t.adv)}</div>
    <div class="ctl"><span>店員</span><div class="seg"><button type="button" data-shop="${i}" data-k="staffm" ${t.staff<=1?'disabled':''}>－</button><b class="cnt">${t.staff}人</b><button type="button" data-shop="${i}" data-k="staffp" ${t.staff>=20?'disabled':''}>＋</button></div><span class="muted small">必要な目安 ${est.need}人${t.staff<est.need?'（足りない）':''}</span></div>
    ${shopExtra(i)}
    <p class="hint">今の設定の見込み：${num(est.cust)}${u}・利益 ${est.profit>=0?'+':''}${yen(est.profit)}／月</p>
    <div class="row"><button class="b sm" type="button" data-shop="${i}" data-k="menu" ${S.money<200000*c||t.boost?'disabled':''}>${t.boost?'新メニュー販売中':`新メニュー開発 ${yen(200000*c)}`}</button><button class="b sm" type="button" data-shop="${i}" data-k="promo" ${!S.snsOpen||t.promo===S.am?'disabled':''}>${t.promo===S.am?'今月は宣伝ずみ':'SNSで宣伝する'}</button><button class="b sm ghost" type="button" data-shop="${i}" data-k="goto">地図で見る</button></div></div>`}
  return h+'<p class="hint">行動の「お店に立つ」を選ぶと、評価と客数が上がる。</p>';
}
function officePanel(){
  const c=S.cty.inc,o=S.office;
  if(age()<20)return '<p class="hint">事務所は20歳から作れる。スタッフを雇ったり、タレントを育てたりできる。</p>';
  const nx=OFFICE[o.lv+1];
  let h=`<div class="kv"><span>今の事務所</span><span>${o.lv?esc(OFFICE[o.lv].n):'なし'}</span>${o.lv?`<span>家賃（月）</span><span>${yen(OFFICE[o.lv].rent*c)}</span><span>スタッフ</span><span>${staffTotal()} / ${OFFICE[o.lv].staff}人</span><span>タレント</span><span>${o.talents.length} / ${OFFICE[o.lv].tal}人</span>`:''}</div>`;
  if(nx)h+=`<div class="row"><button class="b sm pri" type="button" data-act="office" ${S.money<nx.cost*c||age()<18?'disabled':''}>${o.lv?'移転する':'事務所を作る'}：${esc(nx.n)} ${yen(nx.cost*c)}</button></div>`;
  if(!o.lv)return h;
  h+='<h3>スタッフ</h3><p class="hint">給料は毎月の請求書で払う。払えないと辞めてしまう。</p><div>';
  for(const [k,s] of Object.entries(STAFF))h+=`<div class="shop"><div><div>${esc(s.n)}：${stN(k)}人 <span class="muted small">月給 ${yen(s.sal*c)}</span></div><div class="muted small">${esc(s.d)}</div></div><div class="row"><button class="b sm" type="button" data-hire="${k}" ${staffTotal()>=OFFICE[o.lv].staff?'disabled':''}>雇う</button>${stN(k)?`<button class="b sm ghost" type="button" data-fire="${k}">減らす</button>`:''}</div></div>`;
  h+='</div><h3>所属タレント</h3>';
  if(o.talents.length)h+=`<div>${o.talents.map((t,j)=>`<div class="card"><div class="hd"><span>${esc(t.name)}</span><span class="muted small">${esc(GENRES[t.genre].n)}・${num(t.f)}人</span></div><div class="ctl"><span>方針</span><div class="seg">${Object.entries(TPOL).map(([k,p])=>`<button class="${(t.pol||'bal')===k?'on':''}" type="button" data-tpol="${j}" data-v="${k}">${p.n}</button>`).join('')}</div></div><div class="row"><button class="b sm" type="button" data-tdeal="${j}" ${!stN('manager')||t.dealAm===S.am?'disabled':''}>${t.dealAm===S.am?'今月は案件ずみ':'案件を取ってくる'}</button>${stN('manager')?'':'<span class="hint">マネージャーがいると案件を取れる</span>'}</div></div>`).join('')}</div>`;
  else h+='<p class="hint">まだいない。</p>';
  if(has('scout'))h+=`<div class="row"><button class="b sm" type="button" data-act="scout" ${o.talents.length>=OFFICE[o.lv].tal||S.money<300000*c?'disabled':''}>タレントを探す ${yen(300000*c)}</button></div>`;
  else h+='<p class="hint">研究「スカウト網」でタレントを探せる。</p>';
  return h;
}
function researchPanel(){let h=`<h3>研究ポイント ${Math.floor(S.rp)}</h3><p class="hint">知識・企画・企画作家・図書館・「資格の勉強」「流行の研究」でたまる（10歳から）。</p><div>`;
  for(const r of RES){const done=has(r.id),reqOk=!r.req||has(r.req);h+=`<div class="shop"><div><div>${done?'✓ ':''}${esc(r.n)} <span class="muted small">${r.c}pt</span></div><div class="muted small">${esc(r.d)}${!reqOk?`（先に「${esc(RES.find(x=>x.id===r.req).n)}」）`:''}</div></div>${done?'<span class="chip up">完了</span>':reqOk?`<button class="b sm" type="button" data-res="${r.id}" ${S.rp<r.c?'disabled':''}>研究する</button>`:''}</div>`}
  return h+'</div>'}
function panelLife(){
  const sub=SUB.life,a=age();let h=subTabs('life',[['stat','能力'],['goal','目標・性格'],['choice','人生の選択'],['ppl','人物'],['map','相関図・弟子'],['album','アルバム'],['skill','スキル',S.sp||''],['rec','記録']]);if(['goal','choice','map','album','skill'].includes(sub))return h+lifeExtra(sub);
  if(sub==='stat'){
    const rows=(o,keys,cls)=>Object.entries(keys).map(([k,l])=>`<span>${l}</span>${bar(o[k],cls)}<span class="v">${Math.round(o[k])}</span>`).join('');
    h+=`<div class="bars">${rows(S.p,P_KEYS)}</div><h3>スキル</h3><div class="bars">${rows(S.sk,SK_KEYS,'g')}</div>`+topTalHtml();
    h+=`<p class="hint">${esc(ctry())}${S.cty.flavor?'：'+esc(S.cty.flavor):''}${S.cty.jp?'':'（金額はすべて円に換算して表示）'} ／ 難易度：${esc(DF().n)}${S.endless?' ／ エンドレス':''}</p>`;
    h+=`<h3>進路</h3><p class="hint">${esc(stLabel())}${S.edu?'・'+S.edu:''}${S.salary?`・月給${yen(S.salary)}`:''}</p><div class="row">`;
    if(S.st==='work')h+=`<button class="b sm" type="button" data-act="quit">会社を辞めて専業クリエイターになる</button>`;
    if((S.st==='creator'||S.st==='free')&&a>=18&&a<65&&!S.flags.ronin)h+=`<button class="b sm" type="button" data-act="hunt">就職活動をする</button>`;
    if(S.st==='free'&&a>=18&&!S.flags.ronin)h+=`<button class="b sm" type="button" data-act="becomeCreator">専業クリエイターを名乗る</button>`;
    h+=`</div><div id="confirmBox"></div>`;
  }else if(sub==='ppl'){
    const list=[...parents(),...S.sibs,...S.friends,S.rival,S.partner,S.spouse].filter(Boolean);
    h+=`<div>${list.map(n=>`<div class="ppl"><div>${esc(n.name)}<div class="r">${esc(n.role)}・${esc(n.trait)}${n.news?'・'+esc(n.news):''}</div></div><div>${bar(n.rel,'p')}<div class="r">仲のよさ ${Math.round(n.rel)}</div></div></div>`).join('')}
    ${S.kids.map((c,i)=>`<div class="ppl"><div>${esc(c.name)}<div class="r">子ども・${Math.floor((S.am-c.born)/12)}歳</div></div><div>${S.endless&&a>=50?`<button class="b sm" type="button" data-act="retire" data-i="${i}">この子に託す</button>`:''}</div></div>`).join('')}${S.pet?'<div class="ppl"><div>ペット<div class="r">家族の一員</div></div><div></div></div>':''}</div>`;
    if(S.endless&&S.kids.length&&a<50)h+='<p class="hint">エンドレスでは、50歳を過ぎると「この子に託す」で子どもの人生に移れる。</p>';
    h+='<p class="hint">仲を深めるには「予定」で「友達と過ごす」「家族と過ごす」「デート」を選ぶ。</p><div id="confirmBox"></div>';
  }else{
    h+=`<div class="kv"><span>最高フォロワー</span><span>${num(S.stats.maxF)}人</span><span>総再生数</span><span>${num(S.stats.views)}回</span><span>バズ</span><span>${S.stats.buzz}回</span><span>炎上</span><span>${S.stats.flames}回</span><span>PR案件</span><span>${S.stats.deals}件</span><span>まちの発展度</span><span>${S.town.dev}</span>${S.nation?`<span>国の発展への貢献</span><span>${Math.round(S.nation)}</span>`:''}</div>
    ${(S.lineage||[]).length?`<h3>家系</h3><ol class="tl">${S.lineage.map((l,i)=>`<li><b>${i+1}代目</b><span>${esc(l.name)}（享年${l.age}）${esc(l.title)}</span></li>`).join('')}</ol>`:''}
    <h3>人生年表</h3><ol class="tl">${S.tl.slice().reverse().map(([x,t])=>`<li><b>${x}歳</b><span>${esc(t)}</span></li>`).join('')}</ol>
    <h3>セーブ・設定</h3><div class="row"><button class="b sm" type="button" data-act="export">セーブデータを書き出す</button><button class="b sm" type="button" data-act="achv">実績・図鑑</button><button class="b sm" type="button" data-act="menu">メニュー（音量など）</button></div>`;
  }
  return h;
}

// ----- 操作 -----
document.addEventListener('click',e=>{
  const t=e.target.closest('button');if(!t||!S)return;
  if(t.dataset.sub){const [tk,sk]=t.dataset.sub.split(':');SUB[tk]=sk;renderPanel();return}
  if(t.dataset.goto){const [tk,sk]=t.dataset.goto.split(':');SUB[tk]=sk;setTab(tk);renderBadges();return}
  if(t.dataset.pay){if(payBill(t.dataset.pay)){snd('coin');save();render()}return}
  if(t.dataset.good){const g=GOODS.find(x=>x.k===t.dataset.good),p=Math.round(g.p*Math.max(.2,S.cty.inc));if(S.money>=p&&!(g.once&&S.goods[g.k])&&goodCanBuy(g,0)){outc('goods',p);DL=null;goodApply(g,0,()=>g.f());if(g.once)S.goods[g.k]=1;log(`${g.n}を買った`,'good');snd('buy');save();render()}return}
  if(t.dataset.sub2){const k=t.dataset.sub2;S.subs[k]=S.subs[k]?0:1;log(S.subs[k]?`${SUBS[k].n}を契約した`:`${SUBS[k].n}を解約した`,'life');save();render();return}
  if(t.dataset.home){const i=+t.dataset.home,hm=HOMES[i];const rent=Math.round(S.region.cost*.5*hm.m*(S.priceIdx||1));const cost=hm.buy?Math.round(hm.buy*S.cty.inc):rent*2;if(S.money>=cost){outc('move',cost);S.home=i;S.indep=1;delete S.goods.furniture;if(hm.priv)ad('priv',10);tl(hm.n+'に住み始めた');log(`${hm.n}に引っ越した`,'life');snd('buy');save();render()}return}
  if(t.dataset.inv){const c=Math.max(.2,S.cty.inc);const v=+t.dataset.inv;if(v<0){inc('invout',Math.round(S.inv));S.inv=0;log('投資を全部引き出した','life')}else{const a=Math.round(v*c);if(S.money>=a){outc('invest',a);S.inv+=a;log(`${yen(a)}を投資に回した`,'life')}}save();render();return}
  if(t.dataset.repay){const c=Math.max(.2,S.cty.inc);let v=+t.dataset.repay;v=v<0?S.debt:Math.min(S.debt,Math.round(v*c));if(v>0&&S.money>=v){outc('debt',v);S.debt-=v;S.bills=S.bills.filter(b=>b.cat!=='debt'||S.debt>0);if(S.debt<=0){S.debtRate=0;log('借金を完済した！','good');tl('借金を完済した')}snd('coin');save();render()}return}
  if(t.dataset.loan){const L={bank1:[500000,.03],bank2:[2000000,.03],cons:[100000,.15],cons2:[500000,.15]}[t.dataset.loan];const c=Math.max(.2,S.cty.inc);const amt=Math.round(L[0]*c);S.debtRate=S.debt>0?((S.debtRate||0)*S.debt+L[1]*amt)/(S.debt+amt):L[1];S.debt+=amt;inc('loan',amt);S.credit=clamp(S.credit-3);log(`${yen(amt)}を借りた（年${Math.round(L[1]*100)}%）`,'life');save();render();return}
  if(t.dataset.donate){const a=Math.round(+t.dataset.donate*Math.max(.2,S.cty.inc));if(S.money>=a){outc('donate',a);ad('rep',a>=50000?3:1);ad('happy',2);log(`${yen(a)}を寄付した`,'good');save();render()}return}
  if(t.dataset.send){const a=Math.round(+t.dataset.send*Math.max(.2,S.cty.inc));if(S.money>=a){outc('send',a);relP(5);ad('happy',1);log(`親に${yen(a)}を仕送りした`,'good');save();render()}return}
  if(t.dataset.shop!=null){const i=+t.dataset.shop,tt=S.town.tiles[i],k=t.dataset.k,v=+t.dataset.v,c=Math.max(.15,S.cty.inc);initShop(tt);
    if(k==='price'||k==='hours'||k==='adv')tt[k]=v;
    else if(k==='staffp')tt.staff=Math.min(20,tt.staff+1);
    else if(k==='staffm')tt.staff=Math.max(1,tt.staff-1);
    else if(k==='menu'){const cost=Math.round(200000*c);if(S.money>=cost&&!tt.boost){outc('dev',cost);if(chance(.55+S.sk.plan/300)){tt.boost=1;tt.boostEnd=S.am+6;log(`${BLD[tt.t].n}の新メニューが大好評！（6か月）`,'good');snd('buzz')}else{log(`${BLD[tt.t].n}の新メニューは不発だった…`,'bad');snd('bad')}}}
    else if(k==='promo'){if(S.snsOpen&&tt.promo!==S.am){tt.promo=S.am;ad('mental',-1);log(`${BLD[tt.t].n}をSNSで宣伝した`,'sns')}}
    else if(k==='goto'){S.town.sel=i;SUB.biz='town'}
    save();renderPanel();return}
  if(t.dataset.tpol!=null){S.office.talents[+t.dataset.tpol].pol=t.dataset.v;save();renderPanel();return}
  if(t.dataset.tdeal!=null){const tt=S.office.talents[+t.dataset.tdeal];if(stN('manager')&&tt.dealAm!==S.am){tt.dealAm=S.am;const v=Math.round(tt.f*R(.5,1.5)*Math.max(.2,S.cty.inc)*(has('brand')?1.3:1));inc('talent',v);log(`${tt.name}に案件を取ってきた（+${yen(v)}）`,'good');snd('coin');save();render()}return}
  const a=t.dataset.act;
  if(a==='payall'){const n=payAll();if(n){snd('coin');log(`請求書を${n}件まとめて払った`,'life')}save();render()}
  if(a==='autopayT'){S.autopay=S.autopay?0:1;if(S.autopay){const n=payAll();if(n)log(`請求書を${n}件まとめて払った`,'life')}save();render();if(modalOpen()&&!curEv)showMenu()}
});
document.addEventListener('input',e=>{const k=e.target.dataset&&e.target.dataset.vol;if(!k)return;VOL[k]=(+e.target.value)/100;saveVol();const lab=e.target.closest('label').querySelector('span');lab.textContent=(k==='bgm'?'BGM ':'効果音 ')+Math.round(VOL[k]*100);if(k==='bgm'&&BG.master&&AC)BG.master.gain.value=.05*VOL.bgm});
document.addEventListener('change',e=>{const t=e.target;if(!S)return;if(t.dataset.popt!=null){S.planOpt[+t.dataset.popt]=t.value;save();renderPanel();return}if(t.dataset.plan!=null){S.planOpt[+t.dataset.plan]=null;renderPanel()}if(t.dataset.vol==='se')snd('coin')});
