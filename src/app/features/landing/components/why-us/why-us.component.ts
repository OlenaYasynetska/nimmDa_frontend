import { Component } from '@angular/core';
import { LANDING_BRAND, WHY_ITEMS } from '../../data/landing.content';
import { LandingIconComponent } from '../landing-icon/landing-icon.component';

@Component({
  selector: 'app-why-us',
  standalone: true,
  imports: [LandingIconComponent],
  template: `
    <section class="container px-4 py-16 md:px-8 md:py-20">
      <h2 class="mb-12 text-center text-2xl font-bold text-slate-900 md:text-3xl">
        Warum {{ brand }}?
      </h2>
      <div class="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
        @for (item of items; track item.title) {
          <article class="flex flex-col items-center text-center">
            <app-landing-icon
              [name]="item.icon"
              svgClass="h-10 w-10 text-slate-500"
            />
            <h3 class="mt-4 text-base font-bold text-slate-900">{{ item.title }}</h3>
            <p class="mt-2 max-w-xs text-sm leading-relaxed text-slate-600">
              {{ item.description }}
            </p>
          </article>
        }
      </div>
    </section>
  `,
})
export class WhyUsComponent {
  readonly brand = LANDING_BRAND;
  readonly items = WHY_ITEMS;
}
