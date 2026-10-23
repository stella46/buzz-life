// ===== v1.1：プレイ時間・バランス・サブチャンネル・お金の使い道・まちの自動化・研究・チュートリアル・軽さ =====
const ci2=()=>Math.max(.2,S.cty.inc);
function fmtDur(ms){ms=ms||0;const m=Math.floor(ms/60000),h=Math.floor(m/60);return h?`${h}時間${m%60}分`:`${m}分`}
function fmtDate(t){if(!t)return 'まだない';const d=new Date(t);return `${d.getFullYear()}/${d.getMonth()+1}/${d.getDate()} ${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`}

// ----- プレイ時間 -----
let PT_LAST=Date.now();
setInterval(()=>{const t=Date.now(),dt=Math.min(5000,t-PT_LAST);PT_LAST=t;if(document.hidden)return;
  if(typeof META!=='undefined'){META.playMs=(META.playMs||0)+dt;META.verMs=META.verMs||{};META.verMs[CUR_VER]=(META.verMs[CUR_VER]||0)+dt}
  if(S&&S.alive&&!$('#scrGame').hidden){S.playMs=(S.playMs||0)+dt;S.lifeMs=(S.lifeMs||0)+dt}},1000);
setInterval(()=>{try{saveMeta()}catch(_){}},15000);
function playHtml(){const sv=loadSaved();const vm=(META.verMs)||{};
  return `<div class="kv"><span>サイト全体のプレイ時間</span><span>${fmtDur(META.playMs)}</span>${S?`<span>このセーブのプレイ時間</span><span>${fmtDur(S.playMs)}</span><span>この人生のプレイ時間</span><span>${fmtDur(S.lifeMs)}</span>`:sv?`<span>続きのセーブのプレイ時間</span><span>${fmtDur(sv.playMs)}</span>`:''}<span>最後にセーブした日時</span><span>${fmtDate((S||sv||{}).savedAt)}</span></div>
  <h3>バージョンごとのプレイ時間</h3><div class="kv">${Object.entries(vm).sort((a,b)=>b[1]-a[1]).map(([v,ms])=>`<span>${esc(v)}</span><span>${fmtDur(ms)}</span>`).join('')||'<span>まだない</span><span></span>'}</div>`}
function showPlay(){openModal(`<div class="mcat life">記録</div><h2>プレイ時間の記録</h2>${playHtml()}<p class="hint">ゲームの画面を開いている間だけ数える（タブを裏にしているあいだは数えない）。</p><button class="b pri" type="button" data-act="close">閉じる</button>`)}
function contInfo(){let el=$('#contInfo');const b=$('#btnCont');if(!b)return;if(!el){el=document.createElement('p');el.id='contInfo';el.className='hint continfo';b.after(el)}const sv=loadSaved();el.hidden=!sv;if(sv)el.textContent=`${sv.name||''}（${Math.floor((sv.am||0)/12)}歳）・プレイ時間 ${fmtDur(sv.playMs)}・最後のセーブ ${fmtDate(sv.savedAt)}`}

// ----- 保存を軽く（倍速中はまとめて保存） -----
let SAVE_T=0,SAVE_P=null;
function save(force){if(!S||!S.alive)return;const now=Date.now();
  if(!force&&(speed>0||skipping)&&now-SAVE_T<2000){if(!SAVE_P)SAVE_P=setTimeout(()=>{SAVE_P=null;save(true)},2100);return}
  SAVE_T=now;S.savedAt=now;try{localStorage.setItem(CFG.save,JSON.stringify(S))}catch(e){}}
addEventListener('visibilitychange',()=>{if(document.hidden)save(true)});addEventListener('pagehide',()=>save(true));
let RS_T=null,SUBPOST=0;function renderSoon(){if(RS_T)return;RS_T=setTimeout(()=>{RS_T=null;try{render()}catch(_){}},350)}

// ----- 出来事の選び方を軽く -----
let EVL=null;
function rollEvent(k){
  if(age()<1)return null;if(!EVL)EVL=Object.values(EV).filter(e=>e.w>0);
  const spaced=S.lastEv!=null&&S.am-S.lastEv<(age()<13?1:2);
  const rate=age()<13?.45:.3,old=S.y<SNS_ERA&&!S.snsOpen;const hits=[];
  for(const e of EVL){if(e.once&&S.seen[e.id])continue;if(e.cd&&S.cd[e.id]!=null&&S.am-S.cd[e.id]<e.cd)continue;if(e.w<1&&spaced)continue;if(old&&isModern(e))continue;
    if(!chance(Math.min(1,e.w*(e.w>=1?1:rate))*k))continue;let ok=true;try{ok=!e.when||e.when()}catch(_){ok=false}if(ok)hits.push(e)}
  const ev=hits.length?pick(hits):null;if(ev&&ev.w<1)S.lastEv=S.am;return ev}

// ----- ライバル：あなたの0.6〜1.5倍あたりを目標に伸び縮み -----
function rivalTick(){const r=S.rival;if(!r)return;if(!r.mul||(S.m===1&&chance(.35)))r.mul=R(.6,1.5)*(r.trait==='努力家'?1.12:r.trait==='負けず嫌い'?1.08:1);
  const T=Math.max(1200,totalF()*r.mul+Math.max(0,age()-13)*150);const gap=T-r.f;
  r.f=Math.round(clamp(r.f+gap*R(.03,.08)+r.f*R(-.008,.012),50,4e7));
  if(chance(.004)&&!S.q.includes('rv_buzz')&&!(S.cd.rv_buzz!=null&&S.am-S.cd.rv_buzz<24))S.q.push('rv_buzz');else if(chance(.002)&&!S.q.includes('rv_scandal')&&!(S.cd.rv_scandal!=null&&S.am-S.cd.rv_scandal<36))S.q.push('rv_scandal')}
E('rv_buzz',{t:'ライバルがバズった',cat:'SNS',w:0,text:()=>`ライバルの「${S.rival.name}」の投稿が大バズり。フォロワーが一気に増えている。`,
  ch:[['負けてられない',()=>{ad('plan',2);persAdd('compet',2);S.rival.f=Math.round(S.rival.f*1.25);return 'こっちも次の企画を練り直そう。'}],['おめでとうと伝える',()=>{rel(S.rival,8);S.rival.f=Math.round(S.rival.f*1.25);ad('social',2);return '「ありがとう！今度コラボしよう」と返ってきた。'}]]});
E('rv_scandal',{t:'ライバルの炎上',cat:'SNS',w:0,text:()=>`ライバルの「${S.rival.name}」が炎上している。`,
  ch:[['そっとしておく',()=>{S.rival.f=Math.round(S.rival.f*.8);ad('rep',1);return '人の不幸に乗っからないことにした。'}],['励ましのメッセージを送る',()=>{S.rival.f=Math.round(S.rival.f*.85);rel(S.rival,12);return '「本当に助かった」と返事が来た。'}],['ネタにする',()=>{S.rival.f=Math.round(S.rival.f*.8);ad('f',.03);ad('rep',-6);rel(S.rival,-25);if(chance(.3))S.q.push('flame');return '伸びたけれど、後味は悪い。'}]]});

// ----- 家族チャンネル：伸びに上限、親が亡くなったら引き継ぐ -----
function kidChannelTick(k){
  if(!S.kc.on||(age()>=13&&!S.kc.cont))return;
  const cap=2e5*(S.cty.net||1)*(S.tier>=3?1.5:1)*(age()<6?1:age()<13?.8:.5);
  const g=(30+S.kc.f*.02)*R(.4,1.6)*k*Math.max(0,1-S.kc.f/cap)*(age()>=13?.35:1);S.kc.f=Math.max(0,S.kc.f+g-(age()>=13?S.kc.f*.003*k:0));
  if(chance(.02*k)&&S.kc.f<cap){S.kc.f+=RI(1000,8000);log('家族チャンネルの動画がバズったらしい','sns')}
  if(age()>=6)inc('kc',Math.round(S.kc.f*.02*k*(S.kc.share?3:1)*Math.max(.15,S.cty.inc)));
  ad('priv',-.4*k*(age()>=13?.5:1))}
function kcRunnerAlive(){const p=S.kc.by==='父'?S.fam.fa:S.kc.by==='母'?S.fam.mo:null;return !p||p.alive!==false}
E('kc_inherit',{t:'家族チャンネルを引き継ぐ',cat:'家族チャンネル',w:0,text:()=>`家族チャンネルを運営していた${S.kc.byName}が亡くなった。登録者${num(S.kc.f)}人のチャンネルが残っている。`,
  ch:[['自分のチャンネルとして引き継ぐ',()=>{const f=Math.round(S.kc.f);S.kc.on=0;S.kc.cont=0;S.kc.was=1;if(!S.snsOpen){openSns('milu');S.main='milu'}if(!S.subch)S.subch=[];if(S.subch.length<3)S.subch.push({id:'kc'+S.am,name:'家族チャンネル',genre:'vlog',style:'chill',plan:'normal',f,core:.25,anti:.01});else S.f[S.main]+=Math.round(f*.5);tl('家族チャンネルを引き継いだ');return '思い出の詰まったチャンネルを、これからは自分が守っていく。'}],
     ['静かに終わりにする',()=>{S.kc.on=0;S.kc.cont=0;ad('mental',3);return '最後に感謝の動画を出して、チャンネルを閉じた。'}]]});

// ----- サブチャンネル -----
function totalF(){let t=0;for(const k in S.f)if(S.open[k])t+=S.f[k];if(S.subch)for(const c of S.subch)t+=c.f||0;return t}
function postAll(k){const subs=S.subch||[];const share=1/(1+.6*subs.length);POPT=postPlanNow();doPost(k*share);POPT='normal';for(const c of subs)try{subPost(c,k*share*.6)}catch(e){console.error(e)}}
function subPost(c,k){const key=S.main,sv={genre:S.genre,style:S.style,series:S.series,core:S.fanCore,anti:S.fanAnti,f:S.f[key],posts:S.posts,cw:S.collabWith};
  S.genre=genreOk(c.genre)?c.genre:sv.genre;S.style=c.style||'norm';S.series=c.series||{g:S.genre,n:0,fat:0};S.fanCore=c.core||.05;S.fanAnti=c.anti||.02;S.f[key]=c.f||0;S.posts=[];S.collabWith=null;POPT=['normal','short','big','live'].includes(c.plan)?c.plan:'normal';
  SUBPOST=1;try{doPost(k)}finally{SUBPOST=0;c.f=S.f[key];c.series=S.series;c.core=S.fanCore;c.anti=S.fanAnti;if(S.posts[0])c.last=S.posts[0];S.genre=sv.genre;S.style=sv.style;S.series=sv.series;S.fanCore=sv.core;S.fanAnti=sv.anti;S.f[key]=sv.f;S.posts=sv.posts;S.collabWith=sv.cw;POPT='normal'}}
function chHtml(){const subs=S.subch||[];const gs=Object.entries(GENRES).filter(([k])=>genreOk(k)),sts=Object.entries(STYLES),pl=POSTPLAN.filter(p=>p.k!=='collab');
  const sel=(id,k,list,cur)=>`<select data-sch="${id}" data-k="${k}">${list.map(([v,o])=>`<option value="${v}" ${cur===v?'selected':''}>${esc(o.n)}</option>`).join('')}</select>`;
  let h=`<h3>チャンネル</h3><p class="hint">メインのほかにサブチャンネルを3つまで作れる。投稿はチャンネルの数で分かれるので、増やすほど1つあたりの伸びは小さくなる。ジャンルをしぼった専門チャンネルは、固定ファンがつきやすい。</p>`;
  h+=`<div class="card"><div class="hd"><span>${esc(chName('main'))}（${esc(SNS[S.main].n)}・メイン）</span><span>${num(S.f[S.main])}人</span></div><p class="hint small">ジャンル・スタイル・企画は下の「投稿の方針」で決める。</p>${chRenameHtml('main')}</div>`;
  for(const c of subs)h+=`<div class="card"><div class="hd"><span>${esc(c.name)}</span><span>${num(c.f)}人</span></div><div class="row">${sel(c.id,'genre',gs,c.genre)}${sel(c.id,'style',sts,c.style)}${sel(c.id,'plan',pl.map(p=>[p.k,p]),c.plan)}</div>${c.last?`<p class="hint small">最近の投稿：${esc(c.last.t)}（${num(c.last.v)}回再生）</p>`:''}${chRenameHtml(c.id)}<div id="schDel_${c.id}"><button class="b sm ghost" type="button" data-schdel="${c.id}">このチャンネルを閉じる</button></div></div>`;
  if(subs.length<3){const ok=S.snsOpen&&totalF()>=500;h+=`<div class="row"><input id="schName" maxlength="14" placeholder="チャンネル名"><select id="schGenre">${gs.map(([k,g])=>`<option value="${k}">${esc(g.n)}</option>`).join('')}</select><button class="b sm" type="button" data-act="schNew" ${ok?'':'disabled'}>サブチャンネルを作る</button></div>${ok?'':'<p class="hint">フォロワー500人から作れる。</p>'}`}
  return h}
document.addEventListener('change',e=>{const s=e.target.closest('[data-sch]');if(!s||!S)return;const c=(S.subch||[]).find(x=>x.id===s.dataset.sch);if(c){c[s.dataset.k]=s.value;save();renderPanel()}});
document.addEventListener('click',e=>{const b=e.target.closest('button');if(!b||!S)return;const d=b.dataset;
  if(d.act==='schNew'){if(!S.subch)S.subch=[];if(S.subch.length>=3)return;const g=($('#schGenre')||{}).value||S.genre;const nm=(($('#schName')||{}).value||'').trim().slice(0,14)||`${S.name.split(' ')[0]}の${GENRES[g].n}ch`;S.subch.push({id:'c'+Date.now().toString(36),name:nm,genre:g,style:'norm',plan:'normal',f:Math.round(Math.min(2000,totalF()*.02)),core:.08,anti:.01});tl(`サブチャンネル「${nm}」を作った`);save();renderPanel();return}
  if(d.schdel){$('#schDel_'+d.schdel).innerHTML=`<span class="confirm-inline">フォロワーはいなくなる。閉じる？ <button class="b sm danger" type="button" data-schdel2="${d.schdel}">閉じる</button><button class="b sm" type="button" data-act="schKeep">やめる</button></span>`;return}
  if(d.schdel2){S.subch=S.subch.filter(c=>c.id!==d.schdel2);save();renderPanel();return}
  if(d.act==='schKeep'){renderPanel();return}});

// ----- お金の使い道 -----
const SP_CAT={sns:'SNSに使う',self:'自分みがき',life:'暮らし',family:'家族',coll:'コレクション',inv:'投資',fame:'名声',social:'社会',town:'まちの大型事業',time:'時間を買う',res:'研究',health:'健康'};
const COLL={art:{n:'絵画',p:3e6,vol:.05,dr:.006},antique:{n:'骨董品',p:1e6,vol:.035,dr:.004},sneaker:{n:'限定スニーカー',p:1e5,vol:.06,dr:.002},retro:{n:'昔のゲーム機',p:5e4,vol:.035,dr:.004},watch:{n:'高級腕時計',p:2e6,vol:.025,dr:.003}};
const PORT={safe:{n:'安定型の投資',vol:.006,dr:.003},growth:{n:'成長型の投資',vol:.035,dr:.006},risk:{n:'ハイリスク型の投資',vol:.1,dr:.008},gold:{n:'金（ゴールド）',vol:.02,dr:.0025}};
const svcOn=k=>!!(S.svc&&S.svc[k]);
const SPEND=[
 {k:'ad_s',c:'sns',n:'広告を出す（小）',p:3e5,d:'フォロワーが増える。使うほど効き目は小さくなる',ok:()=>S.snsOpen,f:()=>adBuy(3e5)},
 {k:'ad_l',c:'sns',n:'広告を出す（大）',p:3e6,d:'フォロワーが大きく増える。使うほど効き目は小さくなる',ok:()=>S.snsOpen,f:()=>adBuy(3e6)},
 {k:'outsource',c:'sns',n:'編集の外注',p:2e5,m:1,d:'毎月：投稿の質+5',ok:()=>S.snsOpen},
 {k:'studio',c:'sns',n:'スタジオを借りる',p:3e5,m:1,d:'毎月：大型企画の費用がかからない・投稿の質+3',ok:()=>S.snsOpen},
 {k:'thumb',c:'sns',n:'サムネイル職人',p:1e5,m:1,d:'毎月：見つかりやすさ+10%',ok:()=>S.snsOpen},
 {k:'fanmeet',c:'sns',n:'ファンミーティングを開く',p:1e6,cd:6,d:'ガチ勢が大きく増え、フォロワーも少し増える',ok:()=>totalF()>=3000,f:()=>{S.fanCore=clamp(S.fanCore+.05,.02,.4);ad('f',.02);ad('happy',4);ad('social',2);tl('ファンミーティングを開いた')}},
 {k:'salon',c:'self',n:'美容院・ファッション',p:2e4,cd:1,a:13,d:'見た目+2',f:()=>ad('looks',2)},
 {k:'course',c:'self',n:'オンライン講座',p:5e4,cd:1,a:13,d:'スキルのどれかが+3',f:()=>ad(pick(['talk','plan','edit']),3)},
 {k:'school',c:'self',n:'資格スクール',p:3e5,cd:6,d:'研究ポイント+30・知識+3',f:()=>{S.rp+=30;ad('know',3)}},
 {k:'trainer',c:'self',n:'パーソナルトレーナー',p:8e4,m:1,d:'毎月：健康+0.6'},
 {k:'abroad',c:'self',n:'留学する',p:3e6,cd:60,d:'知識+15・人間関係+5・海外のファンでフォロワー+3%',f:()=>{ad('know',15);ad('social',5);ad('f',.03);tl('留学した')}},
 {k:'furn',c:'life',n:'家具セットを買う',p:5e5,cd:1,d:'部屋が少し豪華に。毎月の幸福が上がる（3回まで）',ok:()=>(S.furn||0)<3,f:()=>{S.furn=(S.furn||0)+1}},
 {k:'car2',c:'life',n:'高級車',p:8e6,once:1,d:'毎月：幸福+0.3・評判が少し上がる（維持費 月5万）',f:()=>{S.flags.car2=1;tl('高級車を買った')}},
 {k:'villa',c:'life',n:'別荘',p:5e7,once:1,d:'毎月：幸福+0.6・メンタル+0.4（維持費 月30万）',f:()=>{S.flags.villa=1;tl('別荘を買った')}},
 {k:'cat',c:'life',n:'猫を迎える',p:1e5,d:'毎月：幸福+0.3（3匹まで・世話代 月1万）',ok:()=>(S.cats||0)<3,f:()=>{S.cats=(S.cats||0)+1}},
 {k:'trip_d',c:'life',n:'国内旅行',p:1e5,cd:3,d:'幸福+6・メンタル+5・Vlogの素質+2',f:()=>{ad('happy',6);ad('mental',5);ad('tal.vlog',2)}},
 {k:'trip_w',c:'life',n:'海外旅行',p:5e5,cd:6,d:'幸福+10・知識+3・Vlogの素質+4',f:()=>{ad('happy',10);ad('know',3);ad('tal.vlog',4)}},
 {k:'trip_s',c:'life',n:'宇宙旅行',p:5e7,cd:60,d:'一生の思い出。幸福+25・フォロワー+5%（2045年から）',ok:()=>S.y>=2045,f:()=>{ad('happy',25);ad('f',.05);tl('宇宙旅行に行った')}},
 {k:'edu',c:'family',n:'子どもの教育費',p:5e4,m:1,d:'毎月（子ども1人あたり）：子どもの知識と絆が上がり、引き継いだとき強くなる',ok:()=>S.kids.some(c=>(S.am-c.born)/12<22)},
 {k:'gift_p',c:'family',n:'親孝行の旅行をプレゼント',p:3e5,cd:12,d:'親との仲+10',ok:()=>parents().some(p=>p.alive!==false),f:()=>relP(10)},
 {k:'anniv',c:'family',n:'記念日のディナー',p:3e4,cd:12,d:'配偶者・恋人との仲+6',ok:()=>!!lover(),f:()=>rel(lover(),6)},
 {k:'ftrip',c:'family',n:'家族旅行',p:4e5,cd:12,d:'家族みんなとの絆が深まる',ok:()=>S.spouse||S.kids.length,f:()=>{if(S.spouse)rel(S.spouse,6);for(const c of S.kids)c.bond=clamp((c.bond||50)+8,0,100);ad('happy',6)}},
 {k:'col_art',c:'coll',n:'絵画を買う',p:3e6,d:'値段が上がったり下がったりする。売ることもできる',f:()=>collBuy('art')},
 {k:'col_antique',c:'coll',n:'骨董品を買う',p:1e6,d:'ゆっくり値上がりしやすい',f:()=>collBuy('antique')},
 {k:'col_watch',c:'coll',n:'高級腕時計を買う',p:2e6,d:'値段が安定しやすい',f:()=>collBuy('watch')},
 {k:'col_sneaker',c:'coll',n:'限定スニーカーを買う',p:1e5,d:'値動きが大きい',f:()=>collBuy('sneaker')},
 {k:'col_retro',c:'coll',n:'昔のゲーム機を買う',p:5e4,d:'じわじわ値上がり',f:()=>collBuy('retro')},
 {k:'estate',c:'inv',n:'不動産投資（1口）',p:3e7,d:'毎月、家賃収入が入る。売ると9割で戻る',f:()=>{S.estate=(S.estate||0)+1;tl('不動産に投資した')}},
 {k:'venture',c:'inv',n:'ベンチャーに出資',p:5e6,d:'数年後、10倍になることも、なくなることも',f:()=>ventBuy(5e6,'ベンチャー')},
 {k:'book',c:'fame',n:'本・写真集を出版',p:3e6,cd:24,d:'これから1年、印税が入る（フォロワーしだい）',ok:()=>totalF()>=1e4,f:()=>{S.royal={left:12,amt:Math.round(totalF()*R(8,20)*ci2()/12)};tl('本を出版した');ad('rep',3)}},
 {k:'goods',c:'fame',n:'グッズを作る',p:2e6,cd:6,d:'売れれば大きな利益。売れ残ることも',ok:()=>totalF()>=5000,f:()=>{const r=Math.round(2e6*ci2()*R(.3,2.5)*clamp(totalF()/1e5,.2,3));inc('goods',r);return `グッズの売上は${yen(r)}だった。`}},
 {k:'tour',c:'fame',n:'ライブツアー',p:1e7,cd:12,d:'大きな収入と評判。体力を使う',ok:()=>totalF()>=1e5,f:()=>{const r=Math.round(totalF()*R(60,200)*ci2()*.1);inc('goods',r);ad('rep',4);ad('mental',-6);ad('health',-4);ad('f',.03);tl('ライブツアーをした');return `ツアーの売上は${yen(r)}。`}},
 {k:'movie',c:'fame',n:'映画に出資する',p:5e7,cd:24,d:'2年後に結果が出る。大ヒットなら4倍、こけたらゼロ',f:()=>ventBuy(5e7,'映画',24,36,'movie')},
 {k:'tvsp',c:'fame',n:'テレビ番組のスポンサー',p:3e6,m:1,d:'毎月：評判+0.5・フォロワー+1%'},
 {k:'d_school',c:'social',n:'学校を建てる寄付',p:1e8,cd:60,d:'まちの支持+15・評判+10・発展度+5',f:()=>{const T=homeTown();T.support=clamp((T.support||50)+15);T.bonus+=5;ad('rep',10);tl('学校の建設に寄付した')}},
 {k:'d_hosp',c:'social',n:'病院を建てる寄付',p:2e8,cd:60,d:'まちの支持+20・評判+15・発展度+8',f:()=>{const T=homeTown();T.support=clamp((T.support||50)+20);T.bonus+=8;ad('rep',15);tl('病院の建設に寄付した')}},
 {k:'scholar',c:'social',n:'奨学金の基金をつくる',p:5e7,once:1,d:'毎月：評判+0.3',f:()=>{S.flags.scholar=1;tl('奨学金の基金をつくった')}},
 {k:'fest_sp',c:'social',n:'地域のお祭りのスポンサー',p:3e6,cd:12,d:'まちの支持+5・評判+2',f:()=>{const T=homeTown();T.support=clamp((T.support||50)+5);ad('rep',2)}},
 {k:'sport_sp',c:'social',n:'スポーツチームのスポンサー',p:5e6,m:1,d:'毎月：評判+0.5・フォロワー+0.5%'},
 {k:'team',c:'social',n:'スポーツチームのオーナーになる',p:5e9,once:1,d:'毎月、もうけか赤字が出る。評判とフォロワーが上がる',f:()=>{S.flags.team=1;tl('スポーツチームのオーナーになった');ad('rep',15);ad('f',.1)}},
 {k:'lm_tower',c:'town',n:'展望タワーを建てる',p:3e9,once:1,d:'今のまちの発展度+30・観光客が増える',f:()=>lmBuild('タワー',30)},
 {k:'lm_stadium',c:'town',n:'スタジアムを建てる',p:5e9,once:1,d:'今のまちの発展度+45',f:()=>lmBuild('スタジアム',45)},
 {k:'lm_park',c:'town',n:'テーマパークを建てる',p:8e9,once:1,d:'今のまちの発展度+60・観光客がとても増える',f:()=>lmBuild('テーマパーク',60)},
 {k:'lm_air',c:'town',n:'空港を建てる',p:1.5e10,once:1,d:'今のまちの発展度+80',f:()=>lmBuild('空港',80)},
 {k:'maid',c:'time',n:'家事代行',p:1.5e5,m:1,d:'毎月：自由に使える枠が1つ増える'},
 {k:'secretary',c:'time',n:'秘書',p:3e5,m:1,d:'毎月：支払いと確定申告を自動でしてくれる'},
 {k:'manager2',c:'time',n:'専属マネージャー',p:4e5,m:1,d:'毎月：仕事の依頼を取ってきて収入が入る（フォロワー5000人から）',ok:()=>totalF()>=5000},
 {k:'lab',c:'res',n:'研究所をつくる・広げる',p:3e7,d:'毎月の研究ポイント+3（3段まで）',ok:()=>(S.lab||0)<3,f:()=>{S.lab=(S.lab||0)+1;tl('研究所をつくった')}},
 {k:'uni',c:'res',n:'大学に寄付する',p:1e8,cd:60,d:'研究ポイント+100・評判+5',f:()=>{S.rp+=100;ad('rep',5)}},
 {k:'think',c:'res',n:'シンクタンクと契約',p:1e6,m:1,d:'毎月：研究ポイント+2'},
 {k:'dock',c:'health',n:'人間ドック',p:5e4,cd:12,a:18,d:'健康+5。病気が早く見つかる',f:()=>{ad('health',5);if(S.flags.cancer==='untreated')S.flags.cancer='treat'}},
 {k:'gourmet',c:'health',n:'体にいい食事',p:1e5,m:1,d:'毎月：健康+0.3・幸福+0.3'},
 {k:'premed',c:'health',n:'最先端の医療',p:1e7,d:'病気や寿命のリスク-10%（2回まで・2040年から）',ok:()=>S.y>=2040&&(S.medBuff||0)<2,f:()=>{S.medBuff=(S.medBuff||0)+1}}
];
const spendMort=()=>Math.pow(.9,(S&&S.medBuff)||0);
const spCost=it=>Math.round(it.p*ci2()*(it.k==='edu'?Math.max(1,S.kids.filter(c=>(S.am-c.born)/12<22).length):1));
function adBuy(p){const c=p*ci2();const eff=1/(1+(S.adSpent||0)/(8e6*ci2()));S.adSpent=(S.adSpent||0)+c;const g=Math.round(p/60*eff*(1+Math.sqrt(totalF())/400));S.f[S.main]+=g;S.mo.newF+=g;return `${num(g)}人がフォローしてくれた。`}
function collBuy(k){if(!S.coll)S.coll=[];const c=COLL[k],p=Math.round(c.p*ci2());S.coll.push({id:'k'+Date.now().toString(36)+RI(10,99),k,n:c.n,buy:p,val:p});return `${c.n}を手に入れた。`}
function ventBuy(p,n,a0,a1,kind){if(!S.vent)S.vent=[];S.vent.push({amt:Math.round(p*ci2()),n,until:S.am+RI(a0||36,a1||96),kind:kind||'v'});return `${n}に出資した。結果は数年後。`}
function lmBuild(n,dev){const T=S.town;if(!T.lm)T.lm=[];T.lm.push(n);T.bonus+=dev;T.support=clamp((T.support||50)+10);T.dev=calcDev();tl(`${townName(T)}に${n}を建てた`);ticker(`${townName(T)}に${n}が完成`);return `${n}が完成した！`}
function spendOk(it){if(age()<(it.a||18))return false;if(it.once&&S.spent&&S.spent[it.k])return false;if(it.ok&&!it.ok())return false;return true}
function spendCd(it){return it.cd&&S.spCd&&S.spCd[it.k]!=null&&S.am-S.spCd[it.k]<it.cd?it.cd-(S.am-S.spCd[it.k]):0}
function doSpend(k){const it=SPEND.find(x=>x.k===k);if(!it||!spendOk(it))return;
  if(it.m){if(!S.svc)S.svc={};S.svc[k]=S.svc[k]?0:1;log(`${it.n}を${S.svc[k]?'契約した':'解約した'}`,'life');save();render();return}
  const c=spCost(it);if(S.money<c||spendCd(it))return;outc('spend',c);if(!S.spent)S.spent={};S.spent[k]=(S.spent[k]||0)+1;if(!S.spCd)S.spCd={};S.spCd[k]=S.am;
  let res='';const _dk='s:'+k,_dn=spDim(it)?gHistN(_dk):0;GMUL=GDIM[Math.min(_dn,GDIM.length-1)];try{res=it.f?it.f()||'':''}catch(e){console.error(e)}finally{GMUL=1}if(spDim(it))S.gHist[_dk].push(S.am);snd('buy');log(`${it.n}（${yen(c)}）${res?' '+res:''}`,'good');if(res)toast(res);save();render()}
let SPCAT='sns';
function spendHtml(){let h=`<p class="hint">所持金：${yen(S.money)}。「毎月」のものは契約すると毎月の請求書に入る。いつでも解約できる。「何度でも」の自分みがき・暮らし・家族・健康・社会のものは、1年のうちに何回も使うほど効果が小さくなる（1年で元に戻る）。</p><div class="seg wrapseg">${Object.entries(SP_CAT).map(([k,n])=>`<button type="button" class="${SPCAT===k?'on':''}" data-spcat="${k}">${n}</button>`).join('')}</div><div>`;
  for(const it of SPEND.filter(x=>x.c===SPCAT)){const ok=spendOk(it),c=spCost(it),cd=spendCd(it),on=it.m&&svcOn(it.k);const age2=age()<(it.a||18);
    const _dn=spDim(it)?gHistN('s:'+it.k):0;h+=`<div class="shop"><div><div>${esc(it.n)} <span class="muted small">${yen(c)}${it.m?'／月':''}</span> <span class="chip">${spKind(it)}</span></div><div class="muted small">${_dn?`<span class="${_dn>=2?'dn':''}">次の効果 ${Math.round(GDIM[Math.min(_dn,4)]*100)}%（この1年で${_dn}回）</span>・`:''}${esc(it.d)}${age2?`（${it.a||18}歳から）`:''}${cd?`（あと${cd}か月）`:''}${it.once&&S.spent&&S.spent[it.k]?'（済み）':''}</div></div>${it.m?`<button class="b sm ${on?'on':''}" type="button" data-spend="${it.k}" ${ok||on?'':'disabled'}>${on?'契約中（解約）':'契約する'}</button>`:`<button class="b sm" type="button" data-spend="${it.k}" ${!ok||cd||S.money<c?'disabled':''}>買う</button>`}</div>`}
  h+='</div>';
  if(SPCAT==='coll'&&(S.coll||[]).length){h+='<h3>持っているコレクション</h3>'+S.coll.map(x=>`<div class="shop"><div><div>${esc(x.n)}</div><div class="muted small">買った値段 ${yen(x.buy)} → いまの価値 <b class="${x.val>=x.buy?'up':'dn'}">${yen(x.val)}</b></div></div><button class="b sm" type="button" data-csell2="${x.id}">売る</button></div>`).join('')}
  if(SPCAT==='inv'){const P=S.port||{};h+='<h3>投資の種類</h3>'+Object.entries(PORT).map(([k,p])=>`<div class="shop"><div><div>${p.n}</div><div class="muted small">残高 ${yen(P[k]||0)}・値動き${p.vol>=.08?'とても大きい':p.vol>=.03?'大きい':'小さい'}</div></div><div class="row"><button class="b sm" type="button" data-pin="${k}" ${S.money<1e6*ci2()?'disabled':''}>${yen(1e6*ci2())} 入れる</button><button class="b sm ghost" type="button" data-pout="${k}" ${(P[k]||0)<=0?'disabled':''}>全部出す</button></div></div>`).join('');
    if(S.estate)h+=`<div class="shop"><div><div>不動産 ${S.estate}口</div><div class="muted small">家賃収入 月${yen(S.estate*3e7*ci2()*.004)}</div></div><button class="b sm ghost" type="button" data-act="estSell">1口売る</button></div>`;
    if((S.vent||[]).length)h+=`<p class="hint">結果待ちの出資：${S.vent.map(v=>`${esc(v.n)} ${yen(v.amt)}（あと${Math.max(0,v.until-S.am)}か月）`).join('、')}</p>`}
  return h}
document.addEventListener('click',e=>{const b=e.target.closest('button');if(!b||!S)return;const d=b.dataset;
  if(d.spcat){SPCAT=d.spcat;renderPanel();return}
  if(d.spend){doSpend(d.spend);return}
  if(d.csell2){const x=(S.coll||[]).find(c=>c.id===d.csell2);if(x){inc('sell',Math.round(x.val));S.coll=S.coll.filter(c=>c!==x);log(`${x.n}を${yen(x.val)}で売った`,'good');snd('coin');save();render()}return}
  if(d.pin){const c=Math.round(1e6*ci2());if(S.money>=c){outc('invest',c);if(!S.port)S.port={};S.port[d.pin]=(S.port[d.pin]||0)+c;save();render()}return}
  if(d.pout){const v=Math.round((S.port||{})[d.pout]||0);if(v>0){inc('invout',v);S.port[d.pout]=0;save();render()}return}
  if(d.act==='estSell'&&S.estate>0){S.estate--;inc('sell',Math.round(3e7*ci2()*.9));save();render();return}
});
function spendMonth(){const c=ci2();
  if(S.svc)for(const k in S.svc)if(S.svc[k]){const it=SPEND.find(x=>x.k===k);if(!it||(it.ok&&!it.ok())){S.svc[k]=0;continue}bill('svc',it.n,spCost(it))}
  if(svcOn('trainer'))ad('health',.6);if(svcOn('gourmet')){ad('health',.3);ad('happy',.3)}
  if(svcOn('tvsp')){ad('rep',.5);if(S.snsOpen)S.f[S.main]*=1.01}if(svcOn('sport_sp')){ad('rep',.5);if(S.snsOpen)S.f[S.main]*=1.005}
  if(svcOn('secretary')){S.autopay=1;S.flags.taxAuto=1}
  if(svcOn('manager2')&&totalF()>=5000){const r=Math.round(totalF()*R(.3,.8)*c);inc('deal',r);S.stats.deals++}
  if(svcOn('think'))S.rp+=2;if(S.lab)S.rp+=S.lab*3;
  if(svcOn('edu'))for(const k of S.kids)if((S.am-k.born)/12<22){k.know=clamp((k.know||10)+1.5,0,100);k.bond=clamp((k.bond||50)+.3,0,100)}
  if(S.furn)ad('happy',.2*S.furn);if(S.cats){ad('happy',.3*S.cats);bill('subs','猫の世話代',1e4*Math.max(.3,c)*S.cats)}
  if(S.flags.car2){ad('happy',.3);ad('rep',.05);bill('subs','高級車の維持費',5e4*c)}
  if(S.flags.villa){ad('happy',.6);ad('mental',.4);bill('subs','別荘の維持費',3e5*c)}
  if(S.flags.scholar)ad('rep',.3);
  if(S.flags.team){const r=Math.round(R(-3e7,5e7)*c);if(r>0)inc('team',r);else outc('team',-r);ad('rep',.5)}
  for(const x of S.coll||[]){const k=COLL[x.k];x.val=Math.max(x.buy*.1,Math.round(x.val*(1+R(-k.vol,k.vol)+k.dr)))}if((S.coll||[]).length)ad('happy',Math.min(.8,.1*S.coll.length));
  if(S.port)for(const k in S.port){const p=PORT[k];if(S.port[k]>0)S.port[k]=Math.max(0,S.port[k]*(1+R(-p.vol,p.vol)+p.dr+(ecoMul()-1)*(k==='gold'?-.02:.05)))}
  if(S.estate)inc('rent2',Math.round(S.estate*3e7*c*.004*ecoMul()));
  if(S.royal&&S.royal.left>0){inc('royal',S.royal.amt);S.royal.left--}
  for(const v of (S.vent||[]).slice()){if(S.am<v.until)continue;const r=Math.random();const mul=v.kind==='movie'?(r<.15?4:r<.45?1.5:r<.75?.6:0):(r<.1?10:r<.35?2:r<.55?.8:0);const got=Math.round(v.amt*mul);if(got)inc('vent',got);log(`${v.n}への出資の結果：${mul?yen(got)+'が戻ってきた（'+mul+'倍）':'残念ながらゼロになった'}`,mul>=1?'good':'bad');if(mul>=4)tl(`${v.n}への出資が大当たり`);S.vent=S.vent.filter(x=>x!==v)}}
Object.assign(INC_LBL,{sell:'売却',goods:'グッズ・ツアー',team:'チームの利益',rent2:'不動産の家賃収入',royal:'印税',vent:'出資の戻り'});Object.assign(OUT_LBL,{spend:'お金の使い道',svc:'サービスの契約',team:'チームの赤字'});
function freeSlots(){const a=age();if(a<6)return 0;let n=({school:a<=12?3:2,univ:3,work:2,creator:4,free:4,retired:4})[S.st]||2;if(S.st==='school'&&S.flags.hs==='online'&&a>=15)n++;if(S.flags.care&&S.am<S.flags.care)n--;if(svcOn('maid'))n++;return Math.max(1,n)}
function postQuality(){
  const g=GENRES[S.genre]||GENRES.talk;let mix=0;for(const s in g.w)mix+=(s==='know'?S.p.know:S.sk[s])*g.w[s];
  const cond=(S.p.health+S.p.mental)/2;
  const bonus=Math.min(20,stN('editor')*4*staffMul())+Math.min(10,countB('studio')*5)+(has('live')?2:0)+(has('analytics')?3:0)+(svcOn('outsource')?5:0)+(svcOn('studio')?3:0);
  return clamp(mix*.62+(S.tal[talKey(S.genre)]||0)*.3+eqBonus()+bonus+(cond-50)*.15,1,100)}
function discMul(){const sr=S.series||{n:0,fat:0};let m=1.05;if(sr.n>=3)m*=1+Math.min(.3,sr.n*.025);if(sr.fat>10)m*=1-Math.min(.45,(sr.fat-10)*.035);if(persTop()==='bold')m*=1.1;
  if(sk('s3'))m*=1.1;m*=1+.02*rlv('sns');if(has('global'))m*=1.1;if(lg('g5'))m*=1.08;if(lg('g12'))m*=1.05;if(svcOn('thumb'))m*=1.1;
  if(S.style==='trend')m*=S.trend.g===S.genre?1.35:.8;return m}

// ----- まちの自動化 -----
const upCost=(t)=>{const b=BLD[t.t];return Math.round(b.cost*(t.lv+1)*.6*(b.pub&&S.role==='mayor'?.7:1))};
function upgradeAll(reserve){let n=0,spent=0;const list=S.town.tiles.filter(t=>BLD[t.t]&&t.lv<3).sort((a,b)=>upCost(a)-upCost(b));
  for(const t of list){const c=upCost(t);if(S.money-c<(reserve||0))break;outc('build',c);t.lv++;n++;spent+=c}S.town.dev=calcDev();return {n,spent}}
function upAllCost(){return S.town.tiles.filter(t=>BLD[t.t]&&t.lv<3).reduce((s,t)=>s+upCost(t),0)}
function buildAt(i,k){const t={t:k,lv:1};S.town.tiles[i]=t;if(SHOP[k])initShop(t);S.town.dev=calcDev()}
function autoDevTown(){const T=S.town;if(!T.auto||!T.auto.on)return;let budget=Math.min(T.auto.b*ci2(),Math.max(0,S.money-1e6*ci2()));if(budget<=0)return;
  const avail=Object.keys(BLD).filter(k=>!BLD[k].req||has(BLD[k].req));
  for(let g=0;g<6&&budget>0;g++){const empty=T.tiles.map((t,i)=>t.t==='empty'?i:-1).filter(i=>i>=0);
    const want=(T.reqs||[]).map(r=>r.k).find(k=>avail.includes(k));
    const cnt=k=>T.tiles.filter(t=>t.t===k).length;const k=want||avail.slice().sort((a,b)=>cnt(a)-cnt(b)||BLD[b].dev-BLD[a].dev)[0];
    const cost=k?Math.round(BLD[k].cost*(BLD[k].pub&&S.role==='mayor'?.7:1)):Infinity;
    if(empty.length&&k&&cost<=budget){outc('build',cost);buildAt(pick(empty),k);budget-=cost;continue}
    const up=T.tiles.filter(t=>BLD[t.t]&&t.lv<3).sort((a,b)=>upCost(a)-upCost(b))[0];if(up&&upCost(up)<=budget){const c=upCost(up);outc('build',c);up.lv++;budget-=c;continue}break}
  T.dev=calcDev()}
const MGR_FEE=1.5e5;
function mgrOptimize(i){const t=S.town.tiles[i];let best=null;for(let p=0;p<PRICE.length;p++)for(let h=0;h<HOURS.length;h++)for(let a=0;a<ADV.length;a++){if(!PRICE[p]||!HOURS[h]||!ADV[a])continue;Object.assign(t,{price:p,hours:h,adv:a});const r0=shopCalc(i,false);t.staff=Math.max(1,r0.need);const r=shopCalc(i,false);if(!best||r.profit>best.pr)best={pr:r.profit,p,h,a,s:t.staff}}if(best)Object.assign(t,{price:best.p,hours:best.h,adv:best.a,staff:best.s})}
function townAutoMonth(){for(const T of allTowns())withTown(T,()=>{autoDevTown();S.town.tiles.forEach((t,i)=>{if(SHOP[t.t]&&t.mgr){bill('staff','店長の給料',MGR_FEE*ci2());try{mgrOptimize(i)}catch(_){}}})})}
function mgrHtml(i){const t=S.town.tiles[i];return `<div class="row"><button class="b sm ${t.mgr?'on':''}" type="button" data-mgr="${i}">${t.mgr?'店長がいる（やめてもらう）':'店長を雇う（月'+yen(MGR_FEE*ci2())+'）'}</button><span class="hint small">${t.mgr?'価格・営業時間・広告・店員の数を、毎月店長がいちばんもうかるように決める。':'雇うと経営方針を自動で決めてくれる。'}</span></div>`}
function townAutoHtml(){if(age()<18)return '';const T=S.town;T.auto=T.auto||{on:0,b:5e6};const c=upAllCost();
  return `<div class="card"><div class="hd"><span>まちの自動化</span></div><div class="row"><button class="b sm" type="button" data-act="upAll" ${c<=0||S.money<Math.min(c,1)?'disabled':''}>まとめて強化（全部で${yen(c)}）</button></div>
  <div class="row"><button class="b sm ${T.auto.on?'on':''}" type="button" data-act="autoDev">おまかせ開発：${T.auto.on?'ON':'OFF'}</button><span class="hint small">毎月の予算</span><div class="seg">${[1e6,5e6,2e7,1e8].map(v=>`<button type="button" class="${T.auto.b===v?'on':''}" data-adb="${v}">${yen(v*ci2())}</button>`).join('')}</div></div>
  <p class="hint small">おまかせ開発をONにすると、住民の声や足りない建物を見て、毎月この予算の中で建てたり強化したりする（手もとに100万円は残す）。お店の経営は、お店ごとに「店長を雇う」で自動にできる。</p></div>`}
document.addEventListener('click',e=>{const b=e.target.closest('button');if(!b||!S)return;const d=b.dataset;
  if(d.act==='upAll'){const r=upgradeAll(0);toast(r.n?`${r.n}件を強化した（${yen(r.spent)}）`:'お金が足りない');save();render();return}
  if(d.act==='autoDev'){S.town.auto.on=S.town.auto.on?0:1;save();renderPanel();return}
  if(d.adb){S.town.auto.b=+d.adb;save();renderPanel();return}
  if(d.mgr!=null){const t=S.town.tiles[+d.mgr];t.mgr=t.mgr?0:1;if(t.mgr)mgrOptimize(+d.mgr);save();renderPanel();return}});
// 新しいまちの「開発のお手本」
const TPL={none:{n:'空き地から',m:1,b:[]},home:{n:'住宅地型',m:1.3,b:['park','cafe','library','stall','kids']},tour:{n:'観光型',m:1.3,b:['tourism','restaurant','stall','cafe','tourism']},shop:{n:'商業型',m:1.3,b:['cafe','restaurant','apparel','gym','stall']}};
function applyTpl(k){const tp=TPL[k];if(!tp)return;for(const b of tp.b){const i=S.town.tiles.findIndex(t=>t.t==='empty');if(i>=0)buildAt(i,b)}}

// ----- 研究ポイント -----
const RP_MILE=[['shop',30,()=>anyShop()],['f1',30,()=>S.stats.maxF>=1e4],['f2',60,()=>S.stats.maxF>=1e5],['job',20,()=>S.salSum>0],['univ',40,()=>S.edu==='大卒'||S.st==='univ'],['co',50,()=>(S.cos||[]).length>0],['m1',40,()=>S.stats.maxM>=1e8]];
function rpMonth(){if(age()>=10)S.rp+=.25+S.p.know*.004;if(!S.rpGot)S.rpGot={};for(const [k,v,f] of RP_MILE){if(S.rpGot[k])continue;let ok=false;try{ok=f()}catch(_){}if(ok){S.rpGot[k]=1;S.rp+=v;log(`研究ポイント+${v}（節目のごほうび）`,'good')}}}

// ----- 毎月 -----
function monthHook11(){try{spendMonth()}catch(e){console.error(e)}try{townAutoMonth()}catch(e){console.error(e)}rpMonth();
  if(S.kc.on&&!kcRunnerAlive()&&!S.q.includes('kc_inherit'))S.q.push('kc_inherit');
  for(const c of S.subch||[]){c.f=Math.min(2e6,(c.f||0)*(S.mo.posts>0?.996:.99))}}

// ----- チュートリアル -----
const TUT_KEY='buzz-tut';let TUT=null;
const TUT_STEPS=[
 {sel:'#mcard',t:'人生のはじまり！ ここで生まれた国・家族・素質がわかる。下のボタンを押して、人生を始めよう。',wait:()=>!modalOpen()},
 {sel:'.top .ti',t:'いまの年月と年齢。となりにお金とフォロワーが出る。'},
 {sel:'#ctrl',t:'時間の進め方。「次へ」で1か月、▶ で自動で進む。▶▶・▶▶▶ はもっと速い（よくある出来事は自動で選ぶ）。「イベントまで」は次の出来事まで早送り。'},
 {sel:'.roomwrap',t:'あなたの部屋。年齢・行動・季節・天気で場面が変わる。'},
 {sel:'.who',t:'健康・メンタル・幸福。下がりすぎると病気になったり、寿命が縮んだりする。'},
 {sel:'#tabs',t:'5つのタブで、ゲームのほとんどのことができる。順番に見てみよう。'},
 {sel:'#panel',tab:'act',t:'「予定」：毎月の行動を決める。6歳までは自動。上の「いまできること」に、やれることが並ぶ。'},
 {sel:'#panel',tab:'sns',t:'「発信」：13歳からSNSを始められる。ジャンル・スタイル・企画を決めて、フォロワーを増やそう。'},
 {sel:'#panel',tab:'money',t:'「お金」：毎月の支払いは最初から自動。買い物・お金の使い道・投資もここ。'},
 {sel:'#panel',tab:'biz',t:'「事業」：大人になったら、まちに建物を建てたり、お店や会社を経営したりできる。'},
 {sel:'#panel',tab:'life',t:'「人生」：能力・目標・恋愛や転職などの人生の選択・スキル・アルバム。'},
 {sel:'#btnMenu',t:'「メニュー」：見た目・音・明るさの設定、遊び方、セーブの書き出しなど。'},
 {sel:'#btnNext',t:'これで準備OK！ まずは「次へ」か ▶ を押して、人生を進めてみよう。',last:1}
];
(function(){const d=document.createElement('div');d.id='tut';d.hidden=true;d.innerHTML='<div class="tut-hole"></div><div class="tut-bub" role="dialog" aria-live="polite"><p class="tut-t"></p><div class="row"><button class="b sm" type="button" data-tut="prev">戻る</button><button class="b sm pri" type="button" data-tut="next">次へ</button><button class="b sm ghost" type="button" data-tut="end">やめる</button></div></div>';document.body.appendChild(d)})();
function tutAsk(){try{localStorage.setItem('buzz-v1-notice','1')}catch(_){}openModal(`<div class="mcat life">ようこそ</div><h2>チュートリアルをしますか？</h2><p class="mtext">はじめての人向けに、画面の見方と遊び方を順番に案内します（1〜2分）。</p><div class="mch"><button class="b pri" type="button" data-act="tutYes">チュートリアルをする</button><button class="b" type="button" data-act="tutNo">今はしない（次も聞く）</button><button class="b ghost" type="button" data-act="tutNever">今後表示しない</button></div>`)}
function tutStart(){closeModal();try{localStorage.setItem(TUT_KEY,'done')}catch(_){}newGame({stage:'nipporia',era:'now'});setSpeed(0);TUT={i:0};tutShow()}
function tutShow(){const st=TUT_STEPS[TUT.i],box=$('#tut');if(!st){tutEnd();return}if(st.tab){closeModal();setTab(st.tab);render()}
  const el=document.querySelector(st.sel);box.hidden=false;const hole=box.querySelector('.tut-hole'),bub=box.querySelector('.tut-bub');box.querySelector('.tut-t').textContent=`（${TUT.i+1}/${TUT_STEPS.length}）${st.t}`;
  box.querySelector('[data-tut="next"]').hidden=!!st.wait;box.querySelector('[data-tut="next"]').textContent=st.last?'はじめる':'次へ';box.querySelector('[data-tut="prev"]').hidden=TUT.i===0||!!st.wait;
  if(el&&!st.wait)el.scrollIntoView({block:st.tab?'start':'center',behavior:'instant'});
  const place=()=>{if(!TUT)return;const r=el?el.getBoundingClientRect():{left:innerWidth/2-50,top:innerHeight/2-20,width:100,height:40};const pad=6;Object.assign(hole.style,{left:(r.left-pad)+'px',top:(r.top-pad)+'px',width:(r.width+pad*2)+'px',height:Math.min(r.height+pad*2,innerHeight)+'px'});
    const below=r.top+r.height/2<innerHeight/2;bub.style.top=below?'':'12px';bub.style.bottom=below?'calc(90px + env(safe-area-inset-bottom,0px))':'';if(st.wait){bub.style.top='12px';bub.style.bottom=''}};
  place();TUT.place=place;if(st.wait){clearInterval(TUT.w);TUT.w=setInterval(()=>{if(!TUT){return}place();if(st.wait()){clearInterval(TUT.w);TUT.i++;tutShow()}},300)}}
function tutEnd(){clearInterval(TUT&&TUT.w);TUT=null;$('#tut').hidden=true;try{localStorage.setItem(TUT_KEY,'done')}catch(_){}if(S&&!$('#scrGame').hidden){setTab('act');render()}}
addEventListener('resize',()=>{if(TUT&&TUT.place)TUT.place()});addEventListener('scroll',()=>{if(TUT&&TUT.place)TUT.place()},{passive:true});
document.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;const d=b.dataset;
  if(d.act==='tutYes'){tutStart();return}if(d.act==='tutNo'){closeModal();return}if(d.act==='tutNever'){try{localStorage.setItem(TUT_KEY,'never')}catch(_){}closeModal();return}
  if(d.act==='tutRestart'){try{localStorage.removeItem(TUT_KEY)}catch(_){}if(S&&!$('#scrGame').hidden){closeModal();setSpeed(0);TUT={i:1};tutShow()}else tutStart();return}
  if(d.tut==='next'){if(TUT_STEPS[TUT.i]&&TUT_STEPS[TUT.i].last){tutEnd();return}TUT.i++;tutShow();return}
  if(d.tut==='prev'){TUT.i=Math.max(1,TUT.i-1);tutShow();return}if(d.tut==='end'){tutEnd();return}
  if(d.act==='playRec'){showPlay();return}});
setTimeout(()=>{let v=null;try{v=localStorage.getItem(TUT_KEY)}catch(_){}if(!v&&!S&&$('#scrGame').hidden)tutAsk()},700);
GUIDE.forEach(g=>{if(g[0]==='basic'&&!/チュートリアル/.test(g[2]))g[2]+='\n・「チュートリアル」で画面の見方を順番に案内する（この下のボタン）。'});
