
// ===== v2.7.1：タイトルロゴの切りかえ（画像のロゴ／前の文字のタイトル）。開発者のみ =====
// 全員に反映する設定：'image'＝画像のロゴ、'text'＝前の文字のタイトル（変更はコードのここだけ）
CFG.logo='image';
const LOGO_KEY='buzz-dev-logo';
function logoMode(){try{if(typeof devOn==='function'&&devOn()){const v=localStorage.getItem(LOGO_KEY);if(v==='image'||v==='text')return v}}catch(_){}return CFG.logo==='text'?'text':'image'}
function applyLogoMode(){const t=logoMode()==='text';document.body.classList.toggle('logo-text',t);const w=$('#logoWrap');if(w)w.style.display=t?'none':''}
applyLogoMode();
const _db54=devBody;devBody=function(){let h=_db54.apply(this,arguments);try{if(DEV_TAB==='info'){const m=logoMode(),ov=(()=>{try{return localStorage.getItem(LOGO_KEY)}catch(_){return null}})();
 h+=`<h3>タイトルロゴ</h3><p class="hint">いま：${m==='text'?'文字のタイトル（前のもの）':'画像のロゴ'}${ov?'（この端末だけで試し中）':''}。ここでの切りかえは、この端末だけのお試しです。全員に反映するときは、コードの CFG.logo を変えます（いまの全員向け：${CFG.logo==='text'?'文字':'画像'}）。</p><div class="row"><button class="b sm ${m==='image'?'pri':''}" type="button" data-dbglogo="image">画像のロゴ</button><button class="b sm ${m==='text'?'pri':''}" type="button" data-dbglogo="text">文字のタイトル（前のもの）</button><button class="b sm ghost" type="button" data-dbglogo="reset">全員向けの設定に戻す</button></div>`}}catch(e){console.error(e)}return h};
document.addEventListener('click',e=>{const b=e.target.closest('[data-dbglogo]');if(!b||!(typeof devOn==='function'&&devOn()))return;const v=b.dataset.dbglogo;try{if(v==='reset')localStorage.removeItem(LOGO_KEY);else localStorage.setItem(LOGO_KEY,v)}catch(_){}applyLogoMode();const mc=$('#mcard');if(mc&&mc.querySelector('[data-dbglogo]')){try{const box=mc.querySelector('.devbody')||null;if(typeof showDev==='function')showDev();}catch(_){}}toast(v==='reset'?'全員向けの設定に戻しました':v==='text'?'文字のタイトルにしました（この端末だけ）':'画像のロゴにしました（この端末だけ）')});
document.addEventListener('click',e=>{if(e.target.closest('[data-dbg="off"]'))setTimeout(applyLogoMode,50)});
