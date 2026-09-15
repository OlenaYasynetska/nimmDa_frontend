import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { MARKETPLACE_LISTINGS, type MarketplaceListing } from '../data/marketplace.content';
import { listingSearchHttpParams, type ListingSearchParams } from '../data/listing-query';
import { categoryBySlug } from '../../landing/data/landing.content';

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
  private readonly items = signal<MarketplaceListing[]>([]);
  private readonly extras = signal<Record<string, MarketplaceListing>>({});
  private readonly failed = signal(false);
  private readonly revision = signal(0);

  readonly catalogRevision = this.revision.asReadonly();

  readonly all = computed(() => {
    if (this.failed()) {
      return MARKETPLACE_LISTINGS;
    }
    const rows = this.items();
    if (environment.production) {
      return rows;
    }
    const seen = new Set(rows.map((item) => item.id));
    return [...rows, ...MARKETPLACE_LISTINGS.filter((item) => !seen.has(item.id))];
  });

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
      const body = await firstValueFrom(
        this.http.get<ListingsPageDto>(`${environment.apiUrl}/listings`, {
          params: listingSearchHttpParams({ page: 0, size: 100 }),
        })
      );
      this.items.set((body.content ?? []).map(toMarketplaceListing));
      this.failed.set(false);
      this.revision.update((value) => value + 1);
    } catch {
      this.failed.set(true);
      this.items.set([]);
    }
  }

  async search(filters: ListingSearchParams): Promise<ListingSearchPage> {
    try {
      const body = await firstValueFrom(
        this.http.get<ListingsPageDto>(`${environment.apiUrl}/listings`, {
          params: listingSearchHttpParams(filters),
        })
      );
      this.failed.set(false);
      return toSearchPage(body);
    } catch {
      return paginateLocal(filterLocal(this.all(), filters), filters.page, filters.size);
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

  async sendInquiry(listingId: string, message?: string): Promise<InquiryDto> {
    return firstValueFrom(
      this.http.post<InquiryDto>(
        `${environment.apiUrl}/listings/${listingId}/inquiries`,
        message ? { message } : {}
      )
    );
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

function paginateLocal(
  rows: MarketplaceListing[],
  page?: number | null,
  size?: number | null
): ListingSearchPage {
  const totalElements = rows.length;
  const safeSize = size !== null && size !== undefined && size > 0 ? Math.floor(size) : Math.max(totalElements, 1);
  const safePage = page !== null && page !== undefined && page >= 0 ? Math.floor(page) : 0;
  const start = safePage * safeSize;
  return {
    content: rows.slice(start, start + safeSize),
    page: safePage,
    size: safeSize,
    totalElements,
    totalPages: totalElements === 0 ? 0 : Math.ceil(totalElements / safeSize),
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

function filterLocal(items: MarketplaceListing[], filters: ListingSearchParams): MarketplaceListing[] {
  let rows = items;
  const categoryName = resolveCategoryName(filters.kat) || filters.category?.trim();
  if (categoryName) {
    rows = rows.filter((item) => item.category === categoryName);
  }
  if (filters.kostenlos) {
    rows = rows.filter((item) => item.price === 0);
  }
  const q = filters.q?.trim().toLowerCase();
  if (q) {
    rows = rows.filter((item) => item.title.toLowerCase().includes(q));
  }
  const ort = filters.ort?.trim().toLowerCase();
  if (ort) {
    rows = rows.filter((item) => item.location.trim().toLowerCase() === ort);
  }
  if (!filters.kostenlos && filters.von !== null && filters.von !== undefined) {
    rows = rows.filter((item) => item.price >= filters.von!);
  }
  if (!filters.kostenlos && filters.bis !== null && filters.bis !== undefined) {
    rows = rows.filter((item) => item.price <= filters.bis!);
  }
  const sort = filters.sort;
  if (sort === 'preis-asc') {
    return [...rows].sort((a, b) => a.price - b.price);
  }
  if (sort === 'preis-desc') {
    return [...rows].sort((a, b) => b.price - a.price);
  }
  return rows;
}

function resolveCategoryName(slug?: string | null): string {
  if (!slug || slug === 'weitere') {
    return '';
  }
  return categoryBySlug(slug)?.name ?? '';
}
