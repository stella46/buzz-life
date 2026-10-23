
// ===== v2.0：軽さの工夫（実績の確認を分けて行う） =====
// 毎月すべての実績を調べず、まだ取っていないものを4回に分けて確認する（一生の終わりなどは全部）
checkAch=(function(){const toast2=(n)=>{toast('実績解除：'+n);snd('buy')};return function(kind){if(!S)return;const before=new Set(Object.keys(META.ach));let i=0;const part=kind==='m'?(S.am%4):-1;
  for(const a of ACH){const [id,n,,f,h,hn]=a;if(META.ach[id]){i++;continue}if(part>=0&&(i++%4)!==part)continue;let ok=false;try{ok=f(kind)}catch(_){}if(ok){META.ach[id]=1;saveMeta();toast2(h?('ひみつの実績を解除：'+hn):n)}}
  if(S.spouse)S.flags.everMarried=1}})();
// スロット数の実績は、一覧のまとめだけで数える（重い読み込みをしない）
(function(){const a=ACH.find(x=>x[0]==='slot5');if(a)a[3]=()=>{try{return Object.keys(slotInfoAll()).length>=5}catch(_){return false}}})();

// ===== v2.0：超大企業（Lv12・数百万人まで） =====
const EMP_CAP3=[0,10,30,100,300,1000,3000,10000,30000,100000,300000,1000000,3000000];
Object.assign(OSZ,{xl:{n:'本社ビル群（キャンパス）',w:7,h:5,cap:50000,cost:3e10,rent:5e8,lv:8},xxl:{n:'研究都市・工業団地',w:8,h:6,cap:300000,cost:3e11,rent:3e9,lv:10}});
coCap=function(c){let cap=EMP_CAP3[Math.min(12,c.lv)]||10;for(const o of (c.offices||[]))if(!o.hq)cap+=OSZ[o.size].cap;for(const s of (c.subco||[]))cap+=0;return cap};
const DEPTS={dev:{n:'開発本部',d:'作品の評価+5'},sales:{n:'営業本部',d:'利益+5%'},global:{n:'海外事業部',d:'海外支社の効果×1.5'},admin:{n:'管理本部',d:'雰囲気+5・辞める人が減る'}};
function groupEmp(c){let n=(c.emp?c.emp.n+c.emp.key.length:0);for(const s of (c.subco||[]))n+=s.emp;return n}
function totalEmp(){return (S.cos||[]).reduce((a,c)=>a+groupEmp(c),0)}
function lvUpCost(c){return Math.round(COS[c.k].c*Math.pow(c.lv,2.6)*Math.max(.2,S.cty.inc))}
// 子会社
const SUBCO=[['販売会社',.4],['物流会社',.5],['研究所',.6],['海外現地法人',.8],['人材派遣会社',.3],['広告代理店',.5],['保険会社',.9],['銀行',1.2]];
function subcoCost(c,i){return Math.round(COS[c.k].c*(3+i*2)*Math.max(.2,S.cty.inc)*SUBCO[i][1]*3)}
function megaCoMonth(){for(const c of (S.cos||[])){coInit(c);
  if(c.dept==='admin')c.emp.mor=clamp(c.emp.mor+.5);if(c.dept==='sales'&&(c.last||0)>0)inc('co',Math.round(c.last*.05));if(c.dept==='global'&&c.mkNet)inc('co',Math.round(c.mkNet*.5));
  let v=0;for(const s of (c.subco||[])){const p=Math.round(s.cost*.0065*ecoMul()*R(.6,1.4));s.last=p;v+=p;s.emp=Math.round(s.emp*(1+R(-.005,.01)))}if(v>0)inc('co',v);else if(v<0)outc('co',-v);c.subNet=v}
  if(S.hold){const v=(S.cos||[]).reduce((a,c)=>a+Math.max(0,c.last||0),0)*.05;if(v)inc('co',Math.round(v))}}
const _mh35=monthHook11;monthHook11=function(){_mh35();try{megaCoMonth()}catch(e){console.error(e)}};
// 作品の評価に「開発本部」
const _pe35=prodExtra;prodExtra=function(c,a){return _pe35(c,a)+(c.dept==='dev'?5:0)};
function megaCoHtml(c){const ci=Math.max(.2,S.cty.inc);let h='';const tot=groupEmp(c);
  if(c.lv>=8&&c.lv<12){const cst=lvUpCost(c),need=Math.floor(coCap(c)*.5);h+=`<h3>さらに大きくする（Lv${c.lv+1}）</h3><p class="hint">大企業から超大企業へ。雇える人数が大きく増える。社員が上限の半分以上いることが条件。</p><div class="row"><button class="b sm" type="button" data-cm="lvup" ${S.money<cst||c.emp.n<need?'disabled':''}>Lv${c.lv+1}にする ${yen(cst)}</button></div>${c.emp.n<need?`<p class="hint small">社員があと${num(need-c.emp.n)}人必要</p>`:''}`}
  else if(c.lv<8)h+='<p class="hint small">Lv8になると、さらに大きく（Lv12まで）できる。</p>';
  if(tot>=1000){h+=`<h3>部署</h3><p class="hint">社員が多いので、部署ごとにおまかせで動いている。力を入れる部署を選べる。</p><div class="seg wrapseg">${Object.entries(DEPTS).map(([k,dp])=>`<button type="button" class="${c.dept===k?'on':''}" data-cm="dept" data-v="${k}">${dp.n}</button>`).join('')}</div><p class="hint small">${c.dept?esc(DEPTS[c.dept].d):'まだ選んでいない'}</p>`}
  if(c.lv>=4){c.subco=c.subco||[];h+=`<h3>子会社（グループ会社）</h3><p class="hint">子会社をつくると、グループの社員と利益が増える。</p>${c.subco.map(s=>`<div class="shop"><div><div>${esc(s.n)}</div><div class="muted small">社員 ${num(s.emp)}人・先月 ${s.last>=0?'+':''}${yen(s.last||0)}</div></div></div>`).join('')}<div class="row"><select id="cmSub">${SUBCO.map((s,i)=>`<option value="${i}">${s[0]}（${yen(subcoCost(c,i))}）</option>`).join('')}</select><button class="b sm" type="button" data-cm="subco" ${c.subco.length>=10?'disabled':''}>子会社をつくる</button></div>`}
  if((S.cos||[]).length>=3)h+=`<h3>ホールディングス</h3><p class="hint">自分の会社が3社以上あると、持ち株会社（ホールディングス）にまとめられる。すべての会社の利益の5%がさらに入る。</p><div class="row"><button class="b sm" type="button" data-cm="hold" ${S.hold?'disabled':''}>${S.hold?`「${esc(S.hold)}」にまとめている`:`ホールディングスにする ${yen(5e9*ci)}`}</button></div>`;
  return h}
// 管理画面の概要に追加
const _cmBody35=cmBody;cmBody=function(c){let h=_cmBody35(c);if(CM_TAB==='sum')h=h.replace('<h3>会社の名前</h3>',`${groupEmp(c)>c.emp.n+c.emp.key.length?`<p class="hint">グループ全体の社員：${num(groupEmp(c))}人</p>`:''}${megaCoHtml(c)}<h3>会社の名前</h3>`);if(CM_TAB==='off')h=h.replace(/<option value="(xl|xxl)">[^<]*<\/option>/g,(m0,k)=>c.lv>=OSZ[k].lv?m0:'');return h};
document.addEventListener('click',e=>{const b=e.target.closest('[data-cm]');if(!b||!S)return;const d=b.dataset,c=coOf(CM_ID);if(!c)return;const ci=Math.max(.2,S.cty.inc);
  if(d.cm==='lvup'){const cst=lvUpCost(c);if(S.money<cst||c.lv>=12)return;outc('co',cst);c.cap+=cst;c.lv++;c.val=Math.round(c.val*1.4+cst*.6);tl(`「${c.name}」が超大企業（Lv${c.lv}）に`);log(`「${c.name}」をLv${c.lv}にした`,'good');ad('rep',4)}
  else if(d.cm==='dept'){c.dept=d.v}
  else if(d.cm==='subco'){const i=+(($('#cmSub')||{}).value||0),cst=subcoCost(c,i);if(S.money<cst||(c.subco||[]).length>=10)return;outc('co',cst);c.subco=c.subco||[];c.subco.push({n:`${c.name}${SUBCO[i][0]}`,cost:cst,emp:Math.round(cst/2e7)+RI(10,200),last:0});log(`子会社「${c.name}${SUBCO[i][0]}」をつくった`,'good')}
  else if(d.cm==='hold'){const cst=Math.round(5e9*ci);if(S.hold||S.money<cst)return;outc('co',cst);S.hold=`${String(S.name).split(' ')[0]}ホールディングス`;tl(`「${S.hold}」を設立`);log(`会社をまとめて「${S.hold}」を設立した`,'good');ad('rep',5)}
  else return;e.stopImmediatePropagation();save(true);showCo();try{renderPanel()}catch(_){}},true);
