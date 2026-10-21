// 古いセーブの読み込みテスト
// 使い方: node tools/migtest.js <新しい版のindex.html> <古い版のindex.html>...
// 古い版で一生の途中まで遊んだセーブを作り、新しい版で読み込んで遊び続けられるか確かめる
const { chromium } = require('playwright');
const path = require('path');
(async () => {
  const [newer, ...olds] = process.argv.slice(2);
  const b = await chromium.launch({ executablePath: process.env.CHROME || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  let fail = 0;
  for (const old of olds) for (const scenario of ['young', 'adult', 'old', 'endless']) {
    const ctx = await b.newContext();
    const p1 = await ctx.newPage(); const e1 = []; p1.on('pageerror', e => e1.push(e.message));
    await p1.goto('file://' + path.resolve(old));
    const save = await p1.evaluate((sc) => {
      render = function () { }; pop = function () { }; sndOn = false; try { bgmOn = false } catch (e) { } toast = function () { };
      const target = { young: 15, adult: 35, old: 70, endless: 45 }[sc];
      newGame(sc === 'endless' ? { stage: 'nipporia', endless: 1 } : { stage: 'nipporia' });
      let it = 0;
      while (S && S.alive && Math.floor(S.am / 12) < target && it < 3000) {
        it++;
        if (modalOpen()) { if (curEv) choose(Math.floor(Math.random() * curEv.chs.length)); const ok = document.querySelector('[data-act="evok"]'); if (ok) evOk(); else if (modalOpen() && !curEv) closeModal(); continue }
        S.auto = 1;
        try { if (S.town && Math.floor(S.am / 12) >= 18) { const i = S.town.tiles.findIndex(t => t.t === 'empty'); if (i >= 0 && S.money > 3000000) { S.money -= 500000; S.town.tiles[i] = { t: 'stall', lv: 1 } } } } catch (e) { }
        turn();
      }
      if (!S || !S.alive) return null;
      save(); return localStorage.getItem(CFG.save);
    }, scenario);
    await p1.close();
    if (!save) { console.log(`  ${path.basename(path.dirname(old))}/${scenario}: 途中で寿命が来たのでスキップ`); await ctx.close(); continue }
    const p2 = await ctx.newPage(); const e2 = []; p2.on('pageerror', e => e2.push(e.message));
    await p2.goto('file://' + path.resolve(newer));
    const res = await p2.evaluate((sv) => {
      localStorage.setItem(CFG.save, sv);
      const o = loadSaved(); if (!o) return { ok: false, why: 'loadSavedがnull' };
      S = o; showScreen('game'); setTab('act'); render();
      sndOn = false; try { bgmOn = false } catch (e) { } toast = function () { }; pop = function () { };
      let it = 0; const start = S.am;
      while (S && S.alive && it < 400) {
        it++;
        if (modalOpen()) { if (curEv) choose(Math.floor(Math.random() * curEv.chs.length)); const ok = document.querySelector('[data-act="evok"]'); if (ok) evOk(); else if (modalOpen() && !curEv) closeModal(); continue }
        S.auto = 1; if (it % 3 === 0 && typeof payAll === 'function') payAll();
        if (it % 50 === 0) for (const tb of ['act', 'sns', 'money', 'biz', 'life']) { setTab(tb); if (typeof SUB !== 'undefined') for (const s of ({ money: ['bills', 'shop', 'bank'], biz: ['town', 'shop', 'office', 'res'], life: ['stat', 'ppl', 'rec'] }[tb] || [])) { SUB[tb] = s; renderPanel() } }
        turn();
      }
      const bad = ['money', 'debt', 'inv'].filter(k => S && !Number.isFinite(S[k]));
      return { ok: bad.length === 0, months: S ? S.am - start : 0, bad };
    }, save);
    const errs = e1.concat(e2);
    const ok = res.ok && errs.length === 0;
    if (!ok) fail++;
    console.log(`  ${path.basename(path.dirname(old))}/${scenario}: ${ok ? 'OK' : 'NG'}（新しい版で${res.months}か月遊べた）${res.why || ''}${res.bad && res.bad.length ? ' 値が壊れた:' + res.bad : ''}${errs.length ? ' エラー:' + errs.slice(0, 3).join(' / ') : ''}`);
    await ctx.close();
  }
  await b.close();
  console.log(fail ? `NG ${fail}件` : 'すべてOK');
  process.exit(fail ? 1 : 0);
})();
