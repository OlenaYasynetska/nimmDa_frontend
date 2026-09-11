import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { BuyerActivityService } from '../../../buyer/services/buyer-activity.service';
import { SellerListingsService } from '../../../seller/services/seller-listings.service';
import { SellerMessagesService } from '../../../seller/services/seller-messages.service';

@Component({
  selector: 'app-konto-overview',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="mx-auto max-w-2xl space-y-8">
      <div>
        <p class="text-xs font-semibold uppercase tracking-wide text-slate-400">Mein Konto</p>
        <h1 class="mt-1 text-3xl font-extrabold text-[#1b3a5f]">Hallo {{ greeting }} 👋</h1>
        <p class="mt-2 text-base text-slate-600">Was möchtest du tun?</p>
        <a
          routerLink="/konto/meine-anzeigen/neu"
          class="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#2f9e57] px-5 py-3 text-sm font-semibold text-white hover:bg-[#278a4b]"
        >
          <span aria-hidden="true">+</span>
          Anzeige aufgeben
        </a>
      </div>

      <div class="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <a routerLink="/konto/meine-anzeigen" class="rounded-2xl bg-white p-5 shadow-sm hover:bg-slate-50">
          <p class="text-sm font-semibold text-slate-800">Meine Anzeigen</p>
          <p class="mt-2 text-3xl font-extrabold text-[#2f9e57]">{{ listings.activeCount() }}</p>
          <p class="mt-1 text-sm text-slate-500">aktiv</p>
        </a>
        <a routerLink="/konto/nachrichten" class="rounded-2xl bg-white p-5 shadow-sm hover:bg-slate-50">
          <p class="text-sm font-semibold text-slate-800">Nachrichten</p>
          <p class="mt-2 text-3xl font-extrabold text-[#1b3a5f]">{{ messages.unreadCount() }}</p>
          <p class="mt-1 text-sm text-slate-500">ungelesen</p>
        </a>
        <a routerLink="/konto/favoriten" class="rounded-2xl bg-white p-5 shadow-sm hover:bg-slate-50">
          <p class="text-sm font-semibold text-slate-800">Favoriten</p>
          <p class="mt-2 text-3xl font-extrabold text-[#6f4ea1]">{{ activity.favorites().length }}</p>
          <p class="mt-1 text-sm text-slate-500">gespeichert</p>
        </a>
      </div>
    </div>
  `,
})
export class KontoOverviewComponent {
  readonly listings = inject(SellerListingsService);
  readonly messages = inject(SellerMessagesService);
  readonly activity = inject(BuyerActivityService);
  private readonly auth = inject(AuthService);

  get greeting(): string {
    return this.auth.currentUser()?.firstName || 'Mitglied';
  }
}
