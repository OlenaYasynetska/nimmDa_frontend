import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthFlowException, AuthService } from '../../../../core/services/auth.service';
import { BuyerActivityService } from '../../../buyer/services/buyer-activity.service';
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
      @if (error()) {
        <p class="mb-4 text-center text-sm text-red-600">{{ error() }}</p>
        <p class="text-center text-sm">
          <a routerLink="/auth/register" class="text-primary hover:underline">Neu registrieren</a>
        </p>
      } @else {
        <p class="text-center text-sm text-slate-500">Dein Konto wird bestätigt …</p>
      }
    </app-auth-modal>
  `,
})
export class VerifyEmailComponent implements OnInit {
  private readonly auth = inject(AuthService);
  private readonly activity = inject(BuyerActivityService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  readonly error = signal<string | null>(null);

  async ngOnInit(): Promise<void> {
    const token = this.route.snapshot.queryParamMap.get('token');
    if (!token) {
      this.error.set(AUTH_ERRORS.expired);
      return;
    }
    try {
      await this.auth.verifyEmail(token);
      this.activity.claimGuest();
      await this.router.navigateByUrl(this.auth.afterAuthPath());
    } catch (error) {
      const code = error instanceof AuthFlowException ? error.code : 'expired';
      this.error.set(AUTH_ERRORS[code]);
    }
  }
}
