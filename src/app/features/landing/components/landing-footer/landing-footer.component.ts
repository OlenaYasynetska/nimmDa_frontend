import { DOCUMENT } from '@angular/common';
import { Component, computed, effect, inject, signal } from '@angular/core';
import {
  FOOTER_ABOUT_LINKS,
  FOOTER_BUSINESS_LINKS,
  FOOTER_SERVICE_LINKS,
} from '../../data/landing.content';
import { FOOTER_DOCS, type FooterDocId } from '../../data/footer-docs.content';
import { BrandMarkComponent } from '../brand-mark/brand-mark.component';
import { LandingIconComponent } from '../landing-icon/landing-icon.component';

@Component({
  selector: 'app-landing-footer',
  standalone: true,
  imports: [BrandMarkComponent, LandingIconComponent],
  host: {
    '(document:keydown.escape)': 'onEscape()',
  },
  template: `
    <footer class="border-t border-slate-200 bg-white">
      <div
        class="container grid grid-cols-1 gap-10 px-4 py-12 sm:grid-cols-2 md:px-8 lg:grid-cols-5"
      >
        <div class="lg:col-span-1">
          <app-brand-mark />
          <p class="mt-4 max-w-xs text-sm leading-relaxed text-slate-600">
            Der lokale Marktplatz für Oberösterreich. Kaufen, verkaufen, verschenken
            und Dienstleistungen finden.
          </p>
          <div class="mt-4 flex items-center gap-3 text-slate-500">
            <a href="#" aria-label="Facebook" class="hover:text-[#1b3a5f]">
              <app-landing-icon name="facebook" svgClass="h-5 w-5" />
            </a>
            <a href="#" aria-label="Instagram" class="hover:text-[#1b3a5f]">
              <app-landing-icon name="instagram" svgClass="h-5 w-5" />
            </a>
            <a href="#" aria-label="YouTube" class="hover:text-[#1b3a5f]">
              <app-landing-icon name="youtube" svgClass="h-5 w-5" />
            </a>
          </div>
        </div>

        <div>
          <h3 class="text-sm font-bold text-[#1b3a5f]">Service</h3>
          <ul class="mt-3 space-y-2">
            @for (link of serviceLinks; track link.label) {
              <li>
                <button
                  type="button"
                  class="text-left text-sm text-slate-600 hover:text-slate-900"
                  (click)="openDoc(link.doc)"
                >
                  {{ link.label }}
                </button>
              </li>
            }
          </ul>
        </div>

        <div>
          <h3 class="text-sm font-bold text-[#1b3a5f]">Für Unternehmen</h3>
          <ul class="mt-3 space-y-2">
            @for (link of businessLinks; track link.label) {
              <li>
                <button
                  type="button"
                  class="text-left text-sm text-slate-600 hover:text-slate-900"
                  (click)="openDoc(link.doc)"
                >
                  {{ link.label }}
                </button>
              </li>
            }
          </ul>
        </div>

        <div>
          <h3 class="text-sm font-bold text-[#1b3a5f]">Über uns</h3>
          <ul class="mt-3 space-y-2">
            @for (link of aboutLinks; track link.label) {
              <li>
                <button
                  type="button"
                  class="text-left text-sm text-slate-600 hover:text-slate-900"
                  (click)="openDoc(link.doc)"
                >
                  {{ link.label }}
                </button>
              </li>
            }
          </ul>
        </div>

        <div>
          <h3 class="text-sm font-bold text-[#1b3a5f]">NimmDa App</h3>
          <p class="mt-3 text-sm text-slate-600">Bald für iOS und Android.</p>
          <div class="mt-4 flex flex-col gap-2">
            <a
              href="#"
              class="inline-flex w-fit items-center rounded-md bg-slate-900 px-3 py-2 text-xs font-medium text-white"
            >
              App Store
            </a>
            <a
              href="#"
              class="inline-flex w-fit items-center rounded-md bg-slate-900 px-3 py-2 text-xs font-medium text-white"
            >
              Google Play
            </a>
          </div>
        </div>
      </div>
      <div
        class="container flex flex-wrap items-center justify-between gap-2 border-t border-slate-200 px-4 py-4 md:px-8"
      >
        <p class="text-xs text-slate-500">© {{ year }} NimmDa.at</p>
        <p class="inline-flex items-center gap-1 text-xs text-slate-500">
          Dein lokaler Marktplatz
          <svg class="h-3.5 w-3.5 text-[#f5c400]" viewBox="0 0 24 24" fill="currentColor">
            <path
              d="M12 21s-7-4.4-7-9.2A3.8 3.8 0 0112 8a3.8 3.8 0 017 2.8C19 15.6 12 21 12 21z"
            />
          </svg>
        </p>
      </div>
    </footer>

    @if (activeDoc(); as doc) {
      <div
        class="fixed inset-0 z-[80] flex items-end justify-center p-0 sm:items-center sm:p-4"
        role="dialog"
        aria-modal="true"
        aria-labelledby="footer-doc-title"
      >
        <button
          type="button"
          class="absolute inset-0 bg-slate-900/50"
          [attr.aria-label]="doc.title + ' schließen'"
          (click)="closeDoc()"
        ></button>
        <div
          class="relative z-10 m-0 flex max-h-[92dvh] w-full max-w-lg flex-col rounded-t-2xl bg-white shadow-xl sm:m-4 sm:rounded-2xl"
        >
          <div class="flex items-start justify-between gap-4 px-6 pt-6">
            <h2 id="footer-doc-title" class="text-xl font-extrabold text-[#1b3a5f]">
              {{ doc.title }}
            </h2>
            <button
              type="button"
              class="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              [attr.aria-label]="doc.title + ' schließen'"
              (click)="closeDoc()"
            >
              <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div class="mt-4 space-y-5 overflow-y-auto px-6 pb-6 text-sm leading-relaxed text-slate-700">
            @for (section of doc.sections; track $index) {
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
export class LandingFooterComponent {
  private readonly document = inject(DOCUMENT);
  readonly year = new Date().getFullYear();
  readonly serviceLinks = FOOTER_SERVICE_LINKS;
  readonly businessLinks = FOOTER_BUSINESS_LINKS;
  readonly aboutLinks = FOOTER_ABOUT_LINKS;
  private readonly openId = signal<FooterDocId | null>(null);
  readonly activeDoc = computed(() => {
    const id = this.openId();
    return id ? FOOTER_DOCS[id] : null;
  });

  constructor() {
    effect((onCleanup) => {
      this.document.body.classList.toggle('overflow-hidden', this.openId() !== null);
      onCleanup(() => this.document.body.classList.remove('overflow-hidden'));
    });
  }

  openDoc(id: FooterDocId): void {
    this.openId.set(id);
  }

  closeDoc(): void {
    this.openId.set(null);
  }

  onEscape(): void {
    if (this.openId()) {
      this.closeDoc();
    }
  }
}
