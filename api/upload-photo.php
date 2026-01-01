<?php
/**
 * API для загрузки фотографии отзыва
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

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendError('Method not allowed', 405);
}

// Проверка наличия файла
if (!isset($_FILES['photo']) || $_FILES['photo']['error'] !== UPLOAD_ERR_OK) {
    sendError('Файл не был загружен', 400);
}

$file = $_FILES['photo'];

// Валидация размера (5 МБ)
$maxSize = 5 * 1024 * 1024; // 5 МБ
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

// Создаем директорию для загрузок, если её нет
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

// Возвращаем путь к файлу (относительно корня сайта)
$relativePath = '/uploads/testimonials/' . $fileName;

http_response_code(200);
echo json_encode([
    'success' => true,
    'path' => $relativePath,
    'filename' => $fileName,
]);

