import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ThemeManager } from '../themeManager.js';

describe('ThemeManager', () => {
  beforeEach(() => {
    // Очистка перед каждым тестом
    document.body.className = '';
    localStorage.clear();
    
    // Мокаем matchMedia
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });
  });

  it('должен устанавливать светлую тему', () => {
    ThemeManager.setTheme('light');
    expect(document.body.classList.contains('light-theme')).toBe(true);
    expect(document.body.classList.contains('dark-theme')).toBe(false);
  });

  it('должен устанавливать темную тему', () => {
    ThemeManager.setTheme('dark');
    expect(document.body.classList.contains('dark-theme')).toBe(true);
    expect(document.body.classList.contains('light-theme')).toBe(false);
  });

  it('должен переключать тему', () => {
    ThemeManager.setTheme('light');
    expect(ThemeManager.getCurrentTheme()).toBe('light');
    
    ThemeManager.toggleTheme();
    expect(ThemeManager.getCurrentTheme()).toBe('dark');
    
    ThemeManager.toggleTheme();
    expect(ThemeManager.getCurrentTheme()).toBe('light');
  });

  it('должен сохранять тему в localStorage', () => {
    ThemeManager.setTheme('dark');
    expect(localStorage.getItem('theme')).toBe('dark');
  });

  it('должен возвращать текущую тему', () => {
    ThemeManager.setTheme('dark');
    expect(ThemeManager.getCurrentTheme()).toBe('dark');
    
    ThemeManager.setTheme('light');
    expect(ThemeManager.getCurrentTheme()).toBe('light');
  });
});

