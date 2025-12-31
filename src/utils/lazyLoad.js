/**
 * Утилита для lazy loading изображений
 * Оптимизирует LCP и производительность
 */
export function lazyLoadImages() {
  const images = document.querySelectorAll('img[loading="lazy"]');
  
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target;
          
          // Добавляем класс loaded для плавного появления
          img.addEventListener('load', () => {
            img.classList.add('loaded');
          });
          
          // Если изображение уже загружено
          if (img.complete) {
            img.classList.add('loaded');
          }
          
          observer.unobserve(img);
        }
      });
    }, {
      rootMargin: '50px', // Начинаем загрузку за 50px до появления в viewport
    });
    
    images.forEach((img) => {
      imageObserver.observe(img);
    });
  } else {
    // Fallback для старых браузеров
    images.forEach((img) => {
      if (img.complete) {
        img.classList.add('loaded');
      } else {
        img.addEventListener('load', () => {
          img.classList.add('loaded');
        });
      }
    });
  }
}

/**
 * Предзагрузка критичных изображений
 */
export function preloadCriticalImages(srcs) {
  srcs.forEach((src) => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = src;
    document.head.appendChild(link);
  });
}

