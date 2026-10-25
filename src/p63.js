
// ===== v2.9.6：引き継ぎスキルの解放条件を、1回の人生で届くものに =====
// 2周目をする人は少ないので、1回目の人生の中で条件を満たせるように。昔の条件を満たしていても解放されます。
const LEG_COND={g1:['10歳になる',()=>age()>=10],g2:['研究を10個完了する',()=>resDoneAll()>=10],g3:['スキルを3つ覚える',()=>Object.keys(S.skt||{}).filter(k=>S.skt[k]).length>=3],
 g4:['50歳まで生きる',()=>age()>=50],g5:['フォロワー10万人',()=>S.stats.maxF>=1e5],g6:['資産1億円',()=>S.stats.maxM>=1e8],g7:['まちの発展度30（またはお店を3軒）',()=>allTowns().some(T=>(T.dev||0)>=30)||allTowns().reduce((n,T)=>n+(T.tiles||[]).filter(t=>SHOP[t.t]).length,0)>=3],
 g8:['子どもが生まれる',()=>(S.kids||[]).length>=1],g9:['子どもを2人育てる',()=>(S.kids||[]).length>=2],g10:['研究を30個完了する',()=>resDoneAll()>=30],g11:['人生の目標を1回達成する',()=>!!S.goalDone],g12:['実績を25個解除する',()=>achN()>=25]};
for(const x of LEG){const c=LEG_COND[x.id];if(!c)continue;const ok0=x.ok;x.cond=c[0];x.ok=r=>!!(r&&r['c_'+x.id])||(()=>{try{return ok0(r)}catch(_){return false}})()}
{const _ru63=recUpdate;recUpdate=function(){const r=_ru63.apply(this,arguments);try{if(S){legState();let ch=false;for(const [id,[,f]] of Object.entries(LEG_COND)){if(META.rec['c_'+id])continue;let ok=false;try{ok=f()}catch(_){}if(ok){META.rec['c_'+id]=1;ch=true}}if(ch)saveMeta()}}catch(e){console.error(e)}return r}}

// ===== v2.9.6：バランス調整 =====
// お店のもうけを1/4にしたのに、店長の給料はそのままだったため、小さなお店が赤字になっていた → 店長の給料も同じ割合に
{const _bill63=bill;bill=function(cat,n,amt){if(cat==='staff'&&n==='店長の給料')amt=amt*SHOP_MUL;return _bill63.call(this,cat,n,amt)}}
// 出来事での大きな出費は、持っているお金に合わせる（宇宙旅行などで、いきなり何千万円もの借金にならないように）
{const _ad63=ad;ad=function(k,v,cat){try{if(k==='money'&&v<0&&!cat&&typeof curEv!=='undefined'&&curEv&&S&&age()>=18){const inc=S.cty?S.cty.inc:1;const cost=-v*inc;const cap=Math.max(S.money*.8,500000*Math.max(.2,inc));if(cost>cap){v=-cap/inc;S._evCap=1}}}catch(_){}return _ad63.call(this,k,v,cat)}}
// 同じまちにお店が多すぎると、お客さんを取り合う（9軒目から少しずつ）
{const _ssm63=shopSegMul;shopSegMul=function(i){let m=_ssm63.apply(this,arguments);try{const n=S.town.tiles.filter(t=>SHOP[t.t]).length;if(n>8)m*=Math.pow(8/n,.6)}catch(_){}return m}}
