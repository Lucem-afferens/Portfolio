class ThemeManager {
  static init() {
    const savedTheme = localStorage.getItem('theme');
    // По умолчанию используем темную тему
    const theme = savedTheme || 'dark';

    this.setTheme(theme);
  }

  static setTheme(theme) {
    if (theme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
      document.body.classList.add('dark-theme');
      document.body.classList.remove('light-theme');
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
      document.body.classList.add('light-theme');
      document.body.classList.remove('dark-theme');
    }

    localStorage.setItem('theme', theme);
    document.dispatchEvent(new CustomEvent('themeChanged', { detail: { theme } }));
  }

  static toggleTheme() {
    const currentTheme = this.getCurrentTheme();
    this.setTheme(currentTheme === 'dark' ? 'light' : 'dark');
  }

  static getCurrentTheme() {
    return document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
  }
}

export { ThemeManager };
