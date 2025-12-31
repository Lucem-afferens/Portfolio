import { i18n } from '../../utils/i18n.js';
import './Projects.scss';

class Projects {
  constructor() {
    this.currentFilter = 'all';
    this.projects = [
      {
        id: 1,
        title: 'Project 1',
        category: 'web',
        image: '/images/project1.jpg',
        description: 'Description of project 1',
      },
      {
        id: 2,
        title: 'Project 2',
        category: 'ui',
        image: '/images/project2.jpg',
        description: 'Description of project 2',
      },
      {
        id: 3,
        title: 'Project 3',
        category: 'branding',
        image: '/images/project3.jpg',
        description: 'Description of project 3',
      },
    ];
  }

  static render() {
    const instance = new Projects();
    return `
      <section id="projects" class="projects">
        <div class="container">
          <h2 class="projects__title">${i18n.t('projects.title')}</h2>
          <div class="projects__filters">
            <button class="projects__filter active" data-filter="all">
              ${i18n.t('projects.filter.all')}
            </button>
            <button class="projects__filter" data-filter="ui">
              ${i18n.t('projects.filter.ui')}
            </button>
            <button class="projects__filter" data-filter="web">
              ${i18n.t('projects.filter.web')}
            </button>
            <button class="projects__filter" data-filter="branding">
              ${i18n.t('projects.filter.branding')}
            </button>
          </div>
          <div class="projects__grid" data-projects-grid>
            ${instance.renderProjects(instance.projects)}
          </div>
        </div>
      </section>
    `;
  }

  renderProjects(projects) {
    return projects
      .map(
        (project) => `
      <article class="projects__card" data-category="${project.category}">
        <img 
          src="${project.image}" 
          alt="${project.title}" 
          class="projects__card-image"
          loading="lazy"
          width="400"
          height="300"
        />
        <div class="projects__card-content">
          <h3 class="projects__card-title">${project.title}</h3>
          <p class="projects__card-description">${project.description}</p>
          <a href="#project-${project.id}" class="projects__card-link">
            ${i18n.t('projects.viewProject')}
          </a>
        </div>
      </article>
    `
      )
      .join('');
  }

  static init() {
    const filters = document.querySelectorAll('.projects__filter');
    const grid = document.querySelector('[data-projects-grid]');
    const instance = new Projects();

    filters.forEach((filter) => {
      filter.addEventListener('click', () => {
        const filterValue = filter.dataset.filter;
        
        // Обновляем активный фильтр
        filters.forEach((f) => f.classList.remove('active'));
        filter.classList.add('active');
        
        // Фильтруем проекты
        const cards = grid.querySelectorAll('.projects__card');
        cards.forEach((card) => {
          if (filterValue === 'all' || card.dataset.category === filterValue) {
            card.style.display = 'block';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });

    // Lazy loading для изображений
    const images = document.querySelectorAll('.projects__card-image[loading="lazy"]');
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

export default Projects;

