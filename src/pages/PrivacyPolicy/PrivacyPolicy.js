import './PrivacyPolicy.scss';
import { i18n } from '../../utils/i18n.js';
import Header from '../../components/Header/Header.js';

class PrivacyPolicy {
  static render() {
    return `
      ${Header.render()}
      <section class="privacy-policy">
        <div class="container">
          <header class="privacy-policy__header">
            <h1 class="privacy-policy__title">${i18n.t('privacyPolicy.title')}</h1>
            <p class="privacy-policy__last-updated">${i18n.t('privacyPolicy.lastUpdated')}: ${new Date().toLocaleDateString(i18n.getCurrentLanguage() === 'ru' ? 'ru-RU' : 'en-US')}</p>
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

export default PrivacyPolicy;
