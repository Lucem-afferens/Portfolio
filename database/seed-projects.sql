-- Добавление начальных проектов в базу данных
-- Выполните этот скрипт после создания таблицы projects

-- Проект 1: Точка GG
INSERT INTO projects (title, role, description, tools, link, image, display_order) VALUES (
  'Точка GG',
  'Full-stack Developer',
  'Разработка WordPress-темы с нуля, SEO-оптимизация и улучшение производительности',
  '["WordPress", "PHP", "SEO", "PageSpeed"]',
  'https://kungur-tochkagg.ru',
  '/images/project-placeholder.svg',
  1
);

-- Проект 2: Приз Бокс
INSERT INTO projects (title, role, description, tools, link, image, display_order) VALUES (
  'Приз Бокс',
  'Full-stack Developer',
  'Telegram-бот с личным кабинетом, рейтингом и админ-панелью',
  '["Telegram API", "PHP", "MySQL", "AI"]',
  'https://t.me/wheel_prize_test_bot',
  '/images/project-placeholder.svg',
  2
);

-- Проект 3: Welcome to Day
INSERT INTO projects (title, role, description, tools, link, image, display_order) VALUES (
  'Welcome to Day',
  'Full-stack Developer',
  'Каталог интерактивных приглашений с формами заявок, промокодами и уведомлениями',
  '["Frontend", "SEO", "Analytics", "Optimization"]',
  'https://welcome-to-day.ru',
  '/images/project-placeholder.svg',
  3
);

