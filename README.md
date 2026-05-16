# Musician Platform

Платформа для взаимодействия музыкантов и заказчиков.

## Стек

- Frontend: React.js + TypeScript + Vite
- Backend: Node.js + Express + TypeScript
- Database: MySQL + Prisma ORM
- Authentication: JWT

## Структура

- `backend` — Express API, Prisma, JWT-auth
- `frontend` — React/Vite клиент

## Первый запуск

1. Установить зависимости:
   `npm run install:all`
2. Создать `backend/.env` на основе `backend/.env.example`.
3. Создать `frontend/.env` на основе `frontend/.env.example`.
4. Запустить backend:
   `npm run dev:backend`
5. Запустить frontend:
   `npm run dev:frontend`

## Этапы реализации

- [x] Структура папок и основные `package.json`
- [x] Prisma schema и миграции
- [x] Backend API: auth, profiles, advertisements, responses, notifications
- [x] Frontend pages, routing, API client
- [x] Интеграция frontend-backend
