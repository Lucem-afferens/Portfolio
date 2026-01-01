<?php
/**
 * API для получения всех проектов
 */

require_once __DIR__ . '/db.php';

try {
    $stmt = $pdo->prepare("
        SELECT id, title, role, description, tools, link, image, display_order
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
    error_log('Database error in get-projects.php: ' . $e->getMessage());
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Ошибка при получении проектов',
    ]);
}


