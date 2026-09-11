import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink, RouterLinkActive } from '@angular/router';
import { map } from 'rxjs';
import { SellerListingsService } from '../../../seller/services/seller-listings.service';
import { LISTING_FILTERS } from '../../data/konto.nav';

@Component({
  selector: 'app-konto-listings',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <div class="rounded-2xl bg-white p-5 shadow-sm">
      <div class="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 class="text-lg font-bold text-slate-800">Meine Anzeigen</h2>
          <p class="mt-1 text-sm text-slate-500">Aktive, Entwürfe und beendete Anzeigen.</p>
        </div>
        <a
          routerLink="/konto/meine-anzeigen/neu"
          class="text-sm font-medium text-[#2f6fb2] hover:underline"
        >
          Neue Anzeige
        </a>
      </div>

      <nav class="mb-5 flex flex-wrap gap-2 text-sm">
        @for (item of filters; track item.value) {
          <a
            [routerLink]="item.path"
            routerLinkActive="bg-[#1b3a5f] text-white"
            [routerLinkActiveOptions]="{ exact: true }"
            class="rounded-full bg-slate-100 px-3 py-1.5 font-medium text-slate-700"
          >
            {{ item.label }}
          </a>
        }
      </nav>

      @if (filter() === 'entwuerfe') {
        <p class="py-8 text-sm text-slate-400">Noch keine Entwürfe. Veröffentliche eine Anzeige, dann erscheint sie unter Aktiv.</p>
      } @else if (visible().length === 0) {
        <p class="py-8 text-sm text-slate-400">
          {{ filter() === 'beendet' ? 'Keine beendeten Anzeigen.' : 'Noch keine aktiven Anzeigen.' }}
        </p>
      } @else {
        <ul class="divide-y divide-slate-100">
          @for (item of visible(); track item.id) {
            <li class="flex items-center gap-3 py-3">
              <a [routerLink]="['/anzeigen', item.id]" class="flex min-w-0 flex-1 items-center gap-3">
                <img [src]="item.imageSrc" [alt]="item.title" class="h-14 w-14 rounded-lg bg-slate-100 object-cover" />
                <div class="min-w-0 flex-1">
                  <p class="truncate font-semibold text-slate-800">{{ item.title }}</p>
                  <p class="text-sm text-slate-500">€ {{ item.price }} · {{ item.views }} Aufrufe</p>
                </div>
              </a>
              <a
                [routerLink]="['/konto/meine-anzeigen', item.id, 'bearbeiten']"
                class="rounded-md px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Bearbeiten
              </a>
              <button
                type="button"
                class="rounded-md px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
                (click)="toggleStatus(item.id, item.status)"
              >
                {{ item.status === 'aktiv' ? 'Beenden' : 'Wieder aktivieren' }}
              </button>
              <button
                type="button"
                class="rounded-md px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50"
                (click)="remove(item.id)"
              >
                Löschen
              </button>
            </li>
          }
        </ul>
      }
    </div>
  `,
})
export class KontoListingsComponent {
  readonly listings = inject(SellerListingsService);
  readonly filters = LISTING_FILTERS;
  private readonly route = inject(ActivatedRoute);

  readonly filter = toSignal(
    this.route.paramMap.pipe(
      map((params) => {
        const value = params.get('filter') || 'aktiv';
        return value === 'entwuerfe' || value === 'beendet' ? value : 'aktiv';
      })
    ),
    { initialValue: 'aktiv' }
  );

  readonly visible = computed(() => {
    const filter = this.filter();
    if (filter === 'entwuerfe') {
      return [];
    }
    if (filter === 'beendet') {
      return this.listings.listings().filter((item) => item.status !== 'aktiv');
    }
    return this.listings.listings().filter((item) => item.status === 'aktiv');
  });

  async toggleStatus(id: string, status: 'aktiv' | 'pausiert'): Promise<void> {
    await this.listings.setStatus(id, status === 'aktiv' ? 'pausiert' : 'aktiv');
  }

  async remove(id: string): Promise<void> {
    await this.listings.remove(id);
  }
}
