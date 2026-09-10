import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BuyerActivityService } from '../../../buyer/services/buyer-activity.service';
import type { MarketplaceListing } from '../../../marketplace/data/marketplace.content';

@Component({
  selector: 'app-konto-favorites',
  standalone: true,
  imports: [RouterLink],
  template: `
    <section class="rounded-2xl bg-white p-5 shadow-sm">
      <h2 class="text-lg font-bold text-slate-800">Favoriten</h2>
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
  `,
})
export class KontoFavoritesComponent {
  readonly activity = inject(BuyerActivityService);

  price(item: MarketplaceListing): string {
    return item.price === 0 ? 'Kostenlos' : `€ ${item.price}`;
  }
}
