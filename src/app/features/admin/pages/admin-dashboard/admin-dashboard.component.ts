import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AdminDirectoryService } from '../../services/admin-directory.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="mx-auto max-w-7xl space-y-6">
      <div>
        <h1 class="text-2xl font-extrabold text-[#1b3a5f]">Dashboard</h1>
        <p class="mt-1 text-sm text-slate-500">Übersicht über Nutzer, Anzeigen und Zahlungen.</p>
      </div>

      <div class="grid grid-cols-2 gap-3 md:grid-cols-4">
        <article class="rounded-2xl bg-white p-4 shadow-sm">
          <p class="text-xs font-medium text-slate-500">Käufer</p>
          <p class="mt-1 text-2xl font-extrabold text-[#2f9e57]">{{ directory.overview().buyerCount }}</p>
        </article>
        <article class="rounded-2xl bg-white p-4 shadow-sm">
          <p class="text-xs font-medium text-slate-500">Verkäufer</p>
          <p class="mt-1 text-2xl font-extrabold text-[#6f4ea1]">{{ directory.overview().sellerCount }}</p>
        </article>
        <article class="rounded-2xl bg-white p-4 shadow-sm">
          <p class="text-xs font-medium text-slate-500">Anzeigen</p>
          <p class="mt-1 text-2xl font-extrabold text-[#d97706]">{{ directory.overview().listingCount }}</p>
        </article>
        <article class="rounded-2xl bg-white p-4 shadow-sm">
          <p class="text-xs font-medium text-slate-500">Abonnements</p>
          <p class="mt-1 text-2xl font-extrabold text-[#2f6fb2]">{{ directory.overview().subscriptionCount }}</p>
        </article>
      </div>

      <section class="rounded-2xl bg-white p-5 shadow-sm">
        <div class="mb-4 flex items-center justify-between gap-3">
          <h2 class="text-lg font-bold text-slate-800">Nutzer</h2>
          <a routerLink="/admin/sellers" class="text-sm font-medium text-[#2f6fb2] hover:underline">Alle anzeigen</a>
        </div>
        @if (directory.users().length === 0) {
          <p class="py-8 text-sm text-slate-400">Noch keine registrierten Nutzer.</p>
        } @else {
          <div class="overflow-x-auto">
            <table class="min-w-full text-left text-sm">
              <thead class="text-xs uppercase tracking-wide text-slate-400">
                <tr>
                  <th class="px-2 py-2 font-semibold">Name</th>
                  <th class="px-2 py-2 font-semibold">E-Mail</th>
                  <th class="px-2 py-2 font-semibold">Rolle</th>
                  <th class="px-2 py-2 font-semibold">Anzeigen</th>
                  <th class="px-2 py-2 font-semibold">Registriert</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100">
                @for (user of directory.users(); track user.id) {
                  <tr>
                    <td class="px-2 py-2 font-medium text-slate-800">{{ user.firstName }} {{ user.lastName }}</td>
                    <td class="px-2 py-2 text-slate-600">{{ user.email }}</td>
                    <td class="px-2 py-2 text-slate-600">{{ roleLabel(user.accountMode) }}</td>
                    <td class="px-2 py-2 text-slate-600">{{ user.listingCount }}</td>
                    <td class="px-2 py-2 text-slate-500">{{ formatDate(user.createdAt) }}</td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        }
      </section>

      <section class="rounded-2xl bg-white p-5 shadow-sm">
        <h2 class="text-lg font-bold text-slate-800">Zahlungsverlauf</h2>
        <p class="mt-6 py-6 text-center text-sm text-slate-400">
          Noch keine Zahlungen. Zahlungen erscheinen hier nach dem Checkout.
        </p>
      </section>
    </div>
  `,
})
export class AdminDashboardComponent implements OnInit {
  readonly directory = inject(AdminDirectoryService);

  ngOnInit(): void {
    void this.directory.refresh();
  }

  roleLabel(mode: string): string {
    if (mode === 'buyer') return 'Käufer';
    if (mode === 'seller') return 'Verkäufer';
    return 'Beides';
  }

  formatDate(value: string): string {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      return value;
    }
    return date.toLocaleDateString('de-AT');
  }
}
