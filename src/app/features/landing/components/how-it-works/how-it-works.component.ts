import { Component } from '@angular/core';
import { HOW_STEPS } from '../../data/landing.content';
import { LandingIconComponent } from '../landing-icon/landing-icon.component';

@Component({
  selector: 'app-how-it-works',
  standalone: true,
  imports: [LandingIconComponent],
  template: `
    <section class="bg-[#f7f7f8]">
      <div class="container px-4 py-16 md:px-8 md:py-20">
        <h2 class="mb-12 text-center text-2xl font-extrabold text-[#1b3a5f] md:text-3xl">
          So einfach funktioniert NimmDa
        </h2>
        <div class="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          @for (item of steps; track item.step) {
            <article class="flex flex-col items-center text-center">
              <span
                class="inline-flex h-16 w-16 items-center justify-center rounded-full {{ item.circleClass }}"
              >
                <app-landing-icon [name]="item.icon" svgClass="h-7 w-7" />
              </span>
              <p class="mt-4 text-xs font-semibold tracking-wide text-slate-400">
                {{ item.step }}
              </p>
              <h3 class="mt-1 text-lg font-bold text-[#1b3a5f]">{{ item.title }}</h3>
              <p class="mt-2 max-w-xs text-sm leading-relaxed text-slate-600">
                {{ item.description }}
              </p>
            </article>
          }
        </div>
      </div>
    </section>
  `,
})
export class HowItWorksComponent {
  readonly steps = HOW_STEPS;
}
