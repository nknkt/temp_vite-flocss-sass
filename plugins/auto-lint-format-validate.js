import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import fs from 'fs/promises';

const execAsync = promisify(exec);

/**
 * Viteプラグイン: ファイル変更時にESLint、Prettier、html-validateを自動実行
 * @param {Object} options - プラグインオプション
 * @returns {Object} Viteプラグイン
 */
export function autoLintFormatValidate(options = {}) {
  const {
    eslint = true,
    prettier = true,
    htmlValidate = true,
    stylelint = true,
    include = /\.(js|jsx|ts|tsx|vue|html|css|scss)$/,
    exclude = /node_modules/,
    debounceMs = 300, // デバウンス時間
  } = options;

  // 処理中のファイルを追跡してループを防ぐ
  const processingFiles = new Set();
  const debounceTimers = new Map();

  return {
    name: 'auto-lint-format-validate',
    configureServer(server) {
      // ファイル変更を監視
      server.middlewares.use('/auto-lint-format-validate', async (req, res) => {
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

      // 既存のタイマーをクリア
      if (debounceTimers.has(file)) {
        clearTimeout(debounceTimers.get(file));
      }

      // デバウンス処理
      const timer = setTimeout(async () => {
        // 処理開始をマーク
        processingFiles.add(file);
        debounceTimers.delete(file);

        try {
          const fileExt = path.extname(file);

          // ファイルタイプ別の処理
          if (fileExt === '.html') {
            await processHtmlFile(relativePath, { prettier, htmlValidate });
          } else if (fileExt === '.js' || fileExt === '.jsx' || fileExt === '.ts' || fileExt === '.tsx') {
            await processJsFile(relativePath, { eslint, prettier });
          } else if (fileExt === '.css' || fileExt === '.scss') {
            await processCssFile(relativePath, { stylelint, prettier });
          }

        } catch (error) {
          console.error('❌ Auto lint/format/validate error:', error.message);
        } finally {
          // 処理完了後にマークを削除
          setTimeout(() => {
            processingFiles.delete(file);
          }, 1000);
        }
      }, debounceMs);

      debounceTimers.set(file, timer);
      return ctx.modules;
    },
  };
}

/**
 * HTMLファイルの処理
 */
async function processHtmlFile(filePath, { prettier, htmlValidate }) {
  console.log(`🔍 Processing HTML: ${filePath}`);

  if (prettier) {
    await runPrettier(filePath);
  }

  if (htmlValidate) {
    await runHtmlValidate(filePath);
  }

  // HTMLファイルから自己終了タグの / を除去
  await removeSlashFromVoidElements(path.resolve(filePath));
}

/**
 * JavaScriptファイルの処理
 */
async function processJsFile(filePath, { eslint, prettier }) {
  console.log(`🔍 Processing JS: ${filePath}`);

  if (eslint) {
    await runESLint(filePath);
  }

  if (prettier) {
    await runPrettier(filePath);
  }
}

/**
 * CSSファイルの処理
 */
async function processCssFile(filePath, { stylelint, prettier }) {
  console.log(`🔍 Processing CSS: ${filePath}`);

  if (stylelint) {
    await runStylelint(filePath);
  }

  if (prettier) {
    await runPrettier(filePath);
  }
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
 * html-validateを実行
 */
async function runHtmlValidate(filePath) {
  try {
    const { stdout, stderr } = await execAsync(`npx html-validate "${filePath}"`);
    if (stdout && stdout.trim()) {
      console.log(`🔍 HTML validation for ${filePath}:`);
      console.log(stdout);
    } else {
      console.log(`✅ HTML validated: ${filePath}`);
    }
  } catch (error) {
    if (error.stdout) {
      console.log(`⚠️  HTML validation issues for ${filePath}:`);
      console.log(error.stdout);
    }
  }
}

/**
 * Stylelintを実行
 */
async function runStylelint(filePath) {
  try {
    await execAsync(`npx stylelint "${filePath}" --fix`);
    console.log(`✅ Stylelint fixed: ${filePath}`);
  } catch (error) {
    if (error.stdout) {
      console.log(`⚠️  Stylelint warnings for ${filePath}:`);
      console.log(error.stdout);
    }
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
