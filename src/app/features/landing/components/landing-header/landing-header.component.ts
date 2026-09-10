import { Component, ElementRef, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map } from 'rxjs';
import { AuthService } from '../../../../core/services/auth.service';
import { SellerMessagesService } from '../../../seller/services/seller-messages.service';
import { BrandMarkComponent } from '../brand-mark/brand-mark.component';
import { LandingIconComponent } from '../landing-icon/landing-icon.component';

@Component({
  selector: 'app-landing-header',
  standalone: true,
  imports: [RouterLink, FormsModule, BrandMarkComponent, LandingIconComponent],
  host: {
    '(document:click)': 'onDocumentClick($event)',
  },
  template: `
    <header class="sticky top-0 z-30 border-b border-slate-100 bg-white">
      <div class="container flex flex-wrap items-center gap-3 px-4 py-3 md:px-8">
        <app-brand-mark [compact]="true" />

        <nav class="flex items-center gap-4 text-sm font-medium text-slate-700 md:gap-6">
          <a routerLink="/anzeigen" class="hover:text-[#1b3a5f]" [class.text-[#1b3a5f]]="anzeigenActive()">
            Anzeigen
          </a>
          <a routerLink="/anzeigen" class="hover:text-[#1b3a5f]">Services</a>
          <a
            routerLink="/anzeigen"
            [queryParams]="{ kostenlos: '1' }"
            class="hover:text-[#1b3a5f]"
            [class.text-[#1b3a5f]]="kostenlosActive()"
          >
            Kostenlos
          </a>
        </nav>

        <form class="relative min-w-0 flex-1" (ngSubmit)="search()">
          <input
            type="search"
            name="q"
            [(ngModel)]="query"
            placeholder="Suche auf NimmDa..."
            class="w-full rounded-xl border-0 bg-slate-100 py-2.5 pl-10 pr-3 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-200"
          />
          <app-landing-icon
            name="search"
            svgClass="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
          />
        </form>

        <div class="ml-auto flex items-center gap-1 sm:gap-2">
          <button
            type="button"
            class="inline-flex items-center gap-1.5 rounded-lg px-2 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-[#1b3a5f]"
            (click)="goKonto('/konto/favoriten')"
          >
            <app-landing-icon name="heart" svgClass="h-4 w-4" />
            <span class="hidden sm:inline">Favoriten</span>
          </button>
          <button
            type="button"
            class="relative inline-flex items-center gap-1.5 rounded-lg px-2 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-[#1b3a5f]"
            (click)="goKonto('/konto/nachrichten')"
          >
            <app-landing-icon name="chat" svgClass="h-4 w-4" />
            <span class="hidden sm:inline">Nachrichten</span>
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
              routerLink="/auth/login"
              class="inline-flex items-center gap-1.5 px-2 py-2 text-sm font-medium text-slate-700 hover:text-[#1b3a5f]"
            >
              Anmelden
            </a>
          }
        </div>
      </div>
    </header>
  `,
})
export class LandingHeaderComponent {
  readonly auth = inject(AuthService);
  readonly messages = inject(SellerMessagesService);
  private readonly router = inject(Router);
  private readonly host = inject(ElementRef<HTMLElement>);

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
    this.query = this.router.parseUrl(this.router.url).queryParams['q'] ?? '';
  }

  anzeigenActive(): boolean {
    const url = this.url();
    return url.startsWith('/anzeigen') && !url.includes('kostenlos=1');
  }

  kostenlosActive(): boolean {
    return this.url().includes('kostenlos=1');
  }

  get displayName(): string {
    return this.auth.currentUser()?.firstName || 'Konto';
  }

  search(): void {
    const q = this.query.trim();
    void this.router.navigate(['/anzeigen'], { queryParams: q ? { q } : {} });
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
    void this.router.navigate(['/auth/login'], { queryParams: { returnUrl: path } });
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
}
