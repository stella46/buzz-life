
// ===== v2.4：あらゆる場面に「とんでもなく高額なアクション」 =====
function bigRoom(f){const key=S.main,cap=SNS[key].cap;return Math.max(0,cap-S.f[key])*f}
function bigF(f){if(!S.snsOpen||!S.open[S.main])return 0;const g=Math.round(bigRoom(f));S.f[S.main]+=g;S.mo.newF=(S.mo.newF||0)+g;return g}
function bigCo(){return (S.cos||[]).find(c=>c.id===S.cfocus)||(typeof myCoTop==='function'?myCoTop():(S.cos||[])[0])}
function bigShops(fn){let n=0;for(const T of allTowns())for(const t of (T.tiles||[]))if(SHOP[t.t]){fn(t);n++}return n}
// [キー,場所,名前,説明,費用(円・物価で調整),くり返せるまでの月,条件,効果]
const BIG=[
 ['adjack','sns','世界の広告枠をすべて買う','1か月、世界中の広告があなたのチャンネル一色に。届く人数の残りの2%がファンに',1e10,12,null,()=>`登録者が${num(bigF(.02))}人ふえた。`],
 ['satlive','sns','宇宙から24時間の生配信特番','宇宙から丸一日の生配信。残りの4%がファンに・評判+5',1e11,24,null,()=>{const g=bigF(.04);ad('rep',5);return `世界中が見守った。登録者が${num(g)}人ふえた。`}],
 ['skyad','sns','夜空に映す広告','衛星を並べて、夜空にチャンネル名を映す。残りの6%がファンに（評判は少し下がる）',1e12,36,null,()=>{const g=bigF(.06);ad('rep',-2);return `話題になったが、「星が見えない」との声も。登録者が${num(g)}人ふえた。`}],
 ['fanisle','sns','ファンのための島に招待','島をひとつ買い取り、ファンを招いて夢の1週間を。熱心なファンが大きくふえる',5e12,60,null,()=>{S.fanCore=clamp((S.fanCore||.05)+.08,.02,.6);const g=bigF(.03);ad('happy',8);return `一生の思い出になったと、ファンが涙した。登録者が${num(g)}人ふえた。`}],
 ['galfan','sns','銀河ファンミーティング','宇宙コロニーに、星々のファンを集める。残りの15%がファンに',1e16,120,()=>megaDoneAny('colony1'),()=>`銀河じゅうから歓声が届いた。登録者が${num(bigF(.15))}人ふえた。`],
 ['rdlab','co','世界最大の研究所を建てる','フォーカス中の会社に研究所を。次の作品の評価+15・会社の価値+10%',1e12,36,()=>(S.cos||[]).length>0,()=>{const c=bigCo();if(!c)return '';S.flags.bigQ=15;c.val=Math.round(c.val*1.1);return `「${c.name}」に巨大な研究所ができた。`}],
 ['cobonus','co','全社員に特別ボーナス','すべての会社の社員に特別ボーナス。社員のやる気が最高に',1e10,12,()=>(S.cos||[]).length>0,()=>{for(const c of S.cos){coInit(c);c.emp.mor=100}ad('rep',3);return 'すべての社員のやる気が最高になった。'}],
 ['colaunch','co','全世界同時発売','次に完成する作品を、世界中で同時に発売する。売上が5倍の勢いに',5e12,24,()=>(S.cos||[]).length>0,()=>{S.flags.bigHit=1;return '次の作品は、世界同時発売になる。'}],
 ['coindustry','co','業界まるごと買収','同じ分野の会社を次々に買い取る。会社の価値+50%・利益の土台+30%・同じ分野のライバル企業はいなくなる',1e14,60,()=>(S.cos||[]).length>0,()=>{const c=bigCo();if(!c)return '';c.val=Math.round(c.val*1.5);c.cap=Math.round(c.cap*1.3);if(S.rcos)S.rcos=S.rcos.filter(r=>r.k!==c.k);ad('rep',-3);return `「${c.name}」が業界の頂点に立った。`}],
 ['redev','town','まち全体の超再開発','ふるさとのまちを、まるごと新しく。発展度が大きく上がる',1e12,24,null,()=>{const T=homeTown();if(T)T.bonus=(T.bonus||0)+30;ad('rep',3);return 'まちが見ちがえるほど新しくなった。'}],
 ['futurecity','town','未来都市への大改造','空飛ぶ車と緑のビルが並ぶ未来都市に。発展度が大幅に上がる',1e14,60,null,()=>{const T=homeTown();if(T)T.bonus=(T.bonus||0)+100;ad('rep',10);return 'ふるさとは、世界がうらやむ未来都市になった。'}],
 ['freehouse','town','すべての住民に家を','まちの住民みんなに、新しい家をプレゼント。支持と幸福が上がる',5e13,60,null,()=>{for(const T of allTowns())T.support=clamp((T.support||50)+20);ad('happy',10);ad('rep',8);return 'まちじゅうが、お祝いムードに包まれた。'}],
 ['shopchain','shop','全店舗を世界チェーンに','持っているお店すべてを世界展開。1年間お客さんが大きくふえ、評価も上がる',5e11,24,()=>bigShops(()=>{})>0,()=>{const n=bigShops(t=>{t.stars=Math.min(5,(t.stars||3)+1);t.boost=2;t.boostEnd=S.am+12});return `${n}軒のお店が、世界中に支店を出した。`}],
 ['shopchef','shop','世界一の職人を全店に','すべてのお店に、世界一の職人を招く。評価が最高に',1e11,12,()=>bigShops(()=>{})>0,()=>{const n=bigShops(t=>{t.stars=5});return `${n}軒のお店の評価が、最高になった。`}],
 ['taltour','office','所属タレントの世界ツアー','所属タレント全員で世界をまわる。タレントのフォロワーが1.5倍に',1e11,24,()=>S.office&&(S.office.talents||[]).length>0,()=>{for(const t of S.office.talents)t.f=Math.round((t.f||0)*1.5);ad('rep',4);return '世界中で、所属タレントの名前が知られるようになった。'}],
 ['taldome','office','事務所専用のドーム','事務所だけの巨大ドームを建てる。タレントのフォロワー+20%・評判+5',1e12,60,()=>S.office&&S.office.lv>0,()=>{for(const t of (S.office.talents||[]))t.f=Math.round((t.f||0)*1.2);ad('rep',5);return '事務所のドームが完成した。毎週どこかで公演がある。'}],
 ['svcfree','svc','全サービス1年無料キャンペーン','自分のサブスクを1年間無料に。会員が2倍に',1e11,24,()=>(S.svcs||[]).length>0,()=>{for(const s of S.svcs)s.users=Math.round((s.users||0)*2+1000);return 'たくさんの人が、サービスを使い始めた。'}],
 ['svcworld','svc','全サービスを世界同時展開','自分のサブスクを、世界中で同時に始める。会員1.5倍・新しいお客さんがふえる',1e12,36,()=>(S.svcs||[]).length>0,()=>{for(const s of S.svcs){s.users=Math.round((s.users||0)*1.5+5000);s.mkt=(s.mkt||0)+Math.max(1e5,(s.users||0))}return 'サービスが、世界中で使われるようになった。'}],
 ['donate','money','世界最大の財団に寄付','とてつもない額を寄付する。評判+30・幸福+10',1e13,24,null,()=>{ad('rep',30);ad('happy',10);return '世界中から感謝の声が届いた。'}],
 ['buyart','money','歴史的な名画をすべて買い取る','世界中の名画を買い取り、美術館で無料公開する',5e12,60,null,()=>{ad('rep',15);ad('happy',8);return '美術館には、毎日長い行列ができている。'}],
 ['worldtrip','life','家族と友達みんなで世界一周','大切な人をみんな招いて、豪華客船で世界一周',5e9,24,null,()=>{for(const [n] of pplAll())rel(n,15);ad('happy',15);ad('mental',10);return '一生忘れられない旅になった。'}],
 ['spacewed','life','宇宙で結婚記念式','パートナーと宇宙ステーションで記念の式を',1e11,120,()=>!!S.spouse,()=>{rel(S.spouse,30);ad('happy',30);return '地球を見下ろしながら、ふたりで誓いを新たにした。'}],
 ['kidsuniv','life','子どもの名前の大学を建てる','子どもの名前がついた大学を建てる',1e11,120,()=>(S.kids||[]).length>0,()=>{for(const c of S.kids)c.bond=(c.bond||50)+15;ad('happy',10);ad('rep',5);return '子どもたちは、少し照れくさそうに喜んだ。'}],
 ['young','life','最先端の若返り治療','世界最高の医療チームによる若返り治療',1e13,60,null,()=>{ad('health',30);ad('mental',10);S.medBuff=Math.min(6,(S.medBuff||0)+1);return '体が軽くなり、何歳も若返った気がする。'}],
 ['isle','life','家族で無人島を貸し切り','家族だけで、無人島で1か月のんびり過ごす',1e10,12,null,()=>{ad('happy',10);ad('mental',15);for(const [n,k] of pplAll())if(k==='spouse'||k==='fam')rel(n,8);return '何もしない時間が、最高のぜいたくだった。'}]];
function bigCost(b){return Math.round(b[4]*Math.max(.2,S.cty.inc))}
function bigCd(b){const l=(S.bigcd||{})[b[0]];return l==null?0:Math.max(0,l+b[5]-S.am)}
function bigHtml(area){if(age()<18)return '';const L=BIG.filter(b=>b[1]===area&&(!b[6]||b[6]()));if(!L.length)return '';const min=Math.min(...L.map(bigCost));if(S.money<min*.05)return '';
 return `<details class="bigacts"><summary>💎 とんでもなく高額なアクション（${L.length}）</summary>${L.map(b=>{const c=bigCost(b),cd=bigCd(b);return `<div class="shop"><div><div>${esc(b[2])}</div><div class="muted small">${esc(b[3])}<br><b>${yen(c)}</b>${cd?`・あと${cd}か月で、もう一度できる`:''}</div></div><button class="b sm" type="button" data-big="${b[0]}" ${S.money<c||cd?'disabled':''}>実行する</button></div>`}).join('')}</details>`}
function bigDo(k){const b=BIG.find(x=>x[0]===k);if(!b||(b[6]&&!b[6]())||bigCd(b))return;const c=bigCost(b);if(S.money<c)return;outc('big',c);S.bigcd=S.bigcd||{};S.bigcd[k]=S.am;let msg='';try{msg=b[7]()||''}catch(e){console.error(e)}
 log(`${b[2]}（${yen(c)}）${msg?'：'+msg:''}`,'good');tl(b[2]);if(typeof hlAdd==='function')hlAdd('💎 '+b[2]);if(typeof popBig==='function')popBig('💎 '+b[2],esc(msg),yen(c));S.flags.bigN=(S.flags.bigN||0)+1;snd('buy');save();render()}
document.addEventListener('click',e=>{const b=e.target.closest('[data-big]');if(!b||!S)return;bigDo(b.dataset.big)});
try{Object.assign(OUT_LBL,{big:'高額なアクション'})}catch(_){}
// 画面に追加
const _ps50=panelSns;panelSns=function(){return _ps50.apply(this,arguments)+(S.snsOpen?bigHtml('sns'):'')};
const _pb50=panelBiz;panelBiz=function(){const h=_pb50.apply(this,arguments);const m={co:'co',town:'town',shop:'shop',office:'office',svc:'svc'}[SUB.biz];return m?h+bigHtml(m):h};
const _pm50=panelMoney;panelMoney=function(){const h=_pm50.apply(this,arguments);return SUB.money==='spend'?h+bigHtml('money'):h};
const _kh50=koryuHtml;koryuHtml=function(){return _kh50.apply(this,arguments)+bigHtml('life')};
// 作品への効果
const _pe50=prodExtra;prodExtra=function(c,a){let v=_pe50(c,a);if(S.flags.bigQ){v+=S.flags.bigQ;S.flags.bigQ=0}return v};
const _pr50=prodRelease;prodRelease=function(c){const r=_pr50.apply(this,arguments);try{if(S.flags.bigHit){const s=c.pr&&c.pr.sales&&c.pr.sales[c.pr.sales.length-1];if(s){s.amt*=5;s.left=Math.max(s.left,18)}S.flags.bigHit=0;log(`「${c.name}」の新作が、世界同時発売で飛ぶように売れている`,'good')}}catch(e){console.error(e)}return r};
(function(){const A=(id,n,d,f)=>{ACH.push([id,n,d,f]);if(typeof ACH_CAT!=='undefined')ACH_CAT[id]='お金'};A('big1','けた外れ','とんでもなく高額なアクションを実行する',()=>(S.flags.bigN||0)>=1);A('big20','けた外れの日常','とんでもなく高額なアクションを20回実行する',()=>(S.flags.bigN||0)>=20)})();
