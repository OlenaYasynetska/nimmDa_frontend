import { Component, computed, effect, inject, signal, untracked } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { map } from 'rxjs';
import { AuthService } from '../../../../core/services/auth.service';
import { BuyerActivityService } from '../../../buyer/services/buyer-activity.service';
import { LandingFooterComponent } from '../../../landing/components/landing-footer/landing-footer.component';
import { LandingHeaderComponent } from '../../../landing/components/landing-header/landing-header.component';
import { LandingIconComponent } from '../../../landing/components/landing-icon/landing-icon.component';
import { listingDetailUrl } from '../../data/listing-route';
import { MarketplaceListingsService } from '../../services/marketplace-listings.service';

@Component({
  selector: 'app-listing-detail',
  standalone: true,
  imports: [RouterLink, LandingHeaderComponent, LandingFooterComponent, LandingIconComponent],
  host: {
    class: 'block min-h-full w-full bg-[#f3f5f8]',
  },
  template: `
    <app-landing-header />
    <main class="container px-4 py-8 md:px-8">
      <a routerLink="/anzeigen" class="text-sm font-medium text-[#2f6fb2] hover:underline">← Alle Anzeigen</a>
      @if (listing(); as item) {
        <article class="mt-5 overflow-hidden rounded-2xl bg-white shadow-sm md:grid md:grid-cols-2">
          <img [src]="item.imageSrc" [alt]="item.title" class="h-64 w-full bg-slate-100 object-cover md:h-full" />
          <div class="p-6">
            <p class="text-xs font-medium uppercase tracking-wide text-slate-400">{{ item.category }}</p>
            <h1 class="mt-1 text-2xl font-extrabold text-[#1b3a5f]">{{ item.title }}</h1>
            <p class="mt-3 text-2xl font-extrabold text-[#2f9e57]">
              @if (item.price === 0) {
                Kostenlos
              } @else {
                € {{ item.price }}
              }
            </p>
            <p class="mt-2 text-sm text-slate-500">{{ item.location }} · Oberösterreich</p>
            <div class="mt-6 flex flex-wrap items-center gap-3">
              @if (ownListing()) {
                <p class="text-sm font-medium text-slate-500">Das ist deine Anzeige.</p>
                <a
                  [routerLink]="['/konto/meine-anzeigen', item.id, 'bearbeiten']"
                  class="inline-flex items-center rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50"
                >
                  Bearbeiten
                </a>
              } @else {
                <button
                  type="button"
                  class="inline-flex items-center gap-2 rounded-lg bg-[#2f9e57] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#278a4b] disabled:opacity-50"
                  (click)="contact()"
                  [disabled]="contacting()"
                >
                  <app-landing-icon name="chat" svgClass="h-4 w-4" />
                  Verkäufer kontaktieren
                </button>
              }
              <button
                type="button"
                class="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2.5 text-sm font-semibold ring-1 hover:bg-slate-50 disabled:opacity-50"
                [class]="favorited() ? 'text-[#e07a9a] ring-[#e07a9a]/40' : 'text-slate-700 ring-slate-200'"
                (click)="toggleFavorite()"
                [disabled]="favoriting()"
              >
                <svg
                  class="h-4 w-4"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  stroke-width="1.6"
                  [attr.fill]="favorited() ? 'currentColor' : 'none'"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M12 20s-7-4.4-7-9.2A3.8 3.8 0 0112 8a3.8 3.8 0 017 2.8C19 15.6 12 20 12 20z"
                  />
                </svg>
                Favorit
              </button>
            </div>
            @if (actionError()) {
              <p class="mt-3 text-sm text-red-600">{{ actionError() }}</p>
            }
          </div>
        </article>
      } @else {
        <p class="mt-10 rounded-2xl bg-white p-8 text-center text-slate-500 shadow-sm">
          Anzeige nicht gefunden.
        </p>
      }
    </main>
    <app-landing-footer />
  `,
})
export class ListingDetailComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly marketplace = inject(MarketplaceListingsService);
  private readonly auth = inject(AuthService);
  readonly activity = inject(BuyerActivityService);

  private readonly listingId = toSignal(
    this.route.paramMap.pipe(map((params) => params.get('id') ?? '')),
    { initialValue: this.route.snapshot.paramMap.get('id') ?? '' }
  );

  readonly listing = computed(() => this.marketplace.byId(this.listingId()) ?? undefined);
  readonly ownListing = computed(() => {
    const sellerId = this.listing()?.sellerId;
    const userId = this.auth.currentUser()?.id;
    return !!sellerId && !!userId && sellerId === userId;
  });
  readonly favorited = computed(() => this.activity.isFavorite(this.listingId()));
  readonly contacting = signal(false);
  readonly favoriting = signal(false);
  readonly actionError = signal<string | null>(null);
  private contactStarted = false;
  private favoriteStarted = false;

  constructor() {
    effect(() => {
      const id = this.listingId();
      untracked(() => void this.marketplace.ensure(id));
    });
    effect(() => {
      const item = this.listing();
      if (item) {
        untracked(() => this.activity.trackView(item));
      }
    });
    effect(() => {
      const item = this.listing();
      const authed = this.auth.isAuthenticated();
      if (!item || !authed) {
        return;
      }
      const params = this.route.snapshot.queryParamMap;
      untracked(() => {
        if (params.get('contact') === '1' && !this.ownListing() && !this.contactStarted) {
          this.contactStarted = true;
          void this.contact();
        }
        if (params.get('favorite') === '1' && !this.activity.isFavorite(item.id) && !this.favoriteStarted) {
          this.favoriteStarted = true;
          void this.toggleFavorite();
        }
      });
    });
  }

  async toggleFavorite(): Promise<void> {
    const item = this.listing();
    if (!item || this.favoriting()) {
      return;
    }
    if (!this.auth.isAuthenticated()) {
      void this.goAuth('favorite');
      return;
    }
    this.favoriting.set(true);
    this.actionError.set(null);
    try {
      await this.activity.toggleFavorite(item);
      await this.clearIntentParam('favorite');
    } catch {
      this.actionError.set('Favorit konnte nicht gespeichert werden.');
    } finally {
      this.favoriting.set(false);
    }
  }

  async contact(): Promise<void> {
    const item = this.listing();
    if (!item || this.contacting() || this.ownListing()) {
      return;
    }
    if (!this.auth.isAuthenticated()) {
      void this.goAuth('contact');
      return;
    }
    this.contacting.set(true);
    this.actionError.set(null);
    try {
      const conversation = await this.marketplace.sendInquiry(item.id);
      if (conversation?.id) {
        await this.router.navigate(['/konto/nachrichten'], {
          queryParams: { thread: conversation.id },
        });
        return;
      }
      await this.router.navigate(['/konto/nachrichten'], {
        queryParams: { listing: item.id },
      });
    } catch {
      this.actionError.set('Nachricht konnte nicht geöffnet werden. Bitte erneut versuchen.');
    } finally {
      this.contacting.set(false);
    }
  }

  private goAuth(intent: 'contact' | 'favorite'): void {
    const listingId = this.listingId();
    const extra = intent === 'favorite' ? 'favorite=1' : 'contact=1';
    const returnUrl = listingId
      ? listingDetailUrl(listingId, extra)
      : this.router.url;
    this.auth.rememberReturnUrl(returnUrl);
    void this.router.navigate(['/login'], {
      queryParams: { intent, returnUrl },
    });
  }

  private async clearIntentParam(key: string): Promise<void> {
    if (!this.route.snapshot.queryParamMap.has(key)) {
      return;
    }
    await this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { [key]: null },
      queryParamsHandling: 'merge',
      replaceUrl: true,
    });
  }
}
