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
        // Using function to calculate correct relative paths with safety checks
        additionalData: (content, loaderContext) => {
          // Safety check: if loaderContext or resourcePath is undefined, use fallback
          if (!loaderContext || !loaderContext.resourcePath) {
            // Fallback: assume we're in a component, use relative path
            return `@import "../../styles/variables.scss"; @import "../../styles/mixins.scss";\n${content}`;
          }

          try {
            const { resourcePath } = loaderContext;
            const srcPath = resolve(__dirname, 'src');

            // Check if resourcePath is a string
            if (typeof resourcePath !== 'string') {
              return `@import "../../styles/variables.scss"; @import "../../styles/mixins.scss";\n${content}`;
            }

            const relativePath = resourcePath.replace(srcPath, '').replace(/\\/g, '/');

            // Calculate depth (how many directories deep from src/)
            const depth = (relativePath.match(/\//g) || []).length - 1;
            const pathPrefix = depth > 0 ? '../'.repeat(depth) : './';

            // For files in styles/, use current directory
            const finalPath = relativePath.includes('/styles/') ? './' : `${pathPrefix}styles/`;

            return `@import "${finalPath}variables.scss"; @import "${finalPath}mixins.scss";\n${content}`;
          } catch (error) {
            // If any error occurs, use fallback path
            console.warn('SCSS additionalData error, using fallback:', error);
            return `@import "../../styles/variables.scss"; @import "../../styles/mixins.scss";\n${content}`;
          }
        },
      },
    },
  },
  // Оптимизация для LCP, FID, CLS
  optimizeDeps: {
    include: [],
  },
});
