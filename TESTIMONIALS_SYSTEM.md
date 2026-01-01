# Система отзывов с модерацией

## Архитектура

### Frontend (существующий)
- Страница для оставления отзыва (`/testimonial-form.html`)
- Компонент Testimonials для отображения одобренных отзывов

### Backend (новый PHP)
- API для отправки отзывов (`api/submit-testimonial.php`)
- API для получения одобренных отзывов (`api/get-testimonials.php`)
- Админ-панель (`admin/index.php`)
- API для модерации (`api/moderate-testimonial.php`)

### База данных
- Таблица `testimonials` для хранения отзывов
- Статусы: `pending`, `approved`, `rejected`

## Структура БД

```sql
CREATE TABLE testimonials (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  position VARCHAR(255),
  company VARCHAR(255),
  message TEXT NOT NULL,
  photo VARCHAR(255),
  status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
  rejection_reason TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  moderated_at TIMESTAMP NULL,
  ip_address VARCHAR(45)
);
```

## Поток работы

1. Пользователь заполняет форму отзыва
2. Отзыв сохраняется в БД со статусом `pending`
3. Отправляются уведомления (Telegram + Email)
4. Пользователь видит сообщение "Отзыв на модерации"
5. Админ входит в панель модерации
6. Админ одобряет или отклоняет отзыв
7. Одобренные отзывы отображаются на сайте


