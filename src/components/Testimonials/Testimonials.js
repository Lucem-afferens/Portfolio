import { i18n } from '../../utils/i18n.js';
import './Testimonials.scss';

class Testimonials {
  static render() {
    return `
      <section id="testimonials" class="testimonials">
        <div class="container">
          <h2 class="testimonials__title">${i18n.t('testimonials.title')}</h2>
          <div class="testimonials__slider" data-testimonials-slider>
            <div class="testimonials__track" data-testimonials-track></div>
            <button class="testimonials__prev" aria-label="Предыдущий отзыв" data-testimonials-prev>‹</button>
            <button class="testimonials__next" aria-label="Следующий отзыв" data-testimonials-next>›</button>
          </div>
          <div class="testimonials__dots" data-testimonials-dots></div>
        </div>
      </section>
    `;
  }

  static renderTestimonials(testimonials) {
    if (!testimonials || testimonials.length === 0) {
      return '<p class="testimonials__empty">Отзывов пока нет</p>';
    }

    return testimonials
      .map(
        testimonial => `
      <div class="testimonials__slide">
        <blockquote class="testimonials__quote">
          ${
            testimonial.photo
              ? `
            <div class="testimonials__photo">
              <img 
                src="${this.escapeHtml(testimonial.photo)}" 
                alt="${this.escapeHtml(testimonial.name)}"
                loading="lazy"
                width="80"
                height="80"
              />
            </div>
          `
              : ''
          }
          <p>${this.escapeHtml(testimonial.message)}</p>
          <footer>
            <div class="testimonials__author">${this.escapeHtml(testimonial.name)}</div>
            ${testimonial.position ? `<div class="testimonials__position">${this.escapeHtml(testimonial.position)}</div>` : ''}
            ${testimonial.company ? `<div class="testimonials__company">${this.escapeHtml(testimonial.company)}</div>` : ''}
          </footer>
        </blockquote>
      </div>
    `
      )
      .join('');
  }

  static init() {
    this.loadTestimonials();
  }

  static async loadTestimonials() {
    const track = document.querySelector('[data-testimonials-track]');
    if (!track) return;

    track.innerHTML = '<div class="testimonials__loading">Загрузка отзывов...</div>';

    try {
      const response = await fetch('/api/get-testimonials.php');
      const result = await response.json();

      if (result.success && result.testimonials.length > 0) {
        track.innerHTML = this.renderTestimonials(result.testimonials);
        this.initSlider();
      } else {
        track.innerHTML = '<p class="testimonials__empty">Отзывов пока нет</p>';
      }
    } catch (error) {
      console.error('Error loading testimonials:', error);
      track.innerHTML = '<p class="testimonials__empty">Ошибка загрузки отзывов</p>';
    }
  }

  static initSlider() {
    const track = document.querySelector('[data-testimonials-track]');
    const slides = track.querySelectorAll('.testimonials__slide');
    const prevBtn = document.querySelector('[data-testimonials-prev]');
    const nextBtn = document.querySelector('[data-testimonials-next]');
    const dotsContainer = document.querySelector('[data-testimonials-dots]');

    if (slides.length === 0) return;

    let currentIndex = 0;

    const updateSlider = () => {
      const offset = -currentIndex * 100;
      track.style.transform = `translateX(${offset}%)`;

      // Обновление точек
      if (dotsContainer) {
        dotsContainer.querySelectorAll('.testimonials__dot').forEach((dot, index) => {
          dot.classList.toggle('active', index === currentIndex);
        });
      }

      // Обновление кнопок
      if (prevBtn) prevBtn.disabled = currentIndex === 0;
      if (nextBtn) nextBtn.disabled = currentIndex === slides.length - 1;
    };

    // Создание точек навигации
    if (dotsContainer && slides.length > 1) {
      dotsContainer.innerHTML = slides
        .map(
          (_, index) => `
        <button 
          class="testimonials__dot ${index === 0 ? 'active' : ''}" 
          data-slide-index="${index}"
          aria-label="Перейти к отзыву ${index + 1}"
        ></button>
      `
        )
        .join('');

      dotsContainer.querySelectorAll('.testimonials__dot').forEach((dot, index) => {
        dot.addEventListener('click', () => {
          currentIndex = index;
          updateSlider();
        });
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        if (currentIndex > 0) {
          currentIndex -= 1;
          updateSlider();
        }
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        if (currentIndex < slides.length - 1) {
          currentIndex += 1;
          updateSlider();
        }
      });
    }

    // Автопрокрутка (опционально)
    // let autoSlideInterval = setInterval(() => {
    //   currentIndex = (currentIndex + 1) % slides.length;
    //   updateSlider();
    // }, 5000);

    updateSlider();
  }

  static escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}

export default Testimonials;
