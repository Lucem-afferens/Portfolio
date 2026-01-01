<?php
/**
 * API для получения проектов (требует авторизации)
 */

session_start();

header('Content-Type: application/json; charset=utf-8');

try {
    require_once __DIR__ . '/../config.php';
    require_once __DIR__ . '/../db.php';
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Ошибка инициализации: ' . $e->getMessage(),
    ]);
    exit;
}

// Проверка авторизации
if (!isset($_SESSION['admin_logged_in']) || !$_SESSION['admin_logged_in']) {
    http_response_code(401);
    echo json_encode(['success' => false, 'error' => 'Unauthorized']);
    exit;
}

try {
    $stmt = $pdo->prepare("
        SELECT id, title, role, description, tools, link, image, display_order, created_at, updated_at
        FROM projects
        ORDER BY display_order ASC, created_at DESC
    ");
    
    $stmt->execute();
    $projects = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Декодируем JSON поле tools
    foreach ($projects as &$project) {
        $project['tools'] = json_decode($project['tools'], true) ?: [];
    }
    unset($project);
    
    http_response_code(200);
    echo json_encode([
        'success' => true,
        'projects' => $projects,
    ]);
} catch (PDOException $e) {
    error_log('Database error in admin/get-projects.php: ' . $e->getMessage());
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Ошибка при получении проектов',
    ]);
}


