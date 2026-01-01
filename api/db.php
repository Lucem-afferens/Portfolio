<?php
/**
 * Подключение к базе данных
 */

// Загружаем конфигурацию БД
$dbConfigPath = __DIR__ . '/../database/config.php';
if (!file_exists($dbConfigPath)) {
    throw new Exception('Database config file not found at: ' . $dbConfigPath);
}

$dbConfig = require $dbConfigPath;

if (!is_array($dbConfig)) {
    throw new Exception('Invalid database config format');
}

try {
    $dsn = sprintf(
        'mysql:host=%s;dbname=%s;charset=%s',
        $dbConfig['host'],
        $dbConfig['dbname'],
        $dbConfig['charset']
    );
    
    $pdo = new PDO($dsn, $dbConfig['username'], $dbConfig['password'], [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false,
    ]);
} catch (PDOException $e) {
    // Не выводим ошибку здесь, пусть вызывающий код обработает
    throw $e;
}

