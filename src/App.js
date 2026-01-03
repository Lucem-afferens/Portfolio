import Header from './components/Header/Header.js';
import Hero from './components/Hero/Hero.js';
import About from './components/About/About.js';
import Projects from './components/Projects/Projects.js';
import Testimonials from './components/Testimonials/Testimonials.js';
import Contact from './components/Contact/Contact.js';
import { i18n } from './utils/i18n.js';
import { ThemeManager } from './utils/themeManager.js';

class App {
  constructor(container) {
    this.container = container;
    this.isInitialLoad = true;
    this.init();
  }

  init() {
    try {
      // Инициализация темы
      ThemeManager.init();

      // Инициализация i18n
      i18n.init();

      // Рендер компонентов
      this.render();

      // Обработка событий
      this.setupEventListeners();
    } catch (error) {
      console.error('Error in App.init:', error);
      this.container.innerHTML = `
        <div style="padding: 20px; color: red;">
          <h1>Application Error</h1>
          <p>${error.message}</p>
          <pre>${error.stack}</pre>
        </div>
      `;
    }
  }

  render() {
    this.container.innerHTML = `
      ${Header.render()}
      <main>
        ${Hero.render()}
        ${About.render()}
        ${Projects.render()}
        ${Testimonials.render()}
        ${Contact.render()}
      </main>
    `;

    // Инициализация компонентов
    Header.init();
    Hero.init();
    About.init();
    Projects.init();
    Testimonials.init();
    Contact.init();

    // Trigger fade-in effect after render
    this.triggerFadeIn();
  }

  triggerFadeIn() {
    // Only trigger fade-in on initial page load, not on language changes
    if (!this.isInitialLoad) {
      return;
    }

    // Use requestAnimationFrame for smooth animation
    // Double requestAnimationFrame ensures DOM is fully ready
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        // Small delay to ensure all content is rendered and images start loading
        setTimeout(() => {
          this.startFadeIn();
        }, 150);
      });
    });
  }

  startFadeIn() {
    const { body } = document;
    if (body && body.classList.contains('page-loading')) {
      body.classList.remove('page-loading');
      body.classList.add('page-loaded');
      this.isInitialLoad = false;
    }
  }

  setupEventListeners() {
    // Глобальные обработчики событий
    document.addEventListener('languageChanged', () => {
      this.isInitialLoad = false; // Prevent fade-in on language change
      this.render();
    });
  }
}

export default App;
