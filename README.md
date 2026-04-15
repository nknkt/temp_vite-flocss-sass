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

## PurgeCSS（未使用CSS削除）

ビルド時に未使用のCSSを自動削除してファイルサイズを削減できます。

### 有効化方法

`vite.config.js`の`PURGECSS_ENABLED`を`true`に変更：

```javascript
const PURGECSS_ENABLED = true  // PurgeCSSを有効化
```

### 効果

スケルトンテンプレートでの測定結果：
- **OFF**: 11.70 kB（gzip: 3.01 kB）
- **ON**: 10.24 kB（gzip: 2.56 kB）
- **削減量**: 約12.5%（gzipで15%削減）

大規模プロジェクトではより大きな効果が期待できます。

### 保護されるクラス（自動削除されない）

以下のパターンのクラスは自動的に保護されます：
- `js-*`：JavaScript用クラス（例: `js-hamburger`, `js-tab-content`）
- `is-*`：状態クラス（例: `is-active`, `is-open`, `is-hidden`）
- `has-*`：状態クラス（例: `has-error`, `has-children`）

### safelist設定のカスタマイズ

特定のクラスを保護したい場合は、`vite.config.js`の`PURGECSS_SAFELIST`に追加：

```javascript
const PURGECSS_SAFELIST = [
  /^js-/,                  // JS用クラス
  /^is-/,                  // 状態クラス
  /^has-/,                 // 状態クラス
  /^custom-/,              // カスタムクラス（例）
  'specific-class-name',   // 特定のクラス名（例）
]
```

### 注意点

- 動的に生成されるクラス名（`` `tab-${id}` ``など）は必ずsafelistに追加
- CSSフレームワーク（Tailwind, Bootstrap等）使用時は特に有効
- 小規模プロジェクトではデフォルトOFFを推奨

## 画像の遅延読み込み（Lazy Loading）

ビューポート外の画像を遅延読み込みすることで、初期ページ読み込みを高速化できます。

### 基本的な実装

HTML5の`loading="lazy"`属性を使用：

```html
<img src="./assets/images/sample.png" alt="説明" loading="lazy">
```

### 重要な注意点

以下の画像には`loading="lazy"`を**使用しないでください**：

1. **LCP（Largest Contentful Paint）画像**
   - ページの主要なメイン画像
   - ヒーローイメージ
   - これらには`fetchpriority="high"`を使用

```html
<!-- ❌ NG: LCP画像にlazyは使わない -->
<img src="./hero.png" alt="メインビジュアル" loading="lazy">

<!-- ✅ OK: LCP画像は優先読み込み -->
<img src="./hero.png" alt="メインビジュアル" fetchpriority="high">
```

2. **最初のビューポート内の画像**
   - ファーストビューで表示される画像
   - ヘッダーロゴ
   - アバウトセクションの画像（ページ上部の場合）

3. **小さなアイコン・ロゴ**
   - ファイルサイズが小さい画像は遅延読み込みしても効果が薄い

### 推奨される使い方

```html
<!-- ✅ ファーストビュー内：lazyなし -->
<header class="l-header">
  <img src="./logo.svg" alt="ロゴ" width="120" height="40">
</header>

<section class="hero">
  <img src="./hero.webp" alt="メインビジュアル" fetchpriority="high">
</section>

<!-- ✅ スクロール後のセクション：lazyを使う -->
<section class="features">
  <img src="./feature1.webp" alt="機能1" loading="lazy">
  <img src="./feature2.webp" alt="機能2" loading="lazy">
  <img src="./feature3.webp" alt="機能3" loading="lazy">
</section>
```

### srcset使用時

レスポンシブ画像でも同様に使用できます：

```html
<img
  srcset="./image-small.webp 400w, ./image-large.webp 800w"
  sizes="(max-width: 768px) 400px, 800px"
  src="./image-large.webp"
  alt="説明"
  loading="lazy"
>
```

### LCP画像の設定（index.html）

`src/index.html`の`<head>`にLCP画像のpreloadを設定：

```html
<!-- %LCP_SRC%をプロジェクトのLCP画像パスに置き換え -->
<link rel="preload" as="image" href="%LCP_SRC%" fetchpriority="high">
```

## Critical CSS（ファーストビュー用CSSの最適化）

Critical CSSは、ファーストビューのレンダリングに必要な最小限のCSSを`<head>`にインライン化し、残りのCSSを非同期で読み込む手法です。

### このテンプレートでの推奨

**小〜中規模プロジェクトでは不要です。**

理由：
- CSSが既に軽量（gzip 3KB）
- HTTP/2では並列ダウンロードが効率的
- インライン化によるHTMLサイズ増加のほうがデメリットになる場合がある

### 大規模プロジェクトでの導入

CSSが大きい場合（gzip 10KB以上）は検討価値があります。

#### 1. vite-plugin-critical を使用

```bash
pnpm add -D vite-plugin-critical
```

```javascript
// vite.config.js
import critical from 'vite-plugin-critical'

export default defineConfig({
  plugins: [
    critical({
      inline: true,
      dimensions: [
        { width: 375, height: 812 },  // スマホ
        { width: 1920, height: 1080 }, // PC
      ],
    }),
  ],
})
```

#### 2. 手動でCritical CSSを抽出

1. ビルド後のサイトをlocalhostで起動
2. Chrome DevToolsのCoverageタブでファーストビューで使用されるCSSを確認
3. 使用されるCSSを`<style>`タグで`<head>`にインライン化
4. 元のCSSファイルを`<link rel="preload" as="style">`で非同期読み込み

```html
<head>
  <!-- Critical CSS（インライン） -->
  <style>
    /* ファーストビューに必要な最小限のCSS */
    body { margin: 0; font-family: ... }
    .l-header { ... }
    .hero { ... }
  </style>

  <!-- 残りのCSSは非同期読み込み -->
  <link rel="preload" as="style" onload="this.rel='stylesheet'" href="./assets/css/main.css">
  <noscript>
    <link rel="stylesheet" href="./assets/css/main.css">
  </noscript>
</head>
```

### 効果測定

- LCP（Largest Contentful Paint）の改善
- FCP（First Contentful Paint）の改善
- Lighthouse Performanceスコアの向上

ただし、**HTMLサイズが増加する**ため、バランスを見て判断してください。

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
