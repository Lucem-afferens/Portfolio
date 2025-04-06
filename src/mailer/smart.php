<?php 

// $name = htmlspecialchars($_POST['name']);
// $email = filter_var($_POST['email'], FILTER_VALIDATE_EMAIL);
// $message = Htmlspecialchars($_POST['message']);

// require_once('phpmailer/PHPMailerAutoload.php');
// $mail = new PHPMailer;
// $mail->CharSet = 'utf-8';

// // $mail->SMTPDebug = 3;                               // Enable verbose debug output

// $mail->isSMTP();                                      // Set mailer to use SMTP
// $mail->Host = 'smtp.gmail.com';  // Specify main and backup SMTP servers
// $mail->SMTPAuth = true;                               // Enable SMTP authentication
// $mail->Username = 'nikolaj.dudin.90@gmail.com';                 // Наш логин
// $mail->Password = 'ypgbqtbrupsmqmqp';                           // Наш пароль от ящика
// $mail->SMTPSecure = 'ssl';                            // Enable TLS encryption, `ssl` also accepted
// $mail->Port = 465;                                    // TCP port to connect to
 
// $mail->setFrom('nikolaj.dudin.90@gmail.com', 'Portfolio');   // От кого письмо 
// $mail->addAddress('9q4ij@ptct.net');     // Add a recipient
// //$mail->addAddress('ellen@example.com');               // Name is optional
// //$mail->addReplyTo('info@example.com', 'Information');
// //$mail->addCC('cc@example.com');
// //$mail->addBCC('bcc@example.com');
// //$mail->addAttachment('/var/tmp/file.tar.gz');         // Add attachments
// //$mail->addAttachment('/tmp/image.jpg', 'new.jpg');    // Optional name
// $mail->isHTML(true);                                  // Set email format to HTML

// $mail->Subject = 'Заявка по портфолио';
// $mail->Body    = '
// 		Пользователь оставил данные <br> 
// 	Имя: ' . $name . ' <br>
// 	E-mail: ' . $email . '<br>
// 	Сообщение: ' . $message . '';

// if(!$mail->send()) {
//     return false;
// } else {
//     return true;
// }


$to = "nikolaj.dudin.90@gmail.com";
$from = trim($_POST['email']);
$name = ($_POST['name']);

$message = htmlspecialchars($_POST['message']);
$message = urldecode($message);
$message = trim($message);

$headers = "From: $from" . "/r/n" . 
"Reply-To: $from" . "/r/n" . 
"X-Mailer: PHP?/" . phpversion();

if(mail($to, $name, $form, $message, $headers)) {
	echo 'Письмо отправлено'
} else {
	echo 'Письмо не отправлено'
}

?>