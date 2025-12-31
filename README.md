# Portfolio Website

Современный сайт-портфолио, созданный с использованием передовых технологий и лучших практик веб-разработки.

## Технологии

- **Чистый JavaScript** (ES6+ модули)
- **Vite** - быстрый сборщик
- **SCSS** - препроцессор с компонентным подходом
- **i18n** - поддержка русского и английского языков
- **ESLint + Prettier** - качество и форматирование кода

## Структура проекта

```
portfolio/
├── src/
│   ├── components/      # Компоненты (Header, Hero, About, Projects, etc.)
│   ├── styles/          # Глобальные стили (variables, mixins, main)
│   ├── locales/         # Файлы локализации (ru.json, en.json)
│   ├── utils/           # Утилиты (i18n, themeManager)
│   ├── App.js           # Главный компонент приложения
│   ├── main.js          # Точка входа
│   └── index.html       # HTML шаблон
├── public/              # Статические файлы
├── dist/                # Собранный проект (генерируется)
└── package.json
```

## Установка

```bash
npm install
```

## Разработка

```bash
npm run dev
```

Запустит dev-сервер на `http://localhost:3000`

## Сборка

```bash
npm run build
```

Собранный проект будет в папке `dist/`

## Предпросмотр сборки

```bash
npm run preview
```

## Линтинг и форматирование

```bash
# Проверка ESLint
npm run lint:check

# Автоисправление ESLint
npm run lint

# Проверка форматирования Prettier
npm run format:check

# Форматирование Prettier
npm run format
```

## Тестирование

```bash
# Запуск тестов
npm test

# Запуск тестов с UI
npm run test:ui
```

## Особенности

- ✅ Mobile-first адаптивная верстка
- ✅ Light/Dark тема
- ✅ Многоязычность (RU/EN)
- ✅ SEO оптимизация
- ✅ Оптимизация производительности (LCP, FID, CLS)
- ✅ Lazy loading изображений
- ✅ Семантическая HTML разметка
- ✅ Доступность (a11y)

## Производительность

Проект оптимизирован для достижения следующих метрик:

- **LCP** (Largest Contentful Paint): < 2.5 сек
- **FID** (First Input Delay): < 100 мс
- **CLS** (Cumulative Layout Shift): < 0.1

## Деплой

Проект настроен для деплоя на Beget (https://develonik.ru/)

## Лицензия

MIT

