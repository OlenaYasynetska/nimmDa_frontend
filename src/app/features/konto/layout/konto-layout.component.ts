import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
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
    <main class="container px-4 py-6 md:px-8 md:py-8">
      <nav class="-mx-1 mb-6 flex gap-2 overflow-x-auto px-1 pb-1 text-sm md:mb-8 md:flex-wrap">
        @for (item of nav; track item.path) {
          <a
            [routerLink]="item.path"
            routerLinkActive="bg-[#1b3a5f] text-white"
            [routerLinkActiveOptions]="{ exact: !!item.exact }"
            class="shrink-0 rounded-full bg-white px-3 py-1.5 font-medium text-slate-700 ring-1 ring-slate-200"
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
}
