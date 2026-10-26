
// ===== v3.0.3：サブチャンネルはメインの登録者に応じて伸びる／人生ごとにちがう伸び方 =====

// ----- サブチャンネル：作ったときに、メインのファンの一部がついてくる。その後もメインから少しずつ流れてくる -----
const SCH_T0=Date.now();
function schMainF(){try{return S.f[S.main]||0}catch(_){return 0}}
document.addEventListener('click',e=>{const b=e.target.closest('[data-act="schNew"]');if(!b||!S)return;setTimeout(()=>{try{for(const c of (S.subch||[])){if(c.boot)continue;const t=parseInt(String(c.id).slice(1),36);if(!(t>=SCH_T0))continue;c.boot=1;
 const m=schMainF(),same=c.genre===S.genre?1.6:1;const add=Math.round(m*R(.04,.15)*same);if(add>c.f){c.f=add;log(`サブチャンネル「${c.name}」に、メインのファンが ${num(add)}人 ついてきた`,'good');try{popBig('📺 サブチャンネル開設',`メインのファンが ${num(add)}人 登録してくれました`,esc(c.name))}catch(_){}}save();renderPanel()}}catch(err){console.error(err)}},0)});
{const _mh77=monthHook11;monthHook11=function(){_mh77.apply(this,arguments);try{if(!S||!S.subch||!S.snsOpen)return;const m=schMainF();for(const c of S.subch){const top=m*(c.genre===S.genre?.7:.45);if(c.f>=top)continue;const g=m*.003*R(.4,1.6)*(1-c.f/top);if(g>0)c.f=Math.round(c.f+g)}}catch(e){console.error(e)}}}
try{const _ch77=chHtml;chHtml=function(){return _ch77.apply(this,arguments).replace('サブチャンネルを3つまで作れる。','サブチャンネルを3つまで作れる。作ると、メインのファンの一部が登録してくれて、その後もメインから少しずつ流れてくる（同じジャンルほど多い）。')}}catch(_){}

// ----- 人生ごとの伸び方（ひみつ）：早咲き・大器晩成・波あり・伸び悩み・ロケット・安定 -----
const FLUCK=[['steady','安定',3],['early','早咲き',2],['late','大器晩成',2],['wave','波あり',3],['stuck','伸び悩み',2],['rocket','ロケット',1.5]];
function fluck(){if(!S.fluck){let t=0;for(const x of FLUCK)t+=x[2];let r=Math.random()*t,k='steady';for(const x of FLUCK){r-=x[2];if(r<=0){k=x[0];break}}S.fluck={k,w:1,st:S.am,boom:0}}return S.fluck}
function fluckMul(){const L=fluck(),y=(S.am-(L.st||S.am))/12;
 switch(L.k){case 'early':return y<2?3:y<5?1.4:.8;case 'late':return y<6?.45:y<10?1.3:2.2;case 'wave':return L.w;case 'stuck':return .55;case 'rocket':return y<1?1.5:1;default:return 1.1}}
// 伸びをすこし速く＋人生ごとの伸び方
{const _dp77=doPost;doPost=function(k){const key=S.main,f0=S.f[key]||0;const r=_dp77.apply(this,arguments);try{const f1=S.f[key]||0,d=f1-f0;if(d>0&&S.snsOpen){const mul=1.3*fluckMul();const cap=SNS[key].cap;const nf=Math.min(cap,f0+d*mul);S.mo.newF+=nf-f1;S.f[key]=nf}}catch(e){console.error(e)}return r}}
// どかーん：ときどき、いきなり大きく伸びる（はじめたばかりでも）
{const _mh77b=monthHook11;monthHook11=function(){_mh77b.apply(this,arguments);try{if(!S||!S.snsOpen||!S.open[S.main])return;const L=fluck();if(L.st==null)L.st=S.am;
 if(L.k==='wave'&&chance(.12))L.w=clamp(L.w*R(.5,2),.3,3.5);
 const posted=(S.last&&S.last.posts)||0;if(!posted)return;const y=(S.am-L.st)/12;
 let p=.006;if(L.k==='rocket')p=y<1.5?.12:.01;else if(L.k==='stuck')p=.012;else if(L.k==='early'&&y<2)p=.03;else if(L.k==='wave')p=.01;
 if(!chance(p))return;const key=S.main,sn=SNS[key],f=S.f[key]||0;
 const big=chance(.25);const add=Math.round(Math.min(sn.cap*.9-f,Math.max(R(3000,30000)*(big?R(5,30):1),f*R(.3,big?3:1))));if(add<=0)return;
 S.f[key]=f+add;S.mo.newF=(S.mo.newF||0)+add;L.boom=(L.boom||0)+1;
 const t=f<1e4?'まだはじめたばかりなのに、投稿がおすすめにのって大きく広まった！':big?'投稿がとてつもなく広まり、登録者が一気にふえた！':'投稿がたくさんの人に届いて、登録者がぐんとふえた！';
 log(`${t}（+${num(add)}人）`,'good');tl(`登録者が一気に ${num(add)}人 ふえた`);try{popBig('💥 どかーん！',t,`+${num(add)}人`)}catch(_){}}catch(e){console.error(e)}}}
// 伸び方のタイプは、しばらく遊ぶと「発信」タブでわかる
{const _ps77=panelSns;panelSns=function(){const h=_ps77.apply(this,arguments);try{if(!S.snsOpen)return h;const L=fluck();const y=(S.am-(L.st||S.am))/12;if(y<3)return h;const n=(FLUCK.find(x=>x[0]===L.k)||[])[1];
 const d={steady:'じわじわ安定して伸びるタイプ',early:'最初に一気に伸びたタイプ',late:'あとから大きく伸びるタイプ',wave:'伸びる時期と止まる時期が交互に来るタイプ',stuck:'なかなか伸びないけれど、ときどき大きく当たるタイプ',rocket:'いきなり爆発するタイプ'}[L.k];
 return h.replace('<h2>投稿の方針</h2>',`<p class="hint">この人生の伸び方：<b>${esc(n)}</b>（${esc(d)}）</p><h2>投稿の方針</h2>`)}catch(_){}return h}}
