-- Инициализация администратора
-- Использование: mysql -u your_username -p your_database < database/init-admin.sql
-- Или выполните SQL в phpMyAdmin

-- ⚠️ ВАЖНО: Этот скрипт содержит пример с тестовым паролем!
-- Вы НЕ должны использовать этот хеш в продакшене!

-- ============================================
-- ИНСТРУКЦИЯ ПО СОЗДАНИЮ АДМИНИСТРАТОРА
-- ============================================
-- 
-- 1. Сгенерируйте хеш пароля одним из способов:
--    
--    Способ А: Используйте PHP скрипт
--    - Откройте в браузере: database/generate-password-hash.php
--    - Введите желаемый пароль
--    - Скопируйте сгенерированный хеш
--    
--    Способ Б: Через командную строку PHP
--    php -r "echo password_hash('ваш_пароль', PASSWORD_DEFAULT);"
--    
--    Способ В: Онлайн генератор
--    https://bcrypt-generator.com/
--
-- 2. Выполните SQL запрос с вашим хешем:
--    
--    INSERT INTO admins (username, password_hash) 
--    VALUES ('admin', 'ВАШ_СГЕНЕРИРОВАННЫЙ_ХЕШ');
--    
--    Или если админ уже существует:
--    
--    UPDATE admins 
--    SET password_hash = 'ВАШ_СГЕНЕРИРОВАННЫЙ_ХЕШ' 
--    WHERE username = 'admin';
--
-- 3. Войдите в админ-панель:
--    - Откройте: https://develonik.ru/pages/admin.html
--    - Логин: admin (или тот, который вы указали)
--    - Пароль: тот, который вы использовали для генерации хеша
--
-- ============================================

-- Удаляем существующего админа (если нужно пересоздать)
-- DELETE FROM admins WHERE username = 'admin';

-- ⚠️ ПРИМЕР (НЕ ИСПОЛЬЗУЙТЕ В ПРОДАКШЕНЕ!)
-- Этот хеш соответствует паролю "password" - это только для тестирования!
-- INSERT INTO admins (username, password_hash) 
-- VALUES (
--   'admin', 
--   '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi' -- Пароль: password
-- )
-- ON DUPLICATE KEY UPDATE 
--   password_hash = VALUES(password_hash);

-- Проверка существующих администраторов
SELECT id, username, created_at FROM admins;

