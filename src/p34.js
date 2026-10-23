
// ===== v1.4：会社の経営を本格的に（開発費・従業員・オフィスと支社・レイアウト・名前・買収・合併） =====
const CO_MAX2=30;
// ----- 作るものの開発費（現実に近い金額。物価で変わる） -----
const PCOST={game:[3e7,3e8,3e9],it:[2e7,2e8,2e9],food:[5e6,3e7,2e8],apparel:[1e7,8e7,5e8],media:[5e6,5e7,5e8],estate:[3e8,3e9,3e10],space:[5e9,5e10,3e11]};
const PSTAFF={game:[3,30,200],it:[3,20,150],food:[2,10,50],apparel:[2,10,60],media:[2,10,80],estate:[5,30,200],space:[20,200,2000]};
const SCI={s:0,m:1,l:2};
prodCost=function(c,sc){return Math.round((PCOST[c.k]||[1e7,1e8,1e9])[SCI[sc]]*Math.max(.2,S.cty.inc))};
function prodNeed(c,sc){return (PSTAFF[c.k]||[3,20,100])[SCI[sc]]}

// ----- 従業員 -----
const EMP_CAP=[0,10,30,100,300,1000,3000,10000,30000];// 会社のレベルごとの本社の上限（中小企業〜大企業の人数を参考）
const ROLES2={dev:'開発',plan:'企画',design:'デザイン',eng:'エンジニア',sales:'営業',acct:'経理',hr:'人事',pr:'広報'};
const TRAITS2={genius:{n:'天才肌',d:'作品の評価+6。気分にむらがある'},hard:{n:'努力家',d:'毎月少しずつ腕が上がる'},mood:{n:'ムードメーカー',d:'会社の雰囲気が良くなる'},careful:{n:'慎重派',d:'作品の大失敗が減る'},ambitious:{n:'野心家',d:'腕はいいが、辞めやすい'},craft:{n:'職人気質',d:'大作のとき評価+5'},talker:{n:'営業上手',d:'会社の利益+3%'},saver:{n:'節約家',d:'開発費-5%'},trendy:{n:'新しもの好き',d:'流行りに乗るとさらに評価+5'},leader:{n:'リーダー',d:'みんなの腕が少しずつ上がる'},night:{n:'夜型',d:'締め切り前に強い。体調を崩しやすい'},calm:{n:'おだやか',d:'辞めにくい'}};
const STAFF_SAL=250000;// 一般社員の月給（日本の目安。国の物価で変わる）
function coInit(c){if(!c.emp)c.emp={n:Math.min(5,coCap(c)),key:[],auto:1,mor:60,cand:null,candAm:-99};if(!c.offices){c.offices=[{id:'o'+RI(1000,9999),loc:'home',nm:'本社',size:c.lv>=6?'l':c.lv>=3?'m':'s',grid:null,hq:1}]}for(const o of c.offices)if(!o.grid)o.grid=autoGrid(c,o.size);return c}
const OSZ={s:{n:'小さなオフィス',w:4,h:3,cap:50,cost:5e6,rent:5e5},m:{n:'中くらいのビル',w:5,h:4,cap:500,cost:1e8,rent:5e6},l:{n:'大きなビル',w:6,h:5,cap:5000,cost:2e9,rent:5e7}};
function coCap(c){let cap=EMP_CAP[Math.min(8,c.lv)]||10;for(const o of (c.offices||[]))if(!o.hq)cap+=OSZ[o.size].cap;return cap}
function empSal(){return STAFF_SAL*Math.max(.2,S.cty.inc)}
function mkKey(c){const role=pick(Object.keys(ROLES2)),tr=pick(Object.keys(TRAITS2)),sk=RI(30,92);return {id:'k'+RI(1e4,9e4),name:fullName(pick(SURN),givenName(chance(.5)?'男':'女')),role,trait:tr,sk,sal:Math.round((30+sk*1.2)*10000*Math.max(.2,S.cty.inc)),hap:60,am:S.am}}
function keyBonus(c,big,trend){let q=0;for(const k of c.emp.key){if(['dev','plan','design','eng'].includes(k.role))q+=(k.sk-50)*.08;if(k.trait==='genius')q+=6;if(k.trait==='craft'&&big)q+=5;if(k.trait==='trendy'&&trend)q+=5}return Math.min(25,q)}
function staffRatio(c,sc){const need=prodNeed(c,sc);return Math.min(1.2,(c.emp.n+c.emp.key.length*3)/need)}

// ----- オフィスのレイアウト -----
const ROOMS={empty:{n:'空き',ic:'・',col:'#2b2f45'},dev:{n:'開発室',ic:'💻',col:'#3a6ea5',d:'作品の評価+0.6'},meet:{n:'会議室',ic:'🗣',col:'#7a5bb5',d:'利益+1%'},rest:{n:'休憩室',ic:'☕',col:'#3f9a6a',d:'雰囲気+2'},server:{n:'サーバー室',ic:'🖥',col:'#455a64',d:'ゲーム・IT の評価+1'},show:{n:'ショールーム',ic:'🛍',col:'#c2185b',d:'飲食・服・不動産の利益+2%'},train:{n:'研修室',ic:'📚',col:'#a1887f',d:'社員の腕が上がる'},recep:{n:'受付',ic:'🛎',col:'#f9a825',d:'採用しやすくなる'},boss:{n:'社長室',ic:'👑',col:'#8d6e63',d:'あなたのメンタル+0.2'}};
function autoGrid(c,size){const z=OSZ[size],n=z.w*z.h,g=[];const plan=['recep','boss','meet','rest','train'];const main=['game','it'].includes(c.k)?['dev','dev','server']:['food','apparel','estate'].includes(c.k)?['show','meet','dev']:['dev','meet'];
  for(let i=0;i<n;i++)g.push(i<plan.length&&i<n/3?plan[i]:main[i%main.length]);return g}
function roomCount(c){const r={};for(const o of c.offices)for(const t of o.grid)r[t]=(r[t]||0)+1;return r}
function roomBonus(c){const r=roomCount(c);return {q:Math.min(10,(r.dev||0)*.6)+(['game','it'].includes(c.k)?Math.min(6,(r.server||0)):0),pm:Math.min(.1,(r.meet||0)*.01)+(['food','apparel','estate'].includes(c.k)?Math.min(.12,(r.show||0)*.02):0),mor:Math.min(20,(r.rest||0)*2),train:(r.train||0),recep:(r.recep||0),boss:(r.boss||0)}}

// ----- 作品の評価に従業員とオフィスを反映 -----
function prodExtra(c,a){coInit(c);const tr=prodTrend(c.k)===a.it,rb=roomBonus(c),ratio=staffRatio(c,a.sc);return keyBonus(c,a.sc==='l',tr)+rb.q-(ratio<1?(1-ratio)*30:0)+(c.emp.mor-60)*.1}
function prodCareful(c){return !!(c.emp&&c.emp.key.some(k=>k.trait==='careful'))}
const _ps34=prodStart;prodStart=function(c,it,sc,auto){coInit(c);if(staffRatio(c,sc)<.5){if(!auto)toast(`人手が足りない（${prodNeed(c,sc)}人くらい必要）`);return false}const sv=c.emp.key.some(k=>k.trait==='saver');if(sv){const orig=prodCost;prodCost=(cc,s)=>Math.round(orig(cc,s)*.95);try{return _ps34(c,it,sc,auto)}finally{prodCost=orig}}return _ps34(c,it,sc,auto)};

// ----- 毎月：給料・採用・雰囲気・支社 -----
function empMonth(){for(const c of (S.cos||[])){coInit(c);const E=c.emp,cap=coCap(c),sal=empSal(),rb=roomBonus(c);
  // 自動採用：利益が出ていてお金があれば、上限の6割まで
  if(E.auto){const tgt=Math.floor(cap*.6);if(E.n<tgt&&S.money>sal*20){const add=Math.min(tgt-E.n,Math.max(1,Math.ceil(cap*.03)));E.n+=add;outc('co',Math.round(add*sal*2))}
    if(E.key.length<Math.min(12,2+c.lv)&&chance(.08)&&S.money>2e7){const k=mkKey(c);if(k.sk>=55&&(c.last||0)+(c.empNet||0)>k.sal){E.key.push(k);log(`「${c.name}」に${k.name}さん（${ROLES2[k.role]}・${TRAITS2[k.trait].n}）が入社した`,'life')}}}
  // 給料と、社員が生む売上（景気が悪いと赤字になることも）
  let pay=E.n*sal;for(const k of E.key)pay+=k.sal;const mor=E.mor/60;const sales=E.key.filter(k=>k.role==='sales').reduce((s,k)=>s+k.sk,0)/2000+E.key.filter(k=>k.trait==='talker').length*.03;
  const earn=E.n*sal*1.12*ecoMul()*Math.min(1.15,.85+mor*.15)*(1+rb.pm+sales);c.empNet=Math.round(earn-pay);if(c.empNet>0)inc('co',c.empNet);else if(c.empNet<0)bill('co',`「${c.name}」の人件費`,-c.empNet);
  // 支社の家賃と、海外・ほかのまちの市場
  let rent=0,mk=0;for(const o of c.offices){if(o.hq)continue;rent+=OSZ[o.size].rent*Math.max(.2,S.cty.inc);mk+=o.loc.startsWith('c:')?.06:.03}if(rent)bill('co',`「${c.name}」の支社の家賃`,rent);
  if(mk){const v=Math.round(Math.max(0,coProfit(c,false))*mk);if(v)inc('co',v);c.mkNet=v}
  // 雰囲気
  const moodK=E.key.filter(k=>k.trait==='mood').length*3;E.mor=clamp(E.mor+((50+rb.mor+moodK+(S.cfocus===c.id?5:0))-E.mor)*.15+R(-2,2));
  for(const k of E.key){if(k.trait==='hard'||rb.train)k.sk=Math.min(99,k.sk+.08*(k.trait==='hard'?1:0)+.03*Math.min(5,rb.train));if(E.key.some(x=>x.trait==='leader'))k.sk=Math.min(99,k.sk+.03)}
  if(rb.boss&&S.cfocus===c.id)ad('mental',.2);
  // 辞める人
  const quit=E.mor<35?.03:.008;E.n=Math.max(0,Math.round(E.n*(1-quit*R(.5,1.5))));
  const qk=E.key.find(k=>chance((k.trait==='ambitious'?.02:k.trait==='calm'?.002:.006)*(E.mor<40?3:1)));if(qk){E.key=E.key.filter(x=>x!==qk);log(`「${c.name}」の${qk.name}さん（${ROLES2[qk.role]}）が退職した`,'bad')}
  if(E.n>cap)E.n=cap}}
const _mh34=monthHook11;monthHook11=function(){_mh34();try{empMonth()}catch(e){console.error(e)}};
foundCo=function(k,nm){const d=COS[k],cst=Math.round(d.c*Math.max(.2,S.cty.inc));if(S.money<cst||S.cos.length>=CO_MAX2)return;outc('co',cst);
  const co={id:'c'+Date.now().toString(36)+RI(10,99),k,name:(nm||'').trim().slice(0,12)||coName(k),lv:1,cap:d.c,val:Math.round(d.c*.9),born:S.am,pub:0,last:0};coInit(co);S.cos.push(co);if(!S.cfocus)S.cfocus=co.id;
  tl(`会社「${co.name}」を設立して代表になった`);ticker(`${S.name}、${d.n}「${co.name}」を設立`);ad('rep',2);snd('buy');save();render()};

// ----- 会社の管理画面 -----
let CM_ID=null,CM_TAB='sum',CM_ROOM='dev';
function coOf(id){return (S.cos||[]).find(c=>c.id===id)}
function showCo(id,tab){CM_ID=id||CM_ID;if(tab)CM_TAB=tab;const c=coOf(CM_ID);if(!c){closeModal();return}coInit(c);
  const tabs=[['sum','概要'],['emp','従業員'],['off','オフィス・支社'],['lay','レイアウト'],['prd',PROD[c.k]?PROD[c.k].lbl:'作るもの']];const m=$('#mcard');
  if(!$('#modal').hidden&&m.dataset.kind==='co'&&$('#cmBody')){m.querySelector('h2').textContent=c.name;m.querySelectorAll('[data-cmtab]').forEach(b=>b.classList.toggle('on',b.dataset.cmtab===CM_TAB));const bd=$('#cmBody'),st=bd.scrollTop;bd.innerHTML=cmBody(c);bd.scrollTop=st;return}
  openModal(`<div class="mcat life">${esc(COS[c.k].n)}</div><h2>${esc(c.name)}</h2><div class="seg wrapseg">${tabs.map(([k,n])=>`<button type="button" class="${CM_TAB===k?'on':''}" data-cmtab="${k}">${esc(n)}</button>`).join('')}</div><div id="cmBody" class="fbody">${cmBody(c)}</div><button class="b pri" type="button" data-act="close">閉じる</button>`);m.classList.add('fixedsize','menufix');m.dataset.kind='co'}
function cmBody(c){const ci=Math.max(.2,S.cty.inc),E=c.emp,cap=coCap(c),rb=roomBonus(c);
  if(CM_TAB==='sum'){const others=S.cos.filter(x=>x.id!==c.id);
    return `<div class="kv"><span>種類</span><span>${esc(COS[c.k].n)}・Lv${c.lv}${c.pub?'・上場':''}</span><span>会社の価値</span><span>${yen(c.val)}</span><span>先月の利益（本業）</span><span>${yen(c.last||0)}</span><span>社員の働き（売上−給料）</span><span class="${(c.empNet||0)>=0?'up':'dn'}">${(c.empNet||0)>=0?'+':''}${yen(c.empNet||0)}</span><span>社員</span><span>${num(E.n+E.key.length)}人 / ${num(cap)}人</span><span>雰囲気</span><span>${Math.round(E.mor)}</span></div>
    <h3>会社の名前</h3><div class="row chren"><input id="cmName" maxlength="12" value="${esc(c.name)}"><button class="b sm" type="button" data-cm="rename">変える</button></div>
    <h3>合併</h3>${others.length?`<p class="hint">ほかの自分の会社をこの会社に合併する。資本と価値・社員・オフィス・作品の売上を引きつぎ、規模が大きくなる（合併の費用：相手の価値の5%）。</p><div class="row"><select id="cmMerge">${others.map(x=>`<option value="${x.id}">${esc(x.name)}（${esc(COS[x.k].n)}・Lv${x.lv}）</option>`).join('')}</select><button class="b sm" type="button" data-cm="merge">合併する</button></div><div id="cmMergeBox"></div>`:'<p class="hint">自分の会社が2つ以上あると合併できる。</p>'}`}
  if(CM_TAB==='emp'){let h=`<div class="kv"><span>一般社員</span><span>${num(E.n)}人</span><span>主要メンバー</span><span>${E.key.length} / ${Math.min(12,2+c.lv)}人</span><span>上限（本社＋支社）</span><span>${num(cap)}人</span><span>一般社員の月給</span><span>${yen(empSal())}</span></div>
    <div class="seg"><button type="button" class="${E.auto?'on':''}" data-cm="eauto" data-v="1">おまかせで雇う</button><button type="button" class="${E.auto?'':'on'}" data-cm="eauto" data-v="0">自分で雇う</button></div>
    <h3>一般社員</h3><div class="row"><button class="b sm" type="button" data-cm="hire" data-n="1">+1人</button><button class="b sm" type="button" data-cm="hire" data-n="10">+10人</button><button class="b sm" type="button" data-cm="hire" data-n="100">+100人</button><button class="b sm ghost" type="button" data-cm="fire" data-n="10">−10人</button></div><p class="hint small">採用費は1人あたり月給の2か月分。社員は売上を生むが、景気が悪いと給料のほうが多くなることもある。</p>
    <h3>主要メンバー（個性あり）</h3>`;
    h+=E.key.length?E.key.map(k=>`<div class="shop"><div><div>${esc(k.name)} <span class="chip">${ROLES2[k.role]}</span> <span class="chip up">${TRAITS2[k.trait].n}</span></div><div class="muted small">腕 ${Math.round(k.sk)}・月給 ${yen(k.sal)}・${esc(TRAITS2[k.trait].d)}</div></div><button class="b sm ghost" type="button" data-cm="kfire" data-k="${k.id}">退職してもらう</button></div>`).join(''):'<p class="hint">まだいない。</p>';
    if(!E.cand||S.am-E.candAm>=3)E.cand=[mkKey(c),mkKey(c),mkKey(c)],E.candAm=S.am;
    h+=`<h3>応募してきた人</h3><p class="hint small">3か月ごとに入れかわる。受付の部屋があると、腕のいい人が来やすい。</p>${E.cand.map((k,i)=>`<div class="shop"><div><div>${esc(k.name)} <span class="chip">${ROLES2[k.role]}</span> <span class="chip up">${TRAITS2[k.trait].n}</span></div><div class="muted small">腕 ${Math.round(k.sk+rb.recep*2)}・月給 ${yen(k.sal)}・${esc(TRAITS2[k.trait].d)}</div></div><button class="b sm" type="button" data-cm="khire" data-i="${i}" ${E.key.length>=Math.min(12,2+c.lv)?'disabled':''}>採用する</button></div>`).join('')}`;
    return h}
  if(CM_TAB==='off'){let h=`<p class="hint">本社のほかに、ほかのまちや海外に支社を出せる。支社を出すと雇える人数が増え、その土地の市場で利益も増える（海外のほうが効果大）。毎月家賃がかかる。</p>`;
    h+=c.offices.map(o=>`<div class="shop"><div><div>${esc(o.nm)} <span class="chip">${OSZ[o.size].n}</span></div><div class="muted small">${o.hq?'本社':`${esc(locName(o.loc))}・家賃 月${yen(OSZ[o.size].rent*ci)}・+${num(OSZ[o.size].cap)}人`}</div></div><div class="row"><button class="b sm" type="button" data-cm="laygo" data-o="${o.id}">レイアウト</button>${o.hq?'':`<button class="b sm ghost" type="button" data-cm="close" data-o="${o.id}">閉める</button>`}</div></div>`).join('');
    if(c.offices.length<12){const locs=[...allTowns().map((T,i)=>['t:'+i,townName(T)]),...Object.entries(COUNTRIES).filter(([k,v])=>k!==S.ctyId&&!v.fict).map(([k,v])=>['c:'+k,v.n+'（海外）'])];
      h+=`<h3>支社を出す</h3><div class="row"><select id="cmLoc">${locs.map(([v,n])=>`<option value="${v}">${esc(n)}</option>`).join('')}</select><select id="cmSize">${Object.entries(OSZ).map(([k,z])=>`<option value="${k}">${z.n}（${yen(z.cost*ci)}・+${num(z.cap)}人）</option>`).join('')}</select><button class="b sm pri" type="button" data-cm="open">出す</button></div>`}
    return h}
  if(CM_TAB==='lay'){const o=c.offices.find(x=>x.id===c.layO)||c.offices[0];c.layO=o.id;const z=OSZ[o.size];
    let h=`<div class="row"><select id="cmLayO">${c.offices.map(x=>`<option value="${x.id}" ${x.id===o.id?'selected':''}>${esc(x.nm)}</option>`).join('')}</select><button class="b sm ghost" type="button" data-cm="layauto">おまかせで並べる</button></div><p class="hint small">下で部屋を選んでから、マスをタップして置く。</p><div class="roompal">${Object.entries(ROOMS).map(([k,r])=>`<button type="button" class="rpal ${CM_ROOM===k?'on':''}" data-cm="room" data-r="${k}" title="${esc(r.d||'')}">${r.ic} ${esc(r.n)}</button>`).join('')}</div>`;
    h+=`<div class="ogrid" style="grid-template-columns:repeat(${z.w},1fr)">${o.grid.map((t,i)=>`<button type="button" class="ocell" data-cm="cell" data-i="${i}" style="background:${ROOMS[t].col}"><span>${ROOMS[t].ic}</span><small>${esc(ROOMS[t].n)}</small></button>`).join('')}</div>`;
    const r=roomBonus(c);h+=`<p class="hint">この会社ぜんぶのオフィスの効果：作品の評価+${r.q.toFixed(1)}・利益+${Math.round(r.pm*100)}%・雰囲気+${r.mor}${r.train?`・研修室${r.train}`:''}${r.recep?`・受付${r.recep}`:''}</p><div class="hint small">${Object.entries(ROOMS).filter(([k])=>k!=='empty').map(([k,x])=>`${x.ic}${x.n}：${x.d}`).join('／')}</div>`;return h}
  return `<p class="hint">${PROD[c.k]?'作るものは会社のカード（「事業」→「会社」）で決める。人手が足りないと評価が下がる。':'この会社には作るものがない。'}</p>${PROD[c.k]?`<div class="kv">${['s','m','l'].map(sc=>`<span>${PSCALE[sc].n}</span><span>${yen(prodCost(c,sc))}・${num(prodNeed(c,sc))}人くらい</span>`).join('')}</div>`:''}`}
function locName(l){if(l==='home')return '本社';if(l.startsWith('t:')){const T=allTowns()[+l.slice(2)];return T?townName(T):'まち'}const k=l.slice(2);return (COUNTRIES[k]||{}).n||'海外'}
document.addEventListener('click',e=>{const b=e.target.closest('button');if(!b||!S)return;const d=b.dataset;
  if(d.cmtab){CM_TAB=d.cmtab;showCo();return}
  if(d.coman){showCo(d.coman,'sum');return}
  if(!d.cm)return;const c=coOf(CM_ID);if(!c)return;const ci=Math.max(.2,S.cty.inc),E=c.emp;
  switch(d.cm){
   case 'rename':{const v=($('#cmName')||{}).value||'';const nm=v.trim().slice(0,12);if(nm&&nm!==c.name){log(`会社「${c.name}」の名前を「${nm}」に変えた`,'good');c.name=nm}break}
   case 'merge':{const o=coOf(($('#cmMerge')||{}).value);if(!o)break;const fee=Math.round(o.val*.05);$('#cmMergeBox').innerHTML=`<div class="card warn confirm-inline"><p class="mtext">「${esc(o.name)}」を「${esc(c.name)}」に合併する？（費用 ${yen(fee)}・元に戻せない）</p><div class="row"><button class="b sm warnb" type="button" data-cm="merge2" data-o="${o.id}">合併する</button></div></div>`;return}
   case 'merge2':{const o=coOf(d.o);if(!o)break;coInit(o);const fee=Math.round(o.val*.05);if(S.money<fee){toast('お金が足りない');return}outc('co',fee);
     c.cap+=o.cap;c.val=Math.round((c.val+o.val)*1.05);c.lv=Math.min(8,Math.max(c.lv,o.lv)+(o.lv>=c.lv-1?1:0));c.pub=c.pub||o.pub;E.n+=o.emp.n;for(const k of o.emp.key)if(E.key.length<12)E.key.push(k);else E.n++;
     for(const of of o.offices){of.hq=0;of.nm=`${o.name}（元本社）`;if(of.loc==='home')of.loc='t:0';c.offices.push(of)}if(o.pr&&o.pr.sales){c.pr=c.pr||{};c.pr.sales=(c.pr.sales||[]).concat(o.pr.sales)}
     S.cos=S.cos.filter(x=>x.id!==o.id);if(S.cfocus===o.id)S.cfocus=c.id;tl(`「${o.name}」と「${c.name}」が合併した`);log(`「${o.name}」を「${c.name}」に合併した`,'good');ad('rep',2);break}
   case 'eauto':E.auto=+d.v;break;
   case 'hire':{const n=Math.min(+d.n,coCap(c)-E.n-E.key.length);if(n<=0){toast('もう雇えない（オフィスを広げよう）');return}const cost=Math.round(n*empSal()*2);if(S.money<cost){toast('お金が足りない');return}outc('co',cost);E.n+=n;break}
   case 'fire':E.n=Math.max(0,E.n-(+d.n));E.mor=clamp(E.mor-3);break;
   case 'kfire':{const k=E.key.find(x=>x.id===d.k);if(k){E.key=E.key.filter(x=>x!==k);outc('co',k.sal*3);E.mor=clamp(E.mor-4);log(`${k.name}さんに退職してもらった（退職金 ${yen(k.sal*3)}）`,'life')}break}
   case 'khire':{const k=E.cand&&E.cand[+d.i];if(!k||E.key.length>=Math.min(12,2+c.lv))return;const rb=roomBonus(c);k.sk=Math.min(99,k.sk+rb.recep*2);const cost=k.sal*2;if(S.money<cost){toast('お金が足りない');return}outc('co',cost);E.key.push(k);E.cand.splice(+d.i,1);log(`「${c.name}」に${k.name}さん（${ROLES2[k.role]}・${TRAITS2[k.trait].n}）を採用した`,'good');break}
   case 'open':{const loc=($('#cmLoc')||{}).value,sz=($('#cmSize')||{}).value||'s';const z=OSZ[sz],cost=Math.round(z.cost*ci);if(S.money<cost){toast('お金が足りない');return}outc('co',cost);const o={id:'o'+RI(1e4,9e4),loc,nm:`${locName(loc).replace('（海外）','')}支社`,size:sz,grid:null};o.grid=autoGrid(c,sz);c.offices.push(o);tl(`「${c.name}」が${o.nm}を開いた`);log(`「${c.name}」の${o.nm}（${z.n}）を開いた`,'good');break}
   case 'close':{c.offices=c.offices.filter(o=>o.id!==d.o||o.hq);E.n=Math.min(E.n,coCap(c));break}
   case 'laygo':c.layO=d.o;CM_TAB='lay';break;
   case 'layauto':{const o=c.offices.find(x=>x.id===c.layO);if(o)o.grid=autoGrid(c,o.size);break}
   case 'room':CM_ROOM=d.r;break;
   case 'cell':{const o=c.offices.find(x=>x.id===c.layO);if(o)o.grid[+d.i]=CM_ROOM;break}
  }
  save();showCo();try{renderPanel()}catch(_){}});
document.addEventListener('change',e=>{if(e.target.id==='cmLayO'){const c=coOf(CM_ID);if(c){c.layO=e.target.value;showCo()}}});
// 会社のカードに「管理」ボタン
const _coHtml34=coHtml;coHtml=function(){let h=_coHtml34();for(const c of (S.cos||[])){coInit(c);const re=new RegExp(`(<button class="b sm[^"]*" type="button" data-cfocus="${c.id}")`);h=h.replace(re,`<button class="b sm pri" type="button" data-coman="${c.id}">🏢 管理（社員・オフィス）</button>$1`)}return h+coMarketHtml()};

// ----- ほかの会社の買収（市場に出ている会社） -----
const CO_PREFIX=['ミライ','ひかり','あおば','サクラ','ノース','ブルー','ツバサ','ホシゾラ','アカネ','グリーン','ユメ','シンセイ'];
const CO_SUFFIX={food:'フーズ',apparel:'ウェア',game:'ゲームス',it:'テック',estate:'不動産',media:'出版',space:'スペース'};
function coMarket(){if(!S.coMkt||S.am-S.coMkt.am>=12){const ks=Object.keys(COS).filter(k=>!COS[k].year||S.y>=COS[k].year);S.coMkt={am:S.am,list:[0,1,2,3].map(()=>{const k=pick(ks),lv=RI(1,6),cap=Math.round(COS[k].c*(1+lv*.8));const val=Math.round(cap*R(.8,1.6));return {id:'m'+RI(1e4,9e4),k,lv,cap,val,name:pick(CO_PREFIX)+CO_SUFFIX[k],emp:Math.round(EMP_CAP[lv]*R(.3,.7))}})}}return S.coMkt.list}
function coMarketHtml(){if(age()<20)return '';const ci=Math.max(.2,S.cty.inc);const L=coMarket();
  return `<h3>ほかの会社を買収する</h3><p class="hint">市場に出ている会社。買収すると自分の会社になり、社員もそのまま引きつぐ（1年ごとに入れかわる）。会社は${CO_MAX2}社まで。</p>${L.map(m=>`<div class="shop"><div><div>${esc(m.name)} <span class="muted small">${esc(COS[m.k].n)}・Lv${m.lv}</span></div><div class="muted small">価値 ${yen(m.val*ci)}・社員 ${num(m.emp)}人</div></div><button class="b sm" type="button" data-coby="${m.id}" ${S.money<m.val*ci*1.3||S.cos.length>=CO_MAX2?'disabled':''}>買収 ${yen(m.val*ci*1.3)}</button></div>`).join('')}`}
document.addEventListener('click',e=>{const b=e.target.closest('[data-coby]');if(!b||!S)return;const m=(S.coMkt&&S.coMkt.list||[]).find(x=>x.id===b.dataset.coby);if(!m||S.cos.length>=CO_MAX2)return;const ci=Math.max(.2,S.cty.inc),p=Math.round(m.val*ci*1.3);if(S.money<p)return;
  outc('co',p);const co={id:'c'+Date.now().toString(36)+RI(10,99),k:m.k,name:m.name,lv:m.lv,cap:m.cap,val:Math.round(m.val*ci),born:S.am,pub:0,last:0};coInit(co);co.emp.n=Math.min(m.emp,coCap(co));S.cos.push(co);S.coMkt.list=S.coMkt.list.filter(x=>x!==m);
  tl(`会社「${m.name}」を買収した`);log(`「${m.name}」を${yen(p)}で買収した`,'good');ad('rep',3);snd('buy');save(true);render()});

// ----- まちの名前と、まちの買収 -----
function townRenameHtml(){const T=S.town,home=T===homeTown()&&!S.towns2.includes(T);const can=!home||S.role==='mayor'||S.role==='adviser';
  return `<div class="row chren"><input id="townNm" maxlength="10" placeholder="まちの名前" value="${esc(townName(T))}" ${can?'':'disabled'}><button class="b sm" type="button" data-act="townRen" ${can?'':'disabled'}>名前を変える</button></div>${can?'':'<p class="hint small">ふるさとのまちの名前は、市長になると変えられる。</p>'}`}
const TOWN_OFFER_NM=['しおかぜ町','みどり台','ひなた市','あけぼの町','いずみ野','かざぐるま村','こはく市','ほたる町','つきみ野','すずらん町','わかば市','あおぞら町'];
function townMarket(){if(!S.townMkt||S.am-S.townMkt.am>=12){S.townMkt={am:S.am,list:[0,1,2].map(()=>{const rt=pick(['大都市','地方都市','町村']),dev=RI(10,55);return {id:'tw'+RI(1e4,9e4),nm:pick(TOWN_OFFER_NM),rt,dev,shops:RI(2,7),price:Math.round((2e8+dev*4e7)*(rt==='大都市'?2.5:rt==='地方都市'?1.4:1))}})}}return S.townMkt.list}
function townBuyHtml(){if(age()<25)return '';const ci=Math.max(.2,S.cty.inc);const full=allTowns().length>=7;
  return `<h3>まちを買収する</h3><p class="hint">開発会社から、すでにお店や施設があるまちの開発権を買う。1年ごとに入れかわる。持てるまちは、ふるさとのほかに6つまで。</p>${townMarket().map(o=>`<div class="shop"><div><div>${esc(o.nm)} <span class="muted small">${esc(o.rt)}</span></div><div class="muted small">発展度 約${o.dev}・お店や施設 ${o.shops}つ</div></div><button class="b sm" type="button" data-twbuy="${o.id}" ${full||S.money<o.price*ci?'disabled':''}>買収 ${yen(o.price*ci)}</button></div>`).join('')}`}
const _devHtml34=devHtml;devHtml=function(){return townRenameHtml()+_devHtml34()+townBuyHtml()};
document.addEventListener('click',e=>{const b=e.target.closest('button');if(!b||!S)return;
  if(b.dataset.act==='townRen'){const nm=(($('#townNm')||{}).value||'').trim().slice(0,10);if(!nm)return;const old=townName(S.town);S.town.nm=nm;log(`まちの名前を「${old}」から「${nm}」に変えた`,'good');tl(`まちの名前を「${nm}」にした`);save(true);render();return}
  if(b.dataset.twbuy){const o=(S.townMkt&&S.townMkt.list||[]).find(x=>x.id===b.dataset.twbuy);if(!o||allTowns().length>=7)return;const ci=Math.max(.2,S.cty.inc),p=Math.round(o.price*ci);if(S.money<p)return;outc('dev',p);
    const T=newTown(o.rt);T.nm=o.nm;T.rt=o.rt;T.kind='bought';T.support=55;T.reqs=[];T.sel=-1;T.bonus=Math.round(o.dev*.5);const kinds=['stall','cafe','restaurant','gym','apparel','park','library','tourism'];let n=o.shops;
    for(let i=0;i<T.tiles.length&&n>0;i++){if(T.tiles[i].t==='empty'&&chance(.5)){T.tiles[i]={t:pick(kinds),lv:RI(1,2)};initShop(T.tiles[i]);n--}}
    if(!S.towns2)S.towns2=[];S.towns2.push(T);S.townMkt.list=S.townMkt.list.filter(x=>x!==o);tl(`まち「${o.nm}」を買収した`);log(`まち「${o.nm}」の開発権を${yen(p)}で買った`,'good');ad('rep',3);snd('buy');save(true);render()}});
OLD_VERS.unshift(['v1.3','versions/v1.3/','会社で作るもの・ひみつの実績・デバッグモードが入ったころ（v1.3.1）']);
