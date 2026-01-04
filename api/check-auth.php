<?php
/**
 * API для проверки авторизации админа
 */

session_start();

header('Content-Type: application/json; charset=utf-8');

// Проверяем, авторизован ли пользователь
if (isset($_SESSION['admin_logged_in']) && $_SESSION['admin_logged_in']) {
    http_response_code(200);
    echo json_encode([
        'success' => true,
        'authenticated' => true,
        'username' => $_SESSION['admin_username'] ?? null,
    ]);
} else {
    http_response_code(200);
    echo json_encode([
        'success' => true,
        'authenticated' => false,
    ]);
}

