
// ===== v3.0.15：セーブを守る（消されにくくする・版が変わるたびに全スロットを保管・元に戻せる） =====
// 1) ブラウザに「このサイトのデータは消さないで」とお願いする
try{if(navigator.storage&&navigator.storage.persist)navigator.storage.persisted().then(p=>{if(!p)navigator.storage.persist().catch(()=>{})}).catch(()=>{})}catch(_){}
// 2) 版が変わるたび、全スロットと実績をまとめて保管（3つ前の版まで）
const BKA_KEY='nipporia-bk-all';
function bkAll(){try{return JSON.parse(localStorage.getItem(BKA_KEY)||'[]')||[]}catch(_){return []}}
function bkSnap(){const sl={};for(let i=0;i<SLOT_N;i++){try{const v=localStorage.getItem(slotKey(i));if(v)sl[i]=v}catch(_){}}let lb=null;try{lb=localStorage.getItem('nipporia-slotlabel')}catch(_){}return {ver:CUR_VER,at:Date.now(),slots:sl,labels:lb}}
(function(){try{const L=bkAll();const last=L[0];const snap=bkSnap();if(!Object.keys(snap.slots).length)return;
 if(!last||last.ver!==CUR_VER){L.unshift(snap);while(L.length>3)L.pop();for(let k=0;k<4;k++){try{localStorage.setItem(BKA_KEY,JSON.stringify(L));break}catch(_){L.pop();if(!L.length)break}}}}catch(_){}})();
// 遊んでいる間も、10分に1回ほど保管しなおす
{const _mh87=monthHook11;monthHook11=function(){_mh87.apply(this,arguments);try{if(S&&S.am%12===0){const L=bkAll();const snap=bkSnap();if(L[0]&&L[0].ver===CUR_VER&&Date.now()-L[0].at<6e5)return;if(L[0]&&L[0].ver===CUR_VER)L[0]=snap;else{L.unshift(snap);while(L.length>3)L.pop()}localStorage.setItem(BKA_KEY,JSON.stringify(L))}}catch(_){}}}
// 3) セーブスロットの画面：保管したセーブから戻せる
function bkHtml(){const L=bkAll().filter(b=>Object.keys(b.slots||{}).length);if(!L.length)return '';
 return `<details class="pmore"><summary>🛟 保管しているセーブから戻す</summary><p class="hint small">版が変わったときなどに、自動で保管しているセーブです（新しいものから3つ）。戻すと、そのスロットのいまのセーブは置きかわります。</p>${L.map((b,i)=>`<div class="card"><div class="hd"><span>${esc(b.ver)}のとき</span><span class="muted small">${fmtDate(b.at)}</span></div>${Object.entries(b.slots).map(([si,raw])=>{let nm='',ag='';try{const o=JSON.parse(raw);nm=o.name;ag=Math.floor(o.am/12)+'歳'}catch(_){}return `<div class="row"><span class="small">スロット${+si+1}：${esc(nm)} ${ag}</span><button class="b sm" type="button" data-bkr="${i}:${si}">このセーブに戻す</button></div>`}).join('')}</div>`).join('')}</details>`}
{const _ss87=showSlots;showSlots=function(mode){const r=_ss87.apply(this,arguments);try{const h=bkHtml();if(h){const m=$('#mcard');const cl=m.querySelector('.b.pri[data-act="close"]');const d=document.createElement('div');d.innerHTML=h;if(cl)cl.before(d);else m.appendChild(d)}}catch(e){console.error(e)}return r}}
document.addEventListener('click',e=>{const b=e.target.closest('[data-bkr]');if(!b)return;const [i,si]=b.dataset.bkr.split(':').map(Number);const L=bkAll(),x=L[i];if(!x||!x.slots[si])return;
 if(S&&+si===SLOT&&!$('#scrGame').hidden){toast('いま遊んでいるスロットは、タイトルに戻ってから戻してね');return}
 try{localStorage.setItem(slotKey(si),x.slots[si]);try{const all=slotInfoAll();delete all[si];localStorage.setItem(SLOT_INFO,JSON.stringify(all))}catch(_){}toast(`スロット${si+1}を、${x.ver}のときのセーブに戻しました`);showSlots(SLOT_MODE);try{initTitle()}catch(_){}try{contInfo()}catch(_){}}catch(err){toast('戻せませんでした（保存する場所がいっぱいかもしれません）')}});
