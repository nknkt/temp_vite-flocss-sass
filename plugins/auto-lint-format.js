import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import fs from 'fs/promises';

const execAsync = promisify(exec);

/**
 * Viteプラグイン: ファイル変更時にESLintとPrettierを自動実行
 * @param {Object} options - プラグインオプション
 * @returns {Object} Viteプラグイン
 */
export function autoLintAndFormat(options = {}) {
  const {
    eslint = true,
    prettier = true,
    include = /\.(js|jsx|ts|tsx|vue|html)$/,
    exclude = /node_modules/,
  } = options;

  // 処理中のファイルを追跡してループを防ぐ
  const processingFiles = new Set();

  return {
    name: 'auto-lint-format',
    configureServer(server) {
      // ファイル変更を監視
      server.middlewares.use('/auto-lint-format', async (req, res) => {
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ status: 'ok' }));
      });
    },
    handleHotUpdate(ctx) {
      const { file } = ctx;
      const relativePath = path.relative(process.cwd(), file);

      // 対象ファイルかチェック
      if (exclude.test(file) || !include.test(file)) {
        return;
      }

      // 既に処理中のファイルはスキップ
      if (processingFiles.has(file)) {
        return ctx.modules;
      }

      // ESLintとPrettierを非同期で実行
      setTimeout(async () => {
        // 処理開始をマーク
        processingFiles.add(file);

        try {
          if (eslint) {
            await runESLint(relativePath);
          }
          if (prettier) {
            await runPrettier(relativePath);

            // HTMLファイルの場合、自己終了タグの / を除去
            if (relativePath.endsWith('.html')) {
              await removeSlashFromVoidElements(file);
            }
          }
        } catch (error) {
          console.error('❌ Auto lint/format error:', error.message);
        } finally {
          // 処理完了後にマークを削除（少し遅延させる）
          setTimeout(() => {
            processingFiles.delete(file);
          }, 1000);
        }
      }, 100); // 少し遅延させて、ファイル保存完了を待つ

      return ctx.modules;
    },
  };
}

/**
 * ESLintを実行
 */
async function runESLint(filePath) {
  try {
    await execAsync(`npx eslint "${filePath}" --fix`);
    console.log(`✅ ESLint fixed: ${filePath}`);
  } catch (error) {
    if (error.stdout) {
      console.log(`⚠️  ESLint warnings for ${filePath}:`);
      console.log(error.stdout);
    }
  }
}

/**
 * Prettierを実行
 */
async function runPrettier(filePath) {
  try {
    await execAsync(`npx prettier --write "${filePath}"`);
    console.log(`✨ Prettier formatted: ${filePath}`);
  } catch (error) {
    console.error(`❌ Prettier error for ${filePath}:`, error.message);
  }
}

/**
 * HTMLファイルから自己終了タグの / を除去
 */
async function removeSlashFromVoidElements(filePath) {
  try {
    let content = await fs.readFile(filePath, 'utf8');

    // 自己終了タグの / を除去
    const originalContent = content;

    // 自己終了タグの / を除去し、余分なスペースもクリーンアップ
    content = content.replace(/(<(meta|link|img|br|hr|input|area|base|col|embed|source|track|wbr)(?:\s[^>]*?)?)\s*\/>/gi, '$1>');

    // 余分なスペースがある場合もクリーンアップ (例: <br > -> <br>)
    content = content.replace(/(<(meta|link|img|br|hr|input|area|base|col|embed|source|track|wbr))\s+>/gi, '$1>');

    // 変更があった場合のみファイルを更新
    if (content !== originalContent) {
      await fs.writeFile(filePath, content, 'utf8');
      console.log(`🔧 Removed self-closing slashes from: ${path.relative(process.cwd(), filePath)}`);
    }
  } catch (error) {
    console.error(`❌ Error removing slashes from ${filePath}:`, error.message);
  }
}
