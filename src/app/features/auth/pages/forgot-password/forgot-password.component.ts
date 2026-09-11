import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { AuthModalComponent } from '../../components/auth-modal/auth-modal.component';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, ButtonComponent, AuthModalComponent],
  template: `
    <app-auth-modal titleId="forgot-title" closeLabel="Passwort-Hilfe schließen">
      <h1 id="forgot-title" class="mb-2 text-center text-2xl font-bold text-slate-900">
        Passwort vergessen
      </h1>
      <p class="mb-6 text-center text-sm text-slate-500">
        Wir senden dir einen Link zum Zurücksetzen per E-Mail.
      </p>
      <form [formGroup]="form" class="space-y-4" (ngSubmit)="onSubmit()" novalidate>
        <div>
          <label for="forgot-email" class="mb-1.5 block text-sm font-medium text-slate-600">
            E-Mail
          </label>
          <input
            id="forgot-email"
            type="email"
            formControlName="email"
            autocomplete="email"
            class="block w-full rounded-xl border-0 bg-slate-100 px-3 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-200"
          />
        </div>
        <app-button type="submit" [disabled]="form.invalid || busy()">Link senden</app-button>
      </form>
      <p class="mt-4 text-center text-sm">
        <a routerLink="/login" class="text-primary hover:underline">Zurück zur Anmeldung</a>
      </p>
    </app-auth-modal>
  `,
})
export class ForgotPasswordComponent {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);

  readonly form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
  });
  readonly busy = signal(false);

  async onSubmit(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.busy.set(true);
    try {
      const email = this.form.controls.email.value;
      await this.auth.requestPasswordReset(email);
        await this.router.navigate(['/check-email'], {
        queryParams: { email, type: 'reset' },
      });
    } finally {
      this.busy.set(false);
    }
  }
}
