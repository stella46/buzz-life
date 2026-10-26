
// ===== v3.0.7：すべての操作をおまかせにできるように =====
OMK.push(['sns','SNS','ジャンル・スタイル・投稿の企画・コラボ・世界進出を、そのときに合わせて決めます（13歳から）'],
 ['money','お金','自動払い・機材の買いかえ・スマホを手に入れるなどをまかせます'],
 ['office','芸能事務所','事務所づくり・スタッフ・タレント探しをまかせます（20歳から）'],
 ['svc','サービス会社','余裕があれば、サブスクのサービスを始めます（20歳から）'],
 ['big','高額なアクション','お金がとても余っているときに使います（20歳から）'],
 ['leg','引き継ぎスキル','ポイントがたまったら、覚えられるものを覚えます'],
 ['evall','すべての出来事','大事な出来事も止まらずに、おまかせで選びます']);
function omkClick(attrs){try{let box=document.getElementById('omkBox');if(!box){box=document.createElement('div');box.id='omkBox';box.hidden=true;document.body.appendChild(box)}
 const b=document.createElement('button');b.type='button';for(const [k,v] of Object.entries(attrs))b.setAttribute(k,v);box.appendChild(b);b.click();b.remove()}catch(e){console.error(e)}}
function omkMore(){if(!S||!S.alive||!S.omk)return;const a=age(),ci=Math.max(.2,S.cty.inc),did=[];
 // SNS
 if(omk('sns')&&a>=13){
  if(S.flags.noNet&&S.money>=Math.round(20000*Math.max(.25,S.cty.inc))*2&&!modalOpen()){omkClick({'data-act':'buyphone'});did.push('スマホ')}
  if(S.snsOpen){const tr=S.trend&&S.trend.g;const best=Object.keys(GENRES).filter(g=>genreOk(g)).sort((x,y)=>(S.tal[talKey(y)]||0)-(S.tal[talKey(x)]||0))[0];
   const g=tr&&genreOk(tr)&&(S.tal[talKey(tr)]||0)>=(S.tal[talKey(best)]||0)*.7?tr:best;if(g&&S.genre!==g&&(S.series?S.series.n>=4||(S.tal[talKey(g)]||0)>(S.tal[talKey(S.genre)]||0)+10:true)){S.genre=g;did.push('ジャンル')}
   const st=S.fanAnti>.12?'chill':(S.p.know>=70?'expert':'norm');if(STYLES[st]&&S.style!==st)S.style=st;
   const bigC=Math.round(50000*ci);S.postPlan=a>=18&&S.money>bigC*36?'big':(S.fanCore<.12&&S.m%3===0?'live':'normal');
   if(!collabNow()){const L=(S.collabs||[]).filter(p=>!(S.cd['ask_'+p.id]!=null&&S.am-S.cd['ask_'+p.id]<2)).sort((x,y)=>acceptChance(y)-acceptChance(x));if(L[0]&&acceptChance(L[0])>=.35)try{askCollab(L[0].id)}catch(_){}}
   try{const nx=wNext();if(nx&&S.f[S.main]>=wNeed(nx)&&S.money>=wCost(nx)*2){worldGo();did.push('世界進出')}}catch(_){}}}
 // お金
 if(omk('money')&&a>=18){S.autopay=1;try{for(const k of Object.keys(EQ)){const nx=EQ[k].t[S.eq[k]+1];if(nx&&S.eq[k]<eqMax()&&S.money>=nx[1]*10){outc('shop',nx[1]);S.eq[k]++;did.push(nx[0])}}}catch(_){}}
 // 芸能事務所
 if(omk('office')&&a>=20&&S.office){const o=S.office,nx=OFFICE[o.lv+1];
  if(nx&&S.money>=nx.cost*S.cty.inc*8){const c=Math.round(nx.cost*S.cty.inc);outc('build',c);o.lv++;tl(nx.n+'を構えた');did.push(nx.n)}
  if(o.lv){const ks=Object.keys(STAFF);for(let i=0;i<2;i++){if(staffTotal()>=OFFICE[o.lv].staff)break;const k=ks.sort((x,y)=>stN(x)-stN(y))[0];if(S.money<STAFF[k].sal*S.cty.inc*60)break;o.staff[k]++;did.push(STAFF[k].n)}
   if(has('scout')&&o.talents.length<OFFICE[o.lv].tal&&S.money>=300000*ci*20){omkClick({'data-act':'scout'});did.push('タレント探し')}}}
 // サービス会社
 if(omk('svc')&&a>=20&&(S.svcs||[]).length<30){try{const t=Object.values(SVCT).filter(t=>svcOk(t)&&!(S.svcs||[]).some(s=>s.t===t.k)&&t.dev*ci2()<=S.money*.05).sort((x,y)=>x.dev-y.dev)[0];if(t){omkClick({'data-svcnew':t.k});did.push('サービス「'+t.n+'」')}}catch(_){}}
 // 高額なアクション
 if(omk('big')&&a>=20){try{const L=BIG.filter(b=>(!b[6]||b[6]())&&!bigCd(b)&&bigCost(b)<=S.money*.02).sort((x,y)=>bigCost(x)-bigCost(y));if(L[0]&&S.m%2===0){bigDo(L[0][0])}}catch(_){}}
 // 引き継ぎスキル
 if(omk('leg')){try{const L=legState();for(const x of LEG.slice().sort((p,q)=>p.c-q.c)){if(!L.nodes[x.id]&&(!x.req||L.nodes[x.req])&&x.ok(META.rec)&&L.lp>=x.c){legBuy(x.id);did.push('引き継ぎ「'+x.n+'」')}}}catch(_){}}
 if(did.length)log('おまかせ：'+did.slice(0,6).join('・'),'life')}

// 会社のおまかせ：会社がなければ作り、余裕があれば別の種類の会社もふやす
{const _om80=omkMore;omkMore=function(){_om80.apply(this,arguments);try{if(!S||!omk('co')||age()<22)return;const ci=Math.max(.2,S.cty.inc);const have=new Set((S.cos||[]).map(c=>c.k));
 const L=Object.entries(COS).filter(([k,d])=>!have.has(k)&&(!d.year||S.y>=d.year)).sort((a,b)=>a[1].c-b[1].c);if(!L.length||(S.cos||[]).length>=CO_MAX)return;
 const [k,d]=L[0];const need=d.c*ci*((S.cos||[]).length?20:3);if(S.money>=need){foundCo(k,'');log(`おまかせ：会社「${d.n}」を作った`,'life')}}catch(e){console.error(e)}}}
{const _mh80=monthHook11;monthHook11=function(){_mh80.apply(this,arguments);try{omkMore()}catch(e){console.error(e)}}}
// すべての出来事：止まらずに選ぶ
{const _ae80=autoEvOk;autoEvOk=function(e){try{if(S&&S.omk&&S.omk.evall&&e&&e.ch)return true}catch(_){}return _ae80.apply(this,arguments)}}
{const _se80=showEvent;showEvent=function(e){try{if(S&&S.omk&&S.omk.evall&&e&&e.ch&&!(typeof TUT!=='undefined'&&TUT)){autoChoose(e);try{renderSoon()}catch(_){render()}return}}catch(err){console.error(err)}return _se80.apply(this,arguments)}}
// 「すべてまかせる」は、毎月の行動と出来事の種類ごともまとめてオンに
document.addEventListener('click',e=>{const b=e.target.closest('[data-omkall]');if(!b||!S)return;setTimeout(()=>{const v=+b.dataset.omkall;S.auto=v?1:0;if(v){S.evSkip={};try{for(const c of evCats())S.evSkip[c]=1}catch(_){}}else S.evSkip={};save();renderPanel()},0)});
// おまかせ設定の画面：いちばん上に「すべてまかせる」
{const _oh80=omkHtml;omkHtml=function(){let h=_oh80.apply(this,arguments).replace('<div class="row"><button class="b sm" type="button" data-omkall="1">すべてまかせる</button><button class="b sm ghost" type="button" data-omkall="0">すべて自分でやる</button></div>','');return h.replace('<p class="hint">まかせたものは、さわらなくても自動で進みます。いつでも戻せます。</p>','<p class="hint">まかせたものは、さわらなくても自動で進みます。いつでも戻せます。</p><div class="row"><button class="b sm pri" type="button" data-omkall="1">🤖 すべての操作をまかせる</button><button class="b sm ghost" type="button" data-omkall="0">すべて自分でやる</button></div>')}}
(function(){const g=GUIDE.find(x=>x[0]==='auto');if(g)g[2]=g[2].replace('・🤖 おまかせ設定：行動・分野ごと・出来事のおまかせを、まとめて決められます。','・🤖 おまかせ設定：行動・分野ごと・出来事のおまかせを、まとめて決められます。「すべての操作をまかせる」で、ぜんぶ自動にもできます。')})();
