
// ===== v1.1.4：投稿タイトルを各ジャンル50種類に =====
Object.entries({
 game:['実況しながら晩ごはん','ラスボスに{n}回挑む','視聴者の名前で冒険','{o}縛りで遊ぶ','友達に教えながらプレイ','初期装備だけでクリア','{n}秒で解けるパズル','ホラーゲームで絶叫','{s}限定イベントを全部回る','レトロゲームの魅力','ゲーム音楽を語る','{n}人対戦の大乱闘','新キャラを使ってみた','攻略本なしで挑戦','コメントの指示どおりに動く','ゲームの中で家を建てる','街づくりゲームで理想の町','{n}日目のサバイバル','最初の{n}分だけ遊ぶ','おすすめゲーム{n}選','実況者あるある','神プレイが出た瞬間','目かくしプレイ（音だけ）','苦手ジャンルに挑戦','ゲームの舞台を旅する気分で','{n}連勝するまで終われない','釣りゲームで大物を狙う','ゲームの中の料理を再現','久しぶりに続きから','クリア後の世界を探索'],
 cook:['{f}をお店の味に','{n}円で{n}日分','{s}の作り置きおかず','朝ごはん{n}パターン','余った{f}の活用法','お弁当のおかず{n}品','寒い日のあったかスープ','暑い日のさっぱりめん','{p}で食べた味を再現','包丁を使わないレシピ','炊飯器で{f}','子どもと作るおやつ','一人暮らしの1週間ごはん','フライパン1つで','{f}を巨大化してみた','和食の基本','世界の朝ごはん','味噌汁を{n}通り','パーティーの盛り付け','冷凍保存のコツ','{s}の果物でデザート','失敗したけど食べられた','おばあちゃんのレシピ','10年使える道具紹介','ホットプレートで{f}','{n}分で3品','屋外でキャンプ飯','材料費の比べっこ','{f}の歴史を調べながら','ふわふわ卵のコツ'],
 beauty:['{n}日間のスキンケア記録','{s}の新作コスメ','メイク道具の手入れ','似合う髪型診断','前髪カットに挑戦','{p}に合うコーデ','色の組み合わせ{n}選','プチプラとデパコス比べ','香りの選び方','{n}着で着回し','小物で印象チェンジ','お出かけ前の30分','学校に行く日の身だしなみ','面接の日の身だしなみ','{s}の紫外線対策','髪をきれいに乾かすコツ','眉の整え方','マスクに合うメイク','古着屋めぐり','服の手入れと収納','{n}年前の写真を再現','眠たい朝の時短','肌にやさしい落とし方','ヘアアクセを手作り','季節の変わり目のケア','家族をコーディネート','手のケア','似合う眼鏡の選び方','クローゼット大公開','すっきり見える姿勢'],
 talk:['{n}時間しゃべり続ける','夜ふかし雑談','{s}にしたいこと','子どもの頃の夢','最近の小さな幸せ','言われてうれしかった言葉','{p}で迷子になった話','苦手なものの克服','好きな食べ物ランキング','{n}年前の自分へ','視聴者と同時に晩ごはん','朝のあいさつだけ配信','おすすめの本の話','人見知りの直し方','緊張しない話し方','{o}にまつわる思い出','一日を振り返る','最近びっくりしたこと','友達とのけんかの話','ありがとうを伝える回','未来の自分に手紙','100の質問 その{n}','好きな季節の話','家族の面白エピソード','ゆっくり話す夜','今年の目標を宣言','{n}個の秘密','初めての一人旅の話','仕事の悩み聞きます','笑いすぎて泣いた話'],
 study:['{n}分で覚える漢字','数学が好きになる話','理科のふしぎ{n}選','{s}の星座','歴史の人物をやさしく','地理クイズ{n}問','英語の言い回し','プレゼンのコツ','読書感想文の書き方','時間割の立て方','集中力を上げる方法','{p}の成り立ち','天気のしくみ','法律のきほん（やさしく）','税金ってなに？','選挙のしくみ','体のしくみ','食べ物の栄養','{o}ができるまで','受験の振り返り','暗算チャレンジ','間違えやすい日本語','世界の言葉であいさつ','一緒に{n}問解こう','ノートをまとめる回','まちがい探しで頭の体操','{n}年の出来事まとめ','プログラミング入門','お金の歴史','やさしい経済ニュース'],
 music:['{s}に聴きたい歌','{n}時間歌枠','楽器の手入れ','作詞の練習','{p}で弾き語り','{n}年代の名曲風オリジナル','合唱アレンジ','リズム練習','{o}で楽器を作る','声の調子を整える','みんなで合奏','即興セッション','{n}音だけで作曲','子守歌を歌う','応援歌を作った','コード進行の話','ライブの準備','新しい楽器に挑戦','音程チャレンジ','ハモりを録音','ピアノで{n}曲メドレー','ギター初心者講座','打ち込みで1曲','{s}のテーマ曲','リクエストで即興','音楽室の思い出','ボイパに挑戦','歌の練習の記録 #{n}','ゆったりジャズ風','早口ソング'],
 comedy:['{n}秒で笑わせる','{s}の大運動会','{o}でタワーを作る','体を張らない安全チャレンジ','ものまね{n}連発','一発ギャグを考える','{p}を全力で紹介','逆再生で会話','{n}人のなりきりコント','ジェスチャーゲーム','しりとり{n}連続','無言で料理','ルーレットで決める企画','{o}の使い道を{n}個','すごろく人生ゲーム','クイズ大会','大げさな通販番組','ドッキリされた側','一日店長をやってみた','{n}文字だけで会話','謎解き脱出（家の中で）','おじいちゃんのモノマネ','{s}の替え歌','手作りの賞を発表','ひたすらリアクション','逆に褒めちぎる回','{n}秒以内に答えろ','視聴者のお題で即興','真剣にじゃんけん','爆笑ハプニング集'],
 vlog:['{p}をぶらぶら','{s}の朝散歩','{n}円で過ごす休日','カメラ1台で1日','行きつけのお店','部屋の掃除','{n}時間かけて{p}へ','雨の日の過ごし方','{s}の夕焼け','電車の旅','自転車で走る','{o}を探しに','友達と過ごした1日','帰省の記録','誕生日の過ごし方','{n}日連続の早起き','引っ越し準備','家具を組み立てる','夜の街歩き','{s}の旬を食べに行く','おすすめの散歩道','{p}のお土産','{n}年ぶりの場所','車中泊の旅','一人カフェ','図書館で過ごす午後','手帳を書く時間','{s}のベランダ','花を育てる記録','何もしない日'],
 asmr:['{s}の虫の声','たき火と雨','本棚の整理の音','{o}をさわる音','{n}分の深呼吸','ろうそくの火','スープを煮込む音','寝る前の読み聞かせ','{p}の朝','ページをめくる音 #{n}','毛糸を編む音','石けんで手を洗う音','パンを焼く音','{n}時間の雨音','木の葉が揺れる音','小川のせせらぎ','温泉の音','雪を踏む音','ペンで字を書く音','グラスに氷','{s}の夜風','布団をととのえる音','静かな作業通話','花瓶に水','時計店の音','キャンプの夜','扇風機の音','{o}を並べる音','遠くの花火','おやすみの音'],
 avatar:['{s}限定の衣装','アバターでお料理','{n}時間耐久歌枠','新しい髪型おひろめ','バーチャル{p}散歩','歌って{n}曲','コメント読み雑談','朝活配信','{o}を作るモデリング','3Dでダンス','みんなで絵しりとり','視聴者参加クイズ','新しい声に挑戦','{n}人コラボ','アバターの裏側','季節の背景替え','誕生日カウントダウン','{n}万人ありがとう','ゆったり作業','おやすみ前の短い配信','アバターで旅行','ゲーム大会','手描きの立ち絵','{s}の思い出話','雑談しながらお絵かき','新しい表情を試す','着せ替え会議','ペットアバター登場','記念ライブ','初心者さん歓迎回'],
 vr:['VR{s}祭り','仮想空間で{n}人集合','VRで料理教室','空中散歩','VR{p}めぐり','VRの中で学校','仮想の家具作り','宇宙からの景色','海底探検 #{n}','VRでボウリング','VRの迷路','仮想の動物園','雲の上でライブ','仮想空間でキャンプ','VR美術作品をつくる','VRで世界遺産','重力が逆の部屋','巨大化体験','小さくなる体験','{n}分の仮想旅行','VRでスポーツ観戦','仮想の遊園地','VRで絵を描く','{o}をVRで再現','VRでかくれんぼ','仮想のカフェ','VRで歴史体験','雪山の仮想登山','VRで楽器','仮想空間の夜景'],
 aico:['AIと{s}の献立','AIと{n}問しりとり','AIに似合う服を聞く','AIと作る歌','AIの考えた企画をやる','AIにツッコミを入れる','AIと{p}の歴史トーク','AIに勉強を教わる','AIと作戦ゲーム','AIの予想を当てる','AIと絵本をつくる','AIに{o}の使い道を聞く','AIと間違い探し','AIと名言づくり','AIとダジャレ対決','AIに旅行プラン','AIと一緒に日記','AIに未来を聞く','AIと{n}秒トーク','AIとクイズ番組','AIとロールプレイ','AIに家計を相談','AIと料理の味見（想像）','AIと宇宙の話','AIとけんか（ゲーム）','AIに褒めてもらう','AIと映画の感想','AIにあだ名をつける','AIと一緒に作曲','AIと1年を振り返る']
}).forEach(([g,l])=>{if(PT2[g])PT2[g].push(...l)});

// フォロワーを「割合」で増やす指定（1未満の数）を、人数に直す
const _ad14=ad;ad=function(k,v,cat){if(k==='f'&&v&&Math.abs(v)<1)v=Math.round(totalF()*v);return _ad14(k,v,cat)};

// ===== v1.1.4：チャンネル名・事務所の種類・タレントの契約解除・サブスク追加・自分のサブスク事業 =====

// ----- チャンネル名（SNSごとに名前を変えられる間隔がちがう） -----
const CHN_RULE={milu:{max:2,per:1,t:'1か月に2回まで'},patto:{max:1,per:1,t:'1か月に1回まで'},tsubu:{max:99,per:1,t:'いつでも（ただし、すぐ変えると見つけてもらいにくい）'},holo:{max:1,per:6,t:'6か月に1回まで'}};
function chRule(sns){return CHN_RULE[sns]||{max:1,per:3,t:'3か月に1回まで'}}
function chObj(id){if(!S.chn)S.chn={};if(id==='main'){const k=S.main;if(!S.chn[k])S.chn[k]={name:'',hist:[]};return S.chn[k]}const c=(S.subch||[]).find(x=>x.id===id);if(!c)return null;if(!c.hist)c.hist=[];return c}
function chName(id){const o=chObj(id);if(!o)return '';return o.name||(id==='main'?`${S.name}チャンネル`:'')}
function chLeft(id){const o=chObj(id),r=chRule(S.main);if(!o)return 0;const h=(o.hist||[]).filter(a=>S.am-a<r.per);return Math.max(0,r.max-h.length)}
function chNextAm(id){const o=chObj(id),r=chRule(S.main);const h=(o.hist||[]).filter(a=>S.am-a<r.per).sort((a,b)=>a-b);return h.length?h[0]+r.per:S.am}
function chRenameHtml(id){const o=chObj(id);if(!o)return '';const left=chLeft(id),r=chRule(S.main),first=!o.name&&!(o.hist||[]).length;
  return `<div class="row chren"><input id="chn_${id}" maxlength="16" placeholder="新しいチャンネル名" value=""><button class="b sm" type="button" data-chren="${id}" ${left||first?'':'disabled'}>${first?'名前をつける':'名前を変える'}</button></div><p class="hint small">${esc(SNS[S.main].n)}の名前の変更：${esc(r.t)}。${first?'最初の名前づけは回数に入らない。':left?`あと${left}回変えられる。`:`次に変えられるのは${chNextAm(id)-S.am}か月後。`}よく変えると、見つけてもらいにくくなる。</p>`}
document.addEventListener('click',e=>{const b=e.target.closest('[data-chren]');if(!b||!S)return;const id=b.dataset.chren,inp=document.getElementById('chn_'+id),o=chObj(id);if(!o||!inp)return;
  const nm=inp.value.trim().slice(0,16);if(!nm){toast('名前を入力してね');return}const first=!o.name&&!(o.hist||[]).length;if(!first&&!chLeft(id))return;
  const old=chName(id);o.name=nm;if(!first){o.hist.push(S.am);const r=chRule(S.main);const recent=o.hist.filter(a=>S.am-a<6).length;if(recent>=2){if(id==='main'){const k=S.main;S.f[k]=Math.round(S.f[k]*.99)}else o.f=Math.round((o.f||0)*.99);log('名前をよく変えたので、少し見つけてもらいにくくなった','bad')}}
  log(first?`チャンネル名を「${nm}」にした`:`チャンネル名を「${old}」から「${nm}」に変えた`,'sns');save(true);render()});

// ----- 事務所の種類（50） -----
// [キー, 名前, 説明, 得意ジャンル(nullは全部), タレントの伸び(月), 売上の倍率, スカウトの質, 運営費(月), あなたの投稿の質, 特別]
const OFT_RAW=[
 ['gen','総合タレント事務所','いろいろなジャンルの人がいる、ふつうの事務所',null,.002,1,1,0,0],
 ['boutique','少数精鋭のブティック','人数は少なくても一人ひとりを手厚く育てる',null,.006,1.1,1.3,300000,1],
 ['game','ゲーム実況特化','ゲーム実況の人が伸びやすい','game',.008,1.05,1.1,100000,2],
 ['esports','eスポーツチーム運営','大会の賞金とスポンサーで売上が大きい','game',.004,1.3,1.2,400000,1],
 ['board','ボードゲーム・テーブル遊び','落ち着いたファンが多く、炎上しにくい','game',.004,1,1,80000,1,'safe'],
 ['cook','料理クリエイター事務所','料理の人が伸びやすい','cook',.008,1.05,1.1,100000,2],
 ['gourmet','グルメ番組の制作会社','食品の案件が多く、売上が大きい','cook',.003,1.3,1,300000,1],
 ['beauty','美容・モデル事務所','美容の人が伸びやすい','beauty',.008,1.1,1.1,150000,2],
 ['fashion','ファッションレーベル','ブランドとの案件で売上が大きい','beauty',.003,1.35,1.1,500000,1],
 ['talk','トーク・ラジオ系','雑談の人が伸びやすい','talk',.008,1,1.1,80000,2],
 ['podcast','音声番組の制作会社','固定ファンが育ちやすい','talk',.005,1.1,1,120000,1,'fan'],
 ['voice','声優・ナレーター事務所','声の仕事で安定した売上','talk',.003,1.2,1.2,200000,1],
 ['edu','教育系クリエイター集団','勉強・解説の人が伸びやすい','study',.008,1,1.1,80000,2],
 ['juku','オンライン塾','授業の売上が安定して入る','study',.002,1.3,1,250000,1],
 ['expert','文化人・専門家事務所','評判が上がりやすい','study',.003,1.15,1.3,200000,1,'rep'],
 ['news','ニュース解説チャンネル','時事の話題で伸びるが、炎上もしやすい','study',.007,1.1,1,150000,1,'risk'],
 ['label','音楽レーベル','歌・音楽の人が伸びやすい','music',.008,1.1,1.1,200000,2],
 ['idol','アイドルプロダクション','熱いファンが多く、売上が大きい','music',.006,1.3,1.2,600000,1,'fan'],
 ['band','バンド・アーティスト事務所','ライブで売上が入る','music',.005,1.2,1,300000,1],
 ['dance','ダンスチーム','短い動画で見つかりやすい','music',.009,1,1,150000,1],
 ['owarai','お笑い事務所','お笑いの人が伸びやすい','comedy',.008,1.05,1.1,100000,2],
 ['kikaku','企画系クリエイター集団','大型企画が得意で伸びやすい','comedy',.009,1,1,200000,2],
 ['magic','マジシャン・パフォーマー','イベント出演の売上が入る','comedy',.004,1.2,1.2,150000,1],
 ['eizo','映像制作プロダクション','Vlogの人が伸びやすく、編集の質が高い','vlog',.007,1.1,1.1,250000,3],
 ['travel','旅行・観光PR','地域の案件が多い','vlog',.005,1.2,1,200000,1,'town'],
 ['sports','スポーツ選手マネジメント','スポンサー収入が大きい','vlog',.004,1.3,1.3,500000,1],
 ['outdoor','アウトドア系','体を動かす人が多く、元気に育つ','vlog',.006,1.05,1,100000,1],
 ['pet','動物・ペットチャンネル','癒やし系で炎上しにくい','vlog',.007,1,1,100000,1,'safe'],
 ['docu','ドキュメンタリー制作','評判が上がりやすい','vlog',.004,1.1,1.1,300000,2,'rep'],
 ['asmr','ASMR・癒やし専門','ASMRの人が伸びやすい','asmr',.008,1,1.1,80000,2,'safe'],
 ['bgm','作業用BGMレーベル','再生が長く、広告収益が安定','asmr',.004,1.25,1,150000,1],
 ['vtuber','アバター（バーチャル）事務所','アバター配信の人が伸びやすく、顔バレしない','avatar',.009,1.1,1.1,300000,2,'priv'],
 ['vidol','バーチャルアイドルグループ','熱いファンで売上が大きい','avatar',.006,1.35,1.2,700000,1,'fan'],
 ['vrcre','VRクリエイター集団','VR配信の人が伸びやすい','vr',.009,1.05,1.1,300000,2],
 ['meta','仮想空間の運営会社','仮想空間の利用料で売上が入る','vr',.004,1.4,1,1000000,1],
 ['aistudio','AI共演スタジオ','AIと共演する人が伸びやすい','aico',.009,1.05,1.1,300000,2],
 ['ailab','AIタレント研究所','研究ポイントが毎月たまる','aico',.005,1.1,1.2,500000,1,'rp'],
 ['kids','子役・ファミリー事務所','安全第一。炎上しにくい',null,.003,1,1,120000,0,'safe'],
 ['senior','シニアタレント事務所','落ち着いた人気で長く続く',null,.003,1.1,1,80000,0,'safe'],
 ['global','海外向けグローバル事務所','海外のファンが増え、売上が大きい',null,.004,1.2,1.2,600000,1,'global'],
 ['local','地域密着のローカル事務所','まちの支持が上がる',null,.003,1,1,50000,0,'town'],
 ['indie','インディーズ支援（育成重視）','とても伸びるが、売上は少なめ',null,.011,.8,1,100000,1],
 ['perf','成果報酬型','売上は大きいが、無理をしがちで炎上しやすい',null,.002,1.35,1,0,0,'risk'],
 ['white','働きやすさ重視','ゆっくりだが、あなたも所属タレントも心が安定',null,.004,.9,1,200000,0,'calm'],
 ['coop','クリエイターの協同組合','運営費が安く、みんなで支え合う',null,.005,.85,1,20000,1],
 ['data','データ分析型（IT系）','数字に強く、研究ポイントもたまる',null,.005,1.05,1.2,800000,1,'rp'],
 ['old','老舗の芸能プロダクション','評判と人脈で、売上が大きい',null,.002,1.15,1.3,600000,0,'rep'],
 ['startup','急成長スタートアップ','とても伸びるが、炎上もしやすい',null,.012,1,1.1,500000,1,'risk'],
 ['charity','社会貢献型','評判とまちの支持が上がる',null,.003,.8,1,100000,0,'rep'],
 ['fanclub','ファンクラブ運営に強い事務所','あなたのガチ勢が育ちやすい',null,.004,1.05,1,250000,1,'fan']
];
const OFT={};OFT_RAW.forEach(([k,n,d,g,tg,tr,sq,fee,me,sp])=>OFT[k]={k,n,d,g,tg,tr,sq,fee,me,sp:sp||''});
function ofType(){return S.office&&S.office.lv?OFT[S.office.type||'gen']||OFT.gen:null}
function oftOk(t){return !t.g||genreOk(t.g)}
function oftHtml(){const o=S.office,T=ofType();if(!T)return '';const c=ci2(),chg=Math.round(2e6*c),cdLeft=o.typeAm!=null&&S.am-o.typeAm<12?12-(S.am-o.typeAm):0;
  let h=`<h3>事務所の種類</h3><div class="card"><div class="hd"><span>${esc(T.n)}</span><span class="muted small">${T.g?esc(GENRES[T.g].n)+'が得意':'ジャンルを問わない'}</span></div><p class="hint small">${esc(T.d)}。タレントの伸び+${(T.tg*100).toFixed(1)}%／月・売上×${T.tr}${T.fee?`・運営費 月${yen(T.fee*c)}`:''}${T.me?`・あなたの投稿の質+${T.me}${T.g?`（${esc(GENRES[T.g].n)}のとき）`:''}`:''}</p></div>`;
  h+=`<div class="row"><select id="oftSel">${OFT_RAW.map(r=>OFT[r[0]]).filter(oftOk).map(t=>`<option value="${t.k}" ${t.k===T.k?'selected':''}>${esc(t.n)}${t.g?'（'+esc(GENRES[t.g].n)+'）':''}</option>`).join('')}</select><button class="b sm" type="button" data-act="oftSet" ${cdLeft||S.money<chg?'disabled':''}>この種類に変える ${yen(chg)}</button></div><p class="hint small" id="oftDesc">${cdLeft?`次に変えられるのは${cdLeft}か月後。`:'種類を変えると、看板やスタッフの体制を作り直すので費用がかかる（1年に1回まで）。'}</p>`;
  return h}
document.addEventListener('change',e=>{if(e.target.id==='oftSel'&&S){const t=OFT[e.target.value];const d=document.getElementById('oftDesc');if(t&&d)d.textContent=`${t.d}。伸び+${(t.tg*100).toFixed(1)}%／月・売上×${t.tr}${t.fee?'・運営費 月'+yen(t.fee*ci2()):''}`}});
document.addEventListener('click',e=>{const b=e.target.closest('[data-act="oftSet"]');if(!b||!S||!S.office)return;const k=(document.getElementById('oftSel')||{}).value,t=OFT[k];if(!t||k===(S.office.type||'gen'))return;const c=Math.round(2e6*ci2());if(S.money<c)return;
  outc('office',c);S.office.type=k;S.office.typeAm=S.am;log(`事務所を「${t.n}」に生まれ変わらせた`,'good');tl(`事務所を「${t.n}」にした`);save(true);render()});

// ----- タレントの契約解除 -----
function talRev(t){const p=TPOL[t.pol||'bal'];return t.f*.6*p.r*Math.max(.15,S.cty.inc)}
function talEndHtml(j){const t=S.office.talents[j];if(!t)return '';const fee=Math.round(talRev(t)*3);
  return `<div class="row" id="tend_${j}"><button class="b sm ghost" type="button" data-tend="${j}">契約を解除する</button></div>`}
document.addEventListener('click',e=>{const b=e.target.closest('button');if(!b||!S||!S.office)return;const d=b.dataset;
  if(d.tend!=null){const j=+d.tend,t=S.office.talents[j];if(!t)return;const fee=Math.round(talRev(t)*3);const box=document.getElementById('tend_'+j);if(!box)return;
    box.outerHTML=`<div class="card warn confirm-inline" id="tend_${j}"><p class="mtext">${esc(t.name)}さんとの契約を解除する？</p><div class="mch"><button class="b sm" type="button" data-tend2="${j}" data-m="talk" ${S.money<fee?'disabled':''}>話し合って円満に（解決金 ${yen(fee)}）</button><button class="b sm" type="button" data-tend2="${j}" data-m="free" ${t.trouble?'':'disabled'}>契約違反があったので解除（費用なし）</button><button class="b sm" type="button" data-tend2="${j}" data-m="force">一方的に解除（評判が下がる）</button><button class="b sm ghost" type="button" data-tend2="${j}" data-m="no">やめる</button></div>${t.trouble?'':'<p class="hint small">「契約違反」はタレントが問題を起こしたときだけ選べる。</p>'}</div>`;return}
  if(d.tend2!=null){const j=+d.tend2,t=S.office.talents[j];if(!t)return;const m=d.m;if(m==='no'){renderPanel();return}const fee=Math.round(talRev(t)*3);
    if(m==='talk'){if(S.money<fee)return;outc('office',fee);log(`${t.name}さんと話し合って、円満に契約を終えた（解決金 ${yen(fee)}）`,'life');ad('mental',-1)}
    else if(m==='free'){log(`${t.name}さんとの契約を、契約違反のため解除した`,'life');ad('rep',1)}
    else{ad('rep',-5);ad('mental',-2);log(`${t.name}さんとの契約を一方的に解除した。「冷たい事務所」という声も出ている`,'bad');if(chance(.25)&&!S.q.includes('flame')&&S.snsOpen)S.q.push('flame')}
    S.office.talents.splice(j,1);if(!S.exTal)S.exTal=[];S.exTal.push({name:t.name,genre:t.genre,f:t.f,am:S.am,m});tl(`${t.name}さんとの契約を終えた`);save(true);render()}});
// 所属タレントが問題を起こすことがある（契約違反）
X('t_trouble','会社','所属タレントのトラブル',and(talC,ag(20)),.012,()=>{const t=S.tmpT=pick(S.office.talents);return `所属タレントの${t.name}さんが、事務所に相談せずに大きな案件を受けていたことがわかった。契約違反だ。`},
 [['注意して様子を見る',()=>{const t=S.tmpT;if(t){t.trouble=1;rel(t,-3)}return {mental:-1}},'「次からは必ず相談して」と伝えた。（事務所の画面から契約解除も選べる）'],['すぐに話し合う',()=>{const t=S.tmpT;if(t)t.trouble=1;return {talk:1,mental:-2}},'お互いの言い分を聞いた。']]);
X('t_thanks','会社','卒業したタレントから',()=>(S.exTal||[]).some(x=>x.m==='talk'),.01,()=>{const x=pick(S.exTal.filter(y=>y.m==='talk'));return `前に所属していた${x.name}さんから「あの事務所にいてよかった」とメッセージが届いた。`},[['返事を書く',{happy:4,rep:1},'円満に送り出してよかった。']],{cd:60});

// ----- 事務所の種類の効果（毎月） -----
function monthHook14(){const T=ofType();
  if(T&&S.office.talents.length){let extra=0;for(const t of S.office.talents){const match=!T.g||t.genre===T.g;const g=match?T.tg:T.tg*.3-.002;t.f=clamp(Math.round(t.f*(1+g)),100,2e6);extra+=talRev(t)*(T.tr-1)*(match?1:.5)}
    if(extra>0)inc('talent',Math.round(extra));else if(extra<0)outc('office',Math.round(-extra))}
  if(T&&T.fee)bill('office',`事務所の運営費（${T.n}）`,T.fee*ci2());
  if(T){if(T.sp==='rp')S.rp+=1;if(T.sp==='rep')ad('rep',.15);if(T.sp==='calm')ad('mental',.3);if(T.sp==='fan'&&S.snsOpen)S.fanCore=clamp(S.fanCore+.0008,.02,.4);if(T.sp==='town'){const H=homeTown();if(H)H.support=clamp((H.support||50)+.15)}if(T.sp==='global'&&S.snsOpen)ad('f',.0008);if(T.sp==='priv')ad('priv',.2)}
  svcMonth()}
const _mh14=monthHook11;monthHook11=function(){_mh14();try{monthHook14()}catch(e){console.error(e)}};
const _pq14=postQuality;postQuality=function(){let q=_pq14();const T=ofType();if(T&&T.me)q+=(!T.g||T.g===S.genre)?T.me*(T.g?1:.5):0;return q};
// スカウトしたタレントは、事務所の得意ジャンルに寄りやすい
document.addEventListener('click',e=>{const b=e.target.closest('[data-act="scout"]');if(!b||!S||!S.office)return;const n0=S.office.talents.length;setTimeout(()=>{const T=ofType();if(!T||S.office.talents.length<=n0)return;const t=S.office.talents[S.office.talents.length-1];if(T.g&&chance(.7)){t.genre=T.g}t.f=Math.round(t.f*T.sq);try{renderPanel()}catch(_){}},0)},true);

// ----- サブスクリプション（契約する側）を追加 -----
const SUB_CAT={tal:'素質',sns:'発信',learn:'学び',health:'健康',life:'暮らし',lux:'ぜいたく',odd:'ふしぎ',money:'お金'};
Object.assign(SUBS.editsoft,{c:'sns'});Object.assign(SUBS.gymsub,{c:'health'});Object.assign(SUBS.eikaiwa,{c:'learn'});Object.assign(SUBS.voice,{c:'learn'});Object.assign(SUBS.music,{c:'life'});Object.assign(SUBS.insurance,{c:'money'});
Object.assign(SUBS,{
 sozai:{c:'sns',n:'素材サイト見放題',p:3000,age:13,d:'編集が少しずつ上がる',f:()=>ad('edit',.25)},
 bgmlib:{c:'sns',n:'BGMライブラリ',p:2000,age:13,d:'使っていい音楽が使い放題。音楽の素質が少し上がる',f:()=>ad('tal.music',.2)},
 cloud:{c:'sns',n:'クラウド保存',p:1000,age:13,d:'データが消えない安心感。メンタルが少し上がる',f:()=>ad('mental',.15)},
 analytics:{c:'sns',n:'分析ツール',p:5000,age:15,d:'企画が少しずつ上がる',f:()=>ad('plan',.3)},
 gearrent:{c:'sns',n:'配信機材のレンタル',p:20000,age:18,d:'いい機材を毎月入れかえ。編集+0.3・見た目+0.2',f:()=>{ad('edit',.3);ad('looks',.2)}},
 subtitle:{c:'sns',n:'翻訳字幕サービス',p:30000,age:18,d:'海外のファンが毎月少し増える',f:()=>{if(S.snsOpen)ad('f',.0015)}},
 aiedit:{c:'sns',n:'AI編集アシスタント',p:8000,age:13,yr:2030,d:'編集が上がりやすい（2030年から）',f:()=>ad('edit',.5)},
 prog:{c:'learn',n:'プログラミング教室',p:12000,age:10,d:'知識+0.5・研究ポイントが少したまる',f:()=>{ad('know',.5);S.rp+=.3}},
 shodo:{c:'learn',n:'書道教室',p:6000,age:6,d:'心が落ち着く',f:()=>ad('mental',.3)},
 cookcl:{c:'learn',n:'料理教室',p:8000,age:10,d:'料理の素質が上がる',f:()=>ad('tal.cook',.5)},
 univon:{c:'learn',n:'大学のオンライン講義',p:15000,age:15,d:'知識が上がる',f:()=>ad('know',.8)},
 bizsem:{c:'learn',n:'ビジネスセミナー',p:20000,age:18,d:'企画が上がる',f:()=>ad('plan',.5)},
 dancecl:{c:'learn',n:'ダンススクール',p:9000,age:6,d:'健康と音楽の素質',f:()=>{ad('health',.4);ad('tal.music',.2)}},
 acting:{c:'learn',n:'演技レッスン',p:15000,age:10,d:'話術と見た目',f:()=>{ad('talk',.5);ad('looks',.2)}},
 photo:{c:'learn',n:'写真教室',p:7000,age:12,d:'編集とVlogの素質',f:()=>{ad('edit',.4);ad('tal.vlog',.3)}},
 yoga:{c:'health',n:'ヨガ教室',p:8000,age:13,d:'健康とメンタル',f:()=>{ad('health',.5);ad('mental',.3)}},
 meal:{c:'health',n:'健康食の宅配',p:25000,age:18,d:'健康が上がる',f:()=>ad('health',.6)},
 sleep:{c:'health',n:'睡眠サポートアプリ',p:3000,age:13,d:'ぐっすり眠れる',f:()=>ad('health',.3)},
 telemed:{c:'health',n:'オンライン診療',p:2000,age:18,d:'すぐ相談できる安心',f:()=>ad('health',.2)},
 massage:{c:'health',n:'マッサージ通い放題',p:30000,age:18,d:'体も心もほぐれる',f:()=>{ad('health',.5);ad('mental',.5)}},
 counsel:{c:'health',n:'カウンセリング',p:9000,age:13,d:'メンタルが上がる',f:()=>ad('mental',.8)},
 video:{c:'life',n:'動画見放題',p:1000,age:6,d:'幸福が少し上がる',f:()=>ad('happy',.3)},
 manga:{c:'life',n:'漫画読み放題',p:1000,age:6,d:'幸福とお笑いの素質',f:()=>{ad('happy',.2);ad('tal.comedy',.1)}},
 shokuzai:{c:'life',n:'食材の宅配',p:15000,age:18,d:'料理の素質と幸福',f:()=>{ad('tal.cook',.2);ad('happy',.2)}},
 kaden:{c:'life',n:'家電のレンタル',p:5000,age:18,d:'いつも新しい家電',f:()=>ad('happy',.2)},
 fukurent:{c:'life',n:'洋服のレンタル',p:8000,age:15,d:'見た目が上がる',f:()=>ad('looks',.4)},
 flower:{c:'life',n:'花の定期便',p:3000,age:15,d:'部屋が明るくなる',f:()=>{ad('happy',.3);ad('mental',.2)}},
 coffee:{c:'life',n:'コーヒーの定期便',p:2500,age:18,d:'朝が楽しみになる',f:()=>ad('happy',.2)},
 gamesub:{c:'life',n:'ゲーム遊び放題',p:1500,age:6,d:'ゲーム実況の素質',f:()=>ad('tal.game',.3)},
 carshare:{c:'life',n:'カーシェア',p:10000,age:18,d:'週末のおでかけ',f:()=>{ad('happy',.2);ad('tal.vlog',.1)}},
 paper:{c:'life',n:'新聞',p:4000,age:12,d:'知識が上がる',f:()=>ad('know',.4)},
 magazine:{c:'life',n:'雑誌読み放題',p:500,age:10,d:'知識が少し上がる',f:()=>ad('know',.2)},
 chef:{c:'lux',n:'専属シェフ',p:800000,age:18,d:'毎日プロの食事。健康+1・幸福+1',f:()=>{ad('health',1);ad('happy',1)}},
 driver:{c:'lux',n:'運転手つきの車',p:1200000,age:18,d:'移動が快適。幸福+0.8',f:()=>ad('happy',.8)},
 jet:{c:'lux',n:'プライベートジェット会員',p:1e7,age:18,d:'好きなときに空の旅。幸福+1.5・Vlogの素質',f:()=>{ad('happy',1.5);ad('tal.vlog',.5)}},
 hotel:{c:'lux',n:'高級ホテル住み放題',p:3e6,age:18,d:'毎日がホテル暮らし。幸福+1.2',f:()=>ad('happy',1.2)},
 stylist:{c:'lux',n:'専属スタイリスト',p:5e5,age:18,d:'見た目+1',f:()=>ad('looks',1)},
 worldtrip:{c:'lux',n:'毎月の世界一周',p:5e7,age:18,d:'毎月どこかの国にいる。幸福+2・知識+1',f:()=>{ad('happy',2);ad('know',1)}},
 island:{c:'lux',n:'プライベート島の維持',p:2e7,age:18,d:'自分だけの島。幸福+1.5・メンタル+1',f:()=>{ad('happy',1.5);ad('mental',1)}},
 mystery:{c:'odd',n:'毎月なにかが届く謎の箱',p:5000,age:10,d:'中身は届いてからのお楽しみ',f:()=>{const r=Math.random();if(r<.15){ad('happy',3);log('謎の箱：すてきな置き物が入っていた','good')}else if(r<.3){ad('know',1);log('謎の箱：古い地図が入っていた','life')}else if(r<.4){ad('happy',-1);log('謎の箱：用途のわからない部品が入っていた','life')}else ad('happy',.2)}},
 homeru:{c:'odd',n:'毎朝ほめてくれる電話',p:3000,age:13,d:'知らない人が毎朝ほめてくれる。メンタルが上がる',f:()=>ad('mental',.4)},
 moonland:{c:'odd',n:'月の土地の管理費',p:1000,age:18,d:'どこかにあるらしい自分の土地。幸福がほんの少し',f:()=>ad('happy',.1)},
 kakuu:{c:'odd',n:'架空の国の国民会費',p:500,age:13,d:'国民証が届いた。話のネタになる',f:()=>ad('social',.1)},
 stone:{c:'odd',n:'毎月ひとつ石が届く',p:800,age:8,d:'集めていると、だんだん詳しくなる',f:()=>ad('know',.15)},
 penguin:{c:'odd',n:'ペンギンの里親',p:10000,age:6,d:'水族館から毎月写真が届く',f:()=>ad('happy',.4)},
 surprise:{c:'odd',n:'毎月のサプライズパーティー',p:5e5,age:18,d:'誰かが毎月お祝いしてくれる。人間関係+1・幸福+1',f:()=>{ad('social',1);ad('happy',1)}},
 fossil:{c:'odd',n:'恐竜の化石レンタル',p:3e6,age:18,d:'リビングに本物の化石。知識+0.5',f:()=>ad('know',.5)},
 satellite:{c:'odd',n:'名前入りの人工衛星',p:3e7,age:18,d:'宇宙から名前が見守る。評判とフォロワーが少し上がる',f:()=>{ad('rep',.5);if(S.snsOpen)ad('f',.001)}},
 shooting:{c:'odd',n:'自分専用の流れ星',p:1e8,age:18,yr:2035,d:'毎月、人工の流れ星が流れる。幸福+3（2035年から）',f:()=>ad('happy',3)},
 rocket:{c:'odd',n:'毎月ロケットを打ち上げる',p:5e9,age:18,yr:2030,d:'とんでもない額。毎月ニュースになる（評判+1・フォロワー+1%）',f:()=>{ad('rep',1);ad('happy',2);if(S.snsOpen)ad('f',.01)}},
 cloudorder:{c:'odd',n:'雲の形を注文できる',p:2e8,age:18,yr:2060,d:'空に好きな形の雲を浮かべられる（2060年から）',f:()=>{ad('happy',2);ad('plan',.3)}},
 kakeibo:{c:'money',n:'家計管理アプリ',p:500,age:15,d:'企画が少し上がる',f:()=>ad('plan',.2)},
 invstudy:{c:'money',n:'投資の勉強会',p:10000,age:18,d:'知識が上がる',f:()=>ad('know',.4)},
 zeirishi:{c:'money',n:'税理士の顧問契約',p:30000,age:20,d:'お金の心配が減る',f:()=>ad('mental',.3)}
});
for(const k in SUBS){if(!SUBS[k].c)SUBS[k].c='life'}
let SUBCAT='sns';
function subsOnN(){return Object.keys(S.subs||{}).filter(k=>S.subs[k]&&SUBS[k]).length}
function subsListHtml(){const on=subsOnN();let h=`<p class="hint">契約中：${on}件。たくさん契約しても、使える時間には限りがあるので、9件目からは1件あたりの効果が小さくなる。</p><div class="seg wrapseg">${Object.entries(SUB_CAT).map(([k,n])=>`<button type="button" class="${SUBCAT===k?'on':''}" data-subcat="${k}">${n}</button>`).join('')}</div><div>`;
  for(const [k,s] of Object.entries(SUBS)){if(s.c!==SUBCAT)continue;const lockA=age()<(s.age||0),lockY=s.yr&&S.y<s.yr;const onk=!!S.subs[k];if(lockY&&!onk)continue;
    h+=`<div class="shop"><div><div>${esc(s.n)} <span class="muted small">月${yen(s.p*Math.max(.3,S.cty.inc))}</span> <span class="chip">毎月の契約</span></div><div class="muted small">${esc(s.d)}${lockA?`（${s.age}歳から）`:''}</div></div><button class="b sm ${onk?'on':''}" type="button" data-sub2="${k}" ${lockA&&!onk?'disabled':''}>${onk?'契約中（解約）':'契約する'}</button></div>`}
  return h+'</div>'}
document.addEventListener('click',e=>{const b=e.target.closest('[data-subcat]');if(!b||!S)return;SUBCAT=b.dataset.subcat;renderPanel()});
const _subsTick14=subsTick;subsTick=function(){if(S.money<0){const on=Object.keys(S.subs||{}).filter(k=>S.subs[k]&&SUBS[k]).sort((a,b)=>SUBS[b].p-SUBS[a].p);if(on.length&&SUBS[on[0]].p>=5000){S.subs[on[0]]=0;log(`お金が足りず、「${SUBS[on[0]].n}」が解約された`,'bad')}}_subsTick14();const n=subsOnN(),mul=n>8?8/n:1;GMUL=mul;try{for(const k in S.subs){const s=SUBS[k];if(S.subs[k]&&s&&s.f)try{s.f()}catch(_){}}}finally{GMUL=1}};

// ----- 自分のサブスク事業（開発して提供する） -----
// [キー, 名前, 開発費, 標準の月額, 1人あたりの原価, 合うジャンル, 年]
const SVC_T=[['video','動画見放題サービス',3e7,1000,300,'vlog',2008],['music','音楽配信サービス',2e7,980,350,'music',2005],['learn','学習アプリ',1e7,1500,200,'study',2010],['fan','ファンクラブ',3e6,500,50,null,2005],['game','ゲーム遊び放題',5e7,1200,400,'game',2012],['fit','オンラインフィットネス',8e6,2000,300,'vlog',2012],['recipe','レシピ見放題',5e6,400,40,'cook',2010],['food','食品の定期便',1.5e7,3500,2500,'cook',1990],['beauty','コスメの定期便',1e7,3000,1800,'beauty',2012],['radio','音声番組の聴き放題',4e6,600,60,'talk',2015],['ai','AI相談サービス',4e7,1500,500,'aico',2030],['vr','VR空間の会員制ルーム',8e7,2500,600,'vr',2035],['pet','ペット用品の定期便',8e6,2800,1900,'vlog',2000],['fortune','毎日の占い',2e6,300,20,'talk',2005],['manga','漫画読み放題',2.5e7,800,300,'comedy',2012]];
const SVCT={};SVC_T.forEach(([k,n,dev,price,cost,g,yr])=>SVCT[k]={k,n,dev:dev*5,price,cost,g,yr});
const SVC_PRICE={low:{n:'安め',m:.6,get:1.6,churn:1.15},std:{n:'ふつう',m:1,get:1,churn:1},high:{n:'高め',m:1.8,get:.5,churn:.85}};
function svcOk(t){return S.y>=t.yr}
function svcEst(s){const t=SVCT[s.t],P=SVC_PRICE[s.pr||'std'];return {rev:Math.round(s.users*t.price*P.m*ci2()),cost:Math.round(s.users*t.cost*ci2()+t.dev*.004*ci2())}}
function svcMonth(){if(!S.svcs||!S.svcs.length)return;let rv=0,cs=0;
  for(const s of S.svcs){const t=SVCT[s.t];if(!t)continue;const P=SVC_PRICE[s.pr||'std'];const fit=t.g&&t.g===S.genre?1.4:1;
    s.q=clamp((s.q||40)-.4,5,100);s.age=(s.age||0)+1;
    const market=Math.max(0,(totalF()*.0005*fit+80*Math.max(.3,S.cty.inc)+(s.mkt||0))*(s.q/50)*P.get*R(.7,1.3)*(s.age<6?.5+s.age/12:1));
    const churn=s.users*clamp(.06*P.churn*(1.4-s.q/100),.01,.2);s.mkt=Math.max(0,(s.mkt||0)*.5);
    s.users=Math.max(0,Math.round(s.users+market-churn));
    const e=svcEst(s);s.lastRev=e.rev;s.lastCost=e.cost;rv+=e.rev;cs+=e.cost}
  if(rv)inc('svcbiz',rv);if(cs)bill('svcbiz','自分のサブスク事業の運営費',cs);
  if(chance(.01)&&!S.q.includes('svc_down'))S.q.push('svc_down');else if(chance(.008)&&!S.q.includes('svc_rival'))S.q.push('svc_rival')}
function svcHtml(){const c=ci2();let h=`<h3>自分のサブスク事業</h3><p class="hint">サービスを開発して、毎月の会費で稼ぐ。フォロワーが多いほど会員が集まり、自分の発信ジャンルに合うとさらに集まりやすい。品質は少しずつ下がるので、アップデートで保とう。会員1人ごとに原価（サーバー代や商品代）がかかる。</p>`;
  if(age()<18)return h+'<p class="hint">18歳から始められる。</p>';
  for(const [i,s] of (S.svcs||[]).entries()){const t=SVCT[s.t],P=SVC_PRICE[s.pr||'std'],e=svcEst(s);const prof=(s.lastRev||e.rev)-(s.lastCost||e.cost);
    h+=`<div class="card"><div class="hd"><span>${esc(s.name||t.n)}</span><span>${num(s.users)}人</span></div><div class="kv"><span>月額</span><span>${yen(t.price*P.m*c)}（${P.n}）</span><span>品質</span><span>${Math.round(s.q)}</span><span>先月の利益</span><span class="${prof>=0?'up':'dn'}">${prof>=0?'+':''}${yen(prof)}</span></div>
    <div class="seg">${Object.entries(SVC_PRICE).map(([k,p])=>`<button type="button" class="${(s.pr||'std')===k?'on':''}" data-svcpr="${i}" data-v="${k}">${p.n}</button>`).join('')}</div>
    <div class="row"><button class="b sm" type="button" data-svc="${i}" data-k="up" ${S.money<t.dev*.15*c?'disabled':''}>アップデート ${yen(t.dev*.15*c)}</button><button class="b sm" type="button" data-svc="${i}" data-k="ad" ${S.money<t.dev*.05*c?'disabled':''}>宣伝する ${yen(t.dev*.05*c)}</button><button class="b sm ghost" type="button" data-svc="${i}" data-k="sell">事業を売る（${yen(svcValue(s))}）</button></div></div>`}
  if((S.svcs||[]).length<3){h+=`<h3>新しいサービスを開発する</h3><div>`;for(const t of SVC_T.map(r=>SVCT[r[0]])){if(!svcOk(t))continue;const done=(S.svcs||[]).some(s=>s.t===t.k);
    h+=`<div class="shop"><div><div>${esc(t.n)} <span class="muted small">開発費 ${yen(t.dev*c)}</span></div><div class="muted small">月額 ${yen(t.price*c)}・原価 1人${yen(t.cost*c)}${t.g?`・${esc(GENRES[t.g].n)}の発信と相性がいい`:'・どのジャンルでも'}</div></div><button class="b sm" type="button" data-svcnew="${t.k}" ${done||S.money<t.dev*c?'disabled':''}>${done?'運営中':'開発する'}</button></div>`}h+='</div>'}
  else h+='<p class="hint">サービスは3つまで運営できる。</p>';
  return h}
function svcValue(s){const e=svcEst(s);return Math.max(0,Math.round((e.rev-e.cost)*24))}
document.addEventListener('click',e=>{const b=e.target.closest('button');if(!b||!S)return;const d=b.dataset;const c=ci2();
  if(d.svcnew){const t=SVCT[d.svcnew];if(!t||S.money<t.dev*c||(S.svcs||[]).length>=3)return;outc('svcbiz',Math.round(t.dev*c));if(!S.svcs)S.svcs=[];S.svcs.push({t:t.k,users:0,q:55+Math.min(30,(S.sk.plan+S.p.know)/8),pr:'std',age:0,mkt:totalF()*.01});tl(`サブスク「${t.n}」を始めた`);log(`「${t.n}」を開発して、サービスを始めた`,'good');snd('buy');save(true);render();return}
  if(d.svcpr!=null){const s=S.svcs[+d.svcpr];if(s){s.pr=d.v;save();renderPanel()}return}
  if(d.svc!=null){const s=S.svcs[+d.svc];if(!s)return;const t=SVCT[s.t];
    if(d.k==='up'){const cost=Math.round(t.dev*.15*c);if(S.money<cost)return;outc('svcbiz',cost);s.q=clamp(s.q+R(8,15),5,100);log(`${t.n}をアップデートした（品質 ${Math.round(s.q)}）`,'good')}
    else if(d.k==='ad'){const cost=Math.round(t.dev*.05*c);if(S.money<cost)return;outc('svcbiz',cost);s.mkt=(s.mkt||0)+cost/(t.price*c)*R(.6,1.4);log(`${t.n}を宣伝した`,'good')}
    else if(d.k==='sell'){const v=svcValue(s);inc('sell',v);S.svcs.splice(+d.svc,1);tl(`サブスク「${t.n}」を売却した`);log(`「${t.n}」の事業を${yen(v)}で売った`,'good')}
    save(true);render()}});
E('svc_down',{t:'サーバーが落ちた',cat:'会社',w:0,when:()=>S.svcs&&S.svcs.length>0,text:()=>{const s=S.tmpSv=pick(S.svcs);return `自分のサブスク「${SVCT[s.t].n}」のサーバーが止まってしまった。会員から問い合わせが殺到している。`},
  ch:[['すぐに復旧して、おわびをする',()=>{const s=S.tmpSv;if(s){s.q=clamp(s.q-3,5,100);outc('svcbiz',Math.round(SVCT[s.t].dev*.02*ci2()))}return '素早い対応で、解約は少なくて済んだ。'}],['原因を調べてから発表',()=>{const s=S.tmpSv;if(s){s.users=Math.round(s.users*.9);s.q=clamp(s.q-6,5,100)}return '対応が遅いと、1割の会員がやめてしまった。'}]]});
E('svc_rival',{t:'似たサービスの登場',cat:'会社',w:0,when:()=>S.svcs&&S.svcs.length>0,text:()=>{const s=S.tmpSv=pick(S.svcs);return `大手の会社が「${SVCT[s.t].n}」とそっくりなサービスを安い値段で始めた。`},
  ch:[['品質で勝負する',()=>{const s=S.tmpSv;if(s){const cost=Math.round(SVCT[s.t].dev*.1*ci2());if(S.money>=cost){outc('svcbiz',cost);s.q=clamp(s.q+10,5,100)}}return '新しい機能を急いで追加した。'}],['値下げで対抗',()=>{const s=S.tmpSv;if(s)s.pr='low';return '値段を「安め」に変えた。'}],['そのまま様子を見る',()=>{const s=S.tmpSv;if(s)s.users=Math.round(s.users*.85);return '会員の一部が流れていった。'}]]});
Object.assign(INC_LBL,{svcbiz:'サブスク事業'});Object.assign(OUT_LBL,{svcbiz:'サブスク事業',office:'事務所'});
