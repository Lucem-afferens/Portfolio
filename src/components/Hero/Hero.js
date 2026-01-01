import { i18n } from '../../utils/i18n.js';
import './Hero.scss';

class Hero {
  static render() {
    return `
      <section id="home" class="hero" data-hero-section>
        <div class="container">
          <div class="hero__content">
            <h1 class="hero__name">${i18n.t('hero.name')}</h1>
            <p class="hero__specialization">${i18n.t('hero.specialization')}</p>
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
    this.loadHeroPhoto();
  }

  static async loadHeroPhoto() {
    try {
      const response = await fetch('/api/get-site-settings.php');
      const result = await response.json();

      if (result.success && result.settings.hero_photo) {
        const heroSection = document.querySelector('[data-hero-section]');
        if (heroSection) {
          heroSection.style.backgroundImage = `url(${result.settings.hero_photo})`;
          heroSection.style.backgroundSize = 'cover';
          heroSection.style.backgroundPosition = 'center';
          heroSection.style.backgroundRepeat = 'no-repeat';
        }
      }
    } catch (error) {
      console.error('Error loading hero photo:', error);
    }
  }
}

export default Hero;
