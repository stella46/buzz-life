
// ===== v3.0（12）：バランス調整 =====
// 方針：やりこめば、1回の人生で大計画をすべてそろえられるかもしれない（ゲーム補正）。フォロワーもそれに合わせて大きく。

// ----- 大計画：値段（高すぎるものを値下げ）・期間（短く）・年の制限（研究の数で解放） -----
const MEGA_RESN=k=>{const m=MEGA[k];return m&&m._yr0>2026?Math.min(180,Math.round((m._yr0-2026)*.8)):0};
for(const m of Object.values(MEGA)){if(m._c0!=null)continue;m._c0=m.c;m._yr0=m.yr||0;m._dur0=m.dur;
 m.c=m._c0<=1e12?m._c0:Math.round(1e12*Math.pow(m._c0/1e12,.5));m.dur=Math.max(6,Math.round(m._dur0*.3));
 const k=m.k;Object.defineProperty(m,'yr',{get(){const n=MEGA_RESN(k);try{return n&&resDoneAll()<n?90000+n:0}catch(_){return 0}},set(v){},configurable:true,enumerable:true})}
{const _mh73=megaHtml;megaHtml=function(){let h=_mh73.apply(this,arguments);return h.replace(/（9(\d{4})年から）/g,(s,n)=>`（研究${+n}個で解放・いま${resDoneAll()}個）`)}}
// おまかせ：大計画を同時に10個まで
{const _om73=omkMonth;omkMonth=function(){const r=_om73.apply(this,arguments);try{if(S&&omk('mega')&&age()>=20){for(let i=0;i<2;i++){if((S.mega||[]).filter(x=>!x.done).length>=10)break;const cand=Object.values(MEGA).filter(m=>!megaOf(m.k)&&S.y>=m.yr&&!(m.req&&!megaDone(m.req))&&megaCost(m)<=S.money*.25).sort((a,b)=>a.c-b.c)[0];if(!cand)break;megaStart(cand.k)}}}catch(e){console.error(e)}return r}}
// 完成した大計画は、毎月、経済効果（費用の0.3%）を生む
{const _mm73=megaMonth;megaMonth=function(){const r=_mm73.apply(this,arguments);try{let t=0;for(const x of (S.mega||[]))if(x.done&&MEGA[x.k])t+=megaCost(MEGA[x.k])*.003;if(t>0)inc('mega',Math.round(t*R(.85,1.15)))}catch(e){console.error(e)}return r}}

// ----- 宇宙人の視聴者：宇宙の大計画で、地球の外にも届くように -----
const ALIEN={aliencity:1e11,galnet:1e12,galfed:1e13,universe:1e14};
function alienPop(){let n=0;try{for(const k in ALIEN)if(megaDone(k))n+=ALIEN[k]}catch(_){}return n}
function viewersAll(){return worldPop()+(W().r.includes('space')?alienPop():0)}
WREG.push(['space','宇宙',1,.35,1e12,'宇宙ステーションの中継で、月・火星・コロニー、そして宇宙人にも届ける']);
{const _wn73=wNext;wNext=function(){const w=W();const r=WREG.find(x=>!w.r.includes(x[0]));if(r&&r[0]==='space'&&!(megaDone('station')&&w.r.includes('global')))return null;return r}}
{const _wc73=worldCard;worldCard=function(){let h=_wc73.apply(this,arguments);try{const w=W();if(h&&!w.r.includes('space')&&w.r.includes('global')&&!megaDone('station'))h=h.replace('すべての地域に進出しました。あとは世界一を目指すだけです。','地球のすべての地域に進出しました。大計画で「民間宇宙ステーション」ができると、宇宙にも配信できるようになります。');
 if(w.r.includes('space'))h=h.replace('すべての地域に進出しました。あとは世界一を目指すだけです。',`宇宙にも届いています。宇宙の視聴者：約${num(viewersAll()-WORLD_POP)}人（大計画で宇宙人とつながるほど増えます）。`)}catch(_){}return h}}
// 登録者の上限：国内は広めに。全世界に進出したら「届く人の数（人口＋宇宙）」まで
const CAPX=5;
for(const k of Object.keys(SNS)){const o=SNS[k];if(o._cap0==null){const c0=o.cap;o._cap0=c0}Object.defineProperty(o,"cap",{get(){const sh=Math.min(1,this._cap0/SNS.milu._cap0);let c=this._cap0*CAPX*worldMul();try{if(S&&S.world&&S.world.r.includes('global'))c=Math.max(c,viewersAll()*sh)}catch(_){}return c},set(v){this._cap0=v},configurable:true,enumerable:true})}

// ----- フォロワーの伸びを大きく -----
{const _dp73=doPost;doPost=function(k){const key=S.main,f0=S.f[key]||0;const r=_dp73.apply(this,arguments);try{const sn=SNS[key],f1=S.f[key]||0,d=f1-f0;if(d>0){const room=Math.max(0,1-f1/sn.cap);const q=postQuality();const ex=(d*.8+f0*.012*k*Math.min(2,q/60))*room;S.f[key]=f1+ex;S.mo.newF+=ex}}catch(e){console.error(e)}return r}}

// ----- 市場の広がり：人口と宇宙の大計画で、会社やお店の収入が大きくなる -----
function marketMul(){try{return Math.max(1,Math.sqrt((worldPop()+alienPop())/WORLD_POP))}catch(_){return 1}}
{const _inc73=inc;inc=function(cat,v){if(v>0&&(cat==='co'||cat==='biz'||cat==='mega'||cat==='platform')){const m=marketMul();if(m>1)v=Math.round(v*m)}return _inc73.call(this,cat,v)}}

// ----- 新しいまち：現実に近い金額に。そのぶん、まちからの収入（地代・税収）も -----
{const P={onsen:1e11,newtown:3e11,resort:5e11,bay:2e12,future:1e13};for(const d of DEVS){if(d._c0==null){d._c0=d.cost;if(P[d.k])d.cost=P[d.k]}}}
{const _mh73b=monthHook11;monthHook11=function(){_mh73b.apply(this,arguments);try{if(!S||!S.towns2)return;let t=0;for(const T of S.towns2){const d=DEVS.find(x=>x.k===T.kind);if(!d)continue;t+=d.cost*Math.max(.2,S.cty.inc)*.006*(.6+Math.min(1,(T.dev||0)/100)*.8)}if(t>0)inc('biz',Math.round(t))}catch(e){console.error(e)}}}
// フォロワーがふえたぶん、SNSの広告収入は1人あたり少なめに（お金がふくらみすぎないように）
{const _inc73b=inc;inc=function(cat,v){if(v>0&&(cat==='sns'||cat==='tip'))v=Math.round(v*.3);return _inc73b.call(this,cat,v)}}
