
// ===== v3.5：失敗の仕組み（予定の行動・交流・事業） =====
// 起きやすさ：能力・素質と体調（健康・メンタル）＋慣れ（続けるほど失敗しにくい）。軽量は半分。
// 重さ：ふつうの失敗（その月の成果が少しだけ）と、まれに大きな失敗（けが・ケンカ・炎上・リコールなど）。
function nareOf(k){S.nare=S.nare||{};return S.nare[k]||0}
function nareAdd(k,v){S.nare=S.nare||{};S.nare[k]=Math.min(240,(S.nare[k]||0)+v)}
function stv(k){if(!S)return 50;if(k.startsWith('tal.'))return Math.min(100,(S.tal&&S.tal[k.slice(4)])||0);if(S.p&&k in S.p)return S.p[k]||0;if(S.sk&&k in S.sk)return S.sk[k]||0;return 50}
function condMul(){const h=(S.p&&S.p.health)||60,m=(S.p&&S.p.mental)||60;return 1+Math.max(0,50-h)/60+Math.max(0,50-m)/50}
function nareMul(k){return Math.max(.5,1/(1+nareOf(k)/18))}
function failP(base,skill,key){let p=base*1.5*clamp(1.6-skill/100*1.1,.5,1.6)*condMul()*nareMul(key)*(isLite()?.5:1);return Math.min(.6,p)}
function bigShare(skill){return clamp(.18-skill/100*.12,.05,.18)}
// 0=成功 1=失敗 2=大失敗
function failRoll(base,skill,key){if(!S||age()<6)return 0;const p=failP(base,skill,key);if(!chance(p))return 0;return chance(bigShare(skill))?2:1}
function failLvl(base,skill,key){const p=failP(base,skill,key);return p<.035?0:p<.08?1:2}
const FAIL_LV=['失敗しにくい','ふつう','失敗しやすい'];
function fNote(t,big){log((big?'💥 ':'')+t,'bad');try{S.mo.fail=(S.mo.fail||0)+1;S.stats.fail=(S.stats.fail||0)+1;if(big)S.stats.bigFail=(S.stats.bigFail||0)+1}catch(_){}}

// ----- 予定の行動 -----
const FA={
 study:[.10,()=>stv('know'),'勉強がはかどらなかった',()=>{ad('mental',-8);return '勉強で大きくつまずいて、自信をなくした'}],
 homework:[.06,()=>stv('know'),'宿題がうまく進まなかった',()=>{ad('mental',-6);return '宿題を忘れて、先生にしかられた'}],
 lesson:[.10,()=>{try{const l=LESSONS[S.lesson];return l.tal.reduce((a,t)=>a+stv('tal.'+t),0)/l.tal.length}catch(_){return 40}},'習い事でうまくできなかった',()=>{ad('mental',-7);ad('health',-3);return '習い事の発表で大失敗して、落ちこんだ'}],
 practice:[.10,()=>(stv('plan')+stv('edit'))/2,'練習がうまくいかなかった',()=>{ad('mental',-7);return '作った企画がまったく形にならず、時間をむだにした'}],
 talkp:[.10,()=>(stv('talk')+stv('looks'))/2,'練習がうまくいかなかった',()=>{ad('mental',-7);return '人前で大失敗して、はずかしい思いをした'}],
 part:[.08,()=>(stv('social')+stv('health'))/2,'アルバイトでミスをした',()=>{const c=Math.round(30000*Math.max(.3,S.cty.inc));outc('shop',c);ad('mental',-5);return `アルバイトで大きなミスをして、弁償した（${yen(c)}）`}],
 side:[.10,()=>stv('edit'),'副業の仕事がうまくいかなかった',()=>{ad('rep',-1);ad('mental',-5);return '副業で納品トラブルを起こして、信用を失った'}],
 exercise:[.07,()=>stv('health'),'運動が空回りした',()=>{ad('health',-12);ad('happy',-3);return '運動中にけがをしてしまった'}],
 friends:[.06,()=>stv('social'),'友達と気まずくなった',()=>{const n=pick(S.friends||[]);if(n)rel(n,-10);ad('happy',-3);return n?`${n.name}とケンカしてしまった`:'友達とケンカしてしまった'}],
 date:[.08,()=>{const l=lover();return l?l.rel:30},'デートがいまひとつだった',()=>{const l=lover();if(l)rel(l,-12);ad('happy',-4);return 'デートでケンカになってしまった'}],
 family:[.04,()=>stv('happy'),'家族と少しすれちがった',()=>{relP(-6);ad('happy',-3);return '家族と言いあいになってしまった'}],
 parenting:[.06,()=>stv('social'),'子育てがうまくいかなかった',()=>{for(const c of (S.kids||[]))c.bond=Math.max(0,(c.bond||50)-5);ad('mental',-5);return '子どもとぶつかってしまった'}],
 shophelp:[.06,()=>stv('social'),'お店でミスをした',()=>{ad('rep',-1);try{for(const t of S.town.tiles)if(SHOP[t.t])t.stars=Math.max(1,(t.stars||3)-.3)}catch(_){}return 'お店で大きなクレームを受けた'}],
 play:[.03,()=>stv('happy'),'遊びがあまり楽しめなかった',()=>{ad('health',-6);return '遊んでいてけがをした'}],
 chores:[.04,()=>stv('happy'),'お手伝いで失敗した',()=>{ad('happy',-3);return 'お手伝いでお皿を割ってしまった'}],
 kidvideo:[.04,()=>stv('happy'),'動画ごっこがうまくいかなかった',()=>{ad('happy',-3);return '撮影ごっこで機械をこわしてしまった'}],
 base:[.04,()=>stv('social'),'秘密基地づくりがうまくいかなかった',()=>{ad('health',-6);return '秘密基地づくりでけがをした'}]
};
let FDEPTH=0;
function failWrap(a,f){return function(k){if(FDEPTH||!S||!FA[a])return f.apply(this,arguments);FDEPTH++;try{const d=FA[a],sk=d[1]();const r=failRoll(d[0]*Math.min(1,k||1),sk,a);
  if(r===0){nareAdd(a,k||1);return f.apply(this,arguments)}
  nareAdd(a,(k||1)*1.5);
  if(r===1){f.call(this,(k||1)*.25);ad('mental',-1);fNote(d[2]+'（失敗から少し学んだ）',false)}
  else{fNote(d[3](),true)}}finally{FDEPTH--}}}
for(const [a,ac] of Object.entries(ACT)){if(!FA[a])continue;ac.f=failWrap(a,ac.f);if(ac.opts)for(const o of ac.opts)if(o.f)o.f=failWrap(a,o.f)}

// ----- 投稿 -----
let PQ_PEN=0;
{const _pq97=postQuality;postQuality=function(){return _pq97.apply(this,arguments)-PQ_PEN}}
{const _dp97=doPost;doPost=function(k){if(!S||PQ_PEN)return _dp97.apply(this,arguments);let q=50;try{q=postQuality()}catch(_){}const r=failRoll(.10*Math.min(1,k||1),q,'post');
 if(r===0){nareAdd('post',k||1);return _dp97.apply(this,arguments)}
 nareAdd('post',(k||1)*1.5);PQ_PEN=r===2?45:28;try{_dp97.apply(this,arguments)}finally{PQ_PEN=0}
 if(r===1)fNote('今月の投稿は企画がすべって、あまり見られなかった',false);
 else{const key=S.main;if(!S.q.includes('flame')&&!(S.cd.flame!=null&&S.am-S.cd.flame<6)&&(S.f[key]||0)>300){S.q.push('flame');S.mo.flame++;fNote('投稿の内容が誤解されて、炎上しそう……',true)}else{S.f[key]=Math.max(0,(S.f[key]||0)*.985);ad('rep',-2);fNote('投稿で大失敗して、フォロワーが離れた',true)}}}}

// ----- 交流 -----
const FK={talk:.05,out:.07,gift:.06,date:.08,trip:.08,play:.03,study:.05,fam:.05};
document.addEventListener('click',e=>{const b=e.target.closest('[data-kr]');if(!b||!S||b.disabled)return;const k=b.dataset.kr,id=b.dataset.kid;if(k==='newf'||!FK[k])return;
 const K=kOf();if(kLeft()<=0||K.did[id])return;const A=K_ACT[k];if(!A)return;const cc=kCost(k);if(S.money<cc)return;
 let n=null,kid=null;if(k==='play'||k==='study'){kid=(S.kids||[]).find(x=>'kid:'+x.name+x.born===id);if(!kid)return}else if(k!=='fam'){n=kFind(id);if(!n)return}
 const relv=kid?(kid.bond||50):n?(n.rel||40):60;const sk=stv('social')*.6+relv*.4;const nk='k:'+id;const r=failRoll(FK[k],sk,nk);
 if(r===0){nareAdd(nk,1);return}
 e.stopImmediatePropagation();e.preventDefault();nareAdd(nk,1.5);if(cc)outc(k==='date'||k==='trip'?'date':'shop',cc);
 const who=kid?kid.name:n?n.name:'家族';
 if(r===1){if(n)rel(n,-1);ad('mental',-1);toast(`${who}と${A[0]==='話す'?'話した':A[0]+'をした'}けれど、うまくかみ合わなかった`);fNote(`${who}との${A[0]}が、うまくいかなかった`,false)}
 else{if(n)rel(n,-8);if(kid)kid.bond=Math.max(0,(kid.bond||50)-6);if(k==='fam')relP(-5);ad('happy',-3);ad('mental',-3);toast(`${who}とケンカになってしまった……`);fNote(`${who}とケンカになってしまった`,true)}
 K.n++;K.did[id]=1;save();renderPanel()},true);

// ----- 事業 -----
function bizSkill(){return Math.min(100,30+resDoneAll()*.25+(S.p.know||0)*.2+(S.megaN||0))}
// お店：トラブル（品切れ・クレーム）／大きな失敗（休業）
let SHOPF_AM=-1,SHOPF_N=0;
{const _sc97=shopCalc;shopCalc=function(i,commit){const r=_sc97.apply(this,arguments);if(!commit||!r||!S)return r;try{const t=S.town.tiles[i],s=SHOP[t.t];if(!s)return r;t.fm=(t.fm||0)+1;
 const sk=clamp((t.stars||3)*12+(t.staff>=r.need?15:0)+bizSkill()*.4,0,100);const x=failRoll(.03,sk,'shop');if(!x)nareAdd('shop',.05);
 if(x){const nm=s.n||'お店';if(SHOPF_AM!==S.am){SHOPF_AM=S.am;SHOPF_N=0}SHOPF_N++;
  if(x===1){r.sales=Math.round(r.sales*.6);r.profit=r.sales-r.cost;t.stars=Math.max(1,t.stars-.15);if(SHOPF_N<=2)fNote(`「${nm}」で品切れやクレームがあり、売上が落ちた`,false)}
  else{r.sales=0;r.profit=-r.cost;t.stars=Math.max(1,t.stars-.8);ad('rep',-1);if(SHOPF_N<=2)fNote(`「${nm}」で大きなトラブルがあり、今月は休業した`,true)}}}catch(e){console.error(e)}return r}}
// 会社：新しい商品の不具合（発売延期）／リコール
{const _pr97=prodRelease;prodRelease=function(c){try{const a=c.pr&&c.pr.act;if(a&&!a.fchk){a.fchk=1;const P=PROD[c.k];const sk=clamp(c.lv*6+((P&&P.sk)?P.sk()*.3:0)+bizSkill()*.4,0,100);const x=failRoll(.12,sk,'prod:'+c.id);
  if(x===1){a.dur+=RI(2,4);fNote(`「${c.name}」の${P.lbl}「${a.it}」に不具合が見つかり、発売を延期した`,false);return}
  if(x===2){const r=_pr97.apply(this,arguments);try{const h=c.pr.hist[0];if(h){h.q=Math.min(h.q,8)}const s=c.pr.sales[c.pr.sales.length-1];if(s)s.amt*=.1;outc('co',Math.round(a.cost*.3));ad('rep',-3);c.val=Math.round(c.val*.95)}catch(_){}
   fNote(`「${c.name}」の${P.lbl}「${a.it}」で大きな欠陥が見つかり、回収することになった`,true);return r}
  nareAdd('prod:'+c.id,1)}}catch(e){console.error(e)}return _pr97.apply(this,arguments)}}
// サービス：障害／大きな障害
{const _sv97=svcMonth;svcMonth=function(){try{for(const s of (S.svcs||[])){const sk=clamp((s.q||40)*.6+bizSkill()*.4,0,100);const nk='svc:'+s.t;const x=failRoll(.02,sk,nk);if(!x)nareAdd(nk,1);
  if(x===1){s.q=clamp((s.q||40)-6,5,100);s.users=Math.round((s.users||0)*.96);fNote(`サービス「${s.n||SVCT[s.t].n}」で障害が起き、利用者が少し減った`,false)}
  else if(x===2){s.q=clamp((s.q||40)-15,5,100);s.users=Math.round((s.users||0)*.8);ad('rep',-3);fNote(`サービス「${s.n||SVCT[s.t].n}」で大きな障害が起き、利用者が大きく減った`,true)}}}catch(e){console.error(e)}return _sv97.apply(this,arguments)}}
// 会社の経営：取引のトラブル／不祥事、大計画：工事の遅れ／事故
{const _mh97=monthHook11;monthHook11=function(){const r=_mh97.apply(this,arguments);try{if(!S||!S.alive)return r;
 for(const c of (S.cos||[])){const mor=(c.emp&&c.emp.mor)||60;const sk=clamp(mor*.5+c.lv*3+bizSkill()*.3,0,100);const nk='co:'+c.id;const x=failRoll(.012,sk,nk);if(!x)nareAdd(nk,1);
  if(x===1){const v=Math.round(Math.max(0,c.last||0)*.4);if(v)outc('co',v);fNote(`「${c.name}」で取引先とのトラブルがあり、損をした`,false)}
  else if(x===2){c.val=Math.round((c.val||0)*.88);if(c.emp)c.emp.mor=Math.max(0,mor-12);ad('rep',-3);fNote(`「${c.name}」で不祥事が起き、会社の評価が下がった`,true)}}
 for(const x0 of (S.mega||[])){if(x0.done)continue;const m=MEGA[x0.k];if(!m)continue;const sk=clamp(bizSkill(),0,100);const x=failRoll(.02,sk,'mega');
  if(x===1){x0.dur+=RI(2,5);fNote(`大計画「${m.n}」の工事が遅れている`,false)}
  else if(x===2){x0.dur+=RI(8,14);const c=Math.round(megaCost(m)*.05);if(S.money>=c)outc('mega',c);ad('rep',-4);fNote(`大計画「${m.n}」で事故が起き、工事が止まった`,true)}}
 nareAdd('mega',.2)}catch(e){console.error(e)}return r}}

// ----- 予定の画面：うまくいく見こみ -----
function failHtml(){if(!S||age()<6||!S.plan)return '';const ks=[...new Set(S.plan)].filter(a=>FA[a]||a==='post');if(!ks.length)return '';
 const row=a=>{let lv;if(a==='post'){let q=50;try{q=postQuality()}catch(_){}lv=failLvl(.10,q,'post')}else lv=failLvl(FA[a][0],FA[a][1](),a);const n=(ACT[a]&&ACT[a].n)||a;return `<span class="chip ${lv===0?'up':lv===2?'dn':''}">${esc(n)}：${FAIL_LV[lv]}</span>`};
 const tips=[];if((S.p.health||60)<50)tips.push('健康');if((S.p.mental||60)<50)tips.push('メンタル');
 return `<details class="pmore"><summary>うまくいく見こみ</summary><div class="row wrap">${ks.map(row).join(' ')}</div><p class="hint small">行動には失敗することがあります。能力を上げる・同じことを続けて慣れる・体調を整えると、失敗しにくくなります。${tips.length?`いまは${tips.join('と')}が低いので、失敗しやすくなっています。`:''}</p></details>`}
{const _pp97=panelPlan;panelPlan=function(){let h=_pp97.apply(this,arguments);try{const f=failHtml();if(f)h+=f}catch(e){console.error(e)}return h}}

// 遊び方
(function(){const g=GUIDE.find(x=>x[0]==='act');if(g&&!/失敗/.test(g[2]))g[2]+='\n・行動・交流・事業には、失敗することがあります。能力を上げる、同じことを続けて慣れる、体調を整えると、失敗しにくくなります（「うまくいく見こみ」で目安を見られます）。';
 const l=GUIDE.find(x=>x[0]==='lite');if(l&&!/失敗/.test(l[2]))l[2]=l[2].replace('・出来事は少なめです。','・出来事と失敗は少なめです。')})();
// 昔の版で遊ぶ：v3.4 を追加
try{if(!OLD_VERS.some(v=>v[1]==='versions/v3.4/'))OLD_VERS.unshift(['v3.4','versions/v3.4/','軽量モードが入った版'])}catch(_){}
