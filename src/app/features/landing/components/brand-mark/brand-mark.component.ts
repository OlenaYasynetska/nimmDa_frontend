import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-brand-mark',
  standalone: true,
  imports: [RouterLink],
  template: `
    <a routerLink="/" class="inline-flex flex-col leading-none">
      <span class="flex text-[1.7rem] font-extrabold tracking-tight">
        <span class="text-[#1b3a5f]">Nimm</span>
        <span class="relative text-[#f5c400]">
          D<span
            class="absolute left-[0.38em] top-[0.42em] h-[0.34em] w-[0.34em] rounded-full bg-white"
            aria-hidden="true"
          ></span>a
        </span>
      </span>
      <span class="mt-1 text-[11px] font-medium text-slate-500">Dein lokaler Marktplatz.</span>
    </a>
  `,
})
export class BrandMarkComponent {}
