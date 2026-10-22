# NimmDa Frontend

Angular 19 / TypeScript 5.6 / Tailwind CSS 3.4, standalone-компоненты, lazy routes.
Сайт: [https://www.nimmda.org](https://www.nimmda.org) и [https://nimmda.org](https://nimmda.org).
API — отдельный Spring Boot в `nimmDa_backend` (локально порт **8080**).
Android-оболочка: Capacitor 8, `appId` `org.nimmda.app`.

## Stack

| Technology | Purpose |
| --- | --- |
| Angular 19 | UI, routing, forms, HttpClient |
| Tailwind CSS 3.4 | стили (`src/styles/style.css`, PostCSS) |
| RxJS 7 | асинхронные потоки |
| Capacitor 8 | Android (`npm run build:mobile`, `npm run android`) |
| GA4 | поток NimmDa, measurement ID `G-JL2HHG2SKY` |

Сниппет тега лежит в `src/index.html`. Повторные `page_view` при смене маршрута шлёт `src/app/core/analytics/google-analytics.ts`.
Инструменты: ESLint (`ng lint`), Prettier, Karma/Jasmine.

## Структура `src/app`

```
src/app
├── app.component.ts
├── app.config.ts          # router, HttpClient + JWT interceptor, GA, Capacitor
├── app.routes.ts
│
├── core/
│   ├── analytics/         # GA4
│   ├── guards/            # auth, role, redirect admin с /konto
│   ├── interceptors/      # JWT Bearer
│   ├── models/
│   ├── native/            # оболочка Capacitor
│   └── services/          # auth
│
├── shared/                # button, card, хуки
├── layout/                # navbar
│
└── features/
    ├── landing/           # главная, шапка, подвал
    ├── marketplace/       # каталог, фильтры, карточка объявления, Standort
    ├── auth/              # вход, регистрация, почта, сброс пароля
    ├── konto/             # кабинет: обзор, объявления, избранное, профиль
    ├── seller/            # новое/редактирование объявления, сообщения
    ├── buyer/
    ├── admin/             # обзор, sellers, buyers; payments/ads/subscriptions пустые
    └── errors/            # 404
```

## Маршруты

| Path | Доступ | Содержание |
| --- | --- | --- |
| `/` | — | главная |
| `/login`, `/register`, `/forgot-password`, `/check-email`, `/verify`, `/verify-email`, `/reset-password` | — | auth. Старые `/auth/*` редиректят сюда |
| `/anzeigen`, `/anzeigen/:slug` | — | каталог и категории |
| `/services`, `/kostenlos` | — | услуги и бесплатные |
| `/anzeigen/:id` | — | карточка объявления |
| `/konto` | JWT | обзор |
| `/konto/nachrichten` | JWT | переписка |
| `/konto/favoriten` | JWT | избранное |
| `/konto/meine-anzeigen`, `…/neu`, `…/:id/bearbeiten`, `…/:filter` | JWT | свои объявления |
| `/konto/profil`, `/konto/einstellungen` | JWT | профиль и настройки |
| `/admin`, `/admin/sellers`, `/admin/buyers` | JWT + роль `admin` | админка |
| `/admin/payments`, `/admin/ads`, `/admin/subscriptions` | JWT + роль `admin` | пустые списки |
| `/seller/*` | — | редирект на `/konto` |
| `/404`, неизвестный путь | — | 404 |

Админ с `/konto` уходит на `/admin` (`redirectAdminGuard`).

## Local development

**Требования:** Node.js (LTS), npm. Бэкенд на порту **8080**.

```powershell
cd nimmDa_frontend
npm install
npm start
```

- Dev-сервер: [http://localhost:4200](http://localhost:4200). `proxy.conf.json` проксирует **`/api` → `http://127.0.0.1:8080`**.
- `npm start` читает `src/environments/environment.ts` (`apiUrl: '/api'`, `gaMeasurementId: 'G-JL2HHG2SKY'`). Файл `.env` на `ng serve` не действует.

Секреты не комитить: скопируй `.env.example` → `.env`.

**Тесты и линт**

```powershell
npm test
npm run lint
```

## Production-сборка

```powershell
npm run build
```

`prebuild` запускает `scripts/generate-prod-env.mjs` и пишет gitignored `src/environments/environment.prod.generated.ts`. Angular подменяет им `environment.ts` только в configuration `production`.

Переменные (из `.env` или CI, если переменная уже задана в окружении — она важнее файла):

| Переменная | По умолчанию | Смысл |
| --- | --- | --- |
| `NG_APP_API_URL` | `/api` | База API. Относительный `/api` годится, только если хост сам проксирует `/api` на Java. |
| `NG_APP_GA_MEASUREMENT_ID` | `G-JL2HHG2SKY` | GA4. Пустое значение выключает ID в бандле; сниппет в `index.html` при этом остаётся. |
| `NG_APP_ADSENSE_CLIENT` | `ca-pub-7335564704542106` | Издатель AdSense. Тот же номер стоит в проверочном теге в `index.html`. |
| `NG_APP_ADSENSE_SLOT` | пусто | Числовой id блока. Пока пусто, видимого баннера нет. |

`https://nimmda.org/api` — это само Angular-приложение, не Java API. Чтобы прод-сборка ходила в бэкенд, нужен абсолютный URL (`https://<backend-host>/api`) либо прокси на хостинге.

## Android

```powershell
npm run build:mobile
npm run android
```

`build:mobile` не принимает относительный `/api` (на телефоне нет dev-proxy).

- Эмулятор: `npm run build:mobile:emulator` → `http://10.0.2.2:8080/api`.
- Телефон в той же сети: `NG_APP_API_URL=http://<LAN-IP-этого-ПК>:8080/api`.
