document.addEventListener('DOMContentLoaded', () => {
  const content = document.getElementById('content');
  const navLinks = document.getElementById('nav-links');
  const authLinks = document.getElementById('auth-links');
  const loginLink = document.getElementById('login-link');
  const registerLink = document.getElementById('register-link');
  const homeLink = document.getElementById('home-link');
  const scheduleLink = document.getElementById('schedule-link');
  const bookingsLink = document.getElementById('bookings-link');
  const logoutLink = document.getElementById('logout-link');

  const API_URL = 'http://localhost:3000/api'; // Для мобильного устройства заменить на IP

  // Проверка авторизации
  const checkAuth = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    console.log('Проверка авторизации:', user); // Отладка
    if (user) {
      navLinks.classList.remove('hidden');
      authLinks.classList.add('hidden');
      renderHome();
    } else {
      navLinks.classList.add('hidden');
      authLinks.classList.remove('hidden');
      renderLogin();
    }
  };

  // Рендер экрана входа
  const renderLogin = () => {
    content.innerHTML = `
      <h2 class="text-2xl font-bold mb-4">Вход</h2>
      <form id="login-form">
        <input type="email" id="login-email" placeholder="Email" required>
        <input type="password" id="login-password" placeholder="Пароль" required>
        <p id="login-error" class="error hidden"></p>
        <button type="submit">Войти</button>
      </form>
    `;
    const loginForm = document.getElementById('login-form');
    loginForm.addEventListener('submit', handleLogin);
  };

  // Рендер экрана регистрации
  const renderRegister = () => {
    content.innerHTML = `
      <h2 class="text-2xl font-bold mb-4">Регистрация</h2>
      <form id="register-form">
        <input type="text" id="register-name" placeholder="Имя" required>
        <input type="email" id="register-email" placeholder="Email" required>
        <input type="password" id="register-password" placeholder="Пароль" required>
        <p id="register-error" class="error hidden"></p>
        <button type="submit">Зарегистрироваться</button>
      </form>
    `;
    const registerForm = document.getElementById('register-form');
    registerForm.addEventListener('submit', handleRegister);
  };

  // Рендер главной страницы
  const renderHome = async () => {
    content.innerHTML = `
      <h2 class="text-2xl font-bold mb-4">Добро пожаловать, ${JSON.parse(localStorage.getItem('user')).name}!</h2>
      <p id="home-error" class="error hidden"></p>
      <h3 class="text-xl font-semibold mb-2">Ближайшие занятия</h3>
      <div id="schedules" class="space-y-4"></div>
    `;
    try {
      const schedules = await fetchSchedules();
      const schedulesDiv = document.getElementById('schedules');
      schedules.slice(0, 5).forEach(schedule => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
          <h4 class="text-lg font-bold">${schedule.class.name}</h4>
          <p>Дата: ${new Date(schedule.date).toLocaleString()}</p>
          <p>Тренер: ${schedule.trainer.name}</p>
          <button onclick="bookSchedule('${schedule.id}')" class="mt-2">Забронировать</button>
        `;
        schedulesDiv.appendChild(card);
      });
    } catch (err) {
      console.error('Ошибка загрузки расписания:', err); // Отладка
      document.getElementById('home-error').textContent = err.message || 'Не удалось загрузить расписание';
      document.getElementById('home-error').classList.remove('hidden');
    }
  };

  // Рендер расписания
  const renderSchedule = async () => {
    content.innerHTML = `
      <h2 class="text-2xl font-bold mb-4">Расписание занятий</h2>
      <p id="schedule-error" class="error hidden"></p>
      <div id="schedules" class="space-y-4"></div>
    `;
    try {
      const schedules = await fetchSchedules();
      const schedulesDiv = document.getElementById('schedules');
      schedules.forEach(schedule => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
          <h4 class="text-lg font-bold">${schedule.class.name}</h4>
          <p>Дата: ${new Date(schedule.date).toLocaleString()}</p>
          <p>Тренер: ${schedule.trainer.name}</p>
          <button onclick="bookSchedule('${schedule.id}')" class="mt-2">Забронировать</button>
        `;
        schedulesDiv.appendChild(card);
      });
    } catch (err) {
      console.error('Ошибка загрузки расписания:', err); // Отладка
      document.getElementById('schedule-error').textContent = err.message || 'Не удалось загрузить расписание';
      document.getElementById('schedule-error').classList.remove('hidden');
    }
  };

  // Рендер бронирований
  const renderBookings = async () => {
    content.innerHTML = `
      <h2 class="text-2xl font-bold mb-4">Ваши бронирования</h2>
      <p id="bookings-error" class="error hidden"></p>
      <div id="bookings" class="space-y-4"></div>
    `;
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const bookings = await fetchBookings(user.id);
      const bookingsDiv = document.getElementById('bookings');
      if (bookings.length === 0) {
        bookingsDiv.innerHTML = '<p>Нет бронирований</p>';
      } else {
        bookings.forEach(booking => {
          const card = document.createElement('div');
          card.className = 'card';
          card.innerHTML = `
            <h4 class="text-lg font-bold">${booking.class.name}</h4>
            <p>Дата: ${new Date(booking.schedule.date).toLocaleString()}</p>
            <p>Статус: ${booking.status}</p>
          `;
          bookingsDiv.appendChild(card);
        });
      }
    } catch (err) {
      console.error('Ошибка загрузки бронирований:', err); // Отладка
      document.getElementById('bookings-error').textContent = err.message || 'Не удалось загрузить бронирования';
      document.getElementById('bookings-error').classList.remove('hidden');
    }
  };

  // Обработка входа
  const handleLogin = async (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    const error = document.getElementById('login-error');
    console.log('Отправка запроса на вход:', { email, password }); // Отладка
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      console.log('Ответ сервера на вход:', response.status, response.statusText); // Отладка
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Ошибка входа');
      }
      const data = await response.json();
      localStorage.setItem('user', JSON.stringify(data.user));
      console.log('Пользователь вошёл:', data.user); // Отладка
      checkAuth();
    } catch (err) {
      console.error('Ошибка входа:', err); // Отладка
      error.textContent = err.message || 'Не удалось выполнить вход';
      error.classList.remove('hidden');
    }
  };

  // Обработка регистрации
  const handleRegister = async (e) => {
    e.preventDefault();
    const name = document.getElementById('register-name').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    const error = document.getElementById('register-error');
    console.log('Отправка запроса на регистрацию:', { name, email, password }); // Отладка
    try {
      const response = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });
      console.log('Ответ сервера на регистрацию:', response.status, response.statusText); // Отладка
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Ошибка регистрации');
      }
      const data = await response.json();
      localStorage.setItem('user', JSON.stringify(data.user));
      console.log('Пользователь зарегистрирован:', data.user); // Отладка
      checkAuth();
    } catch (err) {
      console.error('Ошибка регистрации:', err); // Отладка
      error.textContent = err.message || 'Не удалось зарегистрироваться';
      error.classList.remove('hidden');
    }
  };

  // Получение расписания
  const fetchSchedules = async () => {
    console.log('Запрос расписания'); // Отладка
    try {
      const response = await fetch(`${API_URL}/schedules`, {
        headers: { 'Content-Type': 'application/json' },
      });
      console.log('Ответ сервера на расписание:', response.status, response.statusText); // Отладка
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Ошибка загрузки расписания');
      }
      const data = await response.json();
      // Кэшировать данные
      if ('caches' in window) {
        caches.open('api-cache').then(cache => {
          cache.put('/api/schedules', new Response(JSON.stringify(data)));
        });
      }
      return data;
    } catch (err) {
      console.error('Ошибка запроса расписания:', err); // Отладка
      throw err;
    }
  };

  // Получение бронирований
  const fetchBookings = async (userId) => {
    console.log('Запрос бронирований:', { userId }); // Отладка
    try {
      const response = await fetch(`${API_URL}/bookings?userId=${userId}`, {
        headers: { 'Content-Type': 'application/json' },
      });
      console.log('Ответ сервера на бронирования:', response.status, response.statusText); // Отладка
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Ошибка загрузки бронирований');
      }
      const data = await response.json();
      // Кэшировать данные
      if ('caches' in window) {
        caches.open('api-cache').then(cache => {
          cache.put(`/api/bookings?userId=${userId}`, new Response(JSON.stringify(data)));
        });
      }
      return data;
    } catch (err) {
      console.error('Ошибка запроса бронирований:', err); // Отладка
      throw err;
    }
  };

  // Бронирование занятия
  window.bookSchedule = async (scheduleId) => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
      console.log('Пользователь не авторизован, перенаправление на вход'); // Отладка
      renderLogin();
      return;
    }
    console.log('Отправка запроса на бронирование:', { userId: user.id, scheduleId }); // Отладка
    try {
      const response = await fetch(`${API_URL}/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, scheduleId }),
      });
      console.log('Ответ сервера на бронирование:', response.status, response.statusText); // Отладка
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Ошибка бронирования');
      }
      console.log('Бронирование успешно'); // Отладка
      renderBookings();
    } catch (err) {
      console.error('Ошибка бронирования:', err); // Отладка
      alert(err.message || 'Не удалось забронировать');
    }
  };

  // Обработка выхода
  const handleLogout = () => {
    console.log('Выход из аккаунта'); // Отладка
    localStorage.removeItem('user');
    checkAuth();
  };

  // Навигация
  loginLink.addEventListener('click', (e) => {
    e.preventDefault();
    console.log('Переход на экран входа'); // Отладка
    renderLogin();
  });

  registerLink.addEventListener('click', (e) => {
    e.preventDefault();
    console.log('Переход на экран регистрации'); // Отладка
    renderRegister();
  });

  homeLink.addEventListener('click', (e) => {
    e.preventDefault();
    console.log('Переход на главную страницу'); // Отладка
    renderHome();
  });

  scheduleLink.addEventListener('click', (e) => {
    e.preventDefault();
    console.log('Переход на расписание'); // Отладка
    renderSchedule();
  });

  bookingsLink.addEventListener('click', (e) => {
    e.preventDefault();
    console.log('Переход на бронирования'); // Отладка
    renderBookings();
  });

  logoutLink.addEventListener('click', (e) => {
    e.preventDefault();
    handleLogout();
  });

  // Регистрация Service Worker
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/service-worker.js')
      .then(() => console.log('Service Worker зарегистрирован'))
      .catch(err => console.error('Ошибка регистрации Service Worker:', err));
  }

  // Начальная проверка
  console.log('Инициализация приложения'); // Отладка
  checkAuth();
});