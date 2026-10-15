import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, computed, effect, inject, signal, untracked } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { AuthService } from '../../../core/services/auth.service';
import { type ListingStatus, type SellerListing } from '../data/seller.content';

interface ListingDto {
  id: string;
  title: string;
  price: number;
  views: number;
  chats: number;
  status: string;
  imageSrc: string;
  category: string;
  location?: string;
  promoted?: boolean;
  promotedUntil?: string | null;
}

@Injectable({ providedIn: 'root' })
export class SellerListingsService {
  private readonly http = inject(HttpClient);
  private readonly auth = inject(AuthService);
  private readonly listingsSignal = signal<SellerListing[]>([]);

  readonly listings = this.listingsSignal.asReadonly();
  readonly salesCount = 0;
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
        this.http.get<ListingDto[]>(`${environment.apiUrl}/my/listings`)
      );
      this.listingsSignal.set(rows.map(toSellerListing));
    } catch {
      this.listingsSignal.set([]);
    }
  }

  async add(input: {
    title: string;
    price: number;
    imageSrc?: string;
    category?: string;
    location?: string;
  }): Promise<void> {
    await firstValueFrom(
      this.http.post(`${environment.apiUrl}/listings`, {
        title: input.title,
        price: input.price,
        category: input.category || 'Möbel & Haushalt',
        location: input.location,
        imageSrc: input.imageSrc,
      })
    );
    await this.refresh();
  }

  async update(
    id: string,
    input: {
      title: string;
      price: number;
      imageSrc?: string;
      category?: string;
      location?: string;
    }
  ): Promise<void> {
    await firstValueFrom(
      this.http.put(`${environment.apiUrl}/listings/${id}`, {
        title: input.title,
        price: input.price,
        category: input.category || 'Möbel & Haushalt',
        location: input.location,
        imageSrc: input.imageSrc,
      })
    );
    await this.refresh();
  }

  async remove(id: string): Promise<void> {
    await firstValueFrom(this.http.delete(`${environment.apiUrl}/listings/${id}`));
    this.listingsSignal.update((items) => items.filter((item) => item.id !== id));
  }

  async setStatus(id: string, status: ListingStatus): Promise<void> {
    const row = await firstValueFrom(
      this.http.patch<ListingDto>(`${environment.apiUrl}/listings/${id}`, { status })
    );
    const mapped = toSellerListing(row);
    this.listingsSignal.update((items) => items.map((item) => (item.id === id ? mapped : item)));
  }

  async promote(id: string): Promise<void> {
    try {
      const response = await firstValueFrom(
        this.http.post<{ checkoutUrl: string }>(`${environment.apiUrl}/listings/${id}/promotion-checkout`, {})
      );
      if (!response.checkoutUrl) {
        throw new Error('Zahlung konnte nicht gestartet werden.');
      }
      window.location.assign(response.checkoutUrl);
    } catch (error) {
      throw new Error(readError(error));
    }
  }

  async confirmPromotion(sessionId: string): Promise<'paid' | 'pending'> {
    try {
      const response = await firstValueFrom(
        this.http.post<{ status: string }>(`${environment.apiUrl}/promotions/checkout-session`, { sessionId })
      );
      await this.refresh();
      return response.status === 'paid' ? 'paid' : 'pending';
    } catch (error) {
      throw new Error(readError(error));
    }
  }
}

function readError(error: unknown): string {
  if (error instanceof HttpErrorResponse) {
    const message = (error.error as { message?: string } | null)?.message;
    if (message) {
      return message;
    }
  }
  if (error instanceof Error && error.message) {
    return error.message;
  }
  return 'Zahlung konnte nicht gestartet werden.';
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
    location: row.location,
    promoted: row.promoted === true,
    promotedUntil: row.promotedUntil ?? null,
  };
}
