import { i18n } from '../../utils/i18n.js';
import './Hero.scss';

class Hero {
  static render() {
    return `
      <section id="home" class="hero">
        <div class="container">
          <div class="hero__content">
            <h1 class="hero__name">${i18n.t('hero.name')}</h1>
            <p class="hero__specialization">${i18n.t('hero.specialization')}</p>
            <a href="#projects" class="hero__cta">${i18n.t('hero.cta')}</a>
          </div>
        </div>
      </section>
    `;
  }

  static init() {
    // Lazy loading для изображений, если будут добавлены
    const images = document.querySelectorAll('.hero img[loading="lazy"]');
    images.forEach((img) => {
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

