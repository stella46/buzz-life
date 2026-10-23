
// ===== v1.1.5：ゲーム中のメニューを整理（上によく使う操作、下は種類ごとのタブ） =====
let MENU_TAB='main';
function menuTile(act,ic,t,d,extra){return `<button class="b mtile" type="button" data-act="${act}" ${extra||''}><span class="mi">${ic}</span><span class="mt">${t}</span>${d?`<span class="md">${d}</span>`:''}</button>`}
function menuBody(){const T=MENU_TAB;
  if(T==='main')return `<h3>ゲーム</h3><div class="mgrid">${menuTile('autopayT','💳',`支払い：${S.autopay?'自動':'自分で'}`,'押すと切りかわる')}${menuTile('guide','📖','遊び方','画面と操作の説明')}${menuTile('tutRestart','🧭','チュートリアル','画面の案内をもう一度')}</div>
   <h3>記録</h3><div class="mgrid">${menuTile('achv','🏆','実績・図鑑','集めた実績と出来事')}${menuTile('playRec','⏱','プレイ時間','遊んだ時間の記録')}</div>`;
  if(T==='look')return `<h3>音量</h3>${volHtml()}${soundBtns()}`;
  if(T==='save')return `<h3>セーブ</h3><p class="hint">セーブは自動。月が進むたび、このブラウザに保存される。</p><div class="mgrid">${menuTile('msave','💾','いま保存する','念のため手動で保存')}${menuTile('export','📤','書き出す','控えのファイルを作る')}</div><h3>セーブデータを消す</h3><p class="hint">消したデータは元に戻せない。残したいときは先に「書き出す」で控えておく。</p>${delHtml()}`;
  return `<div class="mgrid">${menuTile('fb','✉️','感想・不具合を送る','開発者に届く')}${menuTile('news','📰','アップデート情報','新しくなったこと')}${menuTile('credit','©','出典・クレジット','使っている素材など')}</div>`}
function showMenu(){
  if(!S||$('#scrGame').hidden)return showSettings();
  const tabs=[['main','ゲーム・記録'],['look','見た目・音'],['save','セーブ'],['etc','その他']];
  openModal(`<div class="mcat life">メニュー</div><h2>メニュー</h2>
  <div class="mtop"><button class="b pri" type="button" data-act="close">▶ ゲームに戻る</button><button class="b warnb" type="button" data-act="totitle">⌂ タイトルへ戻る<small>（自動で保存されます）</small></button></div>
  <div class="seg wrapseg mtabs">${tabs.map(([k,n])=>`<button type="button" class="${MENU_TAB===k?'on':''}" data-mtab="${k}">${n}</button>`).join('')}</div>
  <div id="mbody">${menuBody()}</div>`);
}
document.addEventListener('click',e=>{const b=e.target.closest('button');if(!b||!S)return;
  if(b.dataset.mtab){MENU_TAB=b.dataset.mtab;showMenu();return}
  if(b.dataset.act==='msave'){save(true);toast('保存しました');return}});
