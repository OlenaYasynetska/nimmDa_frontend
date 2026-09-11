import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import type {
  AuthFlowError,
  AuthMailType,
  LastAuthMail,
} from '../models/auth-account.model';
import type { AuthUser } from '../models';

const USER_KEY = 'nimmda.auth.user';
const LAST_MAIL_KEY = 'nimmda.auth.last-mail';
const RETURN_URL_KEY = 'nimmda.auth.return-url';

interface AuthSessionDto {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'user' | string;
  accountMode?: string;
  accessToken: string;
  expiresAt: number;
}

interface MailResultDto {
  mailSent: boolean;
}

interface VerifyEmailDto {
  message: string;
  verified: boolean;
  email?: string | null;
}

export class AuthFlowException extends Error {
  constructor(readonly code: AuthFlowError) {
    super(code);
    this.name = 'AuthFlowException';
  }
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly currentUserSignal = signal<AuthUser | null>(this.readJson(USER_KEY));
  private readonly lastMailSignal = signal<LastAuthMail | null>(this.readJson(LAST_MAIL_KEY, 'session'));

  readonly currentUser = this.currentUserSignal.asReadonly();
  readonly lastMail = this.lastMailSignal.asReadonly();
  readonly isAuthenticated = computed(() => this.currentUserSignal() !== null);
  readonly role = computed(() => {
    const raw = this.currentUserSignal()?.role;
    if (raw === 'admin') {
      return 'admin';
    }
    return this.currentUserSignal() ? 'user' : null;
  });
  readonly isAdmin = computed(() => this.currentUserSignal()?.role === 'admin');
  readonly canSell = computed(() => this.isAuthenticated() && !this.isAdmin());
  readonly canBuy = computed(() => this.isAuthenticated() && !this.isAdmin());

  homePath(): string {
    if (this.isAdmin()) {
      return '/admin';
    }
    return '/konto';
  }

  rememberReturnUrl(url?: string | null): void {
    const value = this.safeReturnUrl(url);
    if (value) {
      localStorage.setItem(RETURN_URL_KEY, value);
      sessionStorage.setItem(RETURN_URL_KEY, value);
    }
  }

  consumeReturnUrl(): string | null {
    const value =
      this.safeReturnUrl(localStorage.getItem(RETURN_URL_KEY)) ??
      this.safeReturnUrl(sessionStorage.getItem(RETURN_URL_KEY));
    localStorage.removeItem(RETURN_URL_KEY);
    sessionStorage.removeItem(RETURN_URL_KEY);
    return value;
  }

  afterAuthPath(): string {
    return this.consumeReturnUrl() || this.homePath();
  }

  private safeReturnUrl(url?: string | null): string | null {
    const value = url?.trim();
    if (!value || !value.startsWith('/') || value.startsWith('//') || value.includes('://')) {
      return null;
    }
    return value;
  }

  getAccessToken(): string | null {
    return this.currentUserSignal()?.accessToken ?? null;
  }

  logout(): void {
    this.currentUserSignal.set(null);
    sessionStorage.removeItem(USER_KEY);
  }

  async register(email: string, password: string): Promise<void> {
    const result = await this.postMail('/auth/register', { email, password });
    this.rememberMail(email, 'verify', result);
  }

  async login(email: string, password: string): Promise<void> {
    const session = await this.postSession('/auth/login', { email, password });
    this.setSession(this.toUser(session));
  }

  async verifyEmail(token: string): Promise<{ message: string; verified: boolean; email: string | null }> {
    this.logout();
    try {
      const result = await firstValueFrom(
        this.http.post<VerifyEmailDto>(`${environment.apiUrl}/auth/verify`, { token })
      );
      return {
        message: result.message,
        verified: result.verified === true,
        email: result.email?.trim() ? result.email.trim() : null,
      };
    } catch (error) {
      return this.throwAuth(error);
    }
  }

  async requestPasswordReset(email: string): Promise<void> {
    const result = await this.postMail('/auth/forgot-password', { email });
    this.rememberMail(email, 'reset', result);
  }

  async resetPassword(token: string, password: string): Promise<void> {
    await this.postVoid('/auth/reset-password', { token, password });
    this.logout();
  }

  async resendVerification(email: string): Promise<void> {
    const result = await this.postMail('/auth/resend-verification', { email });
    this.rememberMail(email, 'verify', result);
  }

  async resendLastMail(): Promise<void> {
    const last = this.lastMailSignal();
    if (!last) {
      return;
    }
    if (last.type === 'reset') {
      await this.requestPasswordReset(last.email);
      return;
    }
    await this.resendVerification(last.email);
  }

  private rememberMail(email: string, type: AuthMailType, result: MailResultDto): void {
    const mail: LastAuthMail = {
      email: this.normalizeEmail(email),
      type,
      mailSent: result.mailSent === true,
    };
    this.lastMailSignal.set(mail);
    this.writeJson(LAST_MAIL_KEY, mail, 'session');
  }

  private toUser(session: AuthSessionDto): AuthUser {
    return {
      id: session.id,
      email: session.email,
      firstName: session.firstName,
      lastName: session.lastName,
      role: session.role === 'admin' ? 'admin' : 'user',
      accessToken: session.accessToken,
      expiresAt: session.expiresAt,
    };
  }

  private setSession(user: AuthUser): void {
    this.currentUserSignal.set(user);
    sessionStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  private normalizeEmail(email: string): string {
    return email.trim().toLowerCase();
  }

  private async postSession(path: string, body: unknown): Promise<AuthSessionDto> {
    try {
      return await firstValueFrom(
        this.http.post<AuthSessionDto>(`${environment.apiUrl}${path}`, body)
      );
    } catch (error) {
      return this.throwAuth(error);
    }
  }

  private async postMail(path: string, body: unknown): Promise<MailResultDto> {
    try {
      return await firstValueFrom(
        this.http.post<MailResultDto>(`${environment.apiUrl}${path}`, body)
      );
    } catch (error) {
      return this.throwAuth(error);
    }
  }

  private async postVoid(path: string, body: unknown): Promise<void> {
    try {
      await firstValueFrom(
        this.http.post(`${environment.apiUrl}${path}`, body, { responseType: 'text' })
      );
    } catch (error) {
      this.throwAuth(error);
    }
  }

  private throwAuth(error: unknown): never {
    if (error instanceof AuthFlowException) {
      throw error;
    }
    if (error instanceof HttpErrorResponse) {
      if (error.status === 0) {
        throw new AuthFlowException('network');
      }
      const body = error.error as { code?: string } | string | null;
      const code = typeof body === 'object' && body?.code ? body.code : this.codeFromStatus(error.status);
      if (this.isAuthCode(code)) {
        throw new AuthFlowException(code);
      }
    }
    throw new AuthFlowException('network');
  }

  private codeFromStatus(status: number): AuthFlowError {
    if (status === 409) return 'exists';
    if (status === 404) return 'notFound';
    if (status === 403) return 'unverified';
    if (status === 400) return 'expired';
    if (status === 503) return 'mailFailed';
    return 'invalid';
  }

  private isAuthCode(code: string): code is AuthFlowError {
    return (
      code === 'exists' ||
      code === 'invalid' ||
      code === 'notFound' ||
      code === 'unverified' ||
      code === 'expired' ||
      code === 'mismatch' ||
      code === 'mailFailed' ||
      code === 'network'
    );
  }

  private readJson<T>(key: string, storage: 'local' | 'session' = 'session'): T | null {
    try {
      const raw =
        storage === 'session'
          ? sessionStorage.getItem(key)
          : (localStorage.getItem(key) ?? sessionStorage.getItem(key));
      return raw ? (JSON.parse(raw) as T) : null;
    } catch {
      return null;
    }
  }

  private writeJson(key: string, value: unknown, storage: 'local' | 'session' = 'local'): void {
    const target = storage === 'session' ? sessionStorage : localStorage;
    target.setItem(key, JSON.stringify(value));
  }
}
