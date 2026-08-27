import { Component } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { CardComponent } from '../../../../shared/components/card/card.component';
import { usePasswordVisibility } from '../../../../shared/hooks/use-password-visibility.hook';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, ButtonComponent, CardComponent],
  host: {
    class: 'flex min-h-full items-center justify-center bg-slate-50 px-4 py-10',
  },
  template: `
    <app-card>
      <div class="w-full max-w-sm">
        <h1 class="mb-2 text-center text-2xl font-bold text-slate-900">Login</h1>
        <p class="mb-6 text-center text-sm text-slate-500">
          Auth API will be added later. This page is a placeholder.
        </p>
        <form [formGroup]="form" class="space-y-4" (ngSubmit)="onSubmit()" novalidate>
          <div>
            <label for="login-email" class="mb-1.5 block text-sm font-medium text-slate-600">
              Email
            </label>
            <input
              id="login-email"
              type="email"
              formControlName="email"
              autocomplete="username"
              class="block w-full rounded-xl border-0 bg-slate-100 px-3 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-200"
            />
          </div>
          <div>
            <label for="login-password" class="mb-1.5 block text-sm font-medium text-slate-600">
              Password
            </label>
            <div class="relative">
              <input
                id="login-password"
                [type]="password.inputType()"
                formControlName="password"
                autocomplete="current-password"
                class="block w-full rounded-xl border-0 bg-slate-100 px-3 py-2.5 pr-16 text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-200"
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
          <app-button type="submit" [disabled]="true">Sign in</app-button>
        </form>
        <p class="mt-4 text-center text-sm">
          <a routerLink="/" class="text-primary hover:underline">Back home</a>
        </p>
      </div>
    </app-card>
  `,
})
export class LoginComponent {
  readonly password = usePasswordVisibility();

  readonly form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  constructor(private readonly fb: FormBuilder) {}

  onSubmit(): void {
    // Auth endpoints will be wired when the backend adds them.
  }
}
