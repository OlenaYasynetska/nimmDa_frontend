import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { POPULAR_CATEGORIES } from '../../../landing/data/landing.content';
import { SellerListingsService } from '../../services/seller-listings.service';

@Component({
  selector: 'app-create-listing',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  template: `
    <div class="mx-auto max-w-xl rounded-2xl bg-white p-6 shadow-sm">
      <a routerLink="/seller" class="text-sm font-medium text-[#2f6fb2] hover:underline">← Zurück zur Übersicht</a>
      <h1 class="mt-3 text-2xl font-extrabold text-[#1b3a5f]">Anzeige erstellen</h1>
      <p class="mt-1 text-sm text-slate-500">Erstelle eine Produktkarte für den Marktplatz.</p>

      <form class="mt-6 space-y-4" [formGroup]="form" (ngSubmit)="onSubmit()" novalidate>
        <div>
          <label class="mb-1.5 block text-sm font-medium text-slate-600" for="listing-title">Titel</label>
          <input
            id="listing-title"
            formControlName="title"
            class="block w-full rounded-xl border-0 bg-slate-100 px-3 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-200"
          />
        </div>
        <div>
          <label class="mb-1.5 block text-sm font-medium text-slate-600" for="listing-price">Preis (€)</label>
          <input
            id="listing-price"
            type="number"
            min="0"
            formControlName="price"
            class="block w-full rounded-xl border-0 bg-slate-100 px-3 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-200"
          />
        </div>
        <div>
          <label class="mb-1.5 block text-sm font-medium text-slate-600" for="listing-category">Kategorie</label>
          <select
            id="listing-category"
            formControlName="category"
            class="block w-full rounded-xl border-0 bg-slate-100 px-3 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-200"
          >
            @for (category of categories; track category.name) {
              <option [value]="category.name">{{ category.name }}</option>
            }
          </select>
        </div>
        <div>
          <label class="mb-1.5 block text-sm font-medium text-slate-600" for="listing-description">Beschreibung</label>
          <textarea
            id="listing-description"
            rows="4"
            formControlName="description"
            class="block w-full rounded-xl border-0 bg-slate-100 px-3 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-200"
          ></textarea>
        </div>
        <div>
          <p class="mb-1.5 text-sm font-medium text-slate-600">Foto</p>
          <input
            #photoInput
            id="listing-photo"
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            class="sr-only"
            (change)="onPhotoSelected($event)"
          />
          @if (photoPreview()) {
            <div class="overflow-hidden rounded-xl bg-slate-100">
              <img [src]="photoPreview()" [alt]="photoName() || 'Foto'" class="h-48 w-full object-cover" />
              <div class="flex items-center justify-between gap-2 px-3 py-2">
                <p class="truncate text-xs text-slate-500">{{ photoName() }}</p>
                <div class="flex shrink-0 gap-2">
                  <button
                    type="button"
                    class="text-xs font-medium text-[#2f6fb2] hover:underline"
                    (click)="photoInput.click()"
                  >
                    Ändern
                  </button>
                  <button
                    type="button"
                    class="text-xs font-medium text-slate-500 hover:text-slate-800"
                    (click)="clearPhoto(photoInput)"
                  >
                    Entfernen
                  </button>
                </div>
              </div>
            </div>
          } @else {
            <button
              type="button"
              class="flex w-full flex-col items-center justify-center gap-1 rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-8 text-slate-500 hover:border-[#2f9e57] hover:bg-[#eaf8ef] hover:text-[#2f9e57]"
              (click)="photoInput.click()"
            >
              <span class="text-sm font-semibold">Foto hinzufügen</span>
              <span class="text-xs">JPG, PNG oder WEBP</span>
            </button>
          }
          @if (photoError()) {
            <p class="mt-1.5 text-xs text-red-600">{{ photoError() }}</p>
          }
        </div>
        <button
          type="submit"
          class="rounded-lg bg-[#2f9e57] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#278a4b] disabled:opacity-50"
          [disabled]="form.invalid || photoBusy() || saving()"
        >
          {{ saving() ? 'Wird gespeichert…' : 'Anzeige speichern' }}
        </button>
        @if (saveError()) {
          <p class="text-xs text-red-600">{{ saveError() }}</p>
        }
      </form>
    </div>
  `,
})
export class CreateListingComponent {
  private readonly fb = inject(FormBuilder);
  private readonly listings = inject(SellerListingsService);
  private readonly router = inject(Router);

  readonly categories = POPULAR_CATEGORIES.filter((item) => item.name !== 'Weitere Kategorien');
  readonly photoPreview = signal<string | null>(null);
  readonly photoName = signal<string | null>(null);
  readonly photoError = signal<string | null>(null);
  readonly photoBusy = signal(false);
  readonly saving = signal(false);
  readonly saveError = signal<string | null>(null);

  readonly form = this.fb.nonNullable.group({
    title: ['', Validators.required],
    price: [0, [Validators.required, Validators.min(1)]],
    category: [this.categories[0]?.name ?? '', Validators.required],
    description: [''],
  });

  async onPhotoSelected(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) {
      return;
    }
    if (!file.type.startsWith('image/')) {
      this.photoError.set('Bitte wähle eine Bilddatei.');
      input.value = '';
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      this.photoError.set('Das Foto darf höchstens 8 MB groß sein.');
      input.value = '';
      return;
    }
    this.photoBusy.set(true);
    this.photoError.set(null);
    try {
      this.photoPreview.set(await this.compressImage(file));
      this.photoName.set(file.name);
    } catch {
      this.photoError.set('Das Foto konnte nicht geladen werden.');
      this.photoPreview.set(null);
      this.photoName.set(null);
    } finally {
      this.photoBusy.set(false);
    }
  }

  clearPhoto(input: HTMLInputElement): void {
    input.value = '';
    this.photoPreview.set(null);
    this.photoName.set(null);
    this.photoError.set(null);
  }

  async onSubmit(): Promise<void> {
    if (this.form.invalid || this.saving()) {
      this.form.markAllAsTouched();
      return;
    }
    const value = this.form.getRawValue();
    this.saving.set(true);
    this.saveError.set(null);
    try {
      await this.listings.add({
        title: value.title,
        price: value.price,
        imageSrc: this.photoPreview() ?? undefined,
        category: value.category,
      });
      void this.router.navigateByUrl('/seller');
    } catch {
      this.saveError.set('Die Anzeige konnte nicht gespeichert werden. Bitte erneut anmelden und nochmal versuchen.');
    } finally {
      this.saving.set(false);
    }
  }

  private readAsDataUrl(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result));
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(file);
    });
  }

  private loadImage(src: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.onload = () => resolve(image);
      image.onerror = () => reject(new Error('image-load-failed'));
      image.src = src;
    });
  }

  private async compressImage(file: File): Promise<string> {
    const dataUrl = await this.readAsDataUrl(file);
    const image = await this.loadImage(dataUrl);
    const maxSize = 960;
    const scale = Math.min(1, maxSize / Math.max(image.width, image.height));
    const canvas = document.createElement('canvas');
    canvas.width = Math.max(1, Math.round(image.width * scale));
    canvas.height = Math.max(1, Math.round(image.height * scale));
    const context = canvas.getContext('2d');
    if (!context) {
      return dataUrl;
    }
    context.drawImage(image, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL('image/jpeg', 0.82);
  }
}
