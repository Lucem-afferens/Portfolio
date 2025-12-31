import { i18n } from '../../utils/i18n.js';
import './Hero.scss';

class Hero {
  static render() {
    return `
      <section id="home" class="hero">
        <div class="hero__background">
          <div class="hero__gradient hero__gradient--1"></div>
          <div class="hero__gradient hero__gradient--2"></div>
          <div class="hero__gradient hero__gradient--3"></div>
        </div>
        <div class="container">
          <div class="hero__content">
            <div class="hero__badge">
              <span class="hero__badge-text">👋 ${i18n.t('hero.greeting', { default: 'Привет' })}</span>
            </div>
            <h1 class="hero__name">
              <span class="hero__name-line">${i18n.t('hero.name')}</span>
            </h1>
            <div class="hero__specialization-wrapper">
              <p class="hero__specialization">${i18n.t('hero.specialization')}</p>
              <span class="hero__cursor">|</span>
            </div>
            <p class="hero__description">${i18n.t('hero.description', { default: 'Создаю современные веб-приложения с фокусом на пользовательский опыт' })}</p>
            <div class="hero__actions">
              <a href="#projects" class="hero__cta hero__cta--primary">
                <span>${i18n.t('hero.cta')}</span>
                <svg class="hero__cta-icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </a>
              <a href="#contact" class="hero__cta hero__cta--secondary">
                ${i18n.t('hero.contact', { default: 'Связаться' })}
              </a>
            </div>
            <div class="hero__scroll-indicator">
              <div class="hero__scroll-mouse">
                <div class="hero__scroll-wheel"></div>
              </div>
              <span class="hero__scroll-text">${i18n.t('hero.scroll', { default: 'Прокрутите вниз' })}</span>
            </div>
          </div>
        </div>
      </section>
    `;
  }

  static init() {
    // Lazy loading для изображений, если будут добавлены
    const images = document.querySelectorAll('.hero img[loading="lazy"]');
    images.forEach(img => {
      if (img.complete) {
        img.classList.add('loaded');
      } else {
        img.addEventListener('load', () => {
          img.classList.add('loaded');
        });
      }
    });
  }
}

export default Hero;
