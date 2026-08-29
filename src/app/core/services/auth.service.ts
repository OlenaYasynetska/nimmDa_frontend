import { Injectable, computed, signal } from '@angular/core';
import type { AuthUser } from '../models';

const AUTH_STORAGE_KEY = 'nimmda.auth.user';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly currentUserSignal = signal<AuthUser | null>(this.readStoredUser());

  readonly currentUser = this.currentUserSignal.asReadonly();
  readonly isAuthenticated = computed(() => this.currentUserSignal() !== null);

  getAccessToken(): string | null {
    return this.currentUserSignal()?.accessToken ?? null;
  }

  logout(): void {
    this.currentUserSignal.set(null);
    sessionStorage.removeItem(AUTH_STORAGE_KEY);
  }

  registerSeller(email: string): void {
    const parts = (email.split('@')[0] || 'Verkäufer')
      .split(/[._-]+/)
      .filter(Boolean)
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase());
    const user: AuthUser = {
      id: 'seller-local',
      email,
      firstName: parts[0] || 'Verkäufer',
      lastName: parts.slice(1).join(' '),
      role: 'seller',
      accessToken: 'demo-token',
      expiresAt: Date.now() + 1000 * 60 * 60 * 24,
    };
    this.currentUserSignal.set(user);
    sessionStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
  }

  private readStoredUser(): AuthUser | null {
    try {
      const raw = sessionStorage.getItem(AUTH_STORAGE_KEY);
      return raw ? (JSON.parse(raw) as AuthUser) : null;
    } catch {
      return null;
    }
  }
}
