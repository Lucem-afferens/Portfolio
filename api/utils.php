<?php
/**
 * Утилиты для API
 */

/**
 * Отправка уведомления в Telegram
 * @param string $message Текст сообщения
 * @param string|null $photoPath Путь к фото (относительный, например /uploads/testimonials/file.jpg)
 */
function sendTelegramNotification($message, $photoPath = null) {
    // Проверяем, что константы определены
    if (!defined('TELEGRAM_BOT_TOKEN') || !defined('TELEGRAM_CHAT_ID')) {
        error_log('Telegram constants not defined');
        return false;
    }
    
    $token = TELEGRAM_BOT_TOKEN;
    $chatId = TELEGRAM_CHAT_ID;
    
    if (empty($token) || empty($chatId) || $token === 'YOUR_BOT_TOKEN' || $chatId === 'YOUR_CHAT_ID') {
        error_log('Telegram token or chat ID not configured');
        return false;
    }
    
    // Если есть фото, отправляем его вместе с текстом
    if (!empty($photoPath) && file_exists(__DIR__ . '/..' . $photoPath)) {
        // Формируем полный URL к фото
        $photoUrl = 'https://develonik.ru' . $photoPath;
        
        // Отправляем фото с подписью
        $url = "https://api.telegram.org/bot{$token}/sendPhoto";
        $data = [
            'chat_id' => $chatId,
            'photo' => $photoUrl,
            'caption' => $message,
            'parse_mode' => 'HTML',
        ];
        
        $ch = curl_init($url);
        curl_setopt($ch, CURLOPT_POST, 1);
        curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($data));
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_TIMEOUT, 10);
        
        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);
        
        // Если отправка фото не удалась, отправляем только текст
        if ($httpCode !== 200) {
            error_log('Failed to send photo to Telegram, sending text only');
            return sendTelegramNotification($message);
        }
        
        return $response !== false;
    } else {
        // Отправляем только текст
        $url = "https://api.telegram.org/bot{$token}/sendMessage";
        $data = [
            'chat_id' => $chatId,
            'text' => $message,
            'parse_mode' => 'HTML',
        ];
        
        $ch = curl_init($url);
        curl_setopt($ch, CURLOPT_POST, 1);
        curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($data));
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_TIMEOUT, 10);
        
        $response = curl_exec($ch);
        curl_close($ch);
        
        return $response !== false;
    }
}

/**
 * Отправка email уведомления
 */
function sendEmailNotification($subject, $message) {
    if (!defined('ADMIN_EMAIL')) {
        error_log('ADMIN_EMAIL constant not defined');
        return false;
    }
    
    $to = ADMIN_EMAIL;
    $headers = [
        'From: Portfolio <noreply@develonik.ru>',
        'Reply-To: ' . ADMIN_EMAIL,
        'X-Mailer: PHP/' . phpversion(),
        'Content-Type: text/html; charset=UTF-8',
    ];
    
    return mail($to, $subject, $message, implode("\r\n", $headers));
}

/**
 * Получение IP адреса пользователя
 */
function getClientIp() {
    $ipKeys = ['HTTP_CLIENT_IP', 'HTTP_X_FORWARDED_FOR', 'REMOTE_ADDR'];
    
    foreach ($ipKeys as $key) {
        if (array_key_exists($key, $_SERVER) === true) {
            foreach (explode(',', $_SERVER[$key]) as $ip) {
                $ip = trim($ip);
                if (filter_var($ip, FILTER_VALIDATE_IP, FILTER_FLAG_NO_PRIV_RANGE | FILTER_FLAG_NO_RES_RANGE) !== false) {
                    return $ip;
                }
            }
        }
    }
    
    return $_SERVER['REMOTE_ADDR'] ?? '0.0.0.0';
}

/**
 * Валидация данных отзыва
 */
function validateTestimonial($data) {
    $errors = [];
    
    if (empty($data['name']) || strlen(trim($data['name'])) < 2) {
        $errors[] = 'Имя должно содержать минимум 2 символа';
    }
    
    if (empty($data['message']) || strlen(trim($data['message'])) < 10) {
        $errors[] = 'Сообщение должно содержать минимум 10 символов';
    }
    
    if (strlen($data['message']) > 2000) {
        $errors[] = 'Сообщение слишком длинное (максимум 2000 символов)';
    }
    
    if (!empty($data['email']) && !filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
        $errors[] = 'Некорректный email адрес';
    }
    
    return $errors;
}

