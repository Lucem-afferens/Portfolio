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
      <main>
        ${Header.render()}
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
  }

  setupEventListeners() {
    // Глобальные обработчики событий
    document.addEventListener('languageChanged', () => {
      this.render();
    });
  }
}

export default App;
