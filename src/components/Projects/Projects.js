import { i18n } from '../../utils/i18n.js';
import './Projects.scss';

class Projects {
  static render() {
    return `
      <section id="projects" class="projects" aria-labelledby="projects-title">
        <div class="container">
          <header class="projects__header">
            <h2 id="projects-title" class="projects__title">${i18n.t('projects.title')}</h2>
            <p class="projects__subtitle">${i18n.t('projects.subtitle')}</p>
          </header>
          
          <div class="projects__grid" role="list" aria-label="${i18n.t('projects.gridLabel')}" data-projects-grid>
            <div class="projects__loading">${i18n.t('projects.loading')}</div>
          </div>
        </div>
      </section>
    `;
  }

  static renderProjects(projects) {
    if (!projects || projects.length === 0) {
      return `<p class="projects__empty">${i18n.t('projects.empty')}</p>`;
    }

    return projects
      .map(project => {
        const imageSrc = project.image || '/images/project-placeholder.svg';

        // Получаем переводы для проекта, если они есть
        const translations = i18n.getObject('projects.translations');
        const projectTranslation =
          translations && typeof translations === 'object' ? translations[project.title] : null;

        // Используем переводы, если они есть, иначе оригинальные данные
        const title = projectTranslation?.title || project.title;
        const role = projectTranslation?.role || project.role;
        const description = projectTranslation?.description || project.description;

        const imageAlt = `${i18n.t('projects.preview')}: ${title}`;
        const tools = Array.isArray(project.tools) ? project.tools : [];

        return `
      <article 
        class="projects__card" 
        role="listitem" 
        data-category="web"
      >
        <a 
          href="${this.escapeHtml(project.link)}" 
          class="projects__card-link" 
          target="_blank"
          rel="noopener noreferrer"
          aria-label="${i18n.t('projects.viewProject')}: ${this.escapeHtml(title)}"
        >
          <div class="projects__card-image-wrapper">
            <img 
              src="${this.escapeHtml(imageSrc)}"
              alt="${this.escapeHtml(imageAlt)}"
              class="projects__card-image"
              loading="lazy"
              width="800"
              height="600"
              decoding="async"
            />
            <div class="projects__card-overlay" aria-hidden="true"></div>
          </div>
          <div class="projects__card-content">
            <h3 class="projects__card-title">${this.escapeHtml(title)}</h3>
            <p class="projects__card-role">${i18n.t('projects.role')}: ${this.escapeHtml(role)}</p>
            <p class="projects__card-description">${this.escapeHtml(description)}</p>
            <div class="projects__card-tags" aria-label="${i18n.t('projects.technologies')}">
              ${tools.map(tool => `<span class="projects__tag">${this.escapeHtml(tool)}</span>`).join('')}
            </div>
          </div>
        </a>
      </article>
    `;
      })
      .join('');
  }

  static escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  static init() {
    this.loadProjects();
    // Перезагружаем проекты при смене языка
    document.addEventListener('languageChanged', () => {
      this.loadProjects();
    });
  }

  static async loadProjects() {
    const grid = document.querySelector('[data-projects-grid]');
    if (!grid) return;

    try {
      const response = await fetch('/api/get-projects.php');
      const result = await response.json();

      if (result.success && result.projects.length > 0) {
        grid.innerHTML = this.renderProjects(result.projects);
        this.initLazyLoading();
      } else {
        grid.innerHTML = `<p class="projects__empty">${i18n.t('projects.empty')}</p>`;
      }
    } catch (error) {
      console.error('Error loading projects:', error);
      grid.innerHTML = `<p class="projects__empty">${i18n.t('projects.error')}</p>`;
    }
  }

  static initLazyLoading() {
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
