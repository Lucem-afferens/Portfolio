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
            <h1 class="admin__panel-title">Модерация отзывов</h1>
            <button class="admin__logout" data-logout-btn>Выйти</button>
          </header>
          
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
      </div>
    `;
  }

  static init() {
    this.checkAuth();
    this.setupLogin();
    this.setupTabs();
    this.setupLogout();
    this.setupArchiveSearch();
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

        // Показываем нужный контент
        document.querySelectorAll('[data-tab-content]').forEach(content => {
          content.classList.remove('active');
        });
        document.querySelector(`[data-tab-content="${tabName}"]`).classList.add('active');

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
      .map(
        testimonial => `
      <div class="admin__testimonial-card" data-testimonial-id="${testimonial.id}">
        <div class="admin__testimonial-header">
          <div>
            ${
              testimonial.photo
                ? `
              <div class="admin__testimonial-photo">
                <img src="${this.escapeHtml(testimonial.photo)}" alt="${this.escapeHtml(testimonial.name)}" />
              </div>
            `
                : ''
            }
            <h3 class="admin__testimonial-name">${this.escapeHtml(testimonial.name)}</h3>
            ${testimonial.position ? `<p class="admin__testimonial-position">${this.escapeHtml(testimonial.position)}</p>` : ''}
            ${testimonial.company ? `<p class="admin__testimonial-company">${this.escapeHtml(testimonial.company)}</p>` : ''}
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
    `
      )
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
}

export default Admin;
