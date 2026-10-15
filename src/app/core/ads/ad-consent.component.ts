import { Component, inject, signal } from '@angular/core';
import { FOOTER_DOCS } from '../../features/landing/data/footer-docs.content';
import { AdSenseService } from './ad-sense.service';

@Component({
  selector: 'app-ad-consent',
  standalone: true,
  template: `
    @if (ads.needsChoice()) {
      <div class="fixed inset-x-0 bottom-20 z-50 px-4 md:bottom-4 md:px-8">
        <div class="mx-auto flex max-w-3xl flex-col gap-3 rounded-2xl bg-white p-4 shadow-lg ring-1 ring-slate-200 sm:flex-row sm:items-center">
          <p class="text-sm text-slate-700">
            Auf den Anzeigenseiten kann Google Werbung einblenden. Dafür braucht es deine Erlaubnis für Werbe-Cookies.
            <button type="button" class="font-medium text-[#2f6fb2] hover:underline" (click)="policyOpen.set(true)">
              Datenschutz
            </button>
          </p>
          <div class="flex shrink-0 gap-2">
            <button
              type="button"
              class="rounded-lg px-3 py-2 text-sm font-semibold text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50"
              (click)="ads.deny()"
            >
              Ablehnen
            </button>
            <button
              type="button"
              class="rounded-lg bg-[#1b3a5f] px-3 py-2 text-sm font-semibold text-white hover:bg-[#16324f]"
              (click)="ads.allow()"
            >
              Erlauben
            </button>
          </div>
        </div>
      </div>
    }

    @if (policyOpen()) {
      <div
        class="fixed inset-0 z-[80] flex items-end justify-center p-0 sm:items-center sm:p-4"
        role="dialog"
        aria-modal="true"
        aria-labelledby="ad-consent-privacy-title"
      >
        <button
          type="button"
          class="absolute inset-0 bg-slate-900/50"
          aria-label="Datenschutz schließen"
          (click)="policyOpen.set(false)"
        ></button>
        <div class="relative z-10 flex max-h-[92dvh] w-full max-w-lg flex-col rounded-t-2xl bg-white shadow-xl sm:rounded-2xl">
          <div class="flex items-start justify-between gap-4 px-6 pt-6">
            <h2 id="ad-consent-privacy-title" class="text-xl font-extrabold text-[#1b3a5f]">
              {{ policy.title }}
            </h2>
            <button
              type="button"
              class="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              aria-label="Datenschutz schließen"
              (click)="policyOpen.set(false)"
            >
              <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div class="mt-4 space-y-5 overflow-y-auto px-6 pb-6 text-sm leading-relaxed text-slate-700">
            @for (section of policy.sections; track $index) {
              <section>
                @if (section.heading) {
                  <h3 class="mb-1.5 font-semibold text-slate-900">{{ section.heading }}</h3>
                }
                @for (paragraph of section.paragraphs ?? []; track $index) {
                  <p class="whitespace-pre-line" [class.mt-2]="$index > 0">{{ paragraph }}</p>
                }
                @if (section.items?.length) {
                  <ul class="mt-2 list-disc space-y-1 pl-5">
                    @for (item of section.items; track item) {
                      <li>{{ item }}</li>
                    }
                  </ul>
                }
                @if (section.email) {
                  <p class="mt-2">
                    @if (section.emailLabel) {
                      {{ section.emailLabel }}
                    }
                    <a class="text-[#2f6fb2] hover:underline" [href]="'mailto:' + section.email">
                      {{ section.email }}
                    </a>
                  </p>
                }
              </section>
            }
          </div>
        </div>
      </div>
    }
  `,
})
export class AdConsentComponent {
  readonly ads = inject(AdSenseService);
  readonly policy = FOOTER_DOCS.datenschutz;
  readonly policyOpen = signal(false);
}
