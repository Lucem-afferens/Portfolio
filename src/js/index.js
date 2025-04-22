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



// Инициализация EmailJS
(function () {
  emailjs.init("_L3Fwrf-tKc-jUOAI"); // вставь свой public key
})();

document.getElementById('contact-form').addEventListener('submit', function (e) {
  e.preventDefault();

  const policy = document.getElementById('policy');
  if (!policy.checked) {
    alert("Пожалуйста, примите политику конфиденциальности.");
    return;
  }

  const loader = document.getElementById('form-loader');
  const submitButton = this.querySelector('button[type="submit"]');

  // Показать индикатор загрузки и блокировать кнопку
  loader.style.display = 'flex';
  submitButton.disabled = true;
  submitButton.textContent = "Отправка...";

  emailjs.sendForm('service_c78rc3e', 'template_wzmfe24', this)
    .then((response) => {
      console.log("Успешно отправлено", response);
      alert("Сообщение отправлено!");
      this.reset();
    })
    .catch((error) => {
      console.error("Ошибка отправки:", error);
      alert("Произошла ошибка при отправке.");
    })
    .finally(() => {
      submitButton.disabled = false; // Разблокировать кнопку
      submitButton.textContent = "Отправить сообщение"; // Восстановить текст
      loader.style.display = 'none'; // Скрыть индикатор
    });
});
  






// // NPM пакеты в верстке. Пример подключения календаря datepicker. сначала команда в терминале npm i air-datepicker -s   .Затем указанные ниже коды в файл js. указываем id, который будет работать при парсе в файле html
// import AirDatepicker from 'air-datepicker';
// import 'air-datepicker/air-datepicker.css';

// new AirDatepicker('#date')