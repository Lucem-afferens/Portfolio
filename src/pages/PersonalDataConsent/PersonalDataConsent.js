import './PersonalDataConsent.scss';
import { i18n } from '../../utils/i18n.js';
import { ThemeManager } from '../../utils/themeManager.js';

class PersonalDataConsent {
  static render() {
    return `
      <section class="personal-data-consent">
        <div class="container">
          <div class="personal-data-consent__theme-toggle-wrapper">
            <button class="personal-data-consent__theme-toggle" aria-label="Переключить тему" data-theme-toggle>
              <svg class="personal-data-consent__theme-icon personal-data-consent__theme-icon--sun" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
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
              <svg class="personal-data-consent__theme-icon personal-data-consent__theme-icon--moon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
              </svg>
            </button>
          </div>
          <header class="personal-data-consent__header">
            <h1 class="personal-data-consent__title">${i18n.t('personalDataConsent.title')}</h1>
            <p class="personal-data-consent__last-updated">${i18n.t('personalDataConsent.lastUpdated')}: ${new Date().toLocaleDateString('ru-RU')}</p>
          </header>
          
          <div class="personal-data-consent__content">
            <section class="personal-data-consent__section">
              <h2 class="personal-data-consent__section-title">${i18n.t('personalDataConsent.section1.title')}</h2>
              <p>${i18n.t('personalDataConsent.section1.content')}</p>
            </section>

            <section class="personal-data-consent__section">
              <h2 class="personal-data-consent__section-title">${i18n.t('personalDataConsent.section2.title')}</h2>
              <p>${i18n.t('personalDataConsent.section2.content')}</p>
            </section>

            <section class="personal-data-consent__section">
              <h2 class="personal-data-consent__section-title">${i18n.t('personalDataConsent.section3.title')}</h2>
              <p>${i18n.t('personalDataConsent.section3.content')}</p>
            </section>

            <section class="personal-data-consent__section">
              <h2 class="personal-data-consent__section-title">${i18n.t('personalDataConsent.section4.title')}</h2>
              <p>${i18n.t('personalDataConsent.section4.content')}</p>
            </section>

            <section class="personal-data-consent__section">
              <h2 class="personal-data-consent__section-title">${i18n.t('personalDataConsent.section5.title')}</h2>
              <p>${i18n.t('personalDataConsent.section5.content')}</p>
            </section>
          </div>

          <div class="personal-data-consent__footer">
            <a href="/" class="personal-data-consent__back-link">${i18n.t('personalDataConsent.backToHome')}</a>
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

export default PersonalDataConsent;
