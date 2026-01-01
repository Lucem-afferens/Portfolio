# Настройка системы отзывов

## Шаг 1: Настройка базы данных

1. Создайте базу данных MySQL:
```sql
CREATE DATABASE portfolio_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

2. Импортируйте схему:
```bash
mysql -u your_username -p portfolio_db < database/schema.sql
```

3. Настройте конфигурацию:
```bash
cp database/config.example.php database/config.php
```

Отредактируйте `database/config.php` с вашими данными БД.

## Шаг 2: Настройка Telegram бота

1. Создайте бота через [@BotFather](https://t.me/BotFather)
2. Получите токен бота
3. Узнайте свой Chat ID (можно через [@userinfobot](https://t.me/userinfobot))

## Шаг 3: Настройка API

Отредактируйте `api/config.php`:

```php
// Telegram
define('TELEGRAM_BOT_TOKEN', 'ваш_токен_бота');
define('TELEGRAM_CHAT_ID', 'ваш_chat_id');

// Email
define('ADMIN_EMAIL', 'nikwebdev.2025@gmail.com');

// Пароль админа (сгенерируйте hash)
define('ADMIN_PASSWORD_HASH', password_hash('ваш_безопасный_пароль', PASSWORD_DEFAULT));
```

## Шаг 4: Настройка веб-сервера

Убедитесь, что:
- PHP 7.4+ установлен
- Расширение PDO для MySQL включено
- Расширение curl включено (для Telegram API)
- Функция mail() настроена (для email)

## Шаг 5: Права доступа

```bash
chmod 644 api/*.php
chmod 600 database/config.php
```

## Использование

### Публичная форма отзывов
- URL: `/testimonial-form.html`
- Пользователи могут оставлять отзывы
- После отправки отзыв попадает на модерацию

### Админ-панель
- URL: `/admin.html`
- Вход по паролю
- Модерация отзывов:
  - **На модерации** - новые отзывы
  - **Одобренные** - опубликованные отзывы
  - **Архив** - отклоненные отзывы с причинами

### Отображение на сайте
- Компонент Testimonials автоматически загружает одобренные отзывы
- Отзывы отображаются в слайдере на главной странице

## Безопасность

⚠️ **Важно:**
- Не коммитьте `database/config.php` в git (уже в .gitignore)
- Используйте сложный пароль для админ-панели
- Регулярно проверяйте логи на подозрительную активность
- Настройте HTTPS для защиты данных


