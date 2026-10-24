
// ===== v2.8：遊び方の更新・データの移動をわかりやすく・感想と不具合の報告を独立 =====

// ----- 遊び方（全面更新） -----
(function(){const keep=k=>(GUIDE.find(g=>g[0]===k)||[k,'',''])[2];const stage=keep('stage');GUIDE.length=0;
 const G=(k,n,t)=>GUIDE.push([k,n,t]);
 G('basic','はじめに',`ランダムな国・家庭・時代に生まれて、一生を過ごすシミュレーションです。
・画面の上の「次へ」で1か月進みます。▶で自動で進み、「イベントまで」で次の出来事まで早送りします（パソコンは P キーで止められます）。
・出来事が起きると止まるので、選択肢を選びます。選んだ道で、能力・性格・人間関係が変わります。
・6歳までは自動で育ちます。6歳から「予定」で行動を選べます。13歳ごろからSNSを始められます。
・何をすればいいか迷ったら、画面の上の「🧭道のり」を開くと、次の目標がわかります。
・機能の場所がわからないときは「🔎さがす」、どの画面へもすぐ行きたいときは「⚡移動」が便利です。
・データは月が進むたびに自動で保存されます。`);
 G('time','プレイ時間の目安','');
 G('road','遊びの順番',`遊びの順番の目安です（「🧭道のり」と同じです）。順番どおりでなくても大丈夫です。
① 子ども時代（0〜12歳）：学校・遊び・習いごとで素質をのばす
② SNSデビュー（13歳〜）：アカウントを作り、予定に「投稿」を入れる
③ 大人の暮らし（18歳〜）：仕事か専業クリエイターに。請求書は自動払いが楽です
④ 人気者へ：フォロワー1万人・10万人を目指す。コラボや流行が近道です
⑤ お店とまち：お店を建てて、まちを発展させる
⑥ 会社の社長（20歳〜）：会社を作って、作品と社員をふやす
⑦ 家族と仲間：つながりで交流し、恋人・結婚・子どもへ
⑧ 世界へ：100万人をこえたら海外へ進出。賞もねらえます
⑨ 世界を動かす：大計画でインフラを整え、人口をふやす
⑩ 銀河へ：京・垓のお金で、宇宙の果てまで
⑪ 次の世代へ：エンドレスにすると、子どもとして続けられます`);
 G('act','予定（行動）',`毎月の自由な時間に何をするかを決めます。
・予定の決め方は4種類から選べます。
　いつもの枠：枠ごとに行動を選ぶ
　いつもの予定＋今月だけ：ふだんの予定はそのまま、変えたい月だけ「今月だけ」
　割合で決める：「投稿50%・休み25%」のように配分する
　割合＋今月だけ：ふだんは割合、変えたい月だけ「今月だけ」
・いちばん上に、秘書のアオイが「いまやるといいこと」を1つ出します。
・「🤖まるごとおまかせ」で、研究・スキル・まち・お店・会社・大計画・つながりを、分野ごとにまかせられます。
・「時間の進み方」では、1ターンの長さ、出来事のおまかせ（種類ごとに止めない）、推定プレイ時間を見られます。`);
 G('sns','発信（SNS）',`SNSでフォロワーをふやします。
・「発信」タブで、ジャンル・スタイル・投稿の企画を決め、「予定」に「投稿」を入れた月に投稿します。
・流行のジャンルで投稿すると伸びやすくなります。コラボをすると新しいファンが来ます。
・フォロワーがふえると、「世界の舞台」から海外へ進出できます（アジア→北米→…→全世界）。進出するほど、届けられる人数の上限が広がります。
・バズったとき、まれに「世界的バズ」が起きて一気にふえます。
・SNSの名前は、運営会社を買収すると変えられます。`);
 G('money','お金',`・家計：毎月の請求書を払います。自動払いにしておくと楽です。
・使い道・買い物・部屋の飾り・投資・借入（借入は18歳から）があります。
・金額は、万・億・兆・京・垓で表示します。
・18歳になるまでにお金が足りなくなると家族が立て替えてくれますが、その分は大人になってから少しずつ返します（利息はありません）。
・お金に余裕ができたら、各画面の「💎とんでもなく高額なアクション」も使えます。`);
 G('biz','事業',`「事業」タブは、上の段で分野を選び、下の段で画面を選びます。
・まち：まちの地図・お店の経営。建物をふやすとまちが発展します。お店に店長を置くと管理をまかせられます。
・会社：会社（最大30社）・事務所・サブスク事業（最大30個）。会社では作るもの（ゲーム・アプリなど）と社員を決めます。大きくなるとLv12の超大企業になります。同じ分野のライバル企業も現れます。
・挑戦：賞・イベント（毎年14種類の賞、自分で開くイベント）と大計画（213種類）。
・研究：研究ポイントで効果を解放します。迷ったら「⭐おすすめ」から選びます。`);
 G('life','人生',`「人生」タブは、上の段で分野を選び、下の段で画面を選びます。
・自分：能力・目標と性格・スキル。「能力」では人生の終わりのモード（亡くなったら終わり／エンドレス）を切りかえられます。
・人：つながり・相関図と弟子・人生の選択（恋人探し・転職・引っ越しなど）。
・記録：世界・ランキング・アルバム・記録。`);
 G('people','つながり（家族・友達）',`「人生」→「人」→「つながり」で、家族・恋人・友達・子どもと交流します。
・交流は毎月3回まで（65歳からは4回）。予定の枠は使いません。同じ人とは月1回までです。
・話す・出かける・プレゼント・デートなどで、仲のよさが上がります。
・「友達をつくる」で新しい友達ができることがあります。恋人探しや、子どもを授かることを考えるのもここからできます。
・自分のための時間（休む・体を動かす・自分みがき・学び）も選べます。`);
 G('world','世界進出とランキング',`・発信タブの「世界の舞台」から、7つの地域へ順に進出できます。
・「人生」→「記録」→「世界・ランキング」で、世界の配信者ランキング・長者番付・企業ランキング、今月のようす、最近のハイライトを見られます（ランキングの相手は架空の人物・企業です）。
・登録者・資産・社員数が大きな節目をこえると、身近なものにたとえてお祝いが出ます。`);
 G('mega','大計画',`とてつもないお金と年月がかかる計画です（全213種類）。
・分類：宇宙・地球・夢・社会・ぜいたく・エンタメ・ふしぎ・インフラ・人口・銀河。
・インフラ（エネルギー・水・食料など）を整えると、人口をふやす計画を始められます。全世界に進出していれば、人口がふえるほど届けられる人数も広がります。
・画面では、いま始められるもの・建設中のものが上に出て、まだ先の計画と完成した計画はたたまれています。`);
 G('skill','研究とスキル',`・研究：研究ポイント（10歳からたまる）で、効果や新しい機能を解放します。全部で約300個あります。
　「⭐おすすめ」タブには、いまの遊び方に合った研究が5つ出ます。
　研究ラインは1行に1本で、次の段だけが表示されます。
・スキル：スキルポイントで、この人生だけのスキルを覚えます（「人生」→「自分」→「スキル」）。
・引き継ぎスキル：人生を終えるとたまるポイントで覚える、すべての人生で有効なスキルです（タイトルの「実績・引き継ぎスキル」）。`);
 G('auto','便利な機能',`・🧭道のり：遊びの順番と次の目標。「行く」でその画面へ。
・🔎さがす：機能や用語を検索。「開く」でその画面へ。
・⚡移動：どのタブのどの画面へもすぐ移動。
・秘書のアオイ：予定タブの上で、いまやるといいことを1つ提案。
・🤖まるごとおまかせ：分野ごとに毎月の管理をまかせる。
・出来事のおまかせ：種類ごとに、よくある出来事を止めずに進める（出来事の画面からも設定できます）。
・⚙表示：各タブの説明欄から、使わない項目を隠す（この端末だけ）。`);
 G('end','人生の終わりと次の世代',`・亡くなるときに、次から選べます。
　この人生を終える／子どもに引き継ぐ（子どもがいるとき）／いまの年齢のまま続ける／時をさかのぼって続ける
・時をさかのぼる：10歳ごとに人生が保管され（最大4つ）、いまのお金を持ったまま、その年齢からやり直せます。
・エンドレス：子どもとして人生を続けます。お金・事務所・まち・研究も引き継がれます。50歳をすぎると、生きているうちに「この子に託す」こともできます。`);
 G('save','セーブとデータの移動',`・セーブ：月が進むたびに自動で保存されます。セーブスロットは5つあり、別々の人生を保存できます。
・データの移動（機種変更・別のブラウザ）：タイトルの「設定・セーブ」→「📲データの移動」、またはゲーム中のメニューの「セーブ」から。
　渡したい人生（セーブスロット）と、実績・図鑑・引き継ぎスキルを選んで、コードかファイルにします。
　新しい端末で「コードを貼りつけ」か「ファイルを開く」を選び、人生ごとに入れるスロットを選びます。
・昔の版（v1.2.3など）で遊んだデータも、その版の「引き継ぎ」（昔の名前）でコードを作れば、最新版に移せます。
・最新版のデータを昔の版に移すことはできません。`);
 G('fb','感想・不具合を送る',`タイトルの「📝感想・不具合を送る」、またはゲーム中のメニューから送れます。
・🐞不具合を報告：どの画面で・何が起きたかを選んで、わかる範囲で書くだけです。遊んでいる版や端末の情報は自動で添えられます。
・💬感想・アイデア：楽しさの★と、よかったところ・わかりにくいところ・ほしい機能を選べます。
・送ったものは、あとから直して送り直せます。`);
 G('stage','舞台の特徴',stage);
})();
// 「プレイ時間の目安」は、遊んでいる人生に合わせた表を出す
{const _tH55=timeHtml;timeHtml=function(){try{if(S&&S.alive&&typeof etaBox==='function')return etaBox()+'<p class="hint">「操作多め」は、いまの人生で使っている機能が多いほど長くなります。「あなたのペース」は、6か月ほど遊ぶと表示されます。</p>'}catch(_){}return _tH55.apply(this,arguments)}}
// タブの「？遊び方」から、それぞれの説明へ
Object.assign(TAB_GUIDE,{act:'act',sns:'sns',money:'money',biz:'biz',life:'life'});

// ----- データの移動（わかりやすく） -----
{const _sT55=showTransfer;showTransfer=function(msg){_sT55.apply(this,arguments);try{const m=$('#mcard');const h2=m&&m.querySelector('h2');if(!h2)return;const mc=m.querySelector('.mcat');if(mc)mc.textContent='データの移動';h2.textContent='データの移動（機種変更・別のブラウザ）';
 const used=slotsUsed().length,ach=Object.keys((META&&META.ach)||{}).length;
 const box=document.createElement('div');box.className='trinfo';box.innerHTML=`<table class="trt"><tr><th>できること</th><th></th></tr>
 <tr><td>この端末のデータを、別の端末・別のブラウザへ移す</td><td class="ok">○</td></tr>
 <tr><td>昔の版（v1.2.3・v2.0など）のデータを、最新版へ移す<small>昔の版の画面で「引き継ぎ」（昔の名前）→「コードをコピー」して、最新版で「コードを貼りつけ」</small></td><td class="ok">○</td></tr>
 <tr><td>とても古い版（v0.x・v1.0〜1.1）のコード（NIP1.〜）を読み込む<small>空いているスロットに、1つの人生として入ります</small></td><td class="ok">○</td></tr>
 <tr><td>最新版のデータを、昔の版へ移す</td><td class="ng">×</td></tr></table>
 <table class="trt"><tr><th>いっしょに移るもの</th><th>移らないもの（端末ごとの設定）</th></tr><tr><td>セーブスロット（いま${used}つの人生）・スロットの名前／実績（いま${ach}個）・図鑑・称号／引き継ぎスキル／プレイ時間の記録</td><td>音量・見た目・文字の設定／表示のカスタマイズ／時をさかのぼるための保管</td></tr></table>
 <p class="hint">渡すときは、渡す人生（セーブスロット）を選べます。受け取るときは、人生ごとに入れるスロットを選べます。実績などは「合わせる（両方の記録を残す）」「置きかえる」「受け取らない」から選べます。</p>`;
 const hint=h2.nextElementSibling;if(hint&&hint.classList.contains('hint'))hint.replaceWith(box);else h2.after(box)}catch(e){console.error(e)}}}
// タイトルの「実績・引き継ぎ」の名前を「実績・引き継ぎスキル」に、データの移動は「設定・セーブ」へ
(function(){const b=document.querySelector('[data-act="grpRec"]');if(b)b.textContent='実績・引き継ぎスキル'})();
document.addEventListener('click',e=>{const b=e.target.closest('[data-act="grpRec"],[data-act="settings"]');if(!b)return;const rec=b.dataset.act==='grpRec';setTimeout(()=>{const m=$('#mcard');if(!m)return;
 if(rec){const h=m.querySelector('h2');if(h)h.textContent='実績・引き継ぎスキル';const mc=m.querySelector('.mcat');if(mc)mc.textContent='実績・引き継ぎスキル';const t=m.querySelector('[data-act="transfer"]');if(t)t.remove()}
 for(const t of m.querySelectorAll('[data-act="transfer"]')){t.innerHTML='📲 データの移動<span class="small muted">（機種変更・別のブラウザへ。昔の版のデータも移せます）</span>'}},30)});
// ゲーム中のメニューの「引き継ぎ」の名前も合わせる
{const _mb55=menuBody;menuBody=function(){let h=_mb55.apply(this,arguments);return typeof h==='string'?h.replace(/(data-act="transfer"[\s\S]*?)引き継ぎ/,'$1データの移動'):h}}

// ----- 感想・不具合（独立した入口・2つの道） -----
const BUG_SCR=['タイトル','予定','発信','お金','事業','人生','出来事の画面','メニュー','わからない'];
const BUG_KIND=['画面が止まる・進まない','ボタンが押せない','数字がおかしい','表示が崩れる・はみ出す','セーブがおかしい・消えた','音がおかしい','文章がおかしい','その他'];
function fbEnv(withState){const ua=navigator.userAgent;const dev=/iPhone|iPad/i.test(ua)?'iPhone/iPad':/Android/i.test(ua)?'Android':/Mac/i.test(ua)?'Mac':/Windows/i.test(ua)?'Windows':'その他';
 const br=/Edg\//.test(ua)?'Edge':/Chrome\//.test(ua)?'Chrome':/Safari\//.test(ua)?'Safari':/Firefox\//.test(ua)?'Firefox':'';let s=`${CUR_VER}・${dev}${br?'・'+br:''}・画面${innerWidth}×${innerHeight}`;
 if(withState&&S&&!$('#scrGame').hidden)s+=`・${S.y}年${S.m}月・${age()}歳・タブ「${tab}${SUB[tab]?'/'+SUB[tab]:''}」`;
 try{const er=(typeof DEV_ERR!=='undefined'?DEV_ERR:[]).slice(0,3);if(withState&&er.length)s+=`\n直近のエラー：${er.join(' ／ ')}`}catch(_){}return s}
function showFbHub(){const n=fbList().length;openModal(`<div class="mcat life">感想・不具合</div><h2>感想・不具合を送る</h2><p class="hint">送られた内容は開発者だけが見ます。お名前は書かなくても大丈夫です。</p>
 <div class="mgrid fbhub">${menuTile('fbBug','🐞','不具合を報告する','うまく動かない・おかしいところ')}${menuTile('fbIdea','💬','感想・アイデアを送る','楽しかったこと・ほしい機能')}</div>
 ${n?`<div class="row"><button class="b sm" type="button" data-act="fbMine">送ったもの（${n}件）を見る・直す</button></div>`:''}<button class="b pri" type="button" data-act="close">閉じる</button>`)}
function chips(name,list,multi){return `<div class="fbchips">${list.map(x=>`<label class="fbc"><input type="${multi?'checkbox':'radio'}" name="${name}" value="${esc(x)}"><span>${esc(x)}</span></label>`).join('')}</div>`}
function fbName(){try{return localStorage.getItem(FB_KEY+'-name')||''}catch(_){return ''}}
function showBugForm(){const cur=S&&!$('#scrGame').hidden?({act:'予定',sns:'発信',money:'お金',biz:'事業',life:'人生'}[tab]||''):'タイトル';
 openModal(`<div class="mcat life">不具合の報告</div><h2>🐞 不具合を報告する</h2><p class="hint">わかる範囲で大丈夫です。①と②を選ぶだけでも送れます。</p>
 <fieldset class="fbset"><legend>① どの画面で起きましたか？</legend>${chips('bugScr',BUG_SCR,false).replace(`value="${cur}">`,`value="${cur}" checked>`)}</fieldset>
 <fieldset class="fbset"><legend>② 何が起きましたか？（いくつでも）</legend>${chips('bugKind',BUG_KIND,true)}</fieldset>
 <fieldset class="fbset"><legend>③ くわしく（任意）</legend><textarea id="bugText" rows="4" maxlength="1500" placeholder="例：会社の画面で「始める」を押したら、何も起きなかった。もう一度押しても同じだった。"></textarea><p class="hint small">「何をしたら」「どうなったか」「本当はどうなってほしいか」があると、直しやすくなります。</p></fieldset>
 <label class="fld"><span>お名前（任意）</span><input id="fbName" maxlength="20" value="${esc(fbName())}"></label>
 <label class="fld chk"><input type="checkbox" id="bugEnv" checked> <span>遊んでいる版・端末・ゲームの状態を一緒に送る（直すのに役立ちます）</span></label><p class="hint small fbenv">${esc(fbEnv(true))}</p>
 <div class="mch"><button class="b pri" type="button" data-act="bugSend">送る</button><button class="b ghost" type="button" data-act="fbHub">もどる</button></div>`)}
function showIdeaForm(){const q=k=>FBQ2.find(x=>x.k===k);openModal(`<div class="mcat life">感想・アイデア</div><h2>💬 感想・アイデアを送る</h2><p class="hint">あてはまるところを選ぶだけでも送れます。</p>
 <div class="fld"><span>楽しさ（任意）</span><div class="seg" id="fbStars">${[1,2,3,4,5].map(i=>`<button type="button" data-fbstar="${i}">${'★'.repeat(i)}</button>`).join('')}</div></div>
 <fieldset class="fbset"><legend>よかったところ</legend>${chips('ideaGood',q('good').c.concat(['世界進出・ランキング','大計画','つながり（交流）','おまかせ・道のり']),true)}</fieldset>
 <fieldset class="fbset"><legend>わかりにくい・つまらないところ</legend>${chips('ideaBad',q('bad').c.concat(['機能が多すぎる']),true)}</fieldset>
 <fieldset class="fbset"><legend>ほしい機能・アイデア</legend>${chips('ideaWant',q('want').c,true)}</fieldset>
 <fieldset class="fbset"><legend>自由に（任意）</legend><textarea id="ideaText" rows="4" maxlength="1500" placeholder="なんでもどうぞ"></textarea></fieldset>
 <label class="fld"><span>お名前（任意）</span><input id="fbName" maxlength="20" value="${esc(fbName())}"></label>
 <div class="mch"><button class="b pri" type="button" data-act="ideaSend">送る</button><button class="b ghost" type="button" data-act="fbHub">もどる</button></div>`);FB_STAR=0}
const vals=n=>[...document.querySelectorAll(`[name="${n}"]:checked`)].map(x=>x.value);
async function fbSubmit(f,info,env){const name=(($('#fbName')||{}).value||'').trim();try{localStorage.setItem(FB_KEY+'-name',name)}catch(_){}
 const list=fbList();const it={id:Date.now().toString(36).slice(-6).toUpperCase(),f,name,star:FB_STAR||0,info,env,rev:0,at:Date.now()};list.push(it);fbSaveList(list);
 let how='';const row=fbRow(it);if(FB_URL){try{if(!navigator.onLine)throw 0;await fbPost(row);how='送信しました。ありがとうございます！'}catch(_){fbSetQueue(fbQueue().concat([row]));how='いまは通信できないようです。つながったときに自動で送ります。'}}
 else{try{await navigator.clipboard.writeText(fbText(it));how='文章をコピーしました。開発者に送ってください。'}catch(_){how='送れませんでした。'}}
 openModal(`<div class="mcat life">感想・不具合</div><h2>ありがとうございます！</h2><p class="mtext">${esc(how)}\n受付番号：#${esc(it.id)}\nあとで直したくなったら「送ったもの」から直せます。</p><div class="mch"><button class="b" type="button" data-act="fbHub">ほかにも送る</button><button class="b pri" type="button" data-act="close">閉じる</button></div>`)}
document.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;const a=b.dataset.act;
 if(a==='fbHub'||a==='grpEtc'){e.stopImmediatePropagation();showFbHub();return}
 if(a==='fbBug'){showBugForm();return}if(a==='fbIdea'){showIdeaForm();return}
 if(a==='bugSend'){const sc=vals('bugScr'),k=vals('bugKind'),t=(($('#bugText')||{}).value||'').trim();if(!k.length&&!t){toast('②で起きたことを選ぶか、③に書いてください');return}const info=$('#bugEnv').checked;fbSubmit({bug:{c:k,s:sc,t}},info,info?fbEnv(true):'');return}
 if(a==='ideaSend'){const g=vals('ideaGood'),bd=vals('ideaBad'),w=vals('ideaWant'),t=(($('#ideaText')||{}).value||'').trim();if(!FB_STAR&&!g.length&&!bd.length&&!w.length&&!t){toast('どこか1つ選ぶか、書いてください');return}fbSubmit({good:{c:g,t:''},bad:{c:bd,t:''},want:{c:w,t:''},other:{c:[],t}},true,fbEnv(false));return}},true);
// 古い入口（data-act="fb"）も新しい画面へ。送ったものの「直す」は、これまでの画面を使う
{const _fbF55=fbForm;fbForm=function(item){if(item)return _fbF55.apply(this,arguments);showFbHub()}}
// タイトルのボタン：「感想・その他」→「📝 感想・不具合を送る」、クレジットは「設定・セーブ」へ
(function(){const b=document.querySelector('[data-act="grpEtc"]');if(b){b.textContent='📝 感想・不具合を送る';b.classList.add('fbtitle')}})();
document.addEventListener('click',e=>{const b=e.target.closest('[data-act="settings"]');if(!b)return;setTimeout(()=>{const m=$('#mcard');if(!m||m.querySelector('[data-act="credit"]'))return;const c=m.querySelector('.b.pri[data-act="close"]');if(c)c.insertAdjacentHTML('beforebegin',`<h3>その他</h3><div class="mch"><button class="b" type="button" data-act="credit">出典・クレジット</button></div>`)},40)});
try{FIND.push(['感想・不具合を送る','タイトル・メニュー',null,'不具合の報告と、感想・アイデア','バグ 報告 問い合わせ'],['データの移動','タイトル → 設定・セーブ',null,'機種変更や別のブラウザへ、すべてのデータを移す','引き継ぎ 機種変更 バックアップ']);const t=FIND.find(x=>x[0]==='引き継ぎコード');if(t){t[0]='データの移動（コード）'}}catch(_){}

// 不具合の報告は、見出しを「不具合報告」に
{const _ft55=fbText;fbText=function(it){const t=_ft55.apply(this,arguments);try{const f=it.f||{};const onlyBug=f.bug&&!['good','bad','want','other'].some(k=>f[k]&&((f[k].c&&f[k].c.length)||f[k].t));if(onlyBug)return t.replace('Buzz人生シミュレーター 感想','Buzz人生シミュレーター 不具合報告')}catch(_){}return t}}
