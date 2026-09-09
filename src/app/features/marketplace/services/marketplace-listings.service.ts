import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { type MarketplaceListing } from '../data/marketplace.content';

interface ListingDto {
  id: string;
  title: string;
  price: number;
  category: string;
  location: string;
  imageSrc: string;
}

interface InquiryDto {
  id: string;
}

@Injectable({ providedIn: 'root' })
export class MarketplaceListingsService {
  private readonly http = inject(HttpClient);
  private readonly items = signal<MarketplaceListing[]>([]);
  private readonly extras = signal<Record<string, MarketplaceListing>>({});

  readonly all = computed(() => this.items());

  constructor() {
    void this.refresh();
  }

  forCategory(categoryName: string | null): MarketplaceListing[] {
    const listings = this.all();
    if (!categoryName) {
      return listings;
    }
    return listings.filter((item) => item.category === categoryName);
  }

  byId(id: string): MarketplaceListing | undefined {
    return this.extras()[id] ?? this.all().find((item) => item.id === id);
  }

  async refresh(): Promise<void> {
    try {
      const rows = await firstValueFrom(this.http.get<ListingDto[]>(`${environment.apiUrl}/listings`));
      this.items.set(rows.map(toMarketplaceListing));
    } catch {
      this.items.set([]);
    }
  }

  async ensure(id: string): Promise<void> {
    if (!id) {
      return;
    }
    try {
      const row = await firstValueFrom(
        this.http.get<ListingDto>(`${environment.apiUrl}/listings/${id}`)
      );
      this.extras.update((current) => ({ ...current, [id]: toMarketplaceListing(row) }));
    } catch {
      /* listing stays missing */
    }
  }

  async sendInquiry(listingId: string, message: string): Promise<InquiryDto> {
    return firstValueFrom(
      this.http.post<InquiryDto>(`${environment.apiUrl}/listings/${listingId}/inquiries`, { message })
    );
  }
}

function toMarketplaceListing(row: ListingDto): MarketplaceListing {
  return {
    id: row.id,
    title: row.title,
    price: Number(row.price),
    imageSrc: row.imageSrc,
    category: row.category,
    location: row.location,
  };
}
