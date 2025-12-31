import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  root: 'src',
  publicDir: '../public',
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@styles': resolve(__dirname, 'src/styles'),
    },
  },
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'src/index.html'),
      },
    },
    // Оптимизация для производительности
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
    // Code splitting для лучшей производительности
    chunkSizeWarningLimit: 1000,
  },
  server: {
    port: 3000,
    open: true,
  },
  css: {
    preprocessorOptions: {
      scss: {
        // Import variables and mixins for all SCSS files
        // Using function to calculate correct relative paths
        additionalData: (content, loaderContext) => {
          const { resourcePath } = loaderContext;
          const srcPath = resolve(__dirname, 'src');
          const relativePath = resourcePath.replace(srcPath, '').replace(/\\/g, '/');

          // Calculate depth (how many directories deep from src/)
          const depth = (relativePath.match(/\//g) || []).length - 1;
          const pathPrefix = depth > 0 ? '../'.repeat(depth) : './';

          // For files in styles/, use current directory
          const finalPath = relativePath.includes('/styles/') ? './' : `${pathPrefix}styles/`;

          return `@import "${finalPath}variables.scss"; @import "${finalPath}mixins.scss";\n${content}`;
        },
      },
    },
  },
  // Оптимизация для LCP, FID, CLS
  optimizeDeps: {
    include: [],
  },
});
