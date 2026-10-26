
// ===== v3.0.9：終わった人生も残す／伸びきったときのバズ／おまかせで買い物もする =====

// ----- 終わった人生を残す（最大10人生。セーブスロットの画面から見られる） -----
const DONE_KEY='nipporia-done';
function doneList(){try{return JSON.parse(localStorage.getItem(DONE_KEY)||'[]')||[]}catch(_){return []}}
function doneSave(L){for(let i=0;i<12;i++){try{localStorage.setItem(DONE_KEY,JSON.stringify(L));return true}catch(_){if(!L.length)return false;L.pop()}}return false}
{const _fl82=finalizeLife;finalizeLife=function(){try{if(S&&!VIEW_DONE){const L=doneList();L.unshift({at:Date.now(),name:S.name,age:age(),cty:ctry(),y:S.y,m:S.m,gen:S.gen||1,f:Math.round(S.stats.maxF||0),mm:Math.round(S.stats.maxM||0),cause:S.cause||'',slot:typeof SLOT!=='undefined'?SLOT:0,d:JSON.stringify(S)});while(L.length>10)L.pop();doneSave(L)}}catch(e){console.error(e)}return _fl82.apply(this,arguments)}}
let VIEW_DONE=0;
function doneHtml(){const L=doneList();if(!L.length)return '';
 return `<h3>📚 終わった人生（${L.length}）</h3><p class="hint small">亡くなった人生や、子どもに託した人生の記録です（新しいものから10人生まで）。</p>${L.map((x,i)=>`<div class="card slotc2" id="donec_${i}"><div class="hd"><span><b>${esc(x.name)}</b> 享年${x.age}歳</span><span class="muted small">${fmtDate(x.at)}</span></div><p class="hint small">${esc(x.cty)}・${x.y}年${x.gen>1?`・${x.gen}代目`:''}${x.cause?`・${esc(x.cause)}`:''}<br>最高フォロワー ${num(x.f)}人・最高資産 ${yen(x.mm)}</p><div class="row"><button class="b sm" type="button" data-done="${i}" data-dm="view">記録を見る</button><button class="b sm ghost" type="button" data-done="${i}" data-dm="del">🗑 消す</button></div></div>`).join('')}`}
{const _ss82=showSlots;showSlots=function(mode){const r=_ss82.apply(this,arguments);try{const h=doneHtml();if(h){const m=$('#mcard');const cl=m.querySelector('.b.pri[data-act="close"]');const d=document.createElement('div');d.className='donebox';d.innerHTML=h;if(cl)cl.before(d);else m.appendChild(d)}}catch(e){console.error(e)}return r}}
document.addEventListener('click',e=>{const b=e.target.closest('[data-done]');if(!b)return;const i=+b.dataset.done,m=b.dataset.dm,L=doneList(),x=L[i];if(!x)return;
 if(m==='del'){const c=$('#donec_'+i);if(c){const r=c.querySelector('.row');r.innerHTML=`<span class="confirm-inline">この記録を消す？ <button class="b sm danger" type="button" data-done="${i}" data-dm="del2">消す</button><button class="b sm" type="button" data-done="${i}" data-dm="back">やめる</button></span>`}return}
 if(m==='back'){showSlots(SLOT_MODE);return}
 if(m==='del2'){L.splice(i,1);doneSave(L);showSlots(SLOT_MODE);toast('記録を消しました');return}
 if(m==='view'){try{const o=migrate(JSON.parse(x.d));o.alive=false;closeModal();VIEW_DONE=1;S=o;showEnding();
  const el=$('#scrEnd');el.querySelectorAll('.card').forEach(c=>{if(/家系をつなぐ/.test(c.textContent))c.remove()});
  const top=document.createElement('p');top.className='hint';top.style.textAlign='center';top.innerHTML='📚 終わった人生の記録を見ています。<button class="b sm" type="button" data-act="doneBack">タイトルへ戻る</button>';el.prepend(top)}catch(err){console.error(err);toast('記録を開けませんでした')}}});
document.addEventListener('click',e=>{const b=e.target.closest('[data-act="doneBack"]');if(!b)return;VIEW_DONE=0;S=null;showScreen('title');try{contInfo()}catch(_){}});
// 記録を見たあと、ほかの操作に移るときは、見ていた人生を手放す
document.addEventListener('click',e=>{if(!VIEW_DONE)return;const b=e.target.closest('[data-act="setup"],[data-act="achv"]');if(b&&b.dataset.act==='setup')VIEW_DONE=0},true);

// ----- 伸びきったときのバズ：ふだんの再生数（バズかどうかに関係なく最近の投稿）と、登録者の数をもとに判定 -----
{const _dp82=doPost;doPost=function(k){const key=S.main,f0=S.f[key]||0;const r=_dp82.apply(this,arguments);try{if(SUBPOST)return r;const last=(S.posts||[])[S.posts.length-1];if(!last||last.am!==S.am||last._bz)return r;last._bz=1;
 const L=(S.plog||[]).filter(p=>!(p.am===last.am&&p.t===last.t)).slice(-8).map(p=>p.v).sort((a,b)=>a-b);const med=L.length?L[L.length>>1]:0;const base=Math.max(med,f0*.5,1000);
 const was=last.b;last.b=last.v>=base*3?1:0;
 if(was&&!last.b){for(const arr of [S.plog,S.pbest]){if(!arr)continue;const x=arr.find(p=>p.am===last.am&&p.t===last.t);if(x)x.b=0}}}catch(e){console.error(e)}return r}}
{const _lg82=log;log=function(t){try{if(typeof t==='string'&&t.startsWith('🔥 バズった投稿')){const last=(S.posts||[])[S.posts.length-1];if(last&&last.am===S.am){const L=(S.plog||[]).filter(p=>!(p.am===last.am&&p.t===last.t)).slice(-8).map(p=>p.v).sort((a,b)=>a-b);const med=L.length?L[L.length>>1]:0;const f=S.f[S.main]||0;if(last.v<Math.max(med,f*.5,1000)*3)return}}}catch(_){}return _lg82.apply(this,arguments)}}

// ----- おまかせ：引き継ぎスキルは自分で選ぶ（おまかせから外す） -----
{const i=OMK.findIndex(x=>x[0]==='leg');if(i>=0)OMK.splice(i,1)}
{const _om82=omkMore;omkMore=function(){try{if(S&&S.omk)S.omk.leg=0}catch(_){}return _om82.apply(this,arguments)}}

// ----- おまかせ（お金）：暮らしの買い物・住まい・契約・部屋の飾り・使い道も -----
function parseYen(s){s=String(s||'').replace(/,/g,'');const m=s.match(/([\d.]+(?:京|兆|億|万)?)+円/);if(!m)return 0;const t=m[0].replace('円','');let v=0;const re=/([\d.]+)(京|兆|億|万)?/g;let x;while((x=re.exec(t))){v+=parseFloat(x[1])*({京:1e16,兆:1e12,億:1e8,万:1e4}[x[2]]||1)}return v}
function omkShopBox(html){let box=document.getElementById('omkBox');if(!box){box=document.createElement('div');box.id='omkBox';box.hidden=true;document.body.appendChild(box)}box.innerHTML=html;return box}
function omkBuyAll(){if(!S||!omk('money')||age()<18||S.money<=0)return;const did=[];const sv=SUB.money,rp=renderPanel,rd=render,sn=snd,tt=toast;let n=0;
 try{renderPanel=function(){};render=function(){};snd=function(){};toast=function(){};
  // 買い物（暮らし・住まい・契約・部屋の飾り）
  SUB.money='shop';const box=omkShopBox(panelMoney());const rows=[...box.querySelectorAll('.shop')];
  const subsOn=Object.keys(S.subs||{}).filter(k=>S.subs[k]).length;
  const cnt={home:0,sub2:0,dbuy:0,good:0},lim={home:1,sub2:1,dbuy:1,good:2};
  const rows2=rows.slice().sort((a,b)=>(/1回だけ/.test(b.textContent)?1:0)-(/1回だけ/.test(a.textContent)?1:0));
  for(const typ of ['home','sub2','dbuy','good'])for(const row of (typ==='good'?rows2:rows)){if(cnt[typ]>=lim[typ])break;const b=row.querySelector('button:not([disabled])');if(!b||b.dataset[typ]==null)continue;const p=parseYen(row.textContent);const tx=row.textContent;
   if(typ==='good'){const once=/1回だけ/.test(tx);if(gMonthAll()>=G_OVER-1)break;if(S.money>=p*(once?10:40)){b.click();cnt.good++;did.push(tx.split(/\s/)[0])}}
   else if(typ==='home'){if(+b.dataset.home>S.home&&S.money>=p*20){b.click();cnt.home++;did.push('引っ越し')}}
   else if(typ==='sub2'){if(!b.classList.contains('on')&&subsOn<8&&S.money>=p*240&&!/odd|lux/.test(SUBS[b.dataset.sub2]?SUBS[b.dataset.sub2].c:'')){b.click();cnt.sub2++;did.push('契約')}}
   else if(typ==='dbuy'){if(S.money>=Math.max(1,p)*30){b.click();cnt.dbuy++;did.push('部屋の飾り')}}}
  n=cnt.home+cnt.sub2+cnt.dbuy+cnt.good;
  // 使い道（旅行・自分みがきなど）
  if(n<3&&S.m%2===0){SUB.money='spend';const box2=omkShopBox(panelMoney());for(const row of box2.querySelectorAll('.shop')){const b=row.querySelector('button[data-spend]:not([disabled])');if(!b||b.classList.contains('on')||/解約|契約/.test(b.textContent))continue;const p=parseYen(row.textContent);if(p>0&&S.money>=p*60){b.click();did.push('お金の使い道');break}}}}
 catch(e){console.error(e)}finally{renderPanel=rp;render=rd;snd=sn;toast=tt;SUB.money=sv;const box=document.getElementById('omkBox');if(box)box.innerHTML=''}
 if(did.length)log('おまかせ：'+did.slice(0,4).join('・'),'life')}
{const _mh82=monthHook11;monthHook11=function(){_mh82.apply(this,arguments);try{omkBuyAll()}catch(e){console.error(e)}}}
try{const o=OMK.find(x=>x[0]==='money');if(o)o[2]='自動払い・機材や暮らしの買い物・住まい・契約・部屋の飾り・お金の使い道をまかせます'}catch(_){}
