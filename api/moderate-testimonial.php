<?php
/**
 * API для модерации отзывов (требует авторизации)
 */

session_start();
require_once __DIR__ . '/db.php';
require_once __DIR__ . '/utils.php';

// Проверка авторизации
if (!isset($_SESSION['admin_logged_in']) || !$_SESSION['admin_logged_in']) {
    http_response_code(401);
    echo json_encode(['success' => false, 'error' => 'Unauthorized']);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Method not allowed']);
    exit;
}

$data = json_decode(file_get_contents('php://input'), true);

if (empty($data['id']) || empty($data['action'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Missing required fields']);
    exit;
}

$id = (int)$data['id'];
$action = $data['action']; // 'approve' или 'reject'
$rejectionReason = $data['rejection_reason'] ?? null;

try {
    if ($action === 'approve') {
        $stmt = $pdo->prepare("
            UPDATE testimonials
            SET status = 'approved', moderated_at = NOW()
            WHERE id = :id
        ");
        $stmt->execute([':id' => $id]);
        
        // Уведомление об одобрении (опционально)
        $stmt = $pdo->prepare("SELECT name FROM testimonials WHERE id = :id");
        $stmt->execute([':id' => $id]);
        $testimonial = $stmt->fetch();
        
        sendTelegramNotification("✅ Отзыв от {$testimonial['name']} одобрен и опубликован");
        
    } elseif ($action === 'reject') {
        $stmt = $pdo->prepare("
            UPDATE testimonials
            SET status = 'rejected', 
                rejection_reason = :reason,
                moderated_at = NOW()
            WHERE id = :id
        ");
        $stmt->execute([
            ':id' => $id,
            ':reason' => $rejectionReason,
        ]);
        
        // Уведомление об отклонении
        $stmt = $pdo->prepare("SELECT name FROM testimonials WHERE id = :id");
        $stmt->execute([':id' => $id]);
        $testimonial = $stmt->fetch();
        
        sendTelegramNotification("❌ Отзыв от {$testimonial['name']} отклонен. Причина: " . ($rejectionReason ?? 'Не указана'));
    } else {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'Invalid action']);
        exit;
    }
    
    http_response_code(200);
    echo json_encode([
        'success' => true,
        'message' => $action === 'approve' ? 'Отзыв одобрен' : 'Отзыв отклонен',
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Ошибка при модерации отзыва',
    ]);
}


