<?php
/**
 * Тестовый скрипт для проверки подключения к БД
 * Удалите этот файл после проверки!
 */

header('Content-Type: application/json; charset=utf-8');

// Проверяем наличие config.php
if (!file_exists(__DIR__ . '/config.php')) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Config file not found',
        'message' => 'api/config.php does not exist. Check deployment.',
    ], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
    exit;
}

// Проверяем наличие database config
if (!file_exists(__DIR__ . '/../database/config.php')) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Database config not found',
        'message' => 'database/config.php does not exist. Check deployment.',
    ], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
    exit;
}

try {
    require_once __DIR__ . '/db.php';
    
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
        'details' => [
            'file' => __FILE__,
            'config_exists' => file_exists(__DIR__ . '/config.php'),
            'db_config_exists' => file_exists(__DIR__ . '/../database/config.php'),
        ],
    ], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Unexpected error',
        'message' => $e->getMessage(),
        'type' => get_class($e),
    ], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
}

