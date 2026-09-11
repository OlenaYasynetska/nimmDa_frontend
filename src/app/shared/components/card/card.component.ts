import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      class="rounded-t-2xl border border-gray-200 bg-white p-5 shadow-sm sm:rounded-xl sm:p-6 dark:border-gray-700 dark:bg-gray-800"
    >
      <ng-content />
    </div>
  `,
})
export class CardComponent {}
