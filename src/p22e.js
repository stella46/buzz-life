OLD_VERS.unshift(['v0.10','versions/v0.10/','流行・投稿の企画・コラボ・自動進行が入ったころ（見た目は旧デザイン）']);
OLD_VERS.unshift(['v1.0','versions/v1.0/','グラフィックとサウンドを一新したころ（v1.0.4）']);

// ===== v1.1.1：メインのSNSがずれてフォロワーが増えないのを修正 =====
function fixMain(){if(!S||!S.snsOpen||!S.open||S.open[S.main])return;const k=Object.keys(SNS).find(x=>S.open[x]);if(!k)return;const old=S.main;if(old&&S.f[old]>0){S.f[k]=(S.f[k]||0)+S.f[old];S.f[old]=0}S.main=k}
const _postAll11=postAll;postAll=function(k){fixMain();return _postAll11(k)};
const _sph11=snsPlanHtml;snsPlanHtml=function(){fixMain();let h='';if(S&&S.snsOpen&&!(S.plan||[]).includes('post'))h+=`<div class="card warn"><p class="mtext">いまの予定に「投稿する」が入っていないので、フォロワーは増えない。「予定」タブで「投稿する」を入れよう。</p></div>`;return h+_sph11()};
document.addEventListener('click',e=>{const b=e.target.closest('[data-opensns]');if(b&&S)setTimeout(()=>{if(!S.open[S.main]||!S.f[S.main]){if(!S.open[S.main])S.main=b.dataset.opensns}fixMain();try{if(!S.genre)S.genre=topTal()}catch(_){}save(true);render()},0)},true);
const _turn111=turn;turn=function(){fixMain();return _turn111.apply(this,arguments)};
const _outc111=outc;outc=function(cat,v){if(S&&v>0&&age()<18&&S.money-v<0){const cover=v-Math.max(0,S.money);if(cover>0){try{if(!/^(medical|ev|tax|home|util|rent|phone|debt|family|bill|move|staff)$/.test(cat||'')){S.famDebt=(S.famDebt||0)+cover;log(`足りない${yen(cover)}は家族が立て替えてくれた（大人になったら返す）`,'life')}else log(`足りない${yen(cover)}は家族が払ってくれた`,'life')}catch(_){}}_outc111(cat,Math.max(0,S.money));return}return _outc111(cat,v)};

// ===== v1.1.2：投稿していない・フォロワーがいないのに、見てくれる人がいる前提の出来事が起きないように =====
const AUD_RE=/コメント|視聴者|ファン|フォロワー|投げ銭|再生|記念|お祝い|おめでとう|案件|声をかけ|常連|アンチ|炎上|取材|バズ|反響|見てくれ|見てます|応援|切り抜き|登録者|ライブ中|配信中/;
const AUD_FREE=/^(sns_start|era_sns|m13|m13k|sn11_(12|16|30)|ch11_3|trend_chg|rv_.*|kc_.*|s100|s1k|s10k|s100k|s1m)$/;
function postedWithin(n){if(S.lastPostAm!=null)return S.am-S.lastPostAm<=n;return !!(S.last&&S.last.posts>0)}
let AUD_DONE=false;
function audGate(){if(AUD_DONE||!S)return;AUD_DONE=true;
  for(const e of Object.values(EV)){if(!e||AUD_FREE.test(e.id)||(e.w<=0&&e.id!=='flame'))continue;
    const isSns=e.cat==='SNS'||e.cat==='sns'||/^(s_|x_s_|sn1|gn_|cr11|ch11)/.test(e.id);if(!isSns)continue;
    let s=(e.t||'')+' ';const ts=String(e.text);try{s+=ts==='()=>text'?e.text():ts}catch(_){}try{const cs=String(e.ch);if(typeof e.ch!=='function')s+=e.ch.map(x=>x[0]).join(' ');else if(/chs\.filter/.test(cs))s+=e.ch().map(x=>x[0]).join(' ');else s+=cs}catch(_){}
    const anniv=/記念/.test(s),aud=AUD_RE.test(s)||e.id==='flame';
    const w0=e.when;e.when=function(){if(!S.snsOpen||!postedWithin(12))return false;if(anniv&&(!postedWithin(3)||totalF()<10))return false;if(aud&&(!postedWithin(6)||totalF()<30))return false;return !w0||w0()}}}
const _postAll112=postAll;postAll=function(k){S.lastPostAm=S.am;return _postAll112(k)};
const _roll112=rollEvent;rollEvent=function(k){audGate();return _roll112(k)};
