
// ===== v3.5.2：ほかのSNSにも同時に投稿できる／サブチャンネルを作ってもメインが伸びにくくならないように =====
// サブ投稿・同時投稿では「失敗」は判定しない（メインの投稿だけ）
function xpostOn(k){return !!(S.xpost&&S.xpost[k]&&S.open&&S.open[k]&&k!==S.main)}
function xpostList(){return Object.keys(SNS).filter(xpostOn)}
function xPost(key,k){const sv={main:S.main,posts:S.posts,cw:S.collabWith};S.main=key;S.posts=[];S.collabWith=null;POPT='normal';SUBPOST=1;
 const f0=S.f[key]||0;try{doPost(k);const d=(S.f[key]||0)-f0;if(d>0){const mul=1.25*accOf(key).form;S.f[key]=Math.min(SNS[key].cap,f0+d*mul)}}finally{SUBPOST=0;S.main=sv.main;S.posts=sv.posts;S.collabWith=sv.cw;POPT='normal'}}
postAll=function(k){try{fixMain()}catch(_){}S.lastPostAm=S.am;const subs=S.subch||[],xs=xpostList();
 // メインの力はほとんど落とさない（サブ1つで約9%、同時投稿1つで約6%）
 const share=1/(1+.1*subs.length+.06*xs.length);
 POPT=postPlanNow();doPost(k*share);POPT='normal';
 for(const c of subs)try{subPost(c,k*share*.8)}catch(e){console.error(e)}
 for(const x of xs)try{xPost(x,k*share*.7)}catch(e){console.error(e)}
 if(xs.length||subs.length)ad('mental',-.15*k*(xs.length+subs.length))};
// 失敗の判定はメインの投稿だけ
{const _fr99=failRoll;failRoll=function(b,sk,key){if(SUBPOST&&key==='post')return 0;return _fr99.apply(this,arguments)}}
// 発信タブ：同時に投稿するSNSを選ぶ
function xpostHtml(){if(!S.snsOpen)return '';const ks=Object.keys(SNS).filter(k=>S.open&&S.open[k]&&k!==S.main);
 if(!ks.length)return `<div class="card"><div class="hd"><span>📡 同時に投稿</span></div><p class="hint">ほかのSNSのアカウントを作ると、メインと同じ内容を同時に投稿できます。</p></div>`;
 return `<div class="card"><div class="hd"><span>📡 同時に投稿</span><span class="muted small">${xpostList().length}つ</span></div><p class="hint">メインに投稿するとき、選んだSNSにも同じ内容を投稿します。それぞれのフォロワーがふえます（メインの伸びはほんの少しだけ下がり、少し疲れます）。</p><div class="row wrap">${ks.map(k=>`<button class="b sm ${xpostOn(k)?'pri':''}" type="button" data-xpost="${k}" aria-pressed="${xpostOn(k)}">${xpostOn(k)?'✓ ':''}${esc(SNS[k].n)}（${num(S.f[k]||0)}人）</button>`).join('')}</div></div>`}
{const _ps99=panelSns;panelSns=function(){let h=_ps99.apply(this,arguments);try{if(!S.snsOpen)return h;const c=xpostHtml();const i=h.indexOf('<h2>アカウント</h2>');h=i<0?h+c:h.slice(0,i)+c+h.slice(i)}catch(e){console.error(e)}return h}}
document.addEventListener('click',e=>{const b=e.target.closest('[data-xpost]');if(!b||!S)return;S.xpost=S.xpost||{};const k=b.dataset.xpost;S.xpost[k]=S.xpost[k]?0:1;save();renderPanel()});
// おまかせ（SNS）：アカウントがあるSNSには同時に投稿する
{const _mh99=monthHook11;monthHook11=function(){try{if(S&&S.snsOpen&&omk('sns')&&S.open){S.xpost=S.xpost||{};for(const k in S.open)if(S.open[k]&&k!==S.main&&S.xpost[k]==null)S.xpost[k]=1}}catch(_){}return _mh99.apply(this,arguments)}}
(function(){const g=GUIDE.find(x=>x[0]==='sns');if(g&&!/同時に投稿/.test(g[2]))g[2]=g[2].replace('・サブチャンネルを作ると、','・「📡 同時に投稿」で、ほかのSNSにも同じ内容を投稿できます。\n・サブチャンネルを作ると、');
 if(typeof FIND!=='undefined'&&!FIND.some(f=>f[0]==='同時に投稿'))FIND.push(['同時に投稿','発信','sns:','ほかのSNSにも同じ内容を投稿する','マルチ 転載 ほかのSNS'])})();
