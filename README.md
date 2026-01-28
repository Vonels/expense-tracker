![Banner](./public/banner.png)

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

- **Next.js 16 (App Router)**
- **TypeScript**
- **Zustand** — глобальное состояние
- **React Query (TanStack Query)** — работа с API
- **Formik + Yup** — формы и валидация
- **CSS Modules**
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

## ⚙️ Installation & Setup

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/OksanaVakuliak/09-auth.git
    cd 09-auth
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Environment Variables:** Create a `.env.local` file in the root directory:

    ```env
    NEXT_PUBLIC_API_URL=http://localhost:3000
    ```

4.  **Run the development server:**

    ```bash
    npm run dev
    ```

    Open [http://localhost:3000](http://localhost:3000) with your browser to see
    the result.


---

## 📜 Available Scripts

- Command	Description
- npm run dev	Development mode
- npm run build	Production build
- npm run start	Start production
- npm run lint	ESLint check

---

## 🧩 Future Improvements

- 📈 Графики статистики (Recharts / Chart.js)
- 💱 Мультивалютность
- 🏷 Категории расходов
- 📦 PWA поддержка
- 🌙 Dark mode

## ⭐ Если проект был полезен — поставь звезду репозиторию!

