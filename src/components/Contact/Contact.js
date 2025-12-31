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
                />
              </div>
              <div class="contact__form-group">
                <label for="message" class="contact__label">${i18n.t('contact.form.message')}</label>
                <textarea 
                  id="message" 
                  name="message" 
                  class="contact__textarea" 
                  rows="5"
                  required
                ></textarea>
              </div>
              <button type="submit" class="contact__submit">
                ${i18n.t('contact.form.submit')}
              </button>
            </form>
            <div class="contact__social">
              <h3>${i18n.t('contact.social')}</h3>
              <div class="contact__social-links">
                <a href="#" class="contact__social-link" aria-label="GitHub">GitHub</a>
                <a href="#" class="contact__social-link" aria-label="LinkedIn">LinkedIn</a>
                <a href="#" class="contact__social-link" aria-label="Twitter">Twitter</a>
              </div>
            </div>
          </div>
        </div>
      </section>
    `;
  }

  static init() {
    const form = document.querySelector('[data-contact-form]');

    if (form) {
      form.addEventListener('submit', e => {
        e.preventDefault();

        const formData = new FormData(form);
        const data = Object.fromEntries(formData);

        // Здесь будет отправка формы (например, через API)
        console.log('Form data:', data);

        // Показываем сообщение об успехе
        // eslint-disable-next-line no-alert
        alert('Сообщение отправлено!');
        form.reset();
      });
    }
  }
}

export default Contact;
