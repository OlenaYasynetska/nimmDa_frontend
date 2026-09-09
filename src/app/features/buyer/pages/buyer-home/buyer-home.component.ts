import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BuyerActivityService } from '../../services/buyer-activity.service';
import { SellerMessagesService } from '../../../seller/services/seller-messages.service';
import type { MarketplaceListing } from '../../../marketplace/data/marketplace.content';

@Component({
  selector: 'app-buyer-home',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="space-y-8">
      <section class="rounded-2xl bg-white p-5 shadow-sm">
        <h2 class="text-lg font-bold text-slate-800">Merkliste</h2>
        <p class="mt-1 text-sm text-slate-500">Anzeigen, die du dir merken möchtest.</p>
        @if (activity.favorites().length === 0) {
          <p class="mt-4 text-sm text-slate-400">Noch keine Favoriten. Tippe aufs Herz bei einer Anzeige.</p>
        } @else {
          <ul class="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            @for (item of activity.favorites(); track item.id) {
              <li>
                <a [routerLink]="['/anzeigen/artikel', item.id]" class="flex gap-3 rounded-xl bg-slate-50 p-3 hover:bg-slate-100">
                  <img [src]="item.imageSrc" [alt]="item.title" class="h-16 w-16 rounded-lg object-cover" />
                  <span class="min-w-0">
                    <span class="block truncate font-semibold text-slate-800">{{ item.title }}</span>
                    <span class="text-sm text-[#2f9e57]">{{ price(item) }}</span>
                  </span>
                </a>
              </li>
            }
          </ul>
        }
      </section>

      <section class="rounded-2xl bg-white p-5 shadow-sm">
        <h2 class="text-lg font-bold text-slate-800">Zuletzt angesehen</h2>
        <p class="mt-1 text-sm text-slate-500">Dein Verlauf bleibt erhalten.</p>
        @if (activity.viewed().length === 0) {
          <p class="mt-4 text-sm text-slate-400">Noch keine angesehenen Anzeigen.</p>
        } @else {
          <ul class="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            @for (item of activity.viewed(); track item.id) {
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

      <section class="rounded-2xl bg-white p-5 shadow-sm">
        <div class="mb-4 flex items-center justify-between">
          <h2 class="text-lg font-bold text-slate-800">Nachrichten</h2>
          <a routerLink="/konto/nachrichten" class="text-sm font-medium text-[#2f6fb2] hover:underline">Alle anzeigen</a>
        </div>
        @if (messages.threads().length === 0) {
          <p class="text-sm text-slate-400">Noch keine Nachrichten. Öffne eine Anzeige und kontaktiere den Verkäufer.</p>
        } @else {
          <ul class="divide-y divide-slate-100">
            @for (thread of messages.threads(); track thread.id) {
              <li>
                <a
                  routerLink="/konto/nachrichten"
                  [queryParams]="{ thread: thread.id }"
                  class="block py-3 hover:bg-slate-50"
                >
                  <p class="font-semibold text-slate-800">{{ thread.productTitle }}</p>
                  <p class="truncate text-sm text-slate-600">{{ thread.preview }}</p>
                  <p class="mt-1 text-xs text-slate-400">{{ thread.time }}</p>
                </a>
              </li>
            }
          </ul>
        }
      </section>
    </div>
  `,
})
export class BuyerHomeComponent {
  readonly activity = inject(BuyerActivityService);
  readonly messages = inject(SellerMessagesService);

  price(item: MarketplaceListing): string {
    return item.price === 0 ? 'Kostenlos' : `€ ${item.price}`;
  }
}
