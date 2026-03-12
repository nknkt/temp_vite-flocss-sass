import { defineConfig } from 'vite'
import { viteStaticCopy } from 'vite-plugin-static-copy'
import { vitePluginWebp } from './plugins/vite-plugin-webp.js'
import { resolve } from 'path'
import { readdirSync, existsSync } from 'fs'

// src配下のindex.htmlを持つディレクトリを自動検出
const srcDir = resolve(import.meta.dirname, 'src')
const entries = {}

// src/index.html（メインエントリー）
if (existsSync(resolve(srcDir, 'index.html'))) {
  entries.main = resolve(srcDir, 'index.html')
}

// src/**/index.html（サブディレクトリ）
// assets, snippetsなどのリソースディレクトリは除外
const excludeDirs = ['assets', 'snippets']
readdirSync(srcDir, { withFileTypes: true })
  .filter(dirent => dirent.isDirectory() && !excludeDirs.includes(dirent.name))
  .forEach(dirent => {
    const indexPath = resolve(srcDir, dirent.name, 'index.html')
    if (existsSync(indexPath)) {
      entries[dirent.name] = indexPath
    }
  })

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    viteStaticCopy({
      targets: [
        {
          src: 'assets/images/*.{svg,gif,ico}',
          dest: 'assets/images',
        },

        {
          src: 'assets/videos/**/*',
          dest: 'assets/videos',
        },
      ],
    }),
    // ビルド時に画像をWebPに変換しHTMLのパスも書き換え
    vitePluginWebp({
      quality: 90, // JPEG用の品質 (1-100)
      lossless: { png: true, jpg: false }, // PNGはロスレス、JPEGは高品質圧縮
      enabled: true, // 有効/無効の切り替え
    }),
  ],
  // プロジェクト決定後、サブディレクトリ配置時は src内にディレクトリを作成し、rootを変更
  // 例: root: 'src/project-name', outDir: '../../dist'
  base: '/',
  root: 'src',
  css: {
    preprocessorOptions: {
      scss: {
        quietDeps: true,
      },
    },
  },
  build: {
    outDir: '../dist',
    copyPublicDir: false,
    rollupOptions: {
      input: entries,
      output: {
        assetFileNames: assetInfo => {
          if (assetInfo.name && assetInfo.name.endsWith('.css')) {
            return 'assets/css/[name][extname]';
          }
          if (assetInfo.name && /\.(png|jpe?g|svg|gif|webp|ico)$/.test(assetInfo.name)) {
            return 'assets/images/[name][extname]';
          }
          if (assetInfo.name && /\.(mp4|webm|mov|ogg|m4v)$/.test(assetInfo.name)) {
            return 'assets/videos/[name][extname]';
          }
          return 'assets/[name][extname]';
        },
        entryFileNames: 'assets/js/[name].js',
        chunkFileNames: 'assets/js/[name].js',
      },
    },
  },
  server: {
    port: 3000,
    open: true,
    hmr: {
      overlay: false, // エラーオーバーレイを無効化
    },
    watch: {
      ignored: ['**/node_modules/**', '**/plugins/**', '**/.git/**'],
    },
  },
});
