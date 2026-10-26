
// ===== v3.0.17：セーブが残らない場所で開いているときは、お知らせする =====
(function(){let ok=true,why='';try{const k='nipporia-test';localStorage.setItem(k,'1');if(localStorage.getItem(k)!=='1')ok=false;localStorage.removeItem(k)}catch(e){ok=false;why=e.name}
 let framed=false;try{framed=window.self!==window.top}catch(_){framed=true}
 const host=location.hostname,prot=location.protocol;const official=/stella46\.github\.io$/.test(host)||prot==='file:'||host==='localhost'||host==='127.0.0.1';
 if(ok&&!framed&&official)return;
 const msg=!ok?'このページでは、セーブを保存できません（ブラウザの設定やプライベートモードの可能性があります）。':framed?'ほかのページの中で開いているため、リロードするとセーブが消えることがあります。':'このアドレスでは、セーブが残らないことがあります。';
 const d=document.createElement('div');d.className='savewarn';d.style.cssText='position:relative;z-index:41;background:#ff9f43;color:#2b1600;font:14px/1.5 system-ui,sans-serif;padding:8px 16px;text-align:center';
 d.innerHTML=`⚠️ ${msg} <a href="https://stella46.github.io/buzz-life/" target="_blank" rel="noopener" style="color:#2b1600;font-weight:bold">こちらで開いてください</a>`;document.body.prepend(d)})();
