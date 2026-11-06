import { Component, computed, input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-photo-slider',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="relative bg-slate-100">
      @if (link(); as path) {
        <a [routerLink]="path" class="block">
          <img [src]="current()" [alt]="alt()" [class]="imageClass()" />
        </a>
      } @else {
        <img [src]="current()" [alt]="alt()" [class]="imageClass()" />
      }
      @if (photos().length > 1) {
        <button
          type="button"
          class="absolute left-2 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 text-xl leading-none text-[#1b3a5f] shadow"
          (click)="step(-1, $event)"
          aria-label="Vorheriges Foto"
        >
          ‹
        </button>
        <button
          type="button"
          class="absolute right-2 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 text-xl leading-none text-[#1b3a5f] shadow"
          (click)="step(1, $event)"
          aria-label="Nächstes Foto"
        >
          ›
        </button>
        <p class="pointer-events-none absolute bottom-2 right-2 rounded-full bg-black/55 px-2 py-0.5 text-[11px] font-medium text-white">
          {{ index() + 1 }} / {{ photos().length }}
        </p>
      }
    </div>
  `,
})
export class PhotoSliderComponent {
  readonly photos = input<string[]>([]);
  readonly alt = input('');
  readonly imageClass = input('h-44 w-full object-cover');
  readonly link = input<string[] | null>(null);
  private readonly cursor = signal(0);

  readonly index = computed(() => {
    const count = this.photos().length;
    if (count === 0) {
      return 0;
    }
    return ((this.cursor() % count) + count) % count;
  });

  readonly current = computed(() => this.photos()[this.index()] ?? '');

  step(delta: number, event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.cursor.update((value) => value + delta);
  }
}
