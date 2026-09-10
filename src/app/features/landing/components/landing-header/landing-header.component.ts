import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { BrandMarkComponent } from '../brand-mark/brand-mark.component';
import { LandingIconComponent } from '../landing-icon/landing-icon.component';

@Component({
  selector: 'app-landing-header',
  standalone: true,
  imports: [RouterLink, BrandMarkComponent, LandingIconComponent],
  template: `
    <header class="sticky top-0 z-30 border-b border-slate-100 bg-white">
      <div
        class="container grid grid-cols-1 items-center gap-3 px-4 py-3 md:px-8 lg:grid-cols-[auto_1fr_auto]"
      >
        <app-brand-mark />

        <nav
          class="hidden items-center justify-center gap-7 text-sm font-medium text-slate-700 lg:flex"
        >
          <a href="#standort" class="inline-flex items-center gap-1.5 hover:text-[#1b3a5f]">
            <app-landing-icon name="pin" svgClass="h-4 w-4" />
            Standort wählen
          </a>
          <a href="#kategorien" class="inline-flex items-center gap-1 hover:text-[#1b3a5f]">
            Kategorien
            <svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 9l6 6 6-6" />
            </svg>
          </a>
          <a href="#services" class="hover:text-[#1b3a5f]">Services</a>
          <a href="#kostenlos" class="hover:text-[#1b3a5f]">Zu verschenken</a>
        </nav>

        <div class="flex items-center justify-end gap-2 sm:gap-3">
          <a
            class="hidden cursor-pointer items-center gap-1.5 px-2 py-2 text-sm font-medium text-slate-700 hover:text-[#1b3a5f] md:inline-flex"
            (click)="openMerkliste($event)"
          >
            <app-landing-icon name="heart" svgClass="h-4 w-4" />
            Merkliste
          </a>
          @if (auth.isAuthenticated()) {
            <a
              [routerLink]="auth.homePath()"
              class="inline-flex items-center gap-1.5 px-2 py-2 text-sm font-medium text-slate-700 hover:text-[#1b3a5f]"
            >
              <app-landing-icon name="user" svgClass="h-4 w-4" />
              Konto
            </a>
          } @else {
            <a
              routerLink="/auth/login"
              class="inline-flex items-center gap-1.5 px-2 py-2 text-sm font-medium text-slate-700 hover:text-[#1b3a5f]"
            >
              <app-landing-icon name="user" svgClass="h-4 w-4" />
              Anmelden
            </a>
          }
          <button
            type="button"
            class="rounded-lg bg-[#f5c400] px-4 py-2.5 text-sm font-semibold text-slate-900 hover:bg-[#e0b400]"
            (click)="postAd()"
          >
            Anzeige aufgeben
          </button>
        </div>
      </div>
    </header>
  `,
})
export class LandingHeaderComponent {
  readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  openMerkliste(event: Event): void {
    event.preventDefault();
    if (this.auth.isAdmin()) {
      void this.router.navigateByUrl('/admin');
      return;
    }
    if (this.auth.isAuthenticated()) {
      void this.router.navigateByUrl('/konto');
      return;
    }
    void this.router.navigate(['/auth/login'], {
      queryParams: { returnUrl: '/konto' },
    });
  }

  postAd(): void {
    if (this.auth.isAdmin()) {
      void this.router.navigateByUrl('/admin');
      return;
    }
    if (this.auth.isAuthenticated()) {
      void this.router.navigateByUrl('/seller/listings/new');
      return;
    }
    void this.router.navigate(['/auth/register'], {
      queryParams: { returnUrl: '/seller/listings/new' },
    });
  }
}
