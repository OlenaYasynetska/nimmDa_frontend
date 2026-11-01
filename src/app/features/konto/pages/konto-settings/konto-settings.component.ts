import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AuthFlowException, AuthService } from '../../../../core/services/auth.service';
import { AUTH_ERRORS } from '../../../auth/data/auth.content';

@Component({
  selector: 'app-konto-settings',
  standalone: true,
  template: `
    <section class="rounded-2xl bg-white p-5 shadow-sm">
      <h2 class="text-lg font-bold text-slate-800">Einstellungen</h2>
      <p class="mt-1 text-sm text-slate-500">Angemeldet als {{ auth.currentUser()?.email }}.</p>

      <div class="mt-6 border-t border-slate-100 pt-5">
        <h3 class="text-sm font-bold text-slate-800">Passwort ändern</h3>
        <p class="mt-1 text-sm text-slate-500">
          Wir schicken einen Link an deine E-Mail. Dort wählst du ein neues Passwort. Der Link gilt eine Stunde.
        </p>
        <button
          type="button"
          class="mt-4 rounded-lg bg-[#2f9e57] px-4 py-2.5 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-50"
          [disabled]="busy()"
          (click)="changePassword()"
        >
          Link senden
        </button>
        @if (sent()) {
          <p class="mt-3 text-sm text-[#2f9e57]">
            Der Link ist unterwegs an {{ auth.currentUser()?.email }}. Bitte prüfe Posteingang und Spam.
          </p>
        }
        @if (error()) {
          <p class="mt-3 text-sm text-red-600">{{ error() }}</p>
        }
      </div>

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
  readonly busy = signal(false);
  readonly sent = signal(false);
  readonly error = signal<string | null>(null);

  async changePassword(): Promise<void> {
    this.busy.set(true);
    this.error.set(null);
    this.sent.set(false);
    try {
      await this.auth.requestOwnPasswordChange();
      this.sent.set(true);
    } catch (err) {
      const code = err instanceof AuthFlowException ? err.code : 'mailFailed';
      this.error.set(AUTH_ERRORS[code] ?? AUTH_ERRORS.mailFailed);
    } finally {
      this.busy.set(false);
    }
  }

  logout(): void {
    this.auth.logout();
    void this.router.navigateByUrl('/');
  }
}
