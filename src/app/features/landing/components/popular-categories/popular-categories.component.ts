import { Component } from '@angular/core';
import { POPULAR_CATEGORIES } from '../../data/landing.content';
import { LandingIconComponent } from '../landing-icon/landing-icon.component';

@Component({
  selector: 'app-popular-categories',
  standalone: true,
  imports: [LandingIconComponent],
  template: `
    <section id="kategorien" class="container px-4 pb-6 md:px-8">
      <div class="mb-8 flex flex-wrap items-end justify-between gap-3">
        <h2 class="text-2xl font-bold text-slate-900 md:text-3xl">Beliebte Kategorien</h2>
        <a href="#kategorien" class="text-sm font-medium text-[#2f6fb2] hover:underline">
          Alle Kategorien anzeigen →
        </a>
      </div>
      <div class="grid grid-cols-2 gap-y-8 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        @for (category of categories; track category.name) {
          <button
            type="button"
            class="flex flex-col items-center gap-2 text-slate-700 transition hover:text-[#2f6fb2]"
          >
            <span
              class="flex h-16 w-16 items-center justify-center rounded-full text-slate-500"
            >
              <app-landing-icon [name]="category.icon" svgClass="h-9 w-9" />
            </span>
            <span class="text-sm font-medium">{{ category.name }}</span>
          </button>
        }
      </div>
    </section>
  `,
})
export class PopularCategoriesComponent {
  readonly categories = POPULAR_CATEGORIES;
}
