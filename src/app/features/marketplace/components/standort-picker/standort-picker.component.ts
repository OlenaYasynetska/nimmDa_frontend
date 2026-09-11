import { Component, ElementRef, computed, inject, input, output, signal } from '@angular/core';
import { parseStandort, suggestCities } from '../../data/standort';
import { LandingIconComponent } from '../../../landing/components/landing-icon/landing-icon.component';

@Component({
  selector: 'app-standort-picker',
  standalone: true,
  imports: [LandingIconComponent],
  host: {
    class: 'relative block',
    '(document:click)': 'onDocumentClick($event)',
  },
  template: `
    @if (variant() === 'header') {
      <button
        type="button"
        class="inline-flex items-center gap-1.5 rounded-lg px-2 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-[#1b3a5f]"
        (click)="toggle($event)"
        [attr.aria-expanded]="open()"
      >
        <app-landing-icon name="pin" svgClass="h-4 w-4" />
        <span>{{ displayLabel() }}</span>
        <svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 9l6 6 6-6" />
        </svg>
      </button>
    } @else {
      <input
        type="text"
        autocomplete="off"
        [id]="inputId()"
        [value]="open() ? draft() : value()"
        [placeholder]="placeholder()"
        class="block w-full rounded-xl border-0 bg-slate-100 px-3 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-200"
        (focus)="openPanel()"
        (input)="onInput($event)"
        (keydown)="onKeydown($event)"
      />
    }

    @if (open()) {
      <div
        class="absolute z-40 mt-1 max-h-72 w-full min-w-[14rem] overflow-auto rounded-xl border border-slate-100 bg-white py-1 shadow-lg"
        [class.right-0]="variant() === 'header'"
        [class.left-0]="variant() !== 'header'"
      >
        @if (variant() === 'header') {
          <div class="px-2 pb-1 pt-1">
            <input
              type="search"
              autocomplete="off"
              [value]="draft()"
              placeholder="Stadt suchen"
              class="block w-full rounded-lg border-0 bg-slate-100 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-200"
              (click)="$event.stopPropagation()"
              (input)="onInput($event)"
              (keydown)="onKeydown($event)"
            />
          </div>
        }
        @if (allowEmpty()) {
          <button
            type="button"
            class="block w-full px-3 py-2 text-left text-sm hover:bg-slate-50"
            [class.font-semibold]="!value()"
            [class.text-[#1b3a5f]]="!value()"
            [class.text-slate-700]="!!value()"
            (click)="choose('')"
          >
            {{ emptyLabel() }}
          </button>
        }
        @for (city of filtered(); track city) {
          <button
            type="button"
            class="block w-full px-3 py-2 text-left text-sm hover:bg-slate-50"
            [class.font-semibold]="isSelected(city)"
            [class.text-[#1b3a5f]]="isSelected(city)"
            [class.text-slate-700]="!isSelected(city)"
            (click)="choose(city)"
          >
            {{ city }}
          </button>
        }
        @if (customCity(); as custom) {
          <button
            type="button"
            class="block w-full px-3 py-2 text-left text-sm font-medium text-[#2f6fb2] hover:bg-slate-50"
            (click)="choose(custom)"
          >
            „{{ custom }}“ verwenden
          </button>
        }
        @if (filtered().length === 0 && !customCity()) {
          <p class="px-3 py-2 text-sm text-slate-400">Keine Stadt gefunden.</p>
        }
      </div>
    }
  `,
})
export class StandortPickerComponent {
  private readonly host = inject(ElementRef<HTMLElement>);

  readonly variant = input<'header' | 'field'>('field');
  readonly value = input('');
  readonly placeholder = input('Stadt wählen');
  readonly emptyLabel = input('Alle Orte');
  readonly allowEmpty = input(false);
  readonly extraCities = input<string[]>([]);
  readonly inputId = input('');
  readonly valueChange = output<string>();

  readonly open = signal(false);
  readonly draft = signal('');

  readonly filtered = computed(() => suggestCities(this.draft(), this.extraCities()));
  readonly customCity = computed(() => {
    const typed = this.draft().trim();
    if (typed.length < 2) {
      return '';
    }
    const exists = this.filtered().some((city) => city.toLowerCase() === typed.toLowerCase());
    return exists ? '' : parseStandort(typed);
  });

  displayLabel(): string {
    return this.value() || 'Standort';
  }

  isSelected(city: string): boolean {
    return this.value().toLowerCase() === city.toLowerCase();
  }

  toggle(event: Event): void {
    event.stopPropagation();
    this.open.update((open) => {
      const next = !open;
      if (next) {
        this.draft.set('');
      }
      return next;
    });
  }

  openPanel(): void {
    this.draft.set(this.value());
    this.open.set(true);
  }

  onInput(event: Event): void {
    this.draft.set((event.target as HTMLInputElement).value);
    this.open.set(true);
  }

  onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      event.preventDefault();
      const custom = this.customCity();
      this.choose(custom || this.filtered()[0] || parseStandort(this.draft()));
      return;
    }
    if (event.key === 'Escape') {
      this.open.set(false);
    }
  }

  choose(city: string): void {
    const next = parseStandort(city);
    this.draft.set(next);
    this.open.set(false);
    this.valueChange.emit(next);
  }

  onDocumentClick(event: Event): void {
    if (!this.host.nativeElement.contains(event.target as Node)) {
      this.open.set(false);
    }
  }
}
