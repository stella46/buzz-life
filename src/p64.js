
// ===== v2.9.7：テストで見つかったことの調整 =====
// 赤ちゃん・子どものうち（13歳未満）に、急に人生が終わってしまわないように
{const _dc64=deathCheck;deathCheck=function(){try{if(S&&S.am<13*12)return false}catch(_){}return _dc64.apply(this,arguments)}}
