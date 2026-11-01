import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      class="rounded-t-2xl border border-[#efe6d6] bg-[#faf6ef] p-5 shadow-sm [color-scheme:light] sm:rounded-xl sm:p-6"
    >
      <ng-content />
    </div>
  `,
})
export class CardComponent {}
