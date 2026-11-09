import { isPlatformServer } from '@angular/common';
import { HttpInterceptorFn } from '@angular/common/http';
import { inject, PLATFORM_ID } from '@angular/core';
import { environment } from '../../../environments/environment';

/**
 * Browser dev requests to `/api` go through the dev-server proxy.
 * The server render makes its own HTTP call, so a relative URL is sent straight to the backend.
 */
export const serverApiInterceptor: HttpInterceptorFn = (req, next) => {
  if (!isPlatformServer(inject(PLATFORM_ID))) {
    return next(req);
  }
  const apiUrl = environment.apiUrl;
  if (!apiUrl.startsWith('/') || !req.url.startsWith(apiUrl)) {
    return next(req);
  }
  const env = (globalThis as { process?: { env?: Record<string, string | undefined> } }).process?.env;
  const origin = (env?.['SSR_API_ORIGIN'] || 'http://127.0.0.1:8080').replace(/\/$/, '');
  return next(req.clone({ url: `${origin}${req.url}` }));
};
