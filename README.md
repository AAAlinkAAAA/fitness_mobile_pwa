# Fitness Club Mobile PWA

Мобильное Progressive Web Application для фитнес-клуба с бэкендом на Node.js.

## Структура проекта

```
fitness_mobile_pwa/
├── mobile_app/          # Frontend PWA
│   ├── css/
│   ├── js/
│   └── index.html
├── backend/            # Backend API
│   ├── src/
│   ├── models/
│   ├── migrations/
│   ├── seeders/
│   └── config/
├── package.json
└── README.md
```

## Технологии

### Frontend
- HTML5
- CSS3 (Tailwind CSS)
- JavaScript
- PWA (Progressive Web App)

### Backend
- Node.js
- Express
- Sequelize
- PostgreSQL
- JWT Authentication

## Установка и запуск

### Frontend
1. Установите зависимости:
```bash
npm install
```

2. Запустите сборку CSS:
```bash
npm run build:css
```

3. Откройте `mobile_app/index.html` в браузере

### Backend
1. Установите зависимости:
```bash
cd backend
npm install
```

2. Настройте базу данных:
- Создайте файл `.env` на основе `db.env`
- Настройте подключение к PostgreSQL

3. Запустите миграции:
```bash
npx sequelize-cli db:migrate
```

4. Запустите сервер:
```bash
npm run dev
```

## API Endpoints

- `POST /auth/register` - Регистрация
- `POST /auth/login` - Авторизация
- `GET /schedule` - Получение расписания
- `GET /personal-trainings` - Получение списка персональных тренировок
- `POST /personal-trainings/book` - Бронирование тренировки
- `GET /subscriptions` - Получение списка подписок
- `POST /subscriptions/purchase` - Покупка подписки

## Функциональность

- Просмотр расписания занятий
- Бронирование персональных тренировок
- Управление подписками
- Офлайн-режим
- Push-уведомления
- JWT аутентификация
- Работа с базой данных PostgreSQL

## Лицензия

MIT 