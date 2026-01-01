<?php
/**
 * API для отправки отзыва
 */

require_once __DIR__ . '/db.php';
require_once __DIR__ . '/utils.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Method not allowed']);
    exit;
}

// Получение данных
$data = json_decode(file_get_contents('php://input'), true);

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
    sendTelegramNotification($telegramMessage);
    sendEmailNotification($emailSubject, $emailMessage);
    
    http_response_code(200);
    echo json_encode([
        'success' => true,
        'message' => 'Отзыв отправлен на модерацию',
        'id' => $testimonialId,
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Ошибка при сохранении отзыва',
    ]);
}

