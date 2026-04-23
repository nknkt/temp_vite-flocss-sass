/**
 * Vite Script To Body プラグイン
 *
 * ビルド時: Viteが<head>に挿入するscriptタグを</body>直前に移動する
 * これによりCSSの<link>がscriptより先に来てFOUCを防ぐ
 */
export default function vitePluginScriptToBody() {
  return {
    name: 'vite-plugin-script-to-body',
    enforce: 'post',
    apply: 'build',

    transformIndexHtml(html) {
      // headから scriptタグを抜き出す
      const scriptTags = []
      const cleaned = html.replace(/<script\b[^>]*>[^<]*<\/script>/gi, (match) => {
        scriptTags.push(match)
        return ''
      })

      if (scriptTags.length === 0) return html

      // </body>直前に挿入
      return cleaned.replace('</body>', `${scriptTags.join('\n    ')}\n  </body>`)
    },
  }
}
