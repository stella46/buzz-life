
// ===== v2.1：世界進出・世界的バズ・ランキング・ライバル企業・規模の実感 =====
// 地域：[キー,名前,登録者の上限の倍率,必要な登録者（今の上限に対する割合）,費用,説明]
const WREG=[
 ['asia','アジア',3,.35,3e7,'字幕と翻訳チームをつけて、アジアの国々へ配信する'],
 ['na','北米',2.5,.35,1.5e8,'英語の吹き替えと現地のスタッフで、北米に進出する'],
 ['eu','ヨーロッパ',2,.35,3e8,'多言語の字幕と現地イベントで、ヨーロッパに広げる'],
 ['latam','中南米',1.6,.3,4e8,'スペイン語・ポルトガル語のチャンネルを立ち上げる'],
 ['mea','中東・アフリカ',1.6,.3,6e8,'現地のクリエイターと組んで、新しい地域に届ける'],
 ['oce','オセアニア',1.15,.3,2e8,'時差に合わせた配信で、オセアニアのファンをつかむ'],
 ['global','全世界同時配信',3,.35,3e9,'AI同時通訳で、世界中に同じ瞬間に届ける']];
const WORLD_POP=8e9,JP_POP=1.24e8;
function W(){if(!S.world)S.world={r:[],buzz:0,hit:0,ms:{},hl:[],best:{}};return S.world}
function worldMul(){if(typeof S==='undefined'||!S||!S.world)return 1;let m=1;for(const k of S.world.r){const r=WREG.find(x=>x[0]===k);if(r)m*=r[2]}return m}
// 登録者の上限を、世界進出に合わせて広げる
for(const k of Object.keys(SNS)){const o=SNS[k];if(o._cap0)continue;o._cap0=o.cap;Object.defineProperty(o,'cap',{get(){return this._cap0*worldMul()},set(v){this._cap0=v},configurable:true,enumerable:true})}
function wNext(){const w=W();return WREG.find(r=>!w.r.includes(r[0]))}
function wNeed(r){const key=S.main;return Math.round(SNS[key].cap*r[3])}
function wCost(r){return Math.round(r[4]*Math.max(.2,S.cty.inc))}
function wRegName(){const w=W();if(!w.r.length)return '国内';if(w.r.includes('global'))return '全世界';return '国内＋'+w.r.map(k=>WREG.find(x=>x[0]===k)[1]).join('・')}

// ----- 規模をくらべるもの（いつでも正しい計算だけ） -----
function cmpPeople(n){if(n<1000)return '';if(n<5.5e4)return `${(n/3e4>=1?'小さな町の人口と同じくらい':'学校'+Math.max(1,Math.round(n/500))+'校分の人数')}`;
 if(n<JP_POP*.5)return `東京ドーム（約5.5万人）${num(Math.round(n/5.5e4))}杯分`;if(n<WORLD_POP*.02)return `日本の人口の約${Math.round(n/JP_POP*100)}%`;return `世界の人口の約${(n/WORLD_POP*100).toFixed(n/WORLD_POP>=.1?0:1)}%`}
function cmpMoney(n){if(n<1e8)return '';const p=n/JP_POP;if(p<1e5)return `日本の人みんなに、1人${num(Math.round(p))}円ずつ配れる金額`;return `世界の人みんなに、1人${num(Math.round(n/WORLD_POP))}円ずつ配れる金額`}
function cmpEmp(n){if(n<300)return '';if(n<1e4)return `社員だけで村がひとつできる人数`;if(n<1e5)return `社員だけで町がひとつできる人数`;if(n<1e6)return `社員だけで市がひとつできる人数`;return `社員だけで大都市ができる人数`}

// ----- 世界進出のカード（発信タブ） -----
function worldCard(){if(!S.snsOpen||age()<15)return '';const w=W(),key=S.main,f=S.f[key],cap=SNS[key].cap,nx=wNext();
 if(!w.r.length&&f<SNS[key]._cap0*.2)return '';
 let h=`<div class="card wcard"><div class="hd"><span>🌍 世界の舞台</span><span class="chip">${esc(wRegName())}</span></div>`;
 h+=`<div class="wreg">${WREG.map(r=>`<span class="wr ${w.r.includes(r[0])?'on':''}">${esc(r[1])}</span>`).join('')}</div>`;
 h+=`<p class="hint">${esc(SNS[key].n)}で届けられる人数の目安：${num(cap)}人（いま ${num(f)}人・${Math.round(f/cap*100)}%）。${w.r.length?'進出した地域では、投稿を続けると新しいファンが毎月ふえていきます。':''}</p>`;
 if(nx){const need=wNeed(nx),cst=wCost(nx),ok=f>=need&&S.money>=cst;
  h+=`<div class="shop"><div><div>次の進出先：<b>${esc(nx[1])}</b> <span class="chip">届く人数 ×${nx[2]}</span></div><div class="muted small">${esc(nx[5])}／条件：${esc(SNS[key].n)}の登録者 ${num(need)}人・費用 ${yen(cst)}</div></div><button class="b sm ${ok?'pri':''}" type="button" data-w43="go" ${ok?'':'disabled'}>進出する</button></div>`}
 else h+=`<p class="hint">すべての地域に進出しました。あとは世界一を目指すだけです。</p>`;
 const rk=rankOf('f');h+=`<p class="small">世界の配信者ランキング：<b>${rk>999?'圏外':rk+'位'}</b>　${esc(cmpPeople(totalF()))}</p></div>`;return h}
const _pSns43=panelSns;panelSns=function(){const h=_pSns43.apply(this,arguments);try{const c=worldCard();if(!c)return h;const i=h.indexOf('<h2>アカウント</h2>');return i<0?c+h:h.slice(0,i)+c+h.slice(i)}catch(e){console.error(e);return h}};
function worldGo(){const nx=wNext();if(!nx)return;const need=wNeed(nx),cst=wCost(nx);if(S.f[S.main]<need||S.money<cst)return;outc('shop',cst);W().r.push(nx[0]);
 log(`${nx[1]}に進出した。届けられる人数が${nx[2]}倍になった`,'good');tl(`${nx[1]}に進出した`);hlAdd(`🌍 ${nx[1]}に進出`);popBig('🌍 世界進出',`${nx[1]}に進出しました`,`これからは${esc(wRegName())}のファンに届きます`);render()}

// ----- 毎月：進出した地域で、新しいファンがふえる -----
function worldMonth(){const w=W();if(!w.r.length||!S.snsOpen||!(S.mo&&S.mo.posts>0))return;const key=S.main;if(!S.open[key])return;
 const f=S.f[key],cap=SNS[key].cap,room=cap-f;if(room<=0)return;const q=clamp(postQuality(),1,100);
 const rate=.007*clamp(Math.pow(q/60,2),.25,2.5)*(S.trend&&S.trend.g===S.genre?1.3:1)*Math.min(1,S.mo.posts/4);
 const g=Math.round(room*rate*R(.7,1.3));if(g<=0)return;S.f[key]+=g;S.mo.newF=(S.mo.newF||0)+g;S.mo.wf=(S.mo.wf||0)+g}

// ----- 世界的バズ -----
const _ph43=postHook;postHook=function(k,q,buzzed,nf){const r=_ph43.apply(this,arguments);try{if(buzzed)megaBuzz(q)}catch(e){console.error(e)}return r};
function megaBuzz(q){const w=W(),key=S.main,f=S.f[key],cap=SNS[key].cap;if(f<5000)return;const glob=w.r.length>0;
 if(!chance((glob?.1:.04)+q/1500))return;const room=Math.max(0,cap-f);const g=Math.round(room*R(glob?.03:.015,glob?.12:.05));if(g<1000)return;
 S.f[key]+=g;S.mo.newF=(S.mo.newF||0)+g;w.buzz++;const v=Math.round(g*R(40,120));S.mo.views+=v;S.stats.views+=v;
 const nm=glob?'世界的バズ':'日本中でバズ';log(`${nm}！ 1本の投稿が${num(v)}回再生され、登録者が${num(g)}人ふえた`,'good');tl(`${nm}を起こした`);hlAdd(`🔥 ${nm}（+${num(g)}人）`);
 popBig(glob?'🌍 世界的バズ！':'🔥 日本中でバズ！',`1本の投稿が ${num(v)}回 再生されました`,`登録者 +${num(g)}人`)}

// ----- 世界的大ヒット（会社の作品） -----
const _pr43=prodRelease;prodRelease=function(c){const r=_pr43.apply(this,arguments);try{const h=c.pr&&c.pr.hist&&c.pr.hist[0],s=c.pr&&c.pr.sales&&c.pr.sales[c.pr.sales.length-1];
 if(h&&s&&h.q>=85){const abroad=(c.offices||[]).filter(o=>!o.hq).length+W().r.length;if(chance(.12+abroad*.04+(h.q-85)*.02)){const m=R(3,8)+Math.min(10,abroad);s.amt*=m;s.left=Math.max(s.left,20);s.dec=Math.max(s.dec,.9);h.mega=1;W().hit++;
  const P=PROD[c.k];log(`「${c.name}」の${P.lbl}「${h.it}」が世界的な大ヒットに！ 売上が${m.toFixed(1)}倍の勢いで伸びている`,'good');tl(`${P.lbl}「${h.it}」が世界的大ヒット`);hlAdd(`🏆 「${h.it}」が世界的大ヒット`);
  popBig('🏆 世界的大ヒット！',`「${esc(h.it)}」が世界中で売れています`,`予想売上 約${yen(Math.round(s.amt/(1-s.dec)))}`);c.val=Math.round(c.val*1.15);ad('rep',3)}}}catch(e){console.error(e)}return r};

// ----- 大きな節目のお祝い（止まらずに表示） -----
const MS43=[['f',[1e4,1e5,1e6,1e7,5e7,1e8,3e8,1e9],n=>`登録者 ${num(n)}人`,cmpPeople],['m',[1e8,1e9,1e10,1e11,1e12,1e13,1e14],n=>`資産 ${yen(n)}`,cmpMoney],['e',[1e3,1e4,1e5,1e6],n=>`社員 ${num(n)}人`,cmpEmp]];
function empAll(){return (S.cos||[]).reduce((a,c)=>a+((c.emp&&c.emp.n)||0)+((c.emp&&c.emp.key&&c.emp.key.length)||0),0)}
function netW(){return (S.money||0)+(S.inv||0)-(S.debt||0)+(S.cos||[]).reduce((a,c)=>a+(c.val||0),0)}
function msCheck(){const w=W(),v={f:totalF(),m:netW(),e:empAll()};if(!w.msInit){w.msInit=1;for(const [k,L] of MS43){let top=0;for(const t of L)if(v[k]>=t)top=t;w.ms[k]=top}return}for(const [k,L,lab,cmp] of MS43){const got=w.ms[k]||0;let top=0;for(const t of L)if(v[k]>=t&&t>got)top=t;if(top){w.ms[k]=top;hlAdd('🎉 '+lab(top));popBig('🎉 '+lab(top),cmp(top)||'',k==='m'?'（会社の価値をふくむ資産）':'')}}}
function hlAdd(t){const w=W();w.hl.unshift([S.y,S.m,t]);if(w.hl.length>30)w.hl.length=30}
let POPQ=[];function popBig(t,a,b){if(typeof skipping!=='undefined'&&skipping&&POPQ.length>2)return;POPQ.push([t,a,b,Date.now()]);if(POPQ.length>3)POPQ.splice(1,POPQ.length-3);if(POPQ.length===1)popNext()}
function popNext(){while(POPQ.length>1&&Date.now()-POPQ[0][3]>8000)POPQ.shift();const x=POPQ[0];if(!x)return;let el=$('#popBig');if(!el){el=document.createElement('div');el.id='popBig';el.setAttribute('role','status');el.setAttribute('aria-live','polite');document.body.appendChild(el);el.addEventListener('click',()=>{el.classList.remove('on');clearTimeout(popNext.t);setTimeout(()=>{POPQ.shift();popNext()},200)})}
 el.innerHTML=`<b>${x[0]}</b><span>${x[1]}</span>${x[2]?`<small>${x[2]}</small>`:''}`;el.classList.add('on');clearTimeout(popNext.t);popNext.t=setTimeout(()=>{el.classList.remove('on');setTimeout(()=>{POPQ.shift();popNext()},300)},3200)}

// ----- ランキング（架空の人物・企業と比べる） -----
const NM_A=['ミラ','ノア','レオ','ソラ','カイ','ルナ','ジン','エマ','リク','サラ','ユナ','ケン','アリア','テオ','ハル','ニコ','マヤ','ロイ','イオ','ベル'];
const NM_B=['チャンネル','TV','ゲームズ','ちゃんねる','ラボ','ワールド','ライブ','スタジオ','ちゃん','クラブ'];
const CO_A=['グローバル','ネクスト','ユニバース','スカイ','ノヴァ','アトラス','オリオン','ブルー','サン','ミライ','ヘリオス','アーク','ゼニス','テラ','ルミナ'];
const CO_B=['テック','ホールディングス','インダストリーズ','グループ','システムズ','エンタープライズ','ダイナミクス','ワークス'];
function rngS(s){let x=s>>>0||1;return ()=>{x^=x<<13;x>>>=0;x^=x>>>17;x^=x<<5;x>>>=0;return x/4294967296}}
const RK43={};function rankList(kind){const ck=kind+':'+(S.seed||0)+':'+S.y;if(RK43[kind]&&RK43[kind].ck===ck)return RK43[kind].l;const r=rngS((S.seed||12345)+S.y*7+kind.length*991);
 const top={f:4.5e8,m:3e13,c:4e14}[kind],dec={f:.955,m:.97,c:.965}[kind],N=300,l=[];
 for(let i=0;i<N;i++){const v=top*Math.pow(dec,i)*(1+(r()-.5)*.08)*(1+Math.max(0,S.y-2026)*.01);const nm=kind==='c'?CO_A[Math.floor(r()*CO_A.length)]+CO_B[Math.floor(r()*CO_B.length)]:kind==='f'?NM_A[Math.floor(r()*NM_A.length)]+NM_B[Math.floor(r()*NM_B.length)]:NM_A[Math.floor(r()*NM_A.length)]+'・'+['ゴールド','スター','ウィン','ブライト','ストーン'][Math.floor(r()*5)]+'氏';l.push([nm,v])}
 l.sort((a,b)=>b[1]-a[1]);RK43[kind]={ck,l};return l}
function myVal(kind){if(kind==='f')return totalF();if(kind==='m')return netW();return Math.max(0,...(S.cos||[]).map(c=>c.val||0))}
function rankOf(kind){const v=myVal(kind);if(v<=0)return 9999;const l=rankList(kind).slice();if(kind==='c')for(const r of rcos())l.push([r.n,r.val]);let n=1;for(const [,x] of l)if(x>v)n++;return n}
function rankHtml(kind,title,fmt){const v=myVal(kind);const l=rankList(kind).map(x=>[x[0],x[1],0]);if(kind==='c')for(const r of rcos())l.push([r.n+'（ライバル）',r.val,0]);
 const me=kind==='c'?((S.cos||[]).slice().sort((a,b)=>b.val-a.val)[0]||{}).name||'あなたの会社':'あなた';l.push([me,v,1]);l.sort((a,b)=>b[1]-a[1]);const i=l.findIndex(x=>x[2]);
 const show=new Set([0,1,2,3,4]);for(let j=i-2;j<=i+2;j++)if(j>=0&&j<l.length)show.add(j);let h=`<h3>${title}</h3><ol class="rank">`,prev=-1;
 for(const j of [...show].sort((a,b)=>a-b)){if(prev>=0&&j>prev+1)h+=`<li class="gap">…</li>`;const x=l[j];h+=`<li class="${x[2]?'me':''}"><span class="rn">${j+1}位</span><span class="rnm">${esc(x[0])}</span><span class="rv">${fmt(x[1])}</span></li>`;prev=j}
 return h+'</ol>'+(i>=300?`<p class="hint">圏外：上位300人まで表示しています</p>`:'')}

// ----- ライバル企業 -----
function rcos(){if(!S.rcos)S.rcos=[];return S.rcos}
function rcSpawn(){if(!(S.cos||[]).length||rcos().length>=3)return;const c=pick(S.cos),r=rngS((S.seed||7)+rcos().length*31+S.am);
 const n=CO_A[Math.floor(r()*CO_A.length)]+CO_B[Math.floor(r()*CO_B.length)];if(rcos().some(x=>x.n===n)||(S.cos||[]).some(x=>x.name===n))return;
 const v=Math.max(c.val*R(.8,1.6),1e8);rcos().push({id:'r'+S.am+RI(10,99),n,k:c.k,val:Math.round(v),mul:R(.8,1.4),born:S.am,beat:0});log(`同じ分野に、ライバル企業「${n}」が現れた`,'life')}
function rcMonth(){if(!(S.cos||[]).length)return;if(rcos().length<3&&chance(rcos().length?.01:.08))rcSpawn();
 const best=Math.max(1e8,...S.cos.map(c=>c.val||0));for(const r of rcos()){if(S.m===1&&chance(.3))r.mul=R(.7,1.5);const tgt=best*r.mul;r.val=Math.round(Math.max(5e7,r.val+(tgt-r.val)*R(.02,.06)+r.val*R(-.02,.025)));
  if(!r.beat&&best>r.val*1.05&&S.am-r.born>6){r.beat=1;log(`あなたの会社が、ライバル企業「${r.n}」の価値を追いぬいた`,'good');hlAdd(`🏁 「${r.n}」を追いぬいた`);S.flags.rcBeat=(S.flags.rcBeat||0)+1}else if(r.beat&&r.val>best*1.05)r.beat=0}
 if(rcos().length&&!S.q.some(q=>/^rc_/.test(q))&&chance(.025)){const l=['rc_launch','rc_poach','rc_price','rc_trouble','rc_collab'];const big=rcos().find(r=>best>r.val*2.5);if(big&&chance(.35))l.push('rc_buy');const id=pick(l);if(!(S.cd[id]!=null&&S.am-S.cd[id]<18)){S.rcCur=(id==='rc_buy'?big:pick(rcos())).id;S.q.push(id)}}}
function rcCur(){return rcos().find(r=>r.id===S.rcCur)||rcos()[0]}
function rcN(){const r=rcCur();return r?r.n:'ライバル企業'}
function myCoTop(){return (S.cos||[]).slice().sort((a,b)=>b.val-a.val)[0]}
const rcOk=()=>rcos().length>0&&(S.cos||[]).length>0;
E('rc_launch',{t:'ライバル企業の新作',cat:'会社',w:0,when:rcOk,text:()=>`ライバル企業「${rcN()}」が、あなたの会社と同じ分野で大きな新作を発表した。業界の注目が集まっている。`,
 ch:()=>[['宣伝で勝負する',()=>{const c=myCoTop();const cst=Math.round((c?c.val:1e8)*.01);if(S.money>=cst){outc('co',cst);ad('rep',2);const r=rcCur();if(r)r.val=Math.round(r.val*.95);return `大きな広告を打った（${yen(cst)}）。話題をうばい返した。`}return 'お金が足りず、宣伝は小さくなった。'}],
  ['次の作品の質で返す',()=>{S.flags.rcQ=1;ad('plan',2);return '社員と作戦会議をした。次の作品に力が入る。'}],
  ['気にしない',()=>{ad('mental',1);return '自分たちのペースを守ることにした。'}]]});
E('rc_poach',{t:'引きぬきの危機',cat:'会社',w:0,when:rcOk,text:()=>`「${rcN()}」が、あなたの会社の社員に好条件で声をかけているらしい。`,
 ch:()=>[['給料を上げて引きとめる',()=>{const c=myCoTop();if(!c)return '';coInit(c);const cst=Math.round(Math.max(1e6,c.emp.n*3e4)*Math.max(.2,S.cty.inc));outc('co',cst);c.emp.mor=Math.min(100,(c.emp.mor||60)+8);return `特別手当を出した（${yen(cst)}）。社員のやる気が上がった。`}],
  ['働きやすさで勝負する',()=>{const c=myCoTop();if(c){coInit(c);c.emp.mor=Math.min(100,(c.emp.mor||60)+4)}ad('social',2);return '休みや働き方を見直した。辞める人はほとんどいなかった。'}],
  ['去る人は追わない',()=>{const c=myCoTop();if(c){coInit(c);const n=Math.round(c.emp.n*.05);c.emp.n-=n;return `社員が${num(n)}人辞めてしまった。`}return ''}]]});
E('rc_price',{t:'値下げ競争',cat:'会社',w:0,when:rcOk,text:()=>`「${rcN()}」が大幅な値下げを始めた。お客さんがそちらに流れはじめている。`,
 ch:()=>[['こちらも値下げ',()=>{const c=myCoTop();const l=Math.round(Math.max(0,c?c.last:0)*.5);if(l)outc('co',l);return `売上は守れたが、利益が${yen(l)}へった。`}],
  ['品質で差をつける',()=>{ad('plan',3);ad('rep',1);return '「高くてもこっちがいい」という声がふえた。'}],
  ['新しい分野を開く',()=>{ad('know',2);ad('plan',2);return '競争の少ない分野に目を向けた。'}]]});
E('rc_trouble',{t:'ライバル企業の不祥事',cat:'会社',w:0,when:rcOk,text:()=>`「${rcN()}」で大きな不祥事が明らかになった。社員も取引先も不安そうだ。`,
 ch:()=>[['困っている社員を受け入れる',()=>{const c=myCoTop(),r=rcCur();if(c&&r){coInit(c);const n=Math.max(1,Math.round(Math.min(coCap(c)-c.emp.n,c.emp.n*.08+10)));if(n>0)c.emp.n+=n;r.val=Math.round(r.val*.8);return `${num(Math.max(0,n))}人の優秀な人がやってきた。`}return ''}],
  ['静かに見守る',()=>{ad('rep',1);const r=rcCur();if(r)r.val=Math.round(r.val*.85);return '相手の不幸を喜ばない姿勢が、ひそかに評価された。'}],
  ['この機会にシェアを取る',()=>{const c=myCoTop();const g=Math.round(Math.max(1e6,c?c.val*.01:0));inc('co',g);ad('rep',-1);const r=rcCur();if(r)r.val=Math.round(r.val*.8);return `売上が${yen(g)}ふえたが、少し冷たいと言われた。`}]]});
E('rc_collab',{t:'ライバルからの提案',cat:'会社',w:0,when:rcOk,text:()=>`「${rcN()}」の社長から、共同で新しい事業をやらないかと提案された。`,
 ch:()=>[['手を組む',()=>{const c=myCoTop();const g=Math.round(Math.max(5e6,c?c.val*.015:0));inc('co',g);ad('social',2);return `共同事業が成功し、${yen(g)}の利益が出た。`}],
  ['ていねいに断る',()=>{ad('mental',1);return '競い合う関係のままでいることにした。'}]]});
E('rc_buy',{t:'ライバル企業の買収',cat:'会社',w:0,when:rcOk,text:()=>{const r=rcCur();return `大きく差がついた「${rcN()}」から、会社を買ってほしいと打診があった（価値 ${yen(r?r.val:0)}）。`},
 ch:()=>{const r=rcCur(),p=r?Math.round(r.val*1.1):0;const l=[['見送る',()=>'今回は見送った。']];if(r&&S.money>=p&&(S.cos||[]).length<CO_MAX)l.unshift([`買収する（${yen(p)}）`,()=>{outc('co',p);const k=r.k,lv=Math.min(8,Math.max(1,Math.round(Math.log10(Math.max(1e8,r.val)/1e7)*2)));const co={id:'c'+Date.now().toString(36)+RI(10,99),k,name:r.n.slice(0,12),lv,cap:Math.round(COS[k].c*lv),val:r.val,born:S.am,pub:0,last:0};coInit(co);co.emp.n=Math.min(coCap(co),Math.round(coCap(co)*.6));S.cos.push(co);S.rcos=rcos().filter(x=>x!==r);S.flags.rcBuy=(S.flags.rcBuy||0)+1;tl(`ライバル企業「${r.n}」を買収した`);hlAdd(`🤝 「${r.n}」を買収`);return `「${r.n}」があなたのグループに加わった。`}]);else if(r)l.unshift(['（お金か会社の枠が足りない）',()=>'条件が合わず、見送った。']);return l}});
const _ch43=monthHook11;monthHook11=function(){_ch43();try{worldMonth();rcMonth();msCheck()}catch(e){console.error(e)}};
// ライバル配信者も、世界の規模まで伸びるように
const _rt43=rivalTick;rivalTick=function(){const r=S.rival;const before=r?r.f:0;_rt43.apply(this,arguments);if(r&&worldMul()>1&&r.f>=4e7*.98){const T=totalF()*(r.mul||1);r.f=Math.round(clamp(before+(T-before)*R(.03,.08),50,SNS.milu.cap))}};
// 次の作品に力を入れる（ライバルへの対抗）
const _pe43=prodExtra;prodExtra=function(c,a){let v=_pe43(c,a);if(S.flags.rcQ){v+=6;S.flags.rcQ=0}return v};

// ----- 「世界とランキング」の画面（人生タブ） -----
function worldHtml(){const w=W();let h=`<h2>あなたの世界</h2><div class="wstat">`;
 const tf=totalF(),nw=netW(),em=empAll();
 const box=(i,l,v,c)=>`<div class="ws"><div class="wi">${i}</div><div class="wl">${l}</div><div class="wv">${v}</div>${c?`<div class="wc">${esc(c)}</div>`:''}</div>`;
 h+=box('👥','ファン（登録者の合計）',num(tf)+'人',cmpPeople(tf));h+=box('💰','資産（会社の価値をふくむ）',yen(nw),cmpMoney(nw));
 if(em)h+=box('🏢','社員',num(em)+'人',cmpEmp(em));h+=box('🌍','活動の舞台',esc(wRegName()),`世界的バズ ${w.buzz}回・世界的ヒット ${w.hit}本`);h+='</div>';
 const mo=S.mo||{};h+=`<h3>今月のようす</h3><ul class="hl"><li>投稿 ${num(mo.posts||0)}本・再生 ${num(mo.views||0)}回・新しいファン ${num(mo.newF||0)}人${mo.wf?`（うち海外 ${num(mo.wf)}人）`:''}</li></ul>`;
 if(w.hl.length)h+=`<h3>最近のハイライト</h3><ul class="hl">${w.hl.slice(0,8).map(([y,m,t])=>`<li><span class="muted small">${y}/${m}</span> ${esc(t)}</li>`).join('')}</ul>`;
 if(tf>=1e3)h+=rankHtml('f','世界の配信者ランキング',v=>num(v)+'人');
 if(nw>=1e8)h+=rankHtml('m','世界の長者番付',v=>yen(v));
 if((S.cos||[]).length)h+=rankHtml('c','世界の企業ランキング（会社の価値）',v=>yen(v));
 if(rcos().length)h+=`<h3>ライバル企業</h3>${rcos().map(r=>`<div class="shop"><div><div>${esc(r.n)} <span class="chip">${esc(COS[r.k]?COS[r.k].n:'')}</span></div><div class="muted small">価値 ${yen(r.val)}${r.beat?'・あなたが上':''}</div></div></div>`).join('')}`;
 return h}
document.addEventListener('click',e=>{const b=e.target.closest('[data-w43]');if(!b||!S)return;if(b.dataset.w43==='go')worldGo()});

// ----- 実績 -----
(function(){const A=(id,n,d,f,cat)=>{ACH.push([id,n,d,f]);if(typeof ACH_CAT!=='undefined')ACH_CAT[id]=cat};const S_=(id,hn,hd,f,cat)=>{ACH.push([id,'？','（ひみつ）',f,1,hn,hd,cat]);if(typeof ACH_CAT!=='undefined')ACH_CAT[id]=cat};
 A('w_asia','海をこえて','はじめて海外に進出する',()=>S.world&&S.world.r.length>=1,'SNS');A('w_3','三つの大陸','3つの地域に進出する',()=>S.world&&S.world.r.length>=3,'SNS');
 A('w_all','世界のどこでも','すべての地域に進出する',()=>S.world&&S.world.r.length>=WREG.length,'SNS');A('w_buzz','世界が見た','世界的バズを起こす',()=>S.world&&S.world.buzz>=1,'SNS');
 A('w_f1e7','一千万の声','フォロワー1000万人',()=>S.stats.maxF>=1e7,'SNS');A('w_f1e8','一億の声','フォロワー1億人',()=>S.stats.maxF>=1e8,'SNS');
 A('w_hit','世界的ヒットメーカー','会社の作品が世界的な大ヒットになる',()=>S.world&&S.world.hit>=1,'事業');A('w_rcbeat','追いぬけ！','ライバル企業を追いぬく',()=>(S.flags.rcBeat||0)>=1,'事業');
 A('w_rcbuy','のみこむ者','ライバル企業を買収する',()=>(S.flags.rcBuy||0)>=1,'事業');A('w_m1t','一兆円の重み','資産1兆円（会社の価値をふくむ）',()=>S.world&&(S.world.ms.m||0)>=1e12,'お金');
 S_('x_w_top1','世界一の配信者','世界の配信者ランキングで1位になる',()=>S.world&&S.world.r.length>0&&rankOf('f')===1,'SNS');S_('x_w_rich1','世界一のお金持ち','世界の長者番付で1位になる',()=>netW()>=1e13&&rankOf('m')===1,'お金');
 S_('x_w_co1','世界一の企業','世界の企業ランキングで1位になる',()=>(S.cos||[]).length&&rankOf('c')===1,'事業');S_('x_w_buzz10','バズの神様','世界的バズを10回起こす',()=>S.world&&S.world.buzz>=10,'SNS');S_('x_w_f1e9','十億の声','フォロワー10億人',()=>S.stats.maxF>=1e9,'SNS')})();
EVL=null;
