<?php
/**
 * API для авторизации админа
 */

session_start();
require_once __DIR__ . '/config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Method not allowed']);
    exit;
}

$data = json_decode(file_get_contents('php://input'), true);

$password = $data['password'] ?? '';

// Простая проверка пароля (в production используйте БД)
if (password_verify($password, ADMIN_PASSWORD_HASH)) {
    $_SESSION['admin_logged_in'] = true;
    $_SESSION['admin_login_time'] = time();
    
    http_response_code(200);
    echo json_encode([
        'success' => true,
        'message' => 'Авторизация успешна',
    ]);
} else {
    http_response_code(401);
    echo json_encode([
        'success' => false,
        'error' => 'Неверный пароль',
    ]);
}


