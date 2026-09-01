import { Injectable, computed, inject, signal } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import type { MarketplaceListing } from '../../marketplace/data/marketplace.content';

export interface BuyerInquiry {
  id: string;
  listingId: string;
  title: string;
  message: string;
  time: string;
}

interface BuyerBucket {
  viewed: MarketplaceListing[];
  favorites: MarketplaceListing[];
  inquiries: BuyerInquiry[];
}

const STORAGE_KEY = 'nimmda.buyer.activity';

@Injectable({ providedIn: 'root' })
export class BuyerActivityService {
  private readonly auth = inject(AuthService);
  private readonly storeSignal = signal<Record<string, BuyerBucket>>(this.readStore());

  readonly viewed = computed(() => this.bucket().viewed);
  readonly favorites = computed(() => this.bucket().favorites);
  readonly inquiries = computed(() => this.bucket().inquiries);

  isFavorite(listingId: string): boolean {
    return this.favorites().some((item) => item.id === listingId);
  }

  trackView(listing: MarketplaceListing): void {
    this.update((bucket) => {
      if (bucket.viewed[0]?.id === listing.id) {
        return bucket;
      }
      return {
        ...bucket,
        viewed: [listing, ...bucket.viewed.filter((item) => item.id !== listing.id)].slice(0, 24),
      };
    });
  }

  toggleFavorite(listing: MarketplaceListing): void {
    this.update((bucket) => {
      const exists = bucket.favorites.some((item) => item.id === listing.id);
      return {
        ...bucket,
        favorites: exists
          ? bucket.favorites.filter((item) => item.id !== listing.id)
          : [listing, ...bucket.favorites],
      };
    });
  }

  addInquiry(listing: MarketplaceListing, message: string): void {
    const inquiry: BuyerInquiry = {
      id: crypto.randomUUID(),
      listingId: listing.id,
      title: listing.title,
      message: message.trim(),
      time: new Date().toLocaleString('de-AT'),
    };
    this.update((bucket) => ({
      ...bucket,
      inquiries: [inquiry, ...bucket.inquiries].slice(0, 40),
    }));
  }

  claimGuest(): void {
    const userId = this.auth.currentUser()?.id;
    if (!userId) {
      return;
    }
    const store = this.storeSignal();
    const guest = store['guest'];
    if (!guest) {
      return;
    }
    const current = store[userId] ?? emptyBucket();
    const merged: BuyerBucket = {
      viewed: uniqueListings([...guest.viewed, ...current.viewed]),
      favorites: uniqueListings([...guest.favorites, ...current.favorites]),
      inquiries: [...guest.inquiries, ...current.inquiries],
    };
    const next = { ...store, [userId]: merged };
    delete next['guest'];
    this.storeSignal.set(next);
    this.persist(next);
  }

  private bucket(): BuyerBucket {
    const key = this.auth.currentUser()?.id ?? 'guest';
    return this.storeSignal()[key] ?? emptyBucket();
  }

  private update(mutate: (bucket: BuyerBucket) => BuyerBucket): void {
    const key = this.auth.currentUser()?.id ?? 'guest';
    const store = this.storeSignal();
    const current = store[key] ?? emptyBucket();
    const updated = mutate(current);
    if (updated === current && store[key]) {
      return;
    }
    const next = { ...store, [key]: updated };
    this.storeSignal.set(next);
    this.persist(next);
  }

  private persist(store: Record<string, BuyerBucket>): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  }

  private readStore(): Record<string, BuyerBucket> {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as Record<string, BuyerBucket>) : {};
    } catch {
      return {};
    }
  }
}

function emptyBucket(): BuyerBucket {
  return { viewed: [], favorites: [], inquiries: [] };
}

function uniqueListings(items: MarketplaceListing[]): MarketplaceListing[] {
  const seen = new Set<string>();
  return items.filter((item) => {
    if (seen.has(item.id)) {
      return false;
    }
    seen.add(item.id);
    return true;
  });
}
