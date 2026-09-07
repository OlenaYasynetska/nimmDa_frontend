import { Component, computed, effect, inject, signal, untracked } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { map } from 'rxjs';
import { AuthService } from '../../../../core/services/auth.service';
import { BuyerActivityService } from '../../../buyer/services/buyer-activity.service';
import { LandingFooterComponent } from '../../../landing/components/landing-footer/landing-footer.component';
import { LandingHeaderComponent } from '../../../landing/components/landing-header/landing-header.component';
import { MarketplaceListingsService } from '../../services/marketplace-listings.service';

@Component({
  selector: 'app-listing-detail',
  standalone: true,
  imports: [RouterLink, FormsModule, LandingHeaderComponent, LandingFooterComponent],
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
            <div class="mt-6 flex flex-wrap gap-2">
              <button
                type="button"
                class="rounded-lg bg-[#2f9e57] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#278a4b]"
                (click)="contact()"
              >
                Verkäufer kontaktieren
              </button>
              <button
                type="button"
                class="rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50"
                (click)="toggleFavorite()"
              >
                {{ activity.isFavorite(item.id) ? 'Von Merkliste entfernen' : 'Auf Merkliste' }}
              </button>
            </div>
            @if (showMessage()) {
              <form class="mt-5 space-y-3" (ngSubmit)="send()">
                <textarea
                  [(ngModel)]="draft"
                  name="message"
                  rows="3"
                  placeholder="Nachricht an den Verkäufer..."
                  class="block w-full rounded-xl border-0 bg-slate-100 px-3 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-200"
                ></textarea>
                <button
                  type="submit"
                  class="rounded-lg bg-[#1b3a5f] px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
                  [disabled]="!draft.trim() || sending()"
                >
                  Senden
                </button>
              </form>
            }
            @if (sent()) {
              <p class="mt-3 text-sm font-medium text-[#2f9e57]">Nachricht gesendet. Der Verkäufer sieht sie in den Anfragen.</p>
            }
            @if (sendError()) {
              <p class="mt-3 text-sm text-red-600">{{ sendError() }}</p>
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
  readonly showMessage = signal(false);
  readonly sent = signal(false);
  readonly sending = signal(false);
  readonly sendError = signal<string | null>(null);
  draft = '';

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
  }

  toggleFavorite(): void {
    const item = this.listing();
    if (!item) {
      return;
    }
    if (!this.auth.isAuthenticated()) {
      void this.goAuth();
      return;
    }
    this.activity.toggleFavorite(item);
  }

  contact(): void {
    if (!this.auth.isAuthenticated()) {
      void this.goAuth();
      return;
    }
    this.showMessage.set(true);
  }

  async send(): Promise<void> {
    const item = this.listing();
    if (!item || !this.draft.trim() || this.sending()) {
      return;
    }
    this.sending.set(true);
    this.sendError.set(null);
    try {
      await this.marketplace.sendInquiry(item.id, this.draft);
      this.activity.addInquiry(item, this.draft);
      this.draft = '';
      this.sent.set(true);
      this.showMessage.set(false);
    } catch {
      this.sendError.set('Nachricht konnte nicht gesendet werden. Bitte erneut anmelden.');
    } finally {
      this.sending.set(false);
    }
  }

  private goAuth(): void {
    const returnUrl = this.router.url;
    void this.router.navigate(['/auth/login'], {
      queryParams: { intent: 'contact', role: 'buyer', returnUrl },
    });
  }
}
