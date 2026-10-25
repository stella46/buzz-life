
// ===== v2.9.4：引き継ぎポイントを、人生の途中でももらえるように =====
// 節目（年齢・フォロワー・資産・研究・目標・市長）と、実績の解除ごとに、その場でポイントがもらえる。
// 人生の終わりには、まだもらっていない分だけを受け取る（二重にはもらえない）。
function achN(){try{return Object.keys(META.ach||{}).length}catch(_){return 0}}
function lpDueNow(){if(S.achBase==null)S.achBase=achN();return lpOfLife()+Math.max(0,achN()-S.achBase)}
function lpMidPay(){if(!S||!S.alive||age()<6)return;legState();try{recUpdate()}catch(_){}const due=lpDueNow()-(S.lpPaid||0);if(due<=0)return;
 META.leg.lp+=due;S.lpPaid=(S.lpPaid||0)+due;saveMeta();log(`人生の節目で、引き継ぎポイントを ${due} もらった（いま ${META.leg.lp}）`,'good');
 S.lpPend=(S.lpPend||0)+due;if(S.lpPopAm==null||S.am-S.lpPopAm>=12||S.lpPend>=5){const g=S.lpPend;S.lpPend=0;S.lpPopAm=S.am;try{popBig('🌱 引き継ぎポイント +'+g,'人生の節目や実績でもらいました',`「人生」→「スキル」の「引き継ぎスキル」で使えます（いま ${META.leg.lp}）`)}catch(_){}}}
{const _mh61=monthHook11;monthHook11=function(){_mh61();try{lpMidPay()}catch(e){console.error(e)}}}
// 人生の終わり：まだもらっていない分だけ（表示は、この人生でもらった合計）
lifeEndLegacy=function(){legState();try{recUpdate()}catch(_){}const tot=S?lpDueNow():lpOfLife();const rest=Math.max(0,tot-((S&&S.lpPaid)||0));META.leg.lp+=rest;if(S){S.lpPaid=(S.lpPaid||0)+rest;S.lpGain=S.lpPaid;S.lpLast=rest}};
// 最初の引き継ぎスキルは、1回目の人生の途中（20歳）からでも覚えられるように
(function(){const g1=LEG.find(x=>x.id==='g1');if(g1){g1.cond='20歳になる（または人生を1回終える）';g1.ok=r=>(META.lives||0)>=1||!!(r&&r.age20)}})();
{const _ru61=recUpdate;recUpdate=function(){const r=_ru61.apply(this,arguments);try{if(S&&age()>=20&&!META.rec.age20){META.rec.age20=1;saveMeta()}}catch(_){}return r}}
// 説明文
{const _lh61=legHtml;legHtml=function(){return _lh61.apply(this,arguments).replace('人生を終えるたびに、その人生の成果に応じてもらえる。','人生の節目（年齢・フォロワー・資産・研究・目標など）や実績の解除で、遊んでいる途中でももらえます。覚えたスキルは、いまの人生にもすぐに効き、これから生まれるすべての人生でも有効です。')}}
// ゲームの中からも使えるように：「人生」→「スキル」に入口
{const _pl61=panelLife;panelLife=function(){const h=_pl61.apply(this,arguments);try{if(SUB.life==='skill'){const L=legState();const can=LEG.filter(x=>!L.nodes[x.id]&&(!x.req||L.nodes[x.req])&&x.ok(META.rec)&&L.lp>=x.c).length;
 return h+`<div class="card legcard"><div class="hd"><span>🌱 引き継ぎスキル</span><b>${L.lp} ポイント</b></div><p class="hint">すべての人生で有効なスキルです。人生の節目や実績の解除で、途中でもポイントがもらえます。${can?`<b>いま ${can}つ覚えられます。</b>`:''}</p><div class="row"><button class="b sm ${can?'pri':''}" type="button" data-act="legacy">引き継ぎスキルを見る</button></div></div>`}}catch(e){console.error(e)}return h}}
{const _st61=secTip;secTip=function(){try{if(S&&age()>=6&&!S.flags.legTold){const L=legState();const can=LEG.filter(x=>!L.nodes[x.id]&&(!x.req||L.nodes[x.req])&&x.ok(META.rec)&&L.lp>=x.c);if(can.length){S.flags.legTold=S.am;return [`引き継ぎスキル「${can[0].n}」を覚えられます（${can[0].d}）`,'life:skill']}}}catch(_){}return _st61.apply(this,arguments)}}
(function(){const g=GUIDE.find(x=>x[0]==='skill');if(g)g[2]=g[2].replace('・引き継ぎスキル：人生を終えるとたまるポイントで覚える、すべての人生で有効なスキルです（タイトルの「実績・引き継ぎスキル」）。','・引き継ぎスキル：人生の節目や実績の解除でたまるポイントで覚える、すべての人生で有効なスキルです。遊んでいる途中でももらえて、すぐに効きます（「人生」→「スキル」、またはタイトルの「実績・引き継ぎスキル」）。')})();
try{const f=FIND.find(x=>x[0]==='引き継ぎスキル');if(f){f[1]='人生 → スキル／タイトル';f[2]='life:skill';f[3]='人生の節目や実績でたまるポイントで覚える、すべての人生で有効なスキル'}}catch(_){}
