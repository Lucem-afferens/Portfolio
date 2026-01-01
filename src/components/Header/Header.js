import { i18n } from '../../utils/i18n.js';
import { ThemeManager } from '../../utils/themeManager.js';
import './Header.scss';

class Header {
  static render() {
    return `
      <header class="header">
        <div class="container">
          <div class="header__content">
            <a href="#home" class="header__logo" data-logo-link>
              <span class="header__logo-text">${i18n.t('header.logo')}</span>
              <img class="header__logo-image" data-logo-image style="display: none;" alt="${i18n.t('header.logo')}" />
            </a>
            <nav class="header__nav">
              <a href="#home" class="header__nav-link">${i18n.t('header.nav.home')}</a>
              <a href="#about" class="header__nav-link">${i18n.t('header.nav.about')}</a>
              <a href="#projects" class="header__nav-link">${i18n.t('header.nav.projects')}</a>
              <a href="#testimonials" class="header__nav-link">${i18n.t('header.nav.testimonials')}</a>
              <a href="#contact" class="header__nav-link">${i18n.t('header.nav.contact')}</a>
            </nav>
            <div class="header__controls">
              <button class="header__lang-toggle" aria-label="Toggle language">
                <svg class="header__lang-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="2" y1="12" x2="22" y2="12"></line>
                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                </svg>
                <span class="header__lang-text">${i18n.getCurrentLanguage().toUpperCase()}</span>
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
    this.loadLogo();

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

  static async loadLogo() {
    try {
      const response = await fetch('/api/get-site-settings.php');
      const result = await response.json();

      if (result.success && result.settings.logo) {
        const logoImage = document.querySelector('[data-logo-image]');
        const logoText = document.querySelector('.header__logo-text');
        const logoLink = document.querySelector('[data-logo-link]');

        if (logoImage) {
          logoImage.src = result.settings.logo;
          logoImage.style.display = 'block';
        }

        if (logoText) {
          logoText.style.display = 'none';
        }

        if (logoLink) {
          logoLink.classList.add('header__logo--image');
        }
      }
    } catch (error) {
      console.error('Error loading logo:', error);
    }
  }
}

export default Header;
