
// ===== v3.0.18：セーブが消えていたら、保管から自動で戻す／どの版のデータかを表示して、最新版で続ける =====
// セーブに「保存したときの版」を入れる
{const _sv90=save;save=function(){try{if(S)S.saveVer=CUR_VER}catch(_){}return _sv90.apply(this,arguments)}}
// 自分で消したスロットは、自動で戻さない
const DEL_KEY='nipporia-deleted';
function delMarks(){try{return JSON.parse(localStorage.getItem(DEL_KEY)||'{}')||{}}catch(_){return {}}}
document.addEventListener('click',e=>{const b=e.target.closest('[data-sm="over2"],[data-sm="del2"]');if(!b)return;const m=delMarks();m[b.dataset.slot]=Date.now();try{localStorage.setItem(DEL_KEY,JSON.stringify(m))}catch(_){}},true);
// ページを開いたとき：空のスロットに、保管したセーブがあれば戻す（いちばん新しいもの）
(function(){try{const L=bkAll(),dm=delMarks();if(!L.length)return;const done=[];
 for(let i=0;i<SLOT_N;i++){if(localStorage.getItem(slotKey(i)))continue;let best=null;for(const b of L){const raw=b.slots&&b.slots[i];if(!raw)continue;if(dm[i]&&dm[i]>b.at)continue;if(!best||b.at>best.at)best={raw,ver:b.ver,at:b.at}}
  if(!best)continue;try{const o=JSON.parse(best.raw);if(!o||!o.alive)continue;localStorage.setItem(slotKey(i),best.raw);done.push(`スロット${i+1}（${o.name}・${Math.floor(o.am/12)}歳・${o.saveVer||best.ver}のデータ）`)}catch(_){}}
 if(done.length){try{const all=slotInfoAll();for(let i=0;i<SLOT_N;i++)delete all[i];localStorage.setItem(SLOT_INFO,JSON.stringify(all))}catch(_){}
  setTimeout(()=>{try{initTitle();contInfo()}catch(_){}try{popBig('🛟 セーブを戻しました',done.join('<br>'),'「つづきから」で続けられます')}catch(_){toast('セーブを保管から戻しました')}},800)}}catch(e){console.error(e)}})();
// スロットの画面：どの版のデータか表示して、最新版で続ける
function slotVer(i){try{const o=JSON.parse(localStorage.getItem(slotKey(i))||'null');if(!o)return null;return o.saveVer||null}catch(_){return null}}
{const _sc90=slotCard;slotCard=function(i,s,mode){let h=_sc90.apply(this,arguments);try{if(!s)return h;const v=slotVer(i);const label=v?(v===CUR_VER?`${v}（最新版）のデータ`:`${v}のデータ`):'以前の版のデータ';
 h=h.replace('<p class="hint small">',`<p class="hint small"><span class="chip">${esc(label)}</span> `);
 if(v!==CUR_VER)h=h.replace('>この人生を続ける</button>',`>最新版（${esc(CUR_VER)}）で続ける</button>`)}catch(_){}return h}}
// 続けたときに、版が上がったことを知らせる
document.addEventListener('click',e=>{const b=e.target.closest('[data-sm="cont"]');if(!b)return;const v=slotVer(+b.dataset.slot);if(v&&v!==CUR_VER)setTimeout(()=>{try{toast(`${v}のデータを、最新版（${CUR_VER}）で続けます`)}catch(_){}},500)},true);
