import './PrivacyPolicy.scss';
import { i18n } from '../../utils/i18n.js';
import { ThemeManager } from '../../utils/themeManager.js';

class PrivacyPolicy {
  static render() {
    return `
      <section class="privacy-policy">
        <div class="container">
          <div class="privacy-policy__theme-toggle-wrapper">
            <button class="privacy-policy__theme-toggle" aria-label="Переключить тему" data-theme-toggle>
              <svg class="privacy-policy__theme-icon privacy-policy__theme-icon--sun" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="5"></circle>
                <line x1="12" y1="1" x2="12" y2="3"></line>
                <line x1="12" y1="21" x2="12" y2="23"></line>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                <line x1="1" y1="12" x2="3" y2="12"></line>
                <line x1="21" y1="12" x2="23" y2="12"></line>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
              </svg>
              <svg class="privacy-policy__theme-icon privacy-policy__theme-icon--moon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
              </svg>
            </button>
          </div>
          <header class="privacy-policy__header">
            <h1 class="privacy-policy__title">${i18n.t('privacyPolicy.title')}</h1>
            <p class="privacy-policy__last-updated">${i18n.t('privacyPolicy.lastUpdated')}: ${new Date().toLocaleDateString('ru-RU')}</p>
          </header>
          
          <div class="privacy-policy__content">
            <section class="privacy-policy__section">
              <h2 class="privacy-policy__section-title">${i18n.t('privacyPolicy.section1.title')}</h2>
              <p>${i18n.t('privacyPolicy.section1.content')}</p>
            </section>

            <section class="privacy-policy__section">
              <h2 class="privacy-policy__section-title">${i18n.t('privacyPolicy.section2.title')}</h2>
              <p>${i18n.t('privacyPolicy.section2.content')}</p>
            </section>

            <section class="privacy-policy__section">
              <h2 class="privacy-policy__section-title">${i18n.t('privacyPolicy.section3.title')}</h2>
              <p>${i18n.t('privacyPolicy.section3.content')}</p>
            </section>

            <section class="privacy-policy__section">
              <h2 class="privacy-policy__section-title">${i18n.t('privacyPolicy.section4.title')}</h2>
              <p>${i18n.t('privacyPolicy.section4.content')}</p>
            </section>

            <section class="privacy-policy__section">
              <h2 class="privacy-policy__section-title">${i18n.t('privacyPolicy.section5.title')}</h2>
              <p>${i18n.t('privacyPolicy.section5.content')}</p>
            </section>

            <section class="privacy-policy__section">
              <h2 class="privacy-policy__section-title">${i18n.t('privacyPolicy.section6.title')}</h2>
              <p>${i18n.t('privacyPolicy.section6.content')}</p>
            </section>
          </div>

          <div class="privacy-policy__footer">
            <a href="/" class="privacy-policy__back-link">${i18n.t('privacyPolicy.backToHome')}</a>
          </div>
        </div>
      </section>
    `;
  }

  static init() {
    // Инициализация переключения темы
    const themeToggle = document.querySelector('[data-theme-toggle]');
    if (themeToggle) {
      themeToggle.addEventListener('click', () => {
        ThemeManager.toggleTheme();
      });
    }

    // Обновление контента при смене языка
    document.addEventListener('languageChanged', () => {
      const app = document.getElementById('app');
      if (app) {
        app.innerHTML = this.render();
        this.init();
      }
    });
  }
}

export default PrivacyPolicy;
