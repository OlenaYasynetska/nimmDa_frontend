import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import type {
  AccountRole,
  AuthFlowError,
  AuthMailType,
  LastAuthMail,
  StoredAuthAccount,
  StoredAuthToken,
} from '../models/auth-account.model';
import type { AuthUser } from '../models';

const USER_KEY = 'nimmda.auth.user';
const ACCOUNTS_KEY = 'nimmda.auth.accounts';
const TOKENS_KEY = 'nimmda.auth.tokens';
const LAST_MAIL_KEY = 'nimmda.auth.last-mail';
const RETURN_URL_KEY = 'nimmda.auth.return-url';

const VERIFY_TTL_MS = 1000 * 60 * 60 * 24;
const RESET_TTL_MS = 1000 * 60 * 60;

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
  private readonly lastMailSignal = signal<LastAuthMail | null>(this.readJson(LAST_MAIL_KEY));

  readonly currentUser = this.currentUserSignal.asReadonly();
  readonly lastMail = this.lastMailSignal.asReadonly();
  readonly isAuthenticated = computed(() => this.currentUserSignal() !== null);
  readonly role = computed(() => {
    const raw = this.currentUserSignal()?.role;
    if (raw === 'buyer' || raw === 'seller' || raw === 'both') {
      return raw;
    }
    return this.currentUserSignal() ? 'seller' : null;
  });
  readonly canSell = computed(() => {
    const role = this.role();
    return role === 'seller' || role === 'both';
  });
  readonly canBuy = computed(() => {
    const role = this.role();
    return role === 'buyer' || role === 'both';
  });

  homePath(): string {
    return this.canSell() ? '/seller' : '/konto';
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
    const accounts = this.readAccounts();
    const index = accounts.findIndex((item) => item.id === user.id);
    if (index < 0) {
      return;
    }
    const nextRole = this.mergeRoles(accounts[index].role, 'seller');
    accounts[index] = { ...accounts[index], role: nextRole };
    this.writeAccounts(accounts);
    this.setSession(accounts[index]);
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
    const normalized = this.normalizeEmail(email);
    const accounts = this.readAccounts();
    const existing = accounts.find((account) => account.email === normalized);
    if (existing?.emailVerified) {
      throw new AuthFlowException('exists');
    }
    if (!existing) {
      accounts.push({
        id: crypto.randomUUID(),
        email: normalized,
        passwordHash: await this.hash(password),
        ...this.namesFromEmail(normalized),
        role,
        emailVerified: false,
      });
    } else {
      const index = accounts.findIndex((account) => account.email === normalized);
      accounts[index] = {
        ...accounts[index],
        passwordHash: await this.hash(password),
        role: this.mergeRoles(accounts[index].role, role),
      };
    }
    this.writeAccounts(accounts);
    await this.sendMail(normalized, 'verify');
  }

  async login(email: string, password: string, role?: AccountRole): Promise<void> {
    const account = this.findAccount(email);
    if (!account) {
      throw new AuthFlowException('notFound');
    }
    if (account.passwordHash !== (await this.hash(password))) {
      throw new AuthFlowException('invalid');
    }
    if (!account.emailVerified) {
      await this.sendMail(account.email, 'verify');
      throw new AuthFlowException('unverified');
    }
    const nextRole = role ? this.mergeRoles(account.role, role) : account.role;
    if (nextRole !== account.role) {
      const accounts = this.readAccounts();
      const index = accounts.findIndex((item) => item.id === account.id);
      accounts[index] = { ...accounts[index], role: nextRole };
      this.writeAccounts(accounts);
      this.setSession(accounts[index]);
    } else {
      this.setSession(account);
    }
  }

  async verifyEmail(token: string): Promise<void> {
    const record = this.consumeToken(token, 'verify');
    const accounts = this.readAccounts();
    const index = accounts.findIndex((account) => account.email === record.email);
    if (index < 0) {
      throw new AuthFlowException('expired');
    }
    accounts[index] = { ...accounts[index], emailVerified: true };
    this.writeAccounts(accounts);
    this.setSession(accounts[index]);
  }

  async requestPasswordReset(email: string): Promise<void> {
    const account = this.findAccount(email);
    if (account) {
      await this.sendMail(account.email, 'reset');
    }
  }

  async resetPassword(token: string, password: string): Promise<void> {
    const record = this.consumeToken(token, 'reset');
    const accounts = this.readAccounts();
    const index = accounts.findIndex((account) => account.email === record.email);
    if (index < 0) {
      throw new AuthFlowException('expired');
    }
    accounts[index] = { ...accounts[index], passwordHash: await this.hash(password) };
    this.writeAccounts(accounts);
    this.logout();
  }

  async resendVerification(email: string): Promise<void> {
    const account = this.findAccount(email);
    if (account && !account.emailVerified) {
      await this.sendMail(account.email, 'verify');
    }
  }

  async resendLastMail(): Promise<void> {
    const last = this.lastMailSignal();
    if (!last) {
      return;
    }
    await this.sendMail(last.email, last.type);
  }

  mailLinkFor(email: string, type: AuthMailType): string | null {
    const normalized = this.normalizeEmail(email);
    const last = this.lastMailSignal();
    if (last && last.email === normalized && last.type === type) {
      return last.url;
    }
    const token = this.readTokens().find(
      (item) => item.email === normalized && item.type === type && item.expiresAt > Date.now()
    );
    return token ? this.linkFor(token.token, type) : null;
  }

  private async sendMail(email: string, type: AuthMailType): Promise<void> {
    const token = crypto.randomUUID().replace(/-/g, '');
    const ttl = type === 'verify' ? VERIFY_TTL_MS : RESET_TTL_MS;
    const tokens = this.readTokens().filter((item) => !(item.email === email && item.type === type));
    tokens.push({ token, email, type, expiresAt: Date.now() + ttl });
    this.writeJson(TOKENS_KEY, tokens);
    const url = this.linkFor(token, type);
    const mailSent = await this.deliverMail(email, type, url);
    const mail: LastAuthMail = { email, type, url, mailSent };
    this.lastMailSignal.set(mail);
    this.writeJson(LAST_MAIL_KEY, mail, 'session');
  }

  private async deliverMail(email: string, type: AuthMailType, url: string): Promise<boolean> {
    try {
      const response = await firstValueFrom(
        this.http.post<{ sent: boolean }>(`${environment.apiUrl}/auth/mail`, {
          to: email,
          type,
          link: url,
        })
      );
      return response.sent === true;
    } catch {
      return false;
    }
  }

  private linkFor(token: string, type: AuthMailType): string {
    const path = type === 'verify' ? '/auth/verify' : '/auth/reset-password';
    return `${window.location.origin}${path}?token=${token}`;
  }

  private consumeToken(token: string, type: AuthMailType): StoredAuthToken {
    const tokens = this.readTokens();
    const record = tokens.find((item) => item.token === token && item.type === type);
    if (!record) {
      throw new AuthFlowException('expired');
    }
    if (record.expiresAt < Date.now()) {
      this.writeJson(
        TOKENS_KEY,
        tokens.filter((item) => item.token !== token)
      );
      throw new AuthFlowException('expired');
    }
    this.writeJson(
      TOKENS_KEY,
      tokens.filter((item) => item.token !== token)
    );
    return record;
  }

  private mergeRoles(current: AccountRole | undefined, next: AccountRole): AccountRole {
    const left = current || 'seller';
    if (left === next || left === 'both' || next === 'both') {
      return left === next ? next : 'both';
    }
    if ((left === 'buyer' && next === 'seller') || (left === 'seller' && next === 'buyer')) {
      return 'both';
    }
    return next;
  }

  private setSession(account: StoredAuthAccount): void {
    const user: AuthUser = {
      id: account.id,
      email: account.email,
      firstName: account.firstName,
      lastName: account.lastName,
      role: account.role,
      accessToken: crypto.randomUUID(),
      expiresAt: Date.now() + 1000 * 60 * 60 * 24,
    };
    this.currentUserSignal.set(user);
    sessionStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  private findAccount(email: string): StoredAuthAccount | undefined {
    return this.readAccounts().find((account) => account.email === this.normalizeEmail(email));
  }

  private namesFromEmail(email: string): { firstName: string; lastName: string } {
    const parts = (email.split('@')[0] || 'Verkäufer')
      .split(/[._-]+/)
      .filter(Boolean)
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase());
    return {
      firstName: parts[0] || 'Verkäufer',
      lastName: parts.slice(1).join(' '),
    };
  }

  private normalizeEmail(email: string): string {
    return email.trim().toLowerCase();
  }

  private async hash(value: string): Promise<string> {
    const bytes = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(value));
    return Array.from(new Uint8Array(bytes))
      .map((byte) => byte.toString(16).padStart(2, '0'))
      .join('');
  }

  private readAccounts(): StoredAuthAccount[] {
    return (this.readJson<StoredAuthAccount[]>(ACCOUNTS_KEY) ?? []).map((account) => ({
      ...account,
      role: account.role || 'seller',
    }));
  }

  private writeAccounts(accounts: StoredAuthAccount[]): void {
    this.writeJson(ACCOUNTS_KEY, accounts);
  }

  private readTokens(): StoredAuthToken[] {
    return this.readJson<StoredAuthToken[]>(TOKENS_KEY) ?? [];
  }

  private readJson<T>(key: string): T | null {
    try {
      const raw = localStorage.getItem(key) ?? sessionStorage.getItem(key);
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

