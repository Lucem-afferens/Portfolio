import './styles/main.scss';
import App from './App.js';
import { lazyLoadImages } from './utils/lazyLoad.js';
import { initStructuredData } from './utils/seo.js';

// Инициализация приложения
document.addEventListener('DOMContentLoaded', () => {
  try {
    // SEO инициализация
    initStructuredData();

    // Инициализация lazy loading
    lazyLoadImages();

    // Инициализация приложения
    const app = document.getElementById('app');
    if (app) {
      const appInstance = new App(app);

      // Повторная инициализация lazy loading после рендера компонентов
      setTimeout(() => {
        lazyLoadImages();
      }, 100);

      // Сохраняем ссылку на экземпляр для отладки
      window.appInstance = appInstance;
    } else {
      console.error('App container not found');
    }
  } catch (error) {
    console.error('Error initializing app:', error);
    const app = document.getElementById('app');
    if (app) {
      app.innerHTML =
        '<div style="padding: 20px; color: red;">Error loading application. Please check console.</div>';
    }
  }
});
