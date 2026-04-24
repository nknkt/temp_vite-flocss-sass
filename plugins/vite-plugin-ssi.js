import ejs from 'ejs'
import { readFileSync, writeFileSync, unlinkSync, existsSync, readdirSync } from 'fs'
import { resolve, join, dirname } from 'path'

/**
 * Vite EJS + SSI プラグイン
 *
 * 開発時: .ejs をその場でレンダリング + SSI をインライン展開 + HMR対応
 * ビルド時: buildStart で .ejs → .html を一時生成 → SSI コメントは保持（Apache SSI が処理）
 *           closeBundle で一時 .html を削除
 *
 * .htaccess に以下の設定が必要:
 *   Options +Includes
 *   AddOutputFilter INCLUDES .html
 */
export default function vitePluginSsi() {
  let root = ''
  let isBuild = false
  const generatedFiles = []

  // SSI インクルードを再帰展開（dev のみ）
  function expandSSI(html, baseDir) {
    return html.replace(
      /<!--#include\s+(?:file|virtual)="([^"]+)"\s*-->/g,
      (match, filePath) => {
        const absolutePath = filePath.startsWith('/')
          ? resolve(root, filePath.slice(1))
          : resolve(baseDir, filePath)

        // .html が見つからなければ .ejs を試みる
        let targetPath = absolutePath
        if (!existsSync(targetPath) && targetPath.endsWith('.html')) {
          const ejsPath = targetPath.replace(/\.html$/, '.ejs')
          if (existsSync(ejsPath)) targetPath = ejsPath
        }

        if (!existsSync(targetPath)) {
          console.warn(`[vite-plugin-ssi] File not found: ${absolutePath}`)
          return match
        }

        let content = readFileSync(targetPath, 'utf-8')
        if (targetPath.endsWith('.ejs')) {
          content = ejs.render(content, {}, { filename: targetPath })
        }
        return expandSSI(content, dirname(targetPath))
      }
    )
  }

  // src/ 配下の .ejs を再帰収集（assets/partials/ はパーシャルなので除外）
  function findEjsFiles(dir) {
    const results = []
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const fullPath = join(dir, entry.name)
      if (entry.isDirectory()) {
        // partials/ はコンパイル対象外
        if (fullPath === join(root, 'assets/partials')) continue
        results.push(...findEjsFiles(fullPath))
      } else if (entry.name.endsWith('.ejs')) {
        results.push(fullPath)
      }
    }
    return results
  }

  return {
    name: 'vite-plugin-ejs-ssi',
    enforce: 'pre',

    configResolved(config) {
      root = config.root
      isBuild = config.command === 'build'
    },

    // ビルド時: .ejs → .html を一時生成（Vite のエントリー処理前に実行）
    buildStart() {
      if (!isBuild) return
      for (const ejsPath of findEjsFiles(root)) {
        const htmlPath = ejsPath.replace(/\.ejs$/, '.html')
        const template = readFileSync(ejsPath, 'utf-8')
        const html = ejs.render(template, {}, { filename: ejsPath })
        writeFileSync(htmlPath, html, 'utf-8')
        generatedFiles.push(htmlPath)
        const rel = ejsPath.replace(root + '/', '')
        console.log(`[ejs] ${rel} → ${rel.replace(/\.ejs$/, '.html')}`)
      }
    },

    // ビルド後: 一時 .html を削除
    closeBundle() {
      if (!isBuild) return
      for (const file of generatedFiles) {
        try { unlinkSync(file) } catch {}
      }
      generatedFiles.length = 0
    },

    // ビルド時は SSI コメントをそのまま残す（dev は middleware で処理済み）
    transformIndexHtml(html) {
      return html
    },

    configureServer(server) {
      // .ejs リクエストを EJS レンダリング + SSI 展開して返す
      server.middlewares.use(async (req, res, next) => {
        // ベースパスを除去して URL を正規化
        const base = server.config.base ?? '/'
        const baseNoTrail = base === '/' ? '' : base.slice(0, -1)
        let url = req.url?.split('?')[0] ?? ''
        if (baseNoTrail && url.startsWith(baseNoTrail)) {
          url = url.slice(baseNoTrail.length) || '/'
        }
        if (url.endsWith('/')) url += 'index.html'
        if (!url.endsWith('.html')) return next()

        const ejsAbsPath = resolve(root, url.slice(1)).replace(/\.html$/, '.ejs')
        if (!existsSync(ejsAbsPath)) return next()

        try {
          const template = readFileSync(ejsAbsPath, 'utf-8')
          let html = ejs.render(template, {}, { filename: ejsAbsPath })
          html = expandSSI(html, dirname(ejsAbsPath))
          // Vite の HTML トランスフォーム（HMR スクリプト注入など）を適用
          html = await server.transformIndexHtml(url, html)
          res.setHeader('Content-Type', 'text/html; charset=utf-8')
          res.end(html)
        } catch (err) {
          next(err)
        }
      })

      // .ejs 変更時にフルリロード（includes/ と partials/ 両方対応）
      const partialsDir = resolve(root, 'assets/partials')
      server.watcher.add(partialsDir)
      server.watcher.on('change', (file) => {
        if (file.endsWith('.ejs')) {
          server.ws.send({ type: 'full-reload' })
        }
      })
    },
  }
}
