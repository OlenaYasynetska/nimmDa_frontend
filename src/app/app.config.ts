import { ApplicationConfig, inject, provideAppInitializer, provideZoneChangeDetection } from '@angular/core';
import { provideClientHydration, withNoHttpTransferCache } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { routes } from './app.routes';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { serverApiInterceptor } from './core/interceptors/server-api.interceptor';
import { provideGoogleAnalytics } from './core/analytics/google-analytics';
import { provideNativeShell } from './core/native/native-shell';
import { PwaInstallService } from './core/pwa/pwa-install.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideClientHydration(withNoHttpTransferCache()),
    provideHttpClient(withInterceptors([serverApiInterceptor, authInterceptor])),
    provideGoogleAnalytics(),
    provideNativeShell(),
    provideAppInitializer(() => {
      inject(PwaInstallService);
    }),
  ],
};
