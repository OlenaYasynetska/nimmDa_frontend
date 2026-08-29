import { Injectable, computed, inject } from '@angular/core';
import { SellerListingsService } from '../../seller/services/seller-listings.service';
import { MARKETPLACE_LISTINGS, type MarketplaceListing } from '../data/marketplace.content';

@Injectable({ providedIn: 'root' })
export class MarketplaceListingsService {
  private readonly sellerListings = inject(SellerListingsService);

  readonly all = computed(() => this.merge());

  forCategory(categoryName: string | null): MarketplaceListing[] {
    const listings = this.all();
    if (!categoryName) {
      return listings;
    }
    return listings.filter((item) => item.category === categoryName);
  }

  private merge(): MarketplaceListing[] {
    const fromSellers: MarketplaceListing[] = this.sellerListings
      .listings()
      .filter((item) => item.status === 'aktiv')
      .map((item) => ({
        id: `seller-${item.id}`,
        title: item.title,
        price: item.price,
        imageSrc: item.imageSrc,
        category: item.category || 'Möbel & Haushalt',
        location: 'Linz',
      }));

    const sellerTitles = new Set(fromSellers.map((item) => item.title));
    const published = MARKETPLACE_LISTINGS.filter((item) => !sellerTitles.has(item.title));
    return [...fromSellers, ...published];
  }
}
