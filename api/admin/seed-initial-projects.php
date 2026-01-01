<?php
/**
 * API для добавления начальных проектов (требует авторизации)
 */

session_start();

header('Content-Type: application/json; charset=utf-8');

function sendError($message, $code = 500) {
    http_response_code($code);
    echo json_encode([
        'success' => false,
        'error' => $message,
    ]);
    exit;
}

try {
    require_once __DIR__ . '/../config.php';
    require_once __DIR__ . '/../db.php';
} catch (Exception $e) {
    sendError('Ошибка инициализации: ' . $e->getMessage());
}

// Проверка авторизации
if (!isset($_SESSION['admin_logged_in']) || !$_SESSION['admin_logged_in']) {
    sendError('Unauthorized', 401);
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendError('Method not allowed', 405);
}

// Проверяем, есть ли уже проекты
$checkStmt = $pdo->query("SELECT COUNT(*) as count FROM projects");
$existingCount = $checkStmt->fetch(PDO::FETCH_ASSOC)['count'];

if ($existingCount > 0) {
    http_response_code(200);
    echo json_encode([
        'success' => true,
        'message' => 'Проекты уже существуют в базе данных (' . $existingCount . ' проектов)',
        'count' => $existingCount,
        'skipped' => true,
    ]);
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
    
    http_response_code(200);
    echo json_encode([
        'success' => true,
        'message' => 'Успешно добавлено ' . $added . ' проектов',
        'count' => $added,
        'projects' => array_map(function($p) {
            return $p['title'];
        }, $projects),
    ]);
    
} catch (PDOException $e) {
    $pdo->rollBack();
    error_log('Database error in admin/seed-initial-projects.php: ' . $e->getMessage());
    sendError('Ошибка при добавлении проектов: ' . $e->getMessage(), 500);
}

