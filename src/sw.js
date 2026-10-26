// Buzz人生シミュレーター：オフライン用（一度開いたファイルを端末に保存して、ネットがなくても動かす）
const CACHE='buzz-life-v3.4.2';
const CORE=['./','./index.html','./manifest.webmanifest','./icon-192.png','./icon-512.png','./apple-touch-icon.png','./logo.webp','./logo@2x.webp'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting()))});
const KEEP=['buzz-mode','buzz-pinned'];
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE&&!KEEP.includes(k)).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
// スマホのアプリで「オフライン」を選んだときは、更新せずに保存してある版を使う
async function netMode(){try{const c=await caches.open('buzz-mode');const r=await c.match('./__mode');return r?await r.text():'online'}catch(_){return 'online'}}
self.addEventListener('fetch',e=>{
  const req=e.request;if(req.method!=='GET')return;
  const url=new URL(req.url);
  const font=/fonts\.(googleapis|gstatic)\.com$/.test(url.hostname);
  if(url.origin!==location.origin&&!font)return;
  // ゲーム本体は「ネット優先・だめなら保存分」、フォントと画像は「保存分優先」
  if(req.mode==='navigate'||url.pathname.endsWith('.html')){
    // ページごとに保存する（過去のバージョンのページも、一度開けばオフラインで遊べる）
    const net=()=>fetch(req).then(r=>{if(r.ok){const cp=r.clone();caches.open(CACHE).then(c=>c.put(req,cp))}return r}).catch(()=>caches.match(req,{ignoreSearch:true}).then(h=>h||caches.match('./index.html')));
    e.respondWith(netMode().then(async m=>{if(m==='offline'){const p=await caches.open('buzz-pinned');const sc=new URL(self.registration.scope).pathname;const top=url.pathname===sc||url.pathname===sc+'index.html';const h=(top&&await p.match('./index.html'))||await caches.match(req,{ignoreSearch:true});if(h)return h}return net()}));return}
  e.respondWith(caches.match(req).then(hit=>hit||fetch(req).then(r=>{if(r.ok||r.type==='opaque'){const cp=r.clone();caches.open(CACHE).then(c=>c.put(req,cp))}return r})));
});
