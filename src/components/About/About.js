import { i18n } from '../../utils/i18n.js';
import './About.scss';

class About {
  static render() {
    const skills = [
      'HTML5',
      'CSS3 / SCSS',
      'JavaScript',
      'TypeScript',
      'React',
      'Vite',
      'PHP',
      'WordPress',
      'Git',
      'Figma',
      'Docker',
      'CI/CD',
    ];

    return `
      <section id="about" class="about">
        <div class="container">
          <h2 class="about__title">${i18n.t('about.title')}</h2>
          <div class="about__content">
            <div class="about__image-wrapper">
              <img 
                src="/images/about-placeholder.svg" 
                alt="Николай Дудин - Web-разработчик" 
                class="about__image"
                loading="lazy"
                width="400"
                height="400"
              />
            </div>
            <div class="about__text">
              <p>${i18n.t('about.description')}</p>
              <h3>${i18n.t('about.skills')}</h3>
              <ul class="about__skills">
                ${skills.map(skill => `<li>${skill}</li>`).join('')}
              </ul>
            </div>
          </div>
        </div>
      </section>
    `;
  }

  static init() {
    const images = document.querySelectorAll('.about img[loading="lazy"]');
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

export default About;
