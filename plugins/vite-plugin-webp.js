import sharp from 'sharp'
import { readdir, stat, unlink, readFile, writeFile } from 'fs/promises'
import path from 'path'
import { existsSync } from 'fs'

const SUPPORTED_FORMATS = ['.jpg', '.jpeg', '.png']
const WEBP_QUALITY = 90

export function vitePluginWebp(options = {}) {
  const {
    quality = WEBP_QUALITY,
    lossless = { png: true, jpg: false },
    enabled = true,
  } = options

  let config
  let isBuild = false

  return {
    name: 'vite-plugin-webp',
    apply: 'build',
    enforce: 'post', // vite-plugin-static-copyの後に実行

    configResolved(resolvedConfig) {
      config = resolvedConfig
      isBuild = resolvedConfig.command === 'build'
    },

    async writeBundle() {
      if (!isBuild || !enabled) return

      // 絶対パスを解決
      const outDir = path.isAbsolute(config.build.outDir)
        ? config.build.outDir
        : path.resolve(config.root || process.cwd(), config.build.outDir)

      console.log('🚀 Starting WebP conversion...')
      console.log('📂 Output directory:', outDir)

      // すべての assets/images ディレクトリを検索して変換
      const imagesDirs = await findAllImagesDirectories(outDir)
      console.log('📁 Found image directories:', imagesDirs)
      for (const imagesDir of imagesDirs) {
        console.log('🔄 Processing directory:', imagesDir)
        await convertDirectory(imagesDir, quality, lossless)
      }

      // HTMLファイルのパスを書き換え
      await replaceHtmlPaths(outDir)

      // CSSファイルのパスを書き換え
      await replaceCssPaths(outDir)

      console.log('✨ WebP conversion completed!')
    },
  }
}

async function convertToWebP(filePath, quality, lossless) {
  try {
    const parsedPath = path.parse(filePath)
    const outputPath = path.join(parsedPath.dir, `${parsedPath.name}.webp`)

    const ext = parsedPath.ext.toLowerCase()

    // sharpでファイルを読み込む前に検証
    let pipeline
    try {
      pipeline = sharp(filePath)
      // メタデータの取得でファイルの有効性をチェック
      await pipeline.metadata()
      pipeline = sharp(filePath) // メタデータ取得後に再度インスタンス化
    } catch (readError) {
      console.error(`  ⚠️ Skipping corrupted file: ${path.basename(filePath)}`)
      return
    }

    if (ext === '.png' && lossless.png) {
      pipeline = pipeline.webp({ lossless: true })
    } else {
      pipeline = pipeline.webp({ quality })
    }

    await pipeline.toFile(outputPath)

    // 元画像を削除
    await unlink(filePath)

    console.log(`  ✅ ${path.basename(filePath)} → ${path.basename(outputPath)}`)
  } catch (error) {
    console.error(`  ❌ Failed: ${path.basename(filePath)}`, error.message)
    throw error
  }
}

async function convertDirectory(dirPath, quality, lossless) {
  try {
    const entries = await readdir(dirPath)

    for (const entry of entries) {
      const fullPath = path.join(dirPath, entry)
      const stats = await stat(fullPath)

      if (stats.isDirectory()) {
        await convertDirectory(fullPath, quality, lossless)
      } else if (stats.isFile()) {
        const ext = path.extname(fullPath).toLowerCase()
        if (SUPPORTED_FORMATS.includes(ext)) {
          await convertToWebP(fullPath, quality, lossless)
        }
      }
    }
  } catch (error) {
    console.error(`Error processing directory ${dirPath}:`, error.message)
  }
}

async function replaceHtmlPaths(outDir) {
  try {
    const htmlFiles = await findHtmlFiles(outDir)

    for (const htmlFile of htmlFiles) {
      let html = await readFile(htmlFile, 'utf-8')

      // imgタグのsrc属性
      html = html.replace(
        /(<img[^>]+src=["'])([^"']+)\.(jpg|jpeg|png)(["'][^>]*>)/gi,
        (match, before, imgPath, ext, after) => {
          return `${before}${imgPath}.webp${after}`
        }
      )

      // srcset属性
      html = html.replace(/srcset=["']([^"']+)["']/gi, (match, srcset) => {
        const webpSrcset = srcset.replace(
          /([^\s,]+)\.(jpg|jpeg|png)/gi,
          (imgPath, path, ext) => {
            return imgPath.replace(/\.(jpg|jpeg|png)$/i, '.webp')
          }
        )
        return `srcset="${webpSrcset}"`
      })

      // CSSのbackground-image
      html = html.replace(
        /url\(["']?([^"')]+)\.(jpg|jpeg|png)["']?\)/gi,
        (match, imgPath, ext) => {
          return `url("${imgPath}.webp")`
        }
      )

      await writeFile(htmlFile, html, 'utf-8')
      console.log(`  📝 Updated: ${path.basename(htmlFile)}`)
    }
  } catch (error) {
    console.error('Error replacing HTML paths:', error.message)
  }
}

async function replaceCssPaths(outDir) {
  try {
    const cssFiles = await findCssFiles(outDir)

    for (const cssFile of cssFiles) {
      let css = await readFile(cssFile, 'utf-8')

      // CSSのurl()内の画像パスを置換
      css = css.replace(
        /url\(["']?([^"')]+)\.(jpg|jpeg|png)["']?\)/gi,
        (match, imgPath, ext) => {
          return `url("${imgPath}.webp")`
        }
      )

      await writeFile(cssFile, css, 'utf-8')
      console.log(`  📝 Updated CSS: ${path.basename(cssFile)}`)
    }
  } catch (error) {
    console.error('Error replacing CSS paths:', error.message)
  }
}

async function findHtmlFiles(dir) {
  const htmlFiles = []
  const entries = await readdir(dir, { withFileTypes: true })

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name)

    if (entry.isDirectory()) {
      htmlFiles.push(...(await findHtmlFiles(fullPath)))
    } else if (entry.isFile() && entry.name.endsWith('.html')) {
      htmlFiles.push(fullPath)
    }
  }

  return htmlFiles
}

async function findCssFiles(dir) {
  const cssFiles = []
  const entries = await readdir(dir, { withFileTypes: true })

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name)

    if (entry.isDirectory()) {
      cssFiles.push(...(await findCssFiles(fullPath)))
    } else if (entry.isFile() && entry.name.endsWith('.css')) {
      cssFiles.push(fullPath)
    }
  }

  return cssFiles
}

// すべての assets/images ディレクトリを検索
async function findAllImagesDirectories(outDir) {
  const imagesDirs = []

  async function searchDir(dir) {
    try {
      const entries = await readdir(dir, { withFileTypes: true })

      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name)

        if (entry.isDirectory()) {
          // assets/images ディレクトリを発見
          if (entry.name === 'assets') {
            const imagesPath = path.join(fullPath, 'images')
            if (existsSync(imagesPath)) {
              imagesDirs.push(imagesPath)
            }
          }
          // さらに深く探索
          await searchDir(fullPath)
        }
      }
    } catch (error) {
      // ディレクトリアクセスエラーは無視
    }
  }

  await searchDir(outDir)
  return imagesDirs
}
