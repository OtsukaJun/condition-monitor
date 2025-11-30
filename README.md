# 日常英単語アプリ

500問の日常英単語を学習できるWebアプリケーションです。

## 特徴

- 500問の英単語問題（CSV形式から自動生成）
- サーバー不要で動作（file://で直接開けます）
- 学習結果の表示（正答数、解答時間、達成率など）
- ランダムな応援メッセージ
- ローカルストレージで日次の学習記録を保存

## 使い方

1. `index.html` をブラウザで開く
2. 「はじめる」ボタンをクリック
3. 英単語の意味を4つの選択肢から選ぶ
4. 「学習結果を見る」ボタンで結果を確認

## ファイル構成

```
├── index.html              # メインHTMLファイル
├── style.css              # スタイルシート
├── app.js                 # アプリケーションロジック
├── vocabulary_data.js     # 英単語データ（500問）
├── english_quiz_500.csv   # 英単語データのCSV形式（元データ）
└── convert_csv.js         # CSV→JavaScript変換スクリプト
```

## 開発者向け

### 英単語データの更新方法

1. `english_quiz_500.csv` を編集
2. 以下のコマンドでJavaScriptファイルに変換：
   ```bash
   node convert_csv.js
   ```
3. `vocabulary_data.js` が自動生成されます

### CSVフォーマット

```csv
ID,Question(English),Choice1,Choice2,Choice3,Choice4,CorrectOption
1,stay up late,見てみる・チェックする,（用紙に）書き込む,夜更かしする,〜に頼る・依存する,3
```

- `CorrectOption`: 正解の選択肢番号（1〜4）

## GitHub での共有

このプロジェクトはサーバー不要で動作するため、GitHub Pagesで簡単に公開できます：

1. GitHubリポジトリを作成
2. ファイルをプッシュ
3. Settings → Pages で公開設定
4. `https://[username].github.io/[repository-name]/` でアクセス可能

## ライセンス

自由に使用・改変・配布してください。

