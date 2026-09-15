import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../../environments/environment';

interface PlaceDto {
  name: string;
  displayName?: string;
}

@Injectable({ providedIn: 'root' })
export class LocationsApiService {
  private readonly http = inject(HttpClient);

  async suggest(query: string): Promise<string[]> {
    const q = query.trim();
    if (q.length < 2) {
      return [];
    }
    try {
      const rows = await firstValueFrom(
        this.http.get<PlaceDto[]>(`${environment.apiUrl}/locations`, { params: { q } })
      );
      return (rows ?? []).map((row) => row.name).filter(Boolean);
    } catch {
      return [];
    }
  }
}
