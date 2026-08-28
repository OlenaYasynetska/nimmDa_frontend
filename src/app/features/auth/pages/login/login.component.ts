import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { useAuthPlaceholderForm } from '../../../../shared/hooks/use-auth-placeholder-form.hook';
import { usePasswordVisibility } from '../../../../shared/hooks/use-password-visibility.hook';
import { AuthModalComponent } from '../../components/auth-modal/auth-modal.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, ButtonComponent, AuthModalComponent],
  template: `
    <app-auth-modal titleId="login-title" closeLabel="Close login">
      <h1 id="login-title" class="mb-2 text-center text-2xl font-bold text-slate-900">Login</h1>
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
    </app-auth-modal>
  `,
})
export class LoginComponent {
  readonly password = usePasswordVisibility();
  readonly form = useAuthPlaceholderForm();

  onSubmit(): void {
    // Auth endpoints will be wired when the backend adds them.
  }
}
