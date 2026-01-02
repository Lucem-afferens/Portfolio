import './TestimonialForm.scss';
import { i18n } from '../../utils/i18n.js';
import Header from '../../components/Header/Header.js';

class TestimonialForm {
  static render() {
    return `
      ${Header.render({ hideNav: true })}
      <section class="testimonial-form">
        <div class="container">
          <header class="testimonial-form__header">
            <h1 class="testimonial-form__title">${i18n.t('testimonialForm.title')}</h1>
            <p class="testimonial-form__subtitle">
              ${i18n.t('testimonialForm.subtitle')}
            </p>
          </header>
          
          <form class="testimonial-form__form" data-testimonial-form enctype="multipart/form-data">
            <div class="testimonial-form__group">
              <label for="name" class="testimonial-form__label">
                ${i18n.t('testimonialForm.form.name')} <span class="required">*</span>
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
                ${i18n.t('testimonialForm.form.position')}
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
                ${i18n.t('testimonialForm.form.company')}
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
                ${i18n.t('testimonialForm.form.message')} <span class="required">*</span>
              </label>
              <textarea
                id="message"
                name="message"
                class="testimonial-form__textarea"
                rows="6"
                required
                minlength="10"
                maxlength="2000"
                placeholder="${i18n.t('testimonialForm.form.messagePlaceholder')}"
              ></textarea>
              <span class="testimonial-form__counter">
                <span data-char-count>0</span> / 2000
              </span>
            </div>
            
            <div class="testimonial-form__group">
              <label for="photo" class="testimonial-form__label">
                ${i18n.t('testimonialForm.form.photo')}
              </label>
              <div class="testimonial-form__file-wrapper">
                <input
                  type="file"
                  id="photo"
                  name="photo"
                  class="testimonial-form__file-input"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  data-photo-input
                />
                <label for="photo" class="testimonial-form__file-label" data-file-label>
                  <span class="testimonial-form__file-button-text">${i18n.t('testimonialForm.form.fileSelect')}</span>
                  <span class="testimonial-form__file-name" data-file-name>${i18n.t('testimonialForm.form.fileNotSelected')}</span>
                </label>
              </div>
              <div class="testimonial-form__photo-preview" data-photo-preview style="display: none;">
                <img src="" alt="${i18n.t('testimonialForm.form.photoPreview')}" data-preview-image />
                <button type="button" class="testimonial-form__remove-photo" data-remove-photo>
                  ${i18n.t('testimonialForm.form.removePhoto')}
                </button>
              </div>
              <p class="testimonial-form__file-hint">
                ${i18n.t('testimonialForm.form.fileHint')}
              </p>
            </div>
            
            <button type="submit" class="testimonial-form__submit">
              ${i18n.t('testimonialForm.form.submit')}
            </button>
            
            <div class="testimonial-form__message" data-form-message role="alert" aria-live="polite"></div>
          </form>
        </div>
      </section>
    `;
  }

  static init() {
    // Инициализация Header
    Header.init();

    const form = document.querySelector('[data-testimonial-form]');
    const messageEl = document.querySelector('[data-form-message]');
    const charCountEl = document.querySelector('[data-char-count]');
    const textarea = document.querySelector('#message');
    const photoInput = document.querySelector('[data-photo-input]');
    const photoPreview = document.querySelector('[data-photo-preview]');
    const previewImage = document.querySelector('[data-preview-image]');
    const removePhotoBtn = document.querySelector('[data-remove-photo]');
    const fileName = document.querySelector('[data-file-name]');
    const fileButtonText = document.querySelector('.testimonial-form__file-button-text');

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
          // Обновляем имя файла
          if (fileName) {
            fileName.textContent = file.name;
          }

          // Валидация размера (5 МБ)
          if (file.size > 5 * 1024 * 1024) {
            this.showMessage(messageEl, i18n.t('testimonialForm.errors.fileSize'), 'error');
            photoInput.value = '';
            if (fileName) fileName.textContent = i18n.t('testimonialForm.form.fileNotSelected');
            return;
          }

          // Валидация типа
          if (!file.type.match(/^image\/(jpeg|jpg|png|webp)$/)) {
            this.showMessage(messageEl, i18n.t('testimonialForm.errors.fileType'), 'error');
            photoInput.value = '';
            if (fileName) fileName.textContent = i18n.t('testimonialForm.form.fileNotSelected');
            return;
          }

          // Показываем превью
          const reader = new FileReader();
          reader.onload = event => {
            if (previewImage) previewImage.src = event.target.result;
            if (photoPreview) photoPreview.style.display = 'block';
          };
          reader.readAsDataURL(file);
        } else if (fileName) fileName.textContent = i18n.t('testimonialForm.form.fileNotSelected');
      });
    }

    // Удаление фото
    if (removePhotoBtn) {
      removePhotoBtn.addEventListener('click', () => {
        if (photoInput) photoInput.value = '';
        if (photoPreview) photoPreview.style.display = 'none';
        if (previewImage) previewImage.src = '';
        if (fileName) fileName.textContent = i18n.t('testimonialForm.form.fileNotSelected');
      });
    }

    // Обновление переводов при смене языка
    document.addEventListener('languageChanged', () => {
      if (fileButtonText) {
        fileButtonText.textContent = i18n.t('testimonialForm.form.fileSelect');
      }
      if (fileName && !photoInput?.files[0]) {
        fileName.textContent = i18n.t('testimonialForm.form.fileNotSelected');
      }
    });

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
        this.showMessage(messageEl, i18n.t('testimonialForm.errors.nameMin'), 'error');
        return;
      }

      if (messageValue.length < 10) {
        this.showMessage(messageEl, i18n.t('testimonialForm.errors.messageMin'), 'error');
        return;
      }

      // Показываем состояние загрузки
      const submitBtn = form.querySelector('.testimonial-form__submit');
      const originalText = submitBtn.textContent;
      submitBtn.disabled = true;
      submitBtn.textContent = i18n.t('testimonialForm.form.submitting');

      try {
        // Используем FormData для поддержки файлов
        const formData = new FormData(form);

        const response = await fetch('/api/submit-testimonial.php', {
          method: 'POST',
          body: formData,
        });

        const result = await response.json();

        if (result.success) {
          this.showMessage(messageEl, i18n.t('testimonialForm.form.success'), 'success');
          form.reset();
          if (charCountEl) charCountEl.textContent = '0';
          if (photoPreview) photoPreview.style.display = 'none';
          if (previewImage) previewImage.src = '';
        } else {
          const errorMsg = result.errors
            ? result.errors.join(', ')
            : result.error || i18n.t('testimonialForm.errors.submitError');
          this.showMessage(messageEl, errorMsg, 'error');
        }
      } catch (error) {
        console.error('Form submission error:', error);
        this.showMessage(messageEl, i18n.t('testimonialForm.errors.submitError'), 'error');
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
