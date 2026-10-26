
// ===== v3.0.20：契約・サブスクをアップグレード方式に／スキルは自動で覚える =====
// 同じ効果のものを1本の「コース」にまとめ、段階を上げていく（とんでもなく高いものはなし：月100万円以上）
const SUB_TR=[
 ['発信','edit','動画編集',['editsoft','sozai','aiedit','gearrent']],
 ['発信','reach','分析と海外向け',['analytics','subtitle']],
 ['学び','know','知識',['magazine','paper','univon','bizsem']],
 ['学び','lang','語学',['eikaiwa']],
 ['学び','prog','プログラミング',['prog']],
 ['健康','body','体の健康',['sleep','gymsub','meal','massage']],
 ['健康','mind','心の健康',['yoga','counsel']],
 ['健康','ins','医療保険',['insurance']],
 ['暮らし','fun','楽しみ',['music','video','manga','gamesub']],
 ['暮らし','home','暮らしの便利',['coffee','flower','kaden','shokuzai','carshare']],
 ['暮らし','look','見た目',['fukurent','stylist']],
 ['暮らし','lux','ぜいたく',['chef']],
 ['お金','money','お金の管理',['kakeibo','invstudy','zeirishi']],
 ['素質','t_game','ゲーム実況の素質',['t_game1','t_game2','t2_game','t3_game']],
 ['素質','t_cook','料理の素質',['cookcl','t_cook1','t2_cook','t3_cook']],
 ['素質','t_beauty','美容の素質',['t_beauty1','t_beauty2','t2_beauty','t3_beauty']],
 ['素質','t_talk','雑談の素質',['t_talk1','t_talk2','t2_talk','t3_talk']],
 ['素質','t_study','勉強・解説の素質',['t_study1','t_study2','t2_study','t3_study']],
 ['素質','t_music','歌・音楽の素質',['bgmlib','voice','t_music1','t2_music','t3_music']],
 ['素質','t_comedy','お笑いの素質',['t_comedy1','t_comedy2','t2_comedy','t3_comedy']],
 ['素質','t_vlog','Vlogの素質',['photo','t_vlog1','t2_vlog','t3_vlog']],
 ['素質','t_all','いろいろな素質',['t_all1','t_all2','t_ai','t_pro']],
 ['ふしぎ','odd','ちょっとふしぎ',['stone','mystery','homeru','penguin']]
].map(([c,id,n,ks])=>[c,id,n,ks.filter(k=>SUBS[k]&&SUBS[k].p<1e6)]).filter(t=>t[3].length);
function trCur(t){let c=-1;t[3].forEach((k,i)=>{if(S.subs&&S.subs[k])c=i});return c}
function trOk(k){const s=SUBS[k];if(!s)return false;if(s.age&&age()<s.age)return false;if(s.yr&&S.y<s.yr)return false;try{if(k.startsWith('t3_')&&(S.tal[k.slice(3)]||0)<80)return false}catch(_){}return true}
function subPrice(k){return Math.round(SUBS[k].p*Math.max(.3,S.cty.inc))}
let SUBTR_CAT='発信';
subsListHtml=function(){const cats=[...new Set(SUB_TR.map(t=>t[0]))];const on=SUB_TR.filter(t=>trCur(t)>=0).length;
 let h=`<p class="hint">同じ効果のものは1つのコースにまとめています。段階を上げるほど効果が大きくなります（毎月の請求書に入ります。いつでもやめられます）。いま契約中：${on}コース。</p><div class="seg wrapseg">${cats.map(c=>`<button type="button" class="${SUBTR_CAT===c?'on':''}" data-strc="${c}">${c}</button>`).join('')}</div><div>`;
 for(const t of SUB_TR.filter(x=>x[0]===SUBTR_CAT)){const ci=trCur(t),cur=ci>=0?t[3][ci]:null,nx=t[3][ci+1];const nxOk=nx&&trOk(nx);
  h+=`<div class="shop"><div><div><b>${esc(t[2])}</b> <span class="chip">${ci>=0?`${ci+1}/${t[3].length}段`:'未契約'}</span></div>`+
   (cur?`<div class="muted small">いま：${esc(SUBS[cur].n)}（月${yen(subPrice(cur))}）・${esc(SUBS[cur].d)}</div>`:'')+
   (nx?`<div class="muted small">${ci>=0?'次':'はじめ'}：${esc(SUBS[nx].n)}（月${yen(subPrice(nx))}）・${esc(SUBS[nx].d)}${nxOk?'':`（${SUBS[nx].age&&age()<SUBS[nx].age?SUBS[nx].age+'歳から':'まだ選べません'}）`}</div>`:'<div class="muted small">いちばん上の段です</div>')+
   `</div><div class="row">${nx?`<button class="b sm ${ci<0?'':'pri'}" type="button" data-stup="${t[1]}" ${nxOk?'':'disabled'}>${ci<0?'契約する':'アップグレード'}</button>`:''}${cur?`<button class="b sm ghost" type="button" data-stoff="${t[1]}">やめる</button>`:''}</div></div>`}
 return h+'</div>'};
document.addEventListener('click',e=>{const b=e.target.closest('[data-strc],[data-stup],[data-stoff]');if(!b||!S)return;
 if(b.dataset.strc){SUBTR_CAT=b.dataset.strc;renderPanel();return}
 const t=SUB_TR.find(x=>x[1]===(b.dataset.stup||b.dataset.stoff));if(!t)return;const ci=trCur(t);
 for(const k of t[3])if(S.subs[k])S.subs[k]=0;
 if(b.dataset.stup){const nx=t[3][ci+1];if(nx&&trOk(nx)){S.subs[nx]=1;log(`${t[2]}：「${SUBS[nx].n}」を契約した`,'life')}}
 else log(`${t[2]}の契約をやめた`,'life');save();renderPanel()});
// 古いセーブ：同じコースで2つ以上契約していたら、いちばん上の段だけ残す／とんでもなく高いものは解約
{const _mh92=monthHook11;monthHook11=function(){try{if(S&&S.subs){for(const t of SUB_TR){const ci=trCur(t);t[3].forEach((k,i)=>{if(i!==ci&&S.subs[k])S.subs[k]=0})}for(const k in S.subs)if(S.subs[k]&&SUBS[k]&&SUBS[k].p>=1e6){S.subs[k]=0;log(`「${SUBS[k].n}」の契約は終わった`,'life')}}}catch(_){}return _mh92.apply(this,arguments)}}
// おまかせ（お金）の契約も、コース単位で
{const _ob92=omkBuyAll;omkBuyAll=function(){const r=_ob92.apply(this,arguments);try{if(!S||!omk('money')||age()<18||S.m%3)return r;const on=SUB_TR.filter(t=>trCur(t)>=0).length;
 const L=SUB_TR.filter(t=>!['ふしぎ'].includes(t[0])).map(t=>[t,trCur(t)]).filter(([t,ci])=>t[3][ci+1]&&trOk(t[3][ci+1])).sort((a,b)=>subPrice(a[0][3][a[1]+1])-subPrice(b[0][3][b[1]+1]));
 for(const [t,ci] of L){const nx=t[3][ci+1];if(ci<0&&on>=8)continue;if(S.money>=subPrice(nx)*240){for(const k of t[3])S.subs[k]=0;S.subs[nx]=1;log(`おまかせ：${t[2]}「${SUBS[nx].n}」`,'life');break}}}catch(e){console.error(e)}return r}}

// ----- スキル：通常も軽量も、自動で覚える -----
{const _mh92b=monthHook11;monthHook11=function(){try{if(S){S.omk=S.omk||{};S.omk.skill=1}}catch(_){}return _mh92b.apply(this,arguments)}}
{const _rp92=researchPanel;researchPanel=function(){if(RESCAT==='skill')RESCAT='rec';let h=_rp92.apply(this,arguments);return h.replace(/<button type="button" class="[^"]*" data-rescat="skill">[\s\S]*?<\/button>/,'')}}
document.addEventListener('click',e=>{const b=e.target.closest('[data-goto="life:skill"]');if(b){b.dataset.goto='life:stat'}},true);
{const _pl92=panelLife;panelLife=function(){let h=_pl92.apply(this,arguments);try{if(SUB.life==='stat'){const n=Object.keys(S.skills||S.sk2||{}).length;h=h.replace(/<button class="b sm" type="button" data-goto="life:skill">[^<]*<\/button>/,'');h+=`<div class="card"><div class="hd"><span>🌱 この人生のスキル（自動）</span></div><p class="hint">スキルポイントがたまると、自動で覚えます。</p>${typeof sktHtml==='function'?`<details class="pmore"><summary>覚えたスキルを見る</summary>${sktHtml().replace(/data-skt=/g,'disabled data-sktx=').replace(/<p class="hint">スキルポイント[\s\S]*?<\/p>/,'')}</details>`:''}</div>`}}catch(e){console.error(e)}return h}}
(function(){for(const x of GUIDE)x[2]=x[2].replace('・スキル：この人生だけのスキルです。「事業」→「研究」の「🌱 スキル」で覚えます。','・スキル：この人生だけのスキルです。スキルポイントがたまると自動で覚えます（「人生」→「自分」で見られます）。').replace('この人生のスキルも「🌱 スキル」でここから覚えます。','')})();
