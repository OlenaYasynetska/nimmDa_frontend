import { HttpClient } from '@angular/common/http';
import { Injectable, computed, effect, inject, signal, untracked } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { AuthService } from '../../../core/services/auth.service';
import { MarketplaceListingsService } from '../../marketplace/services/marketplace-listings.service';
import { SELLER_SALES_COUNT, type ListingStatus, type SellerListing } from '../data/seller.content';

interface ListingDto {
  id: string;
  title: string;
  price: number;
  views: number;
  chats: number;
  status: string;
  imageSrc: string;
  category: string;
}

@Injectable({ providedIn: 'root' })
export class SellerListingsService {
  private readonly http = inject(HttpClient);
  private readonly auth = inject(AuthService);
  private readonly marketplace = inject(MarketplaceListingsService);
  private readonly listingsSignal = signal<SellerListing[]>([]);

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

  constructor() {
    effect(() => {
      const authed = this.auth.isAuthenticated();
      untracked(() => {
        if (authed) {
          void this.refresh();
        } else {
          this.listingsSignal.set([]);
        }
      });
    });
  }

  async refresh(): Promise<void> {
    try {
      const rows = await firstValueFrom(
        this.http.get<ListingDto[]>(`${environment.apiUrl}/listings/mine`)
      );
      this.listingsSignal.set(rows.map(toSellerListing));
    } catch {
      this.listingsSignal.set([]);
    }
  }

  async add(input: { title: string; price: number; imageSrc?: string; category?: string }): Promise<void> {
    await firstValueFrom(
      this.http.post(`${environment.apiUrl}/listings`, {
        title: input.title,
        price: input.price,
        category: input.category || 'Möbel & Haushalt',
        location: 'Linz',
        imageSrc: input.imageSrc,
      })
    );
    await this.refresh();
    await this.marketplace.refresh();
  }

  async setStatus(id: string, status: ListingStatus): Promise<void> {
    const row = await firstValueFrom(
      this.http.patch<ListingDto>(`${environment.apiUrl}/listings/${id}`, { status })
    );
    const mapped = toSellerListing(row);
    this.listingsSignal.update((items) => items.map((item) => (item.id === id ? mapped : item)));
    await this.marketplace.refresh();
  }
}

function toSellerListing(row: ListingDto): SellerListing {
  return {
    id: row.id,
    title: row.title,
    price: Number(row.price),
    views: row.views ?? 0,
    chats: row.chats ?? 0,
    status: row.status === 'PAUSED' ? 'pausiert' : 'aktiv',
    imageSrc: row.imageSrc,
    category: row.category,
  };
}
