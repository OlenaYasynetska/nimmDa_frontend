import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LANDING_BRAND } from '../../data/landing.content';

@Component({
  selector: 'app-landing-header',
  standalone: true,
  imports: [RouterLink],
  template: `
    <header class="sticky top-0 z-30 border-b border-slate-100 bg-white">
      <div class="container flex flex-wrap items-center justify-between gap-3 px-4 py-3 md:px-8">
        <a routerLink="/" class="flex min-w-0 items-center gap-2.5">
          <img
            src="/assets/icons/logo.svg"
            alt=""
            class="h-10 w-10 shrink-0"
            width="40"
            height="40"
          />
          <span class="truncate text-base font-semibold text-slate-800 md:text-lg">
            {{ brand }}
          </span>
        </a>
        <nav class="flex shrink-0 items-center gap-2 sm:gap-3">
          <a
            routerLink="/auth/login"
            class="px-2 py-2 text-sm font-medium text-slate-700 hover:text-slate-900"
          >
            Anmelden
          </a>
          <a
            routerLink="/auth/register"
            class="rounded-md bg-[#2f6fb2] px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#275d96] sm:px-4"
          >
            Registrieren
          </a>
          <a
            routerLink="/auth/register"
            class="rounded-md bg-[#e8b423] px-3 py-2 text-sm font-semibold text-slate-900 shadow-sm hover:bg-[#d4a41a] sm:px-4"
          >
            Anzeige aufgeben
          </a>
        </nav>
      </div>
    </header>
  `,
})
export class LandingHeaderComponent {
  readonly brand = LANDING_BRAND;
}
