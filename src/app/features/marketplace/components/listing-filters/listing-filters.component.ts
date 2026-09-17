import { Component, computed, inject, signal, viewChild } from '@angular/core';
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
  parseStandort,
  parseUmkreis,
} from '../../data/standort';
import { StandortPickerComponent } from '../standort-picker/standort-picker.component';
import { StandortService } from '../../services/standort.service';

@Component({
  selector: 'app-listing-filters',
  standalone: true,
  imports: [FormsModule, StandortPickerComponent],
  template: `
    <section class="mt-6 rounded-2xl bg-white p-4 shadow-sm md:p-5">
      <form class="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3" (ngSubmit)="applySearch()">
        <label class="hidden md:block">
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

        <div class="block">
          <span class="mb-1.5 block text-sm font-medium text-slate-600">Standort</span>
          <app-standort-picker
            [value]="ort()"
            [allowEmpty]="true"
            emptyLabel="Alle Orte"
            placeholder="Stadt wählen"
            (valueChange)="setOrt($event)"
          />
        </div>

        <fieldset class="block">
          <legend class="mb-1.5 text-sm font-medium text-slate-600">Umkreis</legend>
          <div class="flex flex-wrap gap-2 pt-1">
            @for (km of umkreisOptions; track km) {
              <button
                type="button"
                class="rounded-full px-3 py-1.5 text-sm font-medium ring-1 transition"
                [class]="
                  umkreis() === km
                    ? 'bg-[#1b3a5f] text-white ring-[#1b3a5f]'
                    : 'bg-slate-100 text-slate-700 ring-transparent hover:bg-slate-200'
                "
                (click)="setUmkreis(km, $event)"
              >
                {{ km }} km
              </button>
            }
          </div>
          @if (!ort()) {
            <p class="mt-1 text-xs text-slate-400">Umkreis antippen — dann die Stadt wählen.</p>
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
            />
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
  private readonly standortService = inject(StandortService);
  private readonly ortPicker = viewChild(StandortPickerComponent);
  private readonly pendingKm = signal<number | null>(null);

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

  readonly ort = computed(
    () => parseStandort(this.query()?.get('ort')) || this.standortService.selected()
  );

  readonly umkreis = computed(() => parseUmkreis(this.query()?.get('km')) ?? this.pendingKm());

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

  constructor() {
    this.route.queryParamMap.pipe(takeUntilDestroyed()).subscribe((params) => {
      this.searchDraft = params.get('q') ?? '';
      this.vonDraft = parsePrice(params.get('von'));
      this.bisDraft = parsePrice(params.get('bis'));
    });
    const urlOrt = parseStandort(this.route.snapshot.queryParamMap.get('ort'));
    const stored = this.standortService.selected();
    if (!urlOrt && stored) {
      this.patch({ ort: stored });
    }
  }

  applySearch(): void {
    this.patch({ q: this.searchDraft.trim() || null });
  }

  setOrt(value: string): void {
    const ort = parseStandort(value);
    this.standortService.set(ort);
    const km = ort ? this.query()?.get('km') || kmParam(this.pendingKm()) : null;
    if (!ort) {
      this.pendingKm.set(null);
    }
    this.patch({
      ort: ort || null,
      km,
    });
  }

  setUmkreis(km: number, event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    const selected = this.umkreis();
    if (selected === km && this.ort()) {
      this.pendingKm.set(null);
      this.patch({ km: null });
      return;
    }
    this.pendingKm.set(km);
    if (!this.ort()) {
      setTimeout(() => this.ortPicker()?.openPanel(), 0);
      return;
    }
    this.patch({
      ort: this.ort(),
      km: String(km),
    });
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

function kmParam(value: number | null): string | null {
  return value === null ? null : String(value);
}
