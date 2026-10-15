import { Component, inject, signal } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../../../environments/environment';

interface HomepageBanner {
  active: boolean;
  advertiser: string | null;
  imageSrc: string | null;
  targetUrl: string | null;
  startsOn: string | null;
  endsOn: string | null;
}

@Component({
  selector: 'app-admin-homepage-banner',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <section class="mb-4 rounded-2xl bg-white p-5 shadow-sm">
      <h2 class="text-lg font-bold text-slate-800">Startseiten-Anzeige</h2>
      <p class="mt-1 text-sm text-slate-500">
        Ein Platz, 99 € für 30 Tage, nicht pro Klick. Rechnung und Banner kommen per E-Mail. Hier nur die Laufzeit setzen.
      </p>
      @if (notice()) {
        <p class="mt-3 rounded-lg bg-slate-50 px-3 py-2 text-sm text-slate-700">{{ notice() }}</p>
      }
      <p class="mt-3 text-sm font-semibold" [class]="active() ? 'text-[#2f9e57]' : 'text-slate-500'">
        {{ active() ? 'Sichtbar auf der Startseite' : 'Gerade nicht sichtbar' }}
      </p>
      <form class="mt-4 grid gap-4 md:grid-cols-2" [formGroup]="form" (ngSubmit)="save()" novalidate>
        <div>
          <label class="mb-1.5 block text-sm font-medium text-slate-600" for="banner-name">Firma</label>
          <input id="banner-name" formControlName="advertiser" class="block w-full rounded-xl border-0 bg-slate-100 px-3 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-200" />
        </div>
        <div>
          <label class="mb-1.5 block text-sm font-medium text-slate-600" for="banner-link">Link</label>
          <input id="banner-link" formControlName="targetUrl" placeholder="https://" class="block w-full rounded-xl border-0 bg-slate-100 px-3 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-200" />
        </div>
        <div>
          <label class="mb-1.5 block text-sm font-medium text-slate-600" for="banner-start">Sichtbar ab</label>
          <input id="banner-start" type="date" formControlName="startsOn" class="block w-full rounded-xl border-0 bg-slate-100 px-3 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-200" />
        </div>
        <div>
          <label class="mb-1.5 block text-sm font-medium text-slate-600" for="banner-end">Sichtbar bis</label>
          <input id="banner-end" type="date" formControlName="endsOn" class="block w-full rounded-xl border-0 bg-slate-100 px-3 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-200" />
        </div>
        <div class="md:col-span-2">
          <label class="mb-1.5 block text-sm font-medium text-slate-600" for="banner-image">Bannerbild</label>
          <input id="banner-image" type="file" accept="image/jpeg,image/png,image/webp,image/gif" (change)="onImage($event)" />
          @if (imageSrc()) {
            <img [src]="imageSrc()" alt="" class="mt-3 max-h-32 rounded-xl object-cover" />
          }
        </div>
        <div class="flex flex-wrap gap-2 md:col-span-2">
          <button type="submit" class="rounded-lg bg-[#1b3a5f] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#152c49] disabled:opacity-50" [disabled]="saving()">
            Speichern
          </button>
          <button type="button" class="rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50" (click)="clear()">
            Entfernen
          </button>
        </div>
      </form>
    </section>
  `,
})
export class AdminHomepageBannerComponent {
  private readonly http = inject(HttpClient);
  private readonly formBuilder = inject(FormBuilder);

  readonly form = this.formBuilder.nonNullable.group({
    advertiser: '',
    targetUrl: '',
    startsOn: '',
    endsOn: '',
  });
  readonly imageSrc = signal<string | null>(null);
  readonly active = signal(false);
  readonly notice = signal<string | null>(null);
  readonly saving = signal(false);

  constructor() {
    void this.load();
  }

  async onImage(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) {
      return;
    }
    if (!file.type.startsWith('image/') || file.size > 8 * 1024 * 1024) {
      this.notice.set('Bitte ein Bild bis 8 MB wählen.');
      input.value = '';
      return;
    }
    try {
      this.imageSrc.set(await compress(file));
      this.notice.set(null);
    } catch {
      this.notice.set('Das Bild konnte nicht geladen werden.');
    }
  }

  async save(): Promise<void> {
    await this.persist({
      advertiser: this.form.controls.advertiser.value.trim(),
      targetUrl: this.form.controls.targetUrl.value.trim(),
      imageSrc: this.imageSrc(),
      startsOn: this.form.controls.startsOn.value || null,
      endsOn: this.form.controls.endsOn.value || null,
    });
  }

  async clear(): Promise<void> {
    this.form.reset({ advertiser: '', targetUrl: '', startsOn: '', endsOn: '' });
    this.imageSrc.set(null);
    await this.persist({
      advertiser: '',
      targetUrl: '',
      imageSrc: null,
      startsOn: null,
      endsOn: null,
    });
  }

  private async load(): Promise<void> {
    try {
      const row = await firstValueFrom(
        this.http.get<HomepageBanner>(`${environment.apiUrl}/admin/homepage-banner`)
      );
      this.apply(row);
    } catch (error) {
      this.notice.set(messageOf(error));
    }
  }

  private async persist(body: {
    advertiser: string;
    targetUrl: string;
    imageSrc: string | null;
    startsOn: string | null;
    endsOn: string | null;
  }): Promise<void> {
    this.saving.set(true);
    this.notice.set(null);
    try {
      const row = await firstValueFrom(
        this.http.put<HomepageBanner>(`${environment.apiUrl}/admin/homepage-banner`, body)
      );
      this.apply(row);
      this.notice.set(row.active ? 'Anzeige ist sichtbar.' : 'Gespeichert. Auf der Startseite noch nicht sichtbar.');
    } catch (error) {
      this.notice.set(messageOf(error));
    } finally {
      this.saving.set(false);
    }
  }

  private apply(row: HomepageBanner): void {
    this.active.set(row.active);
    this.imageSrc.set(row.imageSrc);
    this.form.setValue({
      advertiser: row.advertiser ?? '',
      targetUrl: row.targetUrl ?? '',
      startsOn: row.startsOn ?? '',
      endsOn: row.endsOn ?? '',
    });
  }
}

function messageOf(error: unknown): string {
  if (error instanceof HttpErrorResponse) {
    const message = (error.error as { message?: string } | null)?.message;
    if (message) {
      return message;
    }
  }
  return 'Die Anzeige konnte nicht gespeichert werden.';
}

function compress(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(reader.error);
    reader.onload = () => {
      const image = new Image();
      image.onerror = () => reject(new Error('image'));
      image.onload = () => {
        const maxWidth = 1400;
        const scale = Math.min(1, maxWidth / image.width);
        const canvas = document.createElement('canvas');
        canvas.width = Math.max(1, Math.round(image.width * scale));
        canvas.height = Math.max(1, Math.round(image.height * scale));
        const context = canvas.getContext('2d');
        if (!context) {
          resolve(String(reader.result));
          return;
        }
        context.drawImage(image, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/jpeg', 0.82));
      };
      image.src = String(reader.result);
    };
    reader.readAsDataURL(file);
  });
}
