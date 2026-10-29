
// ===== v3.6.2：投稿の記録の「ふえたフォロワー」を、実際にふえた数に合わせる／軽量の「投稿が入っていない」表示を直す =====
// 投稿の記録は、誘導・アカウントの調子・軽量の伸び方などをすべて反映したあとの数にする
{const _pa102=postAll;postAll=function(k){const mk=S&&S.main,f0=S&&S.f?(S.f[mk]||0):0,am=S&&S.am;const r=_pa102.apply(this,arguments);
 try{const d=Math.round((S.f[mk]||0)-f0);const fix=arr=>{if(!arr)return;for(const p of arr)if(p.am===am&&(!p.sns||p.sns===mk))p.nf=d};fix(S.plog);fix(S.pbest);const last=(S.posts||[])[S.posts.length-1];if(last&&last.am===am)last.nf=d}catch(e){console.error(e)}return r}}
// 軽量：すごし方で「発信する」を選んでいれば、「投稿が入っていない」とは言わない
function l2PostOn(){return isLite2()&&S.r4&&(S.r4.post||0)>0}
{const _sp102=snsPlanHtml;snsPlanHtml=function(){if(!isLite2())return _sp102.apply(this,arguments);const keep=S.plan;try{if(l2PostOn())S.plan=(keep||[]).concat(['post']);let h=_sp102.apply(this,arguments);
 if(!l2PostOn())h=h.replace(/いまの予定に「投稿する」が入っていない[^<]*/,'「予定」のすごし方で、「📱 発信する」が「しない」になっています。「少し」以上にすると投稿します。');return h}finally{S.plan=keep}}}
(function(){try{for(const st of ROAD)for(const it of st[2])if(it[0]==='予定に「投稿」を入れる'){const f=it[1];it[1]=()=>l2PostOn()&&S.snsOpen?true:f()}}catch(_){}})();
// 秘書のひとこと：軽量では、すごし方で判断する。事業・研究・スキル・世界進出の話はしない
{const _st102=secTip;secTip=function(){if(!isLite2())return _st102.apply(this,arguments);const keep=S.plan;try{if(l2PostOn())S.plan=(keep||[]).concat(['post']);let t=_st102.apply(this,arguments);
 if(t&&t[0]&&/予定に「投稿」が入っていません/.test(t[0]))t=['「予定」のすごし方で「📱 発信する」を「少し」以上にすると、投稿してフォロワーがふえます','act:'];
 if(t&&t[1]&&/^biz|skill/.test(String(t[1])))t=null;if(t&&t[0]&&/進出|研究|スキルポイント|大計画|まち/.test(t[0]))t=null;return t}finally{S.plan=keep}}}
