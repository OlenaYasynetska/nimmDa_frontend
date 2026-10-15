import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../../environments/environment';

export interface AdminOverview {
  buyerCount: number;
  sellerCount: number;
  listingCount: number;
  paymentCount: number;
  advertiserCount: number;
  subscriptionCount: number;
}

export interface AdminSubscription {
  id: string;
  userId: string;
  companyName: string;
  sellerEmail: string;
  amountCents: number;
  currency: string;
  paidAt: string;
  activeUntil: string;
}

export interface AdminPayment {
  id: string;
  listingId: string;
  listingTitle: string;
  sellerEmail: string;
  amountCents: number;
  currency: string;
  paidAt: string;
  promotedUntil: string;
}

export interface AdminUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  accountMode: string;
  listingCount: number;
  createdAt: string;
}

@Injectable({ providedIn: 'root' })
export class AdminDirectoryService {
  private readonly http = inject(HttpClient);
  private readonly overviewSignal = signal<AdminOverview>({
    buyerCount: 0,
    sellerCount: 0,
    listingCount: 0,
    paymentCount: 0,
    advertiserCount: 0,
    subscriptionCount: 0,
  });
  private readonly usersSignal = signal<AdminUser[]>([]);
  private readonly paymentsSignal = signal<AdminPayment[]>([]);
  private readonly subscriptionsSignal = signal<AdminSubscription[]>([]);

  readonly overview = this.overviewSignal.asReadonly();
  readonly users = this.usersSignal.asReadonly();
  readonly payments = this.paymentsSignal.asReadonly();
  readonly subscriptions = this.subscriptionsSignal.asReadonly();

  async refresh(): Promise<void> {
    try {
      const [overview, users, payments, subscriptions] = await Promise.all([
        firstValueFrom(this.http.get<AdminOverview>(`${environment.apiUrl}/admin/overview`)),
        firstValueFrom(this.http.get<AdminUser[]>(`${environment.apiUrl}/admin/users`)),
        firstValueFrom(this.http.get<AdminPayment[]>(`${environment.apiUrl}/admin/advertisers`)),
        firstValueFrom(this.http.get<AdminSubscription[]>(`${environment.apiUrl}/admin/subscriptions`)),
      ]);
      this.overviewSignal.set(overview);
      this.usersSignal.set(users);
      this.paymentsSignal.set(payments);
      this.subscriptionsSignal.set(subscriptions);
    } catch {
      this.overviewSignal.set({
        buyerCount: 0,
        sellerCount: 0,
        listingCount: 0,
        paymentCount: 0,
        advertiserCount: 0,
        subscriptionCount: 0,
      });
      this.usersSignal.set([]);
      this.paymentsSignal.set([]);
      this.subscriptionsSignal.set([]);
    }
  }

  sellers(): AdminUser[] {
    return this.usersSignal().filter((user) => user.accountMode !== 'buyer');
  }

  buyers(): AdminUser[] {
    return this.usersSignal().filter((user) => user.accountMode !== 'seller');
  }
}
