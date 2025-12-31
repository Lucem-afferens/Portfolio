import { i18n } from '../../utils/i18n.js';
import { ThemeManager } from '../../utils/themeManager.js';
import './Header.scss';

class Header {
  static render() {
    return `
      <header class="header">
        <div class="container">
          <div class="header__content">
            <a href="#home" class="header__logo">${i18n.t('header.logo')}</a>
            <nav class="header__nav">
              <a href="#home" class="header__nav-link">${i18n.t('header.nav.home')}</a>
              <a href="#about" class="header__nav-link">${i18n.t('header.nav.about')}</a>
              <a href="#projects" class="header__nav-link">${i18n.t('header.nav.projects')}</a>
              <a href="#testimonials" class="header__nav-link">${i18n.t('header.nav.testimonials')}</a>
              <a href="#contact" class="header__nav-link">${i18n.t('header.nav.contact')}</a>
            </nav>
            <div class="header__controls">
              <button class="header__lang-toggle" aria-label="Toggle language">
                ${i18n.getCurrentLanguage() === 'ru' ? 'EN' : 'RU'}
              </button>
              <button class="header__theme-toggle" aria-label="Toggle theme">
                <span class="theme-icon">🌓</span>
              </button>
            </div>
          </div>
        </div>
      </header>
    `;
  }

  static init() {
    const langToggle = document.querySelector('.header__lang-toggle');
    const themeToggle = document.querySelector('.header__theme-toggle');
    
    if (langToggle) {
      langToggle.addEventListener('click', () => {
        const currentLang = i18n.getCurrentLanguage();
        i18n.setLanguage(currentLang === 'ru' ? 'en' : 'ru');
        // Перезагрузка страницы для обновления контента
        window.location.reload();
      });
    }
    
    if (themeToggle) {
      themeToggle.addEventListener('click', () => {
        ThemeManager.toggleTheme();
      });
    }
  }
}

export default Header;

