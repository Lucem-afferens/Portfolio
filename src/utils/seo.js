/**
 * Утилиты для SEO оптимизации
 */

/**
 * Обновление meta тегов
 */
export function updateMetaTags(meta) {
  const { title, description, image, url } = meta;

  if (title) {
    document.title = title;
    updateMetaTag('property', 'og:title', title);
    updateMetaTag('name', 'twitter:title', title);
  }

  if (description) {
    updateMetaTag('name', 'description', description);
    updateMetaTag('property', 'og:description', description);
    updateMetaTag('name', 'twitter:description', description);
  }

  if (image) {
    updateMetaTag('property', 'og:image', image);
    updateMetaTag('name', 'twitter:image', image);
  }

  if (url) {
    updateMetaTag('property', 'og:url', url);
    updateMetaTag('name', 'twitter:url', url);
  }
}

function updateMetaTag(attribute, value, content) {
  let meta = document.querySelector(`meta[${attribute}="${value}"]`);

  if (!meta) {
    meta = document.createElement('meta');
    meta.setAttribute(attribute, value);
    document.head.appendChild(meta);
  }

  meta.setAttribute('content', content);
}

/**
 * Добавление структурированных данных (JSON-LD)
 */
export function addStructuredData(data) {
  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.textContent = JSON.stringify(data);
  document.head.appendChild(script);
}

/**
 * Инициализация базовых структурированных данных
 */
export function initStructuredData() {
  // Person schema
  addStructuredData({
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Николай Дудин',
    alternateName: 'Nikolay Dudin',
    url: 'https://develonik.ru',
    jobTitle: 'Web Developer',
    worksFor: {
      '@type': 'Organization',
      name: 'Freelance',
    },
    email: 'nikwebdev.2025@gmail.com',
    telephone: '+79226447689',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Москва',
      addressRegion: 'Москва',
      addressCountry: 'RU',
    },
    sameAs: [
      'https://github.com/Lucem-afferens',
      'https://t.me/lucem_afferens',
      'https://vk.com/lucem.afferens',
    ],
    description:
      'Web-разработчик полного цикла с опытом создания адаптивных веб-приложений и сайтов «под ключ». Специализация: Frontend, оптимизация производительности, SEO.',
  });

  // WebSite schema
  addStructuredData({
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Портфолио Николая Дудина',
    url: 'https://develonik.ru',
    author: {
      '@type': 'Person',
      name: 'Николай Дудин',
    },
    description:
      'Портфолио Web-разработчика. Создание адаптивных веб-приложений, оптимизация производительности, SEO.',
    inLanguage: ['ru', 'en'],
  });
}
