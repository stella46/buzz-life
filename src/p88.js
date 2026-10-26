
// ===== v3.0.16：保存する場所がいっぱいでも、セーブが失われないように =====
// セーブの書きこみに失敗したら、古い保管データから順に片づけて、もう一度書きこむ
function lsUsage(){let n=0;try{for(let i=0;i<localStorage.length;i++){const k=localStorage.key(i);n+=k.length+(localStorage.getItem(k)||'').length}}catch(_){}return n}
function lsCleanOnce(){try{
 // 1) 自動で保管したセーブ（古いものから）
 const b=JSON.parse(localStorage.getItem('nipporia-bk-all')||'[]');if(b.length){b.pop();if(b.length)localStorage.setItem('nipporia-bk-all',JSON.stringify(b));else localStorage.removeItem('nipporia-bk-all');return 'bk'}
 // 2) 前の版のときのセーブの控え
 if(localStorage.getItem('nipporia-save-backup')){localStorage.removeItem('nipporia-save-backup');return 'backup'}
 // 3) 終わった人生の記録（古いものから）
 const d=JSON.parse(localStorage.getItem('nipporia-done')||'[]');if(d.length){d.pop();if(d.length)localStorage.setItem('nipporia-done',JSON.stringify(d));else localStorage.removeItem('nipporia-done');return 'done'}
 // 4) 人生の保管（さかのぼり用の古いデータ）
 for(let i=0;i<localStorage.length;i++){const k=localStorage.key(i);if(/-snap$/.test(k)){localStorage.removeItem(k);return 'snap'}}
 }catch(_){}return null}
{const P=Storage.prototype,_set=P.setItem;let warned=0;
 P.setItem=function(k,v){try{return _set.call(this,k,v)}catch(e){
  if(this!==window.localStorage||!/^nipporia-(save-v1|meta|slot)/.test(String(k)))throw e;
  for(let t=0;t<20;t++){const what=lsCleanOnce();if(!what)break;try{const r=_set.call(this,k,v);if(!warned){warned=1;try{toast('保存する場所がいっぱいだったので、古い保管データを片づけて保存しました')}catch(_){}}return r}catch(_){}}
  try{toast('保存する場所がいっぱいで、セーブできませんでした。「設定・セーブ」で使っている量を確認してください')}catch(_){}throw e}}}
// 設定・セーブ：使っている量と、片づけるボタン
{const _sh88=showSettings;showSettings=function(){const r=_sh88.apply(this,arguments);setTimeout(()=>{try{const m=$('#mcard');const pane=m&&m.querySelector('.spane[data-pane="save"]');if(!pane||pane.querySelector('.lsuse'))return;const kb=Math.round(lsUsage()*2/1024);const d=document.createElement('div');d.className='card lsuse';
 d.innerHTML=`<div class="hd"><span>💽 この端末で使っている量</span><b>約${kb>=1024?(kb/1024).toFixed(1)+'MB':kb+'KB'}</b></div><p class="hint small">ブラウザが保存できるのは、だいたい5MBまでです。いっぱいになると、セーブできなくなることがあります。</p><div class="row"><button class="b sm" type="button" data-lsclean="1">古い保管データを片づける</button></div>`;pane.prepend(d)}catch(e){console.error(e)}},200);return r}}
document.addEventListener('click',e=>{const b=e.target.closest('[data-lsclean]');if(!b)return;let n=0;for(let i=0;i<30;i++){const w=lsCleanOnce();if(!w||w==='done')break;n++}toast(n?`古い保管データを${n}つ片づけました（いまのセーブと実績はそのままです）`:'片づけるものはありませんでした');try{const c=b.closest('.lsuse');if(c){const kb=Math.round(lsUsage()*2/1024);c.querySelector('b').textContent='約'+(kb>=1024?(kb/1024).toFixed(1)+'MB':kb+'KB')}}catch(_){}});
// セーブの状態を調べる（困ったときに、画面を送ってもらう用）
function saveDiag(){const out=[];for(let i=0;i<SLOT_N;i++){const k=slotKey(i);let raw=null,msg='';try{raw=localStorage.getItem(k)}catch(e){msg='読めない:'+e.name}
  if(raw){try{const o=JSON.parse(raw);msg=`${o.name||'?'}・${Math.floor((o.am||0)/12)}歳・v${o.v}・${o.alive?'続きあり':'終わった人生'}`;try{slotInfo(i)}catch(e){msg+='・表示エラー:'+e.message}}catch(e){msg='こわれている:'+e.message}}
  out.push(`スロット${i+1}：${raw?Math.round(raw.length/1024)+'KB・'+msg:'なし'}${i===SLOT?'（いまのスロット）':''}`)}
 out.push(`使っている量：約${Math.round(lsUsage()*2/1024)}KB／保存のお願い：${navigator.storage&&navigator.storage.persist?'あり':'なし'}`);out.push(`版：${CUR_VER}・${navigator.userAgent.slice(0,80)}`);return out}
{const _sh88b=showSettings;showSettings=function(){const r=_sh88b.apply(this,arguments);setTimeout(()=>{try{const c=document.querySelector('#mcard .lsuse .row');if(c&&!c.querySelector('[data-sdiag]')){const b=document.createElement('button');b.className='b sm ghost';b.type='button';b.dataset.sdiag='1';b.textContent='セーブの状態を見る';c.appendChild(b)}}catch(_){}},300);return r}}
document.addEventListener('click',e=>{const b=e.target.closest('[data-sdiag]');if(!b)return;const c=b.closest('.lsuse');let p=c.querySelector('.sdiag');if(!p){p=document.createElement('pre');p.className='sdiag small';p.style.whiteSpace='pre-wrap';c.appendChild(p)}p.textContent=saveDiag().join('\n')});
