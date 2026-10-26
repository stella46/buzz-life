
// ===== v3.0.10：50歳からの伸びをゆるやかに（工夫すると1回の人生で大計画が全部そろう。おまかせだけだと半分〜7割くらい） =====
const MKT_EXP=.4;
marketMul=function(){try{return Math.max(1,Math.pow((worldPop()+alienPop())/WORLD_POP,MKT_EXP))}catch(_){return 1}};
// おまかせの管理には手数料がかかる（自分で管理するほうが、もうかる）
{const _inc83=inc;inc=function(cat,v){try{if(v>0&&S&&S.omk){if(cat==='co'&&S.omk.co)v=Math.round(v*.5);else if(cat==='mega'&&S.omk.mega)v=Math.round(v*.5)}}catch(_){}return _inc83.call(this,cat,v)}}
// 会社は、すぐには大きくならない（大きくするたびに、次まで時間がかかる）
function coGap(lv){return lv<4?6:lv<8?12:24}
function coWait(c){const g=coGap(c.lv);return Math.max(0,(c.lvAm==null?-9999:c.lvAm)+g-S.am)}
{let NOCO=0;const _omk83=omk;omk=function(k){if(NOCO&&k==='co')return false;return _omk83.apply(this,arguments)};
 const _om83=omkMonth;omkMonth=function(){NOCO=1;let r;try{r=_om83.apply(this,arguments)}finally{NOCO=0}
  try{if(S&&omk('co')&&age()>=20){const ci=Math.max(.2,S.cty.inc);for(const c of (S.cos||[])){coInit(c);c.emp.auto=1;if(c.pmode==='manual')c.pmode='auto';if(coWait(c)>0||c.lv>=12)continue;
   if(c.lv<8){const up=Math.round(COS[c.k].c*c.lv*ci);if(S.money*.015>=up){outc('co',up);c.cap+=COS[c.k].c*c.lv;c.lv++;c.lvAm=S.am;c.val+=Math.round(COS[c.k].c*(c.lv-1)*.9);log(`おまかせ：「${c.name}」Lv${c.lv}`,'life')}}
   else{const cst=lvUpCost(c);if(S.money*.015>=cst){outc('co',cst);c.cap+=cst;c.lv++;c.lvAm=S.am;c.val=Math.round(c.val*1.4+cst*.6);log(`おまかせ：「${c.name}」Lv${c.lv}`,'life')}}}}}catch(e){console.error(e)}return r}}
document.addEventListener('click',e=>{const b=e.target.closest('[data-cup],[data-cm="lvup"]');if(!b||!S)return;const c=b.dataset.cup?S.cos.find(x=>x.id===b.dataset.cup):coOf(CM_ID);if(!c)return;const w=coWait(c);
 if(w>0){e.stopImmediatePropagation();e.preventDefault();toast(`「${c.name}」を次に大きくできるのは、${w}か月後です`);return}
 const lv0=c.lv;setTimeout(()=>{if(c.lv>lv0)c.lvAm=S.am},0)},true);
// サービス会社：ファンがサブスクに入る割合は、サービスの数で分け合う（全部合わせて、フォロワーの2%くらいまで）
svcMonth=function(){if(!S.svcs||!S.svcs.length)return;let rv=0,cs=0;const n=S.svcs.length,F=totalF();
  for(const s of S.svcs){const t=SVCT[s.t];if(!t)continue;const P=SVC_PRICE[s.pr||'std'];const fit=t.g&&t.g===S.genre?1.4:1;
    s.q=clamp((s.q||40)-.4,5,100);s.age=(s.age||0)+1;
    const market=Math.max(0,(F*.0005/n*fit+80*Math.max(.3,S.cty.inc)*Math.max(1,marketMul())+(s.mkt||0))*(s.q/50)*P.get*R(.7,1.3)*(s.age<6?.5+s.age/12:1));
    const churn=s.users*clamp(.06*P.churn*(1.4-s.q/100),.01,.2);s.mkt=Math.max(0,(s.mkt||0)*.5);
    s.users=Math.max(0,Math.round(s.users+market-churn))}
  const U=S.svcs.reduce((a,s)=>a+(s.users||0),0),cap=F*.02+5000*n*Math.max(1,marketMul());if(U>cap){const k=cap/U;for(const s of S.svcs)s.users=Math.round(s.users*k)}
  for(const s of S.svcs){if(!SVCT[s.t])continue;const e=svcEst(s);s.lastRev=e.rev;s.lastCost=e.cost;rv+=e.rev;cs+=e.cost}
  if(rv)inc('svcbiz',rv);if(cs)bill('svcbiz','自分のサブスク事業の運営費',cs);
  if(chance(.01)&&!S.q.includes('svc_down'))S.q.push('svc_down');else if(chance(.008)&&!S.q.includes('svc_rival'))S.q.push('svc_rival')};
