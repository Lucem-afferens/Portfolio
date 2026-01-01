<?php
/**
 * API для сохранения настройки сайта (фото, требует авторизации)
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

// Определяем, отправлены ли данные как FormData (с файлом) или JSON
$isFormData = isset($_FILES['photo']) || isset($_POST['setting_key']);

if ($isFormData) {
    // Данные отправлены как FormData
    $settingKey = $_POST['setting_key'] ?? null;
    $delete = isset($_POST['delete']) && $_POST['delete'] === 'true';
} else {
    // Данные отправлены как JSON
    $rawInput = file_get_contents('php://input');
    $data = json_decode($rawInput, true);
    
    if (json_last_error() !== JSON_ERROR_NONE) {
        sendError('Некорректный JSON', 400);
    }
    
    $settingKey = $data['setting_key'] ?? null;
    $delete = isset($data['delete']) && $data['delete'] === true;
}

// Валидация ключа настройки
if (!$settingKey || !in_array($settingKey, ['hero_photo', 'about_photo', 'logo'], true)) {
    sendError('Некорректный ключ настройки', 400);
}

$settingValue = null;

// Обработка загрузки фото или удаления
if ($delete) {
    // Удаление фото
    $settingValue = null;
} elseif (isset($_FILES['photo']) && $_FILES['photo']['error'] === UPLOAD_ERR_OK) {
    $file = $_FILES['photo'];
    
    // Валидация размера (5 МБ)
    $maxSize = 5 * 1024 * 1024;
    if ($file['size'] > $maxSize) {
        sendError('Размер файла не должен превышать 5 МБ', 400);
    }
    
    // Валидация типа файла
    $allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/svg+xml'];
    $finfo = finfo_open(FILEINFO_MIME_TYPE);
    $mimeType = finfo_file($finfo, $file['tmp_name']);
    finfo_close($finfo);
    
    if (!in_array($mimeType, $allowedTypes, true)) {
        sendError('Разрешены только изображения (JPG, PNG, WebP, SVG)', 400);
    }
    
    // Создаем директорию для загрузок
    $uploadDir = __DIR__ . '/../../uploads/site/';
    if (!is_dir($uploadDir)) {
        if (!mkdir($uploadDir, 0755, true)) {
            sendError('Ошибка создания директории для загрузок', 500);
        }
    }
    
    // Получаем старое значение для удаления файла
    $oldStmt = $pdo->prepare('SELECT setting_value FROM site_settings WHERE setting_key = :key');
    $oldStmt->execute([':key' => $settingKey]);
    $oldSetting = $oldStmt->fetch(PDO::FETCH_ASSOC);
    
    // Удаляем старое фото, если есть
    if ($oldSetting && !empty($oldSetting['setting_value'])) {
        $oldPath = __DIR__ . '/../..' . $oldSetting['setting_value'];
        if (file_exists($oldPath)) {
            @unlink($oldPath);
        }
    }
    
    // Генерируем безопасное имя файла
    $extension = pathinfo($file['name'], PATHINFO_EXTENSION);
    $safeExtension = in_array(strtolower($extension), ['jpg', 'jpeg', 'png', 'webp', 'svg'], true)
        ? strtolower($extension)
        : 'jpg';
    
    $fileName = $settingKey . '_' . time() . '.' . $safeExtension;
    $filePath = $uploadDir . $fileName;
    
    // Перемещаем файл
    if (!move_uploaded_file($file['tmp_name'], $filePath)) {
        sendError('Ошибка при сохранении файла', 500);
    }
    
    // Сохраняем относительный путь
    $settingValue = '/uploads/site/' . $fileName;
}

try {
    // Обновляем или создаем настройку
    $stmt = $pdo->prepare("
        INSERT INTO site_settings (setting_key, setting_value)
        VALUES (:key, :value)
        ON DUPLICATE KEY UPDATE setting_value = :value
    ");
    
    $stmt->execute([
        ':key' => $settingKey,
        ':value' => $settingValue,
    ]);
    
    http_response_code(200);
    echo json_encode([
        'success' => true,
        'message' => $settingValue ? 'Фото сохранено' : 'Фото удалено',
        'value' => $settingValue,
    ]);
} catch (PDOException $e) {
    error_log('Database error in admin/save-site-setting.php: ' . $e->getMessage());
    sendError('Ошибка при сохранении настройки', 500);
}

