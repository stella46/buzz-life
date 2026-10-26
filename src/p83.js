
// ===== v3.0.10：50歳からの伸びをゆるやかに（工夫すると1回の人生で大計画が全部そろう。おまかせだけだと半分〜7割くらい） =====
const MKT_EXP=.4;
marketMul=function(){try{return Math.max(1,Math.pow((worldPop()+alienPop())/WORLD_POP,MKT_EXP))}catch(_){return 1}};
// おまかせの管理には手数料がかかる（自分で管理するほうが、もうかる）
{const _inc83=inc;inc=function(cat,v){try{if(v>0&&S&&S.omk){if(cat==='co'&&S.omk.co)v=Math.round(v*.5);else if(cat==='mega'&&S.omk.mega)v=Math.round(v*.5)}}catch(_){}return _inc83.call(this,cat,v)}}
// サービス会社：ファンだけでなく、世の中の人も使う（有名になるほど、人口の1%くらいまで。ファンは入りやすい）。利用者は少しずつふえる
function svcPop(){try{return W().r.includes('global')?viewersAll():Math.min(WORLD_POP,JP_POP*(1+W().r.length*1.5))}catch(_){return JP_POP}}
svcMonth=function(){if(!S.svcs||!S.svcs.length)return;let rv=0,cs=0;const F=totalF(),P=svcPop();
  for(const s of S.svcs){const t=SVCT[s.t];if(!t)continue;const Pp=SVC_PRICE[s.pr||'std'];const fit=t.g&&t.g===S.genre?1.4:1;
    s.q=clamp((s.q||40)-.4,5,100);s.age=(s.age||0)+1;
    const fame=Math.min(1,F/(P*.1));const pot=(F*.01*fit+P*.01*fame)*(s.q/60)*Pp.get/Math.sqrt(S.svcs.length);
    const gain=Math.max(0,(pot-s.users)*.04*R(.6,1.4)*(s.age<6?.5+s.age/12:1)+(s.mkt||0));
    const churn=s.users*clamp(.03*Pp.churn*(1.4-s.q/100),.005,.12);s.mkt=Math.max(0,(s.mkt||0)*.5);
    s.users=Math.max(0,Math.round(s.users+gain-churn))}
  for(const s of S.svcs){if(!SVCT[s.t])continue;const e=svcEst(s);s.lastRev=e.rev;s.lastCost=e.cost;rv+=e.rev;cs+=e.cost}
  if(rv)inc('svcbiz',rv);if(cs)bill('svcbiz','自分のサブスク事業の運営費',cs);
  if(chance(.01)&&!S.q.includes('svc_down'))S.q.push('svc_down');else if(chance(.008)&&!S.q.includes('svc_rival'))S.q.push('svc_rival')};

// ----- 「○年から」は、自分の発展の速さで解放（研究が進むほど、未来のものが早く使える） -----
function techBonus(){try{return Math.min(250,resDoneAll()*.8)}catch(_){return 0}}
function techY(){return S?S.y+techBonus():2026}
(function(){const conv=(o,key)=>{if(!o||o['_'+key+'0']!=null)return;const y0=o[key];if(!(y0>0))return;o['_'+key+'0']=y0;Object.defineProperty(o,key,{get(){return y0-techBonus()},set(v){},configurable:true,enumerable:true})};
 const fixD=o=>{if(o&&typeof o.d==='string')o.d=o.d.replace(/（(\d{4})年から）/g,'（研究が進むと解放）').replace(/・(\d{4})年から）/g,'・研究が進むと解放）').replace(/(\d{4})年から。/g,'研究が進むと解放。')};
 for(const r of RES){conv(r,'year');fixD(r)}
 for(const d of DEVS){conv(d,'year');fixD(d)}
 for(const k in COS){conv(COS[k],'year');fixD(COS[k])}
 for(const k in SUBS){conv(SUBS[k],'yr');fixD(SUBS[k])}
 try{for(const k in SVCT)conv(SVCT[k],'yr')}catch(_){}
 try{for(const e of TEVENTS){conv(e,'yr');fixD(e)}}catch(_){}
 try{for(const it of SPEND){if(/年から/.test(it.d||'')){const m=it.d.match(/(\d{4})年から/);const y=m?+m[1]:0;const ok0=it.ok;it.ok=function(){const sv=S.y;S.y=techY();try{return ok0?ok0.apply(this,arguments):true}finally{S.y=sv}};fixD(it)}}}catch(_){}
})();
// 画面の「○年から」の表示も、そろえる
{const _rp83=renderPanel;renderPanel=function(){const r=_rp83.apply(this,arguments);try{const p=$('#panel');if(p){const w=document.createTreeWalker(p,NodeFilter.SHOW_TEXT);let n;while((n=w.nextNode())){if(/\d{4}年から/.test(n.nodeValue))n.nodeValue=n.nodeValue.replace(/（(\d{4})年から）/g,'（研究が進むと解放）').replace(/(\d{4})年から/g,'研究が進むと解放')}}}catch(_){}return r}}
