<?php
/**
 * API для сохранения проекта (создание/обновление, требует авторизации)
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

// Получение данных (поддержка FormData и JSON)
$data = [];

// Проверяем, отправлены ли данные как FormData
if (!empty($_POST)) {
    $data = $_POST;
    
    // Преобразуем tools из JSON строки в массив
    if (isset($data['tools']) && is_string($data['tools'])) {
        $decoded = json_decode($data['tools'], true);
        $data['tools'] = is_array($decoded) ? $decoded : [];
    }
} else {
    // Fallback для JSON
    $rawInput = file_get_contents('php://input');
    $data = json_decode($rawInput, true);
    
    if (json_last_error() !== JSON_ERROR_NONE) {
        sendError('Некорректный JSON: ' . json_last_error_msg(), 400);
    }
    
    if (!is_array($data)) {
        sendError('Данные не получены или имеют неверный формат', 400);
    }
}

// Валидация
$errors = [];
if (empty($data['title']) || strlen(trim($data['title'])) < 1) {
    $errors[] = 'Название проекта обязательно';
}
if (empty($data['role']) || strlen(trim($data['role'])) < 1) {
    $errors[] = 'Роль обязательна';
}
if (empty($data['description']) || strlen(trim($data['description'])) < 1) {
    $errors[] = 'Описание обязательно';
}
if (empty($data['link']) || !filter_var($data['link'], FILTER_VALIDATE_URL)) {
    $errors[] = 'Ссылка на проект обязательна и должна быть валидным URL';
}
if (!is_array($data['tools'])) {
    $errors[] = 'Инструменты должны быть массивом';
}

if (!empty($errors)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'errors' => $errors]);
    exit;
}

// Обработка загрузки изображения
$imagePath = $data['image'] ?? null;

if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
    $file = $_FILES['image'];
    
    // Валидация размера (5 МБ)
    $maxSize = 5 * 1024 * 1024;
    if ($file['size'] > $maxSize) {
        sendError('Размер файла не должен превышать 5 МБ', 400);
    }
    
    // Валидация типа файла
    $allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    $finfo = finfo_open(FILEINFO_MIME_TYPE);
    $mimeType = finfo_file($finfo, $file['tmp_name']);
    finfo_close($finfo);
    
    if (!in_array($mimeType, $allowedTypes, true)) {
        sendError('Разрешены только изображения (JPG, PNG, WebP)', 400);
    }
    
    // Создаем директорию для загрузок
    $uploadDir = __DIR__ . '/../../uploads/projects/';
    if (!is_dir($uploadDir)) {
        if (!mkdir($uploadDir, 0755, true)) {
            sendError('Ошибка создания директории для загрузок', 500);
        }
    }
    
    // Генерируем безопасное имя файла
    $extension = pathinfo($file['name'], PATHINFO_EXTENSION);
    $safeExtension = in_array(strtolower($extension), ['jpg', 'jpeg', 'png', 'webp'], true)
        ? strtolower($extension)
        : 'jpg';
    
    $fileName = uniqid('project_', true) . '_' . time() . '.' . $safeExtension;
    $filePath = $uploadDir . $fileName;
    
    // Перемещаем файл
    if (!move_uploaded_file($file['tmp_name'], $filePath)) {
        sendError('Ошибка при сохранении файла', 500);
    }
    
    // Сохраняем относительный путь
    $imagePath = '/uploads/projects/' . $fileName;
    
    // Удаляем старое изображение, если обновляем проект
    if (isset($data['id']) && !empty($data['id'])) {
        $oldStmt = $pdo->prepare('SELECT image FROM projects WHERE id = :id');
        $oldStmt->execute([':id' => (int)$data['id']]);
        $oldProject = $oldStmt->fetch(PDO::FETCH_ASSOC);
        if ($oldProject && !empty($oldProject['image'])) {
            $oldPath = __DIR__ . '/../..' . $oldProject['image'];
            if (file_exists($oldPath)) {
                @unlink($oldPath);
            }
        }
    }
}

try {
    $toolsJson = json_encode($data['tools'], JSON_UNESCAPED_UNICODE);
    $displayOrder = isset($data['display_order']) ? (int)$data['display_order'] : 0;
    
    if (isset($data['id']) && !empty($data['id'])) {
        // Обновление существующего проекта
        $stmt = $pdo->prepare("
            UPDATE projects 
            SET title = :title, role = :role, description = :description, 
                tools = :tools, link = :link, image = :image, display_order = :display_order
            WHERE id = :id
        ");
        
        $stmt->execute([
            ':id' => (int)$data['id'],
            ':title' => trim($data['title']),
            ':role' => trim($data['role']),
            ':description' => trim($data['description']),
            ':tools' => $toolsJson,
            ':link' => trim($data['link']),
            ':image' => $imagePath,
            ':display_order' => $displayOrder,
        ]);
        
        $projectId = (int)$data['id'];
    } else {
        // Создание нового проекта
        $stmt = $pdo->prepare("
            INSERT INTO projects (title, role, description, tools, link, image, display_order)
            VALUES (:title, :role, :description, :tools, :link, :image, :display_order)
        ");
        
        $stmt->execute([
            ':title' => trim($data['title']),
            ':role' => trim($data['role']),
            ':description' => trim($data['description']),
            ':tools' => $toolsJson,
            ':link' => trim($data['link']),
            ':image' => $imagePath,
            ':display_order' => $displayOrder,
        ]);
        
        $projectId = $pdo->lastInsertId();
    }
    
    http_response_code(200);
    echo json_encode([
        'success' => true,
        'message' => isset($data['id']) ? 'Проект обновлен' : 'Проект создан',
        'id' => $projectId,
    ]);
} catch (PDOException $e) {
    error_log('Database error in admin/save-project.php: ' . $e->getMessage());
    sendError('Ошибка при сохранении проекта', 500);
}

