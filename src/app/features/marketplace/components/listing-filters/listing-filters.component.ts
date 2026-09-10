import { Component, computed, inject } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs';
import {
  POPULAR_CATEGORIES,
  categoryBySlug,
  categoryListingsPath,
} from '../../../landing/data/landing.content';
import { listingFilterQuery } from '../../data/listing-query';
import {
  SORT_OPTIONS,
  UMKREIS_OPTIONS,
  hasCoordinates,
  parseStandort,
  uniqueListingLocations,
} from '../../data/standort';
import { MarketplaceListingsService } from '../../services/marketplace-listings.service';
import { StandortService } from '../../services/standort.service';

@Component({
  selector: 'app-listing-filters',
  standalone: true,
  imports: [FormsModule],
  template: `
    <section class="mt-6 rounded-2xl bg-white p-4 shadow-sm md:p-5">
      <form class="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3" (ngSubmit)="applySearch()">
        <label class="block">
          <span class="mb-1.5 block text-sm font-medium text-slate-600">Suche</span>
          <input
            type="search"
            name="q"
            [(ngModel)]="searchDraft"
            placeholder="Was suchst du?"
            class="block w-full rounded-xl border-0 bg-slate-100 px-3 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-200"
            (change)="applySearch()"
          />
        </label>

        <label class="block">
          <span class="mb-1.5 block text-sm font-medium text-slate-600">Standort</span>
          <select
            name="ort"
            class="block w-full rounded-xl border-0 bg-slate-100 px-3 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-200"
            [ngModel]="ort()"
            (ngModelChange)="setOrt($event)"
          >
            <option value="">Alle Orte</option>
            @for (city of cities(); track city) {
              <option [value]="city">{{ city }}</option>
            }
            @if (ort() === 'andere') {
              <option value="andere">Andere Stadt</option>
            }
          </select>
        </label>

        <fieldset class="block">
          <legend class="mb-1.5 text-sm font-medium text-slate-600">Umkreis</legend>
          <div class="flex flex-wrap gap-3 pt-1">
            @for (km of umkreisOptions; track km) {
              <label class="inline-flex items-center gap-1.5 text-sm text-slate-700">
                <input
                  type="radio"
                  name="km"
                  [value]="km"
                  [ngModel]="umkreis()"
                  (ngModelChange)="setUmkreis($event)"
                  [disabled]="!canUseUmkreis()"
                />
                {{ km }} km
              </label>
            }
          </div>
          @if (!canUseUmkreis()) {
            <p class="mt-1 text-xs text-slate-400">Zuerst einen Standort wählen.</p>
          }
        </fieldset>

        <label class="block">
          <span class="mb-1.5 block text-sm font-medium text-slate-600">Kategorie</span>
          <select
            name="kat"
            class="block w-full rounded-xl border-0 bg-slate-100 px-3 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-200"
            [ngModel]="categorySlug()"
            (ngModelChange)="setCategory($event)"
          >
            <option value="">Alle</option>
            @for (category of categories; track category.slug) {
              <option [value]="category.slug">{{ category.name }}</option>
            }
          </select>
        </label>

        <div>
          <span class="mb-1.5 block text-sm font-medium text-slate-600">Preis</span>
          <div class="flex items-center gap-2">
            <input
              type="number"
              name="von"
              min="0"
              [(ngModel)]="vonDraft"
              placeholder="von"
              class="min-w-0 flex-1 rounded-xl border-0 bg-slate-100 px-3 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-200"
              (change)="applyPrice()"
            />
            <span class="text-slate-400">–</span>
            <input
              type="number"
              name="bis"
              min="0"
              [(ngModel)]="bisDraft"
              placeholder="bis"
              class="min-w-0 flex-1 rounded-xl border-0 bg-slate-100 px-3 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-200"
              (change)="applyPrice()"
          </div>
        </div>

        <label class="block">
          <span class="mb-1.5 block text-sm font-medium text-slate-600">Sortieren</span>
          <select
            name="sort"
            class="block w-full rounded-xl border-0 bg-slate-100 px-3 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-200"
            [ngModel]="sort()"
            (ngModelChange)="setSort($event)"
          >
            @for (option of sortOptions; track option.value) {
              <option [value]="option.value">{{ option.label }}</option>
            }
          </select>
        </label>
      </form>
    </section>
  `,
})
export class ListingFiltersComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly marketplace = inject(MarketplaceListingsService);
  private readonly standortService = inject(StandortService);

  readonly umkreisOptions = UMKREIS_OPTIONS;
  readonly sortOptions = SORT_OPTIONS;
  readonly categories = POPULAR_CATEGORIES.filter((item) => item.slug !== 'weitere');

  private readonly query = toSignal(this.route.queryParamMap, {
    initialValue: this.route.snapshot.queryParamMap,
  });
  private readonly slug = toSignal(this.route.paramMap.pipe(map((params) => params.get('slug'))), {
    initialValue: this.route.snapshot.paramMap.get('slug'),
  });
  private readonly listingFilter = toSignal(
    this.route.data.pipe(map((data) => String(data['listingFilter'] ?? ''))),
    { initialValue: String(this.route.snapshot.data['listingFilter'] ?? '') }
  );

  searchDraft = this.route.snapshot.queryParamMap.get('q') ?? '';
  vonDraft: number | null = parsePrice(this.route.snapshot.queryParamMap.get('von'));
  bisDraft: number | null = parsePrice(this.route.snapshot.queryParamMap.get('bis'));

  readonly cities = computed(() =>
    uniqueListingLocations(this.marketplace.all().map((item) => item.location))
  );

  readonly ort = computed(
    () => parseStandort(this.query()?.get('ort')) || this.standortService.selected()
  );

  readonly umkreis = computed(() => {
    const km = Number(this.query()?.get('km'));
    return UMKREIS_OPTIONS.includes(km as (typeof UMKREIS_OPTIONS)[number]) ? km : null;
  });

  readonly sort = computed(() => this.query()?.get('sort') || 'neueste');

  readonly categorySlug = computed(() => {
    if (this.listingFilter() === 'services') {
      return 'dienstleistungen';
    }
    const slug = this.slug();
    if (slug && slug !== 'weitere') {
      return slug;
    }
    return this.query()?.get('kat') ?? '';
  });

  readonly canUseUmkreis = computed(() => {
    const city = this.ort();
    return !!city && city !== 'andere' && hasCoordinates(city);
  });

  constructor() {
    this.route.queryParamMap.pipe(takeUntilDestroyed()).subscribe((params) => {
      this.searchDraft = params.get('q') ?? '';
      this.vonDraft = parsePrice(params.get('von'));
      this.bisDraft = parsePrice(params.get('bis'));
    });
  }

  applySearch(): void {
    this.patch({ q: this.searchDraft.trim() || null });
  }

  setOrt(value: string): void {
    const ort = parseStandort(value);
    this.standortService.set(ort);
    this.patch({
      ort: ort || null,
      km: ort && hasCoordinates(ort) ? this.query()?.get('km') || null : null,
    });
  }

  setUmkreis(km: number | string): void {
    if (!this.canUseUmkreis()) {
      return;
    }
    this.patch({ km: String(km) });
  }

  setCategory(slug: string): void {
    if (this.listingFilter() === 'kostenlos') {
      this.patch({ kat: slug || null });
      return;
    }
    const category = slug ? categoryBySlug(slug) : undefined;
    const path = !category || category.slug === 'weitere' ? '/anzeigen' : categoryListingsPath(category);
    void this.router.navigate([path], {
      queryParams: {
        ...listingFilterQuery(this.route.snapshot.queryParams),
        kat: null,
      },
    });
  }

  applyPrice(): void {
    this.patch({
      von: priceParam(this.vonDraft),
      bis: priceParam(this.bisDraft),
    });
  }

  setSort(value: string): void {
    this.patch({ sort: value === 'neueste' ? null : value });
  }

  private patch(update: Record<string, string | null>): void {
    void this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        ...listingFilterQuery(this.route.snapshot.queryParams),
        ...update,
      },
      queryParamsHandling: 'replace',
      replaceUrl: true,
    });
  }
}

function parsePrice(value: string | null): number | null {
  if (value === null || value === '') {
    return null;
  }
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function priceParam(value: number | null): string | null {
  if (value === null || value === undefined || Number.isNaN(Number(value))) {
    return null;
  }
  return String(value);
}
