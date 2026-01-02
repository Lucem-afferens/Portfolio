import './PersonalDataConsent.scss';
import { i18n } from '../../utils/i18n.js';
import Header from '../../components/Header/Header.js';

class PersonalDataConsent {
  static render() {
    return `
      ${Header.render()}
      <section class="personal-data-consent">
        <div class="container">
          <header class="personal-data-consent__header">
            <h1 class="personal-data-consent__title">${i18n.t('personalDataConsent.title')}</h1>
            <p class="personal-data-consent__last-updated">${i18n.t('personalDataConsent.lastUpdated')}: ${new Date().toLocaleDateString(i18n.getCurrentLanguage() === 'ru' ? 'ru-RU' : 'en-US')}</p>
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
    // Инициализация Header
    Header.init();

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
