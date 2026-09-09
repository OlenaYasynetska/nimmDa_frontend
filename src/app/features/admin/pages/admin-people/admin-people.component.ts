import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';
import { AdminDirectoryService } from '../../services/admin-directory.service';

@Component({
  selector: 'app-admin-people',
  standalone: true,
  template: `
    <section class="rounded-2xl bg-white p-5 shadow-sm">
      <div class="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h1 class="text-lg font-bold text-slate-800">{{ title() }}</h1>
        <input
          type="search"
          [placeholder]="kind() === 'buyers' ? 'Käufer suchen' : 'Verkäufer suchen'"
          class="rounded-xl border-0 bg-slate-100 px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-200"
          (input)="query.set($any($event.target).value)"
        />
      </div>
      @if (rows().length === 0) {
        <p class="py-8 text-sm text-slate-400">Noch keine Einträge.</p>
      } @else {
        <div class="overflow-x-auto">
          <table class="min-w-full text-left text-sm">
            <thead class="text-xs uppercase tracking-wide text-slate-400">
              <tr>
                <th class="px-2 py-2 font-semibold">Name</th>
                <th class="px-2 py-2 font-semibold">E-Mail</th>
                <th class="px-2 py-2 font-semibold">Status</th>
                <th class="px-2 py-2 font-semibold">Anzeigen</th>
                <th class="px-2 py-2 font-semibold">Registriert</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              @for (user of rows(); track user.id) {
                <tr>
                  <td class="px-2 py-2 font-medium text-slate-800">{{ user.firstName }} {{ user.lastName }}</td>
                  <td class="px-2 py-2 text-slate-600">{{ user.email }}</td>
                  <td class="px-2 py-2 text-[#2f9e57]">Aktiv</td>
                  <td class="px-2 py-2 text-slate-600">{{ user.listingCount }}</td>
                  <td class="px-2 py-2 text-slate-500">{{ formatDate(user.createdAt) }}</td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      }
    </section>
  `,
})
export class AdminPeopleComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  readonly directory = inject(AdminDirectoryService);
  readonly query = signal('');
  readonly kind = toSignal(this.route.data.pipe(map((data) => data['kind'] as 'sellers' | 'buyers')), {
    initialValue: 'sellers',
  });
  readonly title = computed(() => (this.kind() === 'buyers' ? 'Käufer' : 'Verkäufer'));
  readonly rows = computed(() => {
    const list = this.kind() === 'buyers' ? this.directory.buyers() : this.directory.sellers();
    const q = this.query().trim().toLowerCase();
    if (!q) {
      return list;
    }
    return list.filter(
      (user) =>
        user.email.toLowerCase().includes(q) ||
        `${user.firstName} ${user.lastName}`.toLowerCase().includes(q)
    );
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
}
