import { i18n } from '../../utils/i18n.js';
import './Testimonials.scss';

class Testimonials {
  constructor() {
    this.currentIndex = 0;
    this.testimonials = [
      {
        id: 1,
        text: 'Great work!',
        author: 'Client 1',
        position: 'CEO',
      },
      {
        id: 2,
        text: 'Excellent developer!',
        author: 'Client 2',
        position: 'CTO',
      },
    ];
  }

  static render() {
    const instance = new Testimonials();
    return `
      <section id="testimonials" class="testimonials">
        <div class="container">
          <h2 class="testimonials__title">${i18n.t('testimonials.title')}</h2>
          <div class="testimonials__slider">
            <div class="testimonials__track" data-testimonials-track>
              ${instance.renderTestimonials()}
            </div>
            <button class="testimonials__prev" aria-label="Previous testimonial">‹</button>
            <button class="testimonials__next" aria-label="Next testimonial">›</button>
          </div>
        </div>
      </section>
    `;
  }

  renderTestimonials() {
    return this.testimonials
      .map(
        (testimonial) => `
      <div class="testimonials__slide">
        <blockquote class="testimonials__quote">
          <p>${testimonial.text}</p>
          <footer>
            <cite class="testimonials__author">${testimonial.author}</cite>
            <span class="testimonials__position">${testimonial.position}</span>
          </footer>
        </blockquote>
      </div>
    `
      )
      .join('');
  }

  static init() {
    const instance = new Testimonials();
    const track = document.querySelector('[data-testimonials-track]');
    const prevBtn = document.querySelector('.testimonials__prev');
    const nextBtn = document.querySelector('.testimonials__next');
    
    if (!track || !prevBtn || !nextBtn) return;

    const slides = track.querySelectorAll('.testimonials__slide');
    const totalSlides = slides.length;
    
    if (totalSlides === 0) return;

    const updateSlider = () => {
      const translateX = -instance.currentIndex * 100;
      track.style.transform = `translateX(${translateX}%)`;
    };

    prevBtn.addEventListener('click', () => {
      instance.currentIndex = (instance.currentIndex - 1 + totalSlides) % totalSlides;
      updateSlider();
    });

    nextBtn.addEventListener('click', () => {
      instance.currentIndex = (instance.currentIndex + 1) % totalSlides;
      updateSlider();
    });

    // Автопрокрутка (опционально)
    // setInterval(() => {
    //   instance.currentIndex = (instance.currentIndex + 1) % totalSlides;
    //   updateSlider();
    // }, 5000);
  }
}

export default Testimonials;

