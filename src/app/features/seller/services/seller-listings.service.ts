import { Injectable, computed, signal } from '@angular/core';
import {
  INITIAL_SELLER_LISTINGS,
  SELLER_SALES_COUNT,
  type ListingStatus,
  type SellerListing,
} from '../data/seller.content';

const LISTINGS_STORAGE_KEY = 'nimmda.seller.listings';

@Injectable({ providedIn: 'root' })
export class SellerListingsService {
  private readonly listingsSignal = signal<SellerListing[]>(this.readStoredListings());

  readonly listings = this.listingsSignal.asReadonly();
  readonly salesCount = SELLER_SALES_COUNT;
  readonly activeCount = computed(
    () => this.listingsSignal().filter((item) => item.status === 'aktiv').length
  );
  readonly pausedCount = computed(
    () => this.listingsSignal().filter((item) => item.status === 'pausiert').length
  );
  readonly totalViews = computed(() =>
    this.listingsSignal().reduce((sum, item) => sum + item.views, 0)
  );
  readonly totalChats = computed(() =>
    this.listingsSignal().reduce((sum, item) => sum + item.chats, 0)
  );

  add(input: { title: string; price: number; imageSrc?: string; category?: string }): void {
    const listing: SellerListing = {
      id: crypto.randomUUID(),
      title: input.title,
      price: input.price,
      views: 0,
      chats: 0,
      status: 'aktiv',
      imageSrc: input.imageSrc ?? '/assets/images/Furniture.png',
      category: input.category,
    };
    this.listingsSignal.update((items) => [listing, ...items]);
    this.persist();
  }

  setStatus(id: string, status: ListingStatus): void {
    this.listingsSignal.update((items) =>
      items.map((item) => (item.id === id ? { ...item, status } : item))
    );
    this.persist();
  }

  private persist(): void {
    sessionStorage.setItem(LISTINGS_STORAGE_KEY, JSON.stringify(this.listingsSignal()));
  }

  private readStoredListings(): SellerListing[] {
    try {
      const raw = sessionStorage.getItem(LISTINGS_STORAGE_KEY);
      return raw ? (JSON.parse(raw) as SellerListing[]) : INITIAL_SELLER_LISTINGS;
    } catch {
      return INITIAL_SELLER_LISTINGS;
    }
  }
}
