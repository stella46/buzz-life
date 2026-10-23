
// ===== v2.6：年齢に合った出来事・まるごとおまかせ・秘書・表示のカスタマイズ・さがす（機能一覧と用語集） =====

// ----- 年齢に合った出来事（子どもに会社やまちの経営の出来事が出ないように） -----
(function(){const bizOwn=()=>(S.office&&S.office.lv>0)||(S.cos||[]).length>0||(S.svcs||[]).length>0||S.st==='work'||(typeof anyShop==='function'&&anyShop());
 const RULE={'会社':()=>age()>=18&&bizOwn(),'賞':()=>age()>=18,'大計画':()=>age()>=20,'仕事':()=>age()>=15,'まち':()=>age()>=16,'結婚':()=>age()>=18,'恋愛':()=>age()>=13};
 const OFF=new Set(['of20']);
 for(const [id,e] of Object.entries(EV)){if(!e||!(e.w>0))continue;const r=RULE[e.cat];const off=/^of20_/.test(id)||/^x_tal_|^b_tal/.test(id);if(!r&&!off)continue;const w0=e.when;
  e.when=function(){if(r&&!r())return false;if(off&&!(S.office&&S.office.lv>0&&age()>=18))return false;return !w0||w0.apply(this,arguments)}}
 EVL=null})();

// ----- 3. まるごとおまかせ -----
const OMK=[['res','研究','おすすめの研究を、ポイントがたまりしだい進めます'],['skill','スキル','スキルポイントで、順番にスキルを覚えます'],['town','まちづくり','すべてのまちで「おまかせ開発」をオンにします'],['shop','お店','すべてのお店に店長を置き、値段や人手を整えてもらいます（店長の給料がかかります）'],
 ['co','会社','社員の雇用と作るものをおまかせにし、余裕があれば会社を大きくします'],['mega','大計画','お金に余裕があれば、始められる大計画を進めます（同時に3つまで）'],['ppl','つながり','あまった交流の回数で、仲がはなれぎみの人と話します']];
function omk(k){return !!(S&&S.omk&&S.omk[k])}
function omkHtml(){const n=OMK.filter(x=>omk(x[0])).length;
 return `<details class="omk"${n?'':''}><summary>🤖 まるごとおまかせ <span class="chip">${n?n+'つオン':'オフ'}</span></summary><p class="hint">分野ごとに、毎月の管理をまかせられます。まかせた分野は、さわらなくても進みます。</p><div class="omkl">${OMK.map(([k,n2,d])=>`<label class="omki"><input type="checkbox" data-omk="${k}" ${omk(k)?'checked':''}><span><b>${n2}</b><small>${d}</small></span></label>`).join('')}</div><div class="row"><button class="b sm" type="button" data-omkall="1">すべてまかせる</button><button class="b sm ghost" type="button" data-omkall="0">すべて自分でやる</button></div></details>`}
function omkApply(){if(!S.omk)return;
 if(omk('town'))for(const T of allTowns()){T.auto=T.auto||{on:0,b:5e6};T.auto.on=1}
 if(omk('shop'))for(const T of allTowns())withTown(T,()=>S.town.tiles.forEach((t,i)=>{if(SHOP[t.t]&&!t.mgr){t.mgr=1;try{mgrOptimize(i)}catch(_){}}}));
 if(omk('co'))for(const c of (S.cos||[])){coInit(c);c.emp.auto=1;if(c.pmode==='manual')c.pmode='auto'}}
function omkMonth(){if(!S.omk||age()<10)return;const did=[];omkApply();
 if(omk('res')){let n=0;for(let i=0;i<4;i++){const x=resRec(1)[0];if(!x||S.rp<x.c)break;if(x.t==='t')rtBuy(x.id);else{const r=RES.find(z=>z.id===x.id);if(!r)break;S.rp-=r.c;S.res[r.id]=1;log(`研究「${r.n}」が完了した（おまかせ）`,'good')}n++}if(n)did.push(`研究${n}件`)}
 if(omk('skill')&&(S.sp||0)>0){for(let g=0;g<10;g++){let best=null;for(const [bk,bn,ns] of SKT)for(let i=0;i<ns.length;i++){const id=ns[i][0];if(sk(id))continue;if(i&&!sk(ns[i-1][0]))break;if(SK_COST[i]<=S.sp&&(!best||SK_COST[i]<best[1]))best=[id,SK_COST[i]];break}if(!best)break;skBuy(best[0]);did.push('スキル')}}
 if(omk('co')&&age()>=20)for(const c of (S.cos||[])){if(c.lv<8){const up=Math.round(COS[c.k].c*c.lv*Math.max(.2,S.cty.inc));if(S.money*.03>=up){outc('co',up);c.cap+=COS[c.k].c*c.lv;c.lv++;c.val+=Math.round(COS[c.k].c*(c.lv-1)*.9);did.push(`「${c.name}」Lv${c.lv}`)}}else if(c.lv<12&&typeof lvUpCost==='function'){const cst=lvUpCost(c);if(S.money*.03>=cst){outc('co',cst);c.cap+=cst;c.lv++;c.val=Math.round(c.val*1.4+cst*.6);did.push(`「${c.name}」Lv${c.lv}`)}}}
 if(omk('mega')&&age()>=20&&(S.mega||[]).filter(x=>!x.done).length<3){const cand=Object.values(MEGA).filter(m=>!megaOf(m.k)&&S.y>=m.yr&&!(m.req&&!megaDone(m.req))&&megaCost(m)<=S.money*.05).sort((a,b)=>a.c-b.c)[0];if(cand){megaStart(cand.k);did.push(`大計画「${cand.n}」`)}}
 if(omk('ppl')&&typeof kLeft==='function'){const K=kOf();const L=pplAll().filter(([n,kind])=>kind!=='rival'&&!K.did[n.id||n.name]).sort((a,b)=>a[0].rel-b[0].rel);for(const [n] of L){if(kLeft()<=0)break;rel(n,K_ACT.talk[2]);K.n++;K.did[n.id||n.name]=1}}
 if(did.length)log('おまかせ：'+did.slice(0,6).join('・'),'life')}
const _mh52=monthHook11;monthHook11=function(){_mh52();try{omkMonth()}catch(e){console.error(e)}};
document.addEventListener('change',e=>{const t=e.target;if(!S||!t.dataset||t.dataset.omk==null)return;S.omk=S.omk||{};S.omk[t.dataset.omk]=t.checked?1:0;if(!t.checked&&t.dataset.omk==='town')for(const T of allTowns())if(T.auto)T.auto.on=0;omkApply();save();renderPanel()});
document.addEventListener('click',e=>{const b=e.target.closest('[data-omkall]');if(!b||!S)return;const v=+b.dataset.omkall;S.omk={};for(const [k] of OMK)S.omk[k]=v;if(!v)for(const T of allTowns())if(T.auto)T.auto.on=0;omkApply();save();renderPanel()});

// ----- 4. 秘書のひとこと -----
const SEC_NM='秘書のアオイ';
function secTip(){const a=age(),p=S.p;
 if(a<6)return null;
 if(p.health<30)return ['体がかなり弱っています。今月は予定に「休む」を入れましょう','act:'];
 if(p.mental<30)return ['心がつかれています。休むか、「つながり」でだれかと話してみては？','life:ppl'];
 if((S.bills||[]).length&&!S.autopay&&a>=18)return [`未払いの請求書が${S.bills.length}件あります。早めに払いましょう`,'money:bills'];
 if(a>=13&&!S.snsOpen&&typeof snsEra==='function'&&snsEra()&&!S.flags.noNet)return ['SNSを始めると、人生が大きく動きはじめます','sns:'];
 if(S.snsOpen&&S.mo&&S.plan&&!S.plan.includes('post')&&pmode()==='classic')return ['予定に「投稿」が入っていません。フォロワーをふやすなら、まずは投稿から','act:'];
 const rr=typeof resRec==='function'?resRec(1)[0]:null;if(rr&&S.rp>=rr.c&&!omk('res'))return [`研究「${rr.n}」がおすすめです（${rr.d}）`,'biz:res'];
 if((S.sp||0)>=2&&!omk('skill'))return [`スキルポイントが${S.sp}あります。スキルを覚えましょう`,'life:skill'];
 if(S.snsOpen&&S.trend&&S.trend.g!==S.genre&&genreOk(S.trend.g)&&!S.autoTrend)return [`いまの流行は「${GENRES[S.trend.g].n}」。ジャンルを合わせると伸びやすくなります`,'sns:'];
 if(typeof wNext==='function'&&S.snsOpen&&S.world){const nx=wNext();if(nx&&S.f[S.main]>=wNeed(nx)&&S.money>=wCost(nx))return [`「${nx[1]}」に進出できます。届く人数が${nx[2]}倍に`,'sns:']}
 if(a>=20&&!(S.cos||[]).length&&S.money>=3e7*Math.max(.2,S.cty.inc))return ['お金に余裕があります。会社を作ってみませんか？','biz:co'];
 if(a>=20&&S.money>=1e11&&!(S.mega||[]).some(m=>!m.done))return ['大きなお金が眠っています。大計画で、世界を動かしてみては？','biz:mega'];
 if(typeof kLeft==='function'&&a>=6&&kLeft()>=3){const lo=pplAll().filter(([n,k])=>k!=='rival').sort((x,y)=>x[0].rel-y[0].rel)[0];if(lo&&lo[0].rel<45)return [`${lo[0].name}さんと、しばらく話していません`,'life:ppl']}
 const idle=[['今月も順調です。気になることがあれば、上の「🔎さがす」から探せます',null],['迷ったら「🤖まるごとおまかせ」で、分野ごとにまかせられます','act:'],['たまには、思い出のアルバムを見返してみては？','life:album']];return idle[S.am%idle.length]}
function secHtml(){if(uiHidden('sec')||!S||S.secHide===S.am)return '';const t=secTip();if(!t)return '';
 return `<div class="sec"><div class="sec-ic" aria-hidden="true">🗂️</div><div class="sec-b"><div class="sec-n">${SEC_NM}</div><div class="sec-t">${esc(t[0])}</div><div class="row">${t[1]?`<button class="b sm pri" type="button" data-goto="${t[1]}">見に行く</button>`:''}<button class="b sm ghost" type="button" data-sechide="1">今月はいい</button></div></div></div>`}
document.addEventListener('click',e=>{const b=e.target.closest('[data-sechide]');if(!b||!S)return;S.secHide=S.am;renderPanel()});

// ----- 5. 表示のカスタマイズ（この端末に保存） -----
const UI_KEY='buzz-ui-hide';
let UIH=null;function uiHide(){if(UIH)return UIH;try{UIH=JSON.parse(localStorage.getItem(UI_KEY)||'{}')}catch(_){UIH={}}return UIH}
function uiHidden(k){return !!uiHide()[k]}
const UI_ITEMS=[['画面の部品',[['sec','秘書のひとこと'],['todo','いまできること'],['eta','推定プレイ時間'],['big','とんでもなく高額なアクション'],['omk','まるごとおまかせ（予定タブ）']]],
 ['「事業」タブ',[['s:biz:town','まちの地図'],['s:biz:shop','お店の経営'],['s:biz:co','会社'],['s:biz:office','事務所'],['s:biz:svc','サブスク事業'],['s:biz:aw','賞・イベント'],['s:biz:mega','大計画'],['s:biz:res','研究']]],
 ['「人生」タブ',[['s:life:goal','目標・性格'],['s:life:choice','人生の選択'],['s:life:map','相関図・弟子'],['s:life:album','アルバム'],['s:life:skill','スキル'],['s:life:rec','記録'],['s:life:world','世界・ランキング']]]];
function showUiCustom(){const h=uiHide();openModal(`<div class="mcat life">表示のカスタマイズ</div><h2>表示する項目</h2><p class="hint">使わない項目のチェックをはずすと、画面から隠せます（この端末だけの設定です。いつでも戻せます）。</p>${UI_ITEMS.map(([g,L])=>`<h3>${g}</h3><div class="omkl">${L.map(([k,n])=>`<label class="omki"><input type="checkbox" data-uih="${k}" ${h[k]?'':'checked'}><span><b>${n}</b></span></label>`).join('')}</div>`).join('')}<div class="row"><button class="b sm" type="button" data-uireset="1">すべて表示に戻す</button><button class="b pri" type="button" data-act="close">閉じる</button></div>`)}
document.addEventListener('change',e=>{const t=e.target;if(!t.dataset||t.dataset.uih==null)return;const h=uiHide();if(t.checked)delete h[t.dataset.uih];else h[t.dataset.uih]=1;UIH=h;try{localStorage.setItem(UI_KEY,JSON.stringify(h))}catch(_){}if(S)render()});
document.addEventListener('click',e=>{const b=e.target.closest('[data-uireset]');if(!b)return;UIH=null;try{localStorage.removeItem(UI_KEY)}catch(_){}closeModal();if(S)render()});
const _st52=subTabs;subTabs=function(tabk,items){const h=uiHide();items=items.filter(x=>!h['s:'+tabk+':'+x[0]]||SUB[tabk]===x[0]);const r=_st52.call(this,tabk,items);return tabk==='life'&&h['s:life:world']&&SUB.life!=='world'?r.replace(/<button[^>]*data-sub="life:world"[^>]*>[^<]*<\/button>/,''):r};
const _todo52=todoHtml;todoHtml=function(){return uiHidden('todo')?'':_todo52.apply(this,arguments)};
const _eta52=etaText;etaText=function(){return uiHidden('eta')?'':_eta52.apply(this,arguments)};
const _big52=bigHtml;bigHtml=function(a){return uiHidden('big')?'':_big52.apply(this,arguments)};

// ----- 6. さがす（機能一覧と用語集） -----
const FIND=[
 ['投稿する','予定','act:','予定に「投稿」を入れると、毎月投稿してフォロワーがふえる','とうこう SNS'],['予定の決め方','予定','act:','いつもの枠／いつもの予定＋今月だけ／割合／割合＋今月だけ','スケジュール 割合'],
 ['まるごとおまかせ','予定','act:','分野ごとに毎月の管理をまかせる','自動 オート'],['出来事のおまかせ','予定 → 時間の進み方','act:','種類ごとに、よくある出来事を止めずに進める','スキップ イベント'],['推定プレイ時間','予定 → 時間の進み方','act:','のこりのプレイ時間の目安','時間'],
 ['アカウント・SNS','発信','sns:','SNSのアカウント、ジャンル、投稿の方針','フォロワー ジャンル'],['世界進出','発信 → 世界の舞台','sns:','地域ごとに進出して、届けられる人数を広げる','海外 グローバル'],['コラボ','発信','sns:','ほかの配信者といっしょに投稿する','コラボ'],
 ['家計・請求書','お金 → 家計','money:bills','毎月の支払い。自動払いもできる','支払い'],['お金の使い道','お金 → 使い道','money:spend','旅行・寄付・自分みがきなど','使う'],['買い物','お金 → 買い物','money:shop','機材や家具など。1回だけ／何度でも／毎月の契約','アイテム'],['投資・借入','お金 → 投資・借入','money:bank','投資と、18歳からの借入','投資 ローン'],['サブスク','お金 → 家計','money:bills','動画・音楽・素質を伸ばすサブスクなど','サブスクリプション'],['家族への返済','お金','money:bills','18歳までに家族が立て替えた分を、大人になって返す','返済'],
 ['まちの地図','事業 → まち','biz:town','まちに建物を建てて発展させる','まちづくり 建物'],['お店の経営','事業 → まち → お店','biz:shop','値段・営業時間・人手などを決める','店 店長'],['会社','事業 → 会社','biz:co','会社をつくって、作るものや社員を決める','企業 社員'],['事務所','事業 → 会社 → 事務所','biz:office','タレントを育てる芸能事務所','タレント'],['サブスク事業','事業 → 会社 → サブスク事業','biz:svc','自分のサブスクを開発して提供する','サービス'],
 ['賞・イベント','事業 → 挑戦','biz:aw','毎年の賞と、自分で開くイベント','アワード 大会'],['大計画','事業 → 挑戦 → 大計画','biz:mega','宇宙開発や人口をふやす計画など、とてつもないお金の使い道','宇宙 人口 インフラ'],['研究','事業 → 研究','biz:res','研究ポイントで、効果や新しい機能を解放する。⭐おすすめタブもある','研究ポイント'],
 ['能力','人生 → 自分','life:stat','健康・メンタル・幸福・スキル・素質','ステータス'],['人生の終わりのモード','人生 → 自分 → 能力','life:stat','亡くなったら終わり／エンドレス（子どもに引き継ぐ）','エンドレス 世代'],['目標・性格','人生 → 自分','life:goal','人生の目標と性格','ゴール'],['スキル','人生 → 自分','life:skill','スキルポイントで覚えるスキル','スキルツリー'],
 ['つながり','人生 → 人','life:ppl','家族・恋人・友達・子どもと交流する（月3回）','交流 友達 結婚 子ども'],['相関図・弟子','人生 → 人','life:map','人間関係の図と弟子','弟子'],['人生の選択','人生 → 人','life:choice','恋人探し・プロポーズ・転職・引っ越しなど','結婚 転職'],
 ['世界・ランキング','人生 → 記録','life:world','配信者ランキング・長者番付・企業ランキング','ランキング'],['アルバム','人生 → 記録','life:album','思い出の写真','写真'],['記録','人生 → 記録','life:rec','この人生の記録','記録'],
 ['研究ポイント','用語',null,'研究に使うポイント。知識・企画・勉強・図書館などでたまる',''],['素質','用語',null,'生まれつきの得意分野（8種類）。上限は300。100をこえると伸びはゆるやかに',''],['評判','用語',null,'世の中からの評価。高いほど仕事や賞で有利',''],['ガチ勢','用語',null,'熱心なファン。ファンクラブ収入や応援につながる','ファン'],['炎上','用語',null,'批判が集まること。評判やメンタルが下がる',''],
 ['引き継ぎスキル','用語',null,'人生を終えるとたまるポイントで覚える、すべての人生で有効なスキル','レガシー'],['エンドレス','用語',null,'亡くなっても子どもとして続けられるモード',''],['セーブスロット','タイトル → 設定・セーブ',null,'5つまで別々の人生を保存できる','保存'],['引き継ぎコード','タイトル → 実績・引き継ぎ',null,'ほかの端末へ、すべてのデータを移す','機種変更'],['表示のカスタマイズ','画面の上の「⚙表示」',null,'使わない項目を隠す','非表示']];
function showFind(q){q=(q||'').trim();const L=FIND.filter(x=>!q||(x[0]+x[1]+x[3]+x[4]).includes(q));
 const body=L.length?L.map(([n,where,go,d])=>`<div class="shop"><div><div><b>${esc(n)}</b> <span class="chip">${esc(where)}</span></div><div class="muted small">${esc(d)}</div></div>${go&&S&&!$('#scrGame').hidden?`<button class="b sm" type="button" data-goto="${go}" data-sc="1">開く</button>`:''}</div>`).join(''):'<p class="hint">見つかりませんでした。別のことばで探してみてください。</p>';
 const ex=$('#findList');if(ex){ex.innerHTML=body;return}
 openModal(`<div class="mcat life">さがす</div><h2>機能と用語をさがす</h2><input id="findQ" type="search" placeholder="例：会社、研究、結婚、スキップ" value="${esc(q)}" autocomplete="off"><div id="findList" class="findl">${body}</div><button class="b pri" type="button" data-act="close">閉じる</button>`);setTimeout(()=>{const i=$('#findQ');if(i)i.focus()},50)}
document.addEventListener('input',e=>{if(e.target&&e.target.id==='findQ')showFind(e.target.value)});
// ボタン：⚡移動のとなりに「🔎さがす」、各タブの説明欄に「⚙表示」
(function(){const c=document.getElementById('ctrl');if(!c)return;const b=document.createElement('button');b.className='b sm';b.type='button';b.id='btnFind';b.textContent='🔎さがす';b.addEventListener('click',()=>showFind(''));const sc=document.getElementById('btnSc');if(sc)sc.after(b);else c.appendChild(b)})();
const _rp52=renderPanel;renderPanel=function(){const r=_rp52.apply(this,arguments);try{const th=document.querySelector('#panel .tabhint');if(th&&!th.querySelector('[data-uicust]')){const b=document.createElement('button');b.className='b sm ghost hbtn';b.type='button';b.dataset.uicust='1';b.textContent='⚙表示';th.appendChild(b)}}catch(_){}return r};
document.addEventListener('click',e=>{const b=e.target.closest('[data-uicust]');if(!b)return;showUiCustom()});
// 予定タブ：秘書とおまかせ
const _pp52=panelPlan;panelPlan=function(){let h=_pp52.apply(this,arguments);try{const s=secHtml(),o=uiHidden('omk')||age()<10?'':omkHtml();h=s+h;const j=h.indexOf('<div class="grp"><h3>時間の進み方');if(o)h=j<0?h+o:h.slice(0,j)+o+h.slice(j)}catch(e){console.error(e)}return h};
