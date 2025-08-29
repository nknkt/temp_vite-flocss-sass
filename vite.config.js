import { defineConfig } from 'vite';
import { viteStaticCopy } from 'vite-plugin-static-copy';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    // auto-lint-formatプラグインは開発時のループを避けるため無効化
    viteStaticCopy({
      targets: [
        {
          src: 'assets/images/*.{webp,png,jpg,jpeg,svg,gif,ico}',
          dest: 'assets/images',
        },
        {
          src: 'assets/images/sp',
          dest: 'assets/images',
        },
      ],
    }),
  ],
  base: process.env.NODE_ENV === 'production' ? '/ipc/meets_creator/' : '/',
  root: 'src',
  css: {
    preprocessorOptions: {
      scss: {
        quietDeps: true,
      },
    },
  },
  build: {
    outDir: '../dist/ipc/meets_creator',
    copyPublicDir: false,
    rollupOptions: {
      output: {
        assetFileNames: assetInfo => {
          if (assetInfo.name && assetInfo.name.endsWith('.css')) {
            return 'assets/css/[name][extname]';
          }
          if (assetInfo.name && /\.(png|jpe?g|svg|gif|webp|ico)$/.test(assetInfo.name)) {
            return 'assets/images/[name][extname]';
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
