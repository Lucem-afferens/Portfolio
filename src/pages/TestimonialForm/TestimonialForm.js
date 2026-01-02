import './TestimonialForm.scss';
import { ThemeManager } from '../../utils/themeManager.js';
import { i18n } from '../../utils/i18n.js';

class TestimonialForm {
  static render() {
    return `
      <section class="testimonial-form">
        <div class="container">
          <div class="testimonial-form__controls-wrapper">
            <div class="testimonial-form__lang-toggle-wrapper">
              <button class="testimonial-form__lang-toggle" aria-label="Toggle language" data-lang-toggle>
                <svg class="testimonial-form__lang-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="2" y1="12" x2="22" y2="12"></line>
                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                </svg>
                <span class="testimonial-form__lang-text">${i18n.getCurrentLanguage().toUpperCase()}</span>
              </button>
            </div>
            <div class="testimonial-form__theme-toggle-wrapper">
              <button class="testimonial-form__theme-toggle" aria-label="Переключить тему" data-theme-toggle>
              <svg class="testimonial-form__theme-icon testimonial-form__theme-icon--sun" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
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
              <svg class="testimonial-form__theme-icon testimonial-form__theme-icon--moon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
              </svg>
            </button>
          </div>
          <header class="testimonial-form__header">
            <h1 class="testimonial-form__title">Оставить отзыв</h1>
            <p class="testimonial-form__subtitle">
              Ваше мнение очень важно для меня. Поделитесь своим опытом работы со мной.
            </p>
          </header>
          
          <form class="testimonial-form__form" data-testimonial-form enctype="multipart/form-data">
            <div class="testimonial-form__group">
              <label for="name" class="testimonial-form__label">
                Ваше имя <span class="required">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                class="testimonial-form__input"
                required
                minlength="2"
                maxlength="255"
                autocomplete="name"
              />
            </div>
            
            <div class="testimonial-form__group">
              <label for="position" class="testimonial-form__label">
                Должность
              </label>
              <input
                type="text"
                id="position"
                name="position"
                class="testimonial-form__input"
                maxlength="255"
                autocomplete="organization-title"
              />
            </div>
            
            <div class="testimonial-form__group">
              <label for="company" class="testimonial-form__label">
                Компания
              </label>
              <input
                type="text"
                id="company"
                name="company"
                class="testimonial-form__input"
                maxlength="255"
                autocomplete="organization"
              />
            </div>
            
            <div class="testimonial-form__group">
              <label for="message" class="testimonial-form__label">
                Ваш отзыв <span class="required">*</span>
              </label>
              <textarea
                id="message"
                name="message"
                class="testimonial-form__textarea"
                rows="6"
                required
                minlength="10"
                maxlength="2000"
                placeholder="Расскажите о вашем опыте работы..."
              ></textarea>
              <span class="testimonial-form__counter">
                <span data-char-count>0</span> / 2000
              </span>
            </div>
            
            <div class="testimonial-form__group">
              <label for="photo" class="testimonial-form__label">
                Ваша фотография (опционально)
              </label>
              <input
                type="file"
                id="photo"
                name="photo"
                class="testimonial-form__file-input"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                data-photo-input
              />
              <div class="testimonial-form__photo-preview" data-photo-preview style="display: none;">
                <img src="" alt="Превью фото" data-preview-image />
                <button type="button" class="testimonial-form__remove-photo" data-remove-photo>
                  Удалить фото
                </button>
              </div>
              <p class="testimonial-form__file-hint">
                Форматы: JPG, PNG, WebP. Максимальный размер: 5 МБ
              </p>
            </div>
            
            <button type="submit" class="testimonial-form__submit">
              Отправить отзыв
            </button>
            
            <div class="testimonial-form__message" data-form-message role="alert" aria-live="polite"></div>
          </form>
        </div>
      </section>
    `;
  }

  static init() {
    // Инициализация переключателя темы
    const themeToggle = document.querySelector('[data-theme-toggle]');
    if (themeToggle) {
      themeToggle.addEventListener('click', () => {
        ThemeManager.toggleTheme();
      });
    }

    // Инициализация переключателя языка
    const langToggle = document.querySelector('[data-lang-toggle]');
    if (langToggle) {
      langToggle.addEventListener('click', () => {
        const currentLang = i18n.getCurrentLanguage();
        i18n.setLanguage(currentLang === 'ru' ? 'en' : 'ru');
        // Перезагрузка страницы для обновления контента
        window.location.reload();
      });
    }

    const form = document.querySelector('[data-testimonial-form]');
    const messageEl = document.querySelector('[data-form-message]');
    const charCountEl = document.querySelector('[data-char-count]');
    const textarea = document.querySelector('#message');
    const photoInput = document.querySelector('[data-photo-input]');
    const photoPreview = document.querySelector('[data-photo-preview]');
    const previewImage = document.querySelector('[data-preview-image]');
    const removePhotoBtn = document.querySelector('[data-remove-photo]');

    if (!form) return;

    // Счетчик символов
    if (textarea && charCountEl) {
      textarea.addEventListener('input', () => {
        charCountEl.textContent = textarea.value.length;
      });
    }

    // Обработка загрузки фото
    if (photoInput) {
      photoInput.addEventListener('change', e => {
        const file = e.target.files[0];
        if (file) {
          // Валидация размера (5 МБ)
          if (file.size > 5 * 1024 * 1024) {
            this.showMessage(messageEl, 'Размер файла не должен превышать 5 МБ', 'error');
            photoInput.value = '';
            return;
          }

          // Валидация типа
          if (!file.type.match(/^image\/(jpeg|jpg|png|webp)$/)) {
            this.showMessage(messageEl, 'Разрешены только изображения (JPG, PNG, WebP)', 'error');
            photoInput.value = '';
            return;
          }

          // Показываем превью
          const reader = new FileReader();
          reader.onload = event => {
            if (previewImage) previewImage.src = event.target.result;
            if (photoPreview) photoPreview.style.display = 'block';
          };
          reader.readAsDataURL(file);
        }
      });
    }

    // Удаление фото
    if (removePhotoBtn) {
      removePhotoBtn.addEventListener('click', () => {
        if (photoInput) photoInput.value = '';
        if (photoPreview) photoPreview.style.display = 'none';
        if (previewImage) previewImage.src = '';
      });
    }

    form.addEventListener('submit', async e => {
      e.preventDefault();

      // Очистка предыдущих сообщений
      if (messageEl) {
        messageEl.textContent = '';
        messageEl.className = 'testimonial-form__message';
      }

      // Валидация на клиенте
      const nameInput = form.querySelector('#name');
      const messageValue = textarea.value.trim();

      if (nameInput.value.trim().length < 2) {
        this.showMessage(messageEl, 'Имя должно содержать минимум 2 символа', 'error');
        return;
      }

      if (messageValue.length < 10) {
        this.showMessage(messageEl, 'Отзыв должен содержать минимум 10 символов', 'error');
        return;
      }

      // Показываем состояние загрузки
      const submitBtn = form.querySelector('.testimonial-form__submit');
      const originalText = submitBtn.textContent;
      submitBtn.disabled = true;
      submitBtn.textContent = 'Отправка...';

      try {
        // Используем FormData для поддержки файлов
        const formData = new FormData(form);

        const response = await fetch('/api/submit-testimonial.php', {
          method: 'POST',
          body: formData,
        });

        const result = await response.json();

        if (result.success) {
          this.showMessage(messageEl, 'Спасибо! Ваш отзыв отправлен на модерацию.', 'success');
          form.reset();
          if (charCountEl) charCountEl.textContent = '0';
          if (photoPreview) photoPreview.style.display = 'none';
          if (previewImage) previewImage.src = '';
        } else {
          const errorMsg = result.errors
            ? result.errors.join(', ')
            : result.error || 'Произошла ошибка при отправке отзыва';
          this.showMessage(messageEl, errorMsg, 'error');
        }
      } catch (error) {
        console.error('Form submission error:', error);
        this.showMessage(
          messageEl,
          'Произошла ошибка при отправке отзыва. Пожалуйста, попробуйте позже.',
          'error'
        );
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
      }
    });
  }

  static showMessage(element, message, type) {
    if (!element) return;

    const messageEl = element;
    messageEl.textContent = message;
    messageEl.className = `testimonial-form__message testimonial-form__message--${type}`;
    messageEl.style.display = 'block';

    // Прокрутка к сообщению
    messageEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
}

export default TestimonialForm;
