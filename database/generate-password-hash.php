<?php
/**
 * Скрипт для генерации хеша пароля администратора
 * 
 * Использование:
 * 1. Запустите этот файл через браузер или командную строку
 * 2. Введите желаемый пароль
 * 3. Скопируйте сгенерированный хеш
 * 4. Используйте его в SQL запросе для создания администратора
 */

// Если запускается через командную строку
if (php_sapi_name() === 'cli') {
    echo "Введите пароль для администратора: ";
    $password = trim(fgets(STDIN));
} else {
    // Если через браузер
    $password = $_GET['password'] ?? $_POST['password'] ?? null;
    
    if (!$password) {
        ?>
        <!DOCTYPE html>
        <html>
        <head>
            <title>Генератор хеша пароля</title>
            <meta charset="utf-8">
            <style>
                body {
                    font-family: Arial, sans-serif;
                    max-width: 600px;
                    margin: 50px auto;
                    padding: 20px;
                }
                input, button {
                    padding: 10px;
                    font-size: 16px;
                    margin: 10px 0;
                }
                input {
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
                    background: #f5f5f5;
                    border-radius: 4px;
                    word-break: break-all;
                }
            </style>
        </head>
        <body>
            <h1>Генератор хеша пароля администратора</h1>
            <form method="POST">
                <label>
                    Введите пароль:
                    <input type="password" name="password" required>
                </label>
                <button type="submit">Сгенерировать хеш</button>
            </form>
        </body>
        </html>
        <?php
        exit;
    }
}

if (empty($password)) {
    die("Ошибка: Пароль не может быть пустым\n");
}

// Генерируем хеш
$hash = password_hash($password, PASSWORD_DEFAULT);

echo "\n";
echo "========================================\n";
echo "Хеш пароля успешно сгенерирован!\n";
echo "========================================\n";
echo "\n";
echo "Ваш пароль: " . htmlspecialchars($password) . "\n";
echo "\n";
echo "Хеш для SQL запроса:\n";
echo $hash . "\n";
echo "\n";
echo "SQL запрос для создания администратора:\n";
echo "----------------------------------------\n";
echo "INSERT INTO admins (username, password_hash) \n";
echo "VALUES ('admin', '" . $hash . "');\n";
echo "\n";
echo "Или если админ уже существует:\n";
echo "----------------------------------------\n";
echo "UPDATE admins \n";
echo "SET password_hash = '" . $hash . "' \n";
echo "WHERE username = 'admin';\n";
echo "\n";

