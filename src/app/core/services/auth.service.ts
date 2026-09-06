import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import type {
  AccountRole,
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
  role: AccountRole;
  accountMode: AccountRole;
  accessToken: string;
  expiresAt: number;
}

interface MailResultDto {
  mailSent: boolean;
  verifyUrl?: string | null;
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
    if (raw === 'buyer' || raw === 'seller' || raw === 'both') {
      return raw;
    }
    return this.currentUserSignal() ? 'both' : null;
  });
  readonly accountMode = computed((): AccountRole => {
    const raw = this.currentUserSignal()?.accountMode;
    if (raw === 'buyer' || raw === 'seller' || raw === 'both') {
      return raw;
    }
    return 'both';
  });
  readonly canSell = computed(() => this.isAuthenticated());
  readonly canBuy = computed(() => this.isAuthenticated());

  homePath(): string {
    return this.accountMode() === 'buyer' ? '/konto' : '/seller';
  }

  rememberReturnUrl(url?: string | null): void {
    const value = url?.trim();
    if (value) {
      sessionStorage.setItem(RETURN_URL_KEY, value);
    }
  }

  consumeReturnUrl(): string | null {
    const value = sessionStorage.getItem(RETURN_URL_KEY);
    sessionStorage.removeItem(RETURN_URL_KEY);
    return value;
  }

  afterAuthPath(): string {
    return this.consumeReturnUrl() || this.homePath();
  }

  ensureSellerRole(): void {
    const user = this.currentUserSignal();
    if (!user) {
      return;
    }
    void this.postSession('/auth/account-mode', { role: 'seller' })
      .then((session) => this.setSession(this.toUser(session)))
      .catch(() => {
        this.setSession({ ...user, accountMode: 'seller', role: 'both' });
      });
  }

  getAccessToken(): string | null {
    return this.currentUserSignal()?.accessToken ?? null;
  }

  logout(): void {
    this.currentUserSignal.set(null);
    sessionStorage.removeItem(USER_KEY);
  }

  async registerSeller(email: string, password: string): Promise<void> {
    await this.register(email, password, 'seller');
  }

  async register(email: string, password: string, role: AccountRole): Promise<void> {
    const result = await this.postMail('/auth/register', { email, password, role });
    this.rememberMail(email, 'verify', result);
  }

  async login(email: string, password: string, role?: AccountRole): Promise<void> {
    const session = await this.postSession('/auth/login', { email, password, role });
    this.setSession(this.toUser(session));
  }

  async verifyEmail(token: string): Promise<void> {
    const session = await this.postSession('/auth/verify', { token });
    this.setSession(this.toUser(session));
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

  mailLinkFor(email: string, type: AuthMailType): string | null {
    const last = this.lastMailSignal();
    if (last && last.email === this.normalizeEmail(email) && last.type === type) {
      return last.url;
    }
    return null;
  }

  private rememberMail(email: string, type: AuthMailType, result: MailResultDto): void {
    const mail: LastAuthMail = {
      email: this.normalizeEmail(email),
      type,
      url: result.verifyUrl ?? '',
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
      role: session.role === 'buyer' || session.role === 'seller' ? session.role : 'both',
      accountMode:
        session.accountMode === 'buyer' || session.accountMode === 'seller'
          ? session.accountMode
          : 'both',
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
      const body = error.error as { code?: string } | string | null;
      const code = typeof body === 'object' && body?.code ? body.code : this.codeFromStatus(error.status);
      if (this.isAuthCode(code)) {
        throw new AuthFlowException(code);
      }
    }
    throw new AuthFlowException('invalid');
  }

  private codeFromStatus(status: number): AuthFlowError {
    if (status === 409) return 'exists';
    if (status === 404) return 'notFound';
    if (status === 403) return 'unverified';
    if (status === 400) return 'expired';
    return 'invalid';
  }

  private isAuthCode(code: string): code is AuthFlowError {
    return (
      code === 'exists' ||
      code === 'invalid' ||
      code === 'notFound' ||
      code === 'unverified' ||
      code === 'expired' ||
      code === 'mismatch'
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
