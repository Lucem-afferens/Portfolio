<?php
/**
 * API для получения отклоненных отзывов (архив, требует авторизации)
 * Поддерживает поиск по имени и дате
 */

session_start();

// Устанавливаем заголовки JSON
header('Content-Type: application/json; charset=utf-8');

// Обработка ошибок
error_reporting(E_ALL);
ini_set('display_errors', 0);

try {
    require_once __DIR__ . '/config.php';
    require_once __DIR__ . '/db.php';
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Ошибка инициализации: ' . $e->getMessage(),
    ]);
    exit;
}

// Проверка авторизации
if (!isset($_SESSION['admin_logged_in']) || !$_SESSION['admin_logged_in']) {
    http_response_code(401);
    echo json_encode(['success' => false, 'error' => 'Unauthorized']);
    exit;
}

try {
    // Получаем параметры поиска
    $searchName = isset($_GET['name']) ? trim($_GET['name']) : '';
    $searchDate = isset($_GET['date']) ? trim($_GET['date']) : '';
    
    // Формируем SQL запрос
    $sql = "
        SELECT id, name, position, company, message, photo, created_at, 
               rejection_reason, moderated_at
        FROM testimonials
        WHERE status = 'rejected'
    ";
    
    $params = [];
    
    // Добавляем условия поиска
    if (!empty($searchName)) {
        $sql .= " AND (name LIKE :name OR position LIKE :name OR company LIKE :name)";
        $params[':name'] = "%{$searchName}%";
    }
    
    if (!empty($searchDate)) {
        // Поддерживаем формат YYYY-MM-DD
        $sql .= " AND DATE(created_at) = :date";
        $params[':date'] = $searchDate;
    }
    
    $sql .= " ORDER BY moderated_at DESC";
    
    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    $testimonials = $stmt->fetchAll();
    
    http_response_code(200);
    echo json_encode([
        'success' => true,
        'testimonials' => $testimonials,
        'search' => [
            'name' => $searchName,
            'date' => $searchDate,
        ],
    ]);
} catch (PDOException $e) {
    error_log('Database error in get-rejected-testimonials.php: ' . $e->getMessage());
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Ошибка при получении отзывов',
    ]);
} catch (Exception $e) {
    error_log('Error in get-rejected-testimonials.php: ' . $e->getMessage());
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Произошла ошибка при обработке запроса',
    ]);
}

