import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { LandingFooterComponent } from '../../landing/components/landing-footer/landing-footer.component';
import { LandingHeaderComponent } from '../../landing/components/landing-header/landing-header.component';
import { KONTO_NAV } from '../data/konto.nav';

@Component({
  selector: 'app-konto-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, LandingHeaderComponent, LandingFooterComponent],
  host: {
    class: 'block min-h-full w-full bg-[#f3f5f8]',
  },
  template: `
    <app-landing-header />
    <main class="container px-4 py-8 md:px-8">
      <div class="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p class="text-xs font-semibold uppercase tracking-wide text-slate-400">Mein Konto</p>
          <h1 class="text-2xl font-extrabold text-[#1b3a5f]">Hallo, {{ greeting }}!</h1>
          <p class="mt-1 text-sm text-slate-500">Kaufen, verkaufen und Nachrichten — alles an einem Ort.</p>
        </div>
      </div>
      <nav class="mb-6 flex flex-wrap gap-2 text-sm">
        @for (item of nav; track item.path) {
          <a
            [routerLink]="item.path"
            routerLinkActive="bg-[#1b3a5f] text-white"
            [routerLinkActiveOptions]="{ exact: !!item.exact }"
            class="rounded-full bg-white px-3 py-1.5 font-medium text-slate-700 ring-1 ring-slate-200"
          >
            {{ item.label }}
          </a>
        }
      </nav>
      <router-outlet />
    </main>
    <app-landing-footer />
  `,
})
export class KontoLayoutComponent {
  readonly nav = KONTO_NAV;
  private readonly auth = inject(AuthService);

  get greeting(): string {
    return this.auth.currentUser()?.firstName || 'Mitglied';
  }
}
