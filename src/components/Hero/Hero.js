import { i18n } from '../../utils/i18n.js';
import './Hero.scss';

class Hero {
  static render() {
    return `
      <section id="home" class="hero" data-hero-section>
        <div class="container">
          <div class="hero__content">
            <div class="hero__actions">
              <a href="#projects" class="hero__cta hero__cta--primary">
                ${i18n.t('hero.cta')}
              </a>
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

      if (result.success && result.settings) {
        const heroSection = document.querySelector('[data-hero-section]');
        if (heroSection) {
          const { hero_photo: heroPhoto, hero_photo_mobile: heroPhotoMobile } = result.settings;

          // Определяем, какое фото использовать
          const updateBackground = () => {
            const isMobile = window.innerWidth <= 425;
            const photoToUse = isMobile ? heroPhotoMobile || heroPhoto : heroPhoto;

            if (photoToUse) {
              heroSection.style.backgroundImage = `url(${photoToUse})`;
              heroSection.style.backgroundSize = 'cover';
              heroSection.style.backgroundPosition = 'center top';
              heroSection.style.backgroundRepeat = 'no-repeat';
            }
          };

          // Устанавливаем начальное фото
          updateBackground();

          // Обновляем при изменении размера окна
          let resizeTimeout;
          window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(updateBackground, 100);
          });
        }
      }
    } catch (error) {
      console.error('Error loading hero photo:', error);
    }
  }
}

export default Hero;
