
// ===== v2.9.1：v3.0の前に入れる9つ（タイトル・データの移動・オンライン/オフライン・推定時間・道のり・家族チャンネル・立て替え・高校のバイト・SNSの始め方） =====

// ----- 1. タイトルのボタン配置 -----
(function(){const tb=$('#btnNew');if(!tb)return;const box=tb.parentElement;
 tb.innerHTML='はじめから<small>ランダムな国・家庭・時代に生まれる</small>';tb.classList.add('tbig');const tc=$('#btnCont');if(tc)tc.classList.add('tbig');
 const grid=box.querySelector('.tgrid');if(grid){const fb=grid.querySelector('[data-act="grpEtc"]');if(fb)fb.remove();grid.classList.add('tgrid3')}
 const news=box.querySelector('.tnews');const row=document.createElement('div');row.className='tsmall';if(news){news.classList.add('sm');row.appendChild(news)}
 const f=document.createElement('button');f.className='b sm';f.type='button';f.dataset.act='grpEtc';f.textContent='📝 感想・不具合を送る';row.appendChild(f);(grid||tb).after(row)})();
{const _it58=initTitle;initTitle=function(){const r=_it58.apply(this,arguments);try{const tc=$('#btnCont'),tn=$('#btnNew');if(!tc||!tn)return r;const has=!tc.disabled;
 tc.hidden=!has;tc.classList.toggle('pri',has);tn.classList.toggle('pri',!has);if(has&&tc.nextElementSibling!==tn)tc.after(tn);if(!has&&tn.nextElementSibling!==tc)tn.after(tc)}catch(_){}return r}}
try{initTitle()}catch(_){}

// ----- 2. データの移動：渡すものを上に、説明の表はたたむ -----
{const _sT58=showTransfer;showTransfer=function(){const r=_sT58.apply(this,arguments);try{const m=$('#mcard'),h2=m.querySelector('h2'),sel=$('#trSel'),info=m.querySelector('.trinfo');
 if(sel&&h2){const lg=sel.querySelector('legend');if(lg)lg.textContent='この端末から渡すもの（チェックしたものだけ渡します）';h2.after(sel)}
 if(info){const d=document.createElement('details');d.className='trfold';d.innerHTML='<summary>できること・いっしょに移るもの</summary>';info.replaceWith(d);d.appendChild(info)}}catch(e){console.error(e)}return r}}

// ----- 3. スマホ：開いたときにオンライン／オフラインを選ぶ -----
const IS_APP=(()=>{try{return (matchMedia('(display-mode: standalone)').matches||navigator.standalone===true)&&/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)}catch(_){return false}})();
let NET_MODE='online';
async function setNetMode(m){NET_MODE=m;try{const c=await caches.open('buzz-mode');await c.put('./__mode',new Response(m));
 if(m==='offline'){const pin=await caches.open('buzz-pinned');const had=await pin.match('./index.html');if(!had){const cur=await caches.match('./index.html',{ignoreSearch:true});if(cur)await pin.put('./index.html',cur.clone())}}
 else{await caches.delete('buzz-pinned');const reg=await navigator.serviceWorker.getRegistration();if(reg)reg.update().catch(()=>{});
  const t=await fetch('./index.html',{cache:'no-store'}).then(r=>r.ok?r.text():'').catch(()=>'');const v=(t.match(/const CHANGELOG=\[\s*\['(v[^']+)'/)||[])[1];
  if(v&&v!==CUR_VER){openModal(`<div class="mcat life">オンライン</div><h2>新しい版 ${esc(v)} があります</h2><p class="mtext">いまの版は ${esc(CUR_VER)} です。更新すると、最新の内容で遊べます（セーブはそのまま残ります）。</p><div class="mch"><button class="b pri" type="button" data-netreload="1">更新する</button><button class="b" type="button" data-act="close">あとで</button></div>`)}}}catch(e){console.error(e)}}
function askNetMode(){openModal(`<div class="mcat life">遊び方の選択</div><h2>どちらで遊びますか？</h2>
 <div class="mgrid netpick"><button class="b mtile" type="button" data-net="online"><span class="mi">🌐</span><span class="mt">オンライン</span><span class="md">インターネットにつなぎます。<b>ゲームの更新あり</b>：新しい版が出ると自動で最新になります。感想・不具合もすぐ送れます。</span></button>
 <button class="b mtile" type="button" data-net="offline"><span class="mi">✈️</span><span class="mt">オフライン</span><span class="md">インターネットを使いません。<b>ゲームの更新なし</b>：いま入っている版のまま遊びます。電波のない場所でも遊べます。感想は、次にオンラインで開いたときに送ります。</span></button></div>
 <p class="hint">スマホのアプリとして開いたときに、毎回たずねます。セーブはどちらでも同じです。</p>`)}
document.addEventListener('click',e=>{const b=e.target.closest('[data-net],[data-netreload]');if(!b)return;if(b.dataset.netreload){location.reload();return}const m=b.dataset.net;closeModal();setNetMode(m);toast(m==='offline'?'オフラインで遊びます（ゲームの更新なし）':'オンラインで遊びます（ゲームの更新あり）')});
if(IS_APP)setTimeout(()=>{try{if(!modalOpen())askNetMode();else setTimeout(askNetMode,1500)}catch(_){}},600);
{const _ff58=fbFlush;fbFlush=function(){if(NET_MODE==='offline')return Promise.resolve();return _ff58.apply(this,arguments)}}

// ----- 4. 推定プレイ時間：のこり年数（寿命）を出さない -----
etaText=function(){if(!S||!S.alive||uiHidden('eta'))return '';const c=etaCalc();let pre='';const per=S.unit==='season'?3:S.unit==='week'?.25:1;
 if(skipping)pre='イベントまで・';else if(speed>0){const sm=1.5/speed/per,ev=(S.autoEv!==0&&speed>=2)?1.8:EVY;pre=`${['','▶','▶▶','','▶▶▶'][speed]||'▶'}なら約${fmtMin((12*sm+ev*EVS)*10)}・`}
 return `⏱ 10年あたり ${pre}ふつう約${fmtMin(c.normal*10)}｜操作多め約${fmtMin(c.heavy*10)}${c.pace?`｜あなたのペース約${fmtMin(c.pace*10)}`:''}`};
etaBox=function(){const c=etaCalc();return `<div class="etabox"><h3>推定プレイ時間</h3><table class="etat"><tr><th></th><th>1年</th><th>10年</th></tr>
 <tr><td>ふつうに進めた場合<small>▶で進め、出来事を読む</small></td><td>${fmtMin(c.normal)}</td><td>${fmtMin(c.normal*10)}</td></tr>
 <tr><td>いろいろ操作した場合<small>会社・まち・投稿などを毎月さわる（いまの人生に合わせて計算）</small></td><td>${fmtMin(c.heavy)}</td><td>${fmtMin(c.heavy*10)}</td></tr>
 <tr><td>あなたのペース<small>この人生で実際にかかった時間から計算</small></td><td>${c.pace?fmtMin(c.pace):'計測中'}</td><td>${c.pace?fmtMin(c.pace*10):'計測中'}</td></tr></table></div>`};
{const _fm58=fmtMin;fmtMin=function(sec){if(sec<60)return Math.max(1,Math.round(sec))+'秒';return _fm58.apply(this,arguments)}}

// ----- 5. 道のり：世界のトップ配信者を目標に（現実の上位は数千万〜数億人） -----
(function(){const st=n=>ROAD.find(r=>r[0]===n);const w=st('世界へ'),m=st('世界を動かす'),g=st('銀河へ');
 if(w)w[2]=[['フォロワー100万人',()=>S.stats.maxF>=1e6,'sns:',''],['海外に進出する',()=>!!(S.world&&S.world.r.length),'sns:','「発信」の「世界の舞台」'],['フォロワー1000万人',()=>S.stats.maxF>=1e7,'sns:','世界の人気配信者の仲間入り'],['賞をとる',()=>(S.awards||[]).length>0,'biz:aw','条件を満たすと自動でノミネートされます']];
 if(m)m[2]=[['全世界に進出',()=>!!(S.world&&S.world.r.includes('global')),'sns:','7つの地域すべてへ'],['フォロワー1億人',()=>S.stats.maxF>=1e8,'sns:','世界のトップ配信者と同じくらい'],['大計画を始める',()=>(S.mega||[]).length>0,'biz:mega','「事業」→「挑戦」→「大計画」'],['人口をふやす',()=>(S.popAdd||0)>0,'biz:mega','人口がふえると、届く人数も広がります']];
 if(g)g[2]=[['資産1兆円',()=>S.stats.maxM>=1e12,'money:',''],['フォロワー10億人',()=>S.stats.maxF>=1e9,'sns:','全世界に進出し、人口がふえると届きます'],['宇宙の大計画を完成',()=>(S.mega||[]).some(x=>x.done&&MEGA[x.k]&&(MEGA[x.k].cat==='宇宙'||MEGA[x.k].cat==='銀河')),'biz:mega',''],['1京円の計画を完成',()=>(S.mega||[]).some(x=>x.done&&MEGA[x.k]&&MEGA[x.k].c>=1e16),'biz:mega','']]})();

// ----- 6. 家族チャンネル：相談される／親がいきなり始める -----
if(EV.b_kidch){const w0=EV.b_kidch.when;EV.b_kidch.when=function(){return age()<=4&&!S.flags.kcNo&&w0.apply(this,arguments)};EV.b_kidch.t='家族チャンネル開設（いきなり）'}
E('kc_ask',{t:'家族チャンネルの相談',cat:'家族チャンネル',w:.07,once:1,when:()=>age()>=5&&age()<=12&&!S.kc.on&&!S.kc.was&&!S.flags.kcNo&&kidChLikely()&&anyParentAlive(),
 text:()=>`${parentName()}から相談された。「家族の毎日を動画にして、みんなに見てもらうのはどう？ 家族チャンネルを始めたいんだけど、いいかな？」`,
 ch:[['やってみたい！',()=>{startKidCh();ad('happy',3);ad('priv',-4);return '家族チャンネルが始まった。登録者がふえると家計が潤うけど、プライバシーは減っていく。'}],
  ['顔を出さないならいいよ',()=>{startKidCh();S.kc.noface=1;S.kc.f=Math.round(S.kc.f*.6);ad('priv',-1);return '顔を映さない約束で、家族チャンネルが始まった。伸びはゆっくりだけど、プライバシーは守られる。'}],
  ['はずかしいから、いや',()=>{S.flags.kcNo=1;ad('mental',1);for(const p of (parents()||[]))rel(p,-1);return '「そっか、わかった」と言ってくれた。'}]]});
E('kc_force',{t:'親がいきなり家族チャンネルを',cat:'家族チャンネル',w:.03,once:1,when:()=>age()>=6&&age()<=12&&!S.kc.on&&!S.kc.was&&S.flags.kcNo&&kidChLikely()&&anyParentAlive()&&(parents()||[]).some(p=>p.trait==='目立ちたがり'),
 text:()=>`ある日、${parentName()}が撮った動画が家族チャンネルとして公開されていた。前に「いや」と言ったのに……。`,
 ch:[['しぶしぶ協力する',()=>{startKidCh();ad('mental',-2);ad('priv',-4);return '家族チャンネルが始まった。'}],
  ['はっきり「やめて」と言う',()=>{if(chance(.6)){ad('mental',2);for(const p of (parents()||[]))rel(p,-3);return '本気で伝えたら、動画を消してくれた。'}startKidCh();ad('mental',-4);for(const p of (parents()||[]))rel(p,-5);return '「せっかく始めたのに」と、やめてもらえなかった。'}],
  ['気にしない',()=>{startKidCh();ad('priv',-3);return 'まあいいか、と思うことにした。'}]]});
{const _mh58=monthHook11;monthHook11=function(){_mh58();try{if(S.kc&&S.kc.on&&S.kc.noface)ad('priv',.5)}catch(_){}}}
EVL=null;

// ----- 7. 家族の立て替えを、その場ではっきり知らせる -----
function famPop(d0){try{const d=(S.famDebt||0)-d0;if(d>0&&typeof popBig==='function')popBig('💳 家族が立て替えてくれました',`${yen(d)}（足りなかった分）`,`大人（18歳）になったら返します・立て替えの合計 ${yen(S.famDebt)}`)}catch(_){}}
{const _ad58=ad;ad=function(k,v,cat){const d0=S?(S.famDebt||0):0;const r=_ad58.apply(this,arguments);if(S&&k==='money'&&v<0&&age()<18)famPop(d0);return r}}
{const _t58=turn;turn=function(){const d0=S?(S.famDebt||0):0;const r=_t58.apply(this,arguments);if(S&&S.alive&&age()<18)famPop(d0);return r}}

// ----- 8. 高校でバイトできるかどうか -----
const HS_JOB={top:{n:'進学校',ok:false,d:'アルバイト禁止'},mid:{n:'地元の高校',ok:true,d:'届け出をすればアルバイトできる'},online:{n:'通信制高校',ok:true,d:'アルバイト自由'}};
{const ok0=ACT.part.ok;ACT.part.ok=function(){if(S.st==='work'||S.st==='retired')return false;const a=age();if(S.st==='school'&&S.flags.hs&&HS_JOB[S.flags.hs]&&a>=15&&a<18)return HS_JOB[S.flags.hs].ok;return ok0.apply(this,arguments)}}
if(EV.m15&&EV.m15.ch){const ch0=EV.m15.ch;EV.m15.ch=(typeof ch0==='function'?ch0():ch0).map(([lab,fn,...r])=>{const k=/進学校/.test(lab)?'top':/地元/.test(lab)?'mid':/通信/.test(lab)?'online':null;return [k?`${lab}（${HS_JOB[k].d}）`:lab,fn,...r]})}
{const _sh58=secTip;secTip=function(){const t=_sh58.apply(this,arguments);try{if(age()>=15&&age()<18&&S.st==='school'&&S.flags.hs&&HS_JOB[S.flags.hs]&&HS_JOB[S.flags.hs].ok&&!(S.plan||[]).includes('part')&&S.money<30000&&!S.flags.hsJobTold){S.flags.hsJobTold=1;return [`${HS_JOB[S.flags.hs].n}はアルバイトができます。予定に「アルバイト」を入れると、おこづかいの足しになります`,'act:']}}catch(_){}return t}}

// ----- 9. SNSの始め方をわかりやすく -----
function snsStartHtml(){const a=age();if(a<13||!snsEra())return '';const ci=Math.max(.25,S.cty.inc),pr=Math.round(20000*ci);
 if(S.flags.noNet){const cdB=S.flags.borrowNo&&S.am<S.flags.borrowNo;return `<div class="card snsstart"><h3>📱 SNSの始め方</h3><p class="hint">いまはネットにつながる環境がありません。次のどれかで始められます。</p>
  <div class="shop"><div><div>スマホを買う <span class="chip">${yen(pr)}</span></div><div class="muted small">自分のスマホがあれば、いつでも投稿できます${a<18?'（おこづかいで買えます）':''}</div></div><button class="b sm pri" type="button" data-act="buyphone" ${S.money<pr?'disabled':''}>買う</button></div>
  <div class="shop"><div><div>家族にスマホを借りる <span class="chip">無料</span></div><div class="muted small">借りられるかは家族しだい。借りている間は、伸びが少しゆっくりになります</div></div><button class="b sm" type="button" data-snsway="borrow" ${cdB?'disabled':''}>${cdB?'また今度たのむ':'たのむ'}</button></div>
  ${a<=22||S.st==='school'||S.st==='univ'?`<div class="shop"><div><div>学校や図書館のパソコンを使う <span class="chip">無料</span></div><div class="muted small">使える時間が限られるので、伸びが少しゆっくりになります</div></div><button class="b sm" type="button" data-snsway="school">使う</button></div>`:''}</div>`}
 if(!S.snsOpen)return `<div class="card snsstart"><h3>📱 SNSの始め方</h3><p class="hint">下のボタンでアカウントを作ると、SNSが始まります。そのあと「予定」に「投稿」を入れた月に投稿します。</p><div class="row"><button class="b pri" type="button" data-opensns="milu">${esc(SNS.milu.n)}のアカウントを作る</button></div></div>`;
 return ''}
{const _ps58=panelSns;panelSns=function(){const h=_ps58.apply(this,arguments);try{if(!S.snsOpen){const g=snsStartHtml();if(g)return h.replace(/<p class="hint">[\s\S]*?<\/p>/,'')+g}else if(S.flags.netShare){const pr=Math.round(20000*Math.max(.25,S.cty.inc));return `<div class="card snsstart"><div class="muted small">いまは${S.flags.netShare==='borrow'?'家族のスマホ':'学校や図書館のパソコン'}で投稿しています（伸びが少しゆっくり）。</div><div class="row"><button class="b sm" type="button" data-act="buyphone" ${S.money<pr?'disabled':''}>自分のスマホを買う（${yen(pr)}）</button></div></div>`+h}}catch(e){console.error(e)}return h}}
document.addEventListener('click',e=>{const b=e.target.closest('[data-snsway]');if(!b||!S)return;const w=b.dataset.snsway;
 if(w==='borrow'){const p=clamp(.35+S.tier*.12+(S.p.social||0)/400,.2,.9);if(!chance(p)){S.flags.borrowNo=S.am+6;toast('「今はちょっと……」と断られた。半年後にまたたのめます');save();renderPanel();return}}
 delete S.flags.noNet;S.flags.netShare=w;S.q.push('m13');log(w==='borrow'?'家族にスマホを借りられることになった':'学校や図書館のパソコンでSNSを始められることになった','sns');save();render()});
document.addEventListener('click',e=>{const b=e.target.closest('[data-act="buyphone"]');if(!b||!S)return;setTimeout(()=>{if(S&&!S.flags.noNet&&S.flags.netShare){delete S.flags.netShare;log('自分のスマホを手に入れた','sns');save();render()}},50)});
{const _dm58=discMul;discMul=function(){const m=_dm58.apply(this,arguments);return S&&S.flags&&S.flags.netShare?m*.7:m}}
// 秘書：スマホがないときの案内
{const _st58b=secTip;secTip=function(){try{if(age()>=13&&S.flags.noNet&&snsEra())return ['SNSを始めるには、スマホを買うか、家族に借りるか、学校のパソコンを使う方法があります','sns:']}catch(_){}return _st58b.apply(this,arguments)}}
