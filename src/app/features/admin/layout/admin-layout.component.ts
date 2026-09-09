import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { BrandMarkComponent } from '../../landing/components/brand-mark/brand-mark.component';
import { LandingIconComponent } from '../../landing/components/landing-icon/landing-icon.component';
import { ADMIN_NAV } from '../data/admin.content';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, BrandMarkComponent, LandingIconComponent],
  host: {
    class: 'flex h-dvh min-h-0 flex-col bg-[#f3f5f8]',
  },
  template: `
    <header class="flex h-16 shrink-0 items-center gap-4 border-b border-slate-200 bg-white px-4 md:px-6">
      <app-brand-mark [compact]="true" link="/admin" />
      <div class="relative hidden min-w-0 flex-1 md:block">
        <input
          type="search"
          placeholder="Suche auf NimmDa..."
          class="w-full max-w-xl rounded-xl border-0 bg-slate-100 py-2.5 pl-10 pr-3 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-200"
        />
        <app-landing-icon
          name="search"
          svgClass="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
        />
      </div>
      <div class="ml-auto flex items-center gap-4 text-sm text-slate-600">
        <span class="hidden font-semibold text-[#1b3a5f] sm:inline">Super Admin</span>
        <button
          type="button"
          class="rounded-lg bg-slate-100 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-200"
          (click)="logout()"
        >
          Abmelden
        </button>
      </div>
    </header>

    <div class="flex min-h-0 flex-1">
      <aside class="hidden w-60 shrink-0 overflow-y-auto border-r border-slate-200 bg-white px-3 py-4 md:flex md:flex-col">
        <nav class="flex flex-1 flex-col gap-1 text-sm">
          @for (item of nav; track item.path) {
            <a
              [routerLink]="item.path"
              routerLinkActive="bg-[#eaf8ef] font-semibold text-[#2f9e57]"
              [routerLinkActiveOptions]="{ exact: !!item.exact }"
              class="block rounded-lg px-3 py-2 text-slate-700 hover:bg-slate-50"
            >
              {{ item.label }}
            </a>
          }
        </nav>
        <a routerLink="/" class="mt-4 rounded-lg px-3 py-2 text-sm font-medium text-[#2f6fb2] hover:bg-slate-50">
          Zum Marktplatz
        </a>
      </aside>
      <main class="min-h-0 flex-1 overflow-y-auto p-4 md:p-6">
        <router-outlet />
      </main>
    </div>
  `,
})
export class AdminLayoutComponent {
  readonly nav = ADMIN_NAV;
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  logout(): void {
    this.auth.logout();
    void this.router.navigateByUrl('/auth/login');
  }
}
