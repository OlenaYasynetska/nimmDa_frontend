import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PhotoSliderComponent } from '../../../marketplace/components/photo-slider/photo-slider.component';
import { listingPhotos } from '../../../marketplace/data/listing-photos';
import { categoryByName, categoryListingsPath } from '../../data/landing.content';
import { listingDescriptionPreview } from '../../../marketplace/data/listing-text';
import type { MarketplaceListing } from '../../../marketplace/data/marketplace.content';
import { MarketplaceListingsService } from '../../../marketplace/services/marketplace-listings.service';
import { StandortService } from '../../../marketplace/services/standort.service';

@Component({
  selector: 'app-latest-listings',
  standalone: true,
  imports: [RouterLink, PhotoSliderComponent],
  template: `
    @if (listings().length > 0) {
      <section class="container px-4 pb-12 md:px-8" aria-labelledby="neueste-anzeigen">
        <h2 id="neueste-anzeigen" class="text-2xl font-extrabold text-[#1b3a5f] md:text-3xl">Neueste Anzeigen</h2>
        <ul class="mt-6 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4">
          @for (item of listings(); track item.id) {
            <li class="flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 transition hover:-translate-y-0.5 hover:shadow-md">
              <app-photo-slider
                [photos]="photos(item)"
                [alt]="item.title"
                [link]="['/anzeigen', item.id]"
                imageClass="h-36 w-full object-cover sm:h-44"
              />
              <a [routerLink]="['/anzeigen', item.id]" class="block min-w-0">
                <div class="p-3 sm:p-4">
                  <p class="truncate font-semibold text-slate-800">{{ item.title }}</p>
                  <p class="mt-1 text-base font-extrabold text-[#2f9e57] sm:text-lg">
                    @if (item.price === 0) {
                      Kostenlos
                    } @else {
                      € {{ item.price }}
                    }
                  </p>
                  <p class="mt-1 truncate text-xs text-slate-400">{{ item.location }}</p>
                  @if (item.description) {
                    <p class="mt-2 line-clamp-2 text-sm text-slate-600">{{ preview(item.description) }}</p>
                  }
                </div>
              </a>
              @if (categoryPath(item.category); as path) {
                <a
                  [routerLink]="path"
                  [queryParams]="standort.queryParams()"
                  class="mt-auto px-3 pb-3 text-xs font-medium text-[#2f6fb2] hover:underline sm:px-4 sm:pb-4"
                >
                  {{ item.category }}
                </a>
              } @else {
                <p class="mt-auto px-3 pb-3 text-xs text-slate-400 sm:px-4 sm:pb-4">{{ item.category }}</p>
              }
            </li>
          }
        </ul>
      </section>
    }
  `,
})
export class LatestListingsComponent {
  private readonly marketplace = inject(MarketplaceListingsService);
  readonly standort = inject(StandortService);
  readonly listings = signal<MarketplaceListing[]>([]);

  constructor() {
    void this.load();
  }

  photos(item: { imageSrc?: string; images?: string[] | null }): string[] {
    return listingPhotos(item);
  }

  preview(text: string): string {
    return listingDescriptionPreview(text);
  }

  categoryPath(name: string): string | null {
    const category = categoryByName(name);
    return category ? categoryListingsPath(category) : null;
  }

  private async load(): Promise<void> {
    const page = await this.marketplace.search({
      sort: 'posted',
      page: 0,
      size: 12,
    });
    const ordered = [...page.content].sort((left, right) => postedAt(right) - postedAt(left));
    this.listings.set(ordered.slice(0, 12));
  }
}

function postedAt(item: MarketplaceListing): number {
  const value = item.createdAt ? Date.parse(item.createdAt) : Number.NaN;
  return Number.isFinite(value) ? value : 0;
}
