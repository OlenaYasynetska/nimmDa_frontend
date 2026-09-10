import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ACTION_CARDS } from '../../data/landing.content';
import { useActionCardImageSize } from '../../hooks/use-action-card-image.hook';
import { LandingIconComponent } from '../landing-icon/landing-icon.component';

@Component({
  selector: 'app-action-cards',
  standalone: true,
  imports: [LandingIconComponent, RouterLink],
  template: `
    <section id="aktionen" class="container px-4 md:px-8">
      <div class="grid grid-cols-1 gap-5 lg:grid-cols-3">
        @for (card of cards; track card.title) {
          <a
            [routerLink]="card.link"
            [queryParams]="card.queryParams"
            class="flex min-h-[16.5rem] cursor-pointer overflow-hidden rounded-3xl p-6 shadow-[0_18px_44px_rgba(15,23,42,0.12)] {{ card.cardClass }}"
            [attr.id]="
              card.illustration === 'toolbox'
                ? 'services'
                : card.illustration === 'box'
                  ? 'kostenlos'
                  : null
            "
          >
            <div class="flex min-w-0 flex-1 flex-col">
              @if (card.iconSrc) {
                <img
                  [src]="card.iconSrc"
                  [alt]="card.title"
                  class="h-9 w-9 object-contain"
                />
              } @else {
                <app-landing-icon [name]="card.icon" [svgClass]="'h-9 w-9 ' + card.iconClass" />
              }
              <h2 class="mt-3 text-xl font-extrabold {{ card.titleClass }}">{{ card.title }}</h2>
              <p class="mt-2 max-w-[13.5rem] text-sm leading-relaxed text-slate-600">
                {{ card.description }}
              </p>
              <span
                class="mt-5 inline-flex w-fit items-center gap-1 rounded-lg px-4 py-2.5 text-sm font-semibold {{ card.buttonClass }}"
              >
                {{ card.cta }}
                <span aria-hidden="true">→</span>
              </span>
            </div>
            <div [class]="imageSize.wrapClass">
              @if (card.imageSrc) {
                <img
                  [src]="card.imageSrc"
                  [alt]="card.imageAlt ?? card.title"
                  [class]="imageSize.imgClass"
                />
              } @else {
                @switch (card.illustration) {
                  @case ('toolbox') {
                    <svg viewBox="0 0 140 130" [class]="imageSize.imgClass" aria-hidden="true">
                      <rect x="22" y="58" width="70" height="42" rx="8" fill="#3d6ea8" />
                      <rect x="28" y="64" width="58" height="10" rx="3" fill="#5b8ec4" />
                      <rect x="42" y="44" width="30" height="16" rx="5" fill="#2c5282" />
                      <rect x="84" y="70" width="30" height="34" rx="8" fill="#6f4ea1" />
                      <rect x="88" y="64" width="22" height="8" rx="3" fill="#8a6bb8" />
                    </svg>
                  }
                  @case ('box') {
                    <svg viewBox="0 0 140 130" [class]="imageSize.imgClass" aria-hidden="true">
                      <path d="M22 78l36-16 36 16v26l-36 14-36-14V78z" fill="#d9a441" />
                      <path
                        d="M58 62v56M22 78l36 14 36-14"
                        fill="none"
                        stroke="#b7842c"
                        stroke-width="2.5"
                      />
                      <rect x="78" y="38" width="18" height="26" rx="3" fill="#3cb371" />
                      <ellipse cx="87" cy="36" rx="13" ry="9" fill="#2f9e57" />
                      <rect x="36" y="48" width="16" height="14" rx="3" fill="#f5c400" />
                    </svg>
                  }
                }
              }
            </div>
          </a>
        }
      </div>
    </section>
  `,
})
export class ActionCardsComponent {
  readonly cards = ACTION_CARDS;
  readonly imageSize = useActionCardImageSize();
}
