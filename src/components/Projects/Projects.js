import { i18n } from '../../utils/i18n.js';
import './Projects.scss';

class Projects {
  static render() {
    const projects = [
      {
        id: 1,
        title: 'Точка GG',
        role: 'Full-stack Developer',
        category: 'web',
        image: {
          src: '/images/project-placeholder.svg',
          srcset: '/images/project-placeholder.svg 400w, /images/project-placeholder.svg 800w',
          width: 800,
          height: 600,
          alt: 'Превью проекта: Сайт компьютерного клуба Точка GG',
        },
        tags: ['WordPress', 'PHP', 'SEO', 'PageSpeed'],
        link: 'https://kungur-tochkagg.ru',
        description:
          'Разработка WordPress-темы с нуля, SEO-оптимизация и улучшение производительности',
      },
      {
        id: 2,
        title: 'Приз Бокс',
        role: 'Full-stack Developer',
        category: 'web',
        image: {
          src: '/images/project-placeholder.svg',
          srcset: '/images/project-placeholder.svg 400w, /images/project-placeholder.svg 800w',
          width: 800,
          height: 600,
          alt: 'Превью проекта: Telegram-бот Приз Бокс',
        },
        tags: ['Telegram API', 'PHP', 'MySQL', 'AI'],
        link: 'https://t.me/wheel_prize_test_bot',
        description: 'Telegram-бот с личным кабинетом, рейтингом и админ-панелью',
      },
      {
        id: 3,
        title: 'Welcome to Day',
        role: 'Full-stack Developer',
        category: 'web',
        image: {
          src: '/images/project-placeholder.svg',
          srcset: '/images/project-placeholder.svg 400w, /images/project-placeholder.svg 800w',
          width: 800,
          height: 600,
          alt: 'Превью проекта: Сайт электронных приглашений Welcome to Day',
        },
        tags: ['Frontend', 'SEO', 'Analytics', 'Optimization'],
        link: 'https://welcome-to-day.ru',
        description:
          'Каталог интерактивных приглашений с формами заявок, промокодами и уведомлениями',
      },
    ];

    return `
      <section id="projects" class="projects" aria-labelledby="projects-title">
        <div class="container">
          <header class="projects__header">
            <h2 id="projects-title" class="projects__title">${i18n.t('projects.title')}</h2>
            <p class="projects__subtitle">${i18n.t('projects.subtitle')}</p>
          </header>
          
          <div class="projects__grid" role="list" aria-label="${i18n.t('projects.gridLabel')}" data-projects-grid>
            ${Projects.renderProjects(projects)}
          </div>
        </div>
      </section>
    `;
  }

  static renderProjects(projects) {
    return projects
      .map(
        project => `
      <article 
        class="projects__card" 
        role="listitem" 
        data-category="${project.category}"
      >
        <a 
          href="${project.link}" 
          class="projects__card-link" 
          target="_blank"
          rel="noopener noreferrer"
          aria-label="${i18n.t('projects.viewProject')}: ${project.title}"
        >
          <div class="projects__card-image-wrapper">
            <img 
              src="${project.image.src}"
              srcset="${project.image.srcset}"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              alt="${project.image.alt}"
              class="projects__card-image"
              loading="lazy"
              width="${project.image.width}"
              height="${project.image.height}"
              decoding="async"
            />
            <div class="projects__card-overlay" aria-hidden="true"></div>
          </div>
          <div class="projects__card-content">
            <h3 class="projects__card-title">${project.title}</h3>
            <p class="projects__card-role">${i18n.t('projects.role')}: ${project.role}</p>
            <p class="projects__card-description">${project.description}</p>
            <div class="projects__card-tags" aria-label="${i18n.t('projects.technologies')}">
              ${project.tags.map(tag => `<span class="projects__tag">${tag}</span>`).join('')}
            </div>
          </div>
        </a>
      </article>
    `
      )
      .join('');
  }

  static init() {
    const grid = document.querySelector('.projects__grid');

    if (!grid) return;

    // Lazy loading для изображений с Intersection Observer
    const imageObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            if (img.dataset.src) {
              img.src = img.dataset.src;
              img.removeAttribute('data-src');
            }
            img.classList.add('loaded');
            observer.unobserve(img);
          }
        });
      },
      {
        rootMargin: '50px',
      }
    );

    const images = document.querySelectorAll('.projects__card-image');
    images.forEach(img => {
      if (img.complete) {
        img.classList.add('loaded');
      } else {
        img.addEventListener('load', () => {
          img.classList.add('loaded');
        });
        imageObserver.observe(img);
      }
    });
  }
}

export default Projects;
