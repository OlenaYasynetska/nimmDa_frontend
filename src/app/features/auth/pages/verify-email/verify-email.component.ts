import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AuthFlowException, AuthService } from '../../../../core/services/auth.service';
import { AuthModalComponent } from '../../components/auth-modal/auth-modal.component';
import { AUTH_ERRORS } from '../../data/auth.content';

@Component({
  selector: 'app-verify-email',
  standalone: true,
  imports: [RouterLink, AuthModalComponent],
  template: `
    <app-auth-modal titleId="verify-title" closeLabel="Bestätigung schließen">
      <h1 id="verify-title" class="mb-2 text-center text-2xl font-bold text-slate-900">
        E-Mail bestätigen
      </h1>
      @if (loading()) {
        <p class="text-center text-sm text-slate-500">Dein Konto wird bestätigt …</p>
      } @else if (verified()) {
        <p class="mb-4 rounded-lg bg-emerald-50 px-3 py-2 text-center text-sm text-emerald-800">
          {{ message() }}
        </p>
        <p class="text-center text-sm">
          <a
            routerLink="/auth/login"
            [queryParams]="{ verified: '1' }"
            class="font-medium text-primary hover:underline"
          >
            Zur Anmeldung
          </a>
        </p>
      } @else {
        <p class="mb-4 text-center text-sm text-red-600">{{ error() }}</p>
        <p class="text-center text-sm">
          <a routerLink="/auth/register" class="text-primary hover:underline">Neu registrieren</a>
          <span class="text-slate-400"> · </span>
          <a routerLink="/auth/login" class="text-primary hover:underline">Zur Anmeldung</a>
        </p>
      }
    </app-auth-modal>
  `,
})
export class VerifyEmailComponent implements OnInit {
  private readonly auth = inject(AuthService);
  private readonly route = inject(ActivatedRoute);

  readonly loading = signal(true);
  readonly verified = signal(false);
  readonly message = signal('E-Mail bestätigt. Du kannst dich jetzt anmelden.');
  readonly error = signal<string | null>(null);

  async ngOnInit(): Promise<void> {
    const token = this.route.snapshot.queryParamMap.get('token')?.trim() ?? '';
    if (!token) {
      this.loading.set(false);
      this.error.set(AUTH_ERRORS.expired);
      return;
    }
    try {
      const result = await this.auth.verifyEmail(token);
      this.verified.set(result.verified);
      this.message.set(result.message || this.message());
    } catch (error) {
      const code = error instanceof AuthFlowException ? error.code : 'expired';
      this.error.set(AUTH_ERRORS[code]);
    } finally {
      this.loading.set(false);
    }
  }
}
