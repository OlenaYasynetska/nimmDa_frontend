import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import {
  SEARCH_CATEGORIES,
  SEARCH_RADII,
} from '../../data/landing.content';

@Component({
  selector: 'app-landing-hero',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <section class="relative isolate min-h-[22rem] overflow-hidden md:min-h-[28rem] lg:min-h-[32rem]">
      <img
        src="/assets/images/Hero.png"
        alt="Linz und die Donau – Blick über Oberösterreich"
        class="absolute inset-0 h-full w-full object-cover object-center"
      />
      <div
        class="absolute inset-0 bg-gradient-to-b from-white/55 via-white/20 to-black/10"
      ></div>

      <div
        class="relative z-10 mx-auto flex min-h-[22rem] max-w-5xl flex-col items-center justify-center px-4 pb-24 pt-12 text-center md:min-h-[28rem] md:pb-28 lg:min-h-[32rem]"
      >
        <h1
          class="max-w-4xl text-3xl font-extrabold leading-tight tracking-tight text-slate-900 md:text-5xl lg:text-[3.15rem]"
        >
          Kaufen. Verkaufen. Verschenken. Dienstleistungen finden.
        </h1>
        <p class="mt-4 text-base text-slate-800 md:text-lg">
          Der lokale Marktplatz für ganz Oberösterreich.
        </p>
      </div>

      <div class="relative z-20 mx-auto -mt-10 max-w-6xl px-4 pb-2 md:-mt-12 md:px-8">
        <form
          [formGroup]="form"
          (ngSubmit)="onSearch()"
          class="grid grid-cols-1 gap-2 rounded-2xl bg-white p-3 shadow-[0_12px_40px_rgba(15,23,42,0.12)] ring-1 ring-slate-200/80 md:grid-cols-[1.4fr_1fr_1.1fr_auto_auto] md:items-center md:gap-0 md:p-2"
        >
          <label class="sr-only" for="search-query">Was suchst du?</label>
          <input
            id="search-query"
            type="search"
            formControlName="query"
            placeholder="Was suchst du?"
            class="w-full rounded-xl border-0 bg-transparent px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-0"
          />

          <label class="sr-only" for="search-category">Kategorie</label>
          <select
            id="search-category"
            formControlName="category"
            class="w-full rounded-xl border-0 bg-transparent px-3 py-3 text-sm text-slate-700 focus:outline-none md:border-l md:border-slate-200"
          >
            @for (category of categories; track category) {
              <option [value]="category">{{ category }}</option>
            }
          </select>

          <div
            class="flex items-center gap-2 px-3 py-2 md:border-l md:border-slate-200"
          >
            <svg
              class="h-4 w-4 shrink-0 text-slate-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="1.8"
              aria-hidden="true"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M12 21s7-6.2 7-11a7 7 0 10-14 0c0 4.8 7 11 7 11z"
              />
              <circle cx="12" cy="10" r="2.2" />
            </svg>
            <label class="sr-only" for="search-location">Ort oder Bezirk</label>
            <input
              id="search-location"
              type="text"
              formControlName="location"
              placeholder="Ort oder Bezirk"
              class="w-full border-0 bg-transparent py-1 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
            />
          </div>

          <label class="sr-only" for="search-radius">Umkreis</label>
          <select
            id="search-radius"
            formControlName="radius"
            class="w-full rounded-xl border-0 bg-transparent px-3 py-3 text-sm text-slate-700 focus:outline-none md:border-l md:border-slate-200"
          >
            @for (radius of radii; track radius) {
              <option [value]="radius">{{ radius }}</option>
            }
          </select>

          <button
            type="submit"
            class="rounded-xl bg-[#2f6fb2] px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-[#275d96]"
          >
            Suchen
          </button>
        </form>
      </div>
    </section>
  `,
})
export class LandingHeroComponent {
  readonly categories = SEARCH_CATEGORIES;
  readonly radii = SEARCH_RADII;

  readonly form = this.fb.nonNullable.group({
    query: [''],
    category: ['Alle Kategorien'],
    location: [''],
    radius: ['+ 25 km'],
  });

  constructor(private readonly fb: FormBuilder) {}

  onSearch(): void {
    // Search API will be wired later.
  }
}
