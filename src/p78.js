
// ===== v3.0.4：アカウントの「調子」（タイプ＋工夫で変わる）／選んだものの効果を短く表示 =====

// ----- アカウントの調子 -----
// タイプはアカウントごと（SNSごと）。調子は毎月、工夫しだいで上がったり下がったりする。
const ACC_T={steady:['安定','じわじわ安定して伸びる',1],early:['早咲き','はじめに伸びやすい。そのあとは工夫しだい',1.6],late:['大器晩成','はじめは伸びにくいが、続けるほど伸びる',.6],wave:['波あり','伸びる時期と止まる時期が交互に来る',1],stuck:['伸び悩み','そのままだと伸びにくい。工夫すると立て直せる',.6],rocket:['ロケット','当たると大きい。大型企画や流行で一気に伸びやすい',1.2]};
const ACC_W=[['steady',3],['early',2],['late',2],['wave',2],['stuck',2],['rocket',1.5]];
function accOf(key){if(!S.acc)S.acc={};let a=S.acc[key];if(!a){let t=0;for(const x of ACC_W)t+=x[1];let r=Math.random()*t,k='steady';for(const x of ACC_W){r-=x[1];if(r<=0){k=x[0];break}}
 if(S.fluck&&key===S.main&&ACC_T[S.fluck.k]){k=S.fluck.k}a=S.acc[key]={k,form:ACC_T[k][2],st:S.am,boom:0,ph:Math.random()*6}}return a}
function accFactors(){const q=postQuality(),sr=S.series||{},tal=S.tal[talKey(S.genre)]||0,cp=collabNow();const posted=((S.last&&S.last.posts)||0)>0;
 return [['投稿の質',clamp(q/55,.6,1.4),q>=55,'スキル・機材・研究で上がる'],['同じジャンルを続ける',sr.n>=6?1.15:sr.n>=3?1.05:.9,sr.n>=3,'ジャンルを変えずに3か月以上'],['流行に合わせる',S.trend&&S.trend.g===S.genre?1.2:1,S.trend&&S.trend.g===S.genre,'いまの流行のジャンルで投稿'],['毎月投稿する',posted?1.05:.75,posted,'予定に「投稿」を入れる'],['得意なジャンル',tal>=60?1.1:tal<20?.9:1,tal>=60,'素質が60以上のジャンル'],['コラボ中',cp?1.1:1,!!cp,'発信タブの「コラボ」']]}
function accTarget(a){const y=(S.am-a.st)/12;let b=1;
 switch(a.k){case 'early':b=y<2?1.6:1;break;case 'late':b=y<4?.75:1.5;break;case 'stuck':b=.75;break;case 'rocket':b=1.1;break;case 'wave':b=1+.45*Math.sin(a.ph+S.am/9);break;default:b=1.05}
 for(const f of accFactors())b*=f[1];return clamp(b,.3,3)}
{const _dp78=doPost;doPost=function(k){const key=S.main,f0=S.f[key]||0;const r=_dp78.apply(this,arguments);try{const f1=S.f[key]||0,d=f1-f0;if(d>0&&S.snsOpen&&!SUBPOST){const mul=1.25*accOf(key).form;const nf=Math.min(SNS[key].cap,f0+d*mul);S.mo.newF+=nf-f1;S.f[key]=nf}}catch(e){console.error(e)}return r}}
{const _mh78=monthHook11;monthHook11=function(){_mh78.apply(this,arguments);try{if(!S||!S.snsOpen||!S.open[S.main])return;const key=S.main,a=accOf(key);const t=accTarget(a);a.form=clamp(a.form+(t-a.form)*.25,.3,3);
 const posted=(S.last&&S.last.posts)||0;if(!posted)return;const y=(S.am-a.st)/12,q=postQuality();
 let p=.004+(S.trend&&S.trend.g===S.genre?.01:0)+(postPlanNow()==='big'?.008:0)+(q>=70?.006:0)+(a.form>1.4?.006:0);if(a.k==='rocket')p+=y<2?.05:.01;else if(a.k==='early'&&y<2)p+=.02;else if(a.k==='stuck')p+=.004;
 if(!chance(p))return;const sn=SNS[key],f=S.f[key]||0;const big=chance(.2+(a.k==='rocket'?.2:0));
 const add=Math.round(Math.min(sn.cap*.9-f,Math.max(R(3000,30000)*(big?R(5,30):1),f*R(.3,big?3:1))));if(add<=0)return;
 S.f[key]=f+add;S.mo.newF=(S.mo.newF||0)+add;a.boom=(a.boom||0)+1;
 const why=S.trend&&S.trend.g===S.genre?'流行に乗った投稿が':postPlanNow()==='big'?'大型企画が':q>=70?'質の高い投稿が':'投稿が';
 const tx=f<1e4?`まだはじめたばかりなのに、${why}おすすめにのって大きく広まった！`:big?`${why}とてつもなく広まり、登録者が一気にふえた！`:`${why}たくさんの人に届いて、登録者がぐんとふえた！`;
 log(`${tx}（+${num(add)}人）`,"good");tl(`登録者が一気に ${num(add)}人 ふえた`);try{popBig("💥 どかーん！",tx,`+${num(add)}人`)}catch(_){}}catch(e){console.error(e)}}}
function accHtml(){const key=S.main,a=accOf(key),T=ACC_T[a.k];const fm=a.form,st=fm>=1.6?'絶好調':fm>=1.15?'好調':fm>=.85?'ふつう':fm>=.55?'不調':'絶不調';const fs=accFactors();
 return `<div class="card acccard"><div class="hd"><span>📈 アカウントの調子（${esc(SNS[key].n)}）</span><b>${st}</b></div>${bar(clamp(fm/2*100,0,100),fm>=1?'h':'m')}<p class="hint">タイプ：<b>${esc(T[0])}</b>（${esc(T[1])}）。調子は工夫で上がり、伸び方が変わります。</p>
 <ul class="accf">${fs.map(([n,m,ok,tip])=>`<li class="${ok?'ok':''}">${ok?'✓':'・'} ${esc(n)}<small>${ok?'':esc(tip)}</small></li>`).join('')}</ul>${fm<.85?'<p class="hint small">どうしても伸びないときは、ジャンルを見直したり、別のSNSでアカウントを作ってメインにしたりするのも手です（アカウントごとにタイプがちがいます）。</p>':''}</div>`}
{const _ps78=panelSns;panelSns=function(){let h=_ps78.apply(this,arguments);try{if(!S.snsOpen)return h;h=h.replace(/<p class="hint">この人生の伸び方：[\s\S]*?<\/p>/,'');const i=h.indexOf('<h2>投稿の方針</h2>');if(i>=0)h=h.slice(0,i)+accHtml()+h.slice(i)}catch(e){console.error(e)}return h}}

// ----- 選んだものの効果を、すぐ下に短く出す -----
const STYLE_FX={norm:'バランスよく伸びる',edge:'見つかりやすい（×1.35）。炎上しやすく、アンチがふえる',chill:'炎上しにくく、ガチ勢が育ちやすい。伸びはゆっくり',expert:'知識が高いほど、投稿の質が上がる'};
const SK_N={talk:'話術',plan:'企画',edit:'編集',looks:'見た目',know:'知識'};
function genreFx(g){const G=GENRES[g];if(!G)return '';const w=Object.entries(G.w||{}).sort((a,b)=>b[1]-a[1]).map(([k,v])=>`${SK_N[k]||k}${Math.round(v*100)}%`).join('・');const tal=Math.round(S.tal[talKey(g)]||0);
 return `質に効く力：${w}／素質 ${tal}${S.trend&&S.trend.g===g?'／いま流行中（伸び ×1.8）':''}`}
{const _ps78b=panelSns;panelSns=function(){let h=_ps78b.apply(this,arguments);try{if(!S.snsOpen)return h;
 h=h.replace(/(<select data-set="genre" id="genreSel">[\s\S]*?<\/select><\/label>)/,`$1<p class="hint fx">効果：${esc(genreFx(S.genre))}</p>`);
 h=h.replace(/(<select data-set="style" id="styleSel">[\s\S]*?<\/select><\/label>)/,`$1<p class="hint fx">効果：${esc(STYLE_FX[S.style]||'')}</p>`);
 h=h.replace(/<p class="hint">スタイル：[^<]*<\/p>/,'');
 h=h.replace(/(<select data-set="style" id="styleSel">)([\s\S]*?)(<\/select>)/,(m,a,b,c)=>a+b.replace(/>([^<]+)<\/option>/g,(mm,n)=>{const k=Object.keys(STYLES).find(x=>STYLES[x].n===n);return '>'+n+(k&&STYLE_FX[k]?'（'+STYLE_FX[k].split('。')[0]+'）':'')+'</option>'})+c)}catch(e){console.error(e)}return h}}
// 投稿の企画：ボタンに効果を書く
{const _sp78=snsPlanHtml;snsPlanHtml=function(){let h=_sp78.apply(this,arguments);try{const FX={normal:'ふつう',short:'見つかりやすい・質は下がる',big:'月5万円・質↑・バズりやすい',live:'投げ銭・ガチ勢が育つ',collab:'相手のファンが来る'};
 for(const [k,t] of Object.entries(FX))h=h.replace(new RegExp(`(data-pplan="${k}"[^>]*>)([^<]+)(</button>)`),`$1$2<small class="bfx">${t}</small>$3`)}catch(e){console.error(e)}return h}}
// サブチャンネルの選択にも効果を
{const _ch78=chHtml;chHtml=function(){let h=_ch78.apply(this,arguments);try{h=h.replace(/(<select data-sch="[^"]+" data-k="style">)([\s\S]*?)(<\/select>)/g,(m,a,b,c)=>a+b.replace(/>([^<]+)<\/option>/g,(mm,n)=>{const k=Object.keys(STYLES).find(x=>STYLES[x].n===n);return '>'+n+(k&&STYLE_FX[k]?'（'+STYLE_FX[k].split('。')[0]+'）':'')+'</option>'})+c)}catch(e){console.error(e)}return h}}
// 習い事：伸びる素質を表示
{const _pp78=panelPlan;panelPlan=function(){let h=_pp78.apply(this,arguments);try{const TN={music:'音楽',beauty:'美容',cook:'料理',comedy:'お笑い',talk:'雑談',game:'ゲーム',study:'勉強',vlog:'Vlog'};
 h=h.replace(/(<select data-set="lesson" id="lessonSel">)([\s\S]*?)(<\/select>)/,(m,a,b,c)=>a+b.replace(/<option value="([a-z]+)"([^>]*)>([^<]+)<\/option>/g,(mm,k,at,n)=>{const L=LESSONS[k];if(!L)return mm;const fx=[...(L.tal||[]).map(t=>TN[t]||t),L.know?'知識':'',L.health?'健康':''].filter(Boolean).join('・');return `<option value="${k}"${at}>${n}${fx?`／${fx}が伸びる`:''}</option>`})+c)}catch(e){console.error(e)}return h}}
// 古い案内の文を、いまの場所に
{const _pb78=popBig;popBig=function(a,b,c){const f=s=>typeof s==='string'?s.replace(/「人生」→「スキル」の「引き継ぎスキル」/g,'「人生」→「自分」の「引き継ぎスキル」').replace(/「人生」→「スキル」/g,'「事業」→「研究」の「🌱 スキル」'):s;return _pb78.call(this,f(a),f(b),f(c))}}
