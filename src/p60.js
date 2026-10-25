
// ===== v2.9.3：エンドレスで子どもに託したときも、引き継ぎポイントを表示 =====
// 「この子に託す」用の確認欄（つながり画面）
{const _kh60=koryuHtml;koryuHtml=function(){const h=_kh60.apply(this,arguments);return h.includes('id="confirmBox"')?h:h+'<div id="confirmBox"></div>'}}
// 生きているうちに子どもに託したとき：もらった引き継ぎポイントをお知らせ
{const _rt60=retireTo;retireTo=function(i){const lp0=(META.leg&&META.leg.lp)||0;const r=_rt60.apply(this,arguments);try{const g=((META.leg&&META.leg.lp)||0)-lp0;if(g>0){log(`前の人生から、引き継ぎポイントを ${g} もらった`,'good');setTimeout(()=>{try{popBig('🌱 引き継ぎポイント +'+g,'子どもに人生を託しました','タイトルの「実績・引き継ぎスキル」で使えます')}catch(_){}},400)}}catch(_){}return r}}
// 亡くなって子どもとして続けたときも、同じようにお知らせ
{const _ca60=continueAsChild;continueAsChild=function(i,alive){const g=S&&(S.lpLast!=null?S.lpLast:S.lpGain);const r=_ca60.apply(this,arguments);try{if(!alive&&g>0){log(`前の人生から、引き継ぎポイントを ${g} もらった`,'good');setTimeout(()=>{try{popBig('🌱 引き継ぎポイント +'+g,'次の世代へ引き継ぎました','タイトルの「実績・引き継ぎスキル」で使えます')}catch(_){}},400)}}catch(_){}return r}}
