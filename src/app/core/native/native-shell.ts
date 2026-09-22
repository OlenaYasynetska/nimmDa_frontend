import { Location, isPlatformBrowser } from '@angular/common';
import { inject, PLATFORM_ID, provideAppInitializer } from '@angular/core';
import { Router } from '@angular/router';
import { Capacitor } from '@capacitor/core';

/**
 * Hardware back and status bar for the Capacitor shell.
 * In the browser this is a no-op.
 */
export function provideNativeShell() {
  return provideAppInitializer(() => {
    if (!isPlatformBrowser(inject(PLATFORM_ID)) || !Capacitor.isNativePlatform()) {
      return;
    }
    const router = inject(Router);
    const location = inject(Location);
    return setupNativeShell(router, location);
  });
}

async function setupNativeShell(router: Router, location: Location): Promise<void> {
  const [{ App }, { StatusBar, Style }] = await Promise.all([
    import('@capacitor/app'),
    import('@capacitor/status-bar'),
  ]);

  try {
    await StatusBar.setBackgroundColor({ color: '#1b3a5f' });
    await StatusBar.setStyle({ style: Style.Light });
  } catch {
    // iOS applies the status-bar color in the native project.
  }

  await App.addListener('backButton', () => {
    const path = router.url.split(/[?#]/)[0] || '/';
    if (path === '/') {
      void App.exitApp();
      return;
    }
    location.back();
  });
}
