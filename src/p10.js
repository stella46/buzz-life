// ===== v0.4：セーブの自動保管・過去のバージョン =====
const BK_KEY='nipporia-save-backup';
(function(){try{const last=localStorage.getItem('nipporia-ver-last');const sv=localStorage.getItem(CFG.save);
  if(last!==CUR_VER){if(sv)localStorage.setItem(BK_KEY,JSON.stringify({ver:last||'v0.3.3以前',at:Date.now(),data:sv}));localStorage.setItem('nipporia-ver-last',CUR_VER)}}catch(e){}})();
function backupInfo(){try{const o=JSON.parse(localStorage.getItem(BK_KEY)||'null');if(!o||!o.data)return null;const d=JSON.parse(o.data);return {ver:o.ver,at:o.at,name:d.name,age:Math.floor((d.am||0)/12),raw:o.data}}catch(e){return null}}
function backupHtml(){const b=backupInfo();if(!b)return '<p class="hint">更新前のセーブの控えはまだない（新しい版が出たときに自動で取られる）。</p>';const dt=new Date(b.at);return `<div class="mch" id="bkBox"><button class="b" type="button" data-act="bkAsk">更新前のセーブに戻す（${esc(b.ver)}・${esc(b.name||'')} ${b.age}歳・${dt.getMonth()+1}/${dt.getDate()}に保管）</button></div>`}
function delHtml(){const hs=!!loadSaved();return `<div class="mch" id="delBox"><button class="b" type="button" data-act="delAsk" data-k="save" ${hs?'':'disabled'}>続きのセーブデータを消す${hs?'':'（セーブなし）'}</button><button class="b" type="button" data-act="delAsk" data-k="all">実績・図鑑も含めて全部消す</button></div><h3>更新前のセーブ</h3>${backupHtml()}`}

const OLD_VERS=[
  ['v0.7','versions/v0.7/','時代の選択・会社・新しいまちの開発・遊び方が入った版（スキルツリーや感想フォームはまだない）'],
  ['v0.6','versions/v0.6/','人生の選択・目標・ファン層・アルバム・まちのイベントが入った版（時代の選択・会社・新しいまちの開発はまだない）'],
  ['v0.5','versions/v0.5/','子ども時代の行動・おこづかい画面が入った版（人生の選択・目標・ファン層・アルバムなどはまだない）'],
  ['v0.4','versions/v0.4/','過去のバージョン選択・セーブの自動保管・出来事504個が入った版（子ども時代の新しい行動やおこづかい画面はまだない）'],
  ['v0.3','versions/v0.3/','5つのタブ・請求書の支払い・お店の経営・行動の中身が入った版（タイトルの設定や削除ボタンはまだない）'],
  ['v0.2','versions/v0.2/','世界の国・世代交代・まち・会社・研究・実績が入った版（請求書やお店の経営はまだない。タブは8つ）'],
  ['v0.1',null,'最初の試作版。公開の仕組みを作る前の版なので、残っていない']
];
function showVersions(){
  const web=/^https?:$/.test(location.protocol)&&!/claude/.test(location.hostname);
  openModal(`<div class="mcat life">バージョン</div><h2>ほかのバージョンで遊ぶ</h2><p class="hint">昔の版をそのまま遊べる。セーブデータは版ごとに別々に保存されるので、今のデータには影響しない。${web?'':'\n※この機能はWeb版（stella46.github.io/buzz-life）でだけ使える。'}</p>
  <div class="news"><section class="nv cur"><div class="hd"><b>${esc(CUR_VER)}</b><span class="chip up">いま遊んでいる版</span></div><p class="small">最新版</p></section>
  ${OLD_VERS.map(([v,u,d])=>`<section class="nv"><div class="hd"><b>${esc(v)}</b></div><p class="small">${esc(d)}</p>${u&&web?`<a class="b sm" href="${u}">${esc(v)}で遊ぶ</a>`:''}</section>`).join('')}</div>
  <button class="b pri" type="button" data-act="close">閉じる</button>`);
}
document.addEventListener('click',e=>{const t=e.target.closest('button');if(!t)return;const a=t.dataset.act;
  if(a==='versions'){showVersions();return}
  if(a==='bkAsk'){$('#bkBox').innerHTML=`<div class="card warn"><p class="mtext">今の続きのセーブが、更新前に取っておいたセーブに置き換わります。\n今の続きを残したいときは、先に「セーブデータを書き出す」で控えておく。\n戻しますか？</p><div class="row"><button class="b sm danger" type="button" data-act="bkYes">戻す</button><button class="b sm" type="button" data-act="bkNo">やめる</button></div></div>`;return}
  if(a==='bkNo'){$('#bkBox').outerHTML=backupHtml();return}
  if(a==='bkYes'){const b=backupInfo();if(b){try{localStorage.setItem(CFG.save,b.raw)}catch(e){}if(S&&!$('#scrGame').hidden){setSpeed(0);S=null;showScreen('title')}initTitle();openModal(`<div class="mcat life">セーブデータ</div><h2>戻しました</h2><p class="mtext">更新前のセーブ（${esc(b.name||'')} ${b.age}歳）に戻した。「つづきから」で遊べる。</p><button class="b pri" type="button" data-act="close">閉じる</button>`)}return}
});
