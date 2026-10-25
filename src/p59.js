
// ===== v2.9.2：遊び方・設定を見やすく、データの移動をタイトルに独立、昔の版の一覧を更新 =====

// ----- 遊び方：項目は1行の切りかえ（◀ 選ぶ ▶）にして、本文を広く -----
function guideBody(g){return `<h3>${esc(g[1])}</h3>${g[0]==='time'?timeHtml():`<p class="mtext guide">${esc(g[2])}</p>`}${g[0]==='fb'?'<div class="row"><button class="b" type="button" data-act="fb">感想・不具合を送る</button></div>':''}${g[0]==='basic'?'<div class="row"><button class="b pri" type="button" data-act="tutRestart">チュートリアルをする</button></div>':''}`}
let GUIDE_CUR='basic';
showGuide=function(k){const g=GUIDE.find(x=>x[0]===k)||GUIDE[0];GUIDE_CUR=g[0];const m=$('#mcard');
 if(!$('#modal').hidden&&m.dataset.kind==='guide2'){const sel=$('#gSel');if(sel)sel.value=g[0];const f=m.querySelector('.fbody');f.innerHTML=guideBody(g);f.scrollTop=0;return}
 openModal(`<span hidden data-act="close"></span><div class="mcat life">遊び方</div><div class="gnav"><button class="b sm" type="button" data-gstep="-1" aria-label="前の項目">◀</button><select id="gSel" aria-label="遊び方の項目">${GUIDE.map((x,i)=>`<option value="${x[0]}" ${x[0]===g[0]?'selected':''}>${i+1}. ${esc(x[1])}</option>`).join('')}</select><button class="b sm" type="button" data-gstep="1" aria-label="次の項目">▶</button></div><div class="fbody">${guideBody(g)}</div>`);
 m.classList.add('fixedsize');m.dataset.kind='guide2'};
document.addEventListener('change',e=>{if(e.target&&e.target.id==='gSel')showGuide(e.target.value)});
document.addEventListener('click',e=>{const b=e.target.closest('[data-gstep]');if(!b)return;const i=GUIDE.findIndex(x=>x[0]===GUIDE_CUR);const n=(i+(+b.dataset.gstep)+GUIDE.length)%GUIDE.length;showGuide(GUIDE[n][0])});
// 遊び方の内容を、v2.9.1 に合わせて更新
(function(){const set=(k,f)=>{const g=GUIDE.find(x=>x[0]===k);if(g)g[2]=f(g[2])};
 set('basic',t=>t.replace('・データは月が進むたびに自動で保存されます。','・データは月が進むたびに自動で保存されます。\n・スマホでアプリとして開いたときは、はじめに「オンライン（ゲームの更新あり）」か「オフライン（ゲームの更新なし）」を選びます。'));
 set('sns',t=>t+'\n・SNSは13歳から始められます。スマホがないときは「発信」タブに、スマホを買う・家族に借りる・学校や図書館のパソコンを使う、の3つの始め方が出ます。');
 set('money',t=>t.replace('・18歳になるまでに','・18歳になるまでに').replace('利息はありません）。','利息はありません）。立て替えが起きたときは、その場でお知らせします。')+'\n・アルバイトは16歳から。高校によっては15歳からできます（進学校は禁止、地元の高校と通信制はできる）。');
 set('people',t=>t+'\n・子どものころ、家族チャンネルを始めるか相談されることがあります（親がいきなり始めてしまうことも）。');
 set('save',t=>t.replace('タイトルの「設定・セーブ」→「📲データの移動」、またはゲーム中のメニューの「セーブ」から。','タイトルの「📲 データの移動」、またはゲーム中のメニューの「セーブ」から。'));
 set('fb',t=>t.replace('タイトルの「📝感想・不具合を送る」','タイトルの「📝 感想・不具合を送る」'));
 const tg=GUIDE.find(x=>x[0]==='time');if(tg)tg[1]='プレイ時間の目安';})();

// ----- 設定・セーブ：中身を「音／見た目・文字／セーブ／その他」に分けて、切りかえで表示 -----
const SET_GROUPS=[['snd','🔊 音',['音量','音楽','効果音・環境音']],['look','🎨 見た目・文字',['画面','文字の種類','文字の大きさ','見た目']],['save','💾 セーブ',['セーブデータ','もしものとき']],['etc','ℹ️ その他',['その他']]];
let SET_TAB='snd';
function setGroup(){const m=$('#mcard');if(!m||m.dataset.kind==='set2')return;const h2=m.querySelector('h2');if(!h2||!/設定/.test(h2.textContent))return;
 // データの移動はタイトルに独立したので、ここからは外す
 m.querySelectorAll('[data-act="transfer"]').forEach(b=>b.remove());
 const panes={};for(const [k] of SET_GROUPS){const d=document.createElement('div');d.className='spane';d.dataset.pane=k;panes[k]=d}
 const kids=[...m.children];let cur=null;const close=m.querySelector('.b.pri[data-act="close"]');
 for(const el of kids){if(el===h2||el.classList.contains('mcat')||el.classList.contains('xclose')||el.classList.contains('mnav')||el===close)continue;
  if(el.tagName==='H3'){const t=el.textContent.trim();const g=SET_GROUPS.find(x=>x[2].some(n=>t.startsWith(n)));cur=g?g[0]:(cur||'etc')}
  if(!cur){const t=(el.textContent||'');cur=/音|BGM/.test(t)?'snd':'etc'}
  panes[cur].appendChild(el)}
 const bar=document.createElement('div');bar.className='subtabs settabs';bar.setAttribute('role','tablist');bar.innerHTML=SET_GROUPS.filter(([k])=>panes[k].children.length).map(([k,n])=>`<button class="stab" type="button" data-settab="${k}" aria-pressed="${k===SET_TAB}">${n}</button>`).join('');
 const body=document.createElement('div');body.className='fbody';for(const [k] of SET_GROUPS){if(!panes[k].children.length)continue;panes[k].hidden=k!==SET_TAB;body.appendChild(panes[k])}
 if(!body.querySelector(`[data-pane="${SET_TAB}"]`)){SET_TAB='snd';const p=body.querySelector('[data-pane="snd"]');if(p)p.hidden=false}
 h2.after(bar);bar.after(body);if(close)close.remove();m.classList.add('fixedsize');m.dataset.kind='set2'}
{const _ss59=showSettings;showSettings=function(){const r=_ss59.apply(this,arguments);setTimeout(setGroup,90);return r}}
document.addEventListener('click',e=>{const b=e.target.closest('[data-settab]');if(!b)return;SET_TAB=b.dataset.settab;const m=$('#mcard');m.querySelectorAll('[data-settab]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));m.querySelectorAll('.spane').forEach(p=>p.hidden=p.dataset.pane!==SET_TAB);const f=m.querySelector('.fbody');if(f)f.scrollTop=0});
// 設定の中で中身が描きかわったとき（音量の変更など）も、まとめ直す
document.addEventListener('click',e=>{if(!e.target.closest('#mcard'))return;setTimeout(()=>{const m=$('#mcard');if(m&&m.dataset.kind!=='set2'){const h2=m.querySelector('h2');if(h2&&h2.textContent==='設定・セーブ')setGroup()}},120)});

// ----- タイトル：「📲 データの移動」を独立したボタンに -----
(function(){const grid=document.querySelector('.tgrid');if(!grid||grid.querySelector('[data-act="transfer"]'))return;grid.classList.remove('tgrid3');grid.classList.add('tgrid4');
 const b=document.createElement('button');b.className='b';b.type='button';b.dataset.act='transfer';b.textContent='📲 データの移動';grid.appendChild(b)})();

// ----- アップデート情報の「昔の版で遊ぶ（おまけ）」を最新に -----
OLD_VERS.length=0;
[['v2.0','versions/v2.0/','賞・大計画・超大企業が加わった版'],['v1.4','versions/v1.4/','会社の社員・支社・オフィスのレイアウト、買収と合併が加わった版'],['v1.3','versions/v1.3/','会社で作るもの（ゲーム・アプリなど）と、ひみつの実績が加わった版'],
 ['v1.2.3','versions/v1.2/','セーブスロットと、SNSの運営会社の買収が加わった版'],['v1.1.8','versions/v1.1/','出来事1000種類・チュートリアル・サブスクが加わった版'],['v1.0','versions/v1.0/','グラフィックと音楽を一新した版'],['v0.10','versions/v0.10/','流行・投稿の企画・コラボが加わった版'],
 ['v0.9','versions/v0.9/','感想フォームと推定プレイ時間が加わった版'],['v0.8','versions/v0.8/','研究とスキルツリーが加わった版'],['v0.7','versions/v0.7/','生まれる時代の選択・会社・新しいまちの開発が加わった版'],['v0.6','versions/v0.6/','人生の選択・目標・アルバムが加わった版'],
 ['v0.5','versions/v0.5/','子ども時代のおこづかいが加わった版'],['v0.4','versions/v0.4/','出来事が大きくふえた版'],['v0.3','versions/v0.3/','5つのタブとお店の経営が加わった版'],['v0.2','versions/v0.2/','国・時代・まちづくりが加わった版']].forEach(v=>OLD_VERS.push(v));
if(!/^v2\.9/.test(CUR_VER))OLD_VERS.unshift(['v2.9','versions/v2.9/','v3.0で整理される前の、機能がいちばん多い版']);
showNews=function(tabk){const t=tabk||'new';const web=/^https?:$/.test(location.protocol)&&!/claude/.test(location.hostname);
 const body=t==='new'?`<p class="hint">いま遊んでいるのは最新の ${esc(CUR_VER)} です。新しい版が出ると自動で入れかわります。</p><div class="news">${CHANGELOG.map(([v,d,items],i)=>`<section class="nv ${i===0?'cur':''}"><div class="hd"><b>${esc(v)}</b><span class="muted small">${esc(d)}</span>${i===0?'<span class="chip up">いまの版</span>':''}</div><ul>${items.map(x=>`<li>${esc(x)}</li>`).join('')}</ul></section>`).join('')}</div>`
 :`<div class="card"><p class="mtext">ふだんは最新版で遊べば大丈夫です。「昔はどんなゲームだったのか」を遊んでみたいときのおまけです。
・昔の版のセーブは、いまのセーブとは別です。いまのデータは消えません。
・昔の版から戻るときは、画面のいちばん上の帯にある「最新版に戻る」を押してください。
・昔の版で遊んだデータは、その版の「引き継ぎ」でコードを作ると、最新版の「📲 データの移動」で移せます。</p></div>${web?'':'<p class="hint">※ この機能は Web版（stella46.github.io/buzz-life）でのみ使えます。</p>'}
 <div class="news">${OLD_VERS.map(([v,u,d])=>`<section class="nv"><div class="hd"><b>${esc(v)}</b></div><p class="small">${esc(d)}</p>${u&&web?`<a class="b sm" href="${u}">${esc(v)}で遊ぶ</a>`:''}</section>`).join('')}</div>`;
 const m=$('#mcard');if(!$('#modal').hidden&&m.dataset.kind==='news2'){m.querySelectorAll('[data-news]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.news===t)));const f=m.querySelector('.fbody');f.innerHTML=body;f.scrollTop=0;return}
 openModal(`<span hidden data-act="close"></span><div class="mcat life">アップデート</div><h2>アップデート情報</h2><div class="subtabs"><button class="stab" type="button" data-news="new" aria-pressed="${t==='new'}">新しくなったこと</button><button class="stab" type="button" data-news="old" aria-pressed="${t==='old'}">昔の版で遊ぶ（おまけ）</button></div><div class="fbody">${body}</div>`);
 m.classList.add('fixedsize');m.dataset.kind='news2';try{markVer()}catch(_){}};
