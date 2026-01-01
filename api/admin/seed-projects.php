<?php
/**
 * Скрипт для добавления начальных проектов в базу данных
 * ⚠️ ВАЖНО: Выполните этот скрипт один раз после создания таблицы projects
 * Откройте: https://develonik.ru/api/admin/seed-projects.php
 * После выполнения удалите этот файл для безопасности
 */

session_start();

require_once __DIR__ . '/../config.php';
require_once __DIR__ . '/../db.php';

header('Content-Type: text/html; charset=utf-8');

// Проверка авторизации (опционально, можно закомментировать для первого запуска)
// if (!isset($_SESSION['admin_logged_in']) || !$_SESSION['admin_logged_in']) {
//     die('Unauthorized. Please login first.');
// }

// Проверяем, есть ли уже проекты
$checkStmt = $pdo->query("SELECT COUNT(*) as count FROM projects");
$existingCount = $checkStmt->fetch(PDO::FETCH_ASSOC)['count'];

if ($existingCount > 0) {
    echo '<!DOCTYPE html>
    <html lang="ru">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Проекты уже добавлены</title>
        <style>
            body { font-family: Arial, sans-serif; max-width: 600px; margin: 50px auto; padding: 20px; }
            .info { background: #d1ecf1; border: 1px solid #17a2b8; padding: 15px; border-radius: 5px; color: #0c5460; }
        </style>
    </head>
    <body>
        <div class="info">
            <h2>ℹ️ Проекты уже добавлены</h2>
            <p>В базе данных уже есть <strong>' . $existingCount . '</strong> проект(ов).</p>
            <p>Если вы хотите добавить проекты заново, сначала очистите таблицу projects.</p>
        </div>
    </body>
    </html>';
    exit;
}

// Проекты для добавления
$projects = [
    [
        'title' => 'Точка GG',
        'role' => 'Full-stack Developer',
        'description' => 'Разработка WordPress-темы с нуля, SEO-оптимизация и улучшение производительности',
        'tools' => ['WordPress', 'PHP', 'SEO', 'PageSpeed'],
        'link' => 'https://kungur-tochkagg.ru',
        'image' => '/images/project-placeholder.svg',
        'display_order' => 1,
    ],
    [
        'title' => 'Приз Бокс',
        'role' => 'Full-stack Developer',
        'description' => 'Telegram-бот с личным кабинетом, рейтингом и админ-панелью',
        'tools' => ['Telegram API', 'PHP', 'MySQL', 'AI'],
        'link' => 'https://t.me/wheel_prize_test_bot',
        'image' => '/images/project-placeholder.svg',
        'display_order' => 2,
    ],
    [
        'title' => 'Welcome to Day',
        'role' => 'Full-stack Developer',
        'description' => 'Каталог интерактивных приглашений с формами заявок, промокодами и уведомлениями',
        'tools' => ['Frontend', 'SEO', 'Analytics', 'Optimization'],
        'link' => 'https://welcome-to-day.ru',
        'image' => '/images/project-placeholder.svg',
        'display_order' => 3,
    ],
];

try {
    $pdo->beginTransaction();
    
    $stmt = $pdo->prepare("
        INSERT INTO projects (title, role, description, tools, link, image, display_order)
        VALUES (:title, :role, :description, :tools, :link, :image, :display_order)
    ");
    
    $added = 0;
    foreach ($projects as $project) {
        $stmt->execute([
            ':title' => $project['title'],
            ':role' => $project['role'],
            ':description' => $project['description'],
            ':tools' => json_encode($project['tools'], JSON_UNESCAPED_UNICODE),
            ':link' => $project['link'],
            ':image' => $project['image'],
            ':display_order' => $project['display_order'],
        ]);
        $added++;
    }
    
    $pdo->commit();
    
    echo '<!DOCTYPE html>
    <html lang="ru">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Проекты добавлены</title>
        <style>
            body { font-family: Arial, sans-serif; max-width: 600px; margin: 50px auto; padding: 20px; }
            .success { background: #d4edda; border: 1px solid #28a745; padding: 15px; border-radius: 5px; color: #155724; }
            .warning { background: #fff3cd; border: 1px solid #ffc107; padding: 15px; border-radius: 5px; color: #856404; margin-top: 20px; }
            ul { margin: 10px 0; padding-left: 20px; }
        </style>
    </head>
    <body>
        <div class="success">
            <h2>✅ Проекты успешно добавлены!</h2>
            <p>Добавлено проектов: <strong>' . $added . '</strong></p>
            <ul>';
    
    foreach ($projects as $project) {
        echo '<li><strong>' . htmlspecialchars($project['title']) . '</strong> - ' . htmlspecialchars($project['role']) . '</li>';
    }
    
    echo '</ul>
            <p>Теперь проекты отображаются на сайте и доступны в админ-панели.</p>
        </div>
        <div class="warning">
            <h3>⚠️ Важно для безопасности:</h3>
            <p>Рекомендуется удалить этот файл после использования:</p>
            <code>api/admin/seed-projects.php</code>
        </div>
    </body>
    </html>';
    
} catch (PDOException $e) {
    $pdo->rollBack();
    
    echo '<!DOCTYPE html>
    <html lang="ru">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Ошибка</title>
        <style>
            body { font-family: Arial, sans-serif; max-width: 600px; margin: 50px auto; padding: 20px; }
            .error { background: #f8d7da; border: 1px solid #dc3545; padding: 15px; border-radius: 5px; color: #721c24; }
        </style>
    </head>
    <body>
        <div class="error">
            <h2>❌ Ошибка при добавлении проектов</h2>
            <p>' . htmlspecialchars($e->getMessage()) . '</p>
        </div>
    </body>
    </html>';
}

