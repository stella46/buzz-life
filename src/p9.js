// ===== v0.3.1：タイトルの設定・セーブデータの削除 =====
function delHtml(){const hs=!!loadSaved();return `<div class="mch" id="delBox"><button class="b" type="button" data-act="delAsk" data-k="save" ${hs?'':'disabled'}>続きのセーブデータを消す${hs?'':'（セーブなし）'}</button><button class="b" type="button" data-act="delAsk" data-k="all">実績・図鑑も含めて全部消す</button></div>`}
function soundBtns(){return `<div class="mch"><button class="b" type="button" data-act="bgm">BGM：${bgmOn?'ON':'OFF'}</button><button class="b" type="button" data-act="sound">効果音：${sndOn?'ON':'OFF'}</button></div>`}
function showSettings(){openModal(`<div class="mcat life">設定</div><h2>設定</h2><h3>音量</h3>${volHtml()}${soundBtns()}<h3>セーブデータ</h3><p class="hint">このブラウザに保存されているデータを消す。消したデータは元に戻せない。</p>${delHtml()}<button class="b pri" type="button" data-act="close">閉じる</button>`)}
function showMenu(){
  if(!S||$('#scrGame').hidden)return showSettings();
  openModal(`<div class="mcat life">メニュー</div><h2>メニュー</h2><h3>音量</h3>${volHtml()}${soundBtns()}<div class="mch">
  <button class="b" type="button" data-act="autopayT">支払い：${S.autopay?'自動で払う':'自分で払う'}</button>
  <button class="b" type="button" data-act="achv">実績・図鑑</button>
  <button class="b" type="button" data-act="export">セーブデータを書き出す</button>
  <button class="b" type="button" data-act="credit">出典・クレジット</button>
  <button class="b" type="button" data-act="totitle">タイトルへ戻る（自動保存されています）</button></div>
  <h3>セーブデータ</h3><p class="hint">消したデータは元に戻せない。残したいときは先に「書き出す」で控えておく。</p>${delHtml()}
  <button class="b pri" type="button" data-act="close">閉じる</button>`);
}
function doDelete(k){
  try{localStorage.removeItem(CFG.save)}catch(e){}
  if(k==='all'){try{localStorage.removeItem('nipporia-meta-v1')}catch(e){}META={ach:{},seen:{},titles:{},lives:0,best:0,bestF:0}}
  if(S&&!$('#scrGame').hidden){setSpeed(0);skipping=false;S=null;showScreen('title')}
  initTitle();
}
document.addEventListener('click',e=>{
  const t=e.target.closest('button');if(!t)return;const a=t.dataset.act;
  if(a==='settings'){showSettings();return}
  if(a==='delMenu'){openModal(`<div class="mcat life">セーブデータ</div><h2>セーブデータを消す</h2><p class="hint">このブラウザに保存されているデータを消す。消したデータは元に戻せない。</p>${delHtml()}<button class="b pri" type="button" data-act="close">閉じる</button>`);return}
  if(a==='delAsk'){const k=t.dataset.k;$('#delBox').innerHTML=`<div class="card warn"><p class="mtext">${k==='all'?'続きのセーブデータに加えて、実績・図鑑・称号・最高記録もすべて消えます。':'今遊んでいる人生の続きが消えます。実績・図鑑は残ります。'}\n本当に消しますか？</p><div class="row"><button class="b sm danger" type="button" data-act="delYes" data-k="${k}">消す</button><button class="b sm" type="button" data-act="delNo">やめる</button></div></div>`;return}
  if(a==='delNo'){$('#delBox').outerHTML=delHtml();return}
  if(a==='delYes'){const k=t.dataset.k;doDelete(k);openModal(`<div class="mcat life">設定</div><h2>消しました</h2><p class="mtext">${k==='all'?'セーブデータと実績・図鑑をすべて消しました。':'続きのセーブデータを消しました。'}</p><button class="b pri" type="button" data-act="close">閉じる</button>`);return}
});
// ===== v0.3.3：アップデート情報 =====
const CHANGELOG=[
  ['v0.5','2026年10月22日',['13歳までの子ども時代を充実：新しい行動「宿題・自由研究」「動画ごっこ」「お手伝い」「秘密基地づくり」。小学生の自由な時間を3枠に','子どもの「お金」タブはおこづかい画面に。駄菓子・漫画・ゲームソフトなどを買える。お手伝いでおこづかいが増える','18歳未満はお金を借りる選択肢が出ないように。足りないときは家族が払ってくれる','時間の進み方に「3か月ずつ（早く進める）」を追加','子ども時代の出来事を28個追加し、子どものうちは出来事が少し多めに起こるように']],
  ['v0.4','2026年10月22日',['過去のバージョンを選んで遊べるように（タイトルの「ほかのバージョンで遊ぶ」）。セーブは版ごとに別々','新しい版になったとき、前のセーブを自動で保管。「更新前のセーブに戻す」で戻せる','出来事を約170個追加して500個以上に（お金・住まい・お店の経営・事務所・バイトや行動の中身・家族・学校・健康・SNS・世界・老後・ニュース）']],
  ['v0.3.3','2026年10月22日',['タイトル画面に「アップデート情報」を追加']],
  ['v0.3.2','2026年10月21日',['タイトル画面に「セーブデータを消す」ボタンを追加']],
  ['v0.3.1','2026年10月21日',['タイトル画面に「設定」を追加（BGM・効果音の音量とON/OFF）','セーブデータを消せるように（続きだけ／実績・図鑑も含めて全部）']],
  ['v0.3','2026年10月21日',['画面を「予定・発信・お金・事業・人生」の5つのタブに整理。お知らせとバッジを追加','行動ごとに「何をするか」を選べるように（勉強・遊び・運動・バイト・投稿の企画など）。「副業」「お店に立つ」を追加','毎月の請求書を自分で払う仕組み（遅れると延滞金・信用スコア低下・強制取り立て）。自動支払いも選べる','お金の使い道を追加：暮らしの買い物・住まい（引っ越し・持ち家）・サブスク・保険・投資・ローン・寄付・仕送り','お店の経営：価格・営業時間・広告・店員の数を決められる。客数・売上・利益・★評価の月次結果、新メニュー開発、SNSでの宣伝','所属タレントの育成方針と案件取り','BGMと効果音の音量調整']],
  ['v0.2','2026年10月21日',['舞台を選べるように（ニッポリア・日本・現実の8か国・架空の5か国）、難易度4段階','自由に決めて生まれるモード','エンドレス（子どもに引き継いで続ける世代交代）と家系図','まちの地図に建物を建てて発展させる。商店街の顔→観光大使→市長→国の文化アドバイザー','事務所・スタッフ・所属タレント、研究ツリー20項目','実績・出来事図鑑・称号。条件を満たすと新しい舞台や難易度が解放','オリジナルのBGM6曲','出来事を約95個から338個に','倍速中でもイベントで止められるように','ゲーム名を「Buzz人生シミュレーター」に。ブラウザで開くだけで遊べ、ホーム画面に追加すればオフラインでも遊べるように']],
  ['v0.1','2026年10月21日',['最初の試作版。架空の国ニッポリアにランダムに生まれ、誕生から一生を終えるまで遊べる','13歳までは素質を貯める／家族チャンネル、13歳でSNSデビュー','架空SNS3種、バズ・炎上・PR案件・流行・ライバル','機材ショップ、進学・就職・専業クリエイター、恋愛・結婚・子ども','統計を参考にした寿命や病気、人生の振り返り画面と共有画像']]
];
const CUR_VER=CHANGELOG[0][0];
function verSeen(){try{return localStorage.getItem('nipporia-ver-seen')===CUR_VER}catch(e){return true}}
function markVer(){try{localStorage.setItem('nipporia-ver-seen',CUR_VER)}catch(e){}const b=document.querySelector('[data-act="news"] .badge');if(b)b.remove()}
function showNews(){openModal(`<div class="mcat life">アップデート情報</div><h2>これまでのアップデート</h2><div class="news">${CHANGELOG.map(([v,d,items],i)=>`<section class="nv ${i===0?'cur':''}"><div class="hd"><b>${esc(v)}</b><span class="muted small">${esc(d)}</span>${i===0?'<span class="chip up">最新</span>':''}</div><ul>${items.map(x=>`<li>${esc(x)}</li>`).join('')}</ul></section>`).join('')}</div><button class="b pri" type="button" data-act="close">閉じる</button>`);markVer()}
document.addEventListener('click',e=>{const t=e.target.closest('button');if(t&&t.dataset.act==='news')showNews()});
(function(){const b=document.querySelector('[data-act="news"]');if(b&&!verSeen()){const s=document.createElement('span');s.className='badge';s.textContent='NEW';b.appendChild(s)}const v=document.querySelector('#scrTitle .ver');if(v)v.textContent='試作版 '+CUR_VER+' ／ 遊び方や変更点は「アップデート情報」へ'})();
