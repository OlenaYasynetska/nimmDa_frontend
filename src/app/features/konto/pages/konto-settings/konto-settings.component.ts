import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-konto-settings',
  standalone: true,
  template: `
    <section class="rounded-2xl bg-white p-5 shadow-sm">
      <h2 class="text-lg font-bold text-slate-800">Einstellungen</h2>
      <p class="mt-1 text-sm text-slate-500">Angemeldet als {{ auth.currentUser()?.email }}.</p>
      <button
        type="button"
        class="mt-6 rounded-lg bg-slate-100 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-200"
        (click)="logout()"
      >
        Abmelden
      </button>
    </section>
  `,
})
export class KontoSettingsComponent {
  readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  logout(): void {
    this.auth.logout();
    void this.router.navigateByUrl('/');
  }
}
