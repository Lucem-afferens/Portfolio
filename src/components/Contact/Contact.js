import { i18n } from '../../utils/i18n.js';
import './Contact.scss';

class Contact {
  static render() {
    return `
      <section id="contact" class="contact">
        <div class="container">
          <h2 class="contact__title">${i18n.t('contact.title')}</h2>
          <div class="contact__content">
            <form class="contact__form" data-contact-form>
              <div class="contact__form-group">
                <label for="name" class="contact__label">${i18n.t('contact.form.name')}</label>
                <input 
                  type="text" 
                  id="name" 
                  name="name" 
                  class="contact__input" 
                  required
                  autocomplete="name"
                />
              </div>
              <div class="contact__form-group">
                <label for="email" class="contact__label">${i18n.t('contact.form.email')}</label>
                <input 
                  type="email" 
                  id="email" 
                  name="email" 
                  class="contact__input" 
                  required
                  autocomplete="email"
                />
              </div>
              <div class="contact__form-group">
                <label for="telegram" class="contact__label">
                  ${i18n.t('contact.form.telegram')} <span class="contact__optional">(${i18n.t('contact.form.optional')})</span>
                </label>
                <input 
                  type="text" 
                  id="telegram" 
                  name="telegram" 
                  class="contact__input" 
                  placeholder="@username"
                  autocomplete="off"
                />
              </div>
              <div class="contact__form-group">
                <label for="message" class="contact__label">
                  ${i18n.t('contact.form.message')} <span class="contact__optional">(${i18n.t('contact.form.optional')})</span>
                </label>
                <textarea 
                  id="message" 
                  name="message" 
                  class="contact__textarea" 
                  rows="5"
                ></textarea>
              </div>
              <div class="contact__form-group">
                <label class="contact__checkbox-label">
                  <input 
                    type="checkbox" 
                    name="consent" 
                    id="consent"
                    class="contact__checkbox" 
                    required
                  />
                  <span class="contact__checkbox-text">${i18n.t('contact.form.consent')}</span>
                </label>
              </div>
              <button type="submit" class="contact__submit">
                ${i18n.t('contact.form.submit')}
              </button>
              <div class="contact__form-message" data-form-message role="alert" aria-live="polite"></div>
            </form>
            <div class="contact__social">
              <h3>${i18n.t('contact.social')}</h3>
              <div class="contact__social-links">
                <a 
                  href="https://github.com/Lucem-afferens" 
                  class="contact__social-link" 
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub"
                >
                  GitHub
                </a>
                <a 
                  href="https://t.me/lucem_afferens" 
                  class="contact__social-link" 
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Telegram"
                >
                  Telegram
                </a>
                <a 
                  href="https://vk.com/lucem.afferens" 
                  class="contact__social-link" 
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="VKontakte"
                >
                  VKontakte
                </a>
              </div>
              <div class="contact__info">
                <p class="contact__info-item">
                  <strong>${i18n.t('contact.email')}:</strong>
                  <a href="mailto:nikwebdev.2025@gmail.com">nikwebdev.2025@gmail.com</a>
                </p>
                <p class="contact__info-item">
                  <strong>${i18n.t('contact.phone')}:</strong>
                  <a href="tel:+79226447689">+7 (922) 644-76-89</a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    `;
  }

  static init() {
    const form = document.querySelector('[data-contact-form]');
    const messageEl = document.querySelector('[data-form-message]');

    // Функция для обновления текста чекбокса
    const updateCheckboxText = () => {
      const checkboxText = document.querySelector('.contact__checkbox-text');
      if (checkboxText) {
        checkboxText.innerHTML = i18n.t('contact.form.consent');
      }
    };

    // Устанавливаем HTML для чекбокса с ссылками после рендера
    updateCheckboxText();

    // Обновляем текст чекбокса при смене языка
    document.addEventListener('languageChanged', updateCheckboxText);

    if (form) {
      form.addEventListener('submit', async e => {
        e.preventDefault();

        const formData = new FormData(form);
        const data = Object.fromEntries(formData);

        // Получаем элементы формы
        const submitBtn = form.querySelector('.contact__submit');
        const originalText = submitBtn.textContent;

        // Проверяем согласие на обработку персональных данных
        if (!data.consent || data.consent !== 'on') {
          if (messageEl) {
            messageEl.textContent = i18n.t('contact.form.consentRequired');
            messageEl.className = 'contact__form-message contact__form-message--error';
          }
          return;
        }

        // Очищаем пустые поля
        if (!data.message || !data.message.trim()) {
          delete data.message;
        }
        if (!data.telegram || !data.telegram.trim()) {
          delete data.telegram;
        }
        // consent остается в данных для проверки на сервере

        // Показываем состояние загрузки
        submitBtn.disabled = true;
        submitBtn.textContent = 'Отправка...';

        // Очищаем предыдущие сообщения
        if (messageEl) {
          messageEl.textContent = '';
          messageEl.className = 'contact__form-message';
        }

        try {
          const response = await fetch('/api/submit-contact.php', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
          });

          const result = await response.json();

          if (result.success) {
            // Показываем успешное сообщение
            if (messageEl) {
              messageEl.textContent = i18n.t('contact.form.success');
              messageEl.className = 'contact__form-message contact__form-message--success';
            }

            // Очищаем форму
            form.reset();
          } else if (messageEl) {
            // Показываем ошибку
            messageEl.textContent = result.error || i18n.t('contact.form.error');
            messageEl.className = 'contact__form-message contact__form-message--error';
          }
        } catch (error) {
          console.error('Form submission error:', error);
          if (messageEl) {
            messageEl.textContent = i18n.t('contact.form.error');
            messageEl.className = 'contact__form-message contact__form-message--error';
          }
        } finally {
          submitBtn.disabled = false;
          submitBtn.textContent = originalText;
        }
      });
    }
  }
}

export default Contact;
