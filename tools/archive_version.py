#!/usr/bin/env python3
"""過去の版を versions/<ver>/index.html として保存する。
使い方: python3 tools/archive_version.py <git-commit> <ver>   例: python3 tools/archive_version.py 0ad5db8 v0.3
- セーブ・実績のキーを版ごとに分ける（今のデータと混ざらないように）
- PWAのmanifest登録を外し、アイコンは最新版のものを参照
- 画面の上に「過去のバージョン」の帯と「最新版に戻る」リンクを入れる
"""
import subprocess, sys, re, pathlib
commit, ver = sys.argv[1], sys.argv[2]
html = subprocess.check_output(['git', 'show', f'{commit}:index.html']).decode('utf-8')
n1 = html.count("save:'nipporia-save-v1'")
html = html.replace("save:'nipporia-save-v1'", f"save:'nipporia-save-v1@{ver}'")
html = html.replace("'nipporia-meta-v1'", f"'nipporia-meta-v1@{ver}'")
html = html.replace("'nipporia-save-backup'", f"'nipporia-save-backup@{ver}'").replace("'nipporia-ver-last'", f"'nipporia-ver-last@{ver}'").replace("'nipporia-ver-seen'", f"'nipporia-ver-seen@{ver}'")
html = re.sub(r'<link rel="manifest"[^>]*>\n?', '', html)
html = html.replace('href="icon-192.png"', 'href="../../icon-192.png"').replace('href="apple-touch-icon.png"', 'href="../../apple-touch-icon.png"')
banner = (f'<div style="position:relative;z-index:40;background:#ffcf3f;color:#2b2000;font:14px/1.5 system-ui,sans-serif;'
          f'padding:8px max(16px,env(safe-area-inset-left,0px));text-align:center">これは過去のバージョン {ver} です（セーブは最新版とは別に保存されます）'
          f' ／ <a href="../../" style="color:#2b2000;font-weight:bold">最新版に戻る</a></div>\n')
html = html.replace('<body>\n', '<body>\n' + banner, 1)
out = pathlib.Path('versions') / ver / 'index.html'
out.parent.mkdir(parents=True, exist_ok=True)
out.write_text(html, encoding='utf-8')
print(f'{out} を作成（セーブキー置換 {n1} 箇所）')
