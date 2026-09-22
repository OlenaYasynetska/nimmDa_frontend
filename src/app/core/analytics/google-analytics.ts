import { isPlatformBrowser } from '@angular/common';
import { inject, PLATFORM_ID, provideAppInitializer } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { environment } from '../../../environments/environment';

const MEASUREMENT_ID = /^G-[A-Z0-9]+$/;

type GtagFn = (...args: unknown[]) => void;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: GtagFn;
  }
}

/** Loads the GA4 tag and records a page view on each Angular navigation. */
export function provideGoogleAnalytics() {
  return provideAppInitializer(() => {
    if (!isPlatformBrowser(inject(PLATFORM_ID))) return;

    const measurementId = environment.gaMeasurementId.trim();
    if (!MEASUREMENT_ID.test(measurementId)) return;

    const router = inject(Router);
    if (typeof window.gtag !== 'function') {
      installGtag(measurementId);
    }

    let lastPath = `${window.location.pathname}${window.location.search}`;
    router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe((event) => {
        const path = event.urlAfterRedirects;
        if (!path || path === lastPath) return;
        lastPath = path;
        trackPageView(measurementId, path);
      });
  });
}

function installGtag(measurementId: string): void {
  window.dataLayer = window.dataLayer ?? [];
  window.gtag = function gtag() {
    window.dataLayer?.push(arguments);
  };
  window.gtag('consent', 'default', {
    analytics_storage: 'granted',
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
  });
  window.gtag('js', new Date());
  window.gtag('config', measurementId, { send_page_view: false });

  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`;
  document.head.appendChild(script);
}

function trackPageView(measurementId: string, path: string): void {
  window.gtag?.('event', 'page_view', {
    send_to: measurementId,
    page_path: path,
    page_location: `${window.location.origin}${path}`,
    page_title: document.title,
  });
}
