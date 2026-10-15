import { Component, computed, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AdminHomepageBannerComponent } from '../../components/admin-homepage-banner/admin-homepage-banner.component';
import { AdminDirectoryService } from '../../services/admin-directory.service';

@Component({
  selector: 'app-admin-empty-list',
  standalone: true,
  imports: [AdminHomepageBannerComponent],
  template: `
    @if (kind() === 'ads') {
      <app-admin-homepage-banner />
    }
    <section class="rounded-2xl bg-white p-5 shadow-sm">
      <h1 class="text-lg font-bold text-slate-800">{{ title() }}</h1>
      @if (kind() === 'subscriptions' && directory.subscriptions().length > 0) {
        <div class="mt-4 overflow-x-auto">
          <table class="min-w-full text-left text-sm">
            <thead class="text-xs uppercase tracking-wide text-slate-400">
              <tr>
                <th class="px-2 py-2 font-semibold">E-Mail</th>
                <th class="px-2 py-2 font-semibold">Firma</th>
                <th class="px-2 py-2 font-semibold">Betrag</th>
                <th class="px-2 py-2 font-semibold">Bezahlt</th>
                <th class="px-2 py-2 font-semibold">Aktiv bis</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              @for (subscription of directory.subscriptions(); track subscription.id) {
                <tr>
                  <td class="px-2 py-2 text-slate-700">{{ subscription.sellerEmail }}</td>
                  <td class="px-2 py-2 font-medium text-slate-800">{{ subscription.companyName }}</td>
                  <td class="px-2 py-2 text-slate-700">{{ money(subscription.amountCents) }}</td>
                  <td class="px-2 py-2 text-slate-500">{{ formatDate(subscription.paidAt) }}</td>
                  <td class="px-2 py-2 text-slate-500">{{ formatDate(subscription.activeUntil) }}</td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      } @else if (kind() !== 'subscriptions' && directory.payments().length > 0) {
        <div class="mt-4 overflow-x-auto">
          <table class="min-w-full text-left text-sm">
            <thead class="text-xs uppercase tracking-wide text-slate-400">
              <tr>
                <th class="px-2 py-2 font-semibold">E-Mail</th>
                <th class="px-2 py-2 font-semibold">Anzeige</th>
                <th class="px-2 py-2 font-semibold">Betrag</th>
                <th class="px-2 py-2 font-semibold">Bezahlt</th>
                <th class="px-2 py-2 font-semibold">Top bis</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              @for (payment of directory.payments(); track payment.id) {
                <tr>
                  <td class="px-2 py-2 text-slate-700">{{ payment.sellerEmail }}</td>
                  <td class="px-2 py-2 font-medium text-slate-800">{{ payment.listingTitle }}</td>
                  <td class="px-2 py-2 text-slate-700">{{ money(payment.amountCents) }}</td>
                  <td class="px-2 py-2 text-slate-500">{{ formatDate(payment.paidAt) }}</td>
                  <td class="px-2 py-2 text-slate-500">{{ formatDate(payment.promotedUntil) }}</td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      } @else {
        <p class="mt-6 py-8 text-center text-sm text-slate-400">{{ emptyText() }}</p>
      }
    </section>
  `,
})
export class AdminEmptyListComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  readonly directory = inject(AdminDirectoryService);

  readonly kind = computed(() => this.route.snapshot.data['kind'] as string);
  readonly title = computed(() => {
    switch (this.kind()) {
      case 'ads':
        return 'Werbung';
      case 'subscriptions':
        return 'Abonnements';
      default:
        return 'Zahlungen';
    }
  });
  readonly emptyText = computed(() => {
    switch (this.kind()) {
      case 'ads':
        return 'Noch keine Top-Anzeigen.';
      case 'subscriptions':
        return 'Noch keine Profi-Profile.';
      default:
        return 'Noch keine Zahlungen. Zahlungen erscheinen hier nach dem Checkout.';
    }
  });

  ngOnInit(): void {
    void this.directory.refresh();
  }

  formatDate(value: string): string {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      return value;
    }
    return date.toLocaleDateString('de-AT');
  }

  money(cents: number): string {
    return (cents / 100).toLocaleString('de-AT', { style: 'currency', currency: 'EUR' });
  }
}
