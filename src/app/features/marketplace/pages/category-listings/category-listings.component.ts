import { Component, computed, inject, linkedSignal } from '@angular/core';
import { ViewportScroller } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { map } from 'rxjs';
import { categoryBySlug } from '../../../landing/data/landing.content';
import { LandingFooterComponent } from '../../../landing/components/landing-footer/landing-footer.component';
import { LandingHeaderComponent } from '../../../landing/components/landing-header/landing-header.component';
import { ListingFiltersComponent } from '../../components/listing-filters/listing-filters.component';
import {
  listingDistanceKm,
  listingMatchesStandort,
  listingMatchesUmkreis,
  parseSort,
  parseStandort,
  parseUmkreis,
  standortLabel,
} from '../../data/standort';
import { useListingPageSize } from '../../hooks/use-listing-page-size.hook';
import { MarketplaceListingsService } from '../../services/marketplace-listings.service';
import { StandortService } from '../../services/standort.service';
import type { MarketplaceListing } from '../../data/marketplace.content';

const SERVICES_CATEGORY = 'Dienstleistungen';

@Component({
  selector: 'app-category-listings',
  standalone: true,
  imports: [RouterLink, LandingHeaderComponent, LandingFooterComponent, ListingFiltersComponent],
  host: {
    class: 'block min-h-full w-full bg-[#f3f5f8]',
  },
  template: `
    <app-landing-header />
    <main class="container px-4 py-8 md:px-8">
      <a routerLink="/" class="text-sm font-medium text-[#2f6fb2] hover:underline">← Zur Startseite</a>

      <div class="mt-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 class="text-2xl font-extrabold text-[#1b3a5f] md:text-3xl">{{ title() }}</h1>
          <p class="mt-1 text-sm text-slate-500">{{ countLabel() }}</p>
        </div>
      </div>

      <app-listing-filters />

      @if (listings().length === 0) {
        <p class="mt-10 rounded-2xl bg-white p-8 text-center text-slate-500 shadow-sm">
          {{ emptyMessage() }}
        </p>
      } @else {
        <ul class="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            @for (item of pagedListings(); track item.id) {
              <li class="overflow-hidden rounded-2xl bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                <a [routerLink]="['/anzeigen/artikel', item.id]" class="block cursor-pointer text-left">
                  <img [src]="item.imageSrc" [alt]="item.title" class="h-44 w-full bg-slate-100 object-cover" />
                  <div class="p-4">
                    <p class="truncate font-semibold text-slate-800">{{ item.title }}</p>
                    <p class="mt-1 text-lg font-extrabold text-[#2f9e57]">
                      @if (item.price === 0) {
                        Kostenlos
                      } @else {
                        € {{ item.price }}
                      }
                    </p>
                    <p class="mt-1 text-xs text-slate-400">{{ item.location }} · {{ item.category }}</p>
                  </div>
                </a>
              </li>
            }
        </ul>

        @if (showPagination()) {
          <nav class="mt-8 flex flex-wrap items-center justify-center gap-2" aria-label="Seiten">
            <button
              type="button"
              class="rounded-lg bg-white px-3 py-2 text-sm font-medium text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
              [disabled]="currentPage() === 1"
              (click)="goTo(currentPage() - 1)"
            >
              Zurück
            </button>
            @for (pageNumber of pageNumbers(); track pageNumber) {
              <button
                type="button"
                class="min-w-10 rounded-lg px-3 py-2 text-sm font-semibold ring-1"
                [class]="
                  pageNumber === currentPage()
                    ? 'bg-[#1b3a5f] text-white ring-[#1b3a5f]'
                    : 'bg-white text-slate-700 ring-slate-200 hover:bg-slate-50'
                "
                [attr.aria-current]="pageNumber === currentPage() ? 'page' : null"
                (click)="goTo(pageNumber)"
              >
                {{ pageNumber }}
              </button>
            }
            <button
              type="button"
              class="rounded-lg bg-white px-3 py-2 text-sm font-medium text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
              [disabled]="currentPage() === totalPages()"
              (click)="goTo(currentPage() + 1)"
            >
              Weiter
            </button>
          </nav>
        }
      }
    </main>
    <app-landing-footer />
  `,
})
export class CategoryListingsComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly marketplace = inject(MarketplaceListingsService);
  private readonly standortService = inject(StandortService);
  private readonly viewport = inject(ViewportScroller);

  readonly pageSize = useListingPageSize();

  private readonly slug = toSignal(this.route.paramMap.pipe(map((params) => params.get('slug'))), {
    initialValue: this.route.snapshot.paramMap.get('slug'),
  });

  private readonly listingFilter = toSignal(
    this.route.data.pipe(map((data) => String(data['listingFilter'] ?? ''))),
    { initialValue: String(this.route.snapshot.data['listingFilter'] ?? '') }
  );

  readonly search = toSignal(
    this.route.queryParamMap.pipe(map((params) => (params.get('q') ?? '').trim())),
    { initialValue: (this.route.snapshot.queryParamMap.get('q') ?? '').trim() }
  );

  readonly kostenlos = toSignal(
    this.route.queryParamMap.pipe(
      map((params) => params.get('kostenlos') === '1' || params.get('price') === '0')
    ),
    {
      initialValue:
        this.route.snapshot.queryParamMap.get('kostenlos') === '1' ||
        this.route.snapshot.queryParamMap.get('price') === '0',
    }
  );

  private readonly ortParam = toSignal(
    this.route.queryParamMap.pipe(map((params) => parseStandort(params.get('ort')))),
    { initialValue: parseStandort(this.route.snapshot.queryParamMap.get('ort')) }
  );

  readonly standort = computed(() => this.ortParam() || this.standortService.selected());

  readonly umkreis = toSignal(
    this.route.queryParamMap.pipe(map((params) => parseUmkreis(params.get('km')))),
    { initialValue: parseUmkreis(this.route.snapshot.queryParamMap.get('km')) }
  );

  readonly priceFrom = toSignal(
    this.route.queryParamMap.pipe(map((params) => parseBound(params.get('von')))),
    { initialValue: parseBound(this.route.snapshot.queryParamMap.get('von')) }
  );

  readonly priceTo = toSignal(
    this.route.queryParamMap.pipe(map((params) => parseBound(params.get('bis')))),
    { initialValue: parseBound(this.route.snapshot.queryParamMap.get('bis')) }
  );

  readonly sort = toSignal(
    this.route.queryParamMap.pipe(map((params) => parseSort(params.get('sort')))),
    { initialValue: parseSort(this.route.snapshot.queryParamMap.get('sort')) }
  );

  readonly categoryQuery = toSignal(
    this.route.queryParamMap.pipe(map((params) => params.get('kat') ?? '')),
    { initialValue: this.route.snapshot.queryParamMap.get('kat') ?? '' }
  );

  readonly services = computed(
    () => this.listingFilter() === 'services' || this.slug() === 'dienstleistungen'
  );

  readonly freeOnly = computed(() => this.listingFilter() === 'kostenlos' || this.kostenlos());

  readonly pageKey = computed(
    () =>
      `${this.slug() ?? ''}|${this.listingFilter()}|${this.search()}|${this.freeOnly()}|${this.standort()}|${this.umkreis()}|${this.priceFrom()}|${this.priceTo()}|${this.sort()}|${this.categoryQuery()}`
  );

  readonly page = linkedSignal({
    source: this.pageKey,
    computation: () => 1,
  });

  readonly category = computed(() => {
    const slug = this.slug();
    if (slug) {
      return categoryBySlug(slug);
    }
    const kat = this.categoryQuery();
    return kat ? categoryBySlug(kat) : undefined;
  });

  readonly title = computed(() => {
    const q = this.search();
    if (q) {
      return q;
    }
    if (this.freeOnly()) {
      return 'Kostenlos';
    }
    if (this.services()) {
      return 'Services';
    }
    const slug = this.slug();
    if (!slug || slug === 'weitere') {
      return this.category()?.name ?? 'Alle Anzeigen';
    }
    return this.category()?.name ?? 'Kategorie nicht gefunden';
  });

  readonly countLabel = computed(() => {
    const count = `${this.listings().length} Anzeigen`;
    const place = this.standort();
    const km = this.umkreis();
    if (place && km) {
      return `${count} in ${km} km um ${standortLabel(place)}`;
    }
    if (!place) {
      return count;
    }
    if (place === 'andere') {
      return `${count} in anderen Städten`;
    }
    return `${count} in ${standortLabel(place)}`;
  });

  readonly listings = computed(() => {
    let items = this.marketplace.all();
    if (this.services()) {
      items = items.filter((item) => item.category === SERVICES_CATEGORY);
    } else if (this.slug() && this.slug() !== 'weitere') {
      const category = categoryBySlug(this.slug() ?? '');
      items = category ? items.filter((item) => item.category === category.name) : [];
    } else if (this.category()) {
      items = items.filter((item) => item.category === this.category()?.name);
    }
    if (this.freeOnly()) {
      items = items.filter((item) => item.price === 0);
    }
    const q = this.search().toLowerCase();
    if (q) {
      items = items.filter((item) =>
        `${item.title} ${item.category} ${item.location}`.toLowerCase().includes(q)
      );
    }
    const place = this.standort();
    const km = this.umkreis();
    if (place) {
      items = km
        ? items.filter((item) => listingMatchesUmkreis(item.location, place, km))
        : items.filter((item) => listingMatchesStandort(item.location, place));
    }
    const from = this.priceFrom();
    if (from !== null) {
      items = items.filter((item) => item.price >= from);
    }
    const to = this.priceTo();
    if (to !== null) {
      items = items.filter((item) => item.price <= to);
    }
    return sortListings(items, this.sort(), place);
  });

  readonly emptyMessage = computed(() => {
    if (this.search() || this.freeOnly() || this.standort() || this.services() || this.priceFrom() !== null || this.priceTo() !== null) {
      return 'Keine Anzeigen gefunden.';
    }
    return 'In dieser Kategorie gibt es gerade keine Anzeigen.';
  });

  readonly totalPages = computed(() =>
    Math.max(1, Math.ceil(this.listings().length / this.pageSize()))
  );
  readonly currentPage = computed(() => Math.min(this.page(), this.totalPages()));
  readonly showPagination = computed(() => this.listings().length > this.pageSize());
  readonly pageNumbers = computed(() =>
    Array.from({ length: this.totalPages() }, (_, index) => index + 1)
  );
  readonly pagedListings = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize();
    return this.listings().slice(start, start + this.pageSize());
  });

  goTo(page: number): void {
    const next = Math.min(Math.max(1, page), this.totalPages());
    this.page.set(next);
    this.viewport.scrollToPosition([0, 0]);
  }
}

function parseBound(value: string | null): number | null {
  if (value === null || value === '') {
    return null;
  }
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function sortListings(
  items: MarketplaceListing[],
  sort: ReturnType<typeof parseSort>,
  place: string
): MarketplaceListing[] {
  const copy = [...items];
  if (sort === 'preis-asc') {
    return copy.sort((a, b) => a.price - b.price);
  }
  if (sort === 'preis-desc') {
    return copy.sort((a, b) => b.price - a.price);
  }
  if (sort === 'naehe' && place) {
    return copy.sort((a, b) => {
      const da = listingDistanceKm(a.location, place);
      const db = listingDistanceKm(b.location, place);
      return (da ?? Number.POSITIVE_INFINITY) - (db ?? Number.POSITIVE_INFINITY);
    });
  }
  return copy.sort((a, b) => listingTime(b) - listingTime(a));
}

function listingTime(item: MarketplaceListing): number {
  if (item.createdAt) {
    const parsed = Date.parse(item.createdAt);
    if (!Number.isNaN(parsed)) {
      return parsed;
    }
  }
  const match = item.id.match(/(\d+)$/);
  return match ? Number(match[1]) : 0;
}
