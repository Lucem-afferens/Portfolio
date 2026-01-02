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
            <div class="contact__social" data-contact-social>
              <h3>${i18n.t('contact.social')}</h3>
              <div class="contact__social-links" data-social-links></div>
              <div class="contact__info" data-contact-info></div>
            </div>
          </div>
        </div>
      </section>
    `;
  }

  static init() {
    const form = document.querySelector('[data-contact-form]');
    const messageEl = document.querySelector('[data-form-message]');

    // Загружаем контакты из API
    this.loadContacts();

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

  static async loadContacts() {
    try {
      const response = await fetch('/api/get-site-settings.php');
      const result = await response.json();

      if (result.success && result.settings) {
        const { settings } = result;
        this.renderContacts(settings);
      } else {
        // Если не удалось загрузить, используем значения по умолчанию
        this.renderContacts({});
      }
    } catch (error) {
      console.error('Error loading contacts:', error);
      // В случае ошибки используем значения по умолчанию
      this.renderContacts({});
    }
  }

  static renderContacts(settings) {
    const socialLinksContainer = document.querySelector('[data-social-links]');
    const contactInfoContainer = document.querySelector('[data-contact-info]');

    if (!socialLinksContainer || !contactInfoContainer) return;

    // Социальные сети
    const socialLinks = [];

    if (settings.contact_github) {
      socialLinks.push(`
        <a 
          href="${this.escapeHtml(settings.contact_github)}" 
          class="contact__social-link" 
          target="_blank"
          rel="noopener noreferrer"
          aria-label="GitHub"
        >
          GitHub
        </a>
      `);
    }

    if (settings.contact_telegram) {
      socialLinks.push(`
        <a 
          href="${this.escapeHtml(settings.contact_telegram)}" 
          class="contact__social-link" 
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Telegram"
        >
          Telegram
        </a>
      `);
    }

    if (settings.contact_vk) {
      socialLinks.push(`
        <a 
          href="${this.escapeHtml(settings.contact_vk)}" 
          class="contact__social-link" 
          target="_blank"
          rel="noopener noreferrer"
          aria-label="VKontakte"
        >
          VKontakte
        </a>
      `);
    }

    if (settings.contact_linkedin) {
      socialLinks.push(`
        <a 
          href="${this.escapeHtml(settings.contact_linkedin)}" 
          class="contact__social-link" 
          target="_blank"
          rel="noopener noreferrer"
          aria-label="LinkedIn"
        >
          LinkedIn
        </a>
      `);
    }

    socialLinksContainer.innerHTML = socialLinks.length > 0 ? socialLinks.join('') : '';

    // Контактная информация
    const contactInfo = [];

    if (settings.contact_email) {
      contactInfo.push(`
        <p class="contact__info-item">
          <strong>${i18n.t('contact.email')}:</strong>
          <a href="mailto:${this.escapeHtml(settings.contact_email)}">${this.escapeHtml(settings.contact_email)}</a>
        </p>
      `);
    }

    if (settings.contact_phone) {
      const phoneHref = settings.contact_phone.replace(/\s/g, '').replace(/[()]/g, '');
      contactInfo.push(`
        <p class="contact__info-item">
          <strong>${i18n.t('contact.phone')}:</strong>
          <a href="tel:${this.escapeHtml(phoneHref)}">${this.escapeHtml(settings.contact_phone)}</a>
        </p>
      `);
    }

    contactInfoContainer.innerHTML = contactInfo.length > 0 ? contactInfo.join('') : '';
  }

  static escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}

export default Contact;
