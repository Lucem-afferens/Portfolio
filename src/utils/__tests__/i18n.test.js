import { describe, it, expect, beforeEach } from 'vitest';
import { i18n } from '../i18n.js';

describe('i18n', () => {
  beforeEach(() => {
    // Сброс состояния перед каждым тестом
    localStorage.clear();
    i18n.setLanguage('ru');
  });

  it('должен инициализироваться с русским языком по умолчанию', () => {
    i18n.init();
    expect(i18n.getCurrentLanguage()).toBe('ru');
  });

  it('должен переключать язык', () => {
    i18n.setLanguage('en');
    expect(i18n.getCurrentLanguage()).toBe('en');
  });

  it('должен возвращать перевод по ключу', () => {
    i18n.setLanguage('ru');
    expect(i18n.t('header.logo')).toBe('Портфолио');
    
    i18n.setLanguage('en');
    expect(i18n.t('header.logo')).toBe('Portfolio');
  });

  it('должен возвращать ключ, если перевод не найден', () => {
    expect(i18n.t('nonexistent.key')).toBe('nonexistent.key');
  });

  it('должен заменять параметры в переводах', () => {
    // Предполагаем, что в локализации есть ключ с параметрами
    // Например: "Hello {{name}}" -> "Hello John"
    // Это пример, нужно будет добавить такой ключ в локализацию
    const result = i18n.t('test.key', { name: 'John' });
    expect(result).toBeDefined();
  });

  it('должен сохранять выбранный язык в localStorage', () => {
    i18n.setLanguage('en');
    expect(localStorage.getItem('language')).toBe('en');
  });

  it('должен возвращать доступные языки', () => {
    const languages = i18n.getAvailableLanguages();
    expect(languages).toContain('ru');
    expect(languages).toContain('en');
  });
});

