<?php
/**
 * Тестовый скрипт для проверки подключения к БД
 * Удалите этот файл после проверки!
 */

require_once __DIR__ . '/db.php';

try {
    // Простой тест запроса
    $stmt = $pdo->query('SELECT 1 as test');
    $result = $stmt->fetch();
    
    // Проверка существования таблиц
    $tables = $pdo->query("SHOW TABLES LIKE 'testimonials'")->fetch();
    
    if ($tables) {
        echo json_encode([
            'success' => true,
            'message' => 'Database connected successfully!',
            'tables' => 'Testimonials table exists',
        ], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
    } else {
        echo json_encode([
            'success' => false,
            'message' => 'Database connected, but testimonials table not found!',
            'hint' => 'Run database/install.sql to create tables',
        ], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
    }
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Database connection failed',
        'message' => $e->getMessage(),
    ], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
}

