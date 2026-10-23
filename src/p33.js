
// ===== v1.3.1：デバッグモード（開発者用・パスワード式） =====
// パスワードそのものはここに書かず、ハッシュ（SHA-256）だけを置く
const DEV_SALT='buzz-life-dev:',DEV_HASH='51902eabc571d2bc835b209338c9d2d1ed2fdabf7b973d3aab37ebc0701120b1',DEV_KEY='buzz-dev';
function sha256hex(str){// 小さなSHA-256（crypto.subtle が使えない環境用）
  const K=[0x428a2f98,0x71374491,0xb5c0fbcf,0xe9b5dba5,0x3956c25b,0x59f111f1,0x923f82a4,0xab1c5ed5,0xd807aa98,0x12835b01,0x243185be,0x550c7dc3,0x72be5d74,0x80deb1fe,0x9bdc06a7,0xc19bf174,0xe49b69c1,0xefbe4786,0x0fc19dc6,0x240ca1cc,0x2de92c6f,0x4a7484aa,0x5cb0a9dc,0x76f988da,0x983e5152,0xa831c66d,0xb00327c8,0xbf597fc7,0xc6e00bf3,0xd5a79147,0x06ca6351,0x14292967,0x27b70a85,0x2e1b2138,0x4d2c6dfc,0x53380d13,0x650a7354,0x766a0abb,0x81c2c92e,0x92722c85,0xa2bfe8a1,0xa81a664b,0xc24b8b70,0xc76c51a3,0xd192e819,0xd6990624,0xf40e3585,0x106aa070,0x19a4c116,0x1e376c08,0x2748774c,0x34b0bcb5,0x391c0cb3,0x4ed8aa4a,0x5b9cca4f,0x682e6ff3,0x748f82ee,0x78a5636f,0x84c87814,0x8cc70208,0x90befffa,0xa4506ceb,0xbef9a3f7,0xc67178f2];
  const b=new TextEncoder().encode(str),l=b.length,n=((l+9+63)>>6)<<6,m=new Uint8Array(n);m.set(b);m[l]=0x80;const dv=new DataView(m.buffer);dv.setUint32(n-4,l*8>>>0);dv.setUint32(n-8,Math.floor(l/0x20000000));
  let H=[0x6a09e667,0xbb67ae85,0x3c6ef372,0xa54ff53a,0x510e527f,0x9b05688c,0x1f83d9ab,0x5be0cd19];const W=new Uint32Array(64),r=(x,y)=>(x>>>y)|(x<<(32-y));
  for(let o=0;o<n;o+=64){for(let i=0;i<16;i++)W[i]=dv.getUint32(o+i*4);for(let i=16;i<64;i++){const s0=r(W[i-15],7)^r(W[i-15],18)^(W[i-15]>>>3),s1=r(W[i-2],17)^r(W[i-2],19)^(W[i-2]>>>10);W[i]=(W[i-16]+s0+W[i-7]+s1)>>>0}
    let [a,b2,c,d,e,f,g,h]=H;for(let i=0;i<64;i++){const S1=r(e,6)^r(e,11)^r(e,25),ch=(e&f)^(~e&g),t1=(h+S1+ch+K[i]+W[i])>>>0,S0=r(a,2)^r(a,13)^r(a,22),mj=(a&b2)^(a&c)^(b2&c),t2=(S0+mj)>>>0;h=g;g=f;f=e;e=(d+t1)>>>0;d=c;c=b2;b2=a;a=(t1+t2)>>>0}
    H=H.map((x,i)=>(x+[a,b2,c,d,e,f,g,h][i])>>>0)}return H.map(x=>x.toString(16).padStart(8,'0')).join('')}
function devOn(){try{return localStorage.getItem(DEV_KEY)===DEV_HASH}catch(_){return false}}
function devCheck(pw){return sha256hex(DEV_SALT+pw)===DEV_HASH}
// 入り口：タイトルの版の表示を5回タップ、または設定の下の小さな「開発者」
let DEV_TAP=0,DEV_TAPT=0;
document.addEventListener('click',e=>{const v=e.target.closest('#scrTitle .ver,#verTag,.vertag');if(!v)return;const now=Date.now();DEV_TAP=now-DEV_TAPT<1500?DEV_TAP+1:1;DEV_TAPT=now;if(DEV_TAP>=5){DEV_TAP=0;devLogin()}});
function devLogin(){if(devOn()){showDev();return}openModal(`<div class="mcat life">開発者</div><h2>デバッグモード</h2><p class="hint">開発者用のパスワードを入れてね。</p><div class="row chren"><input id="devPw" type="password" autocomplete="off" placeholder="パスワード"><button class="b pri" type="button" data-act="devGo">入る</button></div><p class="hint" id="devMsg"></p><button class="b" type="button" data-act="close">閉じる</button>`);setTimeout(()=>{const i=$('#devPw');if(i)i.focus()},50)}
document.addEventListener('keydown',e=>{if(e.key==='Enter'&&e.target&&e.target.id==='devPw'){e.preventDefault();document.querySelector('[data-act="devGo"]').click()}});

// ----- デバッグ画面 -----
let DEV_TAB='num',DEV_ERR=[];
addEventListener('error',e=>{DEV_ERR.unshift(`${new Date().toLocaleTimeString()} ${e.message} (${(e.filename||'').split('/').pop()}:${e.lineno})`);DEV_ERR=DEV_ERR.slice(0,30)});
addEventListener('unhandledrejection',e=>{DEV_ERR.unshift(`${new Date().toLocaleTimeString()} ${e.reason}`);DEV_ERR=DEV_ERR.slice(0,30)});
const _ce33=console.error;console.error=function(...a){try{DEV_ERR.unshift(`${new Date().toLocaleTimeString()} ${a.map(x=>x&&x.stack?x.stack.split('\n').slice(0,2).join(' '):String(x)).join(' ')}`);DEV_ERR=DEV_ERR.slice(0,30)}catch(_){}return _ce33.apply(console,a)};
function devNum(id,label,val,step){return `<label class="fld devf"><span>${label}</span><input type="number" id="${id}" value="${Math.round(val*100)/100}" step="${step||1}"></label>`}
function devBody(){const T=DEV_TAB;const inGame=S&&!$('#scrGame').hidden;
  if(!inGame&&['num','time','ev','biz'].includes(T))return '<p class="hint">ゲームを始めてから使える。</p>';
  if(T==='num'){let h=`<div class="devgrid">${devNum('dv_money','お金',S.money,10000)}${devNum('dv_f','フォロワー（メインのSNS）',S.snsOpen?S.f[S.main]:0,100)}${devNum('dv_rp','研究ポイント',S.rp)}${devNum('dv_sp','スキルポイント',S.sp||0)}</div><h3>能力</h3><div class="devgrid">`;
    for(const [k,n] of Object.entries(P_KEYS))h+=devNum('dv_p_'+k,n,S.p[k]);for(const [k,n] of Object.entries(SK_KEYS))h+=devNum('dv_k_'+k,n,S.sk[k]);
    h+=`</div><h3>素質（最大${TAL_MAX}）</h3><div class="devgrid">`;for(const k of TALK)h+=devNum('dv_t_'+k,GENRES[k].n,S.tal[k]||0);
    return h+`</div><div class="row"><button class="b pri" type="button" data-dbg="apply">この数字にする</button><button class="b" type="button" data-dbg="max">ぜんぶ最大</button><button class="b" type="button" data-dbg="rich">お金 +1億円</button></div>${S.snsOpen?'':'<div class="row"><button class="b" type="button" data-dbg="sns">SNSを始める</button></div>'}`}
  if(T==='time')return `<p class="hint">いま：${S.y}年${S.m}月・${age()}歳</p><div class="row"><button class="b" type="button" data-dbg="adv" data-n="1">1か月</button><button class="b" type="button" data-dbg="adv" data-n="12">1年</button><button class="b" type="button" data-dbg="adv" data-n="60">5年</button><button class="b" type="button" data-dbg="adv" data-n="120">10年</button></div><p class="hint">出来事はおまかせで自動に選んで進める。</p>${devNum('dv_age','この年齢まで進める',age()+10)}<div class="row"><button class="b" type="button" data-dbg="toage">進める</button></div><h3>寿命</h3><div class="row"><button class="b" type="button" data-dbg="heal">健康・メンタル・幸福を100に</button><button class="b ghost" type="button" data-dbg="die">この人生を終える</button></div>`;
  if(T==='ev')return `<div class="row chren"><input id="dv_q" placeholder="出来事を検索（名前・ID）" value="${esc(DEV_Q||'')}"><button class="b sm" type="button" data-dbg="evq">検索</button></div><p class="hint small">条件を満たしていなくても、そのまま起こす（おかしな表示になることもある）。</p><div class="devlist">${devEvList()}</div>`;
  if(T==='biz')return `<div class="row"><button class="b" type="button" data-dbg="resall">研究をすべて終える</button><button class="b" type="button" data-dbg="office">事務所を自社ビルに</button><button class="b" type="button" data-dbg="prod">会社の作品をすぐ完成</button><button class="b" type="button" data-dbg="town">まちの発展度 +50</button><button class="b" type="button" data-dbg="svc">サブスク会員 +1万人</button></div>`;
  if(T==='ach'){const got=ACH.filter(a=>META.ach[a[0]]).length;return `<p class="hint">実績 ${got} / ${ACH.length}（実績・図鑑は全スロット共通。テストのあとは元に戻すのがおすすめ）</p><div class="row"><button class="b" type="button" data-dbg="achall">実績をすべて解除</button><button class="b ghost" type="button" data-dbg="achback">デバッグ前の状態に戻す</button><button class="b ghost" type="button" data-dbg="achclr">実績をすべて消す</button></div><div class="row"><button class="b" type="button" data-dbg="seenall">出来事図鑑をすべて埋める</button></div>`}
  if(T==='info'){let sz=0;try{for(let i=0;i<localStorage.length;i++){const k=localStorage.key(i);sz+=(localStorage.getItem(k)||'').length}}catch(_){}
    return `<div class="kv"><span>版</span><span>${esc(CUR_VER)}</span><span>出来事の数</span><span>${Object.keys(EV).length}</span><span>保存データの大きさ</span><span>${num(Math.round(sz/1024))}KB</span>${inGame?`<span>いまのセーブ</span><span>${num(Math.round(JSON.stringify(S).length/1024))}KB</span><span>種（シード）</span><span>${S.seed}</span><span>デバッグを使った</span><span>${S.dbg?'はい':'いいえ'}</span>`:''}</div><h3>エラーの記録</h3><div class="devlog">${DEV_ERR.length?DEV_ERR.map(x=>`<div>${esc(x)}</div>`).join(''):'<p class="hint">いまのところエラーなし</p>'}</div><div class="row"><button class="b sm" type="button" data-dbg="errclr">記録を消す</button>${inGame?'<button class="b sm" type="button" data-dbg="json">いまの状態をコピー</button>':''}</div>`}
  return `<p class="hint">このデバイスでデバッグモードがオンになっている。</p><div class="row"><button class="b" type="button" data-dbg="off">デバッグモードを終了</button></div>`}
let DEV_Q='';
function devEvList(){const q=(DEV_Q||'').trim();const list=Object.values(EV).filter(e=>!q||(e.id||'').includes(q)||(e.t||'').includes(q)).slice(0,60);return list.map(e=>`<div class="shop"><div><div>${esc(e.t||e.id)}</div><div class="muted small">${esc(e.id)}・${esc(e.cat||'')}</div></div><button class="b sm" type="button" data-dbg="ev" data-id="${esc(e.id)}">起こす</button></div>`).join('')||'<p class="hint">見つからない</p>'}
function showDev(){const tabs=[['num','数値'],['time','時間'],['ev','出来事'],['biz','解放・事業'],['ach','実績'],['info','情報'],['etc','終了']];
  const m=$('#mcard');if(!$('#modal').hidden&&m.dataset.kind==='dev'&&$('#devBody')){m.querySelectorAll('[data-devtab]').forEach(b=>b.classList.toggle('on',b.dataset.devtab===DEV_TAB));$('#devBody').innerHTML=devBody();return}
  openModal(`<div class="mcat life">開発者</div><h2>🛠 デバッグモード</h2><div class="seg wrapseg">${tabs.map(([k,n])=>`<button type="button" class="${DEV_TAB===k?'on':''}" data-devtab="${k}">${n}</button>`).join('')}</div><div id="devBody" class="fbody">${devBody()}</div><button class="b pri" type="button" data-act="close">閉じる</button>`);
  m.classList.add('fixedsize','menufix');m.dataset.kind='dev'}
function devAdv(n){const R0=render;render=function(){};const sp=speed;try{for(let i=0;i<n&&S&&S.alive;i++){if(modalOpen()){if(curEv){try{autoChoose(curEv.e)}catch(_){}}closeModal()}S.auto=S.auto||1;turn();if(modalOpen()&&curEv){try{autoChoose(curEv.e)}catch(_){}closeModal()}else if(modalOpen())closeModal()}}finally{render=R0}save(true);render();setSpeed(0)}
document.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;const d=b.dataset;
  if(d.act==='devGo'){const pw=($('#devPw')||{}).value||'';if(devCheck(pw)){try{localStorage.setItem(DEV_KEY,DEV_HASH)}catch(_){}toast('デバッグモードをオンにしました');devButton();showDev()}else{const m=$('#devMsg');if(m)m.textContent='パスワードがちがいます'}return}
  if(d.devtab){DEV_TAB=d.devtab;showDev();return}
  if(!d.dbg||!devOn())return;const a=d.dbg,v=id=>{const el=$('#'+id);return el?+el.value:null};
  if(S)S.dbg=1;
  if(a==='apply'){S.money=v('dv_money');if(S.snsOpen)S.f[S.main]=Math.max(0,v('dv_f'));S.rp=v('dv_rp');S.sp=v('dv_sp');for(const k in P_KEYS)S.p[k]=clamp(v('dv_p_'+k));for(const k in SK_KEYS)S.sk[k]=clamp(v('dv_k_'+k));for(const k of TALK)S.tal[k]=Math.max(0,Math.min(TAL_MAX,v('dv_t_'+k)));toast('反映しました')}
  else if(a==='max'){for(const k in P_KEYS)S.p[k]=100;for(const k in SK_KEYS)S.sk[k]=100;for(const k of TALK)S.tal[k]=TAL_MAX;toast('ぜんぶ最大にしました')}
  else if(a==='rich'){S.money+=1e8}
  else if(a==='sns'){openSns('milu');S.main='milu'}
  else if(a==='adv'){devAdv(+d.n)}
  else if(a==='toage'){const t=v('dv_age');devAdv(Math.max(0,Math.round((t-age())*12)))}
  else if(a==='heal'){S.p.health=100;S.p.mental=100;S.p.happy=100}
  else if(a==='die'){closeModal();try{die()}catch(err){console.error(err)}return}
  else if(a==='evq'){DEV_Q=($('#dv_q')||{}).value||'';$('#devBody').innerHTML=devBody();return}
  else if(a==='ev'){const ev=EV[d.id];if(ev){closeModal();try{showEvent(ev)}catch(err){console.error(err);toast('この出来事はいま起こせない')}}return}
  else if(a==='resall'){RES.forEach(r=>S.res[r.id]=1)}
  else if(a==='office'){S.office.lv=3}
  else if(a==='prod'){for(const c of (S.cos||[]))if(c.pr&&c.pr.act)c.pr.act.st=S.am-c.pr.act.dur}
  else if(a==='town'){S.town.bonus=(S.town.bonus||0)+50}
  else if(a==='svc'){for(const s of (S.svcs||[]))s.users+=10000}
  else if(a==='achall'){if(!META.dbgAch)META.dbgAch=Object.assign({},META.ach);ACH.forEach(x=>META.ach[x[0]]=1);saveMeta()}
  else if(a==='achback'){if(META.dbgAch){META.ach=META.dbgAch;delete META.dbgAch;saveMeta();toast('元に戻しました')}else toast('戻す記録がない')}
  else if(a==='achclr'){if(!META.dbgAch)META.dbgAch=Object.assign({},META.ach);META.ach={};saveMeta()}
  else if(a==='seenall'){Object.keys(EV).forEach(k=>META.seen[k]=1);saveMeta()}
  else if(a==='errclr'){DEV_ERR=[]}
  else if(a==='json'){try{navigator.clipboard.writeText(JSON.stringify(S));toast('コピーしました')}catch(_){}}
  else if(a==='off'){try{localStorage.removeItem(DEV_KEY)}catch(_){}devButton();closeModal();toast('デバッグモードを終了しました');return}
  if(S&&!$('#scrGame').hidden){save(true);render()}showDev()});
// デバッグモードがオンのときだけ、画面の端に🛠ボタン
function devButton(){let b=$('#devBtn');if(devOn()){if(!b){b=document.createElement('button');b.id='devBtn';b.type='button';b.textContent='🛠';b.title='デバッグモード';b.addEventListener('click',showDev);document.body.appendChild(b)}}else if(b)b.remove()}
devButton();
// 設定の下に小さな入り口（パスワードを知らないと何もできない）
document.addEventListener('click',e=>{const b=e.target.closest('[data-act="settings"],[data-act="grpEtc"]');if(!b)return;setTimeout(()=>{const m=$('#mcard');if(!m||m.querySelector('.devlink'))return;const cl=m.querySelector(':scope>[data-act="close"].pri,:scope>.b.pri[data-act="close"]');const a=document.createElement('button');a.type='button';a.className='devlink';a.textContent='開発者';a.addEventListener('click',devLogin);(cl||m).insertAdjacentElement(cl?'beforebegin':'beforeend',a)},0)});
