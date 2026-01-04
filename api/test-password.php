<?php
/**
 * Тестовый скрипт для проверки пароля
 * Используйте этот скрипт для отладки проблем с авторизацией
 */

session_start();
require_once __DIR__ . '/db.php';

header('Content-Type: text/html; charset=utf-8');

// Получаем данные из GET или POST
$username = $_GET['username'] ?? $_POST['username'] ?? 'lelby';
$password = $_GET['password'] ?? $_POST['password'] ?? '';

?>
<!DOCTYPE html>
<html>
<head>
    <title>Тест пароля администратора</title>
    <meta charset="utf-8">
    <style>
        body {
            font-family: Arial, sans-serif;
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
        form {
            margin-bottom: 30px;
        }
        input, button {
            padding: 10px;
            font-size: 16px;
            margin: 10px 0;
            width: 100%;
            box-sizing: border-box;
        }
        button {
            background: #1fa6a0;
            color: white;
            border: none;
            cursor: pointer;
            border-radius: 4px;
        }
        button:hover {
            background: #1a8a85;
        }
        .result {
            margin-top: 20px;
            padding: 15px;
            background: #f9f9f9;
            border-radius: 4px;
            border-left: 4px solid #1fa6a0;
        }
        .error {
            background: #fee;
            border-left-color: #dc3545;
        }
        .success {
            background: #efe;
            border-left-color: #28a745;
        }
        pre {
            background: #f5f5f5;
            padding: 10px;
            border-radius: 4px;
            overflow-x: auto;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Тест пароля администратора</h1>
        
        <form method="POST">
            <label>
                Логин:
                <input type="text" name="username" value="<?php echo htmlspecialchars($username); ?>" required>
            </label>
            <label>
                Пароль:
                <input type="password" name="password" value="<?php echo htmlspecialchars($password); ?>" required>
            </label>
            <button type="submit">Проверить</button>
        </form>

        <?php
        if ($_SERVER['REQUEST_METHOD'] === 'POST' && !empty($password)) {
            try {
                // Получаем данные из БД
                $stmt = $pdo->prepare('SELECT id, username, password_hash FROM admins WHERE username = ? LIMIT 1');
                $stmt->execute([$username]);
                $admin = $stmt->fetch();

                echo '<div class="result">';
                echo '<h2>Результаты проверки:</h2>';

                if (!$admin) {
                    echo '<div class="error">';
                    echo '<strong>Ошибка:</strong> Пользователь с логином "' . htmlspecialchars($username) . '" не найден в базе данных.';
                    echo '</div>';
                } else {
                    echo '<h3>Данные из БД:</h3>';
                    echo '<pre>';
                    echo 'ID: ' . htmlspecialchars($admin['id']) . "\n";
                    echo 'Username: ' . htmlspecialchars($admin['username']) . "\n";
                    echo 'Password Hash: ' . htmlspecialchars($admin['password_hash']) . "\n";
                    echo 'Hash Length: ' . strlen($admin['password_hash']) . " символов\n";
                    echo 'Hash Format: ' . substr($admin['password_hash'], 0, 4) . "\n";
                    echo '</pre>';

                    // Проверяем формат хеша
                    $hashFormat = substr($admin['password_hash'], 0, 4);
                    if ($hashFormat !== '$2y$' && $hashFormat !== '$2a$' && $hashFormat !== '$2b$') {
                        echo '<div class="error">';
                        echo '<strong>Внимание:</strong> Неверный формат хеша. Ожидается $2y$, $2a$ или $2b$';
                        echo '</div>';
                    }

                    // Проверяем длину хеша
                    if (strlen($admin['password_hash']) < 60) {
                        echo '<div class="error">';
                        echo '<strong>Внимание:</strong> Хеш слишком короткий. Возможно, он обрезан в БД. Должно быть минимум 60 символов.';
                        echo '</div>';
                    }

                    // Проверяем пароль
                    $isValid = password_verify($password, $admin['password_hash']);

                    if ($isValid) {
                        echo '<div class="success">';
                        echo '<strong>✓ Успех!</strong> Пароль верный!';
                        echo '</div>';
                    } else {
                        echo '<div class="error">';
                        echo '<strong>✗ Ошибка:</strong> Пароль неверный.';
                        echo '</div>';
                        
                        // Показываем дополнительную информацию для отладки
                        echo '<h3>Отладочная информация:</h3>';
                        echo '<pre>';
                        echo 'Введенный пароль: ' . htmlspecialchars($password) . "\n";
                        echo 'Длина пароля: ' . strlen($password) . " символов\n";
                        echo 'Хеш из БД: ' . htmlspecialchars($admin['password_hash']) . "\n";
                        echo 'Длина хеша: ' . strlen($admin['password_hash']) . " символов\n";
                        
                        // Пробуем создать новый хеш для сравнения
                        $newHash = password_hash($password, PASSWORD_DEFAULT);
                        echo "\nНовый хеш для этого пароля: " . $newHash . "\n";
                        echo 'Проверка нового хеша: ' . (password_verify($password, $newHash) ? 'OK' : 'FAIL') . "\n";
                        echo '</pre>';
                    }
                }
                echo '</div>';
            } catch (PDOException $e) {
                echo '<div class="error">';
                echo '<strong>Ошибка БД:</strong> ' . htmlspecialchars($e->getMessage());
                echo '</div>';
            }
        }
        ?>
    </div>
</body>
</html>

