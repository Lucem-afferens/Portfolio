import './styles/main.scss';
import App from './App.js';
import { lazyLoadImages } from './utils/lazyLoad.js';
import { initStructuredData } from './utils/seo.js';

// Инициализация приложения
document.addEventListener('DOMContentLoaded', () => {
  // SEO инициализация
  initStructuredData();
  
  // Инициализация lazy loading
  lazyLoadImages();
  
  // Инициализация приложения
  const app = document.getElementById('app');
  if (app) {
    new App(app);
    
    // Повторная инициализация lazy loading после рендера компонентов
    setTimeout(() => {
      lazyLoadImages();
    }, 100);
  }
});

