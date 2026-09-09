import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { BrandMarkComponent } from '../../landing/components/brand-mark/brand-mark.component';
import { LandingIconComponent } from '../../landing/components/landing-icon/landing-icon.component';
import { SELLER_NAV } from '../data/seller.content';
import { SellerMessagesService } from '../services/seller-messages.service';

@Component({
  selector: 'app-seller-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, BrandMarkComponent, LandingIconComponent],
  host: {
    class: 'flex h-dvh min-h-0 flex-col bg-[#f3f5f8]',
  },
  template: `
    <header class="flex h-16 shrink-0 items-center gap-4 border-b border-slate-200 bg-white px-4 md:px-6">
      <app-brand-mark [compact]="true" link="/seller" />
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
        <span class="hidden items-center gap-1 text-slate-500 lg:inline-flex">
          <app-landing-icon name="pin" svgClass="h-4 w-4" />
          Oberösterreich
        </span>
        <a routerLink="/seller/messages" class="text-slate-600 hover:text-slate-900" aria-label="Nachrichten">
          <app-landing-icon name="chat" svgClass="h-5 w-5" />
        </a>
        <span class="relative" aria-label="Benachrichtigungen">
          <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 17h5l-1.4-1.4A2 2 0 0118 14.2V11a6 6 0 10-12 0v3.2a2 2 0 01-.6 1.4L4 17h5m6 0a3 3 0 11-6 0h6z" />
          </svg>
          @if (messages.unreadCount() > 0) {
            <span class="absolute -right-1.5 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
              {{ messages.unreadCount() }}
            </span>
          }
        </span>
        <app-landing-icon name="heart" svgClass="h-5 w-5" />
        <div class="flex items-center gap-2 pl-1">
          <span class="flex h-8 w-8 items-center justify-center rounded-full bg-[#2f9e57] text-xs font-bold text-white">
            {{ initials }}
          </span>
          <div class="hidden leading-tight sm:block">
            <p class="font-semibold text-slate-800">{{ displayName }}</p>
            <p class="text-xs text-slate-500">Verkäufer</p>
          </div>
        </div>
      </div>
    </header>

    <div class="flex min-h-0 flex-1">
      <aside class="hidden w-60 shrink-0 overflow-y-auto border-r border-slate-200 bg-white px-3 py-4 md:flex md:flex-col">
        <nav class="flex flex-1 flex-col gap-5 text-sm">
          @for (group of nav; track group.title || 'overview') {
            <div>
              @if (group.title) {
                <p class="px-3 pb-1 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                  {{ group.title }}
                </p>
              }
              @for (item of group.items; track item.label) {
                @if (item.path && item.highlight !== false) {
                  <a
                    [routerLink]="item.path"
                    routerLinkActive="bg-[#eaf8ef] font-semibold text-[#2f9e57]"
                    [routerLinkActiveOptions]="{ exact: !!item.exact }"
                    class="block rounded-lg px-3 py-2 text-slate-700 hover:bg-slate-50"
                  >
                    {{ item.label }}
                  </a>
                } @else if (item.path) {
                  <a [routerLink]="item.path" class="block rounded-lg px-3 py-2 text-slate-700 hover:bg-slate-50">
                    {{ item.label }}
                  </a>
                } @else {
                  <span class="block rounded-lg px-3 py-2 text-slate-400">{{ item.label }}</span>
                }
              }
            </div>
          }
        </nav>
        <a routerLink="/" class="mt-4 rounded-lg px-3 py-2 text-sm font-medium text-[#2f6fb2] hover:bg-slate-50">
          Zum Marktplatz
        </a>
        @if (auth.canBuy()) {
          <a routerLink="/konto" class="rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
            Käuferbereich
          </a>
        }
      </aside>
      <main class="min-h-0 flex-1 overflow-y-auto p-4 md:p-6">
        <router-outlet />
      </main>
    </div>
  `,
})
export class SellerLayoutComponent {
  readonly auth = inject(AuthService);
  readonly messages = inject(SellerMessagesService);
  readonly nav = SELLER_NAV;

  get displayName(): string {
    const user = this.auth.currentUser();
    if (!user) {
      return 'Verkäufer';
    }
    return [user.firstName, user.lastName].filter(Boolean).join(' ') || user.email;
  }

  get initials(): string {
    const name = this.displayName;
    return name
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part.charAt(0).toUpperCase())
      .join('');
  }
}
