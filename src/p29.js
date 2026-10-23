
// ===== v1.2.1：メニューの大きさを固定（タブを切りかえても大きさが変わらない） =====
const MENU_TABS=[['main','ゲーム・記録'],['look','見た目・音'],['save','セーブ'],['etc','その他']];
let MENU_SHOWN='';
showMenu=function(){
  if(!S||$('#scrGame').hidden)return showSettings();
  const m=$('#mcard'),open=!$('#modal').hidden&&m.dataset.kind==='menu'&&$('#mbody');
  if(open){const body=$('#mbody'),keep=MENU_SHOWN===MENU_TAB?body.scrollTop:0;
    m.querySelectorAll('[data-mtab]').forEach(b=>{const on=b.dataset.mtab===MENU_TAB;b.classList.toggle('on',on);b.setAttribute('aria-pressed',String(on))});
    body.innerHTML=menuBody();body.scrollTop=keep;MENU_SHOWN=MENU_TAB;try{updScrollBtns()}catch(_){}return}
  openModal(`<div class="mcat life">メニュー</div><h2>メニュー</h2>
  <div class="mtop"><button class="b pri" type="button" data-act="close">▶ ゲームに戻る</button><button class="b warnb" type="button" data-act="totitle">⌂ タイトルへ戻る<small>（自動で保存されます）</small></button></div>
  <div class="seg wrapseg mtabs">${MENU_TABS.map(([k,n])=>`<button type="button" class="${MENU_TAB===k?'on':''}" data-mtab="${k}" aria-pressed="${MENU_TAB===k}">${n}</button>`).join('')}</div>
  <div id="mbody" class="fbody">${menuBody()}</div>`);
  m.classList.add('fixedsize','menufix');m.dataset.kind='menu';MENU_SHOWN=MENU_TAB};
