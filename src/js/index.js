const humburger = document.querySelector('.humburger'),
      menu = document.querySelector('.menu'),
      closeElem = document.querySelector('.menu__close');
      

humburger.addEventListener('click', () => {
    menu.classList.add('active');
});

closeElem.addEventListener('click', () => {
    menu.classList.remove('active');
});

const humburgerLink = document.querySelectorAll('.menu__link');

humburgerLink.forEach(el => {
  el.addEventListener('click', function (e) {
    menu.classList.remove('active');
});
});

// humburgerLink.addEventListener('click', () => {
//     menu.classList.remove('active');
// });


const counters = document.querySelectorAll('.skills__scale__header-percent');
const lines = document.querySelectorAll('.skills__scale__body-front');

counters.forEach( (item, i) => {
    lines[i].style.width = item.innerHTML;
});


//pageup
// Отслеживаем событие прокрутки страницы
window.addEventListener('scroll', () => {
    const element = document.getElementById('pageUp'); // Ваш элемент
    const scrollPosition = window.pageYOffset; // Текущее положение скролла
  
    if (scrollPosition > 1000) { // Условие: более 1000 пикселей
      element.classList.add('visible'); // Показываем элемент
      element.classList.remove('hidden'); // Скрываем элемент

    } else {
      element.classList.add('hidden'); // Скрываем элемент
      element.classList.remove('visible'); // Скрываем элемент
    }
  });

//   const form = document.querySelector('form');
//   form.submit(function(e){
//     e.preventDefault();  // отключение дефолтной установке по перезагрузке страницы браузера при отправке формы на сервер и обработке запроса

//     if (!$(this).valid()) {
//         return;
//     }

//     $.ajax({    // ajax как раз позволяет обрабатывать запрос без перезагрузки. Доступен в jQuery
//         type: "POST",
//         url: "mailer/smart.php",
//         data: $(this).serialize()
//     }).done(function() {
//         $(this).find("input").val("");
//         // $('#consultation, #order').fadeOut();
//         // $('.modal, #thanks').fadeIn(600);
//         $('form').trigger('reset');
//     });
//     return false;
// });



// // NPM пакеты в верстке. Пример подключения календаря datepicker. сначала команда в терминале npm i air-datepicker -s   .Затем указанные ниже коды в файл js. указываем id, который будет работать при парсе в файле html
// import AirDatepicker from 'air-datepicker';
// import 'air-datepicker/air-datepicker.css';

// new AirDatepicker('#date')