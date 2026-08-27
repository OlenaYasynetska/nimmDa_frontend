import { Component } from '@angular/core';
import { ACTION_CARDS } from '../../data/landing.content';
import { LandingIconComponent } from '../landing-icon/landing-icon.component';

@Component({
  selector: 'app-action-cards',
  standalone: true,
  imports: [LandingIconComponent],
  template: `
    <section class="container px-4 py-14 md:px-8 md:py-16">
      <h2 class="mb-8 text-center text-2xl font-bold text-slate-900 md:text-3xl">
        Wähle, was du tun möchtest:
      </h2>
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        @for (card of cards; track card.title) {
          <article
            class="flex flex-col items-center rounded-2xl px-4 py-6 text-center {{ card.cardClass }}"
          >
            <app-landing-icon
              [name]="card.icon"
              [svgClass]="'h-8 w-8 ' + card.iconClass"
            />
            <h3 class="mt-4 text-base font-bold text-slate-900">{{ card.title }}</h3>
            <p class="mt-1 min-h-10 text-sm text-slate-600">{{ card.description }}</p>
            <button
              type="button"
              class="mt-5 w-full rounded-md px-3 py-2 text-sm font-semibold {{ card.buttonClass }}"
            >
              {{ card.cta }}
            </button>
          </article>
        }
      </div>
    </section>
  `,
})
export class ActionCardsComponent {
  readonly cards = ACTION_CARDS;
}
