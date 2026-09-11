import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LandingHeaderComponent } from '../../components/landing-header/landing-header.component';
import { LandingHeroComponent } from '../../components/landing-hero/landing-hero.component';
import { ActionCardsComponent } from '../../components/action-cards/action-cards.component';
import { PopularCategoriesComponent } from '../../components/popular-categories/popular-categories.component';
import { HowItWorksComponent } from '../../components/how-it-works/how-it-works.component';
import { LandingFooterComponent } from '../../components/landing-footer/landing-footer.component';

@Component({
  selector: 'app-empty-outlet',
  standalone: true,
  template: '',
})
export class EmptyOutletComponent {}

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [
    RouterOutlet,
    LandingHeaderComponent,
    LandingHeroComponent,
    ActionCardsComponent,
    PopularCategoriesComponent,
    HowItWorksComponent,
    LandingFooterComponent,
  ],
  host: {
    class: 'block min-h-full w-full bg-white',
  },
  template: `
    <app-landing-header />
    <div class="relative">
      <app-landing-hero />
      <div class="pointer-events-none absolute inset-x-0 bottom-0 z-20 translate-y-[90%]">
        <div class="pointer-events-auto">
          <app-action-cards />
        </div>
      </div>
    </div>
    <div class="pt-48 sm:pt-64 md:pt-72">
      <app-popular-categories />
    </div>
    <app-how-it-works />
    <app-landing-footer />
    <router-outlet />
  `,
})
export class LandingComponent {}
