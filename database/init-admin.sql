-- Инициализация администратора
-- Использование: mysql -u your_username -p your_database < database/init-admin.sql
-- Или выполните SQL в phpMyAdmin

-- ВАЖНО: Замените 'admin' и 'your_secure_password' на свои значения!
-- Пароль будет автоматически хеширован с помощью password_hash()

-- Удаляем существующего админа (если нужно пересоздать)
-- DELETE FROM admins WHERE username = 'admin';

-- Создаем нового администратора
-- ВАЖНО: Замените 'admin' на желаемый логин и 'your_secure_password' на безопасный пароль
INSERT INTO admins (username, password_hash) 
VALUES (
  'admin', 
  '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi' -- Пароль: password (ЗАМЕНИТЕ!)
)
ON DUPLICATE KEY UPDATE 
  password_hash = VALUES(password_hash);

-- Для создания хеша пароля используйте PHP:
-- <?php echo password_hash('your_secure_password', PASSWORD_DEFAULT); ?>
-- Или онлайн генератор: https://bcrypt-generator.com/

-- Проверка
SELECT id, username, created_at FROM admins;

