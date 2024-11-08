# NestJS Project

Этот проект представляет собой пример приложения, построенного с использованием фреймворка NestJS.

## Установка

1. Установите зависимости:

   ```bash
   yarn
   ```

2. Миграция на Yarn 3:

   ```bash
   yarn set version berry
   ```

3. Удалите старые зависимости и установите их заново с помощью Yarn 3:

   ```bash
   rm -rf node_modules
   yarn
   ```
## Запуск

1. Запустите команду:

   ```bash
   cp .env.example .env
   ```
2. Запустите сборку Docker :

   ```bash
   docker compose up -d
   ```

2. Приложение будет доступно по адресу `http://localhost:3000`.
