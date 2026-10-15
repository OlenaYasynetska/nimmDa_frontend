import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../../environments/environment';

export interface BusinessCard {
  userId: string;
  companyName: string;
  trade: string;
  location: string;
}

export interface BusinessListing {
  id: string;
  title: string;
  price: number;
  imageSrc: string;
  category: string;
}

export interface BusinessProfile {
  userId: string;
  companyName: string;
  trade: string;
  location: string;
  phone: string;
  active: boolean;
  activeUntil: string | null;
  listings: BusinessListing[];
}

export interface BusinessProfileInput {
  companyName: string;
  trade: string;
  location: string;
  phone: string;
}

@Injectable({ providedIn: 'root' })
export class BusinessProfileService {
  private readonly http = inject(HttpClient);

  async active(location: string | null): Promise<BusinessCard[]> {
    try {
      const rows = await firstValueFrom(
        this.http.get<BusinessCard[]>(`${environment.apiUrl}/business-profiles`, {
          params: location ? { location } : {},
        })
      );
      return rows ?? [];
    } catch {
      return [];
    }
  }

  async byUser(userId: string): Promise<BusinessProfile | null> {
    try {
      return await firstValueFrom(
        this.http.get<BusinessProfile>(`${environment.apiUrl}/business-profiles/${userId}`)
      );
    } catch {
      return null;
    }
  }

  async mine(): Promise<BusinessProfile | null> {
    try {
      return await firstValueFrom(
        this.http.get<BusinessProfile>(`${environment.apiUrl}/business-profiles/mine`)
      );
    } catch (error) {
      if (error instanceof HttpErrorResponse && error.status === 404) {
        return null;
      }
      throw new Error(readError(error));
    }
  }

  async save(input: BusinessProfileInput): Promise<BusinessProfile> {
    try {
      return await firstValueFrom(
        this.http.put<BusinessProfile>(`${environment.apiUrl}/business-profiles/mine`, input)
      );
    } catch (error) {
      throw new Error(readError(error));
    }
  }

  async checkout(): Promise<void> {
    try {
      const response = await firstValueFrom(
        this.http.post<{ checkoutUrl: string }>(`${environment.apiUrl}/business-profiles/checkout`, {})
      );
      if (!response.checkoutUrl) {
        throw new Error('Zahlung konnte nicht gestartet werden.');
      }
      window.location.assign(response.checkoutUrl);
    } catch (error) {
      throw new Error(readError(error));
    }
  }

  async confirm(sessionId: string): Promise<'paid' | 'pending'> {
    try {
      const response = await firstValueFrom(
        this.http.post<{ status: string }>(`${environment.apiUrl}/business-profiles/checkout-session`, {
          sessionId,
        })
      );
      return response.status === 'paid' ? 'paid' : 'pending';
    } catch (error) {
      throw new Error(readError(error));
    }
  }
}

function readError(error: unknown): string {
  if (error instanceof HttpErrorResponse) {
    const message = (error.error as { message?: string } | null)?.message;
    if (message) {
      return message;
    }
  }
  if (error instanceof Error && error.message) {
    return error.message;
  }
  return 'Das Profi-Profil konnte nicht gespeichert werden.';
}
