
// ===== v2.0：大計画（とんでもないお金の使い道。現実ではむずかしいことも） =====
// [キー, 名前, 分類, 費用, 期間(か月), 始められる年, 説明, 完成したときの効果]
const MEGA_RAW=[
 ['station','民間宇宙ステーション','宇宙',3e12,60,2030,'地球のまわりを回る、自分の宇宙ステーション',{rep:15,f:.05,rp:30}],
 ['moonbase','月面基地','宇宙',2e13,96,2040,'月に研究基地をつくる',{rep:25,f:.08,rp:80}],
 ['mooncity','月面都市','宇宙',2e14,180,2060,'月に人が住めるまちをつくる。新しいまちとして持てる',{rep:40,f:.15,town:'月面都市ルナ'},'moonbase'],
 ['mars','火星移住計画','宇宙',5e14,240,2070,'人類が火星に住む第一歩',{rep:60,f:.25,title:'火星の開拓者'},'moonbase'],
 ['elevator','軌道エレベーター','宇宙',8e13,144,2055,'地上から宇宙までつながる巨大なエレベーター。宇宙ベンチャーの利益が2倍に',{rep:30,f:.1,space2:1}],
 ['asteroid','小惑星の採掘','宇宙',3e13,96,2050,'小惑星から資源を掘り出す。毎月ばく大な収入',{rep:15,income:3e10},'station'],
 ['probe','太陽系外への探査船','宇宙',1e14,240,2060,'はるか遠くの星へ向かう探査船',{rep:35,rp:150,title:'星々への使者'}],
 ['island','人工島','地球',5e11,48,1990,'海の上に新しい島をつくる。新しいまちとして持てる',{rep:10,town:'夢の人工島'}],
 ['seacity','海上都市','地球',5e12,96,2030,'海の上に浮かぶ未来のまち。新しいまちとして持てる',{rep:20,f:.04,town:'海上都市マリン'}],
 ['green','砂漠の緑化','地球',2e12,120,2000,'砂漠を森に変える',{rep:30,soc:1,happy:15}],
 ['weather','天気を変える装置','地球',1e13,72,2045,'雨や晴れを少しだけ変えられる。農業と観光が助かる',{rep:20,rp:40}],
 ['airport','国際空港','地球',1e12,72,1970,'ふるさとに国際空港をつくる。まちが大きく発展',{rep:15,dev:60}],
 ['rail','超高速鉄道','地球',3e12,96,1990,'国じゅうを1時間で結ぶ鉄道',{rep:20,dev:40,f:.02}],
 ['tower','世界一高いタワー','地球',8e11,60,1990,'雲をつきぬける世界一のタワー',{rep:15,f:.05,dev:30}],
 ['ageless','不老の研究','夢',5e13,180,2050,'老いをゆっくりにする研究。寿命が大きくのびる',{rep:20,life:1}],
 ['capsule','タイムカプセル衛星','夢',2e11,36,2010,'1000年後の人へのメッセージを宇宙に',{rep:8,happy:10}],
 ['sun','人工の太陽','夢',2e14,180,2070,'核融合でつくる小さな太陽。世界のエネルギー問題を解決',{rep:50,soc:1,income:1e11}],
 ['warp','ワープ理論の研究','夢',1e15,300,2080,'光より速く移動する方法をさがす',{rep:80,rp:500,title:'時空の探究者'}],
 ['univ','自分の名前の大学','社会',3e11,48,1960,'自分の名前がついた大学をつくる',{rep:15,soc:1,rp:20}],
 ['hospital','最先端の病院グループ','社会',5e11,48,1970,'国じゅうに病院をつくる',{rep:20,soc:1,med:1}],
 ['found','世界的な財団','社会',1e12,24,1970,'困っている人を支える財団を世界中に',{rep:30,soc:1}],
 ['school','世界中に学校をつくる','社会',2e12,120,1980,'1000の学校を世界中に建てる',{rep:35,soc:1,happy:10}],
 ['heritage','文化遺産の保護','社会',3e11,60,1960,'古い建物や文化を未来に残す',{rep:15,soc:1}],
 ['nation','自分の国をつくる','ぜいたく',5e13,120,2030,'小さな独立国をつくって国王になる',{rep:20,f:.1,title:'小さな国の国王'}],
 ['satv','自分専用の衛星放送局','ぜいたく',3e12,48,2000,'世界中に配信できる放送局。フォロワーが大きく増える',{rep:10,f:.2}],
 ['planet','惑星の命名権','ぜいたく',1e13,12,2050,'新しく見つかった惑星に名前をつける',{rep:10,happy:20,title:'星に名を残す者'}]
];
const MEGA={};MEGA_RAW.forEach(([k,n,cat,c,dur,yr,d,fx,req])=>MEGA[k]={k,n,cat,c,dur,yr,d,fx,req});
function megaCost(m){return Math.round(m.c*Math.max(.2,S.cty.inc))}
function megaOf(k){return (S.mega||[]).find(x=>x.k===k)}
function megaDone(k){const m=megaOf(k);return !!(m&&m.done)}
function megaStart(k){const m=MEGA[k];if(!m||megaOf(k))return;if(m.req&&!megaDone(m.req)){toast(`先に「${MEGA[m.req].n}」を完成させよう`);return}const c=megaCost(m);if(S.money<c){toast('お金が足りない');return}if(S.y<m.yr)return;
  outc('mega',c);if(!S.mega)S.mega=[];S.mega.push({k,st:S.am,dur:m.dur,done:0,ev:0});tl(`大計画「${m.n}」を始めた`);log(`大計画「${m.n}」を始めた（${yen(c)}・${Math.round(m.dur/12*10)/10}年）`,'good');ticker(`${S.name}、「${m.n}」に着手`);ad('rep',3);snd('buy');save(true);render()}
function megaMonth(){for(const x of (S.mega||[])){const m=MEGA[x.k];if(!m)continue;
  if(!x.done){if(chance(.012)){if(chance(.55)){x.dur+=RI(6,18);log(`「${m.n}」で予想外のトラブル。完成が遅れる`,'bad')}else{x.dur=Math.max(S.am-x.st+1,x.dur-RI(6,12));log(`「${m.n}」で大きな発見があり、工事が早まった`,'good')}}
    if(S.am>=x.st+x.dur){x.done=1;x.am=S.am;megaComplete(m)}}
  else{const fx=m.fx;if(fx.income)inc('mega',Math.round(fx.income*Math.max(.2,S.cty.inc)*R(.7,1.3)));if(fx.rp)S.rp+=fx.rp/12}}}
function megaComplete(m){const fx=m.fx;if(fx.rep)ad('rep',fx.rep);if(fx.f&&S.snsOpen)ad('f',fx.f);if(fx.happy)ad('happy',fx.happy);if(fx.dev){const T=homeTown();if(T)T.bonus=(T.bonus||0)+fx.dev}if(fx.med)S.medBuff=Math.min(4,(S.medBuff||0)+1);if(fx.life)S.medBuff=Math.min(6,(S.medBuff||0)+2);
  if(fx.title)S.flags['title_'+m.k]=fx.title;
  if(fx.town&&allTowns().length<8){const T=newTown('地方都市');T.nm=fx.town;T.rt='地方都市';T.kind='mega';T.support=70;T.reqs=[];T.sel=-1;T.bonus=20;if(!S.towns2)S.towns2=[];S.towns2.push(T)}
  S.megaN=(S.megaN||0)+1;tl(`大計画「${m.n}」が完成した`);ticker(`${S.name}の「${m.n}」がついに完成`);log(`大計画「${m.n}」が完成した！`,'good');S.megaDoneK=m.k;if(!S.q.includes('mega_done'))S.q.push('mega_done')}
E('mega_done',{t:'大計画の完成',cat:'大計画',w:0,text:()=>{const m=MEGA[S.megaDoneK]||{n:'大計画'};return `何年もかけてきた「${m.n}」が、ついに完成した。\n世界中のニュースが、このことを伝えている。`},
 ch:[['記念式典を開く',()=>{ad('happy',6);ad('social',3);return '多くの人がお祝いに駆けつけた。'}],['関わったすべての人に感謝を伝える',()=>{ad('rep',3);ad('mental',4);return 'あなたの言葉が、たくさんの人の心に残った。'}],['もう次の計画を考える',()=>{ad('plan',3);return '夢に終わりはない。'}]]});
// 軌道エレベーター：宇宙ベンチャーの利益が2倍
const _coProfit38=coProfit;coProfit=function(c,commit){let p=_coProfit38(c,commit);if(c.k==='space'&&megaDone('elevator'))p*=2;return Math.round(p)};
const _mh38=monthHook11;monthHook11=function(){_mh38();try{megaMonth()}catch(e){console.error(e)}};
Object.assign(INC_LBL,{mega:'大計画の収入'});Object.assign(OUT_LBL,{mega:'大計画'});
let MEGACAT='宇宙';
function megaHtml(){let h=`<h3>大計画</h3><p class="hint">とてつもないお金と年月がかかる計画。途中でトラブルや大発見があり、完成すると世界が変わる。持っているお金：${yen(S.money)}</p><div class="seg wrapseg">${['宇宙','地球','夢','社会','ぜいたく'].map(c=>`<button type="button" class="${MEGACAT===c?'on':''}" data-megacat="${c}">${c}</button>`).join('')}</div>`;
  for(const m of Object.values(MEGA).filter(x=>x.cat===MEGACAT)){const x=megaOf(m.k),lockY=S.y<m.yr,lockR=m.req&&!megaDone(m.req);
    let st='';if(x&&x.done)st='<span class="chip up">完成</span>';else if(x)st=`<span class="chip">建設中 あと${Math.max(0,x.st+x.dur-S.am)}か月</span>`;
    h+=`<div class="shop"><div><div>${esc(m.n)} ${st}</div><div class="muted small">${esc(m.d)}<br>${yen(megaCost(m))}・約${Math.round(m.dur/12*10)/10}年${lockY?`（${m.yr}年から）`:''}${lockR?`（先に「${esc(MEGA[m.req].n)}」）`:''}</div>${x&&!x.done?`<div class="tbar"><i style="width:${Math.min(100,(S.am-x.st)/x.dur*100).toFixed(0)}%"></i></div>`:''}</div>${x?'':`<button class="b sm" type="button" data-mega="${m.k}" ${lockY||lockR||S.money<megaCost(m)||age()<20?'disabled':''}>始める</button>`}</div>`}
  return h}
document.addEventListener('click',e=>{const b=e.target.closest('button');if(!b||!S)return;if(b.dataset.megacat){MEGACAT=b.dataset.megacat;renderPanel();return}if(b.dataset.mega){megaStart(b.dataset.mega)}});
// 称号：大計画の称号を人生の最後に
const _titlesOf38=titlesOf;titlesOf=function(){const t=_titlesOf38();for(const k in S.flags)if(k.startsWith('title_'))t.push(S.flags[k]);return t};
