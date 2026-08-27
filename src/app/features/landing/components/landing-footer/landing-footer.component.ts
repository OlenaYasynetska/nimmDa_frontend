import { Component } from '@angular/core';
import {
  FOOTER_ABOUT_LINKS,
  FOOTER_BUSINESS_LINKS,
  FOOTER_SERVICE_LINKS,
} from '../../data/landing.content';
import { BrandMarkComponent } from '../brand-mark/brand-mark.component';
import { LandingIconComponent } from '../landing-icon/landing-icon.component';

@Component({
  selector: 'app-landing-footer',
  standalone: true,
  imports: [BrandMarkComponent, LandingIconComponent],
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
                <a [href]="link.href" class="text-sm text-slate-600 hover:text-slate-900">
                  {{ link.label }}
                </a>
              </li>
            }
          </ul>
        </div>

        <div>
          <h3 class="text-sm font-bold text-[#1b3a5f]">Für Unternehmen</h3>
          <ul class="mt-3 space-y-2">
            @for (link of businessLinks; track link.label) {
              <li>
                <a [href]="link.href" class="text-sm text-slate-600 hover:text-slate-900">
                  {{ link.label }}
                </a>
              </li>
            }
          </ul>
        </div>

        <div>
          <h3 class="text-sm font-bold text-[#1b3a5f]">Über uns</h3>
          <ul class="mt-3 space-y-2">
            @for (link of aboutLinks; track link.label) {
              <li>
                <a [href]="link.href" class="text-sm text-slate-600 hover:text-slate-900">
                  {{ link.label }}
                </a>
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
  `,
})
export class LandingFooterComponent {
  readonly year = new Date().getFullYear();
  readonly serviceLinks = FOOTER_SERVICE_LINKS;
  readonly businessLinks = FOOTER_BUSINESS_LINKS;
  readonly aboutLinks = FOOTER_ABOUT_LINKS;
}
