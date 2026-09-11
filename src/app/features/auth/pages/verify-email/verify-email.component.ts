import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
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
      } @else if (error()) {
        <p class="mb-4 text-center text-sm text-red-600">{{ error() }}</p>
        <p class="text-center text-sm">
          <a routerLink="/register" class="text-primary hover:underline">Neu registrieren</a>
          <span class="text-slate-400"> · </span>
          <a routerLink="/login" class="text-primary hover:underline">Zur Anmeldung</a>
        </p>
      } @else {
        <p class="mb-4 text-center text-sm text-slate-600">
          Dein Konto ist aktiviert. Bitte melde dich an.
        </p>
        <a
          routerLink="/login"
          [queryParams]="loginParams()"
          class="inline-flex w-full items-center justify-center rounded-lg bg-primary px-4 py-2 font-medium text-white hover:opacity-90"
        >
          Zur Anmeldung
        </a>
      }
    </app-auth-modal>
  `,
})
export class VerifyEmailComponent implements OnInit {
  private readonly auth = inject(AuthService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  readonly loading = signal(true);
  readonly error = signal<string | null>(null);
  readonly loginParams = signal<{ verified: string; email?: string }>({ verified: '1' });

  async ngOnInit(): Promise<void> {
    const token = this.route.snapshot.queryParamMap.get('token')?.trim() ?? '';
    if (!token) {
      this.loading.set(false);
      this.error.set(AUTH_ERRORS.expired);
      return;
    }
    try {
      const result = await this.auth.verifyEmail(token);
      const params: { verified: string; email?: string } = { verified: '1' };
      if (result.email) {
        params.email = result.email;
      }
      this.loginParams.set(params);
      this.loading.set(false);
      await this.router.navigate(['/login'], { queryParams: params });
    } catch (error) {
      const code = error instanceof AuthFlowException ? error.code : 'expired';
      this.error.set(AUTH_ERRORS[code]);
      this.loading.set(false);
    }
  }
}
