
// ===== v3.6.4：フォロワーの「増減」を実際の数に／SNSが上限で止まらないように =====
// ----- 1) 先月の結果の「フォロワー増減」は、実際にふえた人数（新しく来た人・離れた人も表示） -----
{const _t104=turn;turn=function(){let f0=null,lb=null;try{if(S&&S.alive&&!modalOpen()){f0=totalF();lb=S.last&&S.last.lbl}}catch(_){}const r=_t104.apply(this,arguments);
 try{if(f0!=null&&S&&S.last&&S.last.lbl!==lb){const net=Math.round(totalF()-f0),gross=Math.round(S.last.newF||0);S.last.gainF=Math.max(gross,net,0);S.last.lostF=Math.max(0,S.last.gainF-net);S.last.newF=net}}catch(e){console.error(e)}return r}}
{const _ps104=panelSns;panelSns=function(){let h=_ps104.apply(this,arguments);try{const L=S.last;if(L&&L.lostF>0)h=h.replace(/(<span>フォロワー増減<\/span><span>[^<]*<\/span>)/,`$1<span class="muted small">新しく来た人</span><span class="muted small">+${num(L.gainF)}人</span><span class="muted small">離れた人</span><span class="muted small">-${num(L.lostF)}人</span>`)}catch(_){}return h}}
// ----- 2) SNSの上限：人の数ではなく「アカウントの数」。上限に近づくとゆっくりになるが、止まらない -----
// A：1人が複数のアカウントを持つ（平均1.6）／B：年が進むと世界の人口・ネットの利用がふえる／上限の近くでは、新しい世代や新しいアカウントが少しずつふえる
function capGrowY(){try{return Math.min(1.4,1+Math.max(0,S.y-2026)*.005)}catch(_){return 1}}
for(const k of Object.keys(SNS)){const o=SNS[k];const d=Object.getOwnPropertyDescriptor(o,'cap');if(!d||!d.get)continue;const g=d.get;
 Object.defineProperty(o,'cap',{get(){const c=g.call(this);try{if(!S||isLite2())return c;return c*1.6*capGrowY()*((S.capB&&S.capB[k])||1)}catch(_){return c}},set(v){this._cap0=v},configurable:true,enumerable:true})}
{const _mh104=monthHook11;monthHook11=function(){const r=_mh104.apply(this,arguments);try{if(S&&S.alive&&S.snsOpen&&!isLite2()){S.capB=S.capB||{};
 for(const k in S.f){if(!S.open||!S.open[k])continue;const cap=SNS[k].cap,f=S.f[k]||0;if(f>=cap*.85){S.capB[k]=(S.capB[k]||1)*1.004}}
 // C：はじめて上限の近くまで来たら、次の伸ばし方を知らせる
 const mk=S.main,cap=SNS[mk].cap;if(!S.flags.capNear&&(S.f[mk]||0)>=cap*.85){S.flags.capNear=1;try{popBig('🌏 ほとんどの人に届きました',`${SNS[mk].n}のフォロワーが、届く人のほとんどになりました。ここからはゆっくり伸びます。`,'ほかのSNSへの同時投稿やサブチャンネルで、もっと多くの人に届けられます')}catch(_){}}}}catch(e){console.error(e)}return r}}
{const _st104=secTip;secTip=function(){try{if(S&&S.snsOpen&&!isLite2()&&S.flags.capNear){const mk=S.main;const xs=Object.keys(SNS).filter(k=>S.open[k]&&k!==mk);
 if(!xs.length)return ['メインはほとんどの人に届いています。ほかのSNSでもアカウントを作ると、もっと伸ばせます','sns:'];
 if(typeof xpostList==='function'&&!xpostList().length)return ['メインはほとんどの人に届いています。「📡 同時に投稿」で、ほかのSNSも伸ばしましょう','sns:'];
 if((S.subch||[]).length<3&&chance(.3))return ['サブチャンネルを作ると、メインのファンが見に来てくれます','sns:']}}catch(_){}return _st104.apply(this,arguments)}}
(function(){const g=GUIDE.find(x=>x[0]==='sns');if(g&&!/止まりません/.test(g[2]))g[2]+='\n・フォロワーには上限がありますが、近づくとゆっくりになるだけで、止まりません（年が進むと、ネットを使う人もふえます）。'})();
