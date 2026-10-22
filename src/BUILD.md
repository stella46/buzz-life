# ビルド手順（Buzz人生シミュレーター）
ソースは p1.html（画面とCSS）＋ p2〜p14.js（スクリプト）。この順でつなげて1枚のHTMLにする。

    { cat p1.html; echo '<script>'; cat p2.js p4.js p6.js p3.js p7.js p8.js p9.js p10.js p11.js p12.js p13.js p14.js; echo '</script>'; } > nipporia.html

- 後のファイルほど優先（同じ名前の function は後のものが使われる）
- p2：データ・基本の出来事 / p4：国・難易度・研究・まち・実績・BGM / p6：出来事（v0.2） / p3：エンジン・画面（v0.1） / p7：v0.2の差し替え / p8：v0.3（行動の中身・請求書・経営・5タブ） / p9：設定・削除・アップデート情報（CHANGELOG） / p10：セーブ保管・過去バージョン / p11：出来事（v0.4） / p12：子ども時代（v0.5） / p13：v0.6（人生の選択・目標・ファン層・アルバムほか） / p14：v0.7（時代・実際の出来事・会社・新しいまち・遊び方）

## 公開（GitHub Pages: stella46/buzz-life）
1. 新しい版の行を p9.js の CHANGELOG の先頭に追加（タイトルの版表示もここから出る）
2. ビルド → buzz-life/index.html は「PWA用head（manifest・アイコン）＋ nipporia.html の中身」
3. buzz-life/sw.js の CACHE 名を新しい版に変える
4. 前の版を残す：python3 tools/archive_version.py <前の版のcommit> <前の版> → p10.js の OLD_VERS に追加
5. テスト：node tools/migtest.js <新index> <古いversions/*/index.html（キー置換前のgit show版）>、自動プレイ
6. commit → push（1〜2分で反映）
