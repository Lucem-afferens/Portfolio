import './Admin.scss';

class Admin {
  static render() {
    return `
      <div class="admin" id="admin-app">
        <div class="admin__login" data-admin-login>
          <div class="admin__login-container">
            <h1 class="admin__title">Админ-панель</h1>
            <p class="admin__subtitle">Введите пароль для входа</p>
            <form class="admin__login-form" data-login-form>
              <div class="admin__form-group">
                <label for="password" class="admin__label">Пароль</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  class="admin__input"
                  required
                  autocomplete="current-password"
                />
              </div>
              <button type="submit" class="admin__submit">Войти</button>
              <div class="admin__message" data-login-message role="alert"></div>
            </form>
          </div>
        </div>
        
        <div class="admin__panel" data-admin-panel style="display: none;">
          <header class="admin__header">
            <h1 class="admin__panel-title">Админ-панель</h1>
            <button class="admin__logout" data-logout-btn>Выйти</button>
          </header>
          
          <nav class="admin__main-tabs">
            <button class="admin__main-tab active" data-main-tab="testimonials">
              Отзывы
            </button>
            <button class="admin__main-tab" data-main-tab="projects">
              Проекты
            </button>
            <button class="admin__main-tab" data-main-tab="photos">
              Фото
            </button>
          </nav>
          
          <div class="admin__main-content">
            <!-- Вкладка Отзывы -->
            <div class="admin__main-tab-content active" data-main-tab-content="testimonials">
              <nav class="admin__tabs">
                <button class="admin__tab active" data-tab="pending">
                  На модерации <span class="admin__badge" data-pending-count>0</span>
                </button>
                <button class="admin__tab" data-tab="approved">
                  Одобренные
                </button>
                <button class="admin__tab" data-tab="rejected">
                  Архив
                </button>
              </nav>
          
          <div class="admin__content">
            <div class="admin__tab-content active" data-tab-content="pending">
              <div class="admin__testimonials" data-pending-list></div>
            </div>
            <div class="admin__tab-content" data-tab-content="approved">
              <div class="admin__testimonials" data-approved-list></div>
            </div>
            <div class="admin__tab-content" data-tab-content="rejected">
              <div class="admin__search" data-archive-search>
                <div class="admin__search-group">
                  <label for="search-name" class="admin__search-label">Поиск по имени:</label>
                  <input
                    type="text"
                    id="search-name"
                    class="admin__search-input"
                    placeholder="Имя, должность или компания..."
                    data-search-name
                  />
                </div>
                <div class="admin__search-group">
                  <label for="search-date" class="admin__search-label">Поиск по дате:</label>
                  <input
                    type="date"
                    id="search-date"
                    class="admin__search-input"
                    data-search-date
                  />
                </div>
                <button class="admin__btn admin__btn--search" data-search-btn>Поиск</button>
                <button class="admin__btn admin__btn--reset" data-reset-search style="display: none;">Сбросить</button>
              </div>
              <div class="admin__testimonials" data-rejected-list></div>
            </div>
          </div>
            </div>
            
            <!-- Вкладка Проекты -->
            <div class="admin__main-tab-content" data-main-tab-content="projects">
              <div class="admin__projects-header">
                <button class="admin__btn admin__btn--primary" data-add-project>
                  + Добавить проект
                </button>
              </div>
              <div class="admin__projects-list" data-projects-list></div>
            </div>
            
            <!-- Вкладка Фото -->
            <div class="admin__main-tab-content" data-main-tab-content="photos">
              <div class="admin__photos">
                <div class="admin__photo-section">
                  <h3 class="admin__photo-title">Фото на главном экране (Hero)</h3>
                  <div class="admin__photo-preview" data-hero-photo-preview>
                    <div class="admin__photo-placeholder">Нет фото</div>
                  </div>
                  <div class="admin__photo-actions">
                    <input
                      type="file"
                      id="hero-photo-input"
                      accept="image/jpeg,image/jpg,image/png,image/webp"
                      data-hero-photo-input
                      style="display: none;"
                    />
                    <label for="hero-photo-input" class="admin__btn admin__btn--primary">
                      Загрузить фото
                    </label>
                    <button class="admin__btn admin__btn--delete" data-delete-hero-photo style="display: none;">
                      Удалить фото
                    </button>
                  </div>
                </div>
                
                <div class="admin__photo-section">
                  <h3 class="admin__photo-title">Фото в блоке "О себе" (About)</h3>
                  <div class="admin__photo-preview" data-about-photo-preview>
                    <div class="admin__photo-placeholder">Нет фото</div>
                  </div>
                  <div class="admin__photo-actions">
                    <input
                      type="file"
                      id="about-photo-input"
                      accept="image/jpeg,image/jpg,image/png,image/webp"
                      data-about-photo-input
                      style="display: none;"
                    />
                    <label for="about-photo-input" class="admin__btn admin__btn--primary">
                      Загрузить фото
                    </label>
                    <button class="admin__btn admin__btn--delete" data-delete-about-photo style="display: none;">
                      Удалить фото
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  static init() {
    this.checkAuth();
    this.setupLogin();
    this.setupMainTabs();
    this.setupTabs();
    this.setupLogout();
    this.setupArchiveSearch();
    this.setupProjects();
    this.setupPhotos();
    this.loadTestimonials('pending');
  }

  static checkAuth() {
    // Проверка авторизации через API
    fetch('/api/get-pending-testimonials.php')
      .then(response => {
        if (response.ok) {
          this.showPanel();
        } else {
          this.showLogin();
        }
      })
      .catch(() => {
        this.showLogin();
      });
  }

  static showLogin() {
    document.querySelector('[data-admin-login]').style.display = 'block';
    document.querySelector('[data-admin-panel]').style.display = 'none';
  }

  static showPanel() {
    document.querySelector('[data-admin-login]').style.display = 'none';
    document.querySelector('[data-admin-panel]').style.display = 'block';
  }

  static setupLogin() {
    const form = document.querySelector('[data-login-form]');
    const messageEl = document.querySelector('[data-login-message]');

    form?.addEventListener('submit', async e => {
      e.preventDefault();
      const formData = new FormData(form);
      const password = formData.get('password');

      const submitBtn = form.querySelector('button[type="submit"]');
      submitBtn.disabled = true;
      submitBtn.textContent = 'Вход...';

      try {
        const response = await fetch('/api/login.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ password }),
        });

        const result = await response.json();

        if (result.success) {
          this.showPanel();
          this.loadTestimonials('pending');
        } else {
          this.showMessage(messageEl, result.error || 'Неверный пароль', 'error');
        }
      } catch (error) {
        this.showMessage(messageEl, 'Ошибка при входе', 'error');
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Войти';
      }
    });
  }

  static setupTabs() {
    const tabs = document.querySelectorAll('[data-tab]');
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const tabName = tab.dataset.tab;

        // Обновляем активные табы
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        // Показываем нужный контент (только внутри вкладки отзывов)
        const testimonialsContent = document.querySelector(
          '[data-main-tab-content="testimonials"]'
        );
        if (testimonialsContent) {
          testimonialsContent.querySelectorAll('[data-tab-content]').forEach(content => {
            content.classList.remove('active');
          });
          const targetContent = testimonialsContent.querySelector(
            `[data-tab-content="${tabName}"]`
          );
          if (targetContent) targetContent.classList.add('active');
        }

        // Загружаем данные
        if (tabName === 'rejected') {
          // Сохраняем параметры поиска при переключении на архив
          const searchName = document.querySelector('[data-search-name]')?.value || '';
          const searchDate = document.querySelector('[data-search-date]')?.value || '';
          this.loadTestimonials(tabName, { name: searchName, date: searchDate });
        } else {
          this.loadTestimonials(tabName);
        }
      });
    });
  }

  static setupArchiveSearch() {
    const searchBtn = document.querySelector('[data-search-btn]');
    const resetBtn = document.querySelector('[data-reset-search]');
    const searchNameInput = document.querySelector('[data-search-name]');
    const searchDateInput = document.querySelector('[data-search-date]');

    // Поиск
    searchBtn?.addEventListener('click', () => {
      const name = searchNameInput?.value.trim() || '';
      const date = searchDateInput?.value || '';

      if (name || date) {
        this.loadTestimonials('rejected', { name, date });
        resetBtn.style.display = 'inline-block';
      }
    });

    // Сброс поиска
    resetBtn?.addEventListener('click', () => {
      if (searchNameInput) searchNameInput.value = '';
      if (searchDateInput) searchDateInput.value = '';
      resetBtn.style.display = 'none';
      this.loadTestimonials('rejected');
    });

    // Поиск по Enter
    searchNameInput?.addEventListener('keypress', e => {
      if (e.key === 'Enter') {
        e.preventDefault();
        searchBtn.click();
      }
    });
  }

  static setupLogout() {
    document.querySelector('[data-logout-btn]')?.addEventListener('click', async () => {
      await fetch('/api/logout.php');
      this.showLogin();
    });
  }

  static async loadTestimonials(status, searchParams = {}) {
    let endpoint = '';
    let listEl = null;

    switch (status) {
      case 'pending':
        endpoint = '/api/get-pending-testimonials.php';
        listEl = document.querySelector('[data-pending-list]');
        break;
      case 'approved':
        endpoint = '/api/get-testimonials.php';
        listEl = document.querySelector('[data-approved-list]');
        break;
      case 'rejected': {
        // Добавляем параметры поиска для архива
        const searchQuery = new URLSearchParams();
        if (searchParams.name) searchQuery.append('name', searchParams.name);
        if (searchParams.date) searchQuery.append('date', searchParams.date);
        endpoint = `/api/get-rejected-testimonials.php${
          searchQuery.toString() ? `?${searchQuery.toString()}` : ''
        }`;
        listEl = document.querySelector('[data-rejected-list]');
        break;
      }
      default:
        return;
    }

    if (!listEl) return;

    listEl.innerHTML = '<div class="admin__loading">Загрузка...</div>';

    try {
      const response = await fetch(endpoint);
      const result = await response.json();

      if (result.success) {
        this.renderTestimonials(listEl, result.testimonials, status);

        // Обновляем счетчик
        if (status === 'pending') {
          const countEl = document.querySelector('[data-pending-count]');
          if (countEl) countEl.textContent = result.testimonials.length;
        }
      } else {
        listEl.innerHTML = '<div class="admin__error">Ошибка загрузки</div>';
      }
    } catch (error) {
      listEl.innerHTML = '<div class="admin__error">Ошибка загрузки</div>';
    }
  }

  static renderTestimonials(containerEl, testimonials, status) {
    const container = containerEl;

    if (testimonials.length === 0) {
      container.innerHTML = '<div class="admin__empty">Нет отзывов</div>';
      return;
    }

    container.innerHTML = testimonials
      .map(testimonial => {
        // Проверяем наличие фото (может быть null, пустой строкой или путем)
        const hasPhoto = testimonial.photo && testimonial.photo.trim() !== '';
        const photoPath = hasPhoto ? testimonial.photo.trim() : null;
        const photoHtml = photoPath
          ? `<div class="admin__testimonial-photo">
              <img 
                src="${this.escapeHtml(photoPath)}" 
                alt="${this.escapeHtml(testimonial.name)}"
                loading="lazy"
              />
            </div>`
          : '<div class="admin__testimonial-photo admin__testimonial-photo--empty">Нет фото</div>';

        return `
      <div class="admin__testimonial-card" data-testimonial-id="${testimonial.id}">
        <div class="admin__testimonial-header">
          <div class="admin__testimonial-info">
            ${photoHtml}
            <div class="admin__testimonial-text">
              <h3 class="admin__testimonial-name">${this.escapeHtml(testimonial.name)}</h3>
              ${testimonial.position ? `<p class="admin__testimonial-position">${this.escapeHtml(testimonial.position)}</p>` : ''}
              ${testimonial.company ? `<p class="admin__testimonial-company">${this.escapeHtml(testimonial.company)}</p>` : ''}
            </div>
          </div>
          <div class="admin__testimonial-date">
            ${new Date(testimonial.created_at).toLocaleDateString('ru-RU')}
          </div>
        </div>
        <p class="admin__testimonial-message">${this.escapeHtml(testimonial.message)}</p>
        ${testimonial.rejection_reason ? `<p class="admin__rejection-reason"><strong>Причина отклонения:</strong> ${this.escapeHtml(testimonial.rejection_reason)}</p>` : ''}
        <div class="admin__testimonial-actions">
          ${
            status === 'pending'
              ? `
            <button class="admin__btn admin__btn--approve" data-approve="${testimonial.id}">
              Одобрить
            </button>
            <button class="admin__btn admin__btn--reject" data-reject="${testimonial.id}">
              Отклонить
            </button>
            <button class="admin__btn admin__btn--delete" data-delete="${testimonial.id}">
              Удалить
            </button>
          `
              : `
            <button class="admin__btn admin__btn--delete" data-delete="${testimonial.id}">
              Удалить
            </button>
          `
          }
        </div>
        ${
          status === 'pending'
            ? `
          <div class="admin__reject-form" data-reject-form="${testimonial.id}" style="display: none;">
            <textarea class="admin__reject-reason-input" placeholder="Укажите причину отклонения (опционально)"></textarea>
            <div class="admin__reject-actions">
              <button class="admin__btn admin__btn--confirm-reject" data-confirm-reject="${testimonial.id}">
                Подтвердить отклонение
              </button>
              <button class="admin__btn admin__btn--cancel-reject" data-cancel-reject="${testimonial.id}">
                Отмена
              </button>
            </div>
          </div>
        `
            : ''
        }
      </div>
    `;
      })
      .join('');

    // Обработчики для кнопок
    if (status === 'pending') {
      container.querySelectorAll('[data-approve]').forEach(btn => {
        btn.addEventListener('click', () => {
          this.moderateTestimonial(btn.dataset.approve, 'approve');
        });
      });

      container.querySelectorAll('[data-reject]').forEach(btn => {
        btn.addEventListener('click', () => {
          const form = document.querySelector(`[data-reject-form="${btn.dataset.reject}"]`);
          form.style.display = 'block';
        });
      });

      container.querySelectorAll('[data-confirm-reject]').forEach(btn => {
        btn.addEventListener('click', () => {
          const form = document.querySelector(`[data-reject-form="${btn.dataset.confirmReject}"]`);
          const reason = form.querySelector('textarea').value;
          this.moderateTestimonial(btn.dataset.confirmReject, 'reject', reason);
        });
      });

      container.querySelectorAll('[data-cancel-reject]').forEach(btn => {
        btn.addEventListener('click', () => {
          const form = document.querySelector(`[data-reject-form="${btn.dataset.cancelReject}"]`);
          form.style.display = 'none';
        });
      });
    }

    // Обработчики для кнопок удаления (для всех статусов)
    container.querySelectorAll('[data-delete]').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.delete;
        // eslint-disable-next-line no-alert
        if (
          window.confirm('Вы уверены, что хотите удалить этот отзыв? Это действие нельзя отменить.')
        ) {
          this.deleteTestimonial(id, status);
        }
      });
    });
  }

  static async moderateTestimonial(id, action, reason = null) {
    try {
      const response = await fetch('/api/moderate-testimonial.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: parseInt(id, 10),
          action,
          rejection_reason: reason,
        }),
      });

      const result = await response.json();

      if (result.success) {
        this.loadTestimonials('pending');
        // eslint-disable-next-line no-alert
        alert(result.message);
      } else {
        // eslint-disable-next-line no-alert
        alert(`Ошибка: ${result.error || 'Неизвестная ошибка'}`);
      }
    } catch (error) {
      // eslint-disable-next-line no-alert
      alert('Ошибка при модерации отзыва');
    }
  }

  static async deleteTestimonial(id, status) {
    try {
      const response = await fetch('/api/delete-testimonial.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: parseInt(id, 10) }),
      });

      const result = await response.json();

      if (result.success) {
        // Перезагружаем список отзывов
        if (status === 'rejected') {
          // Сохраняем параметры поиска
          const searchName = document.querySelector('[data-search-name]')?.value || '';
          const searchDate = document.querySelector('[data-search-date]')?.value || '';
          this.loadTestimonials(status, { name: searchName, date: searchDate });
        } else {
          this.loadTestimonials(status);
        }
        // eslint-disable-next-line no-alert
        alert(result.message || 'Отзыв успешно удален');
      } else {
        // eslint-disable-next-line no-alert
        alert(`Ошибка: ${result.error || 'Неизвестная ошибка'}`);
      }
    } catch (error) {
      // eslint-disable-next-line no-alert
      alert('Ошибка при удалении отзыва');
    }
  }

  static showMessage(element, message, type) {
    if (!element) return;
    const messageEl = element;
    messageEl.textContent = message;
    messageEl.className = `admin__message admin__message--${type}`;
    messageEl.style.display = 'block';
  }

  static escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  // ========== Управление главными вкладками ==========
  static setupMainTabs() {
    const mainTabs = document.querySelectorAll('[data-main-tab]');
    mainTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const tabName = tab.dataset.mainTab;

        // Обновляем активные табы
        mainTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        // Показываем нужный контент
        document.querySelectorAll('[data-main-tab-content]').forEach(content => {
          content.classList.remove('active');
        });
        document.querySelector(`[data-main-tab-content="${tabName}"]`).classList.add('active');

        // Загружаем данные для вкладки
        if (tabName === 'projects') {
          this.loadProjects();
        } else if (tabName === 'photos') {
          this.loadPhotos();
        }
      });
    });
  }

  // ========== Управление проектами ==========
  static setupProjects() {
    const addBtn = document.querySelector('[data-add-project]');
    addBtn?.addEventListener('click', () => {
      this.showProjectForm();
    });
  }

  static async loadProjects() {
    const listEl = document.querySelector('[data-projects-list]');
    if (!listEl) return;

    listEl.innerHTML = '<div class="admin__loading">Загрузка...</div>';

    try {
      const response = await fetch('/api/admin/get-projects.php');
      const result = await response.json();

      if (result.success) {
        this.renderProjects(listEl, result.projects);
      } else {
        listEl.innerHTML = '<div class="admin__error">Ошибка загрузки</div>';
      }
    } catch (error) {
      listEl.innerHTML = '<div class="admin__error">Ошибка загрузки</div>';
    }
  }

  static renderProjects(containerEl, projects) {
    const container = containerEl;
    if (projects.length === 0) {
      container.innerHTML = '<div class="admin__empty">Проектов пока нет</div>';
      return;
    }

    container.innerHTML = projects
      .map(
        project => `
      <div class="admin__project-card" data-project-id="${project.id}">
        <div class="admin__project-header">
          ${project.image ? `<img src="${this.escapeHtml(project.image)}" alt="${this.escapeHtml(project.title)}" class="admin__project-image" />` : ''}
          <div class="admin__project-info">
            <h3 class="admin__project-title">${this.escapeHtml(project.title)}</h3>
            <p class="admin__project-role">${this.escapeHtml(project.role)}</p>
            <p class="admin__project-description">${this.escapeHtml(project.description)}</p>
            <div class="admin__project-tools">
              ${Array.isArray(project.tools) ? project.tools.map(tool => `<span class="admin__tool-tag">${this.escapeHtml(tool)}</span>`).join('') : ''}
            </div>
            <a href="${this.escapeHtml(project.link)}" target="_blank" rel="noopener noreferrer" class="admin__project-link">
              ${this.escapeHtml(project.link)}
            </a>
          </div>
        </div>
        <div class="admin__project-actions">
          <button class="admin__btn admin__btn--edit" data-edit-project="${project.id}">
            Редактировать
          </button>
          <button class="admin__btn admin__btn--delete" data-delete-project="${project.id}">
            Удалить
          </button>
        </div>
      </div>
    `
      )
      .join('');

    // Обработчики
    container.querySelectorAll('[data-edit-project]').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.editProject;
        this.showProjectForm(id);
      });
    });

    container.querySelectorAll('[data-delete-project]').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.deleteProject;
        // eslint-disable-next-line no-alert
        if (window.confirm('Вы уверены, что хотите удалить этот проект?')) {
          this.deleteProject(id);
        }
      });
    });
  }

  static async showProjectForm(projectId = null) {
    let project = null;

    if (projectId) {
      try {
        const response = await fetch('/api/admin/get-projects.php');
        const result = await response.json();
        if (result.success) {
          project = result.projects.find(p => p.id === parseInt(projectId, 10));
        }
      } catch (error) {
        console.error('Error loading project:', error);
      }
    }

    const formHtml = `
      <div class="admin__modal-overlay" data-project-modal-overlay>
        <div class="admin__modal">
          <div class="admin__modal-header">
            <h2 class="admin__modal-title">${project ? 'Редактировать проект' : 'Добавить проект'}</h2>
            <button class="admin__modal-close" data-close-project-modal>×</button>
          </div>
          <form class="admin__project-form" data-project-form enctype="multipart/form-data">
            <input type="hidden" name="id" value="${project ? project.id : ''}" />
            
            <div class="admin__form-group">
              <label for="project-title" class="admin__label">Название *</label>
              <input
                type="text"
                id="project-title"
                name="title"
                class="admin__input"
                value="${project ? this.escapeHtml(project.title) : ''}"
                required
                maxlength="255"
              />
            </div>
            
            <div class="admin__form-group">
              <label for="project-role" class="admin__label">Роль *</label>
              <input
                type="text"
                id="project-role"
                name="role"
                class="admin__input"
                value="${project ? this.escapeHtml(project.role) : ''}"
                required
                maxlength="255"
              />
            </div>
            
            <div class="admin__form-group">
              <label for="project-description" class="admin__label">Описание *</label>
              <textarea
                id="project-description"
                name="description"
                class="admin__textarea"
                rows="4"
                required
              >${project ? this.escapeHtml(project.description) : ''}</textarea>
            </div>
            
            <div class="admin__form-group">
              <label for="project-tools" class="admin__label">Инструменты (через запятую) *</label>
              <input
                type="text"
                id="project-tools"
                name="tools"
                class="admin__input"
                value="${project && Array.isArray(project.tools) ? this.escapeHtml(project.tools.join(', ')) : ''}"
                placeholder="Например: React, TypeScript, Node.js"
                required
              />
              <small class="admin__hint">Введите инструменты через запятую</small>
            </div>
            
            <div class="admin__form-group">
              <label for="project-link" class="admin__label">Ссылка на проект *</label>
              <input
                type="url"
                id="project-link"
                name="link"
                class="admin__input"
                value="${project ? this.escapeHtml(project.link) : ''}"
                required
                placeholder="https://example.com"
              />
            </div>
            
            <div class="admin__form-group">
              <label for="project-image" class="admin__label">Изображение</label>
              ${
                project && project.image
                  ? `
                <div class="admin__project-image-preview">
                  <img src="${this.escapeHtml(project.image)}" alt="Current image" />
                  <p>Текущее изображение</p>
                </div>
              `
                  : ''
              }
              <input
                type="file"
                id="project-image"
                name="image"
                class="admin__file-input"
                accept="image/jpeg,image/jpg,image/png,image/webp"
              />
              <small class="admin__hint">Форматы: JPG, PNG, WebP. Максимальный размер: 5 МБ</small>
            </div>
            
            <div class="admin__form-group">
              <label for="project-order" class="admin__label">Порядок отображения</label>
              <input
                type="number"
                id="project-order"
                name="display_order"
                class="admin__input"
                value="${project ? project.display_order || 0 : 0}"
                min="0"
              />
              <small class="admin__hint">Меньшее число = выше в списке</small>
            </div>
            
            <div class="admin__modal-actions">
              <button type="submit" class="admin__btn admin__btn--primary">
                ${project ? 'Сохранить' : 'Создать'}
              </button>
              <button type="button" class="admin__btn admin__btn--cancel" data-close-project-modal>
                Отмена
              </button>
            </div>
            
            <div class="admin__message" data-project-form-message role="alert"></div>
          </form>
        </div>
      </div>
    `;

    // Удаляем существующую модалку, если есть
    const existingModal = document.querySelector('[data-project-modal-overlay]');
    if (existingModal) {
      existingModal.remove();
    }

    // Добавляем модалку
    document.body.insertAdjacentHTML('beforeend', formHtml);

    // Обработчики
    const overlay = document.querySelector('[data-project-modal-overlay]');
    const closeBtns = document.querySelectorAll('[data-close-project-modal]');
    const form = document.querySelector('[data-project-form]');

    closeBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        overlay.remove();
      });
    });

    overlay.addEventListener('click', e => {
      if (e.target === overlay) {
        overlay.remove();
      }
    });

    form.addEventListener('submit', async e => {
      e.preventDefault();
      await this.saveProject(form, projectId);
    });
  }

  static async saveProject(form, projectId) {
    const messageEl = form.querySelector('[data-project-form-message]');
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;

    submitBtn.disabled = true;
    submitBtn.textContent = 'Сохранение...';

    try {
      const formData = new FormData(form);

      // Преобразуем tools из строки в массив
      const toolsStr = formData.get('tools');
      const tools = toolsStr
        .split(',')
        .map(t => t.trim())
        .filter(t => t.length > 0);

      // Создаем JSON для отправки
      const projectData = {
        id: projectId ? parseInt(projectId, 10) : null,
        title: formData.get('title'),
        role: formData.get('role'),
        description: formData.get('description'),
        tools,
        link: formData.get('link'),
        display_order: parseInt(formData.get('display_order') || '0', 10),
      };

      // Если есть новое изображение, добавляем его
      if (formData.get('image') && formData.get('image').size > 0) {
        // Отправляем как FormData для поддержки файла
        const fileFormData = new FormData();
        fileFormData.append('id', projectId || '');
        fileFormData.append('title', projectData.title);
        fileFormData.append('role', projectData.role);
        fileFormData.append('description', projectData.description);
        fileFormData.append('tools', JSON.stringify(projectData.tools));
        fileFormData.append('link', projectData.link);
        fileFormData.append('display_order', projectData.display_order);
        fileFormData.append('image', formData.get('image'));

        const response = await fetch('/api/admin/save-project.php', {
          method: 'POST',
          body: fileFormData,
        });

        const result = await response.json();

        if (result.success) {
          this.showMessage(messageEl, 'Проект сохранен', 'success');
          setTimeout(() => {
            document.querySelector('[data-project-modal-overlay]')?.remove();
            this.loadProjects();
          }, 1000);
        } else {
          this.showMessage(messageEl, result.error || 'Ошибка при сохранении', 'error');
        }
      } else {
        // Отправляем как JSON без файла
        const response = await fetch('/api/admin/save-project.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(projectData),
        });

        const result = await response.json();

        if (result.success) {
          this.showMessage(messageEl, 'Проект сохранен', 'success');
          setTimeout(() => {
            document.querySelector('[data-project-modal-overlay]')?.remove();
            this.loadProjects();
          }, 1000);
        } else {
          this.showMessage(messageEl, result.error || 'Ошибка при сохранении', 'error');
        }
      }
    } catch (error) {
      this.showMessage(messageEl, 'Ошибка при сохранении проекта', 'error');
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
    }
  }

  static async deleteProject(id) {
    try {
      const response = await fetch('/api/admin/delete-project.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: parseInt(id, 10) }),
      });

      const result = await response.json();

      if (result.success) {
        this.loadProjects();
        // eslint-disable-next-line no-alert
        alert('Проект удален');
      } else {
        // eslint-disable-next-line no-alert
        alert(`Ошибка: ${result.error || 'Неизвестная ошибка'}`);
      }
    } catch (error) {
      // eslint-disable-next-line no-alert
      alert('Ошибка при удалении проекта');
    }
  }

  // ========== Управление фото ==========
  static setupPhotos() {
    const heroInput = document.querySelector('[data-hero-photo-input]');
    const aboutInput = document.querySelector('[data-about-photo-input]');
    const deleteHeroBtn = document.querySelector('[data-delete-hero-photo]');
    const deleteAboutBtn = document.querySelector('[data-delete-about-photo]');

    heroInput?.addEventListener('change', e => {
      if (e.target.files[0]) {
        this.uploadPhoto('hero_photo', e.target.files[0]);
      }
    });

    aboutInput?.addEventListener('change', e => {
      if (e.target.files[0]) {
        this.uploadPhoto('about_photo', e.target.files[0]);
      }
    });

    deleteHeroBtn?.addEventListener('click', () => {
      this.deletePhoto('hero_photo');
    });

    deleteAboutBtn?.addEventListener('click', () => {
      this.deletePhoto('about_photo');
    });
  }

  static async loadPhotos() {
    try {
      const response = await fetch('/api/get-site-settings.php');
      const result = await response.json();

      if (result.success) {
        this.renderPhotos(result.settings);
      }
    } catch (error) {
      console.error('Error loading photos:', error);
    }
  }

  static renderPhotos(settings) {
    const heroPreview = document.querySelector('[data-hero-photo-preview]');
    const aboutPreview = document.querySelector('[data-about-photo-preview]');
    const deleteHeroBtn = document.querySelector('[data-delete-hero-photo]');
    const deleteAboutBtn = document.querySelector('[data-delete-about-photo]');

    // Hero photo
    if (settings.hero_photo) {
      if (heroPreview) {
        heroPreview.innerHTML = `<img src="${this.escapeHtml(settings.hero_photo)}" alt="Hero photo" />`;
      }
      if (deleteHeroBtn) deleteHeroBtn.style.display = 'inline-block';
    } else {
      if (heroPreview) {
        heroPreview.innerHTML = '<div class="admin__photo-placeholder">Нет фото</div>';
      }
      if (deleteHeroBtn) deleteHeroBtn.style.display = 'none';
    }

    // About photo
    if (settings.about_photo) {
      if (aboutPreview) {
        aboutPreview.innerHTML = `<img src="${this.escapeHtml(settings.about_photo)}" alt="About photo" />`;
      }
      if (deleteAboutBtn) deleteAboutBtn.style.display = 'inline-block';
    } else {
      if (aboutPreview) {
        aboutPreview.innerHTML = '<div class="admin__photo-placeholder">Нет фото</div>';
      }
      if (deleteAboutBtn) deleteAboutBtn.style.display = 'none';
    }
  }

  static async uploadPhoto(settingKey, file) {
    const formData = new FormData();
    formData.append('setting_key', settingKey);
    formData.append('photo', file);

    try {
      const response = await fetch('/api/admin/save-site-setting.php', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        this.loadPhotos();
        // eslint-disable-next-line no-alert
        alert('Фото загружено');
      } else {
        // eslint-disable-next-line no-alert
        alert(`Ошибка: ${result.error || 'Неизвестная ошибка'}`);
      }
    } catch (error) {
      // eslint-disable-next-line no-alert
      alert('Ошибка при загрузке фото');
    }
  }

  static async deletePhoto(settingKey) {
    // eslint-disable-next-line no-alert
    if (!window.confirm('Вы уверены, что хотите удалить это фото?')) {
      return;
    }

    try {
      const response = await fetch('/api/admin/save-site-setting.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          setting_key: settingKey,
          delete: true,
        }),
      });

      const result = await response.json();

      if (result.success) {
        this.loadPhotos();
        // eslint-disable-next-line no-alert
        alert('Фото удалено');
      } else {
        // eslint-disable-next-line no-alert
        alert(`Ошибка: ${result.error || 'Неизвестная ошибка'}`);
      }
    } catch (error) {
      // eslint-disable-next-line no-alert
      alert('Ошибка при удалении фото');
    }
  }
}

export default Admin;
