
// ===== v3.0.12：全部おまかせは隠す／「いまの年齢のまま続ける」をなくす／子どもに引き継ぐものをふやす =====
// 全部おまかせ（すべての操作・すべての出来事）は、開発者のお試し用に（ふだんは出さない）
{const _oh84=omkHtml;omkHtml=function(){let h=_oh84.apply(this,arguments);if(devOn())return h;
 h=h.replace(/<div class="row"><button class="b sm pri" type="button" data-omkall="1">🤖 すべての操作をまかせる<\/button><button class="b sm ghost" type="button" data-omkall="0">すべて自分でやる<\/button><\/div>/,'');
 h=h.replace(/<label class="omki"><input type="checkbox" data-omk="evall"[^>]*><span><b>[^<]*<\/b><small>[^<]*<\/small><\/span><\/label>/,'');return h}}
{const _mh84=monthHook11;monthHook11=function(){try{if(S&&S.omk&&S.omk.evall&&!devOn())S.omk.evall=0}catch(_){}return _mh84.apply(this,arguments)}}
(function(){const g=GUIDE.find(x=>x[0]==='auto');if(g)g[2]=g[2].replace('「すべての操作をまかせる」で、ぜんぶ自動にもできます。','')})();

// 人生の終わり：「いまの年齢のまま続ける」はなくす（何度でも生き返れてしまうため）
{const _die84=die;die=function(){const r=_die84.apply(this,arguments);try{const m=$('#mcard');if(m)m.querySelectorAll('[data-dch="same"]').forEach(b=>b.remove())}catch(_){}return r}}
(function(){for(const x of GUIDE)x[2]=x[2].replace('「この人生を終える」「子どもに引き継ぐ」「いまの年齢のまま続ける」から選べます','「この人生を終える」か「子どもに引き継ぐ」（子どもがいるとき）を選べます')})();

// 子どもに引き継ぐとき：大計画・研究ライン・世界の人口・サービス会社なども引き継ぐ
{const _ca84=continueAsChild;continueAsChild=function(i,alive){const P=S;const r=_ca84.apply(this,arguments);try{if(S&&S!==P){
 for(const k of ['mega','rtk','resLv','popAdd','svcs','snsOwn','snsName','megaN','omk','evSkip','pmode','ratio','bal','balOff','acc'])if(P[k]!=null&&S[k]==null)S[k]=JSON.parse(JSON.stringify(P[k]));
 // 親のファンの一部が、子どものアカウントも見に来てくれる
 if(S.snsOpen&&P.stats&&P.stats.maxF>0){const add=Math.round(Math.min(P.stats.maxF*.02,(SNS[S.main]||{cap:1e9}).cap*.5));if(add>(S.f[S.main]||0)){S.f[S.main]=add;log(`親のファンが ${num(add)}人、あなたのアカウントも見に来てくれた`,'good')}}
 else if(P.stats&&P.stats.maxF>0)S.heirFans=Math.round(P.stats.maxF*.02);
 save(true);render()}}catch(e){console.error(e)}return r}}
{const _os84=openSns;openSns=function(k){const r=_os84.apply(this,arguments);try{if(S&&S.heirFans){const add=Math.min(S.heirFans,SNS[k].cap*.5);S.f[k]=Math.max(S.f[k]||0,add);log(`親のファンが ${num(add)}人、あなたのアカウントも見に来てくれた`,'good');delete S.heirFans}}catch(_){}return r}}
try{const i=ACH.findIndex(a=>a[0]==='revive1');if(i>=0)ACH.splice(i,1)}catch(_){}
