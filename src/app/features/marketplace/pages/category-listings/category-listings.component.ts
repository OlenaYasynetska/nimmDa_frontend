import { Component, computed, inject, linkedSignal } from '@angular/core';
import { ViewportScroller } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { map } from 'rxjs';
import { categoryBySlug } from '../../../landing/data/landing.content';
import { LandingFooterComponent } from '../../../landing/components/landing-footer/landing-footer.component';
import { LandingHeaderComponent } from '../../../landing/components/landing-header/landing-header.component';
import { useListingPageSize } from '../../hooks/use-listing-page-size.hook';
import { MarketplaceListingsService } from '../../services/marketplace-listings.service';

@Component({
  selector: 'app-category-listings',
  standalone: true,
  imports: [RouterLink, LandingHeaderComponent, LandingFooterComponent],
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
          <p class="mt-1 text-sm text-slate-500">{{ listings().length }} Anzeigen in Oberösterreich</p>
        </div>
      </div>

      @if (listings().length === 0) {
        <p class="mt-10 rounded-2xl bg-white p-8 text-center text-slate-500 shadow-sm">
          In dieser Kategorie gibt es gerade keine Anzeigen.
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
  private readonly viewport = inject(ViewportScroller);

  readonly pageSize = useListingPageSize();

  private readonly slug = toSignal(this.route.paramMap.pipe(map((params) => params.get('slug'))), {
    initialValue: this.route.snapshot.paramMap.get('slug'),
  });

  readonly page = linkedSignal({
    source: this.slug,
    computation: () => 1,
  });

  readonly category = computed(() => {
    const slug = this.slug();
    return slug ? categoryBySlug(slug) : undefined;
  });

  readonly title = computed(() => {
    const slug = this.slug();
    if (!slug || slug === 'weitere') {
      return 'Alle Anzeigen';
    }
    return this.category()?.name ?? 'Kategorie nicht gefunden';
  });

  readonly listings = computed(() => {
    const slug = this.slug();
    if (!slug || slug === 'weitere') {
      return this.marketplace.all();
    }
    const category = categoryBySlug(slug);
    if (!category) {
      return [];
    }
    return this.marketplace.forCategory(category.name);
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
