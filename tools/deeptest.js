const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
  const runs=+(process.argv[2]||20),seed0=+(process.argv[3]||0);
  const p = await b.newPage();
  const errs=[];p.on('pageerror',e=>errs.push('PAGEERR '+e.message+' | '+(e.stack||'').split('\n').slice(1,3).join(' | ')));
  p.on('console',m=>{if(m.type()==='error'&&!/ERR_TUNNEL|Failed to load resource/.test(m.text()))errs.push('CONSOLE '+m.text())});
  await p.goto('file:///home/claude/nip/nipporia.html');
  const r = await p.evaluate(([runs,seed0]) => {
    const realRender=render;pop=function(){};sndOn=false;bgmOn=false;toast=function(){};
    const out=[],bad=[];const note=(m)=>{if(bad.length<40)bad.push(m)};
    function scan(o,path,d){if(d>4||o==null)return;if(typeof o==='number'){if(!isFinite(o))note('NaN '+path);return}if(typeof o!=='object')return;for(const k in o){if(k==='log'||k==='hist'||k==='tl'||k==='album')continue;scan(o[k],path+'.'+k,d+1)}}
    const stages=['nipporia','japan','world','fantasy'],diffs=['easy','normal','hard','real'],eras=['now','past','future','pick'];
    speed=2;let evShown=0,yrs=0;const _show=showEvent;showEvent=function(e){evShown++;if(S&&age()<18&&curEv==null){}return _show(e)};
    for(let run=0;run<runs;run++){
      const era=eras[(run+seed0)%4];const yearIn=String(1940+Math.floor(Math.random()*160));
      GFX=['pixel','illust','phone','hybrid','classic'][run%5];applyGfx();newGame({era,yearIn,stage:stages[(run+seed0)%4],diff:diffs[Math.floor(run/4+seed0)%4],endless:run%3===0?1:0});
      const y0=S.y;let it=0,gens=0,acts={},loads=0,kidLoan=0,stuck=0;const cnt=k=>acts[k]=(acts[k]||0)+1;
      while(it<6000){it++;
        render=(it%41===0)?realRender:function(){};
        if(it%41===0){for(const [tk,subs] of [['act',[null]],['sns',[null]],['money',['bills','shop','room','bank']],['biz',['town','shop','co','office','res']],['life',['stat','goal','choice','ppl','map','album','skill','rec']]])for(const sb of subs){try{if(sb)SUB[tk]=sb;tab=tk;renderPanel()}catch(e){note('panel '+tk+':'+sb+' '+e.message)}}}
        if(it%23===0){try{drawRoom();drawTown();const c=document.createElement('canvas');drawEvArt(c,pick(['SNS','恋愛','家族','仕事','お金','健康','学校','まち','ニュース','人生','成長','友達']));if(S.album&&S.album.length){const a=document.createElement('canvas');a.dataset.alb=0;drawAlbum(a,S.album[0].k)}}catch(e){note('draw '+e.message+' '+(e.stack||'').split('\n')[1])}}
        if(it%300===0){try{save();const raw=localStorage.getItem(CFG.save);const o=loadSaved();if(!o)note('load null');else{S=o;loads++}}catch(e){note('saveload '+e.message)}}
        if(it%37===0)scan(S,'S',0);
        if(!S.alive){ if(S.endless&&S.kids.length&&gens<2){gens++;try{continueAsChild(0,false)}catch(e){note('cont '+e.message)}continue} break;}
        if(modalOpen()){if(curEv){if(age()<18&&curEv.chs.some(c=>/借りる|消費者金融|ローン/.test(c[0])))kidLoan++;choose(Math.floor(Math.random()*curEv.chs.length))}const ok=document.querySelector('[data-act="evok"]');if(ok)evOk();else if(modalOpen()){if(!curEv&&!document.querySelector('#mcard [data-act="close"]')&&!document.querySelector('#mcard button'))stuck++;closeModal()}continue}
        speed=2;S.auto=Math.random()<.9?1:0;S.autopay=run%2?1:0;if(!S.autopay&&Math.random()<.9)payAll();
        try{
        S.plan.forEach((a,i)=>{const ac=ACT[a];if(ac&&ac.opts){const os=ac.opts.filter(o=>!o.ok||o.ok());if(os.length)S.planOpt[i]=pick(os).k}});
        applyResCost();if(Math.random()<.1){try{rlvBuy(pick(['sns','biz','life']))}catch(e){note('rlv '+e.message)}}for(const rr of RES){if(!has(rr.id)&&(!rr.req||has(rr.req))&&(!rr.year||S.y>=rr.year)&&S.rp>=rr.c){S.rp-=rr.c;S.res[rr.id]=1;cnt('res');break}}
        if((S.sp||0)>0&&Math.random()<.3){const ids=SKT.flatMap(x=>x[2].map(n=>n[0]));skBuy(pick(ids))}
        const a=age();
        if(a>=18){const keys=Object.keys(BLD).filter(k=>!BLD[k].req||has(BLD[k].req));const k=pick(keys);const i=S.town.tiles.findIndex(t=>t.t==='empty');if(i>=0&&S.money>BLD[k].cost*4){outc('build',BLD[k].cost);S.town.tiles[i]={t:k,lv:1};initShop(S.town.tiles[i]);cnt('bld')}}
        S.town.tiles.forEach((t,i)=>{if(SHOP[t.t]){const e=shopCalc(i,false);t.staff=Math.max(1,e.need);if(Math.random()<.01){t.style=RI(0,3);t.menuT=RI(0,3)}}});
        if(a>=16&&!S.partner&&!S.spouse&&Math.random()<.02){seekLover(pick(['intro','circle','app']));cnt('seek')}
        if(S.partner&&S.partner.rel>=50&&a>=20&&Math.random()<.02){doChoice('propose');cnt('propose')}
        if(S.spouse&&S.kids.length<3&&a<42&&Math.random()<.02&&!S.flags.tryKid){doChoice('trykid')}
        if(S.spouse&&Math.random()<.0006){doChoice('divorce');cnt('divorce')}
        if(S.partner&&Math.random()<.001){doChoice('breakup')}
        if(S.st==='work'&&Math.random()<.002){doChoice(pick(['change','gap','quit']));cnt('job')}
        if(a>=25&&a<50&&S.st!=='univ'&&Math.random()<.0004){doChoice('univ')}
        if(S.kids.some(c=>(S.am-c.born)/12<18)&&Math.random()<.3&&S.plan.length)S.plan[0]='parenting';
        if(a>=18&&S.money>3e6&&Math.random()<.01&&(S.town.evAm==null||S.am-S.town.evAm>=evCd())){hostEvent(pick(TEVENTS).k);cnt('fest')}
        if(S.rival&&S.snsOpen&&Math.random()<.02&&(S.cd.battle==null||S.am-S.cd.battle>=3)){battle();cnt('battle')}
        if(a>=35&&totalF()>=10000&&S.disc.length<discMax()&&Math.random()<.02){takeDisciple()}
        if(S.snsOpen&&Math.random()<.01)S.style=pick(Object.keys(STYLES));
        if(S.snsOpen&&Math.random()<.03)S.postPlan=pick(POSTPLAN.map(p=>p.k));
        if(S.snsOpen&&Math.random()<.04){const ids=(S.rival?['rival']:[]).concat((S.collabs||[]).map(c=>c.id));if(ids.length&&!collabNow()){askCollab(pick(ids));cnt('ask')}}
        if(S.snsOpen&&Math.random()<.15&&S.trend.g!==S.genre&&genreOk(S.trend.g))S.genre=S.trend.g;
        if(!S.snsOpen&&a>=13&&snsEra()&&!S.flags.noNet&&Math.random()<.05){openSns('milu');S.main='milu'}
        if(a>=20&&S.cos.length<3&&Math.random()<.01){const ks=Object.keys(COS).filter(k=>!COS[k].year||S.y>=COS[k].year);const k=pick(ks);if(S.money>COS[k].c*3*Math.max(.2,S.cty.inc)){foundCo(k);cnt('co')}}
        for(const c of S.cos){const up=COS[c.k].c*c.lv*Math.max(.2,S.cty.inc);if(c.lv<8&&S.money>up*5&&Math.random()<.02){outc('co',up);c.cap+=COS[c.k].c*c.lv;c.lv++}}
        if(a>=25&&allTowns().length<=TOWN_MAX&&Math.random()<.005){const d=pick(DEVS.filter(x=>!x.year||S.y>=x.year));if(S.money>d.cost*3*Math.max(.2,S.cty.inc)){devTown(d.k);cnt('town')}}
        if(S.towns2.length&&Math.random()<.03){switchTown(pick(S.towns2))}
        }catch(e){note('act '+e.message+' '+(e.stack||'').split('\n')[1])}
        if(modalOpen()&&!curEv){const ok=document.querySelector('[data-act="evok"]');if(ok)evOk();else closeModal()}
        if(age()<18&&S.money<0)note('minor negative money '+S.money);
        if(S.fanCore<0||S.fanCore>.41)note('fanCore '+S.fanCore);
        if(!modalOpen()){try{turn()}catch(e){note('turn '+e.message+' '+(e.stack||'').split('\n')[1])}}
      }
      yrs+=S.am/12;
      // legacy purchase between lives
      legState();for(const x of LEG){try{legBuy(x.id)}catch(e){note('leg '+e.message)}}if(modalOpen())closeModal();
      out.push({rv:S.rival?Math.round(S.rival.f):0,auto:S.stats.autoEv||0,y0,era,ctry:S.cty.n,age:age(),gen:S.gen||1,F:Math.round(S.stats.maxF),M:Math.round(S.stats.maxM/1e8)+'億',core:+S.fanCore.toFixed(2),res:RES.filter(r=>has(r.id)).length,sp:S.sp,skt:Object.keys(S.skt||{}).length,lp:META.leg.lp,legN:Object.keys(META.leg.nodes).length,co:S.cos.length,towns:allTowns().length,loads,kidLoan,stuck,it});
    }
    // UI flows
    try{showGuide('basic');for(const g of GUIDE)showGuide(g[0]);closeModal();showLegacy();closeModal();fbForm(null);closeModal();showSetup();for(const v of ['now','past','future','pick']){document.querySelector('#suEra').value=v;setupNotes()}closeModal()}catch(e){note('ui '+e.message)}
    return {out,bad,evPerYear:(evShown/yrs).toFixed(2),rec:META.rec,leg:META.leg};
  },[runs,seed0]);
  for(const o of r.out)console.log(JSON.stringify(o));
  console.log('evPerYear',r.evPerYear,'rec',JSON.stringify(r.rec),'leg',JSON.stringify(r.leg));
  console.log('BAD',r.bad);console.log('ERRS',errs.slice(0,20),errs.length);
  await b.close();
})();
