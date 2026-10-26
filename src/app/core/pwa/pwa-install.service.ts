import { Injectable, signal } from '@angular/core';
import { Capacitor } from '@capacitor/core';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

@Injectable({ providedIn: 'root' })
export class PwaInstallService {
  private deferred: BeforeInstallPromptEvent | null = null;

  readonly canInstall = signal(false);
  readonly installed = signal(false);
  readonly ios = signal(false);
  readonly iosHelp = signal(false);

  constructor() {
    if (typeof window === 'undefined') return;

    const nav = navigator as Navigator & { standalone?: boolean };
    const standalone =
      window.matchMedia('(display-mode: standalone)').matches || nav.standalone === true;
    this.installed.set(standalone);
    this.ios.set(/iphone|ipad|ipod/i.test(navigator.userAgent));

    if (Capacitor.isNativePlatform() || !('serviceWorker' in navigator)) return;

    window.addEventListener('beforeinstallprompt', (event) => {
      event.preventDefault();
      this.deferred = event as BeforeInstallPromptEvent;
      this.canInstall.set(true);
    });
    window.addEventListener('appinstalled', () => {
      this.installed.set(true);
      this.canInstall.set(false);
      this.deferred = null;
    });

    void navigator.serviceWorker.register('/sw.js');
  }

  async install(): Promise<void> {
    const prompt = this.deferred;
    if (!prompt) {
      this.iosHelp.set(true);
      return;
    }
    await prompt.prompt();
    const choice = await prompt.userChoice;
    this.deferred = null;
    this.canInstall.set(false);
    if (choice.outcome === 'accepted') this.installed.set(true);
  }

  showIosHelp(): void {
    this.iosHelp.update((open) => !open);
  }
}
