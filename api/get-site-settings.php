<?php
/**
 * API для получения настроек сайта (фото)
 */

require_once __DIR__ . '/db.php';

try {
    $stmt = $pdo->prepare("
        SELECT setting_key, setting_value
        FROM site_settings
        WHERE setting_key IN (
            'hero_photo', 'hero_photo_mobile', 'hero_photo_tablet', 'about_photo', 'about_photo_mobile', 'logo', 'logo_light', 'logo_dark', 'logo_theme_switch',
            'contact_github', 'contact_telegram', 'contact_vk', 'contact_linkedin', 'contact_email', 'contact_phone',
            'contact_socials', 'about_text_ru', 'about_text_en'
        )
    ");
    
    $stmt->execute();
    $settings = $stmt->fetchAll(PDO::FETCH_KEY_PAIR);
    
    http_response_code(200);
    echo json_encode([
        'success' => true,
        'settings' => [
            'hero_photo' => $settings['hero_photo'] ?? null,
            'hero_photo_mobile' => $settings['hero_photo_mobile'] ?? null,
            'hero_photo_tablet' => $settings['hero_photo_tablet'] ?? null,
            'about_photo' => $settings['about_photo'] ?? null,
            'about_photo_mobile' => $settings['about_photo_mobile'] ?? null,
            'logo' => $settings['logo'] ?? null,
            'logo_light' => $settings['logo_light'] ?? null,
            'logo_dark' => $settings['logo_dark'] ?? null,
            'logo_theme_switch' => isset($settings['logo_theme_switch']) ? ($settings['logo_theme_switch'] === '1' || $settings['logo_theme_switch'] === 'true') : false,
            'contact_github' => $settings['contact_github'] ?? null,
            'contact_telegram' => $settings['contact_telegram'] ?? null,
            'contact_vk' => $settings['contact_vk'] ?? null,
            'contact_linkedin' => $settings['contact_linkedin'] ?? null,
            'contact_email' => $settings['contact_email'] ?? null,
            'contact_phone' => $settings['contact_phone'] ?? null,
            'contact_socials' => $settings['contact_socials'] ?? null,
            'about_text_ru' => $settings['about_text_ru'] ?? null,
            'about_text_en' => $settings['about_text_en'] ?? null,
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

