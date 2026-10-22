import { Injectable, computed, signal } from '@angular/core';
import { environment } from '../../../environments/environment';

const STORAGE_KEY = 'nimmda.ad-consent';

type AdChoice = 'granted' | 'denied';

type ConsentState = 'granted' | 'denied';

type GtagFn = (...args: unknown[]) => void;

declare global {
  interface Window {
    gtag?: GtagFn;
    adsbygoogle?: unknown[];
  }
}

/**
 * Google display ads. The publisher tag is in index.html so AdSense can see the site.
 * A visible unit still needs a slot id and the visitor's permission for ad cookies.
 */
@Injectable({ providedIn: 'root' })
export class AdSenseService {
  readonly clientId = environment.adsenseClient.trim();
  readonly slotId = environment.adsenseSlot.trim();
  readonly configured =
    /^ca-pub-\d+$/.test(this.clientId) && /^\d{6,}$/.test(this.slotId);

  private readonly choice = signal<AdChoice | null>(this.readChoice());
  private scriptRequested = false;

  readonly granted = computed(() => this.choice() === 'granted');
  readonly needsChoice = computed(() => this.configured && this.choice() === null);
  /** True when a labeled ad unit may render. */
  readonly enabled = computed(() => this.configured && this.granted());

  constructor() {
    if (typeof window === 'undefined' || !this.granted()) return;
    this.updateConsent('granted');
  }

  allow(): void {
    this.persist('granted');
    this.updateConsent('granted');
  }

  deny(): void {
    this.persist('denied');
    this.updateConsent('denied');
  }

  /**
   * Loads the AdSense tag once the publisher id is set.
   * Consent stays denied until the visitor allows advertising cookies,
   * so the tag does not store ad cookies on its own.
   */
  loadScript(): void {
    if (!/^ca-pub-\d+$/.test(this.clientId) || this.scriptRequested || typeof document === 'undefined') return;
    if (document.querySelector('script[src*="pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"]')) {
      this.scriptRequested = true;
      return;
    }
    this.scriptRequested = true;
    const script = document.createElement('script');
    script.async = true;
    script.crossOrigin = 'anonymous';
    script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${encodeURIComponent(this.clientId)}`;
    document.head.appendChild(script);
  }

  private updateConsent(state: ConsentState): void {
    window.gtag?.('consent', 'update', {
      ad_storage: state,
      ad_user_data: state,
      ad_personalization: state,
    });
  }

  private readChoice(): AdChoice | null {
    if (typeof localStorage === 'undefined') return null;
    const value = localStorage.getItem(STORAGE_KEY);
    return value === 'granted' || value === 'denied' ? value : null;
  }

  private persist(value: AdChoice): void {
    this.choice.set(value);
    localStorage.setItem(STORAGE_KEY, value);
  }
}
