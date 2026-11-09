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

`npm run build` собирает браузер и сервер в `dist/nimmda-frontend`. Продакшен нужно запускать процессом Node, а не как папку статических файлов: иначе Google снова получит пустой `<app-root>`.

```powershell
npm run build
npm run serve:ssr
```

Сервер слушает `PORT` (по умолчанию 4000) на `0.0.0.0`. В HTML ответа уже есть заголовки, цены и описания объявлений. `sitemap.xml` на этом сервере строится из активных объявлений и не включает пустые категории. Хосты, с которых разрешён рендер: `www.nimmda.org`, `nimmda.org`, `localhost`. Дополнительный хост прокси задаётся через `NG_ALLOWED_HOSTS`.

Локальный `npm start` тоже рендерит страницы на сервере. Запросы `/api` с сервера идут на `SSR_API_ORIGIN` (по умолчанию `http://127.0.0.1:8080`), потому что прокси `ng serve` их не видит.

`prebuild` запускает `scripts/generate-prod-env.mjs` и пишет gitignored `src/environments/environment.prod.generated.ts`. Angular подменяет им `environment.ts` только в configuration `production`.

Переменные (из `.env` или CI, если переменная уже задана в окружении — она важнее файла):

| Переменная | По умолчанию | Смысл |
| --- | --- | --- |
| `NG_APP_API_URL` | `https://api.nimmda.org/api` | База API продакшен-сборки. Относительный `/api` тоже заменяется на этот адрес: на nimmda.org нет прокси к Java API. |
| `NG_APP_GA_MEASUREMENT_ID` | `G-JL2HHG2SKY` | GA4. Пустое значение выключает ID в бандле; сниппет в `index.html` при этом остаётся. |
| `NG_APP_ADSENSE_CLIENT` | `ca-pub-7335564704542106` | Издатель AdSense. Скрипт рекламы не лежит в `index.html`: он подключается только на страницах объявлений, где уже есть содержание. |
| `NG_APP_ADSENSE_SLOT` | пусто | Числовой id блока. Пока пусто, видимого баннера нет. |

`https://nimmda.org/api` — это само Angular-приложение, не Java API. Продакшен-сборка сайта ходит на `https://api.nimmda.org/api`.

## PWA

Сайт ставится на экран телефона без магазина. Манифест и иконки лежат в `public/`, регистрация service worker — в `PwaInstallService`. В подвале кнопка «App installieren» (Android/Chrome) или подсказка для iPhone. Пустые ссылки App Store и Google Play убраны.

## Android

```powershell
npm run build:mobile
npm run android
```

`build:mobile` использует тот же адрес API, что и сайт. На телефоне нет dev-proxy. Явный `NG_APP_API_URL=http://…` по-прежнему перекрывает адрес.

Страница для Google Play: `https://www.nimmda.org/datenschutz`. Она появится на сайте после выкладки фронтенда.

- Эмулятор: `npm run build:mobile:emulator` → `http://10.0.2.2:8080/api`.
- Телефон в той же сети: `NG_APP_API_URL=http://<LAN-IP-этого-ПК>:8080/api`.
