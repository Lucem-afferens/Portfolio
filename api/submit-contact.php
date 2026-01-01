<?php
/**
 * Обработка формы контактов
 * Отправляет уведомления в Telegram и на email
 */

header('Content-Type: application/json; charset=utf-8');

// Обработка ошибок
error_reporting(E_ALL);
ini_set('display_errors', 0);

/**
 * Отправка ошибки
 */
function sendError($message, $code = 400, $details = []) {
    http_response_code($code);
    echo json_encode([
        'success' => false,
        'error' => $message,
        'details' => $details,
    ]);
    exit;
}

try {
    // Загружаем config.php первым (определяет константы)
    require_once __DIR__ . '/config.php';
    // Затем utils.php (использует константы из config)
    require_once __DIR__ . '/utils.php';
} catch (Exception $e) {
    sendError('Ошибка инициализации: ' . $e->getMessage(), 500);
}

// Проверка метода запроса
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendError('Метод не разрешен', 405);
}

// Получение данных
$rawInput = file_get_contents('php://input');
$data = json_decode($rawInput, true);

if (json_last_error() !== JSON_ERROR_NONE) {
    sendError('Некорректный JSON: ' . json_last_error_msg(), 400);
}

// Валидация данных
$errors = [];

if (empty($data['name']) || strlen(trim($data['name'])) < 2) {
    $errors[] = 'Имя должно содержать минимум 2 символа';
}

if (empty($data['email']) || !filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
    $errors[] = 'Некорректный email адрес';
}

if (empty($data['message']) || strlen(trim($data['message'])) < 10) {
    $errors[] = 'Сообщение должно содержать минимум 10 символов';
}

if (strlen($data['message']) > 2000) {
    $errors[] = 'Сообщение слишком длинное (максимум 2000 символов)';
}

if (!empty($errors)) {
    sendError('Ошибки валидации', 400, ['errors' => $errors]);
}

// Очистка данных
$name = trim($data['name']);
$email = trim($data['email']);
$message = trim($data['message']);

// Формирование уведомлений
$telegramMessage = "📧 <b>Новое сообщение с сайта</b>\n\n";
$telegramMessage .= "👤 <b>Имя:</b> " . htmlspecialchars($name) . "\n";
$telegramMessage .= "✉️ <b>Email:</b> " . htmlspecialchars($email) . "\n";
$telegramMessage .= "💬 <b>Сообщение:</b>\n" . htmlspecialchars(substr($message, 0, 1000));
if (strlen($message) > 1000) {
    $telegramMessage .= "\n\n<i>(Сообщение обрезано, полный текст в email)</i>";
}

$emailSubject = "Новое сообщение с сайта - {$name}";
$emailMessage = "
<h2>Новое сообщение с сайта портфолио</h2>
<p><strong>Имя:</strong> " . htmlspecialchars($name) . "</p>
<p><strong>Email:</strong> <a href='mailto:" . htmlspecialchars($email) . "'>" . htmlspecialchars($email) . "</a></p>
<p><strong>Сообщение:</strong></p>
<p>" . nl2br(htmlspecialchars($message)) . "</p>
<hr>
<p><small>Дата: " . date('d.m.Y H:i:s') . "</small></p>
";

// Отправка уведомлений
$telegramSent = sendTelegramNotification($telegramMessage);
$emailSent = sendEmailNotification($emailSubject, $emailMessage);

// Логирование результата
if (!$telegramSent) {
    error_log('Failed to send Telegram notification for contact form');
}
if (!$emailSent) {
    error_log('Failed to send email notification for contact form');
}

// Возвращаем успешный ответ
http_response_code(200);
echo json_encode([
    'success' => true,
    'message' => 'Сообщение отправлено',
    'notifications' => [
        'telegram' => $telegramSent,
        'email' => $emailSent,
    ],
]);
