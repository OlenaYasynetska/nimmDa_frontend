import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ButtonComponent } from '../../shared/components/button/button.component';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, ButtonComponent],
  template: `
    <header
      class="flex h-14 items-center justify-between border-b border-gray-200 bg-white px-6"
    >
      <a routerLink="/" class="text-lg font-semibold text-gray-900">NimmDa</a>
      <div class="flex items-center gap-4">
        @if (auth.currentUser(); as user) {
          <span class="text-sm text-gray-600">{{ user.firstName }} {{ user.lastName }}</span>
          <app-button (click)="auth.logout()">Logout</app-button>
        } @else {
          <a routerLink="/login" class="text-sm font-medium text-primary">Login</a>
        }
      </div>
    </header>
  `,
})
export class NavbarComponent {
  constructor(readonly auth: AuthService) {}
}
