import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { categoryListingsPath, POPULAR_CATEGORIES } from '../../data/landing.content';
import { StandortService } from '../../../marketplace/services/standort.service';
import { LandingIconComponent } from '../landing-icon/landing-icon.component';

@Component({
  selector: 'app-popular-categories',
  standalone: true,
  imports: [LandingIconComponent, RouterLink],
  template: `
    <section id="kategorien" class="container px-4 pb-14 pt-4 md:px-8 md:pb-16">
      <div class="mb-8 flex flex-wrap items-end justify-between gap-3">
        <h2 class="text-2xl font-extrabold text-[#1b3a5f] md:text-3xl">Beliebte Kategorien</h2>
        <a routerLink="/anzeigen" [queryParams]="standort.queryParams()" class="text-sm font-medium text-[#2f6fb2] hover:underline">
          Alle Kategorien anzeigen →
        </a>
      </div>
      <div class="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        @for (category of categories; track category.slug) {
          <a
            [routerLink]="categoryListingsPath(category)"
            [queryParams]="standort.queryParams()"
            class="flex min-h-[7.5rem] flex-col items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white px-3 py-5 text-slate-800 transition hover:-translate-y-0.5 hover:shadow-sm"
          >
            @if (category.iconSrc) {
              <img
                [src]="category.iconSrc"
                [alt]="category.name"
                class="h-10 w-10 object-contain"
              />
            } @else {
              <app-landing-icon [name]="category.icon" [svgClass]="'h-8 w-8 ' + category.iconClass" />
            }
            <span class="text-center text-sm font-medium">{{ category.name }}</span>
          </a>
        }
      </div>
    </section>
  `,
})
export class PopularCategoriesComponent {
  readonly categories = POPULAR_CATEGORIES;
  readonly categoryListingsPath = categoryListingsPath;
  readonly standort = inject(StandortService);
}
