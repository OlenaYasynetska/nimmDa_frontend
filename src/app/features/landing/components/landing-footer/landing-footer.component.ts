import { Component } from '@angular/core';
import {
  FOOTER_BUSINESS_LINKS,
  FOOTER_SERVICE_LINKS,
  LANDING_BRAND,
} from '../../data/landing.content';
import { LandingIconComponent } from '../landing-icon/landing-icon.component';

@Component({
  selector: 'app-landing-footer',
  standalone: true,
  imports: [LandingIconComponent],
  template: `
    <footer class="border-t border-slate-200 bg-[#f4f5f7]">
      <div
        class="container grid grid-cols-1 gap-10 px-4 py-12 md:grid-cols-2 md:px-8 lg:grid-cols-4"
      >
        <div>
          <h3 class="text-sm font-bold text-slate-900">Über uns</h3>
          <p class="mt-3 text-sm leading-relaxed text-slate-600">
            {{ brand }} verbindet Menschen in der Region: kaufen, verkaufen,
            verschenken und Dienstleistungen finden – lokal und unkompliziert.
          </p>
          <a href="#" class="mt-3 inline-block text-sm font-medium text-[#2f6fb2] hover:underline">
            Mehr über uns
          </a>
        </div>

        <div>
          <h3 class="text-sm font-bold text-slate-900">Service</h3>
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
          <h3 class="text-sm font-bold text-slate-900">Für Unternehmen</h3>
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
          <h3 class="text-sm font-bold text-slate-900">Folge uns</h3>
          <div class="mt-3 flex items-center gap-3 text-slate-500">
            <a href="#" aria-label="Facebook" class="hover:text-[#2f6fb2]">
              <app-landing-icon name="facebook" svgClass="h-5 w-5" />
            </a>
            <a href="#" aria-label="Instagram" class="hover:text-[#2f6fb2]">
              <app-landing-icon name="instagram" svgClass="h-5 w-5" />
            </a>
            <a href="#" aria-label="YouTube" class="hover:text-[#2f6fb2]">
              <app-landing-icon name="youtube" svgClass="h-5 w-5" />
            </a>
          </div>
          <div class="mt-5 flex flex-col gap-2">
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
      <p class="border-t border-slate-200 px-4 py-4 text-center text-xs text-slate-500">
        © {{ year }} {{ brand }}. Alle Rechte vorbehalten.
      </p>
    </footer>
  `,
})
export class LandingFooterComponent {
  readonly brand = LANDING_BRAND;
  readonly year = new Date().getFullYear();
  readonly serviceLinks = FOOTER_SERVICE_LINKS;
  readonly businessLinks = FOOTER_BUSINESS_LINKS;
}
