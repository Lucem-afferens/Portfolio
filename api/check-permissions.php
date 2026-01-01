<?php
/**
 * Скрипт для проверки прав доступа к директориям загрузок
 * Откройте: https://develonik.ru/api/check-permissions.php
 */

header('Content-Type: text/html; charset=utf-8');

$baseDir = __DIR__ . '/../uploads';
$directories = [
    'projects' => $baseDir . '/projects',
    'site' => $baseDir . '/site',
    'testimonials' => $baseDir . '/testimonials',
];

?>
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Проверка прав доступа</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            max-width: 800px;
            margin: 50px auto;
            padding: 20px;
            background: #f5f5f5;
        }
        .container {
            background: white;
            padding: 30px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        h1 {
            color: #333;
            margin-top: 0;
        }
        .status {
            padding: 15px;
            margin: 10px 0;
            border-radius: 5px;
            border-left: 4px solid;
        }
        .success {
            background: #d4edda;
            border-color: #28a745;
            color: #155724;
        }
        .error {
            background: #f8d7da;
            border-color: #dc3545;
            color: #721c24;
        }
        .warning {
            background: #fff3cd;
            border-color: #ffc107;
            color: #856404;
        }
        .info {
            background: #d1ecf1;
            border-color: #17a2b8;
            color: #0c5460;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
        }
        th, td {
            padding: 12px;
            text-align: left;
            border-bottom: 1px solid #ddd;
        }
        th {
            background: #f8f9fa;
            font-weight: 600;
        }
        code {
            background: #f4f4f4;
            padding: 2px 6px;
            border-radius: 3px;
            font-family: 'Courier New', monospace;
        }
        .permissions {
            font-family: monospace;
            font-weight: bold;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🔍 Проверка прав доступа к директориям загрузок</h1>
        
        <?php
        $allOk = true;
        $results = [];
        
        // Проверяем базовую директорию uploads
        if (!is_dir($baseDir)) {
            echo '<div class="status error">';
            echo '<strong>❌ Ошибка:</strong> Базовая директория <code>' . htmlspecialchars($baseDir) . '</code> не существует!';
            echo '</div>';
            $allOk = false;
        } else {
            echo '<div class="status success">';
            echo '<strong>✅ Базовая директория существует:</strong> <code>' . htmlspecialchars($baseDir) . '</code>';
            echo '</div>';
        }
        
        // Проверяем каждую директорию
        foreach ($directories as $name => $path) {
            $result = [
                'name' => $name,
                'path' => $path,
                'exists' => false,
                'readable' => false,
                'writable' => false,
                'permissions' => null,
                'owner' => null,
                'group' => null,
            ];
            
            if (is_dir($path)) {
                $result['exists'] = true;
                $result['readable'] = is_readable($path);
                $result['writable'] = is_writable($path);
                
                // Получаем права доступа
                $perms = fileperms($path);
                $result['permissions'] = substr(sprintf('%o', $perms), -4);
                
                // Получаем владельца (если доступно)
                if (function_exists('posix_getpwuid') && function_exists('posix_getgrgid')) {
                    $stat = stat($path);
                    $owner = posix_getpwuid($stat['uid']);
                    $group = posix_getgrgid($stat['gid']);
                    $result['owner'] = $owner['name'] ?? 'unknown';
                    $result['group'] = $group['name'] ?? 'unknown';
                }
                
                if (!$result['readable'] || !$result['writable']) {
                    $allOk = false;
                }
            } else {
                $allOk = false;
            }
            
            $results[] = $result;
        }
        
        // Выводим результаты в таблице
        echo '<h2>Результаты проверки:</h2>';
        echo '<table>';
        echo '<thead>';
        echo '<tr>';
        echo '<th>Директория</th>';
        echo '<th>Путь</th>';
        echo '<th>Существует</th>';
        echo '<th>Чтение</th>';
        echo '<th>Запись</th>';
        echo '<th>Права</th>';
        if (!empty($results[0]['owner'])) {
            echo '<th>Владелец</th>';
            echo '<th>Группа</th>';
        }
        echo '</tr>';
        echo '</thead>';
        echo '<tbody>';
        
        foreach ($results as $result) {
            echo '<tr>';
            echo '<td><strong>' . htmlspecialchars($result['name']) . '</strong></td>';
            echo '<td><code>' . htmlspecialchars($result['path']) . '</code></td>';
            echo '<td>' . ($result['exists'] ? '✅ Да' : '❌ Нет') . '</td>';
            echo '<td>' . ($result['readable'] ? '✅ Да' : '❌ Нет') . '</td>';
            echo '<td>' . ($result['writable'] ? '✅ Да' : '❌ Нет') . '</td>';
            echo '<td><span class="permissions">' . htmlspecialchars($result['permissions'] ?? 'N/A') . '</span></td>';
            if (!empty($result['owner'])) {
                echo '<td>' . htmlspecialchars($result['owner']) . '</td>';
                echo '<td>' . htmlspecialchars($result['group']) . '</td>';
            }
            echo '</tr>';
        }
        
        echo '</tbody>';
        echo '</table>';
        
        // Общий статус
        if ($allOk) {
            echo '<div class="status success">';
            echo '<strong>✅ Все проверки пройдены успешно!</strong><br>';
            echo 'Все директории существуют и имеют необходимые права доступа (чтение и запись).';
            echo '</div>';
        } else {
            echo '<div class="status error">';
            echo '<strong>❌ Обнаружены проблемы с правами доступа!</strong><br>';
            echo 'Некоторые директории отсутствуют или не имеют необходимых прав.';
            echo '</div>';
            
            echo '<div class="status warning">';
            echo '<strong>⚠️ Как исправить:</strong><br>';
            echo '1. Подключитесь к серверу по SSH (если есть доступ)<br>';
            echo '2. Выполните команды:<br>';
            echo '<code style="display:block;margin:10px 0;padding:10px;background:#f4f4f4;">';
            echo 'cd ' . dirname($baseDir) . '<br>';
            echo 'mkdir -p uploads/projects uploads/site uploads/testimonials<br>';
            echo 'chmod 755 uploads<br>';
            echo 'chmod 755 uploads/projects uploads/site uploads/testimonials<br>';
            echo '</code>';
            echo '3. Или используйте панель управления хостингом (File Manager) для создания директорий и установки прав<br>';
            echo '4. Необходимые права: <code>755</code> (rwxr-xr-x) для директорий';
            echo '</div>';
        }
        
        // Дополнительная информация
        echo '<div class="status info">';
        echo '<strong>ℹ️ Дополнительная информация:</strong><br>';
        echo '<strong>Текущий пользователь PHP:</strong> ' . (function_exists('get_current_user') ? get_current_user() : 'unknown') . '<br>';
        echo '<strong>UID:</strong> ' . (function_exists('posix_geteuid') ? posix_geteuid() : 'unknown') . '<br>';
        echo '<strong>GID:</strong> ' . (function_exists('posix_getegid') ? posix_getegid() : 'unknown') . '<br>';
        echo '<strong>Корневая директория:</strong> <code>' . htmlspecialchars(__DIR__ . '/..') . '</code><br>';
        echo '</div>';
        
        // Тест записи
        echo '<h2>Тест записи файлов:</h2>';
        foreach ($directories as $name => $path) {
            if (is_dir($path) && is_writable($path)) {
                $testFile = $path . '/.test_write_' . time() . '.txt';
                if (@file_put_contents($testFile, 'test')) {
                    @unlink($testFile);
                    echo '<div class="status success">';
                    echo '✅ <strong>' . htmlspecialchars($name) . ':</strong> Запись файлов работает';
                    echo '</div>';
                } else {
                    echo '<div class="status error">';
                    echo '❌ <strong>' . htmlspecialchars($name) . ':</strong> Не удалось записать тестовый файл';
                    echo '</div>';
                }
            } else {
                echo '<div class="status error">';
                echo '❌ <strong>' . htmlspecialchars($name) . ':</strong> Директория недоступна для записи';
                echo '</div>';
            }
        }
        ?>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; color: #666; font-size: 0.9em;">
            <p><strong>Примечание:</strong> После исправления прав доступа обновите эту страницу для повторной проверки.</p>
            <p><strong>Безопасность:</strong> Рекомендуется удалить этот файл после проверки или ограничить к нему доступ.</p>
        </div>
    </div>
</body>
</html>

