
// ===== v2.1：タイトルロゴ（見た目の設定に合わせて切りかえ） =====
function applyLogo(){const img=$('#logoImg'),w=$('#logoWrap');if(!img||!w)return;const st=(typeof sceneStyle==='function'?sceneStyle():'hybrid');const dot=st==='classic'||st==='pixel';
  const src=dot?'logo-dot.png':'logo.webp';if(img.getAttribute('src')!==src)img.setAttribute('src',src);w.classList.toggle('dot',dot);w.style.setProperty('--logomask',`url(${src})`)}
(function(){const img=$('#logoImg');if(!img)return;img.addEventListener('load',()=>document.body.classList.add('haslogo'));img.addEventListener('error',()=>{document.body.classList.remove('haslogo');const w=$('#logoWrap');if(w)w.hidden=true});if(img.complete&&img.naturalWidth)document.body.classList.add('haslogo');applyLogo()})();
const _applyGfx42=applyGfx;applyGfx=function(){const r=_applyGfx42.apply(this,arguments);try{applyLogo()}catch(_){}return r};

// ===== v2.1：新しく始めるときに、遊ぶバージョンを選べるように =====
(function(){const orig=showSlots;showSlots=function(mode){const r=orig.apply(this,arguments);if(mode!=='new')return r;try{const m=$('#mcard'),h2=m&&m.querySelector('h2');if(!h2||m.querySelector('#verPick'))return r;
  const d=document.createElement('div');d.id='verPick';d.className='verpick';
  d.innerHTML=`<div class="vp-t">遊ぶバージョン</div><div class="vp-row"><button class="b vp on" type="button" data-vp="new" aria-pressed="true"><b>最新版 ${esc(CUR_VER)}</b><span>賞・大計画・超大企業など、すべての要素で遊べます（おすすめ）</span></button><a class="b vp" href="versions/v1.2/" data-vp="old"><b>v1.2.3</b><span>v2.0で大きく変わる前の、シンプルな遊び心地です。別の画面で開き、セーブも別になります</span></a></div>`;
  h2.insertAdjacentElement('afterend',d)}catch(_){}return r}})();
