import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BuyerActivityService } from '../../../buyer/services/buyer-activity.service';
import { SellerListingsService } from '../../../seller/services/seller-listings.service';
import { SellerMessagesService } from '../../../seller/services/seller-messages.service';

@Component({
  selector: 'app-konto-overview',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="space-y-6">
      <div class="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <a routerLink="/konto/meine-anzeigen" class="rounded-2xl bg-white p-4 shadow-sm hover:bg-slate-50">
          <p class="text-xs font-medium text-slate-500">Meine Anzeigen</p>
          <p class="mt-1 text-2xl font-extrabold text-[#2f9e57]">{{ listings.activeCount() }}</p>
        </a>
        <a routerLink="/konto/nachrichten" class="rounded-2xl bg-white p-4 shadow-sm hover:bg-slate-50">
          <p class="text-xs font-medium text-slate-500">Nachrichten</p>
          <p class="mt-1 text-2xl font-extrabold text-[#1b3a5f]">{{ messages.threads().length }}</p>
        </a>
        <a routerLink="/konto/favoriten" class="rounded-2xl bg-white p-4 shadow-sm hover:bg-slate-50">
          <p class="text-xs font-medium text-slate-500">Favoriten</p>
          <p class="mt-1 text-2xl font-extrabold text-[#6f4ea1]">{{ activity.favorites().length }}</p>
        </a>
      </div>

      <section class="rounded-2xl bg-white p-5 shadow-sm">
        <div class="mb-4 flex items-center justify-between gap-3">
          <h2 class="text-lg font-bold text-slate-800">Meine Anzeigen</h2>
          <a routerLink="/konto/meine-anzeigen" class="text-sm font-medium text-[#2f6fb2] hover:underline">Alle anzeigen</a>
        </div>
        @if (listings.listings().length === 0) {
          <p class="text-sm text-slate-400">Noch keine Anzeigen. Lege die erste mit „Anzeige aufgeben“ an.</p>
        } @else {
          <ul class="divide-y divide-slate-100">
            @for (item of listings.listings().slice(0, 3); track item.id) {
              <li class="flex items-center gap-3 py-3">
                <img [src]="item.imageSrc" [alt]="item.title" class="h-14 w-14 rounded-lg bg-slate-100 object-cover" />
                <div class="min-w-0 flex-1">
                  <p class="truncate font-semibold text-slate-800">{{ item.title }}</p>
                  <p class="text-sm text-slate-500">€ {{ item.price }}</p>
                </div>
              </li>
            }
          </ul>
        }
      </section>

      <section class="rounded-2xl bg-white p-5 shadow-sm">
        <div class="mb-4 flex items-center justify-between gap-3">
          <h2 class="text-lg font-bold text-slate-800">Nachrichten</h2>
          <a routerLink="/konto/nachrichten" class="text-sm font-medium text-[#2f6fb2] hover:underline">Alle anzeigen</a>
        </div>
        @if (messages.threads().length === 0) {
          <p class="text-sm text-slate-400">Noch keine Nachrichten.</p>
        } @else {
          <ul class="divide-y divide-slate-100">
            @for (thread of messages.threads().slice(0, 3); track thread.id) {
              <li>
                <a
                  routerLink="/konto/nachrichten"
                  [queryParams]="{ thread: thread.id }"
                  class="flex items-start gap-3 py-3 hover:bg-slate-50"
                >
                  <span class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-200 text-xs font-bold text-slate-700">
                    {{ thread.initials }}
                  </span>
                  <div class="min-w-0 flex-1">
                    <p class="font-semibold text-slate-800">{{ thread.buyerName }}</p>
                    <p class="truncate text-sm text-slate-600">{{ thread.preview }}</p>
                  </div>
                </a>
              </li>
            }
          </ul>
        }
      </section>

      <section class="rounded-2xl bg-white p-5 shadow-sm">
        <h2 class="text-lg font-bold text-slate-800">Zuletzt angesehen</h2>
        @if (activity.viewed().length === 0) {
          <p class="mt-4 text-sm text-slate-400">Noch keine angesehenen Anzeigen.</p>
        } @else {
          <ul class="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            @for (item of activity.viewed().slice(0, 6); track item.id) {
              <li>
                <a [routerLink]="['/anzeigen/artikel', item.id]" class="flex gap-3 rounded-xl bg-slate-50 p-3 hover:bg-slate-100">
                  <img [src]="item.imageSrc" [alt]="item.title" class="h-16 w-16 rounded-lg object-cover" />
                  <span class="min-w-0">
                    <span class="block truncate font-semibold text-slate-800">{{ item.title }}</span>
                    <span class="text-sm text-slate-500">{{ item.category }}</span>
                  </span>
                </a>
              </li>
            }
          </ul>
        }
      </section>
    </div>
  `,
})
export class KontoOverviewComponent {
  readonly listings = inject(SellerListingsService);
  readonly messages = inject(SellerMessagesService);
  readonly activity = inject(BuyerActivityService);
}
