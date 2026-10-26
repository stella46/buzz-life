
// ===== v3.0.20：軽量モードの中身（同じ遊びを、かんたんに） =====
// 予定の決め方は「バランスよく全部」だけ
{const _pm93=pmode;pmode=function(){if(isLite()){S.pmode='bal';return 'bal'}return _pm93.apply(this,arguments)}}
{const _pp93=panelPlan;panelPlan=function(){let h=_pp93.apply(this,arguments);if(isLite())h=h.replace(/<div class="pmsw">[\s\S]*?<p class="hint">予定の決め方：[^<]*<\/p><\/div>/,'');return h}}
// 出来事は少なめ（よくある出来事の半分くらい）
{const _re93=rollEvent;rollEvent=function(k){const e=_re93.apply(this,arguments);if(isLite()&&e&&e.w>0&&e.w<1&&chance(.5))return null;return e}}
// 事業はかんたんに：店長・社員・作るもの・事務所のスタッフは自動
{const _mh93=monthHook11;monthHook11=function(){try{if(isLite()&&age()>=18){S.omk=S.omk||{};S.omk.shop=1;for(const c of (S.cos||[])){try{coInit(c);c.emp.auto=1;if(c.pmode==='manual')c.pmode='auto'}catch(_){}}
 const o=S.office;if(o&&o.lv){const ks=Object.keys(STAFF);while(staffTotal()<OFFICE[o.lv].staff){const k=ks.sort((x,y)=>stN(x)-stN(y))[0];if(S.money<STAFF[k].sal*S.cty.inc*24)break;o.staff[k]++}}}}catch(e){console.error(e)}return _mh93.apply(this,arguments)}}
const LITE_TIP={town:'空き地を選んで、建物やお店を建てましょう。建てたお店は店長が自動で切り盛りします。',shop:'お店は店長が自動で切り盛りします。見ておくだけでOKです。',co:'会社を作ったら、「大きくする」だけでOK。社員と作るものは自動で決まります。',office:'事務所を作って、タレントを探しましょう。スタッフは自動で雇います。',svc:'サービスを始めると、毎月利用者がふえていきます。',aw:'条件を満たすと、自動でノミネートされます。',mega:'お金がたまったら、大計画を始めましょう（全部で10個）。',res:'研究ポイントがたまったら、分野ごとに「まとめて研究する」を押しましょう。'};
{const _pb93=panelBiz;panelBiz=function(){let h=_pb93.apply(this,arguments);try{if(!isLite())return h;const t=LITE_TIP[SUB.biz];if(!t)return h;const card=`<div class="card litetip"><b>かんたんモード</b><p class="hint">${t}</p></div>`;
 const m=h.match(/<div class="subtabs sub2"[\s\S]*?<\/div>|<div class="subtabs sgrp"[\s\S]*?<\/div>/g);if(m){const last=m[m.length-1];const i=h.indexOf(last)+last.length;return h.slice(0,i)+card+h.slice(i)}return card+h}catch(_){return h}}}
// 会社の画面：「概要」と「作るもの」だけ
{const _sc93=showCo;showCo=function(id,tab){if(isLite()&&(tab==='emp'||tab==='off'||CM_TAB==='emp'||CM_TAB==='off'))CM_TAB='sum';const r=_sc93.call(this,id,isLite()&&(tab==='emp'||tab==='off')?'sum':tab);try{if(isLite())document.querySelectorAll('#mcard [data-cmtab="emp"],#mcard [data-cmtab="off"]').forEach(b=>b.remove())}catch(_){}return r}}
// 大計画は10個
const LITE_MEGA=['sattnet','debris','station','spacehotel','moonbase','mooncity','mars','elevator','probe','spacelive'];
{const _ms93=megaStart;megaStart=function(k){if(isLite()&&!LITE_MEGA.includes(k))return;return _ms93.apply(this,arguments)}}
{const _mh93b=megaHtml;megaHtml=function(){let h=_mh93b.apply(this,arguments);if(!isLite())return h;try{const names=new Set(LITE_MEGA.map(k=>MEGA[k]&&MEGA[k].n));const d=document.createElement('div');d.innerHTML=h;
 d.querySelectorAll('.shop').forEach(r=>{const t=(r.querySelector('div>div')||r).textContent;let ok=false;for(const n of names)if(n&&t.indexOf(n)===0){ok=true;break}if(!ok)r.remove()});
 d.querySelectorAll('details').forEach(x=>{if(!x.querySelector('.shop'))x.remove()});const dn=LITE_MEGA.filter(k=>megaDone(k)).length;return `<p class="hint">軽量モードの大計画：${dn} / 10 完成</p>`+d.innerHTML}catch(e){console.error(e);return h}}}
// 賞は5つ
const LITE_AW=['creator','rookie','ceo','townaw','social'];
{const _aw93=awMonth;awMonth=function(){if(!isLite())return _aw93.apply(this,arguments);const keep=AWARDS.slice();const L=AWARDS.filter(a=>LITE_AW.includes(a.k));AWARDS.length=0;AWARDS.push(...L);try{return _aw93.apply(this,arguments)}finally{AWARDS.length=0;AWARDS.push(...keep)}}}
{const _ah93=awHtml;awHtml=function(){if(!isLite())return _ah93.apply(this,arguments);const keep=AWARDS.slice();const L=AWARDS.filter(a=>LITE_AW.includes(a.k));AWARDS.length=0;AWARDS.push(...L);try{return _ah93.apply(this,arguments)}finally{AWARDS.length=0;AWARDS.push(...keep)}}}
// 研究は、分野ごとに「まとめて研究する」
function liteResList(cat){return RES.filter(r=>r.cat===cat&&!has(r.id)&&(!r.req||has(r.req))&&!(r.year&&S.y<r.year))}
function liteResPack(cat){const L=liteResList(cat).sort((a,b)=>a.c-b.c).slice(0,6);const T=RTRACK.filter(t=>t[1]===cat&&rtOk(t[0])&&rt(t[0])<t[5].length);const c=Math.round((L.reduce((a,r)=>a+r.c,0)+T.reduce((a,t)=>a+rtCost(t[0]),0))*.8);return {L,T,c}}
{const _rp93=researchPanel;researchPanel=function(){if(!isLite())return _rp93.apply(this,arguments);applyResCost();const done=resDoneAll(),tot=resTotal();
 let h=`<div class="reshd"><div><b>研究ポイント ${num(Math.floor(S.rp))}</b><span class="muted small">（月に約${(S.rpRate||0).toFixed(1)}pt）</span></div><div class="muted small">完了 ${done} / ${tot}</div></div><div class="tbar"><i style="width:${(done/tot*100).toFixed(1)}%"></i></div><p class="hint">分野ごとに、いくつかの研究をまとめて進めます。</p>`;
 for(const [cat,n] of Object.entries(RT_CATN)){const p=liteResPack(cat);const cnt=p.L.length+p.T.length;h+=`<div class="shop"><div><div><b>${esc(n)}</b> <span class="muted small">${cnt?`次のまとめ：${cnt}つ・${num(p.c)}pt`:'いまできる研究はありません'}</span></div>${cnt?`<div class="muted small">${esc(p.L.map(r=>r.n).concat(p.T.map(t=>t[2]+'＋1段')).slice(0,4).join('・'))}${cnt>4?' など':''}</div>`:''}</div>${cnt?`<button class="b sm ${S.rp>=p.c?'pri':''}" type="button" data-lres="${cat}" ${S.rp<p.c?'disabled':''}>まとめて研究する</button>`:''}</div>`}
 return h}}
document.addEventListener('click',e=>{const b=e.target.closest('[data-lres]');if(!b||!S)return;const p=liteResPack(b.dataset.lres);if(S.rp<p.c)return;S.rp-=p.c;for(const r of p.L)S.res[r.id]=1;for(const t of p.T){if(!S.rtk)S.rtk={};S.rtk[t[0]]=rt(t[0])+1}log(`研究を${p.L.length+p.T.length}つ、まとめて進めた`,'good');try{applyResCost()}catch(_){}save();renderPanel()});
// 軽量では、研究のおまかせは使わない（自分で「まとめて研究」）
{const _om93=omkHtml;omkHtml=function(){let h=_om93.apply(this,arguments);if(isLite())h=h.replace(/<label class="omki"><input type="checkbox" data-omk="res"[^>]*><span><b>[^<]*<\/b><small>[^<]*<\/small><\/span><\/label>/,'');return h}}
// 昔の版で遊ぶ：v3.0 を追加
try{if(!OLD_VERS.some(v=>v[1]==='versions/v3.0/'))OLD_VERS.unshift(['v3.0','versions/v3.0/','機能を整理した最初の v3.0'])}catch(_){}
