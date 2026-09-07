import { Component, inject, input, OnInit, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import type { AccountRole } from '../../../../core/models/auth-account.model';
import { AuthFlowException, AuthService } from '../../../../core/services/auth.service';
import { BuyerActivityService } from '../../../buyer/services/buyer-activity.service';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { useAuthPlaceholderForm } from '../../../../shared/hooks/use-auth-placeholder-form.hook';
import { usePasswordVisibility } from '../../../../shared/hooks/use-password-visibility.hook';
import { AUTH_ERRORS } from '../../data/auth.content';
import { AuthModalComponent } from '../auth-modal/auth-modal.component';

type AccountStatus = 'new' | 'existing';

@Component({
  selector: 'app-auth-access',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, ButtonComponent, AuthModalComponent],
  template: `
    <app-auth-modal
      [titleId]="status() === 'new' ? 'register-title' : 'login-title'"
      [closeLabel]="status() === 'new' ? 'Registrierung schließen' : 'Anmeldung schließen'"
      panelClass="relative z-10 my-8 w-full max-w-md"
    >
      <h1
        [id]="status() === 'new' ? 'register-title' : 'login-title'"
        class="mb-2 text-center text-2xl font-bold text-slate-900"
      >
        {{ status() === 'new' ? 'Konto erstellen' : 'Anmelden' }}
      </h1>
      @if (verifiedNotice()) {
        <p class="mb-4 rounded-lg bg-emerald-50 px-3 py-2 text-center text-sm text-emerald-800">
          E-Mail bestätigt. Du kannst dich jetzt anmelden.
        </p>
      }
      <p class="mb-5 text-center text-sm text-slate-500">{{ hint() }}</p>

      <form [formGroup]="form" class="space-y-4" (ngSubmit)="onSubmit()" novalidate>
        <fieldset>
          <legend class="mb-2 text-sm font-medium text-slate-600">Hast du schon ein Konto?</legend>
          <div class="grid grid-cols-2 gap-2">
            <button
              type="button"
              class="rounded-xl px-3 py-2 text-sm font-medium ring-1"
              [class]="
                status() === 'existing'
                  ? 'bg-[#1b3a5f] text-white ring-[#1b3a5f]'
                  : 'bg-slate-100 text-slate-700 ring-transparent'
              "
              (click)="status.set('existing')"
            >
              Ja, anmelden
            </button>
            <button
              type="button"
              class="rounded-xl px-3 py-2 text-sm font-medium ring-1"
              [class]="
                status() === 'new'
                  ? 'bg-[#1b3a5f] text-white ring-[#1b3a5f]'
                  : 'bg-slate-100 text-slate-700 ring-transparent'
              "
              (click)="status.set('new')"
            >
              Nein, neu
            </button>
          </div>
        </fieldset>

        <fieldset>
          <legend class="mb-2 text-sm font-medium text-slate-600">Du bist …</legend>
          <div class="grid grid-cols-3 gap-2">
            @for (option of roles; track option.value) {
              <button
                type="button"
                class="rounded-xl px-2 py-2 text-xs font-medium ring-1 sm:text-sm"
                [class]="
                  role() === option.value
                    ? 'bg-[#eaf8ef] font-semibold text-[#2f9e57] ring-[#2f9e57]'
                    : 'bg-slate-100 text-slate-700 ring-transparent'
                "
                (click)="role.set(option.value)"
              >
                {{ option.label }}
              </button>
            }
          </div>
        </fieldset>

        <div>
          <label for="auth-email" class="mb-1.5 block text-sm font-medium text-slate-600">E-Mail</label>
          <input
            id="auth-email"
            type="email"
            formControlName="email"
            autocomplete="email"
            class="block w-full rounded-xl border-0 bg-slate-100 px-3 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-200"
          />
        </div>
        <div>
          <label for="auth-password" class="mb-1.5 block text-sm font-medium text-slate-600">Passwort</label>
          <div class="relative">
            <input
              id="auth-password"
              [type]="password.inputType()"
              formControlName="password"
              [autocomplete]="status() === 'new' ? 'new-password' : 'current-password'"
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
        @if (error()) {
          <p class="text-sm text-red-600">{{ error() }}</p>
        }
        <app-button type="submit" [disabled]="form.invalid || busy()">
          {{ status() === 'new' ? 'Konto erstellen' : 'Anmelden' }}
        </app-button>
      </form>
      <p class="mt-4 text-center text-sm">
        <a routerLink="/auth/forgot-password" class="text-primary hover:underline">Passwort vergessen?</a>
      </p>
    </app-auth-modal>
  `,
})
export class AuthAccessComponent implements OnInit {
  private readonly auth = inject(AuthService);
  private readonly activity = inject(BuyerActivityService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  readonly initialStatus = input<AccountStatus>('existing');
  readonly password = usePasswordVisibility();
  readonly form = useAuthPlaceholderForm();
  readonly status = signal<AccountStatus>('existing');
  readonly role = signal<AccountRole>('buyer');
  readonly error = signal<string | null>(null);
  readonly busy = signal(false);
  readonly hint = signal('Wähle, ob du neu bist, und ob du kaufen oder verkaufen möchtest.');
  readonly verifiedNotice = signal(false);
  readonly roles: { value: AccountRole; label: string }[] = [
    { value: 'buyer', label: 'Käufer' },
    { value: 'seller', label: 'Verkäufer' },
    { value: 'both', label: 'Beides' },
  ];

  ngOnInit(): void {
    this.status.set(this.initialStatus());
    const params = this.route.snapshot.queryParamMap;
    const email = params.get('email');
    const role = params.get('role');
    const returnUrl = params.get('returnUrl');
    if (email) {
      this.form.controls.email.setValue(email);
    }
    if (role === 'buyer' || role === 'seller' || role === 'both') {
      this.role.set(role);
    } else if (this.initialStatus() === 'new') {
      this.role.set('seller');
    }
    if (returnUrl) {
      this.auth.rememberReturnUrl(returnUrl);
    }
    const password = (history.state as { password?: string } | null)?.password;
    if (password) {
      this.form.controls.password.setValue(password);
    }
    if (params.get('verified') === '1') {
      this.verifiedNotice.set(true);
      this.status.set('existing');
    }
    if (params.get('intent') === 'contact') {
      this.hint.set('Um den Verkäufer zu kontaktieren, melde dich an oder erstelle ein Konto.');
      if (!params.get('role')) {
        this.role.set('buyer');
      }
    }
  }

  async onSubmit(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.busy.set(true);
    this.error.set(null);
    const email = this.form.controls.email.value;
    const password = this.form.controls.password.value;
    const role = this.role();
    try {
      if (this.status() === 'new') {
        await this.auth.register(email, password, role);
        await this.router.navigate(['/auth/check-email'], {
          queryParams: { email, type: 'verify' },
        });
        return;
      }
      await this.auth.login(email, password, role);
      this.activity.claimGuest();
      await this.router.navigateByUrl(this.auth.afterAuthPath());
    } catch (error) {
      if (error instanceof AuthFlowException && error.code === 'notFound') {
        this.status.set('new');
        this.hint.set('Kein Konto gefunden. Bitte registriere dich.');
        return;
      }
      if (error instanceof AuthFlowException && error.code === 'exists') {
        this.status.set('existing');
        this.error.set(AUTH_ERRORS.exists);
        return;
      }
      if (error instanceof AuthFlowException && error.code === 'unverified') {
        await this.router.navigate(['/auth/check-email'], {
          queryParams: { email, type: 'verify' },
        });
        return;
      }
      const code = error instanceof AuthFlowException ? error.code : 'invalid';
      this.error.set(AUTH_ERRORS[code]);
    } finally {
      this.busy.set(false);
    }
  }
}
