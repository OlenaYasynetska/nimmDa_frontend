import { Component } from '@angular/core';
import { LandingHeaderComponent } from '../../components/landing-header/landing-header.component';
import { LandingHeroComponent } from '../../components/landing-hero/landing-hero.component';
import { ActionCardsComponent } from '../../components/action-cards/action-cards.component';
import { PopularCategoriesComponent } from '../../components/popular-categories/popular-categories.component';
import { WhyUsComponent } from '../../components/why-us/why-us.component';
import { LandingFooterComponent } from '../../components/landing-footer/landing-footer.component';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [
    LandingHeaderComponent,
    LandingHeroComponent,
    ActionCardsComponent,
    PopularCategoriesComponent,
    WhyUsComponent,
    LandingFooterComponent,
  ],
  host: {
    class: 'block min-h-full w-full bg-white',
  },
  template: `
    <app-landing-header />
    <app-landing-hero />
    <app-action-cards />
    <app-popular-categories />
    <app-why-us />
    <app-landing-footer />
  `,
})
export class LandingComponent {}
