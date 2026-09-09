import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { LandingHeaderComponent } from '../../landing/components/landing-header/landing-header.component';
import { LandingFooterComponent } from '../../landing/components/landing-footer/landing-footer.component';

@Component({
  selector: 'app-buyer-layout',
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
          <h1 class="text-2xl font-extrabold text-[#1b3a5f]">Hallo, {{ greeting }}!</h1>
          <p class="mt-1 text-sm text-slate-500">Dein Käuferbereich: Merkliste, Verlauf und Anfragen.</p>
        </div>
        @if (auth.canSell()) {
          <a
            routerLink="/seller"
            class="rounded-lg bg-[#2f9e57] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#278a4b]"
          >
            Zum Verkäufer-Dashboard
          </a>
        }
      </div>
      <nav class="mb-6 flex gap-2 text-sm">
        <a
          routerLink="/konto"
          routerLinkActive="bg-[#1b3a5f] text-white"
          [routerLinkActiveOptions]="{ exact: true }"
          class="rounded-full bg-white px-3 py-1.5 font-medium text-slate-700 ring-1 ring-slate-200"
        >
          Übersicht
        </a>
        <a
          routerLink="/konto/nachrichten"
          routerLinkActive="bg-[#1b3a5f] text-white"
          class="rounded-full bg-white px-3 py-1.5 font-medium text-slate-700 ring-1 ring-slate-200"
        >
          Nachrichten
        </a>
      </nav>
      <router-outlet />
    </main>
    <app-landing-footer />
  `,
})
export class BuyerLayoutComponent {
  readonly auth = inject(AuthService);

  get greeting(): string {
    return this.auth.currentUser()?.firstName || 'Käufer';
  }
}
