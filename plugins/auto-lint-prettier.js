import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export function autoLintPrettier() {
  return {
    name: 'auto-lint-prettier',
    configureServer(server) {
      // ファイル変更監視
      server.ws.on('connection', () => {
        console.log('🔧 Auto lint & prettier is active');
      });

      // HMR更新時に実行
      server.middlewares.use('/auto-format', async (req, res, next) => {
        try {
          console.log('🔄 Running auto format...');

          // ESLint自動修正
          await execAsync('npx eslint . --fix --quiet');
          console.log('✅ ESLint completed');

          // Prettier自動整形
          await execAsync('npx prettier --write .');
          console.log('✅ Prettier completed');

          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: true }));
        } catch (error) {
          console.error('❌ Auto format error:', error.message);
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: error.message }));
        }
      });
    },

    handleHotUpdate(ctx) {
      // JSファイルの変更時のみ実行
      if (ctx.file.endsWith('.js') || ctx.file.endsWith('.html') || ctx.file.endsWith('.scss')) {
        // 非同期でlint・prettierを実行（ビルドをブロックしない）
        setTimeout(async () => {
          try {
            console.log(`🔄 Auto formatting: ${ctx.file}`);

            // 変更されたファイルのみlint
            await execAsync(`npx eslint "${ctx.file}" --fix --quiet`);

            // 変更されたファイルのみprettier
            await execAsync(`npx prettier --write "${ctx.file}"`);

            console.log(`✅ Formatted: ${ctx.file}`);
          } catch (error) {
            // エラーは表示するが、開発を止めない
            console.warn(`⚠️  Format warning for ${ctx.file}:`, error.message);
          }
        }, 100); // 100ms遅延で実行
      }
    }
  };
}
