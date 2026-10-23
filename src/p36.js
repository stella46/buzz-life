
// ===== v2.0：賞（毎年の授賞式）と、自分で開くコンテスト・大きな催し =====
const AWARDS=[
 {k:'gameaw',n:'ゲーム・オブ・ザ・イヤー',m:12,co:'game',d:'その年に出たゲームの中から選ばれる'},
 {k:'appaw',n:'アプリ大賞',m:11,co:'it',d:'その年に出たアプリの中から'},
 {k:'gourmet',n:'グルメアワード',m:10,co:'food',d:'新メニューの味と話題性'},
 {k:'fashion',n:'ファッションアワード',m:9,co:'apparel',d:'その年のコレクション'},
 {k:'book',n:'出版文化賞',m:1,co:'media',d:'雑誌・本・番組などの企画'},
 {k:'arch',n:'建築デザイン賞',m:6,co:'estate',d:'その年に完成した物件'},
 {k:'spaceaw',n:'宇宙開発功労賞',m:7,co:'space',d:'宇宙のミッション'},
 {k:'creator',n:'クリエイター大賞',m:12,sns:1,d:'フォロワー1万人以上の発信者'},
 {k:'rookie',n:'新人クリエイター賞',m:3,rookie:1,d:'SNSを始めて3年以内・フォロワー1000人以上'},
 {k:'ceo',n:'ベスト経営者賞',m:3,ceo:1,d:'会社を経営している人'},
 {k:'townaw',n:'まちづくり大賞',m:2,town:1,d:'発展度20以上のまち'},
 {k:'svcaw',n:'サブスク・オブ・ザ・イヤー',m:8,svc:1,d:'サブスク事業を運営している人'},
 {k:'social',n:'社会貢献賞',m:5,soc:1,d:'評判60以上'},
 {k:'talentaw',n:'ベスト事務所賞',m:4,tal:1,d:'所属タレントがいる事務所'}
];
const RANK_N=['','大賞','優秀賞','ノミネート'];
function awScore(a){const rep=S.p.rep;
  if(a.co){let best=null;for(const c of (S.cos||[])){if(c.k!==a.co||!c.pr)continue;for(const h of (c.pr.hist||[]))if(S.am-h.am<12&&(!best||h.q>best.h.q))best={c,h}}if(!best)return null;return {s:best.h.q+best.c.lv*1.5+(rep-50)/5+(best.h.tr?4:0)+R(-8,8),what:`「${best.c.name}」の${PROD[a.co].lbl}「${best.h.it}」`,c:best.c,h:best.h}}
  if(a.sns){if(!S.snsOpen||totalF()<1e4)return null;return {s:Math.log10(totalF())*14+Math.min(20,S.stats.buzz||0)+(rep-50)/4-(S.stats.flames||0)*2+R(-8,8),what:'あなたの発信'}}
  if(a.rookie){if(!S.snsOpen||S.snsAm==null||S.am-S.snsAm>36||totalF()<1000)return null;return {s:Math.log10(totalF())*18+(rep-50)/4+R(-8,8),what:'あなたの発信'}}
  if(a.ceo){if(!(S.cos||[]).length)return null;const v=S.cos.reduce((x,c)=>x+c.val,0)/Math.max(.2,S.cty.inc);return {s:Math.log10(v+1)*7+(rep-50)/5+R(-8,8),what:'あなたの経営'}}
  if(a.town){const T=homeTown();if(!T||T.dev<20)return null;return {s:T.dev*.6+(T.support||50)*.3+R(-8,8),what:`「${townName(T)}」のまちづくり`}}
  if(a.svc){if(!(S.svcs||[]).length)return null;const u=Math.max(...S.svcs.map(s=>s.users||0));return {s:Math.log10(u+1)*16+R(-8,8),what:'あなたのサブスク事業'}}
  if(a.soc){if(rep<60)return null;return {s:rep*.8+(S.flags.scholar?10:0)+((S.mega||[]).filter(m=>m.done&&MEGA[m.k]&&MEGA[m.k].soc).length*6)+R(-8,8),what:'あなたの社会貢献'}}
  if(a.tal){if(!S.office||!S.office.talents.length)return null;const f=Math.max(...S.office.talents.map(t=>t.f));return {s:Math.log10(f+1)*14+(ofType()&&ofType().sp==='rep'?5:0)+R(-8,8),what:'あなたの事務所'}}
  return null}
function awMonth(){if(!S.awY)S.awY={};for(const a of AWARDS){if(S.m!==a.m||S.awY[a.k]===S.y)continue;S.awY[a.k]=S.y;const r=awScore(a);if(!r)continue;
  const top=R(72,96)+Math.min(12,((S.awKinds||{})[a.k]||0)*2),sec=R(58,Math.min(top,96)),thd=R(45,sec);const rank=r.s>=top?1:r.s>=sec?2:r.s>=thd?3:0;if(!rank)continue;
  if(!S.awards)S.awards=[];S.awards.unshift({y:S.y,k:a.k,n:a.n,rank,what:r.what});S.awards=S.awards.slice(0,80);S.awCnt=(S.awCnt||0)+1;if(rank===1)S.awWin=(S.awWin||0)+1;
  if(!S.awKinds)S.awKinds={};if(rank===1)S.awKinds[a.k]=(S.awKinds[a.k]||0)+1;
  if(rank===1){ad('rep',6);if(r.c){r.c.val=Math.round(r.c.val*1.08);coInit(r.c);r.c.emp.mor=clamp(r.c.emp.mor+15);r.c.pr.sales=r.c.pr.sales||[];r.c.pr.sales.push({left:6,amt:r.h.total*.06,dec:.8})}if(a.sns||a.rookie)ad('f',.03);
    if(S.awKinds[a.k]===1){S.awRes={a:a.n,what:r.what};if(!S.q.includes('aw_win'))S.q.push('aw_win')}else{log(`${a.n}：${r.what}が大賞に選ばれた（${S.awKinds[a.k]}回目）`,'good');toast(`${a.n} 大賞！`)}}
  else if(rank===2){ad('rep',3);if(r.c){coInit(r.c);r.c.emp.mor=clamp(r.c.emp.mor+6)}if(a.sns||a.rookie)ad('f',.01);log(`${a.n}：${r.what}が優秀賞に選ばれた`,'good')}
  else{ad('rep',1);log(`${a.n}：${r.what}がノミネートされた`,'life')}}}
E('aw_win',{t:'授賞式',cat:'賞',w:0,text:()=>{const r=S.awRes||{a:'賞',what:'あなた'};return `「${r.a}」の授賞式。\n${r.what}が、大賞に選ばれた！ 壇上でスピーチをすることになった。`},
 ch:[['支えてくれた人に感謝を伝える',()=>{ad('social',3);ad('happy',4);tl(`「${(S.awRes||{}).a}」で大賞を受賞`);return '会場が温かい拍手に包まれた。'}],['仲間や社員をたたえる',()=>{for(const c of (S.cos||[])){coInit(c);c.emp.mor=clamp(c.emp.mor+8)}ad('happy',3);tl(`「${(S.awRes||{}).a}」で大賞を受賞`);return '「最高のチームです」の一言に、社員たちが涙ぐんだ。'}],['次の目標を宣言する',()=>{ad('rep',2);ad('plan',2);tl(`「${(S.awRes||{}).a}」で大賞を受賞`);return '堂々とした宣言が、ニュースで何度も流れた。'}]]});

// ----- 自分で開くコンテスト・催し -----
const HOST_T=[
 {k:'gamecon',n:'ゲームコンテスト',base:2e7,ent:'ゲーム',d:'新しいゲームを募集する'},
 {k:'appcon',n:'アプリコンテスト',base:2e7,ent:'アプリ',d:'便利なアプリを募集する'},
 {k:'cookgp',n:'料理グランプリ',base:1e7,ent:'料理',d:'腕自慢の料理人が集まる'},
 {k:'fashow',n:'ファッションショー',base:5e7,ent:'作品',d:'新しいデザインのお披露目'},
 {k:'novel',n:'漫画・小説大賞',base:1e7,ent:'作品',d:'物語の新人を発掘する'},
 {k:'audition',n:'新人クリエイターオーディション',base:1.5e7,ent:'参加者',d:'優勝者を会社や事務所にスカウトできる',scout:1},
 {k:'esports',n:'eスポーツ大会',base:8e7,ent:'チーム',d:'配信で大きく盛り上がる',yr:2000},
 {k:'musicfes',n:'音楽フェス',base:2e8,ent:'アーティスト',d:'チケットとグッズで大きな売上'},
 {k:'photo',n:'まちのフォトコンテスト',base:3e6,ent:'写真',d:'まちの支持が上がる',town:1},
 {k:'expo',n:'展示会・新作発表会',base:1e8,ent:'出展',d:'自分の会社の価値が上がる',co:1},
 {k:'spacelive',n:'宇宙からの生配信イベント',base:3e10,ent:'企画',d:'フォロワーが大きく増える（2040年から）',yr:2040},
 {k:'worldexpo',n:'国際博覧会',base:2e11,ent:'パビリオン',d:'世界から人が集まる。まちが大きく発展する（世界規模のみ）',onlyW:1}
];
const HSC={l:{n:'地域',m:1,dur:2,at:5e3},n:{n:'全国',m:5,dur:4,at:5e4},w:{n:'世界',m:30,dur:8,at:5e5}};
const HJU={self:{n:'自分で審査',d:'応募作から自分で大賞を選ぶ'},judge:{n:'審査員におまかせ',d:'費用+10%。いちばん良いものが選ばれる'},vote:{n:'視聴者投票',d:'SNSのフォロワーが投票。人気のものが選ばれ、フォロワーも増える'}};
const ENT_ADJ=['ふしぎな','きらめく','まっすぐな','ちいさな','とおい','やさしい','はげしい','しずかな','ひみつの','あたらしい','なつかしい','まぶしい'];
const ENT_NOUN=['星','約束','冒険','街角','手紙','夏','記憶','時計','扉','航海','森','光'];
const ENT_HINT=[[90,'完成度がとても高い'],[78,'完成度は高いが、少し地味'],[66,'斬新だが、荒けずり'],[52,'勢いはあるが、雑なところも'],[0,'まだまだこれから']];
function hostCost(t,sc,ju){return Math.round(t.base*HSC[sc].m*(ju==='judge'?1.1:1)*Math.max(.2,S.cty.inc))}
function hostStart(k,sc,ju){const t=HOST_T.find(x=>x.k===k);if(!t)return;if(t.onlyW)sc='w';const cost=hostCost(t,sc,ju);if(S.money<cost){toast('お金が足りない');return}if(ju==='vote'&&!S.snsOpen){toast('視聴者投票はSNSを始めてから');return}
  outc('event',cost);if(!S.hostAct)S.hostAct=[];S.hostAct.push({id:'h'+RI(1e4,9e4),k,sc,ju,st:S.am,dur:HSC[sc].dur,cost});log(`${HSC[sc].n}規模の「${t.n}」の準備を始めた（${yen(cost)}）`,'good');save(true);render()}
function hostEntries(h){const t=HOST_T.find(x=>x.k===h.k);const es=[];for(let i=0;i<5;i++){const q=RI(30,96);es.push({t:`${pick(ENT_ADJ)}${pick(ENT_NOUN)}`,q,pop:q*.4+RI(0,60),mine:false})}
  if(chance(.3)){const e=pick(es);e.mine=true}return es}
function hostMonth(){if(!S.hostAct||!S.hostAct.length)return;for(const h of S.hostAct.slice()){if(S.am<h.st+h.dur)continue;S.hostAct=S.hostAct.filter(x=>x!==h);h.es=hostEntries(h);
  if(h.ju==='self'){S.hostCur=h;if(!S.q.includes('host_judge'))S.q.push('host_judge');else hostFinish(h,h.es.reduce((b,e,i)=>e.q>h.es[b].q?i:b,0))}
  else{const i=h.ju==='vote'?h.es.reduce((b,e,j)=>e.pop>h.es[b].pop?j:b,0):h.es.reduce((b,e,j)=>e.q>h.es[b].q?j:b,0);hostFinish(h,i)}}}
function hostFinish(h,wi){const t=HOST_T.find(x=>x.k===h.k),sc=HSC[h.sc],w=h.es[wi],best=Math.max(...h.es.map(e=>e.q));const rep=S.p.rep;let msg='';
  const att=Math.round(sc.at*(.6+rep/100)*R(.7,1.4)*(t.k==='musicfes'?3:t.k==='worldexpo'?40:1));const rev=Math.round(h.cost*R(.5,1.5)*(.6+rep/120)*(t.k==='musicfes'?1.4:1));inc('event',rev);
  ad('rep',{l:2,n:4,w:8}[h.sc]);if(S.snsOpen)ad('f',{l:.005,n:.01,w:.03}[h.sc]*(h.ju==='vote'?2:1)*(t.k==='spacelive'?5:1));
  if(h.ju==='self'){if(w.mine){if(chance(.5)){ad('rep',-6);if(!S.q.includes('flame')&&S.snsOpen)S.q.push('flame');msg='「身内びいきでは？」という声が上がり、騒ぎになった。'}else msg='身内の作品だったが、実力が認められた。'}else if(w.q>=best){ad('rep',3);S.flags.fairJ=(S.flags.fairJ||0)+1;msg='「審査が的確だ」と評判になった。'}else if(w.q<best-25){ad('rep',-2);msg='「もっといい作品があったのでは」という声も。'}}
  if(t.town){const T=homeTown();if(T)T.support=clamp((T.support||50)+{l:3,n:5,w:8}[h.sc])}
  if(t.co)for(const c of (S.cos||[]))c.val=Math.round(c.val*(1+{l:.01,n:.03,w:.06}[h.sc]));
  if(t.k==='worldexpo'){const T=homeTown();if(T)T.bonus=(T.bonus||0)+30;tl('国際博覧会を開いた')}
  if(t.scout&&w.q>=70){const c=(S.cos||[])[0];if(c){coInit(c);if(c.emp.key.length<12){const k=mkKey(c);k.sk=Math.max(k.sk,w.q-10);k.name=k.name;c.emp.key.push(k);msg+=`優勝した${k.name}さんが「${c.name}」に入社した。`}}else if(S.office&&S.office.lv&&S.office.talents.length<OFFICE[S.office.lv].tal){S.office.talents.push({name:pick(TAL_NAMES),genre:pick(TALK),f:RI(3000,30000)});msg+='優勝者が事務所に所属することになった。'}}
  S.hostN=(S.hostN||0)+1;if(!S.hostKinds)S.hostKinds={};S.hostKinds[h.k]=(S.hostKinds[h.k]||0)+1;if(!S.hostLog)S.hostLog=[];S.hostLog.unshift({y:S.y,n:t.n,sc:h.sc,win:w.t,att,rev,cost:h.cost});S.hostLog=S.hostLog.slice(0,20);
  log(`${sc.n}規模の「${t.n}」を開いた。来場 ${num(att)}人・売上 ${yen(rev)}・大賞「${w.t}」。${msg}`,'good');return msg}
E('host_judge',{t:'審査の日',cat:'賞',w:0,when:()=>!!S.hostCur,text:()=>{const h=S.hostCur,t=HOST_T.find(x=>x.k===h.k);return `「${t.n}」の最終審査。5つの${t.ent}が残った。どれを大賞にする？\n${h.es.map(e=>`・「${e.t}」…${ENT_HINT.find(x=>e.q>=x[0])[1]}${e.mine?'（あなたの知り合いの作品）':''}`).join('\n')}`},
 ch:()=>{const h=S.hostCur;if(!h)return [['閉じる',()=>'']];return h.es.map((e,i)=>[`「${e.t}」を大賞に`,()=>{S.hostCur=null;return hostFinish(h,i)||'大賞が決まった。'}])}});
// 毎月の処理
const _mh36=monthHook11;monthHook11=function(){_mh36();try{awMonth();hostMonth()}catch(e){console.error(e)}};
Object.assign(INC_LBL,{event:'イベントの売上'});Object.assign(OUT_LBL,{event:'イベントの費用'});
// 画面
function awHtml(){const ci=Math.max(.2,S.cty.inc);let h=`<h3>毎年の賞</h3><p class="hint">それぞれ決まった月に発表される。条件を満たしていれば自動でノミネートされ、作品の評価・評判・人気で結果が決まる。</p><div class="awcal">${AWARDS.map(a=>{const ok=!!awScore(a);const won=(S.awKinds||{})[a.k]||0;return `<div class="shop"><div><div>${a.m}月　${esc(a.n)}${won?` <span class="chip up">大賞${won}回</span>`:''}</div><div class="muted small">${esc(a.d)}${ok?'・<b>いまノミネートの対象</b>':''}</div></div></div>`}).join('')}</div>`;
  h+=`<h3>受賞歴</h3>${(S.awards||[]).length?`<div class="kv">${S.awards.slice(0,10).map(r=>`<span>${r.y}年 ${esc(r.n)}</span><span class="${r.rank===1?'up':''}">${RANK_N[r.rank]}</span>`).join('')}</div>`:'<p class="hint">まだない。</p>'}`;
  h+=`<h3>自分で開く</h3><p class="hint">コンテストや大きな催しを主催する。規模が大きいほど費用も効果も大きい。準備に数か月かかる。</p>`;
  const avail=HOST_T.filter(t=>!t.yr||S.y>=t.yr);
  h+=`<div class="row"><select id="hoK">${avail.map(t=>`<option value="${t.k}">${esc(t.n)}</option>`).join('')}</select><select id="hoS">${Object.entries(HSC).map(([k,s])=>`<option value="${k}">${s.n}規模（準備${s.dur}か月）</option>`).join('')}</select><select id="hoJ">${Object.entries(HJU).map(([k,j])=>`<option value="${k}">${j.n}</option>`).join('')}</select></div><p class="hint small" id="hoInfo">${hoInfo(avail[0].k,'l','self')}</p><div class="row"><button class="b sm pri" type="button" data-act="hoGo">開催を決める</button></div>`;
  if((S.hostAct||[]).length)h+=`<h3>準備中</h3>${S.hostAct.map(x=>{const t=HOST_T.find(y=>y.k===x.k);return `<p class="mtext small">${HSC[x.sc].n}規模の「${esc(t.n)}」（${HJU[x.ju].n}）あと${Math.max(0,x.st+x.dur-S.am)}か月</p>`}).join('')}`;
  if((S.hostLog||[]).length)h+=`<h3>これまでに開いた催し</h3><div class="kv">${S.hostLog.slice(0,8).map(l=>`<span>${l.y}年 ${esc(l.n)}（${HSC[l.sc].n}）</span><span>来場 ${num(l.att)}人</span>`).join('')}</div>`;
  return h}
function hoInfo(k,sc,ju){const t=HOST_T.find(x=>x.k===k);if(!t)return '';if(t.onlyW)sc='w';return `${esc(t.d)}。費用 ${yen(hostCost(t,sc,ju))}。${esc(HJU[ju].d)}`}
document.addEventListener('change',e=>{if(['hoK','hoS','hoJ'].includes(e.target.id)){const i=$('#hoInfo');if(i)i.textContent=hoInfo($('#hoK').value,$('#hoS').value,$('#hoJ').value).replace(/<[^>]+>/g,'')}});
document.addEventListener('click',e=>{const b=e.target.closest('[data-act="hoGo"]');if(!b||!S)return;hostStart($('#hoK').value,$('#hoS').value,$('#hoJ').value)});
