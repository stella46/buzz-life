// Buzz人生シミュレーター：感想の受け取り口（Googleスプレッドシート用）
// ゲームの「感想・不具合を送る」から届いた内容を「生データ」シートに1件1行で書きます。
// 同じ人が「直して送り直す」と、同じ番号の行が新しい内容に置きかわります（訂正回数が増えます）。
// 「集計」シートでは、チェックされた項目の数を自動で数えます。
// 「まとめ（Claude）」シートは、Claude がまとめを書くための場所です。

const HEAD = ['受け取った日時', '番号', '訂正回数', '名前', '楽しさ(1-5)',
  'よかった（チェック）', 'よかった（自由記入）',
  'わかりにくい・不満（チェック）', 'わかりにくい・不満（自由記入）',
  'バグ（チェック）', 'バグの画面', 'バグ（自由記入）',
  'ほしい（チェック）', 'ほしい（自由記入）', 'そのほか', '版', '端末・状況', '送られた文章そのまま'];
const KEYS = ['id', 'rev', 'name', 'star', 'good_c', 'good_t', 'bad_c', 'bad_t', 'bug_c', 'bug_s', 'bug_t', 'want_c', 'want_t', 'other', 'ver', 'env', 'text'];

const ITEMS = {
  'よかった': [6, ['BGM・音', 'ドット絵・見た目', 'SNSで伸ばすのが楽しい', 'お店・会社の経営', 'まちづくり', '恋愛・家族', '出来事（イベント）', '時代・世代交代', '研究・スキル']],
  'わかりにくい・不満': [8, ['操作がわかりにくい', '説明が足りない', '字やボタンが小さい', 'テンポが遅い', 'お金のバランス', '同じ出来事が多い', '何をすればいいかわからない', 'バージョンの切り替え']],
  'バグ': [10, ['画面が止まる・進まない', 'ボタンが押せない', '数字がおかしい', '表示が崩れる・はみ出す', 'セーブがおかしい・消えた', '音がおかしい']],
  'バグの画面': [11, ['タイトル', '予定', '発信', 'お金', '事業', '人生', '出来事の画面']],
  'ほしい': [13, ['もっと出来事', 'もっと職業', 'もっとお店・建物', '友達と競えるもの', 'やりこみ要素', 'わかりやすい説明']]
};

// はじめに1回だけ実行する
function setup() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const raw = ss.getSheetByName('生データ') || ss.insertSheet('生データ');
  raw.getRange(1, 1, 1, HEAD.length).setValues([HEAD]).setFontWeight('bold').setBackground('#fde7ef');
  raw.setFrozenRows(1);
  raw.setColumnWidths(6, 12, 220);
  raw.getRange('A:R').setWrap(true).setVerticalAlignment('top');

  const ag = ss.getSheetByName('集計') || ss.insertSheet('集計');
  ag.clear();
  const rows = [['項目', '数'], ['感想の件数', "=MAX(0,COUNTA('生データ'!B:B)-1)"], ['楽しさの平均', "=IFERROR(ROUND(AVERAGE('生データ'!E2:E),1),\"-\")"], ['', '']];
  const col = n => String.fromCharCode(64 + n);
  for (const [group, [c, list]] of Object.entries(ITEMS)) {
    rows.push(['■ ' + group, '']);
    for (const it of list) rows.push([it, `=COUNTIF('生データ'!${col(c)}:${col(c)},"*${it}*")`]);
    rows.push(['', '']);
  }
  ag.getRange(1, 1, rows.length, 2).setValues(rows);
  ag.getRange('A1:B1').setFontWeight('bold');
  ag.setColumnWidth(1, 260);

  const sm = ss.getSheetByName('まとめ（Claude）') || ss.insertSheet('まとめ（Claude）');
  if (!sm.getRange('A1').getValue()) sm.getRange('A1').setValue('ここに Claude が感想のまとめを書きます');
  const first = ss.getSheetByName('シート1') || ss.getSheetByName('Sheet1');
  if (first && first.getLastRow() === 0 && ss.getSheets().length > 3) ss.deleteSheet(first);
}

// ゲームから届いたときに動く
function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const d = JSON.parse(e.postData.contents);
    if (!/^[A-Z0-9]{4,8}$/.test(String(d.id || ''))) return out('bad id');
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sh = ss.getSheetByName('生データ');
    if (!sh) { setup(); sh = ss.getSheetByName('生データ'); }
    const row = [new Date()].concat(KEYS.map(k => clean(d[k])));
    const n = sh.getLastRow();
    const ids = n > 1 ? sh.getRange(2, 2, n - 1, 1).getValues().map(r => String(r[0])) : [];
    const i = ids.indexOf(String(d.id));
    if (i >= 0) sh.getRange(i + 2, 1, 1, row.length).setValues([row]);
    else sh.appendRow(row);
    return out('ok');
  } catch (err) {
    return out('error');
  } finally {
    lock.releaseLock();
  }
}

// 文字を整える（長すぎる文と、数式として読まれる書き出しを防ぐ）
function clean(v) {
  if (v === undefined || v === null) return '';
  if (typeof v === 'number') return v;
  let s = String(v).slice(0, 3000);
  if (/^[=+\-@]/.test(s)) s = "'" + s;
  return s;
}
function out(t) { return ContentService.createTextOutput(t); }
