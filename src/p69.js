
// ===== v3.0（8）：会社まわりを整理（芸能事務所・サービス会社も「会社の種類」として並べる／オフィスの画面を1つに） =====
{const _st69=subTabs;subTabs=function(tabk,items){if(tabk==='biz')items=items.map(x=>x[0]==='office'?[x[0],'芸能事務所',x[2]]:x[0]==='svc'?[x[0],'サービス会社',x[2]]:x[0]==='co'?[x[0],'会社',x[2]]:x);return _st69.call(this,tabk,items)}}
{const _co69=coHtml;coHtml=function(){const h=_co69.apply(this,arguments);return h.replace('<h3>会社を設立する</h3>','<h3>会社を設立する</h3><p class="hint">芸能事務所（タレントの所属）と、サービス会社（サブスクの提供）も会社の種類です。となりの「芸能事務所」「サービス会社」から始められます。</p>')}}
// 会社の画面：「オフィス・支社」と「レイアウト」を1つのタブに
{const _sc69=showCo;showCo=function(id,tab){if(tab==='lay')tab='off';if(CM_TAB==='lay')CM_TAB='off';const r=_sc69.call(this,id,tab);try{const m=$('#mcard');m.querySelectorAll('[data-cmtab="lay"]').forEach(b=>b.remove());const o=m.querySelector('[data-cmtab="off"]');if(o)o.textContent='オフィス'}catch(_){}return r}}
{const _cb69=cmBody;cmBody=function(c){if(CM_TAB!=='off')return _cb69.apply(this,arguments);let h=_cb69.apply(this,arguments);CM_TAB='lay';try{h+='<h3>オフィスのレイアウト</h3>'+_cb69.apply(this,arguments)}finally{CM_TAB='off'}return h}}
(function(){for(const x of GUIDE)x[2]=x[2].replace(/「事務所」タブ/g,'「芸能事務所」タブ').replace(/「サブスク事業」/g,'「サービス会社」')})();
try{for(const f of FIND){f[1]=String(f[1]).replace('サブスク事業','サービス会社').replace(/→ 事務所$/,'→ 芸能事務所')}}catch(_){}
