import './Admin.scss';
import { ThemeManager } from '../../utils/themeManager.js';

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
            <div class="admin__header-controls">
              <button class="admin__theme-toggle" aria-label="Переключить тему" data-theme-toggle>
                <svg class="admin__theme-icon admin__theme-icon--sun" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="5"></circle>
                  <line x1="12" y1="1" x2="12" y2="3"></line>
                  <line x1="12" y1="21" x2="12" y2="23"></line>
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                  <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                  <line x1="1" y1="12" x2="3" y2="12"></line>
                  <line x1="21" y1="12" x2="23" y2="12"></line>
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                  <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
                </svg>
                <svg class="admin__theme-icon admin__theme-icon--moon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                </svg>
              </button>
              <button class="admin__logout" data-logout-btn>Выйти</button>
            </div>
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
            <button class="admin__main-tab" data-main-tab="contacts">
              Контакты
            </button>
            <button class="admin__main-tab" data-main-tab="content">
              Контент
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
                <button class="admin__btn admin__btn--secondary" data-seed-projects>
                  📦 Добавить начальные проекты
                </button>
              </div>
              <div class="admin__projects-list" data-projects-list></div>
            </div>
            
            <!-- Вкладка Фото -->
            <div class="admin__main-tab-content" data-main-tab-content="photos">
              <div class="admin__photos">
                <div class="admin__photo-section">
                  <h3 class="admin__photo-title">Логотип</h3>
                  
                  <div class="admin__logo-option">
                    <label class="admin__checkbox-label">
                      <input
                        type="checkbox"
                        data-logo-theme-switch
                        class="admin__checkbox"
                      />
                      <span>Менять логотип при переключении темы</span>
                    </label>
                  </div>
                  
                  <div class="admin__logo-single" data-logo-single>
                    <h4 class="admin__photo-subtitle">Единый логотип</h4>
                    <div class="admin__photo-preview admin__photo-preview--logo" data-logo-preview>
                      <div class="admin__photo-placeholder">Логотип не загружен</div>
                    </div>
                    <div class="admin__photo-actions">
                      <input
                        type="file"
                        id="logo-input"
                        accept="image/jpeg,image/jpg,image/png,image/webp,image/svg+xml"
                        data-logo-input
                        style="display: none;"
                      />
                      <label for="logo-input" class="admin__btn admin__btn--primary">
                        Загрузить логотип
                      </label>
                      <button class="admin__btn admin__btn--delete" data-delete-logo style="display: none;">
                        Удалить логотип
                      </button>
                    </div>
                  </div>
                  
                  <div class="admin__logo-dual" data-logo-dual style="display: none;">
                    <div class="admin__logo-theme">
                      <h4 class="admin__photo-subtitle">Логотип для светлой темы (белый фон)</h4>
                      <div class="admin__photo-preview admin__photo-preview--logo" data-logo-light-preview>
                        <div class="admin__photo-placeholder">Логотип не загружен</div>
                      </div>
                      <div class="admin__photo-actions">
                        <input
                          type="file"
                          id="logo-light-input"
                          accept="image/jpeg,image/jpg,image/png,image/webp,image/svg+xml"
                          data-logo-light-input
                          style="display: none;"
                        />
                        <label for="logo-light-input" class="admin__btn admin__btn--primary">
                          Загрузить логотип
                        </label>
                        <button class="admin__btn admin__btn--delete" data-delete-logo-light style="display: none;">
                          Удалить
                        </button>
                      </div>
                    </div>
                    
                    <div class="admin__logo-theme">
                      <h4 class="admin__photo-subtitle">Логотип для темной темы (темный фон)</h4>
                      <div class="admin__photo-preview admin__photo-preview--logo" data-logo-dark-preview>
                        <div class="admin__photo-placeholder">Логотип не загружен</div>
                      </div>
                      <div class="admin__photo-actions">
                        <input
                          type="file"
                          id="logo-dark-input"
                          accept="image/jpeg,image/jpg,image/png,image/webp,image/svg+xml"
                          data-logo-dark-input
                          style="display: none;"
                        />
                        <label for="logo-dark-input" class="admin__btn admin__btn--primary">
                          Загрузить логотип
                        </label>
                        <button class="admin__btn admin__btn--delete" data-delete-logo-dark style="display: none;">
                          Удалить
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                
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
            
            <!-- Вкладка Контакты -->
            <div class="admin__main-tab-content" data-main-tab-content="contacts">
              <div class="admin__contacts">
                <h2 class="admin__section-title">Социальные сети и контакты</h2>
                <p class="admin__section-description">
                  Управляйте ссылками на социальные сети и контактной информацией, которая отображается на сайте
                </p>
                
                <form class="admin__contacts-form" data-contacts-form>
                  <div class="admin__contacts-section">
                    <h3 class="admin__contacts-subtitle">Социальные сети</h3>
                    
                    <div class="admin__socials-list" data-socials-list>
                      <!-- Список соцсетей будет загружен динамически -->
                    </div>
                    
                    <div class="admin__add-social">
                      <h4 class="admin__add-social-title">Добавить новую социальную сеть</h4>
                      <div class="admin__add-social-form">
                        <div class="admin__form-group">
                          <label for="new-social-name" class="admin__label">Название</label>
                          <input
                            type="text"
                            id="new-social-name"
                            class="admin__input"
                            placeholder="Например: Instagram, Twitter, Facebook"
                            data-new-social-name
                            required
                          />
                        </div>
                        <div class="admin__form-group">
                          <label for="new-social-url" class="admin__label">Ссылка</label>
                          <input
                            type="url"
                            id="new-social-url"
                            class="admin__input"
                            placeholder="https://example.com/username"
                            data-new-social-url
                            required
                          />
                        </div>
                        <button type="button" class="admin__btn admin__btn--primary" data-add-social-btn>
                          Добавить
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <div class="admin__contacts-section">
                    <h3 class="admin__contacts-subtitle">Контактная информация</h3>
                    
                    <div class="admin__form-group">
                      <label for="contact-email" class="admin__label">Email</label>
                      <input
                        type="email"
                        id="contact-email"
                        class="admin__input"
                        placeholder="example@email.com"
                        data-contact-email
                      />
                    </div>
                    
                    <div class="admin__form-group">
                      <label for="contact-phone" class="admin__label">Телефон</label>
                      <input
                        type="tel"
                        id="contact-phone"
                        class="admin__input"
                        placeholder="+7 (999) 123-45-67"
                        data-contact-phone
                      />
                    </div>
                  </div>
                  
                  <div class="admin__contacts-actions">
                    <button type="submit" class="admin__btn admin__btn--primary">
                      Сохранить контакты
                    </button>
                    <div class="admin__message" data-contacts-message role="alert"></div>
                  </div>
                </form>
              </div>
            </div>
            
            <!-- Вкладка Контент -->
            <div class="admin__main-tab-content" data-main-tab-content="content">
              <div class="admin__content-editor">
                <h2 class="admin__section-title">Редактирование контента</h2>
                <p class="admin__section-description">
                  Управляйте текстовым содержимым секций сайта
                </p>
                
                <form class="admin__content-form" data-content-form>
                  <div class="admin__content-section">
                    <h3 class="admin__content-subtitle">Секция "О себе"</h3>
                    
                    <div class="admin__form-group">
                      <label for="about-text-ru" class="admin__label">Текст на русском языке</label>
                      <textarea
                        id="about-text-ru"
                        class="admin__textarea"
                        rows="6"
                        placeholder="Введите описание на русском языке..."
                        data-about-text-ru
                      ></textarea>
                    </div>
                    
                    <div class="admin__form-group">
                      <label for="about-text-en" class="admin__label">Текст на английском языке</label>
                      <textarea
                        id="about-text-en"
                        class="admin__textarea"
                        rows="6"
                        placeholder="Enter description in English..."
                        data-about-text-en
                      ></textarea>
                    </div>
                  </div>
                  
                  <div class="admin__content-actions">
                    <button type="submit" class="admin__btn admin__btn--primary">
                      Сохранить контент
                    </button>
                    <div class="admin__message" data-content-message role="alert"></div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  static init() {
    // Инициализация переключателя темы
    this.setupThemeToggle();

    this.checkAuth();
    this.setupLogin();
    this.setupMainTabs();
    this.setupTabs();
    this.setupLogout();
    this.setupArchiveSearch();
    this.setupProjects();
    this.setupPhotos();
    this.setupContacts();
    this.setupContent();
    this.loadTestimonials('pending');
  }

  static setupThemeToggle() {
    const themeToggle = document.querySelector('[data-theme-toggle]');
    if (themeToggle) {
      themeToggle.addEventListener('click', () => {
        ThemeManager.toggleTheme();
      });
    }
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
        } else if (tabName === 'contacts') {
          this.loadContacts();
        } else if (tabName === 'content') {
          this.loadContent();
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

    const seedBtn = document.querySelector('[data-seed-projects]');
    seedBtn?.addEventListener('click', () => {
      this.seedInitialProjects();
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

      // Всегда отправляем как FormData (поддерживает и файлы, и обычные данные)
      const fileFormData = new FormData();
      fileFormData.append('id', projectId || '');
      fileFormData.append('title', projectData.title);
      fileFormData.append('role', projectData.role);
      fileFormData.append('description', projectData.description);
      fileFormData.append('tools', JSON.stringify(projectData.tools));
      fileFormData.append('link', projectData.link);
      fileFormData.append('display_order', projectData.display_order);

      // Добавляем изображение только если оно выбрано
      const imageFile = formData.get('image');
      if (imageFile && imageFile.size > 0) {
        fileFormData.append('image', imageFile);
      }

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
        const errorMsg = result.errors
          ? result.errors.join(', ')
          : result.error || 'Ошибка при сохранении';
        this.showMessage(messageEl, errorMsg, 'error');
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

  static async seedInitialProjects() {
    // eslint-disable-next-line no-alert
    if (
      !window.confirm(
        'Добавить начальные проекты (Точка GG, Приз Бокс, Welcome to Day)?\n\nЕсли проекты уже существуют, операция будет пропущена.'
      )
    ) {
      return;
    }

    const seedBtn = document.querySelector('[data-seed-projects]');
    const originalText = seedBtn.textContent;
    seedBtn.disabled = true;
    seedBtn.textContent = 'Добавление...';

    try {
      const response = await fetch('/api/admin/seed-initial-projects.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      const result = await response.json();

      if (result.success) {
        if (result.skipped) {
          // eslint-disable-next-line no-alert
          alert(`Проекты уже существуют в базе данных (${result.count} проектов)`);
        } else {
          // eslint-disable-next-line no-alert
          alert(`Успешно добавлено ${result.count} проектов:\n${result.projects.join('\n')}`);
          this.loadProjects();
        }
      } else {
        // eslint-disable-next-line no-alert
        alert(`Ошибка: ${result.error || 'Неизвестная ошибка'}`);
      }
    } catch (error) {
      // eslint-disable-next-line no-alert
      alert('Ошибка при добавлении проектов');
    } finally {
      seedBtn.disabled = false;
      seedBtn.textContent = originalText;
    }
  }

  // ========== Управление фото ==========
  static setupPhotos() {
    const logoInput = document.querySelector('[data-logo-input]');
    const logoLightInput = document.querySelector('[data-logo-light-input]');
    const logoDarkInput = document.querySelector('[data-logo-dark-input]');
    const heroInput = document.querySelector('[data-hero-photo-input]');
    const aboutInput = document.querySelector('[data-about-photo-input]');
    const deleteLogoBtn = document.querySelector('[data-delete-logo]');
    const deleteLogoLightBtn = document.querySelector('[data-delete-logo-light]');
    const deleteLogoDarkBtn = document.querySelector('[data-delete-logo-dark]');
    const deleteHeroBtn = document.querySelector('[data-delete-hero-photo]');
    const deleteAboutBtn = document.querySelector('[data-delete-about-photo]');
    const logoThemeSwitch = document.querySelector('[data-logo-theme-switch]');

    // Переключение режима логотипа (единый/по темам)
    logoThemeSwitch?.addEventListener('change', e => {
      const isDual = e.target.checked;
      const logoSingle = document.querySelector('[data-logo-single]');
      const logoDual = document.querySelector('[data-logo-dual]');

      if (logoSingle) logoSingle.style.display = isDual ? 'none' : 'block';
      if (logoDual) logoDual.style.display = isDual ? 'block' : 'none';

      // Сохраняем настройку
      this.saveLogoThemeSwitch(isDual);
    });

    logoInput?.addEventListener('change', e => {
      if (e.target.files[0]) {
        this.uploadPhoto('logo', e.target.files[0]);
      }
    });

    logoLightInput?.addEventListener('change', e => {
      if (e.target.files[0]) {
        this.uploadPhoto('logo_light', e.target.files[0]);
      }
    });

    logoDarkInput?.addEventListener('change', e => {
      if (e.target.files[0]) {
        this.uploadPhoto('logo_dark', e.target.files[0]);
      }
    });

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

    deleteLogoBtn?.addEventListener('click', () => {
      this.deletePhoto('logo');
    });

    deleteLogoLightBtn?.addEventListener('click', () => {
      this.deletePhoto('logo_light');
    });

    deleteLogoDarkBtn?.addEventListener('click', () => {
      this.deletePhoto('logo_dark');
    });

    deleteHeroBtn?.addEventListener('click', () => {
      this.deletePhoto('hero_photo');
    });

    deleteAboutBtn?.addEventListener('click', () => {
      this.deletePhoto('about_photo');
    });
  }

  static async saveLogoThemeSwitch(enabled) {
    try {
      const response = await fetch('/api/admin/save-site-setting.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          setting_key: 'logo_theme_switch',
          value: enabled,
        }),
      });

      const result = await response.json();

      if (!result.success) {
        // eslint-disable-next-line no-alert
        alert(`Ошибка: ${result.error || 'Неизвестная ошибка'}`);
      }
    } catch (error) {
      // eslint-disable-next-line no-alert
      alert('Ошибка при сохранении настройки');
    }
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
    const logoPreview = document.querySelector('[data-logo-preview]');
    const logoLightPreview = document.querySelector('[data-logo-light-preview]');
    const logoDarkPreview = document.querySelector('[data-logo-dark-preview]');
    const heroPreview = document.querySelector('[data-hero-photo-preview]');
    const aboutPreview = document.querySelector('[data-about-photo-preview]');
    const deleteLogoBtn = document.querySelector('[data-delete-logo]');
    const deleteLogoLightBtn = document.querySelector('[data-delete-logo-light]');
    const deleteLogoDarkBtn = document.querySelector('[data-delete-logo-dark]');
    const deleteHeroBtn = document.querySelector('[data-delete-hero-photo]');
    const deleteAboutBtn = document.querySelector('[data-delete-about-photo]');
    const logoThemeSwitch = document.querySelector('[data-logo-theme-switch]');
    const logoSingle = document.querySelector('[data-logo-single]');
    const logoDual = document.querySelector('[data-logo-dual]');

    // Настройка переключения логотипа по темам
    const themeSwitchEnabled = settings.logo_theme_switch || false;
    if (logoThemeSwitch) {
      logoThemeSwitch.checked = themeSwitchEnabled;
    }
    if (logoSingle) logoSingle.style.display = themeSwitchEnabled ? 'none' : 'block';
    if (logoDual) logoDual.style.display = themeSwitchEnabled ? 'block' : 'none';

    // Единый логотип
    if (settings.logo) {
      if (logoPreview) {
        logoPreview.innerHTML = `<img src="${this.escapeHtml(settings.logo)}" alt="Logo" />`;
      }
      if (deleteLogoBtn) deleteLogoBtn.style.display = 'inline-block';
    } else {
      if (logoPreview) {
        logoPreview.innerHTML = '<div class="admin__photo-placeholder">Логотип не загружен</div>';
      }
      if (deleteLogoBtn) deleteLogoBtn.style.display = 'none';
    }

    // Логотип для светлой темы
    if (settings.logo_light) {
      if (logoLightPreview) {
        logoLightPreview.innerHTML = `<img src="${this.escapeHtml(settings.logo_light)}" alt="Logo Light" />`;
      }
      if (deleteLogoLightBtn) deleteLogoLightBtn.style.display = 'inline-block';
    } else {
      if (logoLightPreview) {
        logoLightPreview.innerHTML =
          '<div class="admin__photo-placeholder">Логотип не загружен</div>';
      }
      if (deleteLogoLightBtn) deleteLogoLightBtn.style.display = 'none';
    }

    // Логотип для темной темы
    if (settings.logo_dark) {
      if (logoDarkPreview) {
        logoDarkPreview.innerHTML = `<img src="${this.escapeHtml(settings.logo_dark)}" alt="Logo Dark" />`;
      }
      if (deleteLogoDarkBtn) deleteLogoDarkBtn.style.display = 'inline-block';
    } else {
      if (logoDarkPreview) {
        logoDarkPreview.innerHTML =
          '<div class="admin__photo-placeholder">Логотип не загружен</div>';
      }
      if (deleteLogoDarkBtn) deleteLogoDarkBtn.style.display = 'none';
    }

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

  // ========== Управление контактами ==========
  static setupContacts() {
    const form = document.querySelector('[data-contacts-form]');
    if (!form) return;

    form.addEventListener('submit', async e => {
      e.preventDefault();
      await this.saveContacts();
    });

    // Обработчик добавления новой соцсети
    const addSocialBtn = document.querySelector('[data-add-social-btn]');
    if (addSocialBtn) {
      addSocialBtn.addEventListener('click', () => {
        const { editingIndex } = addSocialBtn.dataset;
        if (editingIndex !== undefined) {
          this.saveSocialEdit(parseInt(editingIndex, 10));
        } else {
          this.addSocial();
        }
      });
    }

    // Обработчики для редактирования и удаления (делегирование событий)
    const socialsList = document.querySelector('[data-socials-list]');
    if (socialsList) {
      socialsList.addEventListener('click', e => {
        if (e.target.matches('[data-edit-social]')) {
          const index = parseInt(e.target.dataset.editSocial, 10);
          this.editSocial(index);
        } else if (e.target.matches('[data-delete-social]')) {
          const index = parseInt(e.target.dataset.deleteSocial, 10);
          this.deleteSocial(index);
        }
      });
    }
  }

  static socials = [];

  static async loadContacts() {
    try {
      const response = await fetch('/api/get-site-settings.php');
      const result = await response.json();

      if (result.success && result.settings) {
        const { settings } = result;

        // Загружаем список соцсетей
        if (settings.contact_socials) {
          try {
            this.socials = JSON.parse(settings.contact_socials);
          } catch (e) {
            console.error('Error parsing socials JSON:', e);
            this.socials = [];
          }
        } else {
          this.socials = [];
        }

        // Отображаем список соцсетей
        this.renderSocials();

        // Заполняем поля контактов
        const emailInput = document.querySelector('[data-contact-email]');
        const phoneInput = document.querySelector('[data-contact-phone]');

        if (emailInput) emailInput.value = settings.contact_email || '';
        if (phoneInput) phoneInput.value = settings.contact_phone || '';
      }
    } catch (error) {
      console.error('Error loading contacts:', error);
    }
  }

  static renderSocials() {
    const socialsList = document.querySelector('[data-socials-list]');
    if (!socialsList) return;

    if (this.socials.length === 0) {
      socialsList.innerHTML =
        '<p class="admin__empty-message">Нет добавленных социальных сетей</p>';
      return;
    }

    socialsList.innerHTML = this.socials
      .map(
        (social, index) => `
      <div class="admin__social-item" data-social-item="${index}">
        <div class="admin__social-info">
          <strong class="admin__social-name">${this.escapeHtml(social.name)}</strong>
          <a href="${this.escapeHtml(social.url)}" target="_blank" rel="noopener noreferrer" class="admin__social-url">
            ${this.escapeHtml(social.url)}
          </a>
        </div>
        <div class="admin__social-actions">
          <button type="button" class="admin__btn admin__btn--small" data-edit-social="${index}">
            Редактировать
          </button>
          <button type="button" class="admin__btn admin__btn--small admin__btn--delete" data-delete-social="${index}">
            Удалить
          </button>
        </div>
      </div>
    `
      )
      .join('');
  }

  static addSocial() {
    const nameInput = document.querySelector('[data-new-social-name]');
    const urlInput = document.querySelector('[data-new-social-url]');

    if (!nameInput || !urlInput) return;

    const name = nameInput.value.trim();
    const url = urlInput.value.trim();

    if (!name || !url) {
      // eslint-disable-next-line no-alert
      alert('Заполните все поля');
      return;
    }

    // Проверка URL
    let urlObj;
    try {
      urlObj = new URL(url);
    } catch (e) {
      // eslint-disable-next-line no-alert
      alert('Введите корректный URL');
      return;
    }
    // Используем urlObj, чтобы избежать ошибки линтера
    if (!urlObj) return;

    // Добавляем новую соцсеть
    this.socials.push({ name, url });
    this.renderSocials();
    this.saveSocials();

    // Очищаем поля
    nameInput.value = '';
    urlInput.value = '';
  }

  static editSocial(index) {
    if (index < 0 || index >= this.socials.length) return;

    const social = this.socials[index];
    const nameInput = document.querySelector('[data-new-social-name]');
    const urlInput = document.querySelector('[data-new-social-url]');
    const addBtn = document.querySelector('[data-add-social-btn]');

    if (!nameInput || !urlInput || !addBtn) return;

    // Заполняем поля для редактирования
    nameInput.value = social.name;
    urlInput.value = social.url;

    // Меняем кнопку на "Сохранить"
    addBtn.textContent = 'Сохранить';
    addBtn.dataset.editingIndex = index.toString();

    // Прокручиваем к форме
    nameInput.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    nameInput.focus();
  }

  static saveSocialEdit(index) {
    if (index < 0 || index >= this.socials.length) return;

    const nameInput = document.querySelector('[data-new-social-name]');
    const urlInput = document.querySelector('[data-new-social-url]');
    const addBtn = document.querySelector('[data-add-social-btn]');

    if (!nameInput || !urlInput || !addBtn) return;

    const name = nameInput.value.trim();
    const url = urlInput.value.trim();

    if (!name || !url) {
      // eslint-disable-next-line no-alert
      alert('Заполните все поля');
      return;
    }

    // Проверка URL
    let urlObj;
    try {
      urlObj = new URL(url);
    } catch (e) {
      // eslint-disable-next-line no-alert
      alert('Введите корректный URL');
      return;
    }
    // Используем urlObj, чтобы избежать ошибки линтера
    if (!urlObj) return;

    // Обновляем соцсеть
    this.socials[index] = { name, url };
    this.renderSocials();
    this.saveSocials();

    // Очищаем поля и возвращаем кнопку
    nameInput.value = '';
    urlInput.value = '';
    addBtn.textContent = 'Добавить';
    delete addBtn.dataset.editingIndex;
  }

  static deleteSocial(index) {
    if (index < 0 || index >= this.socials.length) return;

    // eslint-disable-next-line no-alert
    if (!window.confirm('Вы уверены, что хотите удалить эту социальную сеть?')) {
      return;
    }

    this.socials.splice(index, 1);
    this.renderSocials();
    this.saveSocials();
  }

  static async saveSocials() {
    try {
      const socialsJson = JSON.stringify(this.socials);
      const response = await fetch('/api/admin/save-site-setting.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          setting_key: 'contact_socials',
          value: socialsJson,
        }),
      });

      const result = await response.json();
      if (!result.success) {
        console.error('Error saving socials:', result.error);
        return Promise.reject(new Error(result.error));
      }
      return response;
    } catch (error) {
      console.error('Error saving socials:', error);
      return Promise.reject(error);
    }
  }

  static async saveContacts() {
    const form = document.querySelector('[data-contacts-form]');
    const messageEl = document.querySelector('[data-contacts-message]');
    if (!form) return;

    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;

    // Получаем значения из формы
    const contacts = {
      contact_email: document.querySelector('[data-contact-email]')?.value.trim() || '',
      contact_phone: document.querySelector('[data-contact-phone]')?.value.trim() || '',
    };

    // Показываем состояние загрузки
    submitBtn.disabled = true;
    submitBtn.textContent = 'Сохранение...';

    // Очищаем предыдущие сообщения
    if (messageEl) {
      messageEl.textContent = '';
      messageEl.className = 'admin__message';
    }

    try {
      // Сохраняем контакты (email и phone)
      const savePromises = Object.entries(contacts).map(([key, value]) =>
        fetch('/api/admin/save-site-setting.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            setting_key: key,
            value: value || null,
          }),
        })
      );

      // Также сохраняем соцсети
      savePromises.push(this.saveSocials());

      const responses = await Promise.all(savePromises);
      const results = await Promise.all(
        responses.map(async r => {
          if (r instanceof Response) {
            return r.json();
          }
          return { success: true };
        })
      );

      // Проверяем результаты
      const allSuccess = results.every(r => r.success);

      if (allSuccess) {
        if (messageEl) {
          messageEl.textContent = 'Контакты успешно сохранены';
          messageEl.className = 'admin__message admin__message--success';
        }
      } else {
        const errors = results
          .filter(r => !r.success)
          .map(r => r.error)
          .join(', ');
        if (messageEl) {
          messageEl.textContent = `Ошибка при сохранении: ${errors}`;
          messageEl.className = 'admin__message admin__message--error';
        }
      }
    } catch (error) {
      console.error('Error saving contacts:', error);
      if (messageEl) {
        messageEl.textContent = 'Ошибка при сохранении контактов';
        messageEl.className = 'admin__message admin__message--error';
      }
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
    }
  }

  // ========== Управление контентом ==========
  static setupContent() {
    const form = document.querySelector('[data-content-form]');
    if (!form) return;

    form.addEventListener('submit', async e => {
      e.preventDefault();
      await this.saveContent();
    });
  }

  static async loadContent() {
    try {
      const response = await fetch('/api/get-site-settings.php');
      const result = await response.json();

      if (result.success && result.settings) {
        const { settings } = result;

        const aboutTextRuInput = document.querySelector('[data-about-text-ru]');
        const aboutTextEnInput = document.querySelector('[data-about-text-en]');

        if (aboutTextRuInput) {
          aboutTextRuInput.value = settings.about_text_ru || '';
        }
        if (aboutTextEnInput) {
          aboutTextEnInput.value = settings.about_text_en || '';
        }
      }
    } catch (error) {
      console.error('Error loading content:', error);
    }
  }

  static async saveContent() {
    const form = document.querySelector('[data-content-form]');
    const messageEl = document.querySelector('[data-content-message]');
    if (!form) return;

    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;

    const content = {
      about_text_ru: document.querySelector('[data-about-text-ru]')?.value.trim() || '',
      about_text_en: document.querySelector('[data-about-text-en]')?.value.trim() || '',
    };

    submitBtn.disabled = true;
    submitBtn.textContent = 'Сохранение...';

    if (messageEl) {
      messageEl.textContent = '';
      messageEl.className = 'admin__message';
    }

    try {
      const savePromises = Object.entries(content).map(([key, value]) =>
        fetch('/api/admin/save-site-setting.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            setting_key: key,
            value: value || null,
          }),
        })
      );

      const responses = await Promise.all(savePromises);
      const results = await Promise.all(
        responses.map(async r => {
          if (r instanceof Response) {
            return r.json();
          }
          return { success: true };
        })
      );

      const allSuccess = results.every(r => r.success);

      if (allSuccess) {
        if (messageEl) {
          messageEl.textContent = 'Контент успешно сохранен';
          messageEl.className = 'admin__message admin__message--success';
        }
      } else {
        const errors = results
          .filter(r => !r.success)
          .map(r => r.error)
          .join(', ');
        if (messageEl) {
          messageEl.textContent = `Ошибка при сохранении: ${errors}`;
          messageEl.className = 'admin__message admin__message--error';
        }
      }
    } catch (error) {
      console.error('Error saving content:', error);
      if (messageEl) {
        messageEl.textContent = 'Ошибка при сохранении контента';
        messageEl.className = 'admin__message admin__message--error';
      }
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
    }
  }
}

export default Admin;
