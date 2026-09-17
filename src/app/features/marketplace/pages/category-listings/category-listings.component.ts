import { Component, computed, effect, inject, linkedSignal, signal, untracked } from '@angular/core';
import { ViewportScroller } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { map } from 'rxjs';
import { categoryBySlug } from '../../../landing/data/landing.content';
import { LandingFooterComponent } from '../../../landing/components/landing-footer/landing-footer.component';
import { LandingHeaderComponent } from '../../../landing/components/landing-header/landing-header.component';
import { ListingFiltersComponent } from '../../components/listing-filters/listing-filters.component';
import {
  parseSort,
  parseStandort,
  standortLabel,
} from '../../data/standort';
import { useListingPageSize } from '../../hooks/use-listing-page-size.hook';
import { MarketplaceListingsService } from '../../services/marketplace-listings.service';
import { StandortService } from '../../services/standort.service';
import type { MarketplaceListing } from '../../data/marketplace.content';

@Component({
  selector: 'app-category-listings',
  standalone: true,
  imports: [RouterLink, LandingHeaderComponent, LandingFooterComponent, ListingFiltersComponent],
  host: {
    class: 'block min-h-full w-full bg-[#f3f5f8]',
  },
  template: `
    <app-landing-header />
    <main class="container px-4 py-5 md:px-8 md:py-8">
      <a routerLink="/" class="text-sm font-medium text-[#2f6fb2] hover:underline">← Zur Startseite</a>

      <div class="mt-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 class="text-2xl font-extrabold text-[#1b3a5f] md:text-3xl">{{ title() }}</h1>
          <p class="mt-1 text-sm text-slate-500">{{ countLabel() }}</p>
        </div>
      </div>

      <app-listing-filters />

      @if (totalElements() === 0) {
        <p class="mt-10 rounded-2xl bg-white p-8 text-center text-slate-500 shadow-sm">
          {{ emptyMessage() }}
        </p>
      } @else {
        <ul class="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            @for (item of listings(); track item.id) {
              <li class="overflow-hidden rounded-2xl bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                <a [routerLink]="['/anzeigen', item.id]" class="block cursor-pointer text-left">
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

  private readonly kmParam = toSignal(
    this.route.queryParamMap.pipe(map((params) => parseBound(params.get('km')))),
    { initialValue: parseBound(this.route.snapshot.queryParamMap.get('km')) }
  );

  readonly standort = computed(() => this.ortParam() || this.standortService.selected());

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
      `${this.slug() ?? ''}|${this.listingFilter()}|${this.search()}|${this.freeOnly()}|${this.standort()}|${this.kmParam()}|${this.priceFrom()}|${this.priceTo()}|${this.sort()}|${this.categoryQuery()}`
  );

  readonly page = linkedSignal({
    source: this.pageKey,
    computation: () => 1,
  });

  private readonly results = signal<MarketplaceListing[]>([]);
  private readonly totalCount = signal(0);
  private readonly pageCount = signal(0);
  private searchSeq = 0;

  constructor() {
    effect(() => {
      this.pageKey();
      this.page();
      this.pageSize();
      untracked(() => void this.reload());
    });
  }

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
    const count = `${this.totalElements()} Anzeigen`;
    const place = this.standort();
    if (!place) {
      return count;
    }
    return `${count} in ${standortLabel(place)}`;
  });

  readonly listings = computed(() => this.results());

  readonly totalElements = this.totalCount.asReadonly();

  readonly emptyMessage = computed(() => {
    if (this.search() || this.freeOnly() || this.standort() || this.services() || this.priceFrom() !== null || this.priceTo() !== null) {
      return 'Keine Anzeigen gefunden.';
    }
    return 'In dieser Kategorie gibt es gerade keine Anzeigen.';
  });

  readonly totalPages = computed(() => Math.max(1, this.pageCount()));
  readonly currentPage = computed(() => Math.min(this.page(), this.totalPages()));
  readonly showPagination = computed(() => this.totalElements() > this.pageSize());
  readonly pageNumbers = computed(() =>
    Array.from({ length: this.totalPages() }, (_, index) => index + 1)
  );

  goTo(page: number): void {
    const next = Math.min(Math.max(1, page), this.totalPages());
    this.page.set(next);
    this.viewport.scrollToPosition([0, 0]);
  }

  private async reload(): Promise<void> {
    const seq = ++this.searchSeq;
    const slug = this.slug();
    const kat =
      this.services()
        ? 'dienstleistungen'
        : slug && slug !== 'weitere'
          ? slug
          : this.categoryQuery() || null;
    const rows = await this.marketplace.search({
      q: this.search() || null,
      kat,
      ort: this.standort() || null,
      von: this.freeOnly() ? null : this.priceFrom(),
      bis: this.freeOnly() ? null : this.priceTo(),
      sort: this.sort(),
      km: this.standort() ? this.kmParam() : null,
      kostenlos: this.freeOnly(),
      page: Math.max(0, this.page() - 1),
      size: this.pageSize(),
    });
    if (seq !== this.searchSeq) {
      return;
    }
    this.results.set(rows.content);
    this.totalCount.set(rows.totalElements);
    this.pageCount.set(rows.totalPages);
  }
}

function parseBound(value: string | null): number | null {
  if (value === null || value === '') {
    return null;
  }
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}
