<?php
/**
 * API для сохранения настройки сайта (фото, требует авторизации)
 */

session_start();

header('Content-Type: application/json; charset=utf-8');

function sendError($message, $code = 500, $details = null) {
    http_response_code($code);
    $response = [
        'success' => false,
        'error' => $message,
    ];
    if ($details !== null) {
        $response['details'] = $details;
    }
    echo json_encode($response);
    exit;
}

try {
    require_once __DIR__ . '/../config.php';
    require_once __DIR__ . '/../db.php';
    
    // Проверяем, что $pdo создан
    if (!isset($pdo)) {
        throw new Exception('Database connection not established');
    }
} catch (Exception $e) {
    error_log('Initialization error: ' . $e->getMessage());
    error_log('Stack trace: ' . $e->getTraceAsString());
    sendError('Ошибка инициализации: ' . $e->getMessage(), 500);
}

// Проверка авторизации
if (!isset($_SESSION['admin_logged_in']) || !$_SESSION['admin_logged_in']) {
    sendError('Unauthorized', 401);
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendError('Method not allowed', 405);
}

// Определяем, отправлены ли данные как FormData (с файлом) или JSON
$isFormData = isset($_FILES['photo']) || (isset($_POST['setting_key']) && !empty($_POST['setting_key']));

if ($isFormData) {
    // Данные отправлены как FormData
    $settingKey = $_POST['setting_key'] ?? null;
    $delete = isset($_POST['delete']) && ($_POST['delete'] === 'true' || $_POST['delete'] === true);
    
    // Логируем для отладки
    error_log('FormData request - setting_key: ' . ($settingKey ?? 'null') . ', delete: ' . ($delete ? 'true' : 'false'));
} else {
    // Данные отправлены как JSON
    $rawInput = file_get_contents('php://input');
    $data = json_decode($rawInput, true);
    
    if (json_last_error() !== JSON_ERROR_NONE) {
        sendError('Некорректный JSON: ' . json_last_error_msg(), 400);
    }
    
    $settingKey = $data['setting_key'] ?? null;
    $delete = isset($data['delete']) && $data['delete'] === true;
    
    // Логируем для отладки
    error_log('JSON request - setting_key: ' . ($settingKey ?? 'null') . ', delete: ' . ($delete ? 'true' : 'false'));
}

// Валидация ключа настройки
$allowedKeys = [
    'hero_photo', 'hero_photo_mobile', 'hero_photo_tablet', 'about_photo', 'about_photo_mobile', 'logo', 'logo_light', 'logo_dark', 'logo_theme_switch',
    'contact_github', 'contact_telegram', 'contact_vk', 'contact_linkedin', 'contact_email', 'contact_phone',
    'contact_socials', 'about_text_ru', 'about_text_en'
];
if (!$settingKey || !in_array($settingKey, $allowedKeys, true)) {
    sendError('Некорректный ключ настройки', 400);
}

$settingValue = null;

// Специальная обработка для logo_theme_switch (boolean)
if ($settingKey === 'logo_theme_switch') {
    if ($isFormData) {
        $settingValue = isset($_POST['value']) && ($_POST['value'] === 'true' || $_POST['value'] === '1') ? '1' : '0';
    } else {
        $rawInput = file_get_contents('php://input');
        $data = json_decode($rawInput, true);
        $settingValue = isset($data['value']) && ($data['value'] === true || $data['value'] === 'true' || $data['value'] === '1') ? '1' : '0';
    }
} elseif (in_array($settingKey, ['contact_github', 'contact_telegram', 'contact_vk', 'contact_linkedin', 'contact_email', 'contact_phone', 'contact_socials', 'about_text_ru', 'about_text_en'], true)) {
    // Обработка контактов (строковые значения или JSON для contact_socials)
    if ($isFormData) {
        $settingValue = isset($_POST['value']) ? trim($_POST['value']) : null;
    } else {
        $rawInput = file_get_contents('php://input');
        $data = json_decode($rawInput, true);
        $settingValue = isset($data['value']) && $data['value'] !== null ? trim($data['value']) : null;
    }
    // Если значение пустое, сохраняем как null
    if ($settingValue === '') {
        $settingValue = null;
    }
    // Для contact_socials проверяем валидность JSON
    if ($settingKey === 'contact_socials' && $settingValue !== null) {
        $decoded = json_decode($settingValue, true);
        if (json_last_error() !== JSON_ERROR_NONE) {
            sendError('Некорректный JSON для списка соцсетей: ' . json_last_error_msg(), 400);
        }
        if (!is_array($decoded)) {
            sendError('Список соцсетей должен быть массивом', 400);
        }
    }
} elseif ($delete) {
    // Удаление фото
    $settingValue = null;
} elseif (isset($_FILES['photo'])) {
    // Проверяем ошибки загрузки файла
    $fileError = $_FILES['photo']['error'];
    
    if ($fileError !== UPLOAD_ERR_OK) {
        $errorMessages = [
            UPLOAD_ERR_INI_SIZE => 'Размер файла превышает максимально допустимый',
            UPLOAD_ERR_FORM_SIZE => 'Размер файла превышает максимально допустимый в форме',
            UPLOAD_ERR_PARTIAL => 'Файл был загружен частично',
            UPLOAD_ERR_NO_FILE => 'Файл не был загружен',
            UPLOAD_ERR_NO_TMP_DIR => 'Отсутствует временная папка',
            UPLOAD_ERR_CANT_WRITE => 'Не удалось записать файл на диск',
            UPLOAD_ERR_EXTENSION => 'Загрузка файла остановлена расширением',
        ];
        $errorMsg = $errorMessages[$fileError] ?? 'Ошибка загрузки файла (код: ' . $fileError . ')';
        sendError($errorMsg, 400);
    }
    
    $file = $_FILES['photo'];
    
    // Проверяем, что файл действительно загружен
    if (!is_uploaded_file($file['tmp_name'])) {
        sendError('Файл не был загружен через HTTP POST', 400);
    }
    
    // Валидация размера (5 МБ)
    $maxSize = 5 * 1024 * 1024;
    if ($file['size'] > $maxSize) {
        sendError('Размер файла не должен превышать 5 МБ', 400);
    }
    
    if ($file['size'] === 0) {
        sendError('Файл пустой', 400);
    }
    
    // Валидация типа файла
    $allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/svg+xml'];
    
    // Проверяем MIME тип через finfo
    if (!function_exists('finfo_open')) {
        sendError('Расширение fileinfo не установлено', 500);
    }
    
    $finfo = finfo_open(FILEINFO_MIME_TYPE);
    if (!$finfo) {
        sendError('Не удалось инициализировать fileinfo', 500);
    }
    
    $mimeType = finfo_file($finfo, $file['tmp_name']);
    finfo_close($finfo);
    
    if (!$mimeType || !in_array($mimeType, $allowedTypes, true)) {
        sendError('Разрешены только изображения (JPG, PNG, WebP, SVG). Получен тип: ' . ($mimeType ?: 'неизвестно'), 400);
    }
    
    // Создаем директорию для загрузок
    $uploadDir = __DIR__ . '/../../uploads/site/';
    if (!is_dir($uploadDir)) {
        if (!mkdir($uploadDir, 0755, true)) {
            sendError('Ошибка создания директории для загрузок: ' . $uploadDir, 500);
        }
    }
    
    // Проверяем права на запись
    if (!is_writable($uploadDir)) {
        sendError('Директория для загрузок недоступна для записи: ' . $uploadDir, 500);
    }
    
    // Получаем старое значение для удаления файла
    try {
        $oldStmt = $pdo->prepare('SELECT setting_value FROM site_settings WHERE setting_key = :key');
        $oldStmt->execute([':key' => $settingKey]);
        $oldSetting = $oldStmt->fetch(PDO::FETCH_ASSOC);
        
        // Удаляем старое фото, если есть
        if ($oldSetting && !empty($oldSetting['setting_value'])) {
            $oldPath = __DIR__ . '/../..' . $oldSetting['setting_value'];
            if (file_exists($oldPath) && is_file($oldPath)) {
                @unlink($oldPath);
            }
        }
    } catch (PDOException $e) {
        error_log('Error getting old setting: ' . $e->getMessage());
        // Продолжаем выполнение, даже если не удалось получить старое значение
    }
    
    // Генерируем безопасное имя файла
    $extension = pathinfo($file['name'], PATHINFO_EXTENSION);
    $safeExtension = in_array(strtolower($extension), ['jpg', 'jpeg', 'png', 'webp', 'svg'], true)
        ? strtolower($extension)
        : 'jpg';
    
    $fileName = $settingKey . '_' . time() . '_' . uniqid() . '.' . $safeExtension;
    $filePath = $uploadDir . $fileName;
    
    // Перемещаем файл
    if (!move_uploaded_file($file['tmp_name'], $filePath)) {
        $lastError = error_get_last();
        $errorMsg = 'Ошибка при сохранении файла';
        $details = [
            'tmp_name' => $file['tmp_name'],
            'target_path' => $filePath,
            'file_exists' => file_exists($file['tmp_name']),
            'target_dir_writable' => is_writable($uploadDir),
        ];
        if ($lastError) {
            $errorMsg .= ': ' . $lastError['message'];
            $details['php_error'] = $lastError;
        }
        error_log('move_uploaded_file failed: ' . print_r($details, true));
        sendError($errorMsg, 500, $details);
    }
    
    // Проверяем, что файл действительно сохранен
    if (!file_exists($filePath) || !is_file($filePath)) {
        sendError('Файл не был сохранен', 500);
    }
    
    // Сохраняем относительный путь
    $settingValue = '/uploads/site/' . $fileName;
} elseif (!in_array($settingKey, ['logo_theme_switch', 'contact_github', 'contact_telegram', 'contact_vk', 'contact_linkedin', 'contact_email', 'contact_phone', 'contact_socials', 'about_text_ru', 'about_text_en'], true)) {
    // Если это не удаление, не файл, не logo_theme_switch и не контакт - ошибка
    sendError('Не указан файл для загрузки', 400);
}

try {
    // Проверяем, что $pdo доступен
    if (!isset($pdo)) {
        sendError('Ошибка подключения к базе данных', 500);
    }
    
    // Обновляем или создаем настройку
    // Используем разные имена параметров для VALUES и UPDATE
    $stmt = $pdo->prepare("
        INSERT INTO site_settings (setting_key, setting_value)
        VALUES (:key, :value)
        ON DUPLICATE KEY UPDATE setting_value = :value_update
    ");
    
    if (!$stmt) {
        $errorInfo = $pdo->errorInfo();
        sendError('Ошибка подготовки запроса к БД', 500, $errorInfo);
    }
    
    $result = $stmt->execute([
        ':key' => $settingKey,
        ':value' => $settingValue,
        ':value_update' => $settingValue,
    ]);
    
    if (!$result) {
        $errorInfo = $stmt->errorInfo();
        error_log('Database execute error: ' . print_r($errorInfo, true));
        sendError('Ошибка при выполнении запроса к БД', 500, $errorInfo);
    }
    
    http_response_code(200);
    $message = 'Настройка сохранена';
    if (in_array($settingKey, ['hero_photo', 'about_photo', 'logo', 'logo_light', 'logo_dark'], true)) {
        $message = $settingValue ? 'Фото сохранено' : 'Фото удалено';
    } elseif (in_array($settingKey, ['contact_github', 'contact_telegram', 'contact_vk', 'contact_linkedin', 'contact_email', 'contact_phone'], true)) {
        $message = $settingValue ? 'Контакт сохранен' : 'Контакт удален';
    }
    echo json_encode([
        'success' => true,
        'message' => $message,
        'value' => $settingValue,
    ]);
} catch (PDOException $e) {
    error_log('Database error in admin/save-site-setting.php: ' . $e->getMessage());
    error_log('Stack trace: ' . $e->getTraceAsString());
    sendError('Ошибка при сохранении настройки: ' . $e->getMessage(), 500);
} catch (Exception $e) {
    error_log('General error in admin/save-site-setting.php: ' . $e->getMessage());
    error_log('Stack trace: ' . $e->getTraceAsString());
    sendError('Неожиданная ошибка: ' . $e->getMessage(), 500);
}

