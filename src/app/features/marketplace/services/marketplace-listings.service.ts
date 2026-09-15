import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../../environments/environment';
import type { MarketplaceListing } from '../data/marketplace.content';
import { listingSearchHttpParams, type ListingSearchParams } from '../data/listing-query';

interface ListingDto {
  id: string;
  title: string;
  price: number;
  category: string;
  location: string;
  imageSrc: string;
  createdAt?: string;
  sellerId?: string;
}

interface ListingsPageDto {
  content: ListingDto[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export interface ListingSearchPage {
  content: MarketplaceListing[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

interface InquiryDto {
  id: string;
}

@Injectable({ providedIn: 'root' })
export class MarketplaceListingsService {
  private readonly http = inject(HttpClient);
  private readonly extras = signal<Record<string, MarketplaceListing>>({});

  byId(id: string): MarketplaceListing | undefined {
    return this.extras()[id];
  }

  async search(filters: ListingSearchParams): Promise<ListingSearchPage> {
    try {
      const body = await firstValueFrom(
        this.http.get<ListingsPageDto>(`${environment.apiUrl}/listings`, {
          params: listingSearchHttpParams(filters),
        })
      );
      const page = toSearchPage(body);
      this.remember(page.content);
      return page;
    } catch {
      return emptyPage(filters);
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
      this.remember([toMarketplaceListing(row)]);
    } catch {
      /* listing stays missing */
    }
  }

  async sendInquiry(listingId: string, message?: string): Promise<InquiryDto> {
    return firstValueFrom(
      this.http.post<InquiryDto>(
        `${environment.apiUrl}/listings/${listingId}/inquiries`,
        message ? { message } : {}
      )
    );
  }

  private remember(rows: MarketplaceListing[]): void {
    if (rows.length === 0) {
      return;
    }
    this.extras.update((current) => {
      const next = { ...current };
      for (const row of rows) {
        next[row.id] = row;
      }
      return next;
    });
  }
}

function toSearchPage(body: ListingsPageDto): ListingSearchPage {
  const content = (body.content ?? []).map(toMarketplaceListing);
  return {
    content,
    page: body.page ?? 0,
    size: body.size ?? content.length,
    totalElements: body.totalElements ?? content.length,
    totalPages: body.totalPages ?? (content.length ? 1 : 0),
  };
}

function emptyPage(filters: ListingSearchParams): ListingSearchPage {
  const size = filters.size && filters.size > 0 ? Math.floor(filters.size) : 20;
  const page = filters.page && filters.page >= 0 ? Math.floor(filters.page) : 0;
  return {
    content: [],
    page,
    size,
    totalElements: 0,
    totalPages: 0,
  };
}

function toMarketplaceListing(row: ListingDto): MarketplaceListing {
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
