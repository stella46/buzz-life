
// ===== v3.7.1：旧軽量をなくす（はじめからで選べるのは「軽量」と「通常」。旧軽量のセーブはそのまま続けられる） =====
{const _ss107=showSlots;showSlots=function(mode){if(LITE_PICK===1)LITE_PICK=2;const r=_ss107.apply(this,arguments);try{if(mode==='new')document.querySelectorAll('#verPick details').forEach(d=>{if(d.querySelector('[data-vp3="1"]'))d.remove()})}catch(_){}return r}}
(function(){const g=GUIDE.find(x=>x[0]==='lite');if(g)g[2]=g[2].replace(/■ 旧軽量\n[^\n]*\n/,'').replace('※ どのモードでも','※ 前の版の「旧軽量」で始めた人生は、そのまま続けられます。\n※ どのモードでも');
 const b=GUIDE.find(x=>x[0]==='basic');if(b)b[2]=b[2].replace('「軽量」「通常」「旧軽量」を選べます','「軽量」か「通常」を選べます')})();
