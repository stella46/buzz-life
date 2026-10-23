
// ===== v2.5：推定プレイ時間（ふつう／操作多め／あなたのペース）・家族への返済・人生の終わりの選択 =====

// ----- 推定プレイ時間 -----
function sysCount(){let n=0;if(S.snsOpen)n++;if(anyShop&&anyShop())n++;n+=Math.min(4,(S.cos||[]).length);if((S.towns2||[]).length)n++;if((S.svcs||[]).length)n++;if(S.office&&S.office.lv)n++;if((S.mega||[]).some(m=>!m.done))n++;if((S.kids||[]).length)n++;if(S.spouse||S.partner)n++;if(S.role==='mayor'||S.role==='adviser')n++;return n}
function etaCalc(){const L=lifeLeftYears(),evy=EVY*EVS;const normal=12*1.5+evy;const ops=Math.min(90,10+5*sysCount());const heavy=normal+12*ops;
 const pace=S.paceEma&&S.paceN>=6?S.paceEma*12/1000:null;return {L,normal,heavy,pace}}
function fmtMin(sec){const m=Math.max(1,Math.round(sec/60));return m>=120?`${(m/60).toFixed(m>=600?0:1)}時間`:`${m}分`}
function etaText(){if(!S||!S.alive||age()<0)return '';const c=etaCalc();let pre='';const per=S.unit==='season'?3:S.unit==='week'?.25:1;
 if(skipping)pre='イベントまで・';else if(speed>0){const sm=1.5/speed/per,ev=(S.autoEv!==0&&speed>=2)?1.8:EVY;pre=`${['','▶','▶▶','','▶▶▶'][speed]||'▶'}なら約${fmtMin((12*sm+ev*EVS)*c.L)}・`}
 return `⏱ のこり ${pre}ふつう約${fmtMin(c.normal*c.L)}｜操作多め約${fmtMin(c.heavy*c.L)}${c.pace?`｜あなたのペース約${fmtMin(c.pace*c.L)}`:''}`}
function etaBox(){const c=etaCalc();return `<div class="etabox"><h3>推定プレイ時間</h3><table class="etat"><tr><th></th><th>10年</th><th>この人生のこり（約${c.L}年）</th></tr>
 <tr><td>ふつうに進めた場合<small>▶で進め、出来事を読む</small></td><td>${fmtMin(c.normal*10)}</td><td>${fmtMin(c.normal*c.L)}</td></tr>
 <tr><td>いろいろ操作した場合<small>会社・まち・投稿などを毎月さわる（いまの人生に合わせて計算）</small></td><td>${fmtMin(c.heavy*10)}</td><td>${fmtMin(c.heavy*c.L)}</td></tr>
 <tr><td>あなたのペース<small>この人生で実際にかかった時間から計算</small></td><td>${c.pace?fmtMin(c.pace*10):'計測中'}</td><td>${c.pace?fmtMin(c.pace*c.L):'計測中'}</td></tr></table></div>`}
const _sopt51=speedOptsHtml;speedOptsHtml=function(){return _sopt51.apply(this,arguments)+etaBox()};
// あなたのペース：1か月にかかった実際の時間（放置した分はのぞく）
const _mh51=monthHook11;monthHook11=function(){_mh51();try{const now=Date.now();if(S.paceT){const d=now-S.paceT;if(d>0&&d<5*60000){S.paceEma=S.paceEma?S.paceEma*.9+d*.1:d;S.paceN=(S.paceN||0)+1}}S.paceT=now}catch(_){}};

// ----- 家族への返済（18歳までに立て替えてもらった分） -----
function famRepay(){if(!S.famDebt||S.famDebt<=0||age()<18)return;if(!anyParentAlive()){log(`家族に立て替えてもらった${yen(S.famDebt)}は、返さなくていいと遺言にあった`,'life');S.famDebt=0;return}
 const inc=Object.values((S.mo&&S.mo.inc)||{}).reduce((a,b)=>a+b,0);const pay=Math.min(S.famDebt,Math.max(Math.round(10000*Math.max(.3,S.cty.inc)),Math.round(inc*.1)));
 if(S.money<pay){if(!S.flags.famLate||S.am-S.flags.famLate>=12){S.flags.famLate=S.am;log('今月は家族に返すお金が足りなかった。「余裕ができたらでいいよ」と言ってくれた','life')}return}
 outc('family',pay);S.famDebt-=pay;if(S.famDebt<=0){S.famDebt=0;tl('家族に立て替えてもらったお金を返し終えた');log('家族に立て替えてもらったお金を、すべて返し終えた','good');ad('happy',3);for(const p of (parents()||[]))rel(p,5)}}
const _mh51b=monthHook11;monthHook11=function(){_mh51b();try{if(age()===18&&S.famDebt>0&&!S.flags.famTold){S.flags.famTold=1;S.q.push('fam_repay')}famRepay()}catch(e){console.error(e)}};
E('fam_repay',{t:'家族への返済',cat:'家族',w:0,text:()=>`18歳になった。\n子どものころ、お金が足りなかったときに家族が立て替えてくれた分が、合わせて${yen(S.famDebt)}ある。\n利息はない。これから毎月少しずつ返していく（収入の1割ほど・最低1万円）。`,
 ch:()=>{const l=[['少しずつ返していく',()=>{ad('mental',1);return '「無理しないでね」と言われた。'}]];if(S.money>=S.famDebt)l.unshift([`いますぐ全部返す（${yen(S.famDebt)}）`,()=>{outc('family',S.famDebt);S.famDebt=0;ad('happy',3);for(const p of (parents()||[]))rel(p,8);return '家族はおどろきながらも、うれしそうだった。'}]);return l}});
try{Object.assign(OUT_LBL,{family:'家族への返済'})}catch(_){}
// お金の画面と、子どものおこづかい画面に表示
const _pm51=panelMoney;panelMoney=function(){let h=_pm51.apply(this,arguments);try{if(S.famDebt>0){const kid=age()<18;h=`<div class="card famdebt"><div class="hd"><span>家族に立て替えてもらったお金</span><b>${yen(S.famDebt)}</b></div><p class="hint">${kid?'お金が足りないときは家族が払ってくれますが、その分は大人（18歳）になってから返します（利息はなし）。':'毎月、収入の1割ほど（最低1万円）を自動で返しています。利息はありません。'}</p>${!kid&&S.money>=S.famDebt?`<button class="b sm" type="button" data-famall="1">残りを全部返す</button>`:''}</div>`+h}}catch(e){console.error(e)}return h};
document.addEventListener('click',e=>{const b=e.target.closest('[data-famall]');if(!b||!S||!(S.famDebt>0)||S.money<S.famDebt)return;outc('family',S.famDebt);S.famDebt=0;log('家族に立て替えてもらったお金を、すべて返し終えた','good');for(const p of (parents()||[]))rel(p,5);save();renderPanel()});

// ----- 人生の終わりの選択 -----
// 10歳ごとに、その時点の人生を保管（さかのぼるため・最大4つ）
function snapKey(){return CFG.save+'-snap'}
function snaps(){try{return JSON.parse(localStorage.getItem(snapKey())||'[]')}catch(_){return []}}
function snapPut(){if(!S||!S.alive)return;let L=snaps().filter(x=>x.age!==age());L.push({age:age(),y:S.y,m:S.m,d:JSON.stringify(S)});L.sort((a,b)=>a.age-b.age);while(L.length>4)L.shift();
 for(let i=0;i<3;i++){try{localStorage.setItem(snapKey(),JSON.stringify(L));return}catch(_){L.shift();if(!L.length)return}}}
function snapClear(){try{localStorage.removeItem(snapKey())}catch(_){}}
const _mh51c=monthHook11;monthHook11=function(){_mh51c();try{const a=age();if(a>=10&&a%10===0&&S.am%12===0)snapPut()}catch(e){console.error(e)}};
const _ng51=newGame;newGame=function(){snapClear();return _ng51.apply(this,arguments)};
const _cac51=continueAsChild;continueAsChild=function(){snapClear();return _cac51.apply(this,arguments)};
// 生き返ったあと2年は、急に亡くならない
const _dc51=deathCheck;deathCheck=function(){if(S.flags&&S.flags.lifeGuard&&S.am<S.flags.lifeGuard)return false;return _dc51.apply(this,arguments)};
const _die51=die;let DIE_NOW=0;
die=function(){if(DIE_NOW||!S||!S.alive)return _die51.apply(this,arguments);try{setSpeed(0)}catch(_){}skipping=false;
 const sn=snaps().filter(x=>x.age<age()),kids=(S.kids||[]).length;
 let h=`<div class="mcat life">人生の終わり</div><h2>${esc(S.name)}、${age()}歳</h2><p class="mtext deathtx">静かに、まぶたが重くなっていく。\nこれまでの日々が、ゆっくりと思い出される。\n\nこの先を、どうしますか？</p><div class="dchoice">`;
 h+=`<button class="b" type="button" data-dch="end"><b>この人生を終える</b><span>${S.endless&&kids?'子どもに引き継ぐか、終わりの画面で選べます':'人生の記録を見て、おしまいにします'}</span></button>`;
 if(kids&&!S.endless)h+=`<button class="b" type="button" data-dch="heir"><b>エンドレスにして子どもに引き継ぐ</b><span>お金・事務所・まち・研究も引き継がれます</span></button>`;
 h+=`<button class="b" type="button" data-dch="same"><b>いまの年齢のまま続ける</b><span>いまの資産のまま、体を回復させて続けます（2年間は亡くなりません）</span></button>`;
 if(sn.length)h+=`<div class="dsub">時をさかのぼって続ける（資産はいまのまま）</div>`+sn.slice().reverse().map(x=>`<button class="b" type="button" data-dch="back" data-age="${x.age}"><b>${x.age}歳（${x.y}年）に戻る</b><span>そのころの人生から、いまのお金を持ったままやり直します</span></button>`).join('');
 else h+=`<p class="hint">10歳ごとに人生が保管され、その年齢まで時をさかのぼることもできるようになります（この人生ではまだ保管がありません）。</p>`;
 openModal(h+'</div>');try{snd('end')}catch(_){}};
document.addEventListener('click',e=>{const b=e.target.closest('[data-dch]');if(!b||!S)return;const k=b.dataset.dch;closeModal();
 if(k==='end'||k==='heir'){if(k==='heir'){S.endless=1;if(!S.lineage)S.lineage=[]}snapClear();DIE_NOW=1;try{_die51()}finally{DIE_NOW=0}return}
 if(k==='same'){S.p.health=Math.max(S.p.health,70);S.p.mental=Math.max(S.p.mental,50);if(S.flags.cancer)S.flags.cancer=null;S.flags.lifeGuard=S.am+24;S.flags.revive=(S.flags.revive||0)+1;log(`${age()}歳、もう一度目をひらいた。人生は続く`,'good');tl('奇跡的に回復した');save(true);render();return}
 if(k==='back'){const x=snaps().find(s=>s.age===+b.dataset.age);if(!x)return;const cur={money:S.money,inv:S.inv,debt:S.debt,playMs:S.playMs,lifeMs:S.lifeMs,rev:(S.flags.revive||0)+1};let o;try{o=migrate(JSON.parse(x.d))}catch(err){console.error(err);toast('さかのぼれませんでした');return}
  S=o;S.money=cur.money;S.inv=cur.inv;S.debt=cur.debt;S.playMs=cur.playMs;S.lifeMs=cur.lifeMs;S.flags.revive=cur.rev;S.flags.lifeGuard=S.am+12;S.alive=true;S.paceT=0;
  log(`時をさかのぼり、${age()}歳（${S.y}年）からやり直すことにした。お金はそのまま`,'good');tl(`${age()}歳まで時をさかのぼった`);try{localStorage.setItem(snapKey(),JSON.stringify(snaps().filter(s=>s.age<=age())))}catch(_){}
  save(true);showScreen('game');setTab('act');render()}});
(function(){const A=(id,n,d,f,cat)=>{ACH.push([id,n,d,f]);if(typeof ACH_CAT!=='undefined')ACH_CAT[id]=cat};A('revive1','もう一度','人生の終わりから、続けることを選ぶ',()=>(S.flags.revive||0)>=1,'人生');A('famrepay','恩返し','家族に立て替えてもらったお金を返し終える',()=>S.flags&&S.famDebt===0&&age()>=18&&S.flags.famTold,'家族')})();
// 終わりの選択の画面が出ているあいだは、ほかの出来事を後回しに
{const d0=die;die=function(){const was=S&&S.alive&&!DIE_NOW;const r=d0.apply(this,arguments);if(was&&S.alive)S.flags.dying=1;return r}}
const DYING_=()=>!!(S&&S.flags&&S.flags.dying);
const _se51=showEvent;showEvent=function(e){if(DYING_()){try{if(e&&e.id&&!S.q.includes(e.id))S.q.unshift(e.id)}catch(_){}return}return _se51.apply(this,arguments)};
document.addEventListener('click',e=>{if(e.target.closest('[data-dch]')&&S)S.flags.dying=0},true);
// 選ばずに閉じたときは、次に進もうとしたときにもう一度たずねる
const _turn51=turn;turn=function(){if(S&&S.alive&&DYING_()&&!modalOpen()){die();return}return _turn51.apply(this,arguments)};
