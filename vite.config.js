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
        'testimonial-form': resolve(__dirname, 'src/pages/testimonial-form.html'),
        admin: resolve(__dirname, 'src/pages/admin.html'),
      },
      output: {
        // Сохраняем структуру папок для страниц
        entryFileNames: chunk => {
          if (chunk.name === 'testimonial-form') {
            return 'pages/testimonial-form.js';
          }
          if (chunk.name === 'admin') {
            return 'pages/admin.js';
          }
          return 'assets/[name]-[hash].js';
        },
      },
    },
    // Оптимизация для производительности
    minify: 'esbuild', // Используем esbuild (быстрее и не требует дополнительных зависимостей)
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
        // Using function to calculate correct relative paths with comprehensive safety checks
        additionalData: (content, loaderContext) => {
          // Helper function to determine import path
          const getImportPath = filePath => {
            if (!filePath) return null;

            const normalizedPath = filePath.replace(/\\/g, '/');
            const normalizedSrcPath = resolve(__dirname, 'src').replace(/\\/g, '/');

            // Get relative path from src/
            const relativePath = normalizedPath.replace(normalizedSrcPath, '').replace(/^\//, '');

            // Check if file is directly in styles/ directory (e.g., "styles/main.scss")
            if (relativePath.startsWith('styles/') || relativePath === 'styles') {
              // File is in styles/ directory - use current directory
              return './';
            }

            // Check if file is in a subdirectory of styles/
            if (relativePath.includes('/styles/')) {
              // File is in styles/ subdirectory - use current directory
              return './';
            }

            // Check if file is in components/
            if (relativePath.includes('/components/')) {
              // File is in components/ - go up two levels
              return '../../styles/';
            }

            // Check if file is in pages/ (e.g., "pages/TestimonialForm/TestimonialForm.scss")
            if (relativePath.startsWith('pages/')) {
              // File is in pages/ - go up two levels to reach styles/
              return '../../styles/';
            }

            // Calculate depth for other locations
            const depth = (relativePath.match(/\//g) || []).length;
            return depth > 0 ? `${'../'.repeat(depth)}styles/` : './styles/';
          };

          // Helper function to detect file location from content
          const detectPathFromContent = fileContent => {
            // Check for patterns that indicate styles/ directory
            const stylesIndicators = [
              '$font-size-base',
              '$bg-light',
              '$text-light',
              'map-get($spacings',
              '@include container',
              '@include respond-to',
            ];

            const hasStylesIndicators = stylesIndicators.some(indicator =>
              fileContent.includes(indicator)
            );

            // Check for component-specific patterns
            const componentIndicators = [
              '.header',
              '.hero',
              '.about',
              '.projects',
              '.testimonials',
              '.contact',
            ];

            // Check for page-specific patterns
            const pageIndicators = ['.testimonial-form', '.admin'];

            const hasComponentIndicators = componentIndicators.some(indicator =>
              fileContent.includes(indicator)
            );

            const hasPageIndicators = pageIndicators.some(indicator =>
              fileContent.includes(indicator)
            );

            if (hasStylesIndicators && !hasComponentIndicators && !hasPageIndicators) {
              return './';
            }
            if (hasPageIndicators || hasComponentIndicators) {
              return '../../styles/';
            }
            // Default: assume component
            return '../../styles/';
          };

          // Try to get path from loaderContext
          if (loaderContext && loaderContext.resourcePath) {
            try {
              const { resourcePath } = loaderContext;

              // Check if resourcePath is a string
              if (typeof resourcePath === 'string') {
                const importPath = getImportPath(resourcePath);
                if (importPath) {
                  return `@import "${importPath}variables.scss"; @import "${importPath}mixins.scss";\n${content}`;
                }
              }
            } catch (error) {
              console.warn('SCSS additionalData: Error processing resourcePath:', error);
            }
          }

          // Fallback: detect path from content
          const fallbackPath = detectPathFromContent(content);
          return `@import "${fallbackPath}variables.scss"; @import "${fallbackPath}mixins.scss";\n${content}`;
        },
      },
    },
  },
  // Оптимизация для LCP, FID, CLS
  optimizeDeps: {
    include: [],
  },
});
