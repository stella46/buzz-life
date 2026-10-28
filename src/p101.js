
// ===== v3.6.1：軽量は現実ベース（数字は現実の統計に合わせる・未来の空想はなし・出来事は現実にありそうなものだけ） =====
// 参考：給与＝国税庁「民間給与実態統計調査」（令和6年分：平均478万円）、生活費＝総務省「全国家計構造調査」（2024年：単身の消費支出 月約17.6万円）、
//      家計調査（二人以上世帯 月約30万円）、広告収入＝UUUM決算（1再生 約0.29円）、平均寿命＝厚労省「令和6年簡易生命表」（男81.09歳・女87.13歳）
// ----- 税金と社会保険：働いて得たお金の約2割 -----
{const _inc101=inc;inc=function(cat,v){const r=_inc101.apply(this,arguments);try{if(isLite2()&&v>0&&age()>=18){const t=({job:.2,part:.12,sns:.2,fanclub:.2,tip:.2,deal:.2,biz:.25,side:.15})[cat];if(t)outc('tax',Math.round(v*t))}}catch(_){}return r}}
// ----- 生活費：ひとり暮らし 月約17.6万円、夫婦 月約26万円、子ども1人あたり 月約3.5万円（22歳まで）。国の物価で変わる -----
function lite2Living(){const kids=(S.kids||[]).filter(k=>k._gkOf==null&&(S.am-k.born)/12<22).length;let v=S.spouse?260000:176000;v+=kids*35000;if(age()>=65)v*=.85;return Math.round(v*Math.max(.15,S.cty.inc)*(S.priceIdx||1))}
let L2CHG=0;{const _oc101=outc;outc=function(c,v){try{if(isLite2()&&!L2CHG&&v>0&&['home','phone','subs','date','shop','ev'].includes(c))S.l2home=(S.l2home||0)+v}catch(_){}return _oc101.apply(this,arguments)}}
// 収入がふえると、暮らしも少しずつぜいたくになる（手取りのうち基本の生活費をこえた分の半分くらいを使う）
{const _inc101c=inc;inc=function(cat,v){const r=_inc101c.apply(this,arguments);try{if(isLite2()&&v>0&&['job','part','sns','fanclub','tip','deal','biz','side','pension'].includes(cat))S.l2in=(S.l2in||0)+v}catch(_){}return r}}
{const _mh101=monthHook11;monthHook11=function(){const r=_mh101.apply(this,arguments);try{if(isLite2()&&S.alive){const inm=S.l2in||0;S.l2in=0;if(age()>=18&&(S.home||1)!==0){const base=lite2Living();const net=inm*.8;let use=base;if(net>base)use=base+Math.pow(net-base,.92)*.5;const need=Math.round(use)-(S.l2home||0);if(need>0){L2CHG=1;try{outc('home',need)}finally{L2CHG=0}S.lvPaid=need}}S.l2home=0}}catch(e){console.error(e)}return r}}
// ----- 広告収入：1再生 約0.2円（ショート動画は低め） -----
{const _inc101b=inc;inc=function(cat,v){if(isLite2()&&cat==='sns'&&v>0)v=Math.round(v*1.6);return _inc101b.call(this,cat,v)}}
// ----- フォロワー：登録者100万人以上は、ほんのひとにぎり -----
LITE2_GROW=.08;
// ----- 未来の空想はなし -----
// 未来のSNS（立体映像の配信など）は出ない
for(const k of Object.keys(SNS)){const s=SNS[k];if(!(s.era>2026))continue;const e0=s.era;Object.defineProperty(s,'era',{get(){return isLite2()?99999:e0},set(v){},configurable:true,enumerable:true})}
// 未来の世の中の流れ（空飛ぶ車・火星の町など）は出ない
for(const h of (typeof HIST!=='undefined'?HIST:[])){if(!/^【未来】/.test(h.t||''))continue;const s0=h.s;Object.defineProperty(h,'s',{get(){return isLite2()?'none':s0},set(v){},configurable:true,enumerable:true})}
// 現実にない出来事は出ない
const LITE2_FANTASY=/宇宙(旅行|ホテル|飛行士|ゴミ|の観光|からの|の発見)|火星|月面|空飛ぶ|テレポ|ホログラム|仮想の国|仮想旅行|人型ロボット|ロボットの店員|AIの友|自動運転|宇宙人|ホロステージ|立体映像/;
function evFantasy(e){try{let tx='';try{tx=typeof e.text==='function'?e.text():(e.text||'')}catch(_){}return LITE2_FANTASY.test((e.t||'')+tx)}catch(_){return false}}
{const _re101=rollEvent;rollEvent=function(){const e=_re101.apply(this,arguments);if(isLite2()&&e&&evFantasy(e))return null;return e}}
// ----- はじめるときの選択：未来の時代・架空の大陸・事業の目標は出さない -----
document.addEventListener('click',e=>{const b=e.target.closest('[data-sm="new"]');if(!b||LITE_PICK!==2)return;setTimeout(()=>{try{const m=$('#mcard');if(!m)return;
 m.querySelectorAll('button,option').forEach(x=>{const t=(x.textContent||'').trim();if(/^(未来（|架空の大陸|市長になる|評価★4のお店|まちの発展度|自社ビル)/.test(t)&&!x.selected&&!x.classList.contains('on')&&x.getAttribute('aria-pressed')!=='true')x.remove()})}catch(_){}},60)});
(function(){const g=GUIDE.find(x=>x[0]==='lite');if(g&&!/現実の統計/.test(g[2]))g[2]=g[2].replace('数字は現実くらいの大きさです。','数字は現実の統計をもとにしています（給料・生活費・税金・広告収入・寿命など）。未来の空想の出来事は起きません。')})();
