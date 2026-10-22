// ===== v1.0：サウンドの一新（切りかえ式）。曲も効果音も、すべてこの場でつくるオリジナル =====
var MUS_OPT={classic:{n:'クラシック',d:'今までの6曲'},chip:{n:'1 本格チップチューン',d:'ドラム・ベース・残響つきのピコピコ音。場面で曲が変わる'},era:{n:'2 時代で変わる',d:'昭和は歌謡曲風、平成はJ-POP風、令和はlo-fi、未来はシンセウェーブ'},scene:{n:'3 場面で変わる',d:'子ども時代・学校・ふだん・仕事・悲しいとき・老後…で曲が変わる'},both:{n:'2＋3 時代×場面',d:'時代の音色で、場面ごとの曲が流れる（おすすめ）'}};
var MUS='both',SEK='new',AMB=1;
try{const v=localStorage.getItem('buzz-music');if(v&&MUS_OPT[v])MUS=v;const s2=localStorage.getItem('buzz-se');if(s2)SEK=s2;const a2=localStorage.getItem('buzz-amb');if(a2!=null)AMB=+a2}catch(_){}

function eraKey(){const y=S?S.y:CFG.start;return y<1989?'showa':y<2019?'heisei':y<2035?'reiwa':'future'}
function sceneKeyM(){if(!$('#scrTitle').hidden||!S)return 'title';if(!$('#scrEnd').hidden)return 'ending';const a=age();
  if(a<6)return 'baby';if(a<13)return 'child';if(a<18)return 'teen';if(a>=65)return 'elder';
  if(S.p.mental<28||S.p.happy<25)return 'sad';if(a>=20&&(anyShop()||(S.cos||[]).length||(S.office&&S.office.lv)))return 'work';return 'adult'}
function musicKey(){const sc=sceneKeyM(),er=eraKey();
  if(MUS==='chip')return ['chip',sc];if(MUS==='scene')return ['pop',sc];
  if(MUS==='era')return [er,['title','ending','baby'].includes(sc)?sc:'era_'+er];return [er,sc]}

// ----- 曲の設計（気分ごと） -----
const PIECES={
  title:{bpm:128,mode:'maj',root:'C',prog:['I','V','vi','IV'],den:.7,dr:'pop'},
  baby:{bpm:90,mode:'maj',root:'F',prog:['I','IV','I','V'],den:.4,dr:'none'},
  child:{bpm:116,mode:'maj',root:'G',prog:['I','vi','IV','V'],den:.65,dr:'pop'},
  teen:{bpm:126,mode:'maj',root:'D',prog:['vi','IV','I','V'],den:.7,dr:'pop'},
  adult:{bpm:104,mode:'maj',root:'A',prog:['I','V','vi','iii','IV','I','IV','V'],den:.55,dr:'pop'},
  work:{bpm:120,mode:'maj',root:'E',prog:['IV','V','iii','vi'],den:.65,dr:'drive'},
  sad:{bpm:72,mode:'min',root:'A',prog:['i','VI','III','VII'],den:.35,dr:'none'},
  elder:{bpm:84,mode:'maj',root:'D',prog:['I','iii','IV','V'],den:.45,dr:'soft'},
  ending:{bpm:70,mode:'maj',root:'C',prog:['I','vi','IV','V','I','IV','I','V'],den:.4,dr:'none'},
  era_showa:{bpm:100,mode:'min',root:'D',prog:['i','iv','V','i','VI','iv','V','i'],den:.55,dr:'soft'},
  era_heisei:{bpm:130,mode:'maj',root:'B',prog:['IV','V','iii','vi'],den:.7,dr:'drive'},
  era_reiwa:{bpm:82,mode:'maj',root:'F',prog:['ii','V','I','vi'],den:.45,dr:'lofi'},
  era_future:{bpm:116,mode:'min',root:'E',prog:['i','VI','III','VII'],den:.6,dr:'drive'}
};
// 音色のセット
const KITS={
  chip:{lead:'square',leadV:.16,bass:'triangle',bassV:.5,pad:null,arp:'square',arpV:.06,rev:.12,lp:0,vib:0,swing:0,drum:'chip',crackle:0},
  pop:{lead:'triangle',leadV:.36,lead2:'sine',bass:'sine',bassV:.6,pad:'sawtooth',padV:.035,padLp:1400,arp:null,rev:.25,lp:0,vib:.004,swing:0,drum:'std',crackle:0},
  showa:{lead:'sawtooth',leadV:.09,leadLp:2200,bass:'triangle',bassV:.55,pad:'triangle',padV:.06,arp:null,rev:.35,lp:0,vib:.012,swing:.18,drum:'brush',crackle:.3},
  heisei:{lead:'square',leadV:.12,lead2:'sawtooth',bass:'sawtooth',bassV:.18,bassLp:900,pad:'sawtooth',padV:.025,padLp:2000,arp:'square',arpV:.04,rev:.2,lp:0,vib:.005,swing:0,drum:'std',crackle:0},
  reiwa:{lead:'sine',leadV:.32,bass:'sine',bassV:.6,pad:'triangle',padV:.09,arp:null,rev:.3,lp:2300,vib:.003,swing:.22,drum:'lofi',crackle:1},
  future:{lead:'sawtooth',leadV:.08,leadLp:3000,lead2:'sawtooth',bass:'sawtooth',bassV:.2,bassLp:700,pad:'sawtooth',padV:.04,padLp:1600,arp:'sawtooth',arpV:.035,rev:.45,lp:0,vib:.003,swing:0,drum:'gate',crackle:0}
};
const SCALE={maj:[0,2,4,5,7,9,11],min:[0,2,3,5,7,8,10]};
const ROMAN={i:0,ii:1,iii:2,iv:3,v:4,vi:5,vii:6};
function degOf(r){return ROMAN[r.toLowerCase().replace(/[^iv]/g,'')]||0}
const midiOf=(root,oct)=>NOTE_I[root]+(oct+1)*12;
const mf=n=>440*Math.pow(2,(n-69)/12);
function compose(pkey,kkey){const P=PIECES[pkey]||PIECES.adult,K=KITS[kkey]||KITS.pop;const rnd=mulberry32((pkey+kkey).split('').reduce((a,c)=>a*31+c.charCodeAt(0)|0,11));
  const sc=SCALE[P.mode],base=midiOf(P.root,4),bars=8,ev=[];const prog=[];for(let b=0;b<bars;b++)prog.push(P.prog[b%P.prog.length]);
  const chordNotes=(deg,o)=>[0,2,4].map(i=>{const k=deg+i;return base+o*12+sc[k%7]+Math.floor(k/7)*12});
  const toScale=(n)=>{let best=n,bd=99;for(let o=-2;o<=2;o++)for(const s of sc){const c=base+o*12+s;if(Math.abs(c-n)<bd){bd=Math.abs(c-n);best=c}}return best};
  // メロディ（A A' B A''）
  let last=base+12;const motif=[];
  for(let b=0;b<2;b++){const steps=[];for(let s=0;s<16;s+=2){if(s===0||rnd()<P.den)steps.push(s)}motif.push(steps)}
  for(let b=0;b<bars;b++){const deg=degOf(prog[b]),ct=chordNotes(deg,1),src=motif[b%2],sec=Math.floor(b/2);
    const steps=sec===2?src.filter((s,i)=>i%2===0||rnd()<.5):src;
    steps.forEach((s,i)=>{let n;if(s%8===0)n=ct.reduce((a,c)=>Math.abs(c-last)<Math.abs(a-last)?c:a,ct[0]);else n=toScale(last+(rnd()<.5?-2:2)*(rnd()<.3?2:1));
      if(sec===3&&b===bars-1&&i===steps.length-1)n=ct[0];n=Math.max(base+5,Math.min(base+26,n));last=n;const nx=steps[i+1]!=null?steps[i+1]:16;ev.push({s:b*16+s,l:Math.max(1,Math.min(4,nx-s)),n,v:'lead'})})}
  // ベース・コード・アルペジオ
  for(let b=0;b<bars;b++){const deg=degOf(prog[b]),ct=chordNotes(deg,0),root=ct[0]-12;
    if(kkey==='future'){for(let s=0;s<16;s+=2)ev.push({s:b*16+s,l:1,n:root-(s%4?0:12)+12,v:'bass'})}
    else if(kkey==='reiwa'||kkey==='showa'){ev.push({s:b*16,l:6,n:root,v:'bass'});ev.push({s:b*16+10,l:4,n:root+(kkey==='showa'?7:0),v:'bass'})}
    else if(kkey==='chip'){for(let s=0;s<16;s+=4)ev.push({s:b*16+s,l:2,n:root+(s%8?12:0),v:'bass'})}
    else{ev.push({s:b*16,l:4,n:root,v:'bass'});ev.push({s:b*16+8,l:4,n:root,v:'bass'});ev.push({s:b*16+14,l:2,n:root+7,v:'bass'})}
    if(K.pad)ev.push({s:b*16,l:16,ns:ct.map(n=>n-12+(kkey==='reiwa'?12:0)).concat(kkey==='reiwa'?[ct[0]+11-12+12]:[]),v:'pad'});
    if(K.arp&&P.dr!=='none'){for(let s=0;s<16;s+=kkey==='future'?1:2)ev.push({s:b*16+s,l:1,n:ct[s%3]+12,v:'arp'})}
    // ドラム
    const dk=P.dr==='none'?'none':K.drum;
    if(dk!=='none'){for(let s=0;s<16;s++){const st=b*16+s;
      if(dk==='chip'||dk==='std'||dk==='gate'){if(s===0||s===8||(P.dr==='drive'&&(s===6||s===10)))ev.push({s:st,v:'kick'});if(s===4||s===12)ev.push({s:st,v:'snare'});if(s%2===0)ev.push({s:st,v:'hat'})}
      else if(dk==='lofi'){if(s===0||s===7||s===10)ev.push({s:st,v:'kick'});if(s===4||s===12)ev.push({s:st,v:'snare'});if(s%2===0)ev.push({s:st,v:'hat',soft:1})}
      else if(dk==='brush'){if(s===0||s===8)ev.push({s:st,v:'kick',soft:1});if(s%4===2)ev.push({s:st,v:'brush'})}
      else if(dk==='soft'||P.dr==='soft'){if(s===0)ev.push({s:st,v:'kick',soft:1});if(s===8)ev.push({s:st,v:'brush'})}}}}
  ev.sort((a,b)=>a.s-b.s);return {ev,total:bars*16,bpm:P.bpm,K}}

let REVB=null,CRACK=null;
function reverbNode(){if(REVB)return REVB;const len=AC.sampleRate*1.8,b=AC.createBuffer(2,len,AC.sampleRate);for(let c=0;c<2;c++){const d=b.getChannelData(c);for(let i=0;i<len;i++)d[i]=(Math.random()*2-1)*Math.pow(1-i/len,2.6)}REVB=b;return b}
function bgmPlayGen(kkey,pkey){const key=kkey+'/'+pkey;if(!bgmOn){bgmStop();return}if(bgmCur===key)return;
  try{AC=AC||new (window.AudioContext||window.webkitAudioContext)()}catch(e){return}if(AC.state==='suspended')AC.resume().catch(()=>{});
  bgmStop();bgmCur=key;if(!noiseBuf){noiseBuf=AC.createBuffer(1,AC.sampleRate*.5,AC.sampleRate);const d=noiseBuf.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=Math.random()*2-1}
  const song=compose(pkey,kkey),K=song.K,sd=60/song.bpm/4;
  const TRIM={chip:1,pop:.68,showa:.95,heisei:1.5,reiwa:.92,future:1.55};const master=AC.createGain();master.gain.value=.11*VOL.bgm*(TRIM[kkey]||1);let out=master;
  if(K.lp){const f=AC.createBiquadFilter();f.type='lowpass';f.frequency.value=K.lp;f.connect(master);out=f}
  master.connect(AC.destination);
  const dry=AC.createGain();dry.connect(out);const wet=AC.createGain();wet.gain.value=K.rev;const cv=AC.createConvolver();cv.buffer=reverbNode();wet.connect(cv);cv.connect(out);
  const bus={dry,wet};
  if(K.crackle){const src=AC.createBufferSource();src.buffer=noiseBuf;src.loop=true;const hp=AC.createBiquadFilter();hp.type='highpass';hp.frequency.value=3000;const g=AC.createGain();g.gain.value=.012*K.crackle;src.connect(hp);hp.connect(g);g.connect(master);src.start();bus.crk=src}
  let t0=AC.currentTime+.1,idx=0;const ev=song.ev,total=song.total;
  BG={master,crk:bus.crk,timer:setInterval(()=>{if(!AC)return;const nowA=AC.currentTime;if(t0+total*sd<nowA-1){t0=nowA+.05;idx=0}
    for(let g=0;g<300;g++){if(idx>=ev.length){idx=0;t0+=total*sd}const e=ev[idx];let t=t0+e.s*sd;if(K.swing&&e.s%2===1)t+=sd*K.swing;if(t>nowA+.3)break;if(t>=nowA-.02)voice(e,t,sd,bus,K);idx++}},60)}}
function voice(e,t,sd,bus,K){const v=e.v;
  if(v==='kick'){const o=AC.createOscillator(),g=AC.createGain();o.type='sine';o.frequency.setValueAtTime(K.drum==='chip'?180:130,t);o.frequency.exponentialRampToValueAtTime(42,t+.12);g.gain.setValueAtTime(e.soft?.35:.8,t);g.gain.exponentialRampToValueAtTime(.001,t+.18);o.connect(g);g.connect(bus.dry);o.start(t);o.stop(t+.2);return}
  if(v==='snare'||v==='hat'||v==='brush'){const s=AC.createBufferSource();s.buffer=noiseBuf;const f=AC.createBiquadFilter(),g=AC.createGain();
    if(v==='hat'){f.type='highpass';f.frequency.value=K.drum==='lofi'?5000:7500;g.gain.setValueAtTime(e.soft?.07:.12,t);g.gain.exponentialRampToValueAtTime(.001,t+.04)}
    else if(v==='brush'){f.type='bandpass';f.frequency.value=3000;g.gain.setValueAtTime(.08,t);g.gain.linearRampToValueAtTime(.001,t+.18)}
    else{f.type=K.drum==='lofi'?'lowpass':'bandpass';f.frequency.value=K.drum==='lofi'?2500:1800;const dur=K.drum==='gate'?.22:.14;g.gain.setValueAtTime(.35,t);if(K.drum==='gate'){g.gain.setValueAtTime(.3,t+dur*.9);g.gain.linearRampToValueAtTime(.001,t+dur)}else g.gain.exponentialRampToValueAtTime(.001,t+dur)}
    s.connect(f);f.connect(g);g.connect(bus.dry);if(v==='snare'){const w=AC.createGain();w.gain.value=.5;g.connect(w);w.connect(bus.wet)}s.start(t,Math.random()*.3);s.stop(t+.3);return}
  const d=(e.l||1)*sd,g=AC.createGain();let dest=g;
  if(v==='pad'){const lp=AC.createBiquadFilter();lp.type='lowpass';lp.frequency.value=K.padLp||1800;g.connect(lp);lp.connect(bus.dry);lp.connect(bus.wet);
    const vv=K.padV||.04;g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(vv,t+Math.min(.4,d*.3));g.gain.setValueAtTime(vv,t+d*.8);g.gain.linearRampToValueAtTime(.0001,t+d);
    for(const n of e.ns){for(const det of (K.pad==='sawtooth'?[-6,6]:[0])){const o=AC.createOscillator();o.type=K.pad;o.frequency.value=mf(n);o.detune.value=det;o.connect(g);o.start(t);o.stop(t+d+.05)}}return}
  let vol=v==='bass'?K.bassV:v==='arp'?K.arpV:K.leadV,wave=v==='bass'?K.bass:v==='arp'?K.arp:K.lead;
  const lpF=v==='bass'?K.bassLp:v==='lead'?K.leadLp:0;if(lpF){const f=AC.createBiquadFilter();f.type='lowpass';f.frequency.value=lpF;g.connect(f);dest=f}
  dest.connect(bus.dry);if(v!=='bass'){const sw=AC.createGain();sw.gain.value=v==='lead'?.6:.4;dest.connect(sw);sw.connect(bus.wet)}
  const atk=K===KITS.reiwa||K===KITS.pop&&v==='lead'?.008:.005;g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(vol,t+atk);
  if(K===KITS.pop&&v==='lead'||K===KITS.reiwa){g.gain.exponentialRampToValueAtTime(vol*.3,t+Math.min(d,.35));g.gain.exponentialRampToValueAtTime(.0005,t+d*.98)}
  else{g.gain.setValueAtTime(vol*.85,t+Math.max(.02,d*.6));g.gain.exponentialRampToValueAtTime(.0005,t+d*.95)}
  const waves=[wave];if(v==='lead'&&K.lead2)waves.push(K.lead2);
  for(const [wi,w] of waves.entries()){const o=AC.createOscillator();o.type=w;o.frequency.value=mf(e.n)*(wi?1.003:1);
    if(K.vib&&v==='lead'&&d>.2){const lfo=AC.createOscillator(),lg=AC.createGain();lfo.frequency.value=5.5;lg.gain.value=mf(e.n)*K.vib;lfo.connect(lg);lg.connect(o.frequency);lfo.start(t+.08);lfo.stop(t+d)}
    if(K===KITS.reiwa&&v!=='bass'){const o2=AC.createOscillator(),g2=AC.createGain();o2.type='sine';o2.frequency.value=mf(e.n)*2;g2.gain.value=.25;o2.connect(g2);g2.connect(g);o2.start(t);o2.stop(t+d)}
    o.connect(g);o.start(t);o.stop(t+d)}}
function bgmStop(){if(BG.timer)clearInterval(BG.timer);if(BG.crk)try{BG.crk.stop()}catch(_){}if(BG.master&&AC){const m=BG.master;try{m.gain.setTargetAtTime(0,AC.currentTime,.08)}catch(e){}setTimeout(()=>{try{m.disconnect()}catch(e){}},500)}BG={};bgmCur=null}
function bgmUpdate(){if(!bgmOn){bgmStop();return}if(!AC&&!bgmUser)return;if(MUS==='classic'){if(bgmCur&&bgmCur.includes('/'))bgmStop();bgmPlay(bgmWanted());return}const [k,p]=musicKey();bgmPlayGen(k,p)}
setInterval(()=>{try{if(bgmUser&&bgmOn)bgmUpdate();ambUpdate()}catch(_){}},2500);

// ----- 効果音（新しい） -----
function snd(type){if(SEK==='classic')return sndClassic(type);if(!sndOn||VOL.se<=0)return;try{AC=AC||new (window.AudioContext||window.webkitAudioContext)()}catch(e){return}
  const t0=AC.currentTime+.01,out=AC.createGain();out.gain.value=.12*VOL.se;out.connect(AC.destination);
  const tone=(f,t,d,w,v,glide)=>{const o=AC.createOscillator(),g=AC.createGain();o.type=w||'sine';o.frequency.setValueAtTime(f,t);if(glide)o.frequency.exponentialRampToValueAtTime(glide,t+d);g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(v||.6,t+.006);g.gain.exponentialRampToValueAtTime(.0005,t+d);o.connect(g);g.connect(out);o.start(t);o.stop(t+d+.02)};
  const bell=(f,t,d,v)=>{tone(f,t,d,'sine',v||.5);tone(f*2.01,t,d*.6,'sine',(v||.5)*.35);tone(f*3.02,t,d*.3,'triangle',(v||.5)*.15)};
  const noise=(t,d,ft,ff,v)=>{if(!noiseBuf)return;const s=AC.createBufferSource();s.buffer=noiseBuf;const f=AC.createBiquadFilter();f.type=ft;f.frequency.value=ff;const g=AC.createGain();g.gain.setValueAtTime(v,t);g.gain.exponentialRampToValueAtTime(.001,t+d);s.connect(f);f.connect(g);g.connect(out);s.start(t);s.stop(t+d+.02)};
  if(!noiseBuf){noiseBuf=AC.createBuffer(1,AC.sampleRate*.5,AC.sampleRate);const d=noiseBuf.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=Math.random()*2-1}
  switch(type){
    case 'click':tone(1200,t0,.04,'sine',.35,900);break;
    case 'coin':bell(1568,t0,.18);bell(2093,t0+.07,.3);break;
    case 'buy':bell(1047,t0,.12,.4);bell(1319,t0+.06,.12,.4);bell(1568,t0+.12,.28,.45);break;
    case 'buzz':[523,659,784,1047,1319].forEach((f,i)=>bell(f,t0+i*.06,.35,.45));noise(t0+.3,.5,'highpass',6000,.25);break;
    case 'flame':noise(t0,.7,'lowpass',500,.8);tone(220,t0,.5,'sawtooth',.25,110);tone(233,t0+.25,.5,'sawtooth',.2,116);break;
    case 'ev':bell(880,t0,.25,.4);bell(1175,t0+.1,.4,.4);break;
    case 'bad':tone(330,t0,.25,'triangle',.5,262);tone(247,t0+.18,.4,'triangle',.5,196);break;
    case 'end':[523,659,784,1047].forEach((f,i)=>bell(f,t0+i*.25,1.2,.35));break;
    default:tone(800,t0,.06,'sine',.3)}}

// ----- 環境音 -----
let AMBN=null,AMBK='';
function ambUpdate(){const want=(AMB&&bgmUser&&S&&!$('#scrGame').hidden&&sceneStyle()!=='classic'&&VOL.bgm>0)?ambKind():'';if(want===AMBK)return;AMBK=want;
  if(AMBN){try{AMBN.g.gain.setTargetAtTime(0,AC.currentTime,.3);const n=AMBN;setTimeout(()=>{try{n.src.stop();n.g.disconnect()}catch(_){}},1500)}catch(_){}AMBN=null}
  if(!want||!AC)return;if(!noiseBuf)return;const src=AC.createBufferSource();src.buffer=noiseBuf;src.loop=true;const f=AC.createBiquadFilter(),g=AC.createGain();
  if(want==='rain'){f.type='bandpass';f.frequency.value=1800;f.Q.value=.4;g.gain.value=0}else if(want==='city'){f.type='lowpass';f.frequency.value=380;g.gain.value=0}else{f.type='highpass';f.frequency.value=9000;g.gain.value=0}
  src.connect(f);f.connect(g);g.connect(AC.destination);src.start();g.gain.setTargetAtTime((want==='rain'?.09:want==='city'?.12:.015)*VOL.bgm,AC.currentTime,.6);AMBN={src,g}}
function ambKind(){const m=sceneModel();if(m.w==='rain')return 'rain';if(['office','cafe','shop','class'].includes(m.loc))return 'city';if(['park','base'].includes(m.loc))return 'air';return ''}
