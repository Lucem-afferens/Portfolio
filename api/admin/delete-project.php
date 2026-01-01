<?php
/**
 * API для удаления проекта (требует авторизации)
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

$rawInput = file_get_contents('php://input');
$data = json_decode($rawInput, true);

if (!isset($data['id']) || !is_numeric($data['id'])) {
    sendError('ID проекта не указан или неверен', 400);
}

$id = (int) $data['id'];

try {
    // Получаем информацию о проекте для удаления изображения
    $checkStmt = $pdo->prepare('SELECT image FROM projects WHERE id = :id');
    $checkStmt->execute([':id' => $id]);
    $project = $checkStmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$project) {
        sendError('Проект не найден', 404);
    }
    
    // Удаляем проект
    $deleteStmt = $pdo->prepare('DELETE FROM projects WHERE id = :id');
    $deleteStmt->execute([':id' => $id]);
    
    // Удаляем изображение, если оно есть
    if (!empty($project['image'])) {
        $imagePath = __DIR__ . '/../..' . $project['image'];
        if (file_exists($imagePath)) {
            @unlink($imagePath);
        }
    }
    
    http_response_code(200);
    echo json_encode([
        'success' => true,
        'message' => 'Проект успешно удален',
    ]);
} catch (PDOException $e) {
    error_log('Database error in admin/delete-project.php: ' . $e->getMessage());
    sendError('Ошибка при удалении проекта', 500);
}


