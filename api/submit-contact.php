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

// Проверка согласия на обработку персональных данных
if (empty($data['consent']) || $data['consent'] !== 'on') {
    $errors[] = 'Необходимо дать согласие на обработку персональных данных';
}

// Сообщение необязательно, но если указано - проверяем длину
$message = isset($data['message']) ? trim($data['message']) : '';
if (!empty($message) && strlen($message) > 2000) {
    $errors[] = 'Сообщение слишком длинное (максимум 2000 символов)';
}

// Telegram username необязателен, но если указан - проверяем формат
$telegram = isset($data['telegram']) ? trim($data['telegram']) : '';
if (!empty($telegram)) {
    // Убираем @ если есть
    $telegram = ltrim($telegram, '@');
    // Проверяем формат (только буквы, цифры, подчеркивания, минимум 5 символов)
    if (!preg_match('/^[a-zA-Z0-9_]{5,32}$/', $telegram)) {
        $errors[] = 'Некорректный формат Telegram username';
    }
}

if (!empty($errors)) {
    sendError('Ошибки валидации', 400, ['errors' => $errors]);
}

// Очистка данных
$name = trim($data['name']);
$email = trim($data['email']);

// Формирование уведомлений
$telegramMessage = "📧 <b>Новое сообщение с сайта</b>\n\n";
$telegramMessage .= "👤 <b>Имя:</b> " . htmlspecialchars($name) . "\n";
$telegramMessage .= "✉️ <b>Email:</b> " . htmlspecialchars($email) . "\n";

if (!empty($telegram)) {
    $telegramMessage .= "💬 <b>Telegram:</b> @" . htmlspecialchars($telegram) . "\n";
}

if (!empty($message)) {
    $telegramMessage .= "\n💬 <b>Сообщение:</b>\n" . htmlspecialchars(substr($message, 0, 1000));
    if (strlen($message) > 1000) {
        $telegramMessage .= "\n\n<i>(Сообщение обрезано, полный текст в email)</i>";
    }
} else {
    $telegramMessage .= "\n💬 <b>Сообщение:</b> <i>не указано</i>";
}

$emailSubject = "Новое сообщение с сайта - {$name}";
$emailMessage = "
<h2>Новое сообщение с сайта портфолио</h2>
<p><strong>Имя:</strong> " . htmlspecialchars($name) . "</p>
<p><strong>Email:</strong> <a href='mailto:" . htmlspecialchars($email) . "'>" . htmlspecialchars($email) . "</a></p>
";

if (!empty($telegram)) {
    $emailMessage .= "<p><strong>Telegram:</strong> <a href='https://t.me/" . htmlspecialchars($telegram) . "'>@" . htmlspecialchars($telegram) . "</a></p>";
}

if (!empty($message)) {
    $emailMessage .= "<p><strong>Сообщение:</strong></p><p>" . nl2br(htmlspecialchars($message)) . "</p>";
} else {
    $emailMessage .= "<p><strong>Сообщение:</strong> <em>не указано</em></p>";
}

$emailMessage .= "<hr><p><small>Дата: " . date('d.m.Y H:i:s') . "</small></p>";

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
