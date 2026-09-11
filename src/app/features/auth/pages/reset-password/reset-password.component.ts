import { Component, inject, OnInit, signal } from '@angular/core';
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthFlowException, AuthService } from '../../../../core/services/auth.service';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { usePasswordVisibility } from '../../../../shared/hooks/use-password-visibility.hook';
import { AuthModalComponent } from '../../components/auth-modal/auth-modal.component';
import { AUTH_ERRORS } from '../../data/auth.content';

function matchPasswords(group: AbstractControl): ValidationErrors | null {
  const password = group.get('password')?.value;
  const confirm = group.get('confirm')?.value;
  return password === confirm ? null : { mismatch: true };
}

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, ButtonComponent, AuthModalComponent],
  template: `
    <app-auth-modal titleId="reset-title" closeLabel="Passwort zurücksetzen schließen">
      <h1 id="reset-title" class="mb-2 text-center text-2xl font-bold text-slate-900">
        Neues Passwort
      </h1>
      <p class="mb-6 text-center text-sm text-slate-500">
        Wähle ein neues Passwort für dein Konto.
      </p>
      <form [formGroup]="form" class="space-y-4" (ngSubmit)="onSubmit()" novalidate>
        <div>
          <label for="reset-password" class="mb-1.5 block text-sm font-medium text-slate-600">
            Passwort
          </label>
          <div class="relative">
            <input
              id="reset-password"
              [type]="password.inputType()"
              formControlName="password"
              autocomplete="new-password"
              class="block w-full rounded-xl border-0 bg-slate-100 px-3 py-2.5 pr-20 text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-200"
            />
            <button
              type="button"
              class="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-slate-500"
              (click)="password.toggle()"
            >
              {{ password.toggleLabel() }}
            </button>
          </div>
        </div>
        <div>
          <label for="reset-confirm" class="mb-1.5 block text-sm font-medium text-slate-600">
            Passwort bestätigen
          </label>
          <input
            id="reset-confirm"
            [type]="password.inputType()"
            formControlName="confirm"
            autocomplete="new-password"
            class="block w-full rounded-xl border-0 bg-slate-100 px-3 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-200"
          />
        </div>
        @if (error()) {
          <p class="text-sm text-red-600">{{ error() }}</p>
        }
        <app-button type="submit" [disabled]="form.invalid || busy() || !token">
          Passwort speichern
        </app-button>
      </form>
      <p class="mt-4 text-center text-sm">
        <a routerLink="/login" class="text-primary hover:underline">Zur Anmeldung</a>
      </p>
    </app-auth-modal>
  `,
})
export class ResetPasswordComponent implements OnInit {
  private readonly auth = inject(AuthService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);

  readonly password = usePasswordVisibility();
  readonly form = this.fb.nonNullable.group(
    {
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirm: ['', Validators.required],
    },
    { validators: matchPasswords }
  );
  readonly error = signal<string | null>(null);
  readonly busy = signal(false);
  token = '';

  ngOnInit(): void {
    this.token = this.route.snapshot.queryParamMap.get('token') ?? '';
    if (!this.token) {
      this.error.set(AUTH_ERRORS.expired);
    }
  }

  async onSubmit(): Promise<void> {
    if (this.form.invalid || !this.token) {
      this.form.markAllAsTouched();
      if (this.form.hasError('mismatch')) {
        this.error.set(AUTH_ERRORS.mismatch);
      }
      return;
    }
    this.busy.set(true);
    this.error.set(null);
    try {
      await this.auth.resetPassword(this.token, this.form.controls.password.value);
      await this.router.navigateByUrl('/login');
    } catch (error) {
      const code = error instanceof AuthFlowException ? error.code : 'expired';
      this.error.set(AUTH_ERRORS[code]);
    } finally {
      this.busy.set(false);
    }
  }
}
