import { RenderMode, type ServerRoute } from '@angular/ssr';

const freshHtml = { 'Cache-Control': 'no-cache' };

/** Public pages are rendered on the server. Account and auth screens stay in the browser. */
export const serverRoutes: ServerRoute[] = [
  { path: 'konto/**', renderMode: RenderMode.Client, headers: freshHtml },
  { path: 'admin/**', renderMode: RenderMode.Client, headers: freshHtml },
  { path: 'login', renderMode: RenderMode.Client, headers: freshHtml },
  { path: 'register', renderMode: RenderMode.Client, headers: freshHtml },
  { path: 'forgot-password', renderMode: RenderMode.Client, headers: freshHtml },
  { path: 'check-email', renderMode: RenderMode.Client, headers: freshHtml },
  { path: 'verify', renderMode: RenderMode.Client, headers: freshHtml },
  { path: 'verify-email', renderMode: RenderMode.Client, headers: freshHtml },
  { path: 'reset-password', renderMode: RenderMode.Client, headers: freshHtml },
  { path: '**', renderMode: RenderMode.Server, headers: freshHtml },
];
