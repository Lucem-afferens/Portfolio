<?php
/**
 * Конфигурация API
 * ⚠️ ВАЖНО: Замените значения на свои перед использованием!
 */

// Загрузка конфигурации БД
$dbConfig = require __DIR__ . '/../database/config.php';

// Telegram Bot настройки
// 1. Создайте бота через @BotFather в Telegram
// 2. Получите токен (выглядит как: 123456789:ABCdefGHIjklMNOpqrsTUVwxyz)
// 3. Узнайте свой Chat ID через @userinfobot
define('TELEGRAM_BOT_TOKEN', 'YOUR_BOT_TOKEN'); // ⚠️ ЗАМЕНИТЕ НА ВАШ ТОКЕН
define('TELEGRAM_CHAT_ID', 'YOUR_CHAT_ID'); // ⚠️ ЗАМЕНИТЕ НА ВАШ CHAT ID

// Email настройки
define('ADMIN_EMAIL', 'nikwebdev.2025@gmail.com');

// Настройки безопасности
// ⚠️ ОБЯЗАТЕЛЬНО ИЗМЕНИТЕ ПАРОЛЬ НА СВОЙ БЕЗОПАСНЫЙ!
// Пароль должен быть сложным (минимум 12 символов, буквы, цифры, символы)
define('ADMIN_PASSWORD_HASH', password_hash('CHANGE_THIS_PASSWORD', PASSWORD_DEFAULT));

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
