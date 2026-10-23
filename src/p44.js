
// ===== v2.1：お金・人数の表示（万・億・兆・京） =====
function num(n){n=Math.round(n||0);const a=Math.abs(n),s=n<0?'-':'';if(a<1e4)return n.toLocaleString('ja-JP');
 if(a<1e8)return s+(a/1e4).toFixed(a>=1e5?0:1).replace(/\.0$/,'')+'万';
 const U=[[1e20,'垓'],[1e16,'京'],[1e12,'兆'],[1e8,'億'],[1e4,'万']];
 for(let i=0;i<U.length-1;i++){const [u,l]=U[i];if(a<u)continue;const hi=Math.floor(a/u),lo=U[i+1][0];let rest=Math.floor((a-hi*u)/lo);
  if(hi>=100||i===0)return s+hi.toLocaleString('ja-JP')+l;if(hi>=10)rest=Math.round(rest/1000)*1000;if(rest>=10000)return s+(hi+1)+l;
  return s+hi+l+(rest?rest+U[i+1][1]:'')}
 return n.toLocaleString('ja-JP')}

// ===== v2.1：出来事のおまかせ（種類ごと） =====
const EVSKIP_NG=new Set(['恋愛','結婚','家族','人生']);
let EVCATS=null;function evCats(){if(EVCATS)return EVCATS;const m={};for(const e of Object.values(EV))if(e&&e.cat&&e.w>0&&e.w<1&&!AUTO_SKIP.test(e.id))m[e.cat]=(m[e.cat]||0)+1;return EVCATS=Object.entries(m).filter(([c,n])=>n>=5).sort((a,b)=>b[1]-a[1]).map(x=>x[0])}
function evSkipOk(e){return !!(S&&S.evSkip&&e&&e.cat&&S.evSkip[e.cat]&&e.w>0&&e.w<1&&!AUTO_SKIP.test(e.id)&&!/案件|PR/.test(e.t||''))}
const _aeo44=autoEvOk;autoEvOk=function(e){try{if(evSkipOk(e))return true}catch(_){}return _aeo44.apply(this,arguments)};
function evSkipHtml(){const sk=S.evSkip||{},cats=evCats(),on=cats.filter(c=>sk[c]).length;
 return `<details class="evskip"${on?' open':''}><summary>出来事のおまかせ（種類ごと）${on?`<span class="chip">${on}種類</span>`:''}</summary><p class="hint">選んだ種類のよくある出来事は、ふつうの速さでも止まらずに自動で選びます。大事な出来事（恋愛・結婚・仕事・炎上など）はこれまでどおり止まります。</p><div class="chips">${cats.map(c=>`<button class="b sm ${sk[c]?'on':''}" type="button" data-evsk="${esc(c)}" aria-pressed="${!!sk[c]}">${esc(c)}</button>`).join('')}</div><div class="row"><button class="b sm ghost" type="button" data-evsk="__none">すべて止まるように戻す</button></div></details>`}
const _sopt44=speedOptsHtml;speedOptsHtml=function(){return _sopt44.apply(this,arguments)+evSkipHtml()};
const _se44=showEvent;showEvent=function(e){const r=_se44.apply(this,arguments);try{if(e&&e.cat&&e.w>0&&e.w<1&&!AUTO_SKIP.test(e.id)&&!/案件|PR/.test(e.t||'')&&!(S.evSkip&&S.evSkip[e.cat])){const mc=$('#mcard');if(mc&&!mc.querySelector('.evskipb')){const d=document.createElement('div');d.className='evskipb';d.innerHTML=`<button class="b sm ghost" type="button" data-evsk1="${esc(e.cat)}">「${esc(e.cat)}」のよくある出来事は、次からおまかせにする</button>`;mc.appendChild(d)}}}catch(_){}return r};
document.addEventListener('click',e=>{const b=e.target.closest('[data-evsk],[data-evsk1]');if(!b||!S)return;S.evSkip=S.evSkip||{};
 if(b.dataset.evsk1){const c=b.dataset.evsk1;S.evSkip[c]=1;b.disabled=true;b.textContent=`「${c}」は次からおまかせにします（予定タブの「時間の進み方」で戻せます）`;save();return}
 const c=b.dataset.evsk;if(c==='__none')S.evSkip={};else if(S.evSkip[c])delete S.evSkip[c];else S.evSkip[c]=1;save();renderPanel()});

// ===== v2.1：人とのつながり（交流をかんたんに） =====
// 毎月「交流」を3回まで。予定の枠は使わない。
function kOf(){if(!S.koryu||S.koryu.am!==S.am)S.koryu={am:S.am,n:0,did:{}};return S.koryu}
function kMax(){return 3+(age()>=65?1:0)}
function kLeft(){return Math.max(0,kMax()-kOf().n)}
function kAgeOf(c){return Math.floor((S.am-c.born)/12)}
function pplAll(){const L=[];const push=(n,kind)=>{if(n)L.push([n,kind])};for(const p of (parents()||[]))push(p,'fam');for(const p of (S.sibs||[]))push(p,'fam');
 push(S.spouse,'spouse');push(S.partner,'partner');for(const p of (S.friends||[]))push(p,'friend');push(S.rival,'rival');return L}
const K_ACT={
 talk:['話す',0,3,{mental:1}],
 out:['出かける',8000,6,{happy:2,mental:1}],
 gift:['プレゼント',20000,8,{happy:1}],
 date:['デート',15000,7,{happy:3}],
 trip:['ふたりで旅行',150000,12,{happy:5,mental:3}],
 play:['いっしょに遊ぶ',0,0,{happy:2}],
 study:['勉強を見る',0,0,{know:1}],
 fam:['家族でおでかけ',30000,0,{happy:3,social:1}]};
function kCost(k){return Math.round(K_ACT[k][1]*Math.max(.3,S.cty.inc))}
function kBtn(k,id,dis){const c=kCost(k);return `<button class="b sm" type="button" data-kr="${k}" data-kid="${esc(id)}" ${dis||kLeft()<=0||S.money<c?'disabled':''}>${K_ACT[k][0]}${c?`<small>（${yen(c)}）</small>`:''}</button>`}
function kDone(id){return !!kOf().did[id]}
function koryuHtml(){const a=age();let h=`<h2>人とのつながり</h2><p class="hint">今月の交流：あと<b>${kLeft()}</b>回（毎月${kMax()}回まで・予定の枠は使いません）。同じ人とは月1回まで。</p>`;
 const L=pplAll();h+='<div class="kgrid">';
 for(const [n,kind] of L){const id=n.id||n.name,done=kDone(id),acts=kind==='partner'?['talk','date','gift']:kind==='spouse'?['talk','date','trip']:kind==='rival'?['talk']:['talk','out','gift'];
  h+=`<div class="kcard ${done?'done':''}"><div class="kn">${esc(n.name)}<span class="r">${esc(n.role||'')}${n.trait?'・'+esc(n.trait):''}</span></div>${bar(n.rel,'p')}<div class="r">仲のよさ ${Math.round(n.rel)}${n.news?'・'+esc(n.news):''}</div><div class="kb">${done?'<span class="muted small">今月は会いました</span>':acts.filter(k=>a>=18||!['trip','date'].includes(k)||kind==='partner').map(k=>kBtn(k,id)).join('')}</div>`;
  if(kind==='partner'&&a>=18&&n.rel>=60&&!S.spouse)h+=`<div class="kb"><button class="b sm pri" type="button" data-act="cAsk" data-c="propose">プロポーズする</button></div>`;
  h+='</div>'}
 for(const c of (S.kids||[])){const id='kid:'+c.name+c.born,done=kDone(id),ka=kAgeOf(c);h+=`<div class="kcard ${done?'done':''}"><div class="kn">${esc(c.name)}<span class="r">子ども・${ka}歳</span></div><div class="kb">${done?'<span class="muted small">今月はいっしょに過ごしました</span>':kBtn('play',id)+(ka>=6&&ka<=22?kBtn('study',id):'')}</div>${S.endless&&a>=50?`<div class="kb"><button class="b sm" type="button" data-act="retire" data-i="${S.kids.indexOf(c)}">この子に託す</button></div>`:''}</div>`}
 if(S.pet)h+=`<div class="kcard"><div class="kn">ペット<span class="r">家族の一員</span></div></div>`;
 h+='</div>';
 if((S.kids||[]).length||S.spouse){const id='fam:all';h+=`<div class="row">${kDone(id)?'<span class="muted small">今月は家族でおでかけしました</span>':kBtn('fam',id)}</div>`}
 // 新しい出会い
 h+=`<h3>新しい出会い</h3><div class="row">`;if(a>=6&&(S.friends||[]).length<12)h+=`<button class="b sm" type="button" data-kr="newf" data-kid="new" ${kLeft()<=0?'disabled':''}>友達をつくる</button>`;
 if(a>=18&&!S.partner&&!S.spouse)h+=`<button class="b sm" type="button" data-act="seek" data-m="intro">紹介してもらう</button><button class="b sm" type="button" data-act="seek" data-m="circle">趣味のサークル</button><button class="b sm" type="button" data-act="seek" data-m="app">マッチングアプリ</button>`;
 if(S.spouse&&a>=20&&a<=50&&!(S.flags.tryKid>S.am))h+=`<button class="b sm" type="button" data-act="cAsk" data-c="trykid">子どもを授かることを考える</button>`;
 h+='</div>';
 // 自分のこと
 h+=`<h3>自分のこと</h3><p class="hint">自分のための時間も、交流と同じく月に数回まで。</p><div class="row">${[['rest','ゆっくり休む',0],['gym','体を動かす',5000],['beauty','自分みがき',20000],['learn','学びの時間',8000]].map(([k,n,c])=>{const cc=Math.round(c*Math.max(.3,S.cty.inc));const id='self:'+k;return `<button class="b sm" type="button" data-kself="${k}" ${kDone(id)||kLeft()<=0||S.money<cc?'disabled':''}>${n}${cc?`<small>（${yen(cc)}）</small>`:''}${kDone(id)?' ✓':''}</button>`}).join('')}</div>`;
 return h}
function kFind(id){for(const [n] of pplAll())if((n.id||n.name)===id)return n;return null}
document.addEventListener('click',e=>{const b=e.target.closest('[data-kr],[data-kself]');if(!b||!S||b.disabled)return;const K=kOf();if(kLeft()<=0)return;
 if(b.dataset.kself){const k=b.dataset.kself,id='self:'+k;if(K.did[id])return;const c={rest:0,gym:5000,beauty:20000,learn:8000}[k],cc=Math.round(c*Math.max(.3,S.cty.inc));if(S.money<cc)return;if(cc)outc('shop',cc);
  const eff={rest:{mental:6,health:2},gym:{health:5,mental:1},beauty:{looks:2,happy:1},learn:{know:2,plan:1}}[k];applyEff(eff);K.n++;K.did[id]=1;toast({rest:'ゆっくり休んで、心が軽くなった',gym:'体を動かして、すっきりした',beauty:'少し自信がついた',learn:'新しいことを学んだ'}[k]);save();renderPanel();renderTop&&renderTop();return}
 const k=b.dataset.kr,id=b.dataset.kid;
 if(k==='newf'){if(K.did.newf)return;K.did.newf=1;K.n++;const p=S.sk.looks+S.p.social;if(chance(clamp(.35+p/300,.2,.85))){const n=mkNpc('友達');n.rel=40;S.friends.push(n);tl(n.name+'と友達になった');toast(`${n.name}（${n.trait}）と友達になった！`)}else{ad('social',1);toast('いろいろな人と話したが、今回は友達にはならなかった')}save();renderPanel();return}
 if(K.did[id])return;const A=K_ACT[k];if(!A)return;const cc=kCost(k);if(S.money<cc)return;if(cc)outc(k==='date'||k==='trip'?'date':'shop',cc);
 if(k==='play'||k==='study'){const c=(S.kids||[]).find(x=>'kid:'+x.name+x.born===id);if(!c)return;applyEff(A[3]);c.bond=(c.bond||50)+(k==='play'?4:2);if(k==='study')c.edu=(c.edu||0)+1;ad('mental',1);toast(k==='play'?`${c.name}と思いきり遊んだ`:`${c.name}の勉強を見てあげた`)}
 else if(k==='fam'){applyEff(A[3]);for(const [n,kind] of pplAll())if(kind==='spouse'||kind==='fam')rel(n,3);toast('家族でおでかけした。楽しい一日になった')}
 else{const n=kFind(id);if(!n)return;rel(n,A[2]);applyEff(A[3]);if(k==='talk')ad('social',.5);toast(`${n.name}と${A[0]==='話す'?'話した':A[0]+'をした'}（仲のよさ +${A[2]}）`)}
 K.n++;K.did[id]=1;save();renderPanel()});
