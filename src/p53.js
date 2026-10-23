
// ===== v2.7：研究ポイントがたまりやすく・人生の道のり（次に何をすればいいか） =====
// 研究が約300個に増えたので、研究ポイントのたまり方を3倍に
const RP_MUL=3;
const _rtb53=rtBuy;rtBuy=function(k){const r0=S.rp;const r=_rtb53.apply(this,arguments);if(S.rp<r0)S._rpSp=(S._rpSp||0)+(r0-S.rp);return r};
const _turn53=turn;turn=function(){if(!S||!S.alive)return _turn53.apply(this,arguments);const r0=S.rp;S._rpSp=0;const res=_turn53.apply(this,arguments);try{const g=(S.rp-r0)+(S._rpSp||0);if(g>0&&age()>=10)S.rp+=g*(RP_MUL-1)}catch(_){}S._rpSp=0;return res};

// ----- 人生の道のり（遊びの順番の目安） -----
// [段階名, 目安, [[目標, 達成の条件, 行き先, ヒント], ...]]
const ROAD=[
 ['子ども時代','0〜12歳',[['小学生になる',()=>age()>=6,'act:','6歳までは自動で育ちます'],['予定で遊びや勉強を選ぶ',()=>age()>=8,'act:','「予定」タブで、毎月なにをするか選びます'],['習いごとで素質をのばす',()=>!!S.lesson||Object.keys(S.subs||{}).some(k=>k.startsWith('t3_')&&S.subs[k])||age()>=13,'money:','おこづかい画面の「習いごと」'],['13歳になる',()=>age()>=13,'act:','13歳からSNSを始められます']]],
 ['SNSデビュー','13歳〜',[['SNSを始める',()=>!!S.snsOpen,'sns:','「発信」タブでアカウントを作ります'],['予定に「投稿」を入れる',()=>S.snsOpen&&(S.stats.maxF>=100||(S.plan||[]).includes('post')),'act:','投稿しないとフォロワーはふえません'],['フォロワー1000人',()=>S.stats.maxF>=1e3,'sns:','流行のジャンルに合わせると伸びやすい'],['はじめてバズる',()=>S.stats.buzz>=1,'sns:','投稿の質を上げるとバズりやすくなります']]],
 ['大人の暮らし','18歳〜',[['18歳になる',()=>age()>=18,'act:',''],['収入を得る（仕事・専業クリエイター）',()=>(S.salSum||0)>0||S.st==='creator'||S.stats.maxF>=1e4,'life:stat','「人生」→「能力」の進路'],['請求書を自動払いにする',()=>!!S.autopay,'money:bills','払い忘れがなくなります'],['研究を5つ終える',()=>resDoneAll()>=5,'biz:res','「⭐おすすめ」から選ぶと迷いません']]],
 ['人気者へ','〜10万人',[['フォロワー1万人',()=>S.stats.maxF>=1e4,'sns:',''],['コラボする',()=>(S.stats.collabN||0)>0||!!S.flags.collabDone||S.stats.maxF>=1e5,'sns:','ほかの配信者と組むと新しいファンが来ます'],['フォロワー10万人',()=>S.stats.maxF>=1e5,'sns:',''],['スキルを覚える',()=>Object.keys(S.skt||{}).length>0,'life:skill','スキルポイントで覚えます']]],
 ['お店とまち','18歳〜',[['お店を建てる',()=>typeof anyShop==='function'&&anyShop(),'biz:town','まちの空き地を選んで建てます'],['資産1000万円',()=>S.stats.maxM>=1e7,'money:',''],['まちの発展度30',()=>allTowns().some(T=>(T.dev||0)>=30),'biz:town','建物をふやすと発展します'],['新しいまちを持つ',()=>allTowns().length>=2,'biz:town','開発するか、買収します']]],
 ['会社の社長','20歳〜',[['会社を作る',()=>(S.cos||[]).length>0,'biz:co','「事業」→「会社」'],['作品を完成させる',()=>(S.prodN||0)>0,'biz:co','作るものは「おまかせ」でもOK'],['社員100人',()=>typeof empAll==='function'&&empAll()>=100,'biz:co',''],['資産1億円',()=>S.stats.maxM>=1e8,'money:','']]],
 ['家族と仲間','いつでも',[['友達と交流する',()=>!!(S.koryu&&S.koryu.n)||(S.friends||[]).some(f=>f.rel>=70),'life:ppl','「人生」→「人」→「つながり」'],['恋人ができる',()=>!!(S.partner||S.spouse),'life:choice',''],['結婚する',()=>!!S.spouse,'life:ppl','仲が深まるとプロポーズできます'],['子どもを迎える',()=>(S.kids||[]).length>0,'life:ppl','']]],
 ['世界へ','100万人〜',[['フォロワー100万人',()=>S.stats.maxF>=1e6,'sns:',''],['海外に進出する',()=>!!(S.world&&S.world.r.length),'sns:','「発信」の「世界の舞台」'],['賞をとる',()=>(S.awards||[]).length>0,'biz:aw','条件を満たすと自動でノミネートされます'],['資産10億円',()=>S.stats.maxM>=1e9,'money:','']]],
 ['世界を動かす','大富豪',[['大計画を始める',()=>(S.mega||[]).length>0,'biz:mega','「事業」→「挑戦」→「大計画」'],['インフラを整える',()=>(S.mega||[]).some(m=>m.done&&/^inf_/.test(m.k)),'biz:mega','人口をふやす計画の土台'],['全世界に進出',()=>!!(S.world&&S.world.r.includes('global')),'sns:',''],['人口をふやす',()=>(S.popAdd||0)>0,'biz:mega','人口がふえると、届く人数も広がります']]],
 ['銀河へ','京・垓',[['資産1兆円',()=>S.stats.maxM>=1e12,'money:',''],['宇宙の大計画を完成',()=>(S.mega||[]).some(m=>m.done&&MEGA[m.k]&&(MEGA[m.k].cat==='宇宙'||MEGA[m.k].cat==='銀河')),'biz:mega',''],['1京円の計画を完成',()=>(S.mega||[]).some(m=>m.done&&MEGA[m.k]&&MEGA[m.k].c>=1e16),'biz:mega',''],['フォロワー10億人',()=>S.stats.maxF>=1e9,'sns:','']]],
 ['次の世代へ','いつでも',[['人生の終わりのモードを選ぶ',()=>!!S.endless||!!S.flags.endChosen,'life:stat','エンドレスにすると、子どもに引き継げます'],['2代目として生きる',()=>(S.gen||1)>=2,'life:stat','']]]];
function roadState(){const st=ROAD.map(([n,a,L])=>{const g=L.map(([t,f,go,h])=>{let ok=false;try{ok=!!f()}catch(_){}return {t,ok,go,h}});return {n,a,g,done:g.filter(x=>x.ok).length}});let cur=st.findIndex(s=>s.done<s.g.length);if(cur<0)cur=st.length-1;return {st,cur}}
function roadNext(){const {st,cur}=roadState();const s=st[cur];const g=s.g.find(x=>!x.ok);return g?{stage:s.n,g}:null}
function showRoad(){const {st,cur}=roadState();const tot=st.reduce((a,s)=>a+s.g.length,0),dn=st.reduce((a,s)=>a+s.done,0);
 let h=`<div class="mcat life">人生の道のり</div><h2>次に何をする？</h2><p class="hint">遊びの順番の目安です。上から順に進めると、新しい機能が自然に使えるようになります。順番どおりでなくても大丈夫です。（達成 ${dn}/${tot}）</p><div class="road">`;
 st.forEach((s,i)=>{const open=i===cur;h+=`<details class="rst ${s.done===s.g.length?'done':''} ${open?'cur':''}"${open?' open':''}><summary><span class="rn">${i+1}</span><b>${esc(s.n)}</b><span class="muted small">${esc(s.a)}</span><span class="chip">${s.done}/${s.g.length}</span></summary><ul>${s.g.map(g=>`<li class="${g.ok?'ok':''}"><span>${g.ok?'✓':'・'} ${esc(g.t)}${g.h&&!g.ok?`<small>${esc(g.h)}</small>`:''}</span>${!g.ok&&g.go&&S&&!$('#scrGame').hidden?`<button class="b sm" type="button" data-goto="${g.go}" data-sc="1">行く</button>`:''}</li>`).join('')}</ul></details>`});
 openModal(h+`</div><button class="b pri" type="button" data-act="close">閉じる</button>`)}
(function(){const c=document.getElementById('ctrl');if(!c)return;const b=document.createElement('button');b.className='b sm';b.type='button';b.id='btnRoad';b.textContent='🧭道のり';b.addEventListener('click',()=>{if(S)showRoad()});const f=document.getElementById('btnFind');if(f)f.after(b);else c.appendChild(b)})();
// 秘書も、特にないときは道のりの次の目標をすすめる
const _st53=secTip;secTip=function(){const t=_st53.apply(this,arguments);try{if(t&&t[1]&&!/今月も順調|まるごとおまかせ|アルバム/.test(t[0]))return t;const n=roadNext();if(n&&age()>=6)return [`次の目標：「${n.g.t}」（${n.stage}）${n.g.h?'。'+n.g.h:''}`,n.g.go||null]}catch(_){}return t};
document.addEventListener('click',e=>{if(e.target.closest('[data-endm]')&&S)S.flags.endChosen=1},true);
try{FIND.unshift(['人生の道のり','画面の上の「🧭道のり」',null,'遊びの順番の目安と、次にやること','順番 目標 なにをする'])}catch(_){}
const _cg53=collabGain;collabGain=function(){const r=_cg53.apply(this,arguments);try{if(collabNow())S.flags.collabDone=1}catch(_){}return r};
