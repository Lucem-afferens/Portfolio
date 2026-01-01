<?php
/**
 * API для отправки отзыва
 */

// Устанавливаем заголовки JSON в начале
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
    // Загружаем config.php первым (определяет константы)
    require_once __DIR__ . '/config.php';
    // Затем db.php (использует config)
    require_once __DIR__ . '/db.php';
    // Затем utils.php (использует константы из config)
    require_once __DIR__ . '/utils.php';
} catch (Exception $e) {
    sendError('Ошибка инициализации: ' . $e->getMessage());
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Method not allowed']);
    exit;
}

// Получение данных (поддержка FormData и JSON)
$data = [];

// Проверяем, отправлены ли данные как FormData
if (!empty($_POST)) {
    $data = $_POST;
    
    // Обработка загрузки фото
    if (isset($_FILES['photo']) && $_FILES['photo']['error'] === UPLOAD_ERR_OK) {
        $file = $_FILES['photo'];
        
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
        $uploadDir = __DIR__ . '/../uploads/testimonials/';
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
        
        $fileName = uniqid('testimonial_', true) . '_' . time() . '.' . $safeExtension;
        $filePath = $uploadDir . $fileName;
        
        // Перемещаем файл
        if (!move_uploaded_file($file['tmp_name'], $filePath)) {
            sendError('Ошибка при сохранении файла', 500);
        }
        
        // Сохраняем относительный путь
        $data['photo'] = '/uploads/testimonials/' . $fileName;
    }
} else {
    // Fallback для JSON (старый способ)
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
$errors = validateTestimonial($data);
if (!empty($errors)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'errors' => $errors]);
    exit;
}

try {
    // Сохранение в БД
    $stmt = $pdo->prepare("
        INSERT INTO testimonials (name, position, company, message, photo, ip_address, status)
        VALUES (:name, :position, :company, :message, :photo, :ip_address, 'pending')
    ");
    
    $stmt->execute([
        ':name' => trim($data['name']),
        ':position' => trim($data['position'] ?? ''),
        ':company' => trim($data['company'] ?? ''),
        ':message' => trim($data['message']),
        ':photo' => $data['photo'] ?? null,
        ':ip_address' => getClientIp(),
    ]);
    
    $testimonialId = $pdo->lastInsertId();
    
    // Формирование уведомлений
    $telegramMessage = "🔔 <b>Новый отзыв на модерации</b>\n\n";
    $telegramMessage .= "👤 <b>Имя:</b> " . htmlspecialchars($data['name']) . "\n";
    if (!empty($data['position'])) {
        $telegramMessage .= "💼 <b>Должность:</b> " . htmlspecialchars($data['position']) . "\n";
    }
    if (!empty($data['company'])) {
        $telegramMessage .= "🏢 <b>Компания:</b> " . htmlspecialchars($data['company']) . "\n";
    }
    $telegramMessage .= "💬 <b>Отзыв:</b>\n" . htmlspecialchars(substr($data['message'], 0, 500)) . "\n\n";
    $telegramMessage .= "ID: #{$testimonialId}";
    
    $emailSubject = "Новый отзыв на модерации - {$data['name']}";
    $emailMessage = "
    <h2>Новый отзыв на модерации</h2>
    <p><strong>Имя:</strong> " . htmlspecialchars($data['name']) . "</p>
    " . (!empty($data['position']) ? "<p><strong>Должность:</strong> " . htmlspecialchars($data['position']) . "</p>" : "") . "
    " . (!empty($data['company']) ? "<p><strong>Компания:</strong> " . htmlspecialchars($data['company']) . "</p>" : "") . "
    <p><strong>Отзыв:</strong></p>
    <p>" . nl2br(htmlspecialchars($data['message'])) . "</p>
    <p><strong>ID отзыва:</strong> #{$testimonialId}</p>
    <p><a href='https://develonik.ru/admin/'>Перейти в админ-панель</a></p>
    ";
    
    // Отправка уведомлений
    // Передаем путь к фото, если оно есть
    $photoPath = !empty($data['photo']) ? $data['photo'] : null;
    sendTelegramNotification($telegramMessage, $photoPath);
    sendEmailNotification($emailSubject, $emailMessage);
    
    http_response_code(200);
    echo json_encode([
        'success' => true,
        'message' => 'Отзыв отправлен на модерацию',
        'id' => $testimonialId,
    ]);
} catch (PDOException $e) {
    error_log('Database error in submit-testimonial.php: ' . $e->getMessage());
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Ошибка при сохранении отзыва',
        'debug' => ini_get('display_errors') ? $e->getMessage() : null,
    ]);
} catch (Exception $e) {
    error_log('Error in submit-testimonial.php: ' . $e->getMessage());
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Произошла ошибка при обработке запроса',
        'debug' => ini_get('display_errors') ? $e->getMessage() : null,
    ]);
}

