<?php
/**
 * API для авторизации админа
 */

session_start();
require_once __DIR__ . '/db.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Method not allowed']);
    exit;
}

$data = json_decode(file_get_contents('php://input'), true);

$username = $data['username'] ?? '';
$password = $data['password'] ?? '';

if (empty($username) || empty($password)) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'error' => 'Логин и пароль обязательны',
    ]);
    exit;
}

try {
    // Проверяем логин и пароль в БД
    $stmt = $pdo->prepare('SELECT id, username, password_hash FROM admins WHERE username = ? LIMIT 1');
    $stmt->execute([$username]);
    $admin = $stmt->fetch();

    if (!$admin) {
        http_response_code(401);
        echo json_encode([
            'success' => false,
            'error' => 'Неверный логин или пароль',
        ]);
        exit;
    }

    // Логируем для отладки (только в dev режиме)
    if (defined('DEBUG') && DEBUG) {
        error_log('Login attempt - Username: ' . $username);
        error_log('Hash from DB length: ' . strlen($admin['password_hash']));
        error_log('Hash format: ' . substr($admin['password_hash'], 0, 4));
    }

    // Проверяем, что хеш не обрезан
    if (strlen($admin['password_hash']) < 60) {
        error_log('WARNING: Password hash seems truncated. Length: ' . strlen($admin['password_hash']));
    }

    // Проверяем пароль
    $isValid = password_verify($password, $admin['password_hash']);

    if ($isValid) {
        $_SESSION['admin_logged_in'] = true;
        $_SESSION['admin_id'] = $admin['id'];
        $_SESSION['admin_username'] = $admin['username'];
        $_SESSION['admin_login_time'] = time();
        
        http_response_code(200);
        echo json_encode([
            'success' => true,
            'message' => 'Авторизация успешна',
        ]);
    } else {
        // Логируем для отладки
        error_log('Failed login attempt for username: ' . $username);
        error_log('Hash format: ' . substr($admin['password_hash'], 0, 4));
        error_log('Hash length: ' . strlen($admin['password_hash']));
        
        http_response_code(401);
        echo json_encode([
            'success' => false,
            'error' => 'Неверный логин или пароль',
        ]);
    }
} catch (PDOException $e) {
    error_log('Database error in login.php: ' . $e->getMessage());
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Ошибка сервера',
    ]);
}


