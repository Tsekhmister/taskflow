# REST API Шпаргалка - Один лист 📋

## 🎯 Что такое REST API простыми словами

**REST API** — это способ, по которому фронтенд и бэкенд общаются через интернет.

- **REST** = REpresentational State Transfer — архитектурный стиль
- **API** = Application Programming Interface — набор правил, как получать и отправлять данные
- **Обычно это запросы по HTTP** (GET, POST, PUT, DELETE) и ответы в формате JSON

## 🌐 HTTP Методы
| Метод | Описание | Пример |
|-------|----------|---------|
| **GET** | Получение данных | `GET /api/users` |
| **POST** | Создание | `POST /api/users` |
| **PUT** | Полное обновление | `PUT /api/users/123` |
| **PATCH** | Частичное обновление | `PATCH /api/users/123` |
| **DELETE** | Удаление | `DELETE /api/users/123` |

## 📊 HTTP Коды
- **2xx**: 200 OK, 201 Created, 204 No Content
- **4xx**: 400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found
- **5xx**: 500 Internal Error, 502 Bad Gateway, 503 Unavailable

## 🔧 Основные примеры

### GET - Получение данных
```javascript
fetch('/api/users')
  .then(res => res.json())
  .then(data => console.log(data))
  .catch(err => console.error(err));
```

### POST - Создание
```javascript
fetch('/api/users', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ name: 'Иван', email: 'ivan@example.com' })
});
```

### PUT - Обновление
```javascript
fetch('/api/users/123', {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ name: 'Иван Петров' })
});
```

### DELETE - Удаление
```javascript
fetch('/api/users/123', { method: 'DELETE' });
```

## 📝 Заголовки
```javascript
const headers = {
  'Content-Type': 'application/json',
  'Authorization': 'Bearer token123',
  'Accept': 'application/json'
};
```

## 🚀 Async/Await
```javascript
async function fetchUsers() {
  try {
    const response = await fetch('/api/users');
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error('Error:', error);
  }
}
```

## 🔍 Обработка ошибок
```javascript
if (response.status === 404) throw new Error('Не найден');
if (response.status === 401) throw new Error('Не авторизован');
if (response.status === 403) throw new Error('Доступ запрещен');
```

## 📡 Query Parameters
```javascript
const params = new URLSearchParams({ page: 1, limit: 10 });
fetch(`/api/users?${params}`);
```

## 🔐 Безопасность
- **CORS**: `Access-Control-Allow-Origin: *`
- **CSRF**: `X-CSRF-Token: token`
- **Auth**: `Authorization: Bearer token`

## 📚 Библиотеки
```javascript
// Axios
const users = await axios.get('/api/users');
const newUser = await axios.post('/api/users', data);

// SWR (React)
const { data, error, isLoading } = useSWR('/api/users', fetcher);
```

## 🎯 Частые вопросы

**PUT vs PATCH?** PUT - полное обновление, PATCH - частичное

**Idempotent методы?** GET, PUT, DELETE - идемпотентны, POST - нет

**CORS?** Политика безопасности браузера, обойти через сервер

**Обработка ошибок сети?** try-catch + проверка response.ok

## 🚀 Лучшие практики
1. ✅ Проверяйте статус ответа
2. ✅ Используйте try-catch
3. ✅ Добавляйте заголовки авторизации
4. ✅ Обрабатывайте сетевые ошибки
5. ✅ Используйте timeout
6. ✅ Кэшируйте ответы
7. ✅ Логируйте ошибки


