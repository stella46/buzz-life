
// ===== v3.0.13：跡継ぎ（家を次の世代へ）／相続／会社・芸能事務所・まちの引き継ぎ／家族チャンネル =====

// ----- 孫：大人になった子どもに、ときどき子どもが生まれる -----
const GK_N={男:['はると','れん','そうた','ゆうと','りく','あおと','そら','いつき'],女:['ひなた','めい','ゆい','さくら','あおい','こはる','りん','つむぎ']};
{const _mh85=monthHook11;monthHook11=function(){_mh85.apply(this,arguments);try{if(!S||!S.kids)return;for(const k of S.kids){const a=Math.floor((S.am-k.born)/12);if(a<24||a>45)continue;if(!k.gk)k.gk=[];if(k.gk.length<3&&chance(.006)){const g=chance(.5)?'男':'女';const n={name:pick(GK_N[g]),g,born:S.am};k.gk.push(n);log(`${k.name}に子ども（${n.name}）が生まれた。孫ができた！`,'good');tl(`孫の${n.name}が生まれた`)}}}catch(e){console.error(e)}}}
function kAge(k){return Math.floor((S.am-k.born)/12)}
// 跡継ぎの候補：18歳以上の子ども・孫（亡くなったときは、年齢に関係なく）
function heirCands(any){const L=[];(S.kids||[]).forEach((k,i)=>{if(k._gkOf!=null)return;if(any||kAge(k)>=18)L.push({id:'k'+i,name:k.name,age:kAge(k),rel:'子ども',k,i});(k.gk||[]).forEach((g,j)=>{if(any||kAge(g)>=18)L.push({id:'g'+i+'_'+j,name:g.name,age:kAge(g),rel:`孫（${k.name}の子）`,k:g,pi:i,gi:j})})});return L}
function heirNow(){const id=S.heirId;return id?heirCands(true).find(x=>x.id===id):null}

// ----- 「人生」→「人」に、跡継ぎのカードと家族チャンネル -----
{const _kh85=koryuHtml;koryuHtml=function(){let h=_kh85.apply(this,arguments);try{if(!S||!(S.kids||[]).length)return h;const hn=heirNow(),C=heirCands(false);
 let c=`<div class="card heircard"><div class="hd"><span>👑 跡継ぎ</span><b>${hn?esc(hn.name)+'（'+hn.age+'歳）':'まだ決めていない'}</b></div><p class="hint">18歳以上の子ども（や孫）を跡継ぎにすると、好きなときに隠居して、人生を託せます。亡くなったときも、跡継ぎとして続けられます。</p>`;
 c+=C.length?`<div class="row wrap">${C.map(x=>`<button class="b sm ${S.heirId===x.id?'on':''}" type="button" data-heir2="${x.id}">${esc(x.name)}<small class="bfx">${esc(x.rel)}・${x.age}歳</small></button>`).join('')}</div>`:'<p class="hint small">いちばん上の子どもが18歳になると、跡継ぎを決められます。</p>';
 if(hn&&hn.age>=18)c+=`<div class="row"><button class="b sm pri" type="button" data-succ="retire">隠居して、${esc(hn.name)}に託す</button></div>`;
 c+='</div>';
 const kidsYoung=(S.kids||[]).some(k=>kAge(k)<13),famCh=(S.subch||[]).some(x=>x.fam);
 if(S.snsOpen&&kidsYoung&&!famCh&&(S.subch||[]).length<3)c+=`<div class="card"><div class="hd"><span>👪 家族チャンネル</span></div><p class="hint">子どもたちとの日々を発信するチャンネルを作れます（サブチャンネルの1つになります）。見てくれる人は多いけれど、子どものプライバシーには気をつけましょう。</p><div class="row"><button class="b sm" type="button" data-famch="1">家族チャンネルを始める</button></div></div>`;
 const i=h.indexOf('<h3>');return i>=0?h.slice(0,i)+c+h.slice(i):h+c}catch(e){console.error(e)}return h}}
document.addEventListener('click',e=>{const b=e.target.closest('[data-heir2],[data-famch]');if(!b||!S)return;
 if(b.dataset.heir2){S.heirId=S.heirId===b.dataset.heir2?null:b.dataset.heir2;if(S.heirId){S.endless=1;if(!S.lineage)S.lineage=[];const x=heirNow();log(`${x.name}を跡継ぎに決めた`,'life');tl(`${x.name}を跡継ぎに決めた`)}save();renderPanel();return}
 if(b.dataset.famch){if(!S.subch)S.subch=[];S.subch.push({id:'fam'+S.am,name:`${surOf(S)}家チャンネル`,genre:'vlog',style:'chill',plan:'normal',f:Math.round((S.f[S.main]||0)*.05),core:.2,anti:.01,fam:1});ad('priv',-5);log('家族チャンネルを始めた','sns');tl('家族チャンネルを始めた');save();renderPanel()}});
// 60歳をすぎたら、跡継ぎのことを秘書が知らせる
{const _st85=secTip;secTip=function(){try{if(S&&age()>=60&&!S.heirId&&heirCands(false).length&&!S.flags.heirTold){S.flags.heirTold=S.am;return ['そろそろ跡継ぎを決めておきませんか？ 早めに隠居して託すこともできます','life:ppl']}}catch(_){}return _st85.apply(this,arguments)}}

// ----- 相続税（日本の税率を目安に） -----
function inhTax(v){const T=[[1e7,.1,0],[3e7,.15,5e5],[5e7,.2,2e6],[1e8,.3,7e6],[2e8,.4,1.7e7],[3e8,.45,2.7e7],[6e8,.5,4.2e7],[Infinity,.55,7.2e7]];if(v<=3.6e7)return 0;const x=v-3.6e7;for(const [lim,r,d] of T)if(x<=lim)return Math.max(0,Math.round(x*r-d));return 0}
function officeVal(o){try{return o&&o.lv?Math.round(OFFICE[o.lv].cost*S.cty.inc*.6+(o.talents||[]).reduce((a,t)=>a+(t.f||0)*20,0)):0}catch(_){return 0}}

// ----- 引き継ぎの画面 -----
let SUCC=null,SUCC_RUN=0;
function succOpen(alive,defId){const C=heirCands(!alive);if(!C.length){toast(alive?'18歳以上の子どもか孫がいません':'引き継げる人がいません');return}
 const hid=(defId&&C.find(x=>x.id===defId))?defId:(S.heirId&&C.find(x=>x.id===S.heirId)?S.heirId:C[0].id);
 SUCC={alive,id:hid,don:0,cos:{},off:'keep'};for(const c of (S.cos||[]))SUCC.cos[c.id]='keep';succRender()}
function succRender(){const s=SUCC,W=Math.max(0,S.money+S.inv-S.debt),C=heirCands(!s.alive),x=C.find(y=>y.id===s.id)||C[0];
 const realKids=(S.kids||[]).filter(k=>k._gkOf==null).length,others=Math.max(0,realKids-(x.id[0]==='k'?1:0));const don=Math.round(W*s.don);const rest=W-don;const share=others?.5:1;const gross=Math.round(rest*share);const tax=inhTax(gross);const net=gross-tax;
 const seg=(attr,val,opts)=>`<div class="seg wrapseg">${opts.map(([k,n])=>`<button type="button" class="${val===k?'on':''}" ${attr}="${k}">${n}</button>`).join('')}</div>`;
 let h=`<span hidden data-act="close"></span><div class="mcat life">次の世代へ</div><h2>${s.alive?'隠居して託す':'人生を引き継ぐ'}</h2><div class="fbody">`;
 h+=`<h3>👑 跡継ぎ</h3><div class="row wrap">${C.map(y=>`<button class="b sm ${y.id===s.id?'on':''}" type="button" data-sx="id" data-v="${y.id}">${esc(y.name)}<small class="bfx">${esc(y.rel)}・${y.age}歳</small></button>`).join('')}</div>`;
 h+=`<h3>💰 お金</h3><div class="kv"><span>資産</span><span>${yen(W)}</span></div><p class="hint small">寄付する割合（評判と幸福が上がり、相続税もかかりません）</p>${seg('data-sdon',String(s.don),[['0','しない'],['0.1','10%'],['0.3','30%'],['0.5','50%']])}
  <div class="kv"><span>寄付</span><span>${yen(don)}</span>${others?`<span>ほかの子ども（${others}人）へ</span><span>${yen(rest-gross)}</span>`:''}<span>${esc(x.name)}が受けつぐ分</span><span>${yen(gross)}</span><span>相続税</span><span class="dn">-${yen(tax)}</span><span><b>手もとに残るお金</b></span><span><b>${yen(net)}</b></span></div>${x.age<18?'<p class="hint small">18歳になるまでは、家族があずかります。</p>':''}`;
 if((S.cos||[]).length){h+=`<h3>🏢 会社</h3><p class="hint small">継ぐ：自分で経営する（社員の雰囲気は少し下がる）／任せる：役員に経営を任せ、株を持って配当を受け取る／売る：会社の価値の85%を受け取る／たたむ：会社をなくす</p>`;
  for(const c of S.cos)h+=`<div class="card"><div class="hd"><span>${esc(c.name)}</span><span class="muted small">${esc(COS[c.k].n)}・Lv${c.lv}・価値 ${yen(c.val)}</span></div><div class="seg wrapseg">${[['keep','継ぐ'],['stock','任せる（株）'],['sell','売る'],['close','たたむ']].map(([k,n])=>`<button type="button" class="${s.cos[c.id]===k?'on':''}" data-sco="${c.id}" data-v="${k}">${n}</button>`).join('')}</div></div>`}
 if(S.office&&S.office.lv){const o=S.office;h+=`<h3>🎤 芸能事務所</h3><p class="hint small">${esc(OFFICE[o.lv].n)}・タレント${(o.talents||[]).length}人・価値 約${yen(officeVal(o))}<br>継ぐ：そのまま継ぐ（独立するタレントもいる）／売る／たたむ／タレントを連れて新しく：小さな事務所から、タレントといっしょに出直す</p>${seg('data-soff',s.off,[['keep','継ぐ'],['sell','売る'],['close','たたむ'],['new','タレントを連れて新しく']])}`}
 const towns=1+((S.towns2||[]).length);h+=`<h3>🏙 まち</h3><p class="hint small">まち（${towns}つ）は引き継げません。別の人が引き継ぎ、跡継ぎは新しいまちから始めます。研究・大計画・世界の人口は、そのまま残ります。</p>`;
 h+=`<h3>📱 SNS</h3><p class="hint small">跡継ぎは自分の新しいアカウントで始めます。親の知名度で、少し見に来てくれる人がいます。${(S.subch||[]).some(z=>z.fam)?'家族チャンネルは跡継ぎが引き継ぎます。':''}</p>`;
 h+=`</div><div class="row"><button class="b pri" type="button" data-sgo="1">${s.alive?'隠居して託す':'この内容で引き継ぐ'}</button><button class="b ghost" type="button" data-sgo="0">やめる</button></div>`;
 const m=$('#mcard');if(!$('#modal').hidden&&m.dataset.kind==='succ'){const f=m.querySelector('.fbody'),st=f?f.scrollTop:0;m.innerHTML=h;const f2=m.querySelector('.fbody');if(f2)f2.scrollTop=st;return}
 openModal(h);m.classList.add('fixedsize');m.dataset.kind='succ'}
document.addEventListener('click',e=>{const b=e.target.closest('[data-sx],[data-sdon],[data-sco],[data-soff],[data-sgo],[data-succ]');if(!b||!S)return;
 if(b.dataset.succ){succOpen(true);return}if(!SUCC)return;
 if(b.dataset.sx){SUCC.id=b.dataset.v;succRender();return}
 if(b.dataset.sdon!=null){SUCC.don=+b.dataset.sdon;succRender();return}
 if(b.dataset.sco){SUCC.cos[b.dataset.sco]=b.dataset.v;succRender();return}
 if(b.dataset.soff){SUCC.off=b.dataset.soff;succRender();return}
 if(b.dataset.sgo!=null){if(b.dataset.sgo==='0'){SUCC=null;closeModal();return}succGo()}});
function succGo(){const s=SUCC;const C=heirCands(!s.alive),x=C.find(y=>y.id===s.id);if(!x)return;closeModal();
 let idx=x.i;if(x.id[0]==='g'){const g=x.k;S.kids.push({name:g.name,g:g.g,born:g.born,_gkOf:x.pi});idx=S.kids.length-1}
 S.succPlan={don:s.don,cos:Object.assign({},s.cos),off:s.off,gk:x.id[0]==='g'?x.pi:null,heirName:x.name};SUCC=null;SUCC_RUN=1;
 try{if(s.alive)retireTo(idx);else continueAsChild(idx,false)}finally{SUCC_RUN=0}}
// これまでの入り口（「この子に託す」・終わりの画面の子どもボタン）は、引き継ぎの画面を通す
{const _rt85=retireTo;retireTo=function(i){if(SUCC_RUN)return _rt85.apply(this,arguments);const k=(S.kids||[])[i];succOpen(true,k?'k'+i:null)}}
{const _ca85=continueAsChild;continueAsChild=function(i,alive){if(!SUCC_RUN&&!alive){succOpen(false,'k'+i);return}
 const P=S,plan=P.succPlan||{don:0,cos:{},off:'keep'};const W=Math.max(0,P.money+P.inv-P.debt);
 const r=_ca85.apply(this,arguments);
 try{if(S&&S!==P){const a=age(),realKids=(P.kids||[]).filter(k=>k._gkOf==null).length,isGk=plan.gk!=null,others=Math.max(0,realKids-(isGk?0:1));
  // お金：寄付→分配→相続税
  const don=Math.round(W*(plan.don||0)),rest=W-don,gross=Math.round(rest*(others?.5:1)),tax=inhTax(gross),net=Math.max(0,gross-tax);
  if(a>=18){S.money=net;S.trust=0}else{S.money=0;S.trust=net}
  if(don>0){ad('rep',Math.min(20,3+Math.log10(don+1)));log(`親の遺産から ${yen(don)} を寄付した`,'good')}
  if(tax>0)log(`相続税 ${yen(tax)} を払った`,'bad');
  // 会社
  const keep=[],stocks=(P.stocks||[]).slice();let cash=0;
  for(const c of (P.cos||[])){const ch=plan.cos[c.id]||'keep';
   if(ch==='keep'){try{coInit(c);c.emp.mor=Math.max(20,(c.emp.mor||60)-15)}catch(_){}keep.push(c)}
   else if(ch==='stock')stocks.push({name:c.name,k:c.k,lv:c.lv,val:c.val,am:S.am});
   else if(ch==='sell')cash+=Math.round(c.val*.85)}
  S.cos=keep;S.stocks=stocks;
  const prev=Object.assign({},P.prevCo||{});for(const c of (P.cos||[])){const q=prev[c.k];if(!q||c.lv>q.lv||c.val>q.val)prev[c.k]={name:c.name,lv:c.lv,val:c.val,gen:P.gen||1}}S.prevCo=prev;
  // 芸能事務所
  const o=S.office;if(o&&o.lv){const off=plan.off||'keep';const reset=()=>{o.lv=0;for(const k in o.staff)o.staff[k]=0;o.talents=[]};
   if(off==='keep'){const n0=o.talents.length;o.talents=o.talents.filter(()=>!chance(.35));if(n0>o.talents.length)log(`所属タレントのうち ${n0-o.talents.length}人 が独立した`,'life')}
   else if(off==='sell'){cash+=officeVal(o);reset()}
   else if(off==='close')reset();
   else if(off==='new'){const t=o.talents;reset();o.lv=1;o.talents=t.slice(0,OFFICE[1].tal||3);log('タレントを連れて、新しい事務所で出直した','life')}}
  if(cash>0){if(a>=18)S.money+=cash;else S.trust=(S.trust||0)+cash;log(`売った会社・事務所の代金 ${yen(cash)} を受け取った`,'good')}
  // まち：引き継げない（別の人へ）。跡継ぎは新しいまちから
  const tn=(()=>{try{return townName(P.town)}catch(_){return 'ふるさと'}})();
  try{S.town=newTown(P.town&&P.town.rt||'地方都市');S.towns2=[];S.role=null;log(`まち（${tn}など）は、別の人が引き継いだ`,'life')}catch(_){}
  // 孫として始めたとき：家族を整える
  if(isGk){const mid=P.kids[plan.gk];if(mid){const role=mid.g==='男'?'父':'母';const pp={id:'pp',name:fullNameFrom(P,mid.name),role,trait:'やさしい',rel:75,alive:true,age0:Math.floor(mid.born/12)};S.fam={fa:role==='父'?pp:null,mo:role==='母'?pp:null,single:true};S.sibs=[];tl(`祖父母（${P.name}）から、家を受けついだ`)}}
  // 家族チャンネルは跡継ぎへ
  const fc=(P.subch||[]).find(z=>z.fam);if(fc){if(!S.subch)S.subch=[];S.subch.push(Object.assign({},fc,{name:fc.name}))}
  S.heirId=null;delete S.succPlan;save(true);render()}}catch(e){console.error(e)}return r}}

// ----- 株（任せた会社）：毎月、配当が入る -----
{const _mh85b=monthHook11;monthHook11=function(){_mh85b.apply(this,arguments);try{if(!S||!S.stocks||!S.stocks.length)return;let d=0;for(const s of S.stocks){s.val=Math.max(0,Math.round(s.val*(1+R(-.012,.02))));d+=s.val*.003}if(d>0)inc('div',Math.round(d))}catch(e){console.error(e)}}}
try{Object.assign(INC_LBL,{div:'株の配当'})}catch(_){}
// 会社の画面：持っている株・前の代の会社とのくらべ
{const _co85=coHtml;coHtml=function(){let h=_co85.apply(this,arguments);try{let x='';
 if((S.stocks||[]).length)x+=`<h3>🏦 持っている株（任せた会社）</h3><p class="hint small">経営は役員に任せていて、毎月配当が入ります。</p>${S.stocks.map((s,i)=>`<div class="shop"><div><div>${esc(s.name)} <span class="muted small">${esc((COS[s.k]||{n:''}).n)}・Lv${s.lv}</span></div><div class="muted small">価値 ${yen(s.val)}・配当 月${yen(s.val*.003)}くらい</div></div><button class="b sm" type="button" data-stsell="${i}">売る</button></div>`).join('')}`;
 const P=S.prevCo;if(P&&Object.keys(P).length){x+=`<h3>👑 前の代の会社</h3><div>${Object.entries(P).map(([k,q])=>{const mine=(S.cos||[]).filter(c=>c.k===k).sort((a,b)=>b.lv-a.lv)[0];const st=mine?(mine.lv>q.lv?`<span class="chip up">こえた！（Lv${mine.lv}）</span>`:`いま「${esc(mine.name)}」Lv${mine.lv}／あとLv${q.lv-mine.lv}`):'まだ作っていない（もう一度つくれます）';return `<div class="shop"><div><div>${esc(q.name)} <span class="muted small">${esc((COS[k]||{n:''}).n)}・${q.gen}代目のころ Lv${q.lv}・価値 ${yen(q.val)}</span></div><div class="muted small">${st}</div></div></div>`}).join('')}</div>`}
 return x?h+x:h}catch(e){console.error(e)}return h}}
document.addEventListener('click',e=>{const b=e.target.closest('[data-stsell]');if(!b||!S)return;const s=(S.stocks||[])[+b.dataset.stsell];if(!s)return;const v=Math.round(s.val*.95);inc('cosell',v);S.stocks.splice(+b.dataset.stsell,1);log(`「${s.name}」の株を売った（${yen(v)}）`,'good');save();renderPanel()});
{const _mh85c=monthHook11;monthHook11=function(){_mh85c.apply(this,arguments);try{const P=S&&S.prevCo;if(!P)return;for(const c of (S.cos||[])){const q=P[c.k];if(q&&!c.beatPrev&&c.lv>q.lv){c.beatPrev=1;log(`「${c.name}」が、前の代の「${q.name}」の規模をこえた！`,'good');tl(`前の代の会社をこえた（${c.name}）`);try{popBig('👑 前の代をこえた！',`「${esc(c.name)}」が「${esc(q.name)}」をこえました`,`Lv${c.lv}`)}catch(_){}}}}catch(_){}}}
// 遊び方・終わりの画面の説明
(function(){const g=GUIDE.find(x=>x[0]==='end');if(g)g[2]=`・亡くなるときに、「この人生を終える」か「子どもに引き継ぐ」を選べます。
・跡継ぎ：「人生」→「人」で、18歳以上の子どもや孫を跡継ぎに決められます。決めておくと、好きなときに隠居して託せます。
・引き継ぐときは、寄付や相続税、会社（継ぐ・任せて株に・売る・たたむ）、芸能事務所の扱いを選びます。
・まちは引き継げません。研究・大計画・世界の人口は残ります。
・任せた会社は株になり、毎月配当が入ります。新しく作った会社が前の代の規模をこえると、お祝いが出ます。`})();
{const _se85=showEnding;showEnding=function(){const r=_se85.apply(this,arguments);try{const w=document.createTreeWalker($('#scrEnd'),NodeFilter.SHOW_TEXT);let n;while((n=w.nextNode()))if(n.nodeValue.indexOf('お金・事務所・まち・研究は引き継がれる。')>=0)n.nodeValue=n.nodeValue.replace('お金・事務所・まち・研究は引き継がれる。','引き継ぐときに、お金・会社・芸能事務所の扱いを選べる（まちは引き継げない）。')}catch(_){}return r}}
// 名字（S.last は「先月のまとめ」にも使われているので、名前から取り出す）
function surOf(P){try{if(P&&typeof P.sur==='string')return P.sur;if(P&&typeof P.last==='string')return P.last;const n=String(P&&P.name||'');return P&&P.cty&&!P.cty.jp?n.split(' ').slice(-1)[0]:n.split(' ')[0]}catch(_){return ''}}
{const _fn85=fullNameFrom;fullNameFrom=function(P,first){return P&&P.cty&&!P.cty.jp?first+' '+surOf(P):surOf(P)+' '+first}}
{const _ca85b=continueAsChild;continueAsChild=function(i,alive){const sur=surOf(S);const r=_ca85b.apply(this,arguments);try{if(S&&typeof S.sur!=='string'){S.sur=sur;if(/null|undefined|object/.test(S.name))S.name=S.cty&&!S.cty.jp?S.first+' '+sur:sur+' '+S.first}}catch(_){}return r}}
