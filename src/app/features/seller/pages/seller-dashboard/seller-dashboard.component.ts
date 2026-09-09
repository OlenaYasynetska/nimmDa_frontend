import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { SellerListingsService } from '../../services/seller-listings.service';
import { SellerMessagesService } from '../../services/seller-messages.service';

@Component({
  selector: 'app-seller-dashboard',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="mx-auto flex max-w-7xl flex-col gap-6">
      <div class="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 class="text-2xl font-extrabold text-[#1b3a5f]">Hallo, {{ greetingName }}! 👋</h1>
          <p class="mt-1 text-sm text-slate-500">Dein Verkäufer-Dashboard.</p>
        </div>
        <a
          routerLink="/seller/listings/new"
          class="inline-flex items-center gap-1 rounded-lg bg-[#2f9e57] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#278a4b]"
        >
          Anzeige erstellen +
        </a>
      </div>

      <div class="grid grid-cols-2 gap-3 md:grid-cols-4">
        <article class="rounded-2xl bg-white p-4 shadow-sm">
          <p class="text-xs font-medium text-slate-500">Anzeigen aktiv</p>
          <p class="mt-1 text-2xl font-extrabold text-[#2f9e57]">{{ listings.activeCount() }}</p>
        </article>
        <article class="rounded-2xl bg-white p-4 shadow-sm">
          <p class="text-xs font-medium text-slate-500">Aufrufe</p>
          <p class="mt-1 text-2xl font-extrabold text-[#6f4ea1]">{{ listings.totalViews() }}</p>
        </article>
        <article class="rounded-2xl bg-white p-4 shadow-sm">
          <p class="text-xs font-medium text-slate-500">Anfragen</p>
          <p class="mt-1 text-2xl font-extrabold text-[#d97706]">{{ listings.totalChats() }}</p>
        </article>
        <article class="rounded-2xl bg-white p-4 shadow-sm">
          <p class="text-xs font-medium text-slate-500">Verkäufe</p>
          <p class="mt-1 text-2xl font-extrabold text-[#2f6fb2]">{{ listings.salesCount }}</p>
        </article>
      </div>

      <section class="rounded-2xl bg-white p-5 shadow-sm">
        <div class="mb-4 flex items-center justify-between">
          <h2 class="text-lg font-bold text-slate-800">Aktuelle Anzeigen</h2>
          <a routerLink="/seller/listings/new" class="text-sm font-medium text-[#2f6fb2] hover:underline">
            Neue Anzeige
          </a>
        </div>
        @if (listings.listings().length === 0) {
          <p class="text-sm text-slate-400">Noch keine Anzeigen. Erstelle deine erste Anzeige.</p>
        } @else {
          <ul class="divide-y divide-slate-100">
            @for (item of listings.listings(); track item.id) {
              <li class="flex items-center gap-3 py-3">
                <img [src]="item.imageSrc" [alt]="item.title" class="h-14 w-14 rounded-lg bg-slate-100 object-cover" />
                <div class="min-w-0 flex-1">
                  <p class="truncate font-semibold text-slate-800">{{ item.title }}</p>
                  <p class="text-sm text-slate-500">€ {{ item.price }} · {{ item.views }} Aufrufe · {{ item.chats }} Chats</p>
                </div>
                <span
                  class="rounded-full px-2.5 py-1 text-xs font-semibold"
                  [class]="item.status === 'aktiv' ? 'bg-[#eaf8ef] text-[#2f9e57]' : 'bg-orange-100 text-orange-700'"
                >
                  {{ item.status === 'aktiv' ? 'Aktiv' : 'Pausiert' }}
                </span>
                <details class="relative">
                  <summary class="cursor-pointer list-none rounded-md px-2 py-1 text-lg leading-none text-slate-400 hover:bg-slate-50 hover:text-slate-700">
                    ⋮
                  </summary>
                  <div class="absolute right-0 z-10 mt-1 w-36 rounded-lg border border-slate-100 bg-white py-1 shadow-md">
                    <button
                      type="button"
                      class="block w-full px-3 py-1.5 text-left text-sm text-slate-700 hover:bg-slate-50"
                      (click)="toggleStatus(item.id, item.status)"
                    >
                      {{ item.status === 'aktiv' ? 'Pausieren' : 'Aktivieren' }}
                    </button>
                  </div>
                </details>
              </li>
            }
          </ul>
        }
      </section>

      <section class="rounded-2xl bg-white p-5 shadow-sm">
        <div class="mb-4 flex items-center justify-between">
          <h2 class="text-lg font-bold text-slate-800">Letzte Nachrichten</h2>
          <a routerLink="/seller/messages" class="text-sm font-medium text-[#2f6fb2] hover:underline">Alle anzeigen</a>
        </div>
        @if (messages.threads().length === 0) {
          <p class="text-sm text-slate-400">Noch keine Nachrichten.</p>
        } @else {
          <ul class="divide-y divide-slate-100">
            @for (thread of messages.threads(); track thread.id) {
              <li>
                <a
                  routerLink="/seller/messages"
                  [queryParams]="{ thread: thread.id }"
                  class="flex items-start gap-3 py-3 hover:bg-slate-50"
                >
                  <span class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-200 text-xs font-bold text-slate-700">
                    {{ thread.initials }}
                  </span>
                  <div class="min-w-0 flex-1">
                    <div class="flex items-center justify-between gap-2">
                      <p class="font-semibold text-slate-800">{{ thread.buyerName }}</p>
                      <span class="text-xs text-slate-400">{{ thread.time }}</span>
                    </div>
                    <p class="truncate text-xs text-slate-500">{{ thread.productTitle }}</p>
                    <p class="truncate text-sm text-slate-600">{{ thread.preview }}</p>
                  </div>
                </a>
              </li>
            }
          </ul>
        }
      </section>
    </div>
  `,
})
export class SellerDashboardComponent {
  readonly listings = inject(SellerListingsService);
  readonly messages = inject(SellerMessagesService);
  private readonly auth = inject(AuthService);

  get greetingName(): string {
    return this.auth.currentUser()?.firstName || 'Verkäufer';
  }

  async toggleStatus(id: string, status: 'aktiv' | 'pausiert'): Promise<void> {
    await this.listings.setStatus(id, status === 'aktiv' ? 'pausiert' : 'aktiv');
  }
}
