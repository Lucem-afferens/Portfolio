<?php
/**
 * API для удаления отзыва (требует авторизации)
 */

session_start();

// Устанавливаем заголовки JSON
header('Content-Type: application/json; charset=utf-8');

// Обработка ошибок
error_reporting(E_ALL);
ini_set('display_errors', 0);

// Функция для безопасного вывода ошибки
function sendError($message, $code = 500) {
    http_response_code($code);
    echo json_encode([
        'success' => false,
        'error' => $message,
    ]);
    exit;
}

try {
    require_once __DIR__ . '/config.php';
    require_once __DIR__ . '/db.php';
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

// Получение данных
$rawInput = file_get_contents('php://input');
$data = json_decode($rawInput, true);

if (json_last_error() !== JSON_ERROR_NONE) {
    sendError('Некорректный JSON: ' . json_last_error_msg(), 400);
}

if (!isset($data['id']) || !is_numeric($data['id'])) {
    sendError('ID отзыва не указан или неверен', 400);
}

$id = (int) $data['id'];

try {
    // Проверяем существование отзыва
    $checkStmt = $pdo->prepare('SELECT id FROM testimonials WHERE id = :id');
    $checkStmt->execute([':id' => $id]);
    
    if (!$checkStmt->fetch()) {
        sendError('Отзыв не найден', 404);
    }
    
    // Удаляем отзыв
    $deleteStmt = $pdo->prepare('DELETE FROM testimonials WHERE id = :id');
    $deleteStmt->execute([':id' => $id]);
    
    http_response_code(200);
    echo json_encode([
        'success' => true,
        'message' => 'Отзыв успешно удален',
    ]);
} catch (PDOException $e) {
    error_log('Database error in delete-testimonial.php: ' . $e->getMessage());
    sendError('Ошибка при удалении отзыва', 500);
} catch (Exception $e) {
    error_log('Error in delete-testimonial.php: ' . $e->getMessage());
    sendError('Произошла ошибка при обработке запроса', 500);
}


