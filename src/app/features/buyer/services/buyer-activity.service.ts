import { HttpClient } from '@angular/common/http';
import { Injectable, computed, effect, inject, signal, untracked } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../../environments/environment';
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

interface FavoriteDto {
  id: string;
  title: string;
  price: number;
  category: string;
  location: string;
  imageSrc: string;
  createdAt?: string;
  sellerId?: string;
}

const STORAGE_KEY = 'nimmda.buyer.activity';

@Injectable({ providedIn: 'root' })
export class BuyerActivityService {
  private readonly auth = inject(AuthService);
  private readonly http = inject(HttpClient);
  private readonly storeSignal = signal<Record<string, BuyerBucket>>(this.readStore());
  private readonly accountFavorites = signal<MarketplaceListing[]>([]);

  readonly viewed = computed(() => this.bucket().viewed);
  readonly favorites = computed(() =>
    this.auth.isAuthenticated() ? this.accountFavorites() : this.bucket().favorites
  );
  readonly inquiries = computed(() => this.bucket().inquiries);

  constructor() {
    effect(() => {
      const authed = this.auth.isAuthenticated();
      untracked(() => {
        if (authed) {
          void this.refreshFavorites();
        } else {
          this.accountFavorites.set([]);
        }
      });
    });
  }

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

  async toggleFavorite(listing: MarketplaceListing): Promise<void> {
    if (!this.auth.isAuthenticated()) {
      this.update((bucket) => {
        const exists = bucket.favorites.some((item) => item.id === listing.id);
        return {
          ...bucket,
          favorites: exists
            ? bucket.favorites.filter((item) => item.id !== listing.id)
            : [listing, ...bucket.favorites],
        };
      });
      return;
    }
    const exists = this.isFavorite(listing.id);
    if (exists) {
      await firstValueFrom(this.http.delete(`${environment.apiUrl}/favorites/${listing.id}`));
      this.accountFavorites.update((items) => items.filter((item) => item.id !== listing.id));
      return;
    }
    const saved = await firstValueFrom(
      this.http.post<FavoriteDto>(`${environment.apiUrl}/favorites/${listing.id}`, {})
    );
    this.accountFavorites.update((items) => [toListing(saved), ...items.filter((item) => item.id !== listing.id)]);
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

  async claimGuest(): Promise<void> {
    const userId = this.auth.currentUser()?.id;
    if (!userId) {
      return;
    }
    const store = this.storeSignal();
    const guest = store['guest'];
    if (guest) {
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
      for (const listing of guest.favorites) {
        try {
          await firstValueFrom(
            this.http.post(`${environment.apiUrl}/favorites/${listing.id}`, {})
          );
        } catch {
          /* listing may not exist on the server */
        }
      }
    }
    await this.refreshFavorites();
  }

  async refreshFavorites(): Promise<void> {
    if (!this.auth.isAuthenticated()) {
      this.accountFavorites.set([]);
      return;
    }
    try {
      const rows = await firstValueFrom(
        this.http.get<FavoriteDto[]>(`${environment.apiUrl}/favorites`)
      );
      this.accountFavorites.set(rows.map(toListing));
    } catch {
      this.accountFavorites.set([]);
    }
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

function toListing(row: FavoriteDto): MarketplaceListing {
  return {
    id: row.id,
    title: row.title,
    price: Number(row.price),
    imageSrc: row.imageSrc,
    category: row.category,
    location: row.location,
    createdAt: row.createdAt,
    sellerId: row.sellerId,
  };
}
