
// ===== v2.0：実績を約280個に（分野別のタブ・達成率つき） =====
const A2=[];const add=(id,n,d,f,cat)=>A2.push([id,n,d,f,0,null,null,cat]);const sec=(id,hn,hd,f,cat)=>A2.push([id,'？','（ひみつ）',f,1,hn,hd,cat]);
const birthY=()=>S.y-age();const maxTal=()=>Math.max(...TALK.map(k=>S.tal[k]||0));const shopsN=()=>allTowns().reduce((a,T)=>a+T.tiles.filter(t=>SHOP[t.t]).length,0);
const awK=k=>((S.awKinds||{})[k]||0);const hostK=k=>((S.hostKinds||{})[k]||0);const coMaxLv=()=>Math.max(0,...(S.cos||[]).map(c=>c.lv));
// --- SNS ---
[[500,'小さな輪'],[5e3,'見つけてもらえた'],[5e4,'人気者の入り口'],[5e5,'みんなが知ってる'],[5e6,'時代の顔']].forEach(([n,t])=>add('fx'+n,t,`フォロワー${num(n)}人`,()=>S.stats.maxF>=n,'SNS'));
[[50,'バズの職人芸'],[100,'バズの神様']].forEach(([n,t])=>add('bz'+n,t,`1つの人生で${n}回バズる`,()=>(S.stats.buzz||0)>=n,'SNS'));
[['milu'],['patto'],['tsubu'],['holo']].forEach(([k])=>add('sns1e5_'+k,`${SNS_DEF[k]}の人気者`,`${SNS_DEF[k]}でフォロワー10万人`,()=>S.open&&S.open[k]&&(S.f[k]||0)>=1e5,'SNS'));
add('deal10','案件の常連','PR案件を10回受ける',()=>(S.stats.deals||0)>=10,'SNS');add('deal50','広告塔','PR案件を50回受ける',()=>(S.stats.deals||0)>=50,'SNS');
add('views1e8','1億回再生','合計の再生数が1億回',()=>(S.stats.views||0)>=1e8,'SNS');
// --- お金 ---
[[1e6,'はじめての100万円'],[1e7,'1000万円の壁'],[1e11,'1000億円の男女'],[1e12,'兆の世界'],[1e14,'100兆円']].forEach(([n,t])=>add('m'+n,t,`資産${yen(n)}`,()=>S.stats.maxM>=n,'お金'));
add('coll10','大コレクター','コレクションを10個持つ',()=>(S.coll||[]).length>=10,'お金');add('estate10','不動産王','不動産投資を10口',()=>(S.estate||0)>=10,'お金');
add('spend20','お金の使い方を知る人','「お金の使い道」を20種類使う',()=>Object.keys(S.spent||{}).length>=20,'お金');
add('subs30','サブスクの達人','サブスクを30件契約する',()=>Object.values(S.subs||{}).filter(Boolean).length>=30,'お金');
// --- 事業 ---
[[100,'中小企業'],[1e3,'大企業'],[1e4,'1万人の会社'],[1e5,'巨大企業'],[1e6,'100万人の雇い主']].forEach(([n,t])=>add('emp'+n,t,`社員が合計${num(n)}人`,()=>totalEmp()>=n,'事業'));
[9,10,11,12].forEach(l=>add('colv'+l,['','','','','','','','','','超大企業','世界企業','地球規模の企業','伝説の企業'][l],`会社をLv${l}にする`,()=>coMaxLv()>=l,'事業'));
add('subco5','グループ経営','子会社を5社持つ',()=>(S.cos||[]).reduce((a,c)=>a+(c.subco||[]).length,0)>=5,'事業');add('hold','ホールディングス','ホールディングスをつくる',()=>!!S.hold,'事業');
add('branchw','海外進出','海外に支社を出す',()=>(S.cos||[]).some(c=>(c.offices||[]).some(o=>(o.loc||'').startsWith('c:'))),'事業');add('branch10','世界のあちこちに','支社を合計10か所',()=>(S.cos||[]).reduce((a,c)=>a+(c.offices||[]).filter(o=>!o.hq).length,0)>=10,'事業');
add('key12','精鋭ぞろい','主要メンバーが12人そろう',()=>(S.cos||[]).some(c=>c.emp&&c.emp.key.length>=12),'事業');add('merge','合併の決断','会社を合併する',()=>!!S.flags.merged,'事業');add('buyco','買収劇','ほかの会社を買収する',()=>!!S.flags.boughtCo,'事業');
add('prod50','作品の山','会社で作品を50本完成させる',()=>(S.prodN||0)>=50,'事業');add('svc1e5','10万人のサービス','サブスク会員が合計10万人',()=>sumSvc()>=1e5,'事業');add('svc1e6','100万人のサービス','サブスク会員が合計100万人',()=>sumSvc()>=1e6,'事業');
add('svc3','サービスの三本柱','サブスク事業を3つ運営する',()=>(S.svcs||[]).length>=3,'事業');add('office_type5','事務所めぐり','事務所の種類を変える（2回目）',()=>(S.flags.oftN||0)>=2,'事業');
// --- まち ---
add('towns3','まちを3つ','ふるさとのほかに、まちを3つ持つ',()=>(S.towns2||[]).length>=3,'まち');add('towns6','まちの王','ふるさとのほかに、まちを6つ持つ',()=>(S.towns2||[]).length>=6,'まち');
add('town150','発展の極み','まちの発展度150',()=>allTowns().some(T=>(T.dev||0)>=150),'まち');add('shop20','商店街の主','お店や施設を合計20',()=>shopsN()>=20,'まち');add('shop50','まちを丸ごと','お店や施設を合計50',()=>shopsN()>=50,'まち');
add('buytown','まちの買収','まちを買収する',()=>(S.towns2||[]).some(T=>T.kind==='bought'),'まち');add('renametown','名付け親','まちの名前を変える',()=>!!S.flags.townRen,'まち');
// --- 賞・イベント ---
[[1,'はじめての受賞'],[5,'賞の常連'],[10,'受賞の山'],[30,'殿堂入り']].forEach(([n,t])=>add('aw'+n,t,`賞を${n}回受ける（ノミネートも含む）`,()=>(S.awCnt||0)>=n,'賞・イベント'));
[[1,'大賞！'],[10,'大賞10冠']].forEach(([n,t])=>add('awin'+n,t,`大賞を${n}回取る`,()=>(S.awWin||0)>=n,'賞・イベント'));
AWARDS.forEach(a=>add('awk_'+a.k,`${a.n}`,`${a.n}で大賞を取る`,()=>awK(a.k)>=1,'賞・イベント'));
[[1,'はじめての主催'],[10,'イベントの達人']].forEach(([n,t])=>add('host'+n,t,`催しを${n}回開く`,()=>(S.hostN||0)>=n,'賞・イベント'));
HOST_T.forEach(t=>add('hk_'+t.k,`${t.n}の主催者`,`「${t.n}」を開く`,()=>hostK(t.k)>=1,'賞・イベント'));
// --- 大計画 ---
Object.values(MEGA).forEach(m=>add('mg_'+m.k,m.n,`大計画「${m.n}」を完成させる`,()=>megaDone(m.k),'大計画'));
[[1,'夢の第一歩'],[5,'夢の建築家'],[10,'世界を変えた人']].forEach(([n,t])=>add('mgn'+n,t,`大計画を${n}つ完成させる`,()=>(S.megaN||0)>=n,'大計画'));
// --- 素質・能力 ---
TALK.forEach(k=>add('tal100_'+k,`${GENRES[k].n}の天才`,`${GENRES[k].n}の素質100`,()=>(S.tal[k]||0)>=100,'素質・能力'));
add('talall100','万能の天才','すべての素質100',()=>TALK.every(k=>(S.tal[k]||0)>=100),'素質・能力');
Object.entries(P_KEYS).forEach(([k,n])=>add('p100_'+k,`${n}100`,`${n}を100にする`,()=>S.p[k]>=100,'素質・能力'));
Object.entries(SK_KEYS).forEach(([k,n])=>add('k100_'+k,`${n}の達人`,`${n}を100にする`,()=>S.sk[k]>=100,'素質・能力'));
add('res30','研究者','研究を30個終える',()=>RES.filter(r=>has(r.id)).length>=30,'素質・能力');add('rp1000','研究ポイント長者','研究ポイントを1000ためる',()=>S.rp>=1000,'素質・能力');
// --- 人生・家族 ---
[20,40,60,80].forEach(a=>add('life_'+a,`${a}歳の誕生日`,`${a}歳になる`,()=>age()>=a,'人生'));
[[50,'人生の大ベテラン'],[100,'百回生きた']].forEach(([n,t])=>add('lives'+n,t,`人生を${n}回終える`,k=>k==='d'&&(META.lives||0)>=n-1,'人生'));
add('kids5','大家族','子どもが5人',()=>S.kids.length>=5,'家族');add('gen4','四代目','4代目として生きる',()=>(S.gen||1)>=4,'家族');add('pet','動物と暮らす','ペットを迎える',()=>!!S.pet,'家族');add('cats3','ねこ屋敷','猫を3匹迎える',()=>(S.cats||0)>=3,'家族');
add('retire','第二の人生','引退する',()=>S.st==='retired','人生');add('univ','学びの道','大学に進む',()=>S.st==='univ'||!!S.flags.univDone,'人生');
Object.entries(COUNTRIES).forEach(([k,c])=>add('cty_'+k,`${c.n}生まれ`,`${c.n}に生まれる`,()=>S.ctyId===k,'人生'));
add('born1950','昭和の子','1960年より前に生まれる',()=>birthY()<1960,'人生');add('born2080','未来の子','2080年より後に生まれる',()=>birthY()>2080,'人生');
add('ev1000','千の出来事','出来事を1000種類見る',()=>Object.keys(META.seen).length>=1000,'図鑑');
// --- ひみつの実績（解除するまで名前も条件も見えない） ---
sec('s_age120','人類の記録','120歳まで生きる',k=>k==='d'&&age()>=120,'人生');
sec('s_f2e7','2000万の声','フォロワー2000万人',()=>S.stats.maxF>=2e7,'SNS');
sec('s_m1e15','1000兆円','資産1000兆円',()=>S.stats.maxM>=1e15,'お金');
sec('s_emp3m','300万人の雇い主','社員が合計300万人',()=>totalEmp()>=3e6,'事業');
sec('s_q100','完全無欠','評価100点の作品を作る',()=>(S.prodBest||0)>=100,'事業');
sec('s_awall','総なめ','1つの人生で7種類以上の賞の大賞を取る',()=>Object.keys(S.awKinds||{}).length>=7,'賞・イベント');
sec('s_rookiewin','新人王','新人クリエイター賞の大賞',()=>awK('rookie')>=1,'賞・イベント');
sec('s_flamejudge','審査の炎','自分で審査して、身内びいきで騒ぎになる',()=>!!S.flags.judgeFlame,'賞・イベント');
sec('s_expo','万博のあるじ','国際博覧会を開く',()=>hostK('worldexpo')>=1,'賞・イベント');
sec('s_spacelive','宇宙から、こんにちは','宇宙からの生配信イベントを開く',()=>hostK('spacelive')>=1,'賞・イベント');
sec('s_mars','火星の開拓者','火星移住計画を完成させる',()=>megaDone('mars'),'大計画');
sec('s_warp','光をこえて','ワープ理論の研究を完成させる',()=>megaDone('warp'),'大計画');
sec('s_king','国王陛下','自分の国をつくる',()=>megaDone('nation'),'大計画');
sec('s_allmega','すべての夢','大計画をすべて完成させる',()=>Object.keys(MEGA).every(k=>megaDone(k)),'大計画');
sec('s_moonlife','月で暮らす','月面都市を完成させる',()=>megaDone('mooncity'),'大計画');
sec('s_talall300','全知全能','すべての素質300',()=>TALK.every(k=>(S.tal[k]||0)>=300),'素質・能力');
sec('s_poorbillion','わらしべ長者','苦しい家庭に生まれて資産1兆円',()=>S.tier===0&&S.stats.maxM>=1e12,'お金');
sec('s_noco_rich','会社なしの億万長者','会社を持たずに資産100億円',()=>!(S.cos||[]).length&&S.stats.maxM>=1e10,'お金');
sec('s_kidrich','小さな大富豪','18歳になる前に資産1億円',()=>age()<18&&S.money>=1e8,'お金');
sec('s_young_ceo','学生社長','22歳になる前に会社を3社持つ',()=>age()<22&&(S.cos||[]).length>=3,'事業');
sec('s_old_debut','100歳のデビュー','90歳をすぎてからSNSを始める',()=>S.snsAm!=null&&S.snsAm/12>=90,'SNS');
sec('s_centbuzz','百寿のバズ','100歳をすぎてバズる',()=>age()>=100&&!!S.flags.buzzOld,'SNS');
sec('s_fantasy_king','異国の王','架空の国で大計画「自分の国をつくる」を完成',()=>S.cty.fict&&megaDone('nation'),'人生');
sec('s_showa_space','昭和生まれの宇宙人','1960年より前に生まれて、宇宙旅行に行く',()=>birthY()<1960&&S.spent&&S.spent.trip_s>0,'人生');
sec('s_gen6','六代つづく家','6代目として生きる',()=>(S.gen||1)>=6,'家族');
sec('s_kids8','大家族の主','子どもが8人',()=>S.kids.length>=8,'家族');
sec('s_hard_mayor','逆境の市長','「むずかしい」以上の難易度で市長になる',()=>(S.diff==='hard'||S.diff==='real')&&(S.role==='mayor'||S.role==='adviser'),'まち');
sec('s_real_billion','リアルの億万長者','「リアル」難易度で資産10億円',()=>S.diff==='real'&&S.stats.maxM>=1e9,'お金');
sec('s_moontown','月のまちの市長','月面都市をまちとして持つ',()=>allTowns().some(T=>T.nm==='月面都市ルナ'),'まち');
sec('s_islandtown','島の主','人工島をまちとして持つ',()=>allTowns().some(T=>T.kind==='mega'),'まち');
sec('s_snsbuyall','すべてのSNSの主','4つのSNSをすべて買収して、すべての名前を変える',()=>S.snsName&&Object.keys(S.snsName).length>=4,'SNS');
sec('s_rocketking','ロケットの雨','毎月ロケットを打ち上げながら、宇宙ベンチャーを持つ',()=>S.subs&&S.subs.rocket&&(S.cos||[]).some(c=>c.k==='space'),'お金');
sec('s_godtal','神々の領域','素質300を3つ',()=>TALK.filter(k=>(S.tal[k]||0)>=300).length>=3,'素質・能力');
sec('s_lucky','強運','謎の箱で10回当たりを引く',()=>(S.flags.boxWin||0)>=10,'お金');
sec('s_honest_star','正直なスター','ステマを断り、フォロワー100万人',()=>S.flags.stemaNo&&S.stats.maxF>=1e6,'SNS');
sec('s_zero_flame_10m','聖人','一度も炎上せずにフォロワー1000万人',()=>S.stats.maxF>=1e7&&!(S.stats.flames>0),'SNS');
sec('s_allcty','世界をめぐる魂','実在の国すべてに生まれる（人生をまたいで）',()=>['japan','usa','korea','germany','brazil','india','philippines','nigeria'].every(k=>META.ach['cty_'+k]),'人生');
sec('s_alltal','すべての天才','すべての素質100（人生をまたいで、ジャンル別の実績をすべて）',()=>TALK.every(k=>META.ach['tal100_'+k]),'素質・能力');
sec('s_awgod','賞の神','大賞を合計50回',()=>(S.awWin||0)>=50,'賞・イベント');
sec('s_hostgod','祭りの神','催しを50回開く',()=>(S.hostN||0)>=50,'賞・イベント');
sec('s_megafast','せっかち','大計画を3つ同時に進める',()=>(S.mega||[]).filter(m=>!m.done).length>=3,'大計画');
sec('s_broke2','夢のあと','大計画の途中で、お金がマイナスになる',()=>(S.mega||[]).some(m=>!m.done)&&S.money<0,'大計画');
sec('s_villa_island','島の別荘','別荘とプライベート島の両方を持つ',()=>S.flags.villa&&S.subs&&S.subs.island,'お金');
sec('s_pet_rocket','宇宙犬','ペットがいて、宇宙旅行に行く',()=>S.pet&&S.spent&&S.spent.trip_s>0,'家族');
sec('s_teen_ceo','中学生社長','15歳で事務所や会社の代表になっている（自由モードなど）',()=>age()<=15&&((S.cos||[]).length>0||(S.office&&S.office.lv>0)),'事業');
sec('s_1000y','千年の家','10代目として生きる',()=>(S.gen||1)>=10,'家族');
sec('s_seen_all','すべてを見た者','出来事を1500種類見る',()=>Object.keys(META.seen).length>=1500,'図鑑');
sec('s_lives300','輪廻の旅人','人生を300回終える',k=>k==='d'&&(META.lives||0)>=299,'人生');
A2.forEach(a=>ACH.push(a));
// 実績に必要な目印
const _mergeFlag=document.addEventListener('click',e=>{const b=e.target.closest('[data-cm="merge2"],[data-coby],[data-act="townRen"]');if(!b||!S)return;if(b.dataset.cm==='merge2')S.flags.merged=1;else if(b.dataset.coby)S.flags.boughtCo=1;else S.flags.townRen=1},true);
document.addEventListener('click',e=>{const b=e.target.closest('[data-act="oftSet"]');if(b&&S)S.flags.oftN=(S.flags.oftN||0)+1},true);
const _hf40=hostFinish;hostFinish=function(h,wi){const r=_hf40(h,wi);if(r&&r.includes('身内びいき'))S.flags.judgeFlame=1;return r};
const _log40=log;log=function(t,c){try{if(S&&typeof t==='string'){if(t.startsWith('謎の箱：すてき'))S.flags.boxWin=(S.flags.boxWin||0)+1;if(age()>=100&&/バズ/.test(t))S.flags.buzzOld=1}}catch(_){}return _log40(t,c)};
// 分野の割りふり（前からある実績にも）
const ACH_CAT={};
for(const a of ACH){const [id]=a;if(a[7]){ACH_CAT[id]=a[7];continue}
  ACH_CAT[id]=/^(f\d|fx|buzz|flame|realstar|creator|kidch|honest|nosns|chname|sub3|snsbuy|teenstar|latebloom|noflame|allsns|allbuy)/.test(id)?'SNS':/^(rich|rags|subs|world|coll|rocket|broke|nosnsrich)/.test(id)?'お金':/^(office|talent|co|prod|svc|oftype|slot|zeroturn|flop)/.test(id)?'事業':/^(town|mayor|nation|towns|poormayor)/.test(id)?'まち':/^(tal|god|resall)/.test(id)?'素質・能力':/^(married|kids|gen|single)/.test(id)?'家族':/^ev/.test(id)?'図鑑':'人生'}
const ACH_TABS=['すべて','人生','家族','SNS','お金','事業','まち','賞・イベント','大計画','素質・能力','図鑑'];let ACH_TAB='すべて';
showAch=function(){const got=ACH.filter(a=>META.ach[a[0]]).length;const pct=Math.round(got/ACH.length*100);const list=ACH.filter(a=>ACH_TAB==='すべて'||ACH_CAT[a[0]]===ACH_TAB);
  const row=a=>{const [id,n,d,,h,hn,hd]=a,ok=META.ach[id];if(h)return `<div class="ach ${ok?'got':''} secret"><b>${ok?esc(hn):'？？？'}${ok?' <span class="chip up">ひみつ</span>':''}</b><span>${ok?esc(hd):'条件はひみつ'}</span></div>`;return `<div class="ach ${ok?'got':''}"><b>${ok?esc(n):'？？？'}</b><span>${esc(d)}</span></div>`};
  const tabsH=ACH_TABS.map(t=>{const l=ACH.filter(a=>t==='すべて'||ACH_CAT[a[0]]===t);const g=l.filter(a=>META.ach[a[0]]).length;return `<button type="button" class="${ACH_TAB===t?'on':''}" data-achtab="${t}">${t} ${g}/${l.length}</button>`}).join('');
  const body=`<div class="kv"><span>達成率</span><span>${pct}%（${got} / ${ACH.length}）</span><span>これまでの人生</span><span>${META.lives||0}回</span><span>最高フォロワー</span><span>${num(META.bestF||0)}人</span><span>出来事図鑑</span><span>${Object.keys(META.seen).length} / ${Object.keys(EV).length}</span></div><div class="tbar"><i style="width:${pct}%"></i></div>
  <h3>実績</h3><div class="achl">${list.filter(a=>!a[4]).map(row).join('')||'<p class="hint">この分野にはない</p>'}</div>${list.some(a=>a[4])?`<h3>ひみつの実績（${list.filter(a=>a[4]&&META.ach[a[0]]).length} / ${list.filter(a=>a[4]).length}）</h3><p class="hint">解除するまで、名前も条件もわからない。</p><div class="achl">${list.filter(a=>a[4]).map(row).join('')}</div>`:''}
  <h3>集めた称号</h3><p class="small">${Object.keys(META.titles).map(esc).join('・')||'まだない'}</p>`;
  const m=$('#mcard');if(!$('#modal').hidden&&m.dataset.kind==='ach'&&$('#achBody')){m.querySelectorAll('[data-achtab]').forEach((b,i)=>b.outerHTML=b.outerHTML);m.querySelector('.achtabs').innerHTML=tabsH;$('#achBody').innerHTML=body;$('#achBody').scrollTop=0;return}
  openModal(`<div class="mcat life">実績・図鑑</div><h2>実績・図鑑</h2><div class="seg wrapseg achtabs">${tabsH}</div><div id="achBody" class="fbody">${body}</div><button class="b pri" type="button" data-act="close">閉じる</button>`);m.classList.add('fixedsize','menufix');m.dataset.kind='ach'};
document.addEventListener('click',e=>{const b=e.target.closest('[data-achtab]');if(!b)return;ACH_TAB=b.dataset.achtab;showAch()});
