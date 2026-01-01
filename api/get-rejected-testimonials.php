<?php
/**
 * API для получения отклоненных отзывов (архив, требует авторизации)
 */

session_start();
require_once __DIR__ . '/db.php';

// Проверка авторизации
if (!isset($_SESSION['admin_logged_in']) || !$_SESSION['admin_logged_in']) {
    http_response_code(401);
    echo json_encode(['success' => false, 'error' => 'Unauthorized']);
    exit;
}

try {
    $stmt = $pdo->prepare("
        SELECT id, name, position, company, message, photo, created_at, 
               rejection_reason, moderated_at
        FROM testimonials
        WHERE status = 'rejected'
        ORDER BY moderated_at DESC
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

