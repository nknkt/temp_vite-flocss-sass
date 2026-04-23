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
├── index.html
├── {page}/
│   └── index.html          # 下層ページ（自動検出・エントリー登録）
└── assets/
    ├── images/
    ├── videos/
    ├── includes/            # SSI パーシャル（header, footer など）
    ├── scripts/
    │   ├── pages/           # ページごとのエントリーJS
    │   └── modules/
    │       ├── utils/       # 汎用モジュール
    │       └── optional/    # オプションモジュール（必要に応じて使用）
    └── styles/              # SCSS（FLOCSS 構成）
        ├── foundation/
        ├── global/          # 変数・mixin
        ├── layout/
        ├── object/
        │   ├── components/
        │   ├── project/
        │   └── utility/
        └── vendors/
```

---

## 主な機能

### SSI（Server Side Includes）

開発時は `<!--#include file="..." -->` をインライン展開します。
ビルド時はコメントをそのまま残し、Apache SSI がサーバー側で処理します。

```html
<!--#include file="assets/includes/header.html" -->
```

パスは **HTMLファイルからの相対パス** で記述します。

### 画像の自動 WebP 変換

ビルド時に PNG / JPEG を WebP に変換し、HTML 内のパスも自動で書き換えます。
OGP 画像など変換から除外したいファイルは `vite.config.js` の `WEBP_EXCLUDE` に追加してください。

```javascript
const WEBP_EXCLUDE = [
  'og.png',
]
```

### 下層ページの自動エントリー登録

`src/{ディレクトリ}/index.html` が存在すれば自動でビルドエントリーに追加されます。
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
- [ ] `src/index.html` のプレースホルダーを置き換え（`%TITLE%` / `%URL%` など）
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
