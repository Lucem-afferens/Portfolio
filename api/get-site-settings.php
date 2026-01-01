<?php
/**
 * API для получения настроек сайта (фото)
 */

require_once __DIR__ . '/db.php';

try {
    $stmt = $pdo->prepare("
        SELECT setting_key, setting_value
        FROM site_settings
        WHERE setting_key IN ('hero_photo', 'about_photo')
    ");
    
    $stmt->execute();
    $settings = $stmt->fetchAll(PDO::FETCH_KEY_PAIR);
    
    http_response_code(200);
    echo json_encode([
        'success' => true,
        'settings' => [
            'hero_photo' => $settings['hero_photo'] ?? null,
            'about_photo' => $settings['about_photo'] ?? null,
        ],
    ]);
} catch (PDOException $e) {
    error_log('Database error in get-site-settings.php: ' . $e->getMessage());
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Ошибка при получении настроек',
    ]);
}

