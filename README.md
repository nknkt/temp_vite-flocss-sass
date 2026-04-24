# temp_vite-flocss-sass

Vite + SCSS（FLOCSS）のフロントエンドスターターテンプレートです。
新規プロジェクト開始時はこのテンプレートを複製し、プロジェクト固有の設定・素材を差し替えてください。

## 技術スタック

| カテゴリ | 採用技術 |
| --- | --- |
| ビルドツール | Vite 6 |
| CSS | SCSS（FLOCSS アーキテクチャ） |
| JavaScript | Vanilla JS（ES Modules） |
| パッケージマネージャー | pnpm |
| スムーズスクロール | Lenis |
| Lint / Format | ESLint / Stylelint / Prettier / html-validate |

---

## セットアップ

```fish
# Node.js >= 18 が必要
node -v

# 依存関係のインストール
pnpm install
```

---

## コマンド

```fish
pnpm dev        # 開発サーバー起動（自動でブラウザを開く）
pnpm build      # プロダクションビルド
pnpm preview    # ビルド結果のプレビュー

pnpm fix        # Lint + Format（自動修正）
pnpm check      # Lint + Format（チェックのみ）
pnpm watch      # Lint + Format のウォッチモード
```

---

## ディレクトリ構成

```
src/
├── index.ejs
├── {page}/
│   └── index.ejs           # 下層ページ（自動検出・エントリー登録）
└── assets/
    ├── images/
    ├── videos/
    ├── includes/            # SSI パーシャル（header, footer など）
    ├── partials/            # EJS パーシャル（include() で使用）
    ├── scripts/
    │   ├── pages/           # ページごとのエントリーJS
    │   └── modules/
    │       ├── utils/       # 汎用モジュール
    │       └── optional/    # オプションモジュール（必要に応じて使用）
    └── styles/              # SCSS（FLOCSS 構成）
        ├── common.scss      # 全ページ共通エントリー
        ├── foundation/
        ├── global/          # 変数・mixin
        ├── layout/
        ├── object/
        │   ├── components/
        │   ├── project/
        │   ├── utility/
        │   └── pages/       # ページ固有スタイル
        │       └── {page}/
        │           └── _index.scss
        └── vendors/
```

---

## 主な機能

### SSI（Server Side Includes）

開発時は SSI コメントをインライン展開します。
ビルド時はコメントをそのまま残し、Apache SSI がサーバー側で処理します。

```html
<!-- トップページ（../なし） -->
<!--#include file="assets/includes/header.html" -->

<!-- 下層ページ（../あり → virtual= を使用） -->
<!--#include virtual="../assets/includes/header.html" -->
```

> Apache SSI の `file=` は `../` によるディレクトリ上位への参照が禁止されているため、
> 下層ページでは必ず `virtual=` を使用してください。

パスは **HTMLファイルからの相対パス** で記述します。

### EJS

ページファイル（`.ejs`）および `assets/includes/` 内のパーシャルで EJS 構文が使えます。
`vite-plugin-ssi.js` に EJS レンダリングが統合されており、外部ライブラリの追加設定は不要です。

#### ファイルの役割

| ディレクトリ | 用途 |
| --- | --- |
| `src/` / `src/{page}/` | ページファイル（ビルドエントリー） |
| `assets/includes/` | SSI でインクルードするパーシャル。EJS 構文も使用可 |
| `assets/partials/` | EJS の `include()` で使うパーシャル。ビルド対象外 |

`assets/partials/` のファイルは `include()` の引数にパスと変数を渡して呼び出します。
ページファイルからは `./assets/partials/`、`assets/includes/` 内からは `../partials/` の相対パスで指定します。

#### dev / build の動作

| タイミング | 動作 |
| --- | --- |
| `pnpm dev` | ミドルウェアが `.ejs` をその場でレンダリング → SSI 展開 → HMR 注入。中間ファイルなし |
| `pnpm build` | `buildStart` で `.ejs` → `.html` を一時生成 → Vite ビルド → `closeBundle` で削除 |

`src/` に `.html` ファイルは存在しません。編集するのは常に `.ejs` ファイルです。

#### SSI との使い分け

| | SSI `<!--#include -->` | EJS `<%- include() %>` |
| --- | --- | --- |
| 展開タイミング | Apache（実行時） | Vite（dev / build 時） |
| build 後の出力 | コメントがそのまま残る | HTML にインライン展開 |
| 本番サーバー要件 | Apache + SSI 設定が必要 | 不要 |
| 主な用途 | header / footer など共通パーシャル | SVG Symbols・ナビリストなど |

### CSS / JS のビルド分割

ビルド後は以下の構成で出力されます。

```
dist/assets/
├── styles/
│   ├── common.css    # 全ページ共通CSS
│   └── {page}.css    # ページ固有CSS
└── scripts/
    ├── common.js     # 全ページ共通JS（Lenis 等の vendor を含む）
    └── {page}.js     # ページ固有JS
```

ページ固有の JS エントリー（`scripts/pages/{page}.js`）で `common.js` と ページ固有 SCSS を import します。

```javascript
// scripts/pages/hoge.js
import '../common.js'
import '../../styles/object/pages/hoge/_index.scss'
```

共通スタイル・スクリプトを変更した場合は `common.css` / `common.js` のみ再アップロードすれば済みます。

### 画像の自動 WebP 変換

ビルド時に PNG / JPEG を WebP に変換し、HTML 内のパスも自動で書き換えます。
OGP 画像など変換から除外したいファイルは `vite.config.js` の `WEBP_EXCLUDE` に追加してください。

```javascript
const WEBP_EXCLUDE = [
  'og.png',
]
```

### 下層ページの自動エントリー登録

`src/{ディレクトリ}/index.ejs`（または `index.html`）が存在すれば自動でビルドエントリーに追加されます。
`assets` / `snippets` ディレクトリは除外されます。

### PurgeCSS（デフォルト OFF）

未使用 CSS を削除してファイルサイズを削減します。大規模プロジェクトで有効化を推奨します。

```javascript
// vite.config.js
const PURGECSS_ENABLED = true
```

`js-*` / `is-*` / `has-*` のクラスは自動で保護されます。

---

## JavaScript モジュール

### utils（汎用）

| ファイル | 概要 |
| --- | --- |
| `_Accordion.js` | アコーディオン |
| `_AnchorScroll.js` | アンカースクロール |
| `_HamburgerMenu.js` | ハンバーガーメニュー |
| `_HeaderScroll.js` | スクロール時ヘッダー制御 |
| `_LoadingAnimation.js` | ローディングアニメーション |
| `_PageTop.js` | ページトップボタン |
| `_ScrollActive.js` | スクロール位置によるクラス付与 |
| `_SubMenu.js` | サブメニュー |

### optional（必要に応じて使用）

| ファイル | 概要 |
| --- | --- |
| `_BasicSlider.js` | 基本スライダー（Splide） |
| `_GSAPHorizontalScroll.js` | GSAP 横スクロール |
| `_HorizontalScroll.js` | 横スクロール |
| `_HueRotate.js` | 色相アニメーション |
| `_Modal.js` | モーダル |
| `_ParallaxScroll.js` | パララックス |
| `_ScrollBackgroundScale.js` | スクロール連動背景スケール |
| `_ScrollImageExpand.js` | スクロール連動画像拡大 |
| `_ScrollImageSwitcher.js` | スクロール連動画像切り替え |
| `_ScrollTextReveal.js` | テキストリビール |

---

## 新規プロジェクト開始時のチェックリスト

- [ ] `package.json` のメタ情報を更新（name / description / author / repository）
- [ ] `LICENSE` を更新
- [ ] `src/assets/images/` のロゴ・OGP 画像を差し替え（OGP: 1200×630px）
- [ ] `src/assets/styles/global/_variables.scss` をプロジェクトに合わせて更新
- [ ] `src/index.ejs` のプレースホルダーを置き換え（`%TITLE%` / `%URL%` など）
- [ ] `vite.config.js` の `BASE_PATH` を確認（サブディレクトリ配置時は変更）
- [ ] 不要な optional モジュールを削除

---

## テンプレート変数

HTML 内のプレースホルダーは手動またはスクリプトで置き換えてください。

| 変数 | 用途 |
| --- | --- |
| `%TITLE%` | ページタイトル |
| `%DESCRIPTION%` | メタディスクリプション |
| `%URL%` | 正規 URL |
| `%SITE_NAME%` | サイト名 |
| `%LCP_SRC%` | LCP 画像のパス（preload 用） |

---

## ライセンス

MIT
