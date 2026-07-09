import { readFileSync, existsSync } from 'fs'
import { resolve, dirname } from 'path'

/**
 * Vite SSI プラグイン
 *
 * 開発時: <!--#include file="assets/includes/xxx.html" --> を再帰的にインライン展開 + HMR対応
 * ビルド時: SSIコメントをそのまま残す（Apache SSI がサーバー側で処理）
 *
 * .htaccess に以下の設定が必要:
 *   Options +Includes
 *   AddOutputFilter INCLUDES .html
 */
export default function vitePluginSsi() {
  let root = ''
  let isBuild = false

  // SSI インクルードを再帰展開（dev のみ）
  function expandSSI(html, baseDir) {
    return html.replace(
      /<!--#include\s+(?:file|virtual)="([^"]+)"\s*-->/g,
      (match, filePath) => {
        const absolutePath = filePath.startsWith('/')
          ? resolve(root, filePath.slice(1))
          : resolve(baseDir, filePath)

        if (!existsSync(absolutePath)) {
          console.warn(`[vite-plugin-ssi] File not found: ${absolutePath}`)
          return match
        }

        const content = readFileSync(absolutePath, 'utf-8')
        return expandSSI(content, dirname(absolutePath))
      }
    )
  }

  return {
    name: 'vite-plugin-ssi',
    enforce: 'pre',

    configResolved(config) {
      root = config.root
      isBuild = config.command === 'build'
    },

    transformIndexHtml(html, ctx) {
      // ビルド時はSSIコメントをそのまま残す
      if (isBuild) return html

      const htmlDir = resolve(ctx.filename, '..')
      return expandSSI(html, htmlDir)
    },

    configureServer(server) {
      const includesDir = resolve(root, 'assets/includes')
      server.watcher.add(includesDir)
      server.watcher.on('change', (file) => {
        if (file.includes('assets/includes')) {
          server.ws.send({ type: 'full-reload' })
        }
      })
    },
  }
}
