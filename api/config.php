<?php
/**
 * Конфигурация API
 */

// Загрузка конфигурации БД
$dbConfig = require __DIR__ . '/../database/config.php';

// Telegram Bot настройки
define('TELEGRAM_BOT_TOKEN', 'YOUR_BOT_TOKEN'); // Получить у @BotFather
define('TELEGRAM_CHAT_ID', 'YOUR_CHAT_ID'); // Ваш Telegram ID

// Email настройки
define('ADMIN_EMAIL', 'nikwebdev.2025@gmail.com');

// Настройки безопасности
define('ADMIN_PASSWORD_HASH', password_hash('your_secure_password', PASSWORD_DEFAULT)); // Измените пароль!

// CORS настройки
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json; charset=utf-8');

// Обработка preflight запросов
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

