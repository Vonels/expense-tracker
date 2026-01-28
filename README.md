![Banner](https://chatgpt.com/backend-api/estuary/content?id=file_00000000cbf471f49bb48ffe56b42c31&ts=491554&p=fs&cid=1&sig=b1f4e8d06fff59d2cb3113a93d2284d73749836de9381a56b892a39b13ad0653&v=0)

**Expense Tracker** — современное веб-приложение для управления личными финансами.  
Позволяет отслеживать доходы и расходы, анализировать баланс и управлять транзакциями в удобном и адаптивном интерфейсе.

> Проект создан как **production-ready pet-project** с архитектурой, близкой к реальным коммерческим приложениям.

---

## 🚀 Demo

🔗 **Live:** https://expense-tracker-sigma-tan.vercel.app  
🔗 **Repository:** https://github.com/Vonels/expense-tracker

---

## ✨ Features

- 🔐 Авторизация и защищённые маршруты
- ➕ Добавление / редактирование / удаление транзакций
- 📊 Отображение баланса и истории операций
- 🔍 Фильтрация и поиск
- 📱 Адаптивный дизайн (mobile-first)
- ⚡ Быстрая работа за счёт Next.js App Router

---

## 🧱 Tech Stack

- **Next.js 15 (App Router)**
- **TypeScript**
- **Zustand** — глобальное состояние
- **React Query (TanStack Query)** — работа с API
- **Formik + Yup** — формы и валидация
- **CSS Modules / Tailwind**
- **Axios**
- **ESLint + Prettier**
---

**Ключевые идеи архитектуры:**

- `components/` — плоская структура компонентов  
- `services/` — работа с API  
- `store/` — Zustand-сторы  
- `types/` — централизованные TypeScript типы  
- `(auth)` и `(private)` layout'ы для роутинга

---

## 🛠 Installation

### 1️⃣ Clone repository

git clone https://github.com/Vonels/expense-tracker.git
cd expense-tracker

2️⃣ Install dependencies
npm install
# or
yarn install

3️⃣ Environment variables
NEXT_PUBLIC_API_URL=your_api_url_here

4️⃣ Run locally
npm run dev

---

📜 Available Scripts

-Command	Description
-npm run dev	Development mode
-npm run build	Production build
-npm run start	Start production
-npm run lint	ESLint check

---

🧩 Future Improvements

-📈 Графики статистики (Recharts / Chart.js)
-💱 Мультивалютность
-🏷 Категории расходов
-📦 PWA поддержка
-🌙 Dark mode

⭐ Если проект был полезен — поставь звезду репозиторию!

