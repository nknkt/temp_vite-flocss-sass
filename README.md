# temp_vite-flocss-sass

Vite + SCSS (FLOCSS) frontend template. Replace project-specific logos and meta information to reuse this template for a new project.

## Required initial steps

- Update `package.json` metadata (name, description, author, repository)
- Add or verify `LICENSE`
- Replace logos and OGP images in `src/assets/images/`
- Edit `src/styles/foundation/_variables.scss` to match the project design
- Prepare environment variables using `.env.example` as a reference

## Quick start (bash)

```bash
# Install Node (example using nvm)
nvm install 18
nvm use 18

# Install dependencies
npm install

# Start development server
npm run dev

# Build
npm run build

# Preview build output
npm run preview

# Lint / Format (auto-fix is a separate command)
npm run lint
npm run format

# Optional: image conversion (requires scripts/convert-images.js)
npm run webp
```

## Template variables

`src/index.html` contains placeholders that should be replaced per project. Main placeholders:

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

Replace them manually or use an `.env`-based replacement script.

## OGP画像について

プロジェクト開始時にOGP画像を作成してください。

### 必要な画像

#### og.png または og.jpg
- **サイズ**: 1200x630px（推奨）
- **用途**: Facebook、LinkedIn、Twitter等のOGP画像
- **フォーマット**: PNG または JPG
- **配置場所**: `src/assets/images/og.png`
- **注意**: 自動WebP変換から除外されます

### WebP変換の除外設定

`vite.config.js`の`WEBP_EXCLUDE`に以下のパターンが設定されています：

```javascript
const WEBP_EXCLUDE = [
  'og.png',              // OG画像
  'og.jpg',              // OG画像
  'og-*.png',            // og-で始まる画像（PNG）
  'og-*.jpg',            // og-で始まる画像（JPG）
  'ogp*.png',            // ogpで始まる画像（PNG）
  'ogp*.jpg',            // ogpで始まる画像（JPG）
]
```

### 推奨サイズとクロップエリア
- テキストや重要な要素は中央600x600pxの領域に配置
- 上下左右に余白を持たせる（端が切れる可能性を考慮）
- ファイルサイズは300KB以下を推奨

### デザイン時の注意点
- ブランドカラーを使用
- サイト名またはロゴを配置
- キャッチコピーを大きく見やすく
- 背景はシンプルに
- テキストは読みやすいコントラストで

### HTMLでの使用例

```html
<!-- OGP -->
<meta property="og:image" content="./assets/images/og.png">

<!-- Twitter Card -->
<meta name="twitter:image" content="./assets/images/og.png">
```

## プロジェクト固有コンテンツの置き換え

このテンプレートには、サンプルプロジェクトの内容が含まれています。新規プロジェクトで使用する際は、以下を置き換えてください。

### 1. HTMLコンテンツ（`src/index.html`）

以下のダミーテキストを実際のプロジェクト内容に置き換え：
- ヘッダーロゴ：`<img src="./assets/images/logo.svg">`
- メインタイトル：「製品名・サービス名をここに記載」
- 説明文：「製品・サービスに関する説明文をここに記載します...」
- フッター：「Copyright (C) 2024 COMPANY NAME...」

### 2. SCSSファイル

以下のファイルにサンプルプロジェクトのクラスが含まれています：
- `src/assets/styles/object/project/_about.scss`
  - クラス名を変更またはファイルを削除して新規作成
- `src/assets/styles/object/project/_search.scss`
  - クラス名を変更またはファイルを削除して新規作成

### 3. 画像ファイル（`src/assets/images/`）

サンプルプロジェクトの画像は削除し、新規プロジェクトの画像に置き換えてください：
- `logo.svg`：ブランドロゴ
- `og.png`：OGP画像（1200x630px）
- その他必要な画像を追加

### 4. JavaScriptモジュール

`src/assets/scripts/modules/` 内のサンプルモジュールを確認：
- 不要なモジュールは削除
- 必要に応じて新規作成

### 5. データファイル

`src/assets/scripts/data/` に配置されるJSONファイルは、プロジェクトに応じて作成してください。
