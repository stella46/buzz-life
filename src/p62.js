
// ===== v2.9.5：これまでの実績の分も引き継ぎポイントに・プレイ時間の記録をコンパクトに・昔の版（v2.1〜v2.8）を追加 =====

// ----- 実績のポイントは、全人生まとめて1回ずつ（これまでに解除した実績の分も受け取れる） -----
function achPayAll(quiet){legState();
 if(META.leg.achPaid==null){META.leg.achPaid=0}
 const n=achN()-META.leg.achPaid;if(n<=0)return 0;META.leg.lp+=n;META.leg.achPaid+=n;saveMeta();
 if(S&&S.alive)log(`実績 ${n}個 の分、引き継ぎポイントを ${n} もらった（いま ${META.leg.lp}）`,'good');
 if(!quiet){try{popBig('🌱 引き継ぎポイント +'+n,`実績 ${n}個 の分をもらいました`,`いま ${META.leg.lp} ポイント`)}catch(_){}}return n}
// 人生の節目の分（年齢・フォロワーなど）は、これまでどおり人生ごと。実績の分はここから外す
lpDueNow=function(){return lpOfLife()};
{const _mp62=lpMidPay;lpMidPay=function(){if(!S||!S.alive)return;
 // v2.9.4 で、この人生の実績の分を人生ごとに受け取っていた場合は、二重にならないように調整
 if(S.achBase!=null&&!S.achMig){S.achMig=1;legState();const k=Math.max(0,(S.lpPaid||0)-lpOfLife());if(k>0){S.lpPaid-=k;if(META.leg.achPaid==null)META.leg.achPaid=0;META.leg.achPaid+=Math.min(k,Math.max(0,achN()-META.leg.achPaid))}}
 achPayAll(true);return _mp62.apply(this,arguments)}}
{const _le62=lifeEndLegacy;lifeEndLegacy=function(){try{achPayAll(true)}catch(_){}return _le62.apply(this,arguments)}}
// ページを開いたとき：これまでの実績の分をまとめて受け取る
setTimeout(()=>{try{if(META.leg&&META.leg.achPaid!=null)return;legState();const n=achPayAll(true);if(n>0){toast(`これまでに解除した実績 ${n}個 の分、引き継ぎポイント +${n}`);try{popBig('🌱 引き継ぎポイント +'+n,`これまでに解除した実績 ${n}個 の分`,'「実績・引き継ぎスキル」で使えます')}catch(_){}}}catch(e){console.error(e)}},1200);
{const _lh62=legHtml;legHtml=function(){return _lh62.apply(this,arguments).replace('人生の節目（年齢・フォロワー・資産・研究・目標など）や実績の解除で、遊んでいる途中でももらえます。','人生の節目（年齢・フォロワー・資産・研究・目標など）で、遊んでいる途中でももらえます。実績は1つ解除するごとに1ポイント（これまでに解除した実績の分ももらえます）。')}}

// ----- プレイ時間の記録をコンパクトに -----
playHtml=function(){const vm=(META.verMs)||{};const inG=S&&!$('#scrGame').hidden;
 const tile=(l,ms)=>`<div class="ptile"><span>${l}</span><b>${fmtDur(ms||0)}</b></div>`;
 let h=`<div class="ptiles">${tile('サイト全体',META.playMs)}${inG?tile(esc(slotName(SLOT)),S.playMs)+tile('この人生',S.lifeMs):''}</div>`;
 const grp={};for(const [v,ms] of Object.entries(vm)){const g=(v.match(/^v\d+\.\d+/)||[v])[0];grp[g]=(grp[g]||0)+ms}
 const gl=Object.entries(grp).sort((a,b)=>{const p=s=>s.slice(1).split('.').map(Number);const x=p(a[0]),y=p(b[0]);return y[0]-x[0]||y[1]-x[1]});
 h+=`<h3>版ごとのプレイ時間</h3>${gl.length?`<table class="ptab">${gl.slice(0,6).map(([g,ms])=>`<tr><td>${esc(g)}</td><td>${fmtDur(ms)}</td></tr>`).join('')}</table>`:'<p class="hint">まだありません。</p>'}`;
 if(gl.length>6||Object.keys(vm).length>gl.length)h+=`<details class="pmore"><summary>細かい版ごとに見る（${Object.keys(vm).length}件）</summary><table class="ptab">${Object.entries(vm).sort((a,b)=>b[1]-a[1]).map(([v,ms])=>`<tr><td>${esc(v)}</td><td>${fmtDur(ms)}</td><td><button class="b sm ghost" type="button" data-preset="v:${esc(v)}" aria-label="${esc(v)}を0にする">↺</button></td></tr>`).join('')}</table></details>`;
 h+=`<details class="pmore"><summary>プレイ時間を0にする</summary><div class="row"><button class="b sm" type="button" data-preset="site">サイト全体</button>${inG?'<button class="b sm" type="button" data-preset="save">このセーブ</button><button class="b sm" type="button" data-preset="life">この人生</button>':''}</div><p class="hint">ほかのスロットは「セーブスロット」の画面から0にできます。</p></details><div id="presetBox"></div>`;
 return h};

// ----- 昔の版で遊ぶ：v2.1〜v2.8 を追加 -----
[['v2.1','versions/v2.1/','世界進出・ランキング・ライバル企業・つながりが加わった版（画像のタイトルロゴ）'],['v2.2.1','versions/v2.2/','予定の決め方（いつもの予定・割合）が加わった版'],['v2.3','versions/v2.3/','人生の終わりのモードを途中で切りかえられるようになった版'],
 ['v2.4','versions/v2.4/','研究約300・大計画213・とんでもなく高額なアクションが加わった版'],['v2.5','versions/v2.5/','推定プレイ時間・家族への返済・人生の終わりの選択が加わった版'],['v2.6','versions/v2.6/','年齢に合った出来事・まるごとおまかせ・秘書・さがすが加わった版'],
 ['v2.7.1','versions/v2.7/','研究ポイント3倍・人生の道のりが加わった版'],['v2.8.2','versions/v2.8/','遊び方の更新・データの移動・感想と不具合の報告が加わった版']].forEach(v=>{if(!OLD_VERS.some(o=>o[1]===v[1]))OLD_VERS.unshift(v)});
{const i=OLD_VERS.findIndex(o=>o[0]==='v2.9');if(i>0){const [x]=OLD_VERS.splice(i,1);OLD_VERS.unshift(x)}}
