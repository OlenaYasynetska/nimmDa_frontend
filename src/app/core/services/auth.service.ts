import { Injectable, computed, signal } from '@angular/core';
import type { AuthUser } from '../models';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly currentUserSignal = signal<AuthUser | null>(null);

  readonly currentUser = this.currentUserSignal.asReadonly();
  readonly isAuthenticated = computed(() => this.currentUserSignal() !== null);

  getAccessToken(): string | null {
    return this.currentUserSignal()?.accessToken ?? null;
  }

  logout(): void {
    this.currentUserSignal.set(null);
  }
}
