
// ===== v2.0：ひみつの実績を追加（むずかしい・めずらしい） =====
(function(){const L=[];const s=(id,hn,hd,f,cat)=>L.push([id,'？','（ひみつ）',f,1,hn,hd,cat]);
 const tf=()=>Math.max(...TALK.map(k=>S.tal[k]||0)),emp=()=>(S.cos||[]).reduce((a,c)=>a+((c.emp&&c.emp.n)||0)+((c.emp&&c.emp.key.length)||0),0);
 s('x_poor100','おだやかな百年','苦しい家庭に生まれて、100歳まで生きる',k=>k==='d'&&S.tier===0&&age()>=100,'人生');
 s('x_rich_young','若き億万長者','25歳までに資産10億円',()=>age()<=25&&S.stats.maxM>=1e9,'お金');
 s('x_zero_end','すべてを使いきって','資産100億円をこえたことがあり、一生の終わりに所持金が1万円以下',k=>k==='d'&&S.stats.maxM>=1e10&&S.money<=1e4&&S.money>=0,'お金');
 s('x_kids8','大家族','子どもが8人',()=>S.kids.length>=8,'家族');
 s('x_late_parent','遅い春','50歳をすぎてから子どもを迎える',()=>S.kids.some(c=>(c.born-(S.am-age()*12))/12>=50),'家族');
 s('x_twin_tal','二刀流','2つの素質が200をこえる',()=>TALK.filter(k=>(S.tal[k]||0)>=200).length>=2,'素質・能力');
 s('x_all_tal100','万能の天才','8つの素質すべてが100をこえる',()=>TALK.every(k=>(S.tal[k]||0)>=100),'素質・能力');
 s('x_skills100','完ぺき超人','話術・企画・編集・見た目がすべて100',()=>['talk','plan','edit','looks'].every(k=>S.sk[k]>=100),'素質・能力');
 s('x_emp1m','百万の仲間','社員が合計100万人',()=>emp()>=1e6,'事業');
 s('x_emp3m','世界の雇い主','社員が合計300万人',()=>emp()>=3e6,'事業');
 s('x_co8_types','多角経営','7種類すべての会社を持つ',()=>new Set((S.cos||[]).map(c=>c.k)).size>=7,'事業');
 s('x_lv12','世界一の会社','会社をLv12にする',()=>(S.cos||[]).some(c=>c.lv>=12),'事業');
 s('x_q100','満点の作品','評価100点の作品を作る',()=>(S.prodBest||0)>=100,'事業');
 s('x_flop3','めげない社長','評価20点以下の作品を3本作ってしまう',()=>(S.cos||[]).reduce((a,c)=>a+((c.pr&&c.pr.hist)||[]).filter(h=>h.q<=20).length,0)>=3,'事業');
 s('x_teen_buzz','早すぎたバズ','13歳でバズる',()=>age()<=13&&S.stats.buzz>=1,'SNS');
 s('x_f_old','生涯現役','90歳でフォロワー100万人以上',()=>age()>=90&&totalF()>=1e6,'SNS');
 s('x_all_genre','ジャンルの旅人','8つのジャンルすべてで投稿する',()=>{const g=new Set((S.posts||[]).map(p=>p.g));(S.genreHist=S.genreHist||{})[S.genre]=1;return Object.keys(S.genreHist).filter(x=>TALK.includes(x)).length>=8},'SNS');
 s('x_flame20','炎の中の不死鳥','1つの人生で20回炎上する',()=>S.stats.flames>=20,'SNS');
 s('x_towns7','まちの王','ふるさとのほかに6つのまちを持つ',()=>allTowns().length>=7,'まち');
 s('x_dev150','未来都市','どれかのまちの発展度が150',()=>allTowns().some(T=>T.dev>=150),'まち');
 s('x_moonmayor','月の市長','月面都市を持ち、市長である',()=>megaDoneAny('mooncity')&&(S.role==='mayor'||S.role==='adviser'),'大計画');
 s('x_mega_all_space','宇宙の開拓者','宇宙の大計画をすべて完成させる',()=>typeof MEGA_RAW!=='undefined'&&MEGA_RAW.filter(r=>r[2]==='宇宙').every(r=>megaDoneAny(r[0])),'大計画');
 s('x_mega10','夢の建築家','大計画を10個完成させる',()=>(S.megaN||0)>=10,'大計画');
 s('x_aw_triple','三冠','同じ年に3つの賞で大賞',()=>{const y=S.y;return (S.awards||[]).filter(a=>a.y===y&&a.rank==='大賞').length>=3},'賞・イベント');
 s('x_judge_fair10','名審査員','自分で審査して公平な結果を10回出す',()=>(S.flags.fairJ||0)>=10,'賞・イベント');
 s('x_box_lucky','箱の中の奇跡','謎の箱ですてきな物を5回引く',()=>(S.flags.boxWin||0)>=5,'お金');
 s('x_cats3_pet','動物の楽園','ペットと3匹の猫と暮らす',()=>!!S.pet&&(S.cats||0)>=3,'家族');
 s('x_retire_star','引退後のスター','引退してからSNSを始めてフォロワー10万人',()=>S.st==='retired'&&S.snsAm!=null&&S.snsAm>=(S.flags.retAm||1e9)&&S.stats.maxF>=1e5,'SNS');
 s('x_nation_king','建国の父','自分の国をつくり、95歳まで生きる',k=>k==='d'&&age()>=95&&megaDoneAny('nation'),'大計画');
 s('x_seen1200','出来事マニア','出来事を1200種類見る',()=>Object.keys(META.seen).length>=1200,'図鑑');
 s('x_lives50','百の顔','人生を50回終える',k=>k==='d'&&(META.lives||0)>=49,'人生');
 s('x_gen7','七代目','7代目として生きる',()=>(S.gen||1)>=7,'家族');
 s('x_mayor_young','若き市長','30歳までに市長になる',()=>age()<=30&&(S.role==='mayor'||S.role==='adviser'),'まち');
 s('x_sns_owner_all','すべてを手に','4つのSNSを買収し、どれかでフォロワー1000万人',()=>S.snsOwn&&['milu','patto','tsubu','holo'].every(k=>S.snsOwn[k])&&totalF()>=1e7,'SNS');
 s('x_slot_names','名づけ親','5つのセーブスロットすべてに名前をつける',()=>{try{const l=JSON.parse(localStorage.getItem('nipporia-slotlabel')||'{}');return Object.keys(l).length>=5}catch(_){return false}},'図鑑');
 s('x_debug','開発者の手','デバッグモードを使う',()=>!!S.dbg,'図鑑');
 for(const a of L){ACH.push(a);if(typeof ACH_CAT!=='undefined')ACH_CAT[a[0]]=a[7]}})();
function megaDoneAny(k){try{if(typeof megaDone==='function')return megaDone(k);const m=(S.mega||[]);return Array.isArray(m)?m.some(x=>x.k===k&&x.done):!!(m[k]&&m[k].done)}catch(_){return false}}
// 目印：公平な審査・引退した月
document.addEventListener('click',e=>{const b=e.target.closest('button');if(!b||!S)return;if(/引退/.test(b.textContent||''))setTimeout(()=>{if(S&&S.st==='retired'&&!S.flags.retAm)S.flags.retAm=S.am},0)},true);

// v2.0で増やした出来事は、起きる確率をおさえめに（出来事が多すぎないように）
for(const [k,e] of Object.entries(EV)){if(EV_PRE39.has(k)||!(e.w>0&&e.w<1))continue;e.w*=.5;e.cd=Math.max(e.cd||0,72)}EVL=null;
// ライバルがいなくなったあとに、ライバルの出来事を選んでも止まらないように
for(const id of ['rv_buzz','rv_scandal']){const e=EV[id];if(!e||!e.ch)continue;const ch0=e.ch;e.ch=function(){const l=typeof ch0==='function'?ch0():ch0;return l.map(([lab,fn,...r])=>[lab,function(){if(!S.rival)return 'ライバルとは、いつの間にか連絡が取れなくなっていた。';return fn.apply(this,arguments)},...r])}}
// 選んだあとにエラーが起きても、画面が止まったままにならないように
(function(){const orig=choose;choose=function(i){try{return orig.apply(this,arguments)}catch(err){console.error(err);try{closeModal();curEv=null;render()}catch(_){}}}})();
OLD_VERS.unshift(['v1.4','versions/v1.4/','会社の従業員・支社・レイアウト・買収と合併が入ったころ（v1.4）']);
