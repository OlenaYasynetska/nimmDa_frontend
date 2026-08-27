import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonComponent } from '../../../../shared/components/button/button.component';

@Component({
  standalone: true,
  selector: 'app-not-found',
  imports: [ButtonComponent],
  host: {
    class: 'flex min-h-0 min-w-0 h-full flex-1 flex-col overflow-hidden',
  },
  template: `
    <div class="flex h-full flex-1 flex-col items-center justify-center gap-4 px-4 py-10">
      <h1 class="text-3xl font-extrabold text-slate-900">Page not found</h1>
      <p class="text-sm text-slate-600">This route does not exist yet.</p>
      <app-button (click)="goHome()">Homepage</app-button>
    </div>
  `,
})
export class NotFoundComponent {
  constructor(private readonly router: Router) {}

  goHome(): void {
    void this.router.navigate(['/']);
  }
}
