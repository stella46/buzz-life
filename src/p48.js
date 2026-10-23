
// ===== v2.4：研究を約300に（段階式の研究ライン）＋迷わない研究画面 =====
// ライン：[キー,分類,名前,1段の効果の説明,必要な研究,16段の名前]
const RTRACK=[
 ['q','sns','映像と企画の技','投稿の質 +1',null,['構図の基本','光の使い方','音声の磨き方','テロップ術','間の取り方','編集のリズム','色の設計','物語の組み立て','視線の誘導','サムネイル心理','演出の妙','没入感の作り方','共感の設計','余韻の作り方','名作の分析','究極の一本']],
 ['sg','sns','広がる仕組み','SNSの伸び +3%',null,['拡散の仕組み','タグの戦略','投稿時間の最適化','おすすめに載るコツ','切り抜きの活用','コメント欄の育て方','ファンの口コミ','インフルエンサー連携','話題の波の読み方','国をこえる拡散','多言語の字幕','バズの方程式','同時多発キャンペーン','文化の橋わたし','世界トレンドの設計','拡散の極意']],
 ['mon','sns','収益化の研究','SNSの収入・投げ銭 +3%','analytics',['広告の仕組み','スポンサーの探し方','投げ銭の演出','限定コンテンツ','会員特典の設計','グッズ連動','ライブ課金','電子チケット','ファン経済学','価格の心理学','ブランド提携','権利ビジネス','世界の決済','仮想通貨の活用','ファン証券','収益化の極意']],
 ['cap','future','届く範囲の拡張','届けられる人数の上限 +2%','global',['回線の増強','配信サーバーの分散','自動翻訳','同時通訳AI','衛星配信','地下でも届く電波','海の上の基地局','空飛ぶ中継局','宇宙中継網','月への回線','火星への中継','光より速い通信の理論','量子通信','星間ネットワーク','銀河放送','どこでも届く声']],
 ['co','biz','経営の深化','会社の利益 +3%','company',['会計の基本','組織づくり','人材育成','業務の効率化','データ経営','ブランド経営','グローバル経営','サプライチェーン','M&A戦略','イノベーション経営','持続可能な経営','未来予測経営','AI経営','惑星規模の物流','宇宙企業の経営','経営の極意']],
 ['emp','biz','大きな組織','社員の雇用上限 +5%','hr',['採用の仕組み','教育制度','評価制度','リモートワーク','多様な働き方','社内大学','人材の世界採用','AI人事','100万人の組織論','国をこえる組織','都市規模の社屋','社員の住む街','惑星の支社','宇宙での採用','銀河規模の組織','組織の極意']],
 ['shop','biz','商いの道','お店のお客さん +3%','cafe',['接客の心得','品ぞろえ','季節の売り場','常連の育て方','行列のつくり方','観光客の呼びこみ','ネット予約','配達サービス','ご当地名物','ブランド化','フランチャイズ','世界の味','無人店舗','空中店舗','宇宙の売店','商いの極意']],
 ['megaC','future','巨大工学','大計画の費用 -1.5%',null,['設計の標準化','建設ロボット','3Dプリント建築','新しい素材','自己修復コンクリート','超伝導','軽くて強い骨組み','海底工事','宇宙での組み立て','月の資源の利用','小惑星の資源','無重力工場','分子レベルの製造','ナノ機械','星を使う工学','工学の極意']],
 ['megaT','future','工期の短縮','大計画の工期 -1.5%',null,['工程管理','24時間工事','同時並行の建設','ドローン運搬','自動運転の重機','予測シミュレーション','モジュール工法','宇宙エレベーター輸送','核融合エンジン','軌道上の工場','自己複製ロボット','時間の圧縮理論','瞬間移動の応用','未来の建設会社','銀河の工事現場','工期の極意']],
 ['pop','future','人類の未来','人口がふえる大計画の効果 +5%',null,['家族を支える制度','子育ての科学','医療の普及','食の安全','住まいの未来','教育の普及','高齢者の暮らし','都市の設計','緑の都市','海に住む知恵','空に住む知恵','月で暮らす知恵','火星で暮らす知恵','宇宙で生まれる子ども','星々の社会','人類の極意']],
 ['hl','life','健康の科学','毎月の健康の回復 +0.04','health_k',['睡眠の科学','栄養学','運動生理学','姿勢の改善','腸の研究','免疫の研究','予防医学','遺伝子の研究','再生医療','細胞の若返り','人工臓器','ナノ医療','宇宙医学','寿命の研究','永い命の理論','健康の極意']],
 ['mn','life','心の科学','毎月のメンタルの回復 +0.04','mind',['ストレスの仕組み','呼吸法','瞑想の科学','感情の整理','人間関係の心理','ほめる力','休み方の研究','創造性の科学','幸福学','心の回復力','チームの心理','共感の神経科学','夢の研究','意識の研究','心と宇宙','心の極意']],
 ['rp','life','学びの研究','研究ポイントのたまり方 +4%',null,['読書術','記憶術','ノート術','速読','論理的思考','統計学','プログラミング','機械学習','研究の進め方','論文の読み方','世界の研究者ネットワーク','AIとの共同研究','量子コンピュータ','超知能の研究','知の宇宙','学びの極意']],
 ['town','town','まちの未来','まちの発展が毎月少し進む','town',['道路の整備','公園づくり','商店街の再生','駅前開発','歩きやすいまち','防災のまちづくり','スマートシティ','自動運転のまち','空中歩道','地下都市','海上の街区','緑の摩天楼','気候を整えるドーム','月のまちの設計','宇宙のまちの設計','まちの極意']],
 ['tal','biz','タレント育成','所属タレントのフォロワーの伸び +0.3%/月',null,['発声の練習','カメラの前の立ち方','キャラクターづくり','台本の読み方','アドリブ力','ファン対応','自己プロデュース','ブランディング','海外向けの発信','多言語トーク','ステージ演出','世界ツアーの準備','メディア戦略','伝説の育て方','星々のステージ','育成の極意']],
 ['fam','life','家族の科学','子どもや家族との絆が深まりやすい・幸福 +0.03/月','parent_k',['話の聞き方','家族の時間','遊びの力','家庭の教育','反抗期の理解','進路の相談','家族旅行の計画','三世代の暮らし','家族の歴史','家族の健康','思いやりの連鎖','家族の未来','家族の物語','世代をこえる知恵','家族の宇宙','家族の極意']]
];
const RT_COST=(L)=>Math.round(30*Math.pow(1.3,L));
const RT_CATN=Object.assign({},RES_CAT,{future:'未来・宇宙'});
function rt(k){return (S&&S.rtk&&S.rtk[k])||0}
function rtOf(k){return RTRACK.find(t=>t[0]===k)}
function rtCost(k){return Math.round(RT_COST(rt(k))*(lg('g10')?.85:1))}
function rtOk(k){const t=rtOf(k);return t&&(!t[4]||has(t[4]))&&rt(k)<t[5].length}
function rtBuy(k){const t=rtOf(k);if(!t||!rtOk(k))return;const c=rtCost(k);if(S.rp<c)return;S.rp-=c;if(!S.rtk)S.rtk={};const nm=t[5][rt(k)];S.rtk[k]=rt(k)+1;log(`研究「${nm}」が完了した（${t[2]} ${S.rtk[k]}段）`,'good');snd('buy');try{checkAch('m')}catch(_){}save();render()}
function rtDoneN(){return RTRACK.reduce((a,t)=>a+rt(t[0]),0)}
function resTotal(){return RES.length+RTRACK.reduce((a,t)=>a+t[5].length,0)}
function resDoneAll(){return RES.filter(r=>has(r.id)).length+rtDoneN()}

// ----- 効果 -----
const _pq48=postQuality;postQuality=function(){return _pq48.apply(this,arguments)+rt('q')};
const _dm48=discMul;discMul=function(){return _dm48.apply(this,arguments)*(1+.03*rt('sg'))};
const _ssm48=shopSegMul;shopSegMul=function(i){return _ssm48.apply(this,arguments)*(1+.03*rt('shop'))};
const _cp48=coProfit;coProfit=function(c,commit){const p=_cp48.apply(this,arguments);return rt('co')?Math.round(p*(1+.03*rt('co'))):p};
const _mc48=megaCost;megaCost=function(m){return Math.round(_mc48.apply(this,arguments)*(1-.015*rt('megaC')))};
const _ms48=megaStart;megaStart=function(k){const n0=(S.mega||[]).length;const r=_ms48.apply(this,arguments);try{if((S.mega||[]).length>n0&&rt('megaT')){const x=S.mega[S.mega.length-1];x.dur=Math.max(3,Math.round(x.dur*(1-.015*rt('megaT'))))}}catch(_){}return r};
const _cc48=coCap;coCap=function(c){const v=_cc48.apply(this,arguments);return rt('emp')?Math.round(v*(1+.05*rt('emp'))):v};
const _inc48=inc;inc=function(cat,v){if(v>0&&(cat==='sns'||cat==='tip')&&rt('mon'))v=Math.round(v*(1+.03*rt('mon')));return _inc48.call(this,cat,v)};
const _wm48=worldMul;worldMul=function(){return _wm48.apply(this,arguments)*(typeof S!=='undefined'&&S?(1+.02*rt('cap')):1)};
const _mh48=monthHook11;monthHook11=function(){_mh48();try{if(!S||age()<6)return;if(rt('hl'))ad('health',.04*rt('hl'));if(rt('mn'))ad('mental',.04*rt('mn'));if(rt('fam')){ad('happy',.03*rt('fam'));for(const p of [S.spouse,S.partner].filter(Boolean))rel(p,.05*rt('fam'))}
 if(rt('rp')&&age()>=10)S.rp+=.04*rt('rp')*Math.max(.3,S.rpRate||.5);if(rt('tal')&&S.office)for(const t of (S.office.talents||[]))t.f=Math.round((t.f||0)*(1+.003*rt('tal')));if(rt('town')){const T=homeTown();if(T)T.bonus=(T.bonus||0)+.02*rt('town')}}catch(e){console.error(e)}};

// ----- おすすめ（いまの遊び方に合わせて） -----
function resCands(){const L=[];applyResCost();
 for(const r of RES){if(has(r.id))continue;const ok=!r.req||has(r.req),yr=r.year&&S.y<r.year;if(!ok||yr)continue;L.push({t:'r',id:r.id,n:r.n,d:r.d,c:r.c,cat:r.cat})}
 for(const t of RTRACK){if(!rtOk(t[0]))continue;L.push({t:'t',id:t[0],n:t[5][rt(t[0])],d:t[3]+`（${t[2]} ${rt(t[0])+1}段目）`,c:rtCost(t[0]),cat:t[1]})}return L}
function resScore(x){let s=0;const id=x.id,cos=(S.cos||[]).length,shops=S.town&&S.town.tiles.some(t=>SHOP[t.t]);
 if(x.cat==='sns'&&S.snsOpen)s+=3;if(['q','sg'].includes(id)&&S.snsOpen)s+=3;if(id==='mon'&&totalF()>=1e4)s+=2;if(id==='cap'&&S.world&&S.world.r.length)s+=4;
 if(x.cat==='biz'&&(cos||shops))s+=2;if(id==='co'&&cos)s+=4;if(id==='emp'&&cos&&S.cos.some(c=>c.emp&&c.emp.n>=coCap(c)*.9))s+=5;if(id==='shop'&&shops)s+=3;
 if((id==='megaC'||id==='megaT')&&(S.mega||[]).length)s+=3;if(id==='megaC'&&S.money>=1e11)s+=2;if(id==='pop'&&(S.mega||[]).some(m=>MEGA[m.k]&&MEGA[m.k].cat==='人口'))s+=4;
 if(id==='hl'&&S.p.health<60)s+=4;if(id==='mn'&&S.p.mental<60)s+=4;if(id==='fam'&&(S.kids||[]).length)s+=2;if(id==='rp')s+=1.5;if(id==='town'&&(S.role==='mayor'||allTowns().length>1))s+=2;
 if(x.cat==='town'&&allTowns().length>1)s+=1;if(x.cat==='life'&&age()>=50)s+=1;
 s+=x.c<=S.rp?3:-Math.min(3,(x.c-S.rp)/Math.max(10,x.c)*3);s-=x.c/2000;return s}
function resRec(n){return resCands().sort((a,b)=>resScore(b)-resScore(a)).slice(0,n)}
let RESCAT='rec',RESALL=0;
function resBtn(x){return x.t==='r'?`<button class="b sm ${S.rp>=x.c?'pri':''}" type="button" data-res="${x.id}" ${S.rp<x.c?'disabled':''}>研究する</button>`:`<button class="b sm ${S.rp>=x.c?'pri':''}" type="button" data-rtk="${x.id}" ${S.rp<x.c?'disabled':''}>研究する</button>`}
function resRow(x){return `<div class="rnode ${S.rp>=x.c?'ready':'lock'}"><div class="rb"><div>${esc(x.n)} <span class="muted small">${num(x.c)}pt</span></div><div class="muted small">${esc(x.d)}${S.rp<x.c?`（あと${num(Math.ceil(x.c-S.rp))}pt・${rpEta(x.c)}）`:''}</div></div>${resBtn(x)}</div>`}
function researchPanel(){applyResCost();const done=resDoneAll(),tot=resTotal();
 let h=`<div class="reshd"><div><b>研究ポイント ${num(Math.floor(S.rp))}</b><span class="muted small">（月に約${(S.rpRate||0).toFixed(1)}pt）</span></div><div class="muted small">完了 ${done} / ${tot}</div></div><div class="tbar"><i style="width:${(done/tot*100).toFixed(1)}%"></i></div>`;
 const tabs=[['rec','⭐ おすすめ'],...Object.entries(RT_CATN),['lv','ずっと続く']];
 h+=`<div class="seg wrapseg restabs">${tabs.map(([k,n])=>`<button type="button" class="${RESCAT===k?'on':''}" data-rescat="${k}">${n}</button>`).join('')}</div>`;
 if(RESCAT==='rec'){const L=resRec(5);h+=`<p class="hint">いまの遊び方に合わせて、効果が大きそうな研究を選んでいます。迷ったら上から順に。</p>`;h+=L.length?`<div class="rtree">${L.map(resRow).join('')}</div>`:'<p class="hint">いま研究できるものはありません。</p>';
  const cheap=resCands().filter(x=>x.c<=S.rp).length;h+=`<p class="hint">いますぐ研究できるもの：${cheap}件。分類のタブから全部見られます。</p>`;return h}
 if(RESCAT==='lv'){h+=`<p class="hint">研究ポイントが余ったら。何段でも重ねられる（20段まで）。</p><div class="rtree">${RLV.map(([k,n,d])=>`<div class="rnode ready"><div class="rb"><div>${n} <b>${rlv(k)}段</b> <span class="muted small">${rlvCost(k)}pt</span></div><div class="muted small">${d}</div></div><button class="b sm" type="button" data-rlv="${k}" ${S.rp<rlvCost(k)||rlv(k)>=20?'disabled':''}>研究する</button></div>`).join('')}</div>`;return h}
 // 研究ライン（1行に1ライン。次の段だけ表示）
 const tr=RTRACK.filter(t=>t[1]===RESCAT);if(tr.length){h+=`<h3>研究ライン</h3><div class="rtree">`;for(const t of tr){const L=rt(t[0]),mx=t[5].length,ok=!t[4]||has(t[4]),c=rtCost(t[0]);
  h+=`<div class="rnode ${L>=mx?'done':ok&&S.rp>=c?'ready':'lock'}"><div class="rb"><div>${esc(t[2])} <b>${L}/${mx}段</b>${L<mx?` <span class="muted small">次：${esc(t[5][L])}・${num(c)}pt</span>`:''}</div><div class="muted small">1段ごとに ${esc(t[3])}${!ok?`（先に「${esc((RES.find(x=>x.id===t[4])||{}).n||'')}」）`:''}</div><div class="tbar"><i style="width:${(L/mx*100).toFixed(0)}%"></i></div></div>${L>=mx?'<span class="chip up">完了</span>':ok?`<button class="b sm ${S.rp>=c?'pri':''}" type="button" data-rtk="${t[0]}" ${S.rp<c?'disabled':''}>研究する</button>`:''}</div>`}h+='</div>'}
 // ひとつずつの研究（ふだんは研究できるものだけ）
 const list=RES.filter(r=>r.cat===RESCAT);if(list.length){const av=list.filter(r=>!has(r.id)&&(!r.req||has(r.req))&&!(r.year&&S.y<r.year)),dn=list.filter(r=>has(r.id)).length;
  h+=`<h3>ひとつずつの研究 <span class="muted small">${dn}/${list.length}</span></h3>`;
  const show=RESALL?list:av;h+=show.length?`<div class="rtree">${show.map(r=>{const d=has(r.id),ok=!r.req||has(r.req),yr=r.year&&S.y<r.year;return `<div class="rnode ${d?'done':ok&&!yr?'ready':'lock'}"><div class="rb"><div>${d?'✓ ':''}${esc(r.n)} <span class="muted small">${r.c}pt</span></div><div class="muted small">${esc(r.d)}${!ok?`（先に「${esc((RES.find(x=>x.id===r.req)||{}).n||'')}」）`:''}${yr?`（${r.year}年から）`:''}</div></div>${d?'<span class="chip up">完了</span>':ok&&!yr?`<button class="b sm" type="button" data-res="${r.id}" ${S.rp<r.c?'disabled':''}>研究する</button>`:''}</div>`}).join('')}</div>`:'<p class="hint">この分類で、いま研究できるものはありません。</p>';
  h+=`<div class="row"><button class="b sm ghost" type="button" data-resall="1">${RESALL?'研究できるものだけ表示':'完了・まだ先のものも表示'}</button></div>`}
 return h}
document.addEventListener('click',e=>{const b=e.target.closest('[data-rescat],[data-resall],[data-rtk]');if(!b||!S)return;const d=b.dataset;if(d.rescat){RESCAT=d.rescat;renderPanel();return}if(d.resall){RESALL=RESALL?0:1;renderPanel();return}if(d.rtk)rtBuy(d.rtk)});
// 研究のバッジ：研究ラインも数える
const _rr48=researchReady;researchReady=function(){try{if(_rr48.apply(this,arguments))return true;return RTRACK.some(t=>rtOk(t[0])&&S.rp>=rtCost(t[0]))}catch(_){return false}};
(function(){if(typeof ACH_TABS!=='undefined'&&!ACH_TABS.includes('研究'))ACH_TABS.splice(ACH_TABS.length-1,0,'研究');const A=(id,n,d,f)=>{ACH.push([id,n,d,f]);if(typeof ACH_CAT!=='undefined')ACH_CAT[id]='研究'};
 A('rt50','研究者','研究を合わせて100個完了する',()=>resDoneAll()>=100);A('rt200','大研究者','研究を合わせて200個完了する',()=>resDoneAll()>=200);
 ACH.push(['x_rt_all','？','（ひみつ）',()=>resDoneAll()>=resTotal(),1,'森羅万象','すべての研究を完了する','研究']);if(typeof ACH_CAT!=='undefined')ACH_CAT.x_rt_all='研究'})();
