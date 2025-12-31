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
          // Safety check: if loaderContext or resourcePath is undefined
          if (!loaderContext || !loaderContext.resourcePath) {
            // Fallback: use relative path from components (most common case)
            return `@import "../../styles/variables.scss"; @import "../../styles/mixins.scss";\n${content}`;
          }

          try {
            const { resourcePath } = loaderContext;
            const srcPath = resolve(__dirname, 'src');

            // Check if resourcePath is a string
            if (typeof resourcePath !== 'string') {
              return `@import "../../styles/variables.scss"; @import "../../styles/mixins.scss";\n${content}`;
            }

            // Normalize path separators
            const normalizedPath = resourcePath.replace(/\\/g, '/');
            const normalizedSrcPath = srcPath.replace(/\\/g, '/');

            // Get relative path from src/
            const relativePath = normalizedPath.replace(normalizedSrcPath, '').replace(/^\//, '');

            // Determine import path based on file location
            let importPath;

            if (relativePath.includes('/styles/')) {
              // File is in styles/ directory - use current directory
              importPath = './';
            } else if (relativePath.includes('/components/')) {
              // File is in components/ - go up two levels
              importPath = '../../styles/';
            } else {
              // Calculate depth for other locations
              const depth = (relativePath.match(/\//g) || []).length;
              importPath = depth > 0 ? `${'../'.repeat(depth)}styles/` : './styles/';
            }

            return `@import "${importPath}variables.scss"; @import "${importPath}mixins.scss";\n${content}`;
          } catch (error) {
            // If any error occurs, try to determine path from content or use safe fallback
            console.warn('SCSS additionalData error, using fallback:', error);
            // Try to detect if we're in styles/ by checking if content uses variables
            if (content.includes('$font-size-base') || content.includes('$bg-light')) {
              // Likely in styles/, use current directory
              return `@import "./variables.scss"; @import "./mixins.scss";\n${content}`;
            }
            // Default fallback for components
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
