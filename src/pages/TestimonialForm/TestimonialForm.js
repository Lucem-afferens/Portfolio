import './TestimonialForm.scss';

class TestimonialForm {
  static render() {
    return `
      <section class="testimonial-form">
        <div class="container">
          <header class="testimonial-form__header">
            <h1 class="testimonial-form__title">Оставить отзыв</h1>
            <p class="testimonial-form__subtitle">
              Ваше мнение очень важно для меня. Поделитесь своим опытом работы со мной.
            </p>
          </header>
          
          <form class="testimonial-form__form" data-testimonial-form>
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
    const form = document.querySelector('[data-testimonial-form]');
    const messageEl = document.querySelector('[data-form-message]');
    const charCountEl = document.querySelector('[data-char-count]');
    const textarea = document.querySelector('#message');

    if (!form) return;

    // Счетчик символов
    if (textarea && charCountEl) {
      textarea.addEventListener('input', () => {
        charCountEl.textContent = textarea.value.length;
      });
    }

    form.addEventListener('submit', async e => {
      e.preventDefault();

      const formData = new FormData(form);
      const data = Object.fromEntries(formData);

      // Очистка предыдущих сообщений
      if (messageEl) {
        messageEl.textContent = '';
        messageEl.className = 'testimonial-form__message';
      }

      // Валидация на клиенте
      if (data.name.trim().length < 2) {
        this.showMessage(messageEl, 'Имя должно содержать минимум 2 символа', 'error');
        return;
      }

      if (data.message.trim().length < 10) {
        this.showMessage(messageEl, 'Отзыв должен содержать минимум 10 символов', 'error');
        return;
      }

      // Показываем состояние загрузки
      const submitBtn = form.querySelector('.testimonial-form__submit');
      const originalText = submitBtn.textContent;
      submitBtn.disabled = true;
      submitBtn.textContent = 'Отправка...';

      try {
        const response = await fetch('/api/submit-testimonial.php', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });

        const result = await response.json();

        if (result.success) {
          this.showMessage(
            messageEl,
            'Спасибо! Ваш отзыв отправлен на модерацию. Я свяжусь с вами после проверки.',
            'success'
          );
          form.reset();
          if (charCountEl) charCountEl.textContent = '0';
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
