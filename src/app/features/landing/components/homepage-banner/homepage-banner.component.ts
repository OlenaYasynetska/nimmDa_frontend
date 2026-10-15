import { Component, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../../../environments/environment';

interface HomepageBanner {
  active: boolean;
  advertiser: string | null;
  imageSrc: string | null;
  targetUrl: string | null;
}

@Component({
  selector: 'app-homepage-banner',
  standalone: true,
  template: `
    @if (banner(); as ad) {
      <aside class="container px-4 pb-4 md:px-8" aria-label="Anzeige">
        <p class="mb-2 text-[11px] font-bold uppercase tracking-wide text-slate-400">Anzeige</p>
        @if (ad.targetUrl) {
          <a [href]="ad.targetUrl" target="_blank" rel="noopener sponsored">
            <img [src]="ad.imageSrc" [alt]="ad.advertiser || 'Anzeige'" class="max-h-48 w-full rounded-2xl object-cover" />
          </a>
        } @else {
          <img [src]="ad.imageSrc" [alt]="ad.advertiser || 'Anzeige'" class="max-h-48 w-full rounded-2xl object-cover" />
        }
      </aside>
    }
  `,
})
export class HomepageBannerComponent {
  private readonly http = inject(HttpClient);
  readonly banner = signal<HomepageBanner | null>(null);

  constructor() {
    void this.load();
  }

  private async load(): Promise<void> {
    try {
      const row = await firstValueFrom(
        this.http.get<HomepageBanner>(`${environment.apiUrl}/homepage-banner`)
      );
      this.banner.set(row.active && row.imageSrc ? row : null);
    } catch {
      this.banner.set(null);
    }
  }
}
