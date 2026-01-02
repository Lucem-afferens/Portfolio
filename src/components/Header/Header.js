import { i18n } from '../../utils/i18n.js';
import { ThemeManager } from '../../utils/themeManager.js';
import './Header.scss';

class Header {
  static render() {
    // Получаем сохраненные настройки логотипа из localStorage
    const savedLogoSettings = this.getSavedLogoSettings();
    const hasLogo =
      savedLogoSettings &&
      (savedLogoSettings.logo || savedLogoSettings.logo_light || savedLogoSettings.logo_dark);
    const logoDisplay = hasLogo ? 'block' : 'none';
    const textDisplay = hasLogo ? 'none' : 'inline-block';
    const logoClass = hasLogo ? 'header__logo--image' : '';

    // Определяем, какой логотип показывать
    let logoSrc = '';
    if (savedLogoSettings) {
      const currentTheme = ThemeManager.getCurrentTheme();
      const themeSwitchEnabled = savedLogoSettings.logo_theme_switch || false;

      if (themeSwitchEnabled) {
        logoSrc =
          currentTheme === 'dark'
            ? savedLogoSettings.logo_dark ||
              savedLogoSettings.logo_light ||
              savedLogoSettings.logo ||
              ''
            : savedLogoSettings.logo_light ||
              savedLogoSettings.logo_dark ||
              savedLogoSettings.logo ||
              '';
      } else {
        logoSrc = savedLogoSettings.logo || '';
      }
    }

    return `
      <header class="header">
        <div class="container">
          <div class="header__content">
            <a href="#home" class="header__logo ${logoClass}" data-logo-link>
              <span class="header__logo-text" style="display: ${textDisplay};">${i18n.t('header.logo')}</span>
              <img class="header__logo-image" data-logo-image src="${logoSrc}" style="display: ${logoDisplay};" alt="${i18n.t('header.logo')}" />
            </a>
            <nav class="header__nav">
              <a href="#home" class="header__nav-link">${i18n.t('header.nav.home')}</a>
              <a href="#about" class="header__nav-link">${i18n.t('header.nav.about')}</a>
              <a href="#projects" class="header__nav-link">${i18n.t('header.nav.projects')}</a>
              <a href="#testimonials" class="header__nav-link">${i18n.t('header.nav.testimonials')}</a>
              <a href="#contact" class="header__nav-link">${i18n.t('header.nav.contact')}</a>
            </nav>
            <div class="header__controls">
              <button class="header__lang-toggle" aria-label="Toggle language">
                <svg class="header__lang-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="2" y1="12" x2="22" y2="12"></line>
                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                </svg>
                <span class="header__lang-text">${i18n.getCurrentLanguage().toUpperCase()}</span>
              </button>
              <button class="header__theme-toggle" aria-label="Toggle theme" data-theme-toggle>
                <svg class="header__theme-icon header__theme-icon--sun" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
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
                <svg class="header__theme-icon header__theme-icon--moon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>
    `;
  }

  static init() {
    this.loadLogo();
    this.initScrollHandler();
    this.initNavigationHandlers();

    const langToggle = document.querySelector('.header__lang-toggle');
    const themeToggle = document.querySelector('.header__theme-toggle');

    if (langToggle) {
      langToggle.addEventListener('click', () => {
        const currentLang = i18n.getCurrentLanguage();
        i18n.setLanguage(currentLang === 'ru' ? 'en' : 'ru');
        // Перезагрузка страницы для обновления контента
        window.location.reload();
      });
    }

    if (themeToggle) {
      themeToggle.addEventListener('click', () => {
        ThemeManager.toggleTheme();
        // Обновляем логотип при смене темы
        this.updateLogoForTheme();
      });
    }

    // Слушаем изменения темы
    document.addEventListener('themeChanged', () => {
      this.updateLogoForTheme();
    });
  }

  static initScrollHandler() {
    const header = document.querySelector('.header');
    if (!header) return;

    let ticking = false;

    const updateHeader = () => {
      const { scrollY } = window;
      const scrollThreshold = 50; // Порог скролла для появления фона

      if (scrollY > scrollThreshold) {
        header.classList.add('header--scrolled');
      } else {
        header.classList.remove('header--scrolled');
      }

      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateHeader);
        ticking = true;
      }
    };

    // Проверяем начальную позицию
    updateHeader();

    // Оптимизированный обработчик скролла
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  static initNavigationHandlers() {
    const logoLink = document.querySelector('[data-logo-link]');
    const homeLink = document.querySelector('.header__nav-link[href="#home"]');
    const header = document.querySelector('.header');

    const handleHomeClick = e => {
      // Проверяем, что это действительно переход на главную
      const target = e.currentTarget;
      if (target.getAttribute('href') === '#home') {
        // Небольшая задержка для плавного перехода
        setTimeout(() => {
          const { scrollY } = window;
          if (scrollY < 50) {
            header?.classList.remove('header--scrolled');
          }
        }, 100);
      }
    };

    if (logoLink) {
      logoLink.addEventListener('click', handleHomeClick);
    }

    if (homeLink) {
      homeLink.addEventListener('click', handleHomeClick);
    }

    // Отслеживаем изменения hash для случаев программного скролла
    window.addEventListener('hashchange', () => {
      if (window.location.hash === '#home' || window.location.hash === '') {
        setTimeout(() => {
          const { scrollY } = window;
          if (scrollY < 50) {
            header?.classList.remove('header--scrolled');
          }
        }, 100);
      }
    });
  }

  static getSavedLogoSettings() {
    try {
      const saved = localStorage.getItem('header_logo_settings');
      return saved ? JSON.parse(saved) : null;
    } catch (error) {
      console.error('Error reading saved logo settings:', error);
      return null;
    }
  }

  static saveLogoSettings(settings) {
    try {
      localStorage.setItem('header_logo_settings', JSON.stringify(settings));
    } catch (error) {
      console.error('Error saving logo settings:', error);
    }
  }

  static async loadLogo() {
    try {
      const response = await fetch('/api/get-site-settings.php');
      const result = await response.json();

      if (result.success) {
        this.logoSettings = result.settings;
        // Сохраняем настройки в localStorage для быстрого доступа при перезагрузке
        this.saveLogoSettings(result.settings);
        this.updateLogoForTheme();
      }
    } catch (error) {
      console.error('Error loading logo:', error);
      // В случае ошибки используем сохраненные настройки
      const saved = this.getSavedLogoSettings();
      if (saved) {
        this.logoSettings = saved;
        this.updateLogoForTheme();
      }
    }
  }

  static updateLogoForTheme() {
    if (!this.logoSettings) return;

    const logoImage = document.querySelector('[data-logo-image]');
    const logoText = document.querySelector('.header__logo-text');
    const logoLink = document.querySelector('[data-logo-link]');

    if (!logoImage || !logoText || !logoLink) return;

    const currentTheme = ThemeManager.getCurrentTheme();
    const themeSwitchEnabled = this.logoSettings.logo_theme_switch || false;

    let logoPath = null;

    if (themeSwitchEnabled) {
      // Используем разные логотипы для разных тем
      logoPath =
        currentTheme === 'dark'
          ? this.logoSettings.logo_dark || this.logoSettings.logo_light
          : this.logoSettings.logo_light || this.logoSettings.logo_dark;
    } else {
      // Используем единый логотип
      logoPath = this.logoSettings.logo;
    }

    if (logoPath) {
      logoImage.src = logoPath;
      logoImage.style.display = 'block';
      logoText.style.display = 'none';
      logoLink.classList.add('header__logo--image');
    } else {
      logoImage.style.display = 'none';
      logoText.style.display = 'inline-block';
      logoLink.classList.remove('header__logo--image');
    }
  }
}

export default Header;
