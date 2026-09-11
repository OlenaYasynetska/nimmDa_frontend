import { DOCUMENT } from '@angular/common';
import { Component, DestroyRef, ElementRef, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { toSignal, takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter, map } from 'rxjs';
import { AuthService } from '../../../../core/services/auth.service';
import { listingFilterQuery } from '../../../marketplace/data/listing-query';
import { categoryBySlug } from '../../../landing/data/landing.content';
import { StandortPickerComponent } from '../../../marketplace/components/standort-picker/standort-picker.component';
import { hasCoordinates, parseStandort, type StandortValue } from '../../../marketplace/data/standort';
import { StandortService } from '../../../marketplace/services/standort.service';
import { SellerMessagesService } from '../../../seller/services/seller-messages.service';
import { BrandMarkComponent } from '../brand-mark/brand-mark.component';
import { LandingIconComponent } from '../landing-icon/landing-icon.component';

@Component({
  selector: 'app-landing-header',
  standalone: true,
  imports: [RouterLink, FormsModule, BrandMarkComponent, LandingIconComponent, StandortPickerComponent],
  host: {
    '(document:click)': 'onDocumentClick($event)',
  },
  template: `
    <header class="sticky top-0 z-30 border-b border-slate-100 bg-white">
      <div class="container flex items-center gap-2 px-3 py-2 md:gap-3 md:px-8 md:py-3">
        <app-brand-mark [compact]="true" />

        <nav class="hidden items-center gap-5 text-sm font-medium text-slate-700 lg:flex">
          <a
            routerLink="/anzeigen"
            [queryParams]="standort.queryParams()"
            class="hover:text-[#1b3a5f]"
            [class.text-[#1b3a5f]]="anzeigenActive()"
          >
            Anzeigen
          </a>
          <a
            routerLink="/services"
            [queryParams]="standort.queryParams()"
            class="hover:text-[#1b3a5f]"
            [class.text-[#1b3a5f]]="servicesActive()"
          >
            Services
          </a>
          <a
            routerLink="/kostenlos"
            [queryParams]="standort.queryParams()"
            class="hover:text-[#1b3a5f]"
            [class.text-[#1b3a5f]]="kostenlosActive()"
          >
            Kostenlos
          </a>
        </nav>

        <form class="relative min-w-0 flex-1" (ngSubmit)="search()">
          <label class="sr-only" for="header-search">Was suchst du?</label>
          <input
            id="header-search"
            type="search"
            name="q"
            [(ngModel)]="query"
            placeholder="Was suchst du?"
            class="w-full rounded-xl border-0 bg-slate-100 py-2.5 pl-3 pr-11 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-200"
          />
          <button
            type="submit"
            class="absolute right-1 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-lg text-slate-500 hover:bg-white hover:text-[#1b3a5f]"
            aria-label="Suchen"
          >
            <app-landing-icon name="search" svgClass="h-4 w-4" />
          </button>
        </form>

        <app-standort-picker
          variant="header"
          class="shrink-0"
          [value]="standort.selected()"
          [allowEmpty]="true"
          emptyLabel="Alle Orte"
          (valueChange)="chooseStandort($event)"
        />

        @if (!auth.isAdmin()) {
          <button
            type="button"
            class="hidden shrink-0 items-center rounded-lg bg-[#f5c400] px-3 py-2 text-sm font-bold text-[#1b3a5f] hover:bg-[#e6b700] md:inline-flex"
            (click)="goAufgeben()"
          >
            <span class="xl:hidden">Aufgeben</span>
            <span class="hidden xl:inline">Anzeige aufgeben</span>
          </button>
        }

        <div class="ml-0 hidden items-center gap-1 md:flex">
          <button
            type="button"
            class="inline-flex items-center gap-1.5 rounded-lg px-2 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-[#1b3a5f]"
            (click)="goKonto('/konto/favoriten')"
          >
            <app-landing-icon name="heart" svgClass="h-4 w-4" />
            <span class="hidden lg:inline">Favoriten</span>
          </button>
          <button
            type="button"
            class="relative inline-flex items-center gap-1.5 rounded-lg px-2 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-[#1b3a5f]"
            (click)="goKonto('/konto/nachrichten')"
          >
            <app-landing-icon name="chat" svgClass="h-4 w-4" />
            <span class="hidden lg:inline">Nachrichten</span>
            @if (auth.isAuthenticated() && messages.unreadCount() > 0) {
              <span class="absolute right-1 top-1 h-2 w-2 rounded-full bg-[#2f9e57]"></span>
            }
          </button>

          @if (auth.isAuthenticated() && !auth.isAdmin()) {
            <div class="relative">
              <button
                type="button"
                class="inline-flex items-center gap-1 rounded-lg px-2 py-2 text-sm font-semibold text-[#1b3a5f] hover:bg-slate-50"
                (click)="toggleMenu($event)"
              >
                {{ displayName }}
                <svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6 9l6 6 6-6" />
                </svg>
              </button>
              @if (menuOpen()) {
                <div class="absolute right-0 z-40 mt-1 w-52 rounded-xl border border-slate-100 bg-white py-1 shadow-lg">
                  <a routerLink="/konto" class="block px-3 py-2 text-sm text-slate-700 hover:bg-slate-50" (click)="closeMenu()">
                    Mein Konto
                  </a>
                  <a
                    routerLink="/konto/meine-anzeigen"
                    class="block px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
                    (click)="closeMenu()"
                  >
                    Meine Anzeigen
                  </a>
                  <a
                    routerLink="/konto/nachrichten"
                    class="block px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
                    (click)="closeMenu()"
                  >
                    Nachrichten
                  </a>
                  <a
                    routerLink="/konto/favoriten"
                    class="block px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
                    (click)="closeMenu()"
                  >
                    Favoriten
                  </a>
                  <a
                    routerLink="/konto/einstellungen"
                    class="block px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
                    (click)="closeMenu()"
                  >
                    Einstellungen
                  </a>
                  <button
                    type="button"
                    class="block w-full px-3 py-2 text-left text-sm font-medium text-slate-700 hover:bg-slate-50"
                    (click)="logout()"
                  >
                    Abmelden
                  </button>
                </div>
              }
            </div>
          } @else if (auth.isAdmin()) {
            <div class="relative">
              <button
                type="button"
                class="inline-flex items-center gap-1 rounded-lg px-2 py-2 text-sm font-semibold text-[#1b3a5f] hover:bg-slate-50"
                (click)="toggleMenu($event)"
              >
                Admin
                <svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6 9l6 6 6-6" />
                </svg>
              </button>
              @if (menuOpen()) {
                <div class="absolute right-0 z-40 mt-1 w-44 rounded-xl border border-slate-100 bg-white py-1 shadow-lg">
                  <a routerLink="/admin" class="block px-3 py-2 text-sm text-slate-700 hover:bg-slate-50" (click)="closeMenu()">
                    Admin
                  </a>
                  <button
                    type="button"
                    class="block w-full px-3 py-2 text-left text-sm font-medium text-slate-700 hover:bg-slate-50"
                    (click)="logout()"
                  >
                    Abmelden
                  </button>
                </div>
              }
            </div>
          } @else {
            <a
              routerLink="/login"
              class="inline-flex items-center gap-1.5 px-2 py-2 text-sm font-medium text-slate-700 hover:text-[#1b3a5f]"
            >
              Anmelden
            </a>
          }
        </div>
      </div>
    </header>

    @if (!auth.isAdmin() && !authScreen()) {
      <nav
        class="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white md:hidden"
        style="padding-bottom: env(safe-area-inset-bottom, 0px)"
        aria-label="Mobile Navigation"
      >
        <div class="grid grid-cols-5 items-end px-1 pt-1 pb-1">
          <a
            routerLink="/"
            class="flex min-h-12 flex-col items-center justify-center gap-0.5 text-[11px] font-medium"
            [class]="startActive() ? 'text-[#1b3a5f]' : 'text-slate-500'"
          >
            <app-landing-icon name="home" svgClass="h-5 w-5" />
            Start
          </a>
          <a
            routerLink="/anzeigen"
            [queryParams]="standort.queryParams()"
            class="flex min-h-12 flex-col items-center justify-center gap-0.5 text-[11px] font-medium"
            [class]="searchActive() ? 'text-[#1b3a5f]' : 'text-slate-500'"
          >
            <app-landing-icon name="search" svgClass="h-5 w-5" />
            Suche
          </a>
          <button
            type="button"
            class="flex min-h-12 flex-col items-center justify-center text-[11px] font-bold text-[#1b3a5f]"
            (click)="goAufgeben()"
          >
            <span
              class="-mt-5 mb-0.5 flex h-14 w-14 items-center justify-center rounded-full bg-[#f5c400] shadow-[0_8px_20px_rgba(245,196,0,0.45)] ring-4 ring-white"
              [class.ring-[#1b3a5f]]="aufgebenActive()"
            >
              <app-landing-icon name="plus" svgClass="h-7 w-7" />
            </span>
            Aufgeben
          </button>
          <button
            type="button"
            class="relative flex min-h-12 flex-col items-center justify-center gap-0.5 text-[11px] font-medium"
            [class]="nachrichtenActive() ? 'text-[#1b3a5f]' : 'text-slate-500'"
            (click)="goKonto('/konto/nachrichten')"
          >
            <app-landing-icon name="chat" svgClass="h-5 w-5" />
            Nachrichten
            @if (auth.isAuthenticated() && messages.unreadCount() > 0) {
              <span class="absolute right-[28%] top-1 h-2 w-2 rounded-full bg-[#2f9e57]"></span>
            }
          </button>
          <button
            type="button"
            class="flex min-h-12 flex-col items-center justify-center gap-0.5 text-[11px] font-medium"
            [class]="kontoActive() ? 'text-[#1b3a5f]' : 'text-slate-500'"
            (click)="goKonto('/konto')"
          >
            <app-landing-icon name="user" svgClass="h-5 w-5" />
            {{ auth.isAuthenticated() ? 'Konto' : 'Anmelden' }}
          </button>
        </div>
      </nav>
    }
  `,
})
export class LandingHeaderComponent {
  readonly auth = inject(AuthService);
  readonly messages = inject(SellerMessagesService);
  readonly standort = inject(StandortService);
  private readonly router = inject(Router);
  private readonly host = inject(ElementRef<HTMLElement>);
  private readonly document = inject(DOCUMENT);

  readonly menuOpen = signal(false);
  query = '';

  private readonly url = toSignal(
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd),
      map(() => this.router.url)
    ),
    { initialValue: this.router.url }
  );

  constructor() {
    this.document.body.classList.add('has-mobile-tabbar');
    inject(DestroyRef).onDestroy(() => this.document.body.classList.remove('has-mobile-tabbar'));
    this.syncFromUrl(this.router.url);
    this.router.events
      .pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd),
        takeUntilDestroyed()
      )
      .subscribe((event) => this.syncFromUrl(event.urlAfterRedirects));
  }

  anzeigenActive(): boolean {
    const url = this.url();
    return url.startsWith('/anzeigen') && !this.kostenlosActive() && !this.servicesActive();
  }

  servicesActive(): boolean {
    const url = this.url();
    return url.startsWith('/services') || url.startsWith('/anzeigen/dienstleistungen');
  }

  kostenlosActive(): boolean {
    const url = this.url();
    return url.startsWith('/kostenlos') || url.includes('kostenlos=1') || url.includes('price=0');
  }

  startActive(): boolean {
    const path = this.url().split('?')[0];
    return path === '/' || path === '';
  }

  searchActive(): boolean {
    const path = this.url().split('?')[0];
    return (
      path.startsWith('/anzeigen') ||
      path.startsWith('/services') ||
      path.startsWith('/kostenlos')
    );
  }

  aufgebenActive(): boolean {
    return this.url().includes('/meine-anzeigen/neu') || this.url().includes('/bearbeiten');
  }

  nachrichtenActive(): boolean {
    return this.url().startsWith('/konto/nachrichten');
  }

  kontoActive(): boolean {
    const url = this.url();
    return url.startsWith('/konto') && !this.nachrichtenActive() && !this.aufgebenActive();
  }

  authScreen(): boolean {
    const path = this.url().split('?')[0];
    return (
      path === '/login' ||
      path === '/register' ||
      path === '/forgot-password' ||
      path === '/check-email' ||
      path === '/verify' ||
      path === '/verify-email' ||
      path === '/reset-password'
    );
  }

  get displayName(): string {
    return this.auth.currentUser()?.firstName || 'Konto';
  }

  search(): void {
    const q = this.query.trim();
    const current = this.router.parseUrl(this.router.url).queryParams;
    void this.router.navigate(['/anzeigen'], {
      queryParams: {
        ...listingFilterQuery(current),
        q: q || null,
        ...this.standort.queryParams(),
      },
    });
  }

  chooseStandort(value: StandortValue): void {
    this.standort.set(value);
    const path = this.listingsPath();
    if (path.length === 0) {
      return;
    }
    const current = this.router.parseUrl(this.router.url).queryParams;
    const keepSearch = this.isListingsView();
    void this.router.navigate(path, {
      queryParams: {
        ...listingFilterQuery(current),
        q: keepSearch ? current['q'] || null : null,
        ort: value || null,
        km: keepSearch && value && hasCoordinates(value) ? current['km'] || null : null,
      },
    });
  }

  goAufgeben(): void {
    this.goKonto('/konto/meine-anzeigen/neu');
  }

  goKonto(path: string): void {
    if (this.auth.isAdmin()) {
      void this.router.navigateByUrl('/admin');
      return;
    }
    if (this.auth.isAuthenticated()) {
      void this.router.navigateByUrl(path);
      return;
    }
    void this.router.navigate(['/login'], { queryParams: { returnUrl: path } });
  }

  toggleMenu(event: Event): void {
    event.stopPropagation();
    this.menuOpen.update((open) => !open);
  }

  closeMenu(): void {
    this.menuOpen.set(false);
  }

  onDocumentClick(event: Event): void {
    if (!this.host.nativeElement.contains(event.target as Node)) {
      this.closeMenu();
    }
  }

  logout(): void {
    this.closeMenu();
    this.auth.logout();
    void this.router.navigateByUrl('/');
  }

  private isListingsView(): boolean {
    const path = this.router.url.split('?')[0];
    if (path.startsWith('/services') || path.startsWith('/kostenlos') || path === '/anzeigen') {
      return true;
    }
    if (path.startsWith('/anzeigen/')) {
      return !!categoryBySlug(path.split('/')[2] ?? '');
    }
    return false;
  }

  private listingsPath(): string[] {
    const path = this.router.url.split('?')[0];
    if (path.startsWith('/services')) {
      return ['/services'];
    }
    if (path.startsWith('/kostenlos')) {
      return ['/kostenlos'];
    }
    if (path.startsWith('/anzeigen/')) {
      const slug = path.split('/')[2] ?? '';
      return categoryBySlug(slug) ? ['/anzeigen', slug] : ['/anzeigen'];
    }
    if (path.startsWith('/anzeigen')) {
      return ['/anzeigen'];
    }
    if (path === '/' || path === '') {
      return ['/anzeigen'];
    }
    return [];
  }

  private syncFromUrl(url: string): void {
    const params = this.router.parseUrl(url).queryParams;
    this.query = params['q'] ?? '';
    if (this.isListingsView()) {
      this.standort.set(parseStandort(params['ort']));
    }
  }
}
