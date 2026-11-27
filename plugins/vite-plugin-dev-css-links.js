/**
 * 開発時: JS からの CSS/SCSS import を無効化し、HTML の <link> 経由だけにする
 * （DevTools でインライン注入とソースマップの二重表示を避ける）
 *
 * ビルド時: このプラグインは動かない。JS import で common / ページ CSS を分割出力する
 */
export default function vitePluginDevCssLinks() {
  return {
    name: 'vite-plugin-dev-css-links',
    apply: 'serve',
    enforce: 'pre',

    transform(code, id) {
      if (id.includes('node_modules')) return null
      if (!/\.[cm]?[jt]sx?$/.test(id.split('?')[0])) return null

      const next = code.replace(
        /^import\s+['"][^'"]+\.(?:css|scss|sass)['"]\s*;?\s*$/gm,
        ''
      )

      if (next === code) return null
      return { code: next, map: null }
    },
  }
}
