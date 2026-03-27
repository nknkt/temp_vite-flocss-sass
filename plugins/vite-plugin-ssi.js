import { readFileSync, existsSync } from 'fs'
import { resolve } from 'path'

/**
 * Vite SSI プラグイン
 *
 * 開発時: <!--#include file="assets/includes/xxx.html" --> をインライン展開 + HMR対応
 * ビルド時: SSIコメントをそのまま残す（Apache SSI がサーバー側で処理）
 *
 * .htaccess に以下の設定が必要:
 *   Options +Includes
 *   AddOutputFilter INCLUDES .html
 */
export function vitePluginSsi() {
  let root = ''
  let isBuild = false

  return {
    name: 'vite-plugin-ssi',
    enforce: 'pre',

    configResolved(config) {
      root = config.root
      isBuild = config.command === 'build'
    },

    transformIndexHtml(html) {
      // ビルド時はSSIコメントをそのまま残す
      if (isBuild) return html

      return html.replace(
        /<!--#include\s+file="([^"]+)"\s*-->/g,
        (match, filePath) => {
          const absolutePath = resolve(root, filePath)
          if (existsSync(absolutePath)) {
            return readFileSync(absolutePath, 'utf-8')
          }
          console.warn(`[vite-plugin-ssi] File not found: ${absolutePath}`)
          return match
        }
      )
    },

    // 開発サーバー: assets/includes/ を監視してフルリロード
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
