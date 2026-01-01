<?php
/**
 * API для выхода из админ-панели
 */

session_start();

$_SESSION = [];
session_destroy();

http_response_code(200);
echo json_encode([
    'success' => true,
    'message' => 'Выход выполнен',
]);


