// ===== 行動 =====
const ACT={
  study:{n:'勉強',d:'知識が上がる。少し疲れる',ok:()=>age()>=6,f:k=>{ad('know',2.2*k);ad('mental',-.6*k)}},
  play:{n:'遊ぶ',d:'幸福と、いろいろな素質が少し上がる',ok:()=>age()<22,f:k=>{ad('happy',2*k);ad('tal.'+pick(Object.keys(GENRES)),1.4*k);ad('mental',1*k)}},
  lesson:{n:'習い事',d:'習い事に関係する素質が大きく伸びる',ok:()=>age()>=6&&age()<18&&!!S.lesson,f:k=>{const l=LESSONS[S.lesson];for(const t of l.tal)ad('tal.'+t,3.2*k/l.tal.length*1.3);if(l.know)ad('know',1.6*k);if(l.health)ad('health',2*k);ad('happy',.4*k)}},
  friends:{n:'友達と過ごす',d:'人間関係と幸福が上がる',ok:()=>age()>=6,f:k=>{ad('social',2*k);ad('happy',1.2*k);for(const n of S.friends)rel(n,1*k)}},
  rest:{n:'休む',d:'健康とメンタルが回復する',ok:()=>true,f:k=>{ad('health',2.5*k);ad('mental',3*k)}},
  exercise:{n:'運動',d:'健康と見た目が上がる',ok:()=>age()>=6,f:k=>{ad('health',2*k);ad('looks',.6*k);ad('mental',.6*k)}},
  post:{n:'投稿・配信',d:'フォロワーとお金を増やす。疲れる',ok:()=>S.snsOpen&&!(S.pause>0),f:k=>doPost(k)},
  practice:{n:'企画・編集の練習',d:'企画と編集が上がる',ok:()=>age()>=13,f:k=>{ad('plan',1.6*k);ad('edit',1.6*k);ad('mental',-.3*k)}},
  talkp:{n:'話し方・見せ方の練習',d:'話術と見た目が上がる',ok:()=>age()>=13,f:k=>{ad('talk',1.6*k);ad('looks',1*k);ad('mental',-.3*k)}},
  part:{n:'アルバイト',d:'お金を稼ぐ（地域で時給が変わる）',ok:()=>age()>=16&&S.st!=='work'&&S.st!=='retired',f:k=>{inc('part',Math.round(45000*k*S.region.sal));ad('health',-.8*k);ad('social',.4*k)}},
  date:{n:'デート',d:'恋人・配偶者との仲が深まる',ok:()=>!!lover(),f:k=>{rel(lover(),4*k);ad('happy',2*k);outc('date',Math.round(8000*k))}},
  family:{n:'家族と過ごす',d:'家族との仲と幸福が上がる',ok:()=>age()>=6,f:k=>{relP(2*k);for(const s of S.sibs)rel(s,1*k);if(S.spouse)rel(S.spouse,2*k);ad('happy',1.5*k)}}
};
function freeSlots(){const a=age();if(a<6)return 0;let n=({school:2,univ:3,work:2,creator:4,free:4,retired:4})[S.st]||2;if(S.st==='school'&&S.flags.hs==='online'&&a>=15)n++;if(S.flags.care&&S.am<S.flags.care)n--;return Math.max(1,n)}
function defaultAct(){return age()<13?'play':(ACT.post.ok()?'post':'study')}
function ensurePlan(){const n=freeSlots();if(!Array.isArray(S.plan))S.plan=[];while(S.plan.length<n)S.plan.push(defaultAct());S.plan.length=n;S.plan=S.plan.map(a=>ACT[a]&&ACT[a].ok()?a:defaultAct())}
function autoPlan(){
  const n=freeSlots(),a=age(),p=[],can=id=>ACT[id].ok();
  if(n<=0){S.plan=[];return}
  if(S.p.health<40||S.p.mental<35)p.push('rest');
  if(can('part')&&(S.st==='free'||S.money<0)){p.push('part');if(n>=4)p.push('part')}
  if(can('post')){p.push('post');if(n>=3)p.push('post')}
  if(S.st==='school'&&S.p.know<55&&a>=12)p.push('study');
  if(a<13&&S.lesson&&can('lesson'))p.push('lesson');
  if(lover()&&lover().rel<85)p.push('date');
  const fill=a<13?['play','study','friends','lesson']:(S.st==='free'||(S.st==='creator'&&S.money<50000))?['part','practice','talkp','rest']:['practice','talkp','exercise','friends','rest'];
  let i=0;while(p.length<n&&i<30){const c=fill[i++%fill.length];if(can(c))p.push(c)}
  S.plan=p.slice(0,n);
}

// ===== 投稿 =====
function eqBonus(){let t=0;for(const k in S.eq)t+=S.eq[k];return t*1.7}
function postQuality(){
  const g=GENRES[S.genre];let mix=0;for(const s in g.w)mix+=(s==='know'?S.p.know:S.sk[s])*g.w[s];
  const cond=(S.p.health+S.p.mental)/2;
  return clamp(mix*.55+S.tal[S.genre]*.25+eqBonus()+(cond-50)*.15,1,100);
}
function doPost(k){
  const key=S.main,sn=SNS[key],f=S.f[key],q=postQuality(),st=STYLES[S.style]||STYLES.norm;
  const tg=S.trend.g===S.genre?1.8:1,ts=S.trend.s===key?1.4:1;
  const posts=8*k;
  const base=f*(.06+q/500)*sn.reach;
  let disc=(q*q/100)*18*sn.disc*tg*ts*st.disc*R(.5,1.5)*(S.algo>0?.5:1)*(1+Math.min(Math.sqrt(f),700)/120);
  let views=(base+disc)*posts,discV=disc*posts;
  let buzzed=false;
  if(chance((.006+q/5000)*(tg>1?1.5:1)*Math.min(1,k*2))){const m=R(4,16);views+=discV*m;discV*=m+1;buzzed=true}
  let nf=discV*(.005+q/15000)*sn.conv+base*posts*.0008;
  nf*=Math.max(0,1-f/sn.cap);
  if(q<25)nf-=f*.01*k;
  S.f[key]=Math.max(0,f+nf);
  const monet=f>=sn.mon;
  const money=monet?Math.round(views*sn.rpm):0;
  if(money)inc('sns',money);
  S.mo.views+=views;S.mo.newF+=nf;S.mo.posts+=k;S.stats.views+=views;
  ad('mental',-.45*k);ad('health',-.15*k);ad('tal.'+S.genre,.4*k);ad('edit',.35*k);
  for(const s in GENRES[S.genre].w)if(s!=='know')ad(s,.25*k);
  if(buzzed){S.mo.buzz++;S.stats.buzz++;log(`投稿がバズった！ ${num(views)}回再生`,'sns');pop('バズった！','f');snd('buzz');if(S.stats.buzz===1)tl('初めてバズった')}
  const fp=(.0005+st.fl+Math.max(0,60-S.p.rep)/8000)*sn.flame*k*(f>300?1:.2);
  if(chance(fp)&&!S.q.includes('flame')&&!(S.cd.flame!=null&&S.am-S.cd.flame<6)){S.q.push('flame');S.mo.flame++}
  if(S.flags.noSide&&S.st==='work'&&chance(.03*k)&&!S.q.includes('w_fired'))S.q.push('w_fired');
}
function kidChannelTick(k){
  if(!S.kc.on||age()>=13)return;
  S.kc.f+=(30+S.kc.f*.025)*R(.4,1.6)*k;
  if(chance(.02*k)){S.kc.f+=RI(1000,15000);log('家族チャンネルの動画がバズったらしい','sns')}
  if(age()>=6)inc('kc',Math.round(S.kc.f*.02*k*(S.kc.share?3:1)));
  ad('priv',-.4*k);
}
function newTrend(){const gs=Object.keys(GENRES),ss=Object.keys(SNS).filter(x=>x!=='tsubu'||chance(.5));S.trend={g:pick(gs),s:pick(ss),until:S.am+RI(4,9)}}

// ===== 1ターン =====
function turn(){
  if(!S||!S.alive||modalOpen())return;
  const k=S.unit==='week'?.25:1;
  const f0=totalF(),m0=S.money;
  if(S.auto)autoPlan();
  ensurePlan();
  if(age()<6){ad('happy',1*k);ad('tal.'+pick(TALK),.9*k);ad('social',.3*k)}
  else for(const a of S.plan){const ac=ACT[a];if(ac&&ac.ok())ac.f(k)}
  if(S.st==='school'){ad('know',1.1*k);ad('social',.4*k)}
  else if(S.st==='univ'){ad('know',1.3*k);ad('social',.4*k)}
  else if(S.st==='work'){ad('know',.3*k);ad('mental',-.5*k)}
  kidChannelTick(k);
  let monthEnd=true;
  if(S.unit==='week'){S.wk=(S.wk||0)+1;if(S.wk<4)monthEnd=false;else S.wk=0}
  if(monthEnd)endMonth();
  if(!S.alive)return;
  const df=totalF()-f0,dm=S.money-m0;
  if(Math.abs(df)>=1)pop((df>0?'+':'')+num(df)+'人',df>0?'f':'bad');
  if(dm>=1000)setTimeout(()=>pop('+'+yen(dm)),250);
  let ev=null;
  while(S.q.length&&!ev){const e=EV[S.q.shift()];if(e&&(!e.when||e.when()))ev=e}
  if(!ev)ev=rollEvent(k);
  save();render();
  if(ev)showEvent(ev);
}
function endMonth(){
  const a0=age(),lbl=`${S.y}年${S.m}月`;
  S.am++;S.m++;if(S.m>12){S.m=1;S.y++}
  const a=age();
  if(a>=6&&a<18&&S.st==='school')inc('allow',TIERS[S.tier].allow*(a>=13?2:1));
  if(S.st==='work'){inc('job',S.salary);S.salSum+=S.salary}
  if(S.spouse&&S.spouse.inc)inc('family',S.spouse.inc);
  if(a>=65&&S.pension)inc('pension',S.pension);
  if(S.indep)outc('living',livingCost());
  else if(a>=18&&!['univ','school'].includes(S.st))outc('living',30000);
  const kidsN=S.kids.filter(c=>S.am-c.born<22*12).length;if(kidsN)outc('kids',kidsN*35000);
  if(S.debt>0&&S.st!=='univ'&&a>=19){const p=Math.min(S.debt,S.debt>1000000?15000:30000);S.debt-=p;outc('debt',p)}
  if(S.inv>0){S.inv=Math.max(0,S.inv*(1+R(-.035,.045)))}
  if(S.m===4&&S.st==='work')S.salary=Math.round(S.salary*1.02);
  if(S.m===1){S.taxBase=S.yInc;S.yInc=0}
  if(S.m===3&&age()>=18&&S.taxBase>=(S.st==='work'?200000:480000)){if(S.flags.taxAuto){const t=Math.round(S.taxBase*.15);outc('tax',t);log(`確定申告をして税金${yen(t)}を納めた`,'life')}else S.q.push('tax')}
  drift();
  for(const key in S.f){if(!S.open[key])continue;const posted=S.mo.posts>0&&key===S.main;S.f[key]*=posted?.993:.98}
  if(S.rival)S.rival.f=Math.round(S.rival.f*(1+R(.004,.035))+R(5,150));
  if(S.am>=S.trend.until)newTrend();
  if(S.algo>0)S.algo--;
  if(S.pause>0)S.pause--;
  // 予定のイベント
  if(S.st==='univ'&&S.uniEnd&&S.am>=S.uniEnd){S.uniEnd=0;S.q.push('m22')}
  if(S.flags.ronin&&S.am>=S.flags.ronin)S.q.push('ronin2');
  if(S.flags.reemp&&S.am>=S.flags.reemp){delete S.flags.reemp;S.st='retired';S.salary=0;S.job=null;tl('完全に引退した')}
  if(S.flags.cancer==='treat'&&S.flags.cancerEnd&&S.am>=S.flags.cancerEnd){S.flags.cancerEnd=0;S.q.push('h_cured')}
  if(a>=35&&!S.flags.cancer&&chance(clamp(.0006*Math.exp((a-35)*.085),0,.04)/12))S.q.push('h_cancer');
  if(S.money<0&&(S.cd.poorQ==null||S.am-S.cd.poorQ>=12)){S.cd.poorQ=S.am;S.q.push('poor')}
  for(const p of parents()){const pa=p.age0+S.am/12;if(chance(qx(pa,p.role==='母'?'女':'男')/12)){p.alive=false;p.dage=Math.floor(pa);S.deadP=p;S.q.push('l_pdeath')}}
  // 記録
  const tf=totalF();
  S.stats.maxF=Math.max(S.stats.maxF,tf);S.stats.maxM=Math.max(S.stats.maxM,S.money+S.inv-S.debt);
  S.hsum+=S.p.happy;S.hn++;
  if(S.am%3===0)S.hist.push([S.am,Math.round(tf),Math.round(S.money+S.inv-S.debt),Math.round(S.p.happy),Math.round(S.p.health)]);
  const ti=Object.values(S.mo.inc).reduce((s,x)=>s+x,0),to=Object.values(S.mo.out).reduce((s,x)=>s+x,0);
  S.last=Object.assign({},S.mo,{lbl,ti,to,f:tf});
  S.mo=newMo();
  if(a!==a0)birthday(a);
  if(deathCheck())die();
}
function drift(){
  const a=age(),p=S.p;
  const cap=clamp(100-Math.max(0,a-30)*.55,20,100);
  if(p.health<cap)p.health=clamp(p.health+(cap-p.health)*.03);else p.health=clamp(p.health-.4);
  if(a>=45)p.health=clamp(p.health-(a-45)*.006);
  p.mental=clamp(p.mental+(62-p.mental)*.06);
  p.rep=clamp(p.rep+(60-p.rep)*.02);
  p.priv=clamp(p.priv+(85-p.priv)*.01);
  const tgt=35+p.social*.18+p.mental*.22+(S.money<0?-12:4)+(S.spouse?8:0)+Math.min(9,S.kids.length*3)+(S.pet?3:0);
  p.happy=clamp(p.happy+(tgt-p.happy)*.06);
  if(S.money<0){p.health=clamp(p.health-.6);p.mental=clamp(p.mental-1.5)}
  for(const n of [S.partner,S.spouse])if(n)n.rel=clamp(n.rel-.4);
}
function birthday(a){
  if(a===6){S.st='school';S.friends=[mkNpc('友達'),mkNpc('友達')];S.q.push('m6')}
  if(a===13){S.rival={id:'rv',name:pick(RIVALS),role:'ライバル配信者',trait:pick(['負けず嫌い','人当たりがいい','毒舌','努力家']),rel:30,f:RI(200,3000)};S.q.push('m13');if(S.kc.on)S.q.push('m13k')}
  if(a===15&&S.st==='school')S.q.push('m15');
  if(a===18&&S.st==='school')S.q.push('m18');
  if(a===65){S.pension=Math.round(68000+S.salSum*.005481/12);if(S.st==='work')S.q.push('m65')}
  log(`${a}歳の誕生日`,'life');
}
function qx(a,g){const t=g==='女'?MORT_F:MORT_M;for(let i=1;i<t.length;i++){if(a<t[i][0]){const [a0,q0]=t[i-1],[a1,q1]=t[i];const r=(a-a0)/(a1-a0);return Math.exp(Math.log(q0)+(Math.log(q1)-Math.log(q0))*r)}}return t[t.length-1][1]}
function deathCheck(){const h=S.p.health;let m=h<15?5:h<30?2.5:h<50?1.4:h>85?.85:1;if(S.flags.cancer==='untreated')m*=6;else if(S.flags.cancer==='treat')m*=1.8;return chance(qx(S.am/12,S.g)/12*m)}
function causeOf(){const a=age();if(S.flags.cancer)return 'がん';if(a<1)return '生まれつきの病気';if(a<15)return pick(['不慮の事故','病気']);if(a<40)return pick(['不慮の事故','病気','心臓の病気']);if(a<65)return pick(['がん','がん','心臓の病気','脳の病気']);if(a<85)return pick(['がん','心臓の病気','肺炎','脳の病気','老衰']);return pick(['老衰','老衰','心臓の病気','肺炎'])}
function rollEvent(k){
  if(age()<1)return null;
  const spaced=S.lastEv!=null&&S.am-S.lastEv<2;
  const hits=[];
  for(const id in EV){const e=EV[id];if(!e.w)continue;if(e.once&&S.seen[id])continue;if(e.cd&&S.cd[id]!=null&&S.am-S.cd[id]<e.cd)continue;let ok=true;try{ok=!e.when||e.when()}catch(_){ok=false}if(!ok)continue;if(e.w<1&&spaced)continue;if(chance(Math.min(1,e.w*(e.w>=1?1:.3))*k))hits.push(e)}
  const ev=hits.length?pick(hits):null;if(ev&&ev.w<1)S.lastEv=S.am;return ev;
}

// ===== 新しい人生 =====
function newGame(){
  const g=chance(.5)?'男':'女',sur=pick(SURN),first=pick(g==='男'?NAME_M:NAME_F);
  const tal={};for(const k in GENRES)tal[k]=RI(4,22);tal[pick(Object.keys(GENRES))]+=RI(12,24);
  const single=chance(.08);
  const fa={id:'fa',name:sur+' '+pick(ADULT_M),role:'父',trait:pick(TRAITS),rel:60,alive:true,age0:RI(26,40)};
  const mo={id:'mo',name:sur+' '+pick(ADULT_F),role:'母',trait:pick(TRAITS),rel:65,alive:true,age0:RI(25,38)};
  if(single){if(chance(.85))fa.alive=false;else mo.alive=false}
  const sibs=[];const ns=chance(.55)?RI(1,2):0;
  for(let i=0;i<ns;i++){const sg=chance(.5)?'男':'女',older=chance(.5);sibs.push({id:'s'+i,name:sur+' '+pick(sg==='男'?NAME_M:NAME_F),role:older?(sg==='男'?'兄':'姉'):(sg==='男'?'弟':'妹'),trait:pick(NPC_TRAITS),rel:55})}
  const tier=RI(0,4);
  S={v:CFG.ver,g,first,last:sur,name:sur+' '+first,y:CFG.start,m:RI(1,12),am:0,wk:0,unit:'month',
    region:wpick(REGIONS),tier,
    p:{health:RI(72,92),mental:65,happy:60,know:4,social:15,rep:60,priv:92},
    sk:{talk:2,plan:2,edit:0,looks:8},tal,money:0,inv:0,debt:0,
    f:{milu:0,patto:0,tsubu:0},open:{milu:0,patto:0,tsubu:0},snsOpen:0,main:'milu',genre:'talk',style:'norm',
    eq:{cam:0,mic:0,light:0,pc:0,room:0},
    st:'baby',job:null,salary:0,salSum:0,pension:0,edu:null,indep:0,
    fam:{fa:fa.alive?fa:null,mo:mo.alive?mo:null,single},sibs,friends:[],rival:null,partner:null,spouse:null,kids:[],pet:0,
    kc:{on:0,f:0,was:0,likely:[fa,mo].some(p=>p.alive&&p.trait==='目立ちたがり')||chance(.18)},
    lesson:null,plan:[],auto:0,pause:0,algo:0,trend:{g:'game',s:'patto',until:0},
    q:['birth'],seen:{},cd:{},flags:{},log:[],tl:[],hist:[],mo:newMo(),last:null,
    stats:{maxF:0,maxM:0,views:0,buzz:0,flames:0,deals:0},hsum:0,hn:0,yInc:0,taxBase:0,alive:true,look:{hair:pick(['#2a1d16','#3b2a1e','#171717','#5a3a22']),shirt:pick(['#ff5c8a','#3fd6c9','#ffcf3f','#7bdc6b','#b49cff'])}};
  if(!S.fam.fa&&!S.fam.mo){S.fam.mo=mo;mo.alive=true}
  newTrend();
  showScreen('game');setTab('act');render();
  const e=EV[S.q.shift()];showEvent(e);
}

// ===== セーブ =====
function save(){try{if(S&&S.alive)localStorage.setItem(CFG.save,JSON.stringify(S))}catch(e){}}
function loadSaved(){try{const t=localStorage.getItem(CFG.save);if(!t)return null;const o=JSON.parse(t);return o&&o.v===CFG.ver&&o.alive?o:null}catch(e){return null}}
function exportStr(){const j=JSON.stringify(S);return 'NIP1.'+btoa(unescape(encodeURIComponent(j)))}
function importStr(s){try{s=s.trim();if(!s.startsWith('NIP1.'))return null;const o=JSON.parse(decodeURIComponent(escape(atob(s.slice(5)))));if(o&&o.v===CFG.ver&&o.p&&o.am!=null)return o}catch(e){}return null}

// ===== 速度 =====
let speed=0,timer=null,skipping=false;
let resumeAt=0;
function setSpeed(s){speed=s;skipping=false;clearInterval(timer);timer=null;if(s>0)timer=setInterval(()=>{if(S&&S.alive&&!modalOpen()&&Date.now()>=resumeAt)turn()},Math.round(1500/s));renderCtrl()}
function stopBtn(){return (speed>0||skipping)?'<div class="row"><button class="b sm ghost" type="button" data-act="stopauto">自動再生を止める（いまは'+(skipping?'早送り':'▶'.repeat(speed===4?3:speed))+'）</button></div>':''}
function skipToEvent(){if(!S||modalOpen())return;setSpeed(0);skipping=true;renderCtrl();let n=0;const step=()=>{if(!skipping||!S||!S.alive)return;for(let i=0;i<6;i++){if(modalOpen()||!S.alive){skipping=false;renderCtrl();return}turn();n++;if(n>=600){skipping=false;renderCtrl();return}}requestAnimationFrame(step)};step()}

// ===== 音 =====
let AC=null,sndOn=true;
try{sndOn=localStorage.getItem('nipporia-snd')!=='0'}catch(e){}
function snd(type){if(!sndOn)return;try{AC=AC||new (window.AudioContext||window.webkitAudioContext)()}catch(e){return}
  const seq={click:[[660,.035]],coin:[[988,.06],[1319,.12]],buzz:[[523,.07],[659,.07],[784,.07],[1047,.2]],flame:[[220,.14],[165,.26]],ev:[[784,.06],[988,.1]],bad:[[330,.12],[247,.2]],end:[[523,.22],[392,.22],[330,.3],[262,.6]],buy:[[784,.05],[1175,.1]]}[type]||[];
  let t=AC.currentTime+.01;for(const [fq,d] of seq){const o=AC.createOscillator(),g=AC.createGain();o.type='square';o.frequency.value=fq;g.gain.setValueAtTime(.05,t);g.gain.exponentialRampToValueAtTime(.001,t+d);o.connect(g);g.connect(AC.destination);o.start(t);o.stop(t+d+.02);t+=d*.92}}

// ===== モーダル =====
let curEv=null;
const modalOpen=()=>!$('#modal').hidden;
function openModal(html){$('#mcard').innerHTML=html;$('#modal').hidden=false;const b=$('#mcard').querySelector('button');if(b)b.focus({preventScroll:true})}
function closeModal(){$('#modal').hidden=true;$('#mcard').innerHTML='';curEv=null}
function showEventBase(e){
  if(!e)return;
  S.seen[e.id]=1;S.cd[e.id]=S.am;if(typeof META!=='undefined')META.seen[e.id]=1;
  const text=typeof e.text==='function'?e.text():e.text;
  const chs=(typeof e.ch==='function'?e.ch():e.ch)||[['OK',()=>'']];
  curEv={e,chs};
  const life=e.cat==='人生';
  openModal(`<div class="mcat ${life?'life':''}">${esc(e.cat||'できごと')}</div><h2>${esc(e.t)}</h2><p class="mtext">${esc(text)}</p><div class="mch">${chs.map((c,i)=>`<button class="b" type="button" data-ch="${i}">${esc(c[0])}</button>`).join('')}</div>${stopBtn()}`);
  snd(e.id==='flame'?'flame':'ev');
}
const DL_LBL=k=>k in P_KEYS?P_KEYS[k]:k in SK_KEYS?SK_KEYS[k]:k==='money'?'お金':k==='f'?'フォロワー':k.startsWith('tal.')?'素質:'+GENRES[k.slice(4)].n:k.startsWith('rel:')?k.slice(4)+'との仲':k==='rp'?'研究pt':k==='dev'?'まちの発展':k;
function chipsHtml(d){return Object.entries(d).filter(([,v])=>Math.abs(v)>=.5).map(([k,v])=>{const s=k==='money'?(v>0?'+':'-')+yen(Math.abs(v)):k==='f'?(v>0?'+':'')+num(v)+'人':(v>0?'+':'')+Math.round(v);return `<span class="chip ${v>0?'up':'dn'}">${esc(DL_LBL(k))} ${s}</span>`}).join('')}
function choose(i){
  if(!curEv)return;const {e,chs}=curEv;const c=chs[i];if(!c)return;try{chooseHook(e,i,chs)}catch(_){}
  DL={};let res='';try{res=c[1]()||''}catch(err){console.error(err)}const d=DL;DL=null;
  log(`${e.t}：${res||c[0]}`,e.cat==='SNS'?'sns':e.cat==='人生'?'life':(Object.values(d).reduce((s,x)=>s+x,0)<0?'bad':'good'));
  save();render();
  openModal(`<div class="mcat ${e.cat==='人生'?'life':''}">${esc(e.cat||'できごと')}</div><h2>${esc(e.t)}</h2><p class="mtext">${esc(res||c[0])}</p><div class="chips">${chipsHtml(d)}</div><button class="b pri" type="button" data-act="evok">OK</button>${stopBtn()}`);
  snd('click');
}
function evOk(){
  closeModal();
  if(!S||!S.alive)return;
  while(S.q.length){const e=EV[S.q.shift()];if(e&&(!e.when||e.when())){showEvent(e);return}}
  render();
  if(skipping)skipping=false;
  resumeAt=Date.now()+1600;
  renderCtrl();
}

// ===== 終了 =====
function die(){
  S.alive=false;S.cause=causeOf();tl('永眠（'+S.cause+'）');
  setSpeed(0);skipping=false;
  try{localStorage.removeItem(CFG.save)}catch(e){}
  closeModal();snd('end');showEnding();
}
function titlesOf(){
  const st=S.stats,a=age(),hav=S.hn?S.hsum/S.hn:50,t=[];
  if(st.maxF>=1e6)t.push('国民的インフルエンサー');else if(st.maxF>=1e5)t.push('人気クリエイター');else if(st.maxF>=1e4)t.push('中堅配信者');else if(st.maxF>=1000)t.push('小さな人気者');
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
function scoreOf(){const st=S.stats,hav=S.hn?S.hsum/S.hn:50;return Math.max(0,Math.round(Math.log10(st.maxF+1)*1200+Math.max(0,st.maxM)/20000+hav*25+age()*8+st.buzz*30-st.flames*20))}
function showEnding(){
  const st=S.stats,ts=titlesOf(),sc=scoreOf();
  const el=$('#scrEnd');
  el.innerHTML=`<div class="head"><p class="muted">${esc(S.y)}年${esc(S.m)}月</p><h1>${esc(S.name)}の人生</h1><p>享年 ${age()}歳 ／ ${esc(S.cause)}</p><span class="ttl">${esc(ts[0])}</span><p class="muted small">${ts.slice(1).map(esc).join('・')}</p></div>
  <div class="egrid">
    <div class="card"><span>スコア</span><div class="big">${sc.toLocaleString()}</div></div>
    <div class="card"><span>最高フォロワー</span><div class="big">${num(st.maxF)}人</div></div>
    <div class="card"><span>最高資産</span><div class="big">${yen(st.maxM)}</div></div>
    <div class="card"><span>総再生数</span><div class="big">${num(st.views)}回</div></div>
    <div class="card"><span>バズ ／ 炎上</span><div class="big">${st.buzz} ／ ${st.flames}</div></div>
    <div class="card"><span>家族</span><div class="big">${S.spouse?'既婚':'独身'}・子ども${S.kids.length}人</div></div>
  </div>
  <h3>人生の推移</h3>
  <div class="charts"><canvas id="ch1" width="320" height="170"></canvas><canvas id="ch2" width="320" height="170"></canvas><canvas id="ch3" width="320" height="170"></canvas></div>
  <h3>人生年表</h3>
  <ol class="tl">${S.tl.map(([a,t])=>`<li><b>${a}歳</b><span>${esc(t)}</span></li>`).join('')}</ol>
  <h3>共有用の画像</h3>
  <div class="share"><img id="shareImg" alt="人生のまとめ画像"><p class="hint" style="text-align:center">画像を長押し（パソコンは右クリック）で保存できます</p></div>
  <div class="row" style="justify-content:center"><button class="b pri" type="button" data-act="again">もう一度生まれる</button><button class="b" type="button" data-act="totitle">タイトルへ</button></div>`;
  showScreen('end');
  const H=S.hist.length?S.hist:[[0,0,0,60,80]];
  lineChart($('#ch1'),H.map(h=>[h[0]/12,h[1]]),'フォロワー','#ff93b2',v=>num(v));
  lineChart($('#ch2'),H.map(h=>[h[0]/12,h[2]]),'資産','#ffcf3f',v=>num(v));
  lineChart($('#ch3'),H.map(h=>[h[0]/12,h[3]]),'幸福','#7bdc6b',v=>Math.round(v),100);
  $('#shareImg').src=shareCard(ts[0],sc);
  window.scrollTo(0,0);
}
function lineChart(cv,pts,label,col,fmt,fixedMax){
  const c=cv.getContext('2d'),W=cv.width,Hh=cv.height,l=46,r=10,t=24,b=22;
  c.fillStyle='#20234a';c.fillRect(0,0,W,Hh);
  let mn=Math.min(0,...pts.map(p=>p[1])),mx=fixedMax||Math.max(1,...pts.map(p=>p[1]));if(mx===mn)mx=mn+1;
  const xm=Math.max(1,pts[pts.length-1][0]);
  const X=x=>l+(x/xm)*(W-l-r),Y=y=>t+(1-(y-mn)/(mx-mn))*(Hh-t-b);
  c.font='11px DotGothic16, sans-serif';c.fillStyle='#aca9d6';c.fillText(label,8,15);
  c.strokeStyle='#454c8c';c.lineWidth=1;
  for(const v of [mn,(mn+mx)/2,mx]){const y=Math.round(Y(v))+.5;c.beginPath();c.moveTo(l,y);c.lineTo(W-r,y);c.stroke();c.fillText(fmt(v),4,y+4)}
  c.fillText('0歳',l-6,Hh-6);c.fillText(Math.round(xm)+'歳',W-r-30,Hh-6);
  c.beginPath();pts.forEach((p,i)=>{const x=X(p[0]),y=Y(p[1]);i?c.lineTo(x,y):c.moveTo(x,y)});c.lineTo(X(pts[pts.length-1][0]),Y(mn));c.lineTo(X(pts[0][0]),Y(mn));c.closePath();c.fillStyle=col+'33';c.fill();
  c.beginPath();pts.forEach((p,i)=>{const x=X(p[0]),y=Y(p[1]);i?c.lineTo(x,y):c.moveTo(x,y)});c.strokeStyle=col;c.lineWidth=2;c.stroke();
  const e=pts[pts.length-1];c.fillStyle=col;c.fillRect(X(e[0])-3,Y(e[1])-3,6,6);
}
function shareCard(title,sc){
  const cv=document.createElement('canvas');cv.width=600;cv.height=315;const c=cv.getContext('2d');
  c.fillStyle='#191b37';c.fillRect(0,0,600,315);
  c.fillStyle='#454c8c';for(let i=0;i<600;i+=12){c.fillRect(i,0,6,6);c.fillRect(i+6,309,6,6)}
  c.strokeStyle='#ffcf3f';c.lineWidth=4;c.strokeRect(14,14,572,287);
  c.fillStyle='#ffcf3f';c.font='22px DotGothic16, sans-serif';c.fillText(CFG.title,32,52);
  c.fillStyle='#f4f1ff';c.font='30px DotGothic16, sans-serif';c.fillText(S.name+'の人生',32,104);
  c.fillStyle='#aca9d6';c.font='18px DotGothic16, sans-serif';c.fillText(`享年${age()}歳 ／ ${S.region.n}生まれ`,32,136);
  c.fillStyle='#ff5c8a';c.fillRect(32,154,c.measureText(title).width*1.25+28,34);c.fillStyle='#2b0915';c.font='20px DotGothic16, sans-serif';c.fillText(title,46,178);
  c.fillStyle='#f4f1ff';c.font='18px DotGothic16, sans-serif';
  c.fillText(`最高フォロワー ${num(S.stats.maxF)}人`,32,226);c.fillText(`バズ ${S.stats.buzz}回 ／ 炎上 ${S.stats.flames}回`,32,254);
  c.fillStyle='#ffcf3f';c.font='26px DotGothic16, sans-serif';c.fillText(`SCORE ${sc.toLocaleString()}`,350,254);
  c.fillStyle='#aca9d6';c.font='14px DotGothic16, sans-serif';c.textAlign='right';c.fillText('#'+CFG.title,568,288);c.textAlign='left';
  drawPerson(c,470,70,40,3);
  return cv.toDataURL('image/png');
}

// ===== 画面 =====
let tab='act';
function showScreen(n){$('#scrTitle').hidden=n!=='title';$('#scrGame').hidden=n!=='game';$('#scrEnd').hidden=n!=='end'}
function setTab(t){tab=t;document.querySelectorAll('.tab').forEach(b=>b.setAttribute('aria-selected',String(b.dataset.tab===t)));renderPanel()}
function bar(v,cls){return `<div class="bar ${cls||''}"><i style="width:${clamp(v)}%"></i></div>`}
function stLabel(){const a=age();if(a<6)return a<3?'赤ちゃん':'未就学児';switch(S.st){case 'school':return a<12?'小学生':a<15?'中学生':'高校生';case 'univ':return '大学生';case 'work':return '会社員（'+S.job+'）';case 'creator':return '専業クリエイター';case 'free':return S.flags.ronin?'浪人生':'フリーター';case 'retired':return '年金生活';}return ''}
function render(){if(!S)return;renderTop();renderWho();renderPanel();renderLog();renderReport();renderCtrl()}
function renderTop(){$('#tDate').textContent=`${S.y}年${S.m}月${S.unit==='week'?` 第${(S.wk||0)+1}週`:''}`;$('#tAge').textContent=`${age()}歳`;$('#tMoney').textContent=yen(S.money);$('#tFol').textContent=S.snsOpen?`フォロワー ${num(totalF())}`:(S.kc.on?`家族ch ${num(S.kc.f)}`:'SNSは13歳から')}
function renderCtrl(){document.querySelectorAll('[data-spd]').forEach(b=>b.classList.toggle('on',+b.dataset.spd===speed&&!skipping));$('#btnSkip').classList.toggle('on',skipping)}
function renderWho(){
  $('#who').innerHTML=`<div class="nm">${esc(S.name)}</div><div class="sub">${esc(stLabel())} ／ ${esc(S.region.n)}（${esc(S.region.type)}） ／ 実家の暮らし向き：${esc(TIERS[S.tier].l)}</div>
  <div class="mini"><div>健康 ${Math.round(S.p.health)}${bar(S.p.health,'h')}</div><div>メンタル ${Math.round(S.p.mental)}${bar(S.p.mental,'m')}</div><div>幸福 ${Math.round(S.p.happy)}${bar(S.p.happy,'p')}</div></div>`;
}
function renderLog(){$('#log').innerHTML=S.log.slice(0,40).map(([d,t,k])=>`<li class="${k}"><span class="d">${esc(d)}</span>${esc(t)}</li>`).join('')||'<li>まだ何も起きていない。</li>'}
function renderReport(){
  const L=S.last;
  if(!L){$('#report').innerHTML='<div class="hd">月のまとめ</div><div class="muted">1か月たつと、ここに収支やフォロワーの増減が出ます。</div>';return}
  const incs=Object.entries(L.inc).map(([k,v])=>`<span>${INC_LBL[k]||k}</span><span>+${yen(v)}</span>`).join('');
  const outs=Object.entries(L.out).map(([k,v])=>`<span>${OUT_LBL[k]||k}</span><span>-${yen(v)}</span>`).join('');
  $('#report').innerHTML=`<div class="hd">${esc(L.lbl)}のまとめ</div><div class="kv">${incs}${outs}<span>収支</span><span>${L.ti-L.to>=0?'+':''}${yen(L.ti-L.to)}</span>${L.posts?`<span>再生数</span><span>${num(L.views)}回</span><span>フォロワー増減</span><span>${L.newF>=0?'+':''}${num(L.newF)}人</span>`:''}</div>${L.buzz?'<div class="chip up">バズった</div>':''}`;
}
const INC_LBL={allow:'おこづかい',job:'給料',sns:'広告収益',deal:'PR案件',tip:'投げ銭',part:'アルバイト',pension:'年金',family:'配偶者の収入',kc:'家族chのおこづかい',ev:'臨時収入',inherit:'遺産'};
const OUT_LBL={living:'生活費',kids:'子育て',debt:'返済',date:'デート代',shop:'買い物',ev:'臨時出費',tax:'税金',medical:'医療費'};
function actOptions(i){return Object.entries(ACT).filter(([,a])=>a.ok()).map(([k,a])=>`<option value="${k}" ${S.plan[i]===k?'selected':''}>${esc(a.n)}</option>`).join('')}
function renderPanel(){
  if(!S)return;const P=$('#panel');const a=age();let h='';
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
      if(a<18&&a>=6){const opts=lessonOptions();h+=`<div class="grp"><h3>習い事</h3>${opts.length?`<select data-set="lesson" id="lessonSel"><option value="">なし</option>${opts.map(k=>`<option value="${k}" ${S.lesson===k?'selected':''}>${LESSONS[k].n}（月謝 ${num(LESSONS[k].cost)}円・家族が払う）</option>`).join('')}</select>`:'<p class="hint">今の家計では月謝を払う余裕がない。</p>'}</div>`}
      if(S.pause>0)h+=`<p class="hint">活動休止中：あと${S.pause}か月は投稿できない。</p>`;
    }
    h+=`<div class="grp"><h3>時間の進み方</h3><select data-set="unit" id="unitSel"><option value="month" ${S.unit==='month'?'selected':''}>1ターン＝1か月</option><option value="week" ${S.unit==='week'?'selected':''}>1ターン＝1週間（細かく決めたいとき）</option></select><p class="hint">「次へ」で1ターン、▶で自動再生、「イベントまで」で次の出来事まで早送り。</p></div>`;
  }
  else if(tab==='sns'){
    if(!S.snsOpen){
      h+=`<h2>SNS</h2><p class="hint">自分のアカウントは13歳から作れる。それまでは遊びや習い事で素質を貯めよう。</p>`;
      if(S.kc.on)h+=`<div class="card"><div class="hd"><span>家族チャンネル（${esc(S.kc.byName)}が運営）</span></div><div class="big">${num(S.kc.f)}人</div><p class="hint">登録者が増えるほど家計が潤い、おこづかいも増える。そのぶんプライバシーは減っていく。</p></div>`;
      h+=topTalHtml();
    }else{
      const q=postQuality();
      h+=`<h2>SNS</h2><div class="grp">`;
      for(const [k,s] of Object.entries(SNS)){const open=S.open[k],mon=S.f[k]>=s.mon;h+=`<div class="card ${S.main===k?'main':''}"><div class="hd"><span>${s.n}<span class="muted small">（${s.d}）</span></span>${S.trend.s===k?'<span class="chip hot">流行中</span>':''}</div>`+
        (open?`<div class="big">${num(S.f[k])}人</div><div class="row small"><span class="muted">${s.mon===Infinity?'広告収益なし（案件向き）':mon?'収益化済み':`収益化まであと${num(s.mon-S.f[k])}人`}</span>${S.main===k?'<span class="chip">メイン</span>':`<button class="b sm" type="button" data-main="${k}">メインにする</button>`}</div>`:`<button class="b sm" type="button" data-opensns="${k}">アカウントを作る</button>`)+`</div>`}
      h+=`</div><div class="grp"><h3>投稿の方針</h3>
        <label class="slot"><span class="lb">ジャンル</span><select data-set="genre" id="genreSel">${Object.entries(GENRES).map(([k,g])=>`<option value="${k}" ${S.genre===k?'selected':''}>${g.n}（素質${Math.round(S.tal[k])}）${S.trend.g===k?' ★流行':''}</option>`).join('')}</select></label>
        <label class="slot"><span class="lb">スタイル</span><select data-set="style" id="styleSel">${Object.entries(STYLES).map(([k,s])=>`<option value="${k}" ${S.style===k?'selected':''}>${s.n}</option>`).join('')}</select></label>
        <p class="hint">攻めるほど伸びやすいが、炎上しやすい。ツブヤは特に燃えやすい。</p></div>
        <div class="grp"><h3>投稿の質 ${Math.round(q)}</h3>${bar(q,'p')}<p class="hint">スキル・素質・機材・体調で決まる。今の流行：${SNS[S.trend.s].n}の「${GENRES[S.trend.g].n}」</p></div>`;
      if(S.rival)h+=`<div class="card"><div class="hd"><span>ライバル：${esc(S.rival.name)}</span><span class="muted small">${esc(S.rival.trait)}</span></div><div class="kv"><span>相手のフォロワー</span><span>${num(S.rival.f)}人</span><span>自分のフォロワー</span><span>${num(totalF())}人</span></div></div>`;
    }
  }
  else if(tab==='shop'){
    h+=`<h2>機材・部屋</h2><p class="hint">いい機材ほど投稿の質が上がる。所持金：${yen(S.money)}</p><div>`;
    for(const [k,e] of Object.entries(EQ)){const lv=S.eq[k],cur=e.t[lv],nx=e.t[lv+1];h+=`<div class="shop"><div><div>${e.n}：${esc(cur[0])}</div>${nx?`<div class="muted small">次：${esc(nx[0])} ${yen(nx[1])}</div>`:'<div class="muted small">最高レベル</div>'}</div>${nx?`<button class="b sm" type="button" data-buy="${k}" ${S.money<nx[1]?'disabled':''}>買う</button>`:''}</div>`}
    h+=`</div><p class="hint">機材ボーナス：+${Math.round(eqBonus())}</p>`;
  }
  else if(tab==='stat'){
    const rows=(o,keys,cls)=>Object.entries(keys).map(([k,l])=>`<span>${l}</span>${bar(o[k],cls)}<span class="v">${Math.round(o[k])}</span>`).join('');
    h+=`<h2>ステータス</h2><div class="bars">${rows(S.p,P_KEYS)}</div><h3>スキル</h3><div class="bars">${rows(S.sk,SK_KEYS,'g')}</div>`;
    h+=topTalHtml();
    h+=`<h3>お金</h3><div class="kv"><span>所持金</span><span>${yen(S.money)}</span>${S.inv?`<span>投資</span><span>${yen(S.inv)}</span>`:''}${S.debt?`<span>借金・奨学金</span><span>-${yen(S.debt)}</span>`:''}${S.salary?`<span>月給</span><span>${yen(S.salary)}</span>`:''}${S.indep?`<span>生活費（月）</span><span>${yen(livingCost())}</span>`:''}${S.pension?`<span>年金（月）</span><span>${yen(S.pension)}</span>`:''}</div>`;
    h+=`<h3>進路</h3><p class="hint">${esc(stLabel())}${S.edu?'・'+S.edu:''}</p><div class="row">`;
    if(S.st==='work')h+=`<button class="b sm" type="button" data-act="quit">会社を辞めて専業クリエイターになる</button>`;
    if((S.st==='creator'||S.st==='free')&&a>=18&&a<65&&!S.flags.ronin)h+=`<button class="b sm" type="button" data-act="hunt">就職活動をする</button>`;
    if(S.st==='free'&&a>=18&&!S.flags.ronin)h+=`<button class="b sm" type="button" data-act="becomeCreator">専業クリエイターを名乗る</button>`;
    h+=`</div><div id="confirmBox"></div>`;
  }
  else if(tab==='ppl'){
    const list=[...parents(),...S.sibs,...S.friends,S.rival,S.partner,S.spouse].filter(Boolean);
    h+=`<h2>人物</h2><div>${list.map(n=>`<div class="ppl"><div>${esc(n.name)}<div class="r">${esc(n.role)}・${esc(n.trait)}</div></div><div>${bar(n.rel,'p')}<div class="r">仲のよさ ${Math.round(n.rel)}</div></div></div>`).join('')}${S.kids.map(c=>`<div class="ppl"><div>${esc(c.name)}<div class="r">子ども・${Math.floor((S.am-c.born)/12)}歳</div></div><div></div></div>`).join('')}${S.pet?'<div class="ppl"><div>コロ<div class="r">愛犬</div></div><div></div></div>':''}</div>`;
    if(!list.length)h+='<p class="hint">まだ誰もいない。</p>';
  }
  else if(tab==='rec'){
    h+=`<h2>記録</h2><div class="kv"><span>最高フォロワー</span><span>${num(S.stats.maxF)}人</span><span>総再生数</span><span>${num(S.stats.views)}回</span><span>バズ</span><span>${S.stats.buzz}回</span><span>炎上</span><span>${S.stats.flames}回</span><span>PR案件</span><span>${S.stats.deals}件</span></div>
    <h3>人生年表</h3><ol class="tl">${S.tl.slice().reverse().map(([a,t])=>`<li><b>${a}歳</b><span>${esc(t)}</span></li>`).join('')}</ol>
    <h3>セーブ</h3><p class="hint">自動でこのブラウザに保存されている。別の端末に移すときは書き出しを使う。</p><div class="row"><button class="b sm" type="button" data-act="export">セーブデータを書き出す</button><button class="b sm" type="button" data-act="menu">メニュー</button></div>`;
  }
  P.innerHTML=h;
}
function topTalHtml(){return `<h3>素質（生まれつき＋子ども時代に貯めたもの）</h3><div class="bars">${Object.entries(GENRES).map(([k,g])=>`<span>${g.n}</span>${bar(S.tal[k],'g')}<span class="v">${Math.round(S.tal[k])}</span>`).join('')}</div>`}

function showMenu(){
  openModal(`<div class="mcat life">メニュー</div><h2>メニュー</h2><div class="mch">
  <button class="b" type="button" data-act="sound">効果音：${sndOn?'ON':'OFF'}</button>
  <button class="b" type="button" data-act="export">セーブデータを書き出す</button>
  <button class="b" type="button" data-act="credit">出典・クレジット</button>
  <button class="b" type="button" data-act="totitle">タイトルへ戻る（自動保存されています）</button>
  <button class="b pri" type="button" data-act="close">閉じる</button></div>`);
}
function showExport(){openModal(`<div class="mcat life">セーブ</div><h2>セーブデータの書き出し</h2><p class="hint">この文字列をメモ帳などに保存しておくと、別の端末やブラウザで「セーブデータを読み込む」から続きを遊べる。</p><textarea id="expBox" readonly>${esc(exportStr())}</textarea><div class="row"><button class="b pri" type="button" data-act="copyExp">コピー</button><button class="b" type="button" data-act="close">閉じる</button></div>`)}
function showImport(){openModal(`<div class="mcat life">セーブ</div><h2>セーブデータを読み込む</h2><p class="hint">書き出した文字列（NIP1. から始まる）を貼りつけてください。</p><textarea id="impBox" placeholder="NIP1.…"></textarea><p class="hint" id="impMsg"></p><div class="row"><button class="b pri" type="button" data-act="doImport">読み込む</button><button class="b" type="button" data-act="close">閉じる</button></div>`)}
function showCredit(){openModal(`<div class="mcat life">クレジット</div><h2>出典・クレジット</h2><div class="credit">
<p>統計データは以下を参考に、ゲーム用に丸めて加工しています（政府標準利用規約に基づく利用）。</p>
<ul><li>出典：厚生労働省「簡易生命表」を加工して作成（年齢別の死亡確率）</li><li>出典：厚生労働省「国民生活基礎調査」を加工して作成（世帯所得の分布）</li><li>出典：文部科学省「学校基本調査」を加工して作成（大学進学率）</li><li>出典：厚生労働省「賃金構造基本統計調査」を加工して作成（初任給）</li><li>がんの生涯リスク「およそ2人に1人」は、国立がん研究センターが公表している統計に基づく一般的な目安です</li></ul>
<p>フォント：DotGothic16（SIL Open Font License 1.1）</p>
<p>絵と効果音：すべてこのゲームのためにプログラムで描いた・鳴らしたオリジナルです。</p>
<p>このゲームはフィクションです。登場する国・地名・人物・SNS・企業は架空のもので、実在のものとは関係ありません。</p></div>
<button class="b pri" type="button" data-act="close">閉じる</button>`)}
function toast(m){const t=$('#toast');t.textContent=m;t.hidden=false;clearTimeout(toast.t);toast.t=setTimeout(()=>t.hidden=true,2200)}
function pop(text,cls){if(skipping||speed>=4)return;const box=$('#pops');while(box.children.length>=3)box.firstChild.remove();const el=document.createElement('div');el.className='pop '+(cls||'');el.textContent=text;el.style.left=(18+Math.random()*50)+'%';el.style.top=(30+Math.random()*30)+'%';$('#pops').appendChild(el);setTimeout(()=>el.remove(),1700)}

// ===== 操作 =====
document.addEventListener('click',e=>{
  const t=e.target.closest('button');if(!t)return;
  if(t.dataset.ch!=null){choose(+t.dataset.ch);return}
  if(t.dataset.tab){setTab(t.dataset.tab);if(matchMedia('(max-width:860px)').matches)$('#panel').scrollIntoView({block:'start',behavior:'smooth'});return}
  if(t.dataset.spd!=null){snd('click');setSpeed(+t.dataset.spd);return}
  if(t.dataset.main){S.main=t.dataset.main;save();render();return}
  if(t.dataset.opensns){openSns(t.dataset.opensns);log(SNS[t.dataset.opensns].n+'のアカウントを作った','sns');save();render();return}
  if(t.dataset.buy){const k=t.dataset.buy,nx=EQ[k].t[S.eq[k]+1];if(nx&&S.money>=nx[1]){outc('shop',nx[1]);S.eq[k]++;log(`${nx[0]}を買った`,'good');snd('buy');save();render()}return}
  const a=t.dataset.act;if(!a)return;
  switch(a){
    case 'evok':evOk();break;
    case 'close':closeModal();break;
    case 'stopauto':setSpeed(0);skipping=false;renderCtrl();t.closest('.row').innerHTML='<span class="hint">自動再生を止めました</span>';break;
    case 'auto':S.auto=S.auto?0:1;if(S.auto)autoPlan();save();renderPanel();break;
    case 'grow':skipToEvent();break;
    case 'menu':showMenu();break;
    case 'sound':sndOn=!sndOn;try{localStorage.setItem('nipporia-snd',sndOn?'1':'0')}catch(_){}showMenu();break;
    case 'export':showExport();break;
    case 'copyExp':{const box=$('#expBox');const v=box.value;const fb=()=>{box.focus();box.select();toast('選択しました。コピーしてください')};try{navigator.clipboard.writeText(v).then(()=>toast('コピーしました'),fb)}catch(_){fb()}break}
    case 'credit':showCredit();break;
    case 'totitle':closeModal();setSpeed(0);save();S=null;showScreen('title');initTitle();break;
    case 'again':closeModal();newGame();break;
    case 'doImport':{const o=importStr($('#impBox').value);if(!o){$('#impMsg').textContent='読み込めませんでした。NIP1. から始まる文字列を、最後まで貼りつけてください。';break}S=o;closeModal();showScreen('game');setTab('act');render();toast('読み込みました');break}
    case 'quit':$('#confirmBox').innerHTML=`<div class="card"><p class="hint">本当に会社を辞める？ 給料がなくなり、収入はSNSだけになる。</p><div class="row"><button class="b sm pri" type="button" data-act="quitYes">辞める</button><button class="b sm" type="button" data-act="cancel">やめておく</button></div></div>`;break;
    case 'quitYes':S.st='creator';S.job=null;S.salary=0;tl('会社を辞めて専業クリエイターに');log('会社を辞めた','life');save();render();break;
    case 'becomeCreator':S.st='creator';tl('専業クリエイターを名乗った');save();render();break;
    case 'cancel':$('#confirmBox').innerHTML='';break;
    case 'hunt':S.offers=null;showEvent(EV.jobhunt);break;
  }
});
document.addEventListener('change',e=>{
  const t=e.target;if(!S)return;
  if(t.dataset.plan!=null){S.plan[+t.dataset.plan]=t.value;save();renderPanel();return}
  const k=t.dataset.set;if(!k)return;
  if(k==='lesson')S.lesson=t.value||null;
  if(k==='unit'){S.unit=t.value;S.wk=0}
  if(k==='genre')S.genre=t.value;
  if(k==='style')S.style=t.value;
  save();render();
});
$('#btnNext').addEventListener('click',()=>{setSpeed(0);turn()});
$('#btnSkip').addEventListener('click',()=>{skipping?(skipping=false,renderCtrl()):skipToEvent()});
$('#btnMenu').addEventListener('click',()=>showMenu());
$('#btnNew').addEventListener('click',()=>{snd('click');showSetup()});
$('#btnCont').addEventListener('click',()=>{const o=loadSaved();if(!o)return;S=o;showScreen('game');setTab('act');render()});
$('#btnImport').addEventListener('click',()=>showImport());
$('#btnCredit').addEventListener('click',()=>showCredit());
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&modalOpen()&&!curEv)closeModal();if(e.key==='p'&&S&&!$('#scrGame').hidden){setSpeed(speed?0:1)}});

// ===== ドット絵 =====
const cv=$('#room'),cx=cv.getContext('2d');let fr=0;
function px(c,x,y,w,h,col){c.fillStyle=col;c.fillRect(x|0,y|0,w|0,h|0)}
function drawPerson(c,x,y,hgt,s){
  // x,y=足元。hgt=身長(px)。s=拡大率
  s=s||1;const a=S?age():20,elder=a>=65,hair=elder?'#c9c9d6':(S?S.look.hair:'#2a1d16'),shirt=S?S.look.shirt:'#ff5c8a',skin='#f2c39d';
  const H=hgt,head=Math.max(5,Math.round(H*.36)),bw=Math.max(5,Math.round(H*.34));
  const hx=x-head/2,hy=y-H;
  px(c,(x-bw/2)*1,y-H+head,bw,H-head-Math.round(H*.18),shirt);
  px(c,x-bw/2+1,y-Math.round(H*.18),Math.max(2,bw/2-1),Math.round(H*.18),'#2e3360');px(c,x+1,y-Math.round(H*.18),Math.max(2,bw/2-1),Math.round(H*.18),'#2e3360');
  px(c,hx,hy,head,head,skin);px(c,hx,hy,head,Math.max(2,Math.round(head*.35)),hair);
  if(S&&S.g==='女'&&a>=3)px(c,hx-1,hy,2,head*.9,hair),px(c,hx+head-1,hy,2,head*.9,hair);
  const blink=(fr%60)<3;px(c,hx+head*.25,hy+head*.5,1*s>1?s:1,blink?1:2,'#1a1a2a');px(c,hx+head*.65,hy+head*.5,1*s>1?s:1,blink?1:2,'#1a1a2a');
}
function drawRoomClassic(){
  fr++;
  if(!S||$('#scrGame').hidden){return}
  const c=cx,e=S.eq,a=age();
  const walls=['#8d7bb0','#7c70b4','#5b67a8','#3c4072'];
  px(c,0,0,160,100,walls[Math.min(3,e.room)]);
  if(e.room>=3){for(let y=6;y<70;y+=8)for(let x=((y/8)|0)%2*4;x<160;x+=8)px(c,x,y,4,4,'#33365f')}
  if(e.room>=1&&e.room<3){px(c,96,8,58,46,'#c45a7a');for(let x=98;x<152;x+=6)px(c,x,8,2,46,'#b04c6c')}
  const sky=[,'#9fb8e8','#a9c3ee','#b9d7f2','#8fd0f0','#7cc4ef','#6db7e8','#ffb070','#ffc080','#9fc0e8','#d8a070','#a0a8d0','#8a96c8'][S.m];
  px(c,8,10,36,30,'#2b2b4a');px(c,10,12,32,26,sky);px(c,25,12,2,26,'#2b2b4a');px(c,10,24,32,2,'#2b2b4a');
  if(S.m===12||S.m<=2){for(let i=0;i<6;i++)px(c,12+((i*7+fr/4)%28),12+((i*11+fr/3)%24),1,1,'#ffffff')}
  if(e.room>=2){px(c,52,18,32,3,'#4a3526');px(c,55,10,6,8,'#ffcf3f');px(c,63,12,5,6,'#3fd6c9');px(c,70,11,7,7,'#ff5c8a');if(S.stats.maxF>=1e5){px(c,78,8,5,10,'#d8d8e8')}}
  px(c,0,74,160,26,'#6b4f3a');for(let x=0;x<160;x+=16)px(c,x,74,1,26,'#5a412f');px(c,0,74,160,2,'#4a3526');
  // 机
  px(c,92,58,62,4,'#a0714f');px(c,94,62,3,12,'#7a5238');px(c,149,62,3,12,'#7a5238');
  const onAir=S.snsOpen&&S.plan.includes('post')&&!(S.pause>0)&&a>=13;
  // PC
  const glow=onAir&&(fr>>2)%2?'#9ff':'#6cc';
  if(e.pc===0){px(c,128,50,16,8,'#888');px(c,129,51,14,6,'#5a7')}
  else if(e.pc===1){px(c,126,48,20,10,'#444');px(c,127,49,18,7,glow)}
  else{px(c,120,38,28,18,'#222');px(c,121,39,26,15,glow);px(c,132,56,4,2,'#222');px(c,148,40,8,18,'#222');px(c,149,42,6,1,['#ff5c8a','#3fd6c9','#ffcf3f'][(fr>>3)%3]);if(e.pc>=3){px(c,100,40,18,14,'#222');px(c,101,41,16,11,'#6cc')}}
  // カメラ
  if(e.cam===1)px(c,132,35,5,3,'#111');
  if(e.cam>=2){px(c,104,46,1,12,'#333');px(c,100,42,9,6,'#222');px(c,98,44,3,2,'#555');if(e.cam>=3)px(c,96,41,4,5,'#111')}
  // 照明
  if(e.light===1){c.strokeStyle='#fff8d0';c.lineWidth=2;c.beginPath();c.arc(112,30,6,0,7);c.stroke();px(c,112,36,1,22,'#555')}
  if(e.light>=2){px(c,80,26,12,10,'#fff6d8');px(c,85,36,1,38,'#555');if(e.light>=3){px(c,150,22,8,10,'#fff6d8')}}
  // マイク
  if(e.mic===1)px(c,118,54,2,4,'#333');
  if(e.mic>=2){px(c,114,44,1,14,'#444');px(c,112,42,4,4,'#222')}
  if(e.mic>=3){for(let y=10;y<34;y+=4)px(c,4,y+40,3,3,'#2a2d55')}
  // 人
  const bob=(fr>>4)%2;
  let H=a<1?8:a<3?11:a<6?14:a<13?18:a<18?22:24;
  if(onAir&&a>=13){px(c,108,62,12,2,'#333');px(c,113,64,2,10,'#333');drawPerson(c,114,66-bob*0,H*.78)}
  else if(a<3){px(c,52,82,14,6,'#e8d0f0');drawPerson(c,60,84,H)}
  else drawPerson(c,64,92-bob,H);
  // ペット
  try{drawDeco(c)}catch(_){}
  if(S.pet){const dx=30+Math.sin(fr/20)*8;px(c,dx,86,9,5,'#c08a4a');px(c,dx+7,83,4,4,'#c08a4a');px(c,dx+9,84,1,1,'#111')}
  // REC / ON AIR
  if(S.kc.on&&a<13&&(fr>>3)%2){px(c,4,4,5,5,'#ff5a4e');c.fillStyle='#fff';c.font='7px sans-serif';c.fillText('REC',11,9)}
  if(onAir&&(fr>>3)%2){px(c,116,2,40,9,'#ff5a4e');c.fillStyle='#fff';c.font='7px sans-serif';c.fillText('ON AIR',121,9)}
}
function drawLogoClassic(){const c=$('#logoCv').getContext('2d');px(c,0,0,160,80,'#20234a');for(let i=0;i<14;i++)px(c,(i*37)%160,(i*23)%60,2,2,'#454c8c');px(c,58,8,44,66,'#111');px(c,61,12,38,56,'#3fd6c9');px(c,64,16,32,22,'#ff5c8a');px(c,70,20,8,8,'#ffcf3f');px(c,80,22,12,2,'#fff');px(c,80,26,8,2,'#fff');for(let i=0;i<4;i++)px(c,66+i*8,42,6,6,i%2?'#ffcf3f':'#fff');px(c,66,52,28,3,'#191b37');px(c,66,58,20,3,'#191b37');px(c,20,40,6,6,'#ff5c8a');px(c,26,40,6,6,'#ff5c8a');px(c,20,46,12,6,'#ff5c8a');px(c,23,52,6,3,'#ff5c8a');px(c,124,30,10,2,'#ffcf3f');px(c,128,26,2,10,'#ffcf3f');px(c,134,48,8,2,'#fff');px(c,137,45,2,8,'#fff')}
let lastT=0;function loopClassic(t){if(t-lastT>110){lastT=t;try{drawRoom()}catch(err){}}requestAnimationFrame(loop)}

function applyTitle(){document.title=CFG.title;const t=esc(CFG.title);$('#gameTitle').innerHTML=CFG.titleBreak&&t.includes(CFG.titleBreak)?t.replace(CFG.titleBreak,CFG.titleBreak+'<br>'):t}
function initTitle(){applyTitle();const has=!!loadSaved();$('#btnCont').disabled=!has;$('#btnCont').textContent=has?'つづきから':'つづきから（セーブなし）'}
initTitle();setTimeout(()=>{try{drawLogo()}catch(_){}requestAnimationFrame(loop)},0);
