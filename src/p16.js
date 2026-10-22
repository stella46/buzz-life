// ===== v0.9：推定プレイ時間・感想フォーム（チェック＋自由記入／表に直接届く）・バージョン画面の整理 =====

// ----- 倍速中の推定プレイ時間 -----
function lifeLeftYears(){const a=age();const E=Math.max(60,Math.round(84-(((S.cty&&S.cty.life)||1)-1)*18));return Math.max(3,E-a)}
function etaText(){if(!S||!S.alive)return '';const per=S.unit==='season'?3:S.unit==='week'?.25:1;
  let secMonth,lbl;
  if(skipping){secMonth=.05;lbl='イベントまで'}else if(speed>0){secMonth=1.5/speed/per;lbl=['','▶','▶▶','','▶▶▶'][speed]||'▶'}else return '';
  const perYear=12*secMonth+EVY*EVS;const m10=Math.max(1,Math.round(perYear*10/60)),left=Math.max(1,Math.round(perYear*lifeLeftYears()/60));
  return `⏱ ${lbl}の推定：10年で約${m10}分 ／ この人生のこり約${left}分`}
function renderCtrl(){document.querySelectorAll('[data-spd]').forEach(b=>b.classList.toggle('on',+b.dataset.spd===speed&&!skipping));const sk2=$('#btnSkip');if(sk2)sk2.classList.toggle('on',skipping);
  const el=$('#eta');if(el){const t=etaText();el.textContent=t;el.hidden=!t}}

// ----- 感想フォーム（チェック＋自由記入） -----
// 送り先：Googleスプレッドシートに置いたスクリプトのURL（開発者が設定）。未設定のときは共有で送る
const FB_URL='https://docs.google.com/forms/d/e/1FAIpQLSfCFVQwBY7CEsMfQyLuIdXJfXM8r9F1pJ4iUgp_3NAi2Cjfig/formResponse';
const FB_ENTRY={id:'entry.1115949559',name:'entry.2110061592',body:'entry.1464775717'};
const FBQ2=[
 {k:'good',q:'よかったところ・楽しかったところ',c:['BGM・音','ドット絵・見た目','SNSで伸ばすのが楽しい','お店・会社の経営','まちづくり','恋愛・家族','出来事（イベント）','時代・世代交代','研究・スキル']},
 {k:'bad',q:'わかりにくい・つまらない・不満なところ',c:['操作がわかりにくい','説明が足りない','字やボタンが小さい','テンポが遅い','お金のバランス','同じ出来事が多い','何をすればいいかわからない','バージョンの切り替え']},
 {k:'bug',q:'バグ・おかしな動き',c:['画面が止まる・進まない','ボタンが押せない','数字がおかしい','表示が崩れる・はみ出す','セーブがおかしい・消えた','音がおかしい'],screens:['タイトル','予定','発信','お金','事業','人生','出来事の画面']},
 {k:'want',q:'ほしい機能・アイデア',c:['もっと出来事','もっと職業','もっとお店・建物','友達と競えるもの','やりこみ要素','わかりやすい説明']}
];
const FBQ_KEY='buzz-feedback-q';
function fbQueue(){try{return JSON.parse(localStorage.getItem(FBQ_KEY)||'[]')}catch(_){return []}}
function fbSetQueue(a){try{localStorage.setItem(FBQ_KEY,JSON.stringify(a.slice(-30)))}catch(_){}}
async function fbPost(d){const fd=new URLSearchParams();fd.append(FB_ENTRY.id,String(d.id)+(d.rev?`（訂正${d.rev}）`:''));fd.append(FB_ENTRY.name,d.name||'');fd.append(FB_ENTRY.body,d.text||'');await fetch(FB_URL,{method:'POST',mode:'no-cors',body:fd})}
async function fbFlush(){if(!FB_URL||!navigator.onLine)return;const q=fbQueue();if(!q.length)return;const rest=[];for(const d of q){try{await fbPost(d)}catch(_){rest.push(d)}}fbSetQueue(rest)}
setTimeout(()=>{fbFlush()},3000);window.addEventListener('online',()=>fbFlush());
function fbForm(item){FB_EDIT=item?item.id:null;FB_STAR=item?item.star:0;const v=item||{};let nm='';try{nm=localStorage.getItem(FB_KEY+'-name')||''}catch(_){}
  const list=fbList(),V=k=>(v.f&&v.f[k])||{};
  const box=(q)=>{const cur=V(q.k);const chk=(cur.c||[]);const scr=(cur.s||[]);
    return `<fieldset class="fbset"><legend>${esc(q.q)}</legend><div class="fbchips">${q.c.map(x=>`<label class="fbc"><input type="checkbox" data-fbk="${q.k}" value="${esc(x)}" ${chk.includes(x)?'checked':''}><span>${esc(x)}</span></label>`).join('')}</div>
    ${q.screens?`<p class="hint small">どの画面で？（わかれば）</p><div class="fbchips">${q.screens.map(x=>`<label class="fbc"><input type="checkbox" data-fbs="1" value="${esc(x)}" ${scr.includes(x)?'checked':''}><span>${esc(x)}</span></label>`).join('')}</div>`:''}
    <textarea id="fb_${q.k}" rows="2" maxlength="1000" placeholder="自由に書いてもOK（書かなくてもOK）">${esc(cur.t||'')}</textarea></fieldset>`};
  openModal(`<div class="mcat life">感想・不具合</div><h2>${item?'送ったものを直す':'感想・不具合を送る'}</h2>
  <p class="hint fbnote">全部書かなくて大丈夫。あてはまるところにチェックを入れるだけでもOK。書きたいところだけ書いてね。${item?`\n#${esc(item.id)} を直して送り直すと、前の内容が新しい内容に置きかわる。`:''}</p>
  <div class="form"><label class="fld"><span>名前（任意）</span><input id="fbName" maxlength="20" value="${esc(v.name!=null?v.name:nm)}"></label>
  <div class="fld"><span>楽しさ（任意）</span><div class="seg" id="fbStars">${[1,2,3,4,5].map(i=>`<button type="button" data-fbstar="${i}" class="${FB_STAR===i?'on':''}">${'★'.repeat(i)}</button>`).join('')}</div></div></div>
  ${FBQ2.map(box).join('')}
  <fieldset class="fbset"><legend>そのほか</legend><textarea id="fb_other" rows="2" maxlength="1000" placeholder="なんでも">${esc((v.f&&typeof v.f.other==='string'?v.f.other:(V('other').t||'')))}</textarea></fieldset>
  <label class="fld chk"><input type="checkbox" id="fbInfo" ${v.info===false?'':'checked'}> <span>遊んでいる版と、今の人生の年・年齢を一緒に送る（不具合を直すのに役立つ）</span></label>
  <div class="mch"><button class="b pri" type="button" data-act="fbSend">${item?'直して送り直す':'送る'}</button>${list.length&&!item?`<button class="b" type="button" data-act="fbMine">送ったもの（${list.length}件）を見る・直す</button>`:''}<button class="b ghost" type="button" data-act="close">やめる</button></div>`)}
function fbCollect(){const f={};for(const q of FBQ2){f[q.k]={c:[...document.querySelectorAll(`[data-fbk="${q.k}"]:checked`)].map(x=>x.value),t:($('#fb_'+q.k).value||'').trim()};if(q.screens)f[q.k].s=[...document.querySelectorAll('[data-fbs]:checked')].map(x=>x.value)}
  f.other={c:[],t:($('#fb_other').value||'').trim()};return f}
function fbEmpty(f){return !Object.values(f).some(x=>x&&((x.c&&x.c.length)||(x.s&&x.s.length)||x.t))}
function fbText(it){const lines=[`【Buzz人生シミュレーター 感想${it.rev?`・訂正${it.rev}回目`:''}】#${it.id}`];if(it.name)lines.push('名前：'+it.name);if(it.star)lines.push('楽しさ：'+'★'.repeat(it.star)+'☆'.repeat(5-it.star));
  for(const q of FBQ2.concat([{k:'other',q:'そのほか'}])){const x=it.f[q.k];if(!x||typeof x==='string'){if(x)lines.push(`■${q.q}\n${x}`);continue}const parts=[];if(x.c&&x.c.length)parts.push('・'+x.c.join('\n・'));if(x.s&&x.s.length)parts.push('（画面：'+x.s.join('、')+'）');if(x.t)parts.push(x.t);if(parts.length)lines.push(`■${q.q}\n${parts.join('\n')}`)}
  if(it.info&&it.env)lines.push('（'+it.env+'）');return lines.join('\n')}
function fbRow(it){const g=k=>it.f[k]||{};return {id:it.id,rev:it.rev||0,name:it.name||'',star:it.star||'',
  good_c:(g('good').c||[]).join('、'),good_t:g('good').t||'',bad_c:(g('bad').c||[]).join('、'),bad_t:g('bad').t||'',
  bug_c:(g('bug').c||[]).join('、'),bug_s:(g('bug').s||[]).join('、'),bug_t:g('bug').t||'',want_c:(g('want').c||[]).join('、'),want_t:g('want').t||'',other:g('other').t||'',
  ver:CUR_VER,env:it.info?it.env:'',text:fbText(it)}}
async function fbSend(){const f=fbCollect();const name=($('#fbName').value||'').trim();
  if(!FB_STAR&&fbEmpty(f)){toast('どこか1つチェックするか書いてね');return}
  try{localStorage.setItem(FB_KEY+'-name',name)}catch(_){}
  const list=fbList();let it=FB_EDIT&&list.find(x=>x.id===FB_EDIT);
  const env=`${CUR_VER}・${/iPhone|iPad|Android/i.test(navigator.userAgent)?'スマホ':'PC'}${S?`・${S.y}年・${age()}歳・${ctry()}`:''}`;
  if(it)Object.assign(it,{f,name,star:FB_STAR,info:$('#fbInfo').checked,env,rev:(it.rev||0)+1,at:Date.now()});
  else{it={id:Date.now().toString(36).slice(-6).toUpperCase(),f,name,star:FB_STAR,info:$('#fbInfo').checked,env,rev:0,at:Date.now()};list.push(it)}
  fbSaveList(list);const text=fbText(it);let how='',showText=false;
  if(FB_URL){const row=fbRow(it);try{if(!navigator.onLine)throw 0;await fbPost(row);how='送信しました。'}catch(_){fbSetQueue(fbQueue().concat([row]));how='今は電波がないみたい。つながったときに自動で送るね。'}}
  else{showText=true;if(navigator.share){try{await navigator.share({text});how='ありがとう！'}catch(_){how='下の文章をコピーして送ることもできる。'}}else{try{await navigator.clipboard.writeText(text);how='コピーしました。LINE やメールに貼りつけて送ってね。'}catch(_){how='下の文章をコピーして送ってね。'}}}
  openModal(`<div class="mcat life">感想・不具合</div><h2>ありがとう！</h2><p class="mtext">${esc(how)}\nあとで直したくなったら「感想・不具合を送る」→「送ったもの」から直せる。</p>${showText?`<textarea class="fbout" rows="8" readonly>${esc(text)}</textarea><div class="mch"><button class="b" type="button" data-act="fbCopy">文章をコピー</button></div>`:''}<button class="b pri" type="button" data-act="close">閉じる</button>`)}
function fbMine(){const list=fbList().slice().reverse();openModal(`<div class="mcat life">感想・不具合</div><h2>送ったもの</h2><p class="hint">このスマホ（ブラウザ）から送ったもの。「直す」で書き直して送り直すと、前の内容が置きかわる。</p>${list.map(it=>{const d=new Date(it.at);const first=fbText(it).split('\n').slice(1,3).join(' ');return `<div class="shop"><div><div>#${esc(it.id)} ${it.star?'★'.repeat(it.star):''}${it.rev?` <span class="chip">訂正${it.rev}</span>`:''}</div><div class="muted small">${d.getMonth()+1}/${d.getDate()} ${esc(first.slice(0,40))}</div></div><button class="b sm" type="button" data-fbedit="${esc(it.id)}">直す</button></div>`}).join('')||'<p class="hint">まだない。</p>'}<div class="mch"><button class="b" type="button" data-act="fb">新しく書く</button><button class="b pri" type="button" data-act="close">閉じる</button></div>`)}

// ----- バージョン画面の整理 -----
OLD_VERS.forEach(v=>{const d={'v0.7':'時代を選べる・会社・新しいまちの開発が入ったころ','v0.6':'人生の選択・目標・アルバムが入ったころ','v0.5':'子ども時代のおこづかい画面が入ったころ','v0.4':'出来事が500個になったころ','v0.3':'5つのタブ・お店の経営が入ったころ','v0.2':'国や時代・まちづくりが入ったころ','v0.1':'最初の試作（残っていない）'}[v[0]];if(d)v[2]=d});
OLD_VERS.unshift(['v0.8','versions/v0.8/','研究とスキルツリー・感想フォームが入ったころ']);
function showNews(tabk){const t=tabk||'new';const web=/^https?:$/.test(location.protocol)&&!/claude/.test(location.hostname);
  let h=`<div class="mcat life">アップデート</div><h2>アップデート情報</h2><div class="subtabs"><button class="stab" type="button" data-news="new" aria-pressed="${t==='new'}">新しくなったこと</button><button class="stab" type="button" data-news="old" aria-pressed="${t==='old'}">昔の版で遊ぶ（おまけ）</button></div>`;
  if(t==='new')h+=`<p class="hint">いま遊んでいるのは最新の ${esc(CUR_VER)}。新しい版が出ると自動で入れかわる（何もしなくてOK）。</p><div class="news">${CHANGELOG.map(([v,d,items],i)=>`<section class="nv ${i===0?'cur':''}"><div class="hd"><b>${esc(v)}</b><span class="muted small">${esc(d)}</span>${i===0?'<span class="chip up">いまの版</span>':''}</div><ul>${items.map(x=>`<li>${esc(x)}</li>`).join('')}</ul></section>`).join('')}</div>`;
  else h+=`<div class="card"><p class="mtext">ふだんは使わなくて大丈夫。いつも最新版で遊べばOK。
「昔はどんなゲームだったのか」を遊んでみたいときだけのおまけ。
・昔の版のセーブは、いまのセーブとは別。いまのデータは消えない。
・昔の版から戻るときは、画面のいちばん上の黄色い帯の「最新版に戻る」を押す。</p></div>${web?'':'<p class="hint">※この機能はWeb版（stella46.github.io/buzz-life）でだけ使える。</p>'}
  <div class="news">${OLD_VERS.map(([v,u,d])=>`<section class="nv"><div class="hd"><b>${esc(v)}</b></div><p class="small">${esc(d)}</p>${u&&web?`<a class="b sm" href="${u}">${esc(v)}で遊んでみる</a>`:''}</section>`).join('')}</div>`;
  openModal(h+'<button class="b pri" type="button" data-act="close">閉じる</button>');markVer()}
function showVersions(){showNews('old')}
function backupHtml(){const b=backupInfo();if(!b)return '<p class="hint">今はまだない（新しい版が出たときに、前のデータの控えが自動でとられる）。</p>';const dt=new Date(b.at);return `<p class="hint">ふだんは使わなくてOK。新しい版になってからセーブがおかしくなったときだけ、アップデート前のデータに戻せる。</p><div class="mch" id="bkBox"><button class="b" type="button" data-act="bkAsk">アップデート前のデータに戻す（${esc(b.name||'')} ${b.age}歳・${dt.getMonth()+1}/${dt.getDate()}にとった控え）</button></div>`}
function delHtml(){const hs=!!loadSaved();return `<div class="mch" id="delBox"><button class="b" type="button" data-act="delAsk" data-k="save" ${hs?'':'disabled'}>続きのセーブデータを消す${hs?'':'（セーブなし）'}</button><button class="b" type="button" data-act="delAsk" data-k="all">実績・図鑑も含めて全部消す</button></div><h3>もしものとき</h3>${backupHtml()}`}
document.addEventListener('click',e=>{const b=e.target.closest('button');if(b&&b.dataset.news){showNews(b.dataset.news)}},true);
GUIDE.forEach(g=>{if(g[0]==='save')g[2]=`・自動で保存される。「メニュー」→「セーブデータを書き出す」で控えを取れる。
・新しい版は自動で入れかわる。何もしなくてOK。
・タイトルの「アップデート情報」で、新しくなったことが見られる。「昔の版で遊ぶ（おまけ）」は、昔のゲームを遊んでみたいときだけ使う（いまのセーブとは別）。
・新しい版になってからセーブがおかしくなったときだけ、「設定」→「もしものとき」から、アップデート前のデータに戻せる。
・音量・BGM・効果音は「設定」や「メニュー」で変えられる。`;if(g[0]==='fb')g[2]='タイトルやメニューの「感想・不具合を送る」から送れる。全部書かなくてOK。チェックを入れるだけでも送れる。送ったあとで直したくなったら「送ったもの」から直して送り直せる（前の内容が置きかわる）。'});
