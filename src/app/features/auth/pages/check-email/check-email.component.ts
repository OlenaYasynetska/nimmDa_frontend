import { Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { map } from 'rxjs';
import type { AuthMailType } from '../../../../core/models/auth-account.model';
import { AuthService } from '../../../../core/services/auth.service';
import { AuthModalComponent } from '../../components/auth-modal/auth-modal.component';
import { checkEmailCopy } from '../../data/auth.content';

@Component({
  selector: 'app-check-email',
  standalone: true,
  imports: [RouterLink, AuthModalComponent],
  template: `
    <app-auth-modal titleId="check-email-title" closeLabel="Hinweis schließen">
      <h1 id="check-email-title" class="mb-2 text-center text-2xl font-bold text-slate-900">
        {{ copy().title }}
      </h1>
      <p class="mb-2 text-center text-sm text-slate-500">
        @if (mailSent()) {
          {{ copy().body }}
        } @else {
          Die E-Mail konnte noch nicht zugestellt werden. Öffne den Bestätigungslink hier, um fortzufahren.
        }
      </p>
      @if (email()) {
        <p class="mb-6 text-center text-sm font-medium text-slate-700">{{ email() }}</p>
      }
      @if (mailUrl()) {
        <a
          [href]="mailUrl()"
          class="mb-3 inline-flex w-full items-center justify-center rounded-lg bg-primary px-4 py-2 font-medium text-white hover:opacity-90"
        >
          {{ copy().action }}
        </a>
      }
      @if (mailtoHref()) {
        <a
          [href]="mailtoHref()"
          class="mb-3 block text-center text-sm text-primary hover:underline"
        >
          In E-Mail-App öffnen
        </a>
      }
      <button
        type="button"
        class="w-full text-center text-sm text-primary hover:underline disabled:opacity-50"
        [disabled]="busy()"
        (click)="resend()"
      >
        E-Mail erneut senden
      </button>
      @if (resent()) {
        <p class="mt-2 text-center text-xs text-slate-500">Neue E-Mail wurde gesendet.</p>
      }
      <p class="mt-4 text-center text-sm">
        <a routerLink="/auth/login" class="text-primary hover:underline">Zur Anmeldung</a>
      </p>
    </app-auth-modal>
  `,
})
export class CheckEmailComponent {
  private readonly auth = inject(AuthService);
  private readonly route = inject(ActivatedRoute);

  private readonly params = toSignal(
    this.route.queryParamMap.pipe(
      map((query) => ({
        email: query.get('email') ?? '',
        type: (query.get('type') === 'reset' ? 'reset' : 'verify') as AuthMailType,
      }))
    ),
    {
      initialValue: {
        email: this.route.snapshot.queryParamMap.get('email') ?? '',
        type: (this.route.snapshot.queryParamMap.get('type') === 'reset'
          ? 'reset'
          : 'verify') as AuthMailType,
      },
    }
  );

  readonly email = computed(() => this.params().email);
  readonly type = computed(() => this.params().type);
  readonly copy = computed(() => checkEmailCopy(this.type()));
  readonly mailUrl = computed(() => this.auth.mailLinkFor(this.email(), this.type()));
  readonly mailSent = computed(() => this.auth.lastMail()?.mailSent === true);
  readonly mailtoHref = computed(() => {
    const email = this.email();
    const url = this.mailUrl();
    if (!email || !url) {
      return null;
    }
    const subject =
      this.type() === 'reset' ? 'NimmDa: Passwort zurücksetzen' : 'NimmDa: E-Mail bestätigen';
    const body = `Hallo,\n\nbitte öffne diesen Link:\n${url}\n`;
    return `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  });
  readonly busy = signal(false);
  readonly resent = signal(false);

  async resend(): Promise<void> {
    this.busy.set(true);
    try {
      if (this.type() === 'reset') {
        await this.auth.requestPasswordReset(this.email());
      } else {
        await this.auth.resendVerification(this.email());
      }
      this.resent.set(true);
    } finally {
      this.busy.set(false);
    }
  }
}
