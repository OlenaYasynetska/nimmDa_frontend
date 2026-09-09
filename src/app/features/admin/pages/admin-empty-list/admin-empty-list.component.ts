import { Component, computed, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-admin-empty-list',
  standalone: true,
  template: `
    <section class="rounded-2xl bg-white p-5 shadow-sm">
      <h1 class="text-lg font-bold text-slate-800">{{ title() }}</h1>
      <p class="mt-6 py-8 text-center text-sm text-slate-400">{{ emptyText() }}</p>
    </section>
  `,
})
export class AdminEmptyListComponent {
  private readonly route = inject(ActivatedRoute);

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
        return 'Noch keine Werbekunden.';
      case 'subscriptions':
        return 'Noch keine Abonnements.';
      default:
        return 'Noch keine Zahlungen. Zahlungen erscheinen hier nach dem Checkout.';
    }
  });
}
