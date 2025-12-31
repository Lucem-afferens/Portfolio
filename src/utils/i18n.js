import ru from '../locales/ru.json';
import en from '../locales/en.json';

class I18n {
  constructor() {
    this.locales = {
      ru,
      en,
    };
    this.currentLang = this.getStoredLanguage() || this.detectLanguage();
  }

  getStoredLanguage() {
    return localStorage.getItem('language');
  }

  detectLanguage() {
    const browserLang = navigator.language.split('-')[0];
    return this.locales[browserLang] ? browserLang : 'ru';
  }

  init() {
    this.setLanguage(this.currentLang);
  }

  setLanguage(lang) {
    if (!this.locales[lang]) {
      console.warn(`Language ${lang} is not supported`);
      return;
    }
    
    this.currentLang = lang;
    localStorage.setItem('language', lang);
    document.documentElement.lang = lang;
    
    // Диспатч события для обновления компонентов
    document.dispatchEvent(new CustomEvent('languageChanged', { detail: { lang } }));
  }

  t(key, params = {}) {
    const keys = key.split('.');
    let value = this.locales[this.currentLang];
    
    for (const k of keys) {
      if (value && typeof value === 'object') {
        value = value[k];
      } else {
        console.warn(`Translation key "${key}" not found`);
        return key;
      }
    }
    
    if (typeof value !== 'string') {
      console.warn(`Translation value for "${key}" is not a string`);
      return key;
    }
    
    // Замена параметров
    return value.replace(/\{\{(\w+)\}\}/g, (match, paramKey) => {
      return params[paramKey] !== undefined ? params[paramKey] : match;
    });
  }

  getCurrentLanguage() {
    return this.currentLang;
  }

  getAvailableLanguages() {
    return Object.keys(this.locales);
  }
}

export const i18n = new I18n();

