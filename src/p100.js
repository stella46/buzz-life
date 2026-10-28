
// ===== v3.6：新しい軽量モード（数値小さめ・やること少なめ。人生を見守りながら、分かれ道で選ぶ） =====
// S.lite: 0=通常 1=旧軽量 2=軽量
function isLite2(){return !!(S&&S.lite===2)}
// ----- モードの選択（通常／軽量／旧軽量） -----
{const _ss100=showSlots;showSlots=function(mode){const r=_ss100.apply(this,arguments);try{if(mode!=='new')return r;const d=$('#verPick');if(!d)return r;const P=LITE_PICK;
 const B=(k,v,t,s)=>`<button class="b vp ${P===v?'on':''}" type="button" data-vp3="${v}" aria-pressed="${P===v}"><b>${t}</b><span>${s}</span></button>`;
 d.innerHTML=`<div class="vp-t">遊ぶモード</div><div class="vp-row">${B('lite2',2,'軽量','人生を見守りながら、分かれ道で選ぶ。数字は現実くらいの大きさ。はじめての人に')}${B('full',0,'通常','SNS・人生・お金・事業（まち・会社・大計画・宇宙）まで、すべて遊べます')}</div><details class="pmore"><summary>旧軽量（前の軽量モード）</summary><div class="vp-row">${B('lite',1,'旧軽量','通常と同じ遊びを、かんたんにしたモード')}</div></details><p class="hint small">昔の版は、タイトルの「アップデート情報」→「昔の版で遊ぶ」から遊べます。</p>`}catch(e){console.error(e)}return r}}
LITE_PICK=2;
document.addEventListener('click',e=>{const b=e.target.closest('[data-vp3]');if(!b)return;LITE_PICK=+b.dataset.vp3;document.querySelectorAll('[data-vp3]').forEach(x=>{const on=+x.dataset.vp3===LITE_PICK;x.classList.toggle('on',on);x.setAttribute('aria-pressed',String(on))})});
{const _ng100=newGame;newGame=function(){const r=_ng100.apply(this,arguments);try{if(S){S.lite=LITE_PICK||0;if(S.lite===2){S.pmode='classic';S.r4={learn:2,work:2,post:2,rest:2};S.auto=0}}}catch(_){}return r}}
{const _sc100=slotCard;slotCard=function(i,s,mode){let h=_sc100.apply(this,arguments);try{const o=JSON.parse(localStorage.getItem(slotKey(i))||'null');if(o&&o.lite===1)h=h.replace('<span class="chip">軽量</span>','<span class="chip">旧軽量</span>')}catch(_){}return h}}
// 引き継いでもモードはそのまま（お店・会社、予定の配分も）
{const _ca100=continueAsChild;continueAsChild=function(){const lite=S&&S.lite,lb=S&&S.lb,r4=S&&S.r4,lw=S&&S.lw;const r=_ca100.apply(this,arguments);try{if(S){if(lite)S.lite=lite;if(lb)S.lb=lb;if(r4)S.r4=r4;if(lw)S.lw=lw}}catch(_){}return r}}

// ----- 予定：「学ぶ／働く／発信する／休む・人と過ごす」の配分だけ -----
const R4=[['learn','📚 学ぶ','知識が上がります'],['work','💼 働く','お金が入ります'],['post','📱 発信する','フォロワーがふえます'],['rest','☕ 休む・人と過ごす','健康・幸福・人間関係が回復します']];
const R4W=['しない','少し','ふつう','多め'];
function r4Act(k,i){const a=age(),ok=id=>ACT[id]&&ACT[id].ok();
 if(k==='learn')return ok('study')?'study':'practice';
 if(k==='work'){if(S.lb&&ok('shophelp')&&i%2)return 'shophelp';if(ok('part'))return 'part';if(ok('side'))return 'side';return ok('practice')?'practice':'study'}
 if(k==='post'){if(S.snsOpen&&ok('post'))return 'post';return ok('talkp')?'talkp':'practice'}
 const L=['rest','friends'];if(lover()&&ok('date'))L.push('date');if(ok('family'))L.push('family');const c=L[(S.am+i)%L.length];return ok(c)?c:'rest'}
function r4Plan(){const n=freeSlots();const w=S.r4||{learn:2,work:2,post:2,rest:2};let ks=R4.map(x=>x[0]).filter(k=>(w[k]||0)>0);if(!ks.length)ks=['rest'];
 const tot=ks.reduce((a,k)=>a+w[k],0);const acc=S.r4acc||(S.r4acc={});const out=[];
 for(let i=0;i<n;i++){for(const k of ks)acc[k]=(acc[k]||0)+w[k]/tot;let best=ks[0];for(const k of ks)if(acc[k]>acc[best])best=k;acc[best]-=1;out.push(r4Act(best,i))}
 S.plan=out;S.planOpt=out.map(()=>null)}
{const _t100=turn;turn=function(){try{if(isLite2()&&S&&S.alive&&!modalOpen()){S.pmode='classic';if(age()>=13){S.auto=0;r4Plan()}else S.auto=1}}catch(e){console.error(e)}return _t100.apply(this,arguments)}}
{const _pp100=panelPlan;panelPlan=function(){if(!isLite2())return _pp100.apply(this,arguments);const a=age();
 let h=noticesHtml()+`<h2>${S.unit==='week'?'今週':'今月'}のすごし方</h2>`;
 if(a<6)return h+`<p class="hint">6歳までは自動で育っていきます。</p><button class="b pri" type="button" data-act="grow">小学生になるまで見守る</button>`;
 const fixed={school:'学校（自動）',univ:'大学（自動）',work:`仕事：${S.job}（自動）`}[S.st];if(fixed)h+=`<div class="fixed">${esc(fixed)}</div>`;
 if(a<13)return h+`<p class="hint">12歳までは、遊び・勉強・お手伝いを自動でバランスよくします。気になる出来事が起きると止まります。</p>`+failHtml();
 const w=S.r4||{};const tot=R4.reduce((s,x)=>s+(w[x[0]]||0),0)||1;
 h+=`<p class="hint">自由な時間の使い方を、ざっくり決めます（自由な時間：${freeSlots()}つ）。あとは「次へ」で見守るだけです。</p>`;
 for(const [k,n,d] of R4){const v=w[k]||0;h+=`<div class="card r4row"><div><b>${n}</b> <span class="chip">${Math.round(v/tot*100)}%</span> <span class="muted small">${d}${k==='post'&&!S.snsOpen?'（SNSを始めるまでは、話し方の練習）':''}</span></div><div class="seg wrapseg">${R4W.map((t,i)=>`<button type="button" class="${v===i?'on':''}" data-r4="${k}" data-v="${i}">${t}</button>`).join('')}</div></div>`}
 if(S.plan&&S.plan.length)h+=`<p class="hint small">今月：${[...new Set(S.plan)].map(x=>esc((ACT[x]&&ACT[x].n)||x)).join('・')}</p>`;
 return h+failHtml()}}
document.addEventListener('click',e=>{const b=e.target.closest('[data-r4]');if(!b||!S)return;S.r4=S.r4||{};S.r4[b.dataset.r4]=+b.dataset.v;try{r4Plan()}catch(_){}save();renderPanel()});

// ----- 数字を現実の大きさに：フォロワーは1アカウント 日本のトップで約1000万人、世界で話題になると最大1億人 -----
function lite2Cap(){return (S&&S.lw)?1e8:1e7}
for(const k of Object.keys(SNS)){const o=SNS[k];const d=Object.getOwnPropertyDescriptor(o,'cap');if(!d||!d.get)continue;const g=d.get;
 Object.defineProperty(o,'cap',{get(){if(isLite2()){const sh=Math.min(1,this._cap0/SNS.milu._cap0);return lite2Cap()*Math.max(.3,sh)}return g.call(this)},set(v){this._cap0=v},configurable:true,enumerable:true})}
// お金：たくさん持つほど、ふえにくい（大成功で数十億円くらい）
{const _inc100=inc;inc=function(cat,v){if(isLite2()&&v>0&&S.money>3e8)v=Math.round(v*Math.pow(3e8/S.money,.8));return _inc100.call(this,cat,v)}}
{const _mh100=monthHook11;monthHook11=function(){const r=_mh100.apply(this,arguments);try{if(!isLite2()||!S.alive)return r;
 for(const k in S.f){const c=SNS[k]&&SNS[k].cap;if(c&&S.f[k]>c)S.f[k]=c}for(const c of (S.subch||[]))c.f=Math.min(c.f||0,lite2Cap()*.5);
 // 日本のトップ近くまで来ると、世界で話題になることがある
 if(!S.lw&&S.snsOpen&&(S.f[S.main]||0)>=lite2Cap()*.8&&chance(.04)){S.lw=1;tl('世界で話題になった');log('投稿が海外でも話題になり、世界中から見られるようになった','good');try{popBig('🌏 世界で話題に','海外からも見られるようになりました','フォロワーの上限が大きくなりました')}catch(_){}}
 // メンタルは、健康と幸福にまとめる
 S.p.mental=clamp(S.p.mental+(((S.p.health+S.p.happy)/2)-S.p.mental)*.5);
 // 記録用
 S.lpk=S.lpk||{f:0,m:0};S.lpk.f=Math.max(S.lpk.f,totalF());S.lpk.m=Math.max(S.lpk.m,S.money);
 lbMonth()}catch(e){console.error(e)}return r}}
// 出来事：事業・まち・賞・大計画の出来事は出さない
const LITE2_NOEV=new Set(['会社','まち','賞','大計画']);
{const _re100=rollEvent;rollEvent=function(){const e=_re100.apply(this,arguments);if(isLite2()&&e&&LITE2_NOEV.has(e.cat))return null;return e}}

// ----- お店か会社を1つだけ -----
const LB={shop:{n:'お店',c:5e6,p:3e5,up:4e6,ic:'🏪'},co:{n:'会社',c:2e7,p:1e6,up:1.5e7,ic:'🏢'}};
function lbCost(k,lv){const b=LB[k];return Math.round((lv?b.up*Math.pow(1.8,lv-1):b.c)*ci())}
function lbSkill(){return clamp(30+(S.p.know||0)*.35+(S.p.social||0)*.35,0,100)}
function lbMonth(){const x=S.lb;if(!x)return;const b=LB[x.k];x.age=(x.age||0)+1;
 let p=b.p*Math.pow(x.lv,1.35)*ci()*(.6+lbSkill()/120)*R(.7,1.3)*(typeof ecoMul==='function'?ecoMul():1);
 const f=failRoll(.05,lbSkill(),'lb');
 if(f===1){p*=.3;fNote(`${b.ic}「${x.nm}」で${x.k==='shop'?'お客さんが減った':'取引先とのトラブルがあった'}`,false)}
 else if(f===2){p=-b.p*x.lv*2*ci();fNote(`${b.ic}「${x.nm}」で大きなトラブルがあり、赤字になった`,true)}
 else nareAdd('lb',1);
 p=Math.round(p);x.last=p;if(p>0)inc('biz',p);else if(p<0)outc('shop',-p);x.tot=(x.tot||0)+p}
function lbHtml(){const a=age();let h=`<div class="card"><div class="hd"><span>🏪 お店・会社</span>${S.lb?`<span class="muted small">Lv${S.lb.lv} / 10</span>`:''}</div>`;
 if(!S.lb){if(a<20)return h+`<p class="hint">20歳から、お店か会社を1つ持てます。</p></div>`;
  return h+`<p class="hint">お店か会社を1つだけ持てます。毎月、利益が入ります（知識と人間関係が高いほど、もうかります）。</p><div class="row wrap">${Object.entries(LB).map(([k,b])=>`<button class="b sm" type="button" data-lb="new" data-k="${k}" ${S.money<lbCost(k,0)?'disabled':''}>${b.ic} ${b.n}を始める<small class="bfx">${yen(lbCost(k,0))}</small></button>`).join('')}</div></div>`}
 const x=S.lb,b=LB[x.k],up=x.lv<10?lbCost(x.k,x.lv):0;
 h+=`<div class="big">${b.ic} ${esc(x.nm)}</div><div class="kv"><span>先月の利益</span><span class="${(x.last||0)<0?'dn':''}">${yen(x.last||0)}</span><span>これまでの利益</span><span>${yen(x.tot||0)}</span></div><div class="row wrap">`;
 if(x.lv<10)h+=`<button class="b sm pri" type="button" data-lb="up" ${S.money<up?'disabled':''}>大きくする<small class="bfx">${yen(up)}</small></button>`;
 return h+`<button class="b sm ghost" type="button" data-lb="close">たたむ</button></div></div>`}
document.addEventListener('click',e=>{const b=e.target.closest('[data-lb]');if(!b||!S||b.disabled)return;const d=b.dataset.lb;
 if(d==='new'){if(S.lb)return;const k=b.dataset.k,c=lbCost(k,0);if(S.money<c)return;outc('shop',c);const sur=(typeof surOf==='function'?surOf(S):'')||'';S.lb={k,lv:1,nm:k==='shop'?`${sur}商店`:`${sur}株式会社`,am:S.am,inv:c};tl(`${LB[k].n}「${S.lb.nm}」を始めた`);log(`${LB[k].n}「${S.lb.nm}」を始めた`,'good')}
 else if(d==='up'){const x=S.lb;if(!x||x.lv>=10)return;const c=lbCost(x.k,x.lv);if(S.money<c)return;outc('shop',c);x.inv=(x.inv||0)+c;x.lv++;log(`「${x.nm}」を大きくした（Lv${x.lv}）`,'good');if(x.lv===10)tl(`「${x.nm}」が大きく成長した`)}
 else if(d==='close'){const x=S.lb;if(!x)return;if(b.dataset.ok!=='1'){b.dataset.ok='1';b.textContent='もう一度押すと、たたみます';return}const back=Math.round((x.inv||0)*.3);if(back)inc('biz',back);log(`「${x.nm}」をたたんだ（${yen(back)}が戻った）`,'life');tl(`「${x.nm}」をたたんだ`);S.lb=null}
 save();renderPanel()});

// ----- お金・仕事の画面 -----
{const _pma100=panelMoneyAdult;panelMoneyAdult=function(){if(!isLite2())return _pma100.apply(this,arguments);
 const job={school:'学生',univ:'大学生',work:`${S.job||'会社員'}（月給 ${yen(S.salary||0)}）`,creator:'専業クリエイター',free:'自由業',retired:'引退'}[S.st]||'—';
 let h=noticesHtml()+`<h2>お金・仕事</h2><div class="card"><div class="kv"><span>持っているお金</span><span><b>${yen(S.money)}</b></span>${S.debt>0?`<span>借金</span><span class="dn">${yen(S.debt)}</span>`:''}<span>仕事</span><span>${esc(job)}</span></div><p class="hint small">生活費や税金は、毎月自動で払われます。仕事を変えたいときは「人生」→「人」の「人生の選択」から。</p></div>`;
 h+=lbHtml();
 if(S.bills&&S.bills.length)h+=`<div class="card"><div class="hd"><span>🧾 支払い待ち</span></div><p class="hint">払えていない請求が${S.bills.length}件あります。お金がたまると自動で払われます。</p></div>`;
 return h}}

// ----- 画面：「事業」タブはなし、「お金」→「お金・仕事」 -----
{const _r100=render;render=function(){const r=_r100.apply(this,arguments);try{const L2=isLite2();const bt=document.querySelector('.tab[data-tab="biz"]');if(bt){if(L2){bt.hidden=true;bt.dataset.l2='1'}else if(bt.dataset.l2){delete bt.dataset.l2;bt.hidden=false}}
 const mt=document.querySelector('.tab[data-tab="money"]');if(mt){const t=[...mt.childNodes].find(n=>n.nodeType===3&&n.textContent.trim());if(t)t.textContent=L2?'お金・仕事':'お金'}if(L2&&tab==='biz')setTab('act')}catch(e){console.error(e)}return r}}
{const _rw100=renderWho;renderWho=function(){const r=_rw100.apply(this,arguments);try{if(isLite2()){const m=$('#who .mini');if(m)m.innerHTML=`<div>健康 ${Math.round(S.p.health)}${bar(S.p.health,'h')}</div><div>幸福 ${Math.round(S.p.happy)}${bar(S.p.happy,'p')}</div><div>知識 ${Math.round(S.p.know)}${bar(S.p.know,'m')}</div><div>人間関係 ${Math.round(S.p.social)}${bar(S.p.social,'h')}</div>`}}catch(_){}return r}}
// 発信：世界進出・高額な使い道はなし
{const _wc100=worldCard;worldCard=function(){if(isLite2())return '';return _wc100.apply(this,arguments)}}
{const _bh100=bigHtml;bigHtml=function(k){if(isLite2())return '';return _bh100.apply(this,arguments)}}
{const _ps100=panelSns;panelSns=function(){let h=_ps100.apply(this,arguments);try{if(isLite2()&&S.snsOpen){const cap=SNS[S.main].cap;h=h.replace('<h2>アカウント</h2>',`<p class="hint small">${S.lw?'世界中から見られています（1アカウント最大 '+num(cap)+'人）':'日本のトップは、1アカウントで約'+num(cap)+'人です'}</p><h2>アカウント</h2>`)}}catch(_){}return h}}
// おまかせ設定の事業・研究まわりは使わない
{const _om100=omkHtml;omkHtml=function(){let h=_om100.apply(this,arguments);if(isLite2())h=h.replace(/<label class="omki"><input type="checkbox" data-omk="(shop|co|office|svc|mega|res|big|money)"[^>]*>[\s\S]*?<\/label>/g,'');return h}}

// ----- 人生の振り返り（すべてのモード） -----
function lifeReview(){try{const st=S.stats||{},kids=(S.kids||[]).filter(k=>k._gkOf==null).length;const pb=(S.pbest||[])[0];const pk=S.lpk||{f:totalF(),m:S.money};
 const rows=[['生まれ',`${ctry()}・${S.region.n}（${TIERS[S.tier].l}）`],['生きた年',`${S.y-age()}年〜${S.y}年（${age()}歳）`],['仕事',S.job||({creator:'専業クリエイター',retired:'引退',free:'自由業'}[S.st]||'—')],
  ['いちばん多かったフォロワー',`${num(Math.max(pk.f||0,totalF()))}人`],['いちばん多かったお金',yen(Math.max(pk.m||0,S.money))],['結婚',S.spouse?`${pn(S.spouse)}と`:'しなかった'],['子ども',kids?`${kids}人`:'いなかった'],
  ['バズった回数',`${st.buzz||0}回`],['失敗した回数',`${st.fail||0}回（大きな失敗 ${st.bigFail||0}回）`]];
 if(pb)rows.push(['いちばん見られた投稿',`「${pb.t}」${num(pb.v)}回`]);if(S.lb)rows.push(['お店・会社',`${LB[S.lb.k].ic} ${S.lb.nm}（Lv${S.lb.lv}）`]);
 return `<div class="card review"><div class="hd"><span>📖 人生の振り返り</span></div><div class="kv">${rows.map(([a,b])=>`<span>${esc(a)}</span><span>${esc(b)}</span>`).join('')}</div></div>`}catch(e){console.error(e);return ''}}
{const _se100=showEnding;showEnding=function(){const r=_se100.apply(this,arguments);try{const el=$('#scrEnd');const hd=el&&el.querySelector('.head');if(hd&&!el.querySelector('.review')){const d=document.createElement('div');d.innerHTML=lifeReview();hd.after(d)}}catch(e){console.error(e)}return r}}

// ----- 遊び方 -----
(function(){const g=GUIDE.find(x=>x[0]==='lite');if(g){g[1]='軽量と通常';g[2]=`「はじめから」で、遊ぶモードを選べます。あとから変えることはできません。
■ 軽量
人生を見守りながら、分かれ道で選ぶモードです。数字は現実くらいの大きさです。
・すごし方は「学ぶ／働く／発信する／休む・人と過ごす」の配分を決めるだけです。12歳までは自動で育ちます。
・見るのは、健康・幸福・知識・人間関係と、フォロワー・お金です。
・フォロワーは、日本のトップで1アカウント約1000万人。世界で話題になると、もっと伸びます。
・お店か会社を1つだけ持てます（20歳から）。
・まちづくり・研究・大計画・賞・世界進出・芸能事務所はありません。
■ 通常
SNS・人生・お金・事業（まち・会社・大計画・宇宙）まで、すべての機能で遊べます。
■ 旧軽量
前の軽量モードです。通常と同じ遊びを、かんたんにしたものです。
※ どのモードでも、人生が終わると「人生の振り返り」が見られます。`}
 const b=GUIDE.find(x=>x[0]==='basic');if(b)b[2]=b[2].replace('「通常」か「軽量」を選べます（くわしくは「通常と軽量」）','「軽量」「通常」「旧軽量」を選べます（くわしくは「軽量と通常」）')})();
try{if(!OLD_VERS.some(v=>v[1]==='versions/v3.5/'))OLD_VERS.unshift(['v3.5','versions/v3.5/','失敗の仕組みが入った版'])}catch(_){}
// 軽量：フォロワーの伸びは現実くらい（日本のトップになるには長い年月がかかる）
const LITE2_GROW=.15;
{const _dp100=doPost;doPost=function(k){if(!isLite2())return _dp100.apply(this,arguments);const key=S.main,f0=S.f[key]||0;const r=_dp100.apply(this,arguments);try{const d=(S.f[key]||0)-f0;if(d>0){S.f[key]=f0+d*LITE2_GROW;if(!SUBPOST)S.mo.newF-=d*(1-LITE2_GROW)}}catch(_){}return r}}

// 軽量：賞・研究の知らせ・引き継ぎポイントの大きな知らせは出さない
{const _aw100=awMonth;awMonth=function(){if(isLite2())return;return _aw100.apply(this,arguments)}}
{const _rr100=researchReady;researchReady=function(){if(isLite2())return 0;return _rr100.apply(this,arguments)}}
{const _pb100=popBig;popBig=function(a){if(isLite2()&&/引き継ぎポイント/.test(String(a||'')))return;return _pb100.apply(this,arguments)}}
