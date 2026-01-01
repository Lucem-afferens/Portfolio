<?php
/**
 * API для получения одобренных отзывов
 */

require_once __DIR__ . '/db.php';

try {
    $stmt = $pdo->prepare("
        SELECT id, name, position, company, message, photo, created_at
        FROM testimonials
        WHERE status = 'approved'
        ORDER BY created_at DESC
    ");
    
    $stmt->execute();
    $testimonials = $stmt->fetchAll();
    
    http_response_code(200);
    echo json_encode([
        'success' => true,
        'testimonials' => $testimonials,
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Ошибка при получении отзывов',
    ]);
}

