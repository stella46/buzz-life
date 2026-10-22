// ===== v0.2：既存の仕組みの差し替え =====
const EARN=['job','part','sns','deal','tip','biz','talent'];
Object.assign(INC_LBL,{talent:'タレント収益',biz:'事業の利益',mayor:'市長の給与',trust:'遺産',loss:'臨時収入'});
Object.assign(OUT_LBL,{office:'事務所の家賃',staff:'スタッフの給料',biz:'事業の赤字',build:'建設・設備',loss:'臨時出費',research:'研究費'});
const NAMEPOOL={
  usa:{s:['スミス','ジョンソン','ブラウン','ガルシア','ミラー'],m:['リアム','ノア','イーサン','ルーカス'],f:['エマ','オリビア','ソフィア','ミア']},
  korea:{s:['キム','イ','パク','チェ','チョン'],m:['ミンジュン','ソジュン','ドユン','ハジュン'],f:['ソヨン','ジウ','ハユン','ソア']},
  germany:{s:['ミュラー','シュミット','シュナイダー','フィッシャー'],m:['レオン','ルーカス','フィン','パウル'],f:['ミア','エマ','ハンナ','ソフィー']},
  brazil:{s:['シルバ','サントス','オリヴェイラ','ソウザ'],m:['ミゲル','アーサー','ガエル','エイトール'],f:['ヘレナ','アリス','ラウラ','マリア']},
  india:{s:['シャルマ','パテル','シン','クマール','グプタ'],m:['アーラヴ','ヴィハーン','アルジュン','サイ'],f:['アナヤ','ディヤ','サーンヴィ','イシャ']},
  philippines:{s:['サントス','レイエス','クルス','バウティスタ'],m:['ホセ','ジョン','ミゲル','ガブリエル'],f:['マリア','アンジェル','ジャスミン','アリシア']},
  nigeria:{s:['オコンクウォ','アデバヨ','イブラヒム','オコロ'],m:['チディ','トゥンデ','エメカ','ムサ'],f:['アマラ','ンゴジ','ファティマ','アダエゼ']},
  fantasy:{s:['ルミエール','アステル','カシオペ','ソルベ','ヒバナ','ミナモ'],m:['リオ','カイル','ノクト','ゼン','ハル'],f:['リナ','セラ','ミーア','ユノ','ルル']}
};
const pool=()=>S&&S.cty&&!S.cty.jp?(NAMEPOOL[S.ctyId]||NAMEPOOL.fantasy):null;
function givenName(g){const p=pool();return p?pick(g==='男'?p.m:p.f):pick(g==='男'?NAME_M:NAME_F)}
function fullName(sur,first){return S&&S.cty&&!S.cty.jp?first+' '+sur:sur+' '+first}
function mkNpc(role){const g=chance(.5)?'男':'女';const p=pool();const nm=p?pick(g==='男'?p.m:p.f)+' '+pick(p.s):pick(SURN)+' '+pick(g==='男'?NAME_M:NAME_F);return {id:'n'+RI(1000,9999),name:nm,role,trait:pick(NPC_TRAITS),rel:RI(35,55),g}}

function ad(k,v,cat){
  if(!v)return;
  if(k in P_KEYS)S.p[k]=clamp(S.p[k]+v);
  else if(k in SK_KEYS)S.sk[k]=clamp(S.sk[k]+v);
  else if(k==='money'){if(!cat)v=Math.round(v*(S.cty?S.cty.inc:1));if(v>0)inc(cat==='loss'?'loss':(cat||'ev'),v);else outc(cat||'ev',-v)}
  else if(k==='f'){const key=S.open[S.main]?S.main:'milu';if(!S.open[key])return;S.f[key]=Math.max(0,S.f[key]+v)}
  else if(k.startsWith('tal.')){const t=talKey(k.slice(4));S.tal[t]=clamp((S.tal[t]||0)+v)}
  if(DL)DL[k]=(DL[k]||0)+v;
}
function inc(cat,v){if(!v)return;if(EARN.includes(cat))v=Math.round(v*DF().money);S.money+=v;S.mo.inc[cat]=(S.mo.inc[cat]||0)+v;if(['sns','deal','tip','talent','biz'].includes(cat))S.yInc+=v}
function makeOffers(edu,mid){
  let base=(edu==='大卒'?237000:187000)*S.cty.inc*(1+(S.town?S.town.dev:0)/300);
  if(mid)base*=1+Math.min(.6,Math.max(0,age()-22)*.02);
  const ok=JOBS.filter(j=>S.p.know>=j.need&&(!j.uni||edu==='大卒')&&(!j.soc||S.p.social>=j.soc));
  const out=[],pool2=ok.slice();
  while(out.length<3&&pool2.length){const j=pool2.splice(RI(0,pool2.length-1),1)[0];out.push({n:j.n,sal:Math.max(1000,Math.round(base*j.m*S.region.sal*R(.96,1.04)/1000)*1000)})}
  return out;
}
ACT.play.f=k=>{ad('happy',2*k);ad('tal.'+pick(TALK),1.4*k);ad('mental',1*k)};
ACT.part.f=k=>{inc('part',Math.round(45000*k*S.region.sal*S.cty.inc));ad('health',-.8*k);ad('social',.4*k)};
ACT.date.f=k=>{rel(lover(),4*k);ad('happy',2*k);outc('date',Math.round(8000*k*S.cty.inc))};

function postQuality(){
  const g=GENRES[S.genre]||GENRES.talk;let mix=0;for(const s in g.w)mix+=(s==='know'?S.p.know:S.sk[s])*g.w[s];
  const cond=(S.p.health+S.p.mental)/2;
  const bonus=Math.min(20,stN('editor')*4*staffMul())+Math.min(10,countB('studio')*5)+(has('live')?2:0)+(has('analytics')?3:0);
  return clamp(mix*.55+(S.tal[talKey(S.genre)]||0)*.25+eqBonus()+bonus+(cond-50)*.15,1,100);
}
function doPost(k){
  const key=S.main,sn=SNS[key],f=S.f[key],q=postQuality(),st=STYLES[S.style]||STYLES.norm,D=DF();
  const tg=S.trend.g===S.genre?1.8:1,ts=S.trend.s===key?1.4:1;
  const posts=8*k;
  const base=f*(.06+q/500)*sn.reach;
  let disc=(q*q/100)*18*sn.disc*tg*ts*st.disc*R(.5,1.5)*(S.algo>0?(has('analytics')?.75:.5):1)*(1+Math.min(Math.sqrt(f),700)/120)*D.disc*(S.cty.disc||1)*(key==='patto'&&has('shorts')?1.25:1);
  let views=(base+disc)*posts,discV=disc*posts,buzzed=false;
  if(chance((.006+q/5000)*(tg>1?1.5:1)*(1+stN('writer')*.15*staffMul())*Math.min(1,k*2))){const m=R(4,16);views+=discV*m;discV*=m+1;buzzed=true}
  let nf=discV*(.005+q/15000)*sn.conv+base*posts*.0008;
  nf*=Math.max(0,1-f/sn.cap);
  if(q<25)nf-=f*.01*k;
  S.f[key]=Math.max(0,f+nf);
  const money=f>=sn.mon?Math.round(views*sn.rpm*Math.max(.15,S.cty.inc)):0;
  if(money)inc('sns',money);
  S.mo.views+=views;S.mo.newF+=nf;S.mo.posts+=k;S.stats.views+=views;
  const tired=(has('mind')?.7:1)*(stN('manager')?.85:1);
  ad('mental',-.45*k*tired);ad('health',-.15*k*tired);ad('tal.'+S.genre,.4*k);ad('edit',.35*k);
  for(const s in (GENRES[S.genre]||GENRES.talk).w)if(s!=='know')ad(s,.25*k);
  if(buzzed){S.mo.buzz++;S.stats.buzz++;log(`投稿がバズった！ ${num(views)}回再生`,'sns');pop('バズった！','f');snd('buzz');if(S.stats.buzz===1)tl('初めてバズった')}
  const fp=(.0005+st.fl+Math.max(0,60-S.p.rep)/8000)*sn.flame*k*(f>300?1:.2)*D.flame*(S.cty.flame||1);
  if(chance(fp)&&!S.q.includes('flame')&&!(S.cd.flame!=null&&S.am-S.cd.flame<6)){S.q.push('flame');S.mo.flame++}
  if(S.flags.noSide&&S.st==='work'&&chance(.03*k)&&!S.q.includes('w_fired'))S.q.push('w_fired');
}
function kidChannelTick(k){
  if(!S.kc.on||age()>=13)return;
  S.kc.f+=(30+S.kc.f*.025)*R(.4,1.6)*k;
  if(chance(.02*k)){S.kc.f+=RI(1000,15000);log('家族チャンネルの動画がバズったらしい','sns')}
  if(age()>=6)inc('kc',Math.round(S.kc.f*.02*k*(S.kc.share?3:1)*Math.max(.15,S.cty.inc)));
  ad('priv',-.4*k);
}
function endMonth(){
  const a0=age(),lbl=`${S.y}年${S.m}月`;
  S.am++;S.m++;if(S.m>12){S.m=1;S.y++}
  const a=age(),ci=S.cty.inc;
  if(a>=6&&a<18&&S.st==='school')inc('allow',Math.round(TIERS[S.tier].allow*(a>=13?2:1)*ci));
  if(S.st==='work'){inc('job',S.salary);S.salSum+=S.salary}
  if(S.spouse&&S.spouse.inc)inc('family',Math.round(S.spouse.inc*ci));
  if(a>=65&&S.pension)inc('pension',S.pension);
  if(S.indep)outc('living',livingCost());
  else if(a>=18&&!['univ','school'].includes(S.st))outc('living',Math.round(30000*ci));
  const kidsN=S.kids.filter(c=>S.am-c.born<22*12).length;if(kidsN)outc('kids',Math.round(kidsN*35000*ci));
  if(S.debt>0&&S.st!=='univ'&&a>=19){const p=Math.min(S.debt,Math.round((S.debt>1000000*ci?15000:30000)*ci));S.debt-=p;outc('debt',p)}
  if(S.inv>0)S.inv=Math.max(0,S.inv*(1+R(-.035,.045)));
  if(S.m===4&&S.st==='work')S.salary=Math.round(S.salary*1.02);
  if(S.m===1){S.taxBase=S.yInc;S.yInc=0}
  if(S.m===3&&age()>=18&&S.taxBase>=(S.st==='work'?200000:480000)*ci){if(S.flags.taxAuto){const t=Math.round(S.taxBase*.15);outc('tax',t);log(`確定申告をして税金${yen(t)}を納めた`,'life')}else S.q.push('tax')}
  monthSys();
  drift();
  for(const key in S.f){if(!S.open[key])continue;const posted=S.mo.posts>0&&key===S.main;S.f[key]*=posted?.993:.98}
  if(S.rival)S.rival.f=Math.round(S.rival.f*(1+R(.004,.035))+R(5,150));
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
  S.last=Object.assign({},S.mo,{lbl,ti,to,f:tf});
  S.mo=newMo();
  checkAch('m');
  if(S.am%12===0)saveMeta();
  if(a!==a0)birthday(a);
  if(deathCheck())die();
}
function monthSys(){
  const a=age();
  if(a>=10)S.rp+=.3+S.p.know*.012+S.sk.plan*.012+stN('writer')*.6*staffMul()+countB('library')*.5;
  if(S.office.lv){const o=OFFICE[S.office.lv];outc('office',Math.round(o.rent*S.cty.inc));for(const k in STAFF){const n=stN(k);if(n)outc('staff',Math.round(STAFF[k].sal*S.cty.inc*n))}
    let te=0;for(const t of S.office.talents){t.f=clamp(Math.round(t.f*(1+(R(-.02,.035)+stN('manager')*.003*staffMul())*(1-t.f/2e6))),100,2e6);te+=t.f*.6*Math.max(.15,S.cty.inc)}if(te)inc('talent',Math.round(te))}
  let pr=0;S.town.tiles.forEach((t,i)=>{if(BLD[t.t])pr+=bldProfit(i)});if(pr>0)inc('biz',pr);else if(pr<0)outc('biz',-pr);
  ad('happy',Math.min(1.5,countB('cafe')*.25+countB('park')*.15));ad('health',Math.min(1.5,countB('gym')*.3));ad('mental',Math.min(1.5,countB('park')*.25));ad('know',Math.min(1,countB('library')*.2));ad('rep',Math.min(1,countB('kids')*.3+stN('pr')*.2));
  S.town.dev=calcDev();
  if(S.role==='mayor'||S.role==='adviser'){inc('mayor',Math.round(800000*S.cty.inc));S.town.bonus+=.05}
  if(S.role==='adviser')S.nation=Math.min(100,(S.nation||0)+S.town.dev/600);
  const d=S.town.dev;
  if(!S.role&&d>=15&&a>=18&&!S.seen.r_face&&!S.q.includes('r_face'))S.q.push('r_face');
  if(S.role==='face'&&d>=35&&totalF()>=50000&&!S.seen.r_amb&&!S.q.includes('r_amb'))S.q.push('r_amb');
  if((S.role==='face'||S.role==='amb')&&has('politics')&&d>=55&&S.p.rep>=55&&a>=25&&a<80&&(S.cd.r_elect==null||S.am-S.cd.r_elect>=48)&&!S.q.includes('r_elect'))S.q.push('r_elect');
  if(S.role==='mayor'&&has('nation')&&d>=85&&!S.seen.r_nation&&!S.q.includes('r_nation'))S.q.push('r_nation');
}
function drift(){
  const a=age(),p=S.p;
  const cap=clamp(100-Math.max(0,a-30)*.55,20,100);
  if(p.health<cap)p.health=clamp(p.health+(cap-p.health)*.03);else p.health=clamp(p.health-.4);
  if(a>=45)p.health=clamp(p.health-(a-45)*.006*(has('fitness')?.7:1));
  p.mental=clamp(p.mental+(62-p.mental)*.06);
  p.rep=clamp(p.rep+(60-p.rep)*(stN('pr')?.04:.02));
  p.priv=clamp(p.priv+(85-p.priv)*.01);
  const tgt=35+p.social*.18+p.mental*.22+(S.money<0?-12:4)+(S.spouse?8:0)+Math.min(9,S.kids.length*3)+(S.pet?3:0);
  p.happy=clamp(p.happy+(tgt-p.happy)*.06);
  if(S.money<0){p.health=clamp(p.health-.6);p.mental=clamp(p.mental-1.5)}
  for(const n of [S.partner,S.spouse])if(n)n.rel=clamp(n.rel-.4);
}
function birthday(a){
  if(a===6){S.st='school';S.friends=[mkNpc('友達'),mkNpc('友達')];S.q.push('m6')}
  if(a===13){S.rival={id:'rv',name:pick(RIVALS),role:'ライバル配信者',trait:pick(['負けず嫌い','人当たりがいい','毒舌','努力家']),rel:30,f:RI(200,3000)};
    if(!S.snsOpen&&!snsEra()){S.flags.preNet=1}else if(!S.snsOpen&&!chance(S.cty.net)){S.flags.noNet=1;S.q.push('m13n')}else if(!S.snsOpen)S.q.push('m13');
    if(S.kc.on)S.q.push('m13k')}
  if(a===15&&S.st==='school')S.q.push('m15');
  if(a===18){if(S.st==='school')S.q.push('m18');if(S.trust>0){inc('trust',S.trust);log(`親が残してくれた${yen(S.trust)}を受け取った`,'life');S.trust=0}}
  if(a===65){S.pension=Math.round(68000*S.cty.inc+S.salSum*.005481/12);if(S.st==='work')S.q.push('m65')}
  log(`${a}歳の誕生日`,'life');
  bgmUpdate();
}
function deathCheck(){const h=S.p.health;let m=h<15?5:h<30?2.5:h<50?1.4:h>85?.85:1;if(S.flags.cancer==='untreated')m*=6;else if(S.flags.cancer==='treat')m*=1.8;const a=S.am/12;const cm=a<5?S.cty.child:S.cty.life;return chance(Math.min(.9,qx(a,S.g)*cm*DF().mort)/12*m)}

// ===== 新しい人生 =====
let LASTOPT={stage:'nipporia',diff:'normal',endless:0,cty:null};
function newGame(o){
  o=Object.assign({},LASTOPT,o||{});LASTOPT={stage:o.stage,diff:o.diff,endless:o.endless,cty:o.cty,era:o.era,yearIn:o.yearIn};o.year=o.year||eraYear(o);
  const _rnd=Math.random;o.seed=o.seed!=null?o.seed:Math.floor(_rnd()*1e6);Math.random=mulberry32(o.seed+1);
  try{
  const cid=o.cty||pickCountry(o.stage),regs=regionsFor(cid),fr=o.free||{};
  S={cty:Object.assign({},COUNTRIES[cid]),ctyId:cid};
  const g=fr.g||(chance(.5)?'男':'女'),p=pool();
  const sur=fr.last||(p?pick(p.s):pick(SURN)),first=fr.first||givenName(g);
  const tal={};for(const k of TALK)tal[k]=RI(4,22);tal[fr.tal||pick(TALK)]+=RI(12,24);
  const adult=gg=>p?pick(gg==='男'?p.m:p.f):pick(gg==='男'?ADULT_M:ADULT_F);
  const single=chance(.08);
  const fa={id:'fa',name:fullName(sur,adult('男')),role:'父',trait:pick(TRAITS),rel:60,alive:true,age0:RI(26,40)};
  const mo={id:'mo',name:fullName(sur,adult('女')),role:'母',trait:pick(TRAITS),rel:65,alive:true,age0:RI(25,38)};
  if(single){if(chance(.85))fa.alive=false;else mo.alive=false}
  const sibs=[];const ns=chance(.55)?RI(1,2):0;
  for(let i=0;i<ns;i++){const sg=chance(.5)?'男':'女',older=chance(.5);sibs.push({id:'s'+i,name:fullName(sur,givenName(sg)),role:older?(sg==='男'?'兄':'姉'):(sg==='男'?'弟':'妹'),trait:pick(NPC_TRAITS),rel:55})}
  const region=fr.region!=null?regs[fr.region]:wpick(regs),tier=fr.tier!=null?fr.tier:RI(0,4);
  Object.assign(S,{v:2,g,first,last:sur,name:fullName(sur,first),y:o.year,m:RI(1,12),am:0,wk:0,unit:'month',
    regions:regs,region,tier,diff:o.diff||'normal',endless:o.endless?1:0,gen:1,lineage:[],
    p:{health:RI(72,92),mental:65,happy:60,know:4,social:15,rep:60,priv:92},
    sk:{talk:2,plan:2,edit:0,looks:8},tal,money:0,inv:0,debt:0,trust:0,
    f:{milu:0,patto:0,tsubu:0},open:{milu:0,patto:0,tsubu:0},snsOpen:0,main:'milu',genre:'talk',style:'norm',
    eq:{cam:0,mic:0,light:0,pc:0,room:0},
    st:'baby',job:null,salary:0,salSum:0,pension:0,edu:null,indep:0,
    fam:{fa:fa.alive?fa:null,mo:mo.alive?mo:null,single},sibs,friends:[],rival:null,partner:null,spouse:null,kids:[],pet:0,
    kc:{on:0,f:0,was:0,likely:[fa,mo].some(x=>x.alive&&x.trait==='目立ちたがり')||chance(.18*S.cty.net)},
    lesson:null,plan:[],auto:0,pause:0,algo:0,trend:{g:'game',s:'patto',until:0},
    office:{lv:0,staff:{editor:0,manager:0,writer:0,pr:0},talents:[]},town:newTown(region.type),res:{},rp:0,role:null,nation:0,
    q:['birth'],seen:{},cd:{},flags:{},log:[],tl:[],hist:[],mo:newMo(),last:null,
    stats:{maxF:0,maxM:0,views:0,buzz:0,flames:0,deals:0},hsum:0,hn:0,yInc:0,taxBase:0,alive:true,
    look:{hair:pick(['#2a1d16','#3b2a1e','#171717','#5a3a22']),shirt:pick(['#ff5c8a','#3fd6c9','#ffcf3f','#7bdc6b','#b49cff'])}});
  if(!S.fam.fa&&!S.fam.mo){S.fam.mo=mo;mo.alive=true}
  }finally{Math.random=_rnd}
  birthHook(o);
  newTrend();setSpeed(0);
  showScreen('game');setTab('act');render();
  showEvent(EV[S.q.shift()]);
}
function continueAsChild(i,parentAlive){
  const P=S,c=P.kids[i];if(!c)return;
  const cam=Math.max(0,P.am-c.born),worth=Math.max(0,P.money+P.inv-P.debt),inh=Math.round(worth*.85/Math.max(1,P.kids.length));
  const tier=worth>2e8?4:worth>5e7?3:worth>1e7?2:worth>2e6?1:Math.min(P.tier,1);
  const prole=P.g==='男'?'父':'母',orole=prole==='父'?'母':'父';
  const par={id:'pp',name:P.name,role:prole,trait:parentAlive?'隠居中':'（故人）',rel:80,alive:!!parentAlive,age0:Math.floor(c.born/12)+0};
  par.age0=Math.floor((c.born)/12);
  const sp=P.spouse?{id:'sp',name:P.spouse.name,role:orole,trait:P.spouse.trait,rel:70,alive:true,age0:Math.floor(c.born/12)}:null;
  const sibs=P.kids.filter((k,j)=>j!==i).map((k,j)=>({id:'s'+j,name:fullNameFrom(P,k.name),role:k.born<c.born?(k.g==='男'?'兄':'姉'):(k.g==='男'?'弟':'妹'),trait:pick(NPC_TRAITS),rel:60}));
  const tal={};for(const k of TALK)tal[k]=clamp(RI(4,20)+(P.tal[k]||0)*.3);
  const a=Math.floor(cam/12);
  const N={v:2,cty:P.cty,ctyId:P.ctyId,regions:P.regions,region:P.region,tier,diff:P.diff,endless:1,gen:(P.gen||1)+1,
    lineage:(P.lineage||[]).concat([{name:P.name,age:age(),title:titlesOf()[0],maxF:Math.round(P.stats.maxF),score:scoreOf()}]),
    g:c.g,first:c.name,last:P.last,name:fullNameFrom(P,c.name),y:P.y,m:P.m,am:cam,wk:0,unit:P.unit,
    p:{health:85,mental:55,happy:50,know:Math.min(70,a*3.5),social:Math.min(50,10+a*2),rep:60,priv:P.flags.kidAsk==='yes'?65:90},
    sk:{talk:Math.min(30,a*1.2),plan:Math.min(30,a*1.2),edit:Math.min(25,a),looks:Math.min(30,8+a)},tal,
    money:a>=18?inh:0,trust:a>=18?0:inh,inv:0,debt:0,
    f:{milu:0,patto:0,tsubu:0},open:{milu:0,patto:0,tsubu:0},snsOpen:0,main:'milu',genre:'talk',style:'norm',
    eq:Object.assign({},P.eq),st:a<6?'baby':a<18?'school':'free',job:null,salary:0,salSum:0,pension:0,edu:null,indep:a>=18?1:0,
    fam:{fa:prole==='父'?par:sp,mo:prole==='母'?par:sp,single:!sp},sibs,friends:a>=6?[mkNpc('友達'),mkNpc('友達')]:[],rival:null,partner:null,spouse:null,kids:[],pet:0,
    kc:{on:0,f:0,was:P.flags.kidAsk==='yes'?1:0,likely:0},lesson:null,plan:[],auto:P.auto,pause:0,algo:0,trend:P.trend,
    office:P.office,town:P.town,res:P.res,rp:P.rp,role:null,nation:P.nation||0,
    q:['gen_start'],seen:{},cd:{},flags:{heir:P.name,heirAlive:parentAlive?1:0},log:[],tl:[[a,'親の人生を引き継いだ（'+((P.gen||1)+1)+'代目）']],hist:[],mo:newMo(),last:null,
    stats:{maxF:0,maxM:0,views:0,buzz:0,flames:0,deals:0},hsum:0,hn:0,yInc:0,taxBase:0,alive:true,
    look:{hair:pick(['#2a1d16','#3b2a1e','#171717','#5a3a22']),shirt:pick(['#ff5c8a','#3fd6c9','#ffcf3f','#7bdc6b','#b49cff'])}};
  if(!N.fam.fa&&!N.fam.mo)N.fam.mo=par;
  ensureV6();legacyHook(P,N);
  S=N;ensureV3();
  if(a>=13){S.rival={id:'rv',name:pick(RIVALS),role:'ライバル配信者',trait:'努力家',rel:30,f:RI(1000,20000)};openSns('milu');S.main='milu';if(P.flags.kidAsk==='yes')S.f.milu=Math.round(P.stats.maxF*.03);S.genre=topTal()}
  newTrend();setSpeed(0);showScreen('game');setTab('act');save();render();
  showEvent(EV[S.q.shift()]);
}
function fullNameFrom(P,first){return P.cty&&!P.cty.jp?first+' '+P.last:P.last+' '+first}
function retireTo(i){S.cause='隠居（人生を子どもに託した）';S.alive=false;setSpeed(0);tl('隠居して人生を子どもに託した');finalizeLife();continueAsChild(i,true)}
function finalizeLife(){
  checkAch('d');META.lives=(META.lives||0)+1;const sc=scoreOf();META.best=Math.max(META.best||0,sc);META.bestF=Math.max(META.bestF||0,S.stats.maxF);
  for(const t of titlesOf())META.titles[t]=1;saveMeta();
  try{localStorage.removeItem(CFG.save)}catch(e){}
}
function die(){
  S.alive=false;S.cause=causeOf();tl('永眠（'+S.cause+'）');
  setSpeed(0);skipping=false;finalizeLife();
  closeModal();snd('end');showEnding();
}
function titlesOf(){
  const st=S.stats,a=age(),hav=S.hn?S.hsum/S.hn:50,t=[];
  if(S.role==='adviser')t.push('国を動かした人');else if(S.role==='mayor')t.push('市長');
  if(st.maxF>=1e6)t.push('国民的インフルエンサー');else if(st.maxF>=1e5)t.push('人気クリエイター');else if(st.maxF>=1e4)t.push('中堅配信者');else if(st.maxF>=1000)t.push('小さな人気者');
  if(S.office&&S.office.lv>=2)t.push('敏腕社長');
  if(S.town&&S.town.dev>=60)t.push('まちの立役者');
  if(st.flames>=5)t.push('炎上の申し子');
  if(st.buzz>=20)t.push('バズの達人');
  if(st.maxM>=1e8)t.push('億り人');
  if(hav>=70)t.push('しあわせな人');
  if(a>=95)t.push('大往生');
  if(S.kids.length>=3)t.push('大家族');
  if(S.kc.was)t.push('元・家族チャンネルの子');
  if(st.deals>=20)t.push('案件マスター');
  if(!t.length)t.push(a>=80?'おだやかな一生':'ふつうの人生');
  return t;
}
function showEnding(){
  const st=S.stats,ts=titlesOf(),sc=scoreOf();
  const heirs=S.endless?S.kids:[];
  const el=$('#scrEnd');
  el.innerHTML=`<div class="head"><p class="muted">${esc(S.y)}年${esc(S.m)}月 ／ ${esc(ctry())}${(S.gen||1)>1?` ／ ${S.gen}代目`:''}</p><h1>${esc(S.name)}の人生</h1><p>享年 ${age()}歳 ／ ${esc(S.cause)}</p><span class="ttl">${esc(ts[0])}</span><p class="muted small">${ts.slice(1).map(esc).join('・')}</p></div>
  ${S.endless?`<div class="card"><h3>家系をつなぐ</h3>${heirs.length?`<p class="hint">子どもの一人として人生を続けられる。お金・事務所・まち・研究は引き継がれる。</p><div class="row">${heirs.map((c,i)=>`<button class="b pri" type="button" data-heir="${i}">${esc(c.name)}（${Math.floor((S.am-c.born)/12)}歳）として続ける</button>`).join('')}</div>`:'<p class="hint">跡を継ぐ子どもがいないため、この家系はここで終わる。</p>'}</div>`:''}
  <div class="egrid">
    <div class="card"><span>スコア</span><div class="big">${sc.toLocaleString()}</div></div>
    <div class="card"><span>最高フォロワー</span><div class="big">${num(st.maxF)}人</div></div>
    <div class="card"><span>最高資産</span><div class="big">${yen(st.maxM)}</div></div>
    <div class="card"><span>総再生数</span><div class="big">${num(st.views)}回</div></div>
    <div class="card"><span>バズ ／ 炎上</span><div class="big">${st.buzz} ／ ${st.flames}</div></div>
    <div class="card"><span>家族</span><div class="big">${S.spouse?'既婚':'独身'}・子ども${S.kids.length}人</div></div>
    <div class="card"><span>まちの発展度</span><div class="big">${S.town.dev}</div></div>
    <div class="card"><span>事業</span><div class="big">${S.office.lv?esc(OFFICE[S.office.lv].n):'なし'}</div></div>
  </div>
  ${(S.lineage||[]).length?`<h3>家系図</h3><ol class="tl">${S.lineage.map((l,i)=>`<li><b>${i+1}代目</b><span>${esc(l.name)}（享年${l.age}）${esc(l.title)}・最高${num(l.maxF)}人</span></li>`).join('')}<li><b>${S.gen}代目</b><span>${esc(S.name)}（享年${age()}）${esc(ts[0])}</span></li></ol>`:''}
  <h3>人生の推移</h3>
  <div class="charts"><canvas id="ch1" width="320" height="170"></canvas><canvas id="ch2" width="320" height="170"></canvas><canvas id="ch3" width="320" height="170"></canvas></div>
  <h3>人生年表</h3>
  <ol class="tl">${S.tl.map(([a,t])=>`<li><b>${a}歳</b><span>${esc(t)}</span></li>`).join('')}</ol>
  <h3>共有用の画像</h3>
  <div class="share"><img id="shareImg" alt="人生のまとめ画像"><p class="hint" style="text-align:center">画像を長押し（パソコンは右クリック）で保存できます</p></div>
  <div class="row" style="justify-content:center"><button class="b pri" type="button" data-act="setup">新しい人生を始める</button><button class="b" type="button" data-act="achv">実績・図鑑</button><button class="b" type="button" data-act="totitle">タイトルへ</button></div>`;
  showScreen('end');
  const H=S.hist.length?S.hist:[[0,0,0,60,80]];
  lineChart($('#ch1'),H.map(h=>[h[0]/12,h[1]]),'フォロワー','#ff93b2',v=>num(v));
  lineChart($('#ch2'),H.map(h=>[h[0]/12,h[2]]),'資産','#ffcf3f',v=>num(v));
  lineChart($('#ch3'),H.map(h=>[h[0]/12,h[3]]),'幸福','#7bdc6b',v=>Math.round(v),100);
  $('#shareImg').src=shareCard(ts[0],sc);
  window.scrollTo(0,0);
}

// ===== セーブ（旧データの引き継ぎ） =====
function migrate(o){
  if(!o||!o.p||o.am==null)return null;
  if(o.v===1){o.cty=Object.assign({},COUNTRIES.nipporia);o.ctyId='nipporia';o.regions=REGIONS.map(r=>Object.assign({},r));o.diff='normal';o.endless=0;o.gen=1;o.lineage=[];o.office={lv:0,staff:{editor:0,manager:0,writer:0,pr:0},talents:[]};o.town=newTown(o.region.type);o.res={};o.rp=0;o.role=null;o.nation=0;o.trust=0;o.v=2}
  return o.v===2?o:null;
}
function loadSaved(){try{const t=localStorage.getItem(CFG.save);if(!t)return null;const o=migrate(JSON.parse(t));return o&&o.alive?o:null}catch(e){return null}}
function importStr(s){try{s=s.trim();if(!s.startsWith('NIP1.'))return null;return migrate(JSON.parse(decodeURIComponent(escape(atob(s.slice(5))))))}catch(e){return null}}

// ===== 画面 =====
function showScreen(n){$('#scrTitle').hidden=n!=='title';$('#scrGame').hidden=n!=='game';$('#scrEnd').hidden=n!=='end';setTimeout(bgmUpdate,0)}
function renderTop(){$('#tDate').textContent=`${S.y}年${S.m}月${S.unit==='week'?` 第${(S.wk||0)+1}週`:''}`;$('#tAge').textContent=`${age()}歳`;$('#tMoney').textContent=yen(S.money);$('#tFol').textContent=S.snsOpen?`フォロワー ${num(totalF())}`:(S.kc.on?`家族ch ${num(S.kc.f)}`:'SNSは13歳から');const b=$('#btnBgm');if(b){b.classList.toggle('on',bgmOn);b.textContent=bgmOn?'BGM ON':'BGM OFF'}}
function topTalHtml(){return `<h3>素質（生まれつき＋子ども時代に貯めたもの）</h3><div class="bars">${TALK.map(k=>`<span>${GENRES[k].n}</span>${bar(S.tal[k],'g')}<span class="v">${Math.round(S.tal[k])}</span>`).join('')}</div>`}
function renderWho(){
  $('#who').innerHTML=`<div class="nm">${esc(S.name)}${(S.gen||1)>1?` <span class="chip">${S.gen}代目</span>`:''}</div><div class="sub">${esc(stLabel())} ／ ${esc(ctry())}・${esc(S.region.n)}（${esc(S.region.type)}） ／ 実家の暮らし向き：${esc(TIERS[S.tier].l)}${S.role?` ／ ${esc(ROLES[S.role])}`:''}</div>
  <div class="mini"><div>健康 ${Math.round(S.p.health)}${bar(S.p.health,'h')}</div><div>メンタル ${Math.round(S.p.mental)}${bar(S.p.mental,'m')}</div><div>幸福 ${Math.round(S.p.happy)}${bar(S.p.happy,'p')}</div></div>`;
}
function renderPanel(){
  if(!S)return;const P=$('#panel');const a=age();let h='';const ci=S.cty.inc;
  if(tab==='act'){
    const n=freeSlots();ensurePlan();
    h+=`<h2>${S.unit==='week'?'今週':'今月'}の行動</h2>`;
    if(a<6){h+=`<p class="hint">6歳までは自動で育っていく。気になる出来事が起きると止まる。</p><button class="b pri" type="button" data-act="grow">小学生になるまで見守る</button>`}
    else{
      const fixed={school:'学校（自動）',univ:'大学（自動）',work:`仕事：${S.job}（自動）`}[S.st];
      if(fixed)h+=`<div class="fixed">${esc(fixed)}</div>`;
      if(S.flags.care&&S.am<S.flags.care)h+=`<div class="fixed">親の介護（あと${S.flags.care-S.am}か月）</div>`;
      h+=`<p class="hint">自由に使える枠：${n}つ。${S.auto?'おまかせ中は毎ターン自動で決まる。':''}</p><div class="grp">`;
      for(let i=0;i<n;i++){const cur=ACT[S.plan[i]];h+=`<div class="slot"><span class="lb">枠${i+1}</span><select data-plan="${i}" id="plan${i}" ${S.auto?'disabled':''}>${actOptions(i)}</select><span class="ds">${cur?esc(cur.d):''}</span></div>`}
      h+=`</div><div class="row"><button class="b ${S.auto?'on':''}" type="button" data-act="auto">おまかせ：${S.auto?'ON':'OFF'}</button></div>`;
      if(a<18&&a>=6){const opts=lessonOptions();h+=`<div class="grp"><h3>習い事</h3>${opts.length?`<select data-set="lesson" id="lessonSel"><option value="">なし</option>${opts.map(k=>`<option value="${k}" ${S.lesson===k?'selected':''}>${LESSONS[k].n}（月謝 ${num(LESSONS[k].cost*ci)}円・家族が払う）</option>`).join('')}</select>`:'<p class="hint">今の家計では月謝を払う余裕がない。</p>'}</div>`}
      if(S.pause>0)h+=`<p class="hint">活動休止中：あと${S.pause}か月は投稿できない。</p>`;
    }
    h+=`<div class="grp"><h3>時間の進み方</h3><select data-set="unit" id="unitSel"><option value="month" ${S.unit==='month'?'selected':''}>1ターン＝1か月</option><option value="week" ${S.unit==='week'?'selected':''}>1ターン＝1週間（細かく決めたいとき）</option></select><p class="hint">「次へ」で1ターン、▶で自動再生、「イベントまで」で次の出来事まで早送り。PCは P キーで停止／再開。</p></div>`;
  }
  else if(tab==='sns'){
    if(!S.snsOpen){
      h+=`<h2>SNS</h2><p class="hint">${S.flags.noNet?'ネットにつながる環境がない。「買い物」タブでスマホを手に入れれば始められる。':'自分のアカウントは13歳から作れる。それまでは遊びや習い事で素質を貯めよう。'}</p>`;
      if(S.kc.on)h+=`<div class="card"><div class="hd"><span>家族チャンネル（${esc(S.kc.byName)}が運営）</span></div><div class="big">${num(S.kc.f)}人</div><p class="hint">登録者が増えるほど家計が潤い、おこづかいも増える。そのぶんプライバシーは減っていく。</p></div>`;
      h+=topTalHtml();
    }else{
      const q=postQuality();
      h+=`<h2>SNS</h2><div class="grp">`;
      for(const [k,s] of Object.entries(SNS)){const open=S.open[k],mon=S.f[k]>=s.mon;h+=`<div class="card ${S.main===k?'main':''}"><div class="hd"><span>${s.n}<span class="muted small">（${s.d}）</span></span>${S.trend.s===k?'<span class="chip hot">流行中</span>':''}</div>`+
        (open?`<div class="big">${num(S.f[k])}人</div><div class="row small"><span class="muted">${s.mon===Infinity?'広告収益なし（案件向き）':mon?'収益化済み':`収益化まであと${num(s.mon-S.f[k])}人`}</span>${S.main===k?'<span class="chip">メイン</span>':`<button class="b sm" type="button" data-main="${k}">メインにする</button>`}</div>`:`<button class="b sm" type="button" data-opensns="${k}">アカウントを作る</button>`)+`</div>`}
      h+=`</div><div class="grp"><h3>投稿の方針</h3>
        <label class="slot"><span class="lb">ジャンル</span><select data-set="genre" id="genreSel">${Object.entries(GENRES).filter(([k])=>genreOk(k)).map(([k,g])=>`<option value="${k}" ${S.genre===k?'selected':''}>${g.n}（素質${Math.round(S.tal[talKey(k)]||0)}）${S.trend.g===k?' ★流行':''}</option>`).join('')}</select></label>
        <label class="slot"><span class="lb">スタイル</span><select data-set="style" id="styleSel">${Object.entries(STYLES).map(([k,s])=>`<option value="${k}" ${S.style===k?'selected':''}>${s.n}</option>`).join('')}</select></label>
        <p class="hint">攻めるほど伸びやすいが、炎上しやすい。ツブヤは特に燃えやすい。</p></div>
        <div class="grp"><h3>投稿の質 ${Math.round(q)}</h3>${bar(q,'p')}<p class="hint">スキル・素質・機材・スタッフ・研究・体調で決まる。今の流行：${SNS[S.trend.s].n}の「${GENRES[S.trend.g].n}」</p></div>`;
      if(S.rival)h+=`<div class="card"><div class="hd"><span>ライバル：${esc(S.rival.name)}</span><span class="muted small">${esc(S.rival.trait)}</span></div><div class="kv"><span>相手のフォロワー</span><span>${num(S.rival.f)}人</span><span>自分のフォロワー</span><span>${num(totalF())}人</span></div></div>`;
    }
  }
  else if(tab==='shop'){
    h+=`<h2>買い物</h2><p class="hint">いい機材ほど投稿の質が上がる。所持金：${yen(S.money)}</p>`;
    if(S.flags.noNet&&age()>=13){const pr=Math.round(20000*Math.max(.25,ci));h+=`<div class="shop"><div><div>スマホと通信契約</div><div class="muted small">SNSを始められるようになる ${yen(pr)}</div></div><button class="b sm pri" type="button" data-act="buyphone" ${S.money<pr?'disabled':''}>買う</button></div>`}
    h+='<div>';
    for(const [k,e] of Object.entries(EQ)){const lv=S.eq[k],cur=e.t[lv],nx=lv<eqMax()?e.t[lv+1]:null;h+=`<div class="shop"><div><div>${e.n}：${esc(cur[0])}</div>${nx?`<div class="muted small">次：${esc(nx[0])} ${yen(nx[1])}</div>`:`<div class="muted small">${lv<4&&!has('eq5')?'さらに上は研究「プロ機材の知識」で解放':'最高レベル'}</div>`}</div>${nx?`<button class="b sm" type="button" data-buy="${k}" ${S.money<nx[1]?'disabled':''}>買う</button>`:''}</div>`}
    h+=`</div><p class="hint">機材ボーナス：+${Math.round(eqBonus())}</p>`;
  }
  else if(tab==='stat'){
    const rows=(o,keys,cls)=>Object.entries(keys).map(([k,l])=>`<span>${l}</span>${bar(o[k],cls)}<span class="v">${Math.round(o[k])}</span>`).join('');
    h+=`<h2>能力・ステータス</h2><div class="bars">${rows(S.p,P_KEYS)}</div><h3>スキル</h3><div class="bars">${rows(S.sk,SK_KEYS,'g')}</div>`;
    h+=topTalHtml();
    h+=`<h3>お金</h3><div class="kv"><span>所持金</span><span>${yen(S.money)}</span>${S.inv?`<span>投資</span><span>${yen(S.inv)}</span>`:''}${S.debt?`<span>借金・奨学金</span><span>-${yen(S.debt)}</span>`:''}${S.trust?`<span>18歳で受け取る遺産</span><span>${yen(S.trust)}</span>`:''}${S.salary?`<span>月給</span><span>${yen(S.salary)}</span>`:''}${S.indep?`<span>生活費（月）</span><span>${yen(livingCost())}</span>`:''}${S.pension?`<span>年金（月）</span><span>${yen(S.pension)}</span>`:''}</div>`;
    h+=`<p class="hint">${esc(ctry())}${S.cty.flavor?'：'+esc(S.cty.flavor):''}${S.cty.jp?'':'（金額はすべて円に換算して表示）'} ／ 難易度：${esc(DF().n)}${S.endless?' ／ エンドレス':''}</p>`;
    h+=`<h3>進路</h3><p class="hint">${esc(stLabel())}${S.edu?'・'+S.edu:''}</p><div class="row">`;
    if(S.st==='work')h+=`<button class="b sm" type="button" data-act="quit">会社を辞めて専業クリエイターになる</button>`;
    if((S.st==='creator'||S.st==='free')&&a>=18&&a<65&&!S.flags.ronin)h+=`<button class="b sm" type="button" data-act="hunt">就職活動をする</button>`;
    if(S.st==='free'&&a>=18&&!S.flags.ronin)h+=`<button class="b sm" type="button" data-act="becomeCreator">専業クリエイターを名乗る</button>`;
    h+=`</div><div id="confirmBox"></div>`;
  }
  else if(tab==='ppl'){
    const list=[...parents(),...S.sibs,...S.friends,S.rival,S.partner,S.spouse].filter(Boolean);
    h+=`<h2>人物</h2><div>${list.map(n=>`<div class="ppl"><div>${esc(n.name)}<div class="r">${esc(n.role)}・${esc(n.trait)}</div></div><div>${bar(n.rel,'p')}<div class="r">仲のよさ ${Math.round(n.rel)}</div></div></div>`).join('')}
    ${S.kids.map((c,i)=>`<div class="ppl"><div>${esc(c.name)}<div class="r">子ども・${Math.floor((S.am-c.born)/12)}歳</div></div><div>${S.endless&&age()>=50?`<button class="b sm" type="button" data-act="retire" data-i="${i}">この子に託す</button>`:''}</div></div>`).join('')}${S.pet?'<div class="ppl"><div>コロ<div class="r">愛犬</div></div><div></div></div>':''}</div>`;
    if(S.endless&&S.kids.length&&age()<50)h+='<p class="hint">エンドレスでは、50歳を過ぎると「この子に託す」で子どもの人生に移れる。亡くなったときも子どもとして続けられる。</p>';
    h+='<div id="confirmBox"></div>';
    if(!list.length&&!S.kids.length)h+='<p class="hint">まだ誰もいない。</p>';
  }
  else if(tab==='town')h+=townPanel();
  else if(tab==='biz')h+=bizPanel();
  else if(tab==='rec'){
    h+=`<h2>記録</h2><div class="kv"><span>最高フォロワー</span><span>${num(S.stats.maxF)}人</span><span>総再生数</span><span>${num(S.stats.views)}回</span><span>バズ</span><span>${S.stats.buzz}回</span><span>炎上</span><span>${S.stats.flames}回</span><span>PR案件</span><span>${S.stats.deals}件</span><span>まちの発展度</span><span>${S.town.dev}</span>${S.nation?`<span>国の発展への貢献</span><span>${Math.round(S.nation)}</span>`:''}</div>
    ${(S.lineage||[]).length?`<h3>家系</h3><ol class="tl">${S.lineage.map((l,i)=>`<li><b>${i+1}代目</b><span>${esc(l.name)}（享年${l.age}）${esc(l.title)}</span></li>`).join('')}</ol>`:''}
    <h3>人生年表</h3><ol class="tl">${S.tl.slice().reverse().map(([a,t])=>`<li><b>${a}歳</b><span>${esc(t)}</span></li>`).join('')}</ol>
    <h3>セーブ</h3><p class="hint">自動でこのブラウザに保存されている。別の端末に移すときは書き出しを使う。</p><div class="row"><button class="b sm" type="button" data-act="export">セーブデータを書き出す</button><button class="b sm" type="button" data-act="achv">実績・図鑑</button><button class="b sm" type="button" data-act="menu">メニュー</button></div>`;
  }
  P.innerHTML=h;
  if(tab==='town')drawTown();
}
function townPanel(){
  const T=S.town,a=age();let h=`${townSwitchHtml()}<h2>まち：${esc(townName(S.town))}</h2><div class="kv"><span>発展度</span><span>${T.dev}</span><span>あなたの立場</span><span>${S.role?esc(ROLES[S.role]):'住民'}</span>${S.nation?`<span>国の発展への貢献</span><span>${Math.round(S.nation)}</span>`:''}</div>`;
  h+=`<canvas id="townCv" width="128" height="96" aria-label="まちの地図"></canvas><p class="hint">マスをタップして選ぶ。空き地には建物を建てられる。となり合う組み合わせで売上が上がる。</p>`;
  const i=T.sel,t=i>=0?T.tiles[i]:null;
  if(!t){h+='<p class="hint">マスが選ばれていない。</p>';return h}
  const nm={empty:'空き地',road:'道路',house:'住宅',tree:'木'}[t.t]||BLD[t.t].n;
  h+=`<div class="card"><div class="hd"><span>選んだマス：${esc(nm)}${BLD[t.t]?` Lv${t.lv}`:''}</span></div>`;
  if(BLD[t.t]){const b=BLD[t.t],p=bldProfit(i),up=Math.round(b.cost*(t.lv+1)*.6*(b.pub&&S.role==='mayor'?.7:1));
    h+=`<div class="kv"><span>月の収支（目安）</span><span>${p>=0?'+':''}${yen(p)}</span><span>となりの効果</span><span>+${Math.round(adjBonus(i)*100)}%</span></div>${b.eff?`<p class="hint">${esc(b.eff)}</p>`:''}<div class="row">${t.lv<3?`<button class="b sm" type="button" data-act="bup" ${S.money<up?'disabled':''}>強化する ${yen(up)}</button>`:'<span class="chip">最大レベル</span>'}<button class="b sm ghost" type="button" data-act="bdel">取り壊す</button></div>`}
  else if(t.t==='empty'){
    if(a<18)h+='<p class="hint">建物を建てられるのは18歳から。</p>';
    else{h+='<div>';for(const [k,b] of Object.entries(BLD)){const ok=!b.req||has(b.req);const cost=Math.round(b.cost*(b.pub&&S.role==='mayor'?.7:1));
      h+=`<div class="shop"><div><div>${esc(b.n)} <span class="muted small">${yen(cost)}</span></div><div class="muted small">${ok?(b.fan?'売上はフォロワー数しだい':`月${b.inc>=0?'+':''}${yen(b.inc*S.cty.inc)}〜`)+(b.eff?'・'+esc(b.eff):''):'研究「'+esc(BLD_REQN(b.req))+'」で解放'}</div></div>${ok?`<button class="b sm" type="button" data-build="${k}" ${S.money<cost?'disabled':''}>建てる</button>`:''}</div>`}h+='</div>'}
  }else h+='<p class="hint">ここには建てられない。</p>';
  return h+'</div>';
}
function drawTown(){
  const cv=$('#townCv');if(!cv)return;const c=cv.getContext('2d');
  S.town.tiles.forEach((t,i)=>{const x=(i%8)*16,y=Math.floor(i/8)*16;
    px(c,x,y,16,16,'#5f9e4f');px(c,x+3,y+5,1,1,'#78b866');px(c,x+11,y+10,1,1,'#78b866');
    if(t.t==='road'){px(c,x,y,16,16,'#6a6a7a');px(c,x+6,y+7,4,2,'#d8d8a0')}
    else if(t.t==='house'){const cols=['#e57373','#64b5f6','#ffd54f','#a1887f'];px(c,x+3,y+7,10,7,'#efe6d8');px(c,x+2,y+4,12,4,cols[i%4]);px(c,x+7,y+10,2,4,'#6d4c41')}
    else if(t.t==='tree'){px(c,x+5,y+10,2,4,'#6d4c41');px(c,x+3,y+3,8,8,'#2e7d32');px(c,x+5,y+4,3,3,'#43a047')}
    else if(BLD[t.t]){const b=BLD[t.t];px(c,x+1,y+2,14,13,b.col);px(c,x+1,y+2,14,3,'#00000055');px(c,x+3,y+7,3,3,'#ffffffcc');px(c,x+10,y+7,3,3,'#ffffffcc');px(c,x+6,y+10,4,5,'#3b3b55');for(let l=0;l<t.lv;l++)px(c,x+2+l*3,y+13,2,2,'#ffcf3f')}
    if(i===S.town.sel){c.strokeStyle='#ffcf3f';c.lineWidth=1;c.strokeRect(x+.5,y+.5,15,15)}
  });
}
function bizPanel(){
  let h=`<h2>会社・研究</h2><h3>研究（ポイント ${Math.floor(S.rp)}）</h3><p class="hint">知識・企画力・企画作家・図書館で毎月たまる（10歳から）。</p><div>`;
  for(const r of RES){const done=has(r.id),reqOk=!r.req||has(r.req);h+=`<div class="shop"><div><div>${done?'✓ ':''}${esc(r.n)} <span class="muted small">${r.c}pt</span></div><div class="muted small">${esc(r.d)}${!reqOk?`（先に「${esc(RES.find(x=>x.id===r.req).n)}」）`:''}</div></div>${done?'<span class="chip up">完了</span>':reqOk?`<button class="b sm" type="button" data-res="${r.id}" ${S.rp<r.c?'disabled':''}>研究する</button>`:''}</div>`}
  h+='</div><h3>事務所</h3>';
  const ci=S.cty.inc,o=S.office;
  if(!has('company')){h+='<p class="hint">研究「会社経営の基本」で事務所を作れるようになる。</p>';return h}
  const nx=OFFICE[o.lv+1];
  h+=`<div class="kv"><span>今の事務所</span><span>${o.lv?esc(OFFICE[o.lv].n):'なし'}</span>${o.lv?`<span>家賃（月）</span><span>${yen(OFFICE[o.lv].rent*ci)}</span><span>スタッフ枠</span><span>${staffTotal()} / ${OFFICE[o.lv].staff}</span><span>タレント枠</span><span>${o.talents.length} / ${OFFICE[o.lv].tal}</span>`:''}</div>`;
  if(nx)h+=`<div class="row"><button class="b sm pri" type="button" data-act="office" ${S.money<nx.cost*ci||age()<18?'disabled':''}>${o.lv?'移転する':'事務所を作る'}：${esc(nx.n)} ${yen(nx.cost*ci)}</button></div>`;
  if(o.lv){
    h+='<h3>スタッフ</h3><div>';
    for(const [k,s] of Object.entries(STAFF))h+=`<div class="shop"><div><div>${esc(s.n)}：${stN(k)}人 <span class="muted small">月給 ${yen(s.sal*ci)}</span></div><div class="muted small">${esc(s.d)}</div></div><div class="row"><button class="b sm" type="button" data-hire="${k}" ${staffTotal()>=OFFICE[o.lv].staff?'disabled':''}>雇う</button>${stN(k)?`<button class="b sm ghost" type="button" data-fire="${k}">減らす</button>`:''}</div></div>`;
    h+='</div><h3>所属タレント</h3>';
    h+=o.talents.length?`<div>${o.talents.map(t=>`<div class="shop"><div><div>${esc(t.name)}</div><div class="muted small">${esc(GENRES[t.genre].n)}・フォロワー${num(t.f)}人</div></div></div>`).join('')}</div>`:'<p class="hint">まだいない。</p>';
    if(has('scout'))h+=`<div class="row"><button class="b sm" type="button" data-act="scout" ${o.talents.length>=OFFICE[o.lv].tal||S.money<300000*ci?'disabled':''}>タレントを探す ${yen(300000*ci)}</button></div>`;
    else h+='<p class="hint">研究「スカウト網」でタレントを探せる。</p>';
  }
  return h;
}
function showMenu(){
  openModal(`<div class="mcat life">メニュー</div><h2>メニュー</h2><div class="mch">
  <button class="b" type="button" data-act="bgm">BGM：${bgmOn?'ON':'OFF'}</button>
  <button class="b" type="button" data-act="sound">効果音：${sndOn?'ON':'OFF'}</button>
  <button class="b" type="button" data-act="achv">実績・図鑑</button>
  <button class="b" type="button" data-act="export">セーブデータを書き出す</button>
  <button class="b" type="button" data-act="credit">出典・クレジット</button>
  <button class="b" type="button" data-act="totitle">タイトルへ戻る（自動保存されています）</button>
  <button class="b pri" type="button" data-act="close">閉じる</button></div>`);
}
function needTxt(k){return {life1:'1回人生を終える',f10k:'フォロワー1万人を達成',f100k:'フォロワー10万人を達成'}[k]||''}
function showSetup(){
  const so=Object.entries(STAGES).map(([k,s])=>`<option value="${k}" ${LASTOPT.stage===k&&unlocked(s.need)?'selected':''} ${unlocked(s.need)?'':'disabled'}>${s.n}${unlocked(s.need)?'':'（'+needTxt(s.need)+'で解放）'}</option>`).join('');
  const dd=Object.entries(DIFFS).map(([k,d])=>`<option value="${k}" ${LASTOPT.diff===k&&unlocked(d.need)?'selected':''} ${unlocked(d.need)?'':'disabled'}>${d.n}：${d.d}${unlocked(d.need)?'':'（'+needTxt(d.need)+'で解放）'}</option>`).join('');
  const fr=unlocked('life1');
  openModal(`<div class="mcat life">新しい人生</div><h2>どんな人生にする？</h2><div class="form">
  <label class="fld"><span>舞台</span><select id="suStage">${so}</select></label>
  <label class="fld" id="suCtyBox"><span>国</span><select id="suCty"></select></label>
  <label class="fld"><span>難易度</span><select id="suDiff">${dd}</select></label>
  <label class="fld"><span>人生の終わり</span><select id="suEnd"><option value="0">亡くなったら終わり</option><option value="1" ${LASTOPT.endless?'selected':''}>エンドレス（子どもに引き継いで続ける）</option></select></label>
  <label class="fld"><span>生まれる時代</span><select id="suEra">${Object.entries(ERA_OPT).map(([k,x])=>`<option value="${k}" ${(LASTOPT.era||'now')===k?'selected':''}>${x.n}</option>`).join('')}</select></label>
  <label class="fld" id="suYearBox" ${LASTOPT.era==='pick'?'':'hidden'}><span>生まれる年</span><input id="suYear" inputmode="numeric" maxlength="4" value="${esc(LASTOPT.yearIn||'1990')}" placeholder="1940〜2100"></label>
  <label class="fld"><span>人生の目標</span><select id="suGoal"><option value="">ランダム</option>${Object.entries(GOALS).map(([k,g])=>`<option value="${k}">${esc(g.n)}</option>`).join('')}</select></label>
  <label class="fld"><span>生まれの番号</span><input id="suSeed" inputmode="numeric" maxlength="10" placeholder="空欄ならランダム（例 B-123456）"></label></div>
  <p class="hint">友達と同じ「生まれの番号」と同じ舞台・時代を選ぶと、同じ国・家庭・素質で生まれる。どちらがうまく生きられるか競える。</p>
  <div class="mch"><button class="b pri" type="button" data-act="suRandom">ランダムに生まれる</button><button class="b" type="button" data-act="suFree" ${fr?'':'disabled'}>自由に決めて生まれる${fr?'':'（1回人生を終えると解放）'}</button><button class="b ghost" type="button" data-act="close">やめる</button></div>`);
  fillCty();
}
function fillCty(){const st=$('#suStage').value,sel=$('#suCty'),box=$('#suCtyBox');if(st==='nipporia'||st==='japan'){box.hidden=true;sel.innerHTML='';return}box.hidden=false;const ids=Object.keys(COUNTRIES).filter(k=>st==='world'?!COUNTRIES[k].fict:(COUNTRIES[k].fict&&k!=='nipporia'));sel.innerHTML=`<option value="">ランダム${st==='world'?'（生まれる人数が多い国ほど選ばれやすい）':''}</option>`+ids.map(k=>`<option value="${k}">${COUNTRIES[k].n}</option>`).join('')}
function readSetup(){const g=$('#suGoal'),sd=$('#suSeed');return {stage:$('#suStage').value,cty:$('#suCty').value||null,diff:$('#suDiff').value,endless:+$('#suEnd').value,goal:g&&g.value||null,seed:sd?parseSeed(sd.value):null,era:($('#suEra')||{}).value||'now',yearIn:($('#suYear')||{}).value||''}}
let FREEOPT=null;
function showFree(o){
  o.cty=o.cty||pickCountry(o.stage);FREEOPT=o;const regs=regionsFor(o.cty),c=COUNTRIES[o.cty];
  const p=c.jp?null:(NAMEPOOL[o.cty]||NAMEPOOL.fantasy);
  openModal(`<div class="mcat life">自由に決める</div><h2>${esc(c.n)}に生まれる</h2><div class="form">
  <label class="fld"><span>名字</span><input id="frLast" maxlength="8" value="${esc(p?pick(p.s):pick(SURN))}"></label>
  <label class="fld"><span>名前</span><input id="frFirst" maxlength="8" placeholder="空欄ならランダム"></label>
  <label class="fld"><span>性別</span><select id="frG"><option value="">ランダム</option><option>男</option><option>女</option></select></label>
  <label class="fld"><span>地域</span><select id="frReg"><option value="">ランダム</option>${regs.map((r,i)=>`<option value="${i}">${esc(r.n)}（${esc(r.type)}）</option>`).join('')}</select></label>
  <label class="fld"><span>暮らし向き</span><select id="frTier"><option value="">ランダム</option>${TIERS.map((t,i)=>`<option value="${i}">${esc(t.l)}</option>`).join('')}</select></label>
  <label class="fld"><span>得意な素質</span><select id="frTal"><option value="">ランダム</option>${TALK.map(k=>`<option value="${k}">${esc(GENRES[k].n)}</option>`).join('')}</select></label></div>
  <div class="mch"><button class="b pri" type="button" data-act="frGo">この設定で生まれる</button><button class="b ghost" type="button" data-act="setup">戻る</button></div>`);
}
function showAch(){
  const seen=Object.keys(META.seen).length,all=Object.keys(EV).filter(k=>EV[k].w>0||!/^(birth|m\d|jobs_|ronin2|m18b|m13|flame|poor|tax|l_wed|l_kidcam|l_pdeath|h_cancer|h_cured|w_fired|s_stema_out|gen_start|r_)/.test(k)).length;
  const got=ACH.filter(a=>META.ach[a[0]]).length;
  openModal(`<div class="mcat life">実績・図鑑</div><h2>実績 ${got} / ${ACH.length}</h2>
  <div class="kv"><span>これまでの人生</span><span>${META.lives||0}回</span><span>最高スコア</span><span>${(META.best||0).toLocaleString()}</span><span>最高フォロワー</span><span>${num(META.bestF||0)}人</span><span>出来事図鑑</span><span>${seen} / ${Object.keys(EV).length}種</span></div>
  <div class="achl">${ACH.map(([id,n,d])=>`<div class="ach ${META.ach[id]?'got':''}"><b>${META.ach[id]?esc(n):'？？？'}</b><span>${esc(d)}</span></div>`).join('')}</div>
  <h3>集めた称号</h3><p class="small">${Object.keys(META.titles).map(esc).join('・')||'まだない'}</p>
  <button class="b pri" type="button" data-act="close">閉じる</button>`);
}
function initTitle(){applyTitle();const has2=!!loadSaved();$('#btnCont').disabled=!has2;$('#btnCont').textContent=has2?'つづきから':'つづきから（セーブなし）'}

// ===== v0.2 の操作 =====
document.addEventListener('click',e=>{
  if(e.target.id==='townCv'){const r=e.target.getBoundingClientRect();const x=Math.floor((e.clientX-r.left)/r.width*8),y=Math.floor((e.clientY-r.top)/r.height*6);S.town.sel=clamp(y*8+x,0,47);renderPanel();return}
  const t=e.target.closest('button');if(!t)return;
  if(t.dataset.heir!=null){continueAsChild(+t.dataset.heir,false);return}
  if(t.dataset.res){const r=RES.find(x=>x.id===t.dataset.res);if(r&&S.rp>=r.c&&!has(r.id)){S.rp-=r.c;S.res[r.id]=1;log(`研究「${r.n}」が完了した`,'good');tl('研究「'+r.n+'」を完成');snd('buy');checkAch('m');save();render()}return}
  if(t.dataset.hire){const k=t.dataset.hire;if(staffTotal()<OFFICE[S.office.lv].staff){S.office.staff[k]++;log(`${STAFF[k].n}を雇った`,'good');save();render()}return}
  if(t.dataset.fire){const k=t.dataset.fire;if(stN(k)){S.office.staff[k]--;ad('rep',-1);save();render()}return}
  if(t.dataset.build){const k=t.dataset.build,b=BLD[k],i=S.town.sel,cost=Math.round(b.cost*(b.pub&&S.role==='mayor'?.7:1));if(i>=0&&S.town.tiles[i].t==='empty'&&S.money>=cost){outc('build',cost);S.town.tiles[i]={t:k,lv:1};S.town.dev=calcDev();log(`${b.n}を建てた`,'good');if(!S.flags.firstBld){S.flags.firstBld=1;tl('まちに'+b.n+'を建てた')}snd('buy');save();render()}return}
  const a=t.dataset.act;if(!a)return;
  switch(a){
    case 'setup':showSetup();break;
    case 'suRandom':{const o=readSetup();closeModal();newGame(o);break}
    case 'suFree':showFree(readSetup());break;
    case 'frGo':{const o=FREEOPT;o.free={last:$('#frLast').value.trim().slice(0,8)||null,first:$('#frFirst').value.trim().slice(0,8)||null,g:$('#frG').value||null,region:$('#frReg').value===''?null:+$('#frReg').value,tier:$('#frTier').value===''?null:+$('#frTier').value,tal:$('#frTal').value||null};closeModal();newGame(o);break}
    case 'achv':showAch();break;
    case 'bgm':bgmOn=!bgmOn;try{localStorage.setItem('nipporia-bgm',bgmOn?'1':'0')}catch(_){}bgmUser=true;bgmUpdate();if(modalOpen()&&!curEv)showMenu();if(S)renderTop();else{$('#btnBgm2')&&($('#btnBgm2').textContent='BGM：'+(bgmOn?'ON':'OFF'))}break;
    case 'buyphone':{const pr=Math.round(20000*Math.max(.25,S.cty.inc));if(S.money>=pr){outc('shop',pr);delete S.flags.noNet;tl('スマホを手に入れた');S.q.push('m13');render();const ev=EV[S.q.shift()];showEvent(ev)}break}
    case 'office':{const nx=OFFICE[S.office.lv+1],c=Math.round(nx.cost*S.cty.inc);if(nx&&S.money>=c){outc('build',c);S.office.lv++;tl(nx.n+'を構えた');log(`${nx.n}を構えた`,'life');snd('buy');checkAch('m');save();render()}break}
    case 'scout':{const c=Math.round(300000*S.cty.inc);if(S.money>=c&&S.office.talents.length<OFFICE[S.office.lv].tal){outc('staff',c);const g=pick(TALK);const tt={name:pick(TAL_NAMES),genre:g,f:RI(500,30000)};S.office.talents.push(tt);log(`タレント「${tt.name}」が所属した`,'good');snd('buy');checkAch('m');save();render()}break}
    case 'bup':{const i=S.town.sel,tt=S.town.tiles[i],b=BLD[tt.t];const up=Math.round(b.cost*(tt.lv+1)*.6*(b.pub&&S.role==='mayor'?.7:1));if(tt.lv<3&&S.money>=up){outc('build',up);tt.lv++;S.town.dev=calcDev();snd('buy');save();render()}break}
    case 'bdel':{const i=S.town.sel;S.town.tiles[i]={t:'empty',lv:0};S.town.dev=calcDev();save();render();break}
    case 'retire':$('#confirmBox').innerHTML=`<div class="card"><p class="hint">今の人生をここで終えて、${esc(S.kids[+t.dataset.i].name)}として生きる？ 今の自分は隠居して、親として残る。</p><div class="row"><button class="b sm pri" type="button" data-act="retireYes" data-i="${t.dataset.i}">託す</button><button class="b sm" type="button" data-act="cancel">やめておく</button></div></div>`;break;
    case 'retireYes':retireTo(+t.dataset.i);break;
  }
});
document.addEventListener('change',e=>{if(e.target.id==='suStage')fillCty();if(e.target.id==='suEra'){const bx=$('#suYearBox');if(bx)bx.hidden=e.target.value!=='pick'}});
$('#btnBgm').addEventListener('click',()=>{bgmOn=!bgmOn;try{localStorage.setItem('nipporia-bgm',bgmOn?'1':'0')}catch(_){}bgmUser=true;bgmUpdate();renderTop()});
loadMeta();
// オフライン対応：Webサイトとして置いたときだけ動く（ファイル直開き・Claude上では何もしない）
try{if('serviceWorker' in navigator&&/^https?:$/.test(location.protocol)&&!/claude/.test(location.hostname)&&document.querySelector('link[rel=manifest]'))navigator.serviceWorker.register('sw.js').catch(()=>{})}catch(e){}
