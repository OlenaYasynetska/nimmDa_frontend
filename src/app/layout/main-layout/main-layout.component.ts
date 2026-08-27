import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FooterComponent } from '../footer/footer.component';
import { NavbarComponent } from '../navbar/navbar.component';
import { SidebarComponent } from '../sidebar/sidebar.component';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, SidebarComponent, FooterComponent],
  host: {
    class: 'flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden',
  },
  template: `
    <app-navbar />
    <div class="flex min-h-0 w-full min-w-0 flex-1 overflow-hidden">
      <app-sidebar />
      <main class="flex min-h-0 w-full min-w-0 flex-1 flex-col overflow-y-auto bg-slate-100">
        <router-outlet />
      </main>
    </div>
    <app-footer />
  `,
})
export class MainLayoutComponent {}
