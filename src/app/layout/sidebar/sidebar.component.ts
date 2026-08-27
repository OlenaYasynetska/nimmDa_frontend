import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink],
  template: `
    <aside class="hidden w-56 shrink-0 border-r border-gray-200 bg-white p-4 md:block">
      <nav class="flex flex-col gap-2 text-sm text-slate-700">
        <a routerLink="/" class="rounded-md px-2 py-1.5 hover:bg-slate-100">Home</a>
      </nav>
    </aside>
  `,
})
export class SidebarComponent {}
