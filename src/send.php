<?php
<!-- В файле на первом этапе нужно принять данные из пост массива. Для этого создаем две переменные: -->
$name = $_POST['name'];
$email = $_POST['email'];
$message = $_POST['message'];

<!-- Первая функция преобразует все символы, которые пользователь попытается добавить в форму: -->
$name = htmlspecialchars($name);
$email = htmlspecialchars($email);
$message = htmlspecialchars($message);

<!-- Вторая функция декодирует url, если пользователь попытается его добавить в форму. -->
$name = urldecode($name);
$email = urldecode($email);
$message = urldecode($message);

<!-- Третей функцией мы удалим пробелы с начала и конца строки, если таковые имеются: -->
$name = trim($name);
$email = trim($email);
$message = trim($message);

// echo $name;
// echo "<br>";
// echo $email;


// Для отправки данных на почту нужно воспользоваться функцией mail в PHP.
// mail("на какой адрес отправить", "тема письма", "Сообщение (тело письма)","From: с какого email отправляется письмо \r\n");
// Необходимо добавить условие, которе проверит отправилась ли форма при помощи PHP на указанные адрес электронной почты.

if (mail("nikolaj.dudin.90@gmail.com", "Заявка с сайта", "ФИО:".$name.". E-mail: ".$email ,"From: nikolaj.dudin.90@bk.ru \r\n"))
 {     echo "сообщение успешно отправлено";
} else {
    echo "при отправке сообщения возникли ошибки";
}

?>

