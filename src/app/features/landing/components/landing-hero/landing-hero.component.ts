import { Component } from '@angular/core';
import { HERO_USPS } from '../../data/landing.content';
import { LandingIconComponent } from '../landing-icon/landing-icon.component';

@Component({
  selector: 'app-landing-hero',
  standalone: true,
  imports: [LandingIconComponent],
  template: `
    <section id="standort" class="relative overflow-hidden bg-white">
      <div class="relative h-[28.8rem] sm:h-[34.2rem] lg:h-[39.6rem]">
        <img
          src="/assets/images/Hero.png"
          alt="Linz und die Donau – Blick über Oberösterreich"
          class="absolute inset-0 h-full w-full object-cover object-bottom"
        />
        <div
          class="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.88)_0%,rgba(255,255,255,0.55)_22%,rgba(255,255,255,0.12)_48%,rgba(255,255,255,0)_62%)]"
        ></div>
        <div
          class="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-white/50 to-transparent"
        ></div>

        <div class="relative z-10 flex h-full items-start">
          <div class="container px-4 pt-8 md:px-8 md:pt-10">
            <div class="max-w-xl">
              <h1
                class="text-4xl font-extrabold leading-[1.12] tracking-tight text-[#1b3a5f] md:text-5xl lg:text-[3.35rem]"
              >
                Was du brauchst.<br />Gleich nebenan.
              </h1>
              <p class="mt-4 text-base text-slate-700 md:text-lg">
                Kaufen, verkaufen, Dienstleistungen finden oder Dinge kostenlos abgeben.
              </p>
              <ul class="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm font-medium text-slate-700">
                @for (usp of usps; track usp.label) {
                  <li class="inline-flex items-center gap-2">
                    <app-landing-icon [name]="usp.icon" [svgClass]="'h-4 w-4 ' + usp.iconClass" />
                    {{ usp.label }}
                  </li>
                }
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
})
export class LandingHeroComponent {
  readonly usps = HERO_USPS;
}
