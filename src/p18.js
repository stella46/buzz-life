// ===== v1.0：グラフィックの一新（切りかえ式） =====
// 場面は 320×200 の座標で描く。ドット（A・D）は320×200のキャンバスにそのまま、イラスト（B・C）は3倍の細かさでなめらかに描く
const GFX_OPT={
  classic:{n:'クラシック',d:'今までの小さなドット絵と画面'},
  pixel:{n:'A 高精細ドット',d:'細かいドット絵。主人公が動き、昼夜・季節・天気で景色が変わる'},
  illust:{n:'B イラスト',d:'やわらかいパステルのイラストと、明るい画面'},
  phone:{n:'C スマホ画面',d:'ゲーム全体がスマホの中。タブがアプリになる（イラストの場面）'},
  hybrid:{n:'D スマホ＋ドット',d:'スマホ画面（ダークモード）に、高精細ドットの場面'}
};
let GFX='hybrid';try{const v=localStorage.getItem('buzz-gfx');if(v&&GFX_OPT[v])GFX=v}catch(_){}
const sceneStyle=()=>GFX==='classic'?'classic':(GFX==='pixel'||GFX==='hybrid')?'pixel':'illust';

// ----- 色の道具 -----
function hx(c){c=c.replace('#','');if(c.length===3)c=c.split('').map(x=>x+x).join('');return [parseInt(c.slice(0,2),16),parseInt(c.slice(2,4),16),parseInt(c.slice(4,6),16)]}
function mixc(a,b,t){const A=hx(a),B=hx(b);return '#'+A.map((v,i)=>Math.round(v+(B[i]-v)*t).toString(16).padStart(2,'0')).join('')}
const dark=(c,t)=>mixc(c,'#101020',t),lite=(c,t)=>mixc(c,'#ffffff',t);

// ----- 描く道具（G） -----
const G={c:null,k:1,st:'pixel',
  use(ctx,k,st){this.c=ctx;this.k=k;this.st=st;ctx.setTransform(k,0,0,k,0,0);ctx.imageSmoothingEnabled=st!=='pixel';ctx.lineJoin='round';ctx.lineCap='round'},
  col(c){return this.st==='illust'?lite(c,.16):c},
  ol(c){return this.st==='illust'?dark(c,.5):null},
  R(x,y,w,h,c,o){o=o||{};const g=this.c;if(this.st==='pixel'){x=Math.round(x);y=Math.round(y);w=Math.round(w);h=Math.round(h)}
    g.fillStyle=this.col(c);const r=this.st==='illust'?(o.r!=null?o.r:Math.min(2,w/4,h/4)):0;
    if(r>0){g.beginPath();if(g.roundRect)g.roundRect(x,y,w,h,r);else g.rect(x,y,w,h);g.fill();if(o.o!==false&&this.st==='illust'){g.strokeStyle=this.ol(c);g.lineWidth=.6;g.stroke()}}
    else{g.fillRect(x,y,w,h);if(this.st==='pixel'&&o.sh){g.fillStyle=dark(c,.25);g.fillRect(x,y+h-Math.max(1,Math.round(h*.18)),w,Math.max(1,Math.round(h*.18)))}}},
  E(x,y,rx,ry,c,o){o=o||{};const g=this.c;g.fillStyle=this.col(c);g.beginPath();g.ellipse(x,y,Math.max(.3,rx),Math.max(.3,ry),0,0,Math.PI*2);g.fill();if(this.st==='illust'&&o.o!==false){g.strokeStyle=this.ol(c);g.lineWidth=.55;g.stroke()}},
  P(pts,c,o){o=o||{};const g=this.c;g.fillStyle=this.col(c);g.beginPath();pts.forEach((p,i)=>i?g.lineTo(p[0],p[1]):g.moveTo(p[0],p[1]));g.closePath();g.fill();if(this.st==='illust'&&o.o!==false){g.strokeStyle=this.ol(c);g.lineWidth=.55;g.stroke()}},
  L(x1,y1,x2,y2,c,w){const g=this.c;g.strokeStyle=this.col(c);g.lineWidth=w||1;g.beginPath();g.moveTo(x1,y1);g.lineTo(x2,y2);g.stroke()},
  A(x,y,r,a0,a1,c,w){const g=this.c;g.strokeStyle=this.col(c);g.lineWidth=w||1;g.beginPath();g.arc(x,y,r,a0,a1);g.stroke()},
  T(t,x,y,c,size,al){const g=this.c;g.fillStyle=c;g.font=`${size||8}px ${this.st==='pixel'?'DotGothic16':'"Zen Maru Gothic"'},sans-serif`;g.textAlign=al||'left';g.textBaseline='alphabetic';g.fillText(t,x,y);g.textAlign='left'},
  grad(x0,y0,x1,y1,stops){const g=this.c.createLinearGradient(x0,y0,x1,y1);stops.forEach(([o,c])=>g.addColorStop(o,c));return g},
  fillG(x,y,w,h,gr){this.c.fillStyle=gr;this.c.fillRect(x,y,w,h)},
  alpha(a,fn){const g=this.c,o=g.globalAlpha;g.globalAlpha=o*a;try{fn()}finally{g.globalAlpha=o}}
};

// ----- 時間・季節・天気 -----
const now=()=>performance.now();
function dayPhase(){return (now()/1000/120)%1} // 2分で1日
function skyCols(p){// 0=夜明け 0.25昼 0.55夕方 0.7夜
  if(p<.08)return ['#2a2d5c','#e7a07a'];if(p<.45)return ['#6fb6f0','#cfe9ff'];if(p<.58)return ['#ef8c6a','#ffd29a'];if(p<.66)return ['#5a4a8a','#e08f8f'];return ['#141a3c','#30366e']}
const isNight=()=>{const p=dayPhase();return p>=.64||p<.04};
function season(){const m=S?S.m:4;return m>=3&&m<=5?'spring':m>=6&&m<=8?'summer':m>=9&&m<=11?'autumn':'winter'}
function weather(){if(!S)return 'sun';const r=mulberry32((S.y*13+S.m)*7919)();const s=season();if(s==='winter'&&r<.35)return 'snow';if(r<.22)return 'rain';if(r<.45)return 'cloud';return 'sun'}
const SEASON_N={spring:'春',summer:'夏',autumn:'秋',winter:'冬'},WEA_N={sun:'晴れ',cloud:'くもり',rain:'雨',snow:'雪'};

// ----- 主人公と人物の見た目 -----
const SKINS=['#f6d2b4','#e8b48e','#c58c62','#8d5a3b'];
const HAIRS=['#2a1d16','#3b2a1e','#171717','#5a3a22','#8a5a2b','#c9a15a'];
function lookInit(o){if(!S)return;const L=S.look=S.look||{};const fr=(o&&o.free)||{};
  if(L.hs==null)L.hs=fr.hs!=null?+fr.hs:RI(0,3);if(L.skin==null)L.skin=fr.skin!=null?SKINS[+fr.skin]:(S.cty&&!S.cty.jp?pick(SKINS):pick(SKINS.slice(0,2)));
  if(fr.hairc!=null&&HAIRS[+fr.hairc])L.hair=HAIRS[+fr.hairc];if(L.glasses==null)L.glasses=chance(.15)?1:0;if(L.pants==null)L.pants=pick(['#2e3a6e','#3d3d4f','#5a4a3a','#2f5a6e'])}
function npcLook(n,role){if(!n)return null;if(!n.look){const r=mulberry32(String(n.name||role).split('').reduce((a,c)=>a*31+c.charCodeAt(0)|0,7));n.look={hs:Math.floor(r()*4),skin:(S&&S.look&&S.look.skin)&&r()<.7?S.look.skin:SKINS[Math.floor(r()*2)],hair:HAIRS[Math.floor(r()*4)],shirt:['#ff8fa3','#7fc8f8','#ffd166','#95d5b2','#c3a6ff','#f4a261'][Math.floor(r()*6)],pants:['#2e3a6e','#3d3d4f','#5a4a3a'][Math.floor(r()*3)],glasses:r()<.2?1:0}}return n.look}
function mainModel(o){o=o||{};const a=o.age!=null?o.age:age(),L=S.look||{};const st=S.st;
  let top=L.shirt||'#ff5c8a',outfit='casual';
  if(a<1)outfit='onesie';else if(a<6)outfit='kid';
  else if(o.loc==='class'&&a>=13&&a<18)outfit='uniform';
  else if(o.loc==='office')outfit='suit';
  else if(o.loc==='gym'||o.loc==='park'&&o.act==='exercise')outfit='sport';
  else if(o.loc==='kitchen'||o.loc==='shop')outfit='apron';
  else if(o.loc==='cafe'&&a>=16)outfit='date';
  else if(a>=65)outfit='cardigan';
  else if(S.stats.maxM>=1e8&&S.money>=5e7&&a>=20)outfit='rich';
  else if(o.loc==='stream'&&a>=13)outfit='hoodie';
  else if(a>=6&&a<13)outfit='kidcasual';
  const p=S.p,acc={};
  if(L.glasses||p.know>=80)acc.glasses=1;
  if(o.loc==='stream'&&['game','music','asmr','vr'].includes(S.genre))acc.phones=1;
  if(p.health<35)acc.mask=1;if(p.mental<30)acc.sweat=1;if(p.happy<25)acc.tears=1;
  if(S.sk&&S.sk.looks>=70&&a>=13)acc.sparkle=1;if(S.spouse)acc.ring=1;
  if(a>=75&&p.health<60)acc.cane=1;if(o.loc==='cafe')acc.blush=1;
  if(S.body&&S.body.includes('tall'))acc.tall=1;
  if(S.stats.maxF>=1e6&&a>=13)acc.star=1;
  if(S.money<0&&a>=18)acc.patch=1;
  const mood=p.happy>=70?'smile':p.happy<30||p.mental<25?'sad':'mid';
  return {g:S.g,age:a,hair:a>=70?'#d8d8e0':a>=55?mixc(L.hair||'#2a1d16','#c8c8d0',.45):(L.hair||'#2a1d16'),hs:L.hs||0,skin:L.skin||SKINS[0],top,pants:L.pants||'#2e3a6e',outfit,acc,mood,main:1}}
function npcModel(n,a,role,o){const L=npcLook(n,role)||{};o=o||{};const g=n.g||(role==='父'?'男':role==='母'?'女':(S.g==='男'?'女':'男'));
  return {g,age:a,hair:a>=70?'#d8d8e0':a>=55?mixc(L.hair,'#c8c8d0',.45):L.hair,hs:L.hs,skin:L.skin,top:L.shirt,pants:L.pants,outfit:o.outfit||(a<1?'onesie':a<6?'kid':a<13?'kidcasual':a>=65?'cardigan':'casual'),acc:{glasses:L.glasses},mood:o.mood||'smile'}}
function heightOf(m){const a=m.age;let h=a<1?17:a<3?22:a<6?27:a<10?32:a<13?36:a<16?41:a<70?45:43;if(m.acc&&m.acc.tall&&a>=13)h+=4;if(m.g==='女'&&a>=13)h-=2;return h}

// 人を描く（x=中心、y=足もと）
function drawChar(x,y,m,pose,t){pose=pose||'stand';t=t||0;const H=heightOf(m),a=m.age;
  const hr=a<2?.46:a<6?.42:a<13?.38:a<18?.34:.31,hd=H*hr;
  const breath=Math.sin(t*2.2)*.35;const by=y+(pose==='walk'?-Math.abs(Math.sin(t*6))*1.2:0);
  const legH=pose==='sit'?H*.18:H*(a<2?.16:.36),torso=H-hd-legH,bw=Math.max(4,hd*.92),topY=by-H-breath*.4;
  const hunch=a>=70?1.2:0;
  // 足
  if(pose!=='sleep'){
    const lc=m.outfit==='onesie'?m.top:m.outfit==='uniform'&&m.g==='女'?'#e8e4f0':m.pants;
    if(pose==='walk'){const sw=Math.sin(t*6)*2.2;G.R(x-bw*.32+sw*.4,by-legH,bw*.28,legH,lc);G.R(x+bw*.04-sw*.4,by-legH,bw*.28,legH,lc)}
    else if(pose==='sit'){G.R(x-bw*.4,by-legH,bw*.8,legH*.6,lc);G.R(x-bw*.4,by-legH*.4,bw*.25,legH*.4,lc);G.R(x+bw*.15,by-legH*.4,bw*.25,legH*.4,lc)}
    else{G.R(x-bw*.34,by-legH,bw*.3,legH,lc);G.R(x+bw*.04,by-legH,bw*.3,legH,lc)}
    G.R(x-bw*.38,by-1.4,bw*.36,1.6,'#2a2a38',{r:.6});G.R(x+bw*.02,by-1.4,bw*.36,1.6,'#2a2a38',{r:.6});
    if(m.outfit==='uniform'&&m.g==='女'||(m.g==='女'&&a>=6&&['date','casual','kidcasual'].includes(m.outfit)&&m.hs%2===0))G.P([[x-bw*.5,by-legH-1],[x+bw*.5,by-legH-1],[x+bw*.62,by-legH*.45],[x-bw*.62,by-legH*.45]],m.outfit==='uniform'?'#2c3e70':m.pants);
  }
  // 体
  const ty=by-legH-torso;let tc=m.top;const of=m.outfit;
  if(of==='suit')tc='#2f3550';else if(of==='uniform')tc='#2c3e70';else if(of==='cardigan')tc='#c8a97e';else if(of==='rich')tc='#f4f1ea';else if(of==='sport')tc=m.top;else if(of==='onesie')tc=lite(m.top,.45);
  if(pose!=='sleep'){
    G.R(x-bw/2+hunch,ty,bw,torso+.5,tc,{r:1.6,sh:1});
    if(of==='suit'||of==='uniform'){G.P([[x-1.4+hunch,ty],[x+1.4+hunch,ty],[x+hunch,ty+torso*.5]],'#ffffff',{o:false});G.R(x-.5+hunch,ty+.5,1,torso*.45,of==='suit'?'#c0392b':m.g==='女'?'#d6336c':'#a83232',{o:false})}
    if(of==='hoodie'){G.R(x-bw*.18+hunch,ty+torso*.35,bw*.36,torso*.3,dark(tc,.15),{r:1});G.L(x-1+hunch,ty+1,x-1+hunch,ty+torso*.35,'#ffffff',.4);G.L(x+1+hunch,ty+1,x+1+hunch,ty+torso*.35,'#ffffff',.4)}
    if(of==='sport'){G.R(x-bw/2+hunch,ty+torso*.45,bw,1.2,'#ffffff',{o:false})}
    if(of==='apron'){G.R(x-bw*.32+hunch,ty+torso*.25,bw*.64,torso*.8,'#fdf6e3',{r:1})}
    if(of==='rich'){G.R(x-.6+hunch,ty+1,1.2,torso-1,'#d4a017',{o:false});G.E(x+bw*.3+hunch,ty+torso*.25,.8,.8,'#d4a017')}
    if(of==='cardigan'){G.R(x-.4+hunch,ty,.8,torso,'#8a6d4a',{o:false})}
    if(m.acc&&m.acc.patch)G.R(x+bw*.1,ty+torso*.5,2.2,2.2,'#a08060',{r:.3});
    if(m.acc&&m.acc.star)G.P(starPts(x-bw*.25+hunch,ty+torso*.3,1.4),'#ffd700',{o:false});
    // 腕
    const ac=of==='onesie'?tc:tc,arm=Math.max(1.4,bw*.2);
    if(pose==='type'){const tp=Math.sin(t*14)*.5;G.R(x-bw/2-arm*.6+hunch,ty+1,arm,torso*.55,ac,{r:.8});G.R(x+bw/2-arm*.4+hunch,ty+1,arm,torso*.55,ac,{r:.8});G.E(x-bw*.42+hunch,ty+torso*.6+tp,arm*.55,arm*.5,m.skin);G.E(x+bw*.42+hunch,ty+torso*.6-tp,arm*.55,arm*.5,m.skin)}
    else if(pose==='wave'){const wv=Math.sin(t*6)*1.5;G.R(x-bw/2-arm+hunch,ty+1,arm,torso*.8,ac,{r:.8});G.L(x+bw/2+hunch,ty+2,x+bw/2+3+hunch,ty-4+wv,ac,arm);G.E(x+bw/2+3+hunch,ty-4.5+wv,arm*.55,arm*.55,m.skin)}
    else{const sw=pose==='walk'?Math.sin(t*6)*1.2:0;G.R(x-bw/2-arm*.7+hunch,ty+1+sw*.2,arm,torso*.85,ac,{r:.8});G.R(x+bw/2-arm*.3+hunch,ty+1-sw*.2,arm,torso*.85,ac,{r:.8});G.E(x-bw/2-arm*.2+hunch,ty+torso*.9+sw*.2,arm*.55,arm*.5,m.skin);G.E(x+bw/2+arm*.2+hunch,ty+torso*.9-sw*.2,arm*.55,arm*.5,m.skin)}
    if(m.acc&&m.acc.cane){G.L(x+bw/2+1.5,ty+torso*.9,x+bw/2+2.5,by,'#6b4f3a',.9)}
  }
  // 頭
  const hx0=x+hunch*1.4,hy=pose==='sleep'?y-hd*.6:ty-hd*.92;drawHead(hx0,hy,hd,m,t,pose)}
function starPts(cx,cy,r){const p=[];for(let i=0;i<10;i++){const a=-Math.PI/2+i*Math.PI/5,rr=i%2?r*.45:r;p.push([cx+Math.cos(a)*rr,cy+Math.sin(a)*rr])}return p}
function drawHead(x,y,hd,m,t,pose){const r=hd/2,cx=x,cy=y+r;const hair=m.hair,hs=m.hs||0,fem=m.g==='女',a=m.age;
  // 後ろ髪
  if(a>=2){if(fem&&(hs===0))G.R(cx-r*1.05,cy-r*.4,r*2.1,r*2.1,hair,{r:r*.6});
    if(fem&&hs===2&&a>=4)G.E(cx+r*1.05,cy-r*.1,r*.45,r*.7,hair);
    if(fem&&hs===3&&a<20){G.E(cx-r*1.15,cy+r*.2,r*.4,r*.75,hair);G.E(cx+r*1.15,cy+r*.2,r*.4,r*.75,hair)}
    if(fem&&hs===3&&a>=20)G.E(cx,cy-r*1.05,r*.45,r*.4,hair)}
  // 顔
  G.E(cx,cy,r*.95,r,m.skin);
  // 前髪
  if(a>=1){if(!(m.g==='男'&&hs===3&&a>=60)){
    G.P([[cx-r*.98,cy-r*.05],[cx-r*.9,cy-r*.75],[cx-r*.4,cy-r*1.05],[cx+r*.4,cy-r*1.05],[cx+r*.9,cy-r*.75],[cx+r*.98,cy-r*.05],[cx+r*.6,cy-r*.45],[cx,cy-r*.55],[cx-r*.6,cy-r*.4]],hair,{o:G.st==='illust'});
    if(!fem&&hs===1){for(let i=-2;i<=2;i++)G.P([[cx+i*r*.35-r*.18,cy-r*.9],[cx+i*r*.35,cy-r*1.35],[cx+i*r*.35+r*.18,cy-r*.9]],hair,{o:false})}
    if(!fem&&hs===2)G.P([[cx-r*.9,cy-r*.6],[cx+r*.95,cy-r*.9],[cx+r*.98,cy-r*.1],[cx+r*.5,cy-r*.5]],hair,{o:false});
    if(fem&&hs===1)G.R(cx-r*1.02,cy-r*.6,r*.35,r*1.25,hair,{r:r*.15});
    if(fem&&hs===1)G.R(cx+r*.67,cy-r*.6,r*.35,r*1.25,hair,{r:r*.15});
    if(fem&&hs===0){G.R(cx-r*1.02,cy-r*.5,r*.3,r*1.6,hair,{r:r*.1,o:false});G.R(cx+r*.72,cy-r*.5,r*.3,r*1.6,hair,{r:r*.1,o:false})}
  }else{G.P([[cx-r*.98,cy-r*.1],[cx-r*.8,cy-r*.55],[cx-r*.55,cy-r*.3]],hair,{o:false});G.P([[cx+r*.98,cy-r*.1],[cx+r*.8,cy-r*.55],[cx+r*.55,cy-r*.3]],hair,{o:false})}}
  else G.E(cx,cy-r*.8,r*.3,r*.2,hair,{o:false});
  // 目・口
  const blink=((now()/1000+cx*.37)%4)<.12||pose==='sleep';const ey=cy+r*.05,ex=r*.38,es=Math.max(.6,r*.16);
  if(blink){G.L(cx-ex-es,ey,cx-ex+es,ey,'#2a1d16',.6);G.L(cx+ex-es,ey,cx+ex+es,ey,'#2a1d16',.6)}
  else{G.E(cx-ex,ey,es*.8,es*1.1,'#2a1d16',{o:false});G.E(cx+ex,ey,es*.8,es*1.1,'#2a1d16',{o:false});if(G.st==='illust'){G.E(cx-ex+es*.3,ey-es*.4,es*.3,es*.3,'#ffffff',{o:false});G.E(cx+ex+es*.3,ey-es*.4,es*.3,es*.3,'#ffffff',{o:false})}}
  const my=cy+r*.5;
  if(m.acc&&m.acc.mask)G.R(cx-r*.6,cy+r*.25,r*1.2,r*.55,'#f4f4f8',{r:r*.2});
  else if(pose==='sleep'){G.E(cx,my,r*.12,r*.09,'#a0525a',{o:false})}
  else if(m.mood==='smile')G.A(cx,my-r*.15,r*.28,.2*Math.PI,.8*Math.PI,'#a0525a',.6);
  else if(m.mood==='sad')G.A(cx,my+r*.2,r*.25,1.2*Math.PI,1.8*Math.PI,'#a0525a',.6);
  else G.L(cx-r*.18,my,cx+r*.18,my,'#a0525a',.6);
  if(m.acc&&m.acc.blush||m.mood==='smile'&&G.st==='illust'){G.alpha(.5,()=>{G.E(cx-r*.6,cy+r*.35,r*.2,r*.12,'#ff8fa3',{o:false});G.E(cx+r*.6,cy+r*.35,r*.2,r*.12,'#ff8fa3',{o:false})})}
  if(m.acc&&m.acc.glasses&&a>=6){G.c.strokeStyle='#30304a';G.c.lineWidth=.5;G.c.strokeRect(cx-ex-es*1.6,ey-es*1.3,es*3.2,es*2.6);G.c.strokeRect(cx+ex-es*1.6,ey-es*1.3,es*3.2,es*2.6)}
  if(m.acc&&m.acc.phones){G.A(cx,cy,r*1.05,Math.PI*1.05,Math.PI*1.95,'#30304a',.9);G.R(cx-r*1.2,cy-r*.2,r*.35,r*.6,'#30304a',{r:.4});G.R(cx+r*.85,cy-r*.2,r*.35,r*.6,'#30304a',{r:.4})}
  if(m.acc&&m.acc.sweat)G.E(cx+r*1.05,cy-r*.3,r*.13,r*.22,'#8fd3ff',{o:false});
  if(m.acc&&m.acc.tears){G.E(cx-ex,ey+es*2,es*.4,es*.7,'#8fd3ff',{o:false})}
  if(m.acc&&m.acc.sparkle&&((now()/400)|0)%2)G.P(starPts(cx+r*1.2,cy-r*.9,r*.3),'#fff6a0',{o:false});
  if(a<1)G.E(cx,cy-r*1.05,r*.6,r*.25,lite(m.top,.4))}

// ----- 場面を決める -----
const ACT_SCENE={post:'stream',practice:'stream',talkp:'stream',study:'desk',homework:'desk',play:'play',friends:'park',family:'living',date:'cafe',exercise:'park',rest:'bed',lesson:'lesson',part:'shop',shophelp:'shop',chores:'kitchen',base:'base',kidvideo:'kid',side:'desk',parenting:'living'};
const SCENE_N={stream:'配信・投稿',desk:'勉強・作業',play:'あそび',park:'外で過ごす',living:'家族の時間',cafe:'デート',bed:'おやすみ',lesson:'習い事',shop:'お店で働く',kitchen:'キッチン',base:'秘密基地',kid:'おうち',nursery:'赤ちゃん',office:'仕事',class:'学校',room:'自分の部屋'};
function sceneModel(){const a=age();let loc='room',act=null;
  if(a<1)loc='nursery';else if(a<6)loc='kid';
  else{const acts=(S.plan||[]).filter(x=>ACT[x]);act=acts.length?acts[S.am%acts.length]:null;
    if(S.st==='work'&&S.am%3===0)loc='office';else if(S.st==='school'&&S.am%3===0)loc='class';else if(S.st==='univ'&&S.am%3===0)loc='class';
    else loc=ACT_SCENE[act]||'room';
    if(loc==='play'&&a>=13)loc='stream';if(loc==='kid'&&a>=13)loc='room';}
  if(S.p.health<20&&a>=1)loc='bed';
  const home=S.home||0,tier=a<18&&home===0?0:home>=4?3:home>=2?2:1;
  return {a,loc,act,tier,era:S.y<1990?'showa':S.y<2010?'heisei':S.y<2035?'reiwa':'future',w:weather(),se:season()}}

// ----- 背景 -----
function drawSky(x,y,w,h){const p=dayPhase(),[a,b]=skyCols(p);G.fillG(x,y,w,h,G.grad(0,y,0,y+h,[[0,a],[1,b]]));
  const night=isNight();if(night){for(let i=0;i<12;i++)G.R(x+((i*53)%w),y+((i*29)%(h*.7)),.8,.8,'#ffffff',{o:false})}
  const sx=x+w*((p*1.6)%1),sy=y+h*.25+Math.sin(p*Math.PI*2)*h*.1;G.E(sx,sy,night?3:4,night?3:4,night?'#f4f1d0':'#ffe58a',{o:false})}
function weatherFx(x,y,w,h){const W=weather(),t=now()/1000,se=season();
  if(W==='cloud'||W==='rain'){G.alpha(.85,()=>{for(let i=0;i<3;i++){const cx=x+((i*70+t*4)%(w+40))-20;G.E(cx,y+8+i*5,14,5,W==='rain'?'#9aa0b4':'#f4f4f8',{o:false})}})}
  if(W==='rain'){G.c.save();G.c.beginPath();G.c.rect(x,y,w,h);G.c.clip();for(let i=0;i<26;i++){const rx=x+((i*37+t*40)%w),ry=y+((i*23+t*120)%h);G.L(rx,ry,rx-1.2,ry+4,'#cfe3ff',.5)}G.c.restore()}
  if(W==='snow'||se==='winter'&&W!=='rain'){G.c.save();G.c.beginPath();G.c.rect(x,y,w,h);G.c.clip();for(let i=0;i<18;i++){const sx=x+((i*41+Math.sin(t+i)*6+t*6)%w),sy=y+((i*19+t*14)%h);G.E(sx,sy,.8,.8,'#ffffff',{o:false})}G.c.restore()}
  if(se==='spring'&&W!=='rain'){G.c.save();G.c.beginPath();G.c.rect(x,y,w,h);G.c.clip();for(let i=0;i<8;i++){const sx=x+((i*47+t*10)%w),sy=y+((i*31+t*9)%h);G.E(sx,sy,1.1,.7,'#ffc0d0',{o:false})}G.c.restore()}
  if(se==='autumn'&&W!=='rain'){G.c.save();G.c.beginPath();G.c.rect(x,y,w,h);G.c.clip();for(let i=0;i<6;i++){const sx=x+((i*53+t*8)%w),sy=y+((i*37+t*11)%h);G.E(sx,sy,1.1,.8,i%2?'#e07a3a':'#d4a017',{o:false})}G.c.restore()}}
function drawWindow(x,y,w,h){G.R(x-2,y-2,w+4,h+4,'#5a4a3a',{r:1.5});G.c.save();G.c.beginPath();G.c.rect(x,y,w,h);G.c.clip();drawSky(x,y,w,h);
  const se=season();G.R(x,y+h*.72,w,h*.28,se==='winter'?'#e8eef6':se==='autumn'?'#c98a4a':'#7cbf6a',{o:false});
  if(se==='spring')G.E(x+w*.8,y+h*.62,w*.25,h*.18,'#ffc8d8',{o:false});if(se==='autumn')G.E(x+w*.2,y+h*.62,w*.22,h*.16,'#e07a3a',{o:false});if(se==='summer')G.E(x+w*.75,y+h*.62,w*.25,h*.18,'#4caf50',{o:false});
  weatherFx(x,y,w,h);G.c.restore();G.R(x+w/2-1,y,2,h,'#5a4a3a',{o:false});G.R(x,y+h/2-1,w,2,'#5a4a3a',{o:false})}
function wallFloor(wall,floor,trim){G.R(0,0,320,150,wall,{o:false});
  if(G.st==='pixel'){for(let x2=0;x2<320;x2+=20)G.R(x2,0,1,150,dark(wall,.06),{o:false})}
  G.R(0,150,320,50,floor,{o:false});for(let x2=0;x2<320;x2+=32)G.R(x2,150,1,50,dark(floor,.15),{o:false});G.R(0,148,320,3,trim||dark(floor,.3),{o:false})}
function lampGlow(x,y,r){if(!isNight())return;const g=G.c.createRadialGradient(x,y,1,x,y,r);g.addColorStop(0,'rgba(255,230,160,.45)');g.addColorStop(1,'rgba(255,230,160,0)');G.c.fillStyle=g;G.c.fillRect(x-r,y-r,r*2,r*2)}
function nightShade(){if(!isNight())return;G.c.fillStyle='rgba(20,22,60,.28)';G.c.fillRect(0,0,320,200)}
function bed(x,y,col){G.R(x,y-14,60,14,'#8a6d4a',{r:2});G.R(x+2,y-20,56,8,col||'#f4f1ea',{r:3});G.R(x+2,y-22,14,6,'#ffffff',{r:2});G.R(x-2,y-30,6,30,'#6b4f3a',{r:1.5})}
function desk(x,y,w){G.R(x,y-26,w,4,'#a0714f',{r:1,sh:1});G.R(x+2,y-22,3,22,'#7a5238');G.R(x+w-5,y-22,3,22,'#7a5238')}
function chair(x,y){G.R(x-6,y-14,12,3,'#3c3f66',{r:1});G.R(x+4,y-28,3,16,'#3c3f66',{r:1});G.R(x-1,y-11,2,11,'#555')}
function shelf(x,y){G.R(x,y,30,40,'#7a5238',{r:1});for(let i=1;i<4;i++)G.R(x+1,y+i*10,28,1.5,'#5a3a22',{o:false});const cs=['#ff5c8a','#3fd6c9','#ffcf3f','#7bdc6b','#b49cff'];for(let i=0;i<8;i++)G.R(x+3+(i%4)*6,y+2+((i/4)|0)*10+ (i%3),4,8-(i%3),cs[i%5],{r:.5})}
function plant(x,y){G.R(x-4,y-8,8,8,'#c0703a',{r:1.5});G.E(x,y-14,7,8,'#3f9a4f');G.E(x-4,y-18,4,5,'#56b35f');G.E(x+4,y-19,4,5,'#56b35f')}
function tvOld(x,y){G.R(x,y-22,28,22,'#4a4040',{r:3});G.R(x+3,y-19,18,15,isNight()?'#7fa0c0':'#9fb8d0',{r:2});G.E(x+24,y-15,1.5,1.5,'#c0c0c0')}
function streamGear(cx,y,m){const e=S.eq,f=now()/1000;const live=S.postPlan==='live'||(m.act==='post'&&((f|0)%6<3));
  desk(cx-50,y,100);const fy=y-26;
  // パソコン
  if(m.era==='showa'){tvOld(cx-10,fy)}
  else if(m.era==='heisei'){G.R(cx-14,fy-20,26,20,'#d8d4c8',{r:1.5});G.R(cx-11,fy-17,20,13,'#3a6ea5',{r:1});G.R(cx-4,fy-1,6,1.5,'#b0aca0')}
  else{const n=Math.min(3,1+((e.pc||0)>=2)+((e.pc||0)>=4));for(let i=0;i<n;i++){const mx=cx-12+(i-(n-1)/2)*28;G.R(mx-12,fy-22,26,17,'#20232e',{r:1.5});const sc=m.era==='future'?'#7ff0ff':['#2b6cb0','#3fa27a','#7a4fd0'][i%3];G.R(mx-10,fy-20,22,13,sc,{r:1});G.R(mx,fy-5,3,5,'#30303a')}
    if(m.era==='future')G.alpha(.35+Math.sin(f*3)*.15,()=>G.R(cx-40,fy-40,30,16,'#7ff0ff',{r:2,o:false}))}
  // カメラ・マイク・照明
  if((e.cam||0)>=1){G.R(cx+30,fy-30,8,6,'#222',{r:1});G.E(cx+30,fy-27,2,2,'#555');G.L(cx+34,fy-24,cx+34,fy,'#444',.8)}
  if((e.mic||0)>=2){G.L(cx+18,fy-2,cx+22,fy-14,'#555',.8);G.R(cx+20,fy-19,4,6,'#30303a',{r:2})}else if((e.mic||0)>=1)G.R(cx+14,fy-5,3,5,'#333',{r:1});
  if((e.light||0)>=1){G.A(cx-40,fy-26,7,0,Math.PI*2,(e.light||0)>=2?'#fff6d8':'#fff0b0',2);G.L(cx-40,fy-19,cx-40,fy,'#555',.8)}
  if(live){G.R(8,8,40,12,'#e03131',{r:2});G.T('LIVE',28,17,'#ffffff',8,'center');G.E(14,14,1.6,1.6,(f*2|0)%2?'#ffffff':'#ffb3b3',{o:false})}}
function decoNew(){const d=S.deco||{};
  if(d.wall==='poster'){G.R(160,40,24,32,'#f4f1ff',{r:1});G.R(163,44,18,12,'#3fd6c9',{r:1});G.R(163,60,18,3,'#ff5c8a',{o:false})}
  if(d.wall==='neon'){const on=(now()/500|0)%2;G.R(150,30,50,18,'#1a1a2a',{r:2});G.R(154,36,42,3,on?'#ff5c8a':'#a03a5a',{o:false});G.R(154,41,30,3,on?'#3fd6c9':'#2a8a80',{o:false})}
  if(d.wall==='clock'){G.E(175,40,9,9,'#f4f1ff');G.L(175,40,175,34,'#222',.8);G.L(175,40,180,42,'#222',.8)}
  if(d.wall==='shield'){G.P([[165,30],[185,30],[185,48],[175,56],[165,48]],'#d8d8e8');G.P(starPts(175,42,5),'#ffd700',{o:false})}
  if(d.floor==='plant')plant(14,170);if(d.floor==='plush'){G.E(18,164,8,7,'#f2c39d');G.E(12,157,3,3,'#f2c39d');G.E(24,157,3,3,'#f2c39d');G.E(15,163,.8,.8,'#222',{o:false});G.E(21,163,.8,.8,'#222',{o:false})}
  if(d.floor==='shelf')shelf(4,120);
  if(d.rug==='rug')G.E(160,182,60,9,'#c45a7a',{o:false});
  if(S.stats.maxF>=1e5){G.R(250,60,40,3,'#7a5238',{o:false});G.R(256,48,10,12,S.stats.maxF>=1e6?'#ffd700':'#c0c0d0',{r:1});if(S.stats.maxF>=1e6)G.R(272,46,12,14,'#c0c0d0',{r:1})}}
function petDog(x,y,t){if(!S.pet)return;const dx=x+Math.sin(t*.5)*25;G.E(dx,y-5,8,5,'#c08a4a');G.E(dx+7,y-9,4,4,'#c08a4a');G.E(dx+9,y-12,1.6,2.6,'#8a5a2a');G.E(dx+8.5,y-9.5,.6,.6,'#222',{o:false});G.L(dx-8,y-7,dx-11,y-10+Math.sin(t*10),'#c08a4a',1.2);G.R(dx-5,y-2,2,3,'#c08a4a',{o:false});G.R(dx+3,y-2,2,3,'#c08a4a',{o:false})}
function familyList(){const a=age(),l=[];if(a<25)for(const p of parents())l.push([p,p.age0+a,p.role]);if(S.spouse)l.push([S.spouse,a+RI(0,0),'配偶者']);for(const c of S.kids)l.push([c,Math.floor((S.am-c.born)/12),'子ども']);return l.slice(0,4)}

function drawLoc(m,t){const L=m.loc,a=m.a,me=mainModel({loc:L,act:m.act});
  const wallT=['#c9b8e8','#d8cbb0','#cfe0e8','#2c3550'][m.tier],floorT=['#b5835a','#9b7a5a','#c8a27a','#4a4258'][m.tier];
  if(L==='park'||L==='base'){drawSky(0,0,320,150);weatherFx(0,0,320,150);const se=m.se;G.R(0,130,320,70,se==='winter'?'#eef3f8':se==='autumn'?'#c9a25a':'#7cc47a',{o:false});
    for(let i=0;i<5;i++){const tx=20+i*70;G.R(tx-2,104,4,30,'#7a5238');G.E(tx,98,16,14,se==='spring'?'#ffc8d8':se==='autumn'?'#e08a3a':se==='winter'?'#e0e8f0':'#4caf50')}
    G.R(0,170,320,12,'#d8c8a0',{o:false});
    if(L==='base'){G.R(200,90,60,40,'#9a7a4a',{r:2});G.P([[195,92],[230,70],[265,92]],'#6b4f3a');G.R(222,110,14,20,'#5a3a22');drawChar(150,178,me,'wave',t);const f=S.friends[0];if(f)drawChar(185,178,npcModel(f,a,'友達'),'stand',t+1)}
    else if(m.act==='exercise'){const rx=((t*30)%380)-30;drawChar(rx,180,me,'walk',t);petDog(rx-30,182,t)}
    else{drawChar(130,180,me,'stand',t);let i=0;for(const f of S.friends.slice(0,2)){drawChar(165+i*30,180,npcModel(f,a,'友達'),i?'stand':'wave',t+i);i++}}
    return}
  if(L==='cafe'){wallFloor('#e8d8c0','#8a6a4a');drawWindow(30,30,90,60);G.R(170,30,120,10,'#7a5238',{r:1});for(let i=0;i<4;i++)G.E(190+i*25,52,6,6,['#ffd166','#ff8fa3','#95d5b2','#c3a6ff'][i]);
    G.R(120,140,80,5,'#f4f1ea',{r:2});G.R(157,145,6,25,'#7a5238');G.R(140,132,8,8,'#ffffff',{r:2});G.R(172,132,8,8,'#ffffff',{r:2});
    drawChar(110,178,me,'sit',t);const p=S.partner||S.spouse;if(p)drawChar(210,178,npcModel(p,a,'恋人',{outfit:'date'}),'sit',t+2);
    const ft=(t%3)/3;G.alpha(1-ft,()=>G.P(heartPts(160,120-ft*20,3),'#ff5c8a',{o:false}));return}
  if(L==='class'){wallFloor('#e8ecd8','#b08a5a');G.R(60,20,200,60,'#2f5d4a',{r:2});G.T(['こくご','さんすう','えいご','れきし'][S.am%4],160,56,'#f4f4e8',12,'center');drawWindow(270,30,40,50);
    for(let r=0;r<2;r++)for(let i=0;i<4;i++){const dx=50+i*65,dy=150+r*30;G.R(dx-14,dy-14,28,4,'#c8a27a',{r:1});if(!(r===1&&i===1))drawChar(dx,dy+12,npcModel({name:'cls'+r+i},a,'同級生'),'sit',t+i)}
    drawChar(115,192,me,'sit',t);drawChar(30,150,npcModel({name:'teacher',g:'女'},40,'先生'),'wave',t);return}
  if(L==='office'){wallFloor('#dfe4ea','#8a8f9a');drawWindow(20,25,70,55);for(let i=0;i<3;i++){const dx=130+i*60;G.R(dx-25,148,50,4,'#c0c4cc',{r:1});G.R(dx-22,152,3,26,'#9aa0aa');G.R(dx+19,152,3,26,'#9aa0aa');G.R(dx-12,128,24,16,'#20232e',{r:1});G.R(dx-10,130,20,12,'#4a7ab0',{r:1})}
    drawChar(130,178,me,'type',t);drawChar(190,178,npcModel({name:'coworker'},35,'同僚',{outfit:'suit'}),'type',t+1);plant(300,170);return}
  if(L==='shop'){wallFloor('#f4e4c8','#a07a50');G.R(0,20,320,16,'#ff6150',{o:false});for(let x2=0;x2<320;x2+=24)G.R(x2,20,12,16,'#ffffff',{o:false});G.R(40,120,240,30,'#c8a27a',{r:2});for(let i=0;i<5;i++)G.E(70+i*45,115,7,5,['#ffd166','#f4a261','#e76f51','#95d5b2','#ffafcc'][i]);
    drawChar(160,150,me,'stand',t);drawChar(80,195,npcModel({name:'customer1'},30,'客'),'stand',t);drawChar(250,195,npcModel({name:'customer2'},60,'客'),'wave',t+1);return}
  if(L==='kitchen'){wallFloor('#f4f1ea','#c8b8a0');G.R(170,90,140,60,'#e8e0d0',{r:2});G.R(180,96,40,24,'#30303a',{r:2});G.E(200,92,9,3,'#888');G.R(240,60,60,30,'#ffffff',{r:2});drawWindow(30,30,70,50);
    const s=Math.sin(t*3);G.alpha(.4,()=>{G.E(200,80+s,4,6,'#ffffff',{o:false});G.E(205,70+s,3,5,'#ffffff',{o:false})});drawChar(150,182,me,'type',t);return}
  // 家の中
  if(m.era==='future')wallFloor('#d8e0ec','#9aa4b8');else wallFloor(wallT,floorT);
  drawWindow(24,26,64,52);decoNew();
  if(m.tier===3){G.R(110,20,90,70,'#1a2040',{r:2});G.c.save();G.c.beginPath();G.c.rect(112,22,86,66);G.c.clip();drawSky(112,22,86,66);for(let i=0;i<8;i++)G.R(114+i*11,60-(i*7)%25,8,30+(i*7)%25,isNight()?'#2a2d50':'#7a88a8',{o:false});if(isNight())for(let i=0;i<10;i++)G.R(116+(i*9)%80,64+(i*5)%20,1.5,1.5,'#ffe08a',{o:false});G.c.restore()}
  if(m.era==='showa'&&L!=='stream')tvOld(250,150);
  if(L==='nursery'){G.R(150,120,70,30,'#f4e4f0',{r:3});for(let i=0;i<7;i++)G.R(152+i*10,104,2,18,'#e0c8e0',{o:false});G.R(150,102,70,3,'#e0c8e0',{o:false});
    drawChar(185,138,me,'sleep',t);const ps=parents();if(ps[0])drawChar(255,180,npcModel(ps[0],ps[0].age0,ps[0].role),'stand',t);
    const mob=t*.8;for(let i=0;i<3;i++)G.E(170+i*15,80+Math.sin(mob+i)*2,3,3,['#ff8fa3','#7fc8f8','#ffd166'][i]);G.L(160,70,215,70,'#888',.5);return}
  if(L==='kid'||L==='play'&&a<13){G.R(180,165,14,10,'#ff6b6b',{r:1});G.R(198,168,10,7,'#4dabf7',{r:1});G.E(230,172,6,6,'#ffd43b');drawChar(150,182,me,a<3?'sit':'wave',t);const ps=parents();if(ps[0]&&a<6)drawChar(260,180,npcModel(ps[0],ps[0].age0+a,ps[0].role),'stand',t+1);petDog(90,185,t);
    if(S.kc.on){G.R(8,8,36,12,'#e03131',{r:2});G.T('REC',26,17,'#fff',8,'center')}return}
  if(L==='bed'){bed(180,160,'#c3d0f0');drawChar(205,140,me,'sleep',t);G.alpha(.8,()=>{const z=(t%2)/2;G.T('z',225+z*8,120-z*12,'#5a5a8a',8+z*4)});nightShade();lampGlow(150,90,60);petDog(80,185,t);return}
  if(L==='living'){G.R(90,140,140,6,'#a0714f',{r:2});G.R(100,146,4,20,'#7a5238');G.R(216,146,4,20,'#7a5238');G.E(130,136,8,3,'#ffffff');G.E(190,136,8,3,'#ffffff');
    drawChar(70,182,me,'sit',t);let i=0;for(const [n,na,role] of familyList()){drawChar(130+i*45,182,npcModel(n,na,role),i%2?'wave':'sit',t+i);i++}petDog(260,190,t);return}
  if(L==='lesson'){G.R(180,120,90,30,'#20202a',{r:2});for(let i=0;i<9;i++)G.R(184+i*9.5,140,8,9,'#ffffff',{r:.5});drawChar(160,182,me,'type',t);const ft=(t%2)/2;G.alpha(1-ft,()=>G.T('♪',230+ft*10,110-ft*20,'#ff5c8a',10));return}
  if(L==='desk'){desk(120,175,90);G.R(130,140,18,8,'#ffffff',{r:1});G.R(150,141,14,6,'#ffd166',{r:1});G.L(180,149,184,132,'#555',.8);G.E(186,130,6,3,'#fff0b0');lampGlow(186,132,40);drawChar(160,182,me,'type',t);petDog(60,190,t);return}
  // 自分の部屋・配信
  bed(240,165,a<13?'#ffd6e0':'#d8e0f8');
  if(L==='stream'){streamGear(150,176,m);drawChar(150,182,me,'type',t);const cp=typeof collabNow==='function'&&collabNow();if(cp){G.R(10,26,40,30,'#20232e',{r:2});G.c.save();G.c.beginPath();G.c.rect(12,28,36,26);G.c.clip();drawChar(30,62,npcModel(cp,25,'コラボ'),'wave',t);G.c.restore()}}
  else{desk(60,175,70);chair(100,178);drawChar(150,182,me,a>=13&&(now()/3000|0)%2?'wave':'stand',t)}
  petDog(90,190,t);if(L!=='stream')nightShade();lampGlow(100,60,70)}
function heartPts(x,y,s){const p=[];for(let i=0;i<20;i++){const a=i/20*Math.PI*2;p.push([x+s*16*Math.pow(Math.sin(a),3)/16,y-s*(13*Math.cos(a)-5*Math.cos(2*a)-2*Math.cos(3*a)-Math.cos(4*a))/16])}return p}

// ----- 演出（バズ・炎上・誕生日） -----
let FXS={buzz:0,flame:0,bday:0,_b:-1,_f:-1,_a:-1};
function fxCheck(){if(!S)return;if(FXS.s!==S){FXS.s=S;FXS._b=S.stats.buzz;FXS._f=S.stats.flames;FXS._a=age();return}const t=now();if(FXS._b>=0&&S.stats.buzz>FXS._b)FXS.buzz=t;FXS._b=S.stats.buzz;if(FXS._f>=0&&S.stats.flames>FXS._f)FXS.flame=t;FXS._f=S.stats.flames;const a=age();if(FXS._a>=0&&a>FXS._a)FXS.bday=t;FXS._a=a}
function drawFx(){const t=now();
  if(t-FXS.buzz<3500){const k=(t-FXS.buzz)/3500;for(let i=0;i<40;i++){const x=(i*37)%320,y=((i*53)%60)+k*220-40;G.R(x+Math.sin(t/200+i)*6,y,3,2,['#ff5c8a','#ffd166','#3fd6c9','#b49cff','#7bdc6b'][i%5],{o:false})}G.alpha(1-k,()=>{G.R(90,8,140,22,'#ff5c8a',{r:4});G.T('バズった！',160,24,'#ffffff',14,'center')})}
  if(t-FXS.flame<3500){const k=(t-FXS.flame)/3500;G.alpha((1-k)*.12*(1+Math.sin(t/80)),()=>G.R(0,0,320,200,'#ff3b30',{o:false}));G.alpha(1-k,()=>{G.R(110,8,100,22,'#2a1010',{r:4});G.T('炎上中…',160,24,'#ff8a65',14,'center')})}
  if(t-FXS.bday<3000){const k=(t-FXS.bday)/3000;G.alpha(1-k,()=>{G.R(80,8,160,22,'#ffd166',{r:4});G.T(`${age()}歳の誕生日！`,160,24,'#5a3a00',13,'center')})}}

// ----- 部屋の場面を描く -----
const cvRoom=$('#room');
function sizeCanvases(){const st=sceneStyle();const k=st==='illust'?3:st==='pixel'?2:1;
  if(st==='classic'){if(cvRoom.width!==160){cvRoom.width=160;cvRoom.height=100}}
  else{const W=320*(st==='illust'?3:1),H=200*(st==='illust'?3:1);if(cvRoom.width!==W){cvRoom.width=W;cvRoom.height=H}}
  cvRoom.style.imageRendering=st==='illust'?'auto':'pixelated'}
function drawRoom(){if(sceneStyle()==='classic')return drawRoomClassic();fr++;
  if(!S||$('#scrGame').hidden)return;sizeCanvases();fxCheck();const st=sceneStyle();G.use(cx,st==='illust'?3:1,st);
  const m=sceneModel(),t=now()/1000;try{drawLoc(m,t)}catch(e){console.error(e)}
  // 見出し
  G.alpha(.85,()=>{G.R(4,184,96,13,'#000000',{r:3,o:false})});G.T(SCENE_N[m.loc]||'',8,194,'#ffffff',9);
  const lab=`${S.m}月 ${SEASON_N[m.se]} ${['park','base'].includes(m.loc)||true?WEA_N[m.w]:''}`;G.alpha(.85,()=>{G.R(236,184,80,13,'#000000',{r:3,o:false})});G.T(lab,312,194,'#ffffff',9,'right');
  drawFx()}
let lastT2=0;function loop(t){const iv=sceneStyle()==='classic'?110:(speed>=2||skipping?70:40);if(t-lastT2>iv){lastT2=t;try{drawRoom()}catch(err){}try{if(!$('#scrTitle').hidden&&sceneStyle()!=='classic')drawLogo()}catch(_){}}requestAnimationFrame(loop)}

// ----- タイトルのロゴ -----
function drawLogo(){if(sceneStyle()==='classic')return drawLogoClassic();const cv=$('#logoCv'),st=sceneStyle(),k=st==='illust'?3:2;if(cv.width!==160*k){cv.width=160*k;cv.height=80*k}cv.style.imageRendering=st==='illust'?'auto':'pixelated';
  G.use(cv.getContext('2d'),k,st);const t=now()/1000;G.fillG(0,0,160,80,G.grad(0,0,0,80,st==='illust'?[[0,'#ffe3ec'],[1,'#e3f0ff']]:[[0,'#1b1d40'],[1,'#3a2a60']]));
  for(let i=0;i<10;i++){const y=((i*17-t*12)%90+90)%90;G.alpha(.8,()=>G.P(heartPts(10+(i*29)%150,y,1.3+(i%3)*.4),['#ff5c8a','#ffd166','#3fd6c9'][i%3],{o:false}))}
  G.R(62,8,36,64,'#20232e',{r:5});G.R(65,13,30,52,st==='illust'?'#fff6f0':'#2c3062',{r:2});
  drawChar(80,54,{g:'女',age:20,hair:'#5a3a22',hs:2,skin:SKINS[0],top:'#ff5c8a',pants:'#2e3a6e',outfit:'hoodie',acc:{},mood:'smile'},'wave',t);
  G.R(67,56,26,7,'#ff5c8a',{r:2});G.T('♥ '+num(Math.floor(1000+t*37)),80,61.5,'#ffffff',5,'center')}

// ----- まちの地図 -----
const BICON={cafe:'cup',restaurant:'fork',gym:'dumb',park:'tree',library:'book',tourism:'flag',kids:'heart',studio:'star',gamedev:'pad',fashion:'shirt',stall:'awn'};
function drawTown(){if(sceneStyle()==='classic')return drawTownClassic();const cv=$('#townCv');if(!cv)return;const st=sceneStyle(),k=st==='illust'?3:1;if(cv.width!==320*k){cv.width=320*k;cv.height=240*k}cv.style.imageRendering=st==='illust'?'auto':'pixelated';
  G.use(cv.getContext('2d'),k,st);const se=season();
  S.town.tiles.forEach((tl,i)=>{const x=(i%8)*40,y=Math.floor(i/8)*40;G.R(x,y,40,40,se==='winter'?'#e4ecf2':'#86c27a',{o:false});G.R(x+6,y+30,1.5,1.5,dark('#86c27a',.2),{o:false});
    if(tl.t==='road'){G.R(x,y,40,40,'#7a7a8a',{o:false});G.R(x+18,y+19,4,2,'#e8e0a0',{o:false})}
    else if(tl.t==='house'){const cs=['#e57373','#64b5f6','#ffd54f','#a1887f'];G.R(x+8,y+18,24,18,'#f4ede0',{r:1});G.P([[x+5,y+19],[x+20,y+7],[x+35,y+19]],cs[i%4]);G.R(x+17,y+26,6,10,'#6d4c41',{r:.5});G.R(x+10,y+22,5,5,'#9fd3ff',{r:.5})}
    else if(tl.t==='tree'){G.R(x+18,y+24,4,12,'#7a5238');G.E(x+20,y+18,11,11,se==='autumn'?'#e08a3a':se==='spring'?'#ffc0d0':'#3f9a4f')}
    else if(tl.t==='empty'){G.alpha(.5,()=>{G.c.setLineDash([2,2]);G.c.strokeStyle='#ffffff';G.c.lineWidth=.8;G.c.strokeRect(x+4,y+4,32,32);G.c.setLineDash([])})}
    else if(BLD[tl.t]){const b=BLD[tl.t],c=b.col||'#9fa8da';G.R(x+4,y+12,32,26,c,{r:1.5,sh:1});G.R(x+2,y+8,36,6,dark(c,.25),{r:1});
      for(let j=0;j<2;j++)G.R(x+8+j*16,y+18,8,6,'#e8f4ff',{r:.5});G.R(x+16,y+28,8,10,'#3b3b55',{r:.5});
      const ic=BICON[tl.t];G.E(x+30,y+6,5,5,'#ffffff');const ix=x+30,iy=y+6;
      if(ic==='cup'){G.R(ix-2,iy-1,4,3,'#8a5a2a',{r:.5})}else if(ic==='fork'){G.L(ix,iy-3,ix,iy+3,'#555',.8)}else if(ic==='dumb'){G.L(ix-3,iy,ix+3,iy,'#555',.8);G.R(ix-3.5,iy-1.5,1.5,3,'#555',{o:false});G.R(ix+2,iy-1.5,1.5,3,'#555',{o:false})}
      else if(ic==='tree'){G.E(ix,iy-1,2.5,2.5,'#3f9a4f')}else if(ic==='book'){G.R(ix-2.5,iy-2,5,4,'#3a6ea5',{r:.3})}else if(ic==='flag'){G.L(ix-1,iy-3,ix-1,iy+3,'#555',.6);G.P([[ix-1,iy-3],[ix+3,iy-2],[ix-1,iy-1]],'#e03131',{o:false})}
      else if(ic==='heart'){G.P(heartPts(ix,iy,1.6),'#ff5c8a',{o:false})}else if(ic==='star'){G.P(starPts(ix,iy,3),'#ffd700',{o:false})}else if(ic==='pad'){G.R(ix-3,iy-1.5,6,3,'#555',{r:1})}else if(ic==='shirt'){G.P([[ix-3,iy-2],[ix+3,iy-2],[ix+2,iy+3],[ix-2,iy+3]],'#c3a6ff',{o:false})}else G.R(ix-3,iy-2,6,2,'#ff6150',{o:false});
      for(let l=0;l<tl.lv;l++)G.P(starPts(x+8+l*6,y+34,2),'#ffd700',{o:false})}
    if(i===S.town.sel){G.c.strokeStyle='#ffcf3f';G.c.lineWidth=2;G.c.strokeRect(x+1,y+1,38,38)}});
  if(isNight())G.alpha(.25,()=>G.R(0,0,320,240,'#141a3c',{o:false}))}

// ----- 出来事のさし絵 -----
const EV_ART={SNS:'sns',恋愛:'love',家族:'family','家族チャンネル':'family',仕事:'work',お金:'money',健康:'health',学校:'school',まち:'town',ニュース:'news',時代:'news',人生:'life',成長:'kid',友達:'friends',世界:'news'};
function drawEvArt(cv,cat){const st=sceneStyle(),k=st==='illust'?3:2;cv.width=160*k;cv.height=56*k;cv.style.imageRendering=st==='illust'?'auto':'pixelated';G.use(cv.getContext('2d'),k,st);
  const kind=EV_ART[cat]||'life',bgc={sns:'#ffe3ec',love:'#ffd6e0',family:'#fff1d6',work:'#dfe7f2',money:'#fff4c2',health:'#e3f6ec',school:'#e8f2d8',town:'#d6ecff',news:'#ececec',life:'#ece3ff',kid:'#fff0d6',friends:'#e0f4ff'}[kind];
  G.R(0,0,160,56,st==='pixel'?dark(bgc,.55):bgc,{o:false});const t=now()/1000,me=mainModel({});
  if(kind==='sns'){G.R(66,6,28,46,'#20232e',{r:4});G.R(68,9,24,38,'#ffffff',{r:2});G.P(heartPts(80,30,3),'#ff5c8a');G.T('♥',40,30,'#ff5c8a',10);G.T('★',115,25,'#ffd166',10)}
  else if(kind==='love'){drawChar(60,54,me,'stand',t);const p=S.partner||S.spouse;drawChar(100,54,p?npcModel(p,age(),'恋人'):{g:S.g==='男'?'女':'男',age:age(),hair:'#3b2a1e',hs:1,skin:SKINS[0],top:'#7fc8f8',pants:'#3d3d4f',outfit:'casual',acc:{},mood:'smile'},'stand',t);G.P(heartPts(80,14,3),'#ff5c8a')}
  else if(kind==='family'){G.P([[30,30],[55,12],[80,30]],'#e57373');G.R(36,30,38,22,'#f4ede0');drawChar(105,54,me,'stand',t);const f=familyList()[0];if(f)drawChar(128,54,npcModel(f[0],f[1],f[2]),'wave',t)}
  else if(kind==='work'){G.R(30,32,60,4,'#c0c4cc');G.R(46,16,26,16,'#20232e',{r:1});G.R(48,18,22,12,'#4a7ab0');drawChar(110,54,mainModel({loc:'office'}),'type',t)}
  else if(kind==='money'){for(let i=0;i<5;i++)G.E(50+i*14,40-(i%2)*6,6,6,'#ffd43b');G.T('¥',80,24,'#b8860b',14,'center')}
  else if(kind==='health'){G.R(66,10,28,36,'#ffffff',{r:3});G.R(76,16,8,24,'#e03131',{o:false});G.R(68,24,24,8,'#e03131',{o:false})}
  else if(kind==='school'){G.R(40,20,80,32,'#f4ede0');G.P([[36,22],[80,6],[124,22]],'#c0392b');G.E(80,30,5,5,'#ffffff');G.L(80,30,80,27,'#333',.6)}
  else if(kind==='town'){for(let i=0;i<5;i++){const h=14+(i*7)%20;G.R(20+i*26,52-h,20,h,['#9fa8da','#ffcc80','#a5d6a7','#ef9a9a','#90caf9'][i])}}
  else if(kind==='news'){G.R(50,8,60,42,'#ffffff',{r:1});G.R(54,12,52,6,'#30303a',{o:false});for(let i=0;i<4;i++)G.R(54,22+i*6,52-(i%2)*14,2,'#9a9aaa',{o:false})}
  else if(kind==='kid'){drawChar(80,54,mainModel({}),'wave',t);G.E(110,48,5,5,'#ffd43b')}
  else if(kind==='friends'){drawChar(65,54,me,'wave',t);const f=S.friends[0];drawChar(95,54,f?npcModel(f,age(),'友達'):me,'stand',t+1)}
  else{drawSky(0,0,160,56);G.E(80,56,30,10,'#ffd166',{o:false});drawChar(80,54,me,'wave',t)}}
function showEvent(e){showEventBase(e);if(!e||sceneStyle()==='classic')return;try{const mc=$('#mcard'),c=document.createElement('canvas');c.className='evart';c.setAttribute('aria-hidden','true');const cat=mc.querySelector('.mcat');(cat||mc.firstChild).after(c);drawEvArt(c,e.cat)}catch(_){}}

// ----- 思い出アルバム -----
const ALB_ART={birth:['#ffd6e0',0],debut:['#3fd6c9',13],buzz:['#ff5c8a',15],f10k:['#ffcf3f',16],f100k:['#d8d8e8',20],f1m:['#ffcf3f',25],wed:['#fff0f5',28],baby:['#ffe8cc',30],job:['#90caf9',22],univ:['#c5e1a5',18],home:['#bcaaa4',22],mayor:['#7986cb',45],shop:['#ffcc80',30],office:['#9fa8da',30],award:['#ffd54f',30],flame:['#ff8a65',20],grand:['#f8bbd0',60],fest:['#4db6ac',35],goal:['#aed581',40],end:['#5c6bc0',80],heir:['#b39ddb',20]};
function drawAlbum(cv,k){if(sceneStyle()==='classic')return drawAlbumClassic(cv,k);const st=sceneStyle(),sc=st==='illust'?3:2;cv.width=64*sc;cv.height=48*sc;cv.style.imageRendering=st==='illust'?'auto':'pixelated';G.use(cv.getContext('2d'),sc,st);
  const [bg,ag]=ALB_ART[k]||['#ccc',20];const idx=+cv.dataset.alb;const item=(S.album||[])[idx];const a2=item?item.age:ag;
  G.R(0,0,64,48,bg,{o:false});const me=mainModel({age:a2});const t=1;
  if(k==='wed'){drawChar(26,46,me,'stand',t);drawChar(40,46,{g:S.g==='男'?'女':'男',age:a2,hair:'#3b2a1e',hs:0,skin:SKINS[0],top:'#ffffff',pants:'#ffffff',outfit:'casual',acc:{},mood:'smile'},'stand',t);G.P(heartPts(33,8,2),'#ff5c8a')}
  else if(k==='baby'||k==='grand'||k==='birth'){G.R(22,30,20,10,'#ffffff',{r:3});drawChar(32,40,{g:'女',age:0,hair:'#3b2a1e',hs:0,skin:me.skin,top:'#ffd6e0',pants:'#ffd6e0',outfit:'onesie',acc:{},mood:'smile'},'sleep',t);if(k!=='birth')drawChar(12,46,me,'stand',t)}
  else if(['debut','buzz','f10k','f100k','f1m'].includes(k)){G.R(22,6,22,16,'#20232e',{r:2});G.R(24,8,18,12,'#9ff',{r:1});drawChar(32,47,me,'wave',t);if(k!=='debut')G.P(starPts(52,10,5),'#ffd700')}
  else if(k==='award'||k==='goal'){G.R(26,6,12,12,'#ffcf3f',{r:2});G.R(30,18,4,6,'#c9a227');drawChar(14,46,me,'wave',t)}
  else if(k==='shop'||k==='office'||k==='home'){G.R(18,14,30,26,'#efe6d8',{r:1});G.R(16,10,34,6,k==='shop'?'#ff6150':k==='office'?'#5c6bc0':'#8d6e63',{r:1});G.R(29,28,8,12,'#6d4c41');drawChar(54,46,me,'stand',t)}
  else if(k==='flame'){G.E(32,26,10,14,'#ff6150');G.E(32,30,6,8,'#ffcf3f');drawChar(54,46,me,'stand',t)}
  else drawChar(32,46,me,'wave',t)}
