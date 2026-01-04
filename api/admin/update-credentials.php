<?php
/**
 * API для изменения логина и пароля админа
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

// Проверка авторизации
if (!isset($_SESSION['admin_logged_in']) || !$_SESSION['admin_logged_in']) {
    sendError('Unauthorized', 401);
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendError('Method not allowed', 405);
}

try {
    require_once __DIR__ . '/../db.php';
    
    $data = json_decode(file_get_contents('php://input'), true);
    
    if (json_last_error() !== JSON_ERROR_NONE) {
        sendError('Некорректный JSON', 400);
    }
    
    $newUsername = isset($data['username']) && $data['username'] !== null ? trim($data['username']) : null;
    $currentPassword = $data['current_password'] ?? '';
    $newPassword = isset($data['new_password']) && $data['new_password'] !== null ? trim($data['new_password']) : null;
    
    // Получаем текущего админа
    $adminId = $_SESSION['admin_id'] ?? null;
    if (!$adminId) {
        sendError('Сессия не найдена', 401);
    }
    
    $stmt = $pdo->prepare('SELECT id, username, password_hash FROM admins WHERE id = ? LIMIT 1');
    $stmt->execute([$adminId]);
    $admin = $stmt->fetch();
    
    if (!$admin) {
        sendError('Администратор не найден', 404);
    }
    
    // Проверяем текущий пароль
    if (!password_verify($currentPassword, $admin['password_hash'])) {
        sendError('Неверный текущий пароль', 401);
    }
    
    $updates = [];
    $params = [];
    
    // Обновление логина
    if ($newUsername !== null && $newUsername !== $admin['username']) {
        if (strlen($newUsername) < 3) {
            sendError('Логин должен содержать минимум 3 символа', 400);
        }
        
        // Проверяем, не занят ли логин другим пользователем
        $checkStmt = $pdo->prepare('SELECT id FROM admins WHERE username = ? AND id != ? LIMIT 1');
        $checkStmt->execute([$newUsername, $adminId]);
        if ($checkStmt->fetch()) {
            sendError('Этот логин уже занят', 400);
        }
        
        $updates[] = 'username = ?';
        $params[] = $newUsername;
    }
    
    // Обновление пароля
    if ($newPassword !== null) {
        if (strlen($newPassword) < 8) {
            sendError('Пароль должен содержать минимум 8 символов', 400);
        }
        
        $updates[] = 'password_hash = ?';
        $params[] = password_hash($newPassword, PASSWORD_DEFAULT);
    }
    
    // Если есть что обновлять
    if (!empty($updates)) {
        $params[] = $adminId;
        $sql = 'UPDATE admins SET ' . implode(', ', $updates) . ' WHERE id = ?';
        $updateStmt = $pdo->prepare($sql);
        $updateStmt->execute($params);
        
        // Обновляем сессию, если изменили логин
        if ($newUsername !== null && $newUsername !== $admin['username']) {
            $_SESSION['admin_username'] = $newUsername;
        }
        
        $messages = [];
        if ($newUsername !== null && $newUsername !== $admin['username']) {
            $messages[] = 'Логин изменен';
        }
        if ($newPassword !== null) {
            $messages[] = 'Пароль изменен';
        }
        
        http_response_code(200);
        echo json_encode([
            'success' => true,
            'message' => implode('. ', $messages),
        ]);
    } else {
        sendError('Не указаны данные для изменения', 400);
    }
} catch (PDOException $e) {
    error_log('Database error in update-credentials.php: ' . $e->getMessage());
    sendError('Ошибка базы данных', 500);
} catch (Exception $e) {
    error_log('Error in update-credentials.php: ' . $e->getMessage());
    sendError('Неожиданная ошибка', 500);
}

