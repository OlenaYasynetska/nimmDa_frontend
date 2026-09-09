import type { AppEnvironment } from './environment.types';

/**
 * Local development (`npm start` / `ng serve`).
 * `.env` is NOT applied here — only `npm run build` (see scripts/generate-prod-env.mjs).
 * `/api` is proxied to the backend by proxy.conf.json.
 */
export const environment: AppEnvironment = {
  production: false,
  apiUrl: '/api',
  enableLocalSuperAdminLogin: true,
  superAdminEmail: 'superadmin@nimmda.local',
  superAdminPassword: 'SuperAdmin!ChangeMe',
};
