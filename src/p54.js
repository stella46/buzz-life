
// ===== v2.7.1：タイトルロゴの切りかえ（画像のロゴ／前の文字のタイトル）。開発者のみ =====
// 全員に反映する設定：'image'＝画像のロゴ、'text'＝前の文字のタイトル（変更はコードのここだけ）
CFG.logo='text';
const LOGO_KEY='buzz-dev-logo';
function logoMode(){return CFG.logo==='text'?'text':'image'}
function applyLogoMode(){const t=logoMode()==='text';document.body.classList.toggle('logo-text',t);const w=$('#logoWrap');if(w)w.style.display=t?'none':''}
applyLogoMode();
// （デバッグ画面での端末ごとのお試しは廃止。切りかえは CFG.logo のみ）
document.addEventListener('click',e=>{if(e.target.closest('[data-dbg="off"]'))setTimeout(applyLogoMode,50)});
