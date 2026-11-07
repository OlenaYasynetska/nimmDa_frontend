import { Component, effect, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import {
  BusinessProfile,
  BusinessProfileService,
} from '../../../business/services/business-profile.service';

@Component({
  selector: 'app-konto-profi',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  template: `
    <section class="rounded-2xl bg-white p-4 shadow-sm sm:p-5">
      <h2 class="text-lg font-bold text-slate-800">Profi-Profil</h2>
      <p class="mt-1 text-sm text-slate-500">
        Firma, Branche, Ort und Telefon. Einzelne Anzeigen bleiben kostenlos.
      </p>

      @if (notice()) {
        <p class="mt-4 rounded-lg bg-slate-50 px-3 py-2 text-sm text-slate-700">{{ notice() }}</p>
      }

      @if (active() && activeUntil()) {
        <p class="mt-4 text-sm font-semibold text-[#1b3a5f]">Firma bis {{ until(activeUntil()) }}</p>
      } @else if (activeUntil()) {
        <p class="mt-4 text-sm text-slate-500">Zuletzt aktiv bis {{ until(activeUntil()) }}. Die Seite bleibt erreichbar, steht aber nicht mehr oben.</p>
      }

      <form class="mt-5 space-y-4" [formGroup]="form" (ngSubmit)="save()" novalidate>
        <div>
          <label class="mb-1.5 block text-sm font-medium text-slate-600" for="profi-company">Firmenname</label>
          <input id="profi-company" formControlName="companyName" class="block w-full rounded-xl border-0 bg-slate-100 px-3 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-200" />
        </div>
        <div>
          <label class="mb-1.5 block text-sm font-medium text-slate-600" for="profi-trade">Branche</label>
          <input id="profi-trade" formControlName="trade" class="block w-full rounded-xl border-0 bg-slate-100 px-3 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-200" />
        </div>
        <div>
          <label class="mb-1.5 block text-sm font-medium text-slate-600" for="profi-location">Ort</label>
          <input id="profi-location" formControlName="location" class="block w-full rounded-xl border-0 bg-slate-100 px-3 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-200" />
        </div>
        <div>
          <label class="mb-1.5 block text-sm font-medium text-slate-600" for="profi-phone">Telefon</label>
          <input id="profi-phone" formControlName="phone" class="block w-full rounded-xl border-0 bg-slate-100 px-3 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-200" />
        </div>
        <div class="flex flex-col gap-2 sm:flex-row">
          <button
            type="submit"
            class="rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50 disabled:opacity-50"
            [disabled]="saving()"
          >
            Speichern
          </button>
          <button
            type="button"
            class="rounded-lg bg-[#f5c400] px-4 py-2.5 text-sm font-bold text-[#1b3a5f] hover:bg-[#e6b700] disabled:opacity-50"
            [disabled]="paying()"
            (click)="pay()"
          >
            {{ active() ? 'Verlängern · 19,99 €' : 'Firma werden · 19,99 €' }}
          </button>
        </div>
        <p class="text-xs text-slate-500">
          30 Tage über privaten Anzeigen in Services, gekennzeichnet als Firma. Kein Umsatzsteuerausweis.
          @if (profileId()) {
            <a class="text-[#2f6fb2] hover:underline" [routerLink]="['/profi', profileId()]">Öffentliche Seite</a>
          }
        </p>
      </form>
    </section>
  `,
})
export class KontoProfiComponent {
  private readonly profiles = inject(BusinessProfileService);
  private readonly formBuilder = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private confirmedSession = '';

  readonly form = this.formBuilder.nonNullable.group({
    companyName: ['', [Validators.required, Validators.maxLength(160)]],
    trade: ['', [Validators.required, Validators.maxLength(160)]],
    location: ['', [Validators.required, Validators.maxLength(128)]],
    phone: ['', [Validators.required, Validators.pattern(/^[0-9+()/\-\s]{5,40}$/)]],
  });

  readonly notice = signal<string | null>(null);
  readonly saving = signal(false);
  readonly paying = signal(false);
  readonly activeUntil = signal<string | null>(null);
  readonly active = signal(false);
  readonly profileId = signal<string | null>(null);

  private readonly query = toSignal(this.route.queryParamMap, {
    initialValue: this.route.snapshot.queryParamMap,
  });

  constructor() {
    void this.load();
    effect(() => {
      const params = this.query();
      const state = params.get('profi');
      const sessionId = params.get('session_id');
      if (state === 'cancel') {
        this.notice.set('Zahlung abgebrochen. Es wurde nichts berechnet.');
        void this.clearQuery();
        return;
      }
      if (state === 'success' && sessionId && sessionId !== this.confirmedSession) {
        this.confirmedSession = sessionId;
        void this.finish(sessionId);
      }
    });
  }

  async save(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.notice.set('Bitte Firmenname, Branche, Ort und Telefon ausfüllen.');
      return;
    }
    this.saving.set(true);
    this.notice.set(null);
    try {
      const saved = await this.profiles.save(this.form.getRawValue());
      this.apply(saved);
      this.notice.set('Profi-Profil gespeichert.');
    } catch (error) {
      this.notice.set(error instanceof Error ? error.message : 'Das Profi-Profil konnte nicht gespeichert werden.');
    } finally {
      this.saving.set(false);
    }
  }

  async pay(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.notice.set('Bitte zuerst das Profil ausfüllen.');
      return;
    }
    this.paying.set(true);
    this.notice.set(null);
    try {
      await this.profiles.save(this.form.getRawValue());
      await this.profiles.checkout();
    } catch (error) {
      this.notice.set(error instanceof Error ? error.message : 'Zahlung konnte nicht gestartet werden.');
      this.paying.set(false);
    }
  }

  until(value: string | null): string {
    if (!value) {
      return '';
    }
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      return value;
    }
    return date.toLocaleDateString('de-AT');
  }

  private async load(): Promise<void> {
    try {
      const profile = await this.profiles.mine();
      if (profile) {
        this.apply(profile);
      }
    } catch (error) {
      this.notice.set(error instanceof Error ? error.message : 'Das Profi-Profil konnte nicht geladen werden.');
    }
  }

  private apply(profile: BusinessProfile): void {
    this.profileId.set(profile.userId);
    this.active.set(profile.active);
    this.activeUntil.set(profile.activeUntil);
    this.form.setValue({
      companyName: profile.companyName,
      trade: profile.trade,
      location: profile.location,
      phone: profile.phone,
    });
  }

  private async finish(sessionId: string): Promise<void> {
    try {
      const status = await this.profiles.confirm(sessionId);
      this.notice.set(
        status === 'paid'
          ? 'Bezahlt. Das Profi-Profil steht 30 Tage oben in Services.'
          : 'Die Zahlung wird noch bestätigt.'
      );
      await this.load();
    } catch (error) {
      this.notice.set(error instanceof Error ? error.message : 'Zahlung konnte nicht bestätigt werden.');
    } finally {
      await this.clearQuery();
    }
  }

  private async clearQuery(): Promise<void> {
    await this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { profi: null, session_id: null },
      queryParamsHandling: 'merge',
      replaceUrl: true,
    });
  }
}
