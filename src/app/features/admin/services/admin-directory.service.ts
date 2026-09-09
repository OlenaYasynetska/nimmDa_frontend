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

  readonly overview = this.overviewSignal.asReadonly();
  readonly users = this.usersSignal.asReadonly();

  async refresh(): Promise<void> {
    try {
      const [overview, users] = await Promise.all([
        firstValueFrom(this.http.get<AdminOverview>(`${environment.apiUrl}/admin/overview`)),
        firstValueFrom(this.http.get<AdminUser[]>(`${environment.apiUrl}/admin/users`)),
      ]);
      this.overviewSignal.set(overview);
      this.usersSignal.set(users);
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
    }
  }

  sellers(): AdminUser[] {
    return this.usersSignal().filter((user) => user.accountMode !== 'buyer');
  }

  buyers(): AdminUser[] {
    return this.usersSignal().filter((user) => user.accountMode !== 'seller');
  }
}
