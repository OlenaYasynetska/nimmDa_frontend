import { Component, effect, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { map } from 'rxjs';
import { LandingFooterComponent } from '../../../landing/components/landing-footer/landing-footer.component';
import { LandingHeaderComponent } from '../../../landing/components/landing-header/landing-header.component';
import { BusinessProfile, BusinessProfileService } from '../../services/business-profile.service';

@Component({
  selector: 'app-business-profile',
  standalone: true,
  imports: [RouterLink, LandingHeaderComponent, LandingFooterComponent],
  host: { class: 'block min-h-full w-full bg-[#f3f5f8]' },
  template: `
    <app-landing-header />
    <main class="container px-4 py-5 md:px-8 md:py-8">
      <a routerLink="/services" class="text-sm font-medium text-[#2f6fb2] hover:underline">← Services</a>
      @if (profile(); as firm) {
        <article class="mt-5 rounded-2xl bg-white p-6 shadow-sm">
          @if (firm.active) {
            <p class="inline-flex rounded-full bg-[#f5c400] px-2 py-0.5 text-[11px] font-bold text-[#1b3a5f]">Firma</p>
          }
          <h1 class="mt-2 text-2xl font-extrabold text-[#1b3a5f]">{{ firm.companyName }}</h1>
          <p class="mt-1 text-slate-600">{{ firm.trade }}</p>
          <p class="mt-2 text-sm text-slate-500">{{ firm.location }} · Oberösterreich</p>
          <a class="mt-3 inline-block text-sm font-semibold text-[#2f6fb2] hover:underline" [href]="'tel:' + firm.phone">{{ firm.phone }}</a>
        </article>
        <section class="mt-6">
          <h2 class="text-lg font-extrabold text-[#1b3a5f]">Anzeigen</h2>
          @if (firm.listings.length === 0) {
            <p class="mt-3 text-sm text-slate-500">Noch keine aktiven Anzeigen.</p>
          } @else {
            <ul class="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              @for (item of firm.listings; track item.id) {
                <li class="overflow-hidden rounded-2xl bg-white shadow-sm">
                  <a [routerLink]="['/anzeigen', item.id]" class="block">
                    <img [src]="item.imageSrc" [alt]="item.title" class="h-40 w-full bg-slate-100 object-cover" />
                    <span class="block p-4">
                      <span class="block truncate font-semibold text-slate-800">{{ item.title }}</span>
                      <span class="mt-1 block font-extrabold text-[#2f9e57]">{{ price(item.price) }}</span>
                    </span>
                  </a>
                </li>
              }
            </ul>
          }
        </section>
      } @else if (loaded()) {
        <p class="mt-8 rounded-2xl bg-white p-8 text-center text-slate-500 shadow-sm">Dieses Profi-Profil gibt es nicht.</p>
      }
    </main>
    <app-landing-footer />
  `,
})
export class BusinessProfileComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly profiles = inject(BusinessProfileService);
  private readonly userId = toSignal(this.route.paramMap.pipe(map((params) => params.get('userId') ?? '')), {
    initialValue: this.route.snapshot.paramMap.get('userId') ?? '',
  });

  readonly profile = signal<BusinessProfile | null>(null);
  readonly loaded = signal(false);

  constructor() {
    effect(() => {
      const userId = this.userId();
      if (!userId) {
        this.loaded.set(true);
        this.profile.set(null);
        return;
      }
      void this.load(userId);
    });
  }

  price(value: number): string {
    return value === 0 ? 'Kostenlos' : `€ ${value}`;
  }

  private async load(userId: string): Promise<void> {
    this.loaded.set(false);
    this.profile.set(await this.profiles.byUser(userId));
    this.loaded.set(true);
  }
}
