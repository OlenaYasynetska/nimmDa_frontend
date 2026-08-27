# NimmDa Frontend

Angular 19 / TypeScript 5.6 / Tailwind CSS 3, standalone components, lazy routes (как `onlineSchool_frontend`).
Бекенд — `nimmDa_backend` (Spring Boot).

## Stack

| Technology | Purpose |
| --- | --- |
| Angular 19 | UI, routing, forms, HttpClient |
| Tailwind CSS | styles (`src/styles/style.css`, PostCSS) |
| RxJS | async streams |

Инструменты: ESLint (`ng lint`), Prettier, Karma/Jasmine.

## Структура `src/app`

```
src/app
├── app.component.ts       # корень
├── app.config.ts          # provideRouter, provideHttpClient + interceptor
├── app.routes.ts          # глобальные маршруты
│
├── core/                  # один раз на приложение, без фич
│   ├── guards/            # auth, role
│   ├── interceptors/      # JWT (пока без токена)
│   ├── models/            # user
│   └── services/          # health, auth (заглушка)
│
├── shared/                # общее для нескольких фич
│   ├── components/        # button, card, loader
│   ├── directives/
│   ├── hooks/
│   ├── pipes/
│   └── utils/
│
├── layout/                # оболочки и навигация
│   ├── main-layout/
│   ├── sidebar/, navbar/, footer/
│
└── features/              # домены (lazy routes где есть *.routes.ts)
    ├── landing/           # главная + health
    ├── auth/              # логин (заглушка)
    └── errors/            # 404
```

Роли, кабинеты и остальные фичи добавим отдельно.

## Маршруты

| Path | Protection | Content |
| --- | --- | --- |
| `/` | — | Landing + backend health |
| `/auth/*` | — | Auth placeholder |
| `/**` | — | 404 |

## Local development

**Требования:** Node.js (LTS), npm; бэкенд обычно на порту **8080**.

```powershell
cd nimmDa_frontend
npm install
npm start
```

- Dev-сервер: `ng serve` с `proxy.conf.json` — **`/api` → `http://localhost:8080`**.
- Базовый URL API: `src/environments/environment.ts` (`apiUrl`, по умолчанию `/api`).

Health бэкенда: [http://localhost:4200/](http://localhost:4200/) (карточка статуса) или напрямую [http://localhost:8080/api/health](http://localhost:8080/api/health).

Секреты не комитить: скопируй `.env.example` → `.env`.

**Тесты и линт**

```powershell
npm test
npm run lint
```

**Production-сборка**

```powershell
npm run build
```

Перед билдом выполняется `prebuild` → `scripts/generate-prod-env.mjs` создаёт `src/environments/environment.prod.generated.ts` (в `.gitignore`).
