# JR東海IPC meets Creator
## Vite + Sass Starter (Template)

このリポジトリは、Vite と Sass（SCSS）を使ったフロントエンドのテンプレートです。
案件ごとに差し替える箇所を明確にし、再利用できる状態に整理しています。

最初にやること（必須）

- `package.json` のメタデータ（`name`, `description`, `author`, `repository`）を更新
- `LICENSE` を追加（必要なら別ライセンスへ変更）
- `src/assets/images/` の案件固有ロゴ・画像を差し替え
- `src/styles/foundation/_variables.scss` をプロジェクトのデザインに合わせて編集
- `.env.example` を用意して環境変数の取り扱いを明確化

よく使うコマンド

```fish
# Node のインストール (例: nvm を使う場合)
nvm install 18
nvm use 18

# 依存をインストール
npm install

# 開発サーバー
npm run dev

# ビルド
npm run build

# プレビュー（ビルド結果を確認）
npm run preview

# Lint / Format
npm run lint
npm run format

# 画像変換 (scripts/convert-images.js を使用)
npm run webp
```

テンプレート化チェックリスト

1. package.json のプロジェクト情報を更新 — Done: 基本的なテンプレ化済み
2. README をプロジェクト用に書き換える — Done: このファイル
3. LICENSE を追加（MIT を推奨） — Added in this repo
4. `.env.example` を追加 — Added in this repo
5. assets の整理：不要画像削除 or examples フォルダへ移動
6. CI / 実行スクリプト（必要なら GitHub Actions 等）を追加

次のステップ

1. LICENSE と `.env.example` を追加しました（リポジトリに追記します）。
2. assets の案件固有ファイルを検出してリスト化します（自動で移動/削除も可能）。
3. `src/index.html` の案件固有な文言とリンクの抽出・プレースホルダ化を提案します。

必要な作業を指定してください：

- 「assets の削除/移動を自動でやってほしい」
- 「README をさらに拡張してテンプレ手順を作りたい」
- 「package.json の script を整理してほしい」
- 「CI (GitHub Actions) のテンプレを追加してほしい」

上記いずれかを指定すると具体的に変更を適用します。

テンプレート変数一覧

このテンプレートでは以下のプレースホルダを `src/index.html` に用意しています。新しいプロジェクトを作成する際はこれらを実際の値に置換してください。

- %SITE_TITLE% - ページのタイトル
- %SITE_DESCRIPTION% - meta description
- %OG_TITLE% - Open Graph タイトル
- %OG_DESCRIPTION% - Open Graph 説明
- %OG_IMAGE% - Open Graph 画像 URL
- %SITE_URL% - サイトの公開 URL
- %OG_SITE_NAME% - OG のサイト名
- %FAVICON_URL% - favicon の URL
- %SHOP_URL% - サイトのショップベース URL（元: shop.jtadirect.com）
- %INQUIRY_URL% - 問い合わせフォームの URL（外部）
- %PROJECT_NAME% - 表示用プロジェクト名（例: MEETS CREATOR）
- %PROJECT_BRAND% - ブランド名（例: JTA DIRECT）
# temp_vite-flocss-sass

Vite + SCSS (FLOCSS) のフロントエンドテンプレートです。新しい案件で再利用しやすいように構成・スタイル設計・ビルド設定をまとめています。

## 目的

- 最小限の設定で Vite 開発サーバーが動くこと
- FLOCSS 構造に沿った SCSS のサンプル
- 画像アセットやテンプレート変数を差し替えるだけで使えるようにする

## すぐに試す（fish シェル向け）

```fish
# Node を用意（例: nvm）
nvm install 18
nvm use 18

# 依存をインストール
npm install

# 開発サーバー起動
npm run dev

# ビルド
npm run build

# ビルド結果を確認
npm run preview

# Lint / Format
npm run lint
npm run format
```

## 追加したファイル

- `.env.example` — 環境変数サンプル（テンプレート変数を管理する場合に使用）

## テンプレート変数

`src/index.html` にはプロジェクトごとに置換すべきプレースホルダがあります。主なものは以下です。

- %SITE_TITLE%
- %SITE_DESCRIPTION%
- %OG_TITLE%
- %OG_DESCRIPTION%
- %OG_IMAGE%
- %SITE_URL%
- %OG_SITE_NAME%
- %FAVICON_URL%
- %SHOP_URL%
- %INQUIRY_URL%
- %PROJECT_NAME%
- %PROJECT_BRAND%
- %BRAND_NAME%
- %COMPANY_URL%
- %COMPANY_NAME%

手動で置換するか、`.env` と置換スクリプトで運用してください。

## 今回行った変更（コミットはしていません）

1. `package.json` の `name` をテンプレ名からリポジトリ名へ変更
2. `package.json` の `repository.url` をリポジトリ実体（GitHub: nknkt/temp_vite-flocss-sass）へ変更
3. `.env.example` を追加
4. README をプロジェクト向けに整理

---

変更内容を確認してからコミットするか、さらに編集する旨を教えてください。
